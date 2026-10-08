import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, readlinkSync, realpathSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';
import { PRIVATE_STATE_GIT_ARGUMENTS, privateStateGitEnvironment } from './private-state-git-environment.mjs';

const ENVIRONMENT_NAMES = ['PATH', 'TMPDIR', 'TMP', 'TEMP', 'LANG', 'LC_ALL', 'TZ'];
const GIT = '/usr/bin/git'; // Selected Linux runtime and Ubuntu Actions; no PATH executable override.
const MAX_TRACKED_FILES = 20000;
const MAX_TRACKED_BYTES = 1024 * 1024 * 1024;

function matchesCommittedFiles(directory, tree) {
  const entries = tree.split('\0');
  if (entries.pop() !== '' || entries.length > MAX_TRACKED_FILES) return false;
  const checkedDirectories = new Set();
  let totalBytes = 0;
  for (const entry of entries) {
    const match = /^(100644|100755|120000) blob ([a-f0-9]{40})\t(.+)$/.exec(entry);
    if (!match || isAbsolute(match[3]) || match[3].includes('\uFFFD') || match[3].includes('\\')) return false;
    const segments = match[3].split('/');
    if (segments.some((segment) => ['', '.', '..', '.git'].includes(segment))) return false;
    for (let index = 1; index < segments.length; index += 1) {
      const path = join(directory, ...segments.slice(0, index));
      if (checkedDirectories.has(path)) continue;
      const parent = lstatSync(path);
      if (!parent.isDirectory() || parent.isSymbolicLink()) return false;
      checkedDirectories.add(path);
    }
    const path = join(directory, ...segments);
    const stat = lstatSync(path);
    totalBytes += stat.size;
    if (totalBytes > MAX_TRACKED_BYTES) return false;
    let content;
    if (match[1] === '120000') {
      if (!stat.isSymbolicLink()) return false;
      content = readlinkSync(path, { encoding: 'buffer' });
    } else {
      if (!stat.isFile() || Boolean(stat.mode & 0o111) !== (match[1] === '100755')) return false;
      content = readFileSync(path);
    }
    const blob = createHash('sha1').update(`blob ${content.length}\0`).update(content).digest('hex');
    if (blob !== match[2]) return false;
  }
  return true;
}

/** Read local approval identity without inheriting runtime credentials or executable Git helpers. */
export function readPilotCodeIdentity(root, { source = process.env } = {}) {
  const fail = () => { throw Object.assign(new Error('Pilot code identity could not be verified.'), { code: 'PILOT_CODE_APPROVAL_REQUIRED' }); };
  if (typeof root !== 'string' || !isAbsolute(root) || !source || typeof source !== 'object') fail();
  const allowed = {};
  // Access only permitted names; never read/copy credentials from the source environment.
  for (const name of ENVIRONMENT_NAMES) {
    const value = source[name];
    if (typeof value === 'string' && !value.includes('\0')) allowed[name] = value;
  }
  const environment = privateStateGitEnvironment({ source: allowed });
  const args = ['--no-replace-objects', ...PRIVATE_STATE_GIT_ARGUMENTS, '-c', 'core.fsmonitor=false'];
  try {
    const directory = realpathSync(root);
    const read = (command) => execFileSync(GIT, [...args, ...command], {
      cwd: directory, env: environment, encoding: 'utf8', maxBuffer: 1024 * 1024, timeout: 15000,
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
    if (read(['rev-parse', '--show-toplevel']) !== directory) fail();
    const codeCommit = read(['rev-parse', '--verify', 'HEAD']);
    if (!/^[a-f0-9]{40}$/.test(codeCommit)) fail();
    const tree = execFileSync(GIT, [...args, 'ls-tree', '-r', '-z', '--full-tree', codeCommit], {
      cwd: directory, env: environment, maxBuffer: 4 * 1024 * 1024, timeout: 15000, stdio: ['ignore', 'pipe', 'pipe'],
    });
    // Index-only and untracked checks do not invoke clean/process filters. Finish
    // every Git child before the final raw filesystem audit.
    const cleanIndex = read(['diff-index', '--cached', '--raw', '--no-renames', '--no-ext-diff', '--no-textconv', codeCommit, '--']) === '';
    const noUntrackedFiles = read(['ls-files', '--others', '--exclude-standard', '-z']) === '';
    const stableHead = read(['rev-parse', '--verify', 'HEAD']) === codeCommit;
    const exactTrackedFiles = matchesCommittedFiles(directory, new TextDecoder('utf-8', { fatal: true }).decode(tree));
    return { codeCommit, clean: cleanIndex && noUntrackedFiles && stableHead && exactTrackedFiles };
  } catch { fail(); }
}
