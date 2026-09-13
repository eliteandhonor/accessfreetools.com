import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { hashEditorialSource, reviewEditorialSources } from './editorial-source-review.mjs';

const hash = 'a'.repeat(64);
const reviewedAt = '2026-09-06T00:00:00.000Z';
const approvedAt = '2026-09-06T00:01:00.000Z';
function validLedger() {
  return { schemaVersion: 1, slug: 'fixture', articleSha256: hash, reviewedAt, reviewer: 'Fixture source reviewer',
    claims: [{ claim: 'Synthetic statement', sourceUrl: 'https://example.com/official', primarySource: true,
      checkedAt: reviewedAt, finding: 'Synthetic source finding, not a real reviewed claim.' }],
    brendanFacts: [{ fact: 'Synthetic owner fact', checkedAt: reviewedAt, evidenceRef: 'fixture-only-proof' }],
    ownerApproval: { status: 'approved', by: 'Brendan Chambers', approvedAt, evidenceRef: 'fixture-only-approval' } };
}
function review(ledger, extras = {}) {
  return reviewEditorialSources({ slug: 'fixture', articleSha256: hash, ledger,
    externalLinks: ['https://example.com/official'], now: new Date('2026-09-06T01:00:00Z'), ...extras });
}

describe('claim-to-source and owner evidence records', () => {
  it('normalizes Git checkout line endings without ignoring substantive edits', () => {
    const source = '<p>Original article.</p>\n<p>Second paragraph.</p>\n';
    expect(hashEditorialSource(source.replaceAll('\n', '\r\n'))).toBe(hashEditorialSource(source));
    for (const edited of [source.replace('Original', 'Changed'), source.replace('Second', ' Second'), source.replaceAll('\n', '\r')]) {
      expect(hashEditorialSource(edited)).not.toBe(hashEditorialSource(source));
    }
  });

  it('recognizes the same legacy draft across platforms but still rejects changed copy', () => {
    const source = '<p>Original article.</p>\n<p>Second paragraph.</p>\n';
    const baseline = { fixture: hashEditorialSource(source) };
    for (const text of [source, source.replaceAll('\n', '\r\n')]) {
      expect(review(null, { baseline, articleSha256: hashEditorialSource(text) })).toMatchObject({ status: 'legacy-unreviewed', gatePassed: true });
    }
    expect(review(null, { baseline, articleSha256: hashEditorialSource(source.replace('Original', 'Changed')) })).toMatchObject({ status: 'missing', gatePassed: false });
  });

  it('preserves unchanged legacy articles without pretending to have verified them', () => {
    expect(review(null, { baseline: { fixture: hash } })).toMatchObject({ status: 'legacy-unreviewed', gatePassed: true, publicationApproved: false });
    expect(review(null, { baseline: { fixture: 'b'.repeat(64) } })).toMatchObject({ status: 'missing', gatePassed: false });
  });

  it('records complete evidence but leaves actual verification and release approval to the reviewer', () => {
    expect(review(validLedger())).toMatchObject({ status: 'recorded', gatePassed: true, publicationApproved: false, claimCount: 1, factCount: 1 });
  });

  it.each([
    ['different draft', (ledger) => { ledger.articleSha256 = 'b'.repeat(64); }],
    ['wrong slug', (ledger) => { ledger.slug = 'different'; }],
    ['undated review', (ledger) => { delete ledger.reviewedAt; }],
    ['future review', (ledger) => { ledger.reviewedAt = '2999-01-01T00:00:00Z'; }],
    ['unreviewed link', (ledger) => { ledger.claims = []; }],
    ['secondary source', (ledger) => { ledger.claims[0].primarySource = false; }],
    ['unsafe source', (ledger) => { ledger.claims[0].sourceUrl = 'https://user:secret@example.com/official'; }],
    ['unlinked source', (ledger) => { ledger.claims[0].sourceUrl = 'https://example.com/not-linked'; }],
    ['no finding', (ledger) => { ledger.claims[0].finding = ''; }],
    ['claim checked after review', (ledger) => { ledger.claims[0].checkedAt = approvedAt; }],
    ['no owner fact', (ledger) => { ledger.brendanFacts = []; }],
    ['unsupported owner fact', (ledger) => { delete ledger.brendanFacts[0].evidenceRef; }],
    ['no approval', (ledger) => { delete ledger.ownerApproval; }],
    ['planned approval', (ledger) => { ledger.ownerApproval.status = 'planned'; }],
    ['other reviewer approval', (ledger) => { ledger.ownerApproval.by = 'An agent'; }],
    ['undocumented approval', (ledger) => { delete ledger.ownerApproval.evidenceRef; }],
    ['approval before review', (ledger) => { ledger.ownerApproval.approvedAt = '2026-09-05T00:00:00Z'; }],
  ])('fails %s even for a legacy article once a ledger is supplied', (_, mutate) => {
    const ledger = validLedger();
    mutate(ledger);
    expect(review(ledger, { baseline: { fixture: hash } })).toMatchObject({ status: 'incomplete', gatePassed: false, publicationApproved: false });
  });
});

describe('editorial quality claim boundaries', () => {
  it.each([
    ['literal ampersand', 'https://example.com/official?a=1&b=2', true],
    ['named entity', 'https://example.com/official?a=1&amp;b=2', true],
    ['decimal entity', 'https://example.com/official?a=1&#38;b=2', true],
    ['hex entity', 'https://example.com/official?a=1&#x26;b=2', true],
    ['encoded protocol', 'https&#58;//example.com/official?a=1&amp;b=2', true],
    ['different destination', 'https://example.com/other?a=1&amp;b=2', false],
    ['different parameter', 'https://example.com/official?a=1&amp;b=3', false],
    ['only decode once', 'https://example.com/official?a=1&amp;amp;b=2', false],
    ['credential URL', 'https://user:secret@example.com/official?a=1&amp;b=2', false],
    ['unsafe protocol', 'javascript:alert(1)', false],
  ])('the real checker handles %s without changing the source destination', (_, href, expected) => {
    const parent = resolve(tmpdir());
    const root = mkdtempSync(join(parent, 'aft-source-entities-'));
    try {
      for (const path of ['dist/blog/fixture', 'src/pages/blog', 'docs/editorial-source-reviews']) mkdirSync(join(root, path), { recursive: true });
      const html = `<main><article data-editorial-slug="fixture"><p>Synthetic test article.</p><a href="${href}">Source</a></article></main>`;
      writeFileSync(join(root, 'dist/blog/fixture/index.html'), html);
      writeFileSync(join(root, 'src/pages/blog/fixture.astro'), html);
      const ledger = validLedger();
      ledger.articleSha256 = createHash('sha256').update(html).digest('hex');
      ledger.claims[0].sourceUrl = 'https://example.com/official?a=1&b=2';
      writeFileSync(join(root, 'docs/editorial-source-reviews/fixture.json'), JSON.stringify(ledger));
      const command = spawnSync(process.execPath, [resolve('scripts/check-editorial-article-quality.mjs')], { cwd: root, encoding: 'utf8', timeout: 30000 });
      expect(command.error).toBeUndefined();
      const report = JSON.parse(readFileSync(join(root, 'output/editorial-quality/fixture.json'), 'utf8'));
      expect(report.sourceReview.gatePassed).toBe(expected);
      expect(report.sourceReview.publicationApproved).toBe(false);
      // This deliberately short fixture must not pass the whole writing gate.
      expect(command.status).toBe(1);
    } finally {
      if (dirname(root) !== parent || !root.startsWith(join(parent, 'aft-source-entities-'))) throw new Error('Unsafe fixture cleanup');
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('does not report an empty editorial build as passing', () => {
    const parent = resolve(tmpdir());
    const root = mkdtempSync(join(parent, 'aft-empty-editorial-'));
    try {
      mkdirSync(join(root, 'dist/blog'), { recursive: true });
      writeFileSync(join(root, 'dist/blog/index.html'), '<main>Blog index, not an article.</main>');
      const command = spawnSync(process.execPath, [resolve('scripts/check-editorial-article-quality.mjs')], { cwd: root, encoding: 'utf8', timeout: 30000 });
      expect(command.error).toBeUndefined();
      const report = JSON.parse(readFileSync(join(root, 'output/editorial-quality/latest.json'), 'utf8'));
      expect(command.status).toBe(1);
      expect(report.status).toBe('fail');
      expect(report.issues).toContain('No built editorial articles were found. Run a complete site build before review.');
    } finally {
      if (dirname(root) !== parent || !root.startsWith(join(parent, 'aft-empty-editorial-'))) throw new Error('Unsafe fixture cleanup');
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('does not call three arbitrary links verified primary sources', () => {
    const parent = resolve(tmpdir());
    const root = mkdtempSync(join(parent, 'aft-source-review-'));
    try {
      mkdirSync(join(root, 'dist/blog/fixture'), { recursive: true });
      mkdirSync(join(root, 'src/pages/blog'), { recursive: true });
      const html = '<main><article data-editorial-slug="fixture"><p>I own Access Free Tools.</p>' +
        ['one', 'two', 'three'].map((path) => `<a href="https://example.com/${path}">An unreviewed link</a>`).join('') + '</article></main>';
      writeFileSync(join(root, 'dist/blog/fixture/index.html'), html);
      writeFileSync(join(root, 'src/pages/blog/fixture.astro'), html);
      const command = spawnSync(process.execPath, [resolve('scripts/check-editorial-article-quality.mjs')], { cwd: root, encoding: 'utf8', timeout: 30000 });
      expect(command.error).toBeUndefined();
      const report = JSON.parse(readFileSync(join(root, 'output/editorial-quality/fixture.json'), 'utf8'));
      expect(report.readerFirst).not.toHaveProperty('primarySources');
      expect(report.readerFirst.sourceLinksPresent).toBe(true);
      expect(report.sourceReview.status).toBe('missing');
      expect(report.failures).toContain('sourceReviewEvidence');
    } finally {
      if (dirname(root) !== parent || !root.startsWith(join(parent, 'aft-source-review-'))) throw new Error('Unsafe fixture cleanup');
      rmSync(root, { recursive: true, force: true });
    }
  });
});
