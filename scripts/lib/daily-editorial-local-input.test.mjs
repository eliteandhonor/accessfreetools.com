import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, writeFileSync, mkdirSync, symlinkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { parsePilotArguments, loadLocalPilotFiles } from '../daily-editorial-pilot.mjs';
import { readPinnedPrivateInputBundle } from './daily-editorial-private-input.mjs';
import { loadPilotContextBundleFromFiles } from './daily-editorial-pilot-context.mjs';

const temporary = [];
afterEach(() => { for (const path of temporary.splice(0)) rmSync(path, { recursive: true, force: true }); });
const directory = () => { const path = mkdtempSync(join(tmpdir(), 'aft-local-input-test-')); temporary.push(path); return path; };
const entry = (file, text) => ({ file, bytes: Buffer.byteLength(text), sha256: createHash('sha256').update(text).digest('hex') });

describe('local recovery verification remains separate from runtime admission', () => {
  it('accepts explicit local descriptor/review files only with offline input verification', () => {
    expect(parsePilotArguments(['--verify-inputs=/tmp/bundle', '--descriptor=/tmp/descriptor.json', '--context-review=/tmp/review.json']))
      .toEqual({ mode: 'verify-inputs', directory: '/tmp/bundle', descriptorFile: '/tmp/descriptor.json', contextReviewFile: '/tmp/review.json' });
  });
  it.each([
    ['--run', '--descriptor=/tmp/descriptor.json'], ['--state-preflight', '--context-review=/tmp/review.json'],
    ['--offline', '--descriptor=/tmp/descriptor.json'], ['--verify-inputs=relative'],
    ['--verify-inputs=/tmp/bundle', '--descriptor=relative'], ['--verify-inputs=/tmp/bundle', '--unknown=/tmp/value'],
    ['--verify-inputs=/tmp/bundle', '--descriptor=/tmp/a', '--descriptor=/tmp/b'],
  ])('rejects invalid or runtime overrides %j', (...args) => {
    expect(() => parsePilotArguments(args)).toThrow('PILOT_ARGUMENT_INVALID');
  });
  it('preserves exact UTF-8 body bytes and rejects descriptor traversal before any body read', () => {
    const root = directory();
    const text = '\uFEFFExact synthetic evidence.\n';
    writeFileSync(join(root, 'evidence.txt'), text);
    expect(loadLocalPilotFiles(root, { files: [entry('evidence.txt', text)] })).toEqual({ 'evidence.txt': text });
    expect(() => loadLocalPilotFiles('/nonexistent-root', { files: [entry('missing.txt', text), entry('../outside.txt', text)] }))
      .toThrow('PILOT_DESCRIPTOR_INVALID');
  });
  it('requires every manifest-owned context source in the validated inventory', () => {
    const root = directory(); const text = 'Uninventoried synthetic evidence.\n';
    writeFileSync(join(root, 'extra.txt'), text);
    const files = {
      'source-manifest.json': JSON.stringify({ sources: [{ id: 'source-1', file: 'extra.txt' }] }),
      'evidence-contexts.json': '{}', 'public-claim-map.json': '{}', 'localsend-guide.md': 'Exact draft.\n',
    };
    expect(() => loadPilotContextBundleFromFiles(files)).toThrow('PILOT_INPUT_INVENTORY');
    expect(loadPilotContextBundleFromFiles({ ...files, 'extra.txt': text }).sourceTexts).toEqual({ 'source-1': text });
  });
  it('rejects symlink bodies and directories that resolve outside the selected bundle', () => {
    const root = directory(); const outside = directory(); const text = 'Synthetic outside evidence.\n';
    writeFileSync(join(outside, 'evidence.txt'), text);
    symlinkSync(join(outside, 'evidence.txt'), join(root, 'alias.txt'));
    symlinkSync(outside, join(root, 'linked'));
    for (const file of ['alias.txt', 'linked/evidence.txt']) expect(() => loadLocalPilotFiles(root, { files: [entry(file, text)] }))
      .toThrow('PILOT_INPUT_INVENTORY');
  });
  it('rejects mismatched size and non-file bodies before returning data', () => {
    const root = directory(); mkdirSync(join(root, 'directory.txt')); writeFileSync(join(root, 'evidence.txt'), 'different bytes');
    for (const file of ['evidence.txt', 'directory.txt']) expect(() => loadLocalPilotFiles(root, { files: [entry(file, 'x')] }))
      .toThrow('PILOT_INPUT_INVENTORY');
  });
});

describe('private v3 input prefix stays exact and bounded', () => {
  it.each(['v1', 'v2', 'v3'])('reads only the declared %s path with repeated private checks', async (version) => {
    const commit = 'a'.repeat(40); const blob = 'b'.repeat(40); const content = Buffer.from('Synthetic frozen input.\n');
    const path = `inputs/localsend-held-pilot/${version}/evidence.txt`;
    let checks = 0;
    const result = await readPinnedPrivateInputBundle({ commit, files: [path], fetchUrl: 'unused-fixture',
      verifyPrivateRepository: async () => { checks += 1; },
      git: async (args) => {
        if (args[0] === 'fetch' || args[0] === 'update-ref') return { output: '' };
        if (args[0] === 'rev-parse') return { output: commit };
        if (args[0] === 'ls-tree') return { output: Buffer.from(`100644 blob ${blob}\t${path}\0`) };
        if (args[1] === '-t') return { output: 'commit' };
        if (args[1] === '-s') return { output: String(content.length) };
        if (args[1] === 'blob') return { output: content };
        throw new Error('Unexpected fixture operation');
      } });
    expect(result.files[path]).toBe(content.toString());
    expect(checks).toBe(2);
  });
  it.each([
    ['inputs/localsend-held-pilot/v3/../outside.txt'], ['inputs/localsend-held-pilot/v3evil/evidence.txt'],
    ['inputs/localsend-held-pilot/v4/evidence.txt'],
    ['inputs/localsend-held-pilot/v3/evidence.txt', 'inputs/localsend-held-pilot/v2/evidence.txt'],
  ])('rejects unapproved or mixed paths %j before transport', async (...files) => {
    let contacted = false;
    await expect(readPinnedPrivateInputBundle({ commit: 'a'.repeat(40), files,
      verifyPrivateRepository: async () => { contacted = true; }, git: async () => { contacted = true; }, fetchUrl: 'unused-fixture' }))
      .rejects.toMatchObject({ code: 'PRIVATE_INPUT_INVENTORY_INVALID' });
    expect(contacted).toBe(false);
  });
});
