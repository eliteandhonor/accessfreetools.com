import { expect, test } from '@playwright/test';

const journeys = [
  { slug: 'conversion-calculator', input: /^Value(?:\s|$)/, action: 'Convert value', invalid: '', repaired: '72', expected: '182.88' },
  { slug: 'currency-calculator', input: /^Amount(?:\s|$)/, action: 'Convert currency', invalid: '', repaired: '100', expected: '125' },
  { slug: 'bmi-calculator', input: /^Height\s*\(cm\)/, action: 'Calculate BMI', invalid: '0', repaired: '170', expected: '24.221' },
  { slug: 'wallpaper-calculator', input: /^Room length feet/, action: 'Estimate wallpaper', invalid: '0', repaired: '12', expected: '6 rolls' },
];

for (const journey of journeys) {
  test(`${journey.slug} requires a current valid answer after input edits`, async ({ page }) => {
    const response = await page.goto(`/tools/${journey.slug}/`);
    expect(response?.status()).toBe(200);
    const workspace = page.locator('#tool-workspace');
    await page.waitForFunction(() => !document.querySelector('#tool-workspace astro-island')?.hasAttribute('ssr'));
    const result = workspace.locator('.advanced-result-card');
    const steps = workspace.locator('.advanced-steps');
    const input = workspace.getByLabel(journey.input).first();
    const calculate = workspace.getByRole('button', { name: journey.action, exact: true });
    const copy = workspace.getByRole('button', { name: 'Copy answer', exact: true });
    await expect(result).toHaveCount(1);
    await expect(copy).toBeEnabled();

    if (journey.slug === 'conversion-calculator') {
      await workspace.getByRole('combobox', { name: 'From', exact: true }).selectOption('inch');
      await workspace.getByRole('combobox', { name: 'To', exact: true }).selectOption('centimeter');
    }
    await input.fill(journey.repaired);
    await calculate.click();
    await expect(result).toContainText(journey.expected);
    await expect(copy).toBeEnabled();

    await input.fill(journey.slug === 'currency-calculator' ? '200' : '18');
    await expect(result).toHaveCount(0);
    await expect(steps).toHaveCount(0);
    await expect(copy).toBeDisabled();
    await expect(workspace.getByRole('status')).toContainText(/Inputs changed/);

    await input.fill(journey.invalid);
    await calculate.click();
    await expect(workspace.locator('.calculator-error')).toBeVisible();
    await expect(result).toHaveCount(0);
    await expect(copy).toBeDisabled();

    await input.fill(journey.repaired);
    await input.press('Enter');
    await expect(workspace.locator('.calculator-error')).toHaveCount(0);
    await expect(result).toContainText(journey.expected);
    await expect(copy).toBeEnabled();

    await input.fill('99');
    await expect(copy).toBeDisabled();
    await workspace.locator('.advanced-side-panel .advanced-quick-grid button').first().click();
    await expect(result).toHaveCount(1);
    await expect(copy).toBeEnabled();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)).toBe(false);
  });
}
