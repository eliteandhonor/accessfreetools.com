import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { loadVerifiedModelCache } from './transcriber-model-cache.mjs';

const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const roots = [];
afterEach(() => roots.splice(0).forEach((root) => {
  const withinTemp = relative(resolve(tmpdir()), resolve(root));
  if (isAbsolute(withinTemp) || !/^aft-model-cache-[^\\/]+$/.test(withinTemp)) throw new Error('Unexpected cleanup target');
  rmSync(root, { recursive: true, force: true });
}));
function fixture(change = () => {}) {
  const root = mkdtempSync(join(tmpdir(), 'aft-model-cache-'));
  roots.push(root);
  const bytes = Buffer.from('synthetic model fixture');
  const file = { path: 'config.json', size: bytes.length, loaded: bytes.length, complete: true, sha256: sha(bytes) };
  const manifest = { repository: 'example/model', revision: 'a'.repeat(40), complete: true, files: [file] };
  change(manifest);
  writeFileSync(join(root, 'config.json'), bytes);
  const serialized = JSON.stringify(manifest);
  writeFileSync(join(root, 'manifest.json'), serialized);
  const expected = { repository: 'example/model', revision: 'a'.repeat(40), manifestSha256: sha(serialized), requiredFiles: ['config.json'] };
  return { root, expected, bytes };
}
describe('verified model cache for isolated browser proof', () => {
  it('serves only the exact pinned URL with verified immutable bytes', () => {
    const { root, expected, bytes } = fixture();
    const cache = loadVerifiedModelCache(root, expected);
    const url = `https://huggingface.co/example/model/resolve/${expected.revision}/config.json`;
    expect(cache.files.get(url).body).toEqual(bytes);
    expect(cache.files.get(`${url}?download=true`)).toBeUndefined();
    expect(cache.files.get(url.replace(expected.revision, 'main'))).toBeUndefined();
    writeFileSync(join(root, 'config.json'), 'changed after validation');
    expect(cache.files.get(url).body).toEqual(bytes);
    expect(cache.proof).toEqual({ repository: expected.repository, revision: expected.revision, manifestSha256: expected.manifestSha256, fileCount: 1, bytes: bytes.length });
  });
  it('rejects a changed manifest even when it describes locally matching bytes', () => {
    const { root, expected } = fixture();
    writeFileSync(join(root, 'manifest.json'), `${readFileSync(join(root, 'manifest.json'))} `);
    expect(() => loadVerifiedModelCache(root, expected)).toThrow(/manifest hash/i);
  });
  it('rejects changed file contents', () => {
    const { root, expected } = fixture();
    writeFileSync(join(root, 'config.json'), 'not the verified model');
    expect(() => loadVerifiedModelCache(root, expected)).toThrow(/file integrity/i);
  });
  it.each([
    (m) => { m.complete = false; },
    (m) => { m.repository = 'other/model'; },
    (m) => { m.revision = 'main'; },
    (m) => { m.files = []; },
    (m) => { m.files.push({ ...m.files[0] }); },
    (m) => { m.files[0].path = '../config.json'; },
    (m) => { m.files[0].path = 'C:/config.json'; },
    (m) => { m.files[0].path = 'onnx//config.json'; },
    (m) => { m.files[0].complete = false; },
    (m) => { m.files[0].loaded--; },
    (m) => { m.files[0].size = -1; },
    (m) => { m.files[0].sha256 = 'bad'; },
  ])('rejects malformed or incomplete cache metadata', (change) => {
    const { root, expected } = fixture(change);
    expect(() => loadVerifiedModelCache(root, expected)).toThrow();
  });
  it('rejects a directory in place of a model file', () => {
    const { root, expected } = fixture();
    rmSync(join(root, 'config.json'));
    mkdirSync(join(root, 'config.json'));
    expect(() => loadVerifiedModelCache(root, expected)).toThrow();
  });
});
