import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join, normalize, relative } from 'node:path';

const SITE_ORIGIN = 'https://accessfreetools.com';
const TITLE_SOFT_MAX = 70;
const TITLE_HARD_MAX = 85;
const DESCRIPTION_SOFT_MAX = 170;
const DESCRIPTION_HARD_MAX = 190;
const distDir = join(process.cwd(), 'dist');
const publicDistDir = existsSync(join(distDir, 'client')) ? join(distDir, 'client') : distDir;

if (!existsSync(distDir)) {
  throw new Error('dist folder is missing. Run npm run build before npm run check:site.');
}

function walk(directory, predicate, files = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath, predicate, files);
    } else if (entry.isFile() && predicate(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

function decodeHtmlEntities(value = '') {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, ' ')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
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

function getMetaContent(html, key, value) {
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];

  for (const tag of metaTags) {
    if ((getAttribute(tag, key) ?? '').toLowerCase() === value.toLowerCase()) {
      return getAttribute(tag, 'content') ?? '';
    }
  }

  return '';
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

function pagePathForHtmlFile(htmlFile) {
  const rel = relative(publicDistDir, htmlFile).replace(/\\/g, '/');

  if (rel === 'index.html') {
    return '/';
  }

  if (rel.endsWith('/index.html')) {
    return `/${rel.slice(0, -'index.html'.length)}`;
  }

  return `/${rel.replace(/\.html$/i, '/')}`;
}

function readSitemapUrls() {
  const sitemapPath = join(publicDistDir, 'sitemap.xml');
  const urls = new Set();
  const visitedSitemaps = new Set();
  const warnings = [];

  if (!existsSync(sitemapPath)) {
    return { urls, warnings: ['sitemap.xml is missing from dist; sitemap coverage cannot be verified.'] };
  }

  function sitemapLocToFile(loc) {
    try {
      const url = new URL(decodeHtmlEntities(loc), SITE_ORIGIN);

      if (url.origin !== SITE_ORIGIN) {
        warnings.push(`Sitemap points outside ${SITE_ORIGIN}: ${loc}`);
        return undefined;
      }

      return join(publicDistDir, url.pathname.replace(/^\/+/, ''));
    } catch {
      warnings.push(`Sitemap has an invalid loc value: ${loc}`);
      return undefined;
    }
  }

  function readSitemapFile(file) {
    const normalizedFile = normalize(file);

    if (visitedSitemaps.has(normalizedFile)) {
      return;
    }

    visitedSitemaps.add(normalizedFile);

    if (!existsSync(file)) {
      warnings.push(`${normalizedFile} is referenced by the sitemap index but is missing.`);
      return;
    }

    const sitemap = readFileSync(file, 'utf8');
    const locs = [...sitemap.matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map((match) => decodeHtmlEntities(match[1].trim()));

    if (/<sitemapindex\b/i.test(sitemap)) {
      for (const loc of locs) {
        const childFile = sitemapLocToFile(loc);

        if (childFile) {
          readSitemapFile(childFile);
        }
      }

      return;
    }

    for (const loc of locs) {
      urls.add(loc);
    }
  }

  readSitemapFile(sitemapPath);
  return { urls, warnings };
}

function addToMap(map, key, value) {
  if (!key) {
    return;
  }

  const values = map.get(key) ?? [];
  values.push(value);
  map.set(key, values);
}

const htmlFiles = walk(publicDistDir, (file) => file.endsWith('.html'));
const issues = [];
const warnings = [];
const sitemapResult = readSitemapUrls();
const sitemapUrls = sitemapResult.urls;
warnings.push(...sitemapResult.warnings);
const titlePages = new Map();
const descriptionPages = new Map();
let imageCount = 0;
let missingAltCount = 0;

for (const htmlFile of htmlFiles) {
  if (/^google[a-f0-9]+\.html$/i.test(basename(htmlFile))) {
    continue;
  }

  const html = readFileSync(htmlFile, 'utf8');
  const pagePath = pagePathForHtmlFile(htmlFile);
  const expectedUrl = `${SITE_ORIGIN}${pagePath}`;
  const title = stripTags(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '');
  const description = getMetaContent(html, 'name', 'description');
  const canonical = getCanonical(html);
  const robots = getMetaContent(html, 'name', 'robots').toLowerCase();
  const h1Text = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)]
    .map((match) => stripTags(match[1]))
    .filter(Boolean);
  const isIndexable = !robots.includes('noindex');
  const isSelfCanonical = canonical === expectedUrl;

  if (!title) {
    issues.push(`${normalize(htmlFile)} is missing a <title>.`);
  } else {
    if (title.length > TITLE_HARD_MAX) {
      issues.push(`${normalize(htmlFile)} title is ${title.length} characters, above ${TITLE_HARD_MAX}.`);
    } else if (title.length > TITLE_SOFT_MAX) {
      warnings.push(`${normalize(htmlFile)} title is ${title.length} characters; aim for ${TITLE_SOFT_MAX} or less.`);
    }

    if (isIndexable && isSelfCanonical) {
      addToMap(titlePages, title.toLowerCase(), pagePath);
    }
  }

  if (!description) {
    issues.push(`${normalize(htmlFile)} is missing a meta description.`);
  } else {
    if (description.length > DESCRIPTION_HARD_MAX) {
      issues.push(`${normalize(htmlFile)} meta description is ${description.length} characters, above ${DESCRIPTION_HARD_MAX}.`);
    } else if (description.length > DESCRIPTION_SOFT_MAX) {
      warnings.push(
        `${normalize(htmlFile)} meta description is ${description.length} characters; aim for ${DESCRIPTION_SOFT_MAX} or less.`,
      );
    }

    if (description.length < 45) {
      warnings.push(`${normalize(htmlFile)} meta description is short at ${description.length} characters.`);
    }

    if (isIndexable && isSelfCanonical) {
      addToMap(descriptionPages, description.toLowerCase(), pagePath);
    }
  }

  if (!canonical) {
    issues.push(`${normalize(htmlFile)} is missing a canonical link.`);
  } else if (!canonical.startsWith(`${SITE_ORIGIN}/`)) {
    issues.push(`${normalize(htmlFile)} canonical is not on ${SITE_ORIGIN}: ${canonical}`);
  }

  if (isIndexable && isSelfCanonical && !sitemapUrls.has(expectedUrl)) {
    issues.push(`${normalize(htmlFile)} is indexable and self-canonical but missing from sitemap.xml.`);
  }

  if (!isIndexable && sitemapUrls.has(expectedUrl)) {
    issues.push(`${normalize(htmlFile)} is noindex but present in sitemap.xml.`);
  }

  if (canonical && !isSelfCanonical && sitemapUrls.has(expectedUrl)) {
    issues.push(`${normalize(htmlFile)} is canonicalized to ${canonical} but present in sitemap.xml as ${expectedUrl}.`);
  }

  if (h1Text.length !== 1) {
    issues.push(`${normalize(htmlFile)} should have exactly one readable h1, found ${h1Text.length}.`);
  }

  for (const [key, label] of [
    ['og:title', 'Open Graph title'],
    ['og:description', 'Open Graph description'],
    ['og:url', 'Open Graph URL'],
    ['og:type', 'Open Graph type'],
    ['og:image', 'Open Graph image'],
    ['twitter:card', 'Twitter card'],
    ['twitter:title', 'Twitter title'],
    ['twitter:description', 'Twitter description'],
    ['twitter:image', 'Twitter image'],
  ]) {
    const content = key.startsWith('og:') ? getMetaContent(html, 'property', key) : getMetaContent(html, 'name', key);

    if (!content) {
      issues.push(`${normalize(htmlFile)} is missing ${label}.`);
    }
  }

  const ogImage = getMetaContent(html, 'property', 'og:image');
  const twitterImage = getMetaContent(html, 'name', 'twitter:image');
  const ogImageWidth = getMetaContent(html, 'property', 'og:image:width');
  const ogImageHeight = getMetaContent(html, 'property', 'og:image:height');
  const ogImageType = getMetaContent(html, 'property', 'og:image:type');
  const ogImageAlt = getMetaContent(html, 'property', 'og:image:alt');
  const twitterImageAlt = getMetaContent(html, 'name', 'twitter:image:alt');

  if (ogImage) {
    let parsedOgImage;

    try {
      parsedOgImage = new URL(ogImage);
    } catch {
      issues.push(`${normalize(htmlFile)} has an invalid Open Graph image URL: ${ogImage}`);
    }

    if (parsedOgImage) {
      if (parsedOgImage.origin !== SITE_ORIGIN) {
        issues.push(`${normalize(htmlFile)} Open Graph image is not on ${SITE_ORIGIN}: ${ogImage}`);
      }

      const isSocialPng = parsedOgImage.pathname.startsWith('/social/') && parsedOgImage.pathname.endsWith('.png');
      const isToolArtWebp =
        parsedOgImage.pathname.startsWith('/tool-art/') &&
        !parsedOgImage.pathname.includes('/thumbs/') &&
        parsedOgImage.pathname.endsWith('.webp');

      if (!isSocialPng && !isToolArtWebp) {
        issues.push(`${normalize(htmlFile)} should use a /social/*.png preview or a full /tool-art/*.webp page image: ${ogImage}`);
      }

      const socialImageFile = join(publicDistDir, parsedOgImage.pathname.replace(/^\/+/, ''));

      if (!existsSync(socialImageFile)) {
        issues.push(`${normalize(htmlFile)} references a missing social preview image: ${ogImage}`);
      }
    }
  }

  if (twitterImage && twitterImage !== ogImage) {
    issues.push(`${normalize(htmlFile)} Twitter image does not match Open Graph image.`);
  }

  const expectedOgImageType = ogImage?.includes('/tool-art/') ? 'image/webp' : 'image/png';
  if (ogImageWidth !== '1200' || ogImageHeight !== '630' || ogImageType !== expectedOgImageType) {
    issues.push(`${normalize(htmlFile)} social image metadata should declare 1200x630 ${expectedOgImageType}.`);
  }

  if (!ogImageAlt || !twitterImageAlt) {
    issues.push(`${normalize(htmlFile)} is missing social image alt text.`);
  }

  const imgTags = html.match(/<img\b[^>]*>/gi) ?? [];
  for (const tag of imgTags) {
    if ((getAttribute(tag, 'aria-hidden') ?? '').toLowerCase() === 'true') {
      continue;
    }

    imageCount += 1;

    if (!/\balt\s*=/.test(tag)) {
      missingAltCount += 1;
      issues.push(`${normalize(htmlFile)} has an img without an alt attribute: ${tag.slice(0, 120)}`);
    }
  }

  const anchorTags = html.match(/<a\b[^>]*>/gi) ?? [];
  for (const tag of anchorTags) {
    const href = getAttribute(tag, 'href') ?? '';
    const rel = (getAttribute(tag, 'rel') ?? '').toLowerCase();

    if (/redbubble\.com|teepublic\.com/i.test(href) && (!rel.includes('sponsored') || !rel.includes('nofollow'))) {
      issues.push(`${normalize(htmlFile)} has an affiliate-style link without rel="sponsored nofollow": ${href}`);
    }
  }
}

for (const [title, pages] of titlePages.entries()) {
  if (pages.length > 1) {
    issues.push(`Duplicate title across indexable pages: "${title}" on ${pages.join(', ')}`);
  }
}

for (const [description, pages] of descriptionPages.entries()) {
  if (pages.length > 1) {
    issues.push(`Duplicate meta description across indexable pages: "${description}" on ${pages.join(', ')}`);
  }
}

if (warnings.length > 0) {
  console.warn(warnings.join('\n'));
}

if (issues.length > 0) {
  console.error(issues.join('\n'));
  process.exit(1);
}

console.log(
  `Audited ${htmlFiles.length} HTML files for metadata, H1s, canonicals, sitemap coverage, social tags, and ${imageCount} images (${missingAltCount} missing alt).`,
);
