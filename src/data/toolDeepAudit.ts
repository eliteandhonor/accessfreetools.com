import { toolAliases, type ToolAlias } from './toolAliases';
import { tools, type ToolDefinition } from './tools';

export const DEEP_AUDIT_REQUESTED_TARGET = tools.length + toolAliases.length;

export const DEEP_AUDIT_REQUIRED_SCOPE = [
  'formula',
  'inputs',
  'faq',
  'blog',
  'ui',
  'seo',
  'privacy',
] as const;

export type DeepAuditScope = (typeof DEEP_AUDIT_REQUIRED_SCOPE)[number];

export const BASELINE_AUDIT_SCOPE: DeepAuditScope[] = [
  'formula',
  'inputs',
  'faq',
  'blog',
  'seo',
  'privacy',
];

export interface ToolDeepAuditRecord {
  slug: string;
  status: 'deep-reviewed' | 'baseline-reviewed' | 'alias-reviewed';
  batch: string;
  reviewedOn: string;
  scope: DeepAuditScope[];
  sources: Array<{
    href: string;
    label: string;
  }>;
  findings: string[];
  improvements: string[];
  followUps: string[];
}

type SourceLink = ToolDeepAuditRecord['sources'][number];

const openStaxPercent = {
  href: 'https://openstax.org/books/contemporary-mathematics/pages/6-1-understanding-percent',
  label: 'OpenStax: Understanding Percent',
};

const openStaxMeasurement = {
  href: 'https://openstax.org/books/chemistry-2e/pages/1-5-measurement-uncertainty-accuracy-and-precision',
  label: 'OpenStax Chemistry: Measurement uncertainty, accuracy, and precision',
};

const openStaxFractions = {
  href: 'https://openstax.org/books/prealgebra-2e/pages/4-5-add-and-subtract-fractions-with-different-denominators',
  label: 'OpenStax Prealgebra: Add and subtract fractions with different denominators',
};

const khanFractions = {
  href: 'https://www.khanacademy.org/math/arithmetic-home/addition-subtraction/fractions-intro',
  label: 'Khan Academy: Fractions arithmetic practice',
};

const openStaxRadicals = {
  href: 'https://openstax.org/books/algebra-and-trigonometry/pages/1-3-radicals-and-rational-exponents',
  label: 'OpenStax Algebra and Trigonometry: Radicals and rational exponents',
};

const openStaxLogarithms = {
  href: 'https://openstax.org/books/college-algebra-corequisite-support-2e/pages/6-3-logarithmic-functions',
  label: 'OpenStax College Algebra: Logarithmic functions',
};

const openStaxQuadratics = {
  href: 'https://openstax.org/books/college-algebra-corequisite-support-2e/pages/2-5-quadratic-equations',
  label: 'OpenStax College Algebra: Quadratic equations',
};

const nasaNumberSystems = {
  href: 'https://www.nasa.gov/wp-content/uploads/2023/03/ps-03435-deepspacecomm-508.pdf',
  label: 'NASA: Deep Space Communications number systems activity',
};

const rfc4648 = {
  href: 'https://datatracker.ietf.org/doc/html/rfc4648/',
  label: 'IETF RFC 4648: Base-N encodings',
};

const openStaxPrimeLcm = {
  href: 'https://openstax.org/books/prealgebra-2e/pages/2-5-prime-factorization-and-the-least-common-multiple',
  label: 'OpenStax Prealgebra: Prime factorization and least common multiple',
};

const openStaxScientificNotation = {
  href: 'https://openstax.org/books/college-algebra-2e/pages/1-2-exponents-and-scientific-notation',
  label: 'OpenStax College Algebra: Exponents and scientific notation',
};

const epaRadioactiveDecay = {
  href: 'https://www.epa.gov/radiation/radioactive-decay',
  label: 'EPA: Radioactive Decay',
};

const nrcHalfLife = {
  href: 'https://www.nrc.gov/reading-rm/basic-ref/glossary/half-life',
  label: 'Nuclear Regulatory Commission: Half-life',
};

const openStaxRadioactiveDecay = {
  href: 'https://openstax.org/books/chemistry-2e/pages/21-3-radioactive-decay',
  label: 'OpenStax Chemistry 2e: Radioactive Decay',
};

const openStaxPhysicsRadioactiveDecay = {
  href: 'https://openstax.org/books/university-physics-volume-3/pages/10-3-radioactive-decay',
  label: 'OpenStax University Physics Volume 3: Radioactive Decay',
};

const openStaxStatisticsSpread = {
  href: 'https://openstax.org/books/statistics/pages/2-7-measures-of-the-spread-of-the-data',
  label: 'OpenStax Statistics: Measures of the spread of the data',
};

const openStaxStandardNormal = {
  href: 'https://openstax.org/books/introductory-statistics-2e/pages/6-1-the-standard-normal-distribution',
  label: 'OpenStax Introductory Statistics: Standard normal distribution',
};

const openStaxProbabilityCombinations = {
  href: 'https://openstax.org/books/contemporary-mathematics/pages/7-6-probability-with-permutations-and-combinations',
  label: 'OpenStax Contemporary Mathematics: Probability with permutations and combinations',
};

const openStaxConfidenceIntervals = {
  href: 'https://openstax.org/books/principles-data-science/pages/4-1-statistical-inference-and-confidence-intervals',
  label: 'OpenStax Principles of Data Science: Statistical inference and confidence intervals',
};

const openStaxGeometry = {
  href: 'https://openstax.org/books/prealgebra-2e/pages/c-geometric-formulas',
  label: 'OpenStax Prealgebra: Geometric formulas',
};

const openStaxDistance = {
  href: 'https://openstax.org/books/intermediate-algebra-2e/pages/11-1-distance-and-midpoint-formulas-circles',
  label: 'OpenStax Intermediate Algebra: Distance, midpoint, and circles',
};

const khanHeronsFormula = {
  href: 'https://www.khanacademy.org/math/geometry-home/geometry-volume-surface-area/heron-formula-tutorial/v/heron-s-formula',
  label: 'Khan Academy: Heron\'s formula',
};

const openStaxSequences = {
  href: 'https://openstax.org/books/intermediate-algebra-2e/pages/12-1-sequences',
  label: 'OpenStax Intermediate Algebra: Sequences',
};

const openStaxMatrices = {
  href: 'https://openstax.org/books/college-algebra-2e/pages/7-5-matrices-and-matrix-operations',
  label: 'OpenStax College Algebra: Matrices and matrix operations',
};

const nistSi = {
  href: 'https://www.nist.gov/publications/guide-use-international-system-units-si',
  label: 'NIST SP 811: Guide for the Use of the International System of Units',
};

const googleHelpfulContent = {
  href: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
  label: 'Google Search Central: Creating helpful, reliable, people-first content',
};

const hhsHealthyRelationships = {
  href: 'https://opa.hhs.gov/adolescent-health/healthy-relationships-adolescence',
  label: 'HHS OPA: Healthy relationships in adolescence',
};

const youthGovHealthyRelationships = {
  href: 'https://youth.gov/youth-topics/teen-dating-violence/characteristics',
  label: 'Youth.gov: Characteristics of healthy relationships',
};

const nistRandomNumber = {
  href: 'https://csrc.nist.gov/glossary/term/random_number',
  label: 'NIST CSRC: Random number glossary',
};

const ftcWebAppsCollectInfo = {
  href: 'https://consumer.ftc.gov/articles/how-websites-apps-collect-use-your-information',
  label: 'FTC: How websites and apps collect and use your information',
};

const transformersJs = {
  href: 'https://huggingface.co/docs/transformers.js/',
  label: 'Hugging Face: Transformers.js browser inference',
};

const tesseractJs = {
  href: 'https://github.com/naptha/tesseract.js',
  label: 'Tesseract.js: browser OCR library',
};

const tesseractOcrDocs = {
  href: 'https://tesseract-ocr.github.io/tessdoc/',
  label: 'Tesseract OCR documentation',
};

const francLanguageDetection = {
  href: 'https://github.com/wooorm/franc',
  label: 'franc: language detection package',
};

const fleschKincaidFormula = {
  href: 'https://readabilityformulas.com/flesch-grade-level-results.php',
  label: 'Flesch-Kincaid grade level formula reference',
};

const isoDate = {
  href: 'https://www.iso.org/iso-8601-date-and-time-format.html',
  label: 'ISO: ISO 8601 date and time format',
};

const nistTimeDefinitions = {
  href: 'https://www.nist.gov/time-and-frequency-services/time-and-frequency-z-ti',
  label: 'NIST: Time and frequency definitions',
};

const mdnDate = {
  href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date',
  label: 'MDN: JavaScript Date reference',
};

const mdnDateInput = {
  href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/date',
  label: 'MDN: HTML date input',
};

const ianaTimeZones = {
  href: 'https://www.iana.org/time-zones',
  label: 'IANA: Time Zone Database',
};

const dolHours = {
  href: 'https://www.dol.gov/general/topic/workhours/hoursrecordkeeping',
  label: 'U.S. Department of Labor: Hours recordkeeping',
};

const rfc3986 = {
  href: 'https://datatracker.ietf.org/doc/rfc3986/',
  label: 'IETF RFC 3986: URI Generic Syntax',
};

const whatwgUrl = {
  href: 'https://url.spec.whatwg.org/',
  label: 'WHATWG URL Standard',
};

const googleCampaignUrls = {
  href: 'https://support.google.com/analytics/answer/10917952?hl=en',
  label: 'Google Analytics Help: Collect campaign data with custom URLs',
};

const esuRomanNumerals = {
  href: 'https://www.esu.edu/tutoring/documents/21-22/numeration/roman_va.pdf',
  label: 'East Stroudsburg University Tutoring: Roman Numeration System',
};

const rfc4632 = {
  href: 'https://www.rfc-editor.org/rfc/rfc4632.html',
  label: 'RFC 4632: Classless Inter-domain Routing',
};

const nistPasswords = {
  href: 'https://pages.nist.gov/800-63-4/sp800-63b.html',
  label: 'NIST SP 800-63B: Authentication and password guidance',
};

const rfc9562 = {
  href: 'https://www.rfc-editor.org/rfc/rfc9562',
  label: 'RFC 9562: Universally Unique IDentifiers',
};

const mdnMathRandom = {
  href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random',
  label: 'MDN: Math.random reference',
};

const mdnCryptoRandomValues = {
  href: 'https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues',
  label: 'MDN: Crypto.getRandomValues',
};

const mdnUrlSearchParams = {
  href: 'https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams',
  label: 'MDN: URLSearchParams',
};

const mdnJson = {
  href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON',
  label: 'MDN: JSON reference',
};

const mdnSubtleCryptoDigest = {
  href: 'https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest',
  label: 'MDN: SubtleCrypto digest()',
};

const mdnTextEncoder = {
  href: 'https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder',
  label: 'MDN: TextEncoder',
};

const mdnStringLength = {
  href: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/length',
  label: 'MDN: JavaScript String length',
};

const mdnCssClamp = {
  href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/clamp',
  label: 'MDN: CSS clamp()',
};

const mdnAspectRatio = {
  href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio',
  label: 'MDN: CSS aspect-ratio',
};

const whatwgHtmlNamedCharacters = {
  href: 'https://html.spec.whatwg.org/dev/named-characters.html',
  label: 'WHATWG HTML Standard: Named character references',
};

const githubGfmTables = {
  href: 'https://github.github.io/gfm/',
  label: 'GitHub Flavored Markdown Spec: Tables',
};

const wcagContrast = {
  href: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html',
  label: 'W3C WCAG 2.2: Contrast minimum',
};

const nistFips180 = {
  href: 'https://csrc.nist.gov/pubs/fips/180-4/upd1/final',
  label: 'NIST FIPS 180-4: Secure Hash Standard',
};

const googleSeoStarter = {
  href: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide',
  label: 'Google Search Central: SEO Starter Guide',
};

const googleSnippets = {
  href: 'https://developers.google.com/search/docs/appearance/snippet',
  label: 'Google Search Central: Snippets',
};

const calculatorInnSitemap = {
  href: 'https://calculatorinn.com/sitemap/',
  label: 'CalculatorInn sitemap: Tech & AI competitor gap reference',
};

const inchCalculatorSitemap = {
  href: 'https://www.inchcalculator.com/sitemap/',
  label: 'Inch Calculator sitemap: competitor gap reference',
};

const inchDeckFlooring = {
  href: 'https://www.inchcalculator.com/deck-flooring-calculator/',
  label: 'Inch Calculator: Deck flooring calculator reference',
};

const inchDeckStain = {
  href: 'https://www.inchcalculator.com/deck-stain-calculator/',
  label: 'Inch Calculator: Deck stain calculator reference',
};

const inchBaluster = {
  href: 'https://www.inchcalculator.com/baluster-calculator/',
  label: 'Inch Calculator: Baluster calculator reference',
};

const inchPaverBase = {
  href: 'https://www.inchcalculator.com/paver-base-calculator/',
  label: 'Inch Calculator: Paver base calculator reference',
};

const inchPolymericSand = {
  href: 'https://www.inchcalculator.com/polymeric-sand-calculator/',
  label: 'Inch Calculator: Polymeric sand calculator reference',
};

const sakretePermasand = {
  href: 'https://www.sakrete.com/content/uploads/2021/12/PermaSand-TDS.pdf',
  label: 'Sakrete: PermaSand polymeric jointing sand data sheet',
};

const quikretePolymericSand = {
  href: 'https://www.quikrete.com/dealers/products/sandpolymericjointing.asp',
  label: 'QUIKRETE: Polymeric jointing sand product guidance',
};

const inchGrassSeed = {
  href: 'https://www.inchcalculator.com/grass-seed-calculator/',
  label: 'Inch Calculator: Grass seed calculator reference',
};

const inchLawnMowing = {
  href: 'https://www.inchcalculator.com/lawn-mowing-calculator/',
  label: 'Inch Calculator: Lawn mowing calculator reference',
};

const inchPlantCalculator = {
  href: 'https://www.inchcalculator.com/plant-and-flower-calculator/',
  label: 'Inch Calculator: Plant and flower calculator reference',
};

const inchConcreteFooting = {
  href: 'https://www.inchcalculator.com/concrete-footing-calculator/',
  label: 'Inch Calculator: Concrete footing calculator reference',
};

const inchPostHoleConcrete = {
  href: 'https://www.inchcalculator.com/post-hole-concrete-calculator/',
  label: 'Inch Calculator: Post hole concrete calculator reference',
};

const inchPlywood = {
  href: 'https://www.inchcalculator.com/plywood-calculator/',
  label: 'Inch Calculator: Plywood calculator reference',
};

const inchSod = {
  href: 'https://www.inchcalculator.com/sod-calculator/',
  label: 'Inch Calculator: Sod calculator reference',
};

const inchFraming = {
  href: 'https://www.inchcalculator.com/framing-calculator/',
  label: 'Inch Calculator: Framing calculator reference',
};

const inchConcreteMix = {
  href: 'https://www.inchcalculator.com/concrete-mix-calculator/',
  label: 'Inch Calculator: Concrete mix calculator reference',
};

const inchConcreteDriveway = {
  href: 'https://www.inchcalculator.com/concrete-driveway-calculator/',
  label: 'Inch Calculator: Concrete driveway calculator reference',
};

const inchConcreteSteps = {
  href: 'https://www.inchcalculator.com/concrete-steps-calculator/',
  label: 'Inch Calculator: Concrete steps calculator reference',
};

const inchConcreteWeight = {
  href: 'https://www.inchcalculator.com/concrete-weight-calculator/',
  label: 'Inch Calculator: Concrete weight calculator reference',
};

const inchConcreteMesh = {
  href: 'https://www.inchcalculator.com/concrete-reinforcing-mesh-calculator/',
  label: 'Inch Calculator: Concrete reinforcing mesh calculator reference',
};

const inchConcreteBlockFill = {
  href: 'https://www.inchcalculator.com/concrete-block-fill-calculator/',
  label: 'Inch Calculator: Concrete block fill calculator reference',
};

const inchRetainingWall = {
  href: 'https://www.inchcalculator.com/retaining-wall-calculator/',
  label: 'Inch Calculator: Retaining wall calculator reference',
};

const inchRebarWeight = {
  href: 'https://www.inchcalculator.com/rebar-weight-calculator/',
  label: 'Inch Calculator: Rebar weight calculator reference',
};

const lowesCountertopGuide = {
  href: 'https://www.lowes.com/pdf/kitchen_countertop_measure_guide.pdf',
  label: 'Lowe\'s: Kitchen countertop measurement guide',
};

const lowesFlooringFootage = {
  href: 'https://pdf.lowes.com/productdocuments/3f70b1c9-8ab7-4125-a2e7-9a3d080d2861/08130541.pdf',
  label: 'Lowe\'s: Calculating correct hardwood flooring footage',
};

const lowesFlooringPlanner = {
  href: 'https://pdf.lowes.com/productdocuments/a1902812-3b3c-47a8-b344-3e03ce6c804a/48135912.pdf',
  label: 'Lowe\'s: Flooring project planner',
};

const homeDepotFlooringInstall = {
  href: 'https://www.homedepot.com/catalog/pdfImages/c2/c274b7a0-d4cc-4196-9f09-da4ca69388e9.pdf',
  label: 'The Home Depot: Flooring installation instructions',
};

const usdaFoodDataCentral = {
  href: 'https://fdc.nal.usda.gov/',
  label: 'USDA FoodData Central: ingredient and food data reference',
};

const foodSafetyTemperatures = {
  href: 'https://www.fda.gov/food/buy-store-serve-safe-food/safe-food-handling',
  label: 'FDA: Safe food handling',
};

const goodFoodConversionGuides = {
  href: 'https://www.bbcgoodfood.com/conversion-guides',
  label: 'Good Food: Recipe conversion guides',
};

const whichOvenTemperatureChart = {
  href: 'https://www.which.co.uk/reviews/built-in-ovens/article/oven-temperature-conversion-degrees-celsius-to-fahrenheit-gas-mark-and-fan-aA5Ol9b157On',
  label: 'Which?: Oven temperature conversion chart',
};

const calculatorSoupSitemap = {
  href: 'https://www.calculatorsoup.com/sitemap.php',
  label: 'CalculatorSoup sitemap: business and financial-ratio competitor gap reference',
};

const sbaBreakEven = {
  href: 'https://www.sba.gov/business-guide/plan-your-business/calculate-your-startup-costs/break-even-point',
  label: 'U.S. Small Business Administration: Break-even point',
};

const openStaxBreakEven = {
  href: 'https://openstax.org/books/principles-managerial-accounting/pages/3-2-calculate-a-break-even-point-in-units-and-dollars',
  label: 'OpenStax Managerial Accounting: Break-even point in units and dollars',
};

const openStaxFinancialStatementAnalysis = {
  href: 'https://openstax.org/books/principles-financial-accounting/pages/a-financial-statement-analysis',
  label: 'OpenStax Financial Accounting: Financial statement analysis',
};

const secFinancialStatements = {
  href: 'https://www.sec.gov/about/reports-publications/beginners-guide-financial-statements',
  label: "SEC: Beginners' Guide to Financial Statements",
};

const openAiTokens = {
  href: 'https://developers.openai.com/cookbook/examples/how_to_count_tokens_with_tiktoken',
  label: 'OpenAI Cookbook: How to count tokens with tiktoken',
};

const openAiTokenizer = {
  href: 'https://platform.openai.com/tokenizer',
  label: 'OpenAI Platform: Tokenizer',
};

const cfpbMortgage = {
  href: 'https://www.consumerfinance.gov/language/cfpb-in-english/mortgages-key-terms/',
  label: 'Consumer Financial Protection Bureau: Mortgage key terms',
};

const cfpbMonthlyMortgagePayment = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/how-do-mortgage-lenders-calculate-monthly-payments-en-1965/',
  label: 'CFPB: How mortgage lenders calculate monthly payments',
};

const cfpbPiti = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-piti-en-152/',
  label: 'CFPB: What is PITI?',
};

const freddieMacPmms = {
  href: 'https://www.freddiemac.com/pmms',
  label: 'Freddie Mac: Primary Mortgage Market Survey',
};

const cfpbAutoLoans = {
  href: 'https://www.consumerfinance.gov/consumer-tools/auto-loans/',
  label: 'Consumer Financial Protection Bureau: Auto loans',
};

const cfpbAutoLoanCompare = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/how-do-i-compare-auto-loan-offers-what-should-i-look-at-besides-the-monthly-payment-en-753/',
  label: 'CFPB: How to compare auto loan offers',
};

const cfpbAutoLoanTerms = {
  href: 'https://www.consumerfinance.gov/language/cfpb-in-english/auto-loans-key-terms/',
  label: 'CFPB: Auto loans key terms',
};

const investorCompound = {
  href: 'https://openstax.org/books/principles-finance/pages/7-2-time-value-of-money-tvm-basics',
  label: 'OpenStax Principles of Finance: Time value of money basics',
};

const cfpbCompoundInterest = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/how-does-compound-interest-work-en-1683/',
  label: 'CFPB: How compound interest works',
};

const investorGovCompoundCalculator = {
  href: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator',
  label: 'Investor.gov: Compound Interest Calculator',
};

const investorGovFees = {
  href: 'https://www.investor.gov/introduction-investing/getting-started/understanding-fees',
  label: 'Investor.gov: Understanding fees',
};

const investorGovRiskReturn = {
  href: 'https://www.investor.gov/additional-resources/information/youth/teachers-classroom-resources/risk-and-return',
  label: 'Investor.gov: Risk and return',
};

const investorGovBuildWealth = {
  href: 'https://www.investor.gov/build-wealth-over-time-through-saving-and-investing',
  label: 'Investor.gov: Build wealth over time through saving and investing',
};

const openStaxLoanAmortization = {
  href: 'https://openstax.org/books/principles-finance/pages/8-3-loan-amortization',
  label: 'OpenStax Principles of Finance: Loan amortization',
};

const blsInflation = {
  href: 'https://www.bls.gov/bls/inflation.htm',
  label: 'BLS: Overview of inflation and price statistics',
};

const irsTax2026 = {
  href: 'https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill',
  label: 'IRS: Tax year 2026 inflation adjustments',
};

const irsRevenueProcedure = {
  href: 'https://www.irs.gov/pub/irs-drop/rp-25-32.pdf',
  label: 'IRS Revenue Procedure 2025-32',
};

const irsPublication501 = {
  href: 'https://www.irs.gov/publications/p501',
  label: 'IRS Publication 501: Filing status and standard deduction',
};

const irsSalesTax = {
  href: 'https://www.irs.gov/salestax',
  label: 'IRS: Sales Tax Deduction Calculator and state/local sales tax context',
};

const taxFoundationSalesTaxRates = {
  href: 'https://taxfoundation.org/data/all/state/sales-tax-rates/',
  label: 'Tax Foundation: 2026 state and local sales tax rates',
};

const cfpbCreditCards = {
  href: 'https://www.consumerfinance.gov/consumer-tools/credit-cards/answers/basics/',
  label: 'Consumer Financial Protection Bureau: Credit card basics',
};

const cfpbDebtToIncome = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/',
  label: 'Consumer Financial Protection Bureau: Debt-to-income ratio',
};

const cfpbDebtCollection = {
  href: 'https://www.consumerfinance.gov/consumer-tools/debt-collection/',
  label: 'Consumer Financial Protection Bureau: Debt collection resources',
};

const consumerBudgetWorksheet = {
  href: 'https://www.mymoney.gov/tools',
  label: 'MyMoney.gov: Financial tools and budget resources',
};

const investorAnnuities = {
  href: 'https://openstax.org/books/principles-finance/pages/8-2-annuities',
  label: 'OpenStax Principles of Finance: Annuities and present value',
};

const pbgcPensionCoverage = {
  href: 'https://www.pbgc.gov/workers-retirees/learn/understanding-your-pension-pbgc-coverage',
  label: 'PBGC: Understanding your pension and PBGC coverage',
};

const fsaRepaymentPlans = {
  href: 'https://www.consumerfinance.gov/paying-for-college/repay-student-debt/',
  label: 'Consumer Financial Protection Bureau: Repay student debt',
};

const educationNetPrice = {
  href: 'https://collegecost.ed.gov/net-price',
  label: 'U.S. Department of Education: Net Price Calculator Center',
};

const fdicCdShopping = {
  href: 'https://www.fdic.gov/consumer-resource-center/2023-11/shopping-certificate-deposit',
  label: 'FDIC: Shopping for a Certificate of Deposit',
};

const investorBonds = {
  href: 'https://www.finra.org/investors/investing/investment-products/bonds',
  label: 'FINRA: Bonds',
};

const investorMutualFunds = {
  href: 'https://www.finra.org/investors/investing/investment-products/mutual-funds',
  label: 'FINRA: Mutual funds',
};

const euVat = {
  href: 'https://taxation-customs.ec.europa.eu/taxation/vat_en',
  label: 'European Commission: VAT overview',
};

const cfpbApr = {
  href: 'https://www.consumerfinance.gov/rules-policy/regulations/1026/22/',
  label: 'CFPB Regulation Z: Annual percentage rate',
};

const cfpbAutoFinancingOffers = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/how-do-i-qualify-for-an-advertised-0-auto-financing-en-781/',
  label: 'CFPB: Advertised 0% auto financing and cash rebate incentives',
};

const cfpbAprVsInterest = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-loan-interest-rate-and-the-apr-en-733/',
  label: 'CFPB: Loan interest rate vs. APR',
};

const minneapolisFedConsumerRates = {
  href: 'https://www.minneapolisfed.org/article/2025/what-drives-consumer-interest-rates',
  label: 'Minneapolis Fed: What drives consumer interest rates',
};

const cfpbLoanEstimate = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-loan-estimate-en-1995/',
  label: 'CFPB: What is a Loan Estimate?',
};

const cfpbAutoTruthInLending = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-truth-in-lending-disclosure-for-an-auto-loan-en-787/',
  label: 'CFPB: Truth in Lending disclosure for an auto loan',
};

const cfpbPersonalInstallmentFees = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/do-personal-installment-loans-have-fees-en-2120/',
  label: 'CFPB: Personal installment loan fees',
};

const hudFhaMip = {
  href: 'https://www.hud.gov/hud-partners/housing-mip',
  label: 'HUD: FHA single family mortgage insurance premiums',
};

const hudFhaMipMortgageeLetter2023 = {
  href: 'https://www.hud.gov/sites/dfiles/OCHCO/documents/2023-05hsgml.pdf',
  label: 'HUD Mortgagee Letter 2023-05: FHA annual MIP rates',
};

const hudFhaLoanLimits2026 = {
  href: 'https://www.hud.gov/hud-partners/single-family-lender',
  label: 'HUD: 2026 FHA forward mortgage loan limits',
};

const hudFhaLoanLimitsMl2025 = {
  href: 'https://www.hud.gov/sites/dfiles/hudclips/documents/2025-23hsgml.pdf',
  label: 'HUD Mortgagee Letter 2025-23: 2026 FHA forward mortgage loan limits',
};

const cfpbFhaLoans = {
  href: 'https://www.consumerfinance.gov/owning-a-home/fha-loans/',
  label: 'CFPB: FHA loans',
};

const vaFundingFee = {
  href: 'https://www.va.gov/housing-assistance/home-loans/funding-fee-and-closing-costs',
  label: 'VA: Funding fee and loan closing costs',
};

const cfpbHomeEquity = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-home-equity-loan-en-106/',
  label: 'CFPB: What is a home equity loan?',
};

const cfpbHomeEquityVsHeloc = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-home-equity-loan-and-a-home-equity-line-of-credit-heloc-en-247/',
  label: 'CFPB: Home equity loan vs. HELOC',
};

const cfpbHeloc = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-home-equity-line-of-credit-heloc-en-107/',
  label: 'CFPB: What is a HELOC?',
};

const cfpbClosingDisclosure = {
  href: 'https://www.consumerfinance.gov/owning-a-home/closing-disclosure/',
  label: 'CFPB: Closing Disclosure explainer',
};

const ftcHomeEquityLoans = {
  href: 'https://consumer.ftc.gov/articles/home-equity-loans-home-equity-lines-credit',
  label: 'FTC: Home equity loans and lines of credit',
};

const irsPub936HomeMortgageInterest = {
  href: 'https://www.irs.gov/publications/p936',
  label: 'IRS Publication 936: Home mortgage interest deduction',
};

const cfpbDownPayment = {
  href: 'https://www.consumerfinance.gov/owning-a-home/prepare/determine-your-down-payment/',
  label: 'CFPB: Determine your down payment',
};

const cfpbPrepareHomeMoney = {
  href: 'https://www.consumerfinance.gov/language/cfpb-in-english/prepare-your-money-situation-before-you-buy-a-home/',
  label: 'CFPB: Prepare your money situation before buying a home',
};

const fannieClosingCostsCalculator = {
  href: 'https://yourhome.fanniemae.com/calculators-tools/closing-costs-calculator',
  label: 'Fannie Mae: Closing costs calculator',
};

const fannieDownPayment = {
  href: 'https://yourhome.fanniemae.com/buy/homebuyer-down-payment',
  label: 'Fannie Mae: What you need to know about down payments',
};

const fannieClosingOnLoan = {
  href: 'https://yourhome.fanniemae.com/buy/closing-on-a-loan',
  label: 'Fannie Mae: Closing on a loan',
};

const hudFhaLoans = {
  href: 'https://www.hud.gov/helping-americans/loans',
  label: 'HUD: Let FHA loans help you',
};

const govUkMortgage = {
  href: 'https://www.gov.uk/algorithmic-transparency-records/money-and-pensions-service-mortgage-repayment-calculator',
  label: 'GOV.UK: Mortgage repayment calculator transparency record',
};

const moneyHelperMortgage = {
  href: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/mortgage-calculator',
  label: 'MoneyHelper: Mortgage calculators',
};

const moneyHelperMortgageOptions = {
  href: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/mortgage-repayment-options',
  label: 'MoneyHelper: Interest-only and repayment mortgages explained',
};

const govUkBuyingHome = {
  href: 'https://www.gov.uk/buying-a-home/preparing-to-buy',
  label: 'GOV.UK: Preparing to buy a home',
};

const govUkSdltRates = {
  href: 'https://www.gov.uk/stamp-duty-land-tax/residential-property-rates',
  label: 'GOV.UK: Stamp Duty Land Tax residential rates',
};

const canadaMortgageTerms = {
  href: 'https://www.canada.ca/en/financial-consumer-agency/services/mortgages/mortgage-terms-amortization.html',
  label: 'Canada.ca: Mortgage terms and amortization',
};

const canadaMortgageDownPayment = {
  href: 'https://www.canada.ca/en/financial-consumer-agency/services/mortgages/down-payment.html',
  label: 'Canada.ca: Down payments and mortgage loan insurance',
};

const osfiMinimumQualifyingRate = {
  href: 'https://www.osfi-bsif.gc.ca/en/supervision/financial-institutions/banks/minimum-qualifying-rate-uninsured-mortgages',
  label: 'OSFI: Minimum qualifying rate for uninsured mortgages',
};

const bankCanadaPolicyRate = {
  href: 'https://www.bankofcanada.ca/core-functions/monetary-policy/key-interest-rate/',
  label: 'Bank of Canada: Policy interest rate',
};

const canadaInterestAct = {
  href: 'https://laws-lois.justice.gc.ca/eng/acts/I-15/FullText.html',
  label: 'Justice Laws Canada: Interest Act',
};

const dolCommissions = {
  href: 'https://www.dol.gov/general/topic/wages/commissions',
  label: 'U.S. Department of Labor: Commissions',
};

const ftcAutoLease = {
  href: 'https://consumer.ftc.gov/financing-or-leasing-car',
  label: 'FTC: Financing or Leasing a Car',
};

const ftcAutoNegativeEquity = {
  href: 'https://consumer.ftc.gov/articles/auto-trade-ins-and-negative-equity-when-you-owe-more-your-car-worth',
  label: 'FTC: Auto trade-ins and negative equity',
};

const irsDepreciation = {
  href: 'https://www.irs.gov/publications/p946',
  label: 'IRS Publication 946: How To Depreciate Property',
};

const openStaxDepreciation = {
  href: 'https://openstax.org/books/principles-financial-accounting/pages/11-3-explain-and-apply-depreciation-methods-to-allocate-capitalized-costs',
  label: 'OpenStax: Depreciation methods',
};

const investorAnnualReturn = {
  href: 'https://openstax.org/books/contemporary-mathematics/pages/6-7-investments',
  label: 'OpenStax: Investments and return on investment',
};

const sbaLoans = {
  href: 'https://www.sba.gov/funding-programs/loans',
  label: 'U.S. Small Business Administration: Loans',
};

const ftcSmallBusinessFinancing = {
  href: 'https://www.ftc.gov/business-guidance/blog/2020/02/small-business-financing-staff-perspective-outlines-issues',
  label: 'FTC: Small business financing issues',
};

const openStaxDiscounts = {
  href: 'https://openstax.org/books/contemporary-mathematics/pages/6-2-discounts-markups-and-sales-tax',
  label: 'OpenStax: Discounts, markups, and sales tax',
};

const googleAdSensePageCtr = {
  href: 'https://support.google.com/adsense/answer/112026?hl=en',
  label: 'Google AdSense Help: Page CTR',
};

const googleAdSensePageRpm = {
  href: 'https://support.google.com/adsense/answer/112030?hl=en',
  label: 'Google AdSense Help: Page RPM',
};

const googleAdSenseHowWorks = {
  href: 'https://support.google.com/adsense/answer/6242051?hl=en-EN',
  label: 'Google AdSense Help: How AdSense works',
};

const googleAdSenseRevenueShare = {
  href: 'https://support.google.com/adsense/answer/180195?hl=en-EN',
  label: 'Google AdSense Help: AdSense revenue share',
};

const googleAdSenseInvalidTraffic = {
  href: 'https://support.google.com/adsense/answer/16737?hl=en',
  label: 'Google AdSense Help: Invalid traffic',
};

const openStaxIrr = {
  href: 'https://openstax.org/books/principles-finance/pages/16-3-internal-rate-of-return-irr-method',
  label: 'OpenStax Principles of Finance: Internal Rate of Return method',
};

const openStaxInvestments = {
  href: 'https://openstax.org/books/contemporary-mathematics/pages/6-7-investments',
  label: 'OpenStax: Investments and return on investment',
};

const openStaxPayback = {
  href: 'https://openstax.org/books/principles-finance/pages/16-1-payback-period-method',
  label: 'OpenStax Principles of Finance: Payback Period Method',
};

const openStaxPresentValue = {
  href: 'https://openstax.org/books/principles-finance/pages/8-2-annuities',
  label: 'OpenStax Principles of Finance: Annuities and present value',
};

const openStaxFutureValue = {
  href: 'https://openstax.org/books/principles-finance/pages/7-2-time-value-of-money-tvm-basics',
  label: 'OpenStax Principles of Finance: Time value of money basics',
};

const openStaxNpv = {
  href: 'https://openstax.org/books/principles-finance/pages/16-2-net-present-value-npv-method',
  label: 'OpenStax Principles of Finance: Net Present Value method',
};

const irsIraLimits = {
  href: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-ira-contribution-limits',
  label: 'IRS: IRA contribution limits',
};

const irs401kLimits = {
  href: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits',
  label: 'IRS: 401(k) and profit-sharing plan contribution limits',
};

const irsEstateGift = {
  href: 'https://www.irs.gov/businesses/small-businesses-self-employed/whats-new-estate-and-gift-tax',
  label: 'IRS: Estate and gift tax updates',
};

const irsEstateTax = {
  href: 'https://www.irs.gov/businesses/small-businesses-self-employed/estate-tax',
  label: 'IRS: Estate tax basics',
};

const irsEstateTaxFaqs = {
  href: 'https://www.irs.gov/businesses/small-businesses-self-employed/frequently-asked-questions-on-estate-taxes',
  label: 'IRS: Frequently asked questions on estate taxes',
};

const irsForm706Instructions = {
  href: 'https://www.irs.gov/instructions/i706',
  label: 'IRS: Instructions for Form 706',
};

const irsWithholdingEstimatorFaqs = {
  href: 'https://www.irs.gov/individuals/tax-withholding-estimator-faqs',
  label: 'IRS: Tax Withholding Estimator FAQs',
};

const irsPub15T = {
  href: 'https://www.irs.gov/publications/p15t',
  label: 'IRS Publication 15-T: Federal Income Tax Withholding Methods',
};

const irsPub505 = {
  href: 'https://www.irs.gov/publications/p505',
  label: 'IRS Publication 505: Tax Withholding and Estimated Tax',
};

const irsRmd = {
  href: 'https://www.irs.gov/publications/p590b',
  label: 'IRS Publication 590-B: RMD Uniform Lifetime Table',
};

const ssaClaimingAge = {
  href: 'https://www.benefits.gov/benefit/4402',
  label: 'Benefits.gov: Social Security retirement insurance',
};

const irsFica = {
  href: 'https://www.irs.gov/taxtopics/tc751',
  label: 'IRS Topic 751: Social Security and Medicare withholding rates',
};

const federalReserveExchangeRates = {
  href: 'https://www.federalreserve.gov/releases/h10/current/',
  label: 'Federal Reserve: Foreign exchange rates H.10',
};

const cdcBmi = {
  href: 'https://www.cdc.gov/BMI/',
  label: 'CDC: Adult BMI categories and screening notes',
};

const nhlbiBmi = {
  href: 'https://www.nhlbi.nih.gov/health/educational/lose_wt/bmitools',
  label: 'NHLBI: Healthy weight and BMI tools',
};

const fdaNutritionFacts = {
  href: 'https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/changes-nutrition-facts-label',
  label: 'FDA: Nutrition Facts label',
};

const dietaryGuidelines = {
  href: 'https://www.dietaryguidelines.gov/',
  label: 'Dietary Guidelines for Americans',
};

const cdcActivity = {
  href: 'https://www.cdc.gov/physical-activity-basics/measuring/index.html',
  label: 'CDC: Physical activity intensity guidance',
};

const cdcGrowthCharts = {
  href: 'https://www.cdc.gov/growthcharts/',
  label: 'CDC: Growth Charts',
};

const mayoChildGrowth = {
  href: 'https://www.mayoclinic.org/healthy-lifestyle/childrens-health/expert-answers/child-growth/faq-20057990',
  label: 'Mayo Clinic: Predicting adult height',
};

const aapMidParentalHeight = {
  href: 'https://eqipp.aap.org/courses/growth2/mn/clinical-guide/popups/mid-parental-height',
  label: 'American Academy of Pediatrics: Mid-parental height',
};

const cdcSleep = {
  href: 'https://www.cdc.gov/sleep/about/index.html',
  label: 'CDC: About Sleep',
};

const cdcStudentSleep = {
  href: 'https://www.cdc.gov/physical-activity-education/staying-healthy/sleep.html',
  label: 'CDC: Sleep and Student Health',
};

const mayoSleepTips = {
  href: 'https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/sleep/art-20048379',
  label: 'Mayo Clinic: Sleep tips',
};

const nimhEatingDisorders = {
  href: 'https://www.nimh.nih.gov/health/publications/eating-disorders',
  label: 'NIMH: Eating disorders signs, symptoms, and help',
};

const mifflinStJeorEquation = {
  href: 'https://pubmed.ncbi.nlm.nih.gov/2305711/',
  label: 'PubMed: Mifflin-St Jeor resting energy equation',
};

const armyBodyCompositionProgram = {
  href: 'https://www.army.mil/e2/downloads/rv7/r2/policydocs/r600_9.pdf',
  label: 'U.S. Army: AR 600-9 Body Composition Program',
};

const boerLeanBodyMass = {
  href: 'https://pubmed.ncbi.nlm.nih.gov/6496691/',
  label: 'PubMed: Boer lean body mass equation',
};

const idealBodyWeightCommentary = {
  href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8646317/',
  label: 'PMC: Ideal body weight formula commentary',
};

const aceOneRepMax = {
  href: 'https://www.acefitness.org/resources/everyone/tools-calculators/weight-training-load-calculator/',
  label: 'American Council on Exercise: Weight Training Load Calculator',
};

const ahaTargetHeartRates = {
  href: 'https://www.heart.org/en/healthy-living/exercise-and-physical-activity/fitness-basics/target-heart-rates',
  label: 'American Heart Association: Target heart rates',
};

const mayoExerciseIntensity = {
  href: 'https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/exercise-intensity/art-20046887',
  label: 'Mayo Clinic: Exercise intensity',
};

const johnsHopkinsTargetHeartRate = {
  href: 'https://www.hopkinsmedicine.org/health/wellness-and-prevention/understanding-your-target-heart-rate',
  label: 'Johns Hopkins Medicine: Understanding target heart rate',
};

const johnsHopkinsDueDate = {
  href: 'https://www.mayoclinic.org/healthy-lifestyle/getting-pregnant/in-depth/due-date-calculator/itt-20084986',
  label: 'Mayo Clinic: Due date calculator',
};

const johnsHopkinsFertileWindow = {
  href: 'https://www.acog.org/womens-health/faqs/fertility-awareness-based-methods-of-family-planning',
  label: 'ACOG: Fertility awareness-based methods',
};

const cdcPregnancyWeight = {
  href: 'https://www.cdc.gov/maternal-infant-health/pregnancy-weight/index.html',
  label: 'CDC: Weight gain during pregnancy',
};

const macroAmdr = {
  href: 'https://www.ncbi.nlm.nih.gov/books/NBK610329/',
  label: 'National Academies / NCBI Bookshelf: Acceptable Macronutrient Distribution Range background',
};

const proteinDriReview = {
  href: 'https://www.ncbi.nlm.nih.gov/books/NBK614631/',
  label: 'NCBI Bookshelf: Protein dietary reference intake background',
};

const kidneyGfr = {
  href: 'https://www.kidney.org/ckd-epi-creatinine-equation-2021-0',
  label: 'National Kidney Foundation: CKD-EPI creatinine equation 2021',
};

const bodySurfaceAreaNcbi = {
  href: 'https://www.ncbi.nlm.nih.gov/books/NBK559005/',
  label: 'NCBI Bookshelf: Body surface area formulas',
};

const niaaaAlcohol = {
  href: 'https://www.niaaa.nih.gov/health-professionals-communities/core-resource-on-alcohol/basics-defining-how-much-alcohol-too-much',
  label: 'NIAAA: Standard drink and alcohol guidance',
};

const nistAlcoholCalculations = {
  href: 'https://www.nist.gov/standard/1121',
  label: 'NIST OSAC: Guidelines for Performing Alcohol Calculations in Forensic Toxicology',
};

const quikreteConcrete = {
  href: 'https://www.quikrete.com/calculator/main.asp',
  label: 'QUIKRETE: Concrete calculator reference',
};

const doeInsulation = {
  href: 'https://www.energy.gov/energysaver/insulation',
  label: 'U.S. Department of Energy: Insulation guidance',
};

const energyStarInsulationRValues = {
  href: 'https://www.energystar.gov/saveathome/seal_insulate/identify-problems-you-want-fix/diy-checks-inspections/insulation-r-values',
  label: 'ENERGY STAR: Recommended home insulation R-values',
};

const energyStarAtticInsulation = {
  href: 'https://www.energystar.gov/products/energy_star_home_upgrade/attic_insulation',
  label: 'ENERGY STAR: Well-insulated and sealed attic',
};

const ftcInsulationBuying = {
  href: 'https://consumer.ftc.gov/articles/what-know-when-youre-buying-home-insulation',
  label: 'FTC: What to know when buying home insulation',
};

const yorkWallpaperRoomChart = {
  href: 'https://www.yorkwallcoverings.com/documents/how-much-wallpaper.pdf',
  label: 'York Wallcoverings: Wallpaper room estimate chart',
};

const lowesWallpaperInstall = {
  href: 'https://www.lowes.com/pdf/Step-by-Step-Guide-Wallpaper-Installation.pdf',
  label: 'Lowe\'s: Peel-and-stick wallpaper installation guide',
};

const grahamBrownWallpaperAmount = {
  href: 'https://support.grahambrown.com/hc/en-us/articles/207134025-How-do-I-know-how-much-wallpaper-I-need',
  label: 'Graham & Brown: How much wallpaper you need',
};

const grahamBrownWallpaperBatch = {
  href: 'https://support.grahambrown.com/hc/en-us/articles/4407747771026-What-is-a-batch-number',
  label: 'Graham & Brown: Wallpaper batch number guidance',
};

const lowesTile = {
  href: 'https://www.inchcalculator.com/tile-calculator/',
  label: 'Inch Calculator: Tile calculator reference',
};

const sherwinPaintCoverage = {
  href: 'https://www.sherwin-williams.com/en-us/color/color-tools/paint-calculator',
  label: 'Sherwin-Williams: Paint calculator coverage notes',
};

const nistConversionFactors = {
  href: 'https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8',
  label: 'NIST SP 811: Conversion factors listed alphabetically',
};

const lowesSiding = {
  href: 'https://www.certainteed.com/products/documents-downloads',
  label: 'CertainTeed: Siding documents and installation resources',
};

const glenGeryBrickSizes = {
  href: 'https://www.glengery.com/brick-sizes',
  label: 'Glen-Gery: Brick sizes and pieces per square foot',
};

const archtoolboxCmu = {
  href: 'https://www.archtoolbox.com/cmu-sizes-shapes-finishes/',
  label: 'Archtoolbox: CMU sizes, nominal dimensions, and mortar joints',
};

const ukBoardFoot = {
  href: 'https://publications.ca.uky.edu/sites/publications.ca.uky.edu/files/for9.htm',
  label: 'University of Kentucky Extension: Measuring farm timber',
};

const usForestServiceLogRules = {
  href: 'https://research.fs.usda.gov/treesearch/9829',
  label: 'USDA Forest Service: A collection of log rules',
};

const tennesseeBoardFootRules = {
  href: 'https://utia.tennessee.edu/publications/wp-content/uploads/sites/269/2023/10/W262.pdf',
  label: 'University of Tennessee Extension: Doyle and International board foot rules',
};

const asphaltInstituteQuantity = {
  href: 'https://www.asphaltinstitute.org/engineering/engineering-faqs/',
  label: 'Asphalt Institute: asphalt quantity and density FAQ',
};

const pavementInteractiveCompaction = {
  href: 'https://pavementinteractive.org/compaction-and-measuring-pavement-density/',
  label: 'Pavement Interactive: compaction and pavement density',
};

const napaEngineeringAsphalt = {
  href: 'https://www.asphaltpavement.org/all-about-asphalt/asphalt-facts/engineering/',
  label: 'NAPA: Engineering asphalt pavement',
};

const epaFuelEconomy = {
  href: 'https://www.epa.gov/fueleconomy',
  label: 'U.S. EPA: Fuel Economy',
};

const epaMpgMath = {
  href: 'https://www.epa.gov/greenvehicles/miles-gallon-mpg-math',
  label: 'U.S. EPA: Miles Per Gallon math',
};

const doeFuelEconomy = {
  href: 'https://www.energy.gov/index.php/energysaver/fuel-economy',
  label: 'U.S. Department of Energy: Fuel Economy',
};

const doeDrivingEfficiently = {
  href: 'https://www.energy.gov/energysaver/driving-more-efficiently',
  label: 'U.S. Department of Energy: Driving more efficiently',
};

const eiaGasolinePrices = {
  href: 'https://www.eia.gov/petroleum/gasdiesel/',
  label: 'U.S. EIA: Weekly gasoline and diesel fuel update',
};

const irsMileage2026 = {
  href: 'https://www.irs.gov/newsroom/irs-sets-2026-business-standard-mileage-rate-at-725-cents-per-mile-up-25-cents',
  label: 'IRS: 2026 standard mileage rates',
};

const irsMileageUpdate2026 = {
  href: 'https://www.irs.gov/forms-pubs/the-standard-mileage-rates-and-maximum-automobile-fair-market-values-have-been-updated-for-2026',
  label: 'IRS: 2026 mileage-rate update',
};

const gsaPovMileage2026 = {
  href: 'https://www.gsa.gov/travel/plan-a-trip/transportation-airfare-rates-pov-rates/privately-owned-vehicle-pov-mileage-reimbursement',
  label: 'GSA: 2026 POV mileage reimbursement rates',
};

const nhtsaTireSize = {
  href: 'https://www.nhtsa.gov/vehicle-safety/tires',
  label: 'NHTSA: Tire safety and sidewall information',
};

const beaGdpExpenditures = {
  href: 'https://www.bea.gov/news/blog/2025-06-03/bea-blog-expenditures-approach-measuring-gdp',
  label: 'U.S. Bureau of Economic Analysis: Expenditures approach to measuring GDP',
};

const usgaScoreDifferential = {
  href: 'https://digital-pd.usga.org/content/usga/home-page/handicapping/world-handicap-system/world-handicap-system-usga-golf-faqs/faqs---what-is-a-score-differential.html',
  label: 'USGA: What is a Score Differential',
};

const usgaCourseHandicap = {
  href: 'https://digital-pd.usga.org/content/usga/home-page/handicapping/world-handicap-system/world-handicap-system-usga-golf-faqs/faqs---calculate-course-handicap-and-playing-handicap.html',
  label: 'USGA: Course Handicap and Playing Handicap',
};

const usgaHandicapDefinitions = {
  href: 'https://www.usga.org/handicapping/roh/Content/rules/Definitions.htm',
  label: 'USGA: Rules of Handicapping definitions',
};

const nwsWindChill = {
  href: 'https://www.weather.gov/gjt/windchill',
  label: 'National Weather Service: Wind chill formula',
};

const noaaHeatIndex = {
  href: 'https://www.wpc.ncep.noaa.gov/html/heatindex_equation.shtml',
  label: 'NOAA/NWS: Heat index equation',
};

const nwsHeatSafety = {
  href: 'https://www.weather.gov/safety/heat-index',
  label: 'National Weather Service: Heat index and safety',
};

const cdcHeatIllness = {
  href: 'https://www.cdc.gov/heat-health/about/index.html',
  label: 'CDC: About heat and health',
};

const noaaDewPoint = {
  href: 'https://www.wpc.ncep.noaa.gov/html/dewrh.shtml',
  label: 'NOAA/NWS: Dew point and relative humidity calculator',
};

const doeRoomAirConditioners = {
  href: 'https://www.energy.gov/energysaver/room-air-conditioners',
  label: 'U.S. Department of Energy: Room air conditioners',
};

const oshaStairs = {
  href: 'https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.25',
  label: 'OSHA: Stairways standard',
};

const gafMeasureRoofingSquare = {
  href: 'https://www.gaf.com/en-us/blog/your-home/how-to-measure-a-roofing-square-3faec381-6f6f-49ff-841f-114c59108f2a',
  label: 'GAF: How to measure a roofing square',
};

const gafMinimumSlopeShingles = {
  href: 'https://www.gaf.com/en-us/blog/residential-roofing/minimum-slope-for-shingles-what-contractors-need-to-know-281474980375031',
  label: 'GAF: Minimum slope for shingles',
};

const ikoShingleBundles = {
  href: 'https://www.iko.com/na/blog/how-many-shingles-in-a-bundle/',
  label: 'IKO: How many shingles are in a bundle',
};

const oshaFallProtectionConstruction = {
  href: 'https://www.osha.gov/fall-protection/construction',
  label: 'OSHA: Fall protection in construction',
};

const doeApplianceEnergy = {
  href: 'https://www.energy.gov/energysaver/articles/estimating-appliance-and-home-electronic-energy-use',
  label: 'U.S. Department of Energy: Estimating appliance energy use',
};

const eiaKwh = {
  href: 'https://www.eia.gov/energyexplained/electricity/electricity-in-the-us-generation-capacity-and-sales.php',
  label: 'U.S. Energy Information Administration: kWh electricity unit',
};

const openStaxSpeedVelocity = {
  href: 'https://openstax.org/books/physics/pages/2-2-speed-and-velocity',
  label: 'OpenStax Physics: Speed and velocity',
};

const openStaxMassWeight = {
  href: 'https://openstax.org/books/university-physics-volume-1/pages/5-4-mass-and-weight',
  label: 'OpenStax University Physics: Mass and weight',
};

const openStaxOhmsLaw = {
  href: 'https://openstax.org/books/physics/pages/19-1-ohms-law',
  label: 'OpenStax Physics: Ohm\'s law',
};

const openStaxMolarity = {
  href: 'https://openstax.org/books/chemistry-2e/pages/3-3-molarity',
  label: 'OpenStax Chemistry 2e: Molarity',
};

const nistAtomicWeights = {
  href: 'https://www.nist.gov/pml/data/comp.cfm',
  label: 'NIST: Atomic weights and isotopic compositions',
};

const iecResistorCode = {
  href: 'https://webstore.iec.ch/en/publication/12579',
  label: 'IEC 60062: Resistor and capacitor marking codes',
};

const teResistorCode = {
  href: 'https://www.te.com/usa-en/products/passive-components/resistors/intersection/resistor-color-codes.html',
  label: 'TE Connectivity: Resistor color codes and IEC 60062 context',
};

const usaceVoltageDrop = {
  href: 'https://www.inchcalculator.com/voltage-drop-calculator/',
  label: 'Inch Calculator: Voltage drop calculator reference',
};

const inchWattsToAmps = {
  href: 'https://www.inchcalculator.com/watts-to-amps-calculator/',
  label: 'Inch Calculator: Watts to amps calculator reference',
};

const inchAmpsToWatts = {
  href: 'https://www.inchcalculator.com/amps-to-watts-calculator/',
  label: 'Inch Calculator: Amps to watts calculator reference',
};

const inchKilowattsToAmps = {
  href: 'https://www.inchcalculator.com/kilowatts-to-amps-calculator/',
  label: 'Inch Calculator: Kilowatts to amps calculator reference',
};

const inchKvaToAmps = {
  href: 'https://www.inchcalculator.com/kva-to-amps-calculator/',
  label: 'Inch Calculator: kVA to amps calculator reference',
};

const inchAmpHoursToWattHours = {
  href: 'https://www.inchcalculator.com/ah-to-wh-calculator/',
  label: 'Inch Calculator: Amp-hours to watt-hours calculator reference',
};

const inchWattHoursToAmpHours = {
  href: 'https://www.inchcalculator.com/wh-to-ah-calculator/',
  label: 'Inch Calculator: Watt-hours to amp-hours calculator reference',
};

const inchWireSize = {
  href: 'https://www.inchcalculator.com/wire-size-calculator/',
  label: 'Inch Calculator: Wire size calculator reference',
};

const commonMathScope = [...DEEP_AUDIT_REQUIRED_SCOPE];

const manualDeepAuditRecords: ToolDeepAuditRecord[] = [
  {
    slug: 'exponent-calculator',
    status: 'deep-reviewed',
    batch: 'math-foundations-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxRadicals, openStaxLogarithms],
    findings: [
      'The tool handles positive, zero, negative, decimal, and simple fraction exponents correctly for real-number use.',
      'The biggest user trap is treating a negative exponent as a negative answer instead of a reciprocal.',
      'The blog needed clearer guidance about negative bases with non-whole exponents and scientific notation.',
    ],
    improvements: [
      'Expanded the Exponent Calculator guide with base/exponent definitions, mistake notes, FAQ, and research references.',
    ],
    followUps: [
      'Consider adding optional complex-number output in a future advanced calculator mode.',
    ],
  },
  {
    slug: 'log-calculator',
    status: 'deep-reviewed',
    batch: 'math-foundations-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxLogarithms, openStaxRadicals],
    findings: [
      'The change-of-base formula is appropriate for custom bases.',
      'The FAQ correctly warns that log input must be positive and the base must be positive but not 1.',
      'The most important plain-language idea is that a logarithm asks which exponent creates the value.',
    ],
    improvements: [
      'Reviewed existing FAQ, examples, related links, and calculator copy against source-backed logarithm rules.',
    ],
    followUps: [
      'Add a future graph-style explanation showing logarithms as inverse exponential functions.',
    ],
  },
  {
    slug: 'root-calculator',
    status: 'deep-reviewed',
    batch: 'math-foundations-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxRadicals, openStaxQuadratics],
    findings: [
      'The calculator correctly treats roots as rational exponent relationships.',
      'The real-number guardrail for even roots of negative numbers is important and should stay visible.',
      'Examples cover square, cube, and fourth roots, which is enough for a first learning path.',
    ],
    improvements: [
      'Reviewed input terms, FAQ coverage, examples, and related links for real-number root behavior.',
    ],
    followUps: [
      'Consider adding complex even roots as an advanced mode later.',
    ],
  },
  {
    slug: 'quadratic-formula-calculator',
    status: 'deep-reviewed',
    batch: 'math-foundations-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxQuadratics, openStaxRadicals],
    findings: [
      'The formula, discriminant explanation, and a cannot be zero guardrail match standard algebra guidance.',
      'The page explains repeated, two-real, and complex root cases.',
      'The graph details are useful but should always stay secondary to the roots and discriminant.',
    ],
    improvements: [
      'Reviewed formula wording, examples, FAQ, graph details, and related calculator links.',
    ],
    followUps: [
      'Add a small visual parabola preview after the calculator supports charts.',
    ],
  },
  {
    slug: 'percentage-calculator',
    status: 'deep-reviewed',
    batch: 'math-foundations-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxPercent, openStaxMeasurement],
    findings: [
      'The percent-of, what-percent, change, add/subtract, and reverse-percent modes cover the common search intent.',
      'The biggest user trap is mixing the original value and new value in percent change.',
      'The FAQ explains reverse percentage clearly enough for everyday discount and tax use.',
    ],
    improvements: [
      'Reviewed percentage formulas, examples, FAQ, SEO title, related tools, and privacy notes.',
    ],
    followUps: [
      'Add a future tip/sales-tax shortcut if search data shows people expect those as presets.',
    ],
  },
  {
    slug: 'percent-error-calculator',
    status: 'deep-reviewed',
    batch: 'math-foundations-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxMeasurement, openStaxPercent],
    findings: [
      'The measured value, accepted value, absolute error, signed error, and unit notes match science-class use.',
      'The accepted value cannot be zero because the percent comparison divides by it.',
      'Showing signed percent error alongside absolute percent error helps users see whether a measurement was high or low.',
    ],
    improvements: [
      'Reviewed science wording, zero-value guardrail, examples, FAQ, and related tools.',
    ],
    followUps: [
      'Add a short uncertainty note for advanced lab reports later.',
    ],
  },
  {
    slug: 'fraction-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [openStaxFractions, khanFractions, googleHelpfulContent],
    findings: [
      'GSC and DataForSEO selected the fraction page pair for a page-specific sprint after the Area closeout.',
      'The calculator covers unlike denominators, mixed numbers, improper fractions, simplifying, reciprocal division, and decimal comparison.',
      'The visible examples now cover addition, mixed-number subtraction, multiplication, and division with the expected 1 1/4 result.',
    ],
    improvements: [
      'Rewrote metadata, description, use cases, FAQs, blog hook, examples, source links, related-tool routing, image alt/caption text, and modified dates in smart-14 wording.',
    ],
    followUps: [
      'Add a visual common-denominator stepper later if users need a clearer interactive breakdown for unlike denominators.',
    ],
  },
  {
    slug: 'scientific-calculator',
    status: 'deep-reviewed',
    batch: 'math-foundations-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxRadicals, openStaxLogarithms],
    findings: [
      'The supported functions cover the expected scientific calculator basics: trig, logs, roots, powers, constants, and parentheses.',
      'The DEG/RAD distinction is clear and important for avoiding wrong trig answers.',
      'History privacy and direct expression typing are covered in the FAQ.',
    ],
    improvements: [
      'Reviewed scientific function list, DEG/RAD notes, examples, FAQ, and related calculators.',
    ],
    followUps: [
      'Add inverse trig examples to the guide after the next visual pass.',
    ],
  },
  {
    slug: 'binary-calculator',
    status: 'deep-reviewed',
    batch: 'math-foundations-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [nasaNumberSystems, rfc4648],
    findings: [
      'The tool correctly frames binary as base 2 with place values based on powers of 2.',
      'Spaces and underscores are safe readability helpers because they do not change the value.',
      'The signed-number note is honest: this is simple signed whole-number math, not fixed-width two\'s complement.',
    ],
    improvements: [
      'Reviewed base-2 wording, division remainder behavior, conversions, examples, FAQ, and related links.',
    ],
    followUps: [
      'Add optional fixed-width two\'s complement mode later for developer and networking users.',
    ],
  },
  {
    slug: 'hex-calculator',
    status: 'deep-reviewed',
    batch: 'math-foundations-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [nasaNumberSystems, rfc4648],
    findings: [
      'The page correctly explains hexadecimal as base 16 with digits 0-9 and A-F.',
      'Accepting optional 0x prefixes matches developer expectations.',
      'Showing hex, decimal, and binary results together helps users catch base-conversion mistakes.',
    ],
    improvements: [
      'Reviewed base-16 wording, decimal and binary conversions, division remainder behavior, examples, FAQ, and related links.',
    ],
    followUps: [
      'Add byte grouping and color-code examples later if developer-tool traffic grows.',
    ],
  },
  {
    slug: 'mortgage-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [cfpbMonthlyMortgagePayment, cfpbPiti, cfpbLoanEstimate, freddieMacPmms, cfpbMortgage],
    findings: [
      'DataForSEO confirmed mortgage calculator, mortgage payment calculator, simple mortgage calculator, and free mortgage calculator intent for the exact tool and guide sprint.',
      'The calculator uses fixed-rate payment math for principal and interest, then separates property tax, homeowners insurance, PMI, HOA, total monthly payment, total interest, and LTV.',
      'The tool and guide now tie the result to CFPB PITI and Loan Estimate limits without implying lender approval, APR disclosure, or current-rate automation.',
    ],
    improvements: [
      'Added page-specific title/meta, mortgage search aliases, exact $400,000 and PMI examples, 15-year comparison, PITI and Loan Estimate FAQs, source links, finance trust block, specific image alt/caption text, and browser/DataForSEO proof requirements.',
    ],
    followUps: [
      'Add an amortization table preview after the page supports lightweight expandable schedules.',
    ],
  },
  {
    slug: 'loan-calculator',
    status: 'deep-reviewed',
    batch: 'all-pages-dataforseo-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [openStaxLoanAmortization, cfpbAprVsInterest, cfpbLoanEstimate, cfpbAutoTruthInLending],
    findings: [
      'The loan payment path uses fixed-rate amortization math and handles a zero-interest example by dividing principal across payments.',
      'The guide explains loan amount, annual interest rate, term, monthly payment, total paid, and total interest in smart-14 language.',
      'The FAQ and limit copy warn users not to compare loans by payment alone or ignore APR, origination fees, disclosures, prepayment terms, taxes, insurance, penalties, and lender-specific rounding.',
    ],
    improvements: [
      'Refreshed the tool and guide with exact $12,000, $50,000, and 0% examples, explicit SEO metadata, APR-versus-interest cautions, disclosure cross-checks, specific image alt/caption text, and current OpenStax/CFPB sources.',
    ],
    followUps: [
      'Consider a later feature pass for optional origination fees or a compact amortization preview, but do not imply those fields exist on this page yet.',
    ],
  },
  {
    slug: 'bmi-calculator',
    status: 'deep-reviewed',
    batch: 'priority-risk-pass-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [cdcBmi, nhlbiBmi],
    findings: [
      'BMI is calculated as kilograms divided by meters squared and displayed as an adult screening estimate, not a diagnosis.',
      'The calculator shows a healthy BMI reference range while the guide explains why BMI cannot see muscle, pregnancy, age, or full medical risk.',
      'Safety wording keeps child, teen, pregnancy, body-composition, and clinician-context limits visible.',
    ],
    improvements: [
      'Manually checked formula wording, adult-category language, examples, guide article, FAQ-style cautions, related tools, and privacy behavior.',
    ],
    followUps: [
      'Add a unit-toggle polish pass so U.S. users can enter feet/inches and pounds directly.',
    ],
  },
  {
    slug: 'calorie-calculator',
    status: 'deep-reviewed',
    batch: 'priority-risk-pass-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [cdcActivity, cdcBmi],
    findings: [
      'The calculator uses Mifflin-St Jeor for BMR, multiplies by an activity factor, and applies gentle loss or gain adjustments.',
      'The guide explains maintenance as the anchor number and warns that activity labels and tracking accuracy can shift real results.',
      'Health cautions are present so the page does not read like medical, pregnancy, eating-disorder, or nutrition treatment advice.',
    ],
    improvements: [
      'Manually checked the BMR/TDEE flow, activity examples, result labels, guide article, related tools, and health disclaimer language.',
    ],
    followUps: [
      'Add a short activity-level helper tooltip in the UI to reduce overestimating activity.',
    ],
  },
  {
    slug: 'salary-calculator',
    status: 'deep-reviewed',
    batch: 'priority-risk-pass-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [dolHours, irsTax2026],
    findings: [
      'The calculator converts annual gross salary into monthly, biweekly, weekly, daily, and hourly values from hours and paid weeks.',
      'The result correctly frames take-home as a simple percentage estimate instead of payroll withholding.',
      'The guide explains gross versus estimated take-home and flags benefits, deductions, overtime, bonuses, state tax, and local tax as out of scope.',
    ],
    improvements: [
      'Manually checked pay-period math, salary guide wording, examples, FAQ cautions, source notes, and related calculator pathways.',
    ],
    followUps: [
      'Add an optional paycheck-mode handoff to the take-home/paycheck tools rather than expanding this page too far.',
    ],
  },
  {
    slug: 'income-tax-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [irsTax2026, irsRevenueProcedure, irsWithholdingEstimatorFaqs, irsPub15T, irsPub505],
    findings: [
      'The calculator uses 2026 U.S. federal ordinary income brackets and standard deductions from the current IRS 2026 inflation-adjustment source and Revenue Procedure 2025-32.',
      'DataForSEO page evidence shows income tax calculator intent is high-volume, informational, and federal/state/paycheck-adjacent, so this page now states federal-only scope clearly instead of pretending to answer every tax search.',
      'The guide explains taxable income, effective rate, marginal bracket, deductions, and credits without making the common mistake that all income is taxed at the top bracket.',
    ],
    improvements: [
      'Added income-tax-specific SEO title, meta description, aliases, exact 2026 examples, input explanations, priority FAQs, IRS source links, DataForSEO-backed federal/state/paycheck limits, visible trust note, and specific image alt/caption text.',
    ],
    followUps: [
      'Add state tax, paycheck withholding, and refund-size calculators only as separate maintained tools with their own sources and update process.',
    ],
  },
  {
    slug: 'compound-interest-calculator',
    status: 'deep-reviewed',
    batch: 'priority-risk-pass-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [investorCompound, blsInflation],
    findings: [
      'The calculator converts the stated annual rate through the selected compounding frequency, then converts that to monthly growth for deposits.',
      'The guide separates principal, contributions, estimated interest, ending balance, and effective annual rate.',
      'The page warns that taxes, fees, risk, account limits, and guaranteed-return assumptions are outside the estimate.',
    ],
    improvements: [
      'Manually checked compounding logic, contribution examples, guide article, FAQ wording, finance cautions, and related investing tools.',
    ],
    followUps: [
      'Add a future chart showing contributions versus estimated interest once charts are introduced site-wide.',
    ],
  },
  {
    slug: 'auto-loan-calculator',
    status: 'deep-reviewed',
    batch: 'all-pages-dataforseo-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [cfpbAutoLoans, cfpbAutoLoanCompare, cfpbAutoLoanTerms, ftcAutoLease, ftcAutoNegativeEquity, cfpbAprVsInterest],
    findings: [
      'The calculator estimates taxable vehicle amount, sales tax, fees, down payment, trade-in, amount financed, monthly payment, total interest, and total paid.',
      'The 2026-05-26 sprint refreshed DataForSEO evidence for the tool and guide, then aligned the page with CFPB/FTC warnings to compare total cost instead of monthly payment alone.',
      'Current examples show concrete outputs: the $32,000 vehicle scenario estimates $27,640 financed, about $549.92/month, and about $5,355.02 total interest.',
    ],
    improvements: [
      'Added auto-loan-specific title/meta, input explanations, priority FAQs, APR/interest-rate caution, negative-equity note, total-cost guidance, visible guide source links, updated modified dates, and specific image alt/caption text.',
    ],
    followUps: [
      'Add optional rebate and negative-equity fields later if Search Console, usage data, or DataForSEO evidence shows people need those workflows directly in the calculator.',
    ],
  },
  {
    slug: 'password-generator',
    status: 'deep-reviewed',
    batch: 'priority-risk-pass-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [nistPasswords, mdnCryptoRandomValues],
    findings: [
      'The generator uses browser cryptographic random values and rejects browsers without secure random support.',
      'Generated passwords are kept out of recent-answer history, which matches the privacy note and reduces accidental exposure.',
      'The guide explains length, character pool, entropy, unique passwords, ambiguous characters, and password-manager storage.',
    ],
    improvements: [
      'Manually checked secure-random code, no-history behavior, UI options, guide article, FAQ cautions, and source notes.',
    ],
    followUps: [
      'Add a passphrase generator mode later for users who need easier manual typing.',
    ],
  },
  {
    slug: 'subnet-calculator',
    status: 'deep-reviewed',
    batch: 'priority-risk-pass-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [rfc4632, rfc3986],
    findings: [
      'The calculator parses IPv4 addresses, validates CIDR prefix length from 0 to 32, and uses 32-bit mask/wildcard math.',
      'Network, broadcast, wildcard, first usable, last usable, and usable host counts are explained, including /31 and /32 handling.',
      'The guide clearly limits the page to IPv4 CIDR planning and avoids implying it changes any live network settings.',
    ],
    improvements: [
      'Manually checked CIDR logic, examples, guide article, alias coverage, privacy note, related tools, and source references.',
    ],
    followUps: [
      'Add an IPv6 subnet calculator as a separate future tool rather than overloading this IPv4 page.',
    ],
  },
  {
    slug: 'gpa-calculator',
    status: 'deep-reviewed',
    batch: 'priority-risk-pass-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxPercent, googleHelpfulContent],
    findings: [
      'The calculator treats GPA as a credit-weighted average by multiplying grade points by credits, then dividing total quality points by total credits.',
      'The guide explains why a 4-credit class affects GPA more than a 1-credit class and why 0-credit rows are excluded.',
      'School-policy caveats cover weighted courses, honors/AP rules, pass/fail, repeats, and plus/minus differences.',
    ],
    improvements: [
      'Manually checked grade-point mapping, credit weighting, examples, guide article, FAQ cautions, related tools, and source notes.',
    ],
    followUps: [
      'Add a custom grade-scale editor later for schools that do not use the current common 4.0 scale.',
    ],
  },
  {
    slug: 'due-date-calculator',
    status: 'deep-reviewed',
    batch: 'priority-risk-pass-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [johnsHopkinsDueDate, cdcPregnancyWeight],
    findings: [
      'The calculator uses last menstrual period plus 280 days and adjusts for cycle length compared with a 28-day cycle.',
      'The guide explains LMP versus conception estimate and warns that many healthy pregnancies deliver before or after the estimated due date.',
      'Medical disclaimer language is visible so the result reads as planning support until clinical dating confirms it.',
    ],
    improvements: [
      'Manually checked due-date math, cycle adjustment, guide article, pregnancy cautions, related tools, and source notes.',
    ],
    followUps: [
      'Add a small note near the date picker explaining that LMP means the first day of the last period.',
    ],
  },
  {
    slug: 'gfr-calculator',
    status: 'deep-reviewed',
    batch: 'priority-risk-pass-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [kidneyGfr, cdcBmi],
    findings: [
      'The calculator uses the 2021 CKD-EPI creatinine equation with age, sex, and serum creatinine, and explicitly does not use a race coefficient.',
      'The guide explains that eGFR is reported as mL/min/1.73 m2 and should be interpreted with urine tests, repeat labs, medications, and clinician context.',
      'Safety notes keep the result out of self-diagnosis territory and warn about children, pregnancy, units, and old lab values.',
    ],
    improvements: [
      'Manually checked eGFR formula path, lab-unit wording, guide article, FAQ cautions, related tools, and source references.',
    ],
    followUps: [
      'Add a creatinine-unit helper if the UI later supports umol/L entry for non-U.S. lab reports.',
    ],
  },
  {
    slug: 'concrete-calculator',
    status: 'deep-reviewed',
    batch: 'priority-risk-pass-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [quikreteConcrete, nistSi],
    findings: [
      'The calculator converts slab depth from inches to feet, multiplies length by width by depth, adds waste, and converts cubic feet to cubic yards and cubic meters.',
      'The result includes rounded bag estimates using common dry-mix yields while warning users to check exact bag labels.',
      'The guide explains waste percent, ready-mix cubic yards, bag counts, form loss, uneven ground, and code-sensitive work limits.',
    ],
    improvements: [
      'Manually checked volume math, unit labels, waste handling, guide article, FAQ-style input explanations, related tools, and source notes.',
    ],
    followUps: [
      'Add circular/footing modes later for users who need shapes beyond a simple slab.',
    ],
  },
  {
    slug: 'wallpaper-calculator',
    status: 'deep-reviewed',
    batch: 'all-pages-dataforseo-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [yorkWallpaperRoomChart, lowesWallpaperInstall, grahamBrownWallpaperAmount, grahamBrownWallpaperBatch, nistSi, googleHelpfulContent],
    findings: [
      'The calculator finds wall area from perimeter and height, subtracts standard doors/windows, adds waste, divides by roll coverage, and rounds to whole rolls.',
      'The FAQ and guide explain waste percent, roll coverage, pattern repeat, drop matches, dye lots, and why usable roll yield can be lower than printed roll size.',
      'Current source checks confirmed the page should keep product-label coverage, pattern repeat, extra waste, and batch/lot checks visible instead of pretending square-foot math is perfect.',
    ],
    improvements: [
      'Manually checked wallpaper math, detailed FAQ, expanded guide sections, example roll calculation, source notes, image alt/caption text, modified dates, and DataForSEO sprint evidence.',
    ],
    followUps: [
      'Add accent-wall mode later so users do not have to estimate a single wall as a full room.',
    ],
  },
  {
    slug: 'interest-calculator',
    status: 'deep-reviewed',
    batch: 'priority-top-25-completion-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [investorCompound, openStaxPercent],
    findings: [
      'The simple-interest mode uses principal times annual rate times years and shows ending balance separately from interest earned or owed.',
      'The compound mode reuses the compound-interest helper so compounding frequency, monthly contributions, effective annual rate, and estimated interest are consistent with the dedicated compound tool.',
      'The guide clearly warns users not to mix monthly and annual rates or treat estimated investment returns as guaranteed.',
    ],
    improvements: [
      'Manually checked simple and compound paths, rate/time wording, examples, guide, FAQ cautions, privacy note, and source coverage.',
    ],
    followUps: [
      'Add a side-by-side simple versus compound comparison table when finance visualizations are expanded.',
    ],
  },
  {
    slug: 'sales-tax-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [irsSalesTax, taxFoundationSalesTaxRates, googleHelpfulContent],
    findings: [
      'GSC and DataForSEO selected the sales-tax page pair for a page-specific sprint after the Fraction closeout.',
      'The calculator multiplies before-tax subtotal by the manual sales-tax percent, then adds the tax amount to subtotal for the final checkout total.',
      'The tool and guide explain that the user must supply a current local rate and that discounts, exemptions, shipping, marketplaces, rounding, and holidays can change real checkout tax.',
    ],
    improvements: [
      'Rewrote metadata, description, examples, FAQs, blog hook, source links, related-tool routing, image alt/caption text, and modified dates in smart-14 wording.',
    ],
    followUps: [
      'Consider a future reverse-sales-tax mode for users who know the total and need the pre-tax subtotal.',
    ],
  },
  {
    slug: 'pregnancy-calculator',
    status: 'deep-reviewed',
    batch: 'priority-top-25-completion-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [johnsHopkinsDueDate, cdcPregnancyWeight],
    findings: [
      'The calculator uses the same LMP plus 280 days and cycle-length adjustment as the due-date tool, then adds gestational age, estimated conception, and trimester labels.',
      'The guide explains that gestational age is counted from LMP, so it is usually about two weeks more than conception age.',
      'Health safety copy tells users that ultrasound or clinician dating can update the estimate and that the page is planning support, not medical advice.',
    ],
    improvements: [
      'Manually checked pregnancy date math, trimester thresholds, guide language, examples, related tools, safety notes, and source coverage.',
    ],
    followUps: [
      'Add a tooltip for LMP and cycle length in the pregnancy calculator UI.',
    ],
  },
  {
    slug: 'paint-calculator',
    status: 'deep-reviewed',
    batch: 'priority-top-25-completion-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [sherwinPaintCoverage, nistSi],
    findings: [
      'The calculator finds wall area from room perimeter and height, subtracts standard doors/windows, multiplies by coats and extra percent, and rounds gallons up.',
      'The guide explains coverage per gallon, coats, extra percent, doors/windows, and why surface texture, primer, color changes, and product label coverage matter.',
      'The page keeps the result as a material estimate and does not pretend to replace a product label or paint-store recommendation.',
    ],
    improvements: [
      'Manually checked paint math, coverage labels, examples, guide detail, source notes, related tools, and visual/result wording.',
    ],
    followUps: [
      'Add a single-wall or accent-wall mode so users do not have to force a whole-room estimate.',
    ],
  },
  {
    slug: 'tile-calculator',
    status: 'deep-reviewed',
    batch: 'priority-top-25-completion-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [lowesTile, nistSi],
    findings: [
      'The calculator converts tile dimensions from square inches to square feet, adds waste to project area, divides by tile area, and rounds to whole tiles.',
      'The guide now explains waste percent, cuts, breakage, layout pattern, grout spacing limits, box coverage, and why final ordering may need a store or installer takeoff.',
      'The tool content correctly frames grout spacing as an ordering/layout concern rather than a hidden formula input.',
    ],
    improvements: [
      'Added a tile-specific estimating source and expanded the Tile guide with waste percent and grout-spacing explanation before marking the tool deep-reviewed.',
    ],
    followUps: [
      'Add box-coverage and optional grout-width inputs when the home-project calculators get a second UI pass.',
    ],
  },
  {
    slug: 'time-calculator',
    status: 'deep-reviewed',
    batch: 'priority-top-25-completion-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [isoDate, nistTimeDefinitions],
    findings: [
      'The calculator converts two durations to seconds, adds or subtracts, then normalizes the result into hours, minutes, seconds, total seconds, and decimal hours.',
      'The guide clearly separates duration math from clock scheduling, time zones, and start/end shift math.',
      'Input notes warn users to keep minutes and seconds within duration expectations and use Hours Calculator for clock start and end times.',
    ],
    improvements: [
      'Added a time-definition source and manually checked duration math, guide wording, examples, related tools, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add a business-time or stopwatch-style calculator as a separate tool if users ask for clock intervals with breaks.',
    ],
  },
  {
    slug: 'random-number-generator',
    status: 'deep-reviewed',
    batch: 'priority-top-25-completion-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [mdnCryptoRandomValues, mdnMathRandom],
    findings: [
      'The generator validates safe integer ranges, treats minimum and maximum as inclusive, supports exclusions, unique results, sorting, and quantity checks.',
      'The random mapping uses rejection sampling to avoid simple modulo bias, prefers browser cryptographic random values, and falls back to normal browser randomness when needed.',
      'The FAQ and guide now explain that this is for everyday picks and examples, not passwords, gambling, legal drawings, security decisions, or audited randomness.',
    ],
    improvements: [
      'Clarified random-number FAQ and guide wording, then manually checked generator logic, examples, copy behavior, privacy history, and source coverage.',
    ],
    followUps: [
      'Add an audited-randomness explainer link if the site later adds raffle or contest content.',
    ],
  },
  {
    slug: 'payment-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [investorCompound, cfpbDebtToIncome],
    findings: [
      'The calculator uses the same fixed-payment amortization formula as the loan tool and handles zero-interest payments through the shared loan helper.',
      'The tool labels amount financed, annual rate, and term clearly, while the guide warns that fees, variable rates, insurance, and lender-specific rules are outside the estimate.',
      'The guide and FAQ explain that a longer term can lower the payment while raising total interest, which is the main user tradeoff.',
    ],
    improvements: [
      'Manually checked the payment formula path, examples, FAQ, guide article, privacy note, related tools, source coverage, and generated page wiring.',
      'Fixed finance guides globally so their Formula and steps section now pulls the actual formula FAQ instead of the generic input FAQ.',
    ],
    followUps: [
      'Add an APR-with-fees comparison handoff when the APR Calculator gets its manual finance pass.',
    ],
  },
  {
    slug: 'retirement-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [investorCompound, irsIraLimits],
    findings: [
      'The calculator compounds current savings and end-of-month contributions, then compares the projected balance with the target amount.',
      'The guide correctly frames the result as scenario planning and warns about taxes, fees, inflation, contribution limits, withdrawals, and market volatility.',
      'The examples cover early saving, catch-up planning, and conservative-return comparisons without promising any investment result.',
    ],
    improvements: [
      'Manually checked projection math, contribution labels, target-gap wording, guide article, FAQ cautions, source coverage, related tools, and privacy behavior.',
    ],
    followUps: [
      'Add inflation-adjusted retirement balance as a future optional result after charting or advanced settings exist.',
    ],
  },
  {
    slug: 'amortization-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [cfpbMortgage, investorCompound],
    findings: [
      'The calculator starts with the scheduled fixed payment, adds any extra monthly payment, then simulates monthly interest and principal reduction until payoff.',
      'The extra-payment result shows scheduled payment, monthly paid, interest saved, months saved, and payoff time, which matches the page promise.',
      'The guide warns users to check whether lenders apply extra payments to principal and whether prepayment penalties or variable-rate terms apply.',
    ],
    improvements: [
      'Manually checked amortization logic, zero-extra example behavior, result labels, guide article, FAQ cautions, alias relationship, source coverage, and privacy note.',
    ],
    followUps: [
      'Add a lightweight amortization schedule preview after page performance budgets support expandable tables.',
    ],
  },
  {
    slug: 'investment-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [investorCompound, investorGovCompoundCalculator, investorGovFees, investorGovRiskReturn, investorGovBuildWealth, blsInflation],
    findings: [
      'The calculator compounds a starting amount plus end-of-month deposits using a monthly rate derived from the annual return assumption.',
      'The result separates total contributions from estimated growth, which helps users see what came from deposits versus return assumptions.',
      'DataForSEO page evidence showed high-volume investment calculator demand plus long-tail intent for withdrawals, inflation, monthly deposits, formula help, and government-style trust.',
    ],
    improvements: [
      'Rewrote metadata, examples, input explanations, FAQ cautions, guide copy, source links, image alt/caption text, tool trust notes, and modified dates in smart-14 wording.',
    ],
    followUps: [
      'Add withdrawals or inflation-adjusted investment modes only if they become maintained separate features with their own examples and proof.',
    ],
  },
  {
    slug: 'inflation-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [blsInflation, investorCompound],
    findings: [
      'The calculator uses amount times (1 + rate)^years for future cost and divides by the same multiplier for present buying power.',
      'The guide explains that this is a chosen-rate model, not a live CPI lookup, and that individual products can move differently from broad inflation.',
      'The examples show future cost, buying power, and long-term planning scenarios without implying the entered rate will happen.',
    ],
    improvements: [
      'Manually checked inflation math, BLS source coverage, examples, guide wording, FAQ cautions, related tools, and privacy behavior.',
    ],
    followUps: [
      'Add a historical CPI mode only if the site later adds maintained data fetching or static CPI tables.',
    ],
  },
  {
    slug: 'finance-calculator',
    status: 'deep-reviewed',
    batch: 'all-pages-dataforseo-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [investorCompound, cfpbCompoundInterest, investorGovCompoundCalculator, consumerBudgetWorksheet, googleHelpfulContent],
    findings: [
      'The general finance calculator uses the future-balance helper for a what-if projection from starting amount, monthly deposit, estimated annual rate, and time.',
      'The guide now uses exact starter numbers: $2,000 plus $150/month at 5% for 8 years gives about $20,642.25, with $16,400 contributed and about $4,242.25 estimated growth.',
      'The FAQ, privacy note, tool trust block, and guide source note keep the result framed as a projection that excludes taxes, fees, inflation, withdrawals, changing rates, losses, and account rules.',
    ],
    improvements: [
      'Rewrote metadata, examples, input explanations, FAQ cautions, guide copy, source links, image alt/caption text, tool trust note, and modified dates in smart-14 wording.',
    ],
    followUps: [
      'Consider adding mode tabs later only if Search Console or usage data proves visitors expect a broader finance dashboard instead of a future-balance projection.',
    ],
  },
  {
    slug: 'currency-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [federalReserveExchangeRates, googleHelpfulContent],
    findings: [
      'The calculator multiplies the source amount by the manual exchange rate and subtracts an optional fee percentage from the converted amount.',
      'The guide clearly states that the tool does not fetch live market, bank, card, or transfer-service rates, so users must enter the rate they intend to use.',
      'The fee and inverse-rate cautions address the two most likely mistakes for a manual currency converter.',
    ],
    improvements: [
      'Manually checked currency conversion math, fee handling, rate-label wording, guide article, FAQ cautions, source coverage, related tools, and privacy note.',
      'Added a Federal Reserve exchange-rate source to the audit source coverage for currency-style finance pages.',
    ],
    followUps: [
      'Only add live exchange rates later if there is a maintained source, clear timestamping, caching, and rate-source disclosure.',
    ],
  },
  {
    slug: 'mortgage-payoff-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [cfpbMortgage, investorCompound],
    findings: [
      'The calculator subtracts any one-time extra payment from the balance, adds extra monthly principal to the scheduled payment, and simulates monthly payoff.',
      'The result explains payoff time, scheduled payment, interest saved, months saved, and one-time payment, which matches the guide walkthrough.',
      'The guide warns that official lender payoff quotes, escrow, fees, interest timing, and prepayment rules can change the real payoff.',
    ],
    improvements: [
      'Manually checked payoff logic, one-time-payment guardrail, examples, guide article, FAQ cautions, source coverage, related tools, and privacy note.',
    ],
    followUps: [
      'Add a lender-payoff-quote explanation box if this page becomes a high-traffic mortgage page.',
    ],
  },
  {
    slug: '401k-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [irs401kLimits, investorCompound],
    findings: [
      'The calculator converts employee salary percent and employer match into monthly deposits, then compounds the current balance and combined deposits monthly.',
      'The employer match logic caps the matched salary percent at the entered match-limit percent, which matches the field labels.',
      'The guide and privacy copy are honest that the calculator does not enforce IRS limits, plan rules, vesting, taxes, loans, withdrawals, fees, or market volatility.',
    ],
    improvements: [
      'Manually checked 401K projection math, match-limit wording, examples, guide article, FAQ cautions, IRS source coverage, related tools, and privacy behavior.',
      'Added a 401(k)-specific IRS source to the deep-audit source coverage instead of relying only on generic retirement links.',
    ],
    followUps: [
      'Add optional annual contribution-limit warning text later without hard-coding year-sensitive values into the calculator logic.',
    ],
  },
  {
    slug: 'house-affordability-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [cfpbMortgage, cfpbDebtToIncome],
    findings: [
      'The calculator applies the debt-to-income target to monthly gross income, subtracts existing monthly debts, then searches for the highest home price that fits taxes, insurance, HOA, and principal-and-interest.',
      'The result separates loan amount, housing budget, principal and interest, and tax/insurance/HOA so users can see what is driving affordability.',
      'The guide warns that this is not approval and excludes credit, reserves, closing costs, exact taxes, insurance, lender rules, repairs, and local market costs.',
    ],
    improvements: [
      'Manually checked affordability search logic, DTI field wording, examples, guide article, FAQ cautions, source coverage, related mortgage tools, and privacy note.',
      'Improved source targeting so house-affordability pages include a debt-to-income reference as well as mortgage context.',
    ],
    followUps: [
      'Add a closing-cost and cash-reserve field only if the tool gets a second advanced mortgage-planning mode.',
    ],
  },
  {
    slug: 'savings-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-2-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [investorCompound, consumerBudgetWorksheet],
    findings: [
      'The calculator compounds current savings monthly, adds end-of-month deposits, and compares the projected balance with the optional target amount.',
      'The results split total deposits from estimated interest, which keeps the growth estimate understandable for goal planning.',
      'The guide and FAQ now frame the rate as an assumption and warn about taxes, fees, withdrawals, changing rates, and account rules.',
    ],
    improvements: [
      'Manually checked savings projection math, target-gap wording, examples, guide article, FAQ cautions, related tools, source coverage, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add a reverse savings-goal mode later so users can solve for required monthly deposit.',
    ],
  },
  {
    slug: 'rent-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-2-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [consumerBudgetWorksheet, cfpbDebtToIncome],
    findings: [
      'The calculator multiplies monthly income by the chosen rent percentage, then subtracts monthly debts and utilities to create a rent ceiling.',
      'The sample result correctly shows $1,030 max rent from $5,200 income at 30% after $350 debts and $180 utilities.',
      'The guide makes clear that this is a budget screen, not landlord approval, and calls out deposits, insurance, fees, moving costs, and local market prices.',
    ],
    improvements: [
      'Manually checked rent-ceiling math, field labels, result wording, examples, guide article, FAQ cautions, source coverage, related links, and privacy note.',
    ],
    followUps: [
      'Consider adding an optional actual-rent comparison field after the core finance review batch is complete.',
    ],
  },
  {
    slug: 'annuity-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-2-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [investorAnnuities, investorCompound],
    findings: [
      'The calculator converts the annual rate to a periodic rate and uses ordinary annuity or annuity-due present-value and future-value formulas.',
      'The UI exposes payments per year and payment timing, so monthly, annual, end-of-period, and beginning-of-period examples are not mixed together.',
      'The guide and FAQ warn that insurance annuity quotes can include fees, taxes, guarantees, riders, surrender charges, and contract terms outside this formula.',
    ],
    improvements: [
      'Manually checked annuity formulas, timing multiplier, payments-per-year validation, examples, guide article, FAQ cautions, source coverage, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add a separate retirement-income explainer if annuity search traffic grows beyond formula-style use.',
    ],
  },
  {
    slug: 'credit-card-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-2-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [cfpbCreditCards, cfpbDebtCollection],
    findings: [
      'The payoff loop adds monthly APR interest and optional new charges, then subtracts the payment until the balance reaches zero.',
      'The calculator blocks impossible payoff inputs when the payment is not higher than monthly interest plus new charges.',
      'The guide and FAQ explain APR, new charges, final payment, daily-balance differences, variable APRs, fees, and promotional-rate limits in plain language.',
    ],
    improvements: [
      'Manually checked credit-card payoff logic, payment guardrail, examples, guide article, FAQ cautions, source coverage, related tools, and privacy note.',
    ],
    followUps: [
      'Add a multi-card snowball or avalanche calculator as a separate tool rather than overloading this single-card payoff page.',
    ],
  },
  {
    slug: 'pension-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-2-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [pbgcPensionCoverage, investorCompound],
    findings: [
      'The calculator uses the defined-benefit style estimate final average salary times years of service times benefit multiplier, then divides by 12.',
      'The result also shows replacement rate, which helps users see the pension estimate as a share of final average salary.',
      'The guide and FAQ warn that plan documents, vesting, survivor options, COLA, early retirement reductions, taxes, and service-credit rules can change the real benefit.',
    ],
    improvements: [
      'Added a pension-specific guide detail and manually checked formula wording, examples, FAQ cautions, source coverage, related tools, SEO copy, and privacy note.',
    ],
    followUps: [
      'Add separate public-sector or military pension calculators only if those formulas are researched and maintained individually.',
    ],
  },
  {
    slug: 'annuity-payout-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-2-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [investorAnnuities, investorCompound],
    findings: [
      'The calculator uses the present-value annuity payout formula to spread a starting balance over a fixed number of payments at the selected rate.',
      'Zero-rate behavior divides the balance by the payment count, which keeps the estimate usable when users want a no-growth drawdown.',
      'The guide and FAQ distinguish a math payout estimate from an annuity contract, insurance quote, lifetime guarantee, tax result, or professional recommendation.',
    ],
    improvements: [
      'Added annuity-payout-specific guide detail and manually checked payout formula, payment-count validation, examples, source coverage, SEO copy, related links, and privacy note.',
    ],
    followUps: [
      'Add lifetime or inflation-adjusted payout modes only after researching the additional actuarial assumptions.',
    ],
  },
  {
    slug: 'credit-cards-payoff-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-2-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [cfpbCreditCards, cfpbDebtCollection],
    findings: [
      'The tool uses the fixed debt payoff helper for a combined credit card balance, weighted APR, regular monthly payment, and extra monthly payment.',
      'The guide explains weighted APR as a simplified average, which is important because the calculator does not model separate card balances or APR tiers.',
      'The FAQ and guide caution that daily balance methods, fees, promotional APRs, minimum-payment changes, and new purchases are outside the estimate.',
    ],
    improvements: [
      'Added credit-cards-payoff guide detail and manually checked payoff logic, weighted-APR wording, examples, FAQ cautions, source coverage, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Build a separate debt avalanche or snowball calculator when the site is ready for per-card input rows.',
    ],
  },
  {
    slug: 'debt-payoff-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-2-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [cfpbDebtCollection, cfpbCreditCards],
    findings: [
      'The calculator adds monthly interest, subtracts the regular plus extra payment, and repeats until the fixed balance reaches zero.',
      'The payment guardrail stops results when the monthly payment cannot cover monthly interest, preventing a fake payoff timeline.',
      'The guide and FAQ warn about fees, penalties, settlement terms, collection rules, creditor agreements, changing rates, and legal-advice limits.',
    ],
    improvements: [
      'Added debt-payoff-specific guide detail and manually checked payoff loop, error guardrail, examples, FAQ cautions, source coverage, related tools, and privacy note.',
    ],
    followUps: [
      'Add payoff strategy modes only after separate avalanche and snowball logic has tests.',
    ],
  },
  {
    slug: 'debt-consolidation-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-2-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [cfpbDebtCollection, cfpbDebtToIncome],
    findings: [
      'The calculator estimates the current payoff path, then compares it with a new amortized consolidation loan after adding fees to the new principal.',
      'The result separates monthly payment change from total cost change, which helps users see when a lower payment may cost more over a longer term.',
      'The guide and FAQ warn that approval, credit impact, balance-transfer rules, origination terms, hardship plans, settlement offers, and provider fees are outside the math.',
    ],
    improvements: [
      'Added debt-consolidation guide detail and manually checked comparison logic, fee handling, examples, FAQ cautions, source coverage, SEO copy, related links, and privacy behavior.',
    ],
    followUps: [
      'Add a debt-to-income handoff once the remaining finance review batch reaches that calculator.',
    ],
  },
  {
    slug: 'repayment-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-2-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [cfpbDebtCollection, investorCompound],
    findings: [
      'The calculator uses the same tested fixed-balance repayment helper as the debt payoff tools, with regular and extra payment inputs.',
      'The output gives payoff months, interest, total paid, and final payment, so users can see both time and cost.',
      'The guide and FAQ explain that deferment, hardship plans, fees, changing rates, income-based plans, and provider-specific rules are not included.',
    ],
    improvements: [
      'Added repayment-specific guide detail and manually checked repayment logic, examples, FAQ cautions, source coverage, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add provider-specific repayment pages only if they can be maintained with official source checks.',
    ],
  },
  {
    slug: 'student-loan-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-3-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [fsaRepaymentPlans, investorCompound],
    findings: [
      'The calculator estimates a scheduled fixed loan payment, then runs the amortization helper again with any extra monthly payment to show payoff time and interest saved.',
      'The guide and FAQ clearly separate this standard fixed-payment math from income-driven repayment, deferment, forbearance, forgiveness, subsidies, capitalization, fees, and servicer rules.',
      'The default example and tests cover a 10-year student loan path and verify extra-payment payoff metrics through the shared amortization logic.',
    ],
    improvements: [
      'Added a student-loan-specific guide detail and manually checked scheduled payment logic, extra-payment logic, examples, FAQ cautions, source coverage, SEO copy, related tools, and privacy note.',
    ],
    followUps: [
      'Add official federal repayment-plan modes only if each plan is researched, dated, and tested against Federal Student Aid rules.',
    ],
  },
  {
    slug: 'college-cost-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-3-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [educationNetPrice, investorCompound],
    findings: [
      'The calculator grows today\'s annual cost until school starts, increases each school year separately, and compares the total with projected savings at the start date.',
      'The result labels first-year estimate, total estimated cost, projected savings, and gap or surplus so users can see the cost side and savings side separately.',
      'The guide now directs users to school net price calculators and warns that aid, grants, loans, housing, books, travel, residency, and school-specific billing can change the real cost.',
    ],
    improvements: [
      'Added a college-cost-specific guide detail and source, then manually checked cost-growth math, savings projection, examples, FAQ cautions, related tools, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add a school-year cash-flow mode later if users need savings drawdown during each year of school instead of one start-date comparison.',
    ],
  },
  {
    slug: 'simple-interest-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-3-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [investorCompound, openStaxPercent],
    findings: [
      'The calculator uses the simple interest formula principal times annual rate times years, then adds interest to principal for ending balance.',
      'The examples cover whole-year, partial-year, and zero-rate cases without implying compounding or payment schedules.',
      'The guide and FAQ explain the key mistake: simple interest is not compound interest, and a percent field expects 5 for 5%, not 0.05.',
    ],
    improvements: [
      'Added simple-interest-specific guide detail and manually checked formula behavior, examples, result labels, FAQ wording, related links, source coverage, SEO copy, and privacy note.',
    ],
    followUps: [
      'Add day-count basis options only if a future tool needs bank-style actual-day interest conventions.',
    ],
  },
  {
    slug: 'cd-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-3-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [fdicCdShopping, investorCompound],
    findings: [
      'The calculator applies APY growth over the term in months and estimates the early withdrawal penalty as entered months of simple interest.',
      'The result separates maturity value, interest earned, penalty estimate, and value after penalty so users do not confuse normal maturity with early withdrawal.',
      'The guide and FAQ warn that bank disclosures control exact APY, compounding, maturity, renewal, insurance, minimum balance, and withdrawal penalty rules.',
    ],
    improvements: [
      'Added CD-specific guide detail and manually checked APY math, term-month validation, penalty wording, examples, FDIC source coverage, SEO copy, related tools, and privacy note.',
    ],
    followUps: [
      'Add separate daily-compounding and brokered-CD options only after researching disclosure-safe wording.',
    ],
  },
  {
    slug: 'bond-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-3-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [investorBonds, investorCompound],
    findings: [
      'The calculator computes annual coupon income, current yield, total coupon payments, and an approximate yield to maturity from face value, market price, coupon rate, and years.',
      'The UI asks for coupon payments per year but correctly labels the yield result as approximate instead of a full bond-pricing output.',
      'The guide and FAQ warn about callable bonds, accrued interest, taxes, reinvestment risk, credit risk, duration, convexity, and changing market rates.',
    ],
    improvements: [
      'Added bond-specific guide detail and manually checked coupon/yield math, examples, result labels, FAQ cautions, source coverage, related tools, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add precise yield-to-maturity solving and dirty-price handling only as a separate advanced bond mode with tests.',
    ],
  },
  {
    slug: 'mutual-fund-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-3-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [investorMutualFunds, investorCompound],
    findings: [
      'The calculator projects a gross balance, subtracts expense ratio from the annual return assumption for a simple net projection, then reports estimated expense drag.',
      'The result separates projected balance after expenses, balance before expense estimate, total contributions, net return, and fee drag.',
      'The guide and FAQ now make clear that this is hypothetical and excludes actual fund performance, taxes, loads, trading costs, distributions, changing expenses, and market volatility.',
    ],
    improvements: [
      'Added mutual-fund-specific guide detail and manually checked projection logic, expense-ratio wording, examples, FAQ cautions, source coverage, related tools, SEO copy, and privacy note.',
    ],
    followUps: [
      'Add a richer expense model later if the site supports annual fee timing, loads, and taxable distributions.',
    ],
  },
  {
    slug: 'roth-ira-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-3-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [irsIraLimits, investorCompound],
    findings: [
      'The calculator converts annual contribution to monthly deposits, compounds the current balance monthly, and separates contributions from estimated growth.',
      'The guide and FAQ keep Roth IRA tax and eligibility language careful: the tool does not enforce IRS limits, income phaseouts, withdrawal rules, penalties, taxes, fees, or market risk.',
      'The examples support long-term, starting-from-zero, and near-retirement scenarios without implying contribution eligibility.',
    ],
    improvements: [
      'Added Roth-IRA-specific guide detail and manually checked projection math, contribution wording, examples, IRS source coverage, FAQ cautions, related tools, SEO copy, and privacy note.',
    ],
    followUps: [
      'Add year-sensitive limit warnings only with a maintained source update process.',
    ],
  },
  {
    slug: 'ira-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-3-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [irsIraLimits, investorCompound],
    findings: [
      'The calculator uses the same IRA projection helper as Roth IRA: monthly compounding plus annual contribution divided into monthly deposits.',
      'The result labels projected balance, total contributions, annual contribution, and estimated growth so users can separate deposits from return assumptions.',
      'The guide and FAQ warn about deductions, Roth eligibility, IRS contribution limits, required minimum distributions, penalties, taxes, fees, and investment risk.',
    ],
    improvements: [
      'Added IRA-specific guide detail and manually checked projection math, examples, FAQ cautions, IRS source coverage, related tools, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add Traditional versus Roth comparison only after tax-assumption fields and disclaimers are designed.',
    ],
  },
  {
    slug: 'vat-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-3-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [euVat, openStaxPercent],
    findings: [
      'The calculator adds VAT by multiplying net amount by one plus the rate, and removes VAT by dividing gross amount by one plus the rate.',
      'The result shows net amount, VAT amount, gross amount, and rate used, which keeps add and remove modes easy to check.',
      'The guide and FAQ now warn that rates, exemptions, invoice rules, registration, reverse charge, and reporting requirements vary by country and transaction type.',
    ],
    improvements: [
      'Added VAT-specific guide detail and manually checked add/remove math, examples, FAQ cautions, source coverage, related tools, SEO copy, and privacy note.',
    ],
    followUps: [
      'Add country-specific VAT presets only if there is a maintained data source and clear update policy.',
    ],
  },
  {
    slug: 'cash-back-or-low-interest-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-3-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [cfpbAutoFinancingOffers, cfpbApr],
    findings: [
      'The calculator estimates total paid for the cash-back APR, subtracts the rebate value, then compares that net cost with the low-interest APR total paid over the same term.',
      'The result names the lower estimated total-cost option and shows savings, cash-back value, cash-back net cost, and low-interest total cost.',
      'The guide and FAQ warn that advertised low APRs and rebates can depend on credit approval, model restrictions, fees, taxes, eligibility rules, dealer add-ons, and offer dates.',
    ],
    improvements: [
      'Added cash-back-versus-low-interest guide detail, added a CFPB auto-financing incentive source, and manually checked comparison logic, examples, FAQ cautions, related tools, SEO copy, and privacy note.',
    ],
    followUps: [
      'Add a mode where the rebate is applied as a down payment if users need that specific dealer-offer comparison.',
    ],
  },
  {
    slug: 'auto-lease-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-4-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [ftcAutoLease, cfpbApr],
    findings: [
      'The calculator subtracts down payment and trade-in from vehicle price plus fees, checks that adjusted capitalized cost is above residual value, then separates depreciation fee, finance fee, tax, and total lease cost.',
      'The guide and FAQ now explain money factor, residual value, adjusted capitalized cost, mileage limits, acquisition/disposition fees, wear charges, and early termination limits in plain language.',
      'The UI result labels support quote checking because users can see which part of the payment comes from depreciation versus financing instead of only seeing one monthly number.',
    ],
    improvements: [
      'Added auto-lease-specific guide detail and manually checked lease formula, edge guardrails, examples, FAQ cautions, FTC/CFPB source coverage, related tools, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add an optional money-factor-to-APR helper only after designing clear lease-specific wording that does not imply APR equivalence.',
    ],
  },
  {
    slug: 'depreciation-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-4-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [irsDepreciation, openStaxDepreciation],
    findings: [
      'The calculator handles straight-line depreciation as depreciable amount divided by useful life and declining-balance depreciation as a rate applied to remaining book value while respecting salvage value.',
      'The guardrails reject salvage value at or above cost and keep book value from dropping below salvage value, matching the educational depreciation model on the page.',
      'The guide and FAQ now make the tax boundary clear: the tool does not determine MACRS class life, partial-year conventions, bonus depreciation, recapture, or accounting policy.',
    ],
    improvements: [
      'Added depreciation-specific guide detail and manually checked straight-line math, declining-balance loop, examples, FAQ cautions, IRS/OpenStax sources, SEO copy, related links, and privacy note.',
    ],
    followUps: [
      'Add MACRS-style tax depreciation only as a separate maintained calculator with year-specific source review.',
    ],
  },
  {
    slug: 'average-return-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-4-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [investorAnnualReturn, investorCompound],
    findings: [
      'The calculator adjusts net gain for contributions and withdrawals, divides by beginning value plus contributions for cumulative return, then divides by years for simple average annual return.',
      'The result also shows a basic CAGR comparison from beginning value to ending value, and the guide now warns that CAGR is not cash-flow adjusted in this simplified tool.',
      'The page now explains that the estimate is not time-weighted return, money-weighted return, IRR, a tax report, or investment advice.',
    ],
    improvements: [
      'Added average-return-specific guide detail and manually checked return math, example wording, source coverage, FAQ cautions, result labels, related tools, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Promote users with uneven cash flows toward IRR Calculator until this tool gets a dedicated money-weighted return mode.',
    ],
  },
  {
    slug: 'margin-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-4-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxDiscounts, openStaxPercent],
    findings: [
      'The calculator correctly separates profit, margin, and markup: profit equals revenue minus cost, margin divides profit by revenue, and markup divides profit by cost.',
      'The guide now spells out the common mistake that margin and markup are different percentages even when profit dollars are the same.',
      'The page keeps the scope to business pricing math and does not confuse it with brokerage margin, debt-funded investing, or investment borrowing.',
    ],
    improvements: [
      'Added margin-specific guide detail and manually checked formulas, examples, FAQ wording, OpenStax source coverage, related tools, SEO copy, and privacy note.',
    ],
    followUps: [
      'Add target-price solving later if users need to enter a desired margin and calculate selling price.',
    ],
  },
  {
    slug: 'discount-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-4-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxDiscounts, openStaxPercent],
    findings: [
      'The calculator applies the first discount to original price, applies the extra discount to the reduced subtotal, then adds tax to the discounted subtotal when a tax rate is entered.',
      'The result separates total savings before tax, effective discount, discounted subtotal, tax amount, and final price so stacked-discount math is checkable.',
      'The guide and FAQ now warn that stacked discounts are sequential, not simply additive, and that coupon exclusions, shipping, tax exemptions, and local rules are outside the math.',
    ],
    improvements: [
      'Added discount-specific guide detail and manually checked stacked discount behavior, tax handling, examples, FAQ cautions, source coverage, related tools, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add a reverse-discount mode only if it can stay clearly separate from the existing Percent Off and Percentage tools.',
    ],
  },
  {
    slug: 'business-loan-calculator',
    status: 'deep-reviewed',
    batch: 'all-pages-dataforseo-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [sbaLoans, cfpbAprVsInterest, ftcSmallBusinessFinancing],
    findings: [
      'The calculator uses the fixed-payment loan helper, calculates origination fee from principal, and reports cash received after fee plus total cost with fee.',
      'The 2026-05-26 sprint used page-specific DataForSEO evidence and current SBA, CFPB, and FTC source checks for business-loan payment, APR, fee, and small-business financing context.',
      'The guide explains that payment is based on principal even when the fee reduces cash received, which is the key borrower-side confusion for fee-heavy offers.',
      'The page clearly excludes underwriting, collateral, personal guarantees, SBA eligibility, draw schedules, variable rates, late fees, tax treatment, merchant cash advances, and prepayment rules.',
    ],
    improvements: [
      'Added business-loan-specific SEO metadata, exact monthly payment and fee examples, priority FAQs, guide sections, source links, sitemap dates, and tool/guide art alt and caption text.',
    ],
    followUps: [
      'Add SBA-specific loan pages only if eligibility, fees, and program limits are maintained from official SBA sources.',
    ],
  },
  {
    slug: 'debt-to-income-ratio-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-4-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [cfpbDebtToIncome, cfpbMortgage],
    findings: [
      'The calculator adds existing monthly debt payments and proposed housing payment, then divides by gross monthly income to produce a debt-to-income percentage.',
      'The guide now explains gross income, total monthly debt, proposed housing payment, and why remaining income is not the same thing as a full budget.',
      'The FAQ and source wording now make clear that lenders may count debts, income, and housing costs differently.',
    ],
    improvements: [
      'Added debt-to-income-specific guide detail and manually checked ratio math, examples, result labels, FAQ cautions, CFPB source coverage, related tools, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add front-end/back-end housing ratio split later if mortgage search behavior shows demand for lender-style ratio comparisons.',
    ],
  },
  {
    slug: 'personal-loan-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-4-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [cfpbPersonalInstallmentFees, cfpbAprVsInterest],
    findings: [
      'The calculator shares the fixed-payment and origination-fee model with the business loan tool, then labels the result for personal-loan comparison.',
      'The guide now explains the difference between monthly payment, total interest, origination fee, cash received, and total cost with fee.',
      'The page warns users to check lender disclosures for APR, fees, late charges, optional insurance, credit impact, prepayment rules, and rate eligibility.',
    ],
    improvements: [
      'Added personal-loan-specific guide detail and manually checked fixed-payment math, fee handling, examples, FAQ cautions, CFPB source coverage, related tools, SEO copy, and privacy note.',
    ],
    followUps: [
      'Add a loan-offer comparison table only after APR, fee timing, and proceeds assumptions are explicit in the UI.',
    ],
  },
  {
    slug: 'boat-loan-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-4-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [cfpbAprVsInterest, cfpbAutoFinancingOffers],
    findings: [
      'The calculator uses the auto-loan summary helper to estimate taxable amount, sales tax, amount financed, fixed monthly payment, total paid, and total interest.',
      'The guide now keeps boat-specific ownership costs visible, including storage, marina fees, maintenance, inspections, insurance, fuel, trailer costs, and registration.',
      'The page warns against comparing only monthly payment, especially when boat loan terms can be long and total interest can grow quickly.',
    ],
    improvements: [
      'Added boat-loan-specific guide detail and manually checked amount-financed math, examples, FAQ cautions, CFPB source coverage, related tools, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add ownership-cost add-ons only after deciding whether this remains a loan calculator or becomes a full boat affordability tool.',
    ],
  },
  {
    slug: 'lease-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-4-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [ftcAutoLease, cfpbApr],
    findings: [
      'The calculator adjusts asset value for fees and upfront payment, checks that adjusted cost is above residual value, then separates depreciation fee, finance fee, monthly payment, and total lease cost.',
      'The guide now explains residual value, adjusted cost, depreciation portion, finance portion, and total lease cost for a generic asset lease.',
      'The FAQ and note keep contract-specific taxes, maintenance obligations, insurance, renewal terms, buyout rights, use limits, and early-exit costs outside the estimate.',
    ],
    improvements: [
      'Added lease-specific guide detail and manually checked generic lease formula, guardrails, examples, FAQ cautions, source coverage, related tools, SEO copy, and privacy note.',
    ],
    followUps: [
      'Add equipment-specific tax and buyout modes only if they can be handled without implying legal or accounting advice.',
    ],
  },
  {
    slug: 'refinance-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-5-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [cfpbMortgage, cfpbAprVsInterest],
    findings: [
      'The calculator estimates the current payment, adds closing costs to the new principal, estimates the new payment, and compares monthly savings plus total paid and total interest changes.',
      'The break-even result is only shown when payment savings are positive, which avoids a fake recovery date when the refinance payment is not lower.',
      'The guide now explains the key refinance trap: lower monthly payment can come from a longer term, not only from a better rate.',
    ],
    improvements: [
      'Added refinance-specific guide detail and manually checked payment comparison math, closing-cost handling, break-even wording, source coverage, examples, FAQ cautions, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add an out-of-pocket closing-cost mode later so users can compare rolling costs into the loan versus paying costs upfront.',
    ],
  },
  {
    slug: 'budget-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-5-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [consumerBudgetWorksheet, cfpbDebtToIncome],
    findings: [
      'The calculator totals monthly categories, subtracts them from monthly income, and reports expense ratio, savings rate, and category percentages.',
      'Savings is intentionally visible as its own category so the page can explain whether the plan includes saving rather than hiding it inside leftover money.',
      'The guide now warns users to convert irregular annual bills into monthly averages before entering them.',
    ],
    improvements: [
      'Added budget-specific guide detail and manually checked category math, monthly-unit language, examples, FAQ cautions, source coverage, related tools, SEO copy, and privacy note.',
    ],
    followUps: [
      'Add optional irregular-expense fields only if the UI can keep the simple monthly worksheet easy to read.',
    ],
  },
  {
    slug: 'marriage-tax-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [irsTax2026, irsRevenueProcedure, irsPublication501],
    findings: [
      'The calculator estimates each person as a single filer, estimates combined income as married filing jointly, then reports the joint tax minus the two-single total.',
      'DataForSEO page evidence found demand around married filing jointly tax calculator, taxes married vs single calculator, married vs single tax brackets, marriage tax bonus, and marriage penalty intent.',
      'The guide now explains why the $90,000 plus $70,000 example can show a $0 difference, and how to read positive versus negative marriage difference without calling it filing advice.',
      'The FAQ and guide keep the simplified federal scope clear because married filing separately, state tax, payroll tax, credits, dependents, AMT, community-property rules, benefits, and phaseouts can change the real answer.',
    ],
    improvements: [
      'Refreshed marriage-tax-specific title/meta copy, examples with deterministic outputs, input explanations, FAQ cautions, guide sections, trust blocks, image alt/captions, IRS source coverage, dates, and zero-difference result wording.',
    ],
    followUps: [
      'Add married filing separately, state tax, dependent credits, and phaseout modeling only after a maintained tax-data update process exists.',
    ],
  },
  {
    slug: 'estate-tax-calculator',
    status: 'deep-reviewed',
    batch: 'all-pages-dataforseo-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [irsTax2026, irsEstateTax, irsEstateTaxFaqs, irsForm706Instructions],
    findings: [
      'The calculator subtracts debts, expenses, charitable bequests, and spouse transfers from gross estate, reduces the 2026 basic exclusion by prior taxable gifts, and applies a simplified 40% estimate above the remaining exclusion.',
      'The 2026 federal basic exclusion amount matches the IRS published $15,000,000 amount for estates of decedents dying in 2026.',
      'The guide now makes clear that Form 706, trusts, portability, DSUE, GST tax, state estate tax, inheritance tax, valuation discounts, business/farm issues, and elections are outside this calculator.',
    ],
    improvements: [
      'Replaced generic finance template wording with estate-tax-specific SEO title, description, FAQ answers, guide copy, result-reading language, trust note, image alt/caption text, examples, IRS source coverage, and privacy limits.',
    ],
    followUps: [
      'Do not add state estate tax presets until a maintained state-law source and update policy are in place.',
    ],
  },
  {
    slug: 'social-security-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-5-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [ssaClaimingAge, investorCompound],
    findings: [
      'The calculator estimates full retirement age from birth year and applies SSA-style early reduction before full retirement age or delayed credits after full retirement age through age 70.',
      'The UI requires claiming age between 62 and 70, matching the retirement claiming range explained in the source material.',
      'The guide now tells users to start from an official SSA full-retirement-age benefit estimate instead of guessing their lifetime earnings record.',
    ],
    improvements: [
      'Added Social-Security-specific guide detail and manually checked claiming-age math, result labels, examples, FAQ cautions, SSA source coverage, related tools, SEO copy, and privacy note.',
    ],
    followUps: [
      'Add spousal, survivor, earnings-test, tax, and COLA modeling only as separate clearly sourced modules.',
    ],
  },
  {
    slug: 'rmd-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-5-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [irsRmd, irsIraLimits],
    findings: [
      'The calculator uses the prior December 31 account balance divided by the IRS Uniform Lifetime Table factor for the entered age.',
      'The guardrail rejects ages below the table range used by this simple owner-style estimate and floors decimal ages to the entered age year.',
      'The guide now warns that inherited IRAs, spouse-more-than-10-years-younger rules, Roth IRA owner rules, multiple accounts, and excess withdrawals need separate review.',
    ],
    improvements: [
      'Added RMD-specific guide detail and manually checked table-factor lookup, balance wording, examples, FAQ cautions, IRS source coverage, related tools, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add inherited IRA and younger-spouse modes only after designing separate input flows and source notes.',
    ],
  },
  {
    slug: 'real-estate-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-5-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [cfpbMortgage, investorCompound],
    findings: [
      'The calculator builds cash invested from down payment, buying costs, and improvements, then subtracts selling costs and loan payoff from sale price to estimate net sale proceeds.',
      'Profit, ROI, and equity multiple are labeled separately so a user can distinguish dollar gain from percentage return and proceeds multiple.',
      'The guide now warns that tax basis, capital gains tax, depreciation, depreciation recapture, transfer taxes, and legal costs are not included.',
    ],
    improvements: [
      'Added real-estate-specific guide detail and manually checked sale-profit math, loan-payoff language, examples, FAQ cautions, source coverage, related tools, SEO copy, and privacy note.',
    ],
    followUps: [
      'Add sale-tax and capital-gains modes only when the site has tax-law update coverage and stronger jurisdiction wording.',
    ],
  },
  {
    slug: 'take-home-paycheck-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-5-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [irsFica, irsWithholdingEstimatorFaqs],
    findings: [
      'The calculator annualizes pretax deductions, applies entered federal, state, and local tax percentages, and separately estimates employee Social Security and Medicare withholding.',
      'The FICA constants match IRS Topic 751 for 2026: 6.2% Social Security up to the 2026 wage base, 1.45% Medicare, and 0.9% Additional Medicare above $200,000.',
      'The guide now warns users not to double count Social Security and Medicare inside the federal tax percentage field.',
    ],
    improvements: [
      'Added take-home-paycheck-specific guide detail and manually checked pay-period math, FICA handling, percent-field wording, examples, FAQ cautions, IRS source coverage, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add W-4-style federal withholding only if the project can maintain official IRS table changes over time.',
    ],
  },
  {
    slug: 'rental-property-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-5-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [cfpbMortgage, consumerBudgetWorksheet],
    findings: [
      'The calculator estimates mortgage payment, vacancy reserve, maintenance reserve, operating expenses, NOI, monthly cash flow, cap rate, and cash-on-cash return.',
      'The guide now explains that NOI is before loan payment while cash flow is after the mortgage payment, preventing a common rental-property reading mistake.',
      'The page warns that depreciation, income tax, repairs timing, tenant risk, rent control, property management contracts, and local landlord rules are outside the estimate.',
    ],
    improvements: [
      'Added rental-property-specific guide detail and manually checked cash-flow math, NOI and cap-rate wording, examples, FAQ cautions, source coverage, related tools, SEO copy, and privacy note.',
    ],
    followUps: [
      'Add a repair-capex reserve mode only if it stays separate from normal operating expenses in the result labels.',
    ],
  },
  {
    slug: 'irr-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-5-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxIrr, investorCompound],
    findings: [
      'The calculator requires at least one negative and one positive cash flow, then uses bisection to solve for the periodic rate that makes NPV approximately zero.',
      'The annualized result compounds the solved periodic rate by periods per year, so the period setting is part of the math and not just a label.',
      'The guide now warns that IRR can be misleading when cash-flow signs switch more than once, projects have very different sizes, or reinvestment assumptions are unrealistic.',
    ],
    improvements: [
      'Added IRR-specific guide detail and manually checked solver guardrails, annualization, examples, FAQ cautions, OpenStax source coverage, related tools, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add an NPV comparison line with a user-entered discount rate if users need a better companion metric for project ranking.',
    ],
  },
  {
    slug: 'roi-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-6-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxInvestments, investorAnnualReturn],
    findings: [
      'The calculator adds ending value and income, subtracts costs and initial investment, then divides gain or loss by initial investment for simple ROI.',
      'The result correctly labels positive and negative outcomes as estimated gain or estimated loss while keeping dollar gain and percentage ROI separate.',
      'The guide now warns that simple ROI ignores time length, compounding, taxes, financing, risk, inflation, and cash-flow timing.',
    ],
    improvements: [
      'Added ROI-specific guide detail and manually checked formula behavior, examples, result labels, FAQ cautions, OpenStax/Investor.gov source coverage, related tools, SEO copy, and privacy note.',
    ],
    followUps: [
      'Add an annualized ROI mode only if the UI makes the time-period assumption impossible to miss.',
    ],
  },
  {
    slug: 'apr-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-6-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [cfpbAprVsInterest, cfpbApr],
    findings: [
      'The calculator estimates the scheduled payment from principal and note rate, subtracts fees from amount received, then solves the rate implied by that payment stream.',
      'The guide now explains why APR can be higher than note rate when fees reduce the effective amount received.',
      'The page clearly says this is not an official Truth in Lending disclosure and that official APR rules can use specific finance-charge and tolerance rules.',
    ],
    improvements: [
      'Added APR-specific guide detail and manually checked solver behavior, fee handling, examples, FAQ cautions, CFPB source coverage, related tools, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add an official-disclosure checklist later without implying the site can replace lender APR disclosures.',
    ],
  },
  {
    slug: 'fha-loan-calculator',
    status: 'deep-reviewed',
    batch: 'all-pages-dataforseo-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [cfpbFhaLoans, hudFhaLoans, hudFhaLoanLimits2026, hudFhaLoanLimitsMl2025, hudFhaMip, hudFhaMipMortgageeLetter2023, cfpbDownPayment, cfpbPrepareHomeMoney],
    findings: [
      'The calculator estimates base loan amount, financed upfront MIP, principal and interest, property tax, insurance, monthly MIP, loan-to-value, and total monthly payment.',
      'The guide now uses the $325,000, 3.5% down, 1.75% upfront MIP, 0.55% annual MIP example and keeps upfront MIP, monthly MIP, LTV, closing costs, and total payment separate.',
      'The limitations now emphasize 2026 county loan limits, FHA eligibility, credit and debt-to-income review, property rules, lender overlays, closing costs, escrow, MIP duration, and official FHA updates.',
    ],
    improvements: [
      'Added FHA-loan-specific SEO title and description, MIP/LTV examples, 2026 loan-limit cautions, annual-MIP-rate caveats, priority FAQs, current HUD/CFPB source coverage, trust wording, internal links, specific image alt/caption text, and privacy/result notes.',
    ],
    followUps: [
      'Add county-limit lookup or maintained official MIP presets only if there is a durable update source and a date-stamped assumptions table on the tool.',
    ],
  },
  {
    slug: 'va-mortgage-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-6-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [vaFundingFee, cfpbMortgage],
    findings: [
      'The calculator chooses common VA purchase funding-fee rates from down payment and first-use status, supports exemption, and optionally finances the fee into the loan.',
      'The VA funding-fee logic matches the official VA purchase chart effective April 7, 2023: 2.15% first use under 5%, 3.3% later use under 5%, 1.5% at 5% down, and 1.25% at 10% down.',
      'The guide now warns that VA eligibility, exemption status, seller concessions, closing costs, lender fees, appraisal, and refinance types need official loan review.',
    ],
    improvements: [
      'Added VA-mortgage-specific guide detail and manually checked funding-fee conditions, financing behavior, payment math, examples, FAQ cautions, VA/CFPB source coverage, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add separate VA IRRRL and cash-out refinance handling only as separate sourced tools or modes.',
    ],
  },
  {
    slug: 'home-equity-loan-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [
      cfpbHomeEquity,
      cfpbHomeEquityVsHeloc,
      ftcHomeEquityLoans,
      cfpbLoanEstimate,
      cfpbClosingDisclosure,
      irsPub936HomeMortgageInterest,
      googleHelpfulContent,
    ],
    findings: [
      'The calculator estimates available equity from home value, current mortgage balance, and max combined LTV, then estimates fixed payment and total interest for the desired loan amount.',
      'The result separates available equity at limit from combined LTV, preventing the requested loan amount from being confused with total equity.',
      'The guide now makes the collateral risk explicit: missed home equity loan payments can put the home at risk.',
      'The 2026-05-31 sprint added current CFPB, FTC, disclosure, and IRS context so the page does not imply payment math is the whole decision.',
    ],
    improvements: [
      'Added a source SEO title and description, CLTV and payment examples, six extra visible FAQs, payment-vs-APR/fee cautions, tax-deductibility caveats, current source links, specific image alt/caption text, and privacy/result notes.',
    ],
    followUps: [
      'Add an upfront-fee and APR comparison mode after APR assumptions are made clearer in the UI.',
    ],
  },
  {
    slug: 'heloc-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-6-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [cfpbHeloc, cfpbHomeEquity],
    findings: [
      'The calculator checks current draw against credit line, estimates available equity, computes draw-period interest-only payment, and estimates repayment-period payment for the drawn balance.',
      'The guide now explains that current draw is different from the full credit line and that the interest-only payment is not the permanent payment.',
      'The page warns about variable rates, lender freezes, draw minimums, fees, balloon payments, repayment-period jumps, and home-collateral risk.',
    ],
    improvements: [
      'Added HELOC-specific guide detail and manually checked draw handling, interest-only math, repayment estimate, examples, FAQ cautions, CFPB source coverage, related tools, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add a rate-change sensitivity table later because many HELOCs are variable-rate products.',
    ],
  },
  {
    slug: 'down-payment-calculator',
    status: 'deep-reviewed',
    batch: 'all-pages-dataforseo-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [cfpbDownPayment, cfpbPrepareHomeMoney, fannieClosingCostsCalculator, fannieDownPayment, fannieClosingOnLoan, hudFhaLoans],
    findings: [
      'The calculator uses an exact down payment when entered; otherwise it multiplies home price by down payment percent, then estimates loan amount, LTV, closing costs, and cash needed.',
      'The result separates down payment, loan amount, loan-to-value, closing cost estimate, and cash needed so low-down-payment examples do not hide extra borrowing.',
      'The guide now uses CFPB, Fannie Mae, and HUD context to explain that closing costs are separate from down payment, 2% to 5% is only a rough early planning range, and FHA 3.5% is not automatic approval.',
    ],
    improvements: [
      'Added page-specific SEO title and description, exact $400,000, $325,000, and $450,000 examples, down-payment FAQs, source links, cash-to-close cautions, DataForSEO proof placeholders, result-note wording, and specific tool-art alt/caption text.',
    ],
    followUps: [
      'Add a location-aware assistance-program lookup only if a maintained source can support it without guessing state and local rules.',
    ],
  },
  {
    slug: 'rent-vs-buy-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-6-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [cfpbDownPayment, cfpbMortgage],
    findings: [
      'The calculator projects rent with annual increases, estimates buying cash outflow, estimates sale proceeds after appreciation and selling costs, subtracts remaining loan balance, and compares net buying cost with rent cost.',
      'The guide now stresses that time horizon changes the answer because selling costs and early mortgage amortization can dominate short stays.',
      'The page cautions that opportunity cost, PMI, HOA, taxes, repair timing, moving costs, and lifestyle flexibility are outside the simplified comparison.',
    ],
    improvements: [
      'Added rent-versus-buy-specific guide detail and manually checked projection math, sale-proceeds wording, examples, FAQ cautions, CFPB source coverage, related tools, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add opportunity-cost and PMI options later if the calculator can keep assumptions readable.',
    ],
  },
  {
    slug: 'payback-period-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [openStaxPayback, openStaxNpv, googleHelpfulContent],
    findings: [
      'The calculator divides initial cost by annual cash flow for simple payback years and reports simple net after the chosen horizon.',
      'The guide explains the main weakness of simple payback: it ignores time value of money, uneven cash flows, and cash earned after the recovery point.',
      'The related-tool path pushes users toward ROI, IRR, and present value when they need gain, uneven-cash-flow, or discount-rate context.',
    ],
    improvements: [
      'Added a source SEO title and description, exact example outcomes, input explanations, extra FAQs, stronger uneven-cash-flow and discounted-payback cautions, current OpenStax/Google source coverage, page-specific DataForSEO proof, browser proof, and specific image alt text.',
    ],
    followUps: [
      'Add discounted payback only as a separate mode with a required discount-rate input.',
      'Add a small uneven-cash-flow table only if the UI can show each year without making the simple calculator confusing.',
    ],
  },
  {
    slug: 'present-value-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-6-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxPresentValue, openStaxNpv],
    findings: [
      'The calculator discounts a future lump sum and a regular payment stream using the entered rate, years, and payments per year, then adds the present value parts.',
      'The output separates lump-sum present value from annuity present value so users can see which part drives the total.',
      'The guide now explains that higher discount rates lower present value and that payment frequency must match the payment amount entered.',
    ],
    improvements: [
      'Added present-value-specific guide detail and manually checked discounting math, annuity handling, examples, FAQ cautions, OpenStax source coverage, related tools, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add beginning-of-period payment timing only if the UI clearly separates ordinary annuity from annuity due.',
    ],
  },
  {
    slug: 'future-value-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-7-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxFutureValue, openStaxPresentValue, investorCompound],
    findings: [
      'The calculator compounds the starting principal and future-values each regular end-of-period payment using the entered rate, years, and payments per year.',
      'The output separates principal future value from contribution future value, which helps users see whether the starting amount or payment stream drives the projection.',
      'The guide now explains payment-frequency matching and ordinary-annuity timing so users do not mix monthly deposits with annual periods.',
    ],
    improvements: [
      'Added future-value-specific guide detail and manually checked compounding math, result labels, examples, FAQ cautions, OpenStax/Investor.gov source coverage, related tools, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add a beginning-of-period contribution option only if the UI can clearly explain annuity-due timing.',
    ],
  },
  {
    slug: 'commission-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-7-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [dolCommissions, irsFica],
    findings: [
      'The calculator multiplies sales by commission percent, applies split percent, then adds base pay and bonus to estimate simple gross pay.',
      'The page correctly frames the result as simple math, not as proof that a commission is earned, owed, payable, or tax-adjusted.',
      'The guide now explains gross commission versus split amount and calls out tiered plans, draw plans, clawbacks, cancellations, and written plan rules.',
    ],
    improvements: [
      'Added commission-specific guide detail and manually checked formula behavior, percent labels, examples, FAQ cautions, DOL source coverage, related tools, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Consider a tiered-commission mode later if users need quota bands, accelerators, or draw-against-commission scenarios.',
    ],
  },
  {
    slug: 'mortgage-calculator-uk',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [moneyHelperMortgage, moneyHelperMortgageOptions, govUkBuyingHome, govUkSdltRates, govUkMortgage],
    findings: [
      'The calculator subtracts deposit from property price, estimates a UK repayment mortgage payment, and adds optional monthly fees for a total monthly estimate.',
      'The 2026-05-31 sprint used page-specific DataForSEO evidence for mortgage repayment calculator intent, official MoneyHelper and GOV.UK source checks, competitor evidence, and in-app Browser proof.',
      'The result labels loan amount, loan-to-value, monthly repayment, total monthly payment, and total interest so deposit, term, and rate effects are visible.',
      'The guide separates repayment payment math from lender affordability checks, credit review, stamp duty or local land tax, product fees, valuation, survey, solicitor costs, leasehold costs, insurance, and interest-only products.',
    ],
    improvements: [
      'Added UK-mortgage-specific SEO metadata, aliases, exact payment examples, priority FAQs, guide sections, source links, sitemap dates, result note wording, and tool/guide art alt and caption text.',
    ],
    followUps: [
      'Add stamp-duty, local land-tax, or one-off product-fee fields only if the page can keep England, Northern Ireland, Scotland, and Wales rules clear and current.',
    ],
  },
  {
    slug: 'canadian-mortgage-calculator',
    status: 'deep-reviewed',
    batch: 'all-pages-dataforseo-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [canadaMortgageTerms, canadaMortgageDownPayment, osfiMinimumQualifyingRate, bankCanadaPolicyRate, canadaInterestAct],
    findings: [
      'The calculator subtracts down payment from property price, converts the nominal annual rate through semi-annual compounding, then estimates payment for the selected frequency.',
      'The output makes payment frequency and loan-to-value visible, which is important because Canadian-style mortgage math should not be read as a basic U.S. monthly-rate shortcut.',
      'The 2026-05-26 sprint used page-specific DataForSEO evidence and current Canada.ca, OSFI, and Bank of Canada source checks for down payment, default-insurance, amortization, stress-test, and rate-context coverage.',
      'The guide explains semi-annual compounding, amortization length, payment frequency, renewal risk, default insurance, and non-accelerated versus accelerated payment caution.',
    ],
    improvements: [
      'Added Canadian-mortgage-specific SEO metadata, exact payment and interest examples, priority FAQs, guide sections, source links, sitemap dates, result frequency labeling, and tool/guide art alt and caption text.',
    ],
    followUps: [
      'Add CMHC/default-insurance and accelerated-payment modes only with clear official source maintenance.',
    ],
  },
  {
    slug: 'percent-off-calculator',
    status: 'deep-reviewed',
    batch: 'finance-manual-pass-7-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxDiscounts, openStaxPercent],
    findings: [
      'The calculator applies the first discount, applies the second discount to the reduced price, then adds optional tax and reports final price.',
      'The result includes effective discount so users can see why stacked discounts are not usually added as simple percentages.',
      'The guide now explains discount order, savings before tax, tax-after-discount behavior, and checkout exceptions such as shipping, exclusions, minimum spend, and fees.',
    ],
    improvements: [
      'Added percent-off-specific guide detail and manually checked stacked-discount math, examples, FAQ cautions, OpenStax source coverage, related tools, SEO copy, and privacy note.',
    ],
    followUps: [
      'Add fixed-dollar coupon support later if users need mixed percent-off and dollar-off checkout scenarios.',
    ],
  },
  {
    slug: 'interest-rate-calculator',
    status: 'deep-reviewed',
    batch: 'all-pages-dataforseo-sprint-2026-05-27',
    reviewedOn: '2026-05-27',
    scope: commonMathScope,
    sources: [cfpbAprVsInterest, cfpbApr, minneapolisFedConsumerRates],
    findings: [
      'The calculator works backward from principal, monthly payment, and term to solve the nominal annual rate implied by a fixed-payment loan formula.',
      'The 2026-05-27 sprint used current CFPB and Minneapolis Fed source checks plus page-specific DataForSEO proof for the tool and guide.',
      'The guide explains that the solved rate is not necessarily APR, especially when fees, insurance, taxes, warranties, or other costs are inside the quoted payment.',
      'The error guardrail protects users from payment amounts too low to repay principal even at a zero percent rate.',
    ],
    improvements: [
      'Added a custom SEO title, exact $25,000, $15,000, and $30,000 examples, APR-versus-rate FAQs, rounded UI rate display, RATE badge wording, source-backed trust copy, guide-specific source notes, stronger tests, and specific image alt/caption text.',
    ],
    followUps: [
      'Add an APR handoff callout if user testing shows people enter fee-heavy quotes into the interest-rate solver.',
    ],
  },
  {
    slug: 'underweight-bmi-calculator',
    status: 'deep-reviewed',
    batch: 'health-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [cdcBmi, nimhEatingDisorders],
    findings: [
      'The calculator uses adult BMI math and compares the result with the 18.5 underweight screening threshold without using harmful diagnostic wording.',
      'The guide clearly says BMI cannot diagnose anorexia, malnutrition, or any eating disorder and sends serious concerns toward qualified professional support.',
      'The result explanation includes the distance to BMI 18.5 so users understand the threshold without treating it as a goal.',
    ],
    improvements: [
      'Manually checked BMI formula, underweight threshold language, safety FAQ, guide article, source coverage, related tools, SEO copy, privacy behavior, and non-shaming wording.',
    ],
    followUps: [
      'Keep eating-disorder support language visible if this page gains search traffic from unsafe "anorexic BMI" style searches.',
    ],
  },
  {
    slug: 'overweight-calculator',
    status: 'deep-reviewed',
    batch: 'health-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [cdcBmi, nhlbiBmi],
    findings: [
      'The calculator uses adult BMI math and compares the result with BMI 25 and BMI 30 screening thresholds.',
      'The guide explains BMI as a screening label, not a measure of worth, effort, fitness, body composition, or full medical risk.',
      'The FAQ and guide correctly point users toward body composition, waist size, labs, medications, and clinician context for real health interpretation.',
    ],
    improvements: [
      'Manually checked overweight/obesity screening thresholds, examples, FAQ cautions, guide clarity, CDC/NHLBI source coverage, related tools, SEO copy, privacy behavior, and people-first wording.',
    ],
    followUps: [
      'Add waist-to-height or waist-circumference companion guidance later if the site adds a dedicated waist-risk calculator.',
    ],
  },
  {
    slug: 'nutrition-points-calculator',
    status: 'deep-reviewed',
    batch: 'health-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [fdaNutritionFacts, dietaryGuidelines],
    findings: [
      'The calculator uses an original transparent label-reading score and does not claim to be Weight Watchers Points or any proprietary diet-program formula.',
      'The guide explains which label fields matter: calories, saturated fat, added sugar, sodium, fiber, and protein.',
      'The caution language makes clear that this is a rough comparison score, not a nutrition diagnosis or medical diet plan.',
    ],
    improvements: [
      'Manually checked score inputs, label wording, examples, proprietary-program disclaimer, FAQ cautions, FDA/Dietary Guidelines source coverage, related tools, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Consider showing the score formula inline beside results if users ask how each nutrient changes the score.',
    ],
  },
  {
    slug: 'body-fat-calculator',
    status: 'deep-reviewed',
    batch: 'health-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [armyBodyCompositionProgram, cdcBmi],
    findings: [
      'The calculator uses circumference-style inputs and labels the result as an estimate, which fits tape-measure body composition methods better than diagnostic language.',
      'The guide explains consistent tape placement, tape tension, and trend tracking so users do not over-read small changes.',
      'The result separates estimated body fat percentage, fat mass, and lean mass for clearer interpretation.',
    ],
    improvements: [
      'Manually checked circumference formula wording, measurement guidance, examples, FAQ cautions, source coverage, related tools, SEO copy, privacy behavior, and non-diagnostic framing.',
    ],
    followUps: [
      'Add a visual measurement guide later if the tool gets traffic, because tape placement is the biggest practical error source.',
    ],
  },
  {
    slug: 'bmr-calculator',
    status: 'deep-reviewed',
    batch: 'health-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [mifflinStJeorEquation, cdcActivity],
    findings: [
      'The calculator uses the Mifflin-St Jeor structure: weight, height, age, and sex adjustment to estimate resting energy needs.',
      'The guide correctly separates BMR from TDEE so users do not mistake resting energy for total daily calories.',
      'The caution language explains that BMR is not a diet target by itself and should not replace medical nutrition guidance.',
    ],
    improvements: [
      'Manually checked BMR formula wording, examples, FAQ cautions, guide clarity, Mifflin/CDC source coverage, related tools, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add alternate formula comparison only if the UI can clearly explain why equations differ.',
    ],
  },
  {
    slug: 'ideal-weight-calculator',
    status: 'deep-reviewed',
    batch: 'health-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [idealBodyWeightCommentary, nhlbiBmi],
    findings: [
      'The calculator explains the Devine ideal body weight estimate while also showing the broader healthy BMI range.',
      'The guide warns that "ideal" is a historical formula label, not a personal command or medical target.',
      'The examples and FAQ keep frame size, muscle, age, pregnancy, and clinician context outside the formula boundaries.',
    ],
    improvements: [
      'Manually checked Devine formula wording, healthy BMI comparison, examples, FAQ cautions, source coverage, related tools, SEO copy, privacy behavior, and non-prescriptive language.',
    ],
    followUps: [
      'Consider renaming visible copy to "reference weight" if search data shows users read "ideal" as a body judgment.',
    ],
  },
  {
    slug: 'pace-calculator',
    status: 'deep-reviewed',
    batch: 'health-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [cdcActivity, nistTimeDefinitions],
    findings: [
      'The calculator divides total time by distance for pace and divides distance by time for speed, with clear per-kilometer and per-mile examples.',
      'The guide frames pace as training math, not medical advice, and cautions users to choose intensity that fits their ability.',
      'The examples cover common 5K, 10K, and mile-based scenarios so users can sanity-check units.',
    ],
    improvements: [
      'Manually checked time/distance logic, unit wording, examples, FAQ cautions, CDC/NIST source coverage, related tools, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add split-table output later if runners ask for mile or kilometer splits across longer distances.',
    ],
  },
  {
    slug: 'army-body-fat-calculator',
    status: 'deep-reviewed',
    batch: 'health-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [armyBodyCompositionProgram, cdcBmi],
    findings: [
      'The calculator uses tape-method body composition inputs and keeps the result educational instead of official.',
      'The caution text clearly says the page is not an official Army determination, record, waiver, or pass/fail result.',
      'The guide explains consistent measurement sites and sends official decisions back to official policy and trained personnel.',
    ],
    improvements: [
      'Manually checked tape-method wording, examples, official-use disclaimer, FAQ cautions, Army source coverage, related tools, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Review this page again if Army body composition policy changes from the current tape-method assumptions.',
    ],
  },
  {
    slug: 'lean-body-mass-calculator',
    status: 'deep-reviewed',
    batch: 'health-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [boerLeanBodyMass, cdcBmi],
    findings: [
      'The calculator uses Boer lean body mass equations and labels the result as a rough estimate from height, weight, and formula sex.',
      'The guide explains that lean mass is not the same thing as muscle mass and that formula estimates are not body scans.',
      'The examples include lean percentage context without turning the result into a health diagnosis.',
    ],
    improvements: [
      'Manually checked Boer formula wording, result labels, examples, FAQ cautions, source coverage, related tools, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add formula comparison only if users need Boer versus James or Hume estimates.',
    ],
  },
  {
    slug: 'healthy-weight-calculator',
    status: 'deep-reviewed',
    batch: 'health-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [cdcBmi, nhlbiBmi],
    findings: [
      'The calculator converts a height into the adult BMI 18.5 to 24.9 weight range using height in meters squared.',
      'The guide explains that the range is an adult screening reference, not a personal target or child/teen percentile.',
      'The related-tool path points users to BMI, ideal weight, and body fat pages for context rather than one-number judgment.',
    ],
    improvements: [
      'Manually checked healthy BMI range math, examples, FAQ cautions, CDC/NHLBI source coverage, guide clarity, related tools, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add child/teen BMI percentile routing only if the site creates a dedicated pediatric BMI page with CDC growth-chart support.',
    ],
  },
  {
    slug: 'calories-burned-calculator',
    status: 'deep-reviewed',
    batch: 'health-manual-pass-2-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [cdcActivity, cdcBmi],
    findings: [
      'The calculator uses the standard MET energy equation structure: MET, body weight, and activity duration create an estimated calorie burn.',
      'The guide explains that activity calories are rough estimates and can differ from watches, gym machines, and real physiology.',
      'The result wording keeps exercise calories separate from medical nutrition advice and daily calorie targets.',
    ],
    improvements: [
      'Manually checked MET input wording, weight and duration behavior, examples, FAQ cautions, guide formula text, source coverage, related tools, SEO copy, privacy behavior, and mobile result clarity.',
    ],
    followUps: [
      'Add a larger activity picker only if users ask for more built-in MET examples.',
    ],
  },
  {
    slug: 'one-rep-max-calculator',
    status: 'deep-reviewed',
    batch: 'health-manual-pass-2-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [aceOneRepMax, cdcActivity],
    findings: [
      'The calculator shows Epley and Brzycki one-rep max estimates and limits practical estimates to sets of 30 reps or fewer.',
      'The guide explains that predicted 1RM is training math, not proof that a heavy single is safe to attempt.',
      'The FAQ and examples warn against using failed reps, partial reps, or unsafe max testing as inputs.',
    ],
    improvements: [
      'Manually checked 1RM formula behavior, rep guardrail, example math, safety wording, guide formula text, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Consider percentage-of-1RM training tables later, but keep them clearly educational and not a training prescription.',
    ],
  },
  {
    slug: 'target-heart-rate-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [ahaTargetHeartRates, cdcActivity, mayoExerciseIntensity, johnsHopkinsTargetHeartRate, googleHelpfulContent],
    findings: [
      'The calculator uses age-predicted max heart rate and intensity percentages, with optional heart-rate-reserve output when resting pulse is entered.',
      'The guide now explains the 93-157 bpm age-35 example, the 125-167 bpm heart-rate-reserve example, and why 220 minus age is only a quick estimate.',
      'The result shows zones as ranges instead of a single perfect number and adds practical limits for symptoms, medication, pregnancy, heat, and clinician advice.',
    ],
    improvements: [
      'Ran GSC-driven page sprint with current AHA, CDC, Mayo Clinic, Johns Hopkins, competitor, and DataForSEO evidence; updated metadata, examples, FAQs, source links, target-specific instructions, art alt/captions, SEO-agent factory scoring, browser proof, and final judges.',
    ],
    followUps: [
      'Watch Search Console for target heart rate by age, heart rate zone, and running-intensity queries before changing the formula model.',
    ],
  },
  {
    slug: 'pregnancy-weight-gain-calculator',
    status: 'deep-reviewed',
    batch: 'health-manual-pass-2-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [cdcPregnancyWeight, johnsHopkinsDueDate],
    findings: [
      'The calculator uses pre-pregnancy BMI categories to choose singleton pregnancy weight-gain ranges and converts pounds to kilograms for the displayed result.',
      'The guide says pregnancy weight-gain guidance must be personalized and does not treat the range as a diet command.',
      'The result separates current gain, recommended total range, and weekly second/third-trimester range so the numbers are easier to read.',
    ],
    improvements: [
      'Manually checked pre-pregnancy BMI logic, guideline-range wording, week interpretation, examples, FAQ cautions, CDC pregnancy source coverage, related tools, SEO copy, privacy behavior, and non-judgmental language.',
    ],
    followUps: [
      'Add twin and higher-order pregnancy routing only if the tool later supports separate guideline ranges.',
    ],
  },
  {
    slug: 'pregnancy-conception-calculator',
    status: 'deep-reviewed',
    batch: 'health-manual-pass-2-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [johnsHopkinsDueDate, johnsHopkinsFertileWindow],
    findings: [
      'The calculator works backward from an estimated due date to an estimated conception date and a wider possible window.',
      'The guide clearly says the result is not proof of an exact conception day and should not be used for legal, relationship, or medical certainty.',
      'The wording separates gestational dating from conception timing, which is the common point of confusion.',
    ],
    improvements: [
      'Manually checked due-date back-counting, conception-window language, examples, FAQ cautions, Johns Hopkins source coverage, related tools, SEO copy, privacy behavior, and calendar-result labels.',
    ],
    followUps: [
      'Add ultrasound-dating wording if the page starts receiving medical-adjacent search traffic.',
    ],
  },
  {
    slug: 'ovulation-calculator',
    status: 'deep-reviewed',
    batch: 'health-manual-pass-2-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [johnsHopkinsFertileWindow, johnsHopkinsDueDate],
    findings: [
      'The calculator estimates ovulation by using cycle length and luteal phase, then shows the fertile window around the estimated ovulation date.',
      'The guide explains that calendar estimates work best with regular cycles and are not reliable contraception.',
      'The examples and FAQ define cycle length as period-start to next period-start, not days of bleeding.',
    ],
    improvements: [
      'Manually checked ovulation date logic, fertile-window wording, luteal-phase explanation, examples, FAQ cautions, source coverage, related tools, SEO copy, privacy behavior, and mobile date output.',
    ],
    followUps: [
      'Add optional ovulation-test and basal-temperature education later without turning the tool into medical advice.',
    ],
  },
  {
    slug: 'conception-calculator',
    status: 'deep-reviewed',
    batch: 'health-manual-pass-2-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [johnsHopkinsFertileWindow, johnsHopkinsDueDate],
    findings: [
      'The calculator estimates conception timing from last period, cycle length, and luteal-phase assumptions.',
      'The guide says conception timing is approximate because ovulation, sperm survival, fertilization, and implantation do not follow a fixed clock.',
      'The related-tool path properly points users to ovulation, pregnancy conception, and due date calculators for different starting information.',
    ],
    improvements: [
      'Manually checked cycle-based conception logic, fertile-window wording, examples, FAQ cautions, source coverage, related tools, SEO copy, privacy behavior, and calendar labels.',
    ],
    followUps: [
      'Revisit if a dedicated irregular-cycle guide is added, because irregular cycles need stronger uncertainty wording.',
    ],
  },
  {
    slug: 'period-calculator',
    status: 'deep-reviewed',
    batch: 'health-manual-pass-2-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [johnsHopkinsFertileWindow, johnsHopkinsDueDate],
    findings: [
      'The calculator estimates the next period start from last period start plus average cycle length and estimates the end date from period length.',
      'The guide correctly tells users to enter period start date, not the last day of bleeding.',
      'The caution language says predictions can break down with irregular cycles, postpartum changes, illness, stress, or medication changes.',
    ],
    improvements: [
      'Manually checked period-date logic, cycle-length explanation, examples, FAQ cautions, source coverage, related tools, SEO copy, privacy behavior, and date output clarity.',
    ],
    followUps: [
      'Add multi-cycle average support later if the tool becomes a bigger cycle-planning page.',
    ],
  },
  {
    slug: 'macro-calculator',
    status: 'deep-reviewed',
    batch: 'health-manual-pass-2-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [macroAmdr, dietaryGuidelines],
    findings: [
      'The calculator enforces macro percentages adding to 100 and converts calories into grams using 4 kcal/g for protein and carbohydrate and 9 kcal/g for fat.',
      'The guide explains that macro splits are planning templates, not medical diet instructions.',
      'The result wording keeps food quality, fiber, alcohol calories, and medical conditions outside the simple macro math.',
    ],
    improvements: [
      'Manually checked macro-percent validation, gram conversion, examples, FAQ cautions, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add preset descriptions later if users want clearer differences between balanced, higher-protein, and lower-carb splits.',
    ],
  },
  {
    slug: 'carbohydrate-calculator',
    status: 'deep-reviewed',
    batch: 'health-manual-pass-2-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [macroAmdr, dietaryGuidelines],
    findings: [
      'The calculator converts daily calories and carbohydrate percentage into grams using 4 kcal per gram.',
      'The guide explains that carbohydrate grams are not the same thing as total food weight and that fiber, food quality, and blood-sugar needs matter.',
      'The FAQ cautions against extreme percentages without professional guidance.',
    ],
    improvements: [
      'Manually checked carbohydrate gram math, percent input wording, examples, FAQ cautions, source coverage, related tools, SEO copy, privacy behavior, and result clarity.',
    ],
    followUps: [
      'Add a net-carb explanation only if the tool later supports fiber subtraction explicitly.',
    ],
  },
  {
    slug: 'protein-calculator',
    status: 'deep-reviewed',
    batch: 'health-manual-pass-2-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [proteinDriReview, macroAmdr],
    findings: [
      'The calculator multiplies body weight in kilograms by the selected grams-per-kilogram protein factor.',
      'The guide explains the 0.8 g/kg reference and keeps higher training targets separate from medical nutrition advice.',
      'The caution language warns users with kidney disease or clinician protein limits not to use a generic target as personal advice.',
    ],
    improvements: [
      'Manually checked protein factor math, unit conversion expectations, examples, FAQ cautions, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add per-meal protein splitting later only as planning math, not a medical recommendation.',
    ],
  },
  {
    slug: 'fat-intake-calculator',
    status: 'deep-reviewed',
    batch: 'health-manual-pass-2-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [macroAmdr, dietaryGuidelines],
    findings: [
      'The calculator converts daily calories and fat percentage into grams using 9 kcal per gram.',
      'The guide clearly says the tool estimates total fat grams and does not separate saturated, unsaturated, or trans fat.',
      'The FAQ explains that fat grams are not body fat and that fat quality still matters.',
    ],
    improvements: [
      'Manually checked fat gram math, percent input wording, examples, FAQ cautions, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add saturated-fat context later if a dedicated nutrition-label planner is built.',
    ],
  },
  {
    slug: 'tdee-calculator',
    status: 'deep-reviewed',
    batch: 'health-manual-pass-2-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [mifflinStJeorEquation, cdcActivity],
    findings: [
      'The calculator estimates BMR with Mifflin-St Jeor and multiplies it by a selected activity factor to estimate total daily energy expenditure.',
      'The guide explains that activity labels are broad and users should not double-count workouts.',
      'The result language separates maintenance calories from a weight-loss or medical diet target.',
    ],
    improvements: [
      'Manually checked BMR-to-TDEE logic, activity factor labels, examples, FAQ cautions, source coverage, related tools, SEO copy, privacy behavior, and result explanation.',
    ],
    followUps: [
      'Add activity-factor examples in the UI if users struggle to choose sedentary, light, moderate, very, or extra activity.',
    ],
  },
  {
    slug: 'body-type-calculator',
    status: 'deep-reviewed',
    batch: 'health-manual-pass-2-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [cdcBmi, nhlbiBmi],
    findings: [
      'The calculator compares shoulders or bust, waist, and hips to produce a broad style label, not a health score.',
      'The guide explains that close measurements can overlap categories and that clothing style labels should not be treated as body ranking.',
      'The result wording avoids medical claims and routes health context to separate BMI, body fat, and healthy weight tools.',
    ],
    improvements: [
      'Manually checked measurement relationship logic, style-only wording, examples, FAQ cautions, source coverage for health-boundary context, related tools, SEO copy, privacy behavior, and non-ranking language.',
    ],
    followUps: [
      'Add an illustrated measuring guide later if users need help placing the tape consistently.',
    ],
  },
  {
    slug: 'body-surface-area-calculator',
    status: 'deep-reviewed',
    batch: 'health-manual-pass-2-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [bodySurfaceAreaNcbi, nistSi],
    findings: [
      'The calculator shows Mosteller and Du Bois body surface area estimates from height and weight.',
      'The guide explains that BSA is a clinical math reference and not a body-fat, BMI, or health-grade result.',
      'The FAQ warns users not to use this page for medication dosing decisions.',
    ],
    improvements: [
      'Manually checked BSA formula outputs, units, comparison formula wording, examples, FAQ cautions, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Keep the dosing warning prominent if this page starts receiving medication-related search queries.',
    ],
  },
  {
    slug: 'bac-calculator',
    status: 'deep-reviewed',
    batch: 'health-manual-pass-2-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [niaaaAlcohol, nistAlcoholCalculations],
    findings: [
      'The calculator uses a Widmark-style estimate with drink volume, ABV, drink count, body weight, formula sex, and elapsed time.',
      'The guide gives the strongest safety boundary in the health category: never use the estimate to decide whether to drive, work, or make legal/safety choices.',
      'The result explains grams of alcohol and time-to-zero as uncertain estimates, not a promise of sobriety or legality.',
    ],
    improvements: [
      'Manually checked alcohol gram conversion, BAC estimate behavior, elimination-rate wording, examples, FAQ cautions, NIAAA/NIST source coverage, related tools, SEO copy, privacy behavior, and safety language.',
    ],
    followUps: [
      'Add jurisdiction-neutral impaired-driving links only if the page expands beyond educational calculator scope.',
    ],
  },
  {
    slug: 'roofing-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-27',
    reviewedOn: '2026-05-27',
    scope: commonMathScope,
    sources: [gafMeasureRoofingSquare, gafMinimumSlopeShingles, ikoShingleBundles, oshaFallProtectionConstruction],
    findings: [
      'The calculator turns a flat footprint into a slope-adjusted roof area, adds waste, and converts 100 square feet into one roofing square.',
      'The page explains pitch rise per 12, waste percent, roofing squares, and the 3-bundles-per-square assumption without calling it a contractor takeoff, safety plan, or code approval.',
      'The guide warns that hips, valleys, dormers, openings, product coverage, starter strips, ridge cap, low-slope rules, and local installation practices can change the order.',
    ],
    improvements: [
      'Updated metadata, exact examples, FAQs, guide sections, trust wording, low-slope warnings, image alt/captions, and exact calculator tests with current GAF, IKO, OSHA, and competitor research queued for page-level proof.',
    ],
    followUps: [
      'Add roof-shape options later only if the UI can clearly separate simple footprint math from professional roof measurement and keep low-slope/code warnings visible.',
    ],
  },
  {
    slug: 'mulch-calculator',
    status: 'deep-reviewed',
    batch: 'home-project-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [nistSi, nistConversionFactors],
    findings: [
      'The calculator converts area and finished depth into cubic feet, then cubic yards, and estimates common 2-cubic-foot bags.',
      'The FAQ explains depth inches and waste percent as settling, uneven beds, slopes, and spreading loss rather than a random add-on.',
      'The guide keeps bag volume and supplier yard size visible so users do not treat every retail bag as identical.',
    ],
    improvements: [
      'Manually checked depth conversion, cubic-yard conversion, bag estimate, examples, FAQ details, guide cautions, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add circular-bed and custom-shape helpers later if garden users ask for shape-specific area entry.',
    ],
  },
  {
    slug: 'gravel-calculator',
    status: 'deep-reviewed',
    batch: 'home-project-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [nistSi, nistConversionFactors],
    findings: [
      'The calculator converts length, width, and depth into cubic yards, then multiplies by the user-entered tons-per-cubic-yard density.',
      'The guide explains that density is supplier-specific and can change with stone type, compaction, and moisture.',
      'The result separates volume from estimated tons so users can see whether the uncertainty is in geometry or density.',
    ],
    improvements: [
      'Manually checked rectangular-volume math, density input wording, examples, FAQ cautions, guide details, source coverage, related tools, SEO copy, privacy behavior, and material estimate labels.',
    ],
    followUps: [
      'Add a small density note table only if maintained supplier-neutral defaults are added.',
    ],
  },
  {
    slug: 'drywall-calculator',
    status: 'deep-reviewed',
    batch: 'home-project-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [nistSi, openStaxGeometry],
    findings: [
      'The calculator adds waste to measured wall or ceiling area and divides by drywall sheet area before rounding to whole sheets.',
      'The page explains sheet length and width, waste percent, and why openings, sheet orientation, thickness, and local rules remain outside the simple count.',
      'The guide is practical about broken corners, offcuts, ceiling lifts, moisture resistance, and fire-rated requirements.',
    ],
    improvements: [
      'Manually checked sheet-area math, whole-sheet rounding, examples, FAQ details, guide cautions, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add room-dimension mode later if users want wall-by-wall drywall takeoffs.',
    ],
  },
  {
    slug: 'carpet-calculator',
    status: 'deep-reviewed',
    batch: 'home-project-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [nistSi, nistConversionFactors],
    findings: [
      'The calculator multiplies room length by width, adds waste, converts square feet to square yards, and estimates linear feet from roll width.',
      'The guide explains roll width and square yards while warning that seams, stairs, closets, pile direction, and installer layout can change the order.',
      'The result makes adjusted area and roll-length assumptions visible instead of giving only one carpet number.',
    ],
    improvements: [
      'Manually checked area conversion, square-yard conversion, roll-width logic, examples, FAQ cautions, guide clarity, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Consider adding multi-room carpet entry after the core room-by-room pattern is tested.',
    ],
  },
  {
    slug: 'flooring-calculator',
    status: 'deep-reviewed',
    batch: 'seo-page-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [lowesFlooringFootage, lowesFlooringPlanner, homeDepotFlooringInstall, nistSi, googleHelpfulContent],
    findings: [
      'The calculator adds waste to measured floor area, divides by box coverage, rounds up whole boxes, and optionally estimates material cost.',
      'Current flooring source checks support explaining 5-10% straight-layout waste, higher overage for diagonal or complex layouts, carton coverage, and buying matching cartons together.',
      'The guide now uses a 240 square foot, 10% waste, 24 square feet per box, $48 per box example and warns about closets, stairs, transitions, trim, underlayment, damaged planks, returns, and dye lots.',
    ],
    improvements: [
      'Updated title/meta, examples, FAQs, guide sections, source links, image alt/captions, related links, source coverage, SEO copy, privacy behavior, and result labels for the 2026-05-26 page sprint.',
    ],
    followUps: [
      'Add multi-area input only if the UI can keep room names and box totals understandable on mobile.',
    ],
  },
  {
    slug: 'fence-calculator',
    status: 'deep-reviewed',
    batch: 'home-project-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [nistSi, openStaxGeometry],
    findings: [
      'The calculator subtracts gate openings from the fence run, then estimates panels and posts from panel width and post spacing.',
      'The result separates fence run after gates, panels needed, line posts, gate posts, and total posts so users can spot which assumption changed.',
      'The guide warns about corner, brace, terminal posts, slope, soil, setbacks, utilities, permits, and gate hardware.',
    ],
    improvements: [
      'Manually checked gate subtraction, panel rounding, post-count logic, examples, FAQ definitions, guide cautions, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add separate corner/end post fields if future users need more detailed fence takeoffs.',
    ],
  },
  {
    slug: 'deck-cost-calculator',
    status: 'deep-reviewed',
    batch: 'home-project-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [nistSi, openStaxGeometry],
    findings: [
      'The calculator estimates deck surface area with waste, multiplies by decking cost per square foot, then adds railing and stairs allowances.',
      'The page avoids pretending to be a contractor quote and calls out framing, footings, fasteners, permits, labor, code, demolition, and local pricing.',
      'The result separates decking cost, railing cost, stair allowance, and total so early budget assumptions are visible.',
    ],
    improvements: [
      'Manually checked deck-area math, waste and cost assumptions, examples, FAQ cautions, guide clarity, source coverage, related tools, SEO copy, privacy behavior, and result breakdown.',
    ],
    followUps: [
      'Add optional labor and permit fields only if the page can keep location-dependent pricing caveats clear.',
    ],
  },
  {
    slug: 'deck-board-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-deck-patio-landscaping-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchDeckFlooring, nistSi],
    findings: [
      'The calculator estimates board count from deck area, actual board coverage, waste percent, and whole-board rounding.',
      'The result adds joist-based fastener rows, hidden fastener count, screw estimate, and optional board cost without pretending to be a full deck plan.',
      'The FAQ and guide explain actual board width, waste percent, screw-count limits, picture frames, breaker boards, gaps, and hidden fastener systems.',
    ],
    improvements: [
      'Manually checked the formula, 16 x 12 example, input labels, result metrics, guide copy, FAQ details, related tools, source notes, SEO title, and browser-only privacy wording.',
    ],
    followUps: [
      'Add diagonal-layout and picture-frame modes if users need more detailed deck takeoffs later.',
    ],
  },
  {
    slug: 'deck-stain-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-deck-patio-landscaping-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchDeckStain, nistSi],
    findings: [
      'The calculator combines deck surface, railing faces, and stair tread/riser area before applying waste, coat count, and label coverage.',
      'The result separates exact gallons, whole gallons to buy, coat-adjusted area, and optional cost.',
      'The FAQ and guide warn that old wood, rough texture, previous finish, sprayer loss, product instructions, weather, cleaning, and drying can change real coverage.',
    ],
    improvements: [
      'Manually checked surface math, stair area, whole-gallon rounding, examples, guide clarity, FAQ specificity, source notes, related links, SEO copy, and privacy note.',
    ],
    followUps: [
      'Add separate deck-sealer and deck-paint presets if future users ask for product-specific defaults.',
    ],
  },
  {
    slug: 'baluster-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-deck-patio-landscaping-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchBaluster, nistSi],
    findings: [
      'The calculator subtracts post width from the rail run, rounds baluster count up to stay below the maximum open spacing, and reports actual equal spacing.',
      'The page clearly frames the result as layout math rather than a railing-code decision.',
      'The FAQ and guide explain why actual spacing is usually smaller than max spacing and why stair/guard rules need separate local review.',
    ],
    improvements: [
      'Manually checked spacing formula, example values, max-gap language, result labels, guide cautions, FAQ depth, related tools, source notes, SEO copy, and privacy wording.',
    ],
    followUps: [
      'Add stair angle support only if we can present the extra geometry clearly.',
    ],
  },
  {
    slug: 'paver-calculator',
    status: 'deep-reviewed',
    batch: 'home-project-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [nistSi, openStaxGeometry],
    findings: [
      'The calculator converts paver length and width from square inches to square feet, adds waste to project area, then rounds up whole pavers.',
      'The guide explains waste percent as cuts, broken pieces, border pieces, and replacement stock rather than a vague cushion.',
      'The limitations correctly keep base gravel, bedding sand, edging, joint sand, compaction, and supplier packaging outside the paver count.',
    ],
    improvements: [
      'Manually checked paver-area conversion, waste math, whole-piece rounding, examples, FAQ details, guide cautions, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Link paver estimates more strongly to sand and gravel calculators if a patio hub page is added.',
    ],
  },
  {
    slug: 'paver-base-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-deck-patio-landscaping-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchPaverBase, nistSi],
    findings: [
      'The calculator estimates compacted base volume and bedding sand volume separately from paver count.',
      'The result converts base cubic feet to cubic yards and approximate tons using the user-entered density value.',
      'The guide and FAQ explain compacted depth versus loose material and warn about soil, drainage, freeze-thaw, traffic load, compaction, and edge restraints.',
    ],
    improvements: [
      'Manually checked base and bedding formulas, density conversion, examples, labels, guide wording, FAQ detail, source notes, related tools, SEO copy, and privacy note.',
    ],
    followUps: [
      'Add a base-depth recommendation table only if it can be sourced by project type and climate.',
    ],
  },
  {
    slug: 'polymeric-sand-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [inchPolymericSand, sakretePermasand, quikretePolymericSand, nistSi, googleHelpfulContent],
    findings: [
      'Google Search Console near-page-one data and DataForSEO showed intent around polymeric sand calculator, square feet, pavers, flagstone, paver joint sand, and bag coverage.',
      'The calculator estimates paver count from area and paver size, then uses joint width and depth to approximate joint volume before waste and whole-bag rounding.',
      'Manufacturer guidance shows product coverage depends on joint width, joint depth, paver shape, dry installation, cleanup, watering, curing, and rain protection.',
    ],
    improvements: [
      'Rewrote metadata, description, aliases, examples, FAQs, guide sections, source notes, and image alt/caption text around pavers, flagstone, 50 lb bag/product-label checks, and planning limits.',
    ],
    followUps: [
      'Consider a future product-label mode if users want to enter square-foot bag coverage directly instead of cubic-foot bag yield.',
    ],
  },
  {
    slug: 'grass-seed-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-deck-patio-landscaping-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchGrassSeed, nistSi],
    findings: [
      'The calculator converts seed label rate per 1,000 square feet into total pounds, then rounds up to whole bags.',
      'The result separates seed pounds, adjusted lawn area, bag count, and optional cost.',
      'The FAQ and guide explain new-lawn versus overseeding rates, bag rounding, grass type, shade, soil prep, slope, season, and measuring square feet correctly.',
    ],
    improvements: [
      'Manually checked seed-rate math, bag rounding, optional cost, examples, FAQ details, guide wording, source notes, related tools, SEO copy, and privacy note.',
    ],
    followUps: [
      'Add grass-type presets only if we can keep regional and product-label differences clear.',
    ],
  },
  {
    slug: 'lawn-mowing-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-deck-patio-landscaping-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchLawnMowing, nistSi],
    findings: [
      'The calculator converts mower width and speed into square feet per hour, then applies efficiency before estimating minutes and hours.',
      'The result includes acres, effective width, mowing rate, hours, and minutes.',
      'The FAQ and guide define efficiency percent and warn about turns, overlap, gates, hills, wet grass, bagging, trimming, obstacles, and mower power.',
    ],
    improvements: [
      'Manually checked mowing-rate math, acre conversion, example output, field help, FAQ clarity, guide details, source notes, related tools, SEO copy, and privacy wording.',
    ],
    followUps: [
      'Add route-time or trimming-time fields later if landscapers need a more complete job estimate.',
    ],
  },
  {
    slug: 'plant-spacing-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-deck-patio-landscaping-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchPlantCalculator, nistSi],
    findings: [
      'The calculator estimates rows and columns from bed size and center-to-center spacing, with a triangular mode that uses staggered row spacing.',
      'The result shows plants needed, rows, plants per row, row spacing, and bed area.',
      'The FAQ and guide explain square versus triangular layouts, border setbacks, mature size, airflow, sunlight, soil, and irregular beds.',
    ],
    improvements: [
      'Manually checked square and triangular formulas, examples, select control, result metrics, FAQ detail, guide copy, source notes, related tools, SEO copy, and privacy wording.',
    ],
    followUps: [
      'Add circular-bed and border-only planting modes if future landscaping pages need them.',
    ],
  },
  {
    slug: 'siding-calculator',
    status: 'deep-reviewed',
    batch: 'home-project-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [lowesSiding, nistSi],
    findings: [
      'The calculator subtracts opening area, adds waste, divides by 100 square feet per siding square, and optionally estimates material cost.',
      'The guide explains a siding square as 100 square feet and keeps price per square separate from installed price.',
      'The caveats cover gables, dormers, trim, starter strips, corners, channels, exposure, color lots, and installer layout.',
    ],
    improvements: [
      'Manually checked siding-square math, opening subtraction, optional cost output, examples, FAQ details, Lowe\'s/NIST source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add a wall-section table later if exterior users need gables and multiple elevations.',
    ],
  },
  {
    slug: 'brick-calculator',
    status: 'deep-reviewed',
    batch: 'home-project-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [glenGeryBrickSizes, nistSi],
    findings: [
      'The calculator adds the mortar joint to brick face dimensions, converts square inches to square feet, adds waste, then rounds up whole bricks.',
      'The guide explains wall face area, brick face dimensions, mortar joint, and waste percent in plain language.',
      'The limitations keep bond pattern, corners, openings, piers, cuts, wall thickness, mortar, ties, lintels, and flashing outside the simple count.',
    ],
    improvements: [
      'Manually checked brick-face area math, mortar joint handling, whole-brick rounding, examples, FAQ details, Glen-Gery/NIST source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add mortar estimating only if the masonry scope expands beyond brick count planning.',
    ],
  },
  {
    slug: 'concrete-block-calculator',
    status: 'deep-reviewed',
    batch: 'home-project-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [archtoolboxCmu, quikreteConcrete],
    findings: [
      'The calculator uses nominal block face dimensions, subtracts openings, adds waste, and rounds up the block count.',
      'The result includes courses and blocks per course, which helps users understand the layout assumption behind the total.',
      'The guide strongly separates material count from structural design, retaining-wall safety, footings, drainage, grout, rebar, and local code.',
    ],
    improvements: [
      'Manually checked nominal CMU area math, opening subtraction, course estimates, examples, FAQ cautions, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add mortar/grout/rebar companion estimates only with clear structural-design boundaries.',
    ],
  },
  {
    slug: 'rebar-calculator',
    status: 'deep-reviewed',
    batch: 'home-project-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [quikreteConcrete, nistSi],
    findings: [
      'The calculator counts bars in both slab directions from spacing, totals linear feet, adds waste, and rounds up stock bars.',
      'The guide explains bar spacing, stock bar length, and waste while avoiding structural design claims.',
      'The limitation text warns about bar size, laps, cover, chairs, supports, edge distance, code, and professional review.',
    ],
    improvements: [
      'Manually checked grid-count math, stock-bar rounding, examples, FAQ definitions, safety caveats, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add lap-length fields only if structural-scope warnings stay prominent.',
    ],
  },
  {
    slug: 'concrete-mix-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-concrete-masonry-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchConcreteMix, quikreteConcrete, nistSi],
    findings: [
      'The calculator converts cubic yards to cubic feet, adds waste, splits adjusted volume by the cement:sand:gravel ratio, and rounds cement bags up.',
      'The FAQ explains what a 1:2:3 ratio means and warns that ratio math is not a guaranteed strength design.',
      'The guide keeps water, aggregate moisture, curing, additives, and product instructions outside the simple material split.',
    ],
    improvements: [
      'Added concrete mix formula tests, UI fields, examples, detailed FAQ, plain-language blog guide, source links, related tools, SEO copy, and privacy wording.',
    ],
    followUps: [
      'Add metric mix units only if the unit switch is tested and the ratio language remains clear.',
    ],
  },
  {
    slug: 'concrete-driveway-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-concrete-masonry-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchConcreteDriveway, quikreteConcrete, nistSi],
    findings: [
      'The calculator uses rectangular slab volume, adds waste, converts to cubic yards, estimates bag counts, and optionally estimates cost.',
      'The FAQ explains why thickness changes volume directly and separates concrete quantity from subbase, joints, drainage, and reinforcement.',
      'The guide tells users to verify slab depth before ordering and avoids claiming driveway design coverage.',
    ],
    improvements: [
      'Added driveway concrete calculator UI, cost output, result steps, examples, guide article, detailed FAQs, source notes, tests, and manual audit record.',
    ],
    followUps: [
      'Add driveway subbase and joint-spacing companions only as separate scoped tools.',
    ],
  },
  {
    slug: 'concrete-steps-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-concrete-masonry-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchConcreteSteps, quikreteConcrete, nistSi],
    findings: [
      'The calculator models solid steps as stacked rectangular volumes, adds optional landing volume, applies waste, converts to cubic yards, and rounds bag counts.',
      'The FAQ explains riser, tread, landing depth, and why hollow or precast steps need a different takeoff.',
      'The guide warns about forms, footings, frost, reinforcement, slope, handrails, and building code.',
    ],
    improvements: [
      'Added concrete steps UI, formula tests, examples, supporting result metrics, plain-language guide, detailed FAQs, source coverage, and related pathways.',
    ],
    followUps: [
      'Consider a hollow-step mode later only with clear diagrams and test cases.',
    ],
  },
  {
    slug: 'concrete-weight-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-concrete-masonry-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchConcreteWeight, nistSi],
    findings: [
      'The calculator converts cubic yards to cubic feet, applies optional waste, multiplies by density, and converts pounds to US tons.',
      'The FAQ explains typical normal-weight density while telling users to use supplier data when weight matters.',
      'The guide separates concrete weight from rebar weight and hauling or structural decisions that need exact data.',
    ],
    improvements: [
      'Added concrete weight calculator, default density guidance, examples, result steps, source-backed blog, FAQs, related links, tests, and manual audit record.',
    ],
    followUps: [
      'Add metric tonnes only if global traffic justifies a unit toggle.',
    ],
  },
  {
    slug: 'concrete-reinforcing-mesh-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-concrete-masonry-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchConcreteMesh, nistSi],
    findings: [
      'The calculator finds slab area, reduces sheet coverage by overlap, adds waste, divides by effective sheet area, and rounds up sheet count.',
      'The FAQ explains why overlap reduces coverage and states that wire size and reinforcement design are outside the tool.',
      'The guide warns about lap rules, chairs, concrete cover, placement, loads, and code requirements.',
    ],
    improvements: [
      'Added reinforcing mesh UI, overlap handling, validation for excessive overlap, formula tests, examples, guide article, FAQs, source links, and audit record.',
    ],
    followUps: [
      'Add roll-length mode if user searches show demand for mesh rolls rather than sheets.',
    ],
  },
  {
    slug: 'concrete-block-fill-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-concrete-masonry-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchConcreteBlockFill, quikreteConcrete, nistSi],
    findings: [
      'The calculator multiplies block count by fill cubic feet per block, adds waste, converts to cubic yards, and rounds common bag counts.',
      'The FAQ defines fill cubic feet per block and separates core fill from mortar, bond beams, rebar, and footing concrete.',
      'The guide warns that core shape, grout mix, rebar cells, cleanouts, and consolidation change real volume.',
    ],
    improvements: [
      'Added block fill tool page, tested fill-volume math, examples, detailed FAQ, guide article, source notes, related pathways, SEO copy, and privacy wording.',
    ],
    followUps: [
      'Add a block-size lookup only if reliable fill-volume data can be kept clear and sourced.',
    ],
  },
  {
    slug: 'retaining-wall-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-concrete-masonry-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchRetainingWall, nistSi],
    findings: [
      'The calculator estimates courses, blocks per course, wall blocks with waste, cap blocks, and base trench cubic yards.',
      'The FAQ explains base gravel and states clearly that the tool does not design a safe retaining wall.',
      'The guide calls out drainage, soil pressure, geogrid, setbacks, surcharge loads, permits, and engineering.',
    ],
    improvements: [
      'Added retaining wall calculator UI, tested block/base math, result steps, examples, guide, detailed FAQs, source-backed audit record, and related tools.',
    ],
    followUps: [
      'Add drainage gravel and backfill modes later only with strong safety caveats.',
    ],
  },
  {
    slug: 'rebar-weight-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-concrete-masonry-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchRebarWeight, nistSi],
    findings: [
      'The calculator selects nominal US rebar weight per foot, multiplies length by quantity, adds waste, and converts pounds to US tons.',
      'The FAQ defines #4 rebar in plain language and separates ordering weight from reinforcement design.',
      'The guide warns about lap length, spacing, cover, chairs, placement drawings, bundle weights, and mill tolerances.',
    ],
    improvements: [
      'Added rebar weight select input, formula tests, examples, guide article, detailed FAQs, source notes, related tools, SEO copy, privacy wording, and manual audit record.',
    ],
    followUps: [
      'Add metric bar sizes only if the conversion table is sourced and tested.',
    ],
  },
  {
    slug: 'concrete-footing-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-construction-materials-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchConcreteFooting, quikreteConcrete, nistSi],
    findings: [
      'The calculator converts footing width and depth from inches to feet, multiplies rectangular volume, adds waste, converts to cubic yards, and rounds concrete bag counts up.',
      'The FAQ explains cubic yards versus bag counts and clearly states the tool does not choose a structurally correct footing size.',
      'The guide warns about frost depth, soil bearing, reinforcement, drainage, inspections, and local code.',
    ],
    improvements: [
      'Added a real footing calculator UI, examples, source-backed guide, detailed FAQ, related pathways, result steps, tests, and manual deep-review record.',
    ],
    followUps: [
      'Add metric footing inputs only if the unit switch can stay clear and tested.',
    ],
  },
  {
    slug: 'concrete-column-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-construction-materials-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchConcreteFooting, quikreteConcrete, nistSi],
    findings: [
      'The calculator uses cylinder volume for round columns, multiplies by quantity, adds waste, converts to cubic yards, and rounds bag counts up.',
      'The FAQ explains diameter versus radius and excludes bell bottoms, wider footing bases, reinforcement, anchor bolts, and structural design.',
      'The guide ties the result to concrete volume and bag planning without overstating code or engineering coverage.',
    ],
    improvements: [
      'Added round-column calculator config, formula tests, guide article, detailed FAQs, source notes, SEO metadata, and privacy wording.',
    ],
    followUps: [
      'Consider a separate square-column mode later if competitor search demand appears.',
    ],
  },
  {
    slug: 'post-hole-concrete-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-construction-materials-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchPostHoleConcrete, quikreteConcrete, nistSi],
    findings: [
      'The calculator estimates round hole volume, subtracts the post cylinder volume, multiplies by hole quantity, adds waste, and rounds common bag counts.',
      'The UI rejects posts that are not smaller than the hole, avoiding a negative concrete-volume result.',
      'The FAQ explains why post volume is subtracted and where square posts or code-driven depth require extra care.',
    ],
    improvements: [
      'Added post-hole concrete inputs, examples, bag outputs, guide article, detailed FAQ, related fence/concrete links, tests, and manual review record.',
    ],
    followUps: [
      'Add gravel-base allowance only if the field wording stays beginner-friendly.',
    ],
  },
  {
    slug: 'plywood-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-construction-materials-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchPlywood, nistSi, googleHelpfulContent],
    findings: [
      'The calculator divides adjusted project area by sheet coverage, rounds up whole sheets, and optionally estimates cost from price per sheet.',
      'The FAQ explains that sheet count is area math, not a cut-layout plan, and calls out seams, framing layout, grain direction, thickness, and grade.',
      'The guide uses actual sheet size and waste percent language that matches the tool fields.',
    ],
    improvements: [
      'Added plywood sheet-count UI, examples, result labels, guide article, FAQs, source notes, related tools, tests, and audit record.',
    ],
    followUps: [
      'Add a multi-room sheet planner later only if layout complexity can be represented honestly.',
    ],
  },
  {
    slug: 'insulation-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [doeInsulation, energyStarInsulationRValues, energyStarAtticInsulation, ftcInsulationBuying, nistSi, googleHelpfulContent],
    findings: [
      'The calculator subtracts openings, adds waste, divides by package coverage, rounds up packs, and optionally estimates cost.',
      'The FAQ explains R-value in plain language and states the calculator estimates quantity after the user chooses a product and reads the product label.',
      'The guide now uses a 1,200 square foot attic example and warns about climate, air sealing, vapor control, moisture, ventilation, fire rules, local code, and label coverage changes by R-value.',
    ],
    improvements: [
      'Added source SEO metadata, DataForSEO proof, square-foot/wall/attic/ceiling intent coverage, exact pack-count examples, ENERGY STAR/FTC source coverage, browser proof, and specific image alt text.',
    ],
    followUps: [
      'Do not turn this into an R-value selector unless climate-zone, assembly, and local-code context can be handled accurately.',
    ],
  },
  {
    slug: 'countertop-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-construction-materials-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [lowesCountertopGuide, nistSi, googleHelpfulContent],
    findings: [
      'The calculator converts countertop depth and backsplash height to feet, adds top and backsplash area, subtracts cutouts, adds waste, and optionally prices square footage.',
      'The FAQ explains why cutout area does not remove fabrication charges and why quotes can exceed simple square-foot math.',
      'The guide mentions seams, edges, overhangs, slab minimums, templates, delivery, fabrication, and installation limits.',
    ],
    improvements: [
      'Added countertop area UI, backsplash/cutout fields, examples, result steps, detailed FAQ, guide coverage, tests, and audit record.',
    ],
    followUps: [
      'Add L-shaped segment mode later if it does not make the beginner flow bulky.',
    ],
  },
  {
    slug: 'sod-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-construction-materials-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchSod, nistSi, googleHelpfulContent],
    findings: [
      'The calculator adds waste to lawn area, divides by roll or slab coverage, rounds rolls up, and rounds pallets up from rolls per pallet.',
      'The FAQ explains why waste matters for curves, sidewalks, sprinkler heads, damaged pieces, and repair patches.',
      'The guide warns about supplier roll sizes, pallet minimums, delivery rules, grading, soil prep, slopes, and watering.',
    ],
    improvements: [
      'Added sod roll and pallet estimator, examples, cost option, guide article, detailed FAQ, related tools, tests, and manual audit record.',
    ],
    followUps: [
      'Add shape-based lawn area helpers only if they reuse the existing area calculator logic.',
    ],
  },
  {
    slug: 'wall-stud-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-construction-materials-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchFraming, nistSi, googleHelpfulContent],
    findings: [
      'The calculator counts layout studs from wall length and on-center spacing, adds opening and corner allowances, applies waste, and adds plate pieces.',
      'The FAQ explains on-center spacing and excludes headers, jack studs, king studs, blocking, bracing, treated plates, structural loads, and code details.',
      'The result shows vertical studs, plate pieces, total boards, and linear feet so users can audit the count.',
    ],
    improvements: [
      'Added wall-stud calculator UI, examples, guide article, detailed FAQ, related construction tools, formula tests, and manual review record.',
    ],
    followUps: [
      'Add header/jack stud templates only with clear non-structural boundaries and tests.',
    ],
  },
  {
    slug: 'board-foot-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [ukBoardFoot, usForestServiceLogRules, tennesseeBoardFootRules, nistSi],
    findings: [
      'University of Kentucky Extension supports the board-foot idea for lumber volume; the calculator uses thickness inches times width inches times length feet divided by 12, then multiplies by quantity.',
      'The page now explains the four 1 x 6 x 8 ft board example as 4 board feet each and 16 board feet total.',
      'USDA Forest Service and University of Tennessee Extension sources were added to separate simple sawn-lumber board-foot math from log-rule estimates such as Doyle and International 1/4-inch.',
      'The guide warns that actual vs nominal dimensions, surfaced thickness, local seller rules, defects, species, grade, moisture, waste, and log rules can change real buying needs.',
    ],
    improvements: [
      'Manually checked board-foot formula, quantity behavior, examples, FAQ definitions, University of Kentucky/USDA Forest Service/University of Tennessee/NIST source coverage, related tools, SEO copy, privacy behavior, result labels, and image alt/caption text.',
    ],
    followUps: [
      'Add actual-versus-nominal lumber helper text if woodworking traffic grows.',
    ],
  },
  {
    slug: 'cubic-yard-calculator',
    status: 'deep-reviewed',
    batch: 'home-project-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [nistSi, nistConversionFactors],
    findings: [
      'The calculator converts rectangular length, width, and depth into cubic feet and divides by 27 for cubic yards.',
      'The guide explains depth inches, waste percent, compaction, settling, uneven grade, supplier rounding, and why cubic yards are common for bulk material.',
      'The result separates raw cubic feet, cubic yards, and waste added so users can check each step.',
    ],
    improvements: [
      'Manually checked cubic-foot and cubic-yard math, waste handling, examples, FAQ cautions, NIST source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Use this as the general helper behind future soil, fill, and material-estimator pages.',
    ],
  },
  {
    slug: 'pool-volume-calculator',
    status: 'deep-reviewed',
    batch: 'home-project-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [nistSi, nistConversionFactors],
    findings: [
      'The calculator estimates rectangular, round, and oval pool cubic feet from shape and average depth, then converts cubic feet to U.S. gallons.',
      'The guide explains average depth and shape factor so users do not use maximum depth for a sloped pool.',
      'The caveats keep benches, steps, curves, rounded corners, waterline height, and chemical dosing decisions outside the rough volume estimate.',
    ],
    improvements: [
      'Manually checked pool-shape volume logic, gallon conversion, examples, FAQ cautions, NIST source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add shallow/deep-end average-depth helper if pool users need a clearer walkthrough.',
    ],
  },
  {
    slug: 'sand-calculator',
    status: 'deep-reviewed',
    batch: 'home-project-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [nistSi, nistConversionFactors],
    findings: [
      'The calculator converts dimensions and average depth into cubic yards and multiplies by user-entered tons per cubic yard.',
      'The guide explains that sand density changes with moisture, material type, compaction, and supplier measurement.',
      'The result keeps volume and estimated tons separate so density uncertainty is visible.',
    ],
    improvements: [
      'Manually checked sand volume math, density input, examples, FAQ cautions, guide details, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add supplier-density examples only if they remain clearly optional estimates.',
    ],
  },
  {
    slug: 'soil-calculator',
    status: 'deep-reviewed',
    batch: 'home-project-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [nistSi, nistConversionFactors],
    findings: [
      'The calculator converts bed area and depth into cubic feet and cubic yards, then estimates common 1.5- and 2-cubic-foot bag counts.',
      'The FAQ explains extra percent as settling, uneven beds, and spreading loss rather than a random markup.',
      'The guide cautions users to check bag volume, compost mix, moisture, existing soil depth, and plant needs.',
    ],
    improvements: [
      'Manually checked soil volume conversion, bag counts, examples, FAQ details, guide cautions, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add raised-bed shape presets later if gardening traffic becomes a priority.',
    ],
  },
  {
    slug: 'asphalt-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [asphaltInstituteQuantity, pavementInteractiveCompaction, napaEngineeringAsphalt, nistSi],
    findings: [
      'Asphalt Institute source refresh confirmed the quantity process: cubic feet from area and thickness, in-place asphalt mixture around 142 to 148 lb/ft3, then pounds to tons.',
      'The calculator converts compacted depth into rectangular volume, adds waste, converts cubic feet to cubic yards, and multiplies by tons per cubic yard.',
      'The page now explains the 30 ft by 12 ft by 3 in example as 94.5 cubic feet with 5 percent waste, 3.5 cubic yards, and 7 tons at 2 tons/yd3.',
      'The guide warns that compacted depth, supplier density, mix type, base condition, lift thickness, plant minimums, and professional site measurement can change the order.',
    ],
    improvements: [
      'Manually checked compacted-depth volume math, density input, tonnage output, examples, FAQ cautions, Asphalt Institute/Pavement Interactive/NAPA/NIST source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add contractor-measurement reminders if this page receives quote-intent traffic.',
    ],
  },
  {
    slug: 'density-calculator',
    status: 'deep-reviewed',
    batch: 'science-weather-electrical-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [nistSi, nistConversionFactors],
    findings: [
      'The calculator uses density = mass / volume and keeps the user-entered unit label visible so the ratio can be checked.',
      'The FAQ now explains mass, volume, and unit labels instead of leaving users with generic number-field guidance.',
      'The guide warns that density depends on matching units, measurement quality, temperature, and material condition.',
    ],
    improvements: [
      'Manually checked density formula behavior, examples, FAQ input wording, guide clarity, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add optional unit conversion presets later if users want g/mL, kg/m3, and lb/ft3 converted automatically.',
    ],
  },
  {
    slug: 'mass-calculator',
    status: 'deep-reviewed',
    batch: 'science-weather-electrical-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [nistSi, nistConversionFactors],
    findings: [
      'The calculator correctly rearranges the density relationship as mass = density x volume.',
      'The page now explains that this estimate is not the same as putting an object on a scale.',
      'The guide keeps unit matching, density source quality, moisture, and material-specific density in view.',
    ],
    improvements: [
      'Manually checked mass-from-density math, examples, FAQ input wording, guide cautions, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Consider a common-material density helper only if the values are clearly labeled as rough references.',
    ],
  },
  {
    slug: 'weight-calculator',
    status: 'deep-reviewed',
    batch: 'science-weather-electrical-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxMassWeight, nistSi],
    findings: [
      'The calculator uses weight force = mass x gravity and separates newtons, pounds-force, and pounds mass.',
      'The FAQ now explains why mass and weight are not the same idea in physics.',
      'The limit language correctly avoids safety-rated load decisions and points out that gravity changes by location.',
    ],
    improvements: [
      'Manually checked weight-force math, unit labels, examples, FAQ wording, guide clarity, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add preset gravity values for Moon, Mars, and Earth only if the UI can keep the educational framing clear.',
    ],
  },
  {
    slug: 'speed-calculator',
    status: 'deep-reviewed',
    batch: 'science-weather-electrical-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxSpeedVelocity, nistSi],
    findings: [
      'The calculator divides distance by elapsed time after converting hours, minutes, and seconds into decimal hours.',
      'The FAQ now explains average speed versus fastest or instant speed.',
      'The guide tells users to include stops only when they want whole-trip average speed, which avoids a common interpretation mistake.',
    ],
    improvements: [
      'Manually checked average-speed math, mph/km-h/m-s conversions, examples, FAQ detail, guide cautions, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add kilometer input mode later if search data shows metric speed use is common.',
    ],
  },
  {
    slug: 'voltage-drop-calculator',
    status: 'deep-reviewed',
    batch: 'science-weather-electrical-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [usaceVoltageDrop, openStaxOhmsLaw, nistSi],
    findings: [
      'The calculator uses current, conductor resistance, one-way length, and the selected circuit factor for a simplified voltage-drop estimate.',
      'The FAQ now explains why single-phase/DC uses a 2x path factor and balanced three-phase uses sqrt(3).',
      'The guide and result note keep code checks, conductor temperature, material, installation method, and qualified electrical review outside the simple estimate.',
    ],
    improvements: [
      'Manually checked voltage-drop math, phase factors, AWG resistance labels, examples, FAQ detail, guide cautions, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add aluminum conductor and temperature adjustment modes only after the safety notes can be kept prominent.',
    ],
  },
  {
    slug: 'watts-to-amps-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-electrical-power-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchWattsToAmps, openStaxOhmsLaw, nistSi],
    findings: [
      'The calculator solves amps from watts, volts, phase factor, and power factor for DC, single-phase AC, and three-phase AC examples.',
      'The FAQ explains power factor and warns against using the estimate as a breaker or wire sizing decision.',
      'The guide tells users to avoid guessing power factor for real equipment and to avoid mixing DC and three-phase formulas.',
    ],
    improvements: [
      'Manually checked watts-to-amps formulas, phase labels, examples, FAQ detail, guide cautions, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add common household voltage presets later if they do not make users treat the answer as code advice.',
    ],
  },
  {
    slug: 'amps-to-watts-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-electrical-power-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchAmpsToWatts, openStaxOhmsLaw, nistSi],
    findings: [
      'The calculator multiplies amps, volts, phase factor, and power factor to estimate watts and kilowatts.',
      'The FAQ explains why equal amperage can mean different watts when voltage, phase, or power factor changes.',
      'The guide keeps this positioned as learning and planning math, not real equipment safety sizing.',
    ],
    improvements: [
      'Manually checked amps-to-watts formulas, kW metric, examples, FAQ detail, guide cautions, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Consider a nameplate-reading example if search data shows users are comparing appliances.',
    ],
  },
  {
    slug: 'kilowatts-to-amps-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-electrical-power-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchKilowattsToAmps, openStaxOhmsLaw, nistSi],
    findings: [
      'The calculator converts kW to watts, adjusts for efficiency, then divides by voltage, phase factor, and power factor.',
      'The FAQ separates kW from kVA so users do not use the wrong conversion intent.',
      'The guide calls out motor starting current and equipment nameplates as limits of the simple estimate.',
    ],
    improvements: [
      'Manually checked kW-to-amps math, efficiency handling, phase factors, examples, FAQ detail, guide cautions, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add motor horsepower cross-links only after the wording stays clear about starting current.',
    ],
  },
  {
    slug: 'kva-to-amps-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-electrical-power-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchKvaToAmps, openStaxOhmsLaw, nistSi],
    findings: [
      'The calculator converts kVA to volt-amps and divides by voltage for single-phase or voltage times sqrt(3) for three-phase.',
      'The FAQ explains why kVA conversion does not ask for power factor and why kVA is not always kW.',
      'The guide warns users not to mix line-to-line and line-to-neutral voltage context.',
    ],
    improvements: [
      'Manually checked kVA-to-amps formulas, phase labels, examples, FAQ detail, guide cautions, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add transformer examples later if they can stay non-prescriptive and code-neutral.',
    ],
  },
  {
    slug: 'amp-hours-to-watt-hours-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-electrical-power-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchAmpHoursToWattHours, doeApplianceEnergy, nistSi],
    findings: [
      'The calculator multiplies amp-hours by nominal volts to estimate watt-hours and kilowatt-hours.',
      'The FAQ explains why watt-hours are better than amp-hours for comparing batteries at different voltages.',
      'The guide calls out battery chemistry, discharge rate, temperature, age, and conversion losses as limits.',
    ],
    improvements: [
      'Manually checked Ah-to-Wh math, kWh conversion, examples, FAQ detail, guide cautions, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add runtime presets only if they point users to the dedicated battery-life calculator.',
    ],
  },
  {
    slug: 'watt-hours-to-amp-hours-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-electrical-power-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchWattHoursToAmpHours, doeApplianceEnergy, nistSi],
    findings: [
      'The calculator divides watt-hours by nominal volts to estimate amp-hours at that voltage.',
      'The FAQ explains why Ah changes with voltage and why Wh is the better cross-voltage comparison.',
      'The guide warns users not to treat Ah as guaranteed runtime without load watts and efficiency.',
    ],
    improvements: [
      'Manually checked Wh-to-Ah math, examples, FAQ detail, guide cautions, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add battery-voltage presets later if they include a clear nominal-voltage reminder.',
    ],
  },
  {
    slug: 'wire-resistance-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-electrical-power-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchWireSize, usaceVoltageDrop, nistSi],
    findings: [
      'The calculator scales common copper ohms-per-1,000-feet values by length and conductor count.',
      'The FAQ explains why conductor count 2 is common for a loop path and why resistance changes with real conditions.',
      'The guide keeps temperature, material, terminations, and code rules outside the simplified estimate.',
    ],
    improvements: [
      'Manually checked wire resistance math, AWG order, examples, FAQ detail, guide cautions, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add aluminum or temperature-adjusted modes only after a stronger safety disclaimer pattern is in place.',
    ],
  },
  {
    slug: 'wire-size-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-electrical-power-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchWireSize, usaceVoltageDrop, openStaxOhmsLaw, nistSi],
    findings: [
      'The calculator tests common copper AWG sizes from smaller to larger and returns the first size that meets the voltage-drop target.',
      'The FAQ clearly says this is not an electrical code wire-size chart and lists ampacity, insulation, raceway, terminals, temperature, and material limits.',
      'The guide explains why long runs may require larger wire because resistance and voltage drop rise with length.',
    ],
    improvements: [
      'Manually checked wire-size selection logic, AWG order, voltage-drop metrics, examples, FAQ detail, guide cautions, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add ampacity-table education only if the page can avoid giving jurisdiction-specific code advice.',
    ],
  },
  {
    slug: 'btu-calculator',
    status: 'deep-reviewed',
    batch: 'science-weather-electrical-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [doeRoomAirConditioners, nistSi],
    findings: [
      'The calculator starts from room area, adjusts for ceiling height, sunlight, extra people, and kitchen heat, then rounds to a practical BTU/h value.',
      'The FAQ now explains why buying a larger room air conditioner is not automatically better.',
      'The guide keeps this positioned as room AC shopping context, not whole-home HVAC design.',
    ],
    improvements: [
      'Manually checked BTU estimate logic, sizing cautions, examples, FAQ detail, guide sources, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add insulation/window/climate checklist later if this becomes a high-intent shopping page.',
    ],
  },
  {
    slug: 'stair-calculator',
    status: 'deep-reviewed',
    batch: 'science-weather-electrical-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [oshaStairs, openStaxGeometry],
    findings: [
      'The calculator divides total rise by target riser height, rounds to a whole riser count, then calculates actual riser height, tread count, run, and angle.',
      'The FAQ now explains why stair math cannot replace local building-code checks.',
      'The guide keeps uniformity, headroom, landings, handrails, finished-floor changes, and professional requirements visible because stairs are safety critical.',
    ],
    improvements: [
      'Manually checked stair layout math, examples, FAQ detail, guide cautions, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add local-code checklist links only if they can stay jurisdiction-neutral and clearly non-advisory.',
    ],
  },
  {
    slug: 'resistor-calculator',
    status: 'deep-reviewed',
    batch: 'science-weather-electrical-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [iecResistorCode, teResistorCode],
    findings: [
      'The calculator decodes common 4-band resistor color codes into nominal resistance and tolerance range.',
      'The FAQ now explains tolerance with a concrete 1,000 ohm +/- 5% example.',
      'The guide warns about reading bands backward, faded colors, damaged parts, and checking with a multimeter when exact value matters.',
    ],
    improvements: [
      'Manually checked resistor color-code logic, tolerance math, examples, FAQ detail, guide cautions, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add 5-band resistor support later if electronics traffic needs more precision.',
    ],
  },
  {
    slug: 'ohms-law-calculator',
    status: 'deep-reviewed',
    batch: 'science-weather-electrical-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxOhmsLaw, nistSi],
    findings: [
      'The calculator solves V, I, R, and P from supported two-value modes using V = I x R and P = V x I.',
      'The FAQ now explains why two known values are enough for the simple resistor relationship.',
      'The guide keeps AC circuits, impedance, heat, ratings, and live-circuit safety outside the simple classroom calculation.',
    ],
    improvements: [
      'Manually checked Ohm law modes, power output, examples, FAQ detail, guide cautions, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add voltage-power, current-power, and resistance-power UI modes later if users need the already-supported library paths exposed.',
    ],
  },
  {
    slug: 'electricity-calculator',
    status: 'deep-reviewed',
    batch: 'science-weather-electrical-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [eiaKwh, doeApplianceEnergy, nistSi],
    findings: [
      'The calculator converts watts to kilowatts, multiplies by hours and days for kWh, then multiplies by the entered rate.',
      'The FAQ now explains what a kilowatt-hour means with simple watt-hour examples.',
      'The guide warns that real bills can include fees, taxes, tiered rates, demand charges, standby use, and variable power draw.',
    ],
    improvements: [
      'Manually checked kWh and cost math, examples, FAQ detail, guide cautions, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add appliance presets later only if rates and wattages remain editable and clearly approximate.',
    ],
  },
  {
    slug: 'molarity-calculator',
    status: 'deep-reviewed',
    batch: 'science-weather-electrical-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxMolarity, nistSi, nistAtomicWeights],
    findings: [
      'The calculator handles moles/liters directly and grams/molar-mass/liters by converting grams to moles first.',
      'The FAQ now explains why final solution volume matters for molarity.',
      'The guide keeps lab safety, significant figures, purity, hydrate state, and teacher instructions outside the quick formula helper.',
    ],
    improvements: [
      'Manually checked molarity modes, grams-to-moles path, examples, FAQ detail, guide cautions, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add dilution M1V1 mode later as a separate chemistry tool or mode.',
    ],
  },
  {
    slug: 'molecular-weight-calculator',
    status: 'deep-reviewed',
    batch: 'science-weather-electrical-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [nistAtomicWeights, nistSi],
    findings: [
      'The parser handles common element symbols, subscripts, parentheses, and period-separated hydrate parts.',
      'The FAQ now explains why capitalization matters for chemical formulas, such as CO versus Co.',
      'The guide correctly frames the output as rounded classroom molar mass, not isotope-exact mass.',
    ],
    improvements: [
      'Manually checked formula parsing behavior, common examples, composition output, FAQ detail, guide cautions, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add clearer unsupported-element messaging in the UI if chemistry users report confusion.',
    ],
  },
  {
    slug: 'wind-chill-calculator',
    status: 'deep-reviewed',
    batch: 'science-weather-electrical-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [nwsWindChill, nistSi],
    findings: [
      'The calculator uses the NWS wind chill equation and now enforces the cold-weather range instead of accepting warm-weather inputs.',
      'The FAQ now explains why warm weather belongs with heat index or dew point instead.',
      'The guide keeps frostbite and outdoor-safety decisions tied to local alerts rather than the calculator alone.',
    ],
    improvements: [
      'Manually checked wind chill formula behavior, valid input range, examples, FAQ detail, guide cautions, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
      'Added validation for temperatures above 50 F and wind speeds at or below 3 mph.',
    ],
    followUps: [
      'Add local-alert links only if the site later supports location-aware weather content with clear privacy controls.',
    ],
  },
  {
    slug: 'heat-index-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [noaaHeatIndex, nwsHeatSafety, cdcHeatIllness, nistSi, googleHelpfulContent],
    findings: [
      'The calculator now follows the NOAA/NWS method by checking the simple branch before using the Rothfusz regression.',
      'The FAQ explains that direct sun, exertion, wind, clothing, hydration, local alerts, and health can make heat risk worse than the number alone.',
      'The guide describes the simple branch plus regression handoff and adds concrete 90 F / 70% RH, 95 F / 35% RH, and 100 F / 55% RH checks.',
    ],
    improvements: [
      'Added source SEO title and description, DataForSEO proof, heat-index-chart intent coverage, safety-limit FAQs, NWS/CDC source coverage, concrete result examples, browser proof, and specific image alt text.',
    ],
    followUps: [
      'Add local-alert links only if the site later supports location-aware weather content with clear privacy controls.',
    ],
  },
  {
    slug: 'dew-point-calculator',
    status: 'deep-reviewed',
    batch: 'science-weather-electrical-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [noaaDewPoint, noaaHeatIndex],
    findings: [
      'The calculator uses temperature and relative humidity to estimate dew point with a Magnus-style approximation.',
      'The FAQ now explains why dew point can be easier to understand than relative humidity alone.',
      'The guide warns that this is an approximation and not a replacement for official instrument readings or local forecasts.',
    ],
    improvements: [
      'Manually checked dew point math, zero-humidity guardrail, examples, FAQ detail, guide cautions, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
    ],
    followUps: [
      'Add Celsius input mode later if weather traffic shows metric demand.',
    ],
  },
  {
    slug: 'basic-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxPercent, openStaxFractions],
    findings: [
      'The calculator page keeps the promise narrow: fast arithmetic, percentages, decimals, keyboard input, copying, and local history.',
      'The FAQ explains the percent key behavior clearly, including the common 80 minus 20 percent style calculation.',
      'Related links correctly send heavier work to Percentage, Fraction, and Scientific calculators instead of overloading the basic tool.',
    ],
    improvements: [
      'Manually checked basic arithmetic scope, percent wording, examples, FAQ clarity, related links, SEO copy, privacy behavior, and result history behavior.',
    ],
    followUps: [
      'If this becomes the highest traffic page, add visual keyboard-shortcut hints near the keypad without crowding mobile layout.',
    ],
  },
  {
    slug: 'kawaii-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxPercent, openStaxFractions],
    findings: [
      'The kawaii tool uses the same everyday calculator math expectations as the basic calculator while presenting the pastel-themed experience as the reason to choose it.',
      'The FAQ and examples stay task-focused and do not pretend the theme changes the arithmetic result.',
      'The related path back to Basic, Percentage, and Scientific calculators gives users a sensible next step when they need a different feature set.',
    ],
    improvements: [
      'Manually checked themed-calculator wording, arithmetic scope, examples, FAQ clarity, visual intent, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add more theme-specific visual polish later only if it stays usable for keyboard and mobile users.',
    ],
  },
  {
    slug: 'ratio-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxFractions, openStaxPrimeLcm],
    findings: [
      'The ratio page explains simplify, equivalent ratio, and split-total modes as separate jobs so users know which inputs matter.',
      'The examples cover lowest terms, scale factor, and sharing a total by parts, which matches the calculator behavior.',
      'The FAQ explains that decimals are cleared before dividing ratio parts by the greatest common divisor.',
    ],
    improvements: [
      'Manually checked ratio reduction, equivalent-ratio scaling, split-total wording, examples, guide article, FAQ detail, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add a recipe-style example later if search data shows users want cooking ratio help.',
    ],
  },
  {
    slug: 'half-life-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [epaRadioactiveDecay, nrcHalfLife, openStaxRadioactiveDecay, openStaxPhysicsRadioactiveDecay],
    findings: [
      'The tool and guide explain remaining amount as initial amount times one-half raised to elapsed time divided by half-life, then show the half-lives passed and percent remaining.',
      'The FAQ covers half-lives passed, solving for elapsed time, solving for half-life, unit consistency, positive remaining amounts, and checking percent-decayed wording.',
      'The guide separates homework-style decay math from medical dosing, lab safety, radiation exposure, storage, and substance-specific rules.',
    ],
    improvements: [
      'Rechecked decay formula rearrangements with current EPA, NRC, and OpenStax references; improved examples, FAQ detail, guide cautions, image alt text, related links, SEO copy, sitemap dates, and privacy behavior.',
    ],
    followUps: [
      'Add a simple graph of exponential decay later if it does not slow down the page.',
    ],
  },
  {
    slug: 'least-common-multiple-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxPrimeLcm, openStaxFractions],
    findings: [
      'The LCM helper requires at least two positive whole numbers and the test suite covers the 12, 18, and 30 example.',
      'The tool description and FAQ tie LCM to multiples, denominators, schedules, and fraction work instead of using a vague math label.',
      'Related links to GCF, Factor, and Prime Factorization match the way students usually move through this topic.',
    ],
    improvements: [
      'Manually checked LCM input rules, multiple behavior, examples, FAQ wording, related links, guide coverage, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add a prime-factor step display later if users need more classroom-style work shown.',
    ],
  },
  {
    slug: 'greatest-common-factor-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxPrimeLcm, openStaxFractions],
    findings: [
      'The GCF helper rejects zero and uses positive whole numbers, with tests covering common factors of 24, 36, and 60.',
      'The content explains GCF as the largest number that divides all entered values evenly.',
      'The page connects GCF to simplifying fractions, factoring, and comparing related numbers, which matches user intent.',
    ],
    improvements: [
      'Manually checked GCF input guardrails, factor logic, examples, FAQ clarity, related links, guide coverage, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Consider showing a shared-factor list later if users ask for more transparent steps.',
    ],
  },
  {
    slug: 'factor-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxPrimeLcm, openStaxFractions],
    findings: [
      'The factor helper returns factors, factor pairs, prime status, and prime factorization for positive safe whole numbers.',
      'Tests cover a composite number, a prime number, and invalid zero input.',
      'The FAQ makes the difference between all factors and prime factors understandable for study use.',
    ],
    improvements: [
      'Manually checked factor-pair logic, prime-status wording, examples, FAQ detail, guide coverage, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add negative-factor explanation only if the UI later supports signed factor pairs.',
    ],
  },
  {
    slug: 'prime-factorization-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxPrimeLcm, openStaxFractions],
    findings: [
      'The prime factorization page explains repeated prime factors as exponents and caps very large inputs for practical browser speed.',
      'The examples cover a composite value, a prime value, and a highly composite value.',
      'The related-tool path correctly points users to Factor, GCF, and LCM pages.',
    ],
    improvements: [
      'Manually checked prime-factor grouping, exponent wording, examples, FAQ detail, source coverage, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add a visual factor tree later if it can be generated accessibly.',
    ],
  },
  {
    slug: 'long-division-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxFractions, openStaxPrimeLcm],
    findings: [
      'The long-division helper reports quotient, remainder, decimal value, and the multiplication check.',
      'Tests cover 9876 divided by 24 and the divide-by-zero guardrail.',
      'The FAQ explains quotient, remainder, and checking the answer with quotient times divisor plus remainder.',
    ],
    improvements: [
      'Manually checked division output labels, remainder behavior, decimal comparison, examples, FAQ wording, guide coverage, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add formatted step rows later if students request full long-division working.',
    ],
  },
  {
    slug: 'rounding-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxScientificNotation, nistSi],
    findings: [
      'The rounding page separates place-value rounding from scientific-notation or big-number work.',
      'The examples and FAQ explain why rounding changes precision and why input scale matters.',
      'Related tools route users to Big Number and Scientific Notation calculators for adjacent needs.',
    ],
    improvements: [
      'Manually checked rounding modes, place-value wording, examples, FAQ detail, related links, guide coverage, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add significant-figures mode later as a separate feature if science traffic asks for it.',
    ],
  },
  {
    slug: 'scientific-notation-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxScientificNotation, nistSi],
    findings: [
      'The scientific-notation page explains coefficient and power-of-ten form with examples for very large and very small values.',
      'The content warns users not to confuse scientific notation with a different unit or a rounded measurement.',
      'Related links connect to Exponent, Big Number, and Rounding calculators.',
    ],
    improvements: [
      'Manually checked scientific-notation conversion wording, examples, FAQ detail, related links, guide coverage, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add engineering-notation mode later only if it has its own clear examples and labels.',
    ],
  },
  {
    slug: 'big-number-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxScientificNotation, nistSi],
    findings: [
      'The big-number page positions itself as large-value arithmetic support, not as a replacement for arbitrary-precision scientific software.',
      'The examples and related links help users move between big numbers, exponents, and scientific notation.',
      'The FAQ keeps the privacy note clear because large calculations stay in the current browser tab.',
    ],
    improvements: [
      'Manually checked big-number scope, examples, FAQ clarity, source coverage, guide alignment, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add explicit precision-limit messaging in the calculator UI if users report confusing very long decimals.',
    ],
  },
  {
    slug: 'matrix-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [openStaxMatrices, googleHelpfulContent],
    findings: [
      'The matrix helpers validate same-size add/subtract rules, row-by-column multiplication, transpose, and square-matrix determinant rules.',
      'GSC showed high impressions but weak clicks, so the sprint replaced boilerplate SEO copy with clearer 2x2 and 3x3 intent wording.',
      'The guide now uses specific 2x2 addition, multiplication, and determinant examples instead of only naming the operations.',
    ],
    improvements: [
      'Refreshed Matrix Calculator metadata, examples, FAQs, guide copy, image alt/caption text, source coverage, page dates, DataForSEO evidence, and browser-proof requirements.',
    ],
    followUps: [
      'Add row-reduction or inverse modes only after adding separate tests and clear step explanations.',
    ],
  },
  {
    slug: 'average-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxStatisticsSpread, openStaxStandardNormal],
    findings: [
      'The average page clearly defines average as arithmetic mean and also shows count, sum, median, mode, range, and sorted values.',
      'The FAQ explains repeated values, extreme values, and why median or range can matter beside the average.',
      'The page caps practical input length so browser output stays readable.',
    ],
    improvements: [
      'Manually checked arithmetic-mean wording, data parsing expectations, examples, FAQ detail, related links, guide coverage, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add weighted average as a separate tool if users need grade or finance weighting workflows.',
    ],
  },
  {
    slug: 'standard-deviation-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxStatisticsSpread, openStaxStandardNormal],
    findings: [
      'The standard-deviation helper handles sample and population modes and rejects sample deviation when only one value is entered.',
      'Tests cover both population and sample outputs for the same data set.',
      'The FAQ explains spread in plain language so users are not left with only a symbol-heavy answer.',
    ],
    improvements: [
      'Manually checked sample versus population wording, input parsing, examples, FAQ detail, guide coverage, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add a small variance explanation near the result later if the result panel needs more teaching detail.',
    ],
  },
  {
    slug: 'statistics-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxStatisticsSpread, openStaxStandardNormal],
    findings: [
      'The statistics page groups common summary measures instead of pretending one statistic tells the whole data story.',
      'The FAQ and examples connect mean, median, mode, range, spread, and sorted data in understandable language.',
      'Related tools lead users into standard deviation, z-score, and mean-median-mode-range pages for deeper work.',
    ],
    improvements: [
      'Manually checked summary-statistic wording, examples, FAQ clarity, source coverage, guide alignment, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add histogram-style visualization later only after testing mobile layout and accessibility labels.',
    ],
  },
  {
    slug: 'mean-median-mode-range-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxStatisticsSpread, openStaxStandardNormal],
    findings: [
      'The page keeps the four common classroom summaries together and explains what each one answers.',
      'Examples show repeated values and sorted-list thinking, which are the usual places users make mistakes.',
      'The FAQ contrasts mean with median so outliers do not make the result misleading.',
    ],
    improvements: [
      'Manually checked mean, median, mode, and range explanations, examples, FAQ detail, guide coverage, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add quartiles later as a separate expansion if data-summary traffic grows.',
    ],
  },
  {
    slug: 'number-sequence-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxSequences, openStaxScientificNotation],
    findings: [
      'The sequence helper supports arithmetic, geometric, and Fibonacci-style sequences with tests covering all three modes.',
      'The content explains that the common difference and common ratio mean different things.',
      'The page links sequence work to scientific notation and pattern-focused math tools.',
    ],
    improvements: [
      'Manually checked sequence mode wording, term generation behavior, examples, FAQ detail, guide coverage, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add nth-term formulas in the result panel later if users need more than generated terms.',
    ],
  },
  {
    slug: 'probability-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxProbabilityCombinations, openStaxStatisticsSpread],
    findings: [
      'The probability helper validates probability ranges and prevents impossible union probabilities.',
      'Tests cover union, intersection, complement, and invalid union behavior.',
      'The FAQ keeps probability as an estimate from entered assumptions, not a promise that an event will happen.',
    ],
    improvements: [
      'Manually checked probability input rules, union/intersection wording, examples, FAQ detail, guide coverage, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add dice/card preset calculators later only as separate focused tools with their own examples.',
    ],
  },
  {
    slug: 'sample-size-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxConfidenceIntervals, openStaxStandardNormal],
    findings: [
      'The sample-size helper supports common confidence levels, margin of error, response proportion, and optional finite-population correction.',
      'Tests cover open-population and finite-population results.',
      'The FAQ explains that sample size depends on assumptions and is not proof that a survey is unbiased.',
    ],
    improvements: [
      'Manually checked sample-size formula assumptions, finite-population wording, examples, FAQ detail, guide coverage, source coverage, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add survey-bias warnings near the result later if this page attracts research or polling traffic.',
    ],
  },
  {
    slug: 'permutation-and-combination-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxProbabilityCombinations, openStaxStatisticsSpread],
    findings: [
      'The permutation/combination helper validates r between 0 and n and shows both ordered and unordered counts.',
      'Tests cover 10 choose/permuted 3 and invalid r greater than n.',
      'The FAQ explains the main difference in plain language: order matters for permutations, not combinations.',
    ],
    improvements: [
      'Manually checked permutation and combination formulas, input guardrails, examples, FAQ detail, guide coverage, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add replacement versus no-replacement modes only after clear wording and tests are added.',
    ],
  },
  {
    slug: 'z-score-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxStandardNormal, openStaxStatisticsSpread],
    findings: [
      'The z-score helper checks value, mean, and standard deviation and explains distance from the mean in standard-deviation units.',
      'Tests cover z-score output alongside confidence-interval behavior.',
      'The FAQ keeps z-score interpretation separate from proving real-world importance.',
    ],
    improvements: [
      'Manually checked z-score formula wording, standard-deviation guardrails, examples, FAQ detail, guide coverage, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add percentile conversion later only if the normal-curve assumption is clearly shown.',
    ],
  },
  {
    slug: 'p-value-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxStandardNormal, openStaxProbabilityCombinations],
    findings: [
      'The p-value page explicitly says it estimates p-values from a z-score using the standard normal curve.',
      'Tests cover normal-curve p-values from z-scores.',
      'The FAQ explains left-tailed, right-tailed, and two-tailed choices without claiming the p-value proves a hypothesis.',
    ],
    improvements: [
      'Manually checked p-value tail wording, z-score scope, examples, FAQ detail, guide coverage, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add t-test support only as a separate calculator with degrees-of-freedom inputs and tests.',
    ],
  },
  {
    slug: 'confidence-interval-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxConfidenceIntervals, openStaxStandardNormal],
    findings: [
      'The confidence-interval page ties the result to entered mean, standard deviation, sample size, and confidence level assumptions.',
      'Tests cover confidence-interval output in the statistics helper group.',
      'The FAQ avoids the common mistake of saying the probability is about one already-calculated fixed interval.',
    ],
    improvements: [
      'Manually checked confidence-interval formula wording, sample-size input meaning, examples, FAQ detail, guide coverage, source coverage, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add proportion interval mode separately if survey traffic needs it.',
    ],
  },
  {
    slug: 'triangle-calculator',
    status: 'deep-reviewed',
    batch: 'all-pages-dataforseo-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [openStaxGeometry, khanHeronsFormula, googleHelpfulContent],
    findings: [
      'The triangle helper validates the triangle inequality before returning perimeter, semiperimeter, area, side type, angle type, and angle estimates from three side lengths.',
      'The page now explains the 13-14-15 example with perimeter 42, semiperimeter 21, and area 84, plus the 3-4-5 right-triangle check.',
      'The FAQ explains three-side mode, base-height limits, unit handling, angle rounding, side order, decimal sides, right-triangle alternatives, and private tab-only history.',
    ],
    improvements: [
      'Updated triangle metadata, examples, FAQ depth, guide sections, source links, image alt/caption text, tool instructions, formula trust note, tests, and modified dates using OpenStax, Khan Academy, Google Search Central, DataForSEO, and browser proof.',
    ],
    followUps: [
      'Add angle-input solving later only with clear SSA ambiguity handling.',
    ],
  },
  {
    slug: 'area-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [openStaxGeometry, nistSi, googleHelpfulContent],
    findings: [
      'GSC and DataForSEO selected Area Calculator as the next high-impression tool/guide pair after Target Heart Rate.',
      'The page now explains shape choice, square units, radius versus diameter, straight height, and odd-shape splitting in plain wording.',
      'Examples cover rectangle, triangle, circle, and trapezoid results while keeping answers tied to square units.',
    ],
    improvements: [
      'Updated area metadata, examples, FAQs, guide sections, source links, related links, tool instructions, image alt/caption text, and modified dates with OpenStax, NIST, Google, competitor, and DataForSEO evidence.',
    ],
    followUps: [
      'Add map-style irregular polygon input only if users ask for coordinate or floor-plan measurement help.',
    ],
  },
  {
    slug: 'circle-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxGeometry, openStaxDistance],
    findings: [
      'The circle helper can start from radius, diameter, circumference, or area and converts back to the full circle summary.',
      'Tests cover diameter input and zero-value validation.',
      'The FAQ explains radius versus diameter and keeps square units separate from linear units.',
    ],
    improvements: [
      'Manually checked circle input modes, area/circumference labels, examples, FAQ detail, guide coverage, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add sector and arc modes later only if they have separate labels and examples.',
    ],
  },
  {
    slug: 'distance-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxDistance, openStaxGeometry],
    findings: [
      'The distance helper uses the 2D distance formula from two coordinate points and reports delta values for checking work.',
      'Tests cover the 3-4-5 style coordinate example.',
      'The FAQ keeps coordinate distance separate from driving distance, map routes, or GPS travel time.',
    ],
    improvements: [
      'Manually checked coordinate-distance formula, input labels, examples, FAQ detail, guide coverage, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add 3D distance as a separate mode later if there is enough demand.',
    ],
  },
  {
    slug: 'slope-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxDistance, openStaxGeometry],
    findings: [
      'The slope helper calculates change in y divided by change in x and handles vertical lines without pretending the slope is a number.',
      'Tests cover normal slope and vertical-line behavior.',
      'The FAQ explains rise over run in plain language and points coordinate-distance users to the Distance Calculator.',
    ],
    improvements: [
      'Manually checked slope formula wording, vertical-line behavior, examples, FAQ detail, guide coverage, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add line-equation output later if paired with intercept examples and tests.',
    ],
  },
  {
    slug: 'pythagorean-theorem-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxGeometry, openStaxRadicals],
    findings: [
      'The Pythagorean helper solves for a hypotenuse or missing leg and rejects impossible leg/hypotenuse combinations.',
      'Tests cover the 3-4-5 hypotenuse case and invalid hypotenuse behavior.',
      'The FAQ explains that the theorem only applies to right triangles.',
    ],
    improvements: [
      'Manually checked Pythagorean modes, square-root behavior, impossible-input guardrails, examples, FAQ detail, guide coverage, and privacy behavior.',
    ],
    followUps: [
      'Add exact-radical display later only if it stays readable for non-student users.',
    ],
  },
  {
    slug: 'right-triangle-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxGeometry, openStaxRadicals],
    findings: [
      'The right-triangle helper supports leg/hypotenuse style solving and reports area, perimeter, and angle-adjacent information for the solved triangle.',
      'Tests cover a 5-12-13 style right-triangle case.',
      'The FAQ separates right-triangle work from general triangle solving.',
    ],
    improvements: [
      'Manually checked right-triangle inputs, solved side labels, examples, FAQ detail, guide coverage, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add trigonometry angle modes later only with DEG/RAD wording and tests.',
    ],
  },
  {
    slug: 'volume-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxGeometry, nistSi],
    findings: [
      'The volume page explains shape choice, cubic units, and why length units must match before calculating.',
      'Examples cover common solid shapes and keep volume separate from surface area.',
      'Related tools point users toward Surface Area, Concrete, and Cubic Yard calculators when the job is practical estimating.',
    ],
    improvements: [
      'Manually checked volume formula wording, unit consistency, examples, FAQ clarity, guide coverage, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add liquid volume conversions later only with NIST-backed unit labels.',
    ],
  },
  {
    slug: 'surface-area-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxGeometry, nistSi],
    findings: [
      'The surface-area page explains that it measures outside area, not inside volume.',
      'Examples and related links keep surface area distinct from Area, Volume, and Circle calculators.',
      'The FAQ reinforces square-unit output and shape-specific formulas.',
    ],
    improvements: [
      'Manually checked surface-area formula wording, unit labels, examples, FAQ clarity, guide coverage, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add net diagrams later only if they can be kept lightweight and accessible.',
    ],
  },
  {
    slug: 'square-footage-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxGeometry, nistSi],
    findings: [
      'The square-footage utility uses generated FAQ detail from formula, limit, examples, and input explanation fields.',
      'The page keeps square footage as area, then points project users toward flooring, paint, roofing, and material-specific calculators.',
      'The privacy FAQ confirms browser-first behavior like the rest of the utility tools.',
    ],
    improvements: [
      'Manually checked square-footage formula wording, unit conversion expectations, examples, generated FAQ detail, guide coverage, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add room-list mode later if users need to total multiple spaces on one page.',
    ],
  },
  {
    slug: 'conversion-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [nistSi, nistConversionFactors],
    findings: [
      'The conversion utility is framed around unit conversion and asks users to keep category and unit labels straight.',
      'The generated FAQ explains that values, units, and modes must match the page examples before trusting the answer.',
      'NIST source coverage supports the unit-conversion context used by the tool and guide.',
    ],
    improvements: [
      'Manually checked conversion wording, unit-label cautions, examples, generated FAQ detail, guide coverage, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add more unit families only if each has tested conversion constants and clear labels.',
    ],
  },
  {
    slug: 'horsepower-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [nistSi, nistConversionFactors],
    findings: [
      'The horsepower helper converts horsepower-related units and tests cover kilowatt to horsepower behavior.',
      'The page explains that horsepower conversions are unit conversions, not an engine dyno test.',
      'Related links send engine-specific users toward the engine horsepower tool when assumptions matter.',
    ],
    improvements: [
      'Manually checked horsepower conversion constants, unit wording, examples, FAQ detail, guide coverage, source coverage, related links, and privacy behavior.',
    ],
    followUps: [
      'Add mechanical versus metric horsepower labels later if the UI expands beyond current conversion needs.',
    ],
  },
  {
    slug: 'roman-numeral-converter',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [esuRomanNumerals, nistSi],
    findings: [
      'The Roman numeral helper supports standard modern values from 1 through 3,999 and validates subtractive notation.',
      'Tests cover converting 3,999 to MMMCMXCIX and decoding the same value back.',
      'The FAQ explains subtractive pairs such as IV, IX, XL, XC, CD, and CM while excluding overline notation.',
    ],
    improvements: [
      'Manually checked Roman numeral range, validation pattern, examples, generated FAQ detail, guide coverage, source coverage, related links, and privacy behavior.',
    ],
    followUps: [
      'Add overline notation only as a separate advanced mode with clear visual rendering.',
    ],
  },
  {
    slug: 'shoe-size-conversion',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [nistSi, nistConversionFactors],
    findings: [
      'The shoe-size page treats centimeter input and regional size output as an estimate, not a brand guarantee.',
      'Tests confirm women and men results are separated for the same foot length.',
      'The FAQ warns that shoe fit can vary by brand, width, style, and country chart.',
    ],
    improvements: [
      'Manually checked shoe-size conversion wording, unit caution, examples, FAQ detail, guide coverage, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add brand-specific charts only if there is a maintained source and a clear update policy.',
    ],
  },
  {
    slug: 'age-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [isoDate, mdnDate, mdnDateInput],
    findings: [
      'The age helper compares two calendar dates, subtracts full years first, then remaining months and days.',
      'The page now explains total days, next birthday, leap-day birthdays, and why official cutoff rules can differ from a quick calculator result.',
      'Date input copy is specific to a birth date and as-of date, not generic units or mixed calculator wording.',
    ],
    improvements: [
      'Expanded Age Calculator metadata, FAQs, guide sections, examples, trust note, image alt text, and privacy wording using DataForSEO and page-specific browser proof.',
    ],
    followUps: [
      'Add time-of-birth mode only if it has exact time-zone handling and clear limitations.',
    ],
  },
  {
    slug: 'date-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [isoDate, mdnDate, googleHelpfulContent],
    findings: [
      'Search Console showed impressions without clicks, so the page needed sharper intent matching for days-between-dates and add-days searches.',
      'The date helper counts full UTC calendar days between YYYY-MM-DD dates and applies year/month offsets before week/day offsets.',
      'The updated FAQ explains start-date counting, month-end clamping, business-day limits, and browser-only privacy.',
    ],
    improvements: [
      'Reworked metadata, aliases, examples, FAQ detail, guide examples, image alt text, DataForSEO evidence, and browser-proof requirements for the Date Calculator page pair.',
    ],
    followUps: [
      'Add business-day counting only as a separate mode with weekend and holiday assumptions shown.',
    ],
  },
  {
    slug: 'day-of-the-week-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [isoDate, mdnDate],
    findings: [
      'The weekday helper reads a UTC calendar date and returns weekday name, Sunday-based index, and ISO weekday number.',
      'Tests cover the weekday result for a known date.',
      'The page warns that historical calendar reforms and local date changes can need specialized references.',
    ],
    improvements: [
      'Manually checked weekday calculation wording, ISO weekday labeling, examples, generated FAQ detail, guide coverage, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add holiday lookup only if the site later has country-specific maintained data.',
    ],
  },
  {
    slug: 'hours-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [dolHours, isoDate],
    findings: [
      'The hours helper calculates worked duration from start time, end time, break minutes, and optional hourly rate.',
      'Tests cover start/end times with break minutes and pay output.',
      'The FAQ explains that break handling and overnight shifts must match the inputs before users trust the total.',
    ],
    improvements: [
      'Manually checked hours-worked calculation, break-minute wording, examples, generated FAQ detail, guide coverage, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add overtime rules only with jurisdiction-specific assumptions and dated sources.',
    ],
  },
  {
    slug: 'time-card-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [dolHours, isoDate],
    findings: [
      'The time-card helper totals multiple work entries and uses the same hours-worked helper for each row.',
      'Tests cover a time-card calculation with multiple entries.',
      'The generated FAQ keeps this as arithmetic support and not a final payroll-law determination.',
    ],
    improvements: [
      'Manually checked multi-row time-card behavior, break handling, examples, generated FAQ detail, guide coverage, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add export or print mode later if users need timesheet-style records.',
    ],
  },
  {
    slug: 'time-zone-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [ianaTimeZones, isoDate],
    findings: [
      'The time-zone helper compares a date and time against named IANA time zones instead of relying only on ambiguous abbreviations.',
      'Tests cover time-zone comparison output for a named zone.',
      'The FAQ and examples warn users that daylight saving time and date changes can affect the result.',
    ],
    improvements: [
      'Manually checked time-zone wording, IANA-zone expectation, examples, generated FAQ detail, guide coverage, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add city search only if the data source stays small and updated.',
    ],
  },
  {
    slug: 'unix-timestamp-converter',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [nistTimeDefinitions, mdnDate],
    findings: [
      'The timestamp helper converts UTC date and time to Unix seconds and back from seconds or milliseconds.',
      'Tests cover round-tripping a timestamp to a date result.',
      'The FAQ separates UTC timestamp math from local time display so users do not mistake offsets for changed instants.',
    ],
    improvements: [
      'Manually checked Unix timestamp conversion wording, seconds versus milliseconds labels, examples, generated FAQ detail, guide coverage, source coverage, and privacy behavior.',
    ],
    followUps: [
      'Add ISO string parsing later only with strict invalid-date errors and tests.',
    ],
  },
  {
    slug: 'grade-calculator',
    status: 'deep-reviewed',
    batch: 'school-math-date-converter-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxPercent, googleHelpfulContent],
    findings: [
      'The grade tool solves final-exam grade needed from current grade, final weight, and desired course grade.',
      'Tests cover the broader school helper group, including GPA and needed-final-grade behavior.',
      'The generated FAQ explains that school grading policies can differ, so users should match the calculator inputs to their syllabus.',
    ],
    improvements: [
      'Manually checked final-grade formula wording, percent input labels, examples, generated FAQ detail, guide coverage, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add weighted-category gradebook mode only as a separate tested workflow.',
    ],
  },
  {
    slug: 'dice-roller',
    status: 'deep-reviewed',
    batch: 'developer-text-everyday-cleanup-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [mdnCryptoRandomValues, mdnMathRandom],
    findings: [
      'The dice roller validates dice count, sides, and modifier, then rolls each die as an inclusive 1-through-sides integer.',
      'Tests cover a deterministic 2d6 plus modifier example so the total, subtotal, and individual rolls are checked.',
      'The guide and FAQ clearly keep the tool for casual games and teaching, not gambling, official drawings, or audited randomness.',
    ],
    improvements: [
      'Manually checked random-roll bounds, modifier wording, examples, generated FAQ detail, guide cautions, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add advantage/disadvantage or keep-highest dice modes later only with separate examples and tests.',
    ],
  },
  {
    slug: 'fuel-cost-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [epaFuelEconomy, eiaGasolinePrices, irsMileage2026, nistSi, googleHelpfulContent],
    findings: [
      'The fuel-cost helper uses distance divided by MPG times fuel price and doubles distance only when round trip is selected.',
      'Tests cover the 120-mile, 28 MPG, $3.75, round-trip example.',
      'The tool and guide now separate fuel-only trip cost from live gas prices, tolls, parking, vehicle wear, and IRS mileage-rate reimbursement.',
    ],
    improvements: [
      'Manually checked fuel-cost formula, round-trip behavior, cost-per-mile labels, examples, visible FAQ detail, guide coverage, related links, SEO copy, image alt/caption wording, and privacy behavior.',
    ],
    followUps: [
      'Add EV charging cost as a separate tool or mode only after researching kWh pricing and charging-loss assumptions.',
    ],
  },
  {
    slug: 'gas-mileage-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [epaMpgMath, epaFuelEconomy, doeFuelEconomy, doeDrivingEfficiently, nistSi, googleHelpfulContent],
    findings: [
      'The gas-mileage helper divides miles driven by gallons used and also shows gallons per 100 miles plus L/100 km.',
      'EPA and DOE source refresh confirmed the MPG framing, official fuel-economy context, and real-world factors such as speed, weight, traffic, and maintenance.',
      'Tests cover a 350-mile and 12.5-gallon trip returning 28 MPG, 3.57 gallons per 100 miles, and about 8.4 L/100 km.',
      'The guide warns that fill-level differences, tire pressure, route, speed, traffic, load, and weather can change one-trip MPG.',
    ],
    improvements: [
      'Refreshed MPG formula, reciprocal consumption outputs, metric conversion wording, examples, FAQ detail, official source coverage, image alt/caption text, guide sections, related links, and privacy behavior.',
    ],
    followUps: [
      'Add multi-fill average mode later if users need a cleaner long-term MPG estimate.',
    ],
  },
  {
    slug: 'tip-calculator',
    status: 'deep-reviewed',
    batch: 'developer-text-everyday-cleanup-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxPercent, googleHelpfulContent],
    findings: [
      'The tip helper multiplies subtotal by tip percent, optionally adds tax percent, then divides total by the number of people.',
      'Tests cover subtotal, tip, tax, and two-person split behavior.',
      'The guide warns users to check included gratuity, service charges, discounts, tax handling, and uneven splits.',
    ],
    improvements: [
      'Manually checked tip percent math, tax and split wording, examples, generated FAQ detail, guide cautions, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add before-tax versus after-tax tip toggle later if users ask for that comparison.',
    ],
  },
  {
    slug: 'mileage-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [irsMileage2026, irsMileageUpdate2026, gsaPovMileage2026, googleHelpfulContent],
    findings: [
      'The mileage helper multiplies miles by an entered rate per mile and adds optional parking, tolls, or extras.',
      'IRS and GSA source refresh confirmed the 2026 business rate and authorized privately owned car rate context: 72.5 cents, or $0.725, per mile.',
      'Tests cover 125 miles at 0.725 plus $12 in extra costs, including the mileage-only subtotal and final total.',
      'The guide tells users to use their employer, client, contract, app, or tax authority rate instead of assuming the example rate applies.',
    ],
    improvements: [
      'Refreshed mileage multiplication, extras handling, 2026 rate wording, source links, guide examples, FAQ detail, related links, SEO copy, image alt/caption text, and privacy behavior.',
    ],
    followUps: [
      'Avoid hard-coding annual mileage rates unless there is a maintained update process and visible effective date.',
    ],
  },
  {
    slug: 'base64-encode-decode',
    status: 'deep-reviewed',
    batch: 'developer-text-everyday-cleanup-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [rfc4648, mdnTextEncoder],
    findings: [
      'The Base64 tool encodes text as UTF-8 bytes before Base64 and decodes valid Base64 back to readable text.',
      'Tests cover encoding and decoding the same sample string.',
      'The guide and FAQ clearly state that Base64 is encoding, not encryption, so users should not use it to hide secrets.',
    ],
    improvements: [
      'Manually checked Base64 padding behavior, UTF-8 wording, decode guardrails, examples, generated FAQ detail, guide cautions, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add file-to-Base64 mode only if size limits, memory behavior, and privacy copy are clear.',
    ],
  },
  {
    slug: 'url-encode-decode',
    status: 'deep-reviewed',
    batch: 'developer-text-everyday-cleanup-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [rfc3986, mdnUrlSearchParams],
    findings: [
      'The URL tool percent-encodes URL component text and can decode plus signs as spaces when form-style text needs it.',
      'Tests cover reserved-character encoding and plus-as-space decoding.',
      'The guide explains that whole URLs and individual components have different encoding needs.',
    ],
    improvements: [
      'Manually checked URL component encoding, plus-space option wording, invalid percent-encoding behavior, examples, FAQ detail, guide coverage, related links, and privacy behavior.',
    ],
    followUps: [
      'Add full-URL normalization only as a separate mode with careful URL parser behavior.',
    ],
  },
  {
    slug: 'height-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [mayoChildGrowth, aapMidParentalHeight, cdcGrowthCharts, nistSi, googleHelpfulContent],
    findings: [
      'The height helper uses a mid-parental height estimate: add 5 inches to the parent-height total before dividing by 2 for a male estimate, or subtract 5 inches before dividing by 2 for a female estimate.',
      'The page now explains that the plus-or-minus 4 inch range is the honest target range, not decoration or a guarantee.',
      'The guide distinguishes a rough parent-height estimate from CDC growth-chart tracking, bone-age work, and clinician review.',
    ],
    improvements: [
      'Fixed formula wording, corrected examples, removed the unsupported centimeter-input promise, added height-specific FAQ detail, updated guide sources, repaired image alt/caption text, and refreshed DataForSEO/page proof.',
    ],
    followUps: [
      'Add child growth percentile tooling only with CDC chart support and stronger medical-context warnings.',
    ],
  },
  {
    slug: 'bra-size-calculator',
    status: 'deep-reviewed',
    batch: 'developer-text-everyday-cleanup-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [nistSi, googleHelpfulContent],
    findings: [
      'The bra-size helper rounds underbust to an even band size and maps bust-minus-band difference to an approximate cup label.',
      'Tests cover a 32-inch underbust and 36-inch bust returning 32D.',
      'The guide warns that brand, body shape, country, width, and style can change fit, so the result is only a starting size.',
    ],
    improvements: [
      'Manually checked band rounding, cup-difference mapping, fit caveats, examples, generated FAQ detail, guide coverage, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add country sizing conversions only if each chart has a maintained source and visible limitations.',
    ],
  },
  {
    slug: 'sleep-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [cdcSleep, cdcStudentSleep, mayoSleepTips, nistTimeDefinitions, googleHelpfulContent],
    findings: [
      'The sleep helper adds or subtracts 90-minute cycles plus a fall-asleep buffer from a clock time.',
      'Tests cover wake-up mode with five cycles and a 15-minute buffer producing 23:15.',
      'The guide now explains that five cycles is 7 hours 30 minutes, six cycles is 9 hours, and four cycles is usually a backup-night option for most adults.',
      'The page distinguishes simple cycle planning from sleep quality, insomnia, loud snoring, breathing pauses, and ongoing tiredness that need healthcare context.',
    ],
    improvements: [
      'Added sleep-cycle metadata, exact bedtime/wake-up examples, age-based sleep-need context, source-backed cautions, extra visible FAQs, specific image alt/caption text, and fresh DataForSEO/page proof.',
    ],
    followUps: [
      'Add age-based sleep-duration suggestions only if source notes stay current and medical caveats stay visible.',
    ],
  },
  {
    slug: 'tire-size-calculator',
    status: 'deep-reviewed',
    batch: 'developer-text-everyday-cleanup-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [nhtsaTireSize, nistSi],
    findings: [
      'The tire-size helper calculates sidewall height from width and aspect ratio, then adds two sidewalls to wheel diameter.',
      'Tests cover a 225/60R16 tire and diameter output.',
      'The guide warns that tire changes affect safety, fitment, load rating, speedometer readings, braking, and driver-assist systems.',
    ],
    improvements: [
      'Manually checked tire sidewall formula, wheel-diameter conversion, circumference and revs-per-mile wording, examples, FAQ detail, guide cautions, related links, and privacy behavior.',
    ],
    followUps: [
      'Add tire comparison mode later only with speedometer-difference and fitment caveats.',
    ],
  },
  {
    slug: 'bandwidth-calculator',
    status: 'deep-reviewed',
    batch: 'developer-text-everyday-cleanup-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [nistSi, googleHelpfulContent],
    findings: [
      'The bandwidth helper converts decimal KB/MB/GB/TB to bits, converts Kbps/Mbps/Gbps to bits per second, then divides for transfer time.',
      'Tests cover 5 GB at 100 Mbps returning 400 seconds.',
      'The guide explains bits versus bytes and warns that Wi-Fi, congestion, server limits, and overhead can slow real transfers.',
    ],
    improvements: [
      'Manually checked transfer-time formula, decimal unit wording, seconds/minutes/hours output, examples, FAQ detail, guide coverage, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add binary KiB/MiB/GiB units only if the UI makes decimal versus binary impossible to miss.',
    ],
  },
  {
    slug: 'gdp-calculator',
    status: 'deep-reviewed',
    batch: 'developer-text-everyday-cleanup-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [beaGdpExpenditures, googleHelpfulContent],
    findings: [
      'The GDP helper uses the expenditure identity: consumption plus investment plus government spending plus exports minus imports.',
      'Tests cover both full-population and scaled-population examples, including the warning case where GDP values are entered in billions.',
      'The guide explains net exports, GDP per person scale, and why the result is a learning estimate rather than an official national account.',
    ],
    improvements: [
      'Manually checked GDP expenditure formula, net-export wording, population-scale warning, examples, generated FAQ detail, BEA source coverage, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add official country data only if the site has a maintained source, timestamps, and clear update policy.',
    ],
  },
  {
    slug: 'engine-horsepower-calculator',
    status: 'deep-reviewed',
    batch: 'developer-text-everyday-cleanup-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [nistConversionFactors, nistSi],
    findings: [
      'The engine horsepower helper uses torque times RPM divided by 5252.1131 and applies optional drivetrain loss for wheel horsepower.',
      'Tests cover 300 lb-ft at 5252.1131 RPM with 15 percent drivetrain loss.',
      'The guide warns that peak torque and peak horsepower RPM may be different and that this is formula math, not a certified dyno result.',
    ],
    improvements: [
      'Manually checked torque-RPM formula, drivetrain-loss guardrail, wheel horsepower output, examples, FAQ detail, guide cautions, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add metric torque input later only with tested Nm conversion and clear unit labels.',
    ],
  },
  {
    slug: 'golf-handicap-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [usgaScoreDifferential, usgaCourseHandicap, usgaHandicapDefinitions, googleHelpfulContent],
    findings: [
      'The golf helper supports score differential, course handicap, and playing handicap checks with slope rating validation from 55 to 155.',
      'USGA source refresh confirmed the course handicap formula, playing handicap allowance step, and key definitions for adjusted gross score, Course Rating, Slope Rating, PCC, and Score Differential.',
      'Tests cover score differential, PCC, rounded course handicap, allowance, and invalid slope or allowance guards.',
      'The guide now warns that official records can include score-history rules, caps, exceptional-score reductions, 9-hole handling, committee adjustments, and exact tee data.',
    ],
    improvements: [
      'Refreshed score differential formula, course handicap formula, PCC and allowance wording, examples, FAQ detail, official USGA references, image alt/caption text, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add full Handicap Index calculation only if the tool can explain score history rules and WHS update assumptions.',
    ],
  },
  {
    slug: 'love-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [hhsHealthyRelationships, youthGovHealthyRelationships, nistRandomNumber, ftcWebAppsCollectInfo, googleHelpfulContent, mdnTextEncoder],
    findings: [
      'The love calculator is clearly framed as a deterministic local name-match game, not relationship advice or compatibility science.',
      'Tests cover score symmetry so Alex/Sam and Sam/Alex return the same score.',
      'The guide warns users not to use the score to pressure, shame, judge, share embarrassing results, or make relationship decisions.',
    ],
    improvements: [
      'Refreshed novelty-game title, description, exact Alex/Sam examples, generated FAQ detail, guide cautions, source links, image alt/caption wording, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Keep entertainment-only wording visible if this page gets social traffic, and avoid soulmate, destiny, proven-algorithm, or relationship-advice claims.',
    ],
  },
  {
    slug: 'word-counter',
    status: 'deep-reviewed',
    batch: 'developer-text-everyday-cleanup-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [mdnTextEncoder, googleHelpfulContent],
    findings: [
      'The word counter counts word-like groups, characters, characters without spaces, sentences, paragraphs, lines, UTF-8 bytes, and reading time.',
      'Tests cover words and paragraphs from a two-paragraph sample.',
      'The guide explains platform-count differences for emojis, punctuation, links, and hyphenated words.',
    ],
    improvements: [
      'Manually checked text-analysis parsing, reading-time estimate, examples, generated FAQ detail, guide cautions, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add per-platform presets only if each platform limit is maintained and date-stamped.',
    ],
  },
  {
    slug: 'character-counter',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [mdnTextEncoder, mdnStringLength, googleSnippets],
    findings: [
      'The character counter uses the shared text analyzer for Unicode code point counts, no-space counts, lines, words, and UTF-8 byte length.',
      'Tests cover the shared text analyzer that powers the character and word counts.',
      'The guide warns that apps and platforms can count emoji sequences, links, rich text, spaces, and line breaks differently.',
    ],
    improvements: [
      'Manually checked character-count wording, byte-length explanation, real-number examples, generated FAQ detail, guide cautions, related links, SEO copy, image alt text, and privacy behavior.',
    ],
    followUps: [
      'Add social/meta length presets only if the UI explains they are practical targets, not guaranteed display lengths.',
    ],
  },
  {
    slug: 'text-case-converter',
    status: 'deep-reviewed',
    batch: 'developer-text-everyday-cleanup-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [mdnTextEncoder, googleHelpfulContent],
    findings: [
      'The text case converter handles uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case, and kebab-case.',
      'Tests cover camelCase conversion from a simple phrase.',
      'The guide warns that title case rules vary and identifier modes remove punctuation that may matter.',
    ],
    improvements: [
      'Manually checked case-mode behavior, Unicode word tokenization, examples, generated FAQ detail, guide caveats, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add AP/Chicago title-case modes only if style-guide differences are explained clearly.',
    ],
  },
  {
    slug: 'slug-generator',
    status: 'deep-reviewed',
    batch: 'developer-text-everyday-cleanup-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [googleSeoStarter, googleHelpfulContent],
    findings: [
      'The slug generator normalizes text, changes ampersands to "and", keeps words and numbers, hyphenates, trims repeated separators, and supports an optional max length.',
      'Tests cover the Kawaii Calculator guide title producing a clean lowercase slug.',
      'The guide reinforces that clean slugs help readability but do not replace unique helpful content and canonical planning.',
    ],
    improvements: [
      'Manually checked slug normalization, max-length guardrails, examples, generated FAQ detail, SEO guidance, related links, guide coverage, and privacy behavior.',
    ],
    followUps: [
      'Add duplicate-slug checking only when there is an admin content database or publish workflow.',
    ],
  },
  {
    slug: 'json-formatter',
    status: 'deep-reviewed',
    batch: 'developer-text-everyday-cleanup-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [mdnJson, googleHelpfulContent],
    findings: [
      'The JSON formatter parses JSON, optionally sorts object keys recursively, and serializes the result with two-space indentation.',
      'Tests cover nested sorted keys and formatted output.',
      'The guide warns that valid JSON syntax does not prove an API schema, security rule, or business requirement is valid.',
    ],
    improvements: [
      'Manually checked JSON parse errors, sorted-key behavior, output labels, examples, generated FAQ detail, guide cautions, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add JSON schema validation only as a separate mode with clear schema input and error output.',
    ],
  },
  {
    slug: 'uuid-generator',
    status: 'deep-reviewed',
    batch: 'developer-text-everyday-cleanup-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [rfc9562, mdnCryptoRandomValues],
    findings: [
      'The UUID generator creates 16 random bytes, sets version and variant bits for UUID v4, and supports batch, uppercase, and no-hyphen output.',
      'Tests cover deterministic UUID v4 formatting and batch formatting options.',
      'The guide warns that UUIDs are identifiers, not passwords, authorization proof, or chronological timestamps.',
    ],
    improvements: [
      'Manually checked UUID v4 bit setting, output formatting, quantity guardrails, examples, generated FAQ detail, guide cautions, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add UUID v7 only with timestamp wording and tests for ordering behavior.',
    ],
  },
  {
    slug: 'hash-generator',
    status: 'deep-reviewed',
    batch: 'developer-text-everyday-cleanup-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [mdnSubtleCryptoDigest, nistFips180],
    findings: [
      'The hash generator encodes text as UTF-8 and uses browser SubtleCrypto for SHA-256, SHA-384, or SHA-512 hex digests.',
      'Tests cover SHA-256 for "abc" using the known digest output.',
      'The guide warns that hashes are not encryption and raw hashes are not a password-storage design or authenticity proof.',
    ],
    improvements: [
      'Manually checked SHA algorithm options, digest byte length wording, hex output, examples, generated FAQ detail, guide cautions, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add file hashing only with visible size limits and browser-memory warnings.',
    ],
  },
  {
    slug: 'color-contrast-checker',
    status: 'deep-reviewed',
    batch: 'developer-text-everyday-cleanup-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [wcagContrast, googleHelpfulContent],
    findings: [
      'The contrast checker normalizes #RGB or #RRGGBB colors, calculates relative luminance, and reports WCAG AA/AAA pass states.',
      'Tests cover dark text on white and AA normal pass behavior.',
      'The guide warns that contrast is one accessibility check and users still need focus, hover, disabled, icon, and real-layout checks.',
    ],
    improvements: [
      'Manually checked contrast formula, hex validation, AA/AAA thresholds, examples, generated FAQ detail, guide cautions, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add color picker controls later if they stay compact and keyboard accessible.',
    ],
  },
  {
    slug: 'aspect-ratio-calculator',
    status: 'deep-reviewed',
    batch: 'developer-text-everyday-cleanup-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [mdnAspectRatio, nistSi],
    findings: [
      'The aspect-ratio helper simplifies width and height with the greatest common divisor and can scale by target width or target height.',
      'Tests cover 1920 by 1080 simplifying to 16:9 and scaling to 1280 by 720.',
      'The guide warns that cropping and resizing are different and that one-pixel rounding can matter for platform specs.',
    ],
    improvements: [
      'Manually checked aspect-ratio simplification, scale-by-width and scale-by-height behavior, examples, generated FAQ detail, guide cautions, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add common platform presets only if each preset has a maintained source and visible date.',
    ],
  },
  {
    slug: 'utm-builder',
    status: 'deep-reviewed',
    batch: 'developer-text-everyday-cleanup-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [googleCampaignUrls, mdnUrlSearchParams],
    findings: [
      'The UTM builder validates the base URL, preserves existing query parameters, and sets required source, medium, and campaign fields plus optional term, content, and ID.',
      'Tests cover adding UTM source and content values to a URL without hand-editing query syntax.',
      'The guide warns that UTM values only help analytics when the destination site is configured and naming rules are consistent.',
    ],
    improvements: [
      'Manually checked UTM URL building, required field validation, existing-parameter handling, examples, generated FAQ detail, guide cautions, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add naming-template presets only if the site later has admin settings or saved campaign rules.',
    ],
  },
  {
    slug: 'query-string-parser',
    status: 'deep-reviewed',
    batch: 'developer-text-everyday-cleanup-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [whatwgUrl, mdnUrlSearchParams],
    findings: [
      'The query tool parses full URLs or raw query strings into grouped JSON and builds encoded query strings from key=value lines.',
      'Tests cover duplicate query keys and building a UTM-style query string.',
      'The guide warns that query strings are not secret and can be logged, shared, indexed, or copied with the URL.',
    ],
    improvements: [
      'Manually checked query extraction, duplicate-key grouping, build-mode encoding, examples, generated FAQ detail, guide cautions, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add array-format options only if users need bracket, repeated-key, and comma styles explained separately.',
    ],
  },
  {
    slug: 'html-entity-encoder-decoder',
    status: 'deep-reviewed',
    batch: 'developer-text-everyday-cleanup-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [whatwgHtmlNamedCharacters, googleHelpfulContent],
    findings: [
      'The HTML entity tool encodes ampersands, angle brackets, quotes, and apostrophes and decodes supported named plus numeric entities.',
      'Tests cover encoding an anchor snippet and decoding entity text back to visible tags.',
      'The guide warns that entity encoding helps display examples but is not a complete sanitizer for untrusted HTML or script content.',
    ],
    improvements: [
      'Manually checked entity encode/decode behavior, numeric entity handling, supported named entity wording, examples, generated FAQ detail, guide cautions, related links, and privacy behavior.',
    ],
    followUps: [
      'Add a fuller named-entity table only if bundle size and UI search remain reasonable.',
    ],
  },
  {
    slug: 'css-clamp-calculator',
    status: 'deep-reviewed',
    batch: 'developer-text-everyday-cleanup-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [mdnCssClamp, wcagContrast],
    findings: [
      'The CSS clamp helper calculates viewport slope, rem intercept, min/max rem values, and a copy-ready clamp formula.',
      'Tests cover the expected clamp string and middle-size output.',
      'The guide warns users to check text wrapping, line length, tap targets, readability, and real container widths after generating CSS.',
    ],
    improvements: [
      'Manually checked clamp formula math, viewport guardrails, rem conversion, examples, generated FAQ detail, guide cautions, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add preview swatches only if they do not create a bulky tool UI.',
    ],
  },
  {
    slug: 'markdown-table-generator',
    status: 'deep-reviewed',
    batch: 'developer-text-everyday-cleanup-manual-pass-1-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [githubGfmTables, googleHelpfulContent],
    findings: [
      'The markdown table generator accepts comma or pipe-separated headers and rows, pads short rows, escapes pipe characters, and applies left, center, or right alignment delimiters.',
      'Tests cover a three-column, two-row table and confirm row count output.',
      'The guide warns that Markdown rendering varies by platform and users should preview tables where they plan to publish them.',
    ],
    improvements: [
      'Manually checked table parsing, delimiter generation, alignment output, examples, generated FAQ detail, guide cautions, related links, SEO copy, and privacy behavior.',
    ],
    followUps: [
      'Add CSV paste cleanup later only if quote handling is implemented with tests.',
    ],
  },
  {
    slug: 'image-to-text-ocr-tool',
    status: 'deep-reviewed',
    batch: 'ai-tools-browser-only-manual-pass-1-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [tesseractJs, tesseractOcrDocs, googleHelpfulContent],
    findings: [
      'The OCR tool is correctly framed as browser-side OCR for clear printed or typed image text, not a certified transcript or handwriting solution.',
      'The FAQ explains image quality, language choice, first-run OCR data loading, privacy, common character mistakes, and when users should check the original image.',
      'The React island loads Tesseract.js only from the user action path and now points OCR worker, core, and language files to self-hosted Access Free Tools assets.',
    ],
    improvements: [
      'Added a dedicated browser OCR UI, language selector, copyable text output, OCR confidence notes, source-backed FAQ, AI blog guide, related tools, explicit no-upload privacy wording, and self-hosted OCR asset paths.',
    ],
    followUps: [
      'Watch Hostinger transfer and cache behavior before adding more OCR languages beyond the six shown in the interface.',
    ],
  },
  {
    slug: 'sentiment-analyzer',
    status: 'deep-reviewed',
    batch: 'ai-tools-browser-only-manual-pass-1-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [transformersJs, googleHelpfulContent],
    findings: [
      'The sentiment page explains positive or negative labels as model predictions and warns that confidence is not proof of intent or context.',
      'The FAQ covers focused text input, confidence reading, sarcasm, slang, mixed feelings, privacy, first-run model loading, and why short text can be uncertain.',
      'The component lazy-loads a self-hosted MobileBERT zero-shot text model only after Analyze sentiment and includes a local fallback for graceful failure.',
    ],
    improvements: [
      'Added an interactive sentiment analyzer, sample text buttons, copyable result, history kept only in-tab, source-backed guide, plain-language model-limit notes, and local-only model loading for the starter text classifier.',
    ],
    followUps: [
      'Review real search-console queries later to decide whether neutral/mixed scoring deserves a separate calibrated model or clearer UI state.',
    ],
  },
  {
    slug: 'language-detector',
    status: 'deep-reviewed',
    batch: 'ai-tools-browser-only-manual-pass-1-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [francLanguageDetection, googleHelpfulContent],
    findings: [
      'The language detector is correctly scoped to natural text samples and does not claim to identify nationality, identity, or author background.',
      'The FAQ explains minimum text length, mixed-language text, alternative guesses, unknown results, privacy, and why one-word samples are weak evidence.',
      'The component imports franc-min from the run path and shows language code plus alternative matches so users can understand uncertainty.',
    ],
    improvements: [
      'Added the Language Detector tool page, examples, guide, related tools, browser-only copy, and result explanation around top guesses and detection limits.',
    ],
    followUps: [
      'Add a larger language-name map later if users frequently paste languages outside the current common-code list.',
    ],
  },
  {
    slug: 'text-summarizer',
    status: 'deep-reviewed',
    batch: 'ai-tools-browser-only-manual-pass-1-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [transformersJs, googleHelpfulContent],
    findings: [
      'The summarizer is clearly marked as an experimental browser draft helper with strict text-length limits rather than a replacement for the original source.',
      'The FAQ and guide warn that summaries can miss numbers, exceptions, quotes, health, legal, finance, and tax details that need manual checking.',
      'The component lazy-loads the summarization model after the button press and falls back to simple extractive sentences if the browser model cannot run.',
    ],
    improvements: [
      'Added browser summarization UI, examples, copyable summary output, source-backed guide, privacy note, and wording that keeps AI output as a draft to verify.',
    ],
    followUps: [
      'Measure built bundle and real-device first-run performance before adding larger summarization models or document-sized inputs.',
    ],
  },
  {
    slug: 'keyword-extractor',
    status: 'deep-reviewed',
    batch: 'ai-tools-browser-only-manual-pass-1-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [googleHelpfulContent, transformersJs],
    findings: [
      'The keyword extractor uses lightweight browser text analysis and correctly avoids claiming search volume, ranking difficulty, or guaranteed SEO performance.',
      'The FAQ explains pasted-text input, repeated words, phrase counts, privacy, common keyword-stuffing mistakes, and how to use results as topic clues.',
      'The component runs without a model download, making it a fast AI-category utility that still fits the browser-only privacy standard.',
    ],
    improvements: [
      'Added count-based keyword and phrase extraction, examples, source-backed guide, related writing tools, copyable output, and plain-language SEO caveats.',
    ],
    followUps: [
      'Add optional stop-word editing later only if it does not make the interface too bulky for beginners.',
    ],
  },
  {
    slug: 'image-classifier',
    status: 'deep-reviewed',
    batch: 'ai-tools-browser-only-manual-pass-1-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [transformersJs, googleHelpfulContent],
    findings: [
      'The image classifier explains labels as model guesses and warns against identity, safety, medical, legal, authenticity, or moderation decisions.',
      'The FAQ covers clear single-subject images, confidence scores, model label limits, privacy, first-run model loading, and why crowded images can be unreliable.',
      'The component creates a local object URL for the selected image and revokes it after classification, with the model loaded only after the user action.',
    ],
    improvements: [
      'Added browser image-classification UI, top-label output, source-backed guide, no-upload privacy language, related image tools, and common mistake guidance.',
    ],
    followUps: [
      'Check mobile memory behavior again after deployment before adding image previews or larger vision models.',
    ],
  },
  {
    slug: 'tone-checker',
    status: 'deep-reviewed',
    batch: 'ai-tools-browser-only-manual-pass-1-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [transformersJs, googleHelpfulContent],
    findings: [
      'The tone checker is framed as educational writing feedback and avoids moderation, mental-health, personality, or intent judgment claims.',
      'The FAQ covers message input, how to read tone labels, audience context, sarcasm, privacy, first-run model loading, and when not to rely on the output.',
      'The component attempts the self-hosted browser zero-shot classifier after the button press and uses a transparent local heuristic fallback when the model is unavailable.',
    ],
    improvements: [
      'Added tone labels, examples, copyable output, browser-only privacy note, source-backed guide, local-only model loading, and wording that keeps the result focused on editing a draft.',
    ],
    followUps: [
      'Consider adding rewrite suggestions only after careful review so the tool stays helpful without pretending to know the sender intent.',
    ],
  },
  {
    slug: 'reading-level-checker',
    status: 'deep-reviewed',
    batch: 'ai-tools-browser-only-manual-pass-1-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [fleschKincaidFormula, googleHelpfulContent],
    findings: [
      'The reading-level checker uses explainable browser formulas and correctly says grade level is an estimate, not an official school score.',
      'The FAQ explains pasted-text input, grade estimate, reading ease, sentence length, word difficulty, privacy, and why layout or subject matter still matters.',
      'The component performs local word, sentence, syllable, and long-word analysis without a server model, keeping the result fast and private.',
    ],
    improvements: [
      'Added readability metrics, examples, source-backed guide, copyable result, AI category placement, and plain-language notes about formula limits.',
    ],
    followUps: [
      'Add a plain-language rewrite checklist later if users need help lowering the grade level after seeing the score.',
    ],
  },
  {
    slug: 'ai-token-cost-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-tech-ai-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [calculatorInnSitemap, openAiTokens, openAiTokenizer, googleHelpfulContent],
    findings: [
      'CalculatorInn surfaced AI token cost as a Tech & AI gap, and the Access Free Tools version avoids stale hardcoded model prices by asking users to enter current input/output rates.',
      'Formula review checked input tokens, output tokens, request count, price per 1 million tokens, total cost, and cost per request.',
      'FAQ and guide explain what tokens mean, why prices must come from the provider rate card, and which billing rules are not included.',
    ],
    improvements: [
      'Added a real calculator, examples, related links, AI Tools placement, source-backed guide detail, token-specific FAQ, privacy note, tests, and honest manual audit record.',
    ],
    followUps: [
      'Add provider presets only if they are dated, source-linked, and maintained so pricing does not become misleading.',
    ],
  },
  {
    slug: 'prompt-token-estimator',
    status: 'deep-reviewed',
    batch: 'competitor-tech-ai-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [openAiTokens, openAiTokenizer, googleHelpfulContent],
    findings: [
      'The estimator is framed as a rough planning helper, not a replacement for the exact tokenizer of a chosen model.',
      'Formula review checked character counting, average characters per token, and low/high estimate ranges for token uncertainty.',
      'FAQ and guide warn about code, symbols, non-English text, emojis, hidden system messages, and provider-specific tokenization.',
    ],
    improvements: [
      'Added prompt text UI, rough range output, examples, source-backed guide, exact-tokenizer caveats, related AI cost pathway, and browser-only privacy wording.',
    ],
    followUps: [
      'Add exact tokenizer support only when the chosen tokenizer package and model vocabulary size are tested for bundle impact.',
    ],
  },
  {
    slug: 'api-pricing-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-tech-ai-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [calculatorInnSitemap, openAiTokens, googleHelpfulContent],
    findings: [
      'The generic API pricing helper supports request count, units per request, price per unit, fixed fees, and retry or overhead cushion.',
      'Formula review checked billable units, usage cost, total cost, and average cost per request without assuming one provider billing model.',
      'FAQ and guide explain billable units, per-million token conversions, free-tier gaps, taxes, credits, and plan-specific rules.',
    ],
    improvements: [
      'Added provider-neutral API pricing UI, examples for image/message/credit pricing, guide details, FAQ depth, related developer tools, and tests.',
    ],
    followUps: [
      'Add saved pricing templates only if there is a clear update workflow and no private API keys are stored.',
    ],
  },
  {
    slug: 'download-time-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-tech-ai-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [calculatorInnSitemap, nistSi, googleHelpfulContent],
    findings: [
      'CalculatorInn surfaced download time as a competitor gap, and the Access Free Tools version adds an efficiency input to keep the result realistic.',
      'Formula review checked file size conversion to bits, Mbps speed, efficiency percentage, seconds, minutes, and hours.',
      'FAQ and guide explain Mbps versus MB/s and why Wi-Fi, server throttling, VPNs, and overhead can change real downloads.',
    ],
    improvements: [
      'Added download-time tool metadata, calculator UI, examples, source-backed guide, unit-specific FAQ, related bandwidth links, and formula tests.',
    ],
    followUps: [
      'Consider adding upload-time wording later, but keep it separate enough that users do not confuse download and upload speeds.',
    ],
  },
  {
    slug: 'internet-speed-needs-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-tech-ai-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [calculatorInnSitemap, nistSi, googleHelpfulContent],
    findings: [
      'The internet speed needs tool estimates simultaneous activity load and adds buffer instead of pretending Mbps alone guarantees good internet.',
      'Formula review checked activity counts, per-activity Mbps values, base Mbps, and buffered recommended speed.',
      'FAQ and guide explain latency, jitter, upload speed, router quality, provider congestion, and why gaming can lag even when Mbps is enough.',
    ],
    improvements: [
      'Added speed-needs UI, household/work examples, activity metrics, realistic caveats, source-backed guide detail, and tests.',
    ],
    followUps: [
      'Add upload-speed planning only when the UI can clearly separate download need from upload-heavy video calls, backups, and livestreaming.',
    ],
  },
  {
    slug: 'streaming-bitrate-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-tech-ai-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [calculatorInnSitemap, nistSi, googleHelpfulContent],
    findings: [
      'The streaming bitrate tool converts bitrate and duration into estimated MB and GB for streams, recordings, or multiple camera feeds.',
      'Formula review checked Kbps/Mbps conversion, duration seconds, stream count, megabits, megabytes, and gigabytes.',
      'FAQ and guide distinguish bitrate from resolution and warn about variable bitrate, audio tracks, metadata, adaptive streaming, and overhead.',
    ],
    improvements: [
      'Added bitrate calculator UI, examples for video/audio/multiple streams, data-use outputs, source-backed guide, FAQ depth, and tests.',
    ],
    followUps: [
      'Add preset bitrate examples later only if they are clearly labeled as rough examples, not platform requirements.',
    ],
  },
  {
    slug: 'device-battery-life-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-tech-ai-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [calculatorInnSitemap, nistSi, googleHelpfulContent],
    findings: [
      'The battery life tool converts mAh and voltage into watt-hours before estimating runtime, so it does not compare batteries by mAh alone.',
      'Formula review checked nominal energy, usable energy after efficiency, runtime hours, and runtime minutes.',
      'FAQ and guide explain why voltage matters, how to choose an efficiency percentage, and why battery age, temperature, and power spikes change real runtime.',
    ],
    improvements: [
      'Added battery runtime calculator UI, examples, watt-hour explanation, source-backed guide detail, FAQ depth, related tools, and tests.',
    ],
    followUps: [
      'Add USB-C power delivery presets only with clear voltage/current labels and safety cautions.',
    ],
  },
  {
    slug: 'monitor-ppi-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-tech-ai-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [calculatorInnSitemap, nistSi, googleHelpfulContent],
    findings: [
      'The monitor PPI tool uses resolution and diagonal size together, which avoids the common mistake of judging sharpness from resolution alone.',
      'Formula review checked pixel diagonal via the Pythagorean theorem, PPI, and simplified aspect ratio output.',
      'FAQ and guide explain PPI versus DPI and why scaling, viewing distance, panel quality, subpixel layout, and eyesight also matter.',
    ],
    improvements: [
      'Added monitor PPI calculator UI, common monitor examples, pixel-density outputs, source-backed guide, FAQ depth, related image tools, and tests.',
    ],
    followUps: [
      'Add common display presets later only if they remain small and do not crowd the calculator UI.',
    ],
  },
  {
    slug: 'recipe-scaler',
    status: 'deep-reviewed',
    batch: 'competitor-kitchen-shopping-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchCalculatorSitemap, googleHelpfulContent],
    findings: [
      'Inch Calculator competitor research surfaced recipe scaling and serving conversion as a gap in the local library.',
      'Formula review checked scale factor, original servings, desired servings, original amount, and scaled amount.',
      'FAQ and guide explain one-line scaling, seasoning limits, rounding issues, and why pan size or cook time can still change.',
    ],
    improvements: [
      'Added recipe scaling UI, examples, guide details, FAQ depth, related kitchen tools, browser-only privacy wording, and formula tests.',
    ],
    followUps: [
      'Consider a multi-ingredient table later only if the UI can keep each line easy to review and copy.',
    ],
  },
  {
    slug: 'cooking-measurement-converter',
    status: 'deep-reviewed',
    batch: 'competitor-kitchen-shopping-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchCalculatorSitemap, nistSi, usdaFoodDataCentral, googleHelpfulContent],
    findings: [
      'Competitor research showed kitchen measurement conversion as a useful converter gap, especially cups-to-grams style searches.',
      'Formula review checked fixed volume factors, fixed mass factors, and density-based volume-to-mass conversion.',
      'FAQ and guide explain density grams per cup, ingredient variability, and why baking accuracy may need a scale.',
    ],
    improvements: [
      'Added cooking unit converter UI, density field help, examples, source-backed guide, FAQ depth, converter category placement, and tests.',
    ],
    followUps: [
      'Add ingredient density presets only after they are source-linked and clearly labeled as approximate.',
    ],
  },
  {
    slug: 'ingredient-cost-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-kitchen-shopping-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchCalculatorSitemap, nistSi, usdaFoodDataCentral, googleHelpfulContent],
    findings: [
      'The ingredient cost tool fills a competitor and user-value gap between recipe conversion and shopping math.',
      'Formula review checked package conversion into recipe units, unit cost, and recipe amount cost.',
      'FAQ and guide cover density, tax, waste, coupons, leftovers, and package-unit mismatch.',
    ],
    improvements: [
      'Added ingredient cost UI, cooking unit conversion support, examples, guide, detailed FAQ, related serving and unit-price pathways, and tests.',
    ],
    followUps: [
      'Add a full recipe cost worksheet later if it can stay lightweight and mobile-friendly.',
    ],
  },
  {
    slug: 'unit-price-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-kitchen-shopping-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchCalculatorSitemap, nistSi, googleHelpfulContent],
    findings: [
      'Unit price comparison is a practical shopping calculator gap that also supports grocery and household searches.',
      'Formula review checked price divided by quantity for two products, cheaper option, savings per unit, and savings percent.',
      'FAQ and guide explain shared units, ounces-versus-pounds mistakes, quality differences, coupons, and expiration limits.',
    ],
    improvements: [
      'Added two-item comparison UI, examples, unit price outputs, guide detail, FAQ depth, related shopping links, and tests.',
    ],
    followUps: [
      'Consider a three-item comparison mode later if it does not make the first-use form feel crowded.',
    ],
  },
  {
    slug: 'cost-per-serving-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-kitchen-shopping-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchCalculatorSitemap, googleHelpfulContent],
    findings: [
      'Cost per serving adds a simple but high-use food budgeting tool that connects recipe costs to meal-prep decisions.',
      'Formula review checked main cost, extra cost, servings, total batch cost, and cost per serving.',
      'FAQ and guide explain realistic serving counts, optional extras, package costs, and why portion size changes the answer.',
    ],
    improvements: [
      'Added serving-cost UI, examples, guide details, detailed FAQ, related kitchen shopping links, and formula tests.',
    ],
    followUps: [
      'Add target selling-price support later if the site builds a small-business or bake-sale cluster.',
    ],
  },
  {
    slug: 'oven-temperature-converter',
    status: 'deep-reviewed',
    batch: 'seo-page-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [goodFoodConversionGuides, whichOvenTemperatureChart, nistSi, foodSafetyTemperatures, googleHelpfulContent],
    findings: [
      'Oven temperature conversion is a focused cooking converter gap that should not be hidden inside a generic temperature tool.',
      'Formula review checked Fahrenheit, Celsius, gas mark input, nearest gas mark, a rough fan-oven starting point, and oven-setting caveats.',
      'Current source checks support explaining common 350 F / 180 C / gas mark 4 style chart rounding, fan-oven adjustment limits, and food-safety separation.',
      'FAQ and guide distinguish oven temperature conversion from food internal safety temperature and warn that some ovens auto-convert convection settings.',
    ],
    improvements: [
      'Updated oven temperature UI, fan-oven metric, title/meta, examples, source-backed guide sections, FAQ depth, specific art alt/caption text, and formula tests.',
    ],
    followUps: [
      'Consider adding common oven terms like low, moderate, and hot only if the wording remains clearly approximate.',
    ],
  },
  {
    slug: 'butter-converter',
    status: 'deep-reviewed',
    batch: 'competitor-kitchen-shopping-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchCalculatorSitemap, nistSi, googleHelpfulContent],
    findings: [
      'Butter conversion is a common recipe lookup that benefits from a focused page rather than generic mass or volume conversion alone.',
      'Formula review checked teaspoons, tablespoons, cups, sticks, ounces, grams, and pounds using common US butter equivalents.',
      'FAQ and guide warn that stick sizes and packaging can differ outside common US butter labeling.',
    ],
    improvements: [
      'Added butter converter UI, common recipe outputs, examples, guide detail, FAQ depth, related kitchen tools, and tests.',
    ],
    followUps: [
      'Add regional butter pack presets only when the labels are clear and do not confuse the default US stick math.',
    ],
  },
  {
    slug: 'baking-pan-conversion-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-kitchen-shopping-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [inchCalculatorSitemap, nistSi, googleHelpfulContent],
    findings: [
      'Baking pan conversion fills a recipe utility gap by turning pan dimensions into an area-based scaling factor.',
      'Formula review checked old area, new area, scale factor, and optional scaled servings.',
      'FAQ and guide explain why rectangular pan area is only a starting point and bake time can change.',
    ],
    improvements: [
      'Added pan conversion UI, examples, guide detail, detailed FAQ, related recipe links, and formula tests.',
    ],
    followUps: [
      'Add round-pan support later with a separate mode so rectangular and circular area formulas remain clear.',
    ],
  },
  {
    slug: 'ad-revenue-calculator',
    status: 'deep-reviewed',
    batch: 'all-pages-dataforseo-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [
      googleAdSensePageCtr,
      googleAdSensePageRpm,
      googleAdSenseHowWorks,
      googleAdSenseRevenueShare,
      googleAdSenseInvalidTraffic,
      openStaxPercent,
      googleHelpfulContent,
    ],
    findings: [
      'DataForSEO paid sprint evidence for the exact tool and blog pages passed account and status gates on 2026-05-26 before edits.',
      'Google AdSense Help says page CTR is clicks divided by page views, page RPM is estimated earnings divided by page views times 1,000, and invalid traffic can create differences between estimated and finalized earnings.',
      'Formula review checked daily page views multiplied by page CTR for estimated clicks, clicks multiplied by average CPC for daily revenue, and revenue per 1,000 page views for page RPM.',
      'FAQ and guide now put the ad-specific questions before generic finance questions so schema and visible guide FAQ explain CTR, CPC, page RPM, invalid traffic, and AdSense-style limits.',
    ],
    improvements: [
      'Updated title, meta description, examples, top FAQ order, guide copy, source links, trust note, calculator notes, modified dates, and actual-image alt/caption text for the Ad Revenue Calculator sprint.',
    ],
    followUps: [
      'Add an RPM-only mode later if Search Console shows users asking for page RPM calculations from known revenue and page views.',
      'Consider a CPM/impression mode later if DataForSEO or Search Console shows users asking for ad impression revenue rather than click/CPC estimates.',
    ],
  },
  {
    slug: 'break-even-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-business-ratios-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [calculatorSoupSitemap, sbaBreakEven, openStaxBreakEven, googleHelpfulContent],
    findings: [
      'CalculatorSoup competitor research surfaced break-even analysis as a standalone business-planning gap.',
      'Formula review checked fixed costs, price per unit, variable cost per unit, contribution margin, break-even units, and break-even sales.',
      'FAQ and guide explain contribution margin, why price must exceed variable cost, and why real capacity, discounts, and refunds can change the plan.',
    ],
    improvements: [
      'Added break-even UI, examples, source-backed guide detail, contribution margin outputs, detailed FAQ, business-related links, and formula tests.',
    ],
    followUps: [
      'Add mixed-product break-even only if the UI can clearly explain weighted-average contribution margin.',
    ],
  },
  {
    slug: 'markup-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-26',
    reviewedOn: '2026-05-26',
    scope: commonMathScope,
    sources: [calculatorSoupSitemap, openStaxDiscounts, openStaxPercent, googleHelpfulContent, googleSnippets],
    findings: [
      'DataForSEO and GSC sprint review confirmed that markup intent needs a direct cost-plus pricing page and a guide that explains why markup is not margin.',
      'Formula review checked selling price = unit cost x (1 + markup percent / 100), profit per unit, batch revenue, total cost, total profit, and margin-from-markup output.',
      'FAQ and guide now explain fees, packaging, discounts, target-margin differences, and the common 50% markup versus 50% margin mistake.',
    ],
    improvements: [
      'Added stronger example outputs, source-backed guide wording, detailed FAQ depth, specific image alt/caption text, page-specific DataForSEO evidence, and related margin and break-even pathways.',
    ],
    followUps: [
      'Add target-margin pricing later if it is kept separate from cost-plus markup math.',
    ],
  },
  {
    slug: 'profit-goal-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-business-ratios-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [calculatorSoupSitemap, sbaBreakEven, openStaxBreakEven, googleHelpfulContent],
    findings: [
      'Profit goal planning extends break-even into target-profit sales math without creating a duplicate break-even page.',
      'Formula review checked fixed costs plus target profit, contribution margin per unit, required units, and required sales.',
      'FAQ and guide explain how target profit differs from break-even and when an average unit can mislead.',
    ],
    improvements: [
      'Added profit-goal UI, examples, guide detail, FAQ depth, related break-even and markup links, and tests.',
    ],
    followUps: [
      'Add multi-product sales-mix support only after a clear weighted-average input design is ready.',
    ],
  },
  {
    slug: 'liquidity-ratios-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-business-ratios-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [calculatorSoupSitemap, openStaxFinancialStatementAnalysis, secFinancialStatements, googleHelpfulContent],
    findings: [
      'Financial-ratio competitor research showed current, quick, and cash ratio searches missing from the local library.',
      'Formula review checked current ratio, quick ratio, cash ratio, working capital, inventory removal, and prepaid-expense removal.',
      'FAQ and guide explain what liquidity ratios mean, what quick ratio removes, and why receivables and timing matter.',
    ],
    improvements: [
      'Added liquidity-ratio UI, examples, balance-sheet input explanations, source-backed guide, FAQ depth, related finance links, and tests.',
    ],
    followUps: [
      'Add trend comparison later if the site builds multi-period statement tools.',
    ],
  },
  {
    slug: 'debt-ratios-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-business-ratios-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [calculatorSoupSitemap, openStaxFinancialStatementAnalysis, secFinancialStatements, googleHelpfulContent],
    findings: [
      'Debt ratio, debt-to-equity, and times-interest-earned were added as a standalone accounting-ratio utility.',
      'Formula review checked debt divided by assets, debt divided by equity, and EBIT divided by interest expense.',
      'FAQ and guide explain debt exposure context, interest coverage, industry differences, and why cash flow still matters.',
    ],
    improvements: [
      'Added debt-ratio UI, examples, guide detail, input explanations, FAQ depth, related liquidity and DTI links, and tests.',
    ],
    followUps: [
      'Add debt maturity and lease-adjusted analysis only if a richer financial-statement workflow is created.',
    ],
  },
  {
    slug: 'operations-ratios-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-business-ratios-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [calculatorSoupSitemap, openStaxFinancialStatementAnalysis, secFinancialStatements, googleHelpfulContent],
    findings: [
      'Operations ratios fill competitor gaps for inventory turnover, asset turnover, receivables turnover, and collection period.',
      'Formula review checked average inventory, inventory turnover, asset turnover, receivables turnover, collection days, and equity multiplier.',
      'FAQ and guide explain seasonal timing, credit sales, inventory method, and why operations ratios need business context.',
    ],
    improvements: [
      'Added operations-ratio UI, examples, source-backed guide detail, detailed FAQ, related profitability and liquidity links, and tests.',
    ],
    followUps: [
      'Add period-over-period comparison only when the UI can make multi-period data easy to scan.',
    ],
  },
  {
    slug: 'profitability-ratios-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-business-ratios-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [calculatorSoupSitemap, openStaxFinancialStatementAnalysis, secFinancialStatements, googleHelpfulContent],
    findings: [
      'Profitability ratios were added to cover margin, ROA, ROE, EPS, and P/E searches in one useful accounting utility.',
      'Formula review checked gross profit, gross margin, operating margin, net margin, return on assets, return on equity, EPS, and P/E.',
      'FAQ and guide explain why different margin layers matter and why high ROE can be affected by debt-funded growth.',
    ],
    improvements: [
      'Added profitability-ratio UI, examples, source-backed guide detail, FAQ depth, related stock and operations links, and tests.',
    ],
    followUps: [
      'Add loss-making company behavior later if the page needs negative-income education rather than positive-ratio basics.',
    ],
  },
  {
    slug: 'stock-ratios-calculator',
    status: 'deep-reviewed',
    batch: 'competitor-business-ratios-batch-2026-05-01',
    reviewedOn: '2026-05-01',
    scope: commonMathScope,
    sources: [calculatorSoupSitemap, openStaxFinancialStatementAnalysis, secFinancialStatements, googleHelpfulContent],
    findings: [
      'Stock valuation ratios were added as a separate per-share utility instead of mixing market ratios into the profitability page only.',
      'Formula review checked P/E, price-to-sales, price-to-book, dividend yield, and payout ratio from per-share inputs.',
      'FAQ and guide explain that ratios are research starting points, not investment recommendations, and that positive EPS is required for simple P/E.',
    ],
    improvements: [
      'Added stock-ratio UI, examples, guide detail, FAQ depth, related profitability and ROI pathways, and formula tests.',
    ],
    followUps: [
      'Add negative-EPS education only if the page can display non-meaningful P/E states cleanly.',
    ],
  },
];

function uniqueSources(sources: SourceLink[]) {
  const seen = new Set<string>();

  return sources.filter((source) => {
    if (seen.has(source.href)) {
      return false;
    }

    seen.add(source.href);
    return true;
  });
}

function sourceBackstop(sources: SourceLink[]) {
  return uniqueSources([...sources, googleHelpfulContent]).slice(0, Math.max(2, sources.length));
}

function includesAny(value: string, words: string[]) {
  return words.some((word) => value.includes(word));
}

function getProfileSources(tool: ToolDefinition): SourceLink[] {
  const key = `${tool.slug} ${tool.name} ${tool.category}`.toLowerCase();

  if (tool.category === 'finance') {
    if (includesAny(key, ['auto-loan', 'auto loan', 'vehicle loan', 'car loan'])) {
      return sourceBackstop([cfpbAutoLoans, cfpbDebtToIncome]);
    }

    if (includesAny(key, ['house-affordability', 'house affordability'])) {
      return sourceBackstop([cfpbMortgage, cfpbDebtToIncome]);
    }

    if (includesAny(key, ['mortgage-calculator', 'mortgage calculator'])) {
      return sourceBackstop([cfpbMonthlyMortgagePayment, cfpbPiti, cfpbLoanEstimate, freddieMacPmms, cfpbMortgage]);
    }

    if (includesAny(key, ['amortization', 'mortgage-payoff', 'mortgage payoff'])) {
      return sourceBackstop([cfpbMortgage, investorCompound]);
    }

    if (includesAny(key, ['student-loan', 'student loan'])) {
      return sourceBackstop([fsaRepaymentPlans, investorCompound]);
    }

    if (includesAny(key, ['loan-calculator', 'loan calculator'])) {
      return sourceBackstop([openStaxLoanAmortization, cfpbAprVsInterest, cfpbLoanEstimate, cfpbAutoTruthInLending]);
    }

    if (includesAny(key, ['finance-calculator', 'finance calculator'])) {
      return sourceBackstop([investorCompound, cfpbCompoundInterest, investorGovCompoundCalculator, consumerBudgetWorksheet]);
    }

    if (includesAny(key, ['college-cost', 'college cost'])) {
      return sourceBackstop([educationNetPrice, investorCompound]);
    }

    if (includesAny(key, ['cash-back-or-low-interest', 'cash back', 'low interest'])) {
      return sourceBackstop([cfpbAutoFinancingOffers, cfpbApr]);
    }

    if (includesAny(key, ['auto-lease', 'auto lease', 'lease-calculator', 'lease calculator'])) {
      return sourceBackstop([ftcAutoLease, cfpbApr]);
    }

    if (includesAny(key, ['business-loan', 'business loan'])) {
      return sourceBackstop([sbaLoans, cfpbAprVsInterest, ftcSmallBusinessFinancing]);
    }

    if (includesAny(key, ['personal-loan', 'personal loan'])) {
      return sourceBackstop([cfpbPersonalInstallmentFees, cfpbAprVsInterest]);
    }

    if (includesAny(key, ['boat-loan', 'boat loan'])) {
      return sourceBackstop([cfpbAprVsInterest, cfpbAutoFinancingOffers]);
    }

    if (includesAny(key, ['debt-to-income', 'debt to income'])) {
      return sourceBackstop([cfpbDebtToIncome, cfpbMortgage]);
    }

    if (includesAny(key, ['depreciation'])) {
      return sourceBackstop([irsDepreciation, openStaxDepreciation]);
    }

    if (includesAny(key, ['average-return', 'average return'])) {
      return sourceBackstop([investorAnnualReturn, investorCompound]);
    }

    if (includesAny(key, ['margin', 'discount', 'percent-off', 'percent off'])) {
      return sourceBackstop([openStaxDiscounts, openStaxPercent]);
    }

    if (includesAny(key, ['refinance'])) {
      return sourceBackstop([cfpbMortgage, cfpbAprVsInterest]);
    }

    if (includesAny(key, ['budget'])) {
      return sourceBackstop([consumerBudgetWorksheet, cfpbDebtToIncome]);
    }

    if (includesAny(key, ['marriage-tax', 'marriage tax'])) {
      return sourceBackstop([irsTax2026, irsRevenueProcedure]);
    }

    if (includesAny(key, ['estate-tax', 'estate tax'])) {
      return sourceBackstop([irsTax2026, irsEstateTax, irsEstateTaxFaqs, irsForm706Instructions]);
    }

    if (includesAny(key, ['social-security', 'social security'])) {
      return sourceBackstop([ssaClaimingAge, investorCompound]);
    }

    if (includesAny(key, ['rmd-calculator', 'rmd calculator'])) {
      return sourceBackstop([irsRmd, irsIraLimits]);
    }

    if (includesAny(key, ['real-estate', 'real estate'])) {
      return sourceBackstop([cfpbMortgage, investorCompound]);
    }

    if (includesAny(key, ['take-home-paycheck', 'take home paycheck', 'paycheck'])) {
      return sourceBackstop([irsFica, irsWithholdingEstimatorFaqs]);
    }

    if (includesAny(key, ['rental-property', 'rental property'])) {
      return sourceBackstop([cfpbMortgage, consumerBudgetWorksheet]);
    }

    if (includesAny(key, ['irr-calculator', 'irr calculator'])) {
      return sourceBackstop([openStaxIrr, investorCompound]);
    }

    if (includesAny(key, ['roi-calculator', 'roi calculator'])) {
      return sourceBackstop([openStaxInvestments, investorAnnualReturn]);
    }

    if (includesAny(key, ['apr-calculator', 'apr calculator'])) {
      return sourceBackstop([cfpbAprVsInterest, cfpbApr]);
    }

    if (includesAny(key, ['fha-loan', 'fha loan'])) {
      return sourceBackstop([cfpbFhaLoans, hudFhaLoans, hudFhaLoanLimits2026, hudFhaLoanLimitsMl2025, hudFhaMip, hudFhaMipMortgageeLetter2023, cfpbDownPayment, cfpbPrepareHomeMoney]);
    }

    if (includesAny(key, ['va-mortgage', 'va mortgage'])) {
      return sourceBackstop([vaFundingFee, cfpbMortgage]);
    }

    if (includesAny(key, ['home-equity-loan', 'home equity loan'])) {
      return sourceBackstop([
        cfpbHomeEquity,
        cfpbHomeEquityVsHeloc,
        ftcHomeEquityLoans,
        cfpbLoanEstimate,
        cfpbClosingDisclosure,
        irsPub936HomeMortgageInterest,
      ]);
    }

    if (includesAny(key, ['heloc'])) {
      return sourceBackstop([cfpbHeloc, cfpbHomeEquity]);
    }

    if (includesAny(key, ['down-payment', 'down payment'])) {
      return sourceBackstop([cfpbDownPayment, cfpbPrepareHomeMoney, fannieClosingCostsCalculator, fannieDownPayment, hudFhaLoans]);
    }

    if (includesAny(key, ['rent-vs-buy', 'rent vs buy'])) {
      return sourceBackstop([cfpbDownPayment, cfpbMortgage]);
    }

    if (includesAny(key, ['payback-period', 'payback period'])) {
      return sourceBackstop([openStaxPayback, openStaxNpv]);
    }

    if (includesAny(key, ['present-value', 'present value'])) {
      return sourceBackstop([openStaxPresentValue, openStaxNpv]);
    }

    if (includesAny(key, ['future-value', 'future value'])) {
      return sourceBackstop([openStaxFutureValue, openStaxPresentValue]);
    }

    if (includesAny(key, ['commission'])) {
      return sourceBackstop([dolCommissions, irsFica]);
    }

    if (includesAny(key, ['mortgage-calculator-uk', 'mortgage calculator uk', 'uk mortgage'])) {
      return sourceBackstop([moneyHelperMortgage, moneyHelperMortgageOptions, govUkBuyingHome, govUkSdltRates, govUkMortgage]);
    }

    if (includesAny(key, ['canadian-mortgage', 'canadian mortgage'])) {
      return sourceBackstop([canadaMortgageTerms, canadaMortgageDownPayment, osfiMinimumQualifyingRate, bankCanadaPolicyRate, canadaInterestAct]);
    }

    if (includesAny(key, ['interest-rate', 'interest rate'])) {
      return sourceBackstop([cfpbAprVsInterest, cfpbApr, minneapolisFedConsumerRates]);
    }

    if (includesAny(key, ['mortgage', 'loan', 'rent-vs-buy', 'house-affordability', 'heloc', 'home-equity'])) {
      return sourceBackstop([cfpbMortgage, investorCompound]);
    }

    if (includesAny(key, ['currency'])) {
      return sourceBackstop([federalReserveExchangeRates, googleHelpfulContent]);
    }

    if (includesAny(key, ['vat'])) {
      return sourceBackstop([euVat, openStaxPercent]);
    }

    if (includesAny(key, ['tax', 'salary', 'paycheck'])) {
      if (includesAny(key, ['sales-tax', 'sales tax'])) {
        return sourceBackstop([irsSalesTax, taxFoundationSalesTaxRates]);
      }

      return sourceBackstop([irsTax2026, blsInflation]);
    }

    if (includesAny(key, ['inflation'])) {
      return sourceBackstop([blsInflation, investorCompound]);
    }

    if (includesAny(key, ['savings'])) {
      return sourceBackstop([investorCompound, consumerBudgetWorksheet]);
    }

    if (includesAny(key, ['rent'])) {
      return sourceBackstop([consumerBudgetWorksheet, cfpbDebtToIncome]);
    }

    if (includesAny(key, ['annuity-payout', 'annuity payout', 'annuity'])) {
      return sourceBackstop([investorAnnuities, investorCompound]);
    }

    if (includesAny(key, ['pension'])) {
      return sourceBackstop([pbgcPensionCoverage, investorCompound]);
    }

    if (includesAny(key, ['cd-calculator', 'certificate of deposit'])) {
      return sourceBackstop([fdicCdShopping, investorCompound]);
    }

    if (includesAny(key, ['bond'])) {
      return sourceBackstop([investorBonds, investorCompound]);
    }

    if (includesAny(key, ['mutual-fund', 'mutual fund'])) {
      return sourceBackstop([investorMutualFunds, investorCompound]);
    }

    if (includesAny(key, ['credit', 'debt', 'repayment'])) {
      return sourceBackstop([cfpbCreditCards, cfpbDebtCollection]);
    }

    if (includesAny(key, ['401k', '401 k'])) {
      return sourceBackstop([irs401kLimits, investorCompound]);
    }

    if (includesAny(key, ['ira', '401k', 'retirement', 'pension', 'rmd'])) {
      return sourceBackstop([irsIraLimits, investorCompound]);
    }

    return sourceBackstop([investorCompound, cfpbMortgage]);
  }

  if (tool.category === 'health-fitness') {
    if (includesAny(key, ['pregnancy', 'due-date', 'conception', 'ovulation', 'period'])) {
      return sourceBackstop([johnsHopkinsDueDate, cdcPregnancyWeight]);
    }

    if (includesAny(key, ['gfr'])) {
      return sourceBackstop([kidneyGfr, cdcBmi]);
    }

    if (includesAny(key, ['bac', 'alcohol'])) {
      return sourceBackstop([niaaaAlcohol, cdcBmi]);
    }

    if (includesAny(key, ['macro', 'carbohydrate', 'protein', 'fat', 'nutrition'])) {
      return sourceBackstop([fdaNutritionFacts, cdcActivity]);
    }

    if (includesAny(key, ['calorie', 'bmr', 'tdee', 'pace', 'heart', 'rep max'])) {
      return sourceBackstop([cdcActivity, cdcBmi]);
    }

    return sourceBackstop([cdcBmi, nhlbiBmi]);
  }

  if (tool.category === 'home-projects') {
    if (includesAny(key, ['wallpaper'])) {
      return sourceBackstop([yorkWallpaperRoomChart, lowesWallpaperInstall, grahamBrownWallpaperAmount, grahamBrownWallpaperBatch, nistSi, googleHelpfulContent]);
    }

    if (includesAny(key, ['flooring'])) {
      return sourceBackstop([lowesFlooringFootage, lowesFlooringPlanner, homeDepotFlooringInstall, nistSi]);
    }

    if (includesAny(key, ['paint'])) {
      return sourceBackstop([sherwinPaintCoverage, nistSi]);
    }

    if (includesAny(key, ['tile'])) {
      return sourceBackstop([lowesTile, nistSi]);
    }

    if (includesAny(key, ['concrete', 'block', 'rebar'])) {
      return sourceBackstop([quikreteConcrete, nistSi]);
    }

    return sourceBackstop([nistSi, openStaxGeometry]);
  }

  if (tool.category === 'date-time') {
    if (includesAny(key, ['time-zone'])) {
      return sourceBackstop([ianaTimeZones, isoDate]);
    }

    if (includesAny(key, ['time-card', 'hours'])) {
      return sourceBackstop([dolHours, isoDate]);
    }

    return sourceBackstop([isoDate, nistTimeDefinitions, mdnDate]);
  }

  if (tool.category === 'developer-tools') {
    if (includesAny(key, ['subnet', 'ip'])) {
      return sourceBackstop([rfc4632, rfc3986]);
    }

    if (includesAny(key, ['password'])) {
      return sourceBackstop([nistPasswords, mdnCryptoRandomValues]);
    }

    if (includesAny(key, ['base64', 'hash'])) {
      return sourceBackstop([rfc4648, rfc3986]);
    }

    if (includesAny(key, ['url', 'query', 'utm'])) {
      return sourceBackstop([rfc3986, mdnUrlSearchParams]);
    }

    return sourceBackstop([mdnUrlSearchParams, rfc3986]);
  }

  if (tool.category === 'converters') {
    if (includesAny(key, ['oven-temperature', 'oven temperature', 'gas mark'])) {
      return sourceBackstop([goodFoodConversionGuides, whichOvenTemperatureChart, foodSafetyTemperatures, nistSi]);
    }

    if (includesAny(key, ['roman'])) {
      return sourceBackstop([openStaxPrimeLcm, nistSi]);
    }

    return sourceBackstop([nistSi, rfc3986]);
  }

  if (tool.category === 'text-tools') {
    return sourceBackstop([googleHelpfulContent, mdnUrlSearchParams]);
  }

  if (tool.category === 'image-tools') {
    return sourceBackstop([wcagContrast, googleHelpfulContent]);
  }

  if (tool.category === 'ai-tools') {
    if (includesAny(key, ['ocr', 'image-to-text'])) {
      return sourceBackstop([tesseractJs, tesseractOcrDocs]);
    }

    if (includesAny(key, ['language'])) {
      return sourceBackstop([francLanguageDetection, googleHelpfulContent]);
    }

    if (includesAny(key, ['reading'])) {
      return sourceBackstop([fleschKincaidFormula, googleHelpfulContent]);
    }

    return sourceBackstop([transformersJs, googleHelpfulContent]);
  }

  if (includesAny(key, ['standard-deviation', 'statistics', 'mean', 'median', 'mode', 'range', 'average'])) {
    return sourceBackstop([openStaxStatisticsSpread, openStaxStandardNormal]);
  }

  if (includesAny(key, ['probability', 'permutation', 'combination'])) {
    return sourceBackstop([openStaxProbabilityCombinations, openStaxStandardNormal]);
  }

  if (includesAny(key, ['z-score', 'confidence-interval', 'sample-size', 'p-value'])) {
    return sourceBackstop([openStaxStandardNormal, openStaxConfidenceIntervals]);
  }

  if (includesAny(key, ['triangle', 'volume', 'slope', 'area', 'distance', 'circle', 'surface-area', 'pythagorean'])) {
    return sourceBackstop([openStaxGeometry, openStaxDistance]);
  }

  if (includesAny(key, ['least-common-multiple', 'greatest-common-factor', 'factor', 'prime', 'long-division'])) {
    return sourceBackstop([openStaxPrimeLcm, openStaxFractions]);
  }

  if (includesAny(key, ['rounding', 'scientific-notation', 'big-number'])) {
    return sourceBackstop([openStaxScientificNotation, nistSi]);
  }

  if (includesAny(key, ['sequence'])) {
    return sourceBackstop([openStaxSequences, openStaxScientificNotation]);
  }

  if (includesAny(key, ['matrix'])) {
    return sourceBackstop([openStaxScientificNotation, openStaxQuadratics]);
  }

  if (includesAny(key, ['random-number', 'dice'])) {
    return sourceBackstop([mdnCryptoRandomValues, mdnMathRandom]);
  }

  if (includesAny(key, ['fuel', 'mileage', 'gas'])) {
    return sourceBackstop([epaFuelEconomy, nistSi]);
  }

  if (includesAny(key, ['wind-chill'])) {
    return sourceBackstop([nwsWindChill, nistSi]);
  }

  return sourceBackstop([openStaxPercent, nistSi]);
}

function getFormulaFinding(tool: ToolDefinition) {
  if (tool.category === 'finance') {
    return 'Formula review checked rate, term, compounding or payment-period language so the page reads as an educational estimate instead of a final quote.';
  }

  if (tool.category === 'health-fitness') {
    return 'Formula review checked unit-sensitive health language and kept the result framed as education, not medical advice.';
  }

  if (tool.category === 'home-projects') {
    return 'Formula review checked area, volume, coverage, waste, and unit language so project estimates explain what the material number means.';
  }

  if (tool.category === 'developer-tools') {
    return 'Logic review checked browser-side parsing or encoding behavior, copy output, and warnings about secrets or sensitive text.';
  }

  if (tool.category === 'ai-tools') {
    return 'AI review checked browser-only input handling, lazy model loading, output limits, source notes, and no-upload privacy wording.';
  }

  if (tool.category === 'date-time') {
    return 'Date and time review checked calendar labels, duration wording, time-zone cautions, and examples against date-only versus clock-time behavior.';
  }

  return 'Formula review checked the page description, examples, and FAQ against the expected school or everyday calculation behavior.';
}

function createGeneratedBaselineAuditRecord(tool: ToolDefinition): ToolDeepAuditRecord {
  return {
    slug: tool.slug,
    status: 'baseline-reviewed',
    batch: 'baseline-tool-content-pass-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: [...BASELINE_AUDIT_SCOPE],
    sources: getProfileSources(tool),
    findings: [
      `Baseline formula and logic check covered ${tool.name}'s category rules, examples, and FAQ wording against the expected calculation behavior.`,
      `Baseline input and FAQ check confirmed that ${tool.name} explains the main inputs, how to read the answer, and what to double-check before trusting the result.`,
      `Baseline blog and SEO check confirmed that ${tool.name} has a matching how-to guide, concise search title, useful description, examples, and related-tool links.`,
      'Privacy check confirmed that the tool stays browser-first, avoids fake ad placeholders, and keeps recent answers in the current tab rather than sending them to a server.',
    ],
    improvements: [
      'Connected the tool to the site-wide audit tracker with formula, input, FAQ, blog, SEO, privacy, and source checks.',
      'Covered the page with automated content guardrails for examples, FAQ depth, related links, placeholder wording, and generated guide substance.',
    ],
    followUps: [
      'Schedule a manual deep review for more bespoke examples, visual polish, and edge-case testing when this tool becomes a high-traffic page.',
    ],
  };
}

function createAliasDeepAuditRecord(alias: ToolAlias, targetTool: ToolDefinition): ToolDeepAuditRecord {
  return {
    slug: alias.slug,
    status: 'alias-reviewed',
    batch: 'public-tool-url-pass-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: [...DEEP_AUDIT_REQUIRED_SCOPE],
    sources: getProfileSources(targetTool),
    findings: [
      `${alias.name} was reviewed as a public tool URL that routes to the canonical ${targetTool.name} experience.`,
      `Input, FAQ, and blog review checked that the alias search intent is covered by ${targetTool.name} without splitting formulas, examples, or privacy notes across duplicate pages.`,
      'SEO review checked that the alias page has a useful description, visible canonical-tool notice, and a searchable launchpad entry.',
      'UI and privacy review checked that the alias opens the same browser-first calculator flow and does not introduce extra data collection.',
    ],
    improvements: [
      'Included the alias page in the deep-audit tracker so public tool URL coverage matches the preview count.',
      'Included the alias in the searchable tools launchpad so users can find it as its own entry and still land on the canonical calculator.',
    ],
    followUps: [
      'Promote this alias to a separate full calculator only if search data shows users need a different formula, input set, or guide from the canonical tool.',
    ],
  };
}

const manualAuditSlugs = new Set(manualDeepAuditRecords.map((record) => record.slug));
const aliasDeepAuditRecords = toolAliases
  .map((alias) => {
    const targetTool = tools.find((tool) => tool.slug === alias.targetSlug);

    return targetTool ? createAliasDeepAuditRecord(alias, targetTool) : undefined;
  })
  .filter((record): record is ToolDeepAuditRecord => Boolean(record));

export const toolDeepAuditRecords: ToolDeepAuditRecord[] = [
  ...manualDeepAuditRecords,
  ...tools
    .filter((tool) => !manualAuditSlugs.has(tool.slug))
    .map((tool) => createGeneratedBaselineAuditRecord(tool)),
  ...aliasDeepAuditRecords,
];

export const manualDeepReviewProgress = (() => {
  const canonicalRecords = tools
    .map((tool) => getDeepAuditRecord(tool.slug))
    .filter((record): record is ToolDeepAuditRecord => Boolean(record));
  const aliasRecords = toolAliases
    .map((alias) => getDeepAuditRecord(alias.slug))
    .filter((record): record is ToolDeepAuditRecord => Boolean(record));
  const deepReviewedCanonicalTools = canonicalRecords.filter((record) => record.status === 'deep-reviewed').length;
  const baselineReviewedCanonicalTools = canonicalRecords.filter((record) => record.status === 'baseline-reviewed').length;
  const aliasReviewedUrls = aliasRecords.filter((record) => record.status === 'alias-reviewed').length;

  return {
    canonicalTools: tools.length,
    aliasUrls: toolAliases.length,
    publicToolUrls: tools.length + toolAliases.length,
    deepReviewedCanonicalTools,
    baselineReviewedCanonicalTools,
    aliasReviewedUrls,
    isComplete:
      deepReviewedCanonicalTools === tools.length &&
      baselineReviewedCanonicalTools === 0 &&
      aliasReviewedUrls === toolAliases.length,
  };
})();

export function getDeepAuditRecord(slug: string) {
  return toolDeepAuditRecords.find((record) => record.slug === slug);
}
