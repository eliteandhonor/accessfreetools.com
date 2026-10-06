import { expect, test } from '@playwright/test';

test('category survives a real tool visit, Back, and Forward', async ({ page }) => {
  await page.goto('/tools/');
  const category = page.getByRole('combobox', { name: 'Tool category' });
  await category.selectOption('finance');
  await expect(page).toHaveURL(/category=finance/);
  await expect(page.getByRole('heading', { name: 'Finance', exact: true })).toBeVisible();
  await page.locator('a.launchpad-tool-card[href="/tools/mortgage-calculator/"]').click();
  await expect(page.getByRole('heading', { name: 'Mortgage Calculator', exact: true })).toBeVisible();
  await page.goBack();
  await expect(category).toHaveValue('finance');
  await expect(page.getByRole('heading', { name: 'Finance', exact: true })).toBeVisible();
  const slugs = await page.locator('a.launchpad-tool-card').evaluateAll(links => links.map(link => link.getAttribute('href')));
  expect(slugs).not.toContain('/tools/basic-calculator/');
  expect(slugs).toContain('/tools/mortgage-calculator/');
  await page.goForward();
  await expect(page).toHaveURL(/\/tools\/mortgage-calculator\/$/);
});

test('task words find the audited tools and empty search can recover', async ({ page }) => {
  await page.goto('/tools/');
  const search = page.getByRole('searchbox', { name: 'Search tools' });
  for (const [query, slug] of [
    ['percentage discount', 'percentage-calculator'],
    ['fraction compare', 'fraction-calculator'],
    ['mortgage monthly payment', 'mortgage-calculator'],
    ['convert pounds to kg', 'conversion-calculator'],
    ['wallpaper rolls', 'wallpaper-calculator'],
  ]) {
    await search.fill(query);
    await expect(page.locator(`a.launchpad-tool-card[href="/tools/${slug}/"]`)).toBeVisible();
    await expect(page.locator('a.launchpad-tool-card').first()).toHaveAttribute('href', `/tools/${slug}/`);
  }
  await search.fill('noexistingtoolzzzz');
  await expect(page.getByRole('heading', { name: /No matching tools/i })).toBeVisible();
  await page.getByRole('button', { name: 'Clear search', exact: true }).click();
  await expect(search).toHaveValue('');
  await expect(page.locator('a.launchpad-tool-card')).toHaveCount(12);
  await expect(page).not.toHaveURL(/q=/);
});

test('keyboard reveal count survives a tool visit and browser history', async ({ page }) => {
  await page.goto('/tools/');
  await expect(page.locator('a.launchpad-tool-card')).toHaveCount(12);
  const reveal = page.getByRole('button', { name: 'Show 12 more tools', exact: true });
  await reveal.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('a.launchpad-tool-card')).toHaveCount(24);
  await expect(page.locator('a.launchpad-tool-card').nth(12)).toBeFocused();
  await expect(page).toHaveURL(/limit=24/);
  const destination = await page.locator('a.launchpad-tool-card').nth(12).getAttribute('href');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(new RegExp(`${destination}$`));
  await page.goBack();
  await expect(page.locator('a.launchpad-tool-card')).toHaveCount(24);
  await page.getByRole('button', { name: 'Clear search and category', exact: true }).click();
  await expect(page.locator('a.launchpad-tool-card')).toHaveCount(12);
  await page.goBack();
  await expect(page.locator('a.launchpad-tool-card')).toHaveCount(24);
});

test('mobile navigation repeatedly opens, dismisses, and restores keyboard focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: /Menu/ });
  const panel = page.locator('[data-navigation-panel]');
  for (const key of ['Enter', 'Space']) {
    await menu.focus();
    await page.keyboard.press(key);
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await page.getByText('Browse', { exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('link', { name: 'Finance tools', exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeFocused();
    await expect(panel).toBeHidden();
  }
  await menu.click();
  // Click exposed page space outside the open disclosure, rather than a field it covers.
  await page.mouse.click(4, 500);
  await expect(panel).toBeHidden();
  await page.getByRole('searchbox', { name: 'Search free tools' }).click();
  await expect(page.getByRole('searchbox', { name: 'Search free tools' })).toBeFocused();
  await menu.click();
  await panel.getByRole('link', { name: 'Tools', exact: true }).click();
  await expect(page).toHaveURL(/\/tools\/$/);
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
});
