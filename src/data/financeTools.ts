import type { ToolDefinition, ToolExample, ToolFaq } from './tools';

interface FinanceToolSpec {
  slug: string;
  name: string;
  summary: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  icon: string;
  aliases?: string[];
  formula: string;
  limit: string;
  useCases: string[];
  examples: ToolExample[];
  relatedSlugs: string[];
  inputExplanations?: Array<{ term: string; meaning: string }>;
  priorityFaq?: ToolFaq[];
  extraFaq?: ToolFaq[];
  formulaCheck?: string;
  resultReading?: string;
  doubleCheck?: string;
  limitFollowup?: string;
}

const financeLimit =
  'This calculator gives an educational estimate only. It does not include every fee, lender rule, tax rule, local rate, credit, penalty, or personal financial detail.';

function makeFaq(spec: FinanceToolSpec): ToolFaq[] {
  const exampleUses = spec.useCases.slice(0, 2).join(' ');
  const inputExplanation =
    spec.inputExplanations && spec.inputExplanations.length > 0
      ? spec.inputExplanations.map((input) => `${input.term} means ${input.meaning}`).join(' ')
      : 'Money tools are picky about labels. Dollar fields should be entered as dollar amounts, rate fields should be entered as percentages like 6.5 instead of 0.065, and term fields should match the page label such as months or years. If a field says monthly, do not enter a yearly total unless the tool specifically asks for it.';

  return [
    {
      question: `When should I use the ${spec.name}?`,
      answer: `Use it when you want to test the exact inputs on this page: ${exampleUses} The result is a check against your assumptions, not proof that a lender, tax app, broker, platform, or provider will use the same number.`,
    },
    {
      question: `What do the main ${spec.name} inputs mean?`,
      answer: inputExplanation,
    },
    ...(spec.priorityFaq ?? []),
    {
      question: `What is the ${spec.name} doing with my numbers?`,
      answer: `In plain language: ${spec.formula} ${
        spec.formulaCheck ??
        'If the result seems too high or too low, first check whether each field expects a monthly amount, annual amount, dollar value, or percent.'
      }`,
    },
    {
      question: `How should I read the ${spec.name} answer?`,
      answer:
        spec.resultReading ??
        'Start with the headline number, then use the supporting lines to see why the answer moved. For finance calculators, the extra lines often explain interest, tax, fees, principal, payment timing, or totals paid over time. Those pieces matter because two results can look close at first but cost very different amounts later.',
    },
    {
      question: 'What does this estimate leave out?',
      answer: `${spec.limit} ${
        spec.limitFollowup ??
        'Real finance decisions can also depend on fees, timing, local rules, credit details, and provider-specific terms.'
      }`,
    },
    {
      question: 'What should I double-check before copying the result?',
      answer:
        spec.doubleCheck ??
        'Check the rate, time period, compounding or payment frequency, and whether the value is before tax or after tax. A common mistake is mixing monthly and yearly numbers, which can make a finance answer look believable even when it is off by a lot.',
    },
    ...(spec.extraFaq ?? []),
    {
      question: 'Does the site save my finance inputs?',
      answer:
        'No. The calculator runs in your browser tab. Recent answers stay only on the page while you use it, and they are not sent to a server.',
    },
  ];
}

function makeFinanceTool(spec: FinanceToolSpec): ToolDefinition {
  return {
    slug: spec.slug,
    name: spec.name,
    category: 'finance',
    summary: spec.summary,
    description: spec.description,
    icon: spec.icon,
    aliases: spec.aliases,
    seoTitle: spec.seoTitle ?? `${spec.name} | Free Online Finance Calculator`,
    seoDescription: spec.seoDescription ?? spec.description,
    useCases: spec.useCases,
    examples: spec.examples,
    faq: makeFaq(spec),
    relatedSlugs: spec.relatedSlugs,
  };
}

const remainingFinanceToolSpecs: FinanceToolSpec[] = [
  {
    slug: 'ad-revenue-calculator',
    name: 'Ad Revenue Calculator',
    summary: 'Estimate website ad revenue from page views, page CTR, average CPC, and page RPM.',
    description:
      'Estimate rough website ad revenue from daily page views, page CTR, and average CPC, then check daily revenue, monthly revenue, yearly revenue, estimated clicks, and page RPM.',
    seoTitle: 'Ad Revenue Calculator | Website Ads, CTR, CPC & RPM',
    seoDescription:
      'Estimate website ad revenue from page views, page CTR, and average CPC. See monthly revenue, daily revenue, yearly revenue, clicks, and page RPM.',
    icon: 'calculator-ad-revenue',
    aliases: ['AdSense earnings calculator', 'website ad revenue calculator', 'page RPM calculator', 'display ad revenue calculator'],
    formula:
      'The calculator multiplies daily page views by page CTR to estimate ad clicks, multiplies clicks by average CPC for daily revenue, then scales that estimate to monthly and yearly revenue. It also converts daily revenue into page RPM by dividing revenue by page views and multiplying by 1,000.',
    limit:
      'This is not connected to Google AdSense and does not predict approved earnings, invalid traffic deductions, revenue-share changes, ad fill rate, advertiser demand, RPM changes, placement rules, policy status, or tax treatment.',
    useCases: [
      'Estimate what a page might earn at a simple traffic and CPC level.',
      'Compare how page CTR changes a rough revenue forecast.',
      'Turn a daily traffic estimate into monthly and yearly planning numbers.',
      'Understand how page RPM relates to clicks, CPC, and page views.',
    ],
    examples: [
      { label: 'Starter blog', expression: '1,000 daily page views, 1.5% page CTR, $0.35 CPC', result: 'About $159.80/month from 15 clicks/day and $5.25 page RPM' },
      { label: 'Growing utility page', expression: '5,000 daily page views, 1.2% page CTR, $0.42 CPC', result: 'About $766.65/month from 60 estimated clicks/day' },
      { label: 'Low-click scenario', expression: '2,500 daily page views, 0.6% page CTR, $0.25 CPC', result: 'About $114.09/month and $1.50 page RPM' },
    ],
    relatedSlugs: ['margin-calculator', 'break-even-calculator', 'utm-builder'],
    inputExplanations: [
      { term: 'Daily page views', meaning: 'how many page loads you want to estimate for one day.' },
      { term: 'Page CTR', meaning: 'the estimated percent of page views that turn into ad clicks, entered as 1.5 for 1.5%.' },
      { term: 'Average CPC', meaning: 'the average money earned per ad click in the scenario, entered as a dollar amount.' },
    ],
    priorityFaq: [
      {
        question: 'How do page views, CTR, and CPC become ad revenue?',
        answer:
          'The calculator turns page views into estimated clicks first. For example, 1,000 page views at 1.5% page CTR is about 15 clicks. At $0.35 average CPC, that is about $5.25 per day before the estimate is scaled to a month or year.',
      },
      {
        question: 'What is page RPM?',
        answer:
          'Page RPM means estimated revenue per 1,000 page views. If a page earns $5 from 1,000 views, the page RPM is $5. The calculator derives RPM from the CTR and CPC numbers you enter.',
      },
      {
        question: 'Why can the real result be different from this estimate?',
        answer:
          'CTR and CPC are averages, not fixed laws. Ad placement, traffic source, device type, country, topic, invalid traffic checks, ad blocking, season, revenue share, and advertiser budgets can all move the real number.',
      },
      {
        question: 'Should I enter CTR as 1.5 or 0.015?',
        answer:
          'Enter 1.5 for 1.5%. Do not enter 0.015 unless a field asks for decimal form. A tiny format mistake can make the revenue estimate look 100 times too small.',
      },
    ],
    extraFaq: [
      {
        question: 'Is this a Google AdSense earnings calculator?',
        answer:
          'It estimates the same kind of basic traffic math people often ask about for AdSense-style ads, but it is not connected to Google AdSense, not approved by Google, and not a promise of real earnings. Real reports can change because of invalid traffic, ad demand, country mix, policies, fill rate, revenue share, and seasonality.',
      },
      {
        question: 'Does this include ad impressions or fill rate?',
        answer:
          'No. This version uses page views, page CTR, and average CPC. If your ads are mostly paid by impressions, or if fill rate is a big problem, use this as a rough planning check and compare it with your ad platform reports.',
      },
      {
        question: 'Is the estimate before tax?',
        answer:
          'Yes. Treat the result as before tax, before business costs, and before any account-specific adjustments. Use your ad account, accounting records, and local tax rules for real reporting.',
      },
    ],
  },
  {
    slug: 'break-even-calculator',
    name: 'Break Even Calculator',
    summary: 'Find the unit sales and revenue needed to cover fixed and variable costs.',
    description:
      'Use this free break even calculator to estimate how many units and how much sales revenue are needed before a product, service, or project starts making profit.',
    seoDescription:
      'Calculate break-even units, break-even sales, contribution margin per unit, and contribution margin ratio from fixed costs, price, and variable cost.',
    icon: 'calculator-break-even',
    aliases: ['break even point calculator', 'break-even analysis calculator', 'break even sales calculator'],
    formula:
      'The calculator subtracts variable cost per unit from selling price to get contribution margin per unit, then divides fixed costs by that contribution margin.',
    limit:
      'This does not include taxes, refunds, discounts, credit-card fees, inventory shrinkage, mixed product bundles, capacity limits, financing, or accounting advice.',
    useCases: [
      'Estimate how many items must sell before a product launch covers fixed costs.',
      'Compare prices or variable costs before choosing a sales target.',
      'Plan a simple event, class, booth, or small product batch.',
      'Explain contribution margin in plain language before making a budget.',
    ],
    examples: [
      { label: 'Product launch', expression: '$5,000 fixed costs, $40 price, $18 variable cost', result: 'Break-even units and sales' },
      { label: 'Online course', expression: '$2,500 fixed costs, $99 price, $8 variable cost', result: 'Course sales needed' },
      { label: 'Food stall', expression: '$1,200 fixed costs, $12 price, $4.25 variable cost', result: 'Event break-even point' },
    ],
    relatedSlugs: ['profit-goal-calculator', 'markup-calculator', 'business-loan-calculator'],
    inputExplanations: [
      { term: 'Fixed costs', meaning: 'costs that do not change much with each unit sold, such as rent, setup, software, event fees, or equipment for the period you are planning.' },
      { term: 'Price per unit', meaning: 'the selling price for one item, ticket, service package, or order.' },
      { term: 'Variable cost per unit', meaning: 'the cost that happens for each unit sold, such as materials, packaging, payment fees, or direct labor.' },
    ],
    extraFaq: [
      {
        question: 'What is contribution margin?',
        answer:
          'Contribution margin is the money left from one sale after the variable cost for that sale is removed. If an item sells for $40 and costs $18 to make, the contribution margin is $22. That $22 helps cover fixed costs first, then becomes profit after break-even.',
      },
      {
        question: 'Why does the calculator reject a price below variable cost?',
        answer:
          'If price is not higher than variable cost, each sale loses money before fixed costs are even considered. In that situation, selling more units does not create a normal break-even point.',
      },
    ],
  },
  {
    slug: 'markup-calculator',
    name: 'Markup Calculator',
    summary: 'Calculate selling price, profit, and margin from cost plus markup percent.',
    description:
      'Use this free markup calculator to turn unit cost and markup percent into selling price, profit per unit, margin percent, total revenue, and total profit.',
    seoTitle: 'Markup Calculator | Selling Price, Profit And Margin',
    seoDescription:
      'Calculate markup price from cost, markup percent, and units. See selling price, profit per unit, margin percent, revenue, and total profit.',
    icon: 'calculator-markup',
    aliases: ['price markup calculator', 'markup price calculator', 'cost plus markup calculator'],
    formula:
      'The calculator uses selling price = unit cost x (1 + markup percent / 100). It then subtracts cost from selling price to show profit per unit, and divides profit by selling price to show margin.',
    limit:
      'This does not include discounts, coupons, sales tax, shipping, marketplace fees, returns, inventory loss, or accounting rules.',
    useCases: [
      'Set a simple cost-plus selling price.',
      'See why markup percent and margin percent are different.',
      'Estimate total revenue and profit for a batch of products.',
      'Compare prices before using the margin calculator for a finished sale price.',
    ],
    examples: [
      { label: 'Retail item', expression: '$30 cost with 50% markup for 100 units', result: '$45 price, $15 profit each, 33.33% margin, and $1,500 total profit' },
      { label: 'Handmade product', expression: '$12.50 cost with 80% markup', result: '$22.50 price and $10 profit before fees or discounts' },
      { label: 'Wholesale batch', expression: '$7.25 cost with 35% markup for 500 units', result: '$9.79 price, about $2.54 profit each, and about $1,268.75 total profit' },
    ],
    relatedSlugs: ['margin-calculator', 'break-even-calculator', 'unit-price-calculator'],
    inputExplanations: [
      { term: 'Unit cost', meaning: 'what one item costs before adding markup.' },
      { term: 'Markup percent', meaning: 'the percent added on top of cost, not the percent of the final selling price.' },
      { term: 'Units', meaning: 'how many items you want to total for revenue and profit.' },
    ],
    extraFaq: [
      {
        question: 'Why is markup different from margin?',
        answer:
          'Markup compares profit to cost. Margin compares profit to selling price. A $30 item with 50% markup sells for $45 and earns $15 profit, but the margin is 33.33% because $15 is one-third of the $45 selling price.',
      },
      {
        question: 'Should I use this or the Margin Calculator?',
        answer:
          'Use the Markup Calculator when you know cost and want to choose a selling price. Use the Margin Calculator when you already know revenue or selling price and want to measure the profit margin.',
      },
      {
        question: 'Does a 50% markup mean I keep 50% of the sale?',
        answer:
          'No. A 50% markup means you add half of the cost on top of the cost. If the item costs $30, the price becomes $45 and the profit is $15. That $15 is 33.33% of the $45 selling price before fees, tax, shipping, discounts, or returns.',
      },
      {
        question: 'Should I include shipping, marketplace fees, or packaging in cost?',
        answer:
          'Include them if they happen for each item and you want the price to cover them. For example, if the product costs $12 and packaging costs $1.50, use $13.50 as the unit cost before adding markup.',
      },
      {
        question: 'Can I use this for target-margin pricing?',
        answer:
          'Not directly. This page adds markup to cost. Target margin works backward from the percent of the final sale price you want to keep, so use the Margin Calculator when margin is the goal.',
      },
      {
        question: 'Should every product use the same markup percent?',
        answer:
          'Usually no. A small, fast-selling item, a handmade item, and a bulky item with returns can need different markups. Use the calculator to test the math, then compare the price with demand, fees, stock risk, and what similar items sell for.',
      },
    ],
  },
  {
    slug: 'profit-goal-calculator',
    name: 'Profit Goal Calculator',
    summary: 'Estimate how many units and how much revenue are needed to hit a target profit.',
    description:
      'Use this free profit goal calculator to estimate the unit sales and sales revenue needed to cover fixed costs and reach a target profit.',
    seoDescription:
      'Calculate units and revenue needed for a target profit using fixed costs, target profit, selling price, and variable cost per unit.',
    icon: 'calculator-profit-goal',
    aliases: ['target profit calculator', 'sales goal calculator', 'profit target calculator'],
    formula:
      'The calculator adds fixed costs and target profit, then divides by contribution margin per unit, which is price per unit minus variable cost per unit.',
    limit:
      'This does not include capacity limits, production delays, refunds, taxes, discounts, mixed product sales, marketing spend changes, or accounting advice.',
    useCases: [
      'Set a sales target for a product, event, or service package.',
      'Compare how price or variable cost changes the number of units needed.',
      'Plan a target profit after covering fixed costs.',
      'Use after a break-even check when zero profit is not enough.',
    ],
    examples: [
      { label: '$2k profit target', expression: '$5,000 fixed costs, $2,000 target profit, $40 price, $18 variable cost', result: 'Units needed for the profit goal' },
      { label: 'Event table', expression: '$900 fixed costs and $750 target profit', result: 'Event sales target' },
      { label: 'Service package', expression: '$3,200 fixed costs, $4,500 target profit, $250 package price', result: 'Service sales goal' },
    ],
    relatedSlugs: ['break-even-calculator', 'markup-calculator', 'margin-calculator'],
    inputExplanations: [
      { term: 'Fixed costs', meaning: 'costs to cover before profit, such as setup, rent, platform fees, or equipment for the planning period.' },
      { term: 'Target profit', meaning: 'extra money you want left after fixed and variable costs are covered.' },
      { term: 'Price and variable cost per unit', meaning: 'the sale price and per-sale cost used to calculate contribution margin.' },
    ],
    extraFaq: [
      {
        question: 'How is this different from break-even?',
        answer:
          'Break-even aims for zero profit after costs. Profit goal adds your target profit on top of fixed costs, so the required units and sales are higher.',
      },
      {
        question: 'What if I sell more than one product?',
        answer:
          'This simple version works best for one product or one average bundle. If you sell many products with different prices and costs, use a weighted average contribution margin or calculate each product separately.',
      },
    ],
  },
  {
    slug: 'liquidity-ratios-calculator',
    name: 'Liquidity Ratios Calculator',
    summary: 'Calculate working capital, current ratio, quick ratio, and cash ratio.',
    description:
      'Use this free liquidity ratios calculator to estimate working capital, current ratio, quick ratio, and cash ratio from balance sheet inputs.',
    seoDescription:
      'Calculate liquidity ratios from current assets, current liabilities, inventory, prepaid expenses, cash, marketable securities, and receivables.',
    icon: 'calculator-liquidity-ratios',
    aliases: ['current ratio calculator', 'quick ratio calculator', 'cash ratio calculator'],
    formula:
      'The calculator divides current assets by current liabilities for current ratio, removes inventory and prepaid expenses for quick ratio, and compares cash plus marketable securities with current liabilities for cash ratio.',
    limit:
      'This does not audit financial statements, judge creditworthiness, predict cash timing, value inventory, or replace financial analysis by a qualified professional.',
    useCases: [
      'Check whether short-term assets cover short-term liabilities.',
      'Compare current ratio, quick ratio, and cash ratio in one place.',
      'Explain why inventory can make current ratio look stronger than quick ratio.',
      'Review balance sheet liquidity before deeper business analysis.',
    ],
    examples: [
      { label: 'Small business balance sheet', expression: '$120,000 current assets and $80,000 current liabilities', result: 'Current, quick, and cash ratios' },
      { label: 'Inventory-heavy shop', expression: 'Large inventory with moderate cash', result: 'Quick ratio difference' },
      { label: 'Cash-rich service firm', expression: 'No inventory and strong cash balance', result: 'Higher cash ratio' },
    ],
    relatedSlugs: ['debt-ratios-calculator', 'profitability-ratios-calculator', 'business-loan-calculator'],
    inputExplanations: [
      { term: 'Current assets', meaning: 'assets expected to turn into cash or be used within about a year.' },
      { term: 'Current liabilities', meaning: 'bills and obligations expected to be paid within about a year.' },
      { term: 'Inventory and prepaid expenses', meaning: 'items removed from quick ratio because they may not quickly become cash.' },
      { term: 'Cash, marketable securities, and receivables', meaning: 'more liquid items used to understand immediate payment strength.' },
    ],
    extraFaq: [
      {
        question: 'What does the quick ratio remove?',
        answer:
          'Quick ratio removes inventory and prepaid expenses from current assets. The idea is simple: those items may be useful, but they might not turn into cash fast enough to pay near-term bills.',
      },
      {
        question: 'Is a higher liquidity ratio always better?',
        answer:
          'Not always. A very low ratio can warn about payment pressure, but a very high ratio can also mean cash or assets are sitting unused. Compare ratios with the business type, season, and trend over time.',
      },
    ],
  },
  {
    slug: 'debt-ratios-calculator',
    name: 'Debt Ratios Calculator',
    summary: 'Calculate debt ratio, debt-to-equity ratio, and times interest earned.',
    description:
      'Use this free debt ratios calculator to estimate debt ratio, debt-to-equity ratio, and times interest earned from debt, assets, equity, EBIT, and interest expense.',
    seoDescription:
      'Calculate debt ratio, debt-to-equity ratio, and times interest earned from total debt, total assets, total equity, EBIT, and interest expense.',
    icon: 'calculator-debt-ratios',
    aliases: ['debt ratio calculator', 'debt to equity ratio calculator', 'times interest earned calculator'],
    formula:
      'The calculator divides debt by assets for debt ratio, debt by equity for debt-to-equity, and EBIT by interest expense for times interest earned.',
    limit:
      'This does not include lease classification, debt maturity timing, refinancing risk, cash flow quality, covenant rules, credit rating methods, taxes, or investment advice.',
    useCases: [
      'Measure how much of a business is financed with debt.',
      'Compare debt-to-equity with the company capital structure.',
      'Check a simple interest coverage ratio.',
      'Use alongside liquidity and profitability ratios for a fuller picture.',
    ],
    examples: [
      { label: 'Balanced company', expression: '$220,000 debt, $500,000 assets, $280,000 equity', result: 'Debt ratio and coverage' },
      { label: 'High debt load', expression: '$480,000 debt and $42,000 interest expense', result: 'Debt exposure and interest coverage' },
      { label: 'Low debt exposure', expression: '$60,000 debt on $350,000 assets', result: 'Lower debt ratio' },
    ],
    relatedSlugs: ['liquidity-ratios-calculator', 'debt-to-income-ratio-calculator', 'business-loan-calculator'],
    inputExplanations: [
      { term: 'Total debt', meaning: 'interest-bearing debt or debt-like obligations you want included in the ratio.' },
      { term: 'Total assets and equity', meaning: 'balance sheet totals used to compare debt with company resources and owner value.' },
      { term: 'EBIT and interest expense', meaning: 'earnings before interest and tax compared with interest cost for a basic coverage check.' },
    ],
    extraFaq: [
      {
        question: 'What is times interest earned?',
        answer:
          'Times interest earned compares EBIT with interest expense. A result of 6x means EBIT is six times the interest expense entered. It is a rough coverage check, not a cash-flow promise.',
      },
      {
        question: 'Should debt-to-equity be low or high?',
        answer:
          'It depends on the industry and business model. Some stable asset-heavy businesses use more debt. Young or risky businesses may need less debt because cash flow is less predictable.',
      },
    ],
  },
  {
    slug: 'operations-ratios-calculator',
    name: 'Operations Ratios Calculator',
    summary: 'Calculate inventory turnover, asset turnover, receivables turnover, collection period, and equity multiplier.',
    description:
      'Use this free operations ratios calculator to estimate inventory turnover, asset turnover, receivables turnover, average collection period, and equity multiplier.',
    seoDescription:
      'Calculate operations ratios including inventory turnover, asset turnover, receivables turnover, average collection period, and equity multiplier.',
    icon: 'calculator-operations-ratios',
    aliases: ['inventory turnover calculator', 'asset turnover calculator', 'receivables turnover calculator'],
    formula:
      'The calculator averages inventory, divides cost of goods sold by average inventory, divides net sales by average assets, divides credit sales by receivables, and divides assets by equity for equity multiplier.',
    limit:
      'This does not adjust for seasonality, inventory accounting method, credit policy changes, one-time sales, customer mix, receivable quality, or financial-statement restatements.',
    useCases: [
      'See how quickly inventory turns over.',
      'Estimate how efficiently assets generate sales.',
      'Measure receivables turnover and average collection period.',
      'Review operating ratios before looking at profit and debt ratios.',
    ],
    examples: [
      { label: 'Retail operations', expression: '$600,000 COGS and $100,000 average inventory', result: 'Inventory turnover and operating ratios' },
      { label: 'Faster receivables', expression: 'Higher credit sales with lower receivables', result: 'Shorter collection period' },
      { label: 'Inventory-heavy year', expression: 'Higher ending inventory and asset base', result: 'Turnover comparison' },
    ],
    relatedSlugs: ['profitability-ratios-calculator', 'liquidity-ratios-calculator', 'stock-ratios-calculator'],
    inputExplanations: [
      { term: 'Cost of goods sold and inventory', meaning: 'the cost of inventory sold and the beginning and ending inventory values used for inventory turnover.' },
      { term: 'Net sales and average assets', meaning: 'sales and asset base used to estimate asset turnover.' },
      { term: 'Net credit sales and receivables', meaning: 'credit-based sales compared with average accounts receivable for collection speed.' },
      { term: 'Total assets and equity', meaning: 'balance sheet totals used for the equity multiplier.' },
    ],
    extraFaq: [
      {
        question: 'What is average collection period?',
        answer:
          'Average collection period estimates how many days it takes to collect receivables. It uses 365 divided by receivables turnover, so it is a broad timing estimate, not a guarantee for each customer.',
      },
      {
        question: 'Why does seasonality matter for operations ratios?',
        answer:
          'A business can hold extra inventory before a busy season or collect receivables after a large billing cycle. One snapshot can look weak or strong just because of timing.',
      },
    ],
  },
  {
    slug: 'profitability-ratios-calculator',
    name: 'Profitability Ratios Calculator',
    summary: 'Calculate gross margin, operating margin, net margin, ROA, ROE, EPS, and P/E.',
    description:
      'Use this free profitability ratios calculator to estimate gross margin, operating margin, net profit margin, return on assets, return on equity, earnings per share, and price-to-earnings ratio.',
    seoDescription:
      'Calculate profitability ratios including gross margin, operating margin, net margin, ROA, ROE, EPS, and P/E from financial statement inputs.',
    icon: 'calculator-profitability-ratios',
    aliases: ['profit margin ratios calculator', 'return on assets calculator', 'return on equity calculator'],
    formula:
      'The calculator divides gross profit, operating income, and net income by net sales for margins, then compares net income with average assets, average equity, shares, and stock price.',
    limit:
      'This does not adjust for unusual gains or losses, accounting policy, tax items, share dilution, debt risk, industry differences, market expectations, or investment advice.',
    useCases: [
      'Compare several profitability ratios from one set of statements.',
      'See the difference between gross, operating, and net margin.',
      'Estimate return on assets and return on equity.',
      'Connect earnings per share with a simple P/E ratio.',
    ],
    examples: [
      { label: 'Profitable company', expression: '$950,000 sales, $120,000 net income, $100,000 shares', result: 'Margins, ROA, ROE, EPS, and P/E' },
      { label: 'Thin margins', expression: 'High sales with smaller net income', result: 'Lower margin ratios' },
      { label: 'Service firm', expression: 'Lower COGS and higher operating income', result: 'Profitability comparison' },
    ],
    relatedSlugs: ['stock-ratios-calculator', 'operations-ratios-calculator', 'margin-calculator'],
    inputExplanations: [
      { term: 'Net sales, COGS, operating income, and net income', meaning: 'income statement numbers used to calculate margin ratios.' },
      { term: 'Average assets and average equity', meaning: 'balance sheet averages used to estimate returns on assets and equity.' },
      { term: 'Shares outstanding and price per share', meaning: 'per-share inputs used for EPS and price-to-earnings.' },
    ],
    extraFaq: [
      {
        question: 'Why are there three margin ratios?',
        answer:
          'Gross margin looks after product or service cost. Operating margin looks after operating expenses. Net margin looks after all normal income statement layers included in net income. Each one answers a different question.',
      },
      {
        question: 'Can I compare ROE across every company?',
        answer:
          'Be careful. ROE can look high because a company is very profitable, but it can also look high because the company has less equity or more debt. Compare it with debt ratios and industry context.',
      },
    ],
  },
  {
    slug: 'stock-ratios-calculator',
    name: 'Stock Ratios Calculator',
    summary: 'Calculate P/E, price-to-sales, price-to-book, dividend yield, and payout ratio.',
    description:
      'Use this free stock ratios calculator to estimate price-to-earnings, price-to-sales, price-to-book, dividend yield, and payout ratio from per-share inputs.',
    seoDescription:
      'Calculate stock valuation ratios including P/E, price-to-sales, price-to-book, dividend yield, and payout ratio from stock price and per-share values.',
    icon: 'calculator-stock-ratios',
    aliases: ['pe ratio calculator', 'price to sales calculator', 'price to book calculator', 'dividend yield calculator'],
    formula:
      'The calculator divides stock price by EPS, sales per share, and book value per share, then compares dividend per share with price and earnings.',
    limit:
      'This does not include future growth, analyst estimates, debt risk, accounting quality, dilution, taxes, fees, portfolio fit, or investment advice.',
    useCases: [
      'Calculate common stock valuation ratios from per-share numbers.',
      'Compare P/E, price-to-sales, and price-to-book side by side.',
      'Estimate dividend yield and payout ratio.',
      'Learn what each ratio is measuring before researching a stock deeper.',
    ],
    examples: [
      { label: 'Dividend stock', expression: '$18 price, $1.20 EPS, $0.45 dividend', result: 'Valuation and dividend ratios' },
      { label: 'Growth stock', expression: '$75 price, $2.50 EPS, no dividend', result: 'Higher P/E comparison' },
      { label: 'Value check', expression: '$32 price, $4 EPS, $21 book value per share', result: 'P/E and price-to-book comparison' },
    ],
    relatedSlugs: ['profitability-ratios-calculator', 'roi-calculator', 'average-return-calculator'],
    inputExplanations: [
      { term: 'Stock price', meaning: 'the share price you want to compare with earnings, sales, book value, and dividends.' },
      { term: 'EPS, sales per share, and book value per share', meaning: 'per-share fundamentals used as denominators for valuation ratios.' },
      { term: 'Dividend per share', meaning: 'annual dividend per share used for dividend yield and payout ratio.' },
    ],
    extraFaq: [
      {
        question: 'What does P/E mean?',
        answer:
          'P/E means price-to-earnings. A P/E of 15x means the stock price is 15 times the earnings per share entered. It is a comparison tool, not a yes-or-no investment answer.',
      },
      {
        question: 'Why does this calculator require positive EPS?',
        answer:
          'A normal P/E ratio is easiest to understand when earnings per share are positive. If EPS is zero or negative, the P/E ratio usually needs extra explanation instead of a simple calculator number.',
      },
    ],
  },
  {
    slug: 'marriage-tax-calculator',
    name: 'Marriage Tax Calculator',
    summary: 'Compare a simplified 2026 federal tax estimate for two single filers versus married filing jointly.',
    description:
      'Use this free marriage tax calculator to compare two single federal tax estimates with a married filing jointly estimate using 2026 ordinary-income brackets.',
    seoTitle: 'Marriage Tax Calculator | Married vs Single 2026 Estimate',
    seoDescription:
      'Compare two single 2026 federal tax estimates with a married filing jointly estimate. See the tax difference, taxable income, and bracket limits.',
    icon: 'calculator-tax',
    aliases: [
      'married filing jointly tax calculator',
      'taxes married vs single calculator',
      'married vs single tax brackets',
      'marriage tax bonus calculator',
      'marriage penalty tax calculator',
      'tax calculator married filing jointly vs separately',
    ],
    formula:
      'The calculator estimates each person as a single filer, estimates the combined income as married filing jointly, then subtracts the two-single total from the joint total.',
    limit:
      'This is a simplified 2026 federal ordinary-income estimate. It does not include married filing separately, state tax, payroll tax, capital gains, phaseouts, itemized deduction limits, AMT, most credits, dependents, community-property rules, benefits, student-loan rules, or filing advice.',
    useCases: [
      'Compare whether the entered incomes show a rough marriage bonus or penalty.',
      'Test how custom deductions or joint credits affect the simple comparison.',
      'See taxable income and marginal bracket before discussing tax planning.',
      'Use as an education screen, not as tax filing guidance.',
    ],
    examples: [
      { label: 'Two earners', expression: '$90,000 and $70,000 income', result: '$17,540 joint tax and $17,540 as two single estimates, so $0 difference' },
      { label: 'One higher earner', expression: '$180,000 and $25,000 income', result: 'About $5,384 lower tax as married filing jointly in this simple model' },
      { label: 'Custom deductions', expression: '$120,000 and $80,000 income, custom deductions, and $1,000 joint credits', result: 'About $1,858 lower tax after the entered deduction and credit assumptions' },
    ],
    relatedSlugs: ['income-tax-calculator', 'salary-calculator', 'take-home-paycheck-calculator'],
    inputExplanations: [
      { term: 'Person 1 income', meaning: 'ordinary income for the first person before the deduction entered on this page.' },
      { term: 'Person 2 income', meaning: 'ordinary income for the second person before the deduction entered on this page.' },
      { term: 'Single deductions', meaning: 'optional custom deductions for the two separate single estimates. Leave blank to use the 2026 single standard deduction.' },
      { term: 'Joint deduction', meaning: 'optional custom deduction for the married filing jointly estimate. Leave blank to use the 2026 joint standard deduction.' },
      { term: 'Joint credits', meaning: 'credits you want to subtract from the joint federal estimate only in this simple comparison.' },
    ],
    formulaCheck:
      '$90,000 plus $70,000 gives $17,540 as two single estimates and $17,540 as married filing jointly, so the simplified difference is $0. $180,000 plus $25,000 gives about a $5,384 lower joint estimate.',
    resultReading:
      'A negative marriage difference means the joint estimate is lower than the two-single estimate. A positive difference means the joint estimate is higher. A $0 difference means this simple 2026 bracket-and-deduction model did not find a bonus or penalty.',
    doubleCheck:
      'Check both incomes, whether deductions are blank or custom, and whether credits belong in the joint-credit field. Then remember that state tax, payroll tax, dependents, phaseouts, benefits, and married filing separately can change the real answer.',
    limitFollowup:
      'Use IRS filing-status rules, current tax forms, and a qualified tax professional for filing decisions. This page is only a quick federal ordinary-income comparison.',
    priorityFaq: [
      {
        question: 'What does marriage bonus or penalty mean here?',
        answer:
          'On this page, a marriage bonus means the married filing jointly estimate is lower than two single estimates. A penalty means the joint estimate is higher. It is only a simplified federal comparison, not a filing recommendation.',
      },
      {
        question: 'Why can $90,000 and $70,000 show no difference?',
        answer:
          'For that example, the 2026 married filing jointly standard deduction and bracket thresholds line up closely with two single estimates. The calculator gets $17,540 either way, so the difference is $0.',
      },
      {
        question: 'Does this compare married filing jointly with married filing separately?',
        answer:
          'No. It compares two single estimates with one married filing jointly estimate. Married filing separately has its own limits, credits, state rules, and community-property issues, so this page does not choose a filing status for you.',
      },
    ],
    extraFaq: [
      {
        question: 'Does this include state tax or payroll tax?',
        answer:
          'No. It only estimates 2026 federal ordinary income tax. State income tax, Social Security tax, Medicare tax, local tax, and benefit rules can change the real cost.',
      },
      {
        question: 'Do credits and dependents change the answer?',
        answer:
          'Yes. Dependents, education credits, child tax credit rules, earned income credit, phaseouts, and other credits can change the real result. This calculator only has one simple joint-credit field.',
      },
      {
        question: 'Can I use this to decide whether getting married is worth it?',
        answer:
          'No. Use it to understand one tax estimate. Marriage affects legal, benefit, state, household, insurance, debt, and planning questions that a calculator like this cannot decide.',
      },
    ],
  },
  {
    slug: 'estate-tax-calculator',
    name: 'Estate Tax Calculator',
    summary: 'Check a large estate against the 2026 federal estate tax exclusion.',
    description:
      'Use this free estate tax calculator to screen a large estate against the 2026 federal basic exclusion using gross estate, deductions, spouse transfers, charitable bequests, and prior taxable gifts.',
    seoTitle: 'Estate Tax Calculator | 2026 Federal Exclusion Estimate',
    seoDescription:
      'Estimate whether a large estate may sit above the 2026 federal estate tax exclusion. Enter gross estate, deductions, spouse transfers, charity, and prior taxable gifts.',
    icon: 'calculator-tax',
    aliases: ['federal estate tax calculator', 'estate tax exclusion calculator', 'Form 706 estimate calculator'],
    formula:
      'The calculator subtracts entered debts, charitable bequests, and spouse transfers, reduces the 2026 basic exclusion by prior taxable gifts, then applies a simplified 40% top-rate estimate above the remaining exclusion.',
    limit:
      'Estate tax is complex. This estimate does not run the Form 706 tax computation and does not include state estate tax, generation-skipping tax, full gift tax calculations, portability, valuation discounts, trusts, elections, or legal advice.',
    useCases: [
      'Screen whether a large estate might exceed the 2026 federal exclusion.',
      'See how debts, charitable bequests, or spouse transfers change the rough taxable amount.',
      'Account for prior taxable gifts at a high level.',
      'Prepare better questions for an estate attorney or tax professional.',
    ],
    examples: [
      { label: '$18M estate', expression: '$18,000,000 estate with $500,000 debts and expenses', result: '$1,000,000 simplified federal estimate above the 2026 exclusion' },
      { label: 'Charitable bequest', expression: '$22,000,000 estate, $600,000 debts, and $2,000,000 charity', result: '$1,760,000 simplified estimate after deductions' },
      { label: 'Prior gifts', expression: '$16,000,000 estate, $300,000 debts, and $1,000,000 prior taxable gifts', result: '$680,000 simplified estimate after reduced exclusion' },
    ],
    relatedSlugs: ['income-tax-calculator', 'finance-calculator', 'future-value-calculator'],
    inputExplanations: [
      { term: 'Gross estate', meaning: 'the rough total value of the estate before the deductions you enter on this page.' },
      { term: 'Debts and expenses', meaning: 'mortgages, debts, and estate costs you want to subtract in this rough screen.' },
      { term: 'Charitable bequests', meaning: 'amounts going to qualified charities that you want treated as deductions in the estimate.' },
      { term: 'Spouse transfers', meaning: 'amounts passing to a surviving spouse that you want removed from the rough taxable estate.' },
      { term: 'Prior taxable gifts', meaning: 'lifetime taxable gifts that may have already used part of the lifetime exclusion.' },
    ],
    formulaCheck:
      'If the answer looks wrong, check the gross estate first, then the deduction fields, then prior taxable gifts. This is not the full Form 706 tax computation.',
    resultReading:
      'Start with the estimated federal estate tax, then read the supporting lines. Estate before exclusion shows what is left after the deductions you entered. Remaining basic exclusion shows how much of the 2026 exclusion is still left in this simplified screen. Above exclusion is the amount this page applies the 40% estimate to.',
    doubleCheck:
      'Check the year of death, gross estate value, debts, spouse transfers, charity amounts, and prior taxable gifts. Also check whether a state estate tax, inheritance tax, portability election, GST tax, trust, farm, business, or valuation issue needs a professional review.',
    limitFollowup:
      'Use IRS instructions and a qualified professional for filing decisions, portability, tax due dates, and state rules.',
    priorityFaq: [
      {
        question: 'What 2026 estate tax exclusion does this use?',
        answer:
          'It uses the IRS-published 2026 federal basic exclusion amount of $15,000,000 for estates of decedents who die during 2026. If the year of death is different, use the IRS threshold for that year instead.',
      },
      {
        question: 'Is this the same as filing Form 706?',
        answer:
          'No. This is a rough exclusion screen. Form 706 uses detailed asset values, deductions, adjusted taxable gifts, credits, elections, schedules, and supporting records. Use this page to spot whether the numbers deserve a professional review, not to file.',
      },
      {
        question: 'Why do prior taxable gifts matter?',
        answer:
          'Prior taxable gifts can use part of the lifetime exclusion before death. This simplified model subtracts the prior taxable gifts you enter from the 2026 basic exclusion before estimating the amount above the exclusion.',
      },
      {
        question: 'Does this include portability or DSUE?',
        answer:
          'No. Portability and the deceased spousal unused exclusion are handled through Form 706 rules and deadlines. The IRS says a timely, complete Form 706 is generally needed to elect portability, so this page does not try to model it.',
      },
    ],
    extraFaq: [
      {
        question: 'Does this include state estate tax or inheritance tax?',
        answer:
          'No. Some states have their own estate tax or inheritance tax rules. This calculator only screens a simplified federal estate tax scenario.',
      },
      {
        question: 'When is a professional review important?',
        answer:
          'Get professional estate and tax help when the estate may be near the filing threshold, when portability matters, when there are trusts, business interests, farms, non-U.S. issues, large gifts, disputed values, state taxes, or generation-skipping transfers.',
      },
      {
        question: 'When is Form 706 usually due?',
        answer:
          'IRS Form 706 is generally due within 9 months after the date of death, with an automatic 6-month filing extension available through Form 4768 when requested on time. Tax payments can have their own rules, so do not wait on a calculator result.',
      },
    ],
  },
  {
    slug: 'social-security-calculator',
    name: 'Social Security Calculator',
    summary: 'Estimate how claiming age can change a monthly Social Security retirement benefit.',
    description:
      'Use this free Social Security calculator to estimate a monthly retirement benefit from birth year, full-retirement-age benefit, and claiming age.',
    icon: 'calculator-retirement',
    formula:
      'The calculator estimates full retirement age from birth year, then applies early claiming reductions before full retirement age or delayed retirement credits after full retirement age through age 70.',
    limit:
      'This does not access SSA records, earnings history, spousal benefits, survivor benefits, disability benefits, taxation, COLA changes, or official benefit estimates.',
    useCases: [
      'Compare claiming at 62, full retirement age, and 70.',
      'Use your SSA full-retirement-age benefit estimate as the starting point.',
      'See the monthly and annual effect of claiming age.',
      'Plan questions before using official SSA tools.',
    ],
    examples: [
      { label: 'Claim at FRA', expression: 'Born 1962, $2,400 FRA benefit, claim at 67', result: 'Full benefit estimate' },
      { label: 'Early claim', expression: 'Claim at age 62', result: 'Reduced monthly estimate' },
      { label: 'Delayed claim', expression: 'Claim at age 70', result: 'Delayed-credit estimate' },
    ],
    relatedSlugs: ['retirement-calculator', 'pension-calculator', 'rmd-calculator'],
  },
  {
    slug: 'rmd-calculator',
    name: 'RMD Calculator',
    summary: 'Estimate a required minimum distribution using the IRS Uniform Lifetime Table.',
    description:
      'Use this free RMD calculator to estimate a required minimum distribution from prior year-end balance and age using the IRS Uniform Lifetime Table.',
    icon: 'calculator-retirement',
    formula:
      'The calculator divides the prior December 31 account balance by the Uniform Lifetime Table factor for the entered age.',
    limit:
      'This does not cover inherited IRAs, Roth IRA owner rules, spouse more than 10 years younger rules, multiple account aggregation, penalties, or tax advice.',
    useCases: [
      'Estimate an annual RMD from a traditional retirement account.',
      'Look up the Uniform Lifetime Table factor for an age.',
      'See the balance left after the estimated distribution.',
      'Prepare before checking custodian records.',
    ],
    examples: [
      { label: 'Age 75', expression: '$500,000 balance at age 75', result: 'Balance divided by table factor' },
      { label: 'Age 80', expression: '$750,000 balance at age 80', result: 'RMD estimate' },
      { label: 'Age 90', expression: '$300,000 balance at age 90', result: 'RMD estimate' },
    ],
    relatedSlugs: ['ira-calculator', 'retirement-calculator', 'social-security-calculator'],
  },
  {
    slug: 'real-estate-calculator',
    name: 'Real Estate Calculator',
    summary: 'Estimate property sale profit, ROI, and equity multiple from purchase and sale numbers.',
    description:
      'Use this free real estate calculator to estimate property sale profit, ROI, net sale proceeds, and equity multiple from purchase, cash invested, selling costs, and loan payoff.',
    seoDescription:
      'Estimate property profit, ROI, net sale proceeds, and equity multiple from purchase, sale, costs, cash invested, and loan payoff.',
    icon: 'calculator-house-affordability',
    formula:
      'The calculator adds cash invested, subtracts selling costs and loan payoff from sale price, then compares net sale proceeds with cash invested.',
    limit:
      'This does not include tax basis, depreciation, depreciation recapture, capital gains tax, rent history, refinancing, local transfer taxes, or legal costs.',
    useCases: [
      'Estimate profit from a property sale.',
      'Include improvements, buying costs, selling costs, and loan payoff.',
      'Compare ROI against cash invested.',
      'Screen a real estate scenario before a full spreadsheet.',
    ],
    examples: [
      { label: 'Home sale', expression: '$350k purchase to $430k sale', result: 'Estimated profit and ROI' },
      { label: 'Renovation', expression: 'Purchase plus improvements', result: 'Cash invested comparison' },
      { label: 'Small gain', expression: 'Higher loan payoff and selling costs', result: 'Net proceeds check' },
    ],
    relatedSlugs: ['rental-property-calculator', 'mortgage-calculator', 'rent-vs-buy-calculator'],
  },
  {
    slug: 'take-home-paycheck-calculator',
    name: 'Take-Home-Paycheck Calculator',
    summary: 'Estimate net pay per paycheck from salary, pay schedule, deductions, taxes, and FICA.',
    description:
      'Use this free take-home-paycheck calculator to estimate net pay from annual gross pay, pay frequency, pretax deductions, estimated tax percentages, and employee FICA.',
    icon: 'calculator-salary',
    formula:
      'The calculator annualizes pretax deductions, applies entered tax percentages, applies employee Social Security and Medicare estimates, then divides annual take-home pay by pay periods.',
    limit:
      'This is not a payroll system. It does not use your W-4, exact state rules, benefit plan rules, garnishments, employer payroll timing, bonus withholding, or official withholding tables.',
    useCases: [
      'Estimate take-home pay before accepting a salary.',
      'Compare weekly, biweekly, semimonthly, and monthly pay schedules.',
      'Include simple pretax deductions and estimated tax percentages.',
      'See a rough FICA estimate separately.',
    ],
    examples: [
      { label: 'Biweekly salary', expression: '$78,000 salary over 26 paychecks', result: 'Estimated net paycheck' },
      { label: 'Monthly pay', expression: '$96,000 salary over 12 paychecks', result: 'Monthly take-home estimate' },
      { label: 'Weekly pay', expression: '$52,000 salary over 52 paychecks', result: 'Weekly take-home estimate' },
    ],
    relatedSlugs: ['salary-calculator', 'income-tax-calculator', 'marriage-tax-calculator'],
  },
  {
    slug: 'rental-property-calculator',
    name: 'Rental Property Calculator',
    summary: 'Estimate rental property cash flow, NOI, cap rate, and cash-on-cash return.',
    description:
      'Use this free rental property calculator to estimate mortgage payment, operating expenses, monthly cash flow, NOI, cap rate, and cash-on-cash return.',
    icon: 'calculator-rent',
    formula:
      'The calculator subtracts vacancy and operating expenses from rent for NOI, subtracts mortgage payment for cash flow, then compares NOI and cash flow with property price and cash invested.',
    limit:
      'This does not include depreciation, income tax, repairs timing, tenant risk, rent control, property management contracts, refinancing, or local landlord rules.',
    useCases: [
      'Screen whether monthly rent covers estimated costs.',
      'Estimate cap rate before financing effects.',
      'Estimate cash-on-cash return after mortgage payment.',
      'Compare vacancy, maintenance, and expense assumptions.',
    ],
    examples: [
      { label: 'Rental house', expression: '$300k property renting for $2,400/mo', result: 'Cash flow and cap rate' },
      { label: 'Condo', expression: 'Condo rent with higher monthly expenses', result: 'Cash-flow estimate' },
      { label: 'Higher rent', expression: '$420k property renting for $3,400/mo', result: 'Return estimate' },
    ],
    relatedSlugs: ['real-estate-calculator', 'mortgage-calculator', 'roi-calculator'],
  },
  {
    slug: 'irr-calculator',
    name: 'IRR Calculator',
    summary: 'Estimate internal rate of return from an initial outflow and five cash-flow periods.',
    description:
      'Use this free IRR calculator to estimate periodic and annualized internal rate of return from an initial investment and five cash-flow periods.',
    icon: 'calculator-rate',
    formula:
      'The calculator treats the initial investment as a negative cash flow, then solves for the rate that makes the net present value of all entered cash flows approximately zero.',
    limit:
      'IRR can be misleading for unusual cash-flow signs, reinvestment assumptions, different project sizes, taxes, fees, inflation, or risk.',
    useCases: [
      'Estimate a project internal rate of return.',
      'Compare uneven cash flows against a target return.',
      'See periodic and annualized IRR.',
      'Screen an investment before a detailed model.',
    ],
    examples: [
      { label: 'Five-year project', expression: '$10,000 outflow and five annual inflows', result: 'IRR estimate' },
      { label: 'Uneven cash flows', expression: 'Different cash flow each year', result: 'Solved rate' },
      { label: 'Monthly shorthand', expression: 'Monthly-style period selection', result: 'Annualized IRR estimate' },
    ],
    relatedSlugs: ['roi-calculator', 'payback-period-calculator', 'present-value-calculator'],
  },
  {
    slug: 'roi-calculator',
    name: 'ROI Calculator',
    summary: 'Calculate simple return on investment from initial investment, ending value, income, and costs.',
    description:
      'Use this free ROI calculator to estimate gain or loss and return on investment percentage from initial investment, ending value, income, and costs.',
    icon: 'calculator-average-return',
    formula:
      'The calculator adds ending value and income, subtracts costs and initial investment, then divides gain or loss by the initial investment.',
    limit:
      'Simple ROI does not adjust for time, compounding, risk, taxes, inflation, financing, or cash-flow timing.',
    useCases: [
      'Calculate simple investment ROI.',
      'Include income and costs in the gain calculation.',
      'Check whether a project produced a positive or negative return.',
      'Use before comparing with IRR or payback period.',
    ],
    examples: [
      { label: 'Investment gain', expression: '$10,000 grows to $12,500 plus income', result: 'ROI estimate' },
      { label: 'Small project', expression: '$3,000 project ending at $3,900', result: 'Simple ROI' },
      { label: 'Loss check', expression: 'Lower ending value with some income', result: 'Negative ROI check' },
    ],
    relatedSlugs: ['irr-calculator', 'average-return-calculator', 'payback-period-calculator'],
  },
  {
    slug: 'apr-calculator',
    name: 'APR Calculator',
    summary: 'Estimate APR from loan amount, note rate, term, and finance charges.',
    description:
      'Use this free APR calculator to estimate an approximate annual percentage rate from loan amount, note rate, repayment term, and entered finance charges.',
    icon: 'calculator-rate',
    formula:
      'The calculator estimates the scheduled payment at the note rate, subtracts entered fees from amount received, then solves the annualized rate implied by that payment stream.',
    limit:
      'This is not an official Truth in Lending disclosure. APR rules can include specific finance charges, timing rules, tolerances, and lender disclosures.',
    useCases: [
      'Estimate how fees can raise APR above note rate.',
      'Compare loan offers with different fees.',
      'See amount received after finance charges.',
      'Prepare questions before reading official disclosures.',
    ],
    examples: [
      { label: 'Personal loan APR', expression: '$20,000 at 8% with $600 fees', result: 'APR estimate' },
      { label: 'Low fee', expression: '$12,000 at 9.5% with $150 fees', result: 'Smaller APR gap' },
      { label: 'Large loan', expression: '$250,000 mortgage with $5,000 fees', result: 'APR approximation' },
    ],
    relatedSlugs: ['loan-calculator', 'interest-rate-calculator', 'personal-loan-calculator'],
  },
  {
    slug: 'fha-loan-calculator',
    name: 'FHA Loan Calculator',
    summary: 'Estimate an FHA-style mortgage payment with upfront MIP, monthly MIP, taxes, and insurance.',
    description:
      'Use this free FHA loan calculator to estimate an FHA-style monthly mortgage payment from home price, down payment, rate, term, upfront MIP, annual MIP, property tax, and insurance.',
    seoTitle: 'FHA Loan Calculator | Payment, MIP & Limit Cautions',
    seoDescription:
      'Estimate an FHA-style mortgage payment with upfront MIP, monthly MIP, tax, and insurance. Check 3.5% down, 2026 loan-limit cautions, and monthly cost.',
    icon: 'calculator-mortgage',
    aliases: ['FHA mortgage calculator', 'FHA payment calculator', 'FHA MIP calculator', 'FHA loan payment estimate'],
    formula:
      'The calculator adds entered upfront MIP to the financed balance, calculates principal and interest, then adds tax, insurance, and monthly MIP from the entered annual MIP rate.',
    limit:
      'This does not approve an FHA loan, check credit, verify debt-to-income ratio, look up county loan limits, price closing costs, judge property rules, choose the official MIP table, or replace lender underwriting.',
    useCases: [
      'Estimate an FHA-style payment with 3.5% down.',
      'Test upfront and annual MIP assumptions.',
      'Compare monthly MIP against a conventional mortgage estimate.',
      'Screen payment before lender preapproval.',
    ],
    examples: [
      { label: '3.5% down', expression: '$325,000 home, 6.5%, 1.75% upfront MIP, 0.55% annual MIP', result: 'About $2,615.76/month, $5,488.44 upfront MIP, and 96.5% LTV' },
      { label: 'Lower price', expression: '$260,000 home, 3.5% down, 6.75%, same MIP assumptions', result: 'About $2,130.81/month' },
      { label: '10% down', expression: '$400,000 home, 10% down, 6.25%, 0.50% annual MIP', result: 'About $2,998.71/month and 90% LTV' },
    ],
    relatedSlugs: ['mortgage-calculator', 'down-payment-calculator', 'house-affordability-calculator'],
    inputExplanations: [
      { term: 'Home price', meaning: 'the purchase price you want to test before down payment.' },
      { term: 'Down payment', meaning: 'cash paid upfront toward the price. A 3.5% example on $325,000 is $11,375.' },
      { term: 'Interest rate', meaning: 'the note rate for the scenario, entered as 6.5 for 6.5%.' },
      { term: 'Upfront MIP', meaning: 'the one-time FHA mortgage insurance premium percent you want to finance into the loan.' },
      { term: 'Annual MIP', meaning: 'the yearly mortgage insurance percent that the calculator divides by 12 for monthly MIP.' },
      { term: 'Annual property tax and monthly insurance', meaning: 'rough escrow-style amounts added to the monthly payment estimate.' },
    ],
    priorityFaq: [
      {
        question: 'Can an FHA down payment be as low as 3.5%?',
        answer:
          'Yes, FHA purchase loans can allow down payments as low as 3.5% for borrowers who qualify. That is why the first example uses 96.5% loan-to-value. Credit score, income, debt-to-income ratio, property approval, and lender overlays still matter, so 3.5% down is not automatic approval.',
      },
      {
        question: 'What 2026 FHA loan-limit number should I know?',
        answer:
          'HUD says the 2026 one-unit FHA forward mortgage limit floor is $541,287 and the high-cost-area ceiling is $1,249,125. Alaska, Hawaii, Guam, and the U.S. Virgin Islands have a higher special-exception one-unit ceiling. County limits can sit between the floor and ceiling, so this calculator does not tell you whether a specific home is inside the local FHA limit.',
      },
      {
        question: 'What is upfront MIP?',
        answer:
          'Upfront MIP is the one-time FHA mortgage insurance premium. The common input here is 1.75% of the base loan amount. If you finance it, the calculator adds it to the balance before estimating principal and interest.',
      },
      {
        question: 'What is annual MIP?',
        answer:
          'Annual MIP is mortgage insurance charged over the year and usually paid monthly. The calculator takes the annual MIP percent you enter, applies it to the base loan amount, and divides by 12.',
      },
      {
        question: 'Is 0.55% the right annual MIP for every FHA loan?',
        answer:
          'No. HUD Mortgagee Letter 2023-05 lists different annual MIP rates by term, base loan amount, and LTV. For terms over 15 years at or below the listed base-loan threshold, the table shows 0.50% at 90% to 95% LTV and 0.55% above 95% LTV. Higher base loans can use higher rates. The lender and current HUD table should decide the real rate.',
      },
      {
        question: 'Does this check FHA eligibility?',
        answer:
          'No. FHA eligibility can depend on credit, income, debt-to-income ratio, employment, property type, appraisal, loan limits, occupancy, lender overlays, and documents. This page only estimates payment math from the numbers you enter.',
      },
      {
        question: 'Does FHA mortgage insurance go away?',
        answer:
          'It depends on the loan case, term, LTV, and payoff/refinance path. Some FHA monthly MIP lasts for the mortgage term, while some older or lower-LTV cases have different rules. Ask the lender or servicer before planning around MIP removal.',
      },
    ],
    extraFaq: [
      {
        question: 'Does this estimate include cash to close?',
        answer:
          'No. It estimates the monthly payment pieces. Cash to close can include the down payment, closing costs, prepaid property tax, prepaid homeowners insurance, escrow deposits, points, lender fees, title fees, and other charges. CFPB says early closing-cost estimates often use a 2% to 5% range before the real Loan Estimate arrives.',
      },
      {
        question: 'Can this calculator check debt-to-income ratio?',
        answer:
          'No. FHA and lender reviews can use automated underwriting, manual underwriting, compensating factors, credit history, and verified income. This page does not read your debts or income, so it cannot say whether the payment is approvable.',
      },
    ],
    formulaCheck:
      'It does not look up your county loan limit, choose an official MIP table, or decide whether the lender can approve the loan.',
    resultReading:
      'Start with total monthly payment, then read principal and interest, upfront MIP, monthly MIP, and loan-to-value. That keeps the FHA insurance cost from disappearing inside one big payment number.',
    doubleCheck:
      'Check the down payment, rate, term, upfront MIP, annual MIP, tax, insurance, and whether your base loan sits near a 2026 FHA limit or MIP-rate threshold. Then compare the result with a written Loan Estimate, county FHA limit, and lender quote before using it for a real home decision.',
    limitFollowup:
      'Use HUD, CFPB, and lender documents for the real FHA limit, MIP schedule, closing costs, escrow amounts, credit approval, and property approval.',
  },
  {
    slug: 'va-mortgage-calculator',
    name: 'VA Mortgage Calculator',
    summary: 'Estimate a VA-backed purchase loan payment with common funding-fee logic.',
    description:
      'Use this free VA mortgage calculator to estimate monthly payment, VA funding fee, loan-to-value, and financing effect for a common VA purchase scenario.',
    icon: 'calculator-mortgage',
    formula:
      'The calculator estimates a common VA purchase funding-fee rate from down payment and first-use status, adds the fee to the loan if selected, then calculates monthly mortgage payment.',
    limit:
      'This does not determine VA eligibility, exemption status, appraisal rules, entitlement, lender overlays, closing costs, seller concessions, or official loan terms.',
    useCases: [
      'Estimate payment on a VA purchase loan.',
      'Compare first-use, subsequent-use, down payment, and exemption scenarios.',
      'See the funding fee as a dollar amount.',
      'Screen monthly payment before lender quotes.',
    ],
    examples: [
      { label: 'First use, no down', expression: '$360,000 home, first VA use, no down payment', result: 'Payment and funding fee' },
      { label: '5% down', expression: '$360,000 home with 5% down', result: 'Lower funding fee rate' },
      { label: 'Exempt fee', expression: 'Funding-fee exemption selected', result: 'No funding fee estimate' },
    ],
    relatedSlugs: ['mortgage-calculator', 'fha-loan-calculator', 'down-payment-calculator'],
  },
  {
    slug: 'home-equity-loan-calculator',
    name: 'Home Equity Loan Calculator',
    summary: 'Estimate a fixed home equity loan payment, borrowing room, and combined loan-to-value.',
    description:
      'Estimate a fixed home equity loan payment, total interest, borrowing room at a CLTV limit, and the combined loan-to-value after the new loan.',
    seoTitle: 'Home Equity Loan Calculator | Payment, Equity And CLTV',
    seoDescription:
      'Estimate a fixed home equity loan payment, total interest, available equity, and combined loan-to-value. Includes CLTV, fee, tax, and foreclosure-risk cautions.',
    icon: 'calculator-house-affordability',
    aliases: [
      'home equity loan payment calculator',
      'home equity loan calculator with cltv',
      'second mortgage payment calculator',
      'home equity borrowing calculator',
    ],
    formula:
      'The calculator estimates available equity from home value, mortgage balance, and max combined LTV, then applies the fixed-payment loan formula to the requested loan amount.',
    limit:
      'This does not approve credit, protect against foreclosure risk, include lender fees, tax rules, property value changes, or underwriting limits.',
    useCases: [
      'Estimate payment on a lump-sum home equity loan.',
      'Compare requested loan with available-equity estimate.',
      'Check combined loan-to-value after borrowing.',
      'See total interest over the fixed term.',
    ],
    examples: [
      { label: '$50k loan', expression: '$450,000 home, $260,000 mortgage, $50,000 loan', result: 'Payment and CLTV' },
      { label: 'Higher CLTV', expression: '90% max combined LTV', result: 'Available equity estimate' },
      { label: 'Small loan', expression: '$25,000 equity loan', result: 'Monthly payment' },
    ],
    relatedSlugs: ['heloc-calculator', 'mortgage-calculator', 'loan-calculator'],
    inputExplanations: [
      { term: 'Home value', meaning: 'your best current estimate of what the home could appraise or sell for, not the original purchase price.' },
      { term: 'Current mortgage balance', meaning: 'what you still owe on loans already secured by the home.' },
      { term: 'Desired equity loan', meaning: 'the new lump-sum amount you want to test as a fixed loan.' },
      { term: 'Interest rate', meaning: 'the yearly rate for the new loan. Enter 8.25 for 8.25%, not 0.0825.' },
      { term: 'Loan term', meaning: 'how many years the new home equity loan would be repaid over.' },
      { term: 'Max combined LTV', meaning: 'the combined loan-to-value limit you want to test, such as 80 or 85.' },
    ],
    formulaCheck:
      'It does not pull an appraisal, choose a lender CLTV rule, include closing costs, or decide whether the loan is affordable.',
    resultReading:
      'Read available equity first, then combined LTV, then monthly payment. For the starter example, a $450,000 home with a $260,000 mortgage and an 85% CLTV cap leaves about $122,500 of borrowing room. A $50,000 loan at 8.25% for 10 years estimates about $613 per month before fees.',
    doubleCheck:
      'Check the home value, mortgage balance, CLTV cap, loan amount, rate, term, fees, and whether the loan is fixed or adjustable. Then compare the result with a Loan Estimate or lender quote before making a real borrowing decision.',
    limitFollowup:
      'Home equity borrowing is secured by the home. If payments are missed, the home can be at risk. Tax treatment can also depend on how the money is used, so check IRS rules or a tax professional before assuming interest is deductible.',
    priorityFaq: [
      {
        question: 'Is this a home equity loan or a HELOC calculator?',
        answer:
          'This page is for a lump-sum home equity loan with a fixed payment. A HELOC is different because it is a line of credit that may let you draw money more than once and often has a variable rate.',
      },
      {
        question: 'What does combined loan-to-value mean?',
        answer:
          'Combined loan-to-value compares all home-secured debt with the home value. If you owe $260,000 on the first mortgage and test a $50,000 equity loan on a $450,000 home, the combined LTV is about 68.9%.',
      },
    ],
    extraFaq: [
      {
        question: 'How much home equity could I borrow?',
        answer:
          'The calculator uses the CLTV cap you enter. At 85% on a $450,000 home, the debt limit is $382,500. If the current mortgage is $260,000, the rough available equity is $122,500 before lender rules and fees.',
      },
      {
        question: 'Does the calculator include closing costs or points?',
        answer:
          'No. It estimates payment and interest on the loan amount only. Closing costs, points, appraisal fees, title fees, and recording fees can change the real cost, so compare lender documents before choosing.',
      },
      {
        question: 'Can a home equity loan put my home at risk?',
        answer:
          'Yes. A home equity loan is secured by the home. If payments are missed and the default is not fixed, the lender may have foreclosure rights under the loan documents and local law.',
      },
      {
        question: 'Is home equity loan interest tax deductible?',
        answer:
          'Do not assume it is. IRS Publication 936 says home equity loan or line interest is generally deductible only when the money is used to buy, build, or substantially improve the home securing the loan and other rules are met.',
      },
      {
        question: 'Why does payment alone miss part of the decision?',
        answer:
          'Two loans can have similar payments but different fees, APRs, terms, prepayment rules, or total interest. Payment is useful, but it should not be the only number you compare.',
      },
      {
        question: 'What should I compare with a lender quote?',
        answer:
          'Compare loan amount, rate, APR, payment, fees, term, prepayment penalties, balloon-payment language, and cash needed at closing. Ask why if the lender document does not match your estimate.',
      },
    ],
  },
  {
    slug: 'heloc-calculator',
    name: 'HELOC Calculator',
    summary: 'Estimate HELOC interest-only payment, repayment payment, available equity, and CLTV.',
    description:
      'Use this free HELOC calculator to estimate draw-period interest-only payment, repayment-period payment, available equity, and combined loan-to-value.',
    icon: 'calculator-loan',
    formula:
      'The calculator estimates available equity from max combined LTV, computes draw-period interest-only payment on the current draw, and estimates repayment payment over the entered years.',
    limit:
      'HELOCs often have variable rates, draws, fees, freezes, minimums, balloon payments, and repayment changes that this simple calculator does not model.',
    useCases: [
      'Estimate monthly interest-only payment on a current draw.',
      'Estimate repayment payment after the draw period.',
      'Check available equity against a line limit.',
      'Compare HELOC with a fixed home equity loan.',
    ],
    examples: [
      { label: '$30k draw', expression: '$80,000 line with $30,000 drawn', result: 'Interest-only and repayment estimates' },
      { label: 'Large line', expression: '$120,000 line and $60,000 draw', result: 'HELOC estimate' },
      { label: 'Small draw', expression: '$10,000 current draw', result: 'Payment estimate' },
    ],
    relatedSlugs: ['home-equity-loan-calculator', 'loan-calculator', 'mortgage-calculator'],
  },
  {
    slug: 'down-payment-calculator',
    name: 'Down Payment Calculator',
    summary: 'Estimate down payment, loan amount, loan-to-value, closing costs, and cash needed.',
    description:
      'Estimate the down payment, loan amount, loan-to-value, rough closing costs, and cash needed for a home purchase.',
    seoTitle: 'Down Payment Calculator | Cash Needed, LTV & Closing Costs',
    seoDescription:
      'Estimate home down payment, loan amount, LTV, closing costs, and cash needed. Compare 20%, 10%, 5%, and 3.5% down examples.',
    icon: 'calculator-house-affordability',
    aliases: [
      'home down payment calculator',
      'cash to close calculator estimate',
      'mortgage down payment calculator',
      'loan to value down payment calculator',
    ],
    formula:
      'The calculator uses an exact down payment if entered. If that field is blank, it multiplies home price by the down payment percent. Then it subtracts the down payment from price for the loan amount, shows LTV, estimates closing costs from home price, and adds those costs to the down payment for estimated cash needed.',
    limit:
      'This is an early planning estimate. It does not itemize lender fees, title fees, prepaid taxes, insurance, escrow deposits, discount points, inspections, moving costs, seller credits, down payment assistance, lender reserves, mortgage insurance, or the official Loan Estimate and Closing Disclosure.',
    useCases: [
      'Estimate cash needed for a home purchase.',
      'Compare 20%, 10%, 5%, and 3.5% down payment scenarios.',
      'See loan-to-value from the down payment.',
      'Add a rough closing cost percentage.',
    ],
    examples: [
      { label: '20% down', expression: '$400,000 home, 20% down, 3% closing costs', result: '$92,000 estimated cash needed, $80,000 down, $320,000 loan, and 80% LTV' },
      { label: '3.5% down', expression: '$325,000 home, 3.5% down, 3.5% closing costs', result: '$22,750 estimated cash needed, $11,375 down, $313,625 loan, and 96.5% LTV' },
      { label: 'Exact cash', expression: '$450,000 home, $50,000 exact down payment, 3% closing costs', result: '$63,500 estimated cash needed, $400,000 loan, and 88.89% LTV' },
    ],
    relatedSlugs: ['mortgage-calculator', 'fha-loan-calculator', 'house-affordability-calculator'],
    inputExplanations: [
      { term: 'Home price', meaning: 'the purchase price you want to test before taxes, fees, or moving costs.' },
      { term: 'Down payment amount', meaning: 'the exact cash you plan to put toward the price. If you fill this in, it overrides the percent field.' },
      { term: 'Down payment percent', meaning: 'the percent of the price paid upfront when the exact dollar field is blank, such as 20 for 20% or 3.5 for 3.5%.' },
      { term: 'Closing cost estimate', meaning: 'a rough percent of the home price for closing costs, kept separate from the down payment.' },
    ],
    priorityFaq: [
      {
        question: 'Is down payment the same as cash to close?',
        answer:
          'No. Down payment is the part of the home price you pay upfront. Cash to close is bigger because it can also include lender fees, title fees, prepaid taxes, insurance, escrow deposits, points, and other closing costs. This calculator estimates down payment plus a simple closing-cost percent.',
      },
      {
        question: 'Should I enter an exact down payment or a percent?',
        answer:
          'Use the exact dollar field when you already know the cash amount, such as $50,000. Leave it blank when you want the calculator to use the percent field, such as 20% or 3.5%.',
      },
      {
        question: 'What does loan-to-value mean here?',
        answer:
          'Loan-to-value, or LTV, is the estimated loan amount compared with the home price. A $320,000 loan on a $400,000 home is 80% LTV. Lower LTV usually means more cash down and less money borrowed.',
      },
      {
        question: 'Why does the calculator include closing costs?',
        answer:
          'Because buyers usually need more than the down payment at closing. CFPB and Fannie Mae explain that closing costs are paid in addition to the down payment, and early planning often uses a rough 2% to 5% range before a lender gives exact numbers.',
      },
    ],
    extraFaq: [
      {
        question: 'Does this include mortgage insurance?',
        answer:
          'No. Mortgage insurance depends on loan type, down payment, credit, lender rules, and the final loan amount. If you put less than 20% down on many conventional loans, mortgage insurance may be part of the monthly payment.',
      },
      {
        question: 'Can seller credits or down payment assistance change the answer?',
        answer:
          'Yes. Seller credits, grants, gifts, assistance programs, and lender credits can change the cash you actually bring to closing. They also have rules, so check the written loan documents and program terms.',
      },
      {
        question: 'Is 3.5% down always enough?',
        answer:
          'No. FHA loans may allow a down payment as low as 3.5% in many cases, but the full decision still depends on loan rules, credit, property, closing costs, mortgage insurance, and lender approval.',
      },
    ],
  },
  {
    slug: 'rent-vs-buy-calculator',
    name: 'Rent vs. Buy Calculator',
    summary: 'Compare simplified renting cost with buying and selling over a chosen time horizon.',
    description:
      'Use this free rent vs. buy calculator to compare projected rent cost with simplified home buying, ownership, and sale proceeds over time.',
    icon: 'calculator-rent',
    formula:
      'The calculator projects rent with annual increases, estimates buying cash outflow, estimates sale proceeds after appreciation and selling costs, then compares net buying cost with rent cost.',
    limit:
      'This does not include taxes, investment returns on cash, repairs timing, moving costs, HOA, PMI, local rules, opportunity cost, or personal flexibility needs.',
    useCases: [
      'Compare renting and buying over a specific number of years.',
      'Test rent growth, appreciation, and selling cost assumptions.',
      'Include basic mortgage, tax, insurance, and maintenance estimates.',
      'Screen whether time horizon changes the answer.',
    ],
    examples: [
      { label: 'Seven-year compare', expression: '$2,100 rent vs $420,000 home', result: 'Rent-vs-buy gap' },
      { label: 'Short stay', expression: 'Three-year comparison', result: 'Short horizon estimate' },
      { label: 'Higher rent market', expression: '$3,200 rent vs $650,000 home', result: 'Longer comparison' },
    ],
    relatedSlugs: ['rent-calculator', 'mortgage-calculator', 'real-estate-calculator'],
  },
  {
    slug: 'payback-period-calculator',
    name: 'Payback Period Calculator',
    summary: 'Estimate how many years it takes for annual cash flow to recover an initial cost.',
    description:
      'Estimate how many years annual savings or cash flow needs to recover an upfront cost, then see the simple net amount after your chosen horizon.',
    seoTitle: 'Payback Period Calculator | Years To Recover Cost',
    seoDescription:
      'Estimate simple payback years from upfront cost and annual cash flow. See net after horizon and know when ROI, IRR, or present value gives a fuller answer.',
    icon: 'calculator-repayment',
    aliases: ['simple payback calculator', 'investment payback calculator', 'payback period example'],
    formula:
      'Simple payback = initial cost / annual cash flow. Net after horizon = annual cash flow x horizon years - initial cost.',
    limit:
      'Simple payback is a quick screen. It ignores discount rates, uneven cash flows, financing, taxes, resale value, maintenance timing, risk, and cash earned after the payback date.',
    useCases: [
      'Estimate how quickly a project recovers its cost.',
      'Compare a payback period with a target horizon.',
      'Screen energy, equipment, or business improvement projects.',
      'Use alongside ROI and IRR for more context.',
    ],
    examples: [
      { label: 'Efficiency project', expression: '$15,000 cost and $3,600 annual savings', result: 'About 4.17 years, with $13,800 net after 8 years' },
      { label: 'Equipment', expression: '$42,000 cost and $9,500 annual cash flow', result: 'About 4.42 years, with $24,500 net after 7 years' },
      { label: 'Small upgrade', expression: '$2,500 cost and $600 annual savings', result: 'About 4.17 years, with $500 net after 5 years' },
    ],
    relatedSlugs: ['roi-calculator', 'irr-calculator', 'present-value-calculator'],
    inputExplanations: [
      { term: 'Initial cost', meaning: 'the upfront money paid before the project starts saving or earning cash.' },
      { term: 'Annual cash flow', meaning: 'the steady yearly savings or extra cash the project is expected to create.' },
      { term: 'Horizon years', meaning: 'the number of years you want to check after the start, used for the simple net-after-horizon line.' },
    ],
    extraFaq: [
      {
        question: 'Why is payback period useful?',
        answer:
          'It gives a quick recovery-time check. If one upgrade pays back in 2 years and another takes 9 years, you can see which one gets the starting cash back sooner before doing deeper finance math.',
      },
      {
        question: 'Does the shortest payback period always win?',
        answer:
          'No. A short payback can still be a weaker project if it has low profit after the payback point. Use ROI, IRR, or present value when the cash flows keep going for a long time.',
      },
      {
        question: 'Can this calculator handle uneven cash flows?',
        answer:
          'No. This page assumes one steady annual cash-flow number. If each year is different, use an IRR-style cash-flow table or a spreadsheet-style payback setup.',
      },
      {
        question: 'What is discounted payback period?',
        answer:
          'Discounted payback is similar, but each future cash flow is first reduced by a discount rate. This calculator is the simple version, so use Present Value or IRR if the time value of money matters.',
      },
      {
        question: 'How is payback period different from ROI?',
        answer:
          'Payback period tells you how long recovery takes. ROI tells you gain compared with cost. A project can pay back quickly but have a smaller long-term ROI than another project.',
      },
      {
        question: 'What if the annual cash flow is zero or negative?',
        answer:
          'Then there is no simple payback. The project is not creating steady yearly cash to recover the initial cost in this model.',
      },
    ],
  },
  {
    slug: 'present-value-calculator',
    name: 'Present Value Calculator',
    summary: 'Estimate present value of a future lump sum and regular payment stream.',
    description:
      'Use this free present value calculator to discount a future lump sum and regular payments back to today using an entered rate and time period.',
    icon: 'calculator-investment',
    formula:
      'The calculator discounts a future lump sum and discounts regular payments as an annuity, then adds both present value parts.',
    limit:
      'Present value depends on the discount rate and timing assumption. It does not include tax, risk, liquidity, inflation surprises, or professional investment advice.',
    useCases: [
      'Estimate what a future amount is worth today.',
      'Discount a regular payment stream.',
      'Compare different discount rates.',
      'Use with future value and IRR for planning math.',
    ],
    examples: [
      { label: 'Future plus payments', expression: '$10,000 future amount plus $200 monthly', result: 'Present value estimate' },
      { label: 'Lump sum only', expression: '$50,000 in 10 years', result: 'Discounted value today' },
      { label: 'Annual payments', expression: '$5,000 annual payments', result: 'Annuity present value' },
    ],
    relatedSlugs: ['future-value-calculator', 'irr-calculator', 'investment-calculator'],
  },
  {
    slug: 'future-value-calculator',
    name: 'Future Value Calculator',
    summary: 'Estimate future value of a starting amount and regular payments.',
    description:
      'Use this free future value calculator to project a starting amount and regular payments forward with an entered rate, time period, and payment frequency.',
    icon: 'calculator-finance',
    formula:
      'The calculator compounds the starting amount and compounds each regular payment using the selected payment frequency, then adds both future value parts.',
    limit:
      'This assumes steady rate and payment timing. It does not include market volatility, tax, fees, missed payments, inflation, or account rules.',
    useCases: [
      'Project a savings or investment balance.',
      'Compare payment frequencies and return assumptions.',
      'Separate growth from total contributions.',
      'Use alongside present value for time-value math.',
    ],
    examples: [
      { label: 'Monthly saving', expression: '$5,000 start plus $250 monthly for 10 years', result: 'Future value estimate' },
      { label: 'No new payments', expression: '$20,000 compounded for 8 years', result: 'Lump-sum future value' },
      { label: 'Annual contribution', expression: '$3,000 per year for 12 years', result: 'Future value estimate' },
    ],
    relatedSlugs: ['present-value-calculator', 'compound-interest-calculator', 'investment-calculator'],
  },
  {
    slug: 'commission-calculator',
    name: 'Commission Calculator',
    summary: 'Estimate commission, split amount, and total pay from sales, rate, base pay, and bonus.',
    description:
      'Use this free commission calculator to estimate gross commission, split commission, and total pay from sales amount, commission rate, split, base pay, and bonus.',
    icon: 'calculator-margin',
    formula:
      'The calculator multiplies sales by commission rate, applies the split percentage, then adds base pay and bonus entered.',
    limit:
      'This does not include tiered plans, quotas, accelerators, clawbacks, payroll tax, draw plans, chargebacks, or employer policy rules.',
    useCases: [
      'Estimate commission from a sale amount.',
      'Apply a shared commission split.',
      'Add base pay or bonus to commission.',
      'Check a simple commission plan before payroll.',
    ],
    examples: [
      { label: 'Sales commission', expression: '$50,000 sale at 3%', result: 'Commission estimate' },
      { label: 'Split commission', expression: '$750,000 sale at 2.5% with 50% split', result: 'Split amount' },
      { label: 'Base plus bonus', expression: 'Commission plus base pay and bonus', result: 'Total pay estimate' },
    ],
    relatedSlugs: ['salary-calculator', 'margin-calculator', 'take-home-paycheck-calculator'],
  },
  {
    slug: 'mortgage-calculator-uk',
    name: 'Mortgage Calculator UK',
    summary: 'Estimate a UK repayment mortgage from property price, deposit, rate, term, and monthly fees.',
    description:
      'Estimate a UK repayment mortgage payment from property price, deposit, rate, term, and monthly fees, with loan amount, LTV, and total interest.',
    seoTitle: 'Mortgage Calculator UK | Repayment, Deposit, LTV & Interest',
    seoDescription:
      'Estimate a UK repayment mortgage from property price, deposit, rate, term, and monthly fees. See monthly payment, loan amount, LTV, and interest.',
    icon: 'calculator-mortgage',
    aliases: ['mortgage repayment calculator', 'simple mortgage calculator uk', 'mortgage calculator uk first time buyer', 'uk mortgage payment calculator'],
    formula:
      'The calculator subtracts the deposit from the property price, converts the annual rate to a monthly rate, applies the fixed repayment mortgage formula, then adds any monthly fees entered.',
    limit:
      'This does not include lender affordability checks, credit scoring, product fees unless you enter them, stamp duty, valuation, survey, solicitor costs, insurance, leasehold charges, rate changes, or interest-only mortgages.',
    useCases: [
      'Estimate a UK repayment mortgage payment from property price, deposit, rate, and term.',
      'See loan amount and loan-to-value before comparing deposit sizes.',
      'Compare term length and interest-rate assumptions before a lender quote.',
      'Add a simple monthly fee when you want it included in the payment estimate.',
    ],
    examples: [
      { label: '25-year repayment', expression: '£300,000 property, £60,000 deposit, 5.2%, 25 years', result: 'About £1,431.12 per month, £240,000 loan, 80% LTV, and about £189,337.09 interest' },
      { label: 'Higher deposit', expression: '£425,000 property, £125,000 deposit, 4.9%, 30 years, £20 monthly fee', result: 'About £1,612.18 total per month and 70.59% LTV' },
      { label: 'Shorter term', expression: '£250,000 property, £50,000 deposit, 5.5%, 15 years', result: 'About £1,634.17 per month and about £94,150.04 interest' },
    ],
    relatedSlugs: ['mortgage-calculator', 'canadian-mortgage-calculator', 'down-payment-calculator'],
    inputExplanations: [
      { term: 'Property price', meaning: 'the price of the home before deposit, stamp duty, legal fees, surveys, insurance, or moving costs.' },
      { term: 'Deposit', meaning: 'cash put toward the property price; the calculator subtracts it to get the mortgage loan amount.' },
      { term: 'Interest rate', meaning: 'the annual rate used for the repayment estimate, entered as a percent such as 5.2 for 5.2%.' },
      { term: 'Mortgage term', meaning: 'how many years the repayment is spread over. A longer term usually lowers the payment but raises total interest.' },
      { term: 'Monthly fees', meaning: 'optional recurring fees you want included in the monthly total, not one-off product, legal, survey, or stamp duty costs.' },
    ],
    priorityFaq: [
      {
        question: 'Is this a UK repayment mortgage calculator?',
        answer:
          'Yes. It estimates a capital-and-interest repayment mortgage. Each monthly payment is treated as paying interest and reducing the loan balance. It is not an interest-only mortgage calculator.',
      },
      {
        question: 'Does this check if a UK lender will approve me?',
        answer:
          'No. UK lenders still look at income, outgoings, credit history, deposit, property details, and whether payments would stay affordable if rates changed. This page only checks the payment math.',
      },
      {
        question: 'Does this include stamp duty?',
        answer:
          'No. Stamp Duty Land Tax, Land and Buildings Transaction Tax, and Land Transaction Tax depend on location, buyer status, and property details. Use official calculators before treating the cash needed as final.',
      },
      {
        question: 'Why does loan-to-value matter?',
        answer:
          'Loan-to-value compares the mortgage loan with the property price. A £240,000 loan on a £300,000 property is 80% LTV. LTV can affect the deals a lender offers, but this calculator does not approve a deal.',
      },
    ],
    formulaCheck:
      'Loan amount = property price - deposit. Monthly repayment uses the fixed-payment formula on the loan amount, monthly rate, and payment count. Total monthly payment then adds the monthly fee field.',
    resultReading:
      'Read monthly repayment, total monthly payment, loan amount, LTV, and total interest together. A lower monthly payment can still mean more interest if the term is longer.',
    doubleCheck:
      'Check the interest rate, term, deposit, and whether a fee is monthly or one-off before copying the result. Then compare it with a lender illustration or mortgage offer.',
    limitFollowup:
      'This is not a UK affordability check, mortgage illustration, or advice. It leaves out stamp duty, legal fees, surveys, insurance, product fees you do not enter, leasehold charges, rate changes, and lender rules.',
    extraFaq: [
      {
        question: 'Can I use it for a first-time buyer estimate?',
        answer:
          'Yes for payment math, as long as you enter the property price, deposit, rate, and term you want to test. It does not check first-time buyer stamp duty relief, mortgage offers, or local tax rules.',
      },
      {
        question: 'Why can a shorter term cost more each month but less overall?',
        answer:
          'A shorter term spreads the same loan across fewer payments, so each payment is higher. Because the balance falls faster, the total interest is usually lower if the rate is the same.',
      },
    ],
  },
  {
    slug: 'canadian-mortgage-calculator',
    name: 'Canadian Mortgage Calculator',
    summary: 'Estimate a Canadian mortgage payment, loan amount, LTV, and total interest with semi-annual compounding.',
    description:
      'Estimate a Canadian mortgage payment from property price, down payment, nominal rate, amortization, and payment frequency, with loan amount, LTV, and total interest.',
    seoTitle: 'Canadian Mortgage Calculator | Payment, LTV & Interest',
    seoDescription:
      'Estimate a Canadian mortgage payment from price, down payment, rate, amortization, and payment frequency. See loan amount, LTV, and total interest.',
    icon: 'calculator-mortgage',
    aliases: ['canada mortgage calculator', 'canadian mortgage payment calculator', 'mortgage payment calculator canada', 'semi annual mortgage calculator'],
    formula:
      'The calculator subtracts down payment from property price, converts the nominal annual rate through Canadian semi-annual compounding, then calculates the payment for the selected frequency.',
    limit:
      'This does not include mortgage default insurance premiums, property tax, closing costs, provincial tax on premiums, prepayment privileges, renewal-rate changes, stress-test qualification, or lender approval.',
    useCases: [
      'Estimate a Canadian mortgage payment from price, down payment, rate, amortization, and frequency.',
      'Compare monthly, biweekly, weekly, and semimonthly payment frequencies.',
      'See loan-to-value from property price and down payment.',
      'Check how amortization length changes payment and total interest before a lender quote.',
    ],
    examples: [
      { label: 'Monthly payments', expression: '$600,000 property, $120,000 down, 5.1%, 25 years', result: 'About $2,819.09/month, $480,000 loan, 80% LTV, and $365,727.47 interest' },
      { label: 'Biweekly payments', expression: '$520,000 property, $104,000 down, 4.9%, 25 years, biweekly', result: 'About $1,104.58 every two weeks, $416,000 loan, and $301,974.31 interest' },
      { label: 'Shorter amortization', expression: '$450,000 property, $90,000 down, 5.25%, 20 years', result: 'About $2,414.49/month and $219,476.86 interest' },
    ],
    relatedSlugs: ['mortgage-calculator', 'mortgage-calculator-uk', 'down-payment-calculator'],
    inputExplanations: [
      { term: 'Property price', meaning: 'the home price before down payment, closing costs, default insurance premiums, or tax adjustments.' },
      { term: 'Down payment', meaning: 'cash put toward the home price; the calculator subtracts it from price to get the loan amount.' },
      { term: 'Interest rate', meaning: 'the nominal annual mortgage rate entered as a percent, such as 5.1 for 5.1%.' },
      { term: 'Amortization', meaning: 'the years used to spread out the payment estimate, not the shorter mortgage term that may renew earlier.' },
      { term: 'Payment frequency', meaning: 'how often the calculator estimates a payment, such as monthly, biweekly, or weekly.' },
    ],
    priorityFaq: [
      {
        question: 'Why is a Canadian mortgage calculator different?',
        answer:
          'Canadian mortgage payment math commonly starts from a nominal annual rate with semi-annual compounding. This calculator converts that rate before estimating the payment frequency you choose.',
      },
      {
        question: 'Does this include mortgage default insurance?',
        answer:
          'No. If the down payment is under 20%, Canadian buyers usually need mortgage loan insurance. This calculator shows the base loan payment before adding that premium, premium tax, or lender-specific rules.',
      },
      {
        question: 'Is amortization the same as the mortgage term?',
        answer:
          'No. Amortization is the full payoff timeline used for the payment estimate. The mortgage term is the shorter contract period before renewal, often five years or less.',
      },
      {
        question: 'Does the calculator test if I qualify?',
        answer:
          'No. Canadian lenders use income, debts, credit, property details, and a stress-test rate. The stress test can be higher than the rate used for this payment estimate.',
      },
    ],
    extraFaq: [
      {
        question: 'Why does payment frequency matter?',
        answer:
          'The payment shown is for the selected frequency. A biweekly result is not a monthly result. Compare total interest and payment count before deciding which frequency is actually better.',
      },
      {
        question: 'What should I check before trusting the result?',
        answer:
          'Check down payment rules, default insurance, closing costs, property tax, renewal risk, prepayment privileges, and whether your lender is quoting regular or accelerated payments.',
      },
    ],
  },
  {
    slug: 'percent-off-calculator',
    name: 'Percent Off Calculator',
    summary: 'Calculate sale price, savings, effective discount, and tax after one or two percent-off discounts.',
    description:
      'Use this free percent off calculator to estimate final sale price, savings before tax, effective discount, and tax after one or two discounts.',
    icon: 'calculator-discount',
    formula:
      'The calculator applies the first percent-off discount, applies an optional extra discount to the reduced price, then adds tax if entered.',
    limit:
      'Retail totals can differ because of coupon exclusions, shipping, minimum spend rules, price matching, fees, and local tax treatment.',
    useCases: [
      'Calculate a final sale price.',
      'Stack two percent-off discounts correctly.',
      'Estimate tax after discounts.',
      'See total savings and effective discount.',
    ],
    examples: [
      { label: 'Sale plus tax', expression: '$80 with 25% off, extra 10% off, and 7.5% tax', result: 'Final price' },
      { label: 'Half off', expression: '$120 with 50% off', result: 'Sale price' },
      { label: 'Stacked sale', expression: '$200 with 30% then 15% off', result: 'Effective discount' },
    ],
    relatedSlugs: ['discount-calculator', 'percentage-calculator', 'sales-tax-calculator'],
  },
];

export const financeTools: ToolDefinition[] = [
  makeFinanceTool({
    slug: 'mortgage-calculator',
    name: 'Mortgage Calculator',
    summary: 'Estimate monthly principal, interest, taxes, insurance, PMI, and HOA costs.',
    description:
      'Use this free mortgage calculator to estimate monthly principal and interest, total interest, loan-to-value, and optional property tax, insurance, PMI, and HOA costs.',
    seoTitle: 'Mortgage Calculator | Monthly Payment, PMI, Tax & Insurance',
    seoDescription:
      'Estimate a mortgage payment from home price, down payment, rate, term, taxes, insurance, PMI, and HOA. See principal, interest, LTV, and total interest.',
    icon: 'calculator-mortgage',
    aliases: [
      'mortgage payment calculator',
      'simple mortgage calculator',
      'free mortgage calculator',
      'house payment calculator',
      'PITI calculator',
    ],
    formula:
      'The calculator subtracts the down payment from the home price, uses the fixed-rate mortgage payment formula for monthly principal and interest, then adds annual property tax divided by 12, monthly insurance, PMI, and HOA dues.',
    limit:
      'This is payment math, not a lender Loan Estimate, approval, or APR disclosure. It does not include points, closing costs, prepaid interest, escrow setup, property-tax reassessments, PMI cancellation rules, adjustable-rate changes, credit review, debt-to-income rules, or cash-to-close requirements.',
    useCases: [
      'Estimate monthly mortgage principal and interest from home price, down payment, rate, and term.',
      'Add common monthly ownership costs such as property tax, insurance, PMI, and HOA dues.',
      'Compare how down payment or rate changes affect monthly payment and total interest.',
      'Check loan-to-value before discussing PMI or lending options.',
    ],
    examples: [
      { label: 'Starter estimate', expression: '$400,000 home, $80,000 down, 6.5%, 30 years, $4,800 tax/year, $140 insurance, $75 HOA', result: 'About $2,637.62/month total, with $2,022.62 principal and interest and 80% LTV' },
      { label: 'PMI example', expression: '$360,000 home, $40,000 down, 5.9%, 30 years, $3,600 tax/year, $120 insurance, $95 PMI', result: 'About $2,413.04/month total and about 88.89% LTV' },
      { label: '15-year comparison', expression: '$400,000 home, $80,000 down, 6.1%, 15 years, same tax and insurance', result: 'About $3,332.66/month total but about $169,178.93 total interest' },
    ],
    relatedSlugs: ['loan-calculator', 'amortization-calculator', 'interest-rate-calculator'],
    inputExplanations: [
      { term: 'Home price', meaning: 'the purchase price you want to test before closing costs.' },
      { term: 'Down payment', meaning: 'cash paid upfront toward the home price. The calculator subtracts this from the price to get the loan amount.' },
      { term: 'Interest rate', meaning: 'the yearly note rate used for payment math, entered as 6.5 for 6.5%.' },
      { term: 'Loan term', meaning: 'how many years the fixed payment is spread across, usually 15 or 30 for common comparisons.' },
      { term: 'Property tax per year', meaning: 'the yearly tax estimate. The calculator divides it by 12 for the monthly payment.' },
      { term: 'Insurance, PMI, and HOA', meaning: 'monthly add-ons. Enter 0 for any cost that does not apply.' },
    ],
    priorityFaq: [
      {
        question: 'What does PITI mean on a mortgage?',
        answer:
          'PITI means principal, interest, taxes, and insurance. The calculator shows principal and interest first, then adds property tax, insurance, PMI, and HOA so the full monthly estimate is easier to check.',
      },
      {
        question: 'Why is the total monthly payment higher than principal and interest?',
        answer:
          'Principal and interest only repay the loan. A real housing budget may also include property tax, homeowners insurance, mortgage insurance, and HOA dues. CFPB says these extra costs can appear in the projected payment section of a Loan Estimate.',
      },
      {
        question: 'Does this use today\'s mortgage rates automatically?',
        answer:
          'No. Enter the rate you want to test from a lender quote or rate table. Freddie Mac publishes market averages, but your real rate can change with credit, loan type, points, location, down payment, and timing.',
      },
      {
        question: 'Should I include PMI?',
        answer:
          'Include PMI if your loan estimate, lender, or scenario has monthly mortgage insurance. Do not guess it from LTV alone, because PMI rules and prices can vary by loan type, credit, down payment, and lender.',
      },
      {
        question: 'Is this the same as a lender Loan Estimate?',
        answer:
          'No. A Loan Estimate is a formal lender form. CFPB says it includes estimated interest rate, monthly payment, closing costs, tax and insurance estimates, and special loan features. This page only estimates the numbers you enter.',
      },
    ],
    formulaCheck:
      'If the monthly payment looks wrong, check four things first: the rate is entered as a percent, property tax is yearly, insurance is monthly, and the down payment is a dollar amount instead of a percent.',
    resultReading:
      'Start with total monthly payment, then look at principal and interest, total interest, LTV, and the tax-plus-insurance line. A smaller monthly payment can still cost more if the term is longer.',
    doubleCheck:
      'Compare the estimate with a lender Loan Estimate before making a decision. Check the interest rate, APR, points, closing costs, escrow, PMI, property tax, insurance, HOA dues, and whether the loan is fixed or adjustable.',
    limitFollowup:
      'It also cannot tell whether you qualify, whether the home appraises, or whether the payment fits your full budget after repairs, utilities, moving costs, and cash reserves.',
    extraFaq: [
      {
        question: 'Why does a 15-year mortgage show a higher payment but less interest?',
        answer:
          'A 15-year mortgage spreads the same loan over fewer months. That usually raises the monthly payment, but the balance falls faster, so less interest builds up over the life of the loan.',
      },
      {
        question: 'Can I use this for an adjustable-rate mortgage?',
        answer:
          'Only as a rough starting payment check. The calculator assumes the rate stays fixed for the full term. Adjustable-rate loans can change later, so read the ARM details in the lender documents.',
      },
    ],
  }),
  makeFinanceTool({
    slug: 'loan-calculator',
    name: 'Loan Calculator',
    summary: 'Estimate a fixed monthly loan payment, total paid, and total interest from amount, rate, and term.',
    description:
      'Use this free loan calculator to estimate a fixed monthly payment, total paid, total interest, and payment count from loan amount, annual interest rate, and term.',
    seoTitle: 'Loan Calculator | Monthly Payment & Interest',
    seoDescription:
      'Estimate a fixed loan payment from amount, rate, and term. See monthly payment, total paid, total interest, and APR-versus-interest cautions.',
    icon: 'calculator-loan',
    aliases: ['loan payment calculator', 'monthly loan payment calculator', 'fixed loan calculator', 'personal loan payment estimate'],
    formula:
      'The calculator uses the standard amortized loan payment formula: payment equals principal times monthly rate times growth factor divided by growth factor minus one.',
    limit:
      'This is fixed-rate payment math only. It is not a lender quote, APR disclosure, approval decision, payoff statement, or Loan Estimate, and it does not include fees, taxes, insurance, prepayment penalties, late fees, variable-rate changes, or lender-specific rounding.',
    useCases: [
      'Estimate payments for personal loans, student loans, or other fixed-payment debt.',
      'Compare different loan terms before choosing a repayment plan.',
      'See the total interest cost behind a monthly payment.',
      'Use the result as a baseline before checking an amortization table or written loan offer.',
    ],
    examples: [
      { label: 'Personal loan', expression: '$12,000 at 9.5% for 4 years', result: 'About $301.48/month and $2,470.93 interest' },
      { label: 'Large loan', expression: '$50,000 at 7% for 6 years', result: 'About $852.45/month and $11,376.42 interest' },
      { label: 'Zero interest', expression: '$3,000 at 0% for 12 months', result: '$250/month with no interest before fees' },
    ],
    relatedSlugs: ['payment-calculator', 'amortization-calculator', 'interest-rate-calculator'],
    inputExplanations: [
      { term: 'Loan amount', meaning: 'the principal you plan to borrow before fees or add-ons.' },
      { term: 'Interest rate', meaning: 'the yearly contract rate used for payment math, entered as 9.5 for 9.5%.' },
      { term: 'Loan term', meaning: 'how long repayment lasts. Four years means 48 monthly payments.' },
    ],
    priorityFaq: [
      {
        question: 'How does the Loan Calculator find the monthly payment?',
        answer:
          'It converts the annual interest rate into a monthly rate, turns the term into monthly payments, then uses the fixed-payment amortization formula. For $12,000 at 9.5% over 4 years, that works out to about $301.48 per month before any fees.',
      },
      {
        question: 'Why should I look at total interest?',
        answer:
          'The monthly payment can hide the real cost. A longer term can make the payment smaller while adding more interest. Total interest shows how much extra money is paid above the original loan amount if the rate and payment stay fixed.',
      },
      {
        question: 'Should I enter interest rate or APR?',
        answer:
          'Use the contract interest rate for basic payment math. APR can include certain fees, so CFPB says it is useful for comparing offers, but this simple calculator cannot know every fee unless the loan terms give you a clean rate to enter.',
      },
      {
        question: 'Does this include lender fees?',
        answer:
          'No. Origination fees, finance charges, application fees, late fees, insurance, taxes, and prepayment penalties are not included. Check the written offer, Truth in Lending disclosure, or Loan Estimate before signing.',
      },
      {
        question: 'Does this create an amortization table?',
        answer:
          'This page gives the quick monthly payment, total paid, and total interest. Use the Amortization Calculator when you want the month-by-month split between principal, interest, and remaining balance.',
      },
      {
        question: 'Can I use this for a 0% loan?',
        answer:
          'Yes. If the rate is 0%, the calculator divides the principal by the number of payments. A $3,000 loan over 12 months is $250 per month before fees or penalties.',
      },
      {
        question: 'Is the result a loan approval?',
        answer:
          'No. Approval can depend on credit, income, debt-to-income ratio, collateral, documents, lender rules, and the exact offer. This page only estimates payment math from the numbers you type.',
      },
    ],
    formulaCheck:
      'It assumes a fixed rate, monthly payments, and no added fees. It does not solve an official APR disclosure or read the lender contract.',
    resultReading:
      'Start with the monthly payment, then check total paid and total interest. If the payment looks easy but total interest is high, test a shorter term or lower rate before trusting the first scenario.',
    doubleCheck:
      'Compare the estimate with the written loan offer, APR, fees, payment schedule, prepayment terms, and any Loan Estimate or Truth in Lending disclosure that applies.',
    limitFollowup:
      'Use an official lender disclosure for APR, finance charge, amount financed, total of payments, late fees, prepayment penalties, taxes, insurance, and approval conditions.',
  }),
  makeFinanceTool({
    slug: 'auto-loan-calculator',
    name: 'Auto Loan Calculator',
    summary: 'Estimate a car payment from vehicle price, tax, fees, down payment, trade-in, rate, and term.',
    description:
      'Estimate an auto loan payment from vehicle price, sales tax, fees, down payment, trade-in value, interest rate, and loan term.',
    seoTitle: 'Auto Loan Calculator | Car Payment, Tax & Interest',
    seoDescription:
      'Estimate a car payment from price, tax, fees, down payment, trade-in value, rate, and term. See amount financed, monthly payment, total interest, and total paid.',
    icon: 'calculator-auto-loan',
    aliases: ['car payment calculator', 'vehicle loan calculator', 'car loan calculator', 'auto payment calculator'],
    formula:
      'The calculator estimates taxable vehicle price, adds sales tax and fees, subtracts down payment and trade-in value, then applies the fixed-payment loan formula to estimate the monthly payment.',
    limit:
      'This is a vehicle-payment estimate only. It is not a lender quote and does not include every dealer add-on, registration charge, rebate rule, trade-in tax rule, APR fee, credit approval condition, insurance cost, or prepayment term.',
    useCases: [
      'Estimate a monthly car payment before talking to a dealer or lender.',
      'Compare how down payment, trade-in value, taxes, fees, APR, and loan term move the result.',
      'See how a longer term can lower the payment while raising total interest.',
      'Check the amount financed and total paid instead of judging the deal by monthly payment only.',
    ],
    examples: [
      { label: 'Used vehicle', expression: '$32,000 price, $4,000 down, $3,000 trade-in, 6% tax, 7.2% for 5 years', result: 'About $549.92/month with $27,640 financed and $5,355.02 interest' },
      { label: 'Lower down payment', expression: '$28,000 price, $1,500 down, 6.25% tax, 7.9% for 6 years', result: 'About $507.05/month with $29,000 financed and $7,507.54 interest' },
      { label: 'Shorter term', expression: '$30,000 price, $5,000 down, $2,500 trade-in, 6.8% for 4 years', result: 'About $593.06/month with $3,604.34 interest' },
    ],
    relatedSlugs: ['loan-calculator', 'sales-tax-calculator', 'cash-back-or-low-interest-calculator'],
    inputExplanations: [
      { term: 'Vehicle price', meaning: 'the negotiated price before down payment, trade-in, tax, and fees.' },
      { term: 'Down payment', meaning: 'cash paid up front so less money has to be financed.' },
      { term: 'Trade-in value', meaning: 'the value credited for your current vehicle; some places tax trade-ins differently.' },
      { term: 'Sales tax and fees', meaning: 'estimated taxes, title, registration, dealer, or lender charges added before financing.' },
      { term: 'Interest rate and term', meaning: 'the annual rate and number of years used for the fixed monthly payment estimate.' },
    ],
    priorityFaq: [
      {
        question: 'How does the Auto Loan Calculator find the monthly payment?',
        answer:
          'It estimates the amount financed first: vehicle price plus tax and fees, minus down payment and trade-in value. Then it uses a fixed-payment loan formula with the rate and term to estimate the monthly payment.',
      },
      {
        question: 'Why should I look past the monthly payment?',
        answer:
          'A lower payment can hide a more expensive loan if the term is longer or the rate is higher. Compare amount financed, total interest, and total paid before deciding that a smaller monthly payment is a better deal.',
      },
      {
        question: 'Should I enter APR or interest rate?',
        answer:
          'Use the rate your loan quote gives for payment math. APR can include some credit costs, so it is helpful for comparing offers, but the calculator cannot know every lender fee unless you add it yourself.',
      },
      {
        question: 'How should I handle trade-in value?',
        answer:
          'Enter the trade-in value as the amount credited toward the deal. If you owe more than the trade-in is worth, that negative equity may increase the amount financed and should be added to the deal outside this simple estimate.',
      },
    ],
    extraFaq: [
      {
        question: 'Does this include dealer add-ons or registration?',
        answer:
          'Only if you include them in the fees field. Extended warranties, service contracts, gap products, title, registration, document fees, and other add-ons can change both the amount financed and the total cost.',
      },
      {
        question: 'Can I use this before shopping for financing?',
        answer:
          'Yes. It is useful for comparing rough scenarios before shopping, but a real offer should still be checked against written terms from a bank, credit union, finance company, or dealer.',
      },
    ],
  }),
  makeFinanceTool({
    slug: 'interest-calculator',
    name: 'Interest Calculator',
    summary: 'Calculate simple or compound interest from principal, rate, and time.',
    description:
      'Use this free interest calculator to estimate simple interest or compound interest with principal, annual rate, time, compounding frequency, and monthly contributions.',
    icon: 'calculator-interest',
    formula:
      'Simple interest is principal times rate times time. Compound interest grows the balance by the effective periodic rate and can include monthly contributions.',
    limit: financeLimit,
    useCases: [
      'Compare simple interest with compound interest.',
      'Estimate interest earned on savings or interest charged on a balance.',
      'Test how contribution size and time change compound growth.',
      'Build intuition before using the investment or compound interest calculators.',
    ],
    examples: [
      { label: 'Simple interest', expression: '$1,000 at 5% for 3 years', result: '$150 interest before any fees or tax' },
      { label: 'Compound growth', expression: '$2,500 at 6% for 10 years', result: 'Ending balance with compounding' },
      { label: 'Monthly deposits', expression: '$1,000 plus $100/month at 6%', result: 'Contribution growth estimate' },
    ],
    relatedSlugs: ['compound-interest-calculator', 'investment-calculator', 'interest-rate-calculator'],
  }),
  makeFinanceTool({
    slug: 'payment-calculator',
    name: 'Payment Calculator',
    summary: 'Find a fixed monthly payment from amount, rate, and term.',
    description:
      'Use this free payment calculator to estimate a fixed monthly payment, total paid, and total interest for an amortized balance.',
    icon: 'calculator-payment',
    formula:
      'The calculator divides the annual rate by 12 and uses the fixed-payment amortization formula across the selected number of months.',
    limit: financeLimit,
    useCases: [
      'Estimate a monthly payment from a principal amount.',
      'Compare monthly payments for different rates or repayment terms.',
      'Check total interest before accepting a payment plan.',
      'Estimate payoff costs for a fixed-rate balance.',
    ],
    examples: [
      { label: 'Small balance', expression: '$5,000 at 8% for 3 years', result: 'Monthly payment estimate' },
      { label: 'Longer term', expression: '$15,000 at 10% for 5 years', result: 'Lower payment, higher interest' },
      { label: 'Rate comparison', expression: '$20,000 at 6% vs 9%', result: 'Payment difference' },
    ],
    relatedSlugs: ['loan-calculator', 'interest-rate-calculator', 'amortization-calculator'],
  }),
  makeFinanceTool({
    slug: 'retirement-calculator',
    name: 'Retirement Calculator',
    summary: 'Project retirement savings from current balance, monthly contributions, and return.',
    description:
      'Use this free retirement calculator to project future savings, total contributions, estimated growth, and the gap to a retirement target.',
    icon: 'calculator-retirement',
    formula:
      'The calculator compounds current savings and monthly contributions at an estimated annual return, then compares the future value with your target amount.',
    limit:
      'This is a long-term projection, not retirement advice. It does not include taxes, account rules, contribution limits, market volatility, inflation, benefits, or withdrawal planning.',
    useCases: [
      'Project a retirement savings balance over time.',
      'Compare contribution amounts and estimated returns.',
      'Check the gap between projected balance and a target number.',
      'Use a consistent planning estimate while adjusting assumptions.',
    ],
    examples: [
      { label: 'Early saver', expression: '$25,000 saved, $500/month, 7%, 25 years', result: 'Projected retirement balance' },
      { label: 'Catch-up view', expression: '$80,000 saved, $900/month, 6%, 15 years', result: 'Target gap estimate' },
      { label: 'Return sensitivity', expression: '5%, 7%, and 9% return assumptions', result: 'Different future balances' },
    ],
    relatedSlugs: ['investment-calculator', 'compound-interest-calculator', 'inflation-calculator'],
  }),
  makeFinanceTool({
    slug: 'amortization-calculator',
    name: 'Amortization Calculator',
    summary: 'Estimate payoff time, total interest, and extra-payment savings.',
    description:
      'Use this free amortization calculator to estimate scheduled payment, payoff time, total interest, and savings from extra monthly payments.',
    icon: 'calculator-amortization',
    aliases: ['Mortgage Amortization Calculator', 'Loan Amortization Calculator', 'Amortization Schedule Calculator'],
    formula:
      'The calculator starts with the scheduled amortized payment, then simulates monthly interest and principal reduction with any extra payment you enter.',
    limit: financeLimit,
    useCases: [
      'Estimate how a loan balance pays down over time.',
      'Compare scheduled payoff with extra monthly payments.',
      'Estimate interest saved by paying more than the required amount.',
      'Understand how monthly interest affects principal reduction.',
    ],
    examples: [
      { label: 'Extra payment', expression: '$200,000 at 6%, 30 years, +$100/month', result: 'Payoff time and interest saved' },
      { label: 'No extra payment', expression: '$50,000 at 8%, 6 years', result: 'Scheduled payoff estimate' },
      { label: 'Shorter term', expression: '$300,000 at 6.5%, 15 years', result: 'Faster payoff, lower interest' },
    ],
    relatedSlugs: ['mortgage-calculator', 'loan-calculator', 'payment-calculator'],
  }),
  makeFinanceTool({
    slug: 'investment-calculator',
    name: 'Investment Calculator',
    summary: 'Project investment growth from starting money, monthly deposits, return, and time.',
    description:
      'Use this free investment calculator to project ending balance, total contributions, and estimated growth from starting money, monthly deposits, return, and time.',
    seoTitle: 'Investment Calculator | Monthly Deposits & Growth Projection',
    seoDescription:
      'Project an investment balance from starting money, monthly deposits, estimated return, and time. See total contributions, growth, fees, risk, and limits.',
    icon: 'calculator-investment',
    aliases: [
      'monthly investment calculator',
      'investment growth calculator',
      'investment calculator with inflation',
      'investment calculator formula',
      'investment return calculator',
    ],
    formula:
      'The calculator compounds the starting amount and monthly contributions using an estimated annual return converted to monthly growth.',
    limit:
      'This is an investment projection, not investment advice. It does not include taxes, fees, inflation, withdrawals, market losses, account rules, or guaranteed returns.',
    useCases: [
      'Estimate future value from monthly investing.',
      'Compare how time and contribution size affect growth.',
      'Separate total contributions from estimated investment gains.',
      'Test return assumptions before using a real investment plan or adviser conversation.',
    ],
    examples: [
      {
        label: 'Monthly investing',
        expression: '$5,000 initial, $250/month, 7%, 20 years',
        result: 'About $150,425.36 ending balance, with $65,000 contributed and about $85,425.36 growth',
      },
      {
        label: 'No new deposits',
        expression: '$10,000 at 6% for 15 years',
        result: 'About $24,540.94 ending balance, with about $14,540.94 growth',
      },
      {
        label: 'Contribution comparison',
        expression: '$5,000 initial, 7%, 20 years, $100 vs $300/month',
        result: 'About $72,286.36 vs $176,471.69 ending balance',
      },
    ],
    inputExplanations: [
      { term: 'Starting investment', meaning: 'the money already invested before the projection starts.' },
      { term: 'Monthly contribution', meaning: 'the amount added at the end of each month in this simple model.' },
      { term: 'Estimated return', meaning: 'the annual return assumption. It is not a promise and real markets move unevenly.' },
      { term: 'Time', meaning: 'how many years the projection runs before showing the ending balance.' },
    ],
    priorityFaq: [
      {
        question: 'How does the Investment Calculator handle monthly deposits?',
        answer:
          'It converts the annual return assumption into monthly growth, compounds the starting money, then adds each monthly contribution at the end of the month. That timing is why the result is an estimate, not a brokerage statement.',
      },
      {
        question: 'Does this include withdrawals?',
        answer:
          'No. This version is for money going in, not money coming out. If you need retirement withdrawals, required minimum distributions, or a drawdown plan, use a dedicated retirement or payout calculator instead.',
      },
      {
        question: 'Does this include inflation?',
        answer:
          'No. It shows the future balance in the dollars you enter. Use the Inflation Calculator beside it if you want to see how buying power could shrink over the same years.',
      },
    ],
    formulaCheck:
      'For the starter example, $5,000 plus $250 each month at a 7% annual return for 20 years projects about $150,425.36. The calculator shows $65,000 of contributions and about $85,425.36 of estimated growth.',
    resultReading:
      'Start with ending balance, then check total contributions and estimated growth. Contributions are the money you put in. Estimated growth is the part that came from the return assumption.',
    doubleCheck:
      'Check the time period, contribution amount, and return assumption. Then remember that fees, taxes, inflation, withdrawals, account limits, and market losses can change the real account value.',
    limitFollowup:
      'Before using the number for a real decision, compare it with your account fees, tax situation, risk level, and an official account or adviser source.',
    extraFaq: [
      {
        question: 'Why can small fees matter so much?',
        answer:
          'Fees can take money out every year, and the removed money no longer compounds. Investor.gov shows that even small annual fee differences can create a large gap over long periods.',
      },
      {
        question: 'Can I use this as an investment recommendation?',
        answer:
          'No. It only does math from the numbers you enter. It does not choose stocks, funds, bonds, accounts, risk level, or tax strategy.',
      },
      {
        question: 'Why does the same return every year feel unrealistic?',
        answer:
          'Because real investments can rise, fall, pause, or lose money. A steady return is useful for comparing scenarios, but it is not how markets usually move year by year.',
      },
      {
        question: 'Is this the same as a compound interest calculator?',
        answer:
          'It is close, but this page uses investment wording and monthly deposits. Use the Compound Interest Calculator when you need compounding-frequency controls, and use this page when the question is monthly investing.',
      },
    ],
    relatedSlugs: ['compound-interest-calculator', 'retirement-calculator', 'inflation-calculator'],
  }),
  makeFinanceTool({
    slug: 'inflation-calculator',
    name: 'Inflation Calculator',
    summary: 'Estimate future cost and buying power from an annual inflation rate.',
    description:
      'Use this free inflation calculator to estimate future cost and present buying power from an amount, annual inflation rate, and number of years.',
    icon: 'calculator-inflation',
    formula:
      'The calculator raises one plus the annual inflation rate to the number of years, then multiplies or divides the amount by that multiplier.',
    limit:
      'This is a rate-based inflation estimate. It does not look up CPI history, and the actual price of one item may rise faster or slower than broad inflation.',
    useCases: [
      'Estimate what today costs might become after inflation.',
      'Estimate the future buying power of a fixed dollar amount.',
      'Stress-test long-term savings or retirement assumptions.',
      'Compare annual inflation-rate scenarios.',
    ],
    examples: [
      { label: 'Future cost', expression: '$100 at 3% inflation for 10 years', result: 'About $134.39 future cost' },
      { label: 'Buying power', expression: '$1,000 after 5 years at 4%', result: 'Lower present buying power' },
      { label: 'Planning scenario', expression: '$2,500 monthly expenses at 2.5%', result: 'Future monthly estimate' },
    ],
    relatedSlugs: ['investment-calculator', 'retirement-calculator', 'compound-interest-calculator'],
  }),
  makeFinanceTool({
    slug: 'finance-calculator',
    name: 'Finance Calculator',
    summary: 'Project a future balance from starting money, monthly deposits, rate, and time.',
    description:
      'Use this free finance calculator as a what-if money projection for starting balance, monthly deposits, annual rate, and time.',
    seoTitle: 'Finance Calculator | Future Balance What-If',
    seoDescription:
      'Estimate a future balance from starting money, monthly deposits, annual rate, and time. See contributions, growth, and honest limits.',
    icon: 'calculator-finance',
    aliases: ['Future Balance Calculator', 'Money Projection Calculator', 'Savings Projection Calculator'],
    formula:
      'The calculator converts the annual rate into monthly growth, compounds the starting balance, and adds each monthly deposit at the end of the month.',
    limit:
      'This is a simple projection, not financial advice or a guaranteed return. It does not include tax, fees, inflation, withdrawals, changing rates, market losses, account rules, or provider terms.',
    useCases: [
      'Run a quick future-balance estimate before choosing a specialized tool.',
      'See how monthly deposits change a savings or investment scenario.',
      'Compare 3%, 5%, and 7% rate assumptions without pretending any rate is promised.',
      'Use a first-pass money projection before opening a loan, investment, retirement, or compound-interest calculator.',
    ],
    examples: [
      { label: 'Savings projection', expression: '$2,000 plus $150/month at 5% for 8 years', result: 'About $20,642.25 ending balance' },
      { label: 'Short-term plan', expression: '$500 plus $75/month at 2% for 2 years', result: 'About $2,355.31 ending balance' },
      { label: 'Rate check', expression: '$2,000 plus $150/month at 7% for 8 years', result: 'About $22,725.48 ending balance' },
    ],
    inputExplanations: [
      { term: 'Starting amount', meaning: 'the money already in the account or scenario before future deposits.' },
      { term: 'Monthly contribution', meaning: 'the amount added at the end of each month. Use 0 if there are no new deposits.' },
      { term: 'Estimated annual rate', meaning: 'the what-if growth rate, entered as 5 for 5%, not 0.05.' },
      { term: 'Time', meaning: 'how many years the projection runs before showing the ending balance.' },
    ],
    priorityFaq: [
      {
        question: 'Is this the same as an investment calculator?',
        answer:
          'It uses the same basic future-balance idea, but it stays general. Use the Investment Calculator when you want investment wording, the Compound Interest Calculator when compounding frequency matters, and the Payment Calculator when the question is debt payment.',
      },
      {
        question: 'Why does a small rate change move the result so much?',
        answer:
          'The rate is applied every month for the whole time period. That means extra time gives growth more chances to build on itself. The rate is still only an assumption, not a promise.',
      },
    ],
    formulaCheck:
      'For the starter example, $2,000 plus $150 each month at 5% for 8 years gives about $20,642.25, made from $16,400 in contributions and about $4,242.25 in estimated growth.',
    resultReading:
      'Start with the ending balance, then check total contributions and estimated growth. Contributions are the money you put in. Estimated growth is the part that came from the rate assumption.',
    doubleCheck:
      'Check that the monthly contribution is monthly, the rate is a percent like 5, and the time is in years. Then test a lower rate so the projection does not feel more certain than it is.',
    limitFollowup:
      'If the number affects a real loan, tax, retirement, or investment decision, use the matching specialized calculator and compare it with official account, lender, or adviser information.',
    relatedSlugs: ['investment-calculator', 'compound-interest-calculator', 'payment-calculator'],
  }),
  makeFinanceTool({
    slug: 'income-tax-calculator',
    name: 'Income Tax Calculator',
    summary: 'Estimate 2026 U.S. federal income tax from income, filing status, deduction, credits, and brackets.',
    description:
      'Use this free income tax calculator to estimate 2026 U.S. federal ordinary income tax, taxable income, effective rate, and marginal bracket from income, filing status, deduction, and credits.',
    seoTitle: 'Income Tax Calculator | 2026 Federal Brackets & Deduction',
    seoDescription:
      'Estimate 2026 U.S. federal income tax with filing status, standard deduction, credits, taxable income, effective rate, and marginal bracket.',
    icon: 'calculator-tax',
    aliases: ['federal income tax calculator', '2026 income tax calculator', 'tax bracket calculator', 'income tax estimator'],
    formula:
      'The calculator subtracts the selected deduction from gross income, applies the 2026 U.S. federal ordinary income tax brackets, then subtracts credits you enter.',
    limit:
      'This is a simplified federal income tax estimate only. It does not calculate state tax, payroll tax, capital gains, AMT, credit phaseouts, penalties, withholding, self-employment tax, or filing advice.',
    useCases: [
      'Estimate 2026 U.S. federal ordinary income tax for planning.',
      'Compare filing statuses with the standard deduction or a custom deduction.',
      'See taxable income, estimated federal tax, effective rate, and marginal bracket.',
      'Use a transparent estimate before checking IRS forms, withholding, tax software, or a tax professional.',
    ],
    examples: [
      {
        label: 'Single filer',
        expression: '$100,000 income, 2026 standard deduction',
        result: '$83,900 taxable income and about $13,170 federal ordinary income tax',
      },
      {
        label: 'Joint return',
        expression: '$160,000 income, married filing jointly',
        result: '$127,800 taxable income and about $17,540 federal ordinary income tax',
      },
      {
        label: 'Custom deduction',
        expression: '$90,000 income, head of household, $20,000 deduction',
        result: '$70,000 taxable income and about $8,301 federal ordinary income tax',
      },
    ],
    relatedSlugs: ['salary-calculator', 'finance-calculator', 'sales-tax-calculator'],
    inputExplanations: [
      { term: 'Filing status', meaning: 'the IRS filing bucket used for the 2026 standard deduction and bracket thresholds.' },
      { term: 'Gross ordinary income', meaning: 'the ordinary income you want to test before this calculator subtracts a deduction.' },
      { term: 'Deduction', meaning: 'the amount removed before brackets. Leave it blank to use the 2026 standard deduction for the filing status.' },
      { term: 'Credits', meaning: 'dollar-for-dollar reductions you want to test after bracket tax is calculated.' },
    ],
    priorityFaq: [
      {
        question: 'What 2026 tax brackets does this use?',
        answer:
          'It uses the IRS 2026 ordinary income bracket thresholds and standard deductions. For example, the single standard deduction is $16,100, married filing jointly is $32,200, and head of household is $24,150.',
      },
      {
        question: 'Why is my marginal rate higher than my effective rate?',
        answer:
          'The marginal rate is the rate on the next ordinary dollar. The effective rate compares estimated tax with gross income. A single filer at $100,000 can land in the 22% bracket while the effective federal ordinary income tax rate is about 13.17%.',
      },
      {
        question: 'Is this a paycheck or refund calculator?',
        answer:
          'No. It does not know your W-4, paycheck timing, payroll tax, state tax, withholding, estimated payments, refund history, or employer deductions. Use it for federal ordinary income tax math, then check IRS withholding tools or tax software for filing details.',
      },
    ],
    formulaCheck:
      'For the starter example, $100,000 single income minus the $16,100 standard deduction gives $83,900 taxable income. Bracket math gives about $13,170 tax before any credits entered.',
    resultReading:
      'Read taxable income first, then the estimated federal tax. Effective rate shows tax compared with gross income. Marginal bracket shows the rate on the next ordinary dollar, not the rate on every dollar.',
    doubleCheck:
      'Check the tax year, filing status, deduction choice, and whether the income is ordinary income. Then remember that credits, payroll tax, state tax, capital gains, and phaseouts can change the real return.',
    limitFollowup:
      'Use IRS forms, the IRS Tax Withholding Estimator, tax software, or a qualified tax professional before making filing, withholding, payment, or refund decisions.',
    extraFaq: [
      {
        question: 'Does this include state income tax?',
        answer:
          'No. This page is federal-only. State and city taxes can change the real bill, so check your state tax agency, local tax office, or filing software separately.',
      },
      {
        question: 'Can I enter itemized deductions?',
        answer:
          'Yes, as a custom deduction amount. The calculator will use the number you enter instead of the standard deduction, but it does not decide whether your itemized deduction is allowed.',
      },
      {
        question: 'Do credits work the same as deductions here?',
        answer:
          'No. A deduction lowers taxable income before bracket tax. A credit lowers the calculated tax after bracket tax. This calculator only subtracts the credit amount you enter; it does not check credit eligibility or phaseouts.',
      },
      {
        question: 'Why does this not match my tax software exactly?',
        answer:
          'Tax software can include many details this simple page leaves out, such as payroll tax, state tax, dependents, itemized deduction rules, capital gains, retirement contributions, AMT, penalties, and credit phaseouts.',
      },
    ],
  }),
  makeFinanceTool({
    slug: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    summary: 'Estimate compound growth with deposits, rate, time, and compounding frequency.',
    description:
      'Use this free compound interest calculator to estimate future value, total contributions, and interest from principal, deposits, rate, time, and compounding frequency.',
    icon: 'calculator-compound',
    formula:
      'The calculator converts the stated annual rate to an effective monthly growth rate from the selected compounding frequency, then compounds principal and monthly deposits.',
    limit: financeLimit,
    useCases: [
      'Estimate how compound interest can grow savings over time.',
      'Compare monthly deposits with a starting amount.',
      'Test annual, quarterly, monthly, or daily compounding assumptions.',
      'Separate contributions from estimated interest earned.',
    ],
    examples: [
      { label: 'Savings growth', expression: '$1,000, $100/month, 6%, 10 years', result: 'Projected future value' },
      { label: 'Daily compounding', expression: '$5,000 at 4.5%, daily', result: 'Effective-rate estimate' },
      { label: 'No deposits', expression: '$10,000 at 5% for 20 years', result: 'Compound-only balance' },
    ],
    relatedSlugs: ['interest-calculator', 'investment-calculator', 'retirement-calculator'],
  }),
  makeFinanceTool({
    slug: 'salary-calculator',
    name: 'Salary Calculator',
    summary: 'Convert annual salary to monthly, biweekly, weekly, daily, and hourly pay.',
    description:
      'Use this free salary calculator to convert annual salary into monthly, biweekly, weekly, daily, hourly, and pay period amounts with an optional simple tax-rate estimate.',
    icon: 'calculator-salary',
    formula:
      'The calculator divides annual salary by 12, 26, weeks per year, workdays, and annual hours. Optional tax is a simple percentage of annual salary.',
    limit:
      'This is a paycheck-style estimate, not payroll advice. It does not include actual withholding tables, benefits, pre-tax deductions, overtime, bonuses, state tax, or local tax.',
    useCases: [
      'Convert annual salary into hourly pay.',
      'Compare monthly, biweekly, weekly, daily, and pay period gross pay.',
      'Use a simple tax-rate estimate to approximate take-home pay.',
      'Compare job offers with different hours or weeks worked.',
    ],
    examples: [
      { label: 'Full-time salary', expression: '$78,000, 40 hours/week, 52 weeks', result: '$37.50 gross hourly' },
      { label: 'School-year job', expression: '$45,000, 37.5 hours/week, 40 weeks', result: 'Hourly equivalent' },
      { label: 'Simple tax estimate', expression: '$60,000 with 20% tax estimate', result: 'Estimated monthly take-home' },
    ],
    relatedSlugs: ['income-tax-calculator', 'finance-calculator', 'percentage-calculator'],
  }),
  makeFinanceTool({
    slug: 'interest-rate-calculator',
    name: 'Interest Rate Calculator',
    summary: 'Find the rate hidden inside a fixed loan payment quote.',
    description:
      'Enter the amount financed, fixed monthly payment, and loan term to estimate the annual interest rate behind the quote.',
    seoTitle: 'Interest Rate Calculator | Estimate Rate From Payment',
    seoDescription:
      'Estimate the annual interest rate hidden inside a loan payment quote from amount financed, monthly payment, and term, with APR fee warnings.',
    icon: 'calculator-rate',
    aliases: ['calculate interest rate from payment', 'loan rate calculator', 'implied interest rate calculator'],
    formula:
      'The calculator searches for the monthly rate that makes the fixed-payment loan formula match your monthly payment, then converts that to an annual rate.',
    limit:
      'This is an estimated nominal annual rate. It does not calculate APR with fees, compounding disclosures, promotional terms, variable rates, or lender-specific rules.',
    useCases: [
      'Estimate the rate implied by a loan payment offer.',
      'Compare payment quotes when the rate is missing.',
      'Check whether a payment is possible for a principal and term.',
      'Use the answer alongside loan and payment calculators.',
    ],
    examples: [
      { label: 'Payment quote', expression: '$25,000 principal, $483.32/month, 5 years', result: 'About 6% annual interest, $3,999.20 interest' },
      { label: 'Smaller loan quote', expression: '$15,000, $350/month, 4 years', result: 'About 5.67% annual interest, $1,800 interest' },
      { label: 'Longer quote', expression: '$30,000, $540/month, 6 years', result: 'About 8.95% annual interest, $8,880 interest' },
    ],
    relatedSlugs: ['loan-calculator', 'payment-calculator', 'apr-calculator'],
    inputExplanations: [
      { term: 'Principal', meaning: 'the loan amount you are trying to repay, before interest.' },
      { term: 'Monthly payment', meaning: 'the fixed payment quote you were given, without taxes, insurance, or fees if you only want the loan rate.' },
      { term: 'Term', meaning: 'how many years the loan lasts. The calculator converts this into monthly payments.' },
    ],
    priorityFaq: [
      {
        question: 'How does the payment quote turn into a rate?',
        answer:
          'The calculator tries monthly rates until the fixed-payment formula lands on the payment you entered. For $25,000, $483.32 per month, and 5 years, the match is about 6% before extra fees.',
      },
      {
        question: 'Why can APR be different from this estimated rate?',
        answer:
          'CFPB explains that APR can include the interest rate plus certain fees. This page backs into the rate from the payment only, so lender fees can make the real APR higher.',
      },
    ],
    extraFaq: [
      {
        question: 'Is this the same as APR?',
        answer:
          'No. This estimates the nominal annual interest rate that fits the payment, amount, and term. APR can include lender fees and other costs, so it may be higher than this estimate.',
      },
      {
        question: 'What payment should I enter?',
        answer:
          'Enter the loan payment only. If a quote bundles taxes, insurance, warranties, or fees into the monthly number, the calculator may show a rate that looks too high.',
      },
      {
        question: 'Why does a tiny payment change move the rate so much?',
        answer:
          'The calculator is solving backward. A few dollars each month can add up across 36, 60, or 84 payments, so the implied rate can move more than expected.',
      },
      {
        question: 'What if the calculator says the payment is too low?',
        answer:
          'That means the payment would not repay the principal over the term even at 0% interest. Check the loan amount, payment, and term before trusting the quote.',
      },
      {
        question: 'When should I use the Loan Calculator instead?',
        answer:
          'Use the Loan Calculator when you already know the rate and want the payment. Use this Interest Rate Calculator when you know the payment but the rate is missing.',
      },
      {
        question: 'Can I use this for credit cards or variable-rate loans?',
        answer:
          'Not as a final answer. Credit cards, variable-rate loans, balloon loans, and promotional plans can use rules this simple fixed-payment estimate does not include.',
      },
    ],
    formulaCheck:
      'For $25,000, $483.32 per month, and 5 years, the solver lands near 0.5% per month, which is about 6% per year before fees.',
    resultReading:
      'Read the estimated annual rate first, then check monthly rate, total paid, and total interest. If the payment included taxes, insurance, warranties, or lender fees, the rate can look higher than the loan rate itself.',
    doubleCheck:
      'Check that the monthly payment is only the loan payment, the amount is the amount financed, and the term matches the quote. If the lender gave APR, fees, or a Loan Estimate, compare those written numbers too.',
    limitFollowup:
      'Use lender disclosures, APR rules, and written offer details before treating a quote as cheap or expensive.',
  }),
  makeFinanceTool({
    slug: 'sales-tax-calculator',
    name: 'Sales Tax Calculator',
    summary: 'Find sales tax and final total from a subtotal and local rate.',
    description:
      'Enter the before-tax price and a local sales tax rate to estimate the tax amount, final total, and percent math behind the receipt.',
    seoTitle: 'Sales Tax Calculator | Tax Amount And Total',
    seoDescription:
      'Calculate sales tax amount and final total from a before-tax price and local tax rate, with receipt checks, rounding notes, and local-rate limits.',
    icon: 'calculator-sales-tax',
    aliases: ['tax calculator', 'sales tax rate calculator', 'receipt tax calculator', 'checkout tax calculator'],
    formula:
      'The calculator changes the sales tax rate into a decimal, multiplies subtotal by that rate to get tax, then adds tax to subtotal for the final total.',
    limit:
      'This is a manual-rate estimate. It does not look up current local rates, product exemptions, shipping rules, marketplace rules, tax holidays, or official filing amounts.',
    useCases: [
      'Estimate sales tax before checkout when you already know the local rate.',
      'Convert a before-tax subtotal and percent rate into a final total.',
      'Check receipt math when the tax line looks a few cents off.',
      'Separate simple purchase math from income tax, VAT, or official sales-tax filing work.',
    ],
    examples: [
      { label: 'Simple total', expression: '$80 at 7.5%', result: '$6 tax, $86 total' },
      { label: 'Large purchase', expression: '$1,200 at 6.25%', result: '$75 tax, $1,275 total' },
      { label: 'Receipt check', expression: '$42.50 at 8.2%', result: '$3.49 tax, $45.99 total' },
    ],
    relatedSlugs: ['percentage-calculator', 'percent-off-calculator', 'auto-loan-calculator'],
    inputExplanations: [
      { term: 'Subtotal', meaning: 'the price before sales tax, usually after any discount that already applies to the item.' },
      { term: 'Sales tax rate', meaning: 'the combined state and local rate written as a percent, such as 7.5 for 7.5%, not 0.075.' },
    ],
    extraFaq: [
      {
        question: 'Does this calculator look up my local sales tax rate?',
        answer:
          'No. It uses the rate you enter. Sales tax can change by state, city, county, product type, shipping rule, or tax holiday, so use a current local rate from checkout, a state tax page, or a trusted tax table.',
      },
      {
        question: 'Should I calculate sales tax before or after a discount?',
        answer:
          'Most normal checkout math applies a discount first, then calculates sales tax on the reduced taxable price. Some coupons, shipping charges, and local rules can work differently, so check the receipt if the cents do not match.',
      },
      {
        question: 'Why is my receipt off by one or two cents?',
        answer:
          'Stores may round each item, round the whole basket, or apply different taxability rules to different products. A one-cent difference is usually rounding, but a larger gap means the rate or taxable subtotal may be different.',
      },
      {
        question: 'Can this remove tax from a total?',
        answer:
          'Not as a separate reverse mode yet. If the total already includes tax, the rough reverse formula is before-tax price = total / (1 + rate / 100).',
      },
      {
        question: 'Is this the same as the IRS sales tax deduction calculator?',
        answer:
          'No. This page checks one purchase or receipt. The IRS sales tax deduction calculator is for estimating state and local sales tax deduction amounts when itemizing federal taxes.',
      },
    ],
  }),
  makeFinanceTool({
    slug: 'currency-calculator',
    name: 'Currency Calculator',
    summary: 'Convert money with a manual exchange rate and optional exchange fee.',
    description:
      'Use this free currency calculator to convert an amount with a manual exchange rate, subtract an optional exchange fee, and see clear conversion steps.',
    icon: 'calculator-currency',
    formula:
      'The calculator multiplies the source amount by the exchange rate you enter, then subtracts the optional fee percentage from the converted amount.',
    limit:
      'This tool does not fetch live exchange rates. Use the current rate from your bank, card, transfer service, or trusted rate source before relying on the conversion.',
    useCases: [
      'Convert travel spending with a manual bank or card exchange rate.',
      'Estimate the effect of an exchange fee before sending money.',
      'Compare two exchange-rate quotes using the same amount.',
      'Check a quick currency conversion without creating an account.',
    ],
    examples: [
      { label: 'Simple conversion', expression: '100 at rate 1.25', result: '125 target units before fees' },
      { label: 'Travel fee', expression: '500 at rate 0.92 with 2.5% fee', result: 'Converted amount after fee' },
      { label: 'Large transfer', expression: '1,000 at rate 1.47', result: 'Manual exchange estimate' },
    ],
    relatedSlugs: ['percentage-calculator', 'finance-calculator', 'sales-tax-calculator'],
  }),
  makeFinanceTool({
    slug: 'mortgage-payoff-calculator',
    name: 'Mortgage Payoff Calculator',
    summary: 'Estimate early mortgage payoff time, interest saved, and months saved from extra principal payments.',
    description:
      'Estimate how extra monthly principal or a one-time payment may shorten a fixed-rate mortgage payoff, reduce interest, and change the remaining balance.',
    seoTitle: 'Mortgage Payoff Calculator | Extra Payments & Interest Saved',
    seoDescription:
      'Estimate early mortgage payoff from balance, rate, term, extra monthly principal, and one-time payments. See payoff time, interest saved, and months saved.',
    icon: 'calculator-mortgage-payoff',
    aliases: [
      'early mortgage payoff calculator',
      'extra mortgage payment calculator',
      'mortgage principal payment calculator',
      'pay off mortgage early calculator',
      'mortgage payoff calculator with extra payments',
    ],
    formula:
      'The calculator finds the scheduled fixed mortgage payment, subtracts any one-time principal payment from the balance, adds extra monthly principal to the scheduled payment, then simulates monthly interest and principal reduction until payoff.',
    limit:
      'This is not an official payoff quote. Your lender or mortgage servicer may apply extra payments differently and may include daily interest, escrow, unpaid fees, recording costs, wire instructions, payoff-statement rules, recast rules, or prepayment penalties.',
    useCases: [
      'See how extra monthly principal changes mortgage payoff time.',
      'Estimate interest saved from a one-time principal payment.',
      'Compare a normal payoff path with an aggressive early-payoff plan.',
      'Plan what to ask your lender or servicer before sending extra money.',
    ],
    examples: [
      { label: 'Extra monthly principal', expression: '$280,000 balance, 6.25%, 25 years left, +$200/month', result: 'About 20 years to payoff, 60 months saved, and about $63,050.68 interest saved' },
      { label: 'One-time principal payment', expression: '$240,000 balance, 6.5%, 20 years left, $5,000 extra now', result: 'Remaining balance drops to $235,000 and estimated interest falls by about $3,946.88' },
      { label: 'Aggressive early payoff', expression: '$320,000 balance, 6.6%, 28 years left, +$500/month and $10,000 now', result: 'About 17 years 1 month to payoff, 131 months saved, and about $175,003.22 interest saved' },
    ],
    relatedSlugs: ['mortgage-calculator', 'amortization-calculator', 'loan-calculator'],
    inputExplanations: [
      { term: 'Current loan balance', meaning: 'the unpaid principal balance you want to test, not the original home price.' },
      { term: 'Interest rate', meaning: 'the annual mortgage rate used for the estimate, entered as 6.25 for 6.25%.' },
      { term: 'Remaining term', meaning: 'the years left in the payoff scenario before any extra principal is added.' },
      { term: 'Extra monthly payment', meaning: 'extra money you plan to send each month and have applied to principal.' },
      { term: 'One-time extra payment', meaning: 'one extra principal payment made now before the payoff estimate starts.' },
    ],
    priorityFaq: [
      {
        question: 'Is this the same as a lender payoff quote?',
        answer:
          'No. CFPB explains that a payoff amount can be different from the current balance because it can include interest through the payoff date plus unpaid fees or a prepayment penalty. Ask your lender or servicer for the official payoff amount before sending final payoff money.',
      },
      {
        question: 'Why does applying extra money to principal matter?',
        answer:
          'Fannie Mae explains that extra principal reduces the mortgage balance, which can reduce future interest. Tell your lender or servicer that extra money should go to principal, then check the next statement to make sure it was applied that way.',
      },
      {
        question: 'Does a one-time principal payment always lower my required monthly payment?',
        answer:
          'Not always. This calculator reduces the balance and re-estimates the payoff path for planning. A real servicer may keep the scheduled payment the same unless a recast or re-amortization is allowed and approved.',
      },
    ],
    formulaCheck:
      'The estimate assumes fixed-rate monthly interest and that extra payments reduce principal. It does not model daily payoff interest, escrow, late fees, or servicer-specific application rules.',
    resultReading:
      'Payoff time tells you the estimated time until the balance reaches zero. Interest saved compares the extra-payment path with the scheduled path. Months saved shows how much earlier the loan may end.',
    doubleCheck:
      'Check that the balance is the current principal balance, the rate is annual, the term is years remaining, and any extra money is meant for principal. Then confirm with your servicer before sending extra or final payoff money.',
    limitFollowup:
      'For a final payoff, use the official payoff statement from the lender or servicer, not this planning estimate.',
    extraFaq: [
      {
        question: 'Can extra mortgage payments remove PMI or escrow?',
        answer:
          'Not by itself in this calculator. Paying down principal can change loan-to-value over time, but PMI cancellation, escrow, taxes, and insurance follow lender, investor, and legal rules outside this estimate.',
      },
    ],
  }),
  makeFinanceTool({
    slug: '401k-calculator',
    name: '401K Calculator',
    summary: 'Project 401K growth from salary contributions, employer match, return, and time.',
    description:
      'Estimate 401K growth from current balance, annual salary, contribution percent, employer match, estimated return, and years to grow.',
    seoTitle: '401K Calculator | Contribution, Match & Growth Estimate',
    seoDescription:
      'Project 401K growth from salary, contribution percent, employer match, current balance, return, and years. Check deposits, match, and estimate limits.',
    icon: 'calculator-401k',
    aliases: [
      '401k calculator with match',
      '401k growth calculator',
      'simple 401k calculator',
      '401k calculator by age',
      '401k contribution calculator',
    ],
    formula:
      'The calculator converts your salary contribution percent and estimated employer match into monthly deposits, then compounds the current balance and deposits monthly with the return you enter.',
    limit:
      'This is a simplified projection. It does not enforce IRS limits, plan rules, Roth or pre-tax treatment, vesting, fees, loans, withdrawals, taxes, or market volatility.',
    useCases: [
      'Estimate how a salary contribution percent affects a 401K balance.',
      'Compare the impact of an employer match and match cap.',
      'Project long-term growth from current balance, monthly deposits, and return assumptions.',
      'Check a 401K savings scenario before reviewing IRS limits and the official plan rules.',
    ],
    examples: [
      { label: '8% with 50% match', expression: '$25,000 saved, $75,000 salary, 8%, 50% match up to 6%, 7% for 25 years', result: 'About $700,059.74 projected, with $500/month from you and $187.50/month from the match' },
      { label: 'Match cap check', expression: '$10,000 saved, $60,000 salary, 6%, 100% match up to 3%, 6% for 20 years', result: 'About $241,020.45 projected, with $300/month from you and $150/month from the match' },
      { label: 'Higher contribution', expression: '$50,000 saved, $120,000 salary, 20.42%, 50% match up to 6%, 6.5% for 15 years', result: 'About $843,010.70 projected before plan limits, fees, taxes, and market changes' },
    ],
    relatedSlugs: ['retirement-calculator', 'investment-calculator', 'compound-interest-calculator'],
    inputExplanations: [
      { term: 'Current balance', meaning: 'the money already in the 401K account before this projection starts.' },
      { term: 'Annual salary', meaning: 'the gross salary used to estimate your employee contribution and employer match.' },
      { term: 'Your contribution', meaning: 'the percent of salary you plan to contribute, such as 8 for 8%.' },
      { term: 'Employer match', meaning: 'how much the employer adds compared with your contribution, such as 50 for a 50% match.' },
      { term: 'Match limit', meaning: 'the salary percent where the employer match stops, such as 6 for match up to 6% of salary.' },
      { term: 'Estimated return', meaning: 'a what-if annual return, not a guaranteed investment result.' },
    ],
    priorityFaq: [
      {
        question: 'Does this calculator enforce the 2026 IRS 401K limit?',
        answer:
          'No. IRS says the employee elective deferral limit for many 401(k), 403(b), governmental 457, and TSP plans is $24,500 for 2026, with a general $8,000 catch-up for age 50 or older. This tool shows a projection only, so compare the result with your plan and IRS limits.',
      },
      {
        question: 'Does the employer match always belong to me?',
        answer:
          'Not always. Your own salary deferrals are yours, but employer match money can follow a vesting schedule unless the plan says it is immediately vested. Check the plan rules before treating the match as money you can keep if you leave.',
      },
      {
        question: 'Should I enter Roth 401K or pre-tax 401K contributions differently?',
        answer:
          'No. This calculator only projects balance growth from deposits and return. It does not compare Roth versus pre-tax taxes, required Roth catch-up rules, payroll withholding, or future withdrawal tax.',
      },
    ],
    formulaCheck:
      'The estimate uses monthly compounding and end-of-month deposits. It does not check IRS annual additions, employee deferral limits, highly compensated employee rules, vesting, plan fees, or investment risk.',
    resultReading:
      'Projected balance is the future account estimate. Your monthly contribution and employer monthly match show the deposit split. Total contributions separate your deposits, employer match, and estimated growth.',
    doubleCheck:
      'Check salary, contribution percent, match percent, match cap, return, and years. Then compare the annual employee contribution with current IRS and plan limits before changing payroll.',
    limitFollowup:
      'Use your employer plan portal, plan documents, and IRS limits for real contribution rules.',
  }),
  makeFinanceTool({
    slug: 'house-affordability-calculator',
    name: 'House Affordability Calculator',
    summary: 'Estimate a home price from income, debts, down payment, rate, and housing costs.',
    description:
      'Use this free house affordability calculator to test a home price from income, monthly debts, down payment, mortgage rate, debt-to-income target, tax, insurance, and HOA.',
    seoTitle: 'House Affordability Calculator | Income, Debt & Home Budget',
    seoDescription:
      'Estimate a home price from income, debts, down payment, mortgage rate, DTI target, property tax, insurance, and HOA before shopping.',
    icon: 'calculator-house-affordability',
    aliases: ['home affordability calculator', 'house budget calculator', 'mortgage affordability calculator', 'home price calculator by income'],
    formula:
      'The calculator applies a debt-to-income target to monthly income, subtracts monthly debts, then searches for the highest home price whose estimated housing payment fits.',
    limit:
      'This is not mortgage approval. Credit score, lender underwriting, cash reserves, closing costs, exact property tax, insurance, HOA, repairs, utilities, local prices, and the written Loan Estimate can change affordability.',
    useCases: [
      'Estimate a home-buying budget before touring houses.',
      'See how debts, down payment, mortgage rate, tax, insurance, and HOA affect affordability.',
      'Compare debt-to-income targets in a transparent way.',
      'Separate principal and interest from tax, insurance, and HOA costs.',
    ],
    examples: [
      { label: 'Income-based budget', expression: '$110,000 income, $450 debts, $60,000 down, 6.5%, 36% DTI', result: 'About $421,988.22 home price and $2,850 housing budget' },
      { label: 'Lower debt case', expression: '$90,000 income, $150 debts, $45,000 down, 33% DTI', result: 'About $340,278.15 home price and $2,325 housing budget' },
      { label: 'Higher down payment', expression: '$140,000 income, $700 debts, $120,000 down, 36% DTI', result: 'About $540,909.46 home price and $3,500 housing budget' },
    ],
    inputExplanations: [
      { term: 'Annual gross income', meaning: 'your yearly income before tax and payroll deductions.' },
      { term: 'Monthly debt payments', meaning: 'recurring debt payments such as car loans, student loans, credit cards, or other debts that compete with the mortgage payment.' },
      { term: 'Down payment', meaning: 'cash applied to the home price before the mortgage loan amount is calculated.' },
      { term: 'Debt-to-income target', meaning: 'the share of gross monthly income you want to allow for housing plus debts in this estimate.' },
      { term: 'Property tax, insurance, and HOA', meaning: 'housing costs that reduce the room left for principal and interest.' },
    ],
    priorityFaq: [
      {
        question: 'Is this the same as mortgage preapproval?',
        answer:
          'No. CFPB warns that how much you qualify to borrow can be different from what you can comfortably repay. This calculator is a planning screen. A lender still checks credit, income, debts, assets, property details, and underwriting rules.',
      },
      {
        question: 'Why does the calculator include tax, insurance, and HOA?',
        answer:
          'Because the monthly home budget is not only principal and interest. CFPB says property taxes, homeowners insurance, PMI, and HOA fees can be part of the monthly mortgage cost, and Fannie Mae tells buyers to budget for more than the loan payment.',
      },
      {
        question: 'What debt-to-income target should I use?',
        answer:
          'Use the target as a what-if, not a rule. Fannie Mae says housing cost is often discussed around 25% to 30% of gross income, while lenders may review broader debt-to-income rules. Try a lower target if the result crowds out savings, repairs, utilities, or other bills.',
      },
    ],
    formulaCheck:
      'The search is monthly and estimate-based: it tests candidate home prices until principal and interest plus property tax, insurance, and HOA fit inside the housing budget.',
    resultReading:
      'Affordable home price is the highest price that fits your chosen target. Loan amount is home price minus down payment. Monthly housing budget shows the cap after existing debts. Principal and interest plus tax, insurance, and HOA show what fills that cap.',
    doubleCheck:
      'Check gross income, monthly debts, down payment, rate, loan term, DTI target, property tax, insurance, and HOA. Then check whether the answer leaves room for closing costs, repairs, emergency savings, utilities, and moving costs.',
    limitFollowup:
      'Use a lender Loan Estimate, local tax/insurance quotes, and your own budget before treating a home price as affordable.',
    relatedSlugs: ['mortgage-calculator', 'mortgage-payoff-calculator', 'loan-calculator'],
  }),
  makeFinanceTool({
    slug: 'savings-calculator',
    name: 'Savings Calculator',
    summary: 'Project a savings goal from current balance, monthly deposits, rate, and time.',
    description:
      'Use this free savings calculator to project a future balance, total deposits, estimated interest, and the gap to a target amount.',
    seoTitle: 'Savings Calculator | Monthly Deposit, Interest & Goal Gap',
    seoDescription:
      'Project savings from current balance, monthly deposit, rate, and time. See total deposits, estimated interest, and the gap to your goal.',
    icon: 'calculator-savings',
    aliases: ['monthly savings calculator', 'savings goal calculator', 'savings interest calculator', 'savings calculator apy'],
    formula:
      'The calculator compounds current savings monthly, adds each monthly deposit at the end of the month, then subtracts the projected balance from your target amount.',
    limit:
      'This is a simple savings projection. It does not include taxes, bank fees, changing rates, APY-vs-rate details, withdrawals, balance tiers, minimum balances, or account rules.',
    useCases: [
      'Check whether a monthly deposit is enough for a savings goal.',
      'See the difference between money you deposit and estimated interest.',
      'Compare emergency fund, trip, car, wedding, or down-payment scenarios.',
      'Test a rate before opening or switching a savings account.',
    ],
    examples: [
      { label: 'Savings goal', expression: '$2,500 saved, $300/month, 4%, 5 years, $25,000 target', result: 'About $22,942.18 projected, $2,057.82 short' },
      { label: 'Emergency fund', expression: '$1,000 saved, $250/month, 3.5%, 2 years, $8,000 target', result: 'About $7,278.02 projected, $721.98 short' },
      { label: 'Goal cleared', expression: '$0 saved, $500/month, 4%, 3 years, $18,000 target', result: 'About $19,090.78 projected, $1,090.78 over target' },
    ],
    inputExplanations: [
      { term: 'Current savings', meaning: 'the money already set aside before the new monthly deposits start.' },
      { term: 'Monthly deposit', meaning: 'the amount you plan to add at the end of each month.' },
      { term: 'Annual rate', meaning: 'the estimated yearly interest rate. If your bank shows APY, use this as a close planning input, not exact statement math.' },
      { term: 'Target amount', meaning: 'the goal you want to compare against, such as an emergency fund or down payment.' },
    ],
    priorityFaq: [
      {
        question: 'Does this savings calculator use APY?',
        answer:
          'It uses an estimated annual rate and monthly compounding. If your bank gives APY, the result is still useful for planning, but the bank statement can differ because APY, compounding rules, fees, and balance tiers are specific to that account.',
      },
      {
        question: 'Are monthly deposits added before or after interest?',
        answer:
          'The calculator adds monthly deposits at the end of each month. That keeps the estimate simple and avoids pretending the page knows the exact day each deposit will arrive.',
      },
      {
        question: 'Why is my target gap still positive?',
        answer:
          'A positive gap means the projected balance is still below the target. Try a larger monthly deposit, more time, a lower target, or a different rate assumption.',
      },
      {
        question: 'Can I use this for an emergency fund?',
        answer:
          'Yes. Enter your current emergency savings, a monthly deposit you can actually keep making, and a target amount. Then check whether the result leaves enough room for bills, debt, and other savings goals.',
      },
    ],
    formulaCheck:
      'Monthly compounding grows the current balance first. Each monthly deposit is added at the end of the month. Target gap is target amount minus projected balance.',
    resultReading:
      'Projected balance is the estimated ending amount. Total deposits is your current savings plus monthly deposits. Estimated interest is the growth from the rate. Target gap shows whether the plan is short or over the goal.',
    doubleCheck:
      'Check the current balance, monthly deposit, annual rate, years, and target amount. Then check whether taxes, bank fees, withdrawals, minimum balances, or a changing rate would move the real account.',
    limitFollowup:
      'Compare the estimate with the account disclosure or bank calculator before relying on the exact interest amount.',
    relatedSlugs: ['compound-interest-calculator', 'investment-calculator', 'finance-calculator'],
  }),
  makeFinanceTool({
    slug: 'rent-calculator',
    name: 'Rent Calculator',
    summary: 'Estimate a rent budget from monthly income, rent target, debts, and utilities.',
    description:
      'Use this free rent calculator to estimate maximum monthly rent from income, target rent percentage, monthly debt payments, and estimated utilities.',
    icon: 'calculator-rent',
    formula:
      'The calculator multiplies monthly income by the target rent percentage, then subtracts monthly debts and estimated utilities to produce a rent ceiling.',
    limit:
      'This is a simple budget estimate. It does not include deposits, application fees, moving costs, renters insurance, local market prices, or landlord screening rules.',
    useCases: [
      'Estimate a monthly rent ceiling before apartment hunting.',
      'Compare 25%, 30%, and 35% rent budget targets.',
      'Account for existing debts and utilities before choosing rent.',
      'Check whether a rent amount leaves enough income for other costs.',
    ],
    examples: [
      { label: '30% target', expression: '$5,200 income, 30%, $350 debts, $180 utilities', result: 'Estimated max rent' },
      { label: 'Lower income', expression: '$3,600 income, 30%, $150 debts', result: 'Rent ceiling' },
      { label: 'Conservative target', expression: '$6,200 income, 25% target', result: 'Lower rent budget' },
    ],
    relatedSlugs: ['salary-calculator', 'finance-calculator', 'percentage-calculator'],
  }),
  makeFinanceTool({
    slug: 'annuity-calculator',
    name: 'Annuity Calculator',
    summary: 'Estimate present value and future value of a fixed annuity payment stream.',
    description:
      'Use this free annuity calculator to estimate future value, present value, total payments, and payment count from payment amount, rate, time, frequency, and timing.',
    icon: 'calculator-annuity',
    formula:
      'The calculator converts the annual rate to a periodic rate, then uses ordinary annuity or annuity-due formulas for future value and present value.',
    limit:
      'This is a simplified fixed-rate annuity formula. It does not include insurer pricing, fees, taxes, guarantees, surrender charges, inflation riders, or contract terms.',
    useCases: [
      'Estimate the future value of repeated payments.',
      'Estimate present value for a fixed payment stream.',
      'Compare end-of-period and beginning-of-period payments.',
      'Check annuity formula homework or planning examples.',
    ],
    examples: [
      { label: 'Monthly annuity', expression: '$500/month, 5%, 20 years', result: 'Future value and present value' },
      { label: 'Annual payments', expression: '$6,000/year, 4.5%, 15 years', result: 'Fixed payment stream estimate' },
      { label: 'Annuity due', expression: '$400/month at beginning of period', result: 'Beginning-of-period adjustment' },
    ],
    relatedSlugs: ['investment-calculator', 'retirement-calculator', 'compound-interest-calculator'],
  }),
  makeFinanceTool({
    slug: 'credit-card-calculator',
    name: 'Credit Card Calculator',
    summary: 'Estimate credit card payoff time, total interest, and total paid.',
    description:
      'Use this free credit card calculator to estimate payoff time, total interest, total paid, and final payment from balance, APR, monthly payment, and optional new charges.',
    icon: 'calculator-credit-card',
    formula:
      'The calculator converts APR to a monthly rate, adds monthly interest and new charges, subtracts the monthly payment, and repeats until the balance reaches zero.',
    limit:
      'This is a simplified payoff estimate. It does not include fees, daily balance methods, variable APR changes, grace periods, minimum-payment rules, or issuer terms.',
    useCases: [
      'Estimate how long a card balance may take to pay off.',
      'Compare a regular payment with a larger payment.',
      'See how new monthly charges slow payoff.',
      'Estimate total interest before choosing a payoff strategy.',
    ],
    examples: [
      { label: 'Payoff estimate', expression: '$4,500 balance, 22.9% APR, $250/month', result: 'Payoff months and total interest' },
      { label: 'Pay extra', expression: '$4,500 balance, $350/month', result: 'Shorter payoff estimate' },
      { label: 'New charges', expression: '$3,000 balance, $50 new charges/month', result: 'Payoff estimate with spending' },
    ],
    relatedSlugs: ['interest-calculator', 'payment-calculator', 'loan-calculator'],
  }),
  makeFinanceTool({
    slug: 'pension-calculator',
    name: 'Pension Calculator',
    summary: 'Estimate a defined-benefit pension from salary, service years, and multiplier.',
    description:
      'Use this free pension calculator to estimate annual pension, monthly pension, and salary replacement rate from final average salary, years of service, and benefit multiplier.',
    seoDescription:
      'Estimate annual pension, monthly pension, and replacement rate from final average salary, service years, and benefit multiplier.',
    icon: 'calculator-pension',
    formula:
      'The calculator multiplies final average salary by years of service and the benefit multiplier, then divides the annual pension by 12 for a monthly estimate.',
    limit:
      'This is not a plan benefit statement. It does not include vesting, service-credit rules, survivor options, cost-of-living adjustments, early retirement reductions, taxes, or plan-specific formulas.',
    useCases: [
      'Estimate a defined-benefit pension from a simple salary-service formula.',
      'Convert an annual pension estimate into a monthly amount.',
      'Compare how years of service and multiplier affect the estimate.',
      'Check replacement rate before reading the official plan document.',
    ],
    examples: [
      { label: 'Public plan style', expression: '$80,000 final salary, 25 years, 1.5% multiplier', result: '$30,000/year or $2,500/month' },
      { label: 'Long service', expression: '$95,000, 32 years, 1.7%', result: 'Higher replacement-rate estimate' },
      { label: 'Shorter career', expression: '$65,000, 15 years, 1.25%', result: 'Lower pension estimate' },
    ],
    relatedSlugs: ['retirement-calculator', '401k-calculator', 'annuity-payout-calculator'],
  }),
  makeFinanceTool({
    slug: 'annuity-payout-calculator',
    name: 'Annuity Payout Calculator',
    summary: 'Estimate a fixed payout from a starting balance, rate, payout time, and frequency.',
    description:
      'Use this free annuity payout calculator to estimate fixed payment amount, total paid, and estimated interest from a starting balance, rate, payout term, and payment frequency.',
    seoDescription:
      'Estimate annuity payout amount, total paid, and interest from starting balance, rate, payout term, and payment frequency.',
    icon: 'calculator-annuity-payout',
    formula:
      'The calculator converts annual rate to a periodic rate, then uses the present-value annuity payout formula to spread the balance over the selected payment count.',
    limit:
      'This is a simplified fixed-rate drawdown. It does not include insurance company pricing, guarantees, fees, surrender charges, taxes, riders, inflation adjustments, or contract terms.',
    useCases: [
      'Estimate a fixed monthly payout from a lump sum.',
      'Compare payout periods such as 10, 15, or 20 years.',
      'See total payout and interest implied by the rate assumption.',
      'Check annuity math examples without using personal information.',
    ],
    examples: [
      { label: '$100k payout', expression: '$100,000 balance, 5%, 20 years, monthly', result: 'Estimated monthly payout' },
      { label: 'Annual payout', expression: '$75,000, 4%, 15 years, annual', result: 'Estimated yearly payout' },
      { label: 'Short payout', expression: '$50,000, 3.5%, 10 years', result: 'Higher payment over a shorter term' },
    ],
    relatedSlugs: ['annuity-calculator', 'retirement-calculator', 'investment-calculator'],
  }),
  makeFinanceTool({
    slug: 'credit-cards-payoff-calculator',
    name: 'Credit Cards Payoff Calculator',
    summary: 'Estimate payoff time and interest for combined credit card balances.',
    description:
      'Use this free credit cards payoff calculator to estimate payoff months, total interest, total paid, and final payment from combined card balance, weighted APR, monthly payment, and extra payment.',
    seoDescription:
      'Estimate credit card payoff months, total interest, total paid, and final payment from balance, APR, monthly payment, and extra payment.',
    icon: 'calculator-card-payoff',
    formula:
      'The calculator converts APR to a monthly rate, adds monthly interest, subtracts the base payment plus extra payment, and repeats until the combined balance is paid off.',
    limit:
      'This is a simplified combined-balance estimate. It does not model daily balances, separate APR tiers, fees, promotional APRs, minimum-payment changes, or new purchases.',
    useCases: [
      'Estimate payoff time for multiple credit card balances combined.',
      'Compare normal payment versus extra payment.',
      'See how much interest a payoff plan may cost.',
      'Create a quick debt-paydown planning number.',
    ],
    examples: [
      { label: 'Two-card payoff', expression: '$8,500 balance, 21.5% APR, $450/month total', result: 'Payoff time and interest' },
      { label: 'Minimum plus extra', expression: '$6,000 at 19.9%, $220 + $80 extra', result: 'Shorter payoff estimate' },
      { label: 'Aggressive payoff', expression: '$12,000 at 24.9%, $750/month', result: 'Faster debt-free date' },
    ],
    relatedSlugs: ['credit-card-calculator', 'debt-payoff-calculator', 'debt-consolidation-calculator'],
  }),
  makeFinanceTool({
    slug: 'debt-payoff-calculator',
    name: 'Debt Payoff Calculator',
    summary: 'Estimate payoff time, total interest, and total paid for a debt balance.',
    description:
      'Use this free debt payoff calculator to estimate payoff months, total interest, total paid, and final payment from debt balance, interest rate, monthly payment, and extra payment.',
    seoDescription:
      'Estimate debt payoff months, total interest, total paid, and final payment from balance, rate, monthly payment, and extra payment.',
    icon: 'calculator-debt-payoff',
    formula:
      'The calculator adds monthly interest to the balance, subtracts the monthly payment plus extra payment, and repeats until the balance reaches zero.',
    limit:
      'This is a fixed-rate payoff model. It does not include fees, penalties, settlement terms, collection rules, creditor agreements, changing rates, or legal advice.',
    useCases: [
      'Estimate how long a debt balance may take to repay.',
      'Compare payoff speed with and without an extra payment.',
      'Estimate total interest before choosing a repayment plan.',
      'Check whether a monthly payment is high enough to reduce principal.',
    ],
    examples: [
      { label: '$10k payoff', expression: '$10,000 debt, 12%, $300 + $100 extra/month', result: 'Payoff months and interest' },
      { label: 'No extra payment', expression: '$7,500 at 15%, $260/month', result: 'Baseline payoff time' },
      { label: 'Fast payoff', expression: '$5,000 at 18%, $400/month', result: 'Shorter payoff estimate' },
    ],
    relatedSlugs: ['repayment-calculator', 'debt-consolidation-calculator', 'credit-cards-payoff-calculator'],
  }),
  makeFinanceTool({
    slug: 'debt-consolidation-calculator',
    name: 'Debt Consolidation Calculator',
    summary: 'Compare current debt payoff with a new consolidation loan.',
    description:
      'Use this free debt consolidation calculator to compare current payoff time and cost with a new consolidation loan payment, fees, monthly payment change, and total cost change.',
    seoDescription:
      'Compare current debt payoff with a consolidation loan payment, fees, monthly payment change, and total cost change.',
    icon: 'calculator-debt-consolidation',
    formula:
      'The calculator estimates current debt payoff with the current payment, then compares it with a new fixed-payment loan after adding any consolidation fees.',
    limit:
      'This does not determine approval or credit impact. It does not include balance transfer rules, origination terms, hardship plans, settlement offers, or provider-specific fees.',
    useCases: [
      'Compare a consolidation loan with the current debt payoff path.',
      'Estimate whether a lower rate offsets fees.',
      'See when a lower monthly payment may raise total cost.',
      'Prepare questions before applying for a consolidation offer.',
    ],
    examples: [
      { label: 'Lower-rate loan', expression: '$18,000 debt, 18% current, 10.5% new for 3 years', result: 'New payment and cost change' },
      { label: 'No fee option', expression: '$12,000 debt, 11% new rate, no fee', result: 'Consolidation comparison' },
      { label: 'Longer term', expression: '$25,000 debt, 5-year consolidation', result: 'Payment relief versus total cost' },
    ],
    relatedSlugs: ['debt-payoff-calculator', 'credit-cards-payoff-calculator', 'loan-calculator'],
  }),
  makeFinanceTool({
    slug: 'repayment-calculator',
    name: 'Repayment Calculator',
    summary: 'Estimate repayment time and interest for a balance and monthly payment.',
    description:
      'Use this free repayment calculator to estimate how long a balance may take to repay and how much interest may be paid from rate, payment, and optional extra payment.',
    icon: 'calculator-repayment',
    formula:
      'The calculator adds monthly interest, subtracts the regular and extra monthly payment, and repeats until the balance is paid off.',
    limit:
      'This is a general fixed-rate repayment estimate. It does not include payment pauses, deferment, fees, changing rates, income-based plans, or provider-specific rules.',
    useCases: [
      'Estimate how long a balance may take to repay.',
      'Test whether a payment is enough to reduce principal.',
      'Compare repayment with and without extra monthly payment.',
      'Create a simple repayment plan for a fixed balance.',
    ],
    examples: [
      { label: 'General balance', expression: '$12,000 balance, 8%, $300 + $50 extra/month', result: 'Estimated repayment time' },
      { label: 'Small payoff', expression: '$3,500 at 14%, $175/month', result: 'Short payoff estimate' },
      { label: 'No extra payment', expression: '$9,000 at 9.5%, $250/month', result: 'Baseline repayment estimate' },
    ],
    relatedSlugs: ['debt-payoff-calculator', 'payment-calculator', 'loan-calculator'],
  }),
  makeFinanceTool({
    slug: 'student-loan-calculator',
    name: 'Student Loan Calculator',
    summary: 'Estimate student loan payment, payoff time, interest, and extra-payment savings.',
    description:
      'Use this free student loan calculator to estimate scheduled monthly payment, payoff time, total interest, and interest saved from extra monthly payments.',
    icon: 'calculator-student-loan',
    formula:
      'The calculator uses the fixed-payment loan formula for scheduled repayment, then simulates monthly payoff again with any extra monthly payment.',
    limit:
      'This is not an official federal repayment plan result. It does not include income-driven repayment, deferment, forbearance, forgiveness, subsidies, capitalization, fees, or servicer rules.',
    useCases: [
      'Estimate a standard student loan payment from balance, rate, and term.',
      'See how an extra payment may reduce payoff time.',
      'Estimate interest cost before choosing a repayment strategy.',
      'Compare simplified repayment scenarios before reviewing official options.',
    ],
    examples: [
      { label: '10-year plan', expression: '$30,000 balance, 6.5%, 10 years, $50 extra/month', result: 'Payment and payoff time' },
      { label: 'No extra payment', expression: '$25,000 at 5.5% for 10 years', result: 'Scheduled payment estimate' },
      { label: 'Aggressive payment', expression: '$45,000 at 7%, $200 extra/month', result: 'Interest saved estimate' },
    ],
    relatedSlugs: ['loan-calculator', 'amortization-calculator', 'repayment-calculator'],
  }),
  makeFinanceTool({
    slug: 'college-cost-calculator',
    name: 'College Cost Calculator',
    summary: 'Estimate future college cost and savings gap from cost inflation and savings.',
    description:
      'Use this free college cost calculator to estimate future annual college cost, total school cost, projected savings, and savings gap from current cost, years until start, school length, and savings plan.',
    seoDescription:
      'Estimate future college cost, total school cost, projected savings, and savings gap from current costs and savings plan.',
    icon: 'calculator-college-cost',
    formula:
      'The calculator grows today’s annual cost until school starts, adds each school year with annual increases, then compares that total with projected savings.',
    limit:
      'This does not include school-specific aid, scholarships, grants, tax credits, loans, housing changes, residency rules, tuition guarantees, or billing details.',
    useCases: [
      'Estimate a future college cost from today’s annual cost.',
      'Compare projected savings with estimated total cost.',
      'Test how monthly savings changes the gap.',
      'Plan a starting point before using school net-price calculators.',
    ],
    examples: [
      { label: 'Four-year plan', expression: '$28,000 current annual cost, starts in 8 years, 4 years', result: 'Total cost and savings gap' },
      { label: 'Sooner start', expression: '$22,000 annual cost, starts in 3 years', result: 'Near-term cost estimate' },
      { label: 'Two-year program', expression: '$12,000 annual cost, 2 years in school', result: 'Shorter program estimate' },
    ],
    relatedSlugs: ['savings-calculator', 'student-loan-calculator', 'compound-interest-calculator'],
  }),
  makeFinanceTool({
    slug: 'simple-interest-calculator',
    name: 'Simple Interest Calculator',
    summary: 'Calculate simple interest from principal, annual rate, and time.',
    description:
      'Use this free simple interest calculator to calculate interest and ending balance from principal, annual interest rate, and time in years.',
    icon: 'calculator-simple-interest',
    formula:
      'The calculator multiplies principal by annual rate and time, then adds the simple interest to principal for the ending balance.',
    limit:
      'This does not include compounding, changing rates, payment schedules, fees, taxes, or account-specific rules.',
    useCases: [
      'Calculate simple interest for classwork or quick planning.',
      'Compare simple interest with compound interest.',
      'Estimate interest when interest does not earn interest.',
      'Check a principal-rate-time formula quickly.',
    ],
    examples: [
      { label: '$1k at 5%', expression: '$1,000 at 5% for 3 years', result: '$150 interest, $1,150 ending balance' },
      { label: '18 months', expression: '$10,000 at 4.5% for 1.5 years', result: 'Simple interest estimate' },
      { label: 'Zero interest', expression: '$2,500 at 0% for 2 years', result: 'No interest growth' },
    ],
    relatedSlugs: ['interest-calculator', 'compound-interest-calculator', 'loan-calculator'],
  }),
  makeFinanceTool({
    slug: 'cd-calculator',
    name: 'CD Calculator',
    summary: 'Estimate certificate of deposit maturity value, interest, and penalty scenario.',
    description:
      'Use this free CD calculator to estimate maturity value, interest earned, early withdrawal penalty, and value after penalty from deposit amount, APY, term, and penalty months.',
    seoDescription:
      'Estimate CD maturity value, interest earned, early withdrawal penalty, and value after penalty from deposit, APY, and term.',
    icon: 'calculator-cd',
    formula:
      'The calculator applies APY growth over the CD term, estimates interest earned, and subtracts a manual early withdrawal penalty measured in months of interest.',
    limit:
      'This is not a bank disclosure. It does not include exact daily compounding, renewal rules, grace periods, brokered CDs, minimum balances, or bank-specific early withdrawal terms.',
    useCases: [
      'Estimate CD value at maturity from deposit, APY, and term.',
      'Compare term lengths with the same deposit amount.',
      'Estimate the effect of an early withdrawal penalty.',
      'Check a CD offer before reading the full bank disclosure.',
    ],
    examples: [
      { label: 'One-year CD', expression: '$10,000 deposit, 4.25% APY, 12 months', result: 'Maturity value and interest' },
      { label: 'Six-month CD', expression: '$5,000 at 3.9% APY for 6 months', result: 'Short-term CD estimate' },
      { label: 'Five-year CD', expression: '$25,000 at 4.1% APY for 60 months', result: 'Longer-term maturity estimate' },
    ],
    relatedSlugs: ['savings-calculator', 'simple-interest-calculator', 'compound-interest-calculator'],
  }),
  makeFinanceTool({
    slug: 'bond-calculator',
    name: 'Bond Calculator',
    summary: 'Estimate bond coupon income, current yield, and approximate yield to maturity.',
    description:
      'Use this free bond calculator to estimate annual coupon income, total coupon payments, current yield, and approximate yield to maturity from face value, market price, coupon rate, and maturity.',
    seoDescription:
      'Estimate bond coupon income, total coupon payments, current yield, and approximate yield to maturity from face value, price, and coupon rate.',
    icon: 'calculator-bond',
    formula:
      'The calculator multiplies face value by coupon rate for annual coupon, divides coupon by market price for current yield, then estimates yield to maturity from coupon income plus price gain or loss.',
    limit:
      'This is an approximate yield calculator. It does not price callable bonds, accrued interest, tax treatment, reinvestment risk, credit risk, duration, convexity, or changing market rates.',
    useCases: [
      'Estimate annual coupon income from a bond.',
      'Compare market price with face value.',
      'Estimate current yield and approximate yield to maturity.',
      'Check basic bond math before reading official offering documents.',
    ],
    examples: [
      { label: 'Discount bond', expression: '$1,000 face, $950 price, 5% coupon, 10 years', result: 'Current yield and approximate YTM' },
      { label: 'Premium bond', expression: '$1,000 face, $1,050 price, 6% coupon', result: 'Lower YTM from premium price' },
      { label: 'Annual coupon', expression: '$5,000 face, 4.5% coupon, annual payments', result: 'Coupon and yield estimate' },
    ],
    relatedSlugs: ['investment-calculator', 'mutual-fund-calculator', 'simple-interest-calculator'],
  }),
  makeFinanceTool({
    slug: 'mutual-fund-calculator',
    name: 'Mutual Fund Calculator',
    summary: 'Project mutual fund growth after a simple expense ratio estimate.',
    description:
      'Use this free mutual fund calculator to project balance, total contributions, estimated growth, and expense drag from initial investment, monthly contribution, return, expense ratio, and time.',
    seoDescription:
      'Project mutual fund balance, contributions, growth, and expense drag from starting investment, monthly contribution, return, fees, and time.',
    icon: 'calculator-mutual-fund',
    formula:
      'The calculator projects balance before expenses, subtracts expense ratio from the annual return assumption for a simple net-return estimate, then compares the two balances.',
    limit:
      'This is a hypothetical projection. It does not include actual fund performance, taxes, loads, trading costs, distributions, changing expenses, market volatility, or investment advice.',
    useCases: [
      'Project a mutual fund balance with recurring contributions.',
      'Estimate how an expense ratio can reduce a projection.',
      'Compare low-fee and higher-fee scenarios.',
      'Separate contributions from estimated investment growth.',
    ],
    examples: [
      { label: 'Index-style fund', expression: '$5,000 start, $250/month, 7% return, 0.5% expense', result: 'Projected balance after expenses' },
      { label: 'Higher fee', expression: '$10,000 start, 1.2% expense ratio', result: 'Expense drag comparison' },
      { label: 'Small start', expression: '$1,000 start, $100/month for 10 years', result: 'Long-term projection' },
    ],
    relatedSlugs: ['investment-calculator', 'compound-interest-calculator', 'bond-calculator'],
  }),
  makeFinanceTool({
    slug: 'roth-ira-calculator',
    name: 'Roth IRA Calculator',
    summary: 'Project Roth IRA growth from current balance, annual contribution, return, and time.',
    description:
      'Use this free Roth IRA calculator to project future balance, total contributions, and estimated growth from current balance, annual contribution, annual return, and years to grow.',
    seoDescription:
      'Project Roth IRA future balance, total contributions, and growth from current balance, annual contribution, return, and years.',
    icon: 'calculator-roth-ira',
    formula:
      'The calculator converts annual contribution to a monthly deposit, compounds the current balance monthly, and adds each monthly contribution through the projection period.',
    limit:
      'This does not verify Roth IRA eligibility, income phaseouts, IRS limits, withdrawal rules, penalties, taxes, fees, or investment risk.',
    useCases: [
      'Project Roth IRA growth from annual contributions.',
      'Compare contribution amounts and time horizons.',
      'Separate total contributions from estimated growth.',
      'Check a retirement savings scenario before reviewing IRS limits.',
    ],
    examples: [
      { label: 'Annual max-style saving', expression: '$12,000 balance, $7,000/year, 7%, 25 years', result: 'Projected Roth IRA balance' },
      { label: 'Starting from zero', expression: '$0 balance, $4,000/year, 30 years', result: 'Long-term growth estimate' },
      { label: 'Near retirement', expression: '$85,000 balance, $8,000/year, 10 years', result: 'Shorter-horizon projection' },
    ],
    relatedSlugs: ['ira-calculator', 'retirement-calculator', '401k-calculator'],
  }),
  makeFinanceTool({
    slug: 'ira-calculator',
    name: 'IRA Calculator',
    summary: 'Project IRA growth from balance, annual contribution, return, and years.',
    description:
      'Use this free IRA calculator to project future balance, total contributions, and estimated growth from current IRA balance, annual contribution, annual return, and years to grow.',
    seoDescription:
      'Project IRA future balance, total contributions, and estimated growth from current balance, annual contribution, return, and years.',
    icon: 'calculator-ira',
    formula:
      'The calculator converts annual contribution to a monthly deposit, compounds the current balance monthly, and adds monthly contributions through the projection period.',
    limit:
      'This does not handle deductions, Roth income limits, IRS contribution limits, required minimum distributions, penalties, taxes, fees, or investment risk.',
    useCases: [
      'Project IRA growth from current balance and annual contributions.',
      'Compare contribution amounts, returns, and time horizons.',
      'Estimate how much of the projection comes from deposits versus growth.',
      'Create a planning number before checking official IRA rules.',
    ],
    examples: [
      { label: 'Traditional IRA projection', expression: '$25,000 balance, $7,000/year, 6.5%, 20 years', result: 'Projected IRA balance' },
      { label: 'Catch-up style saving', expression: '$60,000 balance, $8,000/year, 12 years', result: 'Shorter retirement runway' },
      { label: 'Small contribution', expression: '$5,000 balance, $3,000/year, 30 years', result: 'Long-term projection' },
    ],
    relatedSlugs: ['roth-ira-calculator', 'retirement-calculator', '401k-calculator'],
  }),
  makeFinanceTool({
    slug: 'vat-calculator',
    name: 'VAT Calculator',
    summary: 'Add VAT to a net price or remove VAT from a gross price.',
    description:
      'Use this free VAT calculator to add VAT to a net amount, remove VAT from a gross amount, and see the net amount, VAT amount, and gross amount clearly.',
    icon: 'calculator-vat',
    formula:
      'To add VAT, the calculator multiplies net amount by the VAT rate and adds it to the net amount. To remove VAT, it divides the gross amount by one plus the VAT rate.',
    limit:
      'This uses the manual VAT rate you enter. It does not check country-specific exemptions, invoices, registration rules, reverse charge rules, or tax reporting requirements.',
    useCases: [
      'Add VAT to a before-tax price.',
      'Remove VAT from a tax-inclusive receipt total.',
      'Separate net amount, VAT amount, and gross amount.',
      'Check simple VAT examples before reviewing local tax rules.',
    ],
    examples: [
      { label: 'Add VAT', expression: '$100 net at 20% VAT', result: '$120 gross and $20 VAT' },
      { label: 'Remove VAT', expression: '$120 gross at 20% VAT', result: '$100 net and $20 VAT' },
      { label: 'Lower rate', expression: '$80 net at 10% VAT', result: 'VAT and gross amount' },
    ],
    relatedSlugs: ['sales-tax-calculator', 'percentage-calculator', 'discount-calculator'],
  }),
  makeFinanceTool({
    slug: 'cash-back-or-low-interest-calculator',
    name: 'Cash Back or Low Interest Calculator',
    seoTitle: 'Cash Back or Low Interest Calculator | Access Free Tools',
    summary: 'Compare a cash-back offer with a low-interest financing offer.',
    description:
      'Use this free cash back or low interest calculator to compare estimated total cost between a rebate-style offer and a lower APR offer over the same payoff term.',
    icon: 'calculator-cash-back',
    formula:
      'The calculator estimates total paid for the cash-back APR, subtracts the cash-back value, then compares that net cost with the total paid under the low-interest APR.',
    limit:
      'This is a simplified comparison. It does not include taxes, dealer fees, model restrictions, offer expiration dates, credit approval, or rebate eligibility rules.',
    useCases: [
      'Compare a dealer cash-back offer with a low APR offer.',
      'See whether a bigger rebate beats a lower rate over your payoff term.',
      'Estimate total cost instead of comparing monthly payment alone.',
      'Check incentive math before reading the official offer terms.',
    ],
    examples: [
      { label: 'Dealer incentive', expression: '$32,000, 4% cash back at 7.2% vs 3.9% APR', result: 'Lower estimated total cost' },
      { label: 'Big rebate', expression: '$28,000, 6% cash back, 48 months', result: 'Cash-back comparison' },
      { label: 'Short payoff', expression: '$18,000 over 36 months', result: 'Rate-vs-rebate estimate' },
    ],
    relatedSlugs: ['auto-loan-calculator', 'interest-rate-calculator', 'loan-calculator'],
  }),
  makeFinanceTool({
    slug: 'auto-lease-calculator',
    name: 'Auto Lease Calculator',
    summary: 'Estimate a monthly auto lease payment from price, residual value, money factor, tax, and term.',
    description:
      'Use this free auto lease calculator to estimate monthly lease payment, depreciation fee, finance fee, tax, adjusted capitalized cost, and total lease cost.',
    icon: 'calculator-auto-lease',
    formula:
      'The calculator subtracts down payment and trade-in from vehicle price plus fees, spreads depreciation across the term, adds a money-factor finance fee, then adds tax.',
    limit:
      'This does not include mileage limits, wear charges, acquisition and disposition rules, registration, insurance, lease-end buyout details, or early termination charges.',
    useCases: [
      'Estimate a monthly car lease payment.',
      'Separate depreciation fee from finance fee.',
      'Compare different residual values, terms, and money factors.',
      'Check whether a lease quote is driven by price, residual value, or financing cost.',
    ],
    examples: [
      { label: '36-month lease', expression: '$36,000 vehicle, $21,000 residual, 0.0025 money factor', result: 'Estimated monthly lease payment' },
      { label: 'Higher residual', expression: '$42,000 vehicle, $28,000 residual', result: 'Lower depreciation portion' },
      { label: '48-month lease', expression: '$30,000 vehicle over 48 months', result: 'Longer-term estimate' },
    ],
    relatedSlugs: ['auto-loan-calculator', 'lease-calculator', 'cash-back-or-low-interest-calculator'],
  }),
  makeFinanceTool({
    slug: 'depreciation-calculator',
    name: 'Depreciation Calculator',
    summary: 'Estimate straight-line or declining-balance depreciation and book value.',
    description:
      'Use this free depreciation calculator to estimate accumulated depreciation, annual depreciation, and book value from cost, salvage value, useful life, age, and method.',
    icon: 'calculator-depreciation',
    formula:
      'Straight-line depreciation divides depreciable amount by useful life. Declining balance applies a percentage rate to the remaining book value while respecting salvage value.',
    limit:
      'This is simplified book-value math. It does not determine tax depreciation, MACRS class life, accounting policy, partial-year conventions, recapture, or compliance.',
    useCases: [
      'Estimate book value after straight-line depreciation.',
      'Compare straight-line and declining-balance methods.',
      'Check accumulated depreciation for a simple asset example.',
      'Understand depreciation math before reviewing tax or accounting rules.',
    ],
    examples: [
      { label: 'Straight-line asset', expression: '$12,000 cost, $2,000 salvage, 5-year life, age 2', result: 'Book value and accumulated depreciation' },
      { label: 'Declining balance', expression: '$25,000 cost, 25% rate, age 3', result: 'Declining-balance estimate' },
      { label: 'One-year check', expression: '$6,000 cost, $1,000 salvage, 5-year life', result: 'First-year estimate' },
    ],
    relatedSlugs: ['average-return-calculator', 'business-loan-calculator', 'finance-calculator'],
  }),
  makeFinanceTool({
    slug: 'average-return-calculator',
    name: 'Average Return Calculator',
    summary: 'Estimate cumulative return, simple average annual return, and CAGR.',
    description:
      'Use this free average return calculator to estimate net gain, cumulative return, average annual return, and CAGR from beginning value, ending value, time, contributions, and withdrawals.',
    seoDescription:
      'Estimate net gain, cumulative return, average annual return, and CAGR from beginning value, ending value, time, deposits, and withdrawals.',
    icon: 'calculator-average-return',
    formula:
      'The calculator adjusts ending value for withdrawals and contributions, divides net gain by invested base for cumulative return, then divides by years for average annual return.',
    limit:
      'This is not a full performance report. It does not calculate time-weighted return, internal rate of return, taxes, fees, volatility, or investment suitability.',
    useCases: [
      'Estimate average annual return from a beginning and ending value.',
      'Adjust a simple return for extra contributions or withdrawals.',
      'Compare simple average return with CAGR.',
      'Check rough investment performance without saving personal data.',
    ],
    examples: [
      { label: 'Five-year return', expression: '$10,000 to $16,000 over 5 years with $2,000 added', result: 'Average annual return and CAGR' },
      { label: 'With withdrawals', expression: '$25,000 to $31,000 with $1,500 withdrawn', result: 'Adjusted net gain' },
      { label: 'No contributions', expression: '$8,000 to $12,000 over 3 years', result: 'Simple growth return' },
    ],
    relatedSlugs: ['investment-calculator', 'compound-interest-calculator', 'mutual-fund-calculator'],
  }),
  makeFinanceTool({
    slug: 'margin-calculator',
    name: 'Margin Calculator',
    summary: 'Calculate profit, profit margin, and markup from revenue and cost.',
    description:
      'Use this free margin calculator to find profit, profit margin percentage, and markup percentage from revenue or selling price and cost.',
    icon: 'calculator-margin',
    formula:
      'The calculator subtracts cost from revenue to find profit, divides profit by revenue for margin, and divides profit by cost for markup.',
    limit:
      'This is business profit-margin math. It does not model brokerage margin accounts, borrowing to invest, borrowed-money risk, taxes, overhead allocation, or accounting rules.',
    useCases: [
      'Calculate product or service profit margin.',
      'Compare margin and markup side by side.',
      'Check pricing math before changing a selling price.',
      'Estimate how cost changes affect profitability.',
    ],
    examples: [
      { label: 'Retail item', expression: '$100 price and $60 cost', result: '40% margin and 66.67% markup' },
      { label: 'Service job', expression: '$2,500 revenue and $1,400 cost', result: 'Profit and margin' },
      { label: 'Low margin', expression: '$1,200 revenue and $1,050 cost', result: 'Margin check' },
    ],
    relatedSlugs: ['percentage-calculator', 'discount-calculator', 'business-loan-calculator'],
  }),
  makeFinanceTool({
    slug: 'discount-calculator',
    name: 'Discount Calculator',
    summary: 'Find final price after one or two discounts and optional tax.',
    description:
      'Use this free discount calculator to estimate sale price, stacked discounts, total savings, effective discount percentage, tax amount, and final price.',
    icon: 'calculator-discount',
    formula:
      'The calculator applies the first discount to the original price, applies the extra discount to the reduced subtotal, then adds tax if a tax rate is entered.',
    limit:
      'This does not check coupon exclusions, minimum purchases, shipping, store policy, tax exemptions, or local tax rules.',
    useCases: [
      'Calculate a sale price after a discount.',
      'Check stacked coupon math.',
      'Estimate tax after discounts.',
      'Compare total savings before buying.',
    ],
    examples: [
      { label: 'Stacked sale', expression: '$100, 20% off, then 10% extra, 5% tax', result: 'Final price and savings' },
      { label: 'Simple sale', expression: '$80 with 30% off', result: 'Discounted price' },
      { label: 'Taxed purchase', expression: '$250 with 15% off, 5% extra, 7.25% tax', result: 'Final checkout estimate' },
    ],
    relatedSlugs: ['percentage-calculator', 'sales-tax-calculator', 'vat-calculator'],
  }),
  makeFinanceTool({
    slug: 'business-loan-calculator',
    name: 'Business Loan Calculator',
    summary: 'Estimate a business loan payment, total interest, origination fee, cash received, and total cost.',
    description:
      'Estimate a business loan payment from loan amount, interest rate, term, and origination fee, with total paid, total interest, cash received, and total cost.',
    seoTitle: 'Business Loan Calculator | Payment, Interest & Fees',
    seoDescription:
      'Estimate a business loan payment from loan amount, rate, term, and origination fee. See monthly payment, total interest, cash received, and total cost with fees.',
    icon: 'calculator-business-loan',
    aliases: ['small business loan calculator', 'business loan payment calculator', 'commercial loan calculator', 'business financing calculator'],
    formula:
      'The calculator uses the fixed-payment loan formula, estimates the origination fee from the loan amount, subtracts that fee from cash received, then adds fee context to the total cost.',
    limit:
      'This is a planning estimate only. It does not approve financing or include underwriting, collateral, variable rates, draw schedules, tax effects, SBA eligibility, merchant cash advance terms, late fees, prepayment penalties, or lender approval.',
    useCases: [
      'Estimate a monthly payment before asking for business financing.',
      'See how an origination fee changes cash received and total cost.',
      'Compare rate, term, and fee changes without judging only by payment.',
      'Check whether the cash left after fees still fits the project, equipment, or working-capital plan.',
    ],
    examples: [
      { label: 'Small business loan', expression: '$50,000 at 9.5% for 5 years with 2% fee', result: 'About $1,050.09/month, $13,005.58 interest, $49,000 cash received, and $64,005.58 total cost with fee' },
      { label: 'Short term', expression: '$25,000 at 11% for 2 years with 3% fee', result: 'About $1,165.20/month, $2,964.70 interest, and $24,250 cash received' },
      { label: 'No fee', expression: '$100,000 at 8.25% for 7 years with no origination fee', result: 'About $1,571.11/month and $31,972.90 interest' },
    ],
    relatedSlugs: ['loan-calculator', 'interest-rate-calculator', 'profit-goal-calculator'],
    inputExplanations: [
      { term: 'Loan amount', meaning: 'the full amount used for payment math, even if a fee means you receive less cash.' },
      { term: 'Interest rate', meaning: 'the annual rate used for the fixed monthly payment estimate.' },
      { term: 'Loan term', meaning: 'how many years the payment is spread over.' },
      { term: 'Origination fee', meaning: 'a lender fee as a percent of the loan amount; the calculator shows it separately so the cash received is clearer.' },
    ],
    priorityFaq: [
      {
        question: 'How does the Business Loan Calculator handle an origination fee?',
        answer:
          'It calculates the monthly payment from the full loan amount, then estimates the origination fee separately. If the fee is taken from the proceeds, cash received after fee can be lower than the amount you have to repay.',
      },
      {
        question: 'Why can the payment look fine while the loan is still expensive?',
        answer:
          'A longer term can lower the monthly payment while raising total interest. A fee can also reduce the cash you actually receive. Compare payment, total interest, cash received, and total cost with fee together.',
      },
      {
        question: 'Is this the same as an SBA loan approval check?',
        answer:
          'No. SBA-backed loans and regular business loans can have lender rules, eligibility checks, collateral questions, credit reviews, and documents that this calculator cannot judge.',
      },
      {
        question: 'Should I compare business loans by APR or interest rate?',
        answer:
          'APR can help compare offers because it can include credit costs, while the interest rate is used for basic payment math. Ask the lender what fees are included before comparing one offer against another.',
      },
    ],
    extraFaq: [
      {
        question: 'Does this work for a merchant cash advance?',
        answer:
          'Not really. Merchant cash advances can be repaid from sales with different fees and timing. Use this calculator for fixed-payment loan estimates, then read any cash-advance agreement separately.',
      },
      {
        question: 'What should I check before relying on the result?',
        answer:
          'Check whether the loan has variable rates, prepayment rules, collateral, personal guarantees, draw schedules, late fees, tax effects, or lender fees that are not in the calculator.',
      },
    ],
  }),
  makeFinanceTool({
    slug: 'debt-to-income-ratio-calculator',
    name: 'Debt-to-Income Ratio Calculator',
    summary: 'Calculate debt-to-income ratio from income, debts, and proposed housing payment.',
    description:
      'Use this free debt-to-income ratio calculator to estimate DTI from gross monthly income, existing monthly debts, and an optional proposed housing payment.',
    icon: 'calculator-dti',
    formula:
      'The calculator adds existing monthly debt payments and proposed housing payment, divides by gross monthly income, then converts the result to a percentage.',
    limit:
      'This is a simplified planning ratio. Lenders may count debts, income, housing costs, and qualifying rules differently.',
    useCases: [
      'Estimate DTI before a loan or mortgage conversation.',
      'See how a proposed housing payment changes the ratio.',
      'Compare debt payments against gross monthly income.',
      'Check a simple affordability signal before using lender tools.',
    ],
    examples: [
      { label: 'Mortgage check', expression: '$6,000 income, $900 debts, $1,500 proposed housing', result: '40% DTI' },
      { label: 'Debt only', expression: '$4,800 income and $650 debts', result: 'Debt-only DTI' },
      { label: 'Higher payment', expression: '$8,000 income, $1,200 debts, $2,300 housing', result: 'DTI with housing' },
    ],
    relatedSlugs: ['house-affordability-calculator', 'mortgage-calculator', 'loan-calculator'],
  }),
  makeFinanceTool({
    slug: 'personal-loan-calculator',
    name: 'Personal Loan Calculator',
    summary: 'Estimate personal loan payment, interest, and origination fee.',
    description:
      'Use this free personal loan calculator to estimate monthly payment, total paid, total interest, origination fee, and cash received after a fee.',
    icon: 'calculator-personal-loan',
    formula:
      'The calculator uses the fixed-payment loan formula, then estimates any origination fee from the loan amount and shows cash received after the fee.',
    limit:
      'This does not include lender approval, official APR disclosures, variable rates, late fees, credit insurance, prepayment rules, or credit-score impact.',
    useCases: [
      'Estimate a personal loan monthly payment.',
      'Compare loan terms and interest rates.',
      'Include a simple origination fee in the estimate.',
      'Check total interest before comparing offers.',
    ],
    examples: [
      { label: 'Personal loan', expression: '$12,000 at 10.5% for 4 years with 2% fee', result: 'Monthly payment and interest' },
      { label: 'Debt refinance', expression: '$18,000 at 11.9% for 5 years', result: 'Payment estimate' },
      { label: 'Short payoff', expression: '$5,000 at 8.5% for 2 years', result: 'Short-term estimate' },
    ],
    relatedSlugs: ['loan-calculator', 'debt-payoff-calculator', 'interest-rate-calculator'],
  }),
  makeFinanceTool({
    slug: 'boat-loan-calculator',
    name: 'Boat Loan Calculator',
    summary: 'Estimate boat loan payment, amount financed, tax, and interest.',
    description:
      'Use this free boat loan calculator to estimate monthly payment, amount financed, sales tax, total paid, and total interest from price, down payment, trade-in, fees, rate, and term.',
    seoDescription:
      'Estimate boat loan monthly payment, amount financed, sales tax, total paid, and interest from price, down payment, rate, and term.',
    icon: 'calculator-boat-loan',
    formula:
      'The calculator estimates taxable amount, adds sales tax and fees, subtracts down payment and trade-in value, then uses the fixed-payment loan formula.',
    limit:
      'This does not include registration, storage, marina fees, maintenance, inspections, insurance, fuel, taxes beyond the entered rate, or lender approval.',
    useCases: [
      'Estimate a monthly boat loan payment.',
      'Include down payment, trade-in value, fees, and sales tax.',
      'Compare loan terms for a recreational purchase.',
      'See total interest before choosing a longer term.',
    ],
    examples: [
      { label: 'Used boat', expression: '$45,000 price, $9,000 down, 8.5%, 10 years', result: 'Monthly payment and interest' },
      { label: 'Smaller loan', expression: '$22,000 price with trade-in', result: 'Amount financed estimate' },
      { label: 'Long term', expression: '$85,000 over 15 years', result: 'Lower payment, more interest' },
    ],
    relatedSlugs: ['auto-loan-calculator', 'loan-calculator', 'personal-loan-calculator'],
  }),
  makeFinanceTool({
    slug: 'lease-calculator',
    name: 'Lease Calculator',
    summary: 'Estimate a generic lease payment from asset value, residual, rate, term, fees, and upfront payment.',
    description:
      'Use this free lease calculator to estimate monthly lease payment, depreciation portion, finance portion, adjusted cost, and total lease cost.',
    icon: 'calculator-lease',
    formula:
      'The calculator adjusts asset value for fees and upfront payment, spreads the amount above residual value across the term, then adds a monthly finance charge.',
    limit:
      'This is a generic lease estimate. It does not include contract-specific taxes, maintenance obligations, buyout rights, renewal options, insurance, or early termination costs.',
    useCases: [
      'Estimate a monthly lease payment for equipment or another asset.',
      'Separate depreciation portion from finance portion.',
      'Compare residual values and term lengths.',
      'Check a lease quote before reading the contract details.',
    ],
    examples: [
      { label: 'Equipment lease', expression: '$30,000 asset, $14,000 residual, 36 months', result: 'Monthly lease estimate' },
      { label: 'Lower residual', expression: '$18,000 asset, $5,000 residual', result: 'Higher depreciation portion' },
      { label: 'Short term', expression: '$10,000 asset over 24 months', result: 'Short lease estimate' },
    ],
    relatedSlugs: ['auto-lease-calculator', 'business-loan-calculator', 'loan-calculator'],
  }),
  makeFinanceTool({
    slug: 'refinance-calculator',
    name: 'Refinance Calculator',
    summary: 'Compare current loan payment with a new refinance payment and break-even estimate.',
    description:
      'Use this free refinance calculator to estimate new payment, monthly savings, closing-cost break-even time, total interest change, and total cost change.',
    icon: 'calculator-refinance',
    formula:
      'The calculator estimates the current loan payment, rolls closing costs into the new balance, estimates the new payment, then compares monthly payment and total cost.',
    limit:
      'This does not include lender underwriting, taxes, escrow changes, credit rules, prepayment penalties, cash-out rules, or official loan disclosures.',
    useCases: [
      'Compare a current loan with a possible refinance.',
      'Estimate monthly savings from a lower rate.',
      'Check how long closing costs may take to break even.',
      'See whether a longer term could reduce payment but increase cost.',
    ],
    examples: [
      { label: 'Mortgage refinance', expression: '$280,000 balance, 7% now, 5.9% new, $4,500 costs', result: 'New payment and break-even estimate' },
      { label: 'Shorter term', expression: '$220,000 into a 15-year refinance', result: 'Payment and interest comparison' },
      { label: 'Small cost', expression: '$120,000 balance with $1,500 costs', result: 'Break-even estimate' },
    ],
    relatedSlugs: ['mortgage-payoff-calculator', 'mortgage-calculator', 'interest-rate-calculator'],
  }),
  makeFinanceTool({
    slug: 'budget-calculator',
    name: 'Budget Calculator',
    summary: 'Add monthly income, spending, debt, and savings to see leftover money and ratios.',
    description:
      'Use this free budget calculator to total monthly expenses, compare spending with income, estimate leftover money, and see expense and savings ratios.',
    icon: 'calculator-budget',
    formula:
      'The calculator adds each monthly category, subtracts total planned expenses from monthly income, then divides expenses and savings by income for quick ratios.',
    limit:
      'This is a simple monthly worksheet. It does not sync bank data, forecast irregular bills, create a full financial plan, or replace personal advice.',
    useCases: [
      'Build a quick monthly budget snapshot.',
      'See how much money is left after planned spending.',
      'Estimate expense ratio and savings rate.',
      'Compare housing, debt, savings, and other categories in one place.',
    ],
    examples: [
      { label: 'Household budget', expression: '$5,200 income with housing, bills, debt, and savings', result: 'Leftover money and ratios' },
      { label: 'Lower debt', expression: '$4,300 income with small debt payments', result: 'Budget surplus estimate' },
      { label: 'Aggressive saving', expression: '$7,200 income and $1,200 savings', result: 'Savings-rate check' },
    ],
    relatedSlugs: ['rent-calculator', 'debt-to-income-ratio-calculator', 'savings-calculator'],
  }),
  ...remainingFinanceToolSpecs.map(makeFinanceTool),
];
