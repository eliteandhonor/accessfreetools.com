import { mkdtempSync, rmSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import {
  deniedCleanupReasons,
  isAllowedCleanupPath,
  listCleanupCandidates,
  runSafeCleanup,
  validateCleanupCandidate,
} from './safe-cleanup.mjs';

const tempRoots = [];

function makeRoot() {
  const root = mkdtempSync(join(tmpdir(), 'aft-safe-cleanup-'));
  tempRoots.push(root);
  return root;
}

function writeFixture(root, relativePath, content = 'fixture') {
  const fullPath = join(root, relativePath);
  mkdirSync(join(fullPath, '..'), { recursive: true });
  writeFileSync(fullPath, content);
  return fullPath;
}

afterEach(() => {
  while (tempRoots.length) {
    rmSync(tempRoots.pop(), { force: true, recursive: true });
  }
});

describe('safe cleanup allowlist and denylist', () => {
  it('allows only conservative rebuildable cleanup paths', () => {
    expect(isAllowedCleanupPath('.astro')).toBe(true);
    expect(isAllowedCleanupPath('dist')).toBe(true);
    expect(isAllowedCleanupPath('.npm-cache')).toBe(true);
    expect(isAllowedCleanupPath('test-results')).toBe(true);
    expect(isAllowedCleanupPath('debug.log')).toBe(true);
    expect(isAllowedCleanupPath('dev-server-5173.log')).toBe(true);
    expect(isAllowedCleanupPath('preview-local.err.log')).toBe(true);
    expect(isAllowedCleanupPath('.codex-dev-123.log')).toBe(true);
    expect(isAllowedCleanupPath('npm-debug.log.1')).toBe(true);

    expect(isAllowedCleanupPath('output')).toBe(false);
    expect(isAllowedCleanupPath('agents')).toBe(false);
    expect(isAllowedCleanupPath('.local')).toBe(false);
  });

  it('refuses protected evidence, secret, source, and state paths', () => {
    for (const protectedPath of [
      'output',
      'output/seo-proof.txt',
      'agents',
      'agents/serpforge-ai/reports/proof.json',
      '.local',
      '.local/devto.env',
      '.env',
      '.env.production',
      'Host API',
      'Host API/token.txt',
      'node_modules',
      'public',
      'src',
      'docs',
      'scripts',
      '.git',
    ]) {
      expect(deniedCleanupReasons(protectedPath), protectedPath).not.toHaveLength(0);
    }
  });

  it('validates candidates against root containment, allowlist, and denylist', () => {
    const root = makeRoot();
    mkdirSync(join(root, '.astro'), { recursive: true });
    mkdirSync(join(root, 'output'), { recursive: true });

    const safeCandidate = validateCleanupCandidate(root, '.astro');
    expect(safeCandidate.allowed).toBe(true);
    expect(safeCandidate.exists).toBe(true);

    const protectedCandidate = validateCleanupCandidate(root, 'output');
    expect(protectedCandidate.allowed).toBe(false);
    expect(protectedCandidate.reasons).toContain('protected project path: output');

    const outsideCandidate = validateCleanupCandidate(root, '../outside');
    expect(outsideCandidate.allowed).toBe(false);
    expect(outsideCandidate.reasons).toContain('candidate must stay inside the repository root and cannot be the root itself');
  });

  it('lists only existing allowlisted cleanup candidates', () => {
    const root = makeRoot();
    mkdirSync(join(root, '.astro'), { recursive: true });
    mkdirSync(join(root, 'output'), { recursive: true });
    writeFixture(root, 'debug.log');
    writeFixture(root, 'dev-server-4321.log');

    const candidates = listCleanupCandidates(root).map((candidate) => candidate.relativePath);
    expect(candidates).toEqual(['.astro', 'debug.log', 'dev-server-4321.log']);
  });

  it('dry-run reports candidates without deleting them', () => {
    const root = makeRoot();
    const astroFile = writeFixture(root, '.astro/cache.txt');
    const debugLog = writeFixture(root, 'debug.log');

    const report = runSafeCleanup({ apply: false, rootDir: root });

    expect(report.status).toBe('pass');
    expect(report.apply).toBe(false);
    expect(report.deleted).toHaveLength(0);
    expect(report.candidates.map((candidate) => candidate.relativePath)).toEqual(['.astro', 'debug.log']);
    expect(existsSync(astroFile)).toBe(true);
    expect(existsSync(debugLog)).toBe(true);
  });

  it('apply deletes allowlisted candidates only', () => {
    const root = makeRoot();
    const astroFile = writeFixture(root, '.astro/cache.txt');
    const protectedFile = writeFixture(root, 'output/seo-proof.txt');

    const report = runSafeCleanup({ apply: true, rootDir: root });

    expect(report.status).toBe('pass');
    expect(report.deleted.map((candidate) => candidate.relativePath)).toEqual(['.astro']);
    expect(existsSync(astroFile)).toBe(false);
    expect(existsSync(protectedFile)).toBe(true);
  });
});
