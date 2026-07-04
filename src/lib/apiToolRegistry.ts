import { z } from 'zod';
import {
  analyzeText,
  calculateAbsoluteValue,
  calculateAiTokenCost,
  calculateBigIntegerOperation,
  calculateBinary,
  calculateBinaryIntegerOperation,
  calculateBmi,
  calculateConcrete,
  calculateDateDifference,
  calculateDownloadTime,
  calculateMortgagePayment,
  calculatePaintEstimate,
  calculatePercentOf,
  calculatePercentageOf,
  calculateShapeArea,
  calculateSubnet,
  calculateTip,
  calculateWattsToAmps,
  decodeBase64,
  decodeUrlComponentValue,
  encodeBase64,
  encodeUrlComponentValue,
  formatBigInteger,
  formatBinaryInteger,
  formatCalculatorNumber,
  formatJsonText,
  generatePassword,
  parseBigInteger,
  parseBinaryInteger,
  type AreaShape,
  type CalculatorOperator,
  type ElectricalPowerPhase,
} from './calculator';

const SITE_ORIGIN = 'https://accessfreetools.com';

export type ApiToolRisk = 'low' | 'finance' | 'health' | 'construction' | 'electrical' | 'privacy';

export interface ApiToolRunResult {
  answer: string;
  assumptions: string[];
  guide_url: string;
  inputs?: unknown;
  result: unknown;
  steps: string[];
  tool_url: string;
  warnings: string[];
}

export interface ApiToolDefinition<TInput extends z.ZodType = z.ZodType> {
  category: string;
  description: string;
  examples: Array<{ label: string; inputs: z.infer<TInput> }>;
  inputSchema: TInput;
  keywords: string[];
  name: string;
  risk: ApiToolRisk;
  run: (input: any) => ApiToolRunResult;
  slug: string;
  summary: string;
}

export interface PublicApiToolDefinition {
  category: string;
  description: string;
  examples: Array<{ label: string; inputs: unknown }>;
  guide_url: string;
  input_schema: unknown;
  keywords: string[];
  name: string;
  risk: ApiToolRisk;
  slug: string;
  summary: string;
  tool_url: string;
}

export class ApiToolValidationError extends Error {
  constructor(
    message: string,
    public readonly issues: string[],
  ) {
    super(message);
  }
}

function toolUrl(slug: string) {
  return `${SITE_ORIGIN}/tools/${slug}/`;
}

function guideUrl(slug: string) {
  return `${SITE_ORIGIN}/blog/how-to-use-${slug}/`;
}

function formatNumber(value: number, suffix = '', maximumFractionDigits = 4) {
  if (!Number.isFinite(value)) return `Error${suffix}`;

  if (Math.abs(value) >= 1e12 || (Math.abs(value) > 0 && Math.abs(value) < 1e-8)) {
    return `${value.toExponential(4).replace(/\.?0+e/, 'e')}${suffix}`;
  }

  return `${value.toLocaleString('en-US', { maximumFractionDigits, useGrouping: false })}${suffix}`;
}

function durationText(totalSeconds: number) {
  const sign = totalSeconds < 0 ? '-' : '';
  let remaining = Math.abs(Math.round(totalSeconds));
  const hours = Math.floor(remaining / 3600);
  remaining -= hours * 3600;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining - minutes * 60;

  if (hours > 0) return `${sign}${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${sign}${minutes}m ${seconds}s`;
  return `${sign}${seconds}s`;
}

function money(value: number) {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: 2,
    style: 'currency',
  }).format(value);
}

function preciseMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: value < 1 ? 6 : 2,
    minimumFractionDigits: value < 1 ? 0 : 2,
    style: 'currency',
  }).format(value);
}

function withUrls(slug: string, result: Omit<ApiToolRunResult, 'tool_url' | 'guide_url'>): ApiToolRunResult {
  return {
    ...result,
    guide_url: guideUrl(slug),
    tool_url: toolUrl(slug),
  };
}

function operatorWord(operator: CalculatorOperator) {
  return (
    {
      '*': 'times',
      '+': 'plus',
      '-': 'minus',
      '/': 'divided by',
    } satisfies Record<CalculatorOperator, string>
  )[operator];
}

function serializeIntegerOperation(
  operation: ReturnType<typeof calculateBinaryIntegerOperation>,
  formatter: (value: bigint) => string,
) {
  return {
    left: formatter(operation.left),
    operator: operation.operator,
    quotient: operation.quotient === undefined ? undefined : formatter(operation.quotient),
    remainder: operation.remainder === undefined ? undefined : formatter(operation.remainder),
    result: formatter(operation.result),
    right: formatter(operation.right),
  };
}

const percentageInput = z.object({
  mode: z.enum(['percent-of', 'what-percent']).default('percent-of'),
  part: z.number().optional(),
  percent: z.number().optional(),
  value: z.number().optional(),
  whole: z.number().optional(),
});

const absoluteValueInput = z.object({
  comparisonValue: z.number().optional(),
  value: z.number(),
});

const aiTokenCostInput = z.object({
  inputPricePerMillion: z.number().nonnegative(),
  inputTokensPerRequest: z.number().nonnegative(),
  outputPricePerMillion: z.number().nonnegative(),
  outputTokensPerRequest: z.number().nonnegative(),
  requests: z.number().positive(),
});

const calculatorOperatorInput = z.enum(['+', '-', '*', '/']);

const basicCalculatorInput = z.object({
  left: z.number(),
  operator: calculatorOperatorInput.default('+'),
  right: z.number(),
});

const averageInput = z.object({
  values: z.array(z.number()).min(1).max(1000),
});

const areaInput = z.object({
  base: z.number().positive().optional(),
  baseA: z.number().positive().optional(),
  baseB: z.number().positive().optional(),
  height: z.number().positive().optional(),
  length: z.number().positive().optional(),
  radius: z.number().positive().optional(),
  shape: z.enum(['rectangle', 'triangle', 'circle', 'trapezoid', 'parallelogram']).default('rectangle'),
  width: z.number().positive().optional(),
});

const binaryInput = z.object({
  left: z.string().min(1).max(256),
  operator: calculatorOperatorInput.default('+'),
  right: z.string().min(1).max(256),
});

const bigNumberInput = z.object({
  left: z.string().min(1).max(512),
  operator: calculatorOperatorInput.default('+'),
  right: z.string().min(1).max(512),
});

const tipInput = z.object({
  people: z.number().int().min(1).max(1000).default(1),
  subtotal: z.number().nonnegative(),
  taxPercent: z.number().min(0).max(100).default(0),
  tipPercent: z.number().min(0).max(100),
});

const bmiInput = z.object({
  heightCm: z.number().positive(),
  weightKg: z.number().positive(),
});

const mortgageInput = z.object({
  annualPropertyTax: z.number().nonnegative().default(0),
  annualRatePercent: z.number().nonnegative(),
  downPayment: z.number().nonnegative(),
  homePrice: z.number().positive(),
  monthlyHoa: z.number().nonnegative().default(0),
  monthlyInsurance: z.number().nonnegative().default(0),
  monthlyPmi: z.number().nonnegative().default(0),
  years: z.number().positive(),
});

const concreteInput = z.object({
  depthInches: z.number().positive(),
  lengthFeet: z.number().positive(),
  wastePercent: z.number().min(0).max(100).default(10),
  widthFeet: z.number().positive(),
});

const paintInput = z.object({
  coats: z.number().int().positive().default(2),
  coverageSquareFeetPerGallon: z.number().positive().default(350),
  doors: z.number().int().min(0).default(1),
  lengthFeet: z.number().positive(),
  wallHeightFeet: z.number().positive().default(8),
  wastePercent: z.number().min(0).max(100).default(10),
  widthFeet: z.number().positive(),
  windows: z.number().int().min(0).default(2),
});

const downloadTimeInput = z.object({
  efficiencyPercent: z.number().min(1).max(100).default(90),
  fileSize: z.number().positive(),
  fileUnit: z.enum(['KB', 'MB', 'GB', 'TB']).default('GB'),
  speedMbps: z.number().positive(),
});

const wattsToAmpsInput = z.object({
  phase: z.enum(['dc', 'single-phase', 'three-phase']).default('single-phase'),
  powerFactor: z.number().positive().max(1).default(1),
  volts: z.number().positive(),
  watts: z.number().positive(),
});

const textInput = z.object({
  text: z.string().max(20000),
});

const jsonFormatterInput = z.object({
  json: z.string().max(20000),
  sortKeys: z.boolean().default(false),
});

const base64Input = z.object({
  mode: z.enum(['encode', 'decode']).default('encode'),
  text: z.string().max(20000),
});

const urlCodecInput = z.object({
  mode: z.enum(['encode', 'decode']).default('encode'),
  plusForSpace: z.boolean().default(false),
  text: z.string().max(20000),
});

const passwordInput = z.object({
  avoidAmbiguous: z.boolean().default(true),
  includeLowercase: z.boolean().default(true),
  includeNumbers: z.boolean().default(true),
  includeSymbols: z.boolean().default(true),
  includeUppercase: z.boolean().default(true),
  length: z.number().int().min(8).max(128).default(16),
});

const subnetInput = z.object({
  ipAddress: z.string().min(7).max(15),
  prefixLength: z.number().int().min(0).max(32),
});

const dateDifferenceInput = z.object({
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

function areaMeasurements(input: z.infer<typeof areaInput>): Record<string, number> {
  if (input.shape === 'rectangle') return { length: input.length ?? 0, width: input.width ?? 0 };
  if (input.shape === 'triangle') return { base: input.base ?? 0, height: input.height ?? 0 };
  if (input.shape === 'circle') return { radius: input.radius ?? 0 };
  if (input.shape === 'trapezoid') {
    return { baseA: input.baseA ?? 0, baseB: input.baseB ?? 0, height: input.height ?? 0 };
  }
  return { base: input.base ?? 0, height: input.height ?? 0 };
}

export const apiTools = [
  {
    category: 'calculators',
    description: 'Find a percent of a value or find what percent one number is of another.',
    examples: [
      { label: '18% of 240', inputs: { mode: 'percent-of', percent: 18, value: 240 } },
      { label: '18 is what percent of 240', inputs: { mode: 'what-percent', part: 18, whole: 240 } },
    ],
    inputSchema: percentageInput,
    keywords: ['percentage', 'percent', 'discount', 'markup'],
    name: 'Percentage Calculator',
    risk: 'low',
    slug: 'percentage-calculator',
    summary: 'Calculate percent-of and what-percent questions.',
    run(input) {
      if (input.mode === 'what-percent') {
        if (input.part === undefined || input.whole === undefined) {
          throw new Error('Enter part and whole for what-percent mode.');
        }
        const percent = calculatePercentOf(input.part, input.whole);
        return withUrls('percentage-calculator', {
          answer: `${formatNumber(input.part)} is ${formatNumber(percent, '%')} of ${formatNumber(input.whole)}.`,
          assumptions: ['The whole value is the comparison base.'],
          result: { percent },
          steps: [`${formatNumber(input.part)} / ${formatNumber(input.whole)} = ${formatNumber(input.part / input.whole)}`, `Multiply by 100 = ${formatNumber(percent, '%')}`],
          warnings: [],
        });
      }

      if (input.percent === undefined || input.value === undefined) {
        throw new Error('Enter percent and value for percent-of mode.');
      }
      const amount = calculatePercentageOf(input.percent, input.value);
      return withUrls('percentage-calculator', {
        answer: `${formatNumber(input.percent, '%')} of ${formatNumber(input.value)} is ${formatNumber(amount)}.`,
        assumptions: ['Percent means parts per 100.'],
        result: { amount },
        steps: [`${formatNumber(input.percent)} / 100 = ${formatNumber(input.percent / 100)}`, `${formatNumber(input.percent / 100)} x ${formatNumber(input.value)} = ${formatNumber(amount)}`],
        warnings: [],
      });
    },
  },
  {
    category: 'calculators',
    description: 'Find absolute value or absolute difference between two numbers.',
    examples: [
      { label: '|-12.5|', inputs: { value: -12.5 } },
      { label: 'Absolute difference between 82 and 57', inputs: { comparisonValue: 57, value: 82 } },
    ],
    inputSchema: absoluteValueInput,
    keywords: ['absolute value', 'absolute difference', 'distance from zero', 'distance between numbers'],
    name: 'Absolute Value Calculator',
    risk: 'low',
    slug: 'absolute-value-calculator',
    summary: 'Calculate absolute value, distance from zero, and absolute difference.',
    run(input) {
      const result = calculateAbsoluteValue(input.value, input.comparisonValue);

      if (input.comparisonValue !== undefined) {
        const signedDifference = result.signedDifference ?? 0;
        const absoluteDifference = result.absoluteDifference ?? 0;

        return withUrls('absolute-value-calculator', {
          answer: `The absolute difference between ${formatNumber(input.value)} and ${formatNumber(input.comparisonValue)} is ${formatNumber(absoluteDifference)}.`,
          assumptions: ['Absolute difference ignores direction and measures distance between the two numbers.'],
          result,
          steps: [
            `Signed difference: ${formatNumber(input.value)} - ${formatNumber(input.comparisonValue)} = ${formatNumber(signedDifference)}`,
            `Absolute difference: |${formatNumber(signedDifference)}| = ${formatNumber(absoluteDifference)}`,
          ],
          warnings: [],
        });
      }

      return withUrls('absolute-value-calculator', {
        answer: `The absolute value of ${formatNumber(input.value)} is ${formatNumber(result.absoluteValue)}.`,
        assumptions: ['Absolute value is distance from zero.'],
        result,
        steps: [`Write the number with absolute value bars: |${formatNumber(input.value)}|`, `Distance from zero = ${formatNumber(result.absoluteValue)}`],
        warnings: [],
      });
    },
  },
  {
    category: 'ai-tools',
    description: 'Estimate LLM API spend from requests, input tokens, output tokens, and model prices per 1M tokens.',
    examples: [
      {
        label: 'Support bot month',
        inputs: {
          inputPricePerMillion: 2,
          inputTokensPerRequest: 1200,
          outputPricePerMillion: 8,
          outputTokensPerRequest: 500,
          requests: 10000,
        },
      },
      {
        label: 'Small prototype run',
        inputs: {
          inputPricePerMillion: 0.15,
          inputTokensPerRequest: 300,
          outputPricePerMillion: 0.6,
          outputTokensPerRequest: 150,
          requests: 1000,
        },
      },
    ],
    inputSchema: aiTokenCostInput,
    keywords: ['ai token cost', 'llm cost', 'model pricing', 'api pricing', 'tokens'],
    name: 'AI Token Cost Calculator',
    risk: 'low',
    slug: 'ai-token-cost-calculator',
    summary: 'Estimate AI model input cost, output cost, total cost, and cost per request.',
    run(input) {
      const result = calculateAiTokenCost(
        input.inputTokensPerRequest,
        input.outputTokensPerRequest,
        input.requests,
        input.inputPricePerMillion,
        input.outputPricePerMillion,
      );

      return withUrls('ai-token-cost-calculator', {
        answer: `Estimated AI token cost is ${preciseMoney(result.totalCost)} total, or ${preciseMoney(result.costPerRequest)} per request.`,
        assumptions: [
          'Prices are entered in USD per 1 million tokens.',
          'Cached-token discounts, batch pricing, credits, taxes, and retries are not included unless you adjust the entered prices or request count.',
        ],
        result,
        steps: [
          `Input tokens: ${formatNumber(input.inputTokensPerRequest)} x ${formatNumber(input.requests)} = ${formatNumber(result.totalInputTokens)}`,
          `Input cost: ${formatNumber(result.totalInputTokens)} / 1,000,000 x ${preciseMoney(input.inputPricePerMillion)} = ${preciseMoney(result.inputCost)}`,
          `Output tokens: ${formatNumber(input.outputTokensPerRequest)} x ${formatNumber(input.requests)} = ${formatNumber(result.totalOutputTokens)}`,
          `Output cost: ${formatNumber(result.totalOutputTokens)} / 1,000,000 x ${preciseMoney(input.outputPricePerMillion)} = ${preciseMoney(result.outputCost)}`,
          `Total cost: ${preciseMoney(result.inputCost)} + ${preciseMoney(result.outputCost)} = ${preciseMoney(result.totalCost)}`,
        ],
        warnings: [
          'This is a planning estimate. Check your provider rate card, cached-token rules, discounts, taxes, and real usage logs before budgeting.',
        ],
      });
    },
  },
  {
    category: 'calculators',
    description: 'Run a basic arithmetic operation with two numbers.',
    examples: [
      { label: '18 + 24', inputs: { left: 18, operator: '+', right: 24 } },
      { label: '144 / 12', inputs: { left: 144, operator: '/', right: 12 } },
    ],
    inputSchema: basicCalculatorInput,
    keywords: ['basic calculator', 'arithmetic', 'add', 'subtract', 'multiply', 'divide'],
    name: 'Basic Calculator',
    risk: 'low',
    slug: 'basic-calculator',
    summary: 'Calculate a two-number arithmetic expression.',
    run(input) {
      const operator = input.operator as CalculatorOperator;
      const result = calculateBinary(input.left, operator, input.right);
      return withUrls('basic-calculator', {
        answer: `${formatCalculatorNumber(input.left)} ${operator} ${formatCalculatorNumber(input.right)} = ${formatCalculatorNumber(result)}.`,
        assumptions: ['Standard arithmetic order is not needed because this runner uses one operator and two numbers.'],
        result: { value: result },
        steps: [`Use ${operatorWord(operator)} on the two numbers`, `${formatCalculatorNumber(input.left)} ${operator} ${formatCalculatorNumber(input.right)} = ${formatCalculatorNumber(result)}`],
        warnings: [],
      });
    },
  },
  {
    category: 'statistics',
    description: 'Find the average, count, sum, minimum, and maximum of a list of numbers.',
    examples: [{ label: 'Average of 10, 12, and 14', inputs: { values: [10, 12, 14] } }],
    inputSchema: averageInput,
    keywords: ['average', 'mean', 'statistics'],
    name: 'Average Calculator',
    risk: 'low',
    slug: 'average-calculator',
    summary: 'Calculate the arithmetic mean of a number list.',
    run(input) {
      const values = input.values as number[];
      const sum = values.reduce((total, value) => total + value, 0);
      const average = sum / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);
      return withUrls('average-calculator', {
        answer: `The average is ${formatNumber(average)}.`,
        assumptions: ['This uses the arithmetic mean: add the values, then divide by how many values there are.'],
        result: { average, count: values.length, max, min, sum },
        steps: [`Add the values: ${values.map((value) => formatNumber(value)).join(' + ')} = ${formatNumber(sum)}`, `Divide by ${values.length}: ${formatNumber(sum)} / ${values.length} = ${formatNumber(average)}`],
        warnings: [],
      });
    },
  },
  {
    category: 'geometry',
    description: 'Calculate area for rectangles, triangles, circles, trapezoids, and parallelograms.',
    examples: [
      { label: '12 by 10 rectangle', inputs: { length: 12, shape: 'rectangle', width: 10 } },
      { label: 'Circle radius 5', inputs: { radius: 5, shape: 'circle' } },
    ],
    inputSchema: areaInput,
    keywords: ['area', 'geometry', 'rectangle', 'circle', 'triangle'],
    name: 'Area Calculator',
    risk: 'low',
    slug: 'area-calculator',
    summary: 'Calculate common 2D shape area.',
    run(input) {
      const result = calculateShapeArea(input.shape as AreaShape, areaMeasurements(input));
      return withUrls('area-calculator', {
        answer: `The ${input.shape} area is ${formatNumber(result.value)} square units.`,
        assumptions: ['All measurements use the same unit.', 'The answer is in square units of whatever unit you entered.'],
        result,
        steps: [`Formula: ${result.formula}`, `Measurements: ${result.metrics.map((metric) => `${metric.label} ${formatNumber(metric.value)}`).join(', ')}`, `Area = ${formatNumber(result.value)} square units`],
        warnings: [],
      });
    },
  },
  {
    category: 'developer-tools',
    description: 'Add, subtract, multiply, or divide two binary whole numbers.',
    examples: [{ label: '1011 + 110', inputs: { left: '1011', operator: '+', right: '110' } }],
    inputSchema: binaryInput,
    keywords: ['binary', 'base 2', 'developer', 'integer'],
    name: 'Binary Calculator',
    risk: 'low',
    slug: 'binary-calculator',
    summary: 'Calculate binary integer operations.',
    run(input) {
      const operator = input.operator as CalculatorOperator;
      const left = parseBinaryInteger(input.left, 'Left binary value');
      const right = parseBinaryInteger(input.right, 'Right binary value');
      const operation = calculateBinaryIntegerOperation(left, operator, right);
      const binary = serializeIntegerOperation(operation, formatBinaryInteger);
      const decimal = serializeIntegerOperation(operation, (value) => value.toString());
      return withUrls('binary-calculator', {
        answer: `${formatBinaryInteger(left)} ${operator} ${formatBinaryInteger(right)} = ${formatBinaryInteger(operation.result)} in binary.`,
        assumptions: ['Inputs are whole binary integers using only 0 and 1.', 'Division returns an integer quotient and may include a remainder.'],
        result: { binary, decimal },
        steps: [`Convert binary inputs to decimal: ${formatBinaryInteger(left)} = ${left.toString()}, ${formatBinaryInteger(right)} = ${right.toString()}`, `Run the ${operatorWord(operator)} operation`, `Convert the result back to binary: ${operation.result.toString()} = ${formatBinaryInteger(operation.result)}`],
        warnings: [],
      });
    },
  },
  {
    category: 'calculators',
    description: 'Add, subtract, multiply, or divide very large whole numbers.',
    examples: [{ label: '999999999999999999 + 1', inputs: { left: '999999999999999999', operator: '+', right: '1' } }],
    inputSchema: bigNumberInput,
    keywords: ['big number', 'large integer', 'whole number', 'arithmetic'],
    name: 'Big Number Calculator',
    risk: 'low',
    slug: 'big-number-calculator',
    summary: 'Calculate arithmetic with large whole numbers.',
    run(input) {
      const operator = input.operator as CalculatorOperator;
      const left = parseBigInteger(input.left, 'Left value');
      const right = parseBigInteger(input.right, 'Right value');
      const operation = calculateBigIntegerOperation(left, operator, right);
      const result = serializeIntegerOperation(operation, formatBigInteger);
      return withUrls('big-number-calculator', {
        answer: `${formatBigInteger(left)} ${operator} ${formatBigInteger(right)} = ${formatBigInteger(operation.result)}.`,
        assumptions: ['Inputs are whole integers. Use the decimal calculator for regular decimal numbers.'],
        result,
        steps: [`Read both values as whole integers`, `Run the ${operatorWord(operator)} operation`, `Result: ${formatBigInteger(operation.result)}`],
        warnings: [],
      });
    },
  },
  {
    category: 'everyday',
    description: 'Calculate tip amount, tax amount, total, and split per person.',
    examples: [{ label: '$64 subtotal, 18% tip, 2 people', inputs: { people: 2, subtotal: 64, taxPercent: 0, tipPercent: 18 } }],
    inputSchema: tipInput,
    keywords: ['tip', 'restaurant', 'split bill'],
    name: 'Tip Calculator',
    risk: 'low',
    slug: 'tip-calculator',
    summary: 'Estimate a tip and split a bill.',
    run(input) {
      const result = calculateTip(input.subtotal, input.tipPercent, input.taxPercent, input.people);
      return withUrls('tip-calculator', {
        answer: `The total is ${money(result.total)}, or ${money(result.perPerson)} per person.`,
        assumptions: ['Tax is calculated from the subtotal before tip.', 'The total is split evenly between people.'],
        result,
        steps: [`Tip: ${money(input.subtotal)} x ${formatNumber(input.tipPercent, '%')} = ${money(result.tipAmount)}`, `Tax: ${money(input.subtotal)} x ${formatNumber(input.taxPercent, '%')} = ${money(result.taxAmount)}`, `Total: subtotal + tip + tax = ${money(result.total)}`],
        warnings: [],
      });
    },
  },
  {
    category: 'health-fitness',
    description: 'Calculate BMI from metric height and weight.',
    examples: [{ label: '70 kg and 175 cm', inputs: { heightCm: 175, weightKg: 70 } }],
    inputSchema: bmiInput,
    keywords: ['bmi', 'body mass index', 'health'],
    name: 'BMI Calculator',
    risk: 'health',
    slug: 'bmi-calculator',
    summary: 'Estimate body mass index from height and weight.',
    run(input) {
      const result = calculateBmi(input.weightKg, input.heightCm);
      return withUrls('bmi-calculator', {
        answer: `The BMI is ${formatNumber(result.bmi)}, which is in the ${result.category} category.`,
        assumptions: ['Height is entered in centimeters and weight is entered in kilograms.'],
        result,
        steps: [`Height in meters: ${formatNumber(input.heightCm)} / 100 = ${formatNumber(input.heightCm / 100)}`, `BMI: ${formatNumber(input.weightKg)} / height^2 = ${formatNumber(result.bmi)}`],
        warnings: ['BMI is a broad screening estimate, not a medical diagnosis. Ask a qualified health professional for personal medical advice.'],
      });
    },
  },
  {
    category: 'finance',
    description: 'Estimate monthly mortgage payment including optional taxes, insurance, PMI, and HOA.',
    examples: [
      {
        label: '$400,000 home, $80,000 down, 6.5%, 30 years',
        inputs: { annualPropertyTax: 3600, annualRatePercent: 6.5, downPayment: 80000, homePrice: 400000, monthlyHoa: 0, monthlyInsurance: 150, monthlyPmi: 0, years: 30 },
      },
    ],
    inputSchema: mortgageInput,
    keywords: ['mortgage', 'payment', 'home loan'],
    name: 'Mortgage Calculator',
    risk: 'finance',
    slug: 'mortgage-calculator',
    summary: 'Estimate a mortgage payment and loan amount.',
    run(input) {
      const result = calculateMortgagePayment(input);
      return withUrls('mortgage-calculator', {
        answer: `Estimated monthly payment is ${money(result.totalMonthlyPayment)} including optional monthly costs.`,
        assumptions: ['Interest is estimated with a fixed-rate amortization formula.', 'Taxes, insurance, PMI, and HOA are estimates if entered.'],
        result,
        steps: [`Loan amount: ${money(input.homePrice)} - ${money(input.downPayment)} = ${money(result.loanAmount)}`, `Principal and interest: ${money(result.principalAndInterest)} per month`, `Add taxes, insurance, PMI, and HOA = ${money(result.totalMonthlyPayment)}`],
        warnings: ['This is a planning estimate, not financial advice or a lender quote. Real payments can change with fees, escrow rules, taxes, insurance, and loan terms.'],
      });
    },
  },
  {
    category: 'home-projects',
    description: 'Estimate concrete volume and common bag counts for slabs, footings, and posts.',
    examples: [{ label: '10 x 12 slab, 4 inches deep', inputs: { depthInches: 4, lengthFeet: 10, wastePercent: 10, widthFeet: 12 } }],
    inputSchema: concreteInput,
    keywords: ['concrete', 'slab', 'cubic yards', 'bags'],
    name: 'Concrete Calculator',
    risk: 'construction',
    slug: 'concrete-calculator',
    summary: 'Estimate concrete volume and bag counts.',
    run(input) {
      const result = calculateConcrete(input);
      return withUrls('concrete-calculator', {
        answer: `Estimated concrete needed is ${formatNumber(result.cubicYards)} cubic yards, including ${formatNumber(result.wastePercent, '%')} waste. That is about ${formatNumber(result.bags80lb)} 80 lb bags or ${formatNumber(result.bags60lb)} 60 lb bags.`,
        assumptions: ['Depth is converted from inches to feet.', 'Waste percent adds extra material for spills, uneven ground, and ordering cushion.'],
        result,
        steps: [`Base volume: ${formatNumber(input.lengthFeet)} x ${formatNumber(input.widthFeet)} x (${formatNumber(input.depthInches)} / 12)`, `Add waste: base volume x ${formatNumber(1 + input.wastePercent / 100)} = ${formatNumber(result.cubicFeet)} cubic feet`, `Cubic yards: ${formatNumber(result.cubicFeet)} / 27 = ${formatNumber(result.cubicYards)}`],
        warnings: ['This is a material estimate, not structural approval. Check project plans, local code, and a qualified professional for structural work.'],
      });
    },
  },
  {
    category: 'home-projects',
    description: 'Estimate paintable wall area, gallons needed, and gallons to buy.',
    examples: [{ label: '12 x 14 room, 8 ft walls, 2 coats', inputs: { coats: 2, coverageSquareFeetPerGallon: 350, doors: 1, lengthFeet: 12, wallHeightFeet: 8, wastePercent: 10, widthFeet: 14, windows: 2 } }],
    inputSchema: paintInput,
    keywords: ['paint', 'gallons', 'room'],
    name: 'Paint Calculator',
    risk: 'construction',
    slug: 'paint-calculator',
    summary: 'Estimate paint gallons for a room.',
    run(input) {
      const result = calculatePaintEstimate(input);
      return withUrls('paint-calculator', {
        answer: `Estimated paint needed is ${formatNumber(result.gallonsNeeded)} gallons, so buy about ${formatNumber(result.gallonsToBuy)} gallon(s).`,
        assumptions: ['Each door removes 20 square feet and each window removes 15 square feet.', 'Coverage is the paint label coverage per gallon.'],
        result,
        steps: [`Wall area: 2 x (${formatNumber(input.lengthFeet)} + ${formatNumber(input.widthFeet)}) x ${formatNumber(input.wallHeightFeet)} = ${formatNumber(result.wallSquareFeet)} sq ft`, `Subtract openings: ${formatNumber(result.wallSquareFeet)} - ${formatNumber(result.openingSquareFeet)} = ${formatNumber(result.paintableSquareFeet)} sq ft`, `Apply coats and waste, then divide by coverage = ${formatNumber(result.gallonsNeeded)} gallons`],
        warnings: ['Paint coverage varies by surface, color change, primer, and product label. This is a buying estimate.'],
      });
    },
  },
  {
    category: 'technology',
    description: 'Estimate download time from file size, unit, speed, and efficiency.',
    examples: [{ label: '5 GB at 80 Mbps', inputs: { efficiencyPercent: 90, fileSize: 5, fileUnit: 'GB', speedMbps: 80 } }],
    inputSchema: downloadTimeInput,
    keywords: ['download time', 'internet speed', 'Mbps'],
    name: 'Download Time Calculator',
    risk: 'low',
    slug: 'download-time-calculator',
    summary: 'Estimate how long a file download takes.',
    run(input) {
      const result = calculateDownloadTime(input.fileSize, input.fileUnit, input.speedMbps, input.efficiencyPercent);
      return withUrls('download-time-calculator', {
        answer: `Estimated download time is about ${durationText(result.seconds)}.`,
        assumptions: ['File units use decimal bytes.', 'Efficiency accounts for real-world overhead and speed changes.'],
        result: { duration: durationText(result.seconds), ...result },
        steps: [`Effective speed: ${formatNumber(input.speedMbps)} Mbps x ${formatNumber(input.efficiencyPercent, '%')} = ${formatNumber(result.effectiveMbps)} Mbps`, `Convert file size to bits, then divide by effective Mbps`, `Seconds: ${formatNumber(result.seconds)} (${durationText(result.seconds)})`],
        warnings: ['Actual downloads can change because of Wi-Fi, server limits, congestion, and background traffic.'],
      });
    },
  },
  {
    category: 'electrical',
    description: 'Convert watts to amps using voltage, phase, and power factor.',
    examples: [{ label: '600 watts at 120 volts', inputs: { phase: 'single-phase', powerFactor: 1, volts: 120, watts: 600 } }],
    inputSchema: wattsToAmpsInput,
    keywords: ['watts', 'amps', 'volts', 'electrical'],
    name: 'Watts To Amps Calculator',
    risk: 'electrical',
    slug: 'watts-to-amps-calculator',
    summary: 'Estimate amps from watts and volts.',
    run(input) {
      const result = calculateWattsToAmps({ ...input, phase: input.phase as ElectricalPowerPhase });
      return withUrls('watts-to-amps-calculator', {
        answer: `${formatNumber(input.watts)} watts at ${formatNumber(input.volts)} volts is about ${formatNumber(result.amps)} amps.`,
        assumptions: ['Power factor is included in the denominator.', 'Single-phase and DC use a phase factor of 1; three-phase uses square root of 3.'],
        result,
        steps: [`Formula: amps = watts / (volts x phase factor x power factor)`, `${formatNumber(input.watts)} / (${formatNumber(input.volts)} x ${formatNumber(result.phaseFactor)} x ${formatNumber(input.powerFactor)}) = ${formatNumber(result.amps)} amps`],
        warnings: ['This is a learning estimate, not electrical code or wiring approval. Ask a qualified electrician for safety-critical work.'],
      });
    },
  },
  {
    category: 'text-tools',
    description: 'Count words, characters, sentences, paragraphs, lines, bytes, and reading time.',
    examples: [{ label: 'Short paragraph', inputs: { text: 'Access Free Tools helps people finish quick browser tasks.' } }],
    inputSchema: textInput,
    keywords: ['word count', 'character count', 'reading time'],
    name: 'Word Counter',
    risk: 'privacy',
    slug: 'word-counter',
    summary: 'Analyze text length and reading time.',
    run(input) {
      const result = analyzeText(input.text);
      return withUrls('word-counter', {
        answer: `The text has ${result.words} words and ${result.characters} characters.`,
        assumptions: ['Words are counted from letter and number groups.', 'Estimated reading time uses about 200 words per minute.'],
        result,
        steps: [`Tokenize words from the text`, `Count characters, words, sentences, paragraphs, lines, and UTF-8 bytes`],
        warnings: ['Avoid sending private, regulated, or sensitive text to any API unless that workflow is appropriate.'],
      });
    },
  },
  {
    category: 'developer-tools',
    description: 'Format JSON and optionally sort object keys.',
    examples: [{ label: 'Small object', inputs: { json: '{"tool":"calculator","live":true}', sortKeys: false } }],
    inputSchema: jsonFormatterInput,
    keywords: ['json', 'format', 'developer'],
    name: 'JSON Formatter',
    risk: 'privacy',
    slug: 'json-formatter',
    summary: 'Format and inspect JSON text.',
    run(input) {
      const result = formatJsonText(input.json, input.sortKeys);
      return withUrls('json-formatter', {
        answer: `JSON parsed as a ${result.rootType} with ${result.keyCount} key(s).`,
        assumptions: ['Input must be valid JSON with double-quoted strings and valid commas/brackets.'],
        result,
        steps: ['Parse the JSON text', input.sortKeys ? 'Sort object keys recursively' : 'Keep the original key order', 'Pretty-print with two-space indentation'],
        warnings: ['Do not paste secrets, private keys, customer data, or regulated data into tools unless the workflow is appropriate.'],
      });
    },
  },
  {
    category: 'developer-tools',
    description: 'Encode plain text to Base64 or decode Base64 to UTF-8 text.',
    examples: [{ label: 'Encode hello', inputs: { mode: 'encode', text: 'hello' } }],
    inputSchema: base64Input,
    keywords: ['base64', 'encode', 'decode'],
    name: 'Base64 Encode Decode',
    risk: 'privacy',
    slug: 'base64-encode-decode',
    summary: 'Encode and decode Base64 text.',
    run(input) {
      const output = input.mode === 'encode' ? encodeBase64(input.text) : decodeBase64(input.text);
      return withUrls('base64-encode-decode', {
        answer: `Base64 ${input.mode === 'encode' ? 'encoded' : 'decoded'} output is ready.`,
        assumptions: ['Decode mode expects Base64 that represents UTF-8 text.'],
        result: { mode: input.mode, output },
        steps: [input.mode === 'encode' ? 'Convert text to UTF-8 bytes and encode with Base64 alphabet' : 'Normalize Base64 padding and decode UTF-8 bytes'],
        warnings: ['Base64 is encoding, not encryption. Do not treat it as a security layer.'],
      });
    },
  },
  {
    category: 'developer-tools',
    description: 'URL-encode or URL-decode text for query strings and links.',
    examples: [{ label: 'Encode tool name', inputs: { mode: 'encode', plusForSpace: false, text: 'Access Free Tools' } }],
    inputSchema: urlCodecInput,
    keywords: ['url encode', 'url decode', 'query string'],
    name: 'URL Encode Decode',
    risk: 'privacy',
    slug: 'url-encode-decode',
    summary: 'Encode or decode URL component text.',
    run(input) {
      const output =
        input.mode === 'encode'
          ? encodeUrlComponentValue(input.text, input.plusForSpace)
          : decodeUrlComponentValue(input.text, input.plusForSpace);
      return withUrls('url-encode-decode', {
        answer: `URL ${input.mode === 'encode' ? 'encoded' : 'decoded'} output is ready.`,
        assumptions: ['This works on URL component text, not full URL validation.'],
        result: { mode: input.mode, output },
        steps: [input.mode === 'encode' ? 'Escape characters that are unsafe inside URL components' : 'Convert percent-encoded sequences back to text'],
        warnings: ['Do not paste private tokens or signed URLs into tools unless the workflow is appropriate.'],
      });
    },
  },
  {
    category: 'developer-tools',
    description: 'Generate a random password with selected character groups.',
    examples: [{ label: '16 character password', inputs: { avoidAmbiguous: true, includeLowercase: true, includeNumbers: true, includeSymbols: true, includeUppercase: true, length: 16 } }],
    inputSchema: passwordInput,
    keywords: ['password', 'generator', 'security'],
    name: 'Password Generator',
    risk: 'privacy',
    slug: 'password-generator',
    summary: 'Generate a browser/server random password.',
    run(input) {
      const result = generatePassword(input);
      return withUrls('password-generator', {
        answer: `Generated a ${result.length}-character password with about ${formatNumber(result.estimatedEntropyBits)} bits of estimated entropy.`,
        assumptions: ['Entropy estimate is based on character pool size and length.'],
        result,
        steps: ['Build the character pool from selected groups', 'Choose random characters from the pool', 'Estimate entropy from pool size and length'],
        warnings: ['Use a password manager for real accounts. Never reuse important passwords.'],
      });
    },
  },
  {
    category: 'developer-tools',
    description: 'Calculate IPv4 subnet mask, wildcard, network, broadcast, and usable host range.',
    examples: [{ label: '192.168.1.10/24', inputs: { ipAddress: '192.168.1.10', prefixLength: 24 } }],
    inputSchema: subnetInput,
    keywords: ['subnet', 'ip', 'network'],
    name: 'Subnet Calculator',
    risk: 'low',
    slug: 'subnet-calculator',
    summary: 'Calculate IPv4 subnet details.',
    run(input) {
      const result = calculateSubnet(input.ipAddress, input.prefixLength);
      return withUrls('subnet-calculator', {
        answer: `Network is ${result.networkAddress}/${result.prefixLength}, with ${result.usableAddresses} usable address(es).`,
        assumptions: ['IPv4 subnet math is used.', '/31 and /32 are handled as special small subnet cases.'],
        result,
        steps: [`Convert IP and prefix to a 32-bit mask`, `Apply mask to get network: ${result.networkAddress}`, `Use wildcard to get broadcast: ${result.broadcastAddress}`],
        warnings: [],
      });
    },
  },
  {
    category: 'everyday',
    description: 'Find the number of days and calendar difference between two dates.',
    examples: [{ label: '2026-05-01 to 2026-05-15', inputs: { endDate: '2026-05-15', startDate: '2026-05-01' } }],
    inputSchema: dateDifferenceInput,
    keywords: ['date difference', 'days between dates', 'calendar'],
    name: 'Date Difference Calculator',
    risk: 'low',
    slug: 'date-calculator',
    summary: 'Calculate days between two dates.',
    run(input) {
      const result = calculateDateDifference(input.startDate, input.endDate);
      return withUrls('date-calculator', {
        answer: `There are ${result.days} day(s) between ${result.startDate} and ${result.endDate}.`,
        assumptions: ['Dates use YYYY-MM-DD format.', 'Calendar years, months, and days are shown separately from total days.'],
        result,
        steps: [`Parse both dates in YYYY-MM-DD format`, `Compare dates and count total days`, `Break the calendar difference into years, months, and days`],
        warnings: [],
      });
    },
  },
] satisfies ApiToolDefinition[];

const toolsBySlug = new Map(apiTools.map((tool) => [tool.slug, tool]));

export function listApiTools(): PublicApiToolDefinition[] {
  return apiTools.map(serializeApiTool);
}

export function getApiTool(slug: string) {
  return toolsBySlug.get(slug);
}

export function serializeApiTool(tool: ApiToolDefinition): PublicApiToolDefinition {
  return {
    category: tool.category,
    description: tool.description,
    examples: tool.examples,
    guide_url: guideUrl(tool.slug),
    input_schema: z.toJSONSchema(tool.inputSchema),
    keywords: tool.keywords,
    name: tool.name,
    risk: tool.risk,
    slug: tool.slug,
    summary: tool.summary,
    tool_url: toolUrl(tool.slug),
  };
}

export function runApiTool(slug: string, input: unknown): ApiToolRunResult {
  const tool = getApiTool(slug);

  if (!tool) {
    throw new Error(`Unknown API tool: ${slug}`);
  }

  const parsed = tool.inputSchema.safeParse(input ?? {});

  if (!parsed.success) {
    throw new ApiToolValidationError(
      'Tool input did not match the expected schema.',
      parsed.error.issues.map((issue) => `${issue.path.join('.') || 'input'}: ${issue.message}`),
    );
  }

  return {
    ...tool.run(parsed.data),
    inputs: parsed.data,
  };
}

export function searchApiTools(query = ''): PublicApiToolDefinition[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return listApiTools();

  return apiTools
    .filter((tool) => {
      const haystack = [tool.slug, tool.name, tool.summary, tool.description, tool.category, ...tool.keywords]
        .join(' ')
        .toLowerCase();
      return normalized
        .split(/\s+/)
        .filter(Boolean)
        .every((term) => haystack.includes(term));
    })
    .map(serializeApiTool);
}
