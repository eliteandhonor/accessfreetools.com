import net from 'node:net';
import tls from 'node:tls';
import type { SendMailOptions } from 'nodemailer';
import type StreamTransport from 'nodemailer/lib/stream-transport';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let sendMail: ReturnType<typeof vi.fn>;
let createTransport: ReturnType<typeof vi.spyOn>;
let deliveries: StreamTransport.SentMessageInfo[];
let post: typeof import('../../src/pages/api/contact').POST;

beforeEach(async () => {
  vi.resetModules();
  vi.stubEnv('SMTP_HOST', 'smtp.example.invalid');
  vi.stubEnv('SMTP_PORT', '465');
  vi.stubEnv('SMTP_SECURE', 'true');
  vi.stubEnv('SMTP_USER', 'sender@example.invalid');
  vi.stubEnv('SMTP_PASS', 'synthetic-test-value');
  vi.stubEnv('CONTACT_TO', 'recipient@example.invalid');
  vi.stubGlobal('fetch', vi.fn(() => { throw new Error('Network forbidden in contact regression'); }));
  vi.spyOn(net, 'connect').mockImplementation(() => { throw new Error('SMTP sockets forbidden'); });
  vi.spyOn(tls, 'connect').mockImplementation(() => { throw new Error('SMTP TLS forbidden'); });

  // Use Nodemailer's actual address parser and MIME composer. This transport
  // returns a message buffer locally; it cannot deliver email.
  const { default: nodemailer } = await import('nodemailer');
  const localTransport = nodemailer.createTransport({ streamTransport: true, buffer: true, newline: 'unix' });
  deliveries = [];
  sendMail = vi.fn(async (message: SendMailOptions) => {
    const delivery = await localTransport.sendMail(message);
    deliveries.push(delivery);
    return delivery;
  });
  createTransport = vi.spyOn(nodemailer, 'createTransport').mockReturnValue({ sendMail } as never);
  post = (await import('../../src/pages/api/contact')).POST;
});

afterEach(() => {
  expect(globalThis.fetch).not.toHaveBeenCalled();
  expect(net.connect).not.toHaveBeenCalled();
  expect(tls.connect).not.toHaveBeenCalled();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function submit(changes: Record<string, unknown> = {}, format: 'json' | 'form' = 'json') {
  const body = {
    company: '', email: 'visitor@example.invalid', message: 'Please check this synthetic tool example.',
    name: 'Synthetic visitor', topic: 'Correction', ...changes,
  };
  const request = new Request('https://example.invalid/api/contact', {
    method: 'POST',
    headers: { 'content-type': format === 'json' ? 'application/json' : 'application/x-www-form-urlencoded' },
    body: format === 'json' ? JSON.stringify(body) : new URLSearchParams(body as Record<string, string>),
  });
  return post({ request, clientAddress: 'synthetic-local-client' } as never);
}

function composedMessage() {
  const delivery = deliveries[0];
  expect(Buffer.isBuffer(delivery.message)).toBe(true);
  const [headers, ...body] = delivery.message.toString().split('\n\n');
  return { delivery, headers, body: body.join('\n\n') };
}

describe('contact endpoint with real local Nodemailer composition', () => {
  it.each(['json', 'form'] as const)('composes a %s submission with a fixed envelope and visitor reply-to', async (format) => {
    const response = await submit({ email: ' visitor@example.invalid ' }, format);
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.json()).toEqual({ ok: true, message: 'Thanks. Your message has been sent.' });
    expect(createTransport).toHaveBeenCalledWith({
      auth: { user: 'sender@example.invalid', pass: 'synthetic-test-value' },
      host: 'smtp.example.invalid', port: 465, secure: true,
    });
    const { delivery, headers, body } = composedMessage();
    expect(delivery.envelope).toEqual({ from: 'sender@example.invalid', to: ['recipient@example.invalid'] });
    expect(headers).toMatch(/^Reply-To: visitor@example\.invalid$/m);
    expect(headers).toMatch(/^Subject: Access Free Tools: Correction$/m);
    expect(headers).toMatch(/^Content-Type: text\/plain;/m);
    expect(body).toContain('Email: visitor@example.invalid');
    expect(body).toContain('Please check this synthetic tool example.');
  });

  it.each([
    { email: 'visitor@example.invalid\r\nBcc: other@example.invalid' },
    { email: ['visitor@example.invalid'] },
    { email: { address: 'visitor@example.invalid' } },
    { topic: 'Correction\r\nBcc: other@example.invalid' },
  ])('rejects invalid header inputs before composing mail: %j', async (changes) => {
    expect((await submit(changes)).status).toBe(400);
    expect(createTransport).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('keeps header-looking lines and markup in the plain-text body only', async () => {
    expect((await submit({
      name: 'Visitor\r\nBcc: extra@example.invalid',
      message: 'Bcc: body@example.invalid\n<script>synthetic</script>',
    })).status).toBe(200);
    const { delivery, headers, body } = composedMessage();
    expect(delivery.envelope.to).toEqual(['recipient@example.invalid']);
    expect(headers).not.toMatch(/^Bcc:/m);
    expect(headers).not.toContain('<script>');
    expect(body).toContain('Bcc: extra@example.invalid');
    expect(body).toContain('<script>synthetic</script>');
  });

  it('accepts the exact message bound and rejects one character over before mail composition', async () => {
    expect((await submit({ message: 'a'.repeat(4000) })).status).toBe(200);
    expect((await submit({ message: 'a'.repeat(4001) })).status).toBe(400);
    expect(createTransport).toHaveBeenCalledTimes(1);
    expect(sendMail).toHaveBeenCalledTimes(1);
  });

  it('does not compose mail for the honeypot or missing SMTP configuration', async () => {
    expect((await submit({ company: 'Synthetic honeypot' })).status).toBe(200);
    vi.stubEnv('SMTP_PASS', '');
    expect((await submit()).status).toBe(503);
    expect(createTransport).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
  });
});
