import { createHash, randomUUID } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { mkdir, open, readdir, rename, rm, stat, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

export const ANALYTICS_OPT_OUT_KEY = 'access-free-tools-analytics-opt-out';

const DEFAULT_TIME_ZONE = 'Australia/Brisbane';
const MAX_EVENT_BYTES = 8192;
const MAX_READ_LINES = 120000;
const MAX_ANALYTICS_FILE_BYTES = 25 * 1024 * 1024;
const MAX_ANALYTICS_TAIL_BYTES = 16 * 1024 * 1024;
const MAX_READ_FILES = 32;
const ANALYTICS_ARCHIVE_RETENTION_MS = 90 * 24 * 60 * 60 * 1000;
const ANALYTICS_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const ANALYTICS_RATE_LIMIT_MAX_PER_IP = 120;
const ANALYTICS_RATE_LIMIT_MAX_GLOBAL = 5000;
const MAX_RATE_LIMIT_BUCKETS = 10000;
const analyticsRateLimitBuckets = new Map<string, { count: number; resetAt: number }>();
let globalAnalyticsRateLimit = { count: 0, resetAt: 0 };
let analyticsWriteQueue = Promise.resolve();
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

export interface AnalyticsCoverage {
  status: 'partial' | 'unknown';
  retainedRead: 'complete' | 'partial';
  reasons: string[];
  requestedStart: string;
  requestedEnd: string;
  observedStart: string | null;
  observedEnd: string | null;
  rangeObservedStart: string | null;
  rangeObservedEnd: string | null;
  deploymentContinuity: 'unknown';
  comparisonsAllowed: false;
  allTimeScope: 'retained-events-only';
  visitorClassification: 'observed-history-only';
  filesAvailable: number;
  filesRead: number;
  bytesRead: number;
  limits: { tailBytesPerFile: number; events: number; files: number };
}

export interface AnalyticsSummary {
  activeVisitors: number;
  coverage: AnalyticsCoverage;
  // Compatibility key, not lifetime totals. See coverage.allTimeScope.
  allTime: {
    events: number;
    pageViews: number;
    toolActions: number;
    visitors: number;
  };
  days: number;
  generatedAt: string;
  ownerExclusionConfigured: boolean;
  range: {
    events: number;
    pageViews: number;
    returningVisitors: number;
    toolActions: number;
    visitors: number;
  };
  rangeStart: string;
  recentEvents: StoredAnalyticsEvent[];
  returningVisitorsToday: number;
  selectedToolActions: ToolActionSummaryRow[];
  selectedToolAudience: ToolAudienceSummary | null;
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

export interface ToolActionSummaryRow {
  action: string;
  count: number;
  slug: string;
}

export interface ToolAudienceSummary {
  pageViews: number;
  sessions: number;
  slug: string;
  visitors: number;
}

function cleanText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export function sanitizeAnalyticsPath(value: unknown) {
  const rawValue = typeof value === 'string' ? value.trim() : '';
  if (!rawValue || rawValue.length > 500 || !/^(\/|https?:\/\/)/i.test(rawValue)) return '';
  try {
    const base = 'https://accessfreetools.com';
    const normalizePath = (path: string) => {
      for (let pass = 0; pass < 3 && path.includes('%'); pass += 1) path = decodeURIComponent(path);
      if (path.includes('%')) throw new Error('Ambiguous encoded analytics path');
      return new URL(`${base}${path.replace(/\\/g, '/').replace(/\/{2,}/g, '/')}`).pathname;
    };
    const paths = [normalizePath(new URL(rawValue, base).pathname)];
    // A tracker pathname beginning // must not lose its private segment as a URL authority.
    if (rawValue.startsWith('/')) paths.push(normalizePath(new URL(`${base}${rawValue}`).pathname));
    if (paths.some((path) => /^\/(admin|api|mcp|private-analytics)(\/|$)/i.test(path))) return '';
    return paths[0];
  } catch {
    return '';
  }
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
  const homeDir = process.env.HOME?.trim() || homedir();
  const configPaths = [
    process.env.AFT_ANALYTICS_CONFIG,
    resolve('.analytics/config.env'),
    resolve('.local/analytics-dashboard.env'),
    resolve('.local/accessfreetools-analytics.env'),
    homeDir ? resolve(homeDir, '.local/accessfreetools-analytics.env') : '',
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

interface AnalyticsDirectoryOptions {
  configuredDir?: string;
  cwd?: string;
  homeConfigExists?: boolean;
  homeDir?: string;
}

export function resolveAnalyticsDirectory(options: AnalyticsDirectoryOptions = {}) {
  const cwd = options.cwd ?? process.cwd();
  const configuredDir = options.configuredDir?.trim();
  if (configuredDir) return resolve(cwd, configuredDir);

  const homeDir = options.homeDir ?? homedir();
  const homeConfigPath = homeDir ? resolve(homeDir, '.local/accessfreetools-analytics.env') : '';
  const homeConfigExists = options.homeConfigExists ?? Boolean(homeConfigPath && existsSync(homeConfigPath));

  if (homeDir && homeConfigExists) return resolve(homeDir, '.local/accessfreetools-analytics');
  return resolve(cwd, '.local/analytics');
}

const ANALYTICS_DIR = resolveAnalyticsDirectory({ configuredDir: analyticsEnv('AFT_ANALYTICS_DIR') });
const ANALYTICS_EVENTS_PATH = join(ANALYTICS_DIR, 'events.ndjson');

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

function pruneRateLimitBuckets(now: number) {
  if (analyticsRateLimitBuckets.size < MAX_RATE_LIMIT_BUCKETS) return;

  for (const [key, bucket] of analyticsRateLimitBuckets) {
    if (bucket.resetAt <= now) analyticsRateLimitBuckets.delete(key);
  }

  while (analyticsRateLimitBuckets.size >= MAX_RATE_LIMIT_BUCKETS) {
    const oldestKey = analyticsRateLimitBuckets.keys().next().value;
    if (typeof oldestKey !== 'string') break;
    analyticsRateLimitBuckets.delete(oldestKey);
  }
}

export function isAnalyticsRequestRateLimited(request: Request, clientAddress?: string) {
  const now = Date.now();

  if (globalAnalyticsRateLimit.resetAt <= now) {
    globalAnalyticsRateLimit = { count: 0, resetAt: now + ANALYTICS_RATE_LIMIT_WINDOW_MS };
  }
  globalAnalyticsRateLimit.count += 1;
  if (globalAnalyticsRateLimit.count > ANALYTICS_RATE_LIMIT_MAX_GLOBAL) return true;

  pruneRateLimitBuckets(now);
  const key = getClientIp(request, clientAddress);
  const bucket = analyticsRateLimitBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    analyticsRateLimitBuckets.set(key, { count: 1, resetAt: now + ANALYTICS_RATE_LIMIT_WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > ANALYTICS_RATE_LIMIT_MAX_PER_IP;
}

async function pruneAnalyticsArchives() {
  const cutoff = Date.now() - ANALYTICS_ARCHIVE_RETENTION_MS;
  const entries = await readdir(ANALYTICS_DIR, { withFileTypes: true }).catch(() => []);

  await Promise.all(
    entries
      .filter((entry) => entry.isFile() && /^events-.*\.ndjson$/i.test(entry.name))
      .map(async (entry) => {
        const path = join(ANALYTICS_DIR, entry.name);
        const details = await stat(path).catch(() => null);
        if (details && details.mtimeMs < cutoff) await rm(path, { force: true });
      }),
  );
}

async function rotateAnalyticsLogIfNeeded() {
  const details = await stat(ANALYTICS_EVENTS_PATH).catch(() => null);
  if (!details || details.size < MAX_ANALYTICS_FILE_BYTES) return;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await rename(ANALYTICS_EVENTS_PATH, join(ANALYTICS_DIR, `events-${timestamp}.ndjson`));
  await pruneAnalyticsArchives();
}

async function appendAnalyticsEvent(event: StoredAnalyticsEvent) {
  const write = analyticsWriteQueue.catch(() => {}).then(async () => {
    await mkdir(dirname(ANALYTICS_EVENTS_PATH), { recursive: true });
    await rotateAnalyticsLogIfNeeded();
    await writeFile(ANALYTICS_EVENTS_PATH, `${JSON.stringify(event)}\n`, { flag: 'a' });
  });
  analyticsWriteQueue = write;
  await write;
}

interface AnalyticsEventFile {
  path: string;
  mtimeMs: number;
  size: number;
  ino: number;
}

async function readFileTail(file: AnalyticsEventFile, reasons: Set<string>) {
  const handle = await open(file.path, 'r');
  try {
    const details = await handle.stat();
    if (details.ino !== file.ino || details.size !== file.size || details.mtimeMs !== file.mtimeMs) {
      reasons.add('files-changed-during-read');
    }
    const length = Math.min(details.size, MAX_ANALYTICS_TAIL_BYTES);
    const start = Math.max(0, details.size - length);
    if (start > 0) reasons.add('file-tail-limit');
    const buffer = Buffer.alloc(length);
    const { bytesRead } = await handle.read(buffer, 0, length, start);
    if (bytesRead !== length) reasons.add('short-read');
    const after = await handle.stat();
    if (after.size !== details.size || after.mtimeMs !== details.mtimeMs) reasons.add('files-changed-during-read');
    let text = buffer.subarray(0, bytesRead).toString('utf8');
    if (start > 0) text = text.includes('\n') ? text.slice(text.indexOf('\n') + 1) : '';
    return { text, bytesRead };
  } finally {
    await handle.close();
  }
}

async function analyticsEventFiles(reasons: Set<string>) {
  const entries = await readdir(ANALYTICS_DIR, { withFileTypes: true }).catch((error: NodeJS.ErrnoException) => {
    if (error.code !== 'ENOENT') reasons.add('directory-read-failed');
    return [];
  });
  const files = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && /^events(?:-.*)?\.ndjson$/i.test(entry.name))
      .map(async (entry) => {
        const path = join(ANALYTICS_DIR, entry.name);
        const details = await stat(path).catch(() => { reasons.add('file-stat-failed'); return null; });
        return details ? { path, mtimeMs: details.mtimeMs, size: details.size, ino: details.ino } : null;
      }),
  );

  return files
    .filter((file): file is AnalyticsEventFile => Boolean(file))
    .sort((left, right) => right.mtimeMs - left.mtimeMs || left.path.localeCompare(right.path));
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
  const pagePath = sanitizeAnalyticsPath(payload.pagePath);
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

  await appendAnalyticsEvent(event);
  return { ignored: false, eventId: event.eventId };
}

async function readAnalyticsSnapshot() {
  const events: StoredAnalyticsEvent[] = [];
  const reasons = new Set<string>();
  let filesRead = 0;
  let bytesRead = 0;
  await pruneAnalyticsArchives().catch(() => { reasons.add('archive-prune-failed'); });
  const files = await analyticsEventFiles(reasons);

  for (const file of files) {
    if (events.length >= MAX_READ_LINES) { reasons.add('event-limit'); break; }
    if (filesRead >= MAX_READ_FILES) { reasons.add('file-count-limit'); break; }
    filesRead += 1;
    const tail = await readFileTail(file, reasons).catch(() => { reasons.add('file-read-failed'); return null; });
    if (!tail) continue;
    bytesRead += tail.bytesRead;
    // Walk backwards without allocating an array for every newline in a large tail.
    let end = tail.text.length;
    while (end > 0) {
      const start = tail.text.lastIndexOf('\n', end - 1);
      const line = tail.text.slice(start + 1, end).trim();
      end = start < 0 ? 0 : start;
      if (!line) continue;
      if (events.length >= MAX_READ_LINES) { reasons.add('event-limit'); break; }
      try {
        const parsed = JSON.parse(line) as StoredAnalyticsEvent;
        if (!parsed || !Number.isFinite(Date.parse(parsed.ts)) || !isAllowedEventType(parsed.type) ||
            typeof parsed.pagePath !== 'string' || typeof parsed.visitorHash !== 'string' || !parsed.visitorHash) {
          reasons.add('invalid-event-records');
          continue;
        }
        const pagePath = sanitizeAnalyticsPath(parsed.pagePath);
        if (pagePath) events.push({ ...parsed, pagePath, ts: new Date(parsed.ts).toISOString() });
      } catch {
        reasons.add('invalid-event-records');
      }
    }
  }
  if (JSON.stringify(files) !== JSON.stringify(await analyticsEventFiles(reasons))) reasons.add('files-changed-during-read');
  return { events: events.sort((left, right) => left.ts.localeCompare(right.ts)), reasons, filesRead, bytesRead, filesAvailable: files.length };
}

export async function readAnalyticsEvents() {
  return (await readAnalyticsSnapshot()).events;
}

function incrementMap(map: Map<string, SummaryRow>, key: string, label = key, path?: string) {
  const current = map.get(key) ?? { count: 0, label, path };
  current.count += 1;
  map.set(key, current);
}

function topRows(map: Map<string, SummaryRow>, limit: number) {
  return [...map.values()].sort((left, right) => right.count - left.count || left.label.localeCompare(right.label)).slice(0, limit);
}

export function summarizeSelectedToolAnalytics(events: StoredAnalyticsEvent[], toolSlug = '') {
  const cleanSlug = cleanText(toolSlug, 120);
  if (!cleanSlug) {
    return { actions: [] as ToolActionSummaryRow[], audience: null as ToolAudienceSummary | null };
  }

  const toolPath = `/tools/${cleanSlug}/`;
  const matchingEvents = events.filter(
    (event) => event.toolSlug === cleanSlug || (event.type === 'page_view' && event.pagePath === toolPath),
  );
  const actionCounts = new Map<string, number>();

  for (const event of matchingEvents) {
    if (event.type !== 'tool_action' || event.toolSlug !== cleanSlug || !event.action) continue;
    actionCounts.set(event.action, (actionCounts.get(event.action) ?? 0) + 1);
  }

  return {
    actions: [...actionCounts.entries()]
      .map(([action, count]) => ({ action, count, slug: cleanSlug }))
      .sort((left, right) => right.count - left.count || left.action.localeCompare(right.action)),
    audience: {
      pageViews: matchingEvents.filter((event) => event.type === 'page_view' && event.pagePath === toolPath).length,
      sessions: new Set(matchingEvents.map((event) => event.sessionHash).filter(Boolean)).size,
      slug: cleanSlug,
      visitors: new Set(matchingEvents.map((event) => event.visitorHash).filter(Boolean)).size,
    },
  };
}

export function summarizeAnalyticsRange(
  eventsInRange: StoredAnalyticsEvent[],
  allEvents: StoredAnalyticsEvent[] = eventsInRange,
) {
  const firstSeen = new Map<string, StoredAnalyticsEvent>();

  for (const event of allEvents) {
    const current = firstSeen.get(event.visitorHash);
    if (!current || event.ts < current.ts) firstSeen.set(event.visitorHash, event);
  }

  const visitors = new Set(eventsInRange.map((event) => event.visitorHash).filter(Boolean));
  const returningVisitors = new Set<string>();

  for (const event of eventsInRange) {
    const firstEvent = firstSeen.get(event.visitorHash);
    if (firstEvent && event.day !== firstEvent.day) returningVisitors.add(event.visitorHash);
  }

  return {
    events: eventsInRange.length,
    pageViews: eventsInRange.filter((event) => event.type === 'page_view').length,
    returningVisitors: returningVisitors.size,
    toolActions: eventsInRange.filter((event) => event.type === 'tool_action').length,
    visitors: visitors.size,
  };
}

export async function summarizeAnalytics(options: { days?: number; now?: Date; toolSlug?: string } = {}): Promise<AnalyticsSummary> {
  const days = Math.max(1, Math.min(365, options.days ?? 30));
  const timeZone = analyticsEnv('AFT_ANALYTICS_TIME_ZONE', DEFAULT_TIME_ZONE);
  const now = options.now ?? new Date();
  const rangeStartTime = now.getTime() - days * 24 * 60 * 60 * 1000;
  const activeStartTime = now.getTime() - 10 * 60 * 1000;
  const todayKey = dayKey(now, timeZone);
  const snapshot = await readAnalyticsSnapshot();
  const events = snapshot.events.filter((event) => Date.parse(event.ts) <= now.getTime());
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
  const selectedTool = summarizeSelectedToolAnalytics(eventsInRange, options.toolSlug);
  const range = summarizeAnalyticsRange(eventsInRange, events);
  const coverage: AnalyticsCoverage = {
    status: snapshot.reasons.size ? 'partial' : 'unknown',
    retainedRead: snapshot.reasons.size ? 'partial' : 'complete',
    reasons: [...snapshot.reasons, 'deployment-continuity-unverified', 'archive-retention-limits-history'],
    requestedStart: new Date(rangeStartTime).toISOString(),
    requestedEnd: now.toISOString(),
    observedStart: events[0]?.ts ?? null,
    observedEnd: events.at(-1)?.ts ?? null,
    rangeObservedStart: eventsInRange[0]?.ts ?? null,
    rangeObservedEnd: eventsInRange.at(-1)?.ts ?? null,
    deploymentContinuity: 'unknown',
    comparisonsAllowed: false,
    allTimeScope: 'retained-events-only',
    visitorClassification: 'observed-history-only',
    filesAvailable: snapshot.filesAvailable,
    filesRead: snapshot.filesRead,
    bytesRead: snapshot.bytesRead,
    limits: { tailBytesPerFile: MAX_ANALYTICS_TAIL_BYTES, events: MAX_READ_LINES, files: MAX_READ_FILES },
  };

  return {
    activeVisitors: activeVisitors.size,
    coverage,
    allTime: {
      events: events.length,
      pageViews: events.filter((event) => event.type === 'page_view').length,
      toolActions: events.filter((event) => event.type === 'tool_action').length,
      visitors: new Set(events.map((event) => event.visitorHash)).size,
    },
    days,
    generatedAt: now.toISOString(),
    ownerExclusionConfigured: getExcludedIps().size > 0,
    range,
    rangeStart: new Date(rangeStartTime).toISOString(),
    recentEvents: events.slice(-30).reverse(),
    returningVisitorsToday,
    selectedToolActions: selectedTool.actions,
    selectedToolAudience: selectedTool.audience,
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
