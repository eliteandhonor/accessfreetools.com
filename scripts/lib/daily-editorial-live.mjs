import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, realpathSync, rmSync } from 'node:fs';
import { isAbsolute, join, relative, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { parse } from 'parse5';
import { parseXml } from '@rgrove/parse-xml';
import sharp from 'sharp';

const ORIGIN = 'https://accessfreetools.com';
const REPOSITORY = 'eliteandhonor/accessfreetools.com';
const REMOTE = `https://github.com/${REPOSITORY}.git`;
const hex40 = (value) => typeof value === 'string' && /^[a-f0-9]{40}$/.test(value);
const safeSlug = (value) => typeof value === 'string' && value.length <= 100 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
const isoDate = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value) &&
  Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 19) === value.slice(0, 19);
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const normalized = (text) => String(text).replace(/\s+/g, ' ').trim();
const attribute = (node, name) => node.attrs?.find((item) => item.name === name)?.value;
const childText = (node) => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(childText).join('');
const xmlText = (node) => node.type === 'text' || node.type === 'cdata' ? node.text : (node.children ?? []).map(xmlText).join('');

export class DailyPublicationError extends Error {
  constructor(code) { super(code); this.name = 'DailyPublicationError'; this.code = code; }
}

function elements(node) {
  const result = [];
  const queue = [node];
  while (queue.length) {
    const current = queue.pop();
    if (current.tagName) result.push(current);
    queue.push(...(current.childNodes ?? []));
  }
  return result;
}

async function boundedRead(resource, fetchImpl, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  let reader;
  let abortHandler;
  const expired = new Promise((_, reject) => {
    abortHandler = () => reject(new DailyPublicationError('TIMEOUT'));
    controller.signal.addEventListener('abort', abortHandler, { once: true });
  });
  const operation = (async () => {
    try {
      response = await fetchImpl(resource.url, {
        method: 'GET', credentials: 'omit', redirect: 'error', cache: 'no-store',
        headers: { accept: resource.types.join(', '), 'cache-control': 'no-cache' }, signal: controller.signal,
      });
      if (controller.signal.aborted) throw new DailyPublicationError('TIMEOUT');
      if (response.status !== 200 || response.redirected || (response.url && response.url !== resource.url)) {
        throw new DailyPublicationError('HTTP_OR_REDIRECT');
      }
      const contentType = response.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
      if (!resource.types.includes(contentType) || !response.body) throw new DailyPublicationError('CONTENT_TYPE_OR_BODY');
      const declared = response.headers.get('content-length');
      if (declared && (!/^\d+$/.test(declared) || Number(declared) > resource.maxBytes)) throw new DailyPublicationError('SIZE_LIMIT');
      reader = response.body.getReader();
      const chunks = [];
      let size = 0;
      for (;;) {
        if (controller.signal.aborted) throw new DailyPublicationError('TIMEOUT');
        const result = await reader.read();
        if (result.done) break;
        size += result.value.byteLength;
        if (size > resource.maxBytes) throw new DailyPublicationError('SIZE_LIMIT');
        chunks.push(result.value);
      }
      if (!size) throw new DailyPublicationError('EMPTY_BODY');
      return { bytes: Buffer.concat(chunks), robots: response.headers.get('x-robots-tag') ?? '' };
    } catch (error) {
      throw error instanceof DailyPublicationError ? error : new DailyPublicationError('FETCH_FAILED');
    }
  })();
  try { return await Promise.race([operation, expired]); }
  finally {
    clearTimeout(timer);
    controller.signal.removeEventListener('abort', abortHandler);
    // Cancellation is best effort and must never extend the bounded request.
    if (reader) reader.cancel().catch(() => {});
    else response?.body?.cancel().catch(() => {});
  }
}

function structuredRecords(value) {
  if (Array.isArray(value)) return value.flatMap(structuredRecords);
  if (!value || typeof value !== 'object') return [];
  return [value, ...structuredRecords(value['@graph'])];
}

function xmlChildren(node, name) { return (node.children ?? []).filter((child) => child.type === 'element' && child.name === name); }
function oneXmlValue(node, name) {
  const matching = xmlChildren(node, name);
  return matching.length === 1 ? xmlText(matching[0]).trim() : null;
}

/** Read only these five exact first-party resources. No authentication, retry, or redirect. */
export async function verifyDailyPublication({ article, commit, imageSha256, fetchImpl = fetch, timeoutMs = 15000 } = {}) {
  const issues = [];
  const checks = {};
  const inputValid = safeSlug(article?.slug) && typeof article.title === 'string' && article.title.trim() && isoDate(article.publishedAt) &&
    Array.isArray(article.sources) && article.sources.length > 0 && article.sources.every((source) => typeof source.url === 'string') && hex40(commit) &&
    (imageSha256 === undefined || /^[a-f0-9]{64}$/.test(imageSha256)) && typeof fetchImpl === 'function' && Number.isInteger(timeoutMs) && timeoutMs > 0 && timeoutMs <= 30000;
  if (!inputValid) return { verified: false, issues: ['PUBLICATION_INPUT_INVALID'], checks: { input: false } };
  const canonical = `${ORIGIN}/blog/${article.slug}/`;
  const imageUrl = `${ORIGIN}/social/daily-${article.slug}.png`;
  const resources = [
    { name: 'build', url: `${ORIGIN}/_build.json`, types: ['application/json'], maxBytes: 8192 },
    { name: 'article', url: canonical, types: ['text/html'], maxBytes: 2 * 1024 * 1024 },
    { name: 'sitemap', url: `${ORIGIN}/sitemap-blog.xml`, types: ['application/xml', 'text/xml'], maxBytes: 2 * 1024 * 1024 },
    { name: 'feed', url: `${ORIGIN}/feed.xml`, types: ['application/rss+xml', 'application/xml', 'text/xml'], maxBytes: 2 * 1024 * 1024 },
    { name: 'image', url: imageUrl, types: ['image/png'], maxBytes: 5 * 1024 * 1024 },
  ];
  const results = await Promise.allSettled(resources.map((resource) => boundedRead(resource, fetchImpl, timeoutMs)));
  const response = {};
  results.forEach((result, index) => {
    const name = resources[index].name;
    checks[`${name}Response`] = result.status === 'fulfilled';
    if (result.status === 'fulfilled') response[name] = result.value;
    else issues.push(`${name.toUpperCase()}_${result.reason?.code ?? 'FETCH_FAILED'}`);
  });
  const check = (name, condition) => { checks[name] = Boolean(condition); if (!condition) issues.push(name); };
  if (response.build) {
    try {
      const identity = JSON.parse(response.build.bytes.toString('utf8'));
      check('BUILD_IDENTITY', identity.schemaVersion === 1 && identity.commit === commit && identity.clean === true && identity.nodeMajor === 24 && isoDate(identity.builtAt));
    } catch { check('BUILD_IDENTITY', false); }
  }
  if (response.article) {
    try {
      const document = parse(response.article.bytes.toString('utf8'));
      const nodes = elements(document);
      const articles = nodes.filter((node) => node.tagName === 'article' && attribute(node, 'data-daily-editorial') === article.slug);
      const headings = nodes.filter((node) => node.tagName === 'h1');
      const canonicals = nodes.filter((node) => node.tagName === 'link' && attribute(node, 'rel') === 'canonical');
      check('ARTICLE_MARKER', articles.length === 1);
      check('ARTICLE_H1', headings.length === 1 && normalized(childText(headings[0])) === normalized(article.title));
      check('ARTICLE_CANONICAL', canonicals.length === 1 && attribute(canonicals[0], 'href') === canonical);
      check('ARTICLE_INDEXABLE', !/\bnoindex\b/i.test(response.article.robots) && !nodes.some((node) => node.tagName === 'meta' && attribute(node, 'name') === 'robots' && /\bnoindex\b/i.test(attribute(node, 'content') ?? '')));
      const records = nodes.filter((node) => node.tagName === 'script' && attribute(node, 'type') === 'application/ld+json')
        .flatMap((node) => structuredRecords(JSON.parse(childText(node))));
      const postings = records.filter((record) => [record['@type']].flat().includes('BlogPosting'));
      const posting = postings[0];
      check('ARTICLE_SCHEMA', postings.length === 1 && posting.headline === article.title && posting.mainEntityOfPage === canonical && posting.image === imageUrl &&
        posting.datePublished === article.publishedAt && posting.dateModified === article.publishedAt && posting.author?.['@type'] === 'Organization' && posting.author.name === 'Access Free Tools' && posting.author.url === `${ORIGIN}/about/` &&
        Array.isArray(posting.citation) && article.sources.every((source) => posting.citation.includes(source.url)));
      const articleNodes = articles.length === 1 ? elements(articles[0]) : [];
      const disclosure = articleNodes.filter((node) => node.tagName === 'section' && (attribute(node, 'class') ?? '').split(/\s+/).includes('editorial-disclosure'));
      check('ARTICLE_DISCLOSURE', disclosure.length === 1 && /AI-assisted/.test(childText(disclosure[0])) && normalized(childText(disclosure[0])).includes('We did not install or run this software for the article.'));
      const links = new Set(articleNodes.filter((node) => node.tagName === 'a').map((node) => attribute(node, 'href')));
      check('ARTICLE_SOURCES', article.sources.every((source) => links.has(source.url)));
      const imageNodes = articleNodes.filter((node) => node.tagName === 'img' && attribute(node, 'src') === `/social/daily-${article.slug}.png`);
      check('ARTICLE_IMAGE', imageNodes.length === 1 && attribute(imageNodes[0], 'width') === '1200' && attribute(imageNodes[0], 'height') === '630' && Boolean(attribute(imageNodes[0], 'alt')));
      check('ARTICLE_META', ['og:image', 'article:published_time', 'article:modified_time'].every((property) => {
        const matching = nodes.filter((node) => node.tagName === 'meta' && attribute(node, 'property') === property);
        return matching.length === 1 && attribute(matching[0], 'content') === (property === 'og:image' ? imageUrl : article.publishedAt);
      }));
    } catch { check('ARTICLE_DOCUMENT', false); }
  }
  if (response.sitemap) {
    try {
      const root = parseXml(response.sitemap.bytes.toString('utf8')).root;
      const matches = xmlChildren(root, 'url').filter((node) => oneXmlValue(node, 'loc') === canonical);
      check('SITEMAP_ENTRY', root.name === 'urlset' && root.attributes.xmlns === 'http://www.sitemaps.org/schemas/sitemap/0.9' && matches.length === 1 && oneXmlValue(matches[0], 'lastmod') === article.publishedAt);
    } catch { check('SITEMAP_ENTRY', false); }
  }
  if (response.feed) {
    try {
      const root = parseXml(response.feed.bytes.toString('utf8')).root;
      const channels = xmlChildren(root, 'channel');
      const matches = channels.length === 1 ? xmlChildren(channels[0], 'item').filter((node) => oneXmlValue(node, 'link') === canonical) : [];
      check('FEED_ENTRY', root.name === 'rss' && matches.length === 1 && oneXmlValue(matches[0], 'guid') === canonical && oneXmlValue(matches[0], 'title') === article.title && oneXmlValue(matches[0], 'pubDate') === new Date(article.publishedAt).toUTCString());
    } catch { check('FEED_ENTRY', false); }
  }
  if (response.image) {
    try {
      const metadata = await sharp(response.image.bytes, { limitInputPixels: 1200 * 630 }).metadata();
      const valid = metadata.format === 'png' && metadata.width === 1200 && metadata.height === 630;
      if (valid) await sharp(response.image.bytes, { limitInputPixels: 1200 * 630 }).raw().toBuffer();
      check('IMAGE_VALID', valid);
      checks.imageSha256 = hash(response.image.bytes);
      if (imageSha256 !== undefined) check('IMAGE_HASH', checks.imageSha256 === imageSha256);
    } catch { check('IMAGE_VALID', false); }
  }
  return { verified: issues.length === 0, issues, checks };
}

/** Polling only observes deployment; it never requests a deployment or republishes. */
export async function waitForDailyPublication({ attempts = 30, delayMs = 20000, waitImpl = (ms) => new Promise((resolve) => setTimeout(resolve, ms)), ...options } = {}) {
  if (!Number.isInteger(attempts) || attempts < 1 || attempts > 30 || !Number.isInteger(delayMs) || delayMs < 0 || delayMs > 30000 || typeof waitImpl !== 'function') {
    throw new DailyPublicationError('LIVE_POLL_INPUT_INVALID');
  }
  let result;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    result = await verifyDailyPublication(options);
    if (result.verified) return { ...result, attempts: attempt, url: `${ORIGIN}/blog/${options.article.slug}/` };
    if (result.issues.includes('PUBLICATION_INPUT_INVALID')) return { ...result, attempts: attempt };
    if (attempt < attempts) await waitImpl(delayMs);
  }
  return { ...result, attempts };
}

function git(root, args, code = 'ROLLBACK_GIT_FAILED') {
  try {
    return execFileSync('git', ['-c', 'core.hooksPath=/dev/null', ...args], { cwd: root, encoding: 'utf8',
      timeout: 15000, maxBuffer: 2 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch { throw new DailyPublicationError(code); }
}

function canonicalJson(value) {
  if (Array.isArray(value)) return value.map(canonicalJson);
  return value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalJson(value[key])])) : value;
}

/** Revert only the latest exact single-article commit, on an isolated worktree. */
export async function rollbackPublication({ root, commit, config, fixtureRemote } = {}) {
  if (!config || config.schemaVersion !== 1 || config.repository !== REPOSITORY || config.enabled !== true || config.publicationEnabled !== true ||
      !config.activationReview || !config.sharedBudgetAllocation) throw new DailyPublicationError('ROLLBACK_NOT_ACTIVATED');
  if (!hex40(commit) || typeof root !== 'string') throw new DailyPublicationError('ROLLBACK_INPUT_INVALID');
  if (Object.entries(process.env).some(([key, value]) => /^(GIT_DIR|GIT_WORK_TREE|GIT_INDEX_FILE|GIT_COMMON_DIR)$/i.test(key) && value)) throw new DailyPublicationError('ROLLBACK_GIT_REDIRECT');
  let repositoryRoot;
  try { repositoryRoot = realpathSync(root); } catch { throw new DailyPublicationError('ROLLBACK_INPUT_INVALID'); }
  if (git(repositoryRoot, ['rev-parse', '--show-toplevel']) !== repositoryRoot) throw new DailyPublicationError('ROLLBACK_ROOT_MISMATCH');
  let remote = REMOTE;
  if (fixtureRemote !== undefined) {
    // This seam accepts only an explicit local bare fixture and local temp clone.
    try {
      const fixture = realpathSync(fixtureRemote);
      const temp = realpathSync(tmpdir());
      const contained = (path) => { const rel = relative(temp, path); return rel && !rel.startsWith(`..${sep}`) && rel !== '..' && !isAbsolute(rel); };
      if (!isAbsolute(fixtureRemote) || !contained(repositoryRoot) || !contained(fixture) || git(fixture, ['rev-parse', '--is-bare-repository']) !== 'true') throw new Error();
      remote = fixture;
    } catch { throw new DailyPublicationError('ROLLBACK_FIXTURE_INVALID'); }
  }
  const fetchUrls = git(repositoryRoot, ['remote', 'get-url', '--all', 'origin']).split(/\r?\n/);
  const pushUrls = git(repositoryRoot, ['remote', 'get-url', '--push', '--all', 'origin']).split(/\r?\n/);
  if (fetchUrls.length !== 1 || pushUrls.length !== 1 || fetchUrls[0] !== remote || pushUrls[0] !== remote) throw new DailyPublicationError('ROLLBACK_REPOSITORY_MISMATCH');
  git(repositoryRoot, ['fetch', '--no-tags', 'origin', 'refs/heads/main:refs/remotes/origin/main']);
  if (git(repositoryRoot, ['rev-parse', '--verify', 'refs/remotes/origin/main']) !== commit) throw new DailyPublicationError('MAIN_MOVED');
  let slug;
  try {
    const parents = git(repositoryRoot, ['rev-list', '--parents', '-n', '1', commit]).split(' ');
    if (parents.length !== 2 || parents[0] !== commit || !hex40(parents[1])) throw new Error();
    const active = JSON.parse(git(repositoryRoot, ['show', `${commit}:config/daily-editorial.json`]));
    if (JSON.stringify(canonicalJson(active)) !== JSON.stringify(canonicalJson(config))) throw new DailyPublicationError('ROLLBACK_ACTIVATION_CHANGED');
    const catalogPath = 'src/data/dailyEditorialArticles.json';
    const before = JSON.parse(git(repositoryRoot, ['show', `${parents[1]}:${catalogPath}`]));
    const after = JSON.parse(git(repositoryRoot, ['show', `${commit}:${catalogPath}`]));
    if (!Array.isArray(before) || !Array.isArray(after) || after.length !== before.length + 1 || JSON.stringify(after.slice(0, -1)) !== JSON.stringify(before)) throw new Error();
    const article = after.at(-1);
    slug = article?.slug;
    if (!safeSlug(slug) || !isoDate(article.publishedAt)) throw new Error();
    const reviewPath = `docs/daily-editorial-reviews/${slug}.json`;
    const review = JSON.parse(git(repositoryRoot, ['show', `${commit}:${reviewPath}`]));
    if (review.slug !== slug || review.publishedAt !== article.publishedAt) throw new Error();
    const paths = git(repositoryRoot, ['diff-tree', '--no-commit-id', '--no-renames', '--name-only', '-r', commit]).split(/\r?\n/);
    const allowed = new Set([catalogPath, reviewPath, `public/social/daily-${slug}.png`, `public/social/daily-${slug}.webp`]);
    if (!paths.includes(catalogPath) || !paths.includes(reviewPath) || paths.some((path) => !allowed.has(path))) throw new Error();
  } catch (error) {
    if (error instanceof DailyPublicationError && error.code === 'ROLLBACK_ACTIVATION_CHANGED') throw error;
    throw new DailyPublicationError('ROLLBACK_NOT_SINGLE_ARTICLE');
  }
  const directory = mkdtempSync(join(tmpdir(), 'aft-editorial-rollback-'));
  let added = false;
  try {
    git(repositoryRoot, ['worktree', 'add', '--detach', directory, commit]); added = true;
    git(directory, ['-c', 'user.name=Access Free Tools Editorial', '-c', 'user.email=editorial@accessfreetools.com', '-c', 'commit.gpgSign=false', 'revert', '--no-edit', commit]);
    const reverted = git(directory, ['rev-parse', 'HEAD']);
    if (!hex40(reverted)) throw new DailyPublicationError('ROLLBACK_COMMIT_INVALID');
    try { git(directory, ['push', 'origin', `${reverted}:refs/heads/main`], 'ROLLBACK_PUSH_OUTCOME_UNKNOWN'); }
    catch (error) {
      // Expose only immutable commit IDs so the caller can persist/reconcile an
      // uncertain result before considering another rollback. Never retry here.
      error.rollbackCommit = reverted;
      error.revertedCommit = commit;
      throw error;
    }
    return { rolledBack: true, commit: reverted, revertedCommit: commit, slug, liveVerified: false };
  } finally {
    if (added) {
      try { git(repositoryRoot, ['worktree', 'remove', '--force', directory]); }
      catch { /* Preserve the registered worktree for manual recovery. */ }
    } else rmSync(directory, { recursive: true, force: true });
  }
}
