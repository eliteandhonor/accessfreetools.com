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
    href: 'https://openstax.org/books/principles-finance/pages/7-2-time-value-of-money-tvm-basics',
    label: 'OpenStax Principles of Finance: Time value of money basics',
  },
  investorAnnuities: {
    href: 'https://openstax.org/books/principles-finance/pages/8-2-annuities',
    label: 'OpenStax Principles of Finance: Annuities and present value',
  },
  consumerBudgetWorksheet: {
    href: 'https://www.mymoney.gov/tools',
    label: 'MyMoney.gov: Financial tools and budget resources',
  },
  pbgcPensionCoverage: {
    href: 'https://www.pbgc.gov/workers-retirees/learn/understanding-your-pension-pbgc-coverage',
    label: 'PBGC: Understanding your pension and PBGC coverage',
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
  irsSalesTax: {
    href: 'https://www.irs.gov/salestax',
    label: 'IRS: Sales Tax Deduction Calculator and state/local sales tax context',
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
    href: 'https://www.consumerfinance.gov/paying-for-college/repay-student-debt/',
    label: 'Consumer Financial Protection Bureau: Repay student debt',
  },
  educationNetPrice: {
    href: 'https://collegecost.ed.gov/net-price',
    label: 'U.S. Department of Education: Net Price Calculator Center',
  },
  fdicCdShopping: {
    href: 'https://www.fdic.gov/consumer-resource-center/2023-11/shopping-certificate-deposit',
    label: 'FDIC: Shopping for a Certificate of Deposit',
  },
  investorBonds: {
    href: 'https://www.finra.org/investors/investing/investment-products/bonds',
    label: 'FINRA: Bonds',
  },
  investorMutualFunds: {
    href: 'https://www.finra.org/investors/investing/investment-products/mutual-funds',
    label: 'FINRA: Mutual funds',
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
  cfpbAprVsInterest: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-loan-interest-rate-and-the-apr-en-733/',
    label: 'CFPB: Loan interest rate vs. APR',
  },
  cfpbPersonalInstallmentFees: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/do-personal-installment-loans-have-fees-en-2120/',
    label: 'CFPB: Personal installment loan fees',
  },
  cfpbAutoFinancingOffers: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/how-do-i-qualify-for-an-advertised-0-auto-financing-en-781/',
    label: 'CFPB: Advertised 0% auto financing and cash rebate incentives',
  },
  sbaLoans: {
    href: 'https://www.sba.gov/funding-programs/loans',
    label: 'U.S. Small Business Administration: Loans',
  },
  investorAnnualReturn: {
    href: 'https://openstax.org/books/contemporary-mathematics/pages/6-7-investments',
    label: 'OpenStax: Investments and return on investment',
  },
  openStaxDiscounts: {
    href: 'https://openstax.org/books/contemporary-mathematics/pages/6-2-discounts-markups-and-sales-tax',
    label: 'OpenStax: Discounts, markups, and sales tax',
  },
  openStaxPercent: {
    href: 'https://openstax.org/books/contemporary-mathematics/pages/6-1-understanding-percent',
    label: 'OpenStax: Understanding Percent',
  },
  googleAdSensePageCtr: {
    href: 'https://support.google.com/adsense/answer/112026?hl=en',
    label: 'Google AdSense Help: Page CTR',
  },
  googleAdSensePageRpm: {
    href: 'https://support.google.com/adsense/answer/112030?hl=en',
    label: 'Google AdSense Help: Page RPM',
  },
  openStaxInvestments: {
    href: 'https://openstax.org/books/contemporary-mathematics/pages/6-7-investments',
    label: 'OpenStax: Investments and return on investment',
  },
  openStaxPayback: {
    href: 'https://openstax.org/books/principles-finance/pages/16-1-payback-period-method',
    label: 'OpenStax Principles of Finance: Payback Period Method',
  },
  openStaxPresentValue: {
    href: 'https://openstax.org/books/principles-finance/pages/8-2-annuities',
    label: 'OpenStax Principles of Finance: Annuities and present value',
  },
  openStaxFutureValue: {
    href: 'https://openstax.org/books/principles-finance/pages/7-2-time-value-of-money-tvm-basics',
    label: 'OpenStax Principles of Finance: Time value of money basics',
  },
  openStaxNpv: {
    href: 'https://openstax.org/books/principles-finance/pages/16-2-net-present-value-npv-method',
    label: 'OpenStax Principles of Finance: Net Present Value method',
  },
  dolCommissions: {
    href: 'https://www.dol.gov/general/topic/wages/commissions',
    label: 'U.S. Department of Labor: Commissions',
  },
  moneyHelperMortgage: {
    href: 'https://www.consumerfinance.gov/consumer-tools/mortgages/',
    label: 'Consumer Financial Protection Bureau: Mortgage resources',
  },
  canadaInterestAct: {
    href: 'https://laws-lois.justice.gc.ca/eng/acts/I-15/FullText.html',
    label: 'Justice Laws Canada: Interest Act',
  },
  ftcAutoLease: {
    href: 'https://consumer.ftc.gov/financing-or-leasing-car',
    label: 'FTC: Financing or Leasing a Car',
  },
  irsDepreciation: {
    href: 'https://www.irs.gov/publications/p946',
    label: 'IRS Publication 946: How To Depreciate Property',
  },
  openStaxDepreciation: {
    href: 'https://openstax.org/books/principles-financial-accounting/pages/11-3-explain-and-apply-depreciation-methods-to-allocate-capitalized-costs',
    label: 'OpenStax: Depreciation methods',
  },
  cfpbDebtToIncome: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/',
    label: 'Consumer Financial Protection Bureau: Debt-to-income ratio',
  },
  irsEstateGift: {
    href: 'https://www.irs.gov/businesses/small-businesses-self-employed/whats-new-estate-and-gift-tax',
    label: 'IRS: Estate and gift tax updates',
  },
  irsRmd: {
    href: 'https://www.irs.gov/publications/p590b',
    label: 'IRS Publication 590-B: RMD Uniform Lifetime Table',
  },
  ssaClaimingAge: {
    href: 'https://www.benefits.gov/benefit/4402',
    label: 'Benefits.gov: Social Security retirement insurance',
  },
  irsFica: {
    href: 'https://www.irs.gov/taxtopics/tc751',
    label: 'IRS Topic 751: Social Security and Medicare withholding rates',
  },
  irsWithholdingEstimatorFaqs: {
    href: 'https://www.irs.gov/individuals/tax-withholding-estimator-faqs',
    label: 'IRS: Tax Withholding Estimator FAQs',
  },
  openStaxIrr: {
    href: 'https://openstax.org/books/principles-finance/pages/16-3-internal-rate-of-return-irr-method',
    label: 'OpenStax Principles of Finance: Internal Rate of Return method',
  },
  vaFundingFee: {
    href: 'https://www.va.gov/housing-assistance/home-loans/funding-fee-and-closing-costs',
    label: 'VA: Funding fee and loan closing costs',
  },
  hudFhaMip: {
    href: 'https://www.hud.gov/hud-partners/housing-mip',
    label: 'HUD: FHA single family mortgage insurance premiums',
  },
  cfpbHeloc: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-home-equity-line-of-credit-heloc-en-107/',
    label: 'CFPB: What is a HELOC?',
  },
  cfpbHomeEquity: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-home-equity-loan-en-106/',
    label: 'CFPB: What is a home equity loan?',
  },
  cfpbDownPayment: {
    href: 'https://www.consumerfinance.gov/owning-a-home/your-down-payment-decision/',
    label: 'CFPB: Your down payment decision',
  },
  canadaMortgage: {
    href: 'https://www.canada.ca/en/financial-consumer-agency/services/mortgages/mortgage-terms-amortization.html',
    label: 'Canada.ca: Mortgage terms and amortization',
  },
  govUkMortgage: {
    href: 'https://www.gov.uk/algorithmic-transparency-records/money-and-pensions-service-mortgage-repayment-calculator',
    label: 'GOV.UK: Mortgage repayment calculator transparency record',
  },
  sbaBreakEven: {
    href: 'https://www.sba.gov/business-guide/plan-your-business/calculate-your-startup-costs/break-even-point',
    label: 'U.S. Small Business Administration: Break-even point',
  },
  openStaxBreakEven: {
    href: 'https://openstax.org/books/principles-managerial-accounting/pages/3-2-calculate-a-break-even-point-in-units-and-dollars',
    label: 'OpenStax Managerial Accounting: Break-even point in units and dollars',
  },
  openStaxFinancialStatementAnalysis: {
    href: 'https://openstax.org/books/principles-financial-accounting/pages/a-financial-statement-analysis',
    label: 'OpenStax Financial Accounting: Financial statement analysis',
  },
  secFinancialStatements: {
    href: 'https://www.sec.gov/about/reports-publications/beginners-guide-financial-statements',
    label: "SEC: Beginners' Guide to Financial Statements",
  },
};

function getFormulaAnswer(toolSlug: string) {
  return (
    financeTools
      .find((tool) => tool.slug === toolSlug)
      ?.faq.find((item) => item.question.includes('doing with my numbers'))?.answer ??
    'The calculator uses the formula shown on the tool page.'
  );
}

function getSourceLinks(toolSlug: string) {
  if (['mortgage-calculator', 'amortization-calculator'].includes(toolSlug)) {
    return [sourceLinks.cfpbMortgage];
  }

  if (['mortgage-payoff-calculator', 'house-affordability-calculator'].includes(toolSlug)) {
    return [sourceLinks.cfpbMortgage];
  }

  if (toolSlug === 'savings-calculator') {
    return [sourceLinks.investorCompound, sourceLinks.consumerBudgetWorksheet];
  }

  if (toolSlug === 'budget-calculator') {
    return [sourceLinks.consumerBudgetWorksheet, sourceLinks.cfpbDebtToIncome];
  }

  if (toolSlug === 'rent-calculator') {
    return [sourceLinks.consumerBudgetWorksheet, sourceLinks.cfpbDebtToIncome];
  }

  if (['annuity-calculator', 'annuity-payout-calculator'].includes(toolSlug)) {
    return [sourceLinks.investorAnnuities, sourceLinks.investorCompound];
  }

  if (toolSlug === 'pension-calculator') {
    return [sourceLinks.pbgcPensionCoverage, sourceLinks.investorCompound];
  }

  if (toolSlug === 'college-cost-calculator') {
    return [sourceLinks.educationNetPrice, sourceLinks.investorCompound];
  }

  if (toolSlug === 'irr-calculator') {
    return [sourceLinks.openStaxIrr, sourceLinks.investorCompound];
  }

  if (toolSlug === 'roi-calculator') {
    return [sourceLinks.openStaxInvestments, sourceLinks.investorAnnualReturn];
  }

  if (toolSlug === 'payback-period-calculator') {
    return [sourceLinks.openStaxPayback, sourceLinks.openStaxNpv];
  }

  if (toolSlug === 'present-value-calculator') {
    return [sourceLinks.openStaxPresentValue, sourceLinks.openStaxNpv];
  }

  if (toolSlug === 'future-value-calculator') {
    return [sourceLinks.openStaxFutureValue, sourceLinks.openStaxPresentValue, sourceLinks.investorCompound];
  }

  if (toolSlug === 'commission-calculator') {
    return [sourceLinks.dolCommissions, sourceLinks.irsFica];
  }

  if (toolSlug === 'interest-rate-calculator') {
    return [sourceLinks.cfpbAprVsInterest, sourceLinks.cfpbApr];
  }

  if (['compound-interest-calculator', 'investment-calculator', 'retirement-calculator', 'finance-calculator', 'interest-calculator', 'simple-interest-calculator', 'future-value-calculator'].includes(toolSlug)) {
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

  if (toolSlug === 'cash-back-or-low-interest-calculator') {
    return [sourceLinks.cfpbAutoFinancingOffers, sourceLinks.cfpbApr];
  }

  if (toolSlug === 'business-loan-calculator') {
    return [sourceLinks.sbaLoans, sourceLinks.cfpbAprVsInterest];
  }

  if (toolSlug === 'personal-loan-calculator') {
    return [sourceLinks.cfpbPersonalInstallmentFees, sourceLinks.cfpbAprVsInterest];
  }

  if (toolSlug === 'apr-calculator') {
    return [sourceLinks.cfpbAprVsInterest, sourceLinks.cfpbApr];
  }

  if (['auto-lease-calculator', 'lease-calculator'].includes(toolSlug)) {
    return [sourceLinks.ftcAutoLease, sourceLinks.cfpbApr];
  }

  if (toolSlug === 'boat-loan-calculator') {
    return [sourceLinks.cfpbAprVsInterest, sourceLinks.cfpbAutoFinancingOffers];
  }

  if (toolSlug === 'depreciation-calculator') {
    return [sourceLinks.irsDepreciation, sourceLinks.openStaxDepreciation];
  }

  if (toolSlug === 'average-return-calculator') {
    return [sourceLinks.investorAnnualReturn, sourceLinks.investorCompound];
  }

  if (['margin-calculator', 'discount-calculator', 'percent-off-calculator'].includes(toolSlug)) {
    return [sourceLinks.openStaxDiscounts, sourceLinks.openStaxPercent];
  }

  if (toolSlug === 'ad-revenue-calculator') {
    return [sourceLinks.googleAdSensePageCtr, sourceLinks.googleAdSensePageRpm, sourceLinks.openStaxPercent];
  }

  if (['break-even-calculator', 'profit-goal-calculator'].includes(toolSlug)) {
    return [sourceLinks.sbaBreakEven, sourceLinks.openStaxBreakEven];
  }

  if (toolSlug === 'markup-calculator') {
    return [sourceLinks.openStaxDiscounts, sourceLinks.openStaxPercent];
  }

  if (
    [
      'liquidity-ratios-calculator',
      'debt-ratios-calculator',
      'operations-ratios-calculator',
      'profitability-ratios-calculator',
      'stock-ratios-calculator',
    ].includes(toolSlug)
  ) {
    return [sourceLinks.openStaxFinancialStatementAnalysis, sourceLinks.secFinancialStatements];
  }

  if (toolSlug === 'debt-to-income-ratio-calculator') {
    return [sourceLinks.cfpbDebtToIncome];
  }

  if (toolSlug === 'social-security-calculator') {
    return [sourceLinks.ssaClaimingAge];
  }

  if (toolSlug === 'rmd-calculator') {
    return [sourceLinks.irsRmd];
  }

  if (toolSlug === 'take-home-paycheck-calculator') {
    return [sourceLinks.irsFica, sourceLinks.irsWithholdingEstimatorFaqs];
  }

  if (toolSlug === 'real-estate-calculator') {
    return [sourceLinks.cfpbMortgage, sourceLinks.investorCompound];
  }

  if (toolSlug === 'rental-property-calculator') {
    return [sourceLinks.cfpbMortgage, sourceLinks.consumerBudgetWorksheet];
  }

  if (toolSlug === 'fha-loan-calculator') {
    return [sourceLinks.hudFhaMip, sourceLinks.cfpbMortgage];
  }

  if (toolSlug === 'va-mortgage-calculator') {
    return [sourceLinks.vaFundingFee, sourceLinks.cfpbMortgage];
  }

  if (toolSlug === 'home-equity-loan-calculator') {
    return [sourceLinks.cfpbHomeEquity, sourceLinks.cfpbMortgage];
  }

  if (toolSlug === 'heloc-calculator') {
    return [sourceLinks.cfpbHeloc, sourceLinks.cfpbHomeEquity];
  }

  if (toolSlug === 'down-payment-calculator') {
    return [sourceLinks.cfpbDownPayment, sourceLinks.cfpbMortgage];
  }

  if (toolSlug === 'rent-vs-buy-calculator') {
    return [sourceLinks.cfpbDownPayment, sourceLinks.cfpbMortgage];
  }

  if (toolSlug === 'mortgage-calculator-uk') {
    return [sourceLinks.govUkMortgage, sourceLinks.moneyHelperMortgage];
  }

  if (toolSlug === 'canadian-mortgage-calculator') {
    return [sourceLinks.canadaMortgage, sourceLinks.canadaInterestAct];
  }

  if (toolSlug === 'refinance-calculator') {
    return [sourceLinks.cfpbMortgage, sourceLinks.cfpbAprVsInterest];
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

  if (toolSlug === 'estate-tax-calculator') {
    return [sourceLinks.irs2026, sourceLinks.irsEstateGift];
  }

  if (['income-tax-calculator', 'marriage-tax-calculator'].includes(toolSlug)) {
    return [sourceLinks.irs2026, sourceLinks.irsRevenueProcedure];
  }

  if (toolSlug === 'sales-tax-calculator') {
    return [sourceLinks.irsSalesTax];
  }

  return [];
}

const guideDetails: Record<string, GuideDetail> = {
  'break-even-calculator': {
    summary: 'Learn how to find the point where sales cover costs, using fixed costs, price per unit, and variable cost per unit.',
    purpose:
      'The Break Even Calculator is for simple business planning. It answers: how many units do I need to sell before I stop losing money on this product, event, or service?',
    enter: [
      'Enter fixed costs for the period you are planning, such as booth fees, rent, software, equipment, setup, or design costs.',
      'Enter price per unit as the amount one customer pays for one item, ticket, order, or service package.',
      'Enter variable cost per unit as the cost that happens each time one unit sells, such as materials, packaging, payment fees, or direct labor.',
    ],
    example: [
      'If fixed costs are $5,000, price is $40, and variable cost is $18, each sale leaves $22 after variable cost.',
      'The calculator divides $5,000 by $22, so the break-even point is about 227.27 units, or about $9,090.91 in sales.',
    ],
    read: [
      'Break-even units is the main answer. In real life, you usually round up because you cannot sell part of a physical item.',
      'Break-even sales is the revenue needed at the price you entered.',
      'Contribution margin per unit is the amount each sale contributes toward fixed costs and then profit.',
    ],
    mistakes: [
      'Do not put total costs into variable cost per unit. Variable cost should be for one unit.',
      'Do not forget fees, refunds, discounts, or wasted materials if they happen often.',
      'Do not use this as proof that the business idea is good. It only checks one part of the money math.',
    ],
    next: ['Use Profit Goal Calculator when you want profit above break-even.', 'Use Markup Calculator to test a different selling price.'],
  },
  'markup-calculator': {
    summary: 'Learn how markup turns cost into selling price and why markup percent is not the same as margin percent.',
    purpose:
      'The Markup Calculator is for cost-plus pricing. It starts with what one item costs, adds a markup percent, then shows the selling price and profit.',
    enter: [
      'Enter unit cost as what one item costs before markup.',
      'Enter markup percent as the percent added on top of cost, such as 50 for 50%.',
      'Enter units if you want the page to total revenue, total cost, and total profit for a batch.',
    ],
    example: [
      'If an item costs $30 and you add a 50% markup, the markup amount is $15.',
      'The selling price is $45. The margin is 33.33%, because $15 profit is one-third of the final $45 price.',
    ],
    read: [
      'Selling price per unit is the price produced by the markup.',
      'Profit per unit is selling price minus cost.',
      'Margin from that price helps you compare this result with margin-based pricing.',
    ],
    mistakes: [
      'Do not read markup percent as margin percent. They use different denominators.',
      'Do not ignore platform fees, shipping, returns, or discounts if they reduce profit.',
      'Do not assume a higher markup automatically means the market will pay that price.',
    ],
    next: ['Use Margin Calculator when you already know selling price.', 'Use Break Even Calculator to see how many units need to sell.'],
  },
  'profit-goal-calculator': {
    summary: 'Learn how to estimate the sales needed to cover costs and reach a target profit.',
    purpose:
      'The Profit Goal Calculator is like break-even math with an extra goal added. Instead of stopping at zero profit, it asks how many units are needed to earn the profit you want.',
    enter: [
      'Enter fixed costs for the project, month, event, or product batch.',
      'Enter target profit as the money you want left after costs.',
      'Enter price per unit and variable cost per unit so the calculator can find contribution margin.',
    ],
    example: [
      'If fixed costs are $5,000 and target profit is $2,000, the total amount to cover is $7,000.',
      'With a $40 price and $18 variable cost, each unit contributes $22, so the goal needs about 318.18 units.',
    ],
    read: [
      'Units needed for goal is the main sales target.',
      'Required sales converts those units into revenue at the price you entered.',
      'Contribution per unit shows why lowering cost or raising price changes the target quickly.',
    ],
    mistakes: [
      'Do not forget that demand, capacity, and time can limit sales even if the math target looks possible.',
      'Do not enter the target profit as a percentage. It should be a dollar amount.',
      'Do not use one average unit if your products have very different prices and costs without checking the mix.',
    ],
    next: ['Use Break Even Calculator for the zero-profit threshold.', 'Use Margin Calculator to review the profit percent from a known price.'],
  },
  'liquidity-ratios-calculator': {
    summary: 'Learn how current ratio, quick ratio, cash ratio, and working capital describe short-term payment strength.',
    purpose:
      'The Liquidity Ratios Calculator helps read part of a balance sheet. It checks whether short-term assets look large enough compared with short-term bills.',
    enter: [
      'Enter current assets and current liabilities from the same balance sheet date.',
      'Enter inventory and prepaid expenses so the quick ratio can remove less-liquid current assets.',
      'Enter cash, marketable securities, and receivables so the cash ratio and supporting lines are easier to understand.',
    ],
    example: [
      'If current assets are $120,000 and current liabilities are $80,000, current ratio is 1.5x.',
      'If inventory and prepaid expenses total $30,000, quick assets are $90,000, so quick ratio is 1.125x.',
    ],
    read: [
      'Current ratio compares all current assets with current liabilities.',
      'Quick ratio is stricter because it removes inventory and prepaid expenses.',
      'Cash ratio is the strictest of these because it looks only at cash and marketable securities.',
    ],
    mistakes: [
      'Do not mix numbers from different dates without realizing the ratio can change.',
      'Do not assume receivables are as good as cash if customers pay late.',
      'Do not judge the business from one ratio. Trend and industry context matter.',
    ],
    next: ['Use Debt Ratios Calculator to review leverage.', 'Use Profitability Ratios Calculator to see whether the business is earning enough profit.'],
  },
  'debt-ratios-calculator': {
    summary: 'Learn how debt ratio, debt-to-equity, and times interest earned describe leverage and interest coverage.',
    purpose:
      'The Debt Ratios Calculator looks at how much debt a business uses and whether operating earnings cover interest expense in a simple way.',
    enter: [
      'Enter total debt, total assets, and total equity from the balance sheet.',
      'Enter EBIT from the income statement as earnings before interest and tax.',
      'Enter interest expense for the same period as EBIT.',
    ],
    example: [
      'With $220,000 debt and $500,000 assets, debt ratio is 44%.',
      'With $90,000 EBIT and $15,000 interest expense, times interest earned is 6x.',
    ],
    read: [
      'Debt ratio shows what percent of assets are funded by debt.',
      'Debt-to-equity compares debt with owner equity.',
      'Times interest earned shows how many times EBIT covers interest expense.',
    ],
    mistakes: [
      'Do not compare debt ratios without considering industry and business stability.',
      'Do not forget leases, short-term debt, and maturity dates if you are doing a real analysis.',
      'Do not treat a good interest coverage ratio as a guarantee that cash flow is healthy.',
    ],
    next: ['Use Liquidity Ratios Calculator for short-term payment strength.', 'Use Profitability Ratios Calculator to compare leverage with earnings.'],
  },
  'operations-ratios-calculator': {
    summary: 'Learn how turnover ratios show inventory, assets, and receivables moving through a business.',
    purpose:
      'The Operations Ratios Calculator checks how efficiently a business uses inventory, assets, and credit sales. It is useful when profit is not the only question.',
    enter: [
      'Enter cost of goods sold plus beginning and ending inventory for inventory turnover.',
      'Enter net sales and average total assets for asset turnover.',
      'Enter net credit sales and average receivables for receivables turnover and collection period.',
    ],
    example: [
      'If COGS is $600,000 and average inventory is $100,000, inventory turnover is 6x.',
      'If credit sales are $700,000 and average receivables are $80,000, receivables turnover is 8.75x, or about 41.71 days.',
    ],
    read: [
      'Inventory turnover estimates how many times inventory is sold and replaced.',
      'Asset turnover compares sales with the asset base.',
      'Average collection period estimates how long receivables take to collect.',
    ],
    mistakes: [
      'Do not ignore seasonal timing. A year-end inventory snapshot can look very different before or after a busy season.',
      'Do not compare a retailer, software company, and manufacturer as if their operations should look the same.',
      'Do not use net sales and credit sales interchangeably unless that is truly how the business reports them.',
    ],
    next: ['Use Profitability Ratios Calculator to connect operations with profit.', 'Use Liquidity Ratios Calculator to check short-term balance sheet strength.'],
  },
  'profitability-ratios-calculator': {
    summary: 'Learn how margin, ROA, ROE, EPS, and P/E connect income statement profit with assets, equity, shares, and price.',
    purpose:
      'The Profitability Ratios Calculator groups common profit ratios in one place. It helps you see whether profit is strong at the sales level, asset level, equity level, and per-share level.',
    enter: [
      'Enter net sales, cost of goods sold, operating income, and net income from the income statement.',
      'Enter average assets and average equity from the balance sheet period you are analyzing.',
      'Enter shares outstanding and price per share if you want EPS and P/E context.',
    ],
    example: [
      'With $950,000 sales and $120,000 net income, net margin is 12.63%.',
      'With $120,000 net income and $260,000 average equity, ROE is 46.15%.',
    ],
    read: [
      'Gross margin focuses on sales after product or service cost.',
      'Operating margin includes operating expenses but stops before some other income statement layers.',
      'ROA and ROE compare profit with assets and equity, while EPS and P/E connect profit to shares and price.',
    ],
    mistakes: [
      'Do not compare margins across industries without context.',
      'Do not treat high ROE as automatically good if the company uses heavy debt.',
      'Do not ignore one-time income, unusual costs, or accounting changes.',
    ],
    next: ['Use Stock Ratios Calculator for per-share valuation ratios.', 'Use Debt Ratios Calculator to see whether debt is affecting returns.'],
  },
  'stock-ratios-calculator': {
    summary: 'Learn how P/E, price-to-sales, price-to-book, dividend yield, and payout ratio are calculated from per-share values.',
    purpose:
      'The Stock Ratios Calculator is for learning valuation math. It turns stock price, earnings, sales, book value, and dividend into common ratios people use when researching stocks.',
    enter: [
      'Enter stock price as the share price you want to analyze.',
      'Enter earnings per share, sales per share, and book value per share as positive per-share values.',
      'Enter annual dividend per share if the stock pays one, or 0 if it does not.',
    ],
    example: [
      'If price is $18 and EPS is $1.20, P/E is 15x.',
      'If dividend is $0.45, dividend yield is 2.5% and payout ratio is 37.5% of EPS.',
    ],
    read: [
      'P/E compares price with earnings per share.',
      'Price-to-sales and price-to-book compare price with sales per share and book value per share.',
      'Dividend yield compares dividend with price, while payout ratio compares dividend with earnings.',
    ],
    mistakes: [
      'Do not treat a low P/E as automatically cheap or a high P/E as automatically bad.',
      'Do not use old per-share data if the company has changed a lot.',
      'Do not use this as investment advice. Ratios are starting clues, not a full decision.',
    ],
    next: ['Use Profitability Ratios Calculator to understand the business behind the per-share numbers.', 'Use ROI Calculator for a simple return estimate.'],
  },
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
  'pension-calculator': {
    summary: 'Learn how final average salary, service years, and a benefit multiplier create a simple pension estimate.',
    purpose:
      'The Pension Calculator is for defined-benefit style planning when you know the salary, years of service, and multiplier you want to test. It gives a rough annual and monthly pension estimate, not an official plan statement.',
    enter: [
      'Enter final average salary as a yearly dollar amount.',
      'Enter years of service, including decimals only if your plan counts partial years that way.',
      'Enter the benefit multiplier as a percent, such as 1.5 for 1.5%.',
    ],
    example: [
      '$80,000 final average salary x 25 years x 1.5% gives a $30,000 annual estimate.',
      'Dividing $30,000 by 12 gives a $2,500 monthly estimate before taxes or plan adjustments.',
    ],
    read: [
      'Annual pension is the main estimate from the simple salary-service formula.',
      'Monthly pension divides the annual amount by 12.',
      'Replacement rate shows the annual estimate as a percent of final average salary.',
    ],
    mistakes: [
      'Do not treat this as your official pension benefit.',
      'Do not ignore vesting, survivor choices, early retirement reductions, cost-of-living adjustments, service-credit rules, or taxes.',
      'Do not use a multiplier from another plan unless your own plan document uses the same rule.',
    ],
    next: ['Use Retirement Calculator for broader savings planning.', 'Use Annuity Payout Calculator to compare fixed payout math.'],
  },
  'annuity-payout-calculator': {
    summary: 'Learn how a starting balance, rate, payout time, and payment frequency affect a fixed payout estimate.',
    purpose:
      'The Annuity Payout Calculator spreads a starting balance across a fixed number of payments. It is useful for learning drawdown math, but it is not an insurance-company quote or a guaranteed lifetime income promise.',
    enter: [
      'Enter the starting balance or lump sum you want to spread across payments.',
      'Enter the annual rate as a percent and the payout time in years.',
      'Enter payments per year, such as 12 for monthly payments or 1 for annual payments.',
    ],
    example: [
      '$100,000 at 5% over 20 years with monthly payments means 240 payments.',
      'The calculator uses the rate and payment count to estimate one fixed payment amount.',
    ],
    read: [
      'Payment is the estimated amount for each payout period.',
      'Total paid is payment amount times payment count.',
      'Estimated interest is total paid minus the starting balance.',
    ],
    mistakes: [
      'Do not treat the result as a real annuity quote.',
      'Do not forget fees, taxes, surrender charges, inflation riders, guarantees, or contract rules.',
      'Do not enter annual payments while thinking the result is monthly.',
    ],
    next: ['Use Annuity Calculator for present value and future value of payments.', 'Use Retirement Calculator for a wider retirement scenario.'],
  },
  'credit-cards-payoff-calculator': {
    summary: 'Learn how combined card balance, weighted APR, regular payment, and extra payment affect payoff time.',
    purpose:
      'The Credit Cards Payoff Calculator is for a quick combined-balance payoff estimate. It works best when you already know the total balance, a reasonable weighted APR, and the total monthly payment you can make.',
    enter: [
      'Add your card balances together and enter the combined balance.',
      'Enter a weighted APR if the cards have different rates, or use the rate that best represents the balance you are paying down.',
      'Enter the regular monthly payment and any extra monthly amount you can add.',
    ],
    example: [
      '$8,500 at 21.5% APR with $350 regular payment plus $100 extra is treated as one combined balance.',
      'Each month, interest is added first, then the total payment is subtracted.',
    ],
    read: [
      'Payoff months estimates how long the combined balance may take to reach zero.',
      'Total interest shows the estimated interest cost during payoff.',
      'Final payment may be lower than the regular monthly payment.',
    ],
    mistakes: [
      'Do not use this as a full avalanche or snowball plan.',
      'Do not forget separate APR tiers, balance transfer fees, promotional rates, late fees, and new purchases.',
      'Do not enter a payment that is lower than the monthly interest on the balance.',
    ],
    next: ['Use Credit Card Calculator for a single-card payoff.', 'Use Debt Consolidation Calculator to compare a new loan offer.'],
  },
  'debt-payoff-calculator': {
    summary: 'Learn how a fixed debt balance, interest rate, monthly payment, and extra payment affect payoff time.',
    purpose:
      'The Debt Payoff Calculator estimates how long a fixed-rate balance may take to repay. It is useful for testing whether extra money shortens payoff time and reduces interest.',
    enter: [
      'Enter the debt balance you want to pay down.',
      'Enter the annual interest rate as a percent.',
      'Enter your regular monthly payment and any extra payment you plan to add.',
    ],
    example: [
      '$10,000 at 12% with $300 regular payment plus $100 extra means $400 goes toward the balance each month after interest is added.',
      'If the payment is too small to cover monthly interest, the calculator stops instead of showing a fake payoff date.',
    ],
    read: [
      'Payoff months is the estimated number of months until the balance reaches zero.',
      'Total interest is the estimated interest paid along the way.',
      'Final payment shows the last smaller payment if the balance ends before a full payment is needed.',
    ],
    mistakes: [
      'Do not ignore fees, penalties, settlement terms, collection rules, or creditor agreements.',
      'Do not use this as legal advice if a debt is in collections or court.',
      'Do not forget that variable rates can change the real payoff path.',
    ],
    next: ['Use Repayment Calculator for a general balance estimate.', 'Use Debt Consolidation Calculator before comparing a new loan.'],
  },
  'debt-consolidation-calculator': {
    summary: 'Learn how to compare your current debt payoff path with a new consolidation loan.',
    purpose:
      'The Debt Consolidation Calculator compares two paths: continuing your current payoff and replacing the debt with a new fixed-payment loan. It helps show when a lower monthly payment may still raise total cost.',
    enter: [
      'Enter total current debt, current average rate, and current monthly payment.',
      'Enter the new loan rate, new term, and any fees added to the consolidation loan.',
      'Use realistic offer numbers, because a small fee or longer term can change the answer.',
    ],
    example: [
      '$18,000 of debt at 18% with a $650 current payment is compared with a new 10.5% loan for 3 years plus $300 fees.',
      'The calculator estimates the current payoff, then estimates the new loan payment and total cost.',
    ],
    read: [
      'New payment is the estimated monthly payment on the consolidation loan.',
      'Monthly payment change shows whether the new payment is higher or lower than the current payment.',
      'Total cost change shows whether the new path costs more or less overall.',
    ],
    mistakes: [
      'Do not choose a consolidation option by monthly payment alone.',
      'Do not forget origination fees, balance transfer rules, credit impact, hardship plans, or settlement offers.',
      'Do not assume approval or the advertised rate is guaranteed.',
    ],
    next: ['Use Debt Payoff Calculator to test the current path with extra payments.', 'Use Loan Calculator to inspect the new loan payment by itself.'],
  },
  'repayment-calculator': {
    summary: 'Learn how balance, interest rate, regular payment, and extra payment affect a repayment estimate.',
    purpose:
      'The Repayment Calculator is a general fixed-balance payoff tool. It is useful when you want to know how long a balance may take to repay at a chosen payment amount.',
    enter: [
      'Enter the current balance.',
      'Enter the annual interest rate as a percent.',
      'Enter the regular monthly payment and optional extra monthly payment.',
    ],
    example: [
      '$12,000 at 8% with $300/month plus $50 extra creates a fixed-payment payoff estimate.',
      'The calculator adds interest, subtracts the payment, and repeats until the balance is gone.',
    ],
    read: [
      'Repayment time is the estimated number of months to reach zero.',
      'Total interest helps you compare one payment plan with another.',
      'Final payment may be smaller than your usual payment.',
    ],
    mistakes: [
      'Do not use this for official student loan, hardship, income-based, deferment, or provider-specific plans.',
      'Do not ignore fees, payment pauses, or changing rates.',
      'Do not enter annual payment amounts in monthly payment fields.',
    ],
    next: ['Use Payment Calculator if you know the term and want the payment.', 'Use Debt Payoff Calculator for debt-specific payoff language.'],
  },
  'student-loan-calculator': {
    summary: 'Learn how loan balance, interest rate, term, and extra monthly payment affect a standard student loan estimate.',
    purpose:
      'The Student Loan Calculator estimates a standard fixed-payment repayment path. It is helpful for learning the math, but it is not an official federal repayment plan or servicer result.',
    enter: [
      'Enter the current loan balance.',
      'Enter the annual interest rate and repayment term in years.',
      'Enter extra monthly payment only if you plan to pay more than the scheduled payment.',
    ],
    example: [
      '$30,000 at 6.5% for 10 years creates a scheduled monthly payment first.',
      'Adding $50 extra per month lets the calculator estimate interest saved and faster payoff.',
    ],
    read: [
      'Scheduled payment is the estimated fixed payment before any extra amount.',
      'Monthly paid with extra shows the scheduled payment plus the extra monthly amount.',
      'Interest saved compares the extra-payment path with the standard scheduled path.',
    ],
    mistakes: [
      'Do not treat this as an income-driven repayment, forgiveness, deferment, forbearance, or servicer quote.',
      'Do not ignore capitalization, subsidies, fees, payment pauses, or federal program rules.',
      'Do not assume extra payments are handled the same way by every servicer.',
    ],
    next: ['Use Loan Calculator for a plain fixed loan payment.', 'Use Repayment Calculator for a general balance payoff estimate.'],
  },
  'college-cost-calculator': {
    summary: 'Learn how current annual cost, cost increases, savings, and years until school affect a college cost estimate.',
    purpose:
      'The College Cost Calculator projects a future school cost from today\'s annual cost and a yearly increase assumption. It is a planning number to use before checking each school\'s official net price calculator.',
    enter: [
      'Enter today\'s annual cost for one school year.',
      'Enter years until school starts, years in school, and expected annual cost increase.',
      'Enter current savings, monthly savings, and savings return if you want to compare cost with projected savings.',
    ],
    example: [
      '$28,000 today, starting in 8 years, grows the first school year before adding later school years.',
      'The savings side projects current savings and monthly deposits only until school starts, then compares them with total estimated cost.',
    ],
    read: [
      'Total estimated cost is the projected cost for all school years entered.',
      'First year estimate shows the projected cost of the first school year.',
      'Savings gap or surplus compares projected savings with the estimated total cost.',
    ],
    mistakes: [
      'Do not treat this as a school financial aid offer.',
      'Do not forget scholarships, grants, loans, work-study, housing, travel, books, program fees, residency, or net price calculators.',
      'Do not use one national cost increase assumption for every school without checking the school\'s published costs.',
    ],
    next: ['Use Savings Calculator to adjust monthly savings.', 'Use Student Loan Calculator to inspect a possible loan payment.'],
  },
  'simple-interest-calculator': {
    summary: 'Learn how principal, annual rate, and time create a simple interest result.',
    purpose:
      'The Simple Interest Calculator uses the basic principal x rate x time formula. It is useful for classwork and quick examples where interest does not earn more interest.',
    enter: [
      'Enter principal as the starting dollar amount.',
      'Enter the annual rate as a percent, such as 5 for 5%.',
      'Enter time in years, using 1.5 for 18 months.',
    ],
    example: [
      '$1,000 at 5% for 3 years gives $1,000 x 0.05 x 3 = $150 interest.',
      'The ending balance is principal plus interest, so $1,000 plus $150 equals $1,150.',
    ],
    read: [
      'Simple interest is the amount earned or charged before compounding.',
      'Ending balance is principal plus simple interest.',
      'Time is the number of years used in the multiplication.',
    ],
    mistakes: [
      'Do not use simple interest when the account or loan compounds.',
      'Do not enter 5% as 0.05 in the percent field.',
      'Do not forget fees, taxes, payment schedules, and changing rates.',
    ],
    next: ['Use Compound Interest Calculator when interest earns interest.', 'Use Interest Calculator to compare simple and compound modes.'],
  },
  'cd-calculator': {
    summary: 'Learn how deposit amount, APY, term, and penalty months affect a certificate of deposit estimate.',
    purpose:
      'The CD Calculator estimates maturity value from deposit amount, APY, and term. It also shows a rough early withdrawal penalty scenario using months of interest.',
    enter: [
      'Enter the deposit amount and APY from the CD offer.',
      'Enter the term in whole months.',
      'Enter penalty months only as a simple estimate after reading the bank disclosure.',
    ],
    example: [
      '$10,000 at 4.25% APY for 12 months estimates maturity value and interest earned.',
      'A 3-month penalty estimate subtracts about three months of simple interest from the maturity value.',
    ],
    read: [
      'Maturity value is the estimated value at the end of the term.',
      'Interest earned is maturity value minus the starting deposit.',
      'Value after penalty is only a rough what-if for early withdrawal.',
    ],
    mistakes: [
      'Do not use this instead of the bank\'s CD disclosure.',
      'Do not forget renewal rules, grace periods, exact compounding, brokered CDs, minimum balances, or early withdrawal terms.',
      'Do not assume every CD is FDIC-insured without checking the institution.',
    ],
    next: ['Use Savings Calculator for flexible deposits.', 'Use Compound Interest Calculator for compounding-frequency comparisons.'],
  },
  'bond-calculator': {
    summary: 'Learn how face value, market price, coupon rate, and maturity affect bond income and approximate yield.',
    purpose:
      'The Bond Calculator estimates annual coupon income, current yield, and an approximate yield to maturity. It is a quick teaching tool, not a full bond pricing model.',
    enter: [
      'Enter face value and current market price.',
      'Enter coupon rate as a percent and years to maturity.',
      'Enter coupon payments per year, such as 2 for semiannual coupons.',
    ],
    example: [
      'A $1,000 face value bond at a $950 market price and 5% coupon pays about $50 per year in coupon income.',
      'Because the market price is below face value, the approximate yield to maturity includes coupon income plus the price gain toward face value.',
    ],
    read: [
      'Annual coupon is face value times coupon rate.',
      'Current yield compares annual coupon with market price.',
      'Approximate yield to maturity is only a rough estimate, not a precise bond valuation.',
    ],
    mistakes: [
      'Do not use this for callable, floating-rate, inflation-linked, or complex bonds without deeper pricing.',
      'Do not ignore accrued interest, taxes, reinvestment risk, duration, credit risk, or changing market rates.',
      'Do not treat approximate yield as a guaranteed return.',
    ],
    next: ['Use Investment Calculator for broad growth scenarios.', 'Use Mutual Fund Calculator for fund-style projections.'],
  },
  'mutual-fund-calculator': {
    summary: 'Learn how starting investment, monthly contributions, estimated return, expense ratio, and time affect a mutual fund projection.',
    purpose:
      'The Mutual Fund Calculator projects a hypothetical balance before and after a simple expense-ratio adjustment. It helps explain fee drag, not predict actual fund performance.',
    enter: [
      'Enter initial investment and monthly contribution.',
      'Enter estimated annual return as a percent.',
      'Enter expense ratio as a percent, such as 0.5 for 0.5%.',
    ],
    example: [
      '$5,000 plus $250 per month at 7% for 20 years creates a before-expense projection.',
      'The calculator subtracts the 0.5% expense ratio from the return assumption to create a simple after-expense estimate.',
    ],
    read: [
      'Projected fund balance after expenses is the main estimate.',
      'Balance before expense estimate shows the same projection without the expense-ratio adjustment.',
      'Estimated expense drag is the difference between those two projections.',
    ],
    mistakes: [
      'Do not treat an estimated return as a promise.',
      'Do not forget taxes, loads, trading costs, distributions, changing expenses, or market losses.',
      'Do not compare funds by expense ratio alone without checking risk and investment objective.',
    ],
    next: ['Use Investment Calculator for a simpler growth model.', 'Use Bond Calculator for fixed-income basics.'],
  },
  'roth-ira-calculator': {
    summary: 'Learn how current balance, annual contribution, estimated return, and time affect a Roth IRA projection.',
    purpose:
      'The Roth IRA Calculator projects growth using monthly compounding and monthly contribution timing. It is a retirement savings scenario tool, not an eligibility or tax calculator.',
    enter: [
      'Enter current Roth IRA balance.',
      'Enter annual contribution, knowing the tool does not enforce IRS limits or income phaseouts.',
      'Enter estimated annual return and years to grow.',
    ],
    example: [
      '$12,000 starting balance plus $7,000 per year is converted into monthly deposits for the projection.',
      'At 7% for 25 years, the result separates total contributions from estimated growth.',
    ],
    read: [
      'Projected Roth IRA balance is the estimate at the end of the entered years.',
      'Total contributions shows current balance plus deposits counted in the projection.',
      'Estimated growth is the difference created by the return assumption.',
    ],
    mistakes: [
      'Do not assume you are eligible to contribute just because the calculator accepts the amount.',
      'Do not ignore IRS contribution limits, income phaseouts, withdrawal rules, penalties, taxes, fees, or market risk.',
      'Do not treat Roth IRA tax treatment as the same for every situation.',
    ],
    next: ['Use IRA Calculator for general IRA projection math.', 'Use Retirement Calculator for a wider savings goal.'],
  },
  'ira-calculator': {
    summary: 'Learn how current IRA balance, annual contribution, estimated return, and time affect an IRA projection.',
    purpose:
      'The IRA Calculator projects a future balance from current savings and annual contributions. It keeps the math simple so you can compare scenarios before checking official IRA rules.',
    enter: [
      'Enter current IRA balance.',
      'Enter annual contribution, annual return, and years to grow.',
      'Use a realistic contribution amount because the calculator does not check IRS limits.',
    ],
    example: [
      '$25,000 current balance plus $7,000 per year at 6.5% for 20 years is converted into monthly deposits.',
      'The projection shows total contributions and estimated growth separately.',
    ],
    read: [
      'Projected IRA balance is the future balance estimate.',
      'Total contributions includes the starting balance and projected deposits.',
      'Estimated growth depends completely on the return assumption.',
    ],
    mistakes: [
      'Do not use this as tax advice or an official IRA limit checker.',
      'Do not ignore deductions, Roth eligibility, contribution limits, required minimum distributions, penalties, fees, or investment risk.',
      'Do not compare IRA choices without understanding tax treatment.',
    ],
    next: ['Use Roth IRA Calculator for Roth-specific planning language.', 'Use 401K Calculator for workplace contribution scenarios.'],
  },
  'vat-calculator': {
    summary: 'Learn how to add VAT to a net amount or remove VAT from a gross amount.',
    purpose:
      'The VAT Calculator handles two common tasks: add VAT to a before-tax amount or remove VAT from a tax-included amount. It uses the rate you enter and does not know local tax rules.',
    enter: [
      'Enter the amount as net amount when adding VAT or gross amount when removing VAT.',
      'Enter the VAT rate as a percent.',
      'Choose add or remove before calculating.',
    ],
    example: [
      '$100 net at 20% VAT adds $20 VAT and gives $120 gross.',
      '$120 gross at 20% VAT divides by 1.20 to get $100 net and $20 VAT.',
    ],
    read: [
      'Net amount is the price before VAT.',
      'VAT amount is the tax portion at the entered rate.',
      'Gross amount is net amount plus VAT.',
    ],
    mistakes: [
      'Do not use the wrong mode: add starts from net, remove starts from gross.',
      'Do not assume the entered rate is correct for every country, product, or invoice.',
      'Do not use this for registration, reverse charge, exemption, or tax filing decisions.',
    ],
    next: ['Use Sales Tax Calculator for U.S.-style sales tax math.', 'Use Percentage Calculator to check rate math.'],
  },
  'cash-back-or-low-interest-calculator': {
    summary: 'Learn how to compare a cash-back rebate offer with a low-interest financing offer by estimated total cost.',
    purpose:
      'The Cash Back or Low Interest Calculator compares two incentive paths over the same payoff term. It estimates the total paid with a rebate-style offer and compares it with the total paid under a lower APR offer.',
    enter: [
      'Enter the purchase amount and payoff term in months.',
      'Enter the cash back percent and the APR that goes with the cash-back option.',
      'Enter the low-interest APR from the competing offer.',
    ],
    example: [
      '$32,000 over 60 months with 4% cash back at 7.2% APR is compared with the same amount at 3.9% APR.',
      'The calculator subtracts the rebate value from the cash-back loan total, then chooses the lower estimated total cost.',
    ],
    read: [
      'Estimated better offer is the option with lower estimated total cost.',
      'Cash back value is the rebate amount based on purchase price.',
      'Estimated savings is the difference between the two options.',
    ],
    mistakes: [
      'Do not compare by monthly payment only.',
      'Do not ignore taxes, fees, credit approval, model restrictions, rebate eligibility, expiration dates, or dealer add-ons.',
      'Do not assume an advertised low APR is available to every buyer.',
    ],
    next: ['Use Auto Loan Calculator for the full vehicle loan estimate.', 'Use Interest Rate Calculator when you know payment but not rate.'],
  },
  'auto-lease-calculator': {
    summary: 'Learn how vehicle price, residual value, money factor, taxes, fees, and term shape an auto lease payment.',
    purpose:
      'The Auto Lease Calculator estimates a monthly lease payment by separating the depreciation part, the finance part, and the tax part. It helps you understand a lease quote before reading the contract.',
    enter: [
      'Enter vehicle price, fees, down payment, trade-in value, residual value, money factor, term, and tax rate.',
      'Use residual value as a dollar amount, not a percent, because the calculator compares it directly with adjusted capitalized cost.',
      'Enter the money factor exactly as shown in the quote, such as 0.0025, instead of converting it to APR first.',
    ],
    example: [
      '$36,000 vehicle price, $21,000 residual value, and a 36-month term creates the depreciation portion first.',
      'The finance fee uses adjusted capitalized cost plus residual value times the money factor, then tax is added to the pretax payment.',
    ],
    read: [
      'Monthly payment is the estimated lease payment before contract-specific add-ons.',
      'Depreciation fee shows the part caused by the vehicle losing value during the lease.',
      'Finance fee is the rent-charge style part based on the money factor.',
    ],
    mistakes: [
      'Do not compare leases by monthly payment alone.',
      'Do not forget mileage limits, acquisition fees, disposition fees, wear charges, registration, insurance, and early termination rules.',
      'Do not enter residual percent when the field asks for residual dollars.',
    ],
    next: ['Use Auto Loan Calculator if buying might be better.', 'Use Cash Back or Low Interest Calculator for dealer incentive comparisons.'],
  },
  'depreciation-calculator': {
    summary: 'Learn how cost, salvage value, useful life, age, and method affect depreciation and book value.',
    purpose:
      'The Depreciation Calculator estimates book value using straight-line or declining-balance math. It is useful for learning the idea, not for filing taxes or setting accounting policy.',
    enter: [
      'Enter original cost and estimated salvage value as dollar amounts.',
      'Enter useful life and asset age in years.',
      'Choose straight-line for even depreciation or declining balance for faster early depreciation.',
    ],
    example: [
      '$12,000 cost minus $2,000 salvage gives $10,000 of depreciable amount.',
      'With a 5-year straight-line life, the calculator estimates $2,000 of depreciation per year until salvage value is reached.',
    ],
    read: [
      'Book value is cost minus accumulated depreciation.',
      'Accumulated depreciation is the total depreciation counted so far.',
      'Annual depreciation estimate shows the current simple yearly amount for the selected method.',
    ],
    mistakes: [
      'Do not use this as tax depreciation advice.',
      'Do not ignore MACRS class life, partial-year conventions, bonus depreciation, recapture, or accounting policy.',
      'Do not set salvage value equal to or above cost.',
    ],
    next: ['Use Business Loan Calculator if the asset was financed.', 'Use Average Return Calculator to compare investment-style performance.'],
  },
  'average-return-calculator': {
    summary: 'Learn how beginning value, ending value, time, contributions, and withdrawals affect simple average return.',
    purpose:
      'The Average Return Calculator estimates net gain, cumulative return, simple average annual return, and a basic CAGR comparison. It is a quick performance check, not a professional performance report.',
    enter: [
      'Enter beginning value, ending value, and number of years.',
      'Add contributions and withdrawals if you want the simple gain estimate to account for money you added or removed.',
      'Use years as the full measurement period, such as 5 for five years.',
    ],
    example: [
      '$10,000 to $16,000 over 5 years with $2,000 added gives a net gain after adjusting for the added money.',
      'The calculator divides adjusted net gain by beginning value plus contributions for cumulative return, then divides by years for simple average annual return.',
    ],
    read: [
      'Average annual return is the simple yearly average of the cumulative return.',
      'CAGR estimate shows a growth-rate comparison from beginning value to ending value only.',
      'Net gain adjusts for contributions and withdrawals so the result is not just ending value minus beginning value.',
    ],
    mistakes: [
      'Do not treat this as a time-weighted return or internal rate of return.',
      'Do not ignore taxes, fees, dividends, deposits timing, withdrawals timing, and risk.',
      'Do not compare two investments unless the measurement periods and cash flows are similar.',
    ],
    next: ['Use IRR Calculator for uneven cash flows.', 'Use ROI Calculator for a simpler gain-versus-cost check.'],
  },
  'ad-revenue-calculator': {
    summary: 'Learn how page views, page CTR, and average CPC turn into a rough ad revenue estimate.',
    purpose:
      'The Ad Revenue Calculator is for simple website planning. It helps you see how traffic, click rate, and average click value can combine into daily, monthly, yearly, and page RPM estimates.',
    enter: [
      'Enter daily page views as the number of page loads you want to estimate for one day.',
      'Enter page CTR as a normal percent, such as 1.5 for 1.5%, not 0.015.',
      'Enter average CPC as a dollar amount per click, such as 0.35 for thirty-five cents.',
    ],
    example: [
      '1,000 daily page views with 1.5% page CTR creates about 15 estimated clicks per day.',
      'At $0.35 average CPC, those clicks estimate $5.25 per day, about $159.80 per average month, and a $5.25 page RPM.',
    ],
    read: [
      'Monthly revenue is the headline estimate because many site owners plan traffic and costs monthly.',
      'Daily revenue shows the raw one-day estimate before scaling up.',
      'Page RPM converts the estimate into revenue per 1,000 page views, which is easier to compare across pages with different traffic.',
    ],
    mistakes: [
      'Do not treat this as guaranteed AdSense income or an official Google report.',
      'Do not forget invalid traffic, ad blocking, country mix, niche, seasonality, ad placement, policy status, and advertiser demand.',
      'Do not enter 1.5% CTR as 0.015 unless a field specifically asks for decimal form. This field wants 1.5.',
    ],
    next: ['Use Margin Calculator if you want to compare ad revenue with site costs.', 'Use UTM Builder when you are planning traffic campaigns.'],
  },
  'margin-calculator': {
    summary: 'Learn how revenue and cost turn into profit, profit margin, and markup.',
    purpose:
      'The Margin Calculator is for business pricing math. It shows profit, margin, and markup side by side so users do not mix up the two percentages.',
    enter: [
      'Enter revenue or selling price as the amount collected from the customer.',
      'Enter cost as the direct cost you want to compare against the revenue.',
      'Use the same time period or product unit for both numbers.',
    ],
    example: [
      '$100 revenue minus $60 cost gives $40 profit.',
      '$40 profit divided by $100 revenue is 40% margin, while $40 divided by $60 cost is 66.67% markup.',
    ],
    read: [
      'Profit is revenue minus cost.',
      'Margin shows profit as a percent of revenue.',
      'Markup shows profit as a percent of cost, so it is usually higher than margin for the same sale.',
    ],
    mistakes: [
      'Do not use margin and markup as if they mean the same thing.',
      'Do not forget overhead, labor, shipping, refunds, taxes, and marketplace fees if they matter to the real business result.',
      'Do not use this for brokerage margin or borrowed-investing risk.',
    ],
    next: ['Use Discount Calculator to see how a sale affects price.', 'Use Percentage Calculator for a basic percent check.'],
  },
  'discount-calculator': {
    summary: 'Learn how one discount, an extra discount, and tax affect the final checkout price.',
    purpose:
      'The Discount Calculator estimates a sale price after a percent discount, an optional second discount, and optional tax. It helps show why stacked discounts are not simply added together.',
    enter: [
      'Enter the original price before discounts.',
      'Enter the first discount percent and optional extra discount percent.',
      'Enter tax rate only if you want to estimate tax on the discounted subtotal.',
    ],
    example: [
      '$100 with 20% off becomes $80 after the first discount.',
      'A second 10% discount applies to $80, not the original $100, so the pretax subtotal becomes $72 before tax.',
    ],
    read: [
      'Final price is the estimated amount after discounts and tax.',
      'Total savings before tax shows how much the discounts removed from the original price.',
      'Effective discount shows the combined discount as one percentage of the original price.',
    ],
    mistakes: [
      'Do not add stacked discounts together unless the store says it works that way.',
      'Do not forget shipping, coupon exclusions, minimum purchase rules, tax exemptions, and local tax rules.',
      'Do not enter 20% as 0.20 in a percent field.',
    ],
    next: ['Use Sales Tax Calculator for tax-only checks.', 'Use VAT Calculator for tax-included price math.'],
  },
  'business-loan-calculator': {
    summary: 'Learn how loan amount, rate, term, and origination fee affect a business loan payment and cash received.',
    purpose:
      'The Business Loan Calculator estimates a fixed monthly payment and adds simple origination-fee context. It is a planning tool for comparing offers, not an approval or SBA eligibility check.',
    enter: [
      'Enter the loan amount, annual rate, and repayment term.',
      'Enter origination fee percent if the lender takes a fee from the proceeds or charges it upfront.',
      'Use the quoted APR and fee details carefully because business loans can structure costs differently.',
    ],
    example: [
      '$50,000 at 9.5% for 5 years estimates a fixed monthly payment first.',
      'A 2% origination fee equals $1,000, so cash received after fee is shown separately from the repayment amount.',
    ],
    read: [
      'Monthly payment is based on the full principal.',
      'Cash received after fee shows how much money may be left if the fee is taken upfront.',
      'Total cost with fee adds the origination fee to the payment total for a fuller comparison.',
    ],
    mistakes: [
      'Do not treat this as a lender offer or approval.',
      'Do not ignore collateral, underwriting, SBA rules, draw schedules, variable rates, late fees, and prepayment terms.',
      'Do not compare offers by interest rate alone when fees are different.',
    ],
    next: ['Use Loan Calculator for a plain fixed-payment estimate.', 'Use Debt-to-Income Ratio Calculator to check payment pressure.'],
  },
  'debt-to-income-ratio-calculator': {
    summary: 'Learn how gross monthly income, existing debts, and a proposed housing payment create a DTI estimate.',
    purpose:
      'The Debt-to-Income Ratio Calculator adds monthly debt payments and divides them by gross monthly income. It gives a planning ratio that can help before a loan or mortgage conversation.',
    enter: [
      'Enter gross monthly income before taxes and deductions.',
      'Enter existing monthly debt payments, such as loans, credit cards, or other recurring debt payments.',
      'Add a proposed housing payment if you want to see how a new rent or mortgage payment changes the ratio.',
    ],
    example: [
      '$900 of existing monthly debt plus a $1,500 proposed housing payment gives $2,400 total monthly debt.',
      '$2,400 divided by $6,000 gross monthly income equals 40% DTI.',
    ],
    read: [
      'Debt-to-income ratio is the main percentage result.',
      'Total monthly debt shows the numerator used in the ratio.',
      'Income after listed debts is a simple leftover-income check, not a full budget.',
    ],
    mistakes: [
      'Do not use take-home pay if the field asks for gross income.',
      'Do not assume every lender counts debts, housing costs, and income the same way.',
      'Do not forget taxes, insurance, HOA dues, childcare, utilities, food, and other budget items outside the ratio.',
    ],
    next: ['Use House Affordability Calculator for home-buying context.', 'Use Mortgage Calculator to estimate a possible housing payment.'],
  },
  'personal-loan-calculator': {
    summary: 'Learn how a personal loan amount, APR, term, and origination fee affect payment and total cost.',
    purpose:
      'The Personal Loan Calculator estimates a fixed monthly payment and shows how an origination fee can reduce cash received. It is for comparing offers before reading the lender disclosure.',
    enter: [
      'Enter the loan amount, annual rate, and repayment term.',
      'Enter an origination fee percent if the lender charges one.',
      'Use the lender disclosure to decide whether the rate field should use APR or stated interest rate for your comparison.',
    ],
    example: [
      '$12,000 at 10.5% for 4 years estimates the monthly payment from the full principal.',
      'A 2% origination fee is $240, so the cash received after fee is $11,760 if the fee is taken from proceeds.',
    ],
    read: [
      'Monthly payment is the estimated fixed payment.',
      'Total interest is payment total minus principal.',
      'Cash received after fee helps explain why a loan can feel smaller than the principal you repay.',
    ],
    mistakes: [
      'Do not ignore origination fees, late fees, credit insurance, prepayment rules, and variable-rate terms.',
      'Do not assume an advertised rate applies to your credit profile.',
      'Do not use this as a debt plan without checking the full loan disclosure.',
    ],
    next: ['Use Debt Payoff Calculator to compare keeping the current debt.', 'Use Interest Rate Calculator if you know payment but not rate.'],
  },
  'boat-loan-calculator': {
    summary: 'Learn how boat price, down payment, trade-in, tax, fees, rate, and term affect a boat loan payment.',
    purpose:
      'The Boat Loan Calculator uses purchase-price financing math similar to an auto loan. It estimates amount financed, monthly payment, sales tax, total paid, and interest.',
    enter: [
      'Enter boat price, down payment, trade-in value, fees, sales tax rate, loan rate, and term.',
      'Use the tax and fee numbers from your location or seller when possible.',
      'Use a realistic term because long terms can lower payment but raise interest.',
    ],
    example: [
      '$45,000 with $9,000 down is financed after tax, fees, and any trade-in adjustment.',
      'The calculator then uses the fixed-payment loan formula to estimate monthly payment and total interest.',
    ],
    read: [
      'Amount financed is the balance used in the payment formula.',
      'Sales tax is estimated from the price and entered tax rate.',
      'Total interest shows the borrowing cost before storage, insurance, fuel, or maintenance.',
    ],
    mistakes: [
      'Do not forget registration, marina fees, storage, maintenance, inspections, insurance, winterization, fuel, and trailer costs.',
      'Do not compare only monthly payment when terms are different.',
      'Do not assume boat trade-in tax treatment is the same everywhere.',
    ],
    next: ['Use Loan Calculator for a plain loan estimate.', 'Use Personal Loan Calculator for non-collateral borrowing comparisons.'],
  },
  'lease-calculator': {
    summary: 'Learn how asset value, residual value, finance rate, term, upfront payment, and fees affect a lease estimate.',
    purpose:
      'The Lease Calculator is a generic asset lease estimator. It separates depreciation and finance portions so a lease quote is easier to inspect before reading the actual contract.',
    enter: [
      'Enter asset value, residual value, finance rate, lease term, upfront payment, and fees.',
      'Use residual value as the expected value at the end of the lease.',
      'Enter term in whole months because the lease payment is monthly.',
    ],
    example: [
      '$30,000 asset value and $14,000 residual value over 36 months creates a depreciation portion first.',
      'The calculator adds fees, subtracts upfront payment, estimates finance charge, then returns the monthly payment.',
    ],
    read: [
      'Monthly payment is depreciation fee plus finance fee.',
      'Adjusted cost is asset value plus fees minus upfront payment.',
      'Estimated total lease cost includes upfront payment plus monthly payments over the term.',
    ],
    mistakes: [
      'Do not treat this as a contract review.',
      'Do not forget taxes, maintenance duties, insurance, renewal terms, buyout rights, use limits, and early-exit costs.',
      'Do not set residual value higher than the adjusted cost.',
    ],
    next: ['Use Auto Lease Calculator for vehicle-specific money-factor math.', 'Use Business Loan Calculator if buying the asset is an option.'],
  },
  'refinance-calculator': {
    summary: 'Learn how a refinance changes payment, loan balance, closing costs, break-even time, and long-term cost.',
    purpose:
      'The Refinance Calculator compares the loan you have now with a new loan. It is best for seeing whether a lower payment is really from a lower rate or just from stretching the debt over more years.',
    enter: [
      'Enter the current balance, current rate, and remaining years on the loan you already have.',
      'Enter the new rate, new term, and closing costs from the refinance idea you want to test.',
      'Use closing costs as dollars. In this calculator those costs are added to the new principal, so the new loan balance starts higher.',
    ],
    example: [
      '$280,000 at 7% for the remaining term is compared with a new loan at 5.9% plus $4,500 in costs.',
      'The calculator estimates both payments, subtracts the new payment from the current payment, then divides closing costs by monthly savings when savings are positive.',
    ],
    read: [
      'Monthly savings is useful, but it is not the whole story.',
      'Break-even months shows about how long the payment savings may take to cover closing costs.',
      'Total cost change helps catch the sneaky part: a longer new term can lower the monthly payment but raise total cost over time.',
    ],
    mistakes: [
      'Do not ignore closing costs, escrow changes, points, prepaids, lender fees, title fees, appraisal fees, and prepayment penalties.',
      'Do not call a refinance better just because the monthly payment drops.',
      'Do not use this as a loan disclosure. Use the lender Loan Estimate for real terms.',
    ],
    next: ['Use Mortgage Payoff Calculator if you want to compare extra payments instead.', 'Use APR Calculator if fees make two rate offers hard to compare.'],
  },
  'budget-calculator': {
    summary: 'Learn how income, monthly spending, savings, and debt payments turn into leftover money and budget ratios.',
    purpose:
      'The Budget Calculator is a monthly money map. It adds the categories you enter and shows whether the plan has money left over or is already overspending.',
    enter: [
      'Enter monthly take-home or spendable income, then enter each monthly category.',
      'Put debt payments in the debt field and planned savings in the savings field so they are visible instead of hidden inside other spending.',
      'Use average monthly amounts for bills that change, such as utilities or groceries.',
    ],
    example: [
      '$5,200 monthly income with housing, utilities, food, transport, debt, savings, and other spending creates a total expense number.',
      'If total expenses are $4,850, the leftover is $350 and the category percentages show where the money is going.',
    ],
    read: [
      'Leftover money is income minus everything you entered.',
      'Expense ratio shows how much of income is already assigned to spending and savings.',
      'Savings rate shows planned savings as a percent of income, which is easier to compare than dollars alone.',
    ],
    mistakes: [
      'Do not mix yearly bills with monthly fields without dividing by 12 first.',
      'Do not forget irregular costs like car repairs, school fees, holidays, subscriptions, and medical copays.',
      'Do not treat the biggest category as automatically bad. Housing or childcare can be high because real life is expensive.',
    ],
    next: ['Use Debt-to-Income Ratio Calculator for loan-style debt pressure.', 'Use Savings Calculator to see what a monthly savings amount could become.'],
  },
  'marriage-tax-calculator': {
    summary: 'Learn how two single federal tax estimates compare with a married filing jointly estimate.',
    purpose:
      'The Marriage Tax Calculator is a simplified federal tax comparison. It answers one narrow question: with the incomes and deductions entered, does the joint estimate look higher or lower than two single estimates?',
    enter: [
      'Enter each person\'s income separately.',
      'Use deduction fields only if you want to override the default 2026 standard deduction style assumptions.',
      'Enter joint credits if you want to reduce the married filing jointly estimate in the comparison.',
    ],
    example: [
      '$90,000 and $70,000 are first estimated as two single filers.',
      'Then the calculator combines the income as married filing jointly and subtracts the two-single total from the joint total.',
    ],
    read: [
      'A negative marriage difference means the joint estimate is lower than the two-single estimate.',
      'A positive marriage difference means the joint estimate is higher in this simplified model.',
      'The marginal bracket lines are clues, not a full tax return.',
    ],
    mistakes: [
      'Do not use this for filing advice or wedding decisions.',
      'Do not forget state tax, payroll tax, credits, dependents, AMT, itemized deductions, student loans, benefits, and phaseouts.',
      'Do not assume a marriage bonus or penalty stays the same when income changes.',
    ],
    next: ['Use Income Tax Calculator for one filing-status estimate.', 'Use Take-Home-Paycheck Calculator to estimate paycheck impact separately.'],
  },
  'estate-tax-calculator': {
    summary: 'Learn how gross estate, deductions, lifetime taxable gifts, and the 2026 exclusion affect a rough federal estate tax estimate.',
    purpose:
      'The Estate Tax Calculator is a high-level screen for very large estates. It shows whether the entered estate might sit above the 2026 federal basic exclusion, but it is not legal or tax planning.',
    enter: [
      'Enter gross estate before deductions.',
      'Enter debts and expenses, charitable bequests, and spouse transfers if they apply.',
      'Enter prior lifetime taxable gifts because they reduce the remaining exclusion in this simplified model.',
    ],
    example: [
      'An $18,000,000 estate with $500,000 of deductions starts with $17,500,000 before exclusion.',
      'The calculator subtracts the remaining 2026 exclusion and applies a simplified 40% estimate only to the amount above that exclusion.',
    ],
    read: [
      'Taxable estate before exclusion is the estate after the deductions you entered.',
      'Remaining exclusion shows how much of the 2026 basic exclusion is still available after prior taxable gifts.',
      'Estimated federal estate tax is simplified. Real estate tax work is much more detailed.',
    ],
    mistakes: [
      'Do not use this for trusts, portability, generation-skipping tax, state estate tax, valuation discounts, or Form 706 decisions.',
      'Do not forget that asset values, debts, deductions, and elections can change the result.',
      'Do not treat the 40% estimate as the full IRS rate schedule for every case.',
    ],
    next: ['Use Future Value Calculator to test how estate value might grow.', 'Talk to an estate attorney or tax professional for real planning.'],
  },
  'social-security-calculator': {
    summary: 'Learn how claiming before or after full retirement age can change a Social Security retirement benefit estimate.',
    purpose:
      'The Social Security Calculator uses your full-retirement-age benefit as the starting point and estimates how claiming age changes it. It is a planning screen before using official SSA records.',
    enter: [
      'Enter birth year so the calculator can estimate full retirement age.',
      'Enter the monthly benefit you expect at full retirement age, usually from an official SSA estimate.',
      'Enter a claiming age from 62 through 70.',
    ],
    example: [
      'A person born in 1962 with a $2,400 full-retirement-age benefit is tested at age 67, 62, or 70.',
      'The calculator applies early reduction before full retirement age or delayed credits after full retirement age, then shows monthly and annual estimates.',
    ],
    read: [
      'Monthly benefit is the adjusted estimate at the claiming age you entered.',
      'Adjustment percent shows how far the estimate moved from the full-retirement-age benefit.',
      'Annual benefit is monthly benefit times 12, not a lifetime break-even analysis.',
    ],
    mistakes: [
      'Do not use this instead of your official SSA account.',
      'Do not forget earnings history, spousal benefits, survivor benefits, disability benefits, taxes, COLA changes, Medicare premiums, and work rules.',
      'Do not compare only the monthly amount without thinking about health, job plans, savings, and household needs.',
    ],
    next: ['Use Retirement Calculator for savings planning.', 'Use RMD Calculator if retirement account withdrawals are part of the plan.'],
  },
  'rmd-calculator': {
    summary: 'Learn how prior year-end balance and IRS life expectancy factor create a required minimum distribution estimate.',
    purpose:
      'The RMD Calculator estimates a traditional retirement account withdrawal using the IRS Uniform Lifetime Table. It is a quick check, not a custodian statement.',
    enter: [
      'Enter the account balance from the previous December 31.',
      'Enter your age for the distribution year.',
      'Use this only for the simple owner-style Uniform Lifetime Table case shown on the page.',
    ],
    example: [
      '$500,000 at age 75 uses the age 75 table factor.',
      'The calculator divides the prior year-end balance by that factor and shows the estimated required distribution.',
    ],
    read: [
      'Required distribution is the estimated minimum amount for the year.',
      'Life expectancy factor is the denominator used in the IRS table.',
      'Remaining balance after RMD is just balance minus the estimate. It does not include market movement or taxes.',
    ],
    mistakes: [
      'Do not use this for inherited IRA rules, spouse-more-than-10-years-younger rules, Roth IRA owner rules, or beneficiary cases.',
      'Do not use a current balance when the rule calls for the prior December 31 balance.',
      'Do not assume extra withdrawals this year reduce next year\'s RMD.',
    ],
    next: ['Use IRA Calculator for contribution-style planning.', 'Use Retirement Calculator for a wider retirement savings estimate.'],
  },
  'real-estate-calculator': {
    summary: 'Learn how purchase price, sale price, cash invested, selling costs, and loan payoff affect property profit and ROI.',
    purpose:
      'The Real Estate Calculator is for a sale scenario. It compares money put into a property with estimated net sale proceeds so profit, ROI, and equity multiple are easier to read.',
    enter: [
      'Enter purchase price, down payment, buying costs, and improvements to build cash invested.',
      'Enter selling price, selling costs, and loan payoff to estimate net sale proceeds.',
      'If loan payoff is blank, use a careful estimate because it strongly changes the result.',
    ],
    example: [
      '$350,000 purchase, $70,000 down, $20,000 improvements, $430,000 sale price, costs, and payoff are put into one sale picture.',
      'The calculator subtracts selling costs and payoff from sale price, then compares the remainder with cash invested.',
    ],
    read: [
      'Net sale proceeds is what is left after selling costs and payoff in this simplified model.',
      'Profit is net sale proceeds minus cash invested.',
      'ROI percent compares profit with cash invested, while equity multiple compares proceeds with cash invested.',
    ],
    mistakes: [
      'Do not use this as a tax-basis or capital-gains calculator.',
      'Do not forget depreciation, depreciation recapture, transfer taxes, agent commissions, legal costs, refinancing, rent history, and repairs.',
      'Do not compare two properties unless cash invested is measured the same way.',
    ],
    next: ['Use Rental Property Calculator for monthly cash-flow screening.', 'Use ROI Calculator for a simpler investment return check.'],
  },
  'take-home-paycheck-calculator': {
    summary: 'Learn how salary, pay frequency, pretax deductions, estimated taxes, and FICA affect net pay per paycheck.',
    purpose:
      'The Take-Home-Paycheck Calculator turns an annual salary into a rough paycheck estimate. It separates gross pay, pretax deductions, entered tax estimates, Social Security, Medicare, and net pay.',
    enter: [
      'Enter annual gross pay before deductions.',
      'Choose pay periods per year, such as 26 for biweekly or 12 for monthly.',
      'Enter pretax deductions per paycheck and tax percentages as estimates, not decimals.',
    ],
    example: [
      '$78,000 salary over 26 paychecks gives $3,000 gross per paycheck before deductions.',
      'The calculator annualizes pretax deductions, applies the entered tax percentages, estimates employee FICA, then divides annual take-home pay by pay periods.',
    ],
    read: [
      'Gross per paycheck is salary divided by pay periods.',
      'Take-home per paycheck is the rough net amount after the deductions and taxes in the model.',
      'FICA is shown separately so Social Security and Medicare are not hidden inside the tax percentage fields.',
    ],
    mistakes: [
      'Do not enter a dollar withholding amount in a percent field.',
      'Do not assume this matches payroll exactly. Real payroll can use W-4 details, state rules, benefit plans, bonuses, garnishments, and employer timing.',
      'Do not include Social Security or Medicare inside the federal tax percent if you want to avoid double counting.',
    ],
    next: ['Use Salary Calculator for annual-to-hourly comparisons.', 'Use Income Tax Calculator for a broader federal tax estimate.'],
  },
  'rental-property-calculator': {
    summary: 'Learn how rent, vacancy, operating costs, mortgage payment, NOI, cap rate, and cash-on-cash return fit together.',
    purpose:
      'The Rental Property Calculator screens a rental deal. It separates the property performance before financing from the cash flow after the mortgage payment.',
    enter: [
      'Enter property price, down payment, loan rate, loan term, and monthly rent.',
      'Enter vacancy percent, operating expenses, property tax, insurance, maintenance reserve, and closing costs.',
      'Use realistic monthly expense numbers. A rental can look good only because repairs or vacancy were left out.',
    ],
    example: [
      '$300,000 property with $2,400 rent, vacancy reserve, expenses, taxes, insurance, maintenance, and a mortgage creates monthly NOI first.',
      'The calculator subtracts mortgage payment from NOI for cash flow, then calculates cap rate and cash-on-cash return.',
    ],
    read: [
      'NOI means net operating income before loan payment.',
      'Cap rate compares annual NOI with property price before financing.',
      'Cash-on-cash return compares annual cash flow after mortgage payment with cash invested.',
    ],
    mistakes: [
      'Do not forget repairs, vacancy, property management, HOA, utilities, legal costs, local rules, rent control, and tenant risk.',
      'Do not treat cap rate and cash-on-cash return as the same thing.',
      'Do not use this as tax advice because depreciation and tax treatment are not included.',
    ],
    next: ['Use Real Estate Calculator for a sale-profit estimate.', 'Use Mortgage Calculator to inspect the loan payment separately.'],
  },
  'irr-calculator': {
    summary: 'Learn how cash flows are used to solve the rate that makes net present value close to zero.',
    purpose:
      'The IRR Calculator is for uneven cash flows. It estimates the periodic and annualized return rate that balances an initial outflow against later inflows.',
    enter: [
      'Enter the first cash flow as the initial investment or outflow. The tool treats it as negative in the project-style setup.',
      'Enter later cash flows in order by period.',
      'Set periods per year carefully. Use 1 for annual cash flows, 12 for monthly cash flows, or another value that matches the spacing.',
    ],
    example: [
      '$10,000 outflow followed by five annual inflows is solved by searching for the rate where NPV is about zero.',
      'If the cash-flow periods are monthly, the periodic IRR is converted into an annualized estimate using the periods-per-year setting.',
    ],
    read: [
      'Periodic IRR is the solved rate for one cash-flow period.',
      'Annualized IRR converts that rate to a yearly-style estimate.',
      'Net cash flow is simple dollars in minus dollars out. It is not time-adjusted like IRR.',
    ],
    mistakes: [
      'Do not use IRR alone when project sizes are very different.',
      'Do not trust a simple IRR when cash flows switch signs more than once, because there can be more than one IRR.',
      'Do not forget taxes, fees, inflation, risk, and reinvestment assumptions.',
    ],
    next: ['Use ROI Calculator for a simpler gain-versus-cost number.', 'Use Payback Period Calculator to see how long recovery takes.'],
  },
  'roi-calculator': {
    summary: 'Learn how simple ROI compares gain or loss with the original investment.',
    purpose:
      'The ROI Calculator is for a quick gain-versus-cost check. It is simple on purpose, so it is useful for one snapshot but not enough for full investment analysis.',
    enter: [
      'Enter the initial investment as the money or cost you are measuring against.',
      'Enter ending value, extra income, and costs separately so the gain is not guessed.',
      'Use the same currency and the same project boundary for every field.',
    ],
    example: [
      '$10,000 initial investment, $12,500 ending value, $300 income, and $100 costs gives a gain of $2,700.',
      'The calculator divides that gain by the $10,000 initial investment to estimate ROI.',
    ],
    read: [
      'ROI percent shows gain or loss compared with the starting investment.',
      'Gain or loss is the dollar result after ending value plus income minus costs and initial investment.',
      'A positive ROI does not tell you whether the return was fast, slow, risky, or better than another option.',
    ],
    mistakes: [
      'Do not compare ROI across projects with very different time lengths without another metric.',
      'Do not forget fees, taxes, financing cost, repairs, subscriptions, or labor if they belong in the project.',
      'Do not use ROI as if it were IRR, annual return, or profit margin.',
    ],
    next: ['Use IRR Calculator for uneven cash flows over time.', 'Use Payback Period Calculator to see how long cost recovery takes.'],
  },
  'apr-calculator': {
    summary: 'Learn how loan fees can make APR higher than the note interest rate.',
    purpose:
      'The APR Calculator estimates a rough annual percentage rate from the payment stream and the amount actually received after fees. It is a comparison tool, not an official disclosure.',
    enter: [
      'Enter the loan amount, note rate, term, and finance charges or fees.',
      'Use fees that reduce what you effectively receive or raise the borrowing cost.',
      'Keep the note rate separate from APR. The tool solves the APR-style rate after estimating the scheduled payment.',
    ],
    example: [
      '$20,000 at an 8% note rate with $600 in fees produces a payment from the full $20,000 loan.',
      'Then the calculator treats the borrower as receiving $19,400 and solves the rate implied by making that same payment.',
    ],
    read: [
      'Estimated APR is the main comparison number.',
      'Amount received shows why fees can raise APR even when the note rate stays the same.',
      'Monthly payment comes from the note rate and full principal in this simplified model.',
    ],
    mistakes: [
      'Do not treat this as a Truth in Lending disclosure.',
      'Do not enter fees that are not finance charges unless that is the comparison you intentionally want.',
      'Do not compare two loans by note rate alone when one has higher fees.',
    ],
    next: ['Use Loan Calculator for the basic payment.', 'Use Personal Loan Calculator if origination fees reduce cash received.'],
  },
  'fha-loan-calculator': {
    summary: 'Learn how FHA upfront MIP and annual MIP assumptions affect a monthly mortgage estimate.',
    purpose:
      'The FHA Loan Calculator is for FHA-style payment planning. It adds mortgage insurance assumptions to the usual principal, interest, tax, and insurance estimate.',
    enter: [
      'Enter home price, down payment, rate, loan term, annual property tax, and monthly insurance.',
      'Enter upfront MIP percent and annual MIP percent from the scenario you want to test.',
      'Use 3.5% down only as a common example, not as an eligibility answer.',
    ],
    example: [
      '$325,000 with 3.5% down creates a base loan first.',
      'The calculator estimates upfront MIP from the base loan, adds it to the financed balance, then adds monthly MIP to the payment.',
    ],
    read: [
      'Total monthly payment includes principal, interest, tax, insurance, and monthly MIP.',
      'Upfront MIP is shown as a separate dollar amount so it is not hidden inside the loan.',
      'Loan-to-value helps explain how much of the purchase price is financed before program-specific rules.',
    ],
    mistakes: [
      'Do not use this to decide FHA eligibility or loan limits.',
      'Do not ignore MIP duration, property rules, lender overlays, closing costs, escrow, or official FHA updates.',
      'Do not assume the entered MIP rates are current for every FHA loan type.',
    ],
    next: ['Use Mortgage Calculator for a non-FHA comparison.', 'Use Down Payment Calculator to test cash needed.'],
  },
  'va-mortgage-calculator': {
    summary: 'Learn how a VA purchase funding fee can affect loan amount and payment.',
    purpose:
      'The VA Mortgage Calculator estimates a common VA-backed purchase scenario. It focuses on payment and funding-fee logic, not eligibility.',
    enter: [
      'Enter home price, down payment, rate, term, property tax, and insurance.',
      'Choose first use or later use, funding-fee exemption, and whether to finance the funding fee.',
      'Use the VA funding fee result as a planning estimate before checking official loan documents.',
    ],
    example: [
      '$360,000 with no down payment and first VA use uses the common first-use funding-fee rate.',
      'The calculator adds the fee to the loan if financed, then estimates the mortgage payment.',
    ],
    read: [
      'Funding fee rate is chosen from down payment, first-use status, and exemption setting.',
      'Funding fee dollars show the one-time fee amount in this simplified purchase model.',
      'Total monthly payment changes if the fee is financed because the loan balance is higher.',
    ],
    mistakes: [
      'Do not use this to prove VA eligibility or exemption status.',
      'Do not forget lender fees, discount points, appraisal, title, seller credits, and VA closing-cost rules.',
      'Do not use purchase funding-fee logic for every VA refinance type.',
    ],
    next: ['Use FHA Loan Calculator for another government-backed loan comparison.', 'Use Mortgage Calculator for a plain mortgage estimate.'],
  },
  'home-equity-loan-calculator': {
    summary: 'Learn how home value, mortgage balance, loan amount, and CLTV affect a fixed home equity loan estimate.',
    purpose:
      'The Home Equity Loan Calculator estimates a lump-sum second loan. It shows both the fixed payment and whether the requested loan fits inside a combined loan-to-value limit.',
    enter: [
      'Enter home value and current mortgage balance first.',
      'Enter the desired loan amount, rate, term, and max combined loan-to-value percent.',
      'Use a realistic home value because available equity depends on it.',
    ],
    example: [
      '$450,000 home value, $260,000 mortgage balance, and an 85% max CLTV gives an available-equity estimate.',
      'A $50,000 requested loan is then run through the fixed-payment loan formula.',
    ],
    read: [
      'Available equity at limit is the maximum borrowing room under the entered CLTV cap.',
      'Combined LTV shows mortgage balance plus requested loan compared with home value.',
      'Monthly payment and total interest are for the desired loan amount, not the whole mortgage balance.',
    ],
    mistakes: [
      'Do not forget that the home is collateral and can be at risk if payments are missed.',
      'Do not compare by payment alone when upfront fees, closing costs, and rate type differ.',
      'Do not assume an estimated home value or CLTV cap means approval.',
    ],
    next: ['Use HELOC Calculator if the borrowing is a line of credit.', 'Use Loan Calculator for a non-home-secured comparison.'],
  },
  'heloc-calculator': {
    summary: 'Learn how a HELOC draw, variable-rate assumption, equity limit, and repayment period affect payment estimates.',
    purpose:
      'The HELOC Calculator separates the draw-period interest-only estimate from a later repayment estimate. That matters because HELOC payments can jump after the draw period ends.',
    enter: [
      'Enter home value, current mortgage balance, credit line, current draw, rate, repayment years, and max CLTV.',
      'Use current draw for the amount already borrowed, not the full credit line.',
      'Use the rate as a planning rate because many HELOCs are variable.',
    ],
    example: [
      '$80,000 credit line with $30,000 drawn at 9% creates an interest-only draw-period estimate.',
      'The same $30,000 draw is also amortized over the repayment years to estimate a later repayment payment.',
    ],
    read: [
      'Interest-only payment is based only on the current draw and rate.',
      'Repayment payment estimate shows what the drawn balance might cost if paid down over the repayment period.',
      'Combined LTV on draw uses current mortgage balance plus current draw, not the full credit line.',
    ],
    mistakes: [
      'Do not treat the interest-only payment as the forever payment.',
      'Do not ignore variable rates, freezes, minimum draws, fees, balloon payments, and lender line rules.',
      'Do not forget that missing payments can put the home at risk.',
    ],
    next: ['Use Home Equity Loan Calculator for a fixed lump-sum option.', 'Use APR Calculator if fees make a quote hard to compare.'],
  },
  'down-payment-calculator': {
    summary: 'Learn how home price, down payment percent, exact cash, and closing costs shape cash needed.',
    purpose:
      'The Down Payment Calculator estimates upfront cash for a home purchase. It keeps down payment separate from closing costs because they are not the same thing.',
    enter: [
      'Enter home price first.',
      'Either enter an exact down payment dollar amount or use the down payment percent.',
      'Enter closing cost percent as a rough planning estimate, separate from the down payment.',
    ],
    example: [
      '$400,000 with 20% down gives an $80,000 down payment and a $320,000 estimated loan.',
      'If closing costs are estimated at 3%, the calculator adds $12,000 to show $92,000 estimated cash needed.',
    ],
    read: [
      'Cash needed is down payment plus estimated closing costs.',
      'Loan amount is home price minus down payment.',
      'Loan-to-value is the loan amount as a percent of the home price.',
    ],
    mistakes: [
      'Do not treat closing costs as part of the down payment.',
      'Do not forget escrow deposits, lender reserves, moving costs, inspections, insurance, and assistance-program rules.',
      'Do not assume the calculator is a final cash-to-close number.',
    ],
    next: ['Use Mortgage Calculator to estimate the monthly payment.', 'Use FHA Loan Calculator to test a common low-down-payment scenario.'],
  },
  'rent-vs-buy-calculator': {
    summary: 'Learn how rent growth, mortgage costs, maintenance, appreciation, sale proceeds, and time horizon affect a rent-versus-buy estimate.',
    purpose:
      'The Rent vs. Buy Calculator compares renting with buying and selling after a chosen number of years. It is built for testing assumptions, not declaring one choice right for everyone.',
    enter: [
      'Enter monthly rent and expected rent increase.',
      'Enter home price, down payment, mortgage rate, years, tax, insurance, maintenance, appreciation, and selling cost.',
      'Use the number of years you realistically expect to stay, because short and long horizons can give very different answers.',
    ],
    example: [
      '$2,100 rent versus a $420,000 home over seven years compares projected rent cost with buying cash outflow.',
      'The calculator estimates home value, remaining loan balance, and sale proceeds, then compares net buying cost with total rent cost.',
    ],
    read: [
      'Buy minus rent is the final gap between estimated buying cost and rent cost.',
      'Net buying cost subtracts estimated sale proceeds from buying cash outflow.',
      'Estimated sale proceeds depend heavily on appreciation, selling costs, and remaining loan balance.',
    ],
    mistakes: [
      'Do not ignore opportunity cost, taxes, PMI, HOA, repairs timing, moving costs, or lifestyle flexibility.',
      'Do not assume appreciation is guaranteed.',
      'Do not compare a short stay with a long stay using the same conclusion.',
    ],
    next: ['Use Rent Calculator for rent affordability.', 'Use Real Estate Calculator for a sale-profit estimate.'],
  },
  'payback-period-calculator': {
    summary: 'Learn how initial cost and yearly cash flow create a simple payback time.',
    purpose:
      'The Payback Period Calculator answers a basic recovery question: how many years until the project pays back its starting cost from steady annual cash flow?',
    enter: [
      'Enter the initial cost as the amount paid upfront.',
      'Enter annual cash flow as the yearly savings or extra cash the project creates.',
      'Enter horizon years if you want a simple net check after a specific time.',
    ],
    example: [
      '$15,000 upfront cost and $3,600 yearly savings gives about 4.17 years to pay back.',
      'If the horizon is 6 years, the calculator also shows yearly cash flow over 6 years minus the initial cost.',
    ],
    read: [
      'Payback years is initial cost divided by annual cash flow.',
      'Net after horizon is a simple total cash-flow check after the chosen number of years.',
      'A shorter payback is usually easier to understand, but it does not mean the project is automatically best.',
    ],
    mistakes: [
      'Do not forget that simple payback ignores time value of money.',
      'Do not ignore cash flows that happen after the payback point.',
      'Do not use this alone for risky, long, or uneven projects.',
    ],
    next: ['Use IRR Calculator for uneven cash flows.', 'Use Present Value Calculator to include discounting.'],
  },
  'present-value-calculator': {
    summary: 'Learn how a discount rate turns future money and regular payments into a value in today’s dollars.',
    purpose:
      'The Present Value Calculator discounts a future lump sum and a regular payment stream back to today. It helps explain why money later is usually worth less than money now when a positive discount rate is used.',
    enter: [
      'Enter a future value if there is a lump sum at the end.',
      'Enter regular payment, years, discount rate, and payments per year if there is a payment stream.',
      'Use the discount rate as the comparison rate or required return for the scenario.',
    ],
    example: [
      '$50,000 in 10 years at a 6% discount rate is divided by the growth factor to estimate today’s value.',
      'If regular payments are also entered, the calculator discounts the payment stream as an ordinary annuity and adds it to the lump-sum present value.',
    ],
    read: [
      'Present value is the combined today-value estimate.',
      'Lump-sum present value and payment-stream present value show the two parts separately.',
      'A higher discount rate lowers present value, all else equal.',
    ],
    mistakes: [
      'Do not treat the discount rate as guaranteed investment return.',
      'Do not mix monthly payments with annual payments unless payments per year matches.',
      'Do not forget taxes, fees, inflation surprises, risk, and payment timing.',
    ],
    next: ['Use Future Value Calculator to project money forward.', 'Use IRR Calculator when the cash flows are uneven.'],
  },
  'future-value-calculator': {
    summary: 'Learn how a starting amount, regular payments, rate, and time can grow into a future value.',
    purpose:
      'The Future Value Calculator moves money forward in time. It estimates what a starting balance and equal regular payments could become if the entered rate, time, and payment frequency stay the same.',
    enter: [
      'Enter principal for the money already saved or invested.',
      'Enter payment for the amount added each period, then set payments per year to match that payment amount.',
      'Enter annual rate and years as planning assumptions, not as guaranteed growth.',
    ],
    example: [
      '$5,000 plus $250 monthly for 10 years at 6% compounds the $5,000 and each monthly payment separately.',
      'The calculator treats regular payments as end-of-period payments, so the timing is closer to an ordinary annuity than money deposited at the start of each period.',
    ],
    read: [
      'Future value is the projected ending balance.',
      'Principal future value shows what the starting amount becomes by itself.',
      'Contribution future value shows the growth of the regular payment stream.',
    ],
    mistakes: [
      'Do not mix monthly payments with annual payment frequency.',
      'Do not treat the entered rate as guaranteed investment performance.',
      'Do not forget that taxes, fees, inflation, missed payments, and account rules can change the real result.',
    ],
    next: ['Use Present Value Calculator to discount future money back to today.', 'Use Compound Interest Calculator for more compounding-frequency control.'],
  },
  'commission-calculator': {
    summary: 'Learn how sales amount, commission rate, split percent, base pay, and bonus combine into simple commission pay.',
    purpose:
      'The Commission Calculator is for checking a simple commission plan. It multiplies sales by a commission rate, applies a split if there is one, and then adds base pay or bonus amounts entered.',
    enter: [
      'Enter sales amount for the sale, revenue, or production value the commission is based on.',
      'Enter commission percent as a normal percent, such as 3 for 3%.',
      'Use split percent only when you receive part of the gross commission, then add base pay or bonus if those belong in the same pay estimate.',
    ],
    example: [
      '$50,000 in sales at 3% creates $1,500 gross commission.',
      'If the split is 50%, the split commission is $750 before any base pay or bonus is added.',
    ],
    read: [
      'Commission is the gross commission before split.',
      'Split amount is the part assigned to you after the split percent.',
      'Total pay adds split commission, base pay, and bonus, but it is still before tax or company policy adjustments.',
    ],
    mistakes: [
      'Do not use this for tiered, quota, accelerator, clawback, draw, or chargeback plans without a separate agreement check.',
      'Do not assume commission is owed or payable just because this simple math produces a number.',
      'Do not forget payroll tax, written plan rules, timing, returns, cancellations, or employer policy.',
    ],
    next: ['Use Salary Calculator to compare base pay.', 'Use Take-Home-Paycheck Calculator for a rough net-pay screen.'],
  },
  'mortgage-calculator-uk': {
    summary: 'Learn how a UK-style repayment mortgage estimate uses property price, deposit, rate, term, and monthly fees.',
    purpose:
      'The UK Mortgage Calculator estimates a repayment mortgage payment. It subtracts the deposit from the property price, calculates the repayment amount, and adds any monthly fees entered.',
    enter: [
      'Enter property price and deposit in the same currency.',
      'Enter the annual interest rate and repayment term in years.',
      'Add monthly fees only when you want them included in the monthly payment estimate.',
    ],
    example: [
      'A 300,000 property with a 60,000 deposit creates a 240,000 loan.',
      'The calculator estimates the repayment mortgage payment on that loan, then adds monthly fees if entered.',
    ],
    read: [
      'Monthly repayment is the loan payment before optional monthly fees.',
      'Total monthly payment includes the optional monthly fee field.',
      'Loan-to-value shows the loan amount compared with property price, which is useful for comparing deposit scenarios.',
    ],
    mistakes: [
      'Do not use this as a lender affordability check.',
      'Do not forget stamp duty, arrangement fees, valuation fees, insurance, solicitor costs, product rules, or interest-only mortgage differences.',
      'Do not enter a deposit equal to or larger than the property price.',
    ],
    next: ['Use Mortgage Calculator for the U.S.-style version.', 'Use Canadian Mortgage Calculator if the loan follows Canadian payment conventions.'],
  },
  'canadian-mortgage-calculator': {
    summary: 'Learn how a Canadian mortgage estimate converts semi-annual compounding into the selected payment frequency.',
    purpose:
      'The Canadian Mortgage Calculator estimates payments using a Canadian-style semi-annual compounding conversion. That makes it different from a basic annual-rate-divided-by-12 mortgage estimate.',
    enter: [
      'Enter property price and down payment in the same currency.',
      'Enter the nominal annual rate, amortization years, and payment frequency.',
      'Use the payment frequency that matches the comparison you want: monthly, biweekly, weekly, or another page option.',
    ],
    example: [
      'For a 600,000 property with 120,000 down, the loan amount is 480,000.',
      'The calculator converts the nominal annual rate through semi-annual compounding, then converts that effective rate to the chosen payment period.',
    ],
    read: [
      'Payment is for the selected frequency, not always a monthly amount.',
      'Loan-to-value shows the loan amount as a percent of property price.',
      'Total interest depends on amortization length and does not include future renewal-rate changes.',
    ],
    mistakes: [
      'Do not use a U.S. monthly-compounding mortgage calculator for this exact comparison.',
      'Do not forget mortgage default insurance, closing costs, property tax, renewal risk, prepayment privileges, or lender qualification rules.',
      'Do not compare payment frequencies without checking whether they are accelerated or just regular-frequency payments.',
    ],
    next: ['Use Mortgage Calculator UK for a UK repayment estimate.', 'Use Down Payment Calculator to compare deposit size and loan-to-value.'],
  },
  'percent-off-calculator': {
    summary: 'Learn how one or two discounts, tax, and effective discount percent turn a tag price into a final sale price.',
    purpose:
      'The Percent Off Calculator is for sale and coupon math. It applies the first discount, then applies the second discount to the already-reduced price, which is how stacked percentage discounts usually work.',
    enter: [
      'Enter original price before any discount.',
      'Enter first discount percent and optional second discount percent as normal percentages.',
      'Enter sales tax percent only if you want an after-tax total.',
    ],
    example: [
      '$80 with 25% off drops to $60 before any second discount.',
      'An extra 10% off is then applied to $60, not to the original $80, giving a stronger but not additive discount.',
    ],
    read: [
      'Final price is the amount after discounts and optional tax.',
      'Savings before tax shows the dollar amount removed from the original price.',
      'Effective discount shows the real percent saved after stacked discounts.',
    ],
    mistakes: [
      'Do not add 25% and 10% and assume the discount is exactly 35%.',
      'Do not forget that tax, shipping, coupon exclusions, minimum spend, and fees can change checkout totals.',
      'Do not enter 0.25 when the field asks for 25%.',
    ],
    next: ['Use Discount Calculator for a broader discount setup.', 'Use Sales Tax Calculator when tax is the main question.'],
  },
};

function buildDefaultGuideDetail(tool: (typeof financeTools)[number]): GuideDetail {
  const firstExample = tool.examples[0];
  const secondExample = tool.examples[1] ?? firstExample;
  const formulaNote =
    tool.faq.find((item) => item.question.includes('doing with my numbers'))?.answer ??
    'Use the formula and steps shown on the calculator page to check how the estimate was produced.';
  const limitNote =
    tool.faq.find((item) => item.question.includes('leave out'))?.answer ??
    'This is a planning estimate, not a final quote, tax result, contract term, or professional financial recommendation.';

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
      formulaNote,
    ],
    mistakes: [
      'Do not mix monthly and annual amounts.',
      'Do not copy an answer before checking the rate and term.',
      limitNote,
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

function getGuideTitle(tool: (typeof financeTools)[number]) {
  const standardTitle = `How to use the ${tool.name}`;
  const pageTitle = `${standardTitle} | Access Free Tools`;

  return pageTitle.length > 70 ? `How to use ${tool.name}` : standardTitle;
}

export const financeBlogPosts: BlogPostDefinition[] = financeTools.map((tool) => {
  const detail = getGuideDetail(tool);

  return {
    slug: `how-to-use-${tool.slug}`,
    title: getGuideTitle(tool),
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
    title: getGuideTitle(tool),
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
