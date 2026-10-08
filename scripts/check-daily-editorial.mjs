import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { validateSemanticReview } from './lib/daily-editorial-checks.mjs';
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const articles = JSON.parse(readFileSync('src/data/dailyEditorialArticles.json', 'utf8'));
const issues = [];
for (const article of articles) {
  const path = `docs/daily-editorial-reviews/${article.slug}.json`;
  if (!existsSync(path)) { issues.push(`${article.slug}: missing review receipt`); continue; }
  const review = JSON.parse(readFileSync(path, 'utf8'));
  if (review.schemaVersion !== 1 || review.slug !== article.slug || review.publicSha256 !== hash(article) || !review.activationReview || review.publishedAt !== article.publishedAt || review.researchedAt !== article.researchedAt) issues.push(`${article.slug}: receipt mismatch`);
  if (review.deterministic?.passed !== true || !['allClaimsCovered', 'practical', 'noInventedTesting', 'licenseClear', 'original', 'clear'].every((key) => review.ollamaReview?.[key] === true) || review.ollamaReview?.issues?.length !== 0) issues.push(`${article.slug}: incomplete source/writing review`);
  const semantic = review.semanticReview;
  const claims = ['title', 'summary', 'problem'].map((id) => ({ id }));
  article.sections.forEach((section, sectionIndex) => {
    claims.push({ id: `sections.${sectionIndex}.heading` });
    section.paragraphs.forEach((_, paragraphIndex) => claims.push({ id: `sections.${sectionIndex}.paragraphs.${paragraphIndex}.text` }));
  });
  if (!/^[a-f0-9]{64}$/.test(review.articleSha256 ?? '') || !validateSemanticReview(semantic, { passed: true, articleSha256: review.articleSha256, claims }).passed) issues.push(`${article.slug}: incomplete TypeSafe review`);
  if (!article.sources.every((s) => review.sourceEvidence?.some((r) => r.id === s.id && r.url === s.url && r.sha256 === s.sha256 && r.fetchedAt === s.fetchedAt))) issues.push(`${article.slug}: source hash mismatch`);
  for (const extension of ['png', 'webp']) if (!existsSync(`public/social/daily-${article.slug}.${extension}`)) issues.push(`${article.slug}: missing ${extension} illustration`);
}
for (const issue of issues) console.error(issue);
console.log(`Daily editorial: ${issues.length ? 'fail' : 'pass'}; ${articles.length} published records; no provider calls.`);
if (issues.length) process.exitCode = 1;
