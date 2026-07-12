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
  leadFaq?: ToolFaq[];
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
    ...(spec.leadFaq ?? [
      {
        question: `When should I use the ${spec.name}?`,
        answer: `Use it when you want to test the exact inputs on this page: ${exampleUses} The result is a check against your assumptions, not proof that a lender, tax app, broker, platform, or provider will use the same number.`,
      },
      {
        question: `What do the main ${spec.name} inputs mean?`,
        answer: inputExplanation,
      },
    ]),
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
    summary: 'Estimate website ad revenue from daily page views, CTR, CPC, monthly revenue, and page RPM.',
    description:
      'Estimate rough website ad revenue from daily page views, page CTR, and average CPC, then check daily revenue, monthly revenue, yearly revenue, estimated clicks, and page RPM.',
    seoTitle: 'Ad Revenue Calculator | Page Views, CTR, CPC And RPM',
    seoDescription:
      'Estimate website ad revenue from daily page views, CTR, and CPC. See monthly revenue, yearly revenue, estimated clicks, and page RPM.',
    icon: 'calculator-ad-revenue',
    aliases: ['AdSense earnings calculator', 'website ad revenue calculator', 'page RPM calculator', 'display ad revenue calculator'],
    formula:
      'The calculator multiplies daily page views by page CTR to estimate ad clicks, multiplies clicks by average CPC for daily revenue, then scales that estimate to monthly and yearly revenue. It also converts daily revenue into page RPM by dividing revenue by page views and multiplying by 1,000.',
    limit:
      'This is not connected to Google AdSense and does not predict approved earnings, invalid traffic deductions, revenue-share changes, ad fill rate, advertiser demand, RPM changes, placement rules, policy status, or tax treatment.',
    useCases: [
      'Test a simple AdSense-style earnings scenario before treating traffic as income.',
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
    seoTitle: 'Break Even Calculator | Units And Sales Target',
    summary: 'Find the unit sales and revenue needed to cover fixed and variable costs.',
    description:
      'Estimate how many units and how much sales revenue are needed before a product, service, or project covers its fixed and variable costs.',
    seoDescription:
      'Calculate break-even units, break-even sales, contribution margin, and price-versus-variable-cost checks before setting a sales target.',
    icon: 'calculator-break-even',
    aliases: ['break even point calculator', 'break-even analysis calculator', 'break even sales calculator', 'contribution margin calculator', 'cost volume profit calculator'],
    formula:
      'Contribution margin per unit = price per unit - variable cost per unit. Break-even units = fixed costs / contribution margin per unit. Break-even sales = break-even units x price per unit.',
    limit:
      'This is a one-product planning estimate. It does not prove demand, profit, cash flow, taxes, owner pay, refunds, discounts, payment fees, inventory shrinkage, mixed product bundles, capacity limits, financing, or accounting treatment.',
    useCases: [
      'Estimate how many items must sell before a product launch covers fixed costs.',
      'Compare prices or variable costs before choosing a sales target.',
      'Plan a simple event, class, booth, or small product batch.',
      'Explain contribution margin in plain language before making a budget.',
    ],
    examples: [
      { label: 'Product launch', expression: '$5,000 fixed costs, $40 price, $18 variable cost', result: '227.27 units, about $9,090.91 sales, and $22 contribution per unit' },
      { label: 'Online course', expression: '$2,500 fixed costs, $99 price, $8 variable cost', result: '27.47 sales, about $2,719.78 revenue, and $91 contribution per sale' },
      { label: 'Food stall', expression: '$1,200 fixed costs, $12 price, $4.25 variable cost', result: '154.84 items, about $1,858.06 sales, and $7.75 contribution per item' },
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
    priorityFaq: [
      {
        question: 'Should I round break-even units up?',
        answer:
          'Usually yes. If the answer is 227.27 units and you sell physical items, 227 units is still short. You would need 228 units to cover the fixed-cost estimate.',
      },
      {
        question: 'Can I use this for more than one product?',
        answer:
          'Only as a rough average. Mixed products need a weighted average contribution margin because a $12 item and a $99 service do not cover fixed costs at the same speed.',
      },
      {
        question: 'Does break-even mean the idea is profitable?',
        answer:
          'No. Break-even means estimated revenue covers estimated costs at zero profit. It does not include owner pay, taxes, debt timing, inventory risk, or whether enough people will buy.',
      },
    ],
    formulaCheck:
      '$5,000 fixed costs with a $40 price and $18 variable cost leaves $22 per sale. $5,000 / $22 = 227.27 units, and 227.27 x $40 = about $9,090.91 in sales.',
    resultReading:
      'Read break-even units first, then break-even sales, then contribution per unit. If contribution is small, fixed costs take longer to cover.',
    doubleCheck:
      'Check that fixed costs and sales period match, variable cost is for one unit, and fees, discounts, refunds, waste, and capacity limits are not being ignored.',
    limitFollowup:
      'Use business records, accounting software, a bookkeeper, or a financial adviser before using break-even math for funding, tax, hiring, or pricing decisions.',
  },
  {
    slug: 'markup-calculator',
    name: 'Markup Calculator',
    summary: 'Calculate selling price from markup or target margin, or check markup, margin, and profit from a known price.',
    description:
      'Use this free markup calculator to price from cost plus markup, work backward from a target margin, or compare unit cost with a known selling price. Each mode shows profit, markup, margin, revenue, and batch totals.',
    seoTitle: 'Markup Calculator | Margin, Selling Price & Profit',
    seoDescription:
      'Calculate selling price from markup or target margin, or find markup and margin from cost plus selling price. See profit and batch totals.',
    icon: 'calculator-markup',
    aliases: [
      'price markup calculator',
      'markup price calculator',
      'cost plus markup calculator',
      'margin markup calculator',
      'reverse markup calculator',
      'selling price calculator',
    ],
    formula:
      'From markup, selling price = cost x (1 + markup / 100). From target margin, selling price = cost / (1 - margin / 100). From a known price, markup = profit / cost x 100 and margin = profit / selling price x 100.',
    limit:
      'This does not find the best market price or include discounts, coupons, sales tax, shipping, marketplace fees, payment fees, returns, inventory loss, overhead, or accounting rules unless you first include applicable per-item costs in unit cost.',
    useCases: [
      'Set a simple cost-plus selling price.',
      'Find the selling price needed for a target gross margin.',
      'Check markup and margin from a known cost and selling price.',
      'Estimate total revenue and profit for a batch of products.',
    ],
    examples: [
      { label: 'Retail item', expression: '$30 cost with 50% markup for 100 units', result: '$45 price, $15 profit each, 33.33% margin, and $1,500 total profit' },
      { label: 'Target margin', expression: '$75 cost with a 40% target margin for 20 units', result: '$125 price, $50 profit each, 66.67% equivalent markup, and $1,000 total profit' },
      { label: 'Known selling price', expression: '$30 cost and $45 selling price for 100 units', result: '50% markup, 33.33% margin, and $1,500 total profit' },
    ],
    relatedSlugs: ['margin-calculator', 'break-even-calculator', 'unit-price-calculator'],
    inputExplanations: [
      { term: 'Unit cost', meaning: 'what one item costs before adding profit. Include recurring per-item costs when they belong in the price check.' },
      { term: 'Markup percent', meaning: 'the percent added on top of cost, not the percent of the final selling price.' },
      { term: 'Target margin', meaning: 'the percent of the final selling price left after subtracting unit cost.' },
      { term: 'Selling price', meaning: 'the amount charged for one item before any separate sales tax.' },
      { term: 'Units', meaning: 'how many items you want to total for revenue and profit.' },
    ],
    priorityFaq: [
      {
        question: 'How do I calculate selling price from a target margin?',
        answer:
          'Choose From margin. Divide cost by one minus the target margin written as a decimal. A $75 cost with a 40% target margin gives $75 / 0.60 = $125. The $50 profit is 40% of the $125 selling price.',
      },
      {
        question: 'How do I find markup from cost and selling price?',
        answer:
          'Choose Check price. Subtract cost from selling price, divide that profit by cost, then multiply by 100. A $30 cost sold for $45 has $15 profit, so markup is $15 / $30 x 100 = 50%.',
      },
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
          'Use this Markup Calculator for one-item pricing from cost, target margin, or a known selling price. Use the Margin Calculator for broader revenue, cost, and profit totals that are not based on one unit.',
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
          'Yes. Choose From margin, enter unit cost and a target below 100%, and the calculator will find the required selling price and equivalent markup. Remember that a margin target does not prove customers will accept the price.',
      },
      {
        question: 'Should every product use the same markup percent?',
        answer:
          'Usually no. A small, fast-selling item, a handmade item, and a bulky item with returns can need different markups. Use the calculator to test the math, then compare the price with demand, fees, stock risk, and what similar items sell for.',
      },
    ],
    formulaCheck:
      '$75 cost with a 40% target margin gives $75 / (1 - 0.40) = $125. Profit is $50, equivalent markup is $50 / $75 = 66.67%, and margin is $50 / $125 = 40%.',
    resultReading:
      'Read the headline price or markup first, then compare profit per unit, margin, and batch totals. A negative result in Check price means the selling price is below the entered unit cost.',
    doubleCheck:
      'Check whether packaging, shipping, marketplace fees, payment fees, returns, waste, and discounts belong in unit cost. Also confirm that you entered 40 for 40%, not 0.40.',
    limitFollowup:
      'Compare the result with real costs, customer demand, competitor prices, tax rules, and accounting records before changing a live price.',
  },
  {
    slug: 'profit-goal-calculator',
    name: 'Profit Goal Calculator',
    seoTitle: 'Profit Goal Calculator | Target Units And Sales',
    summary: 'Estimate how many units and how much revenue are needed to hit a target profit.',
    description:
      'Estimate the unit sales and sales revenue needed to cover fixed costs, cover variable costs, and reach a target profit.',
    seoDescription:
      'Calculate target-profit units, required sales, contribution margin, and price-versus-variable-cost checks from fixed costs and profit goal.',
    icon: 'calculator-profit-goal',
    aliases: ['target profit calculator', 'sales goal calculator', 'profit target calculator', 'target sales calculator', 'cost volume profit calculator'],
    formula:
      'Contribution margin per unit = price per unit - variable cost per unit. Target-profit units = (fixed costs + target profit) / contribution margin per unit. Required sales = target-profit units x price per unit.',
    limit:
      'This is a one-product planning estimate. It does not prove demand, capacity, cash flow, taxes, owner pay, refunds, discounts, payment fees, shipping, inventory waste, mixed product sales, marketing spend changes, financing, or accounting treatment.',
    useCases: [
      'Set a sales target for a product, event, or service package.',
      'Compare how price or variable cost changes the number of units needed.',
      'Plan a target profit after covering fixed costs.',
      'Use after a break-even check when zero profit is not enough.',
    ],
    examples: [
      { label: '$2k profit target', expression: '$5,000 fixed costs, $2,000 target profit, $40 price, $18 variable cost', result: '318.18 units, about $12,727.27 sales, and $22 contribution per unit' },
      { label: 'Event table', expression: '$900 fixed costs, $750 target profit, $15 price, $5.50 variable cost', result: '173.68 sales, about $2,605.26 revenue, and $9.50 contribution per sale' },
      { label: 'Service package', expression: '$3,200 fixed costs, $4,500 target profit, $250 package price, $60 variable cost', result: '40.53 packages, about $10,131.58 revenue, and $190 contribution per package' },
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
    priorityFaq: [
      {
        question: 'Should I round the target-profit units up?',
        answer:
          'Usually yes. If the answer is 318.18 units and you sell whole items, 318 units is still short of the profit goal. You would need 319 units before the estimate clears the target.',
      },
      {
        question: 'Does this prove I will make that profit?',
        answer:
          'No. It only solves the cost-volume-profit math from the numbers you entered. Demand, capacity, refunds, discounts, shipping, taxes, owner pay, and cash timing can still change the real result.',
      },
      {
        question: 'What happens if price is not higher than variable cost?',
        answer:
          'The goal does not work in normal target-profit math. Each sale needs positive contribution margin. If price is equal to or lower than variable cost, selling more units does not cover fixed costs or profit.',
      },
    ],
    formulaCheck:
      '$5,000 fixed costs plus a $2,000 profit goal means $7,000 must be covered. A $40 price minus $18 variable cost leaves $22 contribution, so $7,000 / $22 = 318.18 units and about $12,727.27 in sales.',
    resultReading:
      'Read target-profit units first, then required sales, then contribution per unit. If contribution is small, the sales target rises quickly.',
    doubleCheck:
      'Check that fixed costs, target profit, and sales period match. Do not hide fees, refunds, discounts, shipping, waste, marketing spend, or capacity limits outside the estimate.',
    limitFollowup:
      'Use business records, accounting software, a bookkeeper, or a financial adviser before using target-profit math for funding, hiring, tax, or pricing decisions.',
  },
  {
    slug: 'liquidity-ratios-calculator',
    name: 'Liquidity Ratios Calculator',
    seoTitle: 'Liquidity Ratios Calculator | Current Quick Cash',
    summary: 'Check working capital plus current, quick, and cash coverage.',
    description:
      'Check working capital plus current, quick, and cash coverage from same-date balance sheet inputs.',
    seoDescription:
      'Check working capital plus current, quick, and cash coverage from same-date balance sheet inputs.',
    icon: 'calculator-liquidity-ratios',
    aliases: ['current ratio calculator', 'quick ratio calculator', 'cash ratio calculator', 'working capital calculator', 'balance sheet liquidity calculator'],
    formula:
      'Current ratio = current assets / current liabilities. Working capital = current assets - current liabilities. Quick ratio = (current assets - inventory - prepaid expenses) / current liabilities. Cash ratio = (cash and equivalents + marketable securities) / current liabilities.',
    limit:
      'This is balance sheet math, not a financial statement audit. It does not judge credit approval, prove solvency, test lender covenants, predict cash timing, value inventory, guarantee receivable collection, handle seasonality, set industry benchmarks, or replace accounting advice.',
    useCases: [
      'Check whether short-term assets cover short-term liabilities.',
      'Compare current ratio, quick ratio, and cash ratio in one place.',
      'Explain why inventory can make current ratio look stronger than quick ratio.',
      'Use same-date balance sheet numbers before deeper business analysis.',
    ],
    examples: [
      { label: 'Small business balance sheet', expression: '$120,000 current assets, $80,000 current liabilities, $25,000 inventory, $5,000 prepaid, $30,000 cash, and $10,000 marketable securities', result: '1.50 current ratio, 1.13 quick ratio, 0.50 cash ratio, and $40,000 working capital' },
      { label: 'Inventory-heavy shop', expression: '$200,000 current assets, $125,000 current liabilities, $90,000 inventory, $8,000 prepaid, and $22,000 cash', result: '1.60 current ratio, 0.82 quick ratio, 0.18 cash ratio, and $75,000 working capital' },
      { label: 'Cash-rich service firm', expression: '$95,000 current assets, $40,000 current liabilities, $3,000 prepaid, $55,000 cash, and $15,000 marketable securities', result: '2.38 current ratio, 2.30 quick ratio, 1.75 cash ratio, and $55,000 working capital' },
    ],
    relatedSlugs: ['business-loan-calculator', 'payback-period-calculator', 'profit-goal-calculator'],
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
    priorityFaq: [
      {
        question: 'What is a good current ratio?',
        answer:
          'There is no one perfect current ratio for every business. A 1.50 current ratio means current assets are 1.5 times current liabilities, but industry, season, credit terms, inventory quality, and cash timing all matter.',
      },
      {
        question: 'Why can current ratio look better than quick ratio?',
        answer:
          'Current ratio includes inventory and prepaid expenses. Quick ratio removes them because they may not turn into cash quickly. An inventory-heavy shop can look fine on current ratio while its quick ratio warns that cash is tighter.',
      },
      {
        question: 'Does cash ratio prove the business can pay every bill?',
        answer:
          'No. Cash ratio only compares cash plus marketable securities with current liabilities at one point in time. It does not show future sales, late receivables, surprise costs, loan rules, or bills that were left out of the balance sheet inputs.',
      },
    ],
    formulaCheck:
      'Check that current assets and current liabilities come from the same balance sheet date. Then compare current ratio, quick ratio, cash ratio, and working capital together instead of trusting one number.',
    resultReading:
      'Current ratio uses all current assets. Quick ratio is stricter because it removes inventory and prepaid expenses. Cash ratio is stricter again because it only uses cash and marketable securities.',
    doubleCheck:
      'Double-check inventory, prepaid expenses, cash, marketable securities, and receivables before relying on the result. A wrong balance sheet line can make the ratios look safer or weaker than they are.',
    limitFollowup:
      'Use financial statements, cash-flow reports, lender covenant documents, industry benchmarks, and a qualified accountant before using liquidity ratios for lending, investing, hiring, or survival decisions.',
  },
  {
    slug: 'debt-ratios-calculator',
    name: 'Debt Ratios Calculator',
    summary: 'Check debt ratio, debt-to-equity, and interest coverage from statement numbers.',
    seoTitle: 'Debt Ratios Calculator | Debt Equity Interest Cover',
    description:
      'Check debt ratio, debt-to-equity ratio, and times interest earned from total debt, assets, equity, EBIT, and interest expense.',
    seoDescription:
      'Calculate debt ratio, debt-to-equity ratio, and times interest earned with clear balance sheet and EBIT examples.',
    icon: 'calculator-debt-ratios',
    aliases: [
      'debt ratio calculator',
      'debt to assets ratio calculator',
      'debt to equity ratio calculator',
      'times interest earned calculator',
      'interest coverage calculator',
      'solvency ratios calculator',
    ],
    formula:
      'Debt ratio = total debt / total assets. Debt-to-equity = total debt / total equity. Times interest earned = EBIT / interest expense.',
    limit:
      'This does not audit financial statements, classify leases, check maturity dates, test refinancing risk, prove cash flow quality, read lender covenants, assign credit ratings, calculate taxes, or give investment advice.',
    useCases: [
      'See what share of assets is funded by debt.',
      'Compare debt with owner equity on the same balance sheet.',
      'Check whether EBIT covers the interest expense entered.',
      'Use beside liquidity and profitability ratios before trusting one number.',
    ],
    examples: [
      {
        label: 'Balanced company',
        expression: '$220,000 debt, $500,000 assets, $280,000 equity, $90,000 EBIT, $15,000 interest',
        result: '44% debt ratio, 0.79x debt-to-equity, 6x interest cover',
      },
      {
        label: 'High debt load',
        expression: '$480,000 debt, $750,000 assets, $270,000 equity, $105,000 EBIT, $42,000 interest',
        result: '64% debt ratio, 1.78x debt-to-equity, 2.5x interest cover',
      },
      {
        label: 'Low debt exposure',
        expression: '$60,000 debt, $350,000 assets, $290,000 equity, $65,000 EBIT, $5,000 interest',
        result: '17.14% debt ratio, 0.21x debt-to-equity, 13x interest cover',
      },
    ],
    relatedSlugs: ['liquidity-ratios-calculator', 'profitability-ratios-calculator', 'operations-ratios-calculator'],
    inputExplanations: [
      { term: 'Total debt', meaning: 'the debt or total liabilities number you want to compare with assets and equity. Use one clear definition and keep it consistent.' },
      { term: 'Total assets and total equity', meaning: 'balance sheet totals from the same date, so the debt ratio and debt-to-equity ratio are not mixing periods.' },
      { term: 'EBIT and interest expense', meaning: 'income statement numbers from the same period, used for the times-interest-earned coverage check.' },
    ],
    priorityFaq: [
      {
        question: 'What is the difference between debt ratio and debt-to-equity?',
        answer:
          'Debt ratio compares total debt with total assets. Debt-to-equity compares the same debt with owner equity. They tell a similar debt-load story, but the denominator changes, so the numbers will not match.',
      },
      {
        question: 'Why can times interest earned look okay when cash is still tight?',
        answer:
          'Times interest earned uses EBIT, not bank cash. A company can show enough EBIT for interest coverage while receivables are late, inventory is stuck, principal payments are due, or cash flow is weak.',
      },
      {
        question: 'Should I use total debt or total liabilities?',
        answer:
          'Use the definition your statement, lender, class, or analysis requires. Some checks use interest-bearing debt only. Others use total liabilities. The important part is labeling it honestly and comparing the same definition each time.',
      },
    ],
    extraFaq: [
      {
        question: 'What is times interest earned?',
        answer:
          'Times interest earned compares EBIT with interest expense. A result of 6x means EBIT is six times the interest expense entered. It is a rough interest-coverage check, not a cash-flow promise.',
      },
      {
        question: 'Should debt-to-equity be low or high?',
        answer:
          'It depends on the industry and business model. Some stable asset-heavy businesses use more debt. Young or risky businesses may need less debt because cash flow is less predictable.',
      },
      {
        question: 'Can I compare this result across industries?',
        answer:
          'Only carefully. A utility, retailer, software company, and construction business can all have different normal debt levels. Compare with similar businesses, trends over time, lender rules, and the notes to the financial statements.',
      },
    ],
    formulaCheck:
      'Use balance sheet numbers from one date for debt, assets, and equity. Use EBIT and interest expense from the same income statement period.',
    resultReading:
      'Debt ratio shows the asset share funded by debt. Debt-to-equity shows debt compared with owner capital. Times interest earned shows how many times EBIT covers the interest expense entered.',
    doubleCheck:
      'Double-check whether the debt field should mean total liabilities or only interest-bearing debt. Then check that assets, equity, EBIT, and interest expense all come from matching statements.',
    limitFollowup:
      'Use financial statements, footnotes, cash-flow reports, maturity schedules, covenant documents, industry benchmarks, and a qualified accountant before using debt ratios for lending, investing, or survival decisions.',
  },
  {
    slug: 'operations-ratios-calculator',
    name: 'Operations Ratios Calculator',
    summary: 'Check inventory turnover, asset turnover, receivables turnover, collection days, and equity multiplier.',
    description:
      'Check inventory turnover, asset turnover, receivables turnover, collection days, and equity multiplier from statement inputs.',
    seoTitle: 'Operations Ratios Calculator | Turnover & Collection Days',
    seoDescription:
      'Calculate inventory turnover, asset turnover, receivables turnover, average collection period, and equity multiplier with clear statement examples.',
    icon: 'calculator-operations-ratios',
    aliases: ['inventory turnover calculator', 'asset turnover calculator', 'receivables turnover calculator'],
    formula:
      'The calculator averages beginning and ending inventory, divides cost of goods sold by average inventory, divides net sales by average assets, divides credit sales by average receivables, converts receivables turnover into collection days, and divides assets by equity for equity multiplier.',
    limit:
      'This is a statement-ratio check. It does not adjust for seasonality, inventory accounting method, stockouts, credit-policy changes, bad debts, one-time sales, customer mix, receivable quality, leases, or financial-statement restatements.',
    useCases: [
      'See how quickly inventory turns over.',
      'Estimate how efficiently assets generate sales.',
      'Measure receivables turnover and average collection period.',
      'Review operating ratios before looking at profit and debt ratios.',
    ],
    examples: [
      { label: 'Retail operations', expression: '$600,000 COGS, $100,000 average inventory, $950,000 sales', result: '6x inventory turnover, 1.90x asset turnover, 8.75x receivables turnover, and 41.71 collection days' },
      { label: 'Faster receivables', expression: '$500,000 credit sales and $45,000 average receivables', result: '11.11x receivables turnover and about 32.85 collection days' },
      { label: 'Inventory-heavy year', expression: '$800,000 COGS and $205,000 average inventory', result: '3.90x inventory turnover before checking stock levels and demand' },
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
        question: 'Why does the calculator use average inventory?',
        answer:
          'Inventory is a balance sheet number at one date, while cost of goods sold covers a period. Averaging beginning and ending inventory gives the turnover ratio a fairer base than using only one snapshot.',
      },
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
      {
        question: 'Can a high inventory turnover be bad?',
        answer:
          'Yes. High turnover can mean inventory is moving fast, but it can also mean stock is too low and customers may not find what they need. Read the ratio with stockout risk, demand, and supplier timing.',
      },
    ],
    formulaCheck:
      'Use cost of goods sold and sales from the same period. Use beginning and ending inventory from the period edges, average assets for the same period, and average receivables that match the credit-sales period.',
    resultReading:
      'Inventory turnover shows how often inventory sold and was replaced. Asset turnover shows sales per dollar of assets. Receivables turnover and collection days show how quickly credit sales turn into cash. Equity multiplier shows how much assets sit on each dollar of equity.',
    doubleCheck:
      'Double-check whether sales means net sales or net credit sales in the field you are filling. Then check that inventory, receivables, assets, and equity come from matching statement periods.',
    limitFollowup:
      'Use full financial statements, footnotes, cash-flow reports, inventory notes, credit policy, customer aging reports, and industry comparisons before judging whether operations are strong or weak.',
  },
  {
    slug: 'profitability-ratios-calculator',
    name: 'Profitability Ratios Calculator',
    summary: 'Calculate gross margin, operating margin, net margin, ROA, ROE, EPS, and P/E from statement inputs.',
    description:
      'Calculate gross margin, operating margin, net margin, ROA, ROE, EPS, and P/E from income statement, balance sheet, share, and price inputs.',
    seoTitle: 'Profitability Ratios Calculator | Margin, ROA & ROE',
    seoDescription:
      'Calculate gross margin, operating margin, net margin, ROA, ROE, EPS, and P/E with clear statement examples and ratio limits.',
    icon: 'calculator-profitability-ratios',
    aliases: ['profit margin ratios calculator', 'return on assets calculator', 'return on equity calculator'],
    formula:
      'The calculator subtracts cost of goods sold from net sales for gross profit, divides gross profit, operating income, and net income by net sales for margins, then compares net income with average assets, average equity, shares, and stock price.',
    limit:
      'This does not adjust for unusual gains or losses, accounting policy, tax items, share dilution, debt-funded equity changes, industry differences, market expectations, cash flow, restatements, or investment advice.',
    useCases: [
      'Compare several profitability ratios from one set of statements.',
      'See the difference between gross, operating, and net margin.',
      'Estimate return on assets and return on equity.',
      'Connect earnings per share with a simple P/E ratio.',
    ],
    examples: [
      { label: 'Profitable company', expression: '$950,000 sales, $600,000 COGS, $180,000 operating income, $120,000 net income', result: '36.84% gross margin, 18.95% operating margin, and 12.63% net margin' },
      { label: 'Return check', expression: '$120,000 net income, $500,000 average assets, $260,000 average equity', result: '24% ROA and 46.15% ROE' },
      { label: 'Per-share check', expression: '$120,000 net income, 100,000 shares, $18 price', result: '$1.20 EPS and 15x P/E' },
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
      {
        question: 'Why do EPS and P/E need shares and price?',
        answer:
          'EPS divides net income by shares, so it needs a share count. P/E compares share price with EPS, so it needs the price per share too. Without those two inputs, margin and return ratios can still work, but per-share ratios cannot.',
      },
    ],
    formulaCheck:
      'Use sales, COGS, operating income, and net income from the same income statement period. Use average assets and average equity for that same period, then use the share count and share price that match the EPS and P/E question.',
    resultReading:
      'Gross margin shows profit after direct cost. Operating margin shows profit after operating expenses. Net margin shows final profit as a percent of sales. ROA compares profit with assets, ROE compares profit with equity, EPS shows profit per share, and P/E compares price with EPS.',
    doubleCheck:
      'Double-check whether one-time gains, unusual costs, share dilution, debt-funded equity changes, or accounting changes are making the ratio look better or worse than the normal business.',
    limitFollowup:
      'Use full financial statements, footnotes, cash-flow reports, share-count notes, debt ratios, segment results, and industry comparisons before judging whether profitability is strong or weak.',
  },
  {
    slug: 'stock-ratios-calculator',
    name: 'Stock Ratios Calculator',
    summary: 'Calculate P/E, price-to-sales, price-to-book, dividend yield, and payout ratio.',
    description:
      'Calculate price-to-earnings, price-to-sales, price-to-book, dividend yield, and payout ratio from share price and per-share inputs.',
    seoTitle: 'Stock Ratios Calculator | P/E, P/S, P/B & Yield',
    seoDescription:
      'Calculate P/E, price-to-sales, price-to-book, dividend yield, and payout ratio with clear per-share examples and stock-ratio limits.',
    icon: 'calculator-stock-ratios',
    aliases: ['pe ratio calculator', 'price to sales calculator', 'price to book calculator', 'dividend yield calculator'],
    formula:
      'The calculator divides stock price by EPS for P/E, by sales per share for P/S, and by book value per share for P/B. It divides annual dividend per share by stock price for dividend yield, then divides dividend per share by EPS for payout ratio.',
    limit:
      'This does not include future growth, analyst estimates, debt risk, accounting quality, share dilution, dividend cuts, buybacks, industry norms, taxes, trading fees, portfolio fit, or investment advice.',
    useCases: [
      'Calculate common stock valuation ratios from per-share numbers.',
      'Compare P/E, price-to-sales, and price-to-book side by side.',
      'Estimate dividend yield and payout ratio.',
      'Learn what each ratio is measuring before researching a stock deeper.',
    ],
    examples: [
      { label: 'Dividend stock', expression: '$18 price, $1.20 EPS, $9.50 sales/share, $2.60 book/share, $0.45 dividend', result: '15x P/E, 1.89x P/S, 6.92x P/B, 2.5% yield, and 37.5% payout' },
      { label: 'Growth stock', expression: '$75 price, $2.50 EPS, $18 sales/share, $8 book/share, no dividend', result: '30x P/E, 4.17x P/S, 9.38x P/B, and 0% dividend yield' },
      { label: 'Value check', expression: '$32 price, $4 EPS, $45 sales/share, $21 book/share, $1.20 dividend', result: '8x P/E, 0.71x P/S, 1.52x P/B, 3.75% yield, and 30% payout' },
    ],
    relatedSlugs: ['roi-calculator', 'present-value-calculator', 'investment-calculator'],
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
      {
        question: 'What is the difference between dividend yield and payout ratio?',
        answer:
          'Dividend yield compares the annual dividend with the share price. Payout ratio compares the same dividend with EPS. A stock can have a high yield because the dividend is large, because the price fell, or because the market expects trouble.',
      },
      {
        question: 'Why can price-to-book be misleading?',
        answer:
          'Book value comes from accounting records. It may miss brand value, software, debt risk, old asset values, buybacks, or write-down risk. P/B is a clue, not a full valuation.',
      },
    ],
    formulaCheck:
      'Use per-share numbers from the same reporting period when possible. Check whether EPS is trailing or forward, whether dividends are annualized, and whether book value per share already reflects recent buybacks or share-count changes.',
    resultReading:
      'P/E says how many dollars of price sit on each dollar of EPS. P/S compares price with sales per share. P/B compares market price with accounting book value. Dividend yield compares dividend with price, while payout ratio compares dividend with EPS.',
    doubleCheck:
      'Double-check EPS type, share splits, stale prices, special dividends, missing dividends, negative EPS, and whether the company changed its share count or balance sheet after the numbers you entered.',
    limitFollowup:
      'Use full filings, earnings notes, cash-flow reports, debt ratios, profit ratios, dividend history, share-count notes, industry comparisons, and personal risk limits before treating a stock ratio as useful.',
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
      'Estimate a monthly Social Security retirement benefit from birth year, full-retirement-age benefit, and claiming age.',
    seoTitle: 'Social Security Calculator | Claim at 62, FRA or 70',
    seoDescription:
      'Estimate how claiming at 62, full retirement age, or 70 changes a monthly Social Security retirement benefit from your SSA estimate.',
    icon: 'calculator-retirement',
    formula:
      'The calculator estimates full retirement age from birth year, then applies early claiming reductions before full retirement age or delayed retirement credits after full retirement age through age 70.',
    limit:
      'This does not access SSA records, rebuild your 35-year earnings history, model spousal or survivor benefits, apply WEP or GPO rules, calculate work earnings tests, estimate taxes, price Medicare, forecast COLA changes, or replace an official SSA estimate.',
    useCases: [
      'Compare claiming at 62, full retirement age, and 70.',
      'Use your SSA full-retirement-age benefit estimate as the starting point.',
      'See the monthly and annual effect of claiming age.',
      'Plan questions before using official SSA tools.',
    ],
    examples: [
      { label: 'Claim at FRA', expression: 'Born 1962, $2,400 FRA benefit, claim at 67', result: '$2,400 monthly and $28,800 yearly' },
      { label: 'Early claim', expression: 'Born 1962, $2,400 FRA benefit, claim at 62', result: '$1,680 monthly after a 30% reduction' },
      { label: 'Delayed claim', expression: 'Born 1960, $2,600 FRA benefit, claim at 70', result: '$3,224 monthly after a 24% delayed credit' },
    ],
    relatedSlugs: ['retirement-calculator', 'pension-calculator', 'rmd-calculator'],
    inputExplanations: [
      { term: 'Birth year', meaning: 'used to estimate full retirement age. People born in 1960 or later use age 67 in this simple model.' },
      { term: 'Monthly benefit at full retirement age', meaning: 'the number to copy from an official SSA estimate when possible, not a guess from salary alone.' },
      { term: 'Claiming age', meaning: 'the age from 62 through 70 that the calculator uses for early reduction or delayed-credit math.' },
    ],
    extraFaq: [
      {
        question: 'Where should I get the full-retirement-age benefit number?',
        answer:
          'Use your my Social Security account or another official SSA estimate when you can. This calculator starts from that number; it does not rebuild your earnings record from scratch.',
      },
      {
        question: 'Does claiming at 70 keep increasing forever?',
        answer:
          'No. SSA delayed retirement credits stop at age 70. This calculator lets you test ages 62 through 70 only.',
      },
      {
        question: 'Does this include the 2026 Social Security earnings limit?',
        answer:
          'No. It shows claiming-age math only. If you work while claiming before full retirement age, SSA earnings-test rules can withhold some benefits, so check official SSA guidance before relying on the result.',
      },
    ],
    formulaCheck:
      'Start with an official SSA monthly benefit at full retirement age when possible. Then test one claiming age at a time so you can see whether the change comes from early reduction or delayed credits.',
    resultReading:
      'Monthly benefit is the rough benefit at the claiming age entered. Adjustment percent shows the change from the full-retirement-age benefit. Annual estimate is the monthly estimate multiplied by 12.',
    doubleCheck:
      'Double-check birth year, full retirement age, and the SSA estimate you copied. A wrong FRA benefit makes every claiming-age result wrong.',
    limitFollowup:
      'Use your my Social Security account, SSA calculators, spouse or survivor rules, earnings-test rules, Medicare timing, tax rules, and household cash needs before deciding when to claim.',
  },
  {
    slug: 'rmd-calculator',
    name: 'RMD Calculator',
    summary: 'Estimate a required minimum distribution from prior Dec. 31 balance and age.',
    description:
      'Estimate a required minimum distribution from prior Dec. 31 balance and age using the IRS Uniform Lifetime Table.',
    seoTitle: 'RMD Calculator | IRS Uniform Lifetime Table Estimate',
    seoDescription:
      'Estimate an RMD from prior Dec. 31 balance and age using the IRS Uniform Lifetime Table, with factor, withdrawal, and limits shown.',
    icon: 'calculator-retirement',
    formula:
      'The calculator takes the prior December 31 account balance and divides it by the IRS Uniform Lifetime Table factor for the age entered.',
    limit:
      'This is a simple owner-style Uniform Lifetime Table estimate. It does not cover inherited IRAs, a spouse more than 10 years younger who is the sole beneficiary, Roth IRA owner rules, multiple account aggregation, first-year deadlines, penalties, tax withholding, or tax advice.',
    useCases: [
      'Estimate an annual RMD from a traditional IRA or similar retirement account.',
      'Look up the IRS Uniform Lifetime Table factor for one age.',
      'Check the withdrawal amount and the balance left after the estimate.',
      'Prepare questions before checking custodian records or IRS instructions.',
    ],
    examples: [
      { label: 'Age 75', expression: '$500,000 prior Dec. 31 balance at age 75', result: '$20,325.20 RMD estimate using factor 24.6' },
      { label: 'Age 80', expression: '$750,000 prior Dec. 31 balance at age 80', result: '$37,128.71 RMD estimate using factor 20.2' },
      { label: 'Age 90', expression: '$300,000 prior Dec. 31 balance at age 90', result: '$24,590.16 RMD estimate using factor 12.2' },
    ],
    relatedSlugs: ['ira-calculator', 'retirement-calculator', 'social-security-calculator'],
    inputExplanations: [
      {
        term: 'Prior Dec. 31 balance',
        meaning:
          'the account balance at the end of the year before the distribution year. For a 2026 RMD, that usually means the December 31, 2025 balance.',
      },
      {
        term: 'Age this year',
        meaning:
          'your age on your birthday in the distribution year. The table factor is picked from that age, not from your age on the day you type the estimate.',
      },
    ],
    extraFaq: [
      {
        question: 'Does this use the 2026 IRS RMD table?',
        answer:
          'It uses the IRS Uniform Lifetime Table factors shown in Publication 590-B for owner-style lifetime distributions. For example, age 75 uses factor 24.6, age 80 uses 20.2, and age 90 uses 12.2.',
      },
      {
        question: 'Can I use this for an inherited IRA RMD?',
        answer:
          'No. Inherited IRA rules can use different tables, 10-year rules, spouse rules, and beneficiary dates. Use this page only for the simple owner-style Uniform Lifetime Table estimate.',
      },
      {
        question: 'Why does the calculator allow age 72?',
        answer:
          'The IRS table still has an age 72 row, but the current general RMD starting age is usually 73. Use age 72 only if your account paperwork or tax professional says that row applies to your situation.',
      },
    ],
    formulaCheck:
      'For a 2026 owner-style estimate, use the December 31, 2025 balance, choose the age you turn in 2026, then divide by that table factor.',
    resultReading:
      'Estimated RMD is the minimum withdrawal estimate from the entered balance. Uniform table factor is the IRS denominator. Balance after RMD is only subtraction, not a year-end prediction after market changes or taxes.',
    doubleCheck:
      'Check the balance date, the age used for the distribution year, whether the account is inherited, and whether your spouse is the sole beneficiary and more than 10 years younger.',
    limitFollowup:
      'Check IRS Publication 590-B, IRS RMD FAQs, your custodian statement, tax withholding, aggregation rules, and first-year timing before treating the estimate as your real required withdrawal.',
  },
  {
    slug: 'real-estate-calculator',
    name: 'Real Estate Calculator',
    summary: 'Estimate sale profit, net proceeds, ROI, and equity multiple from a property sale scenario.',
    description:
      'Use this free real estate calculator to estimate sale profit, net sale proceeds, ROI, and equity multiple from purchase price, cash invested, selling costs, and loan payoff.',
    seoTitle: 'Real Estate Calculator | Sale Profit, ROI & Net Proceeds',
    seoDescription:
      'Estimate property sale profit, net sale proceeds, ROI, and equity multiple from purchase price, down payment, improvements, selling costs, and loan payoff.',
    icon: 'calculator-house-affordability',
    aliases: [
      'home sale profit calculator',
      'net proceeds calculator',
      'property ROI calculator',
      'real estate sale calculator',
    ],
    formula:
      'The calculator adds down payment, buying costs, and improvements for cash invested. It subtracts selling costs and loan payoff from selling price for net sale proceeds, then compares proceeds with cash invested.',
    limit:
      'This is a sale-profit estimate, not a tax return, closing statement, appraisal, or investment offer. It does not calculate adjusted tax basis, depreciation, depreciation recapture, capital gains tax, rent history, refinancing, local transfer taxes, escrow prorations, or legal costs.',
    useCases: [
      'Estimate what might be left after selling costs and mortgage payoff.',
      'Include down payment, buying costs, improvements, sale price, selling costs, and loan payoff.',
      'Compare sale profit with cash invested.',
      'Screen a home sale or fix-up resale before building a full spreadsheet.',
    ],
    examples: [
      { label: 'Home sale', expression: '$350k purchase to $430k sale', result: '$51,200 estimated profit' },
      { label: 'Fix-up resale', expression: '$48k down, $35k improvements, $330k sale', result: '$36,200 estimated profit' },
      { label: 'Thin margin', expression: '$545k sale with $382k payoff', result: '$8,300 estimated profit' },
    ],
    relatedSlugs: ['rental-property-calculator', 'mortgage-calculator', 'rent-vs-buy-calculator'],
    inputExplanations: [
      { term: 'Purchase price', meaning: 'the price paid for the property, before later improvements or sale costs.' },
      { term: 'Cash down payment', meaning: 'your cash put into the purchase, not the whole loan amount.' },
      { term: 'Buying costs', meaning: 'cash closing costs and purchase fees you want to count as part of your investment.' },
      { term: 'Improvements', meaning: 'money spent on upgrades you want to count in the sale-profit check.' },
      { term: 'Selling price', meaning: 'the expected sale price before selling costs and mortgage payoff.' },
      { term: 'Selling costs', meaning: 'agent fees, seller credits, repairs, closing costs, or other sale costs you want to subtract.' },
      { term: 'Loan payoff at sale', meaning: 'the mortgage payoff estimate, which can differ from the current balance because payoff quotes include timing and interest.' },
    ],
    priorityFaq: [
      {
        question: 'Is this a home sale net proceeds calculator?',
        answer:
          'Yes, for a simple scenario. Net sale proceeds means selling price minus selling costs minus loan payoff. It does not replace the Closing Disclosure, escrow sheet, payoff quote, or tax records.',
      },
      {
        question: 'Is ROI based on the whole purchase price?',
        answer:
          'No. This page compares profit with cash invested: down payment, buying costs, and improvements. That is useful for a cash-on-cash style check, but it is not the same as return on the full property value.',
      },
      {
        question: 'Does this calculate capital gains tax?',
        answer:
          'No. IRS home-sale rules can depend on adjusted basis, selling expenses, ownership and use tests, prior exclusions, rental use, depreciation, and filing status. Use this page for sale math only, then check tax rules separately.',
      },
    ],
    formulaCheck:
      'For the default example: cash invested is $70,000 + $8,000 + $15,000 = $93,000. Net sale proceeds are $430,000 - $25,800 - $260,000 = $144,200. Estimated profit is $144,200 - $93,000 = $51,200.',
    resultReading:
      'Estimated profit or loss is the main answer. Cash invested shows the money compared against the result. Net sale proceeds shows the simplified cash left after sale costs and loan payoff. ROI and equity multiple help compare scenarios, but only if you measure cash invested the same way each time.',
    doubleCheck:
      'Check the payoff quote date, selling-cost estimate, improvements total, whether buying costs belong in your investment basis, and whether taxes, rent history, or depreciation matter for the property.',
    limitFollowup:
      'Before using the result for a real sale, compare it with the lender payoff quote, settlement estimate, Closing Disclosure, local tax rules, agent agreement, and IRS Publication 523 if it is a home sale.',
  },
  {
    slug: 'take-home-paycheck-calculator',
    name: 'Take-Home-Paycheck Calculator',
    summary: 'Estimate take-home pay per paycheck from salary, pay schedule, pretax deductions, tax estimates, and 2026 employee FICA.',
    description:
      'Use this free take-home-paycheck calculator to estimate net pay from annual gross pay, pay frequency, pretax deductions, federal/state/local withholding estimates, and 2026 employee FICA.',
    seoTitle: 'Take-Home-Paycheck Calculator | Net Pay & FICA Estimate',
    seoDescription:
      'Estimate take-home pay from salary, pay schedule, pretax deductions, tax percentages, Social Security, Medicare, and the 2026 wage-base limit.',
    icon: 'calculator-salary',
    aliases: [
      'take home pay calculator',
      'paycheck tax calculator',
      'net pay calculator',
      'salary paycheck calculator',
      'biweekly paycheck calculator',
    ],
    formula:
      'The calculator annualizes pretax deductions, applies the federal, state, and local tax percentages you enter, applies employee Social Security and Medicare estimates, then divides annual take-home pay by the number of paychecks.',
    limit:
      'This is a rough paycheck estimate, not a payroll system or tax return. It does not read your Form W-4, use IRS Publication 15-T withholding tables, handle exact state/local rules, benefit plan rules, garnishments, bonus withholding, overtime, pre-tax limit rules, or employer payroll timing.',
    useCases: [
      'Estimate take-home pay before accepting a salary or changing jobs.',
      'Compare weekly, biweekly, semimonthly, and monthly pay schedules without changing annual salary.',
      'Include simple pretax deductions and your own federal, state, and local withholding percentages.',
      'See the employee Social Security and Medicare estimate separately so FICA is not hidden.',
    ],
    examples: [
      { label: 'Biweekly salary', expression: '$78,000 salary, 26 paychecks, $120 pretax each', result: '$2,189.70 estimated take-home' },
      { label: 'Monthly pay', expression: '$96,000 salary, 12 paychecks, $300 pretax each', result: '$5,548.00 estimated take-home' },
      { label: 'Weekly pay', expression: '$52,000 salary, 52 paychecks, $60 pretax each', result: '$741.30 estimated take-home' },
    ],
    relatedSlugs: ['salary-calculator', 'income-tax-calculator', 'marriage-tax-calculator'],
    inputExplanations: [
      { term: 'Annual gross pay', meaning: 'your yearly pay before paycheck deductions, income tax withholding, Social Security, and Medicare.' },
      { term: 'Pay schedule', meaning: 'how many paychecks you get per year, such as 52 weekly, 26 biweekly, 24 semimonthly, or 12 monthly.' },
      { term: 'Pretax deductions per paycheck', meaning: 'paycheck deductions you want to subtract before the simple tax percentages, such as a retirement or health-plan estimate.' },
      { term: 'Federal withholding estimate', meaning: 'your rough federal income-tax withholding percent. This is not a W-4 table calculation.' },
      { term: 'State and local withholding estimates', meaning: 'rough percentages for state or city/local withholding if they apply to you.' },
    ],
    priorityFaq: [
      {
        question: 'Does this use my Form W-4?',
        answer:
          'No. This version uses the percentages you enter. Real payroll uses your Form W-4, filing status, dependents, extra withholding, pay timing, benefits, and IRS withholding tables.',
      },
      {
        question: 'Does this include Social Security and Medicare?',
        answer:
          'Yes, as a simplified 2026 employee FICA estimate. Social Security is estimated at 6.2% up to the 2026 wage base, and Medicare is estimated at 1.45% with extra Medicare tax above $200,000.',
      },
      {
        question: 'Should I include FICA in the federal tax percent?',
        answer:
          'No. The calculator shows FICA separately. If you include Social Security or Medicare inside the federal percent field too, you will double count part of the paycheck deduction.',
      },
    ],
    formulaCheck:
      'For the default example: $78,000 salary / 26 paychecks = $3,000 gross per paycheck. $120 pretax per paycheck is $3,120 per year. With 12% federal, 4% state, 0% local, and 2026 employee FICA, estimated take-home is $56,932.20 per year, or $2,189.70 per paycheck.',
    resultReading:
      'The main answer is estimated take-home per paycheck. Gross per paycheck shows the before-deduction amount. Annual take-home shows the same estimate across the year. FICA estimate separates Social Security and Medicare from your entered income-tax percentages.',
    doubleCheck:
      'Check whether your federal percentage already includes FICA, whether your state or city has separate rules, whether benefits are actually pretax, and whether bonuses, overtime, garnishments, or extra W-4 withholding apply.',
    limitFollowup:
      'Use an actual paystub, employer payroll tool, IRS Tax Withholding Estimator, or payroll professional for exact withholding. This page is for quick salary and paycheck planning only.',
  },
  {
    slug: 'rental-property-calculator',
    name: 'Rental Property Calculator',
    summary: 'Estimate rental cash flow, monthly NOI, cap rate, cash-on-cash return, and mortgage impact.',
    description:
      'Use this free rental property calculator to estimate mortgage payment, vacancy reserve, operating expenses, monthly cash flow, NOI, cap rate, and cash-on-cash return.',
    seoTitle: 'Rental Property Calculator | Cash Flow, NOI & ROI',
    seoDescription:
      'Estimate rental cash flow, monthly NOI, cap rate, cash-on-cash return, mortgage payment, vacancy reserve, and operating expenses.',
    icon: 'calculator-rent',
    aliases: [
      'rental property calculator',
      'roi for rental property calculator',
      'rental cash flow calculator',
      'cap rate calculator',
      'cash on cash return calculator',
    ],
    formula:
      'The calculator subtracts vacancy reserve, taxes, insurance, maintenance reserve, and operating expenses from rent for NOI. It then subtracts the mortgage payment for cash flow and compares NOI and cash flow with property price and cash invested.',
    limit:
      'This is a screening estimate, not a tax return, lender worksheet, appraisal, or full underwriting model. It does not include depreciation, income tax, passive-loss rules, capex timing, rent control, tenant risk, property management contracts, refinancing, local landlord rules, or sale taxes.',
    useCases: [
      'Screen whether monthly rent covers estimated costs.',
      'Estimate cap rate before financing effects.',
      'Estimate cash-on-cash return after mortgage payment.',
      'Compare vacancy, maintenance, tax, insurance, and expense assumptions.',
    ],
    examples: [
      { label: 'Rental house', expression: '$300k property, $2,400 rent, 25% down', result: '$129.35 monthly shortfall, 5.32% cap rate' },
      { label: 'Condo', expression: '$220k condo, $1,750 rent, higher expenses', result: '$189.58 monthly shortfall, 4.65% cap rate' },
      { label: 'Higher rent', expression: '$420k property, $4,200 rent, 25% down', result: '$552.08 monthly cash flow, 7.50% cap rate' },
    ],
    relatedSlugs: ['real-estate-calculator', 'mortgage-calculator', 'roi-calculator'],
    inputExplanations: [
      { term: 'Property price', meaning: 'the purchase price used for cap rate, loan amount, and maintenance reserve math.' },
      { term: 'Down payment and closing costs', meaning: 'the cash invested before the property starts producing income.' },
      { term: 'Monthly rent', meaning: 'expected rent before vacancy, repairs, taxes, insurance, and loan payment.' },
      { term: 'Vacancy reserve', meaning: 'a simple rent haircut for empty months, late turnover, or rent that does not arrive on schedule.' },
      { term: 'Operating expenses', meaning: 'monthly non-loan costs such as management, HOA, utilities paid by the owner, routine repairs, or service contracts.' },
    ],
    priorityFaq: [
      {
        question: 'Is NOI the same as cash flow?',
        answer:
          'No. NOI is rent minus vacancy and operating expenses before the loan payment. Cash flow is what is left after the estimated mortgage payment too.',
      },
      {
        question: 'Does this include rental-property taxes or depreciation?',
        answer:
          'No. IRS rental rules can include income, expenses, depreciation, passive-loss limits, personal-use rules, and recordkeeping. This page only screens the deal math.',
      },
      {
        question: 'Can a lender use this rental income number?',
        answer:
          'No. Lenders use their own rental income rules, leases, history, appraisals, vacancy factors, and underwriting worksheets. Use this as a first-pass check only.',
      },
    ],
    formulaCheck:
      'For the default example: $2,400 rent - $120 vacancy - $260 operating costs - $300 property tax - $140 insurance - $250 maintenance reserve = $1,330 monthly NOI. The estimated mortgage payment is $1,459.35, so monthly cash flow is a $129.35 shortfall.',
    resultReading:
      'Monthly cash flow is the after-loan result. Monthly NOI shows the property before financing. Cap rate compares annual NOI with purchase price. Cash-on-cash return compares annual cash flow with down payment plus closing costs.',
    doubleCheck:
      'Check rent comps, property taxes, insurance quotes, HOA rules, management fees, repair history, capex needs, local rental rules, vacancy risk, and the written loan estimate before trusting a deal.',
    limitFollowup:
      'Use a tax pro, lender, property manager, lease data, inspection report, and local landlord rules before buying or financing a rental property. This calculator is for fast screening, not a final investment decision.',
  },
  {
    slug: 'irr-calculator',
    name: 'IRR Calculator',
    summary: 'Estimate IRR from one starting outflow and five evenly spaced cash-flow periods.',
    description:
      'Use this free IRR calculator to estimate periodic and annualized internal rate of return from an initial investment and five evenly spaced cash-flow periods.',
    seoTitle: 'IRR Calculator | Internal Rate of Return',
    seoDescription:
      'Estimate internal rate of return from an initial outflow and five regular cash-flow periods, with periodic IRR, annualized IRR, and limit checks.',
    icon: 'calculator-rate',
    aliases: [
      'irr calculator',
      'internal rate of return calculator',
      'irr calculator formula',
      'irr calculator monthly',
      'investment irr calculator',
    ],
    formula:
      'The calculator treats the initial investment as a negative cash flow, then solves for the rate that makes the net present value of all entered cash flows approximately zero.',
    limit:
      'IRR can be misleading for cash flows that change signs more than once, uneven real-world timing, reinvestment assumptions, different project sizes, taxes, fees, inflation, or risk.',
    useCases: [
      'Estimate a project internal rate of return.',
      'Compare uneven cash flows against a target return.',
      'See periodic and annualized IRR.',
      'Screen an investment before a detailed model.',
    ],
    examples: [
      { label: 'Five-year project', expression: '$10,000 outflow, then $2,200 to $4,500 annual inflows', result: '12.22% annualized IRR' },
      { label: 'Uneven annual cash flows', expression: '$25,000 outflow, then $4,000 to $9,000 annual inflows', result: '10.44% annualized IRR' },
      { label: 'Five monthly periods', expression: '$5,000 outflow, then five smaller monthly inflows', result: '-86.74% annualized IRR warning' },
    ],
    relatedSlugs: ['roi-calculator', 'payback-period-calculator', 'present-value-calculator'],
    inputExplanations: [
      { term: 'Initial investment outflow', meaning: 'the starting cost or cash paid out. The calculator turns this into a negative cash flow.' },
      { term: 'Year 1 through Year 5 cash flow', meaning: 'the money expected back in each regular period, entered in the same order it arrives.' },
      { term: 'Periods per year', meaning: 'how often those cash-flow periods happen. Use 1 for annual, 4 for quarterly, or 12 for monthly spacing.' },
    ],
    priorityFaq: [
      {
        question: 'Do the cash flows need to be evenly spaced?',
        answer:
          'Yes. This IRR page works like spreadsheet IRR: the cash flows can be different amounts, but the periods should be regular, such as yearly, quarterly, or monthly. Irregular dates need an XIRR-style tool instead.',
      },
      {
        question: 'Why can IRR look strange or fail?',
        answer:
          'IRR is the rate where NPV is about zero. If the cash flows switch from negative to positive and back again, there can be more than one possible IRR, or no simple answer this page should show.',
      },
      {
        question: 'Is IRR better than ROI?',
        answer:
          'Not always. IRR includes cash-flow timing, which ROI ignores, but IRR can overrate tiny projects or assume reinvestment at the same rate. Use ROI, payback, NPV, and plain risk checks too.',
      },
    ],
    formulaCheck:
      'For the default example: -$10,000, $2,200, $2,400, $2,600, $2,800, and $4,500 produces a periodic IRR of about 12.22%. With annual periods, the annualized IRR is also about 12.22%.',
    resultReading:
      'Annualized IRR is the headline rate after using the periods-per-year setting. Periodic IRR is the solved rate for one cash-flow period. Net cash flow is simple dollars in minus dollars out, so it does not adjust for timing.',
    doubleCheck:
      'Check that the first value is the outflow, later values are in the right order, the periods are evenly spaced, and the periods-per-year setting matches your cash-flow timing.',
    limitFollowup:
      'Use a full investment model, real dates, NPV, MIRR, fees, taxes, inflation, risk, and professional review before choosing a real project or investment. This page is a quick IRR screen, not advice.',
  },
  {
    slug: 'roi-calculator',
    name: 'ROI Calculator',
    summary: 'Calculate simple ROI from starting cost, ending value, income, and costs.',
    description:
      'Use this free ROI calculator to estimate gain or loss and return on investment percentage from starting cost, ending value, income, and costs.',
    seoTitle: 'ROI Calculator | Return on Investment Formula',
    seoDescription:
      'Calculate simple ROI from starting cost, ending value, income, and costs. See gain or loss, fee cautions, risk limits, and when ROI is not enough.',
    icon: 'calculator-average-return',
    aliases: [
      'roi calculator',
      'return on investment calculator',
      'roi formula',
      'investment roi calculator',
      'roi calculator real estate',
      'roi calculator excel',
    ],
    formula:
      'The calculator adds ending value and income, subtracts costs and initial investment, then divides gain or loss by the initial investment and shows the result as a percent.',
    limit:
      'Simple ROI does not annualize the result or adjust for holding time, compounding, risk, taxes, inflation, financing, cash-flow timing, or whether another option was safer.',
    useCases: [
      'Calculate simple investment ROI from one start point and one end point.',
      'Include income, fees, repairs, tax estimates, or other costs in the gain calculation.',
      'Check whether a project produced a positive or negative return before deeper modeling.',
      'Use before comparing with IRR or payback period.',
    ],
    examples: [
      { label: 'Investment gain', expression: '$10,000 starts, $12,500 ends, $600 income, $250 costs', result: '28.5% ROI and $2,850 gain' },
      { label: 'Small project', expression: '$3,000 starts, $3,900 ends, $150 costs', result: '25% ROI and $750 gain' },
      { label: 'Loss check', expression: '$8,000 starts, $7,200 ends, $300 income, $100 costs', result: '-7.5% ROI and $600 loss' },
    ],
    relatedSlugs: ['irr-calculator', 'average-return-calculator', 'payback-period-calculator'],
    inputExplanations: [
      { term: 'Initial investment', meaning: 'the starting cost or money at risk. This is the number ROI compares the gain or loss against.' },
      { term: 'Ending value', meaning: 'what the investment, item, project, or deal is worth at the snapshot you are checking.' },
      { term: 'Income received', meaning: 'cash returned during the period, such as dividends, rent, revenue, or rebates that are not already inside ending value.' },
      { term: 'Costs paid', meaning: 'fees, repairs, taxes, subscriptions, commissions, financing costs, or other costs that belong in the same ROI boundary.' },
    ],
    priorityFaq: [
      {
        question: 'What formula does this ROI calculator use?',
        answer:
          'It uses (ending value + income - costs - initial investment) divided by initial investment, then multiplies by 100. That keeps dollar gain and percentage ROI separate.',
      },
      {
        question: 'Does this calculator annualize ROI?',
        answer:
          'No. This page shows simple total ROI for the numbers entered. If two investments lasted different lengths of time, also check annual return, IRR, payback period, risk, and fees.',
      },
      {
        question: 'Should fees and taxes be included?',
        answer:
          'Include them when they belong to the same deal or project. A small fee can make a simple ROI look better than the real result, especially when the gain is not large.',
      },
    ],
    formulaCheck:
      'For the default example: ($12,500 ending value + $600 income - $250 costs - $10,000 initial investment) / $10,000 = 0.285, so the simple ROI is 28.5% and the gain is $2,850.',
    resultReading:
      'ROI percent is the gain or loss compared with the starting investment. Gain or loss is the dollar amount after ending value plus income, minus costs and the starting investment.',
    doubleCheck:
      'Check that the starting cost, ending value, income, and costs all use the same project boundary. Do not mix one-time costs with monthly income unless that is the exact period you mean.',
    limitFollowup:
      'Use annual return, IRR, NPV, payback period, taxes, fees, risk, inflation, and professional review before choosing a real investment. A high simple ROI can still be slow, risky, or too small to matter.',
  },
  {
    slug: 'apr-calculator',
    name: 'APR Calculator',
    summary: 'Estimate loan APR from amount borrowed, note rate, term, and upfront finance charges.',
    description:
      'Use this free APR calculator to estimate how upfront finance charges can make a fixed loan cost more than the note rate suggests.',
    seoTitle: 'APR Calculator | Loan APR With Fees',
    seoDescription:
      'Estimate loan APR from amount borrowed, note rate, term, and upfront fees. See amount received, monthly payment, APR limits, and disclosure cautions.',
    icon: 'calculator-rate',
    aliases: [
      'apr calculator',
      'loan apr calculator',
      'apr calculator personal loan',
      'car apr calculator',
      'apr formula calculator',
      'apr calculator with fees',
    ],
    formula:
      'The calculator estimates the scheduled payment at the note rate, subtracts entered fees from the amount received, then solves the annualized rate implied by that same payment stream.',
    limit:
      'This is not an official Truth in Lending disclosure. APR rules can include specific finance charges, payment timing, prepaid interest, rounding, tolerances, and lender disclosures.',
    useCases: [
      'Estimate how upfront loan fees can raise APR above the note rate.',
      'Compare fixed-payment loan offers that have different fees.',
      'See the amount received after finance charges are subtracted.',
      'Prepare better questions before reading a Loan Estimate or lender disclosure.',
    ],
    examples: [
      { label: 'Personal loan APR', expression: '$20,000 at 8% for 5 years with $600 fees', result: 'About 9.30% APR, $405.53/month, and $19,400 received' },
      { label: 'Low fee', expression: '$12,000 at 9.5% for 4 years with $150 fees', result: 'About 10.16% APR and $11,850 received' },
      { label: 'Large loan', expression: '$250,000 at 6.5% for 30 years with $5,000 fees', result: 'About 6.70% APR and $245,000 received' },
    ],
    relatedSlugs: ['loan-calculator', 'interest-rate-calculator', 'personal-loan-calculator'],
    inputExplanations: [
      { term: 'Loan amount', meaning: 'the full principal used to calculate the scheduled payment.' },
      { term: 'Note rate', meaning: 'the interest rate on the loan note, before this page adjusts for upfront fees.' },
      { term: 'Term', meaning: 'the fixed repayment length in years. The calculator turns this into monthly payments.' },
      { term: 'Finance charges / fees', meaning: 'upfront costs you want to treat as reducing the amount received, such as an origination fee in a simple comparison.' },
    ],
    priorityFaq: [
      {
        question: 'Why is APR higher than the note rate?',
        answer:
          'APR can be higher when fees reduce the money you effectively receive while the payment is still based on the larger loan amount. That is why the calculator shows both amount received and monthly payment.',
      },
      {
        question: 'Is this the official APR on my loan?',
        answer:
          'No. Official APR disclosures follow lender and Regulation Z rules. This page is a simplified fixed-payment estimate for learning how fees can change the yearly cost.',
      },
      {
        question: 'Should I use this for credit card APR?',
        answer:
          'Not as the main tool. Credit cards can use daily balance methods, grace periods, cash advance APRs, promotional APRs, penalty APRs, and fees. Use this page for fixed loan examples, then check the actual card terms.',
      },
    ],
    formulaCheck:
      'For the default example, the note-rate payment is about $405.53 per month. If $600 in fees leaves $19,400 received, that same payment stream solves to about 9.30% APR.',
    resultReading:
      'Start with estimated APR, then compare it with note rate, fees included, amount received, and monthly payment. A larger gap usually means the fees matter more.',
    doubleCheck:
      'Check whether the fee is actually a finance charge, whether it is paid upfront or financed, and whether the loan has prepaid interest, points, insurance, variable rates, or lender-specific APR rules.',
    limitFollowup:
      'Use the lender Loan Estimate, Truth in Lending disclosure, Closing Disclosure, or written loan agreement for the official APR. This calculator is only a planning estimate.',
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
    seoTitle: 'VA Mortgage Calculator | Funding Fee And Payment',
    seoDescription:
      'Estimate a VA purchase loan payment with VA funding fee, financed-fee option, tax and insurance inputs, loan-to-value, and exemption cautions.',
    icon: 'calculator-mortgage',
    aliases: [
      'va loan calculator',
      'va mortgage payment calculator',
      'va funding fee calculator',
      'va home loan calculator',
    ],
    formula:
      'The calculator estimates a common VA purchase funding-fee rate from down payment and first-use status, adds the fee to the loan if selected, then calculates monthly mortgage payment.',
    limit:
      'This does not determine VA eligibility, Certificate of Eligibility status, funding-fee exemption, appraisal rules, entitlement, lender overlays, closing costs, seller concessions, tax treatment, or official loan terms.',
    useCases: [
      'Estimate payment on a VA purchase loan.',
      'Compare first-use, subsequent-use, down payment, and exemption scenarios.',
      'See the funding fee as a dollar amount.',
      'Screen monthly payment before lender quotes.',
    ],
    examples: [
      {
        label: 'First use, no down',
        expression: '$360,000 home, 6.25%, 30 years, first VA use, no down payment, funding fee financed',
        result: 'About $2,754.24/month with a $7,740 VA funding fee financed into a $367,740 loan',
      },
      {
        label: '5% down',
        expression: '$360,000 home, $18,000 down, 6.1%, 30 years, first VA use, funding fee financed',
        result: 'About $2,593.59/month with a 1.5% funding fee, or about $5,130',
      },
      {
        label: 'Exempt fee',
        expression: '$300,000 home, 6.3%, 30 years, no down payment, funding-fee exemption selected',
        result: 'About $2,281.92/month with no VA funding fee added',
      },
    ],
    relatedSlugs: ['mortgage-calculator', 'fha-loan-calculator', 'down-payment-calculator'],
    inputExplanations: [
      { term: 'Home price', meaning: 'the purchase price you want to test before any down payment.' },
      { term: 'Down payment', meaning: 'cash paid upfront. VA purchase loans can be no-down, but a down payment can lower the funding-fee rate.' },
      { term: 'First VA loan use', meaning: 'whether this is your first use of the VA home loan benefit. Later use can raise the no-down funding-fee rate.' },
      { term: 'Funding fee exempt', meaning: 'choose yes only when official VA or lender paperwork says the funding fee does not apply.' },
      { term: 'Finance funding fee', meaning: 'choose yes when the funding fee is rolled into the loan balance instead of paid at closing.' },
      { term: 'Tax and insurance', meaning: 'rough monthly escrow-style costs you enter so the payment estimate is closer to a real budget.' },
    ],
    priorityFaq: [
      {
        question: 'What VA funding fee rate does this calculator use?',
        answer:
          'For VA-backed purchase loans, it uses the official VA chart effective April 7, 2023: 2.15% for first use under 5% down, 3.3% for later use under 5% down, 1.5% at 5% down, and 1.25% at 10% down. If exemption is selected, the fee is $0.',
      },
      {
        question: 'What happens if I finance the VA funding fee?',
        answer:
          'The fee is added to the loan balance, so the monthly payment rises. For a $360,000 no-down first-use example, the 2.15% fee is $7,740 and the financed loan starts at $367,740.',
      },
      {
        question: 'Does this prove I qualify for a VA loan?',
        answer:
          'No. VA eligibility, your Certificate of Eligibility, lender credit rules, income review, appraisal, occupancy, entitlement, and exemption status all need official review.',
      },
    ],
    formulaCheck:
      'This is purchase-loan funding-fee logic. It is not an IRRRL, cash-out refinance, manufactured-home, NADL, assumption, or Vendee-loan calculator.',
    resultReading:
      'Start with total monthly payment, then read principal and interest, funding fee dollars, funding-fee rate, and loan-to-value. If the fee is financed, remember the loan balance is higher.',
    doubleCheck:
      'Check whether the lender is using first-use or subsequent-use status, whether you are fee-exempt, whether seller credits or concessions apply, and whether only the funding fee is being financed on a purchase loan.',
    limitFollowup:
      'Use your VA Certificate of Eligibility, lender Loan Estimate, Closing Disclosure, appraisal, entitlement review, and VA funding-fee rules before acting on the estimate.',
    extraFaq: [
      {
        question: 'Can I finance all VA closing costs?',
        answer:
          'For a VA purchase loan, the VA says you can finance only the VA funding fee into the loan amount. Other closing costs need to be paid at closing or handled through allowed credits and concessions.',
      },
      {
        question: 'Why can a VA loan have no monthly mortgage insurance?',
        answer:
          'The VA funding fee helps support the program, and VA-backed loans do not require monthly mortgage insurance. You still need to budget for taxes, insurance, fees, and lender rules.',
      },
    ],
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
    seoTitle: 'HELOC Calculator | Interest-Only, Repayment & CLTV',
    seoDescription:
      'Estimate HELOC draw-period interest-only payment, repayment payment, available equity, and CLTV with clear variable-rate and home-collateral cautions.',
    icon: 'calculator-loan',
    aliases: [
      'heloc payment calculator',
      'heloc amortization calculator',
      'interest-only heloc calculator',
      'home equity line of credit calculator',
      'heloc cltv calculator',
    ],
    formula:
      'The calculator estimates available equity as home value times max CLTV minus current mortgage balance. It computes draw-period interest-only payment from current draw times monthly rate, then estimates repayment payment by amortizing the current draw over the entered repayment years.',
    limit:
      'This is planning math only. HELOCs often have variable rates, teaser rates, index and margin terms, minimum draws, annual fees, transaction fees, lender freezes, balloon payments, repayment-period jumps, appraisal changes, tax limits, and home-collateral risk.',
    useCases: [
      'Estimate monthly interest-only payment on a current draw.',
      'Estimate repayment payment after the draw period.',
      'Check available equity against a line limit.',
      'Compare HELOC with a fixed home equity loan.',
    ],
    examples: [
      { label: '$30k draw', expression: '$450,000 home, $260,000 mortgage, $80,000 line, $30,000 drawn, 9%, 15-year repayment, 85% CLTV cap', result: '$225.00 interest-only estimate, about $304.28 repayment estimate, $122,500 available equity, and 64.44% CLTV on the draw' },
      { label: '$60k draw', expression: '$600,000 home, $350,000 mortgage, $120,000 line, $60,000 drawn, 8.75%, 20-year repayment, 85% CLTV cap', result: '$437.50 interest-only estimate, about $530.23 repayment estimate, $160,000 available equity, and 68.33% CLTV on the draw' },
      { label: '$10k draw', expression: '$380,000 home, $210,000 mortgage, $50,000 line, $10,000 drawn, 9.5%, 10-year repayment, 80% CLTV cap', result: '$79.17 interest-only estimate, about $129.40 repayment estimate, $94,000 available equity, and 57.89% CLTV on the draw' },
    ],
    relatedSlugs: ['home-equity-loan-calculator', 'loan-calculator', 'mortgage-calculator'],
    inputExplanations: [
      { term: 'Home value', meaning: 'the property value you want to test before any lender appraisal changes it.' },
      { term: 'Current mortgage balance', meaning: 'what you still owe on the first mortgage or other senior liens.' },
      { term: 'Credit line', meaning: 'the maximum line size you want to compare with the available-equity estimate.' },
      { term: 'Current draw', meaning: 'the amount already borrowed from the line, not the full line limit.' },
      { term: 'Interest rate', meaning: 'the rate used for the monthly estimate. Many HELOC rates can move over time.' },
      { term: 'Repayment period', meaning: 'the years used to estimate the later principal-and-interest payment.' },
      { term: 'Max combined LTV', meaning: 'the cap used to estimate possible borrowing room after the current mortgage.' },
    ],
    priorityFaq: [
      {
        question: 'What is the main HELOC payment this calculator shows?',
        answer:
          'The headline answer is the interest-only estimate for the current draw. If you have drawn $30,000 at 9%, the estimate is $225.00 per month before fees. That is not the same as the later repayment payment.',
      },
      {
        question: 'Why is the repayment payment higher than the interest-only payment?',
        answer:
          'During repayment, the calculator pays down the drawn balance over the repayment years. A $30,000 draw at 9% over 15 years is about $304.28 per month, which is higher than the $225.00 interest-only estimate because principal is being repaid too.',
      },
      {
        question: 'Does the calculator use the full credit line or the current draw?',
        answer:
          'It uses the current draw for the payment estimates. The credit line is shown separately because a $80,000 line with only $30,000 drawn should not be treated like $80,000 of borrowed money.',
      },
      {
        question: 'What does CLTV mean on a HELOC?',
        answer:
          'CLTV means combined loan-to-value. This page compares your current mortgage plus the current HELOC draw with the home value. It also estimates available equity from the max CLTV cap you enter.',
      },
      {
        question: 'Can my HELOC payment change later?',
        answer:
          'Yes. CFPB and FTC guidance both warn that HELOCs often have variable rates and different draw and repayment periods. A rate change, draw change, fee, freeze, balloon payment, or repayment-period switch can move the real payment.',
      },
      {
        question: 'Is HELOC interest tax deductible?',
        answer:
          'Do not assume it is. IRS Publication 936 says home equity loan or line interest is generally deductible only when the money is used to buy, build, or substantially improve the home securing the loan and the other rules are met.',
      },
    ],
    formulaCheck:
      'Available equity = home value x max CLTV - current mortgage balance. Interest-only payment = current draw x annual rate / 12. Repayment payment amortizes the current draw over the repayment years.',
    resultReading:
      'Read the interest-only estimate as a draw-period payment check, the repayment estimate as a later payment warning, and CLTV as a risk/borrowing-room screen.',
    doubleCheck:
      'Double-check the lender disclosure, draw period, repayment period, index and margin, rate cap, fees, minimum draw, appraisal value, freeze rules, balloon language, right to cancel, and whether the home is at risk if payments are missed.',
    limitFollowup:
      'Ask the lender how the payment changes if the rate rises, the draw grows, the draw period ends, or the line is frozen.',
    extraFaq: [
      {
        question: 'Can a lender freeze or lower a HELOC line?',
        answer:
          'It can happen in some situations. CFPB notes that lenders may freeze access if home value drops significantly or the borrower situation changes. This calculator cannot predict that.',
      },
      {
        question: 'Is a HELOC the same as a home equity loan?',
        answer:
          'No. A HELOC is a revolving line you may draw from more than once. A home equity loan is usually a lump sum. Use the Home Equity Loan Calculator when you want the fixed lump-sum version.',
      },
      {
        question: 'Does this calculator include HELOC fees?',
        answer:
          'No. It does not add application fees, annual fees, transaction fees, appraisal fees, title costs, or closing costs. Compare the written lender terms before treating two offers as equal.',
      },
      {
        question: 'Should I use a HELOC to pay off other debt?',
        answer:
          'Be careful. A HELOC can turn unsecured debt into debt backed by your home. A lower payment can be dangerous if the rate changes, the repayment period jumps, or missed payments put the home at risk.',
      },
    ],
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
    seoTitle: 'Rent vs. Buy Calculator | Rent Cost vs Home Cost',
    seoDescription:
      'Compare renting with buying and selling after your time horizon. See total rent cost, net buying cost, estimated sale proceeds, and the gap.',
    icon: 'calculator-rent',
    aliases: ['rent vs buy calculator', 'buy vs rent calculator', 'rent or buy calculator', 'home rent vs buy calculator'],
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
      { label: 'Seven-year compare', expression: '$2,100 rent vs $420,000 home for 7 years', result: 'Buying lower by about $35,454.79' },
      { label: 'Short stay', expression: '$1,800 rent vs $350,000 home for 3 years', result: 'Renting lower by about $17,067.74' },
      { label: 'Higher rent market', expression: '$3,200 rent vs $650,000 home for 10 years', result: 'Buying lower by about $203,266.72' },
    ],
    relatedSlugs: ['rent-calculator', 'mortgage-calculator', 'real-estate-calculator'],
    inputExplanations: [
      { term: 'Monthly rent', meaning: 'today\'s rent before the calculator applies the annual rent increase.' },
      { term: 'Annual rent increase', meaning: 'the percent rent grows each year in the renting side of the comparison.' },
      { term: 'Home price and down payment', meaning: 'the purchase price and upfront cash used to estimate the loan amount.' },
      { term: 'Mortgage rate and compare over years', meaning: 'the annual loan rate and the number of years you expect to keep the home before the modeled sale.' },
      { term: 'Property tax, insurance, and maintenance', meaning: 'the recurring ownership costs added to the mortgage payment.' },
      { term: 'Appreciation and selling cost', meaning: 'the home-value growth assumption and sale-cost percent used to estimate sale proceeds.' },
    ],
    extraFaq: [
      {
        question: 'What does buy minus rent mean?',
        answer:
          'Buy minus rent is net buying cost minus total rent cost. If it is negative, the calculator shows buying lower by the difference. If it is positive, the calculator shows renting lower by the difference.',
      },
      {
        question: 'Why can a short stay favor renting?',
        answer:
          'Selling costs, early mortgage interest, and the down payment can make buying look worse over a short horizon. A longer stay gives appreciation and loan payoff more time to affect the estimate.',
      },
      {
        question: 'Does this include opportunity cost?',
        answer:
          'No. It does not estimate what the down payment, closing cash, or monthly difference might earn if invested elsewhere. Add that separately before treating the result as a final decision.',
      },
      {
        question: 'Does this include PMI, HOA, repairs, or moving costs?',
        answer:
          'No. The simplified ownership side includes mortgage payment, property tax, insurance, and a maintenance percent. PMI, HOA dues, major repairs, moving costs, and local fees can change the result.',
      },
      {
        question: 'Why does the calculator include sale proceeds?',
        answer:
          'The comparison assumes you sell after the entered time horizon. Estimated sale proceeds subtract selling costs and remaining loan balance from the appreciated home value, then reduce the buying cost.',
      },
      {
        question: 'Is home appreciation guaranteed?',
        answer:
          'No. Appreciation is only an assumption. A lower appreciation rate, flat value, or price drop can move the comparison toward renting, especially if selling costs are high.',
      },
      {
        question: 'Should I use a real mortgage quote?',
        answer:
          'Yes when you have one. A quoted rate, property tax estimate, insurance quote, PMI estimate, HOA dues, and repair budget will be more useful than broad defaults.',
      },
    ],
    formulaCheck:
      'For the default example, projected rent is about $193,094.05. Net buying cost is about $157,639.26 after estimated sale proceeds, so buying is lower by about $35,454.79 in this simplified model.',
    resultReading:
      'Read the headline first, then compare total rent cost with net buying cost. Estimated sale proceeds and remaining loan balance explain why the buy side changes so much with appreciation, selling cost, and time horizon.',
    doubleCheck:
      'Check the stay length, rent-growth assumption, mortgage rate, down payment, property tax, insurance, maintenance percent, appreciation rate, selling cost, and whether the built-in 30-year mortgage assumption fits your scenario.',
    limitFollowup:
      'Before making a real housing decision, also add PMI, HOA dues, closing costs, tax effects, investment opportunity cost, repair timing, moving costs, school/work constraints, and the value of flexibility.',
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
    seoTitle: 'Present Value Calculator | Discount Future Money',
    seoDescription:
      'Discount a future lump sum and regular payment stream back to today. See lump-sum present value, annuity present value, and rate/timing limits.',
    icon: 'calculator-investment',
    aliases: [
      'pv calculator',
      'present value of money calculator',
      'discounted cash flow calculator',
      'annuity present value calculator',
      'lump sum present value calculator',
    ],
    formula:
      'The calculator discounts the future lump sum by the periodic discount rate, discounts regular payments as an ordinary annuity, then adds the lump-sum present value and payment-stream present value.',
    limit:
      'Present value depends heavily on the discount rate, payment frequency, and timing assumption. It does not include tax, fees, inflation surprises, default risk, liquidity needs, market volatility, changing cash flows, or professional investment advice.',
    useCases: [
      'Estimate what a future amount is worth today.',
      'Discount a regular payment stream.',
      'Compare different discount rates.',
      'Use with future value and IRR for planning math.',
    ],
    examples: [
      { label: 'Future plus payments', expression: '$10,000 future amount plus $200 monthly for 6 years at 5%', result: 'About $19,831.36 present value: $7,412.80 lump sum plus $12,418.56 payments' },
      { label: 'Lump sum only', expression: '$50,000 in 10 years at 6% with monthly periods', result: 'About $27,481.64 present value today' },
      { label: 'Annual payments', expression: '$5,000 annual payments for 8 years at 4%', result: 'About $33,663.72 annuity present value' },
    ],
    relatedSlugs: ['future-value-calculator', 'irr-calculator', 'investment-calculator'],
    inputExplanations: [
      { term: 'Future lump sum', meaning: 'the one-time future amount you want to discount back to today.' },
      { term: 'Regular payment', meaning: 'the repeated payment amount in each period, such as monthly or yearly cash flow.' },
      { term: 'Discount rate', meaning: 'the annual rate used to reduce future money to today dollars, entered as 5 for 5%.' },
      { term: 'Years', meaning: 'how long the future lump sum and payment stream run.' },
      { term: 'Payments per year', meaning: 'how often the regular payment occurs. Match this to the payment amount you enter.' },
    ],
    priorityFaq: [
      {
        question: 'What is present value?',
        answer:
          'Present value is an estimate of what future money is worth today after discounting it by the rate you choose. A higher discount rate usually makes the present value smaller.',
      },
      {
        question: 'How does this calculator handle regular payments?',
        answer:
          'It treats regular payments as end-of-period payments, also called an ordinary annuity. Payments made at the beginning of each period would usually have a slightly higher present value.',
      },
      {
        question: 'Should I enter an annual rate or a period rate?',
        answer:
          'Enter the annual discount rate as a percent. The calculator divides it by payments per year, so monthly payment streams use one-twelfth of the annual rate each month.',
      },
      {
        question: 'Why does a higher discount rate lower present value?',
        answer:
          'A higher discount rate says future money has to clear a higher return, risk, or opportunity-cost hurdle. That makes the same future cash flow worth less in today dollars.',
      },
      {
        question: 'Can present value prove an investment is good?',
        answer:
          'No. Present value is planning math. Real investments can change because of risk, fees, taxes, inflation, liquidity, missed payments, and changing market assumptions.',
      },
      {
        question: 'What is the difference between present value and future value?',
        answer:
          'Present value moves future money backward to today. Future value moves today money or payments forward to a later balance.',
      },
    ],
    formulaCheck:
      'For the default example, $10,000 discounted for 72 monthly periods at 5% annual is about $7,412.80. The $200 monthly payment stream is about $12,418.56, so the combined present value is about $19,831.36.',
    resultReading:
      'Estimated present value is the combined today-dollar estimate. Lump-sum present value shows the one-time future amount by itself. Payment stream present value shows the ordinary-annuity part by itself.',
    doubleCheck:
      'Check that the payment amount matches the payment frequency, the discount rate is annual, the years value matches the cash-flow horizon, and the future lump sum is not being double-counted with the regular payments.',
    limitFollowup:
      'Use a full cash-flow model, exact payment dates, tax and fee assumptions, inflation expectations, risk review, liquidity needs, and professional advice before valuing a real contract, investment, loan, or settlement.',
  },
  {
    slug: 'future-value-calculator',
    name: 'Future Value Calculator',
    summary: 'Estimate future value of a starting amount and regular payments.',
    description:
      'Use this free future value calculator to project a starting amount and regular payments forward with an entered rate, time period, and payment frequency.',
    seoTitle: 'Future Value Calculator | Savings Growth & Payments',
    seoDescription:
      'Estimate future value from a starting amount, regular payments, annual rate, years, and payment frequency. See ending balance, contributions, and growth.',
    icon: 'calculator-finance',
    aliases: [
      'future value calculator',
      'fv calculator',
      'future savings calculator',
      'savings future value calculator',
      'investment future value calculator',
    ],
    formula:
      'The calculator compounds the starting amount and compounds each regular payment using the selected payment frequency, then adds both future value parts.',
    limit:
      'This assumes a steady rate and end-of-period payment timing. It does not include market volatility, taxes, fees, missed or changing payments, inflation, account rules, sequence risk, or investment advice.',
    useCases: [
      'Project a savings or investment balance.',
      'Compare payment frequencies and return assumptions.',
      'Separate growth from total contributions.',
      'Use alongside present value for time-value math.',
    ],
    examples: [
      { label: 'Monthly saving', expression: '$5,000 start plus $250 monthly for 10 years at 6%', result: 'About $50,066.82 future value, with $35,000.00 contributed' },
      { label: 'No new payments', expression: '$20,000 compounded for 8 years at 5%', result: 'About $29,811.71 lump-sum future value' },
      { label: 'Annual contribution', expression: '$10,000 start plus $3,000 per year for 12 years at 7%', result: 'About $76,187.27 future value, with $46,000.00 contributed' },
    ],
    relatedSlugs: ['present-value-calculator', 'compound-interest-calculator', 'investment-calculator'],
    inputExplanations: [
      { term: 'Starting amount', meaning: 'the balance you already have before new payments and modeled growth.' },
      { term: 'Regular payment', meaning: 'the amount added each period. Match this to the selected payment frequency.' },
      { term: 'Interest / return rate', meaning: 'the annual rate entered as a normal percent, such as 6 for 6%.' },
      { term: 'Years', meaning: 'how long the projection runs. The calculator rounds the number of payment periods from years times payments per year.' },
      { term: 'Payments per year', meaning: 'how often the regular payment is made, such as 12 for monthly or 1 for yearly.' },
    ],
    priorityFaq: [
      {
        question: 'What is future value?',
        answer:
          'Future value is the projected ending balance after a starting amount and any regular payments grow over time at the rate you enter. It is a planning estimate, not a promise of actual investment performance.',
      },
      {
        question: 'How does this calculator handle regular payments?',
        answer:
          'It treats regular payments as end-of-period payments, similar to an ordinary annuity. A payment made at the beginning of each period would usually grow slightly more because it has one extra period to compound.',
      },
      {
        question: 'Should I enter an annual rate or a monthly rate?',
        answer:
          'Enter the annual rate as a percent. The calculator divides that rate by the payment frequency, so monthly payments use one-twelfth of the annual rate in each monthly period.',
      },
      {
        question: 'Does future value include inflation, taxes, or fees?',
        answer:
          'No. The result is a before-tax, before-fee projection in today-dollar terms. Inflation, taxes, account fees, contribution limits, and market losses can all change the real buying power or final account value.',
      },
      {
        question: 'What is the difference between future value and present value?',
        answer:
          'Future value moves money forward to estimate a later balance. Present value moves future money backward to estimate what it is worth today at a chosen discount rate.',
      },
      {
        question: 'Can I use this for investments as well as savings?',
        answer:
          'Yes, as a simple scenario test. For investing, treat the rate as an assumption and compare several rates because actual returns can move up, down, or arrive in a different order than the calculator assumes.',
      },
    ],
    formulaCheck:
      'For the default example, $5,000 plus $250 monthly for 10 years at 6% projects about $50,066.82, with $35,000.00 contributed and about $15,066.82 modeled growth.',
    resultReading:
      'Start with estimated future value, then compare principal growth, payment growth, total contributions, and estimated growth. That split shows whether the starting balance, the payment stream, or the rate assumption is carrying the result.',
    doubleCheck:
      'Check that the rate is annual, payment frequency matches the payment amount, years are entered as years, and the percent is entered as 6 for 6%, not 0.06.',
    limitFollowup:
      'For savings, compare the account APY and rules. For investing, compare taxes, fees, inflation, risk, contribution limits, and whether a steady return assumption is realistic.',
  },
  {
    slug: 'commission-calculator',
    name: 'Commission Calculator',
    summary: 'Estimate commission, split amount, and total pay from sales, rate, base pay, and bonus.',
    description:
      'Use this free commission calculator to estimate gross commission, split commission, and total pay from sales amount, commission rate, split, base pay, and bonus.',
    seoTitle: 'Commission Calculator | Gross, Split & Total Pay',
    seoDescription:
      'Estimate gross commission, your split amount, and total pay from sales amount, commission rate, split percent, base pay, and bonus.',
    icon: 'calculator-margin',
    aliases: ['sales commission calculator', 'commission pay calculator', 'split commission calculator', 'base plus commission calculator'],
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
      { label: 'Sales commission', expression: '$50,000 sale at 3%', result: 'Gross commission is $1,500.00 and total pay is $1,500.00' },
      { label: 'Split commission', expression: '$750,000 sale at 2.5% with 50% split', result: 'Gross commission is $18,750.00 and your split is $9,375.00' },
      { label: 'Base plus bonus', expression: '$120,000 sale at 1.25% plus $2,500 base and $500 bonus', result: 'Total pay is $4,500.00' },
    ],
    relatedSlugs: ['salary-calculator', 'margin-calculator', 'take-home-paycheck-calculator'],
    inputExplanations: [
      { term: 'Sales amount', meaning: 'the sale, revenue, production value, or gross amount your commission plan is based on.' },
      { term: 'Commission rate', meaning: 'the commission percent written as a normal percent, such as 3 for 3% rather than 0.03.' },
      { term: 'Your split', meaning: 'the share of gross commission you keep when the commission is shared with another rep, team, broker, or company.' },
      { term: 'Base pay', meaning: 'fixed pay you want added to the commission estimate for the same pay period.' },
      { term: 'Bonus', meaning: 'an extra flat amount you want included with commission and base pay in the total-pay line.' },
    ],
    priorityFaq: [
      {
        question: 'How do I calculate a 3% commission on $50,000?',
        answer:
          'Multiply $50,000 by 3%, or 0.03. The gross commission is $1,500. If your split is 100% and there is no base pay or bonus, the total pay estimate is also $1,500.',
      },
      {
        question: 'What does split percent mean on a commission?',
        answer:
          'Split percent is the share of the gross commission you receive. If a sale creates $18,750 gross commission and your split is 50%, your split amount is $9,375 before base pay, bonus, tax, or company adjustments.',
      },
      {
        question: 'Can I use this for base plus commission pay?',
        answer:
          'Yes. Enter the commission sale and rate first, then add base pay and bonus for the same pay period. The total-pay line adds your split commission, base pay, and bonus together.',
      },
      {
        question: 'Does this handle tiered commission rates or accelerators?',
        answer:
          'No. This is a single-rate commission calculator. If your plan has quota tiers, accelerators, caps, draws, or different rates by product, calculate each tier separately or use the written plan formula.',
      },
      {
        question: 'Does this include payroll tax or withholding?',
        answer:
          'No. The result is a gross pay estimate before payroll tax, withholding, benefit deductions, expense offsets, or local employer rules. Use a paycheck calculator when you need take-home pay.',
      },
      {
        question: 'What if a sale is cancelled, refunded, or charged back?',
        answer:
          'This calculator does not decide chargebacks, clawbacks, cancellations, collections timing, or when a commission becomes payable. Check the written commission plan and payroll rules.',
      },
      {
        question: 'Is the calculator result proof the commission is owed?',
        answer:
          'No. It is only the arithmetic for the numbers entered. Whether commission is earned, owed, payable, or recoverable depends on the actual agreement, company policy, and applicable rules.',
      },
    ],
    formulaCheck:
      'For example, $50,000 x 3% = $1,500 gross commission; if a 50% split applies, your split would be $750 before base pay or bonus.',
    resultReading:
      'Read gross commission first, then your split amount, then total pay. Gross commission shows the sale times the rate, split amount shows your share, and total pay adds any base pay or bonus you entered.',
    doubleCheck:
      'Check whether your plan uses booked sales, collected revenue, gross profit, net margin, product category, or paid invoices. Also check whether the rate should be entered as a normal percent such as 3 for 3%.',
    limitFollowup:
      'A written commission plan or payroll system can change the final amount, especially when there are tiers, draws, chargebacks, caps, or tax withholding.',
  },
  {
    slug: 'mortgage-calculator-uk',
    name: 'Mortgage Calculator UK',
    summary: 'Estimate a UK repayment mortgage from property price, deposit, rate, term, and monthly fees.',
    description:
      'Estimate UK monthly mortgage repayments from property price, deposit, rate, term, and recurring fees, with loan amount, LTV, and total interest.',
    seoTitle: 'Mortgage Calculator UK | Repayments, LTV & Deposit',
    seoDescription:
      'Estimate UK monthly mortgage repayments from price, deposit, rate and term. See a £300,000 example, LTV, total interest and key limits.',
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
    leadFaq: [
      {
        question: 'When should I use this UK mortgage calculator?',
        answer:
          'Use it when you want a quick repayment estimate from property price, deposit, rate, term, and monthly fees. The £300,000 example shows the monthly repayment, loan amount, LTV, and total interest this page returns.',
      },
      {
        question: 'What do the main UK mortgage calculator inputs mean?',
        answer:
          'Start with property price and deposit, then add the annual rate and repayment term. Add monthly fees only when the charge repeats every month; keep stamp duty, legal fees, surveys, insurance, and one-off product fees outside this field unless you are testing them separately.',
      },
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
    seoTitle: 'Percent Off Calculator | Sale Price, Savings & Tax',
    seoDescription:
      'Calculate final sale price, savings, effective discount, and optional sales tax after one or two percent-off discounts. Check why stacked discounts do not simply add.',
    icon: 'calculator-discount',
    aliases: [
      'sale price calculator',
      'percent off sale calculator',
      'discount percent calculator',
      'coupon discount calculator',
      'stacked discount calculator',
      'price after discount calculator',
    ],
    formula:
      'The calculator subtracts the first discount from the original price, applies the optional second discount to that reduced subtotal, then adds tax to the discounted subtotal if a tax rate is entered.',
    limit:
      'Retail totals can differ because of coupon exclusions, fixed-dollar coupons, shipping, minimum spend rules, price matching, fees, returns, rounding, and local tax treatment.',
    useCases: [
      'Calculate a final sale price.',
      'Stack two percent-off discounts correctly.',
      'Estimate tax after discounts.',
      'See total savings and effective discount.',
    ],
    examples: [
      { label: 'Sale plus tax', expression: '$80 with 25% off, extra 10% off, and 7.5% tax', result: '$58.05 final price, $26.00 saved before tax, 32.5% effective discount' },
      { label: 'Half off', expression: '$120 with 50% off, no extra discount, no tax', result: '$60.00 sale price and $60.00 saved before tax' },
      { label: 'Stacked sale', expression: '$200 with 30% then 15% off and 6% tax', result: '$126.14 final price, $81.00 saved before tax, 40.5% effective discount' },
    ],
    relatedSlugs: ['discount-calculator', 'percentage-calculator', 'sales-tax-calculator'],
    inputExplanations: [
      { term: 'Original price', meaning: 'the tag price before the store applies the percent-off discount.' },
      { term: 'Percent off', meaning: 'the first discount rate, entered as 25 for 25%, not 0.25.' },
      { term: 'Extra percent off', meaning: 'an optional second discount applied to the already-reduced subtotal.' },
      { term: 'Tax rate', meaning: 'an optional sales tax rate applied after the discounts, if you want an after-tax estimate.' },
    ],
    priorityFaq: [
      {
        question: 'Do two percent-off discounts add together?',
        answer:
          'Usually no. A 25% discount followed by an extra 10% discount is not 35% off the original price. The second discount applies to the reduced subtotal, so the $80 example becomes $54 before tax and saves $26, which is a 32.5% effective discount.',
      },
      {
        question: 'Is tax calculated before or after the discount?',
        answer:
          'This calculator adds tax after the percent-off discounts. That matches many checkout totals, but local tax rules and store systems can vary, especially with coupons, fees, shipping, or special promotions.',
      },
      {
        question: 'What is effective discount?',
        answer:
          'Effective discount is the real percent saved from the original price after all percent-off discounts are applied. It helps you compare stacked discounts without pretending each percent can be added directly.',
      },
      {
        question: 'Can I use this for coupon stacking?',
        answer:
          'Use it for one or two percentage coupons. It does not handle fixed-dollar coupons, buy-one-get-one deals, reward credits, minimum-spend rules, or exclusions that remove an item from the promotion.',
      },
      {
        question: 'How do I calculate 40% off plus another 20% off?',
        answer:
          'Apply 40% off first, then apply 20% to the reduced price. On a $100 item, 40% off leaves $60. Another 20% off removes $12, leaving $48 before tax. The effective discount is 52%, not 60%.',
      },
    ],
    formulaCheck:
      'For the $80 example, 25% off removes $20 and leaves $60. The extra 10% discount removes $6 from $60, leaving $54. Tax at 7.5% adds $4.05, so the final estimate is $58.05.',
    resultReading:
      'Read final sale price first if you care about checkout cost. Then check savings before tax and effective discount so you can see the real markdown before tax is added.',
    doubleCheck:
      'Check that you entered 25 for 25%, not 0.25, and that the second discount is supposed to stack. Also check whether tax, shipping, or fees should be included before copying the result.',
    limitFollowup:
      'Store rules can exclude brands, sale items, shipping, taxes, gift cards, or fixed-dollar coupons, so treat the calculator as a math check rather than proof of the final receipt.',
    extraFaq: [
      {
        question: 'Why is the after-tax final price higher than the discounted subtotal?',
        answer:
          'The discounted subtotal is the price after percent-off discounts. If you enter a tax rate, the calculator adds tax to that subtotal, so the final price can be higher than the sale price shown before tax.',
      },
      {
        question: 'Should I use this or the Discount Calculator?',
        answer:
          'Use this page for quick percent-off retail math with one or two percentage discounts. Use the Discount Calculator when you want broader discount wording or a more general comparison.',
      },
    ],
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
    summary: 'Compare simple interest and compound interest from principal, annual rate, time, and deposits.',
    description:
      'Compare simple interest and compound interest from principal, annual interest rate, time in years, compounding frequency, and monthly deposits.',
    seoTitle: 'Interest Calculator | Simple & Compound Interest',
    seoDescription:
      'Compare simple and compound interest from principal, annual interest rate, years, compounding frequency, and monthly deposits.',
    icon: 'calculator-interest',
    aliases: [
      'interest calculator',
      'interest calculator formula',
      'simple interest calculator',
      'compound interest calculator',
      'monthly compound interest calculator',
      'bank interest calculator',
      'loan interest calculator',
    ],
    formula:
      'Simple interest multiplies principal by annual interest rate and time. Compound interest grows the balance by the selected compounding frequency, then adds monthly deposits in the estimate.',
    limit:
      'This is interest math only. It does not include APR fees, taxes, penalties, minimum balances, bank APY rules, investment risk, loan payment schedules, daily balance billing, promotional rates, or lender disclosures.',
    useCases: [
      'Compare simple interest with compound interest.',
      'Estimate interest earned on savings or interest charged on a balance.',
      'Test how contribution size and time change compound growth.',
      'Check whether a question belongs in the simple mode, compound mode, investment calculator, or loan calculator.',
    ],
    examples: [
      { label: 'Simple interest', expression: '$1,000 at 5% for 3 years', result: '$150 interest and $1,150 ending balance' },
      { label: 'Compound growth', expression: '$2,500 at 5% for 8 years, compounded quarterly', result: 'About $3,720.33 ending balance' },
      { label: 'Monthly deposits', expression: '$1,000 plus $100/month at 6% for 10 years', result: 'About $18,207.33 ending balance' },
    ],
    relatedSlugs: ['compound-interest-calculator', 'investment-calculator', 'interest-rate-calculator'],
    inputExplanations: [
      { term: 'Principal', meaning: 'the starting amount before new interest or deposits are added.' },
      { term: 'Annual interest rate', meaning: 'the yearly rate entered as a normal percent, such as 5 for 5%.' },
      { term: 'Time in years', meaning: 'how long the estimate runs. Use 1.5 for 18 months or 0.25 for 3 months.' },
      { term: 'Compounding frequency', meaning: 'how often interest is added back to the balance in compound mode.' },
      { term: 'Monthly deposits', meaning: 'extra money added each month in compound mode.' },
    ],
    priorityFaq: [
      {
        question: 'Should I choose simple or compound interest?',
        answer:
          'Choose simple interest when interest is based only on the original principal. Choose compound interest when interest gets added back to the balance and can earn more interest later.',
      },
      {
        question: 'Why does the compound result grow faster?',
        answer:
          'Compound interest starts each new period from a bigger balance. For example, $2,500 at 5% for 8 years with quarterly compounding grows to about $3,720.33 before taxes, fees, or withdrawals.',
      },
      {
        question: 'Is annual interest rate the same as APR or APY?',
        answer:
          'No. The annual interest rate is the rate used by this calculator. APR can include certain loan fees, and APY reflects compounding on deposit accounts. Check the real disclosure when the exact legal or bank number matters.',
      },
    ],
    formulaCheck:
      'If the answer looks strange, check that the rate is annual, the time is in years, and the compound mode uses the compounding frequency you meant.',
    resultReading:
      'In simple mode, read interest and ending balance separately. In compound mode, compare ending balance, total contributions, estimated interest, and effective annual rate so deposits are not confused with growth.',
    doubleCheck:
      'Double-check annual rate, time in years, compounding frequency, and whether you are trying to estimate savings growth, loan interest, APR, APY, or investment return.',
    limitFollowup:
      'For loans, compare the lender APR and payment schedule. For bank accounts, compare the stated APY and account rules. For investing, remember the return is not guaranteed.',
  }),
  makeFinanceTool({
    slug: 'payment-calculator',
    name: 'Payment Calculator',
    summary: 'Estimate a fixed loan payment from amount financed, rate, and term.',
    description:
      'Use this free payment calculator to estimate a fixed monthly payment, total paid, and total interest for a simple amortized loan.',
    seoTitle: 'Payment Calculator | Fixed Loan Monthly Payment',
    seoDescription:
      'Estimate a fixed monthly payment from amount financed, interest rate, and term. See total paid, total interest, limits, and payment-only traps.',
    icon: 'calculator-payment',
    aliases: [
      'payment calculator',
      'monthly payment calculator',
      'loan payment calculator',
      'payment calculator with interest',
      'car payment calculator',
      'house payment calculator',
    ],
    formula:
      'The calculator divides the annual interest rate by 12, counts the monthly payments from the term, then uses the fixed-payment amortization formula.',
    limit:
      'This is fixed-rate payment math only. It does not include APR fees, taxes, insurance, PMI, escrow, student-loan repayment plans, car add-ons, variable rates, balloon payments, late fees, or lender approval.',
    useCases: [
      'Estimate a monthly payment before comparing loan offers.',
      'Check how rate and term changes move monthly payment and total interest.',
      'See why a lower monthly payment can still cost more over time.',
      'Use a simple fixed-rate estimate before checking APR, fees, and the written offer.',
    ],
    examples: [
      { label: 'Small balance', expression: '$5,000 at 8% for 3 years', result: 'About $156.68/month, $5,640.55 total paid, and $640.55 interest' },
      { label: 'Longer term', expression: '$15,000 at 10% for 5 years', result: 'About $318.71/month, $19,122.34 total paid, and $4,122.34 interest' },
      { label: 'Rate comparison', expression: '$20,000 for 4 years at 6% vs 9%', result: '$469.70/month vs $497.70/month, before fees or add-ons' },
    ],
    relatedSlugs: ['loan-calculator', 'apr-calculator', 'amortization-calculator'],
    inputExplanations: [
      { term: 'Amount financed', meaning: 'the balance used for the payment formula. It may be different from the sticker price or cash you receive after fees.' },
      { term: 'Interest rate', meaning: 'the annual rate used for payment math. APR can be higher when fees are included.' },
      { term: 'Term', meaning: 'how many years the payment is spread over. A longer term can lower the payment but raise total interest.' },
    ],
    priorityFaq: [
      {
        question: 'What does the Payment Calculator estimate?',
        answer:
          'It estimates a fixed monthly payment, total paid, and total interest from amount financed, annual interest rate, and term. It is useful for a quick loan-payment check, not for a final lender quote.',
      },
      {
        question: 'Why can a lower monthly payment still cost more?',
        answer:
          'A longer term spreads the balance over more months, so the payment can look easier. The tradeoff is that interest has more time to build, so the total paid can be higher.',
      },
      {
        question: 'Is interest rate the same as APR?',
        answer:
          'No. The interest rate is used for the payment estimate. APR can include certain loan fees, so it is usually the better number for comparing written loan offers.',
      },
      {
        question: 'Does this include taxes, insurance, or escrow?',
        answer:
          'No. For a mortgage, principal and interest may be only part of the monthly bill. Taxes, insurance, PMI, HOA fees, and escrow can make the real payment higher.',
      },
    ],
    extraFaq: [
      {
        question: 'Can I use this as a car payment calculator?',
        answer:
          'Yes for the basic financed amount, rate, and term. It does not add sales tax, title fees, warranties, GAP coverage, trade-in details, or dealer add-ons unless you already included them in the amount financed.',
      },
      {
        question: 'What should I check before trusting the result?',
        answer:
          'Check the written APR, fees, loan term, total amount financed, monthly payment, late fees, prepayment rules, variable-rate rules, and any costs this simple estimate leaves out.',
      },
    ],
    formulaCheck:
      'If the answer looks off, check that the amount financed is not the full purchase price by mistake, the rate is entered as a percent, and the term is in years.',
    resultReading:
      'Read the monthly payment with total paid and total interest. Do not choose a loan from the payment alone, because a longer term can make the monthly number smaller while raising the total cost.',
    doubleCheck:
      'Double-check amount financed, interest rate vs APR, term length, fees, taxes, insurance, add-ons, escrow, and whether the loan is fixed-rate.',
    limitFollowup:
      'Use the APR Calculator when fees matter, the Loan Calculator when you want a broader loan view, and the Amortization Calculator when you want the month-by-month balance.',
  }),
  makeFinanceTool({
    slug: 'retirement-calculator',
    name: 'Retirement Calculator',
    summary: 'Project retirement savings from current balance, monthly contributions, and return.',
    description:
      'Use this free retirement calculator to project future savings, total contributions, estimated growth, and the gap to a retirement target.',
    seoTitle: 'Retirement Calculator | Savings Goal Projection',
    seoDescription:
      'Project retirement savings from current balance, monthly contributions, estimated return, and years. See total contributions, growth, and target gap.',
    icon: 'calculator-retirement',
    aliases: [
      'retirement savings calculator',
      'retirement planning calculator',
      'retirement calculator with monthly contributions',
      'retirement goal calculator',
      'retirement savings projection',
    ],
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
      {
        label: 'Early saver',
        expression: '$25,000 saved, $500/month, 7%, 25 years',
        result: 'About $548,171.30 projected, with a $451,828.70 gap to a $1,000,000 target',
      },
      {
        label: 'Catch-up view',
        expression: '$80,000 saved, $900/month, 6%, 15 years',
        result: 'About $458,064.33 projected, with a $291,935.67 gap to a $750,000 target',
      },
      {
        label: 'Conservative return',
        expression: '$50,000 saved, $400/month, 4%, 20 years',
        result: 'About $257,838.95 projected, with a $342,161.05 gap to a $600,000 target',
      },
    ],
    inputExplanations: [
      { term: 'Current savings', meaning: 'the retirement money already saved before this projection starts.' },
      { term: 'Monthly contribution', meaning: 'the amount added at the end of each month in this simple model.' },
      { term: 'Estimated return', meaning: 'the annual growth assumption. It is not guaranteed and real markets can lose money.' },
      { term: 'Years to grow', meaning: 'how long the projection runs before comparing the balance with the target.' },
      { term: 'Target amount', meaning: 'the savings goal used to show whether the projection is above target or still has a gap.' },
    ],
    priorityFaq: [
      {
        question: 'How does the Retirement Calculator handle monthly contributions?',
        answer:
          'It converts the annual return assumption into monthly growth, compounds the current savings, then adds each monthly contribution at the end of the month. That timing makes the answer a planning estimate, not an account statement.',
      },
      {
        question: 'Does this include inflation or withdrawals?',
        answer:
          'No. The projection shows a future balance from savings going in. It does not reduce the result for inflation, retirement spending, withdrawals, required minimum distributions, taxes, or account fees.',
      },
      {
        question: 'What does the target gap mean?',
        answer:
          'The target gap is the target amount minus the projected balance. A gap does not mean the plan failed; it means the entered savings, contribution, return, and time assumptions do not reach that target in this simplified model.',
      },
    ],
    formulaCheck:
      'For the starter example, $25,000 plus $500 each month at a 7% annual return for 25 years projects about $548,171.30. The calculator shows $175,000.00 of contributions, about $373,171.30 of estimated growth, and a $451,828.70 target gap.',
    resultReading:
      'Start with projected retirement savings, then compare total contributions with estimated growth. The target gap or above-target line explains how far the projection is from the goal you entered.',
    doubleCheck:
      'Check current savings, monthly contribution, estimated return, years to grow, and target amount. Then separately review inflation, taxes, fees, contribution limits, withdrawals, market losses, Social Security, pensions, and account rules.',
    limitFollowup:
      'Use the Inflation Calculator to test buying power, the 401K Calculator for workplace contribution and match details, and an official account or adviser source before relying on the result.',
    extraFaq: [
      {
        question: 'Is the estimated return guaranteed?',
        answer:
          'No. The return is only the rate you enter for scenario math. Real investments can rise, fall, charge fees, or produce very uneven yearly results.',
      },
      {
        question: 'Should I include Social Security or pension income here?',
        answer:
          'No. This page projects a savings balance. Social Security, pension income, annuity payouts, retirement spending, taxes, and withdrawal timing need separate estimates.',
      },
      {
        question: 'Can this tell me exactly how much I need to retire?',
        answer:
          'No. It can compare one savings scenario with one target. A real retirement number can depend on spending, location, health costs, taxes, inflation, investment risk, benefits, debt, and family needs.',
      },
    ],
    relatedSlugs: ['investment-calculator', 'compound-interest-calculator', 'inflation-calculator'],
  }),
  makeFinanceTool({
    slug: 'amortization-calculator',
    name: 'Amortization Calculator',
    summary: 'Estimate payoff time, total interest, and extra-payment savings.',
    description:
      'Use this free amortization calculator to estimate scheduled payment, payoff time, total interest, and savings from extra monthly payments.',
    seoTitle: 'Amortization Calculator | Loan Payoff & Interest Savings',
    seoDescription:
      'Estimate a fixed loan amortization schedule, monthly payment, payoff time, total interest, and extra-payment savings before checking lender rules.',
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
      { label: 'Extra payment', expression: '$200,000 at 6%, 30 years, +$100/month', result: 'About 295 months, 65 months faster, and $49,138.41 interest saved' },
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
    seoTitle: 'Inflation Calculator | Future Cost & Buying Power',
    seoDescription:
      'Estimate future cost and present buying power from an amount, annual inflation rate, and years. See the increase and inflation multiplier.',
    icon: 'calculator-inflation',
    aliases: [
      'future cost calculator',
      'buying power calculator',
      'inflation adjustment calculator',
      'cost of living inflation calculator',
      'inflation rate calculator',
      'present buying power calculator',
    ],
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
      { label: 'Future cost', expression: '$100 at 3% inflation for 10 years', result: 'About $134.39 future cost, $34.39 increase, and 1.343916x multiplier' },
      { label: 'Buying power', expression: '$1,000 at 4% inflation for 5 years', result: 'About $1,216.65 future cost and $821.93 present buying power' },
      { label: 'Planning scenario', expression: '$2,500 monthly expenses at 2.5% inflation for 15 years', result: 'About $3,620.75 future monthly cost' },
    ],
    relatedSlugs: ['investment-calculator', 'retirement-calculator', 'compound-interest-calculator'],
    inputExplanations: [
      { term: 'Amount', meaning: 'the cost, budget, savings amount, or fixed dollar figure you want to adjust for the chosen inflation rate.' },
      { term: 'Inflation rate', meaning: 'the annual rate you want to test, entered as 3 for 3%, not 0.03.' },
      { term: 'Years', meaning: 'how many years the same annual inflation rate is applied before the future-cost and buying-power results are shown.' },
    ],
    formulaCheck:
      '$100 at 3% inflation for 10 years uses 1.03^10, or about 1.343916. The future cost is about $134.39, the increase is about $34.39, and the present buying power is about $74.41.',
    resultReading:
      'Estimated future cost shows what the entered amount could cost after the chosen rate and years. Present buying power shows what that same fixed amount is worth in today-style dollars. Increase is the added cost, and multiplier shows the inflation factor.',
    doubleCheck:
      'Check whether the amount is one-time, monthly, or yearly. Then check the inflation rate, the number of years, and whether you are modeling broad inflation or a specific item that may rise faster or slower.',
    limitFollowup:
      'Use BLS CPI tables, current local prices, contract terms, tax rules, wage assumptions, investment returns, and a real budget before treating an inflation estimate as a decision number.',
    priorityFaq: [
      {
        question: 'What does future cost mean?',
        answer:
          'Future cost estimates what the amount may cost after applying the same annual inflation rate for the years entered. For example, $100 at 3% for 10 years becomes about $134.39.',
      },
      {
        question: 'What does present buying power mean?',
        answer:
          'Present buying power works the other direction. It asks what a fixed future amount is worth in today-style dollars after inflation. In the default example, $100 has about $74.41 of present buying power after 10 years at 3%.',
      },
      {
        question: 'Does this use historical CPI data?',
        answer:
          'No. This calculator uses the inflation rate you enter. It does not fetch historical CPI, city CPI, category CPI, or official forecasts. Use BLS inflation data when you need official price-index history.',
      },
      {
        question: 'Can I enter negative inflation?',
        answer:
          'Yes, as long as the rate is greater than -100%. A negative rate models deflation for the chosen scenario. Real deflation can be uneven, so treat it as a what-if test.',
      },
    ],
    extraFaq: [
      {
        question: 'Why can one item rise faster than the inflation result?',
        answer:
          'Broad inflation averages many prices. Rent, groceries, tuition, insurance, medical costs, and used cars can move differently from the overall rate, so one category can rise faster or slower.',
      },
      {
        question: 'How should I choose an inflation rate?',
        answer:
          'Use an official CPI history source, a budget assumption, or a conservative scenario range. Testing 2%, 3%, and 5% can be more useful than pretending one rate is certain.',
      },
      {
        question: 'Does this include taxes, fees, income growth, or investment returns?',
        answer:
          'No. It only adjusts the entered amount for the inflation rate and years. Taxes, fees, wages, investment returns, benefit increases, and changing spending habits can all change the real plan.',
      },
    ],
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
    seoTitle: 'Compound Interest Calculator | Deposits, Rate & Growth',
    seoDescription:
      'Estimate future value from principal, monthly deposits, annual rate, years, and compounding frequency. See contributions, interest, and effective annual rate.',
    icon: 'calculator-compound',
    aliases: [
      'compound interest calculator',
      'monthly compound interest calculator',
      'compound growth calculator',
      'future value compound interest calculator',
      'daily compound interest calculator',
    ],
    formula:
      'The calculator converts the stated annual rate to an effective monthly growth rate from the selected compounding frequency, then compounds principal and monthly deposits.',
    limit:
      'This is a simple growth estimate. It does not include APY disclosures, taxes, fees, withdrawals, minimum balances, changing rates, investment losses, account limits, inflation, or bank-specific compounding rules.',
    useCases: [
      'Estimate how compound interest can grow savings over time.',
      'Compare monthly deposits with a starting amount.',
      'Test annual, quarterly, monthly, or daily compounding assumptions.',
      'Separate contributions from estimated interest earned.',
    ],
    examples: [
      { label: 'Savings growth', expression: '$1,000, $100/month, 6%, 10 years', result: 'About $18,207.33 ending balance, with $13,000 contributed and about $5,207.33 interest' },
      { label: 'Daily compounding', expression: '$5,000 at 4.5% for 10 years, daily', result: 'About $7,841.34 ending balance and about 4.60% effective annual rate' },
      { label: 'No deposits', expression: '$10,000 at 5% for 20 years, monthly', result: 'About $27,126.40 ending balance and about $17,126.40 interest' },
    ],
    relatedSlugs: ['interest-calculator', 'investment-calculator', 'retirement-calculator'],
    inputExplanations: [
      { term: 'Initial amount', meaning: 'the starting balance before new deposits and compound growth.' },
      { term: 'Monthly contribution', meaning: 'the amount added each month in this simple model. The calculator treats deposits as end-of-month additions.' },
      { term: 'Annual rate', meaning: 'the stated yearly rate entered as a normal percent, such as 6 for 6%.' },
      { term: 'Time', meaning: 'how many years the estimate runs. Use 0.5 for 6 months or 1.5 for 18 months.' },
      { term: 'Compounding frequency', meaning: 'how often interest is added back to the balance before the monthly contribution timing is modeled.' },
    ],
    priorityFaq: [
      {
        question: 'How does compound interest work in this calculator?',
        answer:
          'Interest is added back to the balance, then the larger balance can earn more interest later. The calculator first converts your annual rate through the compounding frequency you choose, then applies monthly growth and monthly deposits.',
      },
      {
        question: 'Are monthly deposits added at the start or end of the month?',
        answer:
          'This model treats monthly deposits as end-of-month contributions. That is a clean planning assumption, but a real bank, brokerage, or savings app can use different timing.',
      },
      {
        question: 'What is effective annual rate?',
        answer:
          'Effective annual rate shows the modeled one-year effect after compounding. For example, a stated 6% annual rate compounded monthly becomes about 6.17% effective annual growth before taxes, fees, or account rules.',
      },
      {
        question: 'Is this the same as APY?',
        answer:
          'No. APY is the official account disclosure from a bank or credit union. This calculator estimates compounding from the numbers you enter, but the real APY, exact compounding, fees, balance tiers, and withdrawal rules come from the account agreement.',
      },
    ],
    formulaCheck:
      'For the default example, $1,000 plus $100 each month at a stated 6% annual rate for 10 years projects about $18,207.33, with $13,000 contributed and about $5,207.33 estimated interest.',
    resultReading:
      'Start with ending balance, then compare total contributions with estimated interest. Contributions are your money going in; estimated interest is the growth from the rate and compounding assumption.',
    doubleCheck:
      'Check that the rate is annual, the time is in years, the frequency matches the account or scenario, and the percent is entered as 6 for 6%, not 0.06.',
    limitFollowup:
      'For bank accounts, compare the official APY and account disclosure. For investing, compare fees, taxes, inflation, risk, and whether the return assumption is realistic.',
  }),
  makeFinanceTool({
    slug: 'salary-calculator',
    name: 'Salary Calculator',
    summary: 'Convert annual salary to monthly, biweekly, weekly, daily, and hourly pay.',
    description:
      'Use this free salary calculator to convert annual salary into monthly, biweekly, weekly, daily, hourly, and pay period amounts with an optional simple tax-rate estimate.',
    seoTitle: 'Salary Calculator | Annual, Monthly, Hourly Pay',
    seoDescription:
      'Convert annual salary to monthly, biweekly, weekly, daily, and hourly gross pay, with simple tax estimate notes and paycheck-limit warnings.',
    icon: 'calculator-salary',
    aliases: [
      'salary to hourly calculator',
      'annual salary calculator',
      'monthly salary calculator',
      'gross pay calculator',
      'yearly salary calculator',
    ],
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
      { label: 'Full-time salary', expression: '$78,000, 40 hours/week, 52 weeks', result: '$6,500 monthly, $3,000 biweekly, $37.50 gross hourly' },
      { label: 'School-year job', expression: '$45,000, 37.5 hours/week, 40 weeks', result: '$1,125 weekly and $30 gross hourly' },
      { label: 'Simple tax estimate', expression: '$60,000 with 20% tax estimate', result: '$5,000 gross monthly and $4,000 estimated monthly take-home' },
    ],
    relatedSlugs: ['take-home-paycheck-calculator', 'income-tax-calculator', 'percentage-calculator'],
    inputExplanations: [
      { term: 'Annual salary', meaning: 'your yearly gross pay before taxes, benefits, deductions, bonuses, overtime, or unpaid time off.' },
      { term: 'Hours per week', meaning: 'the normal weekly hours you want to use for the hourly equivalent.' },
      { term: 'Paid weeks per year', meaning: 'how many paid workweeks the salary covers, such as 52 for year-round work or 40 for a school-year job.' },
      { term: 'Simple tax estimate', meaning: 'one rough percent of annual salary to subtract for a quick after-tax view, not a payroll withholding table.' },
    ],
    priorityFaq: [
      {
        question: 'Is this a salary-to-hourly calculator?',
        answer:
          'Yes. Enter annual salary, weekly hours, and paid weeks per year. For $78,000, 40 hours per week, and 52 paid weeks, the hourly equivalent is $37.50 before taxes and deductions.',
      },
      {
        question: 'Why does paid weeks per year change hourly pay?',
        answer:
          'Hourly equivalent is annual salary divided by total paid hours. A $45,000 school-year salary over 37.5 hours per week and 40 paid weeks works out to $30 per hour, while the same salary spread over 52 weeks would be lower per hour.',
      },
    ],
    extraFaq: [
      {
        question: 'Is monthly salary just annual salary divided by 12?',
        answer:
          'For gross monthly pay, yes. The calculator divides annual salary by 12. Real paychecks may use semi-monthly, biweekly, or weekly schedules, so monthly budget math and actual paycheck deposits can look different.',
      },
      {
        question: 'Is biweekly pay the same as twice a month?',
        answer:
          'No. Biweekly pay usually means 26 paychecks per year. Twice-a-month pay is usually 24 paychecks per year. This page shows biweekly gross pay as annual salary divided by 26.',
      },
      {
        question: 'Should I use this instead of the Take-Home-Paycheck Calculator?',
        answer:
          'Use this Salary Calculator when you need gross salary conversions and a very simple tax percent. Use the Take-Home-Paycheck Calculator when you want pay schedule, pretax deductions, income-tax percentages, and 2026 employee FICA in one estimate.',
      },
      {
        question: 'Does this include overtime or bonuses?',
        answer:
          'No. It treats the annual salary as the amount to divide across time periods. Overtime, bonuses, commissions, unpaid leave, shift premiums, and payroll rules need a separate employer or payroll check.',
      },
    ],
    formulaCheck:
      'For $78,000, 40 hours per week, and 52 paid weeks: $78,000 / 12 = $6,500 monthly, $78,000 / 26 = $3,000 biweekly, and $78,000 / (40 x 52) = $37.50 hourly.',
    resultReading:
      'Read gross hourly for offer comparisons, then check monthly, biweekly, weekly, and the simple monthly take-home estimate. Gross pay is before deductions; the tax estimate is only the percent you entered.',
    doubleCheck:
      'Check whether the job is 52 paid weeks, a school-year schedule, or another paid-week count. Also check that the tax estimate is entered as 22 for 22%, not 0.22.',
    limitFollowup:
      'For actual paycheck planning, compare a paystub, employer payroll tool, official withholding calculator, or the Take-Home-Paycheck Calculator before relying on the number.',
  }),
  makeFinanceTool({
    slug: 'interest-rate-calculator',
    name: 'Interest Rate Calculator',
    summary: 'Find the rate hidden inside a fixed loan payment quote.',
    description:
      'Enter the amount financed, fixed monthly payment, and loan term to estimate the annual interest rate behind the quote.',
    seoTitle: 'Interest Rate Calculator | Find Rate From Payment',
    seoDescription:
      'Estimate the annual interest rate from loan amount, monthly payment, and term. Check total interest, total paid, and APR fee warnings.',
    icon: 'calculator-rate',
    aliases: ['calculate interest rate from payment', 'loan rate calculator', 'implied interest rate calculator'],
    formula:
      'The calculator searches for the monthly rate that makes the fixed-payment loan formula match your monthly payment, then converts that to an annual rate.',
    limit:
      'This is an estimated nominal annual rate. It does not calculate APR with fees, compounding disclosures, promotional terms, variable rates, or lender-specific rules.',
    useCases: [
      'Find the rate when a loan quote gives you the payment but hides the percent.',
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
    seoTitle: 'Sales Tax Calculator | Tax Amount, Rate And Total',
    seoDescription:
      'Calculate sales tax from price and rate. See tax amount, final total, receipt rounding notes, discount timing, and local-rate limits.',
    icon: 'calculator-sales-tax',
    aliases: ['tax calculator', 'sales tax rate calculator', 'receipt tax calculator', 'checkout tax calculator'],
    formula:
      'The calculator changes the sales tax rate into a decimal, multiplies subtotal by that rate to get tax, then adds tax to subtotal for the final total.',
    limit:
      'This is a manual-rate estimate. It does not look up current local rates, product exemptions, shipping rules, marketplace rules, tax holidays, or official filing amounts.',
    useCases: [
      'Quickly answer how much sales tax adds to a purchase.',
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
    seoTitle: 'Currency Calculator | Manual Rate And Fee Conversion',
    seoDescription:
      'Convert money with a manual exchange rate, optional exchange fee, and clear steps. Enter target currency per 1 source currency and see before-fee and after-fee results.',
    icon: 'calculator-currency',
    aliases: [
      'manual currency converter',
      'exchange rate calculator',
      'currency conversion calculator',
      'foreign exchange fee calculator',
      'travel money calculator',
      'target per source exchange rate calculator',
    ],
    formula:
      'Gross converted amount = source amount x exchange rate. Fee amount = gross converted amount x fee percent / 100. Converted amount after fee = gross converted amount - fee amount.',
    limit:
      'This tool does not fetch live exchange rates, guarantee bank/card/transfer-service pricing, or include spread, fixed fees, cash pickup fees, taxes, weekend markups, ATM charges, or rounding rules unless you enter them as part of the rate or fee. Use the current rate from your provider or a trusted source before relying on the conversion.',
    formulaCheck:
      'If the result seems too high or too low, first check whether the rate is written as target currency per 1 source currency or needs to be inverted.',
    doubleCheck:
      'Double-check the rate direction, rate timestamp, provider fee, fixed fee, card fee, transfer fee, and whether the provider uses a worse buy/sell rate than the public mid-market rate.',
    limitFollowup:
      'Real currency decisions can also depend on transfer timing, settlement dates, card-network rules, cash exchange rates, and provider-specific terms.',
    inputExplanations: [
      { term: 'Amount to convert', meaning: 'The source-currency amount before conversion. For 100 USD to another currency, enter 100.' },
      {
        term: 'Exchange rate',
        meaning:
          'Target currency per 1 source currency. If 1 source unit buys 1.25 target units, enter 1.25. If the quote is source per target, use the inverse rate.',
      },
      {
        term: 'Exchange fee',
        meaning:
          'An optional percentage fee removed after conversion. Enter 2.5 for a 2.5% fee. Fixed fees need to be handled separately or baked into your comparison.',
      },
    ],
    extraFaq: [
      {
        question: 'Does this currency calculator use live exchange rates?',
        answer:
          'No. It is a manual-rate calculator. Use a current rate from your bank, card, transfer service, cash exchange desk, or another trusted source, then enter that rate yourself.',
      },
      {
        question: 'What does target per 1 source mean?',
        answer:
          'It means how many units of the currency you want you get for 1 unit of the currency you have. If 1 USD buys 1.25 target units, enter 1.25.',
      },
      {
        question: 'What if my rate is written the opposite way?',
        answer:
          'Use the inverse. For example, if the quote says 1 target unit costs 0.80 source units, then target per 1 source is 1 / 0.80, or 1.25.',
      },
      {
        question: 'Where should I enter a fixed transfer fee?',
        answer:
          'This tool has a percentage fee field, not a fixed-fee field. For a fixed fee, subtract it manually from the final target amount or compare it outside the calculator.',
      },
      {
        question: 'Why is my bank or card result different?',
        answer:
          'Providers may use a spread, card-network rate, buy/sell rate, weekend markup, cash rate, fixed fee, ATM fee, transfer fee, or their own rounding rules. This page only follows the rate and percentage fee you enter.',
      },
      {
        question: 'Can I use a mid-market rate from a search result?',
        answer:
          'You can use it for a rough estimate, but it may not be the rate you actually receive. For travel, card purchases, or transfers, check the provider rate and timestamp.',
      },
      {
        question: 'Does the fee apply before or after conversion?',
        answer:
          'The calculator applies the percentage fee after the source amount is converted. Some providers apply fees differently, so compare the result with the actual quote when exact cents matter.',
      },
      {
        question: 'Is this good for taxes, accounting, or official exchange records?',
        answer:
          'No. Use the official rate, date, and method required by your tax, accounting, invoice, payroll, or reporting rule. This page is a quick planning calculator.',
      },
    ],
    useCases: [
      'Convert travel spending with a manual bank, card, or cash exchange rate.',
      'Estimate the effect of a percentage exchange fee before sending money.',
      'Compare two exchange-rate quotes using the same source amount.',
      'Check whether a quoted rate direction looks inverted before copying it.',
    ],
    examples: [
      { label: 'Simple conversion', expression: '100 at rate 1.25', result: '125 target units before fees' },
      { label: 'Travel fee', expression: '500 at rate 0.92 with 2.5% fee', result: '448.5 target units after fee' },
      { label: 'Large transfer', expression: '1,000 at rate 1.47', result: '1,470 target units before fees' },
      { label: 'Fee comparison', expression: '250 at rate 0.68 with 3% fee', result: '164.9 target units after fee' },
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
    slug: 'apy-calculator',
    name: 'APY Calculator',
    summary: 'Estimate annual percentage yield from a stated rate and compounding frequency.',
    description:
      'Use this free APY calculator to estimate annual percentage yield, term interest, and ending balance from a deposit amount, stated annual interest rate, compounding frequency, and term length.',
    seoTitle: 'APY Calculator | Annual Percentage Yield From Rate',
    seoDescription:
      'Estimate APY from a stated annual interest rate and compounding frequency. See term interest, ending balance, and key bank-disclosure limits.',
    icon: 'calculator-apy',
    aliases: ['annual percentage yield calculator', 'apy interest calculator', 'savings apy calculator', 'interest rate to apy calculator'],
    formula:
      'The calculator estimates APY as ((1 + stated annual rate / compounding periods) raised to the number of compounding periods, minus 1) x 100. It then applies the same annual growth pattern across the term days to estimate interest and ending balance.',
    limit:
      'This is educational APY math, not an official bank disclosure, account quote, savings recommendation, or CD offer. It does not include fees, minimum-balance rules, balance tiers, bonuses, withdrawals, changing rates, leap-year rules, taxes, promotional terms, or account-specific daily-balance methods.',
    useCases: [
      'Convert a stated deposit interest rate into an estimated APY.',
      'Compare monthly, quarterly, annual, and daily compounding assumptions.',
      'Estimate interest for a one-year or shorter deposit term.',
      'Check whether two bank offers are using rate and APY language differently.',
    ],
    examples: [
      { label: 'Monthly compounding', expression: '$1,000 deposit, 4% stated annual rate, monthly compounding, 365 days', result: 'About 4.074% APY and $40.74 interest' },
      { label: 'Daily compounding', expression: '$5,000 deposit, 4.25% stated annual rate, daily compounding, 365 days', result: 'About 4.341% APY and $217.07 interest' },
      { label: 'Six-month estimate', expression: '$10,000 deposit, 3.8% stated annual rate, monthly compounding, 182 days', result: 'About 3.867% APY and about $190.98 interest' },
    ],
    inputExplanations: [
      { term: 'Starting deposit', meaning: 'the amount you want to use for the interest estimate.' },
      { term: 'Stated annual interest rate', meaning: 'the nominal yearly rate shown before compounding. Enter 4 for 4%, not 0.04.' },
      { term: 'Compounding frequency', meaning: 'how many times per year interest is added in the estimate, such as 12 for monthly or 365 for daily.' },
      { term: 'Term length', meaning: 'how many days you want to estimate interest for. Use 365 for a simple one-year comparison.' },
    ],
    priorityFaq: [
      {
        question: 'What is APY?',
        answer:
          'APY means annual percentage yield. CFPB Regulation DD treats APY as the yearly rate that reflects the total amount of interest paid on an account based on the interest rate and compounding frequency. That makes APY useful when comparing deposit accounts that compound differently.',
      },
      {
        question: 'Is APY the same as the interest rate?',
        answer:
          'Not always. The stated annual interest rate is the rate before compounding. APY includes compounding, so monthly or daily compounding can make the APY higher than the stated rate when the rate is positive.',
      },
      {
        question: 'Why does daily compounding usually show a higher APY than annual compounding?',
        answer:
          'Daily compounding adds interest more often. Each small interest credit can itself earn interest for the rest of the year, so the annual yield rises slightly compared with annual compounding at the same stated rate.',
      },
      {
        question: 'Can I use this for CDs and savings accounts?',
        answer:
          'Yes, for a quick comparison of rate and compounding assumptions. For a real CD or savings account, use the bank or credit union disclosure because the official APY, maturity date, fees, penalties, balance tiers, and account rules control the actual return.',
      },
    ],
    extraFaq: [
      {
        question: 'Does this calculator include bonuses or fees?',
        answer:
          'No. CFPB disclosure rules treat APY carefully, and real accounts can have fees, bonuses, minimum balances, and other terms. This page only estimates the compounding math from the numbers you enter.',
      },
      {
        question: 'Should I compare bank accounts by APY or interest rate?',
        answer:
          'APY is usually easier for deposit-account comparisons because it includes compounding. Still compare fees, access limits, withdrawal rules, minimum balances, insurance coverage, and how long the rate is guaranteed.',
      },
    ],
    formulaCheck:
      'If the APY looks too high or low, check that the rate is entered as a percent, the compounding frequency matches the offer, and the term is in days.',
    resultReading:
      'Estimated APY is the one-year yield from the rate and compounding frequency. Term interest and ending balance show what that same growth pattern would produce for the days entered.',
    doubleCheck:
      'Check whether the account disclosure already gives APY. If it does, do not reverse-engineer it from a different stated rate unless you know the compounding rule matches.',
    limitFollowup:
      'Use the account disclosure, bank calculator, or credit union terms for the official APY and actual payout.',
    relatedSlugs: ['savings-calculator', 'cd-calculator', 'compound-interest-calculator', 'interest-calculator'],
  }),
  makeFinanceTool({
    slug: 'rent-calculator',
    name: 'Rent Calculator',
    summary: 'Estimate how much rent may fit after income, debts, utilities, and a rent target.',
    description:
      'Use this rent calculator to estimate a monthly rent ceiling from income, rent target, debts, and utilities before apartment hunting.',
    seoTitle: 'Rent Calculator | Income, Debts, Utilities & Rent Budget',
    seoDescription:
      'Estimate max monthly rent from income, rent target, monthly debts, and utilities. See annual rent and income left before lease fees.',
    icon: 'calculator-rent',
    aliases: ['rent affordability calculator', 'monthly rent calculator based on income', 'income based rent calculator', 'apartment rent budget calculator'],
    formula:
      'The calculator multiplies monthly income by the target rent percentage, then subtracts monthly debts and estimated utilities to produce a rent ceiling.',
    limit:
      'This is a simple rent budget estimate. It does not include deposits, application fees, moving costs, renters insurance, parking, pet fees, local market prices, lease terms, or landlord screening rules.',
    useCases: [
      'Estimate a monthly rent ceiling before apartment hunting.',
      'Compare 25%, 30%, and 35% rent budget targets.',
      'Account for existing debts and utilities before choosing rent.',
      'Check whether the rent budget still leaves income for groceries, transport, savings, and other bills.',
    ],
    examples: [
      { label: '30% target', expression: '$5,200 income, 30%, $350 debts, $180 utilities', result: '$1,030 max rent' },
      { label: 'Lower income', expression: '$3,600 income, 30%, $150 debts, $160 utilities', result: '$770 max rent' },
      { label: 'Conservative target', expression: '$6,200 income, 25%, $500 debts, $220 utilities', result: '$830 max rent' },
    ],
    inputExplanations: [
      {
        term: 'Monthly income',
        meaning:
          'the income number you want to budget from. Use gross monthly income for a quick landlord-style check, or take-home pay for your own safer budget.',
      },
      {
        term: 'Target rent percent',
        meaning:
          'the share of income you want rent to use, such as 25, 30, or 35. A lower percent leaves more room for food, transport, savings, and surprises.',
      },
      { term: 'Monthly debts', meaning: 'payments you already owe each month, such as student loans, car loans, credit cards, or personal loans.' },
      {
        term: 'Estimated utilities',
        meaning:
          'monthly bills you expect to pay on top of rent, such as electricity, gas, water, sewer, trash, or internet when they are not included.',
      },
    ],
    priorityFaq: [
      {
        question: 'Should I use gross income or take-home pay?',
        answer:
          'Use gross monthly income if you are checking a rough landlord-style rent rule. Use take-home pay if you want a safer personal budget. If those answers are far apart, treat the lower rent number as the warning light.',
      },
      {
        question: 'Is 30% of income always the right rent target?',
        answer:
          'No. Thirty percent is a common starting point, but it is not magic. A person with high debt, expensive transport, childcare, medical costs, or no savings buffer may need a lower target.',
      },
      {
        question: 'Can this replace a landlord approval rule?',
        answer:
          'No. Landlords may check gross income, credit, rental history, deposits, local rules, and lease terms. This page is for your budget first, not proof that an application will pass.',
      },
    ],
    extraFaq: [
      {
        question: 'Can I use this for split rent with roommates?',
        answer:
          'Use it to find your own rent ceiling first. If roommates are involved, compare each person separately, then split the actual rent in a way everyone can explain and afford. This page does not split rent by bedroom size or square footage.',
      },
      {
        question: 'Why do utilities lower the rent estimate?',
        answer:
          'Utilities are still housing costs when you pay them outside the rent. Subtracting them keeps a $1,300 rent plus $200 utilities from looking the same as a true $1,300 all-in housing cost.',
      },
    ],
    formulaCheck:
      '$5,200 x 30% gives $1,560. Subtract $350 of debts and $180 of utilities, and the rent ceiling becomes $1,030.',
    resultReading:
      'Max monthly rent is the main ceiling. Annual rent multiplies that by 12. Monthly debts and utilities show what reduced the rent number. Income left shows what remains before other living costs.',
    doubleCheck:
      'Check whether income is gross or take-home, whether debts are monthly, and whether utilities are included in the lease. Then add deposits, application fees, renters insurance, parking, pets, moving costs, and savings before signing.',
    limitFollowup:
      'Compare the estimate with real listings, the lease, local tenant rules, and your full monthly budget before treating the number as affordable.',
    relatedSlugs: ['salary-calculator', 'finance-calculator', 'percentage-calculator'],
  }),
  makeFinanceTool({
    slug: 'annuity-calculator',
    name: 'Annuity Calculator',
    summary: 'Estimate future value and present value for a fixed payment stream.',
    description:
      'Estimate future value, present value, total payments, and payment count from one fixed payment, rate, time, payment frequency, and payment timing.',
    seoTitle: 'Annuity Calculator | Future Value, Present Value & Timing',
    seoDescription:
      'Estimate annuity future value and present value from payment amount, rate, years, payment frequency, and ordinary or annuity-due timing.',
    icon: 'calculator-annuity',
    aliases: [
      'fixed annuity calculator',
      'monthly annuity calculator',
      'annuity future value calculator',
      'annuity present value calculator',
      'ordinary annuity calculator',
      'annuity due calculator',
    ],
    formula:
      'The calculator converts the annual rate to a rate per payment period, counts the payments, then runs ordinary annuity or annuity-due formulas for future value and present value.',
    limit:
      'This is fixed-payment math, not an insurance annuity quote. It does not include insurer pricing, mortality assumptions, fees, taxes, guarantees, riders, surrender charges, inflation adjustments, or contract terms.',
    useCases: [
      'Estimate the future value of repeated monthly or yearly payments.',
      'Estimate what a fixed payment stream is worth today.',
      'Compare ordinary annuity timing with annuity-due timing.',
      'Check fixed-payment annuity formula homework before looking at real contract rules.',
    ],
    examples: [
      { label: 'Monthly ordinary annuity', expression: '$500/month, 5%, 20 years', result: '$205,516.83 future value; $75,762.66 present value' },
      { label: 'Annual payments', expression: '$6,000/year, 4.5%, 15 years', result: '$124,704.33 future value; $64,437.27 present value' },
      { label: 'Annuity due timing', expression: '$500/month at beginning of period', result: '$206,373.15 future value; $76,078.33 present value' },
    ],
    inputExplanations: [
      { term: 'Payment amount', meaning: 'the fixed payment made each period, such as $500 each month or $6,000 each year.' },
      { term: 'Annual rate', meaning: 'the fixed yearly rate assumption. Enter 5 for 5%, not 0.05.' },
      { term: 'Time', meaning: 'how many years the payment stream lasts.' },
      { term: 'Payments per year', meaning: 'how often payments happen. Use 12 for monthly payments and 1 for annual payments.' },
      { term: 'Payment timing', meaning: 'whether payments happen at the end of each period, or at the beginning with one extra period to grow.' },
    ],
    priorityFaq: [
      {
        question: 'Is this the same as an annuity quote from an insurance company?',
        answer:
          'No. This page does the clean math for a fixed payment stream. A real annuity quote can change because of insurance pricing, fees, riders, surrender rules, guarantees, taxes, age, state rules, and contract wording.',
      },
      {
        question: 'What is the difference between ordinary annuity and annuity due?',
        answer:
          'An ordinary annuity treats each payment as happening at the end of the period. An annuity due treats each payment as happening at the beginning, so each payment gets one extra period in the formula.',
      },
      {
        question: 'Can this handle immediate or lifetime annuities?',
        answer:
          'Use it only as fixed-payment math. Immediate and lifetime annuities depend on contract pricing, life expectancy assumptions, payout choices, guarantees, and fees that are not in this calculator.',
      },
    ],
    extraFaq: [
      {
        question: 'Why does payment frequency matter so much?',
        answer:
          'Frequency changes both the rate per period and the number of payments. Monthly payments over 20 years means 240 payments, while annual payments over 20 years means 20 payments.',
      },
      {
        question: 'Why should I check fees and surrender charges separately?',
        answer:
          'Fees and surrender charges can reduce real contract value. FINRA and Investor.gov both warn that annuities can be complex, so the math result should be checked against the actual contract.',
      },
    ],
    formulaCheck:
      '$500 per month for 20 years creates 240 payments. At a 5% annual rate, the ordinary annuity estimate is about $205,516.83 future value and $75,762.66 present value.',
    resultReading:
      'Future value is the estimated ending value of the payment stream. Present value is what that stream is worth today using the rate you entered. Total payments is only the money paid in, before interest math.',
    doubleCheck:
      'Check payment timing, payments per year, and whether the payment is monthly or yearly. Then compare the math with real fees, surrender charges, guarantees, taxes, and contract terms before trusting it.',
    limitFollowup:
      'Read real annuity materials, fee tables, surrender rules, and tax notes before treating the answer as a retirement-income decision.',
    relatedSlugs: ['investment-calculator', 'retirement-calculator', 'compound-interest-calculator'],
  }),
  makeFinanceTool({
    slug: 'credit-card-calculator',
    name: 'Credit Card Calculator',
    summary: 'Estimate credit card payoff months, interest, total paid, and final payment.',
    description:
      'Estimate how long one credit card balance may take to pay off from balance, APR, monthly payment, and any new monthly card spending.',
    seoTitle: 'Credit Card Calculator | Payoff Time, APR & Interest',
    seoDescription:
      'Estimate credit card payoff months, interest, total paid, and final payment from balance, APR, monthly payment, and new monthly charges.',
    icon: 'calculator-credit-card',
    aliases: ['credit card payoff calculator', 'credit card interest calculator', 'APR payoff calculator', 'monthly credit card payment calculator'],
    formula:
      'The calculator converts APR to a monthly rate, adds estimated monthly interest and any new card spending, subtracts the monthly payment, and repeats until the balance reaches zero.',
    limit:
      'This is a simplified payoff estimate. It does not include daily-balance interest, grace-period rules, fees, cash advances, balance-transfer APRs, deferred interest, changing minimum payments, variable APR changes, or issuer terms.',
    useCases: [
      'Estimate how long one credit card balance may take to pay off.',
      'Compare a regular payment with a larger monthly payment.',
      'See how new card spending slows a payoff plan.',
      'Estimate total interest before choosing a debt payoff strategy.',
    ],
    examples: [
      { label: 'Payoff estimate', expression: '$4,500 balance, 22.9% APR, $250/month', result: 'About 23 months, $1,065.99 interest, and $5,565.99 total paid' },
      { label: 'Pay extra', expression: '$4,500 balance, 22.9% APR, $350/month', result: 'About 15 months and $712.51 interest' },
      { label: 'New charges', expression: '$3,000 balance, 19.9% APR, $250/month, $50 new charges/month', result: 'About 18 months and $478.36 interest' },
    ],
    relatedSlugs: ['interest-calculator', 'payment-calculator', 'loan-calculator'],
    inputExplanations: [
      { term: 'Current balance', meaning: 'the card balance you are carrying now, before the next payment.' },
      { term: 'APR', meaning: 'the yearly credit card rate, entered as 22.9 for 22.9%.' },
      { term: 'Monthly payment', meaning: 'the amount you plan to send every month, not just the issuer minimum unless that is your real plan.' },
      { term: 'New charges per month', meaning: 'new card spending you expect to keep adding while paying down the balance.' },
    ],
    priorityFaq: [
      {
        question: 'What happens in the $4,500 credit card example?',
        answer:
          'With a $4,500 balance, 22.9% APR, and $250 paid each month, the estimate takes about 23 months. The total interest is about $1,065.99, total paid is about $5,565.99, and the last payment is about $65.99.',
      },
      {
        question: 'Why does paying $350 instead of $250 matter so much?',
        answer:
          'The extra $100 goes straight into the monthly payoff loop. In the $4,500 example, raising the payment to $350 cuts the estimate to about 15 months and lowers interest to about $712.51.',
      },
      {
        question: 'Why do new monthly charges slow the payoff?',
        answer:
          'New charges are added before the payment is subtracted. If you add $50 each month while paying $250, part of that payment is only covering new spending instead of old balance.',
      },
      {
        question: 'Is this the same as the credit card statement minimum-payment warning?',
        answer:
          'No. This page uses the fixed monthly payment you enter. Real statements can use issuer minimum-payment formulas, daily-balance interest, fees, grace-period rules, and repayment-warning rules that are more specific than this estimate.',
      },
    ],
    extraFaq: [
      {
        question: 'Should I enter the minimum payment?',
        answer:
          'Only enter the minimum if that is the plan you want to test. CFPB materials warn that paying only the minimum can cost more interest and take longer, so it is worth trying a higher payment too.',
      },
      {
        question: 'Why can my card statement show a different interest amount?',
        answer:
          'Many card issuers calculate interest daily from balances inside the billing cycle. This calculator uses a simpler monthly estimate, so use your statement for exact billing numbers.',
      },
      {
        question: 'Does this include promotional APR or deferred interest?',
        answer:
          'No. Promotional APR, deferred-interest offers, balance transfers, cash advances, penalty APRs, fees, and grace-period rules can all change the real payoff. Read the card agreement before relying on a simple estimate.',
      },
    ],
    formulaCheck:
      '$4,500 at 22.9% APR with a $250 monthly payment estimates about 23 months, $1,065.99 interest, and $5,565.99 total paid.',
    resultReading:
      'Start with payoff months, then check total interest and total paid. The final payment may be smaller because the last month only needs enough to clear the remaining balance.',
    doubleCheck:
      'Check the APR, whether you are still adding new charges, and whether your payment is higher than estimated monthly interest plus new charges. If the card has a promotion or fee, check the statement too.',
    limitFollowup:
      'Use the credit card statement and card agreement for exact APR tiers, fees, grace-period rules, minimum-payment warnings, and payment allocation rules.',
  }),
  makeFinanceTool({
    slug: 'pension-calculator',
    name: 'Pension Calculator',
    summary: 'Estimate a defined-benefit pension from final salary, credited service, and plan multiplier.',
    description:
      'Estimate a simple defined-benefit pension from final average salary, credited years of service, and the plan multiplier, then check annual pension, monthly pension, and replacement rate.',
    seoTitle: 'Pension Calculator | Salary, Service & Multiplier',
    seoDescription:
      'Estimate a defined-benefit pension from final average salary, credited years of service, and plan multiplier, with annual, monthly, and replacement-rate checks.',
    icon: 'calculator-pension',
    aliases: ['defined benefit pension calculator', 'pension estimate calculator', 'final salary pension calculator', 'service years pension calculator'],
    formula:
      'The calculator multiplies final average salary by credited years of service and the benefit multiplier, then divides the annual pension by 12 for a monthly estimate.',
    limit:
      'This is not your plan benefit statement. It does not include vesting, service-credit rules, early retirement reductions, survivor choices, joint-and-survivor adjustments, cost-of-living adjustments, lump-sum options, taxes, PBGC limits, or plan-specific formulas.',
    useCases: [
      'Estimate a defined-benefit pension from salary, credited service, and multiplier.',
      'Turn an annual pension estimate into a monthly before-tax amount.',
      'Compare how more service years or a different multiplier changes the estimate.',
      'Check replacement rate before reading the official plan document or benefit statement.',
    ],
    examples: [
      { label: 'Main estimate', expression: '$82,000 final average salary, 27 service years, 1.6% multiplier', result: '$35,424/year or $2,952/month' },
      { label: 'Long service', expression: '$96,000 salary, 32.5 service years, 1.7% multiplier', result: '$53,040/year or $4,420/month' },
      { label: 'Smaller multiplier', expression: '$70,000 salary, 20 service years, 1.2% multiplier', result: '$16,800/year or $1,400/month' },
    ],
    inputExplanations: [
      { term: 'Final average salary', meaning: 'the annual salary number your pension formula uses, often an average from your highest or final earning years.' },
      { term: 'Credited years of service', meaning: 'the service years your plan counts for the formula, which may differ from calendar years worked.' },
      { term: 'Benefit multiplier', meaning: 'the plan percent applied for each service year, such as 1.6 for a 1.6% multiplier.' },
    ],
    priorityFaq: [
      {
        question: 'Is this for a defined-benefit pension or a 401K?',
        answer:
          'This page is for defined-benefit style pension math: salary times credited service times multiplier. A 401K or IRA works differently because the balance depends on contributions, investments, fees, and withdrawals.',
      },
      {
        question: 'Does this include survivor benefits or early retirement cuts?',
        answer:
          'No. Survivor options, joint-and-survivor choices, early retirement reductions, disability rules, and lump-sum choices can all change the real monthly benefit. Use your plan document or benefit statement for those details.',
      },
    ],
    extraFaq: [
      {
        question: 'Why does replacement rate matter?',
        answer:
          'Replacement rate compares the estimated annual pension with final average salary. It is a quick way to see how much of that salary the simple formula replaces before tax, savings, Social Security, or other retirement income.',
      },
      {
        question: 'Can PBGC change my pension estimate?',
        answer:
          'PBGC does not set your normal plan formula, but PBGC guarantees have limits if a covered private defined-benefit plan fails. That is another reason this page should not replace an official benefit statement.',
      },
    ],
    formulaCheck:
      '$82,000 times 27 service years times a 1.6% multiplier gives a $35,424 annual estimate, or $2,952 per month before taxes and plan adjustments.',
    resultReading:
      'Read the monthly estimate first, then check annual pension and replacement rate. Replacement rate shows how much of final average salary the simple formula replaces.',
    doubleCheck:
      'Check whether your plan uses final average salary, career average pay, credited service, partial years, caps, early retirement factors, or a different multiplier before copying the result.',
    limitFollowup:
      'Use the plan summary, benefit statement, pension administrator, PBGC information, and tax guidance for the exact benefit, payment form, guarantees, and taxable amount.',
    relatedSlugs: ['retirement-calculator', '401k-calculator', 'annuity-payout-calculator'],
  }),
  makeFinanceTool({
    slug: 'annuity-payout-calculator',
    name: 'Annuity Payout Calculator',
    summary: 'Estimate a fixed payout from a lump sum, annual rate, payout term, and payment frequency.',
    description:
      'Estimate a fixed payout from a starting balance, annual rate, payout term, and payment frequency, then check payment amount, total paid out, estimated interest, and payment count.',
    seoTitle: 'Annuity Payout Calculator | Payment, Term & Interest',
    seoDescription:
      'Estimate fixed annuity payout amount, total paid, interest, and payment count from starting balance, annual rate, payout term, and frequency.',
    icon: 'calculator-annuity-payout',
    aliases: ['annuity withdrawal calculator', 'fixed payout calculator', 'annuity income calculator', 'retirement payout calculator'],
    formula:
      'The calculator converts the annual rate to a rate per payment period, counts the payments, then uses the present-value annuity payout formula to spread the balance across those payments.',
    limit:
      'This is simplified fixed-rate payout math. It does not include insurance company pricing, lifetime income guarantees, mortality assumptions, fees, surrender charges, taxes, riders, inflation adjustments, market value adjustments, or contract terms.',
    useCases: [
      'Estimate a fixed monthly payout from a lump sum balance.',
      'Compare payout terms such as 10, 15, 20, or 25 years.',
      'See total payout, estimated interest, and payment count from the rate assumption.',
      'Check clean annuity payout math before reading a real contract or quote.',
    ],
    examples: [
      { label: '$100k monthly payout', expression: '$100,000 balance, 5%, 20 years, monthly', result: '$659.96 per month, about $158,389.38 total paid' },
      { label: 'Annual payout', expression: '$75,000 balance, 4%, 15 years, annual', result: '$6,745.58 per year, about $101,183.74 total paid' },
      { label: 'Short payout', expression: '$50,000 balance, 3.5%, 10 years, monthly', result: '$494.43 per month, about $59,331.52 total paid' },
    ],
    inputExplanations: [
      { term: 'Starting balance', meaning: 'the lump sum you want to spread across fixed payouts.' },
      { term: 'Annual rate', meaning: 'the rate assumption used by this math model, entered as a percent such as 5 for 5%.' },
      { term: 'Payout term', meaning: 'how many years the fixed payout should last.' },
      { term: 'Payments per year', meaning: 'how often payments happen, such as 12 for monthly or 1 for annual.' },
    ],
    priorityFaq: [
      {
        question: 'Is this an insurance-company annuity quote?',
        answer:
          'No. This is clean fixed payout math. A real annuity quote can include insurer pricing, life expectancy assumptions, guarantee periods, rider costs, fees, surrender rules, taxes, and contract wording.',
      },
      {
        question: 'Is this the same as a lifetime annuity payout?',
        answer:
          'No. This page spreads a balance over a fixed number of payments. Lifetime income products can price payments using age, sex where allowed, interest rates, guarantees, survivor benefits, and insurer assumptions.',
      },
    ],
    extraFaq: [
      {
        question: 'Why does payment frequency matter?',
        answer:
          'Payment frequency changes the rate per period and the number of payments. Monthly payments give 12 payments per year, while annual payments give only one, so the payment amount and total interest can change.',
      },
      {
        question: 'Can fees or surrender charges change the result?',
        answer:
          'Yes. Fees, surrender charges, market value adjustments, taxes, riders, and contract limits can reduce the real money available or change when withdrawals make sense.',
      },
    ],
    formulaCheck:
      '$100,000 at 5% over 20 years with monthly payments gives about $659.96 per month, 240 payments, about $158,389.38 total paid, and about $58,389.38 estimated interest.',
    resultReading:
      'Start with payout per period, then check total paid out, estimated interest, and payment count. A higher payout can simply mean the money runs out faster.',
    doubleCheck:
      'Check whether you want a fixed-term payout, lifetime income quote, annual or monthly payments, and whether the rate is only a what-if assumption before copying the result.',
    limitFollowup:
      'Use the insurer quote, contract, state insurance materials, tax guidance, and a qualified professional for actual annuity pricing, guarantees, fees, and withdrawal rules.',
    relatedSlugs: ['annuity-calculator', 'retirement-calculator', 'investment-calculator'],
  }),
  makeFinanceTool({
    slug: 'credit-cards-payoff-calculator',
    name: 'Credit Cards Payoff Calculator',
    summary: 'Estimate a combined credit card payoff from balance, weighted APR, regular payment, and extra payment.',
    description:
      'Estimate payoff months, total interest, total paid, and final payment from combined card balances, weighted APR, regular monthly payment, and extra monthly payment.',
    seoTitle: 'Credit Cards Payoff Calculator | Multi-Card Plan',
    seoDescription:
      'Estimate multi-card payoff months, total interest, total paid, and final payment from combined balance, weighted APR, regular payment, and extra payment.',
    icon: 'calculator-card-payoff',
    aliases: ['multi card payoff calculator', 'credit card debt payoff calculator', 'weighted APR payoff calculator', 'credit card payoff plan'],
    formula:
      'The calculator treats the cards as one combined balance, converts weighted APR to a monthly rate, adds monthly interest, subtracts regular plus extra payment, and repeats until the combined balance reaches zero.',
    limit:
      'This is simplified combined-balance payoff math. It does not model average daily balance billing, separate APR tiers, payment allocation, cash advances, balance-transfer terms, deferred interest, fees, penalty APRs, minimum-payment changes, grace-period rules, or new purchases.',
    useCases: [
      'Estimate payoff time after combining several card balances into one planning number.',
      'Compare the regular payment with an extra monthly payment.',
      'See total interest before choosing a debt payoff strategy.',
      'Check whether the total payment is strong enough to reduce principal.',
    ],
    examples: [
      { label: 'Two-card payoff', expression: '$8,500 balance, 21.5% weighted APR, $350 + $100 extra', result: '24 months, about $1,969.83 interest, about $10,469.83 total paid, final payment near $119.83' },
      { label: 'Minimum plus extra', expression: '$6,000 balance, 19.9% weighted APR, $220 + $80 extra', result: '25 months, about $1,350.77 interest, about $7,350.77 total paid, final payment near $150.77' },
      { label: 'Aggressive payoff', expression: '$12,000 balance, 24.9% weighted APR, $500 + $250 extra', result: '20 months, about $2,735.69 interest, about $14,735.69 total paid, final payment near $485.69' },
    ],
    inputExplanations: [
      { term: 'Combined balance', meaning: 'the total balance across the cards you want to treat as one payoff plan.' },
      { term: 'Weighted APR', meaning: 'an average APR that gives more weight to cards with bigger balances.' },
      { term: 'Regular monthly payment', meaning: 'the total payment you can send every month before any extra payoff money.' },
      { term: 'Extra monthly payment', meaning: 'extra money added on top of the regular payment to speed up the payoff.' },
    ],
    priorityFaq: [
      {
        question: 'Is this a snowball or avalanche payoff plan?',
        answer:
          'No. This combines your cards into one balance. A true snowball or avalanche plan needs each card balance, APR, minimum payment, and payoff order.',
      },
      {
        question: 'What is weighted APR?',
        answer:
          'Weighted APR is an average rate that gives more influence to larger card balances. It is useful for a quick combined estimate, but it is not the same as each card statement.',
      },
    ],
    extraFaq: [
      {
        question: 'Why can the real payoff differ from this estimate?',
        answer:
          'Real card issuers often calculate interest daily, may split balances by APR, and can add fees, cash advances, balance transfers, deferred interest, penalty APRs, or new purchases.',
      },
      {
        question: 'Should I stop new card spending while using this?',
        answer:
          'Yes, if payoff speed is the goal. New purchases can add interest, reduce or remove a grace period, and make the balance fall slower than the estimate.',
      },
    ],
    formulaCheck:
      '$8,500 at 21.5% weighted APR with a $350 regular payment plus $100 extra estimates 24 months, about $1,969.83 interest, about $10,469.83 total paid, and a final payment near $119.83.',
    resultReading:
      'Start with payoff months, then check total interest and total paid. If interest still looks high, test a bigger payment or separate the cards into an avalanche plan.',
    doubleCheck:
      'Check that the balance is the combined current balance, the APR is weighted, the payment is realistic, and new charges are not being added while you try to pay the cards down.',
    limitFollowup:
      'Use card statements, card agreements, payoff tools from the issuer, or a nonprofit credit counselor for exact daily interest, payment allocation, hardship plans, and account-specific rules.',
    relatedSlugs: ['credit-card-calculator', 'debt-payoff-calculator', 'debt-consolidation-calculator'],
  }),
  makeFinanceTool({
    slug: 'debt-payoff-calculator',
    name: 'Debt Payoff Calculator',
    summary: 'Check how fast a fixed debt can disappear when you pay the regular amount plus extra.',
    description:
      'Estimate debt payoff months, total interest, total paid, and final payment from one balance, one interest rate, a regular payment, and any extra payment.',
    seoTitle: 'Debt Payoff Calculator | Extra Payment Plan',
    seoDescription:
      'Estimate debt payoff months, interest, total paid, and final payment from balance, APR, regular payment, and extra payment.',
    icon: 'calculator-debt-payoff',
    aliases: ['debt payoff plan', 'extra payment debt calculator', 'fixed debt payoff calculator'],
    formula:
      'The calculator turns the annual rate into a monthly rate, adds one month of interest, subtracts the regular payment plus extra payment, and repeats until the balance reaches zero.',
    limit:
      'This is a fixed-balance payoff model. It does not choose an avalanche order, settle debt, read a collector notice, include late fees, handle court deadlines, or replace advice from a qualified debt counselor.',
    useCases: [
      'See whether the payment is actually reducing principal.',
      'Compare the same debt with and without an extra monthly payment.',
      'Estimate interest before asking a creditor about a payment plan.',
      'Check a simple payoff path before looking at consolidation or counseling.',
    ],
    examples: [
      { label: '$10k payoff', expression: '$10,000 debt, 12%, $300 regular + $100 extra/month', result: '29 months, about $1,564.88 interest, about $11,564.88 total paid, final payment near $364.88' },
      { label: 'No extra payment', expression: '$7,500 at 15%, $260/month', result: '36 months, about $1,859.55 interest, about $9,359.55 total paid' },
      { label: 'Fast payoff', expression: '$5,000 at 18%, $250 regular + $150 extra/month', result: '14 months, about $578.63 interest, about $5,578.63 total paid' },
    ],
    inputExplanations: [
      { term: 'Debt balance', meaning: 'the current amount you still owe on the debt you are testing.' },
      { term: 'Annual interest rate', meaning: 'the yearly rate as a percent, such as 12 for 12%, not 0.12.' },
      { term: 'Monthly payment', meaning: 'the regular payment you can keep making each month.' },
      { term: 'Extra monthly payment', meaning: 'extra money you can add on top of the regular payment without skipping other required bills.' },
    ],
    priorityFaq: [
      {
        question: 'Is this a debt avalanche or snowball calculator?',
        answer:
          'No. This page tests one fixed balance at one rate. An avalanche or snowball plan needs separate debts, minimum payments, interest rates, and a payoff order.',
      },
      {
        question: 'Why does the calculator stop when my payment is too low?',
        answer:
          'If the payment does not cover the monthly interest, the balance can grow instead of shrink. The calculator stops so it does not show a fake payoff date.',
      },
    ],
    extraFaq: [
      {
        question: 'Can this help before I call a creditor?',
        answer:
          'Yes. It can give you a rough monthly-payment target before you ask about a payment plan. Still get any agreement in writing and check fees, collection status, and credit reporting.',
      },
      {
        question: 'What if the debt is already with a collector?',
        answer:
          'Use the number as a planning estimate only. First confirm the debt, check your rights, avoid sharing sensitive information with an unknown caller, and watch for court or statute-of-limitations issues.',
      },
    ],
    formulaCheck:
      '$10,000 at 12% with a $300 regular payment plus $100 extra estimates 29 months, about $1,564.88 interest, about $11,564.88 total paid, and a final payment near $364.88.',
    resultReading:
      'Start with payoff months, then compare total interest and total paid. If the interest still feels too high, test a bigger extra payment or compare a consolidation offer.',
    doubleCheck:
      'Check that the balance is current, the rate is annual, the monthly payment is realistic, and the extra payment will not make you miss rent, food, utilities, or other required bills.',
    limitFollowup:
      'For debts in collections, settlement, hardship, court, or bankruptcy, use creditor paperwork, CFPB or FTC guidance, and a qualified nonprofit counselor or legal professional.',
    relatedSlugs: ['repayment-calculator', 'debt-consolidation-calculator', 'credit-cards-payoff-calculator'],
  }),
  makeFinanceTool({
    slug: 'debt-consolidation-calculator',
    name: 'Debt Consolidation Calculator',
    summary: 'Compare your current payoff path with a new consolidation loan before you trust the lower payment.',
    description:
      'Compare current debt payoff time and cost with a new consolidation loan payment, fees, monthly payment change, and total cost change.',
    seoTitle: 'Debt Consolidation Calculator | Compare Loan Savings',
    seoDescription:
      'Compare a consolidation loan offer with current debt payoff, including new payment, fees, monthly change, and total cost change.',
    icon: 'calculator-debt-consolidation',
    aliases: ['debt consolidation loan calculator', 'consolidation loan savings calculator', 'debt refinance calculator'],
    formula:
      'The calculator estimates the current payoff path, adds entered fees to the new loan principal, calculates the new fixed payment, then compares payment size and total paid.',
    limit:
      'This does not decide approval, credit score impact, teaser-rate risk, home-equity risk, hardship plans, settlement offers, or whether taking new debt is a good idea.',
    useCases: [
      'Compare a quoted consolidation loan with your current payoff path.',
      'Check whether a lower rate offsets fees and a new term.',
      'Spot a lower monthly payment that could still cost more over time.',
      'Prepare sharper questions before applying for a consolidation offer.',
    ],
    examples: [
      { label: 'Lower-rate loan', expression: '$18,000 debt, 18% current rate, $650 current payment, 10.5% new loan for 3 years, $300 fee', result: '$594.79 new payment, about $55.21 less per month, about $2,023.05 lower total cost' },
      { label: 'No fee option', expression: '$12,000 debt, 16% current rate, $420 current payment, 11% new loan for 3 years, no fee', result: 'Compare payment relief with total cost' },
      { label: 'Longer term', expression: '$25,000 debt, 20% current rate, $750 current payment, 13% new loan for 5 years, $500 fee', result: 'Check whether lower payment hides extra total cost' },
    ],
    inputExplanations: [
      { term: 'Total current debt', meaning: 'the balances you would actually roll into the new loan.' },
      { term: 'Current average rate', meaning: 'the weighted average annual rate on those debts, not the lowest card rate.' },
      { term: 'Current monthly payment', meaning: 'the total amount you are already paying toward those debts each month.' },
      { term: 'New loan rate', meaning: 'the annual rate from the real offer or the rate you are testing.' },
      { term: 'New loan term', meaning: 'how many years the new loan would run.' },
      { term: 'Fees added', meaning: 'origination, transfer, closing, or setup fees that become part of the new cost.' },
    ],
    priorityFaq: [
      {
        question: 'Can a lower consolidation payment still cost more?',
        answer:
          'Yes. A lower monthly payment can come from stretching the debt over more years. Always compare total paid, fees, and the new term, not only the monthly number.',
      },
      {
        question: 'Does this tell me whether I will be approved?',
        answer:
          'No. Lenders still check credit, income, debt-to-income ratio, collateral, and their own rules. This page only compares the math after you enter a possible offer.',
      },
    ],
    extraFaq: [
      {
        question: 'Should I include balance transfer or origination fees?',
        answer:
          'Yes. Add any fee that makes the new path more expensive. If a fee is charged separately, still compare it because it changes whether consolidation is worth it.',
      },
      {
        question: 'What if the offer uses my house as collateral?',
        answer:
          'Be careful. Home-equity consolidation can put your home at risk if payments are late. Use this estimate as a math check, then read the loan documents and get qualified advice.',
      },
    ],
    formulaCheck:
      '$18,000 at 18% with a $650 current payment compared with a 10.5% three-year consolidation loan plus a $300 fee estimates a $594.79 new payment, about $55.21 less per month, and about $2,023.05 lower total cost.',
    resultReading:
      'Start with total cost change, then check monthly payment change. A smaller payment only helps if the full cost, fee, term, and risk still make sense.',
    doubleCheck:
      'Check the balances, weighted current rate, total current payment, real offered APR, fees, loan term, teaser-rate rules, and whether new borrowing fixes the reason the debt grew.',
    limitFollowup:
      'Before signing, compare the Loan Estimate or offer paperwork, ask about fees and rate changes, avoid debt-relief scams, and consider a nonprofit credit counselor when the debt is hard to manage.',
    relatedSlugs: ['debt-payoff-calculator', 'credit-cards-payoff-calculator', 'loan-calculator'],
  }),
  makeFinanceTool({
    slug: 'repayment-calculator',
    name: 'Repayment Calculator',
    summary: 'Estimate payoff time, interest, total paid, and final payment for one fixed balance.',
    description:
      'Estimate how long one fixed balance may take to repay from balance, annual rate, monthly payment, and optional extra payment.',
    seoTitle: 'Repayment Calculator | Payoff Time & Interest',
    seoDescription:
      'Estimate repayment months, total interest, total paid, and final payment for one fixed balance with regular and extra monthly payments.',
    icon: 'calculator-repayment',
    aliases: ['loan repayment calculator', 'balance payoff calculator', 'monthly repayment calculator', 'extra payment repayment calculator'],
    formula:
      'The calculator turns the annual rate into a monthly rate, adds that month’s interest to the remaining balance, subtracts the regular payment plus any extra payment, and repeats until the balance reaches zero.',
    limit:
      'This is fixed-balance repayment math only. It does not include income-driven student loan plans, deferment, forbearance, hardship plans, payment pauses, fees, late charges, changing rates, minimum-payment changes, or provider-specific rules.',
    useCases: [
      'Estimate how long a balance may take to repay.',
      'Test whether a payment is enough to reduce principal.',
      'Compare repayment with and without extra monthly payment.',
      'Create a simple repayment plan for a fixed balance.',
    ],
    examples: [
      { label: 'Balance plus extra', expression: '$12,000 balance, 8%, $300 regular + $50 extra/month', result: '40 months, about $1,669.76 interest, about $13,669.76 total paid' },
      { label: 'Small loan payoff', expression: '$3,500 at 14%, $150 regular + $25 extra/month', result: '23 months and about $508.84 interest' },
      { label: 'No extra payment', expression: '$9,000 at 9.5%, $250/month', result: '43 months and about $1,636.00 interest' },
    ],
    relatedSlugs: ['debt-payoff-calculator', 'payment-calculator', 'loan-calculator'],
    inputExplanations: [
      { term: 'Current balance', meaning: 'the amount still owed today, before the next interest charge or payment.' },
      { term: 'Annual interest rate or APR', meaning: 'the yearly rate entered as a percent, such as 8 for 8%, not 0.08.' },
      { term: 'Regular monthly payment', meaning: 'the payment you expect to send every month before any extra amount.' },
      { term: 'Extra monthly payment', meaning: 'money you can reliably add on top of the regular payment.' },
    ],
    priorityFaq: [
      {
        question: 'What does the repayment time mean?',
        answer:
          'Repayment time is the estimated number of months until the balance reaches zero. For example, $12,000 at 8% with $300 regular payment plus $50 extra takes about 40 months in this simple monthly-interest model.',
      },
      {
        question: 'How much does the $50 extra payment change the example?',
        answer:
          'With the $50 extra payment, the $12,000 example estimates about 40 months and about $1,669.76 interest. Without the extra $50, the same balance estimates about 47 months and about $2,003.66 interest. That is about 7 months faster and about $333.90 less interest.',
      },
      {
        question: 'Why can an official repayment plan be different?',
        answer:
          'Official student loan, lender, card, or servicer plans can use rules this page does not model, such as income-driven payments, deferment, forbearance, daily interest, payment allocation, late fees, minimum-payment changes, or written APR disclosures.',
      },
    ],
    formulaCheck:
      'If the first month of interest is bigger than the payment, the balance will not go down. A $12,000 balance at 8% adds about $80 interest in the first month, so a $350 total payment has room to reduce principal.',
    resultReading:
      'Start with payoff months, then check total interest and total paid. Final payment is often smaller than the usual monthly payment because the last bit of balance may be less than a full payment.',
    doubleCheck:
      'Check that the balance is current, the rate is annual, the payment is monthly, and the extra payment is money you can keep sending without missing rent, food, utilities, insurance, or other required bills.',
    limitFollowup:
      'For federal student loans, use Federal Student Aid tools for official repayment-plan options. For loans or credit, compare the estimate with the written APR, finance charge, payment schedule, fees, and provider rules.',
  }),
  makeFinanceTool({
    slug: 'student-loan-calculator',
    name: 'Student Loan Calculator',
    summary: 'Estimate a standard student loan payment, interest, payoff time, and extra-payment savings.',
    description:
      'Estimate a standard student loan payment from balance, rate, term, and extra monthly payment, then compare payoff time and interest saved.',
    seoTitle: 'Student Loan Calculator | Payments, Interest & Extra Payoff',
    seoDescription:
      'Estimate student loan payment, payoff time, total interest, and extra-payment savings from balance, rate, term, and monthly extra payment.',
    icon: 'calculator-student-loan',
    aliases: [
      'student loan payment calculator',
      'student loan repayment calculator',
      'student loan payoff calculator',
      'federal student loan calculator',
      'student loan interest calculator',
      'extra payment student loan calculator',
    ],
    formula:
      'The calculator uses the fixed-payment loan formula for the scheduled monthly payment, then simulates monthly interest and principal reduction again with any extra payment added.',
    limit:
      'This is not an official federal repayment plan result, servicer quote, or private-lender payoff statement. It does not include income-driven repayment, deferment, forbearance, forgiveness, subsidies, capitalization, fees, payment allocation, auto-pay discounts, or servicer rules.',
    useCases: [
      'Estimate a standard student loan payment from balance, rate, and term.',
      'See how an extra payment may reduce payoff time.',
      'Estimate interest cost before choosing a repayment strategy.',
      'Compare simplified repayment scenarios before using Federal Student Aid Loan Simulator or asking a servicer.',
    ],
    examples: [
      { label: '10-year plan', expression: '$30,000 balance, 6.5%, 10 years, $50 extra/month', result: '$340.64 scheduled payment, 100-month payoff with extra, about $1,985.10 interest saved' },
      { label: 'No extra payment', expression: '$25,000 at 5.5% for 10 years', result: '$271.32/month and about $7,557.88 interest' },
      { label: 'Aggressive payment', expression: '$45,000 at 7%, $200 extra/month', result: '78-month payoff and about $6,614.52 interest saved' },
    ],
    relatedSlugs: ['loan-calculator', 'amortization-calculator', 'repayment-calculator'],
    inputExplanations: [
      { term: 'Loan balance', meaning: 'the current principal you still owe, not the original amount if you have already paid some down.' },
      { term: 'Interest rate', meaning: 'the annual rate for this loan, entered as 6.5 for 6.5%, not as 0.065.' },
      { term: 'Repayment term', meaning: 'the standard fixed-payment term in years, such as 10 years for a basic standard-plan comparison.' },
      { term: 'Extra monthly payment', meaning: 'extra money you plan to send each month on top of the scheduled payment.' },
    ],
    priorityFaq: [
      {
        question: 'Is this the same as the Federal Student Aid Loan Simulator?',
        answer:
          'No. This page only does fixed-payment loan math from the numbers you enter. Federal Student Aid Loan Simulator can compare official federal repayment options, IDR plans, forgiveness paths, deferment, forbearance, and other rules this calculator does not model.',
      },
      {
        question: 'What does the $50 extra payment do in the example?',
        answer:
          'With $30,000 at 6.5% for 10 years, the scheduled payment is about $340.64. Adding $50 makes the monthly amount about $390.64, estimates a 100-month payoff, and saves about $1,985.10 in interest compared with the standard 120-month path.',
      },
      {
        question: 'What rate should I enter for a federal student loan?',
        answer:
          'Use the rate from StudentAid.gov or your servicer. Federal student loan rates depend on loan type and first disbursement date. The 6.5% starter example is only a clean test number, not a current-rate promise.',
      },
      {
        question: 'Can I use this for private student loans?',
        answer:
          'You can use it for simple fixed-rate payment math, but private loans can have lender rules, fees, variable rates, refinance terms, and payment allocation rules this page does not know. Check the lender agreement before acting.',
      },
    ],
    formulaCheck:
      'For the starter example, $30,000 at 6.5% over 10 years gives a scheduled payment near $340.64. Adding $50 makes the simulated monthly payment about $390.64.',
    resultReading:
      'Start with the scheduled payment, then check payoff time, total interest, and interest saved. A smaller payment can feel easier, but total interest shows what the loan really costs over time.',
    doubleCheck:
      'Check the loan balance, annual rate, term, and whether extra payments are applied to principal. For federal loans, compare the result with Federal Student Aid Loan Simulator or your servicer before changing plans.',
    limitFollowup:
      'Use Federal Student Aid for official federal repayment-plan choices. Use your servicer or lender for payoff quotes, IDR, deferment, forbearance, forgiveness, capitalization, payment allocation, and private-loan rules.',
  }),
  makeFinanceTool({
    slug: 'college-cost-calculator',
    name: 'College Cost Calculator',
    summary: 'Project future college costs and the gap your savings may need to cover.',
    description:
      'Project one college plan from today\'s annual cost, years until school starts, yearly cost increase, current savings, and monthly deposits. See first-year cost, total estimated cost, projected savings, and the savings gap.',
    seoTitle: 'College Cost Calculator | Future Tuition & Savings Gap',
    seoDescription:
      'Estimate future college cost, first-year cost, projected savings, and savings gap from today\'s cost, school years, inflation, and deposits.',
    icon: 'calculator-college-cost',
    aliases: [
      'college cost calculator',
      'college tuition calculator',
      'college savings calculator',
      'future college cost calculator',
      '529 college savings calculator',
      'college net price planning calculator',
    ],
    formula:
      'The calculator grows today\'s annual cost until school starts, adds each school year with annual increases, then compares that total with projected savings at the start date.',
    limit:
      'This is planning math, not a school net price calculator or financial aid offer. It does not include grants, scholarships, FAFSA results, loans, work-study, tax credits, residency rules, program fees, housing changes, tuition guarantees, or school billing details.',
    useCases: [
      'Estimate future tuition, fees, housing, books, transportation, and other school costs from one annual cost number.',
      'Compare projected savings with estimated total college cost.',
      'Test how monthly savings changes the gap before school starts.',
      'Plan a starting point before using a school net price calculator or reading an aid offer.',
    ],
    examples: [
      {
        label: 'Four-year plan',
        expression: '$28,000 current annual cost, 8 years until start, 4 school years, 4% cost increase, $10,000 saved, $250/month, 5% savings return',
        result: '$162,724.22 estimated total cost, $44,340.98 projected savings, $118,383.23 savings gap',
      },
      { label: 'Sooner start', expression: '$22,000 annual cost, starts in 3 years, $300/month savings', result: 'Near-term cost and gap estimate' },
      { label: 'Two-year program', expression: '$12,000 annual cost, 2 years in school, 5 years until start', result: 'Shorter program estimate' },
    ],
    relatedSlugs: ['savings-calculator', 'student-loan-calculator', 'compound-interest-calculator'],
    inputExplanations: [
      {
        term: 'Current annual cost',
        meaning:
          'the full one-year sticker estimate you want to grow, such as tuition, required fees, housing, meals, books, supplies, transportation, and personal costs.',
      },
      { term: 'Years until start', meaning: 'how long the savings have to grow before the first school year begins.' },
      {
        term: 'Years in school',
        meaning: 'the number of school years to add. Use 2 for a two-year program or 4 for a common bachelor\'s plan.',
      },
      {
        term: 'Annual cost increase',
        meaning:
          'a what-if percent. Use a lower and higher test because tuition, housing, and fees do not rise the same way at every school.',
      },
      {
        term: 'Savings inputs',
        meaning:
          'current savings, monthly savings, and savings return estimate the money available at the start date. The calculator does not spend savings during each school year.',
      },
    ],
    priorityFaq: [
      {
        question: 'Is this the same as a net price calculator?',
        answer:
          'No. A school net price calculator uses that school\'s data and your aid details. This page is a rough planning screen that grows one annual cost number and compares it with savings.',
      },
      {
        question: 'What should I use for current annual cost?',
        answer:
          'Use the closest full cost of attendance number you can find: tuition, fees, housing, meals, books, supplies, transportation, and personal costs. If you only enter tuition, the gap will probably look too small.',
      },
      {
        question: 'Why does the calculator show a big savings gap?',
        answer:
          'The gap compares projected savings at the start date with the estimated total cost for all school years. It does not subtract future financial aid, scholarships, grants, loans, work-study, tax credits, or family payments during school.',
      },
    ],
    formulaCheck:
      'For the starter example, $28,000 today grows to about $38,319.93 for the first school year after 8 years at 4%. Four rising school years total about $162,724.22.',
    resultReading:
      'Start with total estimated cost, then check first-year cost, projected savings, and the savings gap. A big gap does not mean college is impossible; it means aid offers, scholarships, lower-cost schools, monthly savings, or loan choices still need checking.',
    doubleCheck:
      'Check whether your annual cost includes tuition and fees, housing and meals, books and supplies, transportation, and personal expenses. Then compare the result with each school\'s official net price calculator.',
    limitFollowup:
      'Use the U.S. Department of Education College Affordability and Transparency Center, College Scorecard, school net price calculators, FAFSA and aid offers, and CFPB college-cost worksheets before making a real school or borrowing decision.',
  }),
  makeFinanceTool({
    slug: 'simple-interest-calculator',
    name: 'Simple Interest Calculator',
    summary: 'Estimate simple interest and ending balance from principal, annual rate, and time.',
    description:
      'Estimate simple interest from a starting amount, annual interest rate, and time in years. See the interest amount and ending balance without compounding.',
    seoTitle: 'Simple Interest Calculator | Principal Rate Time',
    seoDescription:
      'Calculate simple interest and ending balance from principal, annual interest rate, and time, with percent-entry and compounding limits.',
    icon: 'calculator-simple-interest',
    aliases: [
      'simple interest calculator',
      'simple interest formula calculator',
      'calculate simple interest',
      'principal rate time calculator',
      'interest calculator simple',
      'simple interest calculator daily',
    ],
    formula:
      'Simple interest equals principal x annual rate x time. The ending balance equals principal plus simple interest.',
    limit:
      'This is straight principal-rate-time math. It is not APR disclosure, amortization, compound interest, daily balance interest, lender payoff math, bank disclosure, tax advice, or a quote.',
    useCases: [
      'Calculate simple interest for classwork, worksheets, or quick planning.',
      'Estimate interest when interest does not earn more interest.',
      'Compare a straight simple-interest result with compound interest.',
      'Check a principal-rate-time example before reading a loan, savings, or disclosure document.',
    ],
    examples: [
      { label: '$1k at 5%', expression: '$1,000 at 5% for 3 years', result: '$150 interest, $1,150 ending balance' },
      { label: '18 months', expression: '$2,500 at 6.25% for 1.5 years', result: '$234.38 interest, $2,734.38 ending balance' },
      { label: 'Three months', expression: '$12,000 at 8% for 0.25 years', result: '$240 interest, $12,240 ending balance' },
    ],
    relatedSlugs: ['interest-calculator', 'compound-interest-calculator', 'loan-calculator'],
    inputExplanations: [
      { term: 'Principal', meaning: 'the starting amount before interest is added.' },
      { term: 'Annual interest rate', meaning: 'the yearly rate as a percent. Enter 5 for 5%, not 0.05.' },
      { term: 'Time in years', meaning: 'how long the money earns or owes simple interest. Use 1.5 for 18 months or 0.25 for 3 months.' },
    ],
    priorityFaq: [
      {
        question: 'What is the simple interest formula?',
        answer:
          'Simple interest is principal x annual rate x time. A $1,000 principal at 5% for 3 years gives $1,000 x 0.05 x 3, or $150 interest.',
      },
      {
        question: 'Is this the same as APR?',
        answer:
          'No. APR can include fees and timing rules. This calculator only multiplies principal, annual interest rate, and years.',
      },
      {
        question: 'When should I use compound interest instead?',
        answer:
          'Use compound interest when interest gets added to the balance and then earns more interest. Simple interest keeps the interest separate from the principal.',
      },
    ],
    formulaCheck:
      'For the starter example, $1,000 x 0.05 x 3 equals $150 simple interest. The ending balance is $1,000 + $150 = $1,150.',
    resultReading:
      'Read the interest amount first, then the ending balance. The ending balance is not a payment schedule, payoff quote, APR, or compound-growth result.',
    doubleCheck:
      'Check that the rate is annual, the time is in years, and the percent is entered as 5 for 5%. Use 1.5 for 18 months and 0.25 for 3 months.',
    limitFollowup:
      'Use the lender, bank, or school worksheet when a real decision depends on APR, compounding, fees, taxes, due dates, payments, or daily balance rules.',
  }),
  makeFinanceTool({
    slug: 'cd-calculator',
    name: 'CD Calculator',
    summary: 'Estimate CD maturity value, interest earned, and early-withdrawal penalty what-if.',
    description:
      'Estimate certificate of deposit maturity value, interest earned, early withdrawal penalty, and value after penalty from deposit amount, APY, term, and penalty months.',
    seoTitle: 'CD Calculator | APY, Maturity & Penalty Estimate',
    seoDescription:
      'Estimate CD maturity value, interest earned, early withdrawal penalty, and value after penalty from deposit, APY, and term.',
    icon: 'calculator-cd',
    aliases: [
      'cd calculator',
      'certificate of deposit calculator',
      'cd interest calculator',
      'cd maturity calculator',
      'cd early withdrawal penalty calculator',
      'apy calculator cd',
      'bank cd calculator',
    ],
    formula:
      'The calculator applies APY growth over the CD term, subtracts the starting deposit to estimate interest earned, then subtracts a manual early-withdrawal penalty measured in months of simple interest for the what-if penalty scenario.',
    limit:
      'This is not a bank or credit union disclosure. It does not include exact daily compounding, APY disclosure rules, renewal choices, grace periods, call features, brokered CDs, minimum balances, insurance limits, taxes, or account-specific early withdrawal terms.',
    useCases: [
      'Estimate CD value at maturity from deposit, APY, and term.',
      'Compare term lengths with the same deposit amount.',
      'Estimate the effect of an early withdrawal penalty.',
      'Check a CD offer before reading the full bank disclosure.',
    ],
    examples: [
      { label: 'One-year CD', expression: '$10,000 deposit, 4.25% APY, 12 months, 3-month penalty', result: '$10,425 maturity value and $10,318.75 after penalty' },
      { label: 'Six-month CD', expression: '$5,000 at 3.9% APY for 6 months, 1-month penalty', result: 'About $96.57 interest and $5,080.32 after penalty' },
      { label: 'Five-year CD', expression: '$25,000 at 4.1% APY for 60 months, 6-month penalty', result: 'About $30,562.84 maturity value' },
    ],
    relatedSlugs: ['savings-calculator', 'simple-interest-calculator', 'compound-interest-calculator'],
    inputExplanations: [
      { term: 'Deposit amount', meaning: 'the money placed into the CD at the start.' },
      { term: 'APY', meaning: 'the annual percentage yield from the CD offer, entered as 4.25 for 4.25%.' },
      { term: 'Term', meaning: 'how many months the CD is meant to stay locked until maturity.' },
      { term: 'Penalty months', meaning: 'a rough early-withdrawal penalty entered as months of interest after you check the account disclosure.' },
    ],
    priorityFaq: [
      {
        question: 'What does maturity value mean for a CD?',
        answer:
          'Maturity value is the estimated balance when the CD term ends. For example, a $10,000 CD at 4.25% APY for 12 months estimates a $10,425 maturity value before taxes or account-specific rules.',
      },
      {
        question: 'How does the early withdrawal penalty estimate work?',
        answer:
          'The penalty field is a simple what-if measured in months of interest. A 3-month penalty on a $10,000 CD at 4.25% APY estimates about $106.25, leaving about $10,318.75 after penalty in the one-year example.',
      },
      {
        question: 'Is APY the same as the interest rate?',
        answer:
          'No. APY includes the effect of compounding over a year. The CD offer or bank disclosure controls the official APY, interest rate, compounding method, maturity date, renewal terms, and early-withdrawal penalty.',
      },
    ],
    formulaCheck:
      'For the starter example, $10,000 at 4.25% APY for 12 months gives a $10,425 maturity value. A 3-month simple-interest penalty is about $106.25.',
    resultReading:
      'Read maturity value as the normal end-of-term estimate. Read value after penalty as a separate early-withdrawal what-if, not the promised account payout.',
    doubleCheck:
      'Check the APY, term months, penalty months, maturity date, renewal rules, insurance status, and whether the account has a grace period or call feature.',
    limitFollowup:
      'Use the bank or credit union disclosure for exact APY, compounding, early-withdrawal penalty, renewal, grace period, tax, and insurance details.',
  }),
  makeFinanceTool({
    slug: 'bond-calculator',
    name: 'Bond Calculator',
    summary: 'Estimate coupon income, current yield, and rough yield to maturity for a plain bond.',
    description:
      'Estimate annual coupon income, total coupon payments, current yield, and rough yield to maturity from face value, market price, coupon rate, and years to maturity.',
    seoDescription:
      'Estimate bond coupon income, current yield, total coupon payments, and rough YTM from face value, market price, coupon rate, and maturity.',
    seoTitle: 'Bond Calculator | Coupon, Current Yield & Rough YTM',
    icon: 'calculator-bond',
    aliases: [
      'bond calculator',
      'bond yield calculator',
      'current yield calculator',
      'yield to maturity calculator',
      'coupon payment calculator',
      'bond interest calculator',
      'treasury bond calculator',
      'savings bond calculator',
    ],
    formula:
      'The calculator multiplies face value by coupon rate for annual coupon, divides annual coupon by market price for current yield, then uses the common approximate YTM shortcut: annual coupon plus yearly price gain or loss, divided by the average of face value and market price.',
    limit:
      'This is a plain-bond estimate. It does not solve exact market YTM, dirty price, accrued interest, callable or puttable bonds, savings bond serial-number values, TreasuryDirect redemptions, taxes, fees, reinvestment risk, credit risk, duration, convexity, liquidity, or changing market rates.',
    useCases: [
      'Estimate annual coupon income from face value and coupon rate.',
      'Compare a discount or premium price with face value.',
      'Estimate current yield and rough yield to maturity before reading a quote.',
      'Check basic bond math before reviewing official offering documents or broker data.',
    ],
    examples: [
      { label: 'Discount bond', expression: '$1,000 face, $950 price, 5% coupon, 10 years', result: '$50 annual coupon, about 5.26% current yield, and about 5.64% rough YTM' },
      { label: 'Premium bond', expression: '$1,000 face, $1,050 price, 6% coupon, 8 years', result: '$60 annual coupon and about 5.24% rough YTM' },
      { label: 'Annual coupon', expression: '$5,000 face, $4,800 price, 4.5% coupon, 5 years', result: '$225 annual coupon and about 5.41% rough YTM' },
    ],
    relatedSlugs: ['investment-calculator', 'mutual-fund-calculator', 'simple-interest-calculator'],
    inputExplanations: [
      {
        term: 'Face value',
        meaning: 'the amount the issuer is expected to repay at maturity, often called par value.',
      },
      {
        term: 'Market price',
        meaning: 'the price you are testing now. A price below face value is a discount; a price above face value is a premium.',
      },
      {
        term: 'Coupon rate',
        meaning: 'the yearly interest rate printed on the bond. A 5% coupon on $1,000 face value means $50 per year before fees or taxes.',
      },
      {
        term: 'Years to maturity',
        meaning: 'how long until the bond is expected to repay face value, assuming it is not called or sold first.',
      },
      {
        term: 'Coupon payments per year',
        meaning: 'how many coupon payments happen each year. Many bonds pay twice a year, so 2 is a common starting point.',
      },
    ],
    priorityFaq: [
      {
        question: 'Is this an exact yield to maturity calculator?',
        answer:
          'No. It uses a rough shortcut so the result is easy to understand. Exact YTM solves the present value of every coupon and principal payment against the market price, and broker quotes can also include accrued interest and fees.',
      },
      {
        question: 'Can I use this for savings bonds?',
        answer:
          'Not for official savings bond value or redemption. DataForSEO shows many people search for savings bond calculators, but EE and I savings bonds need TreasuryDirect rules, issue dates, serial-number lookup, compounding, and redemption rules that this plain-bond tool does not handle.',
      },
      {
        question: 'Why can current yield and YTM be different?',
        answer:
          'Current yield only compares annual coupon income with today\'s market price. Rough YTM also includes the price gain or loss between today\'s price and face value by maturity.',
      },
    ],
    formulaCheck:
      'For the starter example, a $1,000 face bond with a 5% coupon pays $50 per year. At a $950 market price, current yield is about 5.26%, and the rough YTM shortcut gives about 5.64%.',
    resultReading:
      'Read annual coupon as the income estimate, current yield as coupon income divided by price, and rough YTM as a quick maturity estimate. Do not read it as a broker quote or guaranteed return.',
    doubleCheck:
      'Check whether the bond is callable, the price includes accrued interest, the issuer can repay, the quote has fees, and whether a TreasuryDirect savings bond lookup is actually the tool you need.',
    limitFollowup:
      'Use official offering documents, broker fixed-income data, TreasuryDirect, EMMA, or FINRA data for exact bond terms, value, yield, call risk, taxes, fees, and redemption rules.',
  }),
  makeFinanceTool({
    slug: 'mutual-fund-calculator',
    name: 'Mutual Fund Calculator',
    seoTitle: 'Mutual Fund Calculator | Fees, Contributions & Growth',
    summary: 'Project a mutual fund balance before and after simple expense-ratio drag.',
    description:
      'Project a mutual fund balance, total contributions, estimated growth, and expense drag from starting investment, monthly contribution, expected return, expense ratio, and time.',
    seoDescription:
      'Project mutual fund balance, contributions, growth, and expense drag from starting investment, monthly contribution, return, fees, and years invested.',
    aliases: [
      'mutual fund calculator',
      'mutual fund return calculator',
      'mutual fund fee calculator',
      'mutual fund expense ratio calculator',
      'sip mutual fund calculator',
      'mutual fund calculator usa',
      'mutual fund lump sum calculator',
    ],
    icon: 'calculator-mutual-fund',
    formula:
      'The calculator projects the balance with the expected annual return, subtracts the annual expense ratio from that return for a simple net-return estimate, then compares the two balances.',
    limit:
      'This is a hypothetical projection. It does not include actual fund performance, share price or NAV movement, front-end or back-end loads, purchase or redemption fees, 12b-1 fees, trading costs, taxable distributions, capital-gain distributions, changing expenses, market losses, fund closure, liquidity limits, or investment advice.',
    useCases: [
      'Project a mutual fund balance with recurring contributions.',
      'Estimate how an expense ratio can reduce a projection.',
      'Compare low-fee and higher-fee scenarios before reading a fund prospectus.',
      'Separate contributions from estimated investment growth.',
    ],
    examples: [
      { label: 'Index-style fund', expression: '$5,000 start, $250/month, 7% return, 0.5% expense, 20 years', result: 'About $140,887.47 after expenses vs. $150,425.36 before expenses' },
      { label: 'Higher fee', expression: '$10,000 start, $300/month, 7% return, 1.2% expense, 15 years', result: 'About $109,593.09 after expenses and about $13,985.06 expense drag' },
      { label: 'Small start', expression: '$1,000 start, $100/month, 6% return, 0.3% expense, 10 years', result: 'About $17,889.72 after expenses from $13,000 contributed' },
    ],
    relatedSlugs: ['investment-calculator', 'compound-interest-calculator', 'bond-calculator'],
    inputExplanations: [
      {
        term: 'Starting investment',
        meaning: 'The money already invested. This can act like a lump-sum starting amount.',
      },
      {
        term: 'Monthly contribution',
        meaning: 'The recurring deposit you want to test. Some people call this SIP-style investing, but this tool does not check any country-specific fund rules.',
      },
      {
        term: 'Expected annual return',
        meaning: 'A what-if return before expenses. It is not a promise and can be negative in real markets.',
      },
      {
        term: 'Expense ratio',
        meaning: 'The annual operating-cost percent you want to subtract from the return assumption. Real funds can also have loads, redemption fees, and taxes.',
      },
      {
        term: 'Years invested',
        meaning: 'How long the projection runs. Longer time makes both compounding and fee drag easier to see.',
      },
    ],
    priorityFaq: [
      {
        question: 'Is this the same as a real mutual fund return?',
        answer:
          'No. It is a what-if projection. Real mutual funds move with the securities they own, and the next share value is based on NAV, not a smooth return line.',
      },
      {
        question: 'Does this include fund taxes and distributions?',
        answer:
          'No. Taxable accounts can owe tax on dividends and capital-gain distributions, even when distributions are reinvested. This calculator keeps those outside the estimate.',
      },
      {
        question: 'Why does the expense ratio matter so much?',
        answer:
          'An expense ratio is charged every year, so the drag compounds over time. A small-looking difference can turn into a large dollar gap in a long projection.',
      },
    ],
    formulaCheck:
      'For the starter example, $5,000 plus $250/month at 7% for 20 years gives about $150,425.36 before expenses. With a 0.5% expense ratio, the simple net-return estimate is 6.5%, giving about $140,887.47 after expenses.',
    resultReading:
      'Read projected fund balance after expenses as the main what-if number, balance before expenses as the no-expense comparison, and estimated expense drag as the gap caused by the fee assumption.',
    doubleCheck:
      'Check the fund prospectus, expense ratio, share class, sales load, redemption fees, distributions, tax account type, investment objective, risk level, and whether the return assumption is realistic.',
    limitFollowup:
      'Use the fund prospectus, broker data, FINRA Fund Analyzer, SEC/Investor.gov materials, and tax records before making a real investment or tax decision.',
  }),
  makeFinanceTool({
    slug: 'roth-ira-calculator',
    name: 'Roth IRA Calculator',
    seoTitle: 'Roth IRA Calculator | 2026 Limits & Growth',
    summary: 'Project Roth IRA growth before checking IRS contribution and income rules.',
    description:
      'Project future Roth IRA balance, total contributions, and estimated growth from current balance, annual contribution, expected annual return, and years to grow.',
    seoDescription:
      'Project Roth IRA growth with current balance, annual contribution, expected return, years to grow, 2026 IRA limits, and clear eligibility cautions.',
    aliases: [
      'roth ira calculator',
      'roth ira growth calculator',
      'roth ira contribution calculator',
      'roth ira calculator 2026',
      'roth ira calculator by age',
      'roth ira compound interest calculator',
      '$100 a month in a roth ira for 30 years',
    ],
    icon: 'calculator-roth-ira',
    formula:
      'The calculator divides the annual contribution into monthly deposits, compounds the current balance monthly using the expected annual return, adds each monthly deposit at the end of the month, then separates total contributions from estimated growth.',
    limit:
      'This is a projection, not tax advice. It does not verify taxable compensation, MAGI, filing status, IRS contribution limits, 2026 Roth IRA phase-outs, qualified distribution rules, the 5-year rule, early-withdrawal penalties, taxes, investment fees, or market risk.',
    useCases: [
      'Project Roth IRA growth from annual contributions.',
      'Compare contribution amounts, including a 2026 limit-style scenario.',
      'Test smaller habits such as $100 a month in a Roth IRA for 30 years.',
      'Separate total contributions from estimated growth.',
      'Check a retirement savings scenario before reviewing IRS MAGI and contribution limits.',
    ],
    examples: [
      { label: '2026 limit-style saving', expression: '$12,000 balance, $7,500/year, 7%, 25 years', result: 'About $574,999.83 projected balance from $199,500 contributed' },
      { label: '$100 per month habit', expression: '$0 balance, $1,200/year, 7%, 30 years', result: 'About $121,997.10 projected balance from $36,000 contributed' },
      { label: 'Age 50+ catch-up scenario', expression: '$85,000 balance, $8,600/year, 5%, 10 years', result: 'About $251,281.44 projected balance from $171,000 contributed' },
    ],
    relatedSlugs: ['ira-calculator', 'retirement-calculator', '401k-calculator'],
    inputExplanations: [
      {
        term: 'Current balance',
        meaning: 'The Roth IRA money already in the account before this projection starts.',
      },
      {
        term: 'Annual contribution',
        meaning: 'The yearly amount you want to test. The calculator spreads it into monthly deposits; it does not prove that the IRS lets you contribute that amount.',
      },
      {
        term: 'Expected annual return',
        meaning: 'A what-if growth rate before investment fees and market losses. It is not a promise.',
      },
      {
        term: 'Years to grow',
        meaning: 'How long the projection runs. More years gives compounding more time, but it also gives markets more time to move up or down.',
      },
    ],
    priorityFaq: [
      {
        question: 'Does this check the 2026 Roth IRA contribution limit?',
        answer:
          'No. It lets you test a number. For 2026, the general IRA limit is $7,500. If you are 50 or older, the catch-up amount is $1,100, making $8,600 total. Your taxable compensation still matters.',
      },
      {
        question: 'What Roth IRA income limits should I check for 2026?',
        answer:
          'The IRS says direct Roth IRA contributions phase out by MAGI. For 2026, the phase-out range is $153,000 to $168,000 for single or head-of-household filers and $242,000 to $252,000 for married filing jointly.',
      },
      {
        question: 'Does the calculator prove my withdrawals will be tax-free?',
        answer:
          'No. Qualified distributions usually depend on rules such as the 5-year clock and being at least 59½, plus other IRS exceptions. This page only projects growth from your inputs.',
      },
      {
        question: 'What happens with $100 a month in a Roth IRA for 30 years?',
        answer:
          'With $0 starting balance, $1,200 per year, a 7% expected return, and 30 years, the calculator projects about $121,997.10 from $36,000 contributed. Real returns will not move in a smooth line.',
      },
    ],
    formulaCheck:
      'For the 2026 limit-style example, $12,000 current balance plus $7,500 per year is treated as $625 per month. At 7% for 25 years, the projection is about $574,999.83, with $199,500 counted as total contributions and about $375,499.83 as estimated growth.',
    resultReading:
      'Read projected Roth IRA balance as the what-if ending balance, total contributions as current balance plus deposits, and estimated growth as the amount created by the return assumption.',
    doubleCheck:
      'Check taxable compensation, MAGI, filing status, the 2026 IRS limit, phase-out range, excess-contribution rules, qualified distribution rules, the 5-year clock, tax treatment, investment fees, and market risk before acting.',
    limitFollowup:
      'Use IRS Roth IRA pages, IRS Topic 309, IRS 2026 limit guidance, and a tax professional when contribution eligibility or withdrawal tax treatment matters.',
  }),
  makeFinanceTool({
    slug: 'ira-calculator',
    name: 'IRA Calculator',
    seoTitle: 'IRA Calculator | 2026 Limits & Growth',
    summary: 'Project traditional or Roth IRA growth before checking IRS contribution and deduction rules.',
    description:
      'Project future IRA balance, total contributions, and estimated growth from current balance, annual contribution, expected annual return, and years to grow.',
    seoDescription:
      'Project IRA growth from balance, annual contribution, expected return, and years, with 2026 IRS contribution and deduction cautions kept separate.',
    icon: 'calculator-ira',
    aliases: [
      'ira calculator',
      'traditional ira calculator',
      'ira contribution calculator',
      'ira growth calculator',
      'ira calculator 2026',
      'simple ira calculator',
      'sep ira calculator',
      '401k ira calculator',
    ],
    formula:
      'The calculator divides annual contribution into 12 monthly deposits, compounds the current IRA balance monthly, adds deposits at the end of each month, then separates total contributions from estimated growth.',
    limit:
      'This is a projection, not tax advice. It does not verify taxable compensation, traditional IRA deduction limits, workplace retirement plan coverage, Roth IRA income limits, 2026 IRS contribution limits, required minimum distributions, penalties, taxes, fees, or market risk.',
    useCases: [
      'Project traditional IRA growth from current balance and annual contributions.',
      'Test a 2026 limit-style IRA contribution scenario before checking IRS rules.',
      'Compare contribution amounts, returns, and time horizons.',
      'Estimate how much of the projection comes from deposits versus growth.',
      'Create a planning number before checking traditional IRA deduction, Roth IRA eligibility, or rollover rules.',
    ],
    examples: [
      { label: '2026 limit-style IRA', expression: '$25,000 balance, $7,500/year, 6.5%, 20 years', result: 'About $397,924.25 projected balance from $175,000 contributed' },
      { label: 'Age 50+ catch-up scenario', expression: '$60,000 balance, $8,600/year, 6%, 12 years', result: 'About $273,652.67 projected balance from $163,200 contributed' },
      { label: 'Small contribution', expression: '$5,000 balance, $3,000/year, 7%, 30 years', result: 'About $345,575.24 projected balance from $95,000 contributed' },
    ],
    relatedSlugs: ['roth-ira-calculator', 'retirement-calculator', '401k-calculator'],
    inputExplanations: [
      { term: 'Current balance', meaning: 'the IRA money already in the account before this projection starts.' },
      { term: 'Annual contribution', meaning: 'the amount you want to add over one year. The calculator spreads it across 12 monthly deposits.' },
      { term: 'Expected annual return', meaning: 'the yearly growth assumption entered as a percent, such as 6.5 for 6.5%.' },
      { term: 'Years to grow', meaning: 'how many years the current balance and future deposits stay in the projection.' },
    ],
    priorityFaq: [
      {
        question: 'Does this check the 2026 IRA contribution limit?',
        answer:
          'No. The calculator lets you test any annual contribution. The IRS says total 2026 contributions across traditional IRAs and Roth IRAs are generally limited to $7,500, or $8,600 if age 50+ because of the $1,100 catch-up amount, or taxable compensation if that is smaller.',
      },
      {
        question: 'Does this tell me whether a traditional IRA contribution is deductible?',
        answer:
          'No. Traditional IRA deductibility can depend on filing status, MAGI, and whether you or your spouse are covered by a retirement plan at work. The calculator only projects growth from the numbers entered.',
      },
      {
        question: 'Can I use this for a Roth IRA?',
        answer:
          'You can use the math as a rough growth projection, but Roth IRA eligibility and tax treatment have separate rules. Use the Roth IRA Calculator when you want the page to keep Roth MAGI, phase-out, qualified-distribution, and 5-year-rule cautions closer to the result.',
      },
      {
        question: 'What does the 2026 limit-style example show?',
        answer:
          '$25,000 starting balance plus $7,500 per year is treated as $625 monthly deposits. At 6.5% for 20 years, that projects about $397,924.25, with $175,000 counted as total contributions and about $222,924.25 as estimated growth.',
      },
    ],
    formulaCheck:
      'For the 2026 limit-style example, $25,000 current balance plus $7,500 per year is treated as $625 per month. At 6.5% for 20 years, the projection is about $397,924.25, with $175,000 counted as total contributions and about $222,924.25 as estimated growth.',
    resultReading:
      'Read projected IRA balance as the what-if ending balance, total contributions as current balance plus deposits, and estimated growth as the amount created by the expected annual return assumption.',
    doubleCheck:
      'Check taxable compensation, 2026 IRS contribution limits, traditional IRA deduction rules, workplace retirement plan coverage, Roth IRA phase-outs, RMD rules, tax treatment, penalties, fees, and market risk before acting.',
    limitFollowup:
      'Use IRS IRA contribution limits, IRS deduction-limit guidance, IRS annual COLA tables, Investor.gov IRA basics, and a tax professional when contribution eligibility, deductibility, or withdrawal tax treatment matters.',
  }),
  makeFinanceTool({
    slug: 'vat-calculator',
    name: 'VAT Calculator',
    seoTitle: 'VAT Calculator | Add or Remove VAT',
    summary: 'Add VAT to a net price or remove VAT from a gross price without mixing up the mode.',
    description:
      'Add VAT to a net amount or remove VAT from a gross amount, then see the net amount, VAT amount, gross amount, and rate used.',
    seoDescription:
      'Add or remove VAT from a price, with 20%, 5%, and custom-rate examples plus clear net, VAT amount, and gross amount checks.',
    icon: 'calculator-vat',
    aliases: [
      'vat calculator',
      'vat calculator uk',
      '20 vat calculator',
      'reverse vat calculator',
      'reverse vat calculator uk',
      'how to calculate vat on calculator',
      '5% vat calculator',
      '7.5% vat calculator',
    ],
    formula:
      'To add VAT, the calculator multiplies net amount by the VAT rate, then adds that VAT amount to the net price. To remove VAT, it divides the gross price by one plus the VAT rate, then subtracts the net amount from the gross amount to find the VAT portion.',
    limit:
      'This uses the manual VAT rate you enter. It does not choose the legal rate for a country, product, invoice, export, exemption, VAT registration threshold, reverse charge rule, or tax return.',
    useCases: [
      'Add 20% VAT to a before-tax price.',
      'Remove 20% VAT from a tax-inclusive receipt total.',
      'Check 5%, 7.5%, 10%, or another custom VAT rate.',
      'Separate net amount, VAT amount, and gross amount before checking an invoice.',
      'Compare VAT math with U.S.-style sales tax when a page mentions both.',
    ],
    examples: [
      { label: 'Add VAT', expression: '$100 net at 20% VAT', result: '$120 gross and $20 VAT' },
      { label: 'Remove VAT', expression: '$120 gross at 20% VAT', result: '$100 net and $20 VAT' },
      { label: 'Lower rate', expression: '$210 gross at 5% VAT', result: '$200 net and $10 VAT' },
    ],
    relatedSlugs: ['sales-tax-calculator', 'percentage-calculator', 'discount-calculator'],
    inputExplanations: [
      { term: 'Amount', meaning: 'the price you already know. In add mode it is the net price; in remove mode it is the gross price.' },
      { term: 'VAT rate', meaning: 'the tax rate entered as a normal percent, such as 20 for 20% or 5 for 5%.' },
      { term: 'Mode', meaning: 'add VAT when the price is before tax, or remove VAT when the price already includes VAT.' },
    ],
    priorityFaq: [
      {
        question: 'How do I add 20% VAT to $100?',
        answer:
          'Use add mode, enter 100 as the amount, and enter 20 as the VAT rate. The calculator shows $20 VAT and $120 gross.',
      },
      {
        question: 'How do I remove 20% VAT from $120?',
        answer:
          'Use remove mode, enter 120 as the amount, and enter 20 as the VAT rate. The calculator divides by 1.20, so the net amount is $100 and the VAT amount is $20.',
      },
      {
        question: 'Can I use this as a UK VAT calculator?',
        answer:
          'Yes for the math if you enter the right UK rate yourself. GOV.UK lists 20% as the standard rate, with 5% reduced and 0% zero-rate categories, but the item or service still decides which rate applies.',
      },
      {
        question: 'Is VAT the same as U.S. sales tax?',
        answer:
          'No. The math can look similar on a receipt, but VAT and sales tax are different systems. If you are checking a U.S. sale, use the Sales Tax Calculator instead.',
      },
    ],
    formulaCheck:
      'For $100 at 20%, add mode multiplies 100 x 0.20 to get $20 VAT and $120 gross. For $120 with 20% included, remove mode divides 120 by 1.20 to get $100 net and $20 VAT.',
    resultReading:
      'Read net amount as the before-VAT price, VAT amount as the tax portion, gross amount as the price including VAT, and rate used as the percent entered.',
    doubleCheck:
      'Check the mode first. Add starts with net amount; remove starts with gross amount. Then check the rate, country, product type, invoice wording, exemption, reverse charge rule, and whether VAT or sales tax is the right system.',
    limitFollowup:
      'Use the official tax authority for the country, GOV.UK or EU VAT guidance when relevant, and a tax professional when registration, invoices, exemptions, cross-border sales, or returns matter.',
  }),
  makeFinanceTool({
    slug: 'cash-back-or-low-interest-calculator',
    name: 'Cash Back or Low Interest Calculator',
    seoTitle: 'Cash Back or Low Interest Calculator | Rebate vs APR',
    seoDescription:
      'Compare a cash-back rebate with a low-interest APR offer. See cash-back value, total cost, savings, and dealer-offer limits.',
    summary: 'Compare a cash-back rebate with a low-interest APR offer by total cost.',
    description:
      'Compare a cash-back rebate with a low-interest APR offer over the same payoff term. See which path has the lower estimated total cost.',
    icon: 'calculator-cash-back',
    aliases: ['rebate vs low APR calculator', 'cash back vs low interest calculator', 'auto rebate calculator', '0 APR vs rebate calculator', 'dealer incentive calculator'],
    formula:
      'The calculator estimates total paid with the cash-back APR, subtracts the rebate value, then compares that net cost with the total paid under the low-interest APR.',
    limit:
      'This is a simplified offer comparison. It does not include taxes, dealer fees, add-ons, trade-in rules, model restrictions, offer expiration dates, credit approval, or rebate eligibility rules.',
    useCases: [
      'Compare a dealer cash-back rebate with a low APR offer.',
      'See whether a larger rebate beats a lower rate over your payoff term.',
      'Compare total cost before judging the deal by monthly payment.',
      'Check the math before reading the official incentive terms.',
    ],
    examples: [
      { label: 'Low APR wins', expression: '$32,000, 60 months, 4% cash back at 7.2% vs 3.9% APR', result: 'Low-interest offer saves about $1,646.59' },
      { label: 'Rebate wins', expression: '$28,000, 36 months, 8% cash back at 5.5% vs 3.9% APR', result: 'Cash-back offer saves about $1,517.89' },
      { label: 'Short payoff rebate', expression: '$30,000, 36 months, 10% cash back at 6% vs 3.9% APR', result: 'Cash-back offer saves about $1,982.19' },
    ],
    relatedSlugs: ['auto-loan-calculator', 'interest-rate-calculator', 'loan-calculator'],
    inputExplanations: [
      {
        term: 'Purchase amount',
        meaning:
          'the agreed price being compared before this simple calculator applies the rebate math. Taxes, fees, down payment, trade-in, and add-ons are not included unless you fold them into the amount yourself.',
      },
      { term: 'Payoff term', meaning: 'the number of months both offers use, such as 36, 48, 60, or 72 months.' },
      { term: 'Cash back percent', meaning: 'the rebate percent for the cash-back path, entered as 4 for 4%, not 0.04.' },
      { term: 'APR with cash back', meaning: 'the annual percentage rate used when you take the rebate instead of the special low-rate offer.' },
      { term: 'Low-interest APR', meaning: 'the promotional APR used when you skip the rebate and take the lower-rate financing offer.' },
    ],
    priorityFaq: [
      {
        question: 'Should I choose cash back or low interest?',
        answer:
          'Choose the option with the lower total cost after you use the same price and same payoff term. A low APR can win on a long loan, but a large rebate can win on a short loan or when the rate gap is small.',
      },
      {
        question: 'Does this include taxes, fees, down payment, or trade-in value?',
        answer:
          'No. This calculator compares the incentive math only. Use the Auto Loan Calculator for a fuller car-payment estimate that includes tax, fees, down payment, and trade-in value.',
      },
      {
        question: 'Can a 0% APR offer still be worse than cash back?',
        answer:
          'Yes. If the rebate is large enough, the loan is short enough, or your outside financing is close to the promo APR, cash back may cost less overall. The calculator is built to test that exact tradeoff.',
      },
    ],
    formulaCheck:
      'For the $32,000 example, the 4% rebate is $1,280. The calculator compares the cash-back loan total after subtracting that rebate with the 3.9% low-interest total paid.',
    resultReading:
      'Read the winner first, then check estimated savings, cash-back value, cash-back net cost, and low-interest total cost. The monthly payment can be useful, but total cost decides the winner here.',
    doubleCheck:
      'Check that both offers use the same price and payoff term. Then read the dealer rules for credit approval, model limits, rebate eligibility, taxes, add-ons, offer dates, and whether the rebate can be combined with outside financing.',
    limitFollowup:
      'Get the out-the-door price and financing terms in writing before relying on the estimate. FTC and CFPB guidance both warn that incentives, APR, add-ons, and monthly payment framing can change the real deal.',
  }),
  makeFinanceTool({
    slug: 'auto-lease-calculator',
    name: 'Auto Lease Calculator',
    seoTitle: 'Auto Lease Calculator | Payment, Money Factor, Residual',
    seoDescription:
      'Estimate a car lease payment from price, residual value, money factor, fees, tax, and term, with lease-end limits.',
    summary: 'Estimate a car lease payment by separating depreciation, finance charge, and tax.',
    description:
      'Estimate a car lease payment from vehicle price, residual value, money factor, down payment, trade-in, fees, tax, and term.',
    icon: 'calculator-auto-lease',
    aliases: ['car lease payment calculator', 'auto lease payment calculator', 'money factor calculator', 'residual value lease calculator', 'lease payment estimator'],
    formula:
      'Adjusted capitalized cost = vehicle price + fees - down payment - trade-in. Depreciation fee = (adjusted cost - residual value) / term. Finance fee = (adjusted cost + residual value) x money factor. Monthly payment = depreciation fee + finance fee + tax.',
    limit:
      'This is a lease-payment estimate, not a contract review. It does not verify mileage limits, wear charges, registration, insurance, maintenance, security deposits, lease-end buyout terms, early termination charges, credit approval, or every fee in the signed lease.',
    useCases: [
      'Estimate a monthly car lease payment before reading the contract.',
      'Separate depreciation fee, finance fee, and estimated tax.',
      'Compare residual value, lease term, money factor, down payment, and trade-in changes.',
      'Check whether a low monthly lease quote hides a large amount due at signing or strict mileage limits.',
    ],
    examples: [
      { label: '36-month lease', expression: '$36,000 price, $21,000 residual, $2,500 down, 0.0025 money factor', result: 'About $542.97/month' },
      { label: 'Higher residual', expression: '$42,000 price, $28,000 residual, $3,000 down, $1,500 trade-in, 0.0022 money factor', result: 'About $475.04/month' },
      { label: '48-month lease', expression: '$30,000 price, $16,000 residual, $1,500 down, 0.0028 money factor', result: 'About $432.70/month' },
    ],
    relatedSlugs: ['auto-loan-calculator', 'lease-calculator', 'cash-back-or-low-interest-calculator'],
    inputExplanations: [
      { term: 'Vehicle price', meaning: 'the negotiated price or gross capitalized cost before this simple estimate subtracts down payment and trade-in value.' },
      { term: 'Residual value', meaning: 'the expected lease-end value in dollars. Enter the dollar amount from the quote, not the residual percent.' },
      { term: 'Money factor', meaning: 'the lease finance-rate factor shown as a small decimal, such as 0.0025. Enter it as shown in the quote.' },
      { term: 'Lease term', meaning: 'the number of months in the lease, such as 24, 36, or 48 months.' },
      { term: 'Fees and tax rate', meaning: 'fees added into the estimate and the tax rate applied to the pretax monthly lease payment.' },
    ],
    priorityFaq: [
      {
        question: 'What is residual value in a car lease?',
        answer:
          'Residual value is the estimated value of the car at the end of the lease. A higher residual value usually lowers the depreciation part of the monthly payment, but it can also affect the buyout price if the lease has a purchase option.',
      },
      {
        question: 'What is a money factor?',
        answer:
          'Money factor is the lease finance factor used to estimate the rent-charge part of the payment. It is not typed like an APR. If the quote says 0.0025, enter 0.0025.',
      },
      {
        question: 'Why can my dealer lease quote be different?',
        answer:
          'A signed quote can include acquisition fees, disposition fees, security deposit, registration, taxes, mileage rules, wear charges, rebates, credit approval, and add-ons that this simple calculator cannot verify.',
      },
    ],
    formulaCheck:
      'For the $36,000 example, adjusted cost is $34,450 after $950 fees and $2,500 down. The calculator estimates about $373.61 depreciation fee, $138.63 finance fee, and $30.73 tax for about $542.97/month.',
    resultReading:
      'Read the monthly payment, then check adjusted capitalized cost, depreciation fee, finance fee, and total lease cost. A lower monthly payment can still be a worse deal if the amount due at signing, mileage limit, or lease-end fees are high.',
    doubleCheck:
      'Ask for the amount due at signing, total lease amount, mileage allowance, excess-mile charge, acquisition fee, disposition fee, security deposit, wear rules, purchase option, and early termination rules in writing.',
    limitFollowup:
      'Use this for lease math, not legal or dealer-contract advice. CFPB and FTC guidance both warn that lease ads and low monthly payment offers can leave out important costs unless you get the full terms in writing.',
  }),
  makeFinanceTool({
    slug: 'depreciation-calculator',
    name: 'Depreciation Calculator',
    seoTitle: 'Depreciation Calculator | Book Value And Expense',
    seoDescription:
      'Estimate straight-line or declining-balance depreciation, accumulated depreciation, annual expense, and book value.',
    summary: 'Estimate depreciation expense, accumulated depreciation, and book value.',
    description:
      'Estimate straight-line or declining-balance depreciation from cost, salvage value, useful life, asset age, and method.',
    icon: 'calculator-depreciation',
    aliases: ['depreciation expense calculator', 'straight line depreciation calculator', 'declining balance depreciation calculator', 'book value calculator', 'accumulated depreciation calculator'],
    formula:
      'Depreciable amount = cost - salvage value. Straight-line depreciation divides depreciable amount by useful life. Declining balance applies the selected rate to remaining book value each year while stopping at salvage value.',
    limit:
      'This is simplified book-value math. It does not determine IRS MACRS depreciation, section 179, bonus depreciation, class life, placed-in-service date, partial-year conventions, listed property rules, recapture, accounting policy, or tax compliance.',
    useCases: [
      'Estimate book value after straight-line depreciation.',
      'Compare straight-line and declining-balance depreciation.',
      'Check accumulated depreciation for a simple asset example.',
      'Separate learning math from IRS tax depreciation rules.',
    ],
    examples: [
      { label: 'Straight-line asset', expression: '$12,000 cost, $2,000 salvage, 5-year life, age 2', result: '$8,000 book value and $4,000 accumulated depreciation' },
      { label: 'Declining balance', expression: '$25,000 cost, $5,000 salvage, 25% rate, age 3', result: 'About $10,546.88 book value' },
      { label: 'One-year check', expression: '$6,000 cost, $1,000 salvage, 5-year life, age 1', result: '$5,000 book value after one year' },
    ],
    relatedSlugs: ['average-return-calculator', 'business-loan-calculator', 'finance-calculator'],
    inputExplanations: [
      { term: 'Original cost', meaning: 'the starting cost or recorded cost basis for this simple book-value estimate.' },
      { term: 'Salvage value', meaning: 'the estimated value left at the end of useful life. The calculator does not depreciate below this amount.' },
      { term: 'Useful life', meaning: 'how many years the asset is expected to be used in this simple model.' },
      { term: 'Asset age', meaning: 'how many years of depreciation to count so far.' },
      { term: 'Method', meaning: 'straight-line spreads depreciation evenly; declining balance counts more depreciation earlier.' },
    ],
    priorityFaq: [
      {
        question: 'Is this IRS tax depreciation?',
        answer:
          'No. This calculator teaches straight-line and declining-balance book-value math. IRS depreciation can depend on MACRS tables, class life, placed-in-service date, conventions, section 179, bonus depreciation, and recapture rules.',
      },
      {
        question: 'What is accumulated depreciation?',
        answer:
          'Accumulated depreciation is the total depreciation counted so far. Book value is original cost minus accumulated depreciation.',
      },
      {
        question: 'Why does salvage value matter?',
        answer:
          'Salvage value is the amount the asset is expected to be worth at the end. This calculator stops depreciation at salvage value so the book value does not go below the floor you entered.',
      },
    ],
    formulaCheck:
      'For the $12,000 straight-line example, depreciable amount is $10,000. Over 5 years, annual depreciation is $2,000. After 2 years, accumulated depreciation is $4,000 and book value is $8,000.',
    resultReading:
      'Read book value first, then check accumulated depreciation and annual depreciation. If you choose declining balance, early years usually have larger depreciation than later years.',
    doubleCheck:
      'Check that salvage value is lower than cost, useful life is realistic, and asset age is not being used as a tax placed-in-service rule. Use official IRS guidance or a tax pro before filing depreciation.',
    limitFollowup:
      'Use this for learning and rough book-value checks. Do not use it as a MACRS, section 179, bonus depreciation, recapture, or compliance calculator.',
  }),
  makeFinanceTool({
    slug: 'average-return-calculator',
    name: 'Average Return Calculator',
    seoTitle: 'Average Return Calculator | CAGR And Net Gain',
    seoDescription:
      'Estimate net gain, cumulative return, simple average annual return, and CAGR from starting value, ending value, years, contributions, and withdrawals.',
    summary: 'Estimate net gain, cumulative return, average annual return, and CAGR.',
    description:
      'Estimate simple investment performance from starting value, ending value, years, contributions, and withdrawals.',
    icon: 'calculator-average-return',
    aliases: ['average annual return calculator', 'cagr calculator', 'cumulative return calculator', 'investment return calculator', 'net gain calculator'],
    formula:
      'Net gain = ending value + withdrawals - starting value - contributions. Cumulative return divides net gain by starting value plus contributions. Simple average annual return divides cumulative return by years. CAGR compares starting value with ending value only, so it is not cash-flow adjusted.',
    limit:
      'This is a simple return check, not a full performance report. It does not calculate time-weighted return, money-weighted return, XIRR, exact cash-flow timing, dividends, fees, taxes, inflation, volatility, benchmark fit, or investment suitability.',
    useCases: [
      'Estimate average annual return from a beginning and ending value.',
      'Adjust a simple return for extra contributions or withdrawals.',
      'Compare simple average return with a basic CAGR check.',
      'Check rough investment performance without saving personal data.',
    ],
    examples: [
      { label: 'Five-year return', expression: '$10,000 to $16,000 over 5 years with $2,000 added', result: '$4,000 net gain, 33.33% cumulative return, and 6.67% simple average return' },
      { label: 'With withdrawals', expression: '$25,000 to $31,000 over 4 years, $3,000 added, $1,500 withdrawn', result: '$4,500 net gain and 4.02% simple average return' },
      { label: 'No contributions', expression: '$8,000 to $12,000 over 3 years', result: '50% cumulative return and 14.47% CAGR' },
    ],
    relatedSlugs: ['investment-calculator', 'compound-interest-calculator', 'mutual-fund-calculator'],
    inputExplanations: [
      { term: 'Starting value', meaning: 'the account or investment value at the beginning of the period.' },
      { term: 'Ending value', meaning: 'the value at the end of the period before this quick return check.' },
      { term: 'Years', meaning: 'the full length of the measurement period.' },
      { term: 'Contributions', meaning: 'money added during the period. This quick estimate does not know the exact dates of each deposit.' },
      { term: 'Withdrawals', meaning: 'money removed during the period. The calculator adds it back when finding net gain.' },
    ],
    priorityFaq: [
      {
        question: 'Is average annual return the same as CAGR?',
        answer:
          'No. Simple average annual return divides cumulative return by years. CAGR shows the steady yearly growth rate from starting value to ending value, but this calculator does not adjust CAGR for contribution or withdrawal timing.',
      },
      {
        question: 'Why do contributions change the result?',
        answer:
          'Money you add is not investment growth. The calculator subtracts contributions when finding net gain so a deposit is not counted as return.',
      },
      {
        question: 'When should I use IRR instead?',
        answer:
          'Use IRR or XIRR when cash-flow timing matters, such as many deposits and withdrawals on different dates. This page is a quick estimate, not a money-weighted performance report.',
      },
    ],
    formulaCheck:
      'For the $10,000 to $16,000 example with $2,000 added, net gain is $4,000. The invested base is $12,000, so cumulative return is 33.33% and simple average annual return over 5 years is 6.67%.',
    resultReading:
      'Read net gain first, then cumulative return, then simple average annual return. Use CAGR as a separate growth-rate check, especially when there were no deposits or withdrawals.',
    doubleCheck:
      'Check whether deposits, withdrawals, dividends, fees, taxes, and the time period are entered the same way for every investment you compare.',
    limitFollowup:
      'For official statements, fund comparisons, tax reports, or uneven cash flows, use broker records, fund reports, or an IRR/XIRR method instead of this shortcut.',
  }),
  makeFinanceTool({
    slug: 'margin-calculator',
    name: 'Margin Calculator',
    seoTitle: 'Margin Calculator | Profit Margin And Markup',
    seoDescription:
      'Calculate profit, profit margin, and markup from selling price or revenue and direct cost. See the difference between margin and markup with examples.',
    summary: 'Calculate profit, profit margin, and markup from selling price and cost.',
    description:
      'Check gross profit, profit margin, and markup from a selling price or revenue amount and the direct cost behind it.',
    icon: 'calculator-margin',
    aliases: ['profit margin calculator', 'gross margin calculator', 'markup calculator', 'selling price margin calculator', 'gross profit calculator'],
    formula:
      'Profit = revenue - cost. Profit margin = profit / revenue. Markup = profit / cost. Margin uses the selling price as the base; markup uses cost as the base.',
    limit:
      'This is gross pricing math, not a full accounting statement. It does not include overhead allocation, labor you did not enter, shipping, refunds, payment fees, taxes, inventory rules, net margin, brokerage margin accounts, or borrowed-money investing risk.',
    useCases: [
      'Calculate product or service profit margin.',
      'Compare margin and markup side by side.',
      'Check pricing math before changing a selling price.',
      'Estimate how direct cost changes affect gross profit.',
    ],
    examples: [
      { label: 'Retail item', expression: '$100 price and $60 cost', result: '40% margin and 66.67% markup' },
      { label: 'Service job', expression: '$2,500 revenue and $1,400 direct cost', result: '$1,100 profit, 44% margin, and 78.57% markup' },
      { label: 'Low margin', expression: '$1,200 revenue and $1,050 cost', result: '$150 profit, 12.5% margin, and 14.29% markup' },
    ],
    relatedSlugs: ['percentage-calculator', 'discount-calculator', 'business-loan-calculator'],
    inputExplanations: [
      { term: 'Revenue or selling price', meaning: 'the amount charged for the item, job, order, or sale before you subtract the cost you want to test.' },
      { term: 'Cost', meaning: 'the direct cost you want to compare with the sale, such as item cost, material cost, or a job cost you already know.' },
    ],
    priorityFaq: [
      {
        question: 'Why are margin and markup different?',
        answer:
          'They use different bases. Margin divides profit by selling price. Markup divides profit by cost. A $100 sale with $60 cost has $40 profit, 40% margin, and 66.67% markup.',
      },
      {
        question: 'Is this gross margin or net margin?',
        answer:
          'This is a gross-style pricing check because it compares revenue with the cost you enter. Net margin needs more business expenses, such as overhead, payroll, taxes, software, rent, refunds, and payment fees.',
      },
      {
        question: 'Should I include sales tax in revenue?',
        answer:
          'Only include sales tax if that is how you track the sale in your own records. For clean pricing math, many people use the before-tax selling price and keep tax separate.',
      },
    ],
    formulaCheck:
      'For a $100 selling price and $60 cost, profit is $40. Margin is $40 / $100 = 40%. Markup is $40 / $60 = 66.67%.',
    resultReading:
      'Read profit dollars first, then margin percent, then markup percent. If markup looks bigger than margin, that is expected because cost is the smaller base.',
    doubleCheck:
      'Use the same unit or time period for revenue and cost. Do not compare one item of revenue with a full month of costs.',
    limitFollowup:
      'For tax, inventory, net profit, or financial statements, use your accounting records and include every cost your business actually needs to count.',
  }),
  makeFinanceTool({
    slug: 'discount-calculator',
    name: 'Discount Calculator',
    seoTitle: 'Discount Calculator | Final Price And Savings',
    seoDescription:
      'Calculate final price, total savings, effective discount, and tax after one discount or stacked discounts. Check coupon math before checkout.',
    summary: 'Find final price after one or two discounts and optional tax.',
    description:
      'Estimate final checkout price, total savings, effective discount percentage, and tax after one discount or a stacked extra discount.',
    icon: 'calculator-discount',
    aliases: ['percent off calculator', 'sale price calculator', 'coupon calculator', 'stacked discount calculator', 'final price calculator'],
    formula:
      'First subtotal = original price x (1 - discount percent). Stacked subtotal = first subtotal x (1 - extra discount percent). Tax is added after the discounts when a tax rate is entered.',
    limit:
      'This is checkout math only. It does not verify coupon exclusions, membership rules, limited-quantity offers, shipping, refunds, store policy, advertised-price rules, tax exemptions, or local tax law.',
    useCases: [
      'Calculate a sale price after a discount.',
      'Check stacked coupon math.',
      'Estimate tax after discounts.',
      'Compare total savings before buying.',
    ],
    examples: [
      { label: 'Stacked sale', expression: '$100, 20% off, then 10% extra, 5% tax', result: '$75.60 final price, $28.00 savings before tax, and 28% effective discount' },
      { label: 'Simple sale', expression: '$80 with 30% off', result: '$56.00 final price and $24.00 savings' },
      { label: 'Taxed purchase', expression: '$250 with 15% off, 5% extra, 7.25% tax', result: 'About $216.51 final price after $48.13 savings before tax' },
    ],
    relatedSlugs: ['percentage-calculator', 'sales-tax-calculator', 'vat-calculator'],
    inputExplanations: [
      { term: 'Original price', meaning: 'the before-discount price shown on the tag, listing, or quote.' },
      { term: 'Discount', meaning: 'the first percent off the original price.' },
      { term: 'Extra discount', meaning: 'a second percent off the already-discounted subtotal, not the original price.' },
      { term: 'Tax rate', meaning: 'optional tax added after the discounts. Leave it at 0 if you only want the pre-tax sale price.' },
    ],
    priorityFaq: [
      {
        question: 'Do stacked discounts add together?',
        answer:
          'No. A 20% discount and an extra 10% discount do not make 30% off. The second discount applies after the first one, so $100 becomes $80, then $72 before tax.',
      },
      {
        question: 'Does this check if the advertised sale is real?',
        answer:
          'No. The calculator only checks math. Store rules, limited eligibility, fake reference prices, required fees, and coupon exclusions need to be checked on the offer page or receipt.',
      },
      {
        question: 'Should tax be calculated before or after the discount?',
        answer:
          'This calculator adds tax after discounts because that is the common checkout estimate. Actual tax rules can vary by place, item type, coupon type, and store policy.',
      },
    ],
    formulaCheck:
      '$100 with 20% off becomes $80. An extra 10% discount makes it $72. A 5% tax adds $3.60, so the final estimate is $75.60.',
    resultReading:
      'Read subtotal after discounts first, then total savings before tax, then tax amount, then final price. The effective discount shows the combined discount as one percent of the original price.',
    doubleCheck:
      'Check the coupon terms, whether the discount applies before tax, whether shipping or fees are extra, and whether the original price is the real price you would otherwise pay.',
    limitFollowup:
      'For legal, tax, or store-dispute questions, use the retailer terms, receipt, local tax rules, and official consumer-protection guidance instead of only this estimate.',
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
    seoTitle: 'Debt-to-Income Ratio Calculator | DTI With Housing',
    seoDescription:
      'Calculate debt-to-income ratio from gross monthly income, existing monthly debt payments, and a proposed housing payment. See total debt, DTI, and income left.',
    icon: 'calculator-dti',
    aliases: [
      'debt to income ratio calculator',
      'dti calculator',
      'mortgage dti calculator',
      'monthly debt ratio calculator',
      'debt ratio calculator',
    ],
    formula:
      'The calculator adds existing monthly debt payments and proposed housing payment, divides by gross monthly income, then converts the result to a percentage.',
    limit:
      'This is a simplified planning ratio. It does not approve a loan, verify gross income, classify debts, split front-end and back-end ratios, include taxes, insurance, or HOA unless you enter them in housing payment, or replace lender underwriting.',
    useCases: [
      'Estimate DTI before a loan or mortgage conversation.',
      'See how a proposed housing payment changes the ratio.',
      'Compare debt payments against gross monthly income.',
      'Check a simple affordability signal before using lender tools.',
    ],
    examples: [
      { label: 'Mortgage check', expression: '$6,000 income, $900 debts, $1,500 proposed housing', result: '40% DTI, with $2,400 total monthly debt and $3,600 income left after listed debts' },
      { label: 'Debt only', expression: '$4,800 income and $650 debts', result: 'About 13.54% DTI, with $650 total monthly debt and $4,150 income left after listed debts' },
      { label: 'Higher payment', expression: '$8,000 income, $1,200 debts, $2,300 housing', result: '43.75% DTI, with $3,500 total monthly debt and $4,500 income left after listed debts' },
    ],
    relatedSlugs: ['house-affordability-calculator', 'mortgage-calculator', 'loan-calculator'],
    inputExplanations: [
      { term: 'Gross monthly income', meaning: 'monthly income before taxes and deductions. DTI is usually discussed from gross income, not take-home pay.' },
      { term: 'Monthly debt payments', meaning: 'recurring debt payments such as credit card minimums, auto loans, student loans, personal loans, and other listed debts.' },
      { term: 'Proposed housing payment', meaning: 'the housing payment you want to test. Include taxes, insurance, HOA, or mortgage insurance here only if you want them counted in the ratio.' },
    ],
    priorityFaq: [
      {
        question: 'What counts as monthly debt payments?',
        answer:
          'Use recurring debt payments such as credit card minimums, auto loans, student loans, personal loans, child support if applicable, and other debts you want counted. Normal living costs like groceries and utilities are important for your budget, but they are not always counted the same way in a lender DTI check.',
      },
      {
        question: 'Should I use gross income or take-home pay?',
        answer:
          'Use gross monthly income for this DTI estimate because lenders commonly discuss debt-to-income ratio from income before taxes and deductions. Use take-home pay for your personal budget check, because that shows what you actually have available each month.',
      },
      {
        question: 'Should the housing payment include taxes, insurance, and HOA?',
        answer:
          'If you are testing a mortgage-style housing payment, include property tax, homeowners insurance, HOA dues, and mortgage insurance in the proposed housing payment when you want the ratio to reflect those costs. A lender may still count housing costs under its own rules.',
      },
      {
        question: 'Does a low DTI mean I will be approved?',
        answer:
          'No. A lower DTI can be a good sign, but approval can also depend on credit, income stability, down payment, loan type, cash reserves, documentation, property details, and lender rules. This calculator only checks the simple ratio from the numbers you enter.',
      },
    ],
    formulaCheck:
      'For the default example, ($900 existing debts + $1,500 proposed housing) / $6,000 gross monthly income = 0.40, so the result is 40% DTI with $2,400 total monthly debt.',
    resultReading:
      'Read the debt-to-income ratio first, then check total monthly debt and income after listed debts. The remaining-income line is not a full budget because it does not subtract taxes, groceries, utilities, savings, insurance, or irregular costs.',
    doubleCheck:
      'Make sure all amounts are monthly, income is gross monthly income, existing debts are debt payments instead of total balances, and the housing payment includes escrow costs only if you want them in this estimate.',
    limitFollowup:
      'For a real loan or mortgage decision, compare lender definitions, front-end and back-end ratios, taxes, insurance, HOA dues, credit review, down payment, APR, and the written Loan Estimate or loan offer.',
  }),
  makeFinanceTool({
    slug: 'personal-loan-calculator',
    name: 'Personal Loan Calculator',
    summary: 'Estimate personal loan payment, interest, and origination fee.',
    description:
      'Use this free personal loan calculator to estimate monthly payment, total paid, total interest, origination fee, and cash received after a fee.',
    seoTitle: 'Personal Loan Calculator | Payment, Interest & Fees',
    seoDescription:
      'Estimate a personal loan monthly payment, total interest, origination fee, cash received after fees, and total cost before comparing offers.',
    icon: 'calculator-personal-loan',
    aliases: [
      'personal loan payment calculator',
      'personal loan interest calculator',
      'origination fee calculator',
      'installment loan calculator',
    ],
    formula:
      'The calculator uses the fixed-payment loan formula, then estimates any origination fee from the loan amount and shows cash received after the fee.',
    limit:
      'This does not include lender approval, official APR disclosures, variable rates, late fees, credit insurance, prepayment rules, scam risk, or credit-score impact.',
    useCases: [
      'Estimate a personal loan monthly payment.',
      'Compare loan terms and interest rates.',
      'Include a simple origination fee in the estimate.',
      'Check total interest before comparing offers.',
    ],
    examples: [
      {
        label: 'Personal loan',
        expression: '$12,000 at 10.5% for 4 years with 2% fee',
        result: 'About $307.24/month, $2,747.55 interest, and $11,760 cash received after fee',
      },
      {
        label: 'Debt refinance',
        expression: '$18,000 at 11.9% for 5 years with 3% fee',
        result: 'About $399.49/month, $5,969.46 interest, and $17,460 cash received after fee',
      },
      {
        label: 'Short payoff',
        expression: '$5,000 at 8.5% for 2 years with no fee',
        result: 'About $227.28/month and $454.68 interest',
      },
    ],
    relatedSlugs: ['loan-calculator', 'apr-calculator', 'debt-payoff-calculator'],
    inputExplanations: [
      { term: 'Loan amount', meaning: 'the principal you repay, even if a fee means you receive less cash.' },
      { term: 'Interest rate', meaning: 'the yearly rate used for the payment math. Use APR if the offer tells you to compare by APR.' },
      { term: 'Loan term', meaning: 'how many years the payments last.' },
      { term: 'Origination fee', meaning: 'a fee percent charged to create the loan. Some lenders subtract it from the money you receive.' },
    ],
    priorityFaq: [
      {
        question: 'Why does cash received after fee matter?',
        answer:
          'A personal loan can make you repay the full loan amount even when a fee is taken out first. A $12,000 loan with a 2% fee has a $240 fee, so you may receive $11,760 but still make payments on $12,000.',
      },
      {
        question: 'Should I enter interest rate or APR?',
        answer:
          'Use the number you are trying to compare. APR usually includes more loan costs than the stated interest rate. If one offer gives APR and another gives only rate, check the lender disclosure before deciding which one is cheaper.',
      },
      {
        question: 'Can this calculator tell me if I will be approved?',
        answer:
          'No. It only estimates payment math. Approval can depend on credit, income, debt, lender rules, state rules, identity checks, and the exact loan offer.',
      },
    ],
    formulaCheck:
      'The fee is not added into the payment formula here. The payment is based on the loan amount, then the fee is shown separately so you can see both cash received and cost.',
    resultReading:
      'Read monthly payment first, then compare total interest, origination fee, cash received after fee, and total cost with fee. A lower payment can still cost more if the term is longer or the fee is bigger.',
    doubleCheck:
      'Check whether the lender subtracts the fee from proceeds, adds it to the balance, or charges it another way. Also check whether the number you entered is interest rate or APR.',
    limitFollowup:
      'Read the written loan disclosure and watch for late fees, optional insurance, prepayment rules, variable rates, and any request to pay money upfront before a real loan is approved.',
    extraFaq: [
      {
        question: 'Is an upfront fee before approval a warning sign?',
        answer:
          'Yes. Legit lenders may charge real fees, but a promise of guaranteed credit in exchange for money upfront is a major scam warning. Check the lender and the written terms before paying anyone.',
      },
      {
        question: 'Why can a longer personal loan look easier but cost more?',
        answer:
          'A longer term spreads the balance across more payments, so the monthly payment can drop. The tradeoff is more months of interest, which can raise the total cost.',
      },
    ],
  }),
  makeFinanceTool({
    slug: 'boat-loan-calculator',
    name: 'Boat Loan Calculator',
    summary: 'Estimate monthly boat loan payment, amount financed, sales tax, and interest.',
    description:
      'Use this free boat loan calculator to estimate monthly payment, amount financed, sales tax, total paid, and total interest from boat price, down payment, trade-in credit, fees, rate, and term.',
    seoTitle: 'Boat Loan Calculator | Payment, Tax & Interest',
    seoDescription:
      'Estimate boat loan payment, amount financed, sales tax, total paid, and interest from boat price, down payment, fees, rate, and term.',
    icon: 'calculator-boat-loan',
    aliases: [
      'boat payment calculator',
      'marine loan calculator',
      'boat financing calculator',
      'used boat loan calculator',
    ],
    formula:
      'Taxable amount is max(0, boat price - trade-in credit). Sales tax is taxable amount times the entered tax rate. Amount financed is boat price plus sales tax and fees minus down payment and trade-in credit, then the fixed-payment loan formula estimates monthly payment.',
    limit:
      'This is not a lender quote or Truth in Lending disclosure. It does not include registration, title, storage, marina fees, maintenance, inspections, insurance, fuel, taxes beyond the entered rate, optional add-ons, credit approval, or lender-specific APR rules.',
    useCases: [
      'Estimate a monthly boat loan payment before visiting a dealer or seller.',
      'Include down payment, trade-in credit, seller fees, and sales tax in the amount financed.',
      'Compare shorter and longer marine loan terms without looking only at payment.',
      'See total interest before choosing a long recreational-vehicle loan.',
    ],
    examples: [
      {
        label: 'Used boat',
        expression: '$45,000 price, $9,000 down, $1,200 fees, 6% tax, 8.5%, 10 years',
        result: '$39,900 financed, about $494.70/month, and about $19,464.35 interest',
      },
      {
        label: 'Trade-in credit',
        expression: '$22,000 price, $4,000 down, $2,000 trade-in, $750 fees, 5.5% tax, 9%, 7 years',
        result: '$17,850 financed and about $287.19/month',
      },
      {
        label: 'Long term',
        expression: '$85,000 price, $17,000 down, $1,800 fees, 6.25% tax, 7.75%, 15 years',
        result: 'About $707.02/month and about $52,150.34 interest',
      },
    ],
    relatedSlugs: ['auto-loan-calculator', 'loan-calculator', 'apr-calculator'],
    inputExplanations: [
      { term: 'Boat price', meaning: 'the agreed purchase price before financing, taxes, fees, down payment, or trade-in credit.' },
      { term: 'Trade-in credit', meaning: 'the value credited for a boat or vehicle you trade. This calculator reduces both taxable amount and amount financed by that credit.' },
      { term: 'Dealer/seller fees', meaning: 'fees you choose to include in the financed balance. Real paperwork may split title, documentation, registration, add-ons, and lender fees differently.' },
      { term: 'Rate used for payment math', meaning: 'the yearly rate used in the fixed-payment formula. Use APR only when you are intentionally comparing offers by APR and understand what fees it includes.' },
      { term: 'Loan term', meaning: 'how many years the loan runs. A longer term can lower the payment while raising total interest.' },
    ],
    priorityFaq: [
      {
        question: 'How does the boat loan calculator handle a trade-in?',
        answer:
          'It subtracts the trade-in credit from the taxable amount and from the final amount financed. For example, a $22,000 boat with a $2,000 trade-in uses $20,000 as the taxable amount before sales tax is estimated.',
      },
      {
        question: 'Should I enter interest rate or APR?',
        answer:
          'Use the number you are trying to compare. APR can include mandatory credit costs while a stated interest rate may not. If one quote gives APR and another gives only interest rate, read the lender disclosure before deciding which offer is cheaper.',
      },
      {
        question: 'Why can a longer boat loan be expensive even with a lower payment?',
        answer:
          'A longer term spreads the balance across more months, so the payment can look easier. The tradeoff is more months of interest. In the long-term example here, the payment is about $707.02/month, but total interest is about $52,150.34.',
      },
    ],
    formulaCheck:
      'Amount financed = boat price + estimated sales tax + entered fees - down payment - trade-in credit. The payment then uses the standard fixed-payment loan formula.',
    resultReading:
      'Read monthly payment first, then check amount financed, sales tax, total interest, and total paid. A quote with a lower monthly payment can still cost more if the term is longer or fees are rolled into the balance.',
    doubleCheck:
      'Check the written offer for APR, finance charge, total of payments, title and registration fees, optional add-ons, prepayment rules, and whether taxes or fees are actually financed.',
    limitFollowup:
      'Boat ownership costs can be large. Keep insurance, storage, marina slip fees, winterization, maintenance, inspections, trailer costs, fuel, and registration outside this loan estimate unless the seller or lender specifically finances them.',
    extraFaq: [
      {
        question: 'Does this estimate include boat ownership costs?',
        answer:
          'No. It estimates financing math only. Storage, marina fees, insurance, maintenance, fuel, inspections, winterization, registration, title, and trailer costs can change the real monthly budget.',
      },
      {
        question: 'Is this a Truth in Lending disclosure?',
        answer:
          'No. It is a planning calculator. Use the lender or dealer disclosure for the official APR, finance charge, amount financed, payment schedule, total of payments, and contract terms.',
      },
    ],
  }),
  makeFinanceTool({
    slug: 'lease-calculator',
    name: 'Lease Calculator',
    summary: 'Estimate a generic lease payment from asset value, residual, rate, term, fees, and upfront payment.',
    description:
      'Use this free lease calculator to estimate monthly lease payment, depreciation portion, finance portion, adjusted cost, and total lease cost.',
    seoTitle: 'Lease Calculator | Payment, Residual & Total Cost',
    seoDescription:
      'Estimate a generic lease payment from asset value, residual value, finance rate, fees, upfront payment, and term. See depreciation and total cost.',
    icon: 'calculator-lease',
    aliases: [
      'lease payment calculator',
      'equipment lease calculator',
      'asset lease calculator',
      'residual value lease calculator',
      'monthly lease calculator',
      'lease cost calculator',
    ],
    formula:
      'Adjusted cost = asset value + fees - upfront payment. Depreciation fee = (adjusted cost - residual value) / term months. Finance fee = (adjusted cost + residual value) x annual rate / 12. Monthly payment = depreciation fee + finance fee.',
    limit:
      'This is a generic lease estimate. It does not include contract-specific taxes, maintenance obligations, buyout rights, renewal options, insurance, or early termination costs.',
    useCases: [
      'Estimate a monthly lease payment for equipment or another asset.',
      'Separate depreciation portion from finance portion.',
      'Compare residual values and term lengths.',
      'Check a lease quote before reading the contract details.',
    ],
    examples: [
      { label: 'Equipment lease', expression: '$30,000 asset, $14,000 residual, 6% rate, 36 months, $1,500 upfront, $800 fees', result: 'About $641.50/month and $24,594.00 total lease cost' },
      { label: 'Lower residual', expression: '$18,000 asset, $5,000 residual, 8% rate, 48 months, $1,000 upfront, $500 fees', result: 'About $410.42/month with a $260.42 depreciation fee' },
      { label: 'Short term', expression: '$10,000 asset, $6,500 residual, 5% rate, 24 months, $500 upfront, $250 fees', result: 'About $203.13/month and $5,375.00 total lease cost' },
    ],
    relatedSlugs: ['auto-lease-calculator', 'business-loan-calculator', 'loan-calculator'],
    inputExplanations: [
      { term: 'Asset value', meaning: 'the starting value or negotiated cost of the leased item before this simple estimate adds fees and subtracts upfront payment.' },
      { term: 'Residual value', meaning: 'the expected lease-end value in dollars. A higher residual usually lowers the depreciation part of the payment.' },
      { term: 'Finance rate', meaning: 'the annual percent rate used by this generic calculator to estimate a monthly finance charge. Enter 6 for 6%, not 0.06.' },
      { term: 'Lease term', meaning: 'the number of monthly payments in the lease. Use whole months such as 24, 36, or 48.' },
      { term: 'Upfront payment and fees', meaning: 'money paid up front lowers adjusted cost, while fees added to the lease raise adjusted cost.' },
    ],
    priorityFaq: [
      {
        question: 'What is residual value in a lease?',
        answer:
          'Residual value is the expected value of the asset at the end of the lease. The calculator subtracts residual value from adjusted cost before spreading depreciation across the lease term.',
      },
      {
        question: 'What is adjusted cost?',
        answer:
          'Adjusted cost is asset value plus fees minus upfront payment. In the default example, $30,000 asset value plus $800 fees minus $1,500 upfront payment gives a $29,300 adjusted cost.',
      },
      {
        question: 'Does this use a money factor?',
        answer:
          'No. This generic Lease Calculator uses an annual finance rate percentage. Use the Auto Lease Calculator if your vehicle quote gives a money factor such as 0.0025.',
      },
    ],
    formulaCheck:
      'For the $30,000 example, adjusted cost is $29,300. Depreciation fee is ($29,300 - $14,000) / 36, or $425.00. Finance fee is ($29,300 + $14,000) x 0.06 / 12, or $216.50, for a $641.50 monthly estimate.',
    resultReading:
      'Read the monthly payment first, then check adjusted cost, depreciation fee, finance fee, and estimated total lease cost. A smaller monthly payment can still hide a larger upfront amount, lower residual assumption, or contract fee outside this estimate.',
    doubleCheck:
      'Check that residual value is in dollars, the finance rate is typed as a percent, the lease term is whole months, and fees or upfront payments match the quote. Ask for taxes, renewal terms, buyout rights, use limits, maintenance duties, insurance, and early-exit costs in writing.',
    limitFollowup:
      'Use this as lease math, not a contract review. The real lease can change with taxes, insurance, maintenance duties, purchase options, use limits, renewal rules, penalties, and local law.',
  }),
  makeFinanceTool({
    slug: 'refinance-calculator',
    name: 'Refinance Calculator',
    summary: 'Compare current loan payment with a new refinance payment and break-even estimate.',
    description:
      'Use this free refinance calculator to estimate new payment, monthly savings, closing-cost break-even time, total interest change, and total cost change.',
    seoTitle: 'Refinance Calculator | Payment, Savings & Break-Even',
    seoDescription:
      'Compare current payment with a new refinance payment, monthly savings, closing-cost break-even time, interest change, and total cost change.',
    icon: 'calculator-refinance',
    aliases: [
      'mortgage refinance calculator',
      'refinance break even calculator',
      'refinance savings calculator',
      'loan refinance calculator',
    ],
    formula:
      'The calculator estimates the current loan payment, rolls closing costs into the new balance, estimates the new payment, then compares monthly payment and total cost.',
    limit:
      'This does not include lender underwriting, taxes, escrow changes, credit rules, prepayment penalties, cash-out rules, discount-point tradeoffs, rescission timing, or official loan disclosures.',
    useCases: [
      'Compare a current loan with a possible refinance.',
      'Estimate monthly savings from a lower rate.',
      'Check how long closing costs may take to break even.',
      'See whether a longer term could reduce payment but increase cost.',
    ],
    examples: [
      {
        label: 'Mortgage refinance',
        expression: '$280,000 balance, 7% now, 26 years left, 5.9% new 30-year loan, $4,500 costs',
        result: 'About $1,687.47/month, $263.67/month savings, and 17.1 months to break even',
      },
      {
        label: 'Shorter term',
        expression: '$220,000 balance, 6.8% now, 24 years left, 5.7% new 15-year loan, $3,800 costs',
        result: 'About $1,852.47/month, no monthly savings, but about $113,367.40 lower total paid',
      },
      {
        label: 'Small cost',
        expression: '$120,000 balance, 8% now, 6.5% new 10-year loan, $1,500 costs',
        result: 'About $1,379.61/month, $76.32/month savings, and 19.7 months to break even',
      },
    ],
    relatedSlugs: ['mortgage-payoff-calculator', 'apr-calculator', 'mortgage-calculator'],
    inputExplanations: [
      { term: 'Current balance', meaning: 'what is still owed on the loan you already have.' },
      { term: 'Current rate', meaning: 'the yearly rate used to estimate your remaining current payment.' },
      { term: 'Current remaining term', meaning: 'how many years are left if you keep the current loan.' },
      { term: 'New rate', meaning: 'the yearly rate for the refinance idea you want to test.' },
      { term: 'New term', meaning: 'how many years the new loan would run.' },
      { term: 'Closing costs', meaning: 'the refinance costs entered as dollars. This calculator rolls them into the new balance.' },
    ],
    priorityFaq: [
      {
        question: 'What does refinance break-even mean?',
        answer:
          'Break-even means the rough number of months it takes monthly savings to cover closing costs. If costs are $4,500 and the new payment saves about $263.67 per month, the simple break-even is about 17.1 months.',
      },
      {
        question: 'Can a refinance lower my payment but still cost more?',
        answer:
          'Yes. A new 30-year term can drop the monthly payment by stretching the debt over more months. Always compare total cost change, not only the new payment.',
      },
      {
        question: 'Why does this calculator roll closing costs into the new balance?',
        answer:
          'It gives one clean comparison where the new loan starts with the current balance plus entered costs. If you plan to pay costs out of pocket, compare that separately with your lender paperwork.',
      },
    ],
    formulaCheck:
      'Break-even only appears when the new payment is lower. If the new payment is higher, the calculator shows no monthly-savings break-even.',
    resultReading:
      'Start with the new monthly payment, then read monthly savings, break-even time, and total cost change. A lower payment is only helpful if the costs and longer term still make sense.',
    doubleCheck:
      'Check whether closing costs are paid upfront, rolled into the loan, or traded for a higher rate. Also check whether the new quote uses interest rate or APR.',
    limitFollowup:
      'Use the lender Loan Estimate, Closing Disclosure, and payoff quote before acting. Check points, lender credits, escrow changes, tax changes, PMI, cash-out rules, prepayment penalties, and rescission timing.',
    extraFaq: [
      {
        question: 'Should I compare interest rate or APR when refinancing?',
        answer:
          'Compare both. Interest rate helps explain the payment. APR can include more loan costs, so it can make an offer with a low rate but high fees look less cheap.',
      },
      {
        question: 'Does this handle discount points?',
        answer:
          'Not as a separate field. If points or lender fees are part of the refinance costs, include them in closing costs, then use the Loan Estimate to decide whether paying upfront for a lower rate is worth it.',
      },
    ],
  }),
  makeFinanceTool({
    slug: 'budget-calculator',
    name: 'Budget Calculator',
    summary: 'Add monthly income, spending, debt, and savings to see leftover money and ratios.',
    description:
      'Use this free budget calculator to total monthly expenses, compare spending with income, estimate leftover money, and see expense and savings ratios.',
    seoTitle: 'Budget Calculator | Monthly Spending & Savings Plan',
    seoDescription:
      'Add monthly income, spending, debt payments, and savings to estimate leftover money, expense ratio, savings rate, and the largest budget category.',
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
      { label: 'Household budget', expression: '$5,200 income with housing, bills, debt, and savings', result: 'About $550 left, 89.42% expense ratio, and 11.54% savings rate' },
      { label: 'Lower debt', expression: '$4,300 income with small debt payments', result: 'Budget surplus estimate' },
      { label: 'Aggressive saving', expression: '$7,200 income and $1,200 savings', result: 'Savings-rate check' },
    ],
    relatedSlugs: ['savings-calculator', 'loan-calculator', 'finance-calculator'],
  }),
  ...remainingFinanceToolSpecs.map(makeFinanceTool),
];
