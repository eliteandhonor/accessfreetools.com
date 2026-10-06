import { readFileSync } from 'node:fs';
import { chromium, expect as ui, type Browser, type Page } from '@playwright/test';
import { build } from 'esbuild';
import { afterAll, afterEach, beforeAll, beforeEach, expect, it } from 'vitest';

// Exercise the actual server navigation markup, controller, styles, and theme picker.
const header = readFileSync('src/components/SiteHeader.astro', 'utf8');
const navigation = header.match(/<nav\b[\s\S]*?<\/nav>/)![0];
// Load the shared stylesheet last to catch component rules relying on import order.
const css = readFileSync('src/styles/site-navigation.css', 'utf8') + '\n' + readFileSync('src/styles/global.css', 'utf8');
const fixture = `<header class="site-header compact-site-header">
  <a class="brand" href="/" aria-label="Access Free Tools home"><span class="brand-mark" aria-hidden="true"></span><span>Access Free Tools</span></a>
  ${navigation}<div id="theme-root" style="display:contents"></div></header>
  <main><h1>Use the tool</h1><label>Task input <input id="task-input"></label><button id="outside" style="display:block;margin-top:320px">Continue task</button></main>`;
const harness = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import ThemePicker from './src/components/ThemePicker';
import { enhanceSiteNavigation } from './src/components/SiteNavigation';
document.querySelectorAll('[data-site-navigation]').forEach(enhanceSiteNavigation);
window.reinitializeNavigation = () => document.querySelectorAll('[data-site-navigation]').forEach(enhanceSiteNavigation);
createRoot(document.getElementById('theme-root')).render(<ThemePicker />);
`;

let browser: Browser, page: Page, script: string;
let errors: string[];
beforeAll(async () => {
  script = (await build({ stdin: { contents: harness, resolveDir: process.cwd(), loader: 'tsx' },
    bundle: true, write: false, format: 'iife', platform: 'browser', jsx: 'automatic' })).outputFiles[0].text;
  browser = await chromium.launch({ headless: true });
});
beforeEach(async () => {
  errors = [];
  page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.setDefaultTimeout(2000);
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => route.fulfill({ contentType: 'text/html', body: fixture }));
});
afterEach(async () => { await page.close(); expect(errors).toEqual([]); });
afterAll(async () => { await browser?.close(); });

async function mount(width = 390, enhanced = true) {
  await page.setViewportSize({ width, height: width > 900 ? 900 : 844 });
  await page.goto('https://navigation.invalid/');
  await page.addStyleTag({ content: css });
  if (enhanced) {
    await page.addScriptTag({ content: script });
    await ui(page.locator('[data-site-navigation]')).toHaveAttribute('data-navigation-ready', 'true');
    await ui(page.locator('.theme-picker-trigger')).toBeVisible();
  }
}
const menu = () => page.getByRole('button', { name: 'Menu', exact: true });
const browse = () => page.locator('[data-navigation-group]').filter({ has: page.locator('summary', { hasText: 'Browse' }) });

for (const width of [320, 390, 768, 1280]) it(`${width}: compact header fits and task remains visible`, async () => {
  await mount(width);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await ui(page.locator('#task-input')).toBeInViewport();
  if (width <= 900) {
    await ui(menu()).toBeVisible();
    await ui(page.locator('[data-navigation-panel]')).toBeHidden();
    await ui(menu()).toHaveAttribute('aria-expanded', 'false');
  } else {
    await ui(menu()).toBeHidden();
    await ui(page.getByRole('link', { name: 'Tools', exact: true })).toBeVisible();
    await ui(page.locator('[data-navigation-panel]')).toBeVisible();
  }
});

it('mobile repeated keyboard toggles, Escape, and hidden-link tab order remain correct', async () => {
  await mount();
  await menu().focus();
  for (const key of ['Enter', 'Space', 'Enter']) {
    await page.keyboard.press(key);
    await ui(menu()).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Tab');
    await ui(page.getByRole('link', { name: 'Tools', exact: true })).toBeFocused();
    await page.locator('summary').filter({ hasText: 'Browse' }).click();
    await page.getByRole('link', { name: 'Finance tools' }).focus();
    await page.keyboard.press('Escape');
    await ui(menu()).toHaveAttribute('aria-expanded', 'false');
    await ui(menu()).toBeFocused();
    await ui(page.locator('[data-navigation-panel]')).toBeHidden();
  }
  await page.keyboard.press('Tab');
  await ui(page.locator('.theme-picker-trigger')).toBeFocused();
});

it('outside pointer and keyboard departure close navigation without stealing focus', async () => {
  await mount();
  await menu().click();
  await page.locator('#outside').click();
  await ui(menu()).toHaveAttribute('aria-expanded', 'false');
  await ui(page.locator('#outside')).toBeFocused();
  await menu().click();
  await page.locator('#task-input').focus();
  await ui(menu()).toHaveAttribute('aria-expanded', 'false');
  await ui(page.locator('#task-input')).toBeFocused();
});

it('navigation closes for link selection while preserving the real route', async () => {
  await mount();
  await menu().click();
  const tools = page.getByRole('link', { name: 'Tools', exact: true });
  expect(await tools.getAttribute('href')).toBe('/tools/');
  // Hold page navigation so the pre-navigation dismissal can be inspected.
  await tools.evaluate(link => link.addEventListener('click', event => event.preventDefault()));
  await tools.click();
  await ui(menu()).toHaveAttribute('aria-expanded', 'false');
  await ui(page.locator('[data-navigation-panel]')).toBeHidden();
});

it('desktop groups retain native keyboard activation, exclusive opening, and Escape focus', async () => {
  await mount(1280);
  const summary = browse().locator('summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await ui(page.getByRole('link', { name: 'Finance tools' })).toBeVisible();
  await page.getByRole('link', { name: 'Finance tools' }).focus();
  expect(await page.getByRole('link', { name: 'Finance tools' }).evaluate(link => getComputedStyle(link).outlineStyle)).toBe('solid');
  await page.keyboard.press('Escape');
  await ui(summary).toBeFocused();
  await ui(page.getByRole('link', { name: 'Finance tools' })).toBeHidden();
  await page.keyboard.press('Space');
  await ui(page.getByRole('link', { name: 'Finance tools' })).toBeVisible();
  await page.locator('summary').filter({ hasText: 'Guides' }).click();
  await ui(page.getByRole('link', { name: 'Tool guides' })).toBeVisible();
  await ui(page.getByRole('link', { name: 'Finance tools' })).toBeHidden();
});

it('theme Escape restores theme focus and does not reopen mobile navigation', async () => {
  await mount();
  await menu().click();
  await page.locator('.theme-picker-trigger').click();
  await ui(menu()).toHaveAttribute('aria-expanded', 'false');
  await page.getByRole('button', { name: 'Use Coral look' }).focus();
  await page.keyboard.press('Escape');
  await ui(page.locator('.theme-picker-trigger')).toBeFocused();
  await ui(page.locator('.theme-picker-trigger')).toHaveAttribute('aria-expanded', 'false');
});

it('breakpoint changes transfer focus between desktop links and the mobile trigger', async () => {
  await mount(1280);
  await page.getByRole('link', { name: 'Tools', exact: true }).focus();
  await page.setViewportSize({ width: 390, height: 844 });
  await ui(menu()).toBeFocused();
  await ui(menu()).toHaveAttribute('aria-expanded', 'false');
  await page.setViewportSize({ width: 1280, height: 900 });
  await ui(page.getByRole('link', { name: 'Tools', exact: true })).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await ui(menu()).toBeFocused();
  await ui(page.locator('[data-navigation-panel]')).toBeHidden();
});

it('an expanded mobile group resets on resize without leaving focus in hidden content', async () => {
  await mount();
  await menu().click();
  await page.locator('summary').filter({ hasText: 'Browse' }).click();
  await page.getByRole('link', { name: 'Finance tools' }).focus();
  await page.setViewportSize({ width: 1280, height: 900 });
  await ui(page.locator('[data-navigation-panel]')).toBeVisible();
  await ui(browse().locator('summary')).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await ui(menu()).toBeFocused();
  await ui(page.locator('[data-navigation-panel]')).toBeHidden();
});

for (const width of [320, 1280]) it(`${width}: server links and native disclosures work without enhancement`, async () => {
  await mount(width, false);
  await ui(menu()).toBeHidden();
  await ui(page.getByRole('link', { name: 'Tools', exact: true })).toBeVisible();
  await page.locator('summary').filter({ hasText: 'Browse' }).click();
  await ui(page.getByRole('link', { name: 'All categories' })).toBeVisible();
  expect(await page.locator('.site-nav a').evaluateAll(links => links.map(link => link.getAttribute('href')))).toEqual(expect.arrayContaining([
    '/tools/', '/ask/', '/categories/', '/hubs/', '/free-calculator-resources/', '/blog/',
    '/categories/calculators/', '/categories/finance/', '/categories/health-fitness/', '/categories/ai-tools/', '/about/',
  ]));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

it('initialization is idempotent rather than duplicating mobile toggle listeners', async () => {
  await mount();
  await page.evaluate(() => (window as any).reinitializeNavigation());
  await menu().click();
  await ui(menu()).toHaveAttribute('aria-expanded', 'true');
  await menu().click();
  await ui(menu()).toHaveAttribute('aria-expanded', 'false');
});
