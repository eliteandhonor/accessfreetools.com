import { useMemo, useState, type HTMLAttributes } from 'react';
import {
  calculateAmortizationSummary,
  calculateAutoLoanSummary,
  calculateCompoundInterest,
  calculateFederalIncomeTax2026,
  calculateInflationAdjustment,
  calculateInterestRateFromPayment,
  calculateInvestmentGrowth,
  calculateLoanSummary,
  calculateMortgagePayment,
  calculateRetirementSavings,
  calculateSalaryBreakdown,
  calculateSalesTax,
  calculateSimpleInterest,
  formatCalculatorNumber,
  type FederalFilingStatus,
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
  | 'inflation'
  | 'finance'
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

function money(value: number) {
  return value.toLocaleString('en-US', {
    currency: 'USD',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: 'currency',
  });
}

function compactMoney(value: number) {
  return value.toLocaleString('en-US', {
    currency: 'USD',
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

  function changeMode(nextMode: FinanceMode) {
    setModeId(nextMode.id);
    setInputs(nextMode.defaultInputs);
    setResult(calculateFinance(variant, nextMode.id, nextMode.defaultInputs));
    setError('');
  }

  function updateInput(key: string, value: string) {
    setInputs((current) => ({ ...current, [key]: value }));
  }

  function runCalculation(nextInputs = inputs) {
    try {
      const nextResult = calculateFinance(variant, activeMode.id, nextInputs);
      setResult(nextResult);
      setHistory((current) => [nextResult, ...current].slice(0, 4));
      setError('');
    } catch (calculationError) {
      setError(calculationError instanceof Error ? calculationError.message : 'Check the inputs and try again.');
    }
  }

  function useExample(example: FinanceExample) {
    setInputs(example.inputs);
    runCalculation(example.inputs);
  }

  async function copyResult() {
    if (!result) return;
    await navigator.clipboard?.writeText(`${result.expression} = ${result.answer}`);
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
          <button className="button-secondary" disabled={!result} onClick={copyResult} type="button">
            Copy answer
          </button>
        </div>

        {error && <p className="calculator-error">{error}</p>}

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
