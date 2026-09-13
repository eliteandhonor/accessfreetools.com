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

test.beforeEach(async ({ page, baseURL }) => {
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== new URL(baseURL!).origin) return route.abort();
    if (url.pathname.startsWith('/api/analytics/')) return route.fulfill({ status: 204 });
    return route.continue();
  });
});

const calendarSteps = [
  'Find the largest whole-month offset that does not pass the later date.',
  "Apply the offset once from the earlier date. If its day is missing in the target month, use that month's last day.",
  'Split the offset into years and months (years * 12 + months), then count the remaining days.',
];

for (const fixture of [
  { earlier: '2024-02-29', later: '2025-03-28', years: 1, months: 0, days: 28, totalDays: 393 },
  { earlier: '2026-01-29', later: '2026-03-01', years: 0, months: 1, days: 1, totalDays: 31 },
  { earlier: '2026-01-30', later: '2026-03-01', years: 0, months: 1, days: 1, totalDays: 30 },
  { earlier: '2026-01-31', later: '2026-03-01', years: 0, months: 1, days: 1, totalDays: 29 },
]) {
  test(`J4 ${fixture.earlier} to ${fixture.later} uses the explained single calendar shift`, async ({ page }, testInfo) => {
    const { earlier, later, years, months, days, totalDays } = fixture;
    await page.goto('/tools/age-calculator/');
    await expect(page.locator('astro-island[component-url*="UtilityCalculator"]')).not.toHaveAttribute('ssr', '');
    await page.getByLabel('Birth date', { exact: true }).fill(earlier);
    await page.getByLabel('Age on date', { exact: true }).fill(later);
    await page.getByRole('button', { name: 'Calculate age', exact: true }).click();
    const result = page.locator('.utility-result-card');
    const steps = page.locator('.advanced-steps');
    await expect(result.locator(':scope > strong')).toHaveText(`${years} years, ${months} months, ${days} days`);
    await expect(result.locator('dl > div').filter({ has: page.getByText('Total days', { exact: true }) }).locator('dd')).toHaveText(String(totalDays));
    for (const step of calendarSteps) await expect(steps).toContainText(step);
    await expect(steps).toContainText('Count total elapsed days separately using UTC dates.');
    await expect(steps).not.toContainText('Subtract full years first');
    await retainScreenshot(result, testInfo, 'age-result');
    await retainScreenshot(steps, testInfo, 'age-calendar-steps');

    await page.goto('/tools/date-calculator/');
    await expect(page.locator('astro-island[component-url*="UtilityCalculator"]')).not.toHaveAttribute('ssr', '');
    for (const reversed of [false, true]) {
      await page.getByLabel('Start date', { exact: true }).fill(reversed ? later : earlier);
      await page.getByLabel('End date', { exact: true }).fill(reversed ? earlier : later);
      await page.getByRole('button', { name: 'Calculate date', exact: true }).click();
      await expect(result.locator(':scope > strong')).toHaveText(`${totalDays} days`);
      await expect(result).toContainText(`${years}y ${months}m ${days}d`);
      await expect(result.locator('dl > div').filter({ has: page.getByText('Direction', { exact: true }) }).locator('dd')).toHaveText(reversed ? 'backward' : 'forward');
      await expect(steps).toContainText('Measure from the earlier date to the later date. Reversed inputs keep the same nonnegative difference.');
      for (const step of calendarSteps) await expect(steps).toContainText(step);
      await expect(steps).toContainText('Count total elapsed days separately using UTC dates.');
    }
    await retainScreenshot(result, testInfo, 'reversed-date-result');
    await retainScreenshot(steps, testInfo, 'reversed-date-calendar-steps');

    await page.getByRole('button', { name: /Add or subtract/ }).click();
    await page.getByLabel('Start date', { exact: true }).fill(earlier);
    await page.getByRole('combobox', { name: 'Direction', exact: true }).selectOption('add');
    for (const [label, value] of [['Years', years], ['Months', months], ['Weeks', 0], ['Days', days]] as const) {
      await page.getByLabel(label, { exact: true }).fill(String(value));
    }
    await page.getByRole('button', { name: 'Calculate date', exact: true }).click();
    await expect(result.locator('dl > div').filter({ has: page.getByText('Result date', { exact: true }) }).locator('dd')).toHaveText(later);
    await expect(steps).toContainText('Combine years * 12 + months into one offset.');
    await retainScreenshot(result, testInfo, 'reconstructed-date-result');
  });
}
