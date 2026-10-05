import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { hashEditorialSource } from './editorial-source-review.mjs';
import { inspectEditorialWritingStructure } from './editorial-writing-structure.mjs';

const neutralOpening = 'A browser OCR tool can misread a small image. Check the recognized text before copying the result into another page.';
const neutralOwner = 'Access Free Tools is owned by Brendan Chambers.';
const neutralProcess = 'This article was revised with AI assistance. Technical statements were checked against primary sources and the current code.';

describe('editorial wording checks without invented personal experience', () => {
  it('accepts a practical neutral opening and scoped neutral disclosures', () => {
    expect(inspectEditorialWritingStructure({ opening: neutralOpening,
      paragraphs: [neutralOpening, neutralOwner, neutralProcess] })).toEqual({
      concreteOpening: true, ownerDisclosure: true, processDisclosure: true, contextAndDisclosure: 10,
    });
  });

  it('preserves supported first-person wording without rewarding pronoun repetition', () => {
    const paragraphs = [neutralOpening, 'I own Access Free Tools. AI helped with research organization and draft checks.'];
    const initial = inspectEditorialWritingStructure({ opening: neutralOpening, paragraphs });
    const repeated = inspectEditorialWritingStructure({ opening: neutralOpening, paragraphs: [...paragraphs, 'I, my, me. I, my, me.'] });
    expect(initial).toEqual(repeated);
    expect(initial.contextAndDisclosure).toBe(10);
  });

  it('does not treat a topic list or a byline as a concrete opening and ownership disclosure', () => {
    expect(inspectEditorialWritingStructure({ opening: 'Browser tool, repository, page, site.',
      paragraphs: ['By Brendan Chambers.'] })).toMatchObject({ concreteOpening: false, ownerDisclosure: false });
  });

  it('requires a stated AI-assistance process rather than an unrelated AI reference', () => {
    for (const paragraphs of [
      ['AI models can read images. This article checks source links.'],
      ['AI assistance.', 'Technical sources were checked.'],
      ['This article was checked against primary sources.'],
    ]) {
      expect(inspectEditorialWritingStructure({ opening: neutralOpening, paragraphs }).processDisclosure).toBe(false);
    }
    expect(inspectEditorialWritingStructure({ opening: neutralOpening,
      paragraphs: ['AI-assisted editing was used for this draft.'] }).processDisclosure).toBe(true);
  });
});

// Deliberately synthetic content and evidence. This fixture tests gate behavior,
// never publication approval or the truth of a real editorial claim.
const fixtureParagraph = 'The example uses a 1200 by 220 pixel image with a short text label. Read the expected words beside the recognized result, then compare punctuation and digits carefully. A clear sample only demonstrates that particular input. It does not establish accuracy for photographs, handwriting, every language, or every browser. Check a document against its source before relying on names, dates, prices, or other important details.';
function fixtureHtml({ extra = '' } = {}) {
  return `<main><article data-editorial-slug="fixture"><p>${neutralOpening}</p>` +
    ['What to check first', 'Inputs and example', 'Read the result', 'Common mistakes', 'Limits', 'Next check'].map((heading) =>
      `<h2>${heading}</h2><p>${fixtureParagraph}</p><p>${fixtureParagraph}</p>`).join('') +
    '<a href="/tools/example/">Example tool</a><a href="/blog/example/">Example guide</a><a href="/privacy-policy/">Privacy policy</a>' +
    ['one', 'two', 'three'].map((name) => `<a href="https://example.com/${name}">Synthetic primary source ${name}</a>`).join('') +
    `<p>${neutralOwner}</p><h2>How this article was made</h2><p>${neutralProcess}</p>${extra}</article></main>`;
}

function checkFixture({ approval = 'pending', ledgerPresent = true, extra = '' } = {}) {
  const parent = resolve(tmpdir());
  const root = mkdtempSync(join(parent, 'aft-neutral-editorial-'));
  try {
    for (const path of ['dist/blog/fixture', 'src/pages/blog', 'docs/editorial-source-reviews']) mkdirSync(join(root, path), { recursive: true });
    const html = fixtureHtml({ extra });
    writeFileSync(join(root, 'dist/blog/fixture/index.html'), html);
    writeFileSync(join(root, 'src/pages/blog/fixture.astro'), html);
    if (ledgerPresent) {
      const reviewedAt = '2026-09-06T00:00:00.000Z';
      const ledger = { schemaVersion: 1, slug: 'fixture', articleSha256: hashEditorialSource(html),
        reviewedAt, reviewer: 'Synthetic fixture reviewer',
        claims: [{ claim: 'Synthetic claim only.', sourceUrl: 'https://example.com/one', primarySource: true,
          checkedAt: reviewedAt, finding: 'Synthetic finding only, not real source verification.' }],
        brendanFacts: [{ fact: 'Synthetic owner fact only.', checkedAt: reviewedAt, evidenceRef: 'fixture-only-owner-proof' }],
        ownerApproval: approval === 'approved'
          ? { status: 'approved', by: 'Brendan Chambers', approvedAt: '2026-09-06T00:01:00.000Z', evidenceRef: 'fixture-only-approval' }
          : { status: 'pending', by: 'Brendan Chambers' } };
      writeFileSync(join(root, 'docs/editorial-source-reviews/fixture.json'), JSON.stringify(ledger));
    }
    const command = spawnSync(process.execPath, [resolve('scripts/check-editorial-article-quality.mjs')],
      { cwd: root, encoding: 'utf8', timeout: 30000 });
    expect(command.error).toBeUndefined();
    return { exitCode: command.status, report: JSON.parse(readFileSync(join(root, 'output/editorial-quality/fixture.json'), 'utf8')) };
  } finally {
    if (dirname(root) !== parent || !root.startsWith(join(parent, 'aft-neutral-editorial-'))) throw new Error('Unsafe fixture cleanup');
    rmSync(root, { recursive: true, force: true });
  }
}

describe('real editorial checker preserves source and approval boundaries', () => {
  it('passes neutral structure but fails only the source gate when owner approval is pending', () => {
    const { exitCode, report } = checkFixture();
    expect(exitCode).toBe(1);
    expect(report.failures).toEqual(['sourceReviewEvidence']);
    expect(report.sourceReview).toMatchObject({ status: 'incomplete', gatePassed: false, publicationApproved: false });
    expect(report.sourceReview.issues).toEqual(['Owner approval of this reviewed draft needs a dated, referenceable record.']);
    expect(report.stopSlop).not.toHaveProperty('authenticity');
    expect(report.stopSlop.limitation).toContain('does not verify facts, originality, authorship');
  });

  it('still rejects absent evidence despite passing neutral wording', () => {
    const { exitCode, report } = checkFixture({ ledgerPresent: false });
    expect(exitCode).toBe(1);
    expect(report.failures).toEqual(['sourceReviewEvidence']);
    expect(report.sourceReview).toMatchObject({ status: 'missing', gatePassed: false, publicationApproved: false });
  });

  it('accepts a complete synthetic record without claiming publication approval', () => {
    const { exitCode, report } = checkFixture({ approval: 'approved', extra: '<p>AI-assisted revision uses a source-check workflow.</p>' });
    expect(exitCode).toBe(0);
    expect(report.failures).toEqual([]);
    expect(report.readerFirst.noEmDashes).toBe(true);
    expect(report.sourceReview).toMatchObject({ status: 'recorded', gatePassed: true, publicationApproved: false });
  });

  it.each([
    ['Unicode em dash', '<p>Check the input\u2014then the result.</p>', 'noEmDashes'],
    ['encoded em dash', '<p>Check the input&mdash;then the result.</p>', 'noEmDashes'],
    ['hype', '<p>This revolutionary tool reads the image.</p>', 'noSharedWritingHardErrors'],
  ])('still rejects %s with a complete synthetic record', (_, extra, failure) => {
    const { exitCode, report } = checkFixture({ approval: 'approved', extra });
    expect(exitCode).toBe(1);
    expect(report.failures).toContain(failure);
  });
});
