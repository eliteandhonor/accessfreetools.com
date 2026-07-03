import { existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { isAbsolute, relative, resolve } from 'node:path';

export const cleanupAllowlist = [
  { type: 'exact', path: '.astro' },
  { type: 'exact', path: 'dist' },
  { type: 'exact', path: '.playwright-cli' },
  { type: 'exact', path: '.npm-cache' },
  { type: 'exact', path: 'test-results' },
  { type: 'exact', path: 'debug.log' },
  { type: 'glob', pattern: 'dev-server*.log' },
  { type: 'glob', pattern: 'preview*.log' },
  { type: 'glob', pattern: '.codex-dev-*.log' },
  { type: 'glob', pattern: 'npm-debug.log*' },
];

export const projectDenylist = [
  { type: 'exact', path: 'output' },
  { type: 'exact', path: 'agents' },
  { type: 'exact', path: '.local' },
  { type: 'exact', path: '.env' },
  { type: 'glob', pattern: '.env.*' },
  { type: 'exact', path: 'Host API' },
  { type: 'exact', path: 'node_modules' },
  { type: 'exact', path: 'public' },
  { type: 'exact', path: 'src' },
  { type: 'exact', path: 'docs' },
  { type: 'exact', path: 'scripts' },
  { type: 'exact', path: '.git' },
];

export const codexHomeDenylist = [
  'sessions',
  'quarantine',
  'generated_images',
  'auth.json',
  'config.toml',
  'goals_*.sqlite',
  'state_*.sqlite',
  'logs_*.sqlite',
  'plugins',
  'skills',
  'worktrees',
];

export function normalizeRelativePath(value) {
  return String(value || '')
    .replaceAll('\\', '/')
    .replace(/^\.\/+/, '')
    .replace(/\/+$/, '');
}

export function isInsidePath(parentPath, childPath) {
  const relativePath = relative(resolve(parentPath), resolve(childPath));
  return relativePath === '' || (!relativePath.startsWith('..') && !isAbsolute(relativePath));
}

export function globToRegExp(pattern) {
  const escaped = normalizeRelativePath(pattern)
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replaceAll('*', '[^/]*');
  return new RegExp(`^${escaped}$`);
}

export function matchesRule(relativePath, rule) {
  const cleanPath = normalizeRelativePath(relativePath);
  if (rule.type === 'exact') return cleanPath === normalizeRelativePath(rule.path);
  if (rule.type === 'glob') return globToRegExp(rule.pattern).test(cleanPath);
  return false;
}

function matchesProtectedRule(relativePath, rule) {
  const cleanPath = normalizeRelativePath(relativePath);
  if (rule.type === 'exact') {
    const protectedPath = normalizeRelativePath(rule.path);
    return cleanPath === protectedPath || cleanPath.startsWith(`${protectedPath}/`);
  }
  if (rule.type === 'glob') return globToRegExp(rule.pattern).test(cleanPath);
  return false;
}

export function isAllowedCleanupPath(relativePath) {
  return cleanupAllowlist.some((rule) => matchesRule(relativePath, rule));
}

export function deniedCleanupReasons(relativePath) {
  const cleanPath = normalizeRelativePath(relativePath);
  return projectDenylist
    .filter((rule) => matchesProtectedRule(cleanPath, rule))
    .map((rule) => `protected project path: ${rule.path ?? rule.pattern}`);
}

export function pathSizeBytes(path) {
  if (!existsSync(path)) return 0;
  const stats = statSync(path);
  if (!stats.isDirectory()) return stats.size;

  let total = 0;
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    total += pathSizeBytes(resolve(path, entry.name));
  }
  return total;
}

export function validateCleanupCandidate(rootDir, relativePath, { measureSize = true } = {}) {
  const root = resolve(rootDir);
  const cleanPath = normalizeRelativePath(relativePath);
  const absolutePath = resolve(root, cleanPath);
  const reasons = [];

  if (!isInsidePath(root, absolutePath) || resolve(root) === absolutePath) {
    reasons.push('candidate must stay inside the repository root and cannot be the root itself');
  }

  reasons.push(...deniedCleanupReasons(cleanPath));

  if (!isAllowedCleanupPath(cleanPath)) {
    reasons.push('not in conservative cleanup allowlist');
  }

  return {
    absolutePath,
    allowed: reasons.length === 0,
    exists: existsSync(absolutePath),
    relativePath: cleanPath,
    reasons,
    sizeBytes: measureSize && existsSync(absolutePath) ? pathSizeBytes(absolutePath) : 0,
  };
}

export function listCleanupCandidates(rootDir = process.cwd(), options = {}) {
  const root = resolve(rootDir);
  const candidates = [];

  for (const rule of cleanupAllowlist) {
    if (rule.type === 'exact') {
      const candidate = validateCleanupCandidate(root, rule.path, options);
      if (candidate.exists) candidates.push(candidate);
      continue;
    }

    const matcher = globToRegExp(rule.pattern);
    for (const entry of readdirSync(root, { withFileTypes: true })) {
      if (matcher.test(entry.name)) {
        const candidate = validateCleanupCandidate(root, entry.name, options);
        if (candidate.exists) candidates.push(candidate);
      }
    }
  }

  return candidates.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}

export function runSafeCleanup({ rootDir = process.cwd(), apply = false } = {}) {
  const candidates = listCleanupCandidates(rootDir);
  const blocked = candidates.filter((candidate) => !candidate.allowed);
  const deleted = [];

  if (apply && blocked.length) {
    return {
      apply,
      blocked,
      candidates,
      deleted,
      status: 'blocked',
      totalBytes: candidates.reduce((sum, candidate) => sum + candidate.sizeBytes, 0),
    };
  }

  if (apply) {
    for (const candidate of candidates) {
      rmSync(candidate.absolutePath, { force: true, recursive: true });
      deleted.push(candidate);
    }
  }

  return {
    apply,
    blocked,
    candidates,
    deleted,
    status: blocked.length ? 'blocked' : 'pass',
    totalBytes: candidates.reduce((sum, candidate) => sum + candidate.sizeBytes, 0),
  };
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
}
