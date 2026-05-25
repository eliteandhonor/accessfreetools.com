import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const DEFAULT_SOURCE = 'C:\\Users\\chamb\\Downloads\\Keyword Stats 2026-05-25 at 20_46_13.csv';
const SERPFORGE_DIR = resolve('agents', 'serpforge-ai');
const EVIDENCE_DIR = join(SERPFORGE_DIR, 'evidence');
const REPORTS_DIR = join(SERPFORGE_DIR, 'reports');

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function normalize(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function slugify(value) {
  return normalize(value).replace(/\s+/g, '-');
}

function parseNumber(value) {
  const clean = String(value ?? '').replace(/[$,%\s,]/g, '');
  const parsed = Number(clean);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parsePercent(value) {
  const text = String(value ?? '').trim();
  if (!text || text === '--') {
    return 0;
  }
  return parseNumber(text);
}

function parseTsvLine(line) {
  const cells = [];
  let current = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === '\t' && !quoted) {
      cells.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells;
}

function parseKeywordPlanner(path) {
  const rawBuffer = readFileSync(path);
  const encoding = rawBuffer[0] === 0xff && rawBuffer[1] === 0xfe ? 'utf16le' : 'utf8';
  const raw = rawBuffer.toString(encoding).replace(/^\uFEFF/, '');
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const title = lines[0] ?? '';
  const dateRange = (lines[1] ?? '').replace(/^"|"$/g, '');
  const headers = parseTsvLine(lines[2] ?? '');
  const rows = lines.slice(3).map((line) => {
    const cells = parseTsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? '']));
  });

  return { title, dateRange, headers, rows };
}

function buildPageIndex() {
  const sitemapPaths = [
    resolve('dist', 'sitemap.xml'),
    resolve('dist', 'sitemap-pages.xml'),
    resolve('dist', 'sitemap-tools.xml'),
    resolve('dist', 'sitemap-blog.xml'),
    resolve('dist', 'sitemap-categories.xml'),
    resolve('dist', 'sitemap-gallery.xml'),
  ].filter((path) => existsSync(path));

  if (sitemapPaths.length === 0) {
    throw new Error('dist/sitemap.xml is missing. Run npm run build before Keyword Planner analysis.');
  }

  const urls = [...new Set(sitemapPaths.flatMap((sitemapPath) => {
    const sitemap = readFileSync(sitemapPath, 'utf8');
    return [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  }))]
    .filter((url) => url.startsWith('https://accessfreetools.com/'))
    .map((url) => new URL(url).pathname)
    .filter((path) => !path.endsWith('.xml') && !path.endsWith('.txt'));

  return urls
    .map((path) => {
      const htmlPath = htmlPathForRoute(path);
      if (!existsSync(htmlPath)) return null;

      const html = readFileSync(htmlPath, 'utf8');
      const title = decodeHtml(extract(html, /<title>(.*?)<\/title>/is));
      const description = decodeHtml(extract(html, /<meta\s+name=["']description["']\s+content=["'](.*?)["']/is));
      const h1 = decodeHtml(extract(html, /<h1[^>]*>(.*?)<\/h1>/is).replace(/<[^>]+>/g, ' '));
      const text = decodeHtml(html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' '));
      const slug = path === '/' ? 'home' : path.split('/').filter(Boolean).at(-1) ?? 'home';

      return {
        kind: kindForPath(path),
        slug,
        title,
        path,
        text: normalize([title, description, h1, slug, text.slice(0, 4000)].join(' ')),
        category: path.startsWith('/categories/') ? slug : '',
        guidePath: path.startsWith('/tools/') ? `/blog/how-to-use-${slug}/` : '',
      };
    })
    .filter(Boolean);
}

function htmlPathForRoute(path) {
  const clean = path === '/' ? 'index' : path.replace(/^\/|\/$/g, '');
  return resolve('dist', clean, 'index.html');
}

function kindForPath(path) {
  if (path === '/') return 'home';
  if (path.startsWith('/tools/')) return 'tool';
  if (path.startsWith('/blog/')) return 'blog';
  if (path.startsWith('/categories/')) return 'category';
  if (path.startsWith('/gallery/')) return 'gallery';
  if (path.startsWith('/hubs/')) return 'hub';
  return 'site';
}

function extract(text, pattern) {
  return text.match(pattern)?.[1] ?? '';
}

function decodeHtml(value) {
  return String(value ?? '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function scoreMatch(keyword, page) {
  const keywordText = normalize(keyword);
  const keywordSlug = slugify(keyword);
  const tokens = keywordText.split(' ').filter(Boolean);
  const pageTokens = new Set(page.text.split(' '));
  const pageSlugText = page.slug.replace(/-/g, ' ');

  let score = 0;
  if (keywordSlug === page.slug) score += 100;
  if (`${keywordSlug}-calculator` === page.slug) score += 80;
  if (keywordSlug === page.slug.replace(/^how-to-use-/, '')) score += 70;
  if (keywordText === normalize(page.title)) score += 90;
  if (pageSlugText.includes(keywordText) || keywordText.includes(pageSlugText)) score += 35;

  for (const token of tokens) {
    if (pageTokens.has(token)) score += 4;
  }

  if (keywordText.includes('calculator') && page.kind === 'tool') score += 8;
  if (keywordText.includes('how to') && page.kind === 'blog') score += 12;
  if (keywordText.includes('guide') && page.kind === 'blog') score += 8;

  return score;
}

function bestPageMatch(keyword, pages) {
  const matches = pages
    .map((page) => ({ page, score: scoreMatch(keyword, page) }))
    .sort((a, b) => b.score - a.score);
  const best = matches[0];
  if (!best || best.score < 20) return null;
  return best;
}

function classifyIntent(keyword) {
  const text = normalize(keyword);
  if (text.includes('near me') || text.includes('company') || text.includes('service')) return 'local/commercial';
  if (text.startsWith('how to') || text.includes('formula') || text.includes('guide')) return 'guide';
  if (text.includes('calculator') || text.includes('converter') || text.includes('generator') || text.includes('tool')) return 'tool';
  if (text.includes('definition') || text.includes('meaning')) return 'informational';
  return 'mixed';
}

function formatNumber(value) {
  return Number(value ?? 0).toLocaleString('en-US');
}

function money(value) {
  const number = Number(value ?? 0);
  return number > 0 ? `$${number.toFixed(2)}` : '';
}

function main() {
  const sourceArg = process.argv.find((arg) => arg.startsWith('--source='))?.slice('--source='.length);
  const source = resolve(sourceArg ?? DEFAULT_SOURCE);
  if (!existsSync(source)) {
    throw new Error(`Keyword Planner export not found: ${source}`);
  }

  mkdirSync(EVIDENCE_DIR, { recursive: true });
  mkdirSync(REPORTS_DIR, { recursive: true });

  const importedEvidencePath = join(EVIDENCE_DIR, 'google-keyword-planner-2026-05-25.tsv');
  copyFileSync(source, importedEvidencePath);

  const { title, dateRange, rows } = parseKeywordPlanner(source);
  const pages = buildPageIndex();
  const analyzedRows = rows
    .map((row) => {
      const keyword = row.Keyword ?? '';
      const match = bestPageMatch(keyword, pages);
      const avgMonthlySearches = parseNumber(row['Avg. monthly searches']);
      const highBid = parseNumber(row['Top of page bid (high range)']);
      const lowBid = parseNumber(row['Top of page bid (low range)']);
      const opportunityScore = Math.round(avgMonthlySearches * Math.max(1, highBid || lowBid || 1));

      return {
        keyword,
        avgMonthlySearches,
        threeMonthChange: parsePercent(row['Three month change']),
        yoyChange: parsePercent(row['YoY change']),
        competition: row.Competition ?? '',
        competitionIndex: parseNumber(row['Competition (indexed value)']),
        lowBid,
        highBid,
        intent: classifyIntent(keyword),
        matchedKind: match?.page.kind ?? 'unmatched',
        matchedPath: match?.page.path ?? '',
        matchedTitle: match?.page.title ?? '',
        matchScore: match?.score ?? 0,
        opportunityScore,
      };
    })
    .sort((a, b) => b.avgMonthlySearches - a.avgMonthlySearches || b.opportunityScore - a.opportunityScore);

  const matched = analyzedRows.filter((row) => row.matchedPath);
  const unmatched = analyzedRows.filter((row) => !row.matchedPath);
  const highDemandMatched = matched.filter((row) => row.avgMonthlySearches >= 50_000);
  const highDemandUnmatched = unmatched.filter((row) => row.avgMonthlySearches >= 10_000);
  const highBid = analyzedRows
    .filter((row) => row.highBid >= 4)
    .sort((a, b) => b.highBid - a.highBid || b.avgMonthlySearches - a.avgMonthlySearches)
    .slice(0, 30);
  const rising = analyzedRows
    .filter((row) => row.threeMonthChange > 0 || row.yoyChange > 0)
    .sort((a, b) => b.threeMonthChange + b.yoyChange - (a.threeMonthChange + a.yoyChange))
    .slice(0, 30);

  const pathStats = new Map();
  for (const row of matched) {
    const current = pathStats.get(row.matchedPath) ?? {
      path: row.matchedPath,
      title: row.matchedTitle,
      kind: row.matchedKind,
      keywordCount: 0,
      totalMonthlySearches: 0,
      maxBid: 0,
      topKeywords: [],
    };
    current.keywordCount += 1;
    current.totalMonthlySearches += row.avgMonthlySearches;
    current.maxBid = Math.max(current.maxBid, row.highBid);
    current.topKeywords.push(row);
    pathStats.set(row.matchedPath, current);
  }

  const pagePriorities = [...pathStats.values()]
    .map((item) => ({
      ...item,
      topKeywords: item.topKeywords
        .sort((a, b) => b.avgMonthlySearches - a.avgMonthlySearches || b.highBid - a.highBid)
        .slice(0, 5),
    }))
    .sort((a, b) => b.totalMonthlySearches - a.totalMonthlySearches || b.maxBid - a.maxBid)
    .slice(0, 50);

  const report = {
    generatedAt: new Date().toISOString(),
    source,
    importedEvidencePath,
    title,
    dateRange,
    totals: {
      rows: analyzedRows.length,
      matched: matched.length,
      unmatched: unmatched.length,
      highDemandMatched: highDemandMatched.length,
      highDemandUnmatched: highDemandUnmatched.length,
    },
    topMatchedKeywords: highDemandMatched.slice(0, 60),
    topUnmatchedKeywords: highDemandUnmatched.slice(0, 60),
    highBidKeywords: highBid,
    risingKeywords: rising,
    pagePriorities,
  };

  const jsonPath = join(REPORTS_DIR, `serpforge-google-keyword-planner-2026-05-25-${stamp()}.json`);
  const mdPath = jsonPath.replace(/\.json$/, '.md');
  writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(mdPath, markdownReport(report));

  console.log(`Imported Keyword Planner evidence: ${importedEvidencePath}`);
  console.log(`Rows analyzed: ${analyzedRows.length}`);
  console.log(`Matched to existing pages: ${matched.length}`);
  console.log(`High-demand unmatched opportunities: ${highDemandUnmatched.length}`);
  console.log(`Saved report: ${mdPath}`);
}

function tableRows(rows, columns) {
  if (rows.length === 0) {
    return ['- none'];
  }

  const header = `| ${columns.map((column) => column.label).join(' |')} |`;
  const divider = `| ${columns.map(() => '---').join(' |')} |`;
  const body = rows.map((row) => `| ${columns.map((column) => column.value(row)).join(' |')} |`);
  return [header, divider, ...body];
}

function markdownReport(report) {
  const lines = [
    '# SERPForge Google Keyword Planner Evidence',
    '',
    `Generated: ${report.generatedAt}`,
    `Source: ${basename(report.source)}`,
    `Date range: ${report.dateRange}`,
    `Evidence copy: ${report.importedEvidencePath}`,
    '',
    '## Counts',
    '',
    `- Rows analyzed: ${report.totals.rows}`,
    `- Matched to existing pages: ${report.totals.matched}`,
    `- Unmatched keyword rows: ${report.totals.unmatched}`,
    `- High-demand matched rows: ${report.totals.highDemandMatched}`,
    `- High-demand unmatched rows: ${report.totals.highDemandUnmatched}`,
    '',
    '## Best Existing-Page Priorities',
    '',
    ...tableRows(report.pagePriorities.slice(0, 25), [
      { label: 'page', value: (row) => row.path },
      { label: 'monthly demand', value: (row) => formatNumber(row.totalMonthlySearches) },
      { label: 'keywords', value: (row) => String(row.keywordCount) },
      { label: 'max high bid', value: (row) => money(row.maxBid) },
      { label: 'top keywords', value: (row) => row.topKeywords.map((keyword) => keyword.keyword).join(', ') },
    ]),
    '',
    '## High-Demand Matched Keywords',
    '',
    ...tableRows(report.topMatchedKeywords.slice(0, 25), [
      { label: 'keyword', value: (row) => row.keyword },
      { label: 'monthly searches', value: (row) => formatNumber(row.avgMonthlySearches) },
      { label: 'intent', value: (row) => row.intent },
      { label: 'matched page', value: (row) => row.matchedPath },
      { label: 'high bid', value: (row) => money(row.highBid) },
    ]),
    '',
    '## High-Demand Unmatched Opportunities',
    '',
    ...tableRows(report.topUnmatchedKeywords.slice(0, 25), [
      { label: 'keyword', value: (row) => row.keyword },
      { label: 'monthly searches', value: (row) => formatNumber(row.avgMonthlySearches) },
      { label: 'intent', value: (row) => row.intent },
      { label: 'competition', value: (row) => row.competition },
      { label: 'high bid', value: (row) => money(row.highBid) },
    ]),
    '',
    '## High-Bid Keywords',
    '',
    ...tableRows(report.highBidKeywords.slice(0, 20), [
      { label: 'keyword', value: (row) => row.keyword },
      { label: 'monthly searches', value: (row) => formatNumber(row.avgMonthlySearches) },
      { label: 'matched page', value: (row) => row.matchedPath || 'unmatched' },
      { label: 'low-high bid', value: (row) => `${money(row.lowBid)}-${money(row.highBid)}` },
    ]),
    '',
    '## Rising Keywords',
    '',
    ...tableRows(report.risingKeywords.slice(0, 20), [
      { label: 'keyword', value: (row) => row.keyword },
      { label: 'monthly searches', value: (row) => formatNumber(row.avgMonthlySearches) },
      { label: '3mo', value: (row) => `${row.threeMonthChange}%` },
      { label: 'YoY', value: (row) => `${row.yoyChange}%` },
      { label: 'matched page', value: (row) => row.matchedPath || 'unmatched' },
    ]),
    '',
    '## Use Rules',
    '',
    '- Use this as demand evidence, not as permission to stuff keywords into copy.',
    '- Existing page matches should guide page priority, titles, examples, and internal links only when the wording stays helpful.',
    '- Unmatched opportunities need a usefulness check before a new page is created.',
  ];

  return `${lines.join('\n')}\n`;
}

main();
