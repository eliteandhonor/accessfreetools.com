export type IndexationPriorityTier = 'p0' | 'p1' | 'p2' | 'longtail' | 'noindex';

export interface IndexationPolicy {
  canonicalPath: string;
  follow: boolean;
  includeInXmlSitemap: boolean;
  index: boolean;
  priorityTier: IndexationPriorityTier;
  reason?: string;
}

const explicitPolicies: Record<string, Partial<IndexationPolicy>> = {
  '/sitemap/': {
    follow: true,
    includeInXmlSitemap: false,
    index: false,
    priorityTier: 'noindex',
    reason: 'HTML sitemap is useful for users and crawlers, but it is not a search landing page.',
  },
};

export function normalizeIndexationPath(path: string) {
  if (!path) return '/';

  try {
    const url = path.startsWith('http') ? new URL(path) : new URL(path, 'https://accessfreetools.com');
    if (/\.[a-z0-9]+$/i.test(url.pathname)) return url.pathname;
    return url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
  } catch {
    if (/\.[a-z0-9]+$/i.test(path)) return path.startsWith('/') ? path : `/${path}`;
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return normalized.endsWith('/') ? normalized : `${normalized}/`;
  }
}

export function getIndexationPolicy(path: string): IndexationPolicy {
  const normalizedPath = normalizeIndexationPath(path);
  const explicit = explicitPolicies[normalizedPath] ?? {};
  const index = explicit.index ?? true;
  const follow = explicit.follow ?? true;

  return {
    canonicalPath: explicit.canonicalPath ?? normalizedPath,
    follow,
    includeInXmlSitemap: explicit.includeInXmlSitemap ?? index,
    index,
    priorityTier: explicit.priorityTier ?? 'longtail',
    reason: explicit.reason,
  };
}

export function shouldIncludeInXmlSitemap(path: string) {
  const policy = getIndexationPolicy(path);
  return policy.index && policy.includeInXmlSitemap;
}

export function robotsContentForPath(path: string, forcedNoindex = false) {
  const policy = getIndexationPolicy(path);
  const index = forcedNoindex ? false : policy.index;
  const follow = policy.follow;

  if (index && follow) return '';
  return `${index ? 'index' : 'noindex'},${follow ? 'follow' : 'nofollow'}`;
}
