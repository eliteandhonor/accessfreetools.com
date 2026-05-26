export const SITE_ORIGIN = 'https://accessfreetools.com';

export const SITE_LAUNCH_DATE = '2026-04-28';
export const SEARCH_CONSOLE_SETUP_DATE = '2026-04-30';
export const LAST_MAJOR_CONTENT_UPDATE = '2026-05-16';
export const RSS_ITEM_LIMIT = 60;

const DEFAULT_BLOG_PUBLISHED_DATE = '2026-04-30';

const toolLastmodOverrides: Record<string, string> = {
  'age-calculator': '2026-05-26',
  'interest-rate-calculator': '2026-05-26',
  'gas-mileage-calculator': '2026-05-26',
  'height-calculator': '2026-05-26',
  'half-life-calculator': '2026-05-26',
  'character-counter': '2026-05-26',
  'markup-calculator': '2026-05-26',
  'payback-period-calculator': '2026-05-26',
  'heat-index-calculator': '2026-05-26',
  'insulation-calculator': '2026-05-26',
  'polymeric-sand-calculator': '2026-05-26',
  'fuel-cost-calculator': '2026-05-26',
  'matrix-calculator': '2026-05-26',
  'date-calculator': '2026-05-26',
  'target-heart-rate-calculator': '2026-05-26',
  'area-calculator': '2026-05-26',
  'fraction-calculator': '2026-05-26',
  'sales-tax-calculator': '2026-05-26',
  'flooring-calculator': '2026-05-26',
  'oven-temperature-converter': '2026-05-26',
  'image-to-text-ocr-tool': '2026-05-26',
  'gdp-calculator': '2026-05-26',
};

const blogModifiedOverrides: Record<string, string> = {
  'how-to-use-age-calculator': '2026-05-26',
  'how-to-use-height-calculator': '2026-05-26',
  'how-to-use-half-life-calculator': '2026-05-26',
  'how-to-use-character-counter': '2026-05-26',
  'how-to-use-markup-calculator': '2026-05-26',
  'how-to-use-payback-period-calculator': '2026-05-26',
  'how-to-use-heat-index-calculator': '2026-05-26',
  'how-to-use-insulation-calculator': '2026-05-26',
  'how-to-use-polymeric-sand-calculator': '2026-05-26',
  'how-to-use-fuel-cost-calculator': '2026-05-26',
  'how-to-use-matrix-calculator': '2026-05-26',
  'how-to-use-date-calculator': '2026-05-26',
  'how-to-use-target-heart-rate-calculator': '2026-05-26',
  'how-to-use-area-calculator': '2026-05-26',
  'how-to-use-fraction-calculator': '2026-05-26',
  'how-to-use-sales-tax-calculator': '2026-05-26',
  'how-to-use-flooring-calculator': '2026-05-26',
  'how-to-use-oven-temperature-converter': '2026-05-26',
  'how-to-use-image-to-text-ocr-tool': '2026-05-26',
  'how-to-use-gdp-calculator': '2026-05-26',
};

const staticPageLastmod: Record<string, string> = {
  '/': '2026-05-02',
  '/tools/': LAST_MAJOR_CONTENT_UPDATE,
  '/ask/': '2026-05-15',
  '/gallery/': '2026-05-16',
  '/hubs/': LAST_MAJOR_CONTENT_UPDATE,
  '/categories/': '2026-05-02',
  '/blog/': LAST_MAJOR_CONTENT_UPDATE,
  '/free-calculator-resources/': '2026-05-02',
  '/developers/mcp/': '2026-05-15',
  '/about/': '2026-05-10',
  '/why-access-free-tools/': '2026-05-09',
  '/contact/': '2026-04-30',
  '/advertising-disclosure/': '2026-04-30',
  '/privacy-policy/': '2026-04-30',
  '/terms/': '2026-04-30',
};

export function getStaticPageLastmod(path: string) {
  return staticPageLastmod[path] ?? LAST_MAJOR_CONTENT_UPDATE;
}

export function getToolLastmod(slug: string) {
  return toolLastmodOverrides[slug] ?? LAST_MAJOR_CONTENT_UPDATE;
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
    modified: blogModifiedOverrides[slug] ?? LAST_MAJOR_CONTENT_UPDATE,
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
