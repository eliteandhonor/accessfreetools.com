import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { readCanonicalTools } from './tool-art-manifest.mjs';

const MANUAL_ITEM_PATTERN =
  /\{\s*title:\s*'[^']+'[\s\S]*?\r?\n\s*published:\s*'[^']+',\r?\n\s*\}/g;
const PIN_URL_PATTERN = /^https:\/\/au\.pinterest\.com\/pin\/\d+\/$/;

function extractString(block, key) {
  return block.match(new RegExp(`${key}:\\s*'([^']*)'`))?.[1] ?? '';
}

function extractBoolean(block, key) {
  return block.match(new RegExp(`${key}:\\s*(true|false)`))?.[1] === 'true';
}

function toolSlugFromPath(path) {
  return path.match(/^\/tools\/([^/]+)\/$/)?.[1] ?? null;
}

export function parseManualPinterestItems(source) {
  return [...source.matchAll(MANUAL_ITEM_PATTERN)].map((match) => {
    const block = match[0];
    return {
      title: extractString(block, 'title'),
      path: extractString(block, 'path'),
      imagePath: extractString(block, 'imagePath'),
      category: extractString(block, 'category'),
      boardSlug: extractString(block, 'boardSlug'),
      status: extractString(block, 'status'),
      rssEligible: extractBoolean(block, 'rssEligible'),
      publicPinUrl: extractString(block, 'publicPinUrl'),
      published: extractString(block, 'published'),
    };
  });
}

export function loadPinterestAppCoverage(rootDir = resolve('.')) {
  const feedPath = resolve(rootDir, 'src', 'data', 'pinterestFeed.ts');
  const boardConfigPath = resolve(rootDir, 'src', 'data', 'pinterestCategoryBoards.json');
  const proofPath = resolve(rootDir, 'src', 'data', 'pinterestAppProof.json');
  const feedSource = readFileSync(feedPath, 'utf8');
  const boardConfig = JSON.parse(readFileSync(boardConfigPath, 'utf8'));
  const proof = JSON.parse(readFileSync(proofPath, 'utf8'));
  const tools = readCanonicalTools();
  const manualItems = parseManualPinterestItems(feedSource);
  const manualToolItems = manualItems.filter((item) => toolSlugFromPath(item.path));
  const manualBySlug = new Map();

  for (const item of manualToolItems) {
    const slug = toolSlugFromPath(item.path);
    if (!manualBySlug.has(slug) || item.publicPinUrl) {
      manualBySlug.set(slug, item);
    }
  }

  const issues = [];
  const apps = tools.map((tool) => {
    const manual = manualBySlug.get(tool.slug);
    const savedProof = proof[tool.slug];
    const board = boardConfig[tool.category];
    const source = manual ? 'manual' : 'catalog';
    const boardSlug = manual?.boardSlug || board?.boardSlug || '';
    const boardTitle = manual?.category || board?.boardTitle || '';
    const publicPinUrl = manual?.publicPinUrl || savedProof?.publicPinUrl || '';
    const status = publicPinUrl ? 'posted' : 'rss-ready';
    const assetPath = manual?.imagePath || `/pinterest/apps/${tool.slug}.jpg`;
    const assetExists = existsSync(resolve(rootDir, 'public', assetPath.replace(/^\//, '')));

    if (!board) {
      issues.push(`${tool.slug} has no Pinterest board mapping for category ${tool.category}.`);
    }
    if (status === 'posted' && !PIN_URL_PATTERN.test(publicPinUrl)) {
      issues.push(`${tool.slug} has an invalid public Pinterest URL.`);
    }
    if (!assetExists) {
      issues.push(`${tool.slug} is missing Pinterest asset ${assetPath}.`);
    }

    return {
      slug: tool.slug,
      name: tool.name,
      category: tool.category,
      source,
      status,
      publicPinUrl,
      path: `/tools/${tool.slug}/`,
      assetPath,
      assetExists,
      boardSlug,
      boardTitle,
      published: manual?.published || savedProof?.published || '',
    };
  });

  const appSlugs = new Set(apps.map((app) => app.slug));
  if (appSlugs.size !== tools.length) {
    issues.push(`Pinterest app catalog has ${appSlugs.size} unique slugs for ${tools.length} tools.`);
  }

  return {
    generatedAt: new Date().toISOString(),
    apps,
    manualItems,
    boardConfig,
    proof,
    issues,
    counts: {
      totalApps: apps.length,
      postedApps: apps.filter((app) => app.status === 'posted').length,
      rssReadyApps: apps.filter((app) => app.status === 'rss-ready').length,
      missingApps: tools.length - appSlugs.size,
      assetReadyApps: apps.filter((app) => app.assetExists).length,
      manualToolApps: apps.filter((app) => app.source === 'manual').length,
      catalogToolApps: apps.filter((app) => app.source === 'catalog').length,
      manualArchiveItems: manualItems.length,
    },
  };
}

export { PIN_URL_PATTERN, toolSlugFromPath };
