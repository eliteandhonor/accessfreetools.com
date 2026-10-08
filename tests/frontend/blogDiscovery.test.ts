import { readFileSync } from 'node:fs';
import { chromium, expect as ui, type Browser, type Page } from '@playwright/test';
import { build } from 'esbuild';
import { afterAll, afterEach, beforeAll, beforeEach, expect, it } from 'vitest';

const css = [readFileSync('src/styles/global.css', 'utf8'), readFileSync('src/styles/home-blog-discovery.css', 'utf8')].join('\n');
// Public metadata only, injected into an in-memory browser bundle. This is
// never written to the production catalog or paired with artwork approvals.
const syntheticDailyArticle = {
  schemaVersion: 1, slug: 'synthetic-catalog-browser-discovery',
  title: 'Synthetic catalog browser discovery fixture',
  summary: 'A synthetic text-only browser regression, never a software recommendation.',
  problem: 'Verify that browser search discovers a nonempty daily catalog without server artwork code.',
  project: { fullName: 'fixture/browser-discovery', url: 'https://github.com/fixture/browser-discovery',
    commit: 'a'.repeat(40), license: 'MIT', release: null },
  researchedAt: '2026-10-08T09:50:00.000Z', publishedAt: '2026-10-08T10:20:00.000Z',
  artwork: { articleSha256: 'c'.repeat(64) },
  sections: [{ heading: 'Synthetic source metadata', paragraphs: [{
    text: 'Only synthetic public metadata is included in this isolated browser fixture.', sourceIds: ['readme'],
  }] }],
  sources: ['readme', 'license'].map((kind) => ({ id: kind, kind,
    url: `https://github.com/fixture/browser-discovery/blob/${'a'.repeat(40)}/${kind}`,
    fetchedAt: '2026-10-08T09:40:00.000Z', sha256: 'b'.repeat(64) })),
};
const harness = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import BlogSearch from './src/components/BlogSearch';
import { getBlogSearchIndex } from './src/data/blogSearchIndex';
import { dailyEditorialArticles } from './src/data/dailyEditorialArticles';
// Keep these legacy navigation scenarios stable as researched articles grow.
// The explicit synthetic-catalog scenario includes daily text discovery.
const fixture = window.fixture;
const dailySlugs = new Set(dailyEditorialArticles.map(article => article.slug));
const index = getBlogSearchIndex();
const allPosts = fixture.includeDaily ? index : index.filter(post => !dailySlugs.has(post.slug));
fixture.dailySlugs = [...dailySlugs];
const requests = [];
fixture.requestCount = 0;
fixture.requests = requests;
window.fetch = () => new Promise((resolve, reject) => { fixture.requestCount += 1; requests.push({resolve, reject}); });
fixture.finish = ok => {
  const request = requests.shift();
  if (!ok) return request.reject(new Error('Synthetic search index failure'));
  request.resolve({ ok: true, json: async () => ({ posts: allPosts }) });
};
createRoot(document.getElementById('root')).render(<main className='task-first-blog'>
  <BlogSearch posts={fixture.loaded ? allPosts : allPosts.slice(0,12)} searchIndexUrl='/blog-search-index.json' totalPostCount={allPosts.length} />
  <button id='outside'>Outside target</button>
</main>);
`;
let browser: Browser;
let page: Page;
let script: string;
let errors: string[];
beforeAll(async () => {
  script = (await build({ stdin: { contents: harness, resolveDir: process.cwd(), loader: 'tsx' },
    bundle: true, write: false, format: 'iife', platform: 'browser', jsx: 'automatic', loader: { '.css': 'empty' } })).outputFiles[0].text;
  browser = await chromium.launch({ headless: true });
});
beforeEach(async () => {
  errors = [];
  page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.setDefaultTimeout(3000);
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => route.request().isNavigationRequest()
    ? route.fulfill({ contentType: 'text/html', body: '<div id="root"></div>' }) : route.abort());
});
afterEach(async () => { await page.close(); expect(errors).toEqual([]); });
afterAll(async () => { await browser?.close(); });
const links = () => page.locator('.blog-post-card h3 a');
const search = () => page.getByLabel('Search guides');
const reveal = () => page.getByRole('button', { name: /^Show 12 more posts/ });
async function mount(loaded = true, path = '/blog/', options: { includeDaily?: boolean; script?: string } = {}) {
  await page.goto(`https://blog-discovery.invalid${path}`);
  await page.evaluate(value => { (window as any).fixture = value; }, { loaded, includeDaily: options.includeDaily ?? false });
  await page.addStyleTag({ content: css });
  await page.addScriptTag({ content: options.script ?? script });
  await ui(search()).toBeVisible();
}
async function finish(ok: boolean) {
  await ui.poll(() => page.evaluate(() => (window as any).fixture.requests.length)).toBeGreaterThan(0);
  await page.evaluate(value => (window as any).fixture.finish(value), ok);
}

it('compiles and discovers synthetic daily text in the real browser without server artwork imports', async () => {
  const compiled = await build({ stdin: { contents: harness, resolveDir: process.cwd(), loader: 'tsx' },
    bundle: true, write: false, metafile: true, format: 'iife', platform: 'browser', jsx: 'automatic',
    loader: { '.css': 'empty' }, plugins: [{ name: 'synthetic-daily-catalog-only', setup(builder) {
      builder.onLoad({ filter: /dailyEditorialArticles\.json$/ }, () => ({
        contents: JSON.stringify([syntheticDailyArticle]), loader: 'json',
      }));
    } }],
  });
  const inputs = Object.keys(compiled.metafile!.inputs);
  expect(inputs.some((input) => input.endsWith('dailyEditorialArticles.json'))).toBe(true);
  expect(inputs.some((input) => /(?:dailyEditorialArtwork|editorialArticleImages|dailyEditorialArtApprovals|daily-editorial-artwork)\./.test(input))).toBe(false);
  await mount(true, '/blog/', { includeDaily: true, script: compiled.outputFiles[0].text });
  expect(await page.evaluate(() => (window as any).fixture.dailySlugs)).toEqual([syntheticDailyArticle.slug]);
  await ui(links().filter({ hasText: syntheticDailyArticle.title })).toHaveAttribute('href', `/blog/${syntheticDailyArticle.slug}/`);
  await search().fill('synthetic catalog browser');
  await ui(links()).toHaveCount(1);
  await ui(links()).toHaveText(syntheticDailyArticle.title);
  await ui(page.getByRole('link', { name: 'Read article', exact: true })).toHaveAttribute('href', `/blog/${syntheticDailyArticle.slug}/`);
  await ui(page.getByText(syntheticDailyArticle.summary)).toBeVisible();
  await ui(page.locator('.blog-search-count')).toHaveText('Showing 1 of 1 post.');
  expect(await page.evaluate(() => (window as any).fixture.requestCount)).toBe(0);
  await ui(page.locator('img[src*="/social/daily-"]')).toHaveCount(0);
});

it('all seven editorial routes are in the initial manageable set and native GET search remains available', async () => {
  await mount();
  await ui(links()).toHaveCount(12);
  await ui(page.locator('form[role="search"]')).toHaveAttribute('action', '/blog/');
  await ui(page.locator('form[role="search"]')).toHaveAttribute('method', 'get');
  await ui(search()).toHaveAttribute('name', 'q');
  await ui(page.getByRole('button', { name: 'Search', exact: true })).toBeVisible();
  await ui(links().filter({ hasText: '8 Open-Source Projects' })).toHaveAttribute('href', '/blog/open-source-projects-behind-access-free-tools/');
  await ui(links().filter({ hasText: 'Browser AI vs Local AI' })).toHaveAttribute('href', '/blog/browser-ai-vs-local-ai-privacy/');
  await ui(page.locator('.blog-search-count')).toHaveText('Showing 12 of 312 posts.');
});

it('one typing session, progressive reveal, reset, and Back/Forward restore authoritative URL state', async () => {
  await mount(true, '/blog/?utm_source=qa#search');
  await page.evaluate(() => history.replaceState({ caller: 'blog-regression' }, '', location.href));
  const initialLength = await page.evaluate(() => history.length);
  await search().fill('calculator');
  await search().fill('calculator guide');
  expect(await page.evaluate(() => history.length)).toBe(initialLength + 1);
  await reveal().click();
  await ui(links()).toHaveCount(24);
  expect(new URL(page.url()).searchParams.get('limit')).toBe('24');
  await page.goBack();
  await ui(search()).toHaveValue('calculator guide');
  await ui(links()).toHaveCount(12);
  await page.goForward();
  await ui(links()).toHaveCount(24);
  await page.getByRole('button', { name: 'Reset search' }).click();
  await ui(search()).toHaveValue('');
  await ui(links()).toHaveCount(12);
  await page.goBack();
  await ui(search()).toHaveValue('calculator guide');
  await ui(links()).toHaveCount(24);
  expect(new URL(page.url()).searchParams.get('utm_source')).toBe('qa');
  expect(new URL(page.url()).hash).toBe('#search');
  expect(await page.evaluate(() => history.state.caller)).toBe('blog-regression');
});

it('erasing a focused query preserves the preceding search for Back and the empty state for Forward', async () => {
  await mount();
  await search().fill('browser local privacy');
  await ui(search()).toBeFocused();
  await ui(links()).toHaveCount(1);
  await ui(links()).toHaveAttribute('href', '/blog/browser-ai-vs-local-ai-privacy/');
  await search().fill('');
  await ui(search()).toBeFocused();
  await ui(links()).toHaveCount(12);
  expect(new URL(page.url()).searchParams.has('q')).toBe(false);
  await page.goBack();
  expect(new URL(page.url()).searchParams.get('q')).toBe('browser local privacy');
  await ui(search()).toHaveValue('browser local privacy');
  await ui(links()).toHaveCount(1);
  await ui(links()).toHaveAttribute('href', '/blog/browser-ai-vs-local-ai-privacy/');
  await page.goForward();
  await ui(search()).toHaveValue('');
  await ui(links()).toHaveCount(12);
  expect(new URL(page.url()).searchParams.has('q')).toBe(false);
});

it('sequential Backspace preserves the last focused character query and its results for Back/Forward', async () => {
  await mount(true, '/blog/?utm_source=qa#search');
  await page.evaluate(() => history.replaceState({ caller: 'blog-sequential-backspace' }, '', location.href));
  const query = 'privacy';
  await search().fill(query);
  await ui(links().filter({ hasText: 'Browser AI vs Local AI' })).toHaveAttribute('href', '/blog/browser-ai-vs-local-ai-privacy/');
  await search().press('End');
  for (let remaining = query.length - 1; remaining > 0; remaining -= 1) {
    await search().press('Backspace');
    await ui(search()).toHaveValue(query.slice(0, remaining));
    await ui(search()).toBeFocused();
  }
  expect(new URL(page.url()).searchParams.get('q')).toBe('p');
  // Single-character search matches exact words; the P-value title outranks prose matches.
  await ui(links().first()).toHaveAttribute('href', '/blog/how-to-use-p-value-calculator/');
  const lastQueryHrefs = await links().evaluateAll(items => items.map(link => link.getAttribute('href')));
  await search().press('Backspace');
  await ui(search()).toHaveValue('');
  await ui(search()).toBeFocused();
  await ui(links()).toHaveCount(12);
  expect(new URL(page.url()).searchParams.has('q')).toBe(false);
  await page.goBack();
  expect(new URL(page.url()).searchParams.get('q')).toBe('p');
  await ui(search()).toHaveValue('p');
  await ui.poll(() => links().evaluateAll(items => items.map(link => link.getAttribute('href')))).toEqual(lastQueryHrefs);
  expect(new URL(page.url()).searchParams.get('utm_source')).toBe('qa');
  expect(new URL(page.url()).hash).toBe('#search');
  expect(await page.evaluate(() => history.state.caller)).toBe('blog-sequential-backspace');
  await page.goForward();
  await ui(search()).toHaveValue('');
  await ui(links()).toHaveCount(12);
  expect(new URL(page.url()).searchParams.has('q')).toBe(false);
  expect(new URL(page.url()).searchParams.get('utm_source')).toBe('qa');
  expect(new URL(page.url()).hash).toBe('#search');
  expect(await page.evaluate(() => history.state.caller)).toBe('blog-sequential-backspace');
});

it.each([
  { label: 'empty', value: '' },
  { label: 'whitespace-only', value: '   ' },
])('retyping after a focused $label clear preserves the empty state and prior query', async ({ value }) => {
  await mount();
  await search().fill('calculator');
  await ui(search()).toBeFocused();
  await ui(links()).toHaveCount(12);
  await search().fill(value);
  await ui(search()).toBeFocused();
  await ui(links()).toHaveCount(12);
  expect(new URL(page.url()).searchParams.has('q')).toBe(false);
  await search().fill('browser local privacy');
  await ui(search()).toBeFocused();
  await ui(links()).toHaveCount(1);
  await ui(links()).toHaveAttribute('href', '/blog/browser-ai-vs-local-ai-privacy/');
  await page.goBack();
  expect(new URL(page.url()).searchParams.has('q')).toBe(false);
  await ui(search()).toHaveValue('');
  await ui(links()).toHaveCount(12);
  expect(new URL(page.url()).searchParams.has('q')).toBe(false);
  await page.goBack();
  expect(new URL(page.url()).searchParams.get('q')).toBe('calculator');
  await ui(search()).toHaveValue('calculator');
  await ui(links()).toHaveCount(12);
  await page.goForward();
  await ui(search()).toHaveValue('');
  await ui(links()).toHaveCount(12);
  await page.goForward();
  await ui(search()).toHaveValue('browser local privacy');
  await ui(links()).toHaveCount(1);
  await ui(links()).toHaveAttribute('href', '/blog/browser-ai-vs-local-ai-privacy/');
});

it('focused query erasure retains the edited search and initial query limit with caller URL state', async () => {
  await mount(true, '/blog/?q=calculator&limit=24&utm_source=qa#search');
  await page.evaluate(() => history.replaceState({ caller: 'blog-erasure-regression' }, '', location.href));
  await ui(search()).toHaveValue('calculator');
  await ui(links()).toHaveCount(24);
  await search().fill('calculator guide');
  await ui(search()).toBeFocused();
  await ui(links()).toHaveCount(12);
  await search().fill('');
  await ui(search()).toBeFocused();
  await ui(links()).toHaveCount(12);
  await page.goBack();
  expect(new URL(page.url()).searchParams.get('q')).toBe('calculator guide');
  await ui(search()).toHaveValue('calculator guide');
  await ui(links()).toHaveCount(12);
  expect(new URL(page.url()).searchParams.has('limit')).toBe(false);
  await page.goBack();
  expect(new URL(page.url()).searchParams.get('q')).toBe('calculator');
  await ui(search()).toHaveValue('calculator');
  await ui(links()).toHaveCount(24);
  expect(new URL(page.url()).searchParams.get('limit')).toBe('24');
  expect(new URL(page.url()).searchParams.get('utm_source')).toBe('qa');
  expect(new URL(page.url()).hash).toBe('#search');
  expect(await page.evaluate(() => history.state.caller)).toBe('blog-erasure-regression');
  await page.goForward();
  await ui(search()).toHaveValue('calculator guide');
  await ui(links()).toHaveCount(12);
  await page.goForward();
  await ui(search()).toHaveValue('');
  await ui(links()).toHaveCount(12);
  expect(new URL(page.url()).searchParams.has('q')).toBe(false);
  expect(new URL(page.url()).searchParams.has('limit')).toBe(false);
  expect(new URL(page.url()).searchParams.get('utm_source')).toBe('qa');
  expect(new URL(page.url()).hash).toBe('#search');
  expect(await page.evaluate(() => history.state.caller)).toBe('blog-erasure-regression');
});

it('trailing whitespace in an initial query does not consume the next meaningful typing session', async () => {
  await mount(true, '/blog/?q=calculator');
  await ui(search()).toHaveValue('calculator');
  await ui(links()).toHaveCount(12);
  const initialLength = await page.evaluate(() => history.length);
  await search().fill('calculator ');
  await ui(search()).toBeFocused();
  await ui(links()).toHaveCount(12);
  expect(new URL(page.url()).searchParams.get('q')).toBe('calculator');
  expect(await page.evaluate(() => history.length)).toBe(initialLength);
  await search().fill('browser local privacy');
  await ui(search()).toBeFocused();
  await ui(links()).toHaveCount(1);
  await ui(links()).toHaveAttribute('href', '/blog/browser-ai-vs-local-ai-privacy/');
  expect(await page.evaluate(() => history.length)).toBe(initialLength + 1);
  await page.goBack();
  expect(new URL(page.url()).searchParams.get('q')).toBe('calculator');
  await ui(search()).toHaveValue('calculator');
  await ui(links()).toHaveCount(12);
  await page.goForward();
  await ui(search()).toHaveValue('browser local privacy');
  await ui(links()).toHaveCount(1);
  await ui(links()).toHaveAttribute('href', '/blog/browser-ai-vs-local-ai-privacy/');
});

it('whitespace in an empty query preserves the empty baseline before a meaningful search', async () => {
  await mount();
  const initialLength = await page.evaluate(() => history.length);
  await search().fill('   ');
  await ui(search()).toBeFocused();
  await ui(links()).toHaveCount(12);
  expect(new URL(page.url()).searchParams.has('q')).toBe(false);
  expect(await page.evaluate(() => history.length)).toBe(initialLength);
  await search().fill('browser local privacy');
  await ui(search()).toBeFocused();
  await ui(links()).toHaveCount(1);
  await ui(links()).toHaveAttribute('href', '/blog/browser-ai-vs-local-ai-privacy/');
  expect(await page.evaluate(() => history.length)).toBe(initialLength + 1);
  await page.goBack();
  expect(new URL(page.url()).searchParams.has('q')).toBe(false);
  await ui(search()).toHaveValue('');
  await ui(links()).toHaveCount(12);
  expect(new URL(page.url()).searchParams.has('q')).toBe(false);
  await page.goForward();
  await ui(search()).toHaveValue('browser local privacy');
  await ui(links()).toHaveCount(1);
  await ui(links()).toHaveAttribute('href', '/blog/browser-ai-vs-local-ai-privacy/');
});

it('multiword editorial discovery is accurate and an empty completed search can be reset', async () => {
  await mount();
  await search().fill('browser local privacy');
  await ui(links()).toHaveCount(1);
  await ui(links()).toHaveAttribute('href', '/blog/browser-ai-vs-local-ai-privacy/');
  await search().fill('unfindable-example-task');
  await ui(page.getByRole('heading', { name: 'No matching guides' })).toBeVisible();
  await ui(links()).toHaveCount(0);
  await page.getByRole('button', { name: 'Reset search' }).click();
  await ui(page.getByRole('heading', { name: 'No matching guides' })).toHaveCount(0);
  await ui(links()).toHaveCount(12);
});

it('partial search stays undecided after a failure and explicit retry reveals a late guide', async () => {
  await mount(false, '/blog/?q=mortgage&utm_source=qa');
  await ui(search()).toHaveValue('mortgage');
  await ui(page.getByRole('heading', { name: 'No matching guides' })).toHaveCount(0);
  await finish(false);
  const retry = page.getByRole('button', { name: 'Retry full search' });
  await ui(retry).toBeVisible();
  await ui(page.getByRole('heading', { name: 'No matching guides' })).toHaveCount(0);
  await retry.click();
  await finish(true);
  await ui(links().filter({ hasText: 'Mortgage Calculator Guide' })).not.toHaveCount(0);
  await ui(retry).toHaveCount(0);
  expect(await page.evaluate(() => (window as any).fixture.requestCount)).toBe(2);
});

it('keyboard reveal waits for the full index, focuses the first new post, and advances to its read link', async () => {
  await mount(false);
  const oldLinks = new Set(await links().evaluateAll(items => items.map(link => link.getAttribute('href'))));
  await reveal().focus();
  await page.keyboard.press('Enter');
  await ui(reveal()).toBeFocused();
  await ui(links()).toHaveCount(12);
  await finish(true);
  await ui(links()).toHaveCount(24);
  const focusedHref = await page.locator(':focus').getAttribute('href');
  expect(oldLinks.has(focusedHref)).toBe(false);
  expect(focusedHref).toBeTruthy();
  await page.keyboard.press('Tab');
  await ui(page.locator(':focus')).toHaveClass('card-link');
  await ui(page.locator(':focus')).toHaveAttribute('href', focusedHref!);
});

it('Back during a pending reveal cancels its focus transfer; pageshow restores a saved query', async () => {
  await mount(false);
  await reveal().focus();
  await page.keyboard.press('Space');
  await page.goBack();
  await ui.poll(() => new URL(page.url()).searchParams.has('limit')).toBe(false);
  await finish(true);
  await ui(links()).toHaveCount(12);
  expect(await links().evaluateAll(items => items.some(link => link === document.activeElement))).toBe(false);
  await page.evaluate(() => {
    history.replaceState(history.state, '', '/blog/?q=browser+local+privacy&limit=24');
    const input = document.querySelector<HTMLInputElement>('#blog-guide-search')!;
    input.value = 'stale restored form value';
    window.dispatchEvent(new Event('pageshow'));
  });
  await ui(search()).toHaveValue('browser local privacy');
  await ui(links()).toHaveCount(1);
});
