import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
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

async function configurePage(page, requestCounter) {
  await page.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, 'doNotTrack', { configurable: true, get: () => null });
    Object.defineProperty(Navigator.prototype, 'globalPrivacyControl', { configurable: true, get: () => false });
  });
  await page.route('https://resources.infolinks.com/**', async (route) => {
    requestCounter.count += 1;
    await route.fulfill({ body: 'window.__aftInfolinksTestLoaded = true;', contentType: 'application/javascript', status: 200 });
  });
  await page.route('https://pagead2.googlesyndication.com/**', async (route) => {
    requestCounter.count += 1;
    await route.abort();
  });
  await page.route('https://www.clarity.ms/**', (route) => route.abort());
  await page.route('https://news.google.com/**', (route) => route.abort());
}

const port = await freePort();
const localUrl = `http://127.0.0.1:${port}`;
const publicUrl = `http://accessfreetools.com:${port}`;
const outputDirectory = join(process.cwd(), 'output', 'monetization', 'browser');
// Own the foreground production entry point, not Astro's detached preview CLI.
const preview = spawn(process.execPath, [join(process.cwd(), 'app.js')], {
  cwd: process.cwd(),
  env: { ...process.env, HOST: '127.0.0.1', PORT: String(port) },
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

  const landing = await (await fetch(localUrl)).text();
  const disabled = !/"adMode":"(?:infolinks|adsense)"/.test(landing);
  assert.equal(disabled, true, 'An unapproved advertising account is enabled in the build.');
    for (const width of [390, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      await context.addInitScript(() => {
        localStorage.setItem('access-free-tools-ad-consent', 'granted');
        localStorage.setItem('access-free-tools-analytics-opt-out', 'true');
      });
      const page = await context.newPage();
      const requests = { count: 0 };
      await configurePage(page, requests);
      for (const path of ['/', '/tools/percentage-calculator/', '/blog/remove-ai-writing-tells-before-publishing/', '/privacy-policy/', '/admin/']) {
        const response = await page.goto(`${publicUrl}${path}`, { waitUntil: 'networkidle' });
        assert.equal(response.status(), 200);
        assert.equal(await page.locator('h1').count(), 1);
        assert.equal(await page.locator('[data-advertising-choice]').count(), 0);
        assert.equal((await page.content()).includes('infolinks_main.js'), false);
        assert.equal((await page.content()).includes('adsbygoogle.js'), false);
        assert.equal(requests.count, 0, 'An unapproved network received an advertising request.');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), true);
      }
      await page.goto(`${publicUrl}/privacy-policy/`, { waitUntil: 'domcontentloaded' });
      await page.locator('footer [data-ad-privacy-open]').click();
      assert.equal(new URL(page.url()).hash, '#advertising');
      mkdirSync(outputDirectory, { recursive: true });
      await page.screenshot({ path: join(outputDirectory, `disabled-${width}.png`) });
      proof.checks.push(`At ${width}px, disabled networks send no requests despite old granted consent; privacy link works.`);
      await context.close();
    }
    const response = await fetch(`${localUrl}/ads.txt`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /^text\/plain/i);
    assert.equal((await response.text()).replace(/\r\n/g, '\n'), 'google.com, pub-4461993577253590, DIRECT, f08c47fec0942fa0\n');
    proof.checks.push('ads.txt is HTTP 200 plain text with the exact account-supplied seller line.');

  writeFileSync(join(outputDirectory, 'latest.json'), `${JSON.stringify(proof, null, 2)}\n`);
  console.log(`Monetization browser check passed (${proof.checks.length} checks).`);
  for (const check of proof.checks) console.log(`- ${check}`);
} catch (error) {
  process.stderr.write(previewLog);
  throw error;
} finally {
  if (browser) await browser.close();
  if (preview.exitCode === null && preview.signalCode === null) {
    const stopped = once(preview, 'exit');
    preview.kill();
    await stopped;
  }
}
