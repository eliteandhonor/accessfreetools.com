import { it, expect } from 'vitest';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { stagePublication, publicArticle, createGitPublisher } from './daily-editorial-publication.mjs';
import { fixtureArticle, fixtureNow } from './daily-editorial-fixtures.mjs';
import { articleHash, semanticRequest } from './daily-editorial-checks.mjs';
import { prepareSyntheticDailyArtwork } from '../../tests/fixtures/dailyEditorialArtwork.mjs';
import { artworkJsonHash } from './daily-editorial-artwork.mjs';

const reviewedFixture = (article) => ({ deterministic: { passed: true },
  ollamaReview: { allClaimsCovered: true, practical: true, noInventedTesting: true, licenseClear: true, original: true, clear: true, issues: [] },
  semanticReview: { articleSha256: articleHash(article), claims: semanticRequest(article, []).claims.map(({ id }) => ({ id, status: 'supported', supported: 1, confidence: 1 })), clarity: 1, duplicate: 0 } });

it('stages a complete public record with exact synthetic approved image bytes and no copied source text', async () => {
  const root = await mkdtemp(join(tmpdir(), 'aft-stage-'));
  try {
    await mkdir(join(root, 'src/data'), { recursive: true }); await writeFile(join(root, 'src/data/dailyEditorialArticles.json'), '[]');
    const approval = await prepareSyntheticDailyArtwork(root, fixtureArticle(), articleHash(fixtureArticle()));
    const result = await stagePublication({ root, article: fixtureArticle(), record: reviewedFixture(fixtureArticle()), publishedAt: fixtureNow.toISOString(), activationReview: 'fixture-only' });
    expect(result.paths).toHaveLength(4);
    const catalog = JSON.parse(await readFile(join(root, result.paths[0]), 'utf8'));
    expect(catalog[0].sources[0]).not.toHaveProperty('text'); expect(catalog[0].sections[0].paragraphs[0]).not.toHaveProperty('evidence');
    expect(result.receipt.publicSha256).toHaveLength(64);
    expect(result.receipt.artworkApproval.sha256).toBe(artworkJsonHash(approval));
    expect(catalog[0].artwork.articleSha256).toBe(articleHash(fixtureArticle()));
    await expect(stagePublication({ root, article: fixtureArticle(), record: {}, publishedAt: fixtureNow.toISOString() })).rejects.toMatchObject({ code: 'PUBLICATION_CHECK_HELD' });
  } finally { await rm(root, { recursive: true, force: true }); }
});

it('refuses to create a live publisher without reviewed activation', () => {
  expect(() => createGitPublisher({ root: '.', config: { enabled: false } })).toThrow('PUBLICATION_NOT_ACTIVATED');
});

it('rejects partial semantic coverage before staging or exposing any article', async () => {
  const root = await mkdtemp(join(tmpdir(), 'aft-partial-stage-'));
  try {
    await mkdir(join(root, 'src/data'), { recursive: true }); await writeFile(join(root, 'src/data/dailyEditorialArticles.json'), '[]');
    const article = fixtureArticle(), record = reviewedFixture(article);
    record.semanticReview.claims = record.semanticReview.claims.slice(0, 1);
    await expect(stagePublication({ root, article, record, publishedAt: fixtureNow.toISOString() })).rejects.toMatchObject({ code: 'PUBLICATION_REVIEW_INCOMPLETE' });
    expect(JSON.parse(await readFile(join(root, 'src/data/dailyEditorialArticles.json'), 'utf8'))).toEqual([]);
  } finally { await rm(root, { recursive: true, force: true }); }
});

it('artifact gate rejects a receipt missing public-string assessments', async () => {
  const root = await mkdtemp(join(tmpdir(), 'aft-partial-receipt-'));
  try {
    await mkdir(join(root, 'src/data'), { recursive: true }); await writeFile(join(root, 'src/data/dailyEditorialArticles.json'), '[]');
    const article = fixtureArticle();
    await prepareSyntheticDailyArtwork(root, article, articleHash(article));
    const staged = await stagePublication({ root, article, record: reviewedFixture(article), publishedAt: fixtureNow.toISOString(), activationReview: 'fixture' });
    const checker = fileURLToPath(new URL('../check-daily-editorial.mjs', import.meta.url));
    execFileSync(process.execPath, [checker], { cwd: root });
    staged.receipt.semanticReview.claims = staged.receipt.semanticReview.claims.slice(0, 1);
    await writeFile(join(root, staged.paths[1]), JSON.stringify(staged.receipt));
    expect(() => execFileSync(process.execPath, [checker], { cwd: root, stdio: 'pipe' })).toThrow();
  } finally { await rm(root, { recursive: true, force: true }); }
});

it('public projection keeps actual publication time and evidence hashes', () => {
  const projected = publicArticle(fixtureArticle(), fixtureNow.toISOString());
  expect(projected.publishedAt).toBe(fixtureNow.toISOString()); expect(projected.sources.every((s) => s.sha256.length === 64)).toBe(true);
});

it('holds extra private reviewer fields before creating public content', async () => {
  const root = await mkdtemp(join(tmpdir(), 'aft-private-review-'));
  try {
    await mkdir(join(root, 'src/data'), { recursive: true }); await writeFile(join(root, 'src/data/dailyEditorialArticles.json'), '[]');
    const article = fixtureArticle(), record = reviewedFixture(article);
    record.ollamaReview.privateReviewerNotes = 'PRIVATE_UNAPPROVED_DRAFT_MARKER';
    await expect(stagePublication({ root, article, record, publishedAt: fixtureNow.toISOString(), activationReview: 'fixture' })).rejects.toMatchObject({ code: 'PUBLICATION_REVIEW_INCOMPLETE' });
    expect(JSON.parse(await readFile(join(root, 'src/data/dailyEditorialArticles.json'), 'utf8'))).toEqual([]);
  } finally { await rm(root, { recursive: true, force: true }); }
});

it('projects only intentional deterministic fields into the approved public receipt', async () => {
  const root = await mkdtemp(join(tmpdir(), 'aft-public-review-'));
  try {
    await mkdir(join(root, 'src/data'), { recursive: true }); await writeFile(join(root, 'src/data/dailyEditorialArticles.json'), '[]');
    const article = fixtureArticle(), record = reviewedFixture(article);
    record.deterministic.privateEvidence = 'PRIVATE_UNAPPROVED_DRAFT_MARKER';
    await prepareSyntheticDailyArtwork(root, article, articleHash(article));
    const result = await stagePublication({ root, article, record, publishedAt: fixtureNow.toISOString(), activationReview: 'fixture' });
    expect(JSON.stringify(result.receipt)).not.toContain('PRIVATE_UNAPPROVED_DRAFT_MARKER');
    expect(result.receipt.deterministic).toEqual({ passed: true });
  } finally { await rm(root, { recursive: true, force: true }); }
});

it('holds missing artwork approval before creating public assets, receipt or catalog entry', async () => {
  const root = await mkdtemp(join(tmpdir(), 'aft-art-held-'));
  try {
    await mkdir(join(root, 'src/data'), { recursive: true });
    await writeFile(join(root, 'src/data/dailyEditorialArticles.json'), '[]');
    await writeFile(join(root, 'src/data/dailyEditorialArtApprovals.json'), '[]');
    const article = fixtureArticle();
    await expect(stagePublication({ root, article, record: reviewedFixture(article), publishedAt: fixtureNow.toISOString(), activationReview: 'fixture' })).rejects.toMatchObject({ code: 'ARTWORK_APPROVAL_HELD' });
    expect(await readFile(join(root, 'src/data/dailyEditorialArticles.json'), 'utf8')).toBe('[]');
    await expect(readFile(join(root, 'public/social', `daily-${article.slug}.png`))).rejects.toMatchObject({ code: 'ENOENT' });
    await expect(readFile(join(root, 'docs/daily-editorial-reviews', `${article.slug}.json`))).rejects.toMatchObject({ code: 'ENOENT' });
  } finally { await rm(root, { recursive: true, force: true }); }
});

it('artifact gate rejects edited served bytes and stale exact artwork receipt', async () => {
  const root = await mkdtemp(join(tmpdir(), 'aft-artifact-art-'));
  try {
    await mkdir(join(root, 'src/data'), { recursive: true }); await writeFile(join(root, 'src/data/dailyEditorialArticles.json'), '[]');
    const article = fixtureArticle();
    await prepareSyntheticDailyArtwork(root, article, articleHash(article));
    const staged = await stagePublication({ root, article, record: reviewedFixture(article), publishedAt: fixtureNow.toISOString(), activationReview: 'fixture' });
    const checker = fileURLToPath(new URL('../check-daily-editorial.mjs', import.meta.url));
    execFileSync(process.execPath, [checker], { cwd: root });
    const webpPath = join(root, 'public/social', `daily-${article.slug}.webp`);
    const original = await readFile(webpPath);
    await writeFile(webpPath, Buffer.concat([original, Buffer.from('synthetic-edited-byte')]));
    expect(() => execFileSync(process.execPath, [checker], { cwd: root, stdio: 'pipe' })).toThrow();
    await writeFile(webpPath, original);
    staged.receipt.artworkApproval.visualEvidenceSha256 = '0'.repeat(64);
    await writeFile(join(root, staged.paths[1]), JSON.stringify(staged.receipt));
    expect(() => execFileSync(process.execPath, [checker], { cwd: root, stdio: 'pipe' })).toThrow();
  } finally { await rm(root, { recursive: true, force: true }); }
});
