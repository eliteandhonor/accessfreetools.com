import { createHash, randomUUID } from 'node:crypto';

export const MAX_PRIVATE_INPUT_FILES = 64;
export const MAX_PRIVATE_INPUT_FILE_BYTES = 256 * 1024;
export const MAX_PRIVATE_INPUT_BYTES = 2 * 1024 * 1024;
const PREFIXES = ['inputs/localsend-held-pilot/v1/', 'inputs/localsend-held-pilot/v2/'];

function fail(code, message) { throw Object.assign(new Error(message), { code }); }

function inventory(commit, files) {
  if (typeof commit !== 'string' || !/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(commit)) {
    fail('PRIVATE_INPUT_COMMIT_REQUIRED', 'Private inputs require an exact immutable Git commit.');
  }
  if (!Array.isArray(files) || files.length < 1 || files.length > MAX_PRIVATE_INPUT_FILES || new Set(files).size !== files.length) {
    fail('PRIVATE_INPUT_INVENTORY_INVALID', 'Private inputs require one fixed inventory of at most 64 distinct files.');
  }
  let prefix;
  for (const path of files) {
    const matched = typeof path === 'string' && PREFIXES.find((value) => path.startsWith(value));
    if (!matched || (prefix && prefix !== matched) || path.length > 1024 ||
      !path.slice(matched.length).split('/').every((segment) => /^[A-Za-z0-9][A-Za-z0-9._-]{0,119}$/.test(segment))) {
      fail('PRIVATE_INPUT_INVENTORY_INVALID', 'Private inputs must use safe paths within one approved pilot bundle prefix.');
    }
    prefix = matched;
  }
}

/**
 * Read a caller's fixed checked-in inventory at a pinned commit using the private
 * store's isolated Git transport. No URL, ref, filesystem path, or executable
 * input is accepted. Returned files/sha256/bytes maps use the full approved Git
 * paths. File strings preserve their exact UTF-8 bytes, including final newlines.
 * Actual private metadata is rechecked before fetch and before every file read.
 */
export async function readPinnedPrivateInputBundle({ commit, files, git, verifyPrivateRepository, fetchUrl }) {
  // Snapshot before any await; later caller mutation cannot widen the inventory.
  const approvedFiles = Array.isArray(files) ? Object.freeze([...files]) : files;
  inventory(commit, approvedFiles);
  await verifyPrivateRepository();
  const temporaryRef = `refs/aft-editorial-inputs/${randomUUID()}`;
  const result = { commit, files: Object.create(null), sha256: Object.create(null), bytes: Object.create(null), totalBytes: 0 };
  try {
    await git(['fetch', '--no-tags', '--no-write-fetch-head', fetchUrl, `${commit}:${temporaryRef}`]);
    if ((await git(['cat-file', '-t', temporaryRef])).output !== 'commit' ||
      (await git(['rev-parse', '--verify', temporaryRef])).output !== commit) {
      fail('PRIVATE_INPUT_COMMIT_MISMATCH', 'Private inputs did not resolve to the exact pinned commit.');
    }
    for (const path of approvedFiles) {
      await verifyPrivateRepository();
      const entry = (await git(['ls-tree', '-z', commit, '--', path], { rawOutput: true })).output.toString('utf8');
      const match = /^100644 blob ([a-f0-9]{40}|[a-f0-9]{64})\t([^\0]+)\0$/.exec(entry);
      if (!match || match[2] !== path) fail('PRIVATE_INPUT_FILE_INVALID', 'A private input is missing or is not a regular nonexecutable file.');
      const size = (await git(['cat-file', '-s', match[1]])).output;
      if (!/^(?:0|[1-9][0-9]*)$/.test(size) || !Number.isSafeInteger(Number(size)) || Number(size) > MAX_PRIVATE_INPUT_FILE_BYTES ||
        result.totalBytes + Number(size) > MAX_PRIVATE_INPUT_BYTES) {
        fail('PRIVATE_INPUT_LIMIT', 'Private input file or bundle exceeds its reviewed byte limit.');
      }
      const raw = (await git(['cat-file', 'blob', match[1]], { rawOutput: true })).output;
      if (raw.length !== Number(size)) fail('PRIVATE_INPUT_FILE_INVALID', 'Private input bytes do not match their immutable Git object size.');
      let content;
      try { content = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(raw); }
      catch { fail('PRIVATE_INPUT_UTF8_INVALID', 'Private inputs must contain valid UTF-8 text.'); }
      if (content.includes('\0')) fail('PRIVATE_INPUT_UTF8_INVALID', 'Private inputs must contain UTF-8 text without NUL bytes.');
      result.files[path] = content;
      result.sha256[path] = createHash('sha256').update(raw).digest('hex');
      result.bytes[path] = raw.length;
      result.totalBytes += raw.length;
    }
    return result;
  } finally { await git(['update-ref', '-d', temporaryRef]); }
}
