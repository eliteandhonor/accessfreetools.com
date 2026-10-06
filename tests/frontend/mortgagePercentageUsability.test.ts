import { chromium, expect as browserExpect, type Browser, type Page } from '@playwright/test';
import { build } from 'esbuild';
import { afterAll, afterEach, beforeAll, beforeEach, expect, it } from 'vitest';
import { getTool } from '../../src/data/tools';
import { calculateMortgagePayment } from '../../src/lib/calculator';

// Real components and math; only clipboard permission is controlled. No remote requests.
const harness = `
import React from 'react';import {createRoot} from 'react-dom/client';
import Mortgage from './src/components/FinanceCalculator';import Percentage from './src/components/PercentageCalculator';
const mock=window.clipboardMock={mode:'resolve',calls:[],finish:null};
window.configureClipboard=mode=>{mock.mode=mode;Object.defineProperty(navigator,'clipboard',{configurable:true,value:mode==='missing'?undefined:{writeText:text=>{mock.calls.push(text);if(mock.mode==='reject')return Promise.reject(new Error('Controlled permission denial'));if(mock.mode==='pending')return new Promise((resolve,reject)=>{const finish=ok=>ok?resolve():reject(new Error('Delayed denial'));mock.finish=finish;(mock.finishes??=[]).push(finish);});return Promise.resolve();}}});};
window.configureClipboard('resolve');
createRoot(document.getElementById('root')).render(location.search==='?percentage'?<Percentage/>:<Mortgage variant="mortgage"/>);
`;
let browser: Browser, page: Page, script: string, errors: string[];
const ui = browserExpect.configure({ timeout: 3000 });
beforeAll(async () => {
  script = (await build({ stdin: { contents: harness, resolveDir: process.cwd(), loader: 'tsx' }, bundle: true, write: false, platform: 'browser', format: 'iife', jsx: 'automatic' })).outputFiles[0].text;
  browser = await chromium.launch();
});
beforeEach(async () => {
  page = await browser.newPage({ viewport: { width: 390, height: 844 } });errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => route.fulfill({ contentType: 'text/html', body: '<main id="root"></main>' }));
});
afterEach(async () => { await page.close();expect(errors).toEqual([]); });
afterAll(async () => { await browser?.close(); });
async function mount(percentage = false) { await page.goto(`https://calculator.test/${percentage ? '?percentage' : ''}`);await page.addScriptTag({ content: script });await ui(page.getByRole('button', { name: percentage ? 'Calculate percentage' : 'Estimate mortgage', exact: true })).toBeVisible(); }
const copy = () => page.getByRole('button', { name: /^(Copy answer|Copied)$/ });
const calculate = () => page.getByRole('button', { name: 'Estimate mortgage', exact: true });
const result = () => page.locator('.finance-result-card');
async function clipboard(mode: string) { await page.evaluate(mode => (window as any).configureClipboard(mode), mode); }

it.each([
  ['Home price ($)', '500000', '600000'], ['Down payment ($)', '70000', '60000'],
  ['Interest rate (%)', '6.1', '5.9'], ['Loan term (years)', '15', '20'],
  ['Property tax per year ($)', '6000', '7200'], ['Insurance per month ($)', '200', '250'],
  ['PMI per month ($)', '95', '100'], ['HOA per month ($)', '0', '150'],
])('Mortgage invalidates repeated %s edits and recovers only after calculation', async (label, first, second) => {
  await mount();await ui(result().locator('strong')).toHaveText('$2,637.62');
  const field = page.getByLabel(label, { exact: true });
  for (const value of [first, second]) {
    await field.fill(value);await ui(result()).toHaveCount(0);await ui(copy()).toBeDisabled();
    await ui(page.getByRole('status').filter({ hasText: 'Inputs changed' })).toBeVisible();
  }
  await calculate().click();await ui(result()).toBeVisible();await ui(copy()).toBeEnabled();
  await field.fill('');await field.press('Enter');await ui(page.getByRole('alert')).toContainText('required');
  await ui(field).toHaveAttribute('aria-invalid', 'true');await ui(field).toHaveAttribute('aria-describedby', await page.getByRole('alert').getAttribute('id') ?? 'missing');await ui(field).toBeFocused();
  await ui(result()).toHaveCount(0);await field.fill(second);await ui(copy()).toBeDisabled();
  await field.press('Enter');await ui(result()).toBeVisible();await ui(field).not.toHaveAttribute('aria-invalid', 'true');await ui(copy()).toBeEnabled();
});

it('Mortgage rejects zero price, too-large down payment and negative costs without reviving an earlier result', async () => {
  await mount();
  for (const [label, invalid, corrected] of [['Home price ($)', '0', '400000'], ['Down payment ($)', '400000', '80000'], ['Interest rate (%)', '-1', '6.5'], ['Loan term (years)', '0', '30'], ['PMI per month ($)', '-1', '0']]) {
    const field = page.getByLabel(label, { exact: true });await field.fill(invalid);await calculate().click();
    await ui(field).toBeFocused();await ui(field).toHaveAttribute('aria-invalid', 'true');await ui(result()).toHaveCount(0);await ui(copy()).toBeDisabled();
    await field.fill(corrected);await ui(page.getByRole('alert')).toHaveCount(0);await ui(copy()).toBeDisabled();await calculate().click();await ui(copy()).toBeEnabled();
  }
});

it.each(['missing', 'reject'])('Mortgage %s clipboard offers full-estimate selection and retry without a math error', async mode => {
  await mount();await clipboard(mode);await copy().click();
  await ui(page.getByRole('status')).toContainText(mode === 'missing' ? 'not available' : 'blocked');await ui(page.getByRole('alert')).toHaveCount(0);await ui(result()).toBeVisible();
  const select = page.getByRole('button', { name: 'Select estimate', exact: true });await select.focus();await page.keyboard.press('Tab');await ui(page.locator('pre')).toBeFocused();await select.focus();await page.keyboard.press('Enter');
  expect(await page.evaluate(() => getSelection()?.toString())).toContain('Loan term: 30 years');await ui(page.locator('pre')).toBeFocused();
  await clipboard('resolve');await copy().click();await ui(copy()).toHaveText('Copied');await ui(page.getByRole('status')).toHaveText('Estimate copied.');await ui(select).toHaveCount(0);
});

it.each([true, false])('Mortgage ignores delayed clipboard completion (%s) after edits', async succeeds => {
  await mount();await clipboard('pending');await copy().click();await page.getByLabel('Home price ($)', { exact: true }).fill('500000');
  await page.evaluate(ok => (window as any).clipboardMock.finish(ok), succeeds);await ui(copy()).toBeDisabled();await ui(copy()).toHaveText('Copy answer');await ui(page.getByRole('button', { name: 'Select estimate' })).toHaveCount(0);
  await calculate().click();await ui(result().locator('strong')).toHaveText('$3,269.69');
});

it.each([true, false])('Mortgage keeps the latest overlapping copy feedback (latest succeeds: %s)', async succeeds => {
  await mount();await clipboard('pending');await copy().click();await copy().click();
  expect(await page.evaluate(() => (window as any).clipboardMock.calls.length)).toBe(2);
  await page.evaluate(ok => (window as any).clipboardMock.finishes[1](ok), succeeds);
  await ui(page.getByRole('status')).toContainText(succeeds ? 'Estimate copied.' : 'Copy was blocked.');
  await page.evaluate(async ok => {
    (window as any).clipboardMock.finishes[0](ok);
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  }, !succeeds);
  await ui(copy()).toHaveText(succeeds ? 'Copied' : 'Copy answer');
  await ui(page.getByRole('status')).toContainText(succeeds ? 'Estimate copied.' : 'Copy was blocked.');
  await ui(page.getByRole('button', { name: 'Select estimate', exact: true })).toHaveCount(succeeds ? 0 : 1);
  await ui(page.getByRole('alert')).toHaveCount(0);
});

it('Mortgage exports every assumption and reconciles loan, tax, insurance, PMI and HOA costs', async () => {
  await mount();await page.getByLabel('PMI per month ($)', { exact: true }).fill('95');await calculate().click();await copy().click();
  const text = await page.evaluate(() => (window as any).clipboardMock.calls.at(-1));
  for (const item of ['Home price: $400,000.00', 'Down payment: $80,000.00', 'Loan amount: $320,000.00', 'Interest rate: 6.5%', 'Loan term: 30 years', 'Property tax: $4,800.00/year ($400.00/month)', 'Insurance: $140.00/month', 'PMI: $95.00/month', 'HOA: $75.00/month', 'Estimated total monthly payment: $2,732.62', 'Total interest over the full term: $408,142.36', 'Loan-to-value: 80%', 'not a lender quote']) expect(text).toContain(item);
  let sum = 0;
  for (const label of ['Principal and interest', 'Property tax per month', 'Insurance per month', 'PMI per month', 'HOA per month']) {
    const value = await result().locator('dl > div').filter({ has: page.getByText(label, { exact: true }) }).locator('dd').textContent();sum += Number(value?.replace(/[$,]/g, ''));
  }
  expect(sum).toBeCloseTo(2732.62, 2);
  await page.getByRole('button', { name: '15-year comparison', exact: true }).click();await ui(result().locator('strong')).toHaveText('$3,332.66');await ui(copy()).toBeEnabled();
});

it('the published 15-year example specifies the inputs needed to reproduce its stated total', () => {
  const example = getTool('mortgage-calculator')!.examples.find(item => item.label === '15-year comparison')!;
  const values = example.expression.match(/^\$([\d,]+) home, \$([\d,]+) down, ([\d.]+)%, (\d+) years, \$([\d,]+) tax\/year, \$([\d,]+) insurance\/month, \$([\d,]+) PMI, \$([\d,]+) HOA\/month$/);
  expect(values).not.toBeNull();const n = values!.slice(1).map(value => Number(value.replaceAll(',', '')));
  const estimate = calculateMortgagePayment({ homePrice: n[0], downPayment: n[1], annualRatePercent: n[2], years: n[3], annualPropertyTax: n[4], monthlyInsurance: n[5], monthlyPmi: n[6], monthlyHoa: n[7] });
  expect(estimate.totalMonthlyPayment).toBeCloseTo(3332.66, 2);expect(example.result).toContain('$3,332.66');expect(example.result).toContain('Both the rate and term differ');
});

it('Percentage Enter calculates, rejects missing operands, and preserves explicit zero', async () => {
  await mount(true);await ui(page.getByRole('form', { name: 'Percent of a number', exact: true })).toBeVisible();const percent = page.getByLabel('Percentage', { exact: true }),value = page.getByLabel('Of value', { exact: true });
  await percent.fill('18');await value.fill('240');await value.press('Enter');await ui(page.locator('.percentage-result-card strong')).toHaveText('43.2');await ui(copy()).toBeEnabled();
  await percent.fill('');await percent.press('Enter');await ui(page.getByRole('alert')).toHaveText('Percentage is required.');await ui(copy()).toBeDisabled();
  await percent.fill('0');await percent.press('Enter');await ui(page.locator('.percentage-result-card strong')).toHaveText('0');await ui(copy()).toBeEnabled();
  await page.getByRole('button').filter({ has: page.locator('strong', { hasText: 'What percent?' }) }).click();await ui(page.getByRole('form', { name: 'What percent?', exact: true })).toBeVisible();await page.getByLabel('Whole', { exact: true }).fill('0');await page.getByLabel('Whole', { exact: true }).press('Enter');await ui(page.getByRole('alert')).toHaveText('Whole value cannot be zero');
});
