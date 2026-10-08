import { it, expect } from 'vitest';
import { publicOutcome } from './daily-editorial-outcome.mjs';

it('projects public operations and drops raw drafts, evidence, response bodies and unexpected fields', () => {
  const marker = 'PRIVATE_UNAPPROVED_DRAFT_TEXT';
  const result = { status: 'published', article: marker, research: marker, reason: marker,
    calls: { read: { receipt: { result: marker, status: 402 } } },
    budget: { providers: { jina: { units: 10000, calls: 1, private: marker }, custom: marker }, private: marker },
    publication: { slug: 'reviewed-example', commit: 'a'.repeat(40), liveVerified: true, privateNotes: marker,
      liveVerification: { verified: true, issues: [marker, 'ARTICLE_H1'], private: marker, checks: { ARTICLE_H1: true, [marker]: true, rawSource: marker } } } };
  const outcome = publicOutcome(result);
  expect(JSON.stringify(outcome)).not.toContain(marker);
  expect(outcome.status).toBe('live-verified');
  expect(outcome.publication.liveVerification.checks).toEqual({ ARTICLE_H1: true });
  expect(outcome.publication.liveVerification.issues).toEqual(['ARTICLE_H1']);
  expect(outcome.reason).toBe('PIPELINE_HELD');
  expect(outcome.budget).toEqual({ providers: { jina: { units: 10000, calls: 1 } } });
  expect(outcome.fundingNotice).toContain('billing failure');
});
it('does not print arbitrary errors, URLs or malformed commit receipts', () => {
  const marker = 'private evidence with words';
  const result = { status: marker, reason: marker, publication: { commit: marker, url: 'https://other.invalid/private' } };
  expect(publicOutcome(result)).toMatchObject({ status: 'held', reason: 'PIPELINE_HELD', publication: null });
  expect(JSON.stringify(publicOutcome(result))).not.toContain(marker);
});
