import { expect, test, type Page } from '@playwright/test';

async function openPage(page: Page, path: string) {
  const response = await page.goto(path);
  expect(response?.status()).toBe(200);
  await expect(page.locator('main')).toBeVisible();
  await expect(page.locator('h1')).toHaveCount(1);
}

function section(page: Page, heading: string) {
  return page.locator('section.content-section').filter({
    has: page.getByRole('heading', { name: heading, exact: true }),
  });
}

const errorsByPage = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  // The external publisher script is outside these local content checks.
  await page.route('https://news.google.com/swg/js/v1/publisher.js', route => route.fulfill({
    status: 200, contentType: 'application/javascript', body: '',
  }));
  const errors: string[] = [];
  errorsByPage.set(page, errors);
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
});

test.afterEach(async ({ page }) => {
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)).toBe(false);
  expect(errorsByPage.get(page)).toEqual([]);
});

test('BMI instructions match the metric controls and calculation', async ({ page }) => {
  await openPage(page, '/tools/bmi-calculator/');
  const instructions = section(page, 'How to use the BMI Calculator');
  await expect(instructions).toContainText('centimeters (cm)');
  await expect(instructions).toContainText('kilograms (kg)');
  await expect(instructions).toContainText('feet by 12');
  await expect(instructions).toContainText('2.54');
  await expect(instructions).toContainText('0.45359237');
  await expect(instructions).not.toContainText(/dates|lab values|workout details/i);
  await expect(instructions).toContainText('screening estimate');

  await page.getByLabel('Height (cm)', { exact: true }).fill('200');
  await page.getByLabel('Weight (kg)', { exact: true }).fill('80');
  await expect(page.locator('.health-fields input')).toHaveCount(2);
  await page.getByRole('button', { name: 'Calculate BMI', exact: true }).click();
  await expect(page.locator('.health-result-card strong')).toHaveText('BMI 20');
});

test('BMI guide consistently asks for metric inputs and retains its references', async ({ page }) => {
  await openPage(page, '/blog/how-to-use-bmi-calculator/');
  for (const heading of ['Quick start', 'What to enter']) {
    const content = section(page, heading);
    await expect(content).toContainText('centimeters (cm)');
    await expect(content).toContainText('kilograms (kg)');
    await expect(content).not.toContainText('same unit system you normally use');
  }
  await expect(section(page, 'What to enter')).toContainText('0.45359237');
  await expect(section(page, 'Common mistakes to avoid')).not.toContainText('unless the tool mode expects it');
  await expect(page.locator('main a[href="https://www.cdc.gov/BMI/"]')).toHaveCount(1);
  await expect(page.locator('main a[href="https://www.nhlbi.nih.gov/health/educational/lose_wt/bmitools"]')).toHaveCount(1);
});

for (const path of ['/', '/tools/']) {
  test(`${path} wallpaper teaser describes the supported room estimate`, async ({ page }) => {
    await openPage(page, path);
    if (path === '/tools/') {
      await page.getByRole('searchbox', { name: 'Search tools' }).fill('wallpaper rolls');
    }
    const teaser = page.locator(`${path === '/' ? '.home-task-shortcuts' : '.launchpad-tool-grid'} a[href="/tools/wallpaper-calculator/"]`);
    await expect(teaser).toContainText(/wallpaper rolls/i);
    if (path === '/') {
      await expect(teaser).toContainText(/room/i);
      await expect(teaser).toContainText(/coverage/i);
      await expect(teaser).toContainText(/waste/i);
    }
    await expect(teaser).not.toContainText('pattern repeat');
    await teaser.click();
    await expect(page.locator('.tool-title-row p')).toContainText('rectangular room');
    await expect(page.locator('.tool-title-row p')).toContainText('usable roll coverage');
    await expect(page.locator('.tool-title-row p')).toContainText('waste percent');
  });
}

test('Wallpaper controls support the room, usable coverage, and chosen waste estimate', async ({ page }) => {
  await openPage(page, '/tools/wallpaper-calculator/');
  await page.getByLabel('Room length feet').fill('12');
  await page.getByLabel('Room width feet').fill('10');
  await page.getByLabel('Wall height feet').fill('8');
  await page.getByLabel('Doors', { exact: false }).fill('1');
  await page.getByLabel('Windows', { exact: false }).fill('2');
  await page.getByLabel('Roll coverage ft2').fill('56');
  await page.getByLabel('Waste percent').fill('20');
  await page.getByRole('button', { name: 'Estimate wallpaper', exact: true }).click();
  await expect(page.locator('.utility-result-card strong')).toHaveText('7 rolls');
  await expect(page.getByLabel('Pattern repeat')).toHaveCount(0);
});

test('Currency answer FAQ describes the actual rate and fee outputs', async ({ page }) => {
  await openPage(page, '/tools/currency-calculator/');
  const faq = page.locator('details').filter({ has: page.getByText('How should I read the Currency Calculator answer?', { exact: true }) });
  await faq.locator('summary').click();
  for (const label of ['Converted amount', 'Before fee', 'Fee amount', 'Rate used']) {
    await expect(faq).toContainText(label);
  }
  await expect(faq).not.toContainText(/principal|payment timing/i);
  await page.getByLabel('Amount to convert', { exact: true }).fill('100');
  await page.getByLabel('Exchange rate (target per 1 source)', { exact: true }).fill('1.25');
  await page.getByLabel('Exchange fee (%)', { exact: true }).fill('10');
  await page.getByRole('button', { name: 'Convert currency', exact: true }).click();
  await expect(page.locator('.finance-result-card strong')).toHaveText('112.5 target units');
});

test('OCR input FAQ matches its image file and language controls', async ({ page }) => {
  const modelRequests: string[] = [];
  page.on('request', request => {
    if (request.url().includes('/ai-models/')) modelRequests.push(request.url());
  });
  await openPage(page, '/tools/image-to-text-ocr-tool/');
  const faq = page.locator('details').filter({ has: page.getByText('What do the main Image to Text OCR Tool inputs mean?', { exact: true }) });
  await faq.locator('summary').click();
  await expect(faq).toContainText('PNG, JPEG, or WebP');
  await expect(faq).toContainText('OCR language');
  await expect(faq).not.toContainText(/text or image|paste(?:d)? text|text input/i);
  await expect(page.locator('.ai-fields input[type="file"]')).toHaveAttribute('accept', 'image/png,image/jpeg,image/webp');
  await expect(page.getByLabel('OCR language')).toBeVisible();
  await expect(page.locator('.ai-panel textarea')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Read text', exact: true })).toBeVisible();
  expect(modelRequests).toEqual([]);
});
