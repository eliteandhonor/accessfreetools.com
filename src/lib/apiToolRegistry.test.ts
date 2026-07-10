import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { answerUtilityQuestion } from './askToolRouter';
import { ApiToolValidationError, listApiTools, runApiTool, searchApiTools } from './apiToolRegistry';

describe('api tool registry', () => {
  it('lists starter tools with schemas and links', () => {
    const tools = listApiTools();
    expect(tools.length).toBeGreaterThanOrEqual(34);
    expect(tools.find((tool) => tool.slug === 'absolute-value-calculator')?.input_schema).toBeTruthy();
    expect(tools.find((tool) => tool.slug === 'ai-token-cost-calculator')?.input_schema).toBeTruthy();
    expect(tools.find((tool) => tool.slug === 'api-pricing-calculator')?.input_schema).toBeTruthy();
    expect(tools.find((tool) => tool.slug === 'amp-hours-to-watt-hours-calculator')?.input_schema).toBeTruthy();
    expect(tools.find((tool) => tool.slug === 'amps-to-watts-calculator')?.input_schema).toBeTruthy();
    expect(tools.find((tool) => tool.slug === 'baking-pan-conversion-calculator')?.input_schema).toBeTruthy();
    expect(tools.find((tool) => tool.slug === 'bandwidth-calculator')?.input_schema).toBeTruthy();
    expect(tools.find((tool) => tool.slug === 'bra-size-calculator')?.input_schema).toBeTruthy();
    expect(tools.find((tool) => tool.slug === 'btu-calculator')?.input_schema).toBeTruthy();
    expect(tools.find((tool) => tool.slug === 'butter-converter')?.input_schema).toBeTruthy();
    expect(tools.find((tool) => tool.slug === 'character-counter')?.input_schema).toBeTruthy();
    expect(tools.find((tool) => tool.slug === 'circle-calculator')?.input_schema).toBeTruthy();
    expect(tools.find((tool) => tool.slug === 'confidence-interval-calculator')?.input_schema).toBeTruthy();
    expect(tools.find((tool) => tool.slug === 'conversion-calculator')?.input_schema).toBeTruthy();
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
    const tokenCost = runApiTool('ai-token-cost-calculator', {
      inputPricePerMillion: 2,
      inputTokensPerRequest: 1200,
      outputPricePerMillion: 8,
      outputTokensPerRequest: 500,
      requests: 10000,
    });
    expect(tokenCost.answer).toContain('$64.00');
    expect(JSON.stringify(tokenCost.result)).toContain('costPerRequest');
    const cacheAwareTokenCost = runApiTool('ai-token-cost-calculator', {
      cachedInputPricePerMillion: 0.2,
      cachedInputTokensPerRequest: 800,
      inputPricePerMillion: 2,
      inputTokensPerRequest: 1200,
      outputPricePerMillion: 8,
      outputTokensPerRequest: 500,
      requests: 10000,
    });
    expect(cacheAwareTokenCost.answer).toContain('$49.60');
    expect(cacheAwareTokenCost.assumptions.join(' ')).toContain('part of total input');
    expect(JSON.stringify(cacheAwareTokenCost.result)).toContain('cachedInputCost');
    expect(() =>
      runApiTool('ai-token-cost-calculator', {
        cachedInputTokensPerRequest: 1201,
        inputPricePerMillion: 2,
        inputTokensPerRequest: 1200,
        outputPricePerMillion: 8,
        outputTokensPerRequest: 500,
        requests: 10000,
      }),
    ).toThrow('Tool input did not match the expected schema.');
    const apiPricing = runApiTool('api-pricing-calculator', {
      platformFee: 0,
      pricePerUnit: 0.04,
      requests: 1000,
      retryPercent: 5,
      unitsPerRequest: 1,
    });
    expect(apiPricing.answer).toContain('$42.00');
    expect(JSON.stringify(apiPricing.result)).toContain('averageCostPerRequest');
    const wattHours = runApiTool('amp-hours-to-watt-hours-calculator', { ampHours: 300, volts: 12 });
    expect(wattHours.answer).toContain('3600 Wh');
    expect(JSON.stringify(wattHours.result)).toContain('kilowattHours');
    const watts = runApiTool('amps-to-watts-calculator', { amps: 12.5, phase: 'dc', powerFactor: 1, volts: 120 });
    expect(watts.answer).toContain('1500 watts');
    expect(JSON.stringify(watts.result)).toContain('kilowatts');
    expect(runApiTool('basic-calculator', { left: 18, operator: '+', right: 24 }).answer).toContain('42');
    expect(runApiTool('average-calculator', { values: [10, 12, 14] }).answer).toContain('12');
    expect(runApiTool('area-calculator', { length: 12, shape: 'rectangle', width: 10 }).answer).toContain('120');
    expect(
      runApiTool('baking-pan-conversion-calculator', {
        newLengthInches: 8,
        newWidthInches: 8,
        oldLengthInches: 13,
        oldWidthInches: 9,
        originalServings: 12,
      }).answer,
    ).toContain('0.547x');
    expect(runApiTool('bandwidth-calculator', { dataAmount: 5, dataUnit: 'GB', speedAmount: 100, speedUnit: 'Mbps' }).answer).toContain(
      '6m 40s',
    );
    expect(runApiTool('binary-calculator', { left: '1011', operator: '+', right: '110' }).answer).toContain('10001');
    expect(runApiTool('big-number-calculator', { left: '999999999999999999', operator: '+', right: '1' }).answer).toContain(
      '1,000,000,000,000,000,000',
    );
    expect(runApiTool('bra-size-calculator', { bustInches: 36, underbustInches: 32 }).answer).toContain('32D');
    expect(
      runApiTool('btu-calculator', {
        ceilingHeightFeet: 8,
        kitchen: false,
        people: 2,
        squareFeet: 300,
        sunlight: 'normal',
      }).answer,
    ).toContain('7000 BTU/h');
    expect(runApiTool('butter-converter', { amount: 1, unit: 'stick' }).answer).toContain('8 tablespoons');
    expect(runApiTool('character-counter', { text: 'Free calculator tools for quick everyday math.' }).answer).toContain(
      '46 characters',
    );
    expect(runApiTool('circle-calculator', { knownMeasure: 'radius', value: 5 }).answer).toContain('31.4159');
    expect(
      runApiTool('confidence-interval-calculator', {
        confidenceLevel: 95,
        mode: 'mean',
        sampleMean: 68,
        sampleSize: 36,
        standardDeviation: 3,
      }).answer,
    ).toContain('67.02 to 68.98');
    expect(
      runApiTool('conversion-calculator', { category: 'length', fromUnit: 'foot', toUnit: 'meter', value: 12 }).answer,
    ).toContain('3.6576 meter');
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
    const tokenCostAnswer = await answerUtilityQuestion(
      'Estimate AI token cost for 10,000 requests with 1,200 input tokens, 500 output tokens, $2 input and $8 output per 1M tokens.',
    );
    expect(tokenCostAnswer.route.tool_slug).toBe('ai-token-cost-calculator');
    expect(tokenCostAnswer.answer).toContain('$64.00');
    const wattHoursAnswer = await answerUtilityQuestion('Convert 300 Ah at 12 V to watt-hours.');
    expect(wattHoursAnswer.route.tool_slug).toBe('amp-hours-to-watt-hours-calculator');
    expect(wattHoursAnswer.answer).toContain('3600 Wh');
    const wattsAnswer = await answerUtilityQuestion('Convert 12.5 amps at 120 volts to watts.');
    expect(wattsAnswer.route.tool_slug).toBe('amps-to-watts-calculator');
    expect(wattsAnswer.answer).toContain('1500 watts');
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
