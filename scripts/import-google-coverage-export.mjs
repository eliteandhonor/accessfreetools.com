import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';

const OUTPUT_JSON = resolve('output/search-console-coverage-export.json');
const OUTPUT_MD = resolve('output/search-console-coverage-export.md');

function option(name) {
  const prefix = `${name}=`;
  const found = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : '';
}

function parseCsv(text) {
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

  const [headers = [], ...body] = rows.filter((item) => item.some((value) => value !== ''));
  return body.map((values) =>
    Object.fromEntries(headers.map((header, index) => [header.trim(), (values[index] ?? '').trim()])),
  );
}

function readCsv(directory, fileName) {
  const path = join(directory, fileName);
  if (!existsSync(path)) return [];
  return parseCsv(readFileSync(path, 'utf8'));
}

function newestCoverageExportDirectory() {
  const downloads = process.env.USERPROFILE ? join(process.env.USERPROFILE, 'Downloads') : '';
  if (!downloads || !existsSync(downloads)) return '';

  return readdirSync(downloads, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^https___accessfreetools\.com_-Coverage-/i.test(entry.name))
    .map((entry) => {
      const fullPath = join(downloads, entry.name);
      return { fullPath, mtime: statSync(fullPath).mtimeMs };
    })
    .sort((left, right) => right.mtime - left.mtime)[0]?.fullPath ?? '';
}

function numberField(value) {
  const number = Number(String(value ?? '').replace(/,/g, ''));
  return Number.isFinite(number) ? number : 0;
}

function normalizeChart(rows) {
  return rows.map((row) => ({
    date: row.Date ?? '',
    impressions: numberField(row.Impressions),
    indexed: numberField(row.Indexed),
    notIndexed: numberField(row['Not indexed']),
  }));
}

function normalizeIssues(rows) {
  return rows.map((row) => ({
    pages: numberField(row.Pages),
    reason: row.Reason ?? '',
    source: row.Source ?? '',
    validation: row.Validation ?? '',
  }));
}

function metadataObject(rows) {
  return Object.fromEntries(rows.map((row) => [row.Property, row.Value]).filter(([key]) => key));
}

function markdownList(items, empty = '- none') {
  return items.length ? items.map((item) => `- ${item}`).join('\n') : empty;
}

function issueLine(issue) {
  return `${issue.reason}: ${issue.pages} page(s), source ${issue.source || 'unknown'}, validation ${issue.validation || 'unknown'}`;
}

function buildActions(issues) {
  const actions = [];
  const byReason = new Map(issues.map((issue) => [issue.reason.toLowerCase(), issue]));
  const server = byReason.get('server error (5xx)');
  const notFound = byReason.get('not found (404)');
  const crawled = byReason.get('crawled - currently not indexed');
  const discovered = byReason.get('discovered - currently not indexed');

  if (server?.pages > 0) {
    actions.push({
      priority: 'high',
      task: `Export URL examples for the ${server.pages} Google 5xx page(s), then test each live URL and check Hostinger runtime logs for matching failures.`,
    });
  }

  if (notFound?.pages > 0) {
    actions.push({
      priority: 'medium',
      task: `Export the ${notFound.pages} 404 URL sample from Search Console. Redirect it if it is an old useful URL; leave it alone if it is junk or typo traffic.`,
    });
  }

  if ((crawled?.pages ?? 0) > 0) {
    actions.push({
      priority: 'medium',
      task: `Review representative crawled-not-indexed URLs. Improve only pages that are thin, duplicated, or missing a clear reason to exist.`,
    });
  }

  if ((discovered?.pages ?? 0) > 0) {
    actions.push({
      priority: 'medium',
      task: `Review representative discovered-not-indexed URLs. Prioritize internal links and manual inspection for important pages, not every low-priority URL at once.`,
    });
  }

  return actions;
}

const sourceDir = resolve(option('--dir') || newestCoverageExportDirectory());

if (!sourceDir || !existsSync(sourceDir)) {
  console.error('Google Coverage export directory not found. Pass --dir=C:\\path\\to\\Coverage-export or place the export under Downloads.');
  process.exit(1);
}

const chart = normalizeChart(readCsv(sourceDir, 'Chart.csv'));
const criticalIssues = normalizeIssues(readCsv(sourceDir, 'Critical issues.csv'));
const nonCriticalIssues = normalizeIssues(readCsv(sourceDir, 'Non-critical issues.csv'));
const metadata = metadataObject(readCsv(sourceDir, 'Metadata.csv'));
const first = chart[0] ?? null;
const latest = chart.at(-1) ?? null;
const allIssues = [...criticalIssues, ...nonCriticalIssues].filter((issue) => issue.reason);
const actions = buildActions(allIssues);
const report = {
  actions,
  chart,
  criticalIssues,
  files: ['Chart.csv', 'Critical issues.csv', 'Metadata.csv', 'Non-critical issues.csv'].filter((file) =>
    existsSync(join(sourceDir, file)),
  ),
  generatedAt: new Date().toISOString(),
  latest,
  metadata,
  nonCriticalIssues,
  sourceDir,
  status: criticalIssues.some((issue) => issue.pages > 0) ? 'attention' : 'pass',
  totals: {
    criticalPages: criticalIssues.reduce((sum, issue) => sum + issue.pages, 0),
    indexedDelta: first && latest ? latest.indexed - first.indexed : 0,
    latestIndexed: latest?.indexed ?? 0,
    latestNotIndexed: latest?.notIndexed ?? 0,
    nonCriticalPages: nonCriticalIssues.reduce((sum, issue) => sum + issue.pages, 0),
    notIndexedDelta: first && latest ? latest.notIndexed - first.notIndexed : 0,
  },
};

mkdirSync(dirname(OUTPUT_JSON), { recursive: true });
writeFileSync(OUTPUT_JSON, `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(
  OUTPUT_MD,
  `# Google Search Console Coverage Export

Generated: ${report.generatedAt}

Source: ${basename(sourceDir)}

Status: ${report.status}

## Latest Chart Row

- Date: ${latest?.date ?? 'unknown'}
- Indexed: ${latest?.indexed ?? 'unknown'}
- Not indexed: ${latest?.notIndexed ?? 'unknown'}
- Impressions: ${latest?.impressions ?? 'unknown'}
- Indexed change across export: ${report.totals.indexedDelta}
- Not-indexed change across export: ${report.totals.notIndexedDelta}

## Critical Issues

${markdownList(criticalIssues.map(issueLine))}

## Non-Critical Issues

${markdownList(nonCriticalIssues.map(issueLine))}

## Recommended Follow-Up

${markdownList(actions.map((action) => `${action.priority}: ${action.task}`))}
`,
);

console.log(`Imported Google Coverage export from ${sourceDir}`);
console.log(`Saved ${OUTPUT_JSON}`);
console.log(`Saved ${OUTPUT_MD}`);
if (actions.length) {
  console.log('Recommended follow-up:');
  for (const action of actions) console.log(`- ${action.priority}: ${action.task}`);
}
