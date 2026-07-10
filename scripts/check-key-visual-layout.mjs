import { createReadStream, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { stat } from 'node:fs/promises';
import { chromium } from 'playwright';

const ROOT = path.resolve('dist');
const OUTPUT_DIR = path.resolve('output', 'key-visual-layout');
const BLOG_SEARCH_FIRST_VIEWPORT_MIN_HEIGHT = 800;
const HORIZONTAL_OVERFLOW_TOLERANCE = 4;

const VIEWPORTS = [
  { name: 'desktop', width: 1365, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'mobile-320', width: 320, height: 568 },
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
  fail('Missing dist/index.html. Run `npm run build` before `npm run check:key-visual`.');
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
  generatedAt: new Date().toISOString(),
  horizontalOverflowTolerance: HORIZONTAL_OVERFLOW_TOLERANCE,
  checks: [],
};

async function inspectPage({ pagePath, viewport, mode }) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto(`${baseURL}${pagePath}`, { waitUntil: 'networkidle' });

  const result = await page.evaluate(
    ({ blogSearchFirstViewportMinHeight, mode: pageMode, overflowTolerance, viewportHeight }) => {
      const failures = [];
      const html = document.documentElement;

      if (html.scrollWidth > html.clientWidth + overflowTolerance) {
        failures.push(`horizontal overflow: scrollWidth ${html.scrollWidth}, clientWidth ${html.clientWidth}`);
      }

      if (pageMode === 'blog') {
        const search = document.querySelector('.blog-search-panel');
        const firstFeature = document.querySelector('.guide-feature-panel');
        const searchInput = document.querySelector('#blog-guide-search');

        if (!search) {
          failures.push('missing blog search panel');
        }

        if (!searchInput) {
          failures.push('missing blog guide search input');
        }

        if (search && firstFeature && search.compareDocumentPosition(firstFeature) & Node.DOCUMENT_POSITION_PRECEDING) {
          failures.push('blog search appears after curated guide panels');
        }

        if (search && viewportHeight >= blogSearchFirstViewportMinHeight) {
          const rect = search.getBoundingClientRect();
          if (rect.top > viewportHeight - 80) {
            failures.push(`blog search starts too low in the first viewport: top ${rect.top.toFixed(1)}`);
          }
        }
      }

      if (pageMode === 'tools') {
        const launchpad = document.querySelector('.tools-launchpad');
        const searchInput = document.querySelector('#tool-library-search');

        if (!launchpad) {
          failures.push('missing tools launchpad');
        }

        if (!searchInput) {
          failures.push('missing tool library search input');
        }
      }

      if (pageMode === 'absolute-tool') {
        const topGuideLink = document.querySelector(
          '.tool-title-actions a[href="/blog/how-to-use-absolute-value-calculator/"]',
        );
        const calculator = document.querySelector('.absolute-calculator');
        const guideCard = document.querySelector('.absolute-guide-card');
        const guideCardLink = document.querySelector(
          '.absolute-guide-card a[href="/blog/how-to-use-absolute-value-calculator/"]',
        );
        const duplicateTopExamples = document.querySelectorAll('.absolute-panel > .absolute-quick-grid');

        if (!topGuideLink) {
          failures.push('missing top Read guide action for Absolute Value Calculator');
        }

        if (!guideCard || !guideCardLink) {
          failures.push('missing absolute value side-panel guide and visual card');
        }

        if (duplicateTopExamples.length > 0) {
          failures.push('absolute value examples are duplicated in the main input panel');
        }

        if (topGuideLink && calculator) {
          const guideRect = topGuideLink.getBoundingClientRect();
          const calculatorRect = calculator.getBoundingClientRect();
          if (guideRect.top > calculatorRect.top) {
            failures.push('top guide action appears after the calculator surface');
          }
        }
      }

      if (pageMode === 'gallery') {
        for (const grid of document.querySelectorAll('[data-gallery-grid]')) {
          const items = [...grid.querySelectorAll('[data-gallery-item]')];
          const visibleItems = items.filter((item) => !item.hidden);
          const limit = Number(grid.getAttribute('data-gallery-limit')) || 24;
          const reveal = document.querySelector(`[data-gallery-reveal="${grid.id}"]`);

          if (items.length > limit && visibleItems.length !== limit) {
            failures.push(`${grid.id} initially shows ${visibleItems.length} of ${items.length}, expected ${limit}`);
          }
          if (items.length > limit && (!reveal || reveal.hidden)) {
            failures.push(`${grid.id} is missing its visible Show all control`);
          }
        }
      }

      return {
        failures,
        title: document.title,
      };
    },
    {
      blogSearchFirstViewportMinHeight: BLOG_SEARCH_FIRST_VIEWPORT_MIN_HEIGHT,
      mode,
      overflowTolerance: HORIZONTAL_OVERFLOW_TOLERANCE,
      viewportHeight: viewport.height,
    },
  );

  if (mode === 'gallery') {
    const interaction = await page.evaluate(() => {
      const reveal = document.querySelector('[data-gallery-reveal]:not([hidden])');
      if (!(reveal instanceof HTMLButtonElement)) return { pass: false, message: 'No gallery reveal button was interactive.' };
      const gridId = reveal.getAttribute('aria-controls') ?? '';
      const grid = document.getElementById(gridId);
      const hiddenBefore = grid?.querySelectorAll('[data-gallery-item][hidden]').length ?? 0;
      reveal.click();
      const hiddenAfter = grid?.querySelectorAll('[data-gallery-item][hidden]').length ?? 0;
      const pass = hiddenBefore > 0 && hiddenAfter === 0 && reveal.getAttribute('aria-expanded') === 'true';
      return {
        pass,
        message: pass
          ? 'Gallery Show all control reveals the remaining items.'
          : `Gallery reveal state was hiddenBefore=${hiddenBefore}, hiddenAfter=${hiddenAfter}, expanded=${reveal.getAttribute('aria-expanded')}.`,
      };
    });
    if (!interaction.pass) result.failures.push(interaction.message);
  }

  const safePath = pagePath.replaceAll('/', '_').replace(/^_/, '').replace(/_$/, '') || 'home';
  const screenshotPath = path.join(OUTPUT_DIR, `${safePath}-${viewport.name}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: mode !== 'gallery' });
  await page.close();

  report.checks.push({
    pagePath,
    viewport,
    mode,
    pageErrors,
    screenshotPath,
    ...result,
    pass: result.failures.length === 0 && pageErrors.length === 0,
  });
}

try {
  for (const viewport of VIEWPORTS) {
    await inspectPage({ pagePath: '/blog/', viewport, mode: 'blog' });
    await inspectPage({ pagePath: '/tools/', viewport, mode: 'tools' });
    await inspectPage({ pagePath: '/tools/absolute-value-calculator/', viewport, mode: 'absolute-tool' });
    await inspectPage({ pagePath: '/gallery/finance/', viewport, mode: 'gallery' });
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

const reportPath = path.join(OUTPUT_DIR, 'latest.json');
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

const failures = report.checks.flatMap((check) => [
  ...check.failures.map((failure) => `${check.pagePath} ${check.viewport.name}: ${failure}`),
  ...check.pageErrors.map((error) => `${check.pagePath} ${check.viewport.name}: page error: ${error}`),
]);

if (failures.length > 0) {
  console.error(`Key visual layout check failed. Report: ${reportPath}`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Key visual layout check passed for ${report.checks.length} page/viewport pairs. Report: ${reportPath}`);
