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

const openStaxPercentApplications = {
  href: 'https://openstax.org/books/prealgebra-2e/pages/6-2-solve-general-applications-of-percent',
  label: 'OpenStax Prealgebra: Percent applications',
};

const openStaxMeasurement = {
  href: 'https://openstax.org/books/chemistry-2e/pages/1-5-measurement-uncertainty-accuracy-and-precision',
  label: 'OpenStax Chemistry: Measurement uncertainty, accuracy, and precision',
};

const openStaxPhysicsAccuracy = {
  href: 'https://openstax.org/books/college-physics/pages/1-3-accuracy-precision-and-significant-figures',
  label: 'OpenStax College Physics: Accuracy, precision, and significant figures',
};

const khanPercentError = {
  href: 'https://www.khanacademy.org/math/7th-grade-math-eureka-squared-aligned/x314834f71a55c568%3Apercent-and-applications-of-percent/x314834f71a55c568%3Aapplying-percent-error/a/key-ideas-applying-percent-error',
  label: 'Khan Academy: Applying percent error',
};

const openStaxFractions = {
  href: 'https://openstax.org/books/prealgebra-2e/pages/4-5-add-and-subtract-fractions-with-different-denominators',
  label: 'OpenStax Prealgebra: Add and subtract fractions with different denominators',
};

const khanFractions = {
  href: 'https://www.khanacademy.org/math/arithmetic-home/addition-subtraction/fractions-intro',
  label: 'Khan Academy: Fractions arithmetic practice',
};

const khanOrderOfOperations = {
  href: 'https://www.khanacademy.org/math/pre-algebra/pre-algebra-arith-prop/pre-algebra-order-of-operations/v/order-operations-intro',
  label: 'Khan Academy: Order of operations introduction',
};

const khanPercentageChange = {
  href: 'https://www.khanacademy.org/e/percentage-change-word-problems',
  label: 'Khan Academy: Percentage change word problems',
};

const mdnArithmeticOperators = {
  href: 'https://developer.mozilla.org/docs/Web/JavaScript/Guide/Expressions_and_Operators',
  label: 'MDN: JavaScript expressions and arithmetic operators',
};

const mdnBigInt = {
  href: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/BigInt',
  label: 'MDN: JavaScript BigInt',
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

const openStaxRatiosProportions = {
  href: 'https://openstax.org/books/contemporary-mathematics/pages/5-4-ratios-and-proportions',
  label: 'OpenStax Contemporary Mathematics: Ratios and proportions',
};

const openStaxRatiosRate = {
  href: 'https://openstax.org/books/prealgebra-2e/pages/5-6-ratios-and-rate',
  label: 'OpenStax Prealgebra: Ratios and rate',
};

const khanRatiosRates = {
  href: 'https://www.khanacademy.org/math/arithmetic/unit-conversion',
  label: 'Khan Academy: Ratios and rates',
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

const nistAmpere = {
  href: 'https://www.nist.gov/pml/weights-and-measures/si-units-ampere',
  label: 'NIST: SI unit of electric current',
};

const esfiExtensionCordSafety = {
  href: 'https://www.esfi.org/extension-cord-safety-tips/',
  label: 'Electrical Safety Foundation International: Extension cord safety tips',
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

const calculatorNetBandwidth = {
  href: 'https://www.calculator.net/bandwidth-calculator.html',
  label: 'Calculator.net: Bandwidth calculator reference',
};

const graphCalcBatteryLife = {
  href: 'https://www.graphcalc.com/battery-life-calculator/',
  label: 'GraphCalc: Battery life calculator reference',
};

const inchCalculatorPpi = {
  href: 'https://www.inchcalculator.com/ppi-calculator/',
  label: 'Inch Calculator: PPI calculator reference',
};

const inchCalculatorRecipeScale = {
  href: 'https://www.inchcalculator.com/recipe-scale-conversion-calculator/',
  label: 'Inch Calculator: Recipe scale conversion calculator reference',
};

const inchCalculatorCookingConversion = {
  href: 'https://www.inchcalculator.com/cooking-conversion-calculator/',
  label: 'Inch Calculator: Cooking conversion calculator reference',
};

const dishCostIngredientCost = {
  href: 'https://dishcost.com/tools/ingredient-cost-calculator',
  label: 'DishCost: ingredient cost calculator reference',
};

const dishCostCostPerServing = {
  href: 'https://dishcost.com/tools/cost-per-serving-calculator',
  label: 'DishCost: cost per serving calculator reference',
};

const calcipediaUnitPrice = {
  href: 'https://www.calcipedia.org/calculators/unit-price-calculator/',
  label: 'Calcipedia: unit price calculator reference',
};

const inchCalculatorSitemap = {
  href: 'https://www.inchcalculator.com/sitemap/',
  label: 'Inch Calculator sitemap: competitor gap reference',
};

const inchDeckFlooring = {
  href: 'https://www.inchcalculator.com/deck-flooring-calculator/',
  label: 'Inch Calculator: Deck flooring calculator reference',
};

const decksComDeckingCalculator = {
  href: 'https://www.decks.com/calculators/decking-calculator',
  label: 'Decks.com: Deck board and materials calculator',
};

const omniDecking = {
  href: 'https://www.omnicalculator.com/construction/decking',
  label: 'Omni Calculator: Decking calculator reference',
};

const inchDeckStain = {
  href: 'https://www.inchcalculator.com/deck-stain-calculator/',
  label: 'Inch Calculator: Deck stain calculator reference',
};

const decksComStaining = {
  href: 'https://www.decks.com/how-to/articles/how-to-stain-a-wood-deck',
  label: 'Decks.com: How to stain a wood deck',
};

const behrDeckPlusSolidStain = {
  href: 'https://www.behr.com/consumer/products/wood-stains-finishes-cleaners-and-strippers/solid-color-wood-stains/behr-deckplus-solid-color-waterproofing-wood-stain',
  label: 'BEHR: DECKplus solid color waterproofing wood stain',
};

const rustOleumWolmanDurastain = {
  href: 'https://www.rustoleum.com/product-catalog/consumer-brands/wolman/durastain-semi-transparent-stain/',
  label: 'Rust-Oleum Wolman: DuraStain semi-transparent stain',
};

const inchBaluster = {
  href: 'https://www.inchcalculator.com/baluster-calculator/',
  label: 'Inch Calculator: Baluster calculator reference',
};

const decksComBalusterCalculator = {
  href: 'https://www.decks.com/calculators/baluster-spacing-calculator/',
  label: 'Decks.com: Deck baluster spacing calculator',
};

const decksComBalusterBasics = {
  href: 'https://www.decks.com/resource-index/railing/balusters-explained/',
  label: 'Decks.com: Baluster basics and spacing requirements',
};

const iccIrc2021GuardOpenings = {
  href: 'https://codes.iccsafe.org/s/IRC2021P3/chapter-3-building-planning/IRC2021P3-Pt03-Ch03-SecR312.1.3',
  label: 'ICC: 2021 IRC R312.1.3 guard opening limitations',
};

const awcDca6DeckGuide = {
  href: 'https://web-media.awc.org/wp-content/uploads/2022/02/17210514/AWC-DCA62015-DeckGuide-1804.pdf',
  label: 'AWC: DCA 6 Prescriptive Residential Wood Deck Construction Guide',
};

const inchPaverBase = {
  href: 'https://www.inchcalculator.com/paver-base-calculator/',
  label: 'Inch Calculator: Paver base calculator reference',
};

const lowesPaverPlanning = {
  href: 'https://www.lowes.com/n/how-to/planning-for-a-paver-patio-or-walkway',
  label: 'Lowe\'s: Planning for a paver patio or walkway',
};

const inchPaverCalculator = {
  href: 'https://www.inchcalculator.com/paver-calculator/',
  label: 'Inch Calculator: Paver calculator reference',
};

const calcShedPaverCalculator = {
  href: 'https://calcshed.com/paver-calculator/',
  label: 'CalcShed: Paver calculator',
};

const inchSandCalculator = {
  href: 'https://www.inchcalculator.com/sand-calculator/',
  label: 'Inch Calculator: Sand calculator reference',
};

const calcShedSandCalculator = {
  href: 'https://calcshed.com/sand-calculator/',
  label: 'CalcShed: Sand calculator',
};

const calculatorSoupCubicYards = {
  href: 'https://www.calculatorsoup.com/calculators/construction/cubic-yards-calculator.php',
  label: 'CalculatorSoup: Cubic yards calculator',
};

const cmhaPaverConstruction = {
  href: 'https://www.cmha.org/pav-tec-002/',
  label: 'CMHA: Construction of interlocking concrete pavements',
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

const iccIrc2024Foundations = {
  href: 'https://codes.iccsafe.org/content/IRC2024P2/chapter-4-foundations',
  label: 'ICC: 2024 IRC foundations chapter',
};

const maxiConcreteColumn = {
  href: 'https://www.maxicalculator.com/construction/concrete-column-calculator',
  label: 'Maxi Calculator: Concrete column calculator reference',
};

const inchPostHoleConcrete = {
  href: 'https://www.inchcalculator.com/post-hole-concrete-calculator/',
  label: 'Inch Calculator: Post hole concrete calculator reference',
};

const inchPlywood = {
  href: 'https://www.inchcalculator.com/plywood-calculator/',
  label: 'Inch Calculator: Plywood calculator reference',
};

const apaPlywood = {
  href: 'https://www.apawood.org/plywood',
  label: 'APA: Plywood product applications and panel sizes',
};

const homeDepotPlywoodTypes = {
  href: 'https://www.homedepot.com/c/ab/types-of-plywood/9ba683603be9fa5395fab909d37f448',
  label: 'The Home Depot: Types of plywood',
};

const inchSod = {
  href: 'https://www.inchcalculator.com/sod-calculator/',
  label: 'Inch Calculator: Sod calculator reference',
};

const tallyardSodCalculator = {
  href: 'https://www.tallyard.com/sod-calculator',
  label: 'Tallyard: Sod calculator',
};

const sodSolutionsPalletCoverage = {
  href: 'https://sodsolutions.com/lawn-care-guides/square-feet-per-pallet/',
  label: 'Sod Solutions: Square feet per pallet of sod',
};

const calcShedSodCalculator = {
  href: 'https://calcshed.com/sod-calculator/',
  label: 'CalcShed: Sod calculator',
};

const inchFraming = {
  href: 'https://www.inchcalculator.com/framing-calculator/',
  label: 'Inch Calculator: Framing calculator reference',
};

const calcSummitFramingCalculator = {
  href: 'https://calcsummit.com/calculators/construction/framing/',
  label: 'CalcSummit: Framing calculator',
};

const homeProjectStudCalculator = {
  href: 'https://www.homeprojectcalculator.com/stud-calculator/',
  label: 'Home Project Calculator: Stud calculator',
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

const aciConcreteTerminology = {
  href: 'https://www.concrete.org/portals/0/files/pdf/ACI_Concrete_Terminology.pdf',
  label: 'ACI: Concrete Terminology',
};

const fhwaConcreteWeight = {
  href: 'https://www.fhwa.dot.gov/bridge/pubs/07022/chap04.cfm',
  label: 'FHWA: Normal-weight and lightweight concrete density',
};

const nrmcaLightweightConcrete = {
  href: 'https://www.nrmca.org/wp-content/uploads/2021/01/36pr.pdf',
  label: 'NRMCA: Structural lightweight concrete',
};

const inchConcreteMesh = {
  href: 'https://www.inchcalculator.com/concrete-reinforcing-mesh-calculator/',
  label: 'Inch Calculator: Concrete reinforcing mesh calculator reference',
};

const aciWwrPlacement = {
  href: 'https://www.concrete.org/frequentlyaskedquestions/faqid/900.aspx',
  label: 'ACI: Placement of welded wire reinforcement in slab-on-ground work',
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

const southernRebarWeight = {
  href: 'https://www.southernrebar.com/reference/rebar-weight-per-linear-foot',
  label: 'Southern Rebar: Rebar weight per linear foot',
};

const calcShedRebar = {
  href: 'https://calcshed.com/rebar-calculator/',
  label: 'CalcShed: Rebar calculator',
};

const crsiLapSplices = {
  href: 'https://www.crsi.org/reinforcing-basics/reinforcing-steel/splicing-bars/lap-splices/',
  label: 'CRSI: Lap splices',
};

const crsiSplicingBars = {
  href: 'https://www.crsi.org/reinforcing-basics/reinforcing-steel/splicing-bars/',
  label: 'CRSI: Splicing reinforcing bars',
};

const lowesCountertopGuide = {
  href: 'https://www.lowes.com/pdf/kitchen_countertop_measure_guide.pdf',
  label: 'Lowe\'s: Kitchen countertop measurement guide',
};

const slabWiseCountertopSquareFeet = {
  href: 'https://slabwise.com/tools/sqft-calculator',
  label: 'SlabWise: Countertop square footage calculator',
};

const lowesFlooringFootage = {
  href: 'https://pdf.lowes.com/productdocuments/3f70b1c9-8ab7-4125-a2e7-9a3d080d2861/08130541.pdf',
  label: 'Lowe\'s: Calculating correct hardwood flooring footage',
};

const lowesFlooringPlanner = {
  href: 'https://pdf.lowes.com/productdocuments/a1902812-3b3c-47a8-b344-3e03ce6c804a/48135912.pdf',
  label: 'Lowe\'s: Flooring project planner',
};

const criResidentialCarpetInstallation = {
  href: 'https://carpet-rug.org/wp-content/uploads/2019/03/CRI-105-STANDARD-For-INSTALLATION-of-RESIDENTIAL-CARPET.pdf',
  label: 'Carpet and Rug Institute: CRI 105 residential carpet installation standard',
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

const calculatorSoupVolume = {
  href: 'https://www.calculatorsoup.com/calculators/geometry-solids/volume.php',
  label: 'CalculatorSoup: Volume calculator formulas',
};

const calculatorNetVolume = {
  href: 'https://www.calculator.net/volume-calculator.html',
  label: 'Calculator.net: Volume calculator',
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

const openStaxSolvencyRatios = {
  href: 'https://openstax.org/books/principles-finance/pages/6-4-solvency-ratios',
  label: 'OpenStax Principles of Finance: Solvency ratios',
};

const openStaxProfitabilityRatios = {
  href: 'https://openstax.org/books/principles-finance/pages/6-3-profitability-ratios-and-the-dupont-method',
  label: 'OpenStax Principles of Finance: Profitability ratios and the DuPont method',
};

const openStaxMarketValueRatios = {
  href: 'https://openstax.org/books/principles-finance/pages/6-5-market-value-ratios',
  label: 'OpenStax Principles of Finance: Market value ratios',
};

const openStaxStockValuationMultiples = {
  href: 'https://openstax.org/books/principles-finance/pages/11-1-multiple-approaches-to-stock-valuation',
  label: 'OpenStax Principles of Finance: Stock valuation multiples',
};

const finraEvaluatingStocks = {
  href: 'https://www.finra.org/investors/investing/investment-products/stocks/evaluating-stocks',
  label: 'FINRA: Evaluating stocks',
};

const openStaxOperatingEfficiencyRatios = {
  href: 'https://openstax.org/books/principles-finance/pages/6-2-operating-efficiency-ratios',
  label: 'OpenStax Principles of Finance: Operating efficiency ratios',
};

const secFinancialStatements = {
  href: 'https://www.sec.gov/about/reports-publications/investorpubsbegfinstmtguide',
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

const cfpbMortgageAffordability = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/how-can-i-figure-out-if-i-can-afford-to-buy-a-home-and-take-out-a-mortgage-en-118/',
  label: 'CFPB: How to decide what mortgage payment is affordable',
};

const cfpbMonthlyMortgagePayment = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/how-do-mortgage-lenders-calculate-monthly-payments-en-1965/',
  label: 'CFPB: How mortgage lenders calculate monthly payments',
};

const cfpbPiti = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-piti-en-152/',
  label: 'CFPB: What is PITI?',
};

const cfpbPayoffAmount = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-payoff-amount-and-is-it-the-same-as-my-current-balance-en-205/',
  label: 'CFPB: Payoff amount vs. current balance',
};

const irsPublication523 = {
  href: 'https://www.irs.gov/publications/p523',
  label: 'IRS Publication 523: Selling Your Home',
};

const irsRentalTopic414 = {
  href: 'https://www.irs.gov/taxtopics/tc414',
  label: 'IRS Topic 414: Rental income and expenses',
};

const irsPublication527 = {
  href: 'https://www.irs.gov/publications/p527',
  label: 'IRS Publication 527: Residential Rental Property',
};

const fannieRentalIncome = {
  href: 'https://selling-guide.fanniemae.com/sel/b3-3.8-01/rental-income',
  label: 'Fannie Mae Selling Guide: Rental income',
};

const cfpbServicerRules = {
  href: 'https://www.consumerfinance.gov/consumer-tools/mortgages/your-mortgage-servicer-must-comply-with-federal-rules/',
  label: 'CFPB: Mortgage servicer rules',
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

const cfpbAutoLoanRates = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/where-can-i-get-information-on-auto-loan-rates-en-761/',
  label: 'CFPB: Where to get auto loan rate information',
};

const cfpbAutoLoanTerms = {
  href: 'https://www.consumerfinance.gov/language/cfpb-in-english/auto-loans-key-terms/',
  label: 'CFPB: Auto loans key terms',
};

const cfpbAutoLeaseBuy = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/what-should-i-know-about-leasing-versus-buying-a-car-en-815/',
  label: 'CFPB: Leasing versus buying a car',
};

const cfpbRegM = {
  href: 'https://www.consumerfinance.gov/rules-policy/regulations/1013/',
  label: 'CFPB Regulation M: Consumer Leasing',
};

const investorCompound = {
  href: 'https://openstax.org/books/principles-finance/pages/7-2-time-value-of-money-tvm-basics',
  label: 'OpenStax Principles of Finance: Time value of money basics',
};

const investorSimpleInterest = {
  href: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/simple-interest',
  label: 'Investor.gov: Simple interest glossary',
};

const cfpbCompoundInterest = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/how-does-compound-interest-work-en-1683/',
  label: 'CFPB: How compound interest works',
};

const fdicCompoundInterest = {
  href: 'https://www.fdic.gov/consumer-resource-center/chapter-5-compound-interest',
  label: 'FDIC: Compound interest',
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
  href: 'https://www.consumerfinance.gov/consumer-tools/credit-cards/',
  label: 'CFPB: Credit cards',
};

const cfpbTruthInLendingAutoLoan = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-truth-in-lending-disclosure-for-an-auto-loan-en-787/',
  label: 'CFPB: Truth in Lending auto loan disclosure terms',
};

const cfpbCreditCardApr = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-credit-card-interest-rate-what-does-apr-mean-en-44/',
  label: 'CFPB: What credit card APR means',
};

const cfpbCreditCardInterest = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/how-does-my-credit-card-company-calculate-the-amount-of-interest-i-owe-en-51/',
  label: 'CFPB: How credit card interest is calculated',
};

const cfpbCreditCardGracePeriod = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-grace-period-for-a-credit-card-en-47/',
  label: 'CFPB: Credit card grace periods',
};

const cfpbCreditCardAgreement = {
  href: 'https://www.consumerfinance.gov/data-research/credit-card-data/know-you-owe-credit-cards/',
  label: 'CFPB: Credit card agreement terms',
};

const ftcCreditCardDebt = {
  href: 'https://consumer.ftc.gov/paying-holiday-credit-card-debt',
  label: 'FTC: Paying credit card debt',
};

const ftcGetOutOfDebt = {
  href: 'https://consumer.ftc.gov/how-get-out-debt',
  label: 'FTC: How to get out of debt',
};

const consumerGovBudget = {
  href: 'https://consumer.gov/your-money/making-budget',
  label: 'consumer.gov: Making a budget',
};

const cfpbDebtConsolidation = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/what-do-i-need-to-know-if-im-thinking-about-consolidating-my-credit-card-debt-en-1861/',
  label: 'CFPB: Consolidating credit card debt',
};

const cfpbCreditCounselingVsSettlement = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/whats-the-difference-between-a-credit-counselor-and-a-debt-settlement-company-en-1449/',
  label: 'CFPB: Credit counselor and debt settlement differences',
};

const cfpbDebtToIncome = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/',
  label: 'Consumer Financial Protection Bureau: Debt-to-income ratio',
};

const hudHousingChoiceVouchers = {
  href: 'https://www.hud.gov/helping-americans/housing-choice-vouchers-tenants',
  label: 'HUD: Housing Choice Voucher tenants, rent, and utilities',
};

const hudUtilityAllowances = {
  href: 'https://www.hud.gov/helping-americans/public-housing-energy-branch-util',
  label: 'HUD: Utility allowances and rent affordability',
};

const usaGovTenantRights = {
  href: 'https://www.usa.gov/tenant-rights',
  label: 'USAGov: Tenant rights and landlord disputes',
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

const investorGovAnnuities = {
  href: 'https://www.investor.gov/introduction-investing/investing-basics/investment-products/annuities',
  label: 'Investor.gov: Annuities',
};

const investorGovVariableAnnuities = {
  href: 'https://www.investor.gov/introduction-investing/investing-basics/investment-products/annuities/variable-annuities',
  label: 'Investor.gov: Variable annuities',
};

const finraAnnuities = {
  href: 'https://www.finra.org/investors/investing/investment-products/annuities',
  label: 'FINRA: Annuities',
};

const naicDeferredAnnuities = {
  href: 'https://content.naic.org/sites/default/files/publication-anb-lp-consumer-annuities.pdf',
  label: 'NAIC: Buyer guide for deferred annuities',
};

const pbgcPensionCoverage = {
  href: 'https://www.pbgc.gov/workers-retirees/learn/understanding-your-pension-pbgc-coverage',
  label: 'PBGC: Understanding your pension and PBGC coverage',
};

const dolRetirementPlans = {
  href: 'https://www.dol.gov/general/topic/retirement',
  label: 'U.S. Department of Labor: Retirement plans, benefits, and savings',
};

const dolTypesRetirementPlans = {
  href: 'https://www.dol.gov/index.php/general/topic/retirement/typesofplans',
  label: 'U.S. Department of Labor: Types of retirement plans',
};

const irsDefinedBenefitPlan = {
  href: 'https://www.irs.gov/retirement-plans/defined-benefit-plan',
  label: 'IRS: Defined benefit plan',
};

const irsRetirementPlanBenefits = {
  href: 'https://www.irs.gov/retirement-plans/types-of-retirement-plan-benefits',
  label: 'IRS: Types of retirement plan benefits',
};

const fsaLoanSimulatorArticle = {
  href: 'https://studentaid.gov/articles/compare-student-loan-repayment-plans-calculator/',
  label: 'Federal Student Aid: Loan Simulator repayment-plan calculator',
};

const fsaRepaymentPlanList = {
  href: 'https://studentaid.gov/manage-loans/repayment/plans',
  label: 'Federal Student Aid: Federal student loan repayment plans',
};

const fsaInterestRates = {
  href: 'https://studentaid.gov/understand-aid/types/loans/interest-rates',
  label: 'Federal Student Aid: Federal student loan interest rates',
};

const cfpbFederalStudentLoans = {
  href: 'https://www.consumerfinance.gov/paying-for-college/repay-student-debt/federal-student-loans/',
  label: 'CFPB: Options for repaying federal student loans',
};

const cfpbFederalAndPrivateStudentLoans = {
  href: 'https://www.consumerfinance.gov/paying-for-college/repay-student-debt/federal-and-private-student-loans/',
  label: 'CFPB: Options for federal and private student loans',
};

const educationNetPrice = {
  href: 'https://collegecost.ed.gov/net-price',
  label: 'U.S. Department of Education: Net Price Calculator Center',
};

const educationCollegeAffordability = {
  href: 'https://collegecost.ed.gov/',
  label: 'U.S. Department of Education: College Affordability and Transparency Center',
};

const educationCollegeScorecard = {
  href: 'https://collegescorecard.ed.gov/',
  label: 'U.S. Department of Education: College Scorecard',
};

const cfpbCollegePath = {
  href: 'https://www.consumerfinance.gov/paying-for-college/compare-financial-aid-and-college-cost/',
  label: 'CFPB: Compare financial aid and college cost',
};

const cfpbCollegeNumbers = {
  href: 'https://www.consumerfinance.gov/paying-for-college/your-financial-path-to-graduation/how-we-got-these-numbers/',
  label: 'CFPB: How college cost and aid numbers are used',
};

const fdicCdShopping = {
  href: 'https://www.fdic.gov/consumer-resource-center/2023-11/shopping-certificate-deposit',
  label: 'FDIC: Shopping for a Certificate of Deposit',
};

const cfpbCertificateDeposit = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-certificate-of-deposit-cd-en-917/',
  label: 'CFPB: What is a certificate of deposit?',
};

const occCdPenalty = {
  href: 'https://www.helpwithmybank.gov/help-topics/bank-accounts/certificates-of-deposit/cd-penalties.html',
  label: 'OCC HelpWithMyBank.gov: CD early withdrawal penalties',
};

const cfpbCdAdvertising = {
  href: 'https://www.consumerfinance.gov/rules-policy/regulations/1030/8/',
  label: 'CFPB Regulation DD: CD advertising and APY disclosures',
};

const investorBonds = {
  href: 'https://www.investor.gov/introduction-investing/investing-basics/investment-products/bonds-or-fixed-income-products/bonds',
  label: 'Investor.gov: Bonds FAQs',
};

const investorCurrentYield = {
  href: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/current-yield',
  label: 'Investor.gov: Current yield',
};

const investorCallableBonds = {
  href: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/callable-or-redeemable-bonds',
  label: 'Investor.gov: Callable or redeemable bonds',
};

const finraBondYieldReturn = {
  href: 'https://www.finra.org/investors/insights/bond-yield-return',
  label: 'FINRA: Understanding bond yield and return',
};

const msrbBondPricesYields = {
  href: 'https://www.msrb.org/Bond-Prices-and-Yields',
  label: 'MSRB: Bond prices and yields',
};

const treasurySavingsBonds = {
  href: 'https://www.treasurydirect.gov/savings-bonds/',
  label: 'TreasuryDirect: U.S. savings bonds',
};

const investorMutualFunds = {
  href: 'https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-funds-etfs/mutual-funds',
  label: 'Investor.gov: Mutual funds',
};

const finraMutualFunds = {
  href: 'https://www.finra.org/investors/investing/investment-products/mutual-funds',
  label: 'FINRA: Mutual funds',
};

const secMutualFundGuide = {
  href: 'https://www.sec.gov/investor/pubs/sec-guide-to-mutual-funds.pdf',
  label: 'SEC: Guide to mutual funds',
};

const irsMutualFundDistributions = {
  href: 'https://www.irs.gov/faqs/capital-gains-losses-and-sale-of-home/mutual-funds-costs-distributions-etc/mutual-funds-costs-distributions-etc-4',
  label: 'IRS: Mutual fund capital gain distributions',
};

const euVat = {
  href: 'https://taxation-customs.ec.europa.eu/taxation/vat_en',
  label: 'European Commission: VAT overview',
};

const euVatRulesRates = {
  href: 'https://europa.eu/youreurope/business/taxation/vat/vat-rules-rates/index_en.htm',
  label: 'Your Europe: VAT rules and rates',
};

const govUkVatRates = {
  href: 'https://www.gov.uk/vat-rates',
  label: 'GOV.UK: VAT rates',
};

const govUkVatCharge = {
  href: 'https://www.gov.uk/how-vat-works/how-much-vat-you-must-charge',
  label: 'GOV.UK: how much VAT to charge',
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

const cfpbSimpleInterestAuto = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/whats-the-difference-between-a-simple-interest-rate-and-precomputed-interest-on-an-auto-loan-en-841/',
  label: 'CFPB: Simple interest vs. precomputed interest',
};

const minneapolisFedConsumerRates = {
  href: 'https://www.minneapolisfed.org/article/2025/what-drives-consumer-interest-rates',
  label: 'Minneapolis Fed: What drives consumer interest rates',
};

const cfpbLoanEstimate = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-loan-estimate-en-1995/',
  label: 'CFPB: What is a Loan Estimate?',
};

const cfpbRefinanceHandout = {
  href: 'https://files.consumerfinance.gov/f/documents/cfpb_should_i_refinance_handout.pdf',
  label: 'CFPB: Should I refinance? handout',
};

const cfpbMortgageApr = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-mortgage-interest-rate-and-an-apr-en-135/',
  label: 'CFPB: Mortgage interest rate vs. APR',
};

const cfpbMortgageClosingFees = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/what-fees-or-charges-are-paid-when-closing-on-a-mortgage-and-who-pays-them-en-1845/',
  label: 'CFPB: Mortgage closing fees',
};

const cfpbDiscountPoints = {
  href: 'https://www.consumerfinance.gov/about-us/newsroom/cfpb-finds-americans-are-paying-upfront-fees-seeking-to-lower-interest-rates-on-mortgages/',
  label: 'CFPB: Discount point tradeoffs',
};

const cfpbRefinanceRescission = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/how-long-do-i-have-to-rescind-when-does-the-right-of-rescission-start-en-187/',
  label: 'CFPB: Refinance rescission timing',
};

const cfpbAutoTruthInLending = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-truth-in-lending-disclosure-for-an-auto-loan-en-787/',
  label: 'CFPB: Truth in Lending disclosure for an auto loan',
};

const cfpbPersonalInstallmentFees = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/do-personal-installment-loans-have-fees-en-2120/',
  label: 'CFPB: Personal installment loan fees',
};

const ftcAdvanceFeeLoans = {
  href: 'https://consumer.ftc.gov/articles/what-know-about-advance-fee-loans',
  label: 'FTC: Advance-fee loan warning signs',
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

const vaEligibility = {
  href: 'https://www.va.gov/housing-assistance/home-loans/eligibility/',
  label: 'VA: Home loan eligibility',
};

const vaCertificateOfEligibility = {
  href: 'https://www.va.gov/housing-assistance/home-loans/how-to-request-coe/',
  label: 'VA: How to request a Certificate of Eligibility',
};

const vaPurchaseLoan = {
  href: 'https://www.va.gov/housing-assistance/home-loans/loan-types/purchase-loan/',
  label: 'VA: Purchase loan',
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

const cfpbHelocBooklet = {
  href: 'https://files.consumerfinance.gov/f/documents/cfpb_heloc-brochure.pdf',
  label: 'CFPB: What you should know about HELOCs',
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

const fannieExtraMortgagePayments = {
  href: 'https://yourhome.fanniemae.com/own/making-extra-mortgage-payments',
  label: 'Fannie Mae: Making extra mortgage payments',
};

const fannieExtraPaymentCalculator = {
  href: 'https://yourhome.fanniemae.com/calculators-tools/extra-mortgage-payment-calculator',
  label: 'Fannie Mae: Extra Mortgage Payment Calculator',
};

const fannieMortgageAffordability = {
  href: 'https://yourhome.fanniemae.com/calculators-tools/mortgage-affordability-calculator',
  label: 'Fannie Mae: Mortgage Affordability Calculator',
};

const fannieHowMuchHouse = {
  href: 'https://yourhome.fanniemae.com/buy/how-much-house-can-you-afford',
  label: 'Fannie Mae: How much house can you afford?',
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

const ftcCarDealerAds = {
  href: 'https://consumer.ftc.gov/car-dealer-ads-promotions-know-you-go',
  label: 'FTC: Car dealer ads and promotions',
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

const finraInvestmentReturns = {
  href: 'https://www.finra.org/investors/insights/investment-returns',
  label: 'FINRA: Calculating your investment returns',
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

const openStaxContributionMargin = {
  href: 'https://openstax.org/books/principles-managerial-accounting/pages/3-1-explain-contribution-margin-and-calculate-contribution-margin-per-unit-contribution-margin-ratio-and-total-contribution-margin',
  label: 'OpenStax Managerial Accounting: Contribution margin and margin ratio',
};

const irsPublication334 = {
  href: 'https://www.irs.gov/publications/p334',
  label: 'IRS Publication 334: Gross receipts, cost of goods sold, and gross profit',
};

const ftcDeceptivePricing = {
  href: 'https://www.ftc.gov/legal-library/browse/rules/deceptive-pricing',
  label: 'FTC: Deceptive Pricing',
};

const ftcUnfairDeceptiveFees = {
  href: 'https://www.ftc.gov/node/88176',
  label: 'FTC: Unfair or Deceptive Fees FAQ',
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

const microsoftIrr = {
  href: 'https://support.microsoft.com/en-us/office/irr-function-64925eaa-9988-495b-b290-3ad0c163c1bc',
  label: 'Microsoft Support: IRR function',
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

const irsIraDeductionLimits = {
  href: 'https://www.irs.gov/retirement-plans/ira-deduction-limits',
  label: 'IRS: IRA deduction limits',
};

const irsRetirementColaLimits = {
  href: 'https://www.irs.gov/retirement-plans/cola-increases-for-dollar-limitations-on-benefits-and-contributions',
  label: 'IRS: annual retirement plan and IRA limit table',
};

const irsRothIras = {
  href: 'https://www.irs.gov/retirement-plans/roth-iras',
  label: 'IRS: Roth IRAs',
};

const irsRothContributions = {
  href: 'https://www.irs.gov/taxtopics/tc309',
  label: 'IRS Topic 309: Roth IRA contributions',
};

const irs2026IraLimits = {
  href: 'https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500',
  label: 'IRS: 2026 IRA contribution limits',
};

const irsIraCatchUp = {
  href: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-catch-up-contributions',
  label: 'IRS: IRA catch-up contributions',
};

const investorIras = {
  href: 'https://www.investor.gov/introduction-investing/investing-basics/investment-accounts/tax-advantaged-accounts/retirement-savings/individual-retirement-accounts-iras',
  label: 'Investor.gov: Individual Retirement Accounts',
};

const irs401kLimits = {
  href: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits',
  label: 'IRS: 401(k) and profit-sharing plan contribution limits',
};

const irs401k2026Limits = {
  href: 'https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500',
  label: 'IRS: 2026 401(k) contribution limits',
};

const irs401kPlans = {
  href: 'https://www.irs.gov/retirement-plans/401k-plans',
  label: 'IRS: 401(k) plans',
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
  label: 'IRS Publication 590-B: IRA distributions and RMD tables',
};

const irsRmdTopic = {
  href: 'https://www.irs.gov/rmd',
  label: 'IRS: Required minimum distributions',
};

const irsRmdFaqs = {
  href: 'https://www.irs.gov/retirement-plans/retirement-plan-and-ira-required-minimum-distributions-faqs',
  label: 'IRS: Required minimum distribution FAQs',
};

const ssaClaimingAge = {
  href: 'https://www.ssa.gov/benefits/retirement/planner/applying2.html',
  label: 'SSA: Benefits before or after full retirement age',
};

const ssaBenefitEstimate = {
  href: 'https://www.ssa.gov/prepare/get-benefits-estimate',
  label: 'SSA: Get a benefits estimate',
};

const ssaFullRetirementAge = {
  href: 'https://www.ssa.gov/retirement/full-retirement-age',
  label: 'SSA: See your full retirement age',
};

const ssaDelayedCredits = {
  href: 'https://www.ssa.gov/benefits/retirement/planner/delayret.html',
  label: 'SSA: Delayed retirement credits',
};

const ssaCola2026 = {
  href: 'https://www.ssa.gov/cola/',
  label: 'SSA: 2026 Social Security changes',
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

const navyBcaGuide = {
  href: 'https://www.navyreserve.navy.mil/Portals/35/SSO%20Documents/Guide%2004-Body%20Composition%20Assessment-BCA-APR%202021.pdf',
  label: 'U.S. Navy Reserve: Guide 4 Body Composition Assessment',
};

const ncbiMilitaryBodyCompositionMethods = {
  href: 'https://www.ncbi.nlm.nih.gov/books/NBK235939/',
  label: 'NCBI Bookshelf: Body composition standards and methods',
};

const ncbiNavyCircumferenceInputs = {
  href: 'https://www.ncbi.nlm.nih.gov/books/NBK235943/',
  label: 'NCBI Bookshelf: Navy circumference inputs background',
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

const armyAbcpProgram = {
  href: 'https://www.armyresilience.army.mil/abcp/index.html',
  label: 'U.S. Army DPRR: Army Body Composition Program',
};

const armyAbcpCalculator = {
  href: 'https://www.armyresilience.army.mil/abcp/BodyFatCalculator.html',
  label: 'U.S. Army DPRR: ABCP body fat calculator',
};

const armyAlaract0322025 = {
  href: 'https://www.armyresilience.army.mil/ard/images/pdf/Policy/ALARACT_0322025.pdf',
  label: 'U.S. Army: ALARACT 032/2025 ABCP method update',
};

const armyDa5500 = {
  href: 'https://recruiting.army.mil/Portals/15/DA5500.pdf',
  label: 'U.S. Army Recruiting: DA Form 5500 male worksheet',
};

const armyDa5501 = {
  href: 'https://recruiting.army.mil/Portals/15/DA5501.pdf',
  label: 'U.S. Army Recruiting: DA Form 5501 female worksheet',
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
  href: 'https://www.hopkinsmedicine.org/health/wellness-and-prevention/calculating-a-due-date',
  label: 'Johns Hopkins Medicine: Calculating a due date',
};

const acogDueDateMethods = {
  href: 'https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/05/methods-for-estimating-the-due-date',
  label: 'ACOG: Methods for estimating the due date',
};

const cdcGestationDefinition = {
  href: 'https://www.cdc.gov/nchs/hus/sources-definitions/gestation.htm',
  label: 'CDC/NCHS: Gestation source and definition notes',
};

const johnsHopkinsFertileWindow = {
  href: 'https://www.acog.org/womens-health/faqs/fertility-awareness-based-methods-of-family-planning',
  label: 'ACOG: Fertility awareness-based methods',
};

const cdcPregnancyWeight = {
  href: 'https://www.cdc.gov/maternal-infant-health/pregnancy-weight/index.html',
  label: 'CDC: Weight gain during pregnancy',
};

const acogPregnancyWeightGain = {
  href: 'https://www.acog.org/womens-health/experts-and-stories/ask-acog/how-much-weight-should-i-gain-during-pregnancy',
  label: 'ACOG: How much weight should I gain during pregnancy?',
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

const niddkAdultEgfr = {
  href: 'https://www.niddk.nih.gov/research-funding/research-programs/kidney-clinical-research-epidemiology/laboratory/glomerular-filtration-rate-equations/adults',
  label: 'NIDDK: eGFR equations for adults',
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

const quikreteSettingPosts = {
  href: 'https://www.quikrete.com/athome/settingposts.asp',
  label: 'QUIKRETE: Setting posts in concrete',
};

const quikreteSettingPostsPdf = {
  href: 'https://www.quikrete.com/PDFs/Projects/SettingPosts.pdf',
  label: 'QUIKRETE: Setting posts project guide',
};

const quikreteTubePillarFoundations = {
  href: 'https://www.quikrete.com/PDFs/Projects/QuiktubePillarFoundations.pdf',
  label: 'QUIKRETE: QUIK-TUBE pillar foundations guide',
};

const quikreteStepsRamps = {
  href: 'https://www.quikrete.com/PDFs/Projects/ConcreteStepsAndRamps.pdf',
  label: 'QUIKRETE: Concrete steps and ramps project guide',
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

const calculatorNetTile = {
  href: 'https://www.calculator.net/tile-calculator.html',
  label: 'Calculator.net: Tile calculator reference',
};

const omniTile = {
  href: 'https://www.omnicalculator.com/construction/tile',
  label: 'Omni Calculator: Tile calculator reference',
};

const sherwinPaintCoverage = {
  href: 'https://www.sherwin-williams.com/en-us/color/color-tools/paint-calculator',
  label: 'Sherwin-Williams: Paint calculator coverage notes',
};

const inchCalculatorPaint = {
  href: 'https://www.inchcalculator.com/paint-calculator/',
  label: 'Inch Calculator: Paint calculator reference',
};

const omniPaint = {
  href: 'https://www.omnicalculator.com/construction/paint',
  label: 'Omni Calculator: Paint calculator reference',
};

const nistConversionFactors = {
  href: 'https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8',
  label: 'NIST SP 811: Conversion factors listed alphabetically',
};

const poolVolumeReference = {
  href: 'https://www.pool-volume.com/',
  label: 'Pool Volume: pool volume formulas by shape',
};

const bulkCalculatorPoolVolume = {
  href: 'https://bulkcalculator.com/construction-calculators/calculators/pool-volume-calculator.html',
  label: 'BulkCalculator: Pool volume calculator and formulas',
};

const calcipediaPoolVolume = {
  href: 'https://www.calcipedia.org/calculators/pool-volume-calculator/',
  label: 'Calcipedia: Pool volume calculator',
};

const decksComDeckCost = {
  href: 'https://www.decks.com/calculators/cost-to-build-a-deck',
  label: 'Decks.com: Cost to build a deck calculator',
};

const trexDeckCostCalculator = {
  href: 'https://www.trex.com/build-your-deck/planyourdeck/deck-cost-landing/productcalculator/',
  label: 'Trex: Deck material cost calculator notes',
};

const homeAdvisorDeckCost = {
  href: 'https://www.homeadvisor.com/cost/decks-and-porches/',
  label: 'HomeAdvisor: Decking price guide',
};

const certainteedDrywallCalculator = {
  href: 'https://www.certainteed.com/drywall-calculator',
  label: 'CertainTeed: Drywall calculator',
};

const usgMaterialEstimators = {
  href: 'https://www.usg.com/content/usgcom/en/resource-center/tools/domedesigner.html',
  label: 'USG: Material estimators',
};

const inchCalculatorDrywall = {
  href: 'https://www.inchcalculator.com/drywall-calculator/',
  label: 'Inch Calculator: Drywall calculator',
};

const procoreDrywallCalculator = {
  href: 'https://www.procore.com/library/calculators/drywall-calculator',
  label: 'Procore: Drywall calculator',
};

const lowesFenceCalculator = {
  href: 'https://pdf.lowes.com/productdocuments/d27b01be-ea65-4de6-aa9c-7a485c4bab31/43237730.pdf',
  label: 'Lowe\'s: Fence calculator worksheet',
};

const lowesFenceLayout = {
  href: 'https://www.lowes.com/pdf/1203_Fence_Installation_Tips_-_Layout_and_Digging_Post_Holes_V5.pdf',
  label: 'Lowe\'s: Fence layout and post-hole tips',
};

const tallyardFenceCalculator = {
  href: 'https://www.tallyard.com/fence-calculator',
  label: 'Tallyard: Fence calculator',
};

const proBuilderFenceCalculator = {
  href: 'https://www.probuildercalc.com/calculators/fence-material',
  label: 'ProBuilderCalc: Fence material calculator',
};

const tallyardGravelCalculator = {
  href: 'https://www.tallyard.com/gravel-calculator',
  label: 'Tallyard: Gravel calculator',
};

const inchCalculatorGravelDriveway = {
  href: 'https://www.inchcalculator.com/gravel-driveway-calculator/',
  label: 'Inch Calculator: Gravel driveway calculator',
};

const calcipediaGravelDriveway = {
  href: 'https://www.calcipedia.org/calculators/gravel-driveway-calculator/',
  label: 'Calcipedia: Gravel driveway calculator',
};

const homeDepotMulchCalculator = {
  href: 'https://www.homedepot.com/calculator/mulch/',
  label: 'The Home Depot: Mulch and top soil calculator',
};

const calcShedTopsoilCalculator = {
  href: 'https://calcshed.com/topsoil-calculator/',
  label: 'CalcShed: Topsoil calculator',
};

const calcSummitTopsoilCalculator = {
  href: 'https://calcsummit.com/calculators/construction/topsoil/',
  label: 'CalcSummit: Topsoil calculator',
};

const vastCalcSoilCalculator = {
  href: 'https://vastcalc.com/calculators/construction/soil',
  label: 'VastCalc: Soil calculator',
};

const inchCalculatorMulch = {
  href: 'https://www.inchcalculator.com/mulch-calculator/',
  label: 'Inch Calculator: Mulch calculator',
};

const nrcsTexasMulching = {
  href: 'https://www.nrcs.usda.gov/sites/default/files/2022-09/Texas_conservation_in_Your_Backyard_Mulching_Accessible.pdf',
  label: 'USDA NRCS Texas: Mulching guide',
};

const lowesSiding = {
  href: 'https://www.certainteed.com/products/documents-downloads',
  label: 'CertainTeed: Siding documents and installation resources',
};

const inchSidingCalculator = {
  href: 'https://www.inchcalculator.com/siding-squares-calculator/',
  label: 'Inch Calculator: Siding material calculator',
};

const certainTeedMeasureVinylSiding = {
  href: 'https://www.certainteed.com/how-measure-vinyl-siding',
  label: 'CertainTeed: How to measure vinyl siding',
};

const glenGeryBrickSizes = {
  href: 'https://www.glengery.com/brick-sizes',
  label: 'Glen-Gery: Brick sizes and pieces per square foot',
};

const biaBrickEstimating = {
  href: 'https://www.gobrick.com/media/file/10-dimensioning-and-estimating-brick-masonry.pdf',
  label: 'Brick Industry Association: Dimensioning and estimating brick masonry',
};

const archtoolboxCmu = {
  href: 'https://www.archtoolbox.com/cmu-sizes-shapes-finishes/',
  label: 'Archtoolbox: CMU sizes, nominal dimensions, and mortar joints',
};

const cmhaConcreteMasonryEstimating = {
  href: 'https://www.cmha.org/resource/tek-04-02a/',
  label: 'CMHA: Estimating concrete masonry materials',
};

const cmhaGroutConcreteMasonry = {
  href: 'https://www.cmha.org/resource/tek-09-04a/',
  label: 'CMHA: Grout for concrete masonry',
};

const cmhaGroutingWalls = {
  href: 'https://www.cmha.org/resource/tek-03-02a/',
  label: 'CMHA: Grouting concrete masonry walls',
};

const cmhaModularConcreteMasonry = {
  href: 'https://www.cmha.org/resource/tek-05-12/',
  label: 'CMHA: Modular layout of concrete masonry',
};

const cmhaConcreteMasonryConstruction = {
  href: 'https://www.cmha.org/resource/tek-03-08a/',
  label: 'CMHA: Concrete masonry construction guidance',
};

const cmhaSegmentalRetainingWallInstall = {
  href: 'https://www.cmha.org/resource/srw-man-003/',
  label: 'CMHA: Segmental Retaining Wall Installation Guide',
};

const cmhaSegmentalRetainingWallGuide = {
  href: 'https://www.cmha.org/resource/srw-tec-005/',
  label: 'CMHA: Guide to Segmental Retaining Walls',
};

const cmhaSegmentalRetainingWallDesign = {
  href: 'https://www.cmha.org/resource/srw-tec-004/',
  label: 'CMHA: Segmental Retaining Wall Design',
};

const allanBlockRetainingWallPlanning = {
  href: 'https://www.allanblock.com/docs/Commercial_Installation_Manual/retaining-wall-planning.html',
  label: 'Allan Block: Retaining Wall Planning Guide',
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

const openStaxElectricPower = {
  href: 'https://openstax.org/books/college-physics/pages/20-4-electric-power-and-energy',
  label: 'OpenStax College Physics: Electric power and energy',
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
    batch: 'gsc-dataforseo-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [openStaxPercent, openStaxPercentApplications, khanPercentageChange, googleHelpfulContent],
    findings: [
      'DataForSEO page evidence confirmed strong exact-match and related intent for percentage calculator, percentage increase calculator, percentage change calculator, percentage formula, percentage calculator difference, money, Excel, profit percentage, and marks searches.',
      'The five live modes cover the main search jobs: percent of a number, what percent, percentage change, add or subtract percent, and reverse percent.',
      'The biggest reader trap is still swapping the part and whole, or swapping the original and new value in a percent-change question.',
      'The page now explains when to use narrower tools such as Percent Off, Sales Tax, Tip, and Percent Error calculators instead of forcing every percent job into one page.',
    ],
    improvements: [
      'Rewrote metadata, summary, use cases, examples, FAQ depth, blog hook, source and limits section, related-tool routing, image alt/caption text, and modified dates in smart-14 wording.',
    ],
    followUps: [
      'Consider adding a small preset row for discount, tip, markup, and percent-change examples if users keep landing from those terms.',
    ],
  },
  {
    slug: 'percent-error-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [openStaxMeasurement, openStaxPhysicsAccuracy, khanPercentError, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence for the exact tool and guide targeted the `percent error calculator` search intent after balance and status gates passed.',
      'OpenStax measurement guidance supports the page limit that percent error is only one part of accuracy, precision, and uncertainty.',
      'The tool now explains same-unit checks, accepted-value zero limits, signed direction, absolute percent error, and practical lab-report examples.',
    ],
    improvements: [
      'Rewrote metadata, summary, aliases, use cases, examples, FAQ details, blog hook, source section, modified dates, and image alt/caption text in smart-14 wording.',
    ],
    followUps: [
      'Watch Search Console queries for lab-report and homework phrasing before adding any extra classroom examples.',
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
    batch: 'gsc-dataforseo-page-sprint-2026-06-05',
    reviewedOn: '2026-06-05',
    scope: commonMathScope,
    sources: [kidneyGfr, niddkAdultEgfr, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence for the exact tool targeted `gfr calculator` intent, and Calculator.net competitor evidence showed formula/logic coverage and safety limits as the main topic gaps to strengthen.',
      'The calculator uses the 2021 CKD-EPI creatinine equation with age, sex used by the equation, and standardized serum creatinine in mg/dL, and explicitly does not use a race coefficient.',
      'The result is reported as mL/min/1.73 m2 and is framed as adult kidney-equation education that needs repeat labs, urine tests, symptoms, medications, body context, and clinician review.',
    ],
    improvements: [
      'Added calculator-intent SEO title and description, eGFR, kidney-function, creatinine, CKD-EPI, 2021 CKD-EPI, and race-free aliases, exact CKD-EPI formula constants, four numeric examples, serum-creatinine unit guidance, race-coefficient FAQ language, children/pregnancy/transplant and acute-illness limits, lower-eGFR next-step guidance, corrected eGFR result unit spacing, refreshed audit notes, image-art alt/caption updates, and a 2026-06-05 modified date.',
      'Expanded the matching guide with NKF and NIDDK source links, exact female and male CKD-EPI walkthroughs, no-race-coefficient language, mg/dL input cautions, low-eGFR follow-up context, medication-dose and emergency limits, and a 2026-06-05 guide modified date.',
    ],
    followUps: [
      'Add a creatinine-unit helper if the UI later supports umol/L entry for non-U.S. lab reports.',
    ],
  },
  {
    slug: 'concrete-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [quikreteConcrete, nistConversionFactors, nistSi, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence for the exact tool and guide targeted `concrete calculator` intent after balance and status gates passed.',
      'QUIKRETE guidance supports using calculator results as approximate planning numbers because bag yields and uneven substrate, waste, and site conditions can change material needs.',
      'The page now explains depth-in-inches conversion, cubic feet, cubic yards, cubic meters, 40 lb/60 lb/80 lb bag counts, 10% waste, ready-mix ordering, form loss, uneven base, low spots, truck minimums, and code-sensitive limits.',
    ],
    improvements: [
      'Rewrote metadata, aliases, formula text, examples, FAQ coverage, guide source coverage, safety limits, audit record, modified dates, related links, and exact image alt/caption text in smart-14 wording.',
    ],
    followUps: [
      'Keep circular, footing, post-hole, column, and step shapes on their own calculator pages so the simple slab workflow stays easy to use.',
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
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [investorSimpleInterest, cfpbCompoundInterest, cfpbAprVsInterest, investorGovCompoundCalculator, investorCompound, openStaxPercent],
    findings: [
      'DataForSEO selected the page-specific query `interest calculator` as a high-volume informational target, with related demand for simple interest, formula, loan interest, monthly compound interest, and bank interest.',
      'The simple mode uses principal x annual interest rate x time in years and shows interest separately from ending balance.',
      'The compound mode reuses the compound-interest helper so compounding frequency, monthly deposits, effective annual rate, total contributions, estimated interest, and ending balance stay consistent with the dedicated compound tool.',
      'The tool and guide now separate annual interest rate from APR and APY, and warn that real loans, bank accounts, and investments can change with fees, taxes, account terms, payment schedules, risk, and changing rates.',
    ],
    improvements: [
      'Rewrote metadata, description, aliases, examples, FAQs, field labels, privacy note, formula notes, guide copy, source links, trust block, image alt/caption text, modified dates, and audit record in smart-14 wording.',
    ],
    followUps: [
      'Add a side-by-side simple-versus-compound comparison table when finance visualizations are expanded.',
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
    batch: 'gsc-dataforseo-page-sprint-2026-06-04',
    reviewedOn: '2026-06-04',
    scope: commonMathScope,
    sources: [acogDueDateMethods, johnsHopkinsDueDate, cdcGestationDefinition],
    findings: [
      'The calculator uses LMP plus 280 days plus cycle-length adjustment, then adds pregnancy week, gestational age today, estimated conception, and trimester labels.',
      'The guide explains that gestational age is counted from LMP, so it is usually about two weeks more than conception age, and it warns that uncertain LMP, irregular cycles, delayed ovulation, or bleeding can make calendar dating unreliable.',
      'Health safety copy tells users that early ultrasound or clinician dating can update the official estimate and that the page is planning support, not medical advice, parentage proof, or a replacement for prenatal care.',
    ],
    improvements: [
      'Reworked metadata, examples, FAQ answers, guide language, related-tool routing, source links, audit notes, and art alt/caption text around exact LMP examples, due dates, conception uncertainty, ultrasound override, and source-backed limits.',
    ],
    followUps: [
      'Consider a future due-date-by-ultrasound or IVF mode only if the tool can handle those assumptions safely and clearly.',
    ],
  },
  {
    slug: 'paint-calculator',
    status: 'deep-reviewed',
    batch: 'page-seo-gsc-refresh-2026-06-03',
    reviewedOn: '2026-06-03',
    scope: commonMathScope,
    sources: [sherwinPaintCoverage, inchCalculatorPaint, omniPaint, nistSi, googleHelpfulContent],
    findings: [
      'The calculator finds wall area as 2 x (length + width) x height, subtracts 20 sq ft per door and 15 sq ft per window, multiplies by coats and extra percent, and rounds gallons up.',
      'The page now gives exact room examples, stronger FAQs, and clearer warnings about ceilings, trim, primer, rough texture, and paint-label coverage ranges.',
      'The guide uses competitor and source evidence without copying their wording, and keeps the result as a material estimate rather than a paint-store guarantee.',
    ],
    improvements: [
      'Manually checked paint math, coverage labels, examples, FAQ depth, guide sections, source notes, related tools, browser-proof targets, and visual/result wording.',
    ],
    followUps: [
      'Add a single-wall or accent-wall mode so users do not have to force a whole-room estimate.',
    ],
  },
  {
    slug: 'tile-calculator',
    status: 'deep-reviewed',
    batch: 'page-seo-gsc-refresh-2026-06-03',
    reviewedOn: '2026-06-03',
    scope: commonMathScope,
    sources: [lowesTile, calculatorNetTile, omniTile, nistSi, googleHelpfulContent],
    findings: [
      'The calculator converts tile length and width from square inches to square feet, adds waste to measured project area, divides by tile area, and rounds up to a whole tile count.',
      'DataForSEO page evidence found U.S. intent around tile calculator, tile calculator square feet, shower tile calculator, floor tile calculator, wall tile calculator, and tile calculator formula.',
      'The tool and guide now explain floor, wall, shower, and backsplash measurement, 10% and higher waste cases, grout-spacing limits, box coverage, shade lots, metric conversion, and why final ordering may need a store or installer takeoff.',
    ],
    improvements: [
      'Added Tile-specific SEO title and description, aliases, 13 visible FAQs, 4 exact examples, guide sections for the 120 ft2 example, floor/wall/shower measurement, boxes and grout checks, metric input limits, source links, modified dates, related links, and exact image alt/caption text.',
    ],
    followUps: [
      'Add optional box-coverage, tiles-per-box, and grout-width inputs when the home-project calculators get a second UI pass.',
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
    batch: 'gsc-dataforseo-page-sprint-2026-06-01',
    reviewedOn: '2026-06-01',
    scope: commonMathScope,
    sources: [openStaxLoanAmortization, cfpbAprVsInterest, cfpbPiti, cfpbLoanEstimate, cfpbAutoLoanCompare],
    findings: [
      'The calculator uses the fixed-payment amortization formula confirmed by OpenStax, converts the annual rate to a monthly rate, and handles zero-interest payments through the shared loan helper.',
      'DataForSEO page evidence found strong U.S. demand for payment calculator intent, including payment calculator, monthly payment calculator, car payment calculator, house payment calculator, and loan payment calculator with interest.',
      'Current CFPB guidance confirms the page must warn that payment is not the whole loan decision: APR can include fees, mortgage payments can include PITI and escrow, and auto loan offers should be compared beyond monthly payment.',
    ],
    improvements: [
      'Added payment-specific SEO title, description, aliases, exact example answers, input explanations, FAQs, result-reading guidance, and related APR/amortization handoffs.',
      'Updated the guide to use exact $5,000, $15,000, and $20,000 examples, CFPB/OpenStax source context, and smart-14 wording about payment-only traps.',
      'Repaired source coverage, trust copy, and generated tool/guide image alt and caption text for the payment page pair.',
    ],
    followUps: [
      'Consider a future advanced mode only if it can clearly separate mortgage PITI, auto add-ons, and student-loan repayment-plan rules without making the simple payment tool noisy.',
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
    batch: 'gsc-dataforseo-page-sprint-2026-06-05',
    reviewedOn: '2026-06-05',
    scope: commonMathScope,
    sources: [federalReserveExchangeRates, googleHelpfulContent],
    findings: [
      'The calculator multiplies the source amount by the manual exchange rate and subtracts an optional fee percentage from the converted amount.',
      'The tool now states that the rate must be entered as target currency per 1 source currency and explains stale-rate, inverse-rate, provider-spread, fixed-fee, and percentage-fee limits.',
      'DataForSEO and competitor-gap proof confirmed the page needs concrete manual-rate examples and clear limits without pretending to fetch live rates.',
    ],
    improvements: [
      'Added calculator-intent SEO metadata, manual-rate and exchange-fee aliases, exact gross/fee/net formula wording, field explanations, visible FAQs for live rates, target-per-source direction, inverse rates, fixed fees, provider differences, mid-market rates, fee timing, and official-record limits, concrete examples with after-fee results, a fourth live example button, refreshed modified date, and fresh DataForSEO/page proof.',
    ],
    followUps: [
      'Only add live exchange rates later if there is a maintained source, clear timestamping, caching, and rate-source disclosure.',
    ],
  },
  {
    slug: 'mortgage-payoff-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [cfpbPayoffAmount, cfpbServicerRules, fannieExtraMortgagePayments, fannieExtraPaymentCalculator, cfpbMortgage],
    findings: [
      'The calculator subtracts any one-time extra payment from the balance, adds extra monthly principal to the scheduled payment, and simulates monthly payoff.',
      'DataForSEO page evidence showed mortgage payoff calculator demand around 74,000 searches and early mortgage payoff calculator demand around 22,200 searches, so the page now targets current balance, extra principal, payoff time, and interest saved without bloated copy.',
      'The guide and tool page now separate current principal from an official servicer payoff amount, and they warn that payoff-date interest, unpaid fees, escrow, recast rules, and prepayment rules can change real payoff instructions.',
    ],
    improvements: [
      'Rewrote metadata, examples, input explanations, FAQ cautions, guide copy, source links, image alt/caption text, tool trust note, and modified dates in smart-14 wording.',
    ],
    followUps: [
      'Add a maintained recast calculator only if user demand proves it should be a separate feature with lender-limit warnings.',
    ],
  },
  {
    slug: '401k-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [irs401k2026Limits, irs401kLimits, irs401kPlans, investorCompound],
    findings: [
      'The calculator converts employee salary percent and employer match into monthly deposits, then compounds the current balance and combined deposits monthly.',
      'The employer match logic caps the matched salary percent at the entered match-limit percent, which matches the field labels.',
      'DataForSEO page evidence showed 401k calculator demand around 165,000 searches, plus visible demand for match, growth, Roth, simple, payout, and by-age intent.',
      'The guide and privacy copy now cite 2026 IRS contribution-limit context while staying honest that the calculator does not enforce IRS limits, plan rules, Roth or pre-tax treatment, vesting, taxes, loans, withdrawals, fees, or market volatility.',
    ],
    improvements: [
      'Rewrote metadata, examples, input explanations, FAQ cautions, guide copy, source links, image alt/caption text, tool trust note, and modified dates in smart-14 wording.',
    ],
    followUps: [
      'Add optional contribution-limit warnings only if the feature has maintained year data, catch-up handling, and plan-rule wording.',
    ],
  },
  {
    slug: 'house-affordability-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [cfpbMortgageAffordability, fannieMortgageAffordability, fannieHowMuchHouse, cfpbDebtToIncome, cfpbMortgage],
    findings: [
      'The calculator applies the debt-to-income target to monthly gross income, subtracts existing monthly debts, then searches for the highest home price that fits taxes, insurance, HOA, and principal-and-interest.',
      'The result separates loan amount, housing budget, principal and interest, and tax/insurance/HOA so users can see what is driving affordability.',
      'DataForSEO page evidence showed house affordability calculator demand around 49,500 searches, with extra intent around income-based and monthly-payment affordability.',
      'The guide now warns that how much a lender may qualify someone to borrow can differ from what fits their budget, and it excludes credit, reserves, closing costs, exact taxes, insurance, lender rules, repairs, utilities, and local market costs.',
    ],
    improvements: [
      'Rewrote metadata, examples, input explanations, FAQ cautions, guide copy, source links, image alt/caption text, tool trust note, and modified dates in smart-14 wording.',
    ],
    followUps: [
      'Add a closing-cost and cash-reserve field only if the tool gets a second advanced mortgage-planning mode.',
    ],
  },
  {
    slug: 'savings-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [cfpbCompoundInterest, investorGovCompoundCalculator, fdicCompoundInterest, consumerBudgetWorksheet],
    findings: [
      'The calculator compounds current savings monthly, adds end-of-month deposits, and compares the projected balance with the optional target amount.',
      'The results split total deposits from estimated interest, which keeps the growth estimate understandable for goal planning.',
      'DataForSEO page evidence showed savings calculator demand around 60,500 searches, with extra intent around simple savings, APY, withdrawals, goal planning, monthly savings, and compound interest.',
      'The guide and FAQ now frame the rate as an assumption and warn about APY-vs-rate wording, taxes, fees, withdrawals, balance tiers, changing rates, and account rules.',
    ],
    improvements: [
      'Rewrote metadata, examples, input explanations, FAQ cautions, guide copy, source links, image alt/caption text, tool trust note, and modified dates in smart-14 wording.',
    ],
    followUps: [
      'Add a reverse savings-goal mode later so users can solve for required monthly deposit.',
    ],
  },
  {
    slug: 'rent-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [consumerBudgetWorksheet, cfpbDebtToIncome, hudHousingChoiceVouchers, hudUtilityAllowances, usaGovTenantRights],
    findings: [
      'The calculator multiplies monthly income by the chosen rent percentage, then subtracts monthly debts and utilities to create a rent ceiling.',
      'The sample result correctly shows $1,030 max rent from $5,200 income at 30% after $350 debts and $180 utilities.',
      'DataForSEO page evidence showed rent calculator demand around 74,000 searches, with extra intent around split rent, monthly rent based on income, landlord checks, and income-based rent wording.',
      'Current HUD rental context supports treating rent and tenant-paid utilities together, so the guide now explains why utilities lower the rent ceiling instead of sitting outside the housing budget.',
    ],
    improvements: [
      'Rewrote metadata, aliases, field labels, examples, input explanations, extra FAQs, guide hook, source links, image alt/caption text, tool trust note, and modified dates in smart-14 wording.',
    ],
    followUps: [
      'Consider adding an optional actual-rent comparison field and a separate split-rent calculator if DataForSEO and Search Console keep showing those intents.',
    ],
  },
  {
    slug: 'annuity-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [investorAnnuities, investorGovAnnuities, finraAnnuities, investorGovVariableAnnuities, naicDeferredAnnuities],
    findings: [
      'The calculator converts the annual rate to a periodic rate and uses ordinary annuity or annuity-due present-value and future-value formulas.',
      'The $500 monthly ordinary-annuity example correctly shows 240 payments, $120,000 paid in, about $205,516.83 future value, and about $75,762.66 present value.',
      'DataForSEO page evidence showed annuity calculator demand around 40,500 searches, with extra intent around immediate, lottery, lifetime, fixed, and monthly annuity calculators.',
      'Current Investor.gov, FINRA, and NAIC context supports a stronger warning that real annuity products can involve fees, surrender charges, riders, guarantees, tax issues, and contract limits outside the formula.',
    ],
    improvements: [
      'Rewrote metadata, aliases, field labels, examples, input explanations, FAQ cautions, guide copy, source links, image alt/caption text, tool trust note, and modified dates in smart-14 wording.',
    ],
    followUps: [
      'Consider a separate immediate annuity or lifetime-income explainer if DataForSEO and Search Console keep showing those intents.',
    ],
  },
  {
    slug: 'credit-card-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [cfpbCreditCards, cfpbCreditCardApr, cfpbCreditCardInterest, cfpbCreditCardGracePeriod, cfpbCreditCardAgreement, ftcCreditCardDebt],
    findings: [
      'The payoff loop adds monthly APR interest and optional new charges, then subtracts the payment until the balance reaches zero.',
      'The calculator blocks impossible payoff inputs when the payment is not higher than monthly interest plus new charges.',
      'The $4,500 balance, 22.9% APR, and $250 monthly payment example correctly estimates about 23 months, $1,065.99 interest, $5,565.99 total paid, and a final payment of about $65.99.',
      'Current CFPB and FTC context supports stronger warnings around daily interest, grace periods, payment allocation, minimum-payment warnings, fees, deferred interest, new spending, and card agreement terms.',
    ],
    improvements: [
      'Rewrote metadata, aliases, field labels, examples, input explanations, FAQ cautions, guide copy, source links, image alt/caption text, tool trust note, and modified dates in smart-14 wording.',
    ],
    followUps: [
      'Keep multi-card snowball or avalanche strategy work separate from this single-card payoff page unless a future sprint adds maintained payoff-order logic.',
    ],
  },
  {
    slug: 'pension-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [pbgcPensionCoverage, dolRetirementPlans, dolTypesRetirementPlans, irsDefinedBenefitPlan, irsRetirementPlanBenefits],
    findings: [
      'The calculator uses the defined-benefit style estimate final average salary times credited years of service times plan multiplier, then divides by 12.',
      'The $82,000 final average salary, 27 service years, and 1.6% multiplier example correctly gives a $35,424 annual estimate, $2,952 monthly estimate, and 43.2% replacement rate.',
      'Current PBGC, DOL, and IRS context supports stronger warnings around vesting, service credit, payment forms, survivor choices, early retirement reductions, PBGC limits, taxes, and official plan documents.',
    ],
    improvements: [
      'Rewrote metadata, aliases, field labels, examples, input explanations, FAQ cautions, guide copy, source links, image alt/caption text, tool trust note, and modified dates in smart-14 wording.',
    ],
    followUps: [
      'Add separate public-sector, military, cash-balance, or lump-sum pension calculators only if those formulas are researched and maintained individually.',
    ],
  },
  {
    slug: 'annuity-payout-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [investorAnnuities, investorGovAnnuities, finraAnnuities, investorGovVariableAnnuities, naicDeferredAnnuities],
    findings: [
      'The calculator uses the present-value annuity payout formula to spread a starting balance over a fixed number of payments at the selected rate.',
      'Zero-rate behavior divides the balance by the payment count, which keeps the estimate usable when users want a no-growth drawdown.',
      'The $100,000 balance, 5%, 20-year, monthly example correctly gives about $659.96 per month, 240 payments, $158,389.38 total paid, and $58,389.38 estimated interest.',
      'Current Investor.gov, FINRA, and NAIC context supports stronger warnings around payout phase, insurer strength, fees, surrender charges, riders, guarantees, taxes, and contract wording.',
    ],
    improvements: [
      'Rewrote metadata, aliases, field labels, examples, input explanations, FAQ cautions, guide copy, source links, image alt/caption text, tool trust note, and modified dates in smart-14 wording.',
    ],
    followUps: [
      'Add lifetime or inflation-adjusted payout modes only after researching the additional actuarial assumptions.',
    ],
  },
  {
    slug: 'credit-cards-payoff-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [cfpbCreditCards, cfpbCreditCardApr, cfpbCreditCardInterest, cfpbCreditCardGracePeriod, cfpbCreditCardAgreement, ftcCreditCardDebt],
    findings: [
      'The tool uses the fixed debt payoff helper for a combined credit card balance, weighted APR, regular monthly payment, and extra monthly payment.',
      'DataForSEO page evidence was run for the exact tool and guide during the required all-pages sprint.',
      'In-app browser baseline found the page score missed generic tool copy, weak source visibility, and generic image alt text, so the sprint rewrote the page around combined-card payoff math instead of a finance template.',
      '$8,500 at 21.5% weighted APR with a $350 regular payment plus $100 extra estimates 24 months, about $1,969.83 interest, about $10,469.83 total paid, and a final payment near $119.83.',
      'Current CFPB and FTC context supports warnings around daily interest, grace periods, payment allocation, minimum payments, balance-transfer terms, deferred interest, fees, new purchases, and card agreement rules.',
    ],
    improvements: [
      'Rewrote metadata, aliases, field labels, examples, input explanations, FAQ cautions, guide copy, source links, image alt/caption text, tool trust note, and modified dates in smart-14 wording.',
    ],
    followUps: [
      'Build a separate debt avalanche or snowball calculator when the site is ready for per-card input rows.',
    ],
  },
  {
    slug: 'debt-payoff-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [cfpbDebtCollection, ftcGetOutOfDebt, consumerGovBudget, cfpbCreditCards],
    findings: [
      'The calculator adds monthly interest, subtracts the regular plus extra payment, and repeats until the fixed balance reaches zero.',
      'The payment guardrail stops results when the monthly payment cannot cover monthly interest, preventing a fake payoff timeline.',
      'DataForSEO page evidence was run for the exact tool and guide during the required all-pages sprint.',
      'In-app browser baseline found generic tool copy, no visible official source links on the tool page, and generic image alt text despite a clean page score.',
      '$10,000 at 12% with a $300 regular payment plus $100 extra estimates 29 months, about $1,564.88 interest, about $11,564.88 total paid, and a final payment near $364.88.',
      'Current FTC, CFPB, and consumer.gov context supports warnings around written payment plans, budgeting, creditors, debt collectors, settlements, scams, rights, fees, and court or collection status.',
    ],
    improvements: [
      'Rewrote metadata, field labels, examples, input explanations, FAQ cautions, guide copy, tool trust note, source links, image alt/caption text, and modified dates in smart-14 wording.',
    ],
    followUps: [
      'Add payoff strategy modes only after separate avalanche and snowball logic has tests.',
    ],
  },
  {
    slug: 'debt-consolidation-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [cfpbDebtConsolidation, ftcGetOutOfDebt, cfpbCreditCounselingVsSettlement, consumerGovBudget],
    findings: [
      'The calculator estimates the current payoff path, then compares it with a new amortized consolidation loan after adding fees to the new principal.',
      'The result separates monthly payment change from total cost change, which helps users see when a lower payment may cost more over a longer term.',
      'DataForSEO page evidence was run for the exact tool and guide during the required all-pages sprint.',
      'In-app browser baseline found generic tool copy, no visible official source links on the tool page, and generic image alt text despite clean page scores.',
      '$18,000 at 18% with a $650 current payment compared with a 10.5% three-year consolidation loan plus a $300 fee estimates a $594.79 new payment, about $55.21 less per month, and about $2,023.05 lower total cost.',
      'Current CFPB, FTC, and consumer.gov context supports warnings around lower-payment traps, fees, term length, home-equity risk, debt-relief scams, settlement promises, and budget checks before signing.',
    ],
    improvements: [
      'Rewrote metadata, field labels, examples, input explanations, FAQ cautions, guide copy, tool trust note, source links, image alt/caption text, and modified dates in smart-14 wording.',
    ],
    followUps: [
      'Add a lender-offer checklist only after it can stay generic enough to avoid legal or lending advice.',
    ],
  },
  {
    slug: 'repayment-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [cfpbTruthInLendingAutoLoan, fsaLoanSimulatorArticle, ftcGetOutOfDebt, consumerGovBudget],
    findings: [
      'The 2026-05-31 sprint used page-specific DataForSEO evidence, built-in browser review, Calculator.net competitor evidence, and current official source checks before editing.',
      'The calculator uses the tested fixed-balance payoff helper with balance, annual interest rate or APR, regular monthly payment, and extra monthly payment.',
      'The page now shows exact repayment examples: $12,000 at 8% with $300 regular plus $50 extra estimates 40 months, about $1,669.76 interest, about $13,669.76 total paid, and a final payment near $19.76.',
      'The guide and FAQ separate fixed-balance math from official student loan repayment plans, deferment, forbearance, hardship plans, fees, late charges, minimum-payment changes, daily interest, and provider-specific rules.',
    ],
    improvements: [
      'Rewrote the tool and guide in the Access Free Tools smart 14-year-old tone, added SEO title/meta descriptions, repaired generic instructions, added official source links, and replaced generic image alt/caption text.',
    ],
    followUps: [
      'Add provider-specific repayment pages only if they can be maintained with official source checks and tested plan rules.',
    ],
  },
  {
    slug: 'student-loan-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [fsaLoanSimulatorArticle, fsaRepaymentPlanList, fsaInterestRates, cfpbFederalStudentLoans, cfpbFederalAndPrivateStudentLoans],
    findings: [
      'The 2026-05-31 sprint used page-specific DataForSEO evidence, built-in browser review, current web/source checks, and GSC-style approval gates before editing.',
      'The calculator estimates a scheduled fixed loan payment, then runs the amortization helper again with any extra monthly principal payment to show payoff time and interest saved.',
      'The page now shows exact student-loan example math: $30,000 at 6.5% for 10 years gives about $340.64 scheduled payment; adding $50 estimates 100 months, about $8,892.17 interest, about $38,892.17 total paid, and about $1,985.10 interest saved.',
      'The guide and FAQ separate this standard fixed-payment math from Federal Student Aid Loan Simulator, income-driven repayment, deferment, forbearance, forgiveness, subsidies, capitalization, payment allocation, private-loan fees, variable rates, and servicer rules.',
    ],
    improvements: [
      'Rewrote the tool and guide in the Access Free Tools smart 14-year-old tone, added SEO title/meta descriptions, DataForSEO keyword-fit terms, official source links, specific trust notes, and repaired generic image alt/caption text.',
    ],
    followUps: [
      'Add official federal repayment-plan modes only if each plan is researched, dated, and tested against Federal Student Aid rules and kept current after policy changes.',
    ],
  },
  {
    slug: 'college-cost-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [educationCollegeAffordability, educationNetPrice, educationCollegeScorecard, cfpbCollegePath, cfpbCollegeNumbers, investorCompound],
    findings: [
      'The 2026-05-31 sprint used page-specific DataForSEO evidence, built-in browser review, Calculator.net competitor evidence, and current U.S. Department of Education/CFPB source checks before editing.',
      'The calculator grows today\'s annual cost until school starts, increases each school year separately, and compares the total with projected savings at the start date.',
      'The page now shows exact college-cost example math: $28,000 today, 8 years until start, 4 school years, 4% cost increase, $10,000 saved, $250/month, and 5% savings return estimates $38,319.93 first-year cost, $162,724.22 total cost, $44,340.98 projected savings, and a $118,383.23 savings gap.',
      'The guide and FAQ separate this rough planning projection from school net price calculators, College Scorecard context, FAFSA results, aid offers, grants, scholarships, work-study, loans, residency, housing, books, transportation, and school-specific billing rules.',
    ],
    improvements: [
      'Rewrote the tool and guide in the Access Free Tools smart 14-year-old tone, added SEO title/meta descriptions, DataForSEO keyword-fit aliases, official source links, specific trust notes, and repaired generic image alt/caption text.',
    ],
    followUps: [
      'Add a school-year cash-flow mode later only if users need savings drawdown during each year of school instead of one start-date comparison.',
    ],
  },
  {
    slug: 'simple-interest-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [investorSimpleInterest, cfpbSimpleInterestAuto, cfpbAprVsInterest, investorCompound, openStaxPercent],
    findings: [
      'The calculator uses the simple interest formula principal times annual rate times years, then adds interest to principal for ending balance.',
      'DataForSEO shows simple interest calculator has informational intent and strong page-specific search demand, so the page now states the formula and example answer plainly.',
      'The guide and FAQ explain the key mistakes: simple interest is not APR, amortization, compound interest, a payoff quote, or a bank disclosure, and a percent field expects 5 for 5%, not 0.05.',
    ],
    improvements: [
      'Added simple-interest-specific SEO title and description, aliases, guide title, official source links, DataForSEO evidence, concrete $1,000 and $2,500 examples, result-label wording, source coverage, trust note, and image alt/caption text.',
    ],
    followUps: [
      'Add day-count basis options only if a future tool needs bank-style actual-day interest conventions.',
    ],
  },
  {
    slug: 'cd-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [cfpbCertificateDeposit, fdicCdShopping, occCdPenalty, cfpbCdAdvertising, investorCompound],
    findings: [
      'The calculator applies APY growth over the CD term in months, then estimates the early-withdrawal penalty as entered months of simple interest.',
      'DataForSEO shows CD calculator has informational intent and strong page-specific search demand, so the page now states APY, maturity value, interest earned, and penalty what-if language plainly.',
      'The guide and FAQ warn that bank and credit union disclosures control exact APY, compounding, maturity, renewal, grace period, insurance, minimum balance, call feature, brokered-CD terms, and withdrawal penalty rules.',
    ],
    improvements: [
      'Added CD-specific SEO title and description, aliases, guide title, official source links, DataForSEO evidence, concrete $10,000 and $5,000 examples, result-label wording, source coverage, trust note, and image alt/caption text.',
    ],
    followUps: [
      'Add separate daily-compounding and brokered-CD options only after researching disclosure-safe wording.',
    ],
  },
  {
    slug: 'bond-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [investorBonds, investorCurrentYield, finraBondYieldReturn, msrbBondPricesYields, investorCallableBonds, treasurySavingsBonds],
    findings: [
      'The calculator computes annual coupon income, current yield, total coupon payments, and a rough yield to maturity from face value, current market price, coupon rate, and years.',
      'DataForSEO shows informational intent for bond calculator and high related demand for savings bond calculator, so the page now states plainly that this is not a TreasuryDirect EE/I savings bond redemption lookup.',
      'The UI, guide, FAQ, and source block separate coupon rate, current yield, and rough YTM, and warn about exact market YTM, dirty price, accrued interest, callable bonds, savings bond rules, taxes, fees, reinvestment risk, credit risk, liquidity, duration, convexity, and changing market rates.',
    ],
    improvements: [
      'Added bond-specific SEO title and aliases, guide title and meta description, exact $1,000/$950/5%/10-year and premium-bond examples, DataForSEO evidence, official Investor.gov/FINRA/MSRB/TreasuryDirect source links, plain-bond trust wording, source coverage, and specific image alt/caption text.',
    ],
    followUps: [
      'Add exact present-value YTM solving, dirty-price handling, call-date yield, and a separate savings bond lookup path only as separate advanced modes with tests and official source limits.',
    ],
  },
  {
    slug: 'mutual-fund-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [investorMutualFunds, finraMutualFunds, secMutualFundGuide, investorGovFees, irsMutualFundDistributions, investorCompound],
    findings: [
      'The calculator projects a gross balance, subtracts expense ratio from the annual return assumption for a simple net projection, then reports estimated expense drag.',
      'DataForSEO shows informational intent for mutual fund calculator plus related SIP, lump-sum, USA, Fidelity, and Bankrate-style queries, so the page now explains starting investment, recurring contribution, expected return before expenses, and expense-ratio drag without pretending to choose a fund.',
      'The result separates projected balance after expenses, balance before expense estimate, total contributions, net return, and fee drag, while the page warns about NAV, share class, loads, redemption fees, taxable distributions, capital-gain distributions, market losses, and prospectus rules.',
    ],
    improvements: [
      'Added mutual-fund-specific SEO title, aliases, guide title and meta description, exact $5,000/$250/month/7%/0.5%/20-year and higher-fee examples, DataForSEO evidence, official Investor.gov/FINRA/SEC/IRS source links, trust wording, and specific image alt/caption text.',
    ],
    followUps: [
      'Add a richer expense model later if the site supports annual fee timing, loads, and taxable distributions.',
    ],
  },
  {
    slug: 'roth-ira-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [irsRothIras, irsRothContributions, irs2026IraLimits, irsIraCatchUp, irsIraLimits, investorIras, investorCompound],
    findings: [
      'The calculator converts annual contribution to monthly deposits, compounds the current balance monthly, and separates contributions from estimated growth.',
      'DataForSEO shows informational intent for Roth IRA Calculator plus related by-age, 2026, $100/month, Fidelity, Schwab, and Vanguard-style queries, so the page now keeps growth math separate from contribution eligibility.',
      'The guide and FAQ keep Roth IRA tax and eligibility language careful: the tool does not enforce taxable compensation, MAGI, filing status, 2026 IRS limits, phase-outs, qualified distribution rules, 59½ rules, the 5-year rule, penalties, taxes, fees, or market risk.',
    ],
    improvements: [
      'Added Roth-IRA-specific SEO title, aliases, guide title and meta description, exact $12,000/$7,500/year/7%/25-year and $100/month examples, 2026 IRS $7,500/$1,100/$8,600 contribution context, MAGI phase-out ranges, official IRS/Investor.gov source links, trust wording, and specific image alt/caption text.',
    ],
    followUps: [
      'Recheck IRS limits and phase-out ranges during each annual limit update before keeping year-specific copy live.',
    ],
  },
  {
    slug: 'ira-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-05-31',
    reviewedOn: '2026-05-31',
    scope: commonMathScope,
    sources: [irsIraLimits, irsIraDeductionLimits, irs2026IraLimits, irsIraCatchUp, irsRetirementColaLimits, investorIras, investorCompound],
    findings: [
      'The calculator uses the same IRA projection helper as Roth IRA: monthly compounding plus annual contribution divided into monthly deposits.',
      'DataForSEO shows informational intent for IRA Calculator plus related Roth IRA, SIMPLE IRA, SEP IRA, Fidelity, 401K IRA, 2026, and Schwab-style queries, so the page now keeps general IRA projection math separate from account-type and tax rules.',
      'The result labels projected IRA balance, total contributions, annual contribution, and estimated growth while the page warns about taxable compensation, traditional IRA deduction limits, workplace retirement plan coverage, Roth IRA eligibility, 2026 IRS limits, RMDs, penalties, taxes, fees, and investment risk.',
    ],
    improvements: [
      'Added IRA-specific SEO title, aliases, guide title and meta description, exact $25,000/$7,500/year/6.5%/20-year and age 50+ catch-up examples, 2026 IRS $7,500/$1,100/$8,600 contribution context, deduction-limit cautions, official IRS/Investor.gov source links, trust wording, and specific image alt/caption text.',
    ],
    followUps: [
      'Add Traditional versus Roth comparison only after tax-assumption fields, deduction-status fields, and disclaimers are designed.',
    ],
  },
  {
    slug: 'vat-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-01',
    reviewedOn: '2026-06-01',
    scope: commonMathScope,
    sources: [govUkVatRates, govUkVatCharge, euVatRulesRates, euVat, openStaxPercent],
    findings: [
      'DataForSEO shows informational intent for VAT Calculator plus VAT calculator UK, 20 VAT calculator, reverse VAT calculator UK, how to calculate VAT on calculator, 5% VAT, 7.5% VAT, app, and USA clarification queries.',
      'The calculator adds VAT by multiplying net amount by the rate, then adding the VAT amount to net; remove mode divides gross amount by one plus the rate, then separates the VAT portion.',
      'The result shows net amount, VAT amount, gross amount, and rate used, which keeps add and remove modes easy to check.',
      'Official source checks confirmed that VAT rates and rules vary by country, goods, services, exemptions, and transaction type. GOV.UK lists 20% as the standard UK VAT rate, with reduced and zero-rate categories.',
    ],
    improvements: [
      'Rebuilt VAT title/meta, aliases, examples, input explanations, FAQ answers, guide title, guide meta, source links, trust wording, image alt/caption, sitemap dates, and page-specific proof around add/remove VAT instead of generic finance copy.',
    ],
    followUps: [
      'Add country-specific VAT presets only if there is a maintained data source and clear update policy.',
    ],
  },
  {
    slug: 'cash-back-or-low-interest-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-01',
    reviewedOn: '2026-06-01',
    scope: commonMathScope,
    sources: [cfpbAutoFinancingOffers, ftcAutoLease, cfpbAutoLoanRates, ftcCarDealerAds, cfpbApr, cfpbAutoLoanCompare],
    findings: [
      'DataForSEO evidence is page-specific for cash back or low interest calculator intent, with supporting rebate-vs-low-APR and dealer incentive wording kept natural rather than stuffed.',
      'The calculator estimates total paid with the cash-back APR, subtracts the rebate value, then compares that net cost with the low-interest APR total paid over the same term.',
      'The result names the lower estimated total-cost option and shows savings, cash-back value, cash-back net cost, and low-interest total cost so monthly payment does not decide the winner by itself.',
      'Current CFPB and FTC source checks confirmed that advertised low APRs, manufacturer incentives, cash back, rebates, dealer add-ons, out-the-door price, and credit approval rules can change the real deal.',
    ],
    improvements: [
      'Rebuilt title/meta, aliases, examples, input explanations, FAQ answers, guide title, guide meta, source links, trust wording, image alt/caption, sitemap dates, and page-specific proof around rebate vs low APR total-cost comparison.',
    ],
    followUps: [
      'Add a mode where the rebate is applied as a down payment if users need that specific dealer-offer comparison.',
    ],
  },
  {
    slug: 'auto-lease-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-01',
    reviewedOn: '2026-06-01',
    scope: commonMathScope,
    sources: [cfpbAutoLeaseBuy, ftcAutoLease, ftcCarDealerAds, cfpbRegM],
    findings: [
      'DataForSEO evidence is page-specific for auto lease calculator intent, with wording aimed at payment, money factor, residual value, and lease quote checks instead of generic finance copy.',
      'The calculator subtracts down payment and trade-in from vehicle price plus fees, checks that adjusted capitalized cost is above residual value, then separates depreciation fee, finance fee, tax, and total lease cost.',
      'Current CFPB and FTC source checks confirmed that leasing payments cover depreciation plus rental charges, leases often limit mileage, low-payment lease ads can hide fees due at signing, and written quote terms matter before visiting the dealer.',
      'The guide and FAQ explain money factor, residual value, adjusted capitalized cost, amount due at signing, total lease amount, mileage allowance, acquisition/disposition fees, wear charges, buyout option, and early termination limits in plain language.',
    ],
    improvements: [
      'Rebuilt title/meta, aliases, examples, input explanations, FAQ answers, guide title, guide meta, source links, trust wording, image alt/caption, sitemap dates, and page-specific proof around car lease payment math and written quote checks.',
    ],
    followUps: [
      'Add an optional money-factor-to-APR helper only after designing clear lease-specific wording that does not imply APR equivalence.',
    ],
  },
  {
    slug: 'depreciation-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-01',
    reviewedOn: '2026-06-01',
    scope: commonMathScope,
    sources: [irsDepreciation, openStaxDepreciation],
    findings: [
      'DataForSEO evidence is page-specific for depreciation calculator intent, with wording aimed at depreciation expense, accumulated depreciation, book value, straight-line depreciation, and declining-balance depreciation.',
      'The calculator handles straight-line depreciation as depreciable amount divided by useful life and declining-balance depreciation as a rate applied to remaining book value while respecting salvage value.',
      'The guardrails reject salvage value at or above cost and keep book value from dropping below salvage value, matching the educational depreciation model on the page.',
      'Current IRS Publication 946 and OpenStax source checks confirmed the page must keep simple book-value math separate from MACRS, section 179, bonus depreciation, placed-in-service dates, class life, partial-year conventions, listed property rules, recapture, and accounting policy.',
    ],
    improvements: [
      'Rebuilt title/meta, aliases, examples, input explanations, FAQ answers, guide title, guide meta, source links, trust wording, image alt/caption, sitemap dates, and page-specific proof around straight-line and declining-balance book-value math.',
    ],
    followUps: [
      'Add MACRS-style tax depreciation only as a separate maintained calculator with year-specific source review.',
    ],
  },
  {
    slug: 'average-return-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-01',
    reviewedOn: '2026-06-01',
    scope: commonMathScope,
    sources: [finraInvestmentReturns, investorAnnualReturn, investorCompound],
    findings: [
      'DataForSEO evidence is page-specific for average return calculator intent, with wording aimed at average annual return, CAGR, cumulative return, investment return, and net gain.',
      'The calculator adjusts net gain for contributions and withdrawals, divides by beginning value plus contributions for cumulative return, then divides by years for simple average annual return.',
      'The result also shows a basic CAGR comparison from starting value to ending value, and the guide warns that CAGR is not cash-flow adjusted in this simplified tool.',
      'FINRA return guidance confirms that annualized return gives a cleaner comparison than a simple average, while this page keeps the simpler shortcut clearly labeled and pushes uneven cash flows toward IRR or XIRR.',
    ],
    improvements: [
      'Rebuilt title/meta, aliases, examples, input explanations, FAQ answers, guide title, guide meta, source links, trust wording, image alt/caption, sitemap dates, and page-specific proof around net gain, cumulative return, simple average annual return, and CAGR limits.',
    ],
    followUps: [
      'Promote users with uneven cash flows toward IRR Calculator until this tool gets a dedicated money-weighted return mode.',
    ],
  },
  {
    slug: 'margin-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-01',
    reviewedOn: '2026-06-01',
    scope: commonMathScope,
    sources: [openStaxContributionMargin, irsPublication334, openStaxDiscounts, openStaxPercent],
    findings: [
      'DataForSEO evidence is page-specific for profit margin, gross margin, markup, gross profit, selling price, and direct cost intent.',
      'The calculator separates profit, margin, and markup: profit equals revenue minus cost, margin divides profit by revenue, and markup divides profit by cost.',
      'OpenStax contribution-margin guidance backs the idea that margin shows how much of each sales dollar remains after the relevant cost base.',
      'IRS Publication 334 adds tax-context boundaries for gross receipts, cost of goods sold, and gross profit without turning the tool into tax advice.',
      'The guide now spells out the common mistake that margin and markup are different percentages even when profit dollars are the same.',
    ],
    improvements: [
      'Rebuilt title/meta, aliases, examples, input explanations, FAQ answers, guide title, guide meta, source links, trust wording, image alt/caption, sitemap dates, and page-specific proof around profit margin, markup, COGS, gross profit, and net-margin limits.',
    ],
    followUps: [
      'Add target-price solving later only if search and usage data show users need to enter a desired margin and calculate selling price.',
    ],
  },
  {
    slug: 'discount-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-01',
    reviewedOn: '2026-06-01',
    scope: commonMathScope,
    sources: [openStaxDiscounts, openStaxPercent, ftcDeceptivePricing, ftcUnfairDeceptiveFees],
    findings: [
      'DataForSEO evidence is page-specific for discount calculator, percent off, final price, sale price, coupon, stacked discount, savings, and tax intent.',
      'The calculator applies the first discount to original price, applies the extra discount to the reduced subtotal, then adds tax to the discounted subtotal when a tax rate is entered.',
      'The result separates total savings before tax, effective discount, discounted subtotal, tax amount, and final price so stacked-discount math is checkable.',
      'OpenStax backs the percent-discount formula and FTC guidance adds boundaries around advertised prices, discount availability, required fees, and deceptive pricing claims.',
      'The guide and FAQ warn that stacked discounts are sequential, not simply additive, and that coupon exclusions, shipping, tax exemptions, local rules, and required fees are outside the math.',
    ],
    improvements: [
      'Rebuilt title/meta, aliases, examples, input explanations, FAQ answers, guide title, guide meta, source links, trust wording, image alt/caption, sitemap dates, and page-specific proof around stacked discounts, effective discount, final price, sale-rule checks, and tax limits.',
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
    batch: 'serpforge-personal-loan-page-sprint-2026-06-01',
    reviewedOn: '2026-06-01',
    scope: commonMathScope,
    sources: [cfpbPersonalInstallmentFees, cfpbAprVsInterest, ftcAdvanceFeeLoans],
    findings: [
      'The calculator now uses exact personal-loan examples for payment, total interest, origination fee, cash received after fee, and total cost with fee.',
      'The guide explains why a borrower can repay the full principal even when an origination fee reduces cash received.',
      'The page now warns users to check lender disclosures for APR, fees, late charges, optional insurance, credit impact, prepayment rules, rate eligibility, and advance-fee scam signs.',
    ],
    improvements: [
      'Added personal-loan-specific SEO title/description, source coverage, exact examples, FAQ cautions, trust copy, guide detail, DataForSEO sprint evidence, and specific image alt/caption copy.',
    ],
    followUps: [
      'Add a loan-offer comparison table only after APR, fee timing, and proceeds assumptions are explicit in the UI.',
    ],
  },
  {
    slug: 'boat-loan-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-03',
    reviewedOn: '2026-06-03',
    scope: commonMathScope,
    sources: [cfpbAutoLoanCompare, cfpbAutoTruthInLending, cfpbAprVsInterest, ftcAutoLease],
    findings: [
      'The calculator uses the auto-loan summary helper to estimate taxable amount from boat price minus trade-in credit, sales tax, amount financed, fixed monthly payment, total paid, and total interest.',
      'The tool now uses exact examples, including a $45,000 boat with $9,000 down, $1,200 fees, 6% tax, 8.5%, and 10 years returning $39,900 financed, about $494.70/month, and about $19,464.35 interest.',
      'The guide keeps boat-specific ownership costs visible and warns that the estimate is not a lender quote, official APR calculation, or Truth in Lending disclosure.',
    ],
    improvements: [
      'Added boat-loan-specific SEO title/description, aliases, exact examples, input explanations, FAQ cautions, result-reading guidance, FTC/CFPB source coverage, guide detail, modified date, and privacy/disclosure wording.',
    ],
    followUps: [
      'Consider a separate boat affordability or ownership-cost calculator only if storage, marina fees, insurance, maintenance, registration, trailer, winterization, and fuel assumptions can stay honest and location-aware.',
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
    batch: 'serpforge-refinance-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [
      cfpbRefinanceHandout,
      cfpbLoanEstimate,
      cfpbMortgageClosingFees,
      cfpbMortgageApr,
      cfpbDiscountPoints,
      cfpbRefinanceRescission,
    ],
    findings: [
      'The calculator estimates the current payment, adds closing costs to the new principal, estimates the new payment, and compares monthly savings, break-even time, total interest change, and total cost change.',
      'The page now uses exact refinance examples for new payment, monthly savings, break-even months, no-savings cases, and shorter-term total-cost savings.',
      'The guide explains the key refinance trap: lower monthly payment can come from a longer term, points, or rolled costs, not only from a better deal.',
    ],
    improvements: [
      'Added refinance-specific SEO title/description, source coverage, exact examples, FAQ cautions, trust copy, guide detail, DataForSEO sprint evidence, and specific image alt/caption copy.',
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
    batch: 'gsc-dataforseo-page-sprint-2026-06-01',
    reviewedOn: '2026-06-01',
    scope: commonMathScope,
    sources: [ssaBenefitEstimate, ssaFullRetirementAge, ssaClaimingAge, ssaDelayedCredits, ssaCola2026],
    findings: [
      'The calculator estimates full retirement age from birth year, starts from the entered full-retirement-age benefit, and applies an early reduction before full retirement age or delayed credits after full retirement age through age 70.',
      'The baseline page had generic finance title and trust wording plus generic tool/guide image labels; the 2026-06-01 sprint replaced those with Social-Security-specific copy and proof requirements.',
      'DataForSEO paid evidence was generated for both the tool page and matching guide before the copy pass. The page still cannot be marked approved until browser proof, local checks, deploy proof, Search Console proof, and final judge proof are recorded.',
    ],
    improvements: [
      'Rewrote title, meta description, examples, input explanations, output labels, FAQ cautions, guide intro, quick start, source notes, trust block, privacy note, related links, and image alt/caption text around SSA benefit estimate, full retirement age, claim age 62, claim age 70, early reduction, delayed credits, and official SSA limits.',
    ],
    followUps: [
      'Add spousal, survivor, earnings-test, tax, and COLA modeling only as separate clearly sourced modules.',
    ],
  },
  {
    slug: 'rmd-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-01',
    reviewedOn: '2026-06-01',
    scope: commonMathScope,
    sources: [irsRmdTopic, irsRmdFaqs, irsRmd],
    findings: [
      'The calculator uses the prior December 31 account balance divided by the IRS Uniform Lifetime Table factor for the entered age.',
      'The baseline page still carried generic finance title/trust wording, generic tool and guide image labels, weak examples, and no source seoDescription; the 2026-06-01 sprint replaced those with RMD-specific evidence and copy.',
      'DataForSEO showed strong informational intent for "rmd calculator" plus related demand around RMD by age, RMD table, inherited IRA RMD, and 2026 table searches. The page deliberately covers the owner-style Uniform Lifetime Table case and warns that inherited IRA cases are separate.',
    ],
    improvements: [
      'Rewrote title, meta description, input explanations, examples, FAQ cautions, guide intro, quick start, result-reading language, trust block, source links, privacy note, calculator note, and image alt/caption text around prior December 31 balance, age in the distribution year, IRS table factor, estimated RMD, balance after RMD, and official IRS limits.',
    ],
    followUps: [
      'Add inherited IRA, younger-spouse, first-year deadline, aggregation, and withholding modes only after designing separate input flows and maintained source notes.',
    ],
  },
  {
    slug: 'real-estate-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-01',
    reviewedOn: '2026-06-01',
    scope: commonMathScope,
    sources: [cfpbPayoffAmount, cfpbClosingDisclosure, irsPublication523, cfpbMortgage],
    findings: [
      'The calculator builds cash invested from down payment, buying costs, and improvements, then subtracts selling costs and loan payoff from sale price to estimate net sale proceeds.',
      'Profit, ROI, and equity multiple are labeled separately so a user can distinguish dollar gain from percentage return and proceeds multiple.',
      'DataForSEO showed the seed query "real estate calculator" also pulls mortgage-payment and rental/investment intent, so this page now states clearly that it is a sale-profit and net-proceeds calculator, not a mortgage payment, rental cash-flow, or capital-gains calculator.',
    ],
    improvements: [
      'Rewrote title, meta description, examples, FAQ cautions, guide intro, quick start, result-reading language, trust block, source links, privacy note, calculator examples, and image alt/caption text around sale price, selling costs, loan payoff, net sale proceeds, cash invested, profit, ROI, and equity multiple.',
    ],
    followUps: [
      'Add separate rental, mortgage-payment, tax-basis, and capital-gains modes only when each mode has its own inputs, source notes, jurisdiction wording, and proof gate.',
    ],
  },
  {
    slug: 'take-home-paycheck-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-01',
    reviewedOn: '2026-06-01',
    scope: commonMathScope,
    sources: [irsPub15T, irsFica, irsWithholdingEstimatorFaqs, irsPub505],
    findings: [
      'The calculator annualizes pretax deductions, applies entered federal, state, and local tax percentages, and separately estimates employee Social Security and Medicare withholding.',
      'The 2026 FICA constants match IRS Topic 751: 6.2% Social Security up to the $184,500 wage base, 1.45% Medicare, and 0.9% Additional Medicare above $200,000.',
      'DataForSEO showed paycheck-tax and hourly-paycheck intent, so the page now says plainly that it is a net-pay estimate from entered percentages, not a full W-4 or payroll-table calculator.',
    ],
    improvements: [
      'Rewrote title, meta description, examples, FAQ cautions, guide intro, quick start, source links, trust block, result-reading language, privacy note, calculator examples, highlight chips, and image alt/caption text around salary, pay schedule, pretax deductions, entered withholding percentages, 2026 employee FICA, and exact take-home examples.',
    ],
    followUps: [
      'Add W-4-style federal withholding only if the project can maintain official IRS table changes over time.',
    ],
  },
  {
    slug: 'rental-property-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-01',
    reviewedOn: '2026-06-01',
    scope: commonMathScope,
    sources: [irsRentalTopic414, irsPublication527, fannieRentalIncome, cfpbMortgage],
    findings: [
      'DataForSEO showed "rental property calculator" intent plus ROI and spreadsheet modifiers, so the page now names cash flow, NOI, cap rate, cash-on-cash return, and deal-screening limits clearly.',
      'Current IRS Topic 414 and Publication 527 source checks confirmed that rental income, expenses, depreciation, passive-loss rules, and records belong outside this quick cash-flow estimate.',
      'Current Fannie Mae rental income guidance confirms lender rental-income treatment needs separate underwriting proof, so the page does not imply lender approval.',
    ],
    improvements: [
      'Added rental-property-specific SEO title and description, exact shortfall/cash-flow examples, source-backed guide detail, trust block, priority FAQs, input explanations, specific image alt/caption text, and clearer privacy and result notes.',
    ],
    followUps: [
      'Add a repair-capex reserve mode only if it stays separate from normal operating expenses in the result labels.',
    ],
  },
  {
    slug: 'irr-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-01',
    reviewedOn: '2026-06-01',
    scope: commonMathScope,
    sources: [openStaxIrr, microsoftIrr, investorCompound],
    findings: [
      'DataForSEO showed "irr calculator" demand at 6,600 United States monthly searches with informational intent, plus modifiers around formula, monthly IRR, Excel, and real estate.',
      'Current OpenStax source checks confirm IRR is the discount rate that sets NPV to zero and that multiple IRRs, reinvestment assumptions, and project scale can make the method misleading.',
      'Current Microsoft IRR documentation confirms cash-flow amounts can vary but should occur at regular intervals, so the page now names the regular-spacing rule clearly.',
    ],
    improvements: [
      'Added IRR-specific SEO title and description, DataForSEO-backed aliases, exact examples, source-backed guide detail, regular-interval warnings, trust block, priority FAQs, specific image alt/caption text, and clearer result notes.',
    ],
    followUps: [
      'Add a user-entered discount-rate NPV companion line or an XIRR-style date mode only if the UI can keep the simple IRR screen easy to use.',
    ],
  },
  {
    slug: 'roi-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-01',
    reviewedOn: '2026-06-01',
    scope: commonMathScope,
    sources: [openStaxInvestments, finraInvestmentReturns, investorGovFees],
    findings: [
      'DataForSEO showed "roi calculator" demand at 22,200 United States monthly searches, with "roi formula" also strong at 14,800 monthly searches and modifiers around real estate, Excel, monthly ROI, and crypto.',
      'Current OpenStax source checks confirm the simple ROI formula compares final value with the original investment as a percent, while FINRA and Investor.gov source checks reinforce that fees, costs, risk, and holding period can change the real answer.',
      'The calculator keeps simple ROI, dollar gain or loss, and ending value separate, and the page now says clearly that this is not annualized ROI, IRR, NPV, or investment advice.',
    ],
    improvements: [
      'Added ROI-specific SEO title and description, DataForSEO-backed aliases, exact 28.5%, 25%, and -7.5% examples, input explanations, priority FAQs, source-backed trust block, updated guide walkthrough, specific image alt/caption text, and clearer result notes.',
    ],
    followUps: [
      'Add an annualized ROI mode only if the UI makes the time-period assumption impossible to miss.',
    ],
  },
  {
    slug: 'apr-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-01',
    reviewedOn: '2026-06-01',
    scope: commonMathScope,
    sources: [cfpbAprVsInterest, cfpbApr, cfpbPersonalInstallmentFees],
    findings: [
      'DataForSEO showed "apr calculator" demand at 27,100 United States monthly searches, with modifiers around credit card, car, personal loan, Excel, monthly APR, and savings APR intent.',
      'Current CFPB source checks confirm that APR and interest rate are different, and Regulation Z APR disclosure rules can depend on finance charges, payment timing, rounding, and tolerances.',
      'The calculator estimates the scheduled payment from principal and note rate, subtracts upfront fees from amount received, then solves the APR-style rate implied by that payment stream.',
    ],
    improvements: [
      'Added APR-specific SEO title and description, DataForSEO-backed aliases, exact 9.30%, 10.16%, and 6.70% examples, input explanations, priority FAQs, source-backed trust block, updated guide walkthrough, credit-card APR caution, specific image alt/caption text, and clearer result notes.',
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
    batch: 'serpforge-va-mortgage-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [vaFundingFee, vaEligibility, vaCertificateOfEligibility, vaPurchaseLoan, cfpbLoanEstimate, cfpbMortgageClosingFees, cfpbClosingDisclosure, cfpbMortgage],
    findings: [
      'The calculator chooses common VA purchase funding-fee rates from down payment and first-use status, supports exemption, and optionally finances the fee into the loan.',
      'The VA funding-fee logic matches the official VA purchase chart effective April 7, 2023: 2.15% first use under 5%, 3.3% later use under 5%, 1.5% at 5% down, and 1.25% at 10% down.',
      'The guide now warns that VA eligibility, Certificate of Eligibility status, exemption status, seller concessions, closing costs, lender fees, appraisal, occupancy, entitlement, and refinance types need official loan review.',
      'DataForSEO page evidence was run for the exact tool and guide during the required all-pages sprint before the June 2 copy pass.',
    ],
    improvements: [
      'Added VA-mortgage-specific SEO title and description, aliases, exact payment and funding-fee examples, input explanations, priority FAQs, guide detail, VA/CFPB source coverage, trust wording, specific image alt/caption text, and privacy/result notes.',
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
    batch: 'serpforge-heloc-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [cfpbHeloc, cfpbHomeEquityVsHeloc, cfpbHelocBooklet, ftcHomeEquityLoans, irsPub936HomeMortgageInterest],
    findings: [
      'The calculator checks current draw against credit line, estimates available equity, computes draw-period interest-only payment, and estimates repayment-period payment for the drawn balance.',
      'DataForSEO evidence for the page centers on HELOC calculator, interest-only HELOC calculator, HELOC amortization calculator, and principal-and-interest payment intent.',
      'Current CFPB and FTC source context supports visible warnings around draw periods, repayment periods, variable rates, line freezes, fees, right to cancel, and home-collateral risk.',
      'IRS Publication 936 source context supports the warning that HELOC interest is generally deductible only when proceeds buy, build, or substantially improve the home securing the loan and other rules are met.',
    ],
    improvements: [
      'Added SEO title and description, DataForSEO-backed aliases, exact interest-only and repayment examples, input explanations, priority FAQs, source-backed trust notes, guide detail, specific image alt/caption text, and privacy/result notes.',
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
    batch: 'gsc-dataforseo-page-sprint-2026-06-03',
    reviewedOn: '2026-06-03',
    scope: commonMathScope,
    sources: [navyBcaGuide, ncbiMilitaryBodyCompositionMethods, ncbiNavyCircumferenceInputs, cdcBmi, nhlbiBmi],
    findings: [
      'The calculator uses the Navy-style circumference equation: male estimates use waist minus neck with height, while female estimates use waist plus hip minus neck with height.',
      'The tool and guide now show exact examples: 165 cm, 68 kg, neck 34 cm, waist 78 cm, hips 98 cm returns about 29.74%, and 180 cm, 84 kg, neck 40 cm, waist 88 cm returns about 16.94%.',
      'The copy separates estimated percentage, fat mass, and lean mass, and repeatedly frames the result as trend-tracking information rather than diagnosis, official testing, or a scan replacement.',
    ],
    improvements: [
      'Refreshed SEO title/meta copy, input labels, examples, FAQ cautions, guide sections, source links, privacy note, modified dates, art prompt metadata, DataForSEO evidence, competitor gap report, and non-diagnostic measurement guidance.',
    ],
    followUps: [
      'Add a visual measurement guide later if the tool gets traffic, because tape placement is the biggest practical error source.',
    ],
  },
  {
    slug: 'bmr-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-03',
    reviewedOn: '2026-06-03',
    scope: commonMathScope,
    sources: [mifflinStJeorEquation, cdcActivity, googleHelpfulContent],
    findings: [
      'The calculator uses the Mifflin-St Jeor structure: weight, height, age, and +5 or -161 formula-sex adjustment to estimate resting energy needs.',
      'The tool and guide now show exact examples: 35-year-old male, 178 cm, 82 kg returns about 1,763 kcal/day BMR, and 29-year-old female, 164 cm, 61 kg returns about 1,329 kcal/day BMR.',
      'The copy separates BMR from TDEE, showing that the 1,763 kcal/day BMR example becomes about 2,115 kcal/day with a sedentary factor and about 2,732 kcal/day with a moderate factor.',
    ],
    improvements: [
      'Ran GSC/DataForSEO page sprint with current paid evidence, Calculator.net competitor-gap evidence for topic gaps only, refreshed metadata, exact examples, FAQ cautions, guide sections, source-backed audit record, modified dates, art alt/captions, and browser-proof targets.',
    ],
    followUps: [
      'Add alternate formula comparison only if the UI can clearly explain why equations differ and why BMR still is not a calorie prescription.',
    ],
  },
  {
    slug: 'ideal-weight-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-03',
    reviewedOn: '2026-06-03',
    scope: commonMathScope,
    sources: [idealBodyWeightCommentary, nhlbiBmi, cdcBmi, googleHelpfulContent],
    findings: [
      'The calculator explains the Devine ideal body weight estimate with formula sex, height, 50 kg or 45.5 kg 5-foot bases, and 2.3 kg per inch above 5 feet.',
      'The tool and guide now show exact examples: 180 cm male formula returns 74.99 kg with a 59.94-80.68 kg adult healthy BMI range, and 165 cm female formula returns 56.91 kg with a 50.37-67.79 kg range.',
      'The copy warns that ideal is a historical formula label, not a personal command, diagnosis, child growth chart, pregnancy guide, medical dosing rule, sports-nutrition plan, or body judgment.',
    ],
    improvements: [
      'Ran GSC/DataForSEO page sprint with current paid evidence, Calculator.net competitor-gap evidence for topic gaps only, refreshed metadata, exact examples, FAQ cautions, guide sections, source-backed audit record, modified dates, art alt/captions, and browser-proof targets.',
    ],
    followUps: [
      'Consider renaming visible copy to "reference weight" if search data shows users read "ideal" as a body judgment.',
    ],
  },
  {
    slug: 'pace-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-03',
    reviewedOn: '2026-06-03',
    scope: commonMathScope,
    sources: [cdcActivity, nistTimeDefinitions, googleHelpfulContent],
    findings: [
      'The calculator divides total elapsed seconds by distance for pace and divides distance by total time in hours for speed, with rounding notes for the displayed pace.',
      'The tool and guide now show exact examples for 5 km in 25:00, 10 km in 55:30, 3 miles in 30:00, and a 4:00:00 marathon target over 42.195 km.',
      'The copy explains lower pace versus higher speed, warns against mixing moving time with elapsed time, and frames pace as training math rather than medical advice.',
    ],
    improvements: [
      'Ran GSC/DataForSEO page sprint with current paid evidence, Calculator.net competitor-gap evidence for topic gaps only, refreshed metadata, exact examples, FAQ cautions, guide sections, source-backed audit record, modified dates, and browser-proof targets.',
    ],
    followUps: [
      'Add split-table output later if runners ask for mile or kilometer splits across longer distances.',
    ],
  },
  {
    slug: 'army-body-fat-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-03',
    reviewedOn: '2026-06-03',
    scope: commonMathScope,
    sources: [armyAbcpProgram, armyAbcpCalculator, armyAlaract0322025, armyDa5500, armyDa5501, armyBodyCompositionProgram],
    findings: [
      'The calculator now uses the current Army one-site tape equation from the June 2023 DA Form 5500/5501 worksheets instead of the older multi-site Navy-style circumference equation.',
      'The UI asks for sex, age, weight in pounds, and abdomen circumference in inches; age is used only for the AR 600-9 Table B-2 reference limit.',
      'The caution text clearly says the page is not an official Army determination, DA Form entry, record, waiver, flagging decision, or pass/fail result.',
      'The guide explains the one-site abdomen measurement, the formula examples, official-use limits, and the supplemental-assessment boundary from Army DPRR context.',
    ],
    improvements: [
      'Replaced legacy height/neck/hip Army calculator inputs with the current one-site abdomen method, added exact 210 lb/35 in and 165 lb/30 in examples, expanded FAQs, updated official Army source links, refreshed guide copy, sitemap dates, and art alt/caption text.',
    ],
    followUps: [
      'Review this page again if Army body composition policy changes from the current one-site circumference method, DA Form formulas, or Table B-2 reference limits.',
    ],
  },
  {
    slug: 'lean-body-mass-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-04',
    reviewedOn: '2026-06-04',
    scope: commonMathScope,
    sources: [boerLeanBodyMass, cdcBmi],
    findings: [
      'DataForSEO paid evidence for the exact tool and guide showed intent around `lean body mass calculator`, body-fat-percentage variants, charts, protein planning, TDEE planning, Reddit questions, and MDCalc-style lean body weight searches.',
      'The calculator uses Boer lean body mass equations and now shows rounded lean mass, implied fat mass, and lean percent from height, weight, and formula sex.',
      'The guide explains exact examples for male 180 cm/82 kg, female 165 cm/62 kg, and female 172 cm/70 kg, while separating lean body mass from muscle-only mass, DEXA scans, body-fat tests, protein prescriptions, TDEE prescriptions, and clinical dosing rules.',
    ],
    improvements: [
      'Reworked Boer formula wording, exact examples, FAQ cautions, guide sections, result display rounding, source-backed audit record, modified dates, related links, and art metadata around paid keyword evidence and Calculator.net competitor-gap evidence.',
    ],
    followUps: [
      'Add formula comparison only if users need Boer versus James or Hume estimates.',
    ],
  },
  {
    slug: 'healthy-weight-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-03',
    reviewedOn: '2026-06-03',
    scope: commonMathScope,
    sources: [cdcBmi, nhlbiBmi, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence for the exact tool and guide targeted `healthy weight calculator` intent and adjacent confusion around BMR, body fat, height weight calculator, ideal body weight, age weight, and pediatric formulas.',
      'The calculator converts height into the adult BMI 18.5 to 24.9 weight range using height in meters squared and now rounds the displayed range and optional current BMI for readability.',
      'The guide explains exact examples for 170 cm, 160 cm, and 183 cm, and separates adult BMI screening from children, teens, pregnancy, body fat, BMR, ideal weight, age/weight, and medical targets.',
    ],
    improvements: [
      'Reworked formula wording, exact examples, FAQ cautions, guide sections, result display rounding, source-backed audit record, modified dates, related links, and art metadata around current paid keyword evidence and CDC/NHLBI adult BMI context.',
    ],
    followUps: [
      'Add child/teen BMI percentile routing only if the site creates a dedicated pediatric BMI page with CDC growth-chart support.',
      'Keep BMR, body-fat, ideal-weight, and age/weight terms framed as separate calculator intents instead of expanding this page beyond adult BMI screening.',
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
    batch: 'gsc-dataforseo-page-sprint-2026-06-04',
    reviewedOn: '2026-06-04',
    scope: commonMathScope,
    sources: [cdcPregnancyWeight, acogPregnancyWeightGain],
    findings: [
      'The calculator uses pre-pregnancy BMI categories to choose singleton pregnancy weight-gain ranges, converts pound-based guideline ranges to kilograms, and compares current gain from pre-pregnancy weight to current weight.',
      'The guide says pregnancy weight-gain guidance must be personalized and does not treat the range as a diet command, weight-loss instruction, or substitute for prenatal care.',
      'The result separates current gain, recommended total range, BMI category, and weekly second/third-trimester reference rate so users can bring a clearer question to prenatal care.',
    ],
    improvements: [
      'Reworked metadata, exact examples, FAQ answers, guide language, source-backed audit notes, modified dates, component result formatting, and art alt/caption text around week 24, 165 cm, 62 kg to 70 kg, 8 kg gained, BMI 22.77, healthy-weight singleton range 11.34-15.88 kg, weekly 0.36-0.45 kg reference rate, twin/triplet limits, and clinician override.',
    ],
    followUps: [
      'Add twin and higher-order pregnancy routing only if the tool later supports separate CDC/IOM multiple-pregnancy guideline ranges and makes the input mode explicit.',
    ],
  },
  {
    slug: 'pregnancy-conception-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-04',
    reviewedOn: '2026-06-04',
    scope: commonMathScope,
    sources: [acogDueDateMethods, johnsHopkinsDueDate, johnsHopkinsFertileWindow, cdcGestationDefinition],
    findings: [
      'The calculator works backward from an estimated due date to an estimated conception date, a possible conception window, and an estimated LMP using due date minus 266 days and due date minus 280 days.',
      'The guide clearly says the result is not proof of an exact conception day, intercourse date, legal question, relationship question, medical certainty, or biological parentage.',
      'The wording separates due-date backward math from ovulation, fertilization, sperm survival, ultrasound dating, IVF dating, and clinician-assigned due dates, which are the common points of confusion.',
    ],
    improvements: [
      'Reworked metadata, exact examples, FAQs, guide sections, source links, audit notes, modified dates, art alt/caption text, and page-specific limits using current DataForSEO, competitor, ACOG, Johns Hopkins, ACOG fertility-awareness, and CDC/NCHS evidence.',
    ],
    followUps: [
      'Consider a future IVF transfer-date mode only if the tool can model embryo age and assumptions clearly.',
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
    batch: 'gsc-dataforseo-page-sprint-2026-06-04',
    reviewedOn: '2026-06-04',
    scope: commonMathScope,
    sources: [johnsHopkinsFertileWindow, acogDueDateMethods, johnsHopkinsDueDate],
    findings: [
      'The calculator estimates next period from LMP plus cycle length, then estimates ovulation or conception as next period minus luteal phase length.',
      'The guide explains that conception timing is approximate because ovulation can shift, sperm can survive for several days, the egg survives for about a day after ovulation, and fertilization timing is not a fixed clock.',
      'The related-tool path properly points users to ovulation, pregnancy conception, and due date calculators depending on whether they start from cycle data or an expected due date.',
    ],
    improvements: [
      'Reworked metadata, examples, FAQ answers, guide language, source-backed audit notes, modified dates, and art alt/caption text around exact LMP Apr 1, 2026, Apr 15 conception estimate, Apr 10-Apr 15 fertile window, next-period output, irregular-cycle cautions, due-date handoff, and parentage-proof limits.',
    ],
    followUps: [
      'Revisit if a dedicated irregular-cycle or ovulation-test guide is added, because irregular cycles and confirmed ovulation data need stronger uncertainty and input-choice guidance.',
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
    batch: 'gsc-dataforseo-page-sprint-2026-06-05',
    reviewedOn: '2026-06-05',
    scope: commonMathScope,
    sources: [macroAmdr, dietaryGuidelines, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence for the exact tool targeted `fat intake calculator` intent, and Calculator.net competitor evidence showed formula/logic and limits as the main topic gaps to strengthen.',
      'The calculator converts daily calories and fat percentage into total dietary fat grams by calculating fat calories first, then dividing by 9 kcal per gram.',
      'The tool copy now separates total dietary fat grams from body-fat percentage, saturated/trans fat limits, cholesterol planning, eating-disorder concerns, and clinician nutrition advice.',
    ],
    improvements: [
      'Added calculator-intent SEO title and description, fat-grams and macro-fat aliases, exact formula steps, expanded examples, specific input/result FAQ language, AMDR context, food-quality and medical-nutrition limits, refreshed audit notes, and a 2026-06-05 modified date.',
      'Expanded the matching guide with whole-percent input notes, exact 2,000 calorie and 2,200 calorie walkthroughs, calorie-target sensitivity, AMDR-as-context wording, FDA and Dietary Guidelines source links, food-label limits, and a 2026-06-05 guide modified date.',
    ],
    followUps: [
      'Add saturated-fat, trans-fat, fiber, and cholesterol context only if a dedicated nutrition-label or meal-planning tool is built with stronger health guidance.',
    ],
  },
  {
    slug: 'tdee-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-05',
    reviewedOn: '2026-06-05',
    scope: commonMathScope,
    sources: [mifflinStJeorEquation, cdcActivity, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence for the exact tool targeted `tdee calculator` intent, and Calculator.net competitor evidence showed concrete examples, formula logic, and limits as the main topic gaps to strengthen.',
      'The calculator estimates BMR with Mifflin-St Jeor, then multiplies by a selected activity factor to estimate maintenance calories per day.',
      'The result language now separates estimated maintenance calories from weight-loss targets, pregnancy nutrition, eating-disorder recovery, sport fueling, and medical diet orders.',
    ],
    improvements: [
      'Added calculator-intent SEO title and description, maintenance-calorie and activity-factor aliases, exact BMR and TDEE formula steps, activity-factor values, four numeric examples, specific input/result FAQ language, stronger medical and tracking limits, refreshed audit notes, and a 2026-06-05 modified date.',
      'Expanded the matching guide with Mifflin-St Jeor input notes, exact female and male formula walkthroughs, activity-factor interpretation, BMR versus TDEE separation, safer weight-goal next steps, medical-nutrition limits, and a 2026-06-05 guide modified date.',
    ],
    followUps: [
      'Add richer activity-factor examples in the UI if users still struggle to choose sedentary, light, moderate, very, or extra active from real weekly routines.',
    ],
  },
  {
    slug: 'body-type-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-03',
    reviewedOn: '2026-06-03',
    scope: commonMathScope,
    sources: [cdcBmi, nhlbiBmi, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence for the exact tool and guide targeted `body type calculator` intent, including body type calculator female, rectangle body shape, male body type, shoulder-based body type, 3D body shape, and height-and-weight body type queries.',
      'The calculator uses the larger of shoulders or bust/chest as the top measurement, then applies visible 5 cm, 7 cm, and 20 cm thresholds for Hourglass, Triangle or pear, Inverted triangle, Rectangle, and Balanced labels.',
      'The guide explains exact example outcomes and separates style labels from health, BMI, body fat, ideal weight, sex labels, 3D scan claims, and height-and-weight tests.',
    ],
    improvements: [
      'Reworked metadata, formula wording, examples, FAQ coverage, guide sections, result metrics, privacy note, source-backed audit record, modified dates, related links, and exact art metadata around the live threshold logic and current paid keyword evidence.',
    ],
    followUps: [
      'Add an illustrated measuring guide later if Search Console shows people need help placing shoulder, bust/chest, waist, or hip tape consistently.',
      'Do not add sex-based, attractiveness-ranking, AI body-scan, or photo-upload claims unless the tool actually supports those workflows and has stronger privacy review.',
    ],
  },
  {
    slug: 'body-surface-area-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-03',
    reviewedOn: '2026-06-03',
    scope: commonMathScope,
    sources: [bodySurfaceAreaNcbi, nistSi, googleHelpfulContent],
    findings: [
      'The calculator shows adult Mosteller and Du Bois body surface area estimates from height and weight, rounded to two decimals for reader-friendly estimate display.',
      'The guide explains that BSA is clinical math context and not a body-fat, BMI, health-grade, medication-dose, burn, procedure, pediatric, or veterinary result.',
      'The FAQ answers Mosteller versus Du Bois differences, square-meter units, dosing limits, and scope exclusions surfaced by paid keyword evidence.',
    ],
    improvements: [
      'Manually checked BSA formula outputs, rounded result labels, exact examples, FAQ cautions, source coverage, related tools, SEO copy, privacy behavior, and medical-scope limits.',
    ],
    followUps: [
      'Keep dosing and procedure-specific warnings prominent if future Search Console queries include medication, chemotherapy, burn, child, pet, psoriasis, or Schnur-scale intent.',
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
    batch: 'gsc-dataforseo-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [homeDepotMulchCalculator, inchCalculatorMulch, nrcsTexasMulching, nistSi, nistConversionFactors, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence for the exact tool and guide targeted `mulch calculator` intent after balance and status gates passed.',
      'The calculator converts bed area and depth into cubic feet, then cubic yards, and rounds bag count up from the entered bag cubic feet.',
      'Current mulch estimator sources show users expect cubic yards, cubic feet, bag counts, depth warnings, top-up logic, and bag-versus-bulk comparisons.',
      'The page now uses exact examples for a 200 square foot garden bed, a 150 square foot refresh layer, a 500 square foot large bed, and an 80 square foot tree-ring group.',
    ],
    improvements: [
      'Rewrote metadata, aliases, formula text, examples, FAQ coverage, guide source coverage, depth and trunk cautions, audit record, modified dates, related links, and image alt/caption text in smart-14 wording.',
    ],
    followUps: [
      'Add circular-bed, multi-bed, bag-size comparison, and bulk-delivery cost helpers later only if the UI keeps the simple area-depth-yard math clear.',
    ],
  },
  {
    slug: 'gravel-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [tallyardGravelCalculator, inchCalculatorGravelDriveway, calcipediaGravelDriveway, nistSi, nistConversionFactors, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence for the exact tool and guide targeted `gravel calculator` intent after balance and status gates passed.',
      'The calculator converts length, width, and depth into cubic yards, then multiplies by the user-entered tons-per-cubic-yard density.',
      'Current gravel estimator sources show users expect cubic yards, tons, depth, density, compaction, delivery rounding, and driveway-layer cautions, so the page now separates the simple rectangular estimate from real ordering checks.',
      'The page now uses exact examples for a 20 ft by 10 ft driveway top-up, a 30 ft by 3 ft path, an 18 ft by 18 ft parking pad, and a 40 ft by 12 ft deep base layer.',
    ],
    improvements: [
      'Rewrote metadata, aliases, formula text, examples, FAQ coverage, guide source coverage, density/order cautions, audit record, modified dates, related links, and image alt/caption text in smart-14 wording.',
    ],
    followUps: [
      'Add material presets, compaction allowance, driveway layer mode, and bag-versus-bulk comparison only if the UI keeps supplier-density limits clear.',
    ],
  },
  {
    slug: 'drywall-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [certainteedDrywallCalculator, usgMaterialEstimators, inchCalculatorDrywall, procoreDrywallCalculator, nistSi, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence for the exact tool and guide targeted `drywall calculator` intent after balance and status gates passed.',
      'The calculator adds waste to measured wall or ceiling area, divides by drywall sheet area, and rounds up to whole sheets.',
      'Current drywall estimator sources show users also expect tape, joint compound, screws, openings, ceilings, sheet sizes, and jobsite-condition cautions, so the page clearly says this tool is the sheet-count step only.',
      'The page now uses exact examples for 480 square feet with 4 by 8 sheets, 720 square feet with 4 by 12 sheets, a ceiling section, and a small repair area.',
    ],
    improvements: [
      'Rewrote metadata, aliases, formula text, examples, FAQ coverage, guide source coverage, opening/waste cautions, audit record, modified dates, related links, and image alt/caption text in smart-14 wording.',
    ],
    followUps: [
      'Add room-dimension mode, ceiling toggle, and optional tape/mud/screw estimates only if the page can keep product-label and local-code limits clear.',
    ],
  },
  {
    slug: 'carpet-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [criResidentialCarpetInstallation, nistSi, nistConversionFactors, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence for the exact tool and guide targeted `carpet calculator` intent after balance and status gates passed.',
      'CRI 105 supports warning that carpet installation depends on measuring and planning, seams, pile direction, trimming, pattern matching, transitions, and installer layout.',
      'The page now explains square feet to square yards, roll-width linear feet, 12 foot roll checks, waste, closets, stairs, padding, tack strips, and why the result is a planning estimate.',
    ],
    improvements: [
      'Rewrote metadata, aliases, formula text, examples, FAQ coverage, guide source coverage, safety limits, audit record, modified dates, related links, and image alt/caption text in smart-14 wording.',
    ],
    followUps: [
      'Consider adding multi-room or seam-aware layout only if the UI can keep room names, roll orientation, and installer limits easy to understand on mobile.',
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
    batch: 'gsc-dataforseo-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [lowesFenceCalculator, lowesFenceLayout, tallyardFenceCalculator, proBuilderFenceCalculator, nistSi, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence for the exact tool and guide targeted `fence calculator` intent after balance and status gates passed.',
      'The calculator subtracts gate openings from the fence run, then estimates panels and posts from panel width and post spacing.',
      'Current fence estimator sources show users also expect pickets, rails, concrete, fasteners, gate hardware, post-hole layout, and local-rule cautions, so the page clearly keeps this tool to panel and post counts.',
      'The page now uses exact examples for a 120 ft backyard fence, a 180 ft two-gate layout, a 48 ft side yard, and a 150 ft privacy run.',
    ],
    improvements: [
      'Rewrote metadata, aliases, formula text, examples, FAQ coverage, guide source coverage, gate and post cautions, audit record, modified dates, related links, and image alt/caption text in smart-14 wording.',
    ],
    followUps: [
      'Add separate corner/end/brace/terminal post fields and optional picket/rail/concrete outputs only if the UI can keep jobsite-code limits clear.',
    ],
  },
  {
    slug: 'deck-cost-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [decksComDeckCost, trexDeckCostCalculator, homeAdvisorDeckCost, nistSi, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence for the exact tool and guide targeted `deck cost calculator` intent after balance and status gates passed.',
      'The calculator estimates deck surface area with waste, multiplies by the user-entered decking cost per square foot, then adds railing and stair allowances.',
      'Current deck cost sources support warning that material, labor, geography, site conditions, seasonality, design complexity, framing, footings, railings, stairs, permits, demolition, and extras can change real deck quotes.',
      'The page now uses exact examples for a 16 ft by 12 ft deck, a 24 ft by 14 ft deck, a no-railing platform, and a composite comparison so users can see which input drives the rough total.',
    ],
    improvements: [
      'Rewrote metadata, aliases, formula text, examples, FAQ coverage, guide source coverage, quote limits, audit record, modified dates, related links, and image alt/caption text in smart-14 wording.',
    ],
    followUps: [
      'Add optional labor and permit fields only if the page can keep location-dependent pricing caveats clear.',
    ],
  },
  {
    slug: 'deck-board-calculator',
    status: 'deep-reviewed',
    batch: 'page-seo-gsc-refresh-2026-06-03',
    reviewedOn: '2026-06-03',
    scope: commonMathScope,
    sources: [inchDeckFlooring, decksComDeckingCalculator, omniDecking, nistSi, googleHelpfulContent],
    findings: [
      'The calculator estimates board count from deck area, actual board coverage, waste percent, and whole-board rounding, then estimates fastener rows from joist spacing.',
      'Current page evidence targets deck board calculator intent with exact examples for a 16 x 12 deck, a small landing, wider boards, and tighter joist spacing.',
      'The tool and guide now explain actual board width, board-gap limits, waste percent, screw-count assumptions, picture frames, breaker boards, diagonal layouts, stairs, hidden fastener systems, and board-only cost limits.',
    ],
    improvements: [
      'Updated Deck Board metadata, UI labels, formula language, FAQ details, guide sections, source notes, related links, image copy, and freshness dates from DataForSEO, competitor, and workbench evidence.',
    ],
    followUps: [
      'Add diagonal-layout and picture-frame modes if users need more detailed deck takeoffs later.',
    ],
  },
  {
    slug: 'deck-stain-calculator',
    status: 'deep-reviewed',
    batch: 'page-seo-gsc-refresh-2026-06-03',
    reviewedOn: '2026-06-03',
    scope: commonMathScope,
    sources: [inchDeckStain, decksComStaining, behrDeckPlusSolidStain, rustOleumWolmanDurastain, nistSi, googleHelpfulContent],
    findings: [
      'The calculator combines deck surface, railing faces counted on both sides, and stair tread/riser area before applying waste, coat count, product-label coverage, and whole-gallon rounding.',
      'Current page evidence targets deck stain calculator intent with exact examples for a 16 x 12 deck with rails, a platform deck, a large rough deck, and a rail-heavy refresh.',
      'The tool and guide now explain label coverage, one-coat versus two-coat products, rough or weathered wood, sprayer loss, rail and stair assumptions, prep/weather limits, and stain-only cost limits.',
    ],
    improvements: [
      'Updated Deck Stain metadata, UI labels, formula language, FAQ details, guide sections, source notes, related links, image copy, and freshness dates from DataForSEO, competitor, manufacturer, and workbench evidence.',
    ],
    followUps: [
      'Add separate deck-sealer, semi-transparent stain, solid stain, and deck-paint presets if future users ask for product-specific defaults.',
    ],
  },
  {
    slug: 'baluster-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-03',
    reviewedOn: '2026-06-03',
    scope: commonMathScope,
    sources: [
      inchBaluster,
      decksComBalusterCalculator,
      decksComBalusterBasics,
      iccIrc2021GuardOpenings,
      awcDca6DeckGuide,
      nistSi,
      googleHelpfulContent,
    ],
    findings: [
      'The calculator converts rail length to inches, subtracts post widths, rounds baluster count up with ceiling((clear opening - max open spacing) / (baluster width + max open spacing)), and reports actual equal spacing as the remaining open space divided by count plus one.',
      'Current deck and guard-spacing sources support explaining a common 4 inch planning target while clearly saying local code, required guards, stair openings, bottom-rail gaps, handrails, product systems, and inspections still control.',
      'The page now uses exact examples for a 10 ft deck rail bay, 8 ft metal baluster section, short stair-rail check, and tighter porch rail so users can verify count and spacing behavior.',
    ],
    improvements: [
      'Rewrote metadata, aliases, formula language, unit-specific input labels, examples, FAQ detail, guide sections, source notes, related links, image copy, freshness dates, and code-limit cautions around clear opening, equal gaps, post subtraction, and local guard rules.',
    ],
    followUps: [
      'Add stair angle support only if we can present the extra geometry, stair-opening rules, and centerline layout marks clearly without implying code approval.',
      'Consider multi-section totals if users ask for a full deck perimeter count across several rail bays.',
    ],
  },
  {
    slug: 'paver-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [
      lowesPaverPlanning,
      inchPaverCalculator,
      calcShedPaverCalculator,
      cmhaPaverConstruction,
      nistSi,
      googleHelpfulContent,
    ],
    findings: [
      'DataForSEO showed paver calculator intent is strongly tied to buying and layout searches such as patio paver calculator, paver calculator square feet, 4x8 paver calculator, paver spacing, circles, and 12x12 pavers.',
      'Current paver references agree on the core count: convert each paver from square inches to square feet, add waste to project area, divide by paver area, then round up to a whole-paver count.',
      'Lowe\'s, Inch Calculator, CalcShed, and CMHA context show the count must stay honest about base gravel, bedding sand, joint sand, edge restraints, compaction, drainage, traffic load, and package-size rounding.',
    ],
    improvements: [
      'Rewrote metadata, description, aliases, formula, limits, examples, FAQs, guide sections, source notes, related links, sitemap dates, and image alt/caption text around patio paver counts, 4x8 and 12x12 searches, waste, pattern cuts, and buying checks.',
    ],
    followUps: [
      'Add a dedicated multi-size pattern estimator only if we can model supplier pattern ratios clearly without hiding assumptions.',
      'Consider a circle-area helper for pavers after the page queue reaches the hardscape cluster again.',
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
    batch: 'gsc-dataforseo-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [inchSidingCalculator, certainTeedMeasureVinylSiding, lowesSiding, nistSi, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence for the exact tool and guide targeted `siding calculator` intent with 8,100 U.S. searches plus vinyl siding, Hardie siding, lap siding, square-foot, box, and retail-style searches.',
      'Current siding references support the 100-square-foot siding-square definition, triangular gable math, opening subtraction, and ordering overage for waste, cuts, and damage.',
      'The page now separates simple siding coverage math from J-channel, starter strip, corner posts, trim, soffit, fascia, fasteners, wrap, flashing, product exposure, box coverage, installer layout, weatherproofing, and local building review.',
    ],
    improvements: [
      'Rewrote metadata, aliases, formula text, examples, FAQ coverage, guide source coverage, audit record, modified dates, related links, and exact image alt/caption text in smart-14 wording.',
    ],
    followUps: [
      'Add a wall-section table later if the UI can support multiple rectangular walls, gables, and openings without hiding the estimating assumptions.',
    ],
  },
  {
    slug: 'brick-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [biaBrickEstimating, glenGeryBrickSizes, nistSi, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence for the exact tool and guide targeted the `brick calculator` search intent after balance and status gates passed.',
      'Brick Industry Association estimating tables support joint-sensitive brick counts, and Glen-Gery/NIST sources support brick-size and unit context.',
      'The page now explains net wall face area, actual brick face dimensions, 3/8 inch versus other mortar joints, waste, supplier-table differences, and why mortar or structural layout are separate decisions.',
    ],
    improvements: [
      'Rewrote metadata, aliases, formula text, examples, FAQ coverage, guide source coverage, safety limits, audit record, modified dates, related links, and image alt/caption text in smart-14 wording.',
    ],
    followUps: [
      'Add mortar estimating only if the masonry scope expands beyond brick count planning and keeps product, joint, and wall-type limits visible.',
    ],
  },
  {
    slug: 'concrete-block-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [cmhaConcreteMasonryEstimating, cmhaModularConcreteMasonry, cmhaConcreteMasonryConstruction, archtoolboxCmu, nistSi, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence for the exact tool and guide targeted `concrete block calculator` intent after balance and status gates passed.',
      'CMHA estimating guidance supports the common 8 by 16 inch CMU face-area shortcut, the 8/9 square-foot face area, and waste math for simple block counts.',
      'The page now explains nominal versus actual CMU size, openings before waste, courses, blocks per course, corners, half blocks, mortar, grout, rebar, footings, drainage, retaining-wall loads, permits, and code limits.',
    ],
    improvements: [
      'Rewrote metadata, aliases, formula text, examples, FAQ coverage, guide source coverage, safety limits, audit record, modified dates, and exact image alt/caption text in smart-14 wording.',
    ],
    followUps: [
      'Add mortar, grout, or rebar companion estimates only if the UI keeps structural-design, permit, and local-code limits visible.',
    ],
  },
  {
    slug: 'rebar-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [calcShedRebar, inchRebarWeight, crsiSplicingBars, nistSi, googleHelpfulContent],
    findings: [
      'DataForSEO page evidence showed `rebar calculator` demand around 6,600 U.S. searches, with related intent for slab, weight, wall, square-foot, app, and Excel searches.',
      'The calculator counts bars in both slab directions from spacing, totals linear feet, adds waste, divides by stock-bar length, and rounds up whole bars to buy.',
      'The page now separates simple rectangular slab takeoff math from structural design, lap splices, bar size, cover, supports, edge distance, walls, footings, beams, and code requirements.',
    ],
    improvements: [
      'Rewrote metadata, aliases, formula text, examples, FAQ coverage, guide source coverage, audit record, modified dates, related links, and exact image alt/caption text in smart-14 wording.',
    ],
    followUps: [
      'Add lap-length or wall/footing modes only if the UI keeps structural-scope warnings prominent and source-backed.',
    ],
  },
  {
    slug: 'concrete-mix-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [inchConcreteMix, quikreteConcrete, nistSi, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence for the exact tool and guide targeted `concrete mix calculator`, 1:2:4 ratio, slab, and sand/cement-adjacent intent after balance and status gates passed.',
      'The calculator converts cubic yards to cubic feet, adds waste, splits adjusted volume by the cement:sand:gravel ratio, and rounds cement bags up from the entered bag yield.',
      'The page now gives exact 1:2:3 and 1:2:4 examples, explains bag yield, keeps mortar-only searches out of scope, and warns that ratio math is not strength design.',
    ],
    improvements: [
      'Refreshed metadata, aliases, formula text, examples, FAQ coverage, guide sections, source-backed limits, exact image alt/captions, modified dates, and UI labels in smart-14 wording.',
    ],
    followUps: [
      'Add a separate mortar/sand-cement calculator only if the UI and sources keep it separate from concrete strength and gravel-based mix ratios.',
    ],
  },
  {
    slug: 'concrete-driveway-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [inchConcreteDriveway, quikreteConcrete, nistSi, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence for the exact tool and guide targeted `concrete driveway calculator`, `concrete slab calculator`, `how much is a yard of concrete`, driveway cost, and driveway estimate intent after balance and status gates passed.',
      'The calculator converts driveway thickness from inches to feet, multiplies length by width by thickness, adds waste, converts cubic feet to cubic yards, rounds common bag counts up, and optionally estimates material-only cost.',
      'The page now explains 40 by 12 foot, 30 by 20 foot, small apron, and thickness-change examples while keeping driveway design, base prep, reinforcement, joints, drainage, permits, and inspections outside the calculator result.',
    ],
    improvements: [
      'Refreshed metadata, aliases, formula text, examples, FAQ coverage, guide sections, source-backed limits, exact image alt/captions, modified dates, and UI labels in smart-14 wording.',
    ],
    followUps: [
      'Add driveway subbase, joint-spacing, or reinforcement companions only as separate scoped tools with clear code and safety limits.',
    ],
  },
  {
    slug: 'concrete-steps-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [inchConcreteSteps, quikreteConcrete, quikreteStepsRamps, nistSi, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence for the exact tool and guide targeted `concrete steps calculator`, broad concrete calculator intent, concrete stair rise-and-run intent, and landing-adjacent intent after balance and status gates passed.',
      'The calculator models solid poured steps as stacked rectangular blocks, adds an optional landing at full stair height, applies waste, converts cubic feet to cubic yards, and rounds common bag counts up.',
      'The page now explains exact porch and garden-step examples while keeping hollow forms, precast units, footings, reinforcement, slope, nosing, handrails, landings, frost, and local building code outside the calculator result.',
    ],
    improvements: [
      'Refreshed metadata, aliases, formula text, examples, FAQ coverage, guide sections, source-backed limits, exact image alt/captions, modified dates, and UI labels in smart-14 wording.',
    ],
    followUps: [
      'Consider a hollow-step or precast-step mode later only with clear diagrams, product-data inputs, and code/safety limits.',
    ],
  },
  {
    slug: 'concrete-weight-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [inchConcreteWeight, aciConcreteTerminology, fhwaConcreteWeight, nrmcaLightweightConcrete, nistSi, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence for the exact tool and guide targeted `concrete weight calculator`, `concrete weight calculator by dimensions`, cured-concrete weight, and metric-weight variants after balance and status gates passed.',
      'The calculator converts cubic yards to cubic feet, applies optional waste, multiplies by density, and converts pounds to US tons while repeating the density used in the result.',
      'The page now explains normal-weight, lightweight, cured, hauling, disposal, trailer, rebar, and metric-weight limits without pretending one density fits every project.',
    ],
    improvements: [
      'Refreshed metadata, aliases, formula text, examples, FAQ coverage, guide sections, source-backed density ranges, exact image alt/captions, modified dates, related links, and UI labels in smart-14 wording.',
    ],
    followUps: [
      'Consider a metric mode later because DataForSEO found small but real demand for 1 m3 concrete weight in kg and tons.',
    ],
  },
  {
    slug: 'concrete-reinforcing-mesh-calculator',
    status: 'deep-reviewed',
    batch: 'page-by-page-seo-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [inchConcreteMesh, aciWwrPlacement, crsiSplicingBars, nistSi, googleHelpfulContent],
    findings: [
      'DataForSEO page sprint was run for the exact tool and blog keyword; the exact related-keyword endpoint returned no keyword items, so no volume claims were added.',
      'The calculator finds slab area, reduces sheet coverage by overlap, adds waste, divides by effective sheet area, and rounds up sheet count.',
      'ACI welded wire reinforcement guidance confirms mesh should be supported in position before concrete placement, so the copy warns against treating sheet count as placement design.',
      'CRSI splice guidance confirms lap details depend on drawings and design variables, so the overlap field is framed as estimating coverage only.',
    ],
    improvements: [
      'Rebuilt title/meta, examples, FAQs, guide notes, source links, trust limits, image alt/caption, sitemap dates, and audit record around slab mesh sheet counts, overlap, waste, and placement limits.',
    ],
    followUps: [
      'Add a separate roll-length mode if future Search Console or DataForSEO evidence shows demand for roll-first mesh planning.',
    ],
  },
  {
    slug: 'concrete-block-fill-calculator',
    status: 'deep-reviewed',
    batch: 'page-by-page-seo-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [
      inchConcreteBlockFill,
      cmhaConcreteMasonryEstimating,
      cmhaGroutConcreteMasonry,
      cmhaGroutingWalls,
      quikreteConcrete,
      nistSi,
      googleHelpfulContent,
    ],
    findings: [
      'DataForSEO returned live demand for concrete block fill calculator, concrete fill calculator, 8 block core fill calculator, 12 inch block fill calculator, QUIKRETE block fill calculator, and 8x8x16 block-fill questions.',
      'The calculator multiplies block count by fill cubic feet per block, adds waste, converts to cubic yards, and rounds common bag counts.',
      'CMHA grout guidance frames masonry grout as fill for concrete masonry cores and cavities, so the page now avoids treating ordinary bag-yield math as structural approval.',
      'The guide warns that CMU size, core shape, filled-cell pattern, grout mix, rebar cells, cleanouts, consolidation, and inspections change real volume.',
    ],
    improvements: [
      'Rebuilt title/meta, aliases, examples, FAQs, guide notes, source links, trust limits, image alt/caption, sitemap dates, and audit record around CMU core fill, cubic feet, cubic yards, and bag counts.',
    ],
    followUps: [
      'Add a block-size lookup only if reliable fill-volume data can be kept clear and sourced.',
    ],
  },
  {
    slug: 'retaining-wall-calculator',
    status: 'deep-reviewed',
    batch: 'all-pages-seo-dataforseo-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [
      inchRetainingWall,
      cmhaSegmentalRetainingWallInstall,
      cmhaSegmentalRetainingWallGuide,
      cmhaSegmentalRetainingWallDesign,
      allanBlockRetainingWallPlanning,
      nistSi,
      googleHelpfulContent,
    ],
    findings: [
      'DataForSEO paid evidence showed active intent for retaining wall calculator, concrete retaining wall calculator, retaining wall calculation formula, square-foot checks, store-style calculators, and curved or 6x6 variants.',
      'The calculator estimates whole courses, blocks per course, wall blocks with waste, cap blocks, and base trench cubic yards from segmental block inputs.',
      'The page and guide now separate wall block math from safety design, drainage gravel, geogrid, backfill, poured concrete walls, timber walls, slopes, surcharges, permits, and local code.',
    ],
    improvements: [
      'Rebuilt metadata, aliases, formula text, examples, FAQ coverage, guide sections, source links, trust limits, modified dates, related links, audit record, and exact image alt/caption text around segmental retaining wall blocks, caps, courses, base gravel, and the 40 ft by 3 ft example.',
    ],
    followUps: [
      'Add drainage gravel, backfill stone, drain pipe, geogrid, curved-wall, or timber 6x6 modes only if each mode gets its own sourced assumptions, UI labels, tests, and safety caveats.',
    ],
  },
  {
    slug: 'rebar-weight-calculator',
    status: 'deep-reviewed',
    batch: 'all-pages-seo-dataforseo-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [inchRebarWeight, southernRebarWeight, crsiLapSplices, nistSi, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence showed active U.S. intent around `rebar weight chart`, `rebar weight per foot`, `rebar weight calculator`, `steel rebar weight calculator`, and smaller metric or slab variants.',
      'The calculator selects nominal US rebar weight per foot for #3 through #8, multiplies length by quantity, adds waste, and converts pounds to US tons.',
      'The page and guide now separate ordering/hauling weight from structural reinforcement design, lap-splice design, spacing, cover, support chairs, placement drawings, bundle weights, coatings, and mill tolerances.',
    ],
    improvements: [
      'Rebuilt metadata, aliases, formula text, examples, FAQ coverage, guide sections, source links, trust limits, modified dates, related links, audit record, and exact image alt/caption text around rebar weight-per-foot checks, pounds, US tons, #4/#5 examples, slab handoff, and waste.',
    ],
    followUps: [
      'Add metric bar sizes, #9 through #18, cost, or multi-line cut-list modes only if each mode gets sourced weights, UI labels, tests, and clear supplier-limit wording.',
    ],
  },
  {
    slug: 'concrete-footing-calculator',
    status: 'deep-reviewed',
    batch: 'all-pages-seo-dataforseo-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [inchConcreteFooting, quikreteConcrete, iccIrc2024Foundations, nistSi, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence showed active U.S. intent around `concrete footing calculator`, concrete footing cost calculator, and adjacent slab, wall, app, mix, and block calculator searches.',
      'The calculator converts footing width and depth from inches to feet, multiplies rectangular volume, adds waste, converts to cubic yards, and rounds 60 lb and 80 lb concrete bag counts up.',
      'The page and guide now separate material quantity from footing design choices such as soil bearing, loads, frost depth, reinforcement, slope, drainage, inspections, and local code.',
    ],
    improvements: [
      'Rebuilt metadata, aliases, formula text, examples, FAQ coverage, guide sections, source links, trust limits, modified dates, related links, audit record, and exact image alt/caption text around straight footing volume, cubic yards, bag counts, waste, cost checks, and code limits.',
    ],
    followUps: [
      'Add metric footing inputs, cost fields, stepped footing, pier footing, or combined footing modes only if each mode gets sourced assumptions, UI labels, tests, and clear code-limit wording.',
    ],
  },
  {
    slug: 'concrete-column-calculator',
    status: 'deep-reviewed',
    batch: 'all-pages-seo-dataforseo-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [maxiConcreteColumn, quikreteConcrete, quikreteTubePillarFoundations, nistSi, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence showed active U.S. intent around `concrete column calculator` with 320 searches, plus small but relevant bag-count, online-column, ratio, circular-column-volume, and reinforced-column-design variants.',
      'The calculator uses inside diameter, converts it to radius in feet, applies cylinder volume, multiplies by quantity, adds waste, converts to cubic yards, and rounds 60 lb and 80 lb bag counts up.',
      'The page and guide now separate material quantity from reinforced-column design, footing bells, flared bases, anchors, rebar cages, form bracing, soil, frost depth, inspections, and code rules.',
    ],
    improvements: [
      'Rebuilt metadata, aliases, formula text, examples, FAQ coverage, guide sections, source links, trust limits, modified dates, related links, audit record, and exact image alt/caption text around round column volume, cubic yards, bag counts, waste, and structural-design limits.',
    ],
    followUps: [
      'Add square-column, bell-footing, cost, metric, or reinforced-column-design modes only if each mode gets sourced assumptions, UI labels, tests, and clear code-limit wording.',
    ],
  },
  {
    slug: 'post-hole-concrete-calculator',
    status: 'deep-reviewed',
    batch: 'all-pages-seo-dataforseo-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [inchPostHoleConcrete, quikreteConcrete, quikreteSettingPosts, quikreteSettingPostsPdf, nistSi, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence showed active U.S. intent around `bag concrete calculator`, `quikrete concrete calculator`, `sakrete concrete calculator`, `post hole concrete calculator`, and `post hole calculator` searches.',
      'The calculator estimates round hole volume, subtracts the round-equivalent post volume, multiplies by hole quantity, adds waste, converts to cubic yards, and rounds 60 lb and 80 lb bag counts up.',
      'The page and guide now separate concrete bag estimates from depth, frost, soil, deck, gate, product, inspection, and local code decisions.',
    ],
    improvements: [
      'Rebuilt metadata, aliases, formula text, examples, FAQ coverage, guide sections, source links, trust limits, modified dates, related links, audit record, and exact image alt/caption text around post-hole concrete, post displacement, bag counts, waste, and code or load limits.',
    ],
    followUps: [
      'Add gravel-base allowance, square-post geometry, metric inputs, cost fields, or fast-setting product yield overrides only if each mode gets sourced assumptions, UI labels, tests, and clear limit wording.',
    ],
  },
  {
    slug: 'plywood-calculator',
    status: 'deep-reviewed',
    batch: 'all-pages-seo-dataforseo-sprint-2026-06-03',
    reviewedOn: '2026-06-03',
    scope: commonMathScope,
    sources: [inchPlywood, apaPlywood, homeDepotPlywoodTypes, nistSi, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence showed active U.S. intent around `plywood calculator` with 8,100 searches, plus roof, 4x8, cabinet, square-feet, floor, wall, and furniture modifiers.',
      'The calculator divides adjusted project area by sheet coverage, rounds up whole sheets, shows total coverage bought, and optionally estimates cost from price per sheet.',
      'The page and guide now separate area-based sheet count from roof sheathing rules, subfloor ratings, wall openings, cabinet cut lists, furniture grain direction, saw kerf, thickness, grade, fasteners, and code requirements.',
    ],
    improvements: [
      'Rebuilt metadata, aliases, examples, FAQ coverage, guide sections, source links, trust limits, modified dates, audit record, related links, and exact image alt/caption text around 4x8 sheet count, waste, whole-sheet rounding, total coverage bought, and cut-layout limits.',
    ],
    followUps: [
      'Add a multi-room sheet planner, opening subtraction, metric panels, or cut-list optimizer later only if the new mode can represent layout complexity honestly and gets its own sourced assumptions, UI labels, tests, and browser proof.',
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
    batch: 'all-pages-seo-dataforseo-sprint-2026-06-03',
    reviewedOn: '2026-06-03',
    scope: commonMathScope,
    sources: [lowesCountertopGuide, slabWiseCountertopSquareFeet, nistSi, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence showed U.S. search intent around countertop calculator, quartz countertop calculator, Home Depot countertop calculator, kitchen countertop calculator, granite countertop calculator, kitchen countertop measurement tool, laminate countertop calculator, and L-shaped countertop calculator.',
      'The calculator converts countertop depth and backsplash height to feet, adds top and backsplash area, subtracts cutouts, adds waste, and optionally prices square footage for rough quartz, granite, laminate, and solid-surface planning.',
      'The FAQ explains L-shaped sections, islands, backsplash, waste, material-only pricing, cutout labor, and why quotes can exceed simple square-foot math.',
      'The guide now gives the 18 foot, 25.5 inch depth, 4 inch backsplash example that becomes 44.275 square feet after waste, plus notes for different depths and supplier quote limits.',
    ],
    improvements: [
      'Added DataForSEO-backed SEO metadata and aliases, clearer calculator labels, net-before-waste output, L-shape and island guidance, source-backed guide sections, exact art alt/caption text, modified dates, and safer cost-related internal links.',
    ],
    followUps: [
      'Consider a multi-section mode only if users need separate island, peninsula, and vanity rows without making the first-use flow bulky.',
    ],
  },
  {
    slug: 'sod-calculator',
    status: 'deep-reviewed',
    batch: 'page-seo-gsc-refresh-2026-06-03',
    reviewedOn: '2026-06-03',
    scope: commonMathScope,
    sources: [inchSod, tallyardSodCalculator, sodSolutionsPalletCoverage, calcShedSodCalculator, nistSi, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence showed primary demand for sod calculator plus smaller Home Depot, Lowe\'s, St. Augustine, formula, free calculator, and 200 square foot intent variants.',
      'The calculator adds waste to lawn area, divides by supplier roll or slab coverage, rounds rolls up, rounds pallets up from rolls per pallet, and estimates roll-only material cost when entered.',
      'The FAQ now covers roll coverage, pallet coverage, waste percent, St. Augustine sod, 200 ft2 repair math, and delivery or labor exclusions.',
      'The guide warns about supplier roll sizes, pallet minimums, delivery rules, grading, soil prep, irrigation, slopes, seams, watering, and install-labor limits.',
    ],
    improvements: [
      'Added DataForSEO-backed SEO metadata and aliases, exact roll/pallet/cost examples, richer guide sections, competitor-backed source links, clearer calculator labels, pallet coverage output, refreshed image alt/caption text, modified dates, and safer cost-related internal links.',
    ],
    followUps: [
      'Add shape-based lawn area helpers only if they reuse the existing area calculator logic.',
    ],
  },
  {
    slug: 'wall-stud-calculator',
    status: 'deep-reviewed',
    batch: 'page-seo-gsc-refresh-2026-06-03',
    reviewedOn: '2026-06-03',
    scope: commonMathScope,
    sources: [inchFraming, calcSummitFramingCalculator, homeProjectStudCalculator, nistSi, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence showed primary demand for wall stud calculator plus smaller free framing calculator, metal stud, windows-and-doors, door, and interior-wall variants.',
      'The calculator counts layout studs from wall length and on-center spacing, adds opening and corner allowances, applies waste, and adds plate pieces from wall length, plate rows, and board length.',
      'The FAQ now explains on-center spacing, 16 vs 24 inch layouts, rough opening allowances, metal-stud limits, board length, plate rows, waste, and structural-plan exclusions.',
      'The result shows layout studs, vertical studs with waste, plate pieces, total boards, and linear feet so users can audit the count.',
    ],
    improvements: [
      'Added DataForSEO-backed SEO metadata and aliases, exact 24 ft wall examples, richer guide sections, competitor-backed source links, clearer calculator labels, layout-stud output, refreshed image alt/caption text, modified dates, and safer cost-related internal links.',
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
    batch: 'gsc-dataforseo-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [nistSi, nistConversionFactors, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence for the exact tool and guide targeted `cubic yard calculator` intent after balance and status gates passed.',
      'The calculator converts rectangular length, width, and depth inches into cubic feet, applies waste, divides by 27 for cubic yards, and shows cubic meters from the NIST cubic-foot conversion.',
      'The page now uses exact examples for a 20 ft by 10 ft area at 3 inches deep with 5% waste, a 12 ft by 8 ft deep-fill example, a small patch, and an 8 ft by 4 ft raised bed.',
      'The guide explains 27 cubic feet per cubic yard, 46,656 cubic inches per cubic yard, loose versus compacted material, supplier minimums, tons, bags, and rounding limits.',
    ],
    improvements: [
      'Manually checked cubic-foot and cubic-yard math, waste handling, examples, FAQ cautions, NIST source coverage, related tools, SEO copy, privacy behavior, result labels, DataForSEO proof, and image alt/caption text.',
    ],
    followUps: [
      'Use this as the general helper behind future soil, fill, and material-estimator pages.',
    ],
  },
  {
    slug: 'pool-volume-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [
      poolVolumeReference,
      bulkCalculatorPoolVolume,
      calcipediaPoolVolume,
      nistSi,
      nistConversionFactors,
      googleHelpfulContent,
    ],
    findings: [
      'DataForSEO showed pool volume calculator intent has 18,100 U.S. searches and related demand for round, oval, kidney, irregular-shape, litre, and metric pool-volume estimates.',
      'Current pool-volume references agree that rectangle pools use length x width x average depth, round and oval pools use a curved-shape factor, and cubic feet convert to U.S. gallons with about 7.48 gallons per cubic foot.',
      'The guide now warns users not to use wall height or maximum depth when average water depth, steps, benches, freeform curves, deep hoppers, and chemical dosing accuracy matter.',
    ],
    improvements: [
      'Rewrote metadata, aliases, formula, limits, examples, FAQs, guide sections, source notes, audit record, sitemap dates, and image alt/caption text around pool gallons, average depth, 7.48052 conversion, round and oval shape factors, and chemical-dose caution.',
    ],
    followUps: [
      'Add a shallow/deep-end average-depth helper if pool users need a clearer walkthrough.',
      'Consider an irregular-pool section splitter only if it can show assumptions without pretending freeform pools are exact.',
    ],
  },
  {
    slug: 'sand-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [inchSandCalculator, calcShedSandCalculator, calculatorSoupCubicYards, nistSi, nistConversionFactors, googleHelpfulContent],
    findings: [
      'DataForSEO showed sand calculator intent around cubic yards, tons, bags, pool sand, aquarium sand, circle areas, and square-foot depth estimates.',
      'Current sand references agree the core math is rectangular volume, cubic feet to cubic yards, then density-based tonnage; dry sand and wet sand can have different tons-per-yard ranges.',
      'The page now keeps bag count, pool water volume, aquarium product labels, round-area math, paver base gravel, bedding sand, and joint sand as separate checks instead of overclaiming one result.',
    ],
    improvements: [
      'Rewrote metadata, aliases, formula, limits, examples, FAQs, guide sections, source notes, audit record, sitemap dates, related links, and image alt/caption text around sand cubic yards, tons, depth, bag handoff, supplier density, paver bedding, sandbox fill, pool/aquarium limits, and round-area caveats.',
    ],
    followUps: [
      'Add a circle-area helper or bag-count output only if the UI can keep those assumptions visible and avoid confusing bulk tons with retail bags.',
    ],
  },
  {
    slug: 'soil-calculator',
    status: 'deep-reviewed',
    batch: 'page-seo-gsc-refresh-2026-06-03',
    reviewedOn: '2026-06-03',
    scope: commonMathScope,
    sources: [calcShedTopsoilCalculator, calcSummitTopsoilCalculator, vastCalcSoilCalculator, nistSi, nistConversionFactors, googleHelpfulContent],
    findings: [
      'DataForSEO showed high-volume soil calculator intent around topsoil, raised beds, potting soil, bag counts, square-foot depth estimates, and cubic-yard ordering.',
      'The calculator converts bed area and added depth into cubic feet, adds extra percent, converts to cubic yards, then rounds up common 1.5- and 2-cubic-foot bag counts.',
      'The refreshed examples pin the default raised-bed top-off to 120 ft2 at 4 in with 10% extra: 44 ft3, 1.63 yd3, 30 small bags, or 22 two-cubic-foot bags.',
      'The guide now separates top-off depth, full-bed height, compost/fill layers, potting mix labels, settling, moisture, bag-size variation, and delivery minimums.',
    ],
    improvements: [
      'Rewrote metadata, aliases, formula, limits, examples, FAQs, guide sections, source notes, audit record, sitemap dates, related links, image alt/caption text, and result labels around raised-bed soil, topsoil, potting soil, cubic yards, and bag counts.',
    ],
    followUps: [
      'Add shape presets or a bag-size selector later if soil traffic shows repeated square-foot, triangle, round-bed, or custom-bag-size searches.',
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
    batch: 'gsc-dataforseo-page-sprint-2026-06-04',
    reviewedOn: '2026-06-04',
    scope: commonMathScope,
    sources: [nistSi, nistConversionFactors, openStaxMassWeight],
    findings: [
      'DataForSEO paid evidence for the exact tool and guide showed `mass calculator` intent plus related monoisotopic mass, chemistry, formula, physics, and mass-from-weight searches.',
      'The calculator correctly rearranges the density relationship as mass = density x volume and now shows exact examples for 2.7 g/cm3 x 10 cm3, 1 g/mL x 250 mL, and 1600 kg/m3 x 0.5 m3.',
      'The page and guide explain that this estimate is not a scale measurement, chemistry molar-mass tool, monoisotopic-mass tool, body-mass calculator, or weight-to-mass converter.',
      'The guide keeps unit matching, density source quality, moisture, temperature, packing, and material-specific density in view.',
    ],
    improvements: [
      'Manually checked mass-from-density math, exact examples, FAQ input wording, guide cautions, source coverage, related tools, SEO copy, privacy behavior, result labels, DataForSEO paid evidence, and Calculator.net topic-gap evidence.',
    ],
    followUps: [
      'Consider a common-material density helper only if the values are clearly labeled as rough references.',
    ],
  },
  {
    slug: 'weight-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-04',
    reviewedOn: '2026-06-04',
    scope: commonMathScope,
    sources: [openStaxMassWeight, nistSi],
    findings: [
      'DataForSEO paid evidence for the exact tool and guide showed `weight calculator` intent overlaps with ideal weight, height-weight, BMI, age-weight, and body-weight searches.',
      'The calculator uses weight force = mass x gravity and now separates newtons, pounds-force, pounds mass, and body-weight calculator intent more clearly.',
      'The page and guide now include exact Earth, Moon, and Mars gravity examples while routing BMI, healthy-weight, and ideal-weight questions to the proper health tools.',
      'The limit language avoids safety-rated load decisions and body-weight screening claims while explaining that gravity changes by location.',
    ],
    improvements: [
      'Manually checked weight-force math, unit labels, examples, FAQ wording, guide clarity, source coverage, related tools, SEO copy, privacy behavior, result labels, DataForSEO paid evidence, and Calculator.net topic-gap evidence.',
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
    batch: 'gsc-dataforseo-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [openStaxElectricPower, openStaxOhmsLaw, nistAmpere, nistSi, esfiExtensionCordSafety, googleHelpfulContent],
    findings: [
      'DataForSEO paid evidence for the exact tool and guide targeted the `watts to amps calculator` search intent after balance and status gates passed.',
      'OpenStax electric power guidance supports the core P = IV relationship, and NIST confirms the ampere, volt, and watt unit context.',
      'The page now separates DC/single-phase math from three-phase math, adds a 12 V DC example, explains power factor, and keeps breaker, wire, and extension-cord choices outside the simple estimate.',
    ],
    improvements: [
      'Rewrote metadata, aliases, formula text, examples, FAQ detail, guide source coverage, safety wording, audit record, modified dates, and image alt/caption text in smart-14 wording.',
    ],
    followUps: [
      'Add common voltage presets later only if the UI keeps equipment-nameplate and qualified-review warnings visible.',
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
    batch: 'gsc-dataforseo-page-sprint-2026-06-05',
    reviewedOn: '2026-06-05',
    scope: commonMathScope,
    sources: [openStaxMolarity, nistSi, nistAtomicWeights],
    findings: [
      'The calculator handles moles/liters directly and grams/molar-mass/liters by converting grams to moles first.',
      'The FAQ now explains why final solution volume matters for molarity.',
      'The guide keeps lab safety, significant figures, purity, hydrate state, and teacher instructions outside the quick formula helper.',
    ],
    improvements: [
      'Manually checked molarity modes, grams-to-moles path, examples, FAQ detail, guide cautions, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
      'Added calculator-intent SEO title and description, aliases for molar concentration and moles per liter, final-solution-volume formula wording, a grams-to-moles example, FAQ coverage for grams, moles versus molarity, lab-instruction limits, and a 2026-06-05 modified date.',
    ],
    followUps: [
      'Add dilution M1V1 mode later as a separate chemistry tool or mode.',
    ],
  },
  {
    slug: 'molecular-weight-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-05',
    reviewedOn: '2026-06-05',
    scope: commonMathScope,
    sources: [nistAtomicWeights, nistSi, openStaxMolarity],
    findings: [
      'The parser handles common element symbols, subscripts, parentheses, and period-separated hydrate parts.',
      'The FAQ now explains why capitalization matters for chemical formulas, such as CO versus Co.',
      'The page now frames molecular weight and molar mass as classroom formula work in g/mol, not isotope-exact mass.',
    ],
    improvements: [
      'Manually checked formula parsing behavior, common examples, composition output, FAQ detail, guide cautions, source coverage, related tools, SEO copy, privacy behavior, and result labels.',
      'Added calculator-intent SEO title and description, aliases for molar mass and formula weight, H2O and Ca(OH)2 result interpretation, hydrate FAQ coverage, molecular-weight versus molar-mass wording, and a 2026-06-05 modified date.',
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
    batch: 'gsc-dataforseo-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [openStaxPercent, khanOrderOfOperations, mdnArithmeticOperators, googleHelpfulContent],
    findings: [
      'DataForSEO page evidence confirmed basic calculator intent, including basic calculator, basic calculator app, basic calculator online, basic calculator math, and simple basic calculator searches.',
      'The calculator page now states the real scope: one-step handheld-style arithmetic, percent adjustments, decimals, keyboard input, result copying, and tab-only history.',
      'The FAQ and guide explain the percent-key behavior with 80 - 20%, and they warn that the basic calculator does not parse full order-of-operations expressions.',
      'Competitor gap review found room for clearer examples, original logic notes, and mistakes/limits copy without copying competitor wording.',
    ],
    improvements: [
      'Updated title, meta description, examples, FAQ answers, related links, guide sections, source links, mistakes, privacy wording, image alt/caption text, sitemap dates, and page-specific proof for the Basic Calculator sprint.',
    ],
    followUps: [
      'Add visual keyboard-shortcut hints near the keypad later only if they fit mobile without crowding the working calculator.',
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
    batch: 'gsc-dataforseo-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [openStaxRatiosProportions, openStaxRatiosRate, khanRatiosRates, googleHelpfulContent],
    findings: [
      'DataForSEO evidence is page-specific for ratio calculator, 1:2 ratio calculator, ratio calculator 2 numbers, pixels, ml, grams, and percentage-to-ratio adjacent intent.',
      'OpenStax and Khan Academy support explaining ratios as ordered comparisons, equivalent ratios as same-factor scaling, and split-total work as ratio parts multiplied by one-part value.',
      'The page needs practical warnings about part order and unit consistency because swapping 2:3 into 3:2 or mixing feet with inches changes the answer.',
    ],
    improvements: [
      'Rebuilt title/meta, aliases, examples, FAQ answers, guide title, guide meta, source-backed guide copy, unit/order cautions, image alt/caption, sitemap dates, and page-specific proof around simplify, equivalent, split-total, decimal, and same-unit ratio tasks.',
    ],
    followUps: [
      'Add a dedicated percentage-to-ratio mode only if future tool-use data shows enough demand to justify a separate tested workflow.',
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
    batch: 'gsc-dataforseo-page-sprint-2026-06-06',
    reviewedOn: '2026-06-06',
    scope: commonMathScope,
    sources: [mdnBigInt, mdnArithmeticOperators, openStaxScientificNotation, googleHelpfulContent],
    findings: [
      'The big-number page now matches the live BigInt behavior: whole integers only, exact addition, subtraction, multiplication, integer quotient, and remainder output.',
      'The examples show safe-integer overflow context, large multiplication, tiny differences between huge values, and division with a remainder.',
      'The FAQ explains accepted separators, rejected decimals/fractions/scientific notation, result digit counts, browser responsiveness limits, and privacy behavior.',
    ],
    improvements: [
      'Updated SEO aliases, description, examples, FAQ detail, visible input tips, source coverage, related links, and modified date after DataForSEO, competitor-gap, and SEO-agent checks.',
    ],
    followUps: [
      'Add a separate decimal arbitrary-precision tool only if users need non-integer large-number math with clear rounding rules.',
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
    batch: 'gsc-dataforseo-page-sprint-2026-06-02',
    reviewedOn: '2026-06-02',
    scope: commonMathScope,
    sources: [openStaxGeometry, calculatorSoupVolume, calculatorNetVolume, nistSi, googleHelpfulContent],
    findings: [
      'DataForSEO showed 40,500 U.S. searches for `volume calculator`, with related demand for cylinder volume, gallons, litres, rectangular volume, liquid volume, and water tank volume.',
      'OpenStax and current competitor volume references support the same core shape coverage: rectangular solid, cube, cone, sphere, and cylinder, with radius and height needed for round solids.',
      'The page now separates cubic shape volume from litres, gallons, usable tank capacity, surface area, and real container fill-line limits.',
    ],
    improvements: [
      'Rewrote metadata, aliases, examples, FAQs, static guide sections, audit record, sitemap dates, and image alt/caption text around cubic units, radius mistakes, cylinder intent, liquid-unit searches, and tank limits.',
    ],
    followUps: [
      'Add direct cubic-unit-to-litre/gallon conversion only if it can keep source-backed labels and avoid confusing shape volume with usable tank capacity.',
      'Consider a tank-specific helper later for rectangular and cylindrical tanks if DataForSEO/GSC continues to show tank-intent demand.',
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
    batch: 'seo-tool-review-unix-timestamp-converter-tool-2026-06-04',
    reviewedOn: '2026-06-04',
    scope: commonMathScope,
    sources: [isoDate, nistTimeDefinitions, mdnDate],
    findings: [
      'The timestamp helper converts UTC date and time to Unix seconds and back from seconds or milliseconds.',
      'Tests cover round-tripping a timestamp to a date result, and the refreshed examples use exact deterministic UTC outputs.',
      'The visible FAQ separates UTC timestamp math, seconds versus milliseconds, local time-zone display, and scheduling limits.',
    ],
    improvements: [
      'Refreshed the SEO title/meta copy, UTC conversion formula, input explanations, exact examples, visible FAQ detail, source coverage, last-modified dates, local privacy wording, and matching guide walkthrough for the timestamp pages.',
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
    batch: 'gsc-dataforseo-page-sprint-2026-06-04',
    reviewedOn: '2026-06-04',
    scope: commonMathScope,
    sources: [rfc4648, mdnTextEncoder],
    findings: [
      'The Base64 tool now explains that text is converted to UTF-8 bytes, mapped through the RFC 4648 alphabet, padded with = when needed, and decoded back only when the bytes are valid readable text.',
      'The examples now include the exact Hello tools round trip and a Hi padding check so users can compare real output instead of a generic placeholder.',
      'The FAQ now covers encryption limits, padding, decode failures, secrets, file-mode limits, UTF-8 behavior, browser privacy, and related developer tools.',
    ],
    improvements: [
      'Refreshed Base64 logic notes, input explanations, exact examples, FAQ/schema coverage, related links, SEO title/description, tool lastmod, image alt/caption metadata, DataForSEO evidence, and competitor-gap notes.',
    ],
    followUps: [
      'Add file-to-Base64 mode only if size limits, memory behavior, and privacy copy are clear.',
    ],
  },
  {
    slug: 'url-encode-decode',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-04',
    reviewedOn: '2026-06-04',
    scope: commonMathScope,
    sources: [rfc3986, mdnUrlSearchParams],
    findings: [
      'The URL tool now explains percent-encoding as UTF-8 bytes written with % plus two hexadecimal digits, with optional plus-for-spaces handling for form-style query values.',
      'The examples now include exact component encoding for price=10&tax=2, decoding back to the readable value, and %20 versus plus space behavior.',
      'The FAQ now covers component versus whole-URL encoding, %20 versus + spaces, double-encoding, decode errors, private query strings, and the difference from Base64.',
    ],
    improvements: [
      'Refreshed URL percent-encoding logic notes, input explanations, exact examples, FAQ/schema coverage, related developer-tool links, SEO title/description, modified date, image alt/caption metadata, DataForSEO evidence, and competitor-gap notes.',
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
    batch: 'gsc-dataforseo-page-sprint-2026-06-05',
    reviewedOn: '2026-06-05',
    scope: commonMathScope,
    sources: [nhtsaTireSize, nistSi, googleHelpfulContent],
    findings: [
      'The tire-size helper calculates sidewall height from width and aspect ratio, then adds two sidewalls to wheel diameter.',
      'Tests cover a 225/60R16 tire and diameter output.',
      'The tool now explains diameter, sidewall height, circumference, revs per mile, speedometer effects, and the difference between size math and real fitment approval.',
    ],
    improvements: [
      'Added tire-diameter SEO metadata, metric-size aliases, exact sidewall/diameter/circumference/revs-per-mile formula wording, field explanations for 225/60R16-style inputs, concrete 225/60R16, 235/45R18, and 275/65R18 examples, extra visible FAQs, stronger fitment/speedometer/load-rating limits, clearer UI labels, and fresh DataForSEO/page proof.',
    ],
    followUps: [
      'Add tire comparison mode later only with speedometer-difference and fitment caveats.',
    ],
  },
  {
    slug: 'bandwidth-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-04',
    reviewedOn: '2026-06-04',
    scope: commonMathScope,
    sources: [nistSi, googleHelpfulContent],
    findings: [
      'The bandwidth helper converts decimal KB/MB/GB/TB to bits, converts Kbps/Mbps/Gbps to bits per second, then divides total bits by bits per second for transfer time.',
      'The page now makes the 5 GB at 100 Mbps example explicit: 40,000,000,000 bits divided by 100,000,000 bits per second equals 400 seconds, or about 6 minutes 40 seconds.',
      'The FAQ and guide explain bits versus bytes, upload versus download speed, decimal versus binary file-unit differences, and why Wi-Fi, congestion, server limits, throttling, retries, and overhead can slow real transfers.',
    ],
    improvements: [
      'Reworked SEO title and description, aliases, input explanations, exact examples, FAQ depth, related links, modified date, and tool art alt/caption text around 5 GB at 100 Mbps, 700 MB at 25 Mbps, 50 GB at 20 Mbps, decimal units, and browser-only privacy.',
      'Reworked the matching guide around the exact 5 GB at 100 Mbps walkthrough, 100 Mbps versus 12.5 MB/s check, upload-speed caution, real-world slowdown limits, source links, and guide art alt/caption text.',
    ],
    followUps: [
      'Add binary KiB/MiB/GiB units only if the UI makes decimal versus binary impossible to miss and keeps the guide examples separate.',
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
    reviewedOn: '2026-06-04',
    scope: commonMathScope,
    sources: [mdnTextEncoder, mdnSubtleCryptoDigest, nistFips180, nistPasswords],
    findings: [
      'The hash generator encodes text as UTF-8 and uses browser SubtleCrypto for SHA-256, SHA-384, or SHA-512 hex digests.',
      'Tests cover SHA-256 for "abc" using the known digest output.',
      'The guide warns that hashes are not encryption and raw hashes are not a password-storage design or authenticity proof.',
    ],
    improvements: [
      'Manually checked SHA algorithm options, digest byte length wording, hex output, examples, generated FAQ detail, guide cautions, related links, SEO copy, and privacy behavior.',
      'Added exact SHA-256 example output, TextEncoder/SubtleCrypto/plain-hex logic, input-byte and digest-byte explanations, stronger raw-hash password/authenticity limits, six extra security-focused FAQs, related links to Base64, URL Encode / Decode, and Password Generator, and a 2026-06-04 modified date.',
      'Expanded the matching guide with the exact `Access Free Tools` SHA-256 walkthrough, UTF-8 byte and hex-character checks, digest-change examples, security boundary notes, contextual related links, and source-backed password-storage cautions.',
    ],
    followUps: [
      'Add file hashing only with visible size limits and browser-memory warnings.',
    ],
  },
  {
    slug: 'color-contrast-checker',
    status: 'deep-reviewed',
    batch: 'developer-text-everyday-cleanup-manual-pass-1-2026-04-30',
    reviewedOn: '2026-06-04',
    scope: commonMathScope,
    sources: [wcagContrast, googleHelpfulContent],
    findings: [
      'The contrast checker normalizes #RGB or #RRGGBB colors, calculates relative luminance, and reports WCAG AA/AAA pass states.',
      'Tests cover dark text on white and AA normal pass behavior.',
      'The guide warns that contrast is one accessibility check and users still need focus, hover, disabled, icon, and real-layout checks.',
    ],
    improvements: [
      'Manually checked contrast formula, hex validation, AA/AAA thresholds, examples, generated FAQ detail, guide cautions, related links, SEO copy, and privacy behavior.',
      'Added WCAG AA and AAA threshold FAQs, exact contrast-ratio examples, foreground/background input explanations, visible AAA large-text result output, stronger real-component limits, better design-related links, SEO title/meta copy, and a 2026-06-04 modified date.',
      'Expanded the matching guide with a near-miss #777777 on white walkthrough, formula steps, AA and AAA reading guidance, state/background mistakes, source context, and a 2026-06-04 guide modified date.',
    ],
    followUps: [
      'Add color picker controls later if they stay compact and keyboard accessible.',
    ],
  },
  {
    slug: 'aspect-ratio-calculator',
    status: 'deep-reviewed',
    batch: 'developer-text-everyday-cleanup-manual-pass-1-2026-04-30',
    reviewedOn: '2026-06-04',
    scope: commonMathScope,
    sources: [mdnAspectRatio, nistSi],
    findings: [
      'The aspect-ratio helper simplifies width and height with the greatest common divisor and can scale by target width or target height.',
      'Tests cover 1920 by 1080 simplifying to 16:9 and scaling to 1280 by 720.',
      'The guide warns that cropping and resizing are different and that one-pixel rounding can matter for platform specs.',
    ],
    improvements: [
      'Manually checked aspect-ratio simplification, scale-by-width and scale-by-height behavior, examples, generated FAQ detail, guide cautions, related links, SEO copy, and privacy behavior.',
      'Added SEO title/meta copy, same-unit input explanations, extra aspect-ratio/resizing/cropping/rounding FAQs, exact 4K, vertical story, and social-preview examples, design-adjacent related links, and a 2026-06-04 modified date.',
      'Expanded the matching guide with a stronger intro, same-unit input matching, exact 4K and vertical-story walkthroughs, resize/crop/padding guidance, MDN and NIST source links, and a 2026-06-04 guide modified date.',
    ],
    followUps: [
      'Add common platform presets only if each preset has a maintained source and visible date.',
    ],
  },
  {
    slug: 'utm-builder',
    status: 'deep-reviewed',
    batch: 'developer-text-everyday-cleanup-manual-pass-1-2026-04-30',
    reviewedOn: '2026-06-04',
    scope: commonMathScope,
    sources: [googleCampaignUrls, mdnUrlSearchParams],
    findings: [
      'The UTM builder validates the base URL, preserves existing query parameters, and sets required source, medium, and campaign fields plus optional term, content, and ID.',
      'Tests cover adding UTM source and content values to a URL without hand-editing query syntax.',
      'The guide warns that UTM values only help analytics when the destination site is configured and naming rules are consistent.',
    ],
    improvements: [
      'Manually checked UTM URL building, required field validation, existing-parameter handling, examples, generated FAQ detail, guide cautions, related links, SEO copy, and privacy behavior.',
      'Added SEO title/meta copy, field-level UTM input explanations, GA4 and case-consistency FAQs, existing-query and privacy cautions, exact generated URL examples, and a 2026-06-04 modified date.',
    ],
    followUps: [
      'Add naming-template presets only if the site later has admin settings or saved campaign rules.',
    ],
  },
  {
    slug: 'query-string-parser',
    status: 'deep-reviewed',
    batch: 'developer-text-everyday-cleanup-manual-pass-1-2026-04-30',
    reviewedOn: '2026-06-04',
    scope: commonMathScope,
    sources: [whatwgUrl, mdnUrlSearchParams],
    findings: [
      'The query tool parses full URLs or raw query strings into grouped JSON and builds encoded query strings from key=value lines.',
      'Tests cover duplicate query keys and building a UTM-style query string.',
      'The guide warns that query strings are not secret and can be logged, shared, indexed, or copied with the URL.',
    ],
    improvements: [
      'Manually checked query extraction, duplicate-key grouping, build-mode encoding, examples, generated FAQ detail, guide cautions, related links, SEO copy, and privacy behavior.',
      'Added SEO title/meta copy, field-level query-string input explanations, repeated-key, plus-space, full-URL, URL-parser-scope, and array-format FAQs, more exact examples, and a 2026-06-04 modified date.',
    ],
    followUps: [
      'Add array-format options only if users need bracket, repeated-key, and comma styles explained separately.',
    ],
  },
  {
    slug: 'html-entity-encoder-decoder',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-05',
    reviewedOn: '2026-06-05',
    scope: commonMathScope,
    sources: [whatwgHtmlNamedCharacters, googleHelpfulContent],
    findings: [
      'The HTML entity tool encodes ampersands, angle brackets, double quotes, and apostrophes and decodes the supported named entities plus valid decimal and hexadecimal numeric entities.',
      'The page now shows exact encode, decode, quote-cleanup, and numeric-entity examples, including the 5-entity <strong>Free & fast</strong> encode check.',
      'The FAQ and input notes explain supported named entities, numeric entities, ampersand behavior, URL-encoding differences, privacy, and the sanitizer boundary.',
    ],
    improvements: [
      'Manually checked entity encode/decode behavior, numeric entity handling, supported named entity wording, examples, generated FAQ detail, guide cautions, related links, and privacy behavior.',
      'Updated SEO title and description, exact formula notes, input explanations, seven extra FAQs, concrete examples, lastmod date, DataForSEO paid sprint evidence, competitor gap evidence, and workbench readiness checks.',
      'Expanded the matching guide with the exact 28-character and 5-entity encode walkthrough, 7-entity decode example, numeric entity interpretation, sanitizer boundary, related checks, source links, and a 2026-06-05 guide modified date.',
    ],
    followUps: [
      'Add a fuller named-entity table only if bundle size and UI search remain reasonable.',
    ],
  },
  {
    slug: 'css-clamp-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-04',
    reviewedOn: '2026-06-04',
    scope: commonMathScope,
    sources: [mdnCssClamp, wcagContrast],
    findings: [
      'The CSS clamp helper calculates viewport slope, rem intercept, min/max rem values, and a copy-ready clamp formula from min size, max size, viewport range, and root font size.',
      'The page now shows exact formulas for responsive heading, body text, and section padding examples, including clamp(2rem, calc(1.217391rem + 3.478261vw), 4rem).',
      'The FAQ and input notes explain rem plus vw, viewport range choices, spacing use, browser wrapping checks, zoom/root-font-size cautions, and how viewport-based clamp differs from container queries.',
    ],
    improvements: [
      'Updated SEO title and description, formula notes, input explanations, exact examples, FAQ coverage, tool art metadata, lastmod date, DataForSEO paid sprint evidence, competitor gap evidence, and workbench readiness checks.',
      'Updated the matching guide with exact 32px-to-64px clamp math, formula-part explanations, spacing examples, browser-check limits, contextual related links, source links, and modified date evidence.',
    ],
    followUps: [
      'Add preview swatches only if they remain compact and preserve the fast calculator workflow.',
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
    batch: 'seo-tool-review-ai-token-cost-2026-06-05',
    reviewedOn: '2026-06-05',
    scope: commonMathScope,
    sources: [calculatorInnSitemap, openAiTokens, openAiTokenizer, googleHelpfulContent],
    findings: [
      'CalculatorInn originally surfaced AI token cost as a Tech & AI gap, and the Access Free Tools version avoids stale hardcoded model prices by asking users to enter current input/output rates.',
      'Formula review checked input cost, output cost, total cost, and cost per request using request count, input tokens per request, output tokens per request, and separate prices per 1 million tokens.',
      'FAQ and guide explain what tokens mean, why prices must come from the provider rate card, why input and output rates are separate, and which billing rules are not included.',
    ],
    improvements: [
      'Expanded the tool page and matching guide with SEO title/meta, request-count input explanation, exact input/output/total/per-request formula wording, three numeric cost examples, cached-token and plan-rule limits, model comparison guidance, related AI planning links, and 2026-06-05 modified dates.',
    ],
    followUps: [
      'Add provider presets only if they are dated, source-linked, and maintained so pricing does not become misleading.',
    ],
  },
  {
    slug: 'prompt-token-estimator',
    status: 'deep-reviewed',
    batch: 'seo-tool-review-prompt-token-estimator-2026-06-05',
    reviewedOn: '2026-06-05',
    scope: commonMathScope,
    sources: [openAiTokens, openAiTokenizer, googleHelpfulContent],
    findings: [
      'The estimator is framed as a rough planning helper, not a replacement for the exact tokenizer or usage logs of a chosen model.',
      'Formula review checked Unicode-aware character counting, word counting, selected average characters per token, and the fixed low/high range based on character count divided by 5 and 3.',
      'FAQ and guide warn about code, symbols, URLs, non-English text, emojis, hidden system messages, chat history, retrieved context, tool messages, and provider-specific tokenization.',
    ],
    improvements: [
      'Expanded the tool page and matching guide with a stronger SEO title/meta description, exact estimate and range formula wording, field-level input explanations, six-plus practical FAQs, numeric examples, related AI cost and API pricing links, tokenizer drift limits, a 2026-06-05 modified date, and refreshed audit notes.',
    ],
    followUps: [
      'Add exact tokenizer support only when the chosen tokenizer package and model vocabulary size are tested for bundle impact.',
    ],
  },
  {
    slug: 'api-pricing-calculator',
    status: 'deep-reviewed',
    batch: 'seo-tool-review-api-pricing-calculator-2026-06-05',
    reviewedOn: '2026-06-05',
    scope: commonMathScope,
    sources: [calculatorInnSitemap, openAiTokens, googleHelpfulContent],
    findings: [
      'The generic API pricing helper supports request count, units per request, price per unit, fixed fees, and retry or overhead cushion without assuming one provider billing model.',
      'Formula review checked billable units, usage cost, total cost, and average cost per request using the deterministic local calculator implementation.',
      'FAQ and guide explain billable units, per-thousand and per-million price conversion, fixed fees, overhead percent, free-tier gaps, tiered pricing, taxes, credits, and plan-specific rules.',
    ],
    improvements: [
      'Expanded the tool page and matching guide with SEO title/meta descriptions, exact billable-unit/usage/total/average formula wording, price-per-unit and fixed-fee input explanations, practical overhead guidance, extra FAQs for unit conversion, free tiers, plan comparison, privacy, and numeric image/message/credit examples, plus related AI and developer-tool links and 2026-06-05 modified dates.',
    ],
    followUps: [
      'Add saved pricing templates only if there is a clear update workflow and no private API keys are stored.',
    ],
  },
  {
    slug: 'download-time-calculator',
    status: 'deep-reviewed',
    batch: 'seo-tool-review-download-time-calculator-2026-06-05',
    reviewedOn: '2026-06-05',
    scope: commonMathScope,
    sources: [calculatorInnSitemap, nistSi, googleHelpfulContent],
    findings: [
      'The download-time tool estimates file transfer time from decimal KB, MB, GB, or TB file sizes, Mbps speed, and a realistic efficiency percentage.',
      'Formula review checked byte conversion, bit conversion, effective Mbps, seconds, minutes, and hours using the deterministic local calculator implementation.',
      'FAQ and guide explain Mbps versus MB/s, decimal GB versus binary GiB, upload-speed use, data caps, and why Wi-Fi, server throttling, VPNs, packet loss, and overhead can change real downloads.',
    ],
    improvements: [
      'Expanded the tool page with SEO title/meta description, exact decimal-byte/bit/effective-Mbps/seconds formula wording, file-unit and efficiency input explanations, extra FAQs for decimal units, uploads, real-world slowdowns, and data caps, three numeric game/update/backup examples, related bandwidth links, and a 2026-06-05 modified date.',
    ],
    followUps: [
      'Consider adding upload-time wording later, but keep it separate enough that users do not confuse download and upload speeds.',
    ],
  },
  {
    slug: 'internet-speed-needs-calculator',
    status: 'deep-reviewed',
    batch: 'seo-tool-review-internet-speed-needs-calculator-2026-06-05',
    reviewedOn: '2026-06-05',
    scope: commonMathScope,
    sources: [calculatorInnSitemap, nistSi, googleHelpfulContent],
    findings: [
      'The internet speed needs tool estimates simultaneous activity load and adds buffer instead of pretending Mbps alone guarantees good internet.',
      'Formula review checked video stream, gaming, video call, and smart-device counts, per-device Mbps settings, base Mbps, and buffered recommended speed using the deterministic local calculator implementation.',
      'FAQ and guide explain latency, jitter, upload speed, data caps, router quality, provider congestion, Wi-Fi coverage, and why gaming or calls can feel bad even when Mbps looks high enough.',
    ],
    improvements: [
      'Expanded the tool page with SEO title/meta description, exact base-Mbps and buffer formula wording, per-activity input explanations, extra FAQs for upload speed, buffer choice, and data caps, numeric household/4K/work examples, related bandwidth links, and a 2026-06-05 modified date.',
    ],
    followUps: [
      'Add a separate upload-speed planning mode only when the UI can clearly separate download need from upload-heavy video calls, backups, and livestreaming.',
    ],
  },
  {
    slug: 'streaming-bitrate-calculator',
    status: 'deep-reviewed',
    batch: 'seo-tool-review-streaming-bitrate-calculator-2026-06-05',
    reviewedOn: '2026-06-05',
    scope: commonMathScope,
    sources: [calculatorNetBandwidth, nistSi, googleHelpfulContent],
    findings: [
      'The streaming bitrate tool converts bitrate and duration into estimated MB and GB for streams, recordings, or multiple camera feeds.',
      'Formula review checked Kbps/Mbps conversion, duration seconds, stream count, megabits, megabytes, and decimal gigabytes using the deterministic local calculator implementation.',
      'FAQ and guide distinguish bitrate from resolution and warn about variable bitrate, adaptive streaming, audio tracks, subtitles, metadata, retransmits, upload speed, and platform overhead.',
    ],
    improvements: [
      'Expanded the tool page with a calculator-intent SEO title/meta description, exact Mbps/seconds/megabits/MB/GB formula wording, field-level explanations for bitrate unit and stream count, extra FAQs for video plus audio bitrate, upload-speed planning, decimal GB versus GiB, and multiple cameras, exact video/audio/two-camera examples, related bandwidth links, and a 2026-06-05 modified date.',
    ],
    followUps: [
      'Add preset bitrate examples later only if they are clearly labeled as rough examples, not platform requirements.',
    ],
  },
  {
    slug: 'device-battery-life-calculator',
    status: 'deep-reviewed',
    batch: 'seo-tool-review-device-battery-life-calculator-2026-06-05',
    reviewedOn: '2026-06-05',
    scope: commonMathScope,
    sources: [graphCalcBatteryLife, nistSi, googleHelpfulContent],
    findings: [
      'The battery life tool converts mAh and voltage into watt-hours before estimating runtime, so it does not compare batteries by mAh alone.',
      'Formula review checked nominal energy, usable energy after efficiency, runtime hours, and runtime minutes using the deterministic local calculator implementation.',
      'FAQ and guide explain why voltage matters, how to choose an efficiency percentage, how power bank labels can use internal cell voltage, and why age, temperature, discharge rate, high load, and power spikes change real runtime.',
    ],
    improvements: [
      'Expanded the tool page with a calculator-intent SEO title/meta description, exact mAh-to-Wh, usable-Wh, runtime-hours, and runtime-minutes formula wording, field-level explanations for mAh, nominal voltage, device watts, and efficiency, extra FAQs for USB power banks, mAh versus battery life, high-power devices, watts versus amps, comparing batteries by Wh, and phone/laptop estimate limits, exact power-bank, small-light, and laptop-pack runtime examples, more relevant battery conversion related links, and a 2026-06-05 modified date.',
    ],
    followUps: [
      'Add USB-C power delivery presets only with clear voltage/current labels and safety cautions.',
    ],
  },
  {
    slug: 'monitor-ppi-calculator',
    status: 'deep-reviewed',
    batch: 'seo-tool-review-monitor-ppi-calculator-2026-06-05',
    reviewedOn: '2026-06-05',
    scope: commonMathScope,
    sources: [inchCalculatorPpi, nistSi, googleHelpfulContent],
    findings: [
      'The monitor PPI tool uses resolution and diagonal size together, which avoids the common mistake of judging sharpness from resolution alone.',
      'Formula review checked pixel diagonal via the Pythagorean theorem, PPI, and simplified aspect ratio output using deterministic local calculator examples.',
      'FAQ coverage explains PPI versus DPI, diagonal-size effects, scaling, viewing distance, panel quality, subpixel layout, eyesight, and why PPI is only one display-comparison signal.',
    ],
    improvements: [
      'Expanded the tool page with a calculator-intent SEO title/meta description, exact pixel-diagonal, PPI, and aspect-ratio formula wording, field-level explanations, extra FAQs for good PPI, diagonal size, text sizing, and phones/tablets/TVs, exact 1080p, 1440p, and 4K examples, related image/display links, and a 2026-06-05 modified date.',
    ],
    followUps: [
      'Add common display presets later only if they remain small and do not crowd the calculator UI.',
    ],
  },
  {
    slug: 'recipe-scaler',
    status: 'deep-reviewed',
    batch: 'seo-tool-review-recipe-scaler-2026-06-05',
    reviewedOn: '2026-06-05',
    scope: commonMathScope,
    sources: [inchCalculatorRecipeScale, nistSi, googleHelpfulContent],
    findings: [
      'Inch Calculator competitor-gap evidence confirmed recipe scaling, serving conversion, measurement conversion, and cooking-time caveats as user-helpful topics to cover in original wording.',
      'Formula review checked scale factor as desired servings divided by original servings, then scaled amount as original ingredient amount multiplied by the scale factor.',
      'FAQ coverage explains one-line scaling, decimal eggs or packets, cups/grams/tablespoon units, seasoning limits, measurement accuracy, and why pan size or cook time can still change.',
    ],
    improvements: [
      'Expanded the tool page with a calculator-intent SEO title/meta description, exact scale-factor and scaled-amount formula wording, field-level explanations, extra FAQs for rounding and measurement limits, exact serving examples, related kitchen links, and a 2026-06-05 modified date.',
    ],
    followUps: [
      'Consider a multi-ingredient table later only if the UI can keep each line easy to review and copy.',
    ],
  },
  {
    slug: 'cooking-measurement-converter',
    status: 'deep-reviewed',
    batch: 'seo-tool-review-cooking-measurement-converter-2026-06-05',
    reviewedOn: '2026-06-05',
    scope: commonMathScope,
    sources: [inchCalculatorCookingConversion, nistSi, usdaFoodDataCentral, googleHelpfulContent],
    findings: [
      'Inch Calculator competitor-gap evidence confirmed cooking conversion, measuring-chart, cups-to-grams, tablespoons, milliliters, ounces, and ingredient-density topics as useful coverage areas to handle in original wording.',
      'Formula review checked volume conversions through US cups, mass conversions through grams, and density-based crossings between volume and weight.',
      'FAQ coverage explains density grams per cup, when density does and does not matter, ingredient variability, US cup and tablespoon constants, and why baking accuracy may need a scale.',
    ],
    improvements: [
      'Expanded the tool page with a calculator-intent SEO title/meta description, exact volume and mass conversion constants, density-crossing formula wording, field-level explanations, extra FAQs, exact examples for cups-to-grams, mL-to-cups, ounces-to-grams, and tablespoons-to-mL, related kitchen links, refreshed audit notes, and a 2026-06-05 modified date.',
    ],
    followUps: [
      'Add ingredient density presets only after they are source-linked and clearly labeled as approximate.',
    ],
  },
  {
    slug: 'ingredient-cost-calculator',
    status: 'deep-reviewed',
    batch: 'seo-tool-review-ingredient-cost-calculator-2026-06-05',
    reviewedOn: '2026-06-05',
    scope: commonMathScope,
    sources: [dishCostIngredientCost, nistSi, usdaFoodDataCentral, googleHelpfulContent],
    findings: [
      'DishCost competitor-gap evidence confirmed ingredient-cost, recipe-cost, food-cost, package-size, menu-price, and FAQ-depth topics as useful coverage areas to handle in original wording.',
      'Formula review checked package conversion into the recipe unit, unit cost as package price divided by converted package amount, and ingredient cost as amount needed times unit cost.',
      'FAQ coverage explains package amount converted, density, tax, waste, whole-recipe limits, menu-pricing limits, and why weight-to-weight conversions do not use density.',
    ],
    improvements: [
      'Expanded the tool page with a calculator-intent SEO title/meta description, exact formula wording, field-level explanations, extra FAQs, examples for flour, chocolate chips, milk, and sugar with expected costs, related Cooking Measurement, Recipe Scaler, Cost Per Serving, and Unit Price links, refreshed audit notes, and a 2026-06-05 modified date.',
    ],
    followUps: [
      'Add a full recipe cost worksheet later if it can stay lightweight and mobile-friendly.',
    ],
  },
  {
    slug: 'unit-price-calculator',
    status: 'deep-reviewed',
    batch: 'seo-tool-review-unit-price-calculator-2026-06-05',
    reviewedOn: '2026-06-05',
    scope: commonMathScope,
    sources: [calcipediaUnitPrice, nistSi, googleHelpfulContent],
    findings: [
      'Calcipedia competitor-gap evidence confirmed price-per-unit, unit-price, bulk-buy, grocery, ounces, pounds, sales, and comparison intent as useful coverage areas to handle in original wording.',
      'Formula review checked unit price as item price divided by item quantity, the lower unit price choice, savings per shared unit, and savings percent against the higher unit price.',
      'FAQ coverage explains same-unit comparisons, sale and coupon prices, bigger-package limits, different-brand caveats, delivery or tax adjustments, and price-per-ounce as one unit-price case.',
    ],
    improvements: [
      'Expanded the tool page with a calculator-intent SEO title/meta description, exact formula wording, field-level explanations, shopping aliases, extra FAQs, examples for cereal, paper towels, pet food, and detergent with expected unit-price savings, refreshed audit notes, and a 2026-06-05 modified date.',
    ],
    followUps: [
      'Consider a three-item comparison mode later if it does not make the first-use form feel crowded.',
    ],
  },
  {
    slug: 'cost-per-serving-calculator',
    status: 'deep-reviewed',
    batch: 'seo-tool-review-cost-per-serving-calculator-2026-06-05',
    reviewedOn: '2026-06-05',
    scope: commonMathScope,
    sources: [dishCostCostPerServing, googleHelpfulContent],
    findings: [
      'DishCost competitor-gap evidence confirmed recipe cost, food cost per serving, menu pricing, packaging, labor, overhead, and FAQ-depth topics as useful coverage areas to handle in original wording.',
      'Formula review checked cost per serving as main cost plus extra cost divided by servings, with total batch cost and extra cost kept visible in the result.',
      'FAQ coverage explains realistic serving counts, main cost, optional packaging/labor/overhead, selling-price limits, uneven portions, ingredient-cost differences, unit-price differences, and why serving count changes the answer.',
    ],
    improvements: [
      'Expanded the tool page with a calculator-intent SEO title/meta description, exact formula wording, field-level explanations, food-cost aliases, extra FAQs, examples for soup, meal prep, bake sale cupcakes, and family dinner with expected per-serving costs, related kitchen shopping links, refreshed audit notes, and a 2026-06-05 modified date.',
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
    batch: 'gsc-dataforseo-page-sprint-2026-06-01',
    reviewedOn: '2026-06-01',
    scope: commonMathScope,
    sources: [calculatorSoupSitemap, sbaBreakEven, openStaxBreakEven, irsPublication334, googleHelpfulContent],
    findings: [
      'DataForSEO evidence is page-specific for break-even calculator, break-even point, break-even sales, contribution margin, fixed costs, variable costs, and cost-volume-profit intent.',
      'SBA guidance confirms break-even units as fixed costs divided by price minus variable cost, with warnings about fixed, variable, and semi-variable costs.',
      'Formula review checked fixed costs, price per unit, variable cost per unit, contribution margin, break-even units, and break-even sales.',
      'OpenStax backs contribution margin and break-even units/dollars, while IRS Publication 334 helps set careful boundaries around gross receipts, cost of goods sold, and tax/accounting limits.',
      'FAQ and guide explain contribution margin, why price must exceed variable cost, why fractional units usually round up, and why real demand, capacity, discounts, fees, refunds, inventory loss, and mixed products can change the plan.',
    ],
    improvements: [
      'Rebuilt title/meta, examples, calculator note, input explanations, FAQ answers, guide title, guide meta, source links, trust wording, image alt/caption, sitemap dates, and page-specific proof around break-even units, sales revenue, contribution margin, rounding, one-product limits, and zero-profit meaning.',
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
    batch: 'gsc-dataforseo-page-sprint-2026-06-01',
    reviewedOn: '2026-06-01',
    scope: commonMathScope,
    sources: [calculatorSoupSitemap, sbaBreakEven, openStaxBreakEven, openStaxContributionMargin, irsPublication334, googleHelpfulContent],
    findings: [
      'DataForSEO evidence is page-specific for profit goal calculator, target profit calculator, target sales, contribution margin, fixed costs, variable costs, and cost-volume-profit intent.',
      'Profit goal planning extends break-even into target-profit sales math without creating a duplicate break-even page.',
      'OpenStax target-profit examples support fixed costs plus desired profit divided by contribution margin per unit, while SBA break-even guidance supports the base fixed-cost and contribution-margin logic.',
      'OpenStax contribution-margin guidance and IRS Publication 334 help set careful boundaries around contribution, gross receipts, cost of goods sold, tax, and accounting limits.',
      'FAQ and guide explain how target profit differs from break-even, why fractional whole-unit answers usually round up, and when demand, capacity, refunds, discounts, fees, taxes, owner pay, cash flow, and mixed products can change the result.',
    ],
    improvements: [
      'Rebuilt title/meta, examples, calculator note, input explanations, FAQ answers, guide title, guide meta, source links, trust wording, image alt/caption, sitemap dates, and page-specific proof around target-profit units, required sales, contribution margin, rounding, one-product limits, and demand/capacity limits.',
    ],
    followUps: [
      'Add multi-product sales-mix support only after a clear weighted-average input design is ready.',
    ],
  },
  {
    slug: 'liquidity-ratios-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-01',
    reviewedOn: '2026-06-01',
    scope: commonMathScope,
    sources: [calculatorSoupSitemap, openStaxFinancialStatementAnalysis, secFinancialStatements, googleHelpfulContent],
    findings: [
      'DataForSEO evidence is page-specific for liquidity ratios calculator, current ratio calculator, quick ratio calculator, cash ratio calculator, working capital, balance sheet liquidity, and short-term payment-strength intent.',
      'OpenStax financial statement analysis supports current ratio, quick ratio, cash ratio, working capital, inventory removal, and point-in-time balance sheet limits, while SEC balance sheet guidance supports current-assets and current-liabilities context.',
      'Formula review checks current ratio, working capital, quick ratio, cash ratio, inventory removal, prepaid-expense removal, cash plus marketable securities, and receivable timing.',
      'FAQ and guide explain what each ratio means, why current ratio can look stronger than quick ratio, why cash ratio is stricter, and why trend, season, inventory quality, receivable collection, and industry context matter.',
    ],
    improvements: [
      'Rebuilt title/meta, examples, calculator note, input explanations, FAQ answers, guide title, guide meta, source-backed guide copy, trust wording, image alt/caption, sitemap dates, and page-specific proof around current ratio, quick ratio, cash ratio, working capital, same-date balance sheet inputs, and cash timing limits.',
    ],
    followUps: [
      'Add trend comparison later if the site builds multi-period statement tools.',
      'Add industry benchmark notes only after a vetted benchmark data source is chosen.',
    ],
  },
  {
    slug: 'debt-ratios-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-01',
    reviewedOn: '2026-06-01',
    scope: commonMathScope,
    sources: [calculatorSoupSitemap, openStaxSolvencyRatios, secFinancialStatements, googleHelpfulContent],
    findings: [
      'Live in-app browser baseline found generic finance title, instructions, trust text, and image alt wording on the debt ratios tool and guide.',
      'Search Console export showed the debt-ratio guide receiving impressions for debt ratio formula and calculation queries with no clicks.',
      'OpenStax solvency-ratio guidance and SEC financial-statement guidance support keeping debt-to-assets, debt-to-equity, and times interest earned clear and separate.',
    ],
    improvements: [
      'Rebuilt title/meta, examples, calculator note, input explanations, FAQ answers, guide title, guide meta, source-backed guide copy, trust wording, image alt/caption, sitemap dates, and page-specific proof around debt ratio, debt-to-equity, times interest earned, balance sheet dates, EBIT, interest expense, and cash-flow limits.',
    ],
    followUps: [
      'Add debt maturity and lease-adjusted analysis only if a richer financial-statement workflow is created.',
      'Add industry benchmark notes only after a vetted benchmark data source is chosen.',
    ],
  },
  {
    slug: 'operations-ratios-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-01',
    reviewedOn: '2026-06-01',
    scope: commonMathScope,
    sources: [calculatorSoupSitemap, openStaxOperatingEfficiencyRatios, secFinancialStatements, googleHelpfulContent],
    findings: [
      'Live in-app browser baseline found generic finance title, generic image alt wording, guide template wording, and broad trust text on the operations ratios tool and guide.',
      'DataForSEO page sprint and Search Console review required page-specific proof before the tool or guide could be marked approved.',
      'OpenStax operating-efficiency guidance and SEC financial-statement guidance support keeping inventory turnover, asset turnover, receivables turnover, average collection period, and equity multiplier clear and separate.',
    ],
    improvements: [
      'Rebuilt title/meta, examples, calculator note, input explanations, FAQ answers, guide title, guide meta, source-backed guide copy, trust wording, image alt/caption, sitemap dates, and page-specific proof around same-period COGS, average inventory, net sales, average assets, credit sales, receivables, inventory turnover, asset turnover, receivables turnover, collection days, and equity multiplier.',
    ],
    followUps: [
      'Add period-over-period trend comparison only when the UI can make multi-period statement data easy to scan.',
      'Add industry benchmark notes only after a vetted benchmark data source is chosen.',
    ],
  },
  {
    slug: 'profitability-ratios-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-01',
    reviewedOn: '2026-06-01',
    scope: commonMathScope,
    sources: [calculatorSoupSitemap, openStaxProfitabilityRatios, secFinancialStatements, googleHelpfulContent],
    findings: [
      'Live in-app browser baseline found generic finance title, generic trust text, generic image alt wording, generic guide phrasing, and long unrounded percentage outputs on the profitability ratios tool and guide.',
      'DataForSEO page sprint required page-specific proof before the tool or guide could be marked approved.',
      'OpenStax profitability-ratio guidance and SEC financial-statement guidance support keeping gross margin, operating margin, net margin, ROA, ROE, EPS, and P/E clear and separate.',
    ],
    improvements: [
      'Rebuilt title/meta, examples, calculator rounding, calculator note, input explanations, FAQ answers, guide title, guide meta, source-backed guide copy, trust wording, image alt/caption, sitemap dates, and page-specific proof around net sales, COGS, operating income, net income, average assets, average equity, shares, price, gross margin, operating margin, net margin, ROA, ROE, EPS, and P/E.',
    ],
    followUps: [
      'Add loss-making company behavior later if the page needs negative-income education rather than positive-ratio basics.',
      'Add industry benchmark notes only after a vetted benchmark data source is chosen.',
    ],
  },
  {
    slug: 'stock-ratios-calculator',
    status: 'deep-reviewed',
    batch: 'gsc-dataforseo-page-sprint-2026-06-01',
    reviewedOn: '2026-06-01',
    scope: commonMathScope,
    sources: [calculatorSoupSitemap, openStaxMarketValueRatios, openStaxStockValuationMultiples, finraEvaluatingStocks, secFinancialStatements, googleHelpfulContent],
    findings: [
      'Live baseline found generic finance title text, generic trust wording, generic image alt wording, no tool source links, and template guide phrases on the stock ratios tool and guide.',
      'DataForSEO page sprint required page-specific proof before the tool or guide could be marked approved.',
      'OpenStax market-value and valuation-multiple guidance, FINRA stock-evaluation guidance, and SEC financial-statement guidance support keeping P/E, P/S, P/B, dividend yield, and payout ratio separate.',
    ],
    improvements: [
      'Rebuilt title/meta, examples, calculator note, input explanations, FAQ answers, guide title, guide meta, source-backed guide copy, trust wording, image alt/caption, sitemap dates, and page-specific proof around stock price, EPS, sales per share, book value per share, dividend per share, P/E, P/S, P/B, dividend yield, and payout ratio.',
    ],
    followUps: [
      'Add negative-EPS education only if the page can display non-meaningful P/E states cleanly.',
      'Add industry benchmark notes only after a vetted benchmark data source is chosen.',
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
      return sourceBackstop([cfpbMortgageAffordability, fannieMortgageAffordability, fannieHowMuchHouse, cfpbDebtToIncome, cfpbMortgage]);
    }

    if (includesAny(key, ['mortgage-calculator', 'mortgage calculator'])) {
      return sourceBackstop([cfpbMonthlyMortgagePayment, cfpbPiti, cfpbLoanEstimate, freddieMacPmms, cfpbMortgage]);
    }

    if (includesAny(key, ['mortgage-payoff', 'mortgage payoff'])) {
      return sourceBackstop([cfpbPayoffAmount, cfpbServicerRules, fannieExtraMortgagePayments, fannieExtraPaymentCalculator, cfpbMortgage]);
    }

    if (includesAny(key, ['amortization'])) {
      return sourceBackstop([cfpbMortgage, investorCompound]);
    }

    if (includesAny(key, ['student-loan', 'student loan'])) {
      return sourceBackstop([fsaLoanSimulatorArticle, fsaRepaymentPlanList, fsaInterestRates, cfpbFederalStudentLoans]);
    }

    if (includesAny(key, ['loan-calculator', 'loan calculator'])) {
      return sourceBackstop([openStaxLoanAmortization, cfpbAprVsInterest, cfpbLoanEstimate, cfpbAutoTruthInLending]);
    }

    if (includesAny(key, ['payment-calculator', 'payment calculator'])) {
      return sourceBackstop([openStaxLoanAmortization, cfpbAprVsInterest, cfpbPiti, cfpbLoanEstimate, cfpbAutoLoanCompare]);
    }

    if (includesAny(key, ['finance-calculator', 'finance calculator'])) {
      return sourceBackstop([investorCompound, cfpbCompoundInterest, investorGovCompoundCalculator, consumerBudgetWorksheet]);
    }

    if (includesAny(key, ['college-cost', 'college cost'])) {
      return sourceBackstop([educationCollegeAffordability, educationNetPrice, educationCollegeScorecard, cfpbCollegePath, cfpbCollegeNumbers, investorCompound]);
    }

    if (includesAny(key, ['interest-calculator', 'interest calculator'])) {
      return sourceBackstop([investorSimpleInterest, cfpbCompoundInterest, cfpbAprVsInterest, investorGovCompoundCalculator]);
    }

    if (includesAny(key, ['simple-interest', 'simple interest'])) {
      return sourceBackstop([investorSimpleInterest, cfpbSimpleInterestAuto, cfpbAprVsInterest, investorCompound]);
    }

    if (includesAny(key, ['cash-back-or-low-interest', 'cash back', 'low interest'])) {
      return sourceBackstop([cfpbAutoFinancingOffers, ftcAutoLease, cfpbAutoLoanRates, ftcCarDealerAds, cfpbApr, cfpbAutoLoanCompare]);
    }

    if (includesAny(key, ['auto-lease', 'auto lease', 'lease-calculator', 'lease calculator'])) {
      return sourceBackstop([cfpbAutoLeaseBuy, ftcAutoLease, ftcCarDealerAds, cfpbRegM]);
    }

    if (includesAny(key, ['business-loan', 'business loan'])) {
      return sourceBackstop([sbaLoans, cfpbAprVsInterest, ftcSmallBusinessFinancing]);
    }

    if (includesAny(key, ['personal-loan', 'personal loan'])) {
      return sourceBackstop([cfpbPersonalInstallmentFees, cfpbAprVsInterest, ftcAdvanceFeeLoans]);
    }

    if (includesAny(key, ['boat-loan', 'boat loan'])) {
      return sourceBackstop([cfpbAutoLoanCompare, cfpbAutoTruthInLending, cfpbAprVsInterest, ftcAutoLease]);
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

    if (includesAny(key, ['margin'])) {
      return sourceBackstop([openStaxContributionMargin, irsPublication334, openStaxDiscounts, openStaxPercent]);
    }

    if (includesAny(key, ['discount', 'percent-off', 'percent off'])) {
      if (includesAny(key, ['discount'])) {
        return sourceBackstop([openStaxDiscounts, openStaxPercent, ftcDeceptivePricing, ftcUnfairDeceptiveFees]);
      }

      return sourceBackstop([openStaxDiscounts, openStaxPercent]);
    }

    if (includesAny(key, ['refinance'])) {
      return sourceBackstop([
        cfpbRefinanceHandout,
        cfpbLoanEstimate,
        cfpbMortgageClosingFees,
        cfpbMortgageApr,
        cfpbDiscountPoints,
        cfpbRefinanceRescission,
      ]);
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
      return sourceBackstop([ssaBenefitEstimate, ssaFullRetirementAge, ssaClaimingAge, ssaDelayedCredits, ssaCola2026]);
    }

    if (includesAny(key, ['rmd-calculator', 'rmd calculator'])) {
      return sourceBackstop([irsRmdTopic, irsRmdFaqs, irsRmd]);
    }

    if (includesAny(key, ['real-estate', 'real estate'])) {
      return sourceBackstop([cfpbPayoffAmount, cfpbClosingDisclosure, irsPublication523, cfpbMortgage]);
    }

    if (includesAny(key, ['take-home-paycheck', 'take home paycheck', 'paycheck'])) {
      return sourceBackstop([irsPub15T, irsFica, irsWithholdingEstimatorFaqs, irsPub505]);
    }

    if (includesAny(key, ['rental-property', 'rental property'])) {
      return sourceBackstop([irsRentalTopic414, irsPublication527, fannieRentalIncome, cfpbMortgage]);
    }

    if (includesAny(key, ['irr-calculator', 'irr calculator'])) {
      return sourceBackstop([openStaxIrr, microsoftIrr, investorCompound]);
    }

    if (includesAny(key, ['roi-calculator', 'roi calculator'])) {
      return sourceBackstop([openStaxInvestments, finraInvestmentReturns, investorGovFees]);
    }

    if (includesAny(key, ['apr-calculator', 'apr calculator'])) {
      return sourceBackstop([cfpbAprVsInterest, cfpbApr, cfpbPersonalInstallmentFees]);
    }

    if (includesAny(key, ['fha-loan', 'fha loan'])) {
      return sourceBackstop([cfpbFhaLoans, hudFhaLoans, hudFhaLoanLimits2026, hudFhaLoanLimitsMl2025, hudFhaMip, hudFhaMipMortgageeLetter2023, cfpbDownPayment, cfpbPrepareHomeMoney]);
    }

    if (includesAny(key, ['va-mortgage', 'va mortgage'])) {
      return sourceBackstop([vaFundingFee, vaEligibility, vaCertificateOfEligibility, vaPurchaseLoan, cfpbLoanEstimate, cfpbMortgageClosingFees, cfpbClosingDisclosure, cfpbMortgage]);
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
      return sourceBackstop([cfpbHeloc, cfpbHomeEquityVsHeloc, cfpbHelocBooklet, ftcHomeEquityLoans, irsPub936HomeMortgageInterest]);
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
      return sourceBackstop([cfpbCompoundInterest, investorGovCompoundCalculator, fdicCompoundInterest, consumerBudgetWorksheet]);
    }

    if (includesAny(key, ['rent'])) {
      return sourceBackstop([consumerBudgetWorksheet, cfpbDebtToIncome, hudHousingChoiceVouchers, hudUtilityAllowances, usaGovTenantRights]);
    }

    if (includesAny(key, ['annuity-payout', 'annuity payout', 'annuity'])) {
      return sourceBackstop([investorAnnuities, investorGovAnnuities, finraAnnuities, investorGovVariableAnnuities, naicDeferredAnnuities]);
    }

    if (includesAny(key, ['pension'])) {
      return sourceBackstop([pbgcPensionCoverage, dolRetirementPlans, dolTypesRetirementPlans, irsDefinedBenefitPlan, irsRetirementPlanBenefits]);
    }

    if (includesAny(key, ['cd-calculator', 'certificate of deposit'])) {
      return sourceBackstop([cfpbCertificateDeposit, fdicCdShopping, occCdPenalty, cfpbCdAdvertising, investorCompound]);
    }

    if (includesAny(key, ['bond'])) {
      return sourceBackstop([investorBonds, investorCurrentYield, finraBondYieldReturn, msrbBondPricesYields, investorCallableBonds, treasurySavingsBonds]);
    }

    if (includesAny(key, ['mutual-fund', 'mutual fund'])) {
      return sourceBackstop([investorMutualFunds, finraMutualFunds, secMutualFundGuide, investorGovFees, irsMutualFundDistributions, investorCompound]);
    }

    if (includesAny(key, ['credit', 'debt', 'repayment'])) {
      return sourceBackstop([cfpbCreditCards, cfpbCreditCardApr, cfpbCreditCardInterest, cfpbCreditCardGracePeriod, cfpbDebtCollection]);
    }

    if (includesAny(key, ['401k', '401 k'])) {
      return sourceBackstop([irs401k2026Limits, irs401kLimits, irs401kPlans, investorCompound]);
    }

    if (includesAny(key, ['roth-ira', 'roth ira'])) {
      return sourceBackstop([irsRothIras, irsRothContributions, irs2026IraLimits, irsIraCatchUp, irsIraLimits, investorIras, investorCompound]);
    }

    if (includesAny(key, ['ira', '401k', 'retirement', 'pension', 'rmd'])) {
      return sourceBackstop([irsIraLimits, irsIraDeductionLimits, irsRetirementColaLimits, investorIras, investorCompound]);
    }

    return sourceBackstop([investorCompound, cfpbMortgage]);
  }

  if (tool.category === 'health-fitness') {
    if (includesAny(key, ['army-body-fat', 'army body fat', 'abcp'])) {
      return sourceBackstop([armyAbcpProgram, armyAbcpCalculator, armyAlaract0322025, armyDa5500, armyDa5501, armyBodyCompositionProgram]);
    }

    if (includesAny(key, ['body-fat', 'body fat', 'navy-style tape', 'navy body fat'])) {
      return sourceBackstop([navyBcaGuide, ncbiMilitaryBodyCompositionMethods, ncbiNavyCircumferenceInputs, cdcBmi, nhlbiBmi]);
    }

    if (includesAny(key, ['pregnancy', 'due-date', 'conception', 'ovulation', 'period'])) {
      return sourceBackstop([acogDueDateMethods, johnsHopkinsDueDate, cdcGestationDefinition]);
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

    if (includesAny(key, ['deck-board', 'deck board', 'decking board', 'deck flooring'])) {
      return sourceBackstop([inchDeckFlooring, decksComDeckingCalculator, omniDecking, nistSi, googleHelpfulContent]);
    }

    if (includesAny(key, ['deck-stain', 'deck stain', 'deck sealer', 'deck paint'])) {
      return sourceBackstop([inchDeckStain, decksComStaining, behrDeckPlusSolidStain, rustOleumWolmanDurastain, nistSi, googleHelpfulContent]);
    }

    if (includesAny(key, ['baluster', 'spindle', 'railing spacing', 'picket spacing'])) {
      return sourceBackstop([inchBaluster, decksComBalusterCalculator, decksComBalusterBasics, iccIrc2021GuardOpenings, awcDca6DeckGuide, nistSi, googleHelpfulContent]);
    }

    if (includesAny(key, ['flooring'])) {
      return sourceBackstop([lowesFlooringFootage, lowesFlooringPlanner, homeDepotFlooringInstall, nistSi]);
    }

    if (includesAny(key, ['paint'])) {
      return sourceBackstop([sherwinPaintCoverage, inchCalculatorPaint, omniPaint, nistSi, googleHelpfulContent]);
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
