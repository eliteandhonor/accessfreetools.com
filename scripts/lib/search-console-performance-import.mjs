import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';

export const SITE_ORIGIN = 'https://accessfreetools.com';

export const PERFORMANCE_EXPORT_FILES = [
  'Chart.csv',
  'Countries.csv',
  'Devices.csv',
  'Filters.csv',
  'Pages.csv',
  'Queries.csv',
  'Search appearance.csv',
];

export const TIER_A_RECOVERY_PATHS = [
  '/blog/how-to-use-va-mortgage-calculator/',
  '/blog/how-to-use-currency-calculator/',
  '/blog/how-to-use-fha-loan-calculator/',
  '/blog/how-to-use-budget-calculator/',
  '/blog/how-to-use-markdown-table-generator/',
  '/tools/character-counter/',
  '/tools/ai-token-cost-calculator/',
  '/tools/big-number-calculator/',
  '/tools/distance-calculator/',
  '/tools/device-battery-life-calculator/',
  '/tools/siding-calculator/',
  '/tools/brick-calculator/',
  '/tools/soil-calculator/',
];

export function parseCsv(text) {
  const rows = [];
  let field = '';
  let row = [];
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (char !== '\r') {
      field += char;
    }
  }

  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  const [headers = [], ...body] = rows.filter((item) => item.some((value) => String(value).trim() !== ''));
  return body.map((values) =>
    Object.fromEntries(headers.map((header, index) => [header.trim(), String(values[index] ?? '').trim()])),
  );
}

export function numberField(value) {
  const number = Number(String(value ?? '').replace(/,/g, '').replace(/%$/, ''));
  return Number.isFinite(number) ? number : 0;
}

export function normalizePath(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';

  try {
    const url = raw.startsWith('http') ? new URL(raw) : new URL(raw, SITE_ORIGIN);
    if (url.origin !== SITE_ORIGIN) return '';
    if (/\.[a-z0-9]+$/i.test(url.pathname)) return url.pathname;
    return url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
  } catch {
    return raw.startsWith('/') ? raw : '';
  }
}

function absoluteUrl(path) {
  return path.startsWith('http') ? path : `${SITE_ORIGIN}${path}`;
}

function slugFromPath(path) {
  return path
    .replace(/^\/tools\//, '')
    .replace(/^\/blog\/how-to-use-/, '')
    .replace(/\/$/, '');
}

function kindFromPath(path) {
  if (path.startsWith('/blog/')) return 'blog';
  if (path.startsWith('/tools/')) return 'tool';
  if (path === '/sitemap/') return 'html-sitemap';
  return 'other';
}

function normalizeMetricRow(row, labelField, labelOutput) {
  return {
    [labelOutput]: row[labelField] ?? '',
    clicks: numberField(row.Clicks),
    impressions: numberField(row.Impressions),
    ctrPercent: numberField(row.CTR ?? row['Avg. CTR']),
    position: numberField(row.Position),
  };
}

function normalizePageRow(row) {
  const url = row['Top pages'] ?? row.URL ?? '';
  const path = normalizePath(url);
  return {
    url: absoluteUrl(path || url),
    path,
    kind: kindFromPath(path),
    slug: slugFromPath(path),
    clicks: numberField(row.Clicks),
    impressions: numberField(row.Impressions),
    ctrPercent: numberField(row.CTR),
    position: numberField(row.Position),
  };
}

function normalizeQueryRow(row) {
  return {
    query: row['Top queries'] ?? row.Query ?? '',
    clicks: numberField(row.Clicks),
    impressions: numberField(row.Impressions),
    ctrPercent: numberField(row.CTR),
    position: numberField(row.Position),
  };
}

function normalizeChartRow(row) {
  return {
    date: row.Date ?? '',
    clicks: numberField(row.Clicks),
    impressions: numberField(row.Impressions),
    ctrPercent: numberField(row.CTR ?? row['Avg. CTR']),
    position: numberField(row.Position),
  };
}

function normalizeDeindexedRow(row) {
  const path = normalizePath(row.URL);
  return {
    url: absoluteUrl(path),
    path,
    kind: kindFromPath(path),
    slug: slugFromPath(path),
    status: row.Status ?? '',
    clicks: numberField(row.Clicks),
    impressions: numberField(row.Impressions),
    ctrPercent: numberField(row.CTR),
    position: numberField(row.Position),
    lastUpdated: row['Last updated'] ?? '',
    deindexedAt: row['De-indexed at'] ?? '',
  };
}

function readCsvIfExists(filePath) {
  if (!filePath || !existsSync(filePath)) return [];
  return parseCsv(readFileSync(filePath, 'utf8'));
}

function sumField(rows, field) {
  return rows.reduce((sum, row) => sum + Number(row[field] ?? 0), 0);
}

function groupDeindexedByKind(rows) {
  const grouped = new Map();
  for (const row of rows) {
    const current = grouped.get(row.kind) ?? { count: 0, impressions: 0, clicks: 0 };
    current.count += 1;
    current.impressions += row.impressions;
    current.clicks += row.clicks;
    grouped.set(row.kind, current);
  }
  return Object.fromEntries([...grouped.entries()].sort(([left], [right]) => left.localeCompare(right)));
}

function topRows(rows, options = {}) {
  const { limit = 20, onlyZeroClicks = false, maxPosition = Infinity, minImpressions = 0 } = options;
  return rows
    .filter((row) => row.impressions >= minImpressions)
    .filter((row) => (onlyZeroClicks ? row.clicks === 0 : true))
    .filter((row) => row.position <= maxPosition)
    .sort((left, right) => right.impressions - left.impressions)
    .slice(0, limit);
}

function buildTierA(deindexedRows) {
  const byPath = new Map(deindexedRows.map((row) => [row.path, row]));
  return TIER_A_RECOVERY_PATHS.map((path) => {
    const evidence = byPath.get(path);
    const kind = kindFromPath(path);
    const action = kind === 'blog' ? 'differentiate' : 'recover';
    return {
      action,
      evidenceFound: Boolean(evidence),
      kind,
      path,
      slug: slugFromPath(path),
      impressions: evidence?.impressions ?? 0,
      clicks: evidence?.clicks ?? 0,
      position: evidence?.position ?? 0,
      deindexedAt: evidence?.deindexedAt ?? '',
      rationale:
        kind === 'blog'
          ? 'Keep indexed only after adding standalone guide value that is not duplicated from the tool page.'
          : 'Tool page is the primary URL for calculator/tool intent and should be refreshed for recovery.',
      workbenchCommand: `node scripts/seo-agent-workbench.mjs all ${slugFromPath(path)} ${kind}`,
    };
  });
}

function newestMatchingPath(directory, predicate) {
  if (!directory || !existsSync(directory)) return '';
  return readdirSync(directory, { withFileTypes: true })
    .filter(predicate)
    .map((entry) => {
      const fullPath = join(directory, entry.name);
      return { fullPath, mtime: statSync(fullPath).mtimeMs };
    })
    .sort((left, right) => right.mtime - left.mtime)[0]?.fullPath ?? '';
}

function isoDateFromName(value) {
  return basename(String(value ?? '')).match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? '';
}

function sourceDataDate(...paths) {
  return paths.map(isoDateFromName).find(Boolean) ?? '';
}

export function newestPerformanceExportDirectory(downloads = process.env.USERPROFILE ? join(process.env.USERPROFILE, 'Downloads') : '') {
  return newestMatchingPath(
    downloads,
    (entry) => entry.isDirectory() && /^https___accessfreetools\.com_-Performance-on-Search-/i.test(entry.name),
  );
}

export function newestPerformanceOverviewFile(downloads = process.env.USERPROFILE ? join(process.env.USERPROFILE, 'Downloads') : '') {
  return newestMatchingPath(
    downloads,
    (entry) => entry.isFile() && /^accessfreetools\.com_SearchPerformanceOverview_All_.*\.csv$/i.test(entry.name),
  );
}

export function newestDeindexedFile(downloads = process.env.USERPROFILE ? join(process.env.USERPROFILE, 'Downloads') : '') {
  return newestMatchingPath(
    downloads,
    (entry) => entry.isFile() && /-deindexed-\d{4}-\d{2}-\d{2}(?: \(\d+\))?\.csv$/i.test(entry.name),
  );
}

export function buildSearchConsolePerformanceReport({ deindexedFile = '', generatedAt = new Date().toISOString(), overviewFile = '', performanceDir }) {
  if (!performanceDir || !existsSync(performanceDir)) {
    throw new Error('Search Console Performance export directory not found.');
  }

  const chart = readCsvIfExists(join(performanceDir, 'Chart.csv')).map(normalizeChartRow);
  const pages = readCsvIfExists(join(performanceDir, 'Pages.csv')).map(normalizePageRow).filter((row) => row.path);
  const queries = readCsvIfExists(join(performanceDir, 'Queries.csv')).map(normalizeQueryRow).filter((row) => row.query);
  const countries = readCsvIfExists(join(performanceDir, 'Countries.csv')).map((row) => normalizeMetricRow(row, 'Country', 'country'));
  const devices = readCsvIfExists(join(performanceDir, 'Devices.csv')).map((row) => normalizeMetricRow(row, 'Device', 'device'));
  const filters = readCsvIfExists(join(performanceDir, 'Filters.csv'));
  const searchAppearance = readCsvIfExists(join(performanceDir, 'Search appearance.csv')).map((row) =>
    normalizeMetricRow(row, 'Search Appearance', 'appearance'),
  );
  const overview = overviewFile ? readCsvIfExists(overviewFile).map(normalizeChartRow) : [];
  const deindexed = deindexedFile ? readCsvIfExists(deindexedFile).map(normalizeDeindexedRow).filter((row) => row.path) : [];
  const pagePathSet = new Set(pages.map((row) => row.path));
  const deindexedOverlapWithPerformance = deindexed.filter((row) => pagePathSet.has(row.path)).length;
  const chartClicks = sumField(chart, 'clicks');
  const chartImpressions = sumField(chart, 'impressions');
  const pageClicks = sumField(pages, 'clicks');
  const pageImpressions = sumField(pages, 'impressions');
  const bingOverviewClicks = sumField(overview, 'clicks');
  const bingOverviewImpressions = sumField(overview, 'impressions');

  return {
    generatedAt,
    kind: 'search-console-performance-import',
    status: deindexed.length || topRows(pages, { onlyZeroClicks: true, minImpressions: 100 }).length ? 'attention' : 'pass',
    source: {
      dataDate: sourceDataDate(performanceDir, deindexedFile),
      performanceDir,
      overviewFile,
      overviewKind: overviewFile ? 'bing-webmaster-performance-overview' : '',
      deindexedFile,
      files: PERFORMANCE_EXPORT_FILES.filter((file) => existsSync(join(performanceDir, file))),
    },
    totals: {
      chartDays: chart.length,
      chartClicks,
      chartImpressions,
      chartCtrPercent: chartImpressions ? Number(((chartClicks / chartImpressions) * 100).toFixed(2)) : 0,
      pageRows: pages.length,
      pageClicks,
      pageImpressions,
      pageCtrPercent: pageImpressions ? Number(((pageClicks / pageImpressions) * 100).toFixed(2)) : 0,
      queryRows: queries.length,
      queryClicks: sumField(queries, 'clicks'),
      queryImpressions: sumField(queries, 'impressions'),
      bingOverviewRows: overview.length,
      bingOverviewClicks,
      bingOverviewImpressions,
      bingOverviewCtrPercent: bingOverviewImpressions
        ? Number(((bingOverviewClicks / bingOverviewImpressions) * 100).toFixed(2))
        : 0,
      deindexedRows: deindexed.length,
      deindexedOverlapWithPerformance,
    },
    chart,
    overview,
    countries,
    devices,
    filters,
    searchAppearance,
    pages,
    queries,
    deindexed,
    deindexedByKind: groupDeindexedByKind(deindexed),
    tierARecovery: buildTierA(deindexed),
    opportunities: {
      topPagesByImpressions: topRows(pages, { limit: 25 }),
      highImpressionZeroClickPages: topRows(pages, { limit: 25, onlyZeroClicks: true, minImpressions: 100 }),
      queryQuickWins: topRows(queries, { limit: 25, onlyZeroClicks: true, minImpressions: 20, maxPosition: 20 }),
      topDeindexedByImpressions: topRows(deindexed, { limit: 25 }),
    },
  };
}

function markdownTable(rows, columns, empty = '| none |') {
  if (!rows.length) return empty;
  return rows
    .map((row) => `| ${columns.map((column) => row[column.key] ?? '').join(' | ')} |`)
    .join('\n');
}

export function renderSearchConsolePerformanceMarkdown(report) {
  return `# Search Console Performance And Deindex Import

Generated: ${report.generatedAt}

Status: ${report.status}

Source: ${basename(report.source.performanceDir)}

## Summary

- Page export: ${report.totals.pageRows} URLs, ${report.totals.pageImpressions} impressions, ${report.totals.pageClicks} clicks, ${report.totals.pageCtrPercent}% CTR.
- Chart export: ${report.totals.chartDays} days, ${report.totals.chartImpressions} impressions, ${report.totals.chartClicks} clicks, ${report.totals.chartCtrPercent}% CTR.
- Bing Webmaster overview: ${report.totals.bingOverviewRows} days, ${report.totals.bingOverviewImpressions} impressions, ${report.totals.bingOverviewClicks} clicks, ${report.totals.bingOverviewCtrPercent}% CTR. Use this as aggregate trend evidence, not Google or page-level evidence.
- Deindexed export: ${report.totals.deindexedRows} URLs; ${report.totals.deindexedOverlapWithPerformance} also appear in the performance pages export.
- Search appearance rows: ${report.searchAppearance.length}.

## Deindexed By Section

| Section | URLs | Impressions | Clicks |
| --- | ---: | ---: | ---: |
${Object.entries(report.deindexedByKind)
  .map(([kind, value]) => `| ${kind} | ${value.count} | ${value.impressions} | ${value.clicks} |`)
  .join('\n') || '| none | 0 | 0 | 0 |'}

## Tier A Recovery List

| Path | Kind | In export | Impressions | Position | Action |
| --- | --- | --- | ---: | ---: | --- |
${markdownTable(report.tierARecovery, [
  { key: 'path' },
  { key: 'kind' },
  { key: 'evidenceFound' },
  { key: 'impressions' },
  { key: 'position' },
  { key: 'action' },
])}

## High-Impression Zero-Click Pages

| Path | Impressions | Position |
| --- | ---: | ---: |
${markdownTable(report.opportunities.highImpressionZeroClickPages.slice(0, 20), [
  { key: 'path' },
  { key: 'impressions' },
  { key: 'position' },
])}

## Query Quick Wins

| Query | Impressions | Position |
| --- | ---: | ---: |
${markdownTable(report.opportunities.queryQuickWins.slice(0, 20), [
  { key: 'query' },
  { key: 'impressions' },
  { key: 'position' },
])}

## Top Deindexed URLs

| Path | Impressions | Position |
| --- | ---: | ---: |
${markdownTable(report.opportunities.topDeindexedByImpressions.slice(0, 20), [
  { key: 'path' },
  { key: 'impressions' },
  { key: 'position' },
])}
`;
}

export function writeSearchConsolePerformanceReport(report, outputDir = resolve('output/search-console')) {
  const jsonPath = join(outputDir, 'performance-latest.json');
  const markdownPath = join(outputDir, 'performance-latest.md');
  const tierAPath = join(outputDir, 'tier-a-recovery-list.txt');
  mkdirSync(dirname(jsonPath), { recursive: true });
  writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(markdownPath, renderSearchConsolePerformanceMarkdown(report));
  writeFileSync(tierAPath, `${report.tierARecovery.map((item) => item.path).join('\n')}\n`);
  return { jsonPath, markdownPath, tierAPath };
}
