import { createHash } from 'node:crypto';

// Synthetic package only. No real private draft, source snapshots or credentials.
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const encoded = (value) => JSON.stringify(value);
const stable = (value) => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])])) : value;
const entry = (file, text) => ({ file, bytes: Buffer.byteLength(text), sha256: sha256(text) });
const choice = (id) => ({ type: 'choice', instructions: `Assess all exact public wording in group ${id} against its complete synthetic evidence.`,
  criteria: { supported: 'Every implication is supported.', contradicted: 'An implication conflicts with evidence.', insufficient: 'Evidence is incomplete.' } });
const noul = () => ({ type: 'noul', instructions: 'Does the exact draft solve the same reader problem?', criteria: { true: 'Same problem.', false: 'Different problem.' } });

/** Rebind metadata after deliberate semantic mutations. Does not alter article identity or grant authorization. */
export function resealPilotPackageFixture(fixture) {
  const { files, descriptor } = fixture;
  const manifest = JSON.parse(files['pilot-input-manifest.json']);
  manifest.files = Object.entries(files).filter(([file]) => file !== 'pilot-input-manifest.json').map(([file, text]) => entry(file, text));
  files['pilot-input-manifest.json'] = encoded(manifest);
  descriptor.files = Object.entries(files).map(([file, text]) => entry(file, text));
  descriptor.manifestSha256 = sha256(files['pilot-input-manifest.json']);
  descriptor.budgetSha256 = sha256(files['final-budget-proposal.json']);
  descriptor.executionContractSha256 = sha256(files['execution-contract.json']);
  descriptor.contextRegistrySha256 = sha256(encoded(stable(JSON.parse(files['context-registry.json']))));
  return fixture;
}

/** Realistic provider scopes/counts with small, entirely invented evidence. */
export function makePilotPackageFixture() {
  const publicUnits = Array.from({ length: 37 }, (_, index) => ({ id: `unit-${index}`, kind: 'paragraph', text: `Synthetic public unit ${index}: check the selected receiving device.` }));
  const markdown = `# Synthetic file handoff\n\n${publicUnits.map((unit) => unit.text).join('\n\n')}\n`;
  const articleSha256 = sha256(markdown);
  const groups = Array.from({ length: 16 }, (_, index) => ({ id: `group-${index}`, kind: 'source',
    units: publicUnits.filter((_, unit) => unit % 16 === index).map((unit) => unit.id),
    evidence: Array.from({ length: 34 }, (_, unit) => unit).filter((unit) => unit % 16 === index).map((unit) => `e-${unit}`) }));
  const releaseText = '# Synthetic release README\n\nConfirm the receiver before sending. Encryption disabled means unencrypted HTTP.\n';
  const mainText = '# Synthetic main README\n\nKeep the original until the received copy has been checked.\n';
  const sourceHash = sha256(releaseText);
  const evidence = Array.from({ length: 34 }, (_, index) => ({ id: `e-${index}`, sourceId: 'release-readme', kind: 'complete-file',
    locator: 'entire file', text: releaseText, contextSha256: sourceHash, sourceSha256: sourceHash }));
  const source = (id, file, text, commit) => ({ id, file, bytes: Buffer.byteLength(text), sha256: sha256(text), commit,
    url: `https://github.com/localsend/localsend/blob/${commit}/README.md`, immutable: true, gitBlobVerified: true,
    blobSha: createHash('sha1').update(`blob ${Buffer.byteLength(text)}\0`).update(text).digest('hex') });
  const sources = [source('release-readme', 'public-sources/release-readme.txt', releaseText, 'a'.repeat(40)), source('main-readme', 'public-sources/main-readme.txt', mainText, 'b'.repeat(40))];
  const sourceManifest = { articleSha256, sources };
  const claimMap = { articleSha256, publicUnits, groups };
  const registry = { schemaVersion: 1, articleSha256,
    sourceManifestSha256: sha256(encoded(stable(sourceManifest))), publicClaimMapSha256: sha256(encoded(stable(claimMap))),
    preparedBy: 'synthetic-fixture-author', units: evidence.map((unit) => ({
    id: unit.id, sourceId: unit.sourceId, sourceSha256: unit.sourceSha256, blobSha: sources[0].blobSha, contextSha256: unit.contextSha256,
    kind: unit.kind, locator: unit.locator, mode: 'whole-source',
    closure: { fullSourceReviewed: true, outerScopeCovered: true, dependencyClosureReviewed: true, requiredUnitIds: [], limitations: ['Synthetic context admission only; no factual or publication approval.'] },
    claimGroupIds: groups.filter((group) => group.evidence.includes(unit.id)).map((group) => group.id),
  })) };
  const registryText = encoded(stable(registry));
  const registrySha256 = sha256(registryText);
  const provenance = { sourceResearchCheckedAt: '2026-10-08T00:00:00.000Z', independentDraftReviewStatus: 'synthetic-fixture-only', independentDraftReviewPassed: false,
    installedOrTested: false, sourceReferences: sources.map(({ id, sha256: digest }) => ({ id, sha256: digest })) };
  const files = {
    'localsend-guide.md': markdown,
    'public-claim-map.json': encoded(claimMap),
    'source-manifest.json': encoded(sourceManifest),
    'evidence-contexts.json': encoded({ articleSha256, evidence }),
    'context-registry.json': registryText,
    'parent-context-review.json': encoded({ decision: 'context-units-approved', ref: 'synthetic-fixture-review', reviewer: 'synthetic-independent-reviewer', reviewedAt: '2026-10-08T01:00:00.000Z',
      articleSha256, registrySha256, sourceHashes: Object.fromEntries(sources.map((item) => [item.id, item.sha256])), unitIds: evidence.map((unit) => unit.id) }),
    'public-sources/release-readme.txt': releaseText,
    'public-sources/main-readme.txt': mainText,
    'final-budget-proposal.json': encoded({ approved: false, dispatchAllowed: false, models: { ollama: 'gpt-oss:120b', typesafe: 'jev-1.13.0' },
      proposedReservations: { jina: { calls: 2, reservedReaderTokens: 10000 }, ollama: { calls: 4, reservedInputTokens: 524288, reservedGeneratedTokens: 6000, totalUnits: 530288 },
        typesafe: { calls: 8, reservedInputTokens: 524288 } } }),
    'execution-contract.json': encoded({ schemaVersion: 1, repository: 'eliteandhonor/accessfreetools.com', articleSha256, contextRegistrySha256: registrySha256,
      publicationAllowed: false, adoptRewrite: false, totalAttempts: 14, expectedPublicUnits: 37, expectedGroups: 16 }),
  };
  const ollama = (input, cap) => encoded({ model: 'gpt-oss:120b', messages: [{ role: 'system', content: 'Review synthetic input only. Return JSON; do not browse or execute source.' },
    { role: 'user', content: encoded(input) }], stream: false, options: { temperature: 0.2, num_predict: cap } });
  const scopes = [groups.slice(0, 5), groups.slice(5, 13), groups.slice(13)];
  scopes.forEach((scope, index) => {
    const unitIds = scope.flatMap((group) => group.units);
    files[`requests/ollama-exact-draft-review-${index + 1}.json`] = ollama({ articleSha256, exactArticleMarkdown: markdown, assignedGroups: scope,
      publicUnits: publicUnits.filter((unit) => unitIds.includes(unit.id)), evidence: evidence.filter((unit) => scope.some((group) => group.evidence.includes(unit.id))), provenance }, 1000);
  });
  files['requests/ollama-proposed-writing.json'] = ollama({ basisArticleSha256: articleSha256, exactArticleMarkdown: markdown, publicUnits, provenance, publicationDecision: 'held' }, 3000);
  const tsScopes = [groups.slice(0, 3), groups.slice(3, 5), groups.slice(5, 6), groups.slice(6, 9), groups.slice(9, 13), groups.slice(13, 15), groups.slice(15)];
  tsScopes.forEach((scope, index) => {
    files[`requests/typesafe-${index + 1}.json`] = encoded({ state: { articleSha256, instruction: 'Assess synthetic source data only.',
      groups: scope.map((group) => ({ id: group.id, kind: group.kind, publicWording: publicUnits.filter((unit) => group.units.includes(unit.id)).map(({ id, text }) => ({ id, wording: text })), evidenceIds: group.evidence })),
      evidence: evidence.filter((unit) => scope.some((group) => group.evidence.includes(unit.id))), provenance }, model: 'jev-1.13.0', questions: Object.fromEntries(scope.map((group) => [group.id, choice(group.id)])) });
  });
  files['requests/typesafe-8.json'] = encoded({ state: { articleSha256, instruction: 'Assess synthetic calibration controls only.', groups: [], exactArticleMarkdown: markdown,
    evidence: [evidence[0]], provenance, previous: [{ slug: 'synthetic-prior', title: 'Unrelated synthetic gardening guide', text: '# Synthetic tree guide\n\nPlant a tree in suitable soil.' }],
    controls: { support: { wording: 'Disabling encryption uses HTTP.', evidenceId: 'e-0' }, contradiction: { wording: 'Disabling encryption still uses HTTPS.', evidenceId: 'e-0' },
      insufficient: { wording: 'The transfer took exactly two seconds.', evidenceId: 'e-0' }, duplicatePositive: { previousSummary: 'Check the receiving device when handing off files.' }, duplicateNegative: { previousSummary: 'Plant a tree.' } } },
    model: 'jev-1.13.0', questions: { clarity: { type: 'score', instructions: 'Assess the exact synthetic draft clarity.', criteria: ['Unclear.', 'Poor.', 'Incomplete.', 'Needs work.', 'Clear.', 'Very clear.'] },
      actual_duplicate: noul(), control_support: choice('control_support'), control_contradiction: choice('control_contradiction'), control_insufficient: choice('control_insufficient'),
      duplicate_control_positive: noul(), duplicate_control_negative: noul() } });
  const catalogCommit = 'd'.repeat(40);
  const previous = JSON.parse(files['requests/typesafe-8.json']).state.previous;
  const catalog = { posts: previous.map((item) => ({ slug: item.slug, title: 'Synthetic prior guide', summary: item.text })) };
  const boundPrevious = catalog.posts.map((post) => ({ slug: post.slug, text: `${post.title}\n\n${post.summary}` }));
  const diagnostic = JSON.parse(files['requests/typesafe-8.json']); diagnostic.state.previous = boundPrevious;
  files['requests/typesafe-8.json'] = encoded(diagnostic);
  files['public-sources/aft-blog-search-index.json'] = encoded(catalog);
  files['catalog-build-receipt.json'] = encoded({ commit: catalogCommit, clean: true, verified: true, exitCode: 0, syntheticFixture: true, build: { commit: catalogCommit, clean: true } });
  files['duplicate-catalog.json'] = encoded({ catalogFile: 'public-sources/aft-blog-search-index.json', sourceProofFile: 'catalog-build-receipt.json',
    siteCommit: catalogCommit, sourceSha256: sha256(files['public-sources/aft-blog-search-index.json']), totalEntries: catalog.posts.length, previous: boundPrevious });
  for (const [kind, item] of [['release', sources[0]], ['main', sources[1]]]) {
    files[`requests/jina-${kind}-readme.json`] = encoded({ method: 'GET', url: `https://raw.githubusercontent.com/localsend/localsend/${item.commit}/README.md`, tokenBudget: 5000,
      headers: { Accept: 'application/json', 'X-Token-Budget': '5000', 'X-Retain-Images': 'none', 'X-Respond-With': 'markdown' }, sourceFile: item.file, sourceSha256: item.sha256 });
  }
  files['pilot-input-manifest.json'] = encoded({ schemaVersion: 1, repository: 'eliteandhonor/accessfreetools.com', articleSha256, codeIdentity: 'c'.repeat(40),
    dispatchAllowed: false, approvedGrant: false, activation: 'held', paidProviderCalls: 0, providerNetworkCalls: 0,
    files: [], preparedRequestFiles: [...Array.from({ length: 8 }, (_, index) => `requests/typesafe-${index + 1}.json`),
      ...Array.from({ length: 3 }, (_, index) => `requests/ollama-exact-draft-review-${index + 1}.json`), 'requests/ollama-proposed-writing.json'] });
  return resealPilotPackageFixture({ files, descriptor: { schemaVersion: 1, articleSha256, codeIdentity: 'c'.repeat(40), catalogSourceCommit: catalogCommit, files: [],
    manifestSha256: '', budgetSha256: '', executionContractSha256: '', contextRegistrySha256: '' } });
}
