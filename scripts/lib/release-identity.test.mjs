import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  captureReleaseSource, createBuildIdentity, createCheckReceipt,
  verifyReleaseReceipt, verifyDeployedIdentity, fetchDeployedIdentity,
  readReleaseReceipt, verifyRemoteReleaseSource,
} from './release-identity.mjs';

const SHA = 'a'.repeat(40);
const OTHER = 'b'.repeat(40);
const clean = { commit: SHA, clean: true };
const start = '2026-09-06T10:00:00.000Z';
const finish = '2026-09-06T10:01:00.000Z';
const dirs = [];
function temp() { const dir = mkdtempSync(join(tmpdir(), 'aft-release-')); dirs.push(dir); return dir; }
function receipt(overrides = {}) {
  return { ...createCheckReceipt(clean, clean, { exitCode: 0, startedAt: start, completedAt: finish, nodeVersion: '24.20.0', buildIdentity: identity() }), ...overrides };
}
function identity(overrides = {}) {
  return { ...createBuildIdentity(clean, clean, { builtAt: finish, nodeVersion: '24.20.0' }), ...overrides };
}
afterEach(() => { for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true }); });

describe('release source capture', () => {
  it('reads actual Git HEAD and detects tracked, staged, and untracked edits without recording filenames', () => {
    const cwd = temp();
    const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    git('init', '--quiet');
    git('config', 'user.name', 'Release fixture');
    git('config', 'user.email', 'fixture@example.invalid');
    writeFileSync(join(cwd, 'source.txt'), 'one');
    git('add', '.'); git('-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', 'fixture');
    expect(captureReleaseSource(cwd)).toEqual({ commit: git('rev-parse', 'HEAD').trim(), clean: true });
    writeFileSync(join(cwd, 'source.txt'), 'two');
    expect(captureReleaseSource(cwd).clean).toBe(false);
    git('add', '.');
    expect(captureReleaseSource(cwd).clean).toBe(false);
    git('-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', 'fixture two');
    writeFileSync(join(cwd, 'private-title.txt'), 'never report this text');
    expect(captureReleaseSource(cwd).clean).toBe(false);
    expect(JSON.stringify(captureReleaseSource(cwd))).not.toMatch(/private-title|never report/);
  });
  it('does not substitute an environment SHA for missing Git evidence', () => {
    expect(captureReleaseSource(temp())).toEqual({ commit: null, clean: false });
  });
});

describe('build and full-check identity', () => {
  it('exposes only non-sensitive source and runtime identity', () => {
    expect(identity()).toEqual({ schemaVersion: 1, commit: SHA, clean: true, builtAt: finish, nodeMajor: 24 });
  });
  it.each([
    [{ commit: OTHER, clean: true }, clean],
    [clean, { commit: SHA, clean: false }],
    [{ commit: SHA, clean: false }, clean],
    [{ commit: null, clean: false }, { commit: null, clean: false }],
  ])('does not label changed or unknown build source clean', (before, after) => {
    expect(createBuildIdentity(before, after, { builtAt: finish, nodeVersion: '24.20.0' }).clean).toBe(false);
  });
  it('records successful full checks for unchanged clean Node 24 source', () => {
    expect(verifyReleaseReceipt(receipt(), clean).ok).toBe(true);
  });
  it.each([
    { verified: false }, { exitCode: 1 }, { exitCode: null }, { commit: OTHER },
    { clean: false }, { nodeMajor: 22 }, { schemaVersion: 0 },
    { command: 'npm test' }, { completedAt: null }, { completedAt: 'not-a-date' }, { build: null },
    { build: identity({ clean: false }) }, { build: identity({ commit: OTHER }) },
    { build: identity({ builtAt: '2026-09-06T09:59:00.000Z' }) },
    { build: identity({ builtAt: '2026-09-06T10:02:00.000Z' }) },
    { completedAt: '2026-09-06T09:59:00.000Z' },
  ])('rejects incomplete or stale receipts: %j', (overrides) => {
    expect(verifyReleaseReceipt(receipt(overrides), clean).ok).toBe(false);
  });
  it('rejects dirty source even when its commit matches a past receipt', () => {
    expect(verifyReleaseReceipt(receipt(), { ...clean, clean: false }).ok).toBe(false);
  });
  it('keeps failed or source-changing checks unverified', () => {
    for (const after of [{ commit: OTHER, clean: true }, { ...clean, clean: false }]) {
      expect(createCheckReceipt(clean, after, { exitCode: 0, startedAt: start, completedAt: finish, nodeVersion: '24.20.0' }).verified).toBe(false);
    }
    expect(receipt({ exitCode: 1 }).exitCode).toBe(1);
    expect(createCheckReceipt(clean, clean, { exitCode: null, startedAt: start, completedAt: finish, nodeVersion: '24.20.0' }).verified).toBe(false);
  });
  it('reads missing and malformed receipts as missing evidence', () => {
    const file = join(temp(), 'check.json');
    expect(readReleaseReceipt(file)).toBeNull();
    writeFileSync(file, 'broken');
    expect(readReleaseReceipt(file)).toBeNull();
    writeFileSync(file, JSON.stringify(receipt()));
    expect(readReleaseReceipt(file)).toEqual(receipt());
  });
});

describe('deployed release verification', () => {
  it('the real deployment command stops before looking up accounts when full-check evidence is missing', () => {
    const script = fileURLToPath(new URL('../hostinger-node-deploy.mjs', import.meta.url));
    try {
      execFileSync(process.execPath, [script], { cwd: temp(), timeout: 5000, encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, HOSTINGER_API_TOKEN: '', HOSTINGER_NODE_VERSION: '24' } });
      throw new Error('Unexpected deployment success');
    } catch (error) {
      expect(error.status).toBe(1);
      expect(String(error.stderr)).toContain('Deployment stopped before writing');
      expect(String(error.stderr)).not.toContain('Hostinger API token');
    }
  });
  it('requires exact source parity as well as a verified test receipt', () => {
    expect(verifyDeployedIdentity(identity(), receipt(), clean).ok).toBe(true);
    expect(verifyDeployedIdentity(identity({ commit: OTHER }), receipt(), clean).ok).toBe(false);
    expect(verifyDeployedIdentity(identity(), null, clean).ok).toBe(false);
  });
  it.each([{ clean: false }, { nodeMajor: 22 }, { builtAt: null }, { schemaVersion: 2 }, { commit: 'short' }])('fails closed for invalid live identity %j', (overrides) => {
    expect(verifyDeployedIdentity(identity(overrides), receipt(), clean).ok).toBe(false);
  });
  it('fetches a cache-busted identity without credentials or redirects', async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify(identity()), { headers: { 'content-type': 'application/json' } }));
    expect(await fetchDeployedIdentity('accessfreetools.com', { fetcher })).toEqual(identity());
    const [url, options] = fetcher.mock.calls[0];
    expect(url.origin).toBe('https://accessfreetools.com');
    expect(url.pathname).toBe('/_build.json');
    expect(url.searchParams.has('proof')).toBe(true);
    expect(options).toMatchObject({ redirect: 'error', credentials: 'omit', cache: 'no-store' });
  });
  it.each(['user:secret@host.test', 'host.test/path', 'host.test?x=1', 'http://host.test'])('rejects malformed domains before network: %s', async (domain) => {
    const fetcher = vi.fn();
    await expect(fetchDeployedIdentity(domain, { fetcher })).rejects.toThrow();
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('rejects HTML, failed HTTP, oversized responses, and invalid JSON without storing their bodies', async () => {
    for (const response of [
      new Response('private error page', { status: 404 }),
      new Response('private error page', { headers: { 'content-type': 'text/html' } }),
      new Response('x'.repeat(9000), { headers: { 'content-type': 'application/json' } }),
      new Response('private error page', { headers: { 'content-type': 'application/json' } }),
    ]) {
      await expect(fetchDeployedIdentity('accessfreetools.com', { fetcher: async () => response })).rejects.toThrow(/build identity/);
    }
  });
  it('does not accept a build from an unpushed or stale main commit', () => {
    expect(verifyRemoteReleaseSource(SHA, `${SHA}\trefs/heads/main\n`).ok).toBe(true);
    expect(verifyRemoteReleaseSource(SHA, `${OTHER}\trefs/heads/main\n`).ok).toBe(false);
    expect(verifyRemoteReleaseSource(SHA, '').ok).toBe(false);
    expect(verifyRemoteReleaseSource(SHA, `${SHA}\trefs/heads/another\n`).ok).toBe(false);
    expect(verifyRemoteReleaseSource(null, `${SHA}\trefs/heads/main\n`).ok).toBe(false);
  });
});
