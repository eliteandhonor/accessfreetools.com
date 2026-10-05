import { mkdtempSync, mkdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { execFileSync } from 'node:child_process';
import {
  captureReleaseSource, captureReleaseSourceSnapshot, createBuildIdentity,
  createCheckReceipt, verifyDeployedIdentity,
} from './release-identity.mjs';

vi.mock('node:child_process', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, execFileSync: vi.fn(actual.execFileSync) };
});

const { execFileSync: actualExecFileSync } = await vi.importActual('node:child_process');
const fixtureDirectory = resolve(tmpdir());
const roots = [];
const nullCounts = {
  stagedCount: null, unstagedCount: null, untrackedCount: null,
  assumeUnchangedCount: null, skipWorktreeCount: null,
};
const zeroCounts = Object.fromEntries(Object.keys(nullCounts).map((key) => [key, 0]));
const snapshotKeys = ['observedAt', 'complete', 'stage', 'reason', ...Object.keys(nullCounts)].sort();
const secret = 'SYNTHETIC_COOKIE_VALUE_NOT_A_REAL_CREDENTIAL';
const privateName = 'private credentials fixture.txt';

function git(root, ...args) {
  return actualExecFileSync('git', args, {
    cwd: root, encoding: 'utf8', windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function fixture() {
  const root = mkdtempSync(join(fixtureDirectory, 'aft-source-diagnostics-'));
  roots.push(root);
  vi.stubEnv('GIT_CONFIG_GLOBAL', join(root, '.git', 'missing-fixture-global-config'));
  git(root, 'init', '--quiet');
  git(root, 'config', 'user.name', 'Source diagnostics fixture');
  git(root, 'config', 'user.email', 'fixture@example.invalid');
  git(root, 'config', 'core.hooksPath', '.git/no-hooks');
  writeFileSync(join(root, 'source.txt'), 'initial');
  writeFileSync(join(root, 'other.txt'), 'initial');
  writeFileSync(join(root, '.gitignore'), 'dist/\n');
  git(root, 'add', '.');
  git(root, '-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', 'fixture');
  return root;
}

function privateProjection(snapshot, root, extra = []) {
  const serialized = JSON.stringify(snapshot);
  for (const value of [root, root.replaceAll('\\', '/'), privateName, secret, ...extra]) {
    expect(serialized).not.toContain(value);
  }
  expect(Object.keys(snapshot).sort()).toEqual(['diagnostics', 'source']);
  expect(Object.keys(snapshot.source).sort()).toEqual(['clean', 'commit']);
  expect(Object.keys(snapshot.diagnostics).sort()).toEqual(snapshotKeys);
  expect(snapshot.diagnostics.observedAt).toMatch(/^\d{4}-\d{2}-\d{2}T.*Z$/);
  expect(Number.isFinite(Date.parse(snapshot.diagnostics.observedAt))).toBe(true);
}

beforeEach(() => {
  // Synthetic repositories must not inherit owner Git redirects or configuration.
  for (const key of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR']) vi.stubEnv(key, undefined);
  vi.stubEnv('GIT_CONFIG_NOSYSTEM', '1');
  vi.stubEnv('GIT_CONFIG_GLOBAL', join(fixtureDirectory, 'aft-missing-fixture-global-config'));
  execFileSync.mockReset();
  execFileSync.mockImplementation(actualExecFileSync);
});

afterEach(() => {
  execFileSync.mockReset();
  execFileSync.mockImplementation(actualExecFileSync);
  vi.unstubAllEnvs();
  for (const root of roots.splice(0)) {
    // Verify every recursive cleanup still addresses this test's own temporary directory.
    expect(dirname(resolve(root))).toBe(fixtureDirectory);
    expect(root.startsWith(join(fixtureDirectory, 'aft-source-diagnostics-'))).toBe(true);
    rmSync(root, { recursive: true, force: true });
  }
});

describe('private release source snapshots', () => {
  it('keeps the public projection and ignored build artifacts clean without a second Git observation', () => {
    const root = fixture();
    mkdirSync(join(root, 'dist'));
    writeFileSync(join(root, 'dist', 'ignored.json'), secret);
    const snapshot = captureReleaseSourceSnapshot(root);
    expect(snapshot.source).toEqual({ commit: git(root, 'rev-parse', 'HEAD'), clean: true });
    expect(snapshot.diagnostics).toMatchObject({ complete: true, stage: 'complete', reason: 'clean', ...zeroCounts });
    expect(execFileSync).toHaveBeenCalledTimes(4);
    expect(captureReleaseSource(root)).toEqual(snapshot.source);
    privateProjection(snapshot, root);
  });

  it('counts overlapping staged/unstaged changes and a quoted rename without retaining filenames or content', () => {
    const root = fixture();
    const renamed = 'source renamed naïve.txt';
    renameSync(join(root, 'source.txt'), join(root, renamed));
    git(root, 'add', '-A');
    writeFileSync(join(root, renamed), 'changed after staging');
    writeFileSync(join(root, privateName), secret);
    const snapshot = captureReleaseSourceSnapshot(root);
    expect(snapshot.source.clean).toBe(false);
    expect(snapshot.diagnostics).toMatchObject({
      complete: true, stage: 'complete', reason: 'tracked_changes',
      ...zeroCounts, stagedCount: 1, unstagedCount: 1, untrackedCount: 1,
    });
    privateProjection(snapshot, root, [renamed, 'changed after staging']);
  });

  it('identifies an untracked porcelain record without recording its private name', () => {
    const root = fixture();
    writeFileSync(join(root, privateName), secret);
    const snapshot = captureReleaseSourceSnapshot(root);
    expect(snapshot.source.clean).toBe(false);
    expect(snapshot.diagnostics).toMatchObject({ complete: true, reason: 'untracked_changes', ...zeroCounts, untrackedCount: 1 });
    privateProjection(snapshot, root);
  });

  it('counts quoted control-character names as records without retaining the quoted names', () => {
    const root = fixture();
    const rows = 'R  "old\\tname" -> "new\\nname"\n M "another\\rname"\n?? "private\\nname.txt"\n';
    execFileSync.mockImplementation((command, args, options) => args[0] === 'status'
      ? rows : actualExecFileSync(command, args, options));
    const snapshot = captureReleaseSourceSnapshot(root);
    expect(snapshot.source.clean).toBe(false);
    expect(snapshot.diagnostics).toMatchObject({
      complete: true, reason: 'tracked_changes', ...zeroCounts,
      stagedCount: 1, unstagedCount: 1, untrackedCount: 1,
    });
    privateProjection(snapshot, root, ['old\\tname', 'new\\nname', 'another\\rname', 'private\\nname.txt']);
  });

  it('retains dirty-before and changed-HEAD evidence when the final checkout is clean', () => {
    const root = fixture();
    writeFileSync(join(root, 'source.txt'), 'transient build mutation');
    const before = captureReleaseSourceSnapshot(root);
    writeFileSync(join(root, 'source.txt'), 'initial');
    const after = captureReleaseSourceSnapshot(root);
    expect(before.diagnostics.unstagedCount).toBe(1);
    expect(after.diagnostics.unstagedCount).toBe(0);
    expect(after.source.clean).toBe(true);
    expect(createBuildIdentity(before.source, after.source).clean).toBe(false);
    writeFileSync(join(root, 'source.txt'), 'next committed source');
    git(root, 'add', '.');
    git(root, '-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', 'next fixture');
    const changed = captureReleaseSourceSnapshot(root);
    expect(changed.source.clean).toBe(true);
    expect(changed.source.commit).not.toBe(after.source.commit);
    expect(createBuildIdentity(after.source, changed.source).clean).toBe(false);
    privateProjection(before, root, ['transient build mutation']);
    privateProjection(changed, root);
  });

  it('counts assume-unchanged and skip-worktree overlap even with empty ordinary status', () => {
    const root = fixture();
    const before = captureReleaseSourceSnapshot(root);
    git(root, 'update-index', '--assume-unchanged', 'source.txt');
    git(root, 'update-index', '--skip-worktree', 'other.txt');
    git(root, 'update-index', '--assume-unchanged', 'other.txt');
    const snapshot = captureReleaseSourceSnapshot(root);
    expect(git(root, 'status', '--porcelain=v1')).toBe('');
    expect(snapshot.source).toEqual({ commit: before.source.commit, clean: false });
    expect(snapshot.diagnostics).toMatchObject({
      complete: true, reason: 'hidden_index_flags', ...zeroCounts, assumeUnchangedCount: 2, skipWorktreeCount: 1,
    });
    const startedAt = '2026-10-05T00:00:00.000Z';
    const builtAt = '2026-10-05T00:00:01.000Z';
    const completedAt = '2026-10-05T00:00:02.000Z';
    const identity = createBuildIdentity(before.source, before.source, { builtAt, nodeVersion: '24.20.0' });
    const receipt = createCheckReceipt(before.source, before.source,
      { exitCode: 0, startedAt, completedAt, nodeVersion: '24.20.0', buildIdentity: identity });
    const dirtyIdentity = createBuildIdentity(before.source, snapshot.source, { builtAt, nodeVersion: '24.20.0' });
    expect(verifyDeployedIdentity(dirtyIdentity, receipt, before.source).ok).toBe(false);
    privateProjection(snapshot, root);
  });

  it('fails closed at a mismatched physical Git root with unavailable counts', () => {
    const root = fixture();
    const child = join(root, 'nested');
    mkdirSync(child);
    const snapshot = captureReleaseSourceSnapshot(child);
    expect(snapshot.source).toEqual({ commit: null, clean: false });
    expect(snapshot.diagnostics).toMatchObject({ complete: false, stage: 'root', reason: 'root_mismatch', ...nullCounts });
    privateProjection(snapshot, root, [child]);
  });

  it('rejects redirect presence without retaining its name/value or invoking Git', () => {
    const root = fixture();
    vi.stubEnv('GIT_INDEX_FILE', secret);
    const snapshot = captureReleaseSourceSnapshot(root);
    expect(snapshot.source).toEqual({ commit: null, clean: false });
    expect(snapshot.diagnostics).toMatchObject({ complete: false, stage: 'redirect', reason: 'git_redirect_present', ...nullCounts });
    expect(execFileSync).not.toHaveBeenCalled();
    privateProjection(snapshot, root, ['GIT_INDEX_FILE']);
  });

  it('records a missing executable as a fixed failure, never its raw error', () => {
    const root = fixture();
    execFileSync.mockImplementationOnce(() => {
      throw Object.assign(new Error(`${root}/${privateName}: ${secret}`), { code: 'ENOENT', syscall: 'spawnSync git' });
    });
    const snapshot = captureReleaseSourceSnapshot(root);
    expect(snapshot.source).toEqual({ commit: null, clean: false });
    expect(snapshot.diagnostics).toMatchObject({ complete: false, stage: 'head', reason: 'git_unavailable', ...nullCounts });
    privateProjection(snapshot, root);
  });

  it('identifies an actual directory without Git metadata using only a fixed failure code', () => {
    const root = mkdtempSync(join(fixtureDirectory, 'aft-source-diagnostics-'));
    roots.push(root);
    const snapshot = captureReleaseSourceSnapshot(root);
    expect(snapshot.source).toEqual({ commit: null, clean: false });
    expect(snapshot.diagnostics).toMatchObject({ complete: false, stage: 'head', reason: 'git_not_repository', ...nullCounts });
    privateProjection(snapshot, root);
  });

  it.each([
    { reason: 'git_not_repository', signature: 'fatal: not a git repository (or any of the parent directories): ' },
    { reason: 'git_dubious_ownership', signature: 'fatal: detected dubious ownership in repository at ' },
    { reason: 'git_permission_denied', signature: 'fatal: cannot change to ' },
  ])('sanitizes recognized $reason stderr without keeping its path or advice', ({ reason, signature }) => {
    const root = fixture();
    execFileSync.mockImplementationOnce(() => {
      const suffix = reason === 'git_permission_denied' ? ': Permission denied' : '';
      throw Object.assign(new Error(secret), { status: 128,
        stderr: Buffer.from(`${signature}${root}/${privateName}${suffix}\n${secret}`) });
    });
    const snapshot = captureReleaseSourceSnapshot(root);
    expect(snapshot.source).toEqual({ commit: null, clean: false });
    expect(snapshot.diagnostics).toMatchObject({ complete: false, stage: 'head', reason, ...nullCounts });
    privateProjection(snapshot, root);
  });

  it.each([
    { operation: 'status', code: 'ETIMEDOUT', stage: 'status', reason: 'git_timeout' },
    { operation: 'ls-files', code: undefined, stage: 'index', reason: 'git_command_failed' },
  ])('discards partial counts and raw $operation failure output', ({ operation, code, stage, reason }) => {
    const root = fixture();
    writeFileSync(join(root, privateName), secret);
    execFileSync.mockImplementation((command, args, options) => {
      if (args[0] === operation) {
        throw Object.assign(new Error(secret), { code, status: 128, stdout: root, stderr: `${privateName} ${secret}` });
      }
      return actualExecFileSync(command, args, options);
    });
    const snapshot = captureReleaseSourceSnapshot(root);
    expect(snapshot.source).toEqual({ commit: null, clean: false });
    expect(snapshot.diagnostics).toMatchObject({ complete: false, stage, reason, ...nullCounts });
    privateProjection(snapshot, root);
  });

  it('projects an invalid observed SHA to null without retaining that raw value', () => {
    const root = fixture();
    execFileSync.mockImplementation((command, args, options) => {
      if (args.join(' ') === 'rev-parse --verify HEAD') return secret;
      return actualExecFileSync(command, args, options);
    });
    const snapshot = captureReleaseSourceSnapshot(root);
    expect(snapshot.source).toEqual({ commit: null, clean: false });
    expect(snapshot.diagnostics).toMatchObject({ complete: true, stage: 'complete', reason: 'invalid_commit', ...zeroCounts });
    privateProjection(snapshot, root);
  });
});
