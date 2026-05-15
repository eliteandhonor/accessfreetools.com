import { z } from 'zod';
import {
  analyzeText,
  calculateBmi,
  calculateConcrete,
  calculateDateDifference,
  calculateDownloadTime,
  calculateMortgagePayment,
  calculatePaintEstimate,
  calculatePercentOf,
  calculatePercentageOf,
  calculateSubnet,
  calculateTip,
  calculateWattsToAmps,
  decodeBase64,
  decodeUrlComponentValue,
  encodeBase64,
  encodeUrlComponentValue,
  formatCalculatorNumber,
  formatJsonText,
  generatePassword,
  type ElectricalPowerPhase,
} from './calculator';

const SITE_ORIGIN = 'https://accessfreetools.com';

export type ApiToolRisk = 'low' | 'finance' | 'health' | 'construction' | 'electrical' | 'privacy';

export interface ApiToolRunResult {
  answer: string;
  assumptions: string[];
  guide_url: string;
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

function formatNumber(value: number, suffix = '') {
  return `${formatCalculatorNumber(value)}${suffix}`;
}

function money(value: number) {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: 2,
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

const percentageInput = z.object({
  mode: z.enum(['percent-of', 'what-percent']).default('percent-of'),
  part: z.number().optional(),
  percent: z.number().optional(),
  value: z.number().optional(),
  whole: z.number().optional(),
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
        answer: `Estimated concrete needed is ${formatNumber(result.cubicYards)} cubic yards, including ${formatNumber(result.wastePercent, '%')} waste.`,
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
        answer: `Estimated download time is about ${formatNumber(result.minutes)} minutes.`,
        assumptions: ['File units use decimal bytes.', 'Efficiency accounts for real-world overhead and speed changes.'],
        result,
        steps: [`Effective speed: ${formatNumber(input.speedMbps)} Mbps x ${formatNumber(input.efficiencyPercent, '%')} = ${formatNumber(result.effectiveMbps)} Mbps`, `Convert file size to bits, then divide by effective Mbps`, `Seconds: ${formatNumber(result.seconds)} (${formatNumber(result.minutes)} minutes)`],
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

  return tool.run(parsed.data);
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
