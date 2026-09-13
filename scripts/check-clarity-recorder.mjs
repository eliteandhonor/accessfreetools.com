// SEC-02 only. No site build, install, account configuration, or network telemetry.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import vm from 'node:vm';
import { build } from 'esbuild';
import { chromium } from 'playwright';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readPage, repoRoot, workspaceFor } from './lib/clarity-masking-fixture.mjs';
import { createRecorderProof, sha256 } from './lib/clarity-recorder-proof.mjs';

const output = resolve(repoRoot, 'output/project-review-followup/SEC-02/recorder');
const sdkRoot = resolve(output, 'sdk');
const version = '0.8.68';
const sdkCommit = 'ff66ffc1cce7f60e8be2a32866f13505b89e5f07';
const packages = [
  { name: 'clarity-js', file: 'clarity.min.js',
    integrity: '3oB8v2Yu00iLEt6m5SB9uYHfT2wgBMXw1o9EcbzGgAJBNiOxU2NALkGPg4UY8ivNgOxFz2e4faUXvjeGnZyrwg==',
    hash: '84e72e402c83dea9d77a81089113a0342d185649ac9fb5088cdadae99c346996' },
  { name: 'clarity-decode', file: 'clarity.decode.js',
    integrity: 'YMFBSeUc9v4eKxjCIFY8z13qifwTZBfmivYm2Q5LHHGf6l2KTrucvgtScWPR61yL1xt+ehk/6FSead/8qLlolA==',
    hash: 'eb5ccdfb750c9645e7833ab1f98db576f5247a6d096fd462be7ec7a949762cad' },
];
const notices = {
  LICENSE: 'c2cfccb812fe482101a8f04597dfc5a9991a6b2748266c47ac91b6a5aae15383',
  'NOTICE.txt': '0c44d7153c8142d2f76d4d49a81684d54ef1d680fba8e78d721d74ddb84fe70e',
};
const origin = 'http://127.0.0.1:43289'; // Virtual loopback origin; nothing listens on this port.
const collector = 'https://collector.clarity.invalid/collect';
function requireProof(condition, gate) {
  if (!condition) throw Object.assign(new Error('SEC-02 gate'), { proofGate: gate });
}

async function acquireSdk() {
  // Acquisition is separate from real mode and precedes any synthetic recording.
  async function download(url, maxBytes) {
    const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(20000) });
    requireProof(response.ok, 'sdk-download-status');
    const chunks = [];
    let size = 0;
    for await (const chunk of response.body) {
      size += chunk.length;
      requireProof(size <= maxBytes, 'sdk-download-limit');
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }
  for (const pkg of packages) {
    const dir = resolve(sdkRoot, pkg.name);
    const packageDir = resolve(sdkRoot, 'node_modules', pkg.name);
    await mkdir(resolve(packageDir, 'build'), { recursive: true });
    await mkdir(dir, { recursive: true });
    const bytes = await download(`https://registry.npmjs.org/${pkg.name}/-/${pkg.name}-${version}.tgz`, 4 * 1024 * 1024);
    requireProof(createHash('sha512').update(bytes).digest('base64') === pkg.integrity, 'sdk-integrity');
    const archive = resolve(dir, 'package.tgz');
    await writeFile(archive, bytes);
    // Fixed member names, stdout extraction: archive paths cannot write outside the owned output.
    for (const member of [`package/build/${pkg.file}`, 'package/package.json']) {
      const extracted = execFileSync('tar', ['-xOzf', archive, member], { maxBuffer: 4 * 1024 * 1024, windowsHide: true });
      await writeFile(resolve(packageDir, member.slice('package/'.length)), extracted);
    }
  }
  for (const [name, hash] of Object.entries(notices)) {
    const bytes = await download(`https://raw.githubusercontent.com/microsoft/clarity/${sdkCommit}/${name}`, 65536);
    requireProof(sha256(bytes) === hash, 'sdk-license-hash');
    await writeFile(resolve(sdkRoot, name), bytes);
  }
}

async function loadSdk() {
  const files = {};
  const evidence = { version, commit: sdkCommit, license: 'MIT', packages: [], notices: {} };
  for (const pkg of packages) {
    const dir = resolve(sdkRoot, pkg.name);
    const packageDir = resolve(sdkRoot, 'node_modules', pkg.name);
    const archive = await readFile(resolve(dir, 'package.tgz'));
    requireProof(createHash('sha512').update(archive).digest('base64') === pkg.integrity, 'sdk-archive-integrity');
    const bytes = await readFile(resolve(packageDir, `build/${pkg.file}`));
    requireProof(sha256(bytes) === pkg.hash, 'sdk-build-hash');
    const metadata = JSON.parse(await readFile(resolve(packageDir, 'package.json'), 'utf8'));
    requireProof(metadata.name === pkg.name && metadata.version === version && metadata.license === 'MIT' &&
      ['https://github.com/microsoft/clarity.git', 'git+https://github.com/microsoft/clarity.git'].includes(metadata.repository.url), 'sdk-metadata');
    files[pkg.name] = bytes.toString('utf8');
    evidence.packages.push({ name: pkg.name, version, license: metadata.license,
      url: `https://registry.npmjs.org/${pkg.name}/-/${pkg.name}-${version}.tgz`,
      sha512: pkg.integrity, archiveSha256: sha256(archive), sourceSha256: pkg.hash, bytes: bytes.length });
  }
  for (const [name, hash] of Object.entries(notices)) {
    requireProof(sha256(await readFile(resolve(sdkRoot, name))) === hash, 'sdk-license-hash');
    evidence.notices[name] = hash;
  }
  return { files, evidence };
}

async function componentBundle() {
  // Adapted from check-clarity-masking.mjs: same real renderers and source-derived wrappers.
  return build({ absWorkingDir: repoRoot, bundle: true, write: false, metafile: true,
    platform: 'browser', format: 'iife', jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"development"' },
    stdin: { resolveDir: repoRoot, loader: 'jsx', contents: `
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
        if (['text-case-converter', 'password-generator'].includes(variant)) return <UtilityCalculator variant={variant} />;
        return <AiBrowserTool variant={variant} />;
      }
      const root = document.getElementById('island');
      root.innerHTML = renderToString(<Fixture />);
      window.secHydrate = () => hydrateRoot(root, <Fixture />, {
        onRecoverableError() { window.secHydrationErrors = (window.secHydrationErrors || 0) + 1; }
      });
    ` },
    plugins: [{ name: 'sec02-synthetic-inference-only', setup(builder) {
      builder.onResolve({ filter: /^(@huggingface\/transformers|\.\.\/lib\/browserOcrWorker)$/ }, ({ path }) => ({ path, namespace: 'sec02' }));
      builder.onLoad({ filter: /.*/, namespace: 'sec02' }, ({ path }) => ({ contents: path === '../lib/browserOcrWorker' ? `
        export async function recognizeOcrImage(image, language, paths, signal) {
          signal.throwIfAborted();
          const text = window.secOcrValue;
          if (text.includes('Failure')) throw new Error(text);
          return { text, confidence: 99 };
        }
      ` : `export const env = {}; export async function pipeline() { return async text => [{ summary_text: text }]; }` }));
    } }],
  });
}

function fixtureHtml(variant, negativeControl, markers) {
  const page = readPage(variant === 'ask' ? 'src/pages/ask.astro' : 'src/pages/tools/[slug].astro');
  const component = variant === 'ask' ? 'AskToolChat' : ['text-case-converter', 'password-generator'].includes(variant)
    ? 'UtilityCalculator' : 'AiBrowserTool';
  const workspace = workspaceFor(page, component);
  const props = { id: 'workspace' };
  for (const item of workspace.openingElement.attributes) {
    if (item.name?.type !== 'JSXIdentifier') continue;
    const key = item.name.name === 'class' ? 'className' : item.name.name;
    if (!item.value) props[key] = '';
    else if (item.value.type === 'Literal') props[key] = item.value.value;
  }
  requireProof(props['data-clarity-mask'] === 'true', 'source-boundary-missing');
  // Broken-boundary control changes the ephemeral fixture only, before recorder discovery.
  if (negativeControl) delete props['data-clarity-mask'];
  const boundary = renderToStaticMarkup(createElement('div', props,
    createElement('p', { id: 'hydration-probe' }, markers[0]), createElement('div', { id: 'island' })));
  return `<!doctype html><html><head><title>Local recorder proof</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/fixture.css">
    </head><body data-variant="${variant}"><main><p id="public-control">PublicAlphaControl</p>
    ${boundary}</main><script src="/fixture.js"></script><script src="/recorder.js"></script></body></html>`;
}

async function until(test, gate, timeout = 12000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    if (await test()) return;
    await new Promise((done) => setTimeout(done, 100));
  }
  requireProof(false, gate);
}

async function realProof(sdk) {
  const bundle = await componentBundle();
  const css = await readFile(resolve(repoRoot, 'src/styles/global.css'), 'utf8');
  const sourcePaths = [...new Set([
    ...Object.keys(bundle.metafile.inputs).filter((path) => path.startsWith('src/')),
    'src/pages/tools/[slug].astro', 'src/pages/ask.astro', 'src/components/BaseLayout.astro', 'src/styles/global.css',
    'src/lib/browserOcrWorker.ts',
    'scripts/check-clarity-recorder.mjs', 'scripts/lib/clarity-recorder-proof.mjs',
    'scripts/lib/clarity-recorder-proof.test.mjs', 'scripts/lib/clarity-masking-fixture.mjs',
  ])].sort();
  const report = { task: 'SEC-02', generatedAt: new Date().toISOString(), node: process.version,
    sourceRevision: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repoRoot, encoding: 'utf8', windowsHide: true }).trim(),
    scope: 'official recorder, source-derived Astro boundary, actual React components; not a full Astro build',
    sdk: sdk.evidence, bundleSha256: sha256(bundle.outputFiles[0].contents), sourceSha256: {}, cases: [],
    privacy: { ephemeralBrowser: true, allRequestsIntercepted: true, externalProxyDisabled: true,
      serviceWorkersBlocked: true, websocketConnectionsBlocked: true, rawPayloadsSaved: false,
      screenshotsTracesHarLogsSaved: false, accountAccess: false, modelDownloads: false,
      publicOrAccountChanges: false, localServerStarted: false },
  };
  for (const path of sourcePaths) report.sourceSha256[path] = sha256(await readFile(resolve(repoRoot, path)));
  let browser;
  let interrupted = false;
  const stop = () => { interrupted = true; void browser?.close().catch(() => {}); };
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
  const deadline = setTimeout(stop, 300000);
  try {
    browser = await chromium.launch({ headless: true, timeout: 20000,
      // Every renderer request is fulfilled/aborted below. This dead loopback proxy is a second barrier.
      proxy: { server: 'http://127.0.0.1:9' },
      args: ['--proxy-bypass-list=<-loopback>', '--host-resolver-rules=MAP * ~NOTFOUND',
        '--disable-background-networking', '--disable-component-update', '--disable-sync', '--disable-quic',
        '--force-webrtc-ip-handling-policy=disable_non_proxied_udp'],
    });
    const cases = [1365, 390].flatMap((width) =>
      ['ocr', 'summary', 'keywords', 'text-case-converter', 'password-generator', 'ask']
        .map((variant) => ({ variant, width, negativeControl: false })));
    cases.push({ variant: 'text-case-converter', width: 1365, negativeControl: true },
      { variant: 'ask', width: 1365, negativeControl: true });
    for (const scenario of cases) {
      requireProof(!interrupted, 'run-interrupted');
      const { variant, width, negativeControl } = scenario;
      const markers = ['SyntheticHydrationAlphabetic',
        variant === 'password-generator' ? 'Q'.repeat(20) : 'SyntheticFirstAlphabetic',
        variant === 'password-generator' ? 'R'.repeat(20) : 'SyntheticSecondAlphabetic'];
      if (['ocr', 'ask'].includes(variant)) markers.push('SyntheticFailureAlphabetic');
      const controls = ['PublicAlphaControl', 'PublicBetaControl', 'PublicGammaControl', 'PublicDeltaControl'];
      if (markers.length === 4) controls.push('PublicEpsilonControl');
      const row = { ...scenario, hydrated: false, rerendered: false, decodedSurfaceChecks: 0,
        fulfilledRequests: 0, blockedRequests: 0, collectorRequests: 0, forwardedRequests: 0,
        websocketAttempts: 0, unexpectedRequests: 0, pageErrors: 0, consoleErrors: 0,
        decoderDiagnostics: 0, contextsClosed: false, passed: false };
      report.cases.push(row);
      const sandbox = vm.createContext({ exports: {}, console: {
        warn() { row.decoderDiagnostics += 1; }, error() { row.decoderDiagnostics += 1; }, log() {},
      } });
      vm.runInContext(sdk.files['clarity-decode'], sandbox, { timeout: 2000 });
      const proof = createRecorderProof({ version, privateMarkers: markers, controlMarkers: controls,
        decode: (text) => {
          sandbox.input = text;
          try { return vm.runInContext('exports.decode(input)', sandbox, { timeout: 2000 }); }
          finally { delete sandbox.input; }
        },
      });
      const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 },
        serviceWorkers: 'block', acceptDownloads: false });
      let stage = 'routes';
      let askCalls = 0;
      try {
        context.setDefaultTimeout(8000);
        await context.routeWebSocket('**/*', (socket) => { row.websocketAttempts += 1; socket.close(); });
        await context.route('**/*', async (route) => {
          const request = route.request();
          const url = new URL(request.url());
          // Nothing falls through: no continue(), fetch(), proxying or external collector response.
          if (url.href === collector && request.method() === 'POST') {
            row.collectorRequests += 1;
            proof.capture(request.postDataBuffer());
            return route.fulfill({ status: 200, body: '', headers: {
              'access-control-allow-origin': origin, 'access-control-allow-credentials': 'true',
            } });
          }
          if (url.href === collector && request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: {
            'access-control-allow-origin': origin, 'access-control-allow-credentials': 'true',
            'access-control-allow-methods': 'POST', 'access-control-allow-headers': '*',
          } });
          if (url.origin === origin && url.pathname === '/api/v1/ask' && request.method() === 'POST') {
            askCalls += 1;
            const { message } = request.postDataJSON();
            return route.fulfill({ json: askCalls <= 2 ? { ok: true,
              tool: { name: 'Synthetic tool', tool_url: '/tools/word-counter/' },
              run: { answer: message, inputs: { text: message }, result: { text: message },
                assumptions: [message], steps: [message], warnings: [message] },
            } : { ok: false, message } });
          }
          const fixtures = {
            '/': ['text/html', fixtureHtml(variant, negativeControl, markers)],
            '/fixture.js': ['text/javascript', bundle.outputFiles[0].text],
            '/recorder.js': ['text/javascript', sdk.files['clarity-js']],
            '/fixture.css': ['text/css', css],
          };
          if (url.origin === origin && request.method() === 'GET' && fixtures[url.pathname]) {
            row.fulfilledRequests += 1;
            const [contentType, body] = fixtures[url.pathname];
            return route.fulfill({ contentType, body });
          }
          row.blockedRequests += 1;
          // Known stylesheet font/image assets are unnecessary; every other attempt fails the run.
          if (!['font', 'image'].includes(request.resourceType())) row.unexpectedRequests += 1;
          return route.abort('blockedbyclient');
        });
        const page = await context.newPage();
        page.on('pageerror', () => { row.pageErrors += 1; });
        page.on('console', (message) => {
          if (message.type() === 'error' && !message.text().startsWith('Failed to load resource:')) row.consoleErrors += 1;
        });
        stage = 'sdk-start-discovery';
        await page.goto(`${origin}/`, { waitUntil: 'load' });
        row.sdkVersionMatches = await page.evaluate((expected) => window.clarity?.v === expected, version);
        requireProof(row.sdkVersionMatches, stage);
        await page.evaluate((upload) => window.clarity('start', {
          projectId: 'secproof', upload, fallback: upload, delay: 500,
          lean: false, content: true, track: false, cookies: [], mask: [], unmask: [],
          report: null, modules: [], fraud: false, throttleDom: false,
        }), collector);
        await until(() => proof.controlSeen(controls[0]), stage);
        stage = 'hydration';
        await page.evaluate(() => window.secHydrate());
        await until(() => page.evaluate(() => document.body.dataset.hydrated === 'true'), stage);
        requireProof(await page.evaluate(() => !window.secHydrationErrors), 'hydration-recovery');
        row.hydrated = true;
        async function flush(controlIndex, surfaces = []) {
          await page.locator('#public-control').evaluate((node, text) => { node.textContent = text; }, controls[controlIndex]);
          await until(() => proof.controlSeen(controls[controlIndex]), 'recorder-flush');
          if (!negativeControl) {
            for (const surface of surfaces) {
              await until(() => proof.maskedTextCount(surface, surface.endsWith('side-panel') ? 'OL' : null) > 0,
                'decoded-masked-surface');
              row.decodedSurfaceChecks += 1;
            }
          }
          requireProof(proof.summary().decodeFailures === 0 && row.decoderDiagnostics === 0, 'decode-failure');
        }
        await flush(1);
        const primary = page.locator('.advanced-actions .button-primary');
        async function rendered(selector, marker) {
          await until(async () => (await page.locator(selector).first().textContent())?.toLowerCase().includes(marker.toLowerCase()),
            'component-render');
        }
        const png = variant === 'ocr' ? Buffer.from(await page.evaluate(() => {
          const canvas = document.createElement('canvas');
          canvas.width = 8; canvas.height = 8;
          canvas.getContext('2d').fillRect(0, 0, 8, 8);
          return Array.from(atob(canvas.toDataURL('image/png').split(',')[1]), (c) => c.charCodeAt(0));
        })) : null;
        for (const index of [1, 2]) {
          stage = index === 1 ? 'first-output' : 'rerender-output';
          let surfaces;
          if (variant === 'ask') {
            await page.locator('textarea').fill(markers[index]);
            await page.locator('button[type=submit]').click();
            surfaces = ['ask-tool-answer', 'ask-proof-grid', 'ask-assumptions', 'ask-result', 'ask-warning'];
            for (const surface of surfaces) await rendered(`.${surface}`, markers[index]);
          } else if (variant === 'ocr') {
            await page.evaluate((text) => { window.secOcrValue = text; }, markers[index]);
            await page.locator('input[type=file]').setInputFiles({ name: `${markers[index]}.png`, mimeType: 'image/png', buffer: png });
            await primary.click();
            await rendered('.utility-text-output', markers[index]);
            await until(async () => await page.locator('.ai-side-panel ol li').count() === index, 'ocr-history');
            surfaces = ['utility-text-output', 'ai-side-panel'];
          } else if (variant === 'password-generator') {
            if (index === 1) for (const label of ['Lowercase letters', 'Numbers', 'Symbols', 'Avoid ambiguous characters']) {
              await page.getByLabel(label, { exact: true }).uncheck();
            }
            // Deterministic synthetic alphabetic output, never an account credential.
            await page.evaluate((value) => { window.secRandom = crypto.getRandomValues.bind(crypto);
              crypto.getRandomValues = (array) => array.fill(value); }, index === 1 ? 16 : 17);
            try {
              await primary.click();
              await rendered('.utility-result-card > strong', markers[index]);
            } finally { await page.evaluate(() => { crypto.getRandomValues = window.secRandom; delete window.secRandom; }); }
            surfaces = ['utility-result-card'];
          } else {
            const text = variant === 'keywords' ? `${markers[index]} `.repeat(4) : variant === 'summary'
              ? `${markers[index]} is alphabetic synthetic text used only for this local privacy test. No model is downloaded.` : markers[index];
            await page.locator('textarea').fill(text);
            await primary.click();
            await rendered('.utility-text-output', markers[index]);
            if (variant === 'summary') {
              await until(async () => await page.locator('.advanced-side-panel ol li').count() === index, 'summary-history');
            } else await rendered('.advanced-side-panel ol', markers[index]);
            surfaces = ['utility-text-output', 'advanced-side-panel'];
          }
          await flush(index + 1, surfaces);
          if (index === 2) row.rerendered = true;
        }
        if (['ocr', 'ask'].includes(variant)) {
          stage = 'error-output';
          if (variant === 'ocr') {
            await page.evaluate((text) => { window.secOcrValue = text; }, markers[3]);
            await page.locator('input[type=file]').setInputFiles({ name: `${markers[3]}.png`, mimeType: 'image/png', buffer: png });
            await primary.click();
            await rendered('[role=alert]', markers[3]);
            await flush(4, ['calculator-error', 'ai-side-panel']);
          } else {
            await page.locator('textarea').fill(markers[3]);
            await page.locator('button[type=submit]').click();
            await rendered('.ask-result-error', markers[3]);
            await flush(4, ['ask-result-error']);
          }
        }
        stage = 'final-beacon';
        const beforeStop = row.collectorRequests;
        await page.evaluate(() => window.clarity('stop'));
        await until(() => row.collectorRequests > beforeStop, stage);
        row.finalBeaconCaptured = proof.summary().plainPayloads > 0;
        row.compressedUploadCaptured = proof.summary().gzipPayloads > 0;
        stage = 'acceptance';
        requireProof(proof.verdict(row) && row.finalBeaconCaptured && row.compressedUploadCaptured &&
          row.unexpectedRequests === 0 && row.websocketAttempts === 0 && row.pageErrors === 0 &&
          row.consoleErrors === 0 && row.decoderDiagnostics === 0, stage);
        row.passed = true;
      } catch (error) {
        // No Playwright assertion/exception text: it can contain DOM or request bodies.
        row.failedGate = stage;
        if (error.proofGate) row.failedCheck = error.proofGate;
      } finally {
        row.recorder = proof.summary();
        await context.close();
        row.contextsClosed = true;
      }
      console.log(`${row.passed ? 'PASS' : 'FAIL'} ${variant} ${width} ${negativeControl ? 'broken-boundary-control' : 'masked'}${row.failedGate ? ` gate=${row.failedGate}` : ''}`);
    }
    report.sourceUnchanged = true;
    for (const [path, hash] of Object.entries(report.sourceSha256)) {
      if (sha256(await readFile(resolve(repoRoot, path))) !== hash) report.sourceUnchanged = false;
    }
    report.passed = report.cases.length === 14 && report.cases.every((row) => row.passed && row.contextsClosed) && report.sourceUnchanged;
  } catch {
    report.passed = false;
    report.setupOrInterruptionFailure = true;
  } finally {
    clearTimeout(deadline);
    process.removeListener('SIGINT', stop);
    process.removeListener('SIGTERM', stop);
    if (browser) await browser.close();
    report.browserClosed = !browser?.isConnected();
    report.finishedAt = new Date().toISOString();
    await writeFile(resolve(output, 'real-recorder-proof.json'), `${JSON.stringify(report, null, 2)}\n`);
  }
  return report.passed && report.browserClosed;
}

try {
  requireProof(process.versions.node.split('.')[0] === '24', 'node24-required');
  requireProof(process.argv.length === 3 && ['--acquire-sdk', '--real'].includes(process.argv[2]), 'usage');
  execFileSync('git', ['check-ignore', output], { cwd: repoRoot, stdio: 'pipe', windowsHide: true });
  await mkdir(output, { recursive: true });
  if (process.argv[2] === '--acquire-sdk') await acquireSdk();
  const sdk = await loadSdk();
  await writeFile(resolve(output, 'sdk-provenance.json'), `${JSON.stringify(sdk.evidence, null, 2)}\n`);
  if (process.argv[2] === '--real') process.exitCode = await realProof(sdk) ? 0 : 1;
  else console.log(`Verified official Clarity recorder and decoder ${version}; MIT; pinned SHA256/SHA512.`);
} catch (error) {
  if (error.proofGate) console.error(`SEC-02 setup check: ${error.proofGate}`);
  console.error('SEC-02 gate: Node 24, exact --acquire-sdk or --real, ignored output, verified SDK/license and existing harness dependencies required. No raw exception retained.');
  process.exitCode = 1;
}
