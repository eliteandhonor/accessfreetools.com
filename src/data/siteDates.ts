export const SITE_ORIGIN = 'https://accessfreetools.com';

export const SITE_LAUNCH_DATE = '2026-04-28';
export const SEARCH_CONSOLE_SETUP_DATE = '2026-04-30';
export const LAST_MAJOR_CONTENT_UPDATE = '2026-05-02';
export const RSS_ITEM_LIMIT = 60;

const DEFAULT_BLOG_PUBLISHED_DATE = '2026-04-30';

const staticPageLastmod: Record<string, string> = {
  '/': '2026-05-02',
  '/tools/': LAST_MAJOR_CONTENT_UPDATE,
  '/categories/': '2026-05-02',
  '/blog/': LAST_MAJOR_CONTENT_UPDATE,
  '/free-calculator-resources/': '2026-05-02',
  '/about/': '2026-05-02',
  '/why-access-free-tools/': '2026-05-02',
  '/contact/': '2026-04-30',
  '/advertising-disclosure/': '2026-04-30',
  '/privacy-policy/': '2026-04-30',
  '/terms/': '2026-04-30',
};

export function getStaticPageLastmod(path: string) {
  return staticPageLastmod[path] ?? LAST_MAJOR_CONTENT_UPDATE;
}

export function getToolLastmod(_slug: string) {
  return LAST_MAJOR_CONTENT_UPDATE;
}

export function getCategoryLastmod(_slug: string) {
  return LAST_MAJOR_CONTENT_UPDATE;
}

export function getBlogDates(slug: string) {
  const isEarlyHandwrittenGuide = [
    'how-to-use-basic-calculator',
    'how-to-use-binary-calculator',
    'how-to-use-exponent-calculator',
    'how-to-use-fraction-calculator',
    'how-to-use-half-life-calculator',
    'how-to-use-hex-calculator',
    'how-to-use-kawaii-calculator',
    'how-to-use-log-calculator',
    'how-to-use-percent-error-calculator',
    'how-to-use-percentage-calculator',
    'how-to-use-quadratic-formula-calculator',
    'how-to-use-random-number-generator',
    'how-to-use-ratio-calculator',
    'how-to-use-root-calculator',
    'how-to-use-scientific-calculator',
  ].includes(slug);

  return {
    published: isEarlyHandwrittenGuide ? DEFAULT_BLOG_PUBLISHED_DATE : LAST_MAJOR_CONTENT_UPDATE,
    modified: LAST_MAJOR_CONTENT_UPDATE,
  };
}

export function getArticleDatesFromPath(path: string) {
  const blogMatch = path.match(/^\/blog\/([^/]+)\/?$/);

  if (blogMatch) {
    return getBlogDates(blogMatch[1]);
  }

  return {
    published: DEFAULT_BLOG_PUBLISHED_DATE,
    modified: LAST_MAJOR_CONTENT_UPDATE,
  };
}

export function toRfc822Date(date: string) {
  return new Date(`${date}T12:00:00.000Z`).toUTCString();
}

export function toIsoDateTime(date: string) {
  return `${date}T12:00:00.000Z`;
}

export function formatDisplayDate(date: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00.000Z`));
}
