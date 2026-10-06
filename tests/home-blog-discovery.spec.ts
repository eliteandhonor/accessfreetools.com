import { expect, test } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    try {
      localStorage.setItem('access-free-tools-analytics-opt-out', 'true');
      localStorage.setItem('access-free-tools-owner-ads-disabled', 'true');
    } catch {}
  });
});

for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  test(`homepage search and task choices are usable in the opening ${viewport.width} view`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const input = page.getByRole('searchbox', { name: 'Search free tools' });
    const button = page.getByRole('button', { name: 'Search', exact: true });
    await expect(input).toBeVisible();
    await expect(button).toBeVisible();
    for (const control of [input, button]) {
      const box = await control.boundingBox();
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.y + box!.height).toBeLessThan(viewport.height);
    }
    await expect(page.getByRole('navigation', { name: 'Choose a task' }).locator('a')).toHaveCount(6);
    await expect(page.getByRole('navigation', { name: 'Tool categories' }).locator('a')).toHaveCount(12);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await input.fill('percentage discount');
    await button.click();
    await expect(page).toHaveURL(/\/tools\/\?q=percentage\+discount/);
    await expect(page.locator('.launchpad-tool-card').first()).toHaveAttribute('href', '/tools/percentage-calculator/');
  });

  test(`blog search starts in view with all reviewed editorials and twelve cards at ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/blog/');
    const input = page.getByRole('searchbox', { name: 'Search guides', exact: true });
    await expect(input).toBeVisible();
    await page.waitForFunction(() => [...document.querySelectorAll('astro-island')]
      .filter(island => /BlogSearch/.test(island.getAttribute('component-url') ?? ''))
      .every(island => !island.hasAttribute('ssr')));
    const box = await input.boundingBox();
    expect(box!.y + box!.height).toBeLessThan(viewport.height);
    await expect(page.locator('.blog-post-card')).toHaveCount(12);
    await expect(page.locator('.blog-post-card .card-link').filter({ hasText: 'Read article' })).toHaveCount(7);
    await page.getByRole('button', { name: 'Show 12 more posts' }).click();
    await expect(page.locator('.blog-post-card')).toHaveCount(24);
    await page.getByRole('button', { name: 'Show 12 more posts' }).click();
    await expect(page.locator('.blog-post-card')).toHaveCount(36);
    await input.fill('browser local privacy');
    await expect(page.locator('.blog-post-card')).toHaveCount(1);
    await expect(page.locator('.blog-post-card h3 a')).toHaveAttribute('href', '/blog/browser-ai-vs-local-ai-privacy/');
    await page.goBack();
    await expect(input).toHaveValue('');
    await expect(page.locator('.blog-post-card')).toHaveCount(36);
    await page.goForward();
    await expect(input).toHaveValue('browser local privacy');
    await expect(page.locator('.blog-post-card')).toHaveCount(1);
    await input.fill('unfindable-example-task');
    await expect(page.getByRole('heading', { name: 'No matching guides' })).toBeVisible();
    await page.getByRole('button', { name: 'Reset search' }).click();
    await expect(input).toHaveValue('');
    await expect(page.locator('.blog-post-card')).toHaveCount(12);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

test('blog keyboard reveal focuses the first new post and its secondary read link', async ({ page }) => {
  await page.goto('/blog/');
  await page.waitForFunction(() => [...document.querySelectorAll('astro-island')]
    .filter(island => /BlogSearch/.test(island.getAttribute('component-url') ?? ''))
    .every(island => !island.hasAttribute('ssr')));
  await page.getByRole('button', { name: 'Show 12 more posts' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.blog-post-card')).toHaveCount(24);
  const firstNew = page.locator('.blog-post-card').nth(12);
  await expect(firstNew.locator('h3 a')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(firstNew.locator('.card-link')).toBeFocused();
});
