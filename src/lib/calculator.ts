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

export interface FactorizationResult {
  value: number;
  factors: number[];
  factorPairs: Array<[number, number]>;
  primeFactors: number[];
  primeFactorPowers: Array<{ prime: number; exponent: number }>;
  isPrime: boolean;
}

export type RoundingMode = 'decimal-places' | 'significant-figures' | 'place-value';
export type RoundingMethod = 'nearest' | 'up' | 'down' | 'truncate';

export interface RoundingResult {
  input: number;
  mode: RoundingMode;
  method: RoundingMethod;
  precision: number;
  result: number;
  difference: number;
}

export type MatrixOperation = 'add' | 'subtract' | 'multiply' | 'determinant' | 'transpose';

export interface MatrixCalculationResult {
  operation: MatrixOperation;
  left: number[][];
  right?: number[][];
  result: number[][] | number;
}

export interface ScientificNotationResult {
  original: number;
  coefficient: number;
  exponent: number;
  notation: string;
  standard: string;
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
export type BigIntegerOperationResult = IntegerOperationResult;

export type SequenceKind = 'arithmetic' | 'geometric' | 'fibonacci';
export type ConfidenceLevel = 80 | 85 | 90 | 95 | 98 | 99;

export interface DescriptiveStatisticsResult {
  values: number[];
  sortedValues: number[];
  count: number;
  sum: number;
  mean: number;
  median: number;
  modes: number[];
  min: number;
  max: number;
  range: number;
  q1: number;
  q3: number;
  iqr: number;
  populationVariance: number;
  populationStandardDeviation: number;
  sampleVariance: number | null;
  sampleStandardDeviation: number | null;
}

export interface SequenceResult {
  kind: SequenceKind;
  terms: number[];
  nextTerms: number[];
  formula: string;
  steps: string[];
  commonDifference?: number;
  commonRatio?: number;
}

export interface SampleSizeResult {
  confidenceLevel: ConfidenceLevel;
  zScore: number;
  marginOfError: number;
  proportion: number;
  populationSize: number | null;
  rawSampleSize: number;
  adjustedSampleSize: number | null;
  requiredSampleSize: number;
}

export interface ProbabilityResult {
  probabilityA: number;
  probabilityB: number;
  intersection: number;
  union: number;
  complementA: number;
  complementB: number;
  independentIntersection: boolean;
}

export interface PermutationCombinationResult {
  n: number;
  r: number;
  permutations: bigint;
  combinations: bigint;
}

export interface ZScoreResult {
  value: number;
  mean: number;
  standardDeviation: number;
  zScore: number;
  percentile: number;
}

export type ConfidenceIntervalMode = 'mean' | 'proportion';

export interface ConfidenceIntervalResult {
  mode: ConfidenceIntervalMode;
  confidenceLevel: ConfidenceLevel;
  zScore: number;
  pointEstimate: number;
  sampleSize: number;
  standardError: number;
  marginOfError: number;
  lowerBound: number;
  upperBound: number;
}

const randomUint32Bound = 0x100000000;
const maxRandomQuantity = 1000;
const maxPoolGenerationRange = 100000;
const maxFactorInput = 1000000000000;
const maxStatisticsValues = 1000;
const maxPermutationInput = 500;
const zScoresByConfidenceLevel: Record<ConfidenceLevel, number> = {
  80: 1.282,
  85: 1.44,
  90: 1.645,
  95: 1.96,
  98: 2.326,
  99: 2.576,
};

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

export function formatBigInteger(value: bigint): string {
  const negative = value < 0n;
  const digits = (negative ? -value : value).toString();
  const groups: string[] = [];

  for (let index = digits.length; index > 0; index -= 3) {
    groups.unshift(digits.slice(Math.max(0, index - 3), index));
  }

  return `${negative ? '-' : ''}${groups.join(',')}`;
}

export function parseBigInteger(input: string, label = 'Value'): bigint {
  const normalized = input.trim().replace(/[,\s_]/g, '');

  if (!normalized || normalized === '-' || !/^-?\d+$/.test(normalized)) {
    throw new Error(`${label} must be a whole number`);
  }

  return BigInt(normalized);
}

export function parseBigIntegerList(input: string, label = 'Values'): bigint[] {
  const tokens = input.split(/[\s,;]+/).filter(Boolean);

  if (tokens.length < 2) {
    throw new Error(`${label} must include at least two whole numbers`);
  }

  return tokens.map((token, index) => parseBigInteger(token, `${label} ${index + 1}`));
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

function assertPositiveBigInteger(value: bigint, label: string) {
  if (value <= 0n) {
    throw new Error(`${label} must be greater than zero`);
  }
}

function greatestCommonDivisorBigInt(left: bigint, right: bigint) {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;

  while (b !== 0n) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }

  return a;
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

export function calculateGreatestCommonFactor(values: bigint[]): bigint {
  if (values.length < 2) {
    throw new Error('Enter at least two whole numbers');
  }

  values.forEach((value, index) => assertPositiveBigInteger(value, `Value ${index + 1}`));

  return values.reduce((current, value) => greatestCommonDivisorBigInt(current, value));
}

export function calculateLeastCommonMultiple(values: bigint[]): bigint {
  if (values.length < 2) {
    throw new Error('Enter at least two whole numbers');
  }

  values.forEach((value, index) => assertPositiveBigInteger(value, `Value ${index + 1}`));

  return values.reduce((current, value) => (current / greatestCommonDivisorBigInt(current, value)) * value);
}

export function calculateFactors(value: number): FactorizationResult {
  assertSafeInteger(value, 'Value');

  if (value < 1) {
    throw new Error('Value must be greater than zero');
  }

  if (value > maxFactorInput) {
    throw new Error(`Value must be ${maxFactorInput} or smaller`);
  }

  const factors: number[] = [];
  const factorPairs: Array<[number, number]> = [];

  for (let divisor = 1; divisor * divisor <= value; divisor += 1) {
    if (value % divisor === 0) {
      const pair = value / divisor;
      factors.push(divisor);
      factorPairs.push([divisor, pair]);

      if (pair !== divisor) {
        factors.push(pair);
      }
    }
  }

  factors.sort((left, right) => left - right);

  let remaining = value;
  const primeFactors: number[] = [];
  const primeFactorPowers: Array<{ prime: number; exponent: number }> = [];

  for (let divisor = 2; divisor * divisor <= remaining; divisor += divisor === 2 ? 1 : 2) {
    let exponent = 0;

    while (remaining % divisor === 0) {
      primeFactors.push(divisor);
      remaining /= divisor;
      exponent += 1;
    }

    if (exponent > 0) {
      primeFactorPowers.push({ prime: divisor, exponent });
    }
  }

  if (remaining > 1) {
    primeFactors.push(remaining);
    primeFactorPowers.push({ prime: remaining, exponent: 1 });
  }

  return {
    value,
    factors,
    factorPairs,
    primeFactors,
    primeFactorPowers,
    isPrime: value > 1 && factors.length === 2,
  };
}

function applyRoundingMethod(value: number, method: RoundingMethod) {
  if (method === 'up') return Math.ceil(value);
  if (method === 'down') return Math.floor(value);
  if (method === 'truncate') return Math.trunc(value);

  return Math.sign(value) * Math.round(Math.abs(value));
}

function cleanRoundedNumber(value: number) {
  if (Object.is(value, -0)) {
    return 0;
  }

  return Number.parseFloat(value.toPrecision(15));
}

export function calculateRoundedValue(
  input: number,
  mode: RoundingMode,
  precision: number,
  method: RoundingMethod = 'nearest',
): RoundingResult {
  assertFiniteNumber(input, 'Value');
  assertFiniteNumber(precision, 'Precision');

  if (!Number.isInteger(precision)) {
    throw new Error('Precision must be a whole number');
  }

  let result: number;

  if (mode === 'decimal-places') {
    if (precision < 0 || precision > 12) {
      throw new Error('Decimal places must be between 0 and 12');
    }

    const factor = 10 ** precision;
    result = applyRoundingMethod(input * factor, method) / factor;
  } else if (mode === 'significant-figures') {
    if (precision < 1 || precision > 15) {
      throw new Error('Significant figures must be between 1 and 15');
    }

    if (input === 0) {
      result = 0;
    } else {
      const exponent = Math.floor(Math.log10(Math.abs(input)));
      const decimalPlaces = precision - exponent - 1;
      const factor = 10 ** decimalPlaces;
      result = applyRoundingMethod(input * factor, method) / factor;
    }
  } else {
    if (precision < -6 || precision > 12) {
      throw new Error('Place value exponent must be between -6 and 12');
    }

    const placeValue = 10 ** precision;
    result = applyRoundingMethod(input / placeValue, method) * placeValue;
  }

  const cleanedResult = cleanRoundedNumber(result);

  return {
    input,
    mode,
    method,
    precision,
    result: cleanedResult,
    difference: cleanRoundedNumber(cleanedResult - input),
  };
}

function validateMatrix(matrix: number[][], label: string) {
  if (matrix.length < 1) {
    throw new Error(`${label} must have at least one row`);
  }

  const width = matrix[0].length;

  if (width < 1) {
    throw new Error(`${label} must have at least one column`);
  }

  matrix.forEach((row, rowIndex) => {
    if (row.length !== width) {
      throw new Error(`${label} rows must be the same length`);
    }

    row.forEach((value, columnIndex) => {
      assertFiniteNumber(value, `${label} row ${rowIndex + 1}, column ${columnIndex + 1}`);
    });
  });
}

function assertSameMatrixSize(left: number[][], right: number[][]) {
  if (left.length !== right.length || left[0].length !== right[0].length) {
    throw new Error('Matrices must have the same size');
  }
}

export function addMatrices(left: number[][], right: number[][]): number[][] {
  validateMatrix(left, 'Matrix A');
  validateMatrix(right, 'Matrix B');
  assertSameMatrixSize(left, right);

  return left.map((row, rowIndex) => row.map((value, columnIndex) => value + right[rowIndex][columnIndex]));
}

export function subtractMatrices(left: number[][], right: number[][]): number[][] {
  validateMatrix(left, 'Matrix A');
  validateMatrix(right, 'Matrix B');
  assertSameMatrixSize(left, right);

  return left.map((row, rowIndex) => row.map((value, columnIndex) => value - right[rowIndex][columnIndex]));
}

export function multiplyMatrices(left: number[][], right: number[][]): number[][] {
  validateMatrix(left, 'Matrix A');
  validateMatrix(right, 'Matrix B');

  if (left[0].length !== right.length) {
    throw new Error('Matrix A columns must match Matrix B rows');
  }

  return left.map((row) =>
    right[0].map((_, columnIndex) =>
      row.reduce((sum, value, sharedIndex) => sum + value * right[sharedIndex][columnIndex], 0),
    ),
  );
}

export function transposeMatrix(matrix: number[][]): number[][] {
  validateMatrix(matrix, 'Matrix');

  return matrix[0].map((_, columnIndex) => matrix.map((row) => row[columnIndex]));
}

export function calculateMatrixDeterminant(matrix: number[][]): number {
  validateMatrix(matrix, 'Matrix');

  if (matrix.length !== matrix[0].length) {
    throw new Error('Determinant needs a square matrix');
  }

  if (matrix.length === 1) {
    return matrix[0][0];
  }

  if (matrix.length === 2) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  }

  return matrix[0].reduce((sum, value, columnIndex) => {
    const minor = matrix.slice(1).map((row) => row.filter((_, index) => index !== columnIndex));
    const sign = columnIndex % 2 === 0 ? 1 : -1;

    return sum + sign * value * calculateMatrixDeterminant(minor);
  }, 0);
}

export function calculateMatrixOperation(
  operation: MatrixOperation,
  left: number[][],
  right?: number[][],
): MatrixCalculationResult {
  if (operation === 'add') {
    if (!right) throw new Error('Matrix B is required');
    return { operation, left, right, result: addMatrices(left, right) };
  }

  if (operation === 'subtract') {
    if (!right) throw new Error('Matrix B is required');
    return { operation, left, right, result: subtractMatrices(left, right) };
  }

  if (operation === 'multiply') {
    if (!right) throw new Error('Matrix B is required');
    return { operation, left, right, result: multiplyMatrices(left, right) };
  }

  if (operation === 'transpose') {
    return { operation, left, result: transposeMatrix(left) };
  }

  return { operation, left, result: calculateMatrixDeterminant(left) };
}

function formatPlainNumber(value: number) {
  if (value === 0) return '0';

  const text = value.toLocaleString('en-US', {
    maximumFractionDigits: 14,
    useGrouping: false,
  });

  return text.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
}

export function toScientificNotation(value: number): ScientificNotationResult {
  assertFiniteNumber(value, 'Value');

  if (value === 0) {
    return {
      original: 0,
      coefficient: 0,
      exponent: 0,
      notation: '0 x 10^0',
      standard: '0',
    };
  }

  const exponent = Math.floor(Math.log10(Math.abs(value)));
  const coefficient = cleanRoundedNumber(value / 10 ** exponent);
  const standard = formatPlainNumber(value);

  return {
    original: value,
    coefficient,
    exponent,
    notation: `${formatPlainNumber(coefficient)} x 10^${exponent}`,
    standard,
  };
}

export function fromScientificNotation(coefficient: number, exponent: number): ScientificNotationResult {
  assertFiniteNumber(coefficient, 'Coefficient');
  assertFiniteNumber(exponent, 'Exponent');

  if (!Number.isInteger(exponent)) {
    throw new Error('Exponent must be a whole number');
  }

  const value = coefficient * 10 ** exponent;

  if (!Number.isFinite(value)) {
    throw new Error('Scientific notation value is outside calculator range');
  }

  return toScientificNotation(value);
}

export function parseNumberList(input: string, label = 'Values'): number[] {
  const tokens = input.split(/[\s,;]+/).filter(Boolean);

  if (tokens.length < 1) {
    throw new Error(`${label} must include at least one number`);
  }

  if (tokens.length > maxStatisticsValues) {
    throw new Error(`${label} can include at most ${maxStatisticsValues} numbers`);
  }

  return tokens.map((token, index) => {
    const parsed = Number(token);

    if (!Number.isFinite(parsed)) {
      throw new Error(`${label} ${index + 1} must be a number`);
    }

    return parsed;
  });
}

function medianOfSorted(values: number[]) {
  const middle = Math.floor(values.length / 2);

  if (values.length % 2 === 1) {
    return values[middle];
  }

  return (values[middle - 1] + values[middle]) / 2;
}

function calculateQuartiles(sortedValues: number[]) {
  if (sortedValues.length === 1) {
    return {
      q1: sortedValues[0],
      q3: sortedValues[0],
    };
  }

  const middle = Math.floor(sortedValues.length / 2);
  const lowerHalf = sortedValues.slice(0, middle);
  const upperHalf =
    sortedValues.length % 2 === 0 ? sortedValues.slice(middle) : sortedValues.slice(middle + 1);

  return {
    q1: medianOfSorted(lowerHalf),
    q3: medianOfSorted(upperHalf),
  };
}

export function calculateDescriptiveStatistics(values: number[]): DescriptiveStatisticsResult {
  if (values.length < 1) {
    throw new Error('Enter at least one number');
  }

  if (values.length > maxStatisticsValues) {
    throw new Error(`Enter ${maxStatisticsValues} numbers or fewer`);
  }

  values.forEach((value, index) => assertFiniteNumber(value, `Value ${index + 1}`));

  const sortedValues = [...values].sort((left, right) => left - right);
  const count = values.length;
  const sum = values.reduce((total, value) => total + value, 0);
  const mean = sum / count;
  const median = medianOfSorted(sortedValues);
  const frequency = new Map<number, number>();

  for (const value of values) {
    frequency.set(value, (frequency.get(value) ?? 0) + 1);
  }

  const maxFrequency = Math.max(...frequency.values());
  const modes =
    maxFrequency > 1
      ? [...frequency.entries()]
          .filter(([, occurrences]) => occurrences === maxFrequency)
          .map(([value]) => value)
          .sort((left, right) => left - right)
      : [];
  const min = sortedValues[0];
  const max = sortedValues[sortedValues.length - 1];
  const range = max - min;
  const { q1, q3 } = calculateQuartiles(sortedValues);
  const squaredDifferences = values.map((value) => (value - mean) ** 2);
  const populationVariance = squaredDifferences.reduce((total, value) => total + value, 0) / count;
  const sampleVariance =
    count > 1 ? squaredDifferences.reduce((total, value) => total + value, 0) / (count - 1) : null;

  return {
    values,
    sortedValues,
    count,
    sum,
    mean,
    median,
    modes,
    min,
    max,
    range,
    q1,
    q3,
    iqr: q3 - q1,
    populationVariance,
    populationStandardDeviation: Math.sqrt(populationVariance),
    sampleVariance,
    sampleStandardDeviation: sampleVariance === null ? null : Math.sqrt(sampleVariance),
  };
}

export function calculateStandardDeviation(values: number[], useSample = true) {
  const statistics = calculateDescriptiveStatistics(values);

  if (useSample && statistics.sampleStandardDeviation === null) {
    throw new Error('Sample standard deviation needs at least two numbers');
  }

  return {
    statistics,
    variance: useSample ? statistics.sampleVariance as number : statistics.populationVariance,
    standardDeviation: useSample
      ? statistics.sampleStandardDeviation as number
      : statistics.populationStandardDeviation,
  };
}

export function calculateNumberSequence(
  kind: SequenceKind,
  first: number,
  second: number,
  length: number,
): SequenceResult {
  assertFiniteNumber(first, 'First term');
  assertFiniteNumber(second, kind === 'arithmetic' ? 'Common difference' : 'Second term or ratio');
  assertSafeInteger(length, 'Number of terms');

  if (length < 2 || length > 30) {
    throw new Error('Number of terms must be between 2 and 30');
  }

  if (kind === 'arithmetic') {
    const commonDifference = second;
    const terms = Array.from({ length }, (_, index) => cleanRoundedNumber(first + commonDifference * index));
    const nextTerms = Array.from({ length: 3 }, (_, index) =>
      cleanRoundedNumber(first + commonDifference * (length + index)),
    );

    return {
      kind,
      terms,
      nextTerms,
      commonDifference,
      formula: `a(n) = ${formatCalculatorNumber(first)} + (n - 1) x ${formatCalculatorNumber(commonDifference)}`,
      steps: [
        `Start with first term ${formatCalculatorNumber(first)}.`,
        `Add the common difference ${formatCalculatorNumber(commonDifference)} each time.`,
        `Generate ${length} terms, then continue the same pattern for the next terms.`,
      ],
    };
  }

  if (kind === 'geometric') {
    const commonRatio = second;
    const terms = Array.from({ length }, (_, index) => cleanRoundedNumber(first * commonRatio ** index));
    const nextTerms = Array.from({ length: 3 }, (_, index) =>
      cleanRoundedNumber(first * commonRatio ** (length + index)),
    );

    return {
      kind,
      terms,
      nextTerms,
      commonRatio,
      formula: `a(n) = ${formatCalculatorNumber(first)} x ${formatCalculatorNumber(commonRatio)}^(n - 1)`,
      steps: [
        `Start with first term ${formatCalculatorNumber(first)}.`,
        `Multiply by the common ratio ${formatCalculatorNumber(commonRatio)} each time.`,
        `Generate ${length} terms, then continue the same pattern for the next terms.`,
      ],
    };
  }

  const terms = [first, second];

  while (terms.length < length) {
    terms.push(cleanRoundedNumber(terms[terms.length - 1] + terms[terms.length - 2]));
  }

  const nextTerms = [...terms];
  while (nextTerms.length < length + 3) {
    nextTerms.push(cleanRoundedNumber(nextTerms[nextTerms.length - 1] + nextTerms[nextTerms.length - 2]));
  }

  return {
    kind,
    terms,
    nextTerms: nextTerms.slice(length),
    formula: 'a(n) = a(n - 1) + a(n - 2)',
    steps: [
      `Start with ${formatCalculatorNumber(first)} and ${formatCalculatorNumber(second)}.`,
      'Add the previous two terms to get each new term.',
      `Generate ${length} terms, then continue the same rule for the next terms.`,
    ],
  };
}

function assertProbability(value: number, label: string) {
  assertFiniteNumber(value, label);

  if (value < 0 || value > 1) {
    throw new Error(`${label} must be between 0 and 1`);
  }
}

export function probabilityPercentToDecimal(value: number, label: string) {
  assertFiniteNumber(value, label);

  if (value < 0 || value > 100) {
    throw new Error(`${label} must be between 0 and 100`);
  }

  return value / 100;
}

export function calculateProbability(
  probabilityA: number,
  probabilityB: number,
  intersection: number | null = null,
): ProbabilityResult {
  assertProbability(probabilityA, 'Probability A');
  assertProbability(probabilityB, 'Probability B');

  const resolvedIntersection = intersection === null ? probabilityA * probabilityB : intersection;
  assertProbability(resolvedIntersection, 'Intersection probability');

  if (resolvedIntersection > probabilityA || resolvedIntersection > probabilityB) {
    throw new Error('Intersection cannot be larger than either event probability');
  }

  const union = probabilityA + probabilityB - resolvedIntersection;

  if (union > 1) {
    throw new Error('Union probability cannot be greater than 1');
  }

  return {
    probabilityA,
    probabilityB,
    intersection: resolvedIntersection,
    union,
    complementA: 1 - probabilityA,
    complementB: 1 - probabilityB,
    independentIntersection: intersection === null,
  };
}

function getZScoreForConfidence(confidenceLevel: ConfidenceLevel) {
  const zScore = zScoresByConfidenceLevel[confidenceLevel];

  if (!zScore) {
    throw new Error('Choose a supported confidence level');
  }

  return zScore;
}

export function calculateSampleSize(
  confidenceLevel: ConfidenceLevel,
  marginOfErrorPercent: number,
  proportionPercent: number,
  populationSize: number | null = null,
): SampleSizeResult {
  const zScore = getZScoreForConfidence(confidenceLevel);
  const marginOfError = probabilityPercentToDecimal(marginOfErrorPercent, 'Margin of error');
  const proportion = probabilityPercentToDecimal(proportionPercent, 'Population proportion');

  if (marginOfError <= 0) {
    throw new Error('Margin of error must be greater than zero');
  }

  if (proportion <= 0 || proportion >= 1) {
    throw new Error('Population proportion must be greater than 0% and less than 100%');
  }

  let normalizedPopulationSize: number | null = null;
  if (populationSize !== null) {
    assertSafeInteger(populationSize, 'Population size');
    if (populationSize < 1) {
      throw new Error('Population size must be greater than zero');
    }
    normalizedPopulationSize = populationSize;
  }

  const rawSampleSize = (zScore ** 2 * proportion * (1 - proportion)) / marginOfError ** 2;
  const adjustedSampleSize =
    normalizedPopulationSize === null
      ? null
      : rawSampleSize / (1 + (rawSampleSize - 1) / normalizedPopulationSize);

  return {
    confidenceLevel,
    zScore,
    marginOfError,
    proportion,
    populationSize: normalizedPopulationSize,
    rawSampleSize,
    adjustedSampleSize,
    requiredSampleSize: Math.ceil(adjustedSampleSize ?? rawSampleSize),
  };
}

function factorial(value: number) {
  assertSafeInteger(value, 'Value');

  if (value < 0 || value > maxPermutationInput) {
    throw new Error(`Value must be between 0 and ${maxPermutationInput}`);
  }

  let result = 1n;

  for (let factor = 2; factor <= value; factor += 1) {
    result *= BigInt(factor);
  }

  return result;
}

export function calculatePermutationCombination(n: number, r: number): PermutationCombinationResult {
  assertSafeInteger(n, 'n');
  assertSafeInteger(r, 'r');

  if (n < 0 || n > maxPermutationInput) {
    throw new Error(`n must be between 0 and ${maxPermutationInput}`);
  }

  if (r < 0 || r > n) {
    throw new Error('r must be between 0 and n');
  }

  let permutations = 1n;

  for (let value = n - r + 1; value <= n; value += 1) {
    permutations *= BigInt(value);
  }

  const combinations = permutations / factorial(r);

  return {
    n,
    r,
    permutations,
    combinations,
  };
}

function erf(value: number) {
  const sign = value < 0 ? -1 : 1;
  const x = Math.abs(value);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x));

  return sign * y;
}

export function normalCdf(zScore: number) {
  assertFiniteNumber(zScore, 'z-score');

  return 0.5 * (1 + erf(zScore / Math.SQRT2));
}

export function calculateZScore(value: number, mean: number, standardDeviation: number): ZScoreResult {
  assertFiniteNumber(value, 'Value');
  assertFiniteNumber(mean, 'Mean');
  assertPositiveNumber(standardDeviation, 'Standard deviation');

  const zScore = (value - mean) / standardDeviation;

  return {
    value,
    mean,
    standardDeviation,
    zScore,
    percentile: normalCdf(zScore),
  };
}

export function calculateMeanConfidenceInterval(
  sampleMean: number,
  standardDeviation: number,
  sampleSize: number,
  confidenceLevel: ConfidenceLevel,
): ConfidenceIntervalResult {
  assertFiniteNumber(sampleMean, 'Sample mean');
  assertPositiveNumber(standardDeviation, 'Standard deviation');
  assertSafeInteger(sampleSize, 'Sample size');

  if (sampleSize < 1) {
    throw new Error('Sample size must be greater than zero');
  }

  const zScore = getZScoreForConfidence(confidenceLevel);
  const standardError = standardDeviation / Math.sqrt(sampleSize);
  const marginOfError = zScore * standardError;

  return {
    mode: 'mean',
    confidenceLevel,
    zScore,
    pointEstimate: sampleMean,
    sampleSize,
    standardError,
    marginOfError,
    lowerBound: sampleMean - marginOfError,
    upperBound: sampleMean + marginOfError,
  };
}

export function calculateProportionConfidenceInterval(
  successes: number,
  sampleSize: number,
  confidenceLevel: ConfidenceLevel,
): ConfidenceIntervalResult {
  assertSafeInteger(successes, 'Successes');
  assertSafeInteger(sampleSize, 'Sample size');

  if (sampleSize < 1) {
    throw new Error('Sample size must be greater than zero');
  }

  if (successes < 0 || successes > sampleSize) {
    throw new Error('Successes must be between 0 and sample size');
  }

  const zScore = getZScoreForConfidence(confidenceLevel);
  const pointEstimate = successes / sampleSize;
  const standardError = Math.sqrt((pointEstimate * (1 - pointEstimate)) / sampleSize);
  const marginOfError = zScore * standardError;

  return {
    mode: 'proportion',
    confidenceLevel,
    zScore,
    pointEstimate,
    sampleSize,
    standardError,
    marginOfError,
    lowerBound: Math.max(0, pointEstimate - marginOfError),
    upperBound: Math.min(1, pointEstimate + marginOfError),
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

export function calculateBigIntegerOperation(
  left: bigint,
  operator: CalculatorOperator,
  right: bigint,
): BigIntegerOperationResult {
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
