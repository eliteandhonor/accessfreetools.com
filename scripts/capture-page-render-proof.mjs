import { createReadStream, existsSync, statSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, extname, resolve } from 'node:path';
import { chromium } from 'playwright';

const mimeByExt = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.xml', 'application/xml; charset=utf-8'],
]);

function parseArgs(argv) {
  const options = {
    expect: [],
    forbid: [],
    expectedAlt: [],
    port: 4321,
    serveDist: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];
    if (arg === '--url') {
      options.url = next;
      i += 1;
    } else if (arg === '--out-prefix') {
      options.outPrefix = next;
      i += 1;
    } else if (arg === '--expect') {
      options.expect.push(next);
      i += 1;
    } else if (arg === '--forbid') {
      options.forbid.push(next);
      i += 1;
    } else if (arg === '--expected-alt') {
      options.expectedAlt.push(next);
      i += 1;
    } else if (arg === '--port') {
      options.port = Number(next);
      i += 1;
    } else if (arg === '--serve-dist') {
      options.serveDist = true;
    }
  }

  if (!options.url || !options.outPrefix) {
    throw new Error('Usage: node scripts/capture-page-render-proof.mjs --url <url|path> --out-prefix <path> [--serve-dist]');
  }

  return options;
}

function toFilePath(root, requestUrl) {
  const parsed = new URL(requestUrl, 'http://127.0.0.1');
  const pathname = decodeURIComponent(parsed.pathname);
  const safePath = pathname.replace(/^\/+/, '').replaceAll('..', '');
  const directPath = resolve(root, safePath);

  if (existsSync(directPath) && statSync(directPath).isFile()) return directPath;

  const indexPath = resolve(root, safePath, 'index.html');
  if (existsSync(indexPath)) return indexPath;

  return resolve(root, '404.html');
}

async function startStaticServer(root, port) {
  const server = createServer((request, response) => {
    const filePath = toFilePath(root, request.url ?? '/');
    const type = mimeByExt.get(extname(filePath)) ?? 'application/octet-stream';
    response.setHeader('content-type', type);
    createReadStream(filePath)
      .on('error', () => {
        response.statusCode = 404;
        response.end('Not found');
      })
      .pipe(response);
  });

  await new Promise((resolvePromise) => {
    server.listen(port, '127.0.0.1', resolvePromise);
  });

  return server;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const root = resolve('dist/client');
  const server = options.serveDist ? await startStaticServer(root, options.port) : undefined;
  const targetUrl = options.url.startsWith('/')
    ? `http://127.0.0.1:${options.port}${options.url}`
    : options.url;

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
    const response = await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await mkdir(dirname(resolve(`${options.outPrefix}.png`)), { recursive: true });
    await page.screenshot({ path: `${options.outPrefix}.png`, fullPage: true });

    const snapshot = await page.locator('body').innerText({ timeout: 10000 });
    const html = await page.content();
    const title = await page.title();
    const imageAlts = await page.locator('img').evaluateAll((imgs) =>
      imgs.map((img) => ({
        alt: img.getAttribute('alt') ?? '',
        src: img.getAttribute('src') ?? '',
        title: img.getAttribute('title') ?? '',
      })),
    );

    const haystack = `${title}\n${snapshot}\n${html}`;
    const expectedMisses = options.expect.filter((item) => !haystack.includes(item));
    const forbiddenHits = options.forbid.filter((item) => haystack.includes(item));
    const missingAlt = options.expectedAlt.filter((item) => !imageAlts.some((img) => img.alt === item));

    const summary = {
      generatedAt: new Date().toISOString(),
      url: targetUrl,
      finalUrl: page.url(),
      status: response?.status() ?? null,
      title,
      expectedMisses,
      forbiddenHits,
      missingAlt,
      imageAlts,
      screenshot: `${options.outPrefix}.png`,
      dom: `${options.outPrefix}-dom.txt`,
      text: `${options.outPrefix}-text.txt`,
    };

    await writeFile(`${options.outPrefix}-dom.txt`, html, 'utf8');
    await writeFile(`${options.outPrefix}-text.txt`, snapshot, 'utf8');
    await writeFile(`${options.outPrefix}-summary.json`, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');

    if (expectedMisses.length || forbiddenHits.length || missingAlt.length) {
      console.log(JSON.stringify(summary, null, 2));
      process.exitCode = 1;
      return;
    }

    console.log(`Render proof captured: ${options.outPrefix}`);
  } finally {
    await browser.close();
    if (server) {
      await new Promise((resolvePromise) => server.close(resolvePromise));
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
