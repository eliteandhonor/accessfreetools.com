import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium, type Browser, type BrowserContext, type Page } from '@playwright/test';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { renderAdminShell } from './adminShellFixture';

const origin = 'https://admin-fixture.invalid';
const legacyKey = 'access-free-tools-analytics-token';
const optOutKey = 'access-free-tools-analytics-opt-out';
const credential = 'synthetic-admin-no-persistence';
const sources = Object.fromEntries(['index', 'analytics', 'agent-tools'].map((name) => [name,
  readFileSync(new URL(`../../src/pages/admin/${name}.astro`, import.meta.url), 'utf8'),
]));
const css = readFileSync(new URL('../../src/styles/global.css', import.meta.url), 'utf8');
const paths = ['/admin/', '/admin/analytics/', '/admin/agent-tools/', '/private-analytics/'];

// Mount the actual private-page markup and inline scripts, as in browserCoverage.mjs.
// Only Astro's outer layout and static MCP examples are substituted; no API passes through.
function shell(path: string) {
  const name = path === '/admin/' ? 'index' : path.includes('agent-tools') ? 'agent-tools' : 'analytics';
  const source = sources[name];
  const markup = source.slice(source.indexOf('<section'), source.indexOf('<script'))
    .replace('{mcpExample}', '{}').replace('{waitingExample}', '{}');
  const script = source.match(/<script\b[^>]*>([\s\S]*?)<\/script>/)![1];
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style></head><body><main>${markup}</main><script>const optOutKey=${JSON.stringify(optOutKey)};${script}</script></body></html>`;
}

let browser: Browser;
const compiledShells = new Map<string, string>();
let contexts: BrowserContext[] = [];
beforeAll(async () => { browser = await chromium.launch({ headless: true }); });
afterEach(async () => { await Promise.all(contexts.map((context) => context.close())); contexts = []; });
afterAll(async () => { await browser?.close(); });

async function fixture(path: string, options: { blockedStorage?: boolean; width?: number } = {}) {
  const context = await browser.newContext({ viewport: { width: options.width ?? 1280, height: 900 }, serviceWorkers: 'block' });
  contexts.push(context);
  const requests: Array<{ url: string; method: string; tokenMatches: boolean; hasToken: boolean; bodyHasToken: boolean }> = [];
  const errors: string[] = [];
  let pending: (() => Promise<void>) | undefined;
  let delayNext = false;
  let denyNext = false;
  await context.route('**/*', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin !== origin) throw new Error('Unexpected external request');
    if (paths.includes(url.pathname)) return route.fulfill({ contentType: 'text/html', body: compiledShells.get(url.pathname) ?? shell(url.pathname) });
    // ThemePicker hydration is unrelated to authentication; its real server markup is retained.
    if (url.pathname === '/fixture-renderer.js') return route.fulfill({ contentType: 'text/javascript', body: 'export default () => () => {};' });
    if (url.pathname === '/fixture-component.js') return route.fulfill({ contentType: 'text/javascript', body: 'export default function Component() {}' });
    if (url.pathname === '/public/') return route.fulfill({ contentType: 'text/html', body: '<h1>Public fixture</h1>' });
    if (!['/api/analytics/events', '/api/admin/agent-tools', '/mcp'].includes(url.pathname)) return route.abort();
    const token = request.headers()['x-aft-analytics-token'];
    requests.push({ url: url.pathname + url.search, method: request.method(), tokenMatches: token === credential,
      hasToken: Boolean(token), bodyHasToken: Boolean(request.postData()?.includes(credential)) });
    const denied = denyNext || (url.pathname !== '/mcp' && token !== credential);
    denyNext = false;
    const complete = async () => { await route.fulfill({ status: denied ? 401 : 200,
      headers: { 'cache-control': 'no-store' }, json: denied ? { ok: false, message: 'Token not accepted.' } : {
        ok: true, summary: { generatedAt: '2026-09-06T12:00:00Z', today: { visitors: 42 } },
        reports: [{ kind: 'route', status: 'pass', report: { summary: { evidence: 'synthetic-private-report' } } }], refreshed: ['route'],
      } }).catch(() => {}); };
    if (delayNext) { delayNext = false; pending = complete; } else await complete();
  });
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`${origin}/public/`);
  await page.evaluate(({ legacyKey, credential, optOutKey }) => {
    localStorage.setItem(legacyKey, credential);
    sessionStorage.setItem(legacyKey, credential);
    localStorage.setItem(optOutKey, 'true');
    sessionStorage.setItem('unrelated-preference', 'keep');
  }, { legacyKey, credential, optOutKey });
  if (options.blockedStorage) await context.addInitScript(() => {
    for (const storage of ['localStorage', 'sessionStorage']) Object.defineProperty(window, storage, {
      get() { throw new DOMException('Storage is disabled', 'SecurityError'); },
    });
  });
  await page.goto(origin + path);
  return { page, context, requests, errors,
    delay: () => { delayNext = true; }, deny: () => { denyNext = true; },
    release: async () => { await pending?.(); pending = undefined; },
  };
}

async function storageProof(page: Page) {
  return page.evaluate(({ legacyKey, credential, optOutKey }) => ({
    legacyLocalGone: localStorage.getItem(legacyKey) === null,
    legacySessionGone: sessionStorage.getItem(legacyKey) === null,
    optOutPreserved: localStorage.getItem(optOutKey) === 'true',
    unrelatedPreserved: sessionStorage.getItem('unrelated-preference') === 'keep',
    containsCredential: [JSON.stringify(localStorage), JSON.stringify(sessionStorage), document.cookie, window.name,
      location.href, document.documentElement.outerHTML, ...Array.from(document.querySelectorAll('input')).map((input) => input.value),
      ...Object.values(Object.getOwnPropertyDescriptors(window)).map((entry) => typeof entry.value === 'string' ? entry.value : ''),
    ].some((value) => value.includes(credential)),
  }), { legacyKey, credential, optOutKey });
}

async function enter(page: Page, token = credential) {
  await page.locator('input[type=password]').fill(token);
  await page.locator('input[type=password]').press('Enter');
}

async function unlocked(page: Page) {
  await page.locator('[data-analytics-dashboard]:not([hidden]), [data-agent-dashboard]:not([hidden])').first().waitFor();
}

async function locked(page: Page) {
  await page.locator('[data-analytics-token-form], [data-agent-token-form]').waitFor({ state: 'visible' });
  expect(await page.locator('[data-analytics-dashboard]:not([hidden]), [data-agent-dashboard]:not([hidden])').count()).toBe(0);
  expect(await page.locator('input[type=password]').inputValue()).toBe('');
  expect(await page.locator('body').textContent()).not.toContain('synthetic-private-report');
}

describe('private admin credential lifetime in actual mounted pages', () => {
  it.each(paths)('renders the current full Astro private shell without ads or Clarity: %s', async (path) => {
    const name = path === '/private-analytics/' ? 'private-analytics' : `admin/${path === '/admin/' ? 'index' : path.split('/')[2]}`;
    const html = await renderAdminShell(name, path);
    compiledShells.set(path, html);
    expect(html).toContain('noindex');
    expect(html).not.toMatch(/clarity\.ms|infolinks\.com|pagead2\.googlesyndication\.com/);
    const f = await fixture(path);
    expect((await storageProof(f.page)).containsCredential).toBe(false);
    if (path !== '/admin/') {
      await enter(f.page);
      await unlocked(f.page);
      await f.page.locator('[data-admin-logout]').click();
      await locked(f.page);
    }
    expect(f.errors).toEqual([]);
  });

  it.each(paths)('removes only the legacy token key and never auto-authenticates %s', async (path) => {
    const f = await fixture(path);
    expect(await storageProof(f.page)).toEqual({ legacyLocalGone: true, legacySessionGone: true,
      optOutPreserved: true, unrelatedPreserved: true, containsCredential: false });
    expect(f.requests).toEqual([]);
    expect(f.errors).toEqual([]);
  });

  it.each(paths.filter((path) => path !== '/admin/'))('requires fresh entry on reload and private/public navigation: %s', async (path) => {
    const f = await fixture(path);
    await enter(f.page);
    await unlocked(f.page);
    expect(f.requests).toHaveLength(1);
    expect(f.requests[0]).toMatchObject({ tokenMatches: true, bodyHasToken: false });
    expect((await storageProof(f.page)).containsCredential).toBe(false);
    await f.page.reload();
    expect(await f.page.locator('input[type=password]').inputValue()).toBe('');
    expect(f.requests).toHaveLength(1);
    await f.page.goto(origin + '/admin/agent-tools/');
    expect(f.requests).toHaveLength(1);
    await f.page.goto(origin + '/public/');
    expect((await storageProof(f.page)).containsCredential).toBe(false);
    await f.page.goBack();
    expect(await f.page.locator('input[type=password]').inputValue()).toBe('');
    expect(f.errors).toEqual([]);
  });

  it.each(['/admin/analytics/', '/admin/agent-tools/'])('clears DOM data and pending login on logout/pagehide, then retries: %s', async (path) => {
    const f = await fixture(path);
    await enter(f.page);
    await unlocked(f.page);
    await f.page.locator('[data-admin-logout]').click();
    await locked(f.page);
    f.delay();
    await enter(f.page);
    await expect.poll(() => f.requests.length).toBe(2);
    await f.page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })));
    await f.release();
    await locked(f.page);
    await f.page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
    await enter(f.page);
    await unlocked(f.page);
    expect(f.requests).toHaveLength(3);
    expect((await storageProof(f.page)).containsCredential).toBe(false);
    expect(f.errors).toEqual([]);
  });

  it.each(['/admin/analytics/', '/admin/agent-tools/'])('rejects a wrong token, clears input, and supports storage-disabled login: %s', async (path) => {
    const f = await fixture(path, { blockedStorage: true });
    await enter(f.page, 'synthetic-wrong-token');
    await expect.poll(() => f.page.locator('[data-analytics-message], [data-agent-message]').textContent()).toContain('not accepted');
    await locked(f.page);
    await enter(f.page);
    await unlocked(f.page);
    await f.page.locator('[data-admin-logout]').click();
    await locked(f.page);
    expect(f.requests.map((request) => request.tokenMatches)).toEqual([false, true]);
    expect(f.errors).toEqual([]);
  });

  it('uses only header auth for Agent Tools operations, excludes it from MCP, and clears rejected authority', async () => {
    const f = await fixture('/admin/agent-tools/');
    await enter(f.page);
    await unlocked(f.page);
    await f.page.locator('[data-agent-refresh-form] button').click();
    await expect.poll(() => f.page.locator('[data-agent-refresh-message]').textContent()).toContain('Refreshed');
    await f.page.locator('[data-agent-helper-form] button').click();
    await expect.poll(() => f.page.locator('[data-agent-helper-message]').textContent()).toContain('Updated');
    await f.page.locator('[data-mcp-form] button').click();
    await expect.poll(() => f.page.locator('[data-mcp-output]').textContent()).toContain('summary');
    expect(f.requests.map((request) => request.hasToken)).toEqual([true, true, true, false]);
    expect(f.requests.every((request) => !request.bodyHasToken && !request.url.includes('?'))).toBe(true);
    f.deny();
    await f.page.locator('[data-agent-refresh-form] button').click();
    await locked(f.page);
    await f.page.evaluate(() => document.querySelector('[data-agent-helper-form]')!.dispatchEvent(new Event('submit', { cancelable: true })));
    expect(f.requests).toHaveLength(5);
    expect((await storageProof(f.page)).containsCredential).toBe(false);
    expect(f.errors).toEqual([]);
  });

  it.each(['refresh', 'helper', 'mcp'])('does not restore pending %s output after logout', async (kind) => {
    const f = await fixture('/admin/agent-tools/');
    await enter(f.page);
    await unlocked(f.page);
    f.delay();
    const selector = kind === 'mcp' ? '[data-mcp-form]' : `[data-agent-${kind}-form]`;
    await f.page.locator(`${selector} button`).click();
    await expect.poll(() => f.requests.length).toBe(2);
    await f.page.locator('[data-admin-logout]').click();
    await f.release();
    await locked(f.page);
    expect(await f.page.locator('[data-mcp-output]').textContent()).toBe('');
    expect(f.errors).toEqual([]);
  });

  it('does not expose credentials to a same-origin public opener or popup', async () => {
    const f = await fixture('/admin/agent-tools/');
    await enter(f.page);
    await unlocked(f.page);
    const popupPromise = f.page.waitForEvent('popup');
    await f.page.evaluate(() => window.open('/public/', '_blank'));
    const popup = await popupPromise;
    await popup.waitForLoadState();
    expect((await storageProof(popup)).containsCredential).toBe(false);
    expect(await popup.evaluate((credential) => {
      const other = window.opener;
      return [...other.document.querySelectorAll('input[type=password]')].some((input) => input.value.includes(credential)) ||
        Object.values(Object.getOwnPropertyDescriptors(other)).some((entry) => entry.value === credential);
    }, credential)).toBe(false);
    await popup.close();
    expect(f.errors).toEqual([]);
  });

  it.each([390, 1440])('keeps entry and logout usable at %ipx', async (width) => {
    const f = await fixture('/admin/agent-tools/', { width });
    expect(await f.page.locator('input[type=password]').getAttribute('name')).toBeNull();
    await enter(f.page);
    await unlocked(f.page);
    expect(await f.page.locator('[data-admin-logout]').isVisible()).toBe(true);
    expect(await f.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (process.env.AFT_ADMIN_PROOF_DIR) await f.page.screenshot({
      path: resolve(process.env.AFT_ADMIN_PROOF_DIR, `agent-tools-${width}.png`), fullPage: true,
    });
    await f.page.locator('[data-admin-logout]').click();
    await locked(f.page);
    expect(f.errors).toEqual([]);
  });
});
