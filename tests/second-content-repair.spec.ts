import { expect, test, type Page } from '@playwright/test';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer, type Server } from 'node:http';
import path from 'node:path';

// Run after building. Serve only this checkout's static output, block outbound
// requests, and capture clipboard writes in the page instead of the OS clipboard.
const buildRoot = path.resolve('dist/client');
const contentTypes: Record<string, string> = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
};
type TestWindow = Window & { __aftCopyWrites?: string[] };
let server: Server;
let baseURL: string;
const pageErrors = new WeakMap<Page, string[]>();
const modelRequests = new WeakMap<Page, string[]>();

test.beforeAll(async () => {
  server = createServer(async (request, response) => {
    try {
      let pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
      if (pathname.endsWith('/')) pathname += 'index.html';
      const file = path.resolve(buildRoot, `.${pathname}`);
      if (!file.startsWith(`${buildRoot}${path.sep}`) || !(await stat(file)).isFile()) throw new Error('Not a built file');
      response.setHeader('Content-Type', contentTypes[path.extname(file)] ?? 'application/octet-stream');
      createReadStream(file).pipe(response);
    } catch {
      response.writeHead(404).end('Not found');
    }
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Missing local test server port');
  baseURL = `http://127.0.0.1:${address.port}`;
});

test.afterAll(async () => {
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  const models: string[] = [];
  pageErrors.set(page, errors);
  modelRequests.set(page, models);
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (/\/ai-models\/|huggingface\.co\/|\.onnx(?:\?|$)|cdn\.jsdelivr\.net\/.*(?:onnx|transformers)/i.test(request.url())) {
      models.push(request.url());
    }
  });
  await page.route('**/*', (route) => route.request().url().startsWith(baseURL) ? route.continue() : route.abort());
  await page.addInitScript(() => {
    (window as TestWindow).__aftCopyWrites = [];
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async (text: string) => { (window as TestWindow).__aftCopyWrites?.push(text); } },
    });
  });
});

test.afterEach(async ({ page }) => {
  expect(pageErrors.get(page)).toEqual([]);
  expect(modelRequests.get(page), 'These flows should not request any OCR or AI model assets').toEqual([]);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', `https://accessfreetools.com${new URL(page.url()).pathname}`);
  await expect(page.locator('script[src*="adsbygoogle"], script[src*="infolinks_main"]')).toHaveCount(0);
  if (new URL(page.url()).pathname.startsWith('/blog/')) {
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), 'Guide content fits the desktop or mobile viewport').toBeLessThanOrEqual(4);
  }
});

async function openTool(page: Page, slug: string) {
  const response = await page.goto(`${baseURL}/tools/${slug}/`, { waitUntil: 'networkidle' });
  expect(response?.status()).toBe(200);
}

async function setMarkdown(page: Page, headers: string, rows: string, alignment: 'left' | 'center' | 'right' = 'left') {
  const workspace = page.locator('.advanced-calculator-utility');
  await workspace.getByRole('textbox', { name: /^Headers/ }).fill(headers);
  await workspace.getByRole('textbox', { name: /^Rows, one per line/ }).fill(rows);
  await workspace.getByRole('combobox', { name: /^Column alignment/ }).selectOption(alignment);
  await workspace.getByRole('button', { name: 'Generate table', exact: true }).click();
}

async function expectLastCopy(page: Page, text: string) {
  await expect.poll(() => page.evaluate(() => (window as TestWindow).__aftCopyWrites?.at(-1))).toBe(text);
}

test('Markdown ignores blank physical lines and preserves blank cells while padding short rows', async ({ page }) => {
  await openTool(page, 'markdown-table-generator');
  await setMarkdown(page, 'Name, Qty, Note', 'Alpha,2,ready\n\nBeta,,\nGamma\n,4,end');
  await expect(page.locator('.utility-text-output')).toHaveText([
    '| Name | Qty | Note |', '| --- | --- | --- |',
    '| Alpha | 2 | ready |', '| Beta |  |  |', '| Gamma |  |  |', '|  | 4 | end |',
  ].join('\n'));
  await expect(page.locator('.utility-result-card')).toContainText('3 columns, 4 rows');
});

test('Markdown comma rows preserve quoted commas and doubled quotation marks', async ({ page }) => {
  await openTool(page, 'markdown-table-generator');
  await setMarkdown(page, '"Item, type", Note', 'Widget,"red, blue"\n"Quoted ""name""",plain');
  const expected = '| Item, type | Note |\n| --- | --- |\n| Widget | red, blue |\n| Quoted "name" | plain |';
  await expect(page.locator('.utility-text-output')).toHaveText(expected);
  await page.getByRole('button', { name: 'Copy answer', exact: true }).click();
  await expectLastCopy(page, expected);
});

test('Markdown uses the header delimiter when body cells contain literal pipes or inline code', async ({ page }) => {
  await openTool(page, 'markdown-table-generator');
  await setMarkdown(page, 'Value, Context', 'A\\|B,escaped\n`a|b`,code\n"left|right",quoted');
  await expect(page.locator('.utility-text-output')).toHaveText([
    '| Value | Context |', '| --- | --- |',
    '| A\\|B | escaped |', '| `a\\|b` | code |', '| left\\|right | quoted |',
  ].join('\n'));
});

test('Markdown paired outer bars preserve edge blanks and pipes inside matched code', async ({ page }) => {
  await openTool(page, 'markdown-table-generator');
  await setMarkdown(page, '| Token | Meaning |', '|  | value |\n| `a|b` | OR operator |\n| literal\\|bar |  |');
  await expect(page.locator('.utility-text-output')).toHaveText([
    '| Token | Meaning |', '| --- | --- |',
    '|  | value |', '| `a\\|b` | OR operator |', '| literal\\|bar |  |',
  ].join('\n'));
  await expect(page.locator('.utility-result-card')).toContainText('2 columns, 3 rows');
});

for (const [alignment, delimiter] of [['left', '---'], ['center', ':---:'], ['right', '---:']] as const) {
  test(`Markdown ${alignment} alignment produces the corresponding delimiter row`, async ({ page }) => {
    await openTool(page, 'markdown-table-generator');
    await setMarkdown(page, 'Name, Count', 'One,1', alignment);
    await expect(page.locator('.utility-text-output')).toHaveText(`| Name | Count |\n| ${delimiter} | ${delimiter} |\n| One | 1 |`);
  });
}

test('Markdown rejects invalid shapes and quotes while keeping the previous output visible and copy disabled', async ({ page }) => {
  await openTool(page, 'markdown-table-generator');
  const goodOutput = '| Name | Count |\n| --- | --- |\n| Alpha | 2 |';
  await setMarkdown(page, 'Name, Count', 'Alpha,2');
  await expect(page.locator('.utility-text-output')).toHaveText(goodOutput);

  const invalidCases = [
    { headers: '', rows: 'Alpha,2', message: /header/i },
    { headers: 'Name,,Count', rows: 'Alpha,2', message: /header/i },
    { headers: 'Name, Count', rows: '\n  \n', message: /row/i },
    { headers: 'Name, Count', rows: 'Alpha,2,extra', message: /cell|column/i },
    { headers: 'Name, Count', rows: '"unclosed,2', message: /quote/i },
    { headers: 'Name | Count', rows: '--- | ---', message: /separator|data/i },
    { headers: 'Name, Count', rows: '```csv\nAlpha,2\n```', message: /fence|data/i },
  ];
  for (const example of invalidCases) {
    await setMarkdown(page, example.headers, example.rows);
    await expect(page.getByRole('alert')).toContainText(example.message);
    await expect(page.locator('.utility-text-output')).toHaveText(goodOutput);
    await expect(page.getByRole('button', { name: 'Copy answer', exact: true })).toBeDisabled();
  }

  await setMarkdown(page, 'Name, Count', 'Recovered,3');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Copy answer', exact: true })).toBeEnabled();
  await expect(page.locator('.utility-text-output')).toContainText('| Recovered | 3 |');
});

test('Wallpaper default and example buttons agree with the published room calculations', async ({ page }) => {
  await openTool(page, 'wallpaper-calculator');
  await expect(page.locator('.utility-result-card > strong')).toHaveText('6 rolls');
  await expect(page.locator('.utility-result-card')).toContainText('302 ft2');
  await expect(page.locator('.utility-result-card')).toContainText('332.2 ft2');
  await expect(page.locator('.utility-result-card')).toContainText('$252');
  await expect(page.locator('.example-grid')).toContainText('6 rolls');

  await page.getByRole('button', { name: 'Small office', exact: true }).click();
  await expect(page.locator('.utility-result-card > strong')).toHaveText('7 rolls');
  await expect(page.locator('.utility-result-card')).toContainText('269 ft2');
  await expect(page.locator('.utility-result-card')).toContainText('301.28 ft2');
  await expect(page.locator('.utility-result-card')).toContainText('Add price per roll');
  await page.getByRole('button', { name: 'Bedroom walls', exact: true }).click();
  await expect(page.locator('.utility-result-card > strong')).toHaveText('6 rolls');
  await expect(page.locator('.utility-result-card')).toContainText('$252');
});

test('Markdown guide describes quoted comma input and pipe handling without the old cleanup warning', async ({ page }) => {
  await page.goto(`${baseURL}/blog/how-to-use-markdown-table-generator/`, { waitUntil: 'networkidle' });
  const article = page.locator('.blog-article-body');
  await expect(article).toContainText(/quot(?:ed|es)/i);
  await expect(article).toContainText(/commas?/i);
  await expect(article).toContainText(/pipes?/i);
  await expect(article).toContainText(/backticks|inline code/i);
  await expect(article).not.toContainText('Clean up quoted commas, escaped quotes, or spreadsheet CSV exports before pasting');
});

test('Wallpaper validates roll coverage, opening counts and waste and restores only a current valid estimate', async ({ page }) => {
  await openTool(page, 'wallpaper-calculator');
  const workspace = page.locator('.advanced-calculator-utility');
  await expect(workspace.locator('.utility-result-card > strong')).toHaveText('6 rolls');
  for (const example of [
    { field: /^Roll coverage ft2/, invalid: '0', valid: '56', message: /roll coverage/i },
    { field: /^Doors/, invalid: '1.5', valid: '1', message: /doors/i },
    { field: /^Waste percent/, invalid: '101', valid: '10', message: /waste/i },
  ]) {
    await workspace.getByRole('textbox', { name: example.field }).fill(example.invalid);
    await expect(workspace.locator('.utility-result-card')).toHaveCount(0);
    await expect(workspace.locator('.advanced-steps')).toHaveCount(0);
    await expect(workspace.getByRole('status')).toContainText('Inputs changed');
    await expect(workspace.getByRole('button', { name: 'Copy answer', exact: true })).toBeDisabled();
    await workspace.getByRole('button', { name: 'Estimate wallpaper', exact: true }).click();
    await expect(page.getByRole('alert')).toContainText(example.message);
    await expect(workspace.locator('.utility-result-card')).toHaveCount(0);
    await expect(workspace.locator('.advanced-steps')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Copy answer', exact: true })).toBeDisabled();
    await workspace.getByRole('textbox', { name: example.field }).fill(example.valid);
    await workspace.getByRole('button', { name: 'Estimate wallpaper', exact: true }).click();
    await expect(page.getByRole('alert')).toHaveCount(0);
    await expect(workspace.locator('.utility-result-card > strong')).toHaveText('6 rolls');
    await expect(workspace.getByRole('button', { name: 'Copy answer', exact: true })).toBeEnabled();
  }
});

test('Wallpaper guide separates room inputs from a manual accent-wall estimate', async ({ page }) => {
  await page.goto(`${baseURL}/blog/how-to-use-wallpaper-calculator/`, { waitUntil: 'networkidle' });
  const accentSection = page.locator('.content-section').filter({ has: page.getByRole('heading', { name: /accent wall/i, level: 2 }) });
  await expect(accentSection).toHaveCount(1);
  await expect(accentSection).toContainText(/separate|manual/i);
  await expect(accentSection).toContainText('no single-wall mode');
  await expect(accentSection).toContainText('96 x 1.15 = 110.4');
  await expect(accentSection).toContainText(/round.*up/i);
  await expect(accentSection).toContainText('56 usable square feet per roll');
  await expect(accentSection).toContainText('2 rolls');
  await expect(accentSection).toContainText('$84');
  await expect(page.locator('main')).toContainText('332.2');
  await expect(page.locator('main')).toContainText('$252');
});

test('Big Number executes all four operations with exact large integers', async ({ page }) => {
  await openTool(page, 'big-number-calculator');
  const workspace = page.locator('.advanced-calculator-big-number');
  for (const example of [
    { left: '9_007_199_254_740_993', right: '7', operation: 'Add +', result: '9,007,199,254,741,000' },
    { left: '1000000000000000000000', right: '999999999999999999999', operation: 'Subtract -', result: '1' },
    { left: '12345678901234567890', right: '10', operation: 'Multiply x', result: '123,456,789,012,345,678,900' },
    { left: '100000000000000000000', right: '9', operation: 'Divide /', result: '11,111,111,111,111,111,111 remainder 1' },
  ]) {
    await workspace.getByRole('textbox', { name: 'Left whole number', exact: true }).fill(example.left);
    await workspace.getByRole('textbox', { name: 'Right whole number', exact: true }).fill(example.right);
    await workspace.getByRole('button', { name: example.operation, exact: true }).click();
    await workspace.getByRole('button', { name: 'Calculate big number', exact: true }).click();
    await expect(workspace.locator('.advanced-result-card > strong')).toHaveText(example.result);
  }
});

test('Big Number negative division copies the raw quotient and signed remainder', async ({ page }) => {
  await openTool(page, 'big-number-calculator');
  await page.getByRole('button', { name: 'Negative division', exact: true }).click();
  const workspace = page.locator('.advanced-calculator-big-number');
  await expect(workspace.locator('.advanced-result-card > strong')).toHaveText('-11,111,111,111,111,111,111 remainder -1');
  await expect(workspace.locator('.advanced-steps')).toContainText('toward zero');
  await workspace.getByRole('button', { name: 'Copy raw result', exact: true }).click();
  await expectLastCopy(page, '-11111111111111111111 remainder -1');

  const divisionFaq = page.locator('.faq-list details').filter({ has: page.locator('summary', { hasText: /negative.*division/i }) });
  await expect(divisionFaq).toHaveCount(1);
  await divisionFaq.locator('summary').click();
  await expect(divisionFaq).toContainText('toward zero');
  await expect(divisionFaq).toContainText('remainder');
  const faqSection = page.locator('.content-section').filter({ has: page.getByRole('heading', { name: 'Frequently asked questions', exact: true, level: 2 }) });
  await expect(faqSection.locator('.section-title-block p')).toHaveCount(1);
  await expect(faqSection.locator('.section-title-block p')).toContainText(/exact.*integer|whole.number/i);
  await expect(page.locator('.faq-list')).not.toContainText(/mortgage|subnet|concrete waste|health measurements|quadratic formula/i);
});

test('Big Number rejects decimal inputs and division by zero with copying disabled', async ({ page }) => {
  await openTool(page, 'big-number-calculator');
  const workspace = page.locator('.advanced-calculator-big-number');
  await workspace.getByRole('textbox', { name: 'Left whole number', exact: true }).fill('1.5');
  await workspace.getByRole('button', { name: 'Calculate big number', exact: true }).click();
  await expect(workspace.locator('.advanced-result-card')).toContainText(/whole|integer/i);
  await expect(workspace.getByRole('button', { name: 'Copy raw result', exact: true })).toBeDisabled();
  await workspace.getByRole('textbox', { name: 'Left whole number', exact: true }).fill('100');
  await workspace.getByRole('textbox', { name: 'Right whole number', exact: true }).fill('0');
  await workspace.getByRole('button', { name: 'Divide /', exact: true }).click();
  await workspace.getByRole('button', { name: 'Calculate big number', exact: true }).click();
  await expect(workspace.locator('.advanced-result-card')).toContainText(/zero/i);
  await expect(workspace.getByRole('button', { name: 'Copy raw result', exact: true })).toBeDisabled();
});

test('OCR guide links the reproducible synthetic sample without loading an OCR model', async ({ page }) => {
  await page.goto(`${baseURL}/blog/how-to-use-image-to-text-ocr-tool/`, { waitUntil: 'networkidle' });
  const section = page.locator('.content-section').filter({ has: page.getByRole('heading', { name: 'Try the synthetic English sample', exact: true }) });
  await expect(section).toHaveCount(1);
  await expect(section).toContainText('ACCESS FREE TOOLS 12345');
  await expect(section).toContainText(/synthetic/i);
  await expect(section.locator('.guide-code-example')).toContainText('ACCESS FREE TOOLS 12345');
  await expect(page.locator('.blog-article-body')).not.toContainText(/starter text classifier|heavier experimental model tools|until we self-host more models/i);
  const sample = section.getByRole('link', { name: 'Download the synthetic English OCR sample (PNG)', exact: true });
  await expect(sample).toHaveAttribute('href', '/samples/ocr-synthetic-english.png');
  await expect(sample).toHaveAttribute('download', 'ocr-synthetic-english.png');
  const response = await page.request.get(`${baseURL}/samples/ocr-synthetic-english.png`);
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toBe('image/png');
  const image = await response.body();
  expect(image.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  expect(image.readUInt32BE(16)).toBe(1200);
  expect(image.readUInt32BE(20)).toBe(220);
});
