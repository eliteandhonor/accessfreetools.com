import { createHash } from 'node:crypto';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { frontmatterFromMarkdown } from 'mdast-util-frontmatter';
import { frontmatter } from 'micromark-extension-frontmatter';
import { articleHash, validateArticle } from './daily-editorial-checks.mjs';
import { artworkJsonHash, publicContentHash } from './daily-editorial-artwork.mjs';
import { MAX_PRIVATE_INPUT_FILES, MAX_PRIVATE_INPUT_FILE_BYTES, MAX_PRIVATE_INPUT_BYTES } from './daily-editorial-private-input.mjs';

const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
const hex40 = /^[a-f0-9]{40}$/;
const hex64 = /^[a-f0-9]{64}$/;
const textDecoder = new TextDecoder('utf-8', { fatal: true });
const object = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const string = (value) => typeof value === 'string' && value.length > 0;
const relativePath = (value) => string(value) && /^[A-Za-z0-9_.\/-]+$/.test(value) &&
  !value.startsWith('/') && value.split('/').every((part) => part !== '' && part !== '.' && part !== '..');

function requireInput(condition, message) {
  if (!condition) throw new Error(`PROJECTION_INPUT_INVALID: ${message}`);
}

function utf8(bytes) {
  requireInput(bytes instanceof Uint8Array, 'inputs must be exact UTF-8 bytes');
  return textDecoder.decode(bytes);
}

/** This preparation function has no file, network, state, publication or approval side effects. */
export function prepareMarkdownProjection({ files, descriptorBytes, pin, validationNow = new Date() }) {
  requireInput(files instanceof Map, 'files must be a relative-path byte map');
  requireInput(validationNow instanceof Date && Number.isFinite(validationNow.getTime()), 'actual validation clock');
  requireInput(object(pin) && string(pin.repository) && /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(pin.repository) &&
    typeof pin.commit === 'string' && hex40.test(pin.commit) && relativePath(pin.descriptorPath) &&
    typeof pin.descriptorSha256 === 'string' && hex64.test(pin.descriptorSha256), 'immutable private input pin');
  requireInput(descriptorBytes instanceof Uint8Array && descriptorBytes.byteLength <= MAX_PRIVATE_INPUT_FILE_BYTES &&
    digest(descriptorBytes) === pin.descriptorSha256, 'descriptor raw-byte hash and size');
  const descriptor = JSON.parse(utf8(descriptorBytes));
  requireInput(Array.isArray(descriptor.files) && descriptor.files.length > 0 && descriptor.files.length <= MAX_PRIVATE_INPUT_FILES &&
    typeof descriptor.articleSha256 === 'string' && hex64.test(descriptor.articleSha256), 'descriptor inventory');
  const inventory = new Map();
  let totalBytes = 0;
  for (const entry of descriptor.files) {
    requireInput(object(entry) && relativePath(entry.file) && !inventory.has(entry.file) &&
      Number.isSafeInteger(entry.bytes) && entry.bytes >= 1 && entry.bytes <= MAX_PRIVATE_INPUT_FILE_BYTES &&
      typeof entry.sha256 === 'string' && hex64.test(entry.sha256), 'unique bounded inventory rows');
    const bytes = files.get(entry.file);
    requireInput(bytes instanceof Uint8Array && bytes.byteLength === entry.bytes && digest(bytes) === entry.sha256,
      `pinned bytes for ${entry.file}`);
    inventory.set(entry.file, entry);
    totalBytes += entry.bytes;
    requireInput(totalBytes <= MAX_PRIVATE_INPUT_BYTES, 'total bounded private input bytes');
  }
  const read = (path) => {
    requireInput(inventory.has(path), `missing pinned ${path}`);
    return utf8(files.get(path));
  };
  const json = (path) => JSON.parse(read(path));
  const markdown = read('localsend-guide.md');
  const markdownSha256 = digest(files.get('localsend-guide.md'));
  requireInput(markdownSha256 === descriptor.articleSha256, 'exact accepted Markdown identity');
  const sourceManifest = json('source-manifest.json');
  const claimMap = json('public-claim-map.json');
  const contexts = json('evidence-contexts.json');
  const registry = json('context-registry.json');
  const priorReview = json('context-independent-review.json');
  const contract = json('execution-contract.json');
  const manifest = json('pilot-input-manifest.json');
  const registrySha256 = artworkJsonHash(registry);
  requireInput([sourceManifest, claimMap, contexts, registry, priorReview, contract, manifest].every((record) =>
    record.articleSha256 === markdownSha256), 'Markdown-bound input records');
  requireInput(registrySha256 === descriptor.contextRegistrySha256 && priorReview.registrySha256 === registrySha256 &&
    contract.contextRegistrySha256 === registrySha256 &&
    registry.sourceManifestSha256 === artworkJsonHash(sourceManifest) &&
    registry.publicClaimMapSha256 === artworkJsonHash(claimMap), 'canonical registry/source/claim bindings');
  requireInput(inventory.get('execution-contract.json').sha256 === descriptor.executionContractSha256 &&
    inventory.get('pilot-input-manifest.json').sha256 === descriptor.manifestSha256 &&
    contract.contextReview?.sha256 === inventory.get('context-independent-review.json').sha256,
  'actual pinned contract, manifest and historical Markdown context review');
  requireInput(contract.publicationAllowed === false && manifest.dispatchAllowed === false && manifest.approvedGrant === false,
    'input package must remain held');

  const tree = fromMarkdown(markdown, {
    extensions: [frontmatter(['yaml'])], mdastExtensions: [frontmatterFromMarkdown(['yaml'])],
  });
  requireInput(tree.children[0]?.type === 'yaml', 'one leading flat frontmatter block');
  const metadata = {};
  for (const line of tree.children[0].value.split('\n')) {
    if (line === '') continue;
    const match = line.match(/^([A-Za-z][A-Za-z0-9]*): (.+)$/);
    requireInput(match && !Object.hasOwn(metadata, match[1]), 'unique flat scalar frontmatter');
    const value = match[2].startsWith('"') ? JSON.parse(match[2]) : match[2];
    requireInput(typeof value === 'string' && !/^[\[\]{&*!|>]/.test(value), 'string frontmatter values');
    metadata[match[1]] = value;
  }
  for (const name of ['slug', 'title', 'description', 'researchDate', 'project', 'license', 'release', 'releasePublishedAt', 'releaseCommit']) {
    requireInput(string(metadata[name]), `frontmatter ${name}`);
  }

  const sourceMap = new Map();
  const sourceProvenance = [];
  requireInput(Array.isArray(sourceManifest.sources) && sourceManifest.sources.length > 0 && sourceManifest.sources.length <= 25,
    'bounded source inventory');
  for (const source of sourceManifest.sources) {
    requireInput(object(source) && string(source.id) && !sourceMap.has(source.id) && inventory.has(source.file) &&
      string(source.kind) && string(source.url), 'source identity');
    const text = read(source.file);
    requireInput(digest(files.get(source.file)) === source.sha256 && files.get(source.file).byteLength === source.bytes,
      `source bytes for ${source.id}`);
    // Keep the actual inventory kind and any captured timestamp. Missing values are
    // explicit nulls; a preparation adapter must not invent a fetch or metadata response.
    sourceMap.set(source.id, { id: source.id, kind: source.kind, url: source.url,
      fetchedAt: source.fetchedAt ?? null, text, sha256: source.sha256 });
    sourceProvenance.push({ ...source, fetchedAtMissing: source.fetchedAt === undefined });
  }
  requireInput(object(priorReview.sourceHashes) && sourceMap.size === Object.keys(priorReview.sourceHashes).length &&
    [...sourceMap].every(([id, source]) => priorReview.sourceHashes[id] === source.sha256), 'prior review source identities');
  const evidenceMap = new Map();
  const registryMap = new Map();
  requireInput(Array.isArray(contexts.evidence) && Array.isArray(registry.units) &&
    contexts.evidence.length === registry.units.length, 'complete context/registry collections');
  for (const context of contexts.evidence) {
    requireInput(object(context) && string(context.id) && !evidenceMap.has(context.id) && sourceMap.has(context.sourceId) &&
      string(context.text) && digest(context.text) === context.contextSha256 &&
      sourceMap.get(context.sourceId).sha256 === context.sourceSha256, 'exact source-bound context');
    evidenceMap.set(context.id, context);
  }
  for (const unit of registry.units) {
    const context = evidenceMap.get(unit.id);
    requireInput(context && !registryMap.has(unit.id) && unit.sourceId === context.sourceId &&
      unit.sourceSha256 === context.sourceSha256 && unit.contextSha256 === context.contextSha256 &&
      ['whole-source', 'reviewed-extraction'].includes(unit.mode) &&
      Array.isArray(unit.closure?.requiredUnitIds), 'exact registry context identities');
    registryMap.set(unit.id, unit);
  }
  requireInput(Array.isArray(priorReview.unitIds) && priorReview.unitIds.length === registryMap.size &&
    new Set(priorReview.unitIds).size === registryMap.size && priorReview.unitIds.every((id) => registryMap.has(id)),
  'complete historical Markdown context review identities');

  const lineOffsets = [0];
  for (let index = 0; index < markdown.length; index++) if (markdown[index] === '\n') lineOffsets.push(index + 1);
  const claims = new Map();
  for (const unit of claimMap.publicUnits ?? []) {
    requireInput(string(unit.id) && !claims.has(unit.id) && string(unit.text) && Number.isInteger(unit.locator?.line), 'public claim unit');
    const lineStart = lineOffsets[unit.locator.line - 1];
    requireInput(lineStart !== undefined, 'claim source line');
    let start;
    if (unit.locator.frontmatter) {
      requireInput(metadata[unit.locator.frontmatter] === unit.text, 'frontmatter claim identity');
      start = null;
    } else {
      start = lineStart + (unit.locator.startCharacter ?? 0);
      requireInput(markdown.slice(start, start + unit.text.length) === unit.text &&
        (unit.locator.endCharacter === undefined || unit.locator.endCharacter === (unit.locator.startCharacter ?? 0) + unit.text.length),
      `exact claim span ${unit.id}`);
    }
    claims.set(unit.id, { ...unit, start, end: start === null ? null : start + unit.text.length });
  }
  requireInput(claims.size > 0 && Array.isArray(claimMap.groups), 'actual claim mapping');
  for (const group of claimMap.groups) requireInput(string(group.id) && Array.isArray(group.units) &&
    group.units.length > 0 && group.units.every((id) => claims.has(id)) && Array.isArray(group.evidence) &&
    group.evidence.length > 0 && group.evidence.every((id) => registryMap.has(id)), 'complete claim group evidence');
  for (const id of claims.keys()) requireInput(claimMap.groups.some((group) => group.units.includes(id)),
    `claim unit without evidence group ${id}`);
  const coveredClaims = new Set();
  const mappings = [];
  const links = [];
  function plain(node) {
    if (node.type === 'text' || node.type === 'inlineCode') return node.value;
    if (['strong', 'emphasis', 'link'].includes(node.type)) {
      const value = node.children.map(plain).join('');
      if (node.type === 'link') links.push({ label: value, url: node.url, title: node.title ?? null,
        start: node.position.start.offset, end: node.position.end.offset });
      return value;
    }
    requireInput(false, `unsupported inline Markdown ${node.type}`);
  }
  const inlineText = (node) => node.children.map(plain).join('');
  function mapSpan(node, target, extra = {}) {
    const start = node.position.start.offset;
    const end = node.position.end.offset;
    const unitIds = [...claims].filter(([, unit]) => unit.start !== null && unit.start >= start && unit.end <= end).map(([id]) => id);
    requireInput(unitIds.length > 0, `unmapped authored block ${target}`);
    const spans = unitIds.map((id) => claims.get(id));
    for (let offset = start; offset < end; offset++) requireInput(/\s/u.test(markdown[offset]) ||
      spans.some((unit) => unit.start <= offset && offset < unit.end), `unmapped authored wording ${target}`);
    unitIds.forEach((id) => coveredClaims.add(id));
    const groups = claimMap.groups.filter((group) => group.units.some((id) => unitIds.includes(id)));
    requireInput(groups.length > 0, `unmapped claim groups ${target}`);
    const required = new Set();
    const visit = (id) => {
      if (required.has(id)) return;
      const unit = registryMap.get(id);
      requireInput(unit, `missing dependency ${id}`);
      required.add(id);
      unit.closure.requiredUnitIds.forEach(visit);
    };
    groups.forEach((group) => group.evidence.forEach(visit));
    const contextUnitIds = registry.units.filter((unit) => required.has(unit.id)).map((unit) => unit.id);
    const mapping = { target, start, end, originalMarkdown: markdown.slice(start, end), publicUnitIds: unitIds,
      claimGroupIds: groups.map((group) => group.id), contextUnitIds,
      effectiveContexts: contextUnitIds.map((id) => {
        const unit = registryMap.get(id);
        return { id, mode: unit.mode, sourceId: unit.sourceId, sourceSha256: unit.sourceSha256,
          declaredContextSha256: unit.contextSha256,
          effectiveContextSha256: unit.mode === 'whole-source' ? unit.sourceSha256 : unit.contextSha256 };
      }), ...extra };
    mappings.push(mapping);
    return { mapping, evidence: contextUnitIds.map((id) => {
      const context = evidenceMap.get(id);
      return { sourceId: context.sourceId,
        quote: registryMap.get(id).mode === 'whole-source' ? sourceMap.get(context.sourceId).text : context.text };
    }) };
  }
  const headings = tree.children.filter((node) => node.type === 'heading' && node.depth === 1);
  requireInput(headings.length === 1 && inlineText(headings[0]) === metadata.title, 'exact single H1/frontmatter title');
  const titleMap = mapSpan(headings[0], 'title');
  const body = tree.children.slice(1);
  requireInput(body[0] === headings[0] && body[1]?.type === 'paragraph' && body[2]?.type === 'paragraph' &&
    body[3]?.type === 'heading' && body[3].depth === 2, 'exact two opener paragraphs before H2 sections');
  const problem = inlineText(body[1]);
  const summary = inlineText(body[2]);
  mapSpan(body[1], 'problem');
  mapSpan(body[2], 'summary');
  const sections = [];
  for (const node of body.slice(3)) {
    if (node.type === 'heading') {
      requireInput(node.depth === 2, 'only original H2 sections');
      const index = sections.length;
      sections.push({ heading: inlineText(node), paragraphs: [] });
      mapSpan(node, `sections.${index}.heading`);
      continue;
    }
    requireInput(sections.length > 0, 'section body follows original H2');
    const append = (paragraph, spanNode, list) => {
      const section = sections.at(-1);
      const target = `sections.${sections.length - 1}.paragraphs.${section.paragraphs.length}`;
      const { evidence } = mapSpan(spanNode, target, list ?? {});
      const text = `${list?.marker ? `${list.marker} ` : ''}${inlineText(paragraph)}`;
      section.paragraphs.push({ text, sourceIds: [...new Set(evidence.map((item) => item.sourceId))], evidence });
    };
    if (node.type === 'paragraph') append(node, node);
    else if (node.type === 'list') {
      requireInput(node.children.length > 0, 'nonempty list');
      for (const item of node.children) {
        requireInput(item.children.length === 1 && item.children[0].type === 'paragraph' && item.checked === null,
          'only simple original one-paragraph list items');
        const original = markdown.slice(item.position.start.offset, item.position.end.offset);
        const marker = original.match(/^(\d+[.)]|[-+*]) /)?.[1];
        requireInput(marker, 'original list marker');
        append(item.children[0], item, { originalList: node.ordered ? 'ordered' : 'unordered', marker });
      }
    } else requireInput(false, `unsupported body Markdown ${node.type}`);
  }
  for (const [id, unit] of claims) if (unit.locator.frontmatter) {
    coveredClaims.add(id);
    mappings.push({ target: `privateFrontmatter.${unit.locator.frontmatter}`, publicUnitIds: [id],
      value: unit.text, rendered: unit.locator.frontmatter === 'title',
      oldVisualApprovalAdopted: false });
  }
  requireInput(coveredClaims.size === claims.size && sections.every((section) => section.paragraphs.length > 0),
    'complete authored-block and frontmatter accounting');
  const article = { schemaVersion: 1, slug: metadata.slug, title: metadata.title, summary, problem,
    project: { fullName: metadata.project, url: `https://github.com/${metadata.project}`, commit: metadata.releaseCommit,
      license: metadata.license, release: { tag: metadata.release, publishedAt: metadata.releasePublishedAt } },
    // The accepted document records a day, not a clock time. Keep that exact
    // value and let the unchanged publication validator report the missing time.
    researchedAt: metadata.researchDate, sections, sources: [...sourceMap.values()] };
  const privateArticleSha256 = articleHash(article);
  const publicProjection = { schemaVersion: 1, slug: article.slug, title: article.title, summary: article.summary, problem: article.problem,
    project: article.project, researchedAt: article.researchedAt, artwork: { articleSha256: privateArticleSha256 },
    sections: article.sections.map(({ heading, paragraphs }) => ({ heading, paragraphs: paragraphs.map(({ text, sourceIds }) => ({ text, sourceIds })) })),
    sources: article.sources.map(({ id, kind, url, fetchedAt, sha256 }) => ({ id, kind, url, fetchedAt, sha256 })) };
  const publicContentSha256 = publicContentHash(publicProjection);
  requireInput(publicContentSha256 === publicContentHash(article), 'public/private content identity');
  const publicationValidation = validateArticle(article, { now: validationNow, catalog: [] });
  const receipt = { schemaVersion: 1, preparationOnly: true, proposalStatus: 'held-not-publication-approved',
    pin: { repository: pin.repository, commit: pin.commit, descriptorPath: pin.descriptorPath, descriptorSha256: pin.descriptorSha256 },
    validationAt: validationNow.toISOString(), inputFileCount: inventory.size, inputBytes: totalBytes,
    markdownSha256, privateArticleSha256, publicContentSha256,
    registrySha256, inputBindings: descriptor.files.map(({ file, bytes, sha256 }) => ({ file, bytes, sha256 })),
    privateFrontmatter: metadata, proseMappings: mappings, originalLinks: links, sourceProvenance,
    contextRegistry: registry, historicalMarkdownContextReview: priorReview, pinnedExecutionContract: contract,
    historicalReviewAppliesToNewJson: false, projectionPublicationReview: null, artworkApproval: null,
    providerCalls: 0, remoteWrites: 0, publishedAt: null, publicationAllowed: false, dispatchAllowed: false,
    publicationValidation,
    representationLimits: [
      'Markdown emphasis and link syntax removed mechanically; exact visible link labels and destinations retained in private mappings.',
      'The two opener paragraphs map in order to problem and summary. Frontmatter description is retained privately without an added rendered paragraph.',
      'Original ordered and unordered list markers are literal paragraph prefixes; existing daily renderer does not emit semantic ol/ul elements.',
      'Original source kinds, URLs and full closed evidence contexts are preserved even where the existing daily publication schema holds them.',
      'The accepted research day is not a fetched-at clock timestamp. Missing source fetch timestamps remain null.',
      'Historical source/context judgments bind the Markdown and retained evidence, not publication approval of this new JSON projection.',
      'No publication time, human approval, new artwork, provider result, runtime or hands-on test is supplied.',
    ], titleContextUnitIds: titleMap.mapping.contextUnitIds };
  return { article, publicProjection, receipt };
}
