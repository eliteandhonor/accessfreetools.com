import { beginDay, brisbaneDay, holdDay } from './daily-editorial-state.mjs';
import { paidCall, EditorialHold } from './daily-editorial-pipeline.mjs';
import { jinaRead, ollamaChat, typesafeEvaluate } from './daily-editorial-providers.mjs';
import { validatePilotOllamaReview, validatePilotWriting, validatePilotTypeSafe } from './daily-editorial-pilot-reviews.mjs';
import { PILOT_LIMITS, digest } from './daily-editorial-pilot-package.mjs';

const requireCondition = (value, code) => { if (!value) throw new EditorialHold(code); };
const freeze = (value) => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };
const REF = /^[A-Za-z0-9][A-Za-z0-9_.:/#@-]{0,239}$/;
const COMMIT = /^[a-f0-9]{40}$/;
const SAFE_CODES = new Set([
  'PILOT_APPROVAL_REQUIRED', 'PILOT_CODE_APPROVAL_REQUIRED', 'PILOT_STORAGE_REQUIRED', 'PILOT_INPUT_COMMIT_REQUIRED',
  'PILOT_LEDGER_BASELINE_REQUIRED',
  'PILOT_SHARED_ALLOCATION_REQUIRED', 'PILOT_GRANT_ALREADY_USED', 'PILOT_CONTEXT_UNASSESSED', 'PILOT_WEBSITE_EVIDENCE_REQUIRED',
  'PILOT_ARTICLE_REVIEW_REQUIRED', 'PILOT_FROZEN_REQUEST_UNASSESSED', 'PILOT_DAY_IN_USE', 'PILOT_DAY_CHANGED',
  'PILOT_JINA_SOURCE_CHANGED', 'PILOT_JINA_SOURCE_INCOMPLETE', 'PILOT_REVIEW_SCHEMA', 'PILOT_REVIEW_HASH',
  'PILOT_REVIEW_COVERAGE', 'PILOT_REVIEW_ISSUES', 'PILOT_REVIEW_FLAGS', 'PILOT_REQUEST_INVALID', 'PILOT_USAGE_INVALID',
  'PILOT_WRITING_SCHEMA', 'PILOT_WRITING_HASH', 'PILOT_WRITING_UNRESOLVED', 'PILOT_WRITING_CHANGE_COVERAGE',
  'PILOT_TYPESAFE_SCHEMA', 'PILOT_SOURCE_UNSUPPORTED', 'PILOT_CONTROL_FAILED', 'PILOT_CLARITY_HELD', 'PILOT_DUPLICATE_HELD',
  'PILOT_REQUEST_COVERAGE', 'OUTCOME_UNKNOWN', 'CALL_NOT_REPLAYABLE', 'PROVIDER_USAGE_BOUND_EXCEEDED',
  'BUDGET_EXHAUSTED', 'REQUEST_TIMEOUT', 'REQUEST_FAILED', 'HTTP_ERROR', 'INVALID_RESPONSE', 'INVALID_GENERATED_JSON',
  'SOURCE_INCOMPLETE', 'SOURCE_URL_CHANGED', 'PROVIDER_BUDGET_EXCEEDED', 'STATE_CONFLICT_OR_UNKNOWN',
]);

/** Admission requires an independently approved exact code and input/storage configuration. */
export function admitPilot(config, { approval, approvedCode, codeCommit, clean = false } = {}) {
  requireCondition(config?.schemaVersion === 1 && config.enabled === true && config.repository === 'eliteandhonor/accessfreetools.com' &&
    config.timezone === 'Australia/Brisbane' && config.publicationEnabled === false && REF.test(config.activationReview ?? '') &&
    approval === config.activationReview, 'PILOT_APPROVAL_REQUIRED');
  requireCondition(COMMIT.test(codeCommit ?? '') && approvedCode === codeCommit && clean, 'PILOT_CODE_APPROVAL_REQUIRED');
  requireCondition(/^eliteandhonor\/[A-Za-z0-9_.-]+$/.test(config.stateRepository ?? '') &&
    !['eliteandhonor/accessfreetools.com', 'eliteandhonor/access-free-tools'].includes(config.stateRepository.toLowerCase()) &&
    REF.test(config.privateStoreApproval ?? ''), 'PILOT_STORAGE_REQUIRED');
  requireCondition(COMMIT.test(config.inputCommit ?? ''), 'PILOT_INPUT_COMMIT_REQUIRED');
  requireCondition(config.contextReview?.decision === 'context-units-approved' && REF.test(config.contextReview.ref ?? ''), 'PILOT_CONTEXT_UNASSESSED');
  const grant = config.sharedBudgetAllocation;
  requireCondition(grant && REF.test(grant.reviewRef ?? '') && grant.purpose === 'unpublished-localsend-pilot' &&
    ['jina', 'ollama', 'typesafe'].every((provider) =>
      grant.aftCaps?.[provider] === PILOT_LIMITS[provider].units && grant.aftCallCaps?.[provider] === PILOT_LIMITS[provider].calls &&
      Number.isSafeInteger(grant.gtaCaps?.[provider]) && grant.gtaCaps[provider] >= 0 &&
      Number.isSafeInteger(grant.gtaCallCaps?.[provider]) && grant.gtaCallCaps[provider] >= 0 &&
      Number.isSafeInteger(grant.sharedCaps?.[provider]) && grant.aftCaps[provider] + grant.gtaCaps[provider] <= grant.sharedCaps[provider] &&
      Number.isSafeInteger(grant.sharedCallCaps?.[provider]) && grant.aftCallCaps[provider] + grant.gtaCallCaps[provider] <= grant.sharedCallCaps[provider]),
  'PILOT_SHARED_ALLOCATION_REQUIRED');
  return true;
}

/** A separate state-only check admits no input bundle or provider allowance. */
export function admitStatePreflight(config, { approval, approvedCode, codeCommit, clean = false } = {}) {
  requireCondition(config?.schemaVersion === 1 && config.enabled === false && config.publicationEnabled === false &&
    config.repository === 'eliteandhonor/accessfreetools.com' && config.timezone === 'Australia/Brisbane' &&
    REF.test(config.activationReview ?? '') && approval === config.activationReview, 'PILOT_APPROVAL_REQUIRED');
  requireCondition(COMMIT.test(codeCommit ?? '') && approvedCode === codeCommit && clean, 'PILOT_CODE_APPROVAL_REQUIRED');
  requireCondition(config.stateRepository === 'eliteandhonor/accessfreetools-editorial-state' &&
    REF.test(config.privateStoreApproval ?? ''), 'PILOT_STORAGE_REQUIRED');
  return true;
}

/** Live execution requires a committed ledger and cannot initialize an absent branch. */
export async function loadPilotLedger(store) {
  const state = await store.load();
  const commit = typeof store.currentCommit === 'function' ? store.currentCommit() : null;
  requireCondition(typeof commit === 'string' && COMMIT.test(commit),
    'PILOT_LEDGER_BASELINE_REQUIRED');
  return state;
}

/** No public content mutation. A possibly sent unknown call blocks every future day. */
export async function runHeldPilot({ config, state, store, pkg, approval, approvedCode, codeCommit, clean,
  now = new Date(), clock = () => new Date(), providers = {}, keys = {} }) {
  // Checkpoints and provider waits must not let a caller change the admitted
  // configuration or frozen request after its reservation has been recorded.
  config = freeze(structuredClone(config));
  pkg = freeze(structuredClone(pkg));
  providers = Object.freeze({ ...providers });
  keys = Object.freeze({ ...keys });
  admitPilot(config, { approval, approvedCode, codeCommit, clean });
  requireCondition(pkg?.contextReport?.passed === true, 'PILOT_CONTEXT_UNASSESSED');
  requireCondition(pkg?.frozenRequestReview?.passed === true, 'PILOT_FROZEN_REQUEST_UNASSESSED');
  requireCondition(pkg.contract.websiteSnapshotsComplete === true, 'PILOT_WEBSITE_EVIDENCE_REQUIRED');
  requireCondition(pkg.contract.independentArticleReview?.status === 'passed' &&
    pkg.contract.independentArticleReview.articleSha256 === pkg.descriptor.articleSha256, 'PILOT_ARTICLE_REVIEW_REQUIRED');
  const day = brisbaneDay(now);
  // A reviewed pilot allocation is a one-time grant, not a new allowance at
  // midnight. A changed bundle also needs a separately reviewed grant.
  requireCondition(!(state.pilotGrants ?? []).some((entry) => entry.day !== day &&
    (entry.manifestSha256 === pkg.descriptor.manifestSha256 || entry.grantReview === config.sharedBudgetAllocation.reviewRef)) &&
    !Object.entries(state.days).some(([otherDay, entry]) => otherDay !== day &&
    entry.purpose === 'unpublished-localsend-pilot' && (entry.pilot?.manifestSha256 === pkg.descriptor.manifestSha256 ||
      entry.pilot?.grantReview === config.sharedBudgetAllocation.reviewRef)), 'PILOT_GRANT_ALREADY_USED');
  const previous = state.days[day];
  requireCondition(!previous || (previous.purpose === 'unpublished-localsend-pilot' &&
    previous.pilot?.manifestSha256 === pkg.descriptor.manifestSha256 && previous.pilot?.budgetSha256 === pkg.descriptor.budgetSha256 &&
    previous.pilot?.inputCommit === config.inputCommit), 'PILOT_DAY_IN_USE');
  const record = beginDay(state, day);
  if (record.status === 'held') return record;
  record.purpose = 'unpublished-localsend-pilot';
  record.pilot ??= { manifestSha256: pkg.descriptor.manifestSha256, budgetSha256: pkg.descriptor.budgetSha256,
    articleSha256: pkg.descriptor.articleSha256, registrySha256: pkg.contextReport.registrySha256,
    inputCommit: config.inputCommit, grantReview: config.sharedBudgetAllocation.reviewRef, validations: {} };
  requireCondition(record.pilot.registrySha256 === pkg.contextReport.registrySha256 &&
    record.pilot.grantReview === config.sharedBudgetAllocation.reviewRef, 'PILOT_DAY_IN_USE');
  state.pilotGrants ??= [];
  const usedGrant = state.pilotGrants.find((entry) => entry.day === day);
  const grantIdentity = { day, manifestSha256: pkg.descriptor.manifestSha256, budgetSha256: pkg.descriptor.budgetSha256,
    inputCommit: config.inputCommit, grantReview: config.sharedBudgetAllocation.reviewRef };
  if (usedGrant) requireCondition(Object.keys(grantIdentity).every((key) => usedGrant[key] === grantIdentity[key]), 'PILOT_DAY_IN_USE');
  else { requireCondition(state.pilotGrants.length < 128, 'PILOT_GRANT_ALREADY_USED'); state.pilotGrants.push(grantIdentity); }
  await store.checkpoint(state);
  const paid = async (params) => {
    requireCondition(brisbaneDay(clock()) === day, 'PILOT_DAY_CHANGED');
    return paidCall({ state, store, day, config: { limits: PILOT_LIMITS }, ...params,
      invoke: () => { requireCondition(brisbaneDay(clock()) === day, 'PILOT_DAY_CHANGED'); return params.invoke(); } });
  };
  const validate = async (id, verdict) => {
    record.pilot.validations[id] = verdict;
    await store.checkpoint(state);
    requireCondition(verdict.passed === true, verdict.code);
  };
  try {
    for (const { file, request } of pkg.jina) {
      const id = file.includes('release') ? 'pilot-jina-release' : 'pilot-jina-main';
      const response = await paid({ id, provider: 'jina', request, units: 5000,
        invoke: () => (providers.jina ?? jinaRead)(request.url, { key: keys.jina, tokenBudget: 5000, timeoutMs: 30000 }) });
      requireCondition(response.data?.url === request.url && response.data?.truncated === false &&
        typeof response.data.text === 'string', 'PILOT_JINA_SOURCE_INCOMPLETE');
      // Conservative exact comparison: never promote a transformed/truncated
      // document to the saved Git source identity automatically.
      requireCondition(digest(response.data.text) === request.sourceSha256, 'PILOT_JINA_SOURCE_CHANGED');
      await validate(id, { passed: true, code: 'PILOT_JINA_VALIDATED' });
    }
    for (const [index, { request }] of pkg.factual.entries()) {
      const id = `pilot-ollama-review-${index + 1}`;
      const response = await paid({ id, provider: 'ollama', request, units: 132072,
        invoke: () => (providers.ollama ?? ollamaChat)(request.messages, { key: keys.ollama, model: 'gpt-oss:120b', maxOutputTokens: 1000, timeoutMs: 120000 }) });
      await validate(id, validatePilotOllamaReview(request, response, { articleSha256: pkg.descriptor.articleSha256 }));
    }
    for (const [index, { request }] of pkg.typesafe.entries()) {
      const id = `pilot-typesafe-${index + 1}`;
      const response = await paid({ id, provider: 'typesafe', request, units: 65536,
        invoke: () => (providers.typesafe ?? typesafeEvaluate)(request.state, request.questions, { key: keys.typesafe, model: 'jev-1.13.0', timeoutMs: 30000 }) });
      await validate(id, validatePilotTypeSafe(request, response));
    }
    const request = pkg.writing.request;
    const response = await paid({ id: 'pilot-ollama-writing', provider: 'ollama', request, units: 134072,
      invoke: () => (providers.ollama ?? ollamaChat)(request.messages, { key: keys.ollama, model: 'gpt-oss:120b', maxOutputTokens: 3000, timeoutMs: 120000 }) });
    await validate('pilot-ollama-writing', validatePilotWriting(request, response, { articleSha256: pkg.descriptor.articleSha256 }));
    requireCondition(Object.keys(record.pilot.validations).length === 14, 'PILOT_FROZEN_REQUEST_UNASSESSED');
    record.pilot.result = 'reviewed-unpublished';
    record.pilot.writingProposalAdopted = false;
    record.pilot.completedAt = clock().toISOString();
    // Terminal held day prevents the normal daily selector using this grant.
    holdDay(state, day, 'PILOT_COMPLETE_UNPUBLISHED');
    await store.checkpoint(state);
    return record;
  } catch (error) {
    holdDay(state, day, SAFE_CODES.has(error?.code) ? error.code : 'PILOT_HELD');
    await store.checkpoint(state);
    return record;
  }
}

/** Explicit public projection. No source, draft, response, issue text, or private path. */
export function pilotOutcome(record, fallback = 'PILOT_HELD') {
  const complete = record?.pilot?.result === 'reviewed-unpublished';
  const providers = {};
  for (const provider of ['jina', 'ollama', 'typesafe']) {
    const budget = record?.budget?.providers?.[provider];
    if (Number.isSafeInteger(budget?.calls) && budget.calls >= 0 && budget.calls <= PILOT_LIMITS[provider].calls &&
        Number.isSafeInteger(budget.units) && budget.units >= 0 && budget.units <= PILOT_LIMITS[provider].units) {
      providers[provider] = { attempts: budget.calls, reservedUnits: budget.units };
    }
  }
  const reason = record?.reason ?? fallback;
  return { schemaVersion: 1, status: complete ? 'reviewed-unpublished' : 'held',
    reason: complete ? 'PILOT_COMPLETE_UNPUBLISHED' : SAFE_CODES.has(reason) ? reason : 'PILOT_HELD',
    published: false, writingProposalAdopted: false, providers };
}
