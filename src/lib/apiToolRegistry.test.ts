import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { answerUtilityQuestion } from './askToolRouter';
import { ApiToolValidationError, listApiTools, runApiTool, searchApiTools } from './apiToolRegistry';

describe('api tool registry', () => {
  it('lists starter tools with schemas and links', () => {
    const tools = listApiTools();
    expect(tools.length).toBeGreaterThanOrEqual(21);
    expect(tools.find((tool) => tool.slug === 'absolute-value-calculator')?.input_schema).toBeTruthy();
    expect(tools.find((tool) => tool.slug === 'percentage-calculator')?.input_schema).toBeTruthy();
    expect(tools.find((tool) => tool.slug === 'binary-calculator')?.input_schema).toBeTruthy();
    expect(tools.every((tool) => tool.tool_url.startsWith('https://accessfreetools.com/tools/'))).toBe(true);
  });

  it('runs percentage percent-of mode', () => {
    const result = runApiTool('percentage-calculator', { mode: 'percent-of', percent: 18, value: 240 });
    expect(result.answer).toContain('43.2');
    expect(result.inputs).toMatchObject({ mode: 'percent-of', percent: 18, value: 240 });
    expect(result.steps.length).toBeGreaterThan(1);
  });

  it('runs concrete with construction warning', () => {
    const result = runApiTool('concrete-calculator', {
      depthInches: 4,
      lengthFeet: 10,
      wastePercent: 10,
      widthFeet: 12,
    });
    expect(JSON.stringify(result.result)).toContain('cubicYards');
    expect(result.warnings.join(' ')).toMatch(/structural/i);
  });

  it('runs newly API-ready low-risk calculators', () => {
    expect(runApiTool('absolute-value-calculator', { value: -12.5 }).answer).toContain('12.5');
    expect(runApiTool('absolute-value-calculator', { comparisonValue: 57, value: 82 }).answer).toContain('25');
    expect(runApiTool('basic-calculator', { left: 18, operator: '+', right: 24 }).answer).toContain('42');
    expect(runApiTool('average-calculator', { values: [10, 12, 14] }).answer).toContain('12');
    expect(runApiTool('area-calculator', { length: 12, shape: 'rectangle', width: 10 }).answer).toContain('120');
    expect(runApiTool('binary-calculator', { left: '1011', operator: '+', right: '110' }).answer).toContain('10001');
    expect(runApiTool('big-number-calculator', { left: '999999999999999999', operator: '+', right: '1' }).answer).toContain(
      '1,000,000,000,000,000,000',
    );
  });

  it('returns useful validation issues', () => {
    expect(() => runApiTool('subnet-calculator', { ipAddress: '192.168.1.10', prefixLength: 40 })).toThrow(
      ApiToolValidationError,
    );
  });

  it('searches by user language', () => {
    expect(searchApiTools('download Mbps').map((tool) => tool.slug)).toContain('download-time-calculator');
  });
});

describe('ask tool router parser', () => {
  beforeEach(() => {
    process.env.AFT_ASK_FORCE_FALLBACK = 'true';
  });

  afterEach(() => {
    delete process.env.AFT_ASK_FORCE_FALLBACK;
  });

  it('answers a percentage question with the deterministic tool', async () => {
    const answer = await answerUtilityQuestion('What is 18% of 240?');
    expect(answer.route.tool_slug).toBe('percentage-calculator');
    expect(answer.route.source).toBe('parser');
    expect(answer.answer).toContain('43.2');
  });

  it('answers a concrete question with the deterministic tool', async () => {
    const answer = await answerUtilityQuestion('How much concrete for a 10 by 12 slab 4 inches thick?');
    expect(answer.route.tool_slug).toBe('concrete-calculator');
    expect(answer.run.warnings.join(' ')).toMatch(/structural/i);
  });

  it('answers a download time question with the deterministic tool', async () => {
    const answer = await answerUtilityQuestion('How long will a 5GB file take to download at 80 Mbps?');
    expect(answer.route.tool_slug).toBe('download-time-calculator');
    expect(answer.answer).toMatch(/9m 16s/i);
    expect(answer.run.inputs).toMatchObject({ efficiencyPercent: 90, fileSize: 5, fileUnit: 'GB', speedMbps: 80 });
  });

  it('answers a watts to amps question with the deterministic tool', async () => {
    const answer = await answerUtilityQuestion('Convert 600 watts to amps at 120 volts.');
    expect(answer.route.tool_slug).toBe('watts-to-amps-calculator');
    expect(answer.run.warnings.join(' ')).toMatch(/electrical code/i);
  });

  it('routes newly API-ready calculator questions through deterministic tools', async () => {
    await expect(answerUtilityQuestion('What is 18 + 24?')).resolves.toMatchObject({
      route: { tool_slug: 'basic-calculator' },
    });
    await expect(answerUtilityQuestion('What is the average of 10, 12, and 14?')).resolves.toMatchObject({
      route: { tool_slug: 'average-calculator' },
    });
    await expect(answerUtilityQuestion('What is the area of a 12 by 10 rectangle?')).resolves.toMatchObject({
      route: { tool_slug: 'area-calculator' },
    });
    await expect(answerUtilityQuestion('Calculate binary 1011 + 110')).resolves.toMatchObject({
      route: { tool_slug: 'binary-calculator' },
    });
    await expect(answerUtilityQuestion('What is the absolute value of -12.5?')).resolves.toMatchObject({
      route: { tool_slug: 'absolute-value-calculator' },
    });
    await expect(answerUtilityQuestion('What is the absolute difference between 82 and 57?')).resolves.toMatchObject({
      route: { tool_slug: 'absolute-value-calculator' },
    });
  });
});

describe('ask tool router live input guard', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    delete process.env.AFT_ASK_FORCE_FALLBACK;
    delete process.env.AFT_ASK_ALLOW_LOCAL_ROUTER;
    delete process.env.OLLAMA_API_KEY;
  });

  it('uses the parser before Ollama for exact supported questions', async () => {
    process.env.OLLAMA_API_KEY = 'test-ollama-key';
    delete process.env.AFT_ASK_FORCE_FALLBACK;
    delete process.env.AFT_ASK_ALLOW_LOCAL_ROUTER;

    globalThis.fetch = vi.fn(async () => {
      return new Response(
        JSON.stringify({
          message: {
            tool_calls: [
              {
                function: {
                  arguments: { mode: 'percent-of', percent: 18, value: 0 },
                  name: 'aft_percentage_calculator',
                },
              },
            ],
          },
        }),
        { headers: { 'content-type': 'application/json' }, status: 200 },
      );
    }) as typeof fetch;

    const answer = await answerUtilityQuestion('What is 18% of 240?');

    expect(globalThis.fetch).not.toHaveBeenCalled();
    expect(answer.model).toBe('access-free-tools-parser');
    expect(answer.route.source).toBe('parser');
    expect(answer.route.tool_slug).toBe('percentage-calculator');
    expect(answer.answer).toContain('43.2');
    expect(answer.run.answer).not.toContain('18% of 0');
  });
});
