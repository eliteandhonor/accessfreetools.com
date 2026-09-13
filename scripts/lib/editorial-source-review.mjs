import { createHash } from 'node:crypto';

export function hashEditorialSource(source) {
  return createHash('sha256').update(String(source).replace(/\r\n/g, '\n')).digest('hex');
}

function nonempty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function dated(value, now) {
  return nonempty(value) && /^\d{4}-\d{2}-\d{2}T/.test(value) && Number.isFinite(Date.parse(value)) && Date.parse(value) <= now;
}

function sourceUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

export function reviewEditorialSources({ slug, articleSha256, ledger, baseline = {}, externalLinks = [], now = new Date() }) {
  const time = now instanceof Date ? now.getTime() : NaN;
  const issues = [];
  const hashValid = typeof articleSha256 === 'string' && /^[a-f0-9]{64}$/.test(articleSha256);
  const legacy = hashValid && Object.hasOwn(baseline, slug) && baseline[slug] === articleSha256;
  if (!ledger) {
    return { status: legacy ? 'legacy-unreviewed' : 'missing', gatePassed: legacy, publicationApproved: false,
      issues: ['No dated claim-to-source and Brendan fact/approval record. Link presence is not source verification.'] };
  }
  if (!hashValid || ledger.articleSha256 !== articleSha256 || ledger.slug !== slug) issues.push('Article source hash or slug does not match this draft.');
  if (ledger.schemaVersion !== 1 || !nonempty(ledger.reviewer) || !dated(ledger.reviewedAt, time)) issues.push('Missing valid reviewer, review date, or schema.');
  const claims = Array.isArray(ledger.claims) ? ledger.claims : [];
  if (!claims.length) issues.push('At least one claim-to-primary-source finding is required.');
  for (const claim of claims) {
    if (!claim || !nonempty(claim.claim) || !sourceUrl(claim.sourceUrl) || claim.primarySource !== true ||
        !nonempty(claim.finding) || !dated(claim.checkedAt, time) || Date.parse(claim.checkedAt) > Date.parse(ledger.reviewedAt)) {
      issues.push('A claim lacks a dated primary-source check and a concrete finding.');
    }
  }
  const linkedSources = new Set(externalLinks.map(sourceUrl).filter(Boolean));
  if (claims.some((claim) => !linkedSources.has(sourceUrl(claim?.sourceUrl)))) issues.push('A reviewed source is not linked in the article.');
  const facts = Array.isArray(ledger.brendanFacts) ? ledger.brendanFacts : [];
  if (!facts.length || facts.some((fact) => !fact || !nonempty(fact.fact) || !nonempty(fact.evidenceRef) ||
      !dated(fact.checkedAt, time) || Date.parse(fact.checkedAt) > Date.parse(ledger.reviewedAt))) {
    issues.push('Brendan experience needs dated facts and referenceable evidence, not an invented scene.');
  }
  const approval = ledger.ownerApproval;
  if (!approval || approval.status !== 'approved' || approval.by !== 'Brendan Chambers' ||
      !nonempty(approval.evidenceRef) || !dated(approval.approvedAt, time) || Date.parse(approval.approvedAt) < Date.parse(ledger.reviewedAt)) {
    issues.push('Owner approval of this reviewed draft needs a dated, referenceable record.');
  }
  return { status: issues.length ? 'incomplete' : 'recorded', gatePassed: issues.length === 0, publicationApproved: false,
    issues, claimCount: claims.length, factCount: facts.length, reviewedAt: ledger.reviewedAt ?? null,
    limitation: 'Validates record completeness only. The release reviewer must open evidence, check claims and authorization, and verify the actual draft.' };
}
