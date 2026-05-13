import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import {
  HostingerApiError,
  listHostingerDomains,
  listHostingerOrders,
  listHostingerWebsites,
  readHostingerLocalEnv,
  summarizeCollection,
} from './lib/hostinger-api.mjs';

const outputJsonPath = resolve('output/hostinger/status.json');
const outputMarkdownPath = resolve('output/hostinger/status.md');

function write(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value);
}

function itemName(item) {
  return item.domain || item.website || item.name || item.order_id || item.id || item.uuid || 'unknown';
}

function summarizeList(response) {
  const items = summarizeCollection(response);
  return {
    ok: true,
    endpoint: response.endpoint,
    count: items.length,
    names: items.slice(0, 10).map(itemName),
    rateLimit: response.rateLimit,
  };
}

function errorSummary(error) {
  return {
    ok: false,
    message: error instanceof Error ? error.message : String(error),
    status: error instanceof HostingerApiError ? error.status : null,
    correlationId: error instanceof HostingerApiError ? error.correlationId : null,
    rateLimit: error instanceof HostingerApiError ? error.rateLimit : null,
  };
}

async function capture(label, fn) {
  try {
    return [label, summarizeList(await fn())];
  } catch (error) {
    return [label, errorSummary(error)];
  }
}

function markdown(report) {
  const lines = [
    '# Hostinger Status',
    '',
    `Generated: ${report.generatedAt}`,
    `Status: ${report.status}`,
    `Local token file: ${report.localTokenFile ? 'present' : 'missing'}`,
    '',
    '## Read-only Checks',
    '',
  ];

  for (const [label, result] of Object.entries(report.checks)) {
    lines.push(`- ${label}: ${result.ok ? `ok (${result.count} item${result.count === 1 ? '' : 's'})` : `blocked (${result.message})`}`);
  }

  lines.push('', '## Safety Rule', '');
  lines.push('- This report is read-only. DNS, billing, VPS, and deployment writes still require explicit approval.');

  return `${lines.join('\n')}\n`;
}

async function main() {
  const entries = await Promise.all([
    capture('websites', listHostingerWebsites),
    capture('orders', listHostingerOrders),
    capture('domains', listHostingerDomains),
  ]);
  const checks = Object.fromEntries(entries);
  const status = Object.values(checks).some((check) => check.ok) ? 'ok' : 'attention';
  const report = {
    generatedAt: new Date().toISOString(),
    status,
    localTokenFile: Boolean(readHostingerLocalEnv().HOSTINGER_API_TOKEN),
    checks,
  };

  write(outputJsonPath, `${JSON.stringify(report, null, 2)}\n`);
  write(outputMarkdownPath, markdown(report));
  console.log(markdown(report));

  if (status !== 'ok') process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
