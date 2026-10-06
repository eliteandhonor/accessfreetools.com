import { existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createBuildIdentity } from './release-identity.mjs';
import { BUILD_SOURCE_DIAGNOSTICS_PATH, MAX_BUILD_SOURCE_DIAGNOSTICS_BYTES,
  clearBuildSourceDiagnostics, createBuildSourceDiagnostics, writeBuildSourceDiagnostics } from './build-source-diagnostics.mjs';

vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, renameSync: vi.fn(actual.renameSync), rmSync: vi.fn(actual.rmSync) };
});

const roots = [];
const timestamp = '2026-10-05T10:00:00.000Z';
const sha = 'a'.repeat(40);
function snapshot(overrides = {}) {
  return { source: { commit: sha, clean: true }, diagnostics: {
    observedAt: timestamp, complete: true, stage: 'complete', reason: 'clean',
    stagedCount: 0, unstagedCount: 0, untrackedCount: 0, assumeUnchangedCount: 0, skipWorktreeCount: 0,
  }, ...overrides };
}
function identity(before, after) { return createBuildIdentity(before.source, after.source, { builtAt: timestamp, nodeVersion: '24.0.0' }); }
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'aft-build-evidence-'));
  roots.push(root);
  mkdirSync(join(root, 'dist/server'), { recursive: true });
  return root;
}
afterEach(() => {
  for (const root of roots.splice(0)) {
    if (dirname(resolve(root)) !== resolve(tmpdir())) throw new Error('Unsafe fixture cleanup.');
    rmSync(root, { recursive: true, force: true });
  }
});

describe('private build-source diagnostic', () => {
  it('copies only the fixed schema and keeps dirty-before/clean-after identity unverified', () => {
    const secret = 'SYNTHETIC_SECRET_PRIVATE_PATH_ERROR';
    const before = snapshot();
    before.source.clean = false;
    before.source.rawName = secret;
    Object.assign(before.diagnostics, { reason: 'tracked_changes', unstagedCount: 1,
      rawError: secret, environment: secret, filenames: [secret] });
    const after = snapshot();
    const marker = { ...identity(before, after), extra: secret };
    const record = createBuildSourceDiagnostics(before, after, marker);
    expect(record.schemaVersion).toBe(2);
    expect(record.identity.clean).toBe(false);
    expect(record.before.unstagedCount).toBe(1);
    expect(JSON.stringify(record)).not.toContain(secret);
    expect(Object.keys(record.identity)).toEqual(['schemaVersion', 'commit', 'clean', 'builtAt', 'nodeMajor']);
    expect(record.before.trackedPathLabels).toBeNull();
    expect(record.after.trackedPathLabels).toBeNull();
  });

  it('copies only canonical approved labels while leaving public identity and dirty-source guards unchanged', () => {
    const before = snapshot();
    Object.assign(before.diagnostics, { trackedPathLabels: ['package.json', 'package-lock.json'],
      reason: 'tracked_changes', unstagedCount: 2 });
    before.source.clean = false;
    const after = snapshot();
    after.diagnostics.trackedPathLabels = [];
    const marker = identity(before, after);
    const record = createBuildSourceDiagnostics(before, after, marker);
    expect(record.before.trackedPathLabels).toEqual(['package.json', 'package-lock.json']);
    expect(record.after.trackedPathLabels).toEqual([]);
    expect(record.identity).toEqual(marker);
    expect(record.identity.schemaVersion).toBe(1);
    expect(record.identity.clean).toBe(false);
    before.diagnostics.trackedPathLabels.push('app.js');
    expect(record.before.trackedPathLabels).toEqual(['package.json', 'package-lock.json']);
  });

  it.each([
    ['private credentials fixture.txt'], ['nested/package.json'], ['package.json', 'package.json'],
    ['package-lock.json', 'package.json'], ['package.json', 'package-lock.json', 'app.js', 'astro.config.mjs', '.gitignore', 'extra'],
    [42], 'package.json', {},
  ].map((labels) => ({ labels })))('rejects invalid private labels without reflecting their values: $labels', ({ labels }) => {
    const before = snapshot();
    Object.assign(before.diagnostics, { trackedPathLabels: labels, unstagedCount: 1, reason: 'tracked_changes' });
    before.source.clean = false;
    const after = snapshot();
    expect(() => createBuildSourceDiagnostics(before, after, identity(before, after)))
      .toThrow('Private build-source diagnostic is invalid or unavailable.');
  });

  it('rejects labels on failed or unchanged observations and preserves unknown legacy path evidence', () => {
    const before = snapshot();
    before.diagnostics.trackedPathLabels = ['package.json'];
    const after = snapshot();
    expect(() => createBuildSourceDiagnostics(before, after, identity(before, after))).toThrow();
    before.source = { commit: null, clean: false };
    before.diagnostics = { observedAt: timestamp, complete: false, stage: 'head', reason: 'git_unavailable',
      stagedCount: null, unstagedCount: null, untrackedCount: null, assumeUnchangedCount: null, skipWorktreeCount: null,
      trackedPathLabels: ['package.json'] };
    expect(() => createBuildSourceDiagnostics(before, after, identity(before, after))).toThrow();
    before.diagnostics.trackedPathLabels = null;
    const record = createBuildSourceDiagnostics(before, after, identity(before, after));
    expect(record.before.trackedPathLabels).toBeNull();
    expect(record.after.trackedPathLabels).toBeNull();
  });

  it('rejects unbounded reasons, counts and mismatched source identities without reflecting input', () => {
    const before = snapshot();
    const after = snapshot();
    for (const change of [
      (value) => { value.diagnostics.reason = 'SYNTHETIC_SECRET'; },
      (value) => { value.diagnostics.untrackedCount = 4 * 1024 * 1024 + 1; },
      (value) => { value.diagnostics.observedAt = 'SYNTHETIC_SECRET'; },
    ]) {
      const altered = structuredClone(before);
      change(altered);
      expect(() => createBuildSourceDiagnostics(altered, after, identity(before, after))).toThrow('Private build-source diagnostic is invalid or unavailable.');
    }
    expect(() => createBuildSourceDiagnostics(before, after, { ...identity(before, after), clean: false })).toThrow();
  });

  it('represents unavailable observations using null counts without claiming clean source', () => {
    const before = snapshot();
    before.source = { commit: null, clean: false };
    before.diagnostics = { observedAt: timestamp, complete: false, stage: 'head', reason: 'git_unavailable',
      stagedCount: null, unstagedCount: null, untrackedCount: null, assumeUnchangedCount: null, skipWorktreeCount: null };
    const after = snapshot();
    const record = createBuildSourceDiagnostics(before, after, identity(before, after));
    expect(record.identity.clean).toBe(false);
    expect(record.before.untrackedCount).toBeNull();
  });

  it('revalidates labels before persisting and does not replace a prior valid record on invalid input', () => {
    const root = fixture();
    const before = snapshot();
    const after = snapshot();
    const marker = identity(before, after);
    writeBuildSourceDiagnostics(before, after, marker, root);
    const path = join(root, BUILD_SOURCE_DIAGNOSTICS_PATH);
    const prior = readFileSync(path, 'utf8');
    before.diagnostics.trackedPathLabels = ['private credentials fixture.txt'];
    expect(() => writeBuildSourceDiagnostics(before, after, marker, root))
      .toThrow('Private build-source diagnostic is invalid or unavailable.');
    expect(readFileSync(path, 'utf8')).toBe(prior);
    expect(readdirSync(dirname(path))).toEqual(['source-status.json']);
  });

  it('atomically replaces one server-only record, bounds its size and clears stale evidence', () => {
    const root = fixture();
    const before = snapshot();
    const after = snapshot();
    const record = writeBuildSourceDiagnostics(before, after, identity(before, after), root);
    const path = join(root, BUILD_SOURCE_DIAGNOSTICS_PATH);
    expect(JSON.parse(readFileSync(path, 'utf8'))).toEqual(record);
    expect(Buffer.byteLength(readFileSync(path))).toBeLessThanOrEqual(MAX_BUILD_SOURCE_DIAGNOSTICS_BYTES);
    expect(existsSync(join(root, 'dist/client/.build-evidence/source-status.json'))).toBe(false);
    expect(existsSync(join(root, 'dist/.build-evidence/source-status.json'))).toBe(false);
    writeBuildSourceDiagnostics(before, after, identity(before, after), root);
    expect(readdirSync(dirname(path))).toEqual(['source-status.json']);
    if (process.platform !== 'win32') {
      expect(lstatSync(dirname(path)).mode & 0o777).toBe(0o700);
      expect(lstatSync(path).mode & 0o777).toBe(0o600);
    }
    clearBuildSourceDiagnostics(root);
    expect(existsSync(path)).toBe(false);
  });

  it.skipIf(process.platform === 'win32')('refuses a symlinked private directory without writing to its target', () => {
    const root = fixture();
    const outside = join(root, 'outside');
    mkdirSync(outside);
    symlinkSync(outside, join(root, 'dist/server/.build-evidence'));
    const before = snapshot();
    const after = snapshot();
    expect(() => writeBuildSourceDiagnostics(before, after, identity(before, after), root)).toThrow('Private build-source diagnostic is invalid or unavailable.');
    expect(readdirSync(outside)).toEqual([]);
  });

  it('keeps publication and cleanup errors sanitized', () => {
    const root = fixture();
    const before = snapshot();
    const after = snapshot();
    renameSync.mockImplementationOnce(() => { throw new Error('SYNTHETIC_SECRET_RENAME_PATH'); });
    rmSync.mockImplementationOnce(() => { throw new Error('SYNTHETIC_SECRET_CLEANUP_PATH'); });
    expect(() => writeBuildSourceDiagnostics(before, after, identity(before, after), root)).toThrow('Private build-source diagnostic is invalid or unavailable.');
    expect(existsSync(join(root, BUILD_SOURCE_DIAGNOSTICS_PATH))).toBe(false);
  });
});
