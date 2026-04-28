export type CalculatorOperator = '+' | '-' | '*' | '/';
export type FractionOperator = CalculatorOperator;
export type RandomUint32Source = () => number;

export interface FractionValue {
  numerator: number;
  denominator: number;
}

export interface MixedFractionInput {
  whole?: number;
  numerator: number;
  denominator: number;
}

export type PercentageAdjustmentDirection = 'increase' | 'decrease';

export interface RandomNumberOptions {
  min: number;
  max: number;
  quantity: number;
  allowDuplicates: boolean;
  sortResults: boolean;
  excludedNumbers?: number[];
}

const randomUint32Bound = 0x100000000;
const maxRandomQuantity = 1000;
const maxPoolGenerationRange = 100000;

export function calculateBinary(
  left: number,
  operator: CalculatorOperator,
  right: number,
): number {
  switch (operator) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '*':
      return left * right;
    case '/':
      if (right === 0) {
        throw new Error('Cannot divide by zero');
      }
      return left / right;
    default: {
      const exhaustiveCheck: never = operator;
      return exhaustiveCheck;
    }
  }
}

export function formatCalculatorNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return 'Error';
  }

  if (Math.abs(value) >= 1e12 || (Math.abs(value) > 0 && Math.abs(value) < 1e-8)) {
    return value.toExponential(8).replace(/\.?0+e/, 'e');
  }

  const rounded = Number.parseFloat(value.toPrecision(12));
  return rounded.toLocaleString('en-US', {
    maximumFractionDigits: 10,
    useGrouping: false,
  });
}

export function parseDisplayValue(display: string): number {
  const parsed = Number(display.replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function toggleDisplaySign(display: string): string {
  if (display === '0' || display === 'Error') {
    return '0';
  }

  return display.startsWith('-') ? display.slice(1) : `-${display}`;
}

export function percentDisplayValue(
  display: string,
  baseValue: number | null = null,
  operator: CalculatorOperator | null = null,
): string {
  const displayValue = parseDisplayValue(display);

  if (baseValue !== null && (operator === '+' || operator === '-')) {
    return formatCalculatorNumber((baseValue * displayValue) / 100);
  }

  return formatCalculatorNumber(displayValue / 100);
}

function greatestCommonDivisor(left: number, right: number) {
  let a = Math.abs(left);
  let b = Math.abs(right);

  while (b !== 0) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }

  return a || 1;
}

function assertInteger(value: number, label: string) {
  if (!Number.isInteger(value)) {
    throw new Error(`${label} must be a whole number`);
  }
}

function assertSafeInteger(value: number, label: string) {
  if (!Number.isSafeInteger(value)) {
    throw new Error(`${label} must be a safe whole number`);
  }
}

function secureRandomUint32(): number {
  if (globalThis.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    globalThis.crypto.getRandomValues(values);
    return values[0];
  }

  return Math.floor(Math.random() * randomUint32Bound);
}

function randomIntegerOffset(range: number, getRandomUint32: RandomUint32Source) {
  const unbiasedLimit = Math.floor(randomUint32Bound / range) * range;
  let value = getRandomUint32();

  while (value >= unbiasedLimit) {
    value = getRandomUint32();
  }

  return value % range;
}

export function randomIntegerInRange(
  min: number,
  max: number,
  getRandomUint32: RandomUint32Source = secureRandomUint32,
): number {
  assertSafeInteger(min, 'Minimum');
  assertSafeInteger(max, 'Maximum');

  if (min > max) {
    throw new Error('Minimum cannot be greater than maximum');
  }

  const range = max - min + 1;

  if (range > randomUint32Bound) {
    throw new Error('Range cannot contain more than 4,294,967,296 possible values');
  }

  return min + randomIntegerOffset(range, getRandomUint32);
}

export function parseExcludedNumbers(input: string): number[] {
  const trimmed = input.trim();

  if (!trimmed) {
    return [];
  }

  const tokens = trimmed.split(/[\s,;]+/).filter(Boolean);
  const excluded = new Set<number>();

  for (const token of tokens) {
    const parsed = Number(token);

    if (!Number.isSafeInteger(parsed)) {
      throw new Error('Excluded numbers must be whole numbers separated by commas');
    }

    excluded.add(parsed);
  }

  return [...excluded];
}

export function generateRandomNumbers(
  options: RandomNumberOptions,
  getRandomUint32: RandomUint32Source = secureRandomUint32,
): number[] {
  assertSafeInteger(options.min, 'Minimum');
  assertSafeInteger(options.max, 'Maximum');
  assertSafeInteger(options.quantity, 'Quantity');

  if (options.min > options.max) {
    throw new Error('Minimum cannot be greater than maximum');
  }

  if (options.quantity < 1 || options.quantity > maxRandomQuantity) {
    throw new Error(`Quantity must be between 1 and ${maxRandomQuantity}`);
  }

  const range = options.max - options.min + 1;

  if (range > randomUint32Bound) {
    throw new Error('Range cannot contain more than 4,294,967,296 possible values');
  }

  const excludedNumbers = options.excludedNumbers ?? [];
  const excludedSet = new Set<number>();

  for (const value of excludedNumbers) {
    assertSafeInteger(value, 'Excluded number');

    if (value >= options.min && value <= options.max) {
      excludedSet.add(value);
    }
  }

  const availableCount = range - excludedSet.size;

  if (availableCount < 1) {
    throw new Error('No numbers are available in this range');
  }

  if (!options.allowDuplicates && options.quantity > availableCount) {
    throw new Error('Quantity cannot be larger than the available unique numbers');
  }

  const shouldUsePool =
    range <= maxPoolGenerationRange &&
    (!options.allowDuplicates || excludedSet.size > 0);

  if (shouldUsePool) {
    const pool: number[] = [];

    for (let value = options.min; value <= options.max; value += 1) {
      if (!excludedSet.has(value)) {
        pool.push(value);
      }
    }

    const results: number[] = [];

    if (options.allowDuplicates) {
      for (let index = 0; index < options.quantity; index += 1) {
        results.push(pool[randomIntegerInRange(0, pool.length - 1, getRandomUint32)]);
      }
    } else {
      for (let index = 0; index < options.quantity; index += 1) {
        const chosenIndex = randomIntegerInRange(0, pool.length - 1 - index, getRandomUint32);
        results.push(pool[chosenIndex]);
        pool[chosenIndex] = pool[pool.length - 1 - index];
      }
    }

    return options.sortResults ? [...results].sort((left, right) => left - right) : results;
  }

  const results: number[] = [];
  const seen = new Set<number>();
  const maxAttempts = options.quantity * 80 + excludedSet.size + 1000;
  let attempts = 0;

  while (results.length < options.quantity) {
    const candidate = randomIntegerInRange(options.min, options.max, getRandomUint32);
    attempts += 1;

    if (excludedSet.has(candidate) || (!options.allowDuplicates && seen.has(candidate))) {
      if (attempts > maxAttempts) {
        throw new Error('Try a smaller range or allow duplicates for this request');
      }

      continue;
    }

    seen.add(candidate);
    results.push(candidate);
  }

  return options.sortResults ? [...results].sort((left, right) => left - right) : results;
}

export function simplifyFraction(numerator: number, denominator: number): FractionValue {
  assertInteger(numerator, 'Numerator');
  assertInteger(denominator, 'Denominator');

  if (denominator === 0) {
    throw new Error('Denominator cannot be zero');
  }

  if (numerator === 0) {
    return { numerator: 0, denominator: 1 };
  }

  const sign = denominator < 0 ? -1 : 1;
  const normalizedNumerator = numerator * sign;
  const normalizedDenominator = Math.abs(denominator);
  const divisor = greatestCommonDivisor(normalizedNumerator, normalizedDenominator);

  return {
    numerator: normalizedNumerator / divisor,
    denominator: normalizedDenominator / divisor,
  };
}

export function mixedToFraction(input: MixedFractionInput): FractionValue {
  const whole = input.whole ?? 0;

  assertInteger(whole, 'Whole number');
  assertInteger(input.numerator, 'Numerator');
  assertInteger(input.denominator, 'Denominator');

  if (input.denominator === 0) {
    throw new Error('Denominator cannot be zero');
  }

  if (whole === 0) {
    return simplifyFraction(input.numerator, input.denominator);
  }

  const sign = whole < 0 || input.numerator < 0 ? -1 : 1;
  const numerator =
    sign * (Math.abs(whole) * Math.abs(input.denominator) + Math.abs(input.numerator));

  return simplifyFraction(numerator, Math.abs(input.denominator));
}

export function calculateFraction(
  left: FractionValue,
  operator: FractionOperator,
  right: FractionValue,
): FractionValue {
  switch (operator) {
    case '+':
      return simplifyFraction(
        left.numerator * right.denominator + right.numerator * left.denominator,
        left.denominator * right.denominator,
      );
    case '-':
      return simplifyFraction(
        left.numerator * right.denominator - right.numerator * left.denominator,
        left.denominator * right.denominator,
      );
    case '*':
      return simplifyFraction(left.numerator * right.numerator, left.denominator * right.denominator);
    case '/':
      if (right.numerator === 0) {
        throw new Error('Cannot divide by zero');
      }

      return simplifyFraction(left.numerator * right.denominator, left.denominator * right.numerator);
    default: {
      const exhaustiveCheck: never = operator;
      return exhaustiveCheck;
    }
  }
}

export function formatImproperFraction(value: FractionValue): string {
  if (value.denominator === 1) {
    return `${value.numerator}`;
  }

  return `${value.numerator}/${value.denominator}`;
}

export function formatMixedFraction(value: FractionValue): string {
  if (value.denominator === 1) {
    return `${value.numerator}`;
  }

  const absoluteNumerator = Math.abs(value.numerator);

  if (absoluteNumerator < value.denominator) {
    return formatImproperFraction(value);
  }

  const sign = value.numerator < 0 ? '-' : '';
  const whole = Math.trunc(absoluteNumerator / value.denominator);
  const remainder = absoluteNumerator % value.denominator;

  if (remainder === 0) {
    return `${sign}${whole}`;
  }

  return `${sign}${whole} ${remainder}/${value.denominator}`;
}

export function fractionToDecimal(value: FractionValue): string {
  return formatCalculatorNumber(value.numerator / value.denominator);
}

export function calculatePercentageOf(percent: number, value: number): number {
  return (percent / 100) * value;
}

export function calculatePercentOf(part: number, whole: number): number {
  if (whole === 0) {
    throw new Error('Whole value cannot be zero');
  }

  return (part / whole) * 100;
}

export function calculatePercentageChange(originalValue: number, newValue: number): number {
  if (originalValue === 0) {
    throw new Error('Original value cannot be zero');
  }

  return ((newValue - originalValue) / Math.abs(originalValue)) * 100;
}

export function applyPercentageAdjustment(
  value: number,
  percent: number,
  direction: PercentageAdjustmentDirection,
): number {
  const multiplier = direction === 'increase' ? 1 + percent / 100 : 1 - percent / 100;
  return value * multiplier;
}

export function reversePercentageValue(value: number, percent: number): number {
  if (percent === 0) {
    throw new Error('Percentage cannot be zero');
  }

  return value / (percent / 100);
}

type ScientificAngleMode = 'deg' | 'rad';

type ScientificToken =
  | { type: 'number'; value: number }
  | { type: 'operator'; value: '+' | '-' | '*' | '/' | '^' }
  | { type: 'function'; value: string }
  | { type: 'leftParen' }
  | { type: 'rightParen' };

const scientificFunctions = new Set([
  'sin',
  'cos',
  'tan',
  'asin',
  'acos',
  'atan',
  'sqrt',
  'cbrt',
  'log',
  'ln',
  'abs',
]);

const constants: Record<string, number> = {
  e: Math.E,
  pi: Math.PI,
};

function toRadians(value: number, angleMode: ScientificAngleMode) {
  return angleMode === 'deg' ? (value * Math.PI) / 180 : value;
}

function fromRadians(value: number, angleMode: ScientificAngleMode) {
  return angleMode === 'deg' ? (value * 180) / Math.PI : value;
}

function tokenizeScientificExpression(expression: string): ScientificToken[] {
  const tokens: ScientificToken[] = [];
  let index = 0;

  while (index < expression.length) {
    const char = expression[index];

    if (/\s/.test(char) || char === ',') {
      index += 1;
      continue;
    }

    if (/\d|\./.test(char)) {
      let numberText = char;
      index += 1;

      while (index < expression.length && /[\d.]/.test(expression[index])) {
        numberText += expression[index];
        index += 1;
      }

      if (expression[index]?.toLowerCase() === 'e') {
        const exponentStart = index;
        let exponentText = 'e';
        index += 1;

        if (expression[index] === '+' || expression[index] === '-') {
          exponentText += expression[index];
          index += 1;
        }

        while (index < expression.length && /\d/.test(expression[index])) {
          exponentText += expression[index];
          index += 1;
        }

        if (exponentText.length > 1 && /\d$/.test(exponentText)) {
          numberText += exponentText;
        } else {
          index = exponentStart;
        }
      }

      const value = Number(numberText);
      if (!Number.isFinite(value)) {
        throw new Error('Invalid number');
      }

      tokens.push({ type: 'number', value });
      continue;
    }

    if (char === 'x' || char === 'X') {
      tokens.push({ type: 'operator', value: '*' });
      index += 1;
      continue;
    }

    if (/[a-z]/i.test(char)) {
      let word = char.toLowerCase();
      index += 1;

      while (index < expression.length && /[a-z]/i.test(expression[index])) {
        word += expression[index].toLowerCase();
        index += 1;
      }

      if (word in constants) {
        tokens.push({ type: 'number', value: constants[word] });
        continue;
      }

      if (!scientificFunctions.has(word)) {
        throw new Error(`Unknown function: ${word}`);
      }

      tokens.push({ type: 'function', value: word });
      continue;
    }

    if ('+-*/^'.includes(char)) {
      const previous = tokens[tokens.length - 1];
      const isUnaryMinus =
        char === '-' &&
        (!previous || previous.type === 'operator' || previous.type === 'leftParen' || previous.type === 'function');

      if (isUnaryMinus) {
        tokens.push({ type: 'number', value: 0 });
      }

      tokens.push({ type: 'operator', value: char as '+' | '-' | '*' | '/' | '^' });
      index += 1;
      continue;
    }

    if (char === '(') {
      tokens.push({ type: 'leftParen' });
      index += 1;
      continue;
    }

    if (char === ')') {
      tokens.push({ type: 'rightParen' });
      index += 1;
      continue;
    }

    throw new Error(`Unsupported character: ${char}`);
  }

  return tokens;
}

function getPrecedence(operator: string) {
  if (operator === '+' || operator === '-') return 1;
  if (operator === '*' || operator === '/') return 2;
  if (operator === '^') return 3;
  return 0;
}

function toReversePolish(tokens: ScientificToken[]) {
  const output: ScientificToken[] = [];
  const stack: ScientificToken[] = [];

  for (const token of tokens) {
    if (token.type === 'number') {
      output.push(token);
      continue;
    }

    if (token.type === 'function') {
      stack.push(token);
      continue;
    }

    if (token.type === 'operator') {
      while (stack.length > 0) {
        const top = stack[stack.length - 1];
        if (
          top.type === 'function' ||
          (top.type === 'operator' &&
            (getPrecedence(top.value) > getPrecedence(token.value) ||
              (getPrecedence(top.value) === getPrecedence(token.value) && token.value !== '^')))
        ) {
          output.push(stack.pop() as ScientificToken);
          continue;
        }
        break;
      }

      stack.push(token);
      continue;
    }

    if (token.type === 'leftParen') {
      stack.push(token);
      continue;
    }

    while (stack.length > 0 && stack[stack.length - 1].type !== 'leftParen') {
      output.push(stack.pop() as ScientificToken);
    }

    if (stack.length === 0) {
      throw new Error('Mismatched parentheses');
    }

    stack.pop();

    if (stack[stack.length - 1]?.type === 'function') {
      output.push(stack.pop() as ScientificToken);
    }
  }

  while (stack.length > 0) {
    const token = stack.pop() as ScientificToken;
    if (token.type === 'leftParen' || token.type === 'rightParen') {
      throw new Error('Mismatched parentheses');
    }
    output.push(token);
  }

  return output;
}

function applyScientificFunction(name: string, input: number, angleMode: ScientificAngleMode) {
  switch (name) {
    case 'sin':
      return Math.sin(toRadians(input, angleMode));
    case 'cos':
      return Math.cos(toRadians(input, angleMode));
    case 'tan':
      return Math.tan(toRadians(input, angleMode));
    case 'asin':
      return fromRadians(Math.asin(input), angleMode);
    case 'acos':
      return fromRadians(Math.acos(input), angleMode);
    case 'atan':
      return fromRadians(Math.atan(input), angleMode);
    case 'sqrt':
      if (input < 0) throw new Error('Invalid square root');
      return Math.sqrt(input);
    case 'cbrt':
      return Math.cbrt(input);
    case 'log':
      if (input <= 0) throw new Error('Invalid logarithm');
      return Math.log10(input);
    case 'ln':
      if (input <= 0) throw new Error('Invalid logarithm');
      return Math.log(input);
    case 'abs':
      return Math.abs(input);
    default:
      throw new Error(`Unknown function: ${name}`);
  }
}

export function calculateScientificExpression(expression: string, angleMode: ScientificAngleMode = 'deg') {
  const tokens = tokenizeScientificExpression(expression);
  const output = toReversePolish(tokens);
  const stack: number[] = [];

  for (const token of output) {
    if (token.type === 'number') {
      stack.push(token.value);
      continue;
    }

    if (token.type === 'function') {
      if (stack.length < 1) throw new Error('Missing function input');
      const input = stack.pop() as number;
      stack.push(applyScientificFunction(token.value, input, angleMode));
      continue;
    }

    if (token.type === 'operator') {
      if (stack.length < 2) throw new Error('Missing operator input');
      const right = stack.pop() as number;
      const left = stack.pop() as number;

      if (token.value === '+') stack.push(left + right);
      if (token.value === '-') stack.push(left - right);
      if (token.value === '*') stack.push(left * right);
      if (token.value === '/') {
        if (right === 0) throw new Error('Cannot divide by zero');
        stack.push(left / right);
      }
      if (token.value === '^') stack.push(left ** right);
    }
  }

  if (stack.length !== 1 || !Number.isFinite(stack[0])) {
    throw new Error('Invalid expression');
  }

  return stack[0];
}
