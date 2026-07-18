import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

function readJson(path) {
  return JSON.parse(readFileSync(resolve(path), 'utf8'));
}

describe('security dependency overrides', () => {
  it('keeps the patched adm-zip release under onnxruntime-node', () => {
    const packageJson = readJson('package.json');
    const packageLock = readJson('package-lock.json');

    expect(packageJson.overrides?.['onnxruntime-node']?.['adm-zip']).toBe('0.6.0');
    expect(packageLock.packages?.['node_modules/adm-zip']?.version).toBe('0.6.0');
  });
});
