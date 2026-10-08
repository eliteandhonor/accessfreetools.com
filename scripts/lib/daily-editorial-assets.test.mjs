import { afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { buildDailyEditorialSvg, createDailyEditorialAssets } from './daily-editorial-assets.mjs';

const directories = [];
const article = { slug: 'synthetic-compare-files', problem: 'Compare two text files before applying a change.', project: { fullName: 'fixture/compare' } };
afterEach(async () => { await Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true, force: true }))); });

describe('original daily editorial diagrams', () => {
  it('generates two deterministic 1200x630 files in explicit staging only', async () => {
    const outputDir = await mkdtemp(join(tmpdir(), 'aft-daily-art-')); directories.push(outputDir);
    const first = await createDailyEditorialAssets(article, { outputDir });
    const second = await createDailyEditorialAssets(article, { outputDir });
    expect(first).toEqual(second);
    expect(await readdir(outputDir)).toEqual(['daily-synthetic-compare-files.png', 'daily-synthetic-compare-files.webp']);
    for (const file of first.files) {
      const bytes = await readFile(file.path);
      const metadata = await sharp(bytes).metadata();
      expect({ width: metadata.width, height: metadata.height }).toEqual({ width: 1200, height: 630 });
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(file.sha256);
    }
    expect(first.imagePath).toBe('/social/daily-synthetic-compare-files.png');
    expect(first.caption).toContain('not a project screenshot or a test result');
  });

  it('escapes source text and includes no copied or remote image references', () => {
    const svg = buildDailyEditorialSvg({ ...article, problem: '<script>alert("x")</script> & text' });
    expect(svg).not.toContain('<script>');
    expect(svg).toContain('&lt;script&gt;');
    expect(svg).toContain('&amp;');
    expect(svg).not.toMatch(/(?:href=|<image|https:\/\/github)/);
    expect(buildDailyEditorialSvg({ ...article, problem: 'A different practical problem.' })).not.toEqual(buildDailyEditorialSvg(article));
  });

  it('requires explicit staging and prevents image filename traversal', async () => {
    await expect(createDailyEditorialAssets(article)).rejects.toThrow('explicit staging');
    expect(() => buildDailyEditorialSvg({ ...article, slug: '../outside' })).toThrow('slug');
  });
});
