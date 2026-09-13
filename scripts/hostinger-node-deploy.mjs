import { mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { hostingerRequest, listHostingerWebsites, summarizeCollection } from './lib/hostinger-api.mjs';
import { resolveHostingerNodeVersion } from './lib/hostinger-deploy-config.mjs';
import { summarizeHostingerNodeRuntime } from './lib/hostinger-build-status.mjs';
import { captureReleaseSource, readReleaseReceipt, verifyReleaseReceipt, verifyRemoteReleaseSource,
  fetchDeployedIdentity, verifyDeployedIdentity } from './lib/release-identity.mjs';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run') || process.env.npm_config_dry_run === 'true';
const domain = process.env.HOSTINGER_DOMAIN || 'accessfreetools.com';
const pollDelayMs = Number(process.env.HOSTINGER_DEPLOY_POLL_MS || 10000);
const settleDelayMs = Number(process.env.HOSTINGER_DEPLOY_SETTLE_MS || 20000);
const maxPolls = Number(process.env.HOSTINGER_DEPLOY_MAX_POLLS || 36);
const nodeVersion = resolveHostingerNodeVersion();
const testedReceipt = readReleaseReceipt();
const testedSource = captureReleaseSource();
const testProof = verifyReleaseReceipt(testedReceipt, testedSource);

function assertReleaseReady() {
  const current = captureReleaseSource();
  const local = verifyReleaseReceipt(testedReceipt, current);
  if (!local.ok) throw new Error(`Deployment stopped before writing: ${local.message}.`);
  let remote;
  try {
    remote = execFileSync('git', ['ls-remote', '--exit-code', 'origin', 'refs/heads/main'], {
      encoding: 'utf8', timeout: 20000, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true,
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
    });
  } catch { throw new Error('Deployment stopped: current origin main could not be verified.'); }
  const remoteProof = verifyRemoteReleaseSource(current.commit, remote);
  if (!remoteProof.ok) throw new Error(`Deployment stopped: ${remoteProof.message}.`);
}

if (!dryRun) assertReleaseReady();

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
  testProof,
  testedCommit: testedSource.commit,
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
    assertReleaseReady();
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
  report.requestedBuild = { uuid: response.data?.uuid ?? null, state: response.data?.state ?? null };
  report.status = 'pending-verification';
  writeFileSync('output/hostinger/node-deploy-request.json', `${JSON.stringify(report, null, 2)}\n`);
  const completedBuild = await waitForBuild(response.data?.uuid);
  const completedState = buildState(completedBuild);

  if (!isSuccessfulState(completedState)) {
    throw new Error(`Hostinger build ${completedBuild?.uuid ?? response.data?.uuid ?? 'unknown'} ended as ${completedState}.`);
  }

  await sleep(settleDelayMs);
  const latestBuilds = await listBuilds();
  const latest = latestBuilds[0];
  const runtimeProof = summarizeHostingerNodeRuntime(latestBuilds);
  if (latest?.uuid !== completedBuild?.uuid || !runtimeProof.ok) {
    throw new Error(`Deployment verification stopped: the latest build changed or has the wrong runtime (${buildLine(latest)}). No automatic redeploy was requested.`);
  }
  assertReleaseReady();
  const releaseProof = verifyDeployedIdentity(await fetchDeployedIdentity(domain), testedReceipt, captureReleaseSource());
  if (!releaseProof.ok) throw new Error(`Deployment remains unverified: ${releaseProof.message}.`);

  writeFileSync(
    'output/hostinger/node-deploy-request.json',
    JSON.stringify(
      {
        ...report,
        status: 'verified',
        runtimeProof,
        releaseProof,
      },
      null,
      2,
    ),
  );
}
