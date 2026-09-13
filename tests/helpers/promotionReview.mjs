import { activePromotionReviewSteps } from '../../scripts/lib/promotion-channel-policy.mjs';

export function passingPromotionReview(generatedAt = new Date().toISOString()) {
  return { generatedAt, dryRun: false, results: activePromotionReviewSteps().map((step) => ({
    ...step, status: 0, passed: true, startedAt: generatedAt, completedAt: generatedAt,
    ...(step.script === 'promotion:pinterest:proof-scan' ? { evidence: {
      status: 'passed', generatedAt,
      counts: { boardsExpected: 1, boardsFetched: 1, boardsCompleted: 1, publicPinsScanned: 1, uniqueAppPinsDiscovered: 1,
        skipped: 0, hardIssues: 0, missingDestinations: 0, invalidDestinations: 0 },
    } } : {}),
  })) };
}
