import { chromium, expect as ui, type Browser, type Page } from '@playwright/test';
import { build } from 'esbuild';
import { afterAll, afterEach, beforeAll, beforeEach, expect, it } from 'vitest';

const harness = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import AskToolChat from './src/components/AskToolChat';
const state = window.askTest = { requests: [], timers: new Map(), phase: 'request' };
let nextId = -1;
const set = window.setTimeout, clear = window.clearTimeout;
window.setTimeout = (callback, ms, ...args) => {
  if (ms !== 35000) return set(callback, ms, ...args);
  const id = nextId--; state.timers.set(id, callback); return id;
};
window.clearTimeout = id => { state.timers.delete(id); clear(id); };
state.timeout = () => { for (const [id, cb] of [...state.timers]) { state.timers.delete(id); cb(); } };
window.fetch = (url, options) => new Promise(resolve => {
  const item = { signal: options.signal, resolve: body => resolve({ json: async () => body }) };
  state.requests.push(item);
  if (state.phase === 'body') resolve({ json: () => new Promise(done => { item.resolve = done; }) });
});
const root = createRoot(document.getElementById('root'));
state.unmount = () => root.unmount();
root.render(<AskToolChat />);
`;
let browser: Browser, page: Page, script: string;
let errors: string[];
beforeAll(async () => {
  script = (await build({ stdin: { contents: harness, resolveDir: process.cwd(), loader: 'tsx' },
    bundle: true, write: false, format: 'iife', platform: 'browser', jsx: 'automatic' })).outputFiles[0].text;
  browser = await chromium.launch({ headless: true });
});
beforeEach(async () => {
  page = await browser.newPage(); errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => route.abort());
  await page.setContent('<div id="root"></div>');
  await page.addScriptTag({ content: script });
});
afterEach(async () => { expect(errors).toEqual([]); await page.close(); });
afterAll(async () => { await browser?.close(); });

for (const phase of ['request', 'body']) {
  it(`recovers from stalled ${phase}, ignores late answers and accepts a retry`, async () => {
    await page.evaluate(value => { (window as any).askTest.phase = value; }, phase);
    await page.getByRole('button', { name: 'Ask Access Free Tools', exact: true }).click();
    await ui(page.getByRole('button', { name: 'Running tool...' })).toBeDisabled();
    await page.evaluate(() => (window as any).askTest.timeout());
    await ui(page.locator('.ask-result-error')).toContainText('took too long', { timeout: 1500 });
    expect(await page.evaluate(() => (window as any).askTest.requests[0].signal.aborted)).toBe(true);
    await page.getByRole('button', { name: 'Ask Access Free Tools', exact: true }).click();
    await page.evaluate(() => (window as any).askTest.requests[0].resolve({ ok: false, message: 'STALE ANSWER' }));
    await ui(page.getByRole('button', { name: 'Running tool...' })).toBeDisabled();
    await ui(page.locator('body')).not.toContainText('STALE ANSWER');
    await page.evaluate(() => (window as any).askTest.requests[1].resolve({ ok: true, answer: '43.2', tool: { name: 'Percentage Calculator' } }));
    await ui(page.locator('.ask-tool-answer')).toContainText('43.2');
    expect(await page.evaluate(() => (window as any).askTest.timers.size)).toBe(0);
  });
  it(`unmount aborts ${phase} and releases the deadline`, async () => {
    await page.evaluate(value => { (window as any).askTest.phase = value; }, phase);
    await page.getByRole('button', { name: 'Ask Access Free Tools', exact: true }).click();
    await page.evaluate(() => (window as any).askTest.unmount());
    expect(await page.evaluate(() => (window as any).askTest.requests[0].signal?.aborted)).toBe(true);
    expect(await page.evaluate(() => (window as any).askTest.timers.size)).toBe(0);
  });
}
