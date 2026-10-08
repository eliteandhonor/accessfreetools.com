import { createHash } from 'node:crypto';
import { freezePilotContextSpecs } from './daily-editorial-pilot-context.mjs';
import { MAX_PRIVATE_INPUT_FILES, MAX_PRIVATE_INPUT_FILE_BYTES, MAX_PRIVATE_INPUT_BYTES } from './daily-editorial-private-input.mjs';

export const PILOT_LIMITS = Object.freeze({
  jina: Object.freeze({ calls: 2, units: 10000 }),
  ollama: Object.freeze({ calls: 4, units: 530288 }),
  typesafe: Object.freeze({ calls: 8, units: 524288 }),
});
export const PILOT_MODELS = Object.freeze({ ollama: 'gpt-oss:120b', typesafe: 'jev-1.13.0' });
export const digest = (text) => createHash('sha256').update(text).digest('hex');
const HASH = /^[a-f0-9]{64}$/;
const NAME = /^[a-zA-Z0-9_.-]+(?:\/[a-zA-Z0-9_.-]+){0,3}$/;
const fail = (code) => { throw Object.assign(new Error(code), { code }); };
const object = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const sameSet = (a, b) => Array.isArray(a) && Array.isArray(b) && new Set(a).size === a.length &&
  a.length === b.length && a.every((item) => b.includes(item));
const exact = (value, keys) => object(value) && sameSet(Object.keys(value), keys);

function json(text) {
  try {
    return JSON.parse(text, (key, value) => {
      if (['__proto__', 'constructor', 'prototype'].includes(key) || /^(?:authorization|proxy-authorization|cookie|set-cookie|api[_-]?key|access[_-]?token|refresh[_-]?token|password|secret|credentials)$/i.test(key)) fail('PILOT_INPUT_INVALID');
      return value;
    });
  } catch { fail('PILOT_INPUT_INVALID'); }
}

/** Descriptor is trusted checked-in metadata; bundle bodies stay in private storage. */
export function validatePilotPackage(files, descriptor) {
  if (!object(files) || !object(descriptor) || !Array.isArray(descriptor.files) || descriptor.files.length > MAX_PRIVATE_INPUT_FILES ||
      !HASH.test(descriptor.articleSha256 ?? '') || !HASH.test(descriptor.manifestSha256 ?? '') ||
      !HASH.test(descriptor.budgetSha256 ?? '') || !HASH.test(descriptor.executionContractSha256 ?? '') ||
      !HASH.test(descriptor.contextRegistrySha256 ?? '')) fail('PILOT_DESCRIPTOR_INVALID');
  const names = descriptor.files.map((entry) => entry.file);
  if (!sameSet(Object.keys(files), names)) fail('PILOT_INPUT_INVENTORY');
  let totalBytes = 0;
  for (const entry of descriptor.files) {
    if (!NAME.test(entry.file ?? '') || entry.file.split('/').some((part) => ['.', '..'].includes(part)) ||
        !HASH.test(entry.sha256 ?? '') || !Number.isSafeInteger(entry.bytes) || entry.bytes < 1 || entry.bytes > MAX_PRIVATE_INPUT_FILE_BYTES) fail('PILOT_DESCRIPTOR_INVALID');
    const text = files[entry.file];
    if (typeof text !== 'string' || text.includes('\0') || Buffer.byteLength(text) !== entry.bytes || digest(text) !== entry.sha256) fail('PILOT_INPUT_HASH');
    totalBytes += entry.bytes;
  }
  if (totalBytes > MAX_PRIVATE_INPUT_BYTES) fail('PILOT_INPUT_SIZE');
  if (digest(files['pilot-input-manifest.json']) !== descriptor.manifestSha256 ||
      digest(files['final-budget-proposal.json']) !== descriptor.budgetSha256 ||
      digest(files['execution-contract.json']) !== descriptor.executionContractSha256) fail('PILOT_INPUT_HASH');
  const manifest = json(files['pilot-input-manifest.json']);
  const budget = json(files['final-budget-proposal.json']);
  const contract = json(files['execution-contract.json']);
  if (freezePilotContextSpecs(json(files['context-registry.json'])).registrySha256 !== descriptor.contextRegistrySha256) fail('PILOT_INPUT_HASH');
  const markdown = files['localsend-guide.md'];
  if (manifest.repository !== 'eliteandhonor/accessfreetools.com' || manifest.articleSha256 !== descriptor.articleSha256 ||
      digest(markdown) !== descriptor.articleSha256 || manifest.dispatchAllowed !== false || manifest.approvedGrant !== false || manifest.paidProviderCalls !== 0 ||
      budget.approved !== false || budget.dispatchAllowed !== false || contract.publicationAllowed !== false ||
      contract.articleSha256 !== descriptor.articleSha256) fail('PILOT_INPUT_IDENTITY');
  // The held preparation does not authorize itself. Runtime admission is separate.
  if (!Array.isArray(manifest.files) || !sameSet(manifest.files.map((entry) => entry.file), names.filter((name) => name !== 'pilot-input-manifest.json')) ||
      manifest.files.some((entry) => files[entry.file] === undefined ||
      Buffer.byteLength(files[entry.file]) !== entry.bytes || digest(files[entry.file]) !== entry.sha256)) fail('PILOT_MANIFEST_INVALID');
  const claimMap = json(files['public-claim-map.json']);
  if (claimMap.articleSha256 !== descriptor.articleSha256 || !Array.isArray(claimMap.publicUnits) ||
      claimMap.publicUnits.length < 1 || claimMap.publicUnits.length > 100 ||
      (contract.expectedPublicUnits !== undefined && contract.expectedPublicUnits !== claimMap.publicUnits.length) ||
      !Array.isArray(claimMap.groups) || claimMap.groups.length < 1 || claimMap.groups.length > 64 ||
      (contract.expectedGroups !== undefined && contract.expectedGroups !== claimMap.groups.length) ||
      !sameSet(claimMap.publicUnits.map((unit) => unit.id), claimMap.groups.flatMap((group) => group.units))) fail('PILOT_COVERAGE_INVALID');
  const sourceManifest = json(files['source-manifest.json']);
  if (sourceManifest.articleSha256 !== descriptor.articleSha256 || !Array.isArray(sourceManifest.sources)) fail('PILOT_COVERAGE_INVALID');
  const sourceMap = new Map(sourceManifest.sources.map((source) => [source.id, source]));
  const units = new Map(claimMap.publicUnits.map((unit) => [unit.id, unit]));
  const groups = new Map(claimMap.groups.map((group) => [group.id, group]));
  const wordingMatches = (values, ids, key) => Array.isArray(values) && sameSet(values.map((unit) => unit.id), ids) &&
    values.every((unit) => unit[key] === units.get(unit.id)?.text);
  const provenanceMatches = (input) => Array.isArray(input.provenance?.sourceReferences) &&
    input.provenance.sourceReferences.length > 0 && new Set(input.provenance.sourceReferences.map((source) => source.id)).size === input.provenance.sourceReferences.length &&
    input.provenance.sourceReferences.every((source) => sourceMap.get(source.id)?.sha256 === source.sha256);
  const canonical = [...Array.from({ length: 8 }, (_, index) => `requests/typesafe-${index + 1}.json`),
    ...Array.from({ length: 3 }, (_, index) => `requests/ollama-exact-draft-review-${index + 1}.json`), 'requests/ollama-proposed-writing.json'];
  if (!sameSet(manifest.preparedRequestFiles, canonical)) fail('PILOT_CALL_COUNT');
  const requests = manifest.preparedRequestFiles.map((file) => ({ file, request: json(files[file]) }));
  for (const { file, request } of requests) {
    const wire = file.startsWith('requests/typesafe-') ? { state: request.state, model: request.model, questions: request.questions } :
      { model: request.model, messages: request.messages, stream: request.stream,
        options: { temperature: request.options?.temperature, num_predict: request.options?.num_predict } };
    if (files[file] !== JSON.stringify(wire)) fail('PILOT_REQUEST_NOT_CANONICAL');
  }
  const ollama = requests.filter(({ file }) => file.startsWith('requests/ollama-'));
  const typesafe = requests.filter(({ file }) => /^requests\/typesafe-[1-8]\.json$/.test(file));
  if (requests.length !== 12 || ollama.length !== 4 || typesafe.length !== 8) fail('PILOT_CALL_COUNT');
  for (const { request } of ollama) {
    if (!exact(request, ['model', 'messages', 'stream', 'options']) || !exact(request.options, ['temperature', 'num_predict']) ||
        !Array.isArray(request.messages) || request.messages.length !== 2 || request.messages.some((message, index) =>
          !exact(message, ['role', 'content']) || message.role !== ['system', 'user'][index] || typeof message.content !== 'string' ||
          !message.content.trim() || message.content.includes('\0')) ||
        request.model !== PILOT_MODELS.ollama || request.stream !== false || request.options?.temperature !== 0.2 ||
        Buffer.byteLength(JSON.stringify(request)) > 56000) fail('PILOT_REQUEST_INVALID');
    const input = json(request.messages?.[1]?.content);
    if (input.exactArticleMarkdown !== markdown || (input.articleSha256 ?? input.basisArticleSha256) !== descriptor.articleSha256) fail('PILOT_REQUEST_HASH');
    if (!Array.isArray(input.publicUnits) || !wordingMatches(input.publicUnits, input.publicUnits.map((unit) => unit.id), 'text') ||
        !provenanceMatches(input)) fail('PILOT_COVERAGE_INVALID');
  }
  const factual = ollama.filter(({ file }) => /exact-draft-review-[1-3]\.json$/.test(file));
  const writing = ollama.find(({ file }) => file === 'requests/ollama-proposed-writing.json');
  if (factual.length !== 3 || !writing || factual.some(({ request }) => request.options.num_predict !== 1000) || writing.request.options.num_predict !== 3000) fail('PILOT_REQUEST_INVALID');
  const factualInputs = factual.map(({ request }) => json(request.messages[1].content));
  const knownGroups = claimMap.groups.map((group) => group.id);
  const knownUnits = claimMap.publicUnits.map((unit) => unit.id);
  if (!sameSet(json(writing.request.messages[1].content).publicUnits.map((unit) => unit.id), knownUnits)) fail('PILOT_COVERAGE_INVALID');
  if (factualInputs.some((input) => !Array.isArray(input.assignedGroups) || !input.assignedGroups.length || !input.publicUnits.length || input.assignedGroups.some((group) =>
    !sameSet(group.units, groups.get(group.id)?.units) || !sameSet(group.evidence, groups.get(group.id)?.evidence)))) fail('PILOT_COVERAGE_INVALID');
  if (!sameSet(factualInputs.flatMap((input) => input.assignedGroups.map((group) => group.id)), knownGroups) ||
      !sameSet(factualInputs.flatMap((input) => input.publicUnits.map((unit) => unit.id)), knownUnits)) fail('PILOT_COVERAGE_INVALID');
  const sourceGroups = [];
  for (const { file, request } of typesafe) {
    if (!exact(request, ['state', 'model', 'questions']) || !object(request.state) || !object(request.questions) ||
        request.model !== PILOT_MODELS.typesafe || request.state?.articleSha256 !== descriptor.articleSha256 || !provenanceMatches(request.state) ||
        Object.keys(request.questions).length < 1 ||
        Buffer.byteLength(JSON.stringify(request)) > 25000 || Object.keys(request.questions ?? {}).length > 64 ||
        Object.values(request.questions ?? {}).some((question) => !exact(question, ['type', 'instructions', 'criteria']) ||
          !['choice', 'score', 'noul'].includes(question.type) || typeof question.instructions !== 'string' ||
          !question.instructions.trim() || question.instructions.includes('\0') || Buffer.byteLength(question.instructions) > 4000 ||
          Buffer.byteLength(JSON.stringify({ state: request.state, question })) > 28000)) fail('PILOT_REQUEST_INVALID');
    if (!Array.isArray(request.state.groups) || request.state.groups.some((group) =>
      !groups.has(group.id) || !wordingMatches(group.publicWording, groups.get(group.id).units, 'wording') ||
      !sameSet(group.evidenceIds, groups.get(group.id).evidence)) ||
      (request.state.groups.length && !sameSet(Object.keys(request.questions), request.state.groups.map((group) => group.id)))) fail('PILOT_COVERAGE_INVALID');
    if (file !== 'requests/typesafe-8.json' && !request.state.groups.length) fail('PILOT_COVERAGE_INVALID');
    if (request.state.groups.length && Object.values(request.questions).some((question) =>
      question.type !== 'choice' || !exact(question.criteria, ['supported', 'contradicted', 'insufficient']) ||
      Object.values(question.criteria).some((value) => typeof value !== 'string' || !value.trim() || value.includes('\0') || Buffer.byteLength(value) > 4000))) fail('PILOT_REQUEST_INVALID');
    sourceGroups.push(...(request.state.groups ?? []).map((group) => group.id));
  }
  if (!sameSet(sourceGroups, knownGroups)) fail('PILOT_COVERAGE_INVALID');
  const diagnostics = typesafe.find(({ file }) => file === 'requests/typesafe-8.json').request;
  if (diagnostics.state.groups.length !== 0 || diagnostics.state.exactArticleMarkdown !== markdown ||
      !sameSet(Object.keys(diagnostics.questions), ['clarity', 'actual_duplicate', 'control_support', 'control_contradiction',
        'control_insufficient', 'duplicate_control_positive', 'duplicate_control_negative']) ||
      !exact(diagnostics.state.controls, ['support', 'contradiction', 'insufficient', 'duplicatePositive', 'duplicateNegative'])) fail('PILOT_COVERAGE_INVALID');
  for (const [id, question] of Object.entries(diagnostics.questions)) {
    const valid = id === 'clarity' ? question.type === 'score' && Array.isArray(question.criteria) && question.criteria.length === 6 :
      id.startsWith('control_') ? question.type === 'choice' && exact(question.criteria, ['supported', 'contradicted', 'insufficient']) :
        question.type === 'noul' && exact(question.criteria, ['true', 'false']);
    if (!valid || Object.values(question.criteria).some((value) => typeof value !== 'string' || !value.trim() || value.includes('\0') || Buffer.byteLength(value) > 4000)) fail('PILOT_REQUEST_INVALID');
  }
  const history = json(files['duplicate-catalog.json']);
  if (history.catalogFile !== 'public-sources/aft-blog-search-index.json' || history.sourceProofFile !== 'catalog-build-receipt.json' ||
      !/^[a-f0-9]{40}$/.test(history.siteCommit ?? '') || history.siteCommit !== descriptor.catalogSourceCommit ||
      !HASH.test(history.sourceSha256 ?? '') || digest(files[history.catalogFile] ?? '') !== history.sourceSha256) fail('PILOT_HISTORY_UNASSESSED');
  const catalog = json(files[history.catalogFile]);
  const catalogProof = json(files[history.sourceProofFile]);
  if (catalogProof.verified !== true || catalogProof.clean !== true || catalogProof.exitCode !== 0 || catalogProof.commit !== history.siteCommit ||
      catalogProof.build?.commit !== history.siteCommit || catalogProof.build.clean !== true || !Array.isArray(catalog.posts) ||
      history.totalEntries !== catalog.posts.length || !Array.isArray(history.previous) || history.previous.length < 1 || history.previous.length > 12 ||
      !sameSet(history.previous.map((entry) => entry.slug), history.previous.map((entry) => entry.slug)) ||
      JSON.stringify(diagnostics.state.previous) !== JSON.stringify(history.previous)) fail('PILOT_HISTORY_UNASSESSED');
  const posts = new Map(catalog.posts.map((post) => [post.slug, post]));
  if (posts.size !== catalog.posts.length || history.previous.some((entry) => !exact(entry, ['slug', 'text']) ||
      typeof posts.get(entry.slug)?.title !== 'string' || typeof posts.get(entry.slug)?.summary !== 'string' ||
      entry.text !== `${posts.get(entry.slug).title}\n\n${posts.get(entry.slug).summary}`)) fail('PILOT_HISTORY_UNASSESSED');
  const jina = ['requests/jina-release-readme.json', 'requests/jina-main-readme.json'].map((file) => ({ file, request: json(files[file]) }));
  for (const { request } of jina) {
    if (request.method !== 'GET' || request.tokenBudget !== 5000 ||
        !/^https:\/\/raw\.githubusercontent\.com\/localsend\/localsend\/[a-f0-9]{40}\/README\.md$/.test(request.url ?? '') ||
        JSON.stringify(request.headers) !== JSON.stringify({ Accept: 'application/json', 'X-Token-Budget': '5000', 'X-Retain-Images': 'none', 'X-Respond-With': 'markdown' }) ||
        !HASH.test(request.sourceSha256 ?? '') || !NAME.test(request.sourceFile ?? '') || digest(files[request.sourceFile] ?? '') !== request.sourceSha256) fail('PILOT_JINA_REQUEST_INVALID');
    const source = sourceManifest.sources.find((item) => item.file === request.sourceFile);
    if (!source || source.sha256 !== request.sourceSha256 || request.url !== `https://raw.githubusercontent.com/localsend/localsend/${source.commit}/README.md`) fail('PILOT_JINA_REQUEST_INVALID');
  }
  if (new Set(jina.map(({ request }) => request.url)).size !== 2 || new Set(jina.map(({ request }) => request.sourceFile)).size !== 2) fail('PILOT_JINA_REQUEST_INVALID');
  if (budget.models?.ollama !== PILOT_MODELS.ollama || budget.models?.typesafe !== PILOT_MODELS.typesafe ||
      budget.proposedReservations?.jina?.calls !== 2 || budget.proposedReservations.jina.reservedReaderTokens !== 10000 ||
      budget.proposedReservations?.ollama?.calls !== 4 || budget.proposedReservations.ollama.totalUnits !== 530288 ||
      budget.proposedReservations.ollama.reservedInputTokens !== 524288 || budget.proposedReservations.ollama.reservedGeneratedTokens !== 6000 ||
      budget.proposedReservations?.typesafe?.calls !== 8 || budget.proposedReservations.typesafe.reservedInputTokens !== 524288) fail('PILOT_BUDGET_INVALID');
  return { files, manifest, budget, contract, descriptor, markdown, claimMap, jina, factual, writing, typesafe, totalBytes };
}
