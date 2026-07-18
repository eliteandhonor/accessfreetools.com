function recommendation(priority, title, reason, action, evidence, gate, proofNeeded) {
  return { priority, title, reason, action, evidence, gate, proofNeeded };
}

function pathFromUrl(value) {
  try {
    return new URL(value).pathname;
  } catch {
    return String(value);
  }
}

function linkHelperSuggestionForGap(gap, linkHelper) {
  const targetPath = pathFromUrl(gap.url);
  const suggestions = Array.isArray(linkHelper?.suggestions) ? linkHelper.suggestions : [];
  return suggestions.find((suggestion) => suggestion.target === targetPath) ?? null;
}

export function createIndexingRecommendation(topGap, linkHelper) {
  const linkSuggestion = linkHelperSuggestionForGap(topGap, linkHelper);
  const linkReason = linkSuggestion?.reason ?? '';
  const indexingAlreadyRequested = /request-indexing (?:was )?submitted/i.test(linkReason);
  const indexingDeferred = /request-indexing (?:was )?deferred|daily (?:request )?quota/i.test(linkReason);
  const awaitingGoogle =
    linkSuggestion?.action === 'monitor' ||
    /manual request indexing|recheck after Google crawls|built pages already link here/i.test(linkReason);
  const linkProofUnavailable =
    !linkSuggestion ||
    linkHelper?.linkEvidence?.available === false ||
    /built link counts are unavailable|built link proof is unavailable/i.test(linkReason);

  if (awaitingGoogle) {
    return recommendation(
      'High',
      indexingAlreadyRequested
        ? 'Recheck requested indexing after Google crawls'
        : indexingDeferred
          ? 'Retry indexing after the Search Console quota resets'
          : 'Request indexing or recheck not-indexed priority pages',
      `${topGap.url} is still ${topGap.state}. ${linkReason}`,
      indexingAlreadyRequested
        ? 'Do not repeat the request-indexing click yet. Recheck URL Inspection after Google crawls, and keep promotion useful without creating a duplicate thin page.'
        : indexingDeferred
          ? 'Do not retry during the exhausted quota window. Submit this URL in the next daily Search Console batch, then wait for Google to crawl it.'
          : 'Use Search Console URL Inspection to request indexing manually if available, then recheck after Google crawls. Keep promotion useful and avoid creating a duplicate thin page.',
      [
        'output/search-console/url-inspection-latest.json',
        'output/search-console-discovery.json',
        'docs/search-console-indexing-requests.json',
        'output/agent-tools/link-helper/latest.json',
        'output/seo-agent-self-evaluation.json',
        'docs/promotion-queue.md',
      ],
      'Do not add duplicate internal links unless new page-specific evidence shows the current link proof is insufficient.',
      'Search Console state change, fresh URL Inspection after recrawl, or public promotion proof.',
    );
  }

  if (linkProofUnavailable) {
    return recommendation(
      'High',
      'Refresh built-link proof before changing priority pages',
      `${topGap.url} is still ${topGap.state}, but current evidence cannot prove how many built pages link to it.`,
      'Run `npm run build` and `npm run aft -- link-helper`, then rerun the marketing orchestrator. Do not add links until that proof shows a real gap.',
      ['output/search-console/url-inspection-latest.json', 'output/agent-tools/link-helper/latest.json'],
      'Missing build artifacts are an evidence gap, not proof that the page has zero internal links.',
      'Fresh built-link counts plus the current Search Console state.',
    );
  }

  return recommendation(
    'High',
    'Improve discovery for not-indexed priority pages',
    `${topGap.url} is still ${topGap.state}. Search engines need stronger crawl and usefulness signals before more duplicate promotion.`,
    'Add or verify contextual internal links from related indexed pages, then submit discovery and use one helpful promotion item if quality gates pass.',
    ['output/search-console/url-inspection-latest.json', 'output/seo-agent-self-evaluation.json', 'docs/promotion-queue.md'],
    'Do not create a duplicate thin page. Improve the existing URL.',
    'Search Console state change, XML sitemap submission report, or public promotion proof.',
  );
}

export function createPinterestCatalogRecommendation(pinterestRss) {
  const waiting = Number(pinterestRss?.counts?.rssReadyApps ?? pinterestRss?.counts?.rssReadyItems ?? 0);
  const total = Number(pinterestRss?.counts?.totalApps ?? 0);
  const posted = Number(pinterestRss?.counts?.postedApps ?? Math.max(0, total - waiting));

  return recommendation(
    'High',
    'Publish and verify the remaining Pinterest app catalog',
    `${waiting} of ${total} public apps are still waiting for a verified public Pinterest Pin; ${posted} currently have proof.`,
    'Deploy the ready board RSS feeds, confirm every required feed is connected to the intended public board, then verify imported Pins and record each direct public Pin URL before removing it from the feed.',
    ['output/promotion/pinterest-app-coverage.json', 'output/promotion/pinterest-rss-report.json', 'docs/promotion-queue.md'],
    'Do not call Pinterest complete while any public app remains RSS-ready or lacks a direct public Pin URL.',
    'A direct public Pinterest Pin URL for every public app, with the expected Access Free Tools destination.',
  );
}
