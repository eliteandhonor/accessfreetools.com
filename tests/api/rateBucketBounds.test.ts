import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const smtp = vi.hoisted(() => ({ sendMail: vi.fn(), createTransport: vi.fn() }));
vi.mock('nodemailer', () => ({ default: { createTransport: smtp.createTransport } }));
vi.mock('../../src/lib/privateEnv', () => ({ getApiBetaToken: () => process.env.AFT_API_BETA_TOKEN || '' }));

beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers();
  vi.setSystemTime(1_000_000);
  vi.stubEnv('AFT_API_BETA_TOKEN', 'synthetic-beta');
  vi.stubEnv('SMTP_HOST', 'smtp.example.invalid');
  vi.stubEnv('SMTP_PORT', '465');
  vi.stubEnv('SMTP_SECURE', 'true');
  vi.stubEnv('SMTP_USER', 'sender@example.invalid');
  vi.stubEnv('SMTP_PASS', 'synthetic-not-a-credential');
  vi.stubEnv('CONTACT_TO', 'recipient@example.invalid');
  smtp.sendMail.mockReset().mockResolvedValue({});
  smtp.createTransport.mockReset().mockReturnValue({ sendMail: smtp.sendMail });
  vi.stubGlobal('fetch', vi.fn(() => { throw new Error('Network forbidden'); }));
});

afterEach(() => {
  expect(globalThis.fetch).not.toHaveBeenCalled();
  expect(vi.getTimerCount()).toBe(0);
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

async function expectLimited(response: Response | null, retry: number, message: string) {
  expect(response?.status).toBe(429);
  expect(response!.headers.get('retry-after')).toBe(String(retry));
  expect(response!.headers.get('cache-control')).toBe('no-store');
  expect(response!.headers.get('content-type')).toBe('application/json');
  expect(await response!.json()).toEqual({ ok: false, message });
}

const apiMessage = 'Too many API requests. Try again shortly.';
const contactMessage = 'Too many messages. Try again later.';

describe('bounded API buckets', () => {
  it('preserves exactly 60 requests and resets at the exact 60-second boundary', async () => {
    const { checkRateLimit } = await import('../../src/lib/apiHttp');
    for (let i = 0; i < 60; i++) expect(checkRateLimit('quota')).toBeNull();
    await expectLimited(checkRateLimit('quota'), 60, apiMessage);
    vi.setSystemTime(1_059_999);
    await expectLimited(checkRateLimit('quota'), 1, apiMessage);
    vi.setSystemTime(1_060_000);
    expect(checkRateLimit('quota')).toBeNull();
  });

  it('rejects new identities at 4096 without evicting or spending existing quotas', async () => {
    const { checkRateLimit } = await import('../../src/lib/apiHttp');
    for (let i = 0; i < 4096; i++) expect(checkRateLimit(`identity-${i}`)).toBeNull();
    for (let i = 0; i < 32; i++) await expectLimited(checkRateLimit(`overflow-${i}`), 60, apiMessage);
    for (let i = 1; i < 60; i++) expect(checkRateLimit('identity-0')).toBeNull();
    await expectLimited(checkRateLimit('identity-0'), 60, apiMessage);
    for (let i = 1; i < 60; i++) expect(checkRateLimit('identity-4095')).toBeNull();
    await expectLimited(checkRateLimit('identity-4095'), 60, apiMessage);
  });

  it('uses the earliest expiry and recovers capacity without resetting later buckets', async () => {
    const { checkRateLimit } = await import('../../src/lib/apiHttp');
    expect(checkRateLimit('early')).toBeNull();
    vi.setSystemTime(1_010_000);
    for (let i = 1; i < 4096; i++) expect(checkRateLimit(`later-${i}`)).toBeNull();
    for (let i = 1; i < 60; i++) expect(checkRateLimit('later-1')).toBeNull();
    await expectLimited(checkRateLimit('new'), 50, apiMessage);
    vi.setSystemTime(1_060_000);
    expect(checkRateLimit('new')).toBeNull();
    await expectLimited(checkRateLimit('later-1'), 10, apiMessage);
    await expectLimited(checkRateLimit('another'), 10, apiMessage);
  });

  it('fails closed for invalid keys and accepts the exact 256-code-unit bound', async () => {
    const { checkRateLimit } = await import('../../src/lib/apiHttp');
    for (const key of ['', ' ', 'line\nbreak', 'a'.repeat(257), null, undefined, 12, {}]) {
      await expectLimited(checkRateLimit(key as string), 60, apiMessage);
    }
    expect(checkRateLimit('a'.repeat(256))).toBeNull();
  });

  it('keeps authentication header-only and no-store, independently of capacity', async () => {
    const { checkApiAccess, checkRateLimit } = await import('../../src/lib/apiHttp');
    for (let i = 0; i < 4096; i++) expect(checkRateLimit(`auth-${i}`)).toBeNull();
    const deniedHeaders: HeadersInit[] = [{}, { authorization: 'Bearer wrong' }, { 'x-aft-api-token': 'wrong' }];
    for (const headers of deniedHeaders) {
      const response = checkApiAccess(new Request('https://example.invalid/?token=synthetic-beta', { headers }));
      expect(response?.status).toBe(401);
      expect(response!.headers.get('cache-control')).toBe('no-store');
      expect(await response!.json()).toEqual({ ok: false, message: 'API beta token required.' });
    }
    const acceptedHeaders: HeadersInit[] = [{ authorization: 'Bearer synthetic-beta' }, { 'x-aft-api-token': 'synthetic-beta' }];
    for (const headers of acceptedHeaders) {
      expect(checkApiAccess(new Request('https://example.invalid/', { headers }))).toBeNull();
    }
    vi.stubEnv('AFT_API_BETA_TOKEN', '');
    expect(checkApiAccess(new Request('https://example.invalid/'))).toBeNull();
  });
});

async function contactCaller() {
  const { POST } = await import('../../src/pages/api/contact');
  return (clientAddress: string, email = 'synthetic@example.invalid') => POST({
    clientAddress,
    request: new Request('https://example.invalid/api/contact', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, name: 'Synthetic', topic: 'General feedback', company: '', message: 'Synthetic test message only.' }),
    }),
  } as never);
}

describe('bounded contact buckets with mocked SMTP only', () => {
  it('preserves exactly five messages, adds Retry-After and resets at 15 minutes', async () => {
    const contact = await contactCaller();
    for (let i = 0; i < 5; i++) expect((await contact('quota')).status).toBe(200);
    await expectLimited(await contact('quota'), 900, contactMessage);
    vi.setSystemTime(1_899_999);
    await expectLimited(await contact('quota'), 1, contactMessage);
    expect(smtp.sendMail).toHaveBeenCalledTimes(5);
    vi.setSystemTime(1_900_000);
    expect((await contact('quota')).status).toBe(200);
    expect(smtp.sendMail).toHaveBeenCalledTimes(6);
  });

  it('bounds 4096 identities, preserves existing quotas and recovers the earliest slot', async () => {
    const contact = await contactCaller();
    expect((await contact('early')).status).toBe(200);
    vi.setSystemTime(1_010_000);
    for (let i = 1; i < 4096; i++) expect((await contact(`later-${i}`)).status).toBe(200);
    await expectLimited(await contact('overflow'), 890, contactMessage);
    expect(smtp.sendMail).toHaveBeenCalledTimes(4096);
    for (let i = 1; i < 5; i++) expect((await contact('later-1')).status).toBe(200);
    await expectLimited(await contact('later-1'), 900, contactMessage);
    vi.setSystemTime(1_900_000);
    expect((await contact('new')).status).toBe(200);
    await expectLimited(await contact('later-1'), 10, contactMessage);
    await expectLimited(await contact('another'), 10, contactMessage);
    expect(smtp.sendMail).toHaveBeenCalledTimes(4101);
  });

  it('rejects oversized or invalid addresses before creating an SMTP transport', async () => {
    const contact = await contactCaller();
    for (const key of ['a'.repeat(257), ' ', 'bad\u0000address']) {
      await expectLimited(await contact(key), 900, contactMessage);
    }
    expect(smtp.createTransport).not.toHaveBeenCalled();
  });

  it('preserves the submitted-email fallback and separate API/contact allowances', async () => {
    const contact = await contactCaller();
    const { checkRateLimit } = await import('../../src/lib/apiHttp');
    for (let i = 0; i < 60; i++) expect(checkRateLimit('synthetic@example.invalid')).toBeNull();
    for (let i = 0; i < 5; i++) expect((await contact('', 'SYNTHETIC@example.invalid')).status).toBe(200);
    await expectLimited(await contact(''), 900, contactMessage);
    expect((await contact('other-address')).status).toBe(200);
    expect(smtp.sendMail).toHaveBeenCalledTimes(6);
  });
});
