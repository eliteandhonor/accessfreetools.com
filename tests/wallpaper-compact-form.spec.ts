import { expect, test } from '@playwright/test';

const fieldLabels = [
  'Room length feet', 'Room width feet', 'Wall height feet', 'Doors',
  'Windows', 'Roll coverage ft2', 'Waste percent', 'Price per roll (optional)',
];

for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }, { width: 320, height: 800 }]) {
  test(`wallpaper keeps all fields and help readable at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.route('https://news.google.com/swg/js/v1/publisher.js', route => route.fulfill({
      status: 200, contentType: 'application/javascript', body: '',
    }));
    await page.goto('/tools/wallpaper-calculator/');
    await page.waitForFunction(() => !document.querySelector('.utility-wallpaper')?.closest('astro-island')?.hasAttribute('ssr'));
    const fields = page.locator('.utility-wallpaper .utility-fields > label');
    await expect(fields).toHaveCount(8);
    for (const [index, label] of fieldLabels.entries()) {
      const field = fields.nth(index);
      await expect(field.locator('span')).toHaveText(label);
      await expect(field.locator('input')).toBeVisible();
      await expect(field.locator('small')).toBeVisible();
      const geometry = await field.evaluate(element => {
        const input = element.querySelector('input')!;
        const help = element.querySelector('small')!;
        return { inputHeight: input.getBoundingClientRect().height, inputWidth: input.getBoundingClientRect().width,
          helpSize: Number.parseFloat(getComputedStyle(help).fontSize), labelWidth: element.getBoundingClientRect().width };
      });
      expect(geometry.inputHeight).toBeGreaterThanOrEqual(44);
      expect(geometry.inputWidth).toBeGreaterThanOrEqual(100);
      expect(geometry.helpSize).toBeGreaterThanOrEqual(12);
    }
    await expect(fields.nth(3).locator('small')).toContainText('fixed 20 square feet');
    await expect(fields.nth(4).locator('small')).toContainText('fixed 15 square feet');
    await expect(fields.nth(5).locator('small')).toContainText('repeat or trimming losses');
    await expect(fields.nth(6).locator('small')).toContainText('Do not add losses');
    await expect(fields.nth(7).locator('small')).toContainText('tax, shipping, paste, tools, and labor');
    await expect(page.locator('#tool-workspace .workspace-limit-note')).toBeVisible();
    const geometry = await fields.evaluateAll(elements => elements.map(element => ({
      x: element.getBoundingClientRect().x, y: element.getBoundingClientRect().y,
    })));
    if (viewport.width === 390) {
      expect(Math.abs(geometry[0].y - geometry[1].y)).toBeLessThan(1);
      expect(geometry[1].x).toBeGreaterThan(geometry[0].x);
      expect(Math.abs(geometry[3].y - geometry[4].y)).toBeLessThan(1);
      expect(geometry[4].x).toBeGreaterThan(geometry[3].x);
    }
    if (viewport.width === 320) {
      for (let index = 1; index < geometry.length; index++) {
        expect(geometry[index].y).toBeGreaterThan(geometry[index - 1].y);
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)).toBe(false);
  });
}

test('wallpaper recalculates all eight fields and accepts zero waste and an omitted price', async ({ page }) => {
  await page.route('https://news.google.com/swg/js/v1/publisher.js', route => route.fulfill({
    status: 200, contentType: 'application/javascript', body: '',
  }));
  await page.goto('/tools/wallpaper-calculator/');
  await page.waitForFunction(() => !document.querySelector('.utility-wallpaper')?.closest('astro-island')?.hasAttribute('ssr'));
  const inputs = page.locator('.utility-wallpaper .utility-fields input');
  const result = page.locator('.utility-wallpaper .utility-result-card');
  const copy = page.getByRole('button', { name: 'Copy answer', exact: true });
  const values = ['14', '11', '9', '0', '0', '64', '0', ''];
  for (const [index, value] of values.entries()) {
    await inputs.nth(index).fill(value);
    await expect(result).toHaveCount(0);
    await expect(copy).toBeDisabled();
    await page.getByRole('button', { name: 'Estimate wallpaper', exact: true }).click();
    await expect(result).toHaveCount(1);
    await expect(copy).toBeEnabled();
    await expect(page.getByRole('alert')).toHaveCount(0);
  }
  await expect(result.locator('strong')).toHaveText('8 rolls');
  await expect(result.locator('dl > div').filter({ has: page.getByText('Wallpaper area', { exact: true }) })).toContainText('450 ft2');
  await expect(result.locator('dl > div').filter({ has: page.getByText('Area with waste', { exact: true }) })).toContainText('450 ft2');
  await expect(result.locator('dl > div').filter({ has: page.getByText('Estimated cost', { exact: true }) })).toContainText('Add price per roll');
  await expect(page.locator('.utility-wallpaper .advanced-side-panel ol li')).toHaveCount(4);
});
