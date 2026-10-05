import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { createBuildIdentity, createCheckReceipt, verifyReleaseReceipt } from './release-identity.mjs';

const repo = fileURLToPath(new URL('../../', import.meta.url));
const roots = [];
const start = '2026-09-06T10:00:00.000Z';
const finish = '2026-09-06T10:01:00.000Z';
const productionFiles = [
  'scripts/lib/release-identity.mjs', 'scripts/lib/build-source-diagnostics.mjs', 'scripts/build-site.mjs', 'scripts/run-verified-check.mjs',
  'scripts/mirror-static-output.mjs', 'scripts/hostinger-status.mjs', 'scripts/hostinger-node-deploy.mjs',
  'scripts/lib/hostinger-build-status.mjs', 'scripts/lib/hostinger-deploy-config.mjs',
  'scripts/lib/hostinger-server.mjs', 'scripts/lib/hostinger-request-redirects.mjs',
];

function write(root, path, value) {
  const target = join(root, path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, typeof value === 'string' ? value : JSON.stringify(value));
}

function env(root, overrides = {}) {
  const inherited = Object.fromEntries(Object.entries(process.env).filter(([key]) =>
    /^(path|systemroot|windir|comspec|pathext|temp|tmp)$/i.test(key)));
  return { ...inherited, HOME: root, USERPROFILE: root, APPDATA: root, LOCALAPPDATA: root,
    GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: join(root, '.git', 'judge-empty-config'),
    GIT_TERMINAL_PROMPT: '0', ...overrides };
}

function run(root, executable, args, overrides = {}) {
  const result = spawnSync(executable, args, { cwd: root, env: env(root, overrides),
    encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 15000, windowsHide: true });
  if (result.error) throw result.error;
  return result;
}

function git(root, ...args) {
  const result = run(root, 'git', args);
  expect(result.status, result.stderr).toBe(0);
  return result.stdout.trim();
}

function commit(root) {
  git(root, 'add', '.');
  git(root, '-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=.git/no-hooks', 'commit', '--quiet', '-m', 'judge fixture');
  return git(root, 'rev-parse', 'HEAD');
}

// Only the external Astro/npm/Hostinger boundaries are fixtures. The wrappers,
// mirror, source capture and proof validators are byte-for-byte production copies.
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'aft-release-judge-'));
  roots.push(root);
  for (const path of productionFiles) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    copyFileSync(join(repo, path), join(root, path));
  }
  write(root, '.gitignore', 'dist/\noutput/\nnode_modules/\n.fixture/\n');
  write(root, 'package.json', { type: 'module' });
  write(root, 'source.txt', 'committed-source');
  write(root, 'node_modules/astro/package.json', { name: 'astro', type: 'module', bin: { astro: './bin.mjs' } });
  write(root, 'node_modules/astro/bin.mjs', `
    import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
    if (process.argv[2] !== 'build') throw new Error('Unexpected fixture command');
    if (process.env.JUDGE_ASTRO === 'fail') process.exit(2);
    mkdirSync('dist', { recursive: true });
    if (process.env.JUDGE_ASTRO !== 'no-client') {
      mkdirSync('dist/client', { recursive: true });
      writeFileSync('dist/client/artifact.txt', readFileSync('source.txt'));
    }
  `);
  write(root, '.fixture/npm.mjs', `
    import { spawnSync } from 'node:child_process';
    import { readFileSync, writeFileSync } from 'node:fs';
    if (process.argv.slice(2).join(' ') !== 'run check:steps') throw new Error('Unexpected check command');
    if (process.env.JUDGE_CHECK === 'fail') process.exit(2);
    if (process.env.JUDGE_CHECK === 'no-build') process.exit(0);
    const original = readFileSync('source.txt');
    if (process.env.JUDGE_CHECK === 'transient-dirty') writeFileSync('source.txt', 'uncommitted-source');
    const result = spawnSync(process.execPath, ['scripts/build-site.mjs'], { stdio: 'inherit', windowsHide: true });
    if (process.env.JUDGE_CHECK === 'transient-dirty') writeFileSync('source.txt', original);
    process.exit(result.status ?? 1);
  `);
  write(root, 'scripts/lib/hostinger-api.mjs', `
    import { appendFileSync, mkdirSync } from 'node:fs';
    export class HostingerApiError extends Error {}
    export const readHostingerLocalEnv = () => ({});
    export const summarizeCollection = (response) => response.data;
    function record(method) {
      mkdirSync('output', { recursive: true });
      appendFileSync('output/fixture-api.log', method + '\\n');
    }
    export const listHostingerWebsites = async () => {
      record('websites');
      return { data: [{ domain: 'release.example.invalid', username: 'fixture' }] };
    };
    export const listHostingerOrders = async () => ({ data: [] });
    export const listHostingerDomains = async () => ({ data: [] });
    const build = () => ({ uuid: 'fixture-build', state: 'completed',
      options: { node_version: 24, entry_file: 'app.js', output_directory: 'dist', source_type: 'git' } });
    export const listHostingerNodeBuilds = async () => {
      if (process.env.JUDGE_RUNTIME === 'timeout') throw new Error('Synthetic Hostinger timeout');
      return { data: [build()] };
    };
    export const hostingerRequest = async (_endpoint, options = {}) => {
      record(options.method || 'GET');
      return { data: options.method === 'POST' ? build() : [build()] };
    };
  `);
  write(root, '.fixture/network.mjs', `
    import { readFileSync, writeFileSync } from 'node:fs';
    import http from 'node:http';
    import https from 'node:https';
    import net from 'node:net';
    const forbidden = () => { throw new Error('Real network forbidden in release judge fixtures'); };
    http.request = http.get = https.request = https.get = net.connect = net.createConnection = forbidden;
    globalThis.fetch = async (url) => {
      if (url.hostname !== 'release.example.invalid' || url.pathname !== '/_build.json') return forbidden();
      if (process.env.JUDGE_IDENTITY === 'timeout') throw new Error('Synthetic identity timeout');
      if (process.env.JUDGE_IDENTITY === 'missing') return new Response('missing', { status: 404 });
      if (process.env.JUDGE_IDENTITY === 'dirty-during-fetch') writeFileSync('source.txt', 'changed during fetch');
      return new Response(readFileSync('output/fixture-identity.json'), { headers: { 'content-type': 'application/json' } });
    };
  `);
  git(root, 'init', '--quiet', '--initial-branch=main');
  git(root, 'config', 'user.name', 'Release judge fixture');
  git(root, 'config', 'user.email', 'fixture@example.invalid');
  commit(root);
  git(root, 'remote', 'add', 'origin', root);
  return root;
}

function json(root, path) { return JSON.parse(readFileSync(join(root, path), 'utf8')); }
function source(root) {
  const result = run(root, process.execPath, ['--input-type=module', '-e',
    "import {captureReleaseSource} from './scripts/lib/release-identity.mjs'; console.log(JSON.stringify(captureReleaseSource()));"]);
  expect(result.status, result.stderr).toBe(0);
  return JSON.parse(result.stdout);
}

function seedProof(root) {
  const clean = source(root);
  expect(clean.clean).toBe(true);
  const identity = createBuildIdentity(clean, clean, { builtAt: finish, nodeVersion: '24.20.0' });
  const receipt = createCheckReceipt(clean, clean, { exitCode: 0, startedAt: start, completedAt: finish, nodeVersion: '24.20.0', buildIdentity: identity });
  write(root, 'output/release/full-check.json', receipt);
  write(root, 'output/fixture-identity.json', identity);
  return { clean, receipt, identity };
}

function check(root, overrides = {}) {
  return run(root, process.execPath, ['scripts/run-verified-check.mjs'], {
    npm_execpath: join(root, '.fixture/npm.mjs'), ...overrides,
  });
}

function hostinger(root, script, overrides = {}) {
  return run(root, process.execPath, ['--import', './.fixture/network.mjs', `scripts/${script}.mjs`], {
    HOSTINGER_DOMAIN: 'release.example.invalid', HOSTINGER_DEPLOY_SETTLE_MS: '0',
    HOSTINGER_DEPLOY_POLL_MS: '0', HOSTINGER_DEPLOY_MAX_POLLS: '1', ...overrides,
  });
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    const target = resolve(root);
    if (!target.startsWith(resolve(tmpdir()) + sep + 'aft-release-judge-')) throw new Error('Unsafe fixture cleanup target');
    rmSync(target, { recursive: true, force: true, maxRetries: 3 });
    expect(existsSync(target)).toBe(false);
  }
});

describe('OP-01 judge: real Git source binding', () => {
  it.each(['--assume-unchanged', '--skip-worktree'])('rejects modified tracked source hidden by %s', (flag) => {
    const root = fixture();
    git(root, 'update-index', flag, 'source.txt');
    write(root, 'source.txt', 'not the committed contents');
    expect(git(root, 'show', 'HEAD:source.txt')).toBe('committed-source');
    expect(source(root).clean).toBe(false);
  });

  it('does not certify the cwd using a different GIT_DIR/GIT_WORK_TREE', () => {
    const root = fixture();
    const other = fixture();
    write(root, 'source.txt', 'dirty build source');
    const result = run(root, process.execPath, ['--input-type=module', '-e',
      "import {captureReleaseSource} from './scripts/lib/release-identity.mjs'; console.log(JSON.stringify(captureReleaseSource()));"],
    { GIT_DIR: join(other, '.git'), GIT_WORK_TREE: other });
    expect(result.status, result.stderr).toBe(0);
    expect(JSON.parse(result.stdout).clean).toBe(false);
  });
});

describe('OP-01 judge: real build and check wrappers', () => {
  it('writes matching mirrored build identity and a clean receipt on the positive fixture path', () => {
    const root = fixture();
    const result = check(root);
    expect(result.status, result.stderr).toBe(0);
    const identity = json(root, 'dist/_build.json');
    expect(identity).toEqual(json(root, 'dist/client/_build.json'));
    expect(identity).toMatchObject({ clean: true, commit: source(root).commit, nodeMajor: 24 });
    const diagnostic = json(root, 'dist/server/.build-evidence/source-status.json');
    expect(diagnostic.identity).toEqual(identity);
    expect(diagnostic.before).toMatchObject({ commit: identity.commit, clean: true, reason: 'clean' });
    expect(diagnostic.after).toMatchObject({ commit: identity.commit, clean: true, reason: 'clean' });
    expect(existsSync(join(root, 'dist/client/server/.build-evidence/source-status.json'))).toBe(false);
    expect(existsSync(join(root, 'dist/client/.build-evidence/source-status.json'))).toBe(false);
    expect(existsSync(join(root, 'dist/.build-evidence/source-status.json'))).toBe(false);
    expect(verifyReleaseReceipt(json(root, 'output/release/full-check.json'), source(root)).ok).toBe(true);
  });

  it('does not verify a dirty build merely because source is restored before the check finishes', () => {
    const root = fixture();
    const result = check(root, { JUDGE_CHECK: 'transient-dirty' });
    const built = json(root, 'dist/client/_build.json');
    expect(built.clean).toBe(false);
    expect(readFileSync(join(root, 'dist/client/artifact.txt'), 'utf8')).toBe('uncommitted-source');
    expect(source(root).clean).toBe(true);
    const diagnostic = json(root, 'dist/server/.build-evidence/source-status.json');
    expect(diagnostic.identity).toEqual(built);
    expect(diagnostic.before).toMatchObject({ clean: false, reason: 'tracked_changes', unstagedCount: 1 });
    expect(diagnostic.after).toMatchObject({ clean: false, reason: 'tracked_changes', unstagedCount: 1 });
    expect(json(root, 'output/release/full-check.json').verified, result.stdout).toBe(false);
  });

  it.each(['missing', 'mismatched'])('does not issue a verified receipt for a %s build identity', (state) => {
    const root = fixture();
    if (state === 'mismatched') {
      const { identity } = seedProof(root);
      for (const path of ['dist/_build.json', 'dist/client/_build.json']) {
        write(root, path, { ...identity, commit: 'b'.repeat(40) });
      }
    }
    const result = check(root, { JUDGE_CHECK: 'no-build' });
    if (state === 'missing') expect(existsSync(join(root, 'dist/_build.json'))).toBe(false);
    else expect(json(root, 'dist/_build.json').commit).not.toBe(source(root).commit);
    expect(json(root, 'output/release/full-check.json').verified, result.stdout).toBe(false);
  });

  it('does not return build success through the mirror early exit when dist/client is absent', () => {
    const root = fixture();
    const result = run(root, process.execPath, ['scripts/build-site.mjs'], { JUDGE_ASTRO: 'no-client' });
    expect(existsSync(join(root, 'dist/_build.json'))).toBe(false);
    expect(result.status, result.stdout).not.toBe(0);
  });

  it('invalidates a previous successful receipt when a later child check fails', () => {
    const root = fixture();
    seedProof(root);
    const result = check(root, { JUDGE_CHECK: 'fail' });
    expect(result.status).toBe(1);
    expect(json(root, 'output/release/full-check.json')).toMatchObject({ verified: false, exitCode: 2 });
  });

  it('invalidates a previous receipt before rejecting an invocation without npm_execpath', () => {
    const root = fixture();
    seedProof(root);
    const result = run(root, process.execPath, ['scripts/run-verified-check.mjs']);
    expect(result.status).toBe(1);
    expect(json(root, 'output/release/full-check.json')).toMatchObject({ verified: false, exitCode: null });
  });

  it('keeps a build failure nonzero and does not create a new identity', () => {
    const root = fixture();
    write(root, 'dist/server/.build-evidence/source-status.json', { stale: true });
    const result = run(root, process.execPath, ['scripts/build-site.mjs'], { JUDGE_ASTRO: 'fail' });
    expect(result.status).toBe(2);
    expect(existsSync(join(root, 'dist/_build.json'))).toBe(false);
    expect(existsSync(join(root, 'dist/server/.build-evidence/source-status.json'))).toBe(false);
  });
});

describe('OP-01 judge: real Hostinger wrappers with no network or credentials', () => {
  it('accepts complete matching synthetic status evidence', () => {
    const root = fixture();
    seedProof(root);
    const result = hostinger(root, 'hostinger-status');
    expect(result.status, result.stderr).toBe(0);
    expect(json(root, 'output/hostinger/status.json').status).toBe('ok');
  });

  it.each(['missing', 'timeout'])('does not claim deployed proof when live identity is %s', (state) => {
    const root = fixture();
    seedProof(root);
    const result = hostinger(root, 'hostinger-status', { JUDGE_IDENTITY: state });
    expect(result.status, result.stderr).toBe(1);
    expect(json(root, 'output/hostinger/status.json')).toMatchObject({ status: 'attention', checks: { deployedSource: { ok: false } } });
  });

  it('does not claim overall status is ok when Hostinger runtime lookup times out', () => {
    const root = fixture();
    seedProof(root);
    const result = hostinger(root, 'hostinger-status', { JUDGE_RUNTIME: 'timeout' });
    expect(result.status).toBe(1);
    expect(json(root, 'output/hostinger/status.json')).toMatchObject({ status: 'attention', checks: { nodeRuntime: { ok: false } } });
  });

  it('rejects a mismatched live SHA despite a healthy account and runtime', () => {
    const root = fixture();
    const { identity } = seedProof(root);
    write(root, 'output/fixture-identity.json', { ...identity, commit: 'b'.repeat(40) });
    const result = hostinger(root, 'hostinger-status');
    expect(result.status).toBe(1);
    expect(json(root, 'output/hostinger/status.json')).toMatchObject({ status: 'attention', checks: { deployedSource: { ok: false } } });
  });

  it('rechecks local source after the asynchronous identity fetch before reporting current tested parity', () => {
    const root = fixture();
    seedProof(root);
    const result = hostinger(root, 'hostinger-status', { JUDGE_IDENTITY: 'dirty-during-fetch' });
    expect(source(root).clean).toBe(false);
    expect(json(root, 'output/hostinger/status.json').status, result.stdout).toBe('attention');
  });

  it('does not report overall ok when the second post-fetch source check fails', () => {
    const root = fixture();
    seedProof(root);
    // Schedule a concurrent edit immediately after the first real Git snapshot.
    const preload = readFileSync(join(root, '.fixture/network.mjs'), 'utf8');
    write(root, '.fixture/network.mjs', preload + `
      import childProcess from 'node:child_process';
      import { syncBuiltinESMExports } from 'node:module';
      const realExec = childProcess.execFileSync;
      let scans = 0;
      childProcess.execFileSync = (command, args, options) => {
        const result = realExec(command, args, options);
        if (command === 'git' && args[0] === 'ls-files' && ++scans === 1) {
          writeFileSync('source.txt', 'changed between final source checks');
        }
        return result;
      };
      syncBuiltinESMExports();
    `);
    const result = hostinger(root, 'hostinger-status');
    const report = json(root, 'output/hostinger/status.json');
    expect(report.checks.testedSource.ok).toBe(false);
    expect(report.status, result.stdout).toBe('attention');
  });

  it('stops the deployment wrapper before account lookup for dirty source', () => {
    const root = fixture();
    seedProof(root);
    write(root, 'source.txt', 'dirty');
    const result = hostinger(root, 'hostinger-node-deploy');
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Deployment stopped before writing');
    expect(existsSync(join(root, 'output/fixture-api.log'))).toBe(false);
  });

  it('stops the deployment wrapper before account lookup when origin main differs from tested source', () => {
    const root = fixture();
    const other = fixture();
    write(other, 'source.txt', 'different remote source');
    commit(other);
    seedProof(root);
    git(root, 'remote', 'set-url', 'origin', other);
    const result = hostinger(root, 'hostinger-node-deploy');
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('origin main does not match tested source');
    expect(existsSync(join(root, 'output/fixture-api.log'))).toBe(false);
  });

  it('keeps the synthetic deployment request pending when the live identity cannot be fetched', () => {
    const root = fixture();
    seedProof(root);
    const result = hostinger(root, 'hostinger-node-deploy', { JUDGE_IDENTITY: 'timeout' });
    expect(result.status, result.stdout).toBe(1);
    expect(json(root, 'output/hostinger/node-deploy-request.json').status).toBe('pending-verification');
    expect(readFileSync(join(root, 'output/fixture-api.log'), 'utf8').match(/^POST$/gm)).toHaveLength(1);
  });
});
