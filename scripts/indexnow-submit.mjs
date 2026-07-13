import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const INDEXNOW_HOST = 'accessfreetools.com';
export const INDEXNOW_ORIGIN = `https://${INDEXNOW_HOST}`;
export const INDEXNOW_KEY = '79e3e302ad4545d592d9b53f6ae2350f';
export const INDEXNOW_KEY_FILE_NAME = `${INDEXNOW_KEY}.txt`;
export const INDEXNOW_KEY_LOCATION = `${INDEXNOW_ORIGIN}/${INDEXNOW_KEY_FILE_NAME}`;
export const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow';

const USAGE = `Access Free Tools IndexNow submitter

Usage:
  node scripts/indexnow-submit.mjs --help
  node scripts/indexnow-submit.mjs --verify-key [--verify-production]
  npm run indexnow:submit -- https://accessfreetools.com/path/ [URL ...]
  node scripts/indexnow-submit.mjs --url=https://accessfreetools.com/path/ [--url=...] [--verify-production]
  node scripts/indexnow-submit.mjs --all [--dry-run] [--verify-production]

Options:
  --help               Show this help without reading files or using the network.
  --verify-key         Verify the key only; never submit URLs.
  --verify-production  Verify the live key before a real submission.
  URL                  Submit a canonical URL passed positionally by npm.
  --url=URL            Submit one changed canonical URL. Repeat for more URLs.
  --all                Submit every canonical URL from the built XML sitemaps.
  --dry-run            Build and save a report without any network requests.
  --limit=N            Limit selected URLs to an integer from 1 to 10000.

Routine releases should use explicit URL values. Reserve --all for migrations,
large launches, or major sitemap changes.`;

export function parseIndexNowArgs(argv = []) {
  const parsed = {
    all: false,
    dryRun: false,
    help: false,
    limit: 10_000,
    urls: [],
    verifyKey: false,
    verifyProduction: false,
  };
  const unknown = [];

  for (const arg of argv) {
    if (arg === '--all') parsed.all = true;
    else if (arg === '--dry-run') parsed.dryRun = true;
    else if (arg === '--help' || arg === '-h') parsed.help = true;
    else if (arg === '--verify-key') parsed.verifyKey = true;
    else if (arg === '--verify-production') parsed.verifyProduction = true;
    else if (arg.startsWith('--url=')) parsed.urls.push(arg.slice('--url='.length));
    else if (/^https?:\/\//i.test(arg)) parsed.urls.push(arg);
    else if (arg.startsWith('--limit=')) parsed.limit = Number(arg.slice('--limit='.length));
    else unknown.push(arg);
  }

  if (unknown.length) {
    throw new Error(`Unknown IndexNow option${unknown.length === 1 ? '' : 's'}: ${unknown.join(', ')}\n\n${USAGE}`);
  }
  if (!Number.isInteger(parsed.limit) || parsed.limit < 1 || parsed.limit > 10_000) {
    throw new Error(`--limit must be an integer from 1 to 10000.\n\n${USAGE}`);
  }
  if (parsed.all && parsed.urls.length) {
    throw new Error(`Choose either --all or one or more explicit URL values, not both.\n\n${USAGE}`);
  }
  if (parsed.verifyKey && (parsed.all || parsed.urls.length || parsed.dryRun)) {
    throw new Error(`--verify-key is a verification-only action and cannot select URLs.\n\n${USAGE}`);
  }
  if (parsed.dryRun && parsed.verifyProduction) {
    throw new Error(`--dry-run never uses the network, so it cannot be combined with --verify-production.\n\n${USAGE}`);
  }

  return parsed;
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function reportPaths(cwd, generatedAt) {
  const stamp = generatedAt.replace(/[:.]/g, '-');
  return {
    archive: resolve(cwd, 'output', 'indexnow', `submission-${stamp}.json`),
    latest: resolve(cwd, 'output', 'indexnow-submission.json'),
  };
}

export function writeIndexNowReport(cwd, report) {
  const paths = reportPaths(cwd, report.generatedAt);
  writeJson(paths.archive, report);
  writeJson(paths.latest, report);
  return paths;
}

export function assertLocalKeyFile(cwd = process.cwd()) {
  const keyPath = resolve(cwd, 'public', INDEXNOW_KEY_FILE_NAME);

  if (!existsSync(keyPath)) {
    throw new Error(`IndexNow key file is missing: ${keyPath}`);
  }

  const content = readFileSync(keyPath, 'utf8').trim();

  if (content !== INDEXNOW_KEY) {
    throw new Error(`IndexNow key file must contain only the key value. Found: ${content}`);
  }

  return keyPath;
}

async function assertProductionKeyFile(fetchImpl) {
  const response = await fetchImpl(INDEXNOW_KEY_LOCATION, {
    headers: {
      'User-Agent': 'AccessFreeTools-IndexNow-Setup/1.0',
    },
  });
  const content = (await response.text()).trim();

  if (!response.ok || content !== INDEXNOW_KEY) {
    throw new Error(
      `Production IndexNow key is not live yet at ${INDEXNOW_KEY_LOCATION}. ` +
        `Got HTTP ${response.status} with body "${content.slice(0, 80)}". Deploy first, then submit.`,
    );
  }
}

function sitemapDirectories(cwd) {
  return [resolve(cwd, 'dist', 'client'), resolve(cwd, 'dist')].filter((directory) => existsSync(directory));
}

export function readSitemapUrls(cwd = process.cwd()) {
  const urls = new Set();

  for (const directory of sitemapDirectories(cwd)) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.startsWith('sitemap') || !entry.name.endsWith('.xml')) {
        continue;
      }

      const xml = readFileSync(join(directory, entry.name), 'utf8');

      for (const match of xml.matchAll(/<loc>([\s\S]*?)<\/loc>/g)) {
        const url = normalizeIndexNowUrl(match[1].trim());
        if (!url.endsWith('.xml')) urls.add(url);
      }
    }
  }

  return [...urls].sort();
}

export function normalizeIndexNowUrl(value) {
  let url;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`Invalid IndexNow URL: ${value}`);
  }

  if (url.origin !== INDEXNOW_ORIGIN || url.username || url.password || url.search || url.hash) {
    throw new Error(`IndexNow URLs must be canonical ${INDEXNOW_ORIGIN} URLs without credentials, queries, or fragments: ${value}`);
  }

  return url.href;
}

function chunk(items, size) {
  const chunks = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

async function submitUrls(fetchImpl, urls) {
  const payload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: urls,
  };
  const response = await fetchImpl(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'User-Agent': 'AccessFreeTools-IndexNow-Submitter/1.0',
    },
    body: JSON.stringify(payload),
  });
  const body = await response.text();

  return {
    body,
    ok: response.ok || response.status === 202,
    status: response.status,
    statusText: response.statusText,
  };
}

export async function runIndexNow({
  argv = process.argv.slice(2),
  cwd = process.cwd(),
  fetchImpl = globalThis.fetch,
  log = console.log,
  now = () => new Date(),
  reportWriter = writeIndexNowReport,
} = {}) {
  const args = parseIndexNowArgs(argv);

  if (args.help) {
    log(USAGE);
    return { action: 'help', networkRequests: 0 };
  }

  if (args.verifyKey) {
    const keyPath = assertLocalKeyFile(cwd);
    if (args.verifyProduction) await assertProductionKeyFile(fetchImpl);

    const report = {
      dryRun: false,
      endpoint: INDEXNOW_ENDPOINT,
      generatedAt: now().toISOString(),
      host: INDEXNOW_HOST,
      keyFile: keyPath,
      keyLocation: INDEXNOW_KEY_LOCATION,
      mode: args.verifyProduction ? 'local-and-production-key-check' : 'local-key-check',
      submissions: [],
      urlCount: 0,
      urls: [],
    };
    const paths = reportWriter(cwd, report);
    log(`IndexNow key verification passed. Saved reports to ${paths.latest} and ${paths.archive}`);
    return { action: 'verify-key', paths, report };
  }

  if (!args.all && !args.urls.length) {
    throw new Error(`Refusing to submit without an explicit --url or --all selection.\n\n${USAGE}`);
  }

  const keyPath = assertLocalKeyFile(cwd);
  const selectedUrls = args.all ? readSitemapUrls(cwd) : args.urls.map(normalizeIndexNowUrl);
  const urls = [...new Set(selectedUrls)].slice(0, args.limit);

  if (!urls.length) {
    throw new Error('No IndexNow URLs were found. Run `npm run build` first or pass --url=https://accessfreetools.com/... .');
  }
  if (args.verifyProduction) await assertProductionKeyFile(fetchImpl);

  const report = {
    dryRun: args.dryRun,
    endpoint: INDEXNOW_ENDPOINT,
    generatedAt: now().toISOString(),
    host: INDEXNOW_HOST,
    keyFile: keyPath,
    keyLocation: INDEXNOW_KEY_LOCATION,
    mode: args.all ? 'all-sitemap-urls' : 'explicit-urls',
    submissions: [],
    urlCount: urls.length,
    urls,
  };

  if (args.dryRun) {
    log(`IndexNow dry run: ${urls.length} URLs ready for ${INDEXNOW_ENDPOINT}`);
  } else {
    for (const urlChunk of chunk(urls, 10_000)) {
      const submission = await submitUrls(fetchImpl, urlChunk);
      report.submissions.push(submission);
      log(`IndexNow submitted ${urlChunk.length} URLs: HTTP ${submission.status} ${submission.statusText}`);

      if (!submission.ok) process.exitCode = 1;
    }
  }

  const paths = reportWriter(cwd, report);
  log(`Saved IndexNow reports to ${paths.latest} and ${paths.archive}`);
  return { action: args.dryRun ? 'dry-run' : 'submit', paths, report };
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  runIndexNow().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
