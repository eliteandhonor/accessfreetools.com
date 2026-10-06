import { mkdirSync, readFileSync } from 'node:fs';
import { chromium, expect as ui, type Browser, type Page } from '@playwright/test';
import { build } from 'esbuild';
import { afterAll, afterEach, beforeAll, beforeEach, expect, it } from 'vitest';

const css = ['global.css', 'tool-discovery.css', 'home-blog-discovery.css']
  .map(file => readFileSync(`src/styles/${file}`, 'utf8')).join('\n');
const gallerySource = readFileSync('src/pages/gallery/[category].astro', 'utf8');
const galleryScript = [...gallerySource.matchAll(/<script is:inline>([\s\S]*?)<\/script>/g)][0][1];
const harness = `
import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import ToolsLaunchpad from './src/components/ToolsLaunchpad';
import BlogSearch from './src/components/BlogSearch';
import ThemePicker from './src/components/ThemePicker';
import { categories } from './src/data/categories';
const settings = window.fixture;
const tools = Array.from({ length: 84 }, (_, index) => ({ slug: 'fixture-' + index,
  name: 'Fixture tool ' + index, summary: 'A practical calculator for everyday tasks.',
  icon: 'wrench', category: categories[index % categories.length].slug,
  searchText: 'fixture ' + index + (index === 2 ? ' word count' : index === 83 ? ' CIDR subnet mask' : '') }));
const posts = tools.map((tool, index) => ({ ...tool, searchText: 'fixture ' + index, title: tool.name, label: 'Guide' }));
const counts = Object.fromEntries(categories.map(category => [category.slug, tools.filter(tool => tool.category === category.slug).length]));
const pending = [];
settings.requestCount = 0;
window.fetch = () => new Promise((resolve, reject) => {
  settings.requestCount += 1;
  pending.push({ resolve, reject });
});
settings.requests = pending;
settings.finish = (ok, reverse = false) => {
  const request = pending.shift();
  if (!ok) return request.reject(new Error('Synthetic index failure'));
  request.resolve({ ok: true, json: async () => ({ tools: reverse ? [...tools].reverse() : tools, posts: reverse ? [...posts].reverse() : posts }) });
};
settings.categories = categories.map(item => item.slug);
const nav = ['Tools', 'Ask Tools', 'Categories', 'Hubs', 'Resources', 'Math', 'Finance', 'Health', 'AI', 'Blog'];
const content = <><header className="site-header"><a className="brand" href="/"><span className="brand-mark" /><span>Access Free Tools</span></a>
  <nav className="site-nav" aria-label="Main navigation">{nav.map(label => <a key={label} href="/">{label}</a>)}</nav><ThemePicker /></header>
  <main>{settings.kind === 'tools' ? <ToolsLaunchpad categories={categories} categoryCounts={counts} tools={tools.slice(0, settings.loaded ? 84 : 12)} totalToolCount={84} searchIndexUrl="/fixture-index.json" />
  : settings.kind === 'blog' ? <BlogSearch posts={posts.slice(0, settings.loaded ? 84 : 12)} totalPostCount={84} searchIndexUrl="/fixture-index.json" /> : null}</main>
  <button id="outside">Outside target</button></>;
const element = document.getElementById('root');
if (settings.restored) {
  // Exercise restored DOM fields; coordinator built-page checks cover actual Astro SSR.
  element.innerHTML = renderToString(content);
  element.querySelector('#tool-library-search').value = settings.restored.query;
  element.querySelector('#tool-category').value = settings.restored.category;
  hydrateRoot(element, content);
} else createRoot(element).render(content);
`;

let browser: Browser, page: Page, script: string;
let errors: string[];
beforeAll(async () => {
  mkdirSync('output/project-review-followup/UX-02', { recursive: true });
  script = (await build({ stdin: { contents: harness, resolveDir: process.cwd(), loader: 'tsx' },
    bundle: true, write: false, format: 'iife', platform: 'browser', jsx: 'automatic', loader: { '.css': 'empty' } })).outputFiles[0].text;
  browser = await chromium.launch({ headless: true });
});
beforeEach(async () => {
  errors = [];
  page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
  page.setDefaultTimeout(1800);
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => route.request().isNavigationRequest()
    ? route.fulfill({ contentType: 'text/html', body: '<div id="root"></div>' }) : route.abort());
});
afterEach(async () => { await page.close(); expect(errors).toEqual([]); });
afterAll(async () => { await browser?.close(); });

async function mount(kind = 'tools', loaded = true, width = 1365, path = '/', restored?: { query: string; category: string }) {
  await page.setViewportSize({ width, height: width === 768 ? 1024 : width <= 390 ? 844 : 900 });
  await page.goto(`https://discovery.invalid${path}`);
  await page.evaluate(value => { (window as any).fixture = value; }, { kind, loaded, restored });
  await page.addStyleTag({ content: css });
  await page.addScriptTag({ content: script });
  await ui(page.locator('.theme-picker-trigger')).toBeVisible();
}
const card = (kind: string) => kind === 'tools' ? '.launchpad-tool-card' : '.blog-post-card h3 a';
const firstNew = (_kind: string) => 12;
const revealButton = (_kind: string) => page.locator('button.launchpad-show-more');
async function expectPendingRevealFocus() {
  await ui.poll(() => page.evaluate(() => document.activeElement === document.body
    || document.activeElement === document.querySelector('button.launchpad-show-more'))).toBe(true);
}
async function finish(ok: boolean, reverse = false) {
  await ui.poll(() => page.evaluate(() => (window as any).fixture.requests.length)).toBeGreaterThan(0);
  await page.evaluate(({ ok, reverse }) => (window as any).fixture.finish(ok, reverse), { ok, reverse });
}

for (const kind of ['tools', 'blog']) {
  for (const width of [390, 768, 1365]) for (const key of ['Enter', 'Space']) {
    it(`${kind} ${width}: ${key} reveal focuses the first new item and continues logically`, async () => {
      await mount(kind, true, width);
      const reveal = revealButton(kind);
      await reveal.focus(); await page.keyboard.press(key);
      await ui(page.locator(card(kind)).nth(firstNew(kind))).toBeFocused({ timeout: 1200 });
      await page.keyboard.press('Tab');
      await ui(kind === 'tools' ? page.locator(card(kind)).nth(13) : page.locator('.blog-post-card').nth(12).locator('.card-link')).toBeFocused();
    });
  }
  it(`${kind}: delayed load preserves focus until success, including reordered new items`, async () => {
    await mount(kind, false);
    const reveal = revealButton(kind);
    await reveal.focus(); await page.keyboard.press('Enter');
    await expectPendingRevealFocus();
    await finish(true, true);
    await ui(page.locator(card(kind)).first()).toBeFocused({ timeout: 1200 });
    expect(await page.locator(card(kind)).first().getAttribute('href')).toContain('fixture-83/');
  });
  it(`${kind}: failed load keeps a retry target and retry transfers focus`, async () => {
    await mount(kind, false);
    const reveal = revealButton(kind);
    await reveal.focus(); await page.keyboard.press('Space'); await finish(false);
    await ui(page.locator(kind === 'tools' ? '.launchpad-status-note' : '.blog-search-retry')).toBeVisible();
    await ui(reveal).toBeEnabled(); await ui(reveal).toBeFocused();
    await page.keyboard.press('Enter'); await finish(true);
    await ui(page.locator(card(kind)).nth(firstNew(kind))).toBeFocused({ timeout: 1200 });
  });
  it(`${kind}: pending reveal does not steal focus after the user leaves`, async () => {
    await mount(kind, false);
    await revealButton(kind).focus(); await page.keyboard.press('Enter');
    await page.locator('#outside').focus(); await finish(true);
    await ui(page.locator(card(kind))).toHaveCount(24);
    await ui(page.locator('#outside')).toBeFocused();
  });
}

for (const label of ['Fresh', 'Coral']) for (const key of ['Enter', 'Space']) {
  it(`theme ${label}: ${key} selection restores the current-look trigger and persists`, async () => {
    await mount('theme');
    const trigger = page.locator('.theme-picker-trigger');
    await trigger.focus(); await page.keyboard.press('Enter');
    await page.getByRole('button', { name: `Use ${label} look` }).focus(); await page.keyboard.press(key);
    await ui(trigger).toBeFocused({ timeout: 1200 });
    await ui(trigger).toHaveAttribute('aria-expanded', 'false');
    await ui(trigger).toHaveAttribute('aria-label', `Choose website look. Current look: ${label}`);
    expect(await page.evaluate(() => localStorage.getItem('access-tools-theme'))).toBe(label.toLowerCase());
    await page.reload();
    await page.evaluate(() => { (window as any).fixture = { kind: 'theme', loaded: true }; });
    await page.addScriptTag({ content: script });
    await ui(trigger).toHaveAttribute('aria-label', `Choose website look. Current look: ${label}`);
  });
}
it('theme Escape restores focus; outside pointer dismissal still focuses the outside target', async () => {
  await mount('theme');
  const trigger = page.locator('.theme-picker-trigger');
  await trigger.click(); await page.getByRole('button', { name: 'Use Coral look' }).focus();
  await page.keyboard.press('Escape'); await ui(trigger).toBeFocused();
  await trigger.click(); await page.locator('#outside').click();
  await ui(page.locator('#outside')).toBeFocused(); await ui(trigger).toHaveAttribute('aria-expanded', 'false');
});

async function gallery(hash = '') {
  await page.goto(`https://discovery.invalid/${hash}`);
  await page.setContent(`<div data-gallery-grid id="fixture-gallery" data-gallery-limit="24">${Array.from({ length: 28 }, (_, i) =>
    `<a data-gallery-item id="image-${i}" href="/tools/item-${i}/">Image ${i}</a>`).join('')}</div>
    <button data-gallery-reveal="fixture-gallery" aria-expanded="false" hidden>Show all images</button><span data-gallery-status="fixture-gallery" role="status"></span>`);
  await page.addScriptTag({ content: galleryScript });
}
for (const width of [390, 768, 1365]) for (const key of ['Enter', 'Space']) it(`gallery ${width}: ${key} reveal continues into first new image`, async () => {
  await page.setViewportSize({ width, height: 900 });
  await gallery(); await page.getByRole('button').focus(); await page.keyboard.press(key);
  await ui(page.locator('#image-24')).toBeFocused({ timeout: 1200 });
  await page.keyboard.press('Tab'); await ui(page.locator('#image-25')).toBeFocused();
  await ui(page.getByRole('status')).toHaveText('All 28 images are now shown.');
});
it('a direct hash to an initially hidden gallery image keeps the target visible', async () => {
  await gallery('#image-27'); await ui(page.locator('#image-27')).toBeVisible();
  await ui(page.getByRole('button', { includeHidden: true })).toBeHidden();
  expect(await page.locator('[data-gallery-item][hidden]').count()).toBe(0);
});

for (const width of [320, 390, 768, 980, 1081, 1365]) it(`discovery layout ${width}: compact categories, reachable results, no overflow`, async () => {
  await mount('tools', true, width);
  await page.screenshot({ path: `output/project-review-followup/UX-02/mounted-tools-default-${width}.png` });
  const select = page.getByRole('combobox', { name: 'Tool category' });
  await ui(select).toHaveCount(1);
  await ui(select).toBeVisible({ timeout: 1200 });
  const expected = await page.evaluate(() => ['all', ...(window as any).fixture.categories]);
  expect(await select.locator('option').evaluateAll(options => options.map(option => (option as HTMLOptionElement).value))).toEqual(expected);
  await ui(page.locator('.category-rail')).toHaveCount(0);
  await ui(page.locator('.launchpad-filter-row')).toHaveCount(0);
  if (width <= 980) {
    if (width === 768) expect((await page.locator(card('tools')).first().boundingBox())!.y).toBeLessThan(1000);
    await select.focus(); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter');
    expect(await select.inputValue()).not.toBe('all');
    await select.selectOption('all');
    await page.locator('#tool-library-search').fill('fixture 83');
    await ui(page.locator(card('tools'))).toHaveCount(1);
    expect((await page.locator(card('tools')).first().boundingBox())!.y).toBeLessThan(page.viewportSize()!.height);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `output/project-review-followup/UX-02/mounted-tools-${width}.png` });
});

for (const kind of ['tools', 'blog']) for (const width of [390, 768, 1365]) it(`${kind} ${width}: search focus has a stable visible wrapper ring in every theme`, async () => {
  await mount(kind, true, width);
  const wrapper = page.locator(kind === 'tools' ? '.tool-command-bar' : '.blog-search-bar');
  const input = wrapper.locator('input');
  const bounds = () => wrapper.evaluate(element => {
    const rect = element.getBoundingClientRect();
    return { x: rect.x + scrollX, y: rect.y + scrollY, width: rect.width, height: rect.height };
  });
  for (const theme of ['fresh', 'coral', 'violet', 'lagoon', 'bloom', 'sunrise', 'forest', 'slate', 'orchid', 'mono']) {
    await page.evaluate(theme => { document.documentElement.dataset.theme = theme; }, theme);
    await page.locator('#outside').focus(); const before = await bounds();
    await input.focus();
    const focus = await wrapper.evaluate(element => ({ outline: getComputedStyle(element).outlineStyle, width: getComputedStyle(element).outlineWidth }));
    expect(focus.outline).not.toBe('none'); expect(parseFloat(focus.width)).toBeGreaterThanOrEqual(2);
    expect(await bounds()).toEqual(before);
  }
  await page.screenshot({ path: `output/project-review-followup/UX-02/mounted-${kind}-focus-${width}.png` });
});

it('Ctrl+K still enters tool search and query changes keep URL state', async () => {
  await mount(); await page.locator('.theme-picker-trigger').focus(); await page.keyboard.press('Control+k');
  await ui(page.locator('#tool-library-search')).toBeFocused();
  await page.locator('#tool-library-search').fill('fixture 83');
  expect(new URL(page.url()).searchParams.get('q')).toBe('fixture 83');
  await page.locator('#tool-library-search').fill(''); expect(new URL(page.url()).search).toBe('');
});

it('tools: a direct filtered URL restores inputs while full-index results remain undecided', async () => {
  await mount('tools', false, 390, '/tools/?q=FiXtUrE+83&category=everyday-tools&limit=24&utm_source=qa#results');
  const search = page.getByLabel('Search tools');
  const category = page.getByRole('combobox', { name: 'Tool category' });
  await ui(search).toHaveValue('FiXtUrE 83');
  await ui(category).toHaveValue('everyday-tools');
  await ui(page.getByRole('heading', { name: 'No matching tools' })).toHaveCount(0);
  await ui.poll(() => page.evaluate(() => (window as any).fixture.requestCount)).toBe(1);
  await finish(true);
  await ui(page.locator(card('tools'))).toHaveCount(1);
  await ui(page.locator(card('tools'))).toHaveAttribute('href', '/tools/fixture-83/');
  expect(new URL(page.url()).searchParams.get('utm_source')).toBe('qa');
  expect(new URL(page.url()).hash).toBe('#results');
  expect(await search.evaluate(input => input === document.activeElement)).toBe(false);
});

it('tools: invalid URL filters fall back to the initial library without an eager index request', async () => {
  await mount('tools', false, 1365, '/tools/?category=unknown-category&limit=-40&utm_source=qa');
  await ui(page.getByRole('combobox', { name: 'Tool category' })).toHaveValue('all');
  await ui(page.getByLabel('Search tools')).toHaveValue('');
  await ui(page.locator(card('tools'))).toHaveCount(12);
  expect(await page.evaluate(() => (window as any).fixture.requestCount)).toBe(0);
});

it('tools: one typing session creates one history entry and category Back/Forward restores both controls', async () => {
  await mount('tools', true, 1365, '/tools/?utm_source=qa#results');
  await page.evaluate(() => history.replaceState({ caller: 'discovery-regression' }, '', location.href));
  const initialHistoryLength = await page.evaluate(() => history.length);
  const search = page.getByLabel('Search tools');
  const category = page.getByRole('combobox', { name: 'Tool category' });
  await search.fill('fixture');
  await search.fill('fixture 8');
  await search.fill('fixture 83');
  expect(await page.evaluate(() => history.length)).toBe(initialHistoryLength + 1);
  await category.selectOption('everyday-tools');
  expect(new URL(page.url()).searchParams.get('category')).toBe('everyday-tools');
  expect(await page.evaluate(() => history.length)).toBe(initialHistoryLength + 2);
  await page.goBack();
  await ui(search).toHaveValue('fixture 83');
  await ui(category).toHaveValue('all');
  await ui(page.locator(card('tools'))).toHaveCount(1);
  await page.goForward();
  await ui(category).toHaveValue('everyday-tools');
  await ui(search).toHaveValue('fixture 83');
  expect(new URL(page.url()).searchParams.get('utm_source')).toBe('qa');
  expect(new URL(page.url()).hash).toBe('#results');
  expect(await page.evaluate(() => history.state.caller)).toBe('discovery-regression');
  await search.fill('fixture 82');
  await page.locator('#outside').focus();
  await search.fill('fixture 81');
  expect(await page.evaluate(() => history.length)).toBe(initialHistoryLength + 4);
  await page.goBack();
  await ui(search).toHaveValue('fixture 82');
});

it('tools: incremental reveal survives Back/Forward and a new search resets its limit', async () => {
  await mount('tools');
  await ui(page.locator(card('tools'))).toHaveCount(12);
  await revealButton('tools').click();
  await ui(page.locator(card('tools'))).toHaveCount(24);
  await revealButton('tools').click();
  await ui(page.locator(card('tools'))).toHaveCount(36);
  expect(new URL(page.url()).searchParams.get('limit')).toBe('36');
  await page.goBack();
  await ui(page.locator(card('tools'))).toHaveCount(24);
  await page.goForward();
  await ui(page.locator(card('tools'))).toHaveCount(36);
  await page.getByLabel('Search tools').fill('fixture');
  await ui(page.locator(card('tools'))).toHaveCount(12);
  expect(new URL(page.url()).searchParams.has('limit')).toBe(false);
});

it('tools: remounting a saved URL restores query and reveal limit', async () => {
  await mount('tools');
  await page.getByLabel('Search tools').fill('fixture');
  await revealButton('tools').click();
  const savedUrl = new URL(page.url());
  await mount('tools', false, 390, `${savedUrl.pathname}${savedUrl.search}${savedUrl.hash}`);
  await ui(page.getByLabel('Search tools')).toHaveValue('fixture');
  await finish(true);
  await ui(page.locator(card('tools'))).toHaveCount(24);
  expect(new URL(page.url()).searchParams.get('limit')).toBe('24');
});

it('tools: uncontrolled hydrated fields retain browser-restored input when the URL has no filters', async () => {
  await mount('tools', false, 390, '/tools/', { query: 'fixture 83', category: 'everyday-tools' });
  await ui(page.getByLabel('Search tools')).toHaveValue('fixture 83');
  await ui(page.getByRole('combobox', { name: 'Tool category' })).toHaveValue('everyday-tools');
  await finish(true);
  await ui(page.locator(card('tools'))).toHaveCount(1);
  await ui(page.locator(card('tools'))).toHaveAttribute('href', '/tools/fixture-83/');
  expect(new URL(page.url()).searchParams.get('q')).toBe('fixture 83');
  expect(new URL(page.url()).searchParams.get('category')).toBe('everyday-tools');
});

it('tools: explicit URL filters override stale browser-restored fields during hydration', async () => {
  await mount('tools', false, 390, '/tools/?q=fixture+82&category=school-study', { query: 'fixture 83', category: 'everyday-tools' });
  await ui(page.getByLabel('Search tools')).toHaveValue('fixture 82');
  await ui(page.getByRole('combobox', { name: 'Tool category' })).toHaveValue('school-study');
  await finish(true);
  await ui(page.locator(card('tools'))).toHaveCount(1);
  await ui(page.locator(card('tools'))).toHaveAttribute('href', '/tools/fixture-82/');
});

it('tools: pageshow restores current URL state without creating history or stealing focus', async () => {
  await mount('tools');
  await page.getByRole('combobox', { name: 'Tool category' }).selectOption('finance');
  const historyLength = await page.evaluate(() => history.length);
  await page.locator('#outside').focus();
  await page.evaluate(() => {
    history.replaceState(history.state, '', '/tools/?q=fixture&limit=24');
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  await ui(page.getByLabel('Search tools')).toHaveValue('fixture');
  await ui(page.getByRole('combobox', { name: 'Tool category' })).toHaveValue('all');
  await ui(page.locator(card('tools'))).toHaveCount(24);
  await ui(page.locator('#outside')).toBeFocused();
  expect(await page.evaluate(() => history.length)).toBe(historyLength);
});

it('tools: eight named task shortcuts select a useful query and clearing restores the initial choices', async () => {
  await mount();
  const tasks = page.getByRole('region', { name: 'What do you want to do?' });
  expect(await tasks.getByRole('button').allTextContents()).toEqual([
    'Percentages and discounts', 'Compare fractions', 'Monthly mortgage payment', 'Convert pounds to kg',
    'Count words', 'Read text from an image', 'Estimate paint', 'Days between dates',
  ]);
  await tasks.getByRole('button', { name: 'Count words', exact: true }).focus();
  await page.keyboard.press('Enter');
  await ui(page.getByLabel('Search tools')).toHaveValue('word count');
  await ui(page.getByLabel('Search tools')).toBeFocused();
  await ui(page.getByRole('combobox', { name: 'Tool category' })).toHaveValue('all');
  await ui(page.locator(card('tools'))).toHaveCount(1);
  await ui(page.locator(card('tools'))).toHaveAttribute('href', '/tools/fixture-2/');
  await page.getByRole('button', { name: 'Clear search and category', exact: true }).click();
  await ui(tasks.getByRole('button')).toHaveCount(8);
  await ui(page.locator(card('tools'))).toHaveCount(12);
  await ui(page.getByLabel('Search tools')).toBeFocused();
});

it('tools: words found only in the full search metadata remain discoverable', async () => {
  await mount('tools', false);
  await page.getByLabel('Search tools').fill('CIDR subnet mask');
  await ui(page.getByRole('heading', { name: 'No matching tools' })).toHaveCount(0);
  await finish(true);
  await ui(page.locator(card('tools'))).toHaveCount(1);
  await ui(page.locator(card('tools'))).toHaveAttribute('href', '/tools/fixture-83/');
});

it('tools: a pending keyboard reveal is cancelled by Back before its index resolves', async () => {
  await mount('tools', false);
  const reveal = revealButton('tools');
  await reveal.focus(); await page.keyboard.press('Enter');
  await expectPendingRevealFocus();
  await ui(page.locator(card('tools'))).toHaveCount(12);
  await page.goBack();
  await ui.poll(() => new URL(page.url()).searchParams.has('limit')).toBe(false);
  await finish(true);
  await ui(page.locator(card('tools'))).toHaveCount(12);
  expect(await page.locator(card('tools')).evaluateAll(links => links.some(link => link === document.activeElement))).toBe(false);
});

it('tools: changing the query during a pending reveal cancels its focus transfer and shares the request', async () => {
  await mount('tools', false);
  await revealButton('tools').focus(); await page.keyboard.press('Enter');
  const search = page.getByLabel('Search tools');
  await search.fill('fixture 83');
  expect(await page.evaluate(() => (window as any).fixture.requestCount)).toBe(1);
  await finish(true);
  await ui(page.locator(card('tools'))).toHaveCount(1);
  await ui(search).toBeFocused();
  expect(new URL(page.url()).searchParams.get('q')).toBe('fixture 83');
  expect(new URL(page.url()).searchParams.has('limit')).toBe(false);
});

it('tools: category selection during a pending reveal cancels focus transfer and keeps the latest filter', async () => {
  await mount('tools', false);
  await revealButton('tools').focus(); await page.keyboard.press('Enter');
  const category = page.getByRole('combobox', { name: 'Tool category' });
  await category.focus(); await category.selectOption('finance');
  expect(await page.evaluate(() => (window as any).fixture.requestCount)).toBe(1);
  await finish(true);
  await ui(page.locator(card('tools'))).toHaveCount(7);
  await ui(category).toBeFocused();
  expect(new URL(page.url()).searchParams.get('category')).toBe('finance');
  expect(new URL(page.url()).searchParams.has('limit')).toBe(false);
});

it('tools: failed partial search remains undecided until an explicit retry succeeds', async () => {
  await mount('tools', false);
  await page.getByLabel('Search tools').fill('fixture 83');
  await ui(page.getByRole('heading', { name: 'No matching tools' })).toHaveCount(0);
  await finish(false);
  const retry = page.getByRole('button', { name: /Retry full search/i });
  await ui(retry).toBeVisible();
  await ui(page.getByRole('heading', { name: 'No matching tools' })).toHaveCount(0);
  await retry.click();
  expect(await page.evaluate(() => (window as any).fixture.requestCount)).toBe(2);
  await finish(true);
  await ui(page.locator(card('tools'))).toHaveCount(1);
  await ui(page.locator(card('tools'))).toHaveAttribute('href', '/tools/fixture-83/');
  await ui(retry).toHaveCount(0);
  const status = page.locator('.results-heading [role="status"]');
  await ui(status).toHaveAttribute('aria-live', 'polite');
  await ui(status).toHaveAttribute('aria-atomic', 'true');
  await ui(status).toHaveText(/^Showing 1 of 1 tool(?: names?|s)?\.$/);
});

it('tools: Ctrl+K leaves editable controls and modified shortcuts alone', async () => {
  await mount();
  const category = page.getByRole('combobox', { name: 'Tool category' });
  await category.focus(); await page.keyboard.press('Control+k');
  await ui(category).toBeFocused();
  for (const key of ['Control+Shift+k', 'Control+Alt+k', 'Meta+k']) {
    await page.locator('#outside').focus(); await page.keyboard.press(key);
    await ui(page.locator('#outside')).toBeFocused();
  }
  await page.evaluate(() => {
    const editor = document.createElement('div');
    editor.id = 'editable-target'; editor.contentEditable = 'true'; editor.textContent = 'Editable text';
    document.body.append(editor); editor.focus();
  });
  await page.keyboard.press('Control+k');
  await ui(page.locator('#editable-target')).toBeFocused();
});

for (const kind of ['tools', 'blog']) it(`${kind}: pointer reveal does not move focus into the new cards`, async () => {
  await mount(kind); await revealButton(kind).click();
  await ui(page.locator(card(kind))).toHaveCount(24);
  expect(await page.locator(card(kind)).evaluateAll(links => links.some(link => link === document.activeElement))).toBe(false);
});

it('blocked theme storage still applies the chosen look and restores keyboard focus', async () => {
  await mount('theme');
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new Error('Synthetic blocked storage'); }; });
  const trigger = page.locator('.theme-picker-trigger');
  await trigger.focus(); await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Use Coral look' }).focus(); await page.keyboard.press('Space');
  await ui(trigger).toBeFocused(); await ui(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(await page.locator('html').getAttribute('data-theme')).toBe('coral');
});
