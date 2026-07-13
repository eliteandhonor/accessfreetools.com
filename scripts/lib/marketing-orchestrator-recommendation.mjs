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
  const indexingAlreadyRequested = /request-indexing was submitted/i.test(linkReason);
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
      indexingAlreadyRequested ? 'Recheck requested indexing after Google crawls' : 'Request indexing or recheck not-indexed priority pages',
      `${topGap.url} is still ${topGap.state}. ${linkReason}`,
      indexingAlreadyRequested
        ? 'Do not repeat the request-indexing click yet. Recheck URL Inspection after Google crawls, and keep promotion useful without creating a duplicate thin page.'
        : 'Use Search Console URL Inspection to request indexing manually if available, then recheck after Google crawls. Keep promotion useful and avoid creating a duplicate thin page.',
      [
        'output/search-console-url-inspection.json',
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
      ['output/search-console-url-inspection.json', 'output/agent-tools/link-helper/latest.json'],
      'Missing build artifacts are an evidence gap, not proof that the page has zero internal links.',
      'Fresh built-link counts plus the current Search Console state.',
    );
  }

  return recommendation(
    'High',
    'Improve discovery for not-indexed priority pages',
    `${topGap.url} is still ${topGap.state}. Search engines need stronger crawl and usefulness signals before more duplicate promotion.`,
    'Add or verify contextual internal links from related indexed pages, then submit discovery and use one helpful promotion item if quality gates pass.',
    ['output/search-console-url-inspection.json', 'output/seo-agent-self-evaluation.json', 'docs/promotion-queue.md'],
    'Do not create a duplicate thin page. Improve the existing URL.',
    'Search Console state change, XML sitemap submission report, or public promotion proof.',
  );
}
