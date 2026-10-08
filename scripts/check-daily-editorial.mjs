import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { validateSemanticReview } from './lib/daily-editorial-checks.mjs';
import { reviewerPassed } from './lib/daily-editorial-pipeline.mjs';
import { auditDailyEditorialPublicAssets } from './lib/daily-editorial-assets.mjs';
import { approvedDailyEditorialArtwork, artworkJsonHash, validDailyArtworkManifest } from './lib/daily-editorial-artwork.mjs';
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const articles = JSON.parse(readFileSync('src/data/dailyEditorialArticles.json', 'utf8'));
const issues = [];
const artworkApprovals = JSON.parse(readFileSync('src/data/dailyEditorialArtApprovals.json', 'utf8'));
if (!validDailyArtworkManifest(artworkApprovals)) issues.push('Daily artwork approval manifest is invalid');
for (const article of articles) {
  const path = `docs/daily-editorial-reviews/${article.slug}.json`;
  if (!existsSync(path)) { issues.push(`${article.slug}: missing review receipt`); continue; }
  const review = JSON.parse(readFileSync(path, 'utf8'));
  if (review.schemaVersion !== 1 || review.slug !== article.slug || review.publicSha256 !== hash(article) || !review.activationReview || review.publishedAt !== article.publishedAt || review.researchedAt !== article.researchedAt) issues.push(`${article.slug}: receipt mismatch`);
  if (review.deterministic?.passed !== true || !reviewerPassed(review.ollamaReview)) issues.push(`${article.slug}: incomplete source/writing review`);
  const semantic = review.semanticReview;
  const claims = ['title', 'summary', 'problem'].map((id) => ({ id }));
  article.sections.forEach((section, sectionIndex) => {
    claims.push({ id: `sections.${sectionIndex}.heading` });
    section.paragraphs.forEach((_, paragraphIndex) => claims.push({ id: `sections.${sectionIndex}.paragraphs.${paragraphIndex}.text` }));
  });
  if (!/^[a-f0-9]{64}$/.test(review.articleSha256 ?? '') || !validateSemanticReview(semantic, { passed: true, articleSha256: review.articleSha256, claims }).passed) issues.push(`${article.slug}: incomplete TypeSafe review`);
  if (!article.sources.every((s) => review.sourceEvidence?.some((r) => r.id === s.id && r.url === s.url && r.sha256 === s.sha256 && r.fetchedAt === s.fetchedAt))) issues.push(`${article.slug}: source hash mismatch`);
  const approval = approvedDailyEditorialArtwork(article, artworkApprovals);
  const expectedArtwork = approval && { sha256: artworkJsonHash(approval), articleSha256: approval.articleSha256,
    publicContentSha256: approval.publicContentSha256, provenanceEvidenceSha256: approval.provenance.evidenceSha256,
    visualEvidenceSha256: approval.visualReview.evidenceSha256, pngSha256: approval.assets.png.sha256, webpSha256: approval.assets.webp.sha256 };
  if (!approval || review.articleSha256 !== article.artwork?.articleSha256 || artworkJsonHash(review.artworkApproval ?? null) !== artworkJsonHash(expectedArtwork)) issues.push(`${article.slug}: artwork approval receipt mismatch`);
}
issues.push(...await auditDailyEditorialPublicAssets(process.cwd(), articles));
for (const issue of issues) console.error(issue);
console.log(`Daily editorial: ${issues.length ? 'fail' : 'pass'}; ${articles.length} published records; no provider calls.`);
if (issues.length) process.exitCode = 1;
