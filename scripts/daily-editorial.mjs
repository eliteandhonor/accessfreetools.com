import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createGitStateStore } from './lib/daily-editorial-state.mjs';
import { runDailyEditorial, reconcilePublicationIntents, EditorialHold } from './lib/daily-editorial-pipeline.mjs';
import { createGitPublisher, publicArticle } from './lib/daily-editorial-publication.mjs';
import { waitForDailyPublication } from './lib/daily-editorial-live.mjs';
import { privateRepositoryMetadata } from './lib/daily-editorial-storage.mjs';
import { publicOutcome } from './lib/daily-editorial-outcome.mjs';

const root = process.cwd();
const args = process.argv.slice(2);
if (args.length !== 1 || !['--offline', '--run'].includes(args[0])) {
  console.error('Use --offline for mocked fixtures or --run after coordinated activation.');
  process.exit(2);
}
if (args[0] === '--offline') {
  const result = spawnSync(process.execPath, [resolve('node_modules/vitest/vitest.mjs'), 'run', '--configLoader', 'runner',
    'scripts/lib/daily-editorial-state.test.mjs', 'scripts/lib/daily-editorial-storage.test.mjs', 'scripts/lib/daily-editorial-outcome.test.mjs', 'scripts/lib/daily-editorial-providers.test.mjs',
    'scripts/lib/daily-editorial-checks.test.mjs', 'scripts/lib/daily-editorial-assets.test.mjs',
    'scripts/lib/daily-editorial-pipeline.test.mjs', 'scripts/lib/daily-editorial-publication.test.mjs',
    'scripts/lib/daily-editorial-live.test.mjs'], { stdio: 'inherit' });
  process.exit(result.status === 0 ? 0 : 1);
}

let store;
try {
  const config = JSON.parse(readFileSync('config/daily-editorial.json', 'utf8'));
  if (!config.enabled || !config.publicationEnabled || !config.activationReview || !config.hostingAutoDeployVerified || !config.sharedBudgetAllocation ||
      process.env.AFT_EDITORIAL_ACTIVATED !== config.activationReview || process.env.GITHUB_REPOSITORY !== config.repository ||
      config.repository !== 'eliteandhonor/accessfreetools.com' || process.env.GITHUB_REF !== 'refs/heads/main') throw new EditorialHold('ACTIVATION_REQUIRED');
  const missing = ['JINA_API_KEY', 'OLLAMA_API_KEY', 'TYPESAFE_API_KEY', 'AFT_EDITORIAL_STATE_TOKEN'].filter((name) => !process.env[name]);
  if (missing.length) { console.error(`Missing credential names: ${missing.join(', ')}`); process.exit(1); }
  const allocation = config.sharedBudgetAllocation;
  if (!allocation.reviewRef || !allocation.sharedCaps || !allocation.gtaCaps || !allocation.aftCaps ||
      !allocation.aftCallCaps || !allocation.gtaCallCaps || !allocation.sharedCallCaps ||
      !['jina', 'ollama', 'typesafe'].every((provider) => allocation.aftCaps[provider] === config.limits[provider].units &&
        Number.isFinite(allocation.gtaCaps[provider]) && allocation.gtaCaps[provider] >= 0 &&
        Number.isFinite(allocation.sharedCaps[provider]) && allocation.aftCaps[provider] + allocation.gtaCaps[provider] <= allocation.sharedCaps[provider] &&
        allocation.aftCallCaps[provider] === config.limits[provider].calls && Number.isSafeInteger(allocation.gtaCallCaps[provider]) && allocation.gtaCallCaps[provider] >= 0 &&
        Number.isSafeInteger(allocation.sharedCallCaps[provider]) && allocation.aftCallCaps[provider] + allocation.gtaCallCaps[provider] <= allocation.sharedCallCaps[provider])) throw new EditorialHold('SHARED_BUDGET_COORDINATION_REQUIRED');
  const keys = { jina: process.env.JINA_API_KEY, ollama: process.env.OLLAMA_API_KEY, typesafe: process.env.TYPESAFE_API_KEY };
  store = await createGitStateStore({ root, branch: config.stateBranch, activated: true,
    stateRepository: config.stateRepository, privateStoreApproval: config.privateStoreApproval, stateToken: process.env.AFT_EDITORIAL_STATE_TOKEN,
    readRepositoryMetadata: (repository) => privateRepositoryMetadata(repository, { token: process.env.AFT_EDITORIAL_STATE_TOKEN }) });
  const state = await store.load();
  // This built catalog covers existing owner posts and guides as well as daily posts.
  const posts = JSON.parse(readFileSync('dist/blog-search-index.json', 'utf8')).posts;
  const daily = JSON.parse(readFileSync('src/data/dailyEditorialArticles.json', 'utf8'));
  if (!Array.isArray(posts) || !Array.isArray(daily)) throw new EditorialHold('PUBLICATION_CATALOG_REQUIRED');
  const catalog = [...posts.filter((post) => !daily.some((article) => article.slug === post.slug)), ...daily];
  const publish = createGitPublisher({ root, config, state, store });
  await reconcilePublicationIntents({ state, store, publish });
  // Observe any prior committed article before spending on another local day.
  // A failed deployment must not produce a backlog of unverified publications.
  const pendingCommits = state.published.filter((entry) => !entry.liveVerified).map((entry) => entry.commit);
  for (const commit of pendingCommits) {
    // Checkpoint compaction replaces ledger objects, so re-find each receipt.
    const publication = state.published.find((entry) => entry.commit === commit);
    const article = state.days[publication.day]?.article;
    if (!article) throw new EditorialHold('LIVE_VERIFICATION_ARTICLE_REQUIRED');
    const verification = await waitForDailyPublication({ article: publicArticle(article, publication.publishedAt), commit: publication.commit, imageSha256: publication.imageSha256 });
    publication.liveVerified = verification.verified;
    publication.liveVerification = verification;
    const record = state.days[publication.day];
    if (record.publication) { record.publication.liveVerified = verification.verified; record.publication.liveVerification = verification; }
    await store.checkpoint(state);
    if (!verification.verified) throw new EditorialHold('PRIOR_PUBLICATION_LIVE_UNVERIFIED');
  }
  const result = await runDailyEditorial({ config, state, store, catalog, keys, publish });
  if (result.status === 'published' && !result.publication.liveVerified) {
    const verification = await waitForDailyPublication({ article: publicArticle(result.article, result.publication.publishedAt), commit: result.publication.commit, imageSha256: result.publication.imageSha256 });
    result.publication.liveVerification = verification;
    result.publication.liveVerified = verification.verified;
    const published = state.published.find((entry) => entry.commit === result.publication.commit);
    if (published) { published.liveVerified = verification.verified; published.liveVerification = verification; }
    await store.checkpoint(state);
  }
  const report = publicOutcome(result);
  mkdirSync(resolve('output/daily-editorial'), { recursive: true });
  writeFileSync('output/daily-editorial/latest.json', `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Daily editorial: ${report.status}${report.reason ? ` (${report.reason})` : ''}.`);
  if (report.publication) console.log(`Content commit ${report.publication.commit}; live verified: ${report.publication.liveVerified}.`);
  if (process.env.GITHUB_STEP_SUMMARY) writeFileSync(process.env.GITHUB_STEP_SUMMARY, `Daily editorial: ${report.status}\n\n${report.reason ?? 'One checked article committed.'}\n\n${report.publication?.liveVerified ? report.publication.url : ''}\n\n${report.fundingNotice ?? ''}\n`);
  if (report.status !== 'live-verified') process.exitCode = 1;
} catch (error) {
  console.error(`Daily editorial held: ${error.code ?? 'CONFIGURATION_OR_STATE_INVALID'}.`);
  process.exitCode = 1;
} finally {
  await store?.dispose?.();
}
