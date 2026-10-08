import { describe, it, expect } from 'vitest';
import { validatePilotPackage, digest } from './daily-editorial-pilot-package.mjs';
import { validatePilotContextBundle, validateFrozenPilotRequests, validateFrozenPilotDiagnostics } from './daily-editorial-pilot-context.mjs';
import { makePilotPackageFixture, resealPilotPackageFixture } from '../fixtures/daily-editorial/pilot-fixture.mjs';

const edit = (fixture, file, change) => {
  const value = JSON.parse(fixture.files[file]);
  change(value);
  fixture.files[file] = JSON.stringify(value);
};
const validate = (fixture) => validatePilotPackage(fixture.files, fixture.descriptor);
const rejection = (fixture) => { try { validate(fixture); return null; } catch (error) { return error; } };
const contexts = ({ files }) => {
  const sourceManifest = JSON.parse(files['source-manifest.json']);
  return validatePilotContextBundle({ sourceManifest, evidenceContexts: JSON.parse(files['evidence-contexts.json']),
    publicClaimMap: JSON.parse(files['public-claim-map.json']), articleText: files['localsend-guide.md'],
    sourceTexts: Object.fromEntries(sourceManifest.sources.map((source) => [source.id, files[source.file]])) },
  { registry: JSON.parse(files['context-registry.json']), parentReview: JSON.parse(files['parent-context-review.json']), now: new Date('2026-10-08T12:00:00Z') });
};

describe('held pilot package identity', () => {
  it('admits a synthetic complete held package without approving provider dispatch', () => {
    const fixture = makePilotPackageFixture();
    const result = validate(fixture);
    expect(result.claimMap.publicUnits).toHaveLength(37);
    expect(result.claimMap.groups).toHaveLength(16);
    expect(result.factual).toHaveLength(3);
    expect(result.typesafe).toHaveLength(8);
    expect(result.jina).toHaveLength(2);
    expect(result.manifest.approvedGrant).toBe(false);
    expect(result.manifest.dispatchAllowed).toBe(false);
    expect(result.contract.publicationAllowed).toBe(false);
    expect(contexts(fixture)).toMatchObject({ passed: true, scope: 'context-admission-only', factualClaimsApproved: false, publicationApproved: false });
  });
  it('admits the exact frozen filenames used by the CLI as request identities', () => {
    const fixture = makePilotPackageFixture();
    const pkg = validate(fixture);
    const report = contexts(fixture);
    const expectedHashes = Object.fromEntries(pkg.descriptor.files.map(({ file, sha256 }) => [file, sha256]));
    for (const [provider, requests] of [['ollama', pkg.factual], ['typesafe', pkg.typesafe.filter(({ file }) => file !== 'requests/typesafe-8.json')]]) {
      const review = validateFrozenPilotRequests(report, requests.map(({ file }) => ({ id: file, text: fixture.files[file] })), { provider, expectedHashes });
      expect(review.unassessed).toEqual([]);
      expect(review.passed).toBe(true);
    }
    const file = 'requests/typesafe-8.json';
    expect(validateFrozenPilotDiagnostics(report, { id: file, text: fixture.files[file] }, { expectedHash: expectedHashes[file] })).toMatchObject({ passed: true, unassessed: [] });
  });
  it.each(['localsend-guide.md', 'requests/ollama-proposed-writing.json', 'final-budget-proposal.json'])('rejects stale bytes in %s', (file) => {
    const fixture = makePilotPackageFixture(); fixture.files[file] += '\n';
    expect(rejection(fixture)?.code).toBe('PILOT_INPUT_HASH');
  });
  it.each(['manifestSha256', 'budgetSha256', 'executionContractSha256', 'contextRegistrySha256'])('rejects a wrong frozen %s even with valid inventory hashes', (key) => {
    const fixture = makePilotPackageFixture(); fixture.descriptor[key] = 'f'.repeat(64);
    expect(rejection(fixture)).toBeTruthy();
  });
  it('rejects unknown/unlisted files and missing frozen inputs', () => {
    const extra = makePilotPackageFixture(); extra.files['unlisted.json'] = '{}';
    expect(rejection(extra)?.code).toBe('PILOT_INPUT_INVENTORY');
    const missing = makePilotPackageFixture(); delete missing.files['execution-contract.json'];
    expect(rejection(missing)?.code).toBe('PILOT_INPUT_INVENTORY');
  });
  it('rejects descriptor paths that escape or alias the local package identity', () => {
    for (const file of ['../outside.json', '/tmp/outside.json', './localsend-guide.md', 'requests/../localsend-guide.md']) {
      const fixture = makePilotPackageFixture(); fixture.files[file] = '{}';
      fixture.descriptor.files.push({ file, bytes: 2, sha256: digest('{}') });
      expect(rejection(fixture)?.code).toBe('PILOT_DESCRIPTOR_INVALID');
    }
  });
  it('rejects a consistently rehashed rewrite smuggled into original-hash review', () => {
    const fixture = makePilotPackageFixture();
    edit(fixture, 'requests/ollama-exact-draft-review-1.json', (request) => {
      const input = JSON.parse(request.messages[1].content); input.exactArticleMarkdown += '\nUnreviewed rewrite.';
      request.messages[1].content = JSON.stringify(input);
    });
    resealPilotPackageFixture(fixture);
    expect(rejection(fixture)?.code).toBe('PILOT_REQUEST_HASH');
  });
  it.each([
    ['provider credential', (request) => { request.apiKey = 'SYNTHETIC_TEST_ONLY_CREDENTIAL'; }],
    ['authorization header', (request) => { request.headers = { Authorization: 'Bearer SYNTHETIC_TEST_ONLY_CREDENTIAL' }; }],
  ])('rejects a rehashed wire body containing %s without echoing it', (_, mutate) => {
    const fixture = makePilotPackageFixture(); edit(fixture, 'requests/ollama-exact-draft-review-1.json', mutate); resealPilotPackageFixture(fixture);
    const error = rejection(fixture);
    expect(error).toBeTruthy();
    expect(String(error)).not.toContain('SYNTHETIC_TEST_ONLY_CREDENTIAL');
  });
  it('rejects a consistently hashed oversized body before provider dispatch', () => {
    const fixture = makePilotPackageFixture();
    edit(fixture, 'requests/ollama-exact-draft-review-1.json', (request) => { request.messages[0].content = 'x'.repeat(56000); });
    resealPilotPackageFixture(fixture);
    expect(rejection(fixture)?.code).toBe('PILOT_REQUEST_INVALID');
  });
  it('rejects mutated public wording under an unchanged unit ID and exact Markdown', () => {
    const fixture = makePilotPackageFixture();
    edit(fixture, 'requests/ollama-exact-draft-review-1.json', (request) => {
      const input = JSON.parse(request.messages[1].content); input.publicUnits[0].text = 'An unreviewed claim using the old public unit ID.';
      request.messages[1].content = JSON.stringify(input);
    });
    resealPilotPackageFixture(fixture);
    expect(rejection(fixture)).toBeTruthy();
  });
  it('requires the style proposal to receive every public unit, not only an intact exact Markdown field', () => {
    const fixture = makePilotPackageFixture();
    edit(fixture, 'requests/ollama-proposed-writing.json', (request) => {
      const input = JSON.parse(request.messages[1].content); input.publicUnits.pop();
      request.messages[1].content = JSON.stringify(input);
    });
    resealPilotPackageFixture(fixture);
    expect(rejection(fixture)).toBeTruthy();
  });
  it('rejects a changed provenance source hash even when all outer file hashes are refreshed', () => {
    const fixture = makePilotPackageFixture();
    edit(fixture, 'requests/ollama-exact-draft-review-1.json', (request) => {
      const input = JSON.parse(request.messages[1].content); input.provenance.sourceReferences[0].sha256 = 'f'.repeat(64);
      request.messages[1].content = JSON.stringify(input);
    });
    resealPilotPackageFixture(fixture);
    expect(rejection(fixture)).toBeTruthy();
  });
  it('rejects missing contradiction control rather than claiming a eight-call pilot is complete', () => {
    const fixture = makePilotPackageFixture(); edit(fixture, 'requests/typesafe-8.json', (request) => { delete request.questions.control_contradiction; });
    resealPilotPackageFixture(fixture);
    expect(rejection(fixture)).toBeTruthy();
  });
  it('rejects diagnostic evidence substituted under an admitted source hash and locator', () => {
    const fixture = makePilotPackageFixture();
    edit(fixture, 'requests/typesafe-8.json', (request) => {
      request.state.evidence[0].text = '# Synthetic selective excerpt\n\nDisabling encryption still uses HTTPS.';
    });
    resealPilotPackageFixture(fixture);
    const report = contexts(fixture);
    expect(report.passed).toBe(true);
    const file = 'requests/typesafe-8.json';
    const review = validateFrozenPilotDiagnostics(report, { id: file, text: fixture.files[file] }, { expectedHash: digest(fixture.files[file]) });
    expect(review.passed).toBe(false);
    expect(review.unassessed[0].reasons).toContain('FROZEN_REQUEST_CONTEXT_MISMATCH');
  });
  it.each(['instructions', 'clarity criterion'])('rejects a TypeSafe %s that the strict output reviewer cannot assess within its bounds', (kind) => {
    const fixture = makePilotPackageFixture();
    if (kind === 'instructions') edit(fixture, 'requests/typesafe-1.json', (request) => {
      request.questions['group-0'].instructions = 'Review all exact public wording. '.repeat(130);
    });
    else edit(fixture, 'requests/typesafe-8.json', (request) => {
      request.questions.clarity.criteria[5] = 'Complete and clear wording. '.repeat(160);
    });
    resealPilotPackageFixture(fixture);
    expect(rejection(fixture)).toBeTruthy();
  });
  it.each(['ollama', 'typesafe'])('rejects an empty frozen %s source scope even when other calls retain full global coverage', (provider) => {
    const fixture = makePilotPackageFixture();
    const emptyFile = provider === 'ollama' ? 'requests/ollama-exact-draft-review-3.json' : 'requests/typesafe-5.json';
    const receivingFile = provider === 'ollama' ? 'requests/ollama-exact-draft-review-2.json' : 'requests/typesafe-4.json';
    const emptied = JSON.parse(fixture.files[emptyFile]);
    edit(fixture, receivingFile, (request) => {
      if (provider === 'ollama') {
        const incoming = JSON.parse(emptied.messages[1].content);
        const receiving = JSON.parse(request.messages[1].content);
        receiving.assignedGroups.push(...incoming.assignedGroups);
        receiving.publicUnits.push(...incoming.publicUnits);
        receiving.evidence.push(...incoming.evidence);
        incoming.assignedGroups = []; incoming.publicUnits = []; incoming.evidence = [];
        request.messages[1].content = JSON.stringify(receiving);
        emptied.messages[1].content = JSON.stringify(incoming);
      } else {
        request.state.groups.push(...emptied.state.groups);
        request.state.evidence.push(...emptied.state.evidence);
        Object.assign(request.questions, emptied.questions);
        emptied.state.groups = []; emptied.state.evidence = []; emptied.questions = {};
      }
    });
    fixture.files[emptyFile] = JSON.stringify(emptied);
    resealPilotPackageFixture(fixture);
    expect(rejection(fixture)).toBeTruthy();
  });
  it('rejects duplicate diagnostic dispatch substituting for a required frozen source batch', () => {
    const fixture = makePilotPackageFixture();
    const moved = JSON.parse(fixture.files['requests/typesafe-5.json']);
    edit(fixture, 'requests/typesafe-4.json', (request) => {
      request.state.groups.push(...moved.state.groups);
      request.state.evidence.push(...moved.state.evidence);
      Object.assign(request.questions, moved.questions);
    });
    edit(fixture, 'pilot-input-manifest.json', (manifest) => {
      manifest.preparedRequestFiles = manifest.preparedRequestFiles.map((file) => file === 'requests/typesafe-5.json' ? 'requests/typesafe-8.json' : file);
    });
    resealPilotPackageFixture(fixture);
    expect(rejection(fixture)).toBeTruthy();
  });
  it('rejects a different TypeSafe public implication hidden behind unchanged group identity', () => {
    const fixture = makePilotPackageFixture(); edit(fixture, 'requests/typesafe-1.json', (request) => { request.state.groups[0].publicWording[0].wording = 'A different unreviewed implication.'; });
    resealPilotPackageFixture(fixture);
    expect(rejection(fixture)).toBeTruthy();
  });
  it('rejects a Jina commit that disagrees with the hash-bound source locator', () => {
    const fixture = makePilotPackageFixture();
    edit(fixture, 'requests/jina-release-readme.json', (request) => { request.url = `https://raw.githubusercontent.com/localsend/localsend/${'e'.repeat(40)}/README.md`; });
    resealPilotPackageFixture(fixture);
    expect(rejection(fixture)).toBeTruthy();
  });
  it('rejects two named Jina reads that both resolve to the release source', () => {
    const fixture = makePilotPackageFixture();
    fixture.files['requests/jina-main-readme.json'] = fixture.files['requests/jina-release-readme.json'];
    resealPilotPackageFixture(fixture);
    expect(rejection(fixture)).toBeTruthy();
  });
  it.each([
    ['unknown question field', (question) => { question.privateDebug = 'Synthetic diagnostic.'; }],
    ['unexpected fourth Choice criterion', (question) => { question.criteria.approved = 'Invented extra category.'; }],
    ['Noul substituted for source support', (question) => { question.type = 'noul'; question.criteria = { true: 'Yes.', false: 'No.' }; }],
  ])('rejects %s before spending on a response the strict reviewer cannot accept', (_, mutate) => {
    const fixture = makePilotPackageFixture();
    edit(fixture, 'requests/typesafe-1.json', (request) => { mutate(request.questions['group-0']); });
    resealPilotPackageFixture(fixture);
    expect(rejection(fixture)).toBeTruthy();
  });
  it.each([
    ['self-approved budget', (budget) => { budget.approved = true; }, 'PILOT_INPUT_IDENTITY'],
    ['dispatch permission', (budget) => { budget.dispatchAllowed = true; }, 'PILOT_INPUT_IDENTITY'],
    ['ordinary daily token caps', (budget) => { budget.proposedReservations.ollama.totalUnits = 120000; budget.proposedReservations.typesafe.reservedInputTokens = 100000; }, 'PILOT_BUDGET_INVALID'],
    ['free-output reservation omitted', (budget) => { budget.proposedReservations.ollama.reservedGeneratedTokens = 0; }, 'PILOT_BUDGET_INVALID'],
  ])('holds %s; input metadata does not authorize itself', (_, mutate, code) => {
    const fixture = makePilotPackageFixture(); edit(fixture, 'final-budget-proposal.json', mutate); resealPilotPackageFixture(fixture);
    expect(rejection(fixture)?.code).toBe(code);
  });
  it('rejects a self-approved manifest grant even while the separate budget remains held', () => {
    const fixture = makePilotPackageFixture();
    edit(fixture, 'pilot-input-manifest.json', (manifest) => { manifest.approvedGrant = true; });
    resealPilotPackageFixture(fixture);
    expect(rejection(fixture)).toBeTruthy();
  });
  it.each([
    ['substituted prior summary', (fixture) => edit(fixture, 'requests/typesafe-8.json', (request) => { request.state.previous[0].text = 'Unreviewed history.'; })],
    ['stale catalog commit', (fixture) => edit(fixture, 'duplicate-catalog.json', (history) => { history.siteCommit = 'f'.repeat(40); })],
    ['changed full catalog', (fixture) => edit(fixture, 'public-sources/aft-blog-search-index.json', (catalog) => { catalog.posts[0].summary = 'Different summary.'; })],
    ['unverified source build', (fixture) => edit(fixture, 'catalog-build-receipt.json', (receipt) => { receipt.verified = false; })],
  ])('holds %s before paying for duplicate checks', (_, change) => {
    const fixture = makePilotPackageFixture(); change(fixture); resealPilotPackageFixture(fixture);
    expect(rejection(fixture)?.code).toBe('PILOT_HISTORY_UNASSESSED');
  });
  it('rejects malformed structured inputs using a fixed code', () => {
    const fixture = makePilotPackageFixture(); fixture.files['public-claim-map.json'] = '{"constructor":{}}'; resealPilotPackageFixture(fixture);
    expect(rejection(fixture)?.code).toBe('PILOT_INPUT_INVALID');
  });
  it('rejects duplicated descriptor inventory even when the set of names looks equal', () => {
    const fixture = makePilotPackageFixture(); fixture.descriptor.files.push({ ...fixture.descriptor.files[0] });
    expect(rejection(fixture)).toBeTruthy();
  });
  it.each([
    ['source-manifest.json', (value) => { value.sources[0].url = `https://github.com/localsend/localsend/blob/${'f'.repeat(40)}/README.md`; }, 'SOURCE_MANIFEST_HASH_MISMATCH'],
    ['public-claim-map.json', (value) => { value.publicUnits[0].text = 'A substituted claim under the previous approval.'; }, 'PUBLIC_CLAIM_MAP_HASH_MISMATCH'],
  ])('retains the original independent context approval after re-sealing changed %s metadata', (file, mutate, reason) => {
    const fixture = makePilotPackageFixture();
    const originalRegistry = fixture.files['context-registry.json'];
    const originalApproval = fixture.files['parent-context-review.json'];
    edit(fixture, file, mutate); resealPilotPackageFixture(fixture);
    expect(fixture.files['context-registry.json']).toBe(originalRegistry);
    expect(fixture.files['parent-context-review.json']).toBe(originalApproval);
    const result = contexts(fixture);
    expect(result.passed).toBe(false);
    expect(result.unassessed[0].reasons).toContain(reason);
  });
});
