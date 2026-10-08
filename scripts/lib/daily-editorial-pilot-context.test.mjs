import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadPilotContextBundle, proposePilotContextSpecs, freezePilotContextSpecs, validatePilotContextBundle,
  packPilotContextBatches, validateFrozenPilotRequests, validateFrozenPilotDiagnostics } from './daily-editorial-pilot-context.mjs';

const sha = (text) => createHash('sha256').update(text).digest('hex');
const now = new Date('2026-10-08T13:00:00.000Z');
function fixture() {
  const articleText = 'Synthetic exact draft: offline work, platform-limited saving, and the save label.\n';
  const articleSha256 = sha(articleText);
  const sourceTexts = {
    prose: 'The tool works offline.\n\nOnly the paid edition can upload to remote servers.\n',
    code: 'bool platformAllowed = platformCheck();\nWidget build() {\n  if (platformAllowed) {\n    showSave();\n  }\n}\n',
    platform: 'bool platformCheck() { return false; }\n',
    labels: JSON.stringify({ general: { accept: 'Accept' }, save: { label: '@:general.accept', limitation: 'Only allowed platforms.' } }),
  };
  const commit = 'a'.repeat(40);
  const sources = Object.entries(sourceTexts).map(([id, text]) => ({ id, file: `public-sources/${id}.txt`,
    url: `https://github.com/fixture/project/blob/${commit}/${id}.txt`, commit,
    blobSha: createHash('sha1').update(`blob ${Buffer.byteLength(text)}\0`).update(text).digest('hex'),
    gitBlobVerified: true, immutable: true, bytes: Buffer.byteLength(text), sha256: sha(text) }));
  const code = sourceTexts.code.slice(sourceTexts.code.indexOf('Widget build()')).trim();
  const units = [
    { id: 'e-prose', sourceId: 'prose', kind: 'complete-prose-paragraph-manual-selection', locator: { exactUniqueQuote: 'The tool works offline.' }, text: 'The tool works offline.' },
    { id: 'e-code', sourceId: 'code', kind: 'complete-code-function', locator: { startByte: sourceTexts.code.indexOf('Widget build()'), endByte: Buffer.byteLength(sourceTexts.code) }, text: code },
    { id: 'e-platform', sourceId: 'platform', kind: 'complete-code-module', locator: 'entire file', text: sourceTexts.platform },
    { id: 'e-label', sourceId: 'labels', kind: 'complete-json-value', locator: { jsonPointer: '/save' }, text: JSON.stringify(JSON.parse(sourceTexts.labels).save) },
  ].map((unit) => ({ ...unit, contextSha256: sha(unit.text), sourceSha256: sha(sourceTexts[unit.sourceId]) }));
  const publicClaimMap = { articleSha256, publicUnits: [
    { id: 'body-0', kind: 'paragraph', text: 'The tool works offline.' },
    { id: 'body-1', kind: 'paragraph', text: 'Saving is limited to allowed platforms.' },
    { id: 'body-2', kind: 'paragraph', text: 'The save action uses the Accept label.' },
  ], groups: [
    { id: 'offline', kind: 'source', units: ['body-0'], evidence: ['e-prose'] },
    { id: 'saving', kind: 'source', units: ['body-1'], evidence: ['e-code'] },
    { id: 'label', kind: 'source', units: ['body-2'], evidence: ['e-label'] },
  ] };
  return { articleText, sourceTexts, sourceManifest: { articleSha256, sources }, evidenceContexts: { articleSha256, evidence: units }, publicClaimMap };
}
function approved(bundle = fixture(), options = {}) {
  const closures = Object.fromEntries(bundle.evidenceContexts.evidence.map((unit) => [unit.id, {
    fullSourceReviewed: true, outerScopeCovered: true, dependencyClosureReviewed: true,
    requiredUnitIds: unit.id === 'e-code' ? ['e-platform'] : [],
  }]));
  const registry = freezePilotContextSpecs(proposePilotContextSpecs(bundle, { preparedBy: 'fixture-preparer', closures, ...options }));
  const parentReview = { decision: 'context-units-approved', ref: 'fixture-independent-parent-review', reviewer: 'fixture-independent-reviewer',
    reviewedAt: '2026-10-08T12:00:00.000Z', articleSha256: registry.registry.articleSha256, registrySha256: registry.registrySha256,
    sourceHashes: Object.fromEntries(bundle.sourceManifest.sources.map((source) => [source.id, source.sha256])),
    unitIds: bundle.evidenceContexts.evidence.map(({ id }) => id) };
  return { bundle, registry, parentReview, report: validatePilotContextBundle(bundle, { registry, parentReview, now }) };
}
const questions = Object.fromEntries(['offline', 'saving', 'label'].map((id) => [id, { type: 'choice', instructions: `Assess only the assigned ${id} claims.`,
  criteria: { supported: 'Every implication is supported by retained complete context.', contradicted: 'An implication is contradicted.', insufficient: 'Evidence is absent or uncertain.' } }]));

describe('pilot context admission is exact, independent, and scoped', () => {
  it('keeps the public synthetic descriptor fixture fixed and unapproved without raw source content', () => {
    const text = readFileSync(new URL('../fixtures/daily-editorial/pilot-context-registry-synthetic.json', import.meta.url), 'utf8');
    expect(sha(text)).toBe('c0177d420f694d81dab64a5142241952c3b499a577e52b249d2857334a89ad94');
    const frozen = JSON.parse(text);
    expect(freezePilotContextSpecs(frozen).registrySha256).toBe('6b2aeb7700e17a498a44492d9c2b314ead7ae69456d13e1c0a1c3c6992e65ef8');
    expect(frozen.registry.units.every(({ closure }) => !closure.fullSourceReviewed && !closure.outerScopeCovered && !closure.dependencyClosureReviewed)).toBe(true);
    expect(frozen.registry.units.every((unit) => !Object.hasOwn(unit, 'text'))).toBe(true);
  });
  it('proposals contain no raw sources, cannot self-approve, and freeze deterministically', () => {
    const bundle = fixture();
    const registry = freezePilotContextSpecs(proposePilotContextSpecs(bundle, { preparedBy: 'fixture-preparer' }));
    expect(Object.isFrozen(registry.registry.units[0].closure)).toBe(true);
    expect(JSON.stringify(registry)).not.toContain(bundle.sourceTexts.prose);
    const report = validatePilotContextBundle(bundle, { registry, now });
    expect(report.assessed).toHaveLength(0);
    expect(report.unassessed.every((unit) => unit.reasons.includes('PARENT_CONTEXT_REVIEW_REQUIRED'))).toBe(true);
    expect(freezePilotContextSpecs(JSON.parse(JSON.stringify(registry.registry))).registrySha256).toBe(registry.registrySha256);
  });

  it('admitted complete units remain context-only, with whole sources retaining distant qualifiers', () => {
    const { report, bundle } = approved();
    expect(report.passed).toBe(true);
    expect(report.assessed.find(({ id }) => id === 'e-prose').text).toBe(bundle.sourceTexts.prose);
    expect(report.assessed.find(({ id }) => id === 'e-label').text).toBe(bundle.sourceTexts.labels);
    expect(report.assessed.every((unit) => unit.contextAdmissionOnly && !unit.factualClaimsApproved && !unit.publicationApproved)).toBe(true);
  });

  it.each(['fullSourceReviewed', 'outerScopeCovered', 'dependencyClosureReviewed'])('holds omitted %s review independently of a balanced code fragment', (flag) => {
    const value = approved(); const changed = structuredClone(value.registry.registry);
    changed.units.find(({ id }) => id === 'e-code').closure[flag] = false;
    const registry = freezePilotContextSpecs(changed);
    const parentReview = { ...value.parentReview, registrySha256: registry.registrySha256 };
    const report = validatePilotContextBundle(value.bundle, { registry, parentReview, now });
    expect(report.passed).toBe(false);
    expect(report.unassessed.some(({ id }) => id === 'e-code')).toBe(true);
  });

  it('holds changed complete source, added distant contradiction, or outer platform condition even if the selected unit is unchanged', () => {
    const value = approved();
    for (const sourceId of ['prose', 'code']) {
      const bundle = structuredClone(value.bundle); bundle.sourceTexts[sourceId] += '\nEverything above is disabled in released builds.\n';
      const report = validatePilotContextBundle(bundle, { ...value, now });
      expect(report.passed).toBe(false);
      expect(report.sourceChecks.find(({ id }) => id === sourceId).reasons).toContain('FULL_SOURCE_HASH_MISMATCH');
    }
  });

  it('holds altered source locators and public wordings under the previous registry review', () => {
    const value = approved();
    const sourceChanged = structuredClone(value.bundle); sourceChanged.sourceManifest.sources[0].url = sourceChanged.sourceManifest.sources[0].url.replace('fixture/project', 'other/project');
    expect(validatePilotContextBundle(sourceChanged, { ...value, now }).unassessed[0].reasons).toContain('SOURCE_MANIFEST_HASH_MISMATCH');
    const publicChanged = structuredClone(value.bundle); publicChanged.publicClaimMap.publicUnits[0].text = 'A fabricated claim.';
    expect(validatePilotContextBundle(publicChanged, { ...value, now }).unassessed[0].reasons).toContain('PUBLIC_CLAIM_MAP_HASH_MISMATCH');
  });

  it('requires a distinct parent reviewer and exact draft/registry/source approval bindings', () => {
    const value = approved();
    for (const patch of [{ reviewer: 'fixture-preparer' }, { articleSha256: '0'.repeat(64) }, { registrySha256: '0'.repeat(64) }, { sourceHashes: {} }, { unitIds: [] }]) {
      expect(validatePilotContextBundle(value.bundle, { ...value, parentReview: { ...value.parentReview, ...patch }, now }).passed).toBe(false);
    }
  });

  it('holds missing source snapshots and propagates unassessed helper closure', () => {
    const value = approved(); delete value.bundle.sourceTexts.platform;
    const report = validatePilotContextBundle(value.bundle, { ...value, now });
    expect(report.unassessed.find(({ id }) => id === 'e-platform').reasons).toContain('SOURCE_SNAPSHOT_MISSING');
    expect(report.unassessed.find(({ id }) => id === 'e-code').reasons).toContain('REQUIRED_CONTEXT_UNIT_UNASSESSED');
  });

  it('does not admit arbitrary partial code or JSON fragments merely labeled complete', () => {
    for (const id of ['e-code', 'e-label']) {
      const bundle = fixture(); const unit = bundle.evidenceContexts.evidence.find((row) => row.id === id);
      unit.text = id === 'e-code' ? 'showSave();' : '{"label":"Accept"}'; unit.contextSha256 = sha(unit.text);
      const report = approved(bundle).report;
      expect(report.unassessed.find((row) => row.id === id).reasons).toContain('DECLARED_UNIT_MISMATCH');
    }
  });

  it('holds modified unit locators and incomplete JSON paths', () => {
    const bundle = fixture(); bundle.evidenceContexts.evidence.find(({ id }) => id === 'e-label').locator.jsonPointer = '/save/missing';
    expect(approved(bundle).report.unassessed.find(({ id }) => id === 'e-label').reasons).toContain('JSON_POINTER_MISSING');
  });

  it('loads bounded named private files without exposing a source or following an escaping path', () => {
    const root = mkdtempSync(join(tmpdir(), 'pilot-context-fixture-'));
    try {
      const bundle = fixture(); mkdirSync(join(root, 'public-sources'));
      for (const [file, data] of [['source-manifest.json', bundle.sourceManifest], ['evidence-contexts.json', bundle.evidenceContexts], ['public-claim-map.json', bundle.publicClaimMap]]) writeFileSync(join(root, file), JSON.stringify(data));
      writeFileSync(join(root, 'localsend-guide.md'), bundle.articleText);
      for (const source of bundle.sourceManifest.sources) writeFileSync(join(root, source.file), bundle.sourceTexts[source.id]);
      expect(loadPilotContextBundle(root)).toEqual(bundle);
      bundle.sourceManifest.sources[0].file = '/etc/passwd'; writeFileSync(join(root, 'source-manifest.json'), JSON.stringify(bundle.sourceManifest));
      expect(() => loadPilotContextBundle(root)).toThrow('PRIVATE_FILE_PATH_INVALID');
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
});

describe('bounded requests retain complete scoped closures', () => {
  it('packs deduplicated full source contexts and includes required platform helpers', () => {
    const report = approved().report;
    const packed = packPilotContextBatches(report, { questions });
    expect(packed.passed).toBe(true);
    expect(packed.requestBytes.every((size) => size <= 25000)).toBe(true);
    const payload = packed.batches.find((batch) => batch.state.evidenceUnits.some(({ id }) => id === 'e-code'));
    expect(payload.state.evidenceUnits.some(({ id }) => id === 'e-platform')).toBe(true);
    expect(payload.state.contexts.some(({ text }) => text.includes('Only the paid edition'))).toBe(true);
    const ollama = packPilotContextBatches(report, { provider: 'ollama', questions });
    expect(ollama.requestBytes.every((size) => size <= 56000)).toBe(true);
  });

  it('holds an oversized complete group instead of splitting or clipping its condition', () => {
    const bundle = fixture(); bundle.sourceTexts.prose += 'Qualification matters. '.repeat(1300);
    const source = bundle.sourceManifest.sources.find(({ id }) => id === 'prose'); source.sha256 = sha(bundle.sourceTexts.prose); source.bytes = Buffer.byteLength(bundle.sourceTexts.prose);
    source.blobSha = createHash('sha1').update(`blob ${source.bytes}\0`).update(bundle.sourceTexts.prose).digest('hex');
    bundle.evidenceContexts.evidence[0].sourceSha256 = source.sha256;
    const report = approved(bundle, { modes: { 'e-prose': 'whole-source' } }).report;
    const packed = packPilotContextBatches(report, { questions });
    expect(packed.passed).toBe(false);
    expect(packed.unassessed.find(({ id }) => id === 'offline').reasons).toContain('COMPLETE_QUESTION_CONTEXT_OVER_BOUND');
  });

  it('rejects untyped or invalid inference questions before constructing a paid-call payload', () => {
    const report = approved().report;
    const invalid = { ...questions, offline: { type: 'choice', instructions: 'Review this.', criteria: { single: 'Only one outcome.' } } };
    expect(packPilotContextBatches(report, { questions: invalid }).unassessed.find(({ id }) => id === 'offline').reasons).toContain('TYPED_QUESTION_INVALID');
  });

  function frozenRequest(value, provider = 'typesafe') {
    const report = value.report;
    const evidence = report.assessed.map((unit) => ({ id: unit.id, sourceId: unit.sourceId, text: unit.text, contextSha256: sha(unit.text), sourceSha256: unit.sourceSha256, kind: unit.kind, locator: unit.locator }));
    const groups = value.bundle.publicClaimMap.groups;
    const state = { articleSha256: report.articleSha256, evidence };
    let payload;
    if (provider === 'typesafe') payload = { model: 'jev-1.13.0', state: { ...state, groups: groups.map((group) => ({ id: group.id, kind: group.kind, evidenceIds: group.evidence,
      publicWording: group.units.map((id) => ({ id, wording: value.bundle.publicClaimMap.publicUnits.find((unit) => unit.id === id).text })) })) }, questions };
    else payload = { model: 'gpt-oss:120b', messages: [{ role: 'system', content: 'Review supplied groups only; no publication approval.' }, { role: 'user', content: JSON.stringify({ ...state, exactArticleMarkdown: value.bundle.articleText, assignedGroups: groups, publicUnits: value.bundle.publicClaimMap.publicUnits }) }], stream: false, options: { num_predict: 700 } };
    const text = JSON.stringify(payload, null, 2);
    return { record: { id: 'request-1', text }, expectedHashes: { 'request-1': sha(text) } };
  }

  it.each(['typesafe', 'ollama'])('validates frozen %s payloads without rebuilding their bytes or claiming approval', (provider) => {
    const value = approved(); const request = frozenRequest(value, provider);
    const result = validateFrozenPilotRequests(value.report, [request.record], { provider, expectedHashes: request.expectedHashes });
    expect(result.passed).toBe(true);
    expect(result.requests[0].payload).toEqual(JSON.parse(request.record.text));
    expect(result.requests[0].requestSha256).toBe(sha(request.record.text));
    expect(result.factualClaimsApproved).toBe(false);
  });

  it.each(['typesafe', 'ollama'])('accepts safe frozen %s request filename identities and rejects path traversal', (provider) => {
    const value = approved(); const request = frozenRequest(value, provider);
    const id = provider === 'typesafe' ? 'requests/typesafe-1.json' : 'requests/ollama-exact-draft-review-1.json';
    expect(validateFrozenPilotRequests(value.report, [{ ...request.record, id }], { provider, expectedHashes: { [id]: sha(request.record.text) } }).passed).toBe(true);
    for (const unsafe of ['/requests/typesafe-1.json', 'requests/../typesafe-1.json', 'requests/%2e%2e/typesafe-1.json', 'requests\\typesafe-1.json']) {
      expect(validateFrozenPilotRequests(value.report, [{ ...request.record, id: unsafe }], { provider, expectedHashes: { [unsafe]: sha(request.record.text) } }).unassessed[0].reasons).toContain('FROZEN_REQUEST_SCHEMA_INVALID');
    }
  });

  it('rejects changed frozen body, selective context, omitted helper, missing group, and mismatched public wording', () => {
    const value = approved(); const request = frozenRequest(value);
    expect(validateFrozenPilotRequests(value.report, [{ ...request.record, text: request.record.text + '\n' }], { expectedHashes: request.expectedHashes }).passed).toBe(false);
    for (const mutate of [
      (payload) => { payload.state.evidence[0].text = 'The tool works offline.'; payload.state.evidence[0].contextSha256 = sha(payload.state.evidence[0].text); },
      (payload) => { payload.state.evidence = payload.state.evidence.filter(({ id }) => id !== 'e-platform'); },
      (payload) => { payload.state.groups.pop(); delete payload.questions.label; },
      (payload) => { payload.state.groups[0].publicWording[0].wording = 'Changed wording.'; },
    ]) {
      const payload = JSON.parse(request.record.text); mutate(payload); const text = JSON.stringify(payload);
      expect(validateFrozenPilotRequests(value.report, [{ id: 'request-1', text }], { expectedHashes: { 'request-1': sha(text) } }).passed).toBe(false);
    }
  });
});

describe('separate frozen diagnostics bind complete admitted evidence', () => {
  function diagnostics(value) {
    const evidence = value.report.assessed.map((unit) => ({ id: unit.id, sourceId: unit.sourceId, text: unit.text,
      contextSha256: sha(unit.text), sourceSha256: unit.sourceSha256, kind: unit.kind, locator: unit.locator }));
    const choice = questions.saving;
    const noul = { type: 'noul', instructions: 'Assess this diagnostic comparison only.', criteria: { true: 'Same problem.', false: 'Different problem.' } };
    const payload = { model: 'jev-1.13.0', questions: {
      clarity: { type: 'score', instructions: 'Assess exact draft clarity.', criteria: ['Unclear.', 'Clear.'] },
      actual_duplicate: noul, control_support: choice, control_contradiction: choice, control_insufficient: choice,
      duplicate_control_positive: noul, duplicate_control_negative: noul,
    }, state: { articleSha256: value.report.articleSha256, exactArticleMarkdown: value.bundle.articleText, groups: [], evidence,
      previous: [{ slug: 'old-guide', text: 'A different synthetic reader problem.' }], controls: {
        support: { wording: 'Saving has a platform guard.', evidenceId: 'e-code' },
        contradiction: { wording: 'Saving never has a guard.', evidenceId: 'e-code' },
        insufficient: { wording: 'A measured transfer takes one second.', evidenceId: 'e-code' },
        duplicatePositive: { previousSummary: 'Synthetic offline work and saving.' }, duplicateNegative: { previousSummary: 'A cooking article.' },
      } } };
    const text = JSON.stringify(payload, null, 2);
    return { id: 'requests/typesafe-6.json', text };
  }

  it('validates the separate exact draft/control request without factual or funding approval', () => {
    const value = approved(); const request = diagnostics(value);
    const result = validateFrozenPilotDiagnostics(value.report, request, { expectedHash: sha(request.text) });
    expect(result.passed).toBe(true);
    expect(result.request.payload).toEqual(JSON.parse(request.text));
    expect(result.factualClaimsApproved).toBe(false);
    expect(result.publicationApproved).toBe(false);
    expect(result.fundingApproved).toBe(false);
    const alternate = JSON.parse(request.text);
    alternate.state.previous = [{ slug: 'old-guide', title: 'An intact prior title', summary: 'An intact prior summary.' }];
    const text = JSON.stringify(alternate);
    expect(validateFrozenPilotDiagnostics(value.report, { id: request.id, text }, { expectedHash: sha(text) }).passed).toBe(true);
  });

  it('holds altered source context, hash, locator, absent helper, draft, model, diagnostic group, or control reference', () => {
    const value = approved(); const request = diagnostics(value);
    for (const mutate of [
      (payload) => { payload.state.evidence[0].text = 'The tool works offline.'; payload.state.evidence[0].contextSha256 = sha(payload.state.evidence[0].text); },
      (payload) => { payload.state.evidence[0].sourceSha256 = '0'.repeat(64); },
      (payload) => { payload.state.evidence[0].locator = 'changed'; },
      (payload) => { payload.state.evidence = payload.state.evidence.filter(({ id }) => id !== 'e-platform'); },
      (payload) => { payload.state.exactArticleMarkdown += 'Changed wording.'; },
      (payload) => { payload.model = 'other-model'; },
      (payload) => { payload.state.groups.push({ id: 'saving' }); },
      (payload) => { payload.state.controls.support.evidenceId = 'unknown'; },
      (payload) => { payload.questions.control_support.type = 'score'; },
    ]) {
      const payload = JSON.parse(request.text); mutate(payload); const text = JSON.stringify(payload);
      expect(validateFrozenPilotDiagnostics(value.report, { id: request.id, text }, { expectedHash: sha(text) }).passed).toBe(false);
    }
    expect(validateFrozenPilotDiagnostics(value.report, { ...request, text: request.text + '\n' }, { expectedHash: sha(request.text) }).unassessed[0].reasons).toContain('FROZEN_REQUEST_HASH_MISMATCH');
  });

  it('holds oversized diagnostic requests and any absent independent context approval', () => {
    const value = approved(); const request = diagnostics(value);
    const payload = JSON.parse(request.text); payload.state.instruction = 'Extra diagnostic context. '.repeat(1100);
    const text = JSON.stringify(payload);
    expect(validateFrozenPilotDiagnostics(value.report, { id: request.id, text }, { expectedHash: sha(text) }).unassessed[0].reasons).toContain('FROZEN_REQUEST_OVER_BOUND');
    const report = validatePilotContextBundle(value.bundle, { registry: value.registry, now });
    expect(validateFrozenPilotDiagnostics(report, request, { expectedHash: sha(request.text) }).passed).toBe(false);
  });
});
