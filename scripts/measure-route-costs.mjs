import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';
import { cpus, platform, release } from 'node:os';
import { chromium } from 'playwright';
import { classifyAccessibilityRequest } from './lib/accessibility-report.mjs';
import { summarizeRouteResources } from './lib/route-cost-report.mjs';

const root = resolve('dist/client');
const routes = ['/tools/', '/tools/percentage-calculator/', '/gallery/finance/',
  '/blog/free-ai-skills-open-source-tools-organic-growth/', '/tools/image-to-text-ocr-tool/',
  '/tools/text-to-speech-audiobook-generator/'];
for (const route of routes) if (!existsSync(resolve(root, `.${route}`, 'index.html'))) throw new Error(`Build first: missing ${route}`);
const stamp = new Date().toISOString().replaceAll(':', '-');
const output = resolve('output/project-review-followup/UX-03/route-costs', stamp);
mkdirSync(output, { recursive: true });
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const hashes = new Map();
const blockedServerRequests = {};
let origin;
// CSP isolates the local fixture without Playwright routing, which disables HTTP caching.
const csp = "default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; media-src 'self' blob:; frame-src 'none'; worker-src 'none'; form-action 'none'; base-uri 'self'";
const server = createServer((req, res) => {
  try {
    const url = new URL(req.url, origin);
    const decision = classifyAccessibilityRequest(url.href, req.method, origin);
    if (decision !== 'allowed') {
      blockedServerRequests[decision] = (blockedServerRequests[decision] ?? 0) + 1;
      res.writeHead(403).end(); return;
    }
    let file = resolve(root, `.${decodeURIComponent(url.pathname)}`);
    if (file !== root && !file.startsWith(`${root}${sep}`)) { res.writeHead(403).end(); return; }
    if (existsSync(file) && statSync(file).isDirectory()) file = resolve(file, 'index.html');
    if (!existsSync(file)) { res.writeHead(404).end(); return; }
    if (!hashes.has(file)) hashes.set(file, createHash('sha256').update(readFileSync(file)).digest('hex'));
    res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream',
      'Content-Length': statSync(file).size, 'Content-Security-Policy': csp,
      'Cache-Control': extname(file) === '.html' ? 'no-store' : 'public, max-age=3600' });
    createReadStream(file).pipe(res);
  } catch { res.writeHead(400).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
origin = `http://127.0.0.1:${server.address().port}`;
let browser;
const report = { generatedAt: new Date().toISOString(), conditions: {
  runtime: process.version, host: `${platform()} ${release()}`, logicalCpus: cpus().length,
  cpu: 'Native speed; no CPU throttle. Other host workloads not controlled.', network: 'Loopback HTTP; uncompressed files; no network throttle.',
  cache: 'Cold: new context and cleared Chromium HTTP cache. Warm: new page in the same context, same route; HTTP caching enabled. HTML no-store; static assets max-age=3600.',
  isolation: 'CSP blocks external connections/embeds/workers; no user interactions or inputs. DNT, analytics opt-out, owner ad suppression and service-worker blocking.',
  timing: 'Load plus 1500ms observation window. LCP and layout-shift sum are local lab observations, not field CWV; INP unmeasured. Warm/cold differences include CPU and code-cache variance.',
  limits: 'Desktop Chromium only, including mobile viewport emulation, not mobile-device/browser compatibility or production speed. Model attempts fail the lazy-load check even when blocked.',
}, runs: [], blockedServerRequests, pass: false };
try {
  browser = await chromium.launch();
  report.conditions.browser = browser.version();
  for (const viewport of [{ width: 1365, height: 900 }, { width: 390, height: 844 }]) {
    for (const route of routes) for (let repetition = 1; repetition <= 3; repetition += 1) {
      const context = await browser.newContext({ viewport, serviceWorkers: 'block', extraHTTPHeaders: { DNT: '1' } });
      try {
        await context.addInitScript(() => {
          try {
            localStorage.setItem('access-free-tools-analytics-opt-out', 'true');
            localStorage.setItem('access-free-tools-owner-ads-disabled', 'true');
          } catch { /* Some embedded contexts have no storage. */ }
          const metrics = window.__routeCost = { lcpMs: null, layoutShiftSum: 0, longTasks: [], csp: [], supported: [] };
          for (const type of ['largest-contentful-paint', 'layout-shift', 'longtask']) {
            if (!PerformanceObserver.supportedEntryTypes.includes(type)) continue;
            metrics.supported.push(type);
            new PerformanceObserver(list => {
              for (const entry of list.getEntries()) {
                if (type === 'largest-contentful-paint') metrics.lcpMs = entry.startTime;
                else if (type === 'layout-shift' && !entry.hadRecentInput) metrics.layoutShiftSum += entry.value;
                else if (type === 'longtask') metrics.longTasks.push(entry.duration);
              }
            }).observe({ type, buffered: true });
          }
          addEventListener('securitypolicyviolation', event => metrics.csp.push({ directive: event.effectiveDirective,
            modelAttempt: /onnx|wasm|traineddata|huggingface|ai-models|transformers|kokoro|supertonic/i.test(event.blockedURI) }));
        });
        for (const cache of ['cold', 'warm']) {
          const page = await context.newPage();
          const cdp = await context.newCDPSession(page);
          await cdp.send('Network.enable');
          await cdp.send('Network.setCacheDisabled', { cacheDisabled: false });
          if (cache === 'cold') await cdp.send('Network.clearBrowserCache');
          const requested = [];
          const failed = [];
          const errors = [];
          const failedResponses = [];
          page.on('request', request => requested.push(classifyAccessibilityRequest(request.url(), request.method(), origin)));
          page.on('requestfailed', request => failed.push(classifyAccessibilityRequest(request.url(), request.method(), origin)));
          page.on('pageerror', () => errors.push('page-error'));
          page.on('response', response => {
            if (response.status() >= 400) failedResponses.push({ status: response.status(),
              requestClass: classifyAccessibilityRequest(response.url(), response.request().method(), origin) });
          });
          const response = await page.goto(`${origin}${route}`, { waitUntil: 'load', timeout: 30000 });
          await page.waitForTimeout(1500);
          const timing = await page.evaluate(() => ({ ...window.__routeCost,
            navigation: performance.getEntriesByType('navigation')[0]?.toJSON(),
            resources: performance.getEntriesByType('resource').map(entry => entry.toJSON()),
            hydrated: [...document.querySelectorAll('astro-island[client="load"], astro-island[client="idle"]')].every(node => !node.hasAttribute('ssr')) }));
          const resources = summarizeRouteResources([timing.navigation, ...timing.resources].filter(Boolean), origin);
          const modelAttempts = requested.filter(value => value === 'model-or-runtime').length + timing.csp.filter(value => value.modelAttempt).length;
          const check = { route, viewport, repetition, cache, status: response.status(), resources,
            loadMs: timing.navigation?.loadEventEnd ?? null, domContentLoadedMs: timing.navigation?.domContentLoadedEventEnd ?? null,
            lcpMs: timing.lcpMs, layoutShiftSum: timing.layoutShiftSum,
            longTaskCount: timing.longTasks.length, longTaskTotalMs: timing.longTasks.reduce((a, b) => a + b, 0),
            observerSupport: timing.supported, csp: timing.csp, requestCount: requested.length, failedRequestClasses: failed,
            modelAttempts, failedResponses, pageErrors: errors.length, hydrated: timing.hydrated,
            warmCacheObserved: cache === 'warm' ? resources.zeroTransferBodyEntries > 0 : null };
          check.pass = check.status === 200 && !modelAttempts && !errors.length && !resources.invalidEntries && check.hydrated &&
            !failedResponses.length && !failed.includes('allowed') && (cache !== 'warm' || check.warmCacheObserved);
          report.runs.push(check);
          console.log(`${cache} ${viewport.width} ${route} #${repetition}: ${resources.transferBytes} transfer bytes; pass=${check.pass}`);
          await page.close();
        }
      } finally { await context.close(); }
    }
  }
  report.pass = report.runs.length === 72 && report.runs.every(run => run.pass);
} catch (error) { report.failure = error.name; process.exitCode = 1; }
finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
  report.builtFiles = [...hashes].map(([file, sha256]) => ({ path: file.slice(root.length + 1).replaceAll('\\', '/'), sha256 }));
  report.buildUnchanged = [...hashes].every(([file, hash]) => existsSync(file) && createHash('sha256').update(readFileSync(file)).digest('hex') === hash);
  report.pass &&= report.buildUnchanged;
  report.completedAt = new Date().toISOString();
  writeFileSync(resolve(output, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Saved ${output}/report.json; no production-speed or accessibility-conformance claim.`);
  if (!report.pass) process.exitCode = 1;
}
