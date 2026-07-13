import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import {
  HostingerApiError,
  listHostingerDomains,
  listHostingerNodeBuilds,
  listHostingerOrders,
  listHostingerWebsites,
  readHostingerLocalEnv,
  summarizeCollection,
} from './lib/hostinger-api.mjs';
import { summarizeHostingerNodeRuntime } from './lib/hostinger-build-status.mjs';

const outputJsonPath = resolve('output/hostinger/status.json');
const outputMarkdownPath = resolve('output/hostinger/status.md');
const domain = process.env.HOSTINGER_DOMAIN || 'accessfreetools.com';

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

async function capture(label, fn, summarize = summarizeList) {
  try {
    return [label, summarize(await fn())];
  } catch (error) {
    return [label, errorSummary(error)];
  }
}

async function captureResponse(fn) {
  try {
    const response = await fn();
    return { response, summary: summarizeList(response) };
  } catch (error) {
    return { response: null, summary: errorSummary(error) };
  }
}

function findWebsite(items) {
  return items.find((item) => item?.domain === domain || item?.website === domain || item?.name === domain);
}

function checkLine(label, result) {
  if (result.ok && result.description) return `- ${label}: ok (${result.description})`;
  if (result.ok) return `- ${label}: ok (${result.count} item${result.count === 1 ? '' : 's'})`;
  return `- ${label}: attention (${result.message})`;
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
    lines.push(checkLine(label, result));
  }

  lines.push('', '## Safety Rule', '');
  lines.push('- This report is read-only. DNS, billing, VPS, and deployment writes still require explicit approval.');

  return `${lines.join('\n')}\n`;
}

async function main() {
  const websitesCapture = await captureResponse(() => listHostingerWebsites({ page: 1, perPage: 100 }));
  const website = findWebsite(websitesCapture.response ? summarizeCollection(websitesCapture.response) : []);
  const runtimeEntry = website?.username
    ? await capture(
        'nodeRuntime',
        () => listHostingerNodeBuilds(website.username, domain, { page: 1, perPage: 10 }),
        (response) => summarizeHostingerNodeRuntime(summarizeCollection(response), { endpoint: response.endpoint }),
      )
    : [
        'nodeRuntime',
        {
          ok: false,
          count: 0,
          message: `not enough data: ${domain} was not found in the Hostinger website list`,
        },
      ];
  const entries = await Promise.all([
    capture('orders', listHostingerOrders),
    capture('domains', listHostingerDomains),
  ]);
  const checks = Object.fromEntries([['websites', websitesCapture.summary], ...entries, runtimeEntry]);
  const baseStatusOk = ['websites', 'orders', 'domains'].some((label) => checks[label]?.ok);
  const status = baseStatusOk && checks.nodeRuntime?.ok ? 'ok' : 'attention';
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
