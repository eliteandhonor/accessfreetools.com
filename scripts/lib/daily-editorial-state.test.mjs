import { afterEach, describe, expect, it } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  MAX_STATE_BYTES, beginDay, brisbaneDay, compactState, completeCall, createGitStateStore,
  createLocalStateStore, holdDay, markPublished, newState, reserveCall, validateState,
} from './daily-editorial-state.mjs';

const run = promisify(execFile);
const temporaryDirectories = [];
const day = '2026-10-08';
const requestHash = 'a'.repeat(64);
const limit = { units: 100, calls: 3 };

afterEach(async () => {
  for (const directory of temporaryDirectories.splice(0)) await rm(directory, { recursive: true, force: true });
});

async function directory() {
  const path = await mkdtemp(join(tmpdir(), 'aft-editorial-state-'));
  temporaryDirectories.push(path);
  return path;
}

function reserve(state, values = {}) {
  return reserveCall(state, { day, id: 'research-1', provider: 'jina', requestHash, units: 40, limit, ...values });
}

async function gitFixture() {
  const path = await directory();
  const root = join(path, 'checkout');
  const remote = join(path, 'remote.git');
  await run('git', ['init', '--bare', remote]);
  await run('git', ['init', root]);
  await run('git', ['-C', root, 'remote', 'add', 'origin', remote]);
  return { root, remote, store: () => createGitStateStore({ root, fixtureRemote: remote }) };
}

describe('daily editorial state and conservative budgets', () => {
  it('uses the Brisbane local day at the UTC boundary, independently of daylight saving elsewhere', () => {
    expect(brisbaneDay('2026-10-08T13:59:59Z')).toBe('2026-10-08');
    expect(brisbaneDay('2026-10-08T14:00:00Z')).toBe('2026-10-09');
    expect(brisbaneDay('2026-01-01T13:59:59Z')).toBe('2026-01-01');
    expect(() => brisbaneDay('invalid')).toThrow('Invalid current time');
  });

  it('resumes cached work within one attempt and leaves terminal days terminal', () => {
    const state = newState();
    const started = beginDay(state, day);
    started.evidence = { repository: 'owner/project', sentences: ['A verified source sentence.'] };
    expect(beginDay(state, day)).toBe(started);
    expect(started.attempt).toBe(1);
    holdDay(state, day, 'Licence evidence is insufficient.');
    expect(beginDay(state, day).status).toBe('held');
    expect(() => reserve(state)).toThrow('terminal');
  });

  it('blocks same-day and later-day work when a request may have been charged', () => {
    const state = newState();
    beginDay(state, day);
    reserve(state);
    expect(() => beginDay(state, day)).toThrow('unresolved');
    expect(() => beginDay(state, '2026-10-09')).toThrow('unresolved');
    expect(() => reserve(state, { id: 'research-2' })).toThrow('unresolved');
    completeCall(state, { day, id: 'research-1', status: 'unknown', receipt: { reason: 'transport-timeout' } });
    expect(state.days[day].budget.providers.jina).toEqual({ units: 40, calls: 1 });
    expect(() => beginDay(state, '2026-10-09')).toThrow('unresolved');
  });

  it('never refunds failure or confirmed success and enforces both unit and call grants', () => {
    const state = newState();
    beginDay(state, day);
    reserve(state);
    completeCall(state, { day, id: 'research-1', status: 'failed', receipt: { httpStatus: 429 } });
    reserve(state, { id: 'research-2' });
    completeCall(state, { day, id: 'research-2', receipt: { result: 'Verified response', usage: { tokens: 5 } } });
    expect(() => reserve(state, { id: 'research-3' })).toThrow('exhausted');
    expect(() => reserve(state, { id: 'research-3', units: 1, limit: { units: 100, calls: 2 } })).toThrow('exhausted');
    expect(state.days[day].budget.providers.jina).toEqual({ units: 80, calls: 2 });
    expect(() => reserve(state, { id: 'research-2', requestHash: 'b'.repeat(64) })).toThrow('reserved twice');
  });

  it('keeps independent units for each provider rather than adding unrelated token measures', () => {
    const state = newState();
    beginDay(state, day);
    reserve(state);
    completeCall(state, { day, id: 'research-1', receipt: { result: 'source' } });
    reserve(state, { id: 'write-1', provider: 'ollama', units: 1000, limit: { units: 2000, calls: 2 } });
    expect(state.days[day].budget.providers).toEqual({ jina: { units: 40, calls: 1 }, ollama: { units: 1000, calls: 1 } });
  });

  it('requires explicit reconciliation to resolve unknown results, retaining worst-case usage', () => {
    const state = newState();
    beginDay(state, day);
    reserve(state);
    completeCall(state, { day, id: 'research-1', status: 'unknown' });
    completeCall(state, { day, id: 'research-1', receipt: { result: 'Recovered verified provider response' } });
    expect(beginDay(state, day).calls['research-1'].receipt.result).toBe('Recovered verified provider response');
    expect(state.days[day].budget.providers.jina.units).toBe(40);
    expect(() => completeCall(state, { day, id: 'research-1' })).toThrow('Only a pending');
  });

  it('rejects unsafe/oversized receipts and corruption without completing a reservation', () => {
    const state = newState();
    beginDay(state, day);
    reserve(state);
    expect(() => completeCall(state, { day, id: 'research-1', receipt: { authorization: 'private' } })).toThrow('Credentials');
    expect(() => completeCall(state, { day, id: 'research-1', receipt: { result: 'x'.repeat(256 * 1024) } })).toThrow('256 KiB');
    expect(state.days[day].calls['research-1'].status).toBe('pending');
    state.days[day].budget.providers.jina.units = 0;
    expect(() => validateState(state)).toThrow('Budget does not match');
    expect(() => reserveCall(newState(), { day, id: '__proto__' })).toThrow('Invalid call ID');
  });

  it('records only one immutable publication per day and holds project/slug duplicates', () => {
    const state = newState();
    beginDay(state, day);
    const proof = { day, repository: 'owner/project', slug: 'useful-project', commit: 'c'.repeat(40) };
    const published = markPublished(state, proof);
    expect(markPublished(state, proof)).toBe(published);
    expect(beginDay(state, day).status).toBe('published');
    expect(() => markPublished(state, { ...proof, slug: 'second-article' })).toThrow('already published');
    beginDay(state, '2026-10-09');
    expect(() => markPublished(state, { ...proof, day: '2026-10-09', repository: 'OWNER/PROJECT', slug: 'another-title' })).toThrow('already published');
    expect(() => markPublished(state, { ...proof, day: '2026-10-09', repository: 'owner/other' })).toThrow('already published');
  });

  it('preserves the staged publication timestamp and records ledger bookkeeping time separately', () => {
    const state = newState();
    beginDay(state, day);
    const publishedAt = '2026-10-08T09:12:34.567Z';
    const before = Date.now();
    const entry = markPublished(state, { day, repository: 'owner/project', slug: 'useful-project', commit: 'c'.repeat(40), publishedAt });
    expect(entry.publishedAt).toBe(publishedAt);
    expect(Date.parse(entry.recordedAt)).toBeGreaterThanOrEqual(before);
    expect(Date.parse(entry.recordedAt)).toBeLessThanOrEqual(Date.now());
    const fixture = newState();
    beginDay(fixture, day);
    const fallback = markPublished(fixture, { day, repository: 'owner/fixture', slug: 'fixture-project', commit: 'd'.repeat(40) });
    expect(fallback.publishedAt).toBe(fallback.recordedAt);
  });
});

describe('durable local fixture state', () => {
  it('persists the pre-call reservation through a new store instance and retains output on completed restart', async () => {
    const path = await directory();
    const file = join(path, 'state.json');
    const first = createLocalStateStore({ file });
    const state = await first.load();
    beginDay(state, day);
    reserve(state);
    expect(await first.checkpoint(state)).toEqual({ durable: true });
    const second = createLocalStateStore({ file });
    const restarted = await second.load();
    expect(() => beginDay(restarted, day)).toThrow('unresolved');
    expect(restarted.days[day].budget.providers.jina.units).toBe(40);
    completeCall(restarted, { day, id: 'research-1', receipt: { result: { evidence: ['A complete source sentence.'] } } });
    await second.checkpoint(restarted);
    expect(beginDay(await first.load(), day).calls['research-1'].receipt.result.evidence).toEqual(['A complete source sentence.']);
    expect(await readdir(path)).toEqual(['state.json']);
  });

  it('fails closed on truncated or over-bound state without replacing the last valid checkpoint', async () => {
    const path = await directory();
    const file = join(path, 'state.json');
    const store = createLocalStateStore({ file });
    const state = newState();
    await store.checkpoint(state);
    const previous = await readFile(file, 'utf8');
    state.unbounded = 'x'.repeat(MAX_STATE_BYTES);
    await expect(store.checkpoint(state)).rejects.toThrow('1 MiB');
    expect(await readFile(file, 'utf8')).toBe(previous);
    await writeFile(file, '{');
    await expect(store.load()).rejects.toThrow('invalid JSON');
  });

  it('archives a proven previous snapshot before trimming historical response/source payloads', async () => {
    const path = await directory();
    const file = join(path, 'state.json');
    let now = '2026-10-08T00:00:00Z';
    const store = createLocalStateStore({ file, now: () => now });
    const state = await store.load();
    const record = beginDay(state, day);
    record.evidence = { original: 'Complete relevant source sentence.' };
    reserve(state);
    completeCall(state, { day, id: 'research-1', receipt: { result: 'Full response body', usage: { tokens: 20 } } });
    holdDay(state, day, 'Hold fixture.');
    await store.checkpoint(state);
    now = '2026-10-09T00:00:00Z';
    const active = beginDay(state, '2026-10-09');
    await store.checkpoint(state);
    expect(state.days['2026-10-09']).toBe(active);
    expect(state.days[day].evidence).toBeUndefined();
    expect(state.days[day].calls['research-1'].receipt.result).toBeUndefined();
    expect(state.days[day].calls['research-1'].receipt.usage.tokens).toBe(20);
    expect(state.days[day].budget.providers.jina.units).toBe(40);
    const archive = JSON.parse(await readFile(`${file}.archive/${state.days[day].archive.stateCommit}.json`, 'utf8'));
    expect(archive.days[day].evidence.original).toBe('Complete relevant source sentence.');
    expect(archive.days[day].calls['research-1'].receipt.result).toBe('Full response body');
  });
});

describe('automatic historical payload compaction', () => {
  it('runs for 370 days within its bound, keeps 365 day records, and never loses permanent publication deduplication', () => {
    let state = newState();
    for (let index = 0; index < 370; index += 1) {
      const date = new Date(Date.UTC(2025, 0, 1 + index)).toISOString().slice(0, 10);
      const snapshot = structuredClone(state);
      const record = beginDay(state, date);
      record.evidence = { text: 'x'.repeat(4000) };
      reserve(state, { day: date });
      completeCall(state, { day: date, id: 'research-1', receipt: { result: 'x'.repeat(4000) } });
      markPublished(state, { day: date, repository: `owner/project-${index}`, slug: `project-${index}`, commit: 'b'.repeat(40) });
      state = compactState(state, date, { commit: index.toString(16).padStart(40, '0'), snapshot });
      expect(Buffer.byteLength(JSON.stringify(state))).toBeLessThan(MAX_STATE_BYTES);
    }
    expect(Object.keys(state.days)).toHaveLength(365);
    expect(state.published).toHaveLength(370);
    expect(state.published[0].stateCommit).toMatch(/^[a-f0-9]{40}$/);
    const latest = Object.keys(state.days).sort().at(-1);
    expect(state.days[latest].budget.providers.jina.units).toBe(40);
    const next = '2026-01-06';
    beginDay(state, next);
    expect(() => markPublished(state, { day: next, repository: 'owner/project-0', slug: 'brand-new-title', commit: 'd'.repeat(40) })).toThrow('already published');
    expect(() => beginDay(state, '2025-01-01')).toThrow('second attempt');
  }, 20_000);

  it('does not trim pending/unknown work or uncommitted changes whose prior snapshot does not match', () => {
    const state = newState();
    const record = beginDay(state, day);
    record.evidence = { text: 'Full original evidence.' };
    const snapshot = structuredClone(state);
    reserve(state);
    completeCall(state, { day, id: 'research-1', status: 'unknown', receipt: { result: 'uncertain response' } });
    holdDay(state, day, 'Unknown request.');
    let compacted = compactState(state, '2026-10-09', { commit: 'a'.repeat(40), snapshot });
    expect(compacted.days[day].evidence.text).toBe('Full original evidence.');
    expect(compacted.days[day].calls['research-1'].receipt.result).toBe('uncertain response');
    completeCall(state, { day, id: 'research-1', receipt: { result: 'Confirmed response' } });
    compacted = compactState(state, '2026-10-09', { commit: 'a'.repeat(40), snapshot });
    expect(compacted.days[day].archive).toBeUndefined();
    expect(compacted.days[day].evidence.text).toBe('Full original evidence.');
  });

  it('preserves unresolved publication recovery data and blocks new work until authoritative reconciliation', () => {
    const state = newState();
    const record = beginDay(state, day);
    beginDay(state, '2026-10-09');
    record.article = { title: 'Original recovery article', body: 'Complete original article body.' };
    record.publicationIntent = { slug: 'recover-this-article', articleHash: requestHash };
    holdDay(state, day, 'Publication push outcome unknown.');
    const snapshot = structuredClone(state);
    const compacted = compactState(state, '2026-10-10', { commit: 'a'.repeat(40), snapshot });
    expect(compacted.days[day].article.body).toBe('Complete original article body.');
    expect(compacted.days[day].publicationIntent.slug).toBe('recover-this-article');
    expect(compacted.days[day].archive).toBeUndefined();
    expect(() => beginDay(state, '2026-10-10')).toThrow('publication has an unresolved');
    expect(() => reserve(state, { day: '2026-10-09' })).toThrow('unresolved publication');
    // The runner performs the authoritative read before attaching its proven publication.
    record.publication = { commit: 'c'.repeat(40) };
    record.status = 'started';
    markPublished(state, { day, repository: 'owner/recovered', slug: 'recover-this-article', commit: 'c'.repeat(40) });
    expect(beginDay(state, '2026-10-10').status).toBe('started');
  });

  it('retains next-day publication payloads until both recorded receipts prove live verification', () => {
    const state = newState();
    const record = beginDay(state, day);
    record.article = { title: 'Publication awaiting deployment', body: 'Complete verification payload.' };
    record.publication = { commit: 'c'.repeat(40), liveVerified: false };
    const publication = markPublished(state, { day, repository: 'owner/project', slug: 'useful-project', commit: 'c'.repeat(40), liveVerified: false });
    let compacted = compactState(state, '2026-10-09', { commit: 'a'.repeat(40), snapshot: structuredClone(state) });
    expect(compacted.days[day].article.body).toBe('Complete verification payload.');
    expect(compacted.days[day].publication.liveVerified).toBe(false);
    expect(compacted.days[day].archive).toBeUndefined();
    publication.liveVerified = true;
    compacted = compactState(state, '2026-10-09', { commit: 'a'.repeat(40), snapshot: structuredClone(state) });
    expect(compacted.days[day].article.body).toBe('Complete verification payload.');
    record.publication.liveVerified = true;
    compacted = compactState(state, '2026-10-09', { commit: 'a'.repeat(40), snapshot: structuredClone(state) });
    expect(compacted.days[day].article).toBeUndefined();
    expect(compacted.days[day].archive.stateCommit).toBe('a'.repeat(40));
  });

  it('never prunes an old explicitly unverified publication beyond the 365-day retention boundary', () => {
    const state = newState();
    const firstDay = '2025-01-01';
    const record = beginDay(state, firstDay);
    record.article = { body: 'Original live-verification payload retained beyond the retention window.' };
    record.publication = { commit: 'c'.repeat(40), liveVerified: false };
    markPublished(state, { day: firstDay, repository: 'owner/project', slug: 'useful-project', commit: 'c'.repeat(40), liveVerified: false });
    for (let index = 1; index < 367; index += 1) {
      const date = new Date(Date.UTC(2025, 0, 1 + index)).toISOString().slice(0, 10);
      state.days[date] = { attempt: 1, status: 'held', startedAt: `${date}T00:00:00Z`, calls: {}, budget: { providers: {} }, reason: 'Fixture held day.' };
    }
    const compacted = compactState(state, '2026-01-03', { commit: 'a'.repeat(40), snapshot: structuredClone(state) });
    expect(compacted.days[firstDay].article.body).toBe(record.article.body);
    expect(compacted.days[firstDay].archive).toBeUndefined();
    expect(Object.keys(compacted.days)).toHaveLength(366);
  });
});

describe('Git checkpoint compare-and-swap with local bare fixtures only', () => {
  it('creates an orphan branch, appends checkpoints, and reloads conservative budgets', async () => {
    const fixture = await gitFixture();
    const store = await fixture.store();
    const state = await store.load();
    beginDay(state, day);
    reserve(state);
    const first = await store.checkpoint(state);
    expect(first.durable).toBe(true);
    const restart = await fixture.store();
    const recovered = await restart.load();
    expect(() => beginDay(recovered, day)).toThrow('unresolved');
    completeCall(recovered, { day, id: 'research-1', receipt: { result: 'Recovered output' } });
    const second = await restart.checkpoint(recovered);
    expect(second.commit).not.toBe(first.commit);
    const { stdout } = await run('git', ['--git-dir', fixture.remote, 'rev-list', '--count', 'automation/aft-editorial-state']);
    expect(stdout.trim()).toBe('2');
    expect((await store.load()).days[day].budget.providers.jina.units).toBe(40);
    const { stdout: files } = await run('git', ['--git-dir', fixture.remote, 'ls-tree', '--name-only', 'automation/aft-editorial-state']);
    expect(files.trim()).toBe('state.json');
  });

  it('links trimmed historical evidence to the exact immutable prior commit', async () => {
    const fixture = await gitFixture();
    let now = '2026-10-08T00:00:00Z';
    const store = await createGitStateStore({ root: fixture.root, fixtureRemote: fixture.remote, now: () => now });
    const state = await store.load();
    beginDay(state, day).evidence = { text: 'Full verified historic source.' };
    reserve(state);
    completeCall(state, { day, id: 'research-1', receipt: { result: 'Full historic provider output' } });
    holdDay(state, day, 'Historic fixture.');
    const first = await store.checkpoint(state);
    now = '2026-10-09T00:00:00Z';
    beginDay(state, '2026-10-09');
    await store.checkpoint(state);
    expect(state.days[day].archive.stateCommit).toBe(first.commit);
    const { stdout } = await run('git', ['--git-dir', fixture.remote, 'show', `${first.commit}:state.json`]);
    const archived = JSON.parse(stdout);
    expect(archived.days[day].evidence.text).toBe('Full verified historic source.');
    expect(archived.days[day].calls['research-1'].receipt.result).toBe('Full historic provider output');
    expect(state.days[day].budget.providers.jina).toEqual({ units: 40, calls: 1 });
  });

  it('rejects a concurrent first-creation loser before it can authorize paid calls', async () => {
    const fixture = await gitFixture();
    const first = await fixture.store();
    const second = await fixture.store();
    const firstState = await first.load();
    const secondState = await second.load();
    beginDay(firstState, day);
    beginDay(secondState, day);
    reserve(firstState);
    reserve(secondState, { id: 'other-request' });
    await first.checkpoint(firstState);
    await expect(second.checkpoint(secondState)).rejects.toMatchObject({ code: 'STATE_CONFLICT_OR_UNKNOWN' });
    await expect(second.checkpoint(secondState)).rejects.toMatchObject({ code: 'STATE_NOT_LOADED' });
    const recovered = await second.load();
    expect(recovered.days[day].calls['research-1'].status).toBe('pending');
    expect(recovered.days[day].calls['other-request']).toBeUndefined();
  });

  it('rejects a stale update rather than overwriting a newer checkpoint', async () => {
    const fixture = await gitFixture();
    const initial = await fixture.store();
    const seed = await initial.load();
    beginDay(seed, day);
    await initial.checkpoint(seed);
    const first = await fixture.store();
    const second = await fixture.store();
    const firstState = await first.load();
    const secondState = await second.load();
    firstState.days[day].selected = 'owner/first';
    secondState.days[day].selected = 'owner/second';
    const winner = await first.checkpoint(firstState);
    await expect(second.checkpoint(secondState)).rejects.toMatchObject({ code: 'STATE_CONFLICT_OR_UNKNOWN' });
    expect((await second.load()).days[day].selected).toBe('owner/first');
    const { stdout } = await run('git', ['--git-dir', fixture.remote, 'rev-parse', 'automation/aft-editorial-state']);
    expect(stdout.trim()).toBe(winner.commit);
  });

  it('rejects unrelated/credential-bearing repositories and mismatched fixture bypasses without network calls', async () => {
    const fixture = await gitFixture();
    await expect(createGitStateStore({ root: fixture.root })).rejects.toMatchObject({ code: 'INVALID_REMOTE' });
    await expect(createGitStateStore({ root: fixture.root, fixtureRemote: fixture.root })).rejects.toMatchObject({ code: 'INVALID_REMOTE' });
    await run('git', ['-C', fixture.root, 'remote', 'set-url', 'origin', 'https://github.com/eliteandhonor/access-free-tools.git']);
    await expect(createGitStateStore({ root: fixture.root })).rejects.toMatchObject({ code: 'INVALID_REMOTE' });
    await run('git', ['-C', fixture.root, 'remote', 'set-url', 'origin', 'https://fake-credential@github.com/eliteandhonor/accessfreetools.com.git']);
    await expect(createGitStateStore({ root: fixture.root })).rejects.toMatchObject({ code: 'INVALID_REMOTE' });
  });

  it('requires explicit production activation before any state push', async () => {
    const fixture = await gitFixture();
    await run('git', ['-C', fixture.root, 'remote', 'set-url', 'origin', 'https://github.com/eliteandhonor/accessfreetools.com.git']);
    const store = await createGitStateStore({ root: fixture.root });
    await expect(store.checkpoint(newState())).rejects.toMatchObject({ code: 'NOT_ACTIVATED' });
  });
});
