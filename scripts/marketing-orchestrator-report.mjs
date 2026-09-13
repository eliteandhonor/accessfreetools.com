import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { hasInspectionSourcePath, inspectionEvidenceFreshness, mergeInspectionReports } from './lib/search-console-inspection-reports.mjs';
import { createIndexingClassifier, hasBlockedIndexingState, needsIndexingAttention } from './lib/indexing-classification.mjs';
import { formatSavedProviderStatus, savedProviderStatus } from './lib/provider-status.mjs';
import { allPromotionChannelsPassed, summarizePromotionChannels } from './lib/promotion-channel-evidence.mjs';

import {
  createIndexingRecommendation,
  createPinterestCatalogRecommendation,
} from './lib/marketing-orchestrator-recommendation.mjs';
import {
  activePromotionChannels,
  filterActivePromotionRows,
  promotionChannelFor,
  promotionChannels,
} from './lib/promotion-channel-policy.mjs';

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
  automationEnvironment: 'output/automation-environment.json',
  pinterestRss: 'output/promotion/pinterest-rss-report.json',
  mediumQuality: 'output/promotion/medium-quality-report.json',
  blueskyQuality: 'output/promotion/bluesky/bluesky-quality-report.json',
  fourChannelReview: 'output/promotion/four-channel-review.json',
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

function classifiedIndexingItems(seoEvaluation, inspectionReport, now = new Date()) {
  const classify = createIndexingClassifier();
  const combined = mergeInspectionReports([
    { report: seoEvaluation, sourcePath: resolve(evidencePaths.seoEvaluation) },
    { report: inspectionReport, sourcePath: resolve(evidencePaths.searchConsoleInspection) },
  ]).inspections.map((item) => {
    const freshness = inspectionEvidenceFreshness(item.sourceGeneratedAt, { now });
    const usable = hasInspectionSourcePath(item.sourcePath) && !item.error &&
      (Boolean(item.coverageState) || hasBlockedIndexingState(item));
    return {
      ...item,
      sourceFreshness: freshness.status,
      sourceAgeDays: freshness.ageDays,
      status: usable && freshness.status === 'fresh' ? 'observed'
        : usable && freshness.status === 'stale' ? 'historical' : 'not enough data',
    };
  });

  return combined
    .map((item) => ({ ...item, classification: classify(item) }))
    .map((item) => ({
      classification: item.classification,
      url: item.inspectionUrl,
      state: item.status === 'not enough data' ? 'not enough data' : item.coverageState || item.indexingState,
      coverageState: item.coverageState || item.indexingState || 'unknown',
      indexingState: item.indexingState ?? '',
      ...(item.error ? { error: item.error } : {}),
      verdict: item.verdict ?? 'unknown',
      lastCrawlTime: item.lastCrawlTime ?? '',
      sourceGeneratedAt: item.sourceGeneratedAt,
      sourcePath: item.sourcePath,
      sourceFreshness: item.sourceFreshness,
      sourceAgeDays: item.sourceAgeDays,
      status: item.status,
    }));
}

function readProviderJson(path) {
  const report = readJson(path);
  return report?.parseError ? { parseError: 'Invalid JSON; provider evidence unavailable.' } : report;
}

function dataForSeoBalance(accountReport, seoEvaluation, serviceReport, environmentReport) {
  return {
    ...savedProviderStatus([
      { report: accountReport, source: evidencePaths.dataForSeoAccount },
      { report: seoEvaluation, source: evidencePaths.seoEvaluation },
      { report: serviceReport, source: evidencePaths.dataForSeoStatus },
      { report: environmentReport, source: evidencePaths.automationEnvironment },
    ]),
    stopBroadPaidResearch: true,
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
  const policy = promotionChannelFor(channel);
  return policy ? qualityReports.find((report) => report.channelId === policy.id) ?? null : null;
}

function qualityEvidencePath(label) {
  return activePromotionChannels.some((channel) => channel.label === label) ? evidencePaths.fourChannelReview : null;
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
  const failedQuality = qualityReports.find((report) => report.status !== 'passed');
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
        `Refresh ${failedQuality.label} quality evidence before promotion`,
        `${failedQuality.label} evidence is ${failedQuality.status}; do not infer that the public account is broken.`,
        `Run the four-channel review and inspect the first evidence gap: ${failedQuality.issues[0] ?? 'see report'}.`,
        [evidencePaths.fourChannelReview],
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
        'Run `npm run aft -- recognition`, then update only rows with verified public URL or public profile/feed proof.',
        ['output/recognition-tracker/latest.json', 'docs/promotion-queue.md'],
        'Do not treat drafts, submit buttons, or memory as proof.',
        'Verified public URL/profile proof; generated reports alone cannot establish publication.',
      ),
    );
  }

  if (!failedQuality && Number(pinterestRss?.counts?.rssReadyApps ?? 0) > 0) {
    recommendations.push(createPinterestCatalogRecommendation(pinterestRss));
  }

  if (!failedQuality && indexingGaps.length) {
    const topGap = indexingGaps[0];
    if (topGap.status !== 'observed' || topGap.sourceFreshness !== 'fresh') {
      recommendations.push(recommendation(
        'High',
        'Refresh Search Console inspection evidence',
        `${topGap.url}: saved evidence ${topGap.status} (${topGap.sourceFreshness}); observed ${topGap.sourceGeneratedAt || 'undated'}; source ${hasInspectionSourcePath(topGap.sourcePath) ? topGap.sourcePath : 'not enough data'}. This does not establish a current indexing issue.`,
        'Refresh exact URL Inspection evidence, preserve its original date and source path, then rerun the marketing orchestrator.',
        [topGap.sourcePath, evidencePaths.searchConsoleInspection, evidencePaths.seoEvaluation].filter(hasInspectionSourcePath),
        'Historical or unavailable observations cannot justify page changes or indexing submissions.',
        'Fresh exact-URL inspection evidence with a usable original source path.',
      ));
    } else if (topGap.classification === 'failure') {
      recommendations.push(recommendation(
        'High',
        'Review unexpected indexing failure',
        `${topGap.url}: saved ${topGap.coverageState}; the source policy permits indexing.`,
        'Check exact page-level robots, fetch and canonical evidence before link changes or indexing requests.',
        [topGap.sourcePath, 'src/data/indexationPolicy.ts'],
        'Do not remove intentional noindex or activate pilots to satisfy a report.',
        'Fresh exact-URL evidence explaining the unexpected indexing failure.',
      ));
    } else {
      recommendations.push(createIndexingRecommendation(topGap, linkHelper));
    }
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

  if (!recommendations.length && allPromotionChannelsPassed(qualityReports)) {
    recommendations.push(
      recommendation(
        'Monitor',
        'No urgent promotion action after weekly review',
        'The fresh weekly promotion review is already present and all platform quality reports pass.',
        'Hold promotion changes until there is a new approved public-posting task, live-proof gap, or fresh Search Console priority.',
        [
          evidencePaths.mediumQuality,
          evidencePaths.blueskyQuality,
          evidencePaths.pinterestRss,
          evidencePaths.fourChannelReview,
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
        'Run `npm run promotion:four-channel-review`, then rerun `npm run marketing:orchestrate`.',
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
  const indexingLines = report.indexingGaps.length ? report.indexingGaps.map((item) =>
    `- ${item.url}: saved ${item.verdict} / ${item.coverageState}; evidence ${item.status} (${item.sourceFreshness}); observed ${item.sourceGeneratedAt || 'undated'}; source ${hasInspectionSourcePath(item.sourcePath) ? item.sourcePath : 'not enough data'}`,
  ) : ['- No gaps in the available local inspection evidence.'];

  return [
    '# Marketing Orchestrator Daily Plan',
    '',
    `Generated: ${report.generatedAt}`,
    `Owner lane: ${report.ownerLane}`,
    '',
    '## Provider Evidence',
    '',
    `- ${formatSavedProviderStatus(report.balance)}`,
    '- Cached account evidence does not authorize paid research; refresh provider checks before separately approved research.',
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
    '## Inspection Evidence',
    '',
    `- Intentional policy exclusions: ${report.indexingExcluded.length}; monitor-only, not recovery or pilot-release authorization.`,
    ...indexingLines,
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
const dataForSeoAccount = readProviderJson(evidencePaths.dataForSeoAccount);
const dataForSeoStatus = readProviderJson(evidencePaths.dataForSeoStatus);
const automationEnvironment = readProviderJson(evidencePaths.automationEnvironment);
const pinterestRss = readJson(evidencePaths.pinterestRss);
const mediumQuality = readJson(evidencePaths.mediumQuality);
const blueskyQuality = readJson(evidencePaths.blueskyQuality);
const fourChannelReview = readJson(evidencePaths.fourChannelReview);
const recognitionTracker = readJson(evidencePaths.recognitionTracker);
const originalDataAssets = readJson(evidencePaths.originalDataAssets);

const activeAutomations = parseActiveAutomationRows(automationPlan);
const parsedQueueRows = parseQueueRows(promotionQueue);
const queueRows = filterActivePromotionRows(parsedQueueRows);
const excludedQueueRows = parsedQueueRows.filter((row) => !queueRows.includes(row));
const qualityReports = summarizePromotionChannels(fourChannelReview);
const indexingItems = classifiedIndexingItems(seoEvaluation, searchConsoleInspection);
const indexingGaps = indexingItems.filter((item) => needsIndexingAttention(item.classification));
const balance = dataForSeoBalance(dataForSeoAccount, seoEvaluation, dataForSeoStatus, automationEnvironment);
const duplicateBalanceOwnerActive = activeAutomations.some((row) =>
  /DataForSEO Balance Watch/i.test(row.automation),
);
const liveProofGapRows = liveProofGaps(queueRows);
const qualityFailures = qualityReports.filter((item) => item.status !== 'passed');
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
  asEvidence('automationEnvironment', evidencePaths.automationEnvironment, automationEnvironment),
  asEvidence('pinterestRss', evidencePaths.pinterestRss, pinterestRss),
  asEvidence('mediumQuality', evidencePaths.mediumQuality, mediumQuality),
  asEvidence('blueskyQuality', evidencePaths.blueskyQuality, blueskyQuality),
  asEvidence('fourChannelReview', evidencePaths.fourChannelReview, fourChannelReview),
  asEvidence('recognitionTracker', evidencePaths.recognitionTracker, recognitionTracker),
  asEvidence('originalDataAssets', evidencePaths.originalDataAssets, originalDataAssets),
];

const wins = [];
if (brandCode) wins.push('Brand code is present and can be loaded before public copy or promotion work.');
if (recommendedAgents) wins.push('Recommended agency-agent routing is present for specialist lens selection.');
if (!duplicateBalanceOwnerActive) wins.push('No active standalone DataForSEO balance-only automation was found.');
if (activePromotionChannels.length === 4) wins.push('Owner-approved four-channel promotion policy is active.');
if (allPromotionChannelsPassed(qualityReports)) wins.push('All four channels have fresh passing command evidence; public actions still need approval and live proof.');
if (pinterestRss && !pinterestRss.parseError && !pinterestRss.issues?.length) wins.push('Pinterest RSS report has no issues.');
if (recognitionTracker && !recognitionTracker.parseError) wins.push('Recognition tracker is available for public proof and blocked-channel checks.');

const blockers = [];
if (!brandCode) blockers.push('Missing docs/brand-code.md.');
if (!recommendedAgents) blockers.push('Missing docs/recommended-agency-agents.md.');
if (duplicateBalanceOwnerActive) blockers.push('Duplicate active DataForSEO Balance Watch found.');
if (qualityFailures.length) blockers.push(...qualityFailures.map((item) => `${item.label} quality evidence: ${item.status}. ${item.issues.join(' ')}`));
if (dataForSeoStatus?.parseError) blockers.push(`DataForSEO status report could not be parsed: ${dataForSeoStatus.parseError}.`);
if (recognitionTracker?.totals?.claimedWithoutProof > 0) blockers.push(`${recognitionTracker.totals.claimedWithoutProof} promotion claim(s) still need recognition proof.`);

const report = {
  generatedAt: new Date().toISOString(),
  ownerLane: 'Marketing Orchestrator',
  reportOnly: true,
  activeAutomations,
  duplicateBalanceOwnerActive,
  balance,
  promotionChannelPolicy: promotionChannels.map(({ id, label, status }) => ({ id, label, status })),
  queueSummary: {
    rows: queueRows.length,
    excludedInactiveRows: excludedQueueRows.length,
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
  indexingExcluded: indexingItems.filter((item) => item.classification === 'excluded'),
  qualityReports,
  wins,
  blockers,
  recommendations,
  proofPolicy:
    'Generated reports are local review evidence only. Do not mark promotion as posted, updated, done, or fixed without a verified public URL or public profile/feed proof.',
  evidence,
};

writeText(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
writeText(mdPath, markdownReport(report));

console.log(`Saved marketing orchestrator JSON to ${jsonPath}`);
console.log(`Saved marketing orchestrator plan to ${mdPath}`);
console.log(formatSavedProviderStatus(balance));

if (!brandCode || !recommendedAgents || duplicateBalanceOwnerActive || qualityFailures.length) {
  process.exitCode = 1;
}
