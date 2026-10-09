import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { articleHash } from './daily-editorial-checks.mjs';
import { artworkJsonHash, publicContentHash } from './daily-editorial-artwork.mjs';
import { publicArticle } from './daily-editorial-publication.mjs';
import { MAX_PRIVATE_INPUT_FILES, MAX_PRIVATE_INPUT_FILE_BYTES, MAX_PRIVATE_INPUT_BYTES } from './daily-editorial-private-input.mjs';
import { prepareMarkdownProjection } from './daily-editorial-projection.mjs';
import { prepareCompactMarkdownProjection, resolveCompactMarkdownProjection } from './daily-editorial-compact-projection.mjs';

// Every article, source and review below is synthetic. No fixture grants real
// generation, artwork, human review, runtime, provider or publication approval.
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const bytes = (value) => Buffer.from(typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`);
const now = new Date('2026-10-09T12:00:00Z');

function fixture({ wholeSource = false } = {}) {
  const markdown = `---
slug: synthetic-file-guide
title: "Synthetic file guide"
description: "Synthetic metadata description stays private."
researchDate: 2026-10-08
project: synthetic/project
license: MIT
release: v0.0.0
releasePublishedAt: 2026-10-01T00:00:00Z
releaseCommit: ${'a'.repeat(40)}
---

# Synthetic file guide

A **synthetic reader** has two files.

The [synthetic project](https://example.test/project) can explain this hypothetical case.

## Who this helps

This is an original synthetic paragraph.

## How to start

1. **Read the instructions.** Keep the original.
2. Select the example file.

## Example scenario

This example is hypothetical, without a measured result.

## Limits to check

- The fixture does not prove installed behavior.
- Preserve a separate backup.

## Sources and preparation

No software was installed or performance-tested for this synthetic fixture.
`;
  const markdownSha256 = hash(markdown);
  const files = new Map([['localsend-guide.md', bytes(markdown)]]);
  const put = (path, value) => files.set(path, bytes(value));
  const sourceText = 'Complete synthetic source.\nRequired synthetic qualification.\n';
  const sourceId = 'synthetic-source';
  const sourceSha256 = hash(sourceText);
  const sourceManifest = { schemaVersion: 1, articleSha256: markdownSha256,
    sources: [{ id: sourceId, file: 'public-sources/synthetic.txt', bytes: Buffer.byteLength(sourceText),
      sha256: sourceSha256, kind: 'synthetic-repository-file', url: `https://github.com/synthetic/project/blob/${'a'.repeat(40)}/README.md` }] };
  const publicUnits = markdown.split('\n').flatMap((text, index) => {
    if (index < 12 || !text) return [];
    return [{ id: `u${index}`, kind: 'synthetic-public-block', text, locator: { line: index + 1 } }];
  });
  publicUnits.push({ id: 'title-meta', kind: 'synthetic-frontmatter', text: 'Synthetic file guide', locator: { frontmatter: 'title', line: 3 } },
    { id: 'description-meta', kind: 'synthetic-frontmatter', text: 'Synthetic metadata description stays private.', locator: { frontmatter: 'description', line: 4 } });
  const claimMap = { schemaVersion: 1, articleSha256: markdownSha256, publicUnits,
    groups: publicUnits.map((unit) => ({ id: `g-${unit.id}`, units: [unit.id], kind: 'synthetic-only', evidence: ['synthetic-context'] })) };
  const contexts = { schemaVersion: 1, articleSha256: markdownSha256, evidence: [
    { id: 'synthetic-context', sourceId, text: 'Complete synthetic source.\n', sourceSha256,
      contextSha256: hash('Complete synthetic source.\n') },
    { id: 'synthetic-dependency', sourceId, text: 'Required synthetic qualification.\n', sourceSha256,
      contextSha256: hash('Required synthetic qualification.\n') },
  ] };
  const registry = { schemaVersion: 1, articleSha256: markdownSha256,
    sourceManifestSha256: artworkJsonHash(sourceManifest), publicClaimMapSha256: artworkJsonHash(claimMap),
    units: contexts.evidence.map((context, index) => ({ id: context.id, sourceId, sourceSha256,
      contextSha256: context.contextSha256, mode: wholeSource && index === 0 ? 'whole-source' : 'reviewed-extraction',
      closure: { fullSourceReviewed: false, outerScopeCovered: false, dependencyClosureReviewed: false,
        requiredUnitIds: index === 0 ? ['synthetic-dependency'] : [], limitations: ['Synthetic only; no actual approval.'] } })) };
  const priorReview = { articleSha256: markdownSha256, registrySha256: artworkJsonHash(registry),
    decision: 'synthetic-not-an-approval', sourceHashes: { [sourceId]: sourceSha256 }, unitIds: registry.units.map((unit) => unit.id) };
  const contract = { articleSha256: markdownSha256, contextRegistrySha256: artworkJsonHash(registry), publicationAllowed: false,
    contextReview: {}, executionReview: null, sourceReview: null };
  const manifest = { articleSha256: markdownSha256, dispatchAllowed: false, approvedGrant: false };
  put('public-sources/synthetic.txt', sourceText);
  put('source-manifest.json', sourceManifest);
  put('public-claim-map.json', claimMap);
  put('evidence-contexts.json', contexts);
  put('context-registry.json', registry);
  put('context-independent-review.json', priorReview);
  put('execution-contract.json', contract);
  put('pilot-input-manifest.json', manifest);
  const value = { files, descriptorBytes: null, pin: { repository: 'synthetic/private-state', commit: 'b'.repeat(40),
    descriptorPath: 'reviews/synthetic/descriptor.json', descriptorSha256: null }, validationNow: now };
  reseal(value);
  return value;
}

function edit(value, path, change) {
  const data = JSON.parse(value.files.get(path));
  change(data);
  value.files.set(path, bytes(data));
}

function reseal(value) {
  const get = (path) => JSON.parse(value.files.get(path));
  const registry = get('context-registry.json');
  registry.sourceManifestSha256 = artworkJsonHash(get('source-manifest.json'));
  registry.publicClaimMapSha256 = artworkJsonHash(get('public-claim-map.json'));
  value.files.set('context-registry.json', bytes(registry));
  edit(value, 'context-independent-review.json', (review) => { review.registrySha256 = artworkJsonHash(registry); });
  edit(value, 'execution-contract.json', (contract) => {
    contract.contextRegistrySha256 = artworkJsonHash(registry);
    contract.contextReview.sha256 = hash(value.files.get('context-independent-review.json'));
  });
  const descriptor = { articleSha256: hash(value.files.get('localsend-guide.md')), contextRegistrySha256: artworkJsonHash(registry),
    executionContractSha256: hash(value.files.get('execution-contract.json')), manifestSha256: hash(value.files.get('pilot-input-manifest.json')),
    files: [...value.files].map(([file, content]) => ({ file, bytes: content.byteLength, sha256: hash(content) })) };
  value.descriptorBytes = bytes(descriptor);
  value.pin.descriptorSha256 = hash(value.descriptorBytes);
}

describe('held Markdown daily JSON preparation', () => {
  it('preserves each opener, heading, paragraph and original list marker in order', () => {
    const result = prepareMarkdownProjection(fixture());
    expect(result.article.problem).toBe('A synthetic reader has two files.');
    expect(result.article.summary).toBe('The synthetic project can explain this hypothetical case.');
    expect(result.article.sections.map((section) => section.heading)).toEqual(['Who this helps', 'How to start', 'Example scenario', 'Limits to check', 'Sources and preparation']);
    expect(result.article.sections[1].paragraphs.map((paragraph) => paragraph.text)).toEqual([
      '1. Read the instructions. Keep the original.', '2. Select the example file.',
    ]);
    expect(result.article.sections[3].paragraphs[0].text).toBe('- The fixture does not prove installed behavior.');
    expect(result.receipt.privateFrontmatter.description).toBe('Synthetic metadata description stays private.');
    expect(JSON.stringify(result.publicProjection)).not.toContain('Synthetic metadata description stays private.');
    expect(result.receipt.originalLinks).toEqual([expect.objectContaining({ label: 'synthetic project', url: 'https://example.test/project' })]);
    expect(result.receipt.proseMappings.some((mapping) => mapping.originalMarkdown?.includes('**synthetic reader**'))).toBe(true);
  });

  it('keeps full source and recursively required effective evidence without authoring approval', () => {
    const result = prepareMarkdownProjection(fixture());
    const paragraph = result.article.sections[0].paragraphs[0];
    expect(paragraph.evidence.map((item) => item.quote)).toEqual(['Complete synthetic source.\n', 'Required synthetic qualification.\n']);
    expect(result.article.sources[0].text).toBe('Complete synthetic source.\nRequired synthetic qualification.\n');
    expect(result.receipt.contextRegistry.units[0].closure.fullSourceReviewed).toBe(false);
    expect(result.receipt.historicalReviewAppliesToNewJson).toBe(false);
    expect(result.receipt.projectionPublicationReview).toBeNull();
    expect(result.receipt.artworkApproval).toBeNull();
    expect(result.receipt.publicationAllowed).toBe(false);
    expect(result.receipt.dispatchAllowed).toBe(false);
    expect(result.receipt.providerCalls).toBe(0);
    expect(result.receipt.remoteWrites).toBe(0);
  });

  it('uses complete source text for a whole-source effective context', () => {
    const result = prepareMarkdownProjection(fixture({ wholeSource: true }));
    const source = result.article.sources[0];
    expect(result.article.sections[0].paragraphs[0].evidence[0].quote).toBe(source.text);
    const effective = result.receipt.proseMappings.find((mapping) => mapping.target === 'sections.0.paragraphs.0').effectiveContexts[0];
    expect(effective.mode).toBe('whole-source');
    expect(effective.effectiveContextSha256).toBe(source.sha256);
    expect(effective.declaredContextSha256).not.toBe(effective.effectiveContextSha256);
  });

  it('separates Markdown bytes, private article hash and date-free public content hash', () => {
    const input = fixture();
    const result = prepareMarkdownProjection(input);
    const later = prepareMarkdownProjection({ ...input, validationNow: new Date('2026-10-10T12:00:00Z') });
    expect(result.receipt.markdownSha256).toBe(hash(input.files.get('localsend-guide.md')));
    expect(result.receipt.privateArticleSha256).toBe(articleHash(result.article));
    expect(result.receipt.privateArticleSha256).not.toBe(result.receipt.markdownSha256);
    expect(result.publicProjection.artwork.articleSha256).toBe(result.receipt.privateArticleSha256);
    expect(result.receipt.publicContentSha256).toBe(publicContentHash(publicArticle(result.article, '2026-10-09T12:00:00Z')));
    expect(result.receipt.privateArticleSha256).toBe(later.receipt.privateArticleSha256);
    expect(result.receipt.publicContentSha256).toBe(later.receipt.publicContentSha256);
    expect(result.receipt.validationAt).not.toBe(later.receipt.validationAt);
    expect(result.article).not.toHaveProperty('publishedAt');
    expect(result.publicProjection).not.toHaveProperty('publishedAt');
    expect(result.publicProjection.sources[0]).not.toHaveProperty('text');
    expect(result.publicProjection.sections[0].paragraphs[0]).not.toHaveProperty('evidence');
  });

  it('leaves uncaptured times and original source kinds as explicit publication holds', () => {
    const result = prepareMarkdownProjection(fixture());
    expect(result.article.researchedAt).toBe('2026-10-08');
    expect(result.article.sources[0].fetchedAt).toBeNull();
    expect(result.article.sources[0].kind).toBe('synthetic-repository-file');
    expect(result.receipt.publicationValidation.passed).toBe(false);
    expect(result.receipt.publicationValidation.issues).toContain('Research date is missing, invalid, or in the future.');
    expect(result.receipt.proposalStatus).toBe('held-not-publication-approved');
  });

  it('fails on changed accepted bytes, missing files and mismatched native descriptor bytes', () => {
    const changed = fixture();
    changed.files.set('localsend-guide.md', bytes('Changed synthetic prose.'));
    expect(() => prepareMarkdownProjection(changed)).toThrow(/pinned bytes/);
    const missing = fixture();
    missing.files.delete('public-sources/synthetic.txt');
    expect(() => prepareMarkdownProjection(missing)).toThrow(/pinned bytes/);
    const descriptor = fixture();
    descriptor.descriptorBytes = Buffer.concat([descriptor.descriptorBytes, Buffer.from(' ')]);
    expect(() => prepareMarkdownProjection(descriptor)).toThrow(/descriptor raw-byte hash/);
  });

  it('rejects array-coerced pins and an invalid validation clock', () => {
    for (const key of ['commit', 'descriptorSha256']) {
      const input = fixture();
      input.pin[key] = [input.pin[key]];
      expect(() => prepareMarkdownProjection(input)).toThrow(/immutable private input pin/);
    }
    const input = fixture();
    expect(() => prepareMarkdownProjection({ ...input, validationNow: new Date('invalid') })).toThrow(/actual validation clock/);
  });

  it('requires the accepted package gates to remain held', () => {
    for (const [path, key] of [['execution-contract.json', 'publicationAllowed'], ['pilot-input-manifest.json', 'dispatchAllowed'], ['pilot-input-manifest.json', 'approvedGrant']]) {
      const input = fixture();
      edit(input, path, (record) => { record[key] = true; });
      reseal(input);
      expect(() => prepareMarkdownProjection(input)).toThrow(/package must remain held/);
    }
  });

  it('rejects missing closure dependencies and altered source-context bindings after resealing', () => {
    const dependency = fixture();
    edit(dependency, 'context-registry.json', (registry) => { registry.units[0].closure.requiredUnitIds = ['missing']; });
    reseal(dependency);
    expect(() => prepareMarkdownProjection(dependency)).toThrow(/missing dependency/);
    const context = fixture();
    edit(context, 'evidence-contexts.json', (contexts) => { contexts.evidence[0].sourceSha256 = 'c'.repeat(64); });
    reseal(context);
    expect(() => prepareMarkdownProjection(context)).toThrow(/source-bound context/);
  });

  it('rejects incomplete prose claim accounting and empty factual evidence', () => {
    const uncovered = fixture();
    edit(uncovered, 'public-claim-map.json', (map) => {
      const removed = map.publicUnits.find((unit) => unit.text === 'This is an original synthetic paragraph.').id;
      map.publicUnits = map.publicUnits.filter((unit) => unit.id !== removed);
      map.groups = map.groups.filter((group) => !group.units.includes(removed));
    });
    reseal(uncovered);
    expect(() => prepareMarkdownProjection(uncovered)).toThrow(/unmapped authored block/);
    const noEvidence = fixture();
    edit(noEvidence, 'public-claim-map.json', (map) => { map.groups[0].evidence = []; });
    reseal(noEvidence);
    expect(() => prepareMarkdownProjection(noEvidence)).toThrow(/claim group evidence/);
  });

  it('rejects an extra unmapped sentence and a mapped but ungrouped scope', () => {
    const extra = fixture();
    edit(extra, 'public-claim-map.json', (map) => {
      const unit = map.publicUnits.find((entry) => entry.text === 'This is an original synthetic paragraph.');
      unit.text = 'This is an original';
    });
    reseal(extra);
    expect(() => prepareMarkdownProjection(extra)).toThrow(/unmapped authored wording/);
    const ungrouped = fixture();
    edit(ungrouped, 'public-claim-map.json', (map) => {
      const unit = map.publicUnits.find((entry) => entry.text === 'A **synthetic reader** has two files.');
      unit.text = 'A **synthetic reader**';
      map.publicUnits.push({ id: 'ungrouped-tail', text: 'has two files.', locator: { line: unit.locator.line, startCharacter: 23, endCharacter: 37 } });
    });
    reseal(ungrouped);
    expect(() => prepareMarkdownProjection(ungrouped)).toThrow(/claim unit without evidence group/);
  });

  it('enforces shared inventory count, individual byte and total byte limits', () => {
    for (const mode of ['count', 'individual', 'total', 'traversal']) {
      const input = fixture();
      const descriptor = JSON.parse(input.descriptorBytes);
      if (mode === 'count') descriptor.files = Array.from({ length: MAX_PRIVATE_INPUT_FILES + 1 }, () => descriptor.files[0]);
      if (mode === 'individual') descriptor.files[0].bytes = MAX_PRIVATE_INPUT_FILE_BYTES + 1;
      if (mode === 'traversal') descriptor.files[0].file = '../outside.md';
      if (mode === 'total') {
        descriptor.files = [];
        for (let index = 0; index <= MAX_PRIVATE_INPUT_BYTES / MAX_PRIVATE_INPUT_FILE_BYTES; index++) {
          const content = Buffer.alloc(MAX_PRIVATE_INPUT_FILE_BYTES, 97);
          const file = `synthetic-${index}.txt`;
          input.files.set(file, content);
          descriptor.files.push({ file, bytes: content.byteLength, sha256: hash(content) });
        }
      }
      input.descriptorBytes = bytes(descriptor);
      input.pin.descriptorSha256 = hash(input.descriptorBytes);
      expect(() => prepareMarkdownProjection(input)).toThrow(/PROJECTION_INPUT_INVALID/);
    }
  });
});

describe('compact private evidence preparation', () => {
  function resolve(input, compactBytes = prepareCompactMarkdownProjection(input).compactBytes) {
    return resolveCompactMarkdownProjection({ ...input, compactBytes, compactSha256: hash(compactBytes) });
  }

  it('reconstructs exact complete research and keeps each identity separate', () => {
    const input = fixture();
    const full = prepareMarkdownProjection(input);
    const compact = prepareCompactMarkdownProjection(input);
    const result = resolve(input, compact.compactBytes);
    expect(result.article).toEqual(full.article);
    expect(result.publicProjection).toEqual(full.publicProjection);
    expect(compact.receipt.hydratedArticleSha256).toBe(articleHash(full.article));
    expect(compact.receipt.publicContentSha256).toBe(publicContentHash(full.article));
    expect(compact.receipt.compactRawSha256).toBe(hash(compact.compactBytes));
    expect(compact.receipt.compactCanonicalSha256).toBe(artworkJsonHash(compact.compact));
    expect(compact.receipt.compactCanonicalSha256).not.toBe(compact.receipt.hydratedArticleSha256);
    expect(compact.receipt.markdownSha256).not.toBe(compact.receipt.hydratedArticleSha256);
    expect(compact.compact.article.sources[0]).not.toHaveProperty('text');
    expect(compact.compact.article.sections[0].paragraphs[0]).not.toHaveProperty('evidence');
    expect(result.article.sections[0].paragraphs[0].evidence).toHaveLength(2);
    expect(result.article.sources[0].text).toBe(full.article.sources[0].text);
  });

  it('retains whole-source effective evidence and historical holds', () => {
    const input = fixture({ wholeSource: true });
    const compact = prepareCompactMarkdownProjection(input);
    const result = resolve(input, compact.compactBytes);
    expect(result.article.sections[0].paragraphs[0].evidence[0].quote).toBe(result.article.sources[0].text);
    expect(compact.compact.article.sources[0].fetchedAt).toBeNull();
    expect(compact.compact.article.researchedAt).toBe('2026-10-08');
    expect(compact.receipt.publicationValidation.passed).toBe(false);
    expect(compact.receipt.historicalReviewAppliesToNewJson).toBe(false);
    for (const flag of ['humanOwnerApproval', 'runtimeContractIntegrated', 'publicationAllowed', 'dispatchAllowed']) {
      expect(compact.compact[flag]).toBe(false);
    }
    expect(compact.receipt.providerCalls).toBe(0);
    expect(compact.receipt.remoteWrites).toBe(0);
    expect(compact.compact.jsonPublicationReview).toBeNull();
    expect(compact.compact.artworkApproval).toBeNull();
    expect(compact.compact.publishedAt).toBeNull();
    expect(() => publicArticle(compact.compact, now.toISOString())).toThrow();
  });

  it('verifies unused registry records and files without truncating to paragraph evidence', () => {
    const input = fixture();
    edit(input, 'evidence-contexts.json', (record) => record.evidence.push({ ...record.evidence[1], id: 'synthetic-unused' }));
    edit(input, 'context-registry.json', (record) => record.units.push({ ...record.units[1], id: 'synthetic-unused' }));
    edit(input, 'context-independent-review.json', (record) => record.unitIds.push('synthetic-unused'));
    reseal(input);
    const compact = prepareCompactMarkdownProjection(input);
    expect(compact.compact.inputPin.contextRegistry.retainedUnitCount).toBe(3);
    expect(compact.compact.article.sections[0].paragraphs[0].evidenceUnitIds).toHaveLength(2);
    expect(resolve(input, compact.compactBytes).receipt.contextRegistry.units).toHaveLength(3);
    edit(input, 'context-registry.json', (record) => { record.units[2].closure.requiredUnitIds = ['missing']; });
    reseal(input);
    expect(() => prepareCompactMarkdownProjection(input)).toThrow(/retained registry dependency/);
    expect(() => resolve(input, compact.compactBytes)).toThrow(/retained registry dependency/);
    input.files.set('context-registry.json', bytes('changed unused record'));
    expect(() => resolve(input, compact.compactBytes)).toThrow(/pinned bytes/);
  });

  it('rejects tampered compact metadata, prose, refs, hashes, dependencies and approvals even after rehashing', () => {
    const input = fixture();
    const original = prepareCompactMarkdownProjection(input).compact;
    const changes = [
      (c) => { c.format = 'runtime-approved'; },
      (c) => { c.inputPin.commit = 'c'.repeat(40); },
      (c) => { c.inputPin.contextRegistry.retainedUnitCount--; },
      (c) => { c.article.summary += ' Altered wording.'; },
      (c) => { c.article.sources[0].contentRef = '../unrelated'; },
      (c) => { c.article.sources[0].fetchedAt = now.toISOString(); },
      (c) => { c.hydratedArticleSha256 = 'c'.repeat(64); },
      (c) => { c.publicContentSha256 = 'c'.repeat(64); },
      (c) => { c.article.sections[0].paragraphs[0].evidenceUnitIds.pop(); },
      (c) => { c.article.sections[0].paragraphs[0].evidenceUnitIds.reverse(); },
      (c) => { c.publicationAllowed = true; },
      (c) => { c.humanOwnerApproval = true; },
      (c) => { c.extra = 'unapproved extension'; },
    ];
    for (const change of changes) {
      const candidate = structuredClone(original);
      change(candidate);
      expect(() => resolve(input, bytes(candidate))).toThrow(/exact compact contract/);
    }
  });

  it('requires external raw-byte integrity, strict hash types and original immutable input pins', () => {
    const input = fixture();
    const compactBytes = prepareCompactMarkdownProjection(input).compactBytes;
    for (const compactSha256 of ['c'.repeat(64), [hash(compactBytes)], null]) {
      expect(() => resolveCompactMarkdownProjection({ ...input, compactBytes, compactSha256 })).toThrow(/hash-bound compact bytes/);
    }
    input.pin.commit = 'c'.repeat(40);
    expect(() => resolve(input, compactBytes)).toThrow(/exact compact contract/);
    const changed = fixture();
    changed.files.set('public-sources/synthetic.txt', bytes('shortened source'));
    expect(() => resolve(changed, compactBytes)).toThrow(/pinned bytes/);
  });

  it('enforces existing byte limits and rejects malformed or non-UTF-8 compact data', () => {
    const input = fixture();
    for (const compactBytes of [Buffer.alloc(MAX_PRIVATE_INPUT_FILE_BYTES + 1, 97), Buffer.from('{'), Buffer.from([255])]) {
      expect(() => resolve(input, compactBytes)).toThrow();
    }
    const oversized = fixture();
    edit(oversized, 'source-manifest.json', (record) => { record.sources[0].url += 'a'.repeat(MAX_PRIVATE_INPUT_FILE_BYTES); });
    reseal(oversized);
    expect(() => prepareCompactMarkdownProjection(oversized)).toThrow(/PROJECTION_INPUT_INVALID/);
  });
});
