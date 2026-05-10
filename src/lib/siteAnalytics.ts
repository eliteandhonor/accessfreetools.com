import { createHash, randomUUID } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

export const ANALYTICS_OPT_OUT_KEY = 'access-free-tools-analytics-opt-out';

const DEFAULT_TIME_ZONE = 'Australia/Brisbane';
const MAX_EVENT_BYTES = 8192;
const MAX_READ_LINES = 120000;
const ANALYTICS_DIR = resolve(process.env.AFT_ANALYTICS_DIR ?? '.local/analytics');
const ANALYTICS_EVENTS_PATH = join(ANALYTICS_DIR, 'events.ndjson');
const BOT_USER_AGENT_PATTERN =
  /bot|crawler|spider|preview|facebookexternalhit|meta-externalagent|slurp|bingpreview|duckduckbot|baiduspider|yandex|semrush|ahrefs|mj12bot|dotbot|petalbot|uptime|monitor|validator|lighthouse|pagespeed|headless|python-requests|curl|wget/i;

export type AnalyticsEventType = 'page_view' | 'tool_action';

export interface AnalyticsPayload {
  action?: string;
  category?: string;
  language?: string;
  pagePath?: string;
  pageTitle?: string;
  referrer?: string;
  screenHeight?: number;
  screenWidth?: number;
  sessionId?: string;
  timezoneOffset?: number;
  toolName?: string;
  toolSlug?: string;
  type?: AnalyticsEventType;
  visitorId?: string;
}

export interface StoredAnalyticsEvent {
  action?: string;
  browser: string;
  category?: string;
  day: string;
  device: string;
  eventId: string;
  ipHash: string;
  language?: string;
  os: string;
  pagePath: string;
  pageTitle?: string;
  referrerHost?: string;
  referrerPath?: string;
  screenHeight?: number;
  screenWidth?: number;
  sessionHash: string;
  toolName?: string;
  toolSlug?: string;
  ts: string;
  type: AnalyticsEventType;
  visitorHash: string;
}

export interface AnalyticsSummary {
  activeVisitors: number;
  allTime: {
    events: number;
    pageViews: number;
    toolActions: number;
    visitors: number;
  };
  days: number;
  generatedAt: string;
  rangeStart: string;
  recentEvents: StoredAnalyticsEvent[];
  returningVisitorsToday: number;
  timeZone: string;
  today: {
    events: number;
    newVisitors: number;
    pageViews: number;
    returningVisitors: number;
    toolActions: number;
    visitors: number;
  };
  topPages: SummaryRow[];
  topReferrers: SummaryRow[];
  topTools: ToolSummaryRow[];
}

export interface SummaryRow {
  count: number;
  label: string;
  path?: string;
}

export interface ToolSummaryRow extends SummaryRow {
  slug: string;
}

function cleanText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function cleanPath(value: unknown) {
  const rawValue = cleanText(value, 500);
  if (!rawValue || rawValue.startsWith('/api/') || rawValue.startsWith('/admin/')) return '';

  try {
    if (rawValue.startsWith('http://') || rawValue.startsWith('https://')) {
      const url = new URL(rawValue);
      return `${url.pathname}${url.search}`.slice(0, 500);
    }
  } catch {
    return '';
  }

  return rawValue.startsWith('/') ? rawValue : '';
}

let cachedAnalyticsConfig: Record<string, string> | undefined;

function parseAnalyticsConfig(text: string) {
  const values: Record<string, string> = {};

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || !line.includes('=')) continue;

    const [rawKey, ...rawValueParts] = line.split('=');
    const key = rawKey.trim();
    if (!/^[A-Z][A-Z0-9_]*$/.test(key)) continue;

    let value = rawValueParts.join('=').trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values[key] = value;
  }

  return values;
}

function getAnalyticsConfig() {
  if (cachedAnalyticsConfig) return cachedAnalyticsConfig;

  cachedAnalyticsConfig = {};
  const configPaths = [
    process.env.AFT_ANALYTICS_CONFIG,
    resolve('.analytics/config.env'),
    resolve('.local/analytics-dashboard.env'),
  ].filter(Boolean) as string[];

  for (const path of configPaths) {
    if (!existsSync(path)) continue;
    Object.assign(cachedAnalyticsConfig, parseAnalyticsConfig(readFileSync(path, 'utf8')));
  }

  return cachedAnalyticsConfig;
}

function analyticsEnv(name: string, fallback = '') {
  const envValue = process.env[name];
  if (envValue) return envValue;
  return getAnalyticsConfig()[name] || fallback;
}

function dayKey(date: Date, timeZone = DEFAULT_TIME_ZONE) {
  return new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone,
    year: 'numeric',
  }).format(date);
}

function hashValue(value: string) {
  const salt = analyticsEnv(
    'AFT_ANALYTICS_SALT',
    analyticsEnv('AFT_ANALYTICS_TOKEN', 'access-free-tools-local-analytics'),
  );
  return createHash('sha256').update(`${salt}:${value}`).digest('hex').slice(0, 32);
}

function getClientIp(request: Request, clientAddress?: string) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp = request.headers.get('x-real-ip')?.trim();
  const cfIp = request.headers.get('cf-connecting-ip')?.trim();
  return cfIp || realIp || forwardedFor || clientAddress || 'unknown';
}

function getExcludedIps() {
  return new Set(
    analyticsEnv('AFT_ANALYTICS_EXCLUDE_IPS')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  );
}

function parseReferrer(value: string) {
  if (!value) return {};

  try {
    const url = new URL(value);
    if (url.hostname === 'accessfreetools.com' || url.hostname.endsWith('.accessfreetools.com')) {
      return {};
    }

    return {
      referrerHost: url.hostname.slice(0, 120),
      referrerPath: url.pathname.slice(0, 180),
    };
  } catch {
    return {};
  }
}

function detectDevice(userAgent: string) {
  if (/tablet|ipad/i.test(userAgent)) return 'tablet';
  if (/mobi|android|iphone|phone/i.test(userAgent)) return 'mobile';
  return 'desktop';
}

function detectBrowser(userAgent: string) {
  if (/edg\//i.test(userAgent)) return 'Edge';
  if (/firefox\//i.test(userAgent)) return 'Firefox';
  if (/chrome\//i.test(userAgent)) return 'Chrome';
  if (/safari\//i.test(userAgent)) return 'Safari';
  return 'Other';
}

function detectOs(userAgent: string) {
  if (/windows/i.test(userAgent)) return 'Windows';
  if (/android/i.test(userAgent)) return 'Android';
  if (/iphone|ipad|ios/i.test(userAgent)) return 'iOS';
  if (/mac os|macintosh/i.test(userAgent)) return 'macOS';
  if (/linux/i.test(userAgent)) return 'Linux';
  return 'Other';
}

function isAllowedEventType(value: unknown): value is AnalyticsEventType {
  return value === 'page_view' || value === 'tool_action';
}

export function isAnalyticsAdminConfigured() {
  return Boolean(analyticsEnv('AFT_ANALYTICS_TOKEN', analyticsEnv('ADMIN_ANALYTICS_TOKEN')));
}

export function isAnalyticsAdminToken(value: string) {
  const configuredToken = analyticsEnv('AFT_ANALYTICS_TOKEN', analyticsEnv('ADMIN_ANALYTICS_TOKEN'));
  return Boolean(configuredToken && value && configuredToken === value);
}

export async function recordAnalyticsEvent(payload: AnalyticsPayload, request: Request, clientAddress?: string) {
  if (analyticsEnv('AFT_ANALYTICS_ENABLED', 'true').toLowerCase() === 'false') {
    return { ignored: true, reason: 'disabled' };
  }

  const rawText = JSON.stringify(payload);
  if (rawText.length > MAX_EVENT_BYTES) {
    return { ignored: true, reason: 'payload-too-large' };
  }

  const userAgent = request.headers.get('user-agent') ?? '';
  if (!userAgent || BOT_USER_AGENT_PATTERN.test(userAgent)) {
    return { ignored: true, reason: 'bot' };
  }

  const clientIp = getClientIp(request, clientAddress);
  if (getExcludedIps().has(clientIp)) {
    return { ignored: true, reason: 'excluded-ip' };
  }

  const type = isAllowedEventType(payload.type) ? payload.type : 'page_view';
  const pagePath = cleanPath(payload.pagePath);
  if (!pagePath) {
    return { ignored: true, reason: 'bad-path' };
  }

  const now = new Date();
  const visitorInput = cleanText(payload.visitorId, 120) || `${clientIp}:${userAgent}`;
  const sessionInput = cleanText(payload.sessionId, 120) || visitorInput;
  const referrer = parseReferrer(cleanText(payload.referrer, 800));
  const event: StoredAnalyticsEvent = {
    ...referrer,
    action: cleanText(payload.action, 80) || undefined,
    browser: detectBrowser(userAgent),
    category: cleanText(payload.category, 80) || undefined,
    day: dayKey(now),
    device: detectDevice(userAgent),
    eventId: randomUUID(),
    ipHash: hashValue(clientIp),
    language: cleanText(payload.language, 40) || undefined,
    os: detectOs(userAgent),
    pagePath,
    pageTitle: cleanText(payload.pageTitle, 180) || undefined,
    screenHeight: Number.isFinite(payload.screenHeight) ? Number(payload.screenHeight) : undefined,
    screenWidth: Number.isFinite(payload.screenWidth) ? Number(payload.screenWidth) : undefined,
    sessionHash: hashValue(sessionInput),
    toolName: cleanText(payload.toolName, 120) || undefined,
    toolSlug: cleanText(payload.toolSlug, 120) || undefined,
    ts: now.toISOString(),
    type,
    visitorHash: hashValue(visitorInput),
  };

  await mkdir(dirname(ANALYTICS_EVENTS_PATH), { recursive: true });
  await writeFile(ANALYTICS_EVENTS_PATH, `${JSON.stringify(event)}\n`, { flag: 'a' });
  return { ignored: false, eventId: event.eventId };
}

export async function readAnalyticsEvents() {
  let text = '';

  try {
    text = await readFile(ANALYTICS_EVENTS_PATH, 'utf8');
  } catch {
    return [];
  }

  const lines = text.trim().split('\n').filter(Boolean).slice(-MAX_READ_LINES);
  const events: StoredAnalyticsEvent[] = [];

  for (const line of lines) {
    try {
      const parsed = JSON.parse(line) as StoredAnalyticsEvent;
      if (parsed.ts && parsed.type && parsed.pagePath && parsed.visitorHash) {
        events.push(parsed);
      }
    } catch {
      // Skip damaged lines rather than losing the whole report.
    }
  }

  return events.sort((left, right) => left.ts.localeCompare(right.ts));
}

function incrementMap(map: Map<string, SummaryRow>, key: string, label = key, path?: string) {
  const current = map.get(key) ?? { count: 0, label, path };
  current.count += 1;
  map.set(key, current);
}

function topRows(map: Map<string, SummaryRow>, limit: number) {
  return [...map.values()].sort((left, right) => right.count - left.count || left.label.localeCompare(right.label)).slice(0, limit);
}

export async function summarizeAnalytics(options: { days?: number; now?: Date } = {}): Promise<AnalyticsSummary> {
  const days = Math.max(1, Math.min(365, options.days ?? 30));
  const timeZone = analyticsEnv('AFT_ANALYTICS_TIME_ZONE', DEFAULT_TIME_ZONE);
  const now = options.now ?? new Date();
  const rangeStartTime = now.getTime() - days * 24 * 60 * 60 * 1000;
  const activeStartTime = now.getTime() - 10 * 60 * 1000;
  const todayKey = dayKey(now, timeZone);
  const events = await readAnalyticsEvents();
  const eventsInRange = events.filter((event) => new Date(event.ts).getTime() >= rangeStartTime);
  const eventsToday = events.filter((event) => event.day === todayKey);
  const firstSeen = new Map<string, string>();

  for (const event of events) {
    if (!firstSeen.has(event.visitorHash)) {
      firstSeen.set(event.visitorHash, event.day);
    }
  }

  const todayVisitors = new Set(eventsToday.map((event) => event.visitorHash));
  const activeVisitors = new Set(
    events.filter((event) => new Date(event.ts).getTime() >= activeStartTime).map((event) => event.visitorHash),
  );
  const topPages = new Map<string, SummaryRow>();
  const topTools = new Map<string, ToolSummaryRow>();
  const topReferrers = new Map<string, SummaryRow>();

  for (const event of eventsInRange) {
    if (event.type === 'page_view') {
      incrementMap(topPages, event.pagePath, event.pageTitle || event.pagePath, event.pagePath);
    }

    if (event.type === 'tool_action' && event.toolSlug) {
      const current = topTools.get(event.toolSlug) ?? {
        count: 0,
        label: event.toolName || event.toolSlug,
        path: `/tools/${event.toolSlug}/`,
        slug: event.toolSlug,
      };
      current.count += 1;
      topTools.set(event.toolSlug, current);
    }

    if (event.referrerHost) {
      incrementMap(topReferrers, event.referrerHost, event.referrerHost);
    }
  }

  const newVisitorsToday = [...todayVisitors].filter((visitorHash) => firstSeen.get(visitorHash) === todayKey).length;
  const returningVisitorsToday = Math.max(0, todayVisitors.size - newVisitorsToday);

  return {
    activeVisitors: activeVisitors.size,
    allTime: {
      events: events.length,
      pageViews: events.filter((event) => event.type === 'page_view').length,
      toolActions: events.filter((event) => event.type === 'tool_action').length,
      visitors: new Set(events.map((event) => event.visitorHash)).size,
    },
    days,
    generatedAt: now.toISOString(),
    rangeStart: new Date(rangeStartTime).toISOString(),
    recentEvents: events.slice(-30).reverse(),
    returningVisitorsToday,
    timeZone,
    today: {
      events: eventsToday.length,
      newVisitors: newVisitorsToday,
      pageViews: eventsToday.filter((event) => event.type === 'page_view').length,
      returningVisitors: returningVisitorsToday,
      toolActions: eventsToday.filter((event) => event.type === 'tool_action').length,
      visitors: todayVisitors.size,
    },
    topPages: topRows(topPages, 20),
    topReferrers: topRows(topReferrers, 20),
    topTools: [...topTools.values()].sort((left, right) => right.count - left.count || left.label.localeCompare(right.label)).slice(0, 25),
  };
}
