import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

function readJson(path) {
  return JSON.parse(readFileSync(resolve(path), 'utf8'));
}

describe('security dependency overrides', () => {
  it.each([
    ['fast-uri', '4.1.3'],
    ['qs', '6.16.0'],
  ])('keeps every locked %s installation on the reviewed patched release', (name, version) => {
    const packageJson = readJson('package.json');
    const packageLock = readJson('package-lock.json');
    const installs = Object.entries(packageLock.packages).filter(([path]) =>
      path.endsWith(`node_modules/${name}`),
    );

    expect(packageJson.overrides?.[name]).toBe(version);
    expect(installs.length).toBeGreaterThan(0);
    for (const [, installed] of installs) expect(installed.version).toBe(version);
  });

  it('keeps the patched adm-zip release under onnxruntime-node', () => {
    const packageJson = readJson('package.json');
    const packageLock = readJson('package-lock.json');

    expect(packageJson.overrides?.['onnxruntime-node']?.['adm-zip']).toBe('0.6.0');
    expect(packageLock.packages?.['node_modules/adm-zip']?.version).toBe('0.6.0');
  });
});
