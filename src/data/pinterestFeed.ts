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
  {
    title: 'Interest Rate Calculator For Loans And Savings',
    description:
      'Compare interest estimates from a starting amount, rate, time, and compounding choice. I built this free calculator for planning checks, not financial advice.',
    path: '/tools/interest-rate-calculator/',
    imagePath: '/pinterest/interest-rate-calculator.jpg',
    category: 'Finance Calculators',
    boardSlug: 'finance-calculators',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269611927/',
    published: '2026-07-15',
  },
  {
    title: 'Date Calculator For Adding Or Counting Days',
    description:
      'Add or subtract days from a date, or count the time between two dates. Use it for deadlines, trips, study plans, and quick calendar checks.',
    path: '/tools/date-calculator/',
    imagePath: '/pinterest/date-calculator.jpg',
    category: 'Free Online Calculators',
    boardSlug: 'free-online-calculators',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269612963/',
    published: '2026-07-15',
  },
  {
    title: 'Fraction Calculator For Adding And Simplifying',
    description:
      'Add, subtract, multiply, or divide fractions, then reduce the result and follow the working. Use it for homework checks and everyday measurements.',
    path: '/tools/fraction-calculator/',
    imagePath: '/pinterest/fraction-calculator.jpg',
    category: 'School And Study Tools',
    boardSlug: 'school-and-study-tools',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269613324/',
    published: '2026-07-15',
  },
  {
    title: 'Gas Mileage Calculator For Fuel Cost Checks',
    description:
      'Estimate MPG, litres per 100 km, fuel used, and trip cost from distance, fuel, and price. Use it to compare journeys or check a fill-up.',
    path: '/tools/gas-mileage-calculator/',
    imagePath: '/pinterest/gas-mileage-calculator.jpg',
    category: 'Free Online Calculators',
    boardSlug: 'free-online-calculators',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269613499/',
    published: '2026-07-15',
  },
  {
    title: 'Oven Temperature Converter For Celsius And Fahrenheit',
    description:
      'Convert oven temperatures between Celsius, Fahrenheit, and gas mark before following a recipe. Check your oven and recipe notes when precision matters.',
    path: '/tools/oven-temperature-converter/',
    imagePath: '/pinterest/oven-temperature-converter.jpg',
    category: 'Free Online Calculators',
    boardSlug: 'free-online-calculators',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269614140/',
    published: '2026-07-15',
  },
  {
    title: 'Golf Handicap Calculator For Round Estimates',
    description:
      'Estimate a golf handicap from scores, course rating, slope, and round data. Use it for practice tracking; official handicaps follow governing rules.',
    path: '/tools/golf-handicap-calculator/',
    imagePath: '/pinterest/golf-handicap-calculator.jpg',
    category: 'Health And Fitness Calculators',
    boardSlug: 'health-and-fitness-calculators',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269614203/',
    published: '2026-07-15',
  },
  {
    title: 'Flooring Calculator For Room Area And Waste',
    description:
      'Estimate flooring from room size, pack coverage, and a waste allowance. Use the result for planning, then confirm pack coverage before buying.',
    path: '/tools/flooring-calculator/',
    imagePath: '/pinterest/flooring-calculator.jpg',
    category: 'Home Project Calculators',
    boardSlug: 'home-project-calculators',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269614243/',
    published: '2026-07-15',
  },
  {
    title: 'Area Calculator For Common Shapes',
    description:
      'Calculate area for rectangles, triangles, circles, trapezoids, and more, with units and formulas shown. Use it for study checks or early project planning.',
    path: '/tools/area-calculator/',
    imagePath: '/pinterest/area-calculator.jpg',
    category: 'School And Study Tools',
    boardSlug: 'school-and-study-tools',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269614267/',
    published: '2026-07-15',
  },
  {
    title: 'Engine Horsepower Calculator For Torque And RPM',
    description:
      'Calculate horsepower, torque, or RPM from two known values, then estimate engine and wheel horsepower with an editable drivetrain-loss assumption. Use it for comparison, not a dyno measurement.',
    path: '/tools/engine-horsepower-calculator/',
    imagePath: '/pinterest/engine-horsepower-calculator.jpg',
    category: 'Free Online Calculators',
    boardSlug: 'free-online-calculators',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269618404/',
    published: '2026-07-15',
  },
  {
    title: 'Markup And Margin Calculator Guide',
    description:
      'Learn how to calculate selling price from cost and markup, work backward from a target margin, and compare markup with margin using worked examples and a free calculator.',
    path: '/blog/how-to-use-markup-calculator/',
    imagePath: '/pinterest/markup-calculator-guide.jpg',
    category: 'Finance Calculators',
    boardSlug: 'finance-calculators',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269619244/',
    published: '2026-07-15',
  },
  {
    title: 'Matrix Calculator For 2x2 And 3x3 Steps',
    description:
      'Add, subtract, multiply, or transpose 2x2 and 3x3 matrices, or calculate determinants with clear steps and copyable results. Useful for checking homework and examples.',
    path: '/tools/matrix-calculator/',
    imagePath: '/pinterest/matrix-calculator.jpg',
    category: 'School And Study Tools',
    boardSlug: 'school-and-study-tools',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269619652/',
    published: '2026-07-15',
  },
  {
    title: 'Loan Calculator For Payments And Interest',
    description:
      'Estimate a fixed-rate loan payment, amount, interest rate, or payoff term, then compare total paid and total interest. Use the result for planning and confirm the written lender terms.',
    path: '/tools/loan-calculator/',
    imagePath: '/pinterest/loan-calculator.jpg',
    category: 'Finance Calculators',
    boardSlug: 'finance-calculators',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269620279/',
    published: '2026-07-15',
  },
  {
    title: 'Triangle Calculator For Sides, Area And Angles',
    description:
      'Check whether three sides form a triangle, find the possible third-side range, or calculate SSS area, perimeter, angles, and triangle type with the working shown.',
    path: '/tools/triangle-calculator/',
    imagePath: '/pinterest/triangle-calculator.jpg',
    category: 'School And Study Tools',
    boardSlug: 'school-and-study-tools',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269620399/',
    published: '2026-07-15',
  },
  {
    title: 'Horsepower To Watts And Kilowatts Converter',
    description:
      'Convert mechanical horsepower, metric horsepower, watts, and kilowatts. Useful for comparing motor, tool, and engine labels when you know which horsepower standard is being used.',
    path: '/tools/horsepower-calculator/',
    imagePath: '/pinterest/horsepower-calculator.jpg',
    category: 'Free Online Calculators',
    boardSlug: 'free-online-calculators',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269620640/',
    published: '2026-07-15',
  },
  {
    title: 'Target Heart Rate Zones By Age Or Pulse Count',
    description:
      'Estimate moderate and vigorous heart-rate zones by age, add resting pulse for a heart-rate-reserve comparison, or convert a timed pulse count to BPM. Educational only, not a personal medical limit.',
    path: '/tools/target-heart-rate-calculator/',
    imagePath: '/pinterest/target-heart-rate-calculator.jpg',
    category: 'Health And Fitness Calculators',
    boardSlug: 'health-and-fitness-calculators',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269621271/',
    published: '2026-07-15',
  },
  {
    title: 'Mileage Reimbursement Calculator With Trip Extras',
    description:
      'Calculate mileage reimbursement from miles and an allowed rate, then add eligible parking, tolls, or trip extras. Check the rate source and trip date because employer, contract, and tax rules can differ.',
    path: '/tools/mileage-calculator/',
    imagePath: '/pinterest/mileage-calculator.jpg',
    category: 'Finance Calculators',
    boardSlug: 'finance-calculators',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269621684/',
    published: '2026-07-15',
  },
  {
    title: 'VA Mortgage Funding Fee And Payment Guide',
    description:
      'Learn what to enter in a VA mortgage estimate, how funding-fee status, exemptions, and a financed fee can change the result, and why to compare written VA and lender paperwork. Planning only, not eligibility or approval.',
    path: '/blog/how-to-use-va-mortgage-calculator/',
    imagePath: '/pinterest/va-mortgage-calculator-guide.jpg',
    category: 'Finance Calculators',
    boardSlug: 'finance-calculators',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269622865/',
    published: '2026-07-15',
  },
  {
    title: 'UK Mortgage Repayment, Deposit And LTV Guide',
    description:
      'Learn how a UK repayment mortgage estimate uses property price, deposit, interest rate, term, and monthly fees. Compare repayment, loan amount, LTV, and total interest, then confirm lender quotes and buying costs.',
    path: '/blog/how-to-use-mortgage-calculator-uk/',
    imagePath: '/pinterest/mortgage-calculator-uk-guide.jpg',
    category: 'Finance Calculators',
    boardSlug: 'finance-calculators',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269623241/',
    published: '2026-07-15',
  },
  {
    title: 'Molarity, Moles And Grams Calculator Guide',
    description:
      'Use four formulas to find molarity, moles, or grams from final solution volume in L or mL. Includes a 0.2 M NaCl example and reminders to use the correct molar mass, hydration state, and lab safety instructions.',
    path: '/blog/how-to-use-molarity-calculator/',
    imagePath: '/pinterest/molarity-calculator-guide.jpg',
    category: 'School And Study Tools',
    boardSlug: 'school-and-study-tools',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269623415/',
    published: '2026-07-15',
  },
  {
    title: 'Big Number Calculator Guide For Exact Huge Integers',
    description:
      'Learn when ordinary browser numbers can lose integer precision, then add, subtract, multiply, or divide huge whole numbers exactly. See quotient, remainder, digit counts, and grouped versus raw copying.',
    path: '/blog/how-to-use-big-number-calculator/',
    imagePath: '/pinterest/big-number-calculator-guide.jpg',
    category: 'School And Study Tools',
    boardSlug: 'school-and-study-tools',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269623703/',
    published: '2026-07-15',
  },
  {
    title: 'Rounding Decimals And Significant Figures Guide',
    description:
      'Learn how to round by decimal places, significant figures, or place value, then compare nearest, round up, round down, and truncate methods. Includes negative-number and half-value examples.',
    path: '/blog/how-to-use-rounding-calculator/',
    imagePath: '/pinterest/rounding-calculator-guide.jpg',
    category: 'School And Study Tools',
    boardSlug: 'school-and-study-tools',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269623817/',
    published: '2026-07-15',
  },
  {
    title: 'BMR Calculator Mifflin-St Jeor Formula Guide',
    description:
      'Learn how the Mifflin-St Jeor formula estimates resting energy from age, formula sex, height, and weight, with worked kcal-per-day examples and BMR versus TDEE context. Educational estimate, not a calorie prescription or medical nutrition plan.',
    path: '/blog/how-to-use-bmr-calculator/',
    imagePath: '/pinterest/bmr-calculator-guide.jpg',
    category: 'Health And Fitness Calculators',
    boardSlug: 'health-and-fitness-calculators',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269624100/',
    published: '2026-07-15',
  },
  {
    title: '4-Band Resistor Color Code And Ohms Calculator',
    description:
      'Decode common 4-band resistor colors into nominal ohms, tolerance, minimum, and maximum values. Includes 220 ohm, 1 kOhm, 4.7 kOhm, 10 kOhm, and 47 kOhm examples. Check real parts with a multimeter and proper circuit safety.',
    path: '/tools/resistor-calculator/',
    imagePath: '/pinterest/resistor-calculator.jpg',
    category: 'School And Study Tools',
    boardSlug: 'school-and-study-tools',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269625000/',
    published: '2026-07-15',
  },
  {
    title: 'Take-Home Paycheck Calculator With FICA Estimate',
    description:
      'Estimate net pay per paycheck from salary, pay schedule, pretax deductions, entered tax percentages, and simplified 2026 employee FICA. Rough planning only, not Form W-4 withholding, a payroll system, or a tax return.',
    path: '/tools/take-home-paycheck-calculator/',
    imagePath: '/pinterest/take-home-paycheck-calculator.jpg',
    category: 'Finance Calculators',
    boardSlug: 'finance-calculators',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269626168/',
    published: '2026-07-15',
  },
  {
    title: 'Mortgage Refinance Savings And Break-Even Guide',
    description:
      'Compare a current loan with a refinance estimate using monthly payment, closing costs, break-even time, interest change, and total cost change. A lower payment can still cost more over a longer term, so confirm APR, points, fees, and lender disclosures.',
    path: '/blog/how-to-use-refinance-calculator/',
    imagePath: '/pinterest/refinance-calculator-guide.jpg',
    category: 'Finance Calculators',
    boardSlug: 'finance-calculators',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269632349/',
    published: '2026-07-15',
  },
  {
    title: 'Statistics Calculator For Mean, Median And Standard Deviation',
    description:
      'Summarize one list of numbers with count, sum, mean, median, mode, range, quartiles, IQR, sample variance, population variance, and standard deviation. Useful for class scores, survey responses, measurements, and spreadsheet checks.',
    path: '/tools/statistics-calculator/',
    imagePath: '/pinterest/statistics-calculator.jpg',
    category: 'School And Study Tools',
    boardSlug: 'school-and-study-tools',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269634450/',
    published: '2026-07-15',
  },
  {
    title: 'Half-Life Calculator Guide For Remaining Amount And Time',
    description:
      'Learn how to calculate remaining amount, elapsed time, or half-life with matching time units, percent remaining, halving steps, and worked examples. This is general decay math for study and planning, not dosing, medical, lab, or radiation-safety advice.',
    path: '/blog/how-to-use-half-life-calculator/',
    imagePath: '/pinterest/half-life-calculator-guide.jpg',
    category: 'School And Study Tools',
    boardSlug: 'school-and-study-tools',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269634943/',
    published: '2026-07-15',
  },
  {
    title: 'Copper Wire Resistance Calculator For AWG And Length',
    description:
      'Estimate total copper wire resistance from common AWG size, one-way length, and conductor count. The result is simplified planning math: temperature, strand type, material, connections, ampacity, breaker size, and local electrical code can change a real installation.',
    path: '/tools/wire-resistance-calculator/',
    imagePath: '/pinterest/wire-resistance-calculator.jpg',
    category: 'School And Study Tools',
    boardSlug: 'school-and-study-tools',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269636196/',
    published: '2026-07-15',
  },
  {
    title: 'Transparent Nutrition Points Calculator For Food Labels',
    description:
      'Compare equal-serving Nutrition Facts labels with an original visible formula using calories, saturated fat, added sugar, sodium, fiber, and protein. This is an Access Free Tools educational score, not Weight Watchers or WW, a universal food grade, or medical nutrition advice.',
    path: '/tools/nutrition-points-calculator/',
    imagePath: '/pinterest/nutrition-points-calculator.jpg',
    category: 'Health And Fitness Calculators',
    boardSlug: 'health-and-fitness-calculators',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269637171/',
    published: '2026-07-15',
  },
  {
    title: 'Sales Commission Calculator Guide For Gross, Split And Total Pay',
    description:
      'Estimate simple commission from sales and rate, apply a split, then add base pay or bonus. The guide explains gross commission, before-tax total pay, and limits such as tiers, quotas, clawbacks, draw plans, chargebacks, and written company rules.',
    path: '/blog/how-to-use-commission-calculator/',
    imagePath: '/pinterest/commission-calculator-guide.jpg',
    category: 'Finance Calculators',
    boardSlug: 'finance-calculators',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269639699/',
    published: '2026-07-15',
  },
  {
    title: 'Day Of The Week Calculator Guide For Any Calendar Date',
    description:
      'Find the weekday for a birthday, deadline, holiday, or event date, with ISO weekday numbers and Sunday-based indexes. This uses modern UTC calendar-date math; check time zones near midnight and specialized sources for historical calendar reforms.',
    path: '/blog/how-to-use-day-of-the-week-calculator/',
    imagePath: '/pinterest/day-of-the-week-calculator-guide.jpg',
    category: 'Free Online Calculators',
    boardSlug: 'free-online-calculators',
    status: 'posted',
    rssEligible: false,
    publicPinUrl: 'https://au.pinterest.com/pin/1148277236269780621/',
    published: '2026-07-17',
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
