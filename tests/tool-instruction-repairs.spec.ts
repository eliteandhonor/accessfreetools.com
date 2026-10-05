import { expect, test, type Page } from '@playwright/test';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer, type Server } from 'node:http';
import path from 'node:path';

const root = path.resolve('dist/client');
const contentTypes: Record<string, string> = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
};
let server: Server;
let baseURL: string;
const pageErrors = new WeakMap<Page, string[]>();

test.beforeAll(async () => {
  server = createServer(async (request, response) => {
    try {
      let pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
      if (pathname.endsWith('/')) pathname += 'index.html';
      const file = path.resolve(root, `.${pathname}`);
      if (!file.startsWith(`${root}${path.sep}`)) throw new Error('Outside build');
      const info = await stat(file);
      if (!info.isFile()) throw new Error('Not a file');
      response.setHeader('Content-Type', contentTypes[path.extname(file)] ?? 'application/octet-stream');
      createReadStream(file).pipe(response);
    } catch {
      response.writeHead(404).end('Not found');
    }
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Missing test server port');
  baseURL = `http://127.0.0.1:${address.port}`;
});

test.afterAll(async () => {
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  pageErrors.set(page, errors);
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/*', (route) => route.request().url().startsWith(baseURL)
    ? route.continue() : route.abort());
});

test.afterEach(async ({ page }) => {
  expect(pageErrors.get(page)).toEqual([]);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', `https://accessfreetools.com${new URL(page.url()).pathname}`);
  const robots = await page.locator('meta[name=robots]').evaluateAll((elements) => elements.map((element) => element.getAttribute('content') ?? ''));
  expect(robots.join(',')).not.toMatch(/noindex/);
  await expect(page.locator('script[src*="adsbygoogle"], script[src*="infolinks_main"]')).toHaveCount(0);
});

test('subnet instructions and guide match the IPv4 inputs and usable range', async ({ page }) => {
  await page.goto(`${baseURL}/tools/subnet-calculator/`, { waitUntil: 'networkidle' });
  const instructions = page.locator('.instruction-list');
  await expect(instructions).toContainText('IPv4');
  await expect(instructions).toContainText('Prefix length');
  await expect(instructions).not.toContainText(/payroll|concrete|password|grades/i);
  await page.getByLabel('IP address', { exact: true }).fill('10.0.5.17');
  await page.getByLabel('Prefix length', { exact: true }).fill('28');
  await page.getByRole('button', { name: 'Calculate subnet', exact: true }).click();
  await expect(page.locator('.advanced-result-card')).toContainText('10.0.5.16/28');
  await expect(page.locator('.advanced-result-card')).toContainText('255.255.255.240');
  await expect(page.locator('.advanced-result-card')).toContainText('10.0.5.17 - 10.0.5.30');
  await page.goto(`${baseURL}/blog/how-to-use-subnet-calculator/`);
  await expect(page.locator('main')).toContainText('10.0.5.16');
  await expect(page.locator('main')).toContainText('10.0.5.31');
});

test('language detection gives text-only instructions and a local result', async ({ page }) => {
  await page.goto(`${baseURL}/tools/language-detector/`, { waitUntil: 'networkidle' });
  await expect(page.locator('.instruction-list')).toContainText('Detect language');
  await expect(page.locator('.instruction-list')).not.toContainText(/choose an image|download/i);
  await expect(page.locator('input[type=file]')).toHaveCount(0);
  await page.getByRole('textbox', { name: /^Text to detect/ }).fill('Esta herramienta funciona en el navegador.');
  await page.getByRole('button', { name: 'Detect language', exact: true }).click();
  await expect(page.locator('.advanced-result-card')).toContainText('Spanish');
  await expect(page.locator('.advanced-result-card')).toContainText('spa');
  await expect(page.locator('.trust-note-ai')).not.toContainText(/OCR|starter model|heavier/i);
  await page.goto(`${baseURL}/blog/how-to-use-language-detector/`);
  await expect(page.locator('main')).toContainText('spa');
  await expect(page.locator('main')).toContainText('distance');
});

test('percentage controls precede preserved artwork and calculate correctly', async ({ page }, testInfo) => {
  await page.setViewportSize(testInfo.project.name === 'desktop'
    ? { width: 1165, height: 747 } : { width: 390, height: 844 });
  await page.goto(`${baseURL}/tools/percentage-calculator/`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `output/playwright/percentage-layout-${testInfo.project.name}.png` });
  const control = page.getByLabel('Percentage', { exact: true });
  const artwork = page.locator('.tool-art-figure');
  await expect(artwork).toHaveCount(1);
  const controlBox = await control.boundingBox();
  const artBox = await artwork.boundingBox();
  expect(controlBox).not.toBeNull();
  expect(artBox).not.toBeNull();
  expect(controlBox!.y).toBeLessThan(artBox!.y);
  if (testInfo.project.name === 'desktop') {
    expect(controlBox!.y + controlBox!.height).toBeLessThan(page.viewportSize()!.height);
  }
  await expect(artwork.locator('img')).toHaveAttribute('alt', /.+/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(4);
  await control.fill('18');
  await page.getByLabel('Of value', { exact: true }).fill('240');
  await page.getByRole('button', { name: 'Calculate percentage', exact: true }).click();
  await expect(page.locator('.percentage-result-card')).toContainText('43.2');
  await page.getByRole('button', { name: '80 after 20% decrease', exact: true }).click();
  await expect(page.locator('.percentage-result-card')).toContainText('100');
  await expect(page.locator('script[src*="adsbygoogle"], script[src*="infolinks_main"]')).toHaveCount(0);
  await page.screenshot({ path: `output/playwright/percentage-controls-first-${testInfo.project.name}.png`, fullPage: true });
});
