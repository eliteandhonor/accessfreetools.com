import { createHash } from 'node:crypto';
import { artworkJsonHash } from './daily-editorial-artwork.mjs';
import { MAX_PRIVATE_INPUT_FILE_BYTES } from './daily-editorial-private-input.mjs';
import { prepareMarkdownProjection } from './daily-editorial-projection.mjs';

const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const serialize = (value) => Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
const decoder = new TextDecoder('utf-8', { fatal: true });
const hex64 = /^[a-f0-9]{64}$/;

function requireInput(condition, message) {
  if (!condition) throw new Error(`COMPACT_PROJECTION_INPUT_INVALID: ${message}`);
}

function compactFromProjection(prepared, descriptorBytes) {
  const { article, receipt } = prepared;
  const descriptor = JSON.parse(decoder.decode(descriptorBytes));
  const inventory = new Map(descriptor.files.map((entry) => [entry.file, entry]));
  const sourceManifest = receipt.sourceProvenance;
  const mappings = new Map(receipt.proseMappings.map((mapping) => [mapping.target, mapping]));
  const registryIds = new Set(receipt.contextRegistry.units.map((unit) => unit.id));
  for (const unit of receipt.contextRegistry.units) {
    requireInput(unit.closure.requiredUnitIds.every((id) => typeof id === 'string' && registryIds.has(id)),
      'complete retained registry dependency identities');
  }
  const boundFile = (file) => {
    const row = inventory.get(file);
    requireInput(row, 'fixed inventoried evidence reference');
    return { file, bytes: row.bytes, sha256: row.sha256 };
  };
  return {
    schemaVersion: 1, format: 'aft-private-article-refs-preparation-v1', preparationOnly: true,
    runtimeContractIntegrated: false,
    inputPin: {
      ...receipt.pin,
      // This is descriptive inventory metadata, never a path to fetch or execute.
      ...(descriptor.bundlePrefix === undefined ? {} : { bundlePrefix: descriptor.bundlePrefix }),
      descriptorBytes: descriptorBytes.byteLength,
      markdown: boundFile('localsend-guide.md'), sourceManifest: boundFile('source-manifest.json'),
      publicClaimMap: boundFile('public-claim-map.json'), evidenceContexts: boundFile('evidence-contexts.json'),
      contextRegistry: { ...boundFile('context-registry.json'), canonicalSha256: receipt.registrySha256,
        retainedUnitCount: receipt.contextRegistry.units.length },
      historicalMarkdownReview: { ...boundFile('context-independent-review.json'), appliesTo: 'accepted-markdown-context-only' },
      executionContract: boundFile('execution-contract.json'), packageManifest: boundFile('pilot-input-manifest.json'),
    },
    hydratedArticleSha256: receipt.privateArticleSha256, publicContentSha256: receipt.publicContentSha256,
    article: {
      schemaVersion: article.schemaVersion, slug: article.slug, title: article.title,
      summary: article.summary, problem: article.problem, project: article.project, researchedAt: article.researchedAt,
      sections: article.sections.map(({ heading, paragraphs }, sectionIndex) => ({ heading,
        paragraphs: paragraphs.map(({ text, sourceIds, evidence }, paragraphIndex) => {
          const mapping = mappings.get(`sections.${sectionIndex}.paragraphs.${paragraphIndex}`);
          requireInput(mapping && mapping.contextUnitIds.length === evidence.length, 'complete ordered closed evidence mapping');
          return { text, sourceIds, evidenceUnitIds: mapping.contextUnitIds };
        }) })),
      sources: article.sources.map(({ id, kind, url, fetchedAt, sha256 }) => {
        const source = sourceManifest.find((entry) => entry.id === id);
        requireInput(source && source.sha256 === sha256, 'exact source identity');
        return { id, kind, url, fetchedAt, sha256, contentRef: source.file };
      }),
    },
    jsonPublicationReview: null, humanOwnerApproval: false, artworkApproval: null,
    dispatchAllowed: false, publicationAllowed: false, publishedAt: null,
  };
}

/** Pure preparation only: no network, files, state, provider, publication or approval changes. */
export function prepareCompactMarkdownProjection(input) {
  const prepared = prepareMarkdownProjection(input);
  const compact = compactFromProjection(prepared, input.descriptorBytes);
  const compactBytes = serialize(compact);
  requireInput(compactBytes.byteLength <= MAX_PRIVATE_INPUT_FILE_BYTES, 'bounded compact artifact');
  return {
    compact, compactBytes,
    receipt: {
      schemaVersion: 1, preparationOnly: true, proposalStatus: 'held-not-publication-approved',
      compactBytes: compactBytes.byteLength, compactRawSha256: hash(compactBytes),
      compactCanonicalSha256: artworkJsonHash(compact), markdownSha256: prepared.receipt.markdownSha256,
      hydratedArticleSha256: prepared.receipt.privateArticleSha256, publicContentSha256: prepared.receipt.publicContentSha256,
      hydratedBytes: serialize(prepared.article).byteLength, hydratedRawSha256: hash(serialize(prepared.article)),
      inputPin: prepared.receipt.pin, inputFileCount: prepared.receipt.inputFileCount,
      retainedRegistryUnits: prepared.receipt.contextRegistry.units.length,
      evidenceOccurrences: prepared.article.sections.flatMap((section) => section.paragraphs)
        .reduce((count, paragraph) => count + paragraph.evidence.length, 0),
      publicationValidation: prepared.receipt.publicationValidation,
      historicalReviewAppliesToNewJson: false, jsonPublicationReview: null, humanOwnerApproval: false,
      artworkApproval: null, runtimeContractIntegrated: false, providerCalls: 0, remoteWrites: 0,
      dispatchAllowed: false, publicationAllowed: false, publishedAt: null,
    },
  };
}

/** Resolve only against independently supplied immutable bytes/pin and compact-file SHA.
 * References never cause reads. Rebuilding the complete projection also checks unused
 * registry units, dependencies and every inventoried file. Legacy publication holds
 * remain intact; callers must never send this compact wrapper to the daily runner.
 */
export function resolveCompactMarkdownProjection({ compactBytes, compactSha256, ...input }) {
  requireInput(compactBytes instanceof Uint8Array && compactBytes.byteLength > 0 &&
    compactBytes.byteLength <= MAX_PRIVATE_INPUT_FILE_BYTES && typeof compactSha256 === 'string' &&
    hex64.test(compactSha256) && hash(compactBytes) === compactSha256, 'bounded hash-bound compact bytes');
  const compact = JSON.parse(decoder.decode(compactBytes));
  const prepared = prepareMarkdownProjection(input);
  const expected = compactFromProjection(prepared, input.descriptorBytes);
  requireInput(artworkJsonHash(compact) === artworkJsonHash(expected), 'exact compact contract, pin, wording and evidence identities');
  // The projection is rebuilt from all original pinned bytes, rather than tiny
  // quote snippets or trust in a previously prepared object supplied by a caller.
  return {
    ...prepared,
    compactIdentity: { rawSha256: compactSha256, canonicalSha256: artworkJsonHash(compact),
      bytes: compactBytes.byteLength, hydratedArticleSha256: prepared.receipt.privateArticleSha256,
      publicContentSha256: prepared.receipt.publicContentSha256, preparationOnly: true, runtimeContractIntegrated: false },
  };
}
