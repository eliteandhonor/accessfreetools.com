import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize, relative } from 'node:path';

const distDir = join(process.cwd(), 'dist');
const publicDistDir = existsSync(join(distDir, 'client')) ? join(distDir, 'client') : distDir;

if (!existsSync(distDir)) {
  throw new Error('dist folder is missing. Run npm run build before npm run check:performance.');
}

const budgets = {
  '.html': { warn: 250 * 1024, fail: 650 * 1024 },
  '.js': { warn: 500 * 1024, fail: 850 * 1024 },
  '.css': { warn: 130 * 1024, fail: 190 * 1024 },
  '.wasm': { warn: 10 * 1024 * 1024, fail: 30 * 1024 * 1024 },
  '.json': { warn: 300 * 1024, fail: 900 * 1024 },
  '.xml': { warn: 160 * 1024, fail: 600 * 1024 },
  aiAsset: { warn: 8 * 1024 * 1024, fail: 95 * 1024 * 1024 },
};

const requiredWatchPaths = [
  'tools/index.html',
  'blog/index.html',
  'feed.xml',
  'sitemap.xml',
  'tool-search-index.json',
];

function walk(directory, files = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function bytesToKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function relativeDistPath(file) {
  return relative(publicDistDir, file).replace(/\\/g, '/');
}

const files = walk(publicDistDir);
const warnings = [];
const issues = [];
const measuredFiles = [];

for (const file of files) {
  const ext = extname(file).toLowerCase();
  const size = statSync(file).size;
  const rel = relativeDistPath(file);
  const budget = rel.startsWith('ai-models/') ? budgets.aiAsset : budgets[ext];
  const budgetLabel = rel.startsWith('ai-models/') ? 'ai model asset' : ext;

  if (!budget) {
    continue;
  }

  measuredFiles.push({ rel, size, ext });

  if (size > budget.fail) {
    issues.push(`${normalize(file)} is ${bytesToKb(size)}, above the hard ${budgetLabel} budget of ${bytesToKb(budget.fail)}.`);
  } else if (size > budget.warn) {
    warnings.push(`${rel} is ${bytesToKb(size)}, above the soft ${budgetLabel} budget of ${bytesToKb(budget.warn)}.`);
  }
}

for (const rel of requiredWatchPaths) {
  const file = join(publicDistDir, rel);

  if (!existsSync(file)) {
    issues.push(`${rel} is missing from dist; performance watch list cannot measure it.`);
  }
}

const htmlFiles = measuredFiles.filter((file) => file.ext === '.html');
const topAssets = measuredFiles
  .sort((a, b) => b.size - a.size)
  .slice(0, 10)
  .map((file) => `  ${file.rel}: ${bytesToKb(file.size)}`)
  .join('\n');
const toolsPageSize = statSync(join(publicDistDir, 'tools/index.html')).size;
const toolsHtml = readFileSync(join(publicDistDir, 'tools/index.html'), 'utf8');

if (toolsHtml.includes('how to use the ') || toolsHtml.includes('OpenStax') || toolsHtml.includes('Consumer Financial')) {
  warnings.push('/tools/ appears to include heavy guide/source text; keep the launchpad payload compact.');
}

if (toolsPageSize > 450 * 1024) {
  warnings.push(`/tools/ is ${bytesToKb(toolsPageSize)}; split more search data before adding hundreds of tools.`);
}

if (warnings.length > 0) {
  console.warn(warnings.join('\n'));
}

if (issues.length > 0) {
  console.error(issues.join('\n'));
  process.exit(1);
}

console.log(`Checked performance budgets for ${measuredFiles.length} built assets and ${htmlFiles.length} HTML pages.`);
console.log(`Largest measured assets:\n${topAssets}`);
