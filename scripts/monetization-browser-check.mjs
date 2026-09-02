import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { join } from 'node:path';

import { chromium } from '@playwright/test';

function freePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      server.close((error) => (error ? reject(error) : resolve(port)));
    });
  });
}

async function waitForPreview(url, child) {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`Astro preview exited with ${child.exitCode}.`);
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Preview is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('Timed out waiting for Astro preview.');
}

function countMarker(html, marker) {
  return html.split(marker).length - 1;
}

async function configurePage(page, requestCounter) {
  await page.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, 'doNotTrack', { configurable: true, get: () => null });
    Object.defineProperty(Navigator.prototype, 'globalPrivacyControl', { configurable: true, get: () => false });
  });
  await page.route('https://resources.infolinks.com/**', async (route) => {
    requestCounter.count += 1;
    await route.fulfill({ body: 'window.__aftInfolinksTestLoaded = true;', contentType: 'application/javascript', status: 200 });
  });
  await page.route('https://www.clarity.ms/**', (route) => route.abort());
  await page.route('https://news.google.com/**', (route) => route.abort());
}

const port = await freePort();
const localUrl = `http://127.0.0.1:${port}`;
const publicUrl = `http://accessfreetools.com:${port}`;
const outputDirectory = join(process.cwd(), 'output', 'monetization', 'browser');
const preview = spawn(process.execPath, [join(process.cwd(), 'node_modules', 'astro', 'bin', 'astro.mjs'), 'preview', '--host', '0.0.0.0', '--port', String(port)], {
  cwd: process.cwd(),
  env: { ...process.env, HOST: '0.0.0.0', PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let previewLog = '';
preview.stdout.on('data', (chunk) => { previewLog += chunk.toString(); });
preview.stderr.on('data', (chunk) => { previewLog += chunk.toString(); });

let browser;
const proof = { checks: [], generatedAt: new Date().toISOString(), publicUrl };

try {
  await waitForPreview(localUrl, preview);
  browser = await chromium.launch({
    headless: true,
    args: [`--host-resolver-rules=MAP accessfreetools.com 127.0.0.1`],
  });

  const deniedContext = await browser.newContext({ viewport: { height: 844, width: 390 } });
  const deniedPage = await deniedContext.newPage();
  const deniedRequests = { count: 0 };
  await configurePage(deniedPage, deniedRequests);
  await deniedPage.goto(`${publicUrl}/blog/remove-ai-writing-tells-before-publishing/`, { waitUntil: 'domcontentloaded' });
  const choice = deniedPage.locator('[data-advertising-choice]');
  await choice.waitFor({ state: 'visible' });
  assert.equal(deniedRequests.count, 0, 'Infolinks requested data before consent.');
  assert.equal(await deniedPage.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), true);
  mkdirSync(outputDirectory, { recursive: true });
  await deniedPage.screenshot({ fullPage: false, path: join(outputDirectory, 'mobile-consent.png') });
  await deniedPage.getByRole('button', { name: 'Keep ads off' }).click();
  await choice.waitFor({ state: 'hidden' });
  assert.equal(deniedRequests.count, 0, 'Infolinks requested data after consent was denied.');
  assert.equal(await deniedPage.evaluate(() => localStorage.getItem('access-free-tools-ad-consent')), 'denied');
  proof.checks.push('No Infolinks request before consent or after refusal.');
  await deniedContext.close();

  const allowedContext = await browser.newContext({ viewport: { height: 900, width: 1440 } });
  const allowedPage = await allowedContext.newPage();
  const allowedRequests = { count: 0 };
  await configurePage(allowedPage, allowedRequests);
  await allowedPage.goto(`${publicUrl}/tools/percentage-calculator/`, { waitUntil: 'domcontentloaded' });
  await allowedPage.getByRole('button', { name: 'Allow contextual ads' }).click();
  await allowedPage.waitForFunction(() => Reflect.get(window, '__aftInfolinksTestLoaded') === true);
  assert.equal(allowedRequests.count, 1, 'Infolinks loader should be requested once after consent.');
  assert.equal(await allowedPage.evaluate(() => Reflect.get(window, 'infolinks_pid')), 3447500);
  assert.equal(await allowedPage.evaluate(() => Reflect.get(window, 'infolinks_wsid')), 0);
  assert.equal(await allowedPage.locator('[data-advertising-page-notice]').isVisible(), true);
  const toolHtml = await allowedPage.content();
  assert.ok(countMarker(toolHtml, '<!--INFOLINKS_OFF-->') >= 2, 'Tool page is missing its private boundary.');
  assert.ok(countMarker(toolHtml, '<!--INFOLINKS_ON-->') >= 2, 'Tool page is missing its boundary reset.');
  await allowedPage.screenshot({ fullPage: true, path: join(outputDirectory, 'desktop-tool-after-consent.png') });
  proof.checks.push('Consent loads the pinned Infolinks account once and preserves the tool boundary.');
  await allowedContext.close();

  const suppressedContext = await browser.newContext();
  await suppressedContext.addInitScript(() => {
    localStorage.setItem('access-free-tools-ad-consent', 'granted');
    localStorage.setItem('access-free-tools-owner-ads-disabled', 'true');
  });
  const suppressedPage = await suppressedContext.newPage();
  const suppressedRequests = { count: 0 };
  await configurePage(suppressedPage, suppressedRequests);
  await suppressedPage.goto(`${publicUrl}/`, { waitUntil: 'domcontentloaded' });
  assert.equal(suppressedRequests.count, 0, 'Owner-suppressed browser loaded Infolinks.');
  assert.equal(await suppressedPage.locator('[data-advertising-choice]').isHidden(), true);
  proof.checks.push('Owner suppression prevents all advertising requests.');
  await suppressedContext.close();

  const privateContext = await browser.newContext();
  const privatePage = await privateContext.newPage();
  const privateRequests = { count: 0 };
  await configurePage(privatePage, privateRequests);
  await privatePage.goto(`${publicUrl}/admin/`, { waitUntil: 'domcontentloaded' });
  assert.equal(await privatePage.locator('[data-advertising-choice]').count(), 0);
  assert.equal(privateRequests.count, 0);
  assert.equal((await privatePage.content()).includes('infolinks_main.js'), false);
  proof.checks.push('Admin pages contain no advertising loader or consent surface.');
  await privateContext.close();

  writeFileSync(join(outputDirectory, 'latest.json'), `${JSON.stringify(proof, null, 2)}\n`);
  console.log(`Monetization browser check passed (${proof.checks.length} checks).`);
  for (const check of proof.checks) console.log(`- ${check}`);
} catch (error) {
  process.stderr.write(previewLog);
  throw error;
} finally {
  if (browser) await browser.close();
  preview.kill();
}
