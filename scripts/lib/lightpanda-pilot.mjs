import { createHash } from 'node:crypto';

export const LIGHTPANDA_VERSION = '0.3.4';
export const LIGHTPANDA_IMAGE =
  'lightpanda/browser@sha256:8ac0d11ca6d1ee045580734ec852abae0956db8afb4a3b4c4867d83def31ac71';
export const PILOT_USER_AGENT = 'AccessFreeTools-Lightpanda-Pilot/1.0';
export const PILOT_VIEWPORT = Object.freeze({ height: 900, width: 1440 });

export const FIXED_CORE_ROUTES = Object.freeze([
  '/',
  '/tools/',
  '/blog/',
  '/free-calculator-resources/',
  '/why-access-free-tools/',
  '/about/',
  '/ask/',
  '/categories/calculators/',
  '/categories/ai-tools/',
  '/gallery/finance/',
]);

export const FIXED_TOOL_ROUTES = Object.freeze([
  '/tools/percentage-calculator/',
  '/tools/mortgage-calculator/',
  '/tools/image-to-text-ocr-tool/',
  '/tools/four-in-a-row-game/',
  '/tools/json-formatter/',
]);

export const FIXED_CONTENT_ROUTES = Object.freeze([
  '/blog/how-to-use-image-to-text-ocr-tool/',
  '/blog/how-to-use-four-in-a-row-game/',
  '/blog/free-ai-skills-open-source-tools-organic-growth/',
  '/blog/open-source-projects-behind-access-free-tools/',
  '/blog/how-to-check-github-project-before-installing/',
]);

const SENSITIVE_KEY_PATTERN =
  /(?:authorization|cookie|credential|password|secret|token|api[-_]?key|session|set-cookie)/i;
const SENSITIVE_VALUE_PATTERNS = [
  /\bBearer\s+[A-Za-z0-9._~+/=-]+/gi,
  /\b(?:sk-(?:proj-)?[A-Za-z0-9_-]{12,}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|xox[baprs]-[A-Za-z0-9-]{12,})\b/g,
  /([?&](?:token|key|secret|password|session)=)[^&#\s]+/gi,
];

export function normalizeRoutePath(value) {
  if (!value) return null;
  try {
    const parsed = new URL(value, 'https://accessfreetools.com');
    let path = parsed.pathname.replace(/\/{2,}/g, '/');
    if (!/\.[a-z0-9]{1,8}$/i.test(path) && !path.endsWith('/')) path += '/';
    return path || '/';
  } catch {
    return null;
  }
}

export function evenlySample(values, count) {
  const sorted = [...new Set(values)].sort();
  if (count <= 0) return [];
  if (sorted.length < count) {
    throw new Error(`Cannot sample ${count} values from a set of ${sorted.length}.`);
  }
  if (count === 1) return [sorted[Math.floor((sorted.length - 1) / 2)]];
  if (sorted.length === count) return sorted;

  const selected = [];
  const used = new Set();
  for (let index = 0; index < count; index += 1) {
    let candidateIndex = Math.round((index * (sorted.length - 1)) / (count - 1));
    while (used.has(candidateIndex) && candidateIndex + 1 < sorted.length) candidateIndex += 1;
    while (used.has(candidateIndex) && candidateIndex > 0) candidateIndex -= 1;
    used.add(candidateIndex);
    selected.push(sorted[candidateIndex]);
  }
  return selected;
}

function requireRoutes(routes, available) {
  const missing = routes.filter((route) => !available.has(route));
  if (missing.length) {
    throw new Error(`Required Lightpanda pilot routes are missing from the sitemap: ${missing.join(', ')}`);
  }
}

export function selectPilotRoutes(sitemapUrls) {
  const available = new Set(
    sitemapUrls
      .map(normalizeRoutePath)
      .filter(Boolean)
      .filter((path) => !path.startsWith('/api/') && !path.startsWith('/admin/')),
  );

  requireRoutes(FIXED_CORE_ROUTES, available);
  requireRoutes(FIXED_TOOL_ROUTES, available);
  requireRoutes(FIXED_CONTENT_ROUTES, available);

  const selected = new Set(FIXED_CORE_ROUTES);
  const additionalTools = evenlySample(
    [...available].filter((path) => path.startsWith('/tools/') && !selected.has(path) && !FIXED_TOOL_ROUTES.includes(path)),
    15,
  );
  const toolRoutes = [...FIXED_TOOL_ROUTES, ...additionalTools];
  toolRoutes.forEach((path) => selected.add(path));

  const additionalContent = evenlySample(
    [...available].filter((path) => path.startsWith('/blog/') && !selected.has(path) && !FIXED_CONTENT_ROUTES.includes(path)),
    10,
  );
  const contentRoutes = [...FIXED_CONTENT_ROUTES, ...additionalContent];
  contentRoutes.forEach((path) => selected.add(path));

  const remainingRoutes = evenlySample(
    [...available].filter((path) => !selected.has(path)),
    5,
  );
  remainingRoutes.forEach((path) => selected.add(path));

  const routes = [...FIXED_CORE_ROUTES, ...toolRoutes, ...contentRoutes, ...remainingRoutes];
  if (routes.length !== 50 || selected.size !== 50) {
    throw new Error(`Lightpanda pilot route selection must contain exactly 50 unique routes; got ${selected.size}.`);
  }

  return {
    content: contentRoutes,
    core: [...FIXED_CORE_ROUTES],
    remaining: remainingRoutes,
    routes,
    tools: toolRoutes,
  };
}

export function isAllowedPilotRequest(rawUrl, allowedOrigin) {
  if (!rawUrl) return false;
  if (/^(?:about:blank|data:|blob:)/i.test(rawUrl)) return true;
  try {
    const parsed = new URL(rawUrl);
    const expected = new URL(allowedOrigin);
    return (
      !parsed.username &&
      !parsed.password &&
      parsed.protocol === expected.protocol &&
      parsed.hostname === expected.hostname &&
      parsed.port === expected.port
    );
  } catch {
    return false;
  }
}

export function normalizeWhitespace(value) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function hashText(value) {
  return createHash('sha256').update(String(value ?? ''), 'utf8').digest('hex');
}

export function normalizeComparableUrl(value) {
  if (!value) return '';
  try {
    const url = new URL(value, 'https://accessfreetools.com');
    return normalizeRoutePath(url.pathname) ?? '';
  } catch {
    return '';
  }
}

export function normalizeInternalLinks(values) {
  const internalHosts = new Set([
    '127.0.0.1',
    'accessfreetools.com',
    'host.docker.internal',
    'localhost',
    'www.accessfreetools.com',
  ]);
  return [
    ...new Set(
      (values ?? [])
        .filter((value) => {
          try {
            return internalHosts.has(new URL(value, 'https://accessfreetools.com').hostname.toLowerCase());
          } catch {
            return false;
          }
        })
        .map(normalizeComparableUrl)
        .filter(Boolean),
    ),
  ].sort();
}

export function normalizeSnapshot(raw) {
  const mainText = normalizeWhitespace(raw.mainText);
  return {
    canonical: normalizeComparableUrl(raw.canonical),
    description: normalizeWhitespace(raw.description),
    finalPath: normalizeComparableUrl(raw.finalUrl),
    h1: [...(raw.h1 ?? [])].map(normalizeWhitespace).filter(Boolean),
    internalLinks: normalizeInternalLinks(raw.internalLinks),
    jsonLdCount: Number(raw.jsonLdCount ?? 0),
    jsonLdInvalid: Number(raw.jsonLdInvalid ?? 0),
    jsonLdTypes: [...new Set(raw.jsonLdTypes ?? [])].map(String).sort(),
    language: normalizeWhitespace(raw.language).toLowerCase(),
    mainTextHash: hashText(mainText),
    mainWordCount: mainText ? mainText.split(/\s+/).length : 0,
    robots: normalizeWhitespace(raw.robots).toLowerCase(),
    status: Number(raw.status ?? 0),
    title: normalizeWhitespace(raw.title),
  };
}

export function jaccardSimilarity(left, right) {
  const a = new Set(left ?? []);
  const b = new Set(right ?? []);
  const union = new Set([...a, ...b]);
  if (!union.size) return 1;
  let intersection = 0;
  for (const value of a) if (b.has(value)) intersection += 1;
  return intersection / union.size;
}

export function compareSnapshots(chromium, lightpanda) {
  const exactFields = [
    'status',
    'finalPath',
    'language',
    'title',
    'description',
    'canonical',
    'robots',
    'jsonLdCount',
    'jsonLdInvalid',
  ];
  const exactMismatches = exactFields.filter((field) => chromium[field] !== lightpanda[field]);
  if (JSON.stringify(chromium.h1) !== JSON.stringify(lightpanda.h1)) exactMismatches.push('h1');
  if (JSON.stringify(chromium.jsonLdTypes) !== JSON.stringify(lightpanda.jsonLdTypes)) {
    exactMismatches.push('jsonLdTypes');
  }

  const internalLinkJaccard = jaccardSimilarity(chromium.internalLinks, lightpanda.internalLinks);
  const maxWordCount = Math.max(chromium.mainWordCount, lightpanda.mainWordCount, 1);
  const mainWordCountDifferenceRatio =
    Math.abs(chromium.mainWordCount - lightpanda.mainWordCount) / maxWordCount;

  return {
    criticalMetadataMatch: exactMismatches.length === 0,
    exactMismatches,
    internalLinkJaccard,
    internalLinksPass: internalLinkJaccard >= 0.99,
    mainContentPass: mainWordCountDifferenceRatio <= 0.02,
    mainWordCountDifferenceRatio,
  };
}

export function buildLightpandaDockerArgs({
  cdpPort,
  containerName,
  previewPort,
}) {
  if (!Number.isInteger(cdpPort) || cdpPort < 1) throw new Error('A valid CDP port is required.');
  if (!Number.isInteger(previewPort) || previewPort < 1) throw new Error('A valid preview port is required.');
  if (!/^[a-z0-9][a-z0-9_.-]+$/i.test(containerName)) throw new Error('A safe container name is required.');

  return [
    'run',
    '--detach',
    '--rm',
    '--name',
    containerName,
    '--label',
    'com.accessfreetools.lightpanda-pilot=true',
    '--publish',
    `127.0.0.1:${cdpPort}:9222`,
    '--add-host',
    'host.docker.internal:host-gateway',
    '--cap-drop',
    'ALL',
    '--security-opt',
    'no-new-privileges:true',
    '--memory',
    '512m',
    '--cpus',
    '2',
    '--pids-limit',
    '256',
    '--ulimit',
    'core=0:0',
    '--env',
    'LIGHTPANDA_DISABLE_TELEMETRY=true',
    LIGHTPANDA_IMAGE,
    '/bin/lightpanda',
    'serve',
    '--host',
    '0.0.0.0',
    '--advertise-host',
    '127.0.0.1',
    '--port',
    '9222',
    '--cdp-max-connections',
    '16',
    '--http-max-concurrent',
    '8',
    '--http-max-host-open',
    '4',
    '--http-connect-timeout',
    '5000',
    '--http-timeout',
    '15000',
    '--http-max-response-size',
    '33554432',
    '--obey-robots',
    '--disable-subframes',
    '--disable-workers',
    '--storage-engine',
    'none',
    '--log-level',
    'warn',
    '--user-agent',
    PILOT_USER_AGENT,
  ];
}

export function redactReport(value) {
  if (Array.isArray(value)) return value.map(redactReport);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [
        key,
        SENSITIVE_KEY_PATTERN.test(key) ? '[redacted]' : redactReport(child),
      ]),
    );
  }
  if (typeof value !== 'string') return value;

  return value
    .replace(SENSITIVE_VALUE_PATTERNS[0], '[redacted]')
    .replace(SENSITIVE_VALUE_PATTERNS[1], '[redacted]')
    .replace(SENSITIVE_VALUE_PATTERNS[2], '$1[redacted]');
}

export function hasSensitiveReportData(value) {
  if (Array.isArray(value)) return value.some(hasSensitiveReportData);
  if (value && typeof value === 'object') {
    return Object.entries(value).some(([key, child]) => {
      if (SENSITIVE_KEY_PATTERN.test(key)) return child !== '[redacted]';
      return hasSensitiveReportData(child);
    });
  }
  if (typeof value !== 'string') return false;
  const unredactedValue = value.replace(
    /[?&](?:token|key|secret|password|session)=\[redacted\]/gi,
    '',
  );
  return SENSITIVE_VALUE_PATTERNS.some((pattern) => {
    pattern.lastIndex = 0;
    return pattern.test(unredactedValue);
  });
}

export class CleanupStack {
  #callbacks = [];

  add(callback) {
    this.#callbacks.push(callback);
    return callback;
  }

  async dispose() {
    const errors = [];
    for (const callback of this.#callbacks.reverse()) {
      try {
        await callback();
      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error));
      }
    }
    this.#callbacks = [];
    return errors;
  }
}
