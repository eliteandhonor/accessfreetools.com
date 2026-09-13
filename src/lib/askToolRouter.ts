import { getApiTool, listApiTools, runApiTool, serializeApiTool, type ApiToolRunResult } from './apiToolRegistry';
import { getOllamaApiKey, isAskEnabled, loadPrivateEnv } from './privateEnv';
import { ASK_PROVIDER_TIMEOUT_MS, withRequestDeadline } from './askRequest';

export class AskUnavailableError extends Error {
  constructor() {
    super('The question router is unavailable. Try again shortly.');
    this.name = 'AskUnavailableError';
  }
}

const OLLAMA_HOST = 'https://ollama.com';
const DEFAULT_OLLAMA_MODEL = 'gpt-oss:120b';
const QUESTION_NUMBER = String.raw`[+-]?(?:(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?`;
const QUESTION_OPERATOR = String.raw`\+|-|\*|\/|x|times|minus|plus|divided by`;

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

  if (
    ['amps-to-watts-calculator', 'watts-to-amps-calculator'].includes(slug) &&
    typeof normalized.phase === 'string'
  ) {
    const phase = normalized.phase.toLowerCase().replace(/_/g, '-');
    if (phase === 'dc') normalized.phase = 'dc';
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

function parseLooseNumber(value: string) {
  const number = Number(value.replace(/,/g, ''));
  if (!new RegExp(`^${QUESTION_NUMBER}$`, 'i').test(value) || !Number.isFinite(number)) {
    throw new Error('Use a finite number with decimal points and commas only for groups of three digits.');
  }
  return number;
}

function matchQuestion(message: string, pattern: string, flags = '') {
  return message.match(new RegExp(`^(?:please\\s+)?(?:(?:what is|what's|calculate|compute|evaluate)\\s+)?${pattern}$`, flags));
}

function parserRoute(tool_slug: string, inputs: Record<string, unknown>): ToolCallRoute {
  return { confidence: 'high', inputs, source: 'parser', tool_slug };
}

function parseElectricalQuestion(message: string): ToolCallRoute {
  const phases = [...message.matchAll(/\b(?:dc|(?:single|one|1|three|3)[ -]phase)\b/g)];
  const powerFactors = [...message.matchAll(new RegExp(
    String.raw`\b(?:power factor|pf)\s*(?:(?:is|of|=)\s*)?(${QUESTION_NUMBER})\s*(%)?(?=\s|$)`, 'g',
  ))];
  let remaining = message;
  for (const match of [...phases, ...powerFactors]) remaining = remaining.replace(match[0], ' ');
  remaining = remaining.replace(/\s+/g, ' ').trim();
  const match = matchQuestion(remaining, String.raw`(?:convert\s+)?(${QUESTION_NUMBER})\s*(watts?|w|amps?|a)(?:\s+to\s+(amps?|a|watts?|w))?\s+at\s+(${QUESTION_NUMBER})\s*(?:volts?|v)(?:\s+to\s+(amps?|a|watts?|w))?`);
  if (!match || phases.length > 1 || powerFactors.length > 1) {
    throw new Error('I could not read all the electrical units and conditions. Specify watts or amps, volts, DC/single-phase/three-phase, and power factor.');
  }
  const fromWatts = match[2].startsWith('w');
  if ([match[3], match[5]].some((target) => target && target.startsWith('w') === fromWatts)) {
    throw new Error('Specify a conversion from watts to amps or from amps to watts.');
  }
  const powerFactor = powerFactors.length
    ? parseLooseNumber(powerFactors[0][1]) / (powerFactors[0][2] ? 100 : 1)
    : 1;
  const explicitPhase = phases[0]?.[0];
  const phase = explicitPhase === 'dc' ? 'dc'
    : explicitPhase && /^(?:three|3)/.test(explicitPhase) ? 'three-phase'
      : explicitPhase || powerFactors.length || fromWatts ? 'single-phase' : 'dc';
  if (phase === 'dc' && powerFactor !== 1) {
    throw new Error('Power factor does not apply to DC. Specify an AC phase or remove the conflicting power factor.');
  }
  return parserRoute(fromWatts ? 'watts-to-amps-calculator' : 'amps-to-watts-calculator', {
    [fromWatts ? 'watts' : 'amps']: parseLooseNumber(match[1]),
    volts: parseLooseNumber(match[4]), phase, powerFactor,
  });
}

function parseConcreteQuestion(message: string): ToolCallRoute {
  const unit = String.raw`(?:feet|foot|ft|inches|inch|in|centimeters?|centimetres?|cm|millimeters?|millimetres?|mm|meters?|metres?|m)`;
  const match = matchQuestion(message,
    String.raw`(?:how much\s+|estimate\s+)?concrete\s+for\s+(?:a\s+)?(${QUESTION_NUMBER})\s*(${unit})?\s*(?:x|by)\s*(${QUESTION_NUMBER})\s*(${unit})?`
    + String.raw`(?:\s+slab)?(?:\s*,\s*|\s+)(${QUESTION_NUMBER})\s*(${unit})(?:\s+(?:deep|thick))?(?:\s+(?:with|and|plus)\s+(${QUESTION_NUMBER})\s*%\s+waste)?`);
  if (!match) {
    throw new Error('I could not read all the concrete dimensions and units. Give slab length, width, depth, and any waste percentage.');
  }
  const [, length, lengthUnit, width, widthUnit, depth, depthUnit, waste] = match;
  // Retain the documented inch-depth starter example; metric depth does not imply feet.
  const imperialDefault = !lengthUnit && !widthUnit && /^(?:in|inch|inches)$/.test(depthUnit) ? 'ft' : undefined;
  const resolvedLengthUnit = lengthUnit || widthUnit || imperialDefault;
  const resolvedWidthUnit = widthUnit || lengthUnit || imperialDefault;
  if (!resolvedLengthUnit || !resolvedWidthUnit) {
    throw new Error('Specify the length and width units as well as the depth unit for the concrete slab.');
  }
  const inFeet = (value: string, units: string) => {
    const number = parseLooseNumber(value);
    if (/^(?:feet|foot|ft)$/.test(units)) return number;
    if (/^in/.test(units)) return number / 12;
    if (/^c/.test(units)) return number / 30.48;
    if (/^(?:mm|milli)/.test(units)) return number / 304.8;
    return number / 0.3048;
  };
  const depthNumber = parseLooseNumber(depth);
  const depthInches = /^in/.test(depthUnit) ? depthNumber
    : /^c/.test(depthUnit) ? depthNumber / 2.54
      : /^(?:mm|milli)/.test(depthUnit) ? depthNumber / 25.4
        : inFeet(depth, depthUnit) * 12;
  return parserRoute('concrete-calculator', {
    lengthFeet: inFeet(length, resolvedLengthUnit), widthFeet: inFeet(width, resolvedWidthUnit),
    depthInches, wastePercent: waste ? parseLooseNumber(waste) : 10,
  });
}

function parseTokenCostQuestion(message: string): ToolCallRoute {
  const denominator = String.raw`(?:1,000,000|1000000|1m|1 million|million|1,000|1000|1k|1 thousand|thousand)`;
  const match = matchQuestion(message, String.raw`(?:estimate\s+)?(?:ai\s+)?token\s+(?:cost|price|spend)\s+for\s+(${QUESTION_NUMBER})\s+(?:requests?|calls?)\s+with\s+(${QUESTION_NUMBER})\s+(?:input|prompt)\s+tokens?,\s*(${QUESTION_NUMBER})\s+(?:output|completion|response)\s+tokens?,\s*\$\s*(${QUESTION_NUMBER})\s+(?:input|prompt)(?:\s+per\s+(${denominator})\s+tokens?)?\s+and\s+\$\s*(${QUESTION_NUMBER})\s+(?:output|completion|response)\s+per\s+(${denominator})\s+tokens?`);
  if (!match) {
    throw new Error('I could not read the complete token pricing question. Give requests, input/output tokens per request, and USD input/output prices per 1K or 1M tokens.');
  }
  const perMillion = (price: string, basis: string) => parseLooseNumber(price)
    * (/^(?:1,000|1000|1k|1 thousand|thousand)$/.test(basis) ? 1000 : 1);
  return parserRoute('ai-token-cost-calculator', {
    requests: parseLooseNumber(match[1]), inputTokensPerRequest: parseLooseNumber(match[2]),
    outputTokensPerRequest: parseLooseNumber(match[3]),
    inputPricePerMillion: perMillion(match[4], match[5] || match[7]),
    outputPricePerMillion: perMillion(match[6], match[7]),
  });
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
  // Decline unsupported math before punctuation cleanup can discard a factorial.
  if (/[\u00d7\u00f7\u2212]|[\d)\]|]\s*!/.test(message)) {
    throw new Error('I could not read the complete calculation. Ask one percentage calculation or one operation with two numbers, without extra units or operators.');
  }
  const normalized = message.replace(/\s+/g, ' ').replace(/[?!.]$/, '').trim();
  const lower = normalized.toLowerCase();

  const dates = matchQuestion(lower, String.raw`(?:how many days|(?:the )?date difference)\s+(?:between|from)\s+(\d{4}-\d{2}-\d{2})\s+(?:and|to)\s+(\d{4}-\d{2}-\d{2})`);
  if (dates) return parserRoute('date-calculator', { startDate: dates[1], endDate: dates[2] });
  // A recognized but unsupported question is terminal, not an invitation to guess via Ollama.
  if (/\d{4}-\d{2}-\d{2}/.test(lower)) {
    throw new Error('I can compare two calendar dates in YYYY-MM-DD format. Business-day, inclusive, and other date conditions need a different calculation.');
  }

  if (lower.includes('token') && /cost|price|spend/.test(lower)) return parseTokenCostQuestion(lower);
  if (/\bconcrete\b/.test(lower)) return parseConcreteQuestion(lower);

  const percentOfMatch = matchQuestion(lower, String.raw`(${QUESTION_NUMBER})\s*%\s*(?:of|x|times)\s*(${QUESTION_NUMBER})`);
  if (percentOfMatch) {
    return {
      confidence: 'high',
      inputs: { mode: 'percent-of', percent: parseLooseNumber(percentOfMatch[1]), value: parseLooseNumber(percentOfMatch[2]) },
      source: 'parser',
      tool_slug: 'percentage-calculator',
    };
  }

  const whatPercentMatch = matchQuestion(lower, String.raw`(${QUESTION_NUMBER})\s+(?:is|as)\s+(?:what|which)\s+percent\s+of\s+(${QUESTION_NUMBER})`);
  if (whatPercentMatch) {
    return {
      confidence: 'high',
      inputs: { mode: 'what-percent', part: parseLooseNumber(whatPercentMatch[1]), whole: parseLooseNumber(whatPercentMatch[2]) },
      source: 'parser',
      tool_slug: 'percentage-calculator',
    };
  }

  if (
    (lower.includes('amp hour') || lower.includes('amp-hour') || /\bah\b/.test(lower)) &&
    (lower.includes('watt hour') || lower.includes('watt-hour') || /\bwh\b/.test(lower))
  ) {
    const match = matchQuestion(lower, String.raw`(?:convert\s+)?(${QUESTION_NUMBER})\s*(?:amp[-\s]?hours?|ah)\s+at\s+(${QUESTION_NUMBER})\s*(?:v|volts?)\s+to\s+(?:watt[-\s]?hours?|wh)`);
    if (match) {
      return {
        confidence: 'high',
        inputs: {
          ampHours: parseLooseNumber(match[1]),
          volts: parseLooseNumber(match[2]),
        },
        source: 'parser',
        tool_slug: 'amp-hours-to-watt-hours-calculator',
      };
    }
    throw new Error('I could not read the complete battery conversion. Give amp-hours and volts without additional conditions.');
  }

  if (/\b(?:watts?|amps?|volts?|pf|phase)\b|\d\s*(?:w|kw|a|ma|v|kv)\b/.test(lower)) return parseElectricalQuestion(lower);

  if (lower.includes('download') || lower.includes('mbps') || lower.includes('gb')) {
    const match = matchQuestion(normalized, String.raw`(?:how long will (?:a )?|download(?: time)?(?: for)? )(${QUESTION_NUMBER})\s*(kb|mb|gb|tb)(?: file)?(?: take to download)?\s+at\s+(${QUESTION_NUMBER})\s*(mbps)`, 'i');
    if (match) {
      if (match[4][1] === 'B') {
        throw new Error('MBps means megabytes per second. This route accepts Mbps (megabits per second); convert the speed or use the download tool.');
      }
      return {
        confidence: 'high',
        inputs: { fileSize: parseLooseNumber(match[1]), fileUnit: match[2].toUpperCase(), speedMbps: parseLooseNumber(match[3]) },
        source: 'parser',
        tool_slug: 'download-time-calculator',
      };
    }
    throw new Error('I could not read the complete download question. Give the file size in KB/MB/GB/TB and speed in Mbps without additional conditions.');
  }

  if (lower.includes('area')) {
    const circleMatch = matchQuestion(lower, String.raw`(?:the )?area of (?:a )?circle (?:with )?(?:radius|r)\s*(?:(?:is|=|of)\s*)?(${QUESTION_NUMBER})`);
    if (lower.includes('circle') && circleMatch) {
      return {
        confidence: 'high',
        inputs: { radius: parseLooseNumber(circleMatch[1]), shape: 'circle' },
        source: 'parser',
        tool_slug: 'area-calculator',
      };
    }

    const dimensionsMatch = matchQuestion(lower, String.raw`(?:the )?area of (?:a )?(${QUESTION_NUMBER})\s*(?:x|by)\s*(${QUESTION_NUMBER})\s+(rectangle|triangle|parallelogram)`);
    if (dimensionsMatch) {
      const first = parseLooseNumber(dimensionsMatch[1]);
      const second = parseLooseNumber(dimensionsMatch[2]);
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
    throw new Error('I could not read the complete area question. Give one shape and its dimensions in the same unit, without extra calculations.');
  }

  if (lower.includes('binary')) {
    const binaryMatch = matchQuestion(lower, String.raw`binary\s+(-?[01]+(?:[ _][01]+)*)\s*(${QUESTION_OPERATOR})\s*(-?[01]+(?:[ _][01]+)*)`);
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
    const match = matchQuestion(lower, String.raw`(?:the )?(?:average|mean)\s+(?:of\s+)?(.+)`);
    if (match) {
      const values = match[1].split(/,\s+(?:and\s+)?|\s+and\s+|\s+/).map(parseLooseNumber);
      return {
        confidence: 'high',
        inputs: { values },
        source: 'parser',
        tool_slug: 'average-calculator',
      };
    }
    throw new Error('Give only the numbers to average. Separate values with a comma and space; use commas without spaces for thousands.');
  }

  const absoluteDifferenceMatch = matchQuestion(lower,
    String.raw`(?:the )?absolute difference\s*(?:between|of)?\s*(${QUESTION_NUMBER})\s*(?:and|,|to)\s*(${QUESTION_NUMBER})`);
  if (absoluteDifferenceMatch) {
    return {
      confidence: 'high',
      inputs: { comparisonValue: parseLooseNumber(absoluteDifferenceMatch[2]), value: parseLooseNumber(absoluteDifferenceMatch[1]) },
      source: 'parser',
      tool_slug: 'absolute-value-calculator',
    };
  }

  const absoluteBarsMatch = matchQuestion(lower, String.raw`\|\s*(${QUESTION_NUMBER})\s*\|`);
  const absoluteValueMatch =
    absoluteBarsMatch ?? matchQuestion(lower, String.raw`(?:the )?(?:absolute value|abs)\s*(?:of\s*)?(${QUESTION_NUMBER})`)
      ?? matchQuestion(lower, String.raw`abs\(\s*(${QUESTION_NUMBER})\s*\)`);
  if (absoluteValueMatch) {
    return {
      confidence: 'high',
      inputs: { value: parseLooseNumber(absoluteValueMatch[1]) },
      source: 'parser',
      tool_slug: 'absolute-value-calculator',
    };
  }

  if (lower.includes('bmi')) {
    const metricMatch = matchQuestion(lower, String.raw`bmi\s+(?:for\s+)?(${QUESTION_NUMBER})\s*kg\s+(?:(?:and|at)\s+)?(${QUESTION_NUMBER})\s*cm`);
    if (metricMatch) {
      return {
        confidence: 'high',
        inputs: { heightCm: parseLooseNumber(metricMatch[2]), weightKg: parseLooseNumber(metricMatch[1]) },
        source: 'parser',
        tool_slug: 'bmi-calculator',
      };
    }
    throw new Error('I could not read the complete BMI question. Give weight in kg and height in cm; additional conditions are not supported here.');
  }

  const bigNumberMatch = matchQuestion(lower, String.raw`big number\s+(-?\d+)\s*(${QUESTION_OPERATOR})\s*(-?\d+)`);
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

  const arithmeticMatch = matchQuestion(lower, String.raw`(${QUESTION_NUMBER})\s*(${QUESTION_OPERATOR})\s*(${QUESTION_NUMBER})`);
  if (arithmeticMatch) {
    return {
      confidence: 'medium',
      inputs: {
        left: parseLooseNumber(arithmeticMatch[1]),
        operator: normalizeOperator(arithmeticMatch[2]),
        right: parseLooseNumber(arithmeticMatch[3]),
      },
      source: 'parser',
      tool_slug: 'basic-calculator',
    };
  }

  if (lower.includes('tip')) {
    const match = matchQuestion(lower, String.raw`tip\s+(?:on|for)\s+\$?(${QUESTION_NUMBER})\s+(?:at|with)\s+(${QUESTION_NUMBER})\s*%`);
    if (match) {
      return {
        confidence: 'medium',
        inputs: { people: 1, subtotal: parseLooseNumber(match[1]), taxPercent: 0, tipPercent: parseLooseNumber(match[2]) },
        source: 'parser',
        tool_slug: 'tip-calculator',
      };
    }
    throw new Error('I could not read the complete tip question. Give the subtotal and tip percentage; extra tax or split conditions need the tip tool.');
  }

  // Grouped expressions must not regain a partial answer through model routing.
  if (/(?:%|percent)\s*(?:of|x|times)|(?:is|as)\s+(?:what|which)\s+percent\b|\b(?:binary|big number|absolute|abs)\b|\||(?:\d[\d,.e]*|[)\]}])\s*(?:[+*/^=\-x]|\b(?:times|minus|plus|divided by)\b)/.test(lower)) {
    throw new Error('I could not read the complete calculation. Ask one percentage calculation or one operation with two numbers, without extra units or operators.');
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

async function callOllamaChat(body: Record<string, unknown>, signal?: AbortSignal) {
  const apiKey = getOllamaApiKey();
  if (!apiKey) throw new AskUnavailableError();

  return withRequestDeadline(async (requestSignal) => {
    const response = await fetch(`${OLLAMA_HOST}/api/chat`, {
      body: JSON.stringify(body),
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      method: 'POST',
      signal: requestSignal,
    });
    requestSignal.throwIfAborted();
    if (!response.ok) throw new AskUnavailableError();

    return (await response.json()) as {
      message?: {
        content?: string;
        tool_calls?: Array<{ function?: { arguments?: unknown; name?: string } }>;
      };
    };
  }, ASK_PROVIDER_TIMEOUT_MS, signal);
}

async function routeWithOllama(message: string, signal?: AbortSignal): Promise<ToolCallRoute | null> {
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
  }, signal);

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

export async function answerUtilityQuestion(message: string, options: { signal?: AbortSignal } = {}): Promise<AskToolAnswer> {
  loadPrivateEnv();
  if (options.signal?.aborted) throw new DOMException('The request was cancelled.', 'AbortError');

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
      route = await routeWithOllama(trimmed, options.signal);
      if (route) route = correctOllamaRouteInputs(trimmed, route);
      if (route) model = process.env.OLLAMA_MODEL || DEFAULT_OLLAMA_MODEL;
    } catch (error) {
      if (error instanceof DOMException && (error.name === 'TimeoutError' || error.name === 'AbortError')) throw error;
      throw new AskUnavailableError();
    }
  }
  if (options.signal?.aborted) throw new DOMException('The request was cancelled.', 'AbortError');

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
