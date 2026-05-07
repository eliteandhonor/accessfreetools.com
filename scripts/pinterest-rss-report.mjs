import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const sourcePath = resolve('src', 'data', 'pinterestFeed.ts');
const source = readFileSync(sourcePath, 'utf8');
const outputDir = resolve('output', 'promotion');
const jsonPath = join(outputDir, 'pinterest-rss-report.json');
const mdPath = join(outputDir, 'pinterest-rss-report.md');

function extractString(block, key) {
  return block.match(new RegExp(`${key}:\\s*'([^']*)'`))?.[1] ?? '';
}

function extractBoolean(block, key) {
  return block.match(new RegExp(`${key}:\\s*(true|false)`))?.[1] === 'true';
}

const boardBlocks = [...source.matchAll(/\{\s*slug:\s*'[^']+'[\s\S]*?\n\s*path:\s*'\/pinterest\/[^']+\.xml',\n\s*\}/g)].map(
  (match) => match[0],
);
const boards = boardBlocks.map((block) => ({
  slug: extractString(block, 'slug'),
  title: extractString(block, 'title'),
  path: extractString(block, 'path'),
}));
const boardSlugs = new Set(boards.map((board) => board.slug));

const itemBlocks = [
  ...source.matchAll(/\{\s*title:\s*'[^']+'[\s\S]*?\n\s*published:\s*'[^']+',\n\s*\}/g),
].map((match) => match[0]);
const items = itemBlocks.map((block) => ({
  title: extractString(block, 'title'),
  path: extractString(block, 'path'),
  imagePath: extractString(block, 'imagePath'),
  category: extractString(block, 'category'),
  boardSlug: extractString(block, 'boardSlug'),
  status: extractString(block, 'status'),
  rssEligible: extractBoolean(block, 'rssEligible'),
  published: extractString(block, 'published'),
}));

const rssReadyItems = items.filter((item) => item.status === 'rss-ready' && item.rssEligible);
const postedArchiveItems = items.filter((item) => item.status === 'posted' && !item.rssEligible);
const issues = [];

for (const item of items) {
  if (!boardSlugs.has(item.boardSlug)) {
    issues.push(`${item.path} uses missing Pinterest board slug ${item.boardSlug || '(empty)'}.`);
  }

  if (item.status === 'posted' && item.rssEligible) {
    issues.push(`${item.path} is already posted but still RSS eligible.`);
  }

  if (item.status === 'rss-ready' && !item.rssEligible) {
    issues.push(`${item.path} is rss-ready but not RSS eligible.`);
  }

  if (item.status === 'rss-ready' && !item.imagePath.endsWith('.jpg')) {
    issues.push(`${item.path} RSS image should use optimized JPG, found ${item.imagePath}.`);
  }

  if (!item.path.startsWith('/')) {
    issues.push(`${item.title} should use a root-relative destination path.`);
  }
}

if (rssReadyItems.length === 0) {
  issues.push('No RSS-ready Pinterest items are available.');
}

const byBoard = boards.map((board) => ({
  ...board,
  rssReadyItems: rssReadyItems.filter((item) => item.boardSlug === board.slug).length,
  postedArchiveItems: postedArchiveItems.filter((item) => item.boardSlug === board.slug).length,
}));

const report = {
  generatedAt: new Date().toISOString(),
  source: sourcePath,
  generalFeed: 'https://accessfreetools.com/pinterest-feed.xml',
  boardFeeds: boards.map((board) => ({
    board: board.title,
    url: `https://accessfreetools.com${board.path}`,
    rssReadyItems: byBoard.find((entry) => entry.slug === board.slug)?.rssReadyItems ?? 0,
  })),
  counts: {
    totalItems: items.length,
    rssReadyItems: rssReadyItems.length,
    postedArchiveItems: postedArchiveItems.length,
    boards: boards.length,
  },
  issues,
};

const markdown = [
  '# Pinterest RSS Report',
  '',
  `Generated: ${report.generatedAt}`,
  '',
  '## Counts',
  '',
  `- Total promotion items: ${report.counts.totalItems}`,
  `- RSS-ready future items: ${report.counts.rssReadyItems}`,
  `- Posted archive items excluded from RSS: ${report.counts.postedArchiveItems}`,
  `- Board feeds: ${report.counts.boards}`,
  '',
  '## Feeds',
  '',
  `- General future-pins feed: ${report.generalFeed}`,
  ...report.boardFeeds.map((feed) => `- ${feed.board}: ${feed.url} (${feed.rssReadyItems} RSS-ready items)`),
  '',
  '## Issues',
  '',
  ...(issues.length ? issues.map((issue) => `- ${issue}`) : ['- None.']),
  '',
].join('\n');

mkdirSync(dirname(jsonPath), { recursive: true });
writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(mdPath, markdown);
console.log(`Saved Pinterest RSS report to ${mdPath}`);

if (issues.length > 0) {
  console.error(issues.join('\n'));
  process.exit(1);
}
