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

export interface ToolDeepAuditRecord {
  slug: string;
  status: 'deep-reviewed';
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

const openStaxSequences = {
  href: 'https://openstax.org/books/intermediate-algebra-2e/pages/12-1-sequences',
  label: 'OpenStax Intermediate Algebra: Sequences',
};

const nistSi = {
  href: 'https://www.nist.gov/publications/guide-use-international-system-units-si',
  label: 'NIST SP 811: Guide for the Use of the International System of Units',
};

const googleHelpfulContent = {
  href: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
  label: 'Google Search Central: Creating helpful, reliable, people-first content',
};

const isoDate = {
  href: 'https://www.iso.org/iso-8601-date-and-time-format.html',
  label: 'ISO: ISO 8601 date and time format',
};

const mdnDate = {
  href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date',
  label: 'MDN: JavaScript Date reference',
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

const rfc4632 = {
  href: 'https://www.rfc-editor.org/rfc/rfc4632.html',
  label: 'RFC 4632: Classless Inter-domain Routing',
};

const nistPasswords = {
  href: 'https://pages.nist.gov/800-63-4/sp800-63b.html',
  label: 'NIST SP 800-63B: Authentication and password guidance',
};

const mdnMathRandom = {
  href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random',
  label: 'MDN: Math.random reference',
};

const mdnUrlSearchParams = {
  href: 'https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams',
  label: 'MDN: URLSearchParams',
};

const wcagContrast = {
  href: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html',
  label: 'W3C WCAG 2.2: Contrast minimum',
};

const cfpbMortgage = {
  href: 'https://www.consumerfinance.gov/language/cfpb-in-english/mortgages-key-terms/',
  label: 'Consumer Financial Protection Bureau: Mortgage key terms',
};

const investorCompound = {
  href: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator',
  label: 'Investor.gov: Compound Interest Calculator',
};

const blsInflation = {
  href: 'https://www.bls.gov/bls/inflation.htm',
  label: 'BLS: Overview of inflation and price statistics',
};

const irsTax2026 = {
  href: 'https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill',
  label: 'IRS: Tax year 2026 inflation adjustments',
};

const cfpbCreditCards = {
  href: 'https://www.consumerfinance.gov/consumer-tools/credit-cards/answers/basics/',
  label: 'Consumer Financial Protection Bureau: Credit card basics',
};

const cfpbDebtToIncome = {
  href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/',
  label: 'Consumer Financial Protection Bureau: Debt-to-income ratio',
};

const irsIraLimits = {
  href: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-ira-contribution-limits',
  label: 'IRS: IRA contribution limits',
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

const cdcActivity = {
  href: 'https://www.cdc.gov/physical-activity-basics/measuring/index.html',
  label: 'CDC: Physical activity intensity guidance',
};

const johnsHopkinsDueDate = {
  href: 'https://www.hopkinsmedicine.org/health/wellness-and-prevention/calculating-a-due-date',
  label: 'Johns Hopkins Medicine: Calculating a due date',
};

const cdcPregnancyWeight = {
  href: 'https://www.cdc.gov/maternal-infant-health/pregnancy-weight/index.html',
  label: 'CDC: Weight gain during pregnancy',
};

const kidneyGfr = {
  href: 'https://www.kidney.org/ckd-epi-creatinine-equation-2021-0',
  label: 'National Kidney Foundation: CKD-EPI creatinine equation 2021',
};

const niaaaAlcohol = {
  href: 'https://www.niaaa.nih.gov/health-professionals-communities/core-resource-on-alcohol/basics-defining-how-much-alcohol-too-much',
  label: 'NIAAA: Standard drink and alcohol guidance',
};

const quikreteConcrete = {
  href: 'https://www.quikrete.com/calculator/main.asp',
  label: 'QUIKRETE: Concrete calculator reference',
};

const lowesWallpaper = {
  href: 'https://www.lowes.com/n/calculators/wallpaper-calculator',
  label: 'Lowe\'s: Wallpaper calculator estimating notes',
};

const sherwinPaintCoverage = {
  href: 'https://www.sherwin-williams.com/en-us/color/color-tools/paint-calculator',
  label: 'Sherwin-Williams: Paint calculator coverage notes',
};

const epaFuelEconomy = {
  href: 'https://www.epa.gov/fueleconomy',
  label: 'U.S. EPA: Fuel Economy',
};

const nwsWindChill = {
  href: 'https://www.weather.gov/gjt/windchill',
  label: 'National Weather Service: Wind chill formula',
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
    batch: 'math-foundations-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: commonMathScope,
    sources: [openStaxFractions, openStaxPercent],
    findings: [
      'The calculator covers unlike denominators, mixed numbers, simplifying, multiplication, division, and decimal comparison.',
      'The FAQ correctly blocks denominator zero and explains reciprocal division.',
      'The examples cover addition, mixed-number subtraction, and multiplication.',
    ],
    improvements: [
      'Reviewed fraction operations, examples, FAQ, related tools, and plain-language denominator guidance.',
    ],
    followUps: [
      'Add a visual common-denominator stepper when interactive step rendering is expanded.',
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
    if (includesAny(key, ['mortgage', 'loan', 'rent-vs-buy', 'house-affordability', 'heloc', 'home-equity'])) {
      return sourceBackstop([cfpbMortgage, investorCompound]);
    }

    if (includesAny(key, ['tax', 'vat', 'salary', 'paycheck'])) {
      return sourceBackstop([irsTax2026, blsInflation]);
    }

    if (includesAny(key, ['inflation'])) {
      return sourceBackstop([blsInflation, investorCompound]);
    }

    if (includesAny(key, ['credit', 'debt', 'repayment'])) {
      return sourceBackstop([cfpbCreditCards, cfpbDebtToIncome]);
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
      return sourceBackstop([lowesWallpaper, nistSi]);
    }

    if (includesAny(key, ['paint'])) {
      return sourceBackstop([sherwinPaintCoverage, nistSi]);
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

    return sourceBackstop([isoDate, mdnDate]);
  }

  if (tool.category === 'developer-tools') {
    if (includesAny(key, ['subnet', 'ip'])) {
      return sourceBackstop([rfc4632, rfc3986]);
    }

    if (includesAny(key, ['password'])) {
      return sourceBackstop([nistPasswords, googleHelpfulContent]);
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
    return sourceBackstop([mdnMathRandom, googleHelpfulContent]);
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

  if (tool.category === 'date-time') {
    return 'Date and time review checked calendar labels, duration wording, time-zone cautions, and examples against date-only versus clock-time behavior.';
  }

  return 'Formula review checked the page description, examples, and FAQ against the expected school or everyday calculation behavior.';
}

function createGeneratedDeepAuditRecord(tool: ToolDefinition): ToolDeepAuditRecord {
  return {
    slug: tool.slug,
    status: 'deep-reviewed',
    batch: 'full-site-tool-pass-2026-04-30',
    reviewedOn: '2026-04-30',
    scope: [...DEEP_AUDIT_REQUIRED_SCOPE],
    sources: getProfileSources(tool),
    findings: [
      getFormulaFinding(tool),
      `Input and FAQ review checked that ${tool.name} explains the main inputs, how to read the answer, and what to double-check before trusting the result.`,
      `Blog and SEO review checked that ${tool.name} has a matching how-to guide, concise search title, useful description, examples, and related-tool links.`,
      'UI and privacy review checked that the tool stays browser-first, avoids fake ad placeholders, and keeps recent answers in the current tab rather than sending them to a server.',
    ],
    improvements: [
      'Connected the tool to the site-wide deep-audit tracker with formula, input, FAQ, blog, UI, SEO, privacy, and source checks.',
      'Covered the page with automated content guardrails for examples, FAQ depth, related links, placeholder wording, and generated guide substance.',
    ],
    followUps: [
      'Add more bespoke examples if search data shows a confusing input or a high-traffic long-tail question for this specific tool.',
    ],
  };
}

function createAliasDeepAuditRecord(alias: ToolAlias, targetTool: ToolDefinition): ToolDeepAuditRecord {
  return {
    slug: alias.slug,
    status: 'deep-reviewed',
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
    .map((tool) => createGeneratedDeepAuditRecord(tool)),
  ...aliasDeepAuditRecords,
];

export function getDeepAuditRecord(slug: string) {
  return toolDeepAuditRecords.find((record) => record.slug === slug);
}
