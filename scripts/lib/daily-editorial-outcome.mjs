import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

/** The public Actions artifact contains only intentional operational metadata. */
const REASONS = new Set(('PIPELINE_HELD PROVIDER_FAILED HTTP_ERROR REQUEST_TIMEOUT REQUEST_FAILED RESPONSE_TOO_LARGE INVALID_RESPONSE INVALID_REQUEST REQUEST_TOO_LARGE REDIRECT_REJECTED CREDENTIAL_REQUIRED URL_NOT_ALLOWED SOURCE_UNAVAILABLE ' +
  'ACTIVATION_REQUIRED SHARED_BUDGET_COORDINATION_REQUIRED PUBLICATION_CATALOG_REQUIRED LIVE_VERIFICATION_ARTICLE_REQUIRED PRIOR_PUBLICATION_LIVE_UNVERIFIED LIVE_POLL_INPUT_INVALID CONFIGURATION_OR_STATE_INVALID OUTCOME_UNKNOWN PUBLICATION_OUTCOME_UNKNOWN DAY_RESERVED_FOR_PILOT ARTWORK_APPROVAL_HELD ' +
  'BUDGET_EXHAUSTED CALL_NOT_REPLAYABLE PROVIDER_USAGE_BOUND_EXCEEDED SOURCE_CONTENT_INVALID SOURCE_CONTENT_INCOMPLETE PROJECT_NAME_INVALID PROJECT_UNSUITABLE PROJECT_COMMIT_INVALID LICENSE_UNCERTAIN RELEASE_INVALID ' +
  'NO_USEFUL_CANDIDATE NO_VERIFIED_CANDIDATE JINA_SOURCE_INCOMPLETE DETERMINISTIC_CHECK_HELD OLLAMA_REVIEW_HELD TYPESAFE_CONTEXT_UNASSESSED TYPESAFE_REVIEW_HELD LOCAL_DAY_CHANGED ' +
  'PUBLICATION_CHECK_HELD PUBLICATION_REVIEW_INCOMPLETE PUBLICATION_DUPLICATE GIT_PUBLICATION_FAILED PUBLICATION_NOT_ACTIVATED PUBLICATION_REPOSITORY_MISMATCH PUBLICATION_OUTCOME_UNRESOLVED SOURCE_MAIN_MOVED ACTIVATION_CONFIG_CHANGED PUBLICATION_QUALITY_FAILED ' +
  'STATE_CONFLICT_OR_UNKNOWN STATE_LIMIT PRIVATE_STATE_SETUP_REQUIRED PRIVATE_STATE_METADATA_UNAVAILABLE PRIVATE_STATE_REPOSITORY_NOT_PRIVATE STATE_GIT_REDIRECT').split(' '));
const CHECKS = new Set('BUILD_IDENTITY ARTICLE_MARKER ARTICLE_H1 ARTICLE_CANONICAL ARTICLE_INDEXABLE ARTICLE_SCHEMA ARTICLE_DISCLOSURE ARTICLE_SOURCES ARTICLE_IMAGE ARTICLE_META ARTICLE_DOCUMENT SITEMAP_ENTRY FEED_ENTRY IMAGE_VALID IMAGE_HASH buildResponse articleResponse sitemapResponse feedResponse imageResponse'.split(' '));
const ISSUES = new Set([...CHECKS, 'PUBLICATION_INPUT_INVALID', ...['BUILD', 'ARTICLE', 'SITEMAP', 'FEED', 'IMAGE'].flatMap(resource =>
  ['TIMEOUT', 'HTTP_OR_REDIRECT', 'CONTENT_TYPE_OR_BODY', 'SIZE_LIMIT', 'EMPTY_BODY', 'FETCH_FAILED'].map(code => `${resource}_${code}`))]);

export function publicOutcome(result) {
  const status = ['held', 'started', 'checked', 'skipped', 'published'].includes(result?.status) ? result.status : 'held';
  const reason = result?.reason === undefined ? null : (REASONS.has(result.reason) ? result.reason : 'PIPELINE_HELD');
  let publication = null;
  const input = result?.publication;
  if (input && /^[a-f0-9]{40}$/.test(input.commit ?? '') && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug ?? '')) {
    publication = { slug: input.slug, commit: input.commit, liveVerified: input.liveVerified === true,
      url: `https://accessfreetools.com/blog/${input.slug}/` };
    if (/^[a-f0-9]{40}$/.test(input.base ?? '')) publication.base = input.base;
    if (/^[a-f0-9]{64}$/.test(input.imageSha256 ?? '')) publication.imageSha256 = input.imageSha256;
    if (typeof input.publishedAt === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(input.publishedAt)) publication.publishedAt = input.publishedAt;
    const verification = input.liveVerification;
    if (verification) publication.liveVerification = { verified: verification.verified === true,
      issues: Array.isArray(verification.issues) ? verification.issues.filter((code) => ISSUES.has(code)).slice(0, 100) : [],
      checks: Object.fromEntries(Object.entries(verification.checks ?? {}).filter(([key, value]) => CHECKS.has(key) && typeof value === 'boolean')) };
  }
  const providers = {};
  for (const provider of ['jina', 'ollama', 'typesafe']) {
    const value = result?.budget?.providers?.[provider];
    if (value && Number.isFinite(value.units) && value.units >= 0 && Number.isSafeInteger(value.calls) && value.calls >= 0) providers[provider] = { units: value.units, calls: value.calls };
  }
  const billingFailure = Object.values(result?.calls ?? {}).some((call) => call.receipt?.status === 402);
  return { status: status === 'published' ? (publication?.liveVerified ? 'live-verified' : 'committed-pending-live-verification') : status,
    reason, publication, budget: { providers },
    fundingNotice: billingFailure ? 'A provider reported a billing failure. Notify the owner to check funding; no purchase was attempted.' : null };
}

/** Reporting never changes the private ledger or retries a publication/provider. */
export function writePublicOutcome(result, { root, summaryFile, logger = console } = {}) {
  const report = publicOutcome(result);
  let artifactWritten = false;
  let summaryWritten = !summaryFile;
  try {
    mkdirSync(resolve(root, 'output/daily-editorial'), { recursive: true });
    writeFileSync(resolve(root, 'output/daily-editorial/latest.json'), `${JSON.stringify(report, null, 2)}\n`);
    artifactWritten = true;
  } catch {
    logger.error('Daily editorial outcome artifact could not be written.');
  }
  if (summaryFile) {
    try {
      writeFileSync(summaryFile, `Daily editorial: ${report.status}\n\n${report.reason ?? (report.publication ? 'One checked article committed.' : '')}\n\n${report.publication?.liveVerified ? report.publication.url : ''}\n\n${report.fundingNotice ?? ''}\n`);
      summaryWritten = true;
    } catch {
      logger.error('Daily editorial step summary could not be written.');
    }
  }
  logger.log(`Daily editorial: ${report.status}${report.reason ? ` (${report.reason})` : ''}.`);
  if (report.publication) logger.log(`Content commit ${report.publication.commit}; live verified: ${report.publication.liveVerified}.`);
  return { report, artifactWritten, summaryWritten };
}
