import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';

import AdmZip from 'adm-zip';
import sharp from 'sharp';

import { describe, expect, it } from 'vitest';

function readJson(path) {
  return JSON.parse(readFileSync(resolve(path), 'utf8'));
}

describe('security dependency overrides', () => {
  it.each([
    ['fast-uri', '4.1.3'],
    ['qs', '6.16.0'],
    ['hono', '4.13.5'],
    ['js-yaml', '4.3.2'],
    ['sharp', '0.35.4'],
    ['svgo', '4.1.0'],
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

    expect(packageJson.overrides?.['onnxruntime-node']?.['adm-zip']).toBe('0.6.1');
    expect(packageLock.packages?.['node_modules/adm-zip']?.version).toBe('0.6.1');
  });

  it.each([
    ['dependencies', 'astro', '7.2.8'],
    ['dependencies', 'nodemailer', '9.1.1'],
    ['devDependencies', 'vitest', '4.1.11'],
  ])('pins the reviewed %s %s release', (section, name, version) => {
    expect(readJson('package.json')[section][name]).toBe(version);
    expect(readJson('package-lock.json').packages[`node_modules/${name}`].version).toBe(version);
  });

  it('updates the Vitest mocker with its owning test runner', () => {
    expect(readJson('package-lock.json').packages['node_modules/@vitest/mocker'].version).toBe('4.1.11');
  });

  it('extracts normal files but refuses a destination directory link', () => {
    const parent = resolve('output/security-dependency-tests');
    mkdirSync(parent, { recursive: true });
    const root = mkdtempSync(join(parent, 'archive-'));
    const destination = join(root, 'destination');
    const outside = join(root, 'outside');
    const link = join(destination, 'linked');
    let linked = false;
    try {
      mkdirSync(destination);
      mkdirSync(outside);
      const normal = new AdmZip();
      normal.addFile('nested/example.txt', Buffer.from('safe archive fixture'));
      normal.extractAllTo(destination, true);
      expect(readFileSync(join(destination, 'nested/example.txt'), 'utf8')).toBe('safe archive fixture');

      writeFileSync(join(outside, 'sentinel.txt'), 'unchanged');
      symlinkSync(outside, link, process.platform === 'win32' ? 'junction' : 'dir');
      linked = true;
      const archive = new AdmZip();
      archive.addFile('linked/sentinel.txt', Buffer.from('must not overwrite'));
      expect(() => archive.extractAllTo(destination, true)).toThrow();
      expect(readFileSync(join(outside, 'sentinel.txt'), 'utf8')).toBe('unchanged');
    } finally {
      if (linked) unlinkSync(link);
      if (!resolve(root).startsWith(`${parent}${sep}`)) throw new Error('Unexpected fixture cleanup path');
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('uses patched libheif and round-trips an owned AVIF fixture', async () => {
    const heif = sharp.versions.heif.split('.').map(Number);
    expect(heif[0] > 1 || (heif[0] === 1 && (heif[1] > 23 || (heif[1] === 23 && heif[2] >= 2)))).toBe(true);
    const avif = await sharp({ create: { width: 16, height: 16, channels: 3, background: '#16756b' } }).avif().toBuffer();
    const { data, info } = await sharp(avif).raw().toBuffer({ resolveWithObject: true });
    expect(info.width).toBe(16);
    expect(info.height).toBe(16);
    expect(data.length).toBe(16 * 16 * info.channels);
  });
});
