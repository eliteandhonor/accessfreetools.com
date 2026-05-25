import { useMemo, useState, type HTMLAttributes, type KeyboardEvent } from 'react';
import {
  calculateAmortizationSummary,
  calculateAdRevenueEstimate,
  calculateAutoLoanSummary,
  calculateAnnuity,
  calculateAnnuityPayout,
  calculateAssetLease,
  calculateAutoLease,
  calculateAprEstimate,
  calculateBondEstimate,
  calculateAverageReturn,
  calculateBreakEven,
  calculateBudget,
  calculateBusinessLoan,
  calculateCashBackLowInterest,
  calculateCdEstimate,
  calculateCollegeCost,
  calculateCanadianMortgage,
  calculateCommission,
  calculateCreditCardPayoff,
  calculateCompoundInterest,
  calculateCurrencyConversion,
  calculateDebtConsolidation,
  calculateDebtRatios,
  calculateDebtToIncome,
  calculateDepreciationEstimate,
  calculateDiscountEstimate,
  calculateDownPayment,
  calculateEstateTaxEstimate,
  calculateFederalIncomeTax2026,
  calculateFhaLoan,
  calculateFixedDebtPayoff,
  calculateFourOhOneKProjection,
  calculateFutureValue,
  calculateHeloc,
  calculateHomeEquityLoan,
  calculateHouseAffordability,
  calculateInflationAdjustment,
  calculateInterestRateFromPayment,
  calculateIrr,
  calculateIraProjection,
  calculateInvestmentGrowth,
  calculateLoanSummary,
  calculateLiquidityRatios,
  calculateMarginEstimate,
  calculateMarriageTaxComparison,
  calculateMarkupPrice,
  calculateMutualFundEstimate,
  calculateOperationsRatios,
  calculateMortgagePayoffSummary,
  calculateMortgagePayment,
  calculatePaybackPeriod,
  calculatePensionEstimate,
  calculatePresentValue,
  calculateProfitabilityRatios,
  calculateProfitGoal,
  calculateRefinance,
  calculateRealEstateReturn,
  calculateRetirementSavings,
  calculateRentalProperty,
  calculateRentVsBuy,
  calculateRmdEstimate,
  calculateRoi,
  calculateSalaryBreakdown,
  calculateSavingsProjection,
  calculateSocialSecurityClaiming,
  calculateTakeHomePaycheck,
  calculateUkMortgage,
  calculateVaMortgage,
  calculateRentAffordability,
  calculateSalesTax,
  calculateSimpleInterest,
  calculateStockRatios,
  calculateVat,
  formatCalculatorNumber,
  type AnnuityTiming,
  type DepreciationMethod,
  type FederalFilingStatus,
  type VatMode,
} from '../lib/calculator';

export type FinanceToolVariant =
  | 'mortgage'
  | 'loan'
  | 'auto-loan'
  | 'interest'
  | 'payment'
  | 'retirement'
  | 'amortization'
  | 'investment'
  | 'currency'
  | 'inflation'
  | 'finance'
  | 'mortgage-payoff'
  | '401k'
  | 'house-affordability'
  | 'savings'
  | 'rent'
  | 'annuity'
  | 'credit-card'
  | 'pension'
  | 'annuity-payout'
  | 'credit-cards-payoff'
  | 'debt-payoff'
  | 'debt-consolidation'
  | 'repayment'
  | 'student-loan'
  | 'college-cost'
  | 'simple-interest'
  | 'cd'
  | 'bond'
  | 'mutual-fund'
  | 'roth-ira'
  | 'ira'
  | 'vat'
  | 'cash-back-low-interest'
  | 'auto-lease'
  | 'depreciation'
  | 'average-return'
  | 'margin'
  | 'ad-revenue'
  | 'break-even'
  | 'markup'
  | 'profit-goal'
  | 'liquidity-ratios'
  | 'debt-ratios'
  | 'operations-ratios'
  | 'profitability-ratios'
  | 'stock-ratios'
  | 'discount'
  | 'business-loan'
  | 'debt-to-income'
  | 'personal-loan'
  | 'boat-loan'
  | 'lease'
  | 'refinance'
  | 'budget'
  | 'marriage-tax'
  | 'estate-tax'
  | 'social-security'
  | 'rmd'
  | 'real-estate'
  | 'take-home-paycheck'
  | 'rental-property'
  | 'irr'
  | 'roi'
  | 'apr'
  | 'fha-loan'
  | 'va-mortgage'
  | 'home-equity-loan'
  | 'heloc'
  | 'down-payment'
  | 'rent-vs-buy'
  | 'payback-period'
  | 'present-value'
  | 'future-value'
  | 'commission'
  | 'mortgage-uk'
  | 'canadian-mortgage'
  | 'percent-off'
  | 'income-tax'
  | 'compound-interest'
  | 'salary'
  | 'interest-rate'
  | 'sales-tax';

type InputMode = HTMLAttributes<HTMLInputElement>['inputMode'];
type FinanceInputs = Record<string, string>;

interface SelectOption {
  label: string;
  value: string;
}

interface FinanceField {
  key: string;
  label: string;
  type?: 'number' | 'select';
  inputMode?: InputMode;
  placeholder?: string;
  options?: SelectOption[];
}

interface FinanceExample {
  label: string;
  inputs: FinanceInputs;
}

interface FinanceMode {
  id: string;
  label: string;
  symbol: string;
  fields: FinanceField[];
  defaultInputs: FinanceInputs;
  examples: FinanceExample[];
}

interface FinanceConfig {
  title: string;
  buttonLabel: string;
  emptyHistory: string;
  privacyNote: string;
  modes: FinanceMode[];
}

interface FinanceCalculation {
  expression: string;
  answer: string;
  label: string;
  metrics: Array<{ label: string; value: string }>;
  steps: string[];
  note?: string;
}

interface Props {
  variant: FinanceToolVariant;
}

const numberInput: InputMode = 'decimal';
const numberField = (key: string, label: string, placeholder?: string): FinanceField => ({
  key,
  label,
  placeholder,
  inputMode: numberInput,
  type: 'number',
});
const selectField = (key: string, label: string, options: SelectOption[]): FinanceField => ({
  key,
  label,
  type: 'select',
  options,
});

const compoundOptions: SelectOption[] = [
  { label: 'Annually', value: '1' },
  { label: 'Semiannually', value: '2' },
  { label: 'Quarterly', value: '4' },
  { label: 'Monthly', value: '12' },
  { label: 'Daily', value: '365' },
];

const filingStatusOptions: SelectOption[] = [
  { label: 'Single', value: 'single' },
  { label: 'Married filing jointly', value: 'married-joint' },
  { label: 'Married filing separately', value: 'married-separate' },
  { label: 'Head of household', value: 'head-household' },
];

const vatModeOptions: SelectOption[] = [
  { label: 'Add VAT to net price', value: 'add' },
  { label: 'Remove VAT from gross price', value: 'remove' },
];

const depreciationMethodOptions: SelectOption[] = [
  { label: 'Straight-line', value: 'straight-line' },
  { label: 'Declining balance', value: 'declining-balance' },
];

const yesNoOptions: SelectOption[] = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

const payPeriodOptions: SelectOption[] = [
  { label: 'Weekly (52)', value: '52' },
  { label: 'Biweekly (26)', value: '26' },
  { label: 'Semimonthly (24)', value: '24' },
  { label: 'Monthly (12)', value: '12' },
];

const paymentFrequencyOptions: SelectOption[] = [
  { label: 'Monthly', value: '12' },
  { label: 'Semimonthly', value: '24' },
  { label: 'Biweekly', value: '26' },
  { label: 'Weekly', value: '52' },
];

const financeConfigs: Record<FinanceToolVariant, FinanceConfig> = {
  mortgage: {
    title: 'Mortgage Calculator',
    buttonLabel: 'Estimate mortgage',
    emptyHistory: 'Recent mortgage estimates will appear here.',
    privacyNote: 'Mortgage estimates are planning numbers, not lender quotes, approvals, or final escrow amounts.',
    modes: [
      {
        id: 'mortgage',
        label: 'Mortgage',
        symbol: 'MTG',
        fields: [
          numberField('homePrice', 'Home price ($)'),
          numberField('downPayment', 'Down payment ($)'),
          numberField('annualRatePercent', 'Interest rate (%)'),
          numberField('years', 'Loan term (years)'),
          numberField('annualPropertyTax', 'Property tax per year ($)'),
          numberField('monthlyInsurance', 'Insurance per month ($)'),
          numberField('monthlyPmi', 'PMI per month ($)'),
          numberField('monthlyHoa', 'HOA per month ($)'),
        ],
        defaultInputs: {
          homePrice: '400000',
          downPayment: '80000',
          annualRatePercent: '6.5',
          years: '30',
          annualPropertyTax: '4800',
          monthlyInsurance: '140',
          monthlyPmi: '0',
          monthlyHoa: '75',
        },
        examples: [
          { label: '$400k home, 20% down', inputs: { homePrice: '400000', downPayment: '80000', annualRatePercent: '6.5', years: '30', annualPropertyTax: '4800', monthlyInsurance: '140', monthlyPmi: '0', monthlyHoa: '75' } },
          { label: '$320k loan, no HOA', inputs: { homePrice: '360000', downPayment: '40000', annualRatePercent: '5.9', years: '30', annualPropertyTax: '3600', monthlyInsurance: '120', monthlyPmi: '95', monthlyHoa: '0' } },
          { label: '15-year comparison', inputs: { homePrice: '400000', downPayment: '80000', annualRatePercent: '6.1', years: '15', annualPropertyTax: '4800', monthlyInsurance: '140', monthlyPmi: '0', monthlyHoa: '75' } },
        ],
      },
    ],
  },
  loan: {
    title: 'Loan Calculator',
    buttonLabel: 'Calculate loan',
    emptyHistory: 'Recent loan estimates will appear here.',
    privacyNote: 'Loan estimates do not include lender fees, penalties, insurance, or approval rules.',
    modes: [
      {
        id: 'loan',
        label: 'Loan',
        symbol: 'PAY',
        fields: [
          numberField('principal', 'Loan amount ($)'),
          numberField('annualRatePercent', 'Interest rate (%)'),
          numberField('years', 'Loan term (years)'),
        ],
        defaultInputs: { principal: '12000', annualRatePercent: '9.5', years: '4' },
        examples: [
          { label: '$12k personal loan', inputs: { principal: '12000', annualRatePercent: '9.5', years: '4' } },
          { label: '$50k over 6 years', inputs: { principal: '50000', annualRatePercent: '7', years: '6' } },
          { label: '0% promo', inputs: { principal: '3000', annualRatePercent: '0', years: '1' } },
        ],
      },
    ],
  },
  'auto-loan': {
    title: 'Auto Loan Calculator',
    buttonLabel: 'Estimate auto loan',
    emptyHistory: 'Recent auto loan estimates will appear here.',
    privacyNote: 'Auto loan estimates can change with dealer fees, rebates, registration, tax rules, and credit approval.',
    modes: [
      {
        id: 'auto-loan',
        label: 'Auto loan',
        symbol: 'AUTO',
        fields: [
          numberField('purchasePrice', 'Vehicle price ($)'),
          numberField('downPayment', 'Down payment ($)'),
          numberField('tradeIn', 'Trade-in value ($)'),
          numberField('fees', 'Fees ($)'),
          numberField('salesTaxPercent', 'Sales tax (%)'),
          numberField('annualRatePercent', 'Interest rate (%)'),
          numberField('years', 'Loan term (years)'),
        ],
        defaultInputs: { purchasePrice: '32000', downPayment: '4000', tradeIn: '3000', fees: '900', salesTaxPercent: '6', annualRatePercent: '7.2', years: '5' },
        examples: [
          { label: '$32k used vehicle', inputs: { purchasePrice: '32000', downPayment: '4000', tradeIn: '3000', fees: '900', salesTaxPercent: '6', annualRatePercent: '7.2', years: '5' } },
          { label: 'Lower down payment', inputs: { purchasePrice: '28000', downPayment: '1500', tradeIn: '0', fees: '750', salesTaxPercent: '6.25', annualRatePercent: '7.9', years: '6' } },
          { label: '48-month term', inputs: { purchasePrice: '30000', downPayment: '5000', tradeIn: '2500', fees: '850', salesTaxPercent: '5.5', annualRatePercent: '6.8', years: '4' } },
        ],
      },
    ],
  },
  interest: {
    title: 'Interest Calculator',
    buttonLabel: 'Calculate interest',
    emptyHistory: 'Recent interest estimates will appear here.',
    privacyNote: 'Interest estimates are educational and do not include taxes, fees, penalties, or account rules.',
    modes: [
      {
        id: 'simple',
        label: 'Simple',
        symbol: 'SI',
        fields: [
          numberField('principal', 'Principal ($)'),
          numberField('annualRatePercent', 'Interest rate (%)'),
          numberField('years', 'Time (years)'),
        ],
        defaultInputs: { principal: '1000', annualRatePercent: '5', years: '3' },
        examples: [
          { label: '$1k at 5%', inputs: { principal: '1000', annualRatePercent: '5', years: '3' } },
          { label: '$2.5k at 4.5%', inputs: { principal: '2500', annualRatePercent: '4.5', years: '5' } },
          { label: 'One-year check', inputs: { principal: '800', annualRatePercent: '8', years: '1' } },
        ],
      },
      {
        id: 'compound',
        label: 'Compound',
        symbol: 'CI',
        fields: [
          numberField('principal', 'Initial amount ($)'),
          numberField('monthlyContribution', 'Monthly contribution ($)'),
          numberField('annualRatePercent', 'Interest rate (%)'),
          numberField('years', 'Time (years)'),
          selectField('compoundFrequency', 'Compounding', compoundOptions),
        ],
        defaultInputs: { principal: '1000', monthlyContribution: '100', annualRatePercent: '6', years: '10', compoundFrequency: '12' },
        examples: [
          { label: '$100/month', inputs: { principal: '1000', monthlyContribution: '100', annualRatePercent: '6', years: '10', compoundFrequency: '12' } },
          { label: 'Quarterly compounding', inputs: { principal: '2500', monthlyContribution: '0', annualRatePercent: '5', years: '8', compoundFrequency: '4' } },
          { label: 'Daily compounding', inputs: { principal: '5000', monthlyContribution: '50', annualRatePercent: '4.5', years: '5', compoundFrequency: '365' } },
        ],
      },
    ],
  },
  payment: {
    title: 'Payment Calculator',
    buttonLabel: 'Calculate payment',
    emptyHistory: 'Recent payment estimates will appear here.',
    privacyNote: 'Payment estimates do not include fees, variable rates, insurance, or lender-specific rules.',
    modes: [
      {
        id: 'payment',
        label: 'Payment',
        symbol: '$/MO',
        fields: [
          numberField('principal', 'Amount financed ($)'),
          numberField('annualRatePercent', 'Interest rate (%)'),
          numberField('years', 'Term (years)'),
        ],
        defaultInputs: { principal: '5000', annualRatePercent: '8', years: '3' },
        examples: [
          { label: '$5k over 3 years', inputs: { principal: '5000', annualRatePercent: '8', years: '3' } },
          { label: '$15k over 5 years', inputs: { principal: '15000', annualRatePercent: '10', years: '5' } },
          { label: '$20k at 6%', inputs: { principal: '20000', annualRatePercent: '6', years: '4' } },
        ],
      },
    ],
  },
  retirement: {
    title: 'Retirement Calculator',
    buttonLabel: 'Project retirement',
    emptyHistory: 'Recent retirement projections will appear here.',
    privacyNote: 'Retirement projections do not include tax, fees, contribution limits, inflation, withdrawals, or market volatility.',
    modes: [
      {
        id: 'retirement',
        label: 'Retirement',
        symbol: 'RET',
        fields: [
          numberField('currentSavings', 'Current savings ($)'),
          numberField('monthlyContribution', 'Monthly contribution ($)'),
          numberField('annualReturnPercent', 'Estimated return (%)'),
          numberField('years', 'Years to grow'),
          numberField('targetAmount', 'Target amount ($)'),
        ],
        defaultInputs: { currentSavings: '25000', monthlyContribution: '500', annualReturnPercent: '7', years: '25', targetAmount: '1000000' },
        examples: [
          { label: 'Early saver', inputs: { currentSavings: '25000', monthlyContribution: '500', annualReturnPercent: '7', years: '25', targetAmount: '1000000' } },
          { label: 'Catch-up view', inputs: { currentSavings: '80000', monthlyContribution: '900', annualReturnPercent: '6', years: '15', targetAmount: '750000' } },
          { label: 'Conservative return', inputs: { currentSavings: '50000', monthlyContribution: '400', annualReturnPercent: '4', years: '20', targetAmount: '600000' } },
        ],
      },
    ],
  },
  amortization: {
    title: 'Amortization Calculator',
    buttonLabel: 'Calculate payoff',
    emptyHistory: 'Recent amortization estimates will appear here.',
    privacyNote: 'Amortization estimates assume a fixed rate and may differ from lender payoff rules or prepayment policies.',
    modes: [
      {
        id: 'amortization',
        label: 'Payoff',
        symbol: 'AMORT',
        fields: [
          numberField('principal', 'Loan amount ($)'),
          numberField('annualRatePercent', 'Interest rate (%)'),
          numberField('years', 'Original term (years)'),
          numberField('extraMonthlyPayment', 'Extra monthly payment ($)'),
        ],
        defaultInputs: { principal: '200000', annualRatePercent: '6', years: '30', extraMonthlyPayment: '100' },
        examples: [
          { label: '+$100/month', inputs: { principal: '200000', annualRatePercent: '6', years: '30', extraMonthlyPayment: '100' } },
          { label: 'No extra payment', inputs: { principal: '50000', annualRatePercent: '8', years: '6', extraMonthlyPayment: '0' } },
          { label: '+$250/month', inputs: { principal: '300000', annualRatePercent: '6.5', years: '30', extraMonthlyPayment: '250' } },
        ],
      },
    ],
  },
  investment: {
    title: 'Investment Calculator',
    buttonLabel: 'Project investment',
    emptyHistory: 'Recent investment projections will appear here.',
    privacyNote: 'Investment projections are not guaranteed and do not include fees, tax, risk, or market losses.',
    modes: [
      {
        id: 'investment',
        label: 'Investment',
        symbol: 'INV',
        fields: [
          numberField('principal', 'Starting investment ($)'),
          numberField('monthlyContribution', 'Monthly contribution ($)'),
          numberField('annualReturnPercent', 'Estimated return (%)'),
          numberField('years', 'Time (years)'),
        ],
        defaultInputs: { principal: '5000', monthlyContribution: '250', annualReturnPercent: '7', years: '20' },
        examples: [
          { label: '$250/month', inputs: { principal: '5000', monthlyContribution: '250', annualReturnPercent: '7', years: '20' } },
          { label: 'No deposits', inputs: { principal: '10000', monthlyContribution: '0', annualReturnPercent: '6', years: '15' } },
          { label: '$300/month', inputs: { principal: '2000', monthlyContribution: '300', annualReturnPercent: '5.5', years: '12' } },
        ],
      },
    ],
  },
  currency: {
    title: 'Currency Calculator',
    buttonLabel: 'Convert currency',
    emptyHistory: 'Recent currency conversions will appear here.',
    privacyNote: 'Currency estimates use the manual exchange rate you enter. This tool does not look up live market, bank, or card rates.',
    modes: [
      {
        id: 'currency',
        label: 'Manual rate',
        symbol: 'FX',
        fields: [
          numberField('amount', 'Amount to convert'),
          numberField('exchangeRate', 'Exchange rate (target per 1 source)'),
          numberField('feePercent', 'Exchange fee (%)'),
        ],
        defaultInputs: { amount: '100', exchangeRate: '1.25', feePercent: '0' },
        examples: [
          { label: '100 at 1.25', inputs: { amount: '100', exchangeRate: '1.25', feePercent: '0' } },
          { label: 'Travel fee check', inputs: { amount: '500', exchangeRate: '0.92', feePercent: '2.5' } },
          { label: 'No-fee transfer', inputs: { amount: '1000', exchangeRate: '1.47', feePercent: '0' } },
        ],
      },
    ],
  },
  'mortgage-payoff': {
    title: 'Mortgage Payoff Calculator',
    buttonLabel: 'Estimate payoff',
    emptyHistory: 'Recent mortgage payoff estimates will appear here.',
    privacyNote: 'Mortgage payoff estimates assume a fixed rate and do not include lender payoff quotes, escrow, fees, or prepayment rules.',
    modes: [
      {
        id: 'mortgage-payoff',
        label: 'Payoff',
        symbol: 'PAYOFF',
        fields: [
          numberField('principal', 'Current loan balance ($)'),
          numberField('annualRatePercent', 'Interest rate (%)'),
          numberField('years', 'Remaining term (years)'),
          numberField('extraMonthlyPayment', 'Extra monthly payment ($)'),
          numberField('oneTimePayment', 'One-time extra payment ($)'),
        ],
        defaultInputs: { principal: '280000', annualRatePercent: '6.25', years: '25', extraMonthlyPayment: '200', oneTimePayment: '0' },
        examples: [
          { label: '+$200/month', inputs: { principal: '280000', annualRatePercent: '6.25', years: '25', extraMonthlyPayment: '200', oneTimePayment: '0' } },
          { label: '$5k one-time', inputs: { principal: '240000', annualRatePercent: '5.8', years: '22', extraMonthlyPayment: '0', oneTimePayment: '5000' } },
          { label: 'Aggressive payoff', inputs: { principal: '320000', annualRatePercent: '6.6', years: '28', extraMonthlyPayment: '500', oneTimePayment: '10000' } },
        ],
      },
    ],
  },
  '401k': {
    title: '401K Calculator',
    buttonLabel: 'Project 401K',
    emptyHistory: 'Recent 401K projections will appear here.',
    privacyNote: '401K projections do not enforce plan rules, IRS limits, vesting, taxes, fees, loans, withdrawals, or market volatility.',
    modes: [
      {
        id: '401k',
        label: '401K',
        symbol: '401K',
        fields: [
          numberField('currentBalance', 'Current balance ($)'),
          numberField('annualSalary', 'Annual salary ($)'),
          numberField('employeeContributionPercent', 'Your contribution (%)'),
          numberField('employerMatchPercent', 'Employer match (%)'),
          numberField('employerMatchLimitPercent', 'Match limit (% of salary)'),
          numberField('annualReturnPercent', 'Estimated return (%)'),
          numberField('years', 'Years to grow'),
        ],
        defaultInputs: { currentBalance: '25000', annualSalary: '75000', employeeContributionPercent: '8', employerMatchPercent: '50', employerMatchLimitPercent: '6', annualReturnPercent: '7', years: '25' },
        examples: [
          { label: '8% with 50% match', inputs: { currentBalance: '25000', annualSalary: '75000', employeeContributionPercent: '8', employerMatchPercent: '50', employerMatchLimitPercent: '6', annualReturnPercent: '7', years: '25' } },
          { label: 'Start from zero', inputs: { currentBalance: '0', annualSalary: '60000', employeeContributionPercent: '6', employerMatchPercent: '100', employerMatchLimitPercent: '4', annualReturnPercent: '6', years: '30' } },
          { label: 'Catch-up scenario', inputs: { currentBalance: '120000', annualSalary: '95000', employeeContributionPercent: '12', employerMatchPercent: '50', employerMatchLimitPercent: '6', annualReturnPercent: '5.5', years: '15' } },
        ],
      },
    ],
  },
  'house-affordability': {
    title: 'House Affordability Calculator',
    buttonLabel: 'Estimate affordability',
    emptyHistory: 'Recent house affordability estimates will appear here.',
    privacyNote: 'House affordability estimates are simple planning numbers and are not mortgage approval, underwriting, or financial advice.',
    modes: [
      {
        id: 'house-affordability',
        label: 'Affordability',
        symbol: 'HOME',
        fields: [
          numberField('annualIncome', 'Annual gross income ($)'),
          numberField('monthlyDebts', 'Monthly debt payments ($)'),
          numberField('downPayment', 'Down payment ($)'),
          numberField('annualRatePercent', 'Mortgage rate (%)'),
          numberField('years', 'Loan term (years)'),
          numberField('debtToIncomePercent', 'Debt-to-income target (%)'),
          numberField('propertyTaxPercent', 'Property tax (% of home/year)'),
          numberField('monthlyInsurance', 'Insurance per month ($)'),
          numberField('monthlyHoa', 'HOA per month ($)'),
        ],
        defaultInputs: { annualIncome: '110000', monthlyDebts: '450', downPayment: '60000', annualRatePercent: '6.5', years: '30', debtToIncomePercent: '36', propertyTaxPercent: '1.2', monthlyInsurance: '140', monthlyHoa: '0' },
        examples: [
          { label: '$110k income', inputs: { annualIncome: '110000', monthlyDebts: '450', downPayment: '60000', annualRatePercent: '6.5', years: '30', debtToIncomePercent: '36', propertyTaxPercent: '1.2', monthlyInsurance: '140', monthlyHoa: '0' } },
          { label: 'Lower debts', inputs: { annualIncome: '90000', monthlyDebts: '150', downPayment: '45000', annualRatePercent: '6.25', years: '30', debtToIncomePercent: '33', propertyTaxPercent: '1.1', monthlyInsurance: '120', monthlyHoa: '75' } },
          { label: 'Higher down payment', inputs: { annualIncome: '140000', monthlyDebts: '700', downPayment: '120000', annualRatePercent: '6.8', years: '30', debtToIncomePercent: '36', propertyTaxPercent: '1.3', monthlyInsurance: '170', monthlyHoa: '0' } },
        ],
      },
    ],
  },
  savings: {
    title: 'Savings Calculator',
    buttonLabel: 'Project savings',
    emptyHistory: 'Recent savings projections will appear here.',
    privacyNote: 'Savings projections use your chosen rate and do not include taxes, fees, changing rates, or account rules.',
    modes: [
      {
        id: 'savings',
        label: 'Savings',
        symbol: 'SAVE',
        fields: [
          numberField('currentSavings', 'Current savings ($)'),
          numberField('monthlyDeposit', 'Monthly deposit ($)'),
          numberField('annualRatePercent', 'Annual rate (%)'),
          numberField('years', 'Time (years)'),
          numberField('targetAmount', 'Target amount ($)'),
        ],
        defaultInputs: { currentSavings: '2500', monthlyDeposit: '300', annualRatePercent: '4', years: '5', targetAmount: '25000' },
        examples: [
          { label: '$300/month goal', inputs: { currentSavings: '2500', monthlyDeposit: '300', annualRatePercent: '4', years: '5', targetAmount: '25000' } },
          { label: 'Emergency fund', inputs: { currentSavings: '1000', monthlyDeposit: '250', annualRatePercent: '3.5', years: '2', targetAmount: '8000' } },
          { label: 'Longer horizon', inputs: { currentSavings: '5000', monthlyDeposit: '200', annualRatePercent: '4.5', years: '10', targetAmount: '40000' } },
        ],
      },
    ],
  },
  rent: {
    title: 'Rent Calculator',
    buttonLabel: 'Estimate rent',
    emptyHistory: 'Recent rent affordability estimates will appear here.',
    privacyNote: 'Rent estimates are planning numbers and do not include application rules, deposits, local market changes, or lease terms.',
    modes: [
      {
        id: 'rent',
        label: 'Rent budget',
        symbol: 'RENT',
        fields: [
          numberField('monthlyIncome', 'Monthly income ($)'),
          numberField('targetRentPercent', 'Target rent percent (%)'),
          numberField('monthlyDebts', 'Monthly debts ($)'),
          numberField('monthlyUtilities', 'Estimated utilities ($)'),
        ],
        defaultInputs: { monthlyIncome: '5200', targetRentPercent: '30', monthlyDebts: '350', monthlyUtilities: '180' },
        examples: [
          { label: '30% rent check', inputs: { monthlyIncome: '5200', targetRentPercent: '30', monthlyDebts: '350', monthlyUtilities: '180' } },
          { label: 'Lower income', inputs: { monthlyIncome: '3600', targetRentPercent: '30', monthlyDebts: '150', monthlyUtilities: '160' } },
          { label: 'Conservative target', inputs: { monthlyIncome: '6200', targetRentPercent: '25', monthlyDebts: '500', monthlyUtilities: '220' } },
        ],
      },
    ],
  },
  annuity: {
    title: 'Annuity Calculator',
    buttonLabel: 'Calculate annuity',
    emptyHistory: 'Recent annuity estimates will appear here.',
    privacyNote: 'Annuity estimates use a simplified fixed-rate formula and do not include insurer terms, fees, taxes, guarantees, or surrender charges.',
    modes: [
      {
        id: 'annuity',
        label: 'Annuity',
        symbol: 'ANN',
        fields: [
          numberField('payment', 'Payment amount ($)'),
          numberField('annualRatePercent', 'Annual rate (%)'),
          numberField('years', 'Time (years)'),
          numberField('paymentsPerYear', 'Payments per year'),
          selectField('timing', 'Payment timing', [
            { label: 'End of period', value: 'ordinary' },
            { label: 'Beginning of period', value: 'due' },
          ]),
        ],
        defaultInputs: { payment: '500', annualRatePercent: '5', years: '20', paymentsPerYear: '12', timing: 'ordinary' },
        examples: [
          { label: '$500/month', inputs: { payment: '500', annualRatePercent: '5', years: '20', paymentsPerYear: '12', timing: 'ordinary' } },
          { label: 'Annual payments', inputs: { payment: '6000', annualRatePercent: '4.5', years: '15', paymentsPerYear: '1', timing: 'ordinary' } },
          { label: 'Payments upfront', inputs: { payment: '400', annualRatePercent: '5.5', years: '10', paymentsPerYear: '12', timing: 'due' } },
        ],
      },
    ],
  },
  'credit-card': {
    title: 'Credit Card Calculator',
    buttonLabel: 'Estimate payoff',
    emptyHistory: 'Recent credit card payoff estimates will appear here.',
    privacyNote: 'Credit card estimates do not include fees, variable APR changes, minimum-payment rules, promotional rates, or issuer terms.',
    modes: [
      {
        id: 'credit-card',
        label: 'Payoff',
        symbol: 'CARD',
        fields: [
          numberField('balance', 'Current balance ($)'),
          numberField('annualRatePercent', 'APR (%)'),
          numberField('monthlyPayment', 'Monthly payment ($)'),
          numberField('monthlyNewCharges', 'New charges per month ($)'),
        ],
        defaultInputs: { balance: '4500', annualRatePercent: '22.9', monthlyPayment: '250', monthlyNewCharges: '0' },
        examples: [
          { label: '$4.5k payoff', inputs: { balance: '4500', annualRatePercent: '22.9', monthlyPayment: '250', monthlyNewCharges: '0' } },
          { label: '$100 extra', inputs: { balance: '4500', annualRatePercent: '22.9', monthlyPayment: '350', monthlyNewCharges: '0' } },
          { label: 'With new charges', inputs: { balance: '3000', annualRatePercent: '19.9', monthlyPayment: '250', monthlyNewCharges: '50' } },
        ],
      },
    ],
  },
  pension: {
    title: 'Pension Calculator',
    buttonLabel: 'Estimate pension',
    emptyHistory: 'Recent pension estimates will appear here.',
    privacyNote: 'Pension estimates use a simple defined-benefit formula and do not include vesting, plan rules, survivor options, COLA, or taxes.',
    modes: [
      {
        id: 'pension',
        label: 'Pension',
        symbol: 'PEN',
        fields: [
          numberField('finalAverageSalary', 'Final average salary ($)'),
          numberField('yearsOfService', 'Years of service'),
          numberField('multiplierPercent', 'Benefit multiplier (%)'),
        ],
        defaultInputs: { finalAverageSalary: '80000', yearsOfService: '25', multiplierPercent: '1.5' },
        examples: [
          { label: 'Public plan style', inputs: { finalAverageSalary: '80000', yearsOfService: '25', multiplierPercent: '1.5' } },
          { label: 'Long service', inputs: { finalAverageSalary: '95000', yearsOfService: '32', multiplierPercent: '1.7' } },
          { label: 'Shorter service', inputs: { finalAverageSalary: '65000', yearsOfService: '15', multiplierPercent: '1.25' } },
        ],
      },
    ],
  },
  'annuity-payout': {
    title: 'Annuity Payout Calculator',
    buttonLabel: 'Estimate payout',
    emptyHistory: 'Recent annuity payout estimates will appear here.',
    privacyNote: 'This payout estimate is a simplified fixed-rate drawdown and is not an annuity contract, insurance quote, or investment recommendation.',
    modes: [
      {
        id: 'annuity-payout',
        label: 'Payout',
        symbol: 'PAY',
        fields: [
          numberField('principal', 'Starting balance ($)'),
          numberField('annualRatePercent', 'Annual rate (%)'),
          numberField('years', 'Payout time (years)'),
          numberField('paymentsPerYear', 'Payments per year'),
        ],
        defaultInputs: { principal: '100000', annualRatePercent: '5', years: '20', paymentsPerYear: '12' },
        examples: [
          { label: '$100k over 20 years', inputs: { principal: '100000', annualRatePercent: '5', years: '20', paymentsPerYear: '12' } },
          { label: 'Annual payments', inputs: { principal: '75000', annualRatePercent: '4', years: '15', paymentsPerYear: '1' } },
          { label: 'Short payout', inputs: { principal: '50000', annualRatePercent: '3.5', years: '10', paymentsPerYear: '12' } },
        ],
      },
    ],
  },
  'credit-cards-payoff': {
    title: 'Credit Cards Payoff Calculator',
    buttonLabel: 'Estimate card payoff',
    emptyHistory: 'Recent credit card payoff estimates will appear here.',
    privacyNote: 'This combines card balances into one payoff estimate and does not model daily balance methods, fees, or changing minimum payments.',
    modes: [
      {
        id: 'credit-cards-payoff',
        label: 'Cards',
        symbol: 'CARD',
        fields: [
          numberField('balance', 'Combined card balance ($)'),
          numberField('annualRatePercent', 'Weighted APR (%)'),
          numberField('monthlyPayment', 'Monthly payment ($)'),
          numberField('extraMonthlyPayment', 'Extra monthly payment ($)'),
        ],
        defaultInputs: { balance: '8500', annualRatePercent: '21.5', monthlyPayment: '350', extraMonthlyPayment: '100' },
        examples: [
          { label: 'Two-card payoff', inputs: { balance: '8500', annualRatePercent: '21.5', monthlyPayment: '350', extraMonthlyPayment: '100' } },
          { label: 'Minimum plus extra', inputs: { balance: '6000', annualRatePercent: '19.9', monthlyPayment: '220', extraMonthlyPayment: '80' } },
          { label: 'Aggressive payoff', inputs: { balance: '12000', annualRatePercent: '24.9', monthlyPayment: '500', extraMonthlyPayment: '250' } },
        ],
      },
    ],
  },
  'debt-payoff': {
    title: 'Debt Payoff Calculator',
    buttonLabel: 'Estimate payoff',
    emptyHistory: 'Recent debt payoff estimates will appear here.',
    privacyNote: 'Debt payoff estimates are simplified and do not include fees, collections, settlement terms, changing rates, or creditor rules.',
    modes: [
      {
        id: 'debt-payoff',
        label: 'Payoff',
        symbol: 'DEBT',
        fields: [
          numberField('balance', 'Debt balance ($)'),
          numberField('annualRatePercent', 'Annual interest rate (%)'),
          numberField('monthlyPayment', 'Monthly payment ($)'),
          numberField('extraMonthlyPayment', 'Extra monthly payment ($)'),
        ],
        defaultInputs: { balance: '10000', annualRatePercent: '12', monthlyPayment: '300', extraMonthlyPayment: '100' },
        examples: [
          { label: '$10k debt', inputs: { balance: '10000', annualRatePercent: '12', monthlyPayment: '300', extraMonthlyPayment: '100' } },
          { label: 'No extra payment', inputs: { balance: '7500', annualRatePercent: '15', monthlyPayment: '260', extraMonthlyPayment: '0' } },
          { label: 'Fast payoff', inputs: { balance: '5000', annualRatePercent: '18', monthlyPayment: '250', extraMonthlyPayment: '150' } },
        ],
      },
    ],
  },
  'debt-consolidation': {
    title: 'Debt Consolidation Calculator',
    buttonLabel: 'Compare consolidation',
    emptyHistory: 'Recent consolidation comparisons will appear here.',
    privacyNote: 'Debt consolidation estimates compare simple payment math only and do not include approval, balance transfer rules, origination terms, or credit effects.',
    modes: [
      {
        id: 'debt-consolidation',
        label: 'Consolidate',
        symbol: 'CONS',
        fields: [
          numberField('totalDebt', 'Total debt ($)'),
          numberField('currentAnnualRatePercent', 'Current average rate (%)'),
          numberField('currentMonthlyPayment', 'Current monthly payment ($)'),
          numberField('newAnnualRatePercent', 'New loan rate (%)'),
          numberField('newYears', 'New loan term (years)'),
          numberField('fees', 'Fees added ($)'),
        ],
        defaultInputs: { totalDebt: '18000', currentAnnualRatePercent: '18', currentMonthlyPayment: '650', newAnnualRatePercent: '10.5', newYears: '3', fees: '300' },
        examples: [
          { label: 'Lower-rate loan', inputs: { totalDebt: '18000', currentAnnualRatePercent: '18', currentMonthlyPayment: '650', newAnnualRatePercent: '10.5', newYears: '3', fees: '300' } },
          { label: 'No fee option', inputs: { totalDebt: '12000', currentAnnualRatePercent: '16', currentMonthlyPayment: '420', newAnnualRatePercent: '11', newYears: '3', fees: '0' } },
          { label: 'Longer term', inputs: { totalDebt: '25000', currentAnnualRatePercent: '20', currentMonthlyPayment: '750', newAnnualRatePercent: '13', newYears: '5', fees: '500' } },
        ],
      },
    ],
  },
  repayment: {
    title: 'Repayment Calculator',
    buttonLabel: 'Estimate repayment',
    emptyHistory: 'Recent repayment estimates will appear here.',
    privacyNote: 'Repayment estimates use fixed payment math and do not include hardship plans, deferment, fees, changing rates, or provider-specific rules.',
    modes: [
      {
        id: 'repayment',
        label: 'Repayment',
        symbol: 'REPAY',
        fields: [
          numberField('balance', 'Balance ($)'),
          numberField('annualRatePercent', 'Annual interest rate (%)'),
          numberField('monthlyPayment', 'Monthly payment ($)'),
          numberField('extraMonthlyPayment', 'Extra monthly payment ($)'),
        ],
        defaultInputs: { balance: '12000', annualRatePercent: '8', monthlyPayment: '300', extraMonthlyPayment: '50' },
        examples: [
          { label: 'General balance', inputs: { balance: '12000', annualRatePercent: '8', monthlyPayment: '300', extraMonthlyPayment: '50' } },
          { label: 'Small payoff', inputs: { balance: '3500', annualRatePercent: '14', monthlyPayment: '150', extraMonthlyPayment: '25' } },
          { label: 'No extra payment', inputs: { balance: '9000', annualRatePercent: '9.5', monthlyPayment: '250', extraMonthlyPayment: '0' } },
        ],
      },
    ],
  },
  'student-loan': {
    title: 'Student Loan Calculator',
    buttonLabel: 'Estimate student loan',
    emptyHistory: 'Recent student loan estimates will appear here.',
    privacyNote: 'Student loan estimates are not official federal loan repayment plan results and do not include income-driven repayment, forgiveness, deferment, or subsidies.',
    modes: [
      {
        id: 'student-loan',
        label: 'Student loan',
        symbol: 'STU',
        fields: [
          numberField('principal', 'Loan balance ($)'),
          numberField('annualRatePercent', 'Interest rate (%)'),
          numberField('years', 'Repayment term (years)'),
          numberField('extraMonthlyPayment', 'Extra monthly payment ($)'),
        ],
        defaultInputs: { principal: '30000', annualRatePercent: '6.5', years: '10', extraMonthlyPayment: '50' },
        examples: [
          { label: '10-year plan', inputs: { principal: '30000', annualRatePercent: '6.5', years: '10', extraMonthlyPayment: '50' } },
          { label: 'No extra payment', inputs: { principal: '25000', annualRatePercent: '5.5', years: '10', extraMonthlyPayment: '0' } },
          { label: 'Aggressive payment', inputs: { principal: '45000', annualRatePercent: '7', years: '10', extraMonthlyPayment: '200' } },
        ],
      },
    ],
  },
  'college-cost': {
    title: 'College Cost Calculator',
    buttonLabel: 'Estimate college cost',
    emptyHistory: 'Recent college cost estimates will appear here.',
    privacyNote: 'College estimates do not include financial aid, scholarships, tuition guarantees, taxes, or school-specific billing rules.',
    modes: [
      {
        id: 'college-cost',
        label: 'College cost',
        symbol: 'COL',
        fields: [
          numberField('currentAnnualCost', 'Current annual cost ($)'),
          numberField('yearsUntilStart', 'Years until start'),
          numberField('yearsInSchool', 'Years in school'),
          numberField('annualCostIncreasePercent', 'Annual cost increase (%)'),
          numberField('currentSavings', 'Current savings ($)'),
          numberField('monthlySavings', 'Monthly savings ($)'),
          numberField('annualSavingsReturnPercent', 'Savings return (%)'),
        ],
        defaultInputs: { currentAnnualCost: '28000', yearsUntilStart: '8', yearsInSchool: '4', annualCostIncreasePercent: '4', currentSavings: '10000', monthlySavings: '250', annualSavingsReturnPercent: '5' },
        examples: [
          { label: 'Four-year plan', inputs: { currentAnnualCost: '28000', yearsUntilStart: '8', yearsInSchool: '4', annualCostIncreasePercent: '4', currentSavings: '10000', monthlySavings: '250', annualSavingsReturnPercent: '5' } },
          { label: 'Sooner start', inputs: { currentAnnualCost: '22000', yearsUntilStart: '3', yearsInSchool: '4', annualCostIncreasePercent: '3.5', currentSavings: '5000', monthlySavings: '300', annualSavingsReturnPercent: '4' } },
          { label: 'Two-year program', inputs: { currentAnnualCost: '12000', yearsUntilStart: '5', yearsInSchool: '2', annualCostIncreasePercent: '3', currentSavings: '2500', monthlySavings: '150', annualSavingsReturnPercent: '4.5' } },
        ],
      },
    ],
  },
  'simple-interest': {
    title: 'Simple Interest Calculator',
    buttonLabel: 'Calculate simple interest',
    emptyHistory: 'Recent simple interest estimates will appear here.',
    privacyNote: 'Simple interest estimates do not include compounding, fees, taxes, payment schedules, or changing rates.',
    modes: [
      {
        id: 'simple-interest',
        label: 'Simple',
        symbol: 'SI',
        fields: [
          numberField('principal', 'Principal ($)'),
          numberField('annualRatePercent', 'Annual rate (%)'),
          numberField('years', 'Time (years)'),
        ],
        defaultInputs: { principal: '1000', annualRatePercent: '5', years: '3' },
        examples: [
          { label: '$1k at 5%', inputs: { principal: '1000', annualRatePercent: '5', years: '3' } },
          { label: '$10k for 18 months', inputs: { principal: '10000', annualRatePercent: '4.5', years: '1.5' } },
          { label: 'Zero interest', inputs: { principal: '2500', annualRatePercent: '0', years: '2' } },
        ],
      },
    ],
  },
  cd: {
    title: 'CD Calculator',
    buttonLabel: 'Estimate CD',
    emptyHistory: 'Recent CD estimates will appear here.',
    privacyNote: 'CD estimates use APY math and a manual penalty estimate. Check your bank disclosures for exact maturity, renewal, and early withdrawal terms.',
    modes: [
      {
        id: 'cd',
        label: 'CD',
        symbol: 'CD',
        fields: [
          numberField('principal', 'Deposit amount ($)'),
          numberField('annualPercentageYield', 'APY (%)'),
          numberField('termMonths', 'Term (months)'),
          numberField('earlyWithdrawalPenaltyMonths', 'Penalty months of interest'),
        ],
        defaultInputs: { principal: '10000', annualPercentageYield: '4.25', termMonths: '12', earlyWithdrawalPenaltyMonths: '3' },
        examples: [
          { label: 'One-year CD', inputs: { principal: '10000', annualPercentageYield: '4.25', termMonths: '12', earlyWithdrawalPenaltyMonths: '3' } },
          { label: 'Six-month CD', inputs: { principal: '5000', annualPercentageYield: '3.9', termMonths: '6', earlyWithdrawalPenaltyMonths: '1' } },
          { label: 'Five-year CD', inputs: { principal: '25000', annualPercentageYield: '4.1', termMonths: '60', earlyWithdrawalPenaltyMonths: '6' } },
        ],
      },
    ],
  },
  bond: {
    title: 'Bond Calculator',
    buttonLabel: 'Estimate bond',
    emptyHistory: 'Recent bond estimates will appear here.',
    privacyNote: 'Bond estimates use simple current yield and approximate yield-to-maturity formulas, not a full pricing model or investment advice.',
    modes: [
      {
        id: 'bond',
        label: 'Bond',
        symbol: 'BOND',
        fields: [
          numberField('faceValue', 'Face value ($)'),
          numberField('marketPrice', 'Market price ($)'),
          numberField('couponRatePercent', 'Coupon rate (%)'),
          numberField('yearsToMaturity', 'Years to maturity'),
          numberField('paymentsPerYear', 'Coupon payments per year'),
        ],
        defaultInputs: { faceValue: '1000', marketPrice: '950', couponRatePercent: '5', yearsToMaturity: '10', paymentsPerYear: '2' },
        examples: [
          { label: 'Discount bond', inputs: { faceValue: '1000', marketPrice: '950', couponRatePercent: '5', yearsToMaturity: '10', paymentsPerYear: '2' } },
          { label: 'Premium bond', inputs: { faceValue: '1000', marketPrice: '1050', couponRatePercent: '6', yearsToMaturity: '8', paymentsPerYear: '2' } },
          { label: 'Annual coupon', inputs: { faceValue: '5000', marketPrice: '4800', couponRatePercent: '4.5', yearsToMaturity: '5', paymentsPerYear: '1' } },
        ],
      },
    ],
  },
  'mutual-fund': {
    title: 'Mutual Fund Calculator',
    buttonLabel: 'Project fund balance',
    emptyHistory: 'Recent mutual fund projections will appear here.',
    privacyNote: 'Mutual fund projections are hypothetical and do not include taxes, changing returns, transaction fees, loads, or fund-specific risks.',
    modes: [
      {
        id: 'mutual-fund',
        label: 'Mutual fund',
        symbol: 'FUND',
        fields: [
          numberField('principal', 'Initial investment ($)'),
          numberField('monthlyContribution', 'Monthly contribution ($)'),
          numberField('annualReturnPercent', 'Estimated annual return (%)'),
          numberField('expenseRatioPercent', 'Expense ratio (%)'),
          numberField('years', 'Time (years)'),
        ],
        defaultInputs: { principal: '5000', monthlyContribution: '250', annualReturnPercent: '7', expenseRatioPercent: '0.5', years: '20' },
        examples: [
          { label: 'Index-style fund', inputs: { principal: '5000', monthlyContribution: '250', annualReturnPercent: '7', expenseRatioPercent: '0.5', years: '20' } },
          { label: 'Higher fee', inputs: { principal: '10000', monthlyContribution: '300', annualReturnPercent: '7', expenseRatioPercent: '1.2', years: '15' } },
          { label: 'Small start', inputs: { principal: '1000', monthlyContribution: '100', annualReturnPercent: '6', expenseRatioPercent: '0.3', years: '10' } },
        ],
      },
    ],
  },
  'roth-ira': {
    title: 'Roth IRA Calculator',
    buttonLabel: 'Project Roth IRA',
    emptyHistory: 'Recent Roth IRA projections will appear here.',
    privacyNote: 'Roth IRA estimates do not check contribution eligibility, income phaseouts, tax treatment, penalties, fees, or IRS limit compliance.',
    modes: [
      {
        id: 'roth-ira',
        label: 'Roth IRA',
        symbol: 'ROTH',
        fields: [
          numberField('currentBalance', 'Current balance ($)'),
          numberField('annualContribution', 'Annual contribution ($)'),
          numberField('annualReturnPercent', 'Estimated annual return (%)'),
          numberField('years', 'Years to grow'),
        ],
        defaultInputs: { currentBalance: '12000', annualContribution: '7000', annualReturnPercent: '7', years: '25' },
        examples: [
          { label: 'Annual max-style saving', inputs: { currentBalance: '12000', annualContribution: '7000', annualReturnPercent: '7', years: '25' } },
          { label: 'Starting from zero', inputs: { currentBalance: '0', annualContribution: '4000', annualReturnPercent: '6.5', years: '30' } },
          { label: 'Near retirement', inputs: { currentBalance: '85000', annualContribution: '8000', annualReturnPercent: '5', years: '10' } },
        ],
      },
    ],
  },
  ira: {
    title: 'IRA Calculator',
    buttonLabel: 'Project IRA',
    emptyHistory: 'Recent IRA projections will appear here.',
    privacyNote: 'IRA estimates do not handle deductions, Roth eligibility, tax rules, required distributions, penalties, fees, or contribution-limit compliance.',
    modes: [
      {
        id: 'ira',
        label: 'IRA',
        symbol: 'IRA',
        fields: [
          numberField('currentBalance', 'Current balance ($)'),
          numberField('annualContribution', 'Annual contribution ($)'),
          numberField('annualReturnPercent', 'Estimated annual return (%)'),
          numberField('years', 'Years to grow'),
        ],
        defaultInputs: { currentBalance: '25000', annualContribution: '7000', annualReturnPercent: '6.5', years: '20' },
        examples: [
          { label: 'Traditional IRA projection', inputs: { currentBalance: '25000', annualContribution: '7000', annualReturnPercent: '6.5', years: '20' } },
          { label: 'Catch-up style saving', inputs: { currentBalance: '60000', annualContribution: '8000', annualReturnPercent: '6', years: '12' } },
          { label: 'Small annual contribution', inputs: { currentBalance: '5000', annualContribution: '3000', annualReturnPercent: '7', years: '30' } },
        ],
      },
    ],
  },
  vat: {
    title: 'VAT Calculator',
    buttonLabel: 'Calculate VAT',
    emptyHistory: 'Recent VAT calculations will appear here.',
    privacyNote: 'VAT estimates use the manual rate you enter and do not check country-specific exemptions, invoices, or tax rules.',
    modes: [
      {
        id: 'vat',
        label: 'VAT',
        symbol: 'VAT',
        fields: [
          numberField('amount', 'Amount'),
          numberField('vatPercent', 'VAT rate (%)'),
          selectField('mode', 'Mode', vatModeOptions),
        ],
        defaultInputs: { amount: '100', vatPercent: '20', mode: 'add' },
        examples: [
          { label: 'Add 20% VAT', inputs: { amount: '100', vatPercent: '20', mode: 'add' } },
          { label: 'Remove 20% VAT', inputs: { amount: '120', vatPercent: '20', mode: 'remove' } },
          { label: 'Lower rate', inputs: { amount: '80', vatPercent: '10', mode: 'add' } },
        ],
      },
    ],
  },
  'cash-back-low-interest': {
    title: 'Cash Back or Low Interest Calculator',
    buttonLabel: 'Compare offers',
    emptyHistory: 'Recent offer comparisons will appear here.',
    privacyNote: 'Offer comparisons are simple payment estimates and do not include dealer restrictions, taxes, fees, rebates you do not qualify for, or credit approval.',
    modes: [
      {
        id: 'cash-back-low-interest',
        label: 'Offer comparison',
        symbol: 'OFFER',
        fields: [
          numberField('purchaseAmount', 'Purchase amount ($)'),
          numberField('payoffMonths', 'Payoff term (months)'),
          numberField('cashBackPercent', 'Cash back (%)'),
          numberField('cashBackAprPercent', 'APR with cash back (%)'),
          numberField('lowInterestAprPercent', 'Low-interest APR (%)'),
        ],
        defaultInputs: { purchaseAmount: '32000', payoffMonths: '60', cashBackPercent: '4', cashBackAprPercent: '7.2', lowInterestAprPercent: '3.9' },
        examples: [
          { label: 'Dealer incentive', inputs: { purchaseAmount: '32000', payoffMonths: '60', cashBackPercent: '4', cashBackAprPercent: '7.2', lowInterestAprPercent: '3.9' } },
          { label: 'Big rebate', inputs: { purchaseAmount: '28000', payoffMonths: '48', cashBackPercent: '6', cashBackAprPercent: '8', lowInterestAprPercent: '4.5' } },
          { label: 'Short payoff', inputs: { purchaseAmount: '18000', payoffMonths: '36', cashBackPercent: '3', cashBackAprPercent: '6.5', lowInterestAprPercent: '2.9' } },
        ],
      },
    ],
  },
  'auto-lease': {
    title: 'Auto Lease Calculator',
    buttonLabel: 'Estimate lease',
    emptyHistory: 'Recent auto lease estimates will appear here.',
    privacyNote: 'Auto lease estimates are simplified and do not include mileage fees, wear charges, acquisition fees beyond the entered fee field, registration, or lease-end terms.',
    modes: [
      {
        id: 'auto-lease',
        label: 'Auto lease',
        symbol: 'LEASE',
        fields: [
          numberField('vehiclePrice', 'Vehicle price ($)'),
          numberField('downPayment', 'Down payment ($)'),
          numberField('tradeIn', 'Trade-in value ($)'),
          numberField('residualValue', 'Residual value ($)'),
          numberField('moneyFactor', 'Money factor'),
          numberField('termMonths', 'Lease term (months)'),
          numberField('taxPercent', 'Tax rate (%)'),
          numberField('fees', 'Fees ($)'),
        ],
        defaultInputs: { vehiclePrice: '36000', downPayment: '2500', tradeIn: '0', residualValue: '21000', moneyFactor: '0.0025', termMonths: '36', taxPercent: '6', fees: '950' },
        examples: [
          { label: '36-month lease', inputs: { vehiclePrice: '36000', downPayment: '2500', tradeIn: '0', residualValue: '21000', moneyFactor: '0.0025', termMonths: '36', taxPercent: '6', fees: '950' } },
          { label: 'Higher residual', inputs: { vehiclePrice: '42000', downPayment: '3000', tradeIn: '1500', residualValue: '28000', moneyFactor: '0.0022', termMonths: '36', taxPercent: '7', fees: '1200' } },
          { label: '48-month lease', inputs: { vehiclePrice: '30000', downPayment: '1500', tradeIn: '0', residualValue: '16000', moneyFactor: '0.0028', termMonths: '48', taxPercent: '6.5', fees: '900' } },
        ],
      },
    ],
  },
  depreciation: {
    title: 'Depreciation Calculator',
    buttonLabel: 'Estimate depreciation',
    emptyHistory: 'Recent depreciation estimates will appear here.',
    privacyNote: 'Depreciation estimates are simplified book-value math and do not determine tax depreciation, accounting policy, or IRS compliance.',
    modes: [
      {
        id: 'depreciation',
        label: 'Depreciation',
        symbol: 'DEPR',
        fields: [
          numberField('cost', 'Original cost ($)'),
          numberField('salvageValue', 'Salvage value ($)'),
          numberField('lifeYears', 'Useful life (years)'),
          numberField('ageYears', 'Age (years)'),
          selectField('method', 'Method', depreciationMethodOptions),
          numberField('decliningRatePercent', 'Declining balance rate (%)'),
        ],
        defaultInputs: { cost: '12000', salvageValue: '2000', lifeYears: '5', ageYears: '2', method: 'straight-line', decliningRatePercent: '20' },
        examples: [
          { label: 'Straight-line asset', inputs: { cost: '12000', salvageValue: '2000', lifeYears: '5', ageYears: '2', method: 'straight-line', decliningRatePercent: '20' } },
          { label: 'Declining balance', inputs: { cost: '25000', salvageValue: '5000', lifeYears: '8', ageYears: '3', method: 'declining-balance', decliningRatePercent: '25' } },
          { label: 'One-year check', inputs: { cost: '6000', salvageValue: '1000', lifeYears: '5', ageYears: '1', method: 'straight-line', decliningRatePercent: '20' } },
        ],
      },
    ],
  },
  'average-return': {
    title: 'Average Return Calculator',
    buttonLabel: 'Calculate return',
    emptyHistory: 'Recent return estimates will appear here.',
    privacyNote: 'Average return estimates are simple performance math and do not include taxes, risk, fees, time-weighted returns, or investment advice.',
    modes: [
      {
        id: 'average-return',
        label: 'Average return',
        symbol: 'AVG',
        fields: [
          numberField('beginningValue', 'Beginning value ($)'),
          numberField('endingValue', 'Ending value ($)'),
          numberField('years', 'Time (years)'),
          numberField('contributions', 'Additional contributions ($)'),
          numberField('withdrawals', 'Withdrawals ($)'),
        ],
        defaultInputs: { beginningValue: '10000', endingValue: '16000', years: '5', contributions: '2000', withdrawals: '0' },
        examples: [
          { label: 'Five-year return', inputs: { beginningValue: '10000', endingValue: '16000', years: '5', contributions: '2000', withdrawals: '0' } },
          { label: 'With withdrawals', inputs: { beginningValue: '25000', endingValue: '31000', years: '4', contributions: '3000', withdrawals: '1500' } },
          { label: 'No contributions', inputs: { beginningValue: '8000', endingValue: '12000', years: '3', contributions: '0', withdrawals: '0' } },
        ],
      },
    ],
  },
  margin: {
    title: 'Margin Calculator',
    buttonLabel: 'Calculate margin',
    emptyHistory: 'Recent margin estimates will appear here.',
    privacyNote: 'Margin estimates are business profit math only and do not evaluate brokerage margin accounts, borrowed-money risk, taxes, or accounting rules.',
    modes: [
      {
        id: 'margin',
        label: 'Profit margin',
        symbol: 'MARG',
        fields: [
          numberField('revenue', 'Revenue or selling price ($)'),
          numberField('cost', 'Cost ($)'),
        ],
        defaultInputs: { revenue: '100', cost: '60' },
        examples: [
          { label: 'Retail item', inputs: { revenue: '100', cost: '60' } },
          { label: 'Service job', inputs: { revenue: '2500', cost: '1400' } },
          { label: 'Low margin', inputs: { revenue: '1200', cost: '1050' } },
        ],
      },
    ],
  },
  'ad-revenue': {
    title: 'Ad Revenue Calculator',
    buttonLabel: 'Estimate ad revenue',
    emptyHistory: 'Recent ad revenue estimates will appear here.',
    privacyNote: 'Ad revenue estimates are educational planning math. They are not affiliated with Google AdSense and do not predict approved earnings, invalid traffic adjustments, fill rate, ad placement rules, seasonality, or advertiser demand.',
    modes: [
      {
        id: 'ad-revenue',
        label: 'CTR and CPC',
        symbol: 'AD',
        fields: [
          numberField('dailyPageViews', 'Daily page views'),
          numberField('pageCtrPercent', 'Page CTR (%)'),
          numberField('averageCpc', 'Average CPC ($)'),
        ],
        defaultInputs: { dailyPageViews: '1000', pageCtrPercent: '1.5', averageCpc: '0.35' },
        examples: [
          { label: 'Starter blog', inputs: { dailyPageViews: '1000', pageCtrPercent: '1.5', averageCpc: '0.35' } },
          { label: 'Growing utility page', inputs: { dailyPageViews: '5000', pageCtrPercent: '1.2', averageCpc: '0.42' } },
          { label: 'Low click scenario', inputs: { dailyPageViews: '2500', pageCtrPercent: '0.6', averageCpc: '0.25' } },
        ],
      },
    ],
  },
  'break-even': {
    title: 'Break Even Calculator',
    buttonLabel: 'Calculate break-even',
    emptyHistory: 'Recent break-even estimates will appear here.',
    privacyNote: 'Break-even estimates use the simple cost and price values you enter and do not include taxes, refunds, financing, inventory shrinkage, or accounting advice.',
    modes: [
      {
        id: 'break-even',
        label: 'Break-even',
        symbol: 'BE',
        fields: [
          numberField('fixedCosts', 'Fixed costs ($)'),
          numberField('pricePerUnit', 'Price per unit ($)'),
          numberField('variableCostPerUnit', 'Variable cost per unit ($)'),
        ],
        defaultInputs: { fixedCosts: '5000', pricePerUnit: '40', variableCostPerUnit: '18' },
        examples: [
          { label: 'Product launch', inputs: { fixedCosts: '5000', pricePerUnit: '40', variableCostPerUnit: '18' } },
          { label: 'Online course', inputs: { fixedCosts: '2500', pricePerUnit: '99', variableCostPerUnit: '8' } },
          { label: 'Food stall', inputs: { fixedCosts: '1200', pricePerUnit: '12', variableCostPerUnit: '4.25' } },
        ],
      },
    ],
  },
  markup: {
    title: 'Markup Calculator',
    buttonLabel: 'Calculate markup price',
    emptyHistory: 'Recent markup price estimates will appear here.',
    privacyNote: 'Markup estimates are simple pricing math and do not include discounts, taxes, payment fees, inventory loss, or accounting rules.',
    modes: [
      {
        id: 'markup',
        label: 'Markup',
        symbol: 'MKUP',
        fields: [
          numberField('unitCost', 'Unit cost ($)'),
          numberField('markupPercent', 'Markup (%)'),
          numberField('units', 'Units'),
        ],
        defaultInputs: { unitCost: '30', markupPercent: '50', units: '100' },
        examples: [
          { label: 'Retail item', inputs: { unitCost: '30', markupPercent: '50', units: '100' } },
          { label: 'Handmade product', inputs: { unitCost: '12.50', markupPercent: '80', units: '25' } },
          { label: 'Wholesale batch', inputs: { unitCost: '7.25', markupPercent: '35', units: '500' } },
        ],
      },
    ],
  },
  'profit-goal': {
    title: 'Profit Goal Calculator',
    buttonLabel: 'Calculate sales goal',
    emptyHistory: 'Recent profit goal estimates will appear here.',
    privacyNote: 'Profit-goal estimates use simple contribution margin math and do not include taxes, capacity limits, refunds, financing costs, or accounting advice.',
    modes: [
      {
        id: 'profit-goal',
        label: 'Goal',
        symbol: 'GOAL',
        fields: [
          numberField('fixedCosts', 'Fixed costs ($)'),
          numberField('targetProfit', 'Target profit ($)'),
          numberField('pricePerUnit', 'Price per unit ($)'),
          numberField('variableCostPerUnit', 'Variable cost per unit ($)'),
        ],
        defaultInputs: { fixedCosts: '5000', targetProfit: '2000', pricePerUnit: '40', variableCostPerUnit: '18' },
        examples: [
          { label: '$2k profit target', inputs: { fixedCosts: '5000', targetProfit: '2000', pricePerUnit: '40', variableCostPerUnit: '18' } },
          { label: 'Event table', inputs: { fixedCosts: '900', targetProfit: '750', pricePerUnit: '15', variableCostPerUnit: '5.5' } },
          { label: 'Service package', inputs: { fixedCosts: '3200', targetProfit: '4500', pricePerUnit: '250', variableCostPerUnit: '60' } },
        ],
      },
    ],
  },
  'liquidity-ratios': {
    title: 'Liquidity Ratios Calculator',
    buttonLabel: 'Calculate liquidity',
    emptyHistory: 'Recent liquidity ratio checks will appear here.',
    privacyNote: 'Liquidity ratios are educational accounting math. They do not judge creditworthiness, audit a business, or replace financial statement analysis.',
    modes: [
      {
        id: 'liquidity-ratios',
        label: 'Liquidity',
        symbol: 'LIQ',
        fields: [
          numberField('currentAssets', 'Current assets ($)'),
          numberField('currentLiabilities', 'Current liabilities ($)'),
          numberField('inventory', 'Inventory ($)'),
          numberField('prepaidExpenses', 'Prepaid expenses ($)'),
          numberField('cashAndEquivalents', 'Cash and equivalents ($)'),
          numberField('marketableSecurities', 'Marketable securities ($)'),
          numberField('accountsReceivable', 'Accounts receivable ($)'),
        ],
        defaultInputs: {
          currentAssets: '120000',
          currentLiabilities: '80000',
          inventory: '25000',
          prepaidExpenses: '5000',
          cashAndEquivalents: '30000',
          marketableSecurities: '10000',
          accountsReceivable: '35000',
        },
        examples: [
          { label: 'Small business balance sheet', inputs: { currentAssets: '120000', currentLiabilities: '80000', inventory: '25000', prepaidExpenses: '5000', cashAndEquivalents: '30000', marketableSecurities: '10000', accountsReceivable: '35000' } },
          { label: 'Inventory-heavy shop', inputs: { currentAssets: '200000', currentLiabilities: '125000', inventory: '90000', prepaidExpenses: '8000', cashAndEquivalents: '22000', marketableSecurities: '0', accountsReceivable: '45000' } },
          { label: 'Cash-rich service firm', inputs: { currentAssets: '95000', currentLiabilities: '40000', inventory: '0', prepaidExpenses: '3000', cashAndEquivalents: '55000', marketableSecurities: '15000', accountsReceivable: '18000' } },
        ],
      },
    ],
  },
  'debt-ratios': {
    title: 'Debt Ratios Calculator',
    buttonLabel: 'Calculate debt ratios',
    emptyHistory: 'Recent debt ratio checks will appear here.',
    privacyNote: 'Debt ratios are simplified statement math and do not decide loan approval, solvency, credit risk, tax treatment, or investing quality.',
    modes: [
      {
        id: 'debt-ratios',
        label: 'Debt ratios',
        symbol: 'DEBT',
        fields: [
          numberField('totalDebt', 'Total debt ($)'),
          numberField('totalAssets', 'Total assets ($)'),
          numberField('totalEquity', 'Total equity ($)'),
          numberField('ebit', 'EBIT ($)'),
          numberField('interestExpense', 'Interest expense ($)'),
        ],
        defaultInputs: { totalDebt: '220000', totalAssets: '500000', totalEquity: '280000', ebit: '90000', interestExpense: '15000' },
        examples: [
          { label: 'Balanced company', inputs: { totalDebt: '220000', totalAssets: '500000', totalEquity: '280000', ebit: '90000', interestExpense: '15000' } },
          { label: 'High debt load', inputs: { totalDebt: '480000', totalAssets: '750000', totalEquity: '270000', ebit: '105000', interestExpense: '42000' } },
          { label: 'Low debt exposure', inputs: { totalDebt: '60000', totalAssets: '350000', totalEquity: '290000', ebit: '65000', interestExpense: '5000' } },
        ],
      },
    ],
  },
  'operations-ratios': {
    title: 'Operations Ratios Calculator',
    buttonLabel: 'Calculate operations ratios',
    emptyHistory: 'Recent operations ratio checks will appear here.',
    privacyNote: 'Operations ratios use simplified accounting inputs and do not evaluate accounting quality, inventory method, credit policy, seasonality, or business risk.',
    modes: [
      {
        id: 'operations-ratios',
        label: 'Operations',
        symbol: 'OPS',
        fields: [
          numberField('costOfGoodsSold', 'Cost of goods sold ($)'),
          numberField('beginningInventory', 'Beginning inventory ($)'),
          numberField('endingInventory', 'Ending inventory ($)'),
          numberField('netSales', 'Net sales ($)'),
          numberField('averageTotalAssets', 'Average total assets ($)'),
          numberField('netCreditSales', 'Net credit sales ($)'),
          numberField('averageAccountsReceivable', 'Average accounts receivable ($)'),
          numberField('totalAssets', 'Total assets ($)'),
          numberField('totalEquity', 'Total equity ($)'),
        ],
        defaultInputs: {
          costOfGoodsSold: '600000',
          beginningInventory: '90000',
          endingInventory: '110000',
          netSales: '950000',
          averageTotalAssets: '500000',
          netCreditSales: '700000',
          averageAccountsReceivable: '80000',
          totalAssets: '520000',
          totalEquity: '260000',
        },
        examples: [
          { label: 'Retail operations', inputs: { costOfGoodsSold: '600000', beginningInventory: '90000', endingInventory: '110000', netSales: '950000', averageTotalAssets: '500000', netCreditSales: '700000', averageAccountsReceivable: '80000', totalAssets: '520000', totalEquity: '260000' } },
          { label: 'Faster receivables', inputs: { costOfGoodsSold: '420000', beginningInventory: '65000', endingInventory: '70000', netSales: '720000', averageTotalAssets: '390000', netCreditSales: '500000', averageAccountsReceivable: '45000', totalAssets: '410000', totalEquity: '240000' } },
          { label: 'Inventory-heavy year', inputs: { costOfGoodsSold: '800000', beginningInventory: '180000', endingInventory: '230000', netSales: '1100000', averageTotalAssets: '700000', netCreditSales: '640000', averageAccountsReceivable: '95000', totalAssets: '730000', totalEquity: '310000' } },
        ],
      },
    ],
  },
  'profitability-ratios': {
    title: 'Profitability Ratios Calculator',
    buttonLabel: 'Calculate profitability',
    emptyHistory: 'Recent profitability ratio checks will appear here.',
    privacyNote: 'Profitability ratios are educational statement math and do not decide business value, tax treatment, loan approval, or investment quality.',
    modes: [
      {
        id: 'profitability-ratios',
        label: 'Profitability',
        symbol: 'PROF',
        fields: [
          numberField('netSales', 'Net sales ($)'),
          numberField('costOfGoodsSold', 'Cost of goods sold ($)'),
          numberField('operatingIncome', 'Operating income ($)'),
          numberField('netIncome', 'Net income ($)'),
          numberField('averageAssets', 'Average assets ($)'),
          numberField('averageEquity', 'Average equity ($)'),
          numberField('sharesOutstanding', 'Shares outstanding'),
          numberField('pricePerShare', 'Price per share ($)'),
        ],
        defaultInputs: { netSales: '950000', costOfGoodsSold: '600000', operatingIncome: '180000', netIncome: '120000', averageAssets: '500000', averageEquity: '260000', sharesOutstanding: '100000', pricePerShare: '18' },
        examples: [
          { label: 'Profitable company', inputs: { netSales: '950000', costOfGoodsSold: '600000', operatingIncome: '180000', netIncome: '120000', averageAssets: '500000', averageEquity: '260000', sharesOutstanding: '100000', pricePerShare: '18' } },
          { label: 'Thin margins', inputs: { netSales: '700000', costOfGoodsSold: '520000', operatingIncome: '65000', netIncome: '38000', averageAssets: '450000', averageEquity: '180000', sharesOutstanding: '80000', pricePerShare: '9.5' } },
          { label: 'Service firm', inputs: { netSales: '480000', costOfGoodsSold: '120000', operatingIncome: '140000', netIncome: '95000', averageAssets: '220000', averageEquity: '160000', sharesOutstanding: '50000', pricePerShare: '24' } },
        ],
      },
    ],
  },
  'stock-ratios': {
    title: 'Stock Ratios Calculator',
    buttonLabel: 'Calculate stock ratios',
    emptyHistory: 'Recent stock ratio checks will appear here.',
    privacyNote: 'Stock ratios are educational valuation math and do not include risk, growth quality, market timing, taxes, fees, or investment advice.',
    modes: [
      {
        id: 'stock-ratios',
        label: 'Stock ratios',
        symbol: 'STK',
        fields: [
          numberField('stockPrice', 'Stock price ($)'),
          numberField('earningsPerShare', 'Earnings per share ($)'),
          numberField('salesPerShare', 'Sales per share ($)'),
          numberField('bookValuePerShare', 'Book value per share ($)'),
          numberField('dividendPerShare', 'Dividend per share ($)'),
        ],
        defaultInputs: { stockPrice: '18', earningsPerShare: '1.2', salesPerShare: '9.5', bookValuePerShare: '2.6', dividendPerShare: '0.45' },
        examples: [
          { label: 'Dividend stock', inputs: { stockPrice: '18', earningsPerShare: '1.2', salesPerShare: '9.5', bookValuePerShare: '2.6', dividendPerShare: '0.45' } },
          { label: 'Growth stock', inputs: { stockPrice: '75', earningsPerShare: '2.5', salesPerShare: '18', bookValuePerShare: '8', dividendPerShare: '0' } },
          { label: 'Value check', inputs: { stockPrice: '32', earningsPerShare: '4', salesPerShare: '45', bookValuePerShare: '21', dividendPerShare: '1.2' } },
        ],
      },
    ],
  },
  discount: {
    title: 'Discount Calculator',
    buttonLabel: 'Calculate discount',
    emptyHistory: 'Recent discount estimates will appear here.',
    privacyNote: 'Discount estimates use the prices and rates you enter and do not check store policy, coupon restrictions, shipping, or local tax rules.',
    modes: [
      {
        id: 'discount',
        label: 'Discount',
        symbol: 'OFF',
        fields: [
          numberField('originalPrice', 'Original price ($)'),
          numberField('discountPercent', 'Discount (%)'),
          numberField('extraDiscountPercent', 'Extra discount (%)'),
          numberField('taxPercent', 'Tax rate (%)'),
        ],
        defaultInputs: { originalPrice: '100', discountPercent: '20', extraDiscountPercent: '10', taxPercent: '5' },
        examples: [
          { label: 'Stacked sale', inputs: { originalPrice: '100', discountPercent: '20', extraDiscountPercent: '10', taxPercent: '5' } },
          { label: 'Simple 30% off', inputs: { originalPrice: '80', discountPercent: '30', extraDiscountPercent: '0', taxPercent: '0' } },
          { label: 'Taxed purchase', inputs: { originalPrice: '250', discountPercent: '15', extraDiscountPercent: '5', taxPercent: '7.25' } },
        ],
      },
    ],
  },
  'business-loan': {
    title: 'Business Loan Calculator',
    buttonLabel: 'Estimate business loan',
    emptyHistory: 'Recent business loan estimates will appear here.',
    privacyNote: 'Business loan estimates do not include underwriting, collateral, variable rates, late fees, SBA rules, tax effects, or lender approval.',
    modes: [
      {
        id: 'business-loan',
        label: 'Business loan',
        symbol: 'BIZ',
        fields: [
          numberField('principal', 'Loan amount ($)'),
          numberField('annualRatePercent', 'Interest rate (%)'),
          numberField('years', 'Loan term (years)'),
          numberField('originationFeePercent', 'Origination fee (%)'),
        ],
        defaultInputs: { principal: '50000', annualRatePercent: '9.5', years: '5', originationFeePercent: '2' },
        examples: [
          { label: 'Small business loan', inputs: { principal: '50000', annualRatePercent: '9.5', years: '5', originationFeePercent: '2' } },
          { label: 'Short term', inputs: { principal: '25000', annualRatePercent: '11', years: '2', originationFeePercent: '3' } },
          { label: 'No fee', inputs: { principal: '100000', annualRatePercent: '8.25', years: '7', originationFeePercent: '0' } },
        ],
      },
    ],
  },
  'debt-to-income': {
    title: 'Debt-to-Income Ratio Calculator',
    buttonLabel: 'Calculate DTI',
    emptyHistory: 'Recent DTI estimates will appear here.',
    privacyNote: 'DTI estimates are simplified and do not decide loan approval, qualifying income, creditworthiness, or lender rules.',
    modes: [
      {
        id: 'debt-to-income',
        label: 'DTI',
        symbol: 'DTI',
        fields: [
          numberField('monthlyIncome', 'Gross monthly income ($)'),
          numberField('monthlyDebtPayments', 'Monthly debt payments ($)'),
          numberField('proposedHousingPayment', 'Proposed housing payment ($)'),
        ],
        defaultInputs: { monthlyIncome: '6000', monthlyDebtPayments: '900', proposedHousingPayment: '1500' },
        examples: [
          { label: 'Mortgage check', inputs: { monthlyIncome: '6000', monthlyDebtPayments: '900', proposedHousingPayment: '1500' } },
          { label: 'Debt only', inputs: { monthlyIncome: '4800', monthlyDebtPayments: '650', proposedHousingPayment: '0' } },
          { label: 'Higher payment', inputs: { monthlyIncome: '8000', monthlyDebtPayments: '1200', proposedHousingPayment: '2300' } },
        ],
      },
    ],
  },
  'personal-loan': {
    title: 'Personal Loan Calculator',
    buttonLabel: 'Estimate personal loan',
    emptyHistory: 'Recent personal loan estimates will appear here.',
    privacyNote: 'Personal loan estimates do not include lender approval, APR disclosures, late fees, prepayment rules, insurance, or credit impact.',
    modes: [
      {
        id: 'personal-loan',
        label: 'Personal loan',
        symbol: 'PERS',
        fields: [
          numberField('principal', 'Loan amount ($)'),
          numberField('annualRatePercent', 'Interest rate (%)'),
          numberField('years', 'Loan term (years)'),
          numberField('originationFeePercent', 'Origination fee (%)'),
        ],
        defaultInputs: { principal: '12000', annualRatePercent: '10.5', years: '4', originationFeePercent: '2' },
        examples: [
          { label: '$12k personal loan', inputs: { principal: '12000', annualRatePercent: '10.5', years: '4', originationFeePercent: '2' } },
          { label: 'Debt refinance', inputs: { principal: '18000', annualRatePercent: '11.9', years: '5', originationFeePercent: '3' } },
          { label: 'Short payoff', inputs: { principal: '5000', annualRatePercent: '8.5', years: '2', originationFeePercent: '0' } },
        ],
      },
    ],
  },
  'boat-loan': {
    title: 'Boat Loan Calculator',
    buttonLabel: 'Estimate boat loan',
    emptyHistory: 'Recent boat loan estimates will appear here.',
    privacyNote: 'Boat loan estimates do not include registration, marina costs, insurance, maintenance, inspections, taxes beyond the entered rate, or lender approval.',
    modes: [
      {
        id: 'boat-loan',
        label: 'Boat loan',
        symbol: 'BOAT',
        fields: [
          numberField('purchasePrice', 'Boat price ($)'),
          numberField('downPayment', 'Down payment ($)'),
          numberField('tradeIn', 'Trade-in value ($)'),
          numberField('fees', 'Fees ($)'),
          numberField('salesTaxPercent', 'Sales tax (%)'),
          numberField('annualRatePercent', 'Interest rate (%)'),
          numberField('years', 'Loan term (years)'),
        ],
        defaultInputs: { purchasePrice: '45000', downPayment: '9000', tradeIn: '0', fees: '1200', salesTaxPercent: '6', annualRatePercent: '8.5', years: '10' },
        examples: [
          { label: 'Used boat', inputs: { purchasePrice: '45000', downPayment: '9000', tradeIn: '0', fees: '1200', salesTaxPercent: '6', annualRatePercent: '8.5', years: '10' } },
          { label: 'Smaller loan', inputs: { purchasePrice: '22000', downPayment: '4000', tradeIn: '2000', fees: '750', salesTaxPercent: '5.5', annualRatePercent: '9', years: '7' } },
          { label: 'Long term', inputs: { purchasePrice: '85000', downPayment: '17000', tradeIn: '0', fees: '1800', salesTaxPercent: '6.25', annualRatePercent: '7.75', years: '15' } },
        ],
      },
    ],
  },
  lease: {
    title: 'Lease Calculator',
    buttonLabel: 'Estimate lease',
    emptyHistory: 'Recent lease estimates will appear here.',
    privacyNote: 'Lease estimates are simplified and do not include every contract fee, tax rule, insurance requirement, renewal option, or early-termination clause.',
    modes: [
      {
        id: 'lease',
        label: 'Lease',
        symbol: 'LEASE',
        fields: [
          numberField('assetValue', 'Asset value ($)'),
          numberField('residualValue', 'Residual value ($)'),
          numberField('annualRatePercent', 'Finance rate (%)'),
          numberField('termMonths', 'Lease term (months)'),
          numberField('upfrontPayment', 'Upfront payment ($)'),
          numberField('fees', 'Fees ($)'),
        ],
        defaultInputs: { assetValue: '30000', residualValue: '14000', annualRatePercent: '6', termMonths: '36', upfrontPayment: '1500', fees: '800' },
        examples: [
          { label: 'Equipment lease', inputs: { assetValue: '30000', residualValue: '14000', annualRatePercent: '6', termMonths: '36', upfrontPayment: '1500', fees: '800' } },
          { label: 'Lower residual', inputs: { assetValue: '18000', residualValue: '5000', annualRatePercent: '8', termMonths: '48', upfrontPayment: '1000', fees: '500' } },
          { label: 'Short term', inputs: { assetValue: '10000', residualValue: '6500', annualRatePercent: '5', termMonths: '24', upfrontPayment: '500', fees: '250' } },
        ],
      },
    ],
  },
  refinance: {
    title: 'Refinance Calculator',
    buttonLabel: 'Estimate refinance',
    emptyHistory: 'Recent refinance estimates will appear here.',
    privacyNote: 'Refinance estimates do not include underwriting, taxes, escrow changes, credit rules, prepayment penalties, or lender disclosures.',
    modes: [
      {
        id: 'refinance',
        label: 'Refinance',
        symbol: 'REFI',
        fields: [
          numberField('currentBalance', 'Current balance ($)'),
          numberField('currentAnnualRatePercent', 'Current rate (%)'),
          numberField('currentYears', 'Current remaining term (years)'),
          numberField('newAnnualRatePercent', 'New rate (%)'),
          numberField('newYears', 'New term (years)'),
          numberField('closingCosts', 'Closing costs ($)'),
        ],
        defaultInputs: { currentBalance: '280000', currentAnnualRatePercent: '7', currentYears: '26', newAnnualRatePercent: '5.9', newYears: '30', closingCosts: '4500' },
        examples: [
          { label: 'Mortgage refinance', inputs: { currentBalance: '280000', currentAnnualRatePercent: '7', currentYears: '26', newAnnualRatePercent: '5.9', newYears: '30', closingCosts: '4500' } },
          { label: 'Shorter term', inputs: { currentBalance: '220000', currentAnnualRatePercent: '6.8', currentYears: '24', newAnnualRatePercent: '5.7', newYears: '15', closingCosts: '3800' } },
          { label: 'Small cost', inputs: { currentBalance: '120000', currentAnnualRatePercent: '8', currentYears: '10', newAnnualRatePercent: '6.5', newYears: '10', closingCosts: '1500' } },
        ],
      },
    ],
  },
  budget: {
    title: 'Budget Calculator',
    buttonLabel: 'Calculate budget',
    emptyHistory: 'Recent budget summaries will appear here.',
    privacyNote: 'Budget estimates stay in your browser tab and do not include bank syncing, personal advice, taxes, or bill due-date tracking.',
    modes: [
      {
        id: 'budget',
        label: 'Monthly budget',
        symbol: 'BUDG',
        fields: [
          numberField('monthlyIncome', 'Monthly income ($)'),
          numberField('housing', 'Housing ($)'),
          numberField('utilities', 'Utilities ($)'),
          numberField('food', 'Food ($)'),
          numberField('transportation', 'Transportation ($)'),
          numberField('insurance', 'Insurance ($)'),
          numberField('debt', 'Debt payments ($)'),
          numberField('savings', 'Savings ($)'),
          numberField('other', 'Other ($)'),
        ],
        defaultInputs: { monthlyIncome: '5200', housing: '1600', utilities: '250', food: '650', transportation: '420', insurance: '280', debt: '350', savings: '600', other: '500' },
        examples: [
          { label: 'Household budget', inputs: { monthlyIncome: '5200', housing: '1600', utilities: '250', food: '650', transportation: '420', insurance: '280', debt: '350', savings: '600', other: '500' } },
          { label: 'Lower debt', inputs: { monthlyIncome: '4300', housing: '1200', utilities: '220', food: '520', transportation: '300', insurance: '210', debt: '120', savings: '500', other: '450' } },
          { label: 'Aggressive saving', inputs: { monthlyIncome: '7200', housing: '2100', utilities: '320', food: '800', transportation: '500', insurance: '400', debt: '600', savings: '1200', other: '600' } },
        ],
      },
    ],
  },
  'marriage-tax': {
    title: 'Marriage Tax Calculator',
    buttonLabel: 'Compare tax',
    emptyHistory: 'Recent marriage tax comparisons will appear here.',
    privacyNote: 'Marriage tax estimates use simplified 2026 federal ordinary-income brackets only and are not tax advice.',
    modes: [
      {
        id: 'marriage-tax',
        label: 'Federal comparison',
        symbol: 'MARR',
        fields: [
          numberField('spouseOneIncome', 'Person 1 income ($)'),
          numberField('spouseTwoIncome', 'Person 2 income ($)'),
          numberField('spouseOneDeduction', 'Person 1 deduction ($, blank uses standard)', 'Use standard'),
          numberField('spouseTwoDeduction', 'Person 2 deduction ($, blank uses standard)', 'Use standard'),
          numberField('jointDeduction', 'Joint deduction ($, blank uses standard)', 'Use standard'),
          numberField('credits', 'Joint credits ($)'),
        ],
        defaultInputs: { spouseOneIncome: '90000', spouseTwoIncome: '70000', spouseOneDeduction: '', spouseTwoDeduction: '', jointDeduction: '', credits: '0' },
        examples: [
          { label: 'Two earners', inputs: { spouseOneIncome: '90000', spouseTwoIncome: '70000', spouseOneDeduction: '', spouseTwoDeduction: '', jointDeduction: '', credits: '0' } },
          { label: 'One higher earner', inputs: { spouseOneIncome: '180000', spouseTwoIncome: '25000', spouseOneDeduction: '', spouseTwoDeduction: '', jointDeduction: '', credits: '0' } },
          { label: 'Custom deductions', inputs: { spouseOneIncome: '120000', spouseTwoIncome: '80000', spouseOneDeduction: '18000', spouseTwoDeduction: '16100', jointDeduction: '38000', credits: '1000' } },
        ],
      },
    ],
  },
  'estate-tax': {
    title: 'Estate Tax Calculator',
    buttonLabel: 'Estimate estate tax',
    emptyHistory: 'Recent estate tax estimates will appear here.',
    privacyNote: 'Estate tax estimates use a simplified federal 2026 exclusion and top-rate model. Estate planning needs professional advice.',
    modes: [
      {
        id: 'estate-tax',
        label: 'Federal estimate',
        symbol: 'EST',
        fields: [
          numberField('grossEstate', 'Gross estate ($)'),
          numberField('debtsAndExpenses', 'Debts and expenses ($)'),
          numberField('charitableBequests', 'Charitable bequests ($)'),
          numberField('spouseTransfers', 'Spouse transfers ($)'),
          numberField('lifetimeTaxableGifts', 'Prior taxable gifts using exclusion ($)'),
        ],
        defaultInputs: { grossEstate: '18000000', debtsAndExpenses: '500000', charitableBequests: '0', spouseTransfers: '0', lifetimeTaxableGifts: '0' },
        examples: [
          { label: '$18M estate', inputs: { grossEstate: '18000000', debtsAndExpenses: '500000', charitableBequests: '0', spouseTransfers: '0', lifetimeTaxableGifts: '0' } },
          { label: 'Charitable plan', inputs: { grossEstate: '22000000', debtsAndExpenses: '600000', charitableBequests: '2000000', spouseTransfers: '0', lifetimeTaxableGifts: '0' } },
          { label: 'Prior gifts', inputs: { grossEstate: '16000000', debtsAndExpenses: '300000', charitableBequests: '0', spouseTransfers: '0', lifetimeTaxableGifts: '1000000' } },
        ],
      },
    ],
  },
  'social-security': {
    title: 'Social Security Calculator',
    buttonLabel: 'Estimate benefit',
    emptyHistory: 'Recent Social Security estimates will appear here.',
    privacyNote: 'Social Security estimates use claiming-age adjustment rules and your entered benefit. Use SSA records for official benefits.',
    modes: [
      {
        id: 'social-security',
        label: 'Claiming age',
        symbol: 'SSA',
        fields: [
          numberField('birthYear', 'Birth year'),
          numberField('fullRetirementAgeBenefit', 'Monthly benefit at full retirement age ($)'),
          numberField('claimingAgeYears', 'Claiming age (62 to 70)'),
        ],
        defaultInputs: { birthYear: '1962', fullRetirementAgeBenefit: '2400', claimingAgeYears: '67' },
        examples: [
          { label: 'Full retirement age', inputs: { birthYear: '1962', fullRetirementAgeBenefit: '2400', claimingAgeYears: '67' } },
          { label: 'Claim at 62', inputs: { birthYear: '1962', fullRetirementAgeBenefit: '2400', claimingAgeYears: '62' } },
          { label: 'Delay to 70', inputs: { birthYear: '1960', fullRetirementAgeBenefit: '2600', claimingAgeYears: '70' } },
        ],
      },
    ],
  },
  rmd: {
    title: 'RMD Calculator',
    buttonLabel: 'Estimate RMD',
    emptyHistory: 'Recent RMD estimates will appear here.',
    privacyNote: 'RMD estimates use the IRS Uniform Lifetime Table only and do not cover inherited IRA or younger-spouse special rules.',
    modes: [
      {
        id: 'rmd',
        label: 'Uniform table',
        symbol: 'RMD',
        fields: [numberField('accountBalance', 'Prior Dec. 31 balance ($)'), numberField('age', 'Age this year')],
        defaultInputs: { accountBalance: '500000', age: '75' },
        examples: [
          { label: 'Age 75', inputs: { accountBalance: '500000', age: '75' } },
          { label: 'Age 80', inputs: { accountBalance: '750000', age: '80' } },
          { label: 'Age 90', inputs: { accountBalance: '300000', age: '90' } },
        ],
      },
    ],
  },
  'real-estate': {
    title: 'Real Estate Calculator',
    buttonLabel: 'Estimate return',
    emptyHistory: 'Recent real estate return estimates will appear here.',
    privacyNote: 'Real estate estimates are simplified and do not include taxes, depreciation recapture, financing changes, or local transaction rules.',
    modes: [
      {
        id: 'real-estate',
        label: 'Sale ROI',
        symbol: 'RE',
        fields: [
          numberField('purchasePrice', 'Purchase price ($)'),
          numberField('downPayment', 'Cash down payment ($)'),
          numberField('buyingCosts', 'Buying costs ($)'),
          numberField('improvements', 'Improvements ($)'),
          numberField('sellingPrice', 'Selling price ($)'),
          numberField('sellingCosts', 'Selling costs ($)'),
          numberField('loanPayoff', 'Loan payoff at sale ($)'),
        ],
        defaultInputs: { purchasePrice: '350000', downPayment: '70000', buyingCosts: '8000', improvements: '15000', sellingPrice: '430000', sellingCosts: '25800', loanPayoff: '260000' },
        examples: [
          { label: 'Home sale', inputs: { purchasePrice: '350000', downPayment: '70000', buyingCosts: '8000', improvements: '15000', sellingPrice: '430000', sellingCosts: '25800', loanPayoff: '260000' } },
          { label: 'Renovation', inputs: { purchasePrice: '240000', downPayment: '48000', buyingCosts: '6000', improvements: '35000', sellingPrice: '330000', sellingCosts: '19800', loanPayoff: '185000' } },
          { label: 'Small gain', inputs: { purchasePrice: '500000', downPayment: '100000', buyingCosts: '12000', improvements: '10000', sellingPrice: '545000', sellingCosts: '32700', loanPayoff: '382000' } },
        ],
      },
    ],
  },
  'take-home-paycheck': {
    title: 'Take-Home-Paycheck Calculator',
    buttonLabel: 'Estimate paycheck',
    emptyHistory: 'Recent paycheck estimates will appear here.',
    privacyNote: 'Paycheck estimates use simplified tax percentages plus 2026 employee FICA rates. They are not payroll advice.',
    modes: [
      {
        id: 'take-home-paycheck',
        label: 'Paycheck',
        symbol: 'NET',
        fields: [
          numberField('annualGrossPay', 'Annual gross pay ($)'),
          selectField('payPeriodsPerYear', 'Pay schedule', payPeriodOptions),
          numberField('pretaxDeductionsPerPaycheck', 'Pretax deductions per paycheck ($)'),
          numberField('federalTaxPercent', 'Federal withholding estimate (%)'),
          numberField('stateTaxPercent', 'State withholding estimate (%)'),
          numberField('localTaxPercent', 'Local withholding estimate (%)'),
        ],
        defaultInputs: { annualGrossPay: '78000', payPeriodsPerYear: '26', pretaxDeductionsPerPaycheck: '120', federalTaxPercent: '12', stateTaxPercent: '4', localTaxPercent: '0' },
        examples: [
          { label: 'Biweekly salary', inputs: { annualGrossPay: '78000', payPeriodsPerYear: '26', pretaxDeductionsPerPaycheck: '120', federalTaxPercent: '12', stateTaxPercent: '4', localTaxPercent: '0' } },
          { label: 'Monthly pay', inputs: { annualGrossPay: '96000', payPeriodsPerYear: '12', pretaxDeductionsPerPaycheck: '300', federalTaxPercent: '14', stateTaxPercent: '5', localTaxPercent: '1' } },
          { label: 'Weekly pay', inputs: { annualGrossPay: '52000', payPeriodsPerYear: '52', pretaxDeductionsPerPaycheck: '60', federalTaxPercent: '10', stateTaxPercent: '3', localTaxPercent: '0' } },
        ],
      },
    ],
  },
  'rental-property': {
    title: 'Rental Property Calculator',
    buttonLabel: 'Estimate rental',
    emptyHistory: 'Recent rental property estimates will appear here.',
    privacyNote: 'Rental estimates are simplified and do not include tax depreciation, repairs timing, financing changes, or local landlord rules.',
    modes: [
      {
        id: 'rental-property',
        label: 'Monthly cash flow',
        symbol: 'RENT',
        fields: [
          numberField('propertyPrice', 'Property price ($)'),
          numberField('downPayment', 'Down payment ($)'),
          numberField('annualRatePercent', 'Mortgage rate (%)'),
          numberField('loanYears', 'Loan term (years)'),
          numberField('monthlyRent', 'Monthly rent ($)'),
          numberField('vacancyPercent', 'Vacancy reserve (%)'),
          numberField('monthlyOperatingExpenses', 'Other monthly operating expenses ($)'),
          numberField('annualPropertyTax', 'Annual property tax ($)'),
          numberField('monthlyInsurance', 'Monthly insurance ($)'),
          numberField('maintenancePercent', 'Maintenance reserve (% of property/year)'),
          numberField('closingCosts', 'Cash closing costs ($)'),
        ],
        defaultInputs: { propertyPrice: '300000', downPayment: '75000', annualRatePercent: '6.75', loanYears: '30', monthlyRent: '2400', vacancyPercent: '5', monthlyOperatingExpenses: '260', annualPropertyTax: '3600', monthlyInsurance: '140', maintenancePercent: '1', closingCosts: '7000' },
        examples: [
          { label: 'Rental house', inputs: { propertyPrice: '300000', downPayment: '75000', annualRatePercent: '6.75', loanYears: '30', monthlyRent: '2400', vacancyPercent: '5', monthlyOperatingExpenses: '260', annualPropertyTax: '3600', monthlyInsurance: '140', maintenancePercent: '1', closingCosts: '7000' } },
          { label: 'Condo', inputs: { propertyPrice: '220000', downPayment: '55000', annualRatePercent: '6.5', loanYears: '30', monthlyRent: '1750', vacancyPercent: '6', monthlyOperatingExpenses: '350', annualPropertyTax: '2400', monthlyInsurance: '95', maintenancePercent: '0.8', closingCosts: '5000' } },
          { label: 'Higher rent', inputs: { propertyPrice: '420000', downPayment: '105000', annualRatePercent: '6.9', loanYears: '30', monthlyRent: '3400', vacancyPercent: '5', monthlyOperatingExpenses: '400', annualPropertyTax: '5200', monthlyInsurance: '180', maintenancePercent: '1', closingCosts: '9500' } },
        ],
      },
    ],
  },
  irr: {
    title: 'IRR Calculator',
    buttonLabel: 'Calculate IRR',
    emptyHistory: 'Recent IRR estimates will appear here.',
    privacyNote: 'IRR estimates assume evenly spaced cash flows and may not represent reinvestment returns or unusual cash-flow patterns.',
    modes: [
      {
        id: 'irr',
        label: 'Annual cash flows',
        symbol: 'IRR',
        fields: [
          numberField('initialOutflow', 'Initial investment outflow ($)'),
          numberField('cashFlow1', 'Year 1 cash flow ($)'),
          numberField('cashFlow2', 'Year 2 cash flow ($)'),
          numberField('cashFlow3', 'Year 3 cash flow ($)'),
          numberField('cashFlow4', 'Year 4 cash flow ($)'),
          numberField('cashFlow5', 'Year 5 cash flow ($)'),
          selectField('periodsPerYear', 'Periods per year', [{ label: 'Annual', value: '1' }, { label: 'Quarterly', value: '4' }, { label: 'Monthly', value: '12' }]),
        ],
        defaultInputs: { initialOutflow: '10000', cashFlow1: '2200', cashFlow2: '2400', cashFlow3: '2600', cashFlow4: '2800', cashFlow5: '4500', periodsPerYear: '1' },
        examples: [
          { label: 'Five-year project', inputs: { initialOutflow: '10000', cashFlow1: '2200', cashFlow2: '2400', cashFlow3: '2600', cashFlow4: '2800', cashFlow5: '4500', periodsPerYear: '1' } },
          { label: 'Uneven cash flows', inputs: { initialOutflow: '25000', cashFlow1: '4000', cashFlow2: '6500', cashFlow3: '7000', cashFlow4: '8000', cashFlow5: '9000', periodsPerYear: '1' } },
          { label: 'Monthly shorthand', inputs: { initialOutflow: '5000', cashFlow1: '500', cashFlow2: '550', cashFlow3: '575', cashFlow4: '600', cashFlow5: '650', periodsPerYear: '12' } },
        ],
      },
    ],
  },
  roi: {
    title: 'ROI Calculator',
    buttonLabel: 'Calculate ROI',
    emptyHistory: 'Recent ROI estimates will appear here.',
    privacyNote: 'ROI is simple gain divided by initial investment and does not adjust for time, risk, taxes, or inflation.',
    modes: [
      {
        id: 'roi',
        label: 'Return',
        symbol: 'ROI',
        fields: [numberField('initialInvestment', 'Initial investment ($)'), numberField('endingValue', 'Ending value ($)'), numberField('income', 'Income received ($)'), numberField('costs', 'Costs paid ($)')],
        defaultInputs: { initialInvestment: '10000', endingValue: '12500', income: '600', costs: '250' },
        examples: [
          { label: 'Investment gain', inputs: { initialInvestment: '10000', endingValue: '12500', income: '600', costs: '250' } },
          { label: 'Small project', inputs: { initialInvestment: '3000', endingValue: '3900', income: '0', costs: '150' } },
          { label: 'Loss check', inputs: { initialInvestment: '8000', endingValue: '7200', income: '300', costs: '100' } },
        ],
      },
    ],
  },
  apr: {
    title: 'APR Calculator',
    buttonLabel: 'Estimate APR',
    emptyHistory: 'Recent APR estimates will appear here.',
    privacyNote: 'APR estimates are simplified and are not official Truth in Lending disclosures.',
    modes: [
      {
        id: 'apr',
        label: 'Loan APR',
        symbol: 'APR',
        fields: [numberField('principal', 'Loan amount ($)'), numberField('annualRatePercent', 'Note rate (%)'), numberField('years', 'Term (years)'), numberField('fees', 'Finance charges / fees ($)')],
        defaultInputs: { principal: '20000', annualRatePercent: '8', years: '5', fees: '600' },
        examples: [
          { label: 'Personal loan APR', inputs: { principal: '20000', annualRatePercent: '8', years: '5', fees: '600' } },
          { label: 'Low fee', inputs: { principal: '12000', annualRatePercent: '9.5', years: '4', fees: '150' } },
          { label: 'Large loan', inputs: { principal: '250000', annualRatePercent: '6.5', years: '30', fees: '5000' } },
        ],
      },
    ],
  },
  'fha-loan': {
    title: 'FHA Loan Calculator',
    buttonLabel: 'Estimate FHA payment',
    emptyHistory: 'Recent FHA loan estimates will appear here.',
    privacyNote: 'FHA loan estimates use entered MIP assumptions and do not decide eligibility, underwriting, or official FHA costs.',
    modes: [
      {
        id: 'fha-loan',
        label: 'FHA payment',
        symbol: 'FHA',
        fields: [
          numberField('homePrice', 'Home price ($)'),
          numberField('downPayment', 'Down payment ($)'),
          numberField('annualRatePercent', 'Interest rate (%)'),
          numberField('years', 'Loan term (years)'),
          numberField('upfrontMipPercent', 'Upfront MIP (%)'),
          numberField('annualMipPercent', 'Annual MIP (%)'),
          numberField('annualPropertyTax', 'Annual property tax ($)'),
          numberField('monthlyInsurance', 'Monthly insurance ($)'),
        ],
        defaultInputs: { homePrice: '325000', downPayment: '11375', annualRatePercent: '6.5', years: '30', upfrontMipPercent: '1.75', annualMipPercent: '0.55', annualPropertyTax: '3900', monthlyInsurance: '130' },
        examples: [
          { label: '3.5% down', inputs: { homePrice: '325000', downPayment: '11375', annualRatePercent: '6.5', years: '30', upfrontMipPercent: '1.75', annualMipPercent: '0.55', annualPropertyTax: '3900', monthlyInsurance: '130' } },
          { label: 'Lower price', inputs: { homePrice: '260000', downPayment: '9100', annualRatePercent: '6.75', years: '30', upfrontMipPercent: '1.75', annualMipPercent: '0.55', annualPropertyTax: '3000', monthlyInsurance: '110' } },
          { label: 'Larger down', inputs: { homePrice: '400000', downPayment: '40000', annualRatePercent: '6.25', years: '30', upfrontMipPercent: '1.75', annualMipPercent: '0.5', annualPropertyTax: '5200', monthlyInsurance: '160' } },
        ],
      },
    ],
  },
  'va-mortgage': {
    title: 'VA Mortgage Calculator',
    buttonLabel: 'Estimate VA payment',
    emptyHistory: 'Recent VA mortgage estimates will appear here.',
    privacyNote: 'VA estimates use the public funding-fee rate logic for common purchase loans and do not decide eligibility or lender terms.',
    modes: [
      {
        id: 'va-mortgage',
        label: 'VA purchase',
        symbol: 'VA',
        fields: [
          numberField('homePrice', 'Home price ($)'),
          numberField('downPayment', 'Down payment ($)'),
          numberField('annualRatePercent', 'Interest rate (%)'),
          numberField('years', 'Loan term (years)'),
          selectField('firstUse', 'First VA loan use?', yesNoOptions),
          selectField('exemptFundingFee', 'Funding fee exempt?', yesNoOptions),
          selectField('financeFundingFee', 'Finance funding fee?', yesNoOptions),
          numberField('annualPropertyTax', 'Annual property tax ($)'),
          numberField('monthlyInsurance', 'Monthly insurance ($)'),
        ],
        defaultInputs: { homePrice: '360000', downPayment: '0', annualRatePercent: '6.25', years: '30', firstUse: 'yes', exemptFundingFee: 'no', financeFundingFee: 'yes', annualPropertyTax: '4200', monthlyInsurance: '140' },
        examples: [
          { label: 'First use, no down', inputs: { homePrice: '360000', downPayment: '0', annualRatePercent: '6.25', years: '30', firstUse: 'yes', exemptFundingFee: 'no', financeFundingFee: 'yes', annualPropertyTax: '4200', monthlyInsurance: '140' } },
          { label: '5% down', inputs: { homePrice: '360000', downPayment: '18000', annualRatePercent: '6.1', years: '30', firstUse: 'yes', exemptFundingFee: 'no', financeFundingFee: 'yes', annualPropertyTax: '4200', monthlyInsurance: '140' } },
          { label: 'Exempt fee', inputs: { homePrice: '300000', downPayment: '0', annualRatePercent: '6.3', years: '30', firstUse: 'yes', exemptFundingFee: 'yes', financeFundingFee: 'no', annualPropertyTax: '3600', monthlyInsurance: '125' } },
        ],
      },
    ],
  },
  'home-equity-loan': {
    title: 'Home Equity Loan Calculator',
    buttonLabel: 'Estimate equity loan',
    emptyHistory: 'Recent home equity loan estimates will appear here.',
    privacyNote: 'Home equity estimates do not approve borrowing and do not include lender limits, fees, foreclosure risk, or tax rules.',
    modes: [
      {
        id: 'home-equity-loan',
        label: 'Fixed equity loan',
        symbol: 'HEL',
        fields: [
          numberField('homeValue', 'Home value ($)'),
          numberField('currentMortgageBalance', 'Current mortgage balance ($)'),
          numberField('desiredLoanAmount', 'Desired equity loan ($)'),
          numberField('annualRatePercent', 'Interest rate (%)'),
          numberField('years', 'Loan term (years)'),
          numberField('maxCombinedLoanToValuePercent', 'Max combined LTV (%)'),
        ],
        defaultInputs: { homeValue: '450000', currentMortgageBalance: '260000', desiredLoanAmount: '50000', annualRatePercent: '8.25', years: '10', maxCombinedLoanToValuePercent: '85' },
        examples: [
          { label: '$50k loan', inputs: { homeValue: '450000', currentMortgageBalance: '260000', desiredLoanAmount: '50000', annualRatePercent: '8.25', years: '10', maxCombinedLoanToValuePercent: '85' } },
          { label: 'Higher CLTV', inputs: { homeValue: '520000', currentMortgageBalance: '320000', desiredLoanAmount: '75000', annualRatePercent: '8.5', years: '15', maxCombinedLoanToValuePercent: '90' } },
          { label: 'Small loan', inputs: { homeValue: '350000', currentMortgageBalance: '180000', desiredLoanAmount: '25000', annualRatePercent: '9', years: '7', maxCombinedLoanToValuePercent: '80' } },
        ],
      },
    ],
  },
  heloc: {
    title: 'HELOC Calculator',
    buttonLabel: 'Estimate HELOC',
    emptyHistory: 'Recent HELOC estimates will appear here.',
    privacyNote: 'HELOC estimates are simplified and do not include variable-rate changes, fees, minimum draws, or lender freezes.',
    modes: [
      {
        id: 'heloc',
        label: 'Line of credit',
        symbol: 'HELOC',
        fields: [
          numberField('homeValue', 'Home value ($)'),
          numberField('currentMortgageBalance', 'Current mortgage balance ($)'),
          numberField('creditLine', 'Credit line ($)'),
          numberField('currentDraw', 'Current draw ($)'),
          numberField('annualRatePercent', 'Interest rate (%)'),
          numberField('repaymentYears', 'Repayment period (years)'),
          numberField('maxCombinedLoanToValuePercent', 'Max combined LTV (%)'),
        ],
        defaultInputs: { homeValue: '450000', currentMortgageBalance: '260000', creditLine: '80000', currentDraw: '30000', annualRatePercent: '9', repaymentYears: '15', maxCombinedLoanToValuePercent: '85' },
        examples: [
          { label: '$30k draw', inputs: { homeValue: '450000', currentMortgageBalance: '260000', creditLine: '80000', currentDraw: '30000', annualRatePercent: '9', repaymentYears: '15', maxCombinedLoanToValuePercent: '85' } },
          { label: 'Large line', inputs: { homeValue: '600000', currentMortgageBalance: '350000', creditLine: '120000', currentDraw: '60000', annualRatePercent: '8.75', repaymentYears: '20', maxCombinedLoanToValuePercent: '85' } },
          { label: 'Small draw', inputs: { homeValue: '380000', currentMortgageBalance: '210000', creditLine: '50000', currentDraw: '10000', annualRatePercent: '9.5', repaymentYears: '10', maxCombinedLoanToValuePercent: '80' } },
        ],
      },
    ],
  },
  'down-payment': {
    title: 'Down Payment Calculator',
    buttonLabel: 'Calculate down payment',
    emptyHistory: 'Recent down payment estimates will appear here.',
    privacyNote: 'Down payment estimates do not include all cash-to-close details, lender rules, assistance programs, or escrow reserves.',
    modes: [
      {
        id: 'down-payment',
        label: 'Home cash needed',
        symbol: 'DOWN',
        fields: [
          numberField('homePrice', 'Home price ($)'),
          numberField('downPayment', 'Down payment amount ($, optional)'),
          numberField('downPaymentPercent', 'Down payment percent (%)'),
          numberField('closingCostPercent', 'Closing cost estimate (%)'),
        ],
        defaultInputs: { homePrice: '400000', downPayment: '', downPaymentPercent: '20', closingCostPercent: '3' },
        examples: [
          { label: '20% down', inputs: { homePrice: '400000', downPayment: '', downPaymentPercent: '20', closingCostPercent: '3' } },
          { label: '3.5% down', inputs: { homePrice: '325000', downPayment: '', downPaymentPercent: '3.5', closingCostPercent: '3.5' } },
          { label: 'Exact cash', inputs: { homePrice: '450000', downPayment: '50000', downPaymentPercent: '0', closingCostPercent: '3' } },
        ],
      },
    ],
  },
  'rent-vs-buy': {
    title: 'Rent vs. Buy Calculator',
    buttonLabel: 'Compare rent and buy',
    emptyHistory: 'Recent rent-vs-buy comparisons will appear here.',
    privacyNote: 'Rent-vs-buy estimates are simplified and do not include taxes, investment returns, repairs timing, or personal mobility needs.',
    modes: [
      {
        id: 'rent-vs-buy',
        label: 'Compare',
        symbol: 'R/B',
        fields: [
          numberField('monthlyRent', 'Monthly rent ($)'),
          numberField('rentIncreasePercent', 'Annual rent increase (%)'),
          numberField('homePrice', 'Home price ($)'),
          numberField('downPayment', 'Down payment ($)'),
          numberField('annualRatePercent', 'Mortgage rate (%)'),
          numberField('years', 'Compare over years'),
          numberField('annualPropertyTax', 'Annual property tax ($)'),
          numberField('monthlyInsurance', 'Monthly insurance ($)'),
          numberField('maintenancePercent', 'Maintenance (% of home/year)'),
          numberField('appreciationPercent', 'Home appreciation (%)'),
          numberField('sellingCostPercent', 'Selling cost (%)'),
        ],
        defaultInputs: { monthlyRent: '2100', rentIncreasePercent: '3', homePrice: '420000', downPayment: '84000', annualRatePercent: '6.5', years: '7', annualPropertyTax: '5000', monthlyInsurance: '150', maintenancePercent: '1', appreciationPercent: '3', sellingCostPercent: '6' },
        examples: [
          { label: 'Seven-year compare', inputs: { monthlyRent: '2100', rentIncreasePercent: '3', homePrice: '420000', downPayment: '84000', annualRatePercent: '6.5', years: '7', annualPropertyTax: '5000', monthlyInsurance: '150', maintenancePercent: '1', appreciationPercent: '3', sellingCostPercent: '6' } },
          { label: 'Short stay', inputs: { monthlyRent: '1800', rentIncreasePercent: '3', homePrice: '350000', downPayment: '70000', annualRatePercent: '6.75', years: '3', annualPropertyTax: '4000', monthlyInsurance: '130', maintenancePercent: '1', appreciationPercent: '2', sellingCostPercent: '6' } },
          { label: 'Higher rent market', inputs: { monthlyRent: '3200', rentIncreasePercent: '4', homePrice: '650000', downPayment: '130000', annualRatePercent: '6.25', years: '10', annualPropertyTax: '7600', monthlyInsurance: '220', maintenancePercent: '1', appreciationPercent: '3.5', sellingCostPercent: '6' } },
        ],
      },
    ],
  },
  'payback-period': {
    title: 'Payback Period Calculator',
    buttonLabel: 'Calculate payback',
    emptyHistory: 'Recent payback estimates will appear here.',
    privacyNote: 'Payback period ignores financing, discount rates, risk, taxes, and cash-flow timing inside each year.',
    modes: [
      {
        id: 'payback-period',
        label: 'Simple payback',
        symbol: 'PAY',
        fields: [numberField('initialCost', 'Initial cost ($)'), numberField('annualCashFlow', 'Annual cash flow ($)'), numberField('horizonYears', 'Horizon years')],
        defaultInputs: { initialCost: '15000', annualCashFlow: '3600', horizonYears: '8' },
        examples: [
          { label: 'Efficiency project', inputs: { initialCost: '15000', annualCashFlow: '3600', horizonYears: '8' } },
          { label: 'Equipment', inputs: { initialCost: '42000', annualCashFlow: '9500', horizonYears: '7' } },
          { label: 'Small upgrade', inputs: { initialCost: '2500', annualCashFlow: '600', horizonYears: '5' } },
        ],
      },
    ],
  },
  'present-value': {
    title: 'Present Value Calculator',
    buttonLabel: 'Calculate present value',
    emptyHistory: 'Recent present value estimates will appear here.',
    privacyNote: 'Present value estimates depend heavily on the discount rate you choose and are not investment advice.',
    modes: [
      {
        id: 'present-value',
        label: 'PV',
        symbol: 'PV',
        fields: [
          numberField('futureValue', 'Future lump sum ($)'),
          numberField('payment', 'Regular payment ($)'),
          numberField('annualRatePercent', 'Discount rate (%)'),
          numberField('years', 'Years'),
          selectField('paymentsPerYear', 'Payments per year', paymentFrequencyOptions),
        ],
        defaultInputs: { futureValue: '10000', payment: '200', annualRatePercent: '5', years: '6', paymentsPerYear: '12' },
        examples: [
          { label: 'Future plus payments', inputs: { futureValue: '10000', payment: '200', annualRatePercent: '5', years: '6', paymentsPerYear: '12' } },
          { label: 'Lump sum only', inputs: { futureValue: '50000', payment: '0', annualRatePercent: '6', years: '10', paymentsPerYear: '12' } },
          { label: 'Annual payments', inputs: { futureValue: '0', payment: '5000', annualRatePercent: '4', years: '8', paymentsPerYear: '1' } },
        ],
      },
    ],
  },
  'future-value': {
    title: 'Future Value Calculator',
    buttonLabel: 'Calculate future value',
    emptyHistory: 'Recent future value estimates will appear here.',
    privacyNote: 'Future value estimates use steady rates and payments. Real results can vary with fees, timing, and market returns.',
    modes: [
      {
        id: 'future-value',
        label: 'FV',
        symbol: 'FV',
        fields: [
          numberField('principal', 'Starting amount ($)'),
          numberField('payment', 'Regular payment ($)'),
          numberField('annualRatePercent', 'Interest / return rate (%)'),
          numberField('years', 'Years'),
          selectField('paymentsPerYear', 'Payments per year', paymentFrequencyOptions),
        ],
        defaultInputs: { principal: '5000', payment: '250', annualRatePercent: '6', years: '10', paymentsPerYear: '12' },
        examples: [
          { label: 'Monthly saving', inputs: { principal: '5000', payment: '250', annualRatePercent: '6', years: '10', paymentsPerYear: '12' } },
          { label: 'No new payments', inputs: { principal: '20000', payment: '0', annualRatePercent: '5', years: '8', paymentsPerYear: '12' } },
          { label: 'Annual contribution', inputs: { principal: '10000', payment: '3000', annualRatePercent: '7', years: '12', paymentsPerYear: '1' } },
        ],
      },
    ],
  },
  commission: {
    title: 'Commission Calculator',
    buttonLabel: 'Calculate commission',
    emptyHistory: 'Recent commission estimates will appear here.',
    privacyNote: 'Commission estimates use the simple rate and split you enter and do not include payroll tax, clawbacks, tiers, or plan rules.',
    modes: [
      {
        id: 'commission',
        label: 'Commission',
        symbol: 'COMM',
        fields: [numberField('salesAmount', 'Sales amount ($)'), numberField('commissionPercent', 'Commission rate (%)'), numberField('splitPercent', 'Your split (%)'), numberField('basePay', 'Base pay ($)'), numberField('bonus', 'Bonus ($)')],
        defaultInputs: { salesAmount: '50000', commissionPercent: '3', splitPercent: '100', basePay: '0', bonus: '0' },
        examples: [
          { label: 'Sales commission', inputs: { salesAmount: '50000', commissionPercent: '3', splitPercent: '100', basePay: '0', bonus: '0' } },
          { label: 'Split commission', inputs: { salesAmount: '750000', commissionPercent: '2.5', splitPercent: '50', basePay: '0', bonus: '0' } },
          { label: 'Base plus bonus', inputs: { salesAmount: '120000', commissionPercent: '1.25', splitPercent: '100', basePay: '2500', bonus: '500' } },
        ],
      },
    ],
  },
  'mortgage-uk': {
    title: 'Mortgage Calculator UK',
    buttonLabel: 'Estimate UK mortgage',
    emptyHistory: 'Recent UK mortgage estimates will appear here.',
    privacyNote: 'UK mortgage estimates are repayment-payment estimates only and do not include lender affordability rules, stamp duty, or product fees beyond what you enter.',
    modes: [
      {
        id: 'mortgage-uk',
        label: 'Repayment',
        symbol: 'UK',
        fields: [numberField('propertyPrice', 'Property price'), numberField('deposit', 'Deposit'), numberField('annualRatePercent', 'Interest rate (%)'), numberField('years', 'Mortgage term (years)'), numberField('monthlyFees', 'Monthly fees')],
        defaultInputs: { propertyPrice: '300000', deposit: '60000', annualRatePercent: '5.2', years: '25', monthlyFees: '0' },
        examples: [
          { label: '25-year mortgage', inputs: { propertyPrice: '300000', deposit: '60000', annualRatePercent: '5.2', years: '25', monthlyFees: '0' } },
          { label: 'Higher deposit', inputs: { propertyPrice: '425000', deposit: '125000', annualRatePercent: '4.9', years: '30', monthlyFees: '20' } },
          { label: 'Shorter term', inputs: { propertyPrice: '250000', deposit: '50000', annualRatePercent: '5.5', years: '15', monthlyFees: '0' } },
        ],
      },
    ],
  },
  'canadian-mortgage': {
    title: 'Canadian Mortgage Calculator',
    buttonLabel: 'Estimate Canadian mortgage',
    emptyHistory: 'Recent Canadian mortgage estimates will appear here.',
    privacyNote: 'Canadian mortgage estimates use semi-annual compounding conversion and do not include default insurance, taxes, fees, or lender approval.',
    modes: [
      {
        id: 'canadian-mortgage',
        label: 'Mortgage',
        symbol: 'CAD',
        fields: [
          numberField('propertyPrice', 'Property price'),
          numberField('downPayment', 'Down payment'),
          numberField('annualRatePercent', 'Interest rate (%)'),
          numberField('years', 'Amortization (years)'),
          selectField('paymentsPerYear', 'Payment frequency', paymentFrequencyOptions),
        ],
        defaultInputs: { propertyPrice: '600000', downPayment: '120000', annualRatePercent: '5.1', years: '25', paymentsPerYear: '12' },
        examples: [
          { label: 'Monthly payments', inputs: { propertyPrice: '600000', downPayment: '120000', annualRatePercent: '5.1', years: '25', paymentsPerYear: '12' } },
          { label: 'Biweekly', inputs: { propertyPrice: '520000', downPayment: '104000', annualRatePercent: '4.9', years: '25', paymentsPerYear: '26' } },
          { label: 'Short amortization', inputs: { propertyPrice: '450000', downPayment: '90000', annualRatePercent: '5.25', years: '20', paymentsPerYear: '12' } },
        ],
      },
    ],
  },
  'percent-off': {
    title: 'Percent Off Calculator',
    buttonLabel: 'Calculate sale price',
    emptyHistory: 'Recent percent-off estimates will appear here.',
    privacyNote: 'Percent-off estimates apply the discounts and tax rate you enter. Retail totals can differ with coupons, shipping, and local tax rules.',
    modes: [
      {
        id: 'percent-off',
        label: 'Sale price',
        symbol: 'OFF',
        fields: [numberField('originalPrice', 'Original price ($)'), numberField('discountPercent', 'Percent off (%)'), numberField('extraDiscountPercent', 'Extra percent off (%)'), numberField('taxPercent', 'Tax rate (%)')],
        defaultInputs: { originalPrice: '80', discountPercent: '25', extraDiscountPercent: '10', taxPercent: '7.5' },
        examples: [
          { label: 'Sale plus tax', inputs: { originalPrice: '80', discountPercent: '25', extraDiscountPercent: '10', taxPercent: '7.5' } },
          { label: 'Half off', inputs: { originalPrice: '120', discountPercent: '50', extraDiscountPercent: '0', taxPercent: '0' } },
          { label: 'Stacked sale', inputs: { originalPrice: '200', discountPercent: '30', extraDiscountPercent: '15', taxPercent: '6' } },
        ],
      },
    ],
  },
  inflation: {
    title: 'Inflation Calculator',
    buttonLabel: 'Calculate inflation',
    emptyHistory: 'Recent inflation estimates will appear here.',
    privacyNote: 'Inflation estimates use your chosen rate and do not look up historical CPI or specific product prices.',
    modes: [
      {
        id: 'inflation',
        label: 'Inflation',
        symbol: 'CPI',
        fields: [
          numberField('amount', 'Amount ($)'),
          numberField('annualInflationPercent', 'Inflation rate (%)'),
          numberField('years', 'Years'),
        ],
        defaultInputs: { amount: '100', annualInflationPercent: '3', years: '10' },
        examples: [
          { label: '$100 for 10 years', inputs: { amount: '100', annualInflationPercent: '3', years: '10' } },
          { label: '$1k at 4%', inputs: { amount: '1000', annualInflationPercent: '4', years: '5' } },
          { label: '$2.5k expenses', inputs: { amount: '2500', annualInflationPercent: '2.5', years: '15' } },
        ],
      },
    ],
  },
  finance: {
    title: 'Finance Calculator',
    buttonLabel: 'Project balance',
    emptyHistory: 'Recent finance projections will appear here.',
    privacyNote: 'General finance projections are quick estimates and do not include fees, taxes, or account-specific rules.',
    modes: [
      {
        id: 'finance',
        label: 'Future value',
        symbol: 'FV',
        fields: [
          numberField('principal', 'Starting amount ($)'),
          numberField('monthlyContribution', 'Monthly contribution ($)'),
          numberField('annualRatePercent', 'Estimated annual rate (%)'),
          numberField('years', 'Time (years)'),
        ],
        defaultInputs: { principal: '2000', monthlyContribution: '150', annualRatePercent: '5', years: '8' },
        examples: [
          { label: 'Savings projection', inputs: { principal: '2000', monthlyContribution: '150', annualRatePercent: '5', years: '8' } },
          { label: 'Short-term plan', inputs: { principal: '500', monthlyContribution: '75', annualRatePercent: '2', years: '2' } },
          { label: 'Higher rate test', inputs: { principal: '2000', monthlyContribution: '150', annualRatePercent: '7', years: '8' } },
        ],
      },
    ],
  },
  'income-tax': {
    title: 'Income Tax Calculator',
    buttonLabel: 'Estimate federal tax',
    emptyHistory: 'Recent income tax estimates will appear here.',
    privacyNote: 'Tax estimates are simplified federal ordinary income estimates and are not filing, legal, or tax advice.',
    modes: [
      {
        id: 'income-tax',
        label: '2026 federal',
        symbol: 'TAX',
        fields: [
          selectField('filingStatus', 'Filing status', filingStatusOptions),
          numberField('grossIncome', 'Gross ordinary income ($)'),
          numberField('deduction', 'Deduction ($, blank uses standard)', 'Use standard deduction'),
          numberField('credits', 'Credits ($)'),
        ],
        defaultInputs: { filingStatus: 'single', grossIncome: '100000', deduction: '', credits: '0' },
        examples: [
          { label: 'Single $100k', inputs: { filingStatus: 'single', grossIncome: '100000', deduction: '', credits: '0' } },
          { label: 'Joint $160k', inputs: { filingStatus: 'married-joint', grossIncome: '160000', deduction: '', credits: '0' } },
          { label: 'Custom deduction', inputs: { filingStatus: 'head-household', grossIncome: '90000', deduction: '20000', credits: '0' } },
        ],
      },
    ],
  },
  'compound-interest': {
    title: 'Compound Interest Calculator',
    buttonLabel: 'Calculate compound growth',
    emptyHistory: 'Recent compound interest estimates will appear here.',
    privacyNote: 'Compound interest estimates do not include taxes, fees, account limits, risk, or guaranteed returns.',
    modes: [
      {
        id: 'compound-interest',
        label: 'Compound',
        symbol: 'CMP',
        fields: [
          numberField('principal', 'Initial amount ($)'),
          numberField('monthlyContribution', 'Monthly contribution ($)'),
          numberField('annualRatePercent', 'Annual rate (%)'),
          numberField('years', 'Time (years)'),
          selectField('compoundFrequency', 'Compounding', compoundOptions),
        ],
        defaultInputs: { principal: '1000', monthlyContribution: '100', annualRatePercent: '6', years: '10', compoundFrequency: '12' },
        examples: [
          { label: '$100/month', inputs: { principal: '1000', monthlyContribution: '100', annualRatePercent: '6', years: '10', compoundFrequency: '12' } },
          { label: 'Daily compounding', inputs: { principal: '5000', monthlyContribution: '0', annualRatePercent: '4.5', years: '10', compoundFrequency: '365' } },
          { label: 'Annual compounding', inputs: { principal: '10000', monthlyContribution: '250', annualRatePercent: '5', years: '15', compoundFrequency: '1' } },
        ],
      },
    ],
  },
  salary: {
    title: 'Salary Calculator',
    buttonLabel: 'Convert salary',
    emptyHistory: 'Recent salary conversions will appear here.',
    privacyNote: 'Salary estimates do not include actual payroll withholding, benefits, deductions, overtime, bonuses, state tax, or local tax.',
    modes: [
      {
        id: 'salary',
        label: 'Salary',
        symbol: 'SAL',
        fields: [
          numberField('annualSalary', 'Annual salary ($)'),
          numberField('hoursPerWeek', 'Hours per week'),
          numberField('weeksPerYear', 'Paid weeks per year'),
          numberField('estimatedTaxRatePercent', 'Simple tax estimate (%)'),
        ],
        defaultInputs: { annualSalary: '78000', hoursPerWeek: '40', weeksPerYear: '52', estimatedTaxRatePercent: '22' },
        examples: [
          { label: '$78k full-time', inputs: { annualSalary: '78000', hoursPerWeek: '40', weeksPerYear: '52', estimatedTaxRatePercent: '22' } },
          { label: 'School-year work', inputs: { annualSalary: '45000', hoursPerWeek: '37.5', weeksPerYear: '40', estimatedTaxRatePercent: '18' } },
          { label: '$60k estimate', inputs: { annualSalary: '60000', hoursPerWeek: '40', weeksPerYear: '52', estimatedTaxRatePercent: '20' } },
        ],
      },
    ],
  },
  'interest-rate': {
    title: 'Interest Rate Calculator',
    buttonLabel: 'Estimate rate',
    emptyHistory: 'Recent interest rate estimates will appear here.',
    privacyNote: 'Estimated rates are nominal approximations and do not include APR fees, variable rates, or lender disclosures.',
    modes: [
      {
        id: 'interest-rate',
        label: 'Rate',
        symbol: 'APR',
        fields: [
          numberField('principal', 'Principal ($)'),
          numberField('monthlyPayment', 'Monthly payment ($)'),
          numberField('years', 'Loan term (years)'),
        ],
        defaultInputs: { principal: '25000', monthlyPayment: '483.32', years: '5' },
        examples: [
          { label: '$25k payment quote', inputs: { principal: '25000', monthlyPayment: '483.32', years: '5' } },
          { label: '$15k over 4 years', inputs: { principal: '15000', monthlyPayment: '350', years: '4' } },
          { label: '$30k over 6 years', inputs: { principal: '30000', monthlyPayment: '540', years: '6' } },
        ],
      },
    ],
  },
  'sales-tax': {
    title: 'Sales Tax Calculator',
    buttonLabel: 'Calculate sales tax',
    emptyHistory: 'Recent sales tax estimates will appear here.',
    privacyNote: 'Sales tax estimates use the manual rate you enter and do not look up local rates or exemptions.',
    modes: [
      {
        id: 'sales-tax',
        label: 'Sales tax',
        symbol: 'TAX',
        fields: [
          numberField('subtotal', 'Subtotal ($)'),
          numberField('salesTaxPercent', 'Sales tax rate (%)'),
        ],
        defaultInputs: { subtotal: '80', salesTaxPercent: '7.5' },
        examples: [
          { label: '$80 at 7.5%', inputs: { subtotal: '80', salesTaxPercent: '7.5' } },
          { label: '$1,200 at 6.25%', inputs: { subtotal: '1200', salesTaxPercent: '6.25' } },
          { label: '$42.50 at 8.2%', inputs: { subtotal: '42.50', salesTaxPercent: '8.2' } },
        ],
      },
    ],
  },
};

function parseNumber(value: string | undefined, label: string) {
  const normalized = (value ?? '').replace(/[$,%\s,]/g, '');

  if (!normalized) {
    throw new Error(`${label} is required`);
  }

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be a number`);
  }

  return parsed;
}

function parseOptionalNumber(value: string | undefined, label: string) {
  const normalized = (value ?? '').replace(/[$,%\s,]/g, '');

  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be a number`);
  }

  return parsed;
}

function money(value: number, currency = 'USD') {
  return value.toLocaleString('en-US', {
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: 'currency',
  });
}

function compactMoney(value: number, currency = 'USD') {
  return value.toLocaleString('en-US', {
    currency,
    maximumFractionDigits: 0,
    style: 'currency',
  });
}

function percent(value: number) {
  return `${formatCalculatorNumber(value)}%`;
}

function years(value: number) {
  return `${formatCalculatorNumber(value)} ${Math.abs(value - 1) < 1e-9 ? 'year' : 'years'}`;
}

function monthCount(value: number) {
  return `${Math.round(value)} ${Math.round(value) === 1 ? 'month' : 'months'}`;
}

function filingStatusLabel(value: FederalFilingStatus) {
  return filingStatusOptions.find((option) => option.value === value)?.label ?? value;
}

function loanCalculation(inputs: FinanceInputs, title = 'Monthly payment'): FinanceCalculation {
  const principal = parseNumber(inputs.principal, 'Principal');
  const annualRatePercent = parseNumber(inputs.annualRatePercent, 'Interest rate');
  const loanYears = parseNumber(inputs.years, 'Loan term');
  const result = calculateLoanSummary(principal, annualRatePercent, loanYears);

  return {
    label: title,
    expression: `${compactMoney(principal)} at ${percent(annualRatePercent)} for ${years(loanYears)}`,
    answer: money(result.monthlyPayment),
    metrics: [
      { label: 'Total paid', value: money(result.totalPaid) },
      { label: 'Total interest', value: money(result.totalInterest) },
      { label: 'Payments', value: monthCount(result.paymentCount) },
    ],
    steps: [
      `Convert annual rate ${percent(annualRatePercent)} to monthly rate ${percent(annualRatePercent / 12)}.`,
      `Use ${result.paymentCount} monthly payments across ${years(loanYears)}.`,
      'Apply the fixed-payment amortization formula to estimate the monthly payment.',
      'Total interest equals total paid minus principal.',
    ],
  };
}

function calculateFinance(variant: FinanceToolVariant, modeId: string, inputs: FinanceInputs): FinanceCalculation {
  switch (variant) {
    case 'mortgage': {
      const homePrice = parseNumber(inputs.homePrice, 'Home price');
      const downPayment = parseNumber(inputs.downPayment, 'Down payment');
      const annualRatePercent = parseNumber(inputs.annualRatePercent, 'Interest rate');
      const loanYears = parseNumber(inputs.years, 'Loan term');
      const result = calculateMortgagePayment({
        homePrice,
        downPayment,
        annualRatePercent,
        years: loanYears,
        annualPropertyTax: parseNumber(inputs.annualPropertyTax, 'Property tax'),
        monthlyInsurance: parseNumber(inputs.monthlyInsurance, 'Monthly insurance'),
        monthlyPmi: parseNumber(inputs.monthlyPmi, 'Monthly PMI'),
        monthlyHoa: parseNumber(inputs.monthlyHoa, 'Monthly HOA'),
      });

      return {
        label: 'Estimated monthly payment',
        expression: `${compactMoney(homePrice)} home, ${compactMoney(result.loanAmount)} loan at ${percent(annualRatePercent)}`,
        answer: money(result.totalMonthlyPayment),
        metrics: [
          { label: 'Principal and interest', value: money(result.principalAndInterest) },
          { label: 'Total interest', value: money(result.totalInterest) },
          { label: 'Loan-to-value', value: percent(result.loanToValuePercent) },
          { label: 'Taxes and insurance', value: money(result.monthlyPropertyTax + result.monthlyInsurance) },
        ],
        steps: [
          `Loan amount = ${compactMoney(homePrice)} - ${compactMoney(downPayment)} = ${compactMoney(result.loanAmount)}.`,
          'Calculate monthly principal and interest with the fixed-payment formula.',
          'Divide annual property tax by 12.',
          'Add monthly tax, insurance, PMI, and HOA to principal and interest.',
        ],
        note: 'This estimate is not a lender Loan Estimate and does not include closing costs or escrow changes.',
      };
    }
    case 'loan':
      return loanCalculation(inputs, 'Loan payment');
    case 'payment':
      return loanCalculation(inputs, 'Fixed monthly payment');
    case 'auto-loan': {
      const result = calculateAutoLoanSummary({
        purchasePrice: parseNumber(inputs.purchasePrice, 'Vehicle price'),
        downPayment: parseNumber(inputs.downPayment, 'Down payment'),
        tradeIn: parseNumber(inputs.tradeIn, 'Trade-in value'),
        fees: parseNumber(inputs.fees, 'Fees'),
        salesTaxPercent: parseNumber(inputs.salesTaxPercent, 'Sales tax rate'),
        annualRatePercent: parseNumber(inputs.annualRatePercent, 'Interest rate'),
        years: parseNumber(inputs.years, 'Loan term'),
      });

      return {
        label: 'Estimated auto payment',
        expression: `${compactMoney(result.amountFinanced)} financed at ${percent(result.annualRatePercent)} for ${years(result.years)}`,
        answer: money(result.monthlyPayment),
        metrics: [
          { label: 'Amount financed', value: money(result.amountFinanced) },
          { label: 'Sales tax', value: money(result.salesTax) },
          { label: 'Total interest', value: money(result.totalInterest) },
          { label: 'Total paid', value: money(result.totalPaid) },
        ],
        steps: [
          'Estimate taxable amount from vehicle price minus trade-in value.',
          'Add sales tax and fees, then subtract down payment and trade-in value.',
          'Use the amount financed in the fixed-payment loan formula.',
          'Total interest equals total paid minus amount financed.',
        ],
        note: 'Trade-in tax treatment and dealer fees vary by location and offer.',
      };
    }
    case 'interest': {
      if (modeId === 'simple') {
        const principal = parseNumber(inputs.principal, 'Principal');
        const annualRatePercent = parseNumber(inputs.annualRatePercent, 'Interest rate');
        const interestYears = parseNumber(inputs.years, 'Time');
        const result = calculateSimpleInterest(principal, annualRatePercent, interestYears);

        return {
          label: 'Simple interest',
          expression: `${compactMoney(principal)} x ${percent(annualRatePercent)} x ${years(interestYears)}`,
          answer: money(result.interest),
          metrics: [
            { label: 'Ending balance', value: money(result.endingBalance) },
            { label: 'Principal', value: money(result.principal) },
            { label: 'Time', value: years(result.years) },
          ],
          steps: [
            `Convert ${percent(annualRatePercent)} to decimal rate ${formatCalculatorNumber(annualRatePercent / 100)}.`,
            'Multiply principal by annual rate and years.',
            'Add interest to principal for the ending balance.',
          ],
        };
      }

      const principal = parseNumber(inputs.principal, 'Initial amount');
      const monthlyContribution = parseNumber(inputs.monthlyContribution, 'Monthly contribution');
      const annualRatePercent = parseNumber(inputs.annualRatePercent, 'Interest rate');
      const interestYears = parseNumber(inputs.years, 'Time');
      const compoundFrequency = parseNumber(inputs.compoundFrequency, 'Compounding frequency');
      const result = calculateCompoundInterest(principal, annualRatePercent, interestYears, compoundFrequency, monthlyContribution);

      return {
        label: 'Compound balance',
        expression: `${compactMoney(principal)} plus ${money(monthlyContribution)}/mo at ${percent(annualRatePercent)}`,
        answer: money(result.endingBalance),
        metrics: [
          { label: 'Total contributions', value: money(result.totalContributions) },
          { label: 'Estimated interest', value: money(result.totalInterest) },
          { label: 'Effective annual rate', value: percent(result.effectiveAnnualRatePercent) },
        ],
        steps: [
          `Use ${compoundFrequency} compounding periods per year.`,
          'Convert the effective annual rate to an estimated monthly growth rate.',
          'Compound the starting balance and add end-of-month contributions.',
          'Interest equals ending balance minus total contributions.',
        ],
      };
    }
    case 'retirement': {
      const result = calculateRetirementSavings({
        currentSavings: parseNumber(inputs.currentSavings, 'Current savings'),
        monthlyContribution: parseNumber(inputs.monthlyContribution, 'Monthly contribution'),
        annualReturnPercent: parseNumber(inputs.annualReturnPercent, 'Estimated return'),
        years: parseNumber(inputs.years, 'Years to grow'),
        targetAmount: parseNumber(inputs.targetAmount, 'Target amount'),
      });

      return {
        label: 'Projected retirement savings',
        expression: `${compactMoney(result.principal)} plus ${money(result.monthlyContribution)}/mo for ${years(result.years)}`,
        answer: money(result.endingBalance),
        metrics: [
          { label: 'Total contributions', value: money(result.totalContributions) },
          { label: 'Estimated growth', value: money(result.totalInterest) },
          { label: result.goalMet ? 'Above target' : 'Target gap', value: money(Math.abs(result.goalGap)) },
        ],
        steps: [
          'Compound current savings using the estimated annual return.',
          'Add monthly contributions at the end of each month.',
          'Compare the projected balance with the target amount.',
        ],
        note: 'This projection does not include taxes, fees, inflation, withdrawals, or market volatility.',
      };
    }
    case 'amortization': {
      const principal = parseNumber(inputs.principal, 'Loan amount');
      const annualRatePercent = parseNumber(inputs.annualRatePercent, 'Interest rate');
      const loanYears = parseNumber(inputs.years, 'Original term');
      const extraMonthlyPayment = parseNumber(inputs.extraMonthlyPayment, 'Extra monthly payment');
      const result = calculateAmortizationSummary(principal, annualRatePercent, loanYears, extraMonthlyPayment);

      return {
        label: 'Estimated payoff time',
        expression: `${compactMoney(principal)} at ${percent(annualRatePercent)} with ${money(extraMonthlyPayment)} extra/mo`,
        answer: monthCount(result.monthsToPayoff),
        metrics: [
          { label: 'Scheduled payment', value: money(result.scheduledMonthlyPayment) },
          { label: 'Monthly paid', value: money(result.monthlyPayment) },
          { label: 'Interest saved', value: money(result.interestSaved) },
          { label: 'Months saved', value: monthCount(result.monthsSaved) },
        ],
        steps: [
          'Calculate the scheduled fixed monthly payment.',
          'Add the extra monthly payment to the scheduled payment.',
          'Simulate monthly interest and principal reduction until the balance reaches zero.',
          'Compare total interest and payoff time with the original schedule.',
        ],
      };
    }
    case 'investment':
    case 'finance': {
      const principal = parseNumber(inputs.principal, 'Starting amount');
      const monthlyContribution = parseNumber(inputs.monthlyContribution, 'Monthly contribution');
      const annualReturnPercent = parseNumber(inputs.annualReturnPercent ?? inputs.annualRatePercent, 'Estimated annual rate');
      const investmentYears = parseNumber(inputs.years, 'Time');
      const result = calculateInvestmentGrowth(principal, monthlyContribution, annualReturnPercent, investmentYears);

      return {
        label: variant === 'investment' ? 'Projected investment balance' : 'Projected future balance',
        expression: `${compactMoney(principal)} plus ${money(monthlyContribution)}/mo at ${percent(annualReturnPercent)}`,
        answer: money(result.endingBalance),
        metrics: [
          { label: 'Total contributions', value: money(result.totalContributions) },
          { label: 'Estimated growth', value: money(result.totalInterest) },
          { label: 'Time', value: years(result.years) },
        ],
        steps: [
          'Convert the annual return assumption into monthly growth.',
          'Compound the starting amount over the full time period.',
          'Add each monthly contribution as an end-of-month deposit.',
          'Estimated growth equals ending balance minus total contributions.',
        ],
        note: 'This is a projection, not a guaranteed return.',
      };
    }
    case 'currency': {
      const amount = parseNumber(inputs.amount, 'Amount');
      const exchangeRate = parseNumber(inputs.exchangeRate, 'Exchange rate');
      const feePercent = parseNumber(inputs.feePercent, 'Fee percent');
      const result = calculateCurrencyConversion(amount, exchangeRate, feePercent);

      return {
        label: 'Converted amount',
        expression: `${formatCalculatorNumber(amount)} x ${formatCalculatorNumber(exchangeRate)} with ${percent(feePercent)} fee`,
        answer: `${formatCalculatorNumber(result.convertedAmount)} target units`,
        metrics: [
          { label: 'Before fee', value: formatCalculatorNumber(result.grossConverted) },
          { label: 'Fee amount', value: formatCalculatorNumber(result.feeAmount) },
          { label: 'Rate used', value: formatCalculatorNumber(result.exchangeRate) },
        ],
        steps: [
          'Enter the current exchange rate manually from your bank, card, or rate source.',
          'Multiply the source amount by the exchange rate.',
          'Subtract any exchange fee percentage from the converted amount.',
        ],
        note: 'This calculator does not fetch live exchange rates.',
      };
    }
    case 'mortgage-payoff': {
      const principal = parseNumber(inputs.principal, 'Current loan balance');
      const annualRatePercent = parseNumber(inputs.annualRatePercent, 'Interest rate');
      const loanYears = parseNumber(inputs.years, 'Remaining term');
      const extraMonthlyPayment = parseNumber(inputs.extraMonthlyPayment, 'Extra monthly payment');
      const oneTimePayment = parseNumber(inputs.oneTimePayment, 'One-time extra payment');
      const result = calculateMortgagePayoffSummary(principal, annualRatePercent, loanYears, extraMonthlyPayment, oneTimePayment);

      return {
        label: 'Estimated payoff time',
        expression: `${compactMoney(principal)} balance with ${money(extraMonthlyPayment)} extra/mo`,
        answer: monthCount(result.monthsToPayoff),
        metrics: [
          { label: 'Scheduled payment', value: money(result.scheduledMonthlyPayment) },
          { label: 'Interest saved', value: money(result.interestSaved) },
          { label: 'Months saved', value: monthCount(result.monthsSaved) },
          { label: 'One-time payment', value: money(result.oneTimePayment) },
        ],
        steps: [
          'Calculate the regular payment from current balance, rate, and remaining term.',
          'Subtract any one-time extra payment from the balance.',
          'Add the extra monthly payment to the regular payment.',
          'Simulate monthly interest and principal until the balance reaches zero.',
        ],
        note: 'Ask your lender for an official payoff quote before sending a final payoff amount.',
      };
    }
    case '401k': {
      const result = calculateFourOhOneKProjection({
        currentBalance: parseNumber(inputs.currentBalance, 'Current balance'),
        annualSalary: parseNumber(inputs.annualSalary, 'Annual salary'),
        employeeContributionPercent: parseNumber(inputs.employeeContributionPercent, 'Your contribution'),
        employerMatchPercent: parseNumber(inputs.employerMatchPercent, 'Employer match'),
        employerMatchLimitPercent: parseNumber(inputs.employerMatchLimitPercent, 'Employer match limit'),
        annualReturnPercent: parseNumber(inputs.annualReturnPercent, 'Estimated return'),
        years: parseNumber(inputs.years, 'Years to grow'),
      });

      return {
        label: 'Projected 401K balance',
        expression: `${percent(result.employeeContributionPercent)} of ${compactMoney(result.annualSalary)} salary for ${years(result.years)}`,
        answer: money(result.endingBalance),
        metrics: [
          { label: 'Your monthly contribution', value: money(result.monthlyEmployeeContribution) },
          { label: 'Employer monthly match', value: money(result.monthlyEmployerContribution) },
          { label: 'Your total contributions', value: money(result.totalEmployeeContributions) },
          { label: 'Employer total match', value: money(result.totalEmployerContributions) },
        ],
        steps: [
          'Convert your salary contribution percent into a monthly contribution.',
          'Estimate employer match from match percent and match limit.',
          'Add employee and employer contributions each month.',
          'Compound the current balance and monthly contributions using the estimated return.',
        ],
        note: 'This projection does not enforce current IRS limits or your employer plan rules.',
      };
    }
    case 'house-affordability': {
      const result = calculateHouseAffordability({
        annualIncome: parseNumber(inputs.annualIncome, 'Annual income'),
        monthlyDebts: parseNumber(inputs.monthlyDebts, 'Monthly debts'),
        downPayment: parseNumber(inputs.downPayment, 'Down payment'),
        annualRatePercent: parseNumber(inputs.annualRatePercent, 'Mortgage rate'),
        years: parseNumber(inputs.years, 'Loan term'),
        debtToIncomePercent: parseNumber(inputs.debtToIncomePercent, 'Debt-to-income target'),
        propertyTaxPercent: parseNumber(inputs.propertyTaxPercent, 'Property tax percent'),
        monthlyInsurance: parseNumber(inputs.monthlyInsurance, 'Monthly insurance'),
        monthlyHoa: parseNumber(inputs.monthlyHoa, 'Monthly HOA'),
      });

      return {
        label: 'Estimated affordable home price',
        expression: `${compactMoney(result.annualIncome)} income at ${percent(result.debtToIncomePercent)} DTI target`,
        answer: money(result.homePrice),
        metrics: [
          { label: 'Estimated loan amount', value: money(result.loanAmount) },
          { label: 'Monthly housing budget', value: money(result.maxMonthlyHousingPayment) },
          { label: 'Principal and interest', value: money(result.principalAndInterest) },
          { label: 'Estimated tax/insurance/HOA', value: money(result.monthlyPropertyTax + result.monthlyInsurance + result.monthlyHoa) },
        ],
        steps: [
          'Convert annual income to monthly income.',
          'Apply the debt-to-income target, then subtract monthly debts.',
          'Estimate principal, interest, property tax, insurance, and HOA for candidate home prices.',
          'Search for the highest home price that fits the monthly housing budget.',
        ],
        note: 'This is not mortgage approval and does not include credit, reserves, closing costs, or underwriting rules.',
      };
    }
    case 'savings': {
      const result = calculateSavingsProjection(
        parseNumber(inputs.currentSavings, 'Current savings'),
        parseNumber(inputs.monthlyDeposit, 'Monthly deposit'),
        parseNumber(inputs.annualRatePercent, 'Annual rate'),
        parseNumber(inputs.years, 'Time'),
        parseNumber(inputs.targetAmount, 'Target amount'),
      );

      return {
        label: 'Projected savings balance',
        expression: `${compactMoney(result.principal)} plus ${money(result.monthlyContribution)}/mo for ${years(result.years)}`,
        answer: money(result.endingBalance),
        metrics: [
          { label: 'Total deposits', value: money(result.totalContributions) },
          { label: 'Estimated interest', value: money(result.totalInterest) },
          { label: result.targetMet ? 'Above target' : 'Target gap', value: money(Math.abs(result.targetGap)) },
        ],
        steps: [
          'Start with current savings.',
          'Add the monthly deposit at the end of each month.',
          'Compound the balance monthly using the annual rate you entered.',
          'Compare the projected balance with your target amount.',
        ],
      };
    }
    case 'rent': {
      const result = calculateRentAffordability(
        parseNumber(inputs.monthlyIncome, 'Monthly income'),
        parseNumber(inputs.targetRentPercent, 'Target rent percent'),
        parseNumber(inputs.monthlyDebts, 'Monthly debts'),
        parseNumber(inputs.monthlyUtilities, 'Monthly utilities'),
      );

      return {
        label: 'Estimated max monthly rent',
        expression: `${percent(result.targetRentPercent)} of ${compactMoney(result.monthlyIncome)} monthly income`,
        answer: money(result.maxRent),
        metrics: [
          { label: 'Annual rent', value: money(result.annualRent) },
          { label: 'Monthly debts', value: money(result.monthlyDebts) },
          { label: 'Estimated utilities', value: money(result.monthlyUtilities) },
          { label: 'Income left after rent/debts/utilities', value: money(result.incomeAfterRentAndBills) },
        ],
        steps: [
          'Multiply monthly income by the target rent percentage.',
          'Subtract monthly debts and estimated utilities.',
          'Treat the result as a planning rent ceiling before deposits, fees, or moving costs.',
        ],
      };
    }
    case 'annuity': {
      const timing = (inputs.timing || 'ordinary') as AnnuityTiming;
      const result = calculateAnnuity(
        parseNumber(inputs.payment, 'Payment amount'),
        parseNumber(inputs.annualRatePercent, 'Annual rate'),
        parseNumber(inputs.years, 'Time'),
        parseNumber(inputs.paymentsPerYear, 'Payments per year'),
        timing,
      );

      return {
        label: 'Estimated annuity future value',
        expression: `${money(result.payment)} payments, ${result.paymentCount} total payments`,
        answer: money(result.futureValue),
        metrics: [
          { label: 'Present value', value: money(result.presentValue) },
          { label: 'Total payments', value: money(result.totalPayments) },
          { label: 'Payments', value: `${result.paymentCount}` },
          { label: 'Timing', value: result.timing === 'due' ? 'Beginning of period' : 'End of period' },
        ],
        steps: [
          'Convert the annual rate to a periodic rate based on payments per year.',
          'Calculate future value from the payment stream.',
          'Calculate present value using the same rate and payment count.',
          'Adjust for beginning-of-period payments when annuity due is selected.',
        ],
        note: 'This is a simplified annuity formula, not an insurance quote or investment recommendation.',
      };
    }
    case 'credit-card': {
      const result = calculateCreditCardPayoff({
        balance: parseNumber(inputs.balance, 'Current balance'),
        annualRatePercent: parseNumber(inputs.annualRatePercent, 'APR'),
        monthlyPayment: parseNumber(inputs.monthlyPayment, 'Monthly payment'),
        monthlyNewCharges: parseNumber(inputs.monthlyNewCharges, 'Monthly new charges'),
      });

      return {
        label: 'Estimated payoff time',
        expression: `${compactMoney(result.startingBalance)} balance at ${percent(result.annualRatePercent)} APR`,
        answer: monthCount(result.monthsToPayoff),
        metrics: [
          { label: 'Total interest', value: money(result.totalInterest) },
          { label: 'Total paid', value: money(result.totalPaid) },
          { label: 'Final payment', value: money(result.finalPayment) },
          { label: 'New charges per month', value: money(result.monthlyNewCharges) },
        ],
        steps: [
          'Convert APR to an estimated monthly interest rate.',
          'Add monthly interest and any new charges to the balance.',
          'Subtract the monthly payment.',
          'Repeat until the balance is paid off.',
        ],
        note: 'Actual credit card payoff can change with fees, daily interest, APR changes, and new purchases.',
      };
    }
    case 'pension': {
      const result = calculatePensionEstimate(
        parseNumber(inputs.finalAverageSalary, 'Final average salary'),
        parseNumber(inputs.yearsOfService, 'Years of service'),
        parseNumber(inputs.multiplierPercent, 'Benefit multiplier'),
      );

      return {
        label: 'Estimated monthly pension',
        expression: `${percent(result.multiplierPercent)} x ${formatCalculatorNumber(result.yearsOfService)} years x ${compactMoney(result.finalAverageSalary)}`,
        answer: money(result.monthlyPension),
        metrics: [
          { label: 'Estimated annual pension', value: money(result.annualPension) },
          { label: 'Replacement rate', value: percent(result.replacementRatePercent) },
          { label: 'Years of service', value: years(result.yearsOfService) },
        ],
        steps: [
          'Multiply final average salary by years of service.',
          'Multiply that result by the benefit multiplier percentage.',
          'Divide the estimated annual pension by 12 for a monthly estimate.',
          'Compare annual pension with final average salary for replacement rate.',
        ],
        note: 'Check the real plan document for vesting, service credit, survivor benefit, COLA, and tax rules.',
      };
    }
    case 'annuity-payout': {
      const result = calculateAnnuityPayout(
        parseNumber(inputs.principal, 'Starting balance'),
        parseNumber(inputs.annualRatePercent, 'Annual rate'),
        parseNumber(inputs.years, 'Payout time'),
        parseNumber(inputs.paymentsPerYear, 'Payments per year'),
      );

      return {
        label: 'Estimated payout per period',
        expression: `${compactMoney(result.principal)} over ${years(result.years)} with ${result.paymentCount} payments`,
        answer: money(result.payment),
        metrics: [
          { label: 'Total paid out', value: money(result.totalPaid) },
          { label: 'Estimated interest', value: money(result.estimatedInterest) },
          { label: 'Payments', value: `${result.paymentCount}` },
          { label: 'Payments per year', value: `${result.paymentsPerYear}` },
        ],
        steps: [
          'Convert the annual rate to a periodic rate.',
          'Use the fixed annuity payout formula to spread the balance over the payout term.',
          'Multiply payment by payment count to estimate total paid out.',
          'Estimated interest equals total payout minus starting balance.',
        ],
        note: 'This is a math estimate and not an annuity contract quote.',
      };
    }
    case 'credit-cards-payoff':
    case 'debt-payoff':
    case 'repayment': {
      const result = calculateFixedDebtPayoff({
        balance: parseNumber(inputs.balance, 'Balance'),
        annualRatePercent: parseNumber(inputs.annualRatePercent, 'Annual interest rate'),
        monthlyPayment: parseNumber(inputs.monthlyPayment, 'Monthly payment'),
        extraMonthlyPayment: parseNumber(inputs.extraMonthlyPayment, 'Extra monthly payment'),
      });
      const heading =
        variant === 'credit-cards-payoff'
          ? 'Estimated credit card payoff time'
          : variant === 'debt-payoff'
            ? 'Estimated debt payoff time'
            : 'Estimated repayment time';

      return {
        label: heading,
        expression: `${compactMoney(result.startingBalance)} at ${percent(result.annualRatePercent)} with ${money(result.monthlyPayment + result.extraMonthlyPayment)}/mo`,
        answer: monthCount(result.monthsToPayoff),
        metrics: [
          { label: 'Total interest', value: money(result.totalInterest) },
          { label: 'Total paid', value: money(result.totalPaid) },
          { label: 'Base monthly payment', value: money(result.monthlyPayment) },
          { label: 'Extra monthly payment', value: money(result.extraMonthlyPayment) },
        ],
        steps: [
          'Convert the annual interest rate to a monthly rate.',
          'Add monthly interest to the remaining balance.',
          'Subtract the base payment plus any extra monthly amount.',
          'Repeat until the balance reaches zero, then add up interest and total paid.',
        ],
        note: 'Real balances can change with fees, payment timing, minimum-payment rules, collections, or new charges.',
      };
    }
    case 'debt-consolidation': {
      const result = calculateDebtConsolidation({
        totalDebt: parseNumber(inputs.totalDebt, 'Total debt'),
        currentAnnualRatePercent: parseNumber(inputs.currentAnnualRatePercent, 'Current average rate'),
        currentMonthlyPayment: parseNumber(inputs.currentMonthlyPayment, 'Current monthly payment'),
        newAnnualRatePercent: parseNumber(inputs.newAnnualRatePercent, 'New loan rate'),
        newYears: parseNumber(inputs.newYears, 'New loan term'),
        fees: parseNumber(inputs.fees, 'Fees'),
      });

      return {
        label: 'Estimated new monthly payment',
        expression: `${compactMoney(result.newPrincipal)} consolidated at ${percent(result.consolidationLoan.annualRatePercent)}`,
        answer: money(result.consolidationLoan.monthlyPayment),
        metrics: [
          { label: 'Current payoff time', value: monthCount(result.currentDebt.monthsToPayoff) },
          { label: 'Monthly payment change', value: money(result.monthlyPaymentChange) },
          { label: 'Total cost change', value: money(result.totalCostChange) },
          { label: 'Fees added', value: money(result.fees) },
        ],
        steps: [
          'Estimate current payoff using the current average rate and monthly payment.',
          'Add any fees to the new consolidated loan principal.',
          'Estimate the new fixed loan payment over the new term.',
          'Compare monthly payment and total paid between the two scenarios.',
        ],
        note: 'A lower payment can still cost more if the new term is much longer.',
      };
    }
    case 'student-loan': {
      const principal = parseNumber(inputs.principal, 'Loan balance');
      const annualRatePercent = parseNumber(inputs.annualRatePercent, 'Interest rate');
      const loanYears = parseNumber(inputs.years, 'Repayment term');
      const extraMonthlyPayment = parseNumber(inputs.extraMonthlyPayment, 'Extra monthly payment');
      const scheduled = calculateLoanSummary(principal, annualRatePercent, loanYears);
      const payoff = calculateAmortizationSummary(principal, annualRatePercent, loanYears, extraMonthlyPayment);

      return {
        label: 'Estimated student loan payment',
        expression: `${compactMoney(principal)} at ${percent(annualRatePercent)} for ${years(loanYears)}`,
        answer: money(scheduled.monthlyPayment),
        metrics: [
          { label: 'Monthly paid with extra', value: money(payoff.monthlyPayment) },
          { label: 'Estimated payoff time', value: monthCount(payoff.monthsToPayoff) },
          { label: 'Total interest', value: money(payoff.totalInterest) },
          { label: 'Interest saved', value: money(payoff.interestSaved) },
        ],
        steps: [
          'Calculate the scheduled fixed monthly payment from balance, rate, and term.',
          'Add any extra monthly amount to the scheduled payment.',
          'Simulate monthly interest and principal reduction.',
          'Compare payoff time and interest with the scheduled repayment term.',
        ],
        note: 'Federal loan options can include income-driven repayment, deferment, forbearance, and forgiveness rules not modeled here.',
      };
    }
    case 'college-cost': {
      const result = calculateCollegeCost({
        currentAnnualCost: parseNumber(inputs.currentAnnualCost, 'Current annual cost'),
        yearsUntilStart: parseNumber(inputs.yearsUntilStart, 'Years until start'),
        yearsInSchool: parseNumber(inputs.yearsInSchool, 'Years in school'),
        annualCostIncreasePercent: parseNumber(inputs.annualCostIncreasePercent, 'Annual cost increase'),
        currentSavings: parseNumber(inputs.currentSavings, 'Current savings'),
        monthlySavings: parseNumber(inputs.monthlySavings, 'Monthly savings'),
        annualSavingsReturnPercent: parseNumber(inputs.annualSavingsReturnPercent, 'Savings return'),
      });

      return {
        label: 'Estimated total college cost',
        expression: `${compactMoney(result.currentAnnualCost)} today, starting in ${years(result.yearsUntilStart)}`,
        answer: money(result.totalEstimatedCost),
        metrics: [
          { label: 'First year estimate', value: money(result.firstYearCost) },
          { label: 'Projected savings', value: money(result.projectedSavings) },
          { label: result.savingsGap > 0 ? 'Savings gap' : 'Savings surplus', value: money(Math.abs(result.savingsGap)) },
          { label: 'Years in school', value: years(result.yearsInSchool) },
        ],
        steps: [
          'Grow today’s annual cost by the yearly cost increase until school starts.',
          'Add each school year, increasing the cost year by year.',
          'Project current savings and monthly savings until the start year.',
          'Compare projected savings with total estimated school cost.',
        ],
        note: 'Financial aid, scholarships, grants, tax credits, housing, and school-specific costs can change the real amount.',
      };
    }
    case 'simple-interest': {
      const principal = parseNumber(inputs.principal, 'Principal');
      const annualRatePercent = parseNumber(inputs.annualRatePercent, 'Annual rate');
      const interestYears = parseNumber(inputs.years, 'Time');
      const result = calculateSimpleInterest(principal, annualRatePercent, interestYears);

      return {
        label: 'Simple interest',
        expression: `${compactMoney(principal)} x ${percent(annualRatePercent)} x ${years(interestYears)}`,
        answer: money(result.interest),
        metrics: [
          { label: 'Ending balance', value: money(result.endingBalance) },
          { label: 'Principal', value: money(result.principal) },
          { label: 'Time', value: years(result.years) },
        ],
        steps: [
          `Convert ${percent(annualRatePercent)} to decimal rate ${formatCalculatorNumber(annualRatePercent / 100)}.`,
          'Multiply principal by annual rate and time.',
          'Add simple interest to principal for the ending balance.',
        ],
      };
    }
    case 'cd': {
      const result = calculateCdEstimate(
        parseNumber(inputs.principal, 'Deposit amount'),
        parseNumber(inputs.annualPercentageYield, 'APY'),
        parseNumber(inputs.termMonths, 'Term months'),
        parseNumber(inputs.earlyWithdrawalPenaltyMonths, 'Penalty months of interest'),
      );

      return {
        label: 'Estimated value at maturity',
        expression: `${compactMoney(result.principal)} at ${percent(result.annualPercentageYield)} APY for ${monthCount(result.termMonths)}`,
        answer: money(result.maturityValue),
        metrics: [
          { label: 'Interest earned', value: money(result.interestEarned) },
          { label: 'Early withdrawal penalty estimate', value: money(result.earlyWithdrawalPenalty) },
          { label: 'Value after penalty estimate', value: money(result.valueAfterPenalty) },
        ],
        steps: [
          'Apply APY growth over the CD term.',
          'Subtract principal from maturity value to estimate interest earned.',
          'Estimate early withdrawal penalty as months of simple interest.',
          'Subtract that penalty from maturity value for the penalty scenario.',
        ],
        note: 'Bank CD disclosures control the actual APY, compounding, maturity date, renewal, and early withdrawal penalty.',
      };
    }
    case 'bond': {
      const result = calculateBondEstimate(
        parseNumber(inputs.faceValue, 'Face value'),
        parseNumber(inputs.marketPrice, 'Market price'),
        parseNumber(inputs.couponRatePercent, 'Coupon rate'),
        parseNumber(inputs.yearsToMaturity, 'Years to maturity'),
        parseNumber(inputs.paymentsPerYear, 'Coupon payments per year'),
      );

      return {
        label: 'Approximate yield to maturity',
        expression: `${compactMoney(result.faceValue)} face value, ${compactMoney(result.marketPrice)} market price`,
        answer: percent(result.approximateYieldToMaturityPercent),
        metrics: [
          { label: 'Annual coupon', value: money(result.annualCoupon) },
          { label: 'Total coupon payments', value: money(result.totalCouponPayments) },
          { label: 'Current yield', value: percent(result.currentYieldPercent) },
          { label: 'Coupon payments per year', value: `${result.paymentsPerYear}` },
        ],
        steps: [
          'Multiply face value by coupon rate to estimate annual coupon income.',
          'Divide annual coupon by market price for current yield.',
          'Use the gain or loss from market price to face value across years to maturity.',
          'Combine coupon income and price change for an approximate yield-to-maturity estimate.',
        ],
        note: 'This is an approximate yield formula and does not price callable bonds, reinvestment, taxes, credit risk, or market risk.',
      };
    }
    case 'mutual-fund': {
      const result = calculateMutualFundEstimate(
        parseNumber(inputs.principal, 'Initial investment'),
        parseNumber(inputs.monthlyContribution, 'Monthly contribution'),
        parseNumber(inputs.annualReturnPercent, 'Estimated annual return'),
        parseNumber(inputs.expenseRatioPercent, 'Expense ratio'),
        parseNumber(inputs.years, 'Time'),
      );

      return {
        label: 'Projected fund balance after expenses',
        expression: `${compactMoney(result.principal)} plus ${money(result.monthlyContribution)}/mo for ${years(result.years)}`,
        answer: money(result.endingBalance),
        metrics: [
          { label: 'Balance before expense estimate', value: money(result.grossEndingBalance) },
          { label: 'Estimated expense drag', value: money(result.estimatedExpenseDrag) },
          { label: 'Total contributions', value: money(result.totalContributions) },
          { label: 'Net annual return used', value: percent(result.annualRatePercent) },
        ],
        steps: [
          'Project the balance with the annual return before expenses.',
          'Subtract the expense ratio from the return assumption for a simple net-return estimate.',
          'Project the balance again with the net return.',
          'Compare the two balances to estimate expense drag.',
        ],
        note: 'Actual fund returns, taxes, distributions, loads, and fees vary and are not guaranteed.',
      };
    }
    case 'roth-ira':
    case 'ira': {
      const result = calculateIraProjection(
        parseNumber(inputs.currentBalance, 'Current balance'),
        parseNumber(inputs.annualContribution, 'Annual contribution'),
        parseNumber(inputs.annualReturnPercent, 'Estimated annual return'),
        parseNumber(inputs.years, 'Years to grow'),
      );

      return {
        label: variant === 'roth-ira' ? 'Projected Roth IRA balance' : 'Projected IRA balance',
        expression: `${compactMoney(result.principal)} plus ${money(result.monthlyContribution)}/mo for ${years(result.years)}`,
        answer: money(result.endingBalance),
        metrics: [
          { label: 'Total contributions', value: money(result.totalContributions) },
          { label: 'Estimated growth', value: money(result.totalInterest) },
          { label: 'Annual contribution', value: money(result.monthlyContribution * 12) },
        ],
        steps: [
          'Convert the annual contribution to a monthly contribution for the projection.',
          'Compound the current balance monthly using the estimated return.',
          'Add monthly contributions at the end of each month.',
          'Separate total contributions from estimated growth.',
        ],
        note: 'This does not check IRS contribution limits, eligibility, deductions, tax treatment, penalties, or required distributions.',
      };
    }
    case 'vat': {
      const amount = parseNumber(inputs.amount, 'Amount');
      const vatPercent = parseNumber(inputs.vatPercent, 'VAT rate');
      const mode = (inputs.mode || 'add') as VatMode;
      const result = calculateVat(amount, vatPercent, mode);

      return {
        label: mode === 'add' ? 'Gross amount with VAT' : 'Net amount before VAT',
        expression: mode === 'add' ? `${compactMoney(amount)} plus ${percent(vatPercent)} VAT` : `${compactMoney(amount)} gross with ${percent(vatPercent)} VAT included`,
        answer: mode === 'add' ? money(result.grossAmount) : money(result.netAmount),
        metrics: [
          { label: 'VAT amount', value: money(result.vatAmount) },
          { label: 'Net amount', value: money(result.netAmount) },
          { label: 'Gross amount', value: money(result.grossAmount) },
          { label: 'Rate used', value: percent(result.vatPercent) },
        ],
        steps: [
          `Convert ${percent(vatPercent)} to decimal rate ${formatCalculatorNumber(vatPercent / 100)}.`,
          mode === 'add' ? 'Multiply net amount by the rate to find VAT.' : 'Divide the gross amount by one plus the VAT rate to find net amount.',
          'Gross amount equals net amount plus VAT amount.',
        ],
        note: 'VAT rules, exemptions, invoices, and reporting requirements vary by country and transaction type.',
      };
    }
    case 'cash-back-low-interest': {
      const result = calculateCashBackLowInterest({
        purchaseAmount: parseNumber(inputs.purchaseAmount, 'Purchase amount'),
        payoffMonths: parseNumber(inputs.payoffMonths, 'Payoff months'),
        cashBackPercent: parseNumber(inputs.cashBackPercent, 'Cash back percent'),
        cashBackAprPercent: parseNumber(inputs.cashBackAprPercent, 'APR with cash back'),
        lowInterestAprPercent: parseNumber(inputs.lowInterestAprPercent, 'Low-interest APR'),
      });
      const betterLabel = result.betterOption === 'cash-back' ? 'Cash back offer' : 'Low-interest offer';

      return {
        label: 'Estimated better offer',
        expression: `${compactMoney(result.purchaseAmount)} over ${monthCount(result.payoffMonths)}`,
        answer: betterLabel,
        metrics: [
          { label: 'Estimated savings', value: money(result.savings) },
          { label: 'Cash back value', value: money(result.cashBackValue) },
          { label: 'Cash back net cost', value: money(result.cashBackTotalCost) },
          { label: 'Low-interest total cost', value: money(result.lowInterestTotalCost) },
        ],
        steps: [
          'Estimate the loan payment and total paid with the cash-back APR.',
          'Subtract the cash-back value from that total paid.',
          'Estimate the loan payment and total paid with the low-interest APR.',
          'Choose the lower estimated total cost.',
        ],
        note: 'Dealer incentives can have eligibility rules, model limits, fees, tax treatment, and offer dates that this calculator does not check.',
      };
    }
    case 'auto-lease': {
      const result = calculateAutoLease({
        vehiclePrice: parseNumber(inputs.vehiclePrice, 'Vehicle price'),
        downPayment: parseNumber(inputs.downPayment, 'Down payment'),
        tradeIn: parseNumber(inputs.tradeIn, 'Trade-in value'),
        residualValue: parseNumber(inputs.residualValue, 'Residual value'),
        moneyFactor: parseNumber(inputs.moneyFactor, 'Money factor'),
        termMonths: parseNumber(inputs.termMonths, 'Lease term'),
        taxPercent: parseNumber(inputs.taxPercent, 'Tax rate'),
        fees: parseNumber(inputs.fees, 'Fees'),
      });

      return {
        label: 'Estimated monthly lease payment',
        expression: `${compactMoney(result.vehiclePrice)} vehicle, ${monthCount(result.termMonths)} lease`,
        answer: money(result.monthlyPayment),
        metrics: [
          { label: 'Adjusted capitalized cost', value: money(result.adjustedCapitalizedCost) },
          { label: 'Depreciation fee', value: money(result.depreciationFee) },
          { label: 'Finance fee', value: money(result.financeFee) },
          { label: 'Estimated total lease cost', value: money(result.totalLeaseCost) },
        ],
        steps: [
          'Add fees to vehicle price, then subtract down payment and trade-in value.',
          'Spread the difference between adjusted cost and residual value across the lease term.',
          'Estimate the monthly finance fee with the money factor.',
          'Add tax to the pretax payment.',
        ],
        note: 'Lease contracts can add acquisition, disposition, mileage, wear, registration, and early termination charges.',
      };
    }
    case 'depreciation': {
      const method = (inputs.method || 'straight-line') as DepreciationMethod;
      const result = calculateDepreciationEstimate({
        cost: parseNumber(inputs.cost, 'Original cost'),
        salvageValue: parseNumber(inputs.salvageValue, 'Salvage value'),
        lifeYears: parseNumber(inputs.lifeYears, 'Useful life'),
        ageYears: parseNumber(inputs.ageYears, 'Age'),
        method,
        decliningRatePercent: parseNumber(inputs.decliningRatePercent, 'Declining balance rate'),
      });

      return {
        label: 'Estimated book value',
        expression: `${compactMoney(result.cost)} ${method === 'straight-line' ? 'straight-line' : 'declining-balance'} depreciation`,
        answer: money(result.bookValue),
        metrics: [
          { label: 'Accumulated depreciation', value: money(result.accumulatedDepreciation) },
          { label: 'Annual depreciation estimate', value: money(result.annualDepreciation) },
          { label: 'Salvage value', value: money(result.salvageValue) },
          { label: 'Age used', value: years(result.ageYears) },
        ],
        steps: [
          'Subtract salvage value from cost to find depreciable amount.',
          method === 'straight-line' ? 'Divide depreciable amount by useful life for annual depreciation.' : 'Apply the declining balance rate to the remaining book value each year.',
          'Cap depreciation so book value does not fall below salvage value.',
        ],
        note: 'Tax depreciation can use specific rules and schedules that are not modeled here.',
      };
    }
    case 'average-return': {
      const result = calculateAverageReturn({
        beginningValue: parseNumber(inputs.beginningValue, 'Beginning value'),
        endingValue: parseNumber(inputs.endingValue, 'Ending value'),
        years: parseNumber(inputs.years, 'Time'),
        contributions: parseNumber(inputs.contributions, 'Contributions'),
        withdrawals: parseNumber(inputs.withdrawals, 'Withdrawals'),
      });

      return {
        label: 'Average annual return',
        expression: `${compactMoney(result.beginningValue)} to ${compactMoney(result.endingValue)} over ${years(result.years)}`,
        answer: percent(result.averageAnnualReturnPercent),
        metrics: [
          { label: 'Cumulative return', value: percent(result.cumulativeReturnPercent) },
          { label: 'CAGR estimate', value: percent(result.cagrPercent) },
          { label: 'Net gain', value: money(result.netGain) },
          { label: 'Contributions adjusted', value: money(result.contributions) },
        ],
        steps: [
          'Add withdrawals back to ending value, then subtract beginning value and contributions.',
          'Divide net gain by beginning value plus contributions for cumulative return.',
          'Divide cumulative return by years for simple average annual return.',
          'Also show CAGR from beginning value to ending value for a growth-rate comparison.',
        ],
        note: 'This is not a time-weighted or money-weighted return and does not include taxes, fees, or risk.',
      };
    }
    case 'margin': {
      const result = calculateMarginEstimate(
        parseNumber(inputs.revenue, 'Revenue'),
        parseNumber(inputs.cost, 'Cost'),
      );

      return {
        label: 'Profit margin',
        expression: `${compactMoney(result.revenue)} revenue - ${compactMoney(result.cost)} cost`,
        answer: percent(result.marginPercent),
        metrics: [
          { label: 'Profit', value: money(result.profit) },
          { label: 'Markup', value: percent(result.markupPercent) },
          { label: 'Revenue', value: money(result.revenue) },
          { label: 'Cost', value: money(result.cost) },
        ],
        steps: [
          'Subtract cost from revenue to find profit.',
          'Divide profit by revenue to calculate profit margin.',
          'Divide profit by cost to calculate markup.',
        ],
        note: 'This is business profit-margin math, not brokerage margin or borrowed-money investing advice.',
      };
    }
    case 'ad-revenue': {
      const result = calculateAdRevenueEstimate({
        dailyPageViews: parseNumber(inputs.dailyPageViews, 'Daily page views'),
        pageCtrPercent: parseNumber(inputs.pageCtrPercent, 'Page CTR'),
        averageCpc: parseNumber(inputs.averageCpc, 'Average CPC'),
      });

      return {
        label: 'Estimated monthly ad revenue',
        expression: `${formatCalculatorNumber(result.dailyPageViews)} views/day x ${percent(result.pageCtrPercent)} CTR x ${money(result.averageCpc)} CPC`,
        answer: money(result.monthlyRevenue),
        metrics: [
          { label: 'Daily revenue', value: money(result.dailyRevenue) },
          { label: 'Annual revenue', value: money(result.annualRevenue) },
          { label: 'Estimated clicks per day', value: formatCalculatorNumber(result.estimatedClicks) },
          { label: 'Page RPM estimate', value: money(result.pageRpm) },
        ],
        steps: [
          'Multiply daily page views by page CTR to estimate daily ad clicks.',
          'Multiply estimated clicks by average CPC to estimate daily revenue.',
          'Multiply daily revenue by the average days in a month for monthly revenue.',
          'Divide daily revenue by page views, then multiply by 1,000 for page RPM.',
        ],
        note: 'This is a traffic and ad-rate estimate only. Real ad revenue can change with ad placement, policy status, invalid traffic, country mix, seasonality, and advertiser demand.',
      };
    }
    case 'break-even': {
      const result = calculateBreakEven({
        fixedCosts: parseNumber(inputs.fixedCosts, 'Fixed costs'),
        pricePerUnit: parseNumber(inputs.pricePerUnit, 'Price per unit'),
        variableCostPerUnit: parseNumber(inputs.variableCostPerUnit, 'Variable cost per unit'),
      });

      return {
        label: 'Break-even units',
        expression: `${compactMoney(result.fixedCosts)} fixed costs / ${money(result.contributionMarginPerUnit)} contribution`,
        answer: formatCalculatorNumber(result.breakEvenUnits),
        metrics: [
          { label: 'Break-even sales', value: money(result.breakEvenSales) },
          { label: 'Contribution per unit', value: money(result.contributionMarginPerUnit) },
          { label: 'Contribution margin ratio', value: percent(result.contributionMarginRatioPercent) },
          { label: 'Price per unit', value: money(result.pricePerUnit) },
        ],
        steps: [
          'Subtract variable cost per unit from price per unit to find contribution margin per unit.',
          'Divide fixed costs by contribution margin per unit.',
          'Multiply break-even units by price per unit to estimate break-even sales.',
        ],
        note: 'This is a planning estimate. Real break-even can move when refunds, discounts, taxes, capacity, or mixed product sales change.',
      };
    }
    case 'markup': {
      const result = calculateMarkupPrice({
        unitCost: parseNumber(inputs.unitCost, 'Unit cost'),
        markupPercent: parseNumber(inputs.markupPercent, 'Markup percent'),
        units: parseNumber(inputs.units, 'Units'),
      });

      return {
        label: 'Selling price per unit',
        expression: `${compactMoney(result.unitCost)} cost with ${percent(result.markupPercent)} markup`,
        answer: money(result.sellingPricePerUnit),
        metrics: [
          { label: 'Profit per unit', value: money(result.profitPerUnit) },
          { label: 'Margin from that price', value: percent(result.marginPercent) },
          { label: 'Total revenue', value: money(result.totalRevenue) },
          { label: 'Total profit', value: money(result.totalProfit) },
        ],
        steps: [
          'Convert markup percent to a multiplier.',
          'Multiply unit cost by one plus markup percent.',
          'Subtract cost from selling price for profit per unit.',
          'Multiply by units to show total revenue and profit.',
        ],
        note: 'Markup is based on cost. Margin is based on selling price, so the two percentages are not the same number.',
      };
    }
    case 'profit-goal': {
      const result = calculateProfitGoal({
        fixedCosts: parseNumber(inputs.fixedCosts, 'Fixed costs'),
        targetProfit: parseNumber(inputs.targetProfit, 'Target profit'),
        pricePerUnit: parseNumber(inputs.pricePerUnit, 'Price per unit'),
        variableCostPerUnit: parseNumber(inputs.variableCostPerUnit, 'Variable cost per unit'),
      });

      return {
        label: 'Units needed for goal',
        expression: `${compactMoney(result.fixedCosts + result.targetProfit)} needed / ${money(result.contributionMarginPerUnit)} contribution`,
        answer: formatCalculatorNumber(result.requiredUnits),
        metrics: [
          { label: 'Required sales', value: money(result.requiredSales) },
          { label: 'Contribution per unit', value: money(result.contributionMarginPerUnit) },
          { label: 'Fixed costs', value: money(result.fixedCosts) },
          { label: 'Target profit', value: money(result.targetProfit) },
        ],
        steps: [
          'Add target profit to fixed costs.',
          'Subtract variable cost per unit from price per unit.',
          'Divide the total money goal by contribution margin per unit.',
          'Multiply required units by price per unit for required sales.',
        ],
        note: 'This does not check whether that many units can actually be produced, sold, shipped, or supported.',
      };
    }
    case 'liquidity-ratios': {
      const result = calculateLiquidityRatios({
        currentAssets: parseNumber(inputs.currentAssets, 'Current assets'),
        currentLiabilities: parseNumber(inputs.currentLiabilities, 'Current liabilities'),
        inventory: parseNumber(inputs.inventory, 'Inventory'),
        prepaidExpenses: parseNumber(inputs.prepaidExpenses, 'Prepaid expenses'),
        cashAndEquivalents: parseNumber(inputs.cashAndEquivalents, 'Cash and equivalents'),
        marketableSecurities: parseNumber(inputs.marketableSecurities, 'Marketable securities'),
        accountsReceivable: parseNumber(inputs.accountsReceivable, 'Accounts receivable'),
      });

      return {
        label: 'Current ratio',
        expression: `${compactMoney(result.currentAssets)} current assets / ${compactMoney(result.currentLiabilities)} current liabilities`,
        answer: `${formatCalculatorNumber(result.currentRatio)}x`,
        metrics: [
          { label: 'Working capital', value: money(result.workingCapital) },
          { label: 'Quick ratio', value: `${formatCalculatorNumber(result.quickRatio)}x` },
          { label: 'Cash ratio', value: `${formatCalculatorNumber(result.cashRatio)}x` },
          { label: 'Accounts receivable entered', value: money(result.accountsReceivable) },
        ],
        steps: [
          'Divide current assets by current liabilities for current ratio.',
          'Subtract inventory and prepaid expenses from current assets for quick assets.',
          'Divide cash plus marketable securities by current liabilities for cash ratio.',
          'Subtract current liabilities from current assets for working capital.',
        ],
        note: 'Liquidity ratios are only as good as the balance sheet numbers entered and do not prove that cash will arrive on time.',
      };
    }
    case 'debt-ratios': {
      const result = calculateDebtRatios({
        totalDebt: parseNumber(inputs.totalDebt, 'Total debt'),
        totalAssets: parseNumber(inputs.totalAssets, 'Total assets'),
        totalEquity: parseNumber(inputs.totalEquity, 'Total equity'),
        ebit: parseNumber(inputs.ebit, 'EBIT'),
        interestExpense: parseNumber(inputs.interestExpense, 'Interest expense'),
      });

      return {
        label: 'Debt ratio',
        expression: `${compactMoney(result.totalDebt)} debt / ${compactMoney(result.totalAssets)} assets`,
        answer: percent(result.debtRatioPercent),
        metrics: [
          { label: 'Debt-to-equity', value: `${formatCalculatorNumber(result.debtToEquityRatio)}x` },
          { label: 'Times interest earned', value: `${formatCalculatorNumber(result.timesInterestEarned)}x` },
          { label: 'Total equity', value: money(result.totalEquity) },
          { label: 'Interest expense', value: money(result.interestExpense) },
        ],
        steps: [
          'Divide total debt by total assets for debt ratio.',
          'Divide total debt by total equity for debt-to-equity ratio.',
          'Divide EBIT by interest expense for times interest earned.',
        ],
        note: 'Debt ratios need context such as industry, maturity dates, cash flow quality, lease obligations, and interest-rate changes.',
      };
    }
    case 'operations-ratios': {
      const result = calculateOperationsRatios({
        costOfGoodsSold: parseNumber(inputs.costOfGoodsSold, 'Cost of goods sold'),
        beginningInventory: parseNumber(inputs.beginningInventory, 'Beginning inventory'),
        endingInventory: parseNumber(inputs.endingInventory, 'Ending inventory'),
        netSales: parseNumber(inputs.netSales, 'Net sales'),
        averageTotalAssets: parseNumber(inputs.averageTotalAssets, 'Average total assets'),
        netCreditSales: parseNumber(inputs.netCreditSales, 'Net credit sales'),
        averageAccountsReceivable: parseNumber(inputs.averageAccountsReceivable, 'Average accounts receivable'),
        totalAssets: parseNumber(inputs.totalAssets, 'Total assets'),
        totalEquity: parseNumber(inputs.totalEquity, 'Total equity'),
      });

      return {
        label: 'Inventory turnover',
        expression: `${compactMoney(result.costOfGoodsSold)} COGS / ${compactMoney(result.averageInventory)} average inventory`,
        answer: `${formatCalculatorNumber(result.inventoryTurnover)}x`,
        metrics: [
          { label: 'Asset turnover', value: `${formatCalculatorNumber(result.assetTurnover)}x` },
          { label: 'Receivables turnover', value: `${formatCalculatorNumber(result.receivablesTurnover)}x` },
          { label: 'Average collection period', value: `${formatCalculatorNumber(result.averageCollectionPeriodDays)} days` },
          { label: 'Equity multiplier', value: `${formatCalculatorNumber(result.equityMultiplier)}x` },
        ],
        steps: [
          'Average beginning and ending inventory.',
          'Divide cost of goods sold by average inventory.',
          'Divide net sales by average total assets for asset turnover.',
          'Divide net credit sales by average accounts receivable for receivables turnover.',
          'Divide total assets by total equity for equity multiplier.',
        ],
        note: 'Operations ratios can swing with seasonality, inventory method, collection policy, and one-time balance sheet changes.',
      };
    }
    case 'profitability-ratios': {
      const result = calculateProfitabilityRatios({
        netSales: parseNumber(inputs.netSales, 'Net sales'),
        costOfGoodsSold: parseNumber(inputs.costOfGoodsSold, 'Cost of goods sold'),
        operatingIncome: parseNumber(inputs.operatingIncome, 'Operating income'),
        netIncome: parseNumber(inputs.netIncome, 'Net income'),
        averageAssets: parseNumber(inputs.averageAssets, 'Average assets'),
        averageEquity: parseNumber(inputs.averageEquity, 'Average equity'),
        sharesOutstanding: parseNumber(inputs.sharesOutstanding, 'Shares outstanding'),
        pricePerShare: parseNumber(inputs.pricePerShare, 'Price per share'),
      });

      return {
        label: 'Net profit margin',
        expression: `${compactMoney(result.netIncome)} net income / ${compactMoney(result.netSales)} net sales`,
        answer: percent(result.netProfitMarginPercent),
        metrics: [
          { label: 'Gross margin', value: percent(result.grossMarginPercent) },
          { label: 'Operating margin', value: percent(result.operatingMarginPercent) },
          { label: 'Return on assets', value: percent(result.returnOnAssetsPercent) },
          { label: 'Return on equity', value: percent(result.returnOnEquityPercent) },
          { label: 'Earnings per share', value: money(result.earningsPerShare) },
          { label: 'Price-to-earnings', value: `${formatCalculatorNumber(result.priceEarningsRatio)}x` },
        ],
        steps: [
          'Subtract cost of goods sold from net sales for gross profit.',
          'Divide gross profit, operating income, and net income by net sales for margins.',
          'Divide net income by average assets and average equity for return ratios.',
          'Divide net income by shares outstanding for EPS, then compare price to EPS.',
        ],
        note: 'Profitability ratios need context. Different industries can have very different normal margins, asset bases, and capital structures.',
      };
    }
    case 'stock-ratios': {
      const result = calculateStockRatios({
        stockPrice: parseNumber(inputs.stockPrice, 'Stock price'),
        earningsPerShare: parseNumber(inputs.earningsPerShare, 'Earnings per share'),
        salesPerShare: parseNumber(inputs.salesPerShare, 'Sales per share'),
        bookValuePerShare: parseNumber(inputs.bookValuePerShare, 'Book value per share'),
        dividendPerShare: parseNumber(inputs.dividendPerShare, 'Dividend per share'),
      });

      return {
        label: 'Price-to-earnings ratio',
        expression: `${money(result.stockPrice)} price / ${money(result.earningsPerShare)} EPS`,
        answer: `${formatCalculatorNumber(result.priceEarningsRatio)}x`,
        metrics: [
          { label: 'Price-to-sales', value: `${formatCalculatorNumber(result.priceSalesRatio)}x` },
          { label: 'Price-to-book', value: `${formatCalculatorNumber(result.priceBookRatio)}x` },
          { label: 'Dividend yield', value: percent(result.dividendYieldPercent) },
          { label: 'Payout ratio', value: percent(result.payoutRatioPercent) },
        ],
        steps: [
          'Divide stock price by earnings per share for P/E.',
          'Divide stock price by sales per share for price-to-sales.',
          'Divide stock price by book value per share for price-to-book.',
          'Divide dividend per share by stock price for dividend yield.',
          'Divide dividend per share by EPS for payout ratio.',
        ],
        note: 'Stock ratios do not say whether a stock is good or bad. Growth, debt, risk, accounting quality, and future expectations matter too.',
      };
    }
    case 'discount': {
      const result = calculateDiscountEstimate({
        originalPrice: parseNumber(inputs.originalPrice, 'Original price'),
        discountPercent: parseNumber(inputs.discountPercent, 'Discount percent'),
        extraDiscountPercent: parseNumber(inputs.extraDiscountPercent, 'Extra discount percent'),
        taxPercent: parseNumber(inputs.taxPercent, 'Tax rate'),
      });

      return {
        label: 'Final price after discount',
        expression: `${compactMoney(result.originalPrice)} less ${percent(result.discountPercent)} and ${percent(result.extraDiscountPercent)} extra`,
        answer: money(result.finalPrice),
        metrics: [
          { label: 'Total savings before tax', value: money(result.totalSavings) },
          { label: 'Effective discount', value: percent(result.effectiveDiscountPercent) },
          { label: 'Subtotal after discounts', value: money(result.subtotalAfterDiscounts) },
          { label: 'Tax amount', value: money(result.taxAmount) },
        ],
        steps: [
          'Apply the first discount to the original price.',
          'Apply the extra discount to the already-discounted subtotal.',
          'Add tax to the discounted subtotal if a tax rate is entered.',
        ],
      };
    }
    case 'business-loan':
    case 'personal-loan': {
      const result = calculateBusinessLoan({
        principal: parseNumber(inputs.principal, 'Loan amount'),
        annualRatePercent: parseNumber(inputs.annualRatePercent, 'Interest rate'),
        years: parseNumber(inputs.years, 'Loan term'),
        originationFeePercent: parseNumber(inputs.originationFeePercent, 'Origination fee'),
      });
      const label = variant === 'business-loan' ? 'Estimated business loan payment' : 'Estimated personal loan payment';

      return {
        label,
        expression: `${compactMoney(result.principal)} at ${percent(result.annualRatePercent)} for ${years(result.years)}`,
        answer: money(result.monthlyPayment),
        metrics: [
          { label: 'Total paid', value: money(result.totalPaid) },
          { label: 'Total interest', value: money(result.totalInterest) },
          { label: 'Origination fee', value: money(result.originationFee) },
          { label: 'Cash received after fee', value: money(result.cashReceived) },
        ],
        steps: [
          'Use the fixed-payment loan formula for monthly payment.',
          'Multiply the loan amount by the origination fee percent.',
          'Subtract the fee from principal to estimate cash received when the fee is taken upfront.',
          'Add interest and fee context when comparing offers.',
        ],
        note: 'APR, fees, underwriting, collateral, and repayment terms can change the real loan cost.',
      };
    }
    case 'debt-to-income': {
      const result = calculateDebtToIncome(
        parseNumber(inputs.monthlyIncome, 'Monthly income'),
        parseNumber(inputs.monthlyDebtPayments, 'Monthly debt payments'),
        parseNumber(inputs.proposedHousingPayment, 'Proposed housing payment'),
      );

      return {
        label: 'Debt-to-income ratio',
        expression: `${compactMoney(result.totalMonthlyDebt)} monthly debt / ${compactMoney(result.monthlyIncome)} income`,
        answer: percent(result.debtToIncomePercent),
        metrics: [
          { label: 'Total monthly debt', value: money(result.totalMonthlyDebt) },
          { label: 'Existing debt payments', value: money(result.monthlyDebtPayments) },
          { label: 'Proposed housing payment', value: money(result.proposedHousingPayment) },
          { label: 'Income after listed debts', value: money(result.remainingIncome) },
        ],
        steps: [
          'Add existing monthly debt payments and proposed housing payment.',
          'Divide that total by gross monthly income.',
          'Convert the result to a percentage.',
        ],
        note: 'Lenders can count income and debts differently, so this is a planning ratio only.',
      };
    }
    case 'boat-loan': {
      const result = calculateAutoLoanSummary({
        purchasePrice: parseNumber(inputs.purchasePrice, 'Boat price'),
        downPayment: parseNumber(inputs.downPayment, 'Down payment'),
        tradeIn: parseNumber(inputs.tradeIn, 'Trade-in value'),
        fees: parseNumber(inputs.fees, 'Fees'),
        salesTaxPercent: parseNumber(inputs.salesTaxPercent, 'Sales tax rate'),
        annualRatePercent: parseNumber(inputs.annualRatePercent, 'Interest rate'),
        years: parseNumber(inputs.years, 'Loan term'),
      });

      return {
        label: 'Estimated boat loan payment',
        expression: `${compactMoney(result.amountFinanced)} financed at ${percent(result.annualRatePercent)} for ${years(result.years)}`,
        answer: money(result.monthlyPayment),
        metrics: [
          { label: 'Amount financed', value: money(result.amountFinanced) },
          { label: 'Sales tax', value: money(result.salesTax) },
          { label: 'Total interest', value: money(result.totalInterest) },
          { label: 'Total paid', value: money(result.totalPaid) },
        ],
        steps: [
          'Estimate taxable amount from boat price minus trade-in value.',
          'Add sales tax and fees, then subtract down payment and trade-in value.',
          'Use the amount financed in the fixed-payment loan formula.',
          'Total interest equals total paid minus amount financed.',
        ],
        note: 'This does not include storage, maintenance, registration, insurance, inspections, or marina costs.',
      };
    }
    case 'lease': {
      const result = calculateAssetLease({
        assetValue: parseNumber(inputs.assetValue, 'Asset value'),
        residualValue: parseNumber(inputs.residualValue, 'Residual value'),
        annualRatePercent: parseNumber(inputs.annualRatePercent, 'Finance rate'),
        termMonths: parseNumber(inputs.termMonths, 'Lease term'),
        upfrontPayment: parseNumber(inputs.upfrontPayment, 'Upfront payment'),
        fees: parseNumber(inputs.fees, 'Fees'),
      });

      return {
        label: 'Estimated monthly lease payment',
        expression: `${compactMoney(result.assetValue)} asset over ${monthCount(result.termMonths)}`,
        answer: money(result.monthlyPayment),
        metrics: [
          { label: 'Adjusted cost', value: money(result.adjustedCost) },
          { label: 'Depreciation fee', value: money(result.depreciationFee) },
          { label: 'Finance fee', value: money(result.financeFee) },
          { label: 'Estimated total lease cost', value: money(result.totalLeaseCost) },
        ],
        steps: [
          'Add fees to asset value and subtract upfront payment.',
          'Spread the amount above residual value across the lease term.',
          'Estimate monthly finance charge from adjusted cost, residual value, and rate.',
          'Add depreciation and finance portions for monthly payment.',
        ],
        note: 'Use the actual lease contract for taxes, buyout terms, maintenance, renewal, and early-exit costs.',
      };
    }
    case 'refinance': {
      const result = calculateRefinance({
        currentBalance: parseNumber(inputs.currentBalance, 'Current balance'),
        currentAnnualRatePercent: parseNumber(inputs.currentAnnualRatePercent, 'Current rate'),
        currentYears: parseNumber(inputs.currentYears, 'Current remaining term'),
        newAnnualRatePercent: parseNumber(inputs.newAnnualRatePercent, 'New rate'),
        newYears: parseNumber(inputs.newYears, 'New loan term'),
        closingCosts: parseNumber(inputs.closingCosts, 'Closing costs'),
      });

      return {
        label: 'Estimated new monthly payment',
        expression: `${compactMoney(result.newPrincipal)} new balance at ${percent(result.newLoan.annualRatePercent)}`,
        answer: money(result.newLoan.monthlyPayment),
        metrics: [
          { label: 'Monthly savings', value: money(result.monthlySavings) },
          { label: 'Current payment', value: money(result.currentLoan.monthlyPayment) },
          { label: 'Break-even time', value: result.breakEvenMonths === null ? 'No monthly savings' : monthCount(result.breakEvenMonths) },
          { label: 'Total cost change', value: money(result.totalCostChange) },
        ],
        steps: [
          'Estimate the remaining current loan payment and cost.',
          'Add closing costs to the new principal for a rolled-cost comparison.',
          'Estimate the new fixed payment and compare monthly payments.',
          'Divide closing costs by monthly savings when the new payment is lower.',
        ],
        note: 'Refinancing can lower payment but still cost more if the term is extended or closing costs are high.',
      };
    }
    case 'budget': {
      const result = calculateBudget({
        monthlyIncome: parseNumber(inputs.monthlyIncome, 'Monthly income'),
        housing: parseNumber(inputs.housing, 'Housing'),
        utilities: parseNumber(inputs.utilities, 'Utilities'),
        food: parseNumber(inputs.food, 'Food'),
        transportation: parseNumber(inputs.transportation, 'Transportation'),
        insurance: parseNumber(inputs.insurance, 'Insurance'),
        debt: parseNumber(inputs.debt, 'Debt payments'),
        savings: parseNumber(inputs.savings, 'Savings'),
        other: parseNumber(inputs.other, 'Other'),
      });

      return {
        label: result.leftover >= 0 ? 'Money left after budget' : 'Budget shortfall',
        expression: `${compactMoney(result.monthlyIncome)} income - ${compactMoney(result.totalExpenses)} planned spending`,
        answer: money(result.leftover),
        metrics: [
          { label: 'Total planned expenses', value: money(result.totalExpenses) },
          { label: 'Expense ratio', value: percent(result.expenseRatioPercent) },
          { label: 'Savings rate', value: percent(result.savingsRatePercent) },
          { label: 'Largest category', value: result.categories.reduce((largest, category) => (category.amount > largest.amount ? category : largest), result.categories[0]).label },
        ],
        steps: [
          'Add each monthly spending and savings category.',
          'Subtract total planned expenses from monthly income.',
          'Divide total expenses by income for an expense ratio.',
          'Divide planned savings by income for a savings-rate check.',
        ],
        note: 'This is a simple monthly budget worksheet and does not sync with accounts or forecast irregular bills.',
      };
    }
    case 'marriage-tax': {
      const result = calculateMarriageTaxComparison({
        spouseOneIncome: parseNumber(inputs.spouseOneIncome, 'Person 1 income'),
        spouseTwoIncome: parseNumber(inputs.spouseTwoIncome, 'Person 2 income'),
        spouseOneDeduction: parseOptionalNumber(inputs.spouseOneDeduction, 'Person 1 deduction'),
        spouseTwoDeduction: parseOptionalNumber(inputs.spouseTwoDeduction, 'Person 2 deduction'),
        jointDeduction: parseOptionalNumber(inputs.jointDeduction, 'Joint deduction'),
        credits: parseNumber(inputs.credits, 'Credits'),
      });

      return {
        label: result.marriageDifference > 0 ? 'Estimated marriage penalty' : 'Estimated marriage bonus',
        expression: `${compactMoney(result.spouseOneTax.grossIncome)} + ${compactMoney(result.spouseTwoTax.grossIncome)} compared with joint filing`,
        answer: money(Math.abs(result.marriageDifference)),
        metrics: [
          { label: 'Joint federal tax', value: money(result.jointTax.federalTax) },
          { label: 'Two single returns', value: money(result.combinedSingleTax) },
          { label: 'Joint taxable income', value: money(result.jointTax.taxableIncome) },
          { label: 'Joint marginal bracket', value: percent(result.jointTax.marginalRatePercent) },
        ],
        steps: [
          'Estimate each person as a single filer using 2026 federal ordinary-income brackets.',
          'Estimate the same income as married filing jointly.',
          'Subtract the combined single estimate from the joint estimate.',
        ],
        note: 'This excludes state tax, payroll tax, credits, phaseouts, itemized deduction limits, AMT, and many tax details.',
      };
    }
    case 'estate-tax': {
      const result = calculateEstateTaxEstimate({
        grossEstate: parseNumber(inputs.grossEstate, 'Gross estate'),
        debtsAndExpenses: parseNumber(inputs.debtsAndExpenses, 'Debts and expenses'),
        charitableBequests: parseNumber(inputs.charitableBequests, 'Charitable bequests'),
        spouseTransfers: parseNumber(inputs.spouseTransfers, 'Spouse transfers'),
        lifetimeTaxableGifts: parseNumber(inputs.lifetimeTaxableGifts, 'Prior taxable gifts'),
      });

      return {
        label: 'Simplified federal estate tax',
        expression: `${compactMoney(result.grossEstate)} estate less deductions and 2026 exclusion`,
        answer: money(result.estimatedFederalEstateTax),
        metrics: [
          { label: 'Deductions entered', value: money(result.deductions) },
          { label: 'Estate before exclusion', value: money(result.taxableEstateBeforeExclusion) },
          { label: 'Remaining basic exclusion', value: money(result.remainingBasicExclusion) },
          { label: 'Above exclusion', value: money(result.taxableAboveExclusion) },
        ],
        steps: [
          'Subtract debts, expenses, charitable bequests, and spouse transfers from the gross estate.',
          'Reduce the 2026 federal basic exclusion by prior taxable gifts you entered.',
          'Apply a simplified 40% federal top-rate estimate to the amount above the remaining exclusion.',
        ],
        note: 'Estate tax is complex. This page is only a rough planning screen before professional estate and tax advice.',
      };
    }
    case 'social-security': {
      const result = calculateSocialSecurityClaiming({
        birthYear: parseNumber(inputs.birthYear, 'Birth year'),
        fullRetirementAgeBenefit: parseNumber(inputs.fullRetirementAgeBenefit, 'Full retirement age benefit'),
        claimingAgeYears: parseNumber(inputs.claimingAgeYears, 'Claiming age'),
      });

      return {
        label: 'Estimated monthly benefit',
        expression: `Born ${result.birthYear}, claiming at ${formatCalculatorNumber(result.claimingAgeYears)}`,
        answer: money(result.monthlyBenefit),
        metrics: [
          { label: 'Full retirement age', value: years(result.fullRetirementAgeYears) },
          { label: 'Adjustment', value: percent(result.adjustmentPercent) },
          { label: 'Benefit at FRA', value: money(result.fullRetirementAgeBenefit) },
          { label: 'Annual estimate', value: money(result.annualBenefit) },
        ],
        steps: [
          'Estimate full retirement age from birth year.',
          'Apply SSA-style early claiming reductions before full retirement age.',
          'Apply delayed retirement credits after full retirement age through age 70.',
        ],
        note: 'Use your official my Social Security record for real earnings history, spousal benefits, survivor benefits, and taxes.',
      };
    }
    case 'rmd': {
      const result = calculateRmdEstimate(parseNumber(inputs.accountBalance, 'Account balance'), parseNumber(inputs.age, 'Age'));

      return {
        label: 'Estimated RMD',
        expression: `${compactMoney(result.accountBalance)} / ${formatCalculatorNumber(result.lifeExpectancyFactor)}`,
        answer: money(result.requiredDistribution),
        metrics: [
          { label: 'Uniform table factor', value: formatCalculatorNumber(result.lifeExpectancyFactor) },
          { label: 'Age used', value: `${result.age}` },
          { label: 'Balance after RMD', value: money(result.remainingBalanceAfterRmd) },
        ],
        steps: [
          'Use the account balance from the prior December 31.',
          'Look up the age factor in the IRS Uniform Lifetime Table.',
          'Divide the balance by the factor.',
        ],
        note: 'Inherited accounts and a spouse more than 10 years younger may use different IRS tables.',
      };
    }
    case 'real-estate': {
      const result = calculateRealEstateReturn({
        purchasePrice: parseNumber(inputs.purchasePrice, 'Purchase price'),
        downPayment: parseNumber(inputs.downPayment, 'Down payment'),
        buyingCosts: parseNumber(inputs.buyingCosts, 'Buying costs'),
        improvements: parseNumber(inputs.improvements, 'Improvements'),
        sellingPrice: parseNumber(inputs.sellingPrice, 'Selling price'),
        sellingCosts: parseNumber(inputs.sellingCosts, 'Selling costs'),
        loanPayoff: parseNumber(inputs.loanPayoff, 'Loan payoff'),
      });

      return {
        label: result.profit >= 0 ? 'Estimated profit' : 'Estimated loss',
        expression: `${compactMoney(result.purchasePrice)} purchase to ${compactMoney(result.sellingPrice)} sale`,
        answer: money(result.profit),
        metrics: [
          { label: 'Cash invested', value: money(result.cashInvested) },
          { label: 'Net sale proceeds', value: money(result.netSaleProceeds) },
          { label: 'ROI', value: percent(result.roiPercent) },
          { label: 'Equity multiple', value: `${formatCalculatorNumber(result.equityMultiple)}x` },
        ],
        steps: [
          'Add down payment, buying costs, and improvements for cash invested.',
          'Subtract selling costs and loan payoff from sale price.',
          'Compare net sale proceeds with cash invested.',
        ],
      };
    }
    case 'take-home-paycheck': {
      const result = calculateTakeHomePaycheck({
        annualGrossPay: parseNumber(inputs.annualGrossPay, 'Annual gross pay'),
        payPeriodsPerYear: parseNumber(inputs.payPeriodsPerYear, 'Pay periods'),
        pretaxDeductionsPerPaycheck: parseNumber(inputs.pretaxDeductionsPerPaycheck, 'Pretax deductions'),
        federalTaxPercent: parseNumber(inputs.federalTaxPercent, 'Federal withholding estimate'),
        stateTaxPercent: parseNumber(inputs.stateTaxPercent, 'State withholding estimate'),
        localTaxPercent: parseNumber(inputs.localTaxPercent, 'Local withholding estimate'),
      });

      return {
        label: 'Estimated take-home paycheck',
        expression: `${compactMoney(result.annualGrossPay)} over ${formatCalculatorNumber(result.annualGrossPay / result.grossPerPaycheck)} pay periods`,
        answer: money(result.takeHomePerPaycheck),
        metrics: [
          { label: 'Gross per paycheck', value: money(result.grossPerPaycheck) },
          { label: 'Annual take-home', value: money(result.annualTakeHomePay) },
          { label: 'FICA estimate', value: money(result.socialSecurityTax + result.medicareTax) },
          { label: 'Pretax deductions/year', value: money(result.pretaxDeductionsAnnual) },
        ],
        steps: [
          'Annualize pretax paycheck deductions.',
          'Apply your estimated federal, state, and local withholding percentages.',
          'Apply employee Social Security and Medicare tax estimates.',
          'Divide annual take-home pay by the number of paychecks.',
        ],
        note: 'Actual payroll can differ because of W-4 settings, benefits, state rules, local taxes, bonuses, and employer systems.',
      };
    }
    case 'rental-property': {
      const result = calculateRentalProperty({
        propertyPrice: parseNumber(inputs.propertyPrice, 'Property price'),
        downPayment: parseNumber(inputs.downPayment, 'Down payment'),
        annualRatePercent: parseNumber(inputs.annualRatePercent, 'Mortgage rate'),
        loanYears: parseNumber(inputs.loanYears, 'Loan term'),
        monthlyRent: parseNumber(inputs.monthlyRent, 'Monthly rent'),
        vacancyPercent: parseNumber(inputs.vacancyPercent, 'Vacancy reserve'),
        monthlyOperatingExpenses: parseNumber(inputs.monthlyOperatingExpenses, 'Operating expenses'),
        annualPropertyTax: parseNumber(inputs.annualPropertyTax, 'Annual property tax'),
        monthlyInsurance: parseNumber(inputs.monthlyInsurance, 'Monthly insurance'),
        maintenancePercent: parseNumber(inputs.maintenancePercent, 'Maintenance reserve'),
        closingCosts: parseNumber(inputs.closingCosts, 'Closing costs'),
      });

      return {
        label: result.monthlyCashFlow >= 0 ? 'Monthly cash flow' : 'Monthly shortfall',
        expression: `${compactMoney(result.loanAmount)} loan, rent less operating costs`,
        answer: money(result.monthlyCashFlow),
        metrics: [
          { label: 'Mortgage payment', value: money(result.monthlyMortgagePayment) },
          { label: 'Monthly NOI', value: money(result.monthlyNoi) },
          { label: 'Cap rate', value: percent(result.capRatePercent) },
          { label: 'Cash-on-cash return', value: percent(result.cashOnCashReturnPercent) },
        ],
        steps: [
          'Subtract vacancy reserve and operating costs from rent to estimate NOI.',
          'Estimate mortgage payment from loan amount, rate, and term.',
          'Subtract mortgage payment from NOI for cash flow.',
          'Compare NOI with property price and annual cash flow with cash invested.',
        ],
      };
    }
    case 'irr': {
      const initialOutflow = parseNumber(inputs.initialOutflow, 'Initial investment');
      const cashFlows = [
        -initialOutflow,
        parseNumber(inputs.cashFlow1, 'Year 1 cash flow'),
        parseNumber(inputs.cashFlow2, 'Year 2 cash flow'),
        parseNumber(inputs.cashFlow3, 'Year 3 cash flow'),
        parseNumber(inputs.cashFlow4, 'Year 4 cash flow'),
        parseNumber(inputs.cashFlow5, 'Year 5 cash flow'),
      ];
      const result = calculateIrr(cashFlows, parseNumber(inputs.periodsPerYear, 'Periods per year'));

      return {
        label: 'Estimated annualized IRR',
        expression: `${compactMoney(initialOutflow)} outflow, five entered cash-flow periods`,
        answer: percent(result.annualizedIrrPercent),
        metrics: [
          { label: 'Periodic IRR', value: percent(result.periodicIrrPercent) },
          { label: 'Net cash flow', value: money(result.netCashFlow) },
          { label: 'Periods per year', value: inputs.periodsPerYear || '1' },
        ],
        steps: [
          'Treat the initial investment as a negative cash flow.',
          'Discount each future cash flow until net present value is near zero.',
          'Annualize the periodic IRR using the selected period frequency.',
        ],
        note: 'Unusual cash-flow signs can produce multiple IRRs or no simple IRR.',
      };
    }
    case 'roi': {
      const result = calculateRoi({
        initialInvestment: parseNumber(inputs.initialInvestment, 'Initial investment'),
        endingValue: parseNumber(inputs.endingValue, 'Ending value'),
        income: parseNumber(inputs.income, 'Income'),
        costs: parseNumber(inputs.costs, 'Costs'),
      });

      return {
        label: result.gain >= 0 ? 'Estimated gain' : 'Estimated loss',
        expression: `Gain divided by ${compactMoney(parseNumber(inputs.initialInvestment, 'Initial investment'))}`,
        answer: percent(result.roiPercent),
        metrics: [
          { label: 'Gain or loss', value: money(result.gain) },
          { label: 'Ending value', value: money(result.endingValue) },
        ],
        steps: [
          'Add ending value and income.',
          'Subtract costs and initial investment.',
          'Divide gain or loss by initial investment.',
        ],
      };
    }
    case 'apr': {
      const result = calculateAprEstimate({
        principal: parseNumber(inputs.principal, 'Loan amount'),
        annualRatePercent: parseNumber(inputs.annualRatePercent, 'Note rate'),
        years: parseNumber(inputs.years, 'Term'),
        fees: parseNumber(inputs.fees, 'Fees'),
      });

      return {
        label: 'Estimated APR',
        expression: `${compactMoney(result.amountReceived)} received, ${money(result.loan.monthlyPayment)}/mo payment`,
        answer: percent(result.aprPercent),
        metrics: [
          { label: 'Note rate', value: percent(result.loan.annualRatePercent) },
          { label: 'Fees included', value: money(result.fees) },
          { label: 'Amount received', value: money(result.amountReceived) },
          { label: 'Monthly payment', value: money(result.loan.monthlyPayment) },
        ],
        steps: [
          'Estimate the scheduled monthly payment from loan amount and note rate.',
          'Subtract fees from principal to estimate net amount received.',
          'Solve the rate that makes the payment stream match the amount received.',
        ],
        note: 'Official APR disclosures can include different finance charges and rounding rules.',
      };
    }
    case 'fha-loan': {
      const result = calculateFhaLoan({
        homePrice: parseNumber(inputs.homePrice, 'Home price'),
        downPayment: parseNumber(inputs.downPayment, 'Down payment'),
        annualRatePercent: parseNumber(inputs.annualRatePercent, 'Interest rate'),
        years: parseNumber(inputs.years, 'Loan term'),
        upfrontMipPercent: parseNumber(inputs.upfrontMipPercent, 'Upfront MIP'),
        annualMipPercent: parseNumber(inputs.annualMipPercent, 'Annual MIP'),
        annualPropertyTax: parseNumber(inputs.annualPropertyTax, 'Annual property tax'),
        monthlyInsurance: parseNumber(inputs.monthlyInsurance, 'Monthly insurance'),
      });

      return {
        label: 'Estimated FHA monthly payment',
        expression: `${compactMoney(result.baseLoanAmount)} base loan plus FHA MIP assumptions`,
        answer: money(result.totalMonthlyPayment),
        metrics: [
          { label: 'Principal and interest', value: money(result.principalAndInterest) },
          { label: 'Upfront MIP', value: money(result.upfrontMip) },
          { label: 'Monthly MIP', value: money(result.monthlyMip) },
          { label: 'Loan-to-value', value: percent(result.loanToValuePercent) },
        ],
        steps: [
          'Calculate the base loan from price minus down payment.',
          'Add entered upfront MIP to the financed balance.',
          'Estimate principal and interest, tax, insurance, and monthly MIP.',
        ],
        note: 'FHA MIP duration, eligibility, loan limits, and underwriting depend on official FHA and lender rules.',
      };
    }
    case 'va-mortgage': {
      const result = calculateVaMortgage({
        homePrice: parseNumber(inputs.homePrice, 'Home price'),
        downPayment: parseNumber(inputs.downPayment, 'Down payment'),
        annualRatePercent: parseNumber(inputs.annualRatePercent, 'Interest rate'),
        years: parseNumber(inputs.years, 'Loan term'),
        firstUse: inputs.firstUse !== 'no',
        exemptFundingFee: inputs.exemptFundingFee === 'yes',
        financeFundingFee: inputs.financeFundingFee !== 'no',
        annualPropertyTax: parseNumber(inputs.annualPropertyTax, 'Annual property tax'),
        monthlyInsurance: parseNumber(inputs.monthlyInsurance, 'Monthly insurance'),
      });

      return {
        label: 'Estimated VA monthly payment',
        expression: `${compactMoney(result.baseLoanAmount)} base loan, ${percent(result.fundingFeePercent)} funding fee`,
        answer: money(result.totalMonthlyPayment),
        metrics: [
          { label: 'Principal and interest', value: money(result.principalAndInterest) },
          { label: 'Funding fee', value: money(result.fundingFee) },
          { label: 'Funding fee rate', value: percent(result.fundingFeePercent) },
          { label: 'Loan-to-value', value: percent(result.loanToValuePercent) },
        ],
        steps: [
          'Calculate base loan from home price minus down payment.',
          'Choose a common VA purchase funding-fee rate from down payment and first-use status.',
          'Finance the fee into the loan if selected, then estimate payment.',
        ],
        note: 'VA eligibility, exemption status, lender fees, and closing costs must be verified with official documents.',
      };
    }
    case 'home-equity-loan': {
      const result = calculateHomeEquityLoan({
        homeValue: parseNumber(inputs.homeValue, 'Home value'),
        currentMortgageBalance: parseNumber(inputs.currentMortgageBalance, 'Current mortgage balance'),
        desiredLoanAmount: parseNumber(inputs.desiredLoanAmount, 'Desired loan amount'),
        annualRatePercent: parseNumber(inputs.annualRatePercent, 'Interest rate'),
        years: parseNumber(inputs.years, 'Loan term'),
        maxCombinedLoanToValuePercent: parseNumber(inputs.maxCombinedLoanToValuePercent, 'Max combined LTV'),
      });

      return {
        label: 'Estimated equity loan payment',
        expression: `${compactMoney(result.principal)} at ${percent(result.annualRatePercent)} for ${years(result.years)}`,
        answer: money(result.monthlyPayment),
        metrics: [
          { label: 'Available equity at limit', value: money(result.availableEquity) },
          { label: 'Combined LTV', value: percent(result.combinedLoanToValuePercent) },
          { label: 'Total interest', value: money(result.totalInterest) },
          { label: 'Total paid', value: money(result.totalPaid) },
        ],
        steps: [
          'Estimate available equity from home value, current mortgage balance, and max combined LTV.',
          'Calculate the fixed home equity loan payment.',
          'Compare requested loan amount with the available-equity estimate.',
        ],
        note: 'Home equity borrowing can put the home at risk if payments are not made.',
      };
    }
    case 'heloc': {
      const result = calculateHeloc({
        homeValue: parseNumber(inputs.homeValue, 'Home value'),
        currentMortgageBalance: parseNumber(inputs.currentMortgageBalance, 'Current mortgage balance'),
        creditLine: parseNumber(inputs.creditLine, 'Credit line'),
        currentDraw: parseNumber(inputs.currentDraw, 'Current draw'),
        annualRatePercent: parseNumber(inputs.annualRatePercent, 'Interest rate'),
        repaymentYears: parseNumber(inputs.repaymentYears, 'Repayment years'),
        maxCombinedLoanToValuePercent: parseNumber(inputs.maxCombinedLoanToValuePercent, 'Max combined LTV'),
      });

      return {
        label: 'Estimated interest-only payment',
        expression: `${compactMoney(result.currentDraw)} draw at ${percent(parseNumber(inputs.annualRatePercent, 'Interest rate'))}`,
        answer: money(result.interestOnlyPayment),
        metrics: [
          { label: 'Repayment payment estimate', value: money(result.repaymentPayment) },
          { label: 'Available equity at limit', value: money(result.availableEquity) },
          { label: 'Combined LTV on draw', value: percent(result.combinedLoanToValuePercent) },
          { label: 'Credit line', value: money(result.creditLine) },
        ],
        steps: [
          'Estimate available equity from max combined LTV.',
          'Calculate draw-period interest-only payment from current balance and rate.',
          'Estimate repayment-period payment if the drawn balance is amortized.',
        ],
        note: 'HELOCs often have variable rates, fees, draw rules, and payment changes after the draw period.',
      };
    }
    case 'down-payment': {
      const result = calculateDownPayment({
        homePrice: parseNumber(inputs.homePrice, 'Home price'),
        downPayment: parseOptionalNumber(inputs.downPayment, 'Down payment'),
        downPaymentPercent: parseNumber(inputs.downPaymentPercent, 'Down payment percent'),
        closingCostPercent: parseNumber(inputs.closingCostPercent, 'Closing cost estimate'),
      });

      return {
        label: 'Estimated cash needed',
        expression: `${percent(result.downPaymentPercent)} down on ${compactMoney(result.homePrice)}`,
        answer: money(result.cashNeeded),
        metrics: [
          { label: 'Down payment', value: money(result.downPayment) },
          { label: 'Loan amount', value: money(result.loanAmount) },
          { label: 'Loan-to-value', value: percent(result.loanToValuePercent) },
          { label: 'Closing cost estimate', value: money(result.estimatedClosingCosts) },
        ],
        steps: [
          'Use exact down payment if entered, otherwise multiply price by down payment percent.',
          'Subtract down payment from home price for estimated loan amount.',
          'Add estimated closing costs to down payment for cash needed.',
        ],
      };
    }
    case 'rent-vs-buy': {
      const result = calculateRentVsBuy({
        monthlyRent: parseNumber(inputs.monthlyRent, 'Monthly rent'),
        rentIncreasePercent: parseNumber(inputs.rentIncreasePercent, 'Rent increase'),
        homePrice: parseNumber(inputs.homePrice, 'Home price'),
        downPayment: parseNumber(inputs.downPayment, 'Down payment'),
        annualRatePercent: parseNumber(inputs.annualRatePercent, 'Mortgage rate'),
        years: parseNumber(inputs.years, 'Years'),
        annualPropertyTax: parseNumber(inputs.annualPropertyTax, 'Annual property tax'),
        monthlyInsurance: parseNumber(inputs.monthlyInsurance, 'Monthly insurance'),
        maintenancePercent: parseNumber(inputs.maintenancePercent, 'Maintenance percent'),
        appreciationPercent: parseNumber(inputs.appreciationPercent, 'Appreciation'),
        sellingCostPercent: parseNumber(inputs.sellingCostPercent, 'Selling cost percent'),
      });

      return {
        label: result.buyMinusRent <= 0 ? 'Buying lower by estimate' : 'Renting lower by estimate',
        expression: `${years(parseNumber(inputs.years, 'Years'))} rent total vs buy-and-sell estimate`,
        answer: money(Math.abs(result.buyMinusRent)),
        metrics: [
          { label: 'Total rent cost', value: money(result.totalRentCost) },
          { label: 'Net buying cost', value: money(result.netBuyingCost) },
          { label: 'Estimated sale proceeds', value: money(result.estimatedSaleProceeds) },
          { label: 'Remaining loan balance', value: money(result.remainingLoanBalance) },
        ],
        steps: [
          'Project rent with the entered annual rent increase.',
          'Estimate buying cash outflow from down payment, mortgage, tax, insurance, and maintenance.',
          'Estimate sale proceeds after appreciation, selling costs, and remaining loan balance.',
          'Compare rent cost with net buying cost.',
        ],
      };
    }
    case 'payback-period': {
      const result = calculatePaybackPeriod({
        initialCost: parseNumber(inputs.initialCost, 'Initial cost'),
        annualCashFlow: parseNumber(inputs.annualCashFlow, 'Annual cash flow'),
        horizonYears: parseNumber(inputs.horizonYears, 'Horizon years'),
      });

      return {
        label: 'Simple payback period',
        expression: `${compactMoney(result.initialCost)} / ${compactMoney(result.annualCashFlow)} per year`,
        answer: years(result.paybackYears),
        metrics: [
          { label: 'Initial cost', value: money(result.initialCost) },
          { label: 'Annual cash flow', value: money(result.annualCashFlow) },
          { label: 'Net after horizon', value: money(result.netProfitAfterHorizon) },
        ],
        steps: [
          'Divide initial cost by annual cash flow.',
          'Compare the payback time with your chosen horizon.',
          'Subtract initial cost from horizon cash flow for a simple net check.',
        ],
      };
    }
    case 'present-value': {
      const result = calculatePresentValue({
        futureValue: parseNumber(inputs.futureValue, 'Future value'),
        payment: parseNumber(inputs.payment, 'Regular payment'),
        annualRatePercent: parseNumber(inputs.annualRatePercent, 'Discount rate'),
        years: parseNumber(inputs.years, 'Years'),
        paymentsPerYear: parseNumber(inputs.paymentsPerYear, 'Payments per year'),
      });

      return {
        label: 'Estimated present value',
        expression: `${compactMoney(parseNumber(inputs.futureValue, 'Future value'))} future value plus payments discounted`,
        answer: money(result.presentValue),
        metrics: [
          { label: 'Lump-sum present value', value: money(result.lumpSumPresentValue) },
          { label: 'Payment stream present value', value: money(result.annuityPresentValue) },
          { label: 'Discount rate', value: percent(parseNumber(inputs.annualRatePercent, 'Discount rate')) },
        ],
        steps: [
          'Discount the future lump sum back to today.',
          'Discount each regular payment as an annuity.',
          'Add both present value parts.',
        ],
      };
    }
    case 'future-value': {
      const result = calculateFutureValue({
        principal: parseNumber(inputs.principal, 'Starting amount'),
        payment: parseNumber(inputs.payment, 'Regular payment'),
        annualRatePercent: parseNumber(inputs.annualRatePercent, 'Interest rate'),
        years: parseNumber(inputs.years, 'Years'),
        paymentsPerYear: parseNumber(inputs.paymentsPerYear, 'Payments per year'),
      });

      return {
        label: 'Estimated future value',
        expression: `${compactMoney(parseNumber(inputs.principal, 'Starting amount'))} plus regular payments`,
        answer: money(result.futureValue),
        metrics: [
          { label: 'Principal growth', value: money(result.principalFutureValue) },
          { label: 'Payment growth', value: money(result.contributionFutureValue) },
          { label: 'Total contributions', value: money(result.totalContributions) },
          { label: 'Estimated growth', value: money(result.futureValue - result.totalContributions) },
        ],
        steps: [
          'Compound the starting amount over the selected time.',
          'Compound each regular payment using the selected payment frequency.',
          'Add both future value parts.',
        ],
      };
    }
    case 'commission': {
      const result = calculateCommission({
        salesAmount: parseNumber(inputs.salesAmount, 'Sales amount'),
        commissionPercent: parseNumber(inputs.commissionPercent, 'Commission rate'),
        splitPercent: parseNumber(inputs.splitPercent, 'Split percent'),
        basePay: parseNumber(inputs.basePay, 'Base pay'),
        bonus: parseNumber(inputs.bonus, 'Bonus'),
      });

      return {
        label: 'Estimated total pay',
        expression: `${percent(parseNumber(inputs.commissionPercent, 'Commission rate'))} on ${compactMoney(result.salesAmount)}`,
        answer: money(result.totalPay),
        metrics: [
          { label: 'Gross commission', value: money(result.commission) },
          { label: 'Your split', value: money(result.splitAmount) },
          { label: 'Sales amount', value: money(result.salesAmount) },
        ],
        steps: [
          'Multiply sales amount by commission rate.',
          'Apply your split percentage if commission is shared.',
          'Add base pay and bonus amounts entered.',
        ],
      };
    }
    case 'mortgage-uk': {
      const result = calculateUkMortgage({
        propertyPrice: parseNumber(inputs.propertyPrice, 'Property price'),
        deposit: parseNumber(inputs.deposit, 'Deposit'),
        annualRatePercent: parseNumber(inputs.annualRatePercent, 'Interest rate'),
        years: parseNumber(inputs.years, 'Mortgage term'),
        monthlyFees: parseNumber(inputs.monthlyFees, 'Monthly fees'),
      });

      return {
        label: 'Estimated monthly repayment',
        expression: `${compactMoney(result.loanAmount, 'GBP')} at ${percent(result.annualRatePercent)} for ${years(result.years)}`,
        answer: money(result.totalMonthlyPayment, 'GBP'),
        metrics: [
          { label: 'Loan amount', value: money(result.loanAmount, 'GBP') },
          { label: 'Loan-to-value', value: percent(result.loanToValuePercent) },
          { label: 'Total interest', value: money(result.totalInterest, 'GBP') },
          { label: 'Monthly fees', value: money(result.monthlyFees, 'GBP') },
        ],
        steps: [
          'Subtract deposit from property price.',
          'Use a repayment mortgage formula to estimate monthly principal and interest.',
          'Add any monthly fee entered.',
        ],
        note: 'This does not include stamp duty, arrangement fees, valuation fees, insurance, or affordability checks.',
      };
    }
    case 'canadian-mortgage': {
      const result = calculateCanadianMortgage({
        propertyPrice: parseNumber(inputs.propertyPrice, 'Property price'),
        downPayment: parseNumber(inputs.downPayment, 'Down payment'),
        annualRatePercent: parseNumber(inputs.annualRatePercent, 'Interest rate'),
        years: parseNumber(inputs.years, 'Amortization'),
        paymentsPerYear: parseNumber(inputs.paymentsPerYear, 'Payments per year'),
      });

      return {
        label: 'Estimated mortgage payment',
        expression: `${compactMoney(result.loanAmount, 'CAD')} at ${percent(result.annualRatePercent)} with semi-annual conversion`,
        answer: money(result.totalMonthlyPayment, 'CAD'),
        metrics: [
          { label: 'Loan amount', value: money(result.loanAmount, 'CAD') },
          { label: 'Loan-to-value', value: percent(result.loanToValuePercent) },
          { label: 'Total interest', value: money(result.totalInterest, 'CAD') },
          { label: 'Payments', value: monthCount(result.paymentCount) },
        ],
        steps: [
          'Subtract down payment from property price.',
          'Convert the nominal rate through semi-annual compounding.',
          'Calculate the payment for the selected payment frequency.',
        ],
        note: 'This does not include mortgage default insurance, property tax, closing costs, or lender qualification rules.',
      };
    }
    case 'percent-off': {
      const result = calculateDiscountEstimate({
        originalPrice: parseNumber(inputs.originalPrice, 'Original price'),
        discountPercent: parseNumber(inputs.discountPercent, 'Discount percent'),
        extraDiscountPercent: parseNumber(inputs.extraDiscountPercent, 'Extra discount percent'),
        taxPercent: parseNumber(inputs.taxPercent, 'Tax rate'),
      });

      return {
        label: 'Final sale price',
        expression: `${percent(result.discountPercent)} off ${compactMoney(result.originalPrice)}`,
        answer: money(result.finalPrice),
        metrics: [
          { label: 'Savings before tax', value: money(result.totalSavings) },
          { label: 'Effective discount', value: percent(result.effectiveDiscountPercent) },
          { label: 'Subtotal after discounts', value: money(result.subtotalAfterDiscounts) },
          { label: 'Tax amount', value: money(result.taxAmount) },
        ],
        steps: [
          'Apply the first percent-off discount.',
          'Apply the extra discount to the reduced price.',
          'Add tax after discounts if a tax rate is entered.',
        ],
      };
    }
    case 'inflation': {
      const amount = parseNumber(inputs.amount, 'Amount');
      const annualInflationPercent = parseNumber(inputs.annualInflationPercent, 'Inflation rate');
      const inflationYears = parseNumber(inputs.years, 'Years');
      const result = calculateInflationAdjustment(amount, annualInflationPercent, inflationYears);

      return {
        label: 'Estimated future cost',
        expression: `${compactMoney(amount)} at ${percent(annualInflationPercent)} for ${years(inflationYears)}`,
        answer: money(result.futureCost),
        metrics: [
          { label: 'Present buying power', value: money(result.presentBuyingPower) },
          { label: 'Increase', value: money(result.futureCost - amount) },
          { label: 'Multiplier', value: `${formatCalculatorNumber(result.futureCost / amount)}x` },
        ],
        steps: [
          `Convert ${percent(annualInflationPercent)} to an annual multiplier.`,
          `Raise the multiplier to ${formatCalculatorNumber(inflationYears)} years.`,
          'Multiply the amount by the multiplier for future cost.',
          'Divide the amount by the multiplier for present buying power.',
        ],
      };
    }
    case 'income-tax': {
      const filingStatus = (inputs.filingStatus || 'single') as FederalFilingStatus;
      const grossIncome = parseNumber(inputs.grossIncome, 'Gross income');
      const deduction = parseOptionalNumber(inputs.deduction, 'Deduction');
      const credits = parseOptionalNumber(inputs.credits, 'Credits') ?? 0;
      const result = calculateFederalIncomeTax2026({ filingStatus, grossIncome, deduction, credits });

      return {
        label: 'Estimated 2026 federal tax',
        expression: `${filingStatusLabel(filingStatus)}, ${compactMoney(grossIncome)} gross income`,
        answer: money(result.federalTax),
        metrics: [
          { label: 'Taxable income', value: money(result.taxableIncome) },
          { label: 'Deduction used', value: money(result.deduction) },
          { label: 'Effective rate', value: percent(result.effectiveRatePercent) },
          { label: 'Marginal bracket', value: percent(result.marginalRatePercent) },
        ],
        steps: [
          `Start with ${compactMoney(grossIncome)} gross ordinary income.`,
          `Subtract ${money(result.deduction)} deduction to estimate taxable income.`,
          'Apply 2026 U.S. federal ordinary income tax brackets by filing status.',
          'Subtract credits you entered after bracket tax is calculated.',
        ],
        note: 'This simplified federal estimate excludes state tax, payroll tax, capital gains, AMT, phaseouts, and many credits.',
      };
    }
    case 'compound-interest': {
      const principal = parseNumber(inputs.principal, 'Initial amount');
      const monthlyContribution = parseNumber(inputs.monthlyContribution, 'Monthly contribution');
      const annualRatePercent = parseNumber(inputs.annualRatePercent, 'Annual rate');
      const compoundYears = parseNumber(inputs.years, 'Time');
      const compoundFrequency = parseNumber(inputs.compoundFrequency, 'Compounding frequency');
      const result = calculateCompoundInterest(principal, annualRatePercent, compoundYears, compoundFrequency, monthlyContribution);

      return {
        label: 'Compound interest balance',
        expression: `${compactMoney(principal)} plus ${money(monthlyContribution)}/mo at ${percent(annualRatePercent)}`,
        answer: money(result.endingBalance),
        metrics: [
          { label: 'Total contributions', value: money(result.totalContributions) },
          { label: 'Estimated interest', value: money(result.totalInterest) },
          { label: 'Effective annual rate', value: percent(result.effectiveAnnualRatePercent) },
        ],
        steps: [
          `Compound ${compoundFrequency} times per year.`,
          'Convert compounding to an effective annual rate.',
          'Convert effective annual growth to monthly growth for contributions.',
          'Ending balance includes starting amount, monthly contributions, and estimated interest.',
        ],
      };
    }
    case 'salary': {
      const result = calculateSalaryBreakdown({
        annualSalary: parseNumber(inputs.annualSalary, 'Annual salary'),
        hoursPerWeek: parseNumber(inputs.hoursPerWeek, 'Hours per week'),
        weeksPerYear: parseNumber(inputs.weeksPerYear, 'Weeks per year'),
        estimatedTaxRatePercent: parseNumber(inputs.estimatedTaxRatePercent, 'Simple tax estimate'),
      });

      return {
        label: 'Estimated gross hourly pay',
        expression: `${compactMoney(result.annualSalary)} over ${formatCalculatorNumber(result.hoursPerWeek)} hours/week`,
        answer: money(result.grossHourly),
        metrics: [
          { label: 'Monthly gross', value: money(result.grossMonthly) },
          { label: 'Biweekly gross', value: money(result.grossBiweekly) },
          { label: 'Weekly gross', value: money(result.grossWeekly) },
          { label: 'Monthly take-home estimate', value: money(result.estimatedTakeHomeMonthly) },
        ],
        steps: [
          'Divide annual salary by 12 for monthly gross pay.',
          'Divide annual salary by 26 for biweekly gross pay.',
          'Divide annual salary by paid weeks and weekly hours for hourly equivalent.',
          'Apply the simple tax estimate as a percentage of annual salary.',
        ],
        note: 'This is not payroll withholding and does not include benefits, deductions, overtime, state tax, or local tax.',
      };
    }
    case 'interest-rate': {
      const principal = parseNumber(inputs.principal, 'Principal');
      const monthlyPayment = parseNumber(inputs.monthlyPayment, 'Monthly payment');
      const loanYears = parseNumber(inputs.years, 'Loan term');
      const result = calculateInterestRateFromPayment(principal, monthlyPayment, loanYears);

      return {
        label: 'Estimated annual rate',
        expression: `${compactMoney(principal)}, ${money(monthlyPayment)}/mo for ${years(loanYears)}`,
        answer: percent(result.annualRatePercent),
        metrics: [
          { label: 'Monthly rate', value: percent(result.monthlyRatePercent) },
          { label: 'Total interest', value: money(result.totalInterest) },
          { label: 'Total paid', value: money(result.totalPaid) },
        ],
        steps: [
          'Start with the fixed payment, principal, and number of monthly payments.',
          'Search for the monthly rate that makes the loan formula match the payment.',
          'Convert the monthly rate to an estimated nominal annual rate.',
          'Total interest equals monthly payment times months minus principal.',
        ],
        note: 'This estimated rate is not APR and does not include fees.',
      };
    }
    case 'sales-tax': {
      const subtotal = parseNumber(inputs.subtotal, 'Subtotal');
      const salesTaxPercent = parseNumber(inputs.salesTaxPercent, 'Sales tax rate');
      const result = calculateSalesTax(subtotal, salesTaxPercent);

      return {
        label: 'Total after sales tax',
        expression: `${compactMoney(subtotal)} at ${percent(salesTaxPercent)} sales tax`,
        answer: money(result.total),
        metrics: [
          { label: 'Tax amount', value: money(result.taxAmount) },
          { label: 'Subtotal', value: money(result.subtotal) },
          { label: 'Rate used', value: percent(result.salesTaxPercent) },
        ],
        steps: [
          `Convert ${percent(salesTaxPercent)} to decimal rate ${formatCalculatorNumber(salesTaxPercent / 100)}.`,
          'Multiply subtotal by the rate to find tax amount.',
          'Add tax amount to subtotal for the final total.',
        ],
      };
    }
    default: {
      const exhaustiveCheck: never = variant;
      return exhaustiveCheck;
    }
  }
}

export default function FinanceCalculator({ variant }: Props) {
  const config = financeConfigs[variant];
  const [modeId, setModeId] = useState(config.modes[0].id);
  const activeMode = useMemo(
    () => config.modes.find((mode) => mode.id === modeId) ?? config.modes[0],
    [config.modes, modeId],
  );
  const [inputs, setInputs] = useState<FinanceInputs>(activeMode.defaultInputs);
  const [result, setResult] = useState<FinanceCalculation | null>(() =>
    calculateFinance(variant, activeMode.id, activeMode.defaultInputs),
  );
  const [error, setError] = useState('');
  const [history, setHistory] = useState<FinanceCalculation[]>([]);
  const [copied, setCopied] = useState(false);

  function changeMode(nextMode: FinanceMode) {
    setModeId(nextMode.id);
    setInputs(nextMode.defaultInputs);
    setResult(calculateFinance(variant, nextMode.id, nextMode.defaultInputs));
    setError('');
    setCopied(false);
  }

  function updateInput(key: string, value: string) {
    setInputs((current) => ({ ...current, [key]: value }));
    setError('');
    setCopied(false);
  }

  function runCalculation(nextInputs = inputs) {
    try {
      const nextResult = calculateFinance(variant, activeMode.id, nextInputs);
      setResult(nextResult);
      setHistory((current) => [nextResult, ...current].slice(0, 4));
      setError('');
      setCopied(false);
    } catch (calculationError) {
      setError(calculationError instanceof Error ? calculationError.message : 'Check the inputs and try again.');
      setCopied(false);
    }
  }

  function useExample(example: FinanceExample) {
    setInputs(example.inputs);
    runCalculation(example.inputs);
  }

  async function copyResult() {
    if (!result || error) return;

    try {
      await navigator.clipboard?.writeText(`${result.expression} = ${result.answer}`);
      setCopied(true);
    } catch {
      setCopied(false);
      setError('Copy was not available in this browser. You can still select the answer manually.');
    }
  }

  function runOnEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      runCalculation();
    }
  }

  return (
    <section className="advanced-calculator advanced-calculator-finance" aria-label={`${config.title} workspace`}>
      <div className="advanced-panel">
        {config.modes.length > 1 && (
          <div className="advanced-mode-grid finance-mode-grid" aria-label="Calculator modes">
            {config.modes.map((mode) => (
              <button
                aria-pressed={mode.id === activeMode.id}
                key={mode.id}
                onClick={() => changeMode(mode)}
                type="button"
              >
                <strong>{mode.symbol}</strong>
                <span>{mode.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="advanced-fields finance-fields">
          {activeMode.fields.map((field) => (
            <label className="advanced-field" key={field.key}>
              <span>{field.label}</span>
              {field.type === 'select' ? (
                <select value={inputs[field.key] ?? ''} onChange={(event) => updateInput(field.key, event.target.value)}>
                  {(field.options ?? []).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  inputMode={field.inputMode}
                  onChange={(event) => updateInput(field.key, event.target.value)}
                  onKeyDown={runOnEnter}
                  placeholder={field.placeholder}
                  type="text"
                  value={inputs[field.key] ?? ''}
                />
              )}
            </label>
          ))}
        </div>

        <div className="advanced-actions">
          <button className="button-primary" onClick={() => runCalculation()} type="button">
            {config.buttonLabel}
          </button>
          <button className="button-secondary" disabled={!result || Boolean(error)} onClick={copyResult} type="button">
            {copied ? 'Copied' : 'Copy answer'}
          </button>
        </div>

        {error && <p className="calculator-error" role="alert">{error}</p>}

        {result && (
          <article className="advanced-result-card finance-result-card" aria-live="polite">
            <span>{result.label}</span>
            <strong>{result.answer}</strong>
            <p>{result.expression}</p>
            <dl>
              {result.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                </div>
              ))}
            </dl>
            {result.note && <p>{result.note}</p>}
          </article>
        )}

        {result && (
          <div className="advanced-steps">
            <h2>Formula steps</h2>
            <ol>
              {result.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <aside className="advanced-side-panel">
        <div>
          <h2>Examples</h2>
          <div className="advanced-quick-grid finance-example-grid">
            {activeMode.examples.map((example) => (
              <button key={example.label} onClick={() => useExample(example)} type="button">
                {example.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2>Recent answers</h2>
          {history.length === 0 ? (
            <p>{config.emptyHistory}</p>
          ) : (
            <ol>
              {history.map((item, index) => (
                <li key={`${item.expression}-${index}`}>
                  <span>{item.expression}</span>
                  <strong>{item.answer}</strong>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="advanced-note">
          <p>{config.privacyNote}</p>
          <p>Inputs and recent answers stay in this browser tab and are not sent to a server.</p>
        </div>
      </aside>
    </section>
  );
}
