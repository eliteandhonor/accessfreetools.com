import { afterEach, describe, expect, it, vi } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { verifyDailyPublication, waitForDailyPublication, rollbackPublication } from './daily-editorial-live.mjs';

const ORIGIN = 'https://accessfreetools.com';
const commit = 'c'.repeat(40);
const article = {
  slug: 'offline-live-verification-fixture', title: 'Compare two local files',
  publishedAt: '2026-10-08T09:12:34.567Z',
  sources: [{ url: 'https://github.com/fixture/project/blob/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/README.md' }, { url: 'https://github.com/fixture/project/blob/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/LICENSE' }],
};
const canonical = `${ORIGIN}/blog/${article.slug}/`;
const imageUrl = `${ORIGIN}/social/daily-${article.slug}.png`;
const image = await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#eef7f6' } }).png().toBuffer();
const imageHash = createHash('sha256').update(image).digest('hex');
const encode = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const posting = {
  '@context': 'https://schema.org', '@type': 'BlogPosting', headline: article.title,
  mainEntityOfPage: canonical, image: imageUrl, datePublished: article.publishedAt, dateModified: article.publishedAt,
  author: { '@type': 'Organization', name: 'Access Free Tools', url: `${ORIGIN}/about/` }, citation: article.sources.map((source) => source.url),
};
function fixtureResponses({ mutatePosting, mutateHtml, mutateSitemap, mutateFeed, build = {}, replacementImage } = {}) {
  const schema = structuredClone(posting); mutatePosting?.(schema);
  let html = `<html><head><link rel="canonical" href="${canonical}"><meta property="og:image" content="${imageUrl}"><meta property="article:published_time" content="${article.publishedAt}"><meta property="article:modified_time" content="${article.publishedAt}"><script type="application/ld+json">${JSON.stringify(schema)}</script></head><body><article data-daily-editorial="${article.slug}"><h1>${article.title}</h1><img src="/social/daily-${article.slug}.png" width="1200" height="630" alt="Original conceptual diagram"><section class="editorial-disclosure">AI-assisted research. We did not install or run this software for the article.</section>${article.sources.map((source) => `<a href="${source.url}">Source</a>`).join('')}</article></body></html>`;
  html = mutateHtml?.(html) ?? html;
  let sitemap = `<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${canonical}</loc><lastmod>${article.publishedAt}</lastmod></url></urlset>`;
  sitemap = mutateSitemap?.(sitemap) ?? sitemap;
  let feed = `<?xml version="1.0"?><rss version="2.0"><channel><item><title>${encode(article.title)}</title><link>${canonical}</link><guid isPermaLink="true">${canonical}</guid><pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate></item></channel></rss>`;
  feed = mutateFeed?.(feed) ?? feed;
  return new Map([
    [`${ORIGIN}/_build.json`, { bytes: JSON.stringify({ schemaVersion: 1, commit, clean: true, builtAt: '2026-10-08T09:20:00.000Z', nodeMajor: 24, ...build }), type: 'application/json' }],
    [canonical, { bytes: html, type: 'text/html' }],
    [`${ORIGIN}/sitemap-blog.xml`, { bytes: sitemap, type: 'application/xml' }],
    [`${ORIGIN}/feed.xml`, { bytes: feed, type: 'application/rss+xml' }],
    [imageUrl, { bytes: replacementImage ?? image, type: 'image/png' }],
  ]);
}
function fetchFixture(responses = fixtureResponses()) {
  return vi.fn(async (url) => {
    const result = responses.get(url);
    if (!result) throw new Error('Unexpected URL in offline fixture');
    return new Response(result.bytes, { status: 200, headers: { 'content-type': result.type } });
  });
}

const temporary = [];
afterEach(async () => { vi.unstubAllEnvs(); await Promise.all(temporary.splice(0).map((path) => rm(path, { recursive: true, force: true }))); });

describe('read-only exact-commit live publication verification', () => {
  it('requires all page, metadata, discovery, identity and decoded image checks before success', async () => {
    const fetchImpl = fetchFixture();
    const result = await verifyDailyPublication({ article, commit, imageSha256: imageHash, fetchImpl });
    expect(result.verified).toBe(true); expect(result.issues).toEqual([]);
    expect(result.checks.imageSha256).toBe(imageHash);
    expect(result.checks).toMatchObject({ BUILD_IDENTITY: true, ARTICLE_SCHEMA: true, ARTICLE_DISCLOSURE: true, ARTICLE_SOURCES: true, SITEMAP_ENTRY: true, FEED_ENTRY: true, IMAGE_VALID: true, IMAGE_HASH: true });
    expect(fetchImpl.mock.calls.map(([url]) => url)).toEqual([...fixtureResponses().keys()]);
    for (const [, options] of fetchImpl.mock.calls) {
      expect(options).toMatchObject({ method: 'GET', credentials: 'omit', redirect: 'error', cache: 'no-store' });
      expect(options.signal).toBeInstanceOf(AbortSignal);
      expect(options.headers).not.toHaveProperty('Authorization');
    }
  });

  it.each([
    ['wrong commit', { build: { commit: 'd'.repeat(40) } }, 'BUILD_IDENTITY'],
    ['dirty build', { build: { clean: false } }, 'BUILD_IDENTITY'],
    ['wrong Node major', { build: { nodeMajor: 22 } }, 'BUILD_IDENTITY'],
    ['missing build time', { build: { builtAt: null } }, 'BUILD_IDENTITY'],
    ['wrong title', { mutateHtml: (html) => html.replace(`<h1>${article.title}`, '<h1>Different title') }, 'ARTICLE_H1'],
    ['wrong canonical', { mutateHtml: (html) => html.replace('rel="canonical" href="https://accessfreetools.com/', 'rel="canonical" href="https://example.org/') }, 'ARTICLE_CANONICAL'],
    ['noindex', { mutateHtml: (html) => html.replace('<head>', '<head><meta name="robots" content="noindex,follow">') }, 'ARTICLE_INDEXABLE'],
    ['owner experience instead of disclosure', { mutateHtml: (html) => html.replace('We did not install or run this software for the article.', 'I installed it yesterday.') }, 'ARTICLE_DISCLOSURE'],
    ['missing source link', { mutateHtml: (html) => html.replace(`<a href="${article.sources[1].url}">Source</a>`, '') }, 'ARTICLE_SOURCES'],
    ['invented author', { mutatePosting: (schema) => { schema.author = { '@type': 'Person', name: 'Owner' }; } }, 'ARTICLE_SCHEMA'],
    ['wrong schema image', { mutatePosting: (schema) => { schema.image = `${ORIGIN}/social/free-guides.png`; } }, 'ARTICLE_SCHEMA'],
    ['modified timestamp substituted', { mutatePosting: (schema) => { schema.datePublished = '2026-10-09T09:00:00.000Z'; } }, 'ARTICLE_SCHEMA'],
    ['missing sitemap entry', { mutateSitemap: (xml) => xml.replace(canonical, `${ORIGIN}/blog/different/`) }, 'SITEMAP_ENTRY'],
    ['wrong sitemap date', { mutateSitemap: (xml) => xml.replace(article.publishedAt, '2026-10-09') }, 'SITEMAP_ENTRY'],
    ['RSS artificial freshness', { mutateFeed: (xml) => xml.replace(new Date(article.publishedAt).toUTCString(), 'Fri, 09 Oct 2026 09:00:00 GMT') }, 'FEED_ENTRY'],
    ['missing RSS entry', { mutateFeed: (xml) => xml.replaceAll(canonical, `${ORIGIN}/blog/different/`) }, 'FEED_ENTRY'],
    ['malformed PNG', { replacementImage: Buffer.from('not PNG bytes') }, 'IMAGE_VALID'],
  ])('holds %s without reporting a public URL', async (_, options, issue) => {
    const result = await verifyDailyPublication({ article, commit, fetchImpl: fetchFixture(fixtureResponses(options)) });
    expect(result.verified).toBe(false); expect(result.issues).toContain(issue); expect(result).not.toHaveProperty('url');
  });

  it('holds an image hash mismatch, invalid slug, oversized response, redirects and stalled reads', async () => {
    expect((await verifyDailyPublication({ article, commit, imageSha256: '0'.repeat(64), fetchImpl: fetchFixture() })).issues).toContain('IMAGE_HASH');
    const noCall = vi.fn();
    expect((await verifyDailyPublication({ article: { ...article, slug: '../outside' }, commit, fetchImpl: noCall })).verified).toBe(false);
    expect(noCall).not.toHaveBeenCalled();
    for (const response of [
      new Response('{}', { status: 302, headers: { location: 'https://unrelated.example/' } }),
      new Response('{}', { headers: { 'content-type': 'application/json', 'content-length': '99999999' } }),
      new Response('{}', { headers: { 'content-type': 'application/jsonx' } }),
    ]) {
      const fetchImpl = fetchFixture(); fetchImpl.mockImplementationOnce(async () => response);
      expect((await verifyDailyPublication({ article, commit, fetchImpl })).verified).toBe(false);
      expect(fetchImpl).toHaveBeenCalledTimes(5);
    }
    const stalled = fetchFixture();
    stalled.mockImplementationOnce(async () => new Response(new ReadableStream({ start() {} }), { headers: { 'content-type': 'application/json' } }));
    const result = await verifyDailyPublication({ article, commit, fetchImpl: stalled, timeoutMs: 20 });
    expect(result.issues).toContain('BUILD_TIMEOUT');
  });

  it('polls bounded read-only checks and exposes the exact URL only after success', async () => {
    const failing = fixtureResponses({ build: { commit: 'd'.repeat(40) } });
    const good = fixtureResponses();
    let calls = 0;
    const fetchImpl = vi.fn(async (url) => {
      const data = (calls++ < 5 ? failing : good).get(url);
      return new Response(data.bytes, { headers: { 'content-type': data.type } });
    });
    const waitImpl = vi.fn(async () => {});
    const verified = await waitForDailyPublication({ article, commit, fetchImpl, attempts: 3, delayMs: 5, waitImpl });
    expect(verified).toMatchObject({ verified: true, attempts: 2, url: canonical });
    expect(waitImpl).toHaveBeenCalledExactlyOnceWith(5);
    const held = await waitForDailyPublication({ article, commit, fetchImpl: fetchFixture(failing), attempts: 2, delayMs: 0, waitImpl });
    expect(held.verified).toBe(false); expect(held).not.toHaveProperty('url');
    await expect(waitForDailyPublication({ attempts: 31 })).rejects.toMatchObject({ code: 'LIVE_POLL_INPUT_INVALID' });
    await expect(waitForDailyPublication({ delayMs: 60001 })).rejects.toMatchObject({ code: 'LIVE_POLL_INPUT_INVALID' });
  });
});

function git(root, args) { return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim(); }
async function rollbackFixture({ withUnrelatedChange = false } = {}) {
  const directory = await mkdtemp(join(tmpdir(), 'aft-editorial-rollback-test-')); temporary.push(directory);
  const root = join(directory, 'clone'); const remote = join(directory, 'remote.git');
  await mkdir(root); await mkdir(remote);
  git(remote, ['init', '--bare', '--initial-branch=main']);
  git(root, ['init', '--initial-branch=main']);
  git(root, ['config', 'user.name', 'Offline Fixture']); git(root, ['config', 'user.email', 'fixture@example.invalid']);
  git(root, ['remote', 'add', 'origin', remote]);
  const config = { schemaVersion: 1, repository: 'eliteandhonor/accessfreetools.com', enabled: true, publicationEnabled: true, activationReview: 'offline-fixture-only', sharedBudgetAllocation: 'offline-fixture-only' };
  await mkdir(join(root, 'config')); await mkdir(join(root, 'src/data'), { recursive: true }); await mkdir(join(root, 'docs/daily-editorial-reviews'), { recursive: true });
  await writeFile(join(root, 'config/daily-editorial.json'), JSON.stringify(config));
  await writeFile(join(root, 'src/data/dailyEditorialArticles.json'), '[]');
  const security = '{"dependencies":{"@modelcontextprotocol/sdk":"1.31.0"}}\n';
  await writeFile(join(root, 'package.json'), security);
  git(root, ['add', '.']); git(root, ['commit', '-m', 'Offline base with preserved security dependency']);
  const base = git(root, ['rev-parse', 'HEAD']);
  await writeFile(join(root, 'src/data/dailyEditorialArticles.json'), JSON.stringify([article]));
  await writeFile(join(root, `docs/daily-editorial-reviews/${article.slug}.json`), JSON.stringify({ slug: article.slug, publishedAt: article.publishedAt }));
  if (withUnrelatedChange) await writeFile(join(root, 'package.json'), `${security}\n`);
  git(root, ['add', '.']); git(root, ['commit', '-m', 'Offline atomic publication']);
  const published = git(root, ['rev-parse', 'HEAD']);
  git(root, ['push', 'origin', 'HEAD:refs/heads/main']);
  return { root, remote, config, base, published, security };
}

describe('guarded latest-publication rollback using local bare fixtures only', () => {
  it('reverts both article files atomically while preserving unrelated security code', async () => {
    const fixture = await rollbackFixture();
    const result = await rollbackPublication({ root: fixture.root, commit: fixture.published, config: fixture.config, fixtureRemote: fixture.remote });
    expect(result).toMatchObject({ rolledBack: true, revertedCommit: fixture.published, slug: article.slug, liveVerified: false });
    expect(git(fixture.remote, ['rev-parse', 'refs/heads/main'])).toBe(result.commit);
    expect(git(fixture.remote, ['show', 'main:src/data/dailyEditorialArticles.json'])).toBe('[]');
    expect(() => git(fixture.remote, ['show', `main:docs/daily-editorial-reviews/${article.slug}.json`])).toThrow();
    expect(git(fixture.remote, ['show', 'main:package.json'])).toBe(fixture.security.trim());
    expect(git(fixture.remote, ['diff', '--name-only', fixture.base, 'main'])).toBe('');
    expect(git(fixture.root, ['rev-parse', 'HEAD'])).toBe(fixture.published);
    expect(await readFile(join(fixture.root, 'package.json'), 'utf8')).toBe(fixture.security);
  });

  it('stops if main moved or the publication also changed unrelated code', async () => {
    const moved = await rollbackFixture();
    await writeFile(join(moved.root, 'unrelated.txt'), 'Offline later work');
    git(moved.root, ['add', '.']); git(moved.root, ['commit', '-m', 'Offline later work']); git(moved.root, ['push', 'origin', 'HEAD:refs/heads/main']);
    const latest = git(moved.remote, ['rev-parse', 'main']);
    await expect(rollbackPublication({ root: moved.root, commit: moved.published, config: moved.config, fixtureRemote: moved.remote })).rejects.toMatchObject({ code: 'MAIN_MOVED' });
    expect(git(moved.remote, ['rev-parse', 'main'])).toBe(latest);
    const mixed = await rollbackFixture({ withUnrelatedChange: true });
    await expect(rollbackPublication({ root: mixed.root, commit: mixed.published, config: mixed.config, fixtureRemote: mixed.remote })).rejects.toMatchObject({ code: 'ROLLBACK_NOT_SINGLE_ARTICLE' });
    expect(git(mixed.remote, ['rev-parse', 'main'])).toBe(mixed.published);
  });

  it('rejects inactive config, changed activation and an unexpected push destination before mutation', async () => {
    await expect(rollbackPublication({ root: '.', commit, config: { enabled: false } })).rejects.toMatchObject({ code: 'ROLLBACK_NOT_ACTIVATED' });
    const fixture = await rollbackFixture();
    await expect(rollbackPublication({ root: fixture.root, commit: fixture.published, config: { ...fixture.config, activationReview: 'different' }, fixtureRemote: fixture.remote })).rejects.toMatchObject({ code: 'ROLLBACK_ACTIVATION_CHANGED' });
    git(fixture.root, ['remote', 'set-url', '--push', 'origin', 'https://github.com/eliteandhonor/unrelated.git']);
    await expect(rollbackPublication({ root: fixture.root, commit: fixture.published, config: fixture.config, fixtureRemote: fixture.remote })).rejects.toMatchObject({ code: 'ROLLBACK_REPOSITORY_MISMATCH' });
    expect(git(fixture.remote, ['rev-parse', 'main'])).toBe(fixture.published);
  });

  it('reports an immutable rollback intent after a failed push and never retries', async () => {
    const fixture = await rollbackFixture();
    // Deliberately use the standard `false` executable for this local fixture's
    // receive-pack command. No network, credentials, or repository hooks run.
    git(fixture.root, ['config', 'remote.origin.receivepack', 'false']);
    let failure;
    try { await rollbackPublication({ root: fixture.root, commit: fixture.published, config: fixture.config, fixtureRemote: fixture.remote }); }
    catch (error) { failure = error; }
    expect(failure).toMatchObject({ code: 'ROLLBACK_PUSH_OUTCOME_UNKNOWN', revertedCommit: fixture.published });
    expect(failure.rollbackCommit).toMatch(/^[a-f0-9]{40}$/);
    expect(git(fixture.remote, ['rev-parse', 'main'])).toBe(fixture.published);
    expect(git(fixture.root, ['show', `${failure.rollbackCommit}:src/data/dailyEditorialArticles.json`])).toBe('[]');
  });
});
