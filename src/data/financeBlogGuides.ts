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
  title?: string;
  metaDescription?: string;
  intro?: string;
  quickStart?: string[];
  featuredSections?: GuideSection[];
  sidecarText?: string;
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
  investorSimpleInterest: {
    href: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/simple-interest',
    label: 'Investor.gov: Simple interest glossary',
  },
  cfpbCompoundInterest: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/how-does-compound-interest-work-en-1683/',
    label: 'CFPB: How compound interest works',
  },
  cfpbApyCalculation: {
    href: 'https://www.consumerfinance.gov/rules-policy/regulations/1030/a/',
    label: 'CFPB Regulation DD Appendix A: annual percentage yield calculation',
  },
  fdicCompoundInterest: {
    href: 'https://www.fdic.gov/consumer-resource-center/chapter-5-compound-interest',
    label: 'FDIC: Compound interest',
  },
  investorGovCompoundCalculator: {
    href: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator',
    label: 'Investor.gov: Compound Interest Calculator',
  },
  investorGovFees: {
    href: 'https://www.investor.gov/introduction-investing/getting-started/understanding-fees',
    label: 'Investor.gov: Understanding fees',
  },
  investorGovRiskReturn: {
    href: 'https://www.investor.gov/additional-resources/information/youth/teachers-classroom-resources/risk-and-return',
    label: 'Investor.gov: Risk and return',
  },
  investorGovBuildWealth: {
    href: 'https://www.investor.gov/build-wealth-over-time-through-saving-and-investing',
    label: 'Investor.gov: Build wealth over time through saving and investing',
  },
  investorAnnuities: {
    href: 'https://openstax.org/books/principles-finance/pages/8-2-annuities',
    label: 'OpenStax Principles of Finance: Annuities and present value',
  },
  investorGovAnnuities: {
    href: 'https://www.investor.gov/introduction-investing/investing-basics/investment-products/annuities',
    label: 'Investor.gov: Annuities',
  },
  investorGovVariableAnnuities: {
    href: 'https://www.investor.gov/introduction-investing/investing-basics/investment-products/annuities/variable-annuities',
    label: 'Investor.gov: Variable annuities',
  },
  finraAnnuities: {
    href: 'https://www.finra.org/investors/investing/investment-products/annuities',
    label: 'FINRA: Annuities',
  },
  naicDeferredAnnuities: {
    href: 'https://content.naic.org/sites/default/files/publication-anb-lp-consumer-annuities.pdf',
    label: 'NAIC: Buyer guide for deferred annuities',
  },
  openStaxLoanAmortization: {
    href: 'https://openstax.org/books/principles-finance/pages/8-3-loan-amortization',
    label: 'OpenStax Principles of Finance: Loan amortization',
  },
  consumerBudgetWorksheet: {
    href: 'https://www.mymoney.gov/tools',
    label: 'MyMoney.gov: Financial tools and budget resources',
  },
  pbgcPensionCoverage: {
    href: 'https://www.pbgc.gov/workers-retirees/learn/understanding-your-pension-pbgc-coverage',
    label: 'PBGC: Understanding your pension and PBGC coverage',
  },
  dolRetirementPlans: {
    href: 'https://www.dol.gov/general/topic/retirement',
    label: 'U.S. Department of Labor: Retirement plans, benefits, and savings',
  },
  dolTypesRetirementPlans: {
    href: 'https://www.dol.gov/index.php/general/topic/retirement/typesofplans',
    label: 'U.S. Department of Labor: Types of retirement plans',
  },
  irsDefinedBenefitPlan: {
    href: 'https://www.irs.gov/retirement-plans/defined-benefit-plan',
    label: 'IRS: Defined benefit plan',
  },
  irsRetirementPlanBenefits: {
    href: 'https://www.irs.gov/retirement-plans/types-of-retirement-plan-benefits',
    label: 'IRS: Types of retirement plan benefits',
  },
  cfpbMortgage: {
    href: 'https://www.consumerfinance.gov/language/cfpb-in-english/mortgages-key-terms/',
    label: 'Consumer Financial Protection Bureau: Mortgage key terms',
  },
  cfpbMortgageAffordability: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/how-can-i-figure-out-if-i-can-afford-to-buy-a-home-and-take-out-a-mortgage-en-118/',
    label: 'CFPB: How to decide what mortgage payment is affordable',
  },
  cfpbMonthlyMortgagePayment: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/how-do-mortgage-lenders-calculate-monthly-payments-en-1965/',
    label: 'CFPB: How mortgage lenders calculate monthly payments',
  },
  cfpbPiti: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-piti-en-152/',
    label: 'CFPB: What is PITI?',
  },
  cfpbPayoffAmount: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-payoff-amount-and-is-it-the-same-as-my-current-balance-en-205/',
    label: 'CFPB: Payoff amount vs. current balance',
  },
  irsPublication523: {
    href: 'https://www.irs.gov/publications/p523',
    label: 'IRS Publication 523: Selling Your Home',
  },
  irsRentalTopic414: {
    href: 'https://www.irs.gov/taxtopics/tc414',
    label: 'IRS Topic 414: Rental income and expenses',
  },
  irsPublication527: {
    href: 'https://www.irs.gov/publications/p527',
    label: 'IRS Publication 527: Residential Rental Property',
  },
  fannieRentalIncome: {
    href: 'https://selling-guide.fanniemae.com/sel/b3-3.8-01/rental-income',
    label: 'Fannie Mae Selling Guide: Rental income',
  },
  cfpbServicerRules: {
    href: 'https://www.consumerfinance.gov/consumer-tools/mortgages/your-mortgage-servicer-must-comply-with-federal-rules/',
    label: 'CFPB: Mortgage servicer rules',
  },
  fannieExtraMortgagePayments: {
    href: 'https://yourhome.fanniemae.com/own/making-extra-mortgage-payments',
    label: 'Fannie Mae: Making extra mortgage payments',
  },
  fannieExtraPaymentCalculator: {
    href: 'https://yourhome.fanniemae.com/calculators-tools/extra-mortgage-payment-calculator',
    label: 'Fannie Mae: Extra Mortgage Payment Calculator',
  },
  fannieMortgageAffordability: {
    href: 'https://yourhome.fanniemae.com/calculators-tools/mortgage-affordability-calculator',
    label: 'Fannie Mae: Mortgage Affordability Calculator',
  },
  fannieHowMuchHouse: {
    href: 'https://yourhome.fanniemae.com/buy/how-much-house-can-you-afford',
    label: 'Fannie Mae: How much house can you afford?',
  },
  freddieMacPmms: {
    href: 'https://www.freddiemac.com/pmms',
    label: 'Freddie Mac: Primary Mortgage Market Survey',
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
  taxFoundationSalesTaxRates: {
    href: 'https://taxfoundation.org/data/all/state/sales-tax-rates/',
    label: 'Tax Foundation: 2026 state and local sales tax rates',
  },
  irsRevenueProcedure: {
    href: 'https://www.irs.gov/pub/irs-drop/rp-25-32.pdf',
    label: 'IRS Revenue Procedure 2025-32',
  },
  irsPublication501: {
    href: 'https://www.irs.gov/publications/p501',
    label: 'IRS Publication 501: Filing status and standard deduction',
  },
  irs401k: {
    href: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits',
    label: 'IRS: 401(k) and profit-sharing plan contribution limits',
  },
  irs401k2026Limits: {
    href: 'https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500',
    label: 'IRS: 2026 401(k) contribution limits',
  },
  irs401kPlans: {
    href: 'https://www.irs.gov/retirement-plans/401k-plans',
    label: 'IRS: 401(k) plans',
  },
  cfpbCreditCards: {
    href: 'https://www.consumerfinance.gov/consumer-tools/credit-cards/',
    label: 'CFPB: Credit cards',
  },
  cfpbTruthInLendingAutoLoan: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-truth-in-lending-disclosure-for-an-auto-loan-en-787/',
    label: 'CFPB: Truth in Lending auto loan disclosure terms',
  },
  cfpbCreditCardApr: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-credit-card-interest-rate-what-does-apr-mean-en-44/',
    label: 'CFPB: What credit card APR means',
  },
  cfpbCreditCardInterest: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/how-does-my-credit-card-company-calculate-the-amount-of-interest-i-owe-en-51/',
    label: 'CFPB: How credit card interest is calculated',
  },
  cfpbCreditCardGracePeriod: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-grace-period-for-a-credit-card-en-47/',
    label: 'CFPB: Credit card grace periods',
  },
  cfpbCreditCardAgreement: {
    href: 'https://www.consumerfinance.gov/data-research/credit-card-data/know-you-owe-credit-cards/',
    label: 'CFPB: Credit card agreement terms',
  },
  ftcCreditCardDebt: {
    href: 'https://consumer.ftc.gov/paying-holiday-credit-card-debt',
    label: 'FTC: Paying credit card debt',
  },
  ftcGetOutOfDebt: {
    href: 'https://consumer.ftc.gov/how-get-out-debt',
    label: 'FTC: How to get out of debt',
  },
  ftcAdvanceFeeLoans: {
    href: 'https://consumer.ftc.gov/articles/what-know-about-advance-fee-loans',
    label: 'FTC: Advance-fee loan warning signs',
  },
  consumerGovBudget: {
    href: 'https://consumer.gov/your-money/making-budget',
    label: 'consumer.gov: Making a budget',
  },
  cfpbDebtConsolidation: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-do-i-need-to-know-if-im-thinking-about-consolidating-my-credit-card-debt-en-1861/',
    label: 'CFPB: Consolidating credit card debt',
  },
  cfpbCreditCounselingVsSettlement: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/whats-the-difference-between-a-credit-counselor-and-a-debt-settlement-company-en-1449/',
    label: 'CFPB: Credit counseling, settlement, and consolidation',
  },
  cfpbDebtCollection: {
    href: 'https://www.consumerfinance.gov/consumer-tools/debt-collection/',
    label: 'Consumer Financial Protection Bureau: Debt collection resources',
  },
  fsaRepaymentPlanList: {
    href: 'https://studentaid.gov/manage-loans/repayment/plans',
    label: 'Federal Student Aid: Federal student loan repayment plans',
  },
  fsaLoanSimulatorArticle: {
    href: 'https://studentaid.gov/articles/compare-student-loan-repayment-plans-calculator/',
    label: 'Federal Student Aid: Loan Simulator repayment-plan calculator',
  },
  fsaInterestRates: {
    href: 'https://studentaid.gov/understand-aid/types/loans/interest-rates',
    label: 'Federal Student Aid: Federal student loan interest rates',
  },
  cfpbFederalStudentLoans: {
    href: 'https://www.consumerfinance.gov/paying-for-college/repay-student-debt/federal-student-loans/',
    label: 'CFPB: Options for repaying federal student loans',
  },
  cfpbFederalAndPrivateStudentLoans: {
    href: 'https://www.consumerfinance.gov/paying-for-college/repay-student-debt/federal-and-private-student-loans/',
    label: 'CFPB: Options for federal and private student loans',
  },
  educationNetPrice: {
    href: 'https://collegecost.ed.gov/net-price',
    label: 'U.S. Department of Education: Net Price Calculator Center',
  },
  educationCollegeAffordability: {
    href: 'https://collegecost.ed.gov/',
    label: 'U.S. Department of Education: College Affordability and Transparency Center',
  },
  educationCollegeScorecard: {
    href: 'https://collegescorecard.ed.gov/',
    label: 'U.S. Department of Education: College Scorecard',
  },
  cfpbCollegePath: {
    href: 'https://www.consumerfinance.gov/paying-for-college/compare-financial-aid-and-college-cost/',
    label: 'CFPB: Compare financial aid and college cost',
  },
  cfpbCollegeNumbers: {
    href: 'https://www.consumerfinance.gov/paying-for-college/your-financial-path-to-graduation/how-we-got-these-numbers/',
    label: 'CFPB: How college cost and aid numbers are used',
  },
  fdicCdShopping: {
    href: 'https://www.fdic.gov/consumer-resource-center/2023-11/shopping-certificate-deposit',
    label: 'FDIC: Shopping for a Certificate of Deposit',
  },
  cfpbCertificateDeposit: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-certificate-of-deposit-cd-en-917/',
    label: 'CFPB: What is a certificate of deposit?',
  },
  occCdPenalty: {
    href: 'https://www.helpwithmybank.gov/help-topics/bank-accounts/certificates-of-deposit/cd-penalties.html',
    label: 'OCC HelpWithMyBank.gov: CD early withdrawal penalties',
  },
  cfpbCdAdvertising: {
    href: 'https://www.consumerfinance.gov/rules-policy/regulations/1030/8',
    label: 'CFPB Regulation DD: CD advertising and APY disclosures',
  },
  investorBonds: {
    href: 'https://www.investor.gov/introduction-investing/investing-basics/investment-products/bonds-or-fixed-income-products/bonds',
    label: 'Investor.gov: Bonds FAQs',
  },
  investorCurrentYield: {
    href: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/current-yield',
    label: 'Investor.gov: Current yield',
  },
  investorCallableBonds: {
    href: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/callable-or-redeemable-bonds',
    label: 'Investor.gov: Callable or redeemable bonds',
  },
  finraBondYieldReturn: {
    href: 'https://www.finra.org/investors/insights/bond-yield-return',
    label: 'FINRA: Understanding bond yield and return',
  },
  msrbBondPricesYields: {
    href: 'https://www.msrb.org/Bond-Prices-and-Yields',
    label: 'MSRB: Bond prices and yields',
  },
  treasurySavingsBonds: {
    href: 'https://www.treasurydirect.gov/savings-bonds/',
    label: 'TreasuryDirect: U.S. savings bonds',
  },
  investorMutualFunds: {
    href: 'https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-funds-etfs/mutual-funds',
    label: 'Investor.gov: Mutual funds',
  },
  finraMutualFunds: {
    href: 'https://www.finra.org/investors/investing/investment-products/mutual-funds',
    label: 'FINRA: Mutual funds',
  },
  secMutualFundGuide: {
    href: 'https://www.sec.gov/investor/pubs/sec-guide-to-mutual-funds.pdf',
    label: 'SEC: Guide to mutual funds',
  },
  irsMutualFundDistributions: {
    href: 'https://www.irs.gov/faqs/capital-gains-losses-and-sale-of-home/mutual-funds-costs-distributions-etc/mutual-funds-costs-distributions-etc-4',
    label: 'IRS: Mutual fund capital gain distributions',
  },
  irsIraLimits: {
    href: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-ira-contribution-limits',
    label: 'IRS: IRA contribution limits',
  },
  irsIraDeductionLimits: {
    href: 'https://www.irs.gov/retirement-plans/ira-deduction-limits',
    label: 'IRS: IRA deduction limits',
  },
  irsRetirementColaLimits: {
    href: 'https://www.irs.gov/retirement-plans/cola-increases-for-dollar-limitations-on-benefits-and-contributions',
    label: 'IRS: annual retirement plan and IRA limit table',
  },
  irsRothIras: {
    href: 'https://www.irs.gov/retirement-plans/roth-iras',
    label: 'IRS: Roth IRAs',
  },
  irsRothContributions: {
    href: 'https://www.irs.gov/taxtopics/tc309',
    label: 'IRS Topic 309: Roth IRA contributions',
  },
  irs2026IraLimits: {
    href: 'https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500',
    label: 'IRS: 2026 IRA contribution limits',
  },
  irsIraCatchUp: {
    href: 'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-catch-up-contributions',
    label: 'IRS: IRA catch-up contributions',
  },
  investorIras: {
    href: 'https://www.investor.gov/introduction-investing/investing-basics/investment-accounts/tax-advantaged-accounts/retirement-savings/individual-retirement-accounts-iras',
    label: 'Investor.gov: Individual Retirement Accounts',
  },
  euVat: {
    href: 'https://taxation-customs.ec.europa.eu/taxation/vat_en',
    label: 'European Commission: VAT overview',
  },
  euVatRulesRates: {
    href: 'https://europa.eu/youreurope/business/taxation/vat/vat-rules-rates/index_en.htm',
    label: 'Your Europe: VAT rules and rates',
  },
  govUkVatRates: {
    href: 'https://www.gov.uk/vat-rates',
    label: 'GOV.UK: VAT rates',
  },
  govUkVatCharge: {
    href: 'https://www.gov.uk/how-vat-works/how-much-vat-you-must-charge',
    label: 'GOV.UK: how much VAT to charge',
  },
  cfpbApr: {
    href: 'https://www.consumerfinance.gov/rules-policy/regulations/1026/22',
    label: 'CFPB Regulation Z: Annual percentage rate',
  },
  cfpbAutoLoanRates: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/where-can-i-get-information-on-auto-loan-rates-en-761/',
    label: 'CFPB: Where to get auto loan rate information',
  },
  cfpbAprVsInterest: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-loan-interest-rate-and-the-apr-en-733/',
    label: 'CFPB: Loan interest rate vs. APR',
  },
  cfpbSimpleInterestAuto: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/whats-the-difference-between-a-simple-interest-rate-and-precomputed-interest-on-an-auto-loan-en-841/',
    label: 'CFPB: Simple interest vs. precomputed interest',
  },
  minneapolisFedConsumerRates: {
    href: 'https://www.minneapolisfed.org/article/2025/what-drives-consumer-interest-rates',
    label: 'Minneapolis Fed: What drives consumer interest rates',
  },
  cfpbLoanEstimate: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-loan-estimate-en-1995/',
    label: 'CFPB: What is a Loan Estimate?',
  },
  cfpbRefinanceHandout: {
    href: 'https://files.consumerfinance.gov/f/documents/cfpb_should_i_refinance_handout.pdf',
    label: 'CFPB: Should I refinance? handout',
  },
  cfpbMortgageApr: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-mortgage-interest-rate-and-an-apr-en-135/',
    label: 'CFPB: Mortgage interest rate vs. APR',
  },
  cfpbMortgageClosingFees: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-fees-or-charges-are-paid-when-closing-on-a-mortgage-and-who-pays-them-en-1845/',
    label: 'CFPB: Mortgage closing fees',
  },
  cfpbDiscountPoints: {
    href: 'https://www.consumerfinance.gov/about-us/newsroom/cfpb-finds-americans-are-paying-upfront-fees-seeking-to-lower-interest-rates-on-mortgages/',
    label: 'CFPB: Discount point tradeoffs',
  },
  cfpbRefinanceRescission: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/how-long-do-i-have-to-rescind-when-does-the-right-of-rescission-start-en-187/',
    label: 'CFPB: Refinance rescission timing',
  },
  cfpbAutoTruthInLending: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-truth-in-lending-disclosure-for-an-auto-loan-en-787/',
    label: 'CFPB: Truth in Lending disclosure for an auto loan',
  },
  cfpbPersonalInstallmentFees: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/do-personal-installment-loans-have-fees-en-2120/',
    label: 'CFPB: Personal installment loan fees',
  },
  cfpbAutoFinancingOffers: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/how-do-i-qualify-for-an-advertised-0-auto-financing-en-781/',
    label: 'CFPB: Advertised 0% auto financing and cash rebate incentives',
  },
  cfpbAutoLoanCompare: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/how-do-i-compare-auto-loan-offers-what-should-i-look-at-besides-the-monthly-payment-en-753/',
    label: 'CFPB: How to compare auto loan offers',
  },
  cfpbAutoLoanTerms: {
    href: 'https://www.consumerfinance.gov/language/cfpb-in-english/auto-loans-key-terms/',
    label: 'CFPB: Auto loans key terms',
  },
  cfpbAutoLeaseBuy: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-should-i-know-about-leasing-versus-buying-a-car-en-815/',
    label: 'CFPB: Leasing versus buying a car',
  },
  cfpbRegM: {
    href: 'https://www.consumerfinance.gov/rules-policy/regulations/1013/',
    label: 'CFPB Regulation M: Consumer Leasing',
  },
  sbaLoans: {
    href: 'https://www.sba.gov/funding-programs/loans',
    label: 'U.S. Small Business Administration: Loans',
  },
  ftcSmallBusinessFinancing: {
    href: 'https://www.ftc.gov/business-guidance/blog/2020/02/small-business-financing-staff-perspective-outlines-issues',
    label: 'FTC: Small business financing issues',
  },
  investorAnnualReturn: {
    href: 'https://openstax.org/books/contemporary-mathematics/pages/6-7-investments',
    label: 'OpenStax: Investments and return on investment',
  },
  finraInvestmentReturns: {
    href: 'https://www.finra.org/investors/insights/investment-returns',
    label: 'FINRA: Calculating your investment returns',
  },
  openStaxDiscounts: {
    href: 'https://openstax.org/books/contemporary-mathematics/pages/6-2-discounts-markups-and-sales-tax',
    label: 'OpenStax: Discounts, markups, and sales tax',
  },
  openStaxContributionMargin: {
    href: 'https://openstax.org/books/principles-managerial-accounting/pages/3-1-explain-contribution-margin-and-calculate-contribution-margin-per-unit-contribution-margin-ratio-and-total-contribution-margin',
    label: 'OpenStax Managerial Accounting: Contribution margin and margin ratio',
  },
  irsPublication334: {
    href: 'https://www.irs.gov/publications/p334',
    label: 'IRS Publication 334: Gross receipts, cost of goods sold, and gross profit',
  },
  openStaxPercent: {
    href: 'https://openstax.org/books/contemporary-mathematics/pages/6-1-understanding-percent',
    label: 'OpenStax: Understanding Percent',
  },
  ftcDeceptivePricing: {
    href: 'https://www.ftc.gov/legal-library/browse/rules/deceptive-pricing',
    label: 'FTC: Deceptive Pricing',
  },
  ftcUnfairDeceptiveFees: {
    href: 'https://www.ftc.gov/node/88176',
    label: 'FTC: Unfair or Deceptive Fees FAQ',
  },
  googleAdSensePageCtr: {
    href: 'https://support.google.com/adsense/answer/112026?hl=en',
    label: 'Google AdSense Help: Page CTR',
  },
  googleAdSensePageRpm: {
    href: 'https://support.google.com/adsense/answer/112030?hl=en',
    label: 'Google AdSense Help: Page RPM',
  },
  googleAdSenseHowWorks: {
    href: 'https://support.google.com/adsense/answer/6242051?hl=en-EN',
    label: 'Google AdSense Help: How AdSense works',
  },
  googleAdSenseRevenueShare: {
    href: 'https://support.google.com/adsense/answer/180195?hl=en-EN',
    label: 'Google AdSense Help: AdSense revenue share',
  },
  googleAdSenseInvalidTraffic: {
    href: 'https://support.google.com/adsense/answer/16737?hl=en',
    label: 'Google AdSense Help: Invalid traffic',
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
    href: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/mortgage-calculator',
    label: 'MoneyHelper: Mortgage calculators',
  },
  moneyHelperMortgageOptions: {
    href: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/mortgage-repayment-options',
    label: 'MoneyHelper: Interest-only and repayment mortgages explained',
  },
  govUkBuyingHome: {
    href: 'https://www.gov.uk/buying-a-home/preparing-to-buy',
    label: 'GOV.UK: Preparing to buy a home',
  },
  govUkSdltRates: {
    href: 'https://www.gov.uk/stamp-duty-land-tax/residential-property-rates',
    label: 'GOV.UK: Stamp Duty Land Tax residential rates',
  },
  canadaInterestAct: {
    href: 'https://laws-lois.justice.gc.ca/eng/acts/I-15/FullText.html',
    label: 'Justice Laws Canada: Interest Act',
  },
  ftcAutoLease: {
    href: 'https://consumer.ftc.gov/financing-or-leasing-car',
    label: 'FTC: Financing or Leasing a Car',
  },
  ftcCarDealerAds: {
    href: 'https://consumer.ftc.gov/car-dealer-ads-promotions-know-you-go',
    label: 'FTC: Car dealer ads and promotions',
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
  hudHousingChoiceVouchers: {
    href: 'https://www.hud.gov/helping-americans/housing-choice-vouchers-tenants',
    label: 'HUD: Housing Choice Voucher tenants, rent, and utilities',
  },
  hudUtilityAllowances: {
    href: 'https://www.hud.gov/helping-americans/public-housing-energy-branch-util',
    label: 'HUD: Utility allowances and rent affordability',
  },
  usaGovTenantRights: {
    href: 'https://www.usa.gov/tenant-rights',
    label: 'USAGov: Tenant rights and landlord disputes',
  },
  irsEstateGift: {
    href: 'https://www.irs.gov/businesses/small-businesses-self-employed/whats-new-estate-and-gift-tax',
    label: 'IRS: Estate and gift tax updates',
  },
  irsEstateTax: {
    href: 'https://www.irs.gov/businesses/small-businesses-self-employed/estate-tax',
    label: 'IRS: Estate tax basics',
  },
  irsEstateTaxFaqs: {
    href: 'https://www.irs.gov/businesses/small-businesses-self-employed/frequently-asked-questions-on-estate-taxes',
    label: 'IRS: Frequently asked questions on estate taxes',
  },
  irsForm706Instructions: {
    href: 'https://www.irs.gov/instructions/i706',
    label: 'IRS: Instructions for Form 706',
  },
  irsRmd: {
    href: 'https://www.irs.gov/publications/p590b',
    label: 'IRS Publication 590-B: IRA distributions and RMD tables',
  },
  irsRmdTopic: {
    href: 'https://www.irs.gov/rmd',
    label: 'IRS: Required minimum distributions',
  },
  irsRmdFaqs: {
    href: 'https://www.irs.gov/retirement-plans/retirement-plan-and-ira-required-minimum-distributions-faqs',
    label: 'IRS: Required minimum distribution FAQs',
  },
  ssaClaimingAge: {
    href: 'https://www.ssa.gov/benefits/retirement/planner/applying2.html',
    label: 'SSA: Benefits before or after full retirement age',
  },
  ssaBenefitEstimate: {
    href: 'https://www.ssa.gov/prepare/get-benefits-estimate',
    label: 'SSA: Get a benefits estimate',
  },
  ssaFullRetirementAge: {
    href: 'https://www.ssa.gov/retirement/full-retirement-age',
    label: 'SSA: See your full retirement age',
  },
  ssaDelayedCredits: {
    href: 'https://www.ssa.gov/benefits/retirement/planner/delayret.html',
    label: 'SSA: Delayed retirement credits',
  },
  ssaCola2026: {
    href: 'https://www.ssa.gov/cola/',
    label: 'SSA: 2026 Social Security changes',
  },
  irsFica: {
    href: 'https://www.irs.gov/taxtopics/tc751',
    label: 'IRS Topic 751: Social Security and Medicare withholding rates',
  },
  irsWithholdingEstimatorFaqs: {
    href: 'https://www.irs.gov/individuals/tax-withholding-estimator-faqs',
    label: 'IRS: Tax Withholding Estimator FAQs',
  },
  irsPub15T: {
    href: 'https://www.irs.gov/publications/p15t',
    label: 'IRS Publication 15-T: Federal Income Tax Withholding Methods',
  },
  irsPub505: {
    href: 'https://www.irs.gov/publications/p505',
    label: 'IRS Publication 505: Tax Withholding and Estimated Tax',
  },
  openStaxIrr: {
    href: 'https://openstax.org/books/principles-finance/pages/16-3-internal-rate-of-return-irr-method',
    label: 'OpenStax Principles of Finance: Internal Rate of Return method',
  },
  microsoftIrr: {
    href: 'https://support.microsoft.com/en-us/office/irr-function-64925eaa-9988-495b-b290-3ad0c163c1bc',
    label: 'Microsoft Support: IRR function',
  },
  vaFundingFee: {
    href: 'https://www.va.gov/housing-assistance/home-loans/funding-fee-and-closing-costs',
    label: 'VA: Funding fee and loan closing costs',
  },
  vaEligibility: {
    href: 'https://www.va.gov/housing-assistance/home-loans/eligibility/',
    label: 'VA: Home loan eligibility',
  },
  vaCertificateOfEligibility: {
    href: 'https://www.va.gov/housing-assistance/home-loans/how-to-request-coe/',
    label: 'VA: How to request a Certificate of Eligibility',
  },
  vaPurchaseLoan: {
    href: 'https://www.va.gov/housing-assistance/home-loans/loan-types/purchase-loan/',
    label: 'VA: Purchase loan',
  },
  hudFhaMip: {
    href: 'https://www.hud.gov/hud-partners/housing-mip',
    label: 'HUD: FHA single family mortgage insurance premiums',
  },
  hudFhaMipMortgageeLetter2023: {
    href: 'https://www.hud.gov/sites/dfiles/OCHCO/documents/2023-05hsgml.pdf',
    label: 'HUD Mortgagee Letter 2023-05: FHA annual MIP rates',
  },
  hudFhaLoanLimits2026: {
    href: 'https://www.hud.gov/hud-partners/single-family-lender',
    label: 'HUD: 2026 FHA forward mortgage loan limits',
  },
  hudFhaLoanLimitsMl2025: {
    href: 'https://www.hud.gov/sites/dfiles/hudclips/documents/2025-23hsgml.pdf',
    label: 'HUD Mortgagee Letter 2025-23: 2026 FHA forward mortgage loan limits',
  },
  cfpbFhaLoans: {
    href: 'https://www.consumerfinance.gov/owning-a-home/fha-loans/',
    label: 'CFPB: FHA loans',
  },
  cfpbHeloc: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-home-equity-line-of-credit-heloc-en-107/',
    label: 'CFPB: What is a HELOC?',
  },
  cfpbHelocBooklet: {
    href: 'https://files.consumerfinance.gov/f/documents/cfpb_heloc-brochure.pdf',
    label: 'CFPB: What you should know about HELOCs',
  },
  cfpbHomeEquity: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-home-equity-loan-en-106/',
    label: 'CFPB: What is a home equity loan?',
  },
  cfpbHomeEquityVsHeloc: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-home-equity-loan-and-a-home-equity-line-of-credit-heloc-en-247/',
    label: 'CFPB: Home equity loan vs. HELOC',
  },
  cfpbClosingDisclosure: {
    href: 'https://www.consumerfinance.gov/owning-a-home/closing-disclosure/',
    label: 'CFPB: Closing Disclosure explainer',
  },
  ftcHomeEquityLoans: {
    href: 'https://consumer.ftc.gov/articles/home-equity-loans-and-home-equity-lines-credit',
    label: 'FTC: Home equity loans and lines of credit',
  },
  irsPub936HomeMortgageInterest: {
    href: 'https://www.irs.gov/publications/p936',
    label: 'IRS Publication 936: Home mortgage interest deduction',
  },
  cfpbDownPayment: {
    href: 'https://www.consumerfinance.gov/owning-a-home/prepare/determine-your-down-payment/',
    label: 'CFPB: Determine your down payment',
  },
  cfpbPrepareHomeMoney: {
    href: 'https://www.consumerfinance.gov/language/cfpb-in-english/prepare-your-money-situation-before-you-buy-a-home/',
    label: 'CFPB: Prepare your money situation before buying a home',
  },
  fannieClosingCostsCalculator: {
    href: 'https://yourhome.fanniemae.com/calculators-tools/closing-costs-calculator',
    label: 'Fannie Mae: Closing costs calculator',
  },
  fannieDownPayment: {
    href: 'https://yourhome.fanniemae.com/buy/homebuyer-down-payment',
    label: 'Fannie Mae: What you need to know about down payments',
  },
  fannieClosingOnLoan: {
    href: 'https://yourhome.fanniemae.com/buy/closing-on-a-loan',
    label: 'Fannie Mae: Closing on a loan',
  },
  hudFhaLoans: {
    href: 'https://www.hud.gov/helping-americans/loans',
    label: 'HUD: Let FHA loans help you',
  },
  canadaMortgage: {
    href: 'https://www.canada.ca/en/financial-consumer-agency/services/mortgages/mortgage-terms-amortization.html',
    label: 'Canada.ca: Mortgage terms and amortization',
  },
  canadaDownPayment: {
    href: 'https://www.canada.ca/en/financial-consumer-agency/services/mortgages/down-payment.html',
    label: 'Canada.ca: Down payments and mortgage loan insurance',
  },
  osfiMinimumQualifyingRate: {
    href: 'https://www.osfi-bsif.gc.ca/en/supervision/financial-institutions/banks/minimum-qualifying-rate-uninsured-mortgages',
    label: 'OSFI: Minimum qualifying rate for uninsured mortgages',
  },
  bankCanadaPolicyRate: {
    href: 'https://www.bankofcanada.ca/core-functions/monetary-policy/key-interest-rate/',
    label: 'Bank of Canada: Policy interest rate',
  },
  federalReserveH10: {
    href: 'https://www.federalreserve.gov/releases/h10/current/',
    label: 'Federal Reserve: Foreign exchange rates H.10',
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
  openStaxProfitabilityRatios: {
    href: 'https://openstax.org/books/principles-finance/pages/6-6-profitability-ratios-and-the-dupont-method',
    label: 'OpenStax Principles of Finance: Profitability ratios and the DuPont method',
  },
  openStaxMarketValueRatios: {
    href: 'https://openstax.org/books/principles-finance/pages/6-5-market-value-ratios',
    label: 'OpenStax Principles of Finance: Market value ratios',
  },
  openStaxStockValuationMultiples: {
    href: 'https://openstax.org/books/principles-finance/pages/11-1-multiple-approaches-to-stock-valuation',
    label: 'OpenStax Principles of Finance: Stock valuation multiples',
  },
  finraEvaluatingStocks: {
    href: 'https://www.finra.org/investors/investing/investment-products/stocks/evaluating-stocks',
    label: 'FINRA: Evaluating stocks',
  },
  openStaxOperatingEfficiencyRatios: {
    href: 'https://openstax.org/books/principles-finance/pages/6-2-operating-efficiency-ratios',
    label: 'OpenStax Principles of Finance: Operating efficiency ratios',
  },
  openStaxSolvencyRatios: {
    href: 'https://openstax.org/books/principles-finance/pages/6-4-solvency-ratios',
    label: 'OpenStax Principles of Finance: Solvency ratios',
  },
  secFinancialStatements: {
    href: 'https://www.sec.gov/about/reports-publications/investorpubsbegfinstmtguide',
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
    return [
      sourceLinks.cfpbMonthlyMortgagePayment,
      sourceLinks.cfpbPiti,
      sourceLinks.cfpbLoanEstimate,
      sourceLinks.freddieMacPmms,
      sourceLinks.cfpbMortgage,
    ];
  }

  if (toolSlug === 'loan-calculator') {
    return [
      sourceLinks.openStaxLoanAmortization,
      sourceLinks.cfpbAprVsInterest,
      sourceLinks.cfpbLoanEstimate,
      sourceLinks.cfpbAutoTruthInLending,
    ];
  }

  if (toolSlug === 'mortgage-payoff-calculator') {
    return [
      sourceLinks.cfpbPayoffAmount,
      sourceLinks.cfpbServicerRules,
      sourceLinks.fannieExtraMortgagePayments,
      sourceLinks.fannieExtraPaymentCalculator,
      sourceLinks.cfpbMortgage,
    ];
  }

  if (toolSlug === 'house-affordability-calculator') {
    return [
      sourceLinks.cfpbMortgageAffordability,
      sourceLinks.fannieMortgageAffordability,
      sourceLinks.fannieHowMuchHouse,
      sourceLinks.cfpbDebtToIncome,
      sourceLinks.cfpbMortgage,
    ];
  }

  if (toolSlug === 'savings-calculator') {
    return [
      sourceLinks.cfpbCompoundInterest,
      sourceLinks.investorGovCompoundCalculator,
      sourceLinks.fdicCompoundInterest,
      sourceLinks.consumerBudgetWorksheet,
    ];
  }

  if (toolSlug === 'apy-calculator') {
    return [
      sourceLinks.cfpbApyCalculation,
      sourceLinks.cfpbCompoundInterest,
      sourceLinks.fdicCompoundInterest,
      sourceLinks.cfpbCdAdvertising,
    ];
  }

  if (toolSlug === 'finance-calculator') {
    return [
      sourceLinks.investorCompound,
      sourceLinks.cfpbCompoundInterest,
      sourceLinks.investorGovCompoundCalculator,
      sourceLinks.consumerBudgetWorksheet,
    ];
  }

  if (toolSlug === 'currency-calculator') {
    return [sourceLinks.federalReserveH10];
  }

  if (toolSlug === 'investment-calculator') {
    return [
      sourceLinks.investorCompound,
      sourceLinks.investorGovCompoundCalculator,
      sourceLinks.investorGovFees,
      sourceLinks.investorGovRiskReturn,
      sourceLinks.investorGovBuildWealth,
    ];
  }

  if (toolSlug === 'budget-calculator') {
    return [sourceLinks.consumerBudgetWorksheet, sourceLinks.cfpbDebtToIncome];
  }

  if (toolSlug === 'rent-calculator') {
    return [sourceLinks.consumerBudgetWorksheet, sourceLinks.cfpbDebtToIncome, sourceLinks.hudHousingChoiceVouchers, sourceLinks.hudUtilityAllowances, sourceLinks.usaGovTenantRights];
  }

  if (['annuity-calculator', 'annuity-payout-calculator'].includes(toolSlug)) {
    return [
      sourceLinks.investorAnnuities,
      sourceLinks.investorGovAnnuities,
      sourceLinks.finraAnnuities,
      sourceLinks.investorGovVariableAnnuities,
      sourceLinks.naicDeferredAnnuities,
    ];
  }

  if (toolSlug === 'pension-calculator') {
    return [
      sourceLinks.pbgcPensionCoverage,
      sourceLinks.dolRetirementPlans,
      sourceLinks.dolTypesRetirementPlans,
      sourceLinks.irsDefinedBenefitPlan,
      sourceLinks.irsRetirementPlanBenefits,
    ];
  }

  if (toolSlug === 'college-cost-calculator') {
    return [
      sourceLinks.educationCollegeAffordability,
      sourceLinks.educationNetPrice,
      sourceLinks.educationCollegeScorecard,
      sourceLinks.cfpbCollegePath,
      sourceLinks.cfpbCollegeNumbers,
      sourceLinks.investorCompound,
    ];
  }

  if (toolSlug === 'irr-calculator') {
    return [sourceLinks.openStaxIrr, sourceLinks.microsoftIrr, sourceLinks.investorCompound];
  }

  if (toolSlug === 'roi-calculator') {
    return [sourceLinks.openStaxInvestments, sourceLinks.finraInvestmentReturns, sourceLinks.investorGovFees];
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
    return [sourceLinks.cfpbAprVsInterest, sourceLinks.cfpbApr, sourceLinks.minneapolisFedConsumerRates];
  }

  if (toolSlug === 'simple-interest-calculator') {
    return [sourceLinks.investorSimpleInterest, sourceLinks.cfpbSimpleInterestAuto, sourceLinks.cfpbAprVsInterest, sourceLinks.investorCompound];
  }

  if (toolSlug === 'interest-calculator') {
    return [sourceLinks.investorSimpleInterest, sourceLinks.cfpbCompoundInterest, sourceLinks.cfpbAprVsInterest, sourceLinks.investorGovCompoundCalculator];
  }

  if (['compound-interest-calculator', 'retirement-calculator', 'future-value-calculator'].includes(toolSlug)) {
    return [sourceLinks.investorCompound];
  }

  if (toolSlug === 'credit-cards-payoff-calculator') {
    return [
      sourceLinks.cfpbCreditCards,
      sourceLinks.cfpbCreditCardApr,
      sourceLinks.cfpbCreditCardInterest,
      sourceLinks.cfpbCreditCardGracePeriod,
      sourceLinks.cfpbCreditCardAgreement,
      sourceLinks.ftcCreditCardDebt,
    ];
  }

  if (toolSlug === 'debt-payoff-calculator') {
    return [
      sourceLinks.cfpbDebtCollection,
      sourceLinks.ftcGetOutOfDebt,
      sourceLinks.consumerGovBudget,
      sourceLinks.cfpbCreditCards,
    ];
  }

  if (toolSlug === 'repayment-calculator') {
    return [
      sourceLinks.cfpbTruthInLendingAutoLoan,
      sourceLinks.fsaLoanSimulatorArticle,
      sourceLinks.ftcGetOutOfDebt,
      sourceLinks.consumerGovBudget,
    ];
  }

  if (toolSlug === 'payment-calculator') {
    return [
      sourceLinks.openStaxLoanAmortization,
      sourceLinks.cfpbAprVsInterest,
      sourceLinks.cfpbPiti,
      sourceLinks.cfpbLoanEstimate,
      sourceLinks.cfpbAutoLoanCompare,
    ];
  }

  if (toolSlug === 'debt-consolidation-calculator') {
    return [
      sourceLinks.cfpbDebtConsolidation,
      sourceLinks.ftcGetOutOfDebt,
      sourceLinks.cfpbCreditCounselingVsSettlement,
      sourceLinks.consumerGovBudget,
    ];
  }

  if (toolSlug === 'student-loan-calculator') {
    return [
      sourceLinks.fsaLoanSimulatorArticle,
      sourceLinks.fsaRepaymentPlanList,
      sourceLinks.fsaInterestRates,
      sourceLinks.cfpbFederalStudentLoans,
      sourceLinks.cfpbFederalAndPrivateStudentLoans,
    ];
  }

  if (toolSlug === 'cd-calculator') {
    return [sourceLinks.cfpbCertificateDeposit, sourceLinks.fdicCdShopping, sourceLinks.occCdPenalty, sourceLinks.cfpbCdAdvertising];
  }

  if (toolSlug === 'bond-calculator') {
    return [
      sourceLinks.investorBonds,
      sourceLinks.investorCurrentYield,
      sourceLinks.finraBondYieldReturn,
      sourceLinks.msrbBondPricesYields,
      sourceLinks.investorCallableBonds,
      sourceLinks.treasurySavingsBonds,
    ];
  }

  if (toolSlug === 'mutual-fund-calculator') {
    return [
      sourceLinks.investorMutualFunds,
      sourceLinks.finraMutualFunds,
      sourceLinks.secMutualFundGuide,
      sourceLinks.investorGovFees,
      sourceLinks.irsMutualFundDistributions,
    ];
  }

  if (toolSlug === 'roth-ira-calculator') {
    return [
      sourceLinks.irsRothIras,
      sourceLinks.irsRothContributions,
      sourceLinks.irs2026IraLimits,
      sourceLinks.irsIraCatchUp,
      sourceLinks.irsIraLimits,
      sourceLinks.investorIras,
      sourceLinks.investorCompound,
    ];
  }

  if (toolSlug === 'ira-calculator') {
    return [
      sourceLinks.irsIraLimits,
      sourceLinks.irsIraDeductionLimits,
      sourceLinks.irs2026IraLimits,
      sourceLinks.irsIraCatchUp,
      sourceLinks.irsRetirementColaLimits,
      sourceLinks.investorIras,
      sourceLinks.investorCompound,
    ];
  }

  if (toolSlug === 'vat-calculator') {
    return [sourceLinks.govUkVatRates, sourceLinks.govUkVatCharge, sourceLinks.euVatRulesRates, sourceLinks.euVat];
  }

  if (toolSlug === 'cash-back-or-low-interest-calculator') {
    return [
      sourceLinks.cfpbAutoFinancingOffers,
      sourceLinks.ftcAutoLease,
      sourceLinks.cfpbAutoLoanRates,
      sourceLinks.ftcCarDealerAds,
      sourceLinks.cfpbApr,
      sourceLinks.cfpbAutoLoanCompare,
    ];
  }

  if (toolSlug === 'auto-loan-calculator') {
    return [sourceLinks.cfpbAutoLoanCompare, sourceLinks.cfpbAutoLoanTerms, sourceLinks.ftcAutoLease, sourceLinks.cfpbAprVsInterest];
  }

  if (toolSlug === 'business-loan-calculator') {
    return [sourceLinks.sbaLoans, sourceLinks.cfpbAprVsInterest, sourceLinks.ftcSmallBusinessFinancing];
  }

  if (toolSlug === 'personal-loan-calculator') {
    return [sourceLinks.cfpbPersonalInstallmentFees, sourceLinks.cfpbAprVsInterest, sourceLinks.ftcAdvanceFeeLoans];
  }

  if (toolSlug === 'apr-calculator') {
    return [sourceLinks.cfpbAprVsInterest, sourceLinks.cfpbApr, sourceLinks.cfpbPersonalInstallmentFees];
  }

  if (['auto-lease-calculator', 'lease-calculator'].includes(toolSlug)) {
    return [sourceLinks.cfpbAutoLeaseBuy, sourceLinks.ftcAutoLease, sourceLinks.ftcCarDealerAds, sourceLinks.cfpbRegM];
  }

  if (toolSlug === 'boat-loan-calculator') {
    return [
      sourceLinks.cfpbAutoLoanCompare,
      sourceLinks.cfpbAutoTruthInLending,
      sourceLinks.cfpbAprVsInterest,
      sourceLinks.ftcAutoLease,
    ];
  }

  if (toolSlug === 'depreciation-calculator') {
    return [sourceLinks.irsDepreciation, sourceLinks.openStaxDepreciation];
  }

  if (toolSlug === 'average-return-calculator') {
    return [sourceLinks.finraInvestmentReturns, sourceLinks.investorGovCompoundCalculator, sourceLinks.investorAnnualReturn, sourceLinks.investorCompound];
  }

  if (toolSlug === 'margin-calculator') {
    return [sourceLinks.openStaxContributionMargin, sourceLinks.irsPublication334, sourceLinks.openStaxDiscounts, sourceLinks.openStaxPercent];
  }

  if (toolSlug === 'discount-calculator') {
    return [sourceLinks.openStaxDiscounts, sourceLinks.openStaxPercent, sourceLinks.ftcDeceptivePricing, sourceLinks.ftcUnfairDeceptiveFees];
  }

  if (toolSlug === 'percent-off-calculator') {
    return [sourceLinks.openStaxDiscounts, sourceLinks.openStaxPercent];
  }

  if (toolSlug === 'ad-revenue-calculator') {
    return [
      sourceLinks.googleAdSensePageCtr,
      sourceLinks.googleAdSensePageRpm,
      sourceLinks.googleAdSenseHowWorks,
      sourceLinks.googleAdSenseRevenueShare,
      sourceLinks.googleAdSenseInvalidTraffic,
      sourceLinks.openStaxPercent,
    ];
  }

  if (toolSlug === 'break-even-calculator') {
    return [sourceLinks.sbaBreakEven, sourceLinks.openStaxBreakEven, sourceLinks.irsPublication334];
  }

  if (toolSlug === 'profit-goal-calculator') {
    return [sourceLinks.sbaBreakEven, sourceLinks.openStaxBreakEven, sourceLinks.openStaxContributionMargin, sourceLinks.irsPublication334];
  }

  if (toolSlug === 'markup-calculator') {
    return [sourceLinks.openStaxDiscounts, sourceLinks.openStaxPercent];
  }

  if (toolSlug === 'debt-ratios-calculator') {
    return [sourceLinks.openStaxSolvencyRatios, sourceLinks.secFinancialStatements];
  }

  if (toolSlug === 'operations-ratios-calculator') {
    return [sourceLinks.openStaxOperatingEfficiencyRatios, sourceLinks.secFinancialStatements];
  }

  if (toolSlug === 'profitability-ratios-calculator') {
    return [sourceLinks.openStaxProfitabilityRatios, sourceLinks.secFinancialStatements];
  }

  if (toolSlug === 'stock-ratios-calculator') {
    return [
      sourceLinks.openStaxMarketValueRatios,
      sourceLinks.openStaxStockValuationMultiples,
      sourceLinks.finraEvaluatingStocks,
      sourceLinks.secFinancialStatements,
    ];
  }

  if (toolSlug === 'liquidity-ratios-calculator') {
    return [sourceLinks.openStaxFinancialStatementAnalysis, sourceLinks.secFinancialStatements];
  }

  if (toolSlug === 'debt-to-income-ratio-calculator') {
    return [sourceLinks.cfpbDebtToIncome];
  }

  if (toolSlug === 'social-security-calculator') {
    return [
      sourceLinks.ssaBenefitEstimate,
      sourceLinks.ssaFullRetirementAge,
      sourceLinks.ssaClaimingAge,
      sourceLinks.ssaDelayedCredits,
      sourceLinks.ssaCola2026,
    ];
  }

  if (toolSlug === 'rmd-calculator') {
    return [sourceLinks.irsRmdTopic, sourceLinks.irsRmdFaqs, sourceLinks.irsRmd];
  }

  if (toolSlug === 'take-home-paycheck-calculator') {
    return [sourceLinks.irsPub15T, sourceLinks.irsFica, sourceLinks.irsWithholdingEstimatorFaqs, sourceLinks.irsPub505];
  }

  if (toolSlug === 'real-estate-calculator') {
    return [sourceLinks.cfpbPayoffAmount, sourceLinks.cfpbClosingDisclosure, sourceLinks.irsPublication523, sourceLinks.cfpbMortgage];
  }

  if (toolSlug === 'rental-property-calculator') {
    return [sourceLinks.irsRentalTopic414, sourceLinks.irsPublication527, sourceLinks.fannieRentalIncome, sourceLinks.cfpbMortgage];
  }

  if (toolSlug === 'fha-loan-calculator') {
    return [
      sourceLinks.cfpbFhaLoans,
      sourceLinks.hudFhaLoans,
      sourceLinks.hudFhaLoanLimits2026,
      sourceLinks.hudFhaLoanLimitsMl2025,
      sourceLinks.hudFhaMip,
      sourceLinks.hudFhaMipMortgageeLetter2023,
      sourceLinks.cfpbDownPayment,
      sourceLinks.cfpbPrepareHomeMoney,
    ];
  }

  if (toolSlug === 'va-mortgage-calculator') {
    return [
      sourceLinks.vaFundingFee,
      sourceLinks.vaEligibility,
      sourceLinks.vaCertificateOfEligibility,
      sourceLinks.vaPurchaseLoan,
      sourceLinks.cfpbLoanEstimate,
      sourceLinks.cfpbMortgageClosingFees,
      sourceLinks.cfpbClosingDisclosure,
      sourceLinks.cfpbMortgage,
    ];
  }

  if (toolSlug === 'home-equity-loan-calculator') {
    return [
      sourceLinks.cfpbHomeEquity,
      sourceLinks.cfpbHomeEquityVsHeloc,
      sourceLinks.ftcHomeEquityLoans,
      sourceLinks.cfpbLoanEstimate,
      sourceLinks.cfpbClosingDisclosure,
      sourceLinks.irsPub936HomeMortgageInterest,
    ];
  }

  if (toolSlug === 'heloc-calculator') {
    return [
      sourceLinks.cfpbHeloc,
      sourceLinks.cfpbHomeEquityVsHeloc,
      sourceLinks.cfpbHelocBooklet,
      sourceLinks.ftcHomeEquityLoans,
      sourceLinks.irsPub936HomeMortgageInterest,
    ];
  }

  if (toolSlug === 'down-payment-calculator') {
    return [
      sourceLinks.cfpbDownPayment,
      sourceLinks.cfpbPrepareHomeMoney,
      sourceLinks.fannieClosingCostsCalculator,
      sourceLinks.fannieDownPayment,
      sourceLinks.fannieClosingOnLoan,
      sourceLinks.hudFhaLoans,
    ];
  }

  if (toolSlug === 'rent-vs-buy-calculator') {
    return [sourceLinks.cfpbDownPayment, sourceLinks.cfpbMortgage];
  }

  if (toolSlug === 'mortgage-calculator-uk') {
    return [
      sourceLinks.moneyHelperMortgage,
      sourceLinks.moneyHelperMortgageOptions,
      sourceLinks.govUkBuyingHome,
      sourceLinks.govUkSdltRates,
      sourceLinks.govUkMortgage,
    ];
  }

  if (toolSlug === 'canadian-mortgage-calculator') {
    return [
      sourceLinks.canadaMortgage,
      sourceLinks.canadaDownPayment,
      sourceLinks.osfiMinimumQualifyingRate,
      sourceLinks.bankCanadaPolicyRate,
      sourceLinks.canadaInterestAct,
    ];
  }

  if (toolSlug === 'refinance-calculator') {
    return [
      sourceLinks.cfpbRefinanceHandout,
      sourceLinks.cfpbLoanEstimate,
      sourceLinks.cfpbMortgageClosingFees,
      sourceLinks.cfpbMortgageApr,
      sourceLinks.cfpbDiscountPoints,
      sourceLinks.cfpbRefinanceRescission,
    ];
  }

  if (toolSlug === '401k-calculator') {
    return [sourceLinks.irs401k2026Limits, sourceLinks.irs401k, sourceLinks.irs401kPlans, sourceLinks.investorCompound];
  }

  if (toolSlug === 'credit-card-calculator') {
    return [
      sourceLinks.cfpbCreditCards,
      sourceLinks.cfpbCreditCardApr,
      sourceLinks.cfpbCreditCardInterest,
      sourceLinks.cfpbCreditCardGracePeriod,
      sourceLinks.cfpbCreditCardAgreement,
      sourceLinks.ftcCreditCardDebt,
    ];
  }

  if (toolSlug === 'inflation-calculator') {
    return [sourceLinks.blsInflation];
  }

  if (toolSlug === 'estate-tax-calculator') {
    return [sourceLinks.irs2026, sourceLinks.irsEstateTax, sourceLinks.irsEstateTaxFaqs, sourceLinks.irsForm706Instructions];
  }

  if (toolSlug === 'income-tax-calculator') {
    return [
      sourceLinks.irs2026,
      sourceLinks.irsRevenueProcedure,
      sourceLinks.irsWithholdingEstimatorFaqs,
      sourceLinks.irsPub15T,
      sourceLinks.irsPub505,
    ];
  }

  if (toolSlug === 'marriage-tax-calculator') {
    return [sourceLinks.irs2026, sourceLinks.irsRevenueProcedure, sourceLinks.irsPublication501];
  }

  if (toolSlug === 'sales-tax-calculator') {
    return [sourceLinks.irsSalesTax, sourceLinks.taxFoundationSalesTaxRates];
  }

  return [];
}

const guideDetails: Record<string, GuideDetail> = {
  'break-even-calculator': {
    summary: 'Learn how many units or how much sales revenue you need before a product, service, or event covers its costs.',
    purpose:
      'The Break Even Calculator is for simple business planning. It answers: how many units do I need to sell before estimated revenue covers estimated fixed and variable costs?',
    enter: [
      'Enter fixed costs for the same period you are planning, such as booth fees, rent, software, equipment, setup, permits, insurance, or design costs.',
      'Enter price per unit as the amount one customer pays for one item, ticket, order, or service package.',
      'Enter variable cost per unit as the cost that happens each time one unit sells, such as materials, packaging, payment fees, commissions, shipping, or direct labor.',
      'Keep one-time startup costs, owner pay, debt payments, taxes, and mixed-product averages separate unless they belong in the period you are checking.',
    ],
    example: [
      'If fixed costs are $5,000, price is $40, and variable cost is $18, each sale leaves $22 after variable cost.',
      'The calculator divides $5,000 by $22, so the break-even point is about 227.27 units, or about $9,090.91 in sales.',
      'If you sell physical items, round 227.27 up to 228 units because 227 units still does not quite cover the estimate.',
      'For a $1,200 food stall with a $12 price and $4.25 variable cost, the contribution is $7.75 per item and break-even is about 154.84 items.',
    ],
    read: [
      'Break-even units is the main answer. In real life, you usually round up because you cannot sell part of a physical item.',
      'Break-even sales is the revenue needed at the price you entered.',
      'Contribution margin per unit is the amount each sale contributes toward fixed costs and then profit.',
      'Contribution margin ratio shows the same idea as a percent of price, which helps when you compare price changes.',
    ],
    mistakes: [
      'Do not put total costs into variable cost per unit. Variable cost should be for one unit.',
      'Do not mix weekly sales with monthly fixed costs. The time period has to match.',
      'Do not forget fees, refunds, discounts, waste, payment processing, or shipping if they happen often.',
      'Do not use this as proof that the business idea is good. It only checks the zero-profit point, not demand, cash flow, taxes, or owner pay.',
    ],
    next: ['Use Profit Goal Calculator when you want profit above break-even.', 'Use Markup Calculator to test a different selling price.'],
  },
  'markup-calculator': {
    title: 'Markup and Margin Calculator Guide',
    metaDescription:
      'Calculate markup, convert markup to margin, find selling price from target margin, and check cost versus price with worked examples.',
    intro:
      'Markup and margin can describe the same profit with different percentages. This guide shows three useful checks: set a price from markup, work backward from a target margin, or measure a price you already know.',
    quickStart: [
      'Open the Markup Calculator and choose From markup, From margin, or Check price.',
      'Enter unit cost for one item. Include recurring per-item costs when they belong in the pricing decision.',
      'Enter markup, target margin, or selling price for the mode you chose, then add units for batch totals.',
      'Calculate, then compare selling price, profit per unit, markup, margin, revenue, and total profit.',
      'Test fees, discounts, returns, and real market prices separately before changing a live price.',
    ],
    featuredSections: [
      {
        title: 'Markup and margin use different starting numbers',
        paragraphs: [
          'Markup compares profit with cost. Margin compares profit with selling price. If an item costs $30 and sells for $45, the $15 profit is 50% of cost but only 33.33% of the selling price.',
          'That is why a 40% target margin needs more than a 40% markup. With a $75 cost, a 40% margin needs a $125 selling price, which is a 66.67% markup on cost.',
        ],
      },
      {
        title: 'Choose the mode that matches what you know',
        paragraphs: [
          'Use From markup when you know cost and the percent to add. Use From margin when you know cost and the share of the final price you want left as gross profit. Use Check price when you already know cost and selling price.',
          'The three modes answer different questions without mixing the denominators. Units only scale the per-item values into total cost, revenue, and profit.',
        ],
        links: [
          { href: '/tools/markup-calculator/', label: 'Open the three-mode Markup Calculator' },
          { href: '/tools/margin-calculator/', label: 'Compare broader revenue and cost totals' },
        ],
      },
      {
        title: 'What the price still leaves out',
        paragraphs: [
          'A mathematically correct price can still be a poor business price. Packaging, shipping, marketplace fees, payment fees, discounts, returns, waste, overhead, taxes, and customer demand can all change the real result.',
          'Put recurring per-item costs into unit cost when appropriate, then compare the answer with actual records and prices customers will accept. Keep sales tax separate when it is added after the product price.',
        ],
      },
    ],
    sidecarText:
      'Markup is profit compared with cost. Margin is profit compared with selling price. Use the mode that matches the number you already know, then check the real costs the formula cannot see.',
    summary: 'Calculate selling price from markup or target margin, then check profit, margin, and equivalent markup with worked examples.',
    purpose:
      'The Markup Calculator handles three one-item pricing jobs: add markup to cost, find the price required for a target margin, or measure markup and margin from a known cost and selling price.',
    enter: [
      'Choose From markup when you know the percent to add on top of cost.',
      'Choose From margin when you know the percent of the final price you want left after unit cost.',
      'Choose Check price when you already know both unit cost and selling price.',
      'Enter units if you want the page to total revenue, total cost, and total profit for a batch.',
    ],
    example: [
      'If an item costs $30 and you add a 50% markup, the markup amount is $15.',
      'The selling price is $45. If you sell 100 units, the total profit before fees or discounts is $1,500. The margin is 33.33%, because $15 profit is one-third of the final $45 price.',
      'For target-margin pricing, a $75 cost with a 40% target margin needs a $125 selling price. The $50 profit is 40% of price and 66.67% of cost.',
      'For a reverse check, a $30 cost and $45 selling price gives 50% markup and 33.33% margin. A price below cost produces negative markup, margin, and profit.',
    ],
    read: [
      'Selling price per unit is the price produced by markup or target-margin mode.',
      'Equivalent markup shows how a target margin compares with cost-based markup.',
      'Profit per unit is selling price minus cost.',
      'Margin on price shows profit as a percent of the final selling price.',
      'Total profit only makes sense if the unit count is close to what you can actually sell.',
    ],
    mistakes: [
      'Do not read markup percent as margin percent. They use different denominators.',
      'Do not enter a 40% target as 0.40. Enter 40 in a percent field.',
      'Do not ignore platform fees, shipping, packaging, returns, or discounts if they reduce profit.',
      'Do not assume a higher markup automatically means the market will pay that price.',
    ],
    next: ['Use Margin Calculator for broader revenue and cost totals.', 'Use Break Even Calculator to see how many units need to sell.', 'Use Sales Tax Calculator when tax is added after the selling price.'],
  },
  'profit-goal-calculator': {
    summary: 'Learn how many units or how much sales revenue you need to cover costs and still hit a target profit.',
    purpose:
      'The Profit Goal Calculator is break-even math with one extra job: add the profit you want before dividing by contribution margin.',
    enter: [
      'Enter fixed costs for the same project, month, event, or product batch you are planning.',
      'Enter target profit as a dollar amount, not a percent. This is the money you want left after fixed and variable costs.',
      'Enter price per unit and variable cost per unit so the calculator can find contribution margin.',
      'Keep taxes, owner pay, financing, marketing spend, refunds, discounts, shipping, payment fees, waste, and mixed-product averages separate unless they belong in the same planning period.',
    ],
    example: [
      'If fixed costs are $5,000 and target profit is $2,000, the total amount to cover is $7,000.',
      'With a $40 price and $18 variable cost, each unit contributes $22, so the goal needs about 318.18 units.',
      'If you sell whole items, round that to 319 units. At $40 each, the target is about $12,727.27 in sales before rounding.',
      'For an event with $900 fixed costs, a $750 profit goal, a $15 price, and $5.50 variable cost, contribution is $9.50 and the goal is about 173.68 sales.',
    ],
    read: [
      'Units needed for goal is the main sales target.',
      'Required sales converts those units into revenue at the price you entered.',
      'Contribution per unit shows why lowering cost or raising price changes the target quickly.',
      'The formula is target-profit units = fixed costs plus target profit, divided by contribution margin per unit.',
    ],
    mistakes: [
      'Do not forget that demand, capacity, and time can limit sales even if the math target looks possible.',
      'Do not enter the target profit as a percentage. It should be a dollar amount.',
      'Do not mix weekly sales goals with monthly fixed costs. The time period has to match.',
      'Do not use one average unit if your products have very different prices and costs without checking the sales mix.',
      'Do not treat target-profit math as cash-flow, tax, funding, or pricing advice.',
    ],
    next: ['Use Break Even Calculator for the zero-profit threshold.', 'Use Margin Calculator to review the profit percent from a known price.'],
  },
  'liquidity-ratios-calculator': {
    summary: 'Learn how current ratio, quick ratio, cash ratio, and working capital describe short-term payment strength.',
    purpose:
      'The Liquidity Ratios Calculator helps read the short-term part of a balance sheet. It checks whether current assets look large enough compared with bills due soon.',
    enter: [
      'Enter current assets and current liabilities from the same balance sheet date. Do not mix one month of assets with another month of bills.',
      'Enter inventory and prepaid expenses so the quick ratio can remove less-liquid current assets.',
      'Enter cash, marketable securities, and receivables so the cash ratio and supporting lines are easier to understand.',
    ],
    example: [
      'If current assets are $120,000 and current liabilities are $80,000, the current ratio is 1.50x and working capital is $40,000.',
      'If inventory is $25,000 and prepaid expenses are $5,000, quick assets are $90,000, so quick ratio is 1.13x.',
      'If cash is $30,000 and marketable securities are $10,000, cash ratio is 0.50x. That means only half of current liabilities are covered by cash-like assets right now.',
      'For an inventory-heavy shop with $200,000 current assets, $125,000 current liabilities, $90,000 inventory, and $8,000 prepaid expenses, the current ratio is 1.60x but quick ratio drops to 0.82x.',
    ],
    read: [
      'Current ratio compares all current assets with current liabilities.',
      'Quick ratio is stricter because it removes inventory and prepaid expenses.',
      'Cash ratio is the strictest of these because it looks only at cash and marketable securities.',
      'Working capital shows the dollar gap between current assets and current liabilities.',
    ],
    mistakes: [
      'Do not mix numbers from different dates without realizing the ratio can change.',
      'Do not assume receivables are as good as cash if customers pay late.',
      'Do not treat inventory as cash if it may sell slowly, need discounts, or become outdated.',
      'Do not judge the business from one ratio. Trend and industry context matter.',
      'Do not use this as a lender-covenant, solvency, tax, or investing decision by itself.',
    ],
    next: ['Use Debt Ratios Calculator to review debt exposure.', 'Use Profitability Ratios Calculator to see whether the business is earning enough profit.'],
  },
  'debt-ratios-calculator': {
    summary: 'Learn how debt ratio, debt-to-equity, and times interest earned describe debt load and interest cover.',
    purpose:
      'The Debt Ratios Calculator checks two balance sheet debt-load ratios and one income statement coverage ratio. It helps you see debt load without pretending one ratio tells the whole story.',
    enter: [
      'Enter total debt, total assets, and total equity from the same balance sheet date.',
      'Enter EBIT from the income statement as earnings before interest and tax.',
      'Enter interest expense for the same period as EBIT, not a different quarter or year.',
    ],
    example: [
      'With $220,000 debt and $500,000 assets, debt ratio is 44%.',
      'With $220,000 debt and $280,000 equity, debt-to-equity is about 0.79x.',
      'With $90,000 EBIT and $15,000 interest expense, times interest earned is 6x.',
    ],
    read: [
      'Debt ratio shows what percent of assets are funded by debt.',
      'Debt-to-equity compares debt with owner equity from the same statement date.',
      'Times interest earned shows how many times EBIT covers the interest expense entered.',
    ],
    mistakes: [
      'Do not compare debt ratios across industries as if every business should carry the same debt level.',
      'Do not forget leases, short-term debt, maturity dates, and covenant rules if you are doing a real analysis.',
      'Do not treat a good interest coverage ratio as proof that cash flow is healthy.',
    ],
    next: ['Use Liquidity Ratios Calculator for short-term payment strength.', 'Use Profitability Ratios Calculator to compare debt exposure with earnings.'],
  },
  'operations-ratios-calculator': {
    summary: 'Learn how inventory turnover, asset turnover, receivables turnover, collection days, and equity multiplier show how operations move.',
    purpose:
      'The Operations Ratios Calculator checks how inventory, assets, and credit sales move through a business. It helps you see operating speed without pretending one turnover ratio tells the whole story.',
    enter: [
      'Enter cost of goods sold plus beginning and ending inventory from the same period for inventory turnover.',
      'Enter net sales and average total assets from the same period for asset turnover.',
      'Enter net credit sales and average receivables from the same period for receivables turnover and collection days.',
      'Enter total assets and total equity from the same balance sheet date for the equity multiplier.',
    ],
    example: [
      'If COGS is $600,000 and average inventory is $100,000, inventory turnover is 6x.',
      'If net sales are $950,000 and average assets are $500,000, asset turnover is 1.90x.',
      'If credit sales are $700,000 and average receivables are $80,000, receivables turnover is 8.75x, or about 41.71 days.',
    ],
    read: [
      'Inventory turnover estimates how many times inventory is sold and replaced.',
      'Asset turnover compares sales with the average asset base.',
      'Average collection period estimates how long receivables take to collect.',
      'Equity multiplier compares total assets with total equity and belongs beside debt context, not by itself.',
    ],
    mistakes: [
      'Do not ignore seasonal timing. A year-end inventory snapshot can look very different before or after a busy season.',
      'Do not compare a retailer, software company, and manufacturer as if their operations should look the same.',
      'Do not use net sales and credit sales interchangeably unless that is truly how the business reports them.',
      'Do not treat high turnover as always good. It can also mean stockouts, strict credit terms, or too few assets for demand.',
    ],
    next: ['Use Profitability Ratios Calculator to connect operations with profit.', 'Use Liquidity Ratios Calculator to check short-term balance sheet strength.'],
  },
  'profitability-ratios-calculator': {
    summary: 'Learn how gross margin, operating margin, net margin, ROA, ROE, EPS, and P/E connect profit with statements, shares, and price.',
    purpose:
      'The Profitability Ratios Calculator checks profit from four angles: sales, assets, equity, and shares. It helps you see where profit looks strong before you ask why.',
    enter: [
      'Enter net sales, cost of goods sold, operating income, and net income from the same income statement period.',
      'Enter average assets and average equity for that same period.',
      'Enter shares outstanding and price per share if you want EPS and P/E context.',
    ],
    example: [
      'With $950,000 sales and $600,000 COGS, gross margin is 36.84%.',
      'With $180,000 operating income, operating margin is 18.95%.',
      'With $950,000 sales and $120,000 net income, net margin is 12.63%.',
      'With $120,000 net income and $500,000 average assets, ROA is 24%.',
      'With $120,000 net income and $260,000 average equity, ROE is 46.15%.',
      'With 100,000 shares and an $18 price, EPS is $1.20 and P/E is 15x.',
    ],
    read: [
      'Gross margin focuses on sales after product or service cost.',
      'Operating margin includes operating expenses but stops before some other income statement layers.',
      'Net margin shows final profit as a percent of sales.',
      'ROA and ROE compare profit with assets and equity.',
      'EPS and P/E connect profit to shares and price.',
    ],
    mistakes: [
      'Do not compare margins across industries as if every business model should look the same.',
      'Do not treat high ROE as automatically good if the company uses heavy debt or has a small equity base.',
      'Do not ignore one-time income, unusual costs, tax items, share dilution, or accounting changes.',
      'Do not read P/E as a recommendation. It is only price compared with the EPS entered.',
    ],
    next: ['Use Stock Ratios Calculator for per-share valuation ratios.', 'Use Debt Ratios Calculator to see whether debt is affecting returns.'],
  },
  'stock-ratios-calculator': {
    summary: 'Learn how P/E, price-to-sales, price-to-book, dividend yield, and payout ratio compare share price with per-share business numbers.',
    purpose:
      'The Stock Ratios Calculator keeps market ratios separate. It shows how price compares with EPS, sales, book value, and dividends before you decide what those clues might mean.',
    enter: [
      'Enter stock price as the share price you want to analyze.',
      'Enter EPS, sales per share, and book value per share from the same reporting context when possible.',
      'Enter annual dividend per share if the stock pays one, or 0 if it does not.',
    ],
    example: [
      'With an $18 price and $1.20 EPS, P/E is 15x.',
      'With $9.50 sales per share and $2.60 book value per share, P/S is 1.89x and P/B is 6.92x.',
      'With a $0.45 annual dividend, dividend yield is 2.5% and payout ratio is 37.5% of EPS.',
    ],
    read: [
      'P/E compares price with earnings per share.',
      'Price-to-sales and price-to-book compare price with sales per share and book value per share.',
      'Dividend yield compares dividend with price, while payout ratio compares dividend with earnings.',
    ],
    mistakes: [
      'Do not treat a low P/E as automatically cheap or a high P/E as automatically bad.',
      'Do not mix a current price with stale EPS, stale sales per share, or old book value after a split, buyback, or big balance sheet change.',
      'Do not trust a high dividend yield without checking whether the payout can survive.',
      'Do not use this as investment advice. Ratios are starting clues, not a full decision.',
    ],
    next: ['Use Profitability Ratios Calculator to understand the business behind the per-share numbers.', 'Use ROI Calculator for a simple return estimate.'],
  },
  'mortgage-calculator': {
    summary: 'Learn how to estimate a mortgage payment with principal, interest, taxes, insurance, PMI, and HOA costs.',
    purpose:
      'The Mortgage Calculator is for checking a home payment before the number turns into a big, blurry monthly bill. It separates principal and interest from property tax, insurance, PMI, and HOA costs so you can see what is actually driving the payment.',
    enter: [
      'Enter the home price and down payment as dollar amounts, not percentages.',
      'Use the loan rate and term you want to compare, such as 6.5% for 30 years.',
      'Add property tax per year, then monthly insurance, PMI, and HOA only when those costs apply.',
    ],
    example: [
      'For a $400,000 home with $80,000 down, the loan amount is $320,000.',
      'At 6.5% for 30 years, the principal and interest estimate is about $2,022.62 per month.',
      'With $4,800 yearly property tax, $140 monthly insurance, and a $75 HOA, the total monthly estimate is about $2,637.62.',
    ],
    read: [
      'Total monthly payment is the number to budget around, but principal and interest show the loan-only part.',
      'Loan-to-value helps you see how much of the home price is financed before you think about PMI.',
      'Total interest shows the long-term cost if the rate, term, and payment stay fixed.',
    ],
    mistakes: [
      'Do not treat this as a lender Loan Estimate or final approval.',
      'Do not enter annual insurance in a monthly insurance box.',
      'Do not forget closing costs, prepaid interest, escrow changes, points, PMI rules, and local tax changes.',
    ],
    next: ['Use Amortization Calculator to see the balance over time.', 'Use Down Payment Calculator to check cash needed at closing.', 'Use Interest Rate Calculator if you only know the payment quote.'],
  },
  'loan-calculator': {
    title: 'Loan Payment, Amount, Rate and Term Guide',
    metaDescription:
      'Calculate monthly payment, loan amount, interest rate, or payoff term for a fixed-rate loan, with total-interest checks and worked examples.',
    intro:
      'A loan calculator is more useful when it can solve the number you do not know. This guide shows how to find payment, principal, estimated rate, or payoff term without treating the result like a lender offer.',
    quickStart: [
      'Open the Loan Calculator and choose Payment, Loan amount, Rate, or Term.',
      'Enter the three loan values you know. Use dollars for amount and payment, a yearly percent for rate, and years for term.',
      'Calculate, then read the missing value with total paid and total interest.',
      'In Term mode, check the payoff months and smaller final payment. In Rate mode, remember the result is not APR.',
      'Compare the estimate with the written rate, APR, fees, payment schedule, and payoff terms before making a decision.',
    ],
    featuredSections: [
      {
        title: 'Choose the missing number before entering anything',
        paragraphs: [
          'Use Payment when you know principal, rate, and term. Use Loan amount when you know the monthly budget, rate, and term. Use Rate when a quote gives you principal, payment, and term. Use Term when you want to see how long one payment takes to clear the balance.',
          'Each mode uses the same fixed-rate idea from a different direction. Keeping the unknown separate prevents a monthly-payment question from being mistaken for an approval or affordability decision.',
        ],
        links: [
          { href: '/tools/loan-calculator/', label: 'Open the four-mode Loan Calculator' },
          { href: '/tools/amortization-calculator/', label: 'See a month-by-month balance schedule' },
        ],
      },
      {
        title: 'Four worked loan checks',
        paragraphs: [
          'Payment: $12,000 at 9.5% for 4 years is about $301.48 per month. Amount: $500 per month at 6% for 5 years supports about $25,862 in principal. Rate: $25,000 repaid at $483.32 per month for 5 years is about 6% annual interest before fees.',
          'Term: $12,000 at 9.5% with a $400 monthly payment takes about 35 months, with a smaller last payment. If a payment does not cover the first month of interest, the balance cannot reach zero in this fixed-payment model.',
        ],
      },
      {
        title: 'Interest rate, APR, and payoff amount are not the same',
        paragraphs: [
          'The rate solver estimates a nominal annual interest rate from the numbers entered. APR can include certain finance charges, so it may be higher. The tool cannot discover fees that are not entered.',
          'Term mode estimates payoff with monthly interest and payment timing. A lender payoff statement can include daily interest, a payoff date, fees, and different rounding. Use the calculator to check the math, then use the written disclosure for the decision.',
        ],
        links: [
          { href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-loan-interest-rate-and-the-apr-en-733/', label: 'CFPB explanation of loan interest rate and APR' },
        ],
      },
    ],
    sidecarText:
      'Pick the value you need to solve, enter the other three, then check total interest. Rate is not APR, loan amount is not approval, and the calculated term is not a lender payoff statement.',
    summary: 'Solve for payment, loan amount, estimated interest rate, or payoff term with fixed-rate examples and limits.',
    purpose:
      'The Loan Calculator handles four fixed-rate questions. It can solve for monthly payment, starting principal, estimated annual interest rate, or payoff time, then show the cost behind the result.',
    enter: [
      'Choose the mode that matches the value you do not know.',
      'Enter loan amount as starting principal before fees, and monthly payment as the regular amount paid each month.',
      'Enter the annual interest rate as a percent, such as 9.5 for 9.5%. Use the contract interest rate for payment math.',
      'Enter term in years. Four years means 48 monthly payments.',
    ],
    example: [
      'Payment mode: $12,000 at 9.5% for 4 years is about $301.48 per month, $14,470.93 total paid, and $2,470.93 total interest.',
      'Loan amount mode: $500 per month at 6% for 5 years supports about $25,862 in principal before fees or approval rules.',
      'Rate mode: $25,000 with a $483.32 monthly payment for 5 years gives an estimated annual interest rate of about 6%, not an APR.',
      'Term mode: $12,000 at 9.5% with $400 per month takes about 35 months and ends with a smaller final payment.',
    ],
    read: [
      'The main answer is the value selected by the mode: payment, amount, rate, or term.',
      'Total paid includes the modeled monthly payments and smaller final payment when term mode needs one.',
      'Total interest is modeled borrowing cost before fees, penalties, taxes, insurance, payment-date effects, or variable-rate changes.',
      'Loan amount is a math result, not an approval limit. Estimated rate is not APR. Payoff months are not an official payoff statement.',
    ],
    mistakes: [
      'Do not choose a mode for a number you already know. Choose the missing value.',
      'Do not compare two loans by payment alone if the terms are different.',
      'Do not use APR-with-fees as if it were always the contract interest rate used for payment math.',
      'Do not use a term-mode payment that is equal to or below the first month of interest.',
      'Do not ignore origination fees, finance charges, late fees, prepayment penalties, insurance, taxes, or disclosure terms that are not in the calculator.',
    ],
    next: ['Use Amortization Calculator to see the month-by-month balance.', 'Use Payment Calculator for a compact payment-only check.', 'Use APR Calculator when fees need to be part of a broader cost comparison.'],
  },
  'auto-loan-calculator': {
    summary: 'Estimate a car payment from vehicle price, sales tax, fees, down payment, trade-in value, rate, and term.',
    purpose:
      'The Auto Loan Calculator helps you test a car deal before you sit with a salesperson. It estimates the amount financed, monthly payment, total interest, and total paid from the numbers you enter.',
    enter: [
      'Enter the vehicle price after negotiation, before down payment, trade-in, tax, and fees.',
      'Enter down payment, trade-in value, estimated fees, sales tax rate, loan rate, and term.',
      'Use the same assumptions when comparing two loan offers so the monthly payment is not tricking you.',
    ],
    example: [
      'For a $32,000 vehicle with $4,000 down, $3,000 trade-in, $900 fees, 6% sales tax, and 7.2% for 5 years, the estimate is about $549.92 per month.',
      'That same example finances about $27,640 and pays about $5,355.02 in interest over the full term.',
      'A longer term can make the monthly payment easier while adding more interest, so compare total paid too.',
    ],
    read: [
      'Amount financed is the number the loan payment formula uses after tax, fees, down payment, and trade-in.',
      'Monthly payment is the estimated fixed payment before insurance, registration renewal, late fees, or optional add-ons.',
      'Total interest and total paid show why the cheapest-looking monthly payment is not always the cheapest deal.',
    ],
    mistakes: [
      'Do not forget registration, documentation, title, lender, warranty, gap, or service-contract fees.',
      'Do not assume every state taxes a trade-in the same way, and do not ignore negative equity from an old car.',
      'Do not choose a longer term only because the monthly payment looks easier. It can raise the total cost.',
      'Do not compare one offer using APR and another using interest rate unless you understand which fees are included.',
    ],
    next: ['Use Sales Tax Calculator to check tax on a purchase amount.', 'Use Loan Calculator to compare the auto loan with another fixed loan.', 'Use Cash Back or Low Interest Calculator if a dealer offers a rebate or special financing.'],
  },
  'interest-calculator': {
    summary: 'Compare simple interest and compound interest with real numbers, annual-rate checks, and clear limits.',
    purpose:
      'The Interest Calculator helps you compare two common interest jobs: simple interest based only on the original principal, and compound interest where interest gets added back to the balance.',
    enter: [
      'Choose Simple when the question is principal x annual interest rate x time.',
      'Choose Compound when interest is added back to the balance and can earn more interest later.',
      'Enter principal, annual interest rate, time in years, compounding frequency, and monthly deposits only where the selected mode asks for them.',
    ],
    example: [
      '$1,000 at 5% simple interest for 3 years earns $150 because 1000 x 0.05 x 3 equals 150, so the ending balance is $1,150.',
      '$2,500 at 5% for 8 years with quarterly compounding grows to about $3,720.33 before taxes, fees, or withdrawals.',
      '$1,000 plus $100 per month at 6% for 10 years grows to about $18,207.33, with $13,000 from deposits and about $5,207.33 from estimated interest.',
    ],
    read: [
      'Simple interest and compound interest are not the same formula, so do not compare them without checking the mode.',
      'In compound mode, total contributions are your deposits. Estimated interest is the growth above those deposits.',
      'Effective annual rate helps show how compounding changes the rate you actually model.',
    ],
    mistakes: [
      'Do not enter 0.05 when the field asks for 5%.',
      'Do not mix months and years. Use 1.5 for 18 months or 0.25 for 3 months.',
      'Do not treat annual interest rate, APR, and APY as the same thing.',
      'Do not use the compound result as a guaranteed investment return or official bank statement.',
    ],
    next: ['Use Simple Interest Calculator when you only need principal-rate-time math.', 'Use Compound Interest Calculator for more compounding controls.', 'Use Investment Calculator for recurring investing scenarios.', 'Use Interest Rate Calculator when the missing number is the rate.'],
  },
  'payment-calculator': {
    summary: 'Learn how to estimate a fixed monthly payment, total paid, and interest without falling for the lowest-payment trap.',
    purpose:
      'The Payment Calculator answers the first loan question: "What would I pay each month?" It is best when you already know the amount financed, interest rate, and term, and you want a quick fixed-rate estimate before reading the full offer.',
    enter: [
      'Enter the amount financed, not just the sticker price. If fees or add-ons are rolled into the loan, include them only when you want them in the estimate.',
      'Enter the annual interest rate as a percent. Do not swap in APR unless you mean to use an APR-style comparison.',
      'Enter the term in years. Longer terms usually make the monthly payment smaller, but the interest can grow.',
    ],
    example: [
      'A $5,000 loan at 8% for 3 years becomes 36 monthly payments of about $156.68.',
      'That means about $5,640.55 total paid and about $640.55 interest before fees, late charges, insurance, taxes, or lender rules.',
      'For a bigger rate check, $20,000 over 4 years is about $469.70/month at 6% and $497.70/month at 9%, so the higher rate adds about $28/month before any other costs.',
    ],
    read: [
      'Monthly payment is the fixed principal-and-interest estimate from the inputs you entered.',
      'Total paid is the payment multiplied by the number of months.',
      'Total interest is the extra amount above the financed balance. Compare that number before picking the lowest monthly payment.',
    ],
    mistakes: [
      'Do not use the result as a full mortgage payment. A real mortgage can include property tax, insurance, PMI, HOA fees, and escrow.',
      'Do not compare car loans by monthly payment alone. CFPB warns that amount financed, APR, interest rate, term, and total cost all matter.',
      'Do not treat interest rate and APR as the same thing. APR can include certain fees.',
      'Do not use this for interest-only, balloon, variable-rate, or student-loan repayment-plan decisions.',
    ],
    next: [
      'Use Loan Calculator when you want the broader loan estimate view.',
      'Use APR Calculator when fees change the real cost of the offer.',
      'Use Amortization Calculator if you want to see how the balance falls over time.',
      'Use Interest Rate Calculator if the rate is missing but you know the payment.',
    ],
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
    summary: 'Learn how starting money, monthly deposits, return, and time create an investment projection.',
    purpose:
      'The Investment Calculator estimates a future balance from starting money and monthly deposits. It is useful for comparing habits and assumptions, not choosing an investment.',
    enter: [
      'Enter the starting investment and monthly contribution.',
      'Enter an estimated annual return as a what-if percent.',
      'Enter the number of years you want to project.',
    ],
    example: [
      '$5,000 plus $250/month at 7% for 20 years is about $150,425.36.',
      'That example has $65,000 in contributions and about $85,425.36 in estimated growth.',
    ],
    read: [
      'Ending balance is the projection, not a guarantee.',
      'Total contributions show the money you put in.',
      'Estimated growth is the difference between ending balance and contributions.',
    ],
    mistakes: [
      'Do not ignore investment fees and taxes.',
      'Do not ignore inflation when the goal is years away.',
      'Do not assume a steady return happens every year.',
      'Do not choose investments based only on a calculator projection.',
    ],
    next: [
      'Use Compound Interest Calculator for compounding frequency.',
      'Use Inflation Calculator to test buying-power pressure.',
      'Use Retirement Calculator if you have a target amount.',
    ],
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
    summary: 'Learn how to use the finance calculator for a quick future-balance what-if check.',
    purpose:
      'The Finance Calculator is a what-if machine for money. It estimates a future balance from a starting amount, monthly deposit, estimated annual rate, and time.',
    enter: [
      'Enter the starting amount already in the account or plan.',
      'Enter the monthly amount you plan to add. Use 0 if there are no new deposits.',
      'Enter an estimated annual rate as a percent, then enter the number of years.',
    ],
    example: [
      '$2,000 plus $150/month at 5% for 8 years gives about $20,642.25.',
      'That result includes $16,400 you put in and about $4,242.25 from the rate assumption.',
    ],
    read: [
      'Ending balance is the main what-if result.',
      'Total contributions show the starting amount plus all monthly deposits.',
      'Estimated growth shows the part that came from the rate assumption.',
    ],
    mistakes: [
      'Do not use this for debt payoff without switching to a payment or loan calculator.',
      'Do not treat the return as guaranteed or smooth every year.',
      'Do not forget tax, fees, inflation, withdrawals, losses, and account rules.',
    ],
    next: [
      'Use Investment Calculator when the scenario is really about investing.',
      'Use Compound Interest Calculator when compounding frequency matters.',
      'Use Payment Calculator for fixed debt payments.',
    ],
  },
  'income-tax-calculator': {
    summary: 'Learn how a simplified 2026 U.S. federal ordinary income tax estimate works before you trust the number.',
    purpose:
      'The Income Tax Calculator estimates 2026 U.S. federal ordinary income tax. It applies the standard deduction or your custom deduction, runs the taxable income through 2026 brackets, then subtracts credits you enter.',
    enter: [
      'Choose filing status because the standard deduction and brackets depend on it.',
      'Enter gross ordinary income before deduction.',
      'Leave deduction blank for the 2026 standard deduction, or enter your own deduction and credits if you are testing a scenario.',
    ],
    example: [
      'For a single filer with $100,000 gross income, the calculator subtracts the $16,100 standard deduction and gets $83,900 taxable income.',
      'That taxable income is taxed in layers, so the estimate is about $13,170 before credits, not 22% of the whole $100,000.',
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
    summary: 'Learn how to find the annual interest rate from a loan amount, monthly payment, and term.',
    purpose:
      'The Interest Rate Calculator is for the moment when a quote shows the payment but not a clear rate. It works backward from amount financed, monthly payment, and term to estimate the annual rate before extra fees.',
    enter: [
      'Enter the amount financed, not the sticker price if fees or add-ons were already rolled in.',
      'Enter the fixed monthly loan payment. Leave out taxes, insurance, warranties, and add-ons if you only want the loan rate.',
      'Enter the repayment term in years so the calculator can turn it into monthly payments.',
    ],
    example: [
      '$25,000 principal, $483.32 monthly payment, and 5 years produces an estimated annual rate near 6%, about $3,999.20 interest, and $28,999.20 total paid.',
      '$30,000, $540 per month, and 6 years produces an estimated annual rate near 8.95%, about $8,880 interest, and $38,880 total paid.',
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
    next: ['Use Loan Calculator once you know the rate.', 'Use APR Calculator if fees are part of the quote.', 'Use Auto Loan Calculator if the quote includes vehicle tax and fees.'],
  },
  'sales-tax-calculator': {
    summary: 'Learn how to calculate sales tax, final total, and receipt rounding from price and rate.',
    purpose:
      'The Sales Tax Calculator is for quick receipt and checkout math. It does not look up rates. You bring the current local rate, then the calculator shows the tax amount and final total.',
    enter: [
      'Enter the before-tax price. If a discount already applies, use the discounted taxable price.',
      'Enter the sales tax rate as a percent, such as 7.5 for 7.5%. Do not type 0.075.',
      'Use a current combined state and local rate from checkout, a state tax page, or a trusted tax table.',
    ],
    example: [
      '$80 at 7.5% gives $6 tax because 80 x 0.075 equals 6.',
      'The total is $86 because subtotal plus tax equals final cost.',
      'A $1,200 item at 6.25% adds $75 tax, so the final total is $1,275 before any shipping or extra fees.',
    ],
    read: [
      'Tax amount is the added sales tax.',
      'Total is the final amount after tax.',
      'A manual rate keeps the tool fast, but the answer is only as good as the local rate and taxable subtotal you enter.',
    ],
    mistakes: [
      'Do not use the calculator as a local rate lookup.',
      'Do not forget exemptions, shipping rules, marketplace rules, or tax holidays.',
      'Do not enter 0.075 when the field asks for 7.5%.',
      'Do not use one purchase estimate as an official sales-tax filing or federal tax deduction answer.',
    ],
    next: ['Use Percent Off Calculator before tax when a sale price is involved.', 'Use Percentage Calculator to check rate math.', 'Use Auto Loan Calculator when vehicle price, tax, fees, and financing all matter.'],
  },
  'currency-calculator': {
    summary: 'Learn how to convert currency with a manual exchange rate, optional provider fee, and target-per-source checks.',
    purpose:
      'The Currency Calculator is for manual-rate conversions. It helps when you already have a rate from a bank, card, transfer service, cash desk, or rate table and want to see the converted amount before and after an optional percentage fee.',
    enter: [
      'Enter the amount you want to convert in the source currency, such as 500.',
      'Enter the exchange rate as target currency per 1 source currency, such as 0.92 when 1 source unit buys 0.92 target units.',
      'If your quote is written the other way around, invert it before entering the rate. A quote of 1 target unit = 0.80 source units becomes 1 / 0.80 = 1.25 target units per source unit.',
      'Enter a fee percent only if your bank, card, cash exchange desk, or transfer service charges one. Type 2.5 for 2.5%, not 0.025.',
      'Handle fixed transfer fees separately because this calculator only subtracts a percentage fee after conversion.',
    ],
    example: [
      'If you convert 100 at a rate of 1.25 with no fee, the before-fee and final result are both 125 target units.',
      'If you convert 500 at a rate of 0.92, the before-fee result is 460 target units because 500 x 0.92 = 460.',
      'With a 2.5% fee, the fee amount is 11.5 target units because 460 x 0.025 = 11.5.',
      'The final after-fee result is 448.5 target units because 460 - 11.5 = 448.5.',
    ],
    read: [
      'Converted amount is the final estimate after any percentage fee.',
      'Before fee shows the clean source amount times exchange rate calculation.',
      'Fee amount shows how much the optional percentage fee removed from the converted value.',
      'Rate used is the manual rate you entered, not a live bank, card, cash, or transfer-service quote fetched by the site.',
    ],
    mistakes: [
      'Do not use this as a live exchange-rate lookup.',
      'Do not enter the inverse rate unless you have intentionally converted the quote direction.',
      'Do not compare two providers unless you also compare spread, fixed fees, percentage fees, cash pickup fees, card fees, weekend markups, and rounding.',
      'Do not assume a mid-market rate from a search result is the rate your provider will actually give you.',
      'Do not use the result as an official tax, accounting, payroll, invoice, or customs exchange-rate record.',
      'Do not forget that card networks, banks, cash desks, and transfer services may use different rates at different timestamps.',
    ],
    next: [
      'Use Percentage Calculator if you need to compare provider fee percentages.',
      'Use Sales Tax Calculator when a purchase also needs local tax added after conversion.',
      'Use Finance Calculator for general money projections that are not exchange-rate conversions.',
      'Use the Currency Calculator again with the inverse rate only when you are converting in the opposite direction.',
    ],
  },
  'mortgage-payoff-calculator': {
    summary: 'Learn how extra monthly principal or a one-time payment can shorten an early mortgage payoff estimate.',
    purpose:
      'The Mortgage Payoff Calculator estimates how long a fixed-rate mortgage balance may take to pay off when you add extra principal payments. It is for planning before you request an official payoff amount from your lender or servicer.',
    enter: [
      'Enter the current principal balance, not the original home price.',
      'Enter the remaining term in years and the current fixed interest rate as a percent.',
      'Add extra monthly money only if you plan to tell the servicer to apply it to principal.',
      'Use the one-time payment field for extra principal paid now, not escrow or a normal monthly payment.',
    ],
    example: [
      'A $280,000 balance at 6.25% with 25 years left has a scheduled payment of about $1,847.07.',
      'Adding $200 per month makes the paid amount about $2,047.07 and estimates payoff in about 20 years.',
      'That example saves about 60 months and about $63,050.68 in interest compared with the scheduled path.',
    ],
    read: [
      'Payoff time is the estimated number of months until the balance reaches zero.',
      'Interest saved compares the extra-payment scenario with the scheduled payment.',
      'Months saved shows how much sooner the loan may be paid off.',
      'One-time payment shows the extra principal paid now before the calculator starts the payoff estimate.',
    ],
    mistakes: [
      'Do not use this as an official payoff statement or wire amount.',
      'Do not include escrow, tax, insurance, or regular monthly payment money as extra principal.',
      'Do not assume your lender or servicer applies every extra payment to principal without checking.',
      'Do not forget possible daily interest, unpaid fees, prepayment penalties, payoff statement timing, or recast rules.',
    ],
    next: ['Use Mortgage Calculator for the full monthly payment estimate.', 'Use Amortization Calculator to test extra payments on other fixed loans.', 'Use Interest Rate Calculator when the rate is the missing piece.'],
  },
  '401k-calculator': {
    summary: 'Learn how salary contributions, employer match, time, and return assumptions affect a 401K projection.',
    purpose:
      'The 401K Calculator projects a retirement account balance from current savings, salary contribution percent, employer match, time, and return assumption. It is built for scenario planning before you check payroll settings, IRS limits, and plan rules.',
    enter: [
      'Enter your current 401K balance and annual salary.',
      'Enter your contribution as a percent of salary, such as 8 for 8%.',
      'Enter employer match as a percent of your contribution and the salary percent where the match stops.',
      'Enter an estimated return and years to grow, knowing the return is only a what-if.',
    ],
    example: [
      'With $25,000 saved, a $75,000 salary, 8% contribution, 50% match up to 6%, and 7% for 25 years, your monthly contribution is $500.',
      'The employer match is $187.50 per month because the match applies to the first 6% of salary.',
      'The example projects about $700,059.74 before plan limits, fees, taxes, and real market changes.',
    ],
    read: [
      'Projected balance is the estimated future account value.',
      'Your monthly contribution and employer monthly match show the deposit split.',
      'Your total contributions and employer total match show how much money was deposited before estimated growth.',
      'The projection does not tell you whether contributions are inside current IRS or employer plan limits.',
    ],
    mistakes: [
      'Do not treat the result as guaranteed investment performance.',
      'Do not ignore vesting, fees, taxes, Roth/traditional choices, loans, or withdrawals.',
      'Do not rely on this tool to enforce IRS contribution limits or catch-up rules.',
      'Do not enter a match cap higher than your plan allows just because the estimate looks better.',
    ],
    next: ['Use Retirement Calculator for a broader savings target.', 'Use Investment Calculator for deposit-and-return scenarios.', 'Use Compound Interest Calculator to compare deposit and rate assumptions.'],
  },
  'house-affordability-calculator': {
    summary: 'Learn how income, debts, down payment, mortgage rate, property tax, insurance, HOA, and a debt-to-income target shape a home price estimate.',
    purpose:
      'The House Affordability Calculator estimates a possible home price from a monthly housing budget. It uses a debt-to-income target so you can see how existing debts and housing costs compete for the same gross monthly income.',
    enter: [
      'Enter annual gross income and existing monthly debts.',
      'Enter down payment, mortgage rate, and loan term.',
      'Enter estimated property tax percent, monthly insurance, and HOA so the monthly payment is not principal and interest only.',
    ],
    example: [
      'With $110,000 income, $450 monthly debts, $60,000 down, 6.5% for 30 years, 36% DTI, 1.2% property tax, and $140 insurance, the estimated home price is about $421,988.22.',
      'The example leaves about $2,850 for housing after existing debts, with about $2,288.01 for principal and interest and about $561.99 for tax, insurance, and HOA.',
    ],
    read: [
      'Affordable home price is the highest estimate that fits the selected monthly target.',
      'Loan amount is home price minus down payment.',
      'Monthly housing budget is what remains after the debt-to-income target and existing debts.',
      'Tax, insurance, and HOA reduce the room left for principal and interest.',
    ],
    mistakes: [
      'Do not treat this as mortgage approval.',
      'Do not leave out HOA, insurance, or tax if they apply.',
      'Do not forget closing costs, emergency savings, repairs, utilities, credit requirements, and lender rules.',
    ],
    next: ['Use Mortgage Calculator to inspect the monthly payment.', 'Use Down Payment Calculator to test cash needed at closing.', 'Use Mortgage Payoff Calculator later when comparing extra principal payments.'],
  },
  'savings-calculator': {
    summary: 'Learn how current savings, monthly deposits, rate, and time affect a savings goal.',
    purpose:
      'The Savings Calculator projects a future balance and compares it with a target. It is useful for emergency funds, travel, car cash, wedding money, down payments, and other goals that need steady deposits.',
    enter: [
      'Enter current savings and the monthly amount you plan to deposit.',
      'Enter an estimated annual rate as a percent, such as 4 for 4%.',
      'Enter the time horizon and optional target amount.',
    ],
    example: [
      '$2,500 saved plus $300 per month at 4% for 5 years gives about $22,942.18.',
      'Against a $25,000 target, the plan is still about $2,057.82 short.',
    ],
    read: [
      'Projected balance is the estimate at the end of the time period.',
      'Total deposits shows your starting money plus monthly deposits.',
      'Estimated interest shows the part from the rate.',
      'Target gap tells you whether the plan is still short or already over the goal.',
    ],
    mistakes: [
      'Do not assume the rate will stay fixed unless your account guarantees it.',
      'Do not forget taxes, bank fees, withdrawals, minimum balances, or changed deposit habits.',
      'Do not treat APY, interest rate, and exact bank statement math as the same thing.',
      'Do not compare savings and investments as if their risk is the same.',
    ],
    next: ['Use Compound Interest Calculator for compounding frequency controls.', 'Use Budget Calculator to see whether the monthly deposit fits.', 'Use Investment Calculator for longer risk-based growth scenarios.'],
  },
  'apy-calculator': {
    summary: 'Learn how a stated deposit rate and compounding frequency become an estimated annual percentage yield.',
    purpose:
      'The APY Calculator turns a stated annual interest rate into estimated annual percentage yield, then shows rough interest and ending balance for the term days you enter. It is useful when a savings account, money market account, or CD offer talks about rate and APY separately.',
    enter: [
      'Enter the starting deposit you want to estimate.',
      'Enter the stated annual interest rate as a percent, such as 4 for 4%.',
      'Choose how often interest compounds, such as monthly or daily.',
      'Enter 365 days for a one-year APY comparison, or a shorter term for a rough interest estimate.',
    ],
    example: [
      '$1,000 at a 4% stated annual interest rate with monthly compounding gives about 4.074% APY.',
      'For 365 days, that same example estimates about $40.74 interest and a $1,040.74 ending balance.',
    ],
    read: [
      'Estimated APY is the one-year yield from the rate and compounding frequency.',
      'Estimated interest for term shows the rough dollar interest for the days entered.',
      'Ending balance estimate adds that interest to the starting deposit.',
    ],
    mistakes: [
      'Do not enter 0.04 when the field asks for 4%.',
      'Do not compare a stated interest rate from one account with APY from another account as if they are the same number.',
      'Do not ignore fees, minimum balances, bonuses, balance tiers, taxes, penalties, or account-specific disclosure rules.',
    ],
    next: ['Use Savings Calculator to add monthly deposits and a target.', 'Use CD Calculator when the bank already gives APY and a CD term.', 'Use Compound Interest Calculator for wider compounding scenarios.'],
  },
  'rent-calculator': {
    summary: 'Learn how to estimate a rent ceiling from income, debts, utilities, and a rent target.',
    purpose:
      'The Rent Calculator turns one income number into a rent ceiling you can compare with real listings. It starts with a rent target, then subtracts debts and utilities so the answer is not just a loose 30% rule.',
    enter: [
      'Enter monthly income. Use gross income for a rough landlord-style check, or take-home pay for a safer personal budget.',
      'Enter a rent target such as 25, 30, or 35 percent.',
      'Enter monthly debt payments and utilities that are not already included in rent.',
    ],
    example: [
      '$5,200 monthly income at a 30% target starts with $1,560 for rent.',
      'After $350 in debts and $180 in utilities, the estimated max rent is $1,030.',
      'That equals $12,360 per year and leaves $3,640 before groceries, transport, savings, and other bills.',
    ],
    read: [
      'Max rent is the monthly ceiling after debts and utilities.',
      'Annual rent multiplies the monthly ceiling by 12 so yearly cost is visible.',
      'Income left after rent, debts, and utilities shows breathing room before the rest of life.',
    ],
    mistakes: [
      'Do not use a rent percentage that ignores debt, transport, food, medical costs, savings, or childcare.',
      'Do not forget deposits, application fees, renters insurance, parking, pet fees, internet, or moving costs.',
      'Do not treat this as landlord approval, a lease promise, or a local rent limit.',
    ],
    next: ['Use Salary Calculator to convert annual salary into monthly income.', 'Use Budget Calculator to test the rest of the month.', 'Use Percentage Calculator to compare 25%, 30%, and 35% targets.'],
  },
  'annuity-calculator': {
    summary: 'Learn how payment amount, rate, years, frequency, and timing change annuity future value and present value.',
    purpose:
      'The Annuity Calculator is for clean fixed-payment math. It estimates future value and present value from one repeated payment, then lets you compare ordinary timing with annuity-due timing before you look at any real contract.',
    enter: [
      'Enter the fixed payment made each period, such as $500 each month.',
      'Enter the annual rate, number of years, and payments per year.',
      'Choose end-of-period timing for an ordinary annuity or beginning-of-period timing for an annuity due.',
    ],
    example: [
      '$500 per month for 20 years means 240 payments and $120,000 paid in.',
      'At 5%, the ordinary annuity estimate is about $205,516.83 future value and $75,762.66 present value.',
      'Switching to beginning-of-period timing raises the estimate because each payment gets one extra period in the formula.',
    ],
    read: [
      'Future value is the estimated ending value of the payment stream.',
      'Present value is what that same stream is worth today using the rate you entered.',
      'Total payments shows only the money paid in, so it is useful for checking how much of the future value comes from the rate assumption.',
    ],
    mistakes: [
      'Do not treat this as an insurance annuity quote, lifetime-income promise, or tax answer.',
      'Do not ignore fees, surrender charges, riders, guarantees, inflation adjustments, mortality assumptions, or contract rules.',
      'Do not mix monthly payments with annual payments without changing payments per year.',
    ],
    next: ['Use Investment Calculator for contribution growth.', 'Use Retirement Calculator for broader retirement savings scenarios.', 'Use Annuity Payout Calculator when you already have a balance and want an estimated payout.'],
  },
  'credit-card-calculator': {
    summary: 'Learn how balance, APR, monthly payment, and new card spending affect payoff time and interest.',
    purpose:
      'The Credit Card Calculator is for one-card payoff math. It estimates payoff months, interest, total paid, and final payment from the balance, APR, payment you can send each month, and any new card spending.',
    enter: [
      'Enter the current credit card balance you are carrying now.',
      'Enter APR as a percent, such as 22.9 for 22.9%.',
      'Enter the payment you can send each month and any new card spending you expect to keep adding.',
    ],
    example: [
      'A $4,500 balance at 22.9% APR with a $250 monthly payment estimates about 23 months.',
      'That same example estimates about $1,065.99 in interest, $5,565.99 total paid, and a final payment of about $65.99.',
      'Increasing the payment to $350 cuts the estimate to about 15 months and about $712.51 interest.',
    ],
    read: [
      'Payoff time is the estimated number of months until the balance reaches zero.',
      'Total interest shows estimated interest paid during payoff.',
      'Total paid is what you send across the whole payoff plan, and final payment may be smaller than the normal monthly payment.',
    ],
    mistakes: [
      'Do not keep adding new charges if your goal is fast payoff.',
      'Do not assume this matches the issuer daily-balance method, payment allocation, or minimum-payment warning exactly.',
      'Do not ignore late fees, annual fees, cash advances, balance transfers, deferred interest, promotional APRs, or variable APR changes.',
    ],
    next: ['Use Interest Calculator to understand APR math.', 'Use Payment Calculator for fixed-payment debt comparisons.', 'Use Credit Cards Payoff Calculator when you want a combined multi-card estimate.'],
  },
  'pension-calculator': {
    summary: 'Learn how final average salary, credited service, and a plan multiplier create a defined-benefit pension estimate.',
    purpose:
      'Use the Pension Calculator when you know the salary number, credited service years, and multiplier a defined-benefit formula should test. It gives a rough annual and monthly estimate, not an official benefit statement.',
    enter: [
      'Enter the final average salary or plan salary as a yearly dollar amount.',
      'Enter credited years of service, using decimals only if your plan counts partial years that way.',
      'Enter the plan multiplier as a percent, such as 1.6 for a 1.6% multiplier.',
    ],
    example: [
      '$82,000 final average salary x 27 service years x 1.6% gives a $35,424 annual estimate.',
      'Dividing $35,424 by 12 gives a $2,952 monthly estimate before taxes, survivor choices, or plan adjustments.',
    ],
    read: [
      'Annual pension is the main estimate from the simple salary-service formula.',
      'Monthly pension divides the annual amount by 12.',
      'Replacement rate shows the annual estimate as a percent of final average salary.',
    ],
    mistakes: [
      'Do not treat this as your official pension benefit.',
      'Do not ignore vesting, service-credit rules, early retirement reductions, survivor choices, cost-of-living adjustments, lump-sum choices, PBGC limits, or taxes.',
      'Do not use a multiplier from another plan unless your own plan document uses the same rule.',
    ],
    next: ['Use Retirement Calculator for broader savings planning.', 'Use 401K Calculator for contribution-account growth.', 'Use Annuity Payout Calculator to compare fixed payout math.'],
  },
  'annuity-payout-calculator': {
    summary: 'Learn how starting balance, rate assumption, payout term, and payment frequency affect a fixed-term annuity payout estimate.',
    purpose:
      'Use the Annuity Payout Calculator when you want to spread one balance across a fixed number of payments. It is useful for clean payout math, but it is not an insurance-company quote or a guaranteed lifetime income promise.',
    enter: [
      'Enter the starting balance or lump sum you want to spread across fixed payments.',
      'Enter the annual rate assumption as a percent and the fixed payout term in years.',
      'Enter payments per year, such as 12 for monthly payments or 1 for annual payments.',
    ],
    example: [
      '$100,000 at 5% over 20 years with monthly payments means 240 payments.',
      'The estimate is about $659.96 per month, about $158,389.38 total paid, and about $58,389.38 estimated interest.',
    ],
    read: [
      'Payment amount is the estimated payout for each selected period.',
      'Total paid out is payment amount times payment count.',
      'Estimated interest is total paid out minus the starting balance.',
    ],
    mistakes: [
      'Do not treat this fixed-term estimate as a lifetime annuity guarantee.',
      'Do not ignore fees, surrender charges, taxes, contract riders, inflation, market value adjustments, or insurer pricing.',
      'Do not enter annual payments while thinking the result is monthly.',
    ],
    next: ['Use Annuity Calculator for present value and future value of payments.', 'Use Retirement Calculator for a wider retirement scenario.', 'Use Investment Calculator when the balance is still growing.'],
  },
  'credit-cards-payoff-calculator': {
    summary: 'Learn how combined card balance, weighted APR, regular payment, and extra payment affect payoff months, interest, and total paid.',
    purpose:
      'Use the Credit Cards Payoff Calculator when you want one rough payoff picture for several cards. It works best when you know the combined balance, a weighted average APR, the regular payment, and the extra amount you can keep adding.',
    enter: [
      'Add the card balances together and enter the combined balance.',
      'Enter a weighted average APR if the cards have different rates, giving more weight to larger balances.',
      'Enter the regular monthly card payment and any extra monthly amount you can keep adding.',
    ],
    example: [
      '$8,500 at 21.5% weighted APR with a $350 regular payment plus $100 extra is treated as one combined balance.',
      'The estimate is 24 months, about $1,969.83 interest, about $10,469.83 total paid, and a final payment near $119.83.',
    ],
    read: [
      'Payoff months estimates how long the combined balance may take to reach zero.',
      'Total interest shows the estimated interest cost during payoff.',
      'Total paid is balance plus estimated interest, and final payment may be lower than the normal monthly payment.',
    ],
    mistakes: [
      'Do not use this as a full avalanche or snowball plan.',
      'Do not forget separate APR tiers, payment allocation, balance-transfer fees, promotional rates, late fees, cash advances, deferred interest, and new purchases.',
      'Do not enter a payment that is lower than the monthly interest on the balance.',
    ],
    next: ['Use Credit Card Calculator for a single-card payoff.', 'Use Debt Payoff Calculator for a plain fixed-balance payoff.', 'Use Debt Consolidation Calculator to compare a new loan offer.'],
  },
  'debt-payoff-calculator': {
    summary: 'Learn how a fixed debt balance, interest rate, regular payment, and extra payment affect payoff months and interest.',
    purpose:
      'The Debt Payoff Calculator is for one debt balance at one rate. It is useful when you want to test whether a realistic extra payment can shorten payoff time and reduce interest before you call a creditor or compare another plan.',
    enter: [
      'Enter the current debt balance you want to pay down.',
      'Enter the annual interest rate or APR as a percent, such as 12 for 12%.',
      'Enter your regular monthly payment and any extra payment you can keep adding without missing other required bills.',
    ],
    example: [
      '$10,000 at 12% with a $300 regular payment plus $100 extra means $400 goes toward the balance each month after interest is added.',
      'The estimate is 29 months, about $1,564.88 interest, about $11,564.88 total paid, and a final payment near $364.88.',
    ],
    read: [
      'Payoff months is the estimated number of months until the balance reaches zero.',
      'Total interest is the estimated interest paid along the way.',
      'Final payment shows the last smaller payment if the balance ends before a full payment is needed.',
    ],
    mistakes: [
      'Do not treat this as an avalanche or snowball plan. It does not rank several debts.',
      'Do not ignore fees, penalties, settlement terms, debt collector notices, court deadlines, or creditor agreements.',
      'Do not use this as legal advice if a debt is in collections or court.',
      'Do not forget that variable rates can change the real payoff path.',
    ],
    next: ['Use Repayment Calculator for a general balance estimate.', 'Use Debt Consolidation Calculator before comparing a new loan.', 'Use Credit Cards Payoff Calculator for a combined-card shortcut.'],
  },
  'debt-consolidation-calculator': {
    summary: 'Learn how to compare your current payoff path with a consolidation loan offer before the lower payment distracts you.',
    purpose:
      'The Debt Consolidation Calculator compares two paths: keep paying the current debts or roll them into a new fixed-payment loan. It helps show when a lower monthly payment is real savings and when it is just a longer debt path.',
    enter: [
      'Enter the total debt you would actually consolidate.',
      'Enter the current weighted average APR and the total monthly payment you already make.',
      'Enter the new loan APR, term, and any fees that would be added to the new balance.',
    ],
    example: [
      '$18,000 of debt at 18% with a $650 current payment is compared with a new 10.5% loan for 3 years plus a $300 fee.',
      'The estimate is a $594.79 new payment, about $55.21 less per month, and about $2,023.05 lower total cost.',
    ],
    read: [
      'New payment is the estimated monthly payment on the consolidation loan.',
      'Monthly payment change shows whether the new payment is higher or lower than the current payment.',
      'Total cost change shows whether the new path costs more or less overall after the fee and term are included.',
    ],
    mistakes: [
      'Do not choose a consolidation option by monthly payment alone.',
      'Do not forget origination fees, balance transfer rules, teaser rates, credit impact, hardship plans, settlement offers, or home-equity risk.',
      'Do not assume approval, the advertised rate, or a debt-relief company promise is guaranteed.',
    ],
    next: ['Use Debt Payoff Calculator to test the current path with extra payments.', 'Use Credit Cards Payoff Calculator before rolling several cards into one shortcut.', 'Use Loan Calculator to inspect the new loan payment by itself.'],
  },
  'repayment-calculator': {
    summary: 'Learn how one balance, an annual rate, a regular payment, and an extra payment change payoff time and interest.',
    purpose:
      'The Repayment Calculator is for one fixed balance at one rate. It is useful when you want to see whether a monthly payment is actually shrinking the balance and how much time or interest an extra payment may save.',
    enter: [
      'Enter the current balance still owed today.',
      'Enter the annual interest rate or APR as a percent, such as 8 for 8%.',
      'Enter the regular monthly payment and any extra amount you can keep adding.',
    ],
    example: [
      '$12,000 at 8% with a $300 regular payment plus $50 extra means $350 goes toward the balance each month after interest is added.',
      'The estimate is 40 months, about $1,669.76 interest, about $13,669.76 total paid, and a final payment near $19.76.',
      'Without the extra $50, the same example estimates 47 months and about $2,003.66 interest.',
    ],
    read: [
      'Payoff months is the estimated time until the balance reaches zero.',
      'Total interest shows the estimated interest cost during repayment.',
      'Total paid is balance plus interest, and final payment may be smaller than the usual monthly payment.',
    ],
    mistakes: [
      'Do not treat this as an official federal student loan repayment plan or lender payoff quote.',
      'Do not ignore fees, late charges, deferment, forbearance, income-driven plans, minimum-payment changes, or changing rates.',
      'Do not enter annual payment amounts in monthly payment fields.',
    ],
    next: ['Use Payment Calculator if you know the term and want the payment.', 'Use Debt Payoff Calculator for debt-specific payoff language.', 'Use Student Loan Calculator before comparing standard student-loan payment examples.'],
  },
  'student-loan-calculator': {
    summary: 'Learn how balance, rate, term, and extra monthly payment affect a standard student loan payment and payoff estimate.',
    purpose:
      'The Student Loan Calculator estimates one standard fixed-payment student loan path. It helps you see the payment math before you compare official Federal Student Aid or servicer options.',
    enter: [
      'Enter the current loan balance, not the original amount if you have already paid some down.',
      'Enter the annual interest rate from StudentAid.gov, your servicer, or your private-loan agreement.',
      'Enter the standard repayment term in years, such as 10 years for a simple standard-plan comparison.',
      'Enter extra monthly payment only if you can really send that extra money every month.',
    ],
    example: [
      '$30,000 at 6.5% for 10 years creates a scheduled payment near $340.64.',
      'Adding $50 extra per month makes the simulated payment about $390.64, pays the loan off in about 100 months, and saves about $1,985.10 in interest.',
    ],
    read: [
      'Scheduled payment is the estimated fixed payment before any extra amount.',
      'Monthly paid with extra shows the scheduled payment plus the extra monthly amount.',
      'Payoff time shows how long the extra-payment path may take.',
      'Interest saved compares the extra-payment path with the standard scheduled path.',
    ],
    mistakes: [
      'Do not treat this as an income-driven repayment, forgiveness, deferment, forbearance, consolidation, refinance, or servicer quote.',
      'Do not ignore capitalization, subsidies, fees, payment pauses, auto-pay discounts, variable rates, or federal program rules.',
      'Do not assume extra payments are handled the same way by every servicer or private lender.',
    ],
    next: [
      'Use Loan Calculator for a plain fixed loan payment.',
      'Use Repayment Calculator for a general balance payoff estimate.',
      'Use Amortization Calculator if you want a fuller payment schedule.',
    ],
  },
  'college-cost-calculator': {
    summary: 'Learn how today\'s college cost, yearly increases, savings, and aid limits shape a future college gap estimate.',
    purpose:
      'The College Cost Calculator projects one future school plan from today\'s annual cost, a yearly cost increase, savings, and monthly deposits. It is a planning number to use before checking each school\'s official net price calculator, College Scorecard data, FAFSA results, and aid offer.',
    enter: [
      'Enter a full current annual cost for one school year: tuition, fees, housing, meals, books, supplies, transportation, and personal costs if you have them.',
      'Enter years until school starts, years in school, and an annual cost increase you want to test.',
      'Enter current savings, monthly savings, and estimated savings return if you want to compare the cost with money available at the start date.',
    ],
    example: [
      '$28,000 today, 8 years until start, 4 school years, and 4% cost growth gives a first-year estimate near $38,319.93.',
      'The same starter example estimates about $162,724.22 total cost, $44,340.98 projected savings, and a $118,383.23 savings gap.',
      'That gap is before scholarships, grants, financial aid offers, work-study, loans, family payments during school, or choosing a cheaper school.',
    ],
    read: [
      'Total estimated cost is the projected cost for all school years entered.',
      'First year estimate shows the projected cost of the first school year.',
      'Projected savings shows what the savings side may reach by the start date.',
      'Savings gap or surplus compares projected savings with estimated total cost, but it is not the same as net price after aid.',
    ],
    mistakes: [
      'Do not treat this as a school financial aid offer, official net price calculator, FAFSA result, or loan recommendation.',
      'Do not enter tuition only if you really need total cost of attendance. Fees, housing, meals, books, supplies, transportation, and personal costs can be large.',
      'Do not use one national cost increase assumption for every school without checking the school\'s published costs and College Scorecard or College Navigator data.',
      'Do not forget that some aid renews each year and some does not.',
    ],
    next: [
      'Use Savings Calculator to adjust monthly savings.',
      'Use Student Loan Calculator to inspect a possible loan payment.',
      'Use Compound Interest Calculator if you want to isolate the savings-growth side.',
    ],
  },
  'simple-interest-calculator': {
    summary: 'Learn how principal, annual interest rate, and time create a simple interest result.',
    purpose:
      'The Simple Interest Calculator uses the basic principal x annual interest rate x time formula. It is useful for classwork, quick checks, and examples where interest does not earn more interest.',
    enter: [
      'Enter principal as the starting dollar amount.',
      'Enter the annual interest rate as a percent, such as 5 for 5%.',
      'Enter time in years. Use 1.5 for 18 months or 0.25 for 3 months.',
    ],
    example: [
      '$1,000 at 5% for 3 years gives $1,000 x 0.05 x 3 = $150 interest.',
      'The ending balance is principal plus interest, so $1,000 plus $150 equals $1,150.',
      '$2,500 at 6.25% for 1.5 years gives $234.38 interest and a $2,734.38 ending balance.',
    ],
    read: [
      'Simple interest is the amount earned or charged before compounding, payment schedules, fees, or daily balance rules.',
      'Ending balance is principal plus simple interest.',
      'Time is the number of years used in the multiplication.',
    ],
    mistakes: [
      'Do not use simple interest when the account or loan compounds.',
      'Do not enter 5% as 0.05 in the percent field.',
      'Do not treat the result as APR, an amortized loan payment, a lender payoff quote, or a bank disclosure.',
      'Do not forget fees, taxes, payment schedules, day-count rules, and changing rates.',
    ],
    next: [
      'Use Compound Interest Calculator when interest earns interest.',
      'Use Interest Calculator to compare simple and compound modes.',
      'Use Loan Calculator when payments and payoff schedules matter.',
    ],
  },
  'cd-calculator': {
    summary: 'Estimate CD maturity value, interest earned, and early-withdrawal penalty what-if from APY and term.',
    purpose:
      'The CD Calculator estimates maturity value from deposit amount, APY, and term. It also separates the normal maturity estimate from a rough early-withdrawal penalty scenario.',
    enter: [
      'Enter the deposit amount from the CD offer.',
      'Enter the APY as a normal percent, such as 4.25 for 4.25%.',
      'Enter the CD term in whole months.',
      'Enter penalty months only as a rough what-if after reading the bank or credit union disclosure.',
    ],
    example: [
      '$10,000 at 4.25% APY for 12 months estimates a $10,425 maturity value and $425 interest earned.',
      'A 3-month penalty estimate subtracts about $106.25, leaving about $10,318.75 after penalty.',
      '$5,000 at 3.9% APY for 6 months estimates about $96.57 interest before any penalty.',
    ],
    read: [
      'Maturity value is the estimated value at the end of the term.',
      'Interest earned is maturity value minus the starting deposit.',
      'Value after penalty is only a rough what-if for early withdrawal, not a promised payout.',
    ],
    mistakes: [
      'Do not use this instead of the bank or credit union disclosure.',
      'Do not treat APY, interest rate, and bonus offers as the same thing.',
      'Do not forget renewal rules, grace periods, exact compounding, call features, brokered CDs, minimum balances, taxes, or early withdrawal terms.',
      'Do not assume every CD is FDIC- or NCUA-insured without checking the institution and account limits.',
    ],
    next: ['Use Savings Calculator for flexible deposits.', 'Use Compound Interest Calculator for compounding-frequency comparisons.', 'Use Interest Calculator when you need to compare simple and compound interest.'],
  },
  'bond-calculator': {
    summary: 'Learn how face value, market price, coupon rate, and maturity affect coupon income, current yield, and rough YTM.',
    purpose:
      'The Bond Calculator estimates annual coupon income, current yield, and a rough yield to maturity. It is for plain bond math, not an exact broker quote or a TreasuryDirect savings bond lookup.',
    enter: [
      'Enter face value, also called par value, and the current market price you want to test.',
      'Enter the annual coupon rate as a normal percent and the years to maturity.',
      'Enter coupon payments per year, such as 2 for semiannual coupons.',
    ],
    example: [
      'A $1,000 face value bond at a $950 market price with a 5% coupon pays $50 per year in coupon income.',
      'Because the market price is below face value, the rough YTM includes coupon income plus the $50 gain toward face value over 10 years, giving about 5.64%.',
      'A premium bond works the other way: a $1,050 price with a $1,000 face value lowers the rough YTM because some money is lost back to par at maturity.',
    ],
    read: [
      'Annual coupon is face value times coupon rate.',
      'Current yield compares annual coupon with market price.',
      'Rough yield to maturity is a shortcut, not a precise present-value yield calculation.',
    ],
    mistakes: [
      'Do not use this as an official savings bond calculator. EE and I savings bonds need TreasuryDirect issue-date and redemption rules.',
      'Do not use this for callable, floating-rate, inflation-linked, zero-coupon, municipal, or complex bonds without deeper pricing.',
      'Do not ignore accrued interest, dirty price, taxes, fees, reinvestment risk, duration, credit risk, liquidity, or changing market rates.',
      'Do not treat rough YTM as a guaranteed return.',
    ],
    next: ['Use Investment Calculator for broad growth scenarios.', 'Use Mutual Fund Calculator for fund-style projections.', 'Use Simple Interest Calculator when you only need coupon-style interest math.'],
  },
  'mutual-fund-calculator': {
    summary: 'Learn how starting investment, monthly contributions, expected return, expense ratio, and time affect a mutual fund projection.',
    purpose:
      'The Mutual Fund Calculator projects a hypothetical balance before and after a simple expense-ratio adjustment. It helps explain fee drag and contribution math, not predict actual fund performance or pick a fund.',
    enter: [
      'Enter the starting investment, which can work like a lump-sum starting amount.',
      'Enter the monthly contribution you want to keep adding.',
      'Enter expected annual return before expenses as a percent, then enter the annual expense ratio, such as 0.5 for 0.5%.',
      'Enter years invested. Longer periods make fee drag easier to see.',
    ],
    example: [
      '$5,000 plus $250 per month at 7% for 20 years gives about $150,425.36 before expenses.',
      'A 0.5% expense ratio lowers the simple net return to 6.5%, giving about $140,887.47 after expenses.',
      'That leaves about $9,537.89 of estimated expense drag in this simple model.',
    ],
    read: [
      'Projected fund balance after expenses is the main estimate.',
      'Read the balance before expenses as the same projection without the expense-ratio adjustment.',
      'Estimated expense drag is the difference between those two projections.',
      'Total contributions shows the money you put in before any market growth is counted.',
    ],
    mistakes: [
      'Do not treat an estimated return as a promise.',
      'Do not treat this as a NAV, share-price, or fund-performance lookup.',
      'Do not forget taxes, dividend and capital-gain distributions, front-end loads, back-end loads, redemption fees, 12b-1 fees, changing expenses, or market losses.',
      'Do not compare funds by expense ratio alone without checking risk, holdings, investment objective, share class, and the prospectus.',
    ],
    next: ['Use Investment Calculator for a simpler growth model.', 'Use Compound Interest Calculator to test compounding without fund fees.', 'Use Bond Calculator for fixed-income basics.'],
  },
  'roth-ira-calculator': {
    summary: 'Learn how current balance, annual contribution, expected return, and years to grow affect a Roth IRA projection before you check 2026 IRS rules.',
    purpose:
      'The Roth IRA Calculator projects growth using monthly compounding and monthly contribution timing. It is a retirement savings scenario tool, not an eligibility, MAGI, or tax calculator.',
    enter: [
      'Enter the current Roth IRA balance already in the account.',
      'Enter annual contribution. For 2026, the general IRA limit is $7,500, or $8,600 if age 50+ because of the $1,100 catch-up amount, but the calculator does not enforce those rules.',
      'Enter expected annual return and years to grow.',
      'Check MAGI and filing status separately before treating the contribution as allowed.',
    ],
    example: [
      '$12,000 starting balance plus $7,500 per year is converted into $625 monthly deposits for the projection.',
      'At 7% for 25 years, the result is about $574,999.83, with $199,500 counted as total contributions and about $375,499.83 as estimated growth.',
      '$100 a month is entered as $1,200 per year. At 7% for 30 years, that projects about $121,997.10 from $36,000 contributed.',
    ],
    read: [
      'Projected Roth IRA balance is the estimate at the end of the entered years.',
      'Total contributions shows current balance plus deposits counted in the projection.',
      'Estimated growth is the difference created by the return assumption.',
      'The result does not say whether the contribution is allowed or whether a withdrawal will be tax-free.',
    ],
    mistakes: [
      'Do not assume you are eligible to contribute just because the calculator accepts the amount.',
      'Do not ignore 2026 IRS contribution limits, MAGI phase-outs, taxable compensation, withdrawal rules, penalties, taxes, fees, or market risk.',
      'Do not treat qualified distributions as automatic. The 5-year rule, 59½ rule, and IRS exceptions still matter.',
      'Do not treat Roth IRA tax treatment as the same for every situation.',
    ],
    next: ['Use IRA Calculator for general IRA projection math.', 'Use Retirement Calculator for a wider savings goal.'],
  },
  'ira-calculator': {
    summary: 'Learn how current IRA balance, annual contribution, expected return, and time affect an IRA projection before you check IRS contribution and deduction rules.',
    purpose:
      'The IRA Calculator projects a future balance from current savings and annual contributions. It keeps the growth math separate from traditional IRA deduction rules, Roth IRA eligibility, RMDs, and taxes.',
    enter: [
      'Enter current IRA balance already in the account.',
      'Enter annual contribution. For 2026, the general IRA limit is $7,500, or $8,600 if age 50+ because of the $1,100 catch-up amount, but the calculator does not enforce those rules.',
      'Enter expected annual return and years to grow.',
      'Check taxable compensation, traditional IRA deduction rules, and Roth IRA eligibility separately before treating the contribution as allowed or deductible.',
    ],
    example: [
      '$25,000 current balance plus $7,500 per year is converted into $625 monthly deposits for the projection.',
      'At 6.5% for 20 years, the result is about $397,924.25, with $175,000 counted as total contributions and about $222,924.25 as estimated growth.',
      '$60,000 plus $8,600 per year at 6% for 12 years projects about $273,652.67 from $163,200 contributed.',
    ],
    read: [
      'Projected IRA balance is the estimate at the end of the entered years.',
      'Total contributions includes the starting balance and projected deposits.',
      'Estimated growth depends completely on the expected annual return assumption.',
      'The result does not say whether a traditional IRA contribution is deductible, whether a Roth contribution is allowed, or whether a withdrawal is taxable.',
    ],
    mistakes: [
      'Do not use this as tax advice, an official IRA limit checker, or a deduction calculator.',
      'Do not ignore taxable compensation, 2026 IRS contribution limits, traditional IRA deduction phase-outs, workplace retirement plan coverage, Roth IRA phase-outs, required minimum distributions, penalties, taxes, fees, or investment risk.',
      'Do not compare traditional IRA, Roth IRA, SEP IRA, SIMPLE IRA, rollover, or 401K choices without understanding tax treatment and plan rules.',
    ],
    next: ['Use Roth IRA Calculator for Roth-specific planning language.', 'Use 401K Calculator for workplace contribution scenarios.', 'Use Retirement Calculator for a wider savings goal.'],
  },
  'vat-calculator': {
    summary: 'Learn how to add VAT to a net amount or remove VAT from a gross amount without using the wrong mode.',
    purpose:
      'The VAT Calculator handles two common jobs: add VAT to a before-tax amount or remove VAT from a tax-included amount. It uses the rate you enter, so you still need the official rule for the country, product, invoice, export, exemption, or reverse charge situation.',
    enter: [
      'Enter the amount as net amount when adding VAT, or gross amount when removing VAT.',
      'Enter the VAT rate as a normal percent, such as 20 for 20% or 5 for 5%.',
      'Choose add or remove before calculating. This is the part most people mix up.',
    ],
    example: [
      '$100 net at 20% VAT adds $20 VAT and gives $120 gross.',
      '$120 gross at 20% VAT divides by 1.20 to get $100 net and $20 VAT.',
      '$210 gross at 5% VAT divides by 1.05 to get $200 net and $10 VAT.',
    ],
    read: [
      'Net amount is the price before VAT.',
      'VAT amount is the tax portion at the entered rate.',
      'Gross amount is net amount plus VAT.',
      'Rate used is the percent you entered, not a country lookup.',
    ],
    mistakes: [
      'Do not use the wrong mode: add starts from net, remove starts from gross.',
      'Do not assume the entered rate is correct for every country, product, or invoice.',
      'Do not treat U.S. sales tax and VAT as the same tax system.',
      'Do not use this for registration, reverse charge, exemption, export, import, or tax filing decisions.',
    ],
    next: ['Use Sales Tax Calculator for U.S.-style sales tax math.', 'Use Percentage Calculator to check rate math.', 'Use Discount Calculator before VAT if the price is discounted first.'],
  },
  'cash-back-or-low-interest-calculator': {
    summary: 'Learn how to compare a cash-back rebate with a low-interest APR offer by total cost.',
    purpose:
      'The Cash Back or Low Interest Calculator helps you test a dealer incentive choice: take the cash-back rebate with the regular APR, or skip the rebate and take the lower APR. The winner is the option with the lower estimated total cost over the same payoff term.',
    enter: [
      'Enter the same purchase amount for both offers.',
      'Enter the payoff term in months, such as 36, 48, 60, or 72.',
      'Enter the cash back percent and the APR that goes with the rebate option.',
      'Enter the low-interest APR from the offer that gives up the rebate.',
    ],
    example: [
      '$32,000 over 60 months with 4% cash back at 7.2% APR is compared with the same amount at 3.9% APR. The low-interest offer saves about $1,646.59.',
      '$28,000 over 36 months with 8% cash back at 5.5% APR is compared with 3.9% APR. The cash-back offer saves about $1,517.89.',
      'The calculator subtracts the rebate value from the cash-back loan total, then compares that net cost with the low-interest total paid.',
    ],
    read: [
      'Estimated better offer is the path with the lower estimated total cost.',
      'Cash back value is the rebate amount based on the purchase amount.',
      'Cash back net cost is the cash-back loan total after subtracting the rebate.',
      'Estimated savings is the gap between the two total-cost estimates.',
    ],
    mistakes: [
      'Do not compare by monthly payment only.',
      'Do not assume the low APR and cash-back rebate can be combined.',
      'Do not ignore taxes, fees, down payment, trade-in value, credit approval, model restrictions, rebate eligibility, expiration dates, or dealer add-ons.',
      'Do not assume an advertised low APR is available to every buyer or every model.',
    ],
    next: ['Use Auto Loan Calculator for the full vehicle loan estimate.', 'Use Interest Rate Calculator when you know payment but not rate.', 'Use Loan Calculator to compare the same APR and term outside a car-deal setup.'],
  },
  'auto-lease-calculator': {
    summary: 'Learn how vehicle price, residual value, money factor, fees, tax, and term shape a car lease payment.',
    purpose:
      'The Auto Lease Calculator estimates a monthly car lease payment by separating the depreciation part, the finance part, and the tax part. It helps you test the math before you read the contract.',
    enter: [
      'Enter vehicle price, fees, down payment, trade-in value, residual value, money factor, lease term, and tax rate.',
      'Use residual value as a dollar amount, not a percent, because the calculator compares it with adjusted capitalized cost.',
      'Enter the money factor exactly as shown in the quote, such as 0.0025, instead of converting it to APR first.',
    ],
    example: [
      '$36,000 vehicle price, $950 in fees, $2,500 down, $21,000 residual value, 36 months, 0.0025 money factor, and 6% tax gives about $542.97/month.',
      'That example has about $34,450 adjusted capitalized cost, $373.61 depreciation fee, $138.63 finance fee, and $30.73 tax.',
      'A $42,000 car with a $28,000 residual, $3,000 down, $1,500 trade-in, 0.0022 money factor, 36 months, and 7% tax estimates about $475.04/month.',
    ],
    read: [
      'Monthly payment is the estimated lease payment before contract-specific add-ons.',
      'Adjusted capitalized cost is the amount the lease math starts from after fees, down payment, and trade-in.',
      'Depreciation fee shows the part caused by the vehicle losing value during the lease.',
      'Finance fee is the rent-charge style part based on the money factor.',
      'Estimated total lease cost adds the down payment and the monthly payments. It does not prove the full contract cost.',
    ],
    mistakes: [
      'Do not compare leases by monthly payment alone.',
      'Do not ignore the amount due at signing, total amount due under the lease, mileage allowance, excess-mile charge, acquisition fee, disposition fee, security deposit, wear charges, registration, insurance, and early termination rules.',
      'Do not enter residual percent when the field asks for residual dollars.',
      'Do not assume a $0 due at signing ad means there are no taxes, fees, first payment, or other costs before you drive away.',
    ],
    next: ['Use Auto Loan Calculator if buying might be better.', 'Use Cash Back or Low Interest Calculator for dealer incentive comparisons.', 'Use Lease Calculator for non-car lease math.'],
  },
  'depreciation-calculator': {
    summary: 'Learn how cost, salvage value, useful life, asset age, and method affect depreciation and book value.',
    purpose:
      'The Depreciation Calculator estimates book value using straight-line or declining-balance math. It is useful for learning the idea or checking a simple book-value schedule, not for filing taxes or setting accounting policy.',
    enter: [
      'Enter original cost and estimated salvage value as dollar amounts.',
      'Enter useful life and asset age in years.',
      'Choose straight-line for even depreciation or declining balance for faster early depreciation.',
      'For declining balance, enter the yearly rate as a percent, such as 25 for 25%.',
    ],
    example: [
      '$12,000 cost minus $2,000 salvage gives $10,000 of depreciable amount.',
      'With a 5-year straight-line life, annual depreciation is $2,000. After 2 years, accumulated depreciation is $4,000 and book value is $8,000.',
      '$25,000 cost, $5,000 salvage, 25% declining balance, and age 3 gives about $10,546.88 book value in this simple model.',
    ],
    read: [
      'Book value is cost minus accumulated depreciation.',
      'Accumulated depreciation is the total depreciation counted so far.',
      'Annual depreciation estimate shows the current simple yearly amount for the selected method.',
      'Declining-balance results usually count more depreciation earlier, then slow down as book value falls.',
    ],
    mistakes: [
      'Do not use this as tax depreciation advice.',
      'Do not ignore MACRS class life, placed-in-service dates, partial-year conventions, section 179, bonus depreciation, listed property rules, recapture, or accounting policy.',
      'Do not set salvage value equal to or above cost.',
      'Do not treat asset age as the same thing as an IRS placed-in-service date.',
    ],
    next: ['Use Business Loan Calculator if the asset was financed.', 'Use Average Return Calculator to compare investment-style performance.'],
  },
  'average-return-calculator': {
    summary: 'Learn how starting value, ending value, years, contributions, and withdrawals affect simple average return and CAGR.',
    purpose:
      'The Average Return Calculator estimates net gain, cumulative return, simple average annual return, and a basic CAGR comparison. It is a quick performance check, not a broker statement, tax report, or investment recommendation.',
    enter: [
      'Enter the starting value, ending value, and full number of years.',
      'Add contributions so deposits are not mistaken for investment growth.',
      'Add withdrawals so money you took out is still counted in net gain.',
      'Use IRR or XIRR instead when the exact dates of deposits and withdrawals matter.',
    ],
    example: [
      '$10,000 to $16,000 over 5 years with $2,000 added gives $4,000 net gain after adjusting for the added money.',
      'The calculator divides $4,000 by a $12,000 invested base for 33.33% cumulative return, then divides by 5 years for 6.67% simple average annual return.',
      'With no contributions, $8,000 growing to $12,000 over 3 years gives 50% cumulative return and about 14.47% CAGR.',
    ],
    read: [
      'Net gain adjusts for contributions and withdrawals so deposits are not counted as growth.',
      'Cumulative return shows the total return for the whole period.',
      'Average annual return is the simple yearly average of the cumulative return.',
      'CAGR shows the steady growth-rate comparison from starting value to ending value only, so it is not cash-flow adjusted.',
    ],
    mistakes: [
      'Do not treat this as a time-weighted return or internal rate of return.',
      'Do not ignore fees, taxes, dividends, inflation, risk, benchmark fit, deposits timing, and withdrawals timing.',
      'Do not compare two investments unless the measurement periods and cash flows are similar.',
      'Do not assume past average return proves future return.',
    ],
    next: ['Use IRR Calculator for uneven cash flows.', 'Use ROI Calculator for a simpler gain-versus-cost check.'],
  },
  'ad-revenue-calculator': {
    summary: 'Estimate website ad revenue from daily page views, CTR, CPC, monthly revenue, and page RPM.',
    purpose:
      'The Ad Revenue Calculator is for early website planning. It helps you test a simple question: if a page gets this many views, this click rate, and this average click value, what could the ad revenue look like?',
    enter: [
      'Enter daily page views as the number of page loads you want to estimate for one day.',
      'Enter page CTR as a normal percent, such as 1.5 for 1.5%, not 0.015.',
      'Enter average CPC as a dollar amount per ad click, such as 0.35 for thirty-five cents.',
    ],
    example: [
      '1,000 daily page views with 1.5% page CTR creates about 15 estimated clicks per day.',
      'At $0.35 average CPC, those clicks estimate $5.25 per day, about $159.80 per average month, and a $5.25 page RPM.',
      'If the CTR drops to 0.6% or the average CPC drops to $0.25, the same traffic can feel much less exciting. That is why this page is better for testing scenarios than making promises.',
    ],
    read: [
      'Monthly revenue is the headline estimate because many site owners plan traffic and costs monthly.',
      'Daily revenue shows the raw one-day estimate before scaling up.',
      'Page RPM converts the estimate into revenue per 1,000 page views, which is easier to compare across pages with different traffic.',
      'Estimated clicks per day helps you spot the hidden lever. More page views do not help much if the click rate or CPC is weak.',
    ],
    mistakes: [
      'Do not treat this as real AdSense income or an official Google report.',
      'Do not forget invalid traffic, ad blocking, country mix, niche, seasonality, ad placement, policy status, and advertiser demand.',
      'Do not enter 1.5% CTR as 0.015 unless a field specifically asks for decimal form. This field wants 1.5.',
      'Do not compare two pages by total revenue alone. Compare page RPM too, because one page may earn more only because it gets more views.',
    ],
    next: ['Use Margin Calculator if you want to compare ad revenue with site costs.', 'Use UTM Builder when you are planning traffic campaigns.', 'Open the Ad Revenue Calculator again when you want to test a second CTR or CPC scenario.'],
  },
  'margin-calculator': {
    summary: 'Learn how selling price and cost turn into profit, profit margin, gross margin, and markup.',
    purpose:
      'The Margin Calculator is for pricing math. It shows profit, margin, and markup side by side so you can see why the two percentages are not the same.',
    enter: [
      'Enter revenue or selling price as the amount charged for the item, job, or sale.',
      'Enter cost as the direct cost you want to compare against that sale, such as item cost, material cost, or job cost.',
      'Use the same time period or product unit for both numbers.',
      'Leave sales tax, shipping, refunds, marketplace fees, and overhead out unless you mean to include them in the cost number.',
    ],
    example: [
      '$100 revenue minus $60 cost gives $40 profit.',
      '$40 profit divided by $100 revenue is 40% margin, while $40 divided by $60 cost is 66.67% markup.',
      '$2,500 revenue and $1,400 direct cost gives $1,100 profit, 44% margin, and 78.57% markup.',
    ],
    read: [
      'Profit is revenue minus cost.',
      'Margin shows profit as a percent of revenue.',
      'Markup shows profit as a percent of cost, so it is usually higher than margin for the same sale.',
      'Gross-style margin only checks the cost you entered. Net margin needs the rest of the business expenses too.',
    ],
    mistakes: [
      'Do not use margin and markup as if they mean the same thing.',
      'Do not compare one-item revenue with a monthly or yearly cost total.',
      'Do not forget overhead, labor, shipping, refunds, taxes, payment fees, and marketplace fees if they matter to the real business result.',
      'Do not use this for brokerage margin or borrowed-investing risk.',
    ],
    next: ['Use Discount Calculator to see how a sale affects price.', 'Use Percentage Calculator for a basic percent check.'],
  },
  'discount-calculator': {
    summary: 'Learn how one discount, an extra discount, and tax affect final price, savings, and the real checkout total.',
    purpose:
      'The Discount Calculator estimates a sale price after a percent discount, an optional second discount, and optional tax. It helps show why stacked discounts are not simply added together and why the offer rules still matter.',
    enter: [
      'Enter the original price before discounts.',
      'Enter the first discount percent and optional extra discount percent.',
      'Enter tax rate only if you want to estimate tax on the discounted subtotal.',
      'Keep shipping, required fees, membership limits, minimum purchase rules, and coupon exclusions separate unless you have checked the actual offer.',
    ],
    example: [
      '$100 with 20% off becomes $80 after the first discount.',
      'A second 10% discount applies to $80, not the original $100, so the pretax subtotal becomes $72 before tax.',
      'A 5% tax on $72 adds $3.60, making the final estimate $75.60.',
      '$250 with 15% off, then 5% extra, and 7.25% tax estimates about $216.51 final price.',
    ],
    read: [
      'Final price is the estimated amount after discounts and tax.',
      'Total savings before tax shows how much the discounts removed from the original price.',
      'Effective discount shows the combined discount as one percentage of the original price.',
      'The calculator does not prove the sale claim is fair, current, or available to every shopper.',
    ],
    mistakes: [
      'Do not add stacked discounts together unless the store says it works that way.',
      'Do not forget shipping, required fees, coupon exclusions, minimum purchase rules, tax exemptions, and local tax rules.',
      'Do not enter 20% as 0.20 in a percent field.',
      'Do not assume a discount is useful if the original price, required fees, or eligibility rules make the deal worse.',
    ],
    next: ['Use Sales Tax Calculator for tax-only checks.', 'Use VAT Calculator for tax-included price math.'],
  },
  'business-loan-calculator': {
    summary: 'Learn how loan amount, rate, term, and origination fee affect a business loan payment, cash received, and total cost.',
    purpose:
      'The Business Loan Calculator helps you test a fixed-payment business loan before you ask for money or compare offers. It estimates monthly payment, total interest, origination fee, cash received after fee, and total cost with fee.',
    enter: [
      'Enter the loan amount, annual rate, and repayment term.',
      'Enter origination fee percent if the lender takes a fee from the proceeds, adds it upfront, or quotes it separately.',
      'Use the same loan amount, rate, term, and fee assumptions for every offer you compare.',
    ],
    example: [
      '$50,000 at 9.5% for 5 years estimates about $1,050.09 per month.',
      'A 2% origination fee equals $1,000, so cash received after fee is about $49,000 while the loan is still repaid from $50,000.',
      'The same example shows about $13,005.58 interest and about $64,005.58 total cost with the fee included.',
    ],
    read: [
      'Monthly payment is based on the full loan amount.',
      'Cash received after fee shows how much money may be left if the fee is taken out of the proceeds.',
      'Total interest and total cost with fee show why a lower monthly payment may not be the cheapest offer.',
    ],
    mistakes: [
      'Do not treat this as a lender offer or approval.',
      'Do not ignore collateral, underwriting, SBA eligibility, personal guarantees, draw schedules, variable rates, late fees, and prepayment terms.',
      'Do not compare offers by interest rate alone when fees, cash received, or repayment timing are different.',
      'Do not use this fixed-loan estimate for a merchant cash advance without reading the separate repayment terms.',
    ],
    next: ['Use Loan Calculator for a plain fixed-payment estimate.', 'Use Interest Rate Calculator if you know payment and term but need to estimate a rate.', 'Use Profit Goal Calculator to check whether the project needs to earn enough to cover the payment.'],
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
    summary: 'Learn how a personal loan amount, rate, term, and origination fee affect payment, cash received, and total cost.',
    purpose:
      'The Personal Loan Calculator estimates a fixed monthly payment and shows how an origination fee can reduce the cash you actually receive. It is for checking an offer before you read the lender disclosure line by line.',
    enter: [
      'Enter the loan amount, annual rate, and repayment term.',
      'Enter an origination fee percent if the lender charges one, such as 2 for 2%.',
      'Use the lender disclosure to decide whether the rate field should use APR or the stated interest rate for your comparison.',
    ],
    example: [
      '$12,000 at 10.5% for 4 years is about $307.24 per month and about $2,747.55 in interest.',
      'A 2% origination fee is $240, so the cash received after fee is $11,760 if the fee is taken from the loan proceeds.',
      'That means the payment is based on $12,000, but the money landing in your account may be closer to $11,760.',
    ],
    read: [
      'Monthly payment is the estimated fixed payment.',
      'Total interest is payment total minus principal.',
      'Cash received after fee helps explain why a loan can feel smaller than the principal you repay.',
      'Total cost with fee is the payment total plus the origination fee shown by the calculator.',
    ],
    mistakes: [
      'Do not ignore origination fees, late fees, credit insurance, prepayment rules, and variable-rate terms.',
      'Do not assume an advertised rate applies to your credit profile.',
      'Do not compare one offer by APR and another by interest rate unless you understand what each number includes.',
      'Do not pay money upfront just because someone promises approval. That can be a scam warning sign.',
    ],
    next: [
      'Use APR Calculator when fees make two loan quotes hard to compare.',
      'Use Debt Payoff Calculator to compare keeping the current debt.',
      'Use Loan Calculator when you only need simple payment and interest math.',
    ],
  },
  'boat-loan-calculator': {
    summary: 'Learn how boat price, down payment, trade-in credit, taxes, fees, rate, and term affect a boat loan payment.',
    purpose:
      'The Boat Loan Calculator is for checking a marine loan idea before you compare the written offer. It estimates amount financed, monthly payment, sales tax, total paid, and interest from the purchase price, trade-in credit, down payment, fees, rate, and term.',
    enter: [
      'Enter the boat price before financing, then add down payment and trade-in credit if they apply.',
      'Enter dealer or seller fees only when you want them included in the financed balance.',
      'Use the sales tax rate, rate used for payment math, and loan term from the quote you want to test.',
      'If the lender gives APR and interest rate separately, use the number you are intentionally comparing and read the disclosure before deciding which offer is cheaper.',
    ],
    example: [
      '$45,000 with $9,000 down, $1,200 in fees, 6% sales tax, 8.5%, and 10 years creates $2,700 in estimated sales tax.',
      'That leaves $39,900 financed before the payment formula runs.',
      'The estimated payment is about $494.70/month, with about $19,464.35 in total interest over 120 payments.',
    ],
    read: [
      'Amount financed is the balance used in the payment formula.',
      'Sales tax is estimated from boat price minus trade-in credit, then multiplied by the entered tax rate.',
      'Total interest shows the borrowing cost before ownership costs such as storage, insurance, fuel, maintenance, marina fees, trailer costs, or registration.',
      'Total paid is monthly payment times the number of months. It is not the same thing as total cost of owning the boat.',
    ],
    mistakes: [
      'Do not compare only monthly payment when the loan terms are different. A longer term can make the payment look easier while adding a lot of interest.',
      'Do not forget registration, title, marina fees, storage, maintenance, inspections, winterization, insurance, fuel, and trailer costs.',
      'Do not assume trade-in tax treatment, documentation fees, title fees, or optional add-ons are handled the same everywhere.',
      'Do not treat this as a Truth in Lending disclosure. Use the lender paperwork for official APR, finance charge, total of payments, and contract terms.',
    ],
    next: [
      'Use Loan Calculator for a plain principal-rate-term estimate.',
      'Use APR Calculator when fees make two loan offers hard to compare.',
      'Use Auto Loan Calculator when the financing idea is closer to a car or truck purchase.',
    ],
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
      'The Refinance Calculator compares the loan you have now with a new loan. It is best for checking whether a lower payment comes from a better rate, a longer term, or costs being rolled into the new balance.',
    enter: [
      'Enter the current balance, current rate, and remaining years on the loan you already have.',
      'Enter the new rate, new term, and closing costs from the refinance idea you want to test.',
      'Use closing costs as dollars. This calculator adds those costs to the new principal, so the new loan balance starts higher.',
    ],
    example: [
      '$280,000 at 7% with 26 years left is about $1,951.15 per month in this model.',
      'A new 30-year loan at 5.9% with $4,500 costs rolled in starts at $284,500 and is about $1,687.47 per month.',
      'That saves about $263.67 per month, so the simple break-even is about 17.1 months.',
    ],
    read: [
      'Monthly savings is useful, but it is not the whole story.',
      'Break-even months shows about how long the payment savings may take to cover closing costs.',
      'Total cost change helps catch the sneaky part: a longer new term can lower the monthly payment but still raise total cost over time.',
      'If the new payment is higher, the calculator shows no monthly-savings break-even.',
    ],
    mistakes: [
      'Do not ignore closing costs, escrow changes, points, prepaids, lender fees, title fees, appraisal fees, and prepayment penalties.',
      'Do not call a refinance better just because the monthly payment drops.',
      'Do not treat interest rate and APR as the same thing when fees or points are part of the quote.',
      'Do not use this as a loan disclosure. Use the lender Loan Estimate and Closing Disclosure for real terms.',
    ],
    next: [
      'Use APR Calculator if points or lender fees make two refinance offers hard to compare.',
      'Use Mortgage Payoff Calculator if extra payments on the current loan may be simpler.',
      'Use Mortgage Calculator when you want the full payment picture with taxes and insurance.',
    ],
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
      'If total planned expenses are $4,650, the leftover is $550 and the category percentages show where the money is going.',
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
      'Enter each person\'s ordinary income separately.',
      'Leave the single deduction fields blank to use the 2026 single standard deduction, or enter custom deductions if you are testing a specific scenario.',
      'Leave the joint deduction blank to use the 2026 married filing jointly standard deduction, then add joint credits only if they belong in the simple comparison.',
    ],
    example: [
      '$90,000 and $70,000 are first estimated as two single filers. The two-single estimate is $17,540.',
      'Then the calculator combines the income as married filing jointly. The joint estimate is also $17,540, so the simplified difference is $0.',
      'For $180,000 and $25,000, the joint estimate is about $5,384 lower than the two-single estimate in this model.',
    ],
    read: [
      'A negative marriage difference means the joint estimate is lower than the two-single estimate.',
      'A positive marriage difference means the joint estimate is higher in this simplified model.',
      'A $0 difference means this bracket-and-deduction check did not find a bonus or penalty for the numbers entered.',
      'The marginal bracket lines are clues, not a full tax return.',
    ],
    mistakes: [
      'Do not use this for filing advice or wedding decisions.',
      'Do not forget state tax, payroll tax, credits, dependents, AMT, itemized deductions, student loans, community-property rules, benefits, and phaseouts.',
      'Do not assume a marriage bonus or penalty stays the same when income changes.',
    ],
    next: ['Use Income Tax Calculator for one filing-status estimate.', 'Use Take-Home-Paycheck Calculator to estimate paycheck impact separately.'],
  },
  'estate-tax-calculator': {
    summary: 'Learn how gross estate, deductions, lifetime taxable gifts, and the 2026 exclusion affect a rough federal estate tax estimate.',
    purpose:
      'The Estate Tax Calculator is a high-level screen for very large estates. It checks whether the numbers you enter sit above the 2026 federal basic exclusion, but it is not a Form 706 filing tool or legal advice.',
    enter: [
      'Enter gross estate as the rough total estate value before the deductions on this page.',
      'Enter debts and expenses, charitable bequests, and spouse transfers only when they belong in the rough scenario you are testing.',
      'Enter prior lifetime taxable gifts because this simplified model treats them as using part of the 2026 basic exclusion.',
    ],
    example: [
      'An $18,000,000 estate with $500,000 of deductions starts with $17,500,000 before exclusion.',
      'The calculator subtracts the $15,000,000 2026 federal exclusion and applies a simplified 40% estimate only to the $2,500,000 above that exclusion, giving a rough $1,000,000 federal estimate.',
    ],
    read: [
      'Taxable estate before exclusion is the estate after the deductions you entered.',
      'Remaining exclusion shows how much of the 2026 basic exclusion is still available after prior taxable gifts.',
      'Estimated federal estate tax is simplified. Real federal estate tax work is much more detailed.',
    ],
    mistakes: [
      'Do not use this for trusts, portability, generation-skipping tax, state estate tax, inheritance tax, valuation discounts, or Form 706 decisions.',
      'Do not forget that asset values, debts, deductions, adjusted taxable gifts, and elections can change the real return.',
      'Do not treat the simplified 40% estimate as the full IRS computation for every estate.',
    ],
    next: [
      'Use Future Value Calculator to test how estate value might grow.',
      'Talk to an estate attorney or tax professional when the estate may be near the filing threshold, when portability matters, or when Form 706 could be required.',
    ],
  },
  'social-security-calculator': {
    summary: 'Learn how birth year, full-retirement-age benefit, and claiming age change a Social Security retirement estimate.',
    purpose:
      'The Social Security Calculator starts with your SSA full-retirement-age benefit estimate. Then it checks how the monthly amount changes if you claim at 62, at full retirement age, or as late as 70.',
    enter: [
      'Enter birth year so the calculator can estimate full retirement age.',
      'Enter the monthly benefit shown for full retirement age in your my Social Security estimate, if you have one.',
      'Enter a claiming age from 62 through 70. Age 62 is the earliest retirement-claiming age, and age 70 is where delayed credits stop increasing the benefit.',
    ],
    example: [
      'Born in 1962 with a $2,400 full-retirement-age benefit and claiming at 67 gives about $2,400 a month, or $28,800 a year.',
      'The same $2,400 FRA benefit at age 62 gives about $1,680 a month after a 30% early-claiming reduction.',
      'Born in 1960 with a $2,600 FRA benefit and claiming at 70 gives about $3,224 a month after delayed credits.',
    ],
    read: [
      'Monthly benefit is the adjusted estimate at the claiming age you entered.',
      'Adjustment percent shows how far the estimate moved from the full-retirement-age benefit.',
      'Annual benefit is monthly benefit times 12. It is not a lifetime break-even answer.',
    ],
    mistakes: [
      'Do not guess the full-retirement-age benefit if you can use your my Social Security estimate instead.',
      'Do not treat this as a full SSA record. It does not rebuild your 35-year earnings history or check spousal, survivor, disability, WEP, GPO, tax, Medicare, or work earnings-test rules.',
      'Do not compare only the monthly amount. Health, job plans, savings, household needs, and taxes can matter more than one larger check.',
    ],
    next: ['Use Retirement Calculator for savings planning.', 'Use RMD Calculator if retirement account withdrawals are part of the plan.'],
  },
  'rmd-calculator': {
    summary: 'Learn how prior Dec. 31 balance and IRS table factor create a required minimum distribution estimate.',
    purpose:
      'The RMD Calculator estimates a simple owner-style withdrawal using the IRS Uniform Lifetime Table. It is a quick check, not a custodian statement or tax filing answer.',
    enter: [
      'Enter the account balance from the previous December 31. For a 2026 estimate, that is usually the December 31, 2025 balance.',
      'Enter your age on your birthday in the distribution year.',
      'Use this only for the simple owner-style Uniform Lifetime Table case. Inherited accounts and younger-spouse cases need different checks.',
    ],
    example: [
      '$500,000 at age 75 uses the age 75 table factor of 24.6.',
      '$500,000 divided by 24.6 gives about $20,325.20 as the estimated RMD.',
      '$750,000 at age 80 uses factor 20.2, which gives about $37,128.71.',
    ],
    read: [
      'Estimated RMD is the minimum withdrawal estimate from the balance and age entered.',
      'Uniform table factor is the denominator from the IRS table.',
      'Balance after RMD is just the entered balance minus the estimate. It does not include market movement, tax withholding, or later deposits.',
    ],
    mistakes: [
      'Do not use this for inherited IRA rules, spouse-more-than-10-years-younger rules, Roth IRA owner rules, or beneficiary cases.',
      'Do not use today\'s balance when the rule calls for the prior December 31 balance.',
      'Do not assume extra withdrawals this year reduce next year\'s RMD. Next year starts from its own prior year-end balance.',
      'Do not ignore first-year timing, aggregation rules, custodian records, tax withholding, or possible penalties.',
    ],
    next: ['Use IRA Calculator for contribution-style planning.', 'Use Retirement Calculator for a wider retirement savings estimate.'],
  },
  'real-estate-calculator': {
    summary: 'Learn how purchase price, sale price, cash invested, selling costs, and loan payoff affect sale profit, net proceeds, and ROI.',
    purpose:
      'The Real Estate Calculator is for a property sale scenario. It keeps the sale math simple: what cash went in, what cash might come out after selling costs and loan payoff, and what that means for profit, ROI, and equity multiple.',
    enter: [
      'Enter purchase price, cash down payment, buying costs, and improvements to build the cash invested line.',
      'Enter selling price, selling costs, and loan payoff at sale to estimate net sale proceeds.',
      'Use a real payoff quote when you have one. A payoff amount can differ from the current balance because interest and timing still matter.',
    ],
    example: [
      '$350,000 purchase, $70,000 down, $8,000 buying costs, $15,000 improvements, $430,000 sale price, $25,800 selling costs, and $260,000 payoff make $93,000 cash invested.',
      'Net sale proceeds are $430,000 - $25,800 - $260,000 = $144,200, so estimated profit is $51,200 before tax and other outside items.',
    ],
    read: [
      'Net sale proceeds is what is left after selling costs and payoff in this simplified model.',
      'Profit is net sale proceeds minus cash invested.',
      'ROI percent compares profit with cash invested, while equity multiple compares proceeds with cash invested.',
      'A higher sale price can still leave a small profit if the payoff, seller credits, repairs, or closing costs are high.',
    ],
    mistakes: [
      'Do not use this as a tax-basis or capital-gains calculator. IRS home-sale rules can depend on adjusted basis, ownership and use tests, prior exclusions, rental use, and depreciation.',
      'Do not forget payoff quote timing, transfer taxes, agent agreements, seller credits, escrow prorations, attorney fees, rent history, refinancing, repairs, and local rules.',
      'Do not compare two properties unless cash invested is measured the same way.',
    ],
    next: ['Use Rental Property Calculator for monthly cash-flow screening.', 'Use Mortgage Calculator to inspect the loan payment separately.'],
  },
  'take-home-paycheck-calculator': {
    summary: 'Learn how salary, pay frequency, pretax deductions, tax estimates, and 2026 employee FICA affect take-home pay.',
    purpose:
      'The Take-Home-Paycheck Calculator turns annual salary into a rough paycheck estimate. It is built for quick planning: gross pay, pretax deductions, your entered tax percentages, employee Social Security, employee Medicare, and estimated take-home pay.',
    enter: [
      'Enter annual gross pay before paycheck deductions.',
      'Choose pay periods per year, such as 52 weekly, 26 biweekly, 24 semimonthly, or 12 monthly.',
      'Enter pretax deductions per paycheck, then enter federal, state, and local withholding estimates as percentages, not decimals.',
    ],
    example: [
      '$78,000 salary over 26 paychecks gives $3,000 gross per paycheck before deductions.',
      '$120 pretax per paycheck becomes $3,120 per year. With 12% federal, 4% state, 0% local, and the 2026 employee FICA estimate, the result is about $56,932.20 per year, or $2,189.70 per paycheck.',
    ],
    read: [
      'Gross per paycheck is salary divided by pay periods.',
      'Take-home per paycheck is the rough net amount after the deductions and taxes in this simplified model.',
      'The FICA line is separate, so Social Security and Medicare are not hidden inside the federal tax percentage field.',
      'This can help compare pay schedules, but it does not replace a paystub or employer payroll system.',
    ],
    mistakes: [
      'Do not enter a dollar withholding amount in a percent field.',
      'Do not assume this matches payroll exactly. Real payroll can use Form W-4 details, IRS Publication 15-T withholding tables, state rules, benefit plans, bonuses, overtime, garnishments, and employer timing.',
      'Do not include Social Security or Medicare inside the federal tax percent if you want to avoid double counting.',
      'Do not forget that the Social Security wage base, withholding tables, and some deduction rules can change by year.',
    ],
    next: ['Use Salary Calculator for annual-to-hourly comparisons.', 'Use Income Tax Calculator for a broader federal tax estimate.'],
  },
  'rental-property-calculator': {
    summary: 'Learn how rent, vacancy, operating costs, mortgage payment, NOI, cap rate, cash flow, and cash-on-cash return fit together.',
    purpose:
      'The Rental Property Calculator screens a rental deal before you spend hours in a spreadsheet. It separates property performance before financing from the cash flow after the mortgage payment.',
    enter: [
      'Enter property price, down payment, mortgage rate, loan term, and monthly rent.',
      'Enter vacancy percent, monthly operating expenses, property tax, insurance, maintenance reserve, and closing costs.',
      'Use boring, realistic numbers. A rental can look amazing only because vacancy, repairs, HOA, or management costs were left out.',
    ],
    example: [
      '$300,000 property, $75,000 down, 6.75% loan, and $2,400 rent starts with a $225,000 mortgage.',
      'After $120 vacancy, $260 operating costs, $300 property tax, $140 insurance, and $250 maintenance reserve, monthly NOI is $1,330. The estimated mortgage payment is $1,459.35, so the example shows a $129.35 monthly shortfall.',
    ],
    read: [
      'NOI means net operating income before loan payment.',
      'Cap rate compares annual NOI with property price before financing.',
      'Cash-on-cash return compares annual cash flow after the mortgage payment with down payment plus closing costs.',
      'A negative cash-flow result is not a bug. It means the rent and assumptions you entered do not cover the estimated loan payment and operating costs.',
    ],
    mistakes: [
      'Do not forget repairs, vacancy, property management, HOA, utilities, legal costs, capex reserves, local rules, rent control, and tenant risk.',
      'Do not treat cap rate and cash-on-cash return as the same thing.',
      'Do not use this as tax advice. IRS rental rules can involve income, expenses, depreciation, personal-use rules, passive-loss limits, and records this quick calculator does not handle.',
      'Do not use this as lender approval. Lenders use their own rental income worksheets, leases, history, appraisal notes, vacancy factors, and underwriting rules.',
    ],
    next: ['Use Real Estate Calculator for a sale-profit estimate.', 'Use Mortgage Calculator to inspect the loan payment separately.'],
  },
  'irr-calculator': {
    summary: 'Learn how an initial outflow and regular cash flows turn into periodic and annualized IRR.',
    purpose:
      'The IRR Calculator is for regular cash-flow periods where the amounts can be uneven. It estimates the rate that makes the cash flows balance to about zero net present value.',
    enter: [
      'Enter the starting investment as the initial outflow. The tool turns that starting cost into a negative cash flow.',
      'Enter the next five cash flows in the order they happen. The amounts can be different, but the spacing should stay regular.',
      'Set periods per year carefully. Use 1 for annual cash flows, 4 for quarterly cash flows, or 12 for monthly cash flows.',
    ],
    example: [
      '$10,000 outflow followed by $2,200, $2,400, $2,600, $2,800, and $4,500 annual inflows solves to about 12.22% periodic IRR.',
      'Because the default example uses annual periods, the annualized IRR is also about 12.22%. With monthly periods, the same solved periodic rate would be compounded into a yearly-style estimate.',
    ],
    read: [
      'Periodic IRR is the solved rate for one cash-flow period.',
      'Annualized IRR converts that rate to a yearly-style estimate using the periods-per-year field.',
      'Net cash flow is simple dollars in minus dollars out. It is not time-adjusted like IRR.',
    ],
    mistakes: [
      'Do not use this page for irregular real dates. Use an XIRR-style tool or spreadsheet setup when the dates are not evenly spaced.',
      'Do not trust a simple IRR when cash flows switch signs more than once, because there can be more than one IRR.',
      'Do not use IRR alone when project sizes are very different. A tiny project can show a high percent while adding less real money.',
      'Do not forget taxes, fees, inflation, risk, and reinvestment assumptions.',
    ],
    next: ['Use ROI Calculator for a simpler gain-versus-cost number.', 'Use Payback Period Calculator to see how long recovery takes.'],
  },
  'roi-calculator': {
    summary: 'Learn how simple ROI compares gain or loss with the starting cost.',
    purpose:
      'The ROI Calculator is for a quick gain-versus-cost check. It is simple on purpose: one starting cost, one ending value, income, costs, and a clear percent. That makes it useful for a snapshot, but not enough for a full investment decision.',
    enter: [
      'Enter the initial investment as the starting cost or money at risk.',
      'Enter ending value, income, and costs separately so the gain is not guessed.',
      'Use the same currency and the same project boundary for every field.',
    ],
    example: [
      '$10,000 initial investment, $12,500 ending value, $600 income, and $250 costs gives a gain of $2,850.',
      'The calculator divides that $2,850 gain by the $10,000 initial investment, so the simple ROI is 28.5%.',
    ],
    read: [
      'ROI percent shows gain or loss compared with the starting investment.',
      'Gain or loss is the dollar result after ending value plus income minus costs and initial investment.',
      'A positive ROI does not tell you whether the return was fast, slow, risky, fee-heavy, or better than another option.',
    ],
    mistakes: [
      'Do not compare ROI across projects with very different time lengths without another metric.',
      'Do not forget fees, taxes, financing cost, repairs, subscriptions, or labor if they belong in the project.',
      'Do not use simple ROI as if it were IRR, annual return, NPV, or profit margin.',
    ],
    next: [
      'Use Average Return Calculator when you need a yearly-style return check.',
      'Use IRR Calculator for uneven cash flows over time.',
      'Use Payback Period Calculator to see how long cost recovery takes.',
    ],
  },
  'apr-calculator': {
    summary: 'Learn how loan fees can make APR higher than the note rate.',
    purpose:
      'The APR Calculator estimates a simplified APR-style rate from the payment stream and the amount actually received after fees. It is useful for fixed loan comparisons, but it is not an official disclosure.',
    enter: [
      'Enter the loan amount, note rate, term, and upfront finance charges or fees.',
      'Use fees that reduce what you effectively receive, such as a simple origination-fee comparison.',
      'Keep the note rate separate from APR. The calculator solves the APR-style rate after estimating the scheduled payment.',
    ],
    example: [
      '$20,000 at an 8% note rate for 5 years with $600 in fees produces a payment of about $405.53 from the full $20,000 loan.',
      'Then the calculator treats the borrower as receiving $19,400 and solves the rate implied by making that same payment. In this example, the APR estimate is about 9.30%.',
    ],
    read: [
      'Estimated APR is the main comparison number.',
      'Amount received shows why fees can raise APR even when the note rate stays the same.',
      'Monthly payment comes from the note rate and full principal in this simplified fixed-payment model.',
    ],
    mistakes: [
      'Do not treat this as a Truth in Lending disclosure.',
      'Do not enter costs that are not finance charges unless that is the comparison you intentionally want.',
      'Do not compare two loans by note rate alone when one has higher fees.',
      'Do not use this as a credit card APR calculator. Cards can have daily balance methods, grace periods, promotional APRs, and separate cash-advance rules.',
    ],
    next: [
      'Use Loan Calculator for the basic payment.',
      'Use Personal Loan Calculator if origination fees reduce cash received.',
      'Use Interest Rate Calculator when you know payment, amount financed, and term but not the rate.',
    ],
  },
  'fha-loan-calculator': {
    summary: 'Estimate an FHA-style payment with down payment, upfront MIP, monthly MIP, tax, and insurance.',
    purpose:
      'The FHA Loan Calculator is for FHA-style payment planning. It shows how a low-down-payment mortgage can change when upfront MIP is financed and annual MIP is added each month.',
    enter: [
      'Enter home price, down payment, interest rate, loan term, annual property tax, and monthly homeowners insurance.',
      'Enter upfront MIP percent and annual MIP percent from the HUD or lender scenario you want to test.',
      'Use 3.5% down as a common FHA example, not as proof that you qualify or that the home is inside the county FHA loan limit.',
      'Keep cash to close separate. Down payment, closing costs, prepaids, and escrow deposits are not the same thing as the monthly payment.',
    ],
    example: [
      '$325,000 with 3.5% down means $11,375 down and a $313,625 base loan before financed upfront MIP.',
      'With 1.75% upfront MIP and 0.55% annual MIP, the example adds about $5,488.44 upfront MIP and about $143.74 monthly MIP.',
    ],
    read: [
      'Total monthly payment includes principal, interest, tax, insurance, and monthly MIP.',
      'Upfront MIP is shown as a separate dollar amount so the financed insurance cost is not hidden inside the loan.',
      'Loan-to-value helps explain whether the example is a 3.5% down / 96.5% LTV style scenario before any program-specific review.',
    ],
    mistakes: [
      'Do not use this to decide FHA eligibility or loan limits.',
      'Do not ignore MIP duration, property rules, lender overlays, closing costs, escrow, debt-to-income review, county loan limits, or official FHA updates.',
      'Do not assume the entered MIP rates are current for every FHA loan term, base loan size, or LTV.',
    ],
    next: ['Use Mortgage Calculator for a non-FHA comparison.', 'Use Down Payment Calculator to test cash needed.', 'Use House Affordability Calculator before asking a lender for preapproval.'],
  },
  'va-mortgage-calculator': {
    title: 'VA Mortgage Calculator: Funding Fee Guide',
    metaDescription:
      'Use a VA mortgage calculator to test payment, funding-fee rate, financed fee, tax, insurance, and LTV, then compare lender Loan Estimates.',
    intro:
      'A VA purchase estimate can look simple when the down payment is zero, but the funding-fee status, financed fee, property costs, and lender quote can move the real number. This guide shows what to enter, what to compare, and which answers still require VA or lender paperwork.',
    quickStart: [
      'Open the VA Mortgage Calculator and enter the home price, down payment, interest rate, term, yearly property tax, and monthly homeowners insurance.',
      'Choose first use or later use, then mark funding-fee exemption only when official VA or lender paperwork confirms it.',
      'Choose whether the funding fee is financed into the loan or paid at closing.',
      'Calculate, then compare base loan amount, funding-fee rate and dollars, financed loan amount, total monthly payment, and loan-to-value.',
      'Change one input at a time, then compare the result with the current VA funding-fee chart and written Loan Estimates from lenders.',
    ],
    featuredSections: [
      {
        title: 'This estimates a payment, not how much VA home you can afford',
        paragraphs: [
          'The calculator starts with a home price you choose. It does not check income, monthly debts, credit, residual-income rules, entitlement, occupancy, appraisal, or lender approval, so it cannot decide the highest price you can safely or officially borrow.',
          'Use the monthly result as one budget input. For a rough income-and-debt screen, use the House Affordability Calculator, then use VA eligibility records and lender preapproval for the real decision.',
        ],
        links: [
          { href: '/tools/house-affordability-calculator/', label: 'Test a rough home-price budget from income and debts' },
          { href: 'https://www.va.gov/housing-assistance/home-loans/eligibility/', label: 'VA home loan eligibility and Certificate of Eligibility guidance' },
        ],
      },
      {
        title: 'How the VA funding fee changes the estimate',
        paragraphs: [
          'Checked July 10, 2026: the current VA purchase-loan chart is still marked effective April 7, 2023. For a purchase with less than 5% down, it lists 2.15% for first use and 3.3% after first use. At 5% down or more it lists 1.5%, and at 10% down or more it lists 1.25%. An official exemption can make the fee zero.',
          'The VA says the percentage applies to the loan amount, not the purchase price. Financing the fee raises the starting loan balance and payment. On a purchase loan, the funding fee may be financed, but other closing costs cannot simply be rolled into the VA loan amount.',
        ],
        links: [
          { href: 'https://www.va.gov/housing-assistance/home-loans/funding-fee-and-closing-costs/', label: 'Check the current VA funding-fee chart and closing-cost rules' },
        ],
      },
      {
        title: 'A practical VA loan estimate workflow',
        paragraphs: [
          'Run the calculator once with the home price, rate, tax, and insurance you expect. Then change only the down payment, use status, exemption, or financed-fee choice so you can see which assumption moved the loan balance or payment.',
          'When lenders provide Loan Estimates, compare the same loan type and assumptions. Check loan amount, rate, principal and interest, total monthly payment, origination charges, closing costs, and the five-year comparison instead of choosing by one monthly number.',
        ],
        links: [
          { href: 'https://www.consumerfinance.gov/owning-a-home/compare/', label: 'CFPB guide to choosing and comparing loan offers' },
          { href: 'https://www.consumerfinance.gov/owning-a-home/loan-estimate/', label: 'CFPB Loan Estimate explainer' },
        ],
      },
    ],
    sidecarText:
      'Keep the VA Mortgage Calculator open beside this guide. Try the $360,000 no-down-payment example, then change only funding-fee status or down payment so you can see what moved before comparing lender paperwork.',
    summary: 'Learn how a VA purchase funding fee can affect loan amount and payment.',
    purpose:
      'The VA Mortgage Calculator estimates a common VA-backed purchase scenario. It is useful for checking payment, funding fee, and financed-fee effects before you compare the result with VA and lender paperwork.',
    enter: [
      'Enter home price, down payment, rate, term, property tax, and insurance.',
      'Choose first use or later use, funding-fee exemption, and whether to finance the funding fee.',
      'Choose exemption only when official VA or lender paperwork says the VA funding fee does not apply.',
    ],
    example: [
      '$360,000 with no down payment, first VA use, 6.25%, 30 years, $4,200 yearly tax, and $140 monthly insurance uses the 2.15% first-use funding-fee rate.',
      'That fee is $7,740. If it is financed, the loan starts at $367,740 and the estimate is about $2,754.24 per month with the entered tax and insurance.',
      'With 5% down on the same price, the VA funding-fee rate in this simplified purchase model drops to 1.5%, or about $5,130.',
    ],
    read: [
      'Funding fee rate is chosen from down payment, first-use status, and exemption setting.',
      'Funding fee dollars show the one-time fee amount in this simplified purchase model.',
      'Total monthly payment changes if the fee is financed because the loan balance is higher.',
      'Loan-to-value still helps you see how much of the home price is being borrowed before other closing costs.',
    ],
    mistakes: [
      'Do not use this to prove VA eligibility or exemption status.',
      'Do not forget the Certificate of Eligibility, appraisal, occupancy rules, lender overlays, seller credits, concessions, discount points, title fees, escrow setup, and cash needed at closing.',
      'Do not use purchase funding-fee logic for every VA refinance type, assumption, manufactured-home case, Native American Direct Loan, or Vendee loan.',
    ],
    next: [
      'Use FHA Loan Calculator for another government-backed loan comparison.',
      'Use Mortgage Calculator for a plain mortgage estimate.',
      'Use Down Payment Calculator to test how cash down changes the loan-to-value.',
    ],
  },
  'home-equity-loan-calculator': {
    summary: 'Learn how home value, mortgage balance, loan amount, and CLTV shape a fixed home equity loan estimate.',
    purpose:
      'The Home Equity Loan Calculator is for a lump-sum second loan. It shows the fixed payment, rough borrowing room, and combined loan-to-value after the new loan.',
    enter: [
      'Enter home value and current mortgage balance first. These two numbers set the equity picture.',
      'Enter the desired loan amount, rate, term, and max combined loan-to-value percent.',
      'Use a realistic home value. If the home value is too high, the borrowing-room estimate will look safer than it is.',
    ],
    example: [
      '$450,000 home value, $260,000 mortgage balance, and an 85% max CLTV gives about $122,500 of estimated borrowing room.',
      'A $50,000 requested loan at 8.25% for 10 years estimates about $613 per month before lender fees and closing costs.',
    ],
    read: [
      'Available equity at limit is the rough borrowing room under the CLTV cap you entered.',
      'Combined LTV shows the first mortgage plus the requested equity loan compared with home value.',
      'Monthly payment and total interest are for the new equity loan only, not the original mortgage.',
    ],
    mistakes: [
      'Do not forget that the home is collateral. Missed payments can put the home at risk.',
      'Do not compare by payment alone when upfront fees, APR, closing costs, and rate type differ.',
      'Do not assume an estimated home value, online valuation, or CLTV cap means approval.',
      'Do not assume interest is tax deductible unless the loan use and IRS rules match.',
    ],
    next: ['Use HELOC Calculator if the borrowing is a line of credit.', 'Use Loan Calculator for a non-home-secured comparison.'],
  },
  'heloc-calculator': {
    summary: 'Learn how a HELOC draw, variable-rate assumption, equity limit, and repayment period affect payment estimates.',
    purpose:
      'The HELOC Calculator separates the draw-period interest-only estimate from the later repayment estimate. That matters because the cheap-looking draw payment can jump when principal has to be repaid.',
    enter: [
      'Enter home value, current mortgage balance, credit line, current draw, rate, repayment years, and max CLTV.',
      'Use current draw for the amount already borrowed, not the full credit line. A $80,000 line with $30,000 drawn should not be treated like $80,000 of debt.',
      'Use the rate as a planning rate because many HELOCs are variable. Check the index, margin, teaser period, and rate cap in the lender papers.',
    ],
    example: [
      'Try this example: $450,000 home value, $260,000 mortgage balance, $80,000 credit line, $30,000 current draw, 9% rate, 15-year repayment, and 85% max CLTV.',
      'The draw-period interest-only estimate is $225.00/month. If that same $30,000 draw is repaid over 15 years at 9%, the repayment estimate is about $304.28/month.',
      'The available-equity estimate is $122,500 at an 85% CLTV cap, and the CLTV on the current draw is 64.44%.',
    ],
    read: [
      'Interest-only payment is based only on the current draw and rate.',
      'Repayment payment estimate shows what the drawn balance might cost if paid down over the repayment period.',
      'Combined LTV on draw uses current mortgage balance plus current draw, not the full credit line.',
      'Available equity is a rough borrowing-room screen. A lender can still use a different appraisal, credit rule, income review, or CLTV cap.',
    ],
    mistakes: [
      'Do not treat the interest-only payment as the forever payment.',
      'Do not ignore variable rates, teaser rates, index and margin terms, line freezes, minimum draws, annual fees, transaction fees, balloon payments, and lender line rules.',
      'Do not forget that missing payments can put the home at risk.',
      'Do not assume HELOC interest is tax deductible unless the money use and IRS rules match.',
    ],
    next: [
      'Use Home Equity Loan Calculator for a fixed lump-sum option.',
      'Use APR Calculator if fees make a quote hard to compare.',
      'Before signing, compare the lender disclosure, draw period, repayment period, variable-rate terms, right to cancel, fees, and what happens if the line is frozen.',
    ],
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
    summary: 'Learn how upfront cost, yearly cash flow, and horizon years create a simple payback time.',
    purpose:
      'The Payback Period Calculator answers a plain recovery question: how many years until steady yearly cash flow earns back the starting cost?',
    enter: [
      'Enter the initial cost as the upfront money paid before savings or extra cash begins.',
      'Enter annual cash flow as the steady yearly savings or extra cash the project is expected to create.',
      'Enter horizon years to check whether the project is ahead or still behind after a set number of years.',
    ],
    example: [
      '$15,000 upfront cost and $3,600 yearly savings gives about 4.17 years to pay back.',
      'With an 8-year horizon, the simple net check is $3,600 x 8 - $15,000, or $13,800 ahead before taxes, repairs, financing, or discounting.',
    ],
    read: [
      'Payback years is initial cost divided by annual cash flow.',
      'Net after horizon is annual cash flow times horizon years, minus the initial cost.',
      'A shorter payback is easier to understand, but it does not mean the project is automatically best.',
      'If the cash flow changes each year, an Excel-style cash-flow table or IRR tool is a better fit than this steady-cash-flow calculator.',
    ],
    mistakes: [
      'Do not treat simple payback as profit. It is a recovery-time number first.',
      'Do not forget that simple payback ignores the time value of money and discounted payback.',
      'Do not ignore cash flows that happen after the payback point.',
      'Do not use one steady annual cash-flow number for a project that has uneven returns, major repairs, or a resale value at the end.',
    ],
    next: [
      'Use ROI Calculator when you want gain compared with cost.',
      'Use IRR Calculator for uneven cash flows.',
      'Use Present Value Calculator to include discounting.',
    ],
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
    summary: 'Learn how a UK repayment mortgage estimate uses property price, deposit, rate, term, and monthly fees.',
    purpose:
      'The UK Mortgage Calculator estimates a capital-and-interest repayment mortgage. It subtracts the deposit from the property price, calculates the monthly repayment, and adds any monthly fees entered.',
    enter: [
      'Enter the property price and deposit in pounds.',
      'Enter the annual mortgage rate as a percent, such as 5.2 for 5.2%.',
      'Enter the repayment term in years, then add monthly fees only when the fee really repeats every month.',
    ],
    example: [
      'A £300,000 property with a £60,000 deposit creates a £240,000 loan and 80% LTV.',
      'At 5.2% over 25 years, the repayment estimate is about £1,431.12 per month and about £189,337.09 total interest.',
      'If a £20 monthly fee is added to the higher-deposit example, the total monthly estimate becomes about £1,612.18.',
    ],
    read: [
      'Monthly repayment is the loan payment before the optional monthly fee field.',
      'Total monthly payment includes the optional monthly fee field, but not one-off product, legal, survey, or stamp duty costs.',
      'Loan-to-value shows the loan amount compared with property price, which is useful when comparing deposit scenarios and possible lender deals.',
    ],
    mistakes: [
      'Do not use this as a lender affordability check or mortgage illustration.',
      'Do not forget stamp duty, arrangement fees, valuation fees, surveys, insurance, solicitor costs, leasehold costs, product rules, or rate-change risk.',
      'Do not use this for interest-only mortgages; it is for repayment payment math.',
      'Do not enter a deposit equal to or larger than the property price.',
    ],
    next: ['Use Down Payment Calculator to compare deposit and LTV.', 'Use Mortgage Calculator for the U.S.-style version.', 'Use Canadian Mortgage Calculator if the loan follows Canadian payment conventions.'],
  },
  'canadian-mortgage-calculator': {
    summary: 'Learn how Canadian mortgage payment math uses down payment, amortization, payment frequency, and semi-annual compounding.',
    purpose:
      'The Canadian Mortgage Calculator estimates the base mortgage payment before default insurance, property tax, closing costs, and lender approval. It uses Canadian-style semi-annual compounding, so it is not the same as a quick U.S.-style monthly-rate shortcut.',
    enter: [
      'Enter the property price and down payment in Canadian dollars.',
      'Enter the nominal annual mortgage rate as a percent, such as 5.1 for 5.1%.',
      'Enter the amortization in years, then choose the payment frequency you want to compare.',
    ],
    example: [
      'For a $600,000 property with $120,000 down, the estimated loan amount is $480,000 and the loan-to-value is 80%.',
      'At 5.1% over 25 years, the calculator estimates about $2,819.09 per month and about $365,727.47 in total interest.',
    ],
    read: [
      'The payment is for the selected frequency. A biweekly answer is every two weeks, not a monthly payment.',
      'Loan-to-value shows the loan amount as a percent of property price. Under 80% LTV usually means a down payment of 20% or more.',
      'Total interest depends on amortization length and does not include future renewal-rate changes when the term ends.',
    ],
    mistakes: [
      'Do not use a U.S. monthly-compounding mortgage calculator for this exact comparison.',
      'Do not forget mortgage default insurance if your down payment is under 20%.',
      'Do not treat this as lender qualification. Canadian lenders can use a stress-test rate that is higher than the contract rate.',
      'Do not compare payment frequencies without checking whether the lender means regular or accelerated payments.',
    ],
    next: ['Use Down Payment Calculator to compare deposit size and loan-to-value.', 'Use Mortgage Calculator for a plain U.S.-style mortgage estimate.'],
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
      '$100 with 40% off plus another 20% off leaves $48 before tax, so the real discount is 52%, not 60%.',
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
    'Use it to check the numbers you enter, not as a lender decision, tax filing, contract term, or professional recommendation.';

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
  if (tool.slug === 'business-loan-calculator') {
    return 'Business Loan Calculator Guide';
  }

  if (tool.slug === 'canadian-mortgage-calculator') {
    return 'Canadian Mortgage Calculator Guide';
  }

  if (tool.slug === 'down-payment-calculator') {
    return 'Down Payment Calculator Guide';
  }

  if (tool.slug === 'auto-loan-calculator') {
    return 'Auto Loan Calculator Guide';
  }

  if (tool.slug === 'ad-revenue-calculator') {
    return 'Ad Revenue Calculator Guide';
  }

  if (tool.slug === 'sales-tax-calculator') {
    return 'Sales Tax Calculator Guide';
  }

  if (tool.slug === 'interest-rate-calculator') {
    return 'Interest Rate Calculator Guide';
  }

  if (tool.slug === 'income-tax-calculator') {
    return 'Income Tax Calculator Guide';
  }

  if (tool.slug === 'marriage-tax-calculator') {
    return 'Marriage Tax Calculator Guide';
  }

  if (tool.slug === 'investment-calculator') {
    return 'Investment Calculator Guide';
  }

  if (tool.slug === 'house-affordability-calculator') {
    return 'House Affordability Calculator Guide';
  }

  if (tool.slug === 'savings-calculator') {
    return 'Savings Calculator Guide';
  }

  if (tool.slug === 'apy-calculator') {
    return 'APY Calculator Guide';
  }

  if (tool.slug === 'rent-calculator') {
    return 'Rent Calculator Guide';
  }

  if (tool.slug === 'annuity-calculator') {
    return 'Annuity Calculator Guide';
  }

  if (tool.slug === 'credit-card-calculator') {
    return 'Credit Card Calculator Guide';
  }

  if (tool.slug === 'credit-cards-payoff-calculator') {
    return 'Credit Cards Payoff Calculator Guide';
  }

  if (tool.slug === 'debt-payoff-calculator') {
    return 'Debt Payoff Calculator Guide';
  }

  if (tool.slug === 'debt-consolidation-calculator') {
    return 'Debt Consolidation Calculator Guide';
  }

  if (tool.slug === 'repayment-calculator') {
    return 'Repayment Calculator Guide';
  }

  if (tool.slug === 'student-loan-calculator') {
    return 'Student Loan Calculator Guide';
  }

  if (tool.slug === 'college-cost-calculator') {
    return 'College Cost Calculator Guide';
  }

  if (tool.slug === 'interest-calculator') {
    return 'Interest Calculator Guide';
  }

  if (tool.slug === 'simple-interest-calculator') {
    return 'Simple Interest Calculator Guide';
  }

  if (tool.slug === 'cd-calculator') {
    return 'CD Calculator Guide';
  }

  if (tool.slug === 'bond-calculator') {
    return 'Bond Calculator Guide';
  }

  if (tool.slug === 'mutual-fund-calculator') {
    return 'Mutual Fund Calculator Guide';
  }

  if (tool.slug === 'roth-ira-calculator') {
    return 'Roth IRA Calculator Guide';
  }

  if (tool.slug === 'ira-calculator') {
    return 'IRA Calculator Guide';
  }

  if (tool.slug === 'vat-calculator') {
    return 'VAT Calculator Guide';
  }

  if (tool.slug === 'cash-back-or-low-interest-calculator') {
    return 'Cash Back or Low Interest Calculator Guide';
  }

  if (tool.slug === 'auto-lease-calculator') {
    return 'Auto Lease Calculator Guide';
  }

  if (tool.slug === 'depreciation-calculator') {
    return 'Depreciation Calculator Guide';
  }

  if (tool.slug === 'margin-calculator') {
    return 'Margin Calculator Guide';
  }

  if (tool.slug === 'discount-calculator') {
    return 'Discount Calculator Guide';
  }

  if (tool.slug === 'break-even-calculator') {
    return 'Break-Even Calculator Guide';
  }

  if (tool.slug === 'profit-goal-calculator') {
    return 'Profit Goal Calculator Guide';
  }

  if (tool.slug === 'liquidity-ratios-calculator') {
    return 'Liquidity Ratios Calculator Guide';
  }

  if (tool.slug === 'debt-ratios-calculator') {
    return 'Debt Ratios Calculator Guide';
  }

  if (tool.slug === 'operations-ratios-calculator') {
    return 'Operations Ratios Calculator Guide';
  }

  if (tool.slug === 'profitability-ratios-calculator') {
    return 'Profitability Ratios Calculator Guide';
  }

  if (tool.slug === 'stock-ratios-calculator') {
    return 'Stock Ratios Calculator Guide';
  }

  if (tool.slug === 'social-security-calculator') {
    return 'Social Security Calculator Guide';
  }

  if (tool.slug === 'rmd-calculator') {
    return 'RMD Calculator Guide';
  }

  if (tool.slug === 'average-return-calculator') {
    return 'Average Return Calculator Guide';
  }

  if (tool.slug === 'pension-calculator') {
    return 'Pension Calculator Guide';
  }

  if (tool.slug === 'annuity-payout-calculator') {
    return 'Annuity Payout Calculator Guide';
  }

  const standardTitle = `How to use the ${tool.name}`;
  const pageTitle = `${standardTitle} | Access Free Tools`;

  return pageTitle.length > 65 ? `Use ${tool.name}` : standardTitle;
}

function buildFinanceMetaDescription(tool: (typeof financeTools)[number], summary: string) {
  if (tool.slug === 'business-loan-calculator') {
    return 'Estimate a business loan payment from amount, rate, term, and origination fee, with cash received, total interest, and total cost checks.';
  }

  if (tool.slug === 'canadian-mortgage-calculator') {
    return 'Estimate a Canadian mortgage payment from price, down payment, rate, amortization, and payment frequency, with LTV and interest checks.';
  }

  if (tool.slug === 'down-payment-calculator') {
    return 'Estimate down payment, loan amount, LTV, closing costs, and cash needed for a home purchase, with 20% and 3.5% examples.';
  }

  if (tool.slug === 'loan-calculator') {
    return 'Estimate a fixed loan payment from amount, rate, and term, with total paid, total interest, and APR-versus-interest cautions.';
  }

  if (tool.slug === 'finance-calculator') {
    return 'Project a future balance from starting money, monthly deposits, annual rate, and time, with contribution and growth checks.';
  }

  if (tool.slug === 'bond-calculator') {
    return 'Estimate bond coupon income, current yield, total coupon payments, and rough YTM, with clear limits for savings bonds and callable bonds.';
  }

  if (tool.slug === 'mutual-fund-calculator') {
    return 'Project mutual fund growth, monthly contributions, expense-ratio drag, and total contributions, with clear limits for taxes and real fund performance.';
  }

  if (tool.slug === 'roth-ira-calculator') {
    return 'Project Roth IRA growth from balance, annual contributions, return, and years, with 2026 IRS limit and MAGI cautions kept separate.';
  }

  if (tool.slug === 'ira-calculator') {
    return 'Project IRA growth from balance, annual contributions, expected return, and years, with 2026 IRS limit and deduction cautions kept separate.';
  }

  if (tool.slug === 'vat-calculator') {
    return 'Add or remove VAT from a price, with 20%, 5%, and custom-rate examples plus net, VAT amount, and gross amount checks.';
  }

  if (tool.slug === 'cash-back-or-low-interest-calculator') {
    return 'Compare a cash-back rebate with a low-interest APR offer, including total cost, savings, dealer-rule, and eligibility checks.';
  }

  if (tool.slug === 'auto-lease-calculator') {
    return 'Estimate a car lease payment from price, residual value, money factor, fees, tax, and term, with lease quote checks.';
  }

  if (tool.slug === 'depreciation-calculator') {
    return 'Learn straight-line and declining-balance depreciation with cost, salvage value, useful life, accumulated depreciation, and book value examples.';
  }

  if (tool.slug === 'margin-calculator') {
    return 'Learn profit margin and markup with selling price, cost, gross profit, COGS, and clear examples that show why margin and markup differ.';
  }

  if (tool.slug === 'discount-calculator') {
    return 'Learn final price, total savings, effective discount, stacked discounts, tax, and sale-rule checks before checkout.';
  }

  if (tool.slug === 'break-even-calculator') {
    return 'Learn break-even units, sales revenue, contribution margin, fixed costs, variable costs, and zero-profit limits with clear examples.';
  }

  if (tool.slug === 'profit-goal-calculator') {
    return 'Learn target-profit units, required sales, contribution margin, fixed costs, variable costs, rounding, and business limits with examples.';
  }

  if (tool.slug === 'liquidity-ratios-calculator') {
    return 'Learn current ratio, quick ratio, cash ratio, working capital, balance sheet timing, inventory limits, and receivable cautions.';
  }

  if (tool.slug === 'debt-ratios-calculator') {
    return 'Learn debt ratio, debt-to-equity, times interest earned, EBIT, interest expense, balance sheet timing, and debt-risk limits.';
  }

  if (tool.slug === 'operations-ratios-calculator') {
    return 'Learn inventory turnover, asset turnover, receivables turnover, collection days, average balances, and operating-ratio limits.';
  }

  if (tool.slug === 'profitability-ratios-calculator') {
    return 'Learn gross margin, operating margin, net margin, ROA, ROE, EPS, P/E, statement timing, and profit-ratio limits.';
  }

  if (tool.slug === 'stock-ratios-calculator') {
    return 'Learn P/E, price-to-sales, price-to-book, dividend yield, payout ratio, per-share inputs, and stock-ratio limits.';
  }

  if (tool.slug === 'social-security-calculator') {
    return 'Estimate Social Security retirement benefits at age 62, full retirement age, or 70 using birth year and an SSA FRA benefit estimate.';
  }

  if (tool.slug === 'rmd-calculator') {
    return 'Estimate an RMD from prior Dec. 31 balance and age using the IRS Uniform Lifetime Table, with factor and limit checks.';
  }

  if (tool.slug === 'average-return-calculator') {
    return 'Learn average return, cumulative return, net gain, and CAGR with contribution and withdrawal examples plus clear IRR limits.';
  }

  if (tool.slug === 'irr-calculator') {
    return 'Estimate internal rate of return from an initial outflow and five regular cash-flow periods, with periodic and annualized IRR checks.';
  }

  if (tool.slug === 'fha-loan-calculator') {
    return 'Estimate an FHA-style payment with down payment, upfront MIP, monthly MIP, tax, insurance, and clear limits on approval and county-limit checks.';
  }

  if (tool.slug === 'auto-loan-calculator') {
    return 'Estimate a car payment from price, tax, fees, down payment, trade-in, rate, and term, with total interest and total paid checks.';
  }

  if (tool.slug === 'mortgage-calculator') {
    return 'Estimate a mortgage payment from home price, down payment, rate, taxes, insurance, PMI, and HOA, with PITI, LTV, and Loan Estimate limits.';
  }

  if (tool.slug === 'ad-revenue-calculator') {
    return 'Estimate website ad revenue from page views, CTR, CPC, and page RPM, with a 1,000-view example and clear AdSense-style limits.';
  }

  if (tool.slug === 'interest-rate-calculator') {
    return 'Estimate the annual rate behind a loan payment quote from amount financed, monthly payment, and term, with APR and fee cautions.';
  }

  if (tool.slug === 'income-tax-calculator') {
    return 'Estimate 2026 federal income tax from filing status, deduction, credits, taxable income, effective rate, and marginal bracket.';
  }

  if (tool.slug === 'marriage-tax-calculator') {
    return 'Compare two single 2026 federal tax estimates with married filing jointly, including bracket, deduction, bonus, and penalty limits.';
  }

  if (tool.slug === 'investment-calculator') {
    return 'Project an investment balance from starting money, monthly deposits, estimated return, and time, with risk, fee, inflation, and tax limits.';
  }

  if (tool.slug === 'mortgage-calculator-uk') {
    return 'Estimate a UK repayment mortgage from property price, deposit, rate, term, fees, LTV, and interest, with affordability and stamp duty limits.';
  }

  if (tool.slug === 'mortgage-payoff-calculator') {
    return 'Estimate mortgage payoff time, interest saved, and months saved from extra monthly principal or a one-time payment.';
  }

  if (tool.slug === '401k-calculator') {
    return 'Project 401K growth from salary contribution percent, employer match, current balance, return, and years, with IRS and plan-rule limits.';
  }

  if (tool.slug === 'house-affordability-calculator') {
    return 'Estimate a home price from income, debts, down payment, rate, tax, insurance, HOA, and DTI, with budget and lender-limit cautions.';
  }

  if (tool.slug === 'savings-calculator') {
    return 'Project savings from current balance, monthly deposit, rate, and time. See estimated interest and whether the goal is still short.';
  }

  if (tool.slug === 'apy-calculator') {
    return 'Estimate APY from a stated annual interest rate and compounding frequency, with term interest, ending balance, and disclosure limits.';
  }

  if (tool.slug === 'rent-calculator') {
    return 'Estimate max rent from income, rent target, debts, and utilities, with deposit, lease-fee, and landlord-rule cautions.';
  }

  if (tool.slug === 'annuity-calculator') {
    return 'Estimate annuity future value and present value from fixed payments, rate, years, frequency, and ordinary or annuity-due timing.';
  }

  if (tool.slug === 'credit-card-calculator') {
    return 'Estimate credit card payoff months, interest, total paid, and final payment from balance, APR, payment, and new charges.';
  }

  if (tool.slug === 'credit-cards-payoff-calculator') {
    return 'Estimate multi-card payoff months, interest, total paid, and final payment from combined balance, weighted APR, regular payment, and extra payment.';
  }

  if (tool.slug === 'debt-payoff-calculator') {
    return 'Estimate fixed-debt payoff months, interest, total paid, and final payment from balance, APR, regular payment, and extra payment.';
  }

  if (tool.slug === 'debt-consolidation-calculator') {
    return 'Learn how to compare a consolidation loan with your current payoff path, including APR, fees, term length, and total cost.';
  }

  if (tool.slug === 'repayment-calculator') {
    return 'Estimate fixed-balance repayment months, interest, total paid, and final payment from balance, APR, regular payment, and extra payment.';
  }

  if (tool.slug === 'student-loan-calculator') {
    return 'Estimate student loan payment, payoff time, total interest, and extra-payment savings, with Federal Student Aid and servicer cautions.';
  }

  if (tool.slug === 'college-cost-calculator') {
    return 'Estimate future college cost, first-year cost, savings gap, and aid-limit checks before using school net price calculators.';
  }

  if (tool.slug === 'interest-calculator') {
    return 'Compare simple and compound interest from principal, annual interest rate, years, compounding frequency, and deposits.';
  }

  if (tool.slug === 'simple-interest-calculator') {
    return 'Calculate simple interest from principal, annual interest rate, and years, with percent-entry, APR, and compounding limits.';
  }

  if (tool.slug === 'cd-calculator') {
    return 'Estimate CD maturity value, interest earned, and early-withdrawal penalty from deposit amount, APY, and term.';
  }

  if (tool.slug === 'pension-calculator') {
    return 'Estimate a defined-benefit pension from final average salary, credited service, and plan multiplier, with monthly and replacement-rate checks.';
  }

  if (tool.slug === 'annuity-payout-calculator') {
    return 'Estimate a fixed annuity payout from balance, rate, term, and payment frequency, with total paid, interest, and contract-limit cautions.';
  }

  const base = summary.replace(/\.$/, '');
  const description = `${base}. Includes input tips, examples, result checks, and finance estimate limits for the ${tool.name}.`;
  return description.length > 160 ? `${description.slice(0, 156).trim()}...` : description;
}

export const financeBlogPosts: BlogPostDefinition[] = financeTools.map((tool) => {
  const detail = getGuideDetail(tool);

  return {
    slug: `how-to-use-${tool.slug}`,
    title: detail.title ?? getGuideTitle(tool),
    label: `${tool.name.replace(' Calculator', '')} guide`,
    summary: detail.summary,
  };
});

export const financeBlogGuides: FinanceGuideDefinition[] = financeTools.map((tool) => {
  const detail = getGuideDetail(tool);
  const primaryExample = tool.examples[0];
  const primaryExampleText = formatExample(primaryExample);
  const sourceLinks = getSourceLinks(tool.slug);
  const isSalesTaxGuide = tool.slug === 'sales-tax-calculator';
  const isAdRevenueGuide = tool.slug === 'ad-revenue-calculator';
  const isAutoLoanGuide = tool.slug === 'auto-loan-calculator';
  const isMortgageGuide = tool.slug === 'mortgage-calculator';
  const isMortgagePayoffGuide = tool.slug === 'mortgage-payoff-calculator';
  const is401kGuide = tool.slug === '401k-calculator';
  const isHouseAffordabilityGuide = tool.slug === 'house-affordability-calculator';
  const isSavingsGuide = tool.slug === 'savings-calculator';
  const isApyGuide = tool.slug === 'apy-calculator';
  const isRentGuide = tool.slug === 'rent-calculator';
  const isAnnuityGuide = tool.slug === 'annuity-calculator';
  const isCreditCardGuide = tool.slug === 'credit-card-calculator';
  const isCreditCardsPayoffGuide = tool.slug === 'credit-cards-payoff-calculator';
  const isDebtPayoffGuide = tool.slug === 'debt-payoff-calculator';
  const isDebtConsolidationGuide = tool.slug === 'debt-consolidation-calculator';
  const isRepaymentGuide = tool.slug === 'repayment-calculator';
  const isStudentLoanGuide = tool.slug === 'student-loan-calculator';
  const isCollegeCostGuide = tool.slug === 'college-cost-calculator';
  const isInterestGuide = tool.slug === 'interest-calculator';
  const isSimpleInterestGuide = tool.slug === 'simple-interest-calculator';
  const isCdGuide = tool.slug === 'cd-calculator';
  const isBondGuide = tool.slug === 'bond-calculator';
  const isMutualFundGuide = tool.slug === 'mutual-fund-calculator';
  const isRothIraGuide = tool.slug === 'roth-ira-calculator';
  const isIraGuide = tool.slug === 'ira-calculator';
  const isVatGuide = tool.slug === 'vat-calculator';
  const isPensionGuide = tool.slug === 'pension-calculator';
  const isAnnuityPayoutGuide = tool.slug === 'annuity-payout-calculator';
  const isUkMortgageGuide = tool.slug === 'mortgage-calculator-uk';
  const isBusinessLoanGuide = tool.slug === 'business-loan-calculator';
  const isLiquidityGuide = tool.slug === 'liquidity-ratios-calculator';
  const isDebtRatiosGuide = tool.slug === 'debt-ratios-calculator';
  const isOperationsRatiosGuide = tool.slug === 'operations-ratios-calculator';
  const isProfitabilityRatiosGuide = tool.slug === 'profitability-ratios-calculator';
  const isStockRatiosGuide = tool.slug === 'stock-ratios-calculator';
  const isSocialSecurityGuide = tool.slug === 'social-security-calculator';
  const isRmdGuide = tool.slug === 'rmd-calculator';
  const isIrrGuide = tool.slug === 'irr-calculator';
  const isCanadianMortgageGuide = tool.slug === 'canadian-mortgage-calculator';
  const isDownPaymentGuide = tool.slug === 'down-payment-calculator';
  const isLoanGuide = tool.slug === 'loan-calculator';
  const isFinanceGuide = tool.slug === 'finance-calculator';
  const isFhaLoanGuide = tool.slug === 'fha-loan-calculator';
  const isEstateTaxGuide = tool.slug === 'estate-tax-calculator';
  const isInterestRateGuide = tool.slug === 'interest-rate-calculator';
  const isIncomeTaxGuide = tool.slug === 'income-tax-calculator';
  const isMarriageTaxGuide = tool.slug === 'marriage-tax-calculator';
  const isInvestmentGuide = tool.slug === 'investment-calculator';
  const isCurrencyGuide = tool.slug === 'currency-calculator';

  return {
    slug: `how-to-use-${tool.slug}`,
    toolSlug: tool.slug,
    label: `${tool.name.replace(' Calculator', '')} guide`,
    title: detail.title ?? getGuideTitle(tool),
    description: detail.metaDescription ?? buildFinanceMetaDescription(tool, detail.summary),
    path: `/blog/how-to-use-${tool.slug}/`,
    intro: detail.intro ?? (isMortgageGuide
      ? 'A mortgage payment is not just the loan. This guide shows how home price, down payment, rate, term, property tax, insurance, PMI, and HOA dues turn into one monthly estimate.'
      : isMortgagePayoffGuide
      ? 'Paying extra on a mortgage only helps if the extra money really reduces principal. This guide shows how balance, rate, term, monthly extra principal, and one-time principal payments change payoff time and interest.'
      : is401kGuide
      ? 'A 401K estimate is not just one magic retirement number. This guide shows how salary, contribution percent, employer match, return, and years build a projection before IRS limits and plan rules have the final say.'
      : isHouseAffordabilityGuide
      ? 'A house budget is not just the biggest mortgage a lender might allow. This guide shows how income, existing debts, down payment, rate, property tax, insurance, HOA, and a debt-to-income target shape a home price estimate.'
      : isSavingsGuide
      ? 'A savings goal is easier to trust when the deposits, interest, and gap are split apart. This guide shows how current savings, monthly deposits, rate, time, and a target amount turn into a plan you can check.'
      : isApyGuide
      ? 'APY is easy to misread when a bank offer also shows a stated interest rate. This guide shows how compounding turns a rate into estimated annual percentage yield, then what the result still leaves out.'
      : isRentGuide
      ? 'A rent number can look fine until debts, utilities, deposits, and lease fees hit. This guide shows how income, a rent target, monthly debts, and utilities turn into a rent ceiling you can compare with listings.'
      : isAnnuityGuide
      ? 'An annuity result is easy to misread if timing and payment frequency are mixed up. This guide shows how one fixed payment, a rate, years, payment count, and ordinary or annuity-due timing change future value and present value.'
      : isCreditCardGuide
      ? 'A credit card payoff estimate changes fast when APR, payment size, and new spending move. This guide shows how one card balance turns into payoff months, interest, total paid, and the last payment.'
      : isCreditCardsPayoffGuide
      ? 'A combined credit-card payoff estimate is useful only if the rough average is honest. This guide shows how combined balance, weighted APR, regular payment, and extra payment turn into payoff months, interest, total paid, and final payment.'
      : isDebtPayoffGuide
      ? 'A debt payoff estimate can look good even when the monthly payment barely beats the interest. This guide shows how one balance, one rate, a regular payment, and an extra payment turn into payoff months, interest, total paid, and final payment.'
      : isDebtConsolidationGuide
      ? 'A debt consolidation offer can look helpful because the monthly payment drops. This guide shows how current payoff, new APR, term, fees, monthly payment change, and total cost change decide whether the offer is actually better.'
      : isRepaymentGuide
      ? 'A repayment estimate can look fine while interest is quietly eating the payment. This guide shows how one balance, one annual rate, a regular payment, and an extra payment turn into payoff months, interest, total paid, and the last payment.'
      : isStudentLoanGuide
      ? 'A student loan payment is easier to check when the official-plan stuff is kept separate from the basic math. This guide shows how balance, rate, term, and extra payment change a standard student-loan estimate before you compare Federal Student Aid or servicer options.'
      : isCollegeCostGuide
      ? 'College cost planning gets confusing when sticker price, net price, savings, aid, and loans are all mixed together. This guide keeps the simple projection separate: today\'s cost, years until school, yearly cost growth, savings, and the gap before official aid numbers.'
      : isInterestGuide
      ? 'Interest math gets messy when simple interest, compound interest, APR, APY, and investment return are treated like one thing. This guide keeps the job clear: pick the right mode, enter the annual interest rate, then read what the result leaves out.'
      : isSimpleInterestGuide
      ? 'Simple interest is one of the easiest money formulas to check, but it is also easy to overuse. This guide keeps the job small: principal, annual interest rate, time in years, simple interest, and ending balance.'
      : isCdGuide
      ? 'A CD estimate can look simple until APY, term length, renewal, grace periods, and early-withdrawal penalties show up. This guide keeps maturity value separate from the penalty what-if so the result is easier to read.'
      : isBondGuide
      ? 'Bond yield math gets messy when coupon rate, market price, current yield, rough YTM, and savings bond lookup are treated like one thing. This guide keeps plain bond math separate so the answer is easier to trust.'
      : isMutualFundGuide
      ? 'A mutual fund projection is easy to overtrust if return, fees, taxes, and real fund behavior are mixed together. This guide keeps the what-if math clear: starting money, monthly deposits, expected return, expense ratio, years, and the fee drag that appears over time.'
      : isRothIraGuide
      ? 'A Roth IRA projection can look like a tax answer when it is really just growth math. This guide keeps the simple projection separate from 2026 IRS limits, MAGI phase-outs, qualified distribution rules, and market risk.'
      : isIraGuide
      ? 'An IRA projection can look like a tax answer when it is really just growth math. This guide keeps the simple projection separate from 2026 IRS limits, traditional IRA deduction rules, Roth IRA eligibility, RMDs, taxes, and market risk.'
      : isVatGuide
      ? 'VAT math is easy to flip around. This guide keeps the job simple: add VAT when the price is before tax, remove VAT when the price already includes tax, then check the official rate before using the answer on an invoice.'
      : isPensionGuide
      ? 'A pension estimate is easy to overtrust if the plan formula is guessed. This guide shows how final average salary, credited service, and a plan multiplier turn into annual pension, monthly pension, and replacement rate.'
      : isAnnuityPayoutGuide
      ? 'An annuity payout estimate is easy to misread if fixed-term math is treated like a lifetime quote. This guide shows how balance, rate, term, and payment frequency turn into payout amount, total paid, and estimated interest.'
      : isUkMortgageGuide
      ? 'A UK repayment mortgage is not just the property price split across months. This guide shows how price, deposit, rate, term, and monthly fees turn into a payment, LTV, and interest estimate.'
      : isAutoLoanGuide
      ? 'A car payment can look fine while the full loan is expensive. This guide shows how price, down payment, trade-in, tax, fees, rate, and term turn into the monthly payment and total interest.'
      : isBusinessLoanGuide
      ? 'A business loan can look affordable until the fee and total interest show up. This guide shows how loan amount, rate, term, and origination fee turn into payment, cash received, and total cost.'
      : isLiquidityGuide
      ? 'Liquidity ratios can look stronger than the business really feels. This guide keeps current ratio, quick ratio, cash ratio, working capital, inventory, receivables, and cash timing separate so the answer is easier to read.'
      : isDebtRatiosGuide
      ? 'Debt ratios can sound scary or safe too quickly. This guide keeps debt ratio, debt-to-equity, and times interest earned separate so you can see what debt load and interest cover actually say.'
      : isOperationsRatiosGuide
      ? 'Operations ratios can look good or bad for the wrong reason. This guide keeps inventory turnover, asset turnover, receivables turnover, collection days, and equity multiplier separate so you can see what moved.'
      : isProfitabilityRatiosGuide
      ? 'Profitability ratios can make a company look great too quickly. This guide keeps gross margin, operating margin, net margin, ROA, ROE, EPS, and P/E separate so you can see which part is doing the work.'
      : isStockRatiosGuide
      ? 'Stock ratios can make a stock look cheap or expensive too quickly. This guide keeps P/E, P/S, P/B, dividend yield, and payout ratio separate so you can see what the price is being compared with.'
      : isSocialSecurityGuide
      ? 'A Social Security estimate is only useful if the starting number is real. This guide uses your SSA full-retirement-age benefit, then tests claiming at 62, full retirement age, or 70.'
      : isRmdGuide
      ? 'An RMD estimate is only useful if the balance date and age are right. This guide uses the prior December 31 balance and the IRS Uniform Lifetime Table factor to make a simple owner-style withdrawal estimate.'
      : isIrrGuide
      ? 'IRR is useful when money goes out first and comes back over regular periods. This guide keeps the setup simple: one starting outflow, five later cash flows, a period setting, and a clear warning when IRR is easy to misuse.'
      : isCanadianMortgageGuide
      ? 'A Canadian mortgage payment is not just price divided by months. This guide shows how down payment, amortization, payment frequency, and semi-annual compounding turn into the payment, LTV, and interest estimate.'
      : isDownPaymentGuide
      ? 'A down payment is only one part of the money you may need at closing. This guide shows how home price, down payment, LTV, and a rough closing-cost estimate turn into the cash-needed number.'
      : isLoanGuide
      ? 'A loan payment is not just “how much can I afford this month.” This guide shows how amount, rate, and term turn into monthly payment, total paid, and total interest.'
      : isFinanceGuide
      ? 'A finance projection is just a what-if check. This guide shows how starting money, monthly deposits, rate, and time turn into an ending balance, total contributions, and estimated growth.'
      : isFhaLoanGuide
      ? 'An FHA payment is not just price, rate, and term. This guide shows how a 3.5% down example, financed upfront MIP, monthly MIP, tax, and insurance turn into one monthly estimate.'
      : isSalesTaxGuide
      ? 'Sales tax math is simple once the rate is in the right format. Enter the before-tax price, use a current local rate, then check the tax amount and final total before you trust the receipt.'
      : isAdRevenueGuide
      ? 'Before you assume 10,000 page views means steady ad income, test the click rate and CPC separately. This guide shows the simple math, the 1,000-view example, and the reasons real ad reports can move.'
      : isEstateTaxGuide
      ? 'A huge estate number can look scary until you separate gross estate, deductions, prior taxable gifts, and the federal exclusion. This guide shows the rough 2026 federal screen and the parts it cannot handle.'
      : isInterestRateGuide
      ? 'A loan quote can hide the rate behind one neat monthly payment. This guide shows how amount financed, payment, and term turn into an estimated rate before fees or APR rules change the story.'
      : isIncomeTaxGuide
      ? 'Federal income tax is not one flat percent of your whole paycheck. This guide shows how filing status, deduction, credits, taxable income, effective rate, and marginal bracket fit together for a 2026 estimate.'
      : isMarriageTaxGuide
      ? 'Marriage tax math is not about guessing whether marriage is good or bad. This guide shows the exact small comparison this tool makes: two single 2026 federal estimates versus one married filing jointly estimate.'
      : isInvestmentGuide
      ? 'An investment projection can look powerful, but it is still a what-if. This guide shows how starting money, monthly deposits, estimated return, and years turn into ending balance, contributions, and growth.'
      : isCurrencyGuide
      ? 'A currency conversion is only as good as the rate direction you enter. This guide shows how source amount, target-per-source exchange rate, and optional percentage fee turn into before-fee and after-fee results without pretending to fetch live market rates.'
      : `${detail.summary} Use this guide as a plain-English walkthrough: enter the money values carefully, read the main estimate, then check what the estimate leaves out before you rely on it.`),
    quickStart: detail.quickStart ?? (isMortgageGuide
      ? [
          `Open the ${tool.name}.`,
          'Enter the home price and the down payment as dollar amounts.',
          'Enter the interest rate and loan term, such as 6.5% for 30 years.',
          'Add yearly property tax, then monthly insurance, PMI, and HOA only when those costs apply.',
          'Calculate, then read total monthly payment, principal and interest, total interest, and LTV before comparing it with a lender Loan Estimate.',
        ]
      : isMortgagePayoffGuide
      ? [
          'Open the Mortgage Payoff Calculator.',
          'Enter the current principal balance, rate, and years remaining.',
          'Add extra monthly principal or a one-time principal payment only when that is how you plan to pay.',
          'Calculate, then compare payoff time, months saved, and interest saved with the scheduled path.',
          'Ask your lender or servicer for the official payoff amount before sending final payoff money.',
        ]
      : is401kGuide
      ? [
          'Open the 401K Calculator.',
          'Enter your current balance and annual salary.',
          'Enter your salary contribution percent, employer match percent, and match limit.',
          'Add an estimated return and years to grow, then project the balance.',
          'Compare your annual employee contribution with current IRS limits and your employer plan before changing payroll.',
        ]
      : isHouseAffordabilityGuide
      ? [
          'Open the House Affordability Calculator.',
          'Enter annual gross income, existing monthly debts, and down payment.',
          'Add rate, term, debt-to-income target, property tax, monthly insurance, and HOA.',
          'Calculate, then compare affordable home price, loan amount, monthly housing budget, principal and interest, and tax/insurance/HOA.',
          'Check the result against closing costs, repairs, emergency savings, utilities, and a lender Loan Estimate before shopping hard.',
        ]
      : isSavingsGuide
      ? [
          'Open the Savings Calculator.',
          'Enter current savings and the monthly deposit you can keep making.',
          'Add the estimated annual rate, time in years, and target amount.',
          'Calculate, then compare projected balance, total deposits, estimated interest, and target gap.',
          'Check account fees, rate changes, withdrawals, APY wording, and minimum balances before trusting the exact interest amount.',
        ]
      : isApyGuide
      ? [
          'Open the APY Calculator.',
          'Enter the starting deposit you want to test.',
          'Enter the stated annual interest rate as a percent, such as 4 for 4%.',
          'Choose the compounding frequency and enter the term in days.',
          'Calculate, then compare estimated APY, term interest, and ending balance against the official account disclosure.',
        ]
      : isRentGuide
      ? [
          'Open the Rent Calculator.',
          'Enter the monthly income number you want to budget from.',
          'Add a rent target such as 25%, 30%, or 35%, then enter monthly debts and utilities.',
          'Calculate, then compare max monthly rent, annual rent, and income left after rent, debts, and utilities.',
          'Check deposits, application fees, renters insurance, parking, pets, moving costs, and the lease before treating the number as affordable.',
        ]
      : isAnnuityGuide
      ? [
          'Open the Annuity Calculator.',
          'Enter the fixed payment made each period, such as $500 each month.',
          'Add the annual rate, number of years, and payments each year.',
          'Choose ordinary timing for end-of-period payments or annuity due for beginning-of-period payments.',
          'Calculate, then compare future value, present value, total payments, payment count, and timing before reading any real annuity contract.',
        ]
      : isCreditCardGuide
      ? [
          'Open the Credit Card Calculator.',
          'Enter the card balance you are carrying now.',
          'Add the card APR as a percent, such as 22.9 for 22.9%.',
          'Enter the payment you can send each month and any new card spending you expect to keep adding.',
          'Calculate, then compare payoff months, interest, total paid, final payment, and whether new spending is keeping the balance alive.',
        ]
      : isCreditCardsPayoffGuide
      ? [
          'Open the Credit Cards Payoff Calculator.',
          'Add the balances from the cards you want to group together.',
          'Enter a weighted average APR, giving more weight to the cards with bigger balances.',
          'Enter the regular monthly card payment and the extra amount you can keep adding.',
          'Calculate, then compare payoff months, total interest, total paid, and final payment before deciding whether you need a card-by-card plan.',
        ]
      : isDebtPayoffGuide
      ? [
          'Open the Debt Payoff Calculator.',
          'Enter the current balance for the one debt you want to test.',
          'Enter the annual interest rate or APR as a normal percent.',
          'Enter the regular monthly payment and any extra payment you can keep making.',
          'Calculate, then compare payoff months, total interest, total paid, and final payment before you use the number in a real plan.',
        ]
      : isDebtConsolidationGuide
      ? [
          'Open the Debt Consolidation Calculator.',
          'Enter the total debt you would roll into the new loan.',
          'Enter the current weighted average APR and total current monthly payment.',
          'Enter the new loan APR, term, and any fees added to the new balance.',
          'Calculate, then compare the new monthly payment, monthly payment change, and total cost change before trusting the offer.',
        ]
      : isRepaymentGuide
      ? [
          'Open the Repayment Calculator.',
          'Enter the current balance still owed.',
          'Enter the annual interest rate or APR as a normal percent.',
          'Enter the regular monthly payment and any extra monthly payment you can really keep sending.',
          'Calculate, then compare payoff months, total interest, total paid, and final payment before treating the number like a plan.',
        ]
      : isStudentLoanGuide
      ? [
          'Open the Student Loan Calculator.',
          'Enter the current loan balance, not the original amount if you have already paid some down.',
          'Enter the annual interest rate from StudentAid.gov, your servicer, or your private-loan agreement.',
          'Use a standard repayment term such as 10 years, then add extra monthly payment only if you can really keep sending it.',
          'Calculate, then compare scheduled payment, payoff time, total interest, and interest saved before checking official plans.',
        ]
      : isCollegeCostGuide
      ? [
          'Open the College Cost Calculator.',
          'Enter a full one-year cost if you can: tuition, fees, housing, meals, books, supplies, transportation, and personal costs.',
          'Add years until school starts, years in school, and the yearly cost increase you want to test.',
          'Enter current savings, monthly savings, and estimated savings return.',
          'Calculate, then compare total estimated cost, first-year cost, projected savings, and the savings gap before checking school net price calculators and aid offers.',
        ]
      : isInterestGuide
      ? [
          'Open the Interest Calculator.',
          'Choose Simple when the question is principal x annual interest rate x time.',
          'Choose Compound when interest gets added back to the balance and can earn more interest later.',
          'Enter principal, annual interest rate, time in years, compounding frequency, and monthly deposits only where the mode asks for them.',
          'Calculate, then compare interest, ending balance, total contributions, and effective annual rate before treating the estimate like a real offer.',
        ]
      : isSimpleInterestGuide
      ? [
          'Open the Simple Interest Calculator.',
          'Enter the principal, which is the starting amount before interest.',
          'Enter the annual interest rate as a normal percent, such as 5 for 5%.',
          'Enter time in years. Use 1.5 for 18 months or 0.25 for 3 months.',
          'Calculate, then compare simple interest and ending balance before using any real loan, savings, or APR disclosure.',
        ]
      : isCdGuide
      ? [
          'Open the CD Calculator.',
          'Enter the deposit amount you plan to lock in.',
          'Enter the APY from the CD offer as a normal percent, such as 4.25 for 4.25%.',
          'Enter the CD term in months and the early-withdrawal penalty months only as a what-if.',
          'Calculate, then compare maturity value, interest earned, penalty estimate, and value after penalty before reading the real account disclosure.',
        ]
      : isBondGuide
      ? [
          'Open the Bond Calculator.',
          'Enter face value, also called par value, and the current market price.',
          'Enter the annual coupon rate as a normal percent, such as 5 for 5%.',
          'Enter years to maturity and coupon payments per year, such as 2 for semiannual coupons.',
          'Calculate, then compare annual coupon, current yield, and rough YTM before checking the real bond quote or TreasuryDirect page.',
        ]
      : isMutualFundGuide
      ? [
          'Open the Mutual Fund Calculator.',
          'Enter the starting investment and monthly contribution you want to test.',
          'Enter expected annual return before expenses, then the annual expense ratio.',
          'Enter years invested, then calculate the before-expense and after-expense projections.',
          'Compare expense drag with the fund prospectus, share class, loads, taxes, distributions, and risk before trusting the result.',
        ]
      : isRothIraGuide
      ? [
          'Open the Roth IRA Calculator.',
          'Enter the current balance already in the account.',
          'Enter the annual contribution you want to test, such as $7,500 for a 2026 limit-style scenario or $1,200 for $100 a month.',
          'Enter expected annual return and years to grow, then calculate.',
          'Read projected Roth IRA balance, total contributions, and estimated growth, then check IRS MAGI, phase-out, qualified distribution, tax, and penalty rules separately.',
        ]
      : isIraGuide
      ? [
          'Open the IRA Calculator.',
          'Enter the current IRA balance already in the account.',
          'Enter the annual contribution you want to test, such as $7,500 for a 2026 limit-style scenario or $8,600 when testing the age 50+ catch-up amount.',
          'Enter expected annual return and years to grow, then calculate.',
          'Read projected IRA balance, total contributions, and estimated growth, then check taxable compensation, deduction limits, Roth eligibility, RMD, tax, penalty, fee, and market-risk rules separately.',
        ]
      : isRmdGuide
      ? [
          'Open the RMD Calculator.',
          'Enter the prior December 31 balance, not today\'s balance.',
          'Enter your age on your birthday in the distribution year.',
          'Calculate, then compare estimated RMD, Uniform table factor, age used, and balance after RMD.',
          'Check IRS rules, your custodian statement, inherited-account status, spouse age rules, aggregation, withholding, and first-year timing before acting.',
        ]
      : isIrrGuide
      ? [
          'Open the IRR Calculator.',
          'Enter the starting investment as the initial outflow.',
          'Enter the next five cash flows in the order they happen.',
          'Choose periods per year: 1 for annual, 4 for quarterly, or 12 for monthly.',
          'Calculate, then compare annualized IRR, periodic IRR, and net cash flow before using ROI, payback, NPV, or a full model for the real decision.',
        ]
      : isVatGuide
      ? [
          'Open the VAT Calculator.',
          'Choose add VAT when your amount is the net price before tax.',
          'Choose remove VAT when your amount is the gross price that already includes VAT.',
          'Enter the VAT rate as a normal percent, such as 20 for 20% or 5 for 5%.',
          'Calculate, then check net amount, VAT amount, gross amount, and the official country or product rule before using the number on an invoice.',
        ]
      : isPensionGuide
      ? [
          'Open the Pension Calculator.',
          'Enter the final average salary or plan salary number used by the pension formula.',
          'Enter credited years of service, including partial years only if the plan counts them.',
          'Enter the plan multiplier as a percent, such as 1.6 for 1.6%.',
          'Calculate, then compare annual pension, monthly pension, and replacement rate before reading the plan document or benefit statement.',
        ]
      : isAnnuityPayoutGuide
      ? [
          'Open the Annuity Payout Calculator.',
          'Enter the starting balance or lump sum you want to spread across payments.',
          'Add the annual rate assumption and fixed payout term in years.',
          'Enter payments per year, such as 12 for monthly or 1 for annual.',
          'Calculate, then compare payout per period, total paid out, estimated interest, and payment count before reading any annuity contract.',
        ]
      : isUkMortgageGuide
      ? [
          `Open the ${tool.name}.`,
          'Enter the property price and deposit in pounds.',
          'Enter the rate and repayment term, such as 5.2% for 25 years.',
          'Add a monthly fee only when the fee repeats every month.',
          'Calculate, then read monthly repayment, total monthly payment, loan amount, LTV, and total interest before comparing it with a lender illustration.',
        ]
      : isAutoLoanGuide
      ? [
          `Open the ${tool.name}.`,
          'Enter the vehicle price after negotiation.',
          'Add down payment, trade-in value, estimated fees, sales tax rate, loan rate, and term.',
          'Calculate, then check amount financed, monthly payment, total interest, and total paid.',
          'Compare a shorter and longer term before choosing the easier-looking payment.',
        ]
      : isBusinessLoanGuide
      ? [
          `Open the ${tool.name}.`,
          'Enter the loan amount, annual interest rate, loan term, and origination fee percent.',
          'Calculate, then check monthly payment, total interest, origination fee, cash received after fee, and total cost with fee.',
          'Compare a shorter term or lower fee before trusting the easiest-looking payment.',
          'Check the written lender offer before treating the estimate as real approval.',
        ]
      : isLiquidityGuide
      ? [
          `Open the ${tool.name}.`,
          'Enter current assets and current liabilities from the same balance sheet date.',
          'Add inventory and prepaid expenses so quick ratio can remove less-liquid assets.',
          'Add cash, marketable securities, and receivables so the cash ratio and supporting lines are visible.',
          'Calculate, then compare current ratio, quick ratio, cash ratio, and working capital together.',
        ]
      : isDebtRatiosGuide
      ? [
          `Open the ${tool.name}.`,
          'Enter total debt, total assets, and total equity from the same balance sheet date.',
          'Enter EBIT and interest expense from the same income statement period.',
          'Calculate, then read debt ratio, debt-to-equity, and times interest earned as three separate checks.',
          'Use the answer as a first pass before checking cash flow, maturity dates, covenants, and industry context.',
        ]
      : isOperationsRatiosGuide
      ? [
          `Open the ${tool.name}.`,
          'Enter COGS plus beginning and ending inventory from the same period.',
          'Enter net sales, average total assets, net credit sales, and average receivables from the same period.',
          'Enter total assets and total equity from the same balance sheet date for the equity multiplier.',
          'Calculate, then read inventory turnover, asset turnover, receivables turnover, collection days, and equity multiplier as separate checks.',
        ]
      : isProfitabilityRatiosGuide
      ? [
          `Open the ${tool.name}.`,
          'Enter net sales, COGS, operating income, and net income from the same income statement period.',
          'Enter average assets and average equity for that same period.',
          'Enter shares outstanding and price per share if you want EPS and P/E.',
          'Calculate, then read gross margin, operating margin, net margin, ROA, ROE, EPS, and P/E as separate checks.',
        ]
      : isStockRatiosGuide
      ? [
          `Open the ${tool.name}.`,
          'Enter the stock price you want to compare.',
          'Enter EPS, sales per share, and book value per share from the same reporting context when possible.',
          'Enter annual dividend per share, or 0 if the stock does not pay one.',
          'Calculate, then read P/E, P/S, P/B, dividend yield, and payout ratio as separate clues.',
        ]
      : isSocialSecurityGuide
      ? [
          'Open the Social Security Calculator.',
          'Enter your birth year.',
          'Enter your full-retirement-age monthly benefit from my Social Security if you have it.',
          'Enter a claiming age from 62 through 70.',
          'Calculate, then compare monthly benefit, full retirement age, adjustment percent, and annual estimate before using an official SSA calculator.',
        ]
      : isCanadianMortgageGuide
      ? [
          `Open the ${tool.name}.`,
          'Enter the property price, down payment, nominal annual rate, amortization years, and payment frequency.',
          'Calculate, then check payment, loan amount, loan-to-value, total interest, and payment count.',
          'If the down payment is under 20%, check official mortgage loan insurance rules before trusting the cash plan.',
          'Treat the answer as payment math, not a stress-test or lender approval result.',
        ]
      : isDownPaymentGuide
      ? [
          `Open the ${tool.name}.`,
          'Enter the home price.',
          'Either enter an exact down payment amount or leave it blank and use a down payment percent.',
          'Add a rough closing-cost percent, then check down payment, loan amount, LTV, closing costs, and cash needed.',
          'Compare 20%, 10%, 5%, and 3.5% down before trusting the first number.',
        ]
      : isFhaLoanGuide
      ? [
          `Open the ${tool.name}.`,
          'Enter home price and down payment. Use $11,375 for a 3.5% down payment on a $325,000 home.',
          'Enter interest rate, term, property tax, homeowners insurance, upfront MIP, and annual MIP.',
          'Calculate, then check total monthly payment, upfront MIP, monthly MIP, and loan-to-value.',
          'Use the answer as payment math before checking 2026 county FHA limits, cash to close, lender approval, and the written Loan Estimate.',
        ]
      : isLoanGuide
      ? [
          `Open the ${tool.name}.`,
          'Enter the loan amount before fees.',
          'Enter the annual interest rate as a percent, such as 9.5 for 9.5%.',
          'Enter the term in years, then calculate.',
          'Read monthly payment, total paid, total interest, and payment count before comparing it with a written offer.',
        ]
      : isFinanceGuide
      ? [
          `Open the ${tool.name}.`,
          'Enter the starting amount, such as 2000 for $2,000.',
          'Enter the monthly deposit, annual rate, and number of years.',
          'Calculate, then check ending balance, total contributions, and estimated growth.',
          'Try a lower rate or smaller deposit before treating the result as a plan.',
        ]
      : isSalesTaxGuide
      ? [
          `Open the ${tool.name}.`,
          'Enter the before-tax subtotal, such as 80 for an $80 item.',
          'Enter the local sales tax rate as 7.5 for 7.5%, not 0.075.',
          'Calculate, then check the tax amount and final total.',
          'Before copying the answer, check whether discounts, shipping, exemptions, or a tax holiday change the taxable amount.',
        ]
      : isAdRevenueGuide
      ? [
          `Open the ${tool.name}.`,
          'Enter daily page views, such as 1000.',
          'Enter page CTR as a percent, such as 1.5 for 1.5%.',
          'Enter average CPC as dollars per click, such as 0.35.',
          'Calculate, then compare monthly revenue, estimated clicks per day, and page RPM before trusting the plan.',
        ]
      : isEstateTaxGuide
      ? [
          `Open the ${tool.name}.`,
          'Enter the gross estate as the rough total value before this page subtracts anything.',
          'Add debts and expenses, charitable bequests, spouse transfers, and prior taxable gifts only when they belong in the scenario.',
          'Calculate, then check estate before exclusion, remaining basic exclusion, amount above exclusion, and the simplified federal estimate.',
          'Use the answer as a rough 2026 federal screen before professional estate and tax advice, not as Form 706.',
        ]
      : isInterestRateGuide
      ? [
          `Open the ${tool.name}.`,
          'Enter the amount financed from the quote.',
          'Enter the fixed monthly loan payment, without taxes, insurance, warranties, or add-ons if you only want the loan rate.',
          'Enter the term in years, then check estimated annual rate, monthly rate, total paid, and total interest.',
          'Compare the answer with APR, fees, and the written lender disclosure before trusting the quote.',
        ]
      : isIncomeTaxGuide
      ? [
          `Open the ${tool.name}.`,
          'Choose filing status first because it changes the standard deduction and bracket thresholds.',
          'Enter gross ordinary income before deductions.',
          'Leave deduction blank for the 2026 standard deduction, or enter a custom deduction and credits.',
          'Calculate, then read taxable income, estimated federal tax, effective rate, and marginal bracket separately.',
        ]
      : isMarriageTaxGuide
      ? [
          `Open the ${tool.name}.`,
          'Enter each person\'s ordinary income separately.',
          'Leave the deduction fields blank for the 2026 standard deductions, or add custom deductions for a specific test.',
          'Add joint credits only if they belong in the married filing jointly estimate.',
          'Calculate, then compare joint federal tax with the two-single estimate and read the difference sign carefully.',
        ]
      : isInvestmentGuide
      ? [
          `Open the ${tool.name}.`,
          'Enter the starting money already invested.',
          'Enter the monthly amount you plan to add.',
          'Enter an estimated annual return and the number of years.',
          'Calculate, then read ending balance, total contributions, estimated growth, and the warning notes together.',
        ]
      : isCurrencyGuide
      ? [
          'Open the Currency Calculator.',
          'Enter the source amount, such as 500.',
          'Enter the exchange rate as target currency per 1 source currency, such as 0.92 if each source unit buys 0.92 target units.',
          'Enter an exchange fee percent only if the provider charges it, such as 2.5 for 2.5%.',
          'Calculate, then compare converted amount, before-fee amount, fee amount, and rate used before copying the estimate.',
        ]
      : [
          `Open the ${tool.name}.`,
          detail.enter[0],
          `Use the first example, "${primaryExampleText}", if you want to see a filled-out estimate before entering your own values.`,
          'Calculate, read the formula line, then copy the result only after the amounts, percentages, time periods, or assumptions look right.',
        ]),
    sections: [
      {
        title: 'What this calculator is for',
        paragraphs: [
          detail.purpose,
          isMortgageGuide
            ? 'Use it before asking for a quote, comparing 15-year and 30-year payments, testing PMI, or seeing whether tax and insurance make a home feel less affordable than the loan payment alone.'
            : isMortgagePayoffGuide
            ? 'Use it before making extra principal payments, testing a one-time lump sum, or deciding what questions to ask your mortgage servicer.'
            : is401kGuide
            ? 'Use it before changing payroll contributions, comparing a match scenario, testing a longer time horizon, or checking whether a return assumption is doing too much work.'
            : isUkMortgageGuide
            ? 'Use it before checking a UK mortgage quote, comparing deposit sizes, testing a 25-year versus 30-year term, or seeing whether a small monthly fee changes the payment enough to matter.'
            : isAutoLoanGuide
            ? 'Use it before shopping for financing, comparing dealer offers, testing a trade-in, or seeing how much a longer loan term really costs.'
            : isBusinessLoanGuide
            ? 'Use it before talking to a lender, testing an equipment purchase, comparing working-capital offers, or checking whether the fee leaves enough cash for the job.'
            : isLiquidityGuide
            ? 'Use it before reading a balance sheet, asking why quick ratio is lower than current ratio, checking whether inventory is making liquidity look safer, or preparing cleaner questions for an accountant or lender.'
            : isDebtRatiosGuide
            ? 'Use it before reading a balance sheet, asking whether debt is heavy, checking whether EBIT covers interest, or preparing sharper questions for an accountant, lender, or investor report.'
            : isOperationsRatiosGuide
            ? 'Use it before reading operations-heavy statements, asking why cash is stuck in inventory or receivables, checking whether assets are producing sales, or preparing sharper questions for an accountant or manager.'
            : isProfitabilityRatiosGuide
            ? 'Use it before comparing companies, asking why profit changed, checking whether returns come from assets or equity, or preparing sharper questions about margins, debt, shares, and price.'
            : isStockRatiosGuide
            ? 'Use it before comparing valuation ratios, checking whether a dividend stock needs a payout warning, or preparing sharper questions about EPS, sales, book value, dividends, debt, and growth.'
            : isSocialSecurityGuide
            ? 'Use it before comparing claim-at-62, full-retirement-age, and claim-at-70 examples. It is best when you already have an SSA benefit estimate and want to see what claiming age does to that one number.'
            : isCanadianMortgageGuide
            ? 'Use it before comparing mortgage quotes, testing a down payment, checking a biweekly payment, or seeing how much a shorter amortization changes the payment.'
            : isDownPaymentGuide
            ? 'Use it before asking for a loan estimate, comparing down payment choices, checking whether 3.5%, 5%, 10%, or 20% changes the loan size, or planning how much cash to keep outside the purchase.'
            : isLoanGuide
            ? 'Use it before comparing personal loan, school loan, equipment loan, or fixed-payment debt scenarios. It is a payment estimate, not an approval or APR disclosure.'
            : isFinanceGuide
            ? 'Use it when you want a first-pass savings, investing, or general money projection before picking a more specific calculator. It is a scenario check, not a promise about the future.'
            : isRentGuide
            ? 'Use it before apartment hunting, comparing two rent targets, deciding whether utilities make a listing too expensive, or checking whether debts leave enough room for the rent you want.'
            : isAnnuityGuide
            ? 'Use it when you need fixed-payment annuity math for homework, retirement planning notes, ordinary annuity timing, annuity-due timing, present value, or future value before looking at real contract rules.'
            : isCreditCardGuide
            ? 'Use it when you want to test one credit card balance, compare a larger monthly payment, or see how new card spending keeps the payoff from moving as fast as it should.'
            : isCreditCardsPayoffGuide
            ? 'Use it when you want a quick combined view of several cards before deciding whether to build a true avalanche, snowball, consolidation, or hardship plan.'
            : isDebtPayoffGuide
            ? 'Use it when you want to test one fixed debt balance before calling a creditor, adding extra payment, comparing consolidation, or asking for counseling help.'
            : isDebtConsolidationGuide
            ? 'Use it when you have a real or possible consolidation offer and want to see whether the lower rate, fee, and term beat the payoff path you already have.'
            : isRepaymentGuide
            ? 'Use it when you have one clean balance and want to test whether the payment is strong enough, whether extra money helps, and how much interest the payoff path may cost.'
            : isStudentLoanGuide
            ? 'Use it when you want a quick standard student-loan payment estimate before you compare official federal repayment plans, private lender terms, or a servicer quote.'
            : isCollegeCostGuide
            ? 'Use it when you want a first-pass college budget before comparing schools. It is helpful before checking the U.S. Department of Education Net Price Calculator Center, College Scorecard, a FAFSA result, or a financial aid offer.'
            : isInterestGuide
            ? 'Use it when you want to compare simple interest with compound interest, check a homework formula, test a savings idea, or decide whether a more specific loan, investment, APY, or APR calculator fits better.'
            : isSimpleInterestGuide
            ? 'Use it when interest is based only on the original principal, annual interest rate, and time. It is best for clean examples, not bank statements, APR disclosures, or amortized loan schedules.'
            : isCdGuide
            ? 'Use it when you want to check a CD offer, compare term lengths, estimate maturity value, or see how a penalty might change an early-withdrawal scenario before reading the bank disclosure.'
            : isBondGuide
            ? 'Use it when you want to check plain bond coupon income, compare a discount or premium price, or understand why current yield and rough YTM can point in different directions.'
            : isPensionGuide
            ? 'Use it when you want to test a defined-benefit formula before you compare the number with your pension statement, plan summary, retirement office, or PBGC coverage notes.'
            : isAnnuityPayoutGuide
            ? 'Use it when you want to test fixed-term payout math before comparing the number with an insurer illustration, annuity contract, rider, or tax note.'
            : isMarriageTaxGuide
            ? 'Use it when you want to see whether the numbers you enter create a rough federal marriage bonus, penalty, or no difference before you look at the bigger tax details.'
            : isInvestmentGuide
            ? 'Use it when you want to test a habit, like adding $250 a month, before deciding whether the goal needs more money, more time, or a lower-risk plan. It is projection math, not investment advice.'
            : isCurrencyGuide
            ? 'Use it before travel, a card purchase, a cash exchange, an international transfer, or a quick provider quote check. It is best when you already have the exact rate and fee you want to test.'
            : isFhaLoanGuide
            ? 'Use it before asking a lender for numbers, comparing FHA with a conventional mortgage, or seeing how much monthly MIP changes the payment. It is not an approval tool.'
            : isAdRevenueGuide
            ? 'Use it when you are testing a blog post, tool page, niche site, or traffic idea and want a rough number before opening a spreadsheet.'
            : isEstateTaxGuide
            ? 'Use it when the estate may be large enough to deserve a first-pass federal check before you ask sharper questions about Form 706, portability, state estate tax, trusts, or professional planning.'
            : isInterestRateGuide
            ? 'Use it when a lender, dealer, or payment page gives you a fixed monthly payment but the rate is missing or hard to compare. It is a rate estimate, not lender approval or an APR disclosure.'
            : `Good fit examples: ${tool.useCases.slice(0, 2).join(' ')}`,
        ],
      },
      ...(detail.featuredSections ?? []),
      {
        title: 'What to enter',
        paragraphs: [
          isMortgageGuide
            ? 'Mortgage estimates get messy when annual and monthly costs are mixed together. Home price, down payment, rate, and term build the loan payment. Property tax, insurance, PMI, and HOA dues are add-ons that make the real monthly budget bigger.'
            : isMortgagePayoffGuide
            ? 'Mortgage payoff estimates get messy when principal, interest, escrow, and payoff quotes are treated like the same thing. The calculator needs the current principal balance, annual rate, years remaining, and any extra money you want applied to principal.'
            : is401kGuide
            ? '401K projections get misleading when salary percent, match percent, and match limit are treated like the same field. Keep your contribution, the employer match rate, the match cap, estimated return, and years separate.'
            : isHouseAffordabilityGuide
            ? 'House affordability estimates get shaky when principal and interest are the only costs counted. Keep income, existing debts, down payment, rate, DTI target, property tax, insurance, and HOA separate so the monthly budget is visible.'
            : isSavingsGuide
            ? 'Savings estimates get fuzzy when the goal, deposits, and interest are all blended together. Keep current savings, monthly deposit, annual rate, years, and target amount separate so the gap is easy to check.'
            : isRentGuide
            ? 'Rent estimates get shaky when gross income, take-home pay, debts, and utilities are mixed together. Pick the income basis first, then subtract debts and utilities that will still hit every month.'
            : isAnnuityGuide
            ? 'Annuity estimates get shaky when monthly payments, annual payments, ordinary timing, and annuity-due timing are mixed together. Set payment frequency first, then keep the timing choice honest.'
            : isCreditCardGuide
            ? 'Credit card payoff estimates get shaky when APR, minimum payments, and new spending are mixed together. Enter the payment you can actually send, then keep new card spending honest.'
            : isCreditCardsPayoffGuide
            ? 'Combined-card payoff estimates get shaky when one high-rate card is hidden inside a rough average. Keep balances, weighted APR, regular payment, and extra payment separate, then build a card-by-card plan if the stakes are high.'
            : isDebtPayoffGuide
            ? 'Debt payoff estimates get shaky when fees, penalties, skipped payments, court deadlines, or collector rules are treated like normal monthly interest. Keep this page to one clean balance, then check real paperwork before acting.'
            : isDebtConsolidationGuide
            ? 'Debt consolidation estimates get shaky when the advertised rate is not the real APR, fees are ignored, the term is stretched too far, or a home-equity offer turns unsecured debt into debt backed by your home.'
            : isRepaymentGuide
            ? 'Repayment estimates get shaky when the balance is old, the rate is monthly instead of annual, or the extra payment is money the budget cannot keep sending. Keep balance, annual rate, regular payment, and extra payment separate.'
            : isStudentLoanGuide
            ? 'Student-loan estimates get shaky when official-plan rules and simple loan math are mixed together. Keep balance, annual rate, term, and extra payment separate, then check Federal Student Aid or your servicer for the real plan.'
            : isCollegeCostGuide
            ? 'College-cost estimates get shaky when tuition is treated like the whole bill. Keep tuition and fees, housing and meals, books and supplies, transportation, personal costs, years until school, cost increase, and savings assumptions separate.'
            : isInterestGuide
            ? 'Interest estimates get shaky when annual rates, monthly rates, APR, APY, simple interest, and compound interest are mixed together. Pick the mode first, then keep principal, annual interest rate, time in years, compounding frequency, and deposits separate.'
            : isSimpleInterestGuide
            ? 'Simple-interest estimates get shaky when the real product compounds, charges fees, uses a daily balance, changes rates, or requires payments. Keep the principal, annual interest rate, and time in years separate.'
            : isCdGuide
            ? 'CD estimates get shaky when APY, stated interest rate, term, renewal rules, grace periods, minimum balances, brokered-CD rules, call features, insurance limits, and early-withdrawal penalties are mixed together. Keep the offer details separate.'
            : isPensionGuide
            ? 'Pension estimates get shaky when calendar years worked and credited service are treated as the same thing. Use the salary, service, and multiplier your plan actually uses, then check whether vesting, caps, early retirement, or survivor choices change the benefit.'
            : isAnnuityPayoutGuide
            ? 'Annuity payout estimates get shaky when monthly and annual payments are mixed up. Keep starting balance, annual rate, fixed payout term, and payments per year separate so the payment count is clear.'
            : isUkMortgageGuide
            ? 'UK mortgage estimates get messy when one-off costs and monthly costs are mixed together. Property price, deposit, rate, and term build the repayment estimate. The monthly fee field is only for a cost that repeats every month.'
            : isAutoLoanGuide
            ? 'Auto-loan estimates are easy to bend by leaving out fees or focusing only on the monthly payment. Enter the car price, tax, fees, down payment, trade-in, rate, and term as one complete deal.'
            : isBusinessLoanGuide
            ? 'Business-loan offers are easy to misread if you look only at the payment. Enter the loan amount, rate, term, and origination fee so you can see both repayment cost and cash received.'
            : isLiquidityGuide
            ? 'Liquidity ratios get misleading when numbers come from different dates or inventory is treated like cash. Keep current assets, current liabilities, inventory, prepaid expenses, cash, marketable securities, and receivables in their own fields.'
            : isDebtRatiosGuide
            ? 'Debt ratios get misleading when balance sheet and income statement periods are mixed. Keep total debt, assets, and equity from one balance sheet date, then match EBIT and interest expense from the same income statement period.'
            : isOperationsRatiosGuide
            ? 'Operations ratios get misleading when period numbers and snapshot numbers are mixed. Keep COGS, sales, credit sales, average inventory, average assets, and average receivables matched to the same period.'
            : isProfitabilityRatiosGuide
            ? 'Profitability ratios get misleading when income statement numbers, average balance sheet numbers, share counts, and price come from different periods. Keep sales, COGS, operating income, net income, average assets, average equity, shares, and price matched to the question.'
            : isStockRatiosGuide
            ? 'Stock ratios get misleading when a live share price is mixed with old EPS, old sales per share, old book value, or a dividend that has already changed. Keep the price, per-share numbers, and dividend period matched to the question.'
            : isCanadianMortgageGuide
            ? 'Canadian mortgage estimates need the price, down payment, nominal annual rate, amortization, and payment frequency to stay together. A small rate or amortization change can move both the payment and total interest.'
            : isDownPaymentGuide
            ? 'Down-payment estimates are easy to undercount because the down payment and closing costs are separate. Enter the home price, choose exact cash or a percent, then add a rough closing-cost percent for early planning.'
            : isLoanGuide
            ? 'Loan estimates get misleading when the payment is the only number checked. Enter amount, rate, and term, then compare payment with total interest and the written APR or fee disclosure.'
            : isFinanceGuide
            ? 'Finance projections get misleading when monthly deposits, annual rates, and years get mixed up. Enter the starting amount, monthly deposit, estimated rate, and time as separate pieces.'
            : isMarriageTaxGuide
            ? 'Marriage-tax comparisons get misleading when the two incomes, deductions, and credits are mashed together too early. Keep each single estimate separate, then compare it with the joint estimate.'
            : isInvestmentGuide
            ? 'Investment projections get misleading when a return guess is treated like a promise. Keep starting money, monthly deposits, estimated annual return, and years separate, then test a lower return before trusting the number.'
            : isCurrencyGuide
            ? 'Currency estimates break when the rate direction is flipped. Keep the source amount, target-per-source rate, percentage fee, and fixed fees separate so you can tell whether the rate or the fee moved the answer.'
            : isFhaLoanGuide
            ? 'FHA estimates are easy to undercount when upfront MIP, monthly MIP, tax, insurance, or county loan limits are left out. Keep those pieces separate before you compare the payment with another loan type.'
            : isSalesTaxGuide
            ? 'Sales-tax mistakes usually come from using the wrong rate format or a rate that does not match the place, product, or checkout rule.'
            : isAdRevenueGuide
            ? 'Ad revenue estimates are easy to break with one bad input. Page views are counts, CTR is a percent, and CPC is a dollar amount per click.'
            : isEstateTaxGuide
            ? 'Estate-tax screens need the gross estate, debts and expenses, charitable bequests, spouse transfers, and prior taxable gifts to stay separate. Do not hide one number inside another unless you mean to.'
            : isInterestRateGuide
            ? 'Rate estimates get weird when the payment includes more than principal and interest. Keep the amount financed, fixed monthly loan payment, and term separate before you calculate.'
            : 'Finance estimates are sensitive to small input changes. Check whether a field expects a monthly amount, annual amount, dollar value, or percent before calculating.',
        ],
        bullets: detail.enter,
      },
      {
        title: 'Example walkthrough',
        paragraphs: [
          primaryExample
            ? isMortgageGuide
              ? 'Try the starter example: a $400,000 home, $80,000 down, 6.5% for 30 years, $4,800 yearly tax, $140 monthly insurance, and a $75 HOA. The estimate is about $2,637.62 per month total, with $2,022.62 of that as principal and interest and 80% LTV.'
              : isMortgagePayoffGuide
              ? 'Try the starter example: $280,000 current principal, 6.25% rate, 25 years remaining, and $200 extra to principal each month. The estimate is about $2,047.07 paid each month, a 20-year payoff, about $63,050.68 interest saved, and 60 months saved.'
              : is401kGuide
              ? 'Try the starter example: $25,000 saved, a $75,000 salary, 8% contribution, 50% match up to 6%, and 7% for 25 years. The projection is about $700,059.74, with $500 from you each month and $187.50 from the employer match.'
              : isHouseAffordabilityGuide
              ? 'Try the starter example: $110,000 income, $450 monthly debts, $60,000 down, 6.5% for 30 years, 36% DTI, 1.2% property tax, and $140 monthly insurance. The estimate is about a $421,988.22 home price, $361,988.22 loan amount, and $2,850 monthly housing budget.'
              : isSavingsGuide
              ? 'Try the starter example: $2,500 saved, $300 added each month, 4% annual rate, 5 years, and a $25,000 target. The estimate is about $22,942.18, with $20,500 from deposits, about $2,442.18 from interest, and about $2,057.82 still short.'
              : isRentGuide
              ? 'Try the starter example: $5,200 monthly income, a 30% rent target, $350 in debts, and $180 in utilities. The estimate is $1,030 max monthly rent, $12,360 annual rent, and $3,640 left after rent, debts, and utilities.'
              : isAnnuityGuide
              ? 'Try the starter example: $500 each month for 20 years at 5%, with payments at the end of each month. That means 240 payments, $120,000 paid in, about $205,516.83 future value, and about $75,762.66 present value.'
              : isCreditCardGuide
              ? 'Try the starter example: $4,500 balance, 22.9% APR, $250 monthly payment, and $0 new monthly spending. The estimate is about 23 months, about $1,065.99 interest, about $5,565.99 total paid, and a final payment of about $65.99.'
              : isCreditCardsPayoffGuide
              ? 'Try the starter example: $8,500 combined balance, 21.5% weighted APR, $350 regular monthly payment, and $100 extra. The estimate is 24 months, about $1,969.83 interest, about $10,469.83 total paid, and a final payment near $119.83.'
              : isDebtPayoffGuide
              ? 'Try the starter example: $10,000 balance, 12% annual rate, $300 regular monthly payment, and $100 extra. The estimate is 29 months, about $1,564.88 interest, about $11,564.88 total paid, and a final payment near $364.88.'
              : isDebtConsolidationGuide
              ? 'Try the starter example: $18,000 debt, 18% current APR, $650 current payment, 10.5% new loan APR, 3-year term, and $300 fee. The estimate is a $594.79 new payment, about $55.21 less per month, and about $2,023.05 lower total cost.'
              : isRepaymentGuide
              ? 'Try the starter example: $12,000 balance, 8% annual rate, $300 regular monthly payment, and $50 extra. The estimate is 40 months, about $1,669.76 interest, about $13,669.76 total paid, and a final payment near $19.76. Without the extra $50, the same balance takes about 47 months and about $2,003.66 interest.'
              : isStudentLoanGuide
              ? 'Try the starter example: $30,000 balance, 6.5% annual rate, 10 years, and $50 extra each month. The scheduled payment is about $340.64. With the extra $50, the estimate is a 100-month payoff, about $8,892.17 interest, about $38,892.17 total paid, and about $1,985.10 interest saved.'
              : isCollegeCostGuide
              ? 'Try the starter example: $28,000 current annual cost, 8 years until start, 4 school years, 4% yearly cost increase, $10,000 saved, $250 saved each month, and 5% savings return. The estimate is about $38,319.93 for the first year, $162,724.22 total cost, $44,340.98 projected savings, and a $118,383.23 savings gap before aid.'
              : isSimpleInterestGuide
              ? 'Try the starter example: $1,000 principal, 5% annual interest rate, and 3 years. The formula is $1,000 x 0.05 x 3, so the simple interest is $150 and the ending balance is $1,150.'
              : isCdGuide
              ? 'Try the starter example: $10,000 deposit, 4.25% APY, 12 months, and a 3-month early-withdrawal penalty what-if. The estimate is a $10,425 maturity value, $425 interest earned, about a $106.25 penalty estimate, and about $10,318.75 value after penalty.'
              : isBondGuide
              ? 'Try the starter example: $1,000 face value, $950 current market price, 5% annual coupon, 10 years to maturity, and 2 coupon payments per year. The estimate is $50 annual coupon income, 5.26% current yield, and about 5.64% rough YTM.'
              : isPensionGuide
              ? 'Try the starter example: $82,000 final average salary, 27 credited service years, and a 1.6% multiplier. The estimate is $35,424 per year, $2,952 per month, and a 43.2% replacement rate before taxes or plan adjustments.'
              : isAnnuityPayoutGuide
              ? 'Try the starter example: $100,000 balance, 5% rate, 20 years, and 12 payments per year. The estimate is about $659.96 per month, 240 payments, about $158,389.38 total paid, and about $58,389.38 estimated interest.'
              : isAutoLoanGuide
              ? 'Try the starter example: a $32,000 vehicle, $4,000 down, $3,000 trade-in, $900 fees, 6% sales tax, and 7.2% for 5 years. The estimate is about $549.92 per month, with about $27,640 financed and about $5,355.02 in interest.'
              : isBusinessLoanGuide
              ? 'Try the starter example: $50,000 at 9.5% for 5 years with a 2% origination fee. The estimate is about $1,050.09 per month, $13,005.58 in interest, $1,000 in fees, $49,000 cash received, and $64,005.58 total cost with fee.'
              : isDebtRatiosGuide
              ? 'Try the starter example: $220,000 debt, $500,000 assets, $280,000 equity, $90,000 EBIT, and $15,000 interest expense. The estimate is 44% debt ratio, about 0.79x debt-to-equity, and 6x times interest earned.'
              : isOperationsRatiosGuide
              ? 'Try the starter example: $600,000 COGS, $90,000 beginning inventory, $110,000 ending inventory, $950,000 net sales, $500,000 average assets, $700,000 credit sales, and $80,000 average receivables. The estimate is 6x inventory turnover, 1.90x asset turnover, 8.75x receivables turnover, and about 41.71 collection days.'
              : isProfitabilityRatiosGuide
              ? 'Try the starter example: $950,000 sales, $600,000 COGS, $180,000 operating income, $120,000 net income, $500,000 average assets, $260,000 average equity, 100,000 shares, and an $18 share price. The estimate is 36.84% gross margin, 18.95% operating margin, 12.63% net margin, 24% ROA, 46.15% ROE, $1.20 EPS, and 15x P/E.'
              : isStockRatiosGuide
              ? 'Try the starter example: an $18 share price, $1.20 EPS, $9.50 sales per share, $2.60 book value per share, and a $0.45 annual dividend. The estimate is 15x P/E, 1.89x P/S, 6.92x P/B, 2.5% dividend yield, and 37.5% payout ratio.'
              : isCanadianMortgageGuide
              ? 'Try the starter example: a $600,000 property, $120,000 down payment, 5.1% rate, and 25-year amortization. The estimate is about $2,819.09 per month, with a $480,000 loan, 80% LTV, and about $365,727.47 in interest.'
              : isDownPaymentGuide
              ? 'Try the starter example: a $400,000 home, 20% down, and 3% closing costs. The estimate is $80,000 down, a $320,000 loan, 80% LTV, $12,000 closing costs, and $92,000 cash needed.'
            : isLoanGuide
              ? 'Try the starter example: $12,000 at 9.5% for 4 years. The estimate is about $301.48 per month, about $14,470.93 total paid, and about $2,470.93 interest across 48 payments. That still does not include lender fees or penalties.'
            : isFinanceGuide
              ? 'Try the starter example: $2,000 plus $150 each month at 5% for 8 years. The estimate is about $20,642.25, with $16,400 from contributions and about $4,242.25 from the rate assumption.'
            : isMarriageTaxGuide
              ? 'Try the starter example: $90,000 and $70,000 with the default 2026 deductions. The two-single estimate is $17,540, the married filing jointly estimate is $17,540, and the simplified difference is $0.'
            : isInvestmentGuide
              ? 'Try the starter example: $5,000 plus $250 each month at 7% for 20 years. The estimate is about $150,425.36, with $65,000 from contributions and about $85,425.36 from the return assumption.'
            : isFhaLoanGuide
              ? 'Try the starter example: a $325,000 home, $11,375 down, 6.5% for 30 years, 1.75% upfront MIP, 0.55% annual MIP, $3,900 property tax, and $130 monthly insurance. The estimate is about $2,615.76 per month, with $5,488.44 upfront MIP, about $143.74 monthly MIP, and 96.5% LTV. That payment still does not include closing costs or prove the loan fits a county FHA limit.'
              : isAdRevenueGuide
              ? 'Try the starter example: 1,000 daily page views, 1.5% page CTR, and $0.35 average CPC. That gives about 15 clicks per day, $5.25 per day, about $159.80 per average month, and a $5.25 page RPM.'
              : isEstateTaxGuide
              ? 'Try the starter example: an $18,000,000 estate with $500,000 in debts and expenses. The estate before exclusion is $17,500,000, the amount above the 2026 federal exclusion is $2,500,000, and the simplified estimate is $1,000,000.'
              : isInterestRateGuide
              ? 'Try the starter example: $25,000 principal, $483.32 per month, and 5 years. The estimate is about 6% annual interest, about 0.5% per month, about $28,999.20 total paid, and about $3,999.20 interest before any extra fees.'
              : isCurrencyGuide
              ? 'Try the starter example: 500 source units at a 0.92 exchange rate with a 2.5% fee. The before-fee result is 460 target units, the fee is 11.5 target units, and the final after-fee estimate is 448.5 target units.'
              : `Try the calculator example: ${primaryExampleText}. The example result is ${primaryExample.result}.`
            : 'Use one of the examples on the tool page to see a complete estimate before entering your own values.',
        ],
        bullets: detail.example,
      },
      {
        title: 'Formula and steps',
        paragraphs: [
          getFormulaAnswer(tool.slug),
          isMortgageGuide
            ? 'The loan formula is only the first layer. The budget number changes when you add property tax, homeowners insurance, PMI, and HOA dues. CFPB calls the core monthly pieces PITI: principal, interest, taxes, and insurance.'
            : isHouseAffordabilityGuide
            ? 'Start with the affordable home price, then check the monthly housing budget and the cost split. CFPB says a comfortable mortgage payment can be different from the amount a lender says you qualify to borrow.'
            : isSavingsGuide
            ? 'Start with the projected balance, then check the split. Deposits are the money you put in. Estimated interest is the extra growth from the rate. CFPB and FDIC both explain compound interest as interest earning more interest over time.'
            : isRentGuide
            ? 'Start with income times the rent target, then subtract debt payments and utilities. HUD rental assistance materials treat rent and tenant-paid utilities together, which is a useful reminder that utilities still count when you pay them outside the rent.'
            : isAnnuityGuide
            ? 'Start by turning the annual rate into a rate for each payment period. Then count the payments and run the fixed-payment annuity formulas. Investor.gov and FINRA both warn that real annuity products can add fees, riders, surrender rules, and guarantees that are not part of this clean formula.'
            : isCreditCardGuide
            ? 'Start by turning APR into a simple monthly rate. Each month, the calculator adds estimated interest and any new card spending, subtracts your payment, and repeats until the balance reaches zero. CFPB explains that real issuers often calculate interest daily, so this is a planning estimate, not a statement replica.'
            : isCreditCardsPayoffGuide
            ? 'Start by combining balances, then turn the weighted APR into a simple monthly rate. Each month, the calculator adds estimated interest, subtracts the regular payment plus extra payment, and repeats until the combined balance reaches zero. CFPB explains that real card issuers often calculate interest daily and may split balances by APR, so this is a planning shortcut.'
            : isDebtPayoffGuide
            ? 'Start by turning the annual rate into a simple monthly rate. Each month, the calculator adds estimated interest, subtracts the regular payment plus extra payment, and repeats until the balance reaches zero. If the payment does not cover monthly interest, the calculator stops instead of inventing a payoff date.'
            : isDebtConsolidationGuide
            ? 'Start by estimating the current payoff path from the current balance, weighted APR, and monthly payment. Then add fees to the new loan balance, calculate the fixed consolidation payment, and compare monthly payment and total paid across both paths.'
            : isRepaymentGuide
            ? 'Start by turning the annual rate into a simple monthly rate. Each month, the calculator adds estimated interest, subtracts the regular payment plus extra payment, and repeats until the balance reaches zero. If the payment cannot beat the interest, the estimate should not be treated like a real payoff plan.'
            : isStudentLoanGuide
            ? 'Start with the fixed-payment loan formula. The calculator turns the annual rate into a monthly rate, finds the scheduled payment for the term, then adds extra payment and simulates the balance month by month. It does not choose or price official federal repayment plans.'
            : isCollegeCostGuide
            ? 'Start by growing the annual cost until the first school year. Then add each school year with the same cost increase. The savings side grows current savings and monthly deposits until school starts. It does not subtract financial aid, scholarships, grants, work-study, loans, or family payments during school.'
            : isCdGuide
            ? 'Start with the annual percentage yield, then apply APY growth across the CD term in months. The calculator subtracts the starting deposit to show interest earned, then subtracts a simple months-of-interest penalty only for the early-withdrawal what-if.'
            : isBondGuide
            ? 'Start with face value times coupon rate to get the annual coupon. Current yield is annual coupon divided by current market price. Rough YTM adds the yearly price gain or loss between market price and face value, then divides by the average of those two prices. FINRA and MSRB both explain that exact YTM is a deeper present-value calculation, so this page keeps the label rough on purpose.'
            : isPensionGuide
            ? 'Start with the plan salary number, multiply by credited service, then apply the multiplier percentage. IRS and DOL materials separate defined-benefit pensions from contribution accounts, and PBGC coverage rules are another reason to check the official plan source before trusting a quick estimate.'
            : isAnnuityPayoutGuide
            ? 'Start by turning the annual rate into a rate per payment period. Then count payments and use the fixed-term annuity payout formula. Investor.gov, FINRA, and NAIC all warn that real annuity contracts can add fees, surrender rules, riders, guarantees, taxes, and insurer-specific pricing.'
            : isMortgagePayoffGuide
            ? 'The calculator first finds the scheduled fixed mortgage payment. Then it subtracts any one-time principal payment, adds extra monthly principal, and simulates month-by-month interest until the balance reaches zero.'
            : is401kGuide
            ? 'The calculator turns salary contribution percent into a monthly employee deposit, estimates the employer match from the match rate and match cap, then compounds the current balance and monthly deposits.'
            : isAutoLoanGuide
            ? 'The formula is not the hard part. The hard part is using the same full deal each time: tax, fees, down payment, trade-in, rate, and term. That is why the calculator shows amount financed and total interest beside the monthly payment.'
            : isBusinessLoanGuide
            ? 'The formula is only one part of the decision. The fee matters because you may repay the full loan amount even when the cash you receive is lower.'
            : isLiquidityGuide
            ? 'The same balance sheet can tell different stories. Current ratio includes inventory and prepaid expenses, quick ratio removes them, and cash ratio only counts cash-like assets.'
            : isDebtRatiosGuide
            ? 'The same statements can tell different debt stories. Debt ratio uses assets as the base, debt-to-equity uses owner capital as the base, and times interest earned leaves the balance sheet to compare EBIT with interest expense.'
            : isOperationsRatiosGuide
            ? 'The same statements can tell different operations stories. Inventory turnover uses COGS and average inventory, asset turnover uses sales and average assets, and receivables turnover uses credit sales and average receivables.'
            : isProfitabilityRatiosGuide
            ? 'The same statements can tell different profit stories. Gross margin uses gross profit, operating margin uses operating income, net margin uses net income, ROA uses average assets, ROE uses average equity, and P/E uses share price compared with EPS.'
            : isStockRatiosGuide
            ? 'The same stock price can tell different stories. P/E compares price with EPS, P/S compares price with sales per share, P/B compares price with book value, yield compares dividend with price, and payout compares dividend with EPS.'
            : isSocialSecurityGuide
            ? 'The formula starts with the full-retirement-age benefit you entered. Then it applies an early-claiming reduction before full retirement age or delayed retirement credits after full retirement age, stopping at age 70.'
            : isCanadianMortgageGuide
            ? 'The calculator first turns the nominal annual rate into an effective annual rate using semi-annual compounding. Then it converts that rate to the selected payment period and runs the fixed-payment formula.'
            : isDownPaymentGuide
            ? 'The closing-cost field is intentionally rough. CFPB and Fannie Mae both point buyers toward 2% to 5% style planning ranges early on, but the real number comes from lender and closing documents.'
            : isLoanGuide
            ? 'The calculator uses fixed-rate amortization math. It converts the annual rate into a monthly rate, uses the number of monthly payments, and solves for the payment that pays the balance down to zero. If the rate is 0%, it simply divides principal by the number of payments.'
            : isFinanceGuide
            ? 'The calculator converts the annual rate into monthly growth, compounds the starting amount, then adds each monthly deposit at the end of the month. Estimated growth equals ending balance minus starting money and deposits.'
            : isMarriageTaxGuide
            ? 'The calculator estimates person 1 as single, person 2 as single, then the same combined income as married filing jointly. The difference is joint federal tax minus the two-single total, so negative is lower joint tax and positive is higher joint tax.'
            : isInvestmentGuide
            ? 'The calculator converts the annual return assumption into monthly growth, compounds the starting money, then adds each monthly contribution as an end-of-month deposit. Estimated growth equals ending balance minus the money you put in.'
            : isFhaLoanGuide
            ? 'The calculator starts with price minus down payment, adds upfront MIP to the financed balance, estimates principal and interest, then adds tax, insurance, and monthly MIP. The default 0.55% annual MIP fits a common 30-year, more-than-95% LTV example, but HUD Mortgagee Letter 2023-05 also shows 0.50%, 0.70%, 0.75%, and other rates depending on term, base loan amount, and LTV. This page does not look up county loan limits or choose the official MIP table for you.'
            : isSalesTaxGuide
            ? 'If the estimate looks different from a receipt, check whether the store rounded by item, rounded the whole basket, used a different taxable subtotal, or applied a different local rule.'
            : isAdRevenueGuide
            ? 'The formula is simple on purpose: page views times CTR gives estimated clicks, clicks times CPC gives daily revenue, and daily revenue divided by page views times 1,000 gives page RPM.'
            : isEstateTaxGuide
            ? 'This is a screen, not a tax return. IRS Form 706 can involve detailed valuations, adjusted taxable gifts, credits, deductions, elections, portability, and supporting records that this page does not model.'
            : isInterestRateGuide
            ? 'The calculator is solving backward. It tests monthly rates until the fixed-payment formula matches the payment you entered, then multiplies the monthly rate by 12 to show an estimated nominal annual rate.'
            : isCurrencyGuide
            ? 'Start with the gross conversion: source amount times exchange rate. Then subtract any percentage fee from that converted value. If the quote is written as source currency per 1 target currency, invert the rate before using this page.'
            : 'If the estimate looks surprising, check the formula and inputs before using the answer in a budget, comparison, or planning note.',
        ],
      },
      {
        title: 'How to read the answer',
        paragraphs: [
          isMortgageGuide
            ? 'Start with total monthly payment because that is closest to the budget hit. Then check principal and interest, total interest, and loan-to-value so you can tell whether the payment is being moved by the loan, the rate, the term, or the add-on costs.'
            : isMortgagePayoffGuide
            ? 'Start with payoff time, then check interest saved and months saved. If the one-time payment looks helpful, remember the real servicer may keep the required payment the same unless a recast is allowed.'
            : is401kGuide
            ? 'Start with projected balance, then check your monthly contribution and employer monthly match. If estimated growth is most of the answer, test a lower return before treating the number like a plan.'
            : isAutoLoanGuide
            ? 'Start with the monthly payment, then immediately check amount financed, total interest, and total paid. That stops a long loan from looking better just because the monthly number is smaller.'
            : isBusinessLoanGuide
            ? 'Start with the monthly payment, then check total interest, origination fee, cash received, and total cost with fee. That is the part that shows whether the loan still fits the business plan.'
            : isLiquidityGuide
            ? 'Start with working capital, then compare current ratio, quick ratio, and cash ratio. If current ratio looks safe but quick ratio drops hard, inventory or prepaid expenses may be making the balance sheet look more liquid than it feels.'
            : isDebtRatiosGuide
            ? 'Start with debt ratio, then compare debt-to-equity and times interest earned. A high debt ratio with low interest cover is a very different warning from a higher debt ratio with steady earnings and strong cover.'
            : isOperationsRatiosGuide
            ? 'Start with inventory turnover, then compare asset turnover and receivables turnover. A faster collection period can help cash, but very high turnover can also signal strict credit terms or stock levels that are too thin.'
            : isProfitabilityRatiosGuide
            ? 'Start with the three margins, then compare ROA and ROE. If ROE looks much stronger than ROA, check debt and equity context before calling the business better.'
            : isStockRatiosGuide
            ? 'Start with P/E, then compare P/S and P/B. If the dividend yield looks high, check payout ratio and dividend history before treating the yield like easy income.'
            : isSocialSecurityGuide
            ? 'Start with the monthly benefit, then check the full retirement age and adjustment percent. A bigger age-70 check can still be the wrong fit if you need income earlier or other benefits, taxes, Medicare, or household plans change the decision.'
            : isRmdGuide
            ? 'Start with the estimated RMD, then check the Uniform table factor and age used. If the result looks off, the usual cause is the wrong balance date, the wrong age year, or a special rule that this simple table check does not handle.'
            : isCanadianMortgageGuide
            ? 'Start with the payment, then check whether it is monthly, biweekly, semimonthly, or weekly. Then read loan amount, LTV, payment count, and total interest so the payment has context.'
            : isDownPaymentGuide
            ? 'Start with estimated cash needed, then look at down payment, loan amount, LTV, and closing costs separately. That keeps a low-down-payment example from hiding a larger loan or extra closing cash.'
            : isLoanGuide
            ? 'Start with monthly payment, then check total paid and total interest. A lower payment can still be the worse deal if the term is much longer.'
            : isFinanceGuide
            ? 'Start with ending balance, then check total contributions and estimated growth. That shows how much came from your deposits and how much came from the rate assumption.'
            : isRentGuide
            ? 'Start with max monthly rent. Then check annual rent and income left after rent, debts, and utilities. If the leftover money looks thin, test a lower target before looking at real listings.'
            : isAnnuityGuide
            ? 'Start with future value, then check present value and total payments. If future value looks huge, compare it with total payments so you can see how much comes from the rate assumption.'
            : isCreditCardGuide
            ? 'Start with payoff months, then check total interest and total paid. If the interest number feels painful, test a higher payment or stop new card spending before you trust the plan.'
            : isCreditCardsPayoffGuide
            ? 'Start with payoff months, then check total interest and total paid. If the number still hurts, test more extra payment or split the cards into a real avalanche plan so the highest APR is handled first.'
            : isDebtPayoffGuide
            ? 'Start with payoff months, then check total interest and total paid. If the interest still looks painful, test a bigger extra payment or compare a real consolidation offer before changing the plan.'
            : isDebtConsolidationGuide
            ? 'Start with total cost change, then check monthly payment change. If the payment is lower but total cost is higher, the offer is giving relief now by keeping the debt around longer.'
            : isRepaymentGuide
            ? 'Start with payoff months, then check total interest and total paid. If the payoff time is longer than expected, test a higher payment or check whether the first month of interest is eating too much of the payment.'
            : isStudentLoanGuide
            ? 'Start with scheduled payment, then check payoff time, total interest, and interest saved. If the lower payment looks nice but total interest looks heavy, compare the result with an official plan before making changes.'
            : isCollegeCostGuide
            ? 'Start with total estimated cost, then check first-year cost, projected savings, and the savings gap. If the gap looks huge, do not panic or ignore it. Compare official net price calculators, aid offers, scholarships, grants, cheaper school paths, and possible loan payments next.'
            : isCdGuide
            ? 'Start with maturity value because that is the normal end-of-term estimate. Then check interest earned, penalty estimate, and value after penalty so you do not mix a normal CD maturity result with an early-withdrawal scenario.'
            : isBondGuide
            ? 'Start with annual coupon because that is the simple income estimate. Then check current yield and rough YTM separately. A discount price can make rough YTM higher than current yield, while a premium price can push rough YTM lower.'
            : isMarriageTaxGuide
            ? 'Start with the difference, then check joint federal tax, two single returns, joint taxable income, and the joint marginal bracket. A $0 difference is a real answer, not an error.'
            : isInvestmentGuide
            ? 'Start with ending balance, then check total contributions and estimated growth. If growth is most of the answer, test a lower return so the plan is not balanced on one hopeful number.'
            : isFhaLoanGuide
            ? 'Start with total monthly payment, then check principal and interest, upfront MIP, monthly MIP, and LTV. That shows whether the FHA insurance is carrying more of the cost than you expected.'
            : isSalesTaxGuide
            ? 'Start with the tax amount, then check the final total. The final total should equal before-tax price plus sales tax.'
            : isAdRevenueGuide
            ? 'Start with monthly revenue, because that is usually how site owners compare costs. Then check estimated clicks and page RPM so the number has context.'
            : isEstateTaxGuide
            ? 'Start with the simplified federal estate tax estimate. Then check estate before exclusion, remaining basic exclusion, and amount above exclusion so you can see exactly where the number came from.'
            : isInterestRateGuide
            ? 'Start with the estimated annual rate, then check total interest and total paid. If those numbers look too high, the monthly payment may include fees, insurance, taxes, warranties, or add-ons.'
            : isCurrencyGuide
            ? 'Start with converted amount because that is the after-fee estimate. Then check before-fee amount, fee amount, and rate used so you can compare one provider quote with another without mixing rate spread and fee math.'
            : 'Start with the headline result. Then read the supporting lines to see what made the number larger or smaller, such as rates, time periods, costs, taxes, fees, discounts, or contributions.',
        ],
        bullets: detail.read,
      },
      {
        title: 'Common mistakes to avoid',
        paragraphs: [
          isMortgageGuide
            ? 'Most bad mortgage estimates come from using a rate that is not your quote, entering yearly insurance as monthly insurance, forgetting PMI, ignoring tax reassessments, or treating the calculator like a lender approval.'
            : isMortgagePayoffGuide
            ? 'Most bad mortgage payoff estimates come from using the original loan amount instead of current principal, counting escrow as extra principal, ignoring payoff-statement interest, or assuming the servicer applied extra money correctly.'
            : is401kGuide
            ? 'Most bad 401K projections come from using a return that is too hopeful, putting the employer match in the wrong field, ignoring vesting, forgetting fees and taxes, or assuming the page enforces IRS limits.'
            : isHouseAffordabilityGuide
            ? 'Most bad affordability estimates come from leaving out taxes, insurance, HOA, repairs, utilities, or closing costs, using debts that are too low, or treating a lender maximum like a comfortable budget.'
            : isSavingsGuide
            ? 'Most bad savings estimates come from using a rate that changes, typing APY like it is exact statement math, skipping fees or taxes, forgetting withdrawals, or choosing a monthly deposit that the budget cannot actually handle.'
            : isAutoLoanGuide
            ? 'Most bad car-payment estimates come from leaving out fees, using a rate from a different offer, forgetting negative equity, or choosing the longest term before checking total interest.'
            : isBusinessLoanGuide
            ? 'Most bad business-loan estimates come from ignoring the fee, comparing interest rates without APR context, or treating a fixed-payment loan like a merchant cash advance.'
            : isLiquidityGuide
            ? 'Most bad liquidity checks come from mixing balance sheet dates, counting slow inventory like cash, trusting receivables that may arrive late, or reading one strong ratio like it proves the whole business is safe.'
            : isDebtRatiosGuide
            ? 'Most bad debt-ratio checks come from mixing statement dates, using total liabilities in one comparison and interest-bearing debt in another, ignoring debt maturity, or treating EBIT coverage like bank cash.'
            : isOperationsRatiosGuide
            ? 'Most bad operations-ratio checks come from mixing statement periods, using net sales where credit sales belongs, ignoring seasonal inventory, or treating a high turnover number like it is always good.'
            : isProfitabilityRatiosGuide
            ? 'Most bad profitability checks come from mixing periods, ignoring one-time gains or costs, comparing unlike industries, treating high ROE as automatically good, or reading P/E like it is a recommendation.'
            : isStockRatiosGuide
            ? 'Most bad stock-ratio checks come from mixing fresh prices with stale per-share numbers, ignoring negative EPS, treating a low P/E like a bargain, or trusting a high dividend yield without checking payout risk.'
            : isSocialSecurityGuide
            ? 'Most bad Social Security estimates come from guessing the FRA benefit, comparing only the monthly check, forgetting work earnings-test rules, or treating a quick age test like the official SSA record.'
            : isRmdGuide
            ? 'Most bad RMD estimates come from using today\'s balance instead of the prior December 31 balance, using the wrong age year, missing inherited-account rules, ignoring a much-younger spouse case, or treating this quick check like the custodian statement.'
            : isCanadianMortgageGuide
            ? 'Most bad Canadian mortgage estimates come from forgetting default insurance, mixing monthly and biweekly payments, using the wrong compounding assumption, or treating payment math as lender qualification.'
            : isDownPaymentGuide
            ? 'Most bad down-payment estimates come from counting only the down payment, forgetting closing costs, assuming assistance always applies, or treating a 3.5% example like lender approval.'
            : isLoanGuide
            ? 'Most bad loan estimates come from comparing by payment alone, mixing APR with contract interest rate, ignoring origination fees, skipping prepayment terms, or forgetting that lender rounding can move the final number.'
            : isFinanceGuide
            ? 'Most bad finance projections come from using a rate that is too hopeful, mixing monthly deposits with yearly deposits, or forgetting that tax, fees, inflation, withdrawals, and losses can change the real result.'
            : isRentGuide
            ? 'Most bad rent estimates come from using gross income for a personal budget, forgetting utilities, ignoring debts, or skipping lease costs like deposits, application fees, renters insurance, parking, pets, and moving.'
            : isAnnuityGuide
            ? 'Most bad annuity estimates come from mixing monthly and yearly payments, choosing the wrong timing, using a rate that is too hopeful, or treating simple formula math like a real insurer quote.'
            : isDebtPayoffGuide
            ? 'Most bad debt payoff estimates come from using an old balance, entering the monthly rate instead of the annual rate, ignoring fees, or counting extra money that will be needed for rent, food, utilities, or other bills.'
            : isDebtConsolidationGuide
            ? 'Most bad consolidation estimates come from using the best advertised rate instead of the actual offer, forgetting fees, mixing monthly and annual rates, or ignoring the reason the debt grew in the first place.'
            : isRepaymentGuide
            ? 'Most bad repayment estimates come from using an old balance, entering 0.08 instead of 8, treating an annual payment like a monthly payment, or ignoring fees, payment pauses, and official servicer rules.'
            : isStudentLoanGuide
            ? 'Most bad student-loan estimates come from using the wrong rate, old balance, wrong term, or assuming this page can model IDR, forgiveness, deferment, forbearance, capitalization, subsidies, private-loan fees, or servicer payment allocation.'
            : isCollegeCostGuide
            ? 'Most bad college-cost estimates come from entering tuition only, guessing one cost increase for every school, ignoring whether aid renews, or treating a rough savings gap like an official financial aid bill.'
            : isCreditCardGuide
            ? 'Most bad credit card payoff estimates come from paying only the minimum without checking time, adding new spending every month, ignoring fees or promotions, or expecting simple monthly math to match daily-balance billing exactly.'
            : isCreditCardsPayoffGuide
            ? 'Most bad combined-card payoff estimates come from using a lazy APR average, forgetting balance-transfer fees, keeping new spending alive, ignoring payment allocation, or treating a one-balance shortcut like a true card-by-card payoff strategy.'
            : isMarriageTaxGuide
            ? 'Most bad marriage-tax estimates come from treating this as filing advice, forgetting state or payroll tax, ignoring dependent and credit phaseouts, or assuming the result stays the same at every income level.'
            : isInvestmentGuide
            ? 'Most bad investment projections come from using one high return, forgetting fees and taxes, skipping inflation, or acting like the market grows smoothly every year.'
            : isFhaLoanGuide
            ? 'Most bad FHA estimates come from treating 3.5% down as automatic approval, using the wrong MIP rate, forgetting 2% to 5% style closing-cost planning, skipping county loan limits, ignoring debt-to-income review, or comparing only the monthly payment.'
            : isSalesTaxGuide
            ? 'Most bad sales-tax estimates come from typing the percent as a decimal, using an old local rate, or taxing the wrong subtotal.'
            : isAdRevenueGuide
            ? 'Most bad ad revenue estimates come from typing CTR as a decimal, guessing a CPC that is too high, or forgetting that real ad reports can remove invalid traffic and change after review.'
            : isEstateTaxGuide
            ? 'Most bad estate-tax estimates come from using a rough asset value, forgetting prior taxable gifts, treating spouse or charity transfers too casually, or acting like the calculator replaced Form 706.'
            : isInterestRateGuide
            ? 'Most bad rate estimates come from putting a fee-heavy payment into the calculator and then reading the answer like a clean loan rate. APR and written lender disclosures matter when fees are included.'
            : isCurrencyGuide
            ? 'Most bad currency estimates come from using a stale rate, flipping the rate direction, ignoring fixed transfer fees, comparing mid-market rates with provider buy/sell rates, or treating a planning estimate like an official exchange record.'
            : isCdGuide
            ? 'Most bad CD estimates come from mixing APY with a stated interest rate, using years when the page asks for term months, guessing penalty months, or forgetting renewal, grace-period, brokered-CD, callable-CD, insurance-limit, and tax details.'
            : isBondGuide
            ? 'Most bad bond estimates come from using the coupon rate like it is the return, ignoring the market price, forgetting accrued interest, missing a call feature, using this for EE or I savings bond redemption, or treating rough YTM like a guaranteed broker quote.'
            : 'Most bad finance estimates come from mixing rates, terms, monthly amounts, and annual amounts. The other common mistake is using a planning estimate as if it were a final quote.',
        ],
        bullets: detail.mistakes,
      },
      {
        title: 'What to try next',
        paragraphs: [
          isAutoLoanGuide
            ? 'A related tool can help when the car deal has one moving piece you want to isolate, such as sales tax, a plain loan comparison, or a dealer incentive.'
            : isMortgagePayoffGuide
            ? 'A related tool can help when the payoff estimate is only one part of the question, such as the full monthly payment, another fixed-loan payoff, or the rate hidden inside a quote.'
            : is401kGuide
            ? 'A related tool can help when the 401K projection is only one part of the retirement question, such as a wider savings target, investment what-if, or compound-interest check.'
            : isHouseAffordabilityGuide
            ? 'A related tool can help after the first affordability screen. The next question is usually the exact mortgage payment, the cash needed at closing, or how the same home looks with a different down payment.'
            : isSavingsGuide
            ? 'A related tool can help after the first savings estimate. The next question is usually exact compounding, whether the monthly deposit fits the budget, or whether a higher-risk investment-style return is really the comparison you meant.'
            : isCdGuide
            ? 'A related tool can help after the CD estimate. The next question is usually flexible savings, compounding-frequency detail, or simple interest when you are checking a penalty or classroom-style formula.'
            : isBondGuide
            ? 'A related tool can help after the bond estimate. The next question is usually broad investment growth, fund-style projections, or simple coupon-style interest math.'
            : isBusinessLoanGuide
            ? 'A related tool can help when the loan payment is only one part of the decision, such as the rate, a plain fixed loan, or the profit target for the project.'
            : isLiquidityGuide
            ? 'A related tool can help after the liquidity check. The next question is usually whether debt is too heavy, how fast an investment pays back, or whether a profit target covers the cash pressure.'
            : isDebtRatiosGuide
            ? 'A related tool can help after the debt check. The next question is usually whether short-term bills are covered, whether profit supports the debt load, or whether operations are turning assets into sales.'
            : isOperationsRatiosGuide
            ? 'A related tool can help after the operations check. The next question is usually whether those turns produce profit, whether short-term bills are covered, or whether debt is adding risk.'
            : isCanadianMortgageGuide
            ? 'A related tool can help when the mortgage payment is only one part of the home-buying question, such as down payment, another country-specific mortgage style, or a plain loan comparison.'
            : isDownPaymentGuide
            ? 'A related tool can help after you know the upfront cash number. The next question is usually monthly payment, FHA-style low-down-payment math, or whether the house still fits the budget.'
            : isLoanGuide
            ? 'A related tool can help after the quick payment estimate. The next question is usually a simpler payment check, a full amortization schedule, or the rate implied by a quoted payment.'
            : isFinanceGuide
            ? 'A related tool can help after the first projection. The next question is usually investment-specific growth, compound-interest details, or debt payment math.'
            : isRentGuide
            ? 'A related tool can help after the rent ceiling. The next question is usually monthly income, the rest of the budget, or how much a different rent percentage changes the answer.'
            : isAnnuityGuide
            ? 'A related tool can help after the fixed-payment math. The next question is usually broader investment growth, retirement savings, or turning an existing balance into a payout estimate.'
            : isCreditCardGuide
            ? 'A related tool can help after the single-card estimate. The next question is usually a combined multi-card plan, a plain APR check, or a fixed-payment comparison.'
            : isCreditCardsPayoffGuide
            ? 'A related tool can help after the combined-card estimate. The next question is usually one-card payoff detail, a plain debt payoff comparison, or whether consolidation changes the total cost.'
            : isMarriageTaxGuide
            ? 'A related tool can help after the comparison. The next question is usually a one-status federal estimate, paycheck withholding, or gross-salary planning.'
            : isInvestmentGuide
            ? 'A related tool can help after the first investment projection. The next question is usually compounding detail, inflation pressure, or whether the same goal belongs in a retirement plan.'
            : isFhaLoanGuide
            ? 'A related tool can help when the FHA payment is only one part of the decision, such as plain mortgage math, upfront cash, or home affordability.'
            : isSalesTaxGuide
            ? 'A related tool helps when the sales tax is only one part of the price question.'
            : isAdRevenueGuide
            ? 'A related tool can help when ad revenue is only one part of the plan. Compare the estimate with costs, traffic campaigns, and profit goals before you count it as income.'
            : isEstateTaxGuide
            ? 'A related tool can help when the estate-tax screen is only one part of the planning question, such as growth over time, income tax, or a wider finance scenario.'
            : isInterestRateGuide
            ? 'A related tool can help when the quote is missing a different piece. Use payment math when you know the rate, APR math when fees matter, or a full loan estimate when you want total interest.'
            : isCurrencyGuide
            ? 'A related tool can help when the exchange-rate estimate is only one part of the question, such as checking a provider fee percent, adding local tax after a converted purchase, or planning a wider money scenario.'
            : isStudentLoanGuide
            ? 'A related tool can help after the student-loan estimate. The next question is usually a plain fixed-loan payment, a fuller amortization schedule, or a general payoff test.'
            : isSocialSecurityGuide
            ? 'A related tool can help after the claiming-age check. The next question is usually retirement savings, IRA growth, required withdrawals, or the rest of the household plan.'
            : isUkMortgageGuide
            ? 'A related tool can help when the UK mortgage payment is only one part of the home-buying question, such as deposit size, another country-specific mortgage style, or a plain loan comparison.'
            : 'A related money tool can help check the same question from another angle before you rely on one result.',
        ],
        bullets: detail.next,
        links: isMortgagePayoffGuide
          ? [
              { href: '/tools/mortgage-payoff-calculator/', label: 'Open the Mortgage Payoff Calculator' },
              { href: '/tools/mortgage-calculator/', label: 'Estimate the full monthly payment' },
              { href: '/tools/amortization-calculator/', label: 'Compare fixed-loan payoff paths' },
            ]
          : is401kGuide
          ? [
              { href: '/tools/401k-calculator/', label: 'Open the 401K Calculator' },
              { href: '/tools/retirement-calculator/', label: 'Check a wider retirement target' },
              { href: '/tools/investment-calculator/', label: 'Test deposit and return scenarios' },
              { href: '/tools/compound-interest-calculator/', label: 'Check compounding separately' },
            ]
          : isAutoLoanGuide
          ? [
              { href: '/tools/auto-loan-calculator/', label: 'Open the Auto Loan Calculator' },
              { href: '/tools/sales-tax-calculator/', label: 'Check vehicle sales tax math' },
              { href: '/tools/cash-back-or-low-interest-calculator/', label: 'Compare rebate and low-rate offers' },
            ]
          : isBusinessLoanGuide
          ? [
              { href: '/tools/business-loan-calculator/', label: 'Open the Business Loan Calculator' },
              { href: '/tools/interest-rate-calculator/', label: 'Estimate a rate from payment and term' },
              { href: '/tools/profit-goal-calculator/', label: 'Check the project profit target' },
            ]
          : isLiquidityGuide
          ? [
              { href: '/tools/liquidity-ratios-calculator/', label: 'Open the Liquidity Ratios Calculator' },
              { href: '/tools/business-loan-calculator/', label: 'Check a loan payment beside liquidity' },
              { href: '/tools/payback-period-calculator/', label: 'Estimate how fast cash comes back' },
              { href: '/tools/profit-goal-calculator/', label: 'Check the profit target behind the cash plan' },
            ]
          : isDebtRatiosGuide
          ? [
              { href: '/tools/debt-ratios-calculator/', label: 'Open the Debt Ratios Calculator' },
              { href: '/tools/liquidity-ratios-calculator/', label: 'Check short-term payment strength' },
              { href: '/tools/profitability-ratios-calculator/', label: 'Compare debt load with profit' },
              { href: '/tools/operations-ratios-calculator/', label: 'Check asset and receivable efficiency' },
            ]
          : isOperationsRatiosGuide
          ? [
              { href: '/tools/operations-ratios-calculator/', label: 'Open the Operations Ratios Calculator' },
              { href: '/tools/profitability-ratios-calculator/', label: 'Compare operations with profit' },
              { href: '/tools/liquidity-ratios-calculator/', label: 'Check short-term payment strength' },
              { href: '/tools/debt-ratios-calculator/', label: 'Check debt load and interest cover' },
            ]
          : isCanadianMortgageGuide
          ? [
              { href: '/tools/canadian-mortgage-calculator/', label: 'Open the Canadian Mortgage Calculator' },
              { href: '/tools/down-payment-calculator/', label: 'Compare down payment and LTV' },
              { href: '/tools/mortgage-calculator/', label: 'Compare with the plain Mortgage Calculator' },
            ]
          : isUkMortgageGuide
          ? [
              { href: '/tools/mortgage-calculator-uk/', label: 'Open the UK Mortgage Calculator' },
              { href: '/tools/down-payment-calculator/', label: 'Compare deposit and LTV' },
              { href: '/tools/mortgage-calculator/', label: 'Compare with the plain Mortgage Calculator' },
            ]
          : isDownPaymentGuide
          ? [
              { href: '/tools/down-payment-calculator/', label: 'Open the Down Payment Calculator' },
              { href: '/tools/mortgage-calculator/', label: 'Estimate the monthly mortgage payment' },
              { href: '/tools/fha-loan-calculator/', label: 'Compare an FHA-style low-down-payment example' },
            ]
          : isFhaLoanGuide
          ? [
              { href: '/tools/fha-loan-calculator/', label: 'Open the FHA Loan Calculator' },
              { href: '/tools/mortgage-calculator/', label: 'Compare with the plain Mortgage Calculator' },
              { href: '/tools/down-payment-calculator/', label: 'Check upfront cash needed' },
              { href: '/tools/house-affordability-calculator/', label: 'Check the wider affordability question' },
            ]
          : isLoanGuide
          ? [
              { href: '/tools/loan-calculator/', label: 'Open the Loan Calculator' },
              { href: '/tools/amortization-calculator/', label: 'See the payment schedule' },
              { href: '/tools/payment-calculator/', label: 'Run a simpler payment check' },
              { href: '/tools/interest-rate-calculator/', label: 'Back into the rate from a payment quote' },
            ]
          : isFinanceGuide
          ? [
              { href: '/tools/finance-calculator/', label: 'Open the Finance Calculator' },
              { href: '/tools/investment-calculator/', label: 'Use investment-specific wording' },
              { href: '/tools/compound-interest-calculator/', label: 'Check compounding frequency' },
              { href: '/tools/payment-calculator/', label: 'Switch to debt payment math' },
            ]
          : isCdGuide
          ? [
              { href: '/tools/cd-calculator/', label: 'Open the CD Calculator' },
              { href: '/tools/savings-calculator/', label: 'Compare flexible savings instead' },
              { href: '/tools/compound-interest-calculator/', label: 'Check compounding frequency' },
              { href: '/tools/interest-calculator/', label: 'Compare simple and compound interest' },
            ]
          : isBondGuide
          ? [
              { href: '/tools/bond-calculator/', label: 'Open the Bond Calculator' },
              { href: '/tools/investment-calculator/', label: 'Compare broad investment growth' },
              { href: '/tools/mutual-fund-calculator/', label: 'Compare fund-style projections' },
              { href: '/tools/simple-interest-calculator/', label: 'Check coupon-style interest math' },
            ]
          : isRentGuide
          ? [
              { href: '/tools/rent-calculator/', label: 'Open the Rent Calculator' },
              { href: '/tools/salary-calculator/', label: 'Convert salary into monthly income' },
              { href: '/tools/budget-calculator/', label: 'Check the rest of the monthly budget' },
              { href: '/tools/percentage-calculator/', label: 'Compare rent target percentages' },
            ]
          : isAnnuityGuide
          ? [
              { href: '/tools/annuity-calculator/', label: 'Open the Annuity Calculator' },
              { href: '/tools/investment-calculator/', label: 'Test contribution growth' },
              { href: '/tools/retirement-calculator/', label: 'Check a wider retirement target' },
              { href: '/tools/annuity-payout-calculator/', label: 'Estimate payout from an existing balance' },
            ]
          : isCreditCardGuide
          ? [
              { href: '/tools/credit-card-calculator/', label: 'Open the Credit Card Calculator' },
              { href: '/tools/credit-cards-payoff-calculator/', label: 'Estimate combined card payoff' },
              { href: '/tools/interest-calculator/', label: 'Check APR interest math' },
              { href: '/tools/payment-calculator/', label: 'Compare fixed-payment debt' },
            ]
          : isCreditCardsPayoffGuide
          ? [
              { href: '/tools/credit-cards-payoff-calculator/', label: 'Open the Credit Cards Payoff Calculator' },
              { href: '/tools/credit-card-calculator/', label: 'Check one card payoff' },
              { href: '/tools/debt-payoff-calculator/', label: 'Compare a plain debt payoff' },
              { href: '/tools/debt-consolidation-calculator/', label: 'Compare a consolidation offer' },
            ]
          : isInvestmentGuide
          ? [
              { href: '/tools/investment-calculator/', label: 'Open the Investment Calculator' },
              { href: '/tools/compound-interest-calculator/', label: 'Check compounding frequency' },
              { href: '/tools/inflation-calculator/', label: 'Test buying-power pressure' },
              { href: '/tools/retirement-calculator/', label: 'Compare with a retirement target' },
            ]
          : isMarriageTaxGuide
          ? [
              { href: '/tools/marriage-tax-calculator/', label: 'Open the Marriage Tax Calculator' },
              { href: '/tools/income-tax-calculator/', label: 'Run one filing-status estimate' },
              { href: '/tools/take-home-paycheck-calculator/', label: 'Check paycheck withholding separately' },
              { href: '/tools/salary-calculator/', label: 'Convert salary before tax' },
            ]
          : isInterestRateGuide
          ? [
              { href: '/tools/interest-rate-calculator/', label: 'Open the Interest Rate Calculator' },
              { href: '/tools/loan-calculator/', label: 'Find the payment once you know the rate' },
              { href: '/tools/apr-calculator/', label: 'Check fee-loaded APR math' },
              { href: '/tools/payment-calculator/', label: 'Run a plain payment check' },
            ]
          : isCurrencyGuide
          ? [
              { href: '/tools/currency-calculator/', label: 'Open the Currency Calculator' },
              { href: '/tools/percentage-calculator/', label: 'Compare provider fee percentages' },
              { href: '/tools/sales-tax-calculator/', label: 'Add local tax after a purchase conversion' },
              { href: '/tools/finance-calculator/', label: 'Run a broader money projection' },
            ]
          : isStudentLoanGuide
          ? [
              { href: '/tools/student-loan-calculator/', label: 'Open the Student Loan Calculator' },
              { href: '/tools/loan-calculator/', label: 'Compare plain fixed-loan payment math' },
              { href: '/tools/amortization-calculator/', label: 'See a fuller payment schedule' },
              { href: '/tools/repayment-calculator/', label: 'Test a general balance payoff' },
            ]
          : isSocialSecurityGuide
          ? [
              { href: '/tools/social-security-calculator/', label: 'Open the Social Security Calculator' },
              { href: '/tools/retirement-calculator/', label: 'Check a wider retirement target' },
              { href: '/tools/ira-calculator/', label: 'Project IRA growth separately' },
              { href: '/tools/rmd-calculator/', label: 'Estimate required withdrawals later' },
            ]
          : isAdRevenueGuide
          ? [
              { href: '/tools/ad-revenue-calculator/', label: 'Open the Ad Revenue Calculator' },
              { href: '/tools/margin-calculator/', label: 'Compare ad revenue with costs' },
              { href: '/tools/utm-builder/', label: 'Plan traffic links with UTM Builder' },
            ]
          : isEstateTaxGuide
          ? [
              { href: '/tools/estate-tax-calculator/', label: 'Open the Estate Tax Calculator' },
              { href: '/tools/future-value-calculator/', label: 'Test estate growth over time' },
              { href: '/tools/income-tax-calculator/', label: 'Check a separate income tax estimate' },
            ]
          : isIncomeTaxGuide
          ? [
              { href: '/tools/income-tax-calculator/', label: 'Open the Income Tax Calculator' },
              { href: '/tools/salary-calculator/', label: 'Convert salary before tax' },
              { href: '/tools/take-home-paycheck-calculator/', label: 'Estimate paycheck take-home separately' },
            ]
          : undefined,
      },
      {
        title: 'Sources and estimate notes',
        paragraphs: [
          isAutoLoanGuide
            ? 'CFPB and FTC sources both push the same practical warning: compare the total cost, not just the monthly payment. They also explain APR, loan terms, add-ons, trade-ins, and shopping for financing before the dealer visit.'
            : isMortgagePayoffGuide
            ? 'CFPB explains that a payoff amount can be different from the current balance because it can include interest through the payoff date, unpaid fees, and possible prepayment penalties. Fannie Mae also warns that extra payments should be applied to principal if the goal is to reduce balance and future interest.'
            : is401kGuide
            ? 'IRS sources set the 2026 401(k) context: the employee elective deferral limit is $24,500 for many workplace plans, and the general age-50 catch-up is $8,000. IRS 401(k) plan pages also explain that 401(k) salary deferrals are part of a qualified plan, not a personal guess.'
            : isUkMortgageGuide
            ? 'MoneyHelper explains mortgage repayments, repayment versus interest-only mortgages, and mortgage calculators. GOV.UK explains that lenders look at affordability, income, outgoings, deposit, credit, and possible rate changes, and that stamp duty and moving costs are separate from the mortgage payment.'
            : isBusinessLoanGuide
            ? 'SBA and FTC sources are useful here because business financing is not just payment math. SBA explains lender risk and loan context, while FTC warns that some small-business financing offers can have high costs or confusing terms.'
            : isLiquidityGuide
            ? 'OpenStax is useful here because it separates current ratio, quick ratio, cash ratio, and working capital inside financial statement analysis. The SEC balance-sheet guide is useful because the calculator depends on current assets and current liabilities being read from the same statement date.'
            : isDebtRatiosGuide
            ? 'OpenStax is useful here because it separates debt-to-assets, debt-to-equity, and times interest earned as solvency checks. The SEC guide is useful because these ratios depend on balance sheet, income statement, footnote, and industry context instead of one copied number.'
            : isOperationsRatiosGuide
            ? 'OpenStax is useful here because it separates accounts receivable turnover, total asset turnover, inventory turnover, and days sales in inventory as operating-efficiency checks. The SEC guide is useful because inventory, assets, revenue, receivables, cash flow, and footnotes all affect how the ratios should be read.'
            : isProfitabilityRatiosGuide
            ? 'OpenStax is useful here because it separates gross profit margin, operating margin, net profit margin, ROA, ROE, EPS, and price-to-earnings as profitability checks. The SEC guide is useful because income statement layers, shares, assets, equity, cash flow, and footnotes all affect how the ratios should be read.'
            : isStockRatiosGuide
            ? 'OpenStax is useful here because it separates EPS, P/E, book value per share, P/S, P/B, and dividend yield as market-value and valuation checks. FINRA and the SEC are useful because real stock research also needs financial statements, earnings reports, risks, fees, and personal fit.'
            : isSocialSecurityGuide
            ? 'SSA sources matter here because the calculator depends on your full-retirement-age benefit, your birth year, and the claiming-age rules. SSA is also where you check official benefit estimates, full retirement age, early or late claiming, delayed retirement credits, COLA changes, and account-specific records.'
            : isCanadianMortgageGuide
            ? 'Canada.ca explains mortgage terms, amortization, down payment, and mortgage loan insurance. OSFI explains the minimum qualifying rate stress-test idea, while the Bank of Canada policy-rate page helps separate central-bank rate news from the exact lender rate in your quote.'
            : isDownPaymentGuide
            ? 'CFPB explains down payment decisions and why closing costs are separate from the down payment. Fannie Mae adds down-payment, closing-cost, and closing-document context. HUD explains that FHA down payments can be as low as 3.5% for some buyers and properties.'
            : isLoanGuide
            ? 'OpenStax explains loan amortization and the fixed-payment idea. CFPB explains why interest rate and APR are not the same thing, and why written disclosures such as a Loan Estimate or Truth in Lending disclosure matter before signing.'
            : isFinanceGuide
            ? 'OpenStax explains future value and why money can grow over time. CFPB explains compound interest in plain language, and Investor.gov shows the same core inputs: starting amount, monthly contribution, time, estimated rate, and compounding.'
            : isRentGuide
            ? 'MyMoney.gov and CFPB sources help with the budget and debt side. HUD sources are useful because rental help rules often treat rent and tenant-paid utilities together, and USAGov points renters back to lease terms and tenant-rights help when a landlord problem is bigger than a calculator.'
            : isAnnuityGuide
            ? 'OpenStax is useful for the clean annuity formulas. Investor.gov, FINRA, and NAIC are useful for the real-world warning: annuity products can include fees, riders, surrender charges, guarantees, tax issues, state insurance rules, and contract limits that are not in the formula.'
            : isCreditCardGuide
            ? 'CFPB sources are useful here because they explain APR, daily interest, grace periods, minimum payments, payment allocation, and card agreement terms. FTC debt guidance adds the plain warning that paying more than the minimum and stopping new spending can make the payoff real instead of just hopeful.'
            : isCreditCardsPayoffGuide
            ? 'CFPB sources are useful here because combined-card payoff depends on APR, daily interest, grace periods, payment allocation, balance types, and card agreement terms. FTC debt guidance adds the plain warning that paying more than the minimum and stopping new spending can make the payoff real instead of just hopeful.'
            : isDebtPayoffGuide
            ? 'FTC debt guidance is useful because a payment plan is more than calculator math: it can involve creditors, collectors, written agreements, settlement risks, and scams. CFPB debt-collection resources help with rights and collector contact, while consumer.gov keeps the budget step simple.'
            : isDebtConsolidationGuide
            ? 'CFPB consolidation guidance is useful because a lower payment can hide fees, a longer term, or new risk. FTC debt guidance helps with debt-relief scam warnings, while consumer.gov keeps the budget test simple before a new loan is signed.'
            : isRepaymentGuide
            ? 'CFPB disclosure guidance is useful because monthly payment, APR, finance charge, and total paid are different pieces of a loan. Federal Student Aid is useful for the warning that official student loan repayment plans need the Loan Simulator or servicer rules. FTC debt guidance and consumer.gov budget notes help keep the payment realistic.'
            : isStudentLoanGuide
            ? 'Federal Student Aid sources are useful because official federal student loan choices depend on loan type, interest rate, repayment plan, deferment, forbearance, and servicer rules. CFPB sources help separate federal loans from private loans so this page stays honest about what simple payment math can and cannot answer.'
            : isCollegeCostGuide
            ? 'U.S. Department of Education sources are useful because school costs, net price, and College Scorecard data are school-specific. CFPB sources are useful because aid offers split tuition and fees, housing and meals, books, transportation, personal costs, grants, scholarships, work-study, and loans into pieces you should compare line by line.'
            : isCdGuide
            ? 'CFPB explains the basic CD tradeoff: you usually leave money in for a set term, and early withdrawal can mean a penalty. FDIC adds the real shopping checks: insured bank status, insurance limits, brokered CDs, renewal rules, call features, and deposit agreements. OCC penalty notes and CFPB Regulation DD keep APY and early-withdrawal wording honest.'
            : isBondGuide
            ? 'Investor.gov explains bonds as lending money to an issuer that pays interest and repays face value at maturity if things go as planned. Investor.gov and FINRA separate coupon yield, current yield, and YTM, while MSRB explains price, par value, coupon rate, maturity, credit rating, and municipal-bond yield terms. TreasuryDirect matters because DataForSEO shows many searchers mean savings bonds, which need separate official lookup rules.'
            : isPensionGuide
            ? 'PBGC, DOL, and IRS sources are useful here because defined-benefit pensions are plan formulas, not personal account balances. Real benefits can depend on vesting, credited service, payment form, survivor options, plan guarantees, taxes, and the official plan document.'
            : isAnnuityPayoutGuide
            ? 'Investor.gov, FINRA, and NAIC sources are useful here because annuities are contracts, not just formulas. Real payout choices can depend on insurer strength, payout phase, fees, surrender charges, riders, guarantees, taxes, and contract wording.'
            : isInvestmentGuide
            ? 'OpenStax explains time value of money, and Investor.gov is useful for the plain inputs behind this page: starting money, monthly contributions, time, fees, risk, return, and regular investing.'
            : isFhaLoanGuide
            ? 'HUD and CFPB sources explain the key FHA pieces: FHA insures loans made by private lenders, FHA loans can allow down payments as low as 3.5%, mortgage insurance is required, MIP rates depend on HUD rules, closing costs are separate from the down payment, and 2026 county loan limits matter. HUD lists a 2026 one-unit floor of $541,287, a high-cost-area ceiling of $1,249,125, and higher special-exception ceilings for Alaska, Hawaii, Guam, and the U.S. Virgin Islands.'
            : isSalesTaxGuide
            ? 'The IRS source explains state and local sales-tax deduction context. The Tax Foundation source gives current state and local rate context for 2026.'
            : isAdRevenueGuide
            ? 'Google AdSense Help explains page CTR, page RPM, how AdSense works, revenue share, and invalid traffic. Those sources are useful because ad revenue is not just one clean formula.'
            : isEstateTaxGuide
            ? 'IRS estate-tax sources explain the 2026 federal exclusion, gross estate idea, deductions, adjusted taxable gifts, Form 706 timing, and portability context. Those sources are why this guide stays honest about what the calculator can and cannot do.'
            : isInterestRateGuide
            ? 'CFPB explains why a loan interest rate and APR are not the same thing, and Regulation Z shows why APR disclosures follow specific rules. The Minneapolis Fed adds useful context: consumer rates can depend on funding costs, benchmarks, lender margin, credit risk, and the type of loan.'
            : isIncomeTaxGuide
            ? 'IRS 2026 inflation-adjustment sources set the standard deductions and ordinary income bracket thresholds used here. IRS withholding sources, including Publication 15-T and Publication 505, are useful because tax owed, paycheck withholding, estimated tax, and refund size are different questions.'
            : isMarriageTaxGuide
            ? 'IRS 2026 inflation-adjustment sources set the standard deductions and ordinary bracket thresholds used here. IRS Publication 501 is useful because filing status rules matter before anyone treats a calculator result like a filing decision.'
            : isCurrencyGuide
            ? 'Federal Reserve H.10 exchange-rate data is useful context for public reference rates, but this calculator still depends on the exact provider rate and fee you enter. A bank, card network, cash desk, or transfer service can quote a different buy/sell rate, spread, markup, or timestamp.'
            : sourceLinks.length > 0
            ? 'This guide links to public financial, consumer, statistical, or tax references where they are useful for understanding the calculator context.'
            : 'This guide explains the calculator inputs, formula context, and estimate limits without treating the result as a final quote or professional recommendation.',
          isAutoLoanGuide
            ? 'This calculator still stays simple. It does not approve credit, price insurance, know your exact registration fees, decide whether an add-on is worth it, or replace a written lender quote.'
            : isMortgagePayoffGuide
            ? 'This calculator still stays simple. It does not request a payoff statement, calculate daily payoff interest, handle escrow, check unpaid fees, apply servicer rules, approve a recast, or replace written payoff instructions.'
            : is401kGuide
            ? 'This calculator still stays simple. It does not enforce annual contribution limits, catch-up rules, plan eligibility, vesting schedules, Roth or pre-tax treatment, fees, loans, hardship withdrawals, or future tax rules.'
            : isHouseAffordabilityGuide
            ? 'This calculator still stays simple. It does not approve a mortgage, check credit, verify income, price closing costs, know exact tax or insurance bills, estimate repairs, or replace a lender Loan Estimate.'
            : isSavingsGuide
            ? 'This calculator still stays simple. It does not read bank disclosures, calculate exact APY, apply fees, handle balance tiers, track withdrawals, predict future rate changes, or replace your account statement.'
            : isUkMortgageGuide
            ? 'This calculator still stays simple. It does not approve a mortgage, check affordability, include stamp duty, price product fees you do not enter, handle interest-only loans, read leasehold charges, or replace a written lender illustration.'
            : isBusinessLoanGuide
            ? 'This calculator still stays simple. It does not approve a loan, check SBA eligibility, read a merchant cash advance contract, judge collateral, or replace written lender terms.'
            : isLiquidityGuide
            ? 'This calculator still stays simple. It does not audit financial statements, prove solvency, predict cash timing, value inventory, guarantee receivable collection, test lender covenants, or replace accounting advice.'
            : isDebtRatiosGuide
            ? 'This calculator still stays simple. It does not audit financial statements, classify leases, read maturity schedules, test lender covenants, price refinancing risk, judge credit quality, include taxes, or replace accounting or investment advice.'
            : isOperationsRatiosGuide
            ? 'This calculator still stays simple. It does not audit financial statements, prove demand, detect stockouts, judge inventory quality, age receivables, test customer credit risk, adjust seasonality, or replace accounting or management advice.'
            : isCanadianMortgageGuide
            ? 'This calculator still stays simple. It does not add default insurance premiums, check income or debts, approve a mortgage, predict renewal rates, or replace a written lender quote.'
            : isDownPaymentGuide
            ? 'This calculator still stays simple. It does not approve a mortgage, price mortgage insurance, verify assistance, read a Loan Estimate, set escrow deposits, or replace the cash-to-close figure from your lender and settlement company.'
            : isLoanGuide
            ? 'This calculator still stays simple. It does not include origination fees, insurance, taxes, late fees, prepayment penalties, variable-rate changes, lender rounding, approval checks, or official APR disclosures.'
            : isFinanceGuide
            ? 'This calculator still stays simple. It does not include tax, fees, inflation, withdrawals, changing rates, market losses, account limits, or advice about what you should do.'
            : isRentGuide
            ? 'This calculator still stays simple. It does not approve a rental application, check credit, read a lease, know local rent prices, include every fee, price renters insurance, or decide whether a landlord will accept your income.'
            : isAnnuityGuide
            ? 'This calculator still stays simple. It does not price an insurance contract, estimate lifetime income, include mortality assumptions, read fee tables, handle surrender periods, apply tax rules, value riders, or tell you whether an annuity is a good purchase.'
            : isCreditCardGuide
            ? 'This calculator still stays simple. It does not read your statement, calculate average daily balance, split balances by APR, apply fees, model deferred interest, decide payment allocation, keep a grace period, or replace the card agreement.'
            : isCreditCardsPayoffGuide
            ? 'This calculator still stays simple. It does not read each statement, calculate average daily balance, split cards by APR, choose avalanche order, apply fees, model deferred interest, decide payment allocation, preserve a grace period, or replace card agreements.'
            : isStudentLoanGuide
            ? 'This calculator still stays simple. It does not choose an IDR plan, model forgiveness, apply subsidies, handle deferment or forbearance, capitalize interest, check auto-pay discounts, read private-loan fees, or replace Federal Student Aid Loan Simulator or your servicer.'
            : isCollegeCostGuide
            ? 'This calculator still stays simple. It does not read school aid formulas, choose a 529 plan, predict FAFSA results, renew scholarships, price every fee, know residency rules, or replace each school\'s official net price calculator and aid offer.'
            : isCdGuide
            ? 'This calculator still stays simple. It does not read the bank disclosure, calculate exact daily compounding, choose the official APY, check renewal or grace-period rules, price brokered or callable CDs, verify insurance coverage, calculate tax, or promise the early-withdrawal payout.'
            : isBondGuide
            ? 'This calculator still stays simple. It does not solve exact market YTM, price dirty bonds, add accrued interest, model callable or puttable bonds, value EE or I savings bonds, check credit risk, include taxes or fees, or replace official broker, EMMA, FINRA, TreasuryDirect, or offering-document data.'
            : isPensionGuide
            ? 'This calculator still stays simple. It does not read your plan document, prove vesting, apply early-retirement reductions, price survivor options, calculate COLA, decide lump-sum value, apply PBGC limits, estimate tax withholding, or replace an official benefit statement.'
            : isAnnuityPayoutGuide
            ? 'This calculator still stays simple. It does not price an insurance contract, estimate lifetime income, use mortality assumptions, handle surrender periods, apply rider costs, calculate tax withholding, model inflation, or replace an insurer illustration.'
            : isInvestmentGuide
            ? 'This calculator still stays simple. It does not include taxes, fees, inflation, withdrawals, changing returns, market losses, account limits, product risk, or advice about what you should buy.'
            : isFhaLoanGuide
            ? 'This calculator still stays simple. It does not approve credit, verify income, check debt-to-income ratio, choose the right MIP rate, read a county FHA limit, price closing costs, inspect a property, or replace a written lender quote.'
            : isSalesTaxGuide
            ? 'Those sources help with context, but this calculator still does not replace a state rate lookup, an official filing system, or tax advice.'
            : isAdRevenueGuide
            ? 'The calculator still stays simple. It does not read your ad account, approve earnings, predict fill rate, or know which clicks may later be filtered.'
            : isEstateTaxGuide
            ? 'The calculator still stays simple. It does not file Form 706, calculate state estate tax, model DSUE, value trusts or businesses, check GST tax, or replace an estate attorney or tax professional.'
            : isInterestRateGuide
            ? 'This calculator still stays simple. It does not calculate official APR, read lender fees, approve credit, handle changing rates, or replace the Truth in Lending or loan documents you get before signing.'
            : isIncomeTaxGuide
            ? 'This calculator still stays simple. It does not file a return, calculate state tax, payroll tax, capital gains, AMT, penalties, every credit, withholding, or refund size.'
            : isMarriageTaxGuide
            ? 'This calculator still stays simple. It does not file a return, compare married filing separately, calculate state tax, payroll tax, capital gains, every credit, dependents, AMT, phaseouts, community-property rules, or benefit changes.'
            : isSocialSecurityGuide
            ? 'This calculator still stays simple. It does not sign in to SSA, rebuild your 35-year earnings history, check spouse or survivor benefits, model WEP or GPO, handle work earnings tests, price Medicare, calculate tax, or predict future COLA changes.'
            : isCurrencyGuide
            ? 'This calculator still stays simple. It does not fetch live rates, guarantee provider pricing, include fixed transfer fees unless you handle them separately, price ATM or cash pickup fees, choose tax/accounting exchange rates, or replace an official provider quote.'
            : 'Source links improve transparency, but they do not turn a quick calculator into professional advice or a final loan, tax, payroll, or investment answer.',
        ],
        links: sourceLinks,
      },
    ],
    sidecarText: detail.sidecarText ?? (isSalesTaxGuide
      ? `Keep the ${tool.name} open beside this guide. Try $80 at 7.5%, then replace the price and rate with your receipt or checkout numbers.`
      : isMortgagePayoffGuide
      ? 'Keep the Mortgage Payoff Calculator open beside this guide. Try the $280,000 balance example first, then change only the extra monthly principal so you can see what actually moved.'
      : is401kGuide
      ? 'Keep the 401K Calculator open beside this guide. Try the $25,000 saved and $75,000 salary example first, then change only your salary contribution percent so you can see what actually moved.'
      : isHouseAffordabilityGuide
      ? 'Keep the House Affordability Calculator open beside this guide. Try the $110,000 income example first, then change only monthly debts or down payment so you can see what actually moved.'
      : isSavingsGuide
      ? 'Keep the Savings Calculator open beside this guide. Try the $2,500 saved and $300 monthly deposit example first, then change only the monthly deposit so you can see what actually moved.'
      : isRentGuide
      ? 'Keep the Rent Calculator open beside this guide. Try the $5,200 income example first, then change only the rent target or utility estimate so you can see what actually moved.'
      : isCreditCardGuide
      ? 'Keep the Credit Card Calculator open beside this guide. Try the $4,500 balance example first, then change only the payment amount so you can see how much faster the debt moves.'
      : isCreditCardsPayoffGuide
      ? 'Keep the Credit Cards Payoff Calculator open beside this guide. Try the $8,500 combined-balance example first, then change only the extra payment so you can see how much interest moves.'
      : isPensionGuide
      ? 'Keep the Pension Calculator open beside this guide. Try the $82,000 salary and 27 service-year example first, then change only the multiplier so you can see why plan formulas matter.'
      : isAnnuityPayoutGuide
      ? 'Keep the Annuity Payout Calculator open beside this guide. Try the $100,000 example first, then change only the payout term so you can see why a bigger payment may run out faster.'
      : isAutoLoanGuide
      ? 'Keep the Auto Loan Calculator open beside this guide. Try the $32,000 car example first, then change only the term so you can see why a lower payment can still cost more.'
      : isBusinessLoanGuide
      ? 'Keep the Business Loan Calculator open beside this guide. Try the $50,000 example first, then change only the fee so you can see why cash received matters.'
      : isLiquidityGuide
      ? 'Keep the Liquidity Ratios Calculator open beside this guide. Try the $120,000 current-assets example first, then change only inventory so you can see why quick ratio can drop while current ratio stays comfortable.'
      : isDebtRatiosGuide
      ? 'Keep the Debt Ratios Calculator open beside this guide. Try the $220,000 debt example first, then change only interest expense so you can see why interest cover can weaken even when the balance sheet ratios do not move.'
      : isCanadianMortgageGuide
      ? 'Keep the Canadian Mortgage Calculator open beside this guide. Try the $600,000 example first, then change only the down payment or amortization so you can see what actually moved.'
      : isUkMortgageGuide
      ? 'Keep the UK Mortgage Calculator open beside this guide. Try the £300,000 property example first, then change only the deposit or term so you can see what actually moved.'
      : isDownPaymentGuide
      ? 'Keep the Down Payment Calculator open beside this guide. Try the $400,000 example first, then change only the down payment percent so you can see how loan amount, LTV, and cash needed move.'
      : isLoanGuide
      ? 'Keep the Loan Calculator open beside this guide. Try the $12,000 example first, then change only the term so you can see how a lower payment can still raise total interest.'
      : isFinanceGuide
      ? 'Keep the Finance Calculator open beside this guide. Try $2,000 plus $150/month at 5% first, then change only the rate so you can see why the answer is a what-if, not a promise.'
      : isCdGuide
      ? 'Keep the CD Calculator open beside this guide. Try the $10,000, 4.25% APY, 12-month example first, then change only the CD term in months or penalty months so you can see what actually moved.'
      : isBondGuide
      ? 'Keep the Bond Calculator open beside this guide. Try the $1,000 face, $950 price, 5% coupon example first, then change only the market price so you can see why price and yield move against each other.'
      : isInvestmentGuide
      ? 'Keep the Investment Calculator open beside this guide. Try $5,000 plus $250/month at 7% first, then change only the monthly deposit so you can see what actually moved.'
      : isFhaLoanGuide
      ? 'Keep the FHA Loan Calculator open beside this guide. Try the $325,000 example first, then change only the annual MIP so you can see how insurance moves the monthly payment.'
      : isAdRevenueGuide
      ? 'Keep the Ad Revenue Calculator open beside this guide. Try 1,000 views, 1.5% CTR, and $0.35 CPC first, then test a lower CTR so the plan does not feel magically better than it is.'
      : isEstateTaxGuide
      ? 'Keep the Estate Tax Calculator open beside this guide. Try the $18,000,000 example first, then change only prior taxable gifts so you can see how the remaining exclusion moves.'
      : isInterestRateGuide
      ? 'Keep the Interest Rate Calculator open beside this guide. Try $25,000, $483.32/month, and 5 years first, then change only the payment so you can see how quickly the estimated rate moves.'
      : isCurrencyGuide
      ? 'Keep the Currency Calculator open beside this guide. Try 500 at 0.92 with a 2.5% fee first, then change only the rate or fee so you can see exactly what moved.'
      : isStudentLoanGuide
      ? 'Keep the Student Loan Calculator open beside this guide. Try $30,000 at 6.5% for 10 years first, then change only the extra monthly payment so you can see what actually moved.'
      : isCollegeCostGuide
      ? 'Keep the College Cost Calculator open beside this guide. Try the $28,000, 8-year, 4-year example first, then change only monthly savings so you can see how much the gap moves.'
      : isIncomeTaxGuide
      ? 'Keep the Income Tax Calculator open beside this guide. Try the $100,000 single example first, then change only the filing status so you can see how the deduction and brackets move.'
      : isMarriageTaxGuide
      ? 'Keep the Marriage Tax Calculator open beside this guide. Try $90,000 and $70,000 first, then change only one income so you can see when the difference moves.'
      : isSocialSecurityGuide
      ? 'Keep the Social Security Calculator open beside this guide. Try birth year 1962, $2,400 at full retirement age, and claim age 62, 67, or 70 so you can see exactly what moved.'
      : `Keep the ${tool.name} open beside this guide. Try the example first, then replace the numbers with your own scenario and check the estimate limits before copying the result.`),
  };
});

export function getFinanceBlogGuide(slug: string) {
  return financeBlogGuides.find((guide) => guide.slug === slug);
}
