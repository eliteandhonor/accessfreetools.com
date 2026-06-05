import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join, normalize } from 'node:path';

const SITE_ORIGIN = 'https://accessfreetools.com';
const distDir = join(process.cwd(), 'dist');
const publicDistDir = existsSync(join(distDir, 'client')) ? join(distDir, 'client') : distDir;
const htmlFiles = [];

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  }
}

if (!existsSync(distDir)) {
  throw new Error('dist folder is missing. Run npm run build before npm run check:structured-data.');
}

walk(publicDistDir);

const issues = [];
let jsonLdCount = 0;
const jsonLdPattern = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

function decodeHtmlEntities(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function stripTags(value = '') {
  return decodeHtmlEntities(value.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function getAttribute(tag, attributeName) {
  const match = tag.match(new RegExp(`\\b${attributeName}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i'));
  return match ? decodeHtmlEntities(match[2].trim()) : undefined;
}

function getCanonical(html) {
  const linkTags = html.match(/<link\b[^>]*>/gi) ?? [];

  for (const tag of linkTags) {
    if ((getAttribute(tag, 'rel') ?? '').toLowerCase() === 'canonical') {
      return getAttribute(tag, 'href') ?? '';
    }
  }

  return '';
}

function asArray(value) {
  return Array.isArray(value) ? value : [value];
}

function getTypeSet(item) {
  return new Set(asArray(item?.['@type']).filter(Boolean));
}

function flattenStructuredData(value) {
  const rootItems = Array.isArray(value) ? value : [value];
  const items = [];

  for (const item of rootItems) {
    if (!item || typeof item !== 'object') {
      continue;
    }

    items.push(item);

    if (Array.isArray(item['@graph'])) {
      for (const graphItem of item['@graph']) {
        if (graphItem && typeof graphItem === 'object') {
          items.push(graphItem);
        }
      }
    }
  }

  return items;
}

function parseJsonLd(rawJson) {
  try {
    return JSON.parse(rawJson);
  } catch (rawError) {
    const decodedJson = decodeHtmlEntities(rawJson);

    if (decodedJson !== rawJson) {
      try {
        return JSON.parse(decodedJson);
      } catch (decodedError) {
        throw decodedError;
      }
    }

    throw rawError;
  }
}

function requireString(item, property, label, htmlFile) {
  if (typeof item[property] !== 'string' || item[property].trim().length === 0) {
    issues.push(`${normalize(htmlFile)} ${label} is missing ${property}.`);
  }
}

function requireSiteUrl(value, label, htmlFile) {
  if (typeof value !== 'string' || !value.startsWith(`${SITE_ORIGIN}/`)) {
    issues.push(`${normalize(htmlFile)} ${label} must be an absolute ${SITE_ORIGIN} URL.`);
  }
}

function ensureVisible(text, htmlText, label, htmlFile) {
  if (typeof text !== 'string' || !text.trim()) {
    return;
  }

  if (!htmlText.toLowerCase().includes(text.toLowerCase())) {
    issues.push(`${normalize(htmlFile)} ${label} is not visible in page text: ${text}`);
  }
}

for (const htmlFile of htmlFiles) {
  if (/^google[a-f0-9]+\.html$/i.test(basename(htmlFile))) {
    continue;
  }

  const html = readFileSync(htmlFile, 'utf8');
  const canonical = getCanonical(html);
  const visibleText = stripTags(html);
  const parsedBlocks = [];

  for (const match of html.matchAll(jsonLdPattern)) {
    jsonLdCount += 1;
    const rawJson = match[1].trim();

    try {
      const parsed = parseJsonLd(rawJson);
      const blockItems = flattenStructuredData(parsed);

      if (!blockItems.some((item) => item['@context'])) {
        issues.push(`${normalize(htmlFile)} has JSON-LD without @context on the root block.`);
      }

      parsedBlocks.push(...blockItems);
    } catch (error) {
      issues.push(`${normalize(htmlFile)} has invalid JSON-LD: ${error.message}`);
    }
  }

  const typeNames = new Set(parsedBlocks.flatMap((item) => [...getTypeSet(item)]));

  if (!typeNames.has('Organization')) {
    issues.push(`${normalize(htmlFile)} is missing Organization structured data.`);
  }

  if (!typeNames.has('WebSite')) {
    issues.push(`${normalize(htmlFile)} is missing WebSite structured data.`);
  }

  for (const item of parsedBlocks) {
    const types = getTypeSet(item);

    if (types.has('Organization')) {
      requireString(item, 'name', 'Organization', htmlFile);
      requireSiteUrl(item.url, 'Organization url', htmlFile);
    }

    if (types.has('WebSite')) {
      requireString(item, 'name', 'WebSite', htmlFile);
      requireSiteUrl(item.url, 'WebSite url', htmlFile);
    }

    if (types.has('BreadcrumbList')) {
      const entries = item.itemListElement;

      if (!Array.isArray(entries) || entries.length < 2) {
        issues.push(`${normalize(htmlFile)} BreadcrumbList needs at least two items.`);
      } else {
        entries.forEach((entry, index) => {
          if (entry.position !== index + 1) {
            issues.push(`${normalize(htmlFile)} BreadcrumbList item ${index + 1} has the wrong position.`);
          }

          requireString(entry, 'name', `BreadcrumbList item ${index + 1}`, htmlFile);
          requireSiteUrl(entry.item, `BreadcrumbList item ${index + 1}`, htmlFile);
        });
      }
    }

    if (types.has('CollectionPage')) {
      requireString(item, 'name', 'CollectionPage', htmlFile);
      requireString(item, 'description', 'CollectionPage', htmlFile);
      requireSiteUrl(item.url, 'CollectionPage url', htmlFile);

      if (canonical && item.url !== canonical) {
        issues.push(`${normalize(htmlFile)} CollectionPage url does not match canonical.`);
      }

      ensureVisible(item.name.replace(/ tools$/i, ''), visibleText, 'CollectionPage name', htmlFile);

      const list = item.mainEntity;
      const entries = list?.itemListElement;

      if (list?.['@type'] !== 'ItemList' || typeof list.numberOfItems !== 'number' || !Array.isArray(entries)) {
        issues.push(`${normalize(htmlFile)} CollectionPage mainEntity must be an ItemList with entries.`);
      } else {
        entries.forEach((entry, index) => {
          if (entry.position !== index + 1) {
            issues.push(`${normalize(htmlFile)} CollectionPage list item ${index + 1} has the wrong position.`);
          }

          requireString(entry, 'name', `CollectionPage list item ${index + 1}`, htmlFile);
          requireSiteUrl(entry.url, `CollectionPage list item ${index + 1}`, htmlFile);
        });
      }
    }

    if (types.has('WebApplication')) {
      requireString(item, 'name', 'WebApplication', htmlFile);
      requireString(item, 'description', 'WebApplication', htmlFile);
      requireSiteUrl(item.url, 'WebApplication url', htmlFile);
      ensureVisible(item.name, visibleText, 'WebApplication name', htmlFile);

      if (canonical && item.url !== canonical) {
        issues.push(`${normalize(htmlFile)} WebApplication url does not match canonical.`);
      }

      if (item.isAccessibleForFree !== true) {
        issues.push(`${normalize(htmlFile)} WebApplication should mark isAccessibleForFree true.`);
      }

      if (item.offers?.['@type'] !== 'Offer' || item.offers.price !== '0') {
        issues.push(`${normalize(htmlFile)} WebApplication should include a free Offer.`);
      }

      if (item.publisher?.['@type'] !== 'Organization' || !item.publisher.name) {
        issues.push(`${normalize(htmlFile)} WebApplication publisher should be an Organization.`);
      }
    }

    if (types.has('Article')) {
      requireString(item, 'headline', 'Article', htmlFile);
      requireString(item, 'description', 'Article', htmlFile);
      requireString(item, 'datePublished', 'Article', htmlFile);
      requireString(item, 'dateModified', 'Article', htmlFile);
      requireSiteUrl(item.mainEntityOfPage, 'Article mainEntityOfPage', htmlFile);
      ensureVisible(item.headline, visibleText, 'Article headline', htmlFile);

      if (canonical && item.mainEntityOfPage !== canonical) {
        issues.push(`${normalize(htmlFile)} Article mainEntityOfPage does not match canonical.`);
      }

      if (item.author?.['@type'] !== 'Organization' || !item.author.name) {
        issues.push(`${normalize(htmlFile)} Article author should be an Organization.`);
      }

      if (item.publisher?.['@type'] !== 'Organization' || !item.publisher.name) {
        issues.push(`${normalize(htmlFile)} Article publisher should be an Organization.`);
      }
    }
  }
}

if (issues.length > 0) {
  console.error(issues.join('\n'));
  process.exit(1);
}

console.log(`Validated ${jsonLdCount} JSON-LD blocks across ${htmlFiles.length} HTML files with semantic checks.`);
