#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, relative, resolve, sep } from 'node:path';
import process from 'node:process';

import { chromium } from 'playwright';

import {
  DEFAULT_GEO_PAGES,
  SOURCE_HEADING_PATTERN_SOURCE,
  analyzeRenderedPage,
  buildGeoSecondOpinionSummary,
  isAllowedAuditBaseUrl,
  isAllowedPageRequest,
  renderGeoSecondOpinionMarkdown,
} from './lib/geo-second-opinion.mjs';

const DEFAULT_DIST_DIR = 'dist';
const DEFAULT_OUTPUT_DIR = 'output/geo-second-opinion';
const CONTENT_TYPES = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.mp3', 'audio/mpeg'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.wasm', 'application/wasm'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8'],
  ['.webp', 'image/webp'],
  ['.xml', 'application/xml; charset=utf-8'],
]);

function parseArgs(argv = process.argv.slice(2)) {
  const options = {
    baseUrl: '',
    distDir: DEFAULT_DIST_DIR,
    outputDir: DEFAULT_OUTPUT_DIR,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--base-url') {
      options.baseUrl = argv[index + 1] ?? '';
      index += 1;
    } else if (arg.startsWith('--base-url=')) {
      options.baseUrl = arg.slice('--base-url='.length);
    } else if (arg === '--dist') {
      options.distDir = argv[index + 1] ?? options.distDir;
      index += 1;
    } else if (arg.startsWith('--dist=')) {
      options.distDir = arg.slice('--dist='.length);
    } else if (arg === '--out') {
      options.outputDir = argv[index + 1] ?? options.outputDir;
      index += 1;
    } else if (arg.startsWith('--out=')) {
      options.outputDir = arg.slice('--out='.length);
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function printHelp() {
  console.log(`GEO second-opinion audit

Usage:
  npm run audit:geo-second-opinion
  node scripts/geo-second-opinion.mjs --base-url=https://accessfreetools.com

The default command audits a local built copy with Playwright Chromium. It
blocks third-party requests, writes redacted evidence under output/, and never
edits pages or acts as a release gate.`);
}

function resolvePublicDistDir(distDir) {
  const distRoot = resolve(distDir);
  const clientDir = join(distRoot, 'client');
  return existsSync(clientDir) && statSync(clientDir).isDirectory() ? clientDir : distRoot;
}

function isInside(parent, child) {
  const pathFromParent = relative(resolve(parent), resolve(child));
  return pathFromParent === '' || (!pathFromParent.startsWith(`..${sep}`) && pathFromParent !== '..');
}

function staticFileCandidates(publicDir, pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return [];
  }

  const cleanPath = normalize(decoded.replace(/^\/+/, ''));
  if (cleanPath.startsWith('..')) return [];

  if (!cleanPath || cleanPath === '.') return [join(publicDir, 'index.html')];
  const direct = join(publicDir, cleanPath);
  const candidates = [direct];
  if (decoded.endsWith('/')) {
    candidates.unshift(join(direct, 'index.html'));
  } else if (!extname(cleanPath)) {
    candidates.push(`${direct}.html`, join(direct, 'index.html'));
  }
  return candidates.filter((candidate) => isInside(publicDir, candidate));
}

function createStaticServer(publicDir) {
  return createServer((request, response) => {
    if (!request.url || !['GET', 'HEAD'].includes(request.method ?? 'GET')) {
      response.writeHead(405, { Allow: 'GET, HEAD' });
      response.end();
      return;
    }

    const pathname = new URL(request.url, 'http://127.0.0.1').pathname;
    const filePath = staticFileCandidates(publicDir, pathname)
      .find((candidate) => existsSync(candidate) && statSync(candidate).isFile());

    if (!filePath) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }

    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Type': CONTENT_TYPES.get(extname(filePath).toLowerCase()) ?? 'application/octet-stream',
    });
    if (request.method === 'HEAD') {
      response.end();
      return;
    }
    createReadStream(filePath).pipe(response);
  });
}

async function listenOnLoopback(server) {
  await new Promise((resolvePromise, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolvePromise);
  });
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Could not determine the local preview port.');
  }
  return `http://127.0.0.1:${address.port}`;
}

async function closeServer(server) {
  if (!server) return;
  await new Promise((resolvePromise) => server.close(() => resolvePromise()));
}

function hashText(text) {
  return createHash('sha256').update(text).digest('hex');
}

async function collectDiscoveryFile(baseUrl, pathname) {
  try {
    const response = await fetch(new URL(pathname, baseUrl), { redirect: 'error' });
    const body = response.ok ? await response.text() : '';
    return {
      path: pathname,
      status: response.status,
      bytes: Buffer.byteLength(body),
      sha256: body ? hashText(body) : '',
    };
  } catch (error) {
    return {
      path: pathname,
      status: 0,
      bytes: 0,
      sha256: '',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function extractRenderedEvidence(page, input) {
  return page.evaluate(({
    route,
    requestedUrl,
    status,
    blockedExternalRequestCount,
    elapsedMs,
    sourceHeadingPatternSource,
  }) => {
    const normalizeText = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
    const words = (value) => normalizeText(value).split(/\s+/).filter(Boolean);
    const isVisible = (element) => {
      if (!(element instanceof HTMLElement)) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && Number(style.opacity) !== 0
        && rect.width > 0
        && rect.height > 0;
    };
    const isExcluded = (element) => Boolean(element.closest(
      'nav, footer, aside, form, dialog, template, [hidden], [aria-hidden="true"], [data-geo-ignore]',
    ));
    const main = document.querySelector('main') ?? document.body;
    const mainClone = main.cloneNode(true);
    mainClone.querySelectorAll(
      'script, style, noscript, nav, footer, aside, form, dialog, template, [hidden], [aria-hidden="true"], [data-geo-ignore]',
    ).forEach((element) => element.remove());
    const mainText = normalizeText(mainClone.textContent);

    const headings = [...main.querySelectorAll('h1, h2, h3')]
      .filter((element) => isVisible(element) && !isExcluded(element))
      .map((element) => ({
        level: Number(element.tagName.slice(1)),
        text: normalizeText(element.textContent),
      }))
      .filter((heading) => heading.text);

    const paragraphs = [...main.querySelectorAll('p')]
      .filter((element) => isVisible(element) && !isExcluded(element))
      .map((element) => ({
        element,
        text: normalizeText(element.textContent),
      }))
      .filter((item) => item.text && words(item.text).length >= 10);
    const paragraphWordCounts = paragraphs.map((item) => words(item.text).length);

    const anchors = [...main.querySelectorAll('a[href]')]
      .filter((element) => isVisible(element) && !isExcluded(element))
      .map((element) => element.href)
      .filter(Boolean);
    const uniqueAnchors = [...new Set(anchors)];
    const internalLinks = uniqueAnchors.filter((href) => {
      try {
        const url = new URL(href);
        return ['accessfreetools.com', 'www.accessfreetools.com', location.hostname].includes(url.hostname);
      } catch {
        return false;
      }
    });
    const externalLinks = uniqueAnchors.filter((href) => {
      try {
        const url = new URL(href);
        return !['accessfreetools.com', 'www.accessfreetools.com', location.hostname].includes(url.hostname)
          && ['http:', 'https:'].includes(url.protocol);
      } catch {
        return false;
      }
    });
    const externalSourceHosts = [...new Set(externalLinks.map((href) => new URL(href).hostname))].sort();

    let invalidJsonLdCount = 0;
    let hasStructuredAuthor = false;
    let hasStructuredDate = false;
    const jsonLdTypes = new Set();
    const collectJsonLd = (value) => {
      if (!value || typeof value !== 'object') return;
      if (Array.isArray(value)) {
        value.forEach(collectJsonLd);
        return;
      }
      const type = value['@type'];
      (Array.isArray(type) ? type : [type]).filter(Boolean).forEach((item) => jsonLdTypes.add(String(item)));
      if (value.author) hasStructuredAuthor = true;
      if (value.datePublished || value.dateModified) hasStructuredDate = true;
      if (Array.isArray(value['@graph'])) value['@graph'].forEach(collectJsonLd);
    };
    document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
      try {
        collectJsonLd(JSON.parse(script.textContent || ''));
      } catch {
        invalidJsonLdCount += 1;
      }
    });

    const sourceHeadingPattern = new RegExp(sourceHeadingPatternSource, 'i');
    const hasSourcesSection = headings.some((heading) => sourceHeadingPattern.test(heading.text));
    const sectionsWithExternalSources = [...main.querySelectorAll('h2, h3')].filter((heading) => {
      if (!isVisible(heading) || isExcluded(heading)) return false;
      const headingLevel = Number(heading.tagName.slice(1));
      let cursor = heading.nextElementSibling;
      while (cursor) {
        if (/^H[1-6]$/.test(cursor.tagName) && Number(cursor.tagName.slice(1)) <= headingLevel) break;
        if ([...cursor.querySelectorAll('a[href]')].some((anchor) => {
          try {
            const url = new URL(anchor.href);
            return !['accessfreetools.com', 'www.accessfreetools.com', location.hostname].includes(url.hostname);
          } catch {
            return false;
          }
        })) return true;
        cursor = cursor.nextElementSibling;
      }
      return false;
    }).length;

    const documentAuthor = document.querySelector('meta[name="author"]')?.getAttribute('content')
      || document.querySelector('[rel="author"]')?.textContent
      || '';
    const visibleAuthor = /\bby\s+brendan\s+chambers\b/i.test(mainText);
    const publishedMeta = document.querySelector(
      'meta[property="article:published_time"], meta[property="article:modified_time"], time[datetime]',
    );
    const numberPattern = /\b\d+(?:[.,]\d+)?(?:\s?(?:%|ms|seconds?|minutes?|hours?|kb|mb|gb|px|words?|characters?))?\b/i;

    return {
      route,
      requestedUrl,
      finalUrl: location.href,
      status,
      lang: normalizeText(document.documentElement.lang),
      title: normalizeText(document.title),
      description: normalizeText(document.querySelector('meta[name="description"]')?.getAttribute('content')),
      canonical: normalizeText(document.querySelector('link[rel="canonical"]')?.href),
      robots: normalizeText(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toLowerCase(),
      h1: [...document.querySelectorAll('h1')]
        .filter((element) => isVisible(element))
        .map((element) => normalizeText(element.textContent))
        .filter(Boolean),
      headings,
      mainVisible: isVisible(main),
      mainText,
      mainWordCount: words(mainText).length,
      firstParagraphWordCount: paragraphWordCounts[0] ?? 0,
      paragraphWordCounts,
      selfContainedPassageCount: paragraphWordCounts.filter((count) => count >= 40 && count <= 180).length,
      paragraphsWithNumbers: paragraphs.filter((item) => numberPattern.test(item.text)).length,
      sectionCount: headings.filter((heading) => heading.level === 2 || heading.level === 3).length,
      sectionsWithExternalSources,
      internalLinkCount: internalLinks.length,
      externalSourceCount: externalLinks.length,
      externalSourceHosts,
      listCount: [...main.querySelectorAll('ul, ol')].filter((element) => isVisible(element) && !isExcluded(element)).length,
      tableCount: [...main.querySelectorAll('table')].filter((element) => isVisible(element) && !isExcluded(element)).length,
      hasAuthorSignal: Boolean(normalizeText(documentAuthor) || visibleAuthor || hasStructuredAuthor),
      hasPublishedOrModifiedDate: Boolean(publishedMeta || hasStructuredDate),
      hasSourcesSection,
      jsonLdTypes: [...jsonLdTypes].sort(),
      invalidJsonLdCount,
      blockedExternalRequestCount,
      elapsedMs,
    };
  }, input);
}

async function auditPage(context, baseUrl, pageConfig) {
  const page = await context.newPage();
  let blockedExternalRequestCount = 0;
  await page.route('**/*', async (route) => {
    if (isAllowedPageRequest(route.request().url(), baseUrl)) {
      await route.continue();
    } else {
      blockedExternalRequestCount += 1;
      await route.abort('blockedbyclient');
    }
  });

  const requestedUrl = new URL(pageConfig.route, baseUrl).href;
  const startedAt = performance.now();
  try {
    const response = await page.goto(requestedUrl, {
      timeout: 30_000,
      waitUntil: 'domcontentloaded',
    });
    await page.locator('main').first().waitFor({ state: 'attached', timeout: 10_000 }).catch(() => {});
    await page.waitForTimeout(250);
    const elapsedMs = Math.round(performance.now() - startedAt);
    const evidence = await extractRenderedEvidence(page, {
      route: pageConfig.route,
      requestedUrl,
      status: response?.status() ?? 0,
      blockedExternalRequestCount,
      elapsedMs,
      sourceHeadingPatternSource: SOURCE_HEADING_PATTERN_SOURCE,
    });
    evidence.kind = pageConfig.kind;
    evidence.changePolicy = pageConfig.changePolicy;
    evidence.mainTextHash = hashText(evidence.mainText);
    delete evidence.mainText;
    return analyzeRenderedPage(evidence);
  } catch (error) {
    const elapsedMs = Math.round(performance.now() - startedAt);
    return analyzeRenderedPage({
      route: pageConfig.route,
      kind: pageConfig.kind,
      requestedUrl,
      finalUrl: page.url() || requestedUrl,
      status: 0,
      lang: '',
      title: '',
      description: '',
      canonical: '',
      robots: '',
      h1: [],
      headings: [],
      mainVisible: false,
      mainWordCount: 0,
      mainTextHash: '',
      firstParagraphWordCount: 0,
      paragraphWordCounts: [],
      selfContainedPassageCount: 0,
      paragraphsWithNumbers: 0,
      sectionCount: 0,
      sectionsWithExternalSources: 0,
      internalLinkCount: 0,
      externalSourceCount: 0,
      externalSourceHosts: [],
      listCount: 0,
      tableCount: 0,
      hasAuthorSignal: false,
      hasPublishedOrModifiedDate: false,
      hasSourcesSection: false,
      jsonLdTypes: [],
      invalidJsonLdCount: 0,
      blockedExternalRequestCount,
      elapsedMs,
      operationalError: error instanceof Error ? error.message : String(error),
    });
  } finally {
    await page.close();
  }
}

function timestampFolderName(iso) {
  return iso.replaceAll(':', '-').replace(/\.\d{3}Z$/, 'Z');
}

function writeReports(outputDir, report) {
  const absoluteOutputDir = resolve(outputDir);
  const runDir = join(absoluteOutputDir, 'runs', timestampFolderName(report.generatedAt));
  mkdirSync(runDir, { recursive: true });
  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = `${renderGeoSecondOpinionMarkdown(report)}\n`;
  writeFileSync(join(absoluteOutputDir, 'latest.json'), json, 'utf8');
  writeFileSync(join(absoluteOutputDir, 'latest.md'), markdown, 'utf8');
  writeFileSync(join(runDir, 'report.json'), json, 'utf8');
  writeFileSync(join(runDir, 'report.md'), markdown, 'utf8');
  return {
    json: join(absoluteOutputDir, 'latest.json'),
    markdown: join(absoluteOutputDir, 'latest.md'),
    runDir,
  };
}

async function main() {
  const options = parseArgs();
  if (options.help) {
    printHelp();
    return;
  }

  let server;
  let browser;
  const generatedAt = new Date().toISOString();
  const runStartedAt = performance.now();

  try {
    let baseUrl = options.baseUrl.replace(/\/+$/, '');
    let target = 'production';
    if (!baseUrl) {
      const publicDir = resolvePublicDistDir(options.distDir);
      if (!existsSync(join(publicDir, 'index.html'))) {
        throw new Error(`Built site not found under ${publicDir}. Run npm run build first.`);
      }
      server = createStaticServer(publicDir);
      baseUrl = await listenOnLoopback(server);
      target = 'local-build';
    }

    if (!isAllowedAuditBaseUrl(baseUrl)) {
      throw new Error('Audit base URL must be loopback HTTP or HTTPS on accessfreetools.com.');
    }

    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      colorScheme: 'light',
      javaScriptEnabled: true,
      locale: 'en-AU',
      serviceWorkers: 'block',
      viewport: { width: 1280, height: 900 },
    });

    const pages = [];
    for (const pageConfig of DEFAULT_GEO_PAGES) {
      process.stdout.write(`[geo-second-opinion] rendering ${pageConfig.route}\n`);
      pages.push(await auditPage(context, baseUrl, pageConfig));
    }

    const discoveryFiles = [];
    for (const pathname of ['/robots.txt', '/llms.txt', '/llms-full.txt']) {
      discoveryFiles.push(await collectDiscoveryFile(baseUrl, pathname));
    }

    await context.close();
    const report = buildGeoSecondOpinionSummary({
      pages,
      generatedAt,
      run: {
        target,
        auditedOrigin: new URL(baseUrl).origin,
        durationMs: Math.round(performance.now() - runStartedAt),
        discoveryFiles,
      },
    });
    const paths = writeReports(options.outputDir, report);

    console.log('');
    console.log(`[geo-second-opinion] ${report.operationalStatus}: ${report.totals.pages} pages rendered`);
    console.log(`[geo-second-opinion] technical observations: ${report.totals.technicalFindings}`);
    console.log(`[geo-second-opinion] heuristic review prompts: ${report.totals.heuristicFindings}`);
    console.log(`[geo-second-opinion] report: ${paths.markdown}`);
    console.log('[geo-second-opinion] This is not a release gate or ranking prediction.');

    if (report.operationalStatus !== 'complete') {
      process.exitCode = 1;
    }
  } finally {
    if (browser) await browser.close().catch(() => {});
    await closeServer(server);
  }
}

main().catch((error) => {
  console.error(`[geo-second-opinion] ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
