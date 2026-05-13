import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const SITE_ORIGIN = 'https://accessfreetools.com';
const args = process.argv.slice(2);
const warnOnly = args.includes('--warn-only') || process.env.npm_config_warn_only === 'true';
const distDir = resolve('dist');
const publicDistDir = existsSync(join(distDir, 'client')) ? join(distDir, 'client') : distDir;
const outputDir = resolve(
  args.find((arg) => arg.startsWith('--output-dir='))?.slice('--output-dir='.length) ??
    join('output', 'ai-crawler-visibility', localDateStamp()),
);

const crawlerProfiles = [
  'Googlebot',
  'Bingbot',
  'GPTBot',
  'ClaudeBot',
  'PerplexityBot',
  'Non-JS text fetcher',
];

const priorityPages = [
  { path: '/', type: 'home', minWords: 180, minInternalLinks: 8 },
  { path: '/tools/', type: 'hub', minWords: 180, minInternalLinks: 25 },
  { path: '/blog/', type: 'hub', minWords: 180, minInternalLinks: 10 },
  { path: '/why-access-free-tools/', type: 'mission', minWords: 220, minInternalLinks: 5 },
  { path: '/categories/calculators/', type: 'hub', minWords: 180, minInternalLinks: 12 },
  { path: '/categories/ai-tools/', type: 'ai-hub', minWords: 220, minInternalLinks: 12 },
  { path: '/tools/basic-calculator/', type: 'tool', minWords: 260, minInternalLinks: 8 },
  { path: '/tools/mortgage-calculator/', type: 'tool', minWords: 320, minInternalLinks: 8 },
  { path: '/tools/bmi-calculator/', type: 'tool', minWords: 320, minInternalLinks: 8 },
  { path: '/tools/image-to-text-ocr-tool/', type: 'ai-tool', minWords: 360, minInternalLinks: 8 },
  { path: '/tools/json-formatter/', type: 'tool', minWords: 260, minInternalLinks: 8 },
  { path: '/tools/watts-to-amps-calculator/', type: 'tool', minWords: 320, minInternalLinks: 8 },
];

if (!existsSync(distDir)) {
  throw new Error('dist folder is missing. Run npm run build before npm run audit:ai-crawler.');
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

function htmlFileForPath(path) {
  const normalized = path === '/' ? 'index.html' : `${path.replace(/^\/+|\/+$/g, '')}/index.html`;
  return join(publicDistDir, normalized);
}

function extractMainHtml(html) {
  return html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
}

function words(text) {
  return text.match(/[A-Za-z0-9]+(?:'[A-Za-z]+)?/g) ?? [];
}

function internalLinks(html) {
  const hrefs = [...html.matchAll(/<a\b[^>]*href\s*=\s*(["'])([\s\S]*?)\1/gi)]
    .map((match) => decodeHtml(match[2].trim()))
    .filter((href) => href.startsWith('/') || href.startsWith(SITE_ORIGIN));

  return [...new Set(hrefs.map((href) => {
    if (href.startsWith(SITE_ORIGIN)) {
      const url = new URL(href);
      return `${url.pathname}${url.search}`;
    }
    return href;
  }))];
}

function jsonLdTypes(html) {
  const blocks = [...html.matchAll(/<script\b[^>]*type\s*=\s*(["'])application\/ld\+json\1[^>]*>([\s\S]*?)<\/script>/gi)];
  const types = new Set();

  function addTypes(value) {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      value.forEach(addTypes);
      return;
    }
    if (value['@type']) types.add(Array.isArray(value['@type']) ? value['@type'].join(',') : value['@type']);
    if (value['@graph']) addTypes(value['@graph']);
    if (value.mainEntity) addTypes(value.mainEntity);
  }

  for (const [, , raw] of blocks) {
    try {
      addTypes(JSON.parse(decodeHtml(raw.trim())));
    } catch {
      types.add('parse-error');
    }
  }

  return [...types];
}

function hasAny(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

function auditPage(page) {
  const file = htmlFileForPath(page.path);
  const issues = [];
  const warnings = [];

  if (!existsSync(file)) {
    return {
      ...page,
      file,
      status: 'missing',
      title: '',
      h1: [],
      mainWordCount: 0,
      internalLinkCount: 0,
      jsonLdTypes: [],
      issues: [`Built HTML file is missing for ${page.path}.`],
      warnings,
    };
  }

  const html = readFileSync(file, 'utf8');
  const mainHtml = extractMainHtml(html);
  const mainText = stripTags(mainHtml);
  const allText = stripTags(html);
  const title = stripTags(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '');
  const description = getMetaContent(html, 'name', 'description');
  const canonical = getCanonical(html);
  const robots = getMetaContent(html, 'name', 'robots').toLowerCase();
  const h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => stripTags(match[1])).filter(Boolean);
  const links = internalLinks(html);
  const types = jsonLdTypes(html);
  const mainWordCount = words(mainText).length;
  const expectedCanonical = `${SITE_ORIGIN}${page.path}`;

  if (robots.includes('noindex')) issues.push(`${page.path} is noindex but is a priority crawler page.`);
  if (!title) issues.push(`${page.path} is missing a title.`);
  if (!description) issues.push(`${page.path} is missing a meta description.`);
  if (canonical !== expectedCanonical) issues.push(`${page.path} canonical is ${canonical || 'missing'}; expected ${expectedCanonical}.`);
  if (h1.length !== 1) issues.push(`${page.path} should expose one H1 in initial HTML; found ${h1.length}.`);
  if (mainWordCount < page.minWords) {
    issues.push(`${page.path} exposes ${mainWordCount} main-content words; expected at least ${page.minWords} for crawler clarity.`);
  }
  if (links.length < page.minInternalLinks) {
    issues.push(`${page.path} exposes ${links.length} internal links; expected at least ${page.minInternalLinks}.`);
  }

  if (page.type.includes('tool')) {
    if (!types.includes('WebApplication')) warnings.push(`${page.path} does not expose WebApplication JSON-LD.`);
    if (!links.some((href) => href.startsWith('/blog/how-to-use-'))) {
      issues.push(`${page.path} should expose a matching guide link in initial HTML.`);
    }
    if (!hasAny(allText, [/example/i, /formula/i, /how to use/i, /common uses/i])) {
      issues.push(`${page.path} does not expose tool explanation signals in initial HTML.`);
    }
  }

  if (page.type === 'hub' || page.type === 'ai-hub') {
    if (!types.includes('CollectionPage')) warnings.push(`${page.path} does not expose CollectionPage JSON-LD.`);
  }

  if (page.type === 'ai-tool' || page.type === 'ai-hub') {
    if (!/not uploaded to Access Free Tools/i.test(allText)) {
      issues.push(`${page.path} should clearly say inputs are not uploaded to Access Free Tools.`);
    }
    if (!/model|download|self-host|third-party/i.test(allText)) {
      issues.push(`${page.path} should expose model/download limits in initial HTML.`);
    }
    if (!/wrong|uncertain|double-check|verify/i.test(allText)) {
      warnings.push(`${page.path} should remind visitors to double-check AI output.`);
    }
  }

  if (/\/tools\/(?:mortgage|bmi|watts-to-amps)-/i.test(page.path) && !/estimate|not financial advice|not medical|planning|double-check|safety/i.test(allText)) {
    issues.push(`${page.path} should expose trust/limit wording for higher-risk topics.`);
  }

  return {
    ...page,
    file,
    status: issues.length ? 'review' : warnings.length ? 'watch' : 'pass',
    title,
    descriptionLength: description.length,
    canonical,
    h1,
    mainWordCount,
    internalLinkCount: links.length,
    sampleInternalLinks: links.slice(0, 12),
    jsonLdTypes: types,
    issues,
    warnings,
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

const pages = priorityPages.map(auditPage);
const issuePages = pages.filter((page) => page.issues.length);
const warningPages = pages.filter((page) => !page.issues.length && page.warnings.length);
const report = {
  generatedAt: new Date().toISOString(),
  source: 'Search Engine Land task board P0 AI crawler visibility',
  auditMode: 'Local built HTML inspection; crawler profiles are modeled as non-JS initial-HTML readers.',
  outputDir,
  crawlerProfiles,
  totals: {
    pages: pages.length,
    passed: pages.filter((page) => page.status === 'pass').length,
    watch: warningPages.length,
    review: issuePages.length,
    issues: pages.reduce((total, page) => total + page.issues.length, 0),
    warnings: pages.reduce((total, page) => total + page.warnings.length, 0),
  },
  pages,
};

function renderMarkdown(value) {
  const lines = [
    '# AI Crawler Visibility Audit',
    '',
    `Generated: ${value.generatedAt}`,
    '',
    '## Crawler Profiles Modeled',
    '',
    ...value.crawlerProfiles.map((profile) => `- ${profile}`),
    '',
    `Mode: ${value.auditMode}`,
    '',
    '## Summary',
    '',
    `- Priority pages checked: ${value.totals.pages}`,
    `- Passed: ${value.totals.passed}`,
    `- Watch: ${value.totals.watch}`,
    `- Review: ${value.totals.review}`,
    `- Issues: ${value.totals.issues}`,
    `- Warnings: ${value.totals.warnings}`,
    '',
    '## Page Results',
    '',
  ];

  for (const page of value.pages) {
    lines.push(`### ${page.path}`);
    lines.push('');
    lines.push(`- Status: ${page.status}`);
    lines.push(`- Main-content words: ${page.mainWordCount}`);
    lines.push(`- Internal links: ${page.internalLinkCount}`);
    lines.push(`- JSON-LD types: ${page.jsonLdTypes.join(', ') || 'none'}`);
    lines.push(page.issues.length ? `- Issues: ${page.issues.join(' | ')}` : '- Issues: none');
    lines.push(page.warnings.length ? `- Warnings: ${page.warnings.join(' | ')}` : '- Warnings: none');
    lines.push('');
  }

  lines.push('## Next Action', '');
  if (value.totals.review) {
    lines.push('- Fix review pages before relying on AI crawler discovery for those URLs.');
  } else if (value.totals.watch) {
    lines.push('- Priority pages are visible to non-JS crawlers; review watch items as polish.');
  } else {
    lines.push('- Priority pages expose their core content, links, and trust wording in initial HTML.');
  }

  return `${lines.join('\n')}\n`;
}

writeJson(join(outputDir, 'summary.json'), report);
writeText(join(outputDir, 'summary.md'), renderMarkdown(report));

console.log('AI crawler visibility audit complete.');
console.log(`Pages: ${report.totals.pages}`);
console.log(`Review: ${report.totals.review}`);
console.log(`Watch: ${report.totals.watch}`);
console.log(`Report: ${join(outputDir, 'summary.md')}`);

if (issuePages.length && !warnOnly) {
  process.exitCode = 1;
}
