import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { listHostingerWebsites, summarizeCollection } from './lib/hostinger-api.mjs';

const outputPath = resolve('output/hostinger/websites.json');

function write(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value);
}

function slimWebsite(item) {
  return {
    id: item.id ?? item.uuid ?? null,
    domain: item.domain ?? item.website ?? item.name ?? '',
    status: item.status ?? item.state ?? '',
    username: item.username ?? '',
    type: item.type ?? item.plan ?? '',
  };
}

async function main() {
  const response = await listHostingerWebsites();
  const websites = summarizeCollection(response).map(slimWebsite);
  const report = {
    generatedAt: new Date().toISOString(),
    count: websites.length,
    websites,
    rateLimit: response.rateLimit,
  };

  write(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Hostinger websites: ${websites.length}`);
  for (const website of websites.slice(0, 20)) {
    console.log(`- ${website.domain || website.id || 'unknown'}${website.status ? ` (${website.status})` : ''}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
