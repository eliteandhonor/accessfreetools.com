import { getApiTool, listApiTools, runApiTool, serializeApiTool, type ApiToolRunResult } from './apiToolRegistry';
import { getOllamaApiKey, isAskEnabled, loadPrivateEnv } from './privateEnv';

const OLLAMA_HOST = 'https://ollama.com';
const DEFAULT_OLLAMA_MODEL = 'gpt-oss:120b';

export interface AskToolAnswer {
  answer: string;
  model: string;
  route: {
    confidence: 'high' | 'medium' | 'low';
    source: 'ollama' | 'parser';
    tool_slug: string;
  };
  run: ApiToolRunResult;
  tool: ReturnType<typeof serializeApiTool>;
}

interface ToolCallRoute {
  confidence: 'high' | 'medium' | 'low';
  inputs: Record<string, unknown>;
  source: 'ollama' | 'parser';
  tool_slug: string;
}

function functionNameForSlug(slug: string) {
  return `aft_${slug.replace(/-/g, '_')}`;
}

function slugForFunctionName(name: string) {
  return name.startsWith('aft_') ? name.slice(4).replace(/_/g, '-') : '';
}

function normalizeRouteInputs(slug: string, inputs: Record<string, unknown>) {
  const normalized = { ...inputs };

  if (slug === 'percentage-calculator') {
    const mode = typeof normalized.mode === 'string' ? normalized.mode.toLowerCase().replace(/_/g, '-') : '';
    if (
      mode.includes('percent-of') ||
      mode.includes('percentage-of') ||
      ['of', 'find-percent-of'].includes(mode)
    ) {
      normalized.mode = 'percent-of';
    } else if (['what-percent', 'what-percentage', 'percent-of-total', 'part-of-whole'].includes(mode)) {
      normalized.mode = 'what-percent';
    }

    if (typeof normalized.percent === 'number' && typeof normalized.value === 'number') {
      normalized.mode = 'percent-of';
    } else if (typeof normalized.part === 'number' && typeof normalized.whole === 'number') {
      normalized.mode = 'what-percent';
    }
  }

  if (slug === 'download-time-calculator' && typeof normalized.fileUnit === 'string') {
    normalized.fileUnit = normalized.fileUnit.toUpperCase();
  }

  if (slug === 'watts-to-amps-calculator' && typeof normalized.phase === 'string') {
    const phase = normalized.phase.toLowerCase().replace(/_/g, '-');
    if (phase === 'single' || phase === 'single-phase') normalized.phase = 'single-phase';
    if (phase === 'three' || phase === 'three-phase') normalized.phase = 'three-phase';
  }

  if (
    ['basic-calculator', 'big-number-calculator', 'binary-calculator'].includes(slug) &&
    typeof normalized.operator === 'string'
  ) {
    normalized.operator = normalizeOperator(normalized.operator);
  }

  if (slug === 'area-calculator' && typeof normalized.shape === 'string') {
    normalized.shape = normalized.shape.toLowerCase().replace(/\s+/g, '-');
  }

  return normalized;
}

function parseFirstNumberPair(message: string) {
  const numbers = [...message.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) => Number(match[0]));
  return numbers.length >= 2 ? [numbers[0], numbers[1]] : null;
}

function parseNumberList(message: string) {
  return [...message.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) => Number(match[0]));
}

function normalizeOperator(value: string) {
  const normalized = value.toLowerCase().trim();
  if (normalized === 'x' || normalized === 'times') return '*';
  if (normalized === 'plus') return '+';
  if (normalized === 'minus') return '-';
  if (normalized === 'divided by') return '/';
  return normalized;
}

function parseSupportedToolQuestion(message: string): ToolCallRoute | null {
  const lower = message.toLowerCase();

  const percentOfMatch = lower.match(/(-?\d+(?:\.\d+)?)\s*%\s*(?:of|x|times)\s*(-?\d+(?:\.\d+)?)/);
  if (percentOfMatch) {
    return {
      confidence: 'high',
      inputs: { mode: 'percent-of', percent: Number(percentOfMatch[1]), value: Number(percentOfMatch[2]) },
      source: 'parser',
      tool_slug: 'percentage-calculator',
    };
  }

  const whatPercentMatch = lower.match(/(-?\d+(?:\.\d+)?)\s+(?:is|as)\s+(?:what|which)\s+percent\s+of\s+(-?\d+(?:\.\d+)?)/);
  if (whatPercentMatch) {
    return {
      confidence: 'high',
      inputs: { mode: 'what-percent', part: Number(whatPercentMatch[1]), whole: Number(whatPercentMatch[2]) },
      source: 'parser',
      tool_slug: 'percentage-calculator',
    };
  }

  if (lower.includes('download') || lower.includes('mbps') || lower.includes('gb')) {
    const match = lower.match(/(\d+(?:\.\d+)?)\s*(kb|mb|gb|tb).*?(\d+(?:\.\d+)?)\s*mbps/);
    if (match) {
      return {
        confidence: 'high',
        inputs: { fileSize: Number(match[1]), fileUnit: match[2].toUpperCase(), speedMbps: Number(match[3]) },
        source: 'parser',
        tool_slug: 'download-time-calculator',
      };
    }
  }

  if (lower.includes('watts') || lower.includes('amps') || lower.includes('volts')) {
    const match = lower.match(/(\d+(?:\.\d+)?)\s*(?:watts|w)\b.*?(\d+(?:\.\d+)?)\s*(?:volts|v)\b/);
    if (match) {
      return {
        confidence: 'high',
        inputs: { phase: 'single-phase', powerFactor: 1, volts: Number(match[2]), watts: Number(match[1]) },
        source: 'parser',
        tool_slug: 'watts-to-amps-calculator',
      };
    }
  }

  if (lower.includes('area')) {
    const circleMatch = lower.match(/(?:radius|r)\s*(?:is|=|of)?\s*(\d+(?:\.\d+)?)/);
    if (lower.includes('circle') && circleMatch) {
      return {
        confidence: 'high',
        inputs: { radius: Number(circleMatch[1]), shape: 'circle' },
        source: 'parser',
        tool_slug: 'area-calculator',
      };
    }

    const dimensionsMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:x|by)\s*(\d+(?:\.\d+)?)/);
    if (dimensionsMatch) {
      const first = Number(dimensionsMatch[1]);
      const second = Number(dimensionsMatch[2]);
      if (lower.includes('triangle')) {
        return {
          confidence: 'high',
          inputs: { base: first, height: second, shape: 'triangle' },
          source: 'parser',
          tool_slug: 'area-calculator',
        };
      }
      if (lower.includes('parallelogram')) {
        return {
          confidence: 'high',
          inputs: { base: first, height: second, shape: 'parallelogram' },
          source: 'parser',
          tool_slug: 'area-calculator',
        };
      }
      return {
        confidence: 'high',
        inputs: { length: first, shape: 'rectangle', width: second },
        source: 'parser',
        tool_slug: 'area-calculator',
      };
    }
  }

  if (lower.includes('concrete')) {
    const match = lower.match(/(\d+(?:\.\d+)?)\s*(?:x|by)\s*(\d+(?:\.\d+)?)(?:.*?(\d+(?:\.\d+)?)\s*(?:in|inch|inches))?/);
    if (match) {
      return {
        confidence: 'high',
        inputs: {
          depthInches: match[3] ? Number(match[3]) : 4,
          lengthFeet: Number(match[1]),
          wastePercent: 10,
          widthFeet: Number(match[2]),
        },
        source: 'parser',
        tool_slug: 'concrete-calculator',
      };
    }
  }

  if (lower.includes('binary')) {
    const binaryMatch = lower.match(/(-?[01][01\s_]*)\s*(\+|-|\*|\/|x|times|minus|plus|divided by)\s*(-?[01][01\s_]*)/);
    if (binaryMatch) {
      return {
        confidence: 'high',
        inputs: {
          left: binaryMatch[1],
          operator: normalizeOperator(binaryMatch[2]),
          right: binaryMatch[3],
        },
        source: 'parser',
        tool_slug: 'binary-calculator',
      };
    }
  }

  if (lower.includes('average') || lower.includes('mean')) {
    const values = parseNumberList(lower);
    if (values.length) {
      return {
        confidence: 'high',
        inputs: { values },
        source: 'parser',
        tool_slug: 'average-calculator',
      };
    }
  }

  if (lower.includes('bmi')) {
    const metricMatch = lower.match(/(\d+(?:\.\d+)?)\s*kg.*?(\d+(?:\.\d+)?)\s*cm/);
    if (metricMatch) {
      return {
        confidence: 'high',
        inputs: { heightCm: Number(metricMatch[2]), weightKg: Number(metricMatch[1]) },
        source: 'parser',
        tool_slug: 'bmi-calculator',
      };
    }
  }

  const bigNumberMatch = lower.match(/(-?\d{13,})\s*(\+|-|\*|\/|x|times|minus|plus|divided by)\s*(-?\d+)/);
  if (lower.includes('big number') && bigNumberMatch) {
    return {
      confidence: 'high',
      inputs: {
        left: bigNumberMatch[1],
        operator: normalizeOperator(bigNumberMatch[2]),
        right: bigNumberMatch[3],
      },
      source: 'parser',
      tool_slug: 'big-number-calculator',
    };
  }

  const arithmeticMatch = lower.match(/(-?\d+(?:\.\d+)?)\s*(\+|-|\*|\/|x|times|minus|plus|divided by)\s*(-?\d+(?:\.\d+)?)/);
  if (arithmeticMatch) {
    return {
      confidence: 'medium',
      inputs: {
        left: Number(arithmeticMatch[1]),
        operator: normalizeOperator(arithmeticMatch[2]),
        right: Number(arithmeticMatch[3]),
      },
      source: 'parser',
      tool_slug: 'basic-calculator',
    };
  }

  if (lower.includes('tip')) {
    const pair = parseFirstNumberPair(lower);
    if (pair) {
      return {
        confidence: 'medium',
        inputs: { people: 1, subtotal: pair[0], taxPercent: 0, tipPercent: pair[1] },
        source: 'parser',
        tool_slug: 'tip-calculator',
      };
    }
  }

  return null;
}

function correctOllamaRouteInputs(message: string, route: ToolCallRoute): ToolCallRoute {
  if (route.source !== 'ollama') return route;

  const parsedRoute = parseSupportedToolQuestion(message);
  if (!parsedRoute || parsedRoute.confidence !== 'high' || parsedRoute.tool_slug !== route.tool_slug) {
    return route;
  }

  return {
    ...route,
    confidence: route.confidence === 'low' ? 'medium' : route.confidence,
    inputs: normalizeRouteInputs(route.tool_slug, parsedRoute.inputs),
  };
}

async function callOllamaChat(body: Record<string, unknown>) {
  const apiKey = getOllamaApiKey();
  if (!apiKey) return null;

  const response = await fetch(`${OLLAMA_HOST}/api/chat`, {
    body: JSON.stringify(body),
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed with ${response.status}.`);
  }

  return (await response.json()) as {
    message?: {
      content?: string;
      tool_calls?: Array<{ function?: { arguments?: unknown; name?: string } }>;
    };
  };
}

async function routeWithOllama(message: string): Promise<ToolCallRoute | null> {
  const tools = listApiTools();
  const response = await callOllamaChat({
    messages: [
      {
        content:
          'You route user utility questions to Access Free Tools. Pick exactly one tool when the user gave enough input. Do not calculate manually. If no tool fits, do not call a tool.',
        role: 'system',
      },
      { content: message, role: 'user' },
    ],
    model: process.env.OLLAMA_MODEL || DEFAULT_OLLAMA_MODEL,
    stream: false,
    tools: tools.map((tool) => ({
      function: {
        description: `${tool.description} Return only the required inputs for this Access Free Tools runner.`,
        name: functionNameForSlug(tool.slug),
        parameters: tool.input_schema,
      },
      type: 'function',
    })),
  });

  const toolCall = response?.message?.tool_calls?.[0]?.function;
  if (!toolCall?.name) return null;

  const slug = slugForFunctionName(toolCall.name);
  if (!getApiTool(slug)) return null;

  const rawArguments = toolCall.arguments;
  const inputs =
    typeof rawArguments === 'string'
      ? (JSON.parse(rawArguments) as Record<string, unknown>)
      : ((rawArguments ?? {}) as Record<string, unknown>);

  return {
    confidence: 'medium',
    inputs: normalizeRouteInputs(slug, inputs),
    source: 'ollama',
    tool_slug: slug,
  };
}

function localAnswer(run: ApiToolRunResult) {
  return run.answer;
}

export async function answerUtilityQuestion(message: string): Promise<AskToolAnswer> {
  loadPrivateEnv();

  if (!isAskEnabled()) {
    throw new Error('Ask Access Free Tools is not enabled yet.');
  }

  const trimmed = message.trim();
  if (trimmed.length < 3) {
    throw new Error('Ask a longer utility question.');
  }

  if (trimmed.length > 1200) {
    throw new Error('Question must be 1200 characters or less.');
  }

  let route: ToolCallRoute | null = parseSupportedToolQuestion(trimmed);
  let model = route ? 'access-free-tools-parser' : 'unrouted';

  if (!route && process.env.AFT_ASK_FORCE_FALLBACK !== 'true') {
    try {
      route = await routeWithOllama(trimmed);
      if (route) route = correctOllamaRouteInputs(trimmed, route);
      if (route) model = process.env.OLLAMA_MODEL || DEFAULT_OLLAMA_MODEL;
    } catch {
      route = null;
    }
  }

  const allowLocalRouter =
    process.env.AFT_ASK_FORCE_FALLBACK === 'true' || process.env.AFT_ASK_ALLOW_LOCAL_ROUTER === 'true';

  if (!route && allowLocalRouter) {
    route = parseSupportedToolQuestion(trimmed);
    if (route) model = 'access-free-tools-parser';
  }

  if (!route) {
    throw new Error('I could not match that question with the live model to an API-ready Access Free Tools utility yet.');
  }

  const tool = getApiTool(route.tool_slug);
  if (!tool) {
    throw new Error('Matched tool is not available.');
  }

  let activeTool = tool;
  let activeRoute = route;
  let run: ApiToolRunResult;

  try {
    run = runApiTool(activeRoute.tool_slug, activeRoute.inputs);
  } catch (error) {
    const parsedRoute = activeRoute.source === 'ollama' ? parseSupportedToolQuestion(trimmed) : null;
    const fallbackTool = parsedRoute && parsedRoute.tool_slug === activeRoute.tool_slug ? getApiTool(parsedRoute.tool_slug) : null;

    if (!parsedRoute || !fallbackTool) {
      throw error;
    }

    model = 'access-free-tools-parser';
    activeRoute = parsedRoute;
    activeTool = fallbackTool;
    run = runApiTool(activeRoute.tool_slug, activeRoute.inputs);
  }

  const answer = localAnswer(run);

  return {
    answer,
    model,
    route: {
      confidence: activeRoute.confidence,
      source: activeRoute.source,
      tool_slug: activeRoute.tool_slug,
    },
    run,
    tool: serializeApiTool(activeTool),
  };
}
