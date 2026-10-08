import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { DailyEditorialArticle } from '../../src/data/dailyEditorialArticles';
import { editorialArticlePaths } from '../../scripts/lib/article-visual-routes.mjs';
import { createDailyEditorialAssets } from '../../scripts/lib/daily-editorial-assets.mjs';
import { renderDailyEditorialFixture } from './dailyEditorialFixture';

const exec = promisify(execFile);
const checker = resolve('scripts/check-article-visual-layout.mjs');
const temporaryRoots: string[] = [];
const article: DailyEditorialArticle = {
  schemaVersion: 1, slug: 'synthetic-daily-visual',
  title: 'Compare two local files before replacing the working copy',
  summary: 'A synthetic offline visual test, never a public recommendation.',
  problem: 'You need to see which lines changed in a local text file.',
  project: { fullName: 'fixture/comparison', url: 'https://github.com/fixture/comparison', commit: 'a'.repeat(40), license: 'MIT', release: null },
  researchedAt: '2026-10-08T09:50:00.000Z', publishedAt: '2026-10-08T10:20:00.000Z',
  sections: [{ heading: 'Compare the files', paragraphs: [{ text: 'This explanation is a synthetic fixture for the actual article layout.', sourceIds: ['readme'] }] }],
  sources: ['readme', 'license'].map((kind) => ({ id: kind, kind: kind as 'readme' | 'license',
    url: `https://github.com/fixture/comparison/blob/${'a'.repeat(40)}/${kind}`,
    fetchedAt: '2026-10-08T09:40:00.000Z', sha256: 'b'.repeat(64) })),
};
let rendered: string;

beforeAll(async () => { rendered = (await renderDailyEditorialFixture(article)).html; });
afterAll(async () => { await Promise.all(temporaryRoots.map((root) => rm(root, { recursive: true, force: true }))); });

async function fixture(clipped = false) {
  const root = await mkdtemp(join(tmpdir(), 'aft-daily-visual-'));
  temporaryRoots.push(root);
  const dist = join(root, 'dist');
  const catalogPath = join(root, 'src/data/dailyEditorialArticles.json');
  await mkdir(join(root, 'src/data'), { recursive: true });
  await mkdir(join(dist, 'blog', article.slug), { recursive: true });
  await mkdir(join(dist, 'blog', 'existing-owner-article'), { recursive: true });
  await writeFile(catalogPath, JSON.stringify([article]));
  await writeFile(join(dist, 'index.html'), '<!doctype html><title>Offline test root</title>');
  await createDailyEditorialAssets(article, { outputDir: join(dist, 'social') });
  // Browser code and external services are disabled. Actual component markup,
  // unmodified source CSS and the real generated daily hero remain in the page.
  const html = rendered.replace('<head>', '<head><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; img-src \'self\' data:; font-src \'none\'">');
  expect(html).toContain('data-fixture-real-css');
  expect(html).toContain('.editorial-article-header h1');
  const badStyle = '<style>.editorial-article-header h1{width:160px;white-space:nowrap;overflow:hidden}</style>';
  await writeFile(join(dist, 'blog', article.slug, 'index.html'), clipped ? html.replace('</head>', `${badStyle}</head>`) : html);
  // A healthy existing article keeps the old-only checker running. Before the
  // fix it would pass while silently skipping the clipped daily article.
  await writeFile(join(dist, 'blog', 'existing-owner-article', 'index.html'),
    html.replace(`data-daily-editorial="${article.slug}"`, 'data-editorial-slug="existing-owner-article"'));
  return { root, dist, catalogPath };
}

async function runChecker(root: string) {
  let code = 0;
  try { await exec(process.execPath, [checker], { cwd: root, timeout: 30_000 }); }
  catch (error) {
    const failure = error as { code?: number; stdout?: string; stderr?: string };
    if (typeof failure.code !== 'number') throw error;
    code = failure.code;
  }
  const report = JSON.parse(await readFile(join(root, 'output/article-visual-layout/latest.json'), 'utf8'));
  return { code, report };
}

describe('actual daily route visual coverage', () => {
  it('discovers daily catalog routes without granting an owner-approval marker', async () => {
    const { dist, catalogPath } = await fixture();
    const paths = editorialArticlePaths({ root: dist, catalogPath });
    expect(paths.map((entry: { route: string }) => entry.route)).toEqual([
      '/blog/existing-owner-article/', `/blog/${article.slug}/`,
    ]);
    expect(await readFile(join(dist, 'blog', article.slug, 'index.html'), 'utf8')).not.toContain('data-editorial-slug');
  });

  it('fails instead of silently skipping a catalog page missing its built daily marker', async () => {
    const { dist, catalogPath } = await fixture();
    const htmlPath = join(dist, 'blog', article.slug, 'index.html');
    await writeFile(htmlPath, rendered.replace(`data-daily-editorial="${article.slug}"`, ''));
    expect(() => editorialArticlePaths({ root: dist, catalogPath })).toThrow('missing its built route or marker');
    await rm(htmlPath);
    expect(() => editorialArticlePaths({ root: dist, catalogPath })).toThrow('missing its built route or marker');
  });

  it('checks real daily CSS, generated hero and readable layout at all four existing viewports', async () => {
    const { root } = await fixture();
    const { code, report } = await runChecker(root);
    expect(code, JSON.stringify(report)).toBe(0);
    expect(report.articles).toHaveLength(2);
    const daily = report.articles.find((entry: { slug: string }) => entry.slug === article.slug);
    expect(daily.viewports.map((view: { name: string }) => view.name)).toEqual(['desktop', 'laptop', 'tablet', 'mobile']);
    for (const view of daily.viewports) {
      expect(view.pass).toBe(true);
      expect(view.failures).toEqual([]);
      expect(view.horizontalOverflow).toBe(false);
      expect(view.sourceLinks).toBeGreaterThanOrEqual(3);
    }
  }, 30_000);

  it('fails a clipped daily H1 even when the existing owner page passes', async () => {
    const { root } = await fixture(true);
    const { code, report } = await runChecker(root);
    expect(code).toBe(1);
    expect(report.articles).toHaveLength(2);
    const daily = report.articles.find((entry: { slug: string }) => entry.slug === article.slug);
    for (const name of ['desktop', 'mobile']) {
      const view = daily.viewports.find((item: { name: string }) => item.name === name);
      expect(view.pass).toBe(false);
      expect(view.failures).toContain('article H1 text escapes its container');
    }
    const legacy = report.articles.find((entry: { slug: string }) => entry.slug === 'existing-owner-article');
    expect(legacy.viewports.every((view: { pass: boolean }) => view.pass)).toBe(true);
  }, 30_000);
});
