import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

import {
  activePromotionChannels,
  activePromotionReviewSteps,
  promotionChannels,
} from './lib/promotion-channel-policy.mjs';

const DEFAULT_JSON_PATH = resolve('output', 'promotion', 'four-channel-review.json');
const DEFAULT_MD_PATH = resolve('output', 'promotion', 'four-channel-review.md');

function npmRun(script) {
  const command = `npm run ${script}`;
  const result = spawnSync('cmd.exe', ['/d', '/s', '/c', command], {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: 'pipe',
  });

  return {
    script,
    command,
    status: result.status ?? 1,
    passed: result.status === 0,
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
    '## Inactive Channels',
    '',
    ...report.inactiveChannels.map((channel) => `- ${channel.label}: ${channel.status}`),
    '',
    '## Checks',
    '',
    ...report.results.map((result) => `- ${result.passed ? 'PASS' : 'FAIL'} ${result.command}`),
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
  const failed = results.filter((result) => result.passed === false);
  const report = {
    generatedAt: new Date().toISOString(),
    dryRun,
    status: dryRun ? 'dry-run' : failed.length ? 'failed' : 'passed',
    activeChannels: activePromotionChannels.map(({ id, label, status }) => ({ id, label, status })),
    inactiveChannels: promotionChannels
      .filter((channel) => channel.status !== 'active')
      .map(({ id, label, status }) => ({ id, label, status })),
    results,
  };

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
