import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';

// All pages, API replies, storage values and beacons are isolated synthetic fixtures.
const dashboard = await readFile(new URL('../../src/pages/admin/analytics.astro', import.meta.url), 'utf8');
const css = await readFile(new URL('../../src/styles/global.css', import.meta.url), 'utf8');
const layout = await readFile(new URL('../../src/components/BaseLayout.astro', import.meta.url), 'utf8');
const tracker = [...layout.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
  .find((match) => match[1].includes('const analyticsHosts'))[1];
const dashboardScript = dashboard.match(/<script\b[^>]*>([\s\S]*?)<\/script>/)[1];
const markup = dashboard.slice(dashboard.indexOf('<section'), dashboard.indexOf('<script'));
const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>${css}</style></head><body><main>${markup}</main><script>const optOutKey='access-free-tools-analytics-opt-out';${dashboardScript}</script></body></html>`;
const output = resolve('output/project-review-followup/EV-04');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const status of ['partial', 'unknown', 'legacy']) {
      const coverage = status === 'legacy' ? undefined : {
        status, reasons: ['file-tail-limit', 'deployment-continuity-unverified', 'archive-retention-limits-history'],
        requestedStart: '2026-08-07T12:00:00.000Z', requestedEnd: '2026-09-06T12:00:00.000Z',
        observedStart: '2026-09-04T00:00:00.000Z', observedEnd: '2026-09-06T01:00:00.000Z',
        rangeObservedStart: '2026-09-04T00:00:00.000Z', rangeObservedEnd: '2026-09-06T01:00:00.000Z',
      };
      await page.route('**/*', async (route) => {
        const url = new URL(route.request().url());
        if (url.hostname !== 'analytics-fixture.invalid') return route.abort();
        if (url.pathname === '/api/analytics/events') return route.fulfill({ json: { summary: {
          coverage, days: 30, generatedAt: '2026-09-06T12:00:00.000Z', today: { visitors: 2, newVisitors: 1, returningVisitors: 1 },
        } } });
        return route.fulfill({ contentType: 'text/html', body: html });
      });
      await page.goto('https://analytics-fixture.invalid/admin/analytics/');
      await page.locator('input[type=password]').fill('synthetic-fixture-token');
      await page.locator('input[type=password]').press('Enter');
      await page.locator('[data-analytics-coverage]').waitFor({ state: 'visible' });
      assert.match(await page.locator('[data-analytics-coverage]').innerText(), /Comparisons are blocked/);
      assert.match(await page.locator('[data-analytics-coverage]').innerText(), status === 'partial' ? /Partial coverage/ : /Unknown coverage/);
      assert.match(await page.locator('[data-analytics-coverage-dates]').innerText(), /Requested \(30 days\)/);
      assert.equal(await page.locator('[data-metric="todayVisitors"]').innerText(), '2');
      const geometry = await page.locator('[data-analytics-coverage]').evaluate((element) => {
        const section = element.closest('section');
        const next = section.nextElementSibling;
        return { width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth,
          overlap: section.getBoundingClientRect().bottom > next.getBoundingClientRect().top + 1 };
      });
      assert.ok(geometry.scrollWidth <= geometry.width + 1, JSON.stringify(geometry));
      assert.equal(geometry.overlap, false);
      await page.screenshot({ path: resolve(output, `dashboard-${status}-${viewport.width}.png`), fullPage: true });
      await page.unroute('**/*');
    }
    assert.deepEqual(errors, []);
    await context.close();
  }

  const context = await browser.newContext();
  const page = await context.newPage();
  await context.addInitScript(() => {
    window.fixtureBeacons = [];
    navigator.sendBeacon = (url, body) => { window.fixtureBeacons.push({ url, body }); return true; };
  });
  await page.route('**/*', (route) => route.fulfill({ contentType: 'text/html', body: `<!doctype html><title>Fixture</title><script>${tracker}</script>` }));
  for (const path of ['/private-analytics/?token=synthetic#x', '/admin', '/admin/analytics/', '/api', '/api/v1/run/', '/mcp', '/%61dmin/',
    '//admin/analytics/', '///private-analytics/', '/\\api/v1/run/', '//%61dmin/', '//tools/../api/', '/tools/?q=synthetic#x']) {
    await page.goto(`https://accessfreetools.com${path}`);
    await page.evaluate(() => document.dispatchEvent(new CustomEvent('aft:tool-action', { detail: {
      action: 'Calculate', toolSlug: 'fixture', toolName: 'Fixture',
    } })));
    const payloads = await page.evaluate(async () => Promise.all(window.fixtureBeacons.map(async ({ body }) => JSON.parse(await body.text()))));
    assert.equal(payloads.length, path.startsWith('/tools/') ? 2 : 0, path);
    assert.doesNotMatch(JSON.stringify(payloads), /synthetic|token=|q=/);
  }
  await context.close();
  console.log('PASS: six dashboard renders (1440/390px, partial/unknown/legacy), no overflow/section overlap/page errors; thirteen tracker routes and custom actions; all network intercepted.');
  console.log(`Synthetic screenshots: ${output}`);
} finally {
  await browser.close();
}
