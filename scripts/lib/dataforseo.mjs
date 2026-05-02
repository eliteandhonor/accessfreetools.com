import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const DEFAULT_BASE_URL = 'https://api.dataforseo.com/v3';
const SANDBOX_BASE_URL = 'https://sandbox.dataforseo.com/v3';
const SUCCESS_STATUS_CODES = new Set([20000, 20100]);
const KNOWN_STATUS_HINTS = new Map([
  [40203, 'DataForSEO says the account has insufficient funds for this request.'],
  [40204, 'DataForSEO says this endpoint needs an active subscription or extra API access.'],
  [40207, 'DataForSEO rejected the request because the daily API limit was reached.'],
  [40209, 'DataForSEO rejected the request because the account balance is too low.'],
  [40210, 'DataForSEO rejected the request because the account is blocked or access is restricted.'],
]);

function readCodexConfig() {
  try {
    return readFileSync(join(homedir(), '.codex', 'config.toml'), 'utf8');
  } catch {
    return '';
  }
}

function readTomlString(content, key) {
  const match = content.match(new RegExp(`${key}\\s*=\\s*"([^"]+)"`));
  return match?.[1] ?? '';
}

export function readDataForSeoCredentials() {
  const config = readCodexConfig();
  const username = process.env.DATAFORSEO_USERNAME || readTomlString(config, 'DATAFORSEO_USERNAME');
  const password = process.env.DATAFORSEO_PASSWORD || readTomlString(config, 'DATAFORSEO_PASSWORD');

  if (!username || !password) {
    throw new Error(
      'DataForSEO credentials are missing. Set DATAFORSEO_USERNAME/DATAFORSEO_PASSWORD or configure the local Codex MCP server.',
    );
  }

  return { username, password };
}

export function dataForSeoAuthHeader(credentials = readDataForSeoCredentials()) {
  const pair = `${credentials.username}:${credentials.password}`;
  return `Basic ${Buffer.from(pair, 'utf8').toString('base64')}`;
}

export function dataForSeoBaseUrl(options = {}) {
  if (options.baseUrl) {
    return options.baseUrl;
  }

  if (options.sandbox || process.env.DATAFORSEO_SANDBOX === 'true') {
    return SANDBOX_BASE_URL;
  }

  return process.env.DATAFORSEO_BASE_URL || DEFAULT_BASE_URL;
}

function parseRateLimit(headers) {
  const limit = headers.get('x-ratelimit-limit');
  const remaining = headers.get('x-ratelimit-remaining');
  const reset = headers.get('x-ratelimit-reset');

  return {
    limit: limit === null ? null : Number(limit),
    remaining: remaining === null ? null : Number(remaining),
    reset: reset ?? null,
  };
}

function statusHint(code) {
  return KNOWN_STATUS_HINTS.get(code) ?? 'DataForSEO returned a non-success status code.';
}

function collectStatusIssues(json) {
  const issues = [];

  if (typeof json.status_code === 'number' && !SUCCESS_STATUS_CODES.has(json.status_code)) {
    issues.push({
      level: 'response',
      code: json.status_code,
      message: json.status_message ?? '',
      hint: statusHint(json.status_code),
    });
  }

  if (Number(json.tasks_error ?? 0) > 0) {
    issues.push({
      level: 'response',
      code: json.status_code ?? null,
      message: `DataForSEO reported ${json.tasks_error} task error(s).`,
      hint: 'Inspect task-level status codes before trusting this response.',
    });
  }

  for (const task of json.tasks ?? []) {
    if (typeof task.status_code === 'number' && !SUCCESS_STATUS_CODES.has(task.status_code)) {
      issues.push({
        level: 'task',
        id: task.id ?? null,
        code: task.status_code,
        message: task.status_message ?? '',
        hint: statusHint(task.status_code),
      });
    }
  }

  return issues;
}

export class DataForSeoApiError extends Error {
  constructor(endpoint, message, details = {}) {
    super(`DataForSEO ${endpoint}: ${message}`);
    this.name = 'DataForSeoApiError';
    this.endpoint = endpoint;
    this.details = details;
    this.response = details.response;
    this.status = details.status;
    this.rateLimit = details.rateLimit;
  }
}

export async function dataForSeoRequest(endpoint, tasks = undefined, options = {}) {
  const url = `${dataForSeoBaseUrl(options)}${endpoint}`;
  const method = tasks === undefined ? 'GET' : 'POST';
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: dataForSeoAuthHeader(options.credentials),
      ...(tasks === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    body: tasks === undefined ? undefined : JSON.stringify(Array.isArray(tasks) ? tasks : [tasks]),
  });
  const text = await response.text();
  const json = text ? JSON.parse(text) : {};
  const rateLimit = parseRateLimit(response.headers);
  json.rateLimit = rateLimit;

  if (!response.ok) {
    const message = json.status_message ? `${json.status_code}: ${json.status_message}` : response.statusText;
    throw new DataForSeoApiError(endpoint, `returned HTTP ${response.status}: ${message}`, {
      response: json,
      status: response.status,
      rateLimit,
    });
  }

  const statusIssues = collectStatusIssues(json);

  if (statusIssues.length > 0) {
    throw new DataForSeoApiError(endpoint, statusIssues.map((issue) => issue.hint).join(' '), {
      response: json,
      status: response.status,
      rateLimit,
      statusIssues,
    });
  }

  return json;
}

export async function getDataForSeoUserData() {
  return dataForSeoRequest('/appendix/user_data');
}

export async function getDataForSeoServiceStatus(options = {}) {
  return dataForSeoRequest('/appendix/status', undefined, options);
}

export async function getDataForSeoLabsStatus(options = {}) {
  return dataForSeoRequest('/dataforseo_labs/status', undefined, options);
}

export function summarizeDataForSeoServiceStatus(response) {
  const services = response?.tasks?.[0]?.result ?? [];

  return {
    generatedAt: new Date().toISOString(),
    statusCode: response?.status_code ?? null,
    statusMessage: response?.status_message ?? '',
    rateLimit: response?.rateLimit ?? null,
    services: services.map((service) => ({
      api: service.api,
      status: service.status,
      endpoints: service.endpoints ?? [],
    })),
  };
}

export function findDataForSeoService(summary, apiName) {
  return summary.services.find((service) => service.api === apiName);
}

export function summarizeDataForSeoLabsStatus(response) {
  const result = response?.tasks?.[0]?.result?.[0] ?? {};

  return {
    generatedAt: new Date().toISOString(),
    statusCode: response?.status_code ?? null,
    statusMessage: response?.status_message ?? '',
    rateLimit: response?.rateLimit ?? null,
    searchEngines: result,
  };
}

export function summarizeDataForSeoUserData(response) {
  const result = response?.tasks?.[0]?.result?.[0] ?? {};
  const money = result.money ?? {};

  return {
    login: result.login,
    timezone: result.timezone,
    balance: Number(money.balance ?? 0),
    total: Number(money.total ?? 0),
    currency: money.currency ?? 'USD',
    backlinksSubscriptionExpiry: result.backlinks_subscription_expiry_date ?? null,
    llmMentionsSubscriptionExpiry: result.llm_mentions_subscription_expiry_date ?? null,
    rateLimit: response?.rateLimit ?? null,
  };
}
