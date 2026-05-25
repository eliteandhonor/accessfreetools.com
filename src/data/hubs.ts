export interface TopicalHub {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  intro: string;
  audience: string;
  primaryToolSlugs: string[];
  supportToolSlugs: string[];
  checkpoints: string[];
}

export const topicalHubs: TopicalHub[] = [
  {
    slug: 'mortgage-home-loan-calculators',
    title: 'Mortgage And Home Loan Calculator Hub',
    eyebrow: 'Home loan planning',
    description:
      'Compare free mortgage, refinance, affordability, down payment, rent-vs-buy, FHA, VA, and home-equity calculators with plain estimate limits.',
    intro:
      'Use this hub when a home loan question needs more than one number. Start with payment or affordability, then compare refinance, down payment, rent-vs-buy, and home-equity tools before treating any result as lender-ready.',
    audience: 'Home buyers, homeowners, renters comparing ownership, and people checking loan scenarios before talking to a lender.',
    primaryToolSlugs: [
      'mortgage-calculator',
      'payment-calculator',
      'home-affordability-calculator',
      'refinance-calculator',
      'down-payment-calculator',
      'rent-vs-buy-calculator',
    ],
    supportToolSlugs: [
      'amortization-calculator',
      'fha-loan-calculator',
      'va-mortgage-calculator',
      'home-equity-loan-calculator',
      'heloc-calculator',
      'debt-to-income-ratio-calculator',
    ],
    checkpoints: [
      'Check whether the result includes taxes, insurance, fees, PMI, or only principal and interest.',
      'Compare monthly and yearly numbers carefully so a believable payment is not built from mismatched inputs.',
      'Use lender or official program documents before making a financial commitment.',
    ],
  },
  {
    slug: 'percentage-ratio-calculators',
    title: 'Percentage And Ratio Calculator Hub',
    eyebrow: 'Percent, proportion, and comparison math',
    description:
      'Find free percentage, ratio, percent error, fraction, discount, markup, margin, and tax calculators for everyday comparison math.',
    intro:
      'Use this hub when the question is about a part, total, rate, change, discount, markup, or comparison. The tools here help separate percent-of, percent-change, ratio, fraction, and price-adjustment intent.',
    audience: 'Students, shoppers, business owners, creators, and anyone comparing changes, shares, discounts, or proportions.',
    primaryToolSlugs: [
      'percentage-calculator',
      'ratio-calculator',
      'percent-error-calculator',
      'fraction-calculator',
      'percent-off-calculator',
      'discount-calculator',
    ],
    supportToolSlugs: [
      'margin-calculator',
      'sales-tax-calculator',
      'markup-calculator',
      'unit-price-calculator',
      'tip-calculator',
      'average-calculator',
    ],
    checkpoints: [
      'Decide whether you need percent of a number, percent change, reverse percent, or a ratio before entering values.',
      'Check whether a price result includes tax, tip, fees, or stacked discounts.',
      'Use examples to catch swapped numerator and denominator values.',
    ],
  },
  {
    slug: 'home-material-calculators',
    title: 'Home Material Calculator Hub',
    eyebrow: 'Project quantity estimates',
    description:
      'Estimate paint, flooring, concrete, drywall, tile, roofing, mulch, gravel, pavers, siding, and yard materials with browser calculators.',
    intro:
      'Use this hub before buying materials, requesting a quote, or checking a rough project plan. The calculators help turn measurements, coverage, waste, and spacing into practical shopping estimates.',
    audience: 'DIY planners, homeowners, contractors doing rough checks, and renters planning removable or small-scale projects.',
    primaryToolSlugs: [
      'paint-calculator',
      'flooring-calculator',
      'drywall-calculator',
      'concrete-calculator',
      'tile-calculator',
      'roofing-calculator',
    ],
    supportToolSlugs: [
      'wallpaper-calculator',
      'mulch-calculator',
      'gravel-calculator',
      'paver-calculator',
      'paver-base-calculator',
      'siding-calculator',
      'grass-seed-calculator',
      'fence-calculator',
    ],
    checkpoints: [
      'Measure twice and keep units consistent before turning an estimate into a shopping list.',
      'Add realistic waste for cuts, breakage, overlap, pattern matching, or uneven site conditions.',
      'Check manufacturer coverage and local code requirements for projects with safety consequences.',
    ],
  },
  {
    slug: 'browser-ai-tools',
    title: 'Browser AI Tools Hub',
    eyebrow: 'Private-first AI helpers',
    description:
      'Try browser AI tools for OCR, summaries, sentiment, language detection, keywords, image labels, tone checks, and reading-level estimates.',
    intro:
      'Use this hub for quick AI-assisted checks where privacy and limits matter. The tools run in the browser when available, but model files may still need to download before the first result.',
    audience: 'Writers, students, creators, support teams, and anyone who wants quick AI help without treating the output as final truth.',
    primaryToolSlugs: [
      'image-to-text-ocr-tool',
      'text-summarizer',
      'sentiment-analyzer',
      'language-detector',
      'keyword-extractor',
      'tone-checker',
    ],
    supportToolSlugs: ['image-classifier', 'reading-level-checker', 'word-counter', 'character-counter', 'text-case-converter'],
    checkpoints: [
      'Do not paste sensitive records unless the task truly needs them.',
      'Treat AI output as a clue or draft, especially for names, numbers, sentiment, and image labels.',
      'Check whether a model file must download before the tool can run.',
    ],
  },
  {
    slug: 'developer-utility-tools',
    title: 'Developer Utility Tools Hub',
    eyebrow: 'Fast browser utilities',
    description:
      'Use free developer tools for JSON, passwords, Base64, URL encoding, UUIDs, hashes, query strings, UTM links, Markdown tables, contrast, and subnetting.',
    intro:
      'Use this hub when you need a quick technical transformation or check without opening a full IDE. The tools focus on clear inputs, copyable outputs, and privacy notes for code, URLs, and credentials.',
    audience: 'Developers, technical marketers, students, support teams, and builders doing quick browser-side checks.',
    primaryToolSlugs: [
      'json-formatter',
      'password-generator',
      'base64-encode-decode',
      'url-encode-decode',
      'query-string-parser',
      'utm-builder',
    ],
    supportToolSlugs: [
      'uuid-generator',
      'hash-generator',
      'markdown-table-generator',
      'color-contrast-checker',
      'subnet-calculator',
      'html-entity-encoder-decoder',
      'css-clamp-calculator',
    ],
    checkpoints: [
      'Keep private keys, passwords, and secrets out of tools unless the page explicitly needs them and the workflow is local.',
      'Choose encode versus decode, format versus minify, and source versus target fields carefully.',
      'Validate production data with the system that will consume it before shipping changes.',
    ],
  },
];

export function getTopicalHub(slug: string) {
  return topicalHubs.find((hub) => hub.slug === slug);
}
