import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  createToolArtEntries,
  manifestTsSource,
  normalizeTextLineEndings,
  readCanonicalTools,
  readRedirectedBlogGuideSlugs,
  readTrackedManifestSource,
  rootDir,
  writeJsonReport,
} from './lib/tool-art-manifest.mjs';

const fullSize = { width: 1200, height: 630 };
const thumbSize = { width: 480, height: 252 };
const maxFullBytes = 260 * 1024;
const maxThumbBytes = 85 * 1024;

function readWebpSize(filePath) {
  const buffer = readFileSync(filePath);
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') {
    return { ok: false, reason: 'not a WebP RIFF file' };
  }

  const chunk = buffer.toString('ascii', 12, 16);
  if (chunk === 'VP8X') {
    return {
      ok: true,
      width: 1 + buffer.readUIntLE(24, 3),
      height: 1 + buffer.readUIntLE(27, 3),
    };
  }

  if (chunk === 'VP8 ') {
    return {
      ok: true,
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }

  if (chunk === 'VP8L') {
    const bits = buffer.readUInt32LE(21);
    return {
      ok: true,
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    };
  }

  return { ok: false, reason: `unsupported WebP chunk ${chunk}` };
}

function checkImage(entry, key, expectedSize, maxBytes, issues) {
  const relativePath = entry[key];
  const filePath = resolve(rootDir, `public${relativePath}`);
  if (!existsSync(filePath)) {
    issues.push(`${relativePath} is missing.`);
    return;
  }

  const size = statSync(filePath).size;
  if (size <= 0) issues.push(`${relativePath} is empty.`);
  if (size > maxBytes) issues.push(`${relativePath} is ${(size / 1024).toFixed(1)} KB, above ${(maxBytes / 1024).toFixed(0)} KB budget.`);

  const dimensions = readWebpSize(filePath);
  if (!dimensions.ok) {
    issues.push(`${relativePath} could not be read: ${dimensions.reason}.`);
    return;
  }

  if (dimensions.width !== expectedSize.width || dimensions.height !== expectedSize.height) {
    issues.push(
      `${relativePath} is ${dimensions.width}x${dimensions.height}; expected ${expectedSize.width}x${expectedSize.height}.`,
    );
  }
}

function distFileForPage(pagePath) {
  const trimmed = pagePath.replace(/^\/+|\/+$/g, '');
  return resolve(rootDir, 'dist/client', trimmed, 'index.html');
}

function htmlIncludesText(html, text) {
  return [text, text.replace(/&/g, '&amp;'), text.replace(/&/g, '&#38;')].some((candidate) =>
    html.includes(candidate),
  );
}

function htmlIncludesImageSrc(html, imagePath) {
  return html.includes(`src="${imagePath}"`) || html.includes(`src="${imagePath}?`);
}

const entries = createToolArtEntries(readCanonicalTools());
const approvedEntries = entries.filter((entry) => entry.status === 'approved');
const redirectedBlogGuideSlugs = readRedirectedBlogGuideSlugs();
const expectedManifest = normalizeTextLineEndings(manifestTsSource(entries)).replace(
  /Last regenerated: \d{4}-\d{2}-\d{2}/,
  'Last regenerated: DATE',
);
const actualManifest = normalizeTextLineEndings(readTrackedManifestSource()).replace(
  /Last regenerated: \d{4}-\d{2}-\d{2}/,
  'Last regenerated: DATE',
);
const issues = [];
const warnings = [];
const distAvailable = existsSync(resolve(rootDir, 'dist/client'));

if (!distAvailable) {
  warnings.push('dist/client is missing, so built-page image embedding checks were skipped. Run npm run build first.');
}

if (approvedEntries.length === 0) {
  warnings.push('No smoke-kawaii images are approved yet. Public pages stay hidden from the image/gallery rollout until GPT Image assets pass visual QA.');
}

if (!actualManifest) {
  issues.push('src/data/toolArtManifest.ts is missing. Run npm run images:manifest.');
} else if (actualManifest !== expectedManifest) {
  issues.push('src/data/toolArtManifest.ts is stale. Run npm run images:manifest.');
}

const promptSet = new Set();
const imageSet = new Set();
const pageSet = new Set();

for (const entry of entries) {
  if (!entry.alt || entry.alt.length < 45) issues.push(`${entry.slug} ${entry.kind} has weak or missing alt text.`);
  if (!entry.caption || entry.caption.length < 30) issues.push(`${entry.slug} ${entry.kind} has weak or missing caption.`);
  if (!entry.prompt || entry.prompt.length < 180) issues.push(`${entry.slug} ${entry.kind} has weak or missing prompt.`);
  if (!/Research the exact tool before generating/i.test(entry.prompt)) {
    issues.push(`${entry.slug} ${entry.kind} prompt does not require exact-tool research before image generation.`);
  }
  if (!/inputs, outputs, formula\/logic, examples, and guide notes/i.test(entry.prompt)) {
    issues.push(`${entry.slug} ${entry.kind} prompt does not require tool-specific inputs, outputs, formula/logic, examples, and guide notes.`);
  }
  if (/readable text|no readable text/i.test(entry.alt)) warnings.push(`${entry.slug} ${entry.kind} alt text describes constraints instead of the image.`);
  if (promptSet.has(entry.prompt)) issues.push(`${entry.slug} ${entry.kind} reuses a duplicate prompt.`);
  promptSet.add(entry.prompt);
  if (imageSet.has(entry.imagePath)) issues.push(`${entry.imagePath} is reused by more than one manifest entry.`);
  imageSet.add(entry.imagePath);
  if (!entry.galleryPath.startsWith(`/gallery/${entry.category}/#`)) issues.push(`${entry.slug} ${entry.kind} has an invalid gallery path.`);
  pageSet.add(entry.pagePath);

  if (entry.status === 'approved') {
    if (entry.qaStatus !== 'approved') issues.push(`${entry.slug} ${entry.kind} is approved but qaStatus is ${entry.qaStatus}.`);
    checkImage(entry, 'imagePath', fullSize, maxFullBytes, issues);
    checkImage(entry, 'thumbnailPath', thumbSize, maxThumbBytes, issues);
  }

  if (distAvailable && entry.status === 'approved') {
    const htmlPath = distFileForPage(entry.pagePath);
    if (!existsSync(htmlPath)) {
      issues.push(`Built page is missing for ${entry.pagePath}.`);
    } else {
      const html = readFileSync(htmlPath, 'utf8');
      if (!html.includes(`<img`) || !htmlIncludesImageSrc(html, entry.imagePath)) {
        issues.push(`${entry.pagePath} does not embed ${entry.imagePath} with a standard img element.`);
      }
      if (!htmlIncludesText(html, entry.alt)) {
        issues.push(`${entry.pagePath} does not include the expected image alt text.`);
      }
      if (!html.includes(`https://accessfreetools.com${entry.imagePath}`)) {
        issues.push(`${entry.pagePath} does not expose ${entry.imagePath} in page metadata or structured data.`);
      }
    }
  }
}

const bySlug = new Map();
for (const entry of entries) {
  bySlug.set(entry.slug, (bySlug.get(entry.slug) ?? 0) + 1);
}
for (const [slug, count] of bySlug.entries()) {
  const expectedCount = redirectedBlogGuideSlugs.has(`how-to-use-${slug}`) ? 1 : 2;
  const expectedLabel = expectedCount === 1 ? 'tool only because its guide redirects' : 'tool + guide';
  if (count !== expectedCount) issues.push(`${slug} has ${count} image entries instead of ${expectedLabel}.`);
}

const sourceChecks = [
  ['src/pages/sitemap-images.xml.ts', 'image sitemap route'],
  ['src/pages/gallery/index.astro', 'gallery hub route'],
  ['src/pages/gallery/[category].astro', 'gallery category route'],
  ['src/components/ToolArtFigure.astro', 'reusable image component'],
];

for (const [sourcePath, label] of sourceChecks) {
  if (!existsSync(resolve(rootDir, sourcePath))) issues.push(`${label} is missing at ${sourcePath}.`);
}

const report = {
  generatedAt: new Date().toISOString(),
  status: issues.length > 0 ? 'fail' : warnings.length > 0 ? 'attention' : 'pass',
  totals: {
    tools: bySlug.size,
    entries: entries.length,
    approvedEntries: approvedEntries.length,
    pages: pageSet.size,
    issues: issues.length,
    warnings: warnings.length,
  },
  issues,
  warnings,
};

writeJsonReport(resolve(rootDir, 'output/tool-art-qa.json'), report);
writeFileSync(
  resolve(rootDir, 'output/tool-art-qa.md'),
  [
    '# Tool Art QA',
    '',
    `Status: ${report.status}`,
    `Tools covered: ${report.totals.tools}`,
    `Image entries checked: ${report.totals.entries}`,
    `Approved image entries requiring files: ${report.totals.approvedEntries}`,
    `Issues: ${issues.length}`,
    `Warnings: ${warnings.length}`,
    '',
    ...(issues.length ? ['## Issues', '', ...issues.map((issue) => `- ${issue}`), ''] : []),
    ...(warnings.length ? ['## Warnings', '', ...warnings.map((warning) => `- ${warning}`), ''] : []),
  ].join('\n'),
);

if (issues.length > 0) {
  console.error(`Tool art QA failed with ${issues.length} issue(s). See output/tool-art-qa.md.`);
  process.exit(1);
}

console.log(`Tool art QA ${report.status}: ${entries.length} entries checked, ${warnings.length} warning(s).`);
