import { expect, test, type Locator, type Page } from '@playwright/test';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer, type Server } from 'node:http';
import path from 'node:path';

// Exercise the actual generated pages. Run after npm run build; no preview
// service, account credentials, external asset downloads, or source imports.
const buildRoot = path.resolve('dist/client');
const contentTypes: Record<string, string> = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
};
const genericUtilityInstructions = /requested dates, times, grades, dimensions, network values, password options|school scales, payroll rules, concrete waste, subnet type/;
const genericAiInstructions = /Enter text or choose an image for the AI task|any needed model or language files/;
const genericAiPrivacy = /starter text (?:classifier )?(?:model|files)|heavier experimental model tools|first self-hosted pass|until we self-host more models|OCR plus the first text model/;
const modelAssetUrl = /\/ai-models\/|huggingface\.co\/|\.onnx(?:\?|$)|cdn\.jsdelivr\.net\/.*(?:onnx|transformers)/i;
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
      if (!file.startsWith(`${buildRoot}${path.sep}`) || !(await stat(file)).isFile()) {
        throw new Error('Outside build or not a file');
      }
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
  const assets: string[] = [];
  pageErrors.set(page, errors);
  modelRequests.set(page, assets);
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (modelAssetUrl.test(request.url())) assets.push(request.url());
  });
  await page.route('**/*', (route) => route.request().url().startsWith(baseURL)
    ? route.continue() : route.abort());
});

test.afterEach(async ({ page }) => {
  expect(pageErrors.get(page)).toEqual([]);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', `https://accessfreetools.com${new URL(page.url()).pathname}`);
  await expect(page.locator('script[src*="adsbygoogle"], script[src*="infolinks_main"]')).toHaveCount(0);
  expect(modelRequests.get(page), 'No model or OCR asset request before running a model tool').toEqual([]);
});

function labelPattern(label: string): RegExp {
  // The associated label includes inline help; its raw text can concatenate
  // the visible field name and help without the accessibility tree's space.
  return new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
}

async function containsAll(locator: Locator, expected: Array<string | RegExp>) {
  for (const text of expected) await expect(locator).toContainText(text);
}

// The assertions name the real input, action, and one important domain limit.
// They deliberately do not import the repair data as their expected output.
const utilityCases = [
  { slug: 'time-calculator', field: 'First hours', action: 'Calculate time', instructions: ['durations rather than clock times', 'Add or Subtract', '4h 6m 15s'], limit: 'daylight-saving' },
  { slug: 'hours-calculator', field: 'Start time', action: 'Calculate hours', instructions: ['ends the next day', 'Break minutes', '7.75 hours'], limit: 'equal times as zero duration' },
  { slug: 'gpa-calculator', field: 'Course 1 credits', action: 'Calculate GPA', instructions: ['letter grade', '4.0', '3.75 GPA'], limit: 'A+ at 4.0' },
  { slug: 'grade-calculator', field: 'Current grade (%)', action: 'Calculate needed grade', instructions: ['before the final exam', 'Final weight (%)', '100% on the final'], limit: 'outside one remaining final exam' },
  { slug: 'concrete-calculator', field: 'Length (ft)', action: 'Estimate concrete', instructions: ['Depth (in)', 'Extra waste (%)', '44 cubic feet'], limit: 'does not establish a structural design' },
  { slug: 'password-generator', field: 'Length', action: 'Generate password', instructions: ['8 to 128', 'does not guarantee', 'recent-answer history'], limit: 'cryptographic random values' },
  { slug: 'conversion-calculator', field: 'Value', action: 'Convert value', instructions: ['Length, Mass, Volume, or Temperature', '20 Celsius equals 68 Fahrenheit', 'does not convert volume to mass'], limit: 'US customary units' },
  { slug: 'horsepower-calculator', field: 'Power', action: 'Convert power', instructions: ['Starting unit', '134.1 mechanical hp', 'torque, RPM'], limit: 'does not measure an engine' },
  { slug: 'api-pricing-calculator', field: 'Requests', action: 'Calculate API cost', instructions: ['Units per request', '1,000', 'cost $27'], limit: 'does not fetch prices' },
  { slug: 'download-time-calculator', field: 'File size', action: 'Calculate download time', instructions: ['decimal byte units', 'Efficiency %', '1m 40s'], limit: 'does not run a speed test' },
  { slug: 'internet-speed-needs-calculator', field: 'Video streams', action: 'Estimate speed need', instructions: ['at the same time', 'Buffer %', 'upload speed, latency'], limit: 'does not measure your connection' },
  { slug: 'streaming-bitrate-calculator', field: 'Bitrate', action: 'Calculate data use', instructions: ['Kbps or Mbps', 'Streams', '10.8 GB'], limit: 'decimal MB and GB' },
  { slug: 'monitor-ppi-calculator', field: 'Width pixels', action: 'Calculate PPI', instructions: ['Diagonal inches', 'Aspect ratio', '91.8 PPI'], limit: 'cannot establish perceived sharpness' },
  { slug: 'recipe-scaler', field: 'Ingredient name', action: 'Scale recipe', instructions: ['one Ingredient name', '5 cups', 'does not convert cups to grams'], limit: 'one ingredient at a time' },
  { slug: 'cooking-measurement-converter', field: 'Amount', action: 'Convert cooking amount', instructions: ['fluid ounces for volume', 'Density grams per cup', '240 grams'], limit: 'Same-kind conversions do not depend on density' },
  { slug: 'ingredient-cost-calculator', field: 'Amount needed', action: 'Calculate ingredient cost', instructions: ['Package amount', 'Density grams per cup', '$1.20'], limit: 'Whole-package purchases' },
  { slug: 'unit-price-calculator', field: 'Item A name', action: 'Compare unit prices', instructions: ['same unit', 'Shared unit', 'Savings per unit'], limit: 'unit label does not perform conversion' },
  { slug: 'cost-per-serving-calculator', field: 'Recipe or item name', action: 'Calculate cost per serving', instructions: ['Main cost', 'Extra cost', '$2.5625'], limit: 'without counting them twice' },
  { slug: 'butter-converter', field: 'Amount', action: 'Convert butter', instructions: ['sticks, cups, tablespoons, or grams', '1 US stick', 'common US equivalents'], limit: 'Stick sizes and blocks vary by country' },
  { slug: 'baking-pan-conversion-calculator', field: 'Old pan length (in)', action: 'Scale pan size', instructions: ['New pan length (in)', '0.547', 'rectangular pans of similar depth'], limit: 'new rectangular pan area by the old area' },
];

for (const example of utilityCases) {
  test(`${example.slug}: instructions match controls and assumptions`, async ({ page }) => {
    const response = await page.goto(`${baseURL}/tools/${example.slug}/`, { waitUntil: 'networkidle' });
    expect(response?.status()).toBe(200);
    const instructions = page.locator('.instruction-list');
    await containsAll(instructions, [...example.instructions, example.action]);
    await expect(instructions).not.toContainText(genericUtilityInstructions);
    await expect(page.getByLabel(labelPattern(example.field)).first()).toBeVisible();
    await expect(page.getByRole('button', { name: example.action, exact: true })).toBeVisible();
    await expect(page.locator('.trust-note-utility')).toContainText(example.limit);
  });
}

const aiCases: Array<{
  slug: string; field: string; action: string; image: boolean;
  instructions: Array<string | RegExp>; privacy: Array<string | RegExp>;
  guidePrivacy: Array<string | RegExp>; faqPrivacy: Array<string | RegExp>;
}> = [
  {
    slug: 'image-to-text-ocr-tool', field: 'Image file', action: 'Read text', image: true,
    instructions: ['10 MiB', '8 million pixels', 'OCR language', 'Cancel OCR'],
    privacy: ['selected image in this browser tab', 'without uploading it', 'Tesseract.js', 'Access Free Tools after you press Read text'],
    guidePrivacy: ['runs OCR in this browser tab', 'without uploading the image', 'Tesseract.js', 'Access Free Tools after you press Read text'],
    faqPrivacy: ['selected image', 'Tesseract.js', 'Access Free Tools after you press Read text'],
  },
  {
    slug: 'sentiment-analyzer', field: 'Text to analyze', action: 'Analyze sentiment', image: false,
    instructions: ['at least 12 characters', 'Local fallback result', 'not model confidence scores'],
    privacy: ['pasted text in this browser tab', 'without uploading it', 'Xenova/mobilebert-uncased-mnli', 'jsDelivr', 'local fallback'],
    guidePrivacy: ['pasted text in this browser tab', 'without uploading it', 'Xenova/mobilebert-uncased-mnli', 'jsDelivr', 'asset requests, rather than your pasted text'],
    faqPrivacy: ['without uploading the text', 'Access Free Tools', 'jsDelivr', 'without including the pasted text'],
  },
  {
    slug: 'text-summarizer', field: 'Text to summarize', action: 'Summarize text', image: false,
    instructions: ['80 to 6,000 characters', 'Extractive fallback summary', 'first three sentences or fewer'],
    privacy: ['pasted passage in this browser tab', 'without uploading it', 'Xenova/distilbart-cnn-6-6', 'Hugging Face', 'jsDelivr'],
    guidePrivacy: ['pasted passage in this browser tab', 'without uploading it', 'Hugging Face', 'jsDelivr', 'asset requests, rather than your passage'],
    faqPrivacy: ['without uploading the passage', 'Hugging Face', 'jsDelivr', 'without including the passage'],
  },
  {
    slug: 'keyword-extractor', field: 'Text to inspect', action: 'Extract keywords', image: false,
    instructions: ['at least 60 characters', 'without loading an AI model', 'eight repeated words', 'six repeated two-word pairs'],
    privacy: ['counts text in this browser tab', 'without uploading it', 'needs no model download', 'English-oriented', 'more than once'],
    guidePrivacy: ['counts text in this browser tab', 'without uploading it', 'no AI model or OCR files', 'accented or non-Latin'],
    faqPrivacy: ['without uploading the text', 'no AI model or model host'],
  },
  {
    slug: 'image-classifier', field: 'Image file', action: 'Classify image', image: true,
    instructions: ['up to five labels', 'guesses', 'no local label fallback'],
    privacy: ['chosen image in this browser tab', 'without uploading it', 'q4 Xenova/vit-base-patch16-224', 'Hugging Face', 'jsDelivr'],
    guidePrivacy: ['chosen image in this browser tab', 'without uploading it', 'Hugging Face', 'jsDelivr', 'asset requests, rather than your image'],
    faqPrivacy: ['without uploading the image', 'Hugging Face', 'jsDelivr', 'without including the image'],
  },
  {
    slug: 'tone-checker', field: 'Message to check', action: 'Check tone', image: false,
    instructions: ['at least 12 characters', 'Tone model result', 'Tone estimate', 'punctuation clue scores'],
    privacy: ['pasted draft in this browser tab', 'without uploading it', 'Xenova/mobilebert-uncased-mnli', 'jsDelivr', 'not model confidence percentages'],
    guidePrivacy: ['pasted draft in this browser tab', 'without uploading it', 'Xenova/mobilebert-uncased-mnli', 'jsDelivr', 'asset requests, rather than your draft'],
    faqPrivacy: ['without uploading the draft', 'Access Free Tools', 'jsDelivr', 'without including the draft'],
  },
];

for (const example of aiCases) {
  test(`${example.slug}: tool and guide explain the correct input and asset privacy`, async ({ page }) => {
    const response = await page.goto(`${baseURL}/tools/${example.slug}/`, { waitUntil: 'networkidle' });
    expect(response?.status()).toBe(200);
    const instructions = page.locator('.instruction-list');
    await containsAll(instructions, [...example.instructions, example.action]);
    await expect(instructions).not.toContainText(genericAiInstructions);
    await expect(page.getByLabel(labelPattern(example.field)).first()).toBeVisible();
    await expect(page.getByRole('button', { name: example.action, exact: true })).toBeVisible();
    await expect(page.locator('input[type=file]')).toHaveCount(example.image ? 1 : 0);

    const trust = page.locator('.trust-note-ai');
    await containsAll(trust, example.privacy);
    await containsAll(trust, ['Privacy Policy', 'separate analytics and session-replay handling']);
    await expect(trust).not.toContainText(genericAiPrivacy);
    const privacyFaq = page.locator('.faq-list details').filter({ has: page.locator('summary', { hasText: /upload/ }) });
    await expect(privacyFaq).toHaveCount(1);
    await privacyFaq.locator('summary').click();
    await containsAll(privacyFaq.locator('p'), example.faqPrivacy);
    await expect(page.locator('.faq-list')).not.toContainText(genericAiPrivacy);

    const guideResponse = await page.goto(`${baseURL}/blog/how-to-use-${example.slug}/`, { waitUntil: 'networkidle' });
    expect(guideResponse?.status()).toBe(200);
    await containsAll(page.locator('.instruction-list'), [...example.instructions, example.action]);
    await expect(page.locator('.instruction-list')).not.toContainText(genericAiInstructions);
    const explanation = page.locator('.content-section').filter({ has: page.getByRole('heading', { name: /^What this (?:AI|OCR) tool does$/ }) });
    await expect(explanation).toHaveCount(1);
    await containsAll(explanation, example.guidePrivacy);
    await containsAll(explanation, ['Privacy Policy', 'separate site analytics and session-replay handling']);
    await expect(explanation).not.toContainText(genericAiPrivacy);
    const guidePrivacyFaq = page.locator('.guide-question-list article').filter({ has: page.locator('h3', { hasText: /upload/ }) });
    await expect(guidePrivacyFaq).toHaveCount(1);
    await containsAll(guidePrivacyFaq, example.faqPrivacy);
    await expect(page.locator('.guide-question-list')).not.toContainText(genericAiPrivacy);
  });
}

test('hours example matches overnight instruction and equal clock times mean zero hours', async ({ page }) => {
  await page.goto(`${baseURL}/tools/hours-calculator/`, { waitUntil: 'networkidle' });
  await page.getByLabel(labelPattern('Start time')).fill('22:00');
  await page.getByLabel(labelPattern('End time')).fill('06:30');
  await page.getByLabel(labelPattern('Break minutes')).fill('45');
  await page.getByLabel(labelPattern('Hourly rate')).fill('32');
  await page.getByRole('button', { name: 'Calculate hours', exact: true }).click();
  await containsAll(page.locator('.utility-result-card'), ['7.75 hours', '$248', 'Yes']);
  await page.getByLabel(labelPattern('Start time')).fill('09:00');
  await page.getByLabel(labelPattern('End time')).fill('09:00');
  await page.getByLabel(labelPattern('Break minutes')).fill('0');
  await page.getByRole('button', { name: 'Calculate hours', exact: true }).click();
  await expect(page.locator('.utility-result-card > strong')).toHaveText('0 hours');
});

test('recipe example scales one ingredient and preserves the user unit label', async ({ page }) => {
  await page.goto(`${baseURL}/tools/recipe-scaler/`, { waitUntil: 'networkidle' });
  await page.getByLabel(labelPattern('Ingredient name')).fill('Flour');
  await page.getByLabel(labelPattern('Original amount')).fill('2');
  await page.getByLabel(labelPattern('Unit')).fill('cups');
  await page.getByLabel(labelPattern('Original servings')).fill('4');
  await page.getByLabel(labelPattern('Desired servings')).fill('10');
  await page.getByRole('button', { name: 'Scale recipe', exact: true }).click();
  await containsAll(page.locator('.utility-result-card'), ['5 cups', '2.5']);
});

test('temperature conversion uses the visible mode and unit selectors', async ({ page }) => {
  await page.goto(`${baseURL}/tools/conversion-calculator/`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Temperature/ }).click();
  await page.getByLabel(labelPattern('Value')).fill('20');
  await page.getByRole('combobox', { name: /^From/ }).selectOption('celsius');
  await page.getByRole('combobox', { name: /^To/ }).selectOption('fahrenheit');
  await page.getByRole('button', { name: 'Convert value', exact: true }).click();
  await expect(page.locator('.utility-result-card > strong')).toHaveText(/68/);
});

test('keyword extraction gives repeated word and filtered pair counts without model requests', async ({ page }) => {
  await page.goto(`${baseURL}/tools/keyword-extractor/`, { waitUntil: 'networkidle' });
  await page.getByLabel(labelPattern('Text to inspect')).fill('Browser tools help readers. Browser tools help writers. Browser tools work locally for readers and writers.');
  await page.getByRole('button', { name: 'Extract keywords', exact: true }).click();
  await containsAll(page.locator('.advanced-result-card'), ['Top words:', '- browser: 3', '- tools: 3', 'Top phrases:', '- browser tools: 3']);
});
