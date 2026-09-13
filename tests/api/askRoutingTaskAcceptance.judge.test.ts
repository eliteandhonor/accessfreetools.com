import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { answerUtilityQuestion } from '../../src/lib/askToolRouter';
import { POST as askPost } from '../../src/pages/api/v1/ask';

vi.mock('../../src/lib/privateEnv', () => ({
  getApiBetaToken: () => '',
  getOllamaApiKey: () => 'judge-fixture-not-a-credential',
  isAskEnabled: () => true,
  loadPrivateEnv: () => {},
}));

type Golden = {
  task: 'COR-01' | 'COR-02';
  question: string;
  slug: string;
  inputs: Record<string, unknown>;
  results: Record<string, number>;
};

const golden: Golden[] = [
  {
    task: 'COR-01', question: 'Convert 600 watts at 120 volts three-phase power factor 0.8 to amps.',
    slug: 'watts-to-amps-calculator', inputs: { watts: 600, volts: 120, phase: 'three-phase', powerFactor: 0.8 },
    results: { amps: 600 / (120 * Math.sqrt(3) * 0.8), phaseFactor: Math.sqrt(3) },
  },
  {
    task: 'COR-01', question: 'Convert 6e2 W at 1.2e2 V 3 phase PF of 80% to A.',
    slug: 'watts-to-amps-calculator', inputs: { watts: 600, volts: 120, phase: 'three-phase', powerFactor: 0.8 },
    results: { amps: 600 / (120 * Math.sqrt(3) * 0.8) },
  },
  ...[
    ['DC', 'dc', 1, 1], ['one phase PF 80%', 'single-phase', 0.8, 1],
    ['three-phase PF .8', 'three-phase', 0.8, Math.sqrt(3)],
  ].map(([qualifier, phase, powerFactor, factor]) => ({
    task: 'COR-01' as const, question: `Convert 12.5 amps at 120 volts ${qualifier} to watts.`,
    slug: 'amps-to-watts-calculator', inputs: { amps: 12.5, volts: 120, phase, powerFactor },
    results: { watts: 12.5 * 120 * Number(powerFactor) * Number(factor) },
  })),
  {
    task: 'COR-01', question: 'How much concrete for 3 by 4 meters, 10 cm deep?',
    slug: 'concrete-calculator', inputs: { lengthFeet: 3 / 0.3048, widthFeet: 4 / 0.3048, depthInches: 10 / 2.54, wastePercent: 10 },
    results: { cubicMeters: 1.32 },
  },
  {
    task: 'COR-01', question: 'How much concrete for 300 cm by 4000 mm, .1 meters thick with 0% waste?',
    slug: 'concrete-calculator', inputs: { lengthFeet: 300 / 30.48, widthFeet: 4000 / 304.8, depthInches: 0.1 / 0.3048 * 12, wastePercent: 0 },
    results: { cubicMeters: 1.2 },
  },
  {
    task: 'COR-01', question: 'How much concrete for 3 m by 4 feet, 100 mm deep with 5% waste?',
    slug: 'concrete-calculator', inputs: { lengthFeet: 3 / 0.3048, widthFeet: 4, depthInches: 100 / 25.4, wastePercent: 5 },
    results: { cubicMeters: 3 * (4 * 0.3048) * 0.1 * 1.05 },
  },
  ...['1000', '1,000', '1K', '1 thousand', 'thousand', '1M', '1 million', '1,000,000'].map((basis) => {
    const thousand = ['1000', '1,000', '1K', '1 thousand', 'thousand'].includes(basis);
    return {
      task: 'COR-01' as const,
      question: `Estimate AI token cost for 1000 requests with 1000 input tokens, 500 output tokens, $2 input and $8 output per ${basis} tokens.`,
      slug: 'ai-token-cost-calculator',
      inputs: { requests: 1000, inputTokensPerRequest: 1000, outputTokensPerRequest: 500, inputPricePerMillion: thousand ? 2000 : 2, outputPricePerMillion: thousand ? 8000 : 8, cachedInputTokensPerRequest: 0 },
      results: { totalCost: thousand ? 6000 : 6, costPerRequest: thousand ? 6 : 0.006 },
    };
  }),
  {
    task: 'COR-01', question: 'Estimate AI token cost for 1e3 requests with 1e3 input tokens, 5e2 output tokens, $2 input per 1M tokens and $.008 output per 1K tokens.',
    slug: 'ai-token-cost-calculator',
    inputs: { requests: 1000, inputTokensPerRequest: 1000, outputTokensPerRequest: 500, inputPricePerMillion: 2, outputPricePerMillion: 8, cachedInputTokensPerRequest: 0 },
    results: { totalCost: 6 },
  },
  ...[
    ['What is 18% of 1,000?', 18, 1000, 180],
    ['What is -.5% of -1,000.50?', -0.5, -1000.5, 5.0025],
    ['What is +1.8E1% of 1E+3?', 18, 1000, 180],
    ['What is .5% of .25?', 0.5, 0.25, 0.00125],
  ].map(([question, percent, value, amount]) => ({
    task: 'COR-02' as const, question: String(question), slug: 'percentage-calculator',
    inputs: { mode: 'percent-of', percent, value }, results: { amount: Number(amount) },
  })),
  ...[
    ['Calculate -2 - -3.', -2, '-', -3, 1],
    ['What is 1,000.50 divided by +2?', 1000.5, '/', 2, 500.25],
    ['What is .5 + -.25?', 0.5, '+', -0.25, 0.25],
    ['What is 1e3 + 2.5e-1?', 1000, '+', 0.25, 1000.25],
  ].map(([question, left, operator, right, value]) => ({
    task: 'COR-02' as const, question: String(question), slug: 'basic-calculator',
    inputs: { left, operator, right }, results: { value: Number(value) },
  })),
  ...[
    ['2026-05-01', '2026-05-15', 14], ['2026-05-15', '2026-05-01', 14],
    ['2024-02-28', '2024-03-01', 2], ['2026-05-01', '2026-05-01', 0],
  ].map(([startDate, endDate, days]) => ({
    task: 'COR-02' as const, question: `How many days between ${startDate} and ${endDate}?`,
    slug: 'date-calculator', inputs: { startDate, endDate }, results: { days: Number(days) },
  })),
];

const declines = [
  ...[
    'Convert 600 watts at 120 volts three-phase PF 0.8 at 50% load to amps.',
    'Convert 600 watts at 120 volts DC PF 80% to amps.',
    'Convert 600 watts at 120 volts three-phase PF 0 to amps.',
    'Convert 600 watts at 120 volts three-phase PF 120% to amps.',
    'Convert 600 watts at 120 volts three-phase PF .8 PF .9 to amps.',
    'Convert 600 watts at 120 volts three-phase line-to-neutral PF .8 to amps.',
    'How much concrete for 3 by 4 meters, 10 cm deep plus 2 cubic meters?',
    'How much concrete for 3 by 4 meters, 10 cm deep with 5% waste and 10% waste?',
    'How much concrete for 3 by 4 meters, 10 deep?',
    'Estimate AI token cost for 1000 requests with 1000 input tokens, 500 output tokens, $2 input and $8 output per 1000 tokens after a 50% discount.',
    'Estimate AI token cost for 1000 requests with 1000 input tokens, 500 output tokens, $2 input per 1K tokens and $8 output per 1B tokens.',
    'Estimate AI token cost for 1000 requests with 1000 input tokens, 500 output tokens, $2 input and $8 output per 1,00 tokens.',
  ].map((question) => ({ task: 'COR-01', question })),
  ...[
    'What is 2 + 3 * 4?', 'What is 2 plus 3 times 4?',
    'What is (2) + (3) * (4)?', 'Calculate (12) / (3) - (2)',
    'Calculate (2) plus (3) times (4)',
    'What is [2] + [3] * [4]?',
    'What is {2} + {3} * {4}?',
    'What is ((2)) + ((3)) * ((4))?',
    'What is 18% of 1,000 + 2?', 'What is 18% of 1,00?',
    'What is 18% of 1,000,00?', 'What is 18% of 1e+?',
    'What is 18% of 1e3.5?', 'What is 18% of 1e309?',
    'What is 2 + 3**2?', 'What is 2 + 3 /?', 'What is 2 + 3!?',
    'What is 2\u00d73\u00d74?',
    'What is 2026-05-01?',
    'How many days between 2026-05-01 and 2026-05-15 inclusive?',
    'How many days between 2026-05-01 and 2026-05-15 minus 2?',
    'How many days between 2026-02-29 and 2026-03-01?',
    'How many days between 2026-05-01T12:00:00Z and 2026-05-15T12:00:00Z?',
  ].map((question) => ({ task: 'COR-02', question })),
];

const observations: unknown[] = [];
let requestId = 0;
const fetchMock = vi.fn();

afterAll(() => {
  const outputDirectory = new URL('../../output/project-review-followup/COR-01-02-judge/', import.meta.url);
  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(new URL('judge-observations.json', outputDirectory),
    JSON.stringify({ generatedAt: new Date().toISOString(), observations }, null, 2));
});

describe.each(['parser-first', 'forced-fallback', 'local-fallback-enabled'])('independent COR acceptance: %s', (mode) => {
  beforeEach(() => {
    vi.stubEnv('AFT_ASK_FORCE_FALLBACK', mode === 'forced-fallback' ? 'true' : 'false');
    vi.stubEnv('AFT_ASK_ALLOW_LOCAL_ROUTER', mode === 'local-fallback-enabled' ? 'true' : 'false');
    // A deliberately partial, in-memory answer exposes fallback bypasses without any I/O.
    fetchMock.mockReset().mockImplementation(async () => new Response(JSON.stringify({
      message: { tool_calls: [{ function: { name: 'aft_basic_calculator', arguments: { left: 2, operator: '+', right: 3 } } }] },
    }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

  async function ask(task: string, question: string) {
    if (question === 'Calculate (12) / (3) - (2)') {
      fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({
        message: { tool_calls: [{ function: { name: 'aft_basic_calculator', arguments: { left: 12, operator: '/', right: 3 } } }] },
      }), { status: 200 }));
    }
    const response = await askPost({
      clientAddress: `cor-task-judge-${++requestId}`,
      request: new Request('https://judge.invalid/api/v1/ask', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message: question }),
      }),
    } as never);
    const body = await response.json();
    observations.push({ task, mode, question, status: response.status, body, mockFetchCalls: fetchMock.mock.calls.length });
    return { response, body };
  }

  it.each(golden)('$task complete inputs and independent result: $question', async ({ task, question, slug, inputs, results }) => {
    const { response, body } = await ask(task, question);
    expect(response.status, JSON.stringify(body)).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.route).toMatchObject({ source: 'parser', tool_slug: slug });
    expect(body.run.inputs).toEqual(inputs);
    for (const [key, value] of Object.entries(results)) expect(body.run.result[key], key).toBeCloseTo(value, 10);
    expect(body.answer).toBe(body.run.answer);
    expect(body.run.tool_url).toBe(`https://accessfreetools.com/tools/${slug}/`);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each(declines)('$task terminal decline: $question', async ({ task, question }) => {
    const { response, body } = await ask(task, question);
    expect.soft(response.status, JSON.stringify(body)).toBe(400);
    expect.soft(body.ok).toBe(false);
    expect.soft(body.run).toBeUndefined();
    expect.soft(body.message).toEqual(expect.any(String));
    expect.soft(fetchMock).not.toHaveBeenCalled();
  });

  it('direct chatbot declines a fully parenthesized chain', async () => {
    await expect(answerUtilityQuestion('What is (2) + (3) * (4)?')).rejects.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
