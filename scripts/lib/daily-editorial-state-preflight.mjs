import { createHash } from 'node:crypto';
import { validateState } from './daily-editorial-state.mjs';

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value !== null && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  return value;
}
const digest = (state) => createHash('sha256').update(JSON.stringify(canonical(validateState(state)))).digest('hex');
const proof = (passed, stateSha256 = null, stateCommit = null, code = passed ? 'STATE_PREFLIGHT_PASSED' : 'STATE_PREFLIGHT_HELD') => ({ passed,
  code, stateSha256, stateCommit, providerCalls: 0, published: false });

function unfinished(state) {
  return state.published.some((record) => record.liveVerified !== true) || Object.values(state.days).some((record) =>
    (record.publicationIntent && !record.publication) || (record.publication && record.publication.liveVerified !== true) ||
    Object.values(record.calls).some((call) => ['pending', 'unknown'].includes(call.status)));
}

/**
 * One unchanged private checkpoint, then one fresh store readback. The caller
 * supplies the reviewed private-store factory and gates this state-only action.
 * No retries, provider calls, public writes, fallbacks, raw state, or error text.
 */
export async function stateRoundTripPreflight({ createStore, allowEmptyBaseline = false } = {}) {
  let store;
  const release = async () => { const current = store; store = undefined; await current.dispose(); };
  try {
    if (typeof createStore !== 'function' || typeof allowEmptyBaseline !== 'boolean') return proof(false);
    store = await createStore();
    if (!store || !['load', 'currentCommit', 'checkpoint', 'dispose'].every((method) => typeof store[method] === 'function')) return proof(false);
    const state = structuredClone(validateState(await store.load()));
    if (unfinished(state)) return proof(false);
    const baselineCommit = await store.currentCommit();
    if (baselineCommit === '' && !allowEmptyBaseline) return proof(false, null, null, 'STATE_PREFLIGHT_BASELINE_APPROVAL_REQUIRED');
    if (baselineCommit !== '' && !/^[a-f0-9]{40}$/.test(baselineCommit ?? '')) return proof(false);
    const stateSha256 = digest(state);
    const receipt = await store.checkpoint(state, { compact: false });
    if (receipt?.durable !== true || !/^[a-f0-9]{40}$/.test(receipt.commit ?? '') || receipt.commit === baselineCommit || digest(state) !== stateSha256) return proof(false);
    const firstStore = store;
    await release();
    store = await createStore();
    if (store === firstStore) { store = undefined; return proof(false); }
    if (!store || !['load', 'currentCommit', 'dispose'].every((method) => typeof store[method] === 'function')) return proof(false);
    const readback = await store.load();
    if (digest(readback) !== stateSha256 || await store.currentCommit() !== receipt.commit) return proof(false);
    await release();
    return proof(true, stateSha256, receipt.commit);
  } catch { return proof(false); }
  finally { try { await store?.dispose?.(); } catch { /* A failed cleanup never retries storage or exposes its error. */ } }
}
