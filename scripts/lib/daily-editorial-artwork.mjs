import { createHash } from 'node:crypto';

const hex64 = /^[a-f0-9]{64}$/;
const digest = (value) => typeof value === 'string' && hex64.test(value);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const refPattern = /^[A-Za-z0-9][A-Za-z0-9_.:/#@-]{0,239}$/;
const ref = (value) => typeof value === 'string' && refPattern.test(value);
const object = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const exact = (value, keys) => object(value) && Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key));
const text = (value, limit) => typeof value === 'string' && value.trim().length > 0 && value.length <= limit && !/[<>\u0000-\u001f]/u.test(value);
const timestamp = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value) &&
  Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 19) === value.slice(0, 19);

export const DAILY_ART_VISUAL_CHECKS = Object.freeze([
  'fullBodyUncropped', 'houseStyle', 'conceptSpecific', 'noReadableText',
  'noLogosOrWatermarks', 'gRated', 'naturalAlt',
]);

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (object(value)) return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  return value;
}

export const artworkJsonHash = (value) => createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');

// Exact public content/source metadata; publication time and artwork binding are
// separate. Full private evidence is never copied into this public identity.
export function publicContentHash(article) {
  return artworkJsonHash({
    schemaVersion: 1, slug: article.slug, title: article.title, summary: article.summary, problem: article.problem,
    project: article.project, researchedAt: article.researchedAt,
    sections: article.sections.map(({ heading, paragraphs }) => ({ heading, paragraphs: paragraphs.map(({ text, sourceIds }) => ({ text, sourceIds })) })),
    sources: article.sources.map(({ id, kind, url, fetchedAt, sha256 }) => ({ id, kind, url, fetchedAt, sha256 })),
  });
}

export function dailyArtworkPaths(slug) {
  if (typeof slug !== 'string' || slug.length < 3 || slug.length > 100 || !slugPattern.test(slug)) throw new Error('Invalid daily artwork slug');
  return {
    imagePath: `/social/daily-${slug}.png`, webpPath: `/social/daily-${slug}.webp`,
    pngInput: `src/assets/daily-editorial/${slug}.png`, webpInput: `src/assets/daily-editorial/${slug}.webp`,
    generationEvidence: `docs/daily-editorial-art-evidence/${slug}/generation.json`,
    visualEvidence: `docs/daily-editorial-art-evidence/${slug}/visual-review.json`,
  };
}

export function validDailyArtworkApproval(value) {
  if (!exact(value, ['schemaVersion', 'slug', 'projectFullName', 'articleSha256', 'publicContentSha256', 'status', 'qaStatus',
    'imagePath', 'webpPath', 'width', 'height', 'alt', 'caption', 'assets', 'provenance', 'visualReview'])) return false;
  let paths;
  try { paths = dailyArtworkPaths(value.slug); } catch { return false; }
  if (value.schemaVersion !== 1 || typeof value.projectFullName !== 'string' || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(value.projectFullName) || value.projectFullName.length > 200 ||
      !digest(value.articleSha256) || !digest(value.publicContentSha256) ||
      value.status !== 'approved' || value.qaStatus !== 'approved' || value.imagePath !== paths.imagePath || value.webpPath !== paths.webpPath ||
      value.width !== 1200 || value.height !== 630 || !text(value.alt, 300) || !text(value.caption, 600)) return false;
  if (!exact(value.assets, ['png', 'webp']) || !['png', 'webp'].every((format) =>
    exact(value.assets[format], ['sha256', 'bytes']) && digest(value.assets[format].sha256) &&
    Number.isSafeInteger(value.assets[format].bytes) && value.assets[format].bytes > 0 && value.assets[format].bytes <= 5 * 1024 * 1024)) return false;
  const provenance = value.provenance;
  if (!exact(provenance, ['generator', 'generationRef', 'generatedAt', 'promptSha256', 'originalAssetSha256', 'evidencePath', 'evidenceSha256']) ||
      provenance.generator !== 'gpt-image' || !ref(provenance.generationRef) || !timestamp(provenance.generatedAt) ||
      !digest(provenance.promptSha256) || !digest(provenance.originalAssetSha256) ||
      provenance.evidencePath !== paths.generationEvidence || !digest(provenance.evidenceSha256)) return false;
  const review = value.visualReview;
  if (!exact(review, ['reviewer', 'reviewedAt', 'evidencePath', 'evidenceSha256', 'pngSha256', 'webpSha256', 'checks']) ||
      !exact(review.reviewer, ['kind', 'ref']) || !['human', 'ai'].includes(review.reviewer.kind) || !ref(review.reviewer.ref) ||
      !timestamp(review.reviewedAt) || Date.parse(review.reviewedAt) < Date.parse(provenance.generatedAt) ||
      review.evidencePath !== paths.visualEvidence || !digest(review.evidenceSha256) ||
      review.pngSha256 !== value.assets.png.sha256 || review.webpSha256 !== value.assets.webp.sha256 ||
      !exact(review.checks, DAILY_ART_VISUAL_CHECKS) || !DAILY_ART_VISUAL_CHECKS.every((key) => review.checks[key] === true)) return false;
  return true;
}

export function approvedDailyEditorialArtwork(article, approvals) {
  if (!validDailyArtworkManifest(approvals) || !article) return null;
  const matches = approvals.filter((entry) => entry?.slug === article.slug);
  if (matches.length !== 1 || !validDailyArtworkApproval(matches[0])) return null;
  const approval = matches[0];
  if (approval.projectFullName !== article.project?.fullName || approval.articleSha256 !== article.artwork?.articleSha256) return null;
  if (!timestamp(article.publishedAt) || Date.parse(approval.visualReview.reviewedAt) > Date.parse(article.publishedAt)) return null;
  try { if (approval.publicContentSha256 !== publicContentHash(article)) return null; } catch { return null; }
  return approval;
}

export function validDailyArtworkManifest(approvals) {
  return Array.isArray(approvals) && approvals.length <= 1000 && approvals.every(validDailyArtworkApproval) &&
    new Set(approvals.map((entry) => entry.slug)).size === approvals.length;
}

// Curated metadata only: full prompts/provider responses/headers/raw research
// are never included in public artwork evidence.
export function generationEvidenceFor(approval) {
  const { evidencePath, evidenceSha256, ...provenance } = approval.provenance;
  return { schemaVersion: 1, slug: approval.slug, articleSha256: approval.articleSha256, publicContentSha256: approval.publicContentSha256,
    ...provenance, pngSha256: approval.assets.png.sha256, webpSha256: approval.assets.webp.sha256 };
}

export function visualEvidenceFor(approval) {
  const { evidencePath, evidenceSha256, ...review } = approval.visualReview;
  return { schemaVersion: 1, slug: approval.slug, articleSha256: approval.articleSha256, publicContentSha256: approval.publicContentSha256, ...review };
}
