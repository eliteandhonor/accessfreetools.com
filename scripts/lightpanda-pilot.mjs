import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { createServer } from 'node:net';
import { performance } from 'node:perf_hooks';

import { chromium } from 'playwright';

import {
  CleanupStack,
  LIGHTPANDA_IMAGE,
  LIGHTPANDA_VERSION,
  PILOT_USER_AGENT,
  PILOT_VIEWPORT,
  buildLightpandaDockerArgs,
  compareSnapshots,
  hashText,
  isAllowedPilotRequest,
  normalizeSnapshot,
  redactReport,
  selectPilotRoutes,
} from './lib/lightpanda-pilot.mjs';

const ROOT_DIR = resolve('.');
const OUTPUT_DIR = resolve('output/lightpanda-pilot');
const RUN_COUNT = 3;
const CONCURRENCY = 4;
const NAVIGATION_TIMEOUT_MS = 30_000;
const HYDRATION_WAIT_MS = 500;
const DOCKER_TIMEOUT_MS = 240_000;
const CDP_OPERATION_TIMEOUT_MS = 20_000;

function parseMode(argv) {
  if (argv.includes('--preflight')) return 'preflight';
  if (argv.includes('--setup')) return 'setup';
  return 'pilot';
}

function commandResult(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? ROOT_DIR,
    encoding: 'utf8',
    env: options.env ?? process.env,
    maxBuffer: options.maxBuffer ?? 8 * 1024 * 1024,
    shell: false,
    timeout: options.timeoutMs ?? 60_000,
    windowsHide: true,
  });
  return {
    code: result.status ?? (result.error ? 1 : 0),
    error: result.error?.message ?? null,
    stderr: String(result.stderr ?? '').trim(),
    stdout: String(result.stdout ?? '').trim(),
  };
}

function runCommand(command, args, options = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? ROOT_DIR,
      env: options.env ?? process.env,
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });
    const stdout = [];
    const stderr = [];
    let totalBytes = 0;
    const maxBytes = options.maxBytes ?? 8 * 1024 * 1024;
    const timer = setTimeout(() => {
      killProcessTree(child);
      reject(new Error(`${command} ${args.join(' ')} timed out after ${options.timeoutMs ?? 60_000} ms.`));
    }, options.timeoutMs ?? 60_000);

    const append = (target, chunk) => {
      if (totalBytes >= maxBytes) return;
      const slice = chunk.subarray(0, Math.max(0, maxBytes - totalBytes));
      target.push(slice);
      totalBytes += slice.length;
    };
    child.stdout?.on('data', (chunk) => append(stdout, chunk));
    child.stderr?.on('data', (chunk) => append(stderr, chunk));
    child.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      const result = {
        code: code ?? 1,
        stderr: Buffer.concat(stderr).toString('utf8').trim(),
        stdout: Buffer.concat(stdout).toString('utf8').trim(),
      };
      if (result.code !== 0 && !options.allowFailure) {
        reject(
          new Error(
            `${command} ${args.join(' ')} failed (${result.code}): ${result.stderr || result.stdout || 'no output'}`,
          ),
        );
        return;
      }
      resolvePromise(result);
    });
  });
}

function killProcessTree(child) {
  if (!child?.pid) return;
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], {
      shell: false,
      stdio: 'ignore',
      windowsHide: true,
    });
    return;
  }
  try {
    child.kill('SIGTERM');
  } catch {
    // The process may already be gone.
  }
}

function findDockerDesktop() {
  const candidates = [
    process.env.DOCKER_DESKTOP_PATH,
    join(process.env.ProgramFiles ?? 'C:\\Program Files', 'Docker', 'Docker', 'Docker Desktop.exe'),
    join(process.env.LOCALAPPDATA ?? '', 'Docker', 'Docker Desktop.exe'),
  ].filter(Boolean);
  return candidates.find((path) => existsSync(path)) ?? null;
}

function dockerDaemonStatus() {
  const result = commandResult('docker', ['info', '--format', '{{.ServerVersion}}'], { timeoutMs: 15_000 });
  return {
    available: result.code === 0 && Boolean(result.stdout),
    error: result.code === 0 ? null : result.stderr || result.error || result.stdout,
    version: result.code === 0 ? result.stdout : null,
  };
}

async function waitUntil(check, timeoutMs, label, intervalMs = 1_000) {
  const started = Date.now();
  let lastError = null;
  while (Date.now() - started < timeoutMs) {
    try {
      const value = await check();
      if (value) return value;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, intervalMs));
  }
  throw new Error(
    `Timed out waiting for ${label}.${lastError ? ` Last error: ${lastError.message}` : ''}`,
  );
}

async function withTimeout(promise, timeoutMs, label) {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs} ms.`)), timeoutMs);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

async function ensureDockerDaemon() {
  const current = dockerDaemonStatus();
  if (current.available) return current;

  const dockerDesktopPath = findDockerDesktop();
  if (!dockerDesktopPath) {
    throw new Error('Docker Desktop is not installed in a known location and the Docker daemon is unavailable.');
  }

  const child = spawn(dockerDesktopPath, [], {
    detached: true,
    shell: false,
    stdio: 'ignore',
    windowsHide: true,
  });
  child.unref();
  return waitUntil(
    () => {
      const status = dockerDaemonStatus();
      return status.available ? status : null;
    },
    DOCKER_TIMEOUT_MS,
    'Docker Desktop',
    2_000,
  );
}

async function runPreflight() {
  const nodeMajor = Number(process.versions.node.split('.')[0]);
  const dockerCli = commandResult('docker', ['--version']);
  const daemon = dockerDaemonStatus();
  const dockerDesktopPath = findDockerDesktop();
  const playwrightPath = chromium.executablePath();
  const registry = dockerCli.code === 0
    ? commandResult('docker', ['buildx', 'imagetools', 'inspect', LIGHTPANDA_IMAGE], { timeoutMs: 90_000 })
    : { code: 1, error: 'Docker CLI unavailable', stderr: '', stdout: '' };
  const npmPackageInstalled = existsSync(resolve('node_modules/@lightpanda/browser'));

  const checks = {
    dockerCli: {
      detail: dockerCli.stdout || dockerCli.stderr || dockerCli.error,
      pass: dockerCli.code === 0,
    },
    dockerDaemon: {
      detail: daemon.available ? `running (${daemon.version})` : 'stopped; setup will start Docker Desktop',
      pass: daemon.available || Boolean(dockerDesktopPath),
    },
    dockerDesktop: {
      detail: dockerDesktopPath ?? 'not found',
      pass: daemon.available || Boolean(dockerDesktopPath),
    },
    node24: {
      detail: process.versions.node,
      pass: nodeMajor === 24,
    },
    pinnedRegistryImage: {
      detail: registry.code === 0 ? LIGHTPANDA_IMAGE : registry.stderr || registry.error || registry.stdout,
      pass: registry.code === 0,
    },
    playwrightChromium: {
      detail: playwrightPath,
      pass: existsSync(playwrightPath),
    },
    noLightpandaNpmPackage: {
      detail: npmPackageInstalled ? 'unexpectedly installed' : 'not installed',
      pass: !npmPackageInstalled,
    },
  };
  const hardFailures = Object.entries(checks).filter(([, result]) => !result.pass).map(([name]) => name);
  const report = {
    checks,
    image: LIGHTPANDA_IMAGE,
    status: hardFailures.length ? 'blocked' : daemon.available ? 'ready' : 'ready-with-setup',
    timestamp: new Date().toISOString(),
    version: LIGHTPANDA_VERSION,
  };

  console.log(JSON.stringify(redactReport(report), null, 2));
  if (hardFailures.length) throw new Error(`Lightpanda preflight failed: ${hardFailures.join(', ')}`);
  return report;
}

async function verifyLightpandaVersion() {
  const baseArgs = [
    'run',
    '--rm',
    '--network',
    'none',
    '--cap-drop',
    'ALL',
    '--security-opt',
    'no-new-privileges:true',
    '--memory',
    '128m',
    '--cpus',
    '1',
    '--pids-limit',
    '64',
    '--ulimit',
    'core=0:0',
    '--env',
    'LIGHTPANDA_DISABLE_TELEMETRY=true',
    LIGHTPANDA_IMAGE,
    '/bin/lightpanda',
  ];
  let result = await runCommand('docker', [...baseArgs, '--version'], {
    allowFailure: true,
    timeoutMs: 60_000,
  });
  if (result.code !== 0 || !result.stdout.includes(LIGHTPANDA_VERSION)) {
    result = await runCommand('docker', [...baseArgs, 'version'], {
      allowFailure: true,
      timeoutMs: 60_000,
    });
  }
  const output = `${result.stdout}\n${result.stderr}`.trim();
  if (result.code !== 0 || !output.includes(LIGHTPANDA_VERSION)) {
    throw new Error(`Pinned Lightpanda image did not report version ${LIGHTPANDA_VERSION}: ${output || 'no output'}`);
  }
  return output;
}

async function runSetup() {
  const daemon = await ensureDockerDaemon();
  await runCommand('docker', ['pull', LIGHTPANDA_IMAGE], { timeoutMs: DOCKER_TIMEOUT_MS });
  const inspect = await runCommand(
    'docker',
    ['image', 'inspect', '--format', '{{json .RepoDigests}}', LIGHTPANDA_IMAGE],
    { timeoutMs: 30_000 },
  );
  if (!inspect.stdout.includes(LIGHTPANDA_IMAGE.split('@')[1])) {
    throw new Error(`Docker cached image does not expose the required digest: ${inspect.stdout}`);
  }
  const versionOutput = await verifyLightpandaVersion();
  const report = {
    dockerServerVersion: daemon.version,
    image: LIGHTPANDA_IMAGE,
    status: 'ready',
    timestamp: new Date().toISOString(),
    versionOutput,
  };
  console.log(JSON.stringify(redactReport(report), null, 2));
  return report;
}

function decodeXml(value) {
  return String(value)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function readBuiltSitemapUrls() {
  const publicDirCandidates = [resolve('dist/client'), resolve('dist')];
  const publicDir = publicDirCandidates.find((path) => existsSync(join(path, 'sitemap.xml')));
  if (!publicDir) throw new Error('Built sitemap.xml is missing. Run npm run build first.');

  const urls = new Set();
  const visited = new Set();
  const readSitemap = (path) => {
    const absolutePath = resolve(path);
    if (visited.has(absolutePath)) return;
    visited.add(absolutePath);
    if (!existsSync(absolutePath)) throw new Error(`Sitemap child is missing: ${absolutePath}`);
    const xml = readFileSync(absolutePath, 'utf8');
    const locs = [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((match) => decodeXml(match[1].trim()));
    if (/<sitemapindex\b/i.test(xml)) {
      for (const loc of locs) readSitemap(join(publicDir, basename(new URL(loc).pathname)));
      return;
    }
    for (const loc of locs) urls.add(loc);
  };

  readSitemap(join(publicDir, 'sitemap.xml'));
  return { publicDir, urls: [...urls].sort() };
}

async function findFreePort() {
  return new Promise((resolvePromise, reject) => {
    const server = createServer();
    server.unref();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close();
        reject(new Error('Could not allocate a local port.'));
        return;
      }
      const { port } = address;
      server.close((error) => (error ? reject(error) : resolvePromise(port)));
    });
  });
}

async function waitForHttp(url, timeoutMs) {
  return waitUntil(
    async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3_000);
      try {
        const response = await fetch(url, { redirect: 'manual', signal: controller.signal });
        return response.status >= 200 && response.status < 500 ? response : null;
      } finally {
        clearTimeout(timer);
      }
    },
    timeoutMs,
    url,
    300,
  );
}

async function startPreview(previewPort, cleanup) {
  const command = `npm run preview -- --host 0.0.0.0 --port ${previewPort}`;
  const child = process.platform === 'win32'
    ? spawn(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', command], {
        cwd: ROOT_DIR,
        env: process.env,
        shell: false,
        stdio: ['ignore', 'pipe', 'pipe'],
        windowsHide: true,
      })
    : spawn('npm', ['run', 'preview', '--', '--host', '0.0.0.0', '--port', String(previewPort)], {
        cwd: ROOT_DIR,
        env: process.env,
        shell: false,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
  let logs = '';
  const capture = (chunk) => {
    logs = `${logs}${chunk.toString('utf8')}`.slice(-20_000);
  };
  child.stdout?.on('data', capture);
  child.stderr?.on('data', capture);
  cleanup.add(async () => killProcessTree(child));

  await waitForHttp(`http://127.0.0.1:${previewPort}/`, 120_000);
  return { child, getLogs: () => logs };
}

async function startLightpandaContainer({ cdpPort, cleanup, previewPort }) {
  const containerName = `aft-lightpanda-${process.pid}-${Date.now()}`.toLowerCase();
  const args = buildLightpandaDockerArgs({ cdpPort, containerName, previewPort });
  const result = await runCommand('docker', args, { timeoutMs: 60_000 });
  const containerId = result.stdout.trim();
  if (!/^[a-f0-9]{12,64}$/i.test(containerId)) {
    throw new Error(`Docker did not return a valid Lightpanda container ID: ${containerId || 'empty'}`);
  }
  cleanup.add(async () => {
    await runCommand('docker', ['stop', '--timeout', '5', containerId], {
      allowFailure: true,
      timeoutMs: 15_000,
    });
  });
  await waitForHttp(`http://127.0.0.1:${cdpPort}/json/version`, 45_000);
  return { args, containerId, containerName };
}

async function lightpandaWebSocketEndpoint(cdpPort) {
  const response = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
  const value = await response.json();
  const raw = value.webSocketDebuggerUrl ?? value.webSocketUrl;
  if (!raw) throw new Error('Lightpanda /json/version did not include a WebSocket endpoint.');
  const endpoint = new URL(raw);
  endpoint.hostname = '127.0.0.1';
  endpoint.port = String(cdpPort);
  return { endpoint: endpoint.toString(), versionData: value };
}

function extractPageData() {
  const collectTypes = (value, types) => {
    if (Array.isArray(value)) {
      for (const item of value) collectTypes(item, types);
      return;
    }
    if (!value || typeof value !== 'object') return;
    const rawType = value['@type'];
    for (const type of Array.isArray(rawType) ? rawType : [rawType]) {
      if (typeof type === 'string') types.add(type);
    }
    for (const child of Object.values(value)) collectTypes(child, types);
  };

  const jsonLdTypes = new Set();
  let jsonLdCount = 0;
  let jsonLdInvalid = 0;
  for (const element of document.querySelectorAll('script[type="application/ld+json"]')) {
    jsonLdCount += 1;
    try {
      collectTypes(JSON.parse(element.textContent || ''), jsonLdTypes);
    } catch {
      jsonLdInvalid += 1;
    }
  }

  const main = document.querySelector('main') ?? document.body;
  return {
    canonical: document.querySelector('link[rel="canonical"]')?.href ?? '',
    description: document.querySelector('meta[name="description"]')?.content ?? '',
    h1: [...document.querySelectorAll('h1')].map((element) => element.textContent ?? ''),
    internalLinks: [...document.querySelectorAll('a[href]')].map((element) => element.href),
    jsonLdCount,
    jsonLdInvalid,
    jsonLdTypes: [...jsonLdTypes],
    language: document.documentElement.lang,
    mainText: main?.textContent ?? '',
    robots: document.querySelector('meta[name="robots"]')?.content ?? '',
    title: document.title,
    userAgent: navigator.userAgent,
  };
}

async function installRequestBoundary(context, allowedOrigin) {
  await context.route('**/*', async (route) => {
    if (isAllowedPilotRequest(route.request().url(), allowedOrigin)) {
      await route.continue();
      return;
    }
    await route.abort('blockedbyclient');
  });
}

async function mapLimit(values, limit, worker) {
  const results = new Array(values.length);
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(limit, values.length) }, async () => {
    while (nextIndex < values.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await worker(values[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}

function summarizeSemantic(markdownResult, axResult) {
  const markdown = String(markdownResult?.markdown ?? '');
  const nodes = Array.isArray(axResult?.nodes) ? axResult.nodes : [];
  const roles = nodes
    .filter((node) => !node.ignored)
    .map((node) => String(node.role?.value ?? '').toLowerCase())
    .filter(Boolean);
  const markdownSummary = {
    hasHeading: /^#{1,6}\s+\S/m.test(markdown),
    hasLink: /\[[^\]\n]+\]\([^)]+\)/m.test(markdown),
    hash: hashText(markdown),
    length: markdown.length,
    useful: markdown.length >= 100 && /^#{1,6}\s+\S/m.test(markdown) && /\[[^\]\n]+\]\([^)]+\)/m.test(markdown),
  };
  const accessibility = {
    headingCount: roles.filter((role) => role === 'heading').length,
    linkCount: roles.filter((role) => role === 'link').length,
    mainCount: roles.filter((role) => role === 'main').length,
    nodeCount: nodes.length,
  };
  accessibility.useful =
    accessibility.nodeCount > 0 &&
    accessibility.headingCount > 0 &&
    accessibility.linkCount > 0 &&
    accessibility.mainCount > 0;
  return { accessibility, markdown: markdownSummary };
}

async function auditPage({ allowedOrigin, page, route, semantic }) {
  const startedAt = performance.now();
  const errors = [];
  const onPageError = (error) => errors.push(error.message);
  page.on('pageerror', onPageError);
  try {
    const response = await page.goto(`${allowedOrigin}${route}`, {
      timeout: NAVIGATION_TIMEOUT_MS,
      waitUntil: 'domcontentloaded',
    });
    await page.waitForFunction(() => document.readyState === 'interactive' || document.readyState === 'complete', {
      timeout: 5_000,
    }).catch(() => {});
    await page.waitForTimeout(HYDRATION_WAIT_MS);
    const raw = await withTimeout(
      page.evaluate(extractPageData),
      CDP_OPERATION_TIMEOUT_MS,
      `${route} DOM extraction`,
    );
    const snapshot = normalizeSnapshot({
      ...raw,
      finalUrl: page.url(),
      status: response?.status() ?? 0,
    });
    let semanticSummary = null;
    if (semantic) {
      const session = await page.context().newCDPSession(page);
      try {
        const [markdownResult, axResult] = await withTimeout(
          Promise.all([
            session.send('LP.getMarkdown', {}),
            session.send('Accessibility.getFullAXTree', {}),
          ]),
          CDP_OPERATION_TIMEOUT_MS,
          `${route} Markdown and accessibility extraction`,
        );
        semanticSummary = summarizeSemantic(markdownResult, axResult);
      } finally {
        await session.detach().catch(() => {});
      }
    }

    return {
      durationMs: Number((performance.now() - startedAt).toFixed(2)),
      errors: errors.slice(0, 10),
      route,
      semantic: semanticSummary,
      snapshot,
      userAgent: raw.userAgent,
    };
  } finally {
    page.off('pageerror', onPageError);
  }
}

async function runEnginePass({ allowedOrigin, browser, engine, routes, semantic = false }) {
  const contextOptions = { viewport: PILOT_VIEWPORT };
  if (engine === 'chromium') contextOptions.userAgent = PILOT_USER_AGENT;
  const context = await browser.newContext(contextOptions);
  try {
    await installRequestBoundary(context, allowedOrigin);
    return await mapLimit(routes, CONCURRENCY, async (route) => {
      const page = await context.newPage();
      try {
        return await auditPage({ allowedOrigin, page, route, semantic });
      } catch (error) {
        return {
          durationMs: null,
          error: error instanceof Error ? error.message : String(error),
          errors: [],
          route,
          semantic: null,
          snapshot: null,
          userAgent: null,
        };
      } finally {
        await page.close().catch(() => {});
      }
    });
  } finally {
    await context.close().catch(() => {});
  }
}

async function runLightpandaPass({ allowedOrigin, endpoint, routes, semantic = false }) {
  let completed = 0;
  return mapLimit(routes, CONCURRENCY, async (route) => {
    let browser = null;
    let context = null;
    let page = null;
    try {
      browser = await withTimeout(
        chromium.connectOverCDP(endpoint),
        CDP_OPERATION_TIMEOUT_MS,
        `${route} Lightpanda connection`,
      );
      context = await withTimeout(
        browser.newContext({ viewport: PILOT_VIEWPORT }),
        CDP_OPERATION_TIMEOUT_MS,
        `${route} Lightpanda context`,
      );
      await withTimeout(
        installRequestBoundary(context, allowedOrigin),
        CDP_OPERATION_TIMEOUT_MS,
        `${route} request boundary`,
      );
      page = await withTimeout(
        context.newPage(),
        CDP_OPERATION_TIMEOUT_MS,
        `${route} Lightpanda page`,
      );
      return await withTimeout(
        auditPage({ allowedOrigin, page, route, semantic }),
        NAVIGATION_TIMEOUT_MS + CDP_OPERATION_TIMEOUT_MS * (semantic ? 2 : 1),
        `${route} Lightpanda audit`,
      );
    } catch (error) {
      return {
        durationMs: null,
        error: error instanceof Error ? error.message : String(error),
        errors: [],
        route,
        semantic: null,
        snapshot: null,
        userAgent: null,
      };
    } finally {
      if (page) {
        await withTimeout(page.close(), 5_000, `${route} page close`).catch(() => {});
      }
      if (context) {
        await withTimeout(context.close(), 5_000, `${route} context close`).catch(() => {});
      }
      if (browser) {
        await withTimeout(browser.close(), 5_000, `${route} browser close`).catch(() => {});
      }
      completed += 1;
      if (completed % 10 === 0 || completed === routes.length) {
        console.log(`Lightpanda completed ${completed}/${routes.length}${semantic ? ' semantic' : ''} pages.`);
      }
    }
  });
}

function median(values) {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function parseMemoryBytes(value) {
  const match = String(value).match(/([\d.]+)\s*(B|KiB|MiB|GiB|KB|MB|GB)/i);
  if (!match) return null;
  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = {
    b: 1,
    gib: 1024 ** 3,
    gb: 1000 ** 3,
    kib: 1024,
    kb: 1000,
    mib: 1024 ** 2,
    mb: 1000 ** 2,
  };
  return Math.round(amount * multipliers[unit]);
}

async function dockerMemoryBytes(containerId) {
  const result = await runCommand(
    'docker',
    ['stats', '--no-stream', '--format', '{{.MemUsage}}', containerId],
    { allowFailure: true, timeoutMs: 10_000 },
  );
  return result.code === 0 ? parseMemoryBytes(result.stdout.split('/')[0]) : null;
}

async function processTreeMemoryBytes(rootPid) {
  if (!rootPid) return null;
  if (process.platform !== 'win32') {
    const result = await runCommand('ps', ['-eo', 'pid=,ppid=,rss='], {
      allowFailure: true,
      timeoutMs: 10_000,
    });
    if (result.code !== 0) return null;
    const rows = result.stdout
      .split(/\r?\n/)
      .map((line) => line.trim().split(/\s+/).map(Number))
      .filter((row) => row.length === 3 && row.every(Number.isFinite));
    const selected = new Set([rootPid]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const [pid, ppid] of rows) {
        if (selected.has(ppid) && !selected.has(pid)) {
          selected.add(pid);
          changed = true;
        }
      }
    }
    return rows.filter(([pid]) => selected.has(pid)).reduce((sum, row) => sum + row[2] * 1024, 0);
  }

  const script = [
    `$rootPid=${Number(rootPid)}`,
    '$all=Get-CimInstance Win32_Process',
    '$ids=New-Object System.Collections.Generic.HashSet[int]',
    '[void]$ids.Add($rootPid)',
    '$changed=$true',
    'while($changed){$changed=$false;foreach($p in $all){if($ids.Contains([int]$p.ParentProcessId)-and-not $ids.Contains([int]$p.ProcessId)){[void]$ids.Add([int]$p.ProcessId);$changed=$true}}}',
    '$sum=0',
    'foreach($id in $ids){try{$sum+=(Get-Process -Id $id -ErrorAction Stop).WorkingSet64}catch{}}',
    'Write-Output $sum',
  ].join(';');
  const shell = process.env.PWSH_EXE ?? 'pwsh';
  const result = await runCommand(shell, ['-NoLogo', '-NoProfile', '-NonInteractive', '-Command', script], {
    allowFailure: true,
    timeoutMs: 20_000,
  });
  const bytes = Number(result.stdout.trim());
  return result.code === 0 && Number.isFinite(bytes) ? bytes : null;
}

async function measurePeakMemory(sample, task) {
  let active = true;
  let peakBytes = 0;
  let samples = 0;
  const sampler = (async () => {
    while (active) {
      const value = await sample().catch(() => null);
      if (Number.isFinite(value)) {
        peakBytes = Math.max(peakBytes, value);
        samples += 1;
      }
      if (active) await new Promise((resolvePromise) => setTimeout(resolvePromise, 500));
    }
  })();
  const result = await task();
  active = false;
  await sampler;
  return { peakBytes: samples ? peakBytes : null, result, samples };
}

function summarizeRuns(runs) {
  const pages = runs.flatMap((run) => run.pages);
  return {
    completed: pages.filter((page) => page.snapshot).length,
    errors: pages.filter((page) => !page.snapshot).map((page) => ({ error: page.error, route: page.route })),
    medianDurationMs: median(pages.map((page) => page.durationMs)),
    pageAttempts: pages.length,
    runCount: runs.length,
    userAgents: [...new Set(pages.map((page) => page.userAgent).filter(Boolean))],
  };
}

function compactRunEvidence(runs) {
  return runs.map((run) => ({
    pages: run.pages.map((page) => ({
      durationMs: page.durationMs,
      error: page.error ?? null,
      pageErrors: page.errors,
      route: page.route,
      snapshot: page.snapshot
        ? {
            ...page.snapshot,
            internalLinkCount: page.snapshot.internalLinks.length,
            internalLinks: undefined,
            internalLinksHash: hashText(page.snapshot.internalLinks.join('\n')),
          }
        : null,
      userAgent: page.userAgent,
    })),
    run: run.run,
  }));
}

function buildParityReport(chromiumRuns, lightpandaRuns, routes) {
  const routeReports = [];
  for (const route of routes) {
    const comparisons = [];
    for (let runIndex = 0; runIndex < RUN_COUNT; runIndex += 1) {
      const chromiumPage = chromiumRuns[runIndex].pages.find((page) => page.route === route);
      const lightpandaPage = lightpandaRuns[runIndex].pages.find((page) => page.route === route);
      comparisons.push(
        chromiumPage?.snapshot && lightpandaPage?.snapshot
          ? compareSnapshots(chromiumPage.snapshot, lightpandaPage.snapshot)
          : {
              criticalMetadataMatch: false,
              exactMismatches: ['page-completion'],
              internalLinkJaccard: 0,
              internalLinksPass: false,
              mainContentPass: false,
              mainWordCountDifferenceRatio: 1,
            },
      );
    }
    routeReports.push({
      criticalMetadataPass: comparisons.every((item) => item.criticalMetadataMatch),
      internalLinksPass: comparisons.every((item) => item.internalLinksPass),
      mainContentPass: comparisons.every((item) => item.mainContentPass),
      minimumInternalLinkJaccard: Math.min(...comparisons.map((item) => item.internalLinkJaccard)),
      maximumMainWordDifferencePercent:
        Math.max(...comparisons.map((item) => item.mainWordCountDifferenceRatio)) * 100,
      mismatches: [...new Set(comparisons.flatMap((item) => item.exactMismatches))],
      route,
    });
  }
  return {
    criticalMetadataPass: routeReports.every((route) => route.criticalMetadataPass),
    internalLinksPass: routeReports.every((route) => route.internalLinksPass),
    mainContentPass: routeReports.every((route) => route.mainContentPass),
    routes: routeReports,
  };
}

function renderReport(report) {
  const statusLabel = report.status === 'adopted' ? 'ADOPTED' : report.status === 'not-adopted' ? 'NOT ADOPTED' : 'BLOCKED';
  const failures = report.acceptance
    ? Object.entries(report.acceptance).filter(([, value]) => value === false).map(([name]) => name)
    : [];
  return [
    '# Lightpanda 0.3.4 Isolated Pilot',
    '',
    `- Status: **${statusLabel}**`,
    `- Generated: ${report.timestamp}`,
    `- Image: \`${report.image}\``,
    `- Routes: ${report.sample?.routes?.length ?? 0}`,
    `- Runs per engine: ${report.config?.runCount ?? RUN_COUNT}`,
    `- Chromium median page duration: ${report.performance?.chromiumMedianDurationMs ?? 'not measured'} ms`,
    `- Lightpanda median page duration: ${report.performance?.lightpandaMedianDurationMs ?? 'not measured'} ms`,
    `- Speed ratio: ${report.performance?.speedRatio == null ? 'not measured' : `${report.performance.speedRatio}x`}`,
    `- Chromium peak memory: ${report.performance?.chromiumPeakMemoryMiB ?? 'not measured'} MiB`,
    `- Lightpanda peak memory: ${report.performance?.lightpandaPeakMemoryMiB ?? 'not measured'} MiB`,
    '',
    '## Acceptance',
    '',
    ...(report.acceptance
      ? Object.entries(report.acceptance).map(([name, pass]) => `- ${pass ? 'PASS' : 'FAIL'}: ${name}`)
      : ['- Pilot did not reach acceptance scoring.']),
    '',
    '## Decision',
    '',
    report.status === 'adopted'
      ? 'Lightpanda passed the isolated audit thresholds. It may remain available as an optional read-only DOM and SEO audit command. Chromium remains authoritative for visual, accessibility, Lighthouse, and promotion work.'
      : report.status === 'not-adopted'
        ? `Lightpanda remains unmerged and optional integration is not adopted. Failed thresholds: ${failures.join(', ') || 'see JSON evidence'}. Chromium remains unchanged.`
        : `The pilot was blocked before a decision. ${report.error ?? 'See JSON evidence.'}`,
    '',
    '## Evidence',
    '',
    '- Reports contain route paths, counts, hashes, timings, and error summaries only.',
    '- Page bodies, cookies, credentials, request headers, and secrets are not stored.',
    '- External requests were aborted by the Playwright request boundary.',
    '',
  ].join('\n');
}

function writeReport(report) {
  const safeReport = redactReport(report);
  const stamp = report.timestamp.replace(/[:.]/g, '-');
  const evidenceDir = join(OUTPUT_DIR, stamp);
  mkdirSync(evidenceDir, { recursive: true });
  const json = `${JSON.stringify(safeReport, null, 2)}\n`;
  const markdown = renderReport(safeReport);
  writeFileSync(join(evidenceDir, 'summary.json'), json);
  writeFileSync(join(evidenceDir, 'summary.md'), markdown);
  writeFileSync(join(OUTPUT_DIR, 'latest.json'), json);
  writeFileSync(join(OUTPUT_DIR, 'latest.md'), markdown);
  return { evidenceDir, markdown };
}

async function runPilot() {
  const cleanup = new CleanupStack();
  const report = {
    config: {
      concurrency: CONCURRENCY,
      hydrationWaitMs: HYDRATION_WAIT_MS,
      requestPolicy: 'selected local preview origin only',
      runCount: RUN_COUNT,
      userAgent: PILOT_USER_AGENT,
      viewport: PILOT_VIEWPORT,
    },
    image: LIGHTPANDA_IMAGE,
    status: 'blocked',
    timestamp: new Date().toISOString(),
    version: LIGHTPANDA_VERSION,
  };
  let interrupted = false;
  const onSignal = async () => {
    if (interrupted) return;
    interrupted = true;
    await cleanup.dispose();
    process.exit(130);
  };
  process.once('SIGINT', onSignal);
  process.once('SIGTERM', onSignal);

  try {
    report.setup = await runSetup();
    const sitemap = readBuiltSitemapUrls();
    report.sample = selectPilotRoutes(sitemap.urls);
    report.sample.publicDir = sitemap.publicDir.replace(`${ROOT_DIR}\\`, '').replaceAll('\\', '/');

    const previewPort = await findFreePort();
    const cdpPort = await findFreePort();
    const preview = await startPreview(previewPort, cleanup);
    const container = await startLightpandaContainer({ cdpPort, cleanup, previewPort });
    report.container = {
      dockerArgs: container.args,
      idPrefix: container.containerId.slice(0, 12),
      name: container.containerName,
    };

    const chromiumServer = await chromium.launchServer({
      args: ['--disable-background-networking', '--disable-component-update', '--no-first-run'],
      headless: true,
    });
    cleanup.add(async () => chromiumServer.close());
    const chromiumBrowser = await chromium.connect(chromiumServer.wsEndpoint());
    cleanup.add(async () => chromiumBrowser.close());

    const lightpandaEndpoint = await lightpandaWebSocketEndpoint(cdpPort);
    report.lightpandaCdp = {
      browser: lightpandaEndpoint.versionData.Browser ?? lightpandaEndpoint.versionData.browser ?? null,
      protocolVersion: lightpandaEndpoint.versionData['Protocol-Version'] ?? null,
    };
    const chromiumOrigin = `http://127.0.0.1:${previewPort}`;
    const lightpandaOrigin = `http://host.docker.internal:${previewPort}`;
    const chromiumRuns = [];
    const lightpandaRuns = [];

    for (let runIndex = 0; runIndex < RUN_COUNT; runIndex += 1) {
      console.log(`Chromium parity run ${runIndex + 1}/${RUN_COUNT}...`);
      chromiumRuns.push({
        pages: await runEnginePass({
          allowedOrigin: chromiumOrigin,
          browser: chromiumBrowser,
          engine: 'chromium',
          routes: report.sample.routes,
        }),
        run: runIndex + 1,
      });
      console.log(`Lightpanda parity run ${runIndex + 1}/${RUN_COUNT}...`);
      lightpandaRuns.push({
        pages: await runLightpandaPass({
          allowedOrigin: lightpandaOrigin,
          endpoint: lightpandaEndpoint.endpoint,
          routes: report.sample.routes,
        }),
        run: runIndex + 1,
      });
    }

    console.log('Lightpanda Markdown and accessibility-tree extraction pass...');
    const semanticPages = await runLightpandaPass({
      allowedOrigin: lightpandaOrigin,
      endpoint: lightpandaEndpoint.endpoint,
      routes: report.sample.routes,
      semantic: true,
    });
    report.semantic = {
      failedRoutes: semanticPages
        .filter((page) => !page.semantic?.markdown?.useful || !page.semantic?.accessibility?.useful)
        .map((page) => ({
          accessibility: page.semantic?.accessibility ?? null,
          error: page.error ?? null,
          markdown: page.semantic?.markdown ?? null,
          route: page.route,
        })),
      routes: semanticPages.map((page) => ({
        accessibility: page.semantic?.accessibility ?? null,
        error: page.error ?? null,
        markdown: page.semantic?.markdown ?? null,
        route: page.route,
      })),
    };

    console.log('Untimed Chromium memory pass...');
    const chromiumMemory = await measurePeakMemory(
      () => processTreeMemoryBytes(chromiumServer.process()?.pid),
      () =>
        runEnginePass({
          allowedOrigin: chromiumOrigin,
          browser: chromiumBrowser,
          engine: 'chromium',
          routes: report.sample.routes,
        }),
    );
    console.log('Untimed Lightpanda memory pass...');
    const lightpandaMemory = await measurePeakMemory(
      () => dockerMemoryBytes(container.containerId),
      () =>
        runLightpandaPass({
          allowedOrigin: lightpandaOrigin,
          endpoint: lightpandaEndpoint.endpoint,
          routes: report.sample.routes,
        }),
    );

    const chromiumSummary = summarizeRuns(chromiumRuns);
    const lightpandaSummary = summarizeRuns(lightpandaRuns);
    report.engines = {
      chromium: chromiumSummary,
      lightpanda: lightpandaSummary,
    };
    report.evidence = {
      chromiumRuns: compactRunEvidence(chromiumRuns),
      lightpandaRuns: compactRunEvidence(lightpandaRuns),
    };
    report.parity = buildParityReport(chromiumRuns, lightpandaRuns, report.sample.routes);

    const containerState = await runCommand(
      'docker',
      ['inspect', '--format', '{{.State.Running}}|{{.RestartCount}}', container.containerId],
      { allowFailure: true, timeoutMs: 15_000 },
    );
    const [runningValue, restartValue] = containerState.stdout.split('|');
    report.container.state = {
      restartCount: Number(restartValue ?? Number.NaN),
      running: runningValue === 'true',
    };
    report.container.logs = (
      await runCommand('docker', ['logs', '--tail', '100', container.containerId], {
        allowFailure: true,
        timeoutMs: 15_000,
      })
    ).stderr.slice(-10_000);
    report.preview = { logs: preview.getLogs().slice(-10_000), port: previewPort };

    const chromiumMedian = chromiumSummary.medianDurationMs;
    const lightpandaMedian = lightpandaSummary.medianDurationMs;
    const speedRatio =
      Number.isFinite(chromiumMedian) && Number.isFinite(lightpandaMedian) && lightpandaMedian > 0
        ? chromiumMedian / lightpandaMedian
        : null;
    const memoryRatio =
      Number.isFinite(chromiumMemory.peakBytes) &&
      Number.isFinite(lightpandaMemory.peakBytes) &&
      chromiumMemory.peakBytes > 0
        ? lightpandaMemory.peakBytes / chromiumMemory.peakBytes
        : null;
    report.performance = {
      chromiumMedianDurationMs: chromiumMedian,
      chromiumPeakMemoryMiB: Number.isFinite(chromiumMemory.peakBytes)
        ? Number((chromiumMemory.peakBytes / 1024 / 1024).toFixed(2))
        : null,
      chromiumPeakMemorySamples: chromiumMemory.samples,
      lightpandaMedianDurationMs: lightpandaMedian,
      lightpandaPeakMemoryMiB: Number.isFinite(lightpandaMemory.peakBytes)
        ? Number((lightpandaMemory.peakBytes / 1024 / 1024).toFixed(2))
        : null,
      lightpandaPeakMemorySamples: lightpandaMemory.samples,
      memoryRatio: Number.isFinite(memoryRatio) ? Number(memoryRatio.toFixed(3)) : null,
      speedRatio: Number.isFinite(speedRatio) ? Number(speedRatio.toFixed(3)) : null,
    };

    const expectedAttempts = RUN_COUNT * report.sample.routes.length;
    const sameUserAgent =
      chromiumSummary.userAgents.length === 1 &&
      lightpandaSummary.userAgents.length === 1 &&
      chromiumSummary.userAgents[0] === lightpandaSummary.userAgents[0] &&
      chromiumSummary.userAgents[0] === PILOT_USER_AGENT;
    report.acceptance = {
      allChromiumPagesComplete: chromiumSummary.completed === expectedAttempts,
      allLightpandaPagesComplete: lightpandaSummary.completed === expectedAttempts,
      containerStable:
        report.container.state.running === true && report.container.state.restartCount === 0,
      criticalMetadataParity: report.parity.criticalMetadataPass,
      identicalUserAgent: sameUserAgent,
      internalLinkParity: report.parity.internalLinksPass,
      mainContentParity: report.parity.mainContentPass,
      markdownAndAccessibilityExtraction: report.semantic.failedRoutes.length === 0,
      performanceAdvantage:
        (Number.isFinite(speedRatio) && speedRatio >= 2) ||
        (Number.isFinite(memoryRatio) && memoryRatio <= 0.5),
      threeRunsPerEngine:
        chromiumSummary.runCount === RUN_COUNT && lightpandaSummary.runCount === RUN_COUNT,
    };
    report.status = Object.values(report.acceptance).every(Boolean) ? 'adopted' : 'not-adopted';
  } catch (error) {
    report.error = error instanceof Error ? error.message : String(error);
    report.status = 'blocked';
  } finally {
    process.off('SIGINT', onSignal);
    process.off('SIGTERM', onSignal);
    report.cleanupErrors = await cleanup.dispose();
  }

  const written = writeReport(report);
  console.log(written.markdown);
  console.log(`Evidence: ${written.evidenceDir}`);
  if (report.status !== 'adopted') process.exitCode = 2;
  return report;
}

const mode = parseMode(process.argv.slice(2));
try {
  if (mode === 'preflight') await runPreflight();
  else if (mode === 'setup') await runSetup();
  else await runPilot();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
