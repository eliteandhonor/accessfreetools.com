import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const mocks = vi.hoisted(() => ({
  createStore: vi.fn(), run: vi.fn(), reconcile: vi.fn(), publisher: vi.fn(),
  verify: vi.fn(), metadata: vi.fn(), fetch: vi.fn(), paid: vi.fn(), spawn: vi.fn(),
}));
vi.mock('./lib/daily-editorial-state.mjs', async (original) => ({
  ...await original(), createGitStateStore: mocks.createStore,
}));
vi.mock('./lib/daily-editorial-pipeline.mjs', async (original) => ({
  ...await original(), runDailyEditorial: mocks.run, reconcilePublicationIntents: mocks.reconcile,
}));
vi.mock('./lib/daily-editorial-publication.mjs', async (original) => ({
  ...await original(), createGitPublisher: mocks.publisher,
}));
vi.mock('./lib/daily-editorial-live.mjs', async (original) => ({
  ...await original(), waitForDailyPublication: mocks.verify,
}));
vi.mock('./lib/daily-editorial-storage.mjs', async (original) => ({
  ...await original(), privateRepositoryMetadata: mocks.metadata,
}));
vi.mock('./lib/daily-editorial-providers.mjs', async (original) => {
  const actual = await original();
  return { ...actual,
    githubJson: (path, options) => actual.githubJson(path, { ...options, fetchImpl: mocks.fetch }),
    jinaRead: mocks.paid, ollamaChat: mocks.paid, typesafeEvaluate: mocks.paid,
  };
});
vi.mock('node:child_process', async (original) => ({ ...await original(), spawnSync: mocks.spawn }));

import { main } from './daily-editorial.mjs';
import { newState } from './lib/daily-editorial-state.mjs';
import { fixtureArticle, fixtureCommit, fixtureLicense, fixtureName, fixtureReadme } from './lib/daily-editorial-fixtures.mjs';
const { runDailyEditorial: actualPipeline } = await vi.importActual('./lib/daily-editorial-pipeline.mjs');
const { spawnSync: actualSpawn } = await vi.importActual('node:child_process');
const privateMarker = 'fixture-private-message-source-canary';
const githubToken = 'fixture-github-token-not-a-credential';
const error = (code) => Object.assign(new Error(privateMarker), { code });
const encode = (text, path) => ({ encoding: 'base64', content: Buffer.from(text).toString('base64'), path });
const jsonResponse = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
let root, config, env, state, store, publish, logs;

function writeFixture(file, data) {
  const path = resolve(root, file);
  mkdirSync(resolve(path, '..'), { recursive: true });
  writeFileSync(path, typeof data === 'string' ? data : JSON.stringify(data));
}
function outcome() { return JSON.parse(readFileSync(resolve(root, 'output/daily-editorial/latest.json'), 'utf8')); }
function previousOutcome() { writeFixture('output/daily-editorial/latest.json', { status: 'live-verified', stale: true }); }
function pendingPublication({ missingArticle = false } = {}) {
  const publication = { day: '2026-10-08', slug: 'keep-task-notes-in-local-files', commit: 'b'.repeat(40), publishedAt: '2026-10-08T09:00:00Z', liveVerified: false };
  state.published.push(publication);
  state.days[publication.day] = { ...(!missingArticle && { article: fixtureArticle() }), publication };
}
function liveResult() {
  return { status: 'published', article: fixtureArticle(), publication: {
    slug: 'keep-task-notes-in-local-files', commit: 'b'.repeat(40), liveVerified: true,
  } };
}

beforeEach(() => {
  vi.clearAllMocks();
  for (const mock of Object.values(mocks)) mock.mockReset();
  root = mkdtempSync(resolve(tmpdir(), 'aft-daily-cli-'));
  logs = [];
  vi.spyOn(console, 'log').mockImplementation((message) => logs.push(message));
  vi.spyOn(console, 'error').mockImplementation((message) => logs.push(message));
  const limits = { jina: { units: 10000, calls: 1 }, ollama: { units: 20000, calls: 2 }, typesafe: { units: 20000, calls: 2 } };
  const allocation = { reviewRef: 'fixture-only', sharedCaps: {}, gtaCaps: {}, aftCaps: {}, aftCallCaps: {}, gtaCallCaps: {}, sharedCallCaps: {} };
  for (const [provider, limit] of Object.entries(limits)) {
    allocation.sharedCaps[provider] = allocation.aftCaps[provider] = limit.units;
    allocation.sharedCallCaps[provider] = allocation.aftCallCaps[provider] = limit.calls;
    allocation.gtaCaps[provider] = allocation.gtaCallCaps[provider] = 0;
  }
  config = { enabled: true, publicationEnabled: true, activationReview: 'fixture-reviewed', hostingAutoDeployVerified: 'fixture-only',
    sharedBudgetAllocation: allocation, limits, maxCandidates: 1, problems: [{ query: 'fixture', problem: 'Keep local notes' }],
    repository: 'eliteandhonor/accessfreetools.com', stateBranch: 'fixture-only', stateRepository: 'fixture/private-state', privateStoreApproval: 'fixture-only' };
  env = { GITHUB_TOKEN: githubToken, JINA_API_KEY: 'fixture-only', OLLAMA_API_KEY: 'fixture-only', TYPESAFE_API_KEY: 'fixture-only',
    AFT_EDITORIAL_STATE_TOKEN: 'fixture-only', AFT_EDITORIAL_ACTIVATED: config.activationReview,
    GITHUB_REPOSITORY: config.repository, GITHUB_REF: 'refs/heads/main', GITHUB_STEP_SUMMARY: resolve(root, 'summary.md') };
  writeFixture('config/daily-editorial.json', config);
  writeFixture('dist/blog-search-index.json', { posts: [] });
  writeFixture('src/data/dailyEditorialArticles.json', []);
  state = newState();
  store = { load: vi.fn(async () => state), checkpoint: vi.fn(async () => ({ durable: true })), dispose: vi.fn(async () => {}) };
  publish = vi.fn();
  mocks.createStore.mockResolvedValue(store);
  mocks.publisher.mockReturnValue(publish);
  mocks.reconcile.mockResolvedValue();
  mocks.run.mockResolvedValue({ status: 'held', reason: 'BUDGET_EXHAUSTED', article: privateMarker });
  mocks.verify.mockResolvedValue({ verified: true, issues: [], checks: {} });
  mocks.metadata.mockImplementation(() => { throw new Error('Unexpected private metadata request'); });
  mocks.fetch.mockImplementation(() => { throw new Error('Unexpected HTTP request'); });
  mocks.paid.mockImplementation(() => { throw new Error('Unexpected paid provider request'); });
  mocks.spawn.mockReturnValue({ status: 0 });
});
afterEach(() => {
  rmSync(root, { recursive: true, force: true });
  vi.restoreAllMocks();
});

describe('daily CLI default GitHub wiring', () => {
  it('authenticates discovery and pinned research reads through the real default CLI/pipeline/provider path', async () => {
    mocks.run.mockImplementation(actualPipeline);
    mocks.fetch.mockImplementation(async (url) => {
      const path = new URL(url).pathname;
      if (path === '/search/repositories') return jsonResponse({ items: [{ full_name: fixtureName }], total_count: 1, incomplete_results: false });
      if (path === `/repos/${fixtureName}`) return jsonResponse({ full_name: fixtureName, default_branch: 'main', visibility: 'public', archived: false, disabled: false, fork: false });
      if (path.endsWith('/commits/main')) return jsonResponse({ sha: fixtureCommit });
      if (path.endsWith('/readme')) return jsonResponse(encode(fixtureReadme, 'README.md'));
      if (path.endsWith('/license')) return jsonResponse({ ...encode(fixtureLicense, 'LICENSE'), license: { spdx_id: 'MIT' } });
      if (path.endsWith('/releases/latest')) return jsonResponse({ tag_name: 'v1.0.0', published_at: '2020-01-01T00:00:00Z', html_url: `https://github.com/${fixtureName}/releases/tag/v1.0.0` });
      // Hold before any paid reservation or provider; this exercises the docs GET too.
      if (path.endsWith('/contents/docs/README.md')) return jsonResponse({ error: privateMarker }, 429);
      throw new Error('Unexpected fixture endpoint');
    });
    expect(await main(['--run'], { root, env })).toBe(1);
    expect(mocks.fetch).toHaveBeenCalledTimes(7);
    for (const [url, init] of mocks.fetch.mock.calls) {
      expect(new URL(url).hostname).toBe('api.github.com');
      expect(init).toMatchObject({ method: 'GET', redirect: 'error', headers: { Authorization: `Bearer ${githubToken}` } });
      if (/\/(?:readme|license|contents\/)/u.test(new URL(url).pathname)) expect(new URL(url).searchParams.get('ref')).toBe(fixtureCommit);
    }
    expect(outcome()).toMatchObject({ status: 'held', reason: 'HTTP_ERROR', publication: null });
    expect(JSON.stringify(outcome()) + logs.join('\n')).not.toContain(githubToken);
    expect(JSON.stringify(outcome()) + logs.join('\n')).not.toContain(privateMarker);
    expect(mocks.paid).not.toHaveBeenCalled();
    expect(publish).not.toHaveBeenCalled();
    expect(Object.values(state.days)[0].calls).toEqual({});
  });

  it.each(['GITHUB_TOKEN', 'JINA_API_KEY', 'OLLAMA_API_KEY', 'TYPESAFE_API_KEY', 'AFT_EDITORIAL_STATE_TOKEN'])('reports missing %s before constructing state or calling providers', async (name) => {
    delete env[name];
    previousOutcome();
    expect(await main(['--run'], { root, env })).toBe(1);
    expect(outcome()).toMatchObject({ status: 'held', reason: 'CREDENTIAL_REQUIRED', publication: null });
    expect(outcome()).not.toHaveProperty('stale');
    expect(readFileSync(env.GITHUB_STEP_SUMMARY, 'utf8')).toContain('CREDENTIAL_REQUIRED');
    expect(mocks.createStore).not.toHaveBeenCalled();
    expect(mocks.run).not.toHaveBeenCalled();
    expect(mocks.fetch).not.toHaveBeenCalled();
    expect(logs.join('\n')).not.toContain(githubToken);
  });
});

describe('daily CLI held outcomes', () => {
  it('reports an unreviewed shared allocation before any state or provider work', async () => {
    delete config.sharedBudgetAllocation.reviewRef;
    writeFixture('config/daily-editorial.json', config);
    expect(await main(['--run'], { root, env })).toBe(1);
    expect(outcome()).toMatchObject({ status: 'held', reason: 'SHARED_BUDGET_COORDINATION_REQUIRED' });
    expect(mocks.createStore).not.toHaveBeenCalled();
    expect(mocks.fetch).not.toHaveBeenCalled();
  });

  it.each([
    ['setup', 'PRIVATE_STATE_METADATA_UNAVAILABLE'],
    ['load', 'STATE_CONFLICT_OR_UNKNOWN'],
    ['reconcile', 'PUBLICATION_OUTCOME_UNRESOLVED'],
    ['catalog', 'PUBLICATION_CATALOG_REQUIRED'],
    ['missing-article', 'LIVE_VERIFICATION_ARTICLE_REQUIRED'],
    ['verify', 'LIVE_POLL_INPUT_INVALID'],
    ['prior-checkpoint', 'STATE_CONFLICT_OR_UNKNOWN'],
    ['prior-unverified', 'PRIOR_PUBLICATION_LIVE_UNVERIFIED'],
    ['pipeline-outer', 'OUTCOME_UNKNOWN'],
    ['new-checkpoint', 'STATE_CONFLICT_OR_UNKNOWN'],
  ])('replaces a stale success with sanitized %s failure metadata', async (stage, code) => {
    previousOutcome();
    if (stage === 'setup') mocks.createStore.mockRejectedValue(error(code));
    if (stage === 'load') store.load.mockRejectedValue(error(code));
    if (stage === 'reconcile') mocks.reconcile.mockRejectedValue(error(code));
    if (stage === 'catalog') writeFixture('dist/blog-search-index.json', { posts: null });
    if (['missing-article', 'verify', 'prior-checkpoint', 'prior-unverified'].includes(stage)) pendingPublication({ missingArticle: stage === 'missing-article' });
    if (stage === 'verify') mocks.verify.mockRejectedValue(error(code));
    if (stage === 'prior-checkpoint') store.checkpoint.mockRejectedValue(error(code));
    if (stage === 'prior-unverified') mocks.verify.mockResolvedValue({ verified: false, issues: [] });
    if (stage === 'pipeline-outer') mocks.run.mockRejectedValue(error(code));
    if (stage === 'new-checkpoint') {
      const result = liveResult(); result.publication.liveVerified = false;
      mocks.run.mockResolvedValue(result);
      store.checkpoint.mockRejectedValue(error(code));
    }
    expect(await main(['--run'], { root, env })).toBe(1);
    expect(outcome()).toMatchObject({ status: 'held', reason: code, publication: null });
    expect(outcome()).not.toHaveProperty('stale');
    expect(readFileSync(env.GITHUB_STEP_SUMMARY, 'utf8')).toContain(code);
    expect(JSON.stringify(outcome()) + logs.join('\n')).not.toContain(privateMarker);
    expect(mocks.fetch).not.toHaveBeenCalled();
    expect(mocks.paid).not.toHaveBeenCalled();
    expect(publish).not.toHaveBeenCalled();
    if (stage !== 'setup') expect(store.dispose).toHaveBeenCalledOnce();
    // Reporting adds no state operations after the stage's original failure.
    expect(store.checkpoint.mock.calls.length).toBe(['prior-checkpoint', 'prior-unverified', 'new-checkpoint'].includes(stage) ? 1 : 0);
  });

  it('holds malformed configuration with a fixed fallback and no raw parser text', async () => {
    writeFixture('config/daily-editorial.json', `{${privateMarker}`);
    expect(await main(['--run'], { root, env })).toBe(1);
    expect(outcome().reason).toBe('CONFIGURATION_OR_STATE_INVALID');
    expect(logs.join('\n') + readFileSync(env.GITHUB_STEP_SUMMARY, 'utf8')).not.toContain(privateMarker);
    expect(mocks.createStore).not.toHaveBeenCalled();
  });

  it('maps arbitrary error codes to a fixed public reason and omits error messages/stacks', async () => {
    mocks.createStore.mockRejectedValue(error(privateMarker));
    expect(await main(['--run'], { root, env })).toBe(1);
    expect(outcome()).toMatchObject({ status: 'held', reason: 'PIPELINE_HELD', publication: null });
    expect(logs.join('\n') + readFileSync(env.GITHUB_STEP_SUMMARY, 'utf8') + JSON.stringify(outcome())).not.toContain(privateMarker);
  });

  it('writes normal held and live-verified results with their truthful exit codes', async () => {
    expect(await main(['--run'], { root, env })).toBe(1);
    expect(outcome()).toMatchObject({ status: 'held', reason: 'BUDGET_EXHAUSTED' });
    expect(JSON.stringify(outcome())).not.toContain(privateMarker);
    mocks.run.mockResolvedValue(liveResult());
    expect(await main(['--run'], { root, env })).toBe(0);
    expect(outcome()).toMatchObject({ status: 'live-verified', publication: { liveVerified: true } });
    expect(store.checkpoint).not.toHaveBeenCalled();
  });

  it('keeps a checked result truthful without inventing a publication receipt in its summary', async () => {
    mocks.run.mockResolvedValue({ status: 'checked' });
    expect(await main(['--run'], { root, env })).toBe(1);
    expect(outcome()).toMatchObject({ status: 'checked', publication: null });
    expect(readFileSync(env.GITHUB_STEP_SUMMARY, 'utf8')).not.toContain('committed');
  });

  it('handles artifact write failure safely and still attempts the separate summary', async () => {
    mkdirSync(resolve(root, 'output/daily-editorial/latest.json'), { recursive: true });
    mocks.run.mockResolvedValue(liveResult());
    expect(await main(['--run'], { root, env })).toBe(1);
    expect(logs).toContain('Daily editorial outcome artifact could not be written.');
    expect(logs.join('\n')).not.toContain(privateMarker);
    expect(readFileSync(env.GITHUB_STEP_SUMMARY, 'utf8')).toContain('live-verified');
    expect(store.checkpoint).not.toHaveBeenCalled();
    expect(mocks.run).toHaveBeenCalledOnce();
  });

  it('keeps the accurate live artifact when the optional step summary cannot be written', async () => {
    env.GITHUB_STEP_SUMMARY = root; // Writing to a directory fails without a real error being exposed.
    mocks.run.mockResolvedValue(liveResult());
    expect(await main(['--run'], { root, env })).toBe(1);
    expect(outcome()).toMatchObject({ status: 'live-verified', publication: { liveVerified: true } });
    expect(logs).toContain('Daily editorial step summary could not be written.');
    expect(store.checkpoint).not.toHaveBeenCalled();
    expect(mocks.run).toHaveBeenCalledOnce();
  });

  it('sanitizes cleanup failures, preserves the known result, and exits nonzero', async () => {
    store.dispose.mockRejectedValue(error(privateMarker));
    mocks.run.mockResolvedValue(liveResult());
    expect(await main(['--run'], { root, env })).toBe(1);
    expect(outcome().status).toBe('live-verified');
    expect(logs).toContain('Daily editorial private-state cleanup failed.');
    expect(logs.join('\n')).not.toContain(privateMarker);
    expect(store.checkpoint).not.toHaveBeenCalled();
  });
});

describe('daily CLI entrypoints', () => {
  it('runs the real default entrypoint with an empty environment and retains dormant activation holds', () => {
    config.enabled = config.publicationEnabled = false;
    writeFixture('config/daily-editorial.json', config);
    previousOutcome();
    const cli = fileURLToPath(new URL('./daily-editorial.mjs', import.meta.url));
    const result = actualSpawn(process.execPath, [cli, '--run'], { cwd: root, env: {}, encoding: 'utf8', timeout: 10000 });
    expect(result.status).toBe(1);
    expect(result.signal).toBeNull();
    expect(outcome()).toMatchObject({ status: 'held', reason: 'ACTIVATION_REQUIRED', publication: null });
    expect(outcome()).not.toHaveProperty('stale');
    expect(result.stderr + result.stdout).not.toContain(privateMarker);
    expect(result.stdout).toContain('ACTIVATION_REQUIRED');
    expect(mocks.createStore).not.toHaveBeenCalled();
    expect(mocks.fetch).not.toHaveBeenCalled();
  });

  it('passes only ordinary environment names into offline fixtures without reading secret values', async () => {
    const offlineEnv = { PATH: 'fixture-path', TMPDIR: root };
    for (const name of ['GITHUB_TOKEN', 'JINA_API_KEY', 'OLLAMA_API_KEY', 'TYPESAFE_API_KEY', 'AFT_EDITORIAL_STATE_TOKEN', 'AFT_EDITORIAL_ACTIVATED']) {
      Object.defineProperty(offlineEnv, name, { get() { throw new Error('Offline mode read a secret value'); } });
    }
    expect(await main(['--offline'], { root, env: offlineEnv })).toBe(0);
    expect(mocks.spawn).toHaveBeenCalledOnce();
    const [, args, options] = mocks.spawn.mock.calls[0];
    expect(args).toContain('scripts/daily-editorial.test.mjs');
    expect(options.env).toEqual({ PATH: 'fixture-path', TMPDIR: root });
    expect(options.cwd).toBe(root);
    expect(mocks.createStore).not.toHaveBeenCalled();
    expect(mocks.fetch).not.toHaveBeenCalled();
    expect(existsSync(resolve(root, 'output/daily-editorial/latest.json'))).toBe(false);
  });
});
