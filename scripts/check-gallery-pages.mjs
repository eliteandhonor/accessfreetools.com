import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  categoryNames,
  createToolArtEntries,
  readCanonicalTools,
  rootDir,
  writeJsonReport,
} from './lib/tool-art-manifest.mjs';

function distFileForPath(path) {
  const trimmed = path.replace(/^\/+|\/+$/g, '');
  return resolve(rootDir, 'dist/client', trimmed, 'index.html');
}

function htmlIncludesText(html, text) {
  return [text, text.replace(/&/g, '&amp;'), text.replace(/&/g, '&#38;')].some((candidate) =>
    html.includes(candidate),
  );
}

const entries = createToolArtEntries(readCanonicalTools()).filter((entry) => entry.status === 'approved');
const categories = [...new Set(entries.map((entry) => entry.category))].sort();
const issues = [];

const hubPath = distFileForPath('/gallery/');
if (!existsSync(hubPath)) {
  issues.push('/gallery/ did not build.');
} else {
  const html = readFileSync(hubPath, 'utf8');
  for (const category of categories) {
    if (!html.includes(`/gallery/${category}/`)) issues.push(`/gallery/ does not link to /gallery/${category}/.`);
  }
  if (entries.length === 0 && !html.includes('Gallery approval queue')) {
    issues.push('/gallery/ should explain that public art waits for approved GPT Image assets.');
  }
}

for (const category of categories) {
  const pagePath = `/gallery/${category}/`;
  const filePath = distFileForPath(pagePath);
  const categoryEntries = entries.filter((entry) => entry.category === category);
  if (!existsSync(filePath)) {
    issues.push(`${pagePath} did not build.`);
    continue;
  }

  const html = readFileSync(filePath, 'utf8');
  if (!html.includes(categoryNames[category] ?? category)) issues.push(`${pagePath} is missing useful category heading copy.`);
  for (const entry of categoryEntries) {
    if (!html.includes(`id="${entry.slug}-${entry.kind}"`)) issues.push(`${pagePath} missing gallery anchor for ${entry.slug}-${entry.kind}.`);
    if (!html.includes(entry.thumbnailPath)) issues.push(`${pagePath} missing thumbnail ${entry.thumbnailPath}.`);
    if (!html.includes(entry.pagePath)) issues.push(`${pagePath} missing return link ${entry.pagePath}.`);
    if (!htmlIncludesText(html, entry.alt)) issues.push(`${pagePath} missing alt text for ${entry.slug}-${entry.kind}.`);
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  status: issues.length > 0 ? 'fail' : 'pass',
  totals: {
    categories: categories.length,
    entries: entries.length,
    issues: issues.length,
  },
  issues,
};

writeJsonReport(resolve(rootDir, 'output/gallery-qa.json'), report);
writeFileSync(
  resolve(rootDir, 'output/gallery-qa.md'),
  [
    '# Gallery QA',
    '',
    `Status: ${report.status}`,
    `Categories checked: ${categories.length}`,
    `Gallery entries checked: ${entries.length}`,
    `Issues: ${issues.length}`,
    '',
    ...(issues.length ? ['## Issues', '', ...issues.map((issue) => `- ${issue}`), ''] : []),
  ].join('\n'),
);

if (issues.length > 0) {
  console.error(`Gallery QA failed with ${issues.length} issue(s). See output/gallery-qa.md.`);
  process.exit(1);
}

console.log(`Gallery QA passed for ${categories.length} category pages and ${entries.length} entries.`);
