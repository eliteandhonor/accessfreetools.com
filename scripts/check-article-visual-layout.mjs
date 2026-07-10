import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = path.resolve('dist');
const OUTPUT_DIR = path.resolve('output', 'article-visual-layout');
const ARTICLE_PATH = '/blog/free-ai-skills-open-source-tools-organic-growth/';
const MIN_HEADING_NOTE_GAP = 3;
const MIN_SOURCE_NOTE_PAIRS = 6;
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

if (!existsSync(path.join(ROOT, 'index.html'))) {
  fail('Missing dist/index.html. Run `npm run build` before `npm run check:article-visual`.');
}

mkdirSync(OUTPUT_DIR, { recursive: true });

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1');
    let requestPath = decodeURIComponent(url.pathname);
    if (requestPath.endsWith('/')) requestPath += 'index.html';

    let filePath = path.resolve(ROOT, requestPath.slice(1));
    if (!filePath.startsWith(ROOT)) {
      throw new Error('Path escapes dist root');
    }

    if (!existsSync(filePath)) {
      const indexPath = path.resolve(ROOT, requestPath.slice(1), 'index.html');
      if (indexPath.startsWith(ROOT) && existsSync(indexPath)) {
        filePath = indexPath;
      }
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
  articlePath: ARTICLE_PATH,
  generatedAt: new Date().toISOString(),
  minHeadingNoteGap: MIN_HEADING_NOTE_GAP,
  minSourceNotePairs: MIN_SOURCE_NOTE_PAIRS,
  horizontalOverflowTolerance: HORIZONTAL_OVERFLOW_TOLERANCE,
  viewports: [],
};

try {
  for (const viewport of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.goto(`${baseURL}${ARTICLE_PATH}`, { waitUntil: 'networkidle' });

    const result = await page.evaluate(({ minGap, minSourceNotePairs, overflowTolerance }) => {
      const failures = [];
      const html = document.documentElement;
      const horizontalOverflow = html.scrollWidth > html.clientWidth + overflowTolerance;
      if (horizontalOverflow) {
        const offenders = [...document.querySelectorAll('body *')]
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return {
              element,
              left: rect.left,
              right: rect.right,
              width: rect.width,
            };
          })
          .filter((item) => item.left < -overflowTolerance || item.right > html.clientWidth + overflowTolerance)
          .sort((left, right) => right.right - left.right)
          .slice(0, 6)
          .map((item) => {
            const element = item.element;
            const label = [
              element.tagName.toLowerCase(),
              element.id ? `#${element.id}` : '',
              [...element.classList].slice(0, 3).map((name) => `.${name}`).join(''),
            ].join('');
            return `${label} (${item.left.toFixed(1)}-${item.right.toFixed(1)}, width ${item.width.toFixed(1)})`;
          });
        failures.push(
          `document horizontally overflows: scrollWidth ${html.scrollWidth}, clientWidth ${html.clientWidth}; offenders: ${offenders.join(', ') || 'none found'}`,
        );
      }

      function checkTextLineBoxes(element, label) {
        const elementRect = element.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(element);

        for (const rect of range.getClientRects()) {
          if (rect.width < 1 || rect.height < 1) continue;
          if (rect.left < elementRect.left - 1 || rect.right > elementRect.right + 1) {
            failures.push(
              `${label} text line escapes its container: line ${rect.left.toFixed(1)}-${rect.right.toFixed(
                1,
              )}, container ${elementRect.left.toFixed(1)}-${elementRect.right.toFixed(1)}`,
            );
          }
        }
      }

      const articleBody = document.querySelector('.blog-article-body');
      const sidecar = document.querySelector('.article-sidecar');
      if (articleBody && sidecar) {
        const bodyRect = articleBody.getBoundingClientRect();
        const sidecarRect = sidecar.getBoundingClientRect();
        const boxesIntersect =
          bodyRect.left < sidecarRect.right &&
          bodyRect.right > sidecarRect.left &&
          bodyRect.top < sidecarRect.bottom &&
          bodyRect.bottom > sidecarRect.top;

        if (boxesIntersect) {
          failures.push('article body and sidecar overlap');
        }
      }

      const sections = [...document.querySelectorAll('.editorial-article .article-flow-section')];
      let checkedPairs = 0;

      for (const section of sections) {
        const heading = section.querySelector('h2');
        const sourceNote = section.querySelector('.article-source-note');
        if (!heading || !sourceNote) continue;

        checkedPairs += 1;
        const headingRect = heading.getBoundingClientRect();
        const noteRect = sourceNote.getBoundingClientRect();
        const headingText = heading.textContent?.trim().replace(/\s+/g, ' ') ?? 'Untitled heading';

        if (noteRect.top < headingRect.bottom + minGap) {
          failures.push(
            `"${headingText}" source note overlaps or crowds heading: heading bottom ${headingRect.bottom.toFixed(
              1,
            )}, note top ${noteRect.top.toFixed(1)}`,
          );
        }

        if (heading.scrollWidth > heading.clientWidth + 1) {
          failures.push(`"${headingText}" heading text overflows its box`);
        }

        if (sourceNote.scrollWidth > sourceNote.clientWidth + 1) {
          failures.push(`"${headingText}" source note text overflows its box`);
        }

        checkTextLineBoxes(heading, `"${headingText}" heading`);
        checkTextLineBoxes(sourceNote, `"${headingText}" source note`);
      }

      const sourceNotes = document.querySelectorAll('.article-source-note').length;
      if (sourceNotes < minSourceNotePairs || checkedPairs < minSourceNotePairs) {
        failures.push(
          `expected at least ${minSourceNotePairs} heading/source-note pairs, found ${checkedPairs} checked pairs and ${sourceNotes} source notes`,
        );
      }

      return {
        checkedPairs,
        failures,
        horizontalOverflow,
        sourceNotes,
        headingLinks: document.querySelectorAll('.article-heading-link').length,
      };
    }, {
      minGap: MIN_HEADING_NOTE_GAP,
      minSourceNotePairs: MIN_SOURCE_NOTE_PAIRS,
      overflowTolerance: HORIZONTAL_OVERFLOW_TOLERANCE,
    });

    const screenshotPath = path.join(OUTPUT_DIR, `${viewport.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    report.viewports.push({
      ...viewport,
      ...result,
      pageErrors,
      screenshotPath,
      pass: result.failures.length === 0 && pageErrors.length === 0,
    });

    await page.close();
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

const reportPath = path.join(OUTPUT_DIR, 'latest.json');
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

const failures = report.viewports.flatMap((viewport) => [
  ...viewport.failures.map((failure) => `${viewport.name}: ${failure}`),
  ...viewport.pageErrors.map((error) => `${viewport.name}: page error: ${error}`),
]);

if (failures.length > 0) {
  console.error(`Article visual layout check failed. Report: ${reportPath}`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `Article visual layout check passed for ${report.viewports.length} viewports. Report: ${reportPath}`,
);
