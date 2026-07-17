import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import {
  createIndexingRecommendation,
  createPinterestCatalogRecommendation,
} from './lib/marketing-orchestrator-recommendation.mjs';

const outputDir = resolve('output', 'marketing-orchestrator');
const jsonPath = resolve(outputDir, 'daily-plan.json');
const mdPath = resolve(outputDir, 'daily-plan.md');

const evidencePaths = {
  brandCode: 'docs/brand-code.md',
  recommendedAgents: 'docs/recommended-agency-agents.md',
  automationPlan: 'docs/automation-operating-plan.md',
  promotionQueue: 'docs/promotion-queue.md',
  seoEvaluation: 'output/seo-agent-self-evaluation.json',
  searchConsoleInspection: 'output/search-console-url-inspection.json',
  searchConsoleDiscovery: 'output/search-console-discovery.json',
  linkHelper: 'output/agent-tools/link-helper/latest.json',
  dataForSeoAccount: 'output/dataforseo-account.json',
  dataForSeoStatus: 'output/dataforseo-status.json',
  pinterestRss: 'output/promotion/pinterest-rss-report.json',
  mediumQuality: 'output/promotion/medium-quality-report.json',
  redditQuality: 'output/promotion/reddit-quality-report.json',
  blueskyQuality: 'output/promotion/bluesky/bluesky-quality-report.json',
  quoraQuality: 'output/promotion/quora-quality-report.json',
  devtoQuality: 'output/promotion/devto/devto-quality-report.json',
  recognitionTracker: 'output/recognition-tracker/latest.json',
  originalDataAssets: 'output/original-data-assets/latest.json',
};

function readText(relativePath) {
  const path = resolve(relativePath);
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function readJson(relativePath) {
  const text = readText(relativePath);
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (error) {
    return {
      parseError: error instanceof Error ? error.message : String(error),
    };
  }
}

function writeText(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value);
}

function asEvidence(key, path, value) {
  return {
    key,
    path,
    present: Boolean(value),
    parseError: value?.parseError ?? '',
  };
}

function parseActiveAutomationRows(markdown) {
  const activeSection = markdown.split('## Active 10am Automations')[1]?.split('## Paused Or Removed Automations')[0] ?? '';
  return activeSection
    .split('\n')
    .filter((line) => line.trim().startsWith('|') && !line.includes('---'))
    .slice(1)
    .map((line) => line.split('|').map((cell) => cell.trim()).filter(Boolean))
    .filter((cells) => cells.length >= 4)
    .map(([automation, cadence, purpose, safeLimits]) => ({
      automation,
      cadence,
      purpose,
      safeLimits,
    }));
}

function parseQueueRows(markdown) {
  return markdown
    .split('\n')
    .filter((line) => line.trim().startsWith('|') && !line.includes('---'))
    .map((line) => line.split('|').map((cell) => cell.trim()).filter(Boolean))
    .filter((cells) => cells.length >= 6 && cells[0] !== 'Priority')
    .map((cells) => ({
      priority: cells[0],
      page: cells[1],
      angle: cells[2],
      channel: cells[3],
      status: cells[4],
      nextAction: cells.slice(5).join(' | '),
    }));
}

function qualitySummary(report, label) {
  if (!report) {
    return {
      label,
      status: 'missing',
      passed: 0,
      total: 0,
      failed: 0,
      issues: ['Report not found. Run the platform quality command before public work.'],
    };
  }

  if (report.parseError) {
    return {
      label,
      status: 'parse-error',
      passed: 0,
      total: 0,
      failed: 1,
      issues: [report.parseError],
    };
  }

  const totals = report.totals ?? {};
  const total = Number(totals.drafts ?? totals.files ?? report.results?.length ?? 0);
  const errors = Number(totals.errors ?? totals.failed ?? 0);
  const warnings = Number(totals.warnings ?? 0);
  const passed = Number(totals.passed ?? (errors === 0 ? total : Math.max(0, total - errors)));
  const results = Array.isArray(report.results) ? report.results : [];
  const issues = results
    .flatMap((result) => [
      ...(Array.isArray(result.errors) ? result.errors : []),
      ...(Array.isArray(result.issues) ? result.issues : []),
      ...(Array.isArray(result.warnings) ? result.warnings : []),
    ])
    .filter(Boolean)
    .slice(0, 5);

  return {
    label,
    generatedAt: report.generatedAt ?? '',
    status: errors === 0 && warnings === 0 ? 'passed' : errors > 0 ? 'failed' : 'warnings',
    passed,
    total,
    failed: errors,
    warnings,
    issues,
  };
}

function hasFreshPassingPromotionReview(qualityReports, now = new Date()) {
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  return (
    qualityReports.length >= 5 &&
    qualityReports.every((report) => {
      const generatedAt = report.generatedAt ? new Date(report.generatedAt) : null;
      return (
        report.status === 'passed' &&
        report.total > 0 &&
        generatedAt instanceof Date &&
        Number.isFinite(generatedAt.getTime()) &&
        now.getTime() - generatedAt.getTime() <= weekMs
      );
    })
  );
}

function neutralIndexingItems(seoEvaluation, inspectionReport) {
  const fromSeo = Array.isArray(seoEvaluation?.indexedSummary) ? seoEvaluation.indexedSummary : [];
  const fromInspection = Array.isArray(inspectionReport?.inspections)
    ? inspectionReport.inspections.map((item) => ({
        url: item.inspectionUrl,
        verdict: item.verdict ?? 'unknown',
        coverageState: item.coverageState ?? item.error ?? 'unknown',
        lastCrawlTime: item.lastCrawlTime ?? '',
      }))
    : [];
  const combined = fromSeo.length ? fromSeo : fromInspection;

  return combined
    .filter((item) => String(item.verdict).toUpperCase() !== 'PASS')
    .filter((item) => /unknown|not indexed|discovered|crawled/i.test(`${item.coverageState} ${item.verdict}`))
    .map((item) => ({
      url: item.url,
      state: item.coverageState,
      lastCrawlTime: item.lastCrawlTime ?? '',
    }));
}

function dataForSeoBalance(accountReport, seoEvaluation) {
  const account =
    accountReport?.account ??
    accountReport?.dataForSeo?.account ??
    seoEvaluation?.dataForSeo?.account ??
    null;

  if (!account || typeof account.balance !== 'number') {
    return null;
  }

  return {
    balance: account.balance,
    currency: account.currency ?? 'USD',
    warning: account.balance <= 10,
    stopBroadPaidResearch: account.balance <= 5,
    topUp: account.balance <= 2,
  };
}

function liveProofGaps(queueRows) {
  const riskyStatuses = new Set(['approved', 'needs approval', 'unverified', 'rss-connected']);
  return queueRows.filter((row) => riskyStatuses.has(row.status)).slice(0, 12);
}

function recommendation(priority, title, reason, action, evidence, gate, proofNeeded) {
  return {
    priority,
    title,
    reason,
    action,
    evidence,
    gate,
    proofNeeded,
  };
}

function qualityReportForChannel(channel, qualityReports) {
  const normalized = String(channel).toLowerCase();
  const label = normalized.includes('medium')
    ? 'Medium'
    : normalized.includes('reddit')
      ? 'Reddit'
      : normalized.includes('bluesky')
        ? 'Bluesky'
        : normalized.includes('quora')
          ? 'Quora'
          : normalized.includes('dev')
            ? 'DEV Community'
            : '';

  return label ? qualityReports.find((report) => report.label === label) ?? null : null;
}

function qualityEvidencePath(label) {
  if (label === 'Medium') return evidencePaths.mediumQuality;
  if (label === 'Reddit') return evidencePaths.redditQuality;
  if (label === 'Bluesky') return evidencePaths.blueskyQuality;
  if (label === 'Quora') return evidencePaths.quoraQuality;
  if (label === 'DEV Community') return evidencePaths.devtoQuality;
  return null;
}

function approvedPromotionGate(item, qualityReports) {
  const report = qualityReportForChannel(item.channel, qualityReports);

  if (!report) return 'Run or confirm the relevant platform quality report before public posting.';
  if (report.status === 'missing') return `Run the missing ${report.label} quality report first.`;
  if (report.status === 'warnings') return `Review ${report.label} quality warnings before public posting.`;
  if (report.status === 'passed') {
    return `${report.label} quality report passed (${report.passed}/${report.total}); external-browser posting still needs public proof before marking live.`;
  }

  return `${report.label} quality report must pass before public posting.`;
}

function chooseRecommendations({
  indexingGaps,
  queueRows,
  qualityReports,
  pinterestRss,
  duplicateBalanceOwnerActive,
  recognitionTracker,
  linkHelper,
}) {
  const recommendations = [];
  const failedQuality = qualityReports.find((report) => report.status === 'failed' || report.status === 'parse-error');
  const approvedQueue = queueRows.filter((row) => row.status === 'approved');
  const rssConnected = queueRows.filter((row) => row.status === 'rss-connected');
  const unverified = queueRows.filter((row) => row.status === 'unverified');

  if (duplicateBalanceOwnerActive) {
    recommendations.push(
      recommendation(
        'High',
        'Remove duplicate DataForSEO balance owner',
        'A standalone balance watcher would repeat the same warning already owned by daily, weekly, monthly, and deep audit jobs.',
        'Keep balance reporting inside the daily/weekly/monthly/deep audit lanes only.',
        ['docs/automation-operating-plan.md'],
        'Automation owner map must show only one daily SEO/promotion owner.',
        'No public proof needed; this is an internal automation routing fix.',
      ),
    );
  }

  if (failedQuality) {
    recommendations.push(
      recommendation(
        'High',
        `Fix ${failedQuality.label} quality blockers before promotion`,
        `${failedQuality.label} has failing quality evidence, so public work should pause for that channel.`,
        `Run the matching quality command and fix the first failing issue: ${failedQuality.issues[0] ?? 'see report'}.`,
        [evidencePaths[`${failedQuality.label.toLowerCase()}Quality`] ?? 'output/promotion/'],
        'Public posting blocked until the channel quality report passes.',
        'A passing quality report plus public URL/screenshot after posting.',
      ),
    );
  }

  if (!failedQuality && recognitionTracker?.totals?.claimedWithoutProof > 0) {
    recommendations.push(
      recommendation(
        'High',
        'Fix recognition proof gaps before new promotion',
        `${recognitionTracker.totals.claimedWithoutProof} claimed promotion row(s) still lack public proof in the recognition tracker.`,
        'Run `npm run aft -- recognition`, then update only rows with a visible public URL, public profile/feed proof, screenshot, or generated report.',
        ['output/recognition-tracker/latest.json', 'docs/promotion-queue.md'],
        'Do not treat drafts, submit buttons, or memory as proof.',
        'Public URL/profile proof, screenshot, or generated report evidence.',
      ),
    );
  }

  if (!failedQuality && Number(pinterestRss?.counts?.rssReadyApps ?? 0) > 0) {
    recommendations.push(createPinterestCatalogRecommendation(pinterestRss));
  }

  if (!failedQuality && indexingGaps.length) {
    const topGap = indexingGaps[0];
    recommendations.push(createIndexingRecommendation(topGap, linkHelper));
  }

  if (rssConnected.length) {
    const item = rssConnected[0];
    recommendations.push(
      recommendation(
        'Medium',
        'Verify Pinterest RSS imports that are still connected',
        `${item.page} is RSS-connected, but not yet proven as visible on a public Pinterest board.`,
        'Check the public Pinterest board/profile for the item slug. Mark it posted only if visible; otherwise keep it rss-connected.',
        ['docs/promotion-queue.md', 'output/promotion/pinterest-rss-report.json'],
        pinterestRss?.issues?.length ? 'Fix Pinterest RSS report issues before checking imports.' : 'Pinterest RSS report should stay clean.',
        'Public board/profile URL or screenshot showing the imported Pin.',
      ),
    );
  }

  if (unverified.length) {
    const item = unverified[0];
    recommendations.push(
      recommendation(
        'Medium',
        'Resolve unverified promotion status before reposting',
        `${item.page} has an unverified ${item.channel} state, so reposting blindly could create duplicates or false proof.`,
        'Open the public profile/feed. If the item is visible, record the URL. If not, keep it unverified and prepare a fresh approved attempt.',
        ['docs/promotion-queue.md'],
        'Never use submit-button success as proof.',
        'Public profile/feed URL showing the item.',
      ),
    );
  }

  if (!failedQuality && approvedQueue.length && recommendations.length < 3) {
    const item = approvedQueue[0];
    const relevantQuality = qualityReportForChannel(item.channel, qualityReports);
    const platformEvidence = relevantQuality ? qualityEvidencePath(relevantQuality.label) : null;
    recommendations.push(
      recommendation(
        'Medium',
        `Prepare one approved ${item.channel} promotion item`,
        `${item.page} is approved for ${item.channel}, and platform quality gates are currently available for review.`,
        'Use the matching platform agent and the brand code. Post only if platform cadence and user approval still match, then verify the public URL.',
        ['docs/promotion-queue.md', 'docs/brand-code.md', platformEvidence].filter(Boolean),
        approvedPromotionGate(item, qualityReports),
        'Public URL or screenshot after posting.',
      ),
    );
  }

  if (!recommendations.length && hasFreshPassingPromotionReview(qualityReports)) {
    recommendations.push(
      recommendation(
        'Monitor',
        'No urgent promotion action after weekly review',
        'The fresh weekly promotion review is already present and all platform quality reports pass.',
        'Hold promotion changes until there is a new approved public-posting task, live-proof gap, or fresh Search Console priority.',
        [
          evidencePaths.mediumQuality,
          evidencePaths.redditQuality,
          evidencePaths.blueskyQuality,
          evidencePaths.quoraQuality,
          evidencePaths.devtoQuality,
        ],
        'Do not publish or mark promotion complete without public URL, profile/feed proof, or screenshot evidence.',
        'Fresh generated quality reports are enough for the review cadence; public URL proof is only needed after live posting.',
      ),
    );
  }

  if (!recommendations.length) {
    recommendations.push(
      recommendation(
        'Low',
        'Run a fresh weekly promotion review',
        'No urgent blocker was found from the existing evidence, so the best next move is refreshing platform draft evidence.',
        'Run `npm run promotion:weekly-review`, then rerun `npm run marketing:orchestrate`.',
        ['docs/promotion-queue.md'],
        'All platform quality reports should pass before public posting.',
        'Generated quality reports and public URLs for any live changes.',
      ),
    );
  }

  return recommendations.slice(0, 3);
}

function markdownReport(report) {
  const qualityLines = report.qualityReports.map(
    (item) => `- ${item.label}: ${item.status} (${item.passed}/${item.total} passed${item.warnings ? `, ${item.warnings} warnings` : ''})`,
  );
  const evidenceLines = report.evidence.map(
    (item) => `- ${item.present ? 'OK' : 'Missing'} ${item.path}${item.parseError ? ` (${item.parseError})` : ''}`,
  );
  const blockerLines = report.blockers.length ? report.blockers.map((item) => `- ${item}`) : ['- None.'];
  const winLines = report.wins.length ? report.wins.map((item) => `- ${item}`) : ['- No wins found in current evidence.'];
  const recommendationLines = report.recommendations.flatMap((item, index) => [
    `${index + 1}. ${item.title} (${item.priority})`,
    `   Reason: ${item.reason}`,
    `   Action: ${item.action}`,
    `   Gate: ${item.gate}`,
    `   Proof needed: ${item.proofNeeded}`,
    `   Evidence: ${item.evidence.join(', ')}`,
  ]);
  const specialistLines = report.specialistRouting.map(
    (item) => `- ${item.workstream}: ${item.specialistLens}; proof lens: ${item.proofLens}; command: ${item.firstCommand}`,
  );

  return [
    '# Marketing Orchestrator Daily Plan',
    '',
    `Generated: ${report.generatedAt}`,
    `Owner lane: ${report.ownerLane}`,
    '',
    '## Wins',
    '',
    ...winLines,
    '',
    '## Blockers',
    '',
    ...blockerLines,
    '',
    '## Recommended Next Actions',
    '',
    ...recommendationLines,
    '',
    '## Specialist Routing',
    '',
    ...specialistLines,
    '',
    '## Quality Gates',
    '',
    ...qualityLines,
    '',
    '## Proof Policy',
    '',
    `- ${report.proofPolicy}`,
    '',
    '## Evidence Read',
    '',
    ...evidenceLines,
    '',
  ].join('\n');
}

const brandCode = readText(evidencePaths.brandCode);
const recommendedAgents = readText(evidencePaths.recommendedAgents);
const automationPlan = readText(evidencePaths.automationPlan);
const promotionQueue = readText(evidencePaths.promotionQueue);
const seoEvaluation = readJson(evidencePaths.seoEvaluation);
const searchConsoleInspection = readJson(evidencePaths.searchConsoleInspection);
const searchConsoleDiscovery = readJson(evidencePaths.searchConsoleDiscovery);
const linkHelper = readJson(evidencePaths.linkHelper);
const dataForSeoAccount = readJson(evidencePaths.dataForSeoAccount);
const dataForSeoStatus = readJson(evidencePaths.dataForSeoStatus);
const pinterestRss = readJson(evidencePaths.pinterestRss);
const mediumQuality = readJson(evidencePaths.mediumQuality);
const redditQuality = readJson(evidencePaths.redditQuality);
const blueskyQuality = readJson(evidencePaths.blueskyQuality);
const quoraQuality = readJson(evidencePaths.quoraQuality);
const devtoQuality = readJson(evidencePaths.devtoQuality);
const recognitionTracker = readJson(evidencePaths.recognitionTracker);
const originalDataAssets = readJson(evidencePaths.originalDataAssets);

const activeAutomations = parseActiveAutomationRows(automationPlan);
const queueRows = parseQueueRows(promotionQueue);
const qualityReports = [
  qualitySummary(mediumQuality, 'Medium'),
  qualitySummary(redditQuality, 'Reddit'),
  qualitySummary(blueskyQuality, 'Bluesky'),
  qualitySummary(quoraQuality, 'Quora'),
  qualitySummary(devtoQuality, 'DEV Community'),
];
const indexingGaps = neutralIndexingItems(seoEvaluation, searchConsoleInspection);
const balance = dataForSeoBalance(dataForSeoAccount, seoEvaluation);
const duplicateBalanceOwnerActive = activeAutomations.some((row) =>
  /DataForSEO Balance Watch/i.test(row.automation),
);
const liveProofGapRows = liveProofGaps(queueRows);
const qualityFailures = qualityReports.filter((item) => item.status === 'failed' || item.status === 'parse-error');
const recommendations = chooseRecommendations({
  indexingGaps,
  queueRows,
  qualityReports,
  pinterestRss,
  duplicateBalanceOwnerActive,
  recognitionTracker,
  linkHelper,
});

const evidence = [
  asEvidence('brandCode', evidencePaths.brandCode, brandCode),
  asEvidence('recommendedAgents', evidencePaths.recommendedAgents, recommendedAgents),
  asEvidence('automationPlan', evidencePaths.automationPlan, automationPlan),
  asEvidence('promotionQueue', evidencePaths.promotionQueue, promotionQueue),
  asEvidence('seoEvaluation', evidencePaths.seoEvaluation, seoEvaluation),
  asEvidence('searchConsoleInspection', evidencePaths.searchConsoleInspection, searchConsoleInspection),
  asEvidence('searchConsoleDiscovery', evidencePaths.searchConsoleDiscovery, searchConsoleDiscovery),
  asEvidence('linkHelper', evidencePaths.linkHelper, linkHelper),
  asEvidence('dataForSeoAccount', evidencePaths.dataForSeoAccount, dataForSeoAccount),
  asEvidence('dataForSeoStatus', evidencePaths.dataForSeoStatus, dataForSeoStatus),
  asEvidence('pinterestRss', evidencePaths.pinterestRss, pinterestRss),
  asEvidence('mediumQuality', evidencePaths.mediumQuality, mediumQuality),
  asEvidence('redditQuality', evidencePaths.redditQuality, redditQuality),
  asEvidence('blueskyQuality', evidencePaths.blueskyQuality, blueskyQuality),
  asEvidence('quoraQuality', evidencePaths.quoraQuality, quoraQuality),
  asEvidence('devtoQuality', evidencePaths.devtoQuality, devtoQuality),
  asEvidence('recognitionTracker', evidencePaths.recognitionTracker, recognitionTracker),
  asEvidence('originalDataAssets', evidencePaths.originalDataAssets, originalDataAssets),
];

const wins = [];
if (brandCode) wins.push('Brand code is present and can be loaded before public copy or promotion work.');
if (recommendedAgents) wins.push('Recommended agency-agent routing is present for specialist lens selection.');
if (!duplicateBalanceOwnerActive) wins.push('No active standalone DataForSEO balance-only automation was found.');
if (qualityReports.every((item) => item.status === 'passed')) wins.push('All available platform quality reports pass.');
if (pinterestRss && !pinterestRss.parseError && !pinterestRss.issues?.length) wins.push('Pinterest RSS report has no issues.');
if (recognitionTracker && !recognitionTracker.parseError) wins.push('Recognition tracker is available for public proof and blocked-channel checks.');

const blockers = [];
if (!brandCode) blockers.push('Missing docs/brand-code.md.');
if (!recommendedAgents) blockers.push('Missing docs/recommended-agency-agents.md.');
if (duplicateBalanceOwnerActive) blockers.push('Duplicate active DataForSEO Balance Watch found.');
if (qualityFailures.length) blockers.push(`${qualityFailures.map((item) => item.label).join(', ')} quality reports are failing.`);
if (balance?.topUp) blockers.push(`DataForSEO balance is at or below top-up threshold: ${balance.balance.toFixed(2)} ${balance.currency}.`);
if (dataForSeoStatus?.parseError) blockers.push(`DataForSEO status report could not be parsed: ${dataForSeoStatus.parseError}.`);
if (recognitionTracker?.totals?.claimedWithoutProof > 0) blockers.push(`${recognitionTracker.totals.claimedWithoutProof} promotion claim(s) still need recognition proof.`);

const report = {
  generatedAt: new Date().toISOString(),
  ownerLane: 'Marketing Orchestrator',
  reportOnly: true,
  activeAutomations,
  duplicateBalanceOwnerActive,
  balance,
  queueSummary: {
    rows: queueRows.length,
    liveProofGaps: liveProofGapRows.length,
    approved: queueRows.filter((row) => row.status === 'approved').length,
    rssConnected: queueRows.filter((row) => row.status === 'rss-connected').length,
    unverified: queueRows.filter((row) => row.status === 'unverified').length,
  },
  recognitionSummary: recognitionTracker?.totals ?? null,
  originalDataAssetStatus: originalDataAssets?.status ?? 'not checked',
  specialistRouting: [
    {
      workstream: 'Intelligence',
      specialistLens: 'SEO Specialist or AI Citation Strategist',
      proofLens: 'Reality Checker',
      firstCommand: 'npm run aft -- seo-console or npm run aft -- recognition',
    },
    {
      workstream: 'Content and promotion',
      specialistLens: 'Technical Writer plus Legal Compliance Checker',
      proofLens: 'Evidence Collector',
      firstCommand: 'platform quality command',
    },
    {
      workstream: 'Ask/API/MCP',
      specialistLens: 'API And MCP Tester plus Agentic Search Optimizer',
      proofLens: 'Reality Checker',
      firstCommand: 'npm run aft -- ask-audit',
    },
    {
      workstream: 'Automation and hosting',
      specialistLens: 'Automation Governance Architect',
      proofLens: 'Reality Checker',
      firstCommand: 'npm run automation:env-check or npm run aft -- hostinger',
    },
  ],
  indexingGaps: indexingGaps.slice(0, 10),
  qualityReports,
  wins,
  blockers,
  recommendations,
  proofPolicy:
    'Do not mark promotion as posted, updated, done, or fixed without a public URL, public profile/feed proof, screenshot, or generated report evidence.',
  evidence,
};

writeText(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
writeText(mdPath, markdownReport(report));

console.log(`Saved marketing orchestrator JSON to ${jsonPath}`);
console.log(`Saved marketing orchestrator plan to ${mdPath}`);

if (!brandCode || !recommendedAgents || duplicateBalanceOwnerActive || qualityFailures.length) {
  process.exitCode = 1;
}
