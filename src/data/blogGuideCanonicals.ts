export const blogGuideRedirects: Record<string, string> = {};

export function getCanonicalBlogGuideSlug(slug: string) {
  return blogGuideRedirects[slug] ?? slug;
}

export function isRedirectedBlogGuideSlug(slug: string) {
  return getCanonicalBlogGuideSlug(slug) !== slug;
}

export function getBlogGuideSlugForTool(toolSlug: string) {
  return getCanonicalBlogGuideSlug(`how-to-use-${toolSlug}`);
}

export function getBlogGuideToolSlugForTool(toolSlug: string) {
  return getBlogGuideSlugForTool(toolSlug).replace(/^how-to-use-/, '');
}

export function getBlogGuidePathForTool(toolSlug: string) {
  return `/blog/${getBlogGuideSlugForTool(toolSlug)}/`;
}

export function getRedirectedBlogGuidePath(pathname: string) {
  const match = pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (!match) return undefined;

  const canonicalSlug = getCanonicalBlogGuideSlug(match[1]);
  return canonicalSlug === match[1] ? undefined : `/blog/${canonicalSlug}/`;
}
