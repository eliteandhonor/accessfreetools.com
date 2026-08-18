import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createToolArtEntries, readCanonicalTools, rootDir, writeJsonReport } from './lib/tool-art-manifest.mjs';
import { readExplicitIndexationPolicies } from './lib/indexation-policy-source.mjs';

const candidates = [
  resolve(rootDir, 'dist/client/sitemap-images.xml'),
  resolve(rootDir, 'dist/sitemap-images.xml'),
];
const sitemapPath = candidates.find((path) => existsSync(path));
const indexationPolicies = readExplicitIndexationPolicies(rootDir);
const isSitemapEligible = (path) => {
  const policy = indexationPolicies.get(path);
  return policy?.index !== false && policy?.includeInXmlSitemap !== false;
};
const approvedEntries = createToolArtEntries(readCanonicalTools()).filter((entry) => entry.status === 'approved');
const entries = approvedEntries.filter((entry) => isSitemapEligible(entry.pagePath));
const excludedEntries = approvedEntries.filter((entry) => !isSitemapEligible(entry.pagePath));
const editorialSlugs = [
  ...readFileSync(resolve(rootDir, 'src/data/editorialBlogPosts.ts'), 'utf8').matchAll(/slug:\s*'([^']+)'/g),
]
  .map((match) => match[1])
  .filter((slug) => isSitemapEligible(`/blog/${slug}/`));
const issues = [];

if (!sitemapPath) {
  issues.push('Built sitemap-images.xml is missing. Run npm run build first.');
} else {
  const xml = readFileSync(sitemapPath, 'utf8');
  if (!xml.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"')) {
    issues.push('Image sitemap is missing the image namespace.');
  }

  for (const entry of entries) {
    const pageUrl = `https://accessfreetools.com${entry.pagePath}`;
    const imageUrl = `https://accessfreetools.com${entry.imagePath}`;
    if (!xml.includes(pageUrl)) issues.push(`Image sitemap missing page URL ${pageUrl}.`);
    if (!xml.includes(imageUrl)) issues.push(`Image sitemap missing image URL ${imageUrl}.`);
  }

  for (const entry of excludedEntries) {
    const pageUrl = `https://accessfreetools.com${entry.pagePath}`;
    const imageUrl = `https://accessfreetools.com${entry.imagePath}`;
    if (xml.includes(pageUrl) || xml.includes(imageUrl)) {
      issues.push(`Image sitemap includes noindex or excluded page ${pageUrl}.`);
    }
  }

  for (const slug of editorialSlugs) {
    const pageUrl = `https://accessfreetools.com/blog/${slug}/`;
    const imageUrl = `https://accessfreetools.com/social/${slug}.webp`;
    if (!xml.includes(pageUrl)) issues.push(`Image sitemap missing editorial page URL ${pageUrl}.`);
    if (!xml.includes(imageUrl)) issues.push(`Image sitemap missing editorial image URL ${imageUrl}.`);
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  status: issues.length > 0 ? 'fail' : 'pass',
  sitemapPath: sitemapPath ? sitemapPath.replace(`${rootDir}${join('', '')}`, '') : null,
  entries: entries.length + editorialSlugs.length,
  toolArtEntries: entries.length,
  editorialEntries: editorialSlugs.length,
  issues,
};

writeJsonReport(resolve(rootDir, 'output/tool-art-sitemap-check.json'), report);
writeFileSync(
  resolve(rootDir, 'output/tool-art-sitemap-check.md'),
  [
    '# Tool Art Sitemap Check',
    '',
    `Status: ${report.status}`,
    `Entries expected: ${report.entries}`,
    `Sitemap: ${sitemapPath ?? 'missing'}`,
    '',
    ...(issues.length ? ['## Issues', '', ...issues.map((issue) => `- ${issue}`), ''] : []),
  ].join('\n'),
);

if (issues.length > 0) {
  console.error(`Image sitemap check failed with ${issues.length} issue(s). See output/tool-art-sitemap-check.md.`);
  process.exit(1);
}

console.log(`Image sitemap check passed for ${report.entries} entries.`);
