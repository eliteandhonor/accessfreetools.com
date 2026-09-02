import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const DIST_ROOT = path.resolve('dist');
const BLOG_ROOT = path.join(DIST_ROOT, 'blog');
const FAVICON_PATH = path.resolve('public', 'favicon.png');
const PUBLISHER_SCRIPT = 'https://news.google.com/swg/js/v1/publisher.js';
const PREFERRED_SOURCE_URL = 'https://www.google.com/preferences/source?q=accessfreetools.com';
const BUTTON_ATTRIBUTE = 'google-add-preferred-source-btn';
const CALLOUT_ATTRIBUTE = 'data-preferred-source-callout';

function fail(message) {
  throw new Error(message);
}

function countOccurrences(value, needle) {
  return value.split(needle).length - 1;
}

function listBlogFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return listBlogFiles(absolutePath);
    return entry.name === 'index.html' ? [absolutePath] : [];
  });
}

function isNoindex(html) {
  return /<meta\b[^>]*\bname=["']robots["'][^>]*\bcontent=["'][^"']*\bnoindex\b/i.test(html)
    || /<meta\b[^>]*\bcontent=["'][^"']*\bnoindex\b[^"']*["'][^>]*\bname=["']robots["']/i.test(html);
}

function verifyFavicon(errors) {
  if (!existsSync(FAVICON_PATH)) {
    errors.push('public/favicon.png is missing.');
    return;
  }

  const png = readFileSync(FAVICON_PATH);
  const pngSignature = '89504e470d0a1a0a';
  if (png.subarray(0, 8).toString('hex') !== pngSignature || png.length < 24) {
    errors.push('public/favicon.png is not a valid PNG file.');
    return;
  }

  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  if (width !== height || width < 48) {
    errors.push(`public/favicon.png must be square and at least 48px; found ${width}x${height}.`);
  }
}

if (!existsSync(path.join(DIST_ROOT, 'index.html')) || !existsSync(BLOG_ROOT)) {
  fail('Built site is missing. Run `npm run build` before `npm run check:preferred-sources`.');
}

const errors = [];
const articleFiles = listBlogFiles(BLOG_ROOT).filter(
  (filePath) => path.relative(BLOG_ROOT, filePath).replaceAll('\\', '/') !== 'index.html',
);
let checkedIndexableArticles = 0;
let checkedNoindexArticles = 0;

for (const filePath of articleFiles) {
  const html = readFileSync(filePath, 'utf8');
  const route = `/${path.relative(DIST_ROOT, path.dirname(filePath)).replaceAll('\\', '/')}/`;
  const tokenCounts = {
    script: countOccurrences(html, PUBLISHER_SCRIPT),
    button: countOccurrences(html, BUTTON_ATTRIBUTE),
    callout: countOccurrences(html, CALLOUT_ATTRIBUTE),
    fallback: countOccurrences(html, PREFERRED_SOURCE_URL),
  };

  if (isNoindex(html)) {
    checkedNoindexArticles += 1;
    for (const [name, count] of Object.entries(tokenCounts)) {
      if (count !== 0) errors.push(`${route} is noindex but contains preferred-source ${name} markup.`);
    }
    continue;
  }

  checkedIndexableArticles += 1;
  for (const [name, count] of Object.entries(tokenCounts)) {
    if (count !== 1) errors.push(`${route} expected one preferred-source ${name}; found ${count}.`);
  }
  if (!/<script\b[^>]*\basync\b[^>]*src=["']https:\/\/news\.google\.com\/swg\/js\/v1\/publisher\.js["'][^>]*>/i.test(html)
    && !/<script\b[^>]*src=["']https:\/\/news\.google\.com\/swg\/js\/v1\/publisher\.js["'][^>]*\basync\b[^>]*>/i.test(html)) {
    errors.push(`${route} does not load the Preferred Sources library asynchronously.`);
  }
  if (!/<section\b[^>]*data-preferred-source-callout[^>]*data-nosnippet/i.test(html)
    && !/<section\b[^>]*data-nosnippet[^>]*data-preferred-source-callout/i.test(html)) {
    errors.push(`${route} preferred-source copy must be excluded from search snippets.`);
  }
}

const nonArticleFiles = [
  path.join(DIST_ROOT, 'index.html'),
  path.join(DIST_ROOT, 'blog', 'index.html'),
  path.join(DIST_ROOT, 'tools', 'index.html'),
  path.join(DIST_ROOT, 'tools', 'percentage-calculator', 'index.html'),
  path.join(DIST_ROOT, 'categories', 'ai-tools', 'index.html'),
  path.join(DIST_ROOT, 'privacy-policy', 'index.html'),
];

for (const filePath of nonArticleFiles) {
  if (!existsSync(filePath)) {
    errors.push(`Representative non-article file is missing: ${path.relative(DIST_ROOT, filePath)}`);
    continue;
  }
  const html = readFileSync(filePath, 'utf8');
  for (const token of [PUBLISHER_SCRIPT, BUTTON_ATTRIBUTE, CALLOUT_ATTRIBUTE, PREFERRED_SOURCE_URL]) {
    if (html.includes(token)) {
      errors.push(`Non-article route /${path.relative(DIST_ROOT, path.dirname(filePath)).replaceAll('\\', '/')}/ contains ${token}.`);
    }
  }
}

const homeHtml = readFileSync(path.join(DIST_ROOT, 'index.html'), 'utf8');
if (!/<link\b[^>]*rel=["']icon["'][^>]*href=["']\/favicon\.png["'][^>]*type=["']image\/png["']/i.test(homeHtml)) {
  errors.push('The home page does not advertise the supported PNG favicon.');
}
if (/<link\b[^>]*rel=["']icon["'][^>]*href=["'][^"']*favicon\.svg["']/i.test(homeHtml)) {
  errors.push('The home page still advertises SVG as its Search-facing favicon.');
}

verifyFavicon(errors);

if (checkedIndexableArticles === 0) errors.push('No indexable blog articles were checked.');
if (errors.length) fail(`Preferred Sources check failed:\n- ${errors.join('\n- ')}`);

console.log(
  `Preferred Sources check passed: ${checkedIndexableArticles} indexable articles, ${checkedNoindexArticles} noindex articles, article-only script loading, and a supported PNG favicon.`,
);
