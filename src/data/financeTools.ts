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

function makeFaq(spec: FinanceToolSpec): ToolFaq[] {
  const exampleUses = spec.useCases.slice(0, 2).join(' ');

  return [
    {
      question: `When should I use the ${spec.name}?`,
      answer: `Use it for early planning and side-by-side comparisons, especially for tasks like these: ${exampleUses} Treat the answer as a planning estimate, not a final quote.`,
    },
    {
      question: `What is the ${spec.name} doing with my numbers?`,
      answer: `In plain language: ${spec.formula} If the result seems too high or too low, first check whether each field expects a monthly amount, annual amount, dollar value, or percent.`,
    },
    {
      question: 'What does this estimate leave out?',
      answer: `${spec.limit} Real finance decisions can also depend on fees, timing, local rules, credit details, and provider-specific terms.`,
    },
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
    seoTitle: `${spec.name} | Free Online Finance Calculator`,
    seoDescription: spec.description,
    useCases: spec.useCases,
    examples: spec.examples,
    faq: makeFaq(spec),
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
    summary: 'Estimate mortgage payoff time and interest saved from extra payments.',
    description:
      'Use this free mortgage payoff calculator to estimate payoff time, interest saved, months saved, and the impact of extra monthly or one-time payments.',
    icon: 'calculator-mortgage-payoff',
    formula:
      'The calculator finds the scheduled payment, subtracts any one-time extra payment, adds extra monthly payment, then simulates monthly interest and principal reduction until payoff.',
    limit:
      'This is not an official payoff quote. Lenders may include escrow, fees, interest timing, payoff statement rules, or prepayment rules.',
    useCases: [
      'See how an extra monthly mortgage payment changes payoff time.',
      'Estimate interest saved from a one-time principal payment.',
      'Compare conservative and aggressive payoff scenarios.',
      'Plan questions to ask a lender before making extra payments.',
    ],
    examples: [
      { label: 'Extra monthly', expression: '$280,000 balance, 6.25%, 25 years, +$200/month', result: 'Payoff time and interest saved' },
      { label: 'One-time payment', expression: '$240,000 balance with $5,000 extra now', result: 'Lower remaining principal' },
      { label: 'Aggressive payoff', expression: '$320,000 balance, +$500/month and $10,000 now', result: 'Shorter payoff estimate' },
    ],
    relatedSlugs: ['mortgage-calculator', 'amortization-calculator', 'loan-calculator'],
  }),
  makeFinanceTool({
    slug: '401k-calculator',
    name: '401K Calculator',
    summary: 'Project 401K growth with salary contributions, employer match, return, and time.',
    description:
      'Use this free 401K calculator to project retirement account growth from current balance, salary contribution percent, employer match, estimated return, and years to grow.',
    icon: 'calculator-401k',
    formula:
      'The calculator converts your salary contribution and estimated employer match into monthly deposits, then compounds the current balance and deposits monthly.',
    limit:
      'This is a simplified projection. It does not enforce IRS limits, plan rules, vesting, taxes, loans, withdrawals, fees, or market volatility.',
    useCases: [
      'Estimate how salary contribution percent affects a 401K balance.',
      'Compare the impact of an employer match.',
      'Project long-term growth from current balance and monthly deposits.',
      'Check savings scenarios before reviewing the official plan rules.',
    ],
    examples: [
      { label: '8% contribution', expression: '$75,000 salary, 8%, 50% match up to 6%', result: 'Projected 401K balance' },
      { label: 'Start from zero', expression: '$60,000 salary, 6%, 100% match up to 4%', result: 'Long-term projection' },
      { label: 'Catch-up scenario', expression: '$120,000 saved, 12% contribution, 15 years', result: 'Projected balance' },
    ],
    relatedSlugs: ['retirement-calculator', 'investment-calculator', 'compound-interest-calculator'],
  }),
  makeFinanceTool({
    slug: 'house-affordability-calculator',
    name: 'House Affordability Calculator',
    summary: 'Estimate an affordable home price from income, debts, down payment, rate, and costs.',
    description:
      'Use this free house affordability calculator to estimate a home price from income, monthly debts, down payment, mortgage rate, debt-to-income target, tax, insurance, and HOA.',
    icon: 'calculator-house-affordability',
    formula:
      'The calculator applies a debt-to-income target to monthly income, subtracts monthly debts, then searches for the highest home price whose estimated housing payment fits.',
    limit:
      'This is not mortgage approval. Credit, reserves, closing costs, exact taxes, insurance, HOA, lender rules, and local housing costs can change affordability.',
    useCases: [
      'Estimate a rough home-buying budget before shopping.',
      'See how debts, down payment, and mortgage rate affect affordability.',
      'Compare debt-to-income targets in a transparent way.',
      'Separate principal and interest from estimated tax, insurance, and HOA.',
    ],
    examples: [
      { label: 'Income-based budget', expression: '$110,000 income, $450 debts, $60,000 down', result: 'Estimated affordable home price' },
      { label: 'Lower debt case', expression: '$90,000 income, $150 debts, 33% DTI', result: 'Home price estimate' },
      { label: 'Higher down payment', expression: '$140,000 income, $120,000 down', result: 'Higher affordability estimate' },
    ],
    relatedSlugs: ['mortgage-calculator', 'mortgage-payoff-calculator', 'loan-calculator'],
  }),
  makeFinanceTool({
    slug: 'savings-calculator',
    name: 'Savings Calculator',
    summary: 'Project savings growth and target gap from deposits, rate, and time.',
    description:
      'Use this free savings calculator to project future savings, total deposits, estimated interest, and target gap from current savings, monthly deposits, rate, and time.',
    icon: 'calculator-savings',
    formula:
      'The calculator compounds current savings monthly, adds monthly deposits at the end of each month, then compares the projection with your target amount.',
    limit:
      'This is a rate-based savings projection. It does not include taxes, fees, variable rates, account limits, withdrawal timing, or bank-specific rules.',
    useCases: [
      'Estimate when a savings goal may be reachable.',
      'Compare monthly deposit amounts for a target balance.',
      'See estimated interest separately from deposits.',
      'Plan emergency fund, travel, purchase, or down-payment scenarios.',
    ],
    examples: [
      { label: 'Savings goal', expression: '$2,500 saved, $300/month, 4%, 5 years', result: 'Projected balance and gap' },
      { label: 'Emergency fund', expression: '$1,000 saved, $250/month for 2 years', result: 'Target comparison' },
      { label: 'Longer horizon', expression: '$5,000 saved, $200/month, 10 years', result: 'Growth estimate' },
    ],
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
      'This is business profit-margin math. It does not model brokerage margin accounts, borrowing to invest, leverage risk, taxes, overhead allocation, or accounting rules.',
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
    summary: 'Estimate business loan payment, interest, fees, and cash received.',
    description:
      'Use this free business loan calculator to estimate monthly payment, total paid, total interest, origination fee, and cash received after a fee.',
    icon: 'calculator-business-loan',
    formula:
      'The calculator uses the fixed-payment loan formula, estimates an origination fee from the loan amount, then shows total interest and cash received after the fee.',
    limit:
      'This does not include underwriting, collateral, variable rates, draw schedules, tax effects, SBA rules, late fees, prepayment penalties, or lender approval.',
    useCases: [
      'Estimate a monthly business loan payment.',
      'Account for a simple origination fee.',
      'Compare different rates and repayment terms.',
      'Check whether fee-adjusted cash received fits the plan.',
    ],
    examples: [
      { label: 'Small business loan', expression: '$50,000 at 9.5% for 5 years with 2% fee', result: 'Payment and fee estimate' },
      { label: 'Short term', expression: '$25,000 at 11% for 2 years', result: 'Faster payoff payment' },
      { label: 'No fee', expression: '$100,000 at 8.25% for 7 years', result: 'Loan payment estimate' },
    ],
    relatedSlugs: ['loan-calculator', 'interest-rate-calculator', 'debt-consolidation-calculator'],
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
];
