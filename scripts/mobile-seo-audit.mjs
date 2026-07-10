import { createServer } from 'node:http';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import {
  basename,
  dirname,
  extname,
  join,
  normalize,
  relative,
  resolve,
  sep,
} from 'node:path';
import { pathToFileURL } from 'node:url';

const SITE_ORIGIN = 'https://accessfreetools.com';
const DEFAULT_DIST_DIR = 'dist';
const DEFAULT_OUTPUT_DIR = 'output/mobile-seo-audit';

const REPRESENTATIVE_PAGES = [
  '/',
  '/tools/',
  '/blog/',
  '/free-calculator-resources/',
  '/tools/percentage-calculator/',
  '/blog/how-to-use-percentage-calculator/',
  '/categories/calculators/',
  '/gallery/finance/',
];

const VIEWPORTS = [
  { name: 'mobile-320', width: 320, height: 568 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 },
];

const OFFICIAL_SOURCES = [
  {
    label: 'Google AMP on Search',
    url: 'https://developers.google.com/search/docs/crawling-indexing/amp',
  },
  {
    label: 'Google AMP validation',
    url: 'https://developers.google.com/search/docs/crawling-indexing/amp/validate-amp',
  },
  {
    label: 'Google mobile-first indexing best practices',
    url: 'https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing',
  },
  {
    label: 'Google mobile indexing final update',
    url: 'https://developers.google.com/search/blog/2024/06/mobile-indexing-vlast-final-final.doc',
  },
  {
    label: 'Google Core Web Vitals',
    url: 'https://developers.google.com/search/docs/appearance/core-web-vitals',
  },
];

const CONTENT_TYPES = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.wasm', 'application/wasm'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8'],
  ['.xml', 'application/xml; charset=utf-8'],
]);

function parseArgs(argv = process.argv.slice(2)) {
  const options = {
    distDir: DEFAULT_DIST_DIR,
    outputDir: DEFAULT_OUTPUT_DIR,
    skipBrowser: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--dist') {
      options.distDir = argv[index + 1] ?? options.distDir;
      index += 1;
    } else if (arg.startsWith('--dist=')) {
      options.distDir = arg.slice('--dist='.length);
    } else if (arg === '--out') {
      options.outputDir = argv[index + 1] ?? options.outputDir;
      index += 1;
    } else if (arg.startsWith('--out=')) {
      options.outputDir = arg.slice('--out='.length);
    } else if (arg === '--skip-browser') {
      options.skipBrowser = true;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    }
  }

  return options;
}

function printHelp() {
  console.log(`Mobile SEO audit

Usage:
  node scripts/mobile-seo-audit.mjs [--dist dist] [--out output/mobile-seo-audit] [--skip-browser]

Checks built HTML for mobile-first SEO invariants and runs Playwright proof
against representative local built pages.`);
}

function resolvePublicDistDir(distDir) {
  const distRoot = resolve(distDir);
  const clientDir = join(distRoot, 'client');
  if (existsSync(clientDir) && statSync(clientDir).isDirectory()) {
    return clientDir;
  }
  return distRoot;
}

function walkFiles(rootDir) {
  if (!existsSync(rootDir)) {
    return [];
  }

  const entries = readdirSync(rootDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function collectHtmlFiles(publicDistDir) {
  return walkFiles(publicDistDir)
    .filter((filePath) => extname(filePath).toLowerCase() === '.html')
    .filter((filePath) => !/^google[a-z0-9_-]*\.html$/i.test(basename(filePath)))
    .sort((a, b) => a.localeCompare(b));
}

function routePathForHtmlFile(publicDistDir, filePath) {
  const relativePath = relative(publicDistDir, filePath).replaceAll('\\', '/');
  if (relativePath === 'index.html') {
    return '/';
  }
  if (relativePath.endsWith('/index.html')) {
    return `/${relativePath.slice(0, -'index.html'.length)}`;
  }
  return `/${relativePath.replace(/\.html$/i, '')}`;
}

function extractFirstAttribute(html, selectorPattern, attributeName) {
  const tagMatch = html.match(selectorPattern);
  if (!tagMatch) {
    return '';
  }

  const attributePattern = new RegExp(`${attributeName}\\s*=\\s*["']([^"']*)["']`, 'i');
  return tagMatch[0].match(attributePattern)?.[1]?.trim() ?? '';
}

function extractRobots(html) {
  return extractFirstAttribute(
    html,
    /<meta\b(?=[^>]*\bname\s*=\s*["']robots["'])[^>]*>/i,
    'content',
  ).toLowerCase();
}

function extractViewport(html) {
  return extractFirstAttribute(
    html,
    /<meta\b(?=[^>]*\bname\s*=\s*["']viewport["'])[^>]*>/i,
    'content',
  );
}

function extractCanonical(html) {
  return extractFirstAttribute(
    html,
    /<link\b(?=[^>]*\brel\s*=\s*["'][^"']*\bcanonical\b[^"']*["'])[^>]*>/i,
    'href',
  );
}

function extractLinkTags(html) {
  return [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => {
    const tag = match[0];
    return {
      tag,
      rel: tag.match(/\brel\s*=\s*["']([^"']*)["']/i)?.[1]?.trim().toLowerCase() ?? '',
      href: tag.match(/\bhref\s*=\s*["']([^"']*)["']/i)?.[1]?.trim() ?? '',
      media: tag.match(/\bmedia\s*=\s*["']([^"']*)["']/i)?.[1]?.trim().toLowerCase() ?? '',
      type: tag.match(/\btype\s*=\s*["']([^"']*)["']/i)?.[1]?.trim().toLowerCase() ?? '',
    };
  });
}

function hasAmpHtmlAttribute(html) {
  return /<html\b[^>]*(?:\samp(?:\s|=|>)|⚡)/i.test(html);
}

function hasAmpScript(html) {
  return /https?:\/\/cdn\.ampproject\.org\//i.test(html);
}

function urlLooksAmp(url) {
  try {
    const parsed = new URL(url, SITE_ORIGIN);
    const pathSegments = parsed.pathname
      .toLowerCase()
      .split('/')
      .filter(Boolean);
    return pathSegments.includes('amp') || parsed.searchParams.has('amp');
  } catch {
    return /(?:^|\/)amp(?:\/|$)|[?&]amp(?:=1|=true)?(?:&|$)/i.test(url);
  }
}

function urlLooksMobileAlternate(url) {
  try {
    const parsed = new URL(url, SITE_ORIGIN);
    return parsed.hostname.startsWith('m.') || /^\/m(?:\/|$)/i.test(parsed.pathname);
  } catch {
    return /^https?:\/\/m\./i.test(url) || /^\/m(?:\/|$)/i.test(url);
  }
}

function isNoindex(robotsContent) {
  return robotsContent
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .includes('noindex');
}

function sitemapFileFromLoc(publicDistDir, loc) {
  try {
    const parsed = new URL(loc, SITE_ORIGIN);
    if (parsed.origin !== SITE_ORIGIN) {
      return '';
    }

    const candidate = join(publicDistDir, parsed.pathname.replace(/^\/+/, ''));
    if (ensureInside(publicDistDir, candidate) && existsSync(candidate) && statSync(candidate).isFile()) {
      return candidate;
    }
  } catch {
    return '';
  }

  return '';
}

function readSitemapUrls(publicDistDir) {
  const sitemapPaths = [
    join(publicDistDir, 'sitemap-index.xml'),
    join(publicDistDir, 'sitemap.xml'),
  ].filter((filePath) => existsSync(filePath));

  const urls = new Set();
  const seen = new Set();
  const pending = [...sitemapPaths];

  while (pending.length > 0) {
    const sitemapPath = pending.shift();
    if (!sitemapPath || seen.has(sitemapPath)) {
      continue;
    }
    seen.add(sitemapPath);

    const xml = readFileSync(sitemapPath, 'utf8');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((match) => match[1].trim());
    const isSitemapIndex = /<sitemapindex\b/i.test(xml);

    if (isSitemapIndex) {
      for (const loc of locs) {
        const childSitemap = sitemapFileFromLoc(publicDistDir, loc);
        if (childSitemap) {
          pending.push(childSitemap);
        }
      }
    } else {
      for (const loc of locs) {
        urls.add(loc);
      }
    }
  }

  return urls;
}

function createIssue(routePath, code, message, severity = 'error') {
  return { routePath, code, message, severity };
}

export function analyzeHtmlPage({ html, routePath, sitemapUrls = new Set() }) {
  const issues = [];
  const warnings = [];
  const viewport = extractViewport(html);
  const canonical = extractCanonical(html);
  const robots = extractRobots(html);
  const links = extractLinkTags(html);
  const jsonLdCount = (html.match(/<script\b(?=[^>]*\btype\s*=\s*["']application\/ld\+json["'])[^>]*>/gi) ?? [])
    .length;

  if (!viewport) {
    issues.push(createIssue(routePath, 'missing_viewport', 'Missing viewport meta tag.'));
  } else if (!/width\s*=\s*device-width/i.test(viewport)) {
    issues.push(
      createIssue(routePath, 'viewport_not_device_width', `Viewport does not include width=device-width: ${viewport}`),
    );
  }

  if (!canonical) {
    issues.push(createIssue(routePath, 'missing_canonical', 'Missing canonical link.'));
  } else {
    let parsedCanonical;
    try {
      parsedCanonical = new URL(canonical, SITE_ORIGIN);
    } catch {
      issues.push(createIssue(routePath, 'invalid_canonical', `Canonical URL is invalid: ${canonical}`));
    }

    if (parsedCanonical && parsedCanonical.origin !== SITE_ORIGIN) {
      issues.push(createIssue(routePath, 'external_canonical', `Canonical is not on ${SITE_ORIGIN}: ${canonical}`));
    }

    if (parsedCanonical && urlLooksAmp(parsedCanonical.href)) {
      issues.push(createIssue(routePath, 'amp_canonical', `Canonical points to an AMP-like URL: ${canonical}`));
    }

    if (parsedCanonical && urlLooksMobileAlternate(parsedCanonical.href)) {
      issues.push(createIssue(routePath, 'mobile_canonical', `Canonical points to a mobile alternate URL: ${canonical}`));
    }
  }

  if (hasAmpHtmlAttribute(html)) {
    issues.push(createIssue(routePath, 'amp_html_attribute', 'AMP html attribute found.'));
  }

  if (hasAmpScript(html)) {
    issues.push(createIssue(routePath, 'amp_runtime_script', 'AMP runtime script found.'));
  }

  for (const link of links) {
    if (/\bamphtml\b/i.test(link.rel)) {
      issues.push(createIssue(routePath, 'amphtml_link', `rel="amphtml" link found: ${link.href}`));
    }

    if (urlLooksAmp(link.href)) {
      issues.push(createIssue(routePath, 'amp_like_link', `AMP-like link URL found: ${link.href}`));
    }

    const isFeedAlternate = /\balternate\b/i.test(link.rel) && /rss|atom|json/i.test(link.type);
    const isMobileMediaAlternate =
      /\balternate\b/i.test(link.rel) && Boolean(link.media) && /max-width|handheld|screen/i.test(link.media);
    if (!isFeedAlternate && (urlLooksMobileAlternate(link.href) || isMobileMediaAlternate)) {
      issues.push(
        createIssue(routePath, 'mobile_alternate_link', `Mobile alternate link found: ${link.href || link.tag}`),
      );
    }
  }

  if (jsonLdCount === 0) {
    issues.push(createIssue(routePath, 'missing_json_ld', 'Missing JSON-LD structured data basics.'));
  }

  let canonicalUrl = '';
  try {
    canonicalUrl = canonical ? new URL(canonical, SITE_ORIGIN).href : '';
  } catch {
    canonicalUrl = '';
  }
  const noindex = isNoindex(robots);
  const routeUrl = `${SITE_ORIGIN}${routePath}`;

  if (noindex && sitemapUrls.has(routeUrl)) {
    issues.push(createIssue(routePath, 'noindex_in_sitemap', 'Noindex page appears in XML sitemap.'));
  }

  if (!noindex && canonicalUrl && sitemapUrls.size > 0 && !sitemapUrls.has(canonicalUrl)) {
    warnings.push(createIssue(routePath, 'indexable_not_in_sitemap', 'Indexable canonical URL is absent from XML sitemap.', 'warning'));
  }

  return {
    routePath,
    canonical,
    viewport,
    robots,
    noindex,
    jsonLdCount,
    issues,
    warnings,
  };
}

export function runStaticAudit({ publicDistDir }) {
  const htmlFiles = collectHtmlFiles(publicDistDir);
  const sitemapUrls = readSitemapUrls(publicDistDir);
  const pages = htmlFiles.map((filePath) => {
    const routePath = routePathForHtmlFile(publicDistDir, filePath);
    const html = readFileSync(filePath, 'utf8');
    return {
      filePath,
      ...analyzeHtmlPage({ html, routePath, sitemapUrls }),
    };
  });

  const issues = pages.flatMap((page) => page.issues);
  const warnings = pages.flatMap((page) => page.warnings);
  const ampIssueCount = issues.filter((issue) => issue.code.includes('amp')).length;
  const mobileAlternateIssueCount = issues.filter((issue) => issue.code.includes('mobile')).length;

  return {
    htmlPageCount: pages.length,
    sitemapUrlCount: sitemapUrls.size,
    ampDetected: ampIssueCount > 0,
    mobileAlternatesDetected: mobileAlternateIssueCount > 0,
    issues,
    warnings,
    pages: pages.map((page) => ({
      routePath: page.routePath,
      canonical: page.canonical,
      viewport: page.viewport,
      robots: page.robots,
      noindex: page.noindex,
      jsonLdCount: page.jsonLdCount,
      issueCount: page.issues.length,
      warningCount: page.warnings.length,
    })),
  };
}

function ensureInside(rootDir, targetPath) {
  const root = normalize(resolve(rootDir));
  const target = normalize(resolve(targetPath));
  const rootLower = root.toLowerCase();
  const targetLower = target.toLowerCase();
  return targetLower === rootLower || targetLower.startsWith(`${rootLower}${sep}`);
}

function resolveRequestFile(publicDistDir, requestPath) {
  const rawPath = decodeURIComponent(requestPath.split('?')[0] || '/');
  const cleanPath = rawPath.replace(/^\/+/, '');
  const candidates = [];

  if (!cleanPath || rawPath.endsWith('/')) {
    candidates.push(join(publicDistDir, cleanPath, 'index.html'));
  } else if (extname(cleanPath)) {
    candidates.push(join(publicDistDir, cleanPath));
  } else {
    candidates.push(join(publicDistDir, cleanPath, 'index.html'));
    candidates.push(join(publicDistDir, `${cleanPath}.html`));
  }

  for (const candidate of candidates) {
    if (ensureInside(publicDistDir, candidate) && existsSync(candidate) && statSync(candidate).isFile()) {
      return candidate;
    }
  }

  return null;
}

async function startStaticServer(publicDistDir) {
  const server = createServer((request, response) => {
    try {
      const requestUrl = new URL(request.url ?? '/', 'http://127.0.0.1');
      const filePath = resolveRequestFile(publicDistDir, requestUrl.pathname);
      if (!filePath) {
        response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
        response.end('Not found');
        return;
      }

      const contentType = CONTENT_TYPES.get(extname(filePath).toLowerCase()) ?? 'application/octet-stream';
      response.writeHead(200, { 'content-type': contentType });
      response.end(readFileSync(filePath));
    } catch (error) {
      response.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
      response.end(error instanceof Error ? error.message : String(error));
    }
  });

  await new Promise((resolveServer) => server.listen(0, '127.0.0.1', resolveServer));
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Unable to start static audit server.');
  }

  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    close: () => new Promise((resolveClose) => server.close(resolveClose)),
  };
}

function screenshotName(routePath, viewportName) {
  const normalizedRoute = routePath === '/' ? 'home' : routePath.replace(/^\/|\/$/g, '').replace(/[^\w-]+/g, '-');
  return `${normalizedRoute}-${viewportName}.png`;
}

export async function runBrowserProof({ publicDistDir, outputDir }) {
  let chromium;
  try {
    ({ chromium } = await import('@playwright/test'));
  } catch (error) {
    return {
      skipped: false,
      issues: [
        {
          routePath: '(browser)',
          code: 'playwright_unavailable',
          message: `Unable to import Playwright: ${error instanceof Error ? error.message : String(error)}`,
          severity: 'error',
        },
      ],
      checks: [],
    };
  }

  const screenshotDir = join(outputDir, 'screenshots');
  mkdirSync(screenshotDir, { recursive: true });

  const server = await startStaticServer(publicDistDir);
  const browser = await chromium.launch({ headless: true });
  const checks = [];
  const issues = [];

  try {
    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: viewport.width < 700 ? 2 : 1,
        isMobile: viewport.width < 700,
      });

      for (const routePath of REPRESENTATIVE_PAGES) {
        const page = await context.newPage();
        const url = `${server.baseUrl}${routePath}`;
        const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        const status = response?.status() ?? 0;

        const metrics = await page.evaluate(() => {
          const h1 = document.querySelector('h1');
          const h1Rect = h1?.getBoundingClientRect();
          const h1Style = h1 ? window.getComputedStyle(h1) : null;
          const h1Visible = Boolean(
            h1 &&
              h1Rect &&
              h1Rect.width > 0 &&
              h1Rect.height > 0 &&
              h1Style &&
              h1Style.display !== 'none' &&
              h1Style.visibility !== 'hidden',
          );

          return {
            title: document.title,
            h1Text: h1?.textContent?.trim() ?? '',
            h1Visible,
            bodyTextLength: document.body?.innerText?.trim().length ?? 0,
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
            viewportMeta: document.querySelector('meta[name="viewport"]')?.getAttribute('content') ?? '',
            canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '',
            jsonLdCount: document.querySelectorAll('script[type="application/ld+json"]').length,
          };
        });

        const screenshotPath = join(screenshotDir, screenshotName(routePath, viewport.name));
        await page.screenshot({ path: screenshotPath, fullPage: false });

        const check = {
          routePath,
          viewport: viewport.name,
          width: viewport.width,
          height: viewport.height,
          status,
          screenshotPath,
          ...metrics,
          passed: true,
        };

        if (status >= 400 || status === 0) {
          check.passed = false;
          issues.push(createIssue(routePath, 'mobile_http_error', `${viewport.name} returned HTTP ${status}.`));
        }

        if (metrics.scrollWidth > metrics.clientWidth + 2) {
          check.passed = false;
          issues.push(
            createIssue(
              routePath,
              'horizontal_overflow',
              `${viewport.name} has horizontal overflow: scrollWidth ${metrics.scrollWidth}, clientWidth ${metrics.clientWidth}.`,
            ),
          );
        }

        if (!metrics.h1Text || !metrics.h1Visible) {
          check.passed = false;
          issues.push(createIssue(routePath, 'hidden_or_missing_h1', `${viewport.name} has no visible primary H1.`));
        }

        if (!metrics.viewportMeta || !/width\s*=\s*device-width/i.test(metrics.viewportMeta)) {
          check.passed = false;
          issues.push(createIssue(routePath, 'mobile_missing_viewport', `${viewport.name} missing mobile viewport metadata.`));
        }

        if (!metrics.canonical || !metrics.canonical.startsWith(SITE_ORIGIN)) {
          check.passed = false;
          issues.push(createIssue(routePath, 'mobile_missing_canonical', `${viewport.name} missing site canonical metadata.`));
        }

        if (metrics.jsonLdCount === 0) {
          check.passed = false;
          issues.push(createIssue(routePath, 'mobile_missing_json_ld', `${viewport.name} missing structured data basics.`));
        }

        if (metrics.bodyTextLength < 200) {
          check.passed = false;
          issues.push(createIssue(routePath, 'mobile_content_too_thin', `${viewport.name} body text looks unexpectedly thin.`));
        }

        checks.push(check);
        await page.close();
      }

      await context.close();
    }
  } finally {
    await browser.close();
    await server.close();
  }

  return {
    skipped: false,
    issues,
    checks,
  };
}

export function buildMarkdownReport(report) {
  const lines = [
    '# Mobile SEO Audit',
    '',
    `Generated: ${report.generatedAt}`,
    `Status: ${report.status}`,
    '',
    '## Decision',
    '',
    'AMP is deferred by design. Access Free Tools should keep one responsive canonical URL per page unless a later, evidence-backed AMP pilot is explicitly approved.',
    '',
    '## Official Research',
    '',
    ...OFFICIAL_SOURCES.map((source) => `- [${source.label}](${source.url})`),
    '',
    '## Summary',
    '',
    `- Built HTML pages scanned: ${report.staticAudit.htmlPageCount}`,
    `- Sitemap URLs loaded: ${report.staticAudit.sitemapUrlCount}`,
    `- Static issues: ${report.staticAudit.issues.length}`,
    `- Static warnings: ${report.staticAudit.warnings.length}`,
    `- AMP markers detected: ${report.staticAudit.ampDetected ? 'yes' : 'no'}`,
    `- Mobile alternate URLs detected: ${report.staticAudit.mobileAlternatesDetected ? 'yes' : 'no'}`,
    `- Browser proof checks: ${report.browserProof.checks.length}`,
    `- Browser proof issues: ${report.browserProof.issues.length}`,
    '',
    '## Core Web Vitals Targets',
    '',
    '- LCP: 2.5 seconds or faster',
    '- INP: 200 ms or faster',
    '- CLS: 0.1 or lower',
    '',
    'Lighthouse output is lab evidence. Search Console and CrUX remain the field evidence source for real mobile user experience.',
    '',
    '## Static Issues',
    '',
  ];

  if (report.staticAudit.issues.length === 0) {
    lines.push('- None');
  } else {
    for (const issue of report.staticAudit.issues) {
      lines.push(`- ${issue.routePath}: ${issue.code} - ${issue.message}`);
    }
  }

  lines.push('', '## Static Warnings', '');

  if (report.staticAudit.warnings.length === 0) {
    lines.push('- None');
  } else {
    for (const warning of report.staticAudit.warnings.slice(0, 100)) {
      lines.push(`- ${warning.routePath}: ${warning.code} - ${warning.message}`);
    }
    if (report.staticAudit.warnings.length > 100) {
      lines.push(`- ${report.staticAudit.warnings.length - 100} additional warnings omitted from Markdown; see JSON.`);
    }
  }

  lines.push('', '## Playwright Mobile Proof', '');

  if (report.browserProof.skipped) {
    lines.push('- Browser proof skipped by CLI flag.');
  } else if (report.browserProof.checks.length === 0) {
    lines.push('- No browser proof checks were recorded.');
  } else {
    lines.push('| Page | Viewport | H1 | Overflow | Screenshot |');
    lines.push('| --- | --- | --- | --- | --- |');
    for (const check of report.browserProof.checks) {
      const overflow = check.scrollWidth > check.clientWidth + 2 ? 'fail' : 'pass';
      const screenshot = relative(process.cwd(), check.screenshotPath).replaceAll('\\', '/');
      lines.push(
        `| ${check.routePath} | ${check.viewport} | ${check.h1Text || '(missing)'} | ${overflow} | ${screenshot} |`,
      );
    }
  }

  lines.push('', '## Browser Issues', '');

  if (report.browserProof.issues.length === 0) {
    lines.push('- None');
  } else {
    for (const issue of report.browserProof.issues) {
      lines.push(`- ${issue.routePath}: ${issue.code} - ${issue.message}`);
    }
  }

  lines.push('', '## Next Actions', '');
  lines.push('- Keep AMP out of the codebase unless a later pilot proves a search or business benefit.');
  lines.push('- Use this audit after major layout, metadata, sitemap, or deployment changes.');
  lines.push('- Run mobile Lighthouse on the representative live URLs after deploy and record weak pages as performance tasks, not AMP tasks.');
  lines.push('');

  return `${lines.join('\n')}\n`;
}

export async function createMobileSeoReport(options = {}) {
  const publicDistDir = resolvePublicDistDir(options.distDir ?? DEFAULT_DIST_DIR);
  const outputDir = resolve(options.outputDir ?? DEFAULT_OUTPUT_DIR);

  if (!existsSync(publicDistDir)) {
    throw new Error(`Built site directory not found: ${publicDistDir}. Run npm run build first.`);
  }

  mkdirSync(outputDir, { recursive: true });
  const staticAudit = runStaticAudit({ publicDistDir });
  const browserProof = options.skipBrowser
    ? { skipped: true, issues: [], checks: [] }
    : await runBrowserProof({ publicDistDir, outputDir });

  const report = {
    generatedAt: new Date().toISOString(),
    siteOrigin: SITE_ORIGIN,
    distDir: publicDistDir,
    outputDir,
    officialSources: OFFICIAL_SOURCES,
    decision: 'AMP deferred; responsive mobile-first canonical pages are the chosen path.',
    coreWebVitalsTargets: {
      lcpSeconds: 2.5,
      inpMs: 200,
      cls: 0.1,
    },
    representativePages: REPRESENTATIVE_PAGES,
    viewports: VIEWPORTS,
    staticAudit,
    browserProof,
  };

  report.status = staticAudit.issues.length === 0 && browserProof.issues.length === 0 ? 'pass' : 'fail';
  report.reportPaths = {
    json: join(outputDir, 'latest.json'),
    markdown: join(outputDir, 'latest.md'),
  };

  writeFileSync(report.reportPaths.json, `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(report.reportPaths.markdown, buildMarkdownReport(report));

  return report;
}

async function main() {
  const options = parseArgs();
  if (options.help) {
    printHelp();
    return;
  }

  const report = await createMobileSeoReport(options);
  console.log(`Mobile SEO audit: ${report.status}`);
  console.log(`Markdown: ${report.reportPaths.markdown}`);
  console.log(`JSON: ${report.reportPaths.json}`);

  if (report.status !== 'pass') {
    process.exitCode = 1;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.stack || error.message : String(error));
    process.exitCode = 1;
  });
}
