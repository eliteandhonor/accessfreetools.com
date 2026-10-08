import { it, expect } from 'vitest';
import { privateRepositoryMetadata } from './daily-editorial-storage.mjs';

const repository = 'eliteandhonor/aft-private-state-fixture';
const token = 'OFFLINE_FIXTURE_TOKEN';
const data = { full_name: repository, private: true, visibility: 'private', archived: false, disabled: false, permissions: { push: true }, unrelatedPrivateData: 'OMIT_FROM_RESULT' };
const response = (body = data, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

it('requires private authorized write access and returns only admission metadata', async () => {
  let calls = 0;
  const result = await privateRepositoryMetadata(repository, { token, fetchImpl: async (url, init) => {
    calls++; expect(url).toBe(`https://api.github.com/repos/${repository}`); expect(init.redirect).toBe('error'); return response();
  } });
  expect(calls).toBe(1); expect(result).not.toHaveProperty('unrelatedPrivateData');
});
it.each([
  { ...data, private: false, visibility: 'public' }, { ...data, full_name: 'other/private-state' },
  { ...data, permissions: { push: false } }, { ...data, visibility: 'internal' }, { ...data, archived: true },
])('holds unsuitable storage before trusting it', async (body) => {
  await expect(privateRepositoryMetadata(repository, { token, fetchImpl: async () => response(body) })).rejects.toMatchObject({ code: 'PRIVATE_STATE_STORAGE_REQUIRED' });
});
it('rejects missing access, public AFT target and arbitrary owners without dispatch', async () => {
  let called = false; const fetchImpl = async () => { called = true; return response(); };
  await expect(privateRepositoryMetadata(repository, { fetchImpl })).rejects.toMatchObject({ code: 'PRIVATE_STATE_ACCESS_REQUIRED' });
  await expect(privateRepositoryMetadata('eliteandhonor/accessfreetools.com', { token, fetchImpl })).rejects.toMatchObject({ code: 'PRIVATE_STATE_STORAGE_REQUIRED' });
  await expect(privateRepositoryMetadata('other/private-store', { token, fetchImpl })).rejects.toMatchObject({ code: 'PRIVATE_STATE_STORAGE_REQUIRED' });
  expect(called).toBe(false);
});
it.each([401, 403, 404, 429, 500])('reports safe failures with no provider body or credential text for HTTP %s', async (status) => {
  const error = await privateRepositoryMetadata(repository, { token, fetchImpl: async () => response({ leaked: token }, status) }).catch(value => value);
  expect(error.code).toBe('PRIVATE_STATE_VERIFICATION_FAILED'); expect(error.message).not.toContain(token);
});
it('bounds malformed/oversized responses and an unresolved fetch', async () => {
  await expect(privateRepositoryMetadata(repository, { token, fetchImpl: async () => response({ text: 'x'.repeat(64001) }) })).rejects.toMatchObject({ code: 'PRIVATE_STATE_VERIFICATION_FAILED' });
  await expect(privateRepositoryMetadata(repository, { token, fetchImpl: async () => new Response('INVALID', { headers: { 'content-type': 'application/json' } }) })).rejects.toMatchObject({ code: 'PRIVATE_STATE_VERIFICATION_FAILED' });
  await expect(privateRepositoryMetadata(repository, { token, timeoutMs: 5, fetchImpl: async () => new Promise(() => {}) })).rejects.toMatchObject({ code: 'PRIVATE_STATE_VERIFICATION_FAILED' });
});
