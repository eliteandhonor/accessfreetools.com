import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { after, test } from 'node:test';

const repo = fileURLToPath(new URL('../../../', import.meta.url));
const roots = [];
const observed = '2026-09-05T00:00:00.000Z';
const now = '2026-09-06T00:00:00.000Z';
const origin = 'https://accessfreetools.com';
const output = join(repo, 'output/project-review-followup/EV-03-judge');
mkdirSync(output, { recursive: true });

function write(root, path, value) {
  const target = join(root, path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, typeof value === 'string' ? value : JSON.stringify(value));
}

function fixture(rows = []) {
  const root = mkdtempSync(join(tmpdir(), 'aft-indexing-judge-'));
  roots.push(root);
  write(root, 'output/search-console-url-inspection.json', { generatedAt: observed, inspections: rows });
  write(root, 'docs/brand-code.md', 'Synthetic fixture.');
  write(root, 'docs/recommended-agency-agents.md', 'Synthetic fixture.');
  return root;
}

after(() => {
  for (const root of roots) {
    assert.equal(dirname(resolve(root)), resolve(tmpdir()));
    assert.ok(basename(root).startsWith('aft-indexing-judge-'));
    const dependencies = join(root, 'node_modules');
    if (existsSync(dependencies)) unlinkSync(dependencies);
    rmSync(root, { recursive: true, force: true });
  }
});

function row(path, overrides = {}) {
  return { inspectionUrl: origin + path, verdict: 'NEUTRAL', coverageState: 'Crawled - currently not indexed', ...overrides };
}

function run(root, consumer) {
  const preload = `const NativeDate=Date;globalThis.Date=class extends NativeDate {constructor(...a){super(...(a.length?a:[${JSON.stringify(now)}]));}static now(){return NativeDate.parse(${JSON.stringify(now)});}};globalThis.fetch=()=>{throw Error('Judge fixture network forbidden');};`;
  const module = pathToFileURL(join(repo, 'scripts/lib/agent-tools-report.mjs')).href;
  const args = consumer === 'cli' ? [join(repo, 'scripts/aft-cli.mjs'), 'indexing-gaps', '--json']
    : consumer === 'marketing' ? [join(repo, 'scripts/marketing-orchestrator-report.mjs')]
      : ['--input-type=module', '-e', `import {${consumer === 'links' ? 'buildLinkHelperReport' : 'buildSeoConsoleReport'} as build} from ${JSON.stringify(module)};console.log(JSON.stringify(build()));`];
  const result = spawnSync(process.execPath, ['--import', `data:text/javascript,${encodeURIComponent(preload)}`, ...args], { cwd: root, encoding: 'utf8', timeout: 15000 });
  assert.equal(result.status, 0, result.stderr);
  return consumer === 'marketing' ? JSON.parse(readFileSync(join(root, 'output/marketing-orchestrator/daily-plan.json'), 'utf8')) : JSON.parse(result.stdout);
}

function gaps(result, consumer) {
  return consumer === 'cli' ? result.gaps : consumer === 'marketing' ? result.indexingGaps
    : consumer === 'links' ? result.sources.searchConsole.gaps : result.indexing.gaps;
}

test('all 27 existing agent-tools tests, unchanged, with nonempty synthetic inspections in a disposable source copy', () => {
  const root = fixture([row('/tools/percentage-calculator/'), row('/tools/wallpaper-calculator/')]);
  for (const path of ['src', 'scripts', 'docs', 'package.json', 'vitest.config.ts', 'AGENTS.md']) {
    cpSync(join(repo, path), join(root, path), { recursive: true });
  }
  symlinkSync(join(repo, 'node_modules'), join(root, 'node_modules'), 'junction');
  const sourceHash = createHash('sha256').update(readFileSync(join(root, 'scripts/lib/agent-tools-report.mjs'))).digest('hex');
  const testHash = createHash('sha256').update(readFileSync(join(root, 'scripts/lib/agent-tools-report.test.mjs'))).digest('hex');
  const preload = 'globalThis.fetch=()=>{throw Error("Judge fixture network forbidden");};';
  const result = spawnSync(process.execPath, ['--import', `data:text/javascript,${encodeURIComponent(preload)}`,
    join(repo, 'node_modules/vitest/vitest.mjs'), 'run', '--configLoader', 'runner', 'scripts/lib/agent-tools-report.test.mjs', '--reporter=verbose'],
  { cwd: root, encoding: 'utf8', timeout: 30000 });
  write(output, 'full-agent-tools.txt', `SOURCE_SHA256=${sourceHash}\nTEST_SHA256=${testHash}\n${result.stdout}\n${result.stderr}\nEXIT=${result.status}\n`);
  assert.equal(result.status, 0, `Full unchanged suite failed; see ${join(output, 'full-agent-tools.txt')}`);
});

test('PASS, every intentional noindex route, and explicit blocking evidence stay classified across all four consumers', () => {
  const excluded = ['/tools/text-to-speech-audiobook-generator/', '/blog/how-to-use-text-to-speech-audiobook-generator/',
    '/feed.xml', '/pinterest-feed.xml', '/support/', '/sitemap/'];
  const root = fixture([
    ...['PASS', 'pass', ' Pass '].map((verdict, index) => row(`/pass-${index}/`, { verdict, coverageState: index ? '' : 'Indexed, not submitted in sitemap' })),
    ...excluded.map((path) => row(path, { expiresAt: '2020-01-01' })),
    row('/tools/percentage-calculator/', { coverageState: 'Excluded', indexingState: 'BLOCKED_BY_HTTP_HEADER' }),
  ]);
  const results = {};
  for (const consumer of ['cli', 'links', 'console', 'marketing']) {
    const result = gaps(run(root, consumer), consumer);
    results[consumer] = result;
    assert.equal(result.length, 1, consumer);
    assert.equal(result[0].classification, 'failure', consumer);
    assert.equal(result[0].sourceGeneratedAt, observed, consumer);
  }
  write(output, 'four-consumer-controls.json', results);
});

test('a known meta/header indexing block does not disappear when coverage wording is omitted', () => {
  const root = fixture([row('/tools/percentage-calculator/', { coverageState: '', indexingState: 'BLOCKED_BY_META_TAG' })]);
  const results = {};
  for (const consumer of ['cli', 'links', 'console', 'marketing']) results[consumer] = gaps(run(root, consumer), consumer);
  write(output, 'missing-coverage-block.json', results);
  assert.deepEqual(Object.fromEntries(Object.entries(results).map(([consumer, rows]) => [consumer, rows[0]?.classification])),
    { cli: 'failure', links: 'failure', console: 'failure', marketing: 'failure' });
});

test('relative saved marketing tasks cannot revive intentional noindex or a current PASS', () => {
  const root = fixture([row('/tools/kawaii-emoji-generator/', { verdict: 'PASS', coverageState: 'Submitted and indexed' }), row('/real-gap/')]);
  write(root, 'output/marketing-orchestrator/daily-plan.json', { recommendations: [
    { title: 'Request indexing for /tools/text-to-speech-audiobook-generator/', priority: 'High' },
    { title: 'Request indexing for /tools/kawaii-emoji-generator/', priority: 'High' },
  ] });
  const report = run(root, 'console');
  const tasks = report.actions.filter((item) => item.evidence === 'output/marketing-orchestrator/daily-plan.json');
  write(output, 'relative-marketing-actions.json', { indexing: report.indexing, tasks });
  assert.deepEqual(tasks, []);
});

test('older performance indexing-recovery rows cannot override a newer exact PASS', () => {
  const root = fixture([row('/tools/kawaii-emoji-generator/', { verdict: 'PASS', coverageState: 'Indexed, not submitted in sitemap' })]);
  write(root, 'output/search-console/performance-latest.json', { generatedAt: '2026-07-01T00:00:00.000Z',
    tierARecovery: [{ path: '/tools/kawaii-emoji-generator/', action: 'Recover indexing', evidenceFound: true, rationale: 'Historical recovery sample' }] });
  const cli = run(root, 'cli');
  const consoleReport = run(root, 'console');
  const evidence = { cliGaps: cli.gaps, cliRecovery: cli.performanceExport.tierARecovery,
    consoleGaps: consoleReport.indexing.gaps, consoleRecovery: consoleReport.actions.filter((item) => item.evidence === 'output/search-console/performance-latest.json') };
  write(output, 'older-performance-pass.json', evidence);
  assert.deepEqual({ cli: evidence.cliRecovery, console: evidence.consoleRecovery }, { cli: [], console: [] });
});
