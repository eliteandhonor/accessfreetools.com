import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createGitStateStore } from './lib/daily-editorial-state.mjs';
import { runDailyEditorial, reconcilePublicationIntents, EditorialHold } from './lib/daily-editorial-pipeline.mjs';
import { createGitPublisher, publicArticle } from './lib/daily-editorial-publication.mjs';
import { waitForDailyPublication } from './lib/daily-editorial-live.mjs';
import { privateRepositoryMetadata } from './lib/daily-editorial-storage.mjs';
import { writePublicOutcome } from './lib/daily-editorial-outcome.mjs';
import { githubJson } from './lib/daily-editorial-providers.mjs';

export async function main(args = process.argv.slice(2), { root = process.cwd(), env = process.env } = {}) {
  if (args.length !== 1 || !['--offline', '--run'].includes(args[0])) {
    console.error('Use --offline for mocked fixtures or --run after coordinated activation.');
    return 2;
  }
  if (args[0] === '--offline') {
    const result = spawnSync(process.execPath, [resolve(root, 'node_modules/vitest/vitest.mjs'), 'run', '--configLoader', 'runner',
      'scripts/daily-editorial.test.mjs', 'scripts/lib/daily-editorial-state.test.mjs', 'scripts/lib/daily-editorial-storage.test.mjs', 'scripts/lib/daily-editorial-outcome.test.mjs', 'scripts/lib/daily-editorial-providers.test.mjs',
      'scripts/lib/daily-editorial-checks.test.mjs', 'scripts/lib/daily-editorial-assets.test.mjs',
      'scripts/lib/daily-editorial-pipeline.test.mjs', 'scripts/lib/daily-editorial-publication.test.mjs',
      'scripts/lib/daily-editorial-live.test.mjs'], { cwd: root, stdio: 'inherit', env: Object.fromEntries(
      ['PATH', 'HOME', 'TMPDIR', 'TMP', 'TEMP', 'SystemRoot', 'WINDIR', 'ComSpec', 'PATHEXT']
        .filter((name) => typeof env[name] === 'string').map((name) => [name, env[name]])) });
    return result.status === 0 ? 0 : 1;
  }

  let store, result;
  let cleanupSucceeded = true;
  try {
    const config = JSON.parse(readFileSync(resolve(root, 'config/daily-editorial.json'), 'utf8'));
    if (!config.enabled || !config.publicationEnabled || !config.activationReview || !config.hostingAutoDeployVerified || !config.sharedBudgetAllocation ||
        env.AFT_EDITORIAL_ACTIVATED !== config.activationReview || env.GITHUB_REPOSITORY !== config.repository ||
        config.repository !== 'eliteandhonor/accessfreetools.com' || env.GITHUB_REF !== 'refs/heads/main') throw new EditorialHold('ACTIVATION_REQUIRED');
    const missing = ['GITHUB_TOKEN', 'JINA_API_KEY', 'OLLAMA_API_KEY', 'TYPESAFE_API_KEY', 'AFT_EDITORIAL_STATE_TOKEN'].filter((name) => typeof env[name] !== 'string' || !env[name].trim());
    if (missing.length) throw new EditorialHold('CREDENTIAL_REQUIRED');
    const allocation = config.sharedBudgetAllocation;
    if (!allocation.reviewRef || !allocation.sharedCaps || !allocation.gtaCaps || !allocation.aftCaps ||
        !allocation.aftCallCaps || !allocation.gtaCallCaps || !allocation.sharedCallCaps ||
        !['jina', 'ollama', 'typesafe'].every((provider) => allocation.aftCaps[provider] === config.limits[provider].units &&
          Number.isFinite(allocation.gtaCaps[provider]) && allocation.gtaCaps[provider] >= 0 &&
          Number.isFinite(allocation.sharedCaps[provider]) && allocation.aftCaps[provider] + allocation.gtaCaps[provider] <= allocation.sharedCaps[provider] &&
          allocation.aftCallCaps[provider] === config.limits[provider].calls && Number.isSafeInteger(allocation.gtaCallCaps[provider]) && allocation.gtaCallCaps[provider] >= 0 &&
          Number.isSafeInteger(allocation.sharedCallCaps[provider]) && allocation.aftCallCaps[provider] + allocation.gtaCallCaps[provider] <= allocation.sharedCallCaps[provider])) throw new EditorialHold('SHARED_BUDGET_COORDINATION_REQUIRED');
    const keys = { jina: env.JINA_API_KEY, ollama: env.OLLAMA_API_KEY, typesafe: env.TYPESAFE_API_KEY };
    store = await createGitStateStore({ root, branch: config.stateBranch, activated: true,
      stateRepository: config.stateRepository, privateStoreApproval: config.privateStoreApproval, stateToken: env.AFT_EDITORIAL_STATE_TOKEN,
      readRepositoryMetadata: (repository) => privateRepositoryMetadata(repository, { token: env.AFT_EDITORIAL_STATE_TOKEN }) });
    const state = await store.load();
    // This built catalog covers existing owner posts and guides as well as daily posts.
    const posts = JSON.parse(readFileSync(resolve(root, 'dist/blog-search-index.json'), 'utf8')).posts;
    const daily = JSON.parse(readFileSync(resolve(root, 'src/data/dailyEditorialArticles.json'), 'utf8'));
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
    result = await runDailyEditorial({ config, state, store, catalog, keys, publish,
      providers: { github: (path) => githubJson(path, { token: env.GITHUB_TOKEN }) } });
    if (result.status === 'published' && !result.publication.liveVerified) {
      const verification = await waitForDailyPublication({ article: publicArticle(result.article, result.publication.publishedAt), commit: result.publication.commit, imageSha256: result.publication.imageSha256 });
      result.publication.liveVerification = verification;
      result.publication.liveVerified = verification.verified;
      const published = state.published.find((entry) => entry.commit === result.publication.commit);
      if (published) { published.liveVerified = verification.verified; published.liveVerification = verification; }
      await store.checkpoint(state);
    }
  } catch (error) {
    result = { status: 'held', reason: error?.code ?? 'CONFIGURATION_OR_STATE_INVALID' };
  } finally {
    try { await store?.dispose?.(); }
    catch {
      console.error('Daily editorial private-state cleanup failed.');
      cleanupSucceeded = false;
    }
  }
  const { report, artifactWritten, summaryWritten } = writePublicOutcome(result, { root, summaryFile: env.GITHUB_STEP_SUMMARY });
  return report.status === 'live-verified' && artifactWritten && summaryWritten && cleanupSucceeded ? 0 : 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = await main();
