import { expect, test } from '@playwright/test';
import { categories } from '../src/data/categories';

const originalExampleSlugs = [
  'basic-calculator', 'percentage-calculator', 'ratio-calculator',
  'conversion-calculator', 'roman-numeral-converter', 'shoe-size-conversion',
  'word-counter', 'character-counter', 'text-case-converter',
  'age-calculator', 'date-calculator', 'time-calculator',
  'mortgage-calculator', 'loan-calculator', 'auto-loan-calculator',
  'bmi-calculator', 'underweight-bmi-calculator', 'overweight-calculator',
  'concrete-calculator', 'roofing-calculator', 'tile-calculator',
  'subnet-calculator', 'password-generator', 'base64-encode-decode',
  'color-contrast-checker', 'aspect-ratio-calculator', 'monitor-ppi-calculator',
  'ai-token-cost-calculator', 'prompt-token-estimator', 'image-to-text-ocr-tool',
  'gpa-calculator', 'grade-calculator', 'molarity-calculator',
  'random-number-generator', 'dice-roller', 'four-in-a-row-game',
];

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    try {
      localStorage.setItem('access-free-tools-analytics-opt-out', 'true');
      localStorage.setItem('access-free-tools-owner-ads-disabled', 'true');
    } catch {}
  });
});

for (const viewport of [{ width: 390, height: 844 }, { width: 320, height: 568 }, { width: 1440, height: 900 }]) {
  test(`category search and twelve compact choices work at ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/categories/');
    const input = page.getByRole('searchbox', { name: 'Search free tools' });
    const button = page.getByRole('button', { name: 'Search', exact: true });
    for (const control of [input, button]) {
      await expect(control).toBeVisible();
      const box = await control.boundingBox();
      expect(box!.y + box!.height).toBeLessThan(viewport.height);
    }
    const navigation = page.getByRole('navigation', { name: 'Choose a tool category' });
    const choices = navigation.locator('a');
    await expect(choices).toHaveCount(12);
    for (const category of categories) {
      await expect(navigation.locator(`a[href="/categories/${category.slug}/"]`)).toBeVisible();
    }
    if (viewport.width !== 320) {
      const lastChoice = await choices.last().boundingBox();
      expect(lastChoice!.y + lastChoice!.height).toBeLessThan(viewport.height);
    }
    const inventory = page.locator('details.category-index-inventory');
    await expect(inventory).not.toHaveAttribute('open', '');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await input.fill('percentage discount');
    await button.click();
    await expect(page).toHaveURL(/\/tools\/\?q=percentage\+discount/);
    await expect(page.locator('.launchpad-tool-card').first()).toHaveAttribute('href', '/tools/percentage-calculator/');
  });
}

test('all original example and contextual routes survive; collection schema stays canonical', async ({ page }) => {
  await page.goto('/categories/');
  const inventory = page.locator('details.category-index-inventory');
  await expect(inventory.locator('article')).toHaveCount(12);
  for (const slug of originalExampleSlugs) {
    await expect(inventory.locator(`a[href="/tools/${slug}/"]`)).not.toHaveCount(0);
  }
  for (const href of ['/free-calculator-resources/', '/tools/watts-to-amps-calculator/', '/blog/how-to-use-watts-to-amps-calculator/', '/tools/wallpaper-calculator/', '/blog/how-to-use-wallpaper-calculator/']) {
    await expect(page.locator(`main a[href="${href}"]`)).toBeVisible();
  }
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://accessfreetools.com/categories/');
  const collection = await page.locator('script[type="application/ld+json"]').evaluateAll(scripts => scripts
    .map(script => JSON.parse(script.textContent || '{}')).find(data => data['@type'] === 'CollectionPage'));
  expect(collection.url).toBe('https://accessfreetools.com/categories/');
  expect(collection.mainEntity.numberOfItems).toBe(12);
  expect(collection.mainEntity.itemListElement.map((item: { url: string }) => new URL(item.url).pathname))
    .toEqual(categories.map(category => `/categories/${category.slug}/`));
});

test('Image counts and example links include OCR and classifier while retaining their AI routes', async ({ page }) => {
  await page.goto('/categories/');
  const imageChoice = page.locator('.category-index-choices [data-category-slug="image-tools"]');
  await expect(imageChoice.locator('.category-index-count')).toHaveText('5 tools');
  const imageExamples = page.locator('.category-index-inventory article[data-category-slug="image-tools"]');
  await expect(imageExamples.locator('.category-index-example-count')).toHaveText('5 tools and 5 guides');
  for (const slug of ['image-to-text-ocr-tool', 'image-classifier']) {
    await expect(imageExamples.locator(`a[href="/tools/${slug}/"]`)).toHaveCount(1);
  }
  await imageChoice.click();
  await expect(page).toHaveURL(/\/categories\/image-tools\/$/);
  await expect(page.locator('.category-task-choices a')).toHaveCount(5);
  await expect(page.locator('.category-overview .category-stat-grid article').first().locator('span')).toHaveText('5');
  await page.goto('/tools/?category=image-tools');
  await expect(page.getByRole('combobox', { name: 'Tool category' })).toHaveValue('image-tools');
  await expect(page.locator('.launchpad-tool-card')).toHaveCount(5);
  for (const slug of ['image-to-text-ocr-tool', 'image-classifier']) {
    await expect(page.locator(`.launchpad-tool-card[href="/tools/${slug}/"]`)).toBeVisible();
  }
});

test('wallpaper teaser names real inputs and keeps pattern-repeat advice in the guide context', async ({ page }) => {
  await page.goto('/categories/');
  const toolTeaser = page.locator('.category-index-context-links a[href="/tools/wallpaper-calculator/"]');
  await expect(toolTeaser).toContainText('room size, doors, windows, usable roll coverage, and waste percent');
  await expect(toolTeaser).not.toContainText('pattern repeat');
  const guideTeaser = page.locator('.category-index-context-links a[href="/blog/how-to-use-wallpaper-calculator/"]');
  await expect(guideTeaser).toContainText('Allow for pattern repeat');
  await expect(guideTeaser).toContainText('supplier instructions and dye lots');
});

test('native details supports repeated keyboard and touch actions without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, hasTouch: true, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/categories/`);
    const inventory = page.locator('details.category-index-inventory');
    const summary = inventory.locator('summary');
    await summary.focus();
    await page.keyboard.press('Space');
    await expect(inventory).toHaveAttribute('open', '');
    await expect(summary).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(inventory.locator('article').first().locator('h3 a')).toBeFocused();
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(inventory).not.toHaveAttribute('open', '');
    for (let action = 0; action < 2; action += 1) {
      await summary.tap();
      await expect(inventory).toHaveAttribute('open', '');
      await summary.tap();
      await expect(inventory).not.toHaveAttribute('open', '');
    }
    const input = page.getByRole('searchbox', { name: 'Search free tools' });
    await input.fill('fraction compare');
    await page.getByRole('button', { name: 'Search', exact: true }).tap();
    await expect(page).toHaveURL(/\/tools\/\?q=fraction\+compare/);
  } finally { await context.close(); }
});
