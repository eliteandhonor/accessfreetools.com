import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import {
  fetchWithTransientRetry,
  isSameUrlRedirect,
  isTransientHttpStatus,
} from './lib/transient-http.mjs';

const SITE_ORIGIN = 'https://accessfreetools.com';
const SITEMAP_URL = `${SITE_ORIGIN}/sitemap.xml`;
const REPORT_PATH = resolve('output/production-sitemap-check.json');
const SEARCH_CONSOLE_REPORT = resolve('output/search-console-performance.json');
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/138.0.0.0 Safari/537.36 AccessFreeToolsProductionSitemapCheck/1.0';
const LEGACY_URLS = [
  `${SITE_ORIGIN}/calculators`,
  `${SITE_ORIGIN}/deep-research`,
  `${SITE_ORIGIN}/advanced-age-calculator`,
  `${SITE_ORIGIN}/maximize-your-revenue-the-ultimate-free-google-adsense-earnings-calculator-for-2025`,
];

const args = process.argv.slice(2);
const npmWarnOnly = process.env.npm_config_warn_only === 'true';
const npmMaxUrls = process.env.npm_config_max_urls;
const npmConcurrency = process.env.npm_config_concurrency;
const npmTimeoutMs = process.env.npm_config_timeout_ms;
const npmRetries = process.env.npm_config_retries;
const failOnErrors = !args.includes('--warn-only') && !npmWarnOnly;
const maxUrls = Number(args.find((arg) => arg.startsWith('--max-urls='))?.slice('--max-urls='.length) ?? npmMaxUrls ?? Infinity);
const concurrency = Math.max(
  1,
  Number(args.find((arg) => arg.startsWith('--concurrency='))?.slice('--concurrency='.length) ?? npmConcurrency ?? 4),
);
const timeoutMs = Math.max(
  5_000,
  Number(args.find((arg) => arg.startsWith('--timeout-ms='))?.slice('--timeout-ms='.length) ?? npmTimeoutMs ?? 20_000),
);
const retries = Math.max(
  0,
  Number(args.find((arg) => arg.startsWith('--retries='))?.slice('--retries='.length) ?? npmRetries ?? 2),
);

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function sitemapUrls(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim());
}

function isSitemapIndex(xml) {
  return /<sitemapindex[\s>]/i.test(xml);
}

async function fetchSitemapUrls(url, seen = new Set()) {
  if (seen.has(url)) return { sitemapRequests: [], sitemapsChecked: [], urls: [] };
  seen.add(url);

  const request = await fetchWithTransientRetry(
    url,
    {
      headers: {
        'user-agent': USER_AGENT,
      },
    },
    {
      attempts: retries + 1,
      retryDelayMs: 500,
    },
  );
  const response = request.response;
  if (!response.ok) {
    throw new Error(`Could not fetch ${url}: HTTP ${response.status} after ${request.attempts} attempt(s)`);
  }

  const xml = await response.text();
  const locs = sitemapUrls(xml);
  if (!isSitemapIndex(xml)) {
    return {
      sitemapRequests: [{ attempts: request.attempts, url }],
      sitemapsChecked: [url],
      urls: locs,
    };
  }

  const nested = [];
  for (const loc of locs) {
    nested.push(await fetchSitemapUrls(loc, seen));
  }
  return {
    sitemapRequests: [
      { attempts: request.attempts, url },
      ...nested.flatMap((item) => item.sitemapRequests),
    ],
    sitemapsChecked: [url, ...nested.flatMap((item) => item.sitemapsChecked)],
    urls: nested.flatMap((item) => item.urls),
  };
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

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function fetchUrl(url, method) {
  return fetch(url, {
    method,
    redirect: 'manual',
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      'user-agent': USER_AGENT,
    },
  });
}

async function checkUrl(url) {
  const startedAt = Date.now();
  let lastError = '';
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      let response = await fetchUrl(url, 'HEAD');
      if (response.status === 405 || response.status === 403) {
        response = await fetchUrl(url, 'GET');
      }

      const transientStatus = isTransientHttpStatus(response.status);
      const selfRedirect = isSameUrlRedirect(response, url);
      if ((transientStatus || selfRedirect) && attempt < retries) {
        lastError = selfRedirect ? `self-redirect HTTP ${response.status}` : `HTTP ${response.status}`;
        await response.arrayBuffer().catch(() => {});
        await sleep(500 * (attempt + 1));
        continue;
      }

      return {
        url,
        status: response.status,
        ok: response.status >= 200 && response.status < 400 && !selfRedirect,
        location: response.headers.get('location') ?? '',
        durationMs: Date.now() - startedAt,
        attempts: attempt + 1,
        selfRedirect,
        ...(selfRedirect ? { error: 'Hostinger/CDN returned a redirect to the same URL.' } : {}),
        ...(lastError ? { recoveredFrom: lastError } : {}),
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      try {
        const response = await fetchUrl(url, 'GET');
        return {
          url,
          status: response.status,
          ok: response.status >= 200 && response.status < 400,
          location: response.headers.get('location') ?? '',
          durationMs: Date.now() - startedAt,
          attempts: attempt + 1,
          recoveredFrom: lastError,
        };
      } catch (getError) {
        lastError = getError instanceof Error ? getError.message : String(getError);
      }

      if (attempt < retries) {
        await sleep(500 * (attempt + 1));
      }
    }
  }

  return {
    url,
    status: 0,
    ok: false,
    location: '',
    error: lastError,
    durationMs: Date.now() - startedAt,
    attempts: retries + 1,
  };
}

async function runPool(items, worker) {
  const results = [];
  const queue = [...items];
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length) {
      const next = queue.shift();
      results.push(await worker(next));
    }
  });
  await Promise.all(workers);
  return results;
}

const sitemapResult = await fetchSitemapUrls(SITEMAP_URL);
const sitemap = sitemapResult.urls;
const urls = [...new Set([...sitemap, ...searchConsolePageUrls(), ...LEGACY_URLS])].slice(0, maxUrls);
const results = await runPool(urls, checkUrl);
const hardFailures = results.filter((result) => result.status >= 400 || result.status === 0 || result.selfRedirect);
const redirects = results.filter((result) => result.status >= 300 && result.status < 400);
const report = {
  generatedAt: new Date().toISOString(),
  sitemapUrl: SITEMAP_URL,
  sitemapsChecked: sitemapResult.sitemapsChecked,
  sitemapRequests: sitemapResult.sitemapRequests,
  checked: results.length,
  concurrency,
  timeoutMs,
  retries,
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
const recoveredSitemaps = report.sitemapRequests.filter((request) => request.attempts > 1);
console.log(`Sitemap gateway recoveries: ${recoveredSitemaps.length}`);
console.log(`Report: ${REPORT_PATH}`);

if (hardFailures.length) {
  for (const failure of hardFailures.slice(0, 20)) {
    console.log(`  ${failure.status} ${failure.url}`);
  }
  if (failOnErrors) {
    process.exitCode = 1;
  }
}
