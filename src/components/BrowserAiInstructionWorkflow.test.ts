import { chromium, expect as browserExpect, type Browser, type Page } from '@playwright/test';
import { build } from 'esbuild';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import type { AiToolVariant } from './AiBrowserTool';

// The real component and algorithms run in Chromium. All model/runtime requests
// are blocked: model-failure cases verify fallbacks, not model accuracy.
const harness = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import Component from './src/components/AiBrowserTool';
const variant = new URL(location.href).searchParams.get('variant');
createRoot(document.getElementById('root')).render(<Component variant={variant} />);
`;

let browser: Browser;
let page: Page | undefined;
let script: string;
let attemptedAssets: string[];
let pageErrors: string[];
const ui = browserExpect.configure({ timeout: 8_000 });

beforeAll(async () => {
  const bundle = await build({
    absWorkingDir: process.cwd(), tsconfigRaw: {},
    stdin: { contents: harness, resolveDir: process.cwd(), loader: 'tsx' },
    bundle: true, write: false, platform: 'browser', format: 'iife', jsx: 'automatic',
  });
  script = bundle.outputFiles[0]!.text;
  browser = await chromium.launch({ headless: true });
  console.info(`AI instruction workflows: Chromium ${browser.version()}, real keyword counts and input validation; model requests blocked to verify fallbacks, no model downloads.`);
}, 30_000);

afterEach(async () => {
  await page?.close();
  page = undefined;
  expect(pageErrors).toEqual([]);
});

afterAll(async () => { await browser?.close(); });

async function mount(variant: AiToolVariant, button: string) {
  attemptedAssets = [];
  pageErrors = [];
  page = await browser.newPage();
  page.setDefaultTimeout(2_000);
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin === 'http://ai-workflow.test' && url.pathname === '/') {
      await route.fulfill({ contentType: 'text/html', body: '<div id="root"></div>' });
      return;
    }
    attemptedAssets.push(url.href);
    // No request reaches any network or model host, including same-origin models.
    await route.abort('blockedbyclient');
  });
  await page.goto(`http://ai-workflow.test/?variant=${variant}`);
  await page.addScriptTag({ content: script });
  await page.getByRole('button', { name: button, exact: true }).waitFor();
  expect(attemptedAssets).toEqual([]);
  return page;
}

describe('real keyword extraction without a model', () => {
  it('counts repeated terms and pairs formed after filtering removed words', async () => {
    const current = await mount('keywords', 'Extract keywords');
    const input = 'Refund policy covers returns. The refund policy explains shipping and delivery. Check refund policy before requesting a return. Refund policy includes shipping and delivery.';
    await current.getByLabel('Text to inspect', { exact: false }).fill(input);
    await current.getByRole('button', { name: 'Extract keywords', exact: true }).click();
    await ui(current.locator('.ai-result-card')).toContainText('Keyword clues');
    await ui(current.locator('.utility-text-output')).toContainText('- refund: 4');
    await ui(current.locator('.utility-text-output')).toContainText('- policy: 4');
    await ui(current.locator('.utility-text-output')).toContainText('- refund policy: 4');
    await ui(current.locator('.utility-text-output')).toContainText('- shipping delivery: 2');
    expect(input.includes('shipping delivery')).toBe(false);
    expect(attemptedAssets).toEqual([]);
  });

  it('reports no repeats when a valid passage contains unique filtered terms', async () => {
    const current = await mount('keywords', 'Extract keywords');
    await current.getByLabel('Text to inspect', { exact: false }).fill('Apples oranges carrots tomatoes potatoes spinach lettuce broccoli cucumber pumpkin.');
    await current.getByRole('button', { name: 'Extract keywords', exact: true }).click();
    await ui(current.locator('.ai-result-card')).toContainText('No repeated keyword found');
    await ui(current.locator('.utility-text-output')).toContainText('Not enough repeated phrases found.');
    expect(attemptedAssets).toEqual([]);
  });
});

describe('text input bounds before model loading', () => {
  it.each([
    { variant: 'sentiment', inputLabel: 'Text to analyze', button: 'Analyze sentiment', minimum: 12 },
    { variant: 'tone', inputLabel: 'Message to check', button: 'Check tone', minimum: 12 },
    { variant: 'summary', inputLabel: 'Text to summarize', button: 'Summarize text', minimum: 80 },
    { variant: 'keywords', inputLabel: 'Text to inspect', button: 'Extract keywords', minimum: 60 },
  ] as const)('requires $minimum trimmed characters for $variant', async spec => {
    const current = await mount(spec.variant, spec.button);
    await current.getByLabel(spec.inputLabel, { exact: false }).fill(`  ${'x'.repeat(spec.minimum - 1)}  `);
    await current.getByRole('button', { name: spec.button, exact: true }).click();
    await ui(current.getByRole('alert')).toHaveText(`Enter at least ${spec.minimum} characters so the tool has enough context.`);
    await ui(current.locator('.ai-result-card')).toHaveCount(0);
    expect(attemptedAssets).toEqual([]);
  });

  it('rejects more than 6000 trimmed summary characters before fetching a model', async () => {
    const current = await mount('summary', 'Summarize text');
    await current.getByLabel('Text to summarize', { exact: false }).fill('x'.repeat(6001));
    await current.getByRole('button', { name: 'Summarize text', exact: true }).click();
    await ui(current.getByRole('alert')).toContainText('6,000 characters');
    expect(attemptedAssets).toEqual([]);
  });
});

describe('explicit model-unavailable workflows with network blocked', () => {
  it('labels sentiment word-clue fallback and shows clue counts', async () => {
    const current = await mount('sentiment', 'Analyze sentiment');
    await current.getByLabel('Text to analyze', { exact: false }).fill('This is good and helpful and clear.');
    await current.getByRole('button', { name: 'Analyze sentiment', exact: true }).click();
    await ui(current.locator('.ai-result-card')).toContainText('Local fallback result');
    await ui(current.locator('.ai-result-card')).toContainText('Likely positive');
    await ui(current.locator('.ai-result-card dl')).toHaveText('Positive clues3Negative clues0');
    await ui(current.locator('.advanced-steps')).toContainText('model was unavailable');
    expect(attemptedAssets.some(url => url.includes('/ai-models/transformers/'))).toBe(true);
  });

  it('uses numeric tone clues rather than model confidence percentages', async () => {
    const current = await mount('tone', 'Check tone');
    await current.getByLabel('Message to check', { exact: false }).fill('Please fix this immediately before launch.');
    await current.getByRole('button', { name: 'Check tone', exact: true }).click();
    await ui(current.locator('.ai-result-card')).toContainText('Tone estimate');
    await ui(current.locator('.ai-result-card strong')).toHaveText('Urgent or direct');
    await ui(current.locator('.ai-result-card dl')).not.toContainText('%');
    expect(attemptedAssets.some(url => url.includes('/ai-models/transformers/'))).toBe(true);
  });

  it('copies only the first three sentences in the extractive summary fallback', async () => {
    const current = await mount('summary', 'Summarize text');
    const firstThree = 'The library opens at nine each morning. Visitors can borrow two books at a time. Returns belong in the marked box.';
    await current.getByLabel('Text to summarize', { exact: false }).fill(`${firstThree} The workshop starts at noon.`);
    await current.getByRole('button', { name: 'Summarize text', exact: true }).click();
    await ui(current.locator('.ai-result-card')).toContainText('Extractive fallback summary');
    await ui(current.locator('.utility-text-output')).toHaveText(firstThree);
    await ui(current.locator('.ai-result-card')).not.toContainText('workshop');
    expect(attemptedAssets.length).toBeGreaterThan(0);
  });

  it('requires an image, waits for action to request classifier assets, and has no fallback labels', async () => {
    const current = await mount('image-classifier', 'Classify image');
    await current.getByRole('button', { name: 'Classify image', exact: true }).click();
    await ui(current.getByRole('alert')).toHaveText('Choose an image file before classifying it.');
    expect(attemptedAssets).toEqual([]);
    await current.getByLabel('Image file', { exact: false }).setInputFiles({
      name: 'one-pixel.png', mimeType: 'image/png',
      buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j49kAAAAASUVORK5CYII=', 'base64'),
    });
    expect(attemptedAssets).toEqual([]);
    await current.getByRole('button', { name: 'Classify image', exact: true }).click();
    await ui(current.getByRole('alert')).toBeVisible();
    await ui(current.locator('.ai-result-card')).toHaveCount(0);
    expect(attemptedAssets.length).toBeGreaterThan(0);
  });
});
