import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { answerUtilityQuestion } from './askToolRouter';
import { ApiToolValidationError, listApiTools, runApiTool, searchApiTools } from './apiToolRegistry';

describe('api tool registry', () => {
  it('lists starter tools with schemas and links', () => {
    const tools = listApiTools();
    expect(tools.length).toBeGreaterThanOrEqual(15);
    expect(tools.find((tool) => tool.slug === 'percentage-calculator')?.input_schema).toBeTruthy();
    expect(tools.every((tool) => tool.tool_url.startsWith('https://accessfreetools.com/tools/'))).toBe(true);
  });

  it('runs percentage percent-of mode', () => {
    const result = runApiTool('percentage-calculator', { mode: 'percent-of', percent: 18, value: 240 });
    expect(result.answer).toContain('43.2');
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

  it('returns useful validation issues', () => {
    expect(() => runApiTool('subnet-calculator', { ipAddress: '192.168.1.10', prefixLength: 40 })).toThrow(
      ApiToolValidationError,
    );
  });

  it('searches by user language', () => {
    expect(searchApiTools('download Mbps').map((tool) => tool.slug)).toContain('download-time-calculator');
  });
});

describe('ask tool router fallback', () => {
  beforeEach(() => {
    process.env.AFT_ASK_FORCE_FALLBACK = 'true';
  });

  afterEach(() => {
    delete process.env.AFT_ASK_FORCE_FALLBACK;
  });

  it('answers a percentage question with the deterministic tool', async () => {
    const answer = await answerUtilityQuestion('What is 18% of 240?');
    expect(answer.route.tool_slug).toBe('percentage-calculator');
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
    expect(answer.answer).toMatch(/minutes/i);
  });

  it('answers a watts to amps question with the deterministic tool', async () => {
    const answer = await answerUtilityQuestion('Convert 600 watts to amps at 120 volts.');
    expect(answer.route.tool_slug).toBe('watts-to-amps-calculator');
    expect(answer.run.warnings.join(' ')).toMatch(/electrical code/i);
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

  it('keeps Ollama routing but corrects obvious same-tool input mistakes before running math', async () => {
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

    expect(answer.model).not.toBe('fallback');
    expect(answer.route.source).toBe('ollama');
    expect(answer.route.tool_slug).toBe('percentage-calculator');
    expect(answer.answer).toContain('43.2');
    expect(answer.run.answer).not.toContain('18% of 0');
  });
});
