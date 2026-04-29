import type { BlogPostDefinition } from './blogPosts';
import { financeTools } from './financeTools';

interface GuideSection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  links?: Array<{
    href: string;
    label: string;
  }>;
}

export interface FinanceGuideDefinition {
  slug: string;
  toolSlug: string;
  label: string;
  title: string;
  description: string;
  path: string;
  intro: string;
  quickStart: string[];
  sections: GuideSection[];
  sidecarText: string;
}

interface GuideDetail {
  summary: string;
  purpose: string;
  enter: string[];
  example: string[];
  read: string[];
  mistakes: string[];
  next: string[];
}

const sourceLinks = {
  investorCompound: {
    href: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator',
    label: 'Investor.gov: Compound Interest Calculator',
  },
  cfpbMortgage: {
    href: 'https://www.consumerfinance.gov/language/cfpb-in-english/mortgages-key-terms/',
    label: 'Consumer Financial Protection Bureau: Mortgage key terms',
  },
  blsInflation: {
    href: 'https://www.bls.gov/bls/inflation.htm',
    label: 'BLS: Overview of inflation and price statistics',
  },
  irs2026: {
    href: 'https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill',
    label: 'IRS: Tax year 2026 inflation adjustments',
  },
  irsRevenueProcedure: {
    href: 'https://www.irs.gov/pub/irs-drop/rp-25-32.pdf',
    label: 'IRS Revenue Procedure 2025-32',
  },
  irs401k: {
    href: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits',
    label: 'IRS: 401(k) and profit-sharing plan contribution limits',
  },
  cfpbCreditCards: {
    href: 'https://www.consumerfinance.gov/consumer-tools/credit-cards/answers/basics/',
    label: 'Consumer Financial Protection Bureau: Credit card basics',
  },
  cfpbDebtCollection: {
    href: 'https://www.consumerfinance.gov/consumer-tools/debt-collection/',
    label: 'Consumer Financial Protection Bureau: Debt collection resources',
  },
  fsaRepaymentPlans: {
    href: 'https://studentaid.gov/manage-loans/repayment/plans',
    label: 'Federal Student Aid: Loan repayment plans',
  },
  fdicCdShopping: {
    href: 'https://www.fdic.gov/consumer-resource-center/2023-11/shopping-certificate-deposit',
    label: 'FDIC: Shopping for a Certificate of Deposit',
  },
  investorBonds: {
    href: 'https://www.investor.gov/introduction-investing/investing-basics/investment-products/bonds-or-fixed-income-products',
    label: 'Investor.gov: Bonds and fixed income products',
  },
  investorMutualFunds: {
    href: 'https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-funds-etfs/mutual-funds',
    label: 'Investor.gov: Mutual Funds',
  },
  irsIraLimits: {
    href: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-ira-contribution-limits',
    label: 'IRS: IRA contribution limits',
  },
  euVat: {
    href: 'https://taxation-customs.ec.europa.eu/taxation/vat_en',
    label: 'European Commission: VAT overview',
  },
  cfpbApr: {
    href: 'https://www.consumerfinance.gov/rules-policy/regulations/1026/22',
    label: 'CFPB Regulation Z: Annual percentage rate',
  },
  ftcAutoLease: {
    href: 'https://consumer.ftc.gov/financing-or-leasing-car',
    label: 'FTC: Financing or Leasing a Car',
  },
  irsDepreciation: {
    href: 'https://www.irs.gov/publications/p946',
    label: 'IRS Publication 946: How To Depreciate Property',
  },
  cfpbDebtToIncome: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/',
    label: 'Consumer Financial Protection Bureau: Debt-to-income ratio',
  },
};

function getFormulaAnswer(toolSlug: string) {
  return financeTools.find((tool) => tool.slug === toolSlug)?.faq[1]?.answer ?? 'The calculator uses the formula shown on the tool page.';
}

function getSourceLinks(toolSlug: string) {
  if (['mortgage-calculator', 'amortization-calculator'].includes(toolSlug)) {
    return [sourceLinks.cfpbMortgage];
  }

  if (['mortgage-payoff-calculator', 'house-affordability-calculator'].includes(toolSlug)) {
    return [sourceLinks.cfpbMortgage];
  }

  if (['compound-interest-calculator', 'investment-calculator', 'retirement-calculator', 'finance-calculator', 'interest-calculator', 'savings-calculator', 'annuity-calculator', 'annuity-payout-calculator', 'pension-calculator', 'simple-interest-calculator', 'college-cost-calculator'].includes(toolSlug)) {
    return [sourceLinks.investorCompound];
  }

  if (['credit-cards-payoff-calculator', 'debt-payoff-calculator', 'repayment-calculator'].includes(toolSlug)) {
    return [sourceLinks.cfpbDebtCollection, sourceLinks.cfpbCreditCards];
  }

  if (toolSlug === 'debt-consolidation-calculator') {
    return [sourceLinks.cfpbDebtCollection];
  }

  if (toolSlug === 'student-loan-calculator') {
    return [sourceLinks.fsaRepaymentPlans];
  }

  if (toolSlug === 'cd-calculator') {
    return [sourceLinks.fdicCdShopping];
  }

  if (toolSlug === 'bond-calculator') {
    return [sourceLinks.investorBonds];
  }

  if (toolSlug === 'mutual-fund-calculator') {
    return [sourceLinks.investorMutualFunds];
  }

  if (['ira-calculator', 'roth-ira-calculator'].includes(toolSlug)) {
    return [sourceLinks.irsIraLimits, sourceLinks.investorCompound];
  }

  if (toolSlug === 'vat-calculator') {
    return [sourceLinks.euVat];
  }

  if (['cash-back-or-low-interest-calculator', 'personal-loan-calculator', 'business-loan-calculator'].includes(toolSlug)) {
    return [sourceLinks.cfpbApr];
  }

  if (['auto-lease-calculator', 'boat-loan-calculator', 'lease-calculator'].includes(toolSlug)) {
    return [sourceLinks.ftcAutoLease, sourceLinks.cfpbApr];
  }

  if (toolSlug === 'depreciation-calculator') {
    return [sourceLinks.irsDepreciation];
  }

  if (toolSlug === 'average-return-calculator') {
    return [sourceLinks.investorCompound];
  }

  if (toolSlug === 'debt-to-income-ratio-calculator') {
    return [sourceLinks.cfpbDebtToIncome];
  }

  if (toolSlug === 'refinance-calculator') {
    return [sourceLinks.cfpbMortgage, sourceLinks.cfpbApr];
  }

  if (toolSlug === '401k-calculator') {
    return [sourceLinks.irs401k, sourceLinks.investorCompound];
  }

  if (toolSlug === 'credit-card-calculator') {
    return [sourceLinks.cfpbCreditCards];
  }

  if (toolSlug === 'inflation-calculator') {
    return [sourceLinks.blsInflation];
  }

  if (toolSlug === 'income-tax-calculator') {
    return [sourceLinks.irs2026, sourceLinks.irsRevenueProcedure];
  }

  return [];
}

const guideDetails: Record<string, GuideDetail> = {
  'mortgage-calculator': {
    summary: 'Learn how to estimate a mortgage payment with principal, interest, taxes, insurance, PMI, and HOA costs.',
    purpose:
      'The Mortgage Calculator is for a first-pass monthly housing estimate. It separates principal and interest from property tax, insurance, PMI, and HOA costs so the monthly number is easier to read.',
    enter: [
      'Enter the home price and down payment as dollar amounts, not percentages.',
      'Use the loan rate and term you want to compare, such as 6.5% for 30 years.',
      'Add property tax per year, then monthly insurance, PMI, and HOA only when those costs apply.',
    ],
    example: [
      'For a $400,000 home with $80,000 down, the loan amount is $320,000.',
      'The calculator finds principal and interest first, then adds the monthly ownership costs you entered.',
    ],
    read: [
      'Read principal and interest separately from the total monthly payment.',
      'Loan-to-value helps you see how much of the home price is financed.',
      'Total interest is the interest over the full loan term if the rate and payment stay fixed.',
    ],
    mistakes: [
      'Do not treat this as a lender Loan Estimate or final approval.',
      'Do not enter annual insurance in a monthly insurance box.',
      'Do not forget that closing costs, escrow changes, and local taxes can change the real payment.',
    ],
    next: ['Use Amortization Calculator to test extra payments.', 'Use Interest Rate Calculator if you only know the payment quote.'],
  },
  'loan-calculator': {
    summary: 'Learn how fixed loan payments are estimated from principal, interest rate, and term.',
    purpose:
      'The Loan Calculator is for fixed-payment debt where the balance is paid down over time. It shows the monthly payment and the interest cost behind that payment.',
    enter: [
      'Enter the amount borrowed as principal.',
      'Enter the annual interest rate as a percent, such as 9.5 for 9.5%.',
      'Enter the repayment term in years, using decimals for partial years when needed.',
    ],
    example: [
      'For $12,000 at 9.5% for 4 years, the calculator converts the annual rate to a monthly rate.',
      'It spreads repayment over 48 monthly payments and calculates total interest from total paid minus principal.',
    ],
    read: [
      'Monthly payment is the fixed estimate before extra fees or insurance.',
      'Total paid is payment times number of payments.',
      'Total interest shows the borrowing cost before fees or penalties.',
    ],
    mistakes: [
      'Do not compare two loans by payment alone if the terms are different.',
      'Do not use APR-with-fees as if it were always the contract interest rate.',
      'Do not ignore prepayment penalties or fees that are not in the calculator.',
    ],
    next: ['Use Payment Calculator for the same formula with a simpler layout.', 'Use Amortization Calculator to test extra monthly payments.'],
  },
  'auto-loan-calculator': {
    summary: 'Learn how vehicle price, taxes, fees, down payment, and trade-in affect an auto loan payment.',
    purpose:
      'The Auto Loan Calculator estimates how much may be financed after sales tax, fees, down payment, and trade-in. It is meant for comparing scenarios before shopping or negotiating.',
    enter: [
      'Enter vehicle price before down payment and trade-in.',
      'Enter trade-in value and down payment as dollar amounts.',
      'Add estimated sales tax rate and fees, then enter loan rate and term.',
    ],
    example: [
      'For a $32,000 vehicle, $4,000 down, and $3,000 trade-in, the financed amount starts below the sticker price.',
      'Sales tax and fees are added before the fixed monthly payment is estimated.',
    ],
    read: [
      'Amount financed is the number used in the loan payment formula.',
      'Total interest grows when the rate or term increases.',
      'Trade-in tax treatment can vary, so this is a planning estimate.',
    ],
    mistakes: [
      'Do not forget registration, documentation, title, or lender fees.',
      'Do not assume every state taxes a trade-in the same way.',
      'Do not choose a longer term only because the monthly payment looks easier.',
    ],
    next: ['Use Sales Tax Calculator to check tax on a purchase amount.', 'Use Loan Calculator to compare the auto loan with another fixed loan.'],
  },
  'interest-calculator': {
    summary: 'Learn the difference between simple interest and compound interest with clear examples.',
    purpose:
      'The Interest Calculator helps you compare two common interest ideas: simple interest grows from the original principal only, while compound interest grows from an increasing balance.',
    enter: [
      'Choose simple interest when interest does not earn additional interest.',
      'Choose compound interest when earnings are added back to the balance.',
      'Enter principal, annual rate, time, and any monthly contribution requested by the mode.',
    ],
    example: [
      '$1,000 at 5% simple interest for 3 years earns $150 because 1000 x 0.05 x 3 equals 150.',
      'With compounding, the balance can grow faster because each period starts from a larger balance.',
    ],
    read: [
      'Interest is the growth or cost before tax, fees, or penalties.',
      'Ending balance is principal plus interest and contributions.',
      'Compounding frequency can change the effective growth rate.',
    ],
    mistakes: [
      'Do not mix monthly and annual rates.',
      'Do not compare simple and compound results as if the formulas are the same.',
      'Do not treat an estimated return as guaranteed investment performance.',
    ],
    next: ['Use Compound Interest Calculator for more compounding controls.', 'Use Investment Calculator for recurring investing scenarios.'],
  },
  'payment-calculator': {
    summary: 'Learn how to estimate a fixed monthly payment and total interest from a balance, rate, and term.',
    purpose:
      'The Payment Calculator is a quick way to answer, "What would the monthly payment be?" It is useful when you already know principal, rate, and term.',
    enter: [
      'Enter the amount that will be repaid.',
      'Enter the annual rate as a percent.',
      'Enter the repayment term in years.',
    ],
    example: [
      'A $5,000 balance at 8% for 3 years becomes 36 monthly payments.',
      'The calculator estimates the fixed payment and multiplies it by 36 to show total paid.',
    ],
    read: [
      'Payment is the estimated monthly amount before fees.',
      'Total interest is the extra amount paid above the principal.',
      'A longer term usually lowers payment but raises total interest.',
    ],
    mistakes: [
      'Do not use it for interest-only, balloon, variable-rate, or fee-heavy loans.',
      'Do not compare payments without checking the term length.',
      'Do not forget that paying extra may change the payoff timeline.',
    ],
    next: ['Use Interest Rate Calculator if the rate is missing.', 'Use Amortization Calculator if you want extra-payment savings.'],
  },
  'retirement-calculator': {
    summary: 'Learn how current savings, monthly contributions, time, and return assumptions shape a retirement projection.',
    purpose:
      'The Retirement Calculator projects a future savings balance and compares it with a target. It is designed for scenario planning, not for deciding exactly how much you need.',
    enter: [
      'Enter current retirement savings and monthly contribution.',
      'Use an estimated annual return, understanding that real markets vary.',
      'Enter years until retirement and an optional target amount.',
    ],
    example: [
      '$25,000 saved plus $500/month for 25 years at 7% compounds into a projected future balance.',
      'The calculator also shows how much came from contributions versus estimated growth.',
    ],
    read: [
      'Ending balance is a projection based on the assumptions you entered.',
      'Goal gap shows how far the projection is above or below the target.',
      'The result is before taxes, fees, inflation, withdrawals, and market changes.',
    ],
    mistakes: [
      'Do not treat one return assumption as a promise.',
      'Do not ignore inflation when thinking about future spending power.',
      'Do not use this as a substitute for personalized retirement planning.',
    ],
    next: ['Use Inflation Calculator to test buying power.', 'Use Investment Calculator to compare contribution scenarios.'],
  },
  'amortization-calculator': {
    summary: 'Learn how amortization reduces a loan balance and how extra payments can save interest.',
    purpose:
      'The Amortization Calculator shows how a fixed loan pays down over time. It also estimates the payoff time and interest saved when you add extra monthly payments.',
    enter: [
      'Enter loan amount, annual rate, and term.',
      'Enter extra monthly payment only if you plan to pay above the scheduled payment.',
      'Keep the extra amount realistic so the comparison is useful.',
    ],
    example: [
      'For $200,000 at 6% for 30 years, the scheduled payment is calculated first.',
      'Adding $100/month reduces the balance faster, which lowers future interest.',
    ],
    read: [
      'Scheduled payment is the normal fixed payment before extra money.',
      'Months saved compares the original term with the extra-payment payoff.',
      'Interest saved is an estimate before fees, penalties, or servicer rules.',
    ],
    mistakes: [
      'Do not assume extra payments are always applied to principal without checking the lender.',
      'Do not ignore prepayment penalties.',
      'Do not use this for variable-rate or interest-only loans.',
    ],
    next: ['Use Mortgage Calculator for housing costs beyond principal and interest.', 'Use Loan Calculator for a plain payment estimate.'],
  },
  'investment-calculator': {
    summary: 'Learn how starting amount, monthly deposits, return, and time create an investment projection.',
    purpose:
      'The Investment Calculator estimates a future balance from a starting investment and monthly deposits. It is useful for comparing habits and assumptions.',
    enter: [
      'Enter the starting investment and monthly contribution.',
      'Enter an estimated annual return as a percent.',
      'Enter the number of years you want to project.',
    ],
    example: [
      '$5,000 plus $250/month at 7% for 20 years shows the effect of time and recurring contributions.',
      'The calculator separates total contributions from estimated investment growth.',
    ],
    read: [
      'Ending balance is not guaranteed.',
      'Total contributions show the money you put in.',
      'Estimated growth is the difference between ending balance and contributions.',
    ],
    mistakes: [
      'Do not ignore investment fees and taxes.',
      'Do not assume a steady return happens every year.',
      'Do not choose investments based only on a calculator projection.',
    ],
    next: ['Use Compound Interest Calculator for compounding frequency.', 'Use Retirement Calculator if you have a target amount.'],
  },
  'inflation-calculator': {
    summary: 'Learn how an annual inflation rate changes future cost and present buying power.',
    purpose:
      'The Inflation Calculator uses a chosen annual rate to estimate how prices or buying power may change over time. It is a simple planning model, not a live CPI lookup.',
    enter: [
      'Enter the amount you want to adjust.',
      'Enter the annual inflation rate you want to test.',
      'Enter the number of years in the projection.',
    ],
    example: [
      '$100 at 3% inflation for 10 years becomes about $134.39 in future cost.',
      'The calculator also shows how much buying power a fixed amount keeps after inflation.',
    ],
    read: [
      'Future cost estimates what the same basket might cost if it rises by your rate.',
      'Present buying power estimates what a future fixed amount is worth in today-style dollars.',
      'Actual CPI and specific product prices can move differently.',
    ],
    mistakes: [
      'Do not assume one inflation rate matches every category.',
      'Do not use this as a historical CPI lookup.',
      'Do not ignore inflation when comparing long-term savings goals.',
    ],
    next: ['Use Retirement Calculator to compare future savings targets.', 'Use Investment Calculator to test return versus inflation assumptions.'],
  },
  'finance-calculator': {
    summary: 'Learn how to use the general finance calculator as a quick future-value scratchpad.',
    purpose:
      'The Finance Calculator is the flexible finance scratchpad. It estimates a future balance from a starting amount, monthly contribution, annual rate, and time.',
    enter: [
      'Enter the current starting amount.',
      'Enter the monthly amount you plan to add.',
      'Enter an estimated annual rate and number of years.',
    ],
    example: [
      '$2,000 plus $150/month at 5% for 8 years gives a future balance estimate.',
      'Changing only the monthly contribution shows how much habits can affect the projection.',
    ],
    read: [
      'Ending balance is the main projected value.',
      'Total contributions show what came from your starting amount and deposits.',
      'Estimated growth shows what came from the rate assumption.',
    ],
    mistakes: [
      'Do not use this for debt payoff without checking whether the rate/payment behavior matches your debt.',
      'Do not treat the return as guaranteed.',
      'Do not forget taxes, fees, and account rules.',
    ],
    next: ['Use Investment Calculator for investment-specific wording.', 'Use Payment Calculator for fixed debt payments.'],
  },
  'income-tax-calculator': {
    summary: 'Learn how a simplified 2026 U.S. federal ordinary income tax estimate is calculated.',
    purpose:
      'The Income Tax Calculator estimates 2026 U.S. federal ordinary income tax. It applies a deduction, then uses 2026 federal tax brackets to estimate tax before and after credits you enter.',
    enter: [
      'Choose filing status because the standard deduction and brackets depend on it.',
      'Enter gross ordinary income before deduction.',
      'Use the 2026 standard deduction by default, or enter a custom deduction and credits if you are testing a scenario.',
    ],
    example: [
      'For a single filer with $100,000 gross income, the calculator subtracts the 2026 standard deduction.',
      'The remaining taxable income is taxed across the ordinary income brackets rather than all at one rate.',
    ],
    read: [
      'Taxable income is gross income minus the deduction used.',
      'Effective rate compares estimated federal tax with gross income.',
      'Marginal rate is the bracket rate on the next ordinary dollar, not the rate on all income.',
    ],
    mistakes: [
      'Do not use this as a complete tax return.',
      'Do not forget payroll tax, state tax, capital gains, phaseouts, AMT, and credits not entered.',
      'Do not rely on old-year brackets when planning for 2026.',
    ],
    next: ['Use Salary Calculator for paycheck-style conversions.', 'Use official IRS forms or a tax professional for filing decisions.'],
  },
  'compound-interest-calculator': {
    summary: 'Learn how principal, deposits, rate, time, and compounding frequency shape compound growth.',
    purpose:
      'The Compound Interest Calculator focuses on growth from compounding. It is useful when you want to see how a starting balance and monthly deposits can build over time.',
    enter: [
      'Enter initial principal and monthly contribution.',
      'Enter estimated annual interest or return rate.',
      'Choose the compounding frequency and time horizon.',
    ],
    example: [
      '$1,000 plus $100/month at 6% for 10 years shows both contributions and compound growth.',
      'Monthly deposits are treated as end-of-month contributions in the estimate.',
    ],
    read: [
      'Ending balance includes principal, deposits, and estimated interest.',
      'Effective annual rate can differ from the stated rate when compounding happens more than once per year.',
      'Total interest is ending balance minus the money contributed.',
    ],
    mistakes: [
      'Do not confuse annual rate with monthly rate.',
      'Do not assume compounding frequency matters more than contribution size and time.',
      'Do not ignore taxes, fees, or investment risk.',
    ],
    next: ['Use Investment Calculator for investment wording.', 'Use Interest Calculator to compare simple interest.'],
  },
  'salary-calculator': {
    summary: 'Learn how annual salary converts to monthly, biweekly, weekly, daily, and hourly pay.',
    purpose:
      'The Salary Calculator converts salary into time-based pay views. It is helpful for comparing offers, checking hourly equivalents, and making a rough take-home estimate.',
    enter: [
      'Enter annual gross salary.',
      'Enter hours worked per week and paid weeks per year.',
      'Optionally enter a simple tax-rate estimate for rough take-home math.',
    ],
    example: [
      '$78,000 over 40 hours per week and 52 weeks per year equals $37.50 gross per hour.',
      'A 22% tax estimate subtracts a simple percentage, not a real payroll withholding table.',
    ],
    read: [
      'Gross amounts are before tax and deductions.',
      'Hourly equivalent depends on hours per week and weeks per year.',
      'Estimated take-home is only a simple percentage estimate.',
    ],
    mistakes: [
      'Do not treat this as a paycheck calculator.',
      'Do not forget benefits, retirement contributions, deductions, overtime, and bonuses.',
      'Do not compare jobs without checking hours, commute, benefits, and paid time off.',
    ],
    next: ['Use Income Tax Calculator for federal tax estimate context.', 'Use Percentage Calculator for raise or pay-change math.'],
  },
  'interest-rate-calculator': {
    summary: 'Learn how to estimate the annual rate implied by a payment, principal, and loan term.',
    purpose:
      'The Interest Rate Calculator works backward from a payment quote. It estimates the annual rate that would make the fixed-payment loan formula match your numbers.',
    enter: [
      'Enter principal or amount financed.',
      'Enter the quoted monthly payment.',
      'Enter the repayment term in years.',
    ],
    example: [
      '$25,000 principal, $483.32 monthly payment, and 5 years produces an estimated annual rate near 6%.',
      'If the payment is too low to repay principal even at 0%, the calculator shows an input warning.',
    ],
    read: [
      'Annual rate is the estimated nominal rate, not necessarily APR.',
      'Total interest is payment times months minus principal.',
      'Small payment changes can noticeably change the implied rate.',
    ],
    mistakes: [
      'Do not use this as an APR calculator when fees are rolled into the offer.',
      'Do not include taxes or insurance in the monthly payment if you only want the loan rate.',
      'Do not use it for variable-rate, interest-only, or balloon loans.',
    ],
    next: ['Use Loan Calculator once you know the rate.', 'Use Auto Loan Calculator if the quote includes vehicle tax and fees.'],
  },
  'sales-tax-calculator': {
    summary: 'Learn how to calculate sales tax amount and final total from a subtotal and tax rate.',
    purpose:
      'The Sales Tax Calculator is for quick receipt and checkout math. You enter the subtotal and tax rate, and it shows the tax amount and total.',
    enter: [
      'Enter the price before sales tax.',
      'Enter the tax rate as a percent, such as 7.5 for 7.5%.',
      'Use the rate from your local checkout, receipt, or tax table.',
    ],
    example: [
      '$80 at 7.5% gives $6 tax because 80 x 0.075 equals 6.',
      'The total is $86 because subtotal plus tax equals final cost.',
    ],
    read: [
      'Tax amount is the added sales tax.',
      'Total is the final amount after tax.',
      'A manual rate keeps the tool fast but means you must supply the correct local rate.',
    ],
    mistakes: [
      'Do not use the calculator as a local rate lookup.',
      'Do not forget exemptions, shipping rules, marketplace rules, or tax holidays.',
      'Do not enter 0.075 when the field asks for 7.5%.',
    ],
    next: ['Use Percentage Calculator for discount-before-tax math.', 'Use Auto Loan Calculator when vehicle price, tax, fees, and financing all matter.'],
  },
  'currency-calculator': {
    summary: 'Learn how to convert currency with a manual exchange rate, optional fee, and clear conversion steps.',
    purpose:
      'The Currency Calculator is for manual-rate conversions. It helps when you already have a rate from a bank, card, transfer service, or rate table and want to see the converted amount after an optional fee.',
    enter: [
      'Enter the amount you want to convert.',
      'Enter the exchange rate as target currency per 1 source currency.',
      'Enter a fee percent only if your bank, card, or transfer service charges one.',
    ],
    example: [
      'If you convert 100 at a rate of 1.25, the before-fee result is 125 target units.',
      'If a 2.5% fee applies, the calculator subtracts that percentage from the converted amount.',
    ],
    read: [
      'Converted amount is the final estimate after any fee.',
      'Before fee shows the pure amount times rate calculation.',
      'Fee amount shows how much the optional fee removed from the converted value.',
    ],
    mistakes: [
      'Do not use this as a live exchange-rate lookup.',
      'Do not enter the inverse rate unless that is the rate you intend to use.',
      'Do not forget that card networks, banks, and transfer services may use different rates.',
    ],
    next: ['Use Percentage Calculator if you need to compare fees.', 'Use Finance Calculator for general money projections.'],
  },
  'mortgage-payoff-calculator': {
    summary: 'Learn how extra monthly payments or a one-time principal payment can shorten a mortgage payoff estimate.',
    purpose:
      'The Mortgage Payoff Calculator estimates how long a fixed-rate mortgage balance may take to pay off when you add extra principal payments. It is for planning before you request an official lender payoff quote.',
    enter: [
      'Enter the current loan balance, not the original home price.',
      'Enter the remaining term and current fixed interest rate.',
      'Add an extra monthly payment or one-time extra payment only if you plan to pay it toward principal.',
    ],
    example: [
      'A $280,000 balance at 6.25% with 25 years remaining gets a scheduled payment first.',
      'Adding $200 per month increases the principal paid each month and can reduce both months and interest.',
    ],
    read: [
      'Payoff time is the estimated number of months until the balance reaches zero.',
      'Interest saved compares the extra-payment scenario with the scheduled payment.',
      'Months saved shows how much sooner the loan may be paid off.',
    ],
    mistakes: [
      'Do not use this as an official payoff statement.',
      'Do not include escrow payments as extra principal.',
      'Do not assume your lender applies every extra payment the same way without checking.',
    ],
    next: ['Use Mortgage Calculator for the full monthly payment estimate.', 'Use Amortization Calculator to test extra payments on other fixed loans.'],
  },
  '401k-calculator': {
    summary: 'Learn how salary contributions, employer match, time, and return assumptions affect a 401K projection.',
    purpose:
      'The 401K Calculator projects a retirement account balance from current savings, your salary contribution percent, an estimated employer match, time, and return assumption. It is built for scenario planning, not plan administration.',
    enter: [
      'Enter your current 401K balance and annual salary.',
      'Enter your contribution as a percent of salary.',
      'Enter employer match as a percent of your contribution and the salary percent where the match stops.',
    ],
    example: [
      'With a $75,000 salary and 8% contribution, your monthly contribution is based on salary x 8% / 12.',
      'A 50% match up to 6% of salary means the employer match is based on the first 6% you contribute.',
    ],
    read: [
      'Projected balance is the estimated future account value.',
      'Your monthly contribution and employer monthly match show the deposit split.',
      'The projection does not tell you whether contributions are inside current legal or plan limits.',
    ],
    mistakes: [
      'Do not treat the result as guaranteed investment performance.',
      'Do not ignore vesting, fees, taxes, Roth/traditional choices, loans, or withdrawals.',
      'Do not rely on this tool to enforce IRS contribution limits.',
    ],
    next: ['Use Retirement Calculator for a broader savings target.', 'Use Compound Interest Calculator to compare deposit and rate assumptions.'],
  },
  'house-affordability-calculator': {
    summary: 'Learn how income, debts, down payment, mortgage rate, taxes, insurance, and HOA affect a home price estimate.',
    purpose:
      'The House Affordability Calculator estimates a possible home price from a monthly housing budget. It uses a debt-to-income target so you can see how debts and housing costs compete for the same monthly income.',
    enter: [
      'Enter annual gross income and existing monthly debts.',
      'Enter down payment, mortgage rate, and loan term.',
      'Enter estimated property tax percent, insurance, and HOA so the monthly payment is not principal and interest only.',
    ],
    example: [
      'For $110,000 annual income, the calculator first estimates monthly income.',
      'At a 36% debt-to-income target, it subtracts monthly debts and searches for a home price whose payment fits the remaining amount.',
    ],
    read: [
      'Affordable home price is the highest estimate that fits the selected monthly target.',
      'Loan amount is home price minus down payment.',
      'Tax, insurance, and HOA reduce the room left for principal and interest.',
    ],
    mistakes: [
      'Do not treat this as mortgage approval.',
      'Do not leave out HOA, insurance, or tax if they apply.',
      'Do not forget closing costs, emergency savings, repairs, credit requirements, and lender rules.',
    ],
    next: ['Use Mortgage Calculator to inspect the monthly payment.', 'Use Mortgage Payoff Calculator later when comparing extra principal payments.'],
  },
  'savings-calculator': {
    summary: 'Learn how current savings, monthly deposits, interest rate, and time affect a savings goal.',
    purpose:
      'The Savings Calculator projects a future balance and compares it with a target. It is useful for emergency funds, travel funds, down payments, and other goals with regular deposits.',
    enter: [
      'Enter current savings and the monthly amount you plan to deposit.',
      'Enter an annual rate as a percent, such as 4 for 4%.',
      'Enter the time horizon and optional target amount.',
    ],
    example: [
      '$2,500 saved plus $300 per month at 4% for 5 years compounds into a projected balance.',
      'The calculator compares that balance with the target so you can see whether there is a gap.',
    ],
    read: [
      'Projected balance is the estimate at the end of the time period.',
      'Total deposits shows money you put in, while estimated interest shows growth from the rate.',
      'Target gap tells you how far the projection is from your goal.',
    ],
    mistakes: [
      'Do not assume the rate will stay fixed unless your account guarantees it.',
      'Do not forget taxes, fees, withdrawals, or changed deposit habits.',
      'Do not compare savings and investments as if their risk is the same.',
    ],
    next: ['Use Compound Interest Calculator for compounding frequency controls.', 'Use Investment Calculator for longer risk-based growth scenarios.'],
  },
  'rent-calculator': {
    summary: 'Learn how to estimate a rent budget from income, target percentage, debts, and utilities.',
    purpose:
      'The Rent Calculator helps turn monthly income into a practical rent ceiling. It subtracts debts and estimated utilities from a target rent percentage so the estimate is easier to compare with real listings.',
    enter: [
      'Enter monthly income after choosing the income basis you want to use.',
      'Enter a target rent percent such as 25, 30, or 35.',
      'Enter monthly debt payments and estimated utilities so they reduce the rent ceiling.',
    ],
    example: [
      'If monthly income is $5,200 and the target is 30%, the starting rent target is $1,560.',
      'Subtracting $350 debts and $180 utilities leaves an estimated rent ceiling of $1,030.',
    ],
    read: [
      'Max rent is the monthly rent estimate after debts and utilities.',
      'Annual rent simply multiplies the monthly estimate by 12.',
      'Income left after rent, debts, and utilities shows breathing room before other expenses.',
    ],
    mistakes: [
      'Do not forget deposits, renters insurance, parking, pet fees, or moving costs.',
      'Do not use a rent percentage that ignores your real monthly bills.',
      'Do not treat the estimate as a landlord approval rule.',
    ],
    next: ['Use Salary Calculator to convert annual salary into monthly pay.', 'Use Percentage Calculator to compare rent targets.'],
  },
  'annuity-calculator': {
    summary: 'Learn how fixed payments, rate, timing, and years affect annuity present value and future value.',
    purpose:
      'The Annuity Calculator estimates the present value and future value of a repeated fixed payment. It supports ordinary annuity timing and annuity-due timing for payments made at the beginning of each period.',
    enter: [
      'Enter the fixed payment amount.',
      'Enter annual rate, number of years, and payments per year.',
      'Choose whether payments happen at the end or beginning of each period.',
    ],
    example: [
      '$500 per month for 20 years means 240 payments.',
      'The calculator converts the annual rate to a monthly rate, then estimates future value and present value.',
    ],
    read: [
      'Future value estimates what the payment stream could grow to.',
      'Present value estimates the value of that payment stream today at the selected rate.',
      'Beginning-of-period payments are worth more in the formula because each payment has one extra period to grow.',
    ],
    mistakes: [
      'Do not treat this as an insurance annuity quote.',
      'Do not ignore fees, taxes, inflation riders, surrender charges, or contract guarantees.',
      'Do not mix monthly payments with annual payments without changing payments per year.',
    ],
    next: ['Use Investment Calculator for contribution growth.', 'Use Retirement Calculator for broader retirement savings scenarios.'],
  },
  'credit-card-calculator': {
    summary: 'Learn how balance, APR, monthly payment, and new charges affect credit card payoff time.',
    purpose:
      'The Credit Card Calculator estimates how long a balance may take to pay off with a fixed monthly payment. It shows interest cost and makes it easier to compare regular payment and extra-payment scenarios.',
    enter: [
      'Enter the current credit card balance.',
      'Enter APR as a percent, such as 22.9 for 22.9%.',
      'Enter the monthly payment and optional new monthly charges.',
    ],
    example: [
      'A $4,500 balance at 22.9% APR and $250 per month gets monthly interest added before the payment is subtracted.',
      'Increasing the payment to $350 usually shortens payoff time and reduces total interest.',
    ],
    read: [
      'Payoff time is the estimated number of months until the balance reaches zero.',
      'Total interest shows estimated interest paid during payoff.',
      'Final payment may be smaller than the normal monthly payment.',
    ],
    mistakes: [
      'Do not keep adding new charges if your goal is fast payoff.',
      'Do not assume this matches the issuer daily-balance method exactly.',
      'Do not ignore late fees, annual fees, promotional APRs, or variable APR changes.',
    ],
    next: ['Use Interest Calculator to understand APR math.', 'Use Payment Calculator for fixed-payment debt comparisons.'],
  },
};

function buildDefaultGuideDetail(tool: (typeof financeTools)[number]): GuideDetail {
  const firstExample = tool.examples[0];
  const secondExample = tool.examples[1] ?? firstExample;

  return {
    summary: `Learn how to use the ${tool.name} in plain language: what to enter, what the result means, and what the estimate leaves out.`,
    purpose: `${tool.description} It is best for ${tool.useCases[0]?.toLowerCase() ?? 'quick planning'} and for comparing scenarios before you rely on a number.`,
    enter: [
      `Start with the fields shown on the ${tool.name} page and enter values in the same units used by the labels.`,
      'Use annual rates as percentages, such as 6.5 for 6.5%, and keep monthly amounts in monthly fields.',
      firstExample
        ? `Try the first example first: ${firstExample.expression}. Then replace one number at a time so you can see what changed.`
        : 'Try a built-in example before entering your own numbers.',
    ],
    example: [
      firstExample
        ? `${firstExample.label} uses ${firstExample.expression}, and the result focuses on ${firstExample.result.toLowerCase()}.`
        : `Use the first example on the ${tool.name} page to see a complete estimate.`,
      secondExample
        ? `Use ${secondExample.label.toLowerCase()} as a quick comparison so the guide is not based on only one scenario.`
        : `Compare the result with the formula line so you can see how the ${tool.name} reached the answer.`,
    ],
    read: [
      'Read the large answer first, because it is the main result the calculator is built around.',
      'Then read the supporting lines. They explain what drove the result, such as payment, interest, total cost, savings gap, return, or time.',
      `Check the formula note: ${tool.formula}`,
    ],
    mistakes: [
      'Do not mix monthly and annual amounts.',
      'Do not copy an answer before checking the rate and term.',
      tool.limit,
    ],
    next: tool.relatedSlugs.length > 0
      ? [`Try ${tool.relatedSlugs[0].replaceAll('-', ' ')} next to compare the same question from another angle.`]
      : ['Copy the answer only after checking the assumptions.'],
  };
}

function getGuideDetail(tool: (typeof financeTools)[number]) {
  return guideDetails[tool.slug] ?? buildDefaultGuideDetail(tool);
}

function formatExample(example: (typeof financeTools)[number]['examples'][number] | undefined) {
  if (!example) {
    return 'the first filled-out example';
  }

  return `${example.label}: ${example.expression}`;
}

export const financeBlogPosts: BlogPostDefinition[] = financeTools.map((tool) => {
  const detail = getGuideDetail(tool);

  return {
    slug: `how-to-use-${tool.slug}`,
    title: `How to use the ${tool.name}`,
    label: `${tool.name.replace(' Calculator', '')} guide`,
    summary: detail.summary,
  };
});

export const financeBlogGuides: FinanceGuideDefinition[] = financeTools.map((tool) => {
  const detail = getGuideDetail(tool);
  const primaryExample = tool.examples[0];
  const primaryExampleText = formatExample(primaryExample);
  const sourceLinks = getSourceLinks(tool.slug);

  return {
    slug: `how-to-use-${tool.slug}`,
    toolSlug: tool.slug,
    label: `${tool.name.replace(' Calculator', '')} guide`,
    title: `How to use the ${tool.name}`,
    description: detail.summary,
    path: `/blog/how-to-use-${tool.slug}/`,
    intro: `${detail.summary} Use this guide as a plain-English walkthrough: enter the money values carefully, read the main estimate, then check what the estimate leaves out before you rely on it.`,
    quickStart: [
      `Open the ${tool.name}.`,
      detail.enter[0],
      `Use the first example, "${primaryExampleText}", if you want to see a filled-out estimate before entering your own values.`,
      'Calculate, read the formula line, then copy the result only after the amounts, rates, and term look right.',
    ],
    sections: [
      {
        title: 'What this calculator is for',
        paragraphs: [
          detail.purpose,
          `Good fit examples: ${tool.useCases.slice(0, 2).join(' ')}`,
        ],
      },
      {
        title: 'What to enter',
        paragraphs: [
          'Finance estimates are sensitive to small input changes. Check whether a field expects a monthly amount, annual amount, dollar value, or percent before calculating.',
        ],
        bullets: detail.enter,
      },
      {
        title: 'Example walkthrough',
        paragraphs: [
          primaryExample
            ? `Try the calculator example: ${primaryExampleText}. The example result is ${primaryExample.result}.`
            : 'Use one of the examples on the tool page to see a complete estimate before entering your own values.',
        ],
        bullets: detail.example,
      },
      {
        title: 'Formula and steps',
        paragraphs: [
          getFormulaAnswer(tool.slug),
          'The formula line on the calculator page is there so the number is not a black box. If the estimate is surprising, check the formula line and the inputs before using the answer in a budget, comparison, or planning note.',
        ],
      },
      {
        title: 'How to read the answer',
        paragraphs: [
          'Start with the headline result. Then read the supporting lines to see what made the number larger or smaller, such as rate, term, principal, tax, fees, or contributions.',
        ],
        bullets: detail.read,
      },
      {
        title: 'Common mistakes to avoid',
        paragraphs: [
          'Most bad finance estimates come from mixing rates, terms, monthly amounts, and annual amounts. The other common mistake is using a planning estimate as if it were a final quote.',
        ],
        bullets: detail.mistakes,
      },
      {
        title: 'What to try next',
        paragraphs: [
          'A related calculator can help check the same money question from another angle before you rely on one result.',
        ],
        bullets: detail.next,
      },
      {
        title: 'Sources and estimate notes',
        paragraphs: [
          sourceLinks.length > 0
            ? 'This guide links to public financial, consumer, statistical, or tax references where they are useful for understanding the calculator context.'
            : 'This guide explains the calculator inputs, formula context, and estimate limits without treating the result as a final quote or professional recommendation.',
          'Source links improve transparency, but they do not turn a quick calculator into professional advice or a final loan, tax, payroll, or investment answer.',
        ],
        links: sourceLinks,
      },
    ],
    sidecarText: `Keep the ${tool.name} open beside this guide. Try the example first, then replace the numbers with your own scenario and check the estimate limits before copying the result.`,
  };
});

export function getFinanceBlogGuide(slug: string) {
  return financeBlogGuides.find((guide) => guide.slug === slug);
}
