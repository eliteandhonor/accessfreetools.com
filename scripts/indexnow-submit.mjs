import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const HOST = 'accessfreetools.com';
const ORIGIN = `https://${HOST}`;
const INDEXNOW_KEY = '79e3e302ad4545d592d9b53f6ae2350f';
const KEY_FILE_NAME = `${INDEXNOW_KEY}.txt`;
const KEY_LOCATION = `${ORIGIN}/${KEY_FILE_NAME}`;
const ENDPOINT = 'https://api.indexnow.org/IndexNow';
const OUTPUT_PATH = resolve('output/indexnow-submission.json');
const PRIORITY_PATHS = [
  '/',
  '/tools/',
  '/categories/',
  '/free-calculator-resources/',
  '/blog/',
  '/about/',
  '/why-access-free-tools/',
  '/contact/',
  '/privacy-policy/',
  '/terms/',
  '/advertising-disclosure/',
];

function parseArgs() {
  const args = process.argv.slice(2);

  return {
    all: args.includes('--all'),
    dryRun: args.includes('--dry-run'),
    verifyKey: args.includes('--verify-key'),
    verifyProduction: args.includes('--verify-production'),
    urls: args.filter((arg) => arg.startsWith('--url=')).map((arg) => arg.slice('--url='.length)),
    limit: Number(args.find((arg) => arg.startsWith('--limit='))?.slice('--limit='.length) ?? 10_000),
  };
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function assertLocalKeyFile() {
  const keyPath = resolve('public', KEY_FILE_NAME);

  if (!existsSync(keyPath)) {
    throw new Error(`IndexNow key file is missing: ${keyPath}`);
  }

  const content = readFileSync(keyPath, 'utf8').trim();

  if (content !== INDEXNOW_KEY) {
    throw new Error(`IndexNow key file must contain only the key value. Found: ${content}`);
  }

  return keyPath;
}

async function assertProductionKeyFile() {
  const response = await fetch(KEY_LOCATION, {
    headers: {
      'User-Agent': 'AccessFreeTools-IndexNow-Setup/1.0',
    },
  });
  const content = (await response.text()).trim();

  if (!response.ok || content !== INDEXNOW_KEY) {
    throw new Error(
      `Production IndexNow key is not live yet at ${KEY_LOCATION}. ` +
        `Got HTTP ${response.status} with body "${content.slice(0, 80)}". Deploy first, then submit.`,
    );
  }
}

function sitemapDirectories() {
  return [resolve('dist', 'client'), resolve('dist')].filter((directory) => existsSync(directory));
}

function readSitemapUrls() {
  const urls = new Set();

  for (const directory of sitemapDirectories()) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.startsWith('sitemap') || !entry.name.endsWith('.xml')) {
        continue;
      }

      const xml = readFileSync(join(directory, entry.name), 'utf8');

      for (const match of xml.matchAll(/<loc>([\s\S]*?)<\/loc>/g)) {
        const url = match[1].trim();

        if (url.startsWith(`${ORIGIN}/`) && !url.endsWith('.xml')) {
          urls.add(url);
        }
      }
    }
  }

  return [...urls].sort();
}

function priorityUrls() {
  return PRIORITY_PATHS.map((path) => `${ORIGIN}${path}`);
}

function chunk(items, size) {
  const chunks = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

async function submitUrls(urls) {
  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'User-Agent': 'AccessFreeTools-IndexNow-Submitter/1.0',
    },
    body: JSON.stringify(payload),
  });
  const body = await response.text();

  return {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok || response.status === 202,
    body,
  };
}

async function main() {
  const args = parseArgs();
  const keyPath = assertLocalKeyFile();

  if (args.verifyProduction) {
    await assertProductionKeyFile();
  }

  let urls = args.urls.length > 0 ? args.urls : args.all ? readSitemapUrls() : priorityUrls();
  urls = [...new Set(urls)]
    .filter((url) => url.startsWith(`${ORIGIN}/`))
    .slice(0, args.limit);

  if (!urls.length) {
    throw new Error('No IndexNow URLs were found. Run `npm run build` first or pass --url=https://accessfreetools.com/... .');
  }

  const report = {
    generatedAt: new Date().toISOString(),
    host: HOST,
    keyFile: keyPath,
    keyLocation: KEY_LOCATION,
    endpoint: ENDPOINT,
    mode: args.all ? 'all-sitemap-urls' : args.urls.length > 0 ? 'explicit-urls' : 'priority-urls',
    dryRun: args.dryRun,
    urlCount: urls.length,
    urls,
    submissions: [],
  };

  if (args.verifyKey && !args.dryRun) {
    console.log(`Local IndexNow key file is valid: ${keyPath}`);
    if (args.verifyProduction) {
      console.log(`Production IndexNow key file is live: ${KEY_LOCATION}`);
    }
    writeJson(OUTPUT_PATH, report);
    return;
  }

  if (args.dryRun) {
    console.log(`IndexNow dry run: ${urls.length} URLs ready for ${ENDPOINT}`);
    writeJson(OUTPUT_PATH, report);
    return;
  }

  for (const urlChunk of chunk(urls, 10_000)) {
    const submission = await submitUrls(urlChunk);
    report.submissions.push(submission);
    console.log(`IndexNow submitted ${urlChunk.length} URLs: HTTP ${submission.status} ${submission.statusText}`);

    if (!submission.ok) {
      process.exitCode = 1;
    }
  }

  writeJson(OUTPUT_PATH, report);
  console.log(`Saved IndexNow report to ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
