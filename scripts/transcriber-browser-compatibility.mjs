import { createHash } from 'node:crypto';
import { createReadStream, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, isAbsolute, join, relative, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium, firefox, webkit } from 'playwright';
import { classifyTranscriberRequest, installResourceProof, matchSyntheticSpeech, parseSubtitleCues, summarizeSubtitleProof, validateSyntheticFixtureDuration } from './lib/transcriber-browser-proof.mjs';
import { loadVerifiedModelCache } from './lib/transcriber-model-cache.mjs';
import { validateTranscriberExports } from './lib/transcriber-compatibility-exports.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const argument = (key, fallback) => process.argv.find((arg) => arg.startsWith(`--${key}=`))?.slice(key.length + 3) ?? fallback;
const browserName = argument('browser', 'chrome');
const fixtureName = argument('fixture', 'short');
const mutationMode = process.argv.includes('--mutations');
const observeModels = process.argv.includes('--observe-models');
const cachedModels = process.argv.includes('--verified-model-cache');
const multilingual = process.argv.includes('--multilingual');
if (cachedModels && observeModels) throw new Error('Cached and remote-observation modes must remain separate.');
if (!['chrome', 'msedge', 'chromium', 'firefox', 'webkit'].includes(browserName)) throw new Error('Unknown browser.');
const fixturePaths = {
  short: 'public/audio/tts-voice-samples/kokoro-82m/af_bella.mp3',
  'hour-mp3': 'output/browser-transcriber-pilot/fixtures/hour-bounded.mp3',
  'hour-mp4': 'output/browser-transcriber-pilot/fixtures/hour.mp4',
};
if (!fixturePaths[fixtureName]) throw new Error('Unknown synthetic fixture.');
const fixture = join(root, fixturePaths[fixtureName]);
const dist = join(root, 'dist', existsSync(join(root, 'dist/client')) ? 'client' : '');
const staticPaths = new Set();
for (const path of readdirSync(dist, { recursive: true, withFileTypes: true })) {
  if (!path.isFile()) continue;
  const url = `/${relative(dist, join(path.parentPath, path.name)).replaceAll('\\', '/')}`;
  staticPaths.add(url);
  if (url.endsWith('/index.html')) staticPaths.add(url.slice(0, -10));
}
if (!existsSync(fixture) || !existsSync(join(dist, 'tools/audio-video-transcriber/index.html'))) throw new Error('Build or synthetic fixture missing.');
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const directory = join(root, 'output/browser-transcriber-pilot/compatibility', `${stamp}-${browserName}-${fixtureName}${mutationMode ? '-mutations' : ''}`);
mkdirSync(directory, { recursive: true });
const hash = (data) => createHash('sha256').update(data).digest('hex');
const duration = Number(JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'json', fixture], { encoding: 'utf8' })).format.duration);
const report = {
  generatedAt: new Date().toISOString(), status: 'running', browserName, fixtureName, fixtureSha256: hash(readFileSync(fixture)),
  duration, mutationMode, networkMode: cachedModels ? 'verified-model-cache' : observeModels ? 'observe-models' : 'intercept-all', scope: 'isolated browser inference on synthetic media; not a physical mobile, production telemetry, or seven-day beta pass',
  sourceHashes: Object.fromEntries(['src/components/AudioVideoTranscriber.tsx', 'src/workers/transcriber-asr.worker.ts', 'src/workers/transcriber-media.worker.ts', 'src/lib/browserTranscriber.ts', 'src/lib/browserTranscriberLifecycle.ts', 'src/lib/browserTranscriberAlignment.ts', 'src/lib/browserTranscriberWindows.ts', 'src/lib/browserTranscriberOverlapRepair.ts', 'src/lib/browserTranscriberOverlapCoverage.ts', 'src/lib/whisperFrameBounds.ts']
    .map((path) => [path, hash(readFileSync(join(root, path)))])),
  harnessHashes: Object.fromEntries(['scripts/transcriber-browser-compatibility.mjs', 'scripts/lib/transcriber-browser-proof.mjs', 'scripts/lib/transcriber-browser-proof.test.mjs', 'scripts/lib/transcriber-model-cache.mjs', 'scripts/lib/transcriber-compatibility-exports.mjs']
    .map((path) => [path, hash(readFileSync(join(root, path)))])),
  requests: {}, blockedOrigins: {}, networkFailures: {}, memory: [], exports: [], failures: [], checks: {},
  cachedModelResponses: {},
  limits: { privacy: 'synthetic URL/body/header/known-encoding observations, not production recorder payload proof', memory: 'sampled whole-browser working sets only; bounded-memory acceptance still pending', resources: 'page-created resource tracking, not native allocation release' },
};
const save = () => writeFileSync(join(directory, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
report.builtHashes = Object.fromEntries([...staticPaths].filter((path) => path.startsWith('/_astro/')
  || path === '/tools/audio-video-transcriber/index.html').map((path) => [path, hash(readFileSync(join(dist, path.slice(1))))]));
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.wasm': 'application/wasm', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2' };
const server = createServer((request, response) => {
  try {
    const url = new URL(request.url, 'http://127.0.0.1');
    const path = resolve(dist, `.${decodeURIComponent(url.pathname)}${url.pathname.endsWith('/') ? 'index.html' : ''}`);
    const part = relative(dist, path);
    if (part.startsWith('..') || isAbsolute(part) || !existsSync(path)) throw new Error('Not a static file.');
    response.setHeader('Content-Type', mime[extname(path)] ?? 'application/octet-stream');
    const stream = createReadStream(path);
    stream.on('error', () => { response.statusCode = 404; response.end(); });
    stream.pipe(response);
  } catch { response.statusCode = 404; response.end(); }
});
let browser;
let page;
let timer;
let started = false;
const sentinels = ['tr03-private-sentinel'];
const increment = (key) => { report.requests[key] = (report.requests[key] ?? 0) + 1; };
const approvedRedirects = new WeakSet();
let origin;
try {
  let cache;
  if (cachedModels) {
    const repository = multilingual ? 'onnx-community/whisper-tiny_timestamped' : 'onnx-community/whisper-tiny.en_timestamped';
    const revision = multilingual ? '517244293732ee2d58139af5814231b7e6830a0d' : 'aeaa13760958b03fac5062f457d317d3319c3168';
    cache = loadVerifiedModelCache(join(root, 'output/browser-transcriber-pilot/pinned-model-cache', repository, revision), {
      repository, revision,
      manifestSha256: multilingual ? '13b099477fd3d92cbcb0455f6a6d8c9466c0d746fd2e0561f4493d469e861457' : 'b56f41d191489804a50dc78b0ce6f81848767d977549f7c4442750bba1df6611',
      requiredFiles: ['config.json', 'generation_config.json', 'preprocessor_config.json', 'tokenizer.json', 'tokenizer_config.json', 'onnx/encoder_model_quantized.onnx', 'onnx/decoder_model_merged_quantized.onnx'],
    });
    report.modelCache = { ...cache.proof, limit: 'Verified local responses at original pinned URLs; not cold external-download proof. Application worker bytes unchanged.' };
    const runtime = JSON.parse(readFileSync(join(root, 'node_modules/onnxruntime-web/package.json'), 'utf8'));
    const locked = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8')).packages['node_modules/onnxruntime-web'];
    if (runtime.version !== '1.27.0' || locked.version !== runtime.version) throw new Error('Cached runtime version must match the installed lockfile.');
    report.runtimeCache = { version: runtime.version, packageIntegrity: locked.integrity, files: {} };
    for (const extension of ['mjs', 'wasm']) {
      const name = `ort-wasm-simd-threaded.asyncify.${extension}`;
      const body = readFileSync(join(root, 'node_modules/onnxruntime-web/dist', name));
      const sha256 = hash(body);
      cache.files.set(`https://cdn.jsdelivr.net/npm/onnxruntime-web@1.27.0/dist/${name}`, {
        path: `runtime/${name}`, body, sha256,
        contentType: extension === 'mjs' ? 'text/javascript' : 'application/wasm',
      });
      report.runtimeCache.files[name] = { sha256, bytes: body.length };
    }
  }
  save();
  report.checks.fixtureDuration = validateSyntheticFixtureDuration(fixtureName, duration);
  if (!report.checks.fixtureDuration) throw new Error('Synthetic fixture duration does not match its acceptance scope.');
  await new Promise((done) => server.listen(0, '127.0.0.1', done));
  origin = `http://127.0.0.1:${server.address().port}`;
  const engine = browserName === 'firefox' ? firefox : browserName === 'webkit' ? webkit : chromium;
  browser = await engine.launch(['chrome', 'msedge'].includes(browserName) ? { channel: browserName } : {});
  report.browserVersion = browser.version();
  const context = await browser.newContext({ viewport: { width: 1365, height: 1000 }, serviceWorkers: 'block' });
  await context.addInitScript(installResourceProof);
  // Context routing observes dedicated worker fetches too. Raw requests are
  // inspected in memory only; reports contain reason counts, never payloads.
  const classify = (request) => {
    const category = classifyTranscriberRequest({ url: request.url(), method: request.method(), body: request.postData(), headers: request.headers(), pinnedRedirect: approvedRedirects.has(request.redirectedFrom()) }, { origin, started, sentinels, staticPaths });
    increment(category);
    if (category.startsWith('blocked-') && category !== 'blocked-private-data') {
      const host = new URL(request.url()).hostname;
      report.blockedOrigins[host] = (report.blockedOrigins[host] ?? 0) + 1;
    }
    if (category === 'model') approvedRedirects.add(request);
    return category;
  };
  if (observeModels) {
    // Callback-filtered diagnostic, not an interception-free comparison:
    // Playwright still enables CDP Fetch when any HTTP routes are installed.
    context.on('request', classify);
    await context.route(`${origin}/**`, async (route) => {
      const request = route.request();
      const category = classifyTranscriberRequest({ url: request.url(), method: request.method(), body: request.postData(), headers: request.headers() }, { origin, started, sentinels, staticPaths });
      if (category.startsWith('blocked-')) await route.abort();
      else await route.continue();
    });
    for (const host of ['local.adguard.org', '*.clarity.ms', 'resources.infolinks.com', 'pagead2.googlesyndication.com']) {
      await context.route(`**://${host}/**`, (route) => route.abort());
    }
  } else await context.route('**/*', async (route) => {
    const category = classify(route.request());
    if (category.startsWith('blocked-')) await route.abort();
    else if (cachedModels && category === 'model') {
      const item = cache.files.get(route.request().url());
      if (!item) {
        increment('blocked-cache-miss');
        const url = new URL(route.request().url());
        report.cacheMisses ??= [];
        report.cacheMisses.push({ origin: url.origin, path: url.pathname });
        await route.abort(); return;
      }
      await route.fulfill({ status: 200, body: item.body, contentType: item.contentType,
        headers: { 'access-control-allow-origin': origin, 'cache-control': 'no-store' } });
      report.cachedModelResponses[item.path] = { sha256: item.sha256, bytes: item.body.length,
        count: (report.cachedModelResponses[item.path]?.count ?? 0) + 1 };
    }
    else await route.continue();
  });
  await context.routeWebSocket('**/*', (socket) => { increment('blocked-websocket'); socket.close(); });
  context.on('requestfailed', (request) => {
    const key = request.failure()?.errorText ?? 'unknown';
    report.networkFailures[key] = (report.networkFailures[key] ?? 0) + 1;
  });
  context.on('response', (response) => {
    if (response.status() >= 400) {
      const key = `http-${response.status()}`;
      report.networkFailures[key] = (report.networkFailures[key] ?? 0) + 1;
    }
  });
  page = await context.newPage();
  page.on('pageerror', (error) => report.failures.push({ kind: 'pageerror', sha256: hash(error.message) }));
  page.on('crash', () => report.failures.push({ kind: 'crash' }));
  await page.goto(`${origin}/tools/audio-video-transcriber/`, { waitUntil: 'networkidle' });
  const keepOff = page.getByRole('button', { name: 'Keep ads off' });
  if (await keepOff.isVisible()) await keepOff.click();
  report.checks.noindex = /noindex/.test(await page.locator('meta[name="robots"]').getAttribute('content'));
  report.checks.modelLazy = !(report.requests.model || report.requests['blocked-before-start']);
  if (mutationMode) {
    await page.evaluate(async () => {
      const marker = 'tr03-private-sentinel';
      await fetch(`/collect?value=${marker}`).catch(() => {});
      await fetch('/collect', { method: 'POST', body: marker }).catch(() => {});
      navigator.sendBeacon('/collect', marker);
      const worker = new Worker(URL.createObjectURL(new Blob([`onmessage = async () => { await fetch('${location.origin}/collect?worker=tr03-private-sentinel').catch(() => {}); postMessage('done'); };`], { type: 'text/javascript' })));
      await new Promise((resolve) => { worker.onmessage = resolve; worker.postMessage('go'); });
      worker.terminate();
      await fetch('/collect', { method: 'POST', body: JSON.stringify({ clarity: marker }) }).catch(() => {});
      await fetch('/collect', { headers: { 'X-Private': marker } }).catch(() => {});
      await fetch(`/collect/${btoa(marker).replaceAll('=', '')}`).catch(() => {});
    });
    await page.waitForFunction(() => true);
    report.checks.mutationsDetected = report.requests['blocked-private-data'] === 7;
    report.checks.noUnaccountedRequests = !Object.entries(report.requests).some(([key, count]) => key.startsWith('blocked-') && !['blocked-private-data', 'blocked-environment'].includes(key) && count > 0);
  } else {
    await page.locator('input[type="file"]').setInputFiles(fixture);
    await page.getByRole('heading', { name: 'Recording inspected and ready' }).waitFor({ timeout: 120_000 });
    if (multilingual) await page.getByLabel('Spoken language').selectOption('auto');
    report.checks.privateSurfacesMasked = await page.locator('.browser-transcriber input:not([type=radio]):not([type=checkbox]), .browser-transcriber audio, .browser-transcriber video, .browser-transcriber select')
      .evaluateAll((nodes) => nodes.every((node) => node.closest('[data-clarity-mask="true"]')));
    await page.getByText(/I have permission to transcribe/i).click();
    let cdp;
    if (engine === chromium) cdp = await browser.newBrowserCDPSession();
    let sampling = false;
    const sample = async () => {
      report.modelDownloads = await page.evaluate(() => window.__transcriberProof?.modelDownloads ?? {}).catch(() => ({}));
      if (!cdp || sampling) return;
      sampling = true;
      try {
        const { processInfo } = await cdp.send('SystemInfo.getProcessInfo');
        const ids = processInfo.map((process) => process.id).filter(Number.isSafeInteger);
        const bytes = Number(execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', `(Get-Process -Id ${ids.join(',')} -ErrorAction SilentlyContinue | Measure-Object WorkingSet64 -Sum).Sum`], { encoding: 'utf8', timeout: 10_000 }).trim());
        if (Number.isFinite(bytes)) report.memory.push({ elapsedMs: Date.now() - began, summedProcessWorkingSetBytes: bytes, processCount: ids.length });
      } catch { report.memorySampleFailures = (report.memorySampleFailures ?? 0) + 1; }
      finally { sampling = false; }
    };
    const began = Date.now();
    await sample();
    started = true;
    await page.getByRole('button', { name: 'Transcribe recording', exact: true }).click();
    let lastStatus = '';
    timer = setInterval(async () => {
      const status = await page.locator('#transcriber-job-heading').textContent().catch(() => '');
      if (status && status !== lastStatus) { lastStatus = status; process.stdout.write(`${browserName}/${fixtureName}: ${status}\n`); }
      await sample();
      process.stdout.write(`Network counts: ${JSON.stringify(report.requests)}; failures: ${JSON.stringify(report.networkFailures)}\n`);
      process.stdout.write(`Model bytes: ${JSON.stringify(report.modelDownloads)}\n`);
      save();
    }, 30_000);
    const timeout = fixtureName === 'short' ? 10 * 60_000 : 90 * 60_000;
    await Promise.race([
      page.getByRole('heading', { name: 'Transcript ready for review' }).waitFor({ timeout }),
      page.locator('.browser-transcriber__error').waitFor({ timeout }).then(async () => {
        const text = await page.locator('.browser-transcriber__error').innerText();
        report.failureMessageHash = hash(text);
        report.failureCategory = /could not be downloaded/.test(text) ? 'model-download'
          : /time limit|no new progress/.test(text) ? 'watchdog'
            : /memory/.test(text) ? 'memory' : 'transcription-error';
        throw new Error('Visible transcription error; inspect the local browser screenshot.');
      }),
    ]);
    report.processingMs = Date.now() - began;
    await sample();
    clearInterval(timer);
    const transcriptValues = await page.locator('.browser-transcriber__segments textarea').evaluateAll((nodes) => nodes.map((node) => node.value));
    const transcript = transcriptValues.join(' ');
    report.transcriptCharacters = transcript.length;
    report.transcriptSha256 = hash(transcript);
    report.checks.nonemptyTranscript = transcript.trim().length > 0;
    report.checks.transcriptMasked = await page.locator('.browser-transcriber__segments textarea').evaluateAll((nodes) => nodes.length > 0 && nodes.every((node) => node.closest('[data-clarity-mask="true"]')));
    const exportText = {};
    for (const [label, kind] of [['TXT', 'txt'], ['SRT', 'srt'], ['WebVTT', 'vtt']]) {
      const ready = page.waitForEvent('download');
      await page.getByRole('button', { name: label, exact: true }).click();
      const download = await ready;
      const data = readFileSync(await download.path());
      exportText[kind] = data.toString('utf8');
      report.exports.push({ kind, bytes: data.length, sha256: hash(data) });
      if (kind === 'srt') report.subtitles = summarizeSubtitleProof(data.toString('utf8'), duration);
    }
    const srtCues = parseSubtitleCues(exportText.srt);
    report.checks.validExports = report.exports.length === 3 && report.exports.every((item) => item.bytes > 0)
      && validateTranscriberExports({ ...exportText, transcriptValues, duration });
    if (fixtureName.startsWith('hour-') && srtCues) {
      // The known fixture repeats five seconds of speech every 30 seconds.
      const matched = matchSyntheticSpeech(srtCues, 120);
      report.speechCoverage = { expectedIntervals: 120, matchedIntervals: matched, lastExpectedStart: 3570 };
      report.checks.hourSpeechCoverage = matched >= 114 && report.subtitles.lastEnd >= 3570;
    }
    report.checks.noOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
    await page.locator('.browser-transcriber__segments').scrollIntoViewIfNeeded();
    await page.screenshot({ path: join(directory, 'result.png') });
    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    await page.waitForFunction(() => window.__transcriberProof.urls.size === 0);
    report.cleanup = await page.evaluate(() => ({ workersCreated: window.__transcriberProof.workersCreated, workersTerminated: window.__transcriberProof.workersTerminated, liveWorkers: window.__transcriberProof.liveWorkers.size, objectUrls: window.__transcriberProof.urls.size }));
    report.checks.pageResourcesReleased = report.cleanup.liveWorkers === 0 && report.cleanup.objectUrls === 0;
    await sample();
    report.checks.noUnexpectedNetwork = !Object.entries(report.requests).some(([key, count]) => key.startsWith('blocked-') && key !== 'blocked-environment' && count > 0);
  }
  report.status = Object.values(report.checks).every(Boolean) && !report.failures.length ? 'pass' : 'fail';
} catch (error) {
  report.status = 'fail';
  report.failures.push({ kind: 'runner', sha256: hash(String(error)) });
  if (page && !page.isClosed()) await page.screenshot({ path: join(directory, 'failure.png') }).catch(() => {});
  process.stderr.write(`Compatibility proof failed (${browserName}/${fixtureName}). See the report; no private payload logged.\n`);
} finally {
  clearInterval(timer);
  try { if (browser) await browser.close(); }
  catch (error) { report.status = 'fail'; report.failures.push({ kind: 'browser-cleanup', sha256: hash(String(error)) }); }
  finally {
    server.closeAllConnections();
    await new Promise((done) => server.close(done));
  }
  report.browserStopped = !browser || !browser.isConnected();
  report.serverStopped = !server.listening;
  report.checks.selectedSourceUnchanged = Object.entries({ ...report.sourceHashes, ...report.harnessHashes })
    .every(([path, expected]) => hash(readFileSync(join(root, path))) === expected);
  report.checks.builtAssetsUnchanged = Object.entries(report.builtHashes)
    .every(([path, expected]) => hash(readFileSync(join(dist, path.slice(1)))) === expected);
  if (!report.checks.selectedSourceUnchanged || !report.checks.builtAssetsUnchanged || !report.browserStopped || !report.serverStopped) report.status = 'fail';
  report.finishedAt = new Date().toISOString();
  save();
  process.stdout.write(`${report.status.toUpperCase()}: ${join(directory, 'report.json')}\n`);
}
if (report.status !== 'pass') process.exitCode = 1;
