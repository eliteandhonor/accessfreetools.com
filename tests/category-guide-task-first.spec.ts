import { expect, test } from '@playwright/test';
import { getBlogGuideSlugForTool } from '../src/data/blogGuideCanonicals';
import { getToolsByCategory } from '../src/data/tools';

test('Image category offers the existing design, OCR and image classification tasks', async ({ page, request }) => {
  const response = await page.goto('/categories/image-tools/');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Free Image Tools');
  const choices = page.locator('.category-task-choices a');
  const slugs = [...getToolsByCategory('image-tools').map(tool => tool.slug), 'image-to-text-ocr-tool', 'image-classifier'];
  await expect(choices).toHaveCount(slugs.length);
  for (const slug of slugs) {
    const href = `/tools/${slug}/`;
    await expect(page.locator(`.category-task-choices a[href="${href}"]`)).toBeVisible();
    expect((await request.get(href)).status()).toBe(200);
  }
  await expect(page.locator('.task-first-category-intro')).toContainText('check their accuracy and download notes');
  await expect(page.locator('main')).not.toContainText('loose image dump');
});

test('Category tools and guides remain available through native keyboard disclosures', async ({ browser, baseURL }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: testInfo.project.use.viewport });
  const page = await context.newPage();
  try {
    await page.goto(`${baseURL}/categories/finance/`);
    const tools = getToolsByCategory('finance');
    await expect(page.locator('.category-task-choices a')).toHaveCount(6);
    await expect(page.locator('.category-task-directory a')).toHaveCount(tools.length);
    const directory = page.locator('.category-task-directory details');
    const lastTool = directory.locator(`a[href="/tools/${tools.at(-1)!.slug}/"]`);
    await expect(lastTool).toBeHidden();
    const summary = directory.locator('summary');
    await summary.focus();
    await summary.press('Enter');
    await expect(lastTool).toBeVisible();
    await summary.press('Enter');
    await expect(lastTool).toBeHidden();

    const guideBand = page.locator('.category-guide-band');
    const guideSlugs = [...new Set(tools.map(tool => getBlogGuideSlugForTool(tool.slug)))];
    for (const slug of guideSlugs) {
      await expect(guideBand.locator(`a[href="/blog/${slug}/"]`)).toHaveCount(1);
    }
    const moreGuides = guideBand.locator('details');
    const lastGuide = moreGuides.locator('a').last();
    await expect(lastGuide).toBeHidden();
    await moreGuides.locator('summary').focus();
    await moreGuides.locator('summary').press('Space');
    await expect(lastGuide).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)).toBe(false);
  } finally {
    await context.close();
  }
});

test('Category task search submits the category and task in the URL', async ({ page }) => {
  await page.goto('/categories/finance/');
  await page.getByRole('searchbox', { name: 'Search finance', exact: true }).fill('mortgage monthly payment');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page).toHaveURL(/\/tools\/?\?category=finance&q=mortgage\+monthly\+payment$/);
  await expect(page.locator('#tool-library-search')).toHaveValue('mortgage monthly payment');
  await expect(page.locator('#tool-category')).toHaveValue('finance');
});

test('Image search includes its OCR and classifier crosslinks and restores them on Back', async ({ page }) => {
  await page.goto('/categories/image-tools/');
  await page.getByRole('searchbox', { name: 'Search image tools', exact: true }).fill('OCR');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page.locator('#tool-category')).toHaveValue('image-tools');
  await expect(page.locator('#tool-category option:checked')).toHaveText('Image Tools (5)');
  const result = page.locator('a.launchpad-tool-card[href="/tools/image-to-text-ocr-tool/"]');
  await expect(result).toBeVisible();
  await result.click();
  await expect(page).toHaveURL(/\/tools\/image-to-text-ocr-tool\/$/);
  await page.goBack();
  await expect(page.locator('#tool-category')).toHaveValue('image-tools');
  await expect(page.locator('#tool-library-search')).toHaveValue('OCR');
  await expect(result).toBeVisible();
  await page.locator('#tool-library-search').fill('classifier');
  await expect(page.locator('a.launchpad-tool-card[href="/tools/image-classifier/"]')).toBeVisible();
});

test('Guides show Quick start before their approved artwork and keep the tool link early', async ({ page }) => {
  for (const route of ['/blog/how-to-use-bmi-calculator/', '/blog/how-to-use-image-to-text-ocr-tool/']) {
    await page.goto(route);
    const guide = page.locator('.task-first-guide');
    const quickStart = guide.locator('.content-section').filter({ has: page.getByRole('heading', { name: 'Quick start', exact: true }) });
    const artwork = guide.locator('.tool-art-figure');
    await expect(quickStart.locator('li')).not.toHaveCount(0);
    await expect(artwork).toHaveCount(1);
    await expect(artwork.locator('img')).toHaveAttribute('alt', /\S+/);
    await expect(artwork.locator('img')).toHaveAttribute('width', '1200');
    await expect(artwork.locator('a')).toHaveAttribute('href', /\/gallery\//);
    const positions = await guide.evaluate(element => ({
      tool: element.querySelector('.blog-article-header a.button-primary')!.getBoundingClientRect().top,
      quick: element.querySelector('.blog-article-body > .content-section')!.getBoundingClientRect().bottom,
      art: element.querySelector('.tool-art-figure')!.getBoundingClientRect().top,
    }));
    expect(positions.tool).toBeLessThan(positions.quick);
    expect(positions.quick).toBeLessThanOrEqual(positions.art);
  }
});

test('Incoming TTS comparison links describe the current article rather than a browser benchmark', async ({ page }) => {
  for (const route of ['/categories/ai-tools/', '/blog/how-to-use-text-to-speech-audiobook-generator/']) {
    await page.goto(route);
    if (route.startsWith('/categories/')) {
      await page.locator('.category-guidance summary').first().click();
    }
    const link = page.locator('main a[href="/blog/browser-text-to-speech-kokoro-vs-supertonic/"]');
    const title = route.startsWith('/categories/') ? link.locator('strong') : link;
    await expect(title).toHaveText('Kokoro versus Supertonic browser comparison');
    await expect(link.locator('..')).toContainText('model terms');
    await expect(link.locator('..')).not.toContainText(/measured|Edge|Chrome|browser test/i);
    await link.click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Kokoro vs Supertonic for Browser Text to Speech');
    await expect(page.getByRole('heading', { name: 'What the current tool offers', exact: true })).toBeVisible();
  }
});
