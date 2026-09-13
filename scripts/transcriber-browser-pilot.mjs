import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stat } from 'node:fs/promises';

import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';
import { summarizeModelSmoke } from './lib/transcriber-browser-proof.mjs';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(repoRoot, 'dist');
const publicDistDir = existsSync(join(distDir, 'client')) ? join(distDir, 'client') : distDir;
const outputDir = join(repoRoot, 'output', 'browser-transcriber-pilot');
const toolReviewDir = join(repoRoot, 'output', 'seo-tool-review', 'audio-video-transcriber', 'tool');
const blogReviewDir = join(repoRoot, 'output', 'seo-tool-review', 'audio-video-transcriber', 'blog');
const fixturePath = join(
  repoRoot,
  'public',
  'audio',
  'tts-voice-samples',
  'kokoro-82m',
  'af_bella.mp3',
);
const component = readFileSync(join(repoRoot, 'src', 'components', 'AudioVideoTranscriber.tsx'), 'utf8');
const mediaWorker = readFileSync(join(repoRoot, 'src', 'workers', 'transcriber-media.worker.ts'), 'utf8');
const asrWorker = readFileSync(join(repoRoot, 'src', 'workers', 'transcriber-asr.worker.ts'), 'utf8');
const logic = readFileSync(join(repoRoot, 'src', 'lib', 'browserTranscriber.ts'), 'utf8');
const styles = readFileSync(join(repoRoot, 'src', 'styles', 'global.css'), 'utf8');
const packageJson = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'));
const runModelSmoke = process.argv.includes('--model-smoke');
const useMultilingualModel = process.argv.includes('--multilingual');

const routePath = '/tools/audio-video-transcriber/';
const modelRequestPattern = /(?:huggingface\.co|whisper-tiny|model(?:_quantized)?\.onnx|tokenizer\.json|ort-wasm)/i;
const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json'],
  ['.m4a', 'audio/mp4'],
  ['.mp3', 'audio/mpeg'],
  ['.mp4', 'video/mp4'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.wasm', 'application/wasm'],
  ['.webm', 'video/webm'],
  ['.webp', 'image/webp'],
  ['.woff2', 'font/woff2'],
]);

if (!existsSync(distDir)) {
  throw new Error('dist is missing. Run npm run build before npm run transcriber:browser-check.');
}
if (!existsSync(fixturePath)) {
  throw new Error(`Browser fixture is missing: ${fixturePath}`);
}

function isInside(root, filePath) {
  const value = relative(resolve(root), filePath);
  return value === '' || (!value.startsWith('..') && !isAbsolute(value));
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? '/', 'http://127.0.0.1');
    let requestPath = decodeURIComponent(url.pathname);
    if (requestPath.endsWith('/')) requestPath += 'index.html';
    let filePath = resolve(publicDistDir, requestPath.slice(1));
    if (!isInside(publicDistDir, filePath)) throw new Error('Path escapes dist.');
    if (!existsSync(filePath)) {
      const nestedIndex = resolve(publicDistDir, requestPath.slice(1), 'index.html');
      if (isInside(publicDistDir, nestedIndex) && existsSync(nestedIndex)) filePath = nestedIndex;
    }
    await stat(filePath);
    response.setHeader('content-type', mimeTypes.get(extname(filePath)) ?? 'application/octet-stream');
    createReadStream(filePath).pipe(response);
  } catch {
    response.statusCode = 404;
    response.end('not found');
  }
});

await new Promise((done) => server.listen(0, '127.0.0.1', done));
const { port } = server.address();
const baseUrl = `http://127.0.0.1:${port}`;
const browser = await chromium.launch();
const evidenceDir = join(outputDir, new Date().toISOString().replace(/[:.]/g, '-'));
mkdirSync(evidenceDir, { recursive: true });
mkdirSync(toolReviewDir, { recursive: true });
mkdirSync(blogReviewDir, { recursive: true });
const attemptedExternalRequests = [];
const modelRequestsBeforeStart = [];
const modelRequestsAfterStart = [];
const nonGetRequests = [];
const consoleErrors = [];
const failedRequests = [];
const failedResponses = [];
let inspectionPassed = false;
let transcribeButtonReady = false;
let transcriptionStarted = false;
let modelSmokeTranscriptCharacters = 0;
const modelSmokeDownloads = [];
let robots = '';
let canonical = '';
let desktopOverflow = true;
let mobileOverflow = true;
let minimumControlHeight = 0;
const accessibilityViolations = [];

function isAllowedModelRequest(urlValue) {
  try {
    const url = new URL(urlValue);
    if (url.hostname === 'huggingface.co' || url.hostname.endsWith('.huggingface.co')) return true;
    if (url.hostname === 'hf.co' || url.hostname.endsWith('.hf.co')) return true;
    if (url.hostname === 'xethub.hf.co' || url.hostname.endsWith('.xethub.hf.co')) return true;
    return url.hostname === 'cdn.jsdelivr.net'
      && /^\/npm\/onnxruntime-web@[^/]+\/dist\/ort-wasm/i.test(url.pathname);
  } catch {
    return false;
  }
}

async function guardRequests(page) {
  await page.route('**/*', async (route) => {
    const request = route.request();
    const url = request.url();
    if (request.method() !== 'GET') nonGetRequests.push({ method: request.method(), url });
    const isModelRequest = modelRequestPattern.test(url) || isAllowedModelRequest(url);
    if (isModelRequest) {
      if (transcriptionStarted) modelRequestsAfterStart.push(url);
      else modelRequestsBeforeStart.push(url);
    }
    if (!url.startsWith(baseUrl) && !url.startsWith('blob:') && !url.startsWith('data:')) {
      if (
        runModelSmoke
        && transcriptionStarted
        && request.method() === 'GET'
        && isAllowedModelRequest(url)
      ) {
        await route.continue();
        return;
      }
      attemptedExternalRequests.push(url);
      // The guide's Preferred Sources widget is outside this local media test.
      if (url === 'https://news.google.com/swg/js/v1/publisher.js' && request.method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'text/javascript', body: '' });
        return;
      }
      await route.abort();
      return;
    }
    await route.continue();
  });
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  page.on('requestfailed', (request) => {
    failedRequests.push({
      error: request.failure()?.errorText ?? 'unknown request failure',
      method: request.method(),
      url: request.url(),
    });
  });
  page.on('response', (response) => {
    if (response.status() >= 400) failedResponses.push({ status: response.status(), url: response.url() });
  });
}

async function inspectFixture(page) {
  await page.locator('input[type="file"]').setInputFiles(fixturePath);
  await page.getByRole('heading', { name: 'Recording inspected and ready' }).waitFor({ timeout: 30_000 });
}

async function dismissAdvertisingChoice(page) {
  const button = page.getByRole('button', { name: 'Keep ads off' });
  if (await button.isVisible().catch(() => false)) await button.click();
}

async function collectAxe(page, viewport) {
  const result = await new AxeBuilder({ page })
    .include('.browser-transcriber')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  for (const violation of result.violations) {
    accessibilityViolations.push({
      viewport,
      id: violation.id,
      impact: violation.impact,
      nodes: violation.nodes.length,
      targets: violation.nodes.map((node) => node.target.join(' ')),
      summary: violation.nodes[0]?.failureSummary ?? '',
    });
  }
}

try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await guardRequests(page);

  await page.goto(`${baseUrl}${routePath}`, { waitUntil: 'networkidle' });
  await dismissAdvertisingChoice(page);
  robots = await page.evaluate(() => document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '');
  canonical = await page.locator('link[rel="canonical"]').getAttribute('href') ?? '';
  await inspectFixture(page);
  inspectionPassed = await page.getByText('Audio tracks', { exact: true }).isVisible();
  if (runModelSmoke && useMultilingualModel) {
    await page.getByLabel('Spoken language').selectOption('auto');
  }
  await page.getByText(/I have permission to transcribe/i).click();
  const transcribeButton = page.getByRole('button', { name: /Transcribe recording/i });
  transcribeButtonReady = await transcribeButton.isEnabled();
  if (runModelSmoke) {
    transcriptionStarted = true;
    await transcribeButton.click();
    const statusTimer = setInterval(async () => {
      const statusText = await page.locator('#transcriber-job-heading').textContent().catch(() => null);
      if (statusText) process.stdout.write(`Transcriber status: ${statusText}\n`);
    }, 15_000);
    try {
      await Promise.race([
        page.getByRole('heading', { name: 'Transcript ready for review' }).waitFor({ timeout: 10 * 60_000 }),
        page.locator('.browser-transcriber__error').waitFor({ timeout: 10 * 60_000 }).then(async () => {
          const message = await page.locator('.browser-transcriber__error').innerText();
          process.stderr.write(`${JSON.stringify({
            attemptedExternalRequests,
            consoleErrors,
            failedRequests,
            failedResponses,
            modelRequestsAfterStart,
          }, null, 2)}\n`);
          throw new Error(`Model smoke failed in the browser: ${message}`);
        }),
      ]);
    } finally {
      clearInterval(statusTimer);
    }
    const transcriptAreas = page.locator('.browser-transcriber__segments textarea');
    await transcriptAreas.first().waitFor({ timeout: 30_000 });
    const transcriptText = (await transcriptAreas.evaluateAll((areas) => (
      areas.map((area) => ('value' in area ? String(area.value) : ''))
    ))).join(' ').trim();
    modelSmokeTranscriptCharacters = transcriptText.length;

    for (const label of ['TXT', 'SRT', 'WebVTT']) {
      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('button', { name: label, exact: true }).click();
      const download = await downloadPromise;
      const downloadPath = join(evidenceDir, download.suggestedFilename());
      await download.saveAs(downloadPath);
      modelSmokeDownloads.push({
        bytes: (await stat(downloadPath)).size,
        filename: download.suggestedFilename(),
      });
    }
  }
  desktopOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  minimumControlHeight = await page.locator('.browser-transcriber button').evaluateAll((buttons) => (
    Math.min(...buttons.filter((button) => !button.hasAttribute('disabled')).map((button) => button.getBoundingClientRect().height))
  ));
  await collectAxe(page, 'desktop');
  await page.locator('.browser-transcriber').evaluate((element) => element.scrollIntoView({ block: 'start' }));
  await page.screenshot({ path: join(evidenceDir, 'desktop-fold.png') });
  await page.screenshot({ path: join(evidenceDir, 'desktop-ready.png'), fullPage: true });
  await page.screenshot({ path: join(toolReviewDir, 'browser-proof-local.png'), fullPage: true });
  writeFileSync(
    join(toolReviewDir, 'browser-proof-local-dom.txt'),
    `${await page.locator('main').innerText()}\n`,
  );
  await context.close();

  const mobileContext = await browser.newContext({
    reducedMotion: 'reduce',
    viewport: { width: 390, height: 844 },
  });
  const mobilePage = await mobileContext.newPage();
  await guardRequests(mobilePage);
  await mobilePage.goto(`${baseUrl}${routePath}`, { waitUntil: 'networkidle' });
  await dismissAdvertisingChoice(mobilePage);
  await inspectFixture(mobilePage);
  mobileOverflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  await collectAxe(mobilePage, 'mobile');
  await mobilePage.locator('.browser-transcriber').evaluate((element) => element.scrollIntoView({ block: 'start' }));
  await mobilePage.screenshot({ path: join(evidenceDir, 'mobile-fold.png') });
  await mobilePage.screenshot({ path: join(evidenceDir, 'mobile-ready.png'), fullPage: true });
  await mobileContext.close();

  const blogContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const blogPage = await blogContext.newPage();
  await guardRequests(blogPage);
  await blogPage.goto(`${baseUrl}/blog/how-to-use-audio-video-transcriber/`, { waitUntil: 'networkidle' });
  await dismissAdvertisingChoice(blogPage);
  await blogPage.screenshot({ path: join(blogReviewDir, 'browser-proof-local.png'), fullPage: true });
  writeFileSync(
    join(blogReviewDir, 'browser-proof-local-dom.txt'),
    `${await blogPage.locator('main').innerText()}\n`,
  );
  await blogContext.close();
} finally {
  await browser.close();
  await new Promise((done) => server.close(done));
}

const modelSmoke = summarizeModelSmoke({
  requested: runModelSmoke,
  model: useMultilingualModel ? 'multilingual' : 'english',
  transcriptCharacters: modelSmokeTranscriptCharacters,
  downloads: modelSmokeDownloads,
  requests: modelRequestsAfterStart,
});
const checks = {
  asrModelRevisionsPinned:
    asrWorker.includes('aeaa13760958b03fac5062f457d317d3319c3168')
    && asrWorker.includes('517244293732ee2d58139af5814231b7e6830a0d'),
  browserInspectionPassed: inspectionPassed,
  browserLayoutsDoNotOverflow: !desktopOverflow && !mobileOverflow,
  claritySurfacesMasked: (component.match(/data-clarity-mask="true"/g) ?? []).length >= 4,
  explicitLimits:
    logic.includes('250 * 1024 * 1024')
    && logic.includes('MAX_TRANSCRIBER_DURATION_SECONDS = 60 * 60'),
  mediabunnyPinned: packageJson.dependencies?.mediabunny === '1.55.5',
  modelIsLazy: modelRequestsBeforeStart.length === 0,
  ...modelSmoke.checks,
  noMediaUploadRequest: nonGetRequests.length === 0,
  noFormDataUpload: !component.includes('FormData') && !mediaWorker.includes('fetch('),
  publicIndexingAllowed: !/(?:noindex|none)/i.test(robots),
  outputFormatsPresent: ['TXT', 'SRT', 'WebVTT'].every((label) => component.includes(`> ${label}<`)),
  productionCanonical: canonical === 'https://accessfreetools.com/tools/audio-video-transcriber/',
  reducedMotionHandled:
    styles.includes('@media (prefers-reduced-motion: reduce)')
    && styles.includes('.browser-transcriber__caption-line')
    && styles.includes('.browser-transcriber__sound-wave span'),
  selectedFixtureEnablesTranscribeButton: transcribeButtonReady,
  streamedMediaDecode:
    mediaWorker.includes('new BlobSource(file)')
    && mediaWorker.includes('AudioSampleSink')
    && mediaWorker.includes('sink.samples(request.block.start, request.block.end)'),
  userContentNotInAnalytics:
    !/emitTranscriberAction\([^)]*(?:file\.name|language|segment|text)/s.test(component),
  wcagAxePass: accessibilityViolations.length === 0,
  workingControlsMeetTapTarget: minimumControlHeight >= 44,
};

const report = {
  generatedAt: new Date().toISOString(),
  status: Object.entries(checks).every(([name, value]) => value === true
    || (!runModelSmoke && Object.hasOwn(modelSmoke.checks, name) && value === null))
    && consoleErrors.length === 0 ? 'pass' : 'fail',
  scope: 'local browser readiness; model generation and 60-minute compatibility soak remain separate beta gates',
  route: routePath,
  modelSmoke,
  checks,
  evidence: {
    attemptedExternalRequestCount: attemptedExternalRequests.length,
    accessibilityViolations,
    consoleErrors,
    desktopOverflow,
    evidenceDir,
    minimumControlHeight,
    mobileOverflow,
    modelRequestsBeforeStart,
    modelRequestsAfterStart,
    modelSmokeDownloads,
    modelSmokeTranscriptCharacters,
    nonGetRequests,
    failedRequests,
    failedResponses,
  },
};

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, 'latest.json'), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(join(evidenceDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(
  join(outputDir, 'latest.md'),
  [
    '# Browser Transcriber Pilot Check',
    '',
    `- Status: **${report.status.toUpperCase()}**`,
    `- Route: \`${routePath}\``,
    '- Scope: local page load, lazy model proof, local media inspection, privacy guards, and beta index policy',
    runModelSmoke
      ? '- Model smoke: pinned Whisper download, short local inference, and TXT/SRT/WebVTT downloads were exercised'
      : '- Not claimed here: Whisper download/inference, 60-minute Chrome/Edge soak, or physical Firefox/WebKit/mobile compatibility',
    '',
    '## Checks',
    '',
    ...Object.entries(checks).map(([name, passed]) => `- ${passed === null ? 'NOT RUN' : passed ? 'PASS' : 'FAIL'}: ${name}`),
    '',
    `- Console errors: ${consoleErrors.length}`,
    `- Axe violations in transcriber workspace: ${accessibilityViolations.length}`,
    `- Model requests before Transcribe: ${modelRequestsBeforeStart.length}`,
    `- Model requests after Transcribe: ${modelRequestsAfterStart.length}`,
    `- Model smoke transcript characters: ${modelSmokeTranscriptCharacters}`,
    `- Non-GET requests after local file selection: ${nonGetRequests.length}`,
    `- Screenshots: \`${evidenceDir}\``,
    '',
  ].join('\n'),
);

console.log(`Browser transcriber pilot check: ${report.status.toUpperCase()}`);
console.log(`Saved report to ${join(outputDir, 'latest.json')}`);
if (report.status !== 'pass') process.exitCode = 1;
