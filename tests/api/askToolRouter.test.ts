import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { runApiTool } from '../../src/lib/apiToolRegistry';
import { answerUtilityQuestion } from '../../src/lib/askToolRouter';
import { POST as askPost } from '../../src/pages/api/v1/ask';

// Never load local credentials or call a provider in this regression suite.
vi.mock('../../src/lib/privateEnv', () => ({
  getApiBetaToken: () => '',
  getOllamaApiKey: () => 'ask-router-test-key',
  isAskEnabled: () => true,
  loadPrivateEnv: () => {},
}));

interface SupportedQuestion {
  question: string;
  slug: string;
  inputs: Record<string, unknown>;
  result?: Record<string, unknown>;
  warning?: RegExp;
}

const supportedQuestions: SupportedQuestion[] = [
  {
    question: 'What is 18% of 1,000?',
    slug: 'percentage-calculator',
    inputs: { mode: 'percent-of', percent: 18, value: 1000 },
    result: { amount: 180 },
  },
  ...[
    ['What is 18% of 240?', 18, 240],
    ['What is -.5% of -1,000.50?', -0.5, -1000.5],
    ['What is +1.8e1% of 1e3?', 18, 1000],
    ['Calculate .5% of .25', 0.5, 0.25],
  ].map(([question, percent, value]) => ({
    question: String(question), slug: 'percentage-calculator', inputs: { mode: 'percent-of', percent, value },
  })),
  {
    question: '250 is what percent of 1,000?',
    slug: 'percentage-calculator', inputs: { mode: 'what-percent', part: 250, whole: 1000 },
  },
  ...[
    ['What is 18 + 24?', 18, '+', 24],
    ['Calculate -2 - -3.', -2, '-', -3],
    ['What is .5 + -.25?', 0.5, '+', -0.25],
    ['What is 1e3 + 2.5e-1?', 1000, '+', 0.25],
    ['What is 1,000.50 divided by +2?', 1000.5, '/', 2],
    ['Calculate 1,000,000 times 2', 1000000, '*', 2],
    ['What is 2+3?', 2, '+', 3],
  ].map(([question, left, operator, right]) => ({
    question: String(question), slug: 'basic-calculator', inputs: { left, operator, right },
  })),
  ...['2026-05-01 and 2026-05-15', '2026-05-15 and 2026-05-01'].map((dates) => ({
    question: `How many days between ${dates}?`, slug: 'date-calculator',
    inputs: { startDate: dates.split(' and ')[0], endDate: dates.split(' and ')[1] }, result: { days: 14 },
  })),
  ...[
    ['Convert 600 watts at 120 volts three-phase power factor 0.8 to amps.', 'three-phase', 0.8],
    ['Convert 600 watts at 120 volts 3-phase PF=.8 to amps.', 'three-phase', 0.8],
    ['Convert 600 watts at 120 volts single phase PF 80% to amps.', 'single-phase', 0.8],
    ['Convert 600 watts at 120 volts DC to amps.', 'dc', 1],
    ['Convert 600 watts to amps at 120 volts.', 'single-phase', 1],
    ['Convert 600 watts at 120 volts PF 0.8 to amps.', 'single-phase', 0.8],
  ].map(([question, phase, powerFactor]) => ({
    question: String(question), slug: 'watts-to-amps-calculator',
    inputs: { watts: 600, volts: 120, phase, powerFactor }, warning: /electrical code/i,
  })),
  ...[
    ['Convert 12.5 amps at 120 volts to watts.', 'dc', 1],
    ['Convert 12.5 amps at 120 volts three-phase PF 0.8 to watts.', 'three-phase', 0.8],
    ['Convert 12.5 amps at 120 volts PF 0.8 to watts.', 'single-phase', 0.8],
  ].map(([question, phase, powerFactor]) => ({
    question: String(question), slug: 'amps-to-watts-calculator',
    inputs: { amps: 12.5, volts: 120, phase, powerFactor }, warning: /qualified advice/i,
  })),
  {
    question: 'How much concrete for 3 by 4 meters, 10 cm deep?', slug: 'concrete-calculator',
    inputs: { lengthFeet: 3 / 0.3048, widthFeet: 4 / 0.3048, depthInches: 10 / 2.54, wastePercent: 10 },
    warning: /structural/i,
  },
  {
    question: 'How much concrete for 3 m by 4 feet, 10 cm deep with 5% waste?', slug: 'concrete-calculator',
    inputs: { lengthFeet: 3 / 0.3048, widthFeet: 4, depthInches: 10 / 2.54, wastePercent: 5 },
    warning: /structural/i,
  },
  ...['How much concrete for a 10 by 12 slab 4 inches thick?', 'How much concrete for 10 feet by 12 feet, 4 in deep?'].map((question) => ({
    question, slug: 'concrete-calculator',
    inputs: { lengthFeet: 10, widthFeet: 12, depthInches: 4, wastePercent: 10 }, warning: /structural/i,
  })),
  ...['1000', '1,000', '1K', '1M', '1,000,000', 'million'].map((denominator) => ({
    question: `Estimate AI token cost for 1000 requests with 1000 input tokens, 500 output tokens, $2 input and $8 output per ${denominator} tokens.`,
    slug: 'ai-token-cost-calculator',
    inputs: {
      inputPricePerMillion: ['1000', '1,000', '1K'].includes(denominator) ? 2000 : 2,
      outputPricePerMillion: ['1000', '1,000', '1K'].includes(denominator) ? 8000 : 8,
      requests: 1000, inputTokensPerRequest: 1000, outputTokensPerRequest: 500,
    },
    result: { totalCost: ['1000', '1,000', '1K'].includes(denominator) ? 6000 : 6 },
    warning: /planning estimate/i,
  })),
  {
    question: 'Estimate AI token cost for 10,000 requests with 1,200 input tokens, 500 output tokens, $2 input and $8 output per 1M tokens.',
    slug: 'ai-token-cost-calculator',
    inputs: { requests: 10000, inputTokensPerRequest: 1200, outputTokensPerRequest: 500, inputPricePerMillion: 2, outputPricePerMillion: 8 },
    result: { totalCost: 64 },
  },
  {
    question: 'Estimate AI token cost for 1000 requests with 1000 input tokens, 500 output tokens, $2 input per 1K tokens and $8 output per 1M tokens.',
    slug: 'ai-token-cost-calculator',
    inputs: { requests: 1000, inputTokensPerRequest: 1000, outputTokensPerRequest: 500, inputPricePerMillion: 2000, outputPricePerMillion: 8 },
    result: { totalCost: 2004 },
  },
  { question: 'Convert 300 Ah at 12 V to watt-hours.', slug: 'amp-hours-to-watt-hours-calculator', inputs: { ampHours: 300, volts: 12 } },
  { question: 'Convert 300 Ah at 12 V to watt-hours!', slug: 'amp-hours-to-watt-hours-calculator', inputs: { ampHours: 300, volts: 12 } },
  { question: 'How long will a 5GB file take to download at 80 Mbps?', slug: 'download-time-calculator', inputs: { fileSize: 5, fileUnit: 'GB', speedMbps: 80 } },
  { question: 'What is the area of a 12 by 10 rectangle?', slug: 'area-calculator', inputs: { length: 12, width: 10, shape: 'rectangle' } },
  { question: 'What is the average of 10, 12, and 14?', slug: 'average-calculator', inputs: { values: [10, 12, 14] } },
  { question: 'Calculate binary 1011 + 110', slug: 'binary-calculator', inputs: { left: '1011', operator: '+', right: '110' } },
  { question: 'Calculate big number 12345678901234567890 + 1', slug: 'big-number-calculator', inputs: { left: '12345678901234567890', operator: '+', right: '1' } },
  { question: 'What is the absolute value of -12.5?', slug: 'absolute-value-calculator', inputs: { value: -12.5 } },
  { question: 'What is the absolute difference between 82 and 57?', slug: 'absolute-value-calculator', inputs: { value: 82, comparisonValue: 57 } },
  { question: 'Convert 600 W at 120 V to A.', slug: 'watts-to-amps-calculator', inputs: { watts: 600, volts: 120, phase: 'single-phase', powerFactor: 1 } },
  { question: 'What is the absolute value of -1,000.5?', slug: 'absolute-value-calculator', inputs: { value: -1000.5 } },
  { question: 'What is the average of 1,000, 2,000, and 3,000?', slug: 'average-calculator', inputs: { values: [1000, 2000, 3000] } },
  { question: 'What is the average of .5, -2.5, and 1e1?', slug: 'average-calculator', inputs: { values: [0.5, -2.5, 10] } },
  { question: 'What is the area of a circle with radius 5?', slug: 'area-calculator', inputs: { shape: 'circle', radius: 5 } },
  { question: 'What is the area of a 12 by 10 triangle?', slug: 'area-calculator', inputs: { shape: 'triangle', base: 12, height: 10 } },
  { question: 'Calculate BMI for 70 kg and 175 cm.', slug: 'bmi-calculator', inputs: { weightKg: 70, heightCm: 175 } },
  { question: 'Calculate tip on $100 at 15%.', slug: 'tip-calculator', inputs: { subtotal: 100, tipPercent: 15, people: 1, taxPercent: 0 } },
];

const declinedQuestions = [
  'What is 2 + 3 * 4?',
  'What is 2 * 3 + 4?',
  'What is 2x3x4?',
  'What is 2 x 3 x 4?',
  'What is (2 + 3) * 4?',
  'What is 2 + 3 +?',
  'What is 2 + 3 and 4 + 5?',
  'What is 18% of 240 and 5% of 100?',
  'What is 18% of 1,000 + 2?',
  'What is 18% of 1,00?',
  'What is 18%of1,00?',
  'What is 18% of 1,000,00?',
  'What is 18% of 1.000,50?',
  'What is 18% of 1e?',
  'What is 18% of 1e3.5?',
  'What is 2 + 3kg?',
  'What is 2 + 3^2?',
  'What is 2 + 3 = 9?',
  'What is 2 + 3 /?',
  'Calculate binary 1011 + 110 * 10',
  'Calculate binary 1011 + 112',
  'Calculate big number 12345678901234567890 + 1 * 2',
  'What is the absolute value of -12.5 plus 2?',
  'What is the absolute value of -1,00?',
  'What is the absolute difference between 82 and 57 and 3?',
  'What is the average of 1,00 and 2?',
  'What is the average of 2 + 3 * 4?',
  'What is the average of 10, 12, and 14 excluding 10?',
  'What is the area of a 12 by 10 rectangle minus 4?',
  'What is the area of a 12 by 10 by 3 rectangle?',
  'What is the area of a 12 feet by 10 meters rectangle?',
  'Calculate BMI for 70 kg and 175 cm at age 10.',
  'Calculate tip on $100 at 15% split between 4 people.',
  'Convert 300 Ah at 12 V to watt-hours at 50% efficiency.',
  'How long will a 5GB file take to download at 80 Mbps at 50% efficiency?',
  'How long will a 5GB file take to download at 80 MBps?',
  'How many business days between 2026-05-01 and 2026-05-15?',
  'How many days between 2026-05-15 and 2026-05-01 inclusive?',
  'What is 2026-05-01?',
  'How many days between 2026-02-30 and 2026-03-01?',
  'Convert 600 watts at 120 volts two-phase PF 0.8 to amps.',
  'Convert 600 watts at 120 volts single-phase three-phase to amps.',
  'Convert 600 watts at 120 volts DC PF 0.8 to amps.',
  'Convert 600 watts at 120 volts power factor unknown to amps.',
  'Convert 600 watts at 120 volts PF 0.8 PF 0.9 to amps.',
  'Convert 600 watts at 120 volts PF 0.8 or 0.9 to amps.',
  'Convert 600 watts at 120 volts PF 0.8lagging to amps.',
  'Convert 600 watts at 120 volts three-phase line-to-neutral to amps.',
  'Convert 600 watts at 120 volts AC to amps.',
  'Convert 600 kilowatts at 120 volts to amps.',
  'How much concrete for 3 by 4 meters, 10 cm deep including footings?',
  'How much concrete for 3 by 4 meters, 10 deep?',
  'How much concrete for 3 by 4, 10 cm deep?',
  'How much concrete for 3 by 4?',
  'How much concrete for 3 m by 412 cm deep?',
  'How much concrete for 3 yards by 4 yards, 4 inches deep?',
  'How much concrete for a 10 by 12 slab 4 inches thick plus 2 cubic yards?',
  'Estimate AI token cost for 1000 requests with 1000 input tokens, 500 output tokens, $2 input and $8 output.',
  'Estimate AI token cost for 1000 requests with 1000 input tokens, 500 output tokens, $2 input and $8 output per 100 tokens.',
  'Estimate AI token cost for 1000 requests with 1000 input tokens, 500 output tokens, $2 input and $8 output per 1M tokens plus tax.',
  'Estimate AI token cost for 1000 requests with 1000 input tokens, 500 output tokens, $2 input and $8 output per 1M tokens with 50% cached input.',
];

let requestId = 0;

async function ask(message: string) {
  const response = await askPost({
    clientAddress: `ask-router-regression-${++requestId}`,
    request: new Request('https://accessfreetools.test/api/v1/ask', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message }),
    }),
  } as never);
  return { response, body: await response.json() };
}

describe.each(['parser-first', 'forced-fallback', 'local-fallback-enabled'])('complete Ask questions: %s', (mode) => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubEnv('AFT_ASK_FORCE_FALLBACK', mode === 'forced-fallback' ? 'true' : 'false');
    vi.stubEnv('AFT_ASK_ALLOW_LOCAL_ROUTER', mode === 'local-fallback-enabled' ? 'true' : 'false');
    fetchMock.mockReset().mockImplementation(() => { throw new Error('Network disabled by Ask regression harness'); });
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it.each(supportedQuestions)('preserves inputs and deterministic output: $question', async ({ question, slug, inputs, result, warning }) => {
    const { response, body } = await ask(question);
    expect(response.status, JSON.stringify(body)).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.route).toMatchObject({ source: 'parser', tool_slug: slug });
    const expected = runApiTool(slug, inputs);
    expect(body.run.inputs).toEqual(expected.inputs);
    expect(body.run.result).toEqual(expected.result);
    expect(body.answer).toBe(expected.answer);
    expect(body.run.warnings).toEqual(expected.warnings);
    expect(body.run.assumptions).toEqual(expected.assumptions);
    expect(body.run.tool_url).toBe(expected.tool_url);
    if (result) expect(body.run.result).toMatchObject(result);
    if (warning) expect(body.run.warnings.join(' ')).toMatch(warning);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each(declinedQuestions)('declines the complete unsupported question without provider fallback: %s', async (question) => {
    // Even a provider willing to return the old wrong prefix must not revive a declined question.
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ message: { tool_calls: [{ function: {
      name: 'aft_basic_calculator', arguments: { left: 2, operator: '+', right: 3 },
    } }] } }), { status: 200 }));
    const { response, body } = await ask(question);
    expect(response.status, JSON.stringify(body)).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.message).toEqual(expect.any(String));
    expect(body.message.length).toBeGreaterThan(20);
    expect(body.run).toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    { question: 'What is 2\u00d73\u00d74?', inputs: { left: 2, operator: '*', right: 3 } },
    ...[['\u00d7', '*'], ['\u00f7', '/'], ['\u2212', '-']].flatMap(([symbol, operator]) => [
      `What is 12${symbol}3${symbol}2?`,
      `What is 12 ${symbol} 3 ${symbol} 2?`,
      `Calculate (12)${symbol}(3)${symbol}(2)`,
      `Calculate 12${symbol}3`,
    ].map((question) => ({ question, inputs: { left: 12, operator, right: 3 } }))),
    { question: 'What is 2\u00d73 + 4?', inputs: { left: 2, operator: '*', right: 3 } },
    { question: 'What is 12\u00f73\u22122?', inputs: { left: 12, operator: '/', right: 3 } },
  ])('J2-01: declines unsupported Unicode arithmetic without a partial provider run: $question', async ({ question, inputs }) => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ message: { tool_calls: [{ function: {
      name: 'aft_basic_calculator', arguments: inputs,
    } }] } }), { status: 200 }));
    const { response, body } = await ask(question);
    expect(response.status, JSON.stringify(body)).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.message).toEqual(expect.any(String));
    expect(body.run).toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each(['80MBps', '80 MBps', '80Mbps', '80 Mbps'])('J2-02: preserves the complete speed unit: %s', async (speed) => {
    const inputs = { fileSize: 5, fileUnit: 'GB', speedMbps: 80, efficiencyPercent: 90 };
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ message: { tool_calls: [{ function: {
      name: 'aft_download_time_calculator', arguments: inputs,
    } }] } }), { status: 200 }));
    const { response, body } = await ask(`How long will a 5GB file take to download at ${speed}?`);
    if (speed.includes('MBps')) {
      expect(response.status, JSON.stringify(body)).toBe(400);
      expect(body.ok).toBe(false);
      expect(body.message).toMatch(/MBps means megabytes per second/);
      expect(body.run).toBeUndefined();
    } else {
      const expected = runApiTool('download-time-calculator', inputs);
      expect(response.status, JSON.stringify(body)).toBe(200);
      expect(body.ok).toBe(true);
      expect(body.route).toMatchObject({ source: 'parser', tool_slug: 'download-time-calculator' });
      expect(body.run.inputs).toEqual(inputs);
      expect(body.run.result).toEqual(expected.result);
      expect(body.run.result.effectiveMbps).toBe(72);
      expect(body.run.result.seconds).toBeCloseTo(5e9 * 8 / (72 * 1e6), 10);
      expect(body.answer).toBe(expected.answer);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    'Calculate 2 + 3!',
    'Calculate 2 + 3!?',
    'Calculate 2 + 3!.',
    'Calculate 2 + 3 !',
    'Calculate 2 + 3 !?',
    'Calculate 2 + 3!   ',
    'Calculate 2 + 3!!',
    'Calculate 2 + .5!',
    'Calculate 3!',
    'Calculate 3!?',
    'Calculate (2 + 3)!',
    'Calculate |-3|!',
    'Calculate |-3|!?',
    'Calculate 2! + 3',
    'What is 18% of 1,000!',
    'What is the average of 1, 2, and 3!',
  ])('J2-03: declines factorials without stripping the operator: %s', async (question) => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ message: { tool_calls: [{ function: {
      name: 'aft_basic_calculator', arguments: { left: 2, operator: '+', right: 3 },
    } }] } }), { status: 200 }));
    const { response, body } = await ask(question);
    expect(response.status, JSON.stringify(body)).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.message).toEqual(expect.any(String));
    expect(body.run).toBeUndefined();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('applies the same complete-question boundary to direct chatbot calls', async () => {
    const answer = await answerUtilityQuestion('What is 18% of 1,000?');
    expect(answer.run.inputs).toMatchObject({ percent: 18, value: 1000 });
    await expect(answerUtilityQuestion('What is 2 + 3 * 4?')).rejects.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('retains model routing for other complete utility requests', async () => {
    const inputs = { homePrice: 125000, downPayment: 25000, annualRatePercent: 5, years: 30 };
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ message: { tool_calls: [{ function: {
      name: 'aft_mortgage_calculator', arguments: inputs,
    } }] } }), { status: 200 }));
    const { response, body } = await ask('What is the monthly mortgage payment for $125000 with $25000 down at 5% for 30 years?');
    if (mode === 'forced-fallback') {
      expect(response.status).toBe(400);
      expect(fetchMock).not.toHaveBeenCalled();
    } else {
      expect(response.status, JSON.stringify(body)).toBe(200);
      expect(body.route).toMatchObject({ source: 'ollama', tool_slug: 'mortgage-calculator' });
      expect(body.run.inputs).toEqual(runApiTool('mortgage-calculator', inputs).inputs);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    }
  });
});
