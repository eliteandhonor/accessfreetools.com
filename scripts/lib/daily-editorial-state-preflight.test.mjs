import { afterEach, describe, expect, it } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { stateRoundTripPreflight } from './daily-editorial-state-preflight.mjs';
import { beginDay, completeCall, createGitStateStore, holdDay, markPublished, newState, reserveCall } from './daily-editorial-state.mjs';
import { privateStateGitEnvironment } from './private-state-git-environment.mjs';

const run = promisify(execFile);
const directories = [];
const held = { passed: false, code: 'STATE_PREFLIGHT_HELD', stateSha256: null, stateCommit: null, providerCalls: 0, published: false };
afterEach(async () => { for (const path of directories.splice(0)) await rm(path, { recursive: true, force: true }); });

function fixture({ fault, readback, initial: provided, emptyBaseline = false } = {}) {
  const initial = provided ? structuredClone(provided) : newState();
  if (!provided) {
    beginDay(initial, '2026-10-08').evidence = { text: 'Synthetic private state sentinel, never returned publicly.' };
    holdDay(initial, '2026-10-08', 'Offline fixture.');
  }
  const calls = [];
  let creations = 0;
  let saved;
  const fail = (step) => { if (fault === step) throw new Error('PRIVATE_FAILURE_SENTINEL must never enter public proof.'); };
  return { initial, calls, async createStore() {
    creations += 1;
    const index = creations;
    calls.push(`create-${index}`); fail(`create-${index}`);
    return {
      async load() { calls.push(`load-${index}`); fail(`load-${index}`); return structuredClone(index === 1 ? initial : readback ?? saved); },
      currentCommit() { calls.push(`currentCommit-${index}`); return index === 1 ? emptyBaseline ? '' : 'a'.repeat(40) : fault === 'stale-head' ? 'a'.repeat(40) : 'c'.repeat(40); },
      async checkpoint(state, options) {
        calls.push(`checkpoint-${index}`); fail('checkpoint');
        expect(options).toEqual({ compact: false });
        saved = structuredClone(state);
        if (fault === 'mutation') state.days['2026-10-08'].reason = 'Unexpected storage mutation.';
        if (fault === 'unknown') return { durable: false, commit: 'c'.repeat(40) };
        if (fault === 'invalid-commit') return { durable: true, commit: 'c'.repeat(64) };
        if (fault === 'no-append') return { durable: true, commit: 'a'.repeat(40) };
        return { durable: true, commit: 'c'.repeat(40) };
      },
      async dispose() { calls.push(`dispose-${index}`); fail(`dispose-${index}`); },
    };
  } };
}

describe('dormant private state round-trip proof with fixtures only', () => {
  it('checkpoints once unchanged, disposes, then validates one fresh readback and returns only safe proof', async () => {
    const test = fixture();
    const before = structuredClone(test.initial);
    const result = await stateRoundTripPreflight({ createStore: test.createStore });
    expect(result).toEqual({ passed: true, code: 'STATE_PREFLIGHT_PASSED', stateSha256: expect.stringMatching(/^[a-f0-9]{64}$/),
      stateCommit: 'c'.repeat(40), providerCalls: 0, published: false });
    expect(test.calls).toEqual(['create-1', 'load-1', 'currentCommit-1', 'checkpoint-1', 'dispose-1', 'create-2', 'load-2', 'currentCommit-2', 'dispose-2']);
    expect(test.initial).toEqual(before);
    expect(JSON.stringify(result)).not.toContain('Synthetic private');
  });

  it('canonicalizes JSON object ordering for equivalent readback without weakening array/order identity', async () => {
    const test = fixture();
    test.initial.days['2026-10-08'].evidence.sentences = ['First immutable fixture sentence.', 'Second immutable fixture sentence.'];
    const readback = { published: [], days: test.initial.days, schemaVersion: 1 };
    const equivalent = fixture({ readback, initial: test.initial });
    expect((await stateRoundTripPreflight({ createStore: equivalent.createStore })).passed).toBe(true);
    const changed = structuredClone(test.initial); changed.days['2026-10-08'].evidence.sentences.reverse();
    const different = fixture({ readback: changed, initial: test.initial });
    expect(await stateRoundTripPreflight({ createStore: different.createStore })).toEqual(held);
  });

  it.each(['create-1', 'load-1', 'checkpoint', 'unknown', 'invalid-commit', 'no-append', 'mutation', 'dispose-1', 'create-2', 'load-2', 'dispose-2', 'stale-head'])('holds %s without retries or private error output', async (fault) => {
    const test = fixture({ fault });
    expect(await stateRoundTripPreflight({ createStore: test.createStore })).toEqual(held);
    expect(test.calls.filter((value) => value.startsWith('checkpoint'))).toHaveLength(['create-1', 'load-1'].includes(fault) ? 0 : 1);
    expect(new Set(test.calls).size).toBe(test.calls.length);
    expect(test.calls.filter((value) => value.startsWith('create'))).toHaveLength(['create-2', 'load-2', 'dispose-2', 'stale-head'].includes(fault) ? 2 : 1);
  });

  it('requires explicit empty-baseline approval and rejects nonboolean approval before opening storage', async () => {
    const denied = fixture({ emptyBaseline: true });
    expect(await stateRoundTripPreflight({ createStore: denied.createStore })).toEqual({ ...held, code: 'STATE_PREFLIGHT_BASELINE_APPROVAL_REQUIRED' });
    expect(denied.calls).toEqual(['create-1', 'load-1', 'currentCommit-1', 'dispose-1']);
    const approved = fixture({ emptyBaseline: true });
    expect((await stateRoundTripPreflight({ createStore: approved.createStore, allowEmptyBaseline: true })).passed).toBe(true);
    const malformed = fixture({ emptyBaseline: true });
    expect(await stateRoundTripPreflight({ createStore: malformed.createStore, allowEmptyBaseline: 'true' })).toEqual(held);
    expect(malformed.calls).toEqual([]);
  });

  it.each(['pending', 'unknown', 'publication-intent', 'publication-unverified', 'publication-legacy-unassessed'])('holds %s before any checkpoint', async (kind) => {
    const initial = newState(); const day = '2026-10-08';
    const record = beginDay(initial, day);
    if (['pending', 'unknown'].includes(kind)) {
      reserveCall(initial, { day, id: 'offline-reservation', provider: 'jina', requestHash: 'a'.repeat(64), units: 5, limit: { calls: 1, units: 5 } });
      if (kind === 'unknown') completeCall(initial, { day, id: 'offline-reservation', status: 'unknown' });
    } else if (kind === 'publication-intent') record.publicationIntent = { commit: 'd'.repeat(40) };
    else markPublished(initial, { day, repository: 'owner/synthetic-project', slug: 'synthetic-project', commit: 'd'.repeat(40),
      ...(kind === 'publication-unverified' ? { liveVerified: false } : {}) });
    const test = fixture({ initial });
    expect(await stateRoundTripPreflight({ createStore: test.createStore })).toEqual(held);
    expect(test.calls).toEqual(['create-1', 'load-1', 'dispose-1']);
  });

  it('rejects invalid state, absent interfaces and a reused store as fresh readback', async () => {
    expect(await stateRoundTripPreflight()).toEqual(held);
    expect(await stateRoundTripPreflight({ createStore: async () => ({}) })).toEqual(held);
    const test = fixture();
    const singleton = await test.createStore();
    expect(await stateRoundTripPreflight({ createStore: async () => singleton })).toEqual(held);
    expect(test.calls.filter((value) => value.startsWith('load'))).toHaveLength(1);
    const corrupt = fixture({ readback: { schemaVersion: 1, days: {}, published: [], password: 'SYNTHETIC_ONLY' } });
    expect(await stateRoundTripPreflight({ createStore: corrupt.createStore })).toEqual(held);
  });

  it('proves actual Git CAS append and fresh remote readback in an explicit local bare fixture', async () => {
    const path = await mkdtemp(join(tmpdir(), 'aft-state-preflight-'));
    directories.push(path);
    const root = join(path, 'checkout'); const remote = join(path, 'private-fixture.git');
    const env = privateStateGitEnvironment({ source: { PATH: '/usr/bin:/bin' }, localFixture: true });
    await run('/usr/bin/git', ['init', '--bare', '--template=', remote], { env });
    await run('/usr/bin/git', ['init', '--template=', root], { env });
    await run('/usr/bin/git', ['-C', root, 'remote', 'add', 'origin', remote], { env });
    const createStore = () => createGitStateStore({ root, fixtureRemote: remote, now: () => '2026-10-09T00:00:00Z' });
    const seed = await createStore(); const state = await seed.load();
    beginDay(state, '2026-10-08').article = { body: 'Historic private fixture evidence remains unchanged.' };
    holdDay(state, '2026-10-08', 'Offline held fixture.');
    await seed.checkpoint(state, { compact: false }); await seed.dispose();
    const result = await stateRoundTripPreflight({ createStore });
    expect(result.passed).toBe(true);
    const readback = await createStore();
    expect(await readback.load()).toEqual(state); await readback.dispose();
    const { stdout } = await run('/usr/bin/git', ['--git-dir', remote, 'rev-list', '--count', 'automation/aft-editorial-state'], { env });
    expect(stdout.trim()).toBe('2');
    expect(JSON.stringify(result)).not.toContain('Historic private');
  });
});
