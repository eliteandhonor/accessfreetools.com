import { execFileSync } from 'node:child_process';
import { readFileSync, realpathSync } from 'node:fs';

export const RELEASE_RECEIPT_PATH = 'output/release/full-check.json';
export const BUILD_IDENTITY_PATH = '/_build.json';
const validCommit = (value) => typeof value === 'string' && /^[a-f0-9]{40}$/.test(value);
const validDate = (value) => typeof value === 'string' && Number.isFinite(Date.parse(value));
const nodeMajor = (version) => Number(String(version).split('.')[0]);
const sameCleanSource = (before, after) => validCommit(before?.commit) && before?.clean === true
  && after?.clean === true && before.commit === after.commit;

export function captureReleaseSourceSnapshot(cwd = process.cwd()) {
  const diagnostics = {
    observedAt: new Date().toISOString(), complete: false, stage: 'redirect', reason: 'git_redirect_present',
    stagedCount: null, unstagedCount: null, untrackedCount: null,
    assumeUnchangedCount: null, skipWorktreeCount: null,
  };
  const unavailable = () => ({ source: { commit: null, clean: false }, diagnostics });
  try {
    const redirectKeys = new Set(['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR']);
    if (Object.entries(process.env).some(([key, value]) => redirectKeys.has(key.toUpperCase()) && value)) {
      return unavailable();
    }
    const git = (...args) => execFileSync('git', args, {
      cwd, encoding: 'utf8', timeout: 15000, maxBuffer: 4 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true,
    });
    diagnostics.stage = 'head';
    const commit = git('rev-parse', '--verify', 'HEAD').trim();
    const normalizePath = (path) => {
      const resolved = realpathSync(path);
      return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
    };
    diagnostics.stage = 'root';
    if (normalizePath(git('rev-parse', '--show-toplevel').trim()) !== normalizePath(cwd)) {
      diagnostics.reason = 'root_mismatch';
      return unavailable();
    }
    diagnostics.stage = 'status';
    const status = git('status', '--porcelain=v1', '--untracked-files=normal');
    // Git status deliberately ignores changes hidden by these index flags.
    diagnostics.stage = 'index';
    const indexRows = git('ls-files', '-v', '-z').split('\0');
    const hidden = indexRows.some((row) => /^[a-zS]/.test(row));
    let stagedCount = 0;
    let unstagedCount = 0;
    let untrackedCount = 0;
    // Count porcelain records, not filenames: normal untracked output can group a directory.
    // Git quotes embedded newlines; rename records remain one line with two status columns.
    for (const row of status.split(/\r?\n/)) {
      if (!row.trim()) continue;
      if (row.startsWith('??')) untrackedCount += 1;
      else {
        if (row[0] !== ' ') stagedCount += 1;
        if (row[1] !== ' ') unstagedCount += 1;
      }
    }
    Object.assign(diagnostics, {
      complete: true, stage: 'complete', stagedCount, unstagedCount, untrackedCount,
      assumeUnchangedCount: indexRows.filter((row) => /^[a-z]/.test(row)).length,
      skipWorktreeCount: indexRows.filter((row) => /^[sS]/.test(row)).length,
    });
    diagnostics.reason = !validCommit(commit) ? 'invalid_commit'
      : stagedCount || unstagedCount ? 'tracked_changes'
        : untrackedCount ? 'untracked_changes'
          : hidden ? 'hidden_index_flags' : 'clean';
    return { source: { commit: validCommit(commit) ? commit : null,
      clean: validCommit(commit) && status.trim() === '' && !hidden }, diagnostics };
  } catch (error) {
    diagnostics.reason = error?.code === 'ETIMEDOUT' ? 'git_timeout'
      : error?.code === 'ENOENT' && typeof error?.syscall === 'string' && error.syscall.startsWith('spawnSync')
        ? 'git_unavailable' : 'git_command_failed';
    if (diagnostics.reason === 'git_command_failed') {
      const stderr = typeof error?.stderr === 'string' ? error.stderr
        : Buffer.isBuffer(error?.stderr) ? error.stderr.toString('utf8') : '';
      // Match only standard Git failure signatures. Never retain the line, path, or raw error.
      if (/^fatal: not a git repository(?:[ (:]|$)/m.test(stderr)) diagnostics.reason = 'git_not_repository';
      else if (/^fatal: detected dubious ownership in repository at(?:\s|$)/m.test(stderr)) diagnostics.reason = 'git_dubious_ownership';
      else if (/^(?:fatal|error):[^\r\n]+: Permission denied\r?$/m.test(stderr)) diagnostics.reason = 'git_permission_denied';
    }
    return unavailable();
  }
}

export function captureReleaseSource(cwd = process.cwd()) {
  return captureReleaseSourceSnapshot(cwd).source;
}

export function createBuildIdentity(before, after, { builtAt = new Date().toISOString(), nodeVersion = process.versions.node } = {}) {
  return {
    schemaVersion: 1, commit: validCommit(after?.commit) ? after.commit : null,
    clean: sameCleanSource(before, after), builtAt, nodeMajor: nodeMajor(nodeVersion),
  };
}

export function createCheckReceipt(before, after, { exitCode, startedAt, completedAt, buildIdentity, nodeVersion = process.versions.node }) {
  const value = {
    schemaVersion: 1, command: 'npm run check:steps',
    commit: validCommit(after?.commit) ? after.commit : null,
    clean: sameCleanSource(before, after), nodeMajor: nodeMajor(nodeVersion),
    startedAt, completedAt, exitCode: Number.isInteger(exitCode) ? exitCode : null, verified: true,
    build: buildIdentity ? {
      schemaVersion: buildIdentity.schemaVersion, commit: buildIdentity.commit, clean: buildIdentity.clean,
      builtAt: buildIdentity.builtAt, nodeMajor: buildIdentity.nodeMajor,
    } : null,
  };
  value.verified = verifyReleaseReceipt(value, after).ok;
  return value;
}

export function readReleaseReceipt(path = RELEASE_RECEIPT_PATH) {
  try { return JSON.parse(readFileSync(path, 'utf8')); } catch { return null; }
}

export function verifyReleaseReceipt(receipt, source) {
  const failures = [];
  if (!validCommit(source?.commit) || source?.clean !== true) failures.push('current Git source is dirty or unavailable');
  if (!receipt || receipt.schemaVersion !== 1 || receipt.command !== 'npm run check:steps'
    || receipt.verified !== true || receipt.exitCode !== 0 || receipt.clean !== true
    || receipt.nodeMajor !== 24 || !validDate(receipt.startedAt) || !validDate(receipt.completedAt)
    || Date.parse(receipt.completedAt) < Date.parse(receipt.startedAt)) {
    failures.push('not enough data: no passing clean Node 24 full-check receipt');
  }
  if (!validCommit(receipt?.commit) || receipt?.commit !== source?.commit) failures.push('tested commit does not match current source');
  const build = receipt?.build;
  if (!build || build.schemaVersion !== 1 || build.clean !== true || build.nodeMajor !== 24
    || !validCommit(build.commit) || build.commit !== receipt?.commit || !validDate(build.builtAt)
    || Date.parse(build.builtAt) < Date.parse(receipt?.startedAt)
    || Date.parse(build.builtAt) > Date.parse(receipt?.completedAt)) {
    failures.push('full check lacks a fresh matching clean build identity');
  }
  return { ok: failures.length === 0, commit: validCommit(source?.commit) ? source.commit : null,
    message: failures.join('; '), description: failures.length ? undefined : `full check passed for ${source.commit}` };
}

export function verifyDeployedIdentity(identity, receipt, source) {
  const tested = verifyReleaseReceipt(receipt, source);
  const failures = tested.ok ? [] : [tested.message];
  if (!identity || identity.schemaVersion !== 1 || identity.clean !== true || identity.nodeMajor !== 24
    || !validDate(identity.builtAt) || !validCommit(identity.commit)) failures.push('not enough data: deployed build identity is missing or unverified');
  if (!validCommit(identity?.commit) || identity?.commit !== source?.commit) failures.push('deployed commit does not match tested source');
  return { ok: failures.length === 0, expectedCommit: tested.commit,
    deployedCommit: validCommit(identity?.commit) ? identity.commit : null,
    message: failures.join('; '), description: failures.length ? undefined : `tested and deployed source ${identity.commit}` };
}

export async function fetchDeployedIdentity(domain, { fetcher = fetch } = {}) {
  if (typeof domain !== 'string' || !/^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/i.test(domain)) throw new Error('Invalid build identity domain.');
  const url = new URL(BUILD_IDENTITY_PATH, `https://${domain}`);
  url.searchParams.set('proof', `${Date.now()}-${Math.random().toString(16).slice(2)}`);
  let response;
  try {
    response = await fetcher(url, { redirect: 'error', credentials: 'omit', cache: 'no-store',
      headers: { accept: 'application/json', 'cache-control': 'no-cache' }, signal: AbortSignal.timeout(15000) });
  } catch { throw new Error('Could not fetch deployed build identity.'); }
  if (!response.ok || !response.headers.get('content-type')?.includes('application/json') || !response.body) {
    await response.body?.cancel();
    throw new Error('Deployed build identity is unavailable or not JSON.');
  }
  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8192) throw new Error('Deployed build identity exceeds its size limit.');
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    await reader.cancel().catch(() => {});
    throw new Error('Deployed build identity is invalid or exceeds its size limit.');
  } finally { reader.releaseLock(); }
}

export function verifyRemoteReleaseSource(commit, remoteOutput) {
  const rows = String(remoteOutput).trim().split(/\r?\n/).filter(Boolean);
  const expected = `${commit}\trefs/heads/main`;
  const ok = validCommit(commit) && rows.length === 1 && rows[0] === expected;
  return { ok, message: ok ? '' : 'origin main does not match tested source; push the reviewed commit before requesting a build' };
}
