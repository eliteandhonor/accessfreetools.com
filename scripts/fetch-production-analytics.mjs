import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { createProductionAnalyticsReport } from './lib/production-analytics-report.mjs';

const ORIGIN = 'https://accessfreetools.com';
const args = process.argv.slice(2);
const option = (name, fallback = '') =>
  args.find((arg) => arg.startsWith(`${name}=`))?.slice(name.length + 1) ?? fallback;
const toolSlug = option('--tool');
const days = Number(option('--days', '30'));

if (!Number.isInteger(days) || days < 1 || days > 365) {
  throw new Error('--days must be an integer from 1 to 365.');
}
if (toolSlug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(toolSlug)) {
  throw new Error('--tool must be a lowercase canonical tool slug.');
}

const OUTPUT_PATH = resolve(
  'output/analytics',
  toolSlug ? `production-${toolSlug}-latest.json` : 'production-latest.json',
);

function parseEnvFile(path) {
  if (!existsSync(path)) return {};
  const values = {};

  for (const rawLine of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || !line.includes('=')) continue;
    const [rawKey, ...rawValue] = line.split('=');
    const key = rawKey.trim();
    let value = rawValue.join('=').trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }

  return values;
}

function analyticsToken() {
  if (process.env.AFT_ANALYTICS_TOKEN) return process.env.AFT_ANALYTICS_TOKEN;
  if (process.env.ADMIN_ANALYTICS_TOKEN) return process.env.ADMIN_ANALYTICS_TOKEN;

  for (const path of [
    process.env.AFT_ANALYTICS_CONFIG,
    '.local/analytics-dashboard.env',
    '.local/accessfreetools-analytics.env',
  ].filter(Boolean)) {
    const values = parseEnvFile(resolve(path));
    const token = values.AFT_ANALYTICS_TOKEN || values.ADMIN_ANALYTICS_TOKEN;
    if (token) return token;
  }

  return '';
}

const token = analyticsToken();
if (!token) {
  throw new Error(
    'Production analytics token is unavailable. Set AFT_ANALYTICS_TOKEN or add it to an ignored .local analytics env file.',
  );
}

const searchParams = new URLSearchParams({ days: String(days) });
if (toolSlug) searchParams.set('tool', toolSlug);
const url = `${ORIGIN}/api/analytics/events?${searchParams}`;
const response = await fetch(url, {
  headers: {
    accept: 'application/json',
    'user-agent': 'AccessFreeTools-Production-Analytics/1.0',
    'x-aft-analytics-token': token,
  },
});
const body = await response.json().catch(() => null);

if (!response.ok || !body?.ok || !body?.summary) {
  throw new Error(`Production analytics request failed with HTTP ${response.status}.`);
}

const report = createProductionAnalyticsReport({
  days,
  generatedAt: new Date().toISOString(),
  source: url,
  summary: body.summary,
  toolSlug: toolSlug || null,
});

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Saved privacy-safe production analytics to ${OUTPUT_PATH}`);
