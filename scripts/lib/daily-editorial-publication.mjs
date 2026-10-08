import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, symlinkSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createDailyEditorialAssets } from './daily-editorial-assets.mjs';
import { articleHash, validateArticle, semanticRequest, validateSemanticReview } from './daily-editorial-checks.mjs';
import { sha256, EditorialHold, reviewerPassed } from './daily-editorial-pipeline.mjs';
import { brisbaneDay } from './daily-editorial-state.mjs';

export function publicArticle(article, publishedAt) {
  return {
    schemaVersion: 1, slug: article.slug, title: article.title, summary: article.summary, problem: article.problem,
    project: article.project, researchedAt: article.researchedAt, publishedAt,
    sections: article.sections.map(({ heading, paragraphs }) => ({ heading, paragraphs: paragraphs.map(({ text, sourceIds }) => ({ text, sourceIds })) })),
    sources: article.sources.map(({ id, kind, url, fetchedAt, sha256: hash }) => ({ id, kind, url, fetchedAt, sha256: hash })),
  };
}

export async function stagePublication({ root, article, record, publishedAt = new Date().toISOString(), activationReview }) {
  const catalogPath = join(root, 'src/data/dailyEditorialArticles.json');
  const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
  if (!validateArticle(article, { catalog, now: new Date(publishedAt) }).passed) throw new EditorialHold('PUBLICATION_CHECK_HELD');
  if (record.deterministic?.passed !== true || !reviewerPassed(record.ollamaReview) ||
      !validateSemanticReview(record.semanticReview, semanticRequest(article, catalog)).passed) throw new EditorialHold('PUBLICATION_REVIEW_INCOMPLETE');
  const entry = publicArticle(article, publishedAt);
  if (catalog.some((item) => item.slug === entry.slug || item.project.fullName.toLowerCase() === entry.project.fullName.toLowerCase())) throw new EditorialHold('PUBLICATION_DUPLICATE');
  const assets = await createDailyEditorialAssets(entry, { outputDir: join(root, 'public/social') });
  const receipt = {
    schemaVersion: 1, slug: entry.slug, articleSha256: articleHash(article), publicSha256: sha256(entry),
    researchedAt: article.researchedAt, publishedAt, activationReview,
    sourceEvidence: article.sources.map(({ id, url, fetchedAt, sha256: hash }) => ({ id, url, fetchedAt, sha256: hash })),
    deterministic: { passed: true },
    ollamaReview: Object.fromEntries(['allClaimsCovered', 'practical', 'noInventedTesting', 'licenseClear', 'original', 'clear'].map((key) => [key, true]).concat([['issues', []]])),
    semanticReview: record.semanticReview,
    limitation: 'Automated source, wording and duplicate checks are decision aids. They do not certify software, truth or installation tests.',
  };
  const reviewPath = join(root, 'docs/daily-editorial-reviews', `${entry.slug}.json`);
  mkdirSync(resolve(reviewPath, '..'), { recursive: true });
  writeFileSync(reviewPath, `${JSON.stringify(receipt, null, 2)}\n`);
  writeFileSync(catalogPath, `${JSON.stringify([...catalog, entry], null, 2)}\n`);
  return { entry, receipt, assets, paths: ['src/data/dailyEditorialArticles.json', `docs/daily-editorial-reviews/${entry.slug}.json`, `public/social/daily-${entry.slug}.png`, `public/social/daily-${entry.slug}.webp`] };
}

function git(root, args, options = {}) {
  try { return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], ...options }).trim(); }
  catch { throw new EditorialHold('GIT_PUBLICATION_FAILED'); }
}

export function createGitPublisher({ root, config, state, store, now = () => new Date() }) {
  if (!config.enabled || !config.publicationEnabled || !config.activationReview || !config.sharedBudgetAllocation) throw new EditorialHold('PUBLICATION_NOT_ACTIVATED');
  const remote = git(root, ['remote', 'get-url', 'origin']);
  if (remote !== 'https://github.com/eliteandhonor/accessfreetools.com.git') throw new EditorialHold('PUBLICATION_REPOSITORY_MISMATCH');
  const sourceMain = git(root, ['rev-parse', 'HEAD']);
  return async ({ article, record, day }) => {
    git(root, ['fetch', '--no-tags', 'origin', 'main']);
    const current = git(root, ['rev-parse', 'origin/main']);
    if (record.publicationIntent) {
      // A lost push response is reconciled from Git before any second write.
      const { commit, base, publishedAt, imageSha256 } = record.publicationIntent;
      if (current === commit || spawnSync('git', ['merge-base', '--is-ancestor', commit, current], { cwd: root }).status === 0) return { slug: article.slug, commit, base, publishedAt, imageSha256, url: `https://accessfreetools.com/blog/${article.slug}/`, liveVerified: false };
      throw new EditorialHold('PUBLICATION_OUTCOME_UNRESOLVED');
    }
    if (current !== sourceMain) throw new EditorialHold('SOURCE_MAIN_MOVED');
    const active = JSON.parse(git(root, ['show', `${current}:config/daily-editorial.json`]));
    if (sha256(active) !== sha256(config)) throw new EditorialHold('ACTIVATION_CONFIG_CHANGED');
    const directory = mkdtempSync(join(tmpdir(), 'aft-editorial-publish-'));
    try {
      git(root, ['worktree', 'add', '--detach', directory, current]);
      if (!existsSync(join(directory, 'node_modules'))) symlinkSync(join(root, 'node_modules'), join(directory, 'node_modules'), 'dir');
      const staged = await stagePublication({ root: directory, article, record, publishedAt: now().toISOString(), activationReview: config.activationReview });
      git(directory, ['add', '--', ...staged.paths]);
      git(directory, ['-c', 'user.name=Access Free Tools Editorial', '-c', 'user.email=editorial@accessfreetools.com', 'commit', '-m', `Publish researched project guide: ${article.slug}`]);
      const commit = git(directory, ['rev-parse', 'HEAD']);
      const gate = spawnSync('npm', ['run', 'check'], { cwd: directory, env: { ...process.env, AFT_SECRET_SCAN_MODE: 'tracked-only' }, stdio: 'inherit' });
      if (gate.status !== 0) throw new EditorialHold('PUBLICATION_QUALITY_FAILED');
      if (brisbaneDay(now()) !== day) throw new EditorialHold('LOCAL_DAY_CHANGED');
      const imageSha256 = staged.assets.files.find((file) => file.name.endsWith('.png')).sha256;
      record.publicationIntent = { base: current, commit, articleSha256: articleHash(article), publishedAt: staged.entry.publishedAt, imageSha256, day };
      await store.checkpoint(state);
      if (brisbaneDay(now()) !== day) {
        delete record.publicationIntent; // No main push was dispatched.
        await store.checkpoint(state);
        throw new EditorialHold('LOCAL_DAY_CHANGED');
      }
      // A normal fast-forward push is atomic; main movement rejects publication.
      git(directory, ['push', 'origin', `${commit}:refs/heads/main`]);
      return { slug: article.slug, commit, base: current, publishedAt: staged.entry.publishedAt, imageSha256, url: `https://accessfreetools.com/blog/${article.slug}/`, liveVerified: false };
    } finally {
      try { git(root, ['worktree', 'remove', '--force', directory]); } catch { rmSync(directory, { recursive: true, force: true }); }
    }
  };
}
