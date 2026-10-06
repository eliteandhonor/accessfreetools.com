import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const smokePages = [
  '/',
  '/tools/',
  '/blog/',
  '/categories/calculators/',
  '/categories/finance/',
  '/categories/health-fitness/',
  '/categories/home-projects/',
  '/categories/developer-tools/',
  '/categories/converters/',
  '/categories/ai-tools/',
  '/free-calculator-resources/',
  '/why-access-free-tools/',
  '/about/',
  '/contact/',
  '/privacy-policy/',
  '/terms/',
  '/advertising-disclosure/',
  '/admin/',
  '/admin/agent-tools/',
  '/tools/mortgage-calculator/',
  '/tools/income-tax-calculator/',
  '/tools/bmi-calculator/',
  '/tools/due-date-calculator/',
  '/tools/concrete-calculator/',
  '/tools/ad-revenue-calculator/',
  '/tools/password-generator/',
  '/tools/subnet-calculator/',
  '/tools/image-to-text-ocr-tool/',
  '/tools/four-in-a-row-game/',
  '/tools/watts-to-amps-calculator/',
  '/blog/how-to-use-mortgage-calculator/',
  '/blog/how-to-use-image-to-text-ocr-tool/',
  '/blog/how-to-use-four-in-a-row-game/',
];

const accessibilityPages = [
  '/',
  '/tools/',
  '/blog/',
  '/free-calculator-resources/',
  '/contact/',
  '/privacy-policy/',
  '/terms/',
  '/admin/',
  '/admin/agent-tools/',
  '/ask/',
  '/blog/free-ai-skills-open-source-tools-organic-growth/',
  '/tools/percentage-calculator/',
  '/tools/watts-to-amps-calculator/',
  '/tools/image-to-text-ocr-tool/',
  '/tools/four-in-a-row-game/',
];

function screenshotPath(projectName: string, path: string) {
  const directory = process.env.DEEP_AUDIT_SCREENSHOT_DIR;

  if (!directory) {
    return '';
  }

  const safePath = path === '/' ? 'home' : path.replace(/^\/|\/$/g, '').replace(/[^a-z0-9]+/gi, '-');
  mkdirSync(directory, { recursive: true });
  return join(directory, `${projectName}-${safePath || 'page'}.png`);
}

test.beforeEach(async ({ page }) => {
  // This suite verifies local pages. The external publisher integration is separate.
  await page.route('https://news.google.com/swg/js/v1/publisher.js', route => route.fulfill({
    status: 200, contentType: 'application/javascript', body: '',
  }));
});

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

      const outputScreenshot = screenshotPath(test.info().project.name, path);
      if (outputScreenshot) {
        await page.screenshot({ path: outputScreenshot, fullPage: true });
      }
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
    await expect(page.getByRole('heading', { name: 'Browse tools', exact: true })).toBeVisible();
    expect(searchIndexRequests).toHaveLength(0);

    await page.getByLabel('Search tools').fill('watts to amps');
    await expect(page.locator('a.launchpad-tool-card[href="/tools/watts-to-amps-calculator/"]')).toBeVisible();
    expect(searchIndexRequests.length).toBeGreaterThan(0);
  });

  test('resources shortcut redirects to the canonical resources hub', async ({ page }) => {
    await page.goto('/resources/');
    await expect(page).toHaveURL(/\/free-calculator-resources\/$/);
    await expect(page.getByRole('heading', { name: 'Free Calculator Resources' })).toBeVisible();
  });

  test('legacy ranking shortcuts resolve to canonical hubs', async ({ page }) => {
    await page.goto('/calculators/');
    await expect(page).toHaveURL(/\/categories\/calculators\/$/);
    await expect(page.getByRole('heading', { name: 'Free online calculators' })).toBeVisible();

    await page.goto('/deep-research/');
    await expect(page).toHaveURL(/\/categories\/ai-tools\/$/);
    await expect(page.getByRole('heading', { name: 'AI Tools', exact: true })).toBeVisible();

    await page.goto('/advanced-age-calculator/');
    await expect(page).toHaveURL(/\/tools\/age-calculator\/$/);
    await expect(page.getByRole('heading', { name: 'Age Calculator', exact: true })).toBeVisible();

    await page.goto('/maximize-your-revenue-the-ultimate-free-google-adsense-earnings-calculator-for-2025/');
    await expect(page).toHaveURL(/\/tools\/ad-revenue-calculator\/$/);
    await expect(page.getByRole('heading', { name: 'Ad Revenue Calculator', exact: true })).toBeVisible();
  });

  test('visual SEO paths expose important internal links', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main a[href="/categories/calculators/"]')).toBeVisible();
    await expect(page.locator('main a[href="/free-calculator-resources/"]')).toBeVisible();

    await page.goto('/categories/calculators/');
    await page.getByText('Help choosing a tool and checking its results', { exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Find the right calculator faster' })).toBeVisible();
    await expect(page.locator('a[href="/tools/basic-calculator/"]').first()).toBeVisible();
    await expect(page.locator('a[href="/tools/mortgage-calculator/"]').first()).toBeVisible();
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

  test('private agent tools page stays noindexed and token gated', async ({ page }) => {
    await page.goto('/admin/agent-tools/');
    await expect(page.getByRole('heading', { name: 'Agent Tools' })).toBeVisible();
    await expect(page.getByLabel('Admin token')).toBeVisible();

    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robots).toContain('noindex');
    await expect(page.locator('[data-agent-dashboard]')).toHaveCount(3);
  });

  test('private admin hub clears legacy credentials and links to gated tools', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('access-free-tools-analytics-token', 'synthetic-expired-token');
      sessionStorage.setItem('access-free-tools-analytics-token', 'synthetic-expired-token');
      localStorage.setItem('access-free-tools-analytics-opt-out', 'true');
    });
    await page.goto('/admin/');
    await expect(page.getByRole('heading', { name: 'Private Admin', exact: true })).toBeVisible();
    await expect(page.getByLabel('Admin token')).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Open Analytics' })).toHaveAttribute('href', '/admin/analytics/');
    await expect(page.getByRole('link', { name: 'Open Agent Tools' })).toHaveAttribute('href', '/admin/agent-tools/');
    expect(await page.evaluate(() => ({
      localToken: localStorage.getItem('access-free-tools-analytics-token'),
      sessionToken: sessionStorage.getItem('access-free-tools-analytics-token'),
      optOut: localStorage.getItem('access-free-tools-analytics-opt-out'),
    }))).toEqual({ localToken: null, sessionToken: null, optOut: 'true' });

    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robots).toContain('noindex');
    for (const [path, label] of [
      ['/admin/analytics/', 'Analytics token'],
      ['/admin/agent-tools/', 'Admin token'],
    ]) {
      await page.goto(path);
      await expect(page.getByLabel(label, { exact: true })).toBeVisible();
      await expect(page.getByLabel(label, { exact: true })).toHaveValue('');
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    }
  });
});

test.describe('accessibility smoke coverage', () => {
  for (const path of accessibilityPages) {
    test(`${path} has no serious or landmark automated accessibility violations`, async ({ page }) => {
      await page.goto(path);
      let axe = new AxeBuilder({ page }).include('main');
      if (path === '/blog/free-ai-skills-open-source-tools-organic-growth/') {
        axe = axe.exclude('iframe[src*="youtube"]');
      }
      const results = await axe.analyze();
      const blockingViolations = results.violations.filter(
        (violation) =>
          violation.impact === 'serious' ||
          violation.impact === 'critical' ||
          (violation.impact === 'moderate' && violation.id.startsWith('landmark')),
      );

      expect(blockingViolations).toEqual([]);
    });
  }
});
