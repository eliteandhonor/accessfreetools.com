import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DEFAULT_BASE_URL = 'https://developers.hostinger.com';
const LOCAL_ENV_PATH = resolve('.local/hostinger-api.env');
const TOKEN_KEYS = ['HOSTINGER_API_TOKEN', 'API_TOKEN'];

function parseEnvFile(path) {
  if (!existsSync(path)) return {};

  const values = {};
  for (const rawLine of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    values[key] = rawValue.replace(/^['"]|['"]$/g, '');
  }

  return values;
}

export function readHostingerLocalEnv() {
  return parseEnvFile(LOCAL_ENV_PATH);
}

export function readHostingerToken() {
  const localEnv = readHostingerLocalEnv();

  for (const key of TOKEN_KEYS) {
    const value = process.env[key] || localEnv[key];
    if (value) return value;
  }

  throw new Error(
    'Hostinger API token is missing. Set HOSTINGER_API_TOKEN in the environment or .local/hostinger-api.env.',
  );
}

export function hostingerBaseUrl() {
  return (process.env.HOSTINGER_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');
}

export function redactHostingerSecret(value, token = undefined) {
  const secret = token || process.env.HOSTINGER_API_TOKEN || readHostingerLocalEnv().HOSTINGER_API_TOKEN || '';
  let text = typeof value === 'string' ? value : JSON.stringify(value, null, 2);

  if (secret) {
    text = text.split(secret).join('[REDACTED_HOSTINGER_TOKEN]');
  }

  return text.replace(/Bearer\s+[A-Za-z0-9._~+/=-]{20,}/g, 'Bearer [REDACTED_HOSTINGER_TOKEN]');
}

function parseRateLimit(headers) {
  const names = ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'retry-after'];
  const values = {};

  for (const name of names) {
    const value = headers.get(name);
    values[name] = value === null ? null : value;
  }

  return values;
}

function safeJson(text) {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export class HostingerApiError extends Error {
  constructor(endpoint, message, details = {}) {
    super(`Hostinger ${endpoint}: ${message}`);
    this.name = 'HostingerApiError';
    this.endpoint = endpoint;
    this.status = details.status ?? null;
    this.correlationId = details.correlationId ?? null;
    this.rateLimit = details.rateLimit ?? null;
    this.response = details.response ?? null;
  }
}

export async function hostingerRequest(endpoint, options = {}) {
  const token = readHostingerToken();
  const method = options.method ?? 'GET';
  const body = options.body === undefined ? undefined : JSON.stringify(options.body);
  const url = `${hostingerBaseUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    body,
  });

  const text = await response.text();
  const json = safeJson(redactHostingerSecret(text, token));
  const rateLimit = parseRateLimit(response.headers);

  if (!response.ok) {
    const responseObject = safeJson(text) ?? {};
    const message = responseObject.error || response.statusText || 'request failed';
    throw new HostingerApiError(endpoint, `returned HTTP ${response.status}: ${message}`, {
      status: response.status,
      correlationId: responseObject.correlation_id ?? response.headers.get('x-correlation-id') ?? null,
      rateLimit,
      response: json,
    });
  }

  return {
    endpoint,
    method,
    status: response.status,
    rateLimit,
    data: json,
  };
}

export async function listHostingerWebsites(params = {}) {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    per_page: String(params.perPage ?? 50),
  });
  return hostingerRequest(`/api/hosting/v1/websites?${query}`);
}

export async function listHostingerOrders(params = {}) {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    per_page: String(params.perPage ?? 50),
  });
  return hostingerRequest(`/api/hosting/v1/orders?${query}`);
}

export async function listHostingerDomains(params = {}) {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    per_page: String(params.perPage ?? 50),
  });
  return hostingerRequest(`/api/domains/v1/portfolio?${query}`);
}

export async function getHostingerDnsRecords(domain) {
  return hostingerRequest(`/api/dns/v1/zones/${encodeURIComponent(domain)}`);
}

export async function listHostingerVpsDockerProjects(virtualMachineId) {
  return hostingerRequest(`/api/vps/v1/virtual-machines/${encodeURIComponent(virtualMachineId)}/docker`);
}

export async function getHostingerVpsDockerLogs(virtualMachineId, projectName) {
  return hostingerRequest(
    `/api/vps/v1/virtual-machines/${encodeURIComponent(virtualMachineId)}/docker/${encodeURIComponent(projectName)}/logs`,
  );
}

export function summarizeCollection(response) {
  const data = response?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.result)) return data.result;
  return data ? [data] : [];
}
