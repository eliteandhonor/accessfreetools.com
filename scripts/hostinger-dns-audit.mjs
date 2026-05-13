import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { getHostingerDnsRecords, summarizeCollection } from './lib/hostinger-api.mjs';

const domain =
  process.argv.find((argument) => argument.startsWith('--domain='))?.split('=')[1] ||
  process.env.HOSTINGER_DOMAIN ||
  'accessfreetools.com';
const outputJsonPath = resolve('output/hostinger/dns-audit.json');
const outputMarkdownPath = resolve('output/hostinger/dns-audit.md');

function write(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value);
}

function recordType(record) {
  return String(record.type ?? record.record_type ?? record.name ?? 'UNKNOWN').toUpperCase();
}

function recordName(record) {
  return record.name ?? record.host ?? record.hostname ?? '@';
}

function markdown(report) {
  const lines = [
    '# Hostinger DNS Audit',
    '',
    `Generated: ${report.generatedAt}`,
    `Domain: ${report.domain}`,
    `Records: ${report.count}`,
    '',
    '## Record Types',
    '',
    ...Object.entries(report.byType).map(([type, count]) => `- ${type}: ${count}`),
    '',
    '## Important Hosts',
    '',
    ...report.importantHosts.map((item) => `- ${item.name}: ${item.types.join(', ')}`),
    '',
    '## Safety Rule',
    '',
    '- This command reads DNS records only. DNS updates, resets, restores, and deletes require explicit approval.',
  ];

  return `${lines.join('\n')}\n`;
}

async function main() {
  const response = await getHostingerDnsRecords(domain);
  const records = summarizeCollection(response);
  const byType = {};
  const hosts = new Map();

  for (const record of records) {
    const type = recordType(record);
    const name = recordName(record);
    byType[type] = (byType[type] ?? 0) + 1;
    const current = hosts.get(name) ?? new Set();
    current.add(type);
    hosts.set(name, current);
  }

  const importantHosts = [...hosts.entries()]
    .filter(([name]) => ['@', 'www', domain].includes(name) || String(name).includes('google') || String(name).includes('bing'))
    .map(([name, types]) => ({ name, types: [...types].sort() }))
    .slice(0, 20);
  const report = {
    generatedAt: new Date().toISOString(),
    domain,
    count: records.length,
    byType,
    importantHosts,
    rateLimit: response.rateLimit,
  };

  write(outputJsonPath, `${JSON.stringify(report, null, 2)}\n`);
  write(outputMarkdownPath, markdown(report));
  console.log(markdown(report));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
