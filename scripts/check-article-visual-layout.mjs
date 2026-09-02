import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = path.resolve('dist');
const OUTPUT_DIR = path.resolve('output', 'article-visual-layout');
const MIN_HEADING_NOTE_GAP = 3;
const HORIZONTAL_OVERFLOW_TOLERANCE = 4;

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 1200 },
  { name: 'laptop', width: 1024, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

const MIME_TYPES = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
  ['.svg', 'image/svg+xml'],
  ['.ico', 'image/x-icon'],
  ['.woff2', 'font/woff2'],
  ['.wasm', 'application/wasm'],
]);

function fail(message) {
  throw new Error(message);
}

function editorialArticlePaths() {
  const blogDir = path.join(ROOT, 'blog');
  if (!existsSync(blogDir)) return [];

  return readdirSync(blogDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      slug: entry.name,
      route: `/blog/${entry.name}/`,
      htmlPath: path.join(blogDir, entry.name, 'index.html'),
    }))
    .filter((entry) => existsSync(entry.htmlPath))
    .filter((entry) => readFileSync(entry.htmlPath, 'utf8').includes('data-editorial-slug'));
}

if (!existsSync(path.join(ROOT, 'index.html'))) {
  fail('Missing dist/index.html. Run `npm run build` before `npm run check:article-visual`.');
}

const articles = editorialArticlePaths();
if (!articles.length) fail('No built editorial articles were found.');
mkdirSync(OUTPUT_DIR, { recursive: true });

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1');
    let requestPath = decodeURIComponent(url.pathname);
    if (requestPath.endsWith('/')) requestPath += 'index.html';

    let filePath = path.resolve(ROOT, requestPath.slice(1));
    if (!filePath.startsWith(ROOT)) throw new Error('Path escapes dist root');

    if (!existsSync(filePath)) {
      const indexPath = path.resolve(ROOT, requestPath.slice(1), 'index.html');
      if (indexPath.startsWith(ROOT) && existsSync(indexPath)) filePath = indexPath;
    }

    await stat(filePath);
    res.setHeader('content-type', MIME_TYPES.get(path.extname(filePath)) ?? 'application/octet-stream');
    createReadStream(filePath).pipe(res);
  } catch {
    res.statusCode = 404;
    res.end('not found');
  }
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const baseURL = `http://127.0.0.1:${port}`;
const browser = await chromium.launch();
const report = {
  generatedAt: new Date().toISOString(),
  minHeadingNoteGap: MIN_HEADING_NOTE_GAP,
  horizontalOverflowTolerance: HORIZONTAL_OVERFLOW_TOLERANCE,
  articles: [],
};

try {
  for (const article of articles) {
    const articleOutputDir = path.join(OUTPUT_DIR, article.slug);
    mkdirSync(articleOutputDir, { recursive: true });
    const articleReport = { ...article, viewports: [] };

    for (const viewport of VIEWPORTS) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
      const pageErrors = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));
      await page.route('https://news.google.com/**', (route) => route.abort());

      await page.goto(`${baseURL}${article.route}`, { waitUntil: 'networkidle' });

      const result = await page.evaluate(({ minGap, overflowTolerance }) => {
        const failures = [];
        const html = document.documentElement;
        const horizontalOverflow = html.scrollWidth > html.clientWidth + overflowTolerance;
        if (horizontalOverflow) {
          const offenders = [...document.querySelectorAll('body *')]
            .map((element) => ({ element, rect: element.getBoundingClientRect() }))
            .filter(({ rect }) => rect.left < -overflowTolerance || rect.right > html.clientWidth + overflowTolerance)
            .slice(0, 6)
            .map(({ element, rect }) => `${element.tagName.toLowerCase()} (${rect.left.toFixed(1)}-${rect.right.toFixed(1)})`);
          failures.push(`document horizontally overflows: ${offenders.join(', ') || 'no element identified'}`);
        }

        function checkTextLineBoxes(element, label) {
          const elementRect = element.getBoundingClientRect();
          const range = document.createRange();
          range.selectNodeContents(element);

          for (const rect of range.getClientRects()) {
            if (rect.width < 1 || rect.height < 1) continue;
            if (rect.left < elementRect.left - 1 || rect.right > elementRect.right + 1) {
              failures.push(`${label} text escapes its container`);
              break;
            }
          }
        }

        const articleHeading = document.querySelector('.editorial-article-header h1');
        if (!articleHeading) {
          failures.push('article H1 is missing');
        } else {
          const style = getComputedStyle(articleHeading);
          const fontSize = Number.parseFloat(style.fontSize);
          const lineHeight = Number.parseFloat(style.lineHeight);
          if (Number.isFinite(fontSize) && Number.isFinite(lineHeight) && lineHeight < fontSize) {
            failures.push(`article H1 line-height ${lineHeight.toFixed(1)}px is smaller than font size ${fontSize.toFixed(1)}px`);
          }
          checkTextLineBoxes(articleHeading, 'article H1');
        }

        const heroImage = document.querySelector('.editorial-hero-figure img');
        if (!heroImage) {
          failures.push('editorial hero image is missing');
        } else {
          const rect = heroImage.getBoundingClientRect();
          if (rect.width < 250 || rect.height < 130) failures.push('editorial hero image renders too small');
          if (heroImage.naturalWidth !== 1200 || heroImage.naturalHeight !== 630) {
            failures.push(`editorial hero source is ${heroImage.naturalWidth}x${heroImage.naturalHeight}; expected 1200x630`);
          }
          if (!heroImage.getAttribute('alt')?.trim()) failures.push('editorial hero image alt text is empty');
        }

        const articleBody = document.querySelector('.editorial-article-body');
        const sidecar = document.querySelector('.editorial-sidecar');
        if (articleBody && sidecar) {
          const bodyRect = articleBody.getBoundingClientRect();
          const sidecarRect = sidecar.getBoundingClientRect();
          const boxesIntersect = bodyRect.left < sidecarRect.right && bodyRect.right > sidecarRect.left && bodyRect.top < sidecarRect.bottom && bodyRect.bottom > sidecarRect.top;
          if (boxesIntersect) failures.push('article body and related-links rail overlap');
        }

        const preferredSource = document.querySelector('[data-preferred-source-callout]');
        if (!preferredSource) {
          failures.push('preferred-source callout is missing');
        } else {
          const calloutRect = preferredSource.getBoundingClientRect();
          if (calloutRect.width > html.clientWidth + overflowTolerance) {
            failures.push('preferred-source callout exceeds the viewport width');
          }
          const calloutHeading = preferredSource.querySelector('h2');
          if (!calloutHeading) {
            failures.push('preferred-source heading is missing');
          } else {
            checkTextLineBoxes(calloutHeading, 'preferred-source heading');
          }
          const settingsLink = preferredSource.querySelector('a[href*="google.com/preferences/source"]');
          if (!settingsLink) failures.push('preferred-source settings fallback is missing');
        }

        const sections = [...document.querySelectorAll('.editorial-article .article-flow-section')];
        let checkedPairs = 0;
        for (const section of sections) {
          const heading = section.querySelector('h2');
          const sourceNote = section.querySelector('.article-source-note');
          if (!heading) continue;
          checkTextLineBoxes(heading, `heading ${heading.textContent?.trim() || ''}`);
          if (!sourceNote) continue;

          checkedPairs += 1;
          const headingRect = heading.getBoundingClientRect();
          const noteRect = sourceNote.getBoundingClientRect();
          if (noteRect.top < headingRect.bottom + minGap) {
            failures.push(`source note crowds heading ${heading.textContent?.trim() || ''}`);
          }
          checkTextLineBoxes(sourceNote, `source note for ${heading.textContent?.trim() || ''}`);
        }

        const sourceLinks = document.querySelectorAll('.editorial-sources a[href^="http"]').length;
        if (sourceLinks < 3) failures.push(`expected at least 3 external source links, found ${sourceLinks}`);

        return {
          checkedPairs,
          failures,
          horizontalOverflow,
          sourceLinks,
        };
      }, { minGap: MIN_HEADING_NOTE_GAP, overflowTolerance: HORIZONTAL_OVERFLOW_TOLERANCE });

      const screenshotPath = path.join(articleOutputDir, `${viewport.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      articleReport.viewports.push({
        ...viewport,
        ...result,
        pageErrors,
        screenshotPath,
        pass: result.failures.length === 0 && pageErrors.length === 0,
      });

      await page.close();
    }

    report.articles.push(articleReport);
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

const reportPath = path.join(OUTPUT_DIR, 'latest.json');
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

const failures = report.articles.flatMap((article) => article.viewports.flatMap((viewport) => [
  ...viewport.failures.map((failure) => `${article.slug}/${viewport.name}: ${failure}`),
  ...viewport.pageErrors.map((error) => `${article.slug}/${viewport.name}: page error: ${error}`),
]));

if (failures.length > 0) {
  console.error(`Article visual layout check failed. Report: ${reportPath}`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Article visual layout check passed for ${articles.length} articles across ${VIEWPORTS.length} viewports. Report: ${reportPath}`);
