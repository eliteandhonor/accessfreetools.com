import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { chromium, expect as browserExpect, type Browser, type Page } from '@playwright/test';
import { build } from 'esbuild';
import { afterAll, afterEach, beforeAll, beforeEach, expect, it } from 'vitest';

const evidence = 'output/ux-audit/2026-10-05/bounded-final-pass';
const css = readFileSync('src/styles/global.css', 'utf8');
const harness = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import FinanceCalculator from './src/components/FinanceCalculator';
import PercentageCalculator from './src/components/PercentageCalculator';
const fixture = window.calculatorFixture;
const mock = window.clipboardMock = { mode: fixture.clipboard, calls: [], finish: null };
Object.defineProperty(navigator, 'clipboard', { configurable: true, value: fixture.clipboard === 'missing' ? undefined : {
  writeText: value => {
    mock.calls.push(value);
    if (mock.mode === 'reject') return Promise.reject(new DOMException('Controlled denial', 'NotAllowedError'));
    if (mock.mode === 'pending') return new Promise((resolve, reject) => { mock.finish = ok => ok ? resolve() : reject(new DOMException('Controlled delayed denial', 'NotAllowedError')); });
    return Promise.resolve();
  },
}});
createRoot(document.getElementById('root')).render(fixture.variant === 'percentage'
  ? <PercentageCalculator /> : <FinanceCalculator variant={fixture.variant} />);
`;

let browser: Browser, page: Page, script: string;
let errors: string[];
const states: unknown[] = [];
const ui = browserExpect.configure({ timeout: 2500 });
beforeAll(async () => {
  mkdirSync(evidence, { recursive: true });
  script = (await build({ stdin: { contents: harness, resolveDir: process.cwd(), loader: 'tsx' },
    bundle: true, write: false, platform: 'browser', format: 'iife', jsx: 'automatic' })).outputFiles[0].text;
  browser = await chromium.launch({ headless: true });
});
beforeEach(async () => {
  errors = [];
  page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.setDefaultTimeout(2500);
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => route.fulfill({ contentType: 'text/html', body: '<main id="root"></main>' }));
});
afterEach(async () => { await page.close(); expect(errors).toEqual([]); });
afterAll(async () => {
  await browser?.close();
  writeFileSync(`${evidence}/currency-percentage-component-states.json`, JSON.stringify({
    scope: 'Actual Currency/Percentage React components, controlled clipboard API only',
    viewport: { width: 390, height: 844 }, realClipboardWrites: false, states,
  }, null, 2) + '\n');
});

async function mount(variant = 'percentage', clipboard = 'reject') {
  await page.goto('https://calculator-state.invalid/');
  await page.evaluate(value => { (window as any).calculatorFixture = value; }, { variant, clipboard });
  await page.addStyleTag({ content: css });
  await page.addScriptTag({ content: script });
  await ui(page.getByRole('button', { name: 'Copy answer', exact: true })).toBeVisible();
}
const copy = () => page.getByRole('button', { name: /^(Copy answer|Copied)$/, exact: true });
const calculate = () => page.getByRole('button', { name: 'Calculate percentage', exact: true });
const answer = () => page.locator('.percentage-result-card strong');
async function capture(label: string) {
  const path = `${evidence}/${label}.png`;
  await page.screenshot({ path });
  states.push({ label, screenshot: path, url: page.url(),
    result: await page.locator('.finance-result-card,.percentage-result-card').allTextContents(),
    alerts: await page.getByRole('alert').allTextContents(), statuses: await page.getByRole('status').allTextContents(),
    copyDisabled: await copy().isDisabled(), clipboardCalls: await page.evaluate(() => (window as any).clipboardMock.calls),
    overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
  });
}
async function selectMode(label: string) {
  await page.getByRole('group', { name: 'Percentage calculation type', exact: true }).getByRole('button')
    .filter({ has: page.locator('strong', { hasText: label }) }).click();
}
async function expectStale() {
  await ui(answer()).toHaveText('Calculate to update the answer.');
  await ui(copy()).toBeDisabled();
  await ui(page.locator('.percentage-steps')).toHaveCount(0);
  await ui(page.getByRole('button', { name: 'Select answer', exact: true })).toHaveCount(0);
}

it('Currency retains initial defaults, clears changed/failed answers, and restores examples/history', async () => {
  await mount('currency', 'resolve');
  const result = page.locator('.finance-result-card');
  const rate = page.getByLabel(/^Exchange rate/);
  const convert = page.getByRole('button', { name: 'Convert currency', exact: true });
  await ui(result.locator(':scope > strong')).toHaveText('125 target units');
  await ui(copy()).toBeEnabled();
  await page.getByLabel('Amount to convert', { exact: true }).fill('200');
  await ui(result).toHaveCount(0);
  await ui(page.locator('.advanced-steps')).toHaveCount(0);
  await ui(copy()).toBeDisabled();
  await ui(page.getByRole('status')).toContainText('Convert currency to update');
  await convert.click();
  await ui(result.locator(':scope > strong')).toHaveText('250 target units');
  await ui(copy()).toBeEnabled();
  await copy().click();
  expect(await page.evaluate(() => (window as any).clipboardMock.calls)).toEqual(['200 x 1.25 with 0% fee = 250 target units']);
  await rate.fill('');
  await ui(result).toHaveCount(0);
  await convert.click();
  await ui(page.getByRole('alert')).toHaveText('Exchange rate is required');
  await ui(result).toHaveCount(0);
  await ui(copy()).toBeDisabled();
  await ui(page.locator('.advanced-side-panel ol')).toContainText('250 target units');
  await capture('currency-after-required-rate-mobile390');
  await rate.fill('1.25');
  await convert.click();
  await ui(result.locator(':scope > strong')).toHaveText('250 target units');
  await page.getByRole('button', { name: 'Travel fee check', exact: true }).click();
  await ui(result.locator(':scope > strong')).toHaveText('448.5 target units');
  await ui(page.getByLabel('Amount to convert', { exact: true })).toHaveValue('500');
  await ui(rate).toHaveValue('0.92');
  await ui(page.getByLabel('Exchange fee (%)', { exact: true })).toHaveValue('2.5');
  await ui(copy()).toBeEnabled();
  await ui(page.getByRole('alert')).toHaveCount(0);
  await page.getByLabel('Exchange fee (%)', { exact: true }).fill('0');
  await ui(result).toHaveCount(0);
  await ui(copy()).toBeDisabled();
  await convert.click();
  await ui(result.locator(':scope > strong')).toHaveText('460 target units');
});

it('Currency ignores a delayed clipboard acknowledgement after inputs change', async () => {
  await mount('currency', 'pending');
  await copy().click();
  await page.getByLabel('Amount to convert', { exact: true }).fill('200');
  await page.evaluate(() => (window as any).clipboardMock.finish(true));
  await ui(copy()).toHaveText('Copy answer');
  await ui(copy()).toBeDisabled();
  await ui(page.locator('.finance-result-card')).toHaveCount(0);
  await page.getByRole('button', { name: 'Convert currency', exact: true }).click();
  await ui(page.locator('.finance-result-card > strong')).toHaveText('250 target units');
  await ui(copy()).toBeEnabled();
});

it('an unrelated Finance variant retains its existing result behavior', async () => {
  await mount('loan', 'resolve');
  const result = page.locator('.finance-result-card');
  const original = await result.textContent() ?? '';
  await page.getByLabel('Interest rate (%)', { exact: true }).fill('');
  await ui(result).toHaveText(original);
  await page.getByRole('button', { name: 'Calculate loan', exact: true }).click();
  await ui(page.getByRole('alert')).toContainText('required');
  await ui(result).toHaveText(original);
  await ui(copy()).toBeDisabled();
});

for (const clipboard of ['reject', 'missing']) it(`Percentage ${clipboard} clipboard feedback keeps answer valid and supports manual selection`, async () => {
  await mount('percentage', clipboard);
  await page.getByLabel('Of value', { exact: true }).fill('240');
  await calculate().click();
  await ui(answer()).toHaveText('48');
  await copy().click();
  await ui(page.getByRole('status')).toContainText(clipboard === 'reject' ? 'Copy was blocked.' : 'Copy is not available');
  await ui(page.getByRole('alert')).toHaveCount(0);
  await ui(answer()).toHaveText('48');
  await ui(copy()).toBeEnabled();
  await capture(`percentage-after-copy-${clipboard}-mobile390`);
  const select = page.getByRole('button', { name: 'Select answer', exact: true });
  await select.focus();
  await page.keyboard.press('Enter');
  expect(await page.evaluate(() => window.getSelection()?.toString())).toBe('48');
  await ui(answer()).toBeFocused();
  await ui(page.getByRole('status')).toHaveText("Answer selected. Use your device's Copy command.");
  expect(await page.evaluate(() => (window as any).clipboardMock.calls)).toEqual(clipboard === 'reject' ? ['48'] : []);
});

it('Percentage copy retry recovers while numeric validation remains distinct', async () => {
  await mount();
  await copy().click();
  await ui(page.getByRole('status')).toContainText('Copy was blocked');
  await page.evaluate(() => { (window as any).clipboardMock.mode = 'resolve'; });
  await copy().click();
  await ui(copy()).toHaveText('Copied');
  await ui(page.getByRole('status')).toHaveText('Answer copied.');
  await ui(page.getByRole('button', { name: 'Select answer', exact: true })).toHaveCount(0);
  await page.getByLabel('Percentage', { exact: true }).fill('');
  await expectStale();
  await calculate().click();
  await ui(page.getByRole('alert')).toHaveText('Percentage is required.');
  await ui(page.getByRole('status')).toBeEmpty();
  await ui(copy()).toBeDisabled();
  await page.getByLabel('Percentage', { exact: true }).fill('0');
  await calculate().click();
  await ui(answer()).toHaveText('0');
  await ui(page.getByRole('alert')).toHaveCount(0);
  await copy().click();
  await ui(copy()).toHaveText('Copied');
  expect(await page.evaluate(() => (window as any).clipboardMock.calls)).toEqual(['16', '16', '0']);
  await capture('percentage-after-copy-recovery-mobile390');
});

it('Percentage invalidates inputs, modes, direction and reverse question changes while examples stay fresh', async () => {
  await mount('percentage', 'resolve');
  await ui(answer()).toHaveText('16');
  await page.getByLabel('Of value', { exact: true }).fill('240');
  await expectStale();
  await calculate().click();
  await ui(answer()).toHaveText('48');
  await selectMode('Add or subtract percent');
  await expectStale();
  await calculate().click();
  await ui(answer()).toHaveText('150');
  const direction = page.getByRole('group', { name: 'Adjustment direction', exact: true });
  await direction.getByRole('button', { name: 'Decrease', exact: true }).click();
  await expectStale();
  await calculate().click();
  await ui(answer()).toHaveText('90');
  await direction.getByRole('button', { name: 'Decrease', exact: true }).click();
  await ui(answer()).toHaveText('90');
  await ui(copy()).toBeEnabled();
  await page.getByRole('button', { name: '30 is 15% of what?', exact: true }).click();
  await ui(answer()).toHaveText('200');
  await ui(copy()).toBeEnabled();
  await page.getByRole('button', { name: 'After increase', exact: true }).click();
  await expectStale();
  await calculate().click();
  expect(Number(await answer().innerText())).toBeCloseTo(30 / 1.15, 7);
  await ui(copy()).toBeEnabled();
  await page.getByRole('button', { name: 'After decrease', exact: true }).click();
  await expectStale();
  await page.getByRole('button', { name: '80 after 20% decrease', exact: true }).click();
  await ui(answer()).toHaveText('100');
  await ui(page.locator('.percentage-side-panel ol')).toContainText('200');
  await ui(copy()).toBeEnabled();
});

for (const success of [false, true]) it(`Percentage ignores delayed clipboard ${success ? 'success' : 'denial'} after a newer answer`, async () => {
  await mount('percentage', 'pending');
  await copy().click();
  await page.getByRole('button', { name: '80 after 20% decrease', exact: true }).click();
  await page.evaluate(ok => (window as any).clipboardMock.finish(ok), success);
  await ui(answer()).toHaveText('100');
  await ui(copy()).toHaveText('Copy answer');
  await ui(copy()).toBeEnabled();
  await ui(page.getByRole('status')).toBeEmpty();
  await ui(page.getByRole('button', { name: 'Select answer', exact: true })).toHaveCount(0);
});
