import { expect, test, type Locator, type TestInfo } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

async function retainScreenshot(region: Locator, testInfo: TestInfo, name: string) {
  const keepAdsOff = region.page().getByRole('button', { name: 'Keep ads off', exact: true });
  if (await keepAdsOff.isVisible()) await keepAdsOff.click();
  await expect(region.page().locator('[data-advertising-choice]')).toBeHidden();
  const directory = resolve('output/project-review-followup/browser-acceptance', testInfo.project.name,
    `${testInfo.testId.replace(/[^a-zA-Z0-9_-]/g, '-')}-retry-${testInfo.retry}`);
  await mkdir(directory, { recursive: true });
  const path = resolve(directory, `${name}.png`);
  await region.screenshot({ path, animations: 'disabled', scale: 'css' });
  await testInfo.attach(name, { path, contentType: 'image/png' });
}

const rateRangeError = 'Required rate exceeds the supported rate range of 0% to 19200% per year.';

test.beforeEach(async ({ page, baseURL }) => {
  await page.route('**/*', async (route) => {
    if (new URL(route.request().url()).origin !== new URL(baseURL!).origin) return route.abort();
    if (new URL(route.request().url()).pathname.startsWith('/api/analytics/')) return route.fulfill({ status: 204 });
    return route.continue();
  });
});

test('month-end age and reversed date differences render nonnegative components', async ({ page }) => {
  await page.goto('/tools/age-calculator/');
  await expect(page.locator('astro-island[component-url*="UtilityCalculator"]')).not.toHaveAttribute('ssr', '');
  await page.getByLabel('Birth date', { exact: true }).fill('2026-01-31');
  await page.getByLabel('Age on date', { exact: true }).fill('2026-03-01');
  await page.getByRole('button', { name: 'Calculate age', exact: true }).click();
  await expect(page.locator('.utility-result-card')).toContainText('0 years, 1 months, 1 days');
  await page.goto('/tools/date-calculator/');
  await expect(page.locator('astro-island[component-url*="UtilityCalculator"]')).not.toHaveAttribute('ssr', '');
  await page.getByLabel('Start date', { exact: true }).fill('2026-03-01');
  await page.getByLabel('End date', { exact: true }).fill('2026-01-31');
  await page.getByRole('button', { name: 'Calculate date', exact: true }).click();
  await expect(page.locator('.utility-result-card')).toContainText('29 days');
  await expect(page.locator('.utility-result-card')).toContainText('0y 1m 1d');
});

test('tiny positive loan interest converges to the zero-rate payment in the UI', async ({ page }) => {
  await page.goto('/tools/loan-calculator/');
  await expect(page.locator('astro-island[component-url*="FinanceCalculator"]')).not.toHaveAttribute('ssr', '');
  await page.getByLabel('Loan amount ($)', { exact: true }).fill('100000');
  await page.getByLabel('Interest rate (%)', { exact: true }).fill('0.000000000001');
  await page.getByLabel('Loan term (years)', { exact: true }).fill('30');
  await page.getByRole('button', { name: 'Calculate loan', exact: true }).click();
  await expect(page.locator('.advanced-result-card')).toContainText('277.78');
  await expect(page.locator('.advanced-result-card')).not.toContainText('-6,175');
});

test('R1 three-payment tiny-rate loan renders a finite payment and nonnegative interest', async ({ page }, testInfo) => {
  await page.goto('/tools/loan-calculator/');
  await expect(page.locator('astro-island[component-url*="FinanceCalculator"]')).not.toHaveAttribute('ssr', '');
  await page.getByLabel('Loan amount ($)', { exact: true }).fill('100000');
  await page.getByLabel('Interest rate (%)', { exact: true }).fill('1e-16');
  await page.getByLabel('Loan term (years)', { exact: true }).fill('0.25');
  await page.getByRole('button', { name: 'Calculate loan', exact: true }).click();
  const result = page.locator('.finance-result-card');
  await expect(result.locator(':scope > strong')).toHaveText('$33,333.33');
  await expect(result.locator('dl > div').filter({ has: page.getByText('Total interest', { exact: true }) }).locator('dd')).toHaveText('$0.00');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await retainScreenshot(result, testInfo, 'tiny-three-payment-loan');
});

for (const fixture of [
  { slug: 'interest-rate-calculator', principalLabel: 'Principal ($)', buttonLabel: 'Estimate rate', loanMode: false },
  { slug: 'loan-calculator', principalLabel: 'Loan amount ($)', buttonLabel: 'Calculate loan', loanMode: true },
]) {
  test(`J2 ${fixture.slug} inverse rate accepts tiny and 19200 edges, rejects out-of-range payments, and recovers`, async ({ page }, testInfo) => {
    await page.goto(`/tools/${fixture.slug}/`);
    await expect(page.locator('astro-island[component-url*="FinanceCalculator"]')).not.toHaveAttribute('ssr', '');
    if (fixture.loanMode) {
      // The mode's symbol and label are both part of its accessible name.
      const mode = page.getByRole('button', { name: /^RATE\s*Rate$/ });
      await mode.click();
      await expect(mode).toHaveAttribute('aria-pressed', 'true');
    }
    const result = page.locator('.finance-result-card');
    const answer = result.locator(':scope > strong');
    const calculate = page.getByRole('button', { name: fixture.buttonLabel, exact: true });
    const copy = page.getByRole('button', { name: 'Copy answer', exact: true });
    const payment = page.getByLabel('Monthly payment ($)', { exact: true });
    const term = page.getByLabel('Loan term (years)', { exact: true });
    await page.getByLabel(fixture.principalLabel, { exact: true }).fill('100000');
    // The supported tiny-rate floor is the unrounded three-payment value, not the cents-only UI display.
    await payment.fill(String(100000 / 3));
    await term.fill('0.25');
    await calculate.click();
    await expect(result.locator(':scope > span')).toHaveText('Estimated annual rate');
    await expect(answer).toHaveText('0%');
    await expect(page.getByRole('alert')).toHaveCount(0);
    await expect(copy).toBeEnabled();
    await retainScreenshot(result, testInfo, 'inverse-tiny-three-payment');

    await payment.fill('30000');
    await calculate.click();
    await expect(page.getByRole('alert')).toHaveText('Monthly payment is too low to repay the principal within this term');
    await expect(copy).toBeDisabled();

    // At 1600% monthly over 360 payments, the supported annual edge has a $1.6M payment.
    await term.fill('30');
    await payment.fill('1600000');
    await calculate.click();
    await expect(answer).toHaveText('19200%');
    await expect(result.locator('dl > div').filter({ has: page.getByText('Monthly rate', { exact: true }) }).locator('dd')).toHaveText('1600%');
    await expect(page.getByRole('alert')).toHaveCount(0);
    await expect(copy).toBeEnabled();
    await retainScreenshot(result, testInfo, 'inverse-supported-19200');

    await payment.fill('1600001');
    await calculate.click();
    await expect(page.getByRole('alert')).toHaveText(rateRangeError);
    await expect(copy).toBeDisabled();
    // FinanceCalculator retains the previous result on error; assert the alert, not disappearance.
    await retainScreenshot(page.getByRole('alert'), testInfo, 'inverse-above-bound-error');

    // Independent one-payment check: $500 interest on $100k is 0.5% monthly, or 6% nominal annually.
    await term.fill(String(1 / 12));
    await payment.fill('100500');
    await calculate.click();
    await expect(answer).toHaveText('6%');
    await expect(result.locator('dl > div').filter({ has: page.getByText('Monthly rate', { exact: true }) }).locator('dd')).toHaveText('0.5%');
    await expect(page.getByRole('alert')).toHaveCount(0);
    await expect(copy).toBeEnabled();
    await retainScreenshot(result, testInfo, 'inverse-successful-recalculation');
  });
}

test('J2 APR accepts the tiny three-payment reproduction and 19200 edge, rejects note/fee crossings, and recovers', async ({ page }, testInfo) => {
  await page.goto('/tools/apr-calculator/');
  await expect(page.locator('astro-island[component-url*="FinanceCalculator"]')).not.toHaveAttribute('ssr', '');
  const result = page.locator('.finance-result-card');
  const answer = result.locator(':scope > strong');
  const rate = page.getByLabel('Note rate (%)', { exact: true });
  const term = page.getByLabel('Term (years)', { exact: true });
  const fees = page.getByLabel('Finance charges / fees ($)', { exact: true });
  const calculate = page.getByRole('button', { name: 'Estimate APR', exact: true });
  const copy = page.getByRole('button', { name: 'Copy answer', exact: true });
  await page.getByLabel('Loan amount ($)', { exact: true }).fill('100000');
  await rate.fill('1e-16');
  await term.fill('0.25');
  await fees.fill('0');
  await calculate.click();
  await expect(result.locator(':scope > span')).toHaveText('Estimated APR');
  await expect(answer).toHaveText('0%');
  await expect(result.locator('dl > div').filter({ has: page.getByText('Monthly payment', { exact: true }) }).locator('dd')).toHaveText('$33,333.33');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(copy).toBeEnabled();
  await retainScreenshot(result, testInfo, 'apr-tiny-three-payment');

  await term.fill('30');
  await rate.fill('19200');
  await calculate.click();
  await expect(answer).toHaveText('19200%');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(copy).toBeEnabled();
  await retainScreenshot(result, testInfo, 'apr-supported-19200');

  for (const crossing of [
    { rate: '19200.01', fees: '0', name: 'apr-note-above-bound' },
    { rate: '19000', fees: '1100', name: 'apr-fees-above-bound' },
  ]) {
    await rate.fill(crossing.rate);
    await fees.fill(crossing.fees);
    await calculate.click();
    await expect(page.getByRole('alert')).toHaveText(rateRangeError);
    await expect(copy).toBeDisabled();
    await retainScreenshot(page.getByRole('alert'), testInfo, crossing.name);
  }

  await rate.fill('6');
  await term.fill(String(1 / 12));
  await fees.fill('0');
  await calculate.click();
  await expect(answer).toHaveText('6%');
  await expect(result.locator('dl > div').filter({ has: page.getByText('Fees included', { exact: true }) }).locator('dd')).toHaveText('$0.00');
  await expect(result.locator('dl > div').filter({ has: page.getByText('Monthly payment', { exact: true }) }).locator('dd')).toHaveText('$100,500.00');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(copy).toBeEnabled();
  await retainScreenshot(result, testInfo, 'apr-successful-recalculation');
});
