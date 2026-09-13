import AxeBuilder from '@axe-core/playwright';
import { createReadStream, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import path from 'node:path';
import { stat } from 'node:fs/promises';
import { chromium } from 'playwright';
import { classifyAccessibilityRequest, createAccessibilityCheck, createAccessibilityPlan, summarizeAccessibilityChecks } from './lib/accessibility-report.mjs';

const ROOT = path.resolve('dist');
const OUTPUT_DIR = path.resolve('output', 'accessibility');

const PAGES = [
  '/tools/',
  '/tools/percentage-calculator/',
  '/tools/image-to-text-ocr-tool/',
  '/tools/text-to-speech-audiobook-generator/',
  '/tools/four-in-a-row-game/',
  '/blog/',
  '/blog/free-ai-skills-open-source-tools-organic-growth/',
  '/ask/',
  '/gallery/finance/',
];

const VIEWPORTS = [
  { name: 'desktop', width: 1365, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'mobile-320', width: 320, height: 568 },
];
const PLAN = createAccessibilityPlan({ pages: PAGES, viewports: VIEWPORTS, themeMatrix: process.argv.includes('--theme-matrix') });

const HYDRATION_TIMEOUT_MS = 5000;

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
  ...PLAN,
  conditions: {
    browserVersion: browser.version(),
    documentRoot: ROOT,
    buildFreshness: 'not-attested-by-this-script; attach coordinator build evidence',
    network: 'Same-origin public GET assets only; third-party, private/API, model/runtime and non-GET requests blocked.',
    context: 'New isolated context per check; service workers blocked; DNT, analytics opt-out and owner ad suppression enabled.',
    scope: 'Owned static pages with no submitted user payloads or screenshots; blocked embeds and models are not verified.',
  },
  checks: [],
};

async function waitForHydratedSelector(page, selector) {
  try {
    await page.locator(selector).waitFor({ state: 'visible', timeout: HYDRATION_TIMEOUT_MS });
    await page.waitForFunction(
      (targetSelector) => {
        const target = document.querySelector(targetSelector);
        const island = target?.closest('astro-island');
        return Boolean(target) && (!island || !island.hasAttribute('ssr'));
      },
      selector,
      { timeout: HYDRATION_TIMEOUT_MS },
    );
    return true;
  } catch {
    return false;
  }
}

async function inspectKeyboardAndStatusBehavior(page, pagePath) {
  const assertions = [];

  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    window.scrollTo(0, 0);
  });
  await page.keyboard.press('Tab');

  const skipLinkState = await page.evaluate(() => {
    const activeElement = document.activeElement;
    return {
      focusedHref: activeElement instanceof Element ? activeElement.getAttribute('href') ?? '' : '',
      focusedTag: activeElement?.tagName.toLowerCase() ?? 'none',
      targetExists: Boolean(document.querySelector('#main-content')),
    };
  });
  const skipLinkPass =
    skipLinkState.focusedTag === 'a' &&
    skipLinkState.focusedHref === '#main-content' &&
    skipLinkState.targetExists;
  assertions.push({
    id: 'first-tab-skip-link',
    pass: skipLinkPass,
    message: skipLinkPass
      ? 'First Tab focuses a skip link targeting #main-content.'
      : `First Tab focused ${skipLinkState.focusedTag} with href "${skipLinkState.focusedHref}"; #main-content exists: ${skipLinkState.targetExists}.`,
  });

  if (pagePath === '/tools/') {
    const searchHydrated = await waitForHydratedSelector(page, '#tool-library-search');
    let focusedId = '';

    if (searchHydrated) {
      await page.keyboard.press('Control+KeyK');
      focusedId = await page.evaluate(() => document.activeElement?.id ?? '');
    }

    const shortcutPass = searchHydrated && focusedId === 'tool-library-search';
    assertions.push({
      id: 'tools-ctrl-k-search-focus',
      pass: shortcutPass,
      message: shortcutPass
        ? 'Ctrl+K focuses #tool-library-search.'
        : searchHydrated
          ? `Ctrl+K focused "${focusedId || 'no element'}" instead of #tool-library-search.`
          : '#tool-library-search did not become ready for keyboard input.',
    });
  }

  const statusSelector =
    pagePath === '/tools/'
      ? '.results-heading p'
      : pagePath === '/blog/'
        ? '.blog-search-count'
        : '';

  if (statusSelector) {
    const statusState = await page.evaluate((selector) => {
      const status = document.querySelector(selector);
      return {
        ariaLive: status?.getAttribute('aria-live') ?? '',
        exists: Boolean(status),
        role: status?.getAttribute('role') ?? '',
      };
    }, statusSelector);
    const statusPass = statusState.exists && statusState.role === 'status' && statusState.ariaLive === 'polite';
    assertions.push({
      id: pagePath === '/tools/' ? 'tools-result-count-status' : 'blog-result-count-status',
      pass: statusPass,
      message: statusPass
        ? 'The result count exposes role="status" with aria-live="polite".'
        : `Result count status semantics were role="${statusState.role}" and aria-live="${statusState.ariaLive}".`,
    });
  }

  const themeHydrated = await waitForHydratedSelector(page, '.theme-picker-trigger');
  let panelClosed = false;
  let swatchFocused = false;
  let triggerFocused = false;

  if (themeHydrated) {
    try {
      await page.locator('.theme-picker-trigger').click();
      const firstSwatch = page.locator('.theme-swatch').first();
      await firstSwatch.waitFor({ state: 'visible', timeout: HYDRATION_TIMEOUT_MS });
      await firstSwatch.focus();
      swatchFocused = await firstSwatch.evaluate((swatch) => document.activeElement === swatch);
      await page.keyboard.press('Escape');
      await page.locator('.theme-picker-panel').waitFor({ state: 'hidden', timeout: HYDRATION_TIMEOUT_MS });
      panelClosed = true;
      triggerFocused = await page
        .locator('.theme-picker-trigger')
        .evaluate((trigger) => document.activeElement === trigger);
    } catch {
      // The stable state values below describe which part of the interaction failed.
    }
  }

  const themeEscapePass = themeHydrated && swatchFocused && panelClosed && triggerFocused;
  assertions.push({
    id: 'theme-escape-restores-trigger-focus',
    pass: themeEscapePass,
    message: themeEscapePass
      ? 'Escape from a theme swatch closes the picker and restores trigger focus.'
      : `Theme picker ready: ${themeHydrated}; swatch focused: ${swatchFocused}; panel closed: ${panelClosed}; trigger focused: ${triggerFocused}.`,
  });

  return assertions;
}

async function selectTheme(page, requestedTheme) {
  const method = PLAN.mode === 'selected-theme-matrix' ? 'swatch-click' : 'isolated-default';
  let selectionCompleted = method === 'isolated-default';
  if (method === 'swatch-click' && await waitForHydratedSelector(page, '.theme-picker-trigger')) {
    try {
      await page.locator('.theme-picker-trigger').click();
      await page.getByRole('button', { name: `Use ${requestedTheme.label} look`, exact: true }).click();
      await page.waitForFunction((id) => document.documentElement.dataset.theme === id, requestedTheme.id,
        { timeout: HYDRATION_TIMEOUT_MS });
      selectionCompleted = true;
    } catch {
      selectionCompleted = false;
    }
  }
  const state = await page.evaluate(() => {
    let storedId = null;
    try { storedId = window.localStorage.getItem('access-tools-theme'); } catch { /* Preference storage can be unavailable. */ }
    return { observedId: document.documentElement.dataset.theme ?? null, storedId };
  });
  return { requestedId: requestedTheme.id, requestedLabel: requestedTheme.label, method, ...state,
    applied: selectionCompleted && state.observedId === requestedTheme.id && (method === 'isolated-default' || state.storedId === requestedTheme.id) };
}

async function inspectPage(pagePath, viewport, requestedTheme) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height },
    serviceWorkers: 'block', acceptDownloads: false, extraHTTPHeaders: { DNT: '1' } });
  const blockedRequestCounts = {};
  await context.route('**/*', (route) => {
    const decision = classifyAccessibilityRequest(route.request().url(), route.request().method(), baseURL);
    if (decision === 'allowed') return route.continue();
    blockedRequestCounts[decision] = (blockedRequestCounts[decision] ?? 0) + 1;
    return route.abort();
  });
  await context.addInitScript(() => {
    try {
      window.localStorage.setItem('access-free-tools-analytics-opt-out', 'true');
      window.localStorage.setItem('access-free-tools-owner-ads-disabled', 'true');
    } catch { /* Sandboxed embeds may deny storage. */ }
  });
  try {
    const page = await context.newPage();
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await page.goto(`${baseURL}${pagePath}`, { waitUntil: 'networkidle' });
    const assertions = await inspectKeyboardAndStatusBehavior(page, pagePath);
    const theme = await selectTheme(page, requestedTheme);

    let axe = new AxeBuilder({ page });
    if (pagePath === '/blog/free-ai-skills-open-source-tools-organic-growth/') {
      axe = axe.exclude('iframe[src*="youtube"]');
    }
    const results = await axe.analyze();
    assertions.push({ id: 'requested-theme-applied', pass: theme.applied,
      message: theme.applied ? `Theme ${theme.requestedId} verified by ${theme.method}.`
        : `Requested ${theme.requestedId}; observed ${theme.observedId}; stored ${theme.storedId}; selection not proven.` });
    report.checks.push(createAccessibilityCheck({ pagePath, viewport, results, assertions, pageErrors, theme, blockedRequestCounts }));
  } finally {
    await context.close();
  }
}

try {
  for (const viewport of PLAN.viewports) {
    for (const pagePath of PLAN.pages) {
      for (const theme of PLAN.themes) await inspectPage(pagePath, viewport, theme);
    }
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

const reportPath = path.join(OUTPUT_DIR, PLAN.mode === 'selected-theme-matrix' ? 'theme-matrix.json' : 'latest.json');
report.summary = summarizeAccessibilityChecks(report.checks);
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

const failures = report.checks.flatMap((check) => [
  ...check.pageErrors.map((error) => `${check.pagePath} ${check.viewport.name} ${check.theme.requestedId}: page error: ${error}`),
  ...check.assertions
    .filter((assertion) => !assertion.pass)
    .map(
      (assertion) =>
        `${check.pagePath} ${check.viewport.name} ${check.theme.requestedId}: ${assertion.id}: ${assertion.message}`,
    ),
  ...check.blockingViolations.map(
    (violation) =>
      `${check.pagePath} ${check.viewport.name} ${check.theme.requestedId}: ${violation.id} (${violation.impact}) ${violation.help}`,
  ),
]);

if (failures.length > 0) {
  console.error(`Accessibility check failed. Report: ${reportPath}`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Automated accessibility gate passed for ${report.checks.length} checks. Manual review: ${report.summary.manualReview.status} (${report.summary.manualReview.unresolvedFindingCount} unresolved findings). Conformance not assessed. Report: ${reportPath}`);
