import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const args = process.argv.slice(2);
const option = (name, fallback = undefined) =>
  args.find((arg) => arg.startsWith(`${name}=`))?.slice(name.length + 1) ?? fallback;

function localDateStamp(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone: process.env.AFT_ANALYTICS_TIME_ZONE ?? 'Australia/Brisbane',
    year: 'numeric',
  }).formatToParts(date);
  const value = (type) => parts.find((part) => part.type === type)?.value ?? '';
  return `${value('year')}-${value('month')}-${value('day')}`;
}

const days = Math.max(1, Number(option('--days', '30')));
const outputDir = resolve(option('--output-dir', join('output', 'original-data-assets', localDateStamp())));
const analyticsEventsPath = resolve(process.env.AFT_ANALYTICS_DIR ?? '.local/analytics', 'events.ndjson');

function readNdjson(path) {
  if (!existsSync(path)) return [];
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function increment(map, key, label = key, path = key) {
  const current = map.get(key) ?? { key, label, path, count: 0 };
  current.count += 1;
  map.set(key, current);
}

function topRows(map, limit = 10) {
  return [...map.values()].sort((left, right) => right.count - left.count || left.label.localeCompare(right.label)).slice(0, limit);
}

function hasOwnerExclusionHint() {
  if (process.env.AFT_ANALYTICS_EXCLUDE_IPS) return true;

  const candidates = [
    process.env.AFT_ANALYTICS_CONFIG,
    '.local/analytics-dashboard.env',
    '.local/accessfreetools-analytics.env',
  ]
    .filter(Boolean)
    .map((path) => resolve(path));

  return candidates.some((path) => existsSync(path) && /AFT_ANALYTICS_EXCLUDE_IPS\s*=\s*[^#\r\n]+/i.test(readFileSync(path, 'utf8')));
}

function analyze() {
  const now = new Date();
  const startTime = now.getTime() - days * 24 * 60 * 60 * 1000;
  const events = readNdjson(analyticsEventsPath);
  const inRange = events.filter((event) => event?.ts && new Date(event.ts).getTime() >= startTime);
  const visitors = new Set(inRange.map((event) => event.visitorHash).filter(Boolean));
  const firstSeen = new Map();
  const topTools = new Map();
  const topPages = new Map();
  const topReferrers = new Map();
  const toolPaths = new Map();

  for (const event of events) {
    if (event.visitorHash && !firstSeen.has(event.visitorHash)) {
      firstSeen.set(event.visitorHash, event.day ?? event.ts.slice(0, 10));
    }
  }

  for (const event of inRange) {
    if (event.type === 'tool_action' && event.toolSlug) {
      increment(topTools, event.toolSlug, event.toolName ?? event.toolSlug, `/tools/${event.toolSlug}/`);
    }

    if (event.type === 'page_view' && event.pagePath) {
      increment(topPages, event.pagePath, event.pageTitle ?? event.pagePath, event.pagePath);
    }

    if (event.referrerHost) {
      increment(topReferrers, event.referrerHost, event.referrerHost, event.referrerHost);
    }

    if (event.visitorHash && event.pagePath) {
      const current = toolPaths.get(event.visitorHash) ?? [];
      current.push(event.pagePath);
      toolPaths.set(event.visitorHash, current.slice(-5));
    }
  }

  const returningVisitors = [...visitors].filter((visitorHash) => {
    const first = firstSeen.get(visitorHash);
    return first && inRange.some((event) => event.visitorHash === visitorHash && (event.day ?? event.ts.slice(0, 10)) !== first);
  }).length;
  const pageViews = inRange.filter((event) => event.type === 'page_view').length;
  const toolActions = inRange.filter((event) => event.type === 'tool_action').length;
  const ownerExclusionConfigured = hasOwnerExclusionHint();
  const readinessIssues = [];

  if (!existsSync(analyticsEventsPath)) readinessIssues.push('Analytics events file is not present yet.');
  if (!ownerExclusionConfigured) readinessIssues.push('Owner IP/browser exclusion is not confirmed in local analytics config.');
  if (visitors.size < 25) readinessIssues.push(`Only ${visitors.size} unique visitors in range; wait for at least 25.`);
  if (pageViews < 100) readinessIssues.push(`Only ${pageViews} page views in range; wait for at least 100.`);
  if (toolActions < 25) readinessIssues.push(`Only ${toolActions} tool actions in range; wait for at least 25.`);

  return {
    generatedAt: now.toISOString(),
    days,
    analyticsEventsPath: analyticsEventsPath.replace(/\\/g, '/'),
    ownerExclusionConfigured,
    status: readinessIssues.length ? 'not-ready' : 'ready-for-editorial-draft',
    readinessIssues,
    totals: {
      events: inRange.length,
      visitors: visitors.size,
      returningVisitors,
      pageViews,
      toolActions,
    },
    topTools: topRows(topTools),
    topPages: topRows(topPages),
    topReferrers: topRows(topReferrers),
  };
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value);
}

function renderDraft(report) {
  const lines = [
    '# Access Free Tools Usage Notes Draft',
    '',
    `Generated: ${report.generatedAt}`,
    `Window: last ${report.days} days`,
    `Status: ${report.status}`,
    '',
    '## Privacy Guardrail',
    '',
    'This draft uses anonymous aggregate events only. Do not publish raw visitor hashes, IP addresses, exact event logs, or anything that could identify a person. Owner traffic must be filtered or clearly excluded before publishing.',
    '',
    '## Readiness',
    '',
    ...(report.readinessIssues.length ? report.readinessIssues.map((issue) => `- ${issue}`) : ['- Ready for a human-edited public usage notes article.']),
    '',
    '## Snapshot',
    '',
    `- Visitors: ${report.totals.visitors}`,
    `- Returning visitors: ${report.totals.returningVisitors}`,
    `- Page views: ${report.totals.pageViews}`,
    `- Tool actions: ${report.totals.toolActions}`,
    '',
    '## Most Used Tools',
    '',
    ...(report.topTools.length
      ? report.topTools.map((item, index) => `${index + 1}. ${item.label} (${item.count} uses) - ${item.path}`)
      : [`No tool-use actions recorded in the last ${report.days} days.`]),
    '',
    '## Most Viewed Pages',
    '',
    ...(report.topPages.length
      ? report.topPages.map((item, index) => `${index + 1}. ${item.label} (${item.count} views) - ${item.path}`)
      : [`No page views recorded in the last ${report.days} days.`]),
    '',
    '## Editorial Angles',
    '',
    '- Which tools are people actually using first?',
    '- Which guide should explain mistakes better because the matching tool gets repeated use?',
    '- Which hub should link more clearly to a tool people keep finding?',
    '- Which social platform sent useful visitors, if any?',
    '',
  ];

  return `${lines.join('\n')}\n`;
}

const report = analyze();
writeJson(join(outputDir, 'summary.json'), report);
writeText(join(outputDir, 'usage-notes-draft.md'), renderDraft(report));
writeJson(resolve('output', 'original-data-assets', 'latest.json'), report);
writeText(resolve('output', 'original-data-assets', 'latest-usage-notes-draft.md'), renderDraft(report));

console.log(`Usage data asset report: ${report.status}`);
console.log(`Report: ${join(outputDir, 'summary.json')}`);
console.log(`Draft: ${join(outputDir, 'usage-notes-draft.md')}`);
