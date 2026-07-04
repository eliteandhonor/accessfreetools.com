import AxeBuilder from '@axe-core/playwright';
import { createReadStream, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { stat } from 'node:fs/promises';
import { chromium } from 'playwright';

const ROOT = path.resolve('dist');
const OUTPUT_DIR = path.resolve('output', 'accessibility');

const PAGES = [
  '/tools/percentage-calculator/',
  '/tools/image-to-text-ocr-tool/',
  '/blog/free-ai-skills-open-source-tools-organic-growth/',
  '/ask/',
];

const VIEWPORTS = [
  { name: 'desktop', width: 1365, height: 900 },
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
  fail('Missing dist/index.html. Run `npm run build` before `npm run check:accessibility`.');
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
  pages: PAGES,
  viewports: VIEWPORTS,
  checks: [],
};

function isBlockingViolation(violation) {
  if (violation.impact === 'critical' || violation.impact === 'serious') return true;
  return violation.impact === 'moderate' && violation.id.startsWith('landmark');
}

async function inspectPage(pagePath, viewport) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto(`${baseURL}${pagePath}`, { waitUntil: 'networkidle' });

  let axe = new AxeBuilder({ page }).include('main');
  if (pagePath === '/blog/free-ai-skills-open-source-tools-organic-growth/') {
    axe = axe.exclude('iframe[src*="youtube"]');
  }

  const results = await axe.analyze();
  const blockingViolations = results.violations.filter(isBlockingViolation);

  await context.close();

  report.checks.push({
    pagePath,
    viewport,
    pageErrors,
    violationCount: results.violations.length,
    blockingViolations: blockingViolations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl,
      nodes: violation.nodes.map((node) => ({
        target: node.target,
        failureSummary: node.failureSummary,
      })),
    })),
    pass: pageErrors.length === 0 && blockingViolations.length === 0,
  });
}

try {
  for (const viewport of VIEWPORTS) {
    for (const pagePath of PAGES) {
      await inspectPage(pagePath, viewport);
    }
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

const reportPath = path.join(OUTPUT_DIR, 'latest.json');
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

const failures = report.checks.flatMap((check) => [
  ...check.pageErrors.map((error) => `${check.pagePath} ${check.viewport.name}: page error: ${error}`),
  ...check.blockingViolations.map(
    (violation) =>
      `${check.pagePath} ${check.viewport.name}: ${violation.id} (${violation.impact}) ${violation.help}`,
  ),
]);

if (failures.length > 0) {
  console.error(`Accessibility check failed. Report: ${reportPath}`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Accessibility check passed for ${report.checks.length} page/viewport pairs. Report: ${reportPath}`);
