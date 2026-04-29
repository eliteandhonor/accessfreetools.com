import type { ToolDefinition, ToolExample, ToolFaq } from './tools';

interface FinanceToolSpec {
  slug: string;
  name: string;
  summary: string;
  description: string;
  icon: string;
  formula: string;
  limit: string;
  useCases: string[];
  examples: ToolExample[];
  relatedSlugs: string[];
}

const financeLimit =
  'This calculator gives an educational estimate only. It does not include every fee, lender rule, tax rule, local rate, credit, penalty, or personal financial detail.';

function makeFaq(name: string, formula: string, limit: string): ToolFaq[] {
  return [
    {
      question: `What can I use the ${name} for?`,
      answer:
        'Use it for quick planning, comparison, and what-if estimates before you check exact numbers with a lender, tax professional, payroll provider, or financial adviser.',
    },
    {
      question: `How does the ${name} calculate the result?`,
      answer: formula,
    },
    {
      question: 'Is this financial, tax, or legal advice?',
      answer: limit,
    },
    {
      question: 'Are my finance inputs private?',
      answer:
        'Yes. The calculator runs in your browser tab. Recent answers stay only on the page while you use it and are not sent to a server.',
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
    seoTitle: `${spec.name} | Free Online Finance Calculator`,
    seoDescription: spec.description,
    useCases: spec.useCases,
    examples: spec.examples,
    faq: makeFaq(spec.name, spec.formula, spec.limit),
    relatedSlugs: spec.relatedSlugs,
  };
}

export const financeTools: ToolDefinition[] = [
  makeFinanceTool({
    slug: 'mortgage-calculator',
    name: 'Mortgage Calculator',
    summary: 'Estimate monthly principal, interest, taxes, insurance, PMI, and HOA costs.',
    description:
      'Use this free mortgage calculator to estimate monthly principal and interest, total interest, loan-to-value, and optional property tax, insurance, PMI, and HOA costs.',
    icon: 'calculator-mortgage',
    formula:
      'The calculator uses the fixed-payment loan formula for principal and interest, then adds monthly property tax, insurance, PMI, and HOA amounts you enter.',
    limit:
      'This is a planning estimate, not a loan estimate. It does not include lender underwriting, closing costs, escrow changes, local tax rules, mortgage insurance rules, or adjustable-rate terms.',
    useCases: [
      'Estimate monthly mortgage principal and interest from home price, down payment, rate, and term.',
      'Add common monthly ownership costs such as property tax, insurance, PMI, and HOA dues.',
      'Compare how down payment or rate changes affect monthly payment and total interest.',
      'Check loan-to-value before discussing PMI or lending options.',
    ],
    examples: [
      { label: 'Starter estimate', expression: '$400,000 home, $80,000 down, 6.5%, 30 years', result: 'Monthly P&I plus optional escrow-style costs' },
      { label: 'Lower rate check', expression: '$320,000 loan, 5.9%, 30 years', result: 'Compare payment and total interest' },
      { label: '15-year comparison', expression: '$320,000 loan, 6.1%, 15 years', result: 'Higher payment, lower total interest' },
    ],
    relatedSlugs: ['loan-calculator', 'amortization-calculator', 'interest-rate-calculator'],
  }),
  makeFinanceTool({
    slug: 'loan-calculator',
    name: 'Loan Calculator',
    summary: 'Estimate a fixed monthly loan payment and total interest.',
    description:
      'Use this free loan calculator to estimate a fixed monthly payment, total paid, and total interest from loan amount, annual rate, and term.',
    icon: 'calculator-loan',
    formula:
      'The calculator uses the standard amortized loan payment formula: payment equals principal times monthly rate times growth factor divided by growth factor minus one.',
    limit: financeLimit,
    useCases: [
      'Estimate payments for personal loans, student loans, or other fixed-payment debt.',
      'Compare different loan terms before choosing a repayment plan.',
      'See the total interest cost behind a monthly payment.',
      'Use the result as a baseline for the amortization calculator.',
    ],
    examples: [
      { label: 'Personal loan', expression: '$12,000 at 9.5% for 4 years', result: 'Monthly payment and total interest' },
      { label: 'Large loan', expression: '$50,000 at 7% for 6 years', result: 'Payment comparison estimate' },
      { label: 'Zero interest', expression: '$3,000 at 0% for 12 months', result: 'Principal divided by months' },
    ],
    relatedSlugs: ['payment-calculator', 'amortization-calculator', 'interest-rate-calculator'],
  }),
  makeFinanceTool({
    slug: 'auto-loan-calculator',
    name: 'Auto Loan Calculator',
    summary: 'Estimate a vehicle loan payment with tax, fees, down payment, and trade-in.',
    description:
      'Use this free auto loan calculator to estimate amount financed, monthly payment, total interest, sales tax, fees, down payment, and trade-in impact.',
    icon: 'calculator-auto-loan',
    formula:
      'The calculator estimates amount financed as price plus sales tax and fees minus down payment and trade-in, then applies the fixed-payment loan formula.',
    limit:
      'This is a vehicle-payment estimate only. Dealer fees, lender fees, registration, taxes, rebates, trade-in tax treatment, and credit approval can change the real offer.',
    useCases: [
      'Estimate the payment before shopping for a car.',
      'Compare the impact of down payment, trade-in value, tax, fees, and interest rate.',
      'See how a longer term lowers payment but increases total interest.',
      'Check whether a monthly payment fits a budget before visiting a dealer.',
    ],
    examples: [
      { label: 'Used vehicle', expression: '$32,000 price, $4,000 down, $3,000 trade-in', result: 'Amount financed and payment estimate' },
      { label: 'Lower down payment', expression: '$28,000 price, $1,500 down, 7.9%', result: 'Higher financed amount' },
      { label: 'Shorter term', expression: '$25,000 financed over 48 months', result: 'Higher payment, less interest' },
    ],
    relatedSlugs: ['loan-calculator', 'payment-calculator', 'sales-tax-calculator'],
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
    summary: 'Project investment growth from starting amount, monthly deposits, and return.',
    description:
      'Use this free investment calculator to project ending balance, total contributions, and estimated growth from starting investment, monthly deposits, return, and time.',
    icon: 'calculator-investment',
    formula:
      'The calculator compounds the starting amount and monthly contributions using an estimated annual return converted to monthly growth.',
    limit:
      'This is an investment projection, not investment advice. It does not include taxes, fees, market losses, risk, account rules, or guaranteed returns.',
    useCases: [
      'Estimate future value from monthly investing.',
      'Compare how time and contribution size affect growth.',
      'Separate total contributions from estimated investment gains.',
      'Test return assumptions before using a real investment plan.',
    ],
    examples: [
      { label: 'Monthly investing', expression: '$5,000 initial, $250/month, 7%, 20 years', result: 'Projected ending balance' },
      { label: 'No new deposits', expression: '$10,000 at 6% for 15 years', result: 'Growth of starting amount' },
      { label: 'Contribution comparison', expression: '$100 vs $300 per month', result: 'Different future balances' },
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
    summary: 'Project a general balance from starting amount, monthly change, rate, and time.',
    description:
      'Use this free finance calculator for a general future-value estimate from starting amount, monthly contribution, annual rate, and time horizon.',
    icon: 'calculator-finance',
    formula:
      'The calculator compounds a starting amount and monthly contributions using the estimated annual rate converted to monthly growth.',
    limit: financeLimit,
    useCases: [
      'Run a quick future-value estimate without choosing a specialized tool.',
      'Project a savings balance from monthly contributions.',
      'Compare time, rate, and contribution scenarios.',
      'Use as a general finance scratchpad before opening a specific calculator.',
    ],
    examples: [
      { label: 'Savings projection', expression: '$2,000 plus $150/month at 5% for 8 years', result: 'Future balance estimate' },
      { label: 'Short-term plan', expression: '$500 plus $75/month for 2 years', result: 'Projected balance' },
      { label: 'Rate check', expression: '3%, 5%, and 7% assumptions', result: 'Compare ending balances' },
    ],
    relatedSlugs: ['investment-calculator', 'compound-interest-calculator', 'payment-calculator'],
  }),
  makeFinanceTool({
    slug: 'income-tax-calculator',
    name: 'Income Tax Calculator',
    summary: 'Estimate 2026 U.S. federal income tax from income, filing status, deduction, and credits.',
    description:
      'Use this free income tax calculator to estimate 2026 U.S. federal income tax, taxable income, effective rate, and marginal bracket from income and filing status.',
    icon: 'calculator-tax',
    formula:
      'The calculator subtracts the selected deduction from gross income, applies the 2026 U.S. federal ordinary income tax brackets, then subtracts credits you enter.',
    limit:
      'This is a simplified federal income tax estimate only. It does not calculate state tax, payroll tax, capital gains, AMT, deductions, credits, phaseouts, penalties, withholding, or filing advice.',
    useCases: [
      'Estimate 2026 U.S. federal ordinary income tax for planning.',
      'Compare filing statuses with the standard deduction or a custom deduction.',
      'See taxable income, estimated federal tax, effective rate, and marginal bracket.',
      'Use a transparent estimate before checking IRS forms or a tax professional.',
    ],
    examples: [
      { label: 'Single filer', expression: '$100,000 income, 2026 standard deduction', result: 'Estimated federal ordinary income tax' },
      { label: 'Joint return', expression: '$160,000 income, married filing jointly', result: 'Larger standard deduction and joint brackets' },
      { label: 'Custom deduction', expression: '$90,000 income, $20,000 deduction', result: 'Taxable-income estimate' },
    ],
    relatedSlugs: ['salary-calculator', 'finance-calculator', 'sales-tax-calculator'],
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
      'Use this free salary calculator to convert annual salary into monthly, biweekly, weekly, daily, and hourly pay with an optional simple tax-rate estimate.',
    icon: 'calculator-salary',
    formula:
      'The calculator divides annual salary by 12, 26, weeks per year, workdays, and annual hours. Optional tax is a simple percentage of annual salary.',
    limit:
      'This is a paycheck-style estimate, not payroll advice. It does not include actual withholding tables, benefits, pre-tax deductions, overtime, bonuses, state tax, or local tax.',
    useCases: [
      'Convert annual salary into hourly pay.',
      'Compare monthly, biweekly, weekly, and daily gross pay.',
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
    summary: 'Estimate annual interest rate from principal, payment, and term.',
    description:
      'Use this free interest rate calculator to estimate an annual rate from loan amount, fixed monthly payment, and repayment term.',
    icon: 'calculator-rate',
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
      { label: 'Payment quote', expression: '$25,000 principal, $483.32/month, 5 years', result: 'Estimated annual rate' },
      { label: 'Higher payment', expression: '$15,000, $350/month, 4 years', result: 'Implied rate estimate' },
      { label: 'Impossible payment', expression: 'Payment below zero-interest payoff', result: 'Calculator shows an input warning' },
    ],
    relatedSlugs: ['loan-calculator', 'payment-calculator', 'auto-loan-calculator'],
  }),
  makeFinanceTool({
    slug: 'sales-tax-calculator',
    name: 'Sales Tax Calculator',
    summary: 'Calculate sales tax amount and total from subtotal and tax rate.',
    description:
      'Use this free sales tax calculator to estimate tax amount and final total from a subtotal and local sales tax rate.',
    icon: 'calculator-sales-tax',
    formula:
      'The calculator multiplies subtotal by the sales tax rate, then adds the tax amount to the subtotal for the final total.',
    limit:
      'This is a manual-rate estimate. It does not look up local rates, exemptions, shipping rules, marketplace rules, or tax holidays.',
    useCases: [
      'Estimate sales tax before checkout.',
      'Convert a subtotal and tax rate into a final total.',
      'Check receipt math or split a purchase with tax included.',
      'Use a manual local rate when exact tax lookup is not needed.',
    ],
    examples: [
      { label: 'Simple total', expression: '$80 at 7.5%', result: '$6 tax, $86 total' },
      { label: 'Large purchase', expression: '$1,200 at 6.25%', result: 'Estimated tax and total' },
      { label: 'Receipt check', expression: '$42.50 at 8.2%', result: 'Tax amount and final total' },
    ],
    relatedSlugs: ['percentage-calculator', 'auto-loan-calculator', 'income-tax-calculator'],
  }),
];
