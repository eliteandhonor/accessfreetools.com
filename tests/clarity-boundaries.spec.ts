import { expect, test } from '@playwright/test';

test('hydrated tool and Ask output keep explicit Clarity boundaries', async ({ page, baseURL }, testInfo) => {
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== new URL(baseURL!).origin) return route.abort();
    if (url.pathname.startsWith('/api/analytics/')) return route.fulfill({ status: 204 });
    if (url.pathname === '/api/v1/ask') return route.fulfill({
      json: { ok: false, message: 'SYNTHETICASKPRIVATEERROR' },
    });
    return route.continue();
  });
  await page.goto('/tools/text-case-converter/');
  const input = page.getByRole('textbox', { name: 'Text to convert', exact: true });
  await expect(page.locator('astro-island').filter({ has: input })).not.toHaveAttribute('ssr', '');
  await input.fill('SYNTHETICTOOLPRIVATEWORDS');
  await page.getByRole('button', { name: 'Convert case', exact: true }).click();
  await expect(page.locator('.advanced-result-card')).toContainText(/synthetictoolprivatewords/i);
  expect(await page.locator('.advanced-result-card').evaluate((element) =>
    Boolean(element.closest('[data-clarity-mask="true"]')))).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('masked-tool-boundary.png'), fullPage: true });
  await page.goto('/ask/');
  const question = page.getByLabel('Ask a calculator or utility question');
  await expect(page.locator('astro-island').filter({ has: question })).not.toHaveAttribute('ssr', '');
  await question.fill('SYNTHETICASKPRIVATEQUESTION');
  await page.locator('.ask-form button[type="submit"]').click();
  await expect(page.locator('.ask-result')).toContainText('SYNTHETICASKPRIVATEERROR');
  expect(await page.locator('.ask-result').evaluate((element) =>
    Boolean(element.closest('[data-clarity-mask="true"]')))).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('masked-ask-boundary.png'), fullPage: true });
});

test('visible browser opt-out prevents Clarity loading after reload', async ({ context, page, baseURL }) => {
  let clarityAttempts = 0;
  let analyticsAttempts = 0;
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname.endsWith('clarity.ms')) {
      clarityAttempts += 1;
      return route.abort();
    }
    if (url.origin !== 'https://accessfreetools.com') return route.abort();
    if (url.pathname.startsWith('/api/analytics/')) {
      analyticsAttempts += 1;
      return route.fulfill({ status: 204 });
    }
    // Serve the real local build at a virtual production origin. No telemetry leaves this fixture.
    const response = await route.fetch({ url: `${baseURL}${url.pathname}${url.search}` });
    return route.fulfill({ response });
  });
  await page.goto('https://accessfreetools.com/privacy-policy/');
  const status = page.locator('[data-public-analytics-status]');
  await expect(status).toContainText('currently counted');
  await expect.poll(() => clarityAttempts).toBe(1);
  await expect.poll(() => analyticsAttempts).toBeGreaterThan(0);
  const previousAnalytics = analyticsAttempts;
  await page.getByRole('button', { name: 'Exclude this browser', exact: true }).click();
  await expect(status).toContainText('excluded');
  await page.reload();
  await expect(status).toContainText('excluded');
  expect(clarityAttempts).toBe(1);
  expect(analyticsAttempts).toBe(previousAnalytics);
});
