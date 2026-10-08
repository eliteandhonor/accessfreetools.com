import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { admitPilot, admitStatePreflight, runHeldPilot, pilotOutcome } from './daily-editorial-pilot.mjs';
import { PILOT_LIMITS, validatePilotPackage } from './daily-editorial-pilot-package.mjs';
import { beginDay, brisbaneDay, compactState, createLocalStateStore, holdDay, newState, validateState } from './daily-editorial-state.mjs';
import { runDailyEditorial, sha256 } from './daily-editorial-pipeline.mjs';
import { makePilotPackageFixture } from '../fixtures/daily-editorial/pilot-fixture.mjs';

// No real article, private input, provider receipt, credential or network transport.
// Synthetic approvals below exercise orchestration; they certify no real registry.
const NOW = new Date('2026-10-08T02:00:00.000Z');
const NEXT_DAY = new Date('2026-10-09T02:00:00.000Z');
const CODE = 'c'.repeat(40);
const clone = (value) => structuredClone(value);
const caps = (key) => Object.fromEntries(Object.entries(PILOT_LIMITS).map(([provider, limit]) => [provider, limit[key]]));
const zeros = () => ({ jina: 0, ollama: 0, typesafe: 0 });

describe('state-only admission', () => {
  const config = { schemaVersion: 1, enabled: false, publicationEnabled: false,
    repository: 'eliteandhonor/accessfreetools.com', timezone: 'Australia/Brisbane',
    stateRepository: 'eliteandhonor/accessfreetools-editorial-state', privateStoreApproval: 'synthetic-state-review',
    activationReview: 'synthetic-code-review' };
  const admission = { approval: 'synthetic-code-review', codeCommit: CODE, approvedCode: CODE, clean: true };
  it('admits a reviewed disabled state-only check without approving providers', () => {
    expect(admitStatePreflight(config, admission)).toBe(true);
    expect(() => admitPilot(config, admission)).toThrow();
  });
  it.each([
    ['enabled', true], ['publicationEnabled', true], ['stateRepository', 'eliteandhonor/accessfreetools.com'],
    ['privateStoreApproval', null], ['activationReview', null],
  ])('holds an unsafe state-only %s', (key, value) => {
    expect(() => admitStatePreflight({ ...config, [key]: value }, admission)).toThrow();
  });
  it('holds changed code, unreviewed code and a dirty checkout before storage access', () => {
    for (const change of [{ codeCommit: 'e'.repeat(40) }, { approvedCode: null }, { clean: false }]) {
      expect(() => admitStatePreflight(config, { ...admission, ...change })).toThrow();
    }
  });
});

function setup() {
  const fixture = makePilotPackageFixture();
  const pkg = validatePilotPackage(fixture.files, fixture.descriptor);
  pkg.contextReport = { passed: true, registrySha256: pkg.descriptor.contextRegistrySha256, syntheticFixtureOnly: true };
  pkg.frozenRequestReview = { passed: true, syntheticFixtureOnly: true };
  pkg.contract.websiteSnapshotsComplete = true;
  pkg.contract.independentArticleReview = { status: 'passed', articleSha256: pkg.descriptor.articleSha256,
    reviewer: 'synthetic-only independent reviewer', syntheticFixtureOnly: true };
  const config = { schemaVersion: 1, enabled: true, publicationEnabled: false,
    repository: 'eliteandhonor/accessfreetools.com', timezone: 'Australia/Brisbane',
    activationReview: 'synthetic-activation-review', stateRepository: 'eliteandhonor/synthetic-private-state-fixture',
    privateStoreApproval: 'synthetic-private-store-review', inputCommit: 'd'.repeat(40),
    contextReview: JSON.parse(fixture.files['parent-context-review.json']),
    sharedBudgetAllocation: { reviewRef: 'synthetic-once-only-allocation', purpose: 'unpublished-localsend-pilot',
      aftCaps: caps('units'), aftCallCaps: caps('calls'), gtaCaps: zeros(), gtaCallCaps: zeros(),
      sharedCaps: caps('units'), sharedCallCaps: caps('calls') } };
  const admission = { approval: config.activationReview, approvedCode: CODE, codeCommit: CODE, clean: true };
  const state = newState();
  const store = memoryStore();
  return { fixture, pkg, config, state, store, admission };
}

function memoryStore(initial) {
  return { snapshots: initial ? [clone(initial)] : [], async checkpoint(state) {
    validateState(state);
    this.snapshots.push(clone(state));
    return { durable: true };
  } };
}

const inputOf = (request) => JSON.parse(request.messages.find((message) => message.role === 'user').content);
const choice = (label = 'supported') => ({ type: 'choice', choice: label,
  probabilities: Object.fromEntries(['supported', 'contradicted', 'insufficient'].map((key) => [key, key === label ? 0.96 : 0.02])),
  confidence: (0.96 - 1 / 3) / (1 - 1 / 3) });

function factualResponse(request) {
  const input = inputOf(request);
  return { data: { articleSha256: input.articleSha256, assignedGroupIds: input.assignedGroups.map((group) => group.id),
    coveredPublicUnitIds: input.publicUnits.map((unit) => unit.id), practical: true, noInventedTesting: true, clear: true, issues: [] },
  usage: { inputTokens: 300, outputTokens: 100 } };
}

function writingResponse(request) {
  const input = inputOf(request);
  return { data: { basisArticleSha256: input.basisArticleSha256,
    proposedMarkdown: input.exactArticleMarkdown.replace('Synthetic public unit 0:', 'Synthetic public unit zero:'),
    changes: [{ publicUnitIds: [input.publicUnits[0].id], reason: 'Synthetic shorter wording proposal.' }], unresolvedIssues: [] },
  usage: { inputTokens: 300, outputTokens: 100 } };
}

function typesafeResponse(request) {
  const answers = Object.fromEntries(Object.entries(request.questions).map(([id, question]) => {
    if (question.type === 'choice') return [id, choice(id === 'control_contradiction' ? 'contradicted' : id === 'control_insufficient' ? 'insufficient' : 'supported')];
    if (question.type === 'noul') return [id, { type: 'noul', noul: id === 'duplicate_control_positive' ? 0.9 : 0.1 }];
    return [id, { type: 'score', score: 4, legend: Object.fromEntries(question.criteria.map((text, index) => [index, text])),
      probabilities: Object.fromEntries(question.criteria.map((_, index) => [index, index === 4 ? 1 : 0])), confidence: 1 }];
  }));
  return { data: { model: 'jev-1.13.0', answers }, usage: { inputTokens: 300, outputTokens: 30 } };
}

function mockProviders(context, { onDispatch = () => {}, editResponse = () => {} } = {}) {
  const dispatched = [];
  const check = (provider, id, request, options) => {
    // This saved snapshot, not the mutable in-memory record, authorizes dispatch.
    const durable = context.store.snapshots.at(-1);
    const record = durable?.days[brisbaneDay(context.now ?? NOW)];
    expect(durable.pilotGrants).toContainEqual({ day: brisbaneDay(context.now ?? NOW),
      manifestSha256: context.pkg.descriptor.manifestSha256, budgetSha256: context.pkg.descriptor.budgetSha256,
      inputCommit: context.config.inputCommit, grantReview: context.config.sharedBudgetAllocation.reviewRef });
    expect(record?.calls[id]).toMatchObject({ provider, status: 'pending', requestHash: sha256(request) });
    expect(record.budget.providers[provider].units).toBeLessThanOrEqual(PILOT_LIMITS[provider].units);
    expect(record.budget.providers[provider].calls).toBeLessThanOrEqual(PILOT_LIMITS[provider].calls);
    expect(options.key).toBeUndefined();
    dispatched.push(id);
    onDispatch({ provider, id, request, durable });
  };
  const providers = {
    jina: vi.fn(async (url, options) => {
      const { file, request } = context.pkg.jina.find((entry) => entry.request.url === url);
      const id = file.includes('release') ? 'pilot-jina-release' : 'pilot-jina-main';
      check('jina', id, request, options);
      expect(options.tokenBudget).toBe(5000);
      const response = { data: { url, text: context.pkg.files[request.sourceFile], truncated: false }, usage: { tokens: 50 } };
      editResponse(id, response);
      return response;
    }),
    ollama: vi.fn(async (messages, options) => {
      const index = context.pkg.factual.findIndex((entry) => JSON.stringify(entry.request.messages) === JSON.stringify(messages));
      const writing = index === -1;
      const request = writing ? context.pkg.writing.request : context.pkg.factual[index].request;
      const id = writing ? 'pilot-ollama-writing' : `pilot-ollama-review-${index + 1}`;
      check('ollama', id, request, options);
      expect(options.model).toBe('gpt-oss:120b');
      expect(options.maxOutputTokens).toBe(writing ? 3000 : 1000);
      const response = writing ? writingResponse(request) : factualResponse(request);
      editResponse(id, response);
      return response;
    }),
    typesafe: vi.fn(async (state, questions, options) => {
      const index = context.pkg.typesafe.findIndex((entry) => JSON.stringify(entry.request.state) === JSON.stringify(state));
      const request = context.pkg.typesafe[index].request;
      const id = `pilot-typesafe-${index + 1}`;
      check('typesafe', id, request, options);
      expect(questions).toEqual(request.questions);
      expect(options.model).toBe('jev-1.13.0');
      const response = typesafeResponse(request);
      editResponse(id, response);
      return response;
    }),
    publish: vi.fn(() => { throw new Error('Synthetic pilot must never publish.'); }),
  };
  return { providers, dispatched };
}

const run = (context, providers, extra = {}) => runHeldPilot({ ...context, ...context.admission,
  now: context.now ?? NOW, clock: () => context.now ?? NOW, providers, ...extra });

describe('held pilot admission', () => {
  it('requires independent context approval and an exact clean reviewed code identity', () => {
    const { config, admission } = setup();
    expect(config.contextReview.ref).not.toBe(config.activationReview);
    expect(admitPilot(config, admission)).toBe(true);
  });
  it.each([
    ['disabled config', (c) => { c.enabled = false; }, 'PILOT_APPROVAL_REQUIRED'],
    ['publication enabled', (c) => { c.publicationEnabled = true; }, 'PILOT_APPROVAL_REQUIRED'],
    ['wrong repository', (c) => { c.repository = 'eliteandhonor/access-free-tools'; }, 'PILOT_APPROVAL_REQUIRED'],
    ['wrong timezone', (c) => { c.timezone = 'UTC'; }, 'PILOT_APPROVAL_REQUIRED'],
    ['wrong activation approval', (c) => { c.activationReview = 'different-review'; }, 'PILOT_APPROVAL_REQUIRED'],
    ['public site storage', (c) => { c.stateRepository = 'eliteandhonor/accessfreetools.com'; }, 'PILOT_STORAGE_REQUIRED'],
    ['other public site storage', (c) => { c.stateRepository = 'eliteandhonor/access-free-tools'; }, 'PILOT_STORAGE_REQUIRED'],
    ['wrong state owner', (c) => { c.stateRepository = 'other-owner/private-state'; }, 'PILOT_STORAGE_REQUIRED'],
    ['missing private storage approval', (c) => { c.privateStoreApproval = null; }, 'PILOT_STORAGE_REQUIRED'],
    ['missing immutable private input', (c) => { c.inputCommit = null; }, 'PILOT_INPUT_COMMIT_REQUIRED'],
    ['missing context review', (c) => { c.contextReview = null; }, 'PILOT_CONTEXT_UNASSESSED'],
    ['activation string used as context review', (c) => { c.contextReview = c.activationReview; }, 'PILOT_CONTEXT_UNASSESSED'],
    ['unapproved context decision', (c) => { c.contextReview.decision = 'pending'; }, 'PILOT_CONTEXT_UNASSESSED'],
    ['empty context reference', (c) => { c.contextReview.ref = ''; }, 'PILOT_CONTEXT_UNASSESSED'],
  ])('holds %s', (_, mutate, code) => {
    const { config, admission } = setup(); mutate(config);
    expect(() => admitPilot(config, admission)).toThrow(code);
  });
  it.each([
    ['stale code', { approvedCode: 'e'.repeat(40) }],
    ['malformed code', { codeCommit: 'main', approvedCode: 'main' }],
    ['dirty reviewed checkout', { clean: false }],
    ['missing clean proof', { clean: undefined }],
  ])('holds %s', (_, change) => {
    const { config, admission } = setup();
    expect(() => admitPilot(config, { ...admission, ...change })).toThrow('PILOT_CODE_APPROVAL_REQUIRED');
  });
  it.each([
    ['missing shared allocation', (c) => { c.sharedBudgetAllocation = null; }],
    ['unreviewed allocation', (c) => { c.sharedBudgetAllocation.reviewRef = null; }],
    ['ordinary daily allocation', (c) => { c.sharedBudgetAllocation.purpose = 'daily'; }],
    ['changed fixed AFT cap', (c) => { c.sharedBudgetAllocation.aftCaps.ollama++; }],
    ['changed fixed AFT attempt cap', (c) => { c.sharedBudgetAllocation.aftCallCaps.jina++; }],
    ['negative GTA allocation', (c) => { c.sharedBudgetAllocation.gtaCaps.jina = -1; }],
    ['noninteger GTA attempt allocation', (c) => { c.sharedBudgetAllocation.gtaCallCaps.typesafe = 0.5; }],
    ['shared units oversubscribed', (c) => { c.sharedBudgetAllocation.gtaCaps.jina = 1; }],
    ['shared attempts oversubscribed', (c) => { c.sharedBudgetAllocation.gtaCallCaps.ollama = 1; }],
  ])('holds %s', (_, mutate) => {
    const { config, admission } = setup(); mutate(config);
    expect(() => admitPilot(config, admission)).toThrow('PILOT_SHARED_ALLOCATION_REQUIRED');
  });
  it('admits an explicitly sufficient shared allocation without consuming GTA reservations', () => {
    const { config, admission } = setup();
    for (const provider of Object.keys(PILOT_LIMITS)) {
      config.sharedBudgetAllocation.gtaCaps[provider] = 200;
      config.sharedBudgetAllocation.gtaCallCaps[provider] = 2;
      config.sharedBudgetAllocation.sharedCaps[provider] += 200;
      config.sharedBudgetAllocation.sharedCallCaps[provider] += 2;
    }
    const before = clone(config.sharedBudgetAllocation);
    expect(admitPilot(config, admission)).toBe(true);
    expect(config.sharedBudgetAllocation).toEqual(before);
  });
});

describe('held pilot orchestration with synthetic transports', () => {
  it('runs fourteen bounded calls only after durable reservations, keeps the original and never publishes', async () => {
    const context = setup();
    const beforeFiles = clone(context.pkg.files);
    const { providers, dispatched } = mockProviders(context);
    const record = await run(context, providers);
    expect(dispatched).toHaveLength(14);
    expect(record).toMatchObject({ status: 'held', reason: 'PILOT_COMPLETE_UNPUBLISHED',
      pilot: { result: 'reviewed-unpublished', writingProposalAdopted: false } });
    expect(record.budget.providers).toEqual({ jina: { calls: 2, units: 10000 },
      ollama: { calls: 4, units: 530288 }, typesafe: { calls: 8, units: 524288 } });
    expect(Object.keys(record.pilot.validations)).toHaveLength(14);
    expect(context.state.published).toEqual([]);
    expect(context.pkg.files).toEqual(beforeFiles);
    expect(record.calls['pilot-ollama-writing'].receipt.result.data.proposedMarkdown).not.toBe(beforeFiles['localsend-guide.md']);
    expect(providers.publish).not.toHaveBeenCalled();
    const count = dispatched.length;
    expect(await run(context, providers)).toBe(record);
    expect(dispatched).toHaveLength(count);
    expect(pilotOutcome(record)).toEqual({ schemaVersion: 1, status: 'reviewed-unpublished', reason: 'PILOT_COMPLETE_UNPUBLISHED',
      published: false, writingProposalAdopted: false, providers: { jina: { attempts: 2, reservedUnits: 10000 },
        ollama: { attempts: 4, reservedUnits: 530288 }, typesafe: { attempts: 8, reservedUnits: 524288 } } });
  });
  it('enforces disabled admission even when the exported runner is called directly', async () => {
    const context = setup(); context.config.enabled = false;
    const { providers, dispatched } = mockProviders(context);
    await expect(run(context, providers)).rejects.toMatchObject({ code: 'PILOT_APPROVAL_REQUIRED' });
    expect(context.store.snapshots).toEqual([]);
    expect(context.state).toEqual(newState());
    expect(dispatched).toEqual([]);
  });
  it('dispatches the reserved frozen payload when caller requests change during a checkpoint wait', async () => {
    const context = setup();
    const approved = { ...context, config: clone(context.config), pkg: clone(context.pkg) };
    const marker = 'SYNTHETIC_UNAPPROVED_WIRE_PAYLOAD';
    const altered = new Set();
    const originalCheckpoint = context.store.checkpoint;
    context.store.checkpoint = async function (state) {
      await originalCheckpoint.call(this, state);
      const pending = Object.entries(state.days[brisbaneDay(NOW)].calls).find(([, call]) => call.status === 'pending');
      if (!pending || altered.has(pending[0])) return;
      const [id] = pending; altered.add(id);
      if (id === 'pilot-jina-release') {
        context.pkg.jina.find((entry) => entry.file.includes('release')).request.url = `https://unapproved.invalid/${marker}`;
        context.config.enabled = false;
        context.config.sharedBudgetAllocation.reviewRef = marker;
        context.config.sharedBudgetAllocation.aftCaps.ollama = 1;
      }
      if (id === 'pilot-ollama-review-1') {
        context.pkg.factual[0].request.messages[1].content = marker;
        context.pkg.factual[0].request.options.num_predict = 99999;
      }
      if (id === 'pilot-ollama-writing') {
        context.pkg.writing.request.messages[1].content = marker;
        context.pkg.writing.request.options.num_predict = 99999;
      }
    };
    const { providers, dispatched } = mockProviders(approved);
    const record = await run(context, providers);
    expect(record.reason).toBe('PILOT_COMPLETE_UNPUBLISHED');
    expect(dispatched).toHaveLength(14);
    expect(altered).toContain('pilot-jina-release');
    expect(altered).toContain('pilot-ollama-review-1');
    expect(altered).toContain('pilot-ollama-writing');
    expect(providers.jina.mock.calls[0][0]).toBe(approved.pkg.jina.find((entry) => entry.file.includes('release')).request.url);
    expect(providers.ollama.mock.calls[0][0]).toEqual(approved.pkg.factual[0].request.messages);
    expect(providers.ollama.mock.calls.at(-1)[0]).toEqual(approved.pkg.writing.request.messages);
    expect(JSON.stringify([providers.jina.mock.calls, providers.ollama.mock.calls, providers.typesafe.mock.calls])).not.toContain(marker);
    expect(record.pilot.grantReview).toBe(approved.config.sharedBudgetAllocation.reviewRef);
  });
  it.each([
    ['context closure', (p) => { p.contextReport.passed = false; }, 'PILOT_CONTEXT_UNASSESSED'],
    ['frozen request review', (p) => { p.frozenRequestReview.passed = false; }, 'PILOT_FROZEN_REQUEST_UNASSESSED'],
    ['website snapshots', (p) => { p.contract.websiteSnapshotsComplete = false; }, 'PILOT_WEBSITE_EVIDENCE_REQUIRED'],
    ['independent article review', (p) => { p.contract.independentArticleReview.status = 'pending'; }, 'PILOT_ARTICLE_REVIEW_REQUIRED'],
    ['different reviewed article', (p) => { p.contract.independentArticleReview.articleSha256 = 'f'.repeat(64); }, 'PILOT_ARTICLE_REVIEW_REQUIRED'],
  ])('blocks unapproved %s before state or dispatch', async (_, mutate, code) => {
    const context = setup(); mutate(context.pkg);
    const { providers, dispatched } = mockProviders(context);
    await expect(run(context, providers)).rejects.toMatchObject({ code });
    expect(context.store.snapshots).toHaveLength(0);
    expect(dispatched).toHaveLength(0);
  });
  it('does not dispatch when saving the reservation fails and retains the unresolved reservation', async () => {
    const context = setup();
    const originalCheckpoint = context.store.checkpoint;
    context.store.checkpoint = async function (state) {
      await originalCheckpoint.call(this, state);
      if (Object.values(state.days[brisbaneDay(NOW)].calls).some((call) => call.status === 'pending')) {
        throw Object.assign(new Error('Synthetic storage acknowledgement lost.'), { code: 'STATE_CONFLICT_OR_UNKNOWN' });
      }
    };
    const { providers, dispatched } = mockProviders(context);
    await expect(run(context, providers)).rejects.toMatchObject({ code: 'STATE_CONFLICT_OR_UNKNOWN' });
    expect(dispatched).toEqual([]);
    const saved = context.store.snapshots.at(-1);
    expect(saved.days[brisbaneDay(NOW)].calls['pilot-jina-release'].status).toBe('pending');
    expect(saved.days[brisbaneDay(NOW)].budget.providers.jina).toEqual({ calls: 1, units: 5000 });
    await expect(run({ ...context, state: clone(saved), now: NEXT_DAY }, providers)).rejects.toMatchObject({ code: 'PILOT_GRANT_ALREADY_USED' });
    const differentGrant = { ...context, state: clone(saved), now: NEXT_DAY, config: clone(context.config), pkg: clone(context.pkg) };
    differentGrant.config.sharedBudgetAllocation.reviewRef = 'separately-reviewed-synthetic-allocation';
    differentGrant.pkg.descriptor.manifestSha256 = 'e'.repeat(64);
    await expect(run(differentGrant, providers)).rejects.toMatchObject({ code: 'OUTCOME_UNKNOWN' });
    expect(dispatched).toEqual([]);
  });
  it('resumes an exact completed durable receipt after a lost checkpoint acknowledgement without replaying it', async () => {
    const context = setup();
    const originalCheckpoint = context.store.checkpoint;
    let unavailable = false;
    context.store.checkpoint = async function (state) {
      if (unavailable) throw new Error('Synthetic crash after durable completion.');
      await originalCheckpoint.call(this, state);
      if (state.days[brisbaneDay(NOW)].calls['pilot-jina-release']?.status === 'completed') {
        unavailable = true;
        throw new Error('Synthetic completion acknowledgement lost.');
      }
    };
    const first = mockProviders(context);
    await expect(run(context, first.providers)).rejects.toThrow('Synthetic crash');
    expect(first.dispatched).toEqual(['pilot-jina-release']);
    const saved = clone(context.store.snapshots.at(-1));
    expect(saved.days[brisbaneDay(NOW)]).toMatchObject({ status: 'started', calls: { 'pilot-jina-release': { status: 'completed' } } });
    const resumed = { ...context, state: saved, store: memoryStore(saved) };
    const second = mockProviders(resumed);
    const record = await run(resumed, second.providers);
    expect(second.dispatched).toHaveLength(13);
    expect(second.dispatched).not.toContain('pilot-jina-release');
    expect(record.reason).toBe('PILOT_COMPLETE_UNPUBLISHED');
    expect(record.budget.providers.jina).toEqual({ calls: 2, units: 10000 });
  });
  it('persists unknown call outcomes and blocks same-day and next-day retries after a real local reload', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'aft-pilot-synthetic-state-'));
    try {
      const context = setup();
      const local = createLocalStateStore({ file: join(directory, 'state.json'), now: () => NOW });
      context.state = await local.load();
      const memory = context.store;
      context.store = { snapshots: memory.snapshots, async checkpoint(state) {
        await local.checkpoint(state); await memory.checkpoint(state);
      } };
      const mocks = mockProviders(context, { onDispatch: () => {
        throw Object.assign(new Error('SYNTHETIC_PRIVATE_TIMEOUT_DETAIL'), { code: 'REQUEST_TIMEOUT', outcome: 'unknown' });
      } });
      const record = await run(context, mocks.providers);
      expect(record.reason).toBe('REQUEST_TIMEOUT');
      expect(record.calls['pilot-jina-release'].status).toBe('unknown');
      for (const now of [NOW, NEXT_DAY]) {
        const reload = createLocalStateStore({ file: join(directory, 'state.json'), now: () => now });
        const state = await reload.load();
        const retry = { ...context, state, now, config: clone(context.config), pkg: clone(context.pkg) };
        if (now === NEXT_DAY) {
          // Even a separate allocation and input identity cannot bypass an
          // unresolved previous provider outcome after a durable reload.
          retry.config.sharedBudgetAllocation.reviewRef = 'separately-reviewed-synthetic-allocation';
          retry.pkg.descriptor.manifestSha256 = 'e'.repeat(64);
        }
        await expect(run(retry, mocks.providers)).rejects.toMatchObject({ code: 'OUTCOME_UNKNOWN' });
        expect(state.days[brisbaneDay(NOW)].budget.providers.jina).toEqual({ calls: 1, units: 5000 });
      }
      expect(mocks.dispatched).toEqual(['pilot-jina-release']);
      expect(JSON.stringify(pilotOutcome(record))).not.toContain('SYNTHETIC_PRIVATE_TIMEOUT_DETAIL');
    } finally { await rm(directory, { recursive: true, force: true }); }
  });
  it('holds a known negative factual review before TypeSafe or writing without automatic repair', async () => {
    const context = setup();
    const { providers, dispatched } = mockProviders(context, { editResponse: (id, response) => {
      if (id === 'pilot-ollama-review-1') response.data.practical = false;
    } });
    const record = await run(context, providers);
    expect(record.reason).toBe('PILOT_REVIEW_FLAGS');
    expect(dispatched).toEqual(['pilot-jina-release', 'pilot-jina-main', 'pilot-ollama-review-1']);
    expect(providers.typesafe).not.toHaveBeenCalled();
    expect(record.pilot.result).toBeUndefined();
    expect(record.budget.providers.ollama).toEqual({ calls: 1, units: 132072 });
    await run(context, providers);
    expect(dispatched).toHaveLength(3);
  });
  it.each([
    ['changed source document', 'pilot-jina-release', (response) => { response.data.text += 'Synthetic changed source.'; }, 'PILOT_JINA_SOURCE_CHANGED', 1],
    ['truncated source document', 'pilot-jina-release', (response) => { response.data.truncated = true; }, 'PILOT_JINA_SOURCE_INCOMPLETE', 1],
    ['unsupported TypeSafe batch', 'pilot-typesafe-1', (response) => {
      const first = Object.keys(response.data.answers)[0]; response.data.answers[first] = choice('contradicted');
    }, 'PILOT_SOURCE_UNSUPPORTED', 6],
    ['unresolved writing proposal', 'pilot-ollama-writing', (response) => {
      response.data.unresolvedIssues = [{ publicUnitIds: ['unit-0'], reason: 'Synthetic evidence remains uncertain.', requiredEvidence: 'Synthetic complete source.' }];
    }, 'PILOT_WRITING_UNRESOLVED', 14],
  ])('holds %s without dispatching later stages or adopting a rewrite', async (_, failingId, mutate, code, attempted) => {
    const context = setup(); const original = context.pkg.files['localsend-guide.md'];
    const { providers, dispatched } = mockProviders(context, { editResponse: (id, response) => { if (id === failingId) mutate(response); } });
    const record = await run(context, providers);
    expect(record.reason).toBe(code); expect(record.pilot.result).toBeUndefined();
    expect(dispatched).toHaveLength(attempted); expect(dispatched.at(-1)).toBe(failingId);
    expect(context.pkg.files['localsend-guide.md']).toBe(original);
    expect(context.state.published).toEqual([]); expect(providers.publish).not.toHaveBeenCalled();
    await run(context, providers); expect(dispatched).toHaveLength(attempted);
  });
  it('holds a Brisbane day change before the first reservation', async () => {
    const context = setup(); const { providers, dispatched } = mockProviders(context);
    const record = await run(context, providers, { clock: () => NEXT_DAY });
    expect(record.reason).toBe('PILOT_DAY_CHANGED');
    expect(record.budget.providers).toEqual({});
    expect(dispatched).toEqual([]);
  });
  it('does not send a reserved call if midnight passes while its durable checkpoint is awaited', async () => {
    const context = setup(); let currentTime = NOW;
    const originalCheckpoint = context.store.checkpoint;
    context.store.checkpoint = async function (state) {
      await originalCheckpoint.call(this, state);
      if (state.days[brisbaneDay(NOW)].calls['pilot-jina-release']?.status === 'pending') currentTime = NEXT_DAY;
    };
    const { providers, dispatched } = mockProviders(context);
    const record = await run(context, providers, { clock: () => currentTime });
    expect(record.reason).toBe('PILOT_DAY_CHANGED');
    expect(record.calls['pilot-jina-release']).toMatchObject({ status: 'failed', receipt: { code: 'PILOT_DAY_CHANGED' } });
    expect(record.budget.providers.jina).toEqual({ calls: 1, units: 5000 });
    expect(context.store.snapshots.at(-1).days[brisbaneDay(NOW)].calls['pilot-jina-release'].status).toBe('failed');
    expect(dispatched).toEqual([]); expect(providers.jina).not.toHaveBeenCalled();
    const next = { ...context, now: NEXT_DAY }; const replay = mockProviders(next);
    await expect(run(next, replay.providers)).rejects.toMatchObject({ code: 'PILOT_GRANT_ALREADY_USED' });
    expect(replay.dispatched).toEqual([]);
  });
});

describe('pilot grants and normal daily selection stay separate', () => {
  it('cannot reuse a partial ordinary daily run as a pilot day', async () => {
    const context = setup(); beginDay(context.state, brisbaneDay(NOW)).research = { synthetic: true };
    const { providers, dispatched } = mockProviders(context);
    await expect(run(context, providers)).rejects.toMatchObject({ code: 'PILOT_DAY_IN_USE' });
    expect(context.store.snapshots).toHaveLength(0);
    expect(dispatched).toEqual([]);
  });
  it('cannot let the ordinary selector spend a partial pilot day', async () => {
    const context = setup();
    const record = beginDay(context.state, brisbaneDay(NOW));
    record.purpose = 'unpublished-localsend-pilot'; record.pilot = { syntheticFixtureOnly: true };
    const github = vi.fn(() => { throw new Error('Ordinary research must not start.'); });
    const paid = vi.fn(() => { throw new Error('Ordinary providers must not start.'); });
    const publish = vi.fn(() => { throw new Error('No publication.'); });
    const result = await runDailyEditorial({ ...context, now: NOW, providers: { github, jina: paid, ollama: paid, typesafe: paid }, publish });
    expect(result).toMatchObject({ status: 'held', reason: 'DAY_RESERVED_FOR_PILOT' });
    expect(github).not.toHaveBeenCalled(); expect(paid).not.toHaveBeenCalled(); expect(publish).not.toHaveBeenCalled();
    expect(context.store.snapshots).toHaveLength(0);
  });
  it.each(['manifest', 'inputCommit', 'allocation', 'contextRegistry'])('rejects a changed %s while resuming a partial pilot', async (field) => {
    const context = setup();
    const record = beginDay(context.state, brisbaneDay(NOW));
    record.purpose = 'unpublished-localsend-pilot';
    record.pilot = { manifestSha256: context.pkg.descriptor.manifestSha256, budgetSha256: context.pkg.descriptor.budgetSha256,
      inputCommit: context.config.inputCommit, registrySha256: context.pkg.contextReport.registrySha256,
      grantReview: context.config.sharedBudgetAllocation.reviewRef, validations: {} };
    if (field === 'manifest') context.pkg.descriptor.manifestSha256 = 'e'.repeat(64);
    if (field === 'inputCommit') context.config.inputCommit = 'e'.repeat(40);
    if (field === 'allocation') context.config.sharedBudgetAllocation.reviewRef = 'new-allocation';
    if (field === 'contextRegistry') context.pkg.contextReport.registrySha256 = 'e'.repeat(64);
    const { providers, dispatched } = mockProviders(context);
    await expect(run(context, providers)).rejects.toMatchObject({ code: 'PILOT_DAY_IN_USE' });
    expect(context.store.snapshots).toHaveLength(0); expect(dispatched).toEqual([]);
  });
  it('does not reset the same completed reviewed pilot allocation on a fresh Brisbane day', async () => {
    const context = setup(); const first = mockProviders(context);
    await run(context, first.providers);
    const before = clone(context.state);
    const next = { ...context, now: NEXT_DAY }; const second = mockProviders(next);
    await expect(run(next, second.providers)).rejects.toMatchObject({ code: 'PILOT_GRANT_ALREADY_USED' });
    expect(second.dispatched).toEqual([]); expect(context.state).toEqual(before);
  });
  it('requires a separately reviewed unique allocation for changed immutable inputs', async () => {
    const context = setup(); const first = mockProviders(context); await run(context, first.providers);
    const next = { ...context, now: NEXT_DAY, config: clone(context.config), pkg: clone(context.pkg) };
    next.config.inputCommit = 'e'.repeat(40); next.pkg.descriptor.manifestSha256 = 'e'.repeat(64);
    const blocked = mockProviders(next);
    await expect(run(next, blocked.providers)).rejects.toMatchObject({ code: 'PILOT_GRANT_ALREADY_USED' });
    expect(blocked.dispatched).toEqual([]);
    next.config.sharedBudgetAllocation.reviewRef = 'separately-reviewed-synthetic-allocation';
    const allowed = mockProviders(next);
    expect((await run(next, allowed.providers)).reason).toBe('PILOT_COMPLETE_UNPUBLISHED');
    expect(allowed.dispatched).toHaveLength(14);
  });
  it('cannot spend a new allocation reference on the same already reviewed bundle', async () => {
    const context = setup(); const first = mockProviders(context); await run(context, first.providers);
    const next = { ...context, now: NEXT_DAY, config: clone(context.config) };
    next.config.sharedBudgetAllocation.reviewRef = 'separately-reviewed-synthetic-allocation';
    const { providers, dispatched } = mockProviders(next);
    await expect(run(next, providers)).rejects.toMatchObject({ code: 'PILOT_GRANT_ALREADY_USED' });
    expect(dispatched).toEqual([]);
  });
  it('retains once-only grant protection after completed evidence is compacted and its day is pruned', async () => {
    const context = setup(); const initial = mockProviders(context); await run(context, initial.providers);
    const snapshot = clone(context.state);
    const compacted = compactState(context.state, brisbaneDay(NEXT_DAY), { commit: 'f'.repeat(40), snapshot });
    // Exercise actual archive behavior: full pilot payload and paid response
    // bodies are removed, so daily metadata cannot enforce the grant alone.
    expect(compacted.days[brisbaneDay(NOW)].pilot).toBeUndefined();
    expect(compacted.pilotGrants).toEqual(snapshot.pilotGrants);
    const next = { ...context, state: compacted, store: memoryStore(compacted), now: NEXT_DAY };
    const same = mockProviders(next);
    await expect(run(next, same.providers)).rejects.toMatchObject({ code: 'PILOT_GRANT_ALREADY_USED' });
    expect(same.dispatched).toEqual([]);

    // More than a year of terminal fixture days removes the original day;
    // the permanent grant ledger must still block a second allocation.
    for (let offset = 1; offset <= 366; offset++) {
      const date = new Date(NOW.getTime() + offset * 86400000);
      const day = brisbaneDay(date);
      beginDay(compacted, day); holdDay(compacted, day, 'SYNTHETIC_EMPTY_DAY');
    }
    const future = new Date(NOW.getTime() + 367 * 86400000);
    const pruned = compactState(compacted, brisbaneDay(future), { commit: 'e'.repeat(40), snapshot: clone(compacted) });
    expect(pruned.days[brisbaneDay(NOW)]).toBeUndefined();
    expect(pruned.pilotGrants).toEqual(snapshot.pilotGrants);
    const replay = { ...context, state: pruned, store: memoryStore(pruned), now: future };
    const final = mockProviders(replay);
    await expect(run(replay, final.providers)).rejects.toMatchObject({ code: 'PILOT_GRANT_ALREADY_USED' });
    expect(final.dispatched).toEqual([]);
  });
});

describe('safe pilot outcome projection', () => {
  it('never includes raw draft, provider review, private source text or private code paths', () => {
    const marker = 'SYNTHETIC_PRIVATE_CONTENT_NEVER_PUBLIC';
    const record = { status: 'published', reason: marker, published: true, writingProposalAdopted: true,
      draft: marker, source: { text: marker }, privatePath: `/private/${marker}.dart`,
      calls: { private: { receipt: { result: { data: { proposedMarkdown: marker, issues: [{ text: marker }] } } } } },
      pilot: { privateReview: marker, writingProposalAdopted: true },
      budget: { providers: { jina: { calls: 1, units: 5000, private: marker },
        ollama: { calls: 5, units: 530288 }, typesafe: { calls: 1, units: -1 }, unknownProvider: { calls: 1, units: 1 } } } };
    const outcome = pilotOutcome(record, marker);
    expect(outcome).toEqual({ schemaVersion: 1, status: 'held', reason: 'PILOT_HELD', published: false,
      writingProposalAdopted: false, providers: { jina: { attempts: 1, reservedUnits: 5000 } } });
    expect(JSON.stringify(outcome)).not.toContain(marker);
    record.pilot.result = 'reviewed-unpublished';
    expect(pilotOutcome(record)).toMatchObject({ status: 'reviewed-unpublished', reason: 'PILOT_COMPLETE_UNPUBLISHED', published: false, writingProposalAdopted: false });
  });
  it('projects only known safe reasons and integer reservations within the fixed grant', () => {
    expect(pilotOutcome(undefined, 'REQUEST_TIMEOUT')).toMatchObject({ status: 'held', reason: 'REQUEST_TIMEOUT', providers: {} });
    expect(pilotOutcome({ reason: 'raw arbitrary review detail', budget: { providers: {
      jina: { calls: 1.5, units: 5000 }, ollama: { calls: 1, units: Number.MAX_SAFE_INTEGER + 1 }, typesafe: { calls: 8, units: 524289 },
    } } })).toMatchObject({ reason: 'PILOT_HELD', providers: {} });
  });
});
