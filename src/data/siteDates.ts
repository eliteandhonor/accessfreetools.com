export const SITE_ORIGIN = 'https://accessfreetools.com';

export const SITE_LAUNCH_DATE = '2026-04-28';
export const SEARCH_CONSOLE_SETUP_DATE = '2026-04-30';
export const LAST_MAJOR_CONTENT_UPDATE = '2026-05-16';
export const RSS_ITEM_LIMIT = 60;

const DEFAULT_BLOG_PUBLISHED_DATE = '2026-04-30';

const toolLastmodOverrides: Record<string, string> = {
  'basic-calculator': '2026-06-02',
  'percentage-calculator': '2026-06-02',
  'ratio-calculator': '2026-06-02',
  'percent-error-calculator': '2026-06-02',
  'age-calculator': '2026-05-26',
  'auto-loan-calculator': '2026-05-26',
  'business-loan-calculator': '2026-05-26',
  'canadian-mortgage-calculator': '2026-05-26',
  'down-payment-calculator': '2026-05-26',
  'finance-calculator': '2026-05-26',
  'home-equity-loan-calculator': '2026-05-31',
  'heloc-calculator': '2026-06-02',
  'income-tax-calculator': '2026-05-31',
  'investment-calculator': '2026-05-31',
  'marriage-tax-calculator': '2026-05-31',
  'mortgage-calculator': '2026-05-31',
  'mortgage-calculator-uk': '2026-05-31',
  'mortgage-payoff-calculator': '2026-05-31',
  '401k-calculator': '2026-05-31',
  'house-affordability-calculator': '2026-05-31',
  'savings-calculator': '2026-05-31',
  'rent-calculator': '2026-05-31',
  'annuity-calculator': '2026-05-31',
  'credit-card-calculator': '2026-05-31',
  'pension-calculator': '2026-05-31',
  'annuity-payout-calculator': '2026-05-31',
  'credit-cards-payoff-calculator': '2026-05-31',
  'debt-payoff-calculator': '2026-05-31',
  'debt-consolidation-calculator': '2026-05-31',
  'repayment-calculator': '2026-05-31',
  'student-loan-calculator': '2026-05-31',
  'college-cost-calculator': '2026-05-31',
  'interest-calculator': '2026-05-31',
  'simple-interest-calculator': '2026-05-31',
  'cd-calculator': '2026-05-31',
  'bond-calculator': '2026-05-31',
  'mutual-fund-calculator': '2026-05-31',
  'roth-ira-calculator': '2026-05-31',
  'ira-calculator': '2026-05-31',
  'vat-calculator': '2026-06-01',
  'cash-back-or-low-interest-calculator': '2026-06-01',
  'auto-lease-calculator': '2026-06-01',
  'depreciation-calculator': '2026-06-01',
  'average-return-calculator': '2026-06-01',
  'margin-calculator': '2026-06-01',
  'discount-calculator': '2026-06-01',
  'break-even-calculator': '2026-06-01',
  'profit-goal-calculator': '2026-06-01',
  'liquidity-ratios-calculator': '2026-06-01',
  'debt-ratios-calculator': '2026-06-01',
  'operations-ratios-calculator': '2026-06-01',
  'profitability-ratios-calculator': '2026-06-01',
  'stock-ratios-calculator': '2026-06-01',
  'social-security-calculator': '2026-06-01',
  'rmd-calculator': '2026-06-01',
  'real-estate-calculator': '2026-06-01',
  'take-home-paycheck-calculator': '2026-06-01',
  'rental-property-calculator': '2026-06-01',
  'irr-calculator': '2026-06-01',
  'roi-calculator': '2026-06-01',
  'apr-calculator': '2026-06-01',
  'payment-calculator': '2026-06-01',
  'personal-loan-calculator': '2026-06-01',
  'refinance-calculator': '2026-06-02',
  'va-mortgage-calculator': '2026-06-02',
  'interest-rate-calculator': '2026-05-27',
  'loan-calculator': '2026-05-26',
  'love-calculator': '2026-05-26',
  'roofing-calculator': '2026-05-26',
  'gas-mileage-calculator': '2026-05-31',
  'golf-handicap-calculator': '2026-05-31',
  'mileage-calculator': '2026-05-31',
  'asphalt-calculator': '2026-05-31',
  'board-foot-calculator': '2026-05-31',
  'height-calculator': '2026-05-26',
  'sleep-calculator': '2026-05-26',
  'ad-revenue-calculator': '2026-05-26',
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
  'wallpaper-calculator': '2026-05-26',
  'watts-to-amps-calculator': '2026-06-02',
  'estate-tax-calculator': '2026-05-26',
  'fha-loan-calculator': '2026-05-26',
  'triangle-calculator': '2026-05-31',
};

const blogModifiedOverrides: Record<string, string> = {
  'how-to-use-basic-calculator': '2026-06-02',
  'how-to-use-percentage-calculator': '2026-06-02',
  'how-to-use-ratio-calculator': '2026-06-02',
  'how-to-use-percent-error-calculator': '2026-06-02',
  'how-to-use-watts-to-amps-calculator': '2026-06-02',
  'how-to-use-age-calculator': '2026-05-26',
  'how-to-use-auto-loan-calculator': '2026-05-26',
  'how-to-use-business-loan-calculator': '2026-05-26',
  'how-to-use-canadian-mortgage-calculator': '2026-05-26',
  'how-to-use-down-payment-calculator': '2026-05-26',
  'how-to-use-finance-calculator': '2026-05-26',
  'how-to-use-home-equity-loan-calculator': '2026-05-31',
  'how-to-use-heloc-calculator': '2026-06-02',
  'how-to-use-income-tax-calculator': '2026-05-31',
  'how-to-use-investment-calculator': '2026-05-31',
  'how-to-use-marriage-tax-calculator': '2026-05-31',
  'how-to-use-mortgage-calculator': '2026-05-31',
  'how-to-use-mortgage-calculator-uk': '2026-05-31',
  'how-to-use-mortgage-payoff-calculator': '2026-05-31',
  'how-to-use-401k-calculator': '2026-05-31',
  'how-to-use-house-affordability-calculator': '2026-05-31',
  'how-to-use-savings-calculator': '2026-05-31',
  'how-to-use-rent-calculator': '2026-05-31',
  'how-to-use-annuity-calculator': '2026-05-31',
  'how-to-use-credit-card-calculator': '2026-05-31',
  'how-to-use-pension-calculator': '2026-05-31',
  'how-to-use-annuity-payout-calculator': '2026-05-31',
  'how-to-use-credit-cards-payoff-calculator': '2026-05-31',
  'how-to-use-debt-payoff-calculator': '2026-05-31',
  'how-to-use-debt-consolidation-calculator': '2026-05-31',
  'how-to-use-repayment-calculator': '2026-05-31',
  'how-to-use-student-loan-calculator': '2026-05-31',
  'how-to-use-college-cost-calculator': '2026-05-31',
  'how-to-use-interest-calculator': '2026-05-31',
  'how-to-use-simple-interest-calculator': '2026-05-31',
  'how-to-use-cd-calculator': '2026-05-31',
  'how-to-use-bond-calculator': '2026-05-31',
  'how-to-use-mutual-fund-calculator': '2026-05-31',
  'how-to-use-roth-ira-calculator': '2026-05-31',
  'how-to-use-ira-calculator': '2026-05-31',
  'how-to-use-vat-calculator': '2026-06-01',
  'how-to-use-cash-back-or-low-interest-calculator': '2026-06-01',
  'how-to-use-auto-lease-calculator': '2026-06-01',
  'how-to-use-depreciation-calculator': '2026-06-01',
  'how-to-use-average-return-calculator': '2026-06-01',
  'how-to-use-margin-calculator': '2026-06-01',
  'how-to-use-discount-calculator': '2026-06-01',
  'how-to-use-break-even-calculator': '2026-06-01',
  'how-to-use-profit-goal-calculator': '2026-06-01',
  'how-to-use-liquidity-ratios-calculator': '2026-06-01',
  'how-to-use-debt-ratios-calculator': '2026-06-01',
  'how-to-use-operations-ratios-calculator': '2026-06-01',
  'how-to-use-profitability-ratios-calculator': '2026-06-01',
  'how-to-use-stock-ratios-calculator': '2026-06-01',
  'how-to-use-social-security-calculator': '2026-06-01',
  'how-to-use-rmd-calculator': '2026-06-01',
  'how-to-use-real-estate-calculator': '2026-06-01',
  'how-to-use-take-home-paycheck-calculator': '2026-06-01',
  'how-to-use-rental-property-calculator': '2026-06-01',
  'how-to-use-irr-calculator': '2026-06-01',
  'how-to-use-roi-calculator': '2026-06-01',
  'how-to-use-apr-calculator': '2026-06-01',
  'how-to-use-payment-calculator': '2026-06-01',
  'how-to-use-personal-loan-calculator': '2026-06-01',
  'how-to-use-refinance-calculator': '2026-06-02',
  'how-to-use-va-mortgage-calculator': '2026-06-02',
  'how-to-use-height-calculator': '2026-05-26',
  'how-to-use-sleep-calculator': '2026-05-26',
  'how-to-use-ad-revenue-calculator': '2026-05-26',
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
  'how-to-use-golf-handicap-calculator': '2026-05-31',
  'how-to-use-gas-mileage-calculator': '2026-05-31',
  'how-to-use-mileage-calculator': '2026-05-31',
  'how-to-use-asphalt-calculator': '2026-05-31',
  'how-to-use-board-foot-calculator': '2026-05-31',
  'how-to-use-wallpaper-calculator': '2026-05-26',
  'how-to-use-estate-tax-calculator': '2026-05-26',
  'how-to-use-fha-loan-calculator': '2026-05-26',
  'how-to-use-loan-calculator': '2026-05-26',
  'how-to-use-love-calculator': '2026-05-26',
  'how-to-use-roofing-calculator': '2026-05-26',
  'how-to-use-triangle-calculator': '2026-05-31',
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
