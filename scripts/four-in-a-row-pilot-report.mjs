import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { getAnalyticsCoverage } from './lib/production-analytics-report.mjs';

import {
  analyzeFourInARowPilot,
  isGameOwnerExclusionConfirmed,
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

const performance = readJson(GSC_PATH, {});
const gscPage = performance?.pages?.find((page) => page.page === GAME_URL || page.url === GAME_URL) ?? null;
const productionAnalytics = readJson(PRODUCTION_ANALYTICS_PATH);
const now = new Date();
const report = analyzeFourInARowPilot({
  now,
  aggregate: productionAnalytics?.summary
    ? {
        actions: productionAnalytics.summary.selectedToolActions ?? [],
        audience: productionAnalytics.summary.selectedToolAudience ?? null,
        coverage: getAnalyticsCoverage(productionAnalytics.summary),
        generatedAt: productionAnalytics.summary.generatedAt ?? null,
        rangeStart: productionAnalytics.summary.rangeStart ?? null,
        source: productionAnalytics.source ?? null,
        toolSlug: productionAnalytics.toolSlug ?? null,
      }
    : null,
  gscPage,
  ownerExclusionConfigured: isGameOwnerExclusionConfirmed(
    productionAnalytics?.summary, readJson(OWNER_BROWSER_PROOF_PATH), now,
  ),
});

mkdirSync(dirname(JSON_PATH), { recursive: true });
writeFileSync(JSON_PATH, `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(MARKDOWN_PATH, renderFourInARowPilotReport(report));

console.log(renderFourInARowPilotReport(report));
console.log(`Saved JSON: ${JSON_PATH}`);
console.log(`Saved Markdown: ${MARKDOWN_PATH}`);
