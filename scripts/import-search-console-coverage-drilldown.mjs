import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';

const OUTPUT_JSON = resolve('output/search-console-coverage-drilldown.json');
const OUTPUT_MD = resolve('output/search-console-coverage-drilldown.md');

function option(...names) {
  for (const name of names) {
    const prefix = `${name}=`;
    const found = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
    if (found) return found.slice(prefix.length);

    const envKey = `npm_config_${name.replace(/^--/, '').replace(/-/g, '_')}`;
    if (process.env[envKey]) return process.env[envKey];
  }

  return '';
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

function newestDrilldownSource() {
  const downloads = process.env.USERPROFILE ? join(process.env.USERPROFILE, 'Downloads') : '';
  if (!downloads || !existsSync(downloads)) return '';

  return readdirSync(downloads, { withFileTypes: true })
    .filter((entry) => /^https___accessfreetools\.com_-Coverage-Drilldown-/i.test(entry.name))
    .map((entry) => {
      const fullPath = join(downloads, entry.name);
      return { fullPath, mtime: statSync(fullPath).mtimeMs };
    })
    .sort((left, right) => right.mtime - left.mtime)[0]?.fullPath ?? '';
}

function readFromZip(zipPath, fileName) {
  const result = spawnSync('tar', ['-xOf', zipPath, fileName], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.status !== 0) {
    throw new Error(`Could not read ${fileName} from ${zipPath}: ${result.stderr || result.stdout}`);
  }

  return result.stdout;
}

function readSourceCsv(source, fileName) {
  if (statSync(source).isDirectory()) {
    const path = join(source, fileName);
    if (!existsSync(path)) return [];
    return parseCsv(readFileSync(path, 'utf8'));
  }

  if (extname(source).toLowerCase() === '.zip') {
    return parseCsv(readFromZip(source, fileName));
  }

  throw new Error(`Unsupported Coverage Drilldown source: ${source}`);
}

function metadataObject(rows) {
  return Object.fromEntries(rows.map((row) => [row.Property, row.Value]).filter(([key]) => key));
}

function numberField(value) {
  const number = Number(String(value ?? '').replace(/,/g, ''));
  return Number.isFinite(number) ? number : 0;
}

function urlType(url) {
  if (url.includes('/tools/')) return 'tool';
  if (url.includes('/blog/')) return 'blog';
  if (url.includes('/categories/')) return 'category';
  if (url.includes('/gallery/')) return 'gallery';
  if (url.endsWith('/feed.xml')) return 'feed';
  if (url.includes('/sitemap/')) return 'html-sitemap';
  return 'other';
}

function groupCounts(items, keyFn) {
  return Object.fromEntries(
    [...Map.groupBy(items, keyFn)]
      .map(([key, values]) => [String(key), values.length])
      .sort(([left], [right]) => left.localeCompare(right)),
  );
}

function buildActions(metadata, rows) {
  const issue = String(metadata.Issue ?? '').toLowerCase();
  const hasHtmlSitemap = rows.some((row) => row.type === 'html-sitemap');
  const hasToolOrBlog = rows.some((row) => row.type === 'tool' || row.type === 'blog');
  const actions = [];

  if (hasHtmlSitemap) {
    actions.push({
      priority: 'high',
      task: 'Confirm /sitemap/ is noindex,follow and absent from XML sitemaps; then wait for Google to recrawl before restarting validation.',
    });
  }

  if (issue.includes('crawled - currently not indexed') && hasToolOrBlog) {
    actions.push({
      priority: 'medium',
      task: 'Review newest affected tool/blog URLs with the SEO workbench. Improve pages only where the workbench finds content, internal-link, canonical, or usefulness gaps.',
    });
  }

  actions.push({
    priority: 'medium',
    task: 'Submit all XML sitemaps and IndexNow after any verified fix; use URL Inspection on a small priority sample instead of bulk-changing hundreds of healthy pages.',
  });

  return actions;
}

function markdownList(items, empty = '- none') {
  return items.length ? items.map((item) => `- ${item}`).join('\n') : empty;
}

const source = resolve(option('--source', '--dir') || newestDrilldownSource());

if (!source || !existsSync(source)) {
  console.error(
    'Google Coverage Drilldown export not found. Pass --source=C:\\path\\to\\Coverage-Drilldown.zip or an extracted drilldown directory.',
  );
  process.exit(1);
}

const chart = readSourceCsv(source, 'Chart.csv').map((row) => ({
  affectedPages: numberField(row['Affected pages']),
  date: row.Date ?? '',
}));
const metadata = metadataObject(readSourceCsv(source, 'Metadata.csv'));
const rows = readSourceCsv(source, 'Table.csv').map((row) => ({
  lastCrawled: row['Last crawled'] ?? '',
  type: urlType(row.URL ?? ''),
  url: row.URL ?? '',
}));

const latest = chart.at(-1) ?? null;
const newestExamples = [...rows]
  .sort((left, right) => String(right.lastCrawled).localeCompare(String(left.lastCrawled)))
  .slice(0, 25);
const report = {
  actions: buildActions(metadata, rows),
  chart,
  files: ['Chart.csv', 'Metadata.csv', 'Table.csv'],
  generatedAt: new Date().toISOString(),
  latest,
  metadata,
  newestExamples,
  rows,
  source,
  sourceName: basename(source),
  totals: {
    latestAffectedPages: latest?.affectedPages ?? 0,
    rowCount: rows.length,
    rowsByLastCrawled: groupCounts(rows, (row) => row.lastCrawled),
    rowsByType: groupCounts(rows, (row) => row.type),
  },
  type: 'coverage-drilldown',
};

mkdirSync(dirname(OUTPUT_JSON), { recursive: true });
writeFileSync(OUTPUT_JSON, `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(
  OUTPUT_MD,
  `# Google Search Console Coverage Drilldown

Generated: ${report.generatedAt}

Source: ${report.sourceName}

Sitemap scope: ${metadata.Sitemap ?? 'unknown'}

Issue: ${metadata.Issue ?? 'unknown'}

## Summary

- Export URL rows: ${report.totals.rowCount}
- Latest affected pages in chart: ${report.totals.latestAffectedPages}
- URL types: ${Object.entries(report.totals.rowsByType)
    .map(([type, count]) => `${type} ${count}`)
    .join(', ')}

## Newest URL Examples

${markdownList(newestExamples.map((row) => `${row.url} (${row.type}, last crawled ${row.lastCrawled || 'unknown'})`))}

## Recommended Actions

${markdownList(report.actions.map((action) => `${action.priority}: ${action.task}`))}
`,
);

console.log(`Imported Google Coverage Drilldown from ${source}`);
console.log(`Rows: ${report.totals.rowCount}; issue: ${metadata.Issue ?? 'unknown'}`);
console.log(`Wrote ${OUTPUT_JSON}`);
