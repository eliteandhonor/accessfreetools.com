import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  renderCampaignVerificationMarkdown,
  verifyCampaignWorkspace,
} from './lib/tts-feature-campaign.mjs';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const campaignRelativePath = join(
  'agents',
  'tts-audiobook',
  'campaigns',
  '2026-08-18-browser-audiobook-features',
);
const outputDir = join(rootDir, 'output', 'agent-campaigns', 'tts-feature-campaign');

const report = {
  generatedAt: new Date().toISOString(),
  ...verifyCampaignWorkspace({ rootDir, campaignRelativePath }),
};

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, 'latest.json'), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(join(outputDir, 'latest.md'), renderCampaignVerificationMarkdown(report));

console.log(`TTS feature campaign: ${report.status.toUpperCase()}`);
console.log(`Agents: ${report.summary.agents}`);
console.log(`Tasks: ${report.summary.tasks}`);
console.log(`Approved feature tasks: ${report.summary.approvedTasks}`);
console.log(`Report: ${join(outputDir, 'latest.md')}`);

if (report.errors.length) {
  for (const error of report.errors) console.error(`- ${error}`);
  process.exitCode = 1;
}
