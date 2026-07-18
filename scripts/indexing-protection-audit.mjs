import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, normalize, relative, resolve } from 'node:path';

import { loadLatestSearchConsoleInspectionEvidence } from './lib/search-console-inspection-evidence.mjs';

const SITE_ORIGIN = 'https://accessfreetools.com';
const args = process.argv.slice(2);
const warnOnly = args.includes('--warn-only') || process.env.npm_config_warn_only === 'true';
const distDir = resolve('dist');
const publicDistDir = existsSync(join(distDir, 'client')) ? join(distDir, 'client') : distDir;
const outputDir = resolve(
  args.find((arg) => arg.startsWith('--output-dir='))?.slice('--output-dir='.length) ??
    join('output', 'indexing-protection', localDateStamp()),
);

const legacyRedirects = [
  {
    url: `${SITE_ORIGIN}/calculators`,
    expectedDestination: `${SITE_ORIGIN}/categories/calculators/`,
  },
  {
    url: `${SITE_ORIGIN}/deep-research`,
    expectedDestination: `${SITE_ORIGIN}/categories/ai-tools/`,
  },
  {
    url: `${SITE_ORIGIN}/advanced-age-calculator`,
    expectedDestination: `${SITE_ORIGIN}/tools/age-calculator/`,
  },
  {
    url: `${SITE_ORIGIN}/maximize-your-revenue-the-ultimate-free-google-adsense-earnings-calculator-for-2025`,
    expectedDestination: `${SITE_ORIGIN}/tools/ad-revenue-calculator/`,
  },
];

if (!existsSync(distDir)) {
  throw new Error('dist folder is missing. Run npm run build before npm run audit:indexing-protection.');
}

function localDateStamp(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone: process.env.AFT_AUDIT_TIME_ZONE ?? 'Australia/Brisbane',
    year: 'numeric',
  }).formatToParts(date);
  const value = (type) => parts.find((part) => part.type === type)?.value ?? '';

  return `${value('year')}-${value('month')}-${value('day')}`;
}

function walk(directory, predicate, files = []) {
  if (!existsSync(directory)) return files;

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath, predicate, files);
    } else if (entry.isFile() && predicate(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

function decodeHtml(value = '') {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
}

function stripTags(value = '') {
  return decodeHtml(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim();
}

function getAttribute(tag, attributeName) {
  const match = tag.match(new RegExp(`\\b${attributeName}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i'));
  return match ? decodeHtml(match[2].trim()) : '';
}

function getMetaContent(html, key, value) {
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];

  for (const tag of metaTags) {
    if (getAttribute(tag, key).toLowerCase() === value.toLowerCase()) {
      return getAttribute(tag, 'content');
    }
  }

  return '';
}

function getCanonical(html) {
  const linkTags = html.match(/<link\b[^>]*>/gi) ?? [];

  for (const tag of linkTags) {
    const relTokens = getAttribute(tag, 'rel').toLowerCase().split(/\s+/).filter(Boolean);
    if (relTokens.includes('canonical')) {
      return getAttribute(tag, 'href');
    }
  }

  return '';
}

function pagePathForHtmlFile(htmlFile) {
  const rel = relative(publicDistDir, htmlFile).replace(/\\/g, '/');

  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel.replace(/\.html$/i, '/')}`;
}

function readSitemapUrls() {
  const sitemapPath = join(publicDistDir, 'sitemap.xml');
  const urls = new Set();
  const sitemapFiles = new Set();
  const warnings = [];

  function locToFile(loc) {
    try {
      const url = new URL(decodeHtml(loc), SITE_ORIGIN);
      if (url.origin !== SITE_ORIGIN) {
        warnings.push(`Sitemap loc points outside ${SITE_ORIGIN}: ${loc}`);
        return '';
      }

      return join(publicDistDir, url.pathname.replace(/^\/+/, ''));
    } catch {
      warnings.push(`Sitemap loc is invalid: ${loc}`);
      return '';
    }
  }

  function readSitemapFile(file) {
    const normalized = normalize(file);
    if (sitemapFiles.has(normalized)) return;
    sitemapFiles.add(normalized);

    if (!existsSync(file)) {
      warnings.push(`Referenced sitemap file is missing: ${normalized}`);
      return;
    }

    const xml = readFileSync(file, 'utf8');
    const locs = [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map((match) => match[1].trim());

    if (/<sitemapindex\b/i.test(xml)) {
      for (const loc of locs) {
        const child = locToFile(loc);
        if (child) readSitemapFile(child);
      }
      return;
    }

    for (const loc of locs) {
      urls.add(decodeHtml(loc));
    }
  }

  if (!existsSync(sitemapPath)) {
    warnings.push('dist sitemap.xml is missing.');
    return { urls, warnings, sitemapFiles: [] };
  }

  readSitemapFile(sitemapPath);
  return { urls, warnings, sitemapFiles: [...sitemapFiles] };
}

function readJsonIfExists(path) {
  try {
    return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null;
  } catch (error) {
    return { parseError: error instanceof Error ? error.message : String(error), path };
  }
}

function extractMainHtml(html) {
  return html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
}

function words(text) {
  return text.match(/[A-Za-z0-9]+(?:'[A-Za-z]+)?/g) ?? [];
}

function addMap(map, key, value) {
  if (!key) return;
  const list = map.get(key) ?? [];
  list.push(value);
  map.set(key, list);
}

function searchConsoleGaps() {
  const report = loadLatestSearchConsoleInspectionEvidence({ write: true });
  if (!report || report.parseError || !Array.isArray(report.inspections)) {
    return { available: false, generatedAt: report?.generatedAt ?? '', gaps: [], parseError: report?.parseError ?? '' };
  }

  const gaps = report.inspections
    .map((item) => ({
      url: item.inspectionUrl,
      verdict: item.verdict ?? 'unknown',
      state: item.coverageState ?? item.error ?? 'unknown',
      lastCrawlTime: item.lastCrawlTime ?? '',
      googleCanonical: item.googleCanonical ?? '',
      userCanonical: item.userCanonical ?? '',
    }))
    .filter((item) => {
      const joined = `${item.verdict} ${item.state}`.toLowerCase();
      return item.verdict !== 'PASS' || /unknown|not indexed|discovered|crawled/.test(joined);
    });

  return {
    available: true,
    generatedAt: report.generatedAt ?? '',
    site: report.site ?? null,
    gaps,
  };
}

function crawlScoutSignals() {
  const report = readJsonIfExists(resolve('output', 'crawlscout', 'crawlscout-summary.json'));
  if (!report || report.parseError) {
    return { available: false, parseError: report?.parseError ?? '' };
  }

  const nonIndexed = (report.pageSample ?? []).filter((page) => !/^indexed$/i.test(String(page.status ?? '')));
  return {
    available: true,
    generatedAt: report.generatedAt ?? '',
    overview: report.overview ?? {},
    nonIndexedSample: nonIndexed.slice(0, 20),
    keywordSignals: report.topKeywordSignals ?? [],
  };
}

function productionRedirectSignals() {
  const report = readJsonIfExists(resolve('output', 'production-sitemap-check.json'));
  if (!report || report.parseError) {
    return {
      available: false,
      parseError: report?.parseError ?? '',
      legacyRedirects: legacyRedirects.map((item) => ({ ...item, status: 'not-checked' })),
    };
  }

  const results = [...(report.failures ?? []), ...(report.redirectSamples ?? [])];
  const checked = legacyRedirects.map((legacy) => {
    const result = results.find((item) => item.url === legacy.url);
    if (!result) {
      return { ...legacy, status: 'not-in-report' };
    }

    const okStatus = Number(result.status) >= 300 && Number(result.status) < 400;
    const location = result.location ?? '';
    const locationMatches =
      !location ||
      location === legacy.expectedDestination ||
      location === new URL(legacy.expectedDestination).pathname;

    return {
      ...legacy,
      status: okStatus && locationMatches ? 'ok' : 'review',
      httpStatus: result.status,
      location,
      error: result.error ?? '',
    };
  });

  return {
    available: true,
    generatedAt: report.generatedAt ?? '',
    checked: report.checked ?? 0,
    hardFailures: report.hardFailures ?? 0,
    legacyRedirects: checked,
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

const sitemap = readSitemapUrls();
const localHighIssues = [];
const localWarnings = [...sitemap.warnings];
const titleMap = new Map();
const descriptionMap = new Map();
const htmlFiles = walk(publicDistDir, (file) => file.endsWith('.html'));
const pageReports = [];

for (const htmlFile of htmlFiles) {
  if (/^google[a-f0-9]+\.html$/i.test(basename(htmlFile))) continue;

  const html = readFileSync(htmlFile, 'utf8');
  const pagePath = pagePathForHtmlFile(htmlFile);
  const expectedUrl = `${SITE_ORIGIN}${pagePath}`;
  const title = stripTags(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '');
  const description = getMetaContent(html, 'name', 'description');
  const canonical = getCanonical(html);
  const robots = getMetaContent(html, 'name', 'robots').toLowerCase();
  const h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => stripTags(match[1])).filter(Boolean);
  const mainText = stripTags(extractMainHtml(html));
  const mainWordCount = words(mainText).length;
  const isIndexable = !robots.includes('noindex');
  const selfCanonical = canonical === expectedUrl;
  const issuePrefix = `${relative(process.cwd(), htmlFile).replace(/\\/g, '/')}`;
  const isVerificationOrAdmin = /^\/(?:admin|api)\//.test(pagePath);

  if (isIndexable && !isVerificationOrAdmin) {
    if (!title) localHighIssues.push(`${issuePrefix} is indexable but missing title.`);
    if (!description) localHighIssues.push(`${issuePrefix} is indexable but missing meta description.`);
    if (!canonical) localHighIssues.push(`${issuePrefix} is indexable but missing canonical.`);
    if (canonical && !canonical.startsWith(`${SITE_ORIGIN}/`)) {
      localHighIssues.push(`${issuePrefix} canonical is off-site: ${canonical}`);
    }
    if (selfCanonical && !sitemap.urls.has(expectedUrl)) {
      localHighIssues.push(`${issuePrefix} is indexable and self-canonical but missing from sitemap.`);
    }
    if (h1.length !== 1) {
      localHighIssues.push(`${issuePrefix} is indexable and should have one H1; found ${h1.length}.`);
    }
    if (mainWordCount < 40) {
      localHighIssues.push(`${issuePrefix} has only ${mainWordCount} visible main-content words and looks soft-404 risky.`);
    } else if (mainWordCount < 120) {
      localWarnings.push(`${issuePrefix} has ${mainWordCount} visible main-content words; review for thin-page risk.`);
    }
    if (/(?:^|\b)(404|not found|forbidden|page unavailable|access denied)(?:\b|$)/i.test(`${title} ${h1.join(' ')}`)) {
      localHighIssues.push(`${issuePrefix} title/H1 looks like an error page while indexable.`);
    }
    if (selfCanonical) {
      addMap(titleMap, title.toLowerCase(), pagePath);
      addMap(descriptionMap, description.toLowerCase(), pagePath);
    }
  }

  if (!isIndexable && sitemap.urls.has(expectedUrl)) {
    localHighIssues.push(`${issuePrefix} is noindex but present in sitemap.`);
  }

  if (canonical && !selfCanonical && sitemap.urls.has(expectedUrl)) {
    localHighIssues.push(`${issuePrefix} is canonicalized to ${canonical} but present in sitemap as ${expectedUrl}.`);
  }

  pageReports.push({
    path: pagePath,
    expectedUrl,
    file: relative(process.cwd(), htmlFile).replace(/\\/g, '/'),
    indexable: isIndexable,
    selfCanonical,
    inSitemap: sitemap.urls.has(expectedUrl),
    title,
    descriptionLength: description.length,
    canonical,
    h1Count: h1.length,
    mainWordCount,
  });
}

for (const [title, pages] of titleMap.entries()) {
  if (title && pages.length > 1) {
    localHighIssues.push(`Duplicate indexable title "${title}" on ${pages.join(', ')}.`);
  }
}

for (const [description, pages] of descriptionMap.entries()) {
  if (description && pages.length > 1) {
    localHighIssues.push(`Duplicate indexable meta description "${description}" on ${pages.join(', ')}.`);
  }
}

const searchConsole = searchConsoleGaps();
const crawlScout = crawlScoutSignals();
const productionRedirects = productionRedirectSignals();
const thinWarnings = pageReports
  .filter((page) => page.indexable && page.selfCanonical && page.mainWordCount >= 40 && page.mainWordCount < 160)
  .sort((left, right) => left.mainWordCount - right.mainWordCount)
  .slice(0, 30);
const report = {
  generatedAt: new Date().toISOString(),
  source: 'Search Engine Land task board P0 indexing protection',
  outputDir,
  totals: {
    htmlFiles: htmlFiles.length,
    auditedPages: pageReports.length,
    sitemapUrls: sitemap.urls.size,
    highIssues: localHighIssues.length,
    warnings: localWarnings.length,
    searchConsoleGaps: searchConsole.gaps?.length ?? 0,
    crawlScoutNonIndexedSample: crawlScout.nonIndexedSample?.length ?? 0,
  },
  localHighIssues,
  localWarnings,
  thinWarnings,
  searchConsole,
  crawlScout,
  productionRedirects,
  pageSample: pageReports.slice(0, 40),
};

function renderMarkdown(value) {
  const lines = [
    '# Indexing Protection Audit',
    '',
    `Generated: ${value.generatedAt}`,
    '',
    '## Local Build',
    '',
    `- HTML files audited: ${value.totals.auditedPages}`,
    `- Sitemap URLs found: ${value.totals.sitemapUrls}`,
    `- High-severity local issues: ${value.totals.highIssues}`,
    `- Local warnings: ${value.totals.warnings}`,
    '',
    '## High-Severity Local Issues',
    '',
    ...(value.localHighIssues.length ? value.localHighIssues.map((issue) => `- ${issue}`) : ['- None.']),
    '',
    '## Search Console Gaps',
    '',
  ];

  if (!value.searchConsole.available) {
    lines.push(`- Search Console URL inspection snapshot unavailable.${value.searchConsole.parseError ? ` ${value.searchConsole.parseError}` : ''}`);
  } else if (!value.searchConsole.gaps.length) {
    lines.push(`- No gaps in saved snapshot from ${value.searchConsole.generatedAt}.`);
  } else {
    for (const gap of value.searchConsole.gaps.slice(0, 20)) {
      lines.push(`- ${gap.url}: ${gap.verdict} / ${gap.state}${gap.lastCrawlTime ? ` (last crawl ${gap.lastCrawlTime})` : ''}`);
    }
  }

  lines.push('', '## CrawlScout Signals', '');

  if (!value.crawlScout.available) {
    lines.push('- CrawlScout snapshot unavailable.');
  } else {
    lines.push(`- Generated: ${value.crawlScout.generatedAt}`);
    lines.push(`- Indexed: ${value.crawlScout.overview.indexed ?? 'unknown'}; submitted: ${value.crawlScout.overview.submitted ?? 'unknown'}; not indexed: ${value.crawlScout.overview.notIndexed ?? 'unknown'}`);
    if (value.crawlScout.nonIndexedSample.length) {
      lines.push('- Non-indexed/submitted sample:');
      for (const page of value.crawlScout.nonIndexedSample.slice(0, 10)) {
        lines.push(`  - ${page.status}: ${page.path}`);
      }
    }
  }

  lines.push('', '## Legacy Redirect Watch', '');

  if (!value.productionRedirects.available) {
    lines.push('- Production sitemap/redirect report unavailable. Run `npm run check:production-sitemap -- --warn-only` for fresh proof.');
  } else {
    for (const item of value.productionRedirects.legacyRedirects) {
      lines.push(`- ${item.status}: ${item.url} -> ${item.location || item.expectedDestination}`);
    }
  }

  lines.push('', '## Thin-Page Watch Sample', '');
  if (value.thinWarnings.length) {
    for (const page of value.thinWarnings.slice(0, 15)) {
      lines.push(`- ${page.path}: ${page.mainWordCount} main-content words`);
    }
  } else {
    lines.push('- No thin-page watch sample found.');
  }

  lines.push('', '## Next Action', '');
  if (value.localHighIssues.length) {
    lines.push('- Fix high-severity local issues before adding new pages.');
  } else if (value.searchConsole.gaps?.length) {
    lines.push('- Local build is clean. Improve internal links and discovery signals for the Search Console gap URLs.');
  } else {
    lines.push('- Local build is clean. Keep monitoring Search Console, Bing, CrawlScout, and production redirects.');
  }

  return `${lines.join('\n')}\n`;
}

writeJson(join(outputDir, 'summary.json'), report);
writeText(join(outputDir, 'summary.md'), renderMarkdown(report));

console.log(`Indexing protection audit complete.`);
console.log(`HTML pages: ${report.totals.auditedPages}`);
console.log(`High issues: ${report.totals.highIssues}`);
console.log(`Warnings: ${report.totals.warnings}`);
console.log(`Search Console gaps: ${report.totals.searchConsoleGaps}`);
console.log(`Report: ${join(outputDir, 'summary.md')}`);

if (localHighIssues.length && !warnOnly) {
  process.exitCode = 1;
}
