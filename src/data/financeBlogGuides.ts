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
  cfpbCompoundInterest: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/how-does-compound-interest-work-en-1683/',
    label: 'CFPB: How compound interest works',
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
  minneapolisFedConsumerRates: {
    href: 'https://www.minneapolisfed.org/article/2025/what-drives-consumer-interest-rates',
    label: 'Minneapolis Fed: What drives consumer interest rates',
  },
  cfpbLoanEstimate: {
    href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-loan-estimate-en-1995/',
    label: 'CFPB: What is a Loan Estimate?',
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
  vaFundingFee: {
    href: 'https://www.va.gov/housing-assistance/home-loans/funding-fee-and-closing-costs',
    label: 'VA: Funding fee and loan closing costs',
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
    href: 'https://consumer.ftc.gov/articles/home-equity-loans-home-equity-lines-credit',
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

  if (toolSlug === 'finance-calculator') {
    return [
      sourceLinks.investorCompound,
      sourceLinks.cfpbCompoundInterest,
      sourceLinks.investorGovCompoundCalculator,
      sourceLinks.consumerBudgetWorksheet,
    ];
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
    return [sourceLinks.cfpbAprVsInterest, sourceLinks.cfpbApr, sourceLinks.minneapolisFedConsumerRates];
  }

  if (['compound-interest-calculator', 'retirement-calculator', 'interest-calculator', 'simple-interest-calculator', 'future-value-calculator'].includes(toolSlug)) {
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

  if (toolSlug === 'auto-loan-calculator') {
    return [sourceLinks.cfpbAutoLoanCompare, sourceLinks.cfpbAutoLoanTerms, sourceLinks.ftcAutoLease, sourceLinks.cfpbAprVsInterest];
  }

  if (toolSlug === 'business-loan-calculator') {
    return [sourceLinks.sbaLoans, sourceLinks.cfpbAprVsInterest, sourceLinks.ftcSmallBusinessFinancing];
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
    return [
      sourceLinks.googleAdSensePageCtr,
      sourceLinks.googleAdSensePageRpm,
      sourceLinks.googleAdSenseHowWorks,
      sourceLinks.googleAdSenseRevenueShare,
      sourceLinks.googleAdSenseInvalidTraffic,
      sourceLinks.openStaxPercent,
    ];
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
    return [sourceLinks.vaFundingFee, sourceLinks.cfpbMortgage];
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
    return [sourceLinks.cfpbHeloc, sourceLinks.cfpbHomeEquity];
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
    return [sourceLinks.cfpbMortgage, sourceLinks.cfpbAprVsInterest];
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
      'The selling price is $45. If you sell 100 units, the total profit before fees or discounts is $1,500. The margin is 33.33%, because $15 profit is one-third of the final $45 price.',
    ],
    read: [
      'Selling price per unit is the price produced by the markup.',
      'Profit per unit is selling price minus cost.',
      'Margin from that price helps you compare this result with margin-based pricing.',
      'Total profit only makes sense if the unit count is close to what you can actually sell.',
    ],
    mistakes: [
      'Do not read markup percent as margin percent. They use different denominators.',
      'Do not ignore platform fees, shipping, packaging, returns, or discounts if they reduce profit.',
      'Do not assume a higher markup automatically means the market will pay that price.',
      'Do not use this page for target-margin pricing. Use the Margin Calculator when the percent of the sale price is the goal.',
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
    next: ['Use Debt Ratios Calculator to review debt exposure.', 'Use Profitability Ratios Calculator to see whether the business is earning enough profit.'],
  },
  'debt-ratios-calculator': {
    summary: 'Learn how debt ratio, debt-to-equity, and times interest earned describe debt load and interest coverage.',
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
    next: ['Use Liquidity Ratios Calculator for short-term payment strength.', 'Use Profitability Ratios Calculator to compare debt exposure with earnings.'],
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
    summary: 'Learn how loan amount, interest rate, and term turn into a monthly payment and total interest.',
    purpose:
      'The Loan Calculator is for fixed-payment debt where the balance is paid down over time. It shows the monthly payment, total paid, and interest cost behind that payment.',
    enter: [
      'Enter the loan amount before fees or add-ons.',
      'Enter the annual interest rate as a percent, such as 9.5 for 9.5%. Use the contract interest rate for payment math, not a fee-loaded APR unless that is the exact comparison you want.',
      'Enter the repayment term in years. Four years means 48 monthly payments.',
    ],
    example: [
      'For $12,000 at 9.5% for 4 years, the calculator converts the annual rate to a monthly rate and uses 48 monthly payments.',
      'The estimate is about $301.48 per month, about $14,470.93 total paid, and about $2,470.93 total interest before fees.',
    ],
    read: [
      'Monthly payment is the fixed estimate before extra fees or insurance.',
      'Total paid is monthly payment times the number of payments.',
      'Total interest shows the borrowing cost before fees, penalties, taxes, insurance, or variable-rate changes.',
    ],
    mistakes: [
      'Do not compare two loans by payment alone if the terms are different.',
      'Do not use APR-with-fees as if it were always the contract interest rate used for payment math.',
      'Do not ignore origination fees, finance charges, late fees, prepayment penalties, insurance, taxes, or disclosure terms that are not in the calculator.',
    ],
    next: ['Use Payment Calculator for the same formula with a simpler layout.', 'Use Amortization Calculator to see the month-by-month balance.', 'Use Interest Rate Calculator if you know the payment but not the rate.'],
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
    summary: 'Learn how to estimate the annual rate hidden inside a fixed loan payment quote.',
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
    summary: 'Learn how to calculate sales tax amount and final total from a before-tax price and local rate.',
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
    summary: 'Estimate website ad revenue from page views, page CTR, average CPC, and page RPM without treating the number like a confirmed payout.',
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

  if (tool.slug === 'rent-calculator') {
    return 'Rent Calculator Guide';
  }

  if (tool.slug === 'annuity-calculator') {
    return 'Annuity Calculator Guide';
  }

  if (tool.slug === 'credit-card-calculator') {
    return 'Credit Card Calculator Guide';
  }

  if (tool.slug === 'pension-calculator') {
    return 'Pension Calculator Guide';
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

  if (tool.slug === 'rent-calculator') {
    return 'Estimate max rent from income, rent target, debts, and utilities, with deposit, lease-fee, and landlord-rule cautions.';
  }

  if (tool.slug === 'annuity-calculator') {
    return 'Estimate annuity future value and present value from fixed payments, rate, years, frequency, and ordinary or annuity-due timing.';
  }

  if (tool.slug === 'credit-card-calculator') {
    return 'Estimate credit card payoff months, interest, total paid, and final payment from balance, APR, payment, and new charges.';
  }

  if (tool.slug === 'pension-calculator') {
    return 'Estimate a defined-benefit pension from final average salary, credited service, and plan multiplier, with monthly and replacement-rate checks.';
  }

  const base = summary.replace(/\.$/, '');
  const description = `${base}. Includes input tips, examples, result checks, and finance estimate limits for the ${tool.name}.`;
  return description.length > 160 ? `${description.slice(0, 156).trim()}...` : description;
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
  const isSalesTaxGuide = tool.slug === 'sales-tax-calculator';
  const isAdRevenueGuide = tool.slug === 'ad-revenue-calculator';
  const isAutoLoanGuide = tool.slug === 'auto-loan-calculator';
  const isMortgageGuide = tool.slug === 'mortgage-calculator';
  const isMortgagePayoffGuide = tool.slug === 'mortgage-payoff-calculator';
  const is401kGuide = tool.slug === '401k-calculator';
  const isHouseAffordabilityGuide = tool.slug === 'house-affordability-calculator';
  const isSavingsGuide = tool.slug === 'savings-calculator';
  const isRentGuide = tool.slug === 'rent-calculator';
  const isAnnuityGuide = tool.slug === 'annuity-calculator';
  const isCreditCardGuide = tool.slug === 'credit-card-calculator';
  const isPensionGuide = tool.slug === 'pension-calculator';
  const isUkMortgageGuide = tool.slug === 'mortgage-calculator-uk';
  const isBusinessLoanGuide = tool.slug === 'business-loan-calculator';
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

  return {
    slug: `how-to-use-${tool.slug}`,
    toolSlug: tool.slug,
    label: `${tool.name.replace(' Calculator', '')} guide`,
    title: getGuideTitle(tool),
    description: buildFinanceMetaDescription(tool, detail.summary),
    path: `/blog/how-to-use-${tool.slug}/`,
    intro: isMortgageGuide
      ? 'A mortgage payment is not just the loan. This guide shows how home price, down payment, rate, term, property tax, insurance, PMI, and HOA dues turn into one monthly estimate.'
      : isMortgagePayoffGuide
      ? 'Paying extra on a mortgage only helps if the extra money really reduces principal. This guide shows how balance, rate, term, monthly extra principal, and one-time principal payments change payoff time and interest.'
      : is401kGuide
      ? 'A 401K estimate is not just one magic retirement number. This guide shows how salary, contribution percent, employer match, return, and years build a projection before IRS limits and plan rules have the final say.'
      : isHouseAffordabilityGuide
      ? 'A house budget is not just the biggest mortgage a lender might allow. This guide shows how income, existing debts, down payment, rate, property tax, insurance, HOA, and a debt-to-income target shape a home price estimate.'
      : isSavingsGuide
      ? 'A savings goal is easier to trust when the deposits, interest, and gap are split apart. This guide shows how current savings, monthly deposits, rate, time, and a target amount turn into a plan you can check.'
      : isRentGuide
      ? 'A rent number can look fine until debts, utilities, deposits, and lease fees hit. This guide shows how income, a rent target, monthly debts, and utilities turn into a rent ceiling you can compare with listings.'
      : isAnnuityGuide
      ? 'An annuity result is easy to misread if timing and payment frequency are mixed up. This guide shows how one fixed payment, a rate, years, payment count, and ordinary or annuity-due timing change future value and present value.'
      : isCreditCardGuide
      ? 'A credit card payoff estimate changes fast when APR, payment size, and new spending move. This guide shows how one card balance turns into payoff months, interest, total paid, and the last payment.'
      : isPensionGuide
      ? 'A pension estimate is easy to overtrust if the plan formula is guessed. This guide shows how final average salary, credited service, and a plan multiplier turn into annual pension, monthly pension, and replacement rate.'
      : isUkMortgageGuide
      ? 'A UK repayment mortgage is not just the property price split across months. This guide shows how price, deposit, rate, term, and monthly fees turn into a payment, LTV, and interest estimate.'
      : isAutoLoanGuide
      ? 'A car payment can look fine while the full loan is expensive. This guide shows how price, down payment, trade-in, tax, fees, rate, and term turn into the monthly payment and total interest.'
      : isBusinessLoanGuide
      ? 'A business loan can look affordable until the fee and total interest show up. This guide shows how loan amount, rate, term, and origination fee turn into payment, cash received, and total cost.'
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
      : `${detail.summary} Use this guide as a plain-English walkthrough: enter the money values carefully, read the main estimate, then check what the estimate leaves out before you rely on it.`,
    quickStart: isMortgageGuide
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
      : isPensionGuide
      ? [
          'Open the Pension Calculator.',
          'Enter the final average salary or plan salary number used by the pension formula.',
          'Enter credited years of service, including partial years only if the plan counts them.',
          'Enter the plan multiplier as a percent, such as 1.6 for 1.6%.',
          'Calculate, then compare annual pension, monthly pension, and replacement rate before reading the plan document or benefit statement.',
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
      : [
          `Open the ${tool.name}.`,
          detail.enter[0],
          `Use the first example, "${primaryExampleText}", if you want to see a filled-out estimate before entering your own values.`,
          'Calculate, read the formula line, then copy the result only after the amounts, percentages, time periods, or assumptions look right.',
        ],
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
            : isPensionGuide
            ? 'Use it when you want to test a defined-benefit formula before you compare the number with your pension statement, plan summary, retirement office, or PBGC coverage notes.'
            : isMarriageTaxGuide
            ? 'Use it when you want to see whether the numbers you enter create a rough federal marriage bonus, penalty, or no difference before you look at the bigger tax details.'
            : isInvestmentGuide
            ? 'Use it when you want to test a habit, like adding $250 a month, before deciding whether the goal needs more money, more time, or a lower-risk plan. It is projection math, not investment advice.'
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
            : isPensionGuide
            ? 'Pension estimates get shaky when calendar years worked and credited service are treated as the same thing. Use the salary, service, and multiplier your plan actually uses, then check whether vesting, caps, early retirement, or survivor choices change the benefit.'
            : isUkMortgageGuide
            ? 'UK mortgage estimates get messy when one-off costs and monthly costs are mixed together. Property price, deposit, rate, and term build the repayment estimate. The monthly fee field is only for a cost that repeats every month.'
            : isAutoLoanGuide
            ? 'Auto-loan estimates are easy to bend by leaving out fees or focusing only on the monthly payment. Enter the car price, tax, fees, down payment, trade-in, rate, and term as one complete deal.'
            : isBusinessLoanGuide
            ? 'Business-loan offers are easy to misread if you look only at the payment. Enter the loan amount, rate, term, and origination fee so you can see both repayment cost and cash received.'
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
              : isPensionGuide
              ? 'Try the starter example: $82,000 final average salary, 27 credited service years, and a 1.6% multiplier. The estimate is $35,424 per year, $2,952 per month, and a 43.2% replacement rate before taxes or plan adjustments.'
              : isAutoLoanGuide
              ? 'Try the starter example: a $32,000 vehicle, $4,000 down, $3,000 trade-in, $900 fees, 6% sales tax, and 7.2% for 5 years. The estimate is about $549.92 per month, with about $27,640 financed and about $5,355.02 in interest.'
              : isBusinessLoanGuide
              ? 'Try the starter example: $50,000 at 9.5% for 5 years with a 2% origination fee. The estimate is about $1,050.09 per month, $13,005.58 in interest, $1,000 in fees, $49,000 cash received, and $64,005.58 total cost with fee.'
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
            : isPensionGuide
            ? 'Start with the plan salary number, multiply by credited service, then apply the multiplier percentage. IRS and DOL materials separate defined-benefit pensions from contribution accounts, and PBGC coverage rules are another reason to check the official plan source before trusting a quick estimate.'
            : isMortgagePayoffGuide
            ? 'The calculator first finds the scheduled fixed mortgage payment. Then it subtracts any one-time principal payment, adds extra monthly principal, and simulates month-by-month interest until the balance reaches zero.'
            : is401kGuide
            ? 'The calculator turns salary contribution percent into a monthly employee deposit, estimates the employer match from the match rate and match cap, then compounds the current balance and monthly deposits.'
            : isAutoLoanGuide
            ? 'The formula is not the hard part. The hard part is using the same full deal each time: tax, fees, down payment, trade-in, rate, and term. That is why the calculator shows amount financed and total interest beside the monthly payment.'
            : isBusinessLoanGuide
            ? 'The formula is only one part of the decision. The fee matters because you may repay the full loan amount even when the cash you receive is lower.'
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
            : isCreditCardGuide
            ? 'Most bad credit card payoff estimates come from paying only the minimum without checking time, adding new spending every month, ignoring fees or promotions, or expecting simple monthly math to match daily-balance billing exactly.'
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
            : isBusinessLoanGuide
            ? 'A related tool can help when the loan payment is only one part of the decision, such as the rate, a plain fixed loan, or the profit target for the project.'
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
            : isPensionGuide
            ? 'PBGC, DOL, and IRS sources are useful here because defined-benefit pensions are plan formulas, not personal account balances. Real benefits can depend on vesting, credited service, payment form, survivor options, plan guarantees, taxes, and the official plan document.'
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
            : isPensionGuide
            ? 'This calculator still stays simple. It does not read your plan document, prove vesting, apply early-retirement reductions, price survivor options, calculate COLA, decide lump-sum value, apply PBGC limits, estimate tax withholding, or replace an official benefit statement.'
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
            : 'Source links improve transparency, but they do not turn a quick calculator into professional advice or a final loan, tax, payroll, or investment answer.',
        ],
        links: sourceLinks,
      },
    ],
    sidecarText: isSalesTaxGuide
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
      : isPensionGuide
      ? 'Keep the Pension Calculator open beside this guide. Try the $82,000 salary and 27 service-year example first, then change only the multiplier so you can see why plan formulas matter.'
      : isAutoLoanGuide
      ? 'Keep the Auto Loan Calculator open beside this guide. Try the $32,000 car example first, then change only the term so you can see why a lower payment can still cost more.'
      : isBusinessLoanGuide
      ? 'Keep the Business Loan Calculator open beside this guide. Try the $50,000 example first, then change only the fee so you can see why cash received matters.'
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
      : isIncomeTaxGuide
      ? 'Keep the Income Tax Calculator open beside this guide. Try the $100,000 single example first, then change only the filing status so you can see how the deduction and brackets move.'
      : isMarriageTaxGuide
      ? 'Keep the Marriage Tax Calculator open beside this guide. Try $90,000 and $70,000 first, then change only one income so you can see when the difference moves.'
      : `Keep the ${tool.name} open beside this guide. Try the example first, then replace the numbers with your own scenario and check the estimate limits before copying the result.`,
  };
});

export function getFinanceBlogGuide(slug: string) {
  return financeBlogGuides.find((guide) => guide.slug === slug);
}
