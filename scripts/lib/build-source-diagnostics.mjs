import { closeSync, chmodSync, existsSync, fsyncSync, lstatSync, mkdirSync, openSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import { BUILD_SOURCE_TRACKED_PATH_LABELS } from './release-identity.mjs';

export const BUILD_SOURCE_DIAGNOSTICS_PATH = 'dist/server/.build-evidence/source-status.json';
export const MAX_BUILD_SOURCE_DIAGNOSTICS_BYTES = 16 * 1024;
const stages = new Set(['redirect', 'head', 'root', 'status', 'index', 'complete']);
const reasons = new Set(['clean', 'git_redirect_present', 'root_mismatch', 'invalid_commit',
  'tracked_changes', 'untracked_changes', 'hidden_index_flags', 'git_unavailable', 'git_timeout',
  'git_not_repository', 'git_dubious_ownership', 'git_permission_denied', 'git_command_failed']);
const countFields = ['stagedCount', 'unstagedCount', 'untrackedCount', 'assumeUnchangedCount', 'skipWorktreeCount'];
const validCommit = (value) => value === null || typeof value === 'string' && /^[a-f0-9]{40}$/.test(value);
const validTimestamp = (value) => typeof value === 'string'
  && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) && Number.isFinite(Date.parse(value));
const fail = () => { throw new Error('Private build-source diagnostic is invalid or unavailable.'); };

function observation(snapshot) {
  const source = snapshot?.source;
  const diagnostic = snapshot?.diagnostics;
  if (!source || !validCommit(source.commit) || typeof source.clean !== 'boolean'
    || !diagnostic || !validTimestamp(diagnostic.observedAt) || typeof diagnostic.complete !== 'boolean'
    || !stages.has(diagnostic.stage) || !reasons.has(diagnostic.reason)) fail();
  const result = { commit: source.commit, clean: source.clean, observedAt: diagnostic.observedAt,
    complete: diagnostic.complete, stage: diagnostic.stage, reason: diagnostic.reason };
  for (const field of countFields) {
    const count = diagnostic[field];
    if (diagnostic.complete ? !Number.isSafeInteger(count) || count < 0 || count > 4 * 1024 * 1024 : count !== null) fail();
    result[field] = count;
  }
  // Legacy count-only snapshots remain unknown; they must not become an empty known set.
  const labels = diagnostic.trackedPathLabels ?? null;
  if (labels !== null) {
    if (!diagnostic.complete || source.commit === null || !Array.isArray(labels)
      || labels.length > BUILD_SOURCE_TRACKED_PATH_LABELS.length
      || labels.some((label) => typeof label !== 'string' || !BUILD_SOURCE_TRACKED_PATH_LABELS.includes(label))) fail();
    const canonical = BUILD_SOURCE_TRACKED_PATH_LABELS.filter((label) => labels.includes(label));
    if (canonical.length !== labels.length || canonical.some((label, index) => label !== labels[index])
      || labels.length > 0 && result.stagedCount + result.unstagedCount === 0) fail();
  }
  result.trackedPathLabels = labels === null ? null : [...labels];
  return result;
}

export function createBuildSourceDiagnostics(before, after, identity) {
  if (!identity || identity.schemaVersion !== 1 || !validCommit(identity.commit)
    || typeof identity.clean !== 'boolean' || !validTimestamp(identity.builtAt)
    || !Number.isInteger(identity.nodeMajor) || identity.nodeMajor < 1 || identity.nodeMajor > 100) fail();
  const first = observation(before);
  const last = observation(after);
  const expectedClean = first.commit !== null && first.clean && last.clean && first.commit === last.commit;
  if (identity.commit !== last.commit || identity.clean !== expectedClean) fail();
  // Only fixed approved labels can identify paths; arbitrary names and raw data are omitted.
  return { schemaVersion: 2,
    identity: { schemaVersion: 1, commit: identity.commit, clean: identity.clean,
      builtAt: identity.builtAt, nodeMajor: identity.nodeMajor },
    before: first, after: last };
}

function evidenceDirectory(cwd, create = false) {
  const dist = join(cwd, 'dist');
  const server = join(dist, 'server');
  const directory = join(server, '.build-evidence');
  for (const path of [dist, server]) {
    if (!existsSync(path)) { if (!create) return null; fail(); }
    const stat = lstatSync(path);
    if (!stat.isDirectory() || stat.isSymbolicLink()) fail();
  }
  if (!existsSync(directory)) { if (!create) return null; mkdirSync(directory, { mode: 0o700 }); }
  const stat = lstatSync(directory);
  if (!stat.isDirectory() || stat.isSymbolicLink()) fail();
  if (create && process.platform !== 'win32') chmodSync(directory, 0o700);
  return directory;
}

export function clearBuildSourceDiagnostics(cwd = process.cwd()) {
  try {
    const directory = evidenceDirectory(cwd);
    if (directory) rmSync(join(directory, 'source-status.json'), { force: true });
  } catch { fail(); }
}

export function writeBuildSourceDiagnostics(before, after, identity, cwd = process.cwd()) {
  let temporary;
  let descriptor;
  try {
    const record = createBuildSourceDiagnostics(before, after, identity);
    const serialized = `${JSON.stringify(record, null, 2)}\n`;
    if (Buffer.byteLength(serialized) > MAX_BUILD_SOURCE_DIAGNOSTICS_BYTES) fail();
    const directory = evidenceDirectory(cwd, true);
    temporary = join(directory, `.source-status-${randomUUID()}.tmp`);
    descriptor = openSync(temporary, 'wx', 0o600);
    writeFileSync(descriptor, serialized);
    fsyncSync(descriptor);
    closeSync(descriptor);
    descriptor = undefined;
    if (process.platform !== 'win32') chmodSync(temporary, 0o600);
    renameSync(temporary, join(directory, 'source-status.json'));
    temporary = undefined;
    return record;
  } catch { fail(); }
  finally {
    // Cleanup must not replace a sanitized error with filesystem paths or OS error text.
    try { if (descriptor !== undefined) closeSync(descriptor); } catch { /* Preserve the fixed failure above. */ }
    try { if (temporary) rmSync(temporary, { force: true }); } catch { /* Preserve the fixed failure above. */ }
  }
}
