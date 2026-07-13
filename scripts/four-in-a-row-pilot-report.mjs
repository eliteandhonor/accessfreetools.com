import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import {
  analyzeFourInARowPilot,
  renderFourInARowPilotReport,
} from './lib/four-in-a-row-pilot-report.mjs';

const GSC_PATH = resolve('output/search-console/performance-latest.json');
const PRODUCTION_ANALYTICS_PATH = resolve('output/analytics/production-four-in-a-row-game-latest.json');
const OWNER_BROWSER_PROOF_PATH = resolve('.local/analytics-owner-exclusion.json');
const JSON_PATH = resolve('output/game-pilot/four-in-a-row-latest.json');
const MARKDOWN_PATH = resolve('output/game-pilot/four-in-a-row-latest.md');
const GAME_URL = 'https://accessfreetools.com/tools/four-in-a-row-game/';

function readJson(path, fallback = null) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return fallback;
  }
}

function hasOwnerExclusion() {
  if (process.env.AFT_ANALYTICS_EXCLUDE_IPS) return true;
  const candidates = [
    process.env.AFT_ANALYTICS_CONFIG,
    '.local/analytics-dashboard.env',
    '.local/accessfreetools-analytics.env',
  ].filter(Boolean).map((path) => resolve(path));
  if (candidates.some((path) => existsSync(path) && /AFT_ANALYTICS_EXCLUDE_IPS\s*=\s*[^#\r\n]+/i.test(readFileSync(path, 'utf8')))) {
    return true;
  }

  const proof = readJson(OWNER_BROWSER_PROOF_PATH);
  return Boolean(
    proof?.host === 'accessfreetools.com' &&
      proof?.storageKey === 'access-free-tools-analytics-opt-out' &&
      proof?.value === 'true' &&
      proof?.verifiedAt,
  );
}

const performance = readJson(GSC_PATH, {});
const gscPage = performance?.pages?.find((page) => page.page === GAME_URL || page.url === GAME_URL) ?? null;
const productionAnalytics = readJson(PRODUCTION_ANALYTICS_PATH);
const report = analyzeFourInARowPilot({
  aggregate: productionAnalytics?.summary
    ? {
        actions: productionAnalytics.summary.selectedToolActions ?? [],
        audience: productionAnalytics.summary.selectedToolAudience ?? null,
      }
    : null,
  gscPage,
  ownerExclusionConfigured: hasOwnerExclusion(),
});

mkdirSync(dirname(JSON_PATH), { recursive: true });
writeFileSync(JSON_PATH, `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(MARKDOWN_PATH, renderFourInARowPilotReport(report));

console.log(renderFourInARowPilotReport(report));
console.log(`Saved JSON: ${JSON_PATH}`);
console.log(`Saved Markdown: ${MARKDOWN_PATH}`);
