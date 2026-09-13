// Isolated component proof, not a full Astro build or a live Clarity recording.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { build } from 'esbuild';
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { attribute, readPage, repoRoot, workspaceFor } from './lib/clarity-masking-fixture.mjs';

const output = resolve(repoRoot, 'output/project-review-followup/SEC-02');
await mkdir(output, { recursive: true });
const pages = {
  tools: readPage('src/pages/tools/[slug].astro'),
  ask: readPage('src/pages/ask.astro'),
};
const layout = readPage('src/components/BaseLayout.astro');
const analytics = layout.elements.filter(({ name, node }) => name === 'script' && node.closingElement)
  .map(({ node }) => Buffer.from(layout.source).subarray(node.openingElement.end, node.closingElement?.start).toString())
  .find((code) => code.includes("document.addEventListener('aft:tool-action'"));
assert.ok(analytics, 'Use the actual first-party analytics handler');
const css = await readFile(resolve(repoRoot, 'src/styles/global.css'), 'utf8');

const bundle = await build({
  absWorkingDir: repoRoot,
  bundle: true,
  write: false,
  platform: 'browser',
  format: 'iife',
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"development"' },
  stdin: {
    resolveDir: repoRoot,
    loader: 'jsx',
    contents: `
      import React, { useEffect } from 'react';
      import { renderToString } from 'react-dom/server';
      import { hydrateRoot } from 'react-dom/client';
      import AiBrowserTool from './src/components/AiBrowserTool';
      import AskToolChat from './src/components/AskToolChat';
      import UtilityCalculator from './src/components/UtilityCalculator';
      const variant = document.body.dataset.variant;
      function Fixture() {
        useEffect(() => { document.body.dataset.hydrated = 'true'; }, []);
        if (variant === 'ask') return <AskToolChat />;
        if (variant === 'text-case-converter' || variant === 'password-generator') {
          return <UtilityCalculator variant={variant} />;
        }
        return <AiBrowserTool variant={variant} />;
      }
      const root = document.getElementById('island');
      // Exercise React hydration and later state updates within the source-derived page boundary.
      root.innerHTML = renderToString(<Fixture />);
      hydrateRoot(root, <Fixture />);
    `,
  },
  plugins: [{
    name: 'sec02-no-models',
    setup(builder) {
      builder.onResolve({ filter: /^(@huggingface\/transformers|tesseract\.js)$/ }, ({ path }) =>
        ({ path, namespace: 'sec02-mock' }));
      builder.onLoad({ filter: /.*/, namespace: 'sec02-mock' }, ({ path }) => ({
        contents: path === 'tesseract.js' ? `
          export async function createWorker() {
            return {
              async recognize(file) {
                if (file.name.includes('Failure')) throw new Error(file.name);
                return { data: { text: file.name.replace('.png', ''), confidence: 99 } };
              },
              async terminate() {},
            };
          }
        ` : `
          export const env = {};
          export async function pipeline() {
            return async (text) => [{ summary_text: text }];
          }
        `,
      }));
    },
  }],
});

function fixtureHtml(variant) {
  const page = variant === 'ask' ? pages.ask : pages.tools;
  const workspace = workspaceFor(page, variant === 'ask' ? 'AskToolChat' : 'AiBrowserTool');
  const props = { id: 'workspace' };
  for (const item of workspace.openingElement.attributes) {
    if (item.name?.type !== 'JSXIdentifier') continue;
    const key = item.name.name === 'class' ? 'className' : item.name.name;
    if (!item.value) props[key] = '';
    else if (item.value.type === 'Literal') props[key] = item.value.value;
  }
  if (attribute(workspace, 'data-aft-tool-usage-surface')) {
    Object.assign(props, {
      'data-tool-category': 'Synthetic testing',
      'data-tool-name': 'SEC-02 fixture',
      'data-tool-slug': variant,
    });
  }
  const boundary = renderToStaticMarkup(createElement('div', props, createElement('div', { id: 'island' })));
  return `<!doctype html><html><head><title>SEC-02 isolated component fixture</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/fixture.css">
    </head><body data-variant="${variant}"><main>
    <h1>SEC-02 isolated component fixture</h1><p id="public-prose">Public explanation outside the workspace.</p>
    <!--INFOLINKS_OFF-->${boundary}<!--INFOLINKS_ON-->
    </main><script src="/analytics.js"></script><script src="/fixture.js"></script></body></html>`;
}

const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=', 'base64');
const report = {
  generatedAt: new Date().toISOString(),
  scope: 'Source-derived Astro mask boundaries with real React renderers and hydration in an isolated fixture',
  limitations: 'No full Astro build, live Clarity SDK/configuration/recording, real OCR inference or model download. First-party telemetry is intercepted, never sent.',
  variants: [],
};
report.sourceSha256 = {};
for (const path of [
  'src/pages/tools/[slug].astro', 'src/pages/ask.astro', 'src/components/BaseLayout.astro',
  'src/components/AiBrowserTool.tsx', 'src/components/AskToolChat.tsx', 'src/components/UtilityCalculator.tsx',
]) {
  report.sourceSha256[path] = createHash('sha256').update(await readFile(resolve(repoRoot, path))).digest('hex');
}
const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [{ width: 1365, height: 900 }, { width: 390, height: 844 }]) {
    for (const variant of ['ocr', 'summary', 'keywords', 'text-case-converter', 'password-generator', 'ask']) {
      const context = await browser.newContext({ viewport, serviceWorkers: 'block' });
      try {
        const telemetry = [];
        const blockedRequests = [];
        const errors = [];
        let askCalls = 0;
        // Fulfill a virtual production origin to exercise the real analytics hostname gate.
        // Every request is intercepted; no route falls through to a network server.
        await context.route('**/*', async (route) => {
          const request = route.request();
          const url = new URL(request.url());
          if (url.origin !== 'https://accessfreetools.com') {
            blockedRequests.push(request.url());
            return route.abort();
          }
          if (url.pathname === '/api/analytics/events') {
            telemetry.push(JSON.parse(request.postData()));
            return route.fulfill({ status: 204 });
          }
          if (url.pathname === '/api/v1/ask') {
            askCalls += 1;
            const { message } = request.postDataJSON();
            const body = askCalls === 1 ? {
              ok: true, tool: { name: 'Synthetic tool', tool_url: '/tools/word-counter/' },
              run: { answer: message, inputs: { text: message }, result: { text: message },
                assumptions: [message], steps: [message], warnings: [message] },
            } : { ok: false, message };
            return route.fulfill({ json: body });
          }
          const fixtures = {
            '/fixture.js': ['text/javascript', bundle.outputFiles[0].text],
            '/analytics.js': ['text/javascript', analytics],
            '/fixture.css': ['text/css', css],
            [`/tools/${variant}/`]: ['text/html', fixtureHtml(variant)],
          };
          if (fixtures[url.pathname]) {
            const [contentType, body] = fixtures[url.pathname];
            return route.fulfill({ contentType, body });
          }
          blockedRequests.push(request.url());
          return route.abort();
        });
        await context.addInitScript(() => {
          window.__sec02Leaks = [];
          new MutationObserver(() => {
            const walker = document.createTreeWalker(document.body ?? document, NodeFilter.SHOW_TEXT);
            while (walker.nextNode()) {
              const node = walker.currentNode;
              const parent = node.parentElement;
              if (!parent || parent.closest('script, style')) continue;
              if (/masksentinel/i.test(node.textContent) &&
                (!parent.closest('[data-clarity-mask="true"]') || parent.closest('[data-clarity-unmask]'))) {
                window.__sec02Leaks.push('Unmasked synthetic text');
              }
            }
          }).observe(document, { childList: true, subtree: true, characterData: true, attributes: true });
        });
        const page = await context.newPage();
        page.on('pageerror', (error) => errors.push(error.message));
        page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
        await page.goto(`https://accessfreetools.com/tools/${variant}/`);
        await expect(page.locator('body')).toHaveAttribute('data-hydrated', 'true');
        assert.deepEqual(errors, []);
        await expect(page.locator('#workspace')).toHaveAttribute('data-clarity-mask', 'true');
        const primary = page.locator('.advanced-actions .button-primary');
        const action = variant === 'ask' ? '' : await primary.textContent();
        const sentinel = `MaskSentinel${variant.replace(/-/g, '')}Alpha`;
        const checks = [];
        async function checkMasked(selector, text) {
          const target = page.locator(selector);
          if (text) await expect(target.first()).toContainText(text);
          else await expect(target.first()).toBeVisible();
          assert.ok(await target.evaluateAll((nodes) => nodes.length > 0 && nodes.every((node) =>
            node.closest('[data-clarity-mask="true"]') && !node.closest('[data-clarity-unmask]'))));
          checks.push(selector);
        }
        if (variant === 'ocr') {
          await page.locator('input[type=file]').setInputFiles({ name: `${sentinel}.png`, mimeType: 'image/png', buffer: png });
          await primary.click();
          await checkMasked('.utility-text-output', sentinel);
          await checkMasked('.ai-side-panel ol li');
          await page.locator('input[type=file]').setInputFiles({ name: 'MaskSentinelOcrFailure.png', mimeType: 'image/png', buffer: png });
          await primary.click();
          await checkMasked('[role=alert]', 'MaskSentinelOcrFailure');
          await checkMasked('.ai-side-panel ol li');
        } else if (variant === 'ask') {
          await page.locator('textarea').fill(`${sentinel} <em>MaskSentinelEncoded</em>`);
          await page.locator('button[type=submit]').click();
          for (const selector of ['.ask-tool-answer', '.ask-proof-grid dd', '.ask-assumptions', '.ask-result ol', '.ask-warning']) {
            await checkMasked(selector, sentinel);
          }
          await expect(page.locator('.ask-result em')).toHaveCount(0);
          await page.locator('textarea').fill('MaskSentinelAskFailure');
          await page.locator('button[type=submit]').click();
          await checkMasked('.ask-result-error', 'MaskSentinelAskFailure');
          assert.equal(askCalls, 2);
        } else if (variant === 'password-generator') {
          await primary.click();
          await checkMasked('.utility-result-card');
          const password = await page.locator('.utility-result-card > strong').textContent();
          assert.ok(password.length >= 20);
          assert.ok(!JSON.stringify(telemetry).includes(password));
          await primary.click();
          await checkMasked('.utility-result-card');
        } else {
          const text = variant === 'summary'
            ? `${sentinel} is synthetic text for a masking regression. It has no private data and never uses a real model.`
            : variant === 'keywords' ? `${sentinel} `.repeat(4) : sentinel;
          await page.locator('textarea').fill(text);
          await primary.click();
          await checkMasked('.utility-text-output', new RegExp(sentinel, 'i'));
          await checkMasked('.advanced-side-panel ol li');
          await page.locator('textarea').fill(`${text} MaskSentinelSecond`);
          await primary.click();
          await checkMasked('.utility-text-output', /masksentinel/i);
          await expect(page.locator('.advanced-side-panel ol li')).toHaveCount(2);
          await checkMasked('.advanced-side-panel ol li');
        }
        const inputBoundary = await page.locator('input, textarea, select').evaluateAll((nodes) =>
          nodes.length > 0 && nodes.every((node) => node.closest('[data-clarity-mask="true"]')));
        assert.ok(inputBoundary);
        assert.equal(await page.locator('#public-prose').evaluate((node) => Boolean(node.closest('[data-clarity-mask]'))), false);
        if (['summary', 'keywords', 'text-case-converter', 'password-generator'].includes(variant)) {
          await expect.poll(() => telemetry.some((event) => event.type === 'tool_action' && event.action === action)).toBe(true);
        }
        await expect.poll(() => telemetry.some((event) => event.type === 'page_view')).toBe(true);
        assert.ok(!/masksentinel/i.test(JSON.stringify(telemetry)));
        assert.deepEqual(await page.evaluate(() => window.__sec02Leaks), []);
        assert.deepEqual(errors, []);
        // Font/image requests from the real stylesheet are blocked, too. Models and telemetry must not be attempted.
        assert.ok(!blockedRequests.some((url) => /clarity|ai-models|huggingface|ollama|onnx/i.test(url)));
        const screenshot = `${variant}-${viewport.width}.png`;
        await page.screenshot({ path: resolve(output, screenshot), fullPage: true });
        report.variants.push({ variant, viewport, checks, screenshot, inputBoundary,
          actions: telemetry.filter((event) => event.type === 'tool_action').map((event) => event.action),
          telemetryEvents: telemetry.length, sentinelInTelemetry: false, unmaskedSentinelMutations: 0,
          blockedRequests: blockedRequests.length, liveClaritySdkExecuted: false });
        console.log(`PASS ${variant} ${viewport.width}: masked hydration/results/rerenders; intercepted telemetry only`);
      } finally {
        await context.close();
      }
    }
  }
  report.status = 'passed';
} catch (error) {
  report.status = 'failed';
  report.error = error.message;
  throw error;
} finally {
  await browser.close();
  await writeFile(resolve(output, 'isolated-browser-proof.json'), `${JSON.stringify(report, null, 2)}\n`);
}
