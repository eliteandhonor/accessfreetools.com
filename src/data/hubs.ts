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
  workflowSteps?: string[];
  resources?: Array<{
    href: string;
    title: string;
    text: string;
  }>;
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
    slug: 'loan-payment-debt-payoff-calculators',
    title: 'Loan Payment And Debt Payoff Calculator Hub',
    eyebrow: 'Borrowing, repayment, and payoff',
    description:
      'Compare free loan payment, personal loan, APR, amortization, repayment, credit card payoff, and debt calculators with clear estimate limits.',
    intro:
      'Use this hub when you need to estimate a loan payment, solve for amount, rate, or term, compare borrowing costs, or test a debt payoff plan. Start with the exact question you need answered, then check fees, total interest, payoff time, and official lender or servicer details before making a decision.',
    audience:
      'People comparing personal or installment loans, checking monthly payments, planning extra debt payments, or reviewing borrowing costs before contacting a lender or servicer.',
    primaryToolSlugs: [
      'loan-calculator',
      'personal-loan-calculator',
      'payment-calculator',
      'repayment-calculator',
      'debt-payoff-calculator',
      'credit-cards-payoff-calculator',
    ],
    supportToolSlugs: [
      'apr-calculator',
      'interest-rate-calculator',
      'amortization-calculator',
      'debt-consolidation-calculator',
      'auto-loan-calculator',
      'student-loan-calculator',
      'business-loan-calculator',
      'debt-to-income-ratio-calculator',
    ],
    checkpoints: [
      'Compare the loan amount, interest rate, APR, term, monthly payment, total interest, and fees instead of judging an offer from one number.',
      'A longer term can lower the monthly payment while increasing the total interest paid over the life of the loan.',
      'Treat every result as an estimate. The lender disclosure, account statement, or loan servicer controls the real payment, fee, balance, and payoff amount.',
      'Do not pay someone for a guaranteed loan promise. Check the lender and offer before sharing account details or sending money.',
      'Use the official Federal Student Aid Loan Simulator for federal repayment-plan eligibility, forgiveness, and income-based estimates.',
    ],
    workflowSteps: [
      'Use the Loan Calculator when you need payment, loan amount, rate, or term from the other three values.',
      'Use the Personal Loan Calculator when an origination fee changes the cash received, total cost, or APR-style comparison.',
      'Use a payoff calculator when you already have debt and want to compare extra payments, payoff time, or total interest.',
      'Open the APR, amortization, consolidation, or debt-to-income tools only when that second check changes how you compare the scenario.',
      'Finish with the lender disclosure, account statement, or official servicer tool before applying, refinancing, consolidating, or changing a repayment plan.',
    ],
    resources: [
      {
        href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-loan-interest-rate-and-the-apr-en-733/',
        title: 'CFPB: Interest rate and APR',
        text: 'Learn why APR can include charges that a stated interest rate does not show by itself.',
      },
      {
        href: 'https://www.consumerfinance.gov/ask-cfpb/do-personal-installment-loans-have-fees-en-2120/',
        title: 'CFPB: Personal installment loan fees',
        text: 'Check origination, documentation, insurance, late, and other possible loan charges.',
      },
      {
        href: 'https://consumer.ftc.gov/articles/what-know-about-advance-fee-loans',
        title: 'FTC: Advance-fee loan warning signs',
        text: 'Review warning signs before paying for a loan promise or sharing sensitive information.',
      },
      {
        href: 'https://studentaid.gov/loan-simulator/',
        title: 'Federal Student Aid Loan Simulator',
        text: 'Use the official simulator for federal repayment plans, eligibility, total paid, and forgiveness estimates.',
      },
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
