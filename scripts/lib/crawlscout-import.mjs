import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { normalizePath, numberField, parseCsv, SITE_ORIGIN } from './search-console-performance-import.mjs';

function absoluteUrl(pathOrUrl) {
  const value = String(pathOrUrl ?? '').trim();
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_ORIGIN}${value.startsWith('/') ? value : `/${value}`}`;
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

function normalizeStatus(value) {
  const normalized = String(value ?? '').trim().toLowerCase();
  if (!normalized) return 'unknown';
  if (/^indexed$|submitted and indexed/.test(normalized)) return 'indexed';
  if (/not indexed|de-?indexed|crawled|discovered/.test(normalized)) return 'not-indexed';
  if (/submitted|pending/.test(normalized)) return 'submitted';
  return normalized.replace(/\s+/g, '-');
}

function normalizeRow(row) {
  const path = normalizePath(row.URL ?? row.Url ?? row.url ?? row.Page ?? row.page ?? '');
  const status = row.Status ?? row.status ?? '';
  return {
    clicks: numberField(row.Clicks),
    ctrPercent: numberField(row.CTR),
    deindexedAt: row['De-indexed at'] ?? row.deindexedAt ?? '',
    impressions: numberField(row.Impressions),
    kind: kindFromPath(path),
    lastUpdated: row['Last updated'] ?? row.lastUpdated ?? '',
    path,
    position: numberField(row.Position),
    slug: slugFromPath(path),
    status,
    statusKey: normalizeStatus(status),
    url: absoluteUrl(path || row.URL),
  };
}

function topRows(rows, limit = 50) {
  return [...rows]
    .sort((left, right) => right.impressions - left.impressions || left.path.localeCompare(right.path))
    .slice(0, limit);
}

function groupByKind(rows) {
  const grouped = new Map();
  for (const row of rows) {
    const current = grouped.get(row.kind) ?? { clicks: 0, count: 0, impressions: 0 };
    current.clicks += row.clicks;
    current.count += 1;
    current.impressions += row.impressions;
    grouped.set(row.kind, current);
  }
  return Object.fromEntries([...grouped.entries()].sort(([left], [right]) => left.localeCompare(right)));
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

export function newestCrawlScoutCsv(downloads = process.env.USERPROFILE ? join(process.env.USERPROFILE, 'Downloads') : '') {
  return newestMatchingPath(
    downloads,
    (entry) => entry.isFile() && /-deindexed-\d{4}-\d{2}-\d{2}(?: \(\d+\))?\.csv$/i.test(entry.name),
  );
}

export function buildCrawlScoutReport({ csvFile, generatedAt = new Date().toISOString() }) {
  if (!csvFile || !existsSync(csvFile)) {
    throw new Error('CrawlScout/deindexed CSV not found.');
  }

  const rows = parseCsv(readFileSync(csvFile, 'utf8')).map(normalizeRow).filter((row) => row.path);
  const indexedRows = rows.filter((row) => row.statusKey === 'indexed');
  const submittedRows = rows.filter((row) => row.statusKey === 'submitted');
  const nonIndexedRows = rows.filter((row) => row.statusKey !== 'indexed');
  const impressions = rows.reduce((sum, row) => sum + row.impressions, 0);
  const clicks = rows.reduce((sum, row) => sum + row.clicks, 0);

  return {
    generatedAt,
    kind: 'crawlscout-deindexed-import',
    notes: [
      'Imported from a CrawlScout/deindexed URL CSV export.',
      'This snapshot contains deindexed/non-indexed URL rows, not full CrawlScout crawl totals.',
    ],
    overview: {
      clicks,
      ctrPercent: impressions ? Number(((clicks / impressions) * 100).toFixed(2)) : 0,
      deindexed: nonIndexedRows.length,
      impressions,
      indexed: indexedRows.length,
      notIndexed: nonIndexedRows.length,
      rows: rows.length,
      submitted: submittedRows.length || null,
    },
    pageSample: topRows(nonIndexedRows),
    source: {
      csvFile,
      fileName: basename(csvFile),
    },
    status: nonIndexedRows.length ? 'attention' : 'pass',
    topKeywordSignals: [],
    topPageSignals: topRows(rows, 25),
    totals: {
      clicks,
      indexedRows: indexedRows.length,
      impressions,
      nonIndexedRows: nonIndexedRows.length,
      rows: rows.length,
      submittedRows: submittedRows.length,
      zeroClickImpressionRows: rows.filter((row) => row.impressions > 0 && row.clicks === 0).length,
    },
    urlsByKind: groupByKind(rows),
  };
}

function markdownTable(rows, columns, empty = '| none |') {
  if (!rows.length) return empty;
  return rows.map((row) => `| ${columns.map((column) => row[column.key] ?? '').join(' | ')} |`).join('\n');
}

export function renderCrawlScoutMarkdown(report) {
  return `# CrawlScout Deindexed Import

Generated: ${report.generatedAt}

Status: ${report.status}

Source: ${report.source.fileName}

## Summary

- Rows: ${report.totals.rows}
- Non-indexed/deindexed rows: ${report.totals.nonIndexedRows}
- Impressions: ${report.totals.impressions}
- Clicks: ${report.totals.clicks}
- Zero-click rows with impressions: ${report.totals.zeroClickImpressionRows}

## URLs By Section

| Section | URLs | Impressions | Clicks |
| --- | ---: | ---: | ---: |
${Object.entries(report.urlsByKind)
  .map(([kind, value]) => `| ${kind} | ${value.count} | ${value.impressions} | ${value.clicks} |`)
  .join('\n') || '| none | 0 | 0 | 0 |'}

## Top Non-Indexed URLs

| Path | Status | Impressions | Position | De-indexed At |
| --- | --- | ---: | ---: | --- |
${markdownTable(report.pageSample.slice(0, 25), [
  { key: 'path' },
  { key: 'status' },
  { key: 'impressions' },
  { key: 'position' },
  { key: 'deindexedAt' },
])}

## Notes

${report.notes.map((note) => `- ${note}`).join('\n')}
`;
}

export function writeCrawlScoutReport(report, outputDir = resolve('output/crawlscout')) {
  const jsonPath = join(outputDir, 'crawlscout-summary.json');
  const markdownPath = join(outputDir, 'crawlscout-summary.md');
  const latestPath = join(outputDir, 'latest.json');
  mkdirSync(dirname(jsonPath), { recursive: true });
  writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(latestPath, `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(markdownPath, renderCrawlScoutMarkdown(report));
  return { jsonPath, latestPath, markdownPath };
}
