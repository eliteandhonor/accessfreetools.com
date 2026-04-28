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

export interface PercentErrorResult {
  measuredValue: number;
  acceptedValue: number;
  error: number;
  absoluteError: number;
  relativeError: number;
  percentError: number;
  signedPercentError: number;
}

export interface ExponentResult {
  base: number;
  exponent: number;
  value: number;
}

export interface HalfLifeRemainingResult {
  initialAmount: number;
  halfLife: number;
  elapsedTime: number;
  halfLives: number;
  remainingAmount: number;
  decayedAmount: number;
  percentRemaining: number;
  percentDecayed: number;
}

export interface ComplexNumberValue {
  real: number;
  imaginary: number;
}

export type QuadraticRootType = 'two-real' | 'one-real' | 'complex';

export interface QuadraticFormulaResult {
  a: number;
  b: number;
  c: number;
  discriminant: number;
  rootType: QuadraticRootType;
  roots: ComplexNumberValue[];
  vertex: {
    x: number;
    y: number;
  };
  axisOfSymmetry: number;
  opens: 'up' | 'down';
  yIntercept: number;
}

export interface LogarithmResult {
  value: number;
  base: number;
  result: number;
  naturalLog: number;
  commonLog: number;
}

export interface RootResult {
  radicand: number;
  index: number;
  value: number;
  exponent: number;
}

export interface RatioSimplificationResult {
  originalValues: number[];
  scaledValues: number[];
  simplifiedValues: number[];
  scaleFactor: number;
  divisor: number;
}

export interface EquivalentRatioResult {
  knownLeft: number;
  knownRight: number;
  newLeft: number;
  newRight: number;
}

export interface RatioShareResult {
  total: number;
  ratioValues: number[];
  shares: number[];
}

export interface IntegerOperationResult {
  left: bigint;
  operator: CalculatorOperator;
  right: bigint;
  result: bigint;
  quotient?: bigint;
  remainder?: bigint;
}

export type BinaryIntegerOperationResult = IntegerOperationResult;

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

export function calculatePercentError(measuredValue: number, acceptedValue: number): PercentErrorResult {
  if (!Number.isFinite(measuredValue)) {
    throw new Error('Measured value must be a number');
  }

  if (!Number.isFinite(acceptedValue)) {
    throw new Error('Accepted value must be a number');
  }

  if (acceptedValue === 0) {
    throw new Error('Accepted value cannot be zero');
  }

  const error = measuredValue - acceptedValue;
  const absoluteError = Math.abs(error);
  const relativeError = absoluteError / Math.abs(acceptedValue);
  const signedPercentError = (error / Math.abs(acceptedValue)) * 100;

  return {
    measuredValue,
    acceptedValue,
    error,
    absoluteError,
    relativeError,
    percentError: relativeError * 100,
    signedPercentError,
  };
}

export function parseExponentInput(input: string): number {
  const trimmed = input.trim();

  if (!trimmed) {
    throw new Error('Exponent is required');
  }

  const fractionMatch = trimmed.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*\/\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))$/);

  if (fractionMatch) {
    const numerator = Number(fractionMatch[1]);
    const denominator = Number(fractionMatch[2]);

    if (denominator === 0) {
      throw new Error('Exponent fraction denominator cannot be zero');
    }

    return numerator / denominator;
  }

  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed)) {
    throw new Error('Exponent must be a number or simple fraction');
  }

  return parsed;
}

export function calculateExponent(base: number, exponent: number): ExponentResult {
  if (!Number.isFinite(base)) {
    throw new Error('Base must be a number');
  }

  if (!Number.isFinite(exponent)) {
    throw new Error('Exponent must be a number');
  }

  if (base === 0 && exponent < 0) {
    throw new Error('Zero cannot be raised to a negative exponent');
  }

  if (base === 0 && exponent === 0) {
    throw new Error('0 to the power of 0 is indeterminate');
  }

  if (base < 0 && !Number.isInteger(exponent)) {
    throw new Error('Negative bases need a whole-number exponent in this calculator');
  }

  const value = base ** exponent;

  if (!Number.isFinite(value)) {
    throw new Error('Result is outside calculator range');
  }

  return {
    base,
    exponent,
    value,
  };
}

function assertFiniteNumber(value: number, label: string) {
  if (!Number.isFinite(value)) {
    throw new Error(`${label} must be a number`);
  }
}

function assertPositiveNumber(value: number, label: string) {
  assertFiniteNumber(value, label);

  if (value <= 0) {
    throw new Error(`${label} must be greater than zero`);
  }
}

function assertNonNegativeNumber(value: number, label: string) {
  assertFiniteNumber(value, label);

  if (value < 0) {
    throw new Error(`${label} cannot be negative`);
  }
}

export function calculateHalfLifeRemaining(
  initialAmount: number,
  halfLife: number,
  elapsedTime: number,
): HalfLifeRemainingResult {
  assertPositiveNumber(initialAmount, 'Initial amount');
  assertPositiveNumber(halfLife, 'Half-life');
  assertFiniteNumber(elapsedTime, 'Elapsed time');

  if (elapsedTime < 0) {
    throw new Error('Elapsed time cannot be negative');
  }

  const halfLives = elapsedTime / halfLife;
  const remainingAmount = initialAmount * 0.5 ** halfLives;
  const decayedAmount = initialAmount - remainingAmount;
  const percentRemaining = (remainingAmount / initialAmount) * 100;

  return {
    initialAmount,
    halfLife,
    elapsedTime,
    halfLives,
    remainingAmount,
    decayedAmount,
    percentRemaining,
    percentDecayed: 100 - percentRemaining,
  };
}

export function calculateHalfLifeElapsedTime(
  initialAmount: number,
  finalAmount: number,
  halfLife: number,
): number {
  assertPositiveNumber(initialAmount, 'Initial amount');
  assertPositiveNumber(finalAmount, 'Final amount');
  assertPositiveNumber(halfLife, 'Half-life');

  if (finalAmount > initialAmount) {
    throw new Error('Final amount cannot be greater than initial amount');
  }

  if (finalAmount === initialAmount) {
    return 0;
  }

  return halfLife * (Math.log(finalAmount / initialAmount) / Math.log(0.5));
}

export function calculateHalfLifeValue(
  initialAmount: number,
  finalAmount: number,
  elapsedTime: number,
): number {
  assertPositiveNumber(initialAmount, 'Initial amount');
  assertPositiveNumber(finalAmount, 'Final amount');
  assertPositiveNumber(elapsedTime, 'Elapsed time');

  if (finalAmount >= initialAmount) {
    throw new Error('Final amount must be less than initial amount');
  }

  return elapsedTime * (Math.log(0.5) / Math.log(finalAmount / initialAmount));
}

export function calculateQuadraticFormula(a: number, b: number, c: number): QuadraticFormulaResult {
  assertFiniteNumber(a, 'Coefficient a');
  assertFiniteNumber(b, 'Coefficient b');
  assertFiniteNumber(c, 'Coefficient c');

  if (a === 0) {
    throw new Error('Coefficient a cannot be zero for a quadratic equation');
  }

  const discriminant = b ** 2 - 4 * a * c;
  const denominator = 2 * a;
  const vertexX = -b / denominator;
  const vertexY = a * vertexX ** 2 + b * vertexX + c;
  let rootType: QuadraticRootType;
  let roots: ComplexNumberValue[];

  if (discriminant > 0) {
    const squareRoot = Math.sqrt(discriminant);
    rootType = 'two-real';
    roots = [
      { real: (-b + squareRoot) / denominator, imaginary: 0 },
      { real: (-b - squareRoot) / denominator, imaginary: 0 },
    ];
  } else if (discriminant === 0) {
    rootType = 'one-real';
    roots = [{ real: -b / denominator, imaginary: 0 }];
  } else {
    const squareRoot = Math.sqrt(Math.abs(discriminant));
    rootType = 'complex';
    roots = [
      { real: -b / denominator, imaginary: squareRoot / denominator },
      { real: -b / denominator, imaginary: -squareRoot / denominator },
    ];
  }

  return {
    a,
    b,
    c,
    discriminant,
    rootType,
    roots,
    vertex: {
      x: vertexX,
      y: vertexY,
    },
    axisOfSymmetry: vertexX,
    opens: a > 0 ? 'up' : 'down',
    yIntercept: c,
  };
}

export function calculateLogarithm(value: number, base: number): LogarithmResult {
  assertPositiveNumber(value, 'Log value');
  assertPositiveNumber(base, 'Log base');

  if (base === 1) {
    throw new Error('Log base cannot be 1');
  }

  return {
    value,
    base,
    result: Math.log(value) / Math.log(base),
    naturalLog: Math.log(value),
    commonLog: Math.log10(value),
  };
}

export function calculateNthRoot(radicand: number, index: number): RootResult {
  assertFiniteNumber(radicand, 'Radicand');
  assertPositiveNumber(index, 'Root index');

  if (!Number.isInteger(index)) {
    throw new Error('Root index must be a whole number');
  }

  if (index < 2) {
    throw new Error('Root index must be at least 2');
  }

  if (radicand < 0 && index % 2 === 0) {
    throw new Error('Even roots of negative numbers are not real numbers');
  }

  const absoluteRoot = Math.abs(radicand) ** (1 / index);
  const value = radicand < 0 ? -absoluteRoot : absoluteRoot;

  if (!Number.isFinite(value)) {
    throw new Error('Root result is outside calculator range');
  }

  return {
    radicand,
    index,
    value,
    exponent: 1 / index,
  };
}

function getDecimalPlaces(value: number) {
  const text = value.toString().toLowerCase();

  if (text.includes('e-')) {
    return Math.min(Number(text.split('e-')[1]), 8);
  }

  if (text.includes('e+')) {
    return 0;
  }

  return Math.min(text.split('.')[1]?.length ?? 0, 8);
}

export function simplifyRatioValues(values: number[]): RatioSimplificationResult {
  if (values.length < 2) {
    throw new Error('Enter at least two ratio values');
  }

  values.forEach((value, index) => {
    assertNonNegativeNumber(value, `Ratio value ${index + 1}`);
  });

  if (values.every((value) => value === 0)) {
    throw new Error('At least one ratio value must be greater than zero');
  }

  const decimalPlaces = Math.max(...values.map(getDecimalPlaces));
  const scaleFactor = 10 ** decimalPlaces;
  const scaledValues = values.map((value) => Math.round(value * scaleFactor));
  const divisor = scaledValues.filter((value) => value !== 0).reduce(
    (currentDivisor, value) => greatestCommonDivisor(currentDivisor, value),
    0,
  );

  return {
    originalValues: values,
    scaledValues,
    simplifiedValues: scaledValues.map((value) => value / divisor),
    scaleFactor,
    divisor,
  };
}

export function calculateEquivalentRatio(
  knownLeft: number,
  knownRight: number,
  newLeft: number,
): EquivalentRatioResult {
  assertPositiveNumber(knownLeft, 'Known left value');
  assertNonNegativeNumber(knownRight, 'Known right value');
  assertPositiveNumber(newLeft, 'New left value');

  return {
    knownLeft,
    knownRight,
    newLeft,
    newRight: (knownRight * newLeft) / knownLeft,
  };
}

export function calculateRatioShare(total: number, ratioValues: number[]): RatioShareResult {
  assertNonNegativeNumber(total, 'Total');
  simplifyRatioValues(ratioValues);

  const ratioTotal = ratioValues.reduce((sum, value) => sum + value, 0);
  const shares = ratioValues.map((value) => (total * value) / ratioTotal);

  return {
    total,
    ratioValues,
    shares,
  };
}

export function parseBinaryInteger(input: string, label = 'Binary value'): bigint {
  const normalized = input.trim().replace(/[\s_]/g, '');

  if (!normalized || normalized === '-' || !/^-?[01]+$/.test(normalized)) {
    throw new Error(`${label} must contain only 0 and 1`);
  }

  const negative = normalized.startsWith('-');
  const digits = negative ? normalized.slice(1) : normalized;
  const value = BigInt(`0b${digits}`);

  return negative ? -value : value;
}

export function parseDecimalInteger(input: string, label = 'Decimal value'): bigint {
  const normalized = input.trim().replace(/[,\s_]/g, '');

  if (!normalized || normalized === '-' || !/^-?\d+$/.test(normalized)) {
    throw new Error(`${label} must be a whole decimal number`);
  }

  return BigInt(normalized);
}

export function formatBinaryInteger(value: bigint): string {
  const negative = value < 0n;
  const absoluteValue = negative ? -value : value;

  return `${negative ? '-' : ''}${absoluteValue.toString(2)}`;
}

export function groupBinaryDigits(value: bigint): string {
  const raw = formatBinaryInteger(value);
  const negative = raw.startsWith('-');
  const digits = negative ? raw.slice(1) : raw;
  const groups: string[] = [];

  for (let index = digits.length; index > 0; index -= 4) {
    groups.unshift(digits.slice(Math.max(0, index - 4), index));
  }

  return `${negative ? '-' : ''}${groups.join(' ')}`;
}

export function parseHexInteger(input: string, label = 'Hex value'): bigint {
  const normalized = input.trim().replace(/[\s_]/g, '');
  const negative = normalized.startsWith('-');
  const unsigned = negative ? normalized.slice(1) : normalized;
  const digits = unsigned.replace(/^0x/i, '');

  if (!digits || !/^[0-9a-f]+$/i.test(digits)) {
    throw new Error(`${label} must contain only 0-9 and A-F`);
  }

  const value = BigInt(`0x${digits}`);

  return negative ? -value : value;
}

export function formatHexInteger(value: bigint): string {
  const negative = value < 0n;
  const absoluteValue = negative ? -value : value;

  return `${negative ? '-' : ''}${absoluteValue.toString(16).toUpperCase()}`;
}

export function groupHexDigits(value: bigint): string {
  const raw = formatHexInteger(value);
  const negative = raw.startsWith('-');
  const digits = negative ? raw.slice(1) : raw;
  const groups: string[] = [];

  for (let index = digits.length; index > 0; index -= 4) {
    groups.unshift(digits.slice(Math.max(0, index - 4), index));
  }

  return `${negative ? '-' : ''}${groups.join(' ')}`;
}

export function calculateBinaryIntegerOperation(
  left: bigint,
  operator: CalculatorOperator,
  right: bigint,
): IntegerOperationResult {
  switch (operator) {
    case '+':
      return {
        left,
        operator,
        right,
        result: left + right,
      };
    case '-':
      return {
        left,
        operator,
        right,
        result: left - right,
      };
    case '*':
      return {
        left,
        operator,
        right,
        result: left * right,
      };
    case '/': {
      if (right === 0n) {
        throw new Error('Cannot divide by zero');
      }

      const quotient = left / right;
      const remainder = left % right;

      return {
        left,
        operator,
        right,
        result: quotient,
        quotient,
        remainder,
      };
    }
    default: {
      const exhaustiveCheck: never = operator;
      return exhaustiveCheck;
    }
  }
}

export function calculateHexIntegerOperation(
  left: bigint,
  operator: CalculatorOperator,
  right: bigint,
): IntegerOperationResult {
  return calculateBinaryIntegerOperation(left, operator, right);
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
