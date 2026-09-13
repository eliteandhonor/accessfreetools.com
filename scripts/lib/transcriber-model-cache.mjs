import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, realpathSync } from 'node:fs';
import { isAbsolute, relative, resolve } from 'node:path';

const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');

export function loadVerifiedModelCache(directory, expected) {
  const root = realpathSync(directory);
  const manifestBytes = readFileSync(resolve(root, 'manifest.json'));
  assert.equal(sha(manifestBytes), expected.manifestSha256, 'Model manifest hash mismatch');
  const manifest = JSON.parse(manifestBytes);
  assert(manifest.complete === true && manifest.repository === expected.repository
    && manifest.revision === expected.revision, 'Model manifest identity mismatch');
  assert(Array.isArray(manifest.files) && manifest.files.length > 0, 'Missing model files');
  const files = new Map();
  let bytes = 0;
  for (const item of manifest.files) {
    assert(typeof item.path === 'string' && /^[a-zA-Z0-9_./-]+$/.test(item.path)
      && item.path.split('/').every((part) => part && part !== '.' && part !== '..'), 'Invalid model file path');
    const path = resolve(root, item.path);
    const inside = relative(root, path);
    assert(inside && !inside.startsWith('..') && !isAbsolute(inside), 'Model file escaped cache');
    assert(!lstatSync(path).isSymbolicLink() && lstatSync(path).isFile()
      && realpathSync(path) === path, 'Model file must be a regular cache file');
    assert(item.complete === true && Number.isSafeInteger(item.size) && item.size > 0
      && item.size <= 40_000_000 && item.loaded === item.size
      && /^[a-f0-9]{64}$/.test(item.sha256), 'Incomplete model file');
    const body = readFileSync(path);
    assert(body.length === item.size && sha(body) === item.sha256, 'Model file integrity mismatch');
    const url = `https://huggingface.co/${expected.repository}/resolve/${expected.revision}/${item.path}`;
    assert(!files.has(url), 'Duplicate model file');
    files.set(url, { body, sha256: item.sha256, path: item.path,
      contentType: item.path.endsWith('.json') ? 'application/json' : 'application/octet-stream' });
    bytes += body.length;
  }
  for (const name of expected.requiredFiles) {
    assert(files.has(`https://huggingface.co/${expected.repository}/resolve/${expected.revision}/${name}`), 'Missing required model file');
  }
  return { files, proof: { repository: expected.repository, revision: expected.revision,
    manifestSha256: expected.manifestSha256, fileCount: files.size, bytes } };
}
