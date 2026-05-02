import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const smokePages = [
  '/',
  '/tools/',
  '/blog/',
  '/categories/calculators/',
  '/categories/ai-tools/',
  '/free-calculator-resources/',
  '/contact/',
  '/privacy-policy/',
  '/terms/',
  '/advertising-disclosure/',
  '/tools/mortgage-calculator/',
  '/tools/bmi-calculator/',
  '/tools/image-to-text-ocr-tool/',
  '/tools/watts-to-amps-calculator/',
];

const accessibilityPages = [
  '/',
  '/tools/',
  '/blog/',
  '/free-calculator-resources/',
  '/contact/',
  '/tools/watts-to-amps-calculator/',
  '/tools/image-to-text-ocr-tool/',
];

test.describe('site smoke coverage', () => {
  for (const path of smokePages) {
    test(`${path} renders with one main heading and no layout overflow`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text());
        }
      });

      await page.goto(path);
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('footer')).toBeVisible();

      const title = await page.title();
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThanOrEqual(70);

      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      expect(hasHorizontalOverflow).toBe(false);

      await page.keyboard.press('Tab');
      const activeElementTag = await page.evaluate(() => document.activeElement?.tagName.toLowerCase() ?? '');
      expect(activeElementTag.length).toBeGreaterThan(0);
      expect(consoleErrors).toEqual([]);
    });
  }

  test('tools launchpad loads the full search index only after search intent', async ({ page }) => {
    const searchIndexRequests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/tool-search-index.json')) {
        searchIndexRequests.push(request.url());
      }
    });

    await page.goto('/tools/');
    await expect(page.getByRole('heading', { name: 'Available Tools' })).toBeVisible();
    expect(searchIndexRequests).toHaveLength(0);

    await page.getByLabel('Search tools').fill('watts to amps');
    await expect(page.locator('a[href="/tools/watts-to-amps-calculator/"]')).toBeVisible();
    expect(searchIndexRequests.length).toBeGreaterThan(0);
  });

  test('AI tool page does not request model files before the user runs the tool', async ({ page }) => {
    const modelRequests: string[] = [];
    page.on('request', (request) => {
      if (/\/ai-models\/|model_quantized\.onnx|traineddata\.gz|tesseract-core/i.test(request.url())) {
        modelRequests.push(request.url());
      }
    });

    await page.goto('/tools/image-to-text-ocr-tool/');
    await page.waitForLoadState('networkidle');
    expect(modelRequests).toEqual([]);
  });
});

test.describe('accessibility smoke coverage', () => {
  for (const path of accessibilityPages) {
    test(`${path} has no serious automated accessibility violations`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).include('main').analyze();
      const seriousViolations = results.violations.filter((violation) =>
        violation.impact === 'serious' || violation.impact === 'critical',
      );

      expect(seriousViolations).toEqual([]);
    });
  }
});
