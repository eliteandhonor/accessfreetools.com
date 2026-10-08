/** Durable editorial state. Callers must checkpoint reservations BEFORE sending a paid request. */
import { spawn } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { open, readFile, realpath, rename, mkdir, unlink } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

export const MAX_STATE_BYTES = 1024 * 1024;
const MAX_RECEIPT_BYTES = 256 * 1024;
const TARGET_REPOSITORY = 'eliteandhonor/accessfreetools.com';
const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const COMMIT_PATTERN = /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/;
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const CREDENTIAL_KEY = /^(?:authorization|proxy-authorization|cookie|set-cookie|headers|api[_-]?key|access[_-]?token|refresh[_-]?token|password|secret|credentials)$/i;

function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  throw error;
}

function object(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validDay(day) {
  const date = new Date(`${day}T00:00:00Z`);
  if (typeof day !== 'string' || !DAY_PATTERN.test(day) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== day) {
    fail('INVALID_DAY', 'Expected a valid YYYY-MM-DD day.');
  }
}

function identifier(value, label) {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9_.:-]{1,160}$/.test(value) || UNSAFE_KEYS.has(value)) {
    fail('INVALID_ID', `Invalid ${label}.`);
  }
}

function safeJson(value, depth = 0) {
  if (depth > 24) fail('INVALID_STATE', 'State exceeds the JSON nesting limit.');
  if (value === null || typeof value === 'boolean' || typeof value === 'string') return;
  if (typeof value === 'number' && Number.isFinite(value)) return;
  if (Array.isArray(value)) {
    for (const item of value) safeJson(item, depth + 1);
    return;
  }
  if (!object(value) || Object.getPrototypeOf(value) !== Object.prototype) fail('INVALID_STATE', 'State must contain plain JSON values.');
  for (const [key, item] of Object.entries(value)) {
    if (UNSAFE_KEYS.has(key) || CREDENTIAL_KEY.test(key)) fail('UNSAFE_STATE', 'Credentials and raw headers cannot be stored in editorial state.');
    safeJson(item, depth + 1);
  }
}

/** Validate persisted state before trusting its budget, receipt, or publication ledger. */
export function validateState(state, { checkSize = true } = {}) {
  safeJson(state);
  if (!object(state) || state.schemaVersion !== 1 || !object(state.days) || !Array.isArray(state.published)) {
    fail('INVALID_STATE', 'Unsupported editorial state schema.');
  }
  const publishedDays = new Set();
  const publishedRepositories = new Set();
  const publishedSlugs = new Set();
  for (const record of state.published) {
    if (!object(record)) fail('INVALID_STATE', 'Invalid publication record.');
    validDay(record.day);
    if (typeof record.slug !== 'string' || typeof record.repository !== 'string') fail('INVALID_STATE', 'Publication records require a slug and repository.');
    if (publishedDays.has(record.day) || publishedRepositories.has(record.repository.toLowerCase()) || publishedSlugs.has(record.slug)) {
      fail('INVALID_STATE', 'The publication ledger contains a duplicate.');
    }
    publishedDays.add(record.day);
    publishedRepositories.add(record.repository.toLowerCase());
    publishedSlugs.add(record.slug);
  }
  for (const [day, record] of Object.entries(state.days)) {
    validDay(day);
    if (!object(record) || record.attempt !== 1 || typeof record.status !== 'string' || !object(record.calls) || !object(record.budget) || !object(record.budget.providers)) {
      fail('INVALID_STATE', 'Invalid day record.');
    }
    if (record.archive && (!COMMIT_PATTERN.test(record.archive.stateCommit) || !/^[a-f0-9]{64}$/.test(record.archive.recordHash))) {
      fail('INVALID_ARCHIVE', 'Historical day requires an immutable archive proof.');
    }
    const totals = {};
    for (const [id, call] of Object.entries(record.calls)) {
      identifier(id, 'call ID');
      if (!object(call) || !['pending', 'completed', 'failed', 'unknown'].includes(call.status)) fail('INVALID_STATE', 'Invalid call status.');
      identifier(call.provider, 'provider');
      if (!/^[a-f0-9]{64}$/.test(call.requestHash) || !Number.isFinite(call.units) || call.units < 0) fail('INVALID_STATE', 'Invalid call reservation.');
      totals[call.provider] ??= { units: 0, calls: 0 };
      totals[call.provider].units += call.units;
      totals[call.provider].calls += 1;
      if (call.status === 'completed' && !object(call.receipt)) fail('INVALID_STATE', 'Completed calls require a safe receipt.');
    }
    for (const [provider, budget] of Object.entries(record.budget.providers)) {
      identifier(provider, 'provider');
      const expected = totals[provider] ?? { units: 0, calls: 0 };
      if (!object(budget) || budget.calls !== expected.calls || budget.units !== expected.units) fail('INVALID_STATE', 'Budget does not match its retained reservations.');
      delete totals[provider];
    }
    if (Object.keys(totals).length) fail('INVALID_STATE', 'Missing provider budget.');
    if ((record.status === 'published') !== publishedDays.has(day)) fail('INVALID_STATE', 'Publication ledger and day status disagree.');
  }
  if (state.published.some((entry) => !state.days[entry.day] && (!COMMIT_PATTERN.test(entry.stateCommit) || !/^[a-f0-9]{64}$/.test(entry.recordHash)))) {
    fail('INVALID_STATE', 'Publication ledger has no corresponding day or immutable archived record.');
  }
  if (state.archiveHistory) {
    validDay(state.archiveHistory.throughDay);
    if (!COMMIT_PATTERN.test(state.archiveHistory.stateCommit)) fail('INVALID_ARCHIVE', 'Historical ledger requires an immutable archive proof.');
  }
  const serialized = JSON.stringify(state);
  if (checkSize && Buffer.byteLength(serialized) + 1 > MAX_STATE_BYTES) fail('STATE_LIMIT', 'Editorial state reached its 1 MiB bound; automatic archive could not safely reduce it.');
  return state;
}

/** Calendar day in Australia/Brisbane, including UTC date-boundary handling. */
export function brisbaneDay(now = new Date()) {
  const date = now instanceof Date ? now : new Date(now);
  if (!Number.isFinite(date.getTime())) fail('INVALID_DATE', 'Invalid current time.');
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Brisbane', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function newState() {
  return { schemaVersion: 1, days: {}, published: [] };
}

function hash(value) {
  return createHash('sha256').update(value).digest('hex');
}

/**
 * Remove completed historical payloads only with proof of an immutable full prior
 * snapshot. Git commit ancestry (or local content-addressed fixtures) retains the
 * original evidence and every provider budget. Recent 365 day records retain call
 * metadata; the permanent publication ledger retains project/slug duplicate checks.
 */
export function compactState(state, currentDay, { commit, snapshot } = {}) {
  validateState(state, { checkSize: false });
  validDay(currentDay);
  const compacted = structuredClone(state);
  if (!commit || !snapshot) return validateState(compacted);
  if (!COMMIT_PATTERN.test(commit)) fail('INVALID_ARCHIVE', 'Archive proof requires an immutable commit or content hash.');
  validateState(snapshot);
  const safeDays = new Set();
  for (const [day, record] of Object.entries(compacted.days)) {
    const publication = compacted.published.find((entry) => entry.day === day);
    if (day >= currentDay || !['published', 'held'].includes(record.status) || (record.publicationIntent && !record.publication) ||
      record.publication?.liveVerified === false || publication?.liveVerified === false ||
      Object.values(record.calls).some((call) => ['pending', 'unknown'].includes(call.status))) continue;
    if (record.archive) {
      safeDays.add(day);
      continue;
    }
    const original = JSON.stringify(state.days[day]);
    if (!snapshot.days[day] || JSON.stringify(snapshot.days[day]) !== original) continue;
    record.archive = { stateCommit: commit, recordHash: hash(original) };
    for (const key of Object.keys(record)) {
      if (!['attempt', 'status', 'startedAt', 'completedAt', 'heldAt', 'reason', 'calls', 'budget', 'archive'].includes(key)) delete record[key];
    }
    for (const call of Object.values(record.calls)) {
      if (!call.receipt) continue;
      const retained = { receiptHash: hash(JSON.stringify(call.receipt)) };
      for (const key of ['requestId', 'httpStatus', 'responseHash', 'usage', 'provider', 'model']) {
        if (call.receipt[key] !== undefined) retained[key] = call.receipt[key];
      }
      call.receipt = retained;
    }
    safeDays.add(day);
  }
  const orderedDays = Object.keys(compacted.days).sort().reverse();
  for (const day of orderedDays.slice(365)) {
    if (!safeDays.has(day)) continue;
    const record = compacted.days[day];
    const publication = compacted.published.find((entry) => entry.day === day);
    if (publication) Object.assign(publication, record.archive);
    delete compacted.days[day];
    if (!compacted.archiveHistory || compacted.archiveHistory.throughDay < day) {
      // This prior snapshot's ancestry retains budgets for pruned held/published days.
      compacted.archiveHistory = { throughDay: day, stateCommit: commit };
    }
  }
  return validateState(compacted);
}

function applyCompaction(state, compacted) {
  // Keep active day object references stable for the calling runner.
  for (const day of Object.keys(state.days)) {
    if (!compacted.days[day]) delete state.days[day];
    else if (JSON.stringify(state.days[day]) !== JSON.stringify(compacted.days[day])) state.days[day] = compacted.days[day];
  }
  state.published = compacted.published;
  if (compacted.archiveHistory) state.archiveHistory = compacted.archiveHistory;
}

function unresolvedCall(state) {
  for (const [day, record] of Object.entries(state.days)) {
    for (const [id, call] of Object.entries(record.calls)) {
      if (call.status === 'pending' || call.status === 'unknown') return { day, id };
    }
  }
  return undefined;
}

function unresolvedPublication(state) {
  return Object.values(state.days).some((record) => record.publicationIntent && !record.publication);
}

/** Resume the same attempt; a held/published record remains terminal. Unknown calls halt all automatic work. */
export function beginDay(state, day) {
  validateState(state);
  validDay(day);
  if (unresolvedCall(state)) fail('OUTCOME_UNKNOWN', 'A paid call has an unresolved outcome; automatic replay is held.');
  if (unresolvedPublication(state)) fail('PUBLICATION_OUTCOME_UNKNOWN', 'A publication has an unresolved outcome; reconcile the authoritative repository before starting another day.');
  if (state.days[day]) return state.days[day];
  if (state.archiveHistory && day <= state.archiveHistory.throughDay) fail('DAY_TERMINAL', 'Archived historical days cannot start a second attempt.');
  const record = { attempt: 1, status: 'started', startedAt: new Date().toISOString(), calls: {}, budget: { providers: {} } };
  state.days[day] = record;
  validateState(state);
  return record;
}

/** Reserve worst-case provider units and a call slot. No outcome refunds either; limits are per-provider grants. */
export function reserveCall(state, { day, id, provider, requestHash, units, limit }) {
  validateState(state);
  validDay(day);
  identifier(id, 'call ID');
  identifier(provider, 'provider');
  if (typeof requestHash !== 'string' || !/^[a-f0-9]{64}$/.test(requestHash)) fail('INVALID_HASH', 'Request hash must be SHA-256 hex.');
  const record = state.days[day];
  if (!record || ['held', 'published'].includes(record.status)) fail('DAY_TERMINAL', 'The day is absent or terminal.');
  if (record.calls[id]) fail('CALL_EXISTS', 'A call ID cannot be reserved twice; reuse only a completed matching receipt.');
  if (unresolvedCall(state)) fail('OUTCOME_UNKNOWN', 'An unresolved paid call blocks another reservation.');
  if (unresolvedPublication(state)) fail('PUBLICATION_OUTCOME_UNKNOWN', 'An unresolved publication blocks another paid reservation.');
  const caps = typeof limit === 'number' ? { units: limit, calls: 1 } : limit;
  if (!Number.isFinite(units) || units < 0 || !object(caps) || !Number.isFinite(caps.units) || caps.units < 0 || !Number.isSafeInteger(caps.calls) || caps.calls < 1) {
    fail('INVALID_BUDGET', 'A reservation requires non-negative units and explicit unit/call limits.');
  }
  const used = record.budget.providers[provider] ?? { units: 0, calls: 0 };
  if (used.units + units > caps.units || used.calls + 1 > caps.calls) fail('BUDGET_EXHAUSTED', 'The daily provider grant is exhausted.');
  const call = { provider, requestHash, units, status: 'pending', reservedAt: new Date().toISOString() };
  record.calls[id] = call;
  record.budget.providers[provider] = { units: used.units + units, calls: used.calls + 1 };
  try { validateState(state); } catch (error) {
    delete record.calls[id];
    if (used.calls === 0) delete record.budget.providers[provider]; else record.budget.providers[provider] = used;
    throw error;
  }
  return call;
}

/** Save bounded response output/usage as a receipt. Never pass request credentials or raw HTTP headers. */
export function completeCall(state, { day, id, status = 'completed', receipt = {} }) {
  validateState(state);
  validDay(day);
  identifier(id, 'call ID');
  const call = state.days[day]?.calls[id];
  if (!call || !['pending', 'unknown'].includes(call.status)) fail('CALL_TERMINAL', 'Only a pending or explicitly reconciled unknown call may be completed.');
  if (!['completed', 'failed', 'unknown'].includes(status)) fail('INVALID_OUTCOME', 'Invalid call outcome.');
  if (!object(receipt)) fail('INVALID_RECEIPT', 'Receipt must be a plain JSON object.');
  safeJson(receipt);
  if (Buffer.byteLength(JSON.stringify(receipt)) > MAX_RECEIPT_BYTES) fail('RECEIPT_LIMIT', 'Receipt exceeds the 256 KiB bound.');
  const previous = { ...call };
  Object.assign(call, { status, receipt: structuredClone(receipt), completedAt: new Date().toISOString() });
  try { validateState(state); } catch (error) {
    for (const key of Object.keys(call)) delete call[key];
    Object.assign(call, previous);
    throw error;
  }
  return call;
}

export function holdDay(state, day, reason) {
  validateState(state);
  validDay(day);
  const record = state.days[day];
  if (!record || record.status === 'published') fail('DAY_TERMINAL', 'The day cannot be held.');
  if (typeof reason !== 'string' || reason.length > 1024) fail('INVALID_REASON', 'Hold reason must be a bounded string.');
  record.status = 'held';
  record.reason = reason;
  return record;
}

/** Record only a proven atomic publication commit; one article/day and one project/slug in the ledger. */
export function markPublished(state, { day, repository, slug, commit, ...proof }) {
  validateState(state);
  validDay(day);
  if (unresolvedCall(state)) fail('OUTCOME_UNKNOWN', 'Publication cannot proceed with an unresolved paid call.');
  const record = state.days[day];
  if (!record || record.status === 'held') fail('DAY_TERMINAL', 'The day is absent or held.');
  if (typeof repository !== 'string' || !/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repository) || typeof slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !COMMIT_PATTERN.test(commit)) {
    fail('INVALID_PUBLICATION', 'Publication requires a repository, safe slug, and immutable commit.');
  }
  const previous = state.published.find((entry) => entry.day === day);
  if (previous) {
    if (previous.repository.toLowerCase() === repository.toLowerCase() && previous.slug === slug && previous.commit === commit) return previous;
    fail('DUPLICATE_PUBLICATION', 'This day already published an article.');
  }
  if (state.published.some((entry) => entry.repository.toLowerCase() === repository.toLowerCase() || entry.slug === slug)) fail('DUPLICATE_PUBLICATION', 'This repository or slug was already published.');
  const recordedAt = new Date().toISOString();
  const entry = { ...proof, day, repository, slug, commit, publishedAt: proof.publishedAt ?? recordedAt, recordedAt };
  safeJson(entry);
  const oldStatus = record.status;
  state.published.push(entry);
  record.status = 'published';
  try { validateState(state); } catch (error) { state.published.pop(); record.status = oldStatus; throw error; }
  return entry;
}

function serialize(state) {
  validateState(state);
  return `${JSON.stringify(state)}\n`;
}

function parseState(data) {
  if (Buffer.byteLength(data) > MAX_STATE_BYTES) fail('STATE_LIMIT', 'Persisted editorial state exceeds 1 MiB.');
  let state;
  try { state = JSON.parse(data); } catch { fail('INVALID_STATE', 'Persisted editorial state is invalid JSON.'); }
  return validateState(state);
}

async function atomicWrite(path, data) {
  await mkdir(dirname(path), { recursive: true });
  const temporary = `${path}.${randomUUID()}.tmp`;
  let handle;
  try {
    handle = await open(temporary, 'wx', 0o600);
    await handle.writeFile(data, 'utf8');
    await handle.sync();
    await handle.close();
    handle = undefined;
    await rename(temporary, path);
    const directory = await open(dirname(path), 'r');
    try { await directory.sync(); } finally { await directory.close(); }
  } finally {
    if (handle) await handle.close();
    await unlink(temporary).catch((error) => { if (error.code !== 'ENOENT') throw error; });
  }
}

/** Atomic local fixtures with private content-addressed snapshots for historical payload compaction. */
export function createLocalStateStore({ file, now = () => new Date() }) {
  if (typeof file !== 'string' || !file) fail('INVALID_STORE', 'A local state path is required.');
  const path = resolve(file);
  let snapshot;
  let previousData;
  return {
    async load() {
      try {
        previousData = await readFile(path, 'utf8');
        const state = parseState(previousData);
        snapshot = structuredClone(state);
        return state;
      } catch (error) { if (error.code === 'ENOENT') { snapshot = undefined; previousData = undefined; return newState(); } throw error; }
    },
    async checkpoint(state) {
      const sourceHash = previousData ? hash(previousData) : undefined;
      const compacted = compactState(state, brisbaneDay(now()), { commit: sourceHash, snapshot });
      const data = serialize(compacted);
      if (sourceHash && JSON.stringify(compacted) !== JSON.stringify(state)) {
        const archivePath = joinArchivePath(path, sourceHash);
        let existing;
        try { existing = await readFile(archivePath, 'utf8'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
        if (existing !== undefined && hash(existing) !== sourceHash) fail('INVALID_ARCHIVE', 'Local archive hash does not match its contents.');
        if (existing === undefined) await atomicWrite(archivePath, previousData);
      }
      await atomicWrite(path, data);
      snapshot = structuredClone(compacted);
      previousData = data;
      applyCompaction(state, compacted);
      return { durable: true };
    },
  };
}

function joinArchivePath(path, sourceHash) {
  return `${path}.archive/${sourceHash}.json`;
}

function git(root, args, { input = '', acceptedCodes = [0] } = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn('git', ['-c', 'core.hooksPath=/dev/null', ...args], {
      cwd: root,
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'Never' },
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const chunks = [];
    let bytes = 0;
    let overflow = false;
    child.stdout.on('data', (chunk) => { bytes += chunk.length; if (bytes > MAX_STATE_BYTES + 64 * 1024) { overflow = true; child.kill(); } else chunks.push(chunk); });
    // Never include Git stderr: transport errors can contain credential-bearing URLs.
    child.stderr.on('data', () => {});
    child.on('error', () => reject(Object.assign(new Error('Git state command could not start.'), { code: 'GIT_FAILED' })));
    child.on('close', (code) => {
      if (overflow) return reject(Object.assign(new Error('Git state output exceeded its bound.'), { code: 'STATE_LIMIT' }));
      if (!acceptedCodes.includes(code)) return reject(Object.assign(new Error(`Git state ${args[0]} failed; paid calls remain blocked.`), { code: 'GIT_FAILED', exitCode: code }));
      resolvePromise({ output: Buffer.concat(chunks).toString('utf8').trimEnd(), code });
    });
    child.stdin.on('error', () => {});
    child.stdin.end(input);
  });
}

function allowedRemote(url) {
  return /^(?:https:\/\/github\.com\/|git@github\.com:|ssh:\/\/git@github\.com\/)eliteandhonor\/accessfreetools\.com(?:\.git)?$/.test(url);
}

/**
 * An orphan state branch with append-only commit history and force-with-lease CAS.
 * load() fetches without merging. Production checkpoint() requires activated:true;
 * its successful push is the durable barrier required before every paid call.
 * fixtureRemote is accepted ONLY for a local bare repo named in that explicit option.
 */
export async function createGitStateStore({ root, branch = 'automation/aft-editorial-state', remote = 'origin', activated = false, fixtureRemote, now = () => new Date() } = {}) {
  if (typeof root !== 'string') fail('INVALID_STORE', 'Git state requires a repository root.');
  const directory = await realpath(root);
  if ((await git(directory, ['rev-parse', '--show-toplevel'])).output !== directory) fail('INVALID_STORE', 'Git state must use the exact repository root.');
  identifier(remote, 'remote');
  if (!/^automation\/aft-editorial-state(?:-[a-zA-Z0-9-]+)?$/.test(branch)) fail('INVALID_BRANCH', 'Git state is restricted to its dedicated automation branch.');
  await git(directory, ['check-ref-format', `refs/heads/${branch}`]);
  const fetchUrls = (await git(directory, ['remote', 'get-url', '--all', remote])).output.split('\n');
  const pushUrls = (await git(directory, ['remote', 'get-url', '--push', '--all', remote])).output.split('\n');
  let fixture = false;
  if (fixtureRemote !== undefined) {
    if (typeof fixtureRemote !== 'string' || !fixtureRemote.startsWith('/')) fail('INVALID_REMOTE', 'Fixture remote must be an explicit absolute local path.');
    const localRemote = await realpath(fixtureRemote);
    if (fetchUrls.length !== 1 || pushUrls.length !== 1 || fetchUrls[0] !== localRemote || pushUrls[0] !== localRemote || (await git(localRemote, ['rev-parse', '--is-bare-repository'])).output !== 'true') {
      fail('INVALID_REMOTE', 'Fixture storage requires the exact named local bare remote.');
    }
    fixture = true;
  } else if (fetchUrls.length !== 1 || pushUrls.length !== 1 || !fetchUrls.every(allowedRemote) || !pushUrls.every(allowedRemote)) {
    fail('INVALID_REMOTE', `Git editorial state is restricted to ${TARGET_REPOSITORY}.`);
  }
  const fetchUrl = fetchUrls[0];
  const pushUrl = pushUrls[0];
  let expected;
  let loaded = false;
  let snapshot;
  const ref = `refs/heads/${branch}`;
  return {
    async load() {
      loaded = false;
      const heads = await git(directory, ['ls-remote', '--exit-code', '--heads', fetchUrl, ref], { acceptedCodes: [0, 2] });
      if (heads.code === 2) { expected = ''; snapshot = undefined; loaded = true; return newState(); }
      const temporaryRef = `refs/aft-editorial-state/${randomUUID()}`;
      try {
        await git(directory, ['fetch', '--no-tags', '--no-write-fetch-head', fetchUrl, `${ref}:${temporaryRef}`]);
        expected = (await git(directory, ['rev-parse', temporaryRef])).output;
        const state = parseState((await git(directory, ['show', `${expected}:state.json`])).output);
        snapshot = structuredClone(state);
        loaded = true;
        return state;
      } finally { await git(directory, ['update-ref', '-d', temporaryRef]); }
    },
    async checkpoint(state) {
      if (!fixture && activated !== true) fail('NOT_ACTIVATED', 'Production state writes are disabled until activation.');
      if (!loaded) fail('STATE_NOT_LOADED', 'Load the latest state before checkpointing.');
      const compacted = compactState(state, brisbaneDay(now()), { commit: expected, snapshot });
      const data = serialize(compacted);
      const blob = (await git(directory, ['hash-object', '-w', '--stdin'], { input: data })).output;
      const tree = (await git(directory, ['mktree'], { input: `100644 blob ${blob}\tstate.json\n` })).output;
      const args = ['-c', 'user.name=AFT Editorial Automation', '-c', 'user.email=editorial-bot@users.noreply.github.com', 'commit-tree', tree];
      if (expected) args.push('-p', expected);
      args.push('-m', 'Checkpoint daily editorial state');
      const commit = (await git(directory, args)).output;
      try {
        await git(directory, ['push', '--porcelain', `--force-with-lease=${ref}:${expected}`, pushUrl, `${commit}:${ref}`]);
      } catch {
        loaded = false;
        fail('STATE_CONFLICT_OR_UNKNOWN', 'State checkpoint conflicted or its outcome is unknown; reload and reconcile before any paid call.');
      }
      expected = commit;
      snapshot = structuredClone(compacted);
      applyCompaction(state, compacted);
      return { durable: true, commit };
    },
  };
}
