import { afterEach, describe, expect, it } from 'vitest';
import { mkdir, mkdtemp, readFile, readdir, readlink, rename, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { createDailyEditorialAssets, verifyDailyEditorialArtwork, auditDailyEditorialPublicAssets } from './daily-editorial-assets.mjs';
import { articleHash } from './daily-editorial-checks.mjs';
import { validDailyArtworkApproval } from './daily-editorial-artwork.mjs';
import { fixtureArticle } from './daily-editorial-fixtures.mjs';
import { prepareSyntheticDailyArtwork, syntheticDailyArtworkEvidence } from '../../tests/fixtures/dailyEditorialArtwork.mjs';

const directories = [];
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const held = { code: 'ARTWORK_APPROVAL_HELD' };
const manifest = (root) => join(root, 'src/data/dailyEditorialArtApprovals.json');
afterEach(async () => { await Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true, force: true }))); });

async function temporaryRoot() {
  const root = await mkdtemp(join(tmpdir(), 'aft-daily-art-test-'));
  directories.push(root);
  return root;
}

function boundFixture() {
  const draft = fixtureArticle();
  return { ...draft, publishedAt: draft.researchedAt, artwork: { articleSha256: articleHash(draft) } };
}

async function prepared() {
  const root = await temporaryRoot(), article = boundFixture();
  const approval = await prepareSyntheticDailyArtwork(root, article);
  return { root, article, approval };
}

async function snapshot(root) {
  const result = {};
  async function visit(directory, prefix = '') {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const name = prefix + entry.name, path = join(directory, entry.name);
      if (entry.isSymbolicLink()) result[name] = { symlink: await readlink(path) };
      else if (entry.isDirectory()) { result[name + '/'] = 'directory'; await visit(path, name + '/'); }
      else result[name] = hash(await readFile(path));
    }
  }
  await visit(root);
  return result;
}

async function expectHeldWithoutWrites(root, article) {
  const before = await snapshot(root);
  await expect(verifyDailyEditorialArtwork(article, { root })).rejects.toMatchObject(held);
  await expect(createDailyEditorialAssets(article, { root })).rejects.toMatchObject(held);
  expect(await snapshot(root)).toEqual(before);
}

async function saveApproval(root, approval, { evidence = false } = {}) {
  if (evidence) {
    const records = syntheticDailyArtworkEvidence(approval);
    const generation = json(records.generation), review = json(records.visualReview);
    approval.provenance.evidenceSha256 = hash(generation);
    approval.visualReview.evidenceSha256 = hash(review);
    await writeFile(join(root, approval.provenance.evidencePath), generation);
    await writeFile(join(root, approval.visualReview.evidencePath), review);
  }
  await writeFile(manifest(root), json([approval]));
}

async function replacePng(root, article, approval, bytes) {
  await writeFile(join(root, 'src/assets/daily-editorial', `${article.slug}.png`), bytes);
  approval.assets.png = { bytes: bytes.length, sha256: hash(bytes) };
  approval.visualReview.pngSha256 = hash(bytes);
  await saveApproval(root, approval, { evidence: true });
}

describe('daily artwork approval and exact prepared-byte staging', () => {
  it('copies the verified pair unchanged with its exact approval and descriptive metadata', async () => {
    const { root, article, approval } = await prepared();
    const original = await Promise.all(['png', 'webp'].map((extension) => readFile(join(root, 'src/assets/daily-editorial', `${article.slug}.${extension}`))));
    const before = await snapshot(root);
    await verifyDailyEditorialArtwork(article, { root, articleSha256: article.artwork.articleSha256 });
    expect(await snapshot(root)).toEqual(before);
    const result = await createDailyEditorialAssets(article, { root, articleSha256: article.artwork.articleSha256 });
    expect(result.approval).toEqual(approval);
    expect(result.imagePath).toBe(approval.imagePath);
    expect(result.webpPath).toBe(approval.webpPath);
    expect(result.alt).toBe(approval.alt);
    expect(result.caption).toBe(approval.caption);
    expect(await readdir(join(root, 'public/social'))).toEqual([`daily-${article.slug}.png`, `daily-${article.slug}.webp`]);
    for (const [index, extension] of ['png', 'webp'].entries()) {
      const bytes = await readFile(join(root, 'public/social', `daily-${article.slug}.${extension}`));
      expect(bytes.equals(original[index])).toBe(true);
      expect(hash(bytes)).toBe(approval.assets[extension].sha256);
      const metadata = await sharp(bytes).metadata();
      expect({ format: metadata.format, width: metadata.width, height: metadata.height }).toEqual({ format: extension, width: 1200, height: 630 });
    }
  });

  it('holds missing or empty approval manifests before creating any public paths', async () => {
    const root = await temporaryRoot(), article = boundFixture();
    await expectHeldWithoutWrites(root, article);
    await mkdir(join(root, 'src/data'), { recursive: true });
    await writeFile(manifest(root), '[]\n');
    await expectHeldWithoutWrites(root, article);
  });

  it.each([
    ['queued', (a) => { a.status = 'queued'; }], ['rejected', (a) => { a.status = 'rejected'; }],
    ['unreviewed', (a) => { a.qaStatus = 'needs-review'; }], ['wrong article', (a) => { a.articleSha256 = 'b'.repeat(64); }],
    ['wrong content', (a) => { a.publicContentSha256 = 'b'.repeat(64); }], ['wrong project', (a) => { a.projectFullName = 'synthetic/other-project'; }],
    ['unsafe image path', (a) => { a.imagePath = '/social/../outside.png'; }], ['duplicate entry', (a) => a],
  ])('holds %s metadata without writing or silently choosing another approval', async (name, mutate) => {
    const { root, article, approval } = await prepared();
    mutate(approval);
    await writeFile(manifest(root), json(name === 'duplicate entry' ? [approval, structuredClone(approval)] : [approval]));
    await expectHeldWithoutWrites(root, article);
  });

  it('holds authored-content changes and explicit accepted-article identity changes', async () => {
    const { root, article } = await prepared();
    await expectHeldWithoutWrites(root, { ...article, title: 'A different article title' });
    const before = await snapshot(root);
    await expect(createDailyEditorialAssets(article, { root, articleSha256: 'd'.repeat(64) })).rejects.toMatchObject(held);
    expect(await snapshot(root)).toEqual(before);
  });

  it('does not ignore malformed unrelated records in the committed approval manifest', async () => {
    const { root, article, approval } = await prepared();
    const unrelated = { ...structuredClone(approval), slug: 'synthetic-unrelated-article', projectFullName: [approval.projectFullName] };
    await writeFile(manifest(root), json([approval, unrelated]));
    await expectHeldWithoutWrites(root, article);
  });

  it.each([
    ['project name', (a) => { a.projectFullName = [a.projectFullName]; }],
    ['article hash', (a) => { a.articleSha256 = [a.articleSha256]; }],
    ['content hash', (a) => { a.publicContentSha256 = [a.publicContentSha256]; }],
    ['PNG hash', (a) => { a.assets.png.sha256 = [a.assets.png.sha256]; }],
    ['prompt hash', (a) => { a.provenance.promptSha256 = [a.provenance.promptSha256]; }],
    ['original image hash', (a) => { a.provenance.originalAssetSha256 = [a.provenance.originalAssetSha256]; }],
    ['generation evidence hash', (a) => { a.provenance.evidenceSha256 = [a.provenance.evidenceSha256]; }],
    ['visual evidence hash', (a) => { a.visualReview.evidenceSha256 = [a.visualReview.evidenceSha256]; }],
  ])('rejects array coercion for %s at metadata admission and before writing', async (_name, mutate) => {
    const { root, article, approval } = await prepared();
    mutate(approval);
    expect(validDailyArtworkApproval(approval)).toBe(false);
    await saveApproval(root, approval);
    await expectHeldWithoutWrites(root, article);
  });

  it.each(['human', 'synthetic'])('rejects %s artwork provenance even when its evidence is internally consistent', async (generator) => {
    const { root, article, approval } = await prepared();
    approval.provenance.generator = generator;
    await saveApproval(root, approval, { evidence: true });
    await expectHeldWithoutWrites(root, article);
  });

  it('requires all visual-review checks for the exact final pair', async () => {
    const { root, article, approval } = await prepared();
    approval.visualReview.checks.fullBodyUncropped = false;
    await saveApproval(root, approval, { evidence: true });
    await expectHeldWithoutWrites(root, article);
    approval.visualReview.checks.fullBodyUncropped = true;
    approval.visualReview.pngSha256 = 'e'.repeat(64);
    await saveApproval(root, approval, { evidence: true });
    await expectHeldWithoutWrites(root, article);
  });

  it.each([
    ['invalid generation time', (a) => { a.provenance.generatedAt = 'not-a-date'; }],
    ['future generation time', (a) => { a.provenance.generatedAt = a.visualReview.reviewedAt = '2099-01-01T00:00:00.000Z'; }],
    ['invalid review time', (a) => { a.visualReview.reviewedAt = '2026-02-30T00:00:00.000Z'; }],
    ['future review time', (a) => { a.visualReview.reviewedAt = '2099-01-01T00:00:00.000Z'; }],
  ])('holds %s against the article publication reference despite matching evidence hashes', async (_name, mutate) => {
    const { root, article, approval } = await prepared();
    mutate(approval);
    await saveApproval(root, approval, { evidence: true });
    await expectHeldWithoutWrites(root, article);
  });

  it.each(['generation', 'visualReview'])('holds missing or changed %s evidence before writing', async (kind) => {
    const { root, article, approval } = await prepared();
    const path = join(root, kind === 'generation' ? approval.provenance.evidencePath : approval.visualReview.evidencePath);
    await writeFile(path, '{"unreviewed":true}\n');
    await expectHeldWithoutWrites(root, article);
    await rm(path);
    await expectHeldWithoutWrites(root, article);
  });

  it('rejects a generation record for another article despite a matching evidence-file hash', async () => {
    const { root, article, approval } = await prepared();
    const path = join(root, approval.provenance.evidencePath);
    const record = JSON.parse(await readFile(path, 'utf8'));
    record.articleSha256 = 'f'.repeat(64);
    const bytes = json(record);
    await writeFile(path, bytes);
    approval.provenance.evidenceSha256 = hash(bytes);
    await saveApproval(root, approval);
    await expectHeldWithoutWrites(root, article);
  });

  it.each(['png', 'webp'])('holds altered prepared %s bytes even when the file still decodes', async (extension) => {
    const { root, article } = await prepared();
    const path = join(root, 'src/assets/daily-editorial', `${article.slug}.${extension}`);
    await writeFile(path, Buffer.concat([await readFile(path), Buffer.from('changed')]));
    await expectHeldWithoutWrites(root, article);
  });

  it.each(['wrong dimensions', 'wrong format', 'over 5 MiB'])('checks actual image bytes with internally consistent %s hashes', async (caseName) => {
    const { root, article, approval } = await prepared();
    const bytes = caseName === 'wrong format' ? await readFile(join(root, 'src/assets/daily-editorial', `${article.slug}.webp`))
      : caseName === 'over 5 MiB' ? Buffer.concat([await readFile(join(root, 'src/assets/daily-editorial', `${article.slug}.png`)), Buffer.alloc(5 * 1024 * 1024)])
      : await sharp({ create: { width: 32, height: 32, channels: 3, background: '#263946' } }).png().toBuffer();
    await replacePng(root, article, approval, bytes);
    await expectHeldWithoutWrites(root, article);
  });

  it('fully decodes a hash-matching PNG whose intact metadata header hides corrupt pixel data', async () => {
    const { root, article, approval } = await prepared();
    const bytes = Buffer.from(await readFile(join(root, 'src/assets/daily-editorial', `${article.slug}.png`)));
    let idat = -1;
    for (let offset = 8; offset + 12 <= bytes.length; offset += bytes.readUInt32BE(offset) + 12) {
      if (bytes.toString('ascii', offset + 4, offset + 8) === 'IDAT') { idat = offset + 8; break; }
    }
    expect(idat).toBeGreaterThan(0);
    bytes.fill(0, idat, idat + 8);
    const metadata = await sharp(bytes).metadata();
    expect({ format: metadata.format, width: metadata.width, height: metadata.height }).toEqual({ format: 'png', width: 1200, height: 630 });
    await expect(sharp(bytes, { failOn: 'warning' }).raw().toBuffer()).rejects.toThrow();
    await replacePng(root, article, approval, bytes);
    await expectHeldWithoutWrites(root, article);
  });

  it.each(['prepared file', 'prepared directory', 'manifest', 'evidence'])('rejects a symlinked %s rather than accepting valid target bytes', async (kind) => {
    const { root, article, approval } = await prepared();
    const source = kind === 'prepared file' ? join(root, 'src/assets/daily-editorial', `${article.slug}.png`)
      : kind === 'prepared directory' ? join(root, 'src/assets/daily-editorial')
      : kind === 'manifest' ? manifest(root) : join(root, approval.visualReview.evidencePath);
    const target = source + '.synthetic-target';
    await rename(source, target);
    await symlink(target, source, kind === 'prepared directory' ? 'dir' : 'file');
    await expectHeldWithoutWrites(root, article);
  });

  it('refuses a symlinked public destination without changing its target', async () => {
    const { root, article } = await prepared();
    const target = await temporaryRoot();
    await mkdir(join(root, 'public'), { recursive: true });
    await symlink(target, join(root, 'public/social'), 'dir');
    const before = await snapshot(root);
    await expect(createDailyEditorialAssets(article, { root })).rejects.toMatchObject(held);
    expect(await readdir(target)).toEqual([]);
    expect(await snapshot(root)).toEqual(before);
  });

  it('does not overwrite a symlinked public PNG target after approving its prepared pair', async () => {
    const { root, article } = await prepared();
    const targetRoot = await temporaryRoot(), target = join(targetRoot, 'untouched.txt');
    await writeFile(target, 'synthetic sentinel');
    await mkdir(join(root, 'public/social'), { recursive: true });
    await symlink(target, join(root, 'public/social', `daily-${article.slug}.png`), 'file');
    const before = await snapshot(root);
    await expect(createDailyEditorialAssets(article, { root })).rejects.toMatchObject(held);
    expect(await readFile(target, 'utf8')).toBe('synthetic sentinel');
    expect(await snapshot(root)).toEqual(before);
  });

  it('audits the exact public pair and rejects orphan or altered daily files', async () => {
    const { root, article } = await prepared();
    await createDailyEditorialAssets(article, { root });
    expect(await auditDailyEditorialPublicAssets(root, [article])).toEqual([]);
    await writeFile(join(root, 'public/social/daily-orphan.png'), Buffer.from('unapproved fixture'));
    expect((await auditDailyEditorialPublicAssets(root, [article])).length).toBeGreaterThan(0);
    await rm(join(root, 'public/social/daily-orphan.png'));
    await writeFile(join(root, 'public/social', `daily-${article.slug}.webp`), Buffer.from('changed fixture'));
    expect((await auditDailyEditorialPublicAssets(root, [article])).length).toBeGreaterThan(0);
  });
});
