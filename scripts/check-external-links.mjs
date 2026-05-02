import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const distDir = join(process.cwd(), 'dist');
const publicDistDir = existsSync(join(distDir, 'client')) ? join(distDir, 'client') : distDir;
const outputDir = join(process.cwd(), 'output');
const STRICT = process.argv.includes('--strict');
const TIMEOUT_MS = 12000;
const CONCURRENCY = 8;

if (!existsSync(distDir)) {
  throw new Error('dist folder is missing. Run npm run build before npm run check:external-links.');
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

function getAttribute(tag, attributeName) {
  const match = tag.match(new RegExp(`\\b${attributeName}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i'));
  return match ? match[2].trim() : undefined;
}

function chunk(values, size) {
  const chunks = [];

  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }

  return chunks;
}

async function fetchWithTimeout(url, method) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    return await fetch(url, {
      method,
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'AccessFreeToolsLinkAudit/1.0 (+https://accessfreetools.com)',
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function checkUrl(url) {
  try {
    let response = await fetchWithTimeout(url, 'HEAD');

    if (response.status >= 400) {
      response = await fetchWithTimeout(url, 'GET');
    }

    return {
      url,
      ok: response.status < 400,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    return {
      url,
      ok: false,
      status: 0,
      statusText: error instanceof Error ? error.message : 'request failed',
    };
  }
}

const externalLinks = new Set();

for (const htmlFile of walk(publicDistDir)) {
  const html = readFileSync(htmlFile, 'utf8');
  const anchors = html.match(/<a\b[^>]*>/gi) ?? [];

  for (const tag of anchors) {
    const href = getAttribute(tag, 'href') ?? '';

    if (!href || href.startsWith('#') || href.startsWith('/') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      continue;
    }

    if (/^https?:\/\//i.test(href)) {
      externalLinks.add(href.split('#')[0]);
    }
  }
}

const urls = [...externalLinks].sort();
const results = [];

for (const batch of chunk(urls, CONCURRENCY)) {
  results.push(...(await Promise.all(batch.map((url) => checkUrl(url)))));
}

const broken = results.filter((result) => !result.ok);
const report = {
  checkedAt: new Date().toISOString(),
  strict: STRICT,
  totalLinks: urls.length,
  reviewCount: broken.length,
  timeoutMs: TIMEOUT_MS,
  reviewLinks: broken,
};

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, 'external-link-audit.json'), `${JSON.stringify(report, null, 2)}\n`);

if (broken.length > 0) {
  console.warn(
    broken
      .map((result) => `${result.url} -> ${result.status || 'request failed'} ${result.statusText}`.trim())
      .join('\n'),
  );
}

console.log(
  `Checked ${urls.length} unique external links. ${broken.length} need review.${STRICT ? ' Strict mode enabled.' : ' Non-blocking report.'}`,
);
console.log(`Saved report to ${join(outputDir, 'external-link-audit.json')}`);

process.exit(STRICT && broken.length > 0 ? 1 : 0);
