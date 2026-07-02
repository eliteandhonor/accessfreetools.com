import { mkdirSync, writeFileSync } from 'node:fs';
import { hostingerRequest, listHostingerWebsites, summarizeCollection } from './lib/hostinger-api.mjs';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run') || process.env.npm_config_dry_run === 'true';
const domain = process.env.HOSTINGER_DOMAIN || 'accessfreetools.com';
const pollDelayMs = Number(process.env.HOSTINGER_DEPLOY_POLL_MS || 10000);
const settleDelayMs = Number(process.env.HOSTINGER_DEPLOY_SETTLE_MS || 20000);
const maxPolls = Number(process.env.HOSTINGER_DEPLOY_MAX_POLLS || 36);
const nodeVersion = Number(process.env.HOSTINGER_NODE_VERSION || process.env.npm_config_node_version || 22);

if (!Number.isInteger(nodeVersion) || ![18, 20, 22, 24].includes(nodeVersion)) {
  throw new Error(`Unsupported Hostinger Node version: ${nodeVersion}. Expected one of 18, 20, 22, or 24.`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function findWebsite(websites) {
  return websites.find((website) => website?.domain === domain || website?.website === domain || website?.name === domain);
}

function buildState(build) {
  return String(build?.state || build?.status || '').toLowerCase();
}

function buildEntry(build) {
  return build?.options?.entry_file ?? null;
}

function isTerminalState(state) {
  return ['completed', 'finished', 'success', 'succeeded', 'failed', 'error', 'cancelled', 'canceled'].includes(state);
}

function isSuccessfulState(state) {
  return ['completed', 'finished', 'success', 'succeeded'].includes(state);
}

function buildLine(build) {
  return `${build?.uuid ?? 'unknown'}:${buildState(build) || 'unknown'}:entry=${buildEntry(build) ?? 'null'}`;
}

const websitesResponse = await listHostingerWebsites({ page: 1, perPage: 100 });
const website = findWebsite(summarizeCollection(websitesResponse));

if (!website?.username) {
  throw new Error(`Could not find Hostinger website username for ${domain}.`);
}

const buildOptions = {
  node_version: nodeVersion,
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

  async function listBuilds() {
    const response = await hostingerRequest(`${endpoint}?page=1&per_page=10`);
    return summarizeCollection(response);
  }

  async function startBuild(reason) {
    const response = await hostingerRequest(endpoint, { method: 'POST', body: buildOptions });
    console.log(
      [
        `Hostinger Node deploy ${reason} for ${domain}.`,
        `Build UUID: ${response.data?.uuid ?? 'unknown'}`,
        `State: ${response.data?.state ?? 'unknown'}`,
        'Expected runtime: Astro Node server, entry file app.js, output directory dist.',
      ].join('\n'),
    );
    return response;
  }

  async function waitForBuild(uuid) {
    for (let poll = 0; poll < maxPolls; poll += 1) {
      const builds = await listBuilds();
      const target = builds.find((build) => build?.uuid === uuid);
      const state = buildState(target);
      console.log(`Hostinger deploy poll ${poll + 1}/${maxPolls}: ${buildLine(target)}`);

      if (target && isTerminalState(state)) return target;
      await sleep(pollDelayMs);
    }

    throw new Error(`Timed out waiting for Hostinger build ${uuid} to finish.`);
  }

  const response = await startBuild('started');
  const completedBuild = await waitForBuild(response.data?.uuid);
  const completedState = buildState(completedBuild);

  if (!isSuccessfulState(completedState)) {
    throw new Error(`Hostinger build ${completedBuild?.uuid ?? response.data?.uuid ?? 'unknown'} ended as ${completedState}.`);
  }

  await sleep(settleDelayMs);
  const latestBuilds = await listBuilds();
  const latest = latestBuilds[0];
  const latestEntry = buildEntry(latest);

  if (latest?.uuid !== completedBuild?.uuid || latestEntry !== 'app.js') {
    console.log(
      [
        `Hostinger latest build after settle: ${buildLine(latest)}`,
        'Starting one final app.js build so API, Ask, MCP, and admin report routes stay on the Node runtime.',
      ].join('\n'),
    );
    const retryResponse = await startBuild('retry started');
    const retryBuild = await waitForBuild(retryResponse.data?.uuid);
    const retryState = buildState(retryBuild);

    if (!isSuccessfulState(retryState) || buildEntry(retryBuild) !== 'app.js') {
      throw new Error(`Hostinger retry build did not finish as app.js Node runtime: ${buildLine(retryBuild)}.`);
    }
  }

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
}
