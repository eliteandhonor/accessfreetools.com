export type PinterestFeedStatus = 'posted' | 'rss-ready';

export interface PinterestBoard {
  slug: string;
  title: string;
  description: string;
  path: string;
}

export interface PinterestFeedItem {
  title: string;
  description: string;
  path: string;
  imagePath: string;
  category: string;
  boardSlug: string;
  status: PinterestFeedStatus;
  rssEligible: boolean;
  publicPinUrl?: string;
  published: string;
}

export const PINTEREST_FEED_UPDATED = '2026-07-15';

export const pinterestBoards: PinterestBoard[] = [
  {
    slug: 'free-online-calculators',
    title: 'Free Online Calculators',
    description: 'Pinterest-ready free calculator pins for everyday math, shopping, planning, and quick checks.',
    path: '/pinterest/free-online-calculators.xml',
  },
  {
    slug: 'home-project-calculators',
    title: 'Home Project Calculators',
    description: 'Pinterest-ready home project calculator pins for estimating materials, electrical planning, and DIY checks.',
    path: '/pinterest/home-project-calculators.xml',
  },
  {
    slug: 'finance-calculators',
    title: 'Finance Calculators',
    description: 'Pinterest-ready finance calculator pins for payments, revenue estimates, loans, and money planning.',
    path: '/pinterest/finance-calculators.xml',
  },
  {
    slug: 'health-and-fitness-calculators',
    title: 'Health And Fitness Calculators',
    description: 'Pinterest-ready health and fitness calculator pins with plain disclaimers and careful result notes.',
    path: '/pinterest/health-and-fitness-calculators.xml',
  },
  {
    slug: 'ai-browser-tools',
    title: 'AI Browser Tools',
    description: 'Pinterest-ready browser AI tool pins for OCR, text analysis, language, and privacy-first utility pages.',
    path: '/pinterest/ai-browser-tools.xml',
  },
  {
    slug: 'school-and-study-tools',
    title: 'School And Study Tools',
    description: 'Pinterest-ready school and study pins for writing, math, notes, tables, and learning helpers.',
    path: '/pinterest/school-and-study-tools.xml',
  },
];

export const pinterestFeedItems: PinterestFeedItem[] = [
  {
    title: 'Free Online Tools For Calculators, Converters, And AI Tasks',
    description:
      'Browse free calculators, converters, AI browser tools, project estimators, and clear guides without signup.',
    path: '/tools/',
    imagePath: '/pinterest/free-online-tools-library.jpg',
    category: 'Free Online Calculators',
    boardSlug: 'free-online-calculators',
    status: 'posted',
    rssEligible: false,
    published: '2026-05-06',
  },
  {
    title: 'Free Calculator Resources For Everyday Math',
    description:
      'Use one simple hub for percentage math, mortgage payments, BMI estimates, home projects, finance, and school calculators.',
    path: '/free-calculator-resources/',
    imagePath: '/pinterest/free-calculator-resources.jpg',
    category: 'Free Online Calculators',
    boardSlug: 'free-online-calculators',
    status: 'posted',
    rssEligible: false,
    published: '2026-05-06',
  },
  {
    title: 'Basic Calculator For Quick Everyday Math',
    description:
      'Add, subtract, multiply, divide, use percent keys, keep a short history, and read a plain guide when the answer needs context.',
    path: '/tools/basic-calculator/',
    imagePath: '/pinterest/basic-calculator.jpg',
    category: 'Free Online Calculators',
    boardSlug: 'free-online-calculators',
    status: 'posted',
    rssEligible: false,
    published: '2026-05-06',
  },
  {
    title: 'Percentage Calculator For Discounts And Percent Change',
    description:
      'Calculate discounts, tips, markups, percent increase, percent decrease, and reverse percentages in a browser tool.',
    path: '/tools/percentage-calculator/',
    imagePath: '/pinterest/percentage-calculator.jpg',
    category: 'Free Online Calculators',
    boardSlug: 'free-online-calculators',
    status: 'posted',
    rssEligible: false,
    published: '2026-05-06',
  },
  {
    title: 'Mortgage Calculator For Monthly Payment Estimates',
    description:
      'Estimate monthly mortgage payment, interest, taxes, insurance, and amortization before comparing loan options.',
    path: '/tools/mortgage-calculator/',
    imagePath: '/pinterest/mortgage-calculator.jpg',
    category: 'Finance Calculators',
    boardSlug: 'finance-calculators',
    status: 'posted',
    rssEligible: false,
    published: '2026-05-06',
  },
  {
    title: 'BMI Calculator With Plain Result Notes',
    description:
      'Estimate BMI from height and weight, then read what the result can and cannot tell you before using it.',
    path: '/tools/bmi-calculator/',
    imagePath: '/pinterest/bmi-calculator.jpg',
    category: 'Health And Fitness Calculators',
    boardSlug: 'health-and-fitness-calculators',
    status: 'posted',
    rssEligible: false,
    published: '2026-05-06',
  },
  {
    title: 'Wallpaper Calculator That Explains Waste Percent',
    description:
      'Estimate wallpaper rolls using wall size, roll coverage, pattern repeat, openings, and waste percent.',
    path: '/tools/wallpaper-calculator/',
    imagePath: '/pinterest/wallpaper-calculator.jpg',
    category: 'Home Project Calculators',
    boardSlug: 'home-project-calculators',
    status: 'posted',
    rssEligible: false,
    published: '2026-05-06',
  },
  {
    title: 'Browser AI Tools With Privacy Notes',
    description:
      'Try browser-side OCR, tone checking, reading level, keywords, summaries, and language detection with clear model limits.',
    path: '/categories/ai-tools/',
    imagePath: '/pinterest/browser-ai-tools.jpg',
    category: 'AI Browser Tools',
    boardSlug: 'ai-browser-tools',
    status: 'posted',
    rssEligible: false,
    published: '2026-05-06',
  },
  {
    title: 'Image To Text OCR Tool In Your Browser',
    description:
      'Extract text from screenshots, notes, receipts, and images while learning what OCR can miss.',
    path: '/tools/image-to-text-ocr-tool/',
    imagePath: '/pinterest/image-to-text-ocr.jpg',
    category: 'AI Browser Tools',
    boardSlug: 'ai-browser-tools',
    status: 'posted',
    rssEligible: false,
    published: '2026-05-06',
  },
  {
    title: 'Voltage Drop Calculator For Wire Length Checks',
    description:
      'Estimate voltage drop from wire length, current, voltage, wire size, and material before planning a circuit.',
    path: '/tools/voltage-drop-calculator/',
    imagePath: '/pinterest/voltage-drop-calculator.jpg',
    category: 'Home Project Calculators',
    boardSlug: 'home-project-calculators',
    status: 'posted',
    rssEligible: false,
    published: '2026-05-07',
  },
  {
    title: 'Sand Calculator For Pavers, Bases, And Landscaping',
    description:
      'Estimate sand volume and weight from area and depth before planning a small home project or garden job.',
    path: '/tools/sand-calculator/',
    imagePath: '/pinterest/sand-calculator.jpg',
    category: 'Home Project Calculators',
    boardSlug: 'home-project-calculators',
    status: 'posted',
    rssEligible: false,
    published: '2026-05-07',
  },
  {
    title: 'Markdown Table Generator For Clean Rows And Columns',
    description:
      'Build clean Markdown tables with headers, rows, alignment, preview, and copy-ready output for docs and notes.',
    path: '/tools/markdown-table-generator/',
    imagePath: '/pinterest/markdown-table-generator.jpg',
    category: 'School And Study Tools',
    boardSlug: 'school-and-study-tools',
    status: 'posted',
    rssEligible: false,
    published: '2026-05-07',
  },
  {
    title: 'Body Surface Area Calculator With Plain Result Notes',
    description:
      'Estimate body surface area from height and weight with simple explanations and health-result limits.',
    path: '/tools/body-surface-area-calculator/',
    imagePath: '/pinterest/body-surface-area-calculator.jpg',
    category: 'Health And Fitness Calculators',
    boardSlug: 'health-and-fitness-calculators',
    status: 'posted',
    rssEligible: false,
    published: '2026-05-07',
  },
  {
    title: 'Speed Calculator For Distance, Time, And Pace Questions',
    description:
      'Calculate speed, distance, or time for travel, school math, pacing, and simple motion examples.',
    path: '/tools/speed-calculator/',
    imagePath: '/pinterest/speed-calculator.jpg',
    category: 'School And Study Tools',
    boardSlug: 'school-and-study-tools',
    status: 'posted',
    rssEligible: false,
    published: '2026-05-07',
  },
  {
    title: 'Payment Calculator For Quick Loan Estimates',
    description:
      'Estimate a loan payment from principal, interest rate, and term, then read the finance limits before using the number.',
    path: '/tools/payment-calculator/',
    imagePath: '/pinterest/payment-calculator.jpg',
    category: 'Finance Calculators',
    boardSlug: 'finance-calculators',
    status: 'posted',
    rssEligible: false,
    published: '2026-05-07',
  },
  {
    title: 'Hex Calculator For Binary, Decimal, And Code Checks',
    description:
      'Convert and calculate hexadecimal values for learning number bases, checking code examples, and comparing binary or decimal values.',
    path: '/tools/hex-calculator/',
    imagePath: '/pinterest/hex-calculator.jpg',
    category: 'School And Study Tools',
    boardSlug: 'school-and-study-tools',
    status: 'posted',
    rssEligible: false,
    published: '2026-05-07',
  },
  {
    title: 'Amp Hours To Watt Hours Calculator For Batteries',
    description: 'Convert battery amp-hours to watt-hours with voltage so capacity is easier to compare.',
    path: '/tools/amp-hours-to-watt-hours-calculator/',
    imagePath: '/pinterest/amp-hours-to-watt-hours.jpg',
    category: 'Home Project Calculators',
    boardSlug: 'home-project-calculators',
    status: 'posted',
    rssEligible: false,
    published: '2026-05-07',
  },
  {
    title: 'Watts To Amps Calculator With Voltage Safety Notes',
    description:
      'Convert watts to amps using voltage and phase, then read the safety notes before using the estimate around real wiring.',
    path: '/tools/watts-to-amps-calculator/',
    imagePath: '/pinterest/watts-to-amps-calculator.jpg',
    category: 'Home Project Calculators',
    boardSlug: 'home-project-calculators',
    status: 'posted',
    rssEligible: false,
    published: '2026-05-07',
  },
  {
    title: 'Ad Revenue Calculator For Early Website Planning',
    description:
      'Estimate RPM, CPC, CTR, pageviews, and ad revenue so a new site plan feels easier to compare and adjust.',
    path: '/tools/ad-revenue-calculator/',
    imagePath: '/pinterest/ad-revenue-calculator.jpg',
    category: 'Finance Calculators',
    boardSlug: 'finance-calculators',
    status: 'posted',
    rssEligible: false,
    published: '2026-05-13',
  },
  {
    title: 'Percent Off Calculator For Sale Price Checks',
    description:
      'Check a discount, final sale price, and savings amount before trusting a sale sign or checkout total.',
    path: '/tools/percent-off-calculator/',
    imagePath: '/pinterest/percent-off-calculator.jpg',
    category: 'Free Online Calculators',
    boardSlug: 'free-online-calculators',
    status: 'posted',
    rssEligible: false,
    published: '2026-05-07',
  },
  {
    title: 'Mortgage Amortization Calculator With Payment Breakdown',
    description:
      'See how a mortgage payment can split between interest and principal over time before comparing loan scenarios.',
    path: '/tools/mortgage-amortization-calculator/',
    imagePath: '/pinterest/mortgage-amortization-calculator.jpg',
    category: 'Finance Calculators',
    boardSlug: 'finance-calculators',
    status: 'posted',
    rssEligible: false,
    published: '2026-05-07',
  },
  {
    title: 'Concrete Calculator For Slabs, Footings, And Posts',
    description:
      'Estimate concrete volume for slabs, footings, holes, and posts, with extra material reminders for real projects.',
    path: '/tools/concrete-calculator/',
    imagePath: '/pinterest/concrete-calculator.jpg',
    category: 'Home Project Calculators',
    boardSlug: 'home-project-calculators',
    status: 'posted',
    rssEligible: false,
    published: '2026-05-07',
  },
  {
    title: 'Recipe Scaler For Doubling Or Halving Ingredients',
    description:
      'Scale recipe ingredients up or down without guessing, then check rounded amounts before cooking.',
    path: '/tools/recipe-scaler/',
    imagePath: '/pinterest/recipe-scaler.jpg',
    category: 'Free Online Calculators',
    boardSlug: 'free-online-calculators',
    status: 'posted',
    rssEligible: false,
    published: '2026-05-07',
  },
  {
    title: 'Unit Price Calculator For Comparing Deals',
    description:
      'Compare price per ounce, pound, item, or pack so shopping deals are easier to judge side by side.',
    path: '/tools/unit-price-calculator/',
    imagePath: '/pinterest/unit-price-calculator.jpg',
    category: 'Free Online Calculators',
    boardSlug: 'free-online-calculators',
    status: 'posted',
    rssEligible: false,
    published: '2026-05-13',
  },
  {
    title: 'Word Counter For Essays, Notes, And Drafts',
    description:
      'Count words, characters, sentences, and reading time for school work, blog drafts, notes, and quick edits.',
    path: '/tools/word-counter/',
    imagePath: '/pinterest/word-counter.jpg',
    category: 'School And Study Tools',
    boardSlug: 'school-and-study-tools',
    status: 'posted',
    rssEligible: false,
    published: '2026-05-07',
  },
  {
    title: 'Sales Tax Calculator For Price And Total Checks',
    description:
      'Check the tax amount, final price, or pre-tax price before comparing a receipt or checkout. I built this free browser calculator for quick estimates; local tax rules and exemptions can still differ.',
    path: '/tools/sales-tax-calculator/',
    imagePath: '/pinterest/sales-tax-calculator.jpg',
    category: 'Finance Calculators',
    boardSlug: 'finance-calculators',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269606694/',
    published: '2026-07-15',
  },
  {
    title: 'Kawaii Calculator For Cute Everyday Math',
    description:
      'A cute calculator for everyday arithmetic, percentages, memory, and keyboard-friendly checks. I built it for people who want practical math without a dull screen or signup.',
    path: '/tools/kawaii-calculator/',
    imagePath: '/pinterest/kawaii-calculator.jpg',
    category: 'Free Online Calculators',
    boardSlug: 'free-online-calculators',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269606692/',
    published: '2026-07-15',
  },
  {
    title: 'Concrete Block Calculator For Wall Estimates',
    description:
      'Estimate concrete blocks from wall width, height, block size, openings, and waste allowance. I built this for early project planning; check local requirements and your supplier before ordering.',
    path: '/tools/concrete-block-calculator/',
    imagePath: '/pinterest/concrete-block-calculator.jpg',
    category: 'Home Project Calculators',
    boardSlug: 'home-project-calculators',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269606687/',
    published: '2026-07-15',
  },
];

export function getPinterestBoard(slug: string) {
  return pinterestBoards.find((board) => board.slug === slug);
}

export function getPinterestFeedItems(boardSlug?: string) {
  return pinterestFeedItems.filter(
    (item) => item.rssEligible && item.status === 'rss-ready' && (!boardSlug || item.boardSlug === boardSlug),
  );
}

export function getPinterestPostedArchiveItems() {
  return pinterestFeedItems.filter((item) => item.status === 'posted' && !item.rssEligible);
}
