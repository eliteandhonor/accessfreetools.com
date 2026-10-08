/** Read-only private-store verification. No credential/account management. */
export async function privateRepositoryMetadata(repository, { token, fetchImpl = fetch, timeoutMs = 15000 } = {}) {
  const fail = (code) => { throw Object.assign(new Error(code), { code }); };
  if (typeof repository !== 'string' || !/^eliteandhonor\/[A-Za-z0-9_.-]+$/.test(repository) ||
      repository.toLowerCase() === 'eliteandhonor/accessfreetools.com') fail('PRIVATE_STATE_STORAGE_REQUIRED');
  if (typeof token !== 'string' || !token || /[\r\n]/.test(token) || token.length > 4096) fail('PRIVATE_STATE_ACCESS_REQUIRED');
  if (typeof fetchImpl !== 'function' || !Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 15000) fail('PRIVATE_STATE_VERIFICATION_INVALID');
  const controller = new AbortController();
  let reader;
  let response;
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => { controller.abort(); void reader?.cancel().catch(() => {}); reject(Object.assign(new Error('PRIVATE_STATE_VERIFICATION_FAILED'), { code: 'PRIVATE_STATE_VERIFICATION_FAILED' })); }, timeoutMs);
  });
  const work = (async () => {
    response = await fetchImpl(`https://api.github.com/repos/${repository}`, { redirect: 'error', signal: controller.signal,
      headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'AccessFreeTools-private-state' } });
    if (response.status !== 200 || response.redirected || !/^application\/json(?:;|$)/i.test(response.headers.get('content-type') ?? '')) fail('PRIVATE_STATE_VERIFICATION_FAILED');
    const length = response.headers.get('content-length');
    if (length && (!/^\d+$/.test(length) || Number(length) > 64000)) fail('PRIVATE_STATE_VERIFICATION_FAILED');
    if (!response.body) fail('PRIVATE_STATE_VERIFICATION_FAILED');
    reader = response.body.getReader();
    const chunks = [];
    let size = 0;
    for (;;) {
      if (controller.signal.aborted) fail('PRIVATE_STATE_VERIFICATION_FAILED');
      const next = await reader.read();
      if (next.done) break;
      size += next.value.byteLength;
      if (size > 64000) fail('PRIVATE_STATE_VERIFICATION_FAILED');
      chunks.push(next.value);
    }
    const data = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks)));
    // Return only the fields used for admission, never account or raw response data.
    if (data?.full_name?.toLowerCase() !== repository.toLowerCase() || data.private !== true || data.visibility !== 'private' ||
        data.archived !== false || data.disabled !== false || data.permissions?.push !== true) fail('PRIVATE_STATE_STORAGE_REQUIRED');
    return { full_name: data.full_name, private: true, visibility: 'private', archived: false, disabled: false, permissions: { push: true } };
  })();
  try { return await Promise.race([work, timeout]); }
  catch (error) { if (['PRIVATE_STATE_STORAGE_REQUIRED', 'PRIVATE_STATE_VERIFICATION_FAILED'].includes(error?.code)) throw error; fail('PRIVATE_STATE_VERIFICATION_FAILED'); }
  finally { clearTimeout(timer); if (reader) void reader.cancel().catch(() => {}); else void response?.body?.cancel().catch(() => {}); }
}
