import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { extname, relative, resolve, sep } from 'node:path';
import { chromium, expect } from '@playwright/test';

// Run only after the coordinator builds the frozen source. All requests use local files.
const argument = process.argv.find(value => value.startsWith('--dist='));
if (!argument) throw new Error('Pass --dist=dist/client after the coordinator authorizes fresh built-page proof.');
const root = resolve(argument.slice('--dist='.length));
assert(existsSync(resolve(root, 'tools/index.html')), 'Missing built tools page');
const output = resolve('output/project-review-followup/UX-02/built-discovery');
mkdirSync(output, { recursive: true });
const origin = 'https://discovery.invalid';
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2' };
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const width of [320, 390, 768, 980, 1081, 1365]) {
    const context = await browser.newContext({ viewport: { width, height: width === 768 ? 1024 : width <= 390 ? 844 : 900 },
      serviceWorkers: 'block', extraHTTPHeaders: { DNT: '1' } });
    try {
      await context.addInitScript(() => {
        try {
          localStorage.setItem('access-free-tools-analytics-opt-out', 'true');
          localStorage.setItem('access-free-tools-owner-ads-disabled', 'true');
        } catch {}
      });
      await context.route('**/*', route => {
        const url = new URL(route.request().url());
        if (url.origin !== origin || route.request().method() !== 'GET' || /^\/(api|mcp)(\/|$)/.test(url.pathname)) return route.abort();
        let path;
        try { path = resolve(root, `.${decodeURIComponent(url.pathname)}`); } catch { return route.abort(); }
        if (path !== root && !path.startsWith(`${root}${sep}`)) return route.abort();
        if (existsSync(path) && statSync(path).isDirectory()) path = resolve(path, 'index.html');
        if (!existsSync(path)) return route.fulfill({ status: 404, body: 'Missing local fixture asset' });
        return route.fulfill({ contentType: mime[extname(path)] ?? 'application/octet-stream', body: readFileSync(path) });
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const hydrated = () => page.waitForFunction(() => [...document.querySelectorAll('astro-island')]
        .filter(island => /ToolsLaunchpad|BlogSearch|ThemePicker/.test(island.getAttribute('component-url') ?? ''))
        .every(island => !island.hasAttribute('ssr')));
      for (const [route, cards] of [['/tools/', '.launchpad-tool-card'], ['/blog/', '.blog-post-card h3 a'], ['/gallery/finance/', '#tool-gallery-grid [data-gallery-item]:not([hidden])']]) {
        for (const key of ['Enter', 'Space']) {
          await page.goto(`${origin}${route}`);
          await hydrated();
          await expect(page.locator('.theme-picker-trigger')).toBeVisible();
          if (route === '/tools/') {
            if (width <= 980) {
              const category = page.getByRole('combobox', { name: 'Tool category' });
              await expect(category).toBeVisible();
              await expect(page.locator('.category-rail')).toBeHidden();
              assert.equal(await category.locator('option').count(), await page.locator('.category-rail button').count());
              if (width === 768) {
                assert((await page.locator('#tool-library-search').boundingBox()).y < 1024);
                assert((await page.locator(cards).first().boundingBox()).y < 1024, 'Tablet first result must be visible');
              }
            } else await expect(page.locator('.category-rail')).toBeVisible();
            if (key === 'Enter') await page.screenshot({ path: resolve(output, `tools-default-${width}.png`) });
          }
          const existing = new Set(await page.locator(cards).evaluateAll(links => links.map(link => link.getAttribute('href'))));
          const reveal = route.startsWith('/gallery') ? page.locator('[data-gallery-reveal="tool-gallery-grid"]') : page.getByRole('button', { name: /^Show all/ });
          await reveal.focus(); await page.keyboard.press(key);
          await expect.poll(() => page.locator(cards).evaluateAll((links, old) => {
            const firstNew = links.find(link => !old.includes(link.getAttribute('href')));
            return Boolean(firstNew && firstNew === document.activeElement);
          }, [...existing])).toBe(true);
          const nextHref = await page.locator(cards).evaluateAll(links => {
            const current = document.activeElement;
            const next = current?.closest('.blog-post-card')?.querySelector('.card-link') ?? links[links.indexOf(current) + 1];
            return next?.getAttribute('href');
          });
          await page.keyboard.press('Tab');
          assert(nextHref && await page.evaluate(() => document.activeElement?.getAttribute('href')) === nextHref, 'Tab must continue in revealed cards');
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} overflow at ${width}`);
          results.push({ route, width, key, reveal: 'first-new-link', overflow: false });
        }
      }
      await page.goto(`${origin}/gallery/finance/`);
      const hiddenId = await page.locator('#tool-gallery-grid [data-gallery-item][hidden]').first().getAttribute('id');
      assert(hiddenId, 'Finance fixture needs an initially hidden item');
      await page.goto(`${origin}/gallery/finance/#${hiddenId}`); await page.reload();
      await expect(page.locator(`[id="${hiddenId}"]`)).toBeVisible();
      await page.goto(`${origin}/tools/`);
      await hydrated();
      const trigger = page.locator('.theme-picker-trigger');
      for (const [label, key] of [['Fresh', 'Enter'], ['Coral', 'Space']]) {
        await trigger.focus(); await page.keyboard.press('Enter');
        await page.getByRole('button', { name: `Use ${label} look` }).focus(); await page.keyboard.press(key);
        await expect(trigger).toBeFocused(); await expect(trigger).toHaveAttribute('aria-expanded', 'false');
        await expect(trigger).toHaveAttribute('aria-label', `Choose website look. Current look: ${label}`);
      }
      await page.locator('#tool-library-search').fill('mortgage');
      await expect(page.locator('.launchpad-tool-card').first()).toBeVisible();
      if (width <= 980) assert((await page.locator('.launchpad-tool-card').first().boundingBox()).y < page.viewportSize().height);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.screenshot({ path: resolve(output, `tools-query-${width}.png`) });
      assert.deepEqual(errors, [], 'Built-page errors');
    } finally { await context.close(); }
  }
  writeFileSync(resolve(output, 'results.json'), `${JSON.stringify({ mode: 'fresh-built-static-hydration', dist: relative(process.cwd(), root), results }, null, 2)}\n`);
  console.log(`PASS ${results.length} built reveal sequences; category, search, theme and hash controls. ${output}`);
} finally { await browser.close(); }
