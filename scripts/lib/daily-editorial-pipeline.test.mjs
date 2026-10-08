import { describe, it, expect } from 'vitest';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { newState, createLocalStateStore, beginDay } from './daily-editorial-state.mjs';
import { paidCall, runDailyEditorial } from './daily-editorial-pipeline.mjs';
import { fixtureNow, fixtureArticle, fixtureProviders } from './daily-editorial-fixtures.mjs';

const config = { maxCandidates: 5, model: 'gpt-oss:120b', typesafeModel: 'jev-1.13.0', problems: [{ query: 'offline fixture', problem: 'Keep task notes in local files' }], limits: { jina: { units: 100000, calls: 10 }, ollama: { units: 70000, calls: 4 }, typesafe: { units: 100000, calls: 8 } } };
const memory = () => ({ snapshots: [], async checkpoint(state) { this.snapshots.push(structuredClone(state)); return { durable: true }; } });

describe('offline daily editorial flow', () => {
  it('checks one original fixture and atomically publishes exactly once', async () => {
    const state = newState(), store = memory(), providers = fixtureProviders();
    let publishes = 0;
    const publish = async ({ article }) => { publishes++; return { slug: article.slug, commit: 'b'.repeat(40), liveVerified: false }; };
    const result = await runDailyEditorial({ state, store, config, providers, now: fixtureNow, publish });
    expect(result.reason).toBeUndefined(); expect(result.deterministic.issues).toEqual([]);
    expect(result.status).toBe('published'); expect(publishes).toBe(1);
    expect(providers.calls).toMatchObject({ jina: 1, ollama: 2 });
    expect(result.semanticReview.claims.length).toBe(13);
    await runDailyEditorial({ state, store, config, providers, now: fixtureNow, publish });
    expect(publishes).toBe(1); expect(providers.calls.ollama).toBe(2);
    expect(store.snapshots.some((s) => s.days['2026-10-08'].calls['jina-docs']?.status === 'pending')).toBe(true);
  });
  it('holds a contradiction and creates no empty or replacement filler', async () => {
    const state = newState(); let published = false;
    const result = await runDailyEditorial({ state, store: memory(), config, providers: fixtureProviders({ contradict: true }), now: fixtureNow, publish: async () => { published = true; } });
    expect(result.status).toBe('held'); expect(result.reason).toBe('TYPESAFE_REVIEW_HELD'); expect(published).toBe(false);
  });
  it('retains unknown paid outcomes across durable restart and blocks future days', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'aft-flow-'));
    try {
      const store = createLocalStateStore({ file: join(dir, 'state.json') }), state = await store.load(), providers = fixtureProviders({ timeout: true });
      const result = await runDailyEditorial({ state, store, config, providers, now: fixtureNow });
      expect(result.status).toBe('held'); expect(result.calls['jina-docs'].status).toBe('unknown');
      const restarted = await store.load();
      await expect(runDailyEditorial({ state: restarted, store, config, providers, now: new Date('2026-10-09T09:00:00Z') })).rejects.toMatchObject({ code: 'OUTCOME_UNKNOWN' });
      expect(providers.calls.jina).toBe(1); expect(restarted.days['2026-10-08'].budget.providers.jina.units).toBe(10000);
    } finally { await rm(dir, { recursive: true, force: true }); }
  });
  it('does not dispatch when durable reservation checkpoint fails', async () => {
    const state = newState(); beginDay(state, '2026-10-08'); let called = false;
    await expect(paidCall({ state, day: '2026-10-08', store: { async checkpoint() { throw new Error('fixture save failure'); } }, config, id: 'reader', provider: 'jina', units: 10000, request: {}, invoke: async () => { called = true; } })).rejects.toThrow();
    expect(called).toBe(false); expect(state.days['2026-10-08'].calls.reader.status).toBe('pending');
  });
  it('holds a duplicate before spending on research or writing', async () => {
    const providers = fixtureProviders();
    const result = await runDailyEditorial({ state: newState(), store: memory(), config, providers, now: fixtureNow, catalog: [fixtureArticle()] });
    expect(result.reason).toBe('NO_VERIFIED_CANDIDATE'); expect(providers.calls.jina).toBe(0); expect(providers.calls.ollama).toBe(0);
  });
  it('reuses a completed matching paid receipt rather than charging again', async () => {
    const state = newState(), store = memory(); beginDay(state, '2026-10-08'); let calls = 0;
    const params = { state, store, config, day: '2026-10-08', id: 'reader', provider: 'jina', request: {}, units: 10000, invoke: async () => { calls++; return { data: { text: 'Fixture' }, usage: { tokens: 1 } }; } };
    await paidCall(params); await paidCall(params); expect(calls).toBe(1);
  });
  it('reconciles a lost publication acknowledgement before new work and never rewrites it', async () => {
    const state = newState(), store = memory(), providers = fixtureProviders();
    let publications = 0;
    const publish = async ({ record }) => {
      publications++;
      if (publications === 1) { record.publicationIntent = { commit: 'b'.repeat(40), base: 'a'.repeat(40) }; throw new Error('Fixture lost acknowledgement'); }
      return { commit: 'b'.repeat(40), liveVerified: false };
    };
    expect((await runDailyEditorial({ state, store, config, providers, now: fixtureNow, publish })).status).toBe('held');
    const paidCounts = { ...providers.calls };
    expect((await runDailyEditorial({ state, store, config, providers, now: fixtureNow, publish })).status).toBe('published');
    expect(providers.calls).toEqual(paidCounts); expect(state.published).toHaveLength(1);
    await runDailyEditorial({ state, store, config, providers, now: fixtureNow, publish });
    expect(publications).toBe(2); expect(state.published).toHaveLength(1);
  });
});
