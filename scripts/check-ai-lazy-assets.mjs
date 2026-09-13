import { createReadStream, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, isAbsolute, join, normalize, relative, resolve } from 'node:path';
import { stat } from 'node:fs/promises';
import { chromium } from 'playwright';

const distDir = join(process.cwd(), 'dist');
const publicDistDir = existsSync(join(distDir, 'client')) ? join(distDir, 'client') : distDir;
const outputPath = join(process.cwd(), 'output', 'ai-assets-lazy-check.json');
const aiToolPaths = new Set([
  'tools/image-to-text-ocr-tool/index.html',
  'tools/sentiment-analyzer/index.html',
  'tools/language-detector/index.html',
  'tools/text-summarizer/index.html',
  'tools/keyword-extractor/index.html',
  'tools/image-classifier/index.html',
  'tools/tone-checker/index.html',
  'tools/reading-level-checker/index.html',
  'tools/text-to-speech-audiobook-generator/index.html',
  'tools/audio-video-transcriber/index.html',
]);
const disallowedStaticModelPatterns = [
  /\/ai-models\//i,
  /model_quantized\.onnx/i,
  /traineddata\.gz/i,
  /tesseract-core/i,
  /ort-wasm/i,
  /transformers\.web/i,
  /kokoro\.worker/i,
  /supertonic\.worker/i,
  /transcriber-(?:asr|media)\.worker/i,
];
const disallowedRuntimeRequestPatterns = [
  ...disallowedStaticModelPatterns,
  /whisper-tiny/i,
  /mediabunny/i,
  /phonemizer/i,
  /kokoro-82m/i,
  /supertonic-3/i,
];
const mimeTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
  ['.svg', 'image/svg+xml'],
  ['.ico', 'image/x-icon'],
  ['.woff2', 'font/woff2'],
  ['.wasm', 'application/wasm'],
]);

if (!existsSync(distDir)) {
  throw new Error('dist folder is missing. Run npm run build before npm run check:ai-assets.');
}

function walk(directory, files = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

const issues = [];
const htmlFiles = walk(publicDistDir);
let checkedNonAiPages = 0;

for (const htmlFile of htmlFiles) {
  const rel = relative(publicDistDir, htmlFile).replace(/\\/g, '/');

  if (aiToolPaths.has(rel)) {
    continue;
  }

  checkedNonAiPages += 1;
  const html = readFileSync(htmlFile, 'utf8');

  for (const pattern of disallowedStaticModelPatterns) {
    if (pattern.test(html)) {
      issues.push(`${normalize(htmlFile)} references AI model/runtime assets before user action (${pattern}).`);
    }
  }
}

const report = {
  checkedAt: new Date().toISOString(),
  staticNonAiPagesChecked: checkedNonAiPages,
  aiInitialLoadPagesChecked: 0,
  aiInitialLoadRequests: [],
};

function isModelOrRuntimeRequest(url) {
  return disallowedRuntimeRequestPatterns.some((pattern) => pattern.test(url));
}

function isInsidePublicDist(filePath) {
  const relativePath = relative(resolve(publicDistDir), filePath);
  return relativePath === '' || (!relativePath.startsWith('..') && !isAbsolute(relativePath));
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1');
    let requestPath = decodeURIComponent(url.pathname);
    if (requestPath.endsWith('/')) requestPath += 'index.html';

    let filePath = resolve(publicDistDir, requestPath.slice(1));
    if (!isInsidePublicDist(filePath)) {
      throw new Error('Path escapes dist root');
    }

    if (!existsSync(filePath)) {
      const indexPath = resolve(publicDistDir, requestPath.slice(1), 'index.html');
      if (isInsidePublicDist(indexPath) && existsSync(indexPath)) {
        filePath = indexPath;
      }
    }

    await stat(filePath);
    res.setHeader('content-type', mimeTypes.get(extname(filePath)) ?? 'application/octet-stream');
    createReadStream(filePath).pipe(res);
  } catch {
    res.statusCode = 404;
    res.end('not found');
  }
});

await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen));
const { port } = server.address();
const baseUrl = `http://127.0.0.1:${port}`;
const browser = await chromium.launch();

try {
  for (const aiToolPath of aiToolPaths) {
    const pagePath = `/${aiToolPath.replace(/index\.html$/, '')}`;
    const context = await browser.newContext();
    const page = await context.newPage();
    const blockedRequests = [];

    page.on('request', (request) => {
      const url = request.url();
      if (isModelOrRuntimeRequest(url)) {
        blockedRequests.push(url);
      }
    });

    await page.goto(`${baseUrl}${pagePath}`, { waitUntil: 'networkidle' });
    await context.close();

    report.aiInitialLoadPagesChecked += 1;
    report.aiInitialLoadRequests.push({ pagePath, requests: blockedRequests });

    for (const requestUrl of blockedRequests) {
      issues.push(`${pagePath} requested AI model/runtime asset before user action: ${requestUrl}`);
    }
  }
} finally {
  await browser.close();
  await new Promise((resolveClose) => server.close(resolveClose));
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);

if (issues.length > 0) {
  console.error(issues.join('\n'));
  process.exit(1);
}

console.log(
  `Verified ${checkedNonAiPages} non-AI HTML pages and ${report.aiInitialLoadPagesChecked} AI page initial loads do not request AI model assets before user action.`,
);
console.log(`Saved AI asset lazy-load report to ${outputPath}`);
