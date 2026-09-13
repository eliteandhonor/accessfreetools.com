import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { allPromotionChannelsPassed, PINTEREST_PROOF_SCRIPT, summarizePinterestProofEvidence, summarizePromotionChannels } from './lib/promotion-channel-evidence.mjs';

import {
  activePromotionChannels,
  activePromotionReviewSteps,
  promotionChannels,
} from './lib/promotion-channel-policy.mjs';

const DEFAULT_JSON_PATH = resolve('output', 'promotion', 'four-channel-review.json');
const DEFAULT_MD_PATH = resolve('output', 'promotion', 'four-channel-review.md');

function npmRun(script) {
  const command = `npm run ${script}`;
  const startedAt = new Date().toISOString();
  const result = spawnSync('cmd.exe', ['/d', '/s', '/c', command], {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: 'pipe',
    timeout: 15 * 60 * 1000,
  });

  let evidence;
  if (script === PINTEREST_PROOF_SCRIPT) {
    let scan = null;
    try { scan = JSON.parse(readFileSync(resolve('output/promotion/pinterest-public-proof-scan.json'), 'utf8')); } catch { /* Missing output is not proof. */ }
    evidence = summarizePinterestProofEvidence(scan);
  }
  return {
    script,
    command,
    status: result.status ?? 1,
    passed: result.status === 0,
    startedAt,
    completedAt: new Date().toISOString(),
    ...(evidence ? { evidence } : {}),
    stdout: String(result.stdout ?? '').trim().slice(-4000),
    stderr: String(result.stderr ?? '').trim().slice(-4000),
  };
}

function writeReport(report, jsonPath = DEFAULT_JSON_PATH, mdPath = DEFAULT_MD_PATH) {
  mkdirSync(dirname(jsonPath), { recursive: true });
  mkdirSync(dirname(mdPath), { recursive: true });
  writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);

  const lines = [
    '# Four-Channel Promotion Review',
    '',
    `Generated: ${report.generatedAt}`,
    `Status: ${report.status}`,
    '',
    '## Active Channels',
    '',
    ...report.activeChannels.map((channel) => `- ${channel.label}`),
    '',
    '## Channel Evidence',
    '',
    ...report.channels.map((channel) => `- ${channel.label}: ${channel.status} (${channel.passed}/${channel.total} commands passed; ${channel.missing} missing, ${channel.stale} stale)`),
    ...report.channels.flatMap((channel) => channel.issues.map((issue) => `- ${channel.label}: ${issue}`)),
    '',
    'Passing commands do not approve public posting, source claims, or owner experience.',
    '',
    '## Inactive Channels',
    '',
    ...report.inactiveChannels.map((channel) => `- ${channel.label}: ${channel.status}`),
    '',
    '## Checks',
    '',
    ...report.results.map((result) => `- ${result.passed === null ? 'NOT RUN' : result.passed ? 'PASS' : 'FAIL'} ${result.command}`),
    '',
  ];
  writeFileSync(mdPath, `${lines.join('\n')}\n`);
}

export function buildReviewPlan() {
  return activePromotionReviewSteps();
}

export function runFourChannelReview({ dryRun = false } = {}) {
  const steps = buildReviewPlan();
  const results = dryRun
    ? steps.map((step) => ({ ...step, command: `npm run ${step.script}`, status: null, passed: null }))
    : steps.map((step) => ({ ...step, ...npmRun(step.script) }));
  const report = {
    generatedAt: new Date().toISOString(),
    dryRun,
    activeChannels: activePromotionChannels.map(({ id, label, status }) => ({ id, label, status })),
    inactiveChannels: promotionChannels
      .filter((channel) => channel.status !== 'active')
      .map(({ id, label, status }) => ({ id, label, status })),
    results,
  };
  report.channels = summarizePromotionChannels(report);
  report.status = dryRun ? 'dry-run' : allPromotionChannelsPassed(report.channels) ? 'passed' : 'failed';

  writeReport(report);
  return report;
}

function main() {
  const dryRun = process.argv.includes('--dry-run');
  const report = runFourChannelReview({ dryRun });
  console.log(`Four-channel promotion review: ${report.status}`);
  console.log(`Report: ${DEFAULT_MD_PATH}`);
  if (report.status === 'failed') process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main();
}
