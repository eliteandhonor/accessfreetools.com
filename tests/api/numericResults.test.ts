import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getApiTool, runApiTool, type ApiToolDefinition } from '../../src/lib/apiToolRegistry';
import { POST as runPost } from '../../src/pages/api/v1/run/[slug]';
import { POST as mcpPost } from '../../src/pages/mcp';
import { calculateDateShift } from '../../src/lib/calculator';

const noNetwork = vi.fn(() => { throw new Error('Numeric result tests must not use the network'); });
let requestId = 0;

beforeEach(() => {
  vi.stubEnv('AFT_API_BETA_TOKEN', 'numeric-test-token');
  vi.stubGlobal('fetch', noNetwork);
});

afterEach(() => {
  expect(noNetwork).not.toHaveBeenCalled();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

async function callTool(transport: 'REST' | 'MCP', slug: string, inputs: unknown) {
  requestId += 1;
  const body = transport === 'REST' ? { inputs } : {
    id: requestId, jsonrpc: '2.0', method: 'tools/call',
    params: { name: 'run_tool', arguments: { slug, inputs } },
  };
  const request = new Request(`https://example.test/${transport === 'REST' ? `api/v1/run/${slug}` : 'mcp'}`, {
    method: 'POST', body: JSON.stringify(body), headers: {
      'content-type': 'application/json', accept: 'application/json, text/event-stream',
      'mcp-protocol-version': '2025-06-18', 'x-aft-api-token': 'numeric-test-token',
    },
  });
  const context = { request, params: { slug }, clientAddress: `numeric-test-${requestId}` };
  const response = await (transport === 'REST' ? runPost(context as never) : mcpPost(context as never));
  return { response, body: await response.json() };
}

const overflowCases = [
  { label: 'positive basic overflow', slug: 'basic-calculator', inputs: { left: 1e308, operator: '*', right: 10 } },
  { label: 'negative basic overflow', slug: 'basic-calculator', inputs: { left: -1e308, operator: '*', right: 10 } },
  { label: 'percentage overflow', slug: 'percentage-calculator', inputs: { mode: 'percent-of', percent: 1e308, value: 1000 } },
  { label: 'mortgage overflow', slug: 'mortgage-calculator', inputs: { homePrice: 1e308, downPayment: 0, annualRatePercent: 100000, years: 30 } },
];

describe('COR-04 shared numeric result boundary', () => {
  it.each(overflowCases)('rejects $label before serialization', ({ slug, inputs }) => {
    expect(() => runApiTool(slug, inputs)).toThrow(/supported numeric range/i);
  });

  it.each([NaN, Infinity, -Infinity])('rejects a nested non-finite number %s', (value) => {
    const tool: ApiToolDefinition = getApiTool('basic-calculator')!;
    const ordinary = tool.run({ left: 1, operator: '+', right: 2 });
    vi.spyOn(tool, 'run').mockReturnValue({ ...ordinary, result: { rows: [{ valid: null }, { nested: [value] }] } });
    expect(() => runApiTool(tool.slug, { left: 1, operator: '+', right: 2 })).toThrow(/supported numeric range/i);
  });

  it('preserves nested intentional nulls and nonnumeric content', () => {
    const tool: ApiToolDefinition = getApiTool('basic-calculator')!;
    const ordinary = tool.run({ left: 1, operator: '+', right: 2 });
    const result = { rows: [null, { unavailable: null, zero: 0, text: 'Infinity', flag: false }] };
    vi.spyOn(tool, 'run').mockReturnValue({ ...ordinary, result });
    expect(runApiTool(tool.slug, { left: 1, operator: '+', right: 2 }).result).toEqual(result);
  });
});

describe.each(['REST', 'MCP'] as const)('%s numeric output contracts', (transport) => {
  it.each([
    { earlier: '2024-02-29', later: '2025-03-28', years: 1, months: 0, days: 28, totalDays: 393 },
    { earlier: '2026-01-29', later: '2026-03-01', years: 0, months: 1, days: 1, totalDays: 31 },
    { earlier: '2026-01-30', later: '2026-03-01', years: 0, months: 1, days: 1, totalDays: 30 },
    { earlier: '2026-01-31', later: '2026-03-01', years: 0, months: 1, days: 1, totalDays: 29 },
  ].flatMap((fixture) => [false, true].map((reversed) => ({ ...fixture, reversed }))))(
    'J4 explains and reconstructs $earlier to $later (reversed: $reversed)', async ({ earlier, later, years, months, days, totalDays, reversed }) => {
      const { response, body } = await callTool(transport, 'date-calculator', {
        startDate: reversed ? later : earlier, endDate: reversed ? earlier : later,
      });
      expect(response.status).toBe(200);
      if (transport === 'MCP') expect(body.result.isError).not.toBe(true);
      const payload = transport === 'REST' ? body : JSON.parse(body.result.content[0].text);
      expect(payload.ok).toBe(true);
      expect(payload.run.result).toMatchObject({
        calendarYears: years, calendarMonths: months, calendarDays: days, days: totalDays,
        direction: reversed ? 'backward' : 'forward',
      });
      expect(payload.run.assumptions).toContain('Measure from the earlier date to the later date. Reversed inputs keep the same nonnegative difference.');
      expect(payload.run.assumptions).toContain('Count total elapsed days separately using UTC dates.');
      expect(payload.run.steps).toEqual([
        'Find the largest whole-month offset that does not pass the later date.',
        "Apply the offset once from the earlier date. If its day is missing in the target month, use that month's last day.",
        'Split the offset into years and months (years * 12 + months), then count the remaining days.',
      ]);
      const result = payload.run.result;
      expect(calculateDateShift(earlier, result.calendarYears, result.calendarMonths, 0, result.calendarDays, 'add').resultDate).toBe(later);
    },
  );

  it.each([
    { rate: 1e-12, expected: 100000 / 360 },
    { rate: 100000, expected: 100000 * (100000 / 1200) },
  ])('returns a stable COR-05 mortgage payment at $rate percent', async ({ rate, expected }) => {
    const { response, body } = await callTool(transport, 'mortgage-calculator', {
      homePrice: 125000, downPayment: 25000, annualRatePercent: rate, years: 30,
    });
    expect(response.status).toBe(200);
    if (transport === 'MCP') expect(body.result.isError).not.toBe(true);
    const payload = transport === 'REST' ? body : JSON.parse(body.result.content[0].text);
    expect(payload.ok).toBe(true);
    expect(Math.abs(payload.run.result.monthlyPayment - expected)).toBeLessThan(1e-8);
    expect(payload.run.result.totalPaid).toBeGreaterThanOrEqual(100000 - 1e-7);
    expect(payload.run.result.totalInterest).toBeGreaterThanOrEqual(-1e-7);
    expect(payload.run.answer).not.toMatch(/NaN|Infinity|Error/);
  });

  it.each(overflowCases)('reports $label using the existing error contract', async ({ slug, inputs }) => {
    const { response, body } = await callTool(transport, slug, inputs);
    expect(response.headers.get('cache-control')).toBe('no-store');
    if (transport === 'REST') {
      expect(response.status).toBe(400);
      expect(body).toMatchObject({ ok: false, message: expect.stringMatching(/supported numeric range/i) });
      expect(body).not.toHaveProperty('run');
    } else {
      expect(response.status).toBe(200);
      expect(body.result.isError).toBe(true);
      expect(body.result.content[0].text).toMatch(/supported numeric range/i);
    }
  });

  it.each([
    { slug: 'basic-calculator', inputs: { left: 1e308, operator: '*', right: 1 }, result: { value: 1e308 } },
    { slug: 'baking-pan-conversion-calculator', inputs: { oldLengthInches: 8, oldWidthInches: 8, newLengthInches: 8, newWidthInches: 8 }, result: { scaledServings: null } },
    { slug: 'mortgage-calculator', inputs: { homePrice: 400000, downPayment: 80000, annualRatePercent: 6.5, years: 30 }, result: { loanAmount: 320000 } },
  ])('preserves finite/null results and metadata for $slug', async ({ slug, inputs, result }) => {
    const direct = runApiTool(slug, inputs);
    const { response, body } = await callTool(transport, slug, inputs);
    expect(response.status).toBe(200);
    if (transport === 'MCP') expect(body.result.isError).not.toBe(true);
    const payload = transport === 'REST' ? body : JSON.parse(body.result.content[0].text);
    expect(payload.ok).toBe(true);
    expect(payload.run).toEqual(JSON.parse(JSON.stringify(direct)));
    expect(payload.run.result).toMatchObject(result);
    expect(payload.run.tool_url).toBe(`https://accessfreetools.com/tools/${slug}/`);
    expect(payload.run.guide_url).toBe(`https://accessfreetools.com/blog/how-to-use-${slug}/`);
    if (slug === 'mortgage-calculator') expect(payload.run.warnings.join(' ')).toContain('not financial advice');
  });

  it.each([
    { startDate: '2026-01-31', endDate: '2026-03-01', direction: 'forward', days: 29 },
    { startDate: '2026-03-01', endDate: '2026-01-31', direction: 'backward', days: 29 },
    { startDate: '2024-01-31', endDate: '2024-03-01', direction: 'forward', days: 30 },
  ])('returns nonnegative COR-03 calendar fields for $startDate to $endDate', async ({ startDate, endDate, direction, days }) => {
    const { response, body } = await callTool(transport, 'date-calculator', { startDate, endDate });
    expect(response.status).toBe(200);
    if (transport === 'MCP') expect(body.result.isError).not.toBe(true);
    const payload = transport === 'REST' ? body : JSON.parse(body.result.content[0].text);
    expect(payload.ok).toBe(true);
    expect(payload.run.result).toMatchObject({ direction, days, calendarYears: 0, calendarMonths: 1, calendarDays: 1 });
  });
});
