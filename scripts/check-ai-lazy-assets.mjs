import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, normalize, relative } from 'node:path';

const distDir = join(process.cwd(), 'dist');
const publicDistDir = existsSync(join(distDir, 'client')) ? join(distDir, 'client') : distDir;
const aiToolPaths = new Set([
  'tools/image-to-text-ocr-tool/index.html',
  'tools/sentiment-analyzer/index.html',
  'tools/language-detector/index.html',
  'tools/text-summarizer/index.html',
  'tools/keyword-extractor/index.html',
  'tools/image-classifier/index.html',
  'tools/tone-checker/index.html',
  'tools/reading-level-checker/index.html',
]);
const disallowedStaticModelPatterns = [
  /\/ai-models\//i,
  /model_quantized\.onnx/i,
  /traineddata\.gz/i,
  /tesseract-core/i,
  /ort-wasm/i,
];

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

if (issues.length > 0) {
  console.error(issues.join('\n'));
  process.exit(1);
}

console.log(`Verified ${checkedNonAiPages} non-AI HTML pages do not statically request AI model assets.`);
