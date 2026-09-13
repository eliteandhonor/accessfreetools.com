import { mkdirSync, readFileSync } from 'node:fs';
import { chromium, expect as ui, type Browser, type Page } from '@playwright/test';
import { build } from 'esbuild';
import { afterAll, afterEach, beforeAll, beforeEach, expect, it } from 'vitest';

const css = readFileSync('src/styles/global.css', 'utf8');
const gallerySource = readFileSync('src/pages/gallery/[category].astro', 'utf8');
const galleryScript = [...gallerySource.matchAll(/<script is:inline>([\s\S]*?)<\/script>/g)][0][1];
const harness = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import ToolsLaunchpad from './src/components/ToolsLaunchpad';
import BlogSearch from './src/components/BlogSearch';
import ThemePicker from './src/components/ThemePicker';
import { categories } from './src/data/categories';
const settings = window.fixture;
const tools = Array.from({ length: 84 }, (_, index) => ({ slug: 'fixture-' + index,
  name: 'Fixture tool ' + index, summary: 'A practical calculator for everyday tasks.',
  icon: 'wrench', category: categories[index % categories.length].slug, searchText: 'fixture ' + index }));
const posts = tools.map(tool => ({ ...tool, title: tool.name, label: 'Guide' }));
const counts = Object.fromEntries(categories.map(category => [category.slug, tools.filter(tool => tool.category === category.slug).length]));
const pending = [];
window.fetch = () => new Promise((resolve, reject) => pending.push({ resolve, reject }));
settings.requests = pending;
settings.finish = (ok, reverse = false) => {
  const request = pending.shift();
  if (!ok) return request.reject(new Error('Synthetic index failure'));
  request.resolve({ ok: true, json: async () => ({ tools: reverse ? [...tools].reverse() : tools, posts: reverse ? [...posts].reverse() : posts }) });
};
settings.categories = categories.map(item => item.slug);
const nav = ['Tools', 'Ask Tools', 'Categories', 'Hubs', 'Resources', 'Math', 'Finance', 'Health', 'AI', 'Blog'];
const root = createRoot(document.getElementById('root'));
root.render(<><header className="site-header"><a className="brand" href="/"><span className="brand-mark" /><span>Access Free Tools</span></a>
  <nav className="site-nav" aria-label="Main navigation">{nav.map(label => <a key={label} href="/">{label}</a>)}</nav><ThemePicker /></header>
  <main>{settings.kind === 'tools' ? <ToolsLaunchpad categories={categories} categoryCounts={counts} tools={tools.slice(0, settings.loaded ? 84 : 72)} totalToolCount={84} searchIndexUrl="/fixture-index.json" />
  : settings.kind === 'blog' ? <BlogSearch posts={posts.slice(0, settings.loaded ? 84 : 36)} totalPostCount={84} searchIndexUrl="/fixture-index.json" /> : null}</main>
  <button id="outside">Outside target</button></>);
`;

let browser: Browser, page: Page, script: string;
let errors: string[];
beforeAll(async () => {
  mkdirSync('output/project-review-followup/UX-02', { recursive: true });
  script = (await build({ stdin: { contents: harness, resolveDir: process.cwd(), loader: 'tsx' },
    bundle: true, write: false, format: 'iife', platform: 'browser', jsx: 'automatic' })).outputFiles[0].text;
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

async function mount(kind = 'tools', loaded = true, width = 1365) {
  await page.setViewportSize({ width, height: width === 768 ? 1024 : width <= 390 ? 844 : 900 });
  await page.goto('https://discovery.invalid/');
  await page.evaluate(value => { (window as any).fixture = value; }, { kind, loaded });
  await page.addStyleTag({ content: css });
  await page.addScriptTag({ content: script });
  await ui(page.locator('.theme-picker-trigger')).toBeVisible();
}
const card = (kind: string) => kind === 'tools' ? '.launchpad-tool-card' : '.blog-post-card h3 a';
const firstNew = (kind: string) => kind === 'tools' ? 72 : 36;
async function finish(ok: boolean, reverse = false) {
  await page.evaluate(({ ok, reverse }) => (window as any).fixture.finish(ok, reverse), { ok, reverse });
}

for (const kind of ['tools', 'blog']) {
  for (const width of [390, 768, 1365]) for (const key of ['Enter', 'Space']) {
    it(`${kind} ${width}: ${key} reveal focuses the first new item and continues logically`, async () => {
      await mount(kind, true, width);
      const reveal = page.getByRole('button', { name: /^Show all/ });
      await reveal.focus(); await page.keyboard.press(key);
      await ui(page.locator(card(kind)).nth(firstNew(kind))).toBeFocused({ timeout: 1200 });
      await page.keyboard.press('Tab');
      await ui(kind === 'tools' ? page.locator(card(kind)).nth(73) : page.locator('.blog-post-card').nth(36).locator('.card-link')).toBeFocused();
    });
  }
  it(`${kind}: delayed load preserves focus until success, including reordered new items`, async () => {
    await mount(kind, false);
    const reveal = page.getByRole('button', { name: /^Show all/ });
    await reveal.focus(); await page.keyboard.press('Enter');
    await ui(reveal).toBeFocused();
    await finish(true, true);
    await ui(page.locator(card(kind)).first()).toBeFocused({ timeout: 1200 });
    expect(await page.locator(card(kind)).first().getAttribute('href')).toContain('fixture-83/');
  });
  it(`${kind}: failed load keeps a retry target and retry transfers focus`, async () => {
    await mount(kind, false);
    const reveal = page.getByRole('button', { name: /^Show all/ });
    await reveal.focus(); await page.keyboard.press('Space'); await finish(false);
    await ui(page.locator('.launchpad-status-note')).toBeVisible(); await ui(reveal).toBeFocused();
    await page.keyboard.press('Enter'); await finish(true);
    await ui(page.locator(card(kind)).nth(firstNew(kind))).toBeFocused({ timeout: 1200 });
  });
  it(`${kind}: pending reveal does not steal focus after the user leaves`, async () => {
    await mount(kind, false);
    await page.getByRole('button', { name: /^Show all/ }).focus(); await page.keyboard.press('Enter');
    await page.locator('#outside').focus(); await finish(true);
    await ui(page.locator(card(kind))).toHaveCount(84);
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
  if (width <= 980) {
    const select = page.getByRole('combobox', { name: 'Tool category' });
    await ui(select).toBeVisible({ timeout: 1200 });
    const expected = await page.evaluate(() => ['all', ...(window as any).fixture.categories]);
    expect(await select.locator('option').evaluateAll(options => options.map(option => (option as HTMLOptionElement).value))).toEqual(expected);
    await ui(page.locator('.category-rail')).toBeHidden();
    if (width === 768) expect((await page.locator(card('tools')).first().boundingBox())!.y).toBeLessThan(1000);
    await select.focus(); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter');
    expect(await select.inputValue()).not.toBe('all');
    await select.selectOption('all');
    await page.locator('#tool-library-search').fill('fixture 83');
    await ui(page.locator(card('tools'))).toHaveCount(1);
    expect((await page.locator(card('tools')).first().boundingBox())!.y).toBeLessThan(page.viewportSize()!.height);
  } else {
    await ui(page.locator('.category-rail')).toBeVisible();
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

for (const kind of ['tools', 'blog']) it(`${kind}: pointer reveal does not move focus into the new cards`, async () => {
  await mount(kind); await page.getByRole('button', { name: /^Show all/ }).click();
  await ui(page.locator(card(kind))).toHaveCount(84);
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
