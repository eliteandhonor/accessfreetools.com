import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const SITE_ORIGIN = 'https://accessfreetools.com';
const SITEMAP_URL = `${SITE_ORIGIN}/sitemap.xml`;
const REPORT_PATH = resolve('output/production-sitemap-check.json');
const SEARCH_CONSOLE_REPORT = resolve('output/search-console-performance.json');
const LEGACY_URLS = [
  `${SITE_ORIGIN}/calculators`,
  `${SITE_ORIGIN}/deep-research`,
  `${SITE_ORIGIN}/advanced-age-calculator`,
  `${SITE_ORIGIN}/maximize-your-revenue-the-ultimate-free-google-adsense-earnings-calculator-for-2025`,
];

const args = process.argv.slice(2);
const npmWarnOnly = process.env.npm_config_warn_only === 'true';
const npmMaxUrls = process.env.npm_config_max_urls;
const failOnErrors = !args.includes('--warn-only') && !npmWarnOnly;
const maxUrls = Number(args.find((arg) => arg.startsWith('--max-urls='))?.slice('--max-urls='.length) ?? npmMaxUrls ?? Infinity);

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function sitemapUrls(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim());
}

function searchConsolePageUrls() {
  if (!existsSync(SEARCH_CONSOLE_REPORT)) {
    return [];
  }

  const report = JSON.parse(readFileSync(SEARCH_CONSOLE_REPORT, 'utf8'));
  return (report.byPage ?? [])
    .map((row) => row.keys?.[0])
    .filter((url) => typeof url === 'string' && url.startsWith(SITE_ORIGIN));
}

async function checkUrl(url) {
  const startedAt = Date.now();
  try {
    let response = await fetch(url, { method: 'HEAD', redirect: 'manual' });
    if (response.status === 405 || response.status === 403) {
      response = await fetch(url, { method: 'GET', redirect: 'manual' });
    }

    return {
      url,
      status: response.status,
      ok: response.status >= 200 && response.status < 400,
      location: response.headers.get('location') ?? '',
      durationMs: Date.now() - startedAt,
    };
  } catch (error) {
    return {
      url,
      status: 0,
      ok: false,
      location: '',
      error: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - startedAt,
    };
  }
}

async function runPool(items, worker) {
  const results = [];
  const queue = [...items];
  const workers = Array.from({ length: 8 }, async () => {
    while (queue.length) {
      const next = queue.shift();
      results.push(await worker(next));
    }
  });
  await Promise.all(workers);
  return results;
}

const sitemapResponse = await fetch(SITEMAP_URL);
if (!sitemapResponse.ok) {
  throw new Error(`Could not fetch ${SITEMAP_URL}: HTTP ${sitemapResponse.status}`);
}

const sitemap = sitemapUrls(await sitemapResponse.text());
const urls = [...new Set([...sitemap, ...searchConsolePageUrls(), ...LEGACY_URLS])].slice(0, maxUrls);
const results = await runPool(urls, checkUrl);
const hardFailures = results.filter((result) => result.status >= 400 || result.status === 0);
const redirects = results.filter((result) => result.status >= 300 && result.status < 400);
const report = {
  generatedAt: new Date().toISOString(),
  sitemapUrl: SITEMAP_URL,
  checked: results.length,
  ok: results.length - hardFailures.length,
  redirects: redirects.length,
  hardFailures: hardFailures.length,
  failures: hardFailures,
  redirectSamples: redirects.slice(0, 20),
};

writeJson(REPORT_PATH, report);

console.log(`Checked ${report.checked} production URL(s).`);
console.log(`OK: ${report.ok}`);
console.log(`Redirects: ${report.redirects}`);
console.log(`Hard failures: ${report.hardFailures}`);
console.log(`Report: ${REPORT_PATH}`);

if (hardFailures.length) {
  for (const failure of hardFailures.slice(0, 20)) {
    console.log(`  ${failure.status} ${failure.url}`);
  }
  if (failOnErrors) {
    process.exitCode = 1;
  }
}
