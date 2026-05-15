import { mkdirSync, writeFileSync } from 'node:fs';
import { hostingerRequest, listHostingerWebsites, summarizeCollection } from './lib/hostinger-api.mjs';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run') || process.env.npm_config_dry_run === 'true';
const domain = process.env.HOSTINGER_DOMAIN || 'accessfreetools.com';

function findWebsite(websites) {
  return websites.find((website) => website?.domain === domain || website?.website === domain || website?.name === domain);
}

const websitesResponse = await listHostingerWebsites({ page: 1, perPage: 100 });
const website = findWebsite(summarizeCollection(websitesResponse));

if (!website?.username) {
  throw new Error(`Could not find Hostinger website username for ${domain}.`);
}

const buildOptions = {
  node_version: 22,
  app_type: 'astro',
  root_directory: null,
  output_directory: 'dist',
  build_script: 'build',
  entry_file: 'app.js',
  package_manager: 'npm',
  source_type: 'git',
};

const report = {
  domain,
  username: website.username,
  dryRun,
  buildOptions,
  requestedAt: new Date().toISOString(),
};

mkdirSync('output/hostinger', { recursive: true });

if (dryRun) {
  writeFileSync('output/hostinger/node-deploy-request.json', JSON.stringify(report, null, 2));
  console.log(`Hostinger Node deploy dry run ready for ${domain}; entry file would be app.js.`);
} else {
  const endpoint = `/api/hosting/v1/accounts/${encodeURIComponent(website.username)}/websites/${encodeURIComponent(
    domain,
  )}/nodejs/builds`;
  const response = await hostingerRequest(endpoint, { method: 'POST', body: buildOptions });

  writeFileSync(
    'output/hostinger/node-deploy-request.json',
    JSON.stringify(
      {
        ...report,
        response: {
          status: response.status,
          data: response.data,
        },
      },
      null,
      2,
    ),
  );

  console.log(
    [
      `Hostinger Node deploy started for ${domain}.`,
      `Build UUID: ${response.data?.uuid ?? 'unknown'}`,
      `State: ${response.data?.state ?? 'unknown'}`,
      'Expected runtime: Astro Node server, entry file app.js, output directory dist.',
    ].join('\n'),
  );
}
