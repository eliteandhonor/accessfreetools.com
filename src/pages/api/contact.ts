import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { createBoundedRateLimiter } from '../../lib/boundedRateLimiter';

export const prerender = false;

const CONTACT_EMAIL = 'contact@accessfreetools.com';
const ALLOWED_TOPICS = new Set([
  'Tool idea',
  'Correction',
  'Privacy question',
  'Advertising or affiliate question',
  'General feedback',
]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimit = createBoundedRateLimiter(RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);

type ContactPayload = {
  company: string;
  email: string;
  message: string;
  name: string;
  topic: string;
};

class BadContactRequestError extends Error {}

function jsonResponse(body: Record<string, unknown>, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'cache-control': 'no-store',
      'content-type': 'application/json',
      ...headers,
    },
  });
}

function cleanValue(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

async function parseContactPayload(request: Request): Promise<ContactPayload> {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    let body: Record<string, unknown>;

    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      throw new BadContactRequestError('Message format was not readable. Try sending the form again.');
    }

    return {
      company: cleanValue(body.company, 120),
      email: cleanValue(body.email, 180),
      message: cleanValue(body.message, 5000),
      name: cleanValue(body.name, 120),
      topic: cleanValue(body.topic, 80),
    };
  }

  const body = await request.formData();
  return {
    company: cleanValue(body.get('company'), 120),
    email: cleanValue(body.get('email'), 180),
    message: cleanValue(body.get('message'), 5000),
    name: cleanValue(body.get('name'), 120),
    topic: cleanValue(body.get('topic'), 80),
  };
}

function validatePayload(payload: ContactPayload) {
  if (payload.company) {
    return { shouldSkip: true };
  }

  if (!payload.email || !EMAIL_PATTERN.test(payload.email)) {
    return { error: 'Enter a valid email address.' };
  }

  if (!ALLOWED_TOPICS.has(payload.topic)) {
    return { error: 'Choose a message topic.' };
  }

  if (payload.message.length < 10) {
    return { error: 'Message must be at least 10 characters.' };
  }

  if (payload.message.length > 4000) {
    return { error: 'Message must be 4000 characters or less.' };
  }

  return {};
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST ?? 'smtp.hostinger.com';
  const port = Number(process.env.SMTP_PORT ?? 465);
  const secure = (process.env.SMTP_SECURE ?? 'true').toLowerCase() !== 'false';
  const user = process.env.SMTP_USER ?? CONTACT_EMAIL;
  const pass = process.env.SMTP_PASS;
  const to = process.env.CONTACT_TO ?? CONTACT_EMAIL;

  if (!pass) {
    return { error: 'Contact form is not configured yet.' };
  }

  if (!Number.isFinite(port) || port <= 0) {
    return { error: 'Contact form SMTP port is not configured correctly.' };
  }

  return { host, pass, port, secure, to, user };
}

function buildMessageText(payload: ContactPayload) {
  return [
    'New Access Free Tools contact message',
    '',
    `Topic: ${payload.topic}`,
    `Name: ${payload.name || 'Not provided'}`,
    `Email: ${payload.email}`,
    '',
    'Message:',
    payload.message,
  ].join('\n');
}

export const POST: APIRoute = async ({ clientAddress, request }) => {
  try {
    const payload = await parseContactPayload(request);
    const validation = validatePayload(payload);

    if ('shouldSkip' in validation) {
      return jsonResponse({ ok: true, message: 'Thanks. Your message has been received.' });
    }

    if (validation.error) {
      return jsonResponse({ ok: false, message: validation.error }, 400);
    }

    const rateLimitKey = clientAddress || payload.email.toLowerCase();
    const retryAfter = rateLimit(rateLimitKey, Date.now());
    if (retryAfter !== null) {
      return jsonResponse({ ok: false, message: 'Too many messages. Try again later.' }, 429,
        { 'retry-after': String(retryAfter) });
    }

    const smtpConfig = getSmtpConfig();
    if ('error' in smtpConfig) {
      return jsonResponse({ ok: false, message: smtpConfig.error }, 503);
    }

    const transporter = nodemailer.createTransport({
      auth: {
        pass: smtpConfig.pass,
        user: smtpConfig.user,
      },
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
    });

    await transporter.sendMail({
      from: `"Access Free Tools Contact" <${smtpConfig.user}>`,
      replyTo: payload.email,
      subject: `Access Free Tools: ${payload.topic}`,
      text: buildMessageText(payload),
      to: smtpConfig.to,
    });

    return jsonResponse({ ok: true, message: 'Thanks. Your message has been sent.' });
  } catch (error) {
    if (error instanceof BadContactRequestError) {
      return jsonResponse({ ok: false, message: error.message }, 400);
    }

    console.error('Contact form failed', error instanceof Error ? error.message : 'Unknown error');
    return jsonResponse({ ok: false, message: 'The message could not be sent right now.' }, 500);
  }
};

export const GET: APIRoute = () => jsonResponse({ ok: false, message: 'Use POST to send contact messages.' }, 405);
