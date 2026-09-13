import { expect, test, type Locator, type TestInfo } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const responseBudgetMs = 5_000;

function evidenceDirectory(testInfo: TestInfo) {
  return resolve('output/project-review-followup/browser-acceptance', testInfo.project.name,
    `${testInfo.testId.replace(/[^a-zA-Z0-9_-]/g, '-')}-retry-${testInfo.retry}`);
}

async function retainScreenshot(region: Locator, testInfo: TestInfo, name: string) {
  const keepAdsOff = region.page().getByRole('button', { name: 'Keep ads off', exact: true });
  if (await keepAdsOff.isVisible()) await keepAdsOff.click();
  await expect(region.page().locator('[data-advertising-choice]')).toBeHidden();
  const directory = evidenceDirectory(testInfo);
  await mkdir(directory, { recursive: true });
  const path = resolve(directory, `${name}.png`);
  await region.screenshot({ path, animations: 'disabled', scale: 'css' });
  await testInfo.attach(name, { path, contentType: 'image/png' });
}

async function measureConversion(button: Locator, outcomeSelector: string) {
  await button.evaluate((element, selector) => {
    const start = 'json-csv-acceptance:start';
    performance.clearMarks(start);
    for (const phase of ['event-loop', 'outcome', 'after-frame']) {
      performance.clearMeasures(`json-csv-acceptance:${phase}`);
    }
    // Capture the real click before React's delegated handler, excluding Playwright/scroll latency.
    element.addEventListener('click', () => {
      performance.mark(start);
      setTimeout(() => performance.measure('json-csv-acceptance:event-loop', start), 0);
      const root = element.closest('.json-csv-tool')!;
      const observer = new MutationObserver(() => {
        if (!root.querySelector(selector)) return;
        observer.disconnect();
        clearTimeout(watchdog);
        performance.measure('json-csv-acceptance:outcome', start);
        requestAnimationFrame(() => {
          setTimeout(() => performance.measure('json-csv-acceptance:after-frame', start), 0);
        });
      });
      observer.observe(root, { childList: true, subtree: true });
      const watchdog = setTimeout(() => observer.disconnect(), 8_000);
    }, { capture: true, once: true });
  }, outcomeSelector);
  await button.click();
  await expect.poll(() => button.evaluate(() =>
    performance.getEntriesByName('json-csv-acceptance:after-frame', 'measure').length),
  { message: 'Conversion must render its outcome and yield after a frame', timeout: 8_000 }).toBe(1);
  return button.evaluate(() => ({
    eventLoopMs: performance.getEntriesByName('json-csv-acceptance:event-loop', 'measure')[0].duration,
    outcomeMs: performance.getEntriesByName('json-csv-acceptance:outcome', 'measure')[0].duration,
    afterFrameMs: performance.getEntriesByName('json-csv-acceptance:after-frame', 'measure')[0].duration,
  }));
}

test('JSON resource limits reject sparse expansion and allow another conversion', async ({ page, baseURL }, testInfo) => {
  const sentinels = ['SYNTHETICPRIVATEFIELD', 'SYNTHETICPRIVATEVALUE'];
  const leakedRequests: string[] = [];
  await page.route('**/*', async (route) => {
    const request = route.request();
    const payload = `${request.url()} ${request.postData() ?? ''}`;
    if (sentinels.some((marker) => payload.includes(marker))) leakedRequests.push(request.method());
    if (new URL(request.url()).origin !== new URL(baseURL!).origin) return route.abort();
    if (new URL(request.url()).pathname.startsWith('/api/analytics/')) return route.fulfill({ status: 204 });
    return route.continue();
  });
  await page.goto('/tools/json-to-csv-converter/');
  await expect(page.locator('astro-island[component-url*="JsonToCsvConverter"]')).not.toHaveAttribute('ssr', '');
  const input = page.getByLabel('JSON object or array of objects', { exact: true });
  const convert = page.getByRole('button', { name: 'Convert JSON', exact: true });
  const sparseJson = JSON.stringify(Array.from({ length: 50_000 }, (_, i) => ({ [`key${i}`]: i })));
  // Below the 5 MB input limit, but an unguarded conversion expands to 2.5 billion cells.
  expect(Buffer.byteLength(sparseJson, 'utf8')).toBeLessThan(5 * 1024 * 1024);
  await input.fill(sparseJson);
  const rejection = await measureConversion(convert, '.json-csv-tool__error');
  await expect(page.getByRole('alert')).toContainText('250,000 cells');
  await expect(page.getByRole('button', { name: 'Download CSV', exact: true })).toHaveCount(0);
  await retainScreenshot(page.getByRole('alert'), testInfo, 'json-huge-sparse-rejection');
  await input.fill('{"SYNTHETICPRIVATEFIELD":"SYNTHETICPRIVATEVALUE"}');
  // Positive control: the same probe must observe a real successful conversion after rejection.
  const positiveControl = await measureConversion(convert, '.json-csv-tool__result');
  await expect(page.getByLabel('Copy-ready CSV')).toHaveValue('SYNTHETICPRIVATEFIELD\nSYNTHETICPRIVATEVALUE');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await retainScreenshot(page.locator('.json-csv-tool__result'), testInfo, 'json-successful-recalculation');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download CSV', exact: true }).click();
  const csvDownload = await download;
  expect(csvDownload.suggestedFilename()).toBe('json-to-csv.csv');
  const bytes = await readFile((await csvDownload.path())!);
  expect(bytes.toString('utf8')).toBe('SYNTHETICPRIVATEFIELD\r\nSYNTHETICPRIVATEVALUE');
  expect(leakedRequests).toEqual([]);

  const path = resolve(evidenceDirectory(testInfo), 'json-responsiveness.json');
  await writeFile(path, JSON.stringify({
    project: testInfo.project.name,
    testId: testInfo.testId,
    retry: testInfo.retry,
    measuredAt: new Date().toISOString(),
    responseBudgetMs,
    inputBytes: Buffer.byteLength(sparseJson, 'utf8'),
    sparseRows: 50_000,
    impliedCells: 50_000 * 50_000,
    rejection,
    positiveControl,
  }, null, 2));
  await testInfo.attach('json-responsiveness', { path, contentType: 'application/json' });
  for (const [scenario, measurements] of Object.entries({ rejection, positiveControl })) {
    for (const [phase, elapsedMs] of Object.entries(measurements)) {
      expect(Number.isFinite(elapsedMs), `${scenario} ${phase} must be measured in-page`).toBe(true);
      expect(elapsedMs, `${scenario} ${phase} cannot precede the click`).toBeGreaterThanOrEqual(0);
      expect(elapsedMs, `${scenario} ${phase} exceeded the ${responseBudgetMs} ms acceptance budget`).toBeLessThanOrEqual(responseBudgetMs);
    }
  }
});
