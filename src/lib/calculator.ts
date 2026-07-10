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

export interface AbsoluteValueResult {
  value: number;
  absoluteValue: number;
  comparisonValue?: number;
  signedDifference?: number;
  absoluteDifference?: number;
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

export interface LongDivisionResult {
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: number;
  decimal: number;
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

export type PValueTail = 'left' | 'right' | 'two';

export interface PValueResult {
  zScore: number;
  tail: PValueTail;
  leftTail: number;
  rightTail: number;
  pValue: number;
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

export type AreaShape = 'rectangle' | 'triangle' | 'circle' | 'trapezoid' | 'parallelogram';
export type VolumeShape = 'rectangular-prism' | 'cube' | 'cylinder' | 'sphere' | 'cone';
export type SurfaceAreaShape = 'rectangular-prism' | 'cube' | 'cylinder' | 'sphere' | 'cone';
export type PythagoreanSolveFor = 'hypotenuse' | 'leg-a' | 'leg-b';
export type RightTriangleMode = 'legs' | 'leg-hypotenuse';

export interface TriangleFromSidesResult {
  sideA: number;
  sideB: number;
  sideC: number;
  semiperimeter: number;
  perimeter: number;
  area: number;
  angleA: number;
  angleB: number;
  angleC: number;
  sideType: 'equilateral' | 'isosceles' | 'scalene';
  angleType: 'acute' | 'right' | 'obtuse';
}

export interface ShapeMeasurementResult {
  shape: string;
  value: number;
  formula: string;
  metrics: Array<{ label: string; value: number }>;
}

export interface CircleMeasurementResult {
  radius: number;
  diameter: number;
  circumference: number;
  area: number;
}

export interface SlopeResult {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  rise: number;
  run: number;
  slope: number | null;
  yIntercept: number | null;
}

export interface DistanceResult {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  deltaX: number;
  deltaY: number;
  distance: number;
  midpoint: {
    x: number;
    y: number;
  };
}

export interface PythagoreanResult {
  solveFor: PythagoreanSolveFor;
  legA: number;
  legB: number;
  hypotenuse: number;
}

export interface RightTriangleResult {
  legA: number;
  legB: number;
  hypotenuse: number;
  area: number;
  perimeter: number;
  angleA: number;
  angleB: number;
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

export function calculateAbsoluteValue(value: number, comparisonValue?: number): AbsoluteValueResult {
  if (!Number.isFinite(value)) {
    throw new Error('Value must be a number');
  }

  if (comparisonValue !== undefined && !Number.isFinite(comparisonValue)) {
    throw new Error('Comparison value must be a number');
  }

  const result: AbsoluteValueResult = {
    value,
    absoluteValue: Math.abs(value),
  };

  if (comparisonValue !== undefined) {
    const signedDifference = value - comparisonValue;

    result.comparisonValue = comparisonValue;
    result.signedDifference = signedDifference;
    result.absoluteDifference = Math.abs(signedDifference);
  }

  return result;
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

function degreesFromRadians(value: number) {
  return (value * 180) / Math.PI;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function square(value: number) {
  return value * value;
}

function assertTriangleSides(sideA: number, sideB: number, sideC: number) {
  assertPositiveNumber(sideA, 'Side a');
  assertPositiveNumber(sideB, 'Side b');
  assertPositiveNumber(sideC, 'Side c');

  if (sideA + sideB <= sideC || sideA + sideC <= sideB || sideB + sideC <= sideA) {
    throw new Error('Triangle sides must satisfy the triangle inequality');
  }
}

export function calculateTriangleFromSides(
  sideA: number,
  sideB: number,
  sideC: number,
): TriangleFromSidesResult {
  assertTriangleSides(sideA, sideB, sideC);

  const semiperimeter = (sideA + sideB + sideC) / 2;
  const area = Math.sqrt(
    semiperimeter * (semiperimeter - sideA) * (semiperimeter - sideB) * (semiperimeter - sideC),
  );
  const angleA = degreesFromRadians(
    Math.acos(clamp((square(sideB) + square(sideC) - square(sideA)) / (2 * sideB * sideC), -1, 1)),
  );
  const angleB = degreesFromRadians(
    Math.acos(clamp((square(sideA) + square(sideC) - square(sideB)) / (2 * sideA * sideC), -1, 1)),
  );
  const angleC = 180 - angleA - angleB;
  const sortedSides = [sideA, sideB, sideC].sort((left, right) => left - right);
  const rightDelta = Math.abs(square(sortedSides[0]) + square(sortedSides[1]) - square(sortedSides[2]));
  const tolerance = Math.max(1e-10, square(sortedSides[2]) * 1e-10);
  const sideType =
    sideA === sideB && sideB === sideC ? 'equilateral' : sideA === sideB || sideA === sideC || sideB === sideC ? 'isosceles' : 'scalene';
  const angleType =
    rightDelta <= tolerance ? 'right' : square(sortedSides[0]) + square(sortedSides[1]) < square(sortedSides[2]) ? 'obtuse' : 'acute';

  return {
    sideA,
    sideB,
    sideC,
    semiperimeter,
    perimeter: sideA + sideB + sideC,
    area,
    angleA,
    angleB,
    angleC,
    sideType,
    angleType,
  };
}

export function calculateShapeArea(shape: AreaShape, measurements: Record<string, number>): ShapeMeasurementResult {
  const metric = (label: string, value: number) => ({ label, value });

  switch (shape) {
    case 'rectangle': {
      const length = measurements.length;
      const width = measurements.width;
      assertPositiveNumber(length, 'Length');
      assertPositiveNumber(width, 'Width');

      return {
        shape,
        value: length * width,
        formula: 'A = length x width',
        metrics: [metric('Length', length), metric('Width', width)],
      };
    }
    case 'triangle': {
      const base = measurements.base;
      const height = measurements.height;
      assertPositiveNumber(base, 'Base');
      assertPositiveNumber(height, 'Height');

      return {
        shape,
        value: (base * height) / 2,
        formula: 'A = base x height / 2',
        metrics: [metric('Base', base), metric('Height', height)],
      };
    }
    case 'circle': {
      const radius = measurements.radius;
      assertPositiveNumber(radius, 'Radius');

      return {
        shape,
        value: Math.PI * square(radius),
        formula: 'A = pi x r^2',
        metrics: [metric('Radius', radius), metric('Diameter', radius * 2)],
      };
    }
    case 'trapezoid': {
      const baseA = measurements.baseA;
      const baseB = measurements.baseB;
      const height = measurements.height;
      assertPositiveNumber(baseA, 'Base 1');
      assertPositiveNumber(baseB, 'Base 2');
      assertPositiveNumber(height, 'Height');

      return {
        shape,
        value: ((baseA + baseB) * height) / 2,
        formula: 'A = (base 1 + base 2) x height / 2',
        metrics: [metric('Base 1', baseA), metric('Base 2', baseB), metric('Height', height)],
      };
    }
    case 'parallelogram': {
      const base = measurements.base;
      const height = measurements.height;
      assertPositiveNumber(base, 'Base');
      assertPositiveNumber(height, 'Height');

      return {
        shape,
        value: base * height,
        formula: 'A = base x height',
        metrics: [metric('Base', base), metric('Height', height)],
      };
    }
    default: {
      const exhaustiveCheck: never = shape;
      return exhaustiveCheck;
    }
  }
}

export function calculateShapeVolume(shape: VolumeShape, measurements: Record<string, number>): ShapeMeasurementResult {
  const metric = (label: string, value: number) => ({ label, value });

  switch (shape) {
    case 'rectangular-prism': {
      const length = measurements.length;
      const width = measurements.width;
      const height = measurements.height;
      assertPositiveNumber(length, 'Length');
      assertPositiveNumber(width, 'Width');
      assertPositiveNumber(height, 'Height');

      return {
        shape,
        value: length * width * height,
        formula: 'V = length x width x height',
        metrics: [metric('Length', length), metric('Width', width), metric('Height', height)],
      };
    }
    case 'cube': {
      const side = measurements.side;
      assertPositiveNumber(side, 'Side length');

      return {
        shape,
        value: side ** 3,
        formula: 'V = side^3',
        metrics: [metric('Side length', side)],
      };
    }
    case 'cylinder': {
      const radius = measurements.radius;
      const height = measurements.height;
      assertPositiveNumber(radius, 'Radius');
      assertPositiveNumber(height, 'Height');

      return {
        shape,
        value: Math.PI * square(radius) * height,
        formula: 'V = pi x r^2 x h',
        metrics: [metric('Radius', radius), metric('Height', height)],
      };
    }
    case 'sphere': {
      const radius = measurements.radius;
      assertPositiveNumber(radius, 'Radius');

      return {
        shape,
        value: (4 / 3) * Math.PI * radius ** 3,
        formula: 'V = 4/3 x pi x r^3',
        metrics: [metric('Radius', radius), metric('Diameter', radius * 2)],
      };
    }
    case 'cone': {
      const radius = measurements.radius;
      const height = measurements.height;
      assertPositiveNumber(radius, 'Radius');
      assertPositiveNumber(height, 'Height');

      return {
        shape,
        value: (Math.PI * square(radius) * height) / 3,
        formula: 'V = pi x r^2 x h / 3',
        metrics: [metric('Radius', radius), metric('Height', height)],
      };
    }
    default: {
      const exhaustiveCheck: never = shape;
      return exhaustiveCheck;
    }
  }
}

export function calculateShapeSurfaceArea(
  shape: SurfaceAreaShape,
  measurements: Record<string, number>,
): ShapeMeasurementResult {
  const metric = (label: string, value: number) => ({ label, value });

  switch (shape) {
    case 'rectangular-prism': {
      const length = measurements.length;
      const width = measurements.width;
      const height = measurements.height;
      assertPositiveNumber(length, 'Length');
      assertPositiveNumber(width, 'Width');
      assertPositiveNumber(height, 'Height');

      return {
        shape,
        value: 2 * (length * width + length * height + width * height),
        formula: 'SA = 2lw + 2lh + 2wh',
        metrics: [metric('Length', length), metric('Width', width), metric('Height', height)],
      };
    }
    case 'cube': {
      const side = measurements.side;
      assertPositiveNumber(side, 'Side length');

      return {
        shape,
        value: 6 * square(side),
        formula: 'SA = 6s^2',
        metrics: [metric('Side length', side)],
      };
    }
    case 'cylinder': {
      const radius = measurements.radius;
      const height = measurements.height;
      assertPositiveNumber(radius, 'Radius');
      assertPositiveNumber(height, 'Height');

      return {
        shape,
        value: 2 * Math.PI * square(radius) + 2 * Math.PI * radius * height,
        formula: 'SA = 2pi r^2 + 2pi rh',
        metrics: [metric('Radius', radius), metric('Height', height)],
      };
    }
    case 'sphere': {
      const radius = measurements.radius;
      assertPositiveNumber(radius, 'Radius');

      return {
        shape,
        value: 4 * Math.PI * square(radius),
        formula: 'SA = 4pi r^2',
        metrics: [metric('Radius', radius), metric('Diameter', radius * 2)],
      };
    }
    case 'cone': {
      const radius = measurements.radius;
      const height = measurements.height;
      assertPositiveNumber(radius, 'Radius');
      assertPositiveNumber(height, 'Height');
      const slantHeight = Math.sqrt(square(radius) + square(height));

      return {
        shape,
        value: Math.PI * radius * (radius + slantHeight),
        formula: 'SA = pi r(r + l), where l = sqrt(r^2 + h^2)',
        metrics: [metric('Radius', radius), metric('Height', height), metric('Slant height', slantHeight)],
      };
    }
    default: {
      const exhaustiveCheck: never = shape;
      return exhaustiveCheck;
    }
  }
}

export function calculateCircleFromRadius(radius: number): CircleMeasurementResult {
  assertPositiveNumber(radius, 'Radius');

  return {
    radius,
    diameter: radius * 2,
    circumference: 2 * Math.PI * radius,
    area: Math.PI * square(radius),
  };
}

export function calculateCircleFromMeasurement(
  knownMeasure: 'radius' | 'diameter' | 'circumference' | 'area',
  value: number,
): CircleMeasurementResult {
  assertPositiveNumber(value, 'Known circle value');

  switch (knownMeasure) {
    case 'radius':
      return calculateCircleFromRadius(value);
    case 'diameter':
      return calculateCircleFromRadius(value / 2);
    case 'circumference':
      return calculateCircleFromRadius(value / (2 * Math.PI));
    case 'area':
      return calculateCircleFromRadius(Math.sqrt(value / Math.PI));
    default: {
      const exhaustiveCheck: never = knownMeasure;
      return exhaustiveCheck;
    }
  }
}

export function calculateSlope(x1: number, y1: number, x2: number, y2: number): SlopeResult {
  assertFiniteNumber(x1, 'x1');
  assertFiniteNumber(y1, 'y1');
  assertFiniteNumber(x2, 'x2');
  assertFiniteNumber(y2, 'y2');

  if (x1 === x2 && y1 === y2) {
    throw new Error('The two points must be different');
  }

  const rise = y2 - y1;
  const run = x2 - x1;

  if (run === 0) {
    return {
      x1,
      y1,
      x2,
      y2,
      rise,
      run,
      slope: null,
      yIntercept: null,
    };
  }

  const slope = rise / run;

  return {
    x1,
    y1,
    x2,
    y2,
    rise,
    run,
    slope,
    yIntercept: y1 - slope * x1,
  };
}

export function calculateDistance2d(x1: number, y1: number, x2: number, y2: number): DistanceResult {
  assertFiniteNumber(x1, 'x1');
  assertFiniteNumber(y1, 'y1');
  assertFiniteNumber(x2, 'x2');
  assertFiniteNumber(y2, 'y2');

  const deltaX = x2 - x1;
  const deltaY = y2 - y1;

  return {
    x1,
    y1,
    x2,
    y2,
    deltaX,
    deltaY,
    distance: Math.sqrt(square(deltaX) + square(deltaY)),
    midpoint: {
      x: (x1 + x2) / 2,
      y: (y1 + y2) / 2,
    },
  };
}

export function calculatePythagorean(
  solveFor: PythagoreanSolveFor,
  measurements: Record<string, number>,
): PythagoreanResult {
  switch (solveFor) {
    case 'hypotenuse': {
      const legA = measurements.legA;
      const legB = measurements.legB;
      assertPositiveNumber(legA, 'Leg a');
      assertPositiveNumber(legB, 'Leg b');

      return {
        solveFor,
        legA,
        legB,
        hypotenuse: Math.sqrt(square(legA) + square(legB)),
      };
    }
    case 'leg-a': {
      const legB = measurements.legB;
      const hypotenuse = measurements.hypotenuse;
      assertPositiveNumber(legB, 'Leg b');
      assertPositiveNumber(hypotenuse, 'Hypotenuse');

      if (hypotenuse <= legB) {
        throw new Error('Hypotenuse must be longer than the known leg');
      }

      return {
        solveFor,
        legA: Math.sqrt(square(hypotenuse) - square(legB)),
        legB,
        hypotenuse,
      };
    }
    case 'leg-b': {
      const legA = measurements.legA;
      const hypotenuse = measurements.hypotenuse;
      assertPositiveNumber(legA, 'Leg a');
      assertPositiveNumber(hypotenuse, 'Hypotenuse');

      if (hypotenuse <= legA) {
        throw new Error('Hypotenuse must be longer than the known leg');
      }

      return {
        solveFor,
        legA,
        legB: Math.sqrt(square(hypotenuse) - square(legA)),
        hypotenuse,
      };
    }
    default: {
      const exhaustiveCheck: never = solveFor;
      return exhaustiveCheck;
    }
  }
}

export function calculateRightTriangle(
  mode: RightTriangleMode,
  measurements: Record<string, number>,
): RightTriangleResult {
  let legA: number;
  let legB: number;
  let hypotenuse: number;

  if (mode === 'legs') {
    legA = measurements.legA;
    legB = measurements.legB;
    assertPositiveNumber(legA, 'Leg a');
    assertPositiveNumber(legB, 'Leg b');
    hypotenuse = Math.sqrt(square(legA) + square(legB));
  } else {
    legA = measurements.leg;
    hypotenuse = measurements.hypotenuse;
    assertPositiveNumber(legA, 'Known leg');
    assertPositiveNumber(hypotenuse, 'Hypotenuse');

    if (hypotenuse <= legA) {
      throw new Error('Hypotenuse must be longer than the known leg');
    }

    legB = Math.sqrt(square(hypotenuse) - square(legA));
  }

  return {
    legA,
    legB,
    hypotenuse,
    area: (legA * legB) / 2,
    perimeter: legA + legB + hypotenuse,
    angleA: degreesFromRadians(Math.asin(legA / hypotenuse)),
    angleB: degreesFromRadians(Math.asin(legB / hypotenuse)),
  };
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

export function calculateLongDivision(dividend: number, divisor: number): LongDivisionResult {
  assertSafeInteger(dividend, 'Dividend');
  assertSafeInteger(divisor, 'Divisor');

  if (dividend < 0) {
    throw new Error('Dividend cannot be negative');
  }

  if (divisor <= 0) {
    throw new Error('Divisor must be greater than zero');
  }

  const quotient = Math.floor(dividend / divisor);
  const remainder = dividend % divisor;
  const decimal = dividend / divisor;

  return {
    dividend,
    divisor,
    quotient,
    remainder,
    decimal,
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

export function calculateNormalPValue(zScore: number, tail: PValueTail = 'two'): PValueResult {
  assertFiniteNumber(zScore, 'z-score');

  const leftTail = normalCdf(zScore);
  const rightTail = 1 - leftTail;
  const pValue =
    tail === 'left' ? leftTail : tail === 'right' ? rightTail : Math.min(1, 2 * Math.min(leftTail, rightTail));

  return {
    zScore,
    tail,
    leftTail,
    rightTail,
    pValue,
  };
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

export type HealthSex = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';

export interface BmiResult {
  bmi: number;
  category: string;
  healthyMinKg: number;
  healthyMaxKg: number;
}

export interface UnderweightBmiResult extends BmiResult {
  kgToHealthyMinimum: number;
  poundsToHealthyMinimum: number;
  percentBelowHealthyMinimum: number;
}

export interface OverweightBmiResult extends BmiResult {
  kgToHealthyMaximum: number;
  poundsToHealthyMaximum: number;
  kgToObesityThreshold: number;
  poundsToObesityThreshold: number;
}

export interface NutritionPointsInput {
  calories: number;
  saturatedFatG: number;
  addedSugarG: number;
  sodiumMg: number;
  fiberG: number;
  proteinG: number;
}

export interface NutritionPointsResult {
  points: number;
  moderationPoints: number;
  supportCredits: number;
  pointsPer100Calories: number;
  category: string;
}

export interface LoveCompatibilityResult {
  score: number;
  label: string;
  normalizedA: string;
  normalizedB: string;
}

export interface BodyFatInput {
  sex: HealthSex;
  heightCm: number;
  neckCm: number;
  waistCm: number;
  hipCm?: number;
  weightKg?: number;
}

export interface BodyFatResult {
  bodyFatPercent: number;
  fatMassKg?: number;
  leanMassKg?: number;
}

export interface ArmyBodyFatInput {
  sex: HealthSex;
  age: number;
  weightLb: number;
  abdomenIn: number;
}

export interface ArmyBodyFatResult {
  bodyFatPercent: number;
  roundedBodyFatPercent: number;
  maxAllowedPercent: number;
  ageGroup: string;
  referenceStatus: 'within-reference' | 'above-reference';
  fatMassLb: number;
  leanMassLb: number;
}

export interface BmrInput {
  sex: HealthSex;
  age: number;
  heightCm: number;
  weightKg: number;
}

export interface MacroSplit {
  calories: number;
  proteinPercent: number;
  fatPercent: number;
  carbPercent: number;
  proteinGrams: number;
  fatGrams: number;
  carbGrams: number;
}

export interface PregnancyWeightGainResult {
  bmi: number;
  category: string;
  gainedKg: number;
  minGainKg: number;
  maxGainKg: number;
  weeklyMinKg: number;
  weeklyMaxKg: number;
}

export interface OneRepMaxResult {
  epleyKg: number;
  brzyckiKg: number;
}

export interface TargetHeartRateResult {
  maxHeartRate: number;
  lowerBpm: number;
  upperBpm: number;
  karvonenLowerBpm?: number;
  karvonenUpperBpm?: number;
}

export interface GfrResult {
  egfr: number;
  note: string;
}

export interface BodySurfaceAreaResult {
  mosteller: number;
  dubois: number;
}

export interface BacResult {
  gramsAlcohol: number;
  bacPercent: number;
  hoursToZero: number;
}

export const activityLevelFactors: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extra: 1.9,
};

export function cmToInches(value: number) {
  return value / 2.54;
}

export function kgToPounds(value: number) {
  return value * 2.2046226218;
}

export function poundsToKg(value: number) {
  return value / 2.2046226218;
}

export function calculateBmi(weightKg: number, heightCm: number): BmiResult {
  assertPositiveNumber(weightKg, 'Weight');
  assertPositiveNumber(heightCm, 'Height');

  const heightMeters = heightCm / 100;
  const bmi = weightKg / square(heightMeters);
  const category =
    bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Healthy weight' : bmi < 30 ? 'Overweight' : 'Obesity range';
  const healthyMinKg = 18.5 * square(heightMeters);
  const healthyMaxKg = 24.9 * square(heightMeters);

  return { bmi, category, healthyMinKg, healthyMaxKg };
}

export function calculateUnderweightBmiCheck(weightKg: number, heightCm: number): UnderweightBmiResult {
  const result = calculateBmi(weightKg, heightCm);
  const kgToHealthyMinimum = Math.max(0, result.healthyMinKg - weightKg);
  const percentBelowHealthyMinimum =
    kgToHealthyMinimum === 0 ? 0 : (kgToHealthyMinimum / result.healthyMinKg) * 100;

  return {
    ...result,
    kgToHealthyMinimum,
    poundsToHealthyMinimum: kgToPounds(kgToHealthyMinimum),
    percentBelowHealthyMinimum,
  };
}

export function calculateOverweightBmiCheck(weightKg: number, heightCm: number): OverweightBmiResult {
  const result = calculateBmi(weightKg, heightCm);
  const obesityThresholdKg = 30 * square(heightCm / 100);

  return {
    ...result,
    kgToHealthyMaximum: Math.max(0, weightKg - result.healthyMaxKg),
    poundsToHealthyMaximum: kgToPounds(Math.max(0, weightKg - result.healthyMaxKg)),
    kgToObesityThreshold: obesityThresholdKg - weightKg,
    poundsToObesityThreshold: kgToPounds(obesityThresholdKg - weightKg),
  };
}

export function calculateNutritionPoints(input: NutritionPointsInput): NutritionPointsResult {
  assertNonNegativeNumber(input.calories, 'Calories');
  assertNonNegativeNumber(input.saturatedFatG, 'Saturated fat');
  assertNonNegativeNumber(input.addedSugarG, 'Added sugar');
  assertNonNegativeNumber(input.sodiumMg, 'Sodium');
  assertNonNegativeNumber(input.fiberG, 'Dietary fiber');
  assertNonNegativeNumber(input.proteinG, 'Protein');

  if (input.calories === 0) {
    throw new Error('Calories must be greater than zero');
  }

  const moderationPoints =
    input.calories / 50 + input.saturatedFatG * 1.5 + input.addedSugarG / 5 + input.sodiumMg / 600;
  const supportCredits = input.fiberG * 0.6 + input.proteinG * 0.25;
  const points = Math.max(0, moderationPoints - supportCredits);
  const pointsPer100Calories = (points / input.calories) * 100;
  const category = points < 3 ? 'Lower points' : points < 7 ? 'Moderate points' : 'Higher points';

  return { points, moderationPoints, supportCredits, pointsPer100Calories, category };
}

function normalizeCompatibilityName(value: string, label: string) {
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '');

  if (!normalized) {
    throw new Error(`${label} needs at least one letter or number`);
  }

  return normalized;
}

function hashCompatibilitySeed(seed: string) {
  let hash = 2166136261;

  for (const character of seed) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function calculateLoveCompatibility(nameA: string, nameB: string): LoveCompatibilityResult {
  const normalizedA = normalizeCompatibilityName(nameA, 'First name');
  const normalizedB = normalizeCompatibilityName(nameB, 'Second name');
  const [left, right] = [normalizedA, normalizedB].sort();
  const hash = hashCompatibilitySeed(`${left}|${right}|access-free-tools`);
  const score = normalizedA === normalizedB ? 96 : 40 + (hash % 61);
  const label = score >= 85 ? 'Sparkly match' : score >= 70 ? 'Sweet match' : score >= 55 ? 'Curious match' : 'Playful mystery';

  return { score, label, normalizedA, normalizedB };
}

export function calculateMifflinStJeor(input: BmrInput) {
  assertPositiveNumber(input.weightKg, 'Weight');
  assertPositiveNumber(input.heightCm, 'Height');
  assertPositiveNumber(input.age, 'Age');

  const sexAdjustment = input.sex === 'male' ? 5 : -161;
  return 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age + sexAdjustment;
}

export function calculateTdeeFromBmr(bmr: number, activityLevel: ActivityLevel) {
  assertPositiveNumber(bmr, 'BMR');
  return bmr * activityLevelFactors[activityLevel];
}

export function calculateNavyBodyFat(input: BodyFatInput): BodyFatResult {
  const heightIn = cmToInches(input.heightCm);
  const neckIn = cmToInches(input.neckCm);
  const waistIn = cmToInches(input.waistCm);
  const hipIn = input.hipCm === undefined ? undefined : cmToInches(input.hipCm);

  assertPositiveNumber(heightIn, 'Height');
  assertPositiveNumber(neckIn, 'Neck');
  assertPositiveNumber(waistIn, 'Waist');

  const circumferenceValue =
    input.sex === 'male' ? waistIn - neckIn : waistIn + (hipIn ?? 0) - neckIn;

  if (input.sex === 'female' && hipIn === undefined) {
    throw new Error('Hip measurement is required for the female circumference method');
  }

  if (circumferenceValue <= 0) {
    throw new Error('Circumference measurements must create a positive tape value');
  }

  const bodyFatPercent =
    input.sex === 'male'
      ? 86.01 * Math.log10(circumferenceValue) - 70.041 * Math.log10(heightIn) + 36.76
      : 163.205 * Math.log10(circumferenceValue) - 97.684 * Math.log10(heightIn) - 78.387;

  if (!Number.isFinite(bodyFatPercent) || bodyFatPercent <= 0) {
    throw new Error('Body fat estimate could not be calculated from those measurements');
  }

  const fatMassKg = input.weightKg ? input.weightKg * (bodyFatPercent / 100) : undefined;
  const leanMassKg = input.weightKg ? input.weightKg - (fatMassKg ?? 0) : undefined;

  return { bodyFatPercent, fatMassKg, leanMassKg };
}

function getArmyBodyFatReference(sex: HealthSex, age: number) {
  assertPositiveNumber(age, 'Age');

  if (age < 17) {
    throw new Error('Army body fat reference groups start at age 17');
  }

  if (age <= 20) {
    return { ageGroup: '17-20', maxAllowedPercent: sex === 'male' ? 20 : 30 };
  }

  if (age <= 27) {
    return { ageGroup: '21-27', maxAllowedPercent: sex === 'male' ? 22 : 32 };
  }

  if (age <= 39) {
    return { ageGroup: '28-39', maxAllowedPercent: sex === 'male' ? 24 : 34 };
  }

  return { ageGroup: '40+', maxAllowedPercent: sex === 'male' ? 26 : 36 };
}

export function calculateArmyBodyFat(input: ArmyBodyFatInput): ArmyBodyFatResult {
  assertPositiveNumber(input.weightLb, 'Weight');
  assertPositiveNumber(input.abdomenIn, 'Abdomen');

  const bodyFatPercent =
    input.sex === 'male'
      ? -26.97 - 0.12 * input.weightLb + 1.99 * input.abdomenIn
      : -9.15 - 0.015 * input.weightLb + 1.27 * input.abdomenIn;

  if (!Number.isFinite(bodyFatPercent) || bodyFatPercent <= 0) {
    throw new Error('Army body fat estimate could not be calculated from those measurements');
  }

  const roundedBodyFatPercent = Math.round(bodyFatPercent);
  const reference = getArmyBodyFatReference(input.sex, input.age);
  const fatMassLb = input.weightLb * (bodyFatPercent / 100);

  return {
    bodyFatPercent,
    roundedBodyFatPercent,
    maxAllowedPercent: reference.maxAllowedPercent,
    ageGroup: reference.ageGroup,
    referenceStatus:
      roundedBodyFatPercent <= reference.maxAllowedPercent ? 'within-reference' : 'above-reference',
    fatMassLb,
    leanMassLb: input.weightLb - fatMassLb,
  };
}

export function calculateBoerLeanBodyMass(input: BmrInput) {
  assertPositiveNumber(input.weightKg, 'Weight');
  assertPositiveNumber(input.heightCm, 'Height');

  return input.sex === 'male'
    ? 0.407 * input.weightKg + 0.267 * input.heightCm - 19.2
    : 0.252 * input.weightKg + 0.473 * input.heightCm - 48.3;
}

export function calculateDevineIdealWeight(sex: HealthSex, heightCm: number) {
  assertPositiveNumber(heightCm, 'Height');

  const inchesOverFiveFeet = Math.max(0, cmToInches(heightCm) - 60);
  return (sex === 'male' ? 50 : 45.5) + 2.3 * inchesOverFiveFeet;
}

export function calculateCaloriesBurned(met: number, weightKg: number, minutes: number) {
  assertPositiveNumber(met, 'MET');
  assertPositiveNumber(weightKg, 'Weight');
  assertPositiveNumber(minutes, 'Minutes');
  return ((met * 3.5 * weightKg) / 200) * minutes;
}

export function calculateOneRepMax(weightKg: number, reps: number): OneRepMaxResult {
  assertPositiveNumber(weightKg, 'Weight');
  assertPositiveNumber(reps, 'Reps');

  if (reps > 30) {
    throw new Error('Use 30 reps or fewer for a practical one-rep max estimate');
  }

  const epleyKg = weightKg * (1 + reps / 30);
  const brzyckiKg = reps === 1 ? weightKg : weightKg * (36 / (37 - reps));

  return { epleyKg, brzyckiKg };
}

export function calculateTargetHeartRate(
  age: number,
  lowerPercent: number,
  upperPercent: number,
  restingHeartRate?: number,
): TargetHeartRateResult {
  assertPositiveNumber(age, 'Age');
  assertPositiveNumber(lowerPercent, 'Lower intensity');
  assertPositiveNumber(upperPercent, 'Upper intensity');

  const maxHeartRate = 220 - age;
  const lowerBpm = maxHeartRate * (lowerPercent / 100);
  const upperBpm = maxHeartRate * (upperPercent / 100);
  const result: TargetHeartRateResult = { maxHeartRate, lowerBpm, upperBpm };

  if (restingHeartRate !== undefined && Number.isFinite(restingHeartRate) && restingHeartRate > 0) {
    const reserve = maxHeartRate - restingHeartRate;
    result.karvonenLowerBpm = reserve * (lowerPercent / 100) + restingHeartRate;
    result.karvonenUpperBpm = reserve * (upperPercent / 100) + restingHeartRate;
  }

  return result;
}

export function calculatePace(distance: number, seconds: number) {
  assertPositiveNumber(distance, 'Distance');
  assertPositiveNumber(seconds, 'Time');

  return {
    secondsPerUnit: seconds / distance,
    speedPerHour: distance / (seconds / 3600),
  };
}

export function calculatePregnancyWeightGain(
  heightCm: number,
  prePregnancyWeightKg: number,
  currentWeightKg: number,
) {
  const bmiResult = calculateBmi(prePregnancyWeightKg, heightCm);
  const bmi = bmiResult.bmi;
  const poundsRange =
    bmi < 18.5
      ? [28, 40, 1, 1.3]
      : bmi < 25
        ? [25, 35, 0.8, 1]
        : bmi < 30
          ? [15, 25, 0.5, 0.7]
          : [11, 20, 0.4, 0.6];

  return {
    bmi,
    category: bmiResult.category,
    gainedKg: currentWeightKg - prePregnancyWeightKg,
    minGainKg: poundsToKg(poundsRange[0]),
    maxGainKg: poundsToKg(poundsRange[1]),
    weeklyMinKg: poundsToKg(poundsRange[2]),
    weeklyMaxKg: poundsToKg(poundsRange[3]),
  } satisfies PregnancyWeightGainResult;
}

export function calculateMacroSplit(
  calories: number,
  proteinPercent: number,
  fatPercent: number,
  carbPercent: number,
): MacroSplit {
  assertPositiveNumber(calories, 'Calories');

  const totalPercent = proteinPercent + fatPercent + carbPercent;
  if (Math.abs(totalPercent - 100) > 0.001) {
    throw new Error('Macro percentages must add up to 100');
  }

  return {
    calories,
    proteinPercent,
    fatPercent,
    carbPercent,
    proteinGrams: (calories * (proteinPercent / 100)) / 4,
    fatGrams: (calories * (fatPercent / 100)) / 9,
    carbGrams: (calories * (carbPercent / 100)) / 4,
  };
}

export function calculateProteinGrams(weightKg: number, gramsPerKg: number) {
  assertPositiveNumber(weightKg, 'Weight');
  assertPositiveNumber(gramsPerKg, 'Protein factor');
  return weightKg * gramsPerKg;
}

export function calculateGfr2021CkdEpi(age: number, sex: HealthSex, serumCreatinineMgDl: number): GfrResult {
  assertPositiveNumber(age, 'Age');
  assertPositiveNumber(serumCreatinineMgDl, 'Serum creatinine');

  const k = sex === 'female' ? 0.7 : 0.9;
  const alpha = sex === 'female' ? -0.241 : -0.302;
  const ratio = serumCreatinineMgDl / k;
  const egfr =
    142 *
    Math.min(ratio, 1) ** alpha *
    Math.max(ratio, 1) ** -1.2 *
    0.9938 ** age *
    (sex === 'female' ? 1.012 : 1);
  const note =
    egfr >= 90
      ? 'Usually reported as normal or high when other kidney markers are normal'
      : egfr >= 60
        ? 'Mildly decreased range'
        : egfr >= 45
          ? 'Mild to moderately decreased range'
          : egfr >= 30
            ? 'Moderately to severely decreased range'
            : egfr >= 15
              ? 'Severely decreased range'
              : 'Kidney failure range';

  return { egfr, note };
}

export function calculateBodySurfaceArea(heightCm: number, weightKg: number): BodySurfaceAreaResult {
  assertPositiveNumber(heightCm, 'Height');
  assertPositiveNumber(weightKg, 'Weight');

  return {
    mosteller: Math.sqrt((heightCm * weightKg) / 3600),
    dubois: 0.007184 * heightCm ** 0.725 * weightKg ** 0.425,
  };
}

export function estimateBac(
  sex: HealthSex,
  weightKg: number,
  drinkCount: number,
  volumeMl: number,
  alcoholPercent: number,
  hours: number,
): BacResult {
  assertPositiveNumber(weightKg, 'Weight');
  assertNonNegativeNumber(drinkCount, 'Drink count');
  assertPositiveNumber(volumeMl, 'Drink volume');
  assertPositiveNumber(alcoholPercent, 'Alcohol percentage');
  assertNonNegativeNumber(hours, 'Hours');

  const gramsAlcohol = drinkCount * volumeMl * (alcoholPercent / 100) * 0.789;
  const widmarkR = sex === 'male' ? 0.68 : 0.55;
  const rawBac = (gramsAlcohol / (weightKg * 1000 * widmarkR)) * 100;
  const bacPercent = Math.max(0, rawBac - 0.015 * hours);

  return {
    gramsAlcohol,
    bacPercent,
    hoursToZero: bacPercent / 0.015,
  };
}

export function addDaysToIsoDate(isoDate: string, days: number) {
  const parsed = Date.parse(`${isoDate}T00:00:00Z`);
  if (!Number.isFinite(parsed)) {
    throw new Error('Date must be a valid date');
  }

  const result = new Date(parsed + days * 86_400_000);
  return result.toISOString().slice(0, 10);
}

export function daysBetweenIsoDates(startIsoDate: string, endIsoDate: string) {
  const start = Date.parse(`${startIsoDate}T00:00:00Z`);
  const end = Date.parse(`${endIsoDate}T00:00:00Z`);

  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    throw new Error('Dates must be valid dates');
  }

  return Math.round((end - start) / 86_400_000);
}

export function calculateDueDateFromLmp(lastPeriodIsoDate: string, cycleLengthDays = 28) {
  assertPositiveNumber(cycleLengthDays, 'Cycle length');
  return addDaysToIsoDate(lastPeriodIsoDate, 280 + (cycleLengthDays - 28));
}

export function classifyBodyType(bustCm: number, waistCm: number, hipsCm: number, shouldersCm: number) {
  assertPositiveNumber(bustCm, 'Bust');
  assertPositiveNumber(waistCm, 'Waist');
  assertPositiveNumber(hipsCm, 'Hips');
  assertPositiveNumber(shouldersCm, 'Shoulders');

  const top = Math.max(bustCm, shouldersCm);
  const waistDefinition = Math.min(top, hipsCm) - waistCm;

  if (Math.abs(top - hipsCm) <= 5 && waistDefinition >= 20) return 'Hourglass';
  if (hipsCm - top >= 7) return 'Triangle or pear';
  if (top - hipsCm >= 7) return 'Inverted triangle';
  if (waistDefinition < 20) return 'Rectangle';
  return 'Balanced';
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

export type FederalFilingStatus = 'single' | 'married-joint' | 'married-separate' | 'head-household';

export interface LoanPaymentSummary {
  principal: number;
  annualRatePercent: number;
  years: number;
  paymentCount: number;
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
}

export interface MortgagePaymentResult extends LoanPaymentSummary {
  homePrice: number;
  downPayment: number;
  loanAmount: number;
  principalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyPmi: number;
  monthlyHoa: number;
  totalMonthlyPayment: number;
  loanToValuePercent: number;
}

export interface AutoLoanSummary extends LoanPaymentSummary {
  purchasePrice: number;
  downPayment: number;
  tradeIn: number;
  fees: number;
  salesTaxPercent: number;
  salesTax: number;
  amountFinanced: number;
}

export interface SimpleInterestResult {
  principal: number;
  annualRatePercent: number;
  years: number;
  interest: number;
  endingBalance: number;
}

export interface CompoundInterestResult {
  principal: number;
  monthlyContribution: number;
  annualRatePercent: number;
  years: number;
  compoundFrequency: number;
  effectiveAnnualRatePercent: number;
  endingBalance: number;
  totalContributions: number;
  totalInterest: number;
}

export interface ApyEstimateResult {
  principal: number;
  annualRatePercent: number;
  compoundFrequency: number;
  termDays: number;
  annualPercentageYield: number;
  termInterest: number;
  endingBalance: number;
}

export interface InflationAdjustmentResult {
  amount: number;
  annualInflationPercent: number;
  years: number;
  futureCost: number;
  presentBuyingPower: number;
}

export interface RetirementSavingsResult extends CompoundInterestResult {
  targetAmount: number;
  goalGap: number;
  goalMet: boolean;
}

export interface AmortizationSummary extends LoanPaymentSummary {
  scheduledMonthlyPayment: number;
  extraMonthlyPayment: number;
  monthsToPayoff: number;
  yearsToPayoff: number;
  interestSaved: number;
  monthsSaved: number;
}

export interface FederalIncomeTaxResult {
  filingStatus: FederalFilingStatus;
  grossIncome: number;
  deduction: number;
  taxableIncome: number;
  federalTax: number;
  effectiveRatePercent: number;
  marginalRatePercent: number;
  taxYear: 2026;
}

export interface SalaryBreakdownResult {
  annualSalary: number;
  hoursPerWeek: number;
  weeksPerYear: number;
  grossMonthly: number;
  grossBiweekly: number;
  grossWeekly: number;
  grossDaily: number;
  grossHourly: number;
  estimatedTax: number;
  estimatedTakeHomeAnnual: number;
  estimatedTakeHomeMonthly: number;
}

export interface InterestRateResult extends LoanPaymentSummary {
  monthlyRatePercent: number;
}

export interface CurrencyConversionResult {
  amount: number;
  exchangeRate: number;
  feePercent: number;
  grossConverted: number;
  feeAmount: number;
  convertedAmount: number;
}

export interface MortgagePayoffResult extends AmortizationSummary {
  oneTimePayment: number;
  remainingPrincipal: number;
}

export interface FourOhOneKProjectionResult extends CompoundInterestResult {
  annualSalary: number;
  employeeContributionPercent: number;
  employerMatchPercent: number;
  employerMatchLimitPercent: number;
  monthlyEmployeeContribution: number;
  monthlyEmployerContribution: number;
  totalEmployeeContributions: number;
  totalEmployerContributions: number;
}

export interface HouseAffordabilityResult {
  annualIncome: number;
  monthlyDebts: number;
  debtToIncomePercent: number;
  maxMonthlyDebtPayment: number;
  maxMonthlyHousingPayment: number;
  homePrice: number;
  downPayment: number;
  loanAmount: number;
  principalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  totalMonthlyHousingPayment: number;
}

export interface SavingsProjectionResult extends CompoundInterestResult {
  targetAmount: number;
  targetGap: number;
  targetMet: boolean;
}

export interface RentAffordabilityResult {
  monthlyIncome: number;
  targetRentPercent: number;
  monthlyDebts: number;
  monthlyUtilities: number;
  maxRent: number;
  annualRent: number;
  incomeAfterRentAndBills: number;
}

export type AnnuityTiming = 'ordinary' | 'due';

export interface AnnuityResult {
  payment: number;
  annualRatePercent: number;
  years: number;
  paymentsPerYear: number;
  paymentCount: number;
  timing: AnnuityTiming;
  totalPayments: number;
  futureValue: number;
  presentValue: number;
}

export interface CreditCardPayoffResult {
  startingBalance: number;
  annualRatePercent: number;
  monthlyPayment: number;
  monthlyNewCharges: number;
  monthsToPayoff: number;
  totalInterest: number;
  totalPaid: number;
  finalPayment: number;
}

export interface PensionEstimateResult {
  finalAverageSalary: number;
  yearsOfService: number;
  multiplierPercent: number;
  annualPension: number;
  monthlyPension: number;
  replacementRatePercent: number;
}

export interface AnnuityPayoutResult {
  principal: number;
  annualRatePercent: number;
  years: number;
  paymentsPerYear: number;
  paymentCount: number;
  payment: number;
  totalPaid: number;
  estimatedInterest: number;
}

export interface DebtPayoffResult {
  startingBalance: number;
  annualRatePercent: number;
  monthlyPayment: number;
  extraMonthlyPayment: number;
  monthsToPayoff: number;
  totalInterest: number;
  totalPaid: number;
  finalPayment: number;
}

export interface DebtConsolidationResult {
  currentDebt: DebtPayoffResult;
  consolidationLoan: LoanPaymentSummary;
  newPrincipal: number;
  fees: number;
  monthlyPaymentChange: number;
  totalCostChange: number;
}

export interface CollegeCostResult {
  currentAnnualCost: number;
  yearsUntilStart: number;
  yearsInSchool: number;
  annualCostIncreasePercent: number;
  firstYearCost: number;
  totalEstimatedCost: number;
  projectedSavings: number;
  savingsGap: number;
}

export interface CdEstimateResult {
  principal: number;
  annualPercentageYield: number;
  termMonths: number;
  maturityValue: number;
  interestEarned: number;
  earlyWithdrawalPenalty: number;
  valueAfterPenalty: number;
}

export interface BondEstimateResult {
  faceValue: number;
  marketPrice: number;
  couponRatePercent: number;
  yearsToMaturity: number;
  paymentsPerYear: number;
  annualCoupon: number;
  totalCouponPayments: number;
  currentYieldPercent: number;
  approximateYieldToMaturityPercent: number;
}

export interface MutualFundEstimateResult extends CompoundInterestResult {
  grossEndingBalance: number;
  estimatedExpenseDrag: number;
  expenseRatioPercent: number;
}

export type VatMode = 'add' | 'remove';

export interface VatResult {
  mode: VatMode;
  amount: number;
  vatPercent: number;
  netAmount: number;
  vatAmount: number;
  grossAmount: number;
}

export interface CashBackLowInterestResult {
  purchaseAmount: number;
  payoffMonths: number;
  cashBackPercent: number;
  cashBackAprPercent: number;
  lowInterestAprPercent: number;
  cashBackValue: number;
  cashBackLoan: LoanPaymentSummary;
  lowInterestLoan: LoanPaymentSummary;
  cashBackTotalCost: number;
  lowInterestTotalCost: number;
  betterOption: 'cash-back' | 'low-interest';
  savings: number;
}

export interface AutoLeaseResult {
  vehiclePrice: number;
  downPayment: number;
  tradeIn: number;
  residualValue: number;
  moneyFactor: number;
  termMonths: number;
  taxPercent: number;
  fees: number;
  adjustedCapitalizedCost: number;
  depreciationFee: number;
  financeFee: number;
  pretaxMonthlyPayment: number;
  monthlyTax: number;
  monthlyPayment: number;
  totalLeaseCost: number;
}

export type DepreciationMethod = 'straight-line' | 'declining-balance';

export interface DepreciationEstimateResult {
  cost: number;
  salvageValue: number;
  lifeYears: number;
  ageYears: number;
  method: DepreciationMethod;
  decliningRatePercent: number;
  annualDepreciation: number;
  accumulatedDepreciation: number;
  bookValue: number;
}

export interface AverageReturnResult {
  beginningValue: number;
  endingValue: number;
  years: number;
  contributions: number;
  withdrawals: number;
  netGain: number;
  cumulativeReturnPercent: number;
  averageAnnualReturnPercent: number;
  cagrPercent: number;
}

export interface MarginEstimateResult {
  revenue: number;
  cost: number;
  profit: number;
  marginPercent: number;
  markupPercent: number;
}

export interface AdRevenueEstimateResult {
  dailyPageViews: number;
  pageCtrPercent: number;
  averageCpc: number;
  estimatedClicks: number;
  dailyRevenue: number;
  monthlyRevenue: number;
  annualRevenue: number;
  pageRpm: number;
}

export interface BreakEvenResult {
  fixedCosts: number;
  pricePerUnit: number;
  variableCostPerUnit: number;
  contributionMarginPerUnit: number;
  contributionMarginRatioPercent: number;
  breakEvenUnits: number;
  breakEvenSales: number;
}

export interface MarkupPriceResult {
  unitCost: number;
  markupPercent: number;
  units: number;
  sellingPricePerUnit: number;
  profitPerUnit: number;
  marginPercent: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
}

export interface ProfitGoalResult {
  fixedCosts: number;
  targetProfit: number;
  pricePerUnit: number;
  variableCostPerUnit: number;
  contributionMarginPerUnit: number;
  requiredUnits: number;
  requiredSales: number;
}

export interface LiquidityRatiosResult {
  currentAssets: number;
  currentLiabilities: number;
  inventory: number;
  prepaidExpenses: number;
  cashAndEquivalents: number;
  marketableSecurities: number;
  accountsReceivable: number;
  workingCapital: number;
  currentRatio: number;
  quickRatio: number;
  cashRatio: number;
}

export interface DebtRatiosResult {
  totalDebt: number;
  totalAssets: number;
  totalEquity: number;
  ebit: number;
  interestExpense: number;
  debtRatioPercent: number;
  debtToEquityRatio: number;
  timesInterestEarned: number;
}

export interface OperationsRatiosResult {
  costOfGoodsSold: number;
  averageInventory: number;
  netSales: number;
  averageTotalAssets: number;
  netCreditSales: number;
  averageAccountsReceivable: number;
  totalAssets: number;
  totalEquity: number;
  inventoryTurnover: number;
  assetTurnover: number;
  receivablesTurnover: number;
  averageCollectionPeriodDays: number;
  equityMultiplier: number;
}

export interface ProfitabilityRatiosResult {
  netSales: number;
  costOfGoodsSold: number;
  operatingIncome: number;
  netIncome: number;
  averageAssets: number;
  averageEquity: number;
  sharesOutstanding: number;
  pricePerShare: number;
  grossProfit: number;
  grossMarginPercent: number;
  operatingMarginPercent: number;
  netProfitMarginPercent: number;
  returnOnAssetsPercent: number;
  returnOnEquityPercent: number;
  earningsPerShare: number;
  priceEarningsRatio: number;
}

export interface StockRatiosResult {
  stockPrice: number;
  earningsPerShare: number;
  salesPerShare: number;
  bookValuePerShare: number;
  dividendPerShare: number;
  priceEarningsRatio: number;
  priceSalesRatio: number;
  priceBookRatio: number;
  dividendYieldPercent: number;
  payoutRatioPercent: number;
}

export interface DiscountEstimateResult {
  originalPrice: number;
  discountPercent: number;
  extraDiscountPercent: number;
  taxPercent: number;
  firstDiscountAmount: number;
  extraDiscountAmount: number;
  subtotalAfterDiscounts: number;
  taxAmount: number;
  finalPrice: number;
  totalSavings: number;
  effectiveDiscountPercent: number;
}

export interface BusinessLoanResult extends LoanPaymentSummary {
  originationFeePercent: number;
  originationFee: number;
  cashReceived: number;
  totalCostWithFee: number;
}

export interface DebtToIncomeResult {
  monthlyIncome: number;
  monthlyDebtPayments: number;
  proposedHousingPayment: number;
  totalMonthlyDebt: number;
  debtToIncomePercent: number;
  remainingIncome: number;
}

export interface AssetLeaseResult {
  assetValue: number;
  residualValue: number;
  annualRatePercent: number;
  termMonths: number;
  upfrontPayment: number;
  fees: number;
  adjustedCost: number;
  depreciationFee: number;
  financeFee: number;
  monthlyPayment: number;
  totalLeaseCost: number;
}

export interface RefinanceResult {
  currentLoan: LoanPaymentSummary;
  newLoan: LoanPaymentSummary;
  closingCosts: number;
  newPrincipal: number;
  monthlySavings: number;
  totalInterestChange: number;
  totalCostChange: number;
  breakEvenMonths: number | null;
}

export interface BudgetResult {
  monthlyIncome: number;
  totalExpenses: number;
  leftover: number;
  expenseRatioPercent: number;
  savingsRatePercent: number;
  categories: Array<{ label: string; amount: number; percentOfIncome: number }>;
}

export interface MarriageTaxComparisonResult {
  spouseOneTax: FederalIncomeTaxResult;
  spouseTwoTax: FederalIncomeTaxResult;
  jointTax: FederalIncomeTaxResult;
  combinedSingleTax: number;
  marriageDifference: number;
}

export interface EstateTaxEstimateResult {
  grossEstate: number;
  deductions: number;
  taxableEstateBeforeExclusion: number;
  remainingBasicExclusion: number;
  taxableAboveExclusion: number;
  estimatedFederalEstateTax: number;
}

export interface SocialSecurityClaimingResult {
  birthYear: number;
  fullRetirementAgeYears: number;
  claimingAgeYears: number;
  fullRetirementAgeBenefit: number;
  monthlyBenefit: number;
  adjustmentPercent: number;
  annualBenefit: number;
}

export interface RmdEstimateResult {
  accountBalance: number;
  age: number;
  lifeExpectancyFactor: number;
  requiredDistribution: number;
  remainingBalanceAfterRmd: number;
}

export interface RealEstateReturnResult {
  purchasePrice: number;
  sellingPrice: number;
  cashInvested: number;
  netSaleProceeds: number;
  profit: number;
  roiPercent: number;
  equityMultiple: number;
}

export interface TakeHomePaycheckResult {
  annualGrossPay: number;
  grossPerPaycheck: number;
  pretaxDeductionsAnnual: number;
  federalTax: number;
  stateTax: number;
  localTax: number;
  socialSecurityTax: number;
  medicareTax: number;
  annualTakeHomePay: number;
  takeHomePerPaycheck: number;
}

export interface RentalPropertyResult {
  loanAmount: number;
  monthlyMortgagePayment: number;
  monthlyVacancyReserve: number;
  monthlyOperatingExpenses: number;
  monthlyNoi: number;
  monthlyCashFlow: number;
  capRatePercent: number;
  cashOnCashReturnPercent: number;
}

export interface IrrResult {
  periodicIrrPercent: number;
  annualizedIrrPercent: number;
  netCashFlow: number;
}

export interface RoiResult {
  gain: number;
  roiPercent: number;
  endingValue: number;
}

export interface AprEstimateResult {
  loan: LoanPaymentSummary;
  fees: number;
  amountReceived: number;
  aprPercent: number;
}

export interface FhaLoanResult extends MortgagePaymentResult {
  baseLoanAmount: number;
  upfrontMip: number;
  annualMipPercent: number;
  monthlyMip: number;
}

export interface VaMortgageResult extends MortgagePaymentResult {
  baseLoanAmount: number;
  fundingFeePercent: number;
  fundingFee: number;
  fundingFeeFinanced: boolean;
}

export interface HomeEquityLoanResult extends LoanPaymentSummary {
  homeValue: number;
  currentMortgageBalance: number;
  maxCombinedLoanToValuePercent: number;
  availableEquity: number;
  combinedLoanToValuePercent: number;
}

export interface HelocResult {
  homeValue: number;
  currentMortgageBalance: number;
  maxCombinedLoanToValuePercent: number;
  creditLine: number;
  currentDraw: number;
  availableEquity: number;
  interestOnlyPayment: number;
  repaymentPayment: number;
  combinedLoanToValuePercent: number;
}

export interface DownPaymentResult {
  homePrice: number;
  downPayment: number;
  downPaymentPercent: number;
  loanAmount: number;
  loanToValuePercent: number;
  estimatedClosingCosts: number;
  cashNeeded: number;
}

export interface RentVsBuyResult {
  totalRentCost: number;
  totalBuyingCashOutflow: number;
  estimatedHomeValue: number;
  remainingLoanBalance: number;
  estimatedSaleProceeds: number;
  netBuyingCost: number;
  buyMinusRent: number;
}

export interface PaybackPeriodResult {
  initialCost: number;
  annualCashFlow: number;
  paybackYears: number;
  netProfitAfterHorizon: number;
}

export interface PresentValueResult {
  presentValue: number;
  lumpSumPresentValue: number;
  annuityPresentValue: number;
}

export interface FutureValueResult {
  futureValue: number;
  principalFutureValue: number;
  contributionFutureValue: number;
  totalContributions: number;
}

export interface CommissionResult {
  salesAmount: number;
  commission: number;
  splitAmount: number;
  totalPay: number;
}

export interface LocalMortgageResult extends LoanPaymentSummary {
  propertyPrice: number;
  deposit: number;
  loanAmount: number;
  loanToValuePercent: number;
  monthlyFees: number;
  totalMonthlyPayment: number;
}

interface TaxBracket {
  over: number;
  rate: number;
}

const federalTax2026: Record<FederalFilingStatus, { standardDeduction: number; brackets: TaxBracket[] }> = {
  single: {
    standardDeduction: 16100,
    brackets: [
      { over: 0, rate: 0.1 },
      { over: 12400, rate: 0.12 },
      { over: 50400, rate: 0.22 },
      { over: 105700, rate: 0.24 },
      { over: 201775, rate: 0.32 },
      { over: 256225, rate: 0.35 },
      { over: 640600, rate: 0.37 },
    ],
  },
  'married-joint': {
    standardDeduction: 32200,
    brackets: [
      { over: 0, rate: 0.1 },
      { over: 24800, rate: 0.12 },
      { over: 100800, rate: 0.22 },
      { over: 211400, rate: 0.24 },
      { over: 403550, rate: 0.32 },
      { over: 512450, rate: 0.35 },
      { over: 768700, rate: 0.37 },
    ],
  },
  'married-separate': {
    standardDeduction: 16100,
    brackets: [
      { over: 0, rate: 0.1 },
      { over: 12400, rate: 0.12 },
      { over: 50400, rate: 0.22 },
      { over: 105700, rate: 0.24 },
      { over: 201775, rate: 0.32 },
      { over: 256225, rate: 0.35 },
      { over: 384350, rate: 0.37 },
    ],
  },
  'head-household': {
    standardDeduction: 24150,
    brackets: [
      { over: 0, rate: 0.1 },
      { over: 17700, rate: 0.12 },
      { over: 67450, rate: 0.22 },
      { over: 105700, rate: 0.24 },
      { over: 201750, rate: 0.32 },
      { over: 256200, rate: 0.35 },
      { over: 640600, rate: 0.37 },
    ],
  },
};

function assertPercentGreaterThanNegativeHundred(value: number, label: string) {
  assertFiniteNumber(value, label);

  if (value <= -100) {
    throw new Error(`${label} must be greater than -100%`);
  }
}

function assertPercentRange(value: number, label: string, max = 100) {
  assertNonNegativeNumber(value, label);

  if (value > max) {
    throw new Error(`${label} cannot be greater than ${max}%`);
  }
}

function calculatePaymentForMonthlyRate(principal: number, monthlyRate: number, paymentCount: number) {
  if (monthlyRate === 0) {
    return principal / paymentCount;
  }

  const growth = (1 + monthlyRate) ** paymentCount;
  return (principal * monthlyRate * growth) / (growth - 1);
}

export function calculateLoanPayment(principal: number, annualRatePercent: number, years: number) {
  assertPositiveNumber(principal, 'Principal');
  assertNonNegativeNumber(annualRatePercent, 'Annual interest rate');
  assertPositiveNumber(years, 'Loan term');

  const paymentCount = Math.round(years * 12);

  if (paymentCount <= 0) {
    throw new Error('Loan term must include at least one monthly payment');
  }

  return calculatePaymentForMonthlyRate(principal, annualRatePercent / 100 / 12, paymentCount);
}

export function calculateLoanSummary(
  principal: number,
  annualRatePercent: number,
  years: number,
): LoanPaymentSummary {
  const paymentCount = Math.round(years * 12);
  const monthlyPayment = calculateLoanPayment(principal, annualRatePercent, years);
  const totalPaid = monthlyPayment * paymentCount;

  return {
    principal,
    annualRatePercent,
    years,
    paymentCount,
    monthlyPayment,
    totalPaid,
    totalInterest: totalPaid - principal,
  };
}

export function calculateMortgagePayment(input: {
  homePrice: number;
  downPayment: number;
  annualRatePercent: number;
  years: number;
  annualPropertyTax?: number;
  monthlyInsurance?: number;
  monthlyPmi?: number;
  monthlyHoa?: number;
}): MortgagePaymentResult {
  assertPositiveNumber(input.homePrice, 'Home price');
  assertNonNegativeNumber(input.downPayment, 'Down payment');
  assertNonNegativeNumber(input.annualPropertyTax ?? 0, 'Annual property tax');
  assertNonNegativeNumber(input.monthlyInsurance ?? 0, 'Monthly insurance');
  assertNonNegativeNumber(input.monthlyPmi ?? 0, 'Monthly PMI');
  assertNonNegativeNumber(input.monthlyHoa ?? 0, 'Monthly HOA');

  if (input.downPayment >= input.homePrice) {
    throw new Error('Down payment must be less than the home price');
  }

  const loanAmount = input.homePrice - input.downPayment;
  const loan = calculateLoanSummary(loanAmount, input.annualRatePercent, input.years);
  const monthlyPropertyTax = (input.annualPropertyTax ?? 0) / 12;
  const monthlyInsurance = input.monthlyInsurance ?? 0;
  const monthlyPmi = input.monthlyPmi ?? 0;
  const monthlyHoa = input.monthlyHoa ?? 0;

  return {
    ...loan,
    homePrice: input.homePrice,
    downPayment: input.downPayment,
    loanAmount,
    principalAndInterest: loan.monthlyPayment,
    monthlyPropertyTax,
    monthlyInsurance,
    monthlyPmi,
    monthlyHoa,
    totalMonthlyPayment: loan.monthlyPayment + monthlyPropertyTax + monthlyInsurance + monthlyPmi + monthlyHoa,
    loanToValuePercent: (loanAmount / input.homePrice) * 100,
  };
}

export function calculateAutoLoanSummary(input: {
  purchasePrice: number;
  downPayment: number;
  tradeIn: number;
  fees: number;
  salesTaxPercent: number;
  annualRatePercent: number;
  years: number;
}): AutoLoanSummary {
  assertPositiveNumber(input.purchasePrice, 'Vehicle price');
  assertNonNegativeNumber(input.downPayment, 'Down payment');
  assertNonNegativeNumber(input.tradeIn, 'Trade-in value');
  assertNonNegativeNumber(input.fees, 'Fees');
  assertPercentRange(input.salesTaxPercent, 'Sales tax rate', 30);

  const taxableAmount = Math.max(0, input.purchasePrice - input.tradeIn);
  const salesTax = taxableAmount * (input.salesTaxPercent / 100);
  const amountFinanced = input.purchasePrice + salesTax + input.fees - input.downPayment - input.tradeIn;

  if (amountFinanced <= 0) {
    throw new Error('Amount financed must be greater than zero after down payment and trade-in');
  }

  const loan = calculateLoanSummary(amountFinanced, input.annualRatePercent, input.years);

  return {
    ...loan,
    purchasePrice: input.purchasePrice,
    downPayment: input.downPayment,
    tradeIn: input.tradeIn,
    fees: input.fees,
    salesTaxPercent: input.salesTaxPercent,
    salesTax,
    amountFinanced,
  };
}

export function calculateSimpleInterest(
  principal: number,
  annualRatePercent: number,
  years: number,
): SimpleInterestResult {
  assertPositiveNumber(principal, 'Principal');
  assertPercentGreaterThanNegativeHundred(annualRatePercent, 'Annual interest rate');
  assertNonNegativeNumber(years, 'Time');

  const interest = principal * (annualRatePercent / 100) * years;

  return {
    principal,
    annualRatePercent,
    years,
    interest,
    endingBalance: principal + interest,
  };
}

export function calculateCompoundInterest(
  principal: number,
  annualRatePercent: number,
  years: number,
  compoundFrequency = 12,
  monthlyContribution = 0,
): CompoundInterestResult {
  assertNonNegativeNumber(principal, 'Initial amount');
  assertPercentGreaterThanNegativeHundred(annualRatePercent, 'Annual interest rate');
  assertNonNegativeNumber(years, 'Time');
  assertPositiveNumber(compoundFrequency, 'Compound frequency');
  assertNonNegativeNumber(monthlyContribution, 'Monthly contribution');

  const months = Math.round(years * 12);
  const annualRate = annualRatePercent / 100;
  const effectiveAnnualRate = annualRate === 0 ? 0 : (1 + annualRate / compoundFrequency) ** compoundFrequency - 1;
  const monthlyRate = effectiveAnnualRate === 0 ? 0 : (1 + effectiveAnnualRate) ** (1 / 12) - 1;
  const growth = (1 + monthlyRate) ** months;
  const contributionGrowth =
    monthlyRate === 0 ? monthlyContribution * months : monthlyContribution * ((growth - 1) / monthlyRate);
  const endingBalance = principal * growth + contributionGrowth;
  const totalContributions = principal + monthlyContribution * months;

  return {
    principal,
    monthlyContribution,
    annualRatePercent,
    years,
    compoundFrequency,
    effectiveAnnualRatePercent: effectiveAnnualRate * 100,
    endingBalance,
    totalContributions,
    totalInterest: endingBalance - totalContributions,
  };
}

export function calculateApyEstimate(input: {
  principal: number;
  annualRatePercent: number;
  compoundFrequency: number;
  termDays?: number;
}): ApyEstimateResult {
  assertPositiveNumber(input.principal, 'Principal');
  assertNonNegativeNumber(input.annualRatePercent, 'Annual interest rate');
  assertPositiveNumber(input.compoundFrequency, 'Compound frequency');

  if (!Number.isInteger(input.compoundFrequency)) {
    throw new Error('Compound frequency must be a whole number');
  }

  const termDays = input.termDays ?? 365;
  assertPositiveNumber(termDays, 'Term days');

  if (!Number.isInteger(termDays)) {
    throw new Error('Term days must be a whole number');
  }

  const annualRate = input.annualRatePercent / 100;
  const annualGrowth = annualRate === 0 ? 1 : (1 + annualRate / input.compoundFrequency) ** input.compoundFrequency;
  const annualPercentageYield = (annualGrowth - 1) * 100;
  const termGrowth = annualGrowth ** (termDays / 365);
  const endingBalance = input.principal * termGrowth;

  return {
    principal: input.principal,
    annualRatePercent: input.annualRatePercent,
    compoundFrequency: input.compoundFrequency,
    termDays,
    annualPercentageYield,
    termInterest: endingBalance - input.principal,
    endingBalance,
  };
}

export function calculateInvestmentGrowth(
  principal: number,
  monthlyContribution: number,
  annualReturnPercent: number,
  years: number,
): CompoundInterestResult {
  return calculateCompoundInterest(principal, annualReturnPercent, years, 12, monthlyContribution);
}

export function calculateInflationAdjustment(
  amount: number,
  annualInflationPercent: number,
  years: number,
): InflationAdjustmentResult {
  assertPositiveNumber(amount, 'Amount');
  assertPercentGreaterThanNegativeHundred(annualInflationPercent, 'Annual inflation rate');
  assertNonNegativeNumber(years, 'Years');

  const multiplier = (1 + annualInflationPercent / 100) ** years;

  return {
    amount,
    annualInflationPercent,
    years,
    futureCost: amount * multiplier,
    presentBuyingPower: amount / multiplier,
  };
}

export function calculateRetirementSavings(input: {
  currentSavings: number;
  monthlyContribution: number;
  annualReturnPercent: number;
  years: number;
  targetAmount?: number;
}): RetirementSavingsResult {
  assertNonNegativeNumber(input.targetAmount ?? 0, 'Retirement target');

  const result = calculateInvestmentGrowth(
    input.currentSavings,
    input.monthlyContribution,
    input.annualReturnPercent,
    input.years,
  );
  const targetAmount = input.targetAmount ?? 0;
  const goalGap = targetAmount > 0 ? targetAmount - result.endingBalance : 0;

  return {
    ...result,
    targetAmount,
    goalGap,
    goalMet: targetAmount > 0 ? goalGap <= 0 : true,
  };
}

export function calculateAmortizationSummary(
  principal: number,
  annualRatePercent: number,
  years: number,
  extraMonthlyPayment = 0,
): AmortizationSummary {
  assertNonNegativeNumber(extraMonthlyPayment, 'Extra monthly payment');

  const scheduled = calculateLoanSummary(principal, annualRatePercent, years);
  const monthlyPayment = scheduled.monthlyPayment + extraMonthlyPayment;
  const monthlyRate = annualRatePercent / 100 / 12;
  let balance = principal;
  let totalInterest = 0;
  let monthsToPayoff = 0;

  if (monthlyRate === 0) {
    monthsToPayoff = Math.ceil(principal / monthlyPayment);
    totalInterest = 0;
  } else {
    while (balance > 0.005 && monthsToPayoff < scheduled.paymentCount * 5 + 12) {
      const interest = balance * monthlyRate;
      const principalPaid = Math.min(balance, monthlyPayment - interest);

      if (principalPaid <= 0) {
        throw new Error('Monthly payment is not enough to cover monthly interest');
      }

      totalInterest += interest;
      balance -= principalPaid;
      monthsToPayoff += 1;
    }
  }

  const totalPaid = principal + totalInterest;

  return {
    ...scheduled,
    monthlyPayment,
    totalPaid,
    totalInterest,
    scheduledMonthlyPayment: scheduled.monthlyPayment,
    extraMonthlyPayment,
    monthsToPayoff,
    yearsToPayoff: monthsToPayoff / 12,
    interestSaved: Math.max(0, scheduled.totalInterest - totalInterest),
    monthsSaved: Math.max(0, scheduled.paymentCount - monthsToPayoff),
  };
}

function calculateFederalTax(taxableIncome: number, brackets: TaxBracket[]) {
  let tax = 0;
  let marginalRate = 0;

  for (let index = 0; index < brackets.length; index += 1) {
    const bracket = brackets[index];
    const nextBracket = brackets[index + 1];
    const upper = nextBracket?.over ?? Number.POSITIVE_INFINITY;

    if (taxableIncome <= bracket.over) {
      continue;
    }

    const taxableInBracket = Math.min(taxableIncome, upper) - bracket.over;
    tax += taxableInBracket * bracket.rate;
    marginalRate = bracket.rate;

    if (taxableIncome <= upper) {
      break;
    }
  }

  return { tax, marginalRate };
}

export function calculateFederalIncomeTax2026(input: {
  filingStatus: FederalFilingStatus;
  grossIncome: number;
  deduction?: number;
  credits?: number;
}): FederalIncomeTaxResult {
  const data = federalTax2026[input.filingStatus];

  if (!data) {
    throw new Error('Choose a supported federal filing status');
  }

  assertNonNegativeNumber(input.grossIncome, 'Gross income');
  assertNonNegativeNumber(input.deduction ?? data.standardDeduction, 'Deduction');
  assertNonNegativeNumber(input.credits ?? 0, 'Credits');

  const deduction = input.deduction ?? data.standardDeduction;
  const taxableIncome = Math.max(0, input.grossIncome - deduction);
  const taxBeforeCredits = calculateFederalTax(taxableIncome, data.brackets);
  const federalTax = Math.max(0, taxBeforeCredits.tax - (input.credits ?? 0));

  return {
    filingStatus: input.filingStatus,
    grossIncome: input.grossIncome,
    deduction,
    taxableIncome,
    federalTax,
    effectiveRatePercent: input.grossIncome === 0 ? 0 : (federalTax / input.grossIncome) * 100,
    marginalRatePercent: taxBeforeCredits.marginalRate * 100,
    taxYear: 2026,
  };
}

export function calculateSalaryBreakdown(input: {
  annualSalary: number;
  hoursPerWeek: number;
  weeksPerYear: number;
  estimatedTaxRatePercent?: number;
}): SalaryBreakdownResult {
  assertPositiveNumber(input.annualSalary, 'Annual salary');
  assertPositiveNumber(input.hoursPerWeek, 'Hours per week');
  assertPositiveNumber(input.weeksPerYear, 'Weeks per year');
  assertPercentRange(input.estimatedTaxRatePercent ?? 0, 'Estimated tax rate');

  const estimatedTax = input.annualSalary * ((input.estimatedTaxRatePercent ?? 0) / 100);
  const estimatedTakeHomeAnnual = input.annualSalary - estimatedTax;

  return {
    annualSalary: input.annualSalary,
    hoursPerWeek: input.hoursPerWeek,
    weeksPerYear: input.weeksPerYear,
    grossMonthly: input.annualSalary / 12,
    grossBiweekly: input.annualSalary / 26,
    grossWeekly: input.annualSalary / input.weeksPerYear,
    grossDaily: input.annualSalary / input.weeksPerYear / 5,
    grossHourly: input.annualSalary / input.weeksPerYear / input.hoursPerWeek,
    estimatedTax,
    estimatedTakeHomeAnnual,
    estimatedTakeHomeMonthly: estimatedTakeHomeAnnual / 12,
  };
}

export function calculateInterestRateFromPayment(
  principal: number,
  monthlyPayment: number,
  years: number,
): InterestRateResult {
  assertPositiveNumber(principal, 'Principal');
  assertPositiveNumber(monthlyPayment, 'Monthly payment');
  assertPositiveNumber(years, 'Loan term');

  const paymentCount = Math.round(years * 12);
  const zeroInterestPayment = principal / paymentCount;

  if (monthlyPayment < zeroInterestPayment) {
    throw new Error('Monthly payment is too low to repay the principal within this term');
  }

  if (Math.abs(monthlyPayment - zeroInterestPayment) < 1e-10) {
    return {
      principal,
      annualRatePercent: 0,
      years,
      paymentCount,
      monthlyPayment,
      totalPaid: monthlyPayment * paymentCount,
      totalInterest: monthlyPayment * paymentCount - principal,
      monthlyRatePercent: 0,
    };
  }

  let low = 0;
  let high = 1;

  while (calculatePaymentForMonthlyRate(principal, high, paymentCount) < monthlyPayment && high < 10) {
    high *= 2;
  }

  for (let index = 0; index < 100; index += 1) {
    const mid = (low + high) / 2;
    const payment = calculatePaymentForMonthlyRate(principal, mid, paymentCount);

    if (payment > monthlyPayment) {
      high = mid;
    } else {
      low = mid;
    }
  }

  const monthlyRate = (low + high) / 2;
  const annualRatePercent = monthlyRate * 12 * 100;
  const totalPaid = monthlyPayment * paymentCount;

  return {
    principal,
    annualRatePercent,
    years,
    paymentCount,
    monthlyPayment,
    totalPaid,
    totalInterest: totalPaid - principal,
    monthlyRatePercent: monthlyRate * 100,
  };
}

export function calculateSalesTax(subtotal: number, salesTaxPercent: number) {
  assertNonNegativeNumber(subtotal, 'Subtotal');
  assertPercentRange(salesTaxPercent, 'Sales tax rate', 30);

  const taxAmount = subtotal * (salesTaxPercent / 100);

  return {
    subtotal,
    salesTaxPercent,
    taxAmount,
    total: subtotal + taxAmount,
  };
}

export function calculateCurrencyConversion(
  amount: number,
  exchangeRate: number,
  feePercent = 0,
): CurrencyConversionResult {
  assertPositiveNumber(amount, 'Amount');
  assertPositiveNumber(exchangeRate, 'Exchange rate');
  assertPercentRange(feePercent, 'Fee percent', 100);

  const grossConverted = amount * exchangeRate;
  const feeAmount = grossConverted * (feePercent / 100);

  return {
    amount,
    exchangeRate,
    feePercent,
    grossConverted,
    feeAmount,
    convertedAmount: grossConverted - feeAmount,
  };
}

export function calculateMortgagePayoffSummary(
  principal: number,
  annualRatePercent: number,
  years: number,
  extraMonthlyPayment = 0,
  oneTimePayment = 0,
): MortgagePayoffResult {
  assertPositiveNumber(principal, 'Loan balance');
  assertNonNegativeNumber(extraMonthlyPayment, 'Extra monthly payment');
  assertNonNegativeNumber(oneTimePayment, 'One-time payment');

  if (oneTimePayment >= principal) {
    throw new Error('One-time payment must be less than the loan balance');
  }

  const scheduled = calculateLoanSummary(principal, annualRatePercent, years);
  const remainingPrincipal = principal - oneTimePayment;
  const payoff = calculateAmortizationSummary(remainingPrincipal, annualRatePercent, years, extraMonthlyPayment);

  return {
    ...payoff,
    principal,
    scheduledMonthlyPayment: scheduled.monthlyPayment,
    oneTimePayment,
    remainingPrincipal,
    interestSaved: Math.max(0, scheduled.totalInterest - payoff.totalInterest),
    monthsSaved: Math.max(0, scheduled.paymentCount - payoff.monthsToPayoff),
  };
}

export function calculateFourOhOneKProjection(input: {
  currentBalance: number;
  annualSalary: number;
  employeeContributionPercent: number;
  employerMatchPercent: number;
  employerMatchLimitPercent: number;
  annualReturnPercent: number;
  years: number;
}): FourOhOneKProjectionResult {
  assertNonNegativeNumber(input.currentBalance, 'Current balance');
  assertPositiveNumber(input.annualSalary, 'Annual salary');
  assertPercentRange(input.employeeContributionPercent, 'Employee contribution percent', 100);
  assertPercentRange(input.employerMatchPercent, 'Employer match percent', 300);
  assertPercentRange(input.employerMatchLimitPercent, 'Employer match limit percent', 100);

  const monthlyEmployeeContribution = (input.annualSalary * (input.employeeContributionPercent / 100)) / 12;
  const matchedSalaryPercent = Math.min(input.employeeContributionPercent, input.employerMatchLimitPercent);
  const monthlyEmployerContribution = (input.annualSalary * (matchedSalaryPercent / 100) * (input.employerMatchPercent / 100)) / 12;
  const projection = calculateCompoundInterest(
    input.currentBalance,
    input.annualReturnPercent,
    input.years,
    12,
    monthlyEmployeeContribution + monthlyEmployerContribution,
  );

  return {
    ...projection,
    annualSalary: input.annualSalary,
    employeeContributionPercent: input.employeeContributionPercent,
    employerMatchPercent: input.employerMatchPercent,
    employerMatchLimitPercent: input.employerMatchLimitPercent,
    monthlyEmployeeContribution,
    monthlyEmployerContribution,
    totalEmployeeContributions: monthlyEmployeeContribution * projection.years * 12,
    totalEmployerContributions: monthlyEmployerContribution * projection.years * 12,
  };
}

export function calculateHouseAffordability(input: {
  annualIncome: number;
  monthlyDebts: number;
  downPayment: number;
  annualRatePercent: number;
  years: number;
  debtToIncomePercent: number;
  propertyTaxPercent?: number;
  monthlyInsurance?: number;
  monthlyHoa?: number;
}): HouseAffordabilityResult {
  assertPositiveNumber(input.annualIncome, 'Annual income');
  assertNonNegativeNumber(input.monthlyDebts, 'Monthly debts');
  assertNonNegativeNumber(input.downPayment, 'Down payment');
  assertPercentRange(input.debtToIncomePercent, 'Debt-to-income target', 100);
  assertPercentRange(input.propertyTaxPercent ?? 0, 'Property tax percent', 10);
  assertNonNegativeNumber(input.monthlyInsurance ?? 0, 'Monthly insurance');
  assertNonNegativeNumber(input.monthlyHoa ?? 0, 'Monthly HOA');

  const monthlyIncome = input.annualIncome / 12;
  const maxMonthlyDebtPayment = monthlyIncome * (input.debtToIncomePercent / 100);
  const maxMonthlyHousingPayment = maxMonthlyDebtPayment - input.monthlyDebts;

  if (maxMonthlyHousingPayment <= 0) {
    throw new Error('Monthly debts leave no room under the selected debt-to-income target');
  }

  const propertyTaxPercent = input.propertyTaxPercent ?? 0;
  const monthlyInsurance = input.monthlyInsurance ?? 0;
  const monthlyHoa = input.monthlyHoa ?? 0;
  const paymentForHome = (homePrice: number) => {
    const loanAmount = Math.max(0, homePrice - input.downPayment);
    const principalAndInterest = loanAmount === 0 ? 0 : calculateLoanPayment(loanAmount, input.annualRatePercent, input.years);
    const monthlyPropertyTax = (homePrice * (propertyTaxPercent / 100)) / 12;

    return principalAndInterest + monthlyPropertyTax + monthlyInsurance + monthlyHoa;
  };

  let low = 0;
  let high = Math.max(input.downPayment + input.annualIncome * 6, 100000);

  while (paymentForHome(high) <= maxMonthlyHousingPayment && high < 50000000) {
    low = high;
    high *= 2;
  }

  for (let index = 0; index < 80; index += 1) {
    const mid = (low + high) / 2;

    if (paymentForHome(mid) <= maxMonthlyHousingPayment) {
      low = mid;
    } else {
      high = mid;
    }
  }

  const homePrice = low;
  const loanAmount = Math.max(0, homePrice - input.downPayment);
  const principalAndInterest = loanAmount === 0 ? 0 : calculateLoanPayment(loanAmount, input.annualRatePercent, input.years);
  const monthlyPropertyTax = (homePrice * (propertyTaxPercent / 100)) / 12;

  return {
    annualIncome: input.annualIncome,
    monthlyDebts: input.monthlyDebts,
    debtToIncomePercent: input.debtToIncomePercent,
    maxMonthlyDebtPayment,
    maxMonthlyHousingPayment,
    homePrice,
    downPayment: input.downPayment,
    loanAmount,
    principalAndInterest,
    monthlyPropertyTax,
    monthlyInsurance,
    monthlyHoa,
    totalMonthlyHousingPayment: principalAndInterest + monthlyPropertyTax + monthlyInsurance + monthlyHoa,
  };
}

export function calculateSavingsProjection(
  currentSavings: number,
  monthlyDeposit: number,
  annualRatePercent: number,
  years: number,
  targetAmount = 0,
): SavingsProjectionResult {
  assertNonNegativeNumber(targetAmount, 'Target amount');

  const projection = calculateCompoundInterest(currentSavings, annualRatePercent, years, 12, monthlyDeposit);
  const targetGap = targetAmount > 0 ? targetAmount - projection.endingBalance : 0;

  return {
    ...projection,
    targetAmount,
    targetGap,
    targetMet: targetAmount > 0 ? targetGap <= 0 : true,
  };
}

export function calculateRentAffordability(
  monthlyIncome: number,
  targetRentPercent: number,
  monthlyDebts = 0,
  monthlyUtilities = 0,
): RentAffordabilityResult {
  assertPositiveNumber(monthlyIncome, 'Monthly income');
  assertPercentRange(targetRentPercent, 'Target rent percent', 100);
  assertNonNegativeNumber(monthlyDebts, 'Monthly debts');
  assertNonNegativeNumber(monthlyUtilities, 'Monthly utilities');

  const targetRent = monthlyIncome * (targetRentPercent / 100);
  const maxRent = Math.max(0, targetRent - monthlyDebts - monthlyUtilities);

  return {
    monthlyIncome,
    targetRentPercent,
    monthlyDebts,
    monthlyUtilities,
    maxRent,
    annualRent: maxRent * 12,
    incomeAfterRentAndBills: monthlyIncome - maxRent - monthlyDebts - monthlyUtilities,
  };
}

export function calculateAnnuity(
  payment: number,
  annualRatePercent: number,
  years: number,
  paymentsPerYear = 12,
  timing: AnnuityTiming = 'ordinary',
): AnnuityResult {
  assertPositiveNumber(payment, 'Payment');
  assertPercentGreaterThanNegativeHundred(annualRatePercent, 'Annual rate');
  assertPositiveNumber(years, 'Time');
  assertPositiveNumber(paymentsPerYear, 'Payments per year');

  if (!Number.isInteger(paymentsPerYear)) {
    throw new Error('Payments per year must be a whole number');
  }

  const paymentCount = Math.round(years * paymentsPerYear);
  const periodicRate = annualRatePercent / 100 / paymentsPerYear;
  const timingMultiplier = timing === 'due' ? 1 + periodicRate : 1;
  const futureValue =
    periodicRate === 0
      ? payment * paymentCount
      : payment * (((1 + periodicRate) ** paymentCount - 1) / periodicRate) * timingMultiplier;
  const presentValue =
    periodicRate === 0
      ? payment * paymentCount
      : payment * ((1 - (1 + periodicRate) ** -paymentCount) / periodicRate) * timingMultiplier;

  return {
    payment,
    annualRatePercent,
    years,
    paymentsPerYear,
    paymentCount,
    timing,
    totalPayments: payment * paymentCount,
    futureValue,
    presentValue,
  };
}

export function calculateCreditCardPayoff(input: {
  balance: number;
  annualRatePercent: number;
  monthlyPayment: number;
  monthlyNewCharges?: number;
}): CreditCardPayoffResult {
  assertPositiveNumber(input.balance, 'Balance');
  assertNonNegativeNumber(input.annualRatePercent, 'APR');
  assertPositiveNumber(input.monthlyPayment, 'Monthly payment');
  assertNonNegativeNumber(input.monthlyNewCharges ?? 0, 'Monthly new charges');

  const monthlyRate = input.annualRatePercent / 100 / 12;
  const monthlyNewCharges = input.monthlyNewCharges ?? 0;

  if (input.monthlyPayment <= input.balance * monthlyRate + monthlyNewCharges) {
    throw new Error('Monthly payment must be higher than monthly interest and new charges');
  }

  let balance = input.balance;
  let monthsToPayoff = 0;
  let totalInterest = 0;
  let totalPaid = 0;
  let finalPayment = 0;

  while (balance > 0.005 && monthsToPayoff < 1200) {
    const interest = balance * monthlyRate;
    balance += interest + monthlyNewCharges;
    const payment = Math.min(input.monthlyPayment, balance);

    balance -= payment;
    totalInterest += interest;
    totalPaid += payment;
    finalPayment = payment;
    monthsToPayoff += 1;
  }

  if (monthsToPayoff >= 1200) {
    throw new Error('Payoff takes too long with these inputs');
  }

  return {
    startingBalance: input.balance,
    annualRatePercent: input.annualRatePercent,
    monthlyPayment: input.monthlyPayment,
    monthlyNewCharges,
    monthsToPayoff,
    totalInterest,
    totalPaid,
    finalPayment,
  };
}

export function calculatePensionEstimate(
  finalAverageSalary: number,
  yearsOfService: number,
  multiplierPercent: number,
): PensionEstimateResult {
  assertPositiveNumber(finalAverageSalary, 'Final average salary');
  assertNonNegativeNumber(yearsOfService, 'Years of service');
  assertPercentRange(multiplierPercent, 'Multiplier', 10);

  const annualPension = finalAverageSalary * yearsOfService * (multiplierPercent / 100);

  return {
    finalAverageSalary,
    yearsOfService,
    multiplierPercent,
    annualPension,
    monthlyPension: annualPension / 12,
    replacementRatePercent: (annualPension / finalAverageSalary) * 100,
  };
}

export function calculateAnnuityPayout(
  principal: number,
  annualRatePercent: number,
  years: number,
  paymentsPerYear = 12,
): AnnuityPayoutResult {
  assertPositiveNumber(principal, 'Principal');
  assertPercentGreaterThanNegativeHundred(annualRatePercent, 'Annual rate');
  assertPositiveNumber(years, 'Payout time');
  assertPositiveNumber(paymentsPerYear, 'Payments per year');

  if (!Number.isInteger(paymentsPerYear)) {
    throw new Error('Payments per year must be a whole number');
  }

  const paymentCount = Math.round(years * paymentsPerYear);
  const periodicRate = annualRatePercent / 100 / paymentsPerYear;
  const payment =
    periodicRate === 0
      ? principal / paymentCount
      : (principal * periodicRate) / (1 - (1 + periodicRate) ** -paymentCount);
  const totalPaid = payment * paymentCount;

  return {
    principal,
    annualRatePercent,
    years,
    paymentsPerYear,
    paymentCount,
    payment,
    totalPaid,
    estimatedInterest: totalPaid - principal,
  };
}

export function calculateFixedDebtPayoff(input: {
  balance: number;
  annualRatePercent: number;
  monthlyPayment: number;
  extraMonthlyPayment?: number;
}): DebtPayoffResult {
  assertPositiveNumber(input.balance, 'Balance');
  assertNonNegativeNumber(input.annualRatePercent, 'Annual interest rate');
  assertPositiveNumber(input.monthlyPayment, 'Monthly payment');
  assertNonNegativeNumber(input.extraMonthlyPayment ?? 0, 'Extra monthly payment');

  const extraMonthlyPayment = input.extraMonthlyPayment ?? 0;
  const totalMonthlyPayment = input.monthlyPayment + extraMonthlyPayment;
  const monthlyRate = input.annualRatePercent / 100 / 12;

  if (totalMonthlyPayment <= input.balance * monthlyRate) {
    throw new Error('Monthly payment must be higher than monthly interest');
  }

  let balance = input.balance;
  let monthsToPayoff = 0;
  let totalInterest = 0;
  let totalPaid = 0;
  let finalPayment = 0;

  while (balance > 0.005 && monthsToPayoff < 1200) {
    const interest = balance * monthlyRate;
    balance += interest;
    const payment = Math.min(totalMonthlyPayment, balance);

    balance -= payment;
    totalInterest += interest;
    totalPaid += payment;
    finalPayment = payment;
    monthsToPayoff += 1;
  }

  if (monthsToPayoff >= 1200) {
    throw new Error('Payoff takes too long with these inputs');
  }

  return {
    startingBalance: input.balance,
    annualRatePercent: input.annualRatePercent,
    monthlyPayment: input.monthlyPayment,
    extraMonthlyPayment,
    monthsToPayoff,
    totalInterest,
    totalPaid,
    finalPayment,
  };
}

export function calculateDebtConsolidation(input: {
  totalDebt: number;
  currentAnnualRatePercent: number;
  currentMonthlyPayment: number;
  newAnnualRatePercent: number;
  newYears: number;
  fees?: number;
}): DebtConsolidationResult {
  assertPositiveNumber(input.totalDebt, 'Total debt');
  assertNonNegativeNumber(input.currentAnnualRatePercent, 'Current annual interest rate');
  assertPositiveNumber(input.currentMonthlyPayment, 'Current monthly payment');
  assertNonNegativeNumber(input.newAnnualRatePercent, 'New annual interest rate');
  assertPositiveNumber(input.newYears, 'New loan term');
  assertNonNegativeNumber(input.fees ?? 0, 'Fees');

  const fees = input.fees ?? 0;
  const newPrincipal = input.totalDebt + fees;
  const currentDebt = calculateFixedDebtPayoff({
    balance: input.totalDebt,
    annualRatePercent: input.currentAnnualRatePercent,
    monthlyPayment: input.currentMonthlyPayment,
  });
  const consolidationLoan = calculateLoanSummary(newPrincipal, input.newAnnualRatePercent, input.newYears);

  return {
    currentDebt,
    consolidationLoan,
    newPrincipal,
    fees,
    monthlyPaymentChange: consolidationLoan.monthlyPayment - currentDebt.monthlyPayment,
    totalCostChange: consolidationLoan.totalPaid - currentDebt.totalPaid,
  };
}

export function calculateCollegeCost(input: {
  currentAnnualCost: number;
  yearsUntilStart: number;
  yearsInSchool: number;
  annualCostIncreasePercent: number;
  currentSavings: number;
  monthlySavings: number;
  annualSavingsReturnPercent: number;
}): CollegeCostResult {
  assertPositiveNumber(input.currentAnnualCost, 'Current annual cost');
  assertNonNegativeNumber(input.yearsUntilStart, 'Years until start');
  assertPositiveNumber(input.yearsInSchool, 'Years in school');
  assertPercentGreaterThanNegativeHundred(input.annualCostIncreasePercent, 'Annual cost increase');
  assertNonNegativeNumber(input.currentSavings, 'Current savings');
  assertNonNegativeNumber(input.monthlySavings, 'Monthly savings');
  assertPercentGreaterThanNegativeHundred(input.annualSavingsReturnPercent, 'Annual savings return');

  if (!Number.isInteger(input.yearsInSchool)) {
    throw new Error('Years in school must be a whole number');
  }

  const firstYearCost = input.currentAnnualCost * (1 + input.annualCostIncreasePercent / 100) ** input.yearsUntilStart;
  let totalEstimatedCost = 0;

  for (let year = 0; year < input.yearsInSchool; year += 1) {
    totalEstimatedCost += firstYearCost * (1 + input.annualCostIncreasePercent / 100) ** year;
  }

  const savings = calculateCompoundInterest(
    input.currentSavings,
    input.annualSavingsReturnPercent,
    input.yearsUntilStart,
    12,
    input.monthlySavings,
  );

  return {
    currentAnnualCost: input.currentAnnualCost,
    yearsUntilStart: input.yearsUntilStart,
    yearsInSchool: input.yearsInSchool,
    annualCostIncreasePercent: input.annualCostIncreasePercent,
    firstYearCost,
    totalEstimatedCost,
    projectedSavings: savings.endingBalance,
    savingsGap: totalEstimatedCost - savings.endingBalance,
  };
}

export function calculateCdEstimate(
  principal: number,
  annualPercentageYield: number,
  termMonths: number,
  earlyWithdrawalPenaltyMonths = 0,
): CdEstimateResult {
  assertPositiveNumber(principal, 'Principal');
  assertNonNegativeNumber(annualPercentageYield, 'Annual percentage yield');
  assertPositiveNumber(termMonths, 'Term months');
  assertNonNegativeNumber(earlyWithdrawalPenaltyMonths, 'Early withdrawal penalty months');

  if (!Number.isInteger(termMonths)) {
    throw new Error('Term months must be a whole number');
  }

  const maturityValue = principal * (1 + annualPercentageYield / 100) ** (termMonths / 12);
  const interestEarned = maturityValue - principal;
  const earlyWithdrawalPenalty = principal * (annualPercentageYield / 100 / 12) * earlyWithdrawalPenaltyMonths;

  return {
    principal,
    annualPercentageYield,
    termMonths,
    maturityValue,
    interestEarned,
    earlyWithdrawalPenalty,
    valueAfterPenalty: Math.max(0, maturityValue - earlyWithdrawalPenalty),
  };
}

export function calculateBondEstimate(
  faceValue: number,
  marketPrice: number,
  couponRatePercent: number,
  yearsToMaturity: number,
  paymentsPerYear = 2,
): BondEstimateResult {
  assertPositiveNumber(faceValue, 'Face value');
  assertPositiveNumber(marketPrice, 'Market price');
  assertNonNegativeNumber(couponRatePercent, 'Coupon rate');
  assertPositiveNumber(yearsToMaturity, 'Years to maturity');
  assertPositiveNumber(paymentsPerYear, 'Payments per year');

  if (!Number.isInteger(paymentsPerYear)) {
    throw new Error('Payments per year must be a whole number');
  }

  const annualCoupon = faceValue * (couponRatePercent / 100);
  const totalCouponPayments = annualCoupon * yearsToMaturity;
  const currentYieldPercent = (annualCoupon / marketPrice) * 100;
  const approximateYieldToMaturityPercent =
    ((annualCoupon + (faceValue - marketPrice) / yearsToMaturity) / ((faceValue + marketPrice) / 2)) * 100;

  return {
    faceValue,
    marketPrice,
    couponRatePercent,
    yearsToMaturity,
    paymentsPerYear,
    annualCoupon,
    totalCouponPayments,
    currentYieldPercent,
    approximateYieldToMaturityPercent,
  };
}

export function calculateMutualFundEstimate(
  principal: number,
  monthlyContribution: number,
  annualReturnPercent: number,
  expenseRatioPercent: number,
  years: number,
): MutualFundEstimateResult {
  assertNonNegativeNumber(principal, 'Initial investment');
  assertNonNegativeNumber(monthlyContribution, 'Monthly contribution');
  assertPercentGreaterThanNegativeHundred(annualReturnPercent, 'Annual return');
  assertPercentRange(expenseRatioPercent, 'Expense ratio', 20);
  assertNonNegativeNumber(years, 'Years');

  const netReturnPercent = annualReturnPercent - expenseRatioPercent;

  if (netReturnPercent <= -100) {
    throw new Error('Annual return after expenses must be greater than -100%');
  }

  const gross = calculateInvestmentGrowth(principal, monthlyContribution, annualReturnPercent, years);
  const net = calculateInvestmentGrowth(principal, monthlyContribution, netReturnPercent, years);

  return {
    ...net,
    grossEndingBalance: gross.endingBalance,
    estimatedExpenseDrag: gross.endingBalance - net.endingBalance,
    expenseRatioPercent,
  };
}

export function calculateIraProjection(
  currentBalance: number,
  annualContribution: number,
  annualReturnPercent: number,
  years: number,
): CompoundInterestResult {
  assertNonNegativeNumber(annualContribution, 'Annual contribution');

  return calculateCompoundInterest(currentBalance, annualReturnPercent, years, 12, annualContribution / 12);
}

export function calculateVat(amount: number, vatPercent: number, mode: VatMode = 'add'): VatResult {
  assertNonNegativeNumber(amount, 'Amount');
  assertPercentRange(vatPercent, 'VAT rate', 100);

  if (mode !== 'add' && mode !== 'remove') {
    throw new Error('VAT mode must be add or remove');
  }

  const rate = vatPercent / 100;
  const netAmount = mode === 'add' ? amount : amount / (1 + rate);
  const grossAmount = mode === 'add' ? amount * (1 + rate) : amount;
  const vatAmount = grossAmount - netAmount;

  return {
    mode,
    amount,
    vatPercent,
    netAmount,
    vatAmount,
    grossAmount,
  };
}

export function calculateCashBackLowInterest(input: {
  purchaseAmount: number;
  payoffMonths: number;
  cashBackPercent: number;
  cashBackAprPercent: number;
  lowInterestAprPercent: number;
}): CashBackLowInterestResult {
  assertPositiveNumber(input.purchaseAmount, 'Purchase amount');
  assertPositiveNumber(input.payoffMonths, 'Payoff months');
  assertPercentRange(input.cashBackPercent, 'Cash back percent', 100);
  assertNonNegativeNumber(input.cashBackAprPercent, 'Cash back APR');
  assertNonNegativeNumber(input.lowInterestAprPercent, 'Low interest APR');

  if (!Number.isInteger(input.payoffMonths)) {
    throw new Error('Payoff months must be a whole number');
  }

  const years = input.payoffMonths / 12;
  const cashBackValue = input.purchaseAmount * (input.cashBackPercent / 100);
  const cashBackLoan = calculateLoanSummary(input.purchaseAmount, input.cashBackAprPercent, years);
  const lowInterestLoan = calculateLoanSummary(input.purchaseAmount, input.lowInterestAprPercent, years);
  const cashBackTotalCost = cashBackLoan.totalPaid - cashBackValue;
  const lowInterestTotalCost = lowInterestLoan.totalPaid;
  const betterOption = cashBackTotalCost <= lowInterestTotalCost ? 'cash-back' : 'low-interest';

  return {
    purchaseAmount: input.purchaseAmount,
    payoffMonths: input.payoffMonths,
    cashBackPercent: input.cashBackPercent,
    cashBackAprPercent: input.cashBackAprPercent,
    lowInterestAprPercent: input.lowInterestAprPercent,
    cashBackValue,
    cashBackLoan,
    lowInterestLoan,
    cashBackTotalCost,
    lowInterestTotalCost,
    betterOption,
    savings: Math.abs(cashBackTotalCost - lowInterestTotalCost),
  };
}

export function calculateAutoLease(input: {
  vehiclePrice: number;
  downPayment: number;
  tradeIn: number;
  residualValue: number;
  moneyFactor: number;
  termMonths: number;
  taxPercent: number;
  fees: number;
}): AutoLeaseResult {
  assertPositiveNumber(input.vehiclePrice, 'Vehicle price');
  assertNonNegativeNumber(input.downPayment, 'Down payment');
  assertNonNegativeNumber(input.tradeIn, 'Trade-in value');
  assertNonNegativeNumber(input.residualValue, 'Residual value');
  assertNonNegativeNumber(input.moneyFactor, 'Money factor');
  assertPositiveNumber(input.termMonths, 'Lease term');
  assertPercentRange(input.taxPercent, 'Tax rate', 30);
  assertNonNegativeNumber(input.fees, 'Fees');

  if (!Number.isInteger(input.termMonths)) {
    throw new Error('Lease term must be a whole number of months');
  }

  const adjustedCapitalizedCost = input.vehiclePrice + input.fees - input.downPayment - input.tradeIn;

  if (adjustedCapitalizedCost <= input.residualValue) {
    throw new Error('Adjusted capitalized cost must be greater than residual value');
  }

  const depreciationFee = (adjustedCapitalizedCost - input.residualValue) / input.termMonths;
  const financeFee = (adjustedCapitalizedCost + input.residualValue) * input.moneyFactor;
  const pretaxMonthlyPayment = depreciationFee + financeFee;
  const monthlyTax = pretaxMonthlyPayment * (input.taxPercent / 100);
  const monthlyPayment = pretaxMonthlyPayment + monthlyTax;

  return {
    vehiclePrice: input.vehiclePrice,
    downPayment: input.downPayment,
    tradeIn: input.tradeIn,
    residualValue: input.residualValue,
    moneyFactor: input.moneyFactor,
    termMonths: input.termMonths,
    taxPercent: input.taxPercent,
    fees: input.fees,
    adjustedCapitalizedCost,
    depreciationFee,
    financeFee,
    pretaxMonthlyPayment,
    monthlyTax,
    monthlyPayment,
    totalLeaseCost: input.downPayment + monthlyPayment * input.termMonths,
  };
}

export function calculateDepreciationEstimate(input: {
  cost: number;
  salvageValue: number;
  lifeYears: number;
  ageYears: number;
  method: DepreciationMethod;
  decliningRatePercent?: number;
}): DepreciationEstimateResult {
  assertPositiveNumber(input.cost, 'Cost');
  assertNonNegativeNumber(input.salvageValue, 'Salvage value');
  assertPositiveNumber(input.lifeYears, 'Useful life');
  assertNonNegativeNumber(input.ageYears, 'Age');

  if (input.salvageValue >= input.cost) {
    throw new Error('Salvage value must be less than cost');
  }

  if (input.method !== 'straight-line' && input.method !== 'declining-balance') {
    throw new Error('Depreciation method must be straight-line or declining-balance');
  }

  const decliningRatePercent = input.decliningRatePercent ?? 20;
  assertPercentRange(decliningRatePercent, 'Declining balance rate', 100);

  const depreciableAmount = input.cost - input.salvageValue;
  let accumulatedDepreciation = 0;
  let annualDepreciation = depreciableAmount / input.lifeYears;

  if (input.method === 'straight-line') {
    accumulatedDepreciation = Math.min(depreciableAmount, annualDepreciation * input.ageYears);
  } else {
    let bookValue = input.cost;
    let remainingAge = input.ageYears;
    annualDepreciation = Math.min(bookValue - input.salvageValue, bookValue * (decliningRatePercent / 100));

    while (remainingAge > 0 && bookValue > input.salvageValue) {
      const yearFraction = Math.min(1, remainingAge);
      const yearDepreciation = Math.min(
        bookValue - input.salvageValue,
        bookValue * (decliningRatePercent / 100) * yearFraction,
      );

      accumulatedDepreciation += yearDepreciation;
      bookValue -= yearDepreciation;
      remainingAge -= yearFraction;
    }
  }

  return {
    cost: input.cost,
    salvageValue: input.salvageValue,
    lifeYears: input.lifeYears,
    ageYears: input.ageYears,
    method: input.method,
    decliningRatePercent,
    annualDepreciation,
    accumulatedDepreciation,
    bookValue: input.cost - accumulatedDepreciation,
  };
}

export function calculateAverageReturn(input: {
  beginningValue: number;
  endingValue: number;
  years: number;
  contributions?: number;
  withdrawals?: number;
}): AverageReturnResult {
  assertPositiveNumber(input.beginningValue, 'Beginning value');
  assertNonNegativeNumber(input.endingValue, 'Ending value');
  assertPositiveNumber(input.years, 'Years');
  assertNonNegativeNumber(input.contributions ?? 0, 'Contributions');
  assertNonNegativeNumber(input.withdrawals ?? 0, 'Withdrawals');

  const contributions = input.contributions ?? 0;
  const withdrawals = input.withdrawals ?? 0;
  const netGain = input.endingValue + withdrawals - input.beginningValue - contributions;
  const investedBase = input.beginningValue + contributions;
  const cumulativeReturnPercent = investedBase === 0 ? 0 : (netGain / investedBase) * 100;
  const cagrPercent = input.endingValue > 0 ? ((input.endingValue / input.beginningValue) ** (1 / input.years) - 1) * 100 : -100;

  return {
    beginningValue: input.beginningValue,
    endingValue: input.endingValue,
    years: input.years,
    contributions,
    withdrawals,
    netGain,
    cumulativeReturnPercent,
    averageAnnualReturnPercent: cumulativeReturnPercent / input.years,
    cagrPercent,
  };
}

export function calculateMarginEstimate(revenue: number, cost: number): MarginEstimateResult {
  assertPositiveNumber(revenue, 'Revenue');
  assertNonNegativeNumber(cost, 'Cost');

  const profit = revenue - cost;

  return {
    revenue,
    cost,
    profit,
    marginPercent: (profit / revenue) * 100,
    markupPercent: cost === 0 ? 0 : (profit / cost) * 100,
  };
}

export function calculateAdRevenueEstimate(input: {
  dailyPageViews: number;
  pageCtrPercent: number;
  averageCpc: number;
}): AdRevenueEstimateResult {
  assertPositiveNumber(input.dailyPageViews, 'Daily page views');
  assertPercentRange(input.pageCtrPercent, 'Page CTR');
  assertNonNegativeNumber(input.averageCpc, 'Average CPC');

  const estimatedClicks = input.dailyPageViews * (input.pageCtrPercent / 100);
  const dailyRevenue = estimatedClicks * input.averageCpc;

  return {
    dailyPageViews: input.dailyPageViews,
    pageCtrPercent: input.pageCtrPercent,
    averageCpc: input.averageCpc,
    estimatedClicks,
    dailyRevenue,
    monthlyRevenue: dailyRevenue * 30.4375,
    annualRevenue: dailyRevenue * 365,
    pageRpm: (dailyRevenue / input.dailyPageViews) * 1000,
  };
}

export function calculateBreakEven(input: {
  fixedCosts: number;
  pricePerUnit: number;
  variableCostPerUnit: number;
}): BreakEvenResult {
  assertNonNegativeNumber(input.fixedCosts, 'Fixed costs');
  assertPositiveNumber(input.pricePerUnit, 'Price per unit');
  assertNonNegativeNumber(input.variableCostPerUnit, 'Variable cost per unit');

  const contributionMarginPerUnit = input.pricePerUnit - input.variableCostPerUnit;

  if (contributionMarginPerUnit <= 0) {
    throw new Error('Price per unit must be greater than variable cost per unit');
  }

  const breakEvenUnits = input.fixedCosts / contributionMarginPerUnit;

  return {
    fixedCosts: input.fixedCosts,
    pricePerUnit: input.pricePerUnit,
    variableCostPerUnit: input.variableCostPerUnit,
    contributionMarginPerUnit,
    contributionMarginRatioPercent: (contributionMarginPerUnit / input.pricePerUnit) * 100,
    breakEvenUnits,
    breakEvenSales: breakEvenUnits * input.pricePerUnit,
  };
}

export function calculateMarkupPrice(input: {
  unitCost: number;
  markupPercent: number;
  units?: number;
}): MarkupPriceResult {
  assertNonNegativeNumber(input.unitCost, 'Unit cost');
  assertNonNegativeNumber(input.markupPercent, 'Markup percent');
  assertPositiveNumber(input.units ?? 1, 'Units');

  const units = input.units ?? 1;
  const sellingPricePerUnit = input.unitCost * (1 + input.markupPercent / 100);
  const profitPerUnit = sellingPricePerUnit - input.unitCost;

  return {
    unitCost: input.unitCost,
    markupPercent: input.markupPercent,
    units,
    sellingPricePerUnit,
    profitPerUnit,
    marginPercent: sellingPricePerUnit === 0 ? 0 : (profitPerUnit / sellingPricePerUnit) * 100,
    totalRevenue: sellingPricePerUnit * units,
    totalCost: input.unitCost * units,
    totalProfit: profitPerUnit * units,
  };
}

export function calculateProfitGoal(input: {
  fixedCosts: number;
  targetProfit: number;
  pricePerUnit: number;
  variableCostPerUnit: number;
}): ProfitGoalResult {
  assertNonNegativeNumber(input.fixedCosts, 'Fixed costs');
  assertNonNegativeNumber(input.targetProfit, 'Target profit');
  assertPositiveNumber(input.pricePerUnit, 'Price per unit');
  assertNonNegativeNumber(input.variableCostPerUnit, 'Variable cost per unit');

  const contributionMarginPerUnit = input.pricePerUnit - input.variableCostPerUnit;

  if (contributionMarginPerUnit <= 0) {
    throw new Error('Price per unit must be greater than variable cost per unit');
  }

  const requiredUnits = (input.fixedCosts + input.targetProfit) / contributionMarginPerUnit;

  return {
    fixedCosts: input.fixedCosts,
    targetProfit: input.targetProfit,
    pricePerUnit: input.pricePerUnit,
    variableCostPerUnit: input.variableCostPerUnit,
    contributionMarginPerUnit,
    requiredUnits,
    requiredSales: requiredUnits * input.pricePerUnit,
  };
}

export function calculateLiquidityRatios(input: {
  currentAssets: number;
  currentLiabilities: number;
  inventory?: number;
  prepaidExpenses?: number;
  cashAndEquivalents?: number;
  marketableSecurities?: number;
  accountsReceivable?: number;
}): LiquidityRatiosResult {
  assertNonNegativeNumber(input.currentAssets, 'Current assets');
  assertPositiveNumber(input.currentLiabilities, 'Current liabilities');
  assertNonNegativeNumber(input.inventory ?? 0, 'Inventory');
  assertNonNegativeNumber(input.prepaidExpenses ?? 0, 'Prepaid expenses');
  assertNonNegativeNumber(input.cashAndEquivalents ?? 0, 'Cash and equivalents');
  assertNonNegativeNumber(input.marketableSecurities ?? 0, 'Marketable securities');
  assertNonNegativeNumber(input.accountsReceivable ?? 0, 'Accounts receivable');

  const inventory = input.inventory ?? 0;
  const prepaidExpenses = input.prepaidExpenses ?? 0;
  const cashAndEquivalents = input.cashAndEquivalents ?? 0;
  const marketableSecurities = input.marketableSecurities ?? 0;
  const accountsReceivable = input.accountsReceivable ?? 0;
  const quickAssets = input.currentAssets - inventory - prepaidExpenses;

  return {
    currentAssets: input.currentAssets,
    currentLiabilities: input.currentLiabilities,
    inventory,
    prepaidExpenses,
    cashAndEquivalents,
    marketableSecurities,
    accountsReceivable,
    workingCapital: input.currentAssets - input.currentLiabilities,
    currentRatio: input.currentAssets / input.currentLiabilities,
    quickRatio: quickAssets / input.currentLiabilities,
    cashRatio: (cashAndEquivalents + marketableSecurities) / input.currentLiabilities,
  };
}

export function calculateDebtRatios(input: {
  totalDebt: number;
  totalAssets: number;
  totalEquity: number;
  ebit: number;
  interestExpense: number;
}): DebtRatiosResult {
  assertNonNegativeNumber(input.totalDebt, 'Total debt');
  assertPositiveNumber(input.totalAssets, 'Total assets');
  assertPositiveNumber(input.totalEquity, 'Total equity');
  assertNonNegativeNumber(input.ebit, 'EBIT');
  assertPositiveNumber(input.interestExpense, 'Interest expense');

  return {
    totalDebt: input.totalDebt,
    totalAssets: input.totalAssets,
    totalEquity: input.totalEquity,
    ebit: input.ebit,
    interestExpense: input.interestExpense,
    debtRatioPercent: (input.totalDebt / input.totalAssets) * 100,
    debtToEquityRatio: input.totalDebt / input.totalEquity,
    timesInterestEarned: input.ebit / input.interestExpense,
  };
}

export function calculateOperationsRatios(input: {
  costOfGoodsSold: number;
  beginningInventory: number;
  endingInventory: number;
  netSales: number;
  averageTotalAssets: number;
  netCreditSales: number;
  averageAccountsReceivable: number;
  totalAssets: number;
  totalEquity: number;
}): OperationsRatiosResult {
  assertNonNegativeNumber(input.costOfGoodsSold, 'Cost of goods sold');
  assertNonNegativeNumber(input.beginningInventory, 'Beginning inventory');
  assertNonNegativeNumber(input.endingInventory, 'Ending inventory');
  assertNonNegativeNumber(input.netSales, 'Net sales');
  assertPositiveNumber(input.averageTotalAssets, 'Average total assets');
  assertNonNegativeNumber(input.netCreditSales, 'Net credit sales');
  assertPositiveNumber(input.averageAccountsReceivable, 'Average accounts receivable');
  assertPositiveNumber(input.totalAssets, 'Total assets');
  assertPositiveNumber(input.totalEquity, 'Total equity');

  const averageInventory = (input.beginningInventory + input.endingInventory) / 2;

  if (averageInventory <= 0) {
    throw new Error('Average inventory must be greater than zero');
  }

  const receivablesTurnover = input.netCreditSales / input.averageAccountsReceivable;

  return {
    costOfGoodsSold: input.costOfGoodsSold,
    averageInventory,
    netSales: input.netSales,
    averageTotalAssets: input.averageTotalAssets,
    netCreditSales: input.netCreditSales,
    averageAccountsReceivable: input.averageAccountsReceivable,
    totalAssets: input.totalAssets,
    totalEquity: input.totalEquity,
    inventoryTurnover: input.costOfGoodsSold / averageInventory,
    assetTurnover: input.netSales / input.averageTotalAssets,
    receivablesTurnover,
    averageCollectionPeriodDays: receivablesTurnover === 0 ? 0 : 365 / receivablesTurnover,
    equityMultiplier: input.totalAssets / input.totalEquity,
  };
}

export function calculateProfitabilityRatios(input: {
  netSales: number;
  costOfGoodsSold: number;
  operatingIncome: number;
  netIncome: number;
  averageAssets: number;
  averageEquity: number;
  sharesOutstanding: number;
  pricePerShare: number;
}): ProfitabilityRatiosResult {
  assertPositiveNumber(input.netSales, 'Net sales');
  assertNonNegativeNumber(input.costOfGoodsSold, 'Cost of goods sold');
  assertNonNegativeNumber(input.operatingIncome, 'Operating income');
  assertNonNegativeNumber(input.netIncome, 'Net income');
  assertPositiveNumber(input.averageAssets, 'Average assets');
  assertPositiveNumber(input.averageEquity, 'Average equity');
  assertPositiveNumber(input.sharesOutstanding, 'Shares outstanding');
  assertNonNegativeNumber(input.pricePerShare, 'Price per share');

  const grossProfit = input.netSales - input.costOfGoodsSold;
  const earningsPerShare = input.netIncome / input.sharesOutstanding;

  return {
    netSales: input.netSales,
    costOfGoodsSold: input.costOfGoodsSold,
    operatingIncome: input.operatingIncome,
    netIncome: input.netIncome,
    averageAssets: input.averageAssets,
    averageEquity: input.averageEquity,
    sharesOutstanding: input.sharesOutstanding,
    pricePerShare: input.pricePerShare,
    grossProfit,
    grossMarginPercent: (grossProfit / input.netSales) * 100,
    operatingMarginPercent: (input.operatingIncome / input.netSales) * 100,
    netProfitMarginPercent: (input.netIncome / input.netSales) * 100,
    returnOnAssetsPercent: (input.netIncome / input.averageAssets) * 100,
    returnOnEquityPercent: (input.netIncome / input.averageEquity) * 100,
    earningsPerShare,
    priceEarningsRatio: earningsPerShare === 0 ? 0 : input.pricePerShare / earningsPerShare,
  };
}

export function calculateStockRatios(input: {
  stockPrice: number;
  earningsPerShare: number;
  salesPerShare: number;
  bookValuePerShare: number;
  dividendPerShare?: number;
}): StockRatiosResult {
  assertPositiveNumber(input.stockPrice, 'Stock price');
  assertPositiveNumber(input.earningsPerShare, 'Earnings per share');
  assertPositiveNumber(input.salesPerShare, 'Sales per share');
  assertPositiveNumber(input.bookValuePerShare, 'Book value per share');
  assertNonNegativeNumber(input.dividendPerShare ?? 0, 'Dividend per share');

  const dividendPerShare = input.dividendPerShare ?? 0;

  return {
    stockPrice: input.stockPrice,
    earningsPerShare: input.earningsPerShare,
    salesPerShare: input.salesPerShare,
    bookValuePerShare: input.bookValuePerShare,
    dividendPerShare,
    priceEarningsRatio: input.stockPrice / input.earningsPerShare,
    priceSalesRatio: input.stockPrice / input.salesPerShare,
    priceBookRatio: input.stockPrice / input.bookValuePerShare,
    dividendYieldPercent: (dividendPerShare / input.stockPrice) * 100,
    payoutRatioPercent: (dividendPerShare / input.earningsPerShare) * 100,
  };
}

export function calculateDiscountEstimate(input: {
  originalPrice: number;
  discountPercent: number;
  extraDiscountPercent?: number;
  taxPercent?: number;
}): DiscountEstimateResult {
  assertNonNegativeNumber(input.originalPrice, 'Original price');
  assertPercentRange(input.discountPercent, 'Discount percent', 100);
  assertPercentRange(input.extraDiscountPercent ?? 0, 'Extra discount percent', 100);
  assertPercentRange(input.taxPercent ?? 0, 'Tax rate', 100);

  const extraDiscountPercent = input.extraDiscountPercent ?? 0;
  const taxPercent = input.taxPercent ?? 0;
  const firstDiscountAmount = input.originalPrice * (input.discountPercent / 100);
  const afterFirstDiscount = input.originalPrice - firstDiscountAmount;
  const extraDiscountAmount = afterFirstDiscount * (extraDiscountPercent / 100);
  const subtotalAfterDiscounts = afterFirstDiscount - extraDiscountAmount;
  const taxAmount = subtotalAfterDiscounts * (taxPercent / 100);
  const finalPrice = subtotalAfterDiscounts + taxAmount;
  const totalSavings = input.originalPrice - subtotalAfterDiscounts;

  return {
    originalPrice: input.originalPrice,
    discountPercent: input.discountPercent,
    extraDiscountPercent,
    taxPercent,
    firstDiscountAmount,
    extraDiscountAmount,
    subtotalAfterDiscounts,
    taxAmount,
    finalPrice,
    totalSavings,
    effectiveDiscountPercent: input.originalPrice === 0 ? 0 : (totalSavings / input.originalPrice) * 100,
  };
}

export function calculateBusinessLoan(input: {
  principal: number;
  annualRatePercent: number;
  years: number;
  originationFeePercent?: number;
}): BusinessLoanResult {
  assertPercentRange(input.originationFeePercent ?? 0, 'Origination fee percent', 100);

  const loan = calculateLoanSummary(input.principal, input.annualRatePercent, input.years);
  const originationFeePercent = input.originationFeePercent ?? 0;
  const originationFee = input.principal * (originationFeePercent / 100);

  return {
    ...loan,
    originationFeePercent,
    originationFee,
    cashReceived: input.principal - originationFee,
    totalCostWithFee: loan.totalPaid + originationFee,
  };
}

export function calculateDebtToIncome(
  monthlyIncome: number,
  monthlyDebtPayments: number,
  proposedHousingPayment = 0,
): DebtToIncomeResult {
  assertPositiveNumber(monthlyIncome, 'Monthly income');
  assertNonNegativeNumber(monthlyDebtPayments, 'Monthly debt payments');
  assertNonNegativeNumber(proposedHousingPayment, 'Proposed housing payment');

  const totalMonthlyDebt = monthlyDebtPayments + proposedHousingPayment;

  return {
    monthlyIncome,
    monthlyDebtPayments,
    proposedHousingPayment,
    totalMonthlyDebt,
    debtToIncomePercent: (totalMonthlyDebt / monthlyIncome) * 100,
    remainingIncome: monthlyIncome - totalMonthlyDebt,
  };
}

export function calculateAssetLease(input: {
  assetValue: number;
  residualValue: number;
  annualRatePercent: number;
  termMonths: number;
  upfrontPayment?: number;
  fees?: number;
}): AssetLeaseResult {
  assertPositiveNumber(input.assetValue, 'Asset value');
  assertNonNegativeNumber(input.residualValue, 'Residual value');
  assertNonNegativeNumber(input.annualRatePercent, 'Annual rate');
  assertPositiveNumber(input.termMonths, 'Lease term');
  assertNonNegativeNumber(input.upfrontPayment ?? 0, 'Upfront payment');
  assertNonNegativeNumber(input.fees ?? 0, 'Fees');

  if (!Number.isInteger(input.termMonths)) {
    throw new Error('Lease term must be a whole number of months');
  }

  const upfrontPayment = input.upfrontPayment ?? 0;
  const fees = input.fees ?? 0;
  const adjustedCost = input.assetValue + fees - upfrontPayment;

  if (adjustedCost <= input.residualValue) {
    throw new Error('Adjusted cost must be greater than residual value');
  }

  const monthlyRate = input.annualRatePercent / 100 / 12;
  const depreciationFee = (adjustedCost - input.residualValue) / input.termMonths;
  const financeFee = (adjustedCost + input.residualValue) * monthlyRate;
  const monthlyPayment = depreciationFee + financeFee;

  return {
    assetValue: input.assetValue,
    residualValue: input.residualValue,
    annualRatePercent: input.annualRatePercent,
    termMonths: input.termMonths,
    upfrontPayment,
    fees,
    adjustedCost,
    depreciationFee,
    financeFee,
    monthlyPayment,
    totalLeaseCost: upfrontPayment + monthlyPayment * input.termMonths,
  };
}

export function calculateRefinance(input: {
  currentBalance: number;
  currentAnnualRatePercent: number;
  currentYears: number;
  newAnnualRatePercent: number;
  newYears: number;
  closingCosts?: number;
}): RefinanceResult {
  assertPositiveNumber(input.currentBalance, 'Current balance');
  assertNonNegativeNumber(input.currentAnnualRatePercent, 'Current interest rate');
  assertPositiveNumber(input.currentYears, 'Current remaining term');
  assertNonNegativeNumber(input.newAnnualRatePercent, 'New interest rate');
  assertPositiveNumber(input.newYears, 'New loan term');
  assertNonNegativeNumber(input.closingCosts ?? 0, 'Closing costs');

  const closingCosts = input.closingCosts ?? 0;
  const currentLoan = calculateLoanSummary(input.currentBalance, input.currentAnnualRatePercent, input.currentYears);
  const newPrincipal = input.currentBalance + closingCosts;
  const newLoan = calculateLoanSummary(newPrincipal, input.newAnnualRatePercent, input.newYears);
  const monthlySavings = currentLoan.monthlyPayment - newLoan.monthlyPayment;
  const breakEvenMonths = monthlySavings > 0 ? closingCosts / monthlySavings : null;

  return {
    currentLoan,
    newLoan,
    closingCosts,
    newPrincipal,
    monthlySavings,
    totalInterestChange: newLoan.totalInterest - currentLoan.totalInterest,
    totalCostChange: newLoan.totalPaid - currentLoan.totalPaid,
    breakEvenMonths,
  };
}

export function calculateBudget(input: {
  monthlyIncome: number;
  housing: number;
  utilities: number;
  food: number;
  transportation: number;
  insurance: number;
  debt: number;
  savings: number;
  other: number;
}): BudgetResult {
  assertPositiveNumber(input.monthlyIncome, 'Monthly income');

  const categories = [
    { label: 'Housing', amount: input.housing },
    { label: 'Utilities', amount: input.utilities },
    { label: 'Food', amount: input.food },
    { label: 'Transportation', amount: input.transportation },
    { label: 'Insurance', amount: input.insurance },
    { label: 'Debt payments', amount: input.debt },
    { label: 'Savings', amount: input.savings },
    { label: 'Other', amount: input.other },
  ];

  categories.forEach((category) => assertNonNegativeNumber(category.amount, category.label));

  const totalExpenses = categories.reduce((total, category) => total + category.amount, 0);

  return {
    monthlyIncome: input.monthlyIncome,
    totalExpenses,
    leftover: input.monthlyIncome - totalExpenses,
    expenseRatioPercent: (totalExpenses / input.monthlyIncome) * 100,
    savingsRatePercent: (input.savings / input.monthlyIncome) * 100,
    categories: categories.map((category) => ({
      ...category,
      percentOfIncome: (category.amount / input.monthlyIncome) * 100,
    })),
  };
}

const estateTaxBasicExclusion2026 = 15000000;
const estateTaxTopRate = 0.4;
const socialSecurityWageBase2026 = 184500;
const additionalMedicareThreshold = 200000;

const uniformLifetimeFactors: Record<number, number> = {
  72: 27.4,
  73: 26.5,
  74: 25.5,
  75: 24.6,
  76: 23.7,
  77: 22.9,
  78: 22.0,
  79: 21.1,
  80: 20.2,
  81: 19.4,
  82: 18.5,
  83: 17.7,
  84: 16.8,
  85: 16.0,
  86: 15.2,
  87: 14.4,
  88: 13.7,
  89: 12.9,
  90: 12.2,
  91: 11.5,
  92: 10.8,
  93: 10.1,
  94: 9.5,
  95: 8.9,
  96: 8.4,
  97: 7.8,
  98: 7.3,
  99: 6.8,
  100: 6.4,
  101: 6.0,
  102: 5.6,
  103: 5.2,
  104: 4.9,
  105: 4.6,
  106: 4.3,
  107: 4.1,
  108: 3.9,
  109: 3.7,
  110: 3.5,
  111: 3.4,
  112: 3.3,
  113: 3.1,
  114: 3.0,
  115: 2.9,
  116: 2.8,
  117: 2.7,
  118: 2.5,
  119: 2.3,
  120: 2.0,
};

function fullRetirementAgeYearsForBirthYear(birthYear: number) {
  if (birthYear <= 1937) {
    return 65;
  }

  if (birthYear >= 1938 && birthYear <= 1942) {
    return 65 + ((birthYear - 1937) * 2) / 12;
  }

  if (birthYear >= 1943 && birthYear <= 1954) {
    return 66;
  }

  if (birthYear >= 1955 && birthYear <= 1959) {
    return 66 + ((birthYear - 1954) * 2) / 12;
  }

  return 67;
}

function loanBalanceAfterPayments(principal: number, annualRatePercent: number, years: number, paymentsMade: number) {
  const scheduled = calculateLoanSummary(principal, annualRatePercent, years);
  const monthlyRate = annualRatePercent / 100 / 12;
  const periods = Math.max(0, Math.min(scheduled.paymentCount, Math.round(paymentsMade)));

  if (monthlyRate === 0) {
    return Math.max(0, principal - scheduled.monthlyPayment * periods);
  }

  const growth = (1 + monthlyRate) ** periods;

  return Math.max(0, principal * growth - scheduled.monthlyPayment * ((growth - 1) / monthlyRate));
}

function solveRateForPayment(presentValue: number, payment: number, periods: number) {
  assertPositiveNumber(presentValue, 'Present value');
  assertPositiveNumber(payment, 'Payment');
  assertPositiveNumber(periods, 'Payment count');

  if (payment * periods <= presentValue) {
    return 0;
  }

  let low = 0;
  let high = 1;

  while (calculatePaymentForMonthlyRate(presentValue, high, periods) < payment && high < 10) {
    high *= 2;
  }

  for (let index = 0; index < 100; index += 1) {
    const mid = (low + high) / 2;
    const estimated = calculatePaymentForMonthlyRate(presentValue, mid, periods);

    if (estimated > payment) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return (low + high) / 2;
}

export function calculateMarriageTaxComparison(input: {
  spouseOneIncome: number;
  spouseTwoIncome: number;
  spouseOneDeduction?: number;
  spouseTwoDeduction?: number;
  jointDeduction?: number;
  credits?: number;
}): MarriageTaxComparisonResult {
  assertNonNegativeNumber(input.spouseOneIncome, 'Spouse one income');
  assertNonNegativeNumber(input.spouseTwoIncome, 'Spouse two income');
  assertNonNegativeNumber(input.credits ?? 0, 'Credits');

  const spouseOneTax = calculateFederalIncomeTax2026({
    filingStatus: 'single',
    grossIncome: input.spouseOneIncome,
    deduction: input.spouseOneDeduction,
    credits: 0,
  });
  const spouseTwoTax = calculateFederalIncomeTax2026({
    filingStatus: 'single',
    grossIncome: input.spouseTwoIncome,
    deduction: input.spouseTwoDeduction,
    credits: 0,
  });
  const jointTax = calculateFederalIncomeTax2026({
    filingStatus: 'married-joint',
    grossIncome: input.spouseOneIncome + input.spouseTwoIncome,
    deduction: input.jointDeduction,
    credits: input.credits,
  });
  const combinedSingleTax = spouseOneTax.federalTax + spouseTwoTax.federalTax;

  return {
    spouseOneTax,
    spouseTwoTax,
    jointTax,
    combinedSingleTax,
    marriageDifference: jointTax.federalTax - combinedSingleTax,
  };
}

export function calculateEstateTaxEstimate(input: {
  grossEstate: number;
  debtsAndExpenses?: number;
  charitableBequests?: number;
  spouseTransfers?: number;
  lifetimeTaxableGifts?: number;
}): EstateTaxEstimateResult {
  assertNonNegativeNumber(input.grossEstate, 'Gross estate');
  assertNonNegativeNumber(input.debtsAndExpenses ?? 0, 'Debts and expenses');
  assertNonNegativeNumber(input.charitableBequests ?? 0, 'Charitable bequests');
  assertNonNegativeNumber(input.spouseTransfers ?? 0, 'Spouse transfers');
  assertNonNegativeNumber(input.lifetimeTaxableGifts ?? 0, 'Lifetime taxable gifts');

  const deductions = (input.debtsAndExpenses ?? 0) + (input.charitableBequests ?? 0) + (input.spouseTransfers ?? 0);
  const taxableEstateBeforeExclusion = Math.max(0, input.grossEstate - deductions);
  const remainingBasicExclusion = Math.max(0, estateTaxBasicExclusion2026 - (input.lifetimeTaxableGifts ?? 0));
  const taxableAboveExclusion = Math.max(0, taxableEstateBeforeExclusion - remainingBasicExclusion);

  return {
    grossEstate: input.grossEstate,
    deductions,
    taxableEstateBeforeExclusion,
    remainingBasicExclusion,
    taxableAboveExclusion,
    estimatedFederalEstateTax: taxableAboveExclusion * estateTaxTopRate,
  };
}

export function calculateSocialSecurityClaiming(input: {
  birthYear: number;
  fullRetirementAgeBenefit: number;
  claimingAgeYears: number;
}): SocialSecurityClaimingResult {
  assertFiniteNumber(input.birthYear, 'Birth year');
  assertPositiveNumber(input.fullRetirementAgeBenefit, 'Full retirement age benefit');
  assertPositiveNumber(input.claimingAgeYears, 'Claiming age');

  if (!Number.isInteger(input.birthYear)) {
    throw new Error('Birth year must be a whole number');
  }

  if (input.claimingAgeYears < 62 || input.claimingAgeYears > 70) {
    throw new Error('Claiming age must be between 62 and 70');
  }

  const fullRetirementAgeYears = fullRetirementAgeYearsForBirthYear(input.birthYear);
  const monthsDifference = Math.round((input.claimingAgeYears - fullRetirementAgeYears) * 12);
  let adjustment = 0;

  if (monthsDifference < 0) {
    const monthsEarly = Math.abs(monthsDifference);
    const first36Months = Math.min(36, monthsEarly);
    const extraMonths = Math.max(0, monthsEarly - 36);
    adjustment = -(first36Months * (5 / 9 / 100) + extraMonths * (5 / 12 / 100));
  } else if (monthsDifference > 0) {
    adjustment = monthsDifference * (2 / 3 / 100);
  }

  const monthlyBenefit = input.fullRetirementAgeBenefit * (1 + adjustment);

  return {
    birthYear: input.birthYear,
    fullRetirementAgeYears,
    claimingAgeYears: input.claimingAgeYears,
    fullRetirementAgeBenefit: input.fullRetirementAgeBenefit,
    monthlyBenefit,
    adjustmentPercent: adjustment * 100,
    annualBenefit: monthlyBenefit * 12,
  };
}

export function calculateRmdEstimate(accountBalance: number, age: number): RmdEstimateResult {
  assertPositiveNumber(accountBalance, 'Account balance');
  assertFiniteNumber(age, 'Age');

  const roundedAge = Math.floor(age);
  const lifeExpectancyFactor = uniformLifetimeFactors[Math.min(120, roundedAge)];

  if (!lifeExpectancyFactor || roundedAge < 72) {
    throw new Error('Age must be at least 72 for the Uniform Lifetime Table lookup');
  }

  const requiredDistribution = accountBalance / lifeExpectancyFactor;

  return {
    accountBalance,
    age: roundedAge,
    lifeExpectancyFactor,
    requiredDistribution,
    remainingBalanceAfterRmd: accountBalance - requiredDistribution,
  };
}

export function calculateRealEstateReturn(input: {
  purchasePrice: number;
  downPayment: number;
  buyingCosts?: number;
  improvements?: number;
  sellingPrice: number;
  sellingCosts?: number;
  loanPayoff?: number;
}): RealEstateReturnResult {
  assertPositiveNumber(input.purchasePrice, 'Purchase price');
  assertNonNegativeNumber(input.downPayment, 'Down payment');
  assertNonNegativeNumber(input.buyingCosts ?? 0, 'Buying costs');
  assertNonNegativeNumber(input.improvements ?? 0, 'Improvements');
  assertPositiveNumber(input.sellingPrice, 'Selling price');
  assertNonNegativeNumber(input.sellingCosts ?? 0, 'Selling costs');
  assertNonNegativeNumber(input.loanPayoff ?? 0, 'Loan payoff');

  const buyingCosts = input.buyingCosts ?? 0;
  const improvements = input.improvements ?? 0;
  const loanPayoff = input.loanPayoff ?? Math.max(0, input.purchasePrice - input.downPayment);
  const sellingCosts = input.sellingCosts ?? 0;
  const cashInvested = input.downPayment + buyingCosts + improvements;
  const netSaleProceeds = input.sellingPrice - sellingCosts - loanPayoff;
  const profit = netSaleProceeds - cashInvested;

  return {
    purchasePrice: input.purchasePrice,
    sellingPrice: input.sellingPrice,
    cashInvested,
    netSaleProceeds,
    profit,
    roiPercent: cashInvested === 0 ? 0 : (profit / cashInvested) * 100,
    equityMultiple: cashInvested === 0 ? 0 : netSaleProceeds / cashInvested,
  };
}

export function calculateTakeHomePaycheck(input: {
  annualGrossPay: number;
  payPeriodsPerYear: number;
  pretaxDeductionsPerPaycheck?: number;
  federalTaxPercent?: number;
  stateTaxPercent?: number;
  localTaxPercent?: number;
}): TakeHomePaycheckResult {
  assertPositiveNumber(input.annualGrossPay, 'Annual gross pay');
  assertPositiveNumber(input.payPeriodsPerYear, 'Pay periods per year');
  assertNonNegativeNumber(input.pretaxDeductionsPerPaycheck ?? 0, 'Pretax deductions');
  assertPercentRange(input.federalTaxPercent ?? 0, 'Federal tax estimate');
  assertPercentRange(input.stateTaxPercent ?? 0, 'State tax estimate');
  assertPercentRange(input.localTaxPercent ?? 0, 'Local tax estimate');

  const pretaxDeductionsAnnual = (input.pretaxDeductionsPerPaycheck ?? 0) * input.payPeriodsPerYear;
  const taxableEstimate = Math.max(0, input.annualGrossPay - pretaxDeductionsAnnual);
  const federalTax = taxableEstimate * ((input.federalTaxPercent ?? 0) / 100);
  const stateTax = taxableEstimate * ((input.stateTaxPercent ?? 0) / 100);
  const localTax = taxableEstimate * ((input.localTaxPercent ?? 0) / 100);
  const socialSecurityTax = Math.min(input.annualGrossPay, socialSecurityWageBase2026) * 0.062;
  const medicareTax = input.annualGrossPay * 0.0145 + Math.max(0, input.annualGrossPay - additionalMedicareThreshold) * 0.009;
  const annualTakeHomePay =
    input.annualGrossPay - pretaxDeductionsAnnual - federalTax - stateTax - localTax - socialSecurityTax - medicareTax;

  return {
    annualGrossPay: input.annualGrossPay,
    grossPerPaycheck: input.annualGrossPay / input.payPeriodsPerYear,
    pretaxDeductionsAnnual,
    federalTax,
    stateTax,
    localTax,
    socialSecurityTax,
    medicareTax,
    annualTakeHomePay,
    takeHomePerPaycheck: annualTakeHomePay / input.payPeriodsPerYear,
  };
}

export function calculateRentalProperty(input: {
  propertyPrice: number;
  downPayment: number;
  annualRatePercent: number;
  loanYears: number;
  monthlyRent: number;
  vacancyPercent?: number;
  monthlyOperatingExpenses?: number;
  annualPropertyTax?: number;
  monthlyInsurance?: number;
  maintenancePercent?: number;
  closingCosts?: number;
}): RentalPropertyResult {
  assertPositiveNumber(input.propertyPrice, 'Property price');
  assertNonNegativeNumber(input.downPayment, 'Down payment');
  assertPositiveNumber(input.monthlyRent, 'Monthly rent');
  assertPercentRange(input.vacancyPercent ?? 0, 'Vacancy reserve', 100);
  assertNonNegativeNumber(input.monthlyOperatingExpenses ?? 0, 'Monthly operating expenses');
  assertNonNegativeNumber(input.annualPropertyTax ?? 0, 'Annual property tax');
  assertNonNegativeNumber(input.monthlyInsurance ?? 0, 'Monthly insurance');
  assertPercentRange(input.maintenancePercent ?? 0, 'Maintenance reserve', 100);
  assertNonNegativeNumber(input.closingCosts ?? 0, 'Closing costs');

  if (input.downPayment >= input.propertyPrice) {
    throw new Error('Down payment must be less than property price');
  }

  const loanAmount = input.propertyPrice - input.downPayment;
  const loan = calculateLoanSummary(loanAmount, input.annualRatePercent, input.loanYears);
  const monthlyVacancyReserve = input.monthlyRent * ((input.vacancyPercent ?? 0) / 100);
  const monthlyMaintenanceReserve = (input.propertyPrice * ((input.maintenancePercent ?? 0) / 100)) / 12;
  const monthlyOperatingExpenses =
    (input.monthlyOperatingExpenses ?? 0) +
    (input.annualPropertyTax ?? 0) / 12 +
    (input.monthlyInsurance ?? 0) +
    monthlyMaintenanceReserve +
    monthlyVacancyReserve;
  const monthlyNoi = input.monthlyRent - monthlyOperatingExpenses;
  const monthlyCashFlow = monthlyNoi - loan.monthlyPayment;
  const cashInvested = input.downPayment + (input.closingCosts ?? 0);

  return {
    loanAmount,
    monthlyMortgagePayment: loan.monthlyPayment,
    monthlyVacancyReserve,
    monthlyOperatingExpenses,
    monthlyNoi,
    monthlyCashFlow,
    capRatePercent: ((monthlyNoi * 12) / input.propertyPrice) * 100,
    cashOnCashReturnPercent: cashInvested === 0 ? 0 : ((monthlyCashFlow * 12) / cashInvested) * 100,
  };
}

export function calculateIrr(cashFlows: number[], periodsPerYear = 1): IrrResult {
  if (cashFlows.length < 2) {
    throw new Error('Enter at least two cash flows');
  }

  cashFlows.forEach((cashFlow, index) => assertFiniteNumber(cashFlow, `Cash flow ${index + 1}`));
  assertPositiveNumber(periodsPerYear, 'Periods per year');

  const hasPositive = cashFlows.some((cashFlow) => cashFlow > 0);
  const hasNegative = cashFlows.some((cashFlow) => cashFlow < 0);

  if (!hasPositive || !hasNegative) {
    throw new Error('Cash flows need at least one negative and one positive value');
  }

  const npv = (rate: number) => cashFlows.reduce((total, cashFlow, index) => total + cashFlow / (1 + rate) ** index, 0);
  let low = -0.999999;
  let high = 10;
  let lowValue = npv(low);
  let highValue = npv(high);

  if (Math.sign(lowValue) === Math.sign(highValue)) {
    high = 100;
    highValue = npv(high);
  }

  if (Math.sign(lowValue) === Math.sign(highValue)) {
    throw new Error('These cash flows do not produce a simple IRR estimate');
  }

  for (let index = 0; index < 160; index += 1) {
    const mid = (low + high) / 2;
    const midValue = npv(mid);

    if (Math.sign(midValue) === Math.sign(lowValue)) {
      low = mid;
      lowValue = midValue;
    } else {
      high = mid;
      highValue = midValue;
    }
  }

  const periodicRate = (low + high) / 2;

  return {
    periodicIrrPercent: periodicRate * 100,
    annualizedIrrPercent: ((1 + periodicRate) ** periodsPerYear - 1) * 100,
    netCashFlow: cashFlows.reduce((total, cashFlow) => total + cashFlow, 0),
  };
}

export function calculateRoi(input: {
  initialInvestment: number;
  endingValue: number;
  income?: number;
  costs?: number;
}): RoiResult {
  assertPositiveNumber(input.initialInvestment, 'Initial investment');
  assertNonNegativeNumber(input.endingValue, 'Ending value');
  assertNonNegativeNumber(input.income ?? 0, 'Income');
  assertNonNegativeNumber(input.costs ?? 0, 'Costs');

  const gain = input.endingValue + (input.income ?? 0) - (input.costs ?? 0) - input.initialInvestment;

  return {
    gain,
    roiPercent: (gain / input.initialInvestment) * 100,
    endingValue: input.endingValue,
  };
}

export function calculateAprEstimate(input: {
  principal: number;
  annualRatePercent: number;
  years: number;
  fees?: number;
}): AprEstimateResult {
  assertNonNegativeNumber(input.fees ?? 0, 'Fees');

  const loan = calculateLoanSummary(input.principal, input.annualRatePercent, input.years);
  const fees = input.fees ?? 0;
  const amountReceived = input.principal - fees;

  if (amountReceived <= 0) {
    throw new Error('Fees must be less than principal');
  }

  const monthlyAprRate = solveRateForPayment(amountReceived, loan.monthlyPayment, loan.paymentCount);

  return {
    loan,
    fees,
    amountReceived,
    aprPercent: monthlyAprRate * 12 * 100,
  };
}

export function calculateFhaLoan(input: {
  homePrice: number;
  downPayment: number;
  annualRatePercent: number;
  years: number;
  upfrontMipPercent?: number;
  annualMipPercent?: number;
  annualPropertyTax?: number;
  monthlyInsurance?: number;
}): FhaLoanResult {
  assertPercentRange(input.upfrontMipPercent ?? 1.75, 'Upfront MIP', 10);
  assertPercentRange(input.annualMipPercent ?? 0.55, 'Annual MIP', 10);

  const baseLoanAmount = input.homePrice - input.downPayment;
  const upfrontMip = baseLoanAmount * ((input.upfrontMipPercent ?? 1.75) / 100);
  const annualMipPercent = input.annualMipPercent ?? 0.55;
  const mortgage = calculateMortgagePayment({
    homePrice: input.homePrice + upfrontMip,
    downPayment: input.downPayment,
    annualRatePercent: input.annualRatePercent,
    years: input.years,
    annualPropertyTax: input.annualPropertyTax ?? 0,
    monthlyInsurance: input.monthlyInsurance ?? 0,
    monthlyPmi: 0,
    monthlyHoa: 0,
  });
  const monthlyMip = (baseLoanAmount * (annualMipPercent / 100)) / 12;

  return {
    ...mortgage,
    baseLoanAmount,
    upfrontMip,
    annualMipPercent,
    monthlyMip,
    loanToValuePercent: (baseLoanAmount / input.homePrice) * 100,
    totalMonthlyPayment: mortgage.totalMonthlyPayment + monthlyMip,
  };
}

export function calculateVaMortgage(input: {
  homePrice: number;
  downPayment: number;
  annualRatePercent: number;
  years: number;
  firstUse?: boolean;
  exemptFundingFee?: boolean;
  financeFundingFee?: boolean;
  annualPropertyTax?: number;
  monthlyInsurance?: number;
}): VaMortgageResult {
  const downPaymentPercent = (input.downPayment / input.homePrice) * 100;
  const firstUse = input.firstUse ?? true;
  let fundingFeePercent = 0;

  if (!(input.exemptFundingFee ?? false)) {
    if (downPaymentPercent >= 10) {
      fundingFeePercent = 1.25;
    } else if (downPaymentPercent >= 5) {
      fundingFeePercent = 1.5;
    } else {
      fundingFeePercent = firstUse ? 2.15 : 3.3;
    }
  }

  const baseLoanAmount = input.homePrice - input.downPayment;
  const fundingFee = baseLoanAmount * (fundingFeePercent / 100);
  const fundingFeeFinanced = input.financeFundingFee ?? true;
  const financedHomePrice = input.homePrice + (fundingFeeFinanced ? fundingFee : 0);
  const mortgage = calculateMortgagePayment({
    homePrice: financedHomePrice,
    downPayment: input.downPayment,
    annualRatePercent: input.annualRatePercent,
    years: input.years,
    annualPropertyTax: input.annualPropertyTax ?? 0,
    monthlyInsurance: input.monthlyInsurance ?? 0,
    monthlyPmi: 0,
    monthlyHoa: 0,
  });

  return {
    ...mortgage,
    baseLoanAmount,
    fundingFeePercent,
    fundingFee,
    fundingFeeFinanced,
  };
}

export function calculateHomeEquityLoan(input: {
  homeValue: number;
  currentMortgageBalance: number;
  desiredLoanAmount: number;
  annualRatePercent: number;
  years: number;
  maxCombinedLoanToValuePercent?: number;
}): HomeEquityLoanResult {
  assertPositiveNumber(input.homeValue, 'Home value');
  assertNonNegativeNumber(input.currentMortgageBalance, 'Current mortgage balance');
  assertPositiveNumber(input.desiredLoanAmount, 'Desired loan amount');
  assertPercentRange(input.maxCombinedLoanToValuePercent ?? 85, 'Max CLTV', 100);

  const maxCombinedLoanToValuePercent = input.maxCombinedLoanToValuePercent ?? 85;
  const availableEquity = Math.max(0, input.homeValue * (maxCombinedLoanToValuePercent / 100) - input.currentMortgageBalance);
  const loan = calculateLoanSummary(input.desiredLoanAmount, input.annualRatePercent, input.years);

  return {
    ...loan,
    homeValue: input.homeValue,
    currentMortgageBalance: input.currentMortgageBalance,
    maxCombinedLoanToValuePercent,
    availableEquity,
    combinedLoanToValuePercent: ((input.currentMortgageBalance + input.desiredLoanAmount) / input.homeValue) * 100,
  };
}

export function calculateHeloc(input: {
  homeValue: number;
  currentMortgageBalance: number;
  creditLine: number;
  currentDraw: number;
  annualRatePercent: number;
  repaymentYears: number;
  maxCombinedLoanToValuePercent?: number;
}): HelocResult {
  assertPositiveNumber(input.homeValue, 'Home value');
  assertNonNegativeNumber(input.currentMortgageBalance, 'Current mortgage balance');
  assertPositiveNumber(input.creditLine, 'Credit line');
  assertNonNegativeNumber(input.currentDraw, 'Current draw');
  assertNonNegativeNumber(input.annualRatePercent, 'Interest rate');
  assertPositiveNumber(input.repaymentYears, 'Repayment years');
  assertPercentRange(input.maxCombinedLoanToValuePercent ?? 85, 'Max CLTV', 100);

  if (input.currentDraw > input.creditLine) {
    throw new Error('Current draw cannot be larger than credit line');
  }

  const maxCombinedLoanToValuePercent = input.maxCombinedLoanToValuePercent ?? 85;
  const availableEquity = Math.max(0, input.homeValue * (maxCombinedLoanToValuePercent / 100) - input.currentMortgageBalance);
  const monthlyRate = input.annualRatePercent / 100 / 12;
  const interestOnlyPayment = input.currentDraw * monthlyRate;
  const repayment = input.currentDraw > 0 ? calculateLoanSummary(input.currentDraw, input.annualRatePercent, input.repaymentYears) : null;

  return {
    homeValue: input.homeValue,
    currentMortgageBalance: input.currentMortgageBalance,
    maxCombinedLoanToValuePercent,
    creditLine: input.creditLine,
    currentDraw: input.currentDraw,
    availableEquity,
    interestOnlyPayment,
    repaymentPayment: repayment?.monthlyPayment ?? 0,
    combinedLoanToValuePercent: ((input.currentMortgageBalance + input.currentDraw) / input.homeValue) * 100,
  };
}

export function calculateDownPayment(input: {
  homePrice: number;
  downPayment?: number;
  downPaymentPercent?: number;
  closingCostPercent?: number;
}): DownPaymentResult {
  assertPositiveNumber(input.homePrice, 'Home price');
  assertNonNegativeNumber(input.downPayment ?? 0, 'Down payment');
  assertPercentRange(input.downPaymentPercent ?? 0, 'Down payment percent');
  assertPercentRange(input.closingCostPercent ?? 0, 'Closing cost percent', 20);

  const downPayment = input.downPayment && input.downPayment > 0 ? input.downPayment : input.homePrice * ((input.downPaymentPercent ?? 0) / 100);

  if (downPayment >= input.homePrice) {
    throw new Error('Down payment must be less than home price');
  }

  const loanAmount = input.homePrice - downPayment;
  const estimatedClosingCosts = input.homePrice * ((input.closingCostPercent ?? 0) / 100);

  return {
    homePrice: input.homePrice,
    downPayment,
    downPaymentPercent: (downPayment / input.homePrice) * 100,
    loanAmount,
    loanToValuePercent: (loanAmount / input.homePrice) * 100,
    estimatedClosingCosts,
    cashNeeded: downPayment + estimatedClosingCosts,
  };
}

export function calculateRentVsBuy(input: {
  monthlyRent: number;
  rentIncreasePercent: number;
  homePrice: number;
  downPayment: number;
  annualRatePercent: number;
  years: number;
  annualPropertyTax: number;
  monthlyInsurance: number;
  maintenancePercent: number;
  appreciationPercent: number;
  sellingCostPercent: number;
}): RentVsBuyResult {
  assertPositiveNumber(input.monthlyRent, 'Monthly rent');
  assertPercentGreaterThanNegativeHundred(input.rentIncreasePercent, 'Rent increase');
  assertPositiveNumber(input.homePrice, 'Home price');
  assertNonNegativeNumber(input.downPayment, 'Down payment');
  assertPositiveNumber(input.years, 'Years');
  assertPercentRange(input.maintenancePercent, 'Maintenance percent', 20);
  assertPercentGreaterThanNegativeHundred(input.appreciationPercent, 'Appreciation');
  assertPercentRange(input.sellingCostPercent, 'Selling cost percent', 20);

  const months = Math.round(input.years * 12);
  let totalRentCost = 0;

  for (let month = 0; month < months; month += 1) {
    const yearIndex = Math.floor(month / 12);
    totalRentCost += input.monthlyRent * (1 + input.rentIncreasePercent / 100) ** yearIndex;
  }

  const loanAmount = input.homePrice - input.downPayment;
  const mortgage = calculateLoanSummary(loanAmount, input.annualRatePercent, 30);
  const monthlyOwnershipCosts =
    mortgage.monthlyPayment + input.annualPropertyTax / 12 + input.monthlyInsurance + (input.homePrice * (input.maintenancePercent / 100)) / 12;
  const totalBuyingCashOutflow = input.downPayment + monthlyOwnershipCosts * months;
  const estimatedHomeValue = input.homePrice * (1 + input.appreciationPercent / 100) ** input.years;
  const remainingLoanBalance = loanBalanceAfterPayments(loanAmount, input.annualRatePercent, 30, months);
  const estimatedSaleProceeds = estimatedHomeValue * (1 - input.sellingCostPercent / 100) - remainingLoanBalance;
  const netBuyingCost = totalBuyingCashOutflow - estimatedSaleProceeds;

  return {
    totalRentCost,
    totalBuyingCashOutflow,
    estimatedHomeValue,
    remainingLoanBalance,
    estimatedSaleProceeds,
    netBuyingCost,
    buyMinusRent: netBuyingCost - totalRentCost,
  };
}

export function calculatePaybackPeriod(input: {
  initialCost: number;
  annualCashFlow: number;
  horizonYears?: number;
}): PaybackPeriodResult {
  assertPositiveNumber(input.initialCost, 'Initial cost');
  assertPositiveNumber(input.annualCashFlow, 'Annual cash flow');
  assertNonNegativeNumber(input.horizonYears ?? 0, 'Horizon years');

  const paybackYears = input.initialCost / input.annualCashFlow;

  return {
    initialCost: input.initialCost,
    annualCashFlow: input.annualCashFlow,
    paybackYears,
    netProfitAfterHorizon: input.annualCashFlow * (input.horizonYears ?? 0) - input.initialCost,
  };
}

export function calculatePresentValue(input: {
  futureValue?: number;
  payment?: number;
  annualRatePercent: number;
  years: number;
  paymentsPerYear?: number;
}): PresentValueResult {
  assertNonNegativeNumber(input.futureValue ?? 0, 'Future value');
  assertNonNegativeNumber(input.payment ?? 0, 'Payment');
  assertPercentGreaterThanNegativeHundred(input.annualRatePercent, 'Discount rate');
  assertNonNegativeNumber(input.years, 'Years');
  assertPositiveNumber(input.paymentsPerYear ?? 12, 'Payments per year');

  const paymentsPerYear = input.paymentsPerYear ?? 12;
  const periods = Math.round(input.years * paymentsPerYear);
  const periodicRate = input.annualRatePercent / 100 / paymentsPerYear;
  const lumpSumPresentValue = (input.futureValue ?? 0) / (1 + periodicRate) ** periods;
  const annuityPresentValue =
    periodicRate === 0 ? (input.payment ?? 0) * periods : (input.payment ?? 0) * ((1 - (1 + periodicRate) ** -periods) / periodicRate);

  return {
    presentValue: lumpSumPresentValue + annuityPresentValue,
    lumpSumPresentValue,
    annuityPresentValue,
  };
}

export function calculateFutureValue(input: {
  principal?: number;
  payment?: number;
  annualRatePercent: number;
  years: number;
  paymentsPerYear?: number;
}): FutureValueResult {
  assertNonNegativeNumber(input.principal ?? 0, 'Principal');
  assertNonNegativeNumber(input.payment ?? 0, 'Payment');
  assertPercentGreaterThanNegativeHundred(input.annualRatePercent, 'Interest rate');
  assertNonNegativeNumber(input.years, 'Years');
  assertPositiveNumber(input.paymentsPerYear ?? 12, 'Payments per year');

  const paymentsPerYear = input.paymentsPerYear ?? 12;
  const periods = Math.round(input.years * paymentsPerYear);
  const periodicRate = input.annualRatePercent / 100 / paymentsPerYear;
  const principalFutureValue = (input.principal ?? 0) * (1 + periodicRate) ** periods;
  const contributionFutureValue =
    periodicRate === 0 ? (input.payment ?? 0) * periods : (input.payment ?? 0) * (((1 + periodicRate) ** periods - 1) / periodicRate);

  return {
    futureValue: principalFutureValue + contributionFutureValue,
    principalFutureValue,
    contributionFutureValue,
    totalContributions: (input.principal ?? 0) + (input.payment ?? 0) * periods,
  };
}

export function calculateCommission(input: {
  salesAmount: number;
  commissionPercent: number;
  splitPercent?: number;
  basePay?: number;
  bonus?: number;
}): CommissionResult {
  assertNonNegativeNumber(input.salesAmount, 'Sales amount');
  assertPercentRange(input.commissionPercent, 'Commission percent', 100);
  assertPercentRange(input.splitPercent ?? 100, 'Split percent', 100);
  assertNonNegativeNumber(input.basePay ?? 0, 'Base pay');
  assertNonNegativeNumber(input.bonus ?? 0, 'Bonus');

  const commission = input.salesAmount * (input.commissionPercent / 100);
  const splitAmount = commission * ((input.splitPercent ?? 100) / 100);

  return {
    salesAmount: input.salesAmount,
    commission,
    splitAmount,
    totalPay: splitAmount + (input.basePay ?? 0) + (input.bonus ?? 0),
  };
}

export function calculateUkMortgage(input: {
  propertyPrice: number;
  deposit: number;
  annualRatePercent: number;
  years: number;
  monthlyFees?: number;
}): LocalMortgageResult {
  assertPositiveNumber(input.propertyPrice, 'Property price');
  assertNonNegativeNumber(input.deposit, 'Deposit');
  assertNonNegativeNumber(input.monthlyFees ?? 0, 'Monthly fees');

  if (input.deposit >= input.propertyPrice) {
    throw new Error('Deposit must be less than property price');
  }

  const loanAmount = input.propertyPrice - input.deposit;
  const loan = calculateLoanSummary(loanAmount, input.annualRatePercent, input.years);

  return {
    ...loan,
    propertyPrice: input.propertyPrice,
    deposit: input.deposit,
    loanAmount,
    loanToValuePercent: (loanAmount / input.propertyPrice) * 100,
    monthlyFees: input.monthlyFees ?? 0,
    totalMonthlyPayment: loan.monthlyPayment + (input.monthlyFees ?? 0),
  };
}

export function calculateCanadianMortgage(input: {
  propertyPrice: number;
  downPayment: number;
  annualRatePercent: number;
  years: number;
  paymentsPerYear?: number;
}): LocalMortgageResult {
  assertPositiveNumber(input.propertyPrice, 'Property price');
  assertNonNegativeNumber(input.downPayment, 'Down payment');
  assertNonNegativeNumber(input.annualRatePercent, 'Interest rate');
  assertPositiveNumber(input.years, 'Amortization');
  assertPositiveNumber(input.paymentsPerYear ?? 12, 'Payments per year');

  if (input.downPayment >= input.propertyPrice) {
    throw new Error('Down payment must be less than property price');
  }

  const paymentsPerYear = input.paymentsPerYear ?? 12;
  const loanAmount = input.propertyPrice - input.downPayment;
  const effectiveAnnualRate = (1 + input.annualRatePercent / 100 / 2) ** 2 - 1;
  const periodicRate = (1 + effectiveAnnualRate) ** (1 / paymentsPerYear) - 1;
  const paymentCount = Math.round(input.years * paymentsPerYear);
  const payment = calculatePaymentForMonthlyRate(loanAmount, periodicRate, paymentCount);
  const totalPaid = payment * paymentCount;

  return {
    principal: loanAmount,
    annualRatePercent: input.annualRatePercent,
    years: input.years,
    paymentCount,
    monthlyPayment: payment,
    totalPaid,
    totalInterest: totalPaid - loanAmount,
    propertyPrice: input.propertyPrice,
    deposit: input.downPayment,
    loanAmount,
    loanToValuePercent: (loanAmount / input.propertyPrice) * 100,
    monthlyFees: 0,
    totalMonthlyPayment: payment,
  };
}

export interface AgeCalculationResult {
  birthDate: string;
  asOfDate: string;
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalMonths: number;
  nextBirthday: string;
  daysUntilNextBirthday: number;
}

export interface DateDifferenceResult {
  startDate: string;
  endDate: string;
  direction: 'forward' | 'backward' | 'same-day';
  days: number;
  weeks: number;
  remainingDays: number;
  calendarYears: number;
  calendarMonths: number;
  calendarDays: number;
}

export interface DateShiftResult {
  startDate: string;
  resultDate: string;
  years: number;
  months: number;
  weeks: number;
  days: number;
  direction: 'add' | 'subtract';
}

export interface TimeDuration {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

export interface HoursWorkedResult {
  startTime: string;
  endTime: string;
  breakMinutes: number;
  crossedMidnight: boolean;
  totalHours: number;
  decimalHours: number;
  grossPay: number | null;
}

export interface GpaCourseInput {
  name?: string;
  credits: number;
  grade: string;
}

export interface GpaCourseResult extends GpaCourseInput {
  gradePoints: number;
  qualityPoints: number;
}

export interface GpaResult {
  courses: GpaCourseResult[];
  totalCredits: number;
  totalQualityPoints: number;
  gpa: number;
}

export interface GradeNeededResult {
  currentGradePercent: number;
  finalWeightPercent: number;
  desiredGradePercent: number;
  neededFinalPercent: number;
  possibleWithoutExtraCredit: boolean;
}

export interface ConcreteResult {
  lengthFeet: number;
  widthFeet: number;
  depthInches: number;
  wastePercent: number;
  cubicFeet: number;
  cubicYards: number;
  cubicMeters: number;
  bags40lb: number;
  bags60lb: number;
  bags80lb: number;
}

export interface SubnetResult {
  ipAddress: string;
  prefixLength: number;
  subnetMask: string;
  wildcardMask: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableAddress: string;
  lastUsableAddress: string;
  totalAddresses: number;
  usableAddresses: number;
}

export interface PasswordGeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  avoidAmbiguous: boolean;
}

export interface GeneratedPasswordResult {
  password: string;
  length: number;
  characterPoolSize: number;
  estimatedEntropyBits: number;
}

export type ConversionCategory = 'length' | 'mass' | 'volume' | 'temperature';

export interface ConversionResult {
  category: ConversionCategory;
  input: number;
  fromUnit: string;
  toUnit: string;
  result: number;
}

export interface DiceRollResult {
  diceCount: number;
  sides: number;
  modifier: number;
  rolls: number[];
  subtotal: number;
  total: number;
}

export interface FuelCostResult {
  oneWayDistanceMiles: number;
  totalDistanceMiles: number;
  milesPerGallon: number;
  pricePerGallon: number;
  gallonsNeeded: number;
  fuelCost: number;
  costPerMile: number;
  roundTrip: boolean;
}

export interface SquareFootageResult {
  lengthFeet: number;
  widthFeet: number;
  quantity: number;
  squareFeetEach: number;
  totalSquareFeet: number;
  totalSquareYards: number;
  totalSquareMeters: number;
}

export interface GasMileageResult {
  milesDriven: number;
  gallonsUsed: number;
  milesPerGallon: number;
  gallonsPer100Miles: number;
  litersPer100Km: number;
}

export interface TipResult {
  subtotal: number;
  tipPercent: number;
  taxPercent: number;
  people: number;
  tipAmount: number;
  taxAmount: number;
  total: number;
  perPerson: number;
}

export interface MileageCostResult {
  miles: number;
  ratePerMile: number;
  extraCosts: number;
  mileageAmount: number;
  total: number;
}

export interface DensityResult {
  mass: number;
  volume: number;
  density: number;
}

export interface MassFromDensityResult {
  density: number;
  volume: number;
  mass: number;
}

export interface WeightForceResult {
  massKg: number;
  gravityMps2: number;
  weightNewtons: number;
  weightPoundsForce: number;
  massPounds: number;
}

export interface SpeedResult {
  distanceMiles: number;
  totalSeconds: number;
  hours: number;
  milesPerHour: number;
  kilometersPerHour: number;
  metersPerSecond: number;
}

export interface DayOfWeekResult {
  date: string;
  weekday: string;
  weekdayIndex: number;
  isoWeekday: number;
}

export interface TimeZoneComparisonResult {
  utcDateTime: string;
  timeZone: string;
  localDate: string;
  localTime: string;
  offsetMinutes: number;
  offsetLabel: string;
}

export interface TimeCardDayInput {
  label: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
}

export interface TimeCardDayResult extends TimeCardDayInput {
  decimalHours: number;
  crossedMidnight: boolean;
}

export interface TimeCardResult {
  days: TimeCardDayResult[];
  totalHours: number;
  hourlyRate: number | null;
  grossPay: number | null;
}

export interface HeightEstimateResult {
  childSex: 'male' | 'female';
  motherHeightInches: number;
  fatherHeightInches: number;
  estimatedAdultHeightInches: number;
  lowRangeInches: number;
  highRangeInches: number;
  estimatedAdultHeightCm: number;
}

export interface BraSizeResult {
  underbustInches: number;
  bustInches: number;
  bandSize: number;
  cupSize: string;
  sizeLabel: string;
  differenceInches: number;
}

export interface VoltageDropResult {
  sourceVoltage: number;
  currentAmps: number;
  oneWayLengthFeet: number;
  resistanceOhmsPer1000Feet: number;
  phase: 'single' | 'three';
  voltageDrop: number;
  percentDrop: number;
  loadVoltage: number;
}

export type ElectricalPowerPhase = 'dc' | 'single-phase' | 'three-phase';

export interface WattsToAmpsResult {
  watts: number;
  volts: number;
  phase: ElectricalPowerPhase;
  powerFactor: number;
  phaseFactor: number;
  amps: number;
}

export interface AmpsToWattsResult {
  amps: number;
  volts: number;
  phase: ElectricalPowerPhase;
  powerFactor: number;
  phaseFactor: number;
  watts: number;
  kilowatts: number;
}

export interface KilowattsToAmpsResult {
  kilowatts: number;
  volts: number;
  phase: ElectricalPowerPhase;
  powerFactor: number;
  efficiencyPercent: number;
  inputWatts: number;
  phaseFactor: number;
  amps: number;
}

export interface KilovoltAmpsToAmpsResult {
  kilovoltAmps: number;
  volts: number;
  phase: Extract<ElectricalPowerPhase, 'single-phase' | 'three-phase'>;
  phaseFactor: number;
  amps: number;
}

export interface AmpHoursToWattHoursResult {
  ampHours: number;
  volts: number;
  wattHours: number;
  kilowattHours: number;
}

export interface WattHoursToAmpHoursResult {
  wattHours: number;
  volts: number;
  ampHours: number;
}

export interface WireResistanceEstimateResult {
  wireGauge: string;
  oneWayLengthFeet: number;
  conductorCount: number;
  resistanceOhmsPer1000Feet: number;
  oneWayResistanceOhms: number;
  totalResistanceOhms: number;
}

export interface WireSizeEstimateResult {
  sourceVoltage: number;
  currentAmps: number;
  oneWayLengthFeet: number;
  maxVoltageDropPercent: number;
  phase: 'single' | 'three';
  recommendedWireGauge: string;
  resistanceOhmsPer1000Feet: number;
  voltageDrop: number;
  percentDrop: number;
  loadVoltage: number;
}

export interface BtuEstimateResult {
  squareFeet: number;
  ceilingHeightFeet: number;
  baseBtu: number;
  adjustedBtu: number;
  recommendedBtu: number;
}

export interface StairLayoutResult {
  totalRiseInches: number;
  riserCount: number;
  treadCount: number;
  actualRiserInches: number;
  treadDepthInches: number;
  totalRunInches: number;
  stairAngleDegrees: number;
}

export interface ResistorColorResult {
  band1: string;
  band2: string;
  multiplier: string;
  tolerance: string;
  resistanceOhms: number;
  tolerancePercent: number;
}

export interface OhmsLawResult {
  voltage: number;
  current: number;
  resistance: number;
  power: number;
}

export interface ElectricityCostResult {
  watts: number;
  hoursPerDay: number;
  days: number;
  ratePerKwh: number;
  kilowattHours: number;
  cost: number;
}

export interface ShoeSizeResult {
  footLengthCm: number;
  footLengthInches: number;
  usMen: number;
  usWomen: number;
  ukAdult: number;
  euAdult: number;
}

export interface MolarityResult {
  moles: number;
  volumeLiters: number;
  molarity: number;
  grams?: number;
  molarMass?: number;
}

export interface MolecularWeightResult {
  formula: string;
  molarMass: number;
  atomCount: number;
  composition: Array<{ element: string; count: number; mass: number; percent: number }>;
}

export interface SleepScheduleResult {
  mode: 'wake-up' | 'bedtime';
  inputTime: string;
  fallAsleepMinutes: number;
  cycles: number;
  targetTime: string;
  sleepDurationMinutes: number;
}

export interface TireSizeResult {
  widthMm: number;
  aspectRatio: number;
  wheelDiameterInches: number;
  sidewallInches: number;
  tireDiameterInches: number;
  circumferenceInches: number;
  revolutionsPerMile: number;
}

export interface RoofingEstimateResult {
  footprintSquareFeet: number;
  pitchRisePer12: number;
  pitchFactor: number;
  roofSquareFeet: number;
  wastePercent: number;
  roofSquares: number;
  shingleBundles: number;
  lowSlopeWarning?: string;
}

export interface TileEstimateResult {
  areaSquareFeet: number;
  tileLengthInches: number;
  tileWidthInches: number;
  wastePercent: number;
  tileAreaSquareFeet: number;
  tilesNeeded: number;
}

export interface MulchEstimateResult {
  areaSquareFeet: number;
  depthInches: number;
  wastePercent: number;
  cubicFeet: number;
  cubicYards: number;
  twoCubicFootBags: number;
}

export interface GravelEstimateResult {
  lengthFeet: number;
  widthFeet: number;
  depthInches: number;
  tonsPerCubicYard: number;
  cubicFeet: number;
  cubicYards: number;
  tons: number;
}

export interface PaintEstimateResult {
  lengthFeet: number;
  widthFeet: number;
  wallHeightFeet: number;
  doors: number;
  windows: number;
  coats: number;
  coverageSquareFeetPerGallon: number;
  wastePercent: number;
  wallSquareFeet: number;
  openingSquareFeet: number;
  paintableSquareFeet: number;
  adjustedSquareFeet: number;
  gallonsNeeded: number;
  gallonsToBuy: number;
}

export interface DrywallEstimateResult {
  areaSquareFeet: number;
  sheetLengthFeet: number;
  sheetWidthFeet: number;
  wastePercent: number;
  sheetAreaSquareFeet: number;
  adjustedAreaSquareFeet: number;
  sheetsNeeded: number;
}

export interface CarpetEstimateResult {
  lengthFeet: number;
  widthFeet: number;
  rollWidthFeet: number;
  wastePercent: number;
  areaSquareFeet: number;
  adjustedAreaSquareFeet: number;
  squareYards: number;
  linearFeet: number;
}

export interface FlooringEstimateResult {
  areaSquareFeet: number;
  wastePercent: number;
  boxCoverageSquareFeet: number;
  pricePerBox: number | null;
  adjustedAreaSquareFeet: number;
  boxesNeeded: number;
  totalCoverageSquareFeet: number;
  estimatedCost: number | null;
}

export interface WallpaperEstimateResult {
  roomLengthFeet: number;
  roomWidthFeet: number;
  wallHeightFeet: number;
  doors: number;
  windows: number;
  rollCoverageSquareFeet: number;
  wastePercent: number;
  pricePerRoll: number | null;
  wallSquareFeet: number;
  openingSquareFeet: number;
  wallpaperSquareFeet: number;
  adjustedSquareFeet: number;
  rollsNeeded: number;
  estimatedCost: number | null;
}

export interface FenceEstimateResult {
  perimeterFeet: number;
  panelWidthFeet: number;
  postSpacingFeet: number;
  gateCount: number;
  gateWidthFeet: number;
  fenceRunFeet: number;
  panelsNeeded: number;
  linePosts: number;
  gatePosts: number;
  totalPosts: number;
}

export interface DeckCostEstimateResult {
  lengthFeet: number;
  widthFeet: number;
  wastePercent: number;
  deckCostPerSquareFoot: number;
  railingLinearFeet: number;
  railingCostPerFoot: number;
  stairsCost: number;
  deckAreaSquareFeet: number;
  adjustedDeckAreaSquareFeet: number;
  surfaceCost: number;
  railingCost: number;
  totalCost: number;
}

export interface DeckBoardEstimateResult {
  deckLengthFeet: number;
  deckWidthFeet: number;
  boardLengthFeet: number;
  boardWidthInches: number;
  joistSpacingInches: number;
  wastePercent: number;
  pricePerBoard: number | null;
  deckAreaSquareFeet: number;
  adjustedDeckAreaSquareFeet: number;
  boardCoverageSquareFeet: number;
  boardsNeeded: number;
  joistCount: number;
  hiddenFasteners: number;
  deckScrews: number;
  estimatedCost: number | null;
}

export interface DeckStainEstimateResult {
  deckLengthFeet: number;
  deckWidthFeet: number;
  railingLengthFeet: number;
  railingHeightFeet: number;
  stepCount: number;
  stepWidthFeet: number;
  stepDepthInches: number;
  riserHeightInches: number;
  coats: number;
  coverageSquareFeetPerGallon: number;
  wastePercent: number;
  pricePerGallon: number | null;
  deckSurfaceSquareFeet: number;
  railingSquareFeet: number;
  stepsSquareFeet: number;
  totalSurfaceSquareFeet: number;
  adjustedSurfaceSquareFeet: number;
  coatAdjustedSquareFeet: number;
  gallonsNeeded: number;
  gallonsToBuy: number;
  estimatedCost: number | null;
}

export interface BalusterEstimateResult {
  railLengthFeet: number;
  postWidthInches: number;
  postCount: number;
  balusterWidthInches: number;
  maxSpacingInches: number;
  openingLengthInches: number;
  balustersNeeded: number;
  totalBalusterWidthInches: number;
  actualSpacingInches: number;
}

export interface PaverEstimateResult {
  areaSquareFeet: number;
  paverLengthInches: number;
  paverWidthInches: number;
  wastePercent: number;
  paverAreaSquareFeet: number;
  adjustedAreaSquareFeet: number;
  paversNeeded: number;
}

export interface PaverBaseEstimateResult {
  areaSquareFeet: number;
  baseDepthInches: number;
  beddingDepthInches: number;
  wastePercent: number;
  baseTonsPerCubicYard: number;
  baseCubicFeet: number;
  baseCubicYards: number;
  baseTons: number;
  beddingCubicFeet: number;
  beddingCubicYards: number;
}

export interface PolymericSandEstimateResult {
  areaSquareFeet: number;
  paverLengthInches: number;
  paverWidthInches: number;
  jointWidthInches: number;
  jointDepthInches: number;
  wastePercent: number;
  bagCoverageCubicFeet: number;
  paverAreaSquareFeet: number;
  estimatedPavers: number;
  rawCubicFeet: number;
  cubicFeet: number;
  bagsNeeded: number;
}

export interface GrassSeedEstimateResult {
  lawnAreaSquareFeet: number;
  seedRatePoundsPer1000SquareFeet: number;
  wastePercent: number;
  bagWeightPounds: number;
  pricePerBag: number | null;
  adjustedAreaSquareFeet: number;
  seedPounds: number;
  bagsNeeded: number;
  estimatedCost: number | null;
}

export interface LawnMowingTimeResult {
  lawnAreaSquareFeet: number;
  mowerWidthInches: number;
  speedMph: number;
  efficiencyPercent: number;
  effectiveWidthFeet: number;
  squareFeetPerHour: number;
  hours: number;
  minutes: number;
  acres: number;
}

export type PlantSpacingPattern = 'square' | 'triangular';

export interface PlantSpacingEstimateResult {
  bedLengthFeet: number;
  bedWidthFeet: number;
  spacingInches: number;
  pattern: PlantSpacingPattern;
  areaSquareFeet: number;
  columns: number;
  rows: number;
  rowSpacingInches: number;
  plantsNeeded: number;
}

export interface SidingEstimateResult {
  wallAreaSquareFeet: number;
  openingsSquareFeet: number;
  wastePercent: number;
  pricePerSquare: number | null;
  netAreaSquareFeet: number;
  adjustedAreaSquareFeet: number;
  squaresNeeded: number;
  estimatedCost: number | null;
}

export interface BrickEstimateResult {
  wallAreaSquareFeet: number;
  brickLengthInches: number;
  brickHeightInches: number;
  mortarJointInches: number;
  wastePercent: number;
  brickFaceSquareFeet: number;
  adjustedAreaSquareFeet: number;
  bricksNeeded: number;
}

export interface ConcreteBlockEstimateResult {
  wallLengthFeet: number;
  wallHeightFeet: number;
  blockLengthInches: number;
  blockHeightInches: number;
  openingsSquareFeet: number;
  wastePercent: number;
  blockFaceSquareFeet: number;
  netWallAreaSquareFeet: number;
  adjustedAreaSquareFeet: number;
  blocksNeeded: number;
  courses: number;
  blocksPerCourse: number;
}

export interface RebarGridEstimateResult {
  slabLengthFeet: number;
  slabWidthFeet: number;
  spacingInches: number;
  barLengthFeet: number;
  wastePercent: number;
  lengthwiseBars: number;
  widthwiseBars: number;
  rawLinearFeet: number;
  adjustedLinearFeet: number;
  barsToBuy: number;
}

export interface ConcreteMixEstimateResult {
  cubicYards: number;
  cementParts: number;
  sandParts: number;
  gravelParts: number;
  cementBagCubicFeet: number;
  wastePercent: number;
  rawCubicFeet: number;
  adjustedCubicFeet: number;
  adjustedCubicYards: number;
  cementCubicFeet: number;
  sandCubicFeet: number;
  gravelCubicFeet: number;
  cementBags: number;
}

export interface ConcreteDrivewayEstimateResult {
  lengthFeet: number;
  widthFeet: number;
  depthInches: number;
  wastePercent: number;
  pricePerCubicYard: number | null;
  cubicFeet: number;
  cubicYards: number;
  sixtyPoundBags: number;
  eightyPoundBags: number;
  estimatedCost: number | null;
}

export interface ConcreteStepsEstimateResult {
  stepCount: number;
  widthFeet: number;
  riserHeightInches: number;
  treadDepthInches: number;
  landingDepthFeet: number;
  wastePercent: number;
  stairCubicFeet: number;
  landingCubicFeet: number;
  cubicFeet: number;
  cubicYards: number;
  sixtyPoundBags: number;
  eightyPoundBags: number;
}

export interface ConcreteWeightEstimateResult {
  cubicYards: number;
  densityPoundsPerCubicFoot: number;
  wastePercent: number;
  cubicFeet: number;
  totalPounds: number;
  totalTons: number;
}

export interface ConcreteReinforcingMeshEstimateResult {
  slabLengthFeet: number;
  slabWidthFeet: number;
  sheetLengthFeet: number;
  sheetWidthFeet: number;
  overlapInches: number;
  wastePercent: number;
  slabAreaSquareFeet: number;
  adjustedAreaSquareFeet: number;
  effectiveSheetAreaSquareFeet: number;
  sheetsNeeded: number;
}

export interface ConcreteBlockFillEstimateResult {
  blockCount: number;
  fillCubicFeetPerBlock: number;
  wastePercent: number;
  cubicFeet: number;
  cubicYards: number;
  sixtyPoundBags: number;
  eightyPoundBags: number;
}

export interface RetainingWallEstimateResult {
  wallLengthFeet: number;
  wallHeightFeet: number;
  blockLengthInches: number;
  blockHeightInches: number;
  capLengthInches: number;
  baseDepthInches: number;
  baseWidthInches: number;
  wastePercent: number;
  courses: number;
  blocksPerCourse: number;
  wallBlocks: number;
  capBlocks: number;
  baseCubicFeet: number;
  baseCubicYards: number;
}

export type RebarSize = '#3' | '#4' | '#5' | '#6' | '#7' | '#8';

export interface RebarWeightEstimateResult {
  rebarSize: RebarSize;
  lengthFeet: number;
  quantity: number;
  wastePercent: number;
  weightPerFootPounds: number;
  adjustedLengthFeet: number;
  totalPounds: number;
  totalTons: number;
}

export interface ConcreteFootingEstimateResult {
  lengthFeet: number;
  widthInches: number;
  depthInches: number;
  wastePercent: number;
  cubicFeet: number;
  cubicYards: number;
  sixtyPoundBags: number;
  eightyPoundBags: number;
}

export interface ConcreteColumnEstimateResult {
  diameterInches: number;
  heightFeet: number;
  quantity: number;
  wastePercent: number;
  cubicFeet: number;
  cubicYards: number;
  sixtyPoundBags: number;
  eightyPoundBags: number;
}

export interface PostHoleConcreteEstimateResult {
  holeDiameterInches: number;
  holeDepthInches: number;
  postDiameterInches: number;
  quantity: number;
  wastePercent: number;
  netConcretePerHoleCubicFeet: number;
  cubicFeet: number;
  cubicYards: number;
  sixtyPoundBags: number;
  eightyPoundBags: number;
}

export interface PlywoodEstimateResult {
  areaSquareFeet: number;
  sheetWidthFeet: number;
  sheetLengthFeet: number;
  wastePercent: number;
  pricePerSheet: number | null;
  sheetAreaSquareFeet: number;
  adjustedAreaSquareFeet: number;
  sheetsNeeded: number;
  totalCoverageSquareFeet: number;
  estimatedCost: number | null;
}

export interface InsulationEstimateResult {
  areaSquareFeet: number;
  openingsSquareFeet: number;
  coveragePerPackSquareFeet: number;
  wastePercent: number;
  pricePerPack: number | null;
  netAreaSquareFeet: number;
  adjustedAreaSquareFeet: number;
  packsNeeded: number;
  totalCoverageSquareFeet: number;
  estimatedCost: number | null;
}

export interface CountertopEstimateResult {
  lengthFeet: number;
  depthInches: number;
  backsplashLengthFeet: number;
  backsplashHeightInches: number;
  cutoutSquareFeet: number;
  wastePercent: number;
  pricePerSquareFoot: number | null;
  topAreaSquareFeet: number;
  backsplashAreaSquareFeet: number;
  netAreaSquareFeet: number;
  adjustedAreaSquareFeet: number;
  estimatedCost: number | null;
}

export interface SodEstimateResult {
  lawnAreaSquareFeet: number;
  rollCoverageSquareFeet: number;
  rollsPerPallet: number;
  wastePercent: number;
  pricePerRoll: number | null;
  adjustedAreaSquareFeet: number;
  rollsNeeded: number;
  palletsNeeded: number;
  estimatedCost: number | null;
}

export interface WallStudEstimateResult {
  wallLengthFeet: number;
  wallHeightFeet: number;
  spacingInches: number;
  openingsCount: number;
  extraCornerStuds: number;
  plates: number;
  boardLengthFeet: number;
  wastePercent: number;
  layoutStuds: number;
  verticalStuds: number;
  verticalStudsWithWaste: number;
  platePieces: number;
  totalPieces: number;
  estimatedLinearFeet: number;
  estimatedLinearFeetWithWaste: number;
}

export interface BoardFootResult {
  thicknessInches: number;
  widthInches: number;
  lengthFeet: number;
  quantity: number;
  boardFeetEach: number;
  totalBoardFeet: number;
}

export interface CubicYardEstimateResult {
  lengthFeet: number;
  widthFeet: number;
  depthInches: number;
  wastePercent: number;
  cubicFeet: number;
  cubicYards: number;
}

export type PoolShape = 'rectangle' | 'round' | 'oval';

export interface PoolVolumeResult {
  shape: PoolShape;
  lengthFeet: number;
  widthFeet: number;
  averageDepthFeet: number;
  surfaceFactor: number;
  cubicFeet: number;
  gallons: number;
}

export interface BulkMaterialEstimateResult {
  lengthFeet: number;
  widthFeet: number;
  depthInches: number;
  tonsPerCubicYard: number;
  wastePercent: number;
  cubicFeet: number;
  cubicYards: number;
  tons: number;
}

export interface SoilEstimateResult {
  areaSquareFeet: number;
  depthInches: number;
  wastePercent: number;
  cubicFeet: number;
  cubicYards: number;
  oneAndHalfCubicFootBags: number;
  twoCubicFootBags: number;
}

export interface WeatherFeelsLikeResult {
  temperatureFahrenheit: number;
  relativeHumidity?: number;
  windSpeedMph?: number;
  resultFahrenheit: number;
  resultCelsius: number;
}

export interface BandwidthTimeResult {
  dataAmount: number;
  dataUnit: string;
  speedAmount: number;
  speedUnit: string;
  seconds: number;
  minutes: number;
  hours: number;
}

export interface AiTokenCostResult {
  inputTokensPerRequest: number;
  cachedInputTokensPerRequest: number;
  uncachedInputTokensPerRequest: number;
  outputTokensPerRequest: number;
  requests: number;
  inputPricePerMillion: number;
  cachedInputPricePerMillion: number;
  outputPricePerMillion: number;
  totalInputTokens: number;
  totalCachedInputTokens: number;
  totalUncachedInputTokens: number;
  totalOutputTokens: number;
  inputCost: number;
  cachedInputCost: number;
  uncachedInputCost: number;
  outputCost: number;
  cacheSavings: number;
  totalCost: number;
  costPerRequest: number;
  costPerThousandRequests: number;
  requestsForOneHundredDollars: number | null;
}

export interface PromptTokenEstimateResult {
  text: string;
  characters: number;
  words: number;
  estimatedTokens: number;
  lowEstimate: number;
  highEstimate: number;
  averageCharactersPerToken: number;
}

export interface ApiPricingResult {
  requests: number;
  unitsPerRequest: number;
  pricePerUnit: number;
  platformFee: number;
  retryPercent: number;
  billableUnits: number;
  usageCost: number;
  totalCost: number;
  averageCostPerRequest: number;
}

export interface DownloadTimeResult {
  fileSize: number;
  fileUnit: string;
  speedMbps: number;
  efficiencyPercent: number;
  seconds: number;
  minutes: number;
  hours: number;
  effectiveMbps: number;
}

export interface InternetSpeedNeedsResult {
  videoStreams: number;
  videoMbpsEach: number;
  gamingDevices: number;
  gamingMbpsEach: number;
  videoCalls: number;
  callMbpsEach: number;
  smartDevices: number;
  smartDeviceMbpsEach: number;
  bufferPercent: number;
  baseMbps: number;
  recommendedMbps: number;
}

export interface StreamingBitrateResult {
  bitrate: number;
  bitrateUnit: string;
  hours: number;
  minutes: number;
  streams: number;
  totalSeconds: number;
  megabits: number;
  gigabytes: number;
  megabytes: number;
}

export interface DeviceBatteryLifeResult {
  capacityMah: number;
  voltage: number;
  powerWatts: number;
  efficiencyPercent: number;
  wattHours: number;
  usableWattHours: number;
  runtimeHours: number;
  runtimeMinutes: number;
}

export interface MonitorPpiResult {
  widthPixels: number;
  heightPixels: number;
  diagonalInches: number;
  diagonalPixels: number;
  ppi: number;
  aspectWidth: number;
  aspectHeight: number;
  aspectLabel: string;
}

export interface RecipeScaleResult {
  ingredientName: string;
  amount: number;
  unit: string;
  originalServings: number;
  desiredServings: number;
  scaleFactor: number;
  scaledAmount: number;
}

export interface CookingMeasurementConversionResult {
  amount: number;
  fromUnit: string;
  toUnit: string;
  densityGramsPerCup: number;
  convertedAmount: number;
  inputKind: 'volume' | 'mass';
  outputKind: 'volume' | 'mass';
  note: string;
}

export interface IngredientCostResult {
  amountNeeded: number;
  neededUnit: string;
  packageAmount: number;
  packageUnit: string;
  packagePrice: number;
  densityGramsPerCup: number;
  packageAmountInNeededUnit: number;
  unitCost: number;
  recipeCost: number;
}

export interface UnitPriceComparisonResult {
  itemAName: string;
  itemBName: string;
  itemAPrice: number;
  itemBPrice: number;
  itemAQuantity: number;
  itemBQuantity: number;
  unit: string;
  itemAUnitPrice: number;
  itemBUnitPrice: number;
  cheaperName: string;
  savingsPerUnit: number;
  savingsPercent: number;
}

export interface CostPerServingResult {
  foodName: string;
  totalCost: number;
  extraCost: number;
  servings: number;
  totalBatchCost: number;
  costPerServing: number;
}

export interface OvenTemperatureResult {
  inputTemperature: number;
  inputUnit: string;
  fahrenheit: number;
  celsius: number;
  fanCelsius: number;
  fanFahrenheit: number;
  nearestGasMark: string;
  nearestGasMarkFahrenheit: number;
}

export interface ButterConversionResult {
  amount: number;
  unit: string;
  teaspoons: number;
  tablespoons: number;
  cups: number;
  sticks: number;
  ounces: number;
  grams: number;
  pounds: number;
}

export interface BakingPanConversionResult {
  oldLengthInches: number;
  oldWidthInches: number;
  newLengthInches: number;
  newWidthInches: number;
  originalServings: number | null;
  oldAreaSquareInches: number;
  newAreaSquareInches: number;
  scaleFactor: number;
  scaledServings: number | null;
}

export interface GdpEstimateResult {
  consumption: number;
  investment: number;
  governmentSpending: number;
  exports: number;
  imports: number;
  netExports: number;
  gdp: number;
  population: number | null;
  gdpPerPerson: number | null;
}

export type HorsepowerUnit = 'horsepower' | 'watt' | 'kilowatt' | 'metric-horsepower';

export interface HorsepowerConversionResult {
  inputPower: number;
  inputUnit: HorsepowerUnit;
  watts: number;
  kilowatts: number;
  mechanicalHorsepower: number;
  metricHorsepower: number;
}

export interface EngineHorsepowerResult {
  torquePoundFeet: number;
  rpm: number;
  drivetrainLossPercent: number;
  engineHorsepower: number;
  wheelHorsepower: number;
  kilowatts: number;
}

export interface GolfScoreDifferentialResult {
  adjustedGrossScore: number;
  courseRating: number;
  slopeRating: number;
  playingConditionsAdjustment: number;
  rawDifferential: number;
  scoreDifferential: number;
}

export interface GolfCourseHandicapResult {
  handicapIndex: number;
  slopeRating: number;
  courseRating: number;
  par: number;
  allowancePercent: number;
  rawCourseHandicap: number;
  courseHandicap: number;
  playingHandicap: number;
}

export interface TextAnalysisResult {
  text: string;
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  bytesUtf8: number;
  estimatedReadingMinutes: number;
}

export type TextCaseMode = 'uppercase' | 'lowercase' | 'title' | 'sentence' | 'camel' | 'pascal' | 'snake' | 'kebab';

export interface TextCaseResult {
  input: string;
  mode: TextCaseMode;
  output: string;
  changedCharacters: number;
}

export interface SlugResult {
  input: string;
  slug: string;
  maxLength: number | null;
  wordCount: number;
  characterCount: number;
}

export interface JsonFormatResult {
  input: string;
  output: string;
  rootType: string;
  keyCount: number;
  byteLength: number;
}

export interface UuidBatchResult {
  uuids: string[];
  quantity: number;
  uppercase: boolean;
  hyphens: boolean;
}

export type HashAlgorithm = 'SHA-256' | 'SHA-384' | 'SHA-512';

export interface TextDigestResult {
  algorithm: HashAlgorithm;
  input: string;
  hexDigest: string;
  bytesUtf8: number;
  digestBytes: number;
}

export interface UnixTimestampFromDateResult {
  utcIso: string;
  seconds: number;
  milliseconds: number;
}

export interface UnixTimestampToDateResult {
  timestamp: number;
  unit: 'seconds' | 'milliseconds';
  utcIso: string;
  utcDate: string;
  utcTime: string;
}

export interface ColorContrastResult {
  foreground: string;
  background: string;
  foregroundRgb: [number, number, number];
  backgroundRgb: [number, number, number];
  contrastRatio: number;
  passesAaNormal: boolean;
  passesAaLarge: boolean;
  passesAaaNormal: boolean;
  passesAaaLarge: boolean;
  aaNormalSuggestion: {
    foreground: string;
    contrastRatio: number;
    direction: 'darker' | 'lighter' | 'unchanged';
  };
}

export interface AspectRatioResult {
  width: number;
  height: number;
  ratioWidth: number;
  ratioHeight: number;
  ratioLabel: string;
  decimal: number;
  scaledWidth?: number;
  scaledHeight?: number;
}

export interface UtmUrlInput {
  baseUrl: string;
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
  campaignId?: string;
}

export interface UtmUrlResult {
  baseUrl: string;
  outputUrl: string;
  parameterCount: number;
  existingParameterCount: number;
  campaignLabel: string;
}

export interface QueryStringResult {
  input: string;
  output: string;
  parameterCount: number;
  duplicateKeyCount: number;
  queryString: string;
}

export type HtmlEntityMode = 'encode' | 'decode';

export interface HtmlEntityResult {
  input: string;
  output: string;
  mode: HtmlEntityMode;
  changedCharacters: number;
  entityCount: number;
}

export interface CssClampResult {
  minSizePx: number;
  maxSizePx: number;
  minViewportPx: number;
  maxViewportPx: number;
  rootFontSizePx: number;
  slopeVw: number;
  interceptPx: number;
  css: string;
  middleSizePx: number;
}

export type MarkdownTableAlignment = 'left' | 'center' | 'right';

export interface MarkdownTableResult {
  output: string;
  columnCount: number;
  rowCount: number;
  alignment: MarkdownTableAlignment;
}

const millisecondsPerDay = 86400000;
const secondsPerHour = 3600;
const secondsPerMinute = 60;
const milesToKilometers = 1.609344;
const milesToMeters = 1609.344;
const litersPer100KmFromMpg = 235.214583;
const standardGravity = 9.80665;
const newtonsPerPoundForce = 4.4482216152605;
const poundsPerKilogram = 2.20462262185;
const millimetersPerInch = 25.4;
const wattsPerMechanicalHorsepower = 745.6999;
const wattsPerMetricHorsepower = 735.4988;
const engineHorsepowerTorqueConstant = 5252.1131;
const base64Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const concreteBagYieldsCubicFeet = {
  '40lb': 0.3,
  '60lb': 0.45,
  '80lb': 0.6,
};
const ambiguousPasswordCharacters = new Set(['0', 'O', 'o', '1', 'l', 'I', '|']);
const passwordCharacterSets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?',
};
const gradePointMap: Record<string, number> = {
  'A+': 4,
  A: 4,
  'A-': 3.7,
  'B+': 3.3,
  B: 3,
  'B-': 2.7,
  'C+': 2.3,
  C: 2,
  'C-': 1.7,
  'D+': 1.3,
  D: 1,
  'D-': 0.7,
  F: 0,
};
const conversionFactorsToBase: Record<ConversionCategory, Record<string, number>> = {
  length: {
    millimeter: 0.001,
    centimeter: 0.01,
    meter: 1,
    kilometer: 1000,
    inch: 0.0254,
    foot: 0.3048,
    yard: 0.9144,
    mile: 1609.344,
  },
  mass: {
    milligram: 0.000001,
    gram: 0.001,
    kilogram: 1,
    ounce: 0.028349523125,
    pound: 0.45359237,
    ton: 907.18474,
  },
  volume: {
    milliliter: 0.001,
    liter: 1,
    'cubic-meter': 1000,
    teaspoon: 0.00492892159375,
    tablespoon: 0.01478676478125,
    'fluid-ounce': 0.0295735295625,
    cup: 0.2365882365,
    pint: 0.473176473,
    quart: 0.946352946,
    gallon: 3.785411784,
  },
  temperature: {
    celsius: 1,
    fahrenheit: 1,
    kelvin: 1,
  },
};
const copperResistanceOhmsPer1000Feet: Record<string, number> = {
  '14': 2.525,
  '12': 1.588,
  '10': 0.999,
  '8': 0.6282,
  '6': 0.3951,
  '4': 0.2485,
  '2': 0.1563,
  '1/0': 0.0983,
  '2/0': 0.0779,
  '4/0': 0.049,
};
const copperAwgSmallToLarge = ['14', '12', '10', '8', '6', '4', '2', '1/0', '2/0', '4/0'];
const resistorDigitBands: Record<string, number> = {
  black: 0,
  brown: 1,
  red: 2,
  orange: 3,
  yellow: 4,
  green: 5,
  blue: 6,
  violet: 7,
  gray: 8,
  white: 9,
};
const resistorMultiplierBands: Record<string, number> = {
  black: 1,
  brown: 10,
  red: 100,
  orange: 1000,
  yellow: 10000,
  green: 100000,
  blue: 1000000,
  violet: 10000000,
  gray: 100000000,
  white: 1000000000,
  gold: 0.1,
  silver: 0.01,
};
const resistorToleranceBands: Record<string, number> = {
  brown: 1,
  red: 2,
  green: 0.5,
  blue: 0.25,
  violet: 0.1,
  gray: 0.05,
  gold: 5,
  silver: 10,
};
const btuCapacityTable = [
  { maxSquareFeet: 150, btu: 5000 },
  { maxSquareFeet: 250, btu: 6000 },
  { maxSquareFeet: 300, btu: 7000 },
  { maxSquareFeet: 350, btu: 8000 },
  { maxSquareFeet: 400, btu: 9000 },
  { maxSquareFeet: 450, btu: 10000 },
  { maxSquareFeet: 550, btu: 12000 },
  { maxSquareFeet: 700, btu: 14000 },
  { maxSquareFeet: 1000, btu: 18000 },
  { maxSquareFeet: 1200, btu: 21000 },
  { maxSquareFeet: 1400, btu: 23000 },
  { maxSquareFeet: 1500, btu: 24000 },
  { maxSquareFeet: 2000, btu: 30000 },
  { maxSquareFeet: 2500, btu: 34000 },
];
const atomicWeights: Record<string, number> = {
  H: 1.008,
  He: 4.0026,
  Li: 6.94,
  Be: 9.0122,
  B: 10.81,
  C: 12.011,
  N: 14.007,
  O: 15.999,
  F: 18.998,
  Ne: 20.18,
  Na: 22.99,
  Mg: 24.305,
  Al: 26.982,
  Si: 28.085,
  P: 30.974,
  S: 32.06,
  Cl: 35.45,
  Ar: 39.948,
  K: 39.098,
  Ca: 40.078,
  Sc: 44.956,
  Ti: 47.867,
  V: 50.942,
  Cr: 51.996,
  Mn: 54.938,
  Fe: 55.845,
  Co: 58.933,
  Ni: 58.693,
  Cu: 63.546,
  Zn: 65.38,
  Ga: 69.723,
  Ge: 72.63,
  As: 74.922,
  Se: 78.971,
  Br: 79.904,
  Kr: 83.798,
  Rb: 85.468,
  Sr: 87.62,
  Y: 88.906,
  Zr: 91.224,
  Ag: 107.868,
  Cd: 112.414,
  I: 126.904,
  Ba: 137.327,
  W: 183.84,
  Pt: 195.084,
  Au: 196.967,
  Hg: 200.592,
  Pb: 207.2,
  U: 238.029,
};

function parseIsoDateParts(value: string, label: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    throw new Error(`${label} must use YYYY-MM-DD format`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(`${label} must be a valid calendar date`);
  }

  return { year, month, day, date };
}

function isoFromUtcDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function daysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function addMonthsClamped(date: Date, monthDelta: number) {
  const year = date.getUTCFullYear();
  const monthIndex = date.getUTCMonth();
  const day = date.getUTCDate();
  const targetMonthIndex = monthIndex + monthDelta;
  const targetYear = year + Math.floor(targetMonthIndex / 12);
  const normalizedMonthIndex = ((targetMonthIndex % 12) + 12) % 12;
  const targetDay = Math.min(day, daysInMonth(targetYear, normalizedMonthIndex + 1));

  return new Date(Date.UTC(targetYear, normalizedMonthIndex, targetDay));
}

function compareUtcDates(left: Date, right: Date) {
  return left.getTime() === right.getTime() ? 0 : left.getTime() < right.getTime() ? -1 : 1;
}

function parseClockTime(value: string, label: string) {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);

  if (!match) {
    throw new Error(`${label} must use HH:MM or HH:MM:SS format`);
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3] ?? '0');

  if (hours > 23 || minutes > 59 || seconds > 59) {
    throw new Error(`${label} must be a valid time of day`);
  }

  return hours * secondsPerHour + minutes * secondsPerMinute + seconds;
}

function durationFromSeconds(totalSecondsInput: number): TimeDuration {
  const totalSeconds = Math.round(totalSecondsInput);
  const sign = totalSeconds < 0 ? -1 : 1;
  let remaining = Math.abs(totalSeconds);
  const hours = Math.floor(remaining / secondsPerHour);
  remaining -= hours * secondsPerHour;
  const minutes = Math.floor(remaining / secondsPerMinute);
  const seconds = remaining - minutes * secondsPerMinute;

  return {
    hours: hours * sign,
    minutes,
    seconds,
    totalSeconds,
  };
}

function parseDurationToSeconds(hours: number, minutes: number, seconds: number, label: string) {
  assertFiniteNumber(hours, `${label} hours`);
  assertFiniteNumber(minutes, `${label} minutes`);
  assertFiniteNumber(seconds, `${label} seconds`);

  if (minutes < 0 || seconds < 0 || minutes >= 60 || seconds >= 60) {
    throw new Error(`${label} minutes and seconds must be between 0 and 59`);
  }

  return hours * secondsPerHour + minutes * secondsPerMinute + seconds;
}

function uint32ToIp(value: number) {
  return [24, 16, 8, 0].map((shift) => (value >>> shift) & 255).join('.');
}

function parseIpv4Address(ipAddress: string) {
  const parts = ipAddress.trim().split('.');

  if (parts.length !== 4) {
    throw new Error('IP address must have four octets');
  }

  return parts.reduce((value, part) => {
    if (!/^\d+$/.test(part)) {
      throw new Error('IP address octets must be whole numbers');
    }

    const octet = Number(part);

    if (octet < 0 || octet > 255) {
      throw new Error('IP address octets must be between 0 and 255');
    }

    return ((value << 8) | octet) >>> 0;
  }, 0);
}

function makePasswordPool(options: PasswordGeneratorOptions) {
  const sets = [
    options.includeUppercase ? passwordCharacterSets.uppercase : '',
    options.includeLowercase ? passwordCharacterSets.lowercase : '',
    options.includeNumbers ? passwordCharacterSets.numbers : '',
    options.includeSymbols ? passwordCharacterSets.symbols : '',
  ].filter(Boolean);

  if (sets.length === 0) {
    throw new Error('Choose at least one character type');
  }

  return sets
    .join('')
    .split('')
    .filter((character) => !options.avoidAmbiguous || !ambiguousPasswordCharacters.has(character))
    .join('');
}

function defaultSecureRandomUint32() {
  const cryptoObject = globalThis.crypto;

  if (!cryptoObject?.getRandomValues) {
    throw new Error('Secure random values are not available in this browser');
  }

  const values = new Uint32Array(1);
  cryptoObject.getRandomValues(values);
  return values[0];
}

function chooseRandomCharacter(pool: string, randomUint32: RandomUint32Source) {
  const max = Math.floor(randomUint32Bound / pool.length) * pool.length;
  let value = randomUint32();

  while (value >= max) {
    value = randomUint32();
  }

  return pool[value % pool.length];
}

function convertTemperature(value: number, fromUnit: string, toUnit: string) {
  let celsius: number;

  if (fromUnit === 'celsius') celsius = value;
  else if (fromUnit === 'fahrenheit') celsius = ((value - 32) * 5) / 9;
  else if (fromUnit === 'kelvin') {
    if (value < 0) throw new Error('Kelvin cannot be below zero');
    celsius = value - 273.15;
  } else {
    throw new Error('Choose a supported temperature unit');
  }

  if (toUnit === 'celsius') return celsius;
  if (toUnit === 'fahrenheit') return (celsius * 9) / 5 + 32;
  if (toUnit === 'kelvin') return celsius + 273.15;

  throw new Error('Choose a supported temperature unit');
}

export function calculateAge(birthDate: string, asOfDate: string): AgeCalculationResult {
  const birth = parseIsoDateParts(birthDate, 'Birth date');
  const asOf = parseIsoDateParts(asOfDate, 'As of date');

  if (compareUtcDates(birth.date, asOf.date) > 0) {
    throw new Error('Birth date must be on or before the as of date');
  }

  let years = asOf.year - birth.year;
  let months = asOf.month - birth.month;
  let days = asOf.day - birth.day;

  if (days < 0) {
    months -= 1;
    const previousMonthDate = new Date(Date.UTC(asOf.year, asOf.month - 1, 0));
    days += previousMonthDate.getUTCDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.floor((asOf.date.getTime() - birth.date.getTime()) / millisecondsPerDay);
  const totalMonths = years * 12 + months;
  const birthdayMonth = birth.month - 1;
  const birthdayDay = Math.min(birth.day, daysInMonth(asOf.year, birth.month));
  let nextBirthday = new Date(Date.UTC(asOf.year, birthdayMonth, birthdayDay));

  if (compareUtcDates(nextBirthday, asOf.date) <= 0) {
    const nextYear = asOf.year + 1;
    nextBirthday = new Date(Date.UTC(nextYear, birthdayMonth, Math.min(birth.day, daysInMonth(nextYear, birth.month))));
  }

  return {
    birthDate,
    asOfDate,
    years,
    months,
    days,
    totalDays,
    totalMonths,
    nextBirthday: isoFromUtcDate(nextBirthday),
    daysUntilNextBirthday: Math.floor((nextBirthday.getTime() - asOf.date.getTime()) / millisecondsPerDay),
  };
}

export function calculateDateDifference(startDate: string, endDate: string): DateDifferenceResult {
  const start = parseIsoDateParts(startDate, 'Start date');
  const end = parseIsoDateParts(endDate, 'End date');
  const direction =
    compareUtcDates(start.date, end.date) === 0
      ? 'same-day'
      : compareUtcDates(start.date, end.date) < 0
      ? 'forward'
      : 'backward';
  const earlier = direction === 'backward' ? end : start;
  const later = direction === 'backward' ? start : end;
  const days = Math.abs(Math.floor((end.date.getTime() - start.date.getTime()) / millisecondsPerDay));
  let calendarYears = later.year - earlier.year;
  let calendarMonths = later.month - earlier.month;
  let calendarDays = later.day - earlier.day;

  if (calendarDays < 0) {
    calendarMonths -= 1;
    calendarDays += new Date(Date.UTC(later.year, later.month - 1, 0)).getUTCDate();
  }

  if (calendarMonths < 0) {
    calendarYears -= 1;
    calendarMonths += 12;
  }

  return {
    startDate,
    endDate,
    direction,
    days,
    weeks: Math.floor(days / 7),
    remainingDays: days % 7,
    calendarYears,
    calendarMonths,
    calendarDays,
  };
}

export function calculateDateShift(
  startDate: string,
  years: number,
  months: number,
  weeks: number,
  days: number,
  direction: 'add' | 'subtract',
): DateShiftResult {
  const start = parseIsoDateParts(startDate, 'Start date');
  [years, months, weeks, days].forEach((value, index) => {
    assertNonNegativeNumber(value, ['Years', 'Months', 'Weeks', 'Days'][index]);

    if (!Number.isInteger(value)) {
      throw new Error(`${['Years', 'Months', 'Weeks', 'Days'][index]} must be a whole number`);
    }
  });

  const sign = direction === 'add' ? 1 : -1;
  const monthShifted = addMonthsClamped(start.date, sign * (years * 12 + months));
  const resultDate = new Date(monthShifted.getTime() + sign * (weeks * 7 + days) * millisecondsPerDay);

  return {
    startDate,
    resultDate: isoFromUtcDate(resultDate),
    years,
    months,
    weeks,
    days,
    direction,
  };
}

export function calculateTimeDuration(
  first: { hours: number; minutes: number; seconds: number },
  second: { hours: number; minutes: number; seconds: number },
  operation: 'add' | 'subtract',
): TimeDuration {
  const firstSeconds = parseDurationToSeconds(first.hours, first.minutes, first.seconds, 'First duration');
  const secondSeconds = parseDurationToSeconds(second.hours, second.minutes, second.seconds, 'Second duration');

  return durationFromSeconds(operation === 'add' ? firstSeconds + secondSeconds : firstSeconds - secondSeconds);
}

export function calculateHoursWorked(
  startTime: string,
  endTime: string,
  breakMinutes = 0,
  hourlyRate?: number,
): HoursWorkedResult {
  const startSeconds = parseClockTime(startTime, 'Start time');
  let endSeconds = parseClockTime(endTime, 'End time');
  assertNonNegativeNumber(breakMinutes, 'Break minutes');

  const crossedMidnight = endSeconds < startSeconds;

  if (crossedMidnight) {
    endSeconds += 24 * secondsPerHour;
  }

  const workedSeconds = endSeconds - startSeconds - breakMinutes * secondsPerMinute;

  if (workedSeconds < 0) {
    throw new Error('Break time cannot be longer than the shift');
  }

  const decimalHours = workedSeconds / secondsPerHour;
  const rate = hourlyRate === undefined ? null : hourlyRate;

  if (rate !== null) {
    assertNonNegativeNumber(rate, 'Hourly rate');
  }

  return {
    startTime,
    endTime,
    breakMinutes,
    crossedMidnight,
    totalHours: decimalHours,
    decimalHours,
    grossPay: rate === null ? null : decimalHours * rate,
  };
}

export function calculateGpa(courses: GpaCourseInput[]): GpaResult {
  if (courses.length === 0) {
    throw new Error('Enter at least one course');
  }

  const courseResults = courses.map((course, index) => {
    assertPositiveNumber(course.credits, `Course ${index + 1} credits`);
    const gradeKey = course.grade.trim().toUpperCase();
    const gradePoints = gradePointMap[gradeKey];

    if (gradePoints === undefined) {
      throw new Error(`Course ${index + 1} grade must be a supported letter grade`);
    }

    return {
      ...course,
      grade: gradeKey,
      gradePoints,
      qualityPoints: gradePoints * course.credits,
    };
  });
  const totalCredits = courseResults.reduce((sum, course) => sum + course.credits, 0);
  const totalQualityPoints = courseResults.reduce((sum, course) => sum + course.qualityPoints, 0);

  return {
    courses: courseResults,
    totalCredits,
    totalQualityPoints,
    gpa: totalQualityPoints / totalCredits,
  };
}

export function calculateNeededFinalGrade(
  currentGradePercent: number,
  finalWeightPercent: number,
  desiredGradePercent: number,
): GradeNeededResult {
  assertPercentRange(currentGradePercent, 'Current grade', 150);
  assertPercentRange(finalWeightPercent, 'Final weight');
  assertPercentRange(desiredGradePercent, 'Desired grade', 150);

  if (finalWeightPercent === 0) {
    throw new Error('Final weight must be greater than zero');
  }

  const finalWeight = finalWeightPercent / 100;
  const currentWeight = 1 - finalWeight;
  const neededFinalPercent = (desiredGradePercent - currentGradePercent * currentWeight) / finalWeight;

  return {
    currentGradePercent,
    finalWeightPercent,
    desiredGradePercent,
    neededFinalPercent,
    possibleWithoutExtraCredit: neededFinalPercent <= 100,
  };
}

export function calculateConcrete(input: {
  lengthFeet: number;
  widthFeet: number;
  depthInches: number;
  wastePercent?: number;
}): ConcreteResult {
  assertPositiveNumber(input.lengthFeet, 'Length');
  assertPositiveNumber(input.widthFeet, 'Width');
  assertPositiveNumber(input.depthInches, 'Depth');
  assertPercentRange(input.wastePercent ?? 0, 'Waste percent', 100);

  const baseCubicFeet = input.lengthFeet * input.widthFeet * (input.depthInches / 12);
  const cubicFeet = baseCubicFeet * (1 + (input.wastePercent ?? 0) / 100);

  return {
    lengthFeet: input.lengthFeet,
    widthFeet: input.widthFeet,
    depthInches: input.depthInches,
    wastePercent: input.wastePercent ?? 0,
    cubicFeet,
    cubicYards: cubicFeet / 27,
    cubicMeters: cubicFeet * 0.028316846592,
    bags40lb: Math.ceil(cubicFeet / concreteBagYieldsCubicFeet['40lb']),
    bags60lb: Math.ceil(cubicFeet / concreteBagYieldsCubicFeet['60lb']),
    bags80lb: Math.ceil(cubicFeet / concreteBagYieldsCubicFeet['80lb']),
  };
}

export function calculateSubnet(ipAddress: string, prefixLength: number): SubnetResult {
  if (!Number.isInteger(prefixLength) || prefixLength < 0 || prefixLength > 32) {
    throw new Error('Prefix length must be a whole number from 0 to 32');
  }

  const ipValue = parseIpv4Address(ipAddress);
  const mask = prefixLength === 0 ? 0 : (0xffffffff << (32 - prefixLength)) >>> 0;
  const wildcard = (~mask) >>> 0;
  const network = (ipValue & mask) >>> 0;
  const broadcast = (network | wildcard) >>> 0;
  const totalAddresses = 2 ** (32 - prefixLength);
  const usableAddresses = prefixLength >= 31 ? totalAddresses : Math.max(0, totalAddresses - 2);
  const firstUsable = prefixLength >= 31 ? network : network + 1;
  const lastUsable = prefixLength >= 31 ? broadcast : broadcast - 1;

  return {
    ipAddress: uint32ToIp(ipValue),
    prefixLength,
    subnetMask: uint32ToIp(mask),
    wildcardMask: uint32ToIp(wildcard),
    networkAddress: uint32ToIp(network),
    broadcastAddress: uint32ToIp(broadcast),
    firstUsableAddress: uint32ToIp(firstUsable),
    lastUsableAddress: uint32ToIp(lastUsable),
    totalAddresses,
    usableAddresses,
  };
}

export function generatePassword(
  options: PasswordGeneratorOptions,
  randomUint32: RandomUint32Source = defaultSecureRandomUint32,
): GeneratedPasswordResult {
  if (!Number.isInteger(options.length) || options.length < 8 || options.length > 128) {
    throw new Error('Password length must be a whole number from 8 to 128');
  }

  const pool = makePasswordPool(options);
  let password = '';

  for (let index = 0; index < options.length; index += 1) {
    password += chooseRandomCharacter(pool, randomUint32);
  }

  return {
    password,
    length: options.length,
    characterPoolSize: pool.length,
    estimatedEntropyBits: Math.log2(pool.length) * options.length,
  };
}

export function convertMeasurement(
  category: ConversionCategory,
  input: number,
  fromUnit: string,
  toUnit: string,
): ConversionResult {
  assertFiniteNumber(input, 'Value');

  if (category === 'temperature') {
    return {
      category,
      input,
      fromUnit,
      toUnit,
      result: convertTemperature(input, fromUnit, toUnit),
    };
  }

  const categoryFactors = conversionFactorsToBase[category];

  if (!categoryFactors?.[fromUnit] || !categoryFactors[toUnit]) {
    throw new Error('Choose supported units from the same conversion category');
  }

  return {
    category,
    input,
    fromUnit,
    toUnit,
    result: (input * categoryFactors[fromUnit]) / categoryFactors[toUnit],
  };
}

export function calculateDiceRoll(
  diceCount: number,
  sides: number,
  modifier = 0,
  getRandomUint32: RandomUint32Source = secureRandomUint32,
): DiceRollResult {
  assertSafeInteger(diceCount, 'Dice count');
  assertSafeInteger(sides, 'Sides');
  assertInteger(modifier, 'Modifier');

  if (diceCount < 1 || diceCount > 50) {
    throw new Error('Dice count must be between 1 and 50');
  }

  if (sides < 2 || sides > 1000) {
    throw new Error('Sides must be between 2 and 1000');
  }

  const rolls = Array.from({ length: diceCount }, () => randomIntegerInRange(1, sides, getRandomUint32));
  const subtotal = rolls.reduce((sum, roll) => sum + roll, 0);

  return {
    diceCount,
    sides,
    modifier,
    rolls,
    subtotal,
    total: subtotal + modifier,
  };
}

export function calculateFuelCost(
  distanceMiles: number,
  milesPerGallon: number,
  pricePerGallon: number,
  roundTrip = false,
): FuelCostResult {
  assertPositiveNumber(distanceMiles, 'Distance');
  assertPositiveNumber(milesPerGallon, 'Miles per gallon');
  assertNonNegativeNumber(pricePerGallon, 'Fuel price');

  const totalDistanceMiles = distanceMiles * (roundTrip ? 2 : 1);
  const gallonsNeeded = totalDistanceMiles / milesPerGallon;
  const fuelCost = gallonsNeeded * pricePerGallon;

  return {
    oneWayDistanceMiles: distanceMiles,
    totalDistanceMiles,
    milesPerGallon,
    pricePerGallon,
    gallonsNeeded,
    fuelCost,
    costPerMile: pricePerGallon / milesPerGallon,
    roundTrip,
  };
}

export function calculateSquareFootage(
  lengthFeet: number,
  widthFeet: number,
  quantity = 1,
): SquareFootageResult {
  assertPositiveNumber(lengthFeet, 'Length');
  assertPositiveNumber(widthFeet, 'Width');
  assertSafeInteger(quantity, 'Quantity');

  if (quantity < 1 || quantity > 100000) {
    throw new Error('Quantity must be between 1 and 100,000');
  }

  const squareFeetEach = lengthFeet * widthFeet;
  const totalSquareFeet = squareFeetEach * quantity;

  return {
    lengthFeet,
    widthFeet,
    quantity,
    squareFeetEach,
    totalSquareFeet,
    totalSquareYards: totalSquareFeet / 9,
    totalSquareMeters: totalSquareFeet * 0.09290304,
  };
}

export function calculateGasMileage(milesDriven: number, gallonsUsed: number): GasMileageResult {
  assertPositiveNumber(milesDriven, 'Miles driven');
  assertPositiveNumber(gallonsUsed, 'Gallons used');

  const milesPerGallon = milesDriven / gallonsUsed;

  return {
    milesDriven,
    gallonsUsed,
    milesPerGallon,
    gallonsPer100Miles: (gallonsUsed / milesDriven) * 100,
    litersPer100Km: litersPer100KmFromMpg / milesPerGallon,
  };
}

export function calculateTip(
  subtotal: number,
  tipPercent: number,
  taxPercent = 0,
  people = 1,
): TipResult {
  assertNonNegativeNumber(subtotal, 'Subtotal');
  assertPercentRange(tipPercent, 'Tip percent', 100);
  assertPercentRange(taxPercent, 'Tax percent', 100);
  assertSafeInteger(people, 'People');

  if (people < 1 || people > 1000) {
    throw new Error('People must be between 1 and 1,000');
  }

  const tipAmount = subtotal * (tipPercent / 100);
  const taxAmount = subtotal * (taxPercent / 100);
  const total = subtotal + tipAmount + taxAmount;

  return {
    subtotal,
    tipPercent,
    taxPercent,
    people,
    tipAmount,
    taxAmount,
    total,
    perPerson: total / people,
  };
}

export function calculateMileageCost(miles: number, ratePerMile: number, extraCosts = 0): MileageCostResult {
  assertNonNegativeNumber(miles, 'Miles');
  assertNonNegativeNumber(ratePerMile, 'Rate per mile');
  assertNonNegativeNumber(extraCosts, 'Extra costs');

  const mileageAmount = miles * ratePerMile;

  return {
    miles,
    ratePerMile,
    extraCosts,
    mileageAmount,
    total: mileageAmount + extraCosts,
  };
}

export function calculateDensity(mass: number, volume: number): DensityResult {
  assertPositiveNumber(mass, 'Mass');
  assertPositiveNumber(volume, 'Volume');

  return {
    mass,
    volume,
    density: mass / volume,
  };
}

export function calculateMassFromDensity(density: number, volume: number): MassFromDensityResult {
  assertPositiveNumber(density, 'Density');
  assertPositiveNumber(volume, 'Volume');

  return {
    density,
    volume,
    mass: density * volume,
  };
}

export function calculateWeightForce(massKg: number, gravityMps2 = standardGravity): WeightForceResult {
  assertPositiveNumber(massKg, 'Mass');
  assertPositiveNumber(gravityMps2, 'Gravity');

  const weightNewtons = massKg * gravityMps2;

  return {
    massKg,
    gravityMps2,
    weightNewtons,
    weightPoundsForce: weightNewtons / newtonsPerPoundForce,
    massPounds: massKg * poundsPerKilogram,
  };
}

export function calculateSpeed(
  distanceMiles: number,
  hours: number,
  minutes = 0,
  seconds = 0,
): SpeedResult {
  assertPositiveNumber(distanceMiles, 'Distance');
  const totalSeconds = parseDurationToSeconds(hours, minutes, seconds, 'Travel time');

  if (totalSeconds <= 0) {
    throw new Error('Travel time must be greater than zero');
  }

  const totalHours = totalSeconds / secondsPerHour;
  const milesPerHour = distanceMiles / totalHours;

  return {
    distanceMiles,
    totalSeconds,
    hours: totalHours,
    milesPerHour,
    kilometersPerHour: milesPerHour * milesToKilometers,
    metersPerSecond: (distanceMiles * milesToMeters) / totalSeconds,
  };
}

export function calculateHeightEstimate(
  childSex: 'male' | 'female',
  motherHeightInches: number,
  fatherHeightInches: number,
): HeightEstimateResult {
  assertPositiveNumber(motherHeightInches, 'Mother height');
  assertPositiveNumber(fatherHeightInches, 'Father height');

  const estimatedAdultHeightInches =
    childSex === 'male'
      ? (motherHeightInches + fatherHeightInches + 5) / 2
      : (motherHeightInches + fatherHeightInches - 5) / 2;

  return {
    childSex,
    motherHeightInches,
    fatherHeightInches,
    estimatedAdultHeightInches,
    lowRangeInches: estimatedAdultHeightInches - 4,
    highRangeInches: estimatedAdultHeightInches + 4,
    estimatedAdultHeightCm: estimatedAdultHeightInches * 2.54,
  };
}

export function calculateBraSize(underbustInches: number, bustInches: number): BraSizeResult {
  assertPositiveNumber(underbustInches, 'Underbust');
  assertPositiveNumber(bustInches, 'Bust');

  if (bustInches <= underbustInches) {
    throw new Error('Bust measurement should be larger than underbust measurement');
  }

  let bandSize = Math.ceil(underbustInches);
  if (bandSize % 2 !== 0) bandSize += 1;

  const differenceInches = bustInches - bandSize;
  const cupSteps = [
    { max: 0.75, cup: 'AA' },
    { max: 1.75, cup: 'A' },
    { max: 2.75, cup: 'B' },
    { max: 3.75, cup: 'C' },
    { max: 4.75, cup: 'D' },
    { max: 5.75, cup: 'DD/E' },
    { max: 6.75, cup: 'DDD/F' },
    { max: 7.75, cup: 'G' },
    { max: 8.75, cup: 'H' },
  ];
  const cupSize = cupSteps.find((step) => differenceInches <= step.max)?.cup ?? 'I+';

  return {
    underbustInches,
    bustInches,
    bandSize,
    cupSize,
    sizeLabel: `${bandSize}${cupSize}`,
    differenceInches,
  };
}

export function getCopperResistanceOhmsPer1000Feet(awg: string) {
  const resistance = copperResistanceOhmsPer1000Feet[awg];

  if (resistance === undefined) {
    throw new Error('Choose a supported copper wire size');
  }

  return resistance;
}

export function calculateVoltageDrop(input: {
  sourceVoltage: number;
  currentAmps: number;
  oneWayLengthFeet: number;
  resistanceOhmsPer1000Feet: number;
  phase: 'single' | 'three';
}): VoltageDropResult {
  assertPositiveNumber(input.sourceVoltage, 'Source voltage');
  assertPositiveNumber(input.currentAmps, 'Current');
  assertPositiveNumber(input.oneWayLengthFeet, 'One-way length');
  assertPositiveNumber(input.resistanceOhmsPer1000Feet, 'Resistance');

  const conductorFactor = input.phase === 'three' ? Math.sqrt(3) : 2;
  const voltageDrop =
    input.currentAmps * (input.resistanceOhmsPer1000Feet / 1000) * input.oneWayLengthFeet * conductorFactor;

  return {
    ...input,
    voltageDrop,
    percentDrop: (voltageDrop / input.sourceVoltage) * 100,
    loadVoltage: input.sourceVoltage - voltageDrop,
  };
}

function getElectricalPhaseFactor(phase: ElectricalPowerPhase) {
  if (phase === 'dc' || phase === 'single-phase') return 1;
  if (phase === 'three-phase') return Math.sqrt(3);
  throw new Error('Choose DC, single-phase AC, or three-phase AC');
}

function assertPowerFactor(value: number) {
  assertPositiveNumber(value, 'Power factor');
  if (value > 1) {
    throw new Error('Power factor cannot be greater than 1');
  }
}

export function calculateWattsToAmps(input: {
  watts: number;
  volts: number;
  phase: ElectricalPowerPhase;
  powerFactor: number;
}): WattsToAmpsResult {
  assertPositiveNumber(input.watts, 'Watts');
  assertPositiveNumber(input.volts, 'Volts');
  assertPowerFactor(input.powerFactor);

  const phaseFactor = getElectricalPhaseFactor(input.phase);

  return {
    ...input,
    phaseFactor,
    amps: input.watts / (input.volts * phaseFactor * input.powerFactor),
  };
}

export function calculateAmpsToWatts(input: {
  amps: number;
  volts: number;
  phase: ElectricalPowerPhase;
  powerFactor: number;
}): AmpsToWattsResult {
  assertPositiveNumber(input.amps, 'Amps');
  assertPositiveNumber(input.volts, 'Volts');
  assertPowerFactor(input.powerFactor);

  const phaseFactor = getElectricalPhaseFactor(input.phase);
  const watts = input.amps * input.volts * phaseFactor * input.powerFactor;

  return {
    ...input,
    phaseFactor,
    watts,
    kilowatts: watts / 1000,
  };
}

export function calculateKilowattsToAmps(input: {
  kilowatts: number;
  volts: number;
  phase: ElectricalPowerPhase;
  powerFactor: number;
  efficiencyPercent: number;
}): KilowattsToAmpsResult {
  assertPositiveNumber(input.kilowatts, 'Kilowatts');
  assertPositiveNumber(input.volts, 'Volts');
  assertPowerFactor(input.powerFactor);
  assertPositiveNumber(input.efficiencyPercent, 'Efficiency percent');
  if (input.efficiencyPercent > 100) {
    throw new Error('Efficiency percent cannot be greater than 100%');
  }

  const phaseFactor = getElectricalPhaseFactor(input.phase);
  const inputWatts = (input.kilowatts * 1000) / (input.efficiencyPercent / 100);

  return {
    ...input,
    inputWatts,
    phaseFactor,
    amps: inputWatts / (input.volts * phaseFactor * input.powerFactor),
  };
}

export function calculateKilovoltAmpsToAmps(input: {
  kilovoltAmps: number;
  volts: number;
  phase: Extract<ElectricalPowerPhase, 'single-phase' | 'three-phase'>;
}): KilovoltAmpsToAmpsResult {
  assertPositiveNumber(input.kilovoltAmps, 'Kilovolt-amps');
  assertPositiveNumber(input.volts, 'Volts');

  const phaseFactor = getElectricalPhaseFactor(input.phase);

  return {
    ...input,
    phaseFactor,
    amps: (input.kilovoltAmps * 1000) / (input.volts * phaseFactor),
  };
}

export function calculateAmpHoursToWattHours(input: {
  ampHours: number;
  volts: number;
}): AmpHoursToWattHoursResult {
  assertPositiveNumber(input.ampHours, 'Amp-hours');
  assertPositiveNumber(input.volts, 'Volts');

  const wattHours = input.ampHours * input.volts;

  return {
    ...input,
    wattHours,
    kilowattHours: wattHours / 1000,
  };
}

export function calculateWattHoursToAmpHours(input: {
  wattHours: number;
  volts: number;
}): WattHoursToAmpHoursResult {
  assertPositiveNumber(input.wattHours, 'Watt-hours');
  assertPositiveNumber(input.volts, 'Volts');

  return {
    ...input,
    ampHours: input.wattHours / input.volts,
  };
}

export function calculateWireResistanceEstimate(input: {
  wireGauge: string;
  oneWayLengthFeet: number;
  conductorCount: number;
}): WireResistanceEstimateResult {
  assertPositiveNumber(input.oneWayLengthFeet, 'One-way length');
  assertInteger(input.conductorCount, 'Conductor count');
  assertPositiveNumber(input.conductorCount, 'Conductor count');

  const resistanceOhmsPer1000Feet = getCopperResistanceOhmsPer1000Feet(input.wireGauge);
  const oneWayResistanceOhms = resistanceOhmsPer1000Feet * (input.oneWayLengthFeet / 1000);

  return {
    ...input,
    resistanceOhmsPer1000Feet,
    oneWayResistanceOhms,
    totalResistanceOhms: oneWayResistanceOhms * input.conductorCount,
  };
}

export function calculateWireSizeEstimate(input: {
  sourceVoltage: number;
  currentAmps: number;
  oneWayLengthFeet: number;
  maxVoltageDropPercent: number;
  phase: 'single' | 'three';
}): WireSizeEstimateResult {
  assertPositiveNumber(input.sourceVoltage, 'Source voltage');
  assertPositiveNumber(input.currentAmps, 'Current');
  assertPositiveNumber(input.oneWayLengthFeet, 'One-way length');
  assertPositiveNumber(input.maxVoltageDropPercent, 'Max voltage drop percent');
  if (input.maxVoltageDropPercent > 20) {
    throw new Error('Max voltage drop percent cannot be greater than 20%');
  }

  for (const wireGauge of copperAwgSmallToLarge) {
    const result = calculateVoltageDrop({
      sourceVoltage: input.sourceVoltage,
      currentAmps: input.currentAmps,
      oneWayLengthFeet: input.oneWayLengthFeet,
      resistanceOhmsPer1000Feet: getCopperResistanceOhmsPer1000Feet(wireGauge),
      phase: input.phase,
    });

    if (result.percentDrop <= input.maxVoltageDropPercent) {
      return {
        ...input,
        recommendedWireGauge: wireGauge,
        resistanceOhmsPer1000Feet: result.resistanceOhmsPer1000Feet,
        voltageDrop: result.voltageDrop,
        percentDrop: result.percentDrop,
        loadVoltage: result.loadVoltage,
      };
    }
  }

  throw new Error('No supported copper wire size meets that voltage drop limit');
}

export function calculateBtuEstimate(input: {
  squareFeet: number;
  ceilingHeightFeet: number;
  sunlight: 'normal' | 'shaded' | 'sunny';
  people: number;
  kitchen: boolean;
}): BtuEstimateResult {
  assertPositiveNumber(input.squareFeet, 'Square feet');
  assertPositiveNumber(input.ceilingHeightFeet, 'Ceiling height');
  assertNonNegativeNumber(input.people, 'People');

  const tableMatch = btuCapacityTable.find((row) => input.squareFeet <= row.maxSquareFeet);
  const baseBtu = tableMatch?.btu ?? input.squareFeet * 20;
  let adjustedBtu = baseBtu * (input.ceilingHeightFeet / 8);

  if (input.sunlight === 'shaded') adjustedBtu *= 0.9;
  if (input.sunlight === 'sunny') adjustedBtu *= 1.1;
  if (input.people > 2) adjustedBtu += (input.people - 2) * 600;
  if (input.kitchen) adjustedBtu += 4000;

  return {
    squareFeet: input.squareFeet,
    ceilingHeightFeet: input.ceilingHeightFeet,
    baseBtu,
    adjustedBtu,
    recommendedBtu: Math.round(adjustedBtu / 500) * 500,
  };
}

export function calculateStairLayout(
  totalRiseInches: number,
  targetRiserInches: number,
  treadDepthInches: number,
): StairLayoutResult {
  assertPositiveNumber(totalRiseInches, 'Total rise');
  assertPositiveNumber(targetRiserInches, 'Target riser');
  assertPositiveNumber(treadDepthInches, 'Tread depth');

  const riserCount = Math.max(1, Math.round(totalRiseInches / targetRiserInches));
  const actualRiserInches = totalRiseInches / riserCount;
  const treadCount = Math.max(0, riserCount - 1);
  const totalRunInches = treadCount * treadDepthInches;
  const stairAngleDegrees = (Math.atan(actualRiserInches / treadDepthInches) * 180) / Math.PI;

  return {
    totalRiseInches,
    riserCount,
    treadCount,
    actualRiserInches,
    treadDepthInches,
    totalRunInches,
    stairAngleDegrees,
  };
}

export function calculateResistorColorCode(
  band1: string,
  band2: string,
  multiplier: string,
  tolerance: string,
): ResistorColorResult {
  const firstDigit = resistorDigitBands[band1];
  const secondDigit = resistorDigitBands[band2];
  const multiplierValue = resistorMultiplierBands[multiplier];
  const tolerancePercent = resistorToleranceBands[tolerance];

  if (firstDigit === undefined || secondDigit === undefined || multiplierValue === undefined || tolerancePercent === undefined) {
    throw new Error('Choose valid resistor color bands');
  }

  return {
    band1,
    band2,
    multiplier,
    tolerance,
    resistanceOhms: (firstDigit * 10 + secondDigit) * multiplierValue,
    tolerancePercent,
  };
}

export function calculateOhmsLaw(mode: string, firstValue: number, secondValue: number): OhmsLawResult {
  assertPositiveNumber(firstValue, 'First value');
  assertPositiveNumber(secondValue, 'Second value');

  let voltage: number;
  let current: number;
  let resistance: number;

  switch (mode) {
    case 'voltage-current':
      voltage = firstValue;
      current = secondValue;
      resistance = voltage / current;
      break;
    case 'voltage-resistance':
      voltage = firstValue;
      resistance = secondValue;
      current = voltage / resistance;
      break;
    case 'current-resistance':
      current = firstValue;
      resistance = secondValue;
      voltage = current * resistance;
      break;
    case 'voltage-power':
      voltage = firstValue;
      current = secondValue / voltage;
      resistance = voltage / current;
      break;
    case 'current-power':
      current = firstValue;
      voltage = secondValue / current;
      resistance = voltage / current;
      break;
    case 'resistance-power':
      resistance = firstValue;
      voltage = Math.sqrt(secondValue * resistance);
      current = voltage / resistance;
      break;
    default:
      throw new Error('Choose a supported Ohm\'s law mode');
  }

  return {
    voltage,
    current,
    resistance,
    power: voltage * current,
  };
}

export function calculateElectricityCost(
  watts: number,
  hoursPerDay: number,
  days: number,
  ratePerKwh: number,
): ElectricityCostResult {
  assertPositiveNumber(watts, 'Watts');
  assertNonNegativeNumber(hoursPerDay, 'Hours per day');
  assertPositiveNumber(days, 'Days');
  assertNonNegativeNumber(ratePerKwh, 'Rate per kWh');

  const kilowattHours = (watts / 1000) * hoursPerDay * days;

  return {
    watts,
    hoursPerDay,
    days,
    ratePerKwh,
    kilowattHours,
    cost: kilowattHours * ratePerKwh,
  };
}

export function convertShoeSize(footLengthCm: number): ShoeSizeResult {
  assertPositiveNumber(footLengthCm, 'Foot length');

  const footLengthInches = footLengthCm / 2.54;
  const usMen = 3 * footLengthInches - 22;
  const usWomen = usMen + 1.5;

  return {
    footLengthCm,
    footLengthInches,
    usMen,
    usWomen,
    ukAdult: usMen - 0.5,
    euAdult: 1.5 * (footLengthCm + 1.5),
  };
}

export function calculateMolarity(input: {
  moles?: number;
  grams?: number;
  molarMass?: number;
  volumeLiters: number;
}): MolarityResult {
  assertPositiveNumber(input.volumeLiters, 'Volume');

  const moles =
    input.moles === undefined
      ? (() => {
          assertPositiveNumber(input.grams ?? 0, 'Grams');
          assertPositiveNumber(input.molarMass ?? 0, 'Molar mass');
          return (input.grams ?? 0) / (input.molarMass ?? 1);
        })()
      : input.moles;

  assertPositiveNumber(moles, 'Moles');

  return {
    moles,
    volumeLiters: input.volumeLiters,
    molarity: moles / input.volumeLiters,
    grams: input.grams,
    molarMass: input.molarMass,
  };
}

function mergeAtomCount(target: Record<string, number>, element: string, count: number) {
  target[element] = (target[element] ?? 0) + count;
}

function parseFormulaNumber(formula: string, index: number) {
  let end = index;

  while (/\d/.test(formula[end] ?? '')) end += 1;

  return {
    value: end === index ? 1 : Number(formula.slice(index, end)),
    index: end,
  };
}

function parseFormulaGroup(formula: string, startIndex: number): { atoms: Record<string, number>; index: number } {
  const atoms: Record<string, number> = {};
  let index = startIndex;

  while (index < formula.length) {
    const character = formula[index];

    if (character === ')') {
      return { atoms, index: index + 1 };
    }

    if (character === '(') {
      const group = parseFormulaGroup(formula, index + 1);
      const multiplier = parseFormulaNumber(formula, group.index);
      Object.entries(group.atoms).forEach(([element, count]) => mergeAtomCount(atoms, element, count * multiplier.value));
      index = multiplier.index;
      continue;
    }

    if (!/[A-Z]/.test(character)) {
      throw new Error('Chemical formula can only use element symbols, numbers, parentheses, and dot hydrates');
    }

    let element = character;
    index += 1;

    if (/[a-z]/.test(formula[index] ?? '')) {
      element += formula[index];
      index += 1;
    }

    if (atomicWeights[element] === undefined) {
      throw new Error(`Element ${element} is not in the supported atomic-weight table yet`);
    }

    const count = parseFormulaNumber(formula, index);
    mergeAtomCount(atoms, element, count.value);
    index = count.index;
  }

  return { atoms, index };
}

export function calculateMolecularWeight(formulaInput: string): MolecularWeightResult {
  const formula = formulaInput.trim().replace(/\s+/g, '');

  if (!formula) {
    throw new Error('Chemical formula is required');
  }

  const atoms: Record<string, number> = {};

  formula.split('.').forEach((part) => {
    if (!part) throw new Error('Chemical formula contains an empty hydrate part');
    const coefficientMatch = part.match(/^(\d+)(?=[A-Z(])/);
    const coefficient = coefficientMatch ? Number(coefficientMatch[1]) : 1;
    const formulaPart = coefficientMatch ? part.slice(coefficientMatch[1].length) : part;
    const parsed = parseFormulaGroup(formulaPart, 0);

    if (parsed.index !== formulaPart.length) {
      throw new Error('Chemical formula has unmatched parentheses');
    }

    Object.entries(parsed.atoms).forEach(([element, count]) => mergeAtomCount(atoms, element, count * coefficient));
  });

  const composition = Object.entries(atoms).map(([element, count]) => ({
    element,
    count,
    mass: atomicWeights[element] * count,
    percent: 0,
  }));
  const molarMass = composition.reduce((sum, item) => sum + item.mass, 0);

  return {
    formula,
    molarMass,
    atomCount: composition.reduce((sum, item) => sum + item.count, 0),
    composition: composition.map((item) => ({
      ...item,
      percent: (item.mass / molarMass) * 100,
    })),
  };
}

function timeFromMinutes(totalMinutesInput: number) {
  const totalMinutes = ((Math.round(totalMinutesInput) % 1440) + 1440) % 1440;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function calculateSleepSchedule(
  mode: 'wake-up' | 'bedtime',
  inputTime: string,
  cycles: number,
  fallAsleepMinutes: number,
): SleepScheduleResult {
  const timeMinutes = parseClockTime(inputTime, 'Time') / secondsPerMinute;
  assertPositiveNumber(cycles, 'Sleep cycles');
  assertNonNegativeNumber(fallAsleepMinutes, 'Fall-asleep minutes');

  if (!Number.isInteger(cycles) || cycles < 1 || cycles > 8) {
    throw new Error('Sleep cycles must be a whole number from 1 to 8');
  }

  const sleepDurationMinutes = cycles * 90;
  const targetMinutes =
    mode === 'wake-up'
      ? timeMinutes - sleepDurationMinutes - fallAsleepMinutes
      : timeMinutes + sleepDurationMinutes + fallAsleepMinutes;

  return {
    mode,
    inputTime,
    fallAsleepMinutes,
    cycles,
    targetTime: timeFromMinutes(targetMinutes),
    sleepDurationMinutes,
  };
}

export function calculateTireSize(
  widthMm: number,
  aspectRatio: number,
  wheelDiameterInches: number,
): TireSizeResult {
  assertPositiveNumber(widthMm, 'Tire width');
  assertPositiveNumber(aspectRatio, 'Aspect ratio');
  assertPositiveNumber(wheelDiameterInches, 'Wheel diameter');

  const sidewallInches = (widthMm * (aspectRatio / 100)) / millimetersPerInch;
  const tireDiameterInches = wheelDiameterInches + sidewallInches * 2;
  const circumferenceInches = tireDiameterInches * Math.PI;

  return {
    widthMm,
    aspectRatio,
    wheelDiameterInches,
    sidewallInches,
    tireDiameterInches,
    circumferenceInches,
    revolutionsPerMile: 63360 / circumferenceInches,
  };
}

export function calculateRoofingEstimate(
  lengthFeet: number,
  widthFeet: number,
  pitchRisePer12: number,
  wastePercent: number,
): RoofingEstimateResult {
  assertPositiveNumber(lengthFeet, 'Length');
  assertPositiveNumber(widthFeet, 'Width');
  assertNonNegativeNumber(pitchRisePer12, 'Pitch rise');
  assertPercentRange(wastePercent, 'Waste percent', 100);

  const footprintSquareFeet = lengthFeet * widthFeet;
  const pitchFactor = Math.sqrt(pitchRisePer12 ** 2 + 12 ** 2) / 12;
  const roofSquareFeet = footprintSquareFeet * pitchFactor * (1 + wastePercent / 100);
  const roofSquares = roofSquareFeet / 100;
  const lowSlopeWarning =
    pitchRisePer12 < 2
      ? 'Pitch is below 2/12. Do not use the shingle bundle estimate as an order list without checking the product instructions, local code, and a roofer.'
      : undefined;

  return {
    footprintSquareFeet,
    pitchRisePer12,
    pitchFactor,
    roofSquareFeet,
    wastePercent,
    roofSquares,
    shingleBundles: Math.ceil(roofSquares * 3),
    lowSlopeWarning,
  };
}

export function calculateTileEstimate(
  areaSquareFeet: number,
  tileLengthInches: number,
  tileWidthInches: number,
  wastePercent: number,
): TileEstimateResult {
  assertPositiveNumber(areaSquareFeet, 'Area');
  assertPositiveNumber(tileLengthInches, 'Tile length');
  assertPositiveNumber(tileWidthInches, 'Tile width');
  assertPercentRange(wastePercent, 'Waste percent', 100);

  const tileAreaSquareFeet = (tileLengthInches * tileWidthInches) / 144;

  return {
    areaSquareFeet,
    tileLengthInches,
    tileWidthInches,
    wastePercent,
    tileAreaSquareFeet,
    tilesNeeded: Math.ceil((areaSquareFeet * (1 + wastePercent / 100)) / tileAreaSquareFeet),
  };
}

export function calculateMulchEstimate(
  areaSquareFeet: number,
  depthInches: number,
  wastePercent: number,
): MulchEstimateResult {
  assertPositiveNumber(areaSquareFeet, 'Area');
  assertPositiveNumber(depthInches, 'Depth');
  assertPercentRange(wastePercent, 'Waste percent', 100);

  const cubicFeet = areaSquareFeet * (depthInches / 12) * (1 + wastePercent / 100);

  return {
    areaSquareFeet,
    depthInches,
    wastePercent,
    cubicFeet,
    cubicYards: cubicFeet / 27,
    twoCubicFootBags: Math.ceil(cubicFeet / 2),
  };
}

export function calculateGravelEstimate(
  lengthFeet: number,
  widthFeet: number,
  depthInches: number,
  tonsPerCubicYard: number,
): GravelEstimateResult {
  assertPositiveNumber(lengthFeet, 'Length');
  assertPositiveNumber(widthFeet, 'Width');
  assertPositiveNumber(depthInches, 'Depth');
  assertPositiveNumber(tonsPerCubicYard, 'Tons per cubic yard');

  const cubicFeet = lengthFeet * widthFeet * (depthInches / 12);
  const cubicYards = cubicFeet / 27;

  return {
    lengthFeet,
    widthFeet,
    depthInches,
    tonsPerCubicYard,
    cubicFeet,
    cubicYards,
    tons: cubicYards * tonsPerCubicYard,
  };
}

export function calculatePaintEstimate(input: {
  lengthFeet: number;
  widthFeet: number;
  wallHeightFeet: number;
  doors: number;
  windows: number;
  coats: number;
  coverageSquareFeetPerGallon: number;
  wastePercent: number;
}): PaintEstimateResult {
  assertPositiveNumber(input.lengthFeet, 'Room length');
  assertPositiveNumber(input.widthFeet, 'Room width');
  assertPositiveNumber(input.wallHeightFeet, 'Wall height');
  assertNonNegativeNumber(input.doors, 'Doors');
  assertNonNegativeNumber(input.windows, 'Windows');
  assertInteger(input.doors, 'Doors');
  assertInteger(input.windows, 'Windows');
  assertPositiveNumber(input.coats, 'Coats');
  assertInteger(input.coats, 'Coats');
  assertPositiveNumber(input.coverageSquareFeetPerGallon, 'Coverage');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);

  const wallSquareFeet = 2 * (input.lengthFeet + input.widthFeet) * input.wallHeightFeet;
  const openingSquareFeet = input.doors * 20 + input.windows * 15;
  const paintableSquareFeet = Math.max(0, wallSquareFeet - openingSquareFeet);
  const adjustedSquareFeet = paintableSquareFeet * input.coats * (1 + input.wastePercent / 100);
  const gallonsNeeded = adjustedSquareFeet / input.coverageSquareFeetPerGallon;

  return {
    ...input,
    wallSquareFeet,
    openingSquareFeet,
    paintableSquareFeet,
    adjustedSquareFeet,
    gallonsNeeded,
    gallonsToBuy: Math.ceil(gallonsNeeded),
  };
}

export function calculateDrywallEstimate(
  areaSquareFeet: number,
  sheetLengthFeet: number,
  sheetWidthFeet: number,
  wastePercent: number,
): DrywallEstimateResult {
  assertPositiveNumber(areaSquareFeet, 'Area');
  assertPositiveNumber(sheetLengthFeet, 'Sheet length');
  assertPositiveNumber(sheetWidthFeet, 'Sheet width');
  assertPercentRange(wastePercent, 'Waste percent', 100);

  const sheetAreaSquareFeet = sheetLengthFeet * sheetWidthFeet;
  const adjustedAreaSquareFeet = areaSquareFeet * (1 + wastePercent / 100);

  return {
    areaSquareFeet,
    sheetLengthFeet,
    sheetWidthFeet,
    wastePercent,
    sheetAreaSquareFeet,
    adjustedAreaSquareFeet,
    sheetsNeeded: Math.ceil(adjustedAreaSquareFeet / sheetAreaSquareFeet),
  };
}

export function calculateCarpetEstimate(
  lengthFeet: number,
  widthFeet: number,
  rollWidthFeet: number,
  wastePercent: number,
): CarpetEstimateResult {
  assertPositiveNumber(lengthFeet, 'Length');
  assertPositiveNumber(widthFeet, 'Width');
  assertPositiveNumber(rollWidthFeet, 'Roll width');
  assertPercentRange(wastePercent, 'Waste percent', 100);

  const areaSquareFeet = lengthFeet * widthFeet;
  const adjustedAreaSquareFeet = areaSquareFeet * (1 + wastePercent / 100);

  return {
    lengthFeet,
    widthFeet,
    rollWidthFeet,
    wastePercent,
    areaSquareFeet,
    adjustedAreaSquareFeet,
    squareYards: adjustedAreaSquareFeet / 9,
    linearFeet: adjustedAreaSquareFeet / rollWidthFeet,
  };
}

export function calculateFlooringEstimate(input: {
  areaSquareFeet: number;
  wastePercent: number;
  boxCoverageSquareFeet: number;
  pricePerBox?: number | null;
}): FlooringEstimateResult {
  assertPositiveNumber(input.areaSquareFeet, 'Area');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);
  assertPositiveNumber(input.boxCoverageSquareFeet, 'Box coverage');

  const pricePerBox = input.pricePerBox ?? null;
  if (pricePerBox !== null) {
    assertNonNegativeNumber(pricePerBox, 'Price per box');
  }

  const adjustedAreaSquareFeet = input.areaSquareFeet * (1 + input.wastePercent / 100);
  const boxesNeeded = Math.ceil(adjustedAreaSquareFeet / input.boxCoverageSquareFeet - 1e-10);

  return {
    ...input,
    pricePerBox,
    adjustedAreaSquareFeet,
    boxesNeeded,
    totalCoverageSquareFeet: boxesNeeded * input.boxCoverageSquareFeet,
    estimatedCost: pricePerBox === null ? null : boxesNeeded * pricePerBox,
  };
}

export function calculateWallpaperEstimate(input: {
  roomLengthFeet: number;
  roomWidthFeet: number;
  wallHeightFeet: number;
  doors: number;
  windows: number;
  rollCoverageSquareFeet: number;
  wastePercent: number;
  pricePerRoll?: number | null;
}): WallpaperEstimateResult {
  assertPositiveNumber(input.roomLengthFeet, 'Room length');
  assertPositiveNumber(input.roomWidthFeet, 'Room width');
  assertPositiveNumber(input.wallHeightFeet, 'Wall height');
  assertNonNegativeNumber(input.doors, 'Doors');
  assertNonNegativeNumber(input.windows, 'Windows');
  assertInteger(input.doors, 'Doors');
  assertInteger(input.windows, 'Windows');
  assertPositiveNumber(input.rollCoverageSquareFeet, 'Roll coverage');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);

  const pricePerRoll = input.pricePerRoll ?? null;
  if (pricePerRoll !== null) {
    assertNonNegativeNumber(pricePerRoll, 'Price per roll');
  }

  const wallSquareFeet = 2 * (input.roomLengthFeet + input.roomWidthFeet) * input.wallHeightFeet;
  const openingSquareFeet = input.doors * 20 + input.windows * 15;
  const wallpaperSquareFeet = Math.max(0, wallSquareFeet - openingSquareFeet);
  const adjustedSquareFeet = wallpaperSquareFeet * (1 + input.wastePercent / 100);
  const rollsNeeded = Math.ceil(adjustedSquareFeet / input.rollCoverageSquareFeet - 1e-10);

  return {
    ...input,
    pricePerRoll,
    wallSquareFeet,
    openingSquareFeet,
    wallpaperSquareFeet,
    adjustedSquareFeet,
    rollsNeeded,
    estimatedCost: pricePerRoll === null ? null : rollsNeeded * pricePerRoll,
  };
}

export function calculateFenceEstimate(input: {
  perimeterFeet: number;
  panelWidthFeet: number;
  postSpacingFeet: number;
  gateCount: number;
  gateWidthFeet: number;
}): FenceEstimateResult {
  assertPositiveNumber(input.perimeterFeet, 'Perimeter');
  assertPositiveNumber(input.panelWidthFeet, 'Panel width');
  assertPositiveNumber(input.postSpacingFeet, 'Post spacing');
  assertNonNegativeNumber(input.gateCount, 'Gate count');
  assertInteger(input.gateCount, 'Gate count');
  assertNonNegativeNumber(input.gateWidthFeet, 'Gate width');

  const fenceRunFeet = Math.max(0, input.perimeterFeet - input.gateCount * input.gateWidthFeet);
  const linePosts = fenceRunFeet === 0 ? 0 : Math.ceil(fenceRunFeet / input.postSpacingFeet) + 1;
  const gatePosts = input.gateCount * 2;

  return {
    ...input,
    fenceRunFeet,
    panelsNeeded: Math.ceil(fenceRunFeet / input.panelWidthFeet),
    linePosts,
    gatePosts,
    totalPosts: linePosts + gatePosts,
  };
}

export function calculateDeckCostEstimate(input: {
  lengthFeet: number;
  widthFeet: number;
  wastePercent: number;
  deckCostPerSquareFoot: number;
  railingLinearFeet: number;
  railingCostPerFoot: number;
  stairsCost: number;
}): DeckCostEstimateResult {
  assertPositiveNumber(input.lengthFeet, 'Length');
  assertPositiveNumber(input.widthFeet, 'Width');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);
  assertNonNegativeNumber(input.deckCostPerSquareFoot, 'Deck cost per square foot');
  assertNonNegativeNumber(input.railingLinearFeet, 'Railing length');
  assertNonNegativeNumber(input.railingCostPerFoot, 'Railing cost per foot');
  assertNonNegativeNumber(input.stairsCost, 'Stairs cost');

  const deckAreaSquareFeet = input.lengthFeet * input.widthFeet;
  const adjustedDeckAreaSquareFeet = deckAreaSquareFeet * (1 + input.wastePercent / 100);
  const surfaceCost = adjustedDeckAreaSquareFeet * input.deckCostPerSquareFoot;
  const railingCost = input.railingLinearFeet * input.railingCostPerFoot;

  return {
    ...input,
    deckAreaSquareFeet,
    adjustedDeckAreaSquareFeet,
    surfaceCost,
    railingCost,
    totalCost: surfaceCost + railingCost + input.stairsCost,
  };
}

export function calculateDeckBoardEstimate(input: {
  deckLengthFeet: number;
  deckWidthFeet: number;
  boardLengthFeet: number;
  boardWidthInches: number;
  joistSpacingInches: number;
  wastePercent: number;
  pricePerBoard?: number | null;
}): DeckBoardEstimateResult {
  assertPositiveNumber(input.deckLengthFeet, 'Deck length');
  assertPositiveNumber(input.deckWidthFeet, 'Deck width');
  assertPositiveNumber(input.boardLengthFeet, 'Board length');
  assertPositiveNumber(input.boardWidthInches, 'Board width');
  assertPositiveNumber(input.joistSpacingInches, 'Joist spacing');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);

  const pricePerBoard = input.pricePerBoard ?? null;
  if (pricePerBoard !== null) {
    assertNonNegativeNumber(pricePerBoard, 'Price per board');
  }

  const deckAreaSquareFeet = input.deckLengthFeet * input.deckWidthFeet;
  const adjustedDeckAreaSquareFeet = deckAreaSquareFeet * (1 + input.wastePercent / 100);
  const boardCoverageSquareFeet = input.boardLengthFeet * (input.boardWidthInches / 12);
  const boardsNeeded = Math.ceil(adjustedDeckAreaSquareFeet / boardCoverageSquareFeet - 1e-10);
  const joistCount = Math.floor((input.deckLengthFeet * 12) / input.joistSpacingInches) + 1;
  const hiddenFasteners = boardsNeeded * joistCount;
  const deckScrews = hiddenFasteners * 2;

  return {
    ...input,
    pricePerBoard,
    deckAreaSquareFeet,
    adjustedDeckAreaSquareFeet,
    boardCoverageSquareFeet,
    boardsNeeded,
    joistCount,
    hiddenFasteners,
    deckScrews,
    estimatedCost: pricePerBoard === null ? null : boardsNeeded * pricePerBoard,
  };
}

export function calculateDeckStainEstimate(input: {
  deckLengthFeet: number;
  deckWidthFeet: number;
  railingLengthFeet: number;
  railingHeightFeet: number;
  stepCount: number;
  stepWidthFeet: number;
  stepDepthInches: number;
  riserHeightInches: number;
  coats: number;
  coverageSquareFeetPerGallon: number;
  wastePercent: number;
  pricePerGallon?: number | null;
}): DeckStainEstimateResult {
  assertPositiveNumber(input.deckLengthFeet, 'Deck length');
  assertPositiveNumber(input.deckWidthFeet, 'Deck width');
  assertNonNegativeNumber(input.railingLengthFeet, 'Railing length');
  assertNonNegativeNumber(input.railingHeightFeet, 'Railing height');
  assertInteger(input.stepCount, 'Step count');
  assertNonNegativeNumber(input.stepCount, 'Step count');
  assertNonNegativeNumber(input.stepWidthFeet, 'Step width');
  assertNonNegativeNumber(input.stepDepthInches, 'Step depth');
  assertNonNegativeNumber(input.riserHeightInches, 'Riser height');
  assertInteger(input.coats, 'Coats');
  assertPositiveNumber(input.coats, 'Coats');
  assertPositiveNumber(input.coverageSquareFeetPerGallon, 'Coverage per gallon');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);

  const pricePerGallon = input.pricePerGallon ?? null;
  if (pricePerGallon !== null) {
    assertNonNegativeNumber(pricePerGallon, 'Price per gallon');
  }

  const deckSurfaceSquareFeet = input.deckLengthFeet * input.deckWidthFeet;
  const railingSquareFeet = input.railingLengthFeet * input.railingHeightFeet * 2;
  const stepsSquareFeet = input.stepCount * input.stepWidthFeet * ((input.stepDepthInches + input.riserHeightInches) / 12);
  const totalSurfaceSquareFeet = deckSurfaceSquareFeet + railingSquareFeet + stepsSquareFeet;
  const adjustedSurfaceSquareFeet = totalSurfaceSquareFeet * (1 + input.wastePercent / 100);
  const coatAdjustedSquareFeet = adjustedSurfaceSquareFeet * input.coats;
  const gallonsNeeded = coatAdjustedSquareFeet / input.coverageSquareFeetPerGallon;
  const gallonsToBuy = Math.ceil(gallonsNeeded - 1e-10);

  return {
    ...input,
    pricePerGallon,
    deckSurfaceSquareFeet,
    railingSquareFeet,
    stepsSquareFeet,
    totalSurfaceSquareFeet,
    adjustedSurfaceSquareFeet,
    coatAdjustedSquareFeet,
    gallonsNeeded,
    gallonsToBuy,
    estimatedCost: pricePerGallon === null ? null : gallonsToBuy * pricePerGallon,
  };
}

export function calculateBalusterEstimate(input: {
  railLengthFeet: number;
  postWidthInches: number;
  postCount: number;
  balusterWidthInches: number;
  maxSpacingInches: number;
}): BalusterEstimateResult {
  assertPositiveNumber(input.railLengthFeet, 'Rail length');
  assertNonNegativeNumber(input.postWidthInches, 'Post width');
  assertInteger(input.postCount, 'Post count');
  assertNonNegativeNumber(input.postCount, 'Post count');
  assertPositiveNumber(input.balusterWidthInches, 'Baluster width');
  assertPositiveNumber(input.maxSpacingInches, 'Max spacing');

  const openingLengthInches = input.railLengthFeet * 12 - input.postCount * input.postWidthInches;
  if (openingLengthInches <= 0) {
    throw new Error('Opening length must be greater than zero after post widths');
  }

  const balustersNeeded = Math.max(
    0,
    Math.ceil((openingLengthInches - input.maxSpacingInches) / (input.balusterWidthInches + input.maxSpacingInches) - 1e-10),
  );
  const totalBalusterWidthInches = balustersNeeded * input.balusterWidthInches;
  const actualSpacingInches = balustersNeeded === 0
    ? openingLengthInches
    : (openingLengthInches - totalBalusterWidthInches) / (balustersNeeded + 1);

  return {
    ...input,
    openingLengthInches,
    balustersNeeded,
    totalBalusterWidthInches,
    actualSpacingInches,
  };
}

export function calculatePaverEstimate(
  areaSquareFeet: number,
  paverLengthInches: number,
  paverWidthInches: number,
  wastePercent: number,
): PaverEstimateResult {
  assertPositiveNumber(areaSquareFeet, 'Area');
  assertPositiveNumber(paverLengthInches, 'Paver length');
  assertPositiveNumber(paverWidthInches, 'Paver width');
  assertPercentRange(wastePercent, 'Waste percent', 100);

  const paverAreaSquareFeet = (paverLengthInches * paverWidthInches) / 144;
  const adjustedAreaSquareFeet = areaSquareFeet * (1 + wastePercent / 100);

  return {
    areaSquareFeet,
    paverLengthInches,
    paverWidthInches,
    wastePercent,
    paverAreaSquareFeet,
    adjustedAreaSquareFeet,
    paversNeeded: Math.ceil(adjustedAreaSquareFeet / paverAreaSquareFeet - 1e-10),
  };
}

export function calculatePaverBaseEstimate(input: {
  areaSquareFeet: number;
  baseDepthInches: number;
  beddingDepthInches: number;
  wastePercent: number;
  baseTonsPerCubicYard: number;
}): PaverBaseEstimateResult {
  assertPositiveNumber(input.areaSquareFeet, 'Area');
  assertNonNegativeNumber(input.baseDepthInches, 'Base depth');
  assertNonNegativeNumber(input.beddingDepthInches, 'Bedding depth');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);
  assertPositiveNumber(input.baseTonsPerCubicYard, 'Base tons per cubic yard');

  const wasteFactor = 1 + input.wastePercent / 100;
  const baseCubicFeet = input.areaSquareFeet * (input.baseDepthInches / 12) * wasteFactor;
  const beddingCubicFeet = input.areaSquareFeet * (input.beddingDepthInches / 12) * wasteFactor;
  const baseCubicYards = baseCubicFeet / 27;
  const beddingCubicYards = beddingCubicFeet / 27;

  return {
    ...input,
    baseCubicFeet,
    baseCubicYards,
    baseTons: baseCubicYards * input.baseTonsPerCubicYard,
    beddingCubicFeet,
    beddingCubicYards,
  };
}

export function calculatePolymericSandEstimate(input: {
  areaSquareFeet: number;
  paverLengthInches: number;
  paverWidthInches: number;
  jointWidthInches: number;
  jointDepthInches: number;
  wastePercent: number;
  bagCoverageCubicFeet: number;
}): PolymericSandEstimateResult {
  assertPositiveNumber(input.areaSquareFeet, 'Area');
  assertPositiveNumber(input.paverLengthInches, 'Paver length');
  assertPositiveNumber(input.paverWidthInches, 'Paver width');
  assertPositiveNumber(input.jointWidthInches, 'Joint width');
  assertPositiveNumber(input.jointDepthInches, 'Joint depth');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);
  assertPositiveNumber(input.bagCoverageCubicFeet, 'Bag coverage');

  const paverAreaSquareFeet = (input.paverLengthInches * input.paverWidthInches) / 144;
  const estimatedPavers = input.areaSquareFeet / paverAreaSquareFeet;
  const jointVolumePerPaverCubicInches = (input.paverLengthInches + input.paverWidthInches) * input.jointWidthInches * input.jointDepthInches;
  const rawCubicFeet = (estimatedPavers * jointVolumePerPaverCubicInches) / 1728;
  const cubicFeet = rawCubicFeet * (1 + input.wastePercent / 100);

  return {
    ...input,
    paverAreaSquareFeet,
    estimatedPavers,
    rawCubicFeet,
    cubicFeet,
    bagsNeeded: Math.ceil(cubicFeet / input.bagCoverageCubicFeet - 1e-10),
  };
}

export function calculateGrassSeedEstimate(input: {
  lawnAreaSquareFeet: number;
  seedRatePoundsPer1000SquareFeet: number;
  wastePercent: number;
  bagWeightPounds: number;
  pricePerBag?: number | null;
}): GrassSeedEstimateResult {
  assertPositiveNumber(input.lawnAreaSquareFeet, 'Lawn area');
  assertPositiveNumber(input.seedRatePoundsPer1000SquareFeet, 'Seed rate');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);
  assertPositiveNumber(input.bagWeightPounds, 'Bag weight');

  const pricePerBag = input.pricePerBag ?? null;
  if (pricePerBag !== null) {
    assertNonNegativeNumber(pricePerBag, 'Price per bag');
  }

  const adjustedAreaSquareFeet = input.lawnAreaSquareFeet * (1 + input.wastePercent / 100);
  const seedPounds = (adjustedAreaSquareFeet / 1000) * input.seedRatePoundsPer1000SquareFeet;
  const bagsNeeded = Math.ceil(seedPounds / input.bagWeightPounds - 1e-10);

  return {
    ...input,
    pricePerBag,
    adjustedAreaSquareFeet,
    seedPounds,
    bagsNeeded,
    estimatedCost: pricePerBag === null ? null : bagsNeeded * pricePerBag,
  };
}

export function calculateLawnMowingTime(input: {
  lawnAreaSquareFeet: number;
  mowerWidthInches: number;
  speedMph: number;
  efficiencyPercent: number;
}): LawnMowingTimeResult {
  assertPositiveNumber(input.lawnAreaSquareFeet, 'Lawn area');
  assertPositiveNumber(input.mowerWidthInches, 'Mower width');
  assertPositiveNumber(input.speedMph, 'Speed');
  assertPositiveNumber(input.efficiencyPercent, 'Efficiency percent');
  if (input.efficiencyPercent > 100) {
    throw new Error('Efficiency percent cannot be greater than 100%');
  }

  const effectiveWidthFeet = input.mowerWidthInches / 12;
  const squareFeetPerHour = effectiveWidthFeet * input.speedMph * 5280 * (input.efficiencyPercent / 100);
  const hours = input.lawnAreaSquareFeet / squareFeetPerHour;

  return {
    ...input,
    effectiveWidthFeet,
    squareFeetPerHour,
    hours,
    minutes: hours * 60,
    acres: input.lawnAreaSquareFeet / 43560,
  };
}

export function calculatePlantSpacingEstimate(input: {
  bedLengthFeet: number;
  bedWidthFeet: number;
  spacingInches: number;
  pattern: PlantSpacingPattern;
}): PlantSpacingEstimateResult {
  assertPositiveNumber(input.bedLengthFeet, 'Bed length');
  assertPositiveNumber(input.bedWidthFeet, 'Bed width');
  assertPositiveNumber(input.spacingInches, 'Spacing');
  if (input.pattern !== 'square' && input.pattern !== 'triangular') {
    throw new Error('Pattern must be square or triangular');
  }

  const rowSpacingInches = input.pattern === 'triangular' ? input.spacingInches * (Math.sqrt(3) / 2) : input.spacingInches;
  const columns = Math.max(1, Math.floor((input.bedWidthFeet * 12) / input.spacingInches));
  const rows = Math.max(1, Math.floor((input.bedLengthFeet * 12) / rowSpacingInches));

  return {
    ...input,
    areaSquareFeet: input.bedLengthFeet * input.bedWidthFeet,
    columns,
    rows,
    rowSpacingInches,
    plantsNeeded: columns * rows,
  };
}

export function calculateSidingEstimate(input: {
  wallAreaSquareFeet: number;
  openingsSquareFeet: number;
  wastePercent: number;
  pricePerSquare?: number | null;
}): SidingEstimateResult {
  assertPositiveNumber(input.wallAreaSquareFeet, 'Wall area');
  assertNonNegativeNumber(input.openingsSquareFeet, 'Openings');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);

  const pricePerSquare = input.pricePerSquare ?? null;
  if (pricePerSquare !== null) {
    assertNonNegativeNumber(pricePerSquare, 'Price per square');
  }

  const netAreaSquareFeet = Math.max(0, input.wallAreaSquareFeet - input.openingsSquareFeet);
  const adjustedAreaSquareFeet = netAreaSquareFeet * (1 + input.wastePercent / 100);
  const squaresNeeded = Math.ceil(adjustedAreaSquareFeet / 100 - 1e-10);

  return {
    ...input,
    pricePerSquare,
    netAreaSquareFeet,
    adjustedAreaSquareFeet,
    squaresNeeded,
    estimatedCost: pricePerSquare === null ? null : squaresNeeded * pricePerSquare,
  };
}

export function calculateBrickEstimate(input: {
  wallAreaSquareFeet: number;
  brickLengthInches: number;
  brickHeightInches: number;
  mortarJointInches: number;
  wastePercent: number;
}): BrickEstimateResult {
  assertPositiveNumber(input.wallAreaSquareFeet, 'Wall area');
  assertPositiveNumber(input.brickLengthInches, 'Brick length');
  assertPositiveNumber(input.brickHeightInches, 'Brick height');
  assertNonNegativeNumber(input.mortarJointInches, 'Mortar joint');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);

  const brickFaceSquareFeet = ((input.brickLengthInches + input.mortarJointInches) * (input.brickHeightInches + input.mortarJointInches)) / 144;
  const adjustedAreaSquareFeet = input.wallAreaSquareFeet * (1 + input.wastePercent / 100);

  return {
    ...input,
    brickFaceSquareFeet,
    adjustedAreaSquareFeet,
    bricksNeeded: Math.ceil(adjustedAreaSquareFeet / brickFaceSquareFeet - 1e-10),
  };
}

export function calculateConcreteBlockEstimate(input: {
  wallLengthFeet: number;
  wallHeightFeet: number;
  blockLengthInches: number;
  blockHeightInches: number;
  openingsSquareFeet: number;
  wastePercent: number;
}): ConcreteBlockEstimateResult {
  assertPositiveNumber(input.wallLengthFeet, 'Wall length');
  assertPositiveNumber(input.wallHeightFeet, 'Wall height');
  assertPositiveNumber(input.blockLengthInches, 'Block length');
  assertPositiveNumber(input.blockHeightInches, 'Block height');
  assertNonNegativeNumber(input.openingsSquareFeet, 'Openings');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);

  const wallAreaSquareFeet = input.wallLengthFeet * input.wallHeightFeet;
  const netWallAreaSquareFeet = Math.max(0, wallAreaSquareFeet - input.openingsSquareFeet);
  const adjustedAreaSquareFeet = netWallAreaSquareFeet * (1 + input.wastePercent / 100);
  const blockFaceSquareFeet = (input.blockLengthInches * input.blockHeightInches) / 144;

  return {
    ...input,
    blockFaceSquareFeet,
    netWallAreaSquareFeet,
    adjustedAreaSquareFeet,
    blocksNeeded: Math.ceil(adjustedAreaSquareFeet / blockFaceSquareFeet - 1e-10),
    courses: Math.ceil((input.wallHeightFeet * 12) / input.blockHeightInches - 1e-10),
    blocksPerCourse: Math.ceil((input.wallLengthFeet * 12) / input.blockLengthInches - 1e-10),
  };
}

export function calculateRebarGridEstimate(input: {
  slabLengthFeet: number;
  slabWidthFeet: number;
  spacingInches: number;
  barLengthFeet: number;
  wastePercent: number;
}): RebarGridEstimateResult {
  assertPositiveNumber(input.slabLengthFeet, 'Slab length');
  assertPositiveNumber(input.slabWidthFeet, 'Slab width');
  assertPositiveNumber(input.spacingInches, 'Spacing');
  assertPositiveNumber(input.barLengthFeet, 'Bar length');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);

  const lengthwiseBars = Math.floor((input.slabWidthFeet * 12) / input.spacingInches) + 1;
  const widthwiseBars = Math.floor((input.slabLengthFeet * 12) / input.spacingInches) + 1;
  const rawLinearFeet = lengthwiseBars * input.slabLengthFeet + widthwiseBars * input.slabWidthFeet;
  const adjustedLinearFeet = rawLinearFeet * (1 + input.wastePercent / 100);

  return {
    ...input,
    lengthwiseBars,
    widthwiseBars,
    rawLinearFeet,
    adjustedLinearFeet,
    barsToBuy: Math.ceil(adjustedLinearFeet / input.barLengthFeet - 1e-10),
  };
}

const CONCRETE_SIXTY_POUND_BAG_CUBIC_FEET = 0.45;
const CONCRETE_EIGHTY_POUND_BAG_CUBIC_FEET = 0.6;

function concreteBagCounts(cubicFeet: number) {
  return {
    sixtyPoundBags: Math.ceil(cubicFeet / CONCRETE_SIXTY_POUND_BAG_CUBIC_FEET - 1e-10),
    eightyPoundBags: Math.ceil(cubicFeet / CONCRETE_EIGHTY_POUND_BAG_CUBIC_FEET - 1e-10),
  };
}

export function calculateConcreteMixEstimate(input: {
  cubicYards: number;
  cementParts: number;
  sandParts: number;
  gravelParts: number;
  cementBagCubicFeet: number;
  wastePercent: number;
}): ConcreteMixEstimateResult {
  assertPositiveNumber(input.cubicYards, 'Concrete volume');
  assertPositiveNumber(input.cementParts, 'Cement parts');
  assertPositiveNumber(input.sandParts, 'Sand parts');
  assertPositiveNumber(input.gravelParts, 'Gravel parts');
  assertPositiveNumber(input.cementBagCubicFeet, 'Cement bag yield');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);

  const rawCubicFeet = input.cubicYards * 27;
  const adjustedCubicFeet = rawCubicFeet * (1 + input.wastePercent / 100);
  const totalParts = input.cementParts + input.sandParts + input.gravelParts;
  const cementCubicFeet = adjustedCubicFeet * (input.cementParts / totalParts);
  const sandCubicFeet = adjustedCubicFeet * (input.sandParts / totalParts);
  const gravelCubicFeet = adjustedCubicFeet * (input.gravelParts / totalParts);

  return {
    ...input,
    rawCubicFeet,
    adjustedCubicFeet,
    adjustedCubicYards: adjustedCubicFeet / 27,
    cementCubicFeet,
    sandCubicFeet,
    gravelCubicFeet,
    cementBags: Math.ceil(cementCubicFeet / input.cementBagCubicFeet - 1e-10),
  };
}

export function calculateConcreteDrivewayEstimate(input: {
  lengthFeet: number;
  widthFeet: number;
  depthInches: number;
  wastePercent: number;
  pricePerCubicYard?: number | null;
}): ConcreteDrivewayEstimateResult {
  assertPositiveNumber(input.lengthFeet, 'Driveway length');
  assertPositiveNumber(input.widthFeet, 'Driveway width');
  assertPositiveNumber(input.depthInches, 'Slab depth');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);

  const pricePerCubicYard = input.pricePerCubicYard ?? null;
  if (pricePerCubicYard !== null) {
    assertNonNegativeNumber(pricePerCubicYard, 'Price per cubic yard');
  }

  const cubicFeet = input.lengthFeet * input.widthFeet * (input.depthInches / 12) * (1 + input.wastePercent / 100);
  const cubicYards = cubicFeet / 27;

  return {
    ...input,
    pricePerCubicYard,
    cubicFeet,
    cubicYards,
    ...concreteBagCounts(cubicFeet),
    estimatedCost: pricePerCubicYard === null ? null : cubicYards * pricePerCubicYard,
  };
}

export function calculateConcreteStepsEstimate(input: {
  stepCount: number;
  widthFeet: number;
  riserHeightInches: number;
  treadDepthInches: number;
  landingDepthFeet: number;
  wastePercent: number;
}): ConcreteStepsEstimateResult {
  assertPositiveNumber(input.stepCount, 'Step count');
  assertInteger(input.stepCount, 'Step count');
  assertPositiveNumber(input.widthFeet, 'Step width');
  assertPositiveNumber(input.riserHeightInches, 'Riser height');
  assertPositiveNumber(input.treadDepthInches, 'Tread depth');
  assertNonNegativeNumber(input.landingDepthFeet, 'Landing depth');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);

  const riserFeet = input.riserHeightInches / 12;
  const treadFeet = input.treadDepthInches / 12;
  const triangularStepCount = (input.stepCount * (input.stepCount + 1)) / 2;
  const stairCubicFeet = input.widthFeet * treadFeet * riserFeet * triangularStepCount;
  const landingCubicFeet = input.landingDepthFeet * input.widthFeet * riserFeet * input.stepCount;
  const cubicFeet = (stairCubicFeet + landingCubicFeet) * (1 + input.wastePercent / 100);

  return {
    ...input,
    stairCubicFeet,
    landingCubicFeet,
    cubicFeet,
    cubicYards: cubicFeet / 27,
    ...concreteBagCounts(cubicFeet),
  };
}

export function calculateConcreteWeightEstimate(input: {
  cubicYards: number;
  densityPoundsPerCubicFoot: number;
  wastePercent: number;
}): ConcreteWeightEstimateResult {
  assertPositiveNumber(input.cubicYards, 'Concrete volume');
  assertPositiveNumber(input.densityPoundsPerCubicFoot, 'Concrete density');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);

  const cubicFeet = input.cubicYards * 27 * (1 + input.wastePercent / 100);
  const totalPounds = cubicFeet * input.densityPoundsPerCubicFoot;

  return {
    ...input,
    cubicFeet,
    totalPounds,
    totalTons: totalPounds / 2000,
  };
}

export function calculateConcreteReinforcingMeshEstimate(input: {
  slabLengthFeet: number;
  slabWidthFeet: number;
  sheetLengthFeet: number;
  sheetWidthFeet: number;
  overlapInches: number;
  wastePercent: number;
}): ConcreteReinforcingMeshEstimateResult {
  assertPositiveNumber(input.slabLengthFeet, 'Slab length');
  assertPositiveNumber(input.slabWidthFeet, 'Slab width');
  assertPositiveNumber(input.sheetLengthFeet, 'Mesh sheet length');
  assertPositiveNumber(input.sheetWidthFeet, 'Mesh sheet width');
  assertNonNegativeNumber(input.overlapInches, 'Overlap');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);

  const overlapFeet = input.overlapInches / 12;
  const effectiveLength = input.sheetLengthFeet - overlapFeet;
  const effectiveWidth = input.sheetWidthFeet - overlapFeet;
  if (effectiveLength <= 0 || effectiveWidth <= 0) {
    throw new Error('Overlap must be smaller than the mesh sheet dimensions');
  }

  const slabAreaSquareFeet = input.slabLengthFeet * input.slabWidthFeet;
  const adjustedAreaSquareFeet = slabAreaSquareFeet * (1 + input.wastePercent / 100);
  const effectiveSheetAreaSquareFeet = effectiveLength * effectiveWidth;

  return {
    ...input,
    slabAreaSquareFeet,
    adjustedAreaSquareFeet,
    effectiveSheetAreaSquareFeet,
    sheetsNeeded: Math.ceil(adjustedAreaSquareFeet / effectiveSheetAreaSquareFeet - 1e-10),
  };
}

export function calculateConcreteBlockFillEstimate(input: {
  blockCount: number;
  fillCubicFeetPerBlock: number;
  wastePercent: number;
}): ConcreteBlockFillEstimateResult {
  assertPositiveNumber(input.blockCount, 'Block count');
  assertInteger(input.blockCount, 'Block count');
  assertPositiveNumber(input.fillCubicFeetPerBlock, 'Fill per block');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);

  const cubicFeet = input.blockCount * input.fillCubicFeetPerBlock * (1 + input.wastePercent / 100);

  return {
    ...input,
    cubicFeet,
    cubicYards: cubicFeet / 27,
    ...concreteBagCounts(cubicFeet),
  };
}

export function calculateRetainingWallEstimate(input: {
  wallLengthFeet: number;
  wallHeightFeet: number;
  blockLengthInches: number;
  blockHeightInches: number;
  capLengthInches: number;
  baseDepthInches: number;
  baseWidthInches: number;
  wastePercent: number;
}): RetainingWallEstimateResult {
  assertPositiveNumber(input.wallLengthFeet, 'Wall length');
  assertPositiveNumber(input.wallHeightFeet, 'Wall height');
  assertPositiveNumber(input.blockLengthInches, 'Block length');
  assertPositiveNumber(input.blockHeightInches, 'Block height');
  assertPositiveNumber(input.capLengthInches, 'Cap length');
  assertPositiveNumber(input.baseDepthInches, 'Base depth');
  assertPositiveNumber(input.baseWidthInches, 'Base width');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);

  const courses = Math.ceil((input.wallHeightFeet * 12) / input.blockHeightInches - 1e-10);
  const blocksPerCourse = Math.ceil((input.wallLengthFeet * 12) / input.blockLengthInches - 1e-10);
  const wasteFactor = 1 + input.wastePercent / 100;
  const baseCubicFeet = input.wallLengthFeet * (input.baseWidthInches / 12) * (input.baseDepthInches / 12) * wasteFactor;

  return {
    ...input,
    courses,
    blocksPerCourse,
    wallBlocks: Math.ceil(courses * blocksPerCourse * wasteFactor - 1e-10),
    capBlocks: Math.ceil(((input.wallLengthFeet * 12) / input.capLengthInches) * wasteFactor - 1e-10),
    baseCubicFeet,
    baseCubicYards: baseCubicFeet / 27,
  };
}

const REBAR_WEIGHT_PER_FOOT_POUNDS: Record<RebarSize, number> = {
  '#3': 0.376,
  '#4': 0.668,
  '#5': 1.043,
  '#6': 1.502,
  '#7': 2.044,
  '#8': 2.67,
};

export function calculateRebarWeightEstimate(input: {
  rebarSize: RebarSize;
  lengthFeet: number;
  quantity: number;
  wastePercent: number;
}): RebarWeightEstimateResult {
  if (!(input.rebarSize in REBAR_WEIGHT_PER_FOOT_POUNDS)) {
    throw new Error('Choose a supported rebar size from #3 to #8');
  }
  assertPositiveNumber(input.lengthFeet, 'Rebar length');
  assertPositiveNumber(input.quantity, 'Quantity');
  assertInteger(input.quantity, 'Quantity');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);

  const weightPerFootPounds = REBAR_WEIGHT_PER_FOOT_POUNDS[input.rebarSize];
  const adjustedLengthFeet = input.lengthFeet * input.quantity * (1 + input.wastePercent / 100);
  const totalPounds = adjustedLengthFeet * weightPerFootPounds;

  return {
    ...input,
    weightPerFootPounds,
    adjustedLengthFeet,
    totalPounds,
    totalTons: totalPounds / 2000,
  };
}

export function calculateConcreteFootingEstimate(input: {
  lengthFeet: number;
  widthInches: number;
  depthInches: number;
  wastePercent: number;
}): ConcreteFootingEstimateResult {
  assertPositiveNumber(input.lengthFeet, 'Footing length');
  assertPositiveNumber(input.widthInches, 'Footing width');
  assertPositiveNumber(input.depthInches, 'Footing depth');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);

  const cubicFeet = input.lengthFeet * (input.widthInches / 12) * (input.depthInches / 12) * (1 + input.wastePercent / 100);

  return {
    ...input,
    cubicFeet,
    cubicYards: cubicFeet / 27,
    ...concreteBagCounts(cubicFeet),
  };
}

export function calculateConcreteColumnEstimate(input: {
  diameterInches: number;
  heightFeet: number;
  quantity: number;
  wastePercent: number;
}): ConcreteColumnEstimateResult {
  assertPositiveNumber(input.diameterInches, 'Column diameter');
  assertPositiveNumber(input.heightFeet, 'Column height');
  assertPositiveNumber(input.quantity, 'Quantity');
  assertInteger(input.quantity, 'Quantity');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);

  const radiusFeet = input.diameterInches / 24;
  const cubicFeet = Math.PI * radiusFeet ** 2 * input.heightFeet * input.quantity * (1 + input.wastePercent / 100);

  return {
    ...input,
    cubicFeet,
    cubicYards: cubicFeet / 27,
    ...concreteBagCounts(cubicFeet),
  };
}

export function calculatePostHoleConcreteEstimate(input: {
  holeDiameterInches: number;
  holeDepthInches: number;
  postDiameterInches: number;
  quantity: number;
  wastePercent: number;
}): PostHoleConcreteEstimateResult {
  assertPositiveNumber(input.holeDiameterInches, 'Hole diameter');
  assertPositiveNumber(input.holeDepthInches, 'Hole depth');
  assertPositiveNumber(input.postDiameterInches, 'Post diameter');
  assertPositiveNumber(input.quantity, 'Quantity');
  assertInteger(input.quantity, 'Quantity');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);

  if (input.postDiameterInches >= input.holeDiameterInches) {
    throw new Error('Post diameter must be smaller than hole diameter');
  }

  const holeRadiusFeet = input.holeDiameterInches / 24;
  const postRadiusFeet = input.postDiameterInches / 24;
  const depthFeet = input.holeDepthInches / 12;
  const holeCubicFeet = Math.PI * holeRadiusFeet ** 2 * depthFeet;
  const postCubicFeet = Math.PI * postRadiusFeet ** 2 * depthFeet;
  const netConcretePerHoleCubicFeet = holeCubicFeet - postCubicFeet;
  const cubicFeet = netConcretePerHoleCubicFeet * input.quantity * (1 + input.wastePercent / 100);

  return {
    ...input,
    netConcretePerHoleCubicFeet,
    cubicFeet,
    cubicYards: cubicFeet / 27,
    ...concreteBagCounts(cubicFeet),
  };
}

export function calculatePlywoodEstimate(input: {
  areaSquareFeet: number;
  sheetWidthFeet: number;
  sheetLengthFeet: number;
  wastePercent: number;
  pricePerSheet?: number | null;
}): PlywoodEstimateResult {
  assertPositiveNumber(input.areaSquareFeet, 'Area');
  assertPositiveNumber(input.sheetWidthFeet, 'Sheet width');
  assertPositiveNumber(input.sheetLengthFeet, 'Sheet length');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);

  const pricePerSheet = input.pricePerSheet ?? null;
  if (pricePerSheet !== null) {
    assertNonNegativeNumber(pricePerSheet, 'Price per sheet');
  }

  const sheetAreaSquareFeet = input.sheetWidthFeet * input.sheetLengthFeet;
  const adjustedAreaSquareFeet = input.areaSquareFeet * (1 + input.wastePercent / 100);
  const sheetsNeeded = Math.ceil(adjustedAreaSquareFeet / sheetAreaSquareFeet - 1e-10);

  return {
    ...input,
    pricePerSheet,
    sheetAreaSquareFeet,
    adjustedAreaSquareFeet,
    sheetsNeeded,
    totalCoverageSquareFeet: sheetsNeeded * sheetAreaSquareFeet,
    estimatedCost: pricePerSheet === null ? null : sheetsNeeded * pricePerSheet,
  };
}

export function calculateInsulationEstimate(input: {
  areaSquareFeet: number;
  openingsSquareFeet: number;
  coveragePerPackSquareFeet: number;
  wastePercent: number;
  pricePerPack?: number | null;
}): InsulationEstimateResult {
  assertPositiveNumber(input.areaSquareFeet, 'Area');
  assertNonNegativeNumber(input.openingsSquareFeet, 'Openings');
  assertPositiveNumber(input.coveragePerPackSquareFeet, 'Coverage per pack');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);

  const pricePerPack = input.pricePerPack ?? null;
  if (pricePerPack !== null) {
    assertNonNegativeNumber(pricePerPack, 'Price per pack');
  }

  const netAreaSquareFeet = Math.max(0, input.areaSquareFeet - input.openingsSquareFeet);
  const adjustedAreaSquareFeet = netAreaSquareFeet * (1 + input.wastePercent / 100);
  const packsNeeded = Math.ceil(adjustedAreaSquareFeet / input.coveragePerPackSquareFeet - 1e-10);

  return {
    ...input,
    pricePerPack,
    netAreaSquareFeet,
    adjustedAreaSquareFeet,
    packsNeeded,
    totalCoverageSquareFeet: packsNeeded * input.coveragePerPackSquareFeet,
    estimatedCost: pricePerPack === null ? null : packsNeeded * pricePerPack,
  };
}

export function calculateCountertopEstimate(input: {
  lengthFeet: number;
  depthInches: number;
  backsplashLengthFeet: number;
  backsplashHeightInches: number;
  cutoutSquareFeet: number;
  wastePercent: number;
  pricePerSquareFoot?: number | null;
}): CountertopEstimateResult {
  assertPositiveNumber(input.lengthFeet, 'Countertop length');
  assertPositiveNumber(input.depthInches, 'Countertop depth');
  assertNonNegativeNumber(input.backsplashLengthFeet, 'Backsplash length');
  assertNonNegativeNumber(input.backsplashHeightInches, 'Backsplash height');
  assertNonNegativeNumber(input.cutoutSquareFeet, 'Cutout area');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);

  const pricePerSquareFoot = input.pricePerSquareFoot ?? null;
  if (pricePerSquareFoot !== null) {
    assertNonNegativeNumber(pricePerSquareFoot, 'Price per square foot');
  }

  const topAreaSquareFeet = input.lengthFeet * (input.depthInches / 12);
  const backsplashAreaSquareFeet = input.backsplashLengthFeet * (input.backsplashHeightInches / 12);
  const netAreaSquareFeet = Math.max(0, topAreaSquareFeet + backsplashAreaSquareFeet - input.cutoutSquareFeet);
  const adjustedAreaSquareFeet = netAreaSquareFeet * (1 + input.wastePercent / 100);

  return {
    ...input,
    pricePerSquareFoot,
    topAreaSquareFeet,
    backsplashAreaSquareFeet,
    netAreaSquareFeet,
    adjustedAreaSquareFeet,
    estimatedCost: pricePerSquareFoot === null ? null : adjustedAreaSquareFeet * pricePerSquareFoot,
  };
}

export function calculateSodEstimate(input: {
  lawnAreaSquareFeet: number;
  rollCoverageSquareFeet: number;
  rollsPerPallet: number;
  wastePercent: number;
  pricePerRoll?: number | null;
}): SodEstimateResult {
  assertPositiveNumber(input.lawnAreaSquareFeet, 'Lawn area');
  assertPositiveNumber(input.rollCoverageSquareFeet, 'Roll coverage');
  assertPositiveNumber(input.rollsPerPallet, 'Rolls per pallet');
  assertInteger(input.rollsPerPallet, 'Rolls per pallet');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);

  const pricePerRoll = input.pricePerRoll ?? null;
  if (pricePerRoll !== null) {
    assertNonNegativeNumber(pricePerRoll, 'Price per roll');
  }

  const adjustedAreaSquareFeet = input.lawnAreaSquareFeet * (1 + input.wastePercent / 100);
  const rollsNeeded = Math.ceil(adjustedAreaSquareFeet / input.rollCoverageSquareFeet - 1e-10);

  return {
    ...input,
    pricePerRoll,
    adjustedAreaSquareFeet,
    rollsNeeded,
    palletsNeeded: Math.ceil(rollsNeeded / input.rollsPerPallet - 1e-10),
    estimatedCost: pricePerRoll === null ? null : rollsNeeded * pricePerRoll,
  };
}

export function calculateWallStudEstimate(input: {
  wallLengthFeet: number;
  wallHeightFeet: number;
  spacingInches: number;
  openingsCount: number;
  extraCornerStuds: number;
  plates: number;
  boardLengthFeet: number;
  wastePercent: number;
}): WallStudEstimateResult {
  assertPositiveNumber(input.wallLengthFeet, 'Wall length');
  assertPositiveNumber(input.wallHeightFeet, 'Wall height');
  assertPositiveNumber(input.spacingInches, 'Stud spacing');
  assertNonNegativeNumber(input.openingsCount, 'Openings');
  assertInteger(input.openingsCount, 'Openings');
  assertNonNegativeNumber(input.extraCornerStuds, 'Extra corner studs');
  assertInteger(input.extraCornerStuds, 'Extra corner studs');
  assertPositiveNumber(input.plates, 'Plate rows');
  assertInteger(input.plates, 'Plate rows');
  assertPositiveNumber(input.boardLengthFeet, 'Board length');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);

  const layoutStuds = Math.floor((input.wallLengthFeet * 12) / input.spacingInches) + 1;
  const verticalStuds = layoutStuds + input.openingsCount * 2 + input.extraCornerStuds;
  const verticalStudsWithWaste = Math.ceil(verticalStuds * (1 + input.wastePercent / 100) - 1e-10);
  const platePieces = Math.ceil((input.wallLengthFeet * input.plates) / input.boardLengthFeet - 1e-10);
  const estimatedLinearFeet = verticalStuds * input.wallHeightFeet + input.wallLengthFeet * input.plates;

  return {
    ...input,
    layoutStuds,
    verticalStuds,
    verticalStudsWithWaste,
    platePieces,
    totalPieces: verticalStudsWithWaste + platePieces,
    estimatedLinearFeet,
    estimatedLinearFeetWithWaste: estimatedLinearFeet * (1 + input.wastePercent / 100),
  };
}

export function calculateBoardFoot(
  thicknessInches: number,
  widthInches: number,
  lengthFeet: number,
  quantity: number,
): BoardFootResult {
  assertPositiveNumber(thicknessInches, 'Thickness');
  assertPositiveNumber(widthInches, 'Width');
  assertPositiveNumber(lengthFeet, 'Length');
  assertPositiveNumber(quantity, 'Quantity');
  assertInteger(quantity, 'Quantity');

  const boardFeetEach = (thicknessInches * widthInches * lengthFeet) / 12;

  return {
    thicknessInches,
    widthInches,
    lengthFeet,
    quantity,
    boardFeetEach,
    totalBoardFeet: boardFeetEach * quantity,
  };
}

export function calculateCubicYardEstimate(
  lengthFeet: number,
  widthFeet: number,
  depthInches: number,
  wastePercent: number,
): CubicYardEstimateResult {
  assertPositiveNumber(lengthFeet, 'Length');
  assertPositiveNumber(widthFeet, 'Width');
  assertPositiveNumber(depthInches, 'Depth');
  assertPercentRange(wastePercent, 'Waste percent', 100);

  const cubicFeet = lengthFeet * widthFeet * (depthInches / 12) * (1 + wastePercent / 100);

  return {
    lengthFeet,
    widthFeet,
    depthInches,
    wastePercent,
    cubicFeet,
    cubicYards: cubicFeet / 27,
  };
}

export function calculatePoolVolume(
  shape: PoolShape,
  lengthFeet: number,
  widthFeet: number,
  averageDepthFeet: number,
): PoolVolumeResult {
  assertPositiveNumber(lengthFeet, 'Length or diameter');
  assertPositiveNumber(widthFeet, 'Width or diameter');
  assertPositiveNumber(averageDepthFeet, 'Average depth');

  if (!['rectangle', 'round', 'oval'].includes(shape)) {
    throw new Error('Choose a supported pool shape');
  }

  const surfaceFactor = shape === 'rectangle' ? 1 : Math.PI / 4;
  const cubicFeet = lengthFeet * widthFeet * averageDepthFeet * surfaceFactor;

  return {
    shape,
    lengthFeet,
    widthFeet,
    averageDepthFeet,
    surfaceFactor,
    cubicFeet,
    gallons: cubicFeet * 7.48052,
  };
}

function calculateBulkMaterialEstimate(input: {
  lengthFeet: number;
  widthFeet: number;
  depthInches: number;
  tonsPerCubicYard: number;
  wastePercent: number;
}): BulkMaterialEstimateResult {
  assertPositiveNumber(input.lengthFeet, 'Length');
  assertPositiveNumber(input.widthFeet, 'Width');
  assertPositiveNumber(input.depthInches, 'Depth');
  assertPositiveNumber(input.tonsPerCubicYard, 'Tons per cubic yard');
  assertPercentRange(input.wastePercent, 'Waste percent', 100);

  const cubicFeet = input.lengthFeet * input.widthFeet * (input.depthInches / 12) * (1 + input.wastePercent / 100);
  const cubicYards = cubicFeet / 27;

  return {
    ...input,
    cubicFeet,
    cubicYards,
    tons: cubicYards * input.tonsPerCubicYard,
  };
}

export function calculateSandEstimate(input: {
  lengthFeet: number;
  widthFeet: number;
  depthInches: number;
  tonsPerCubicYard: number;
  wastePercent: number;
}): BulkMaterialEstimateResult {
  return calculateBulkMaterialEstimate(input);
}

export function calculateSoilEstimate(
  areaSquareFeet: number,
  depthInches: number,
  wastePercent: number,
): SoilEstimateResult {
  assertPositiveNumber(areaSquareFeet, 'Area');
  assertPositiveNumber(depthInches, 'Depth');
  assertPercentRange(wastePercent, 'Waste percent', 100);

  const cubicFeet = areaSquareFeet * (depthInches / 12) * (1 + wastePercent / 100);

  return {
    areaSquareFeet,
    depthInches,
    wastePercent,
    cubicFeet,
    cubicYards: cubicFeet / 27,
    oneAndHalfCubicFootBags: Math.ceil(cubicFeet / 1.5),
    twoCubicFootBags: Math.ceil(cubicFeet / 2),
  };
}

export function calculateAsphaltEstimate(input: {
  lengthFeet: number;
  widthFeet: number;
  depthInches: number;
  tonsPerCubicYard: number;
  wastePercent: number;
}): BulkMaterialEstimateResult {
  return calculateBulkMaterialEstimate(input);
}

export function calculateWindChill(temperatureFahrenheit: number, windSpeedMph: number): WeatherFeelsLikeResult {
  assertFiniteNumber(temperatureFahrenheit, 'Temperature');
  assertPositiveNumber(windSpeedMph, 'Wind speed');

  if (temperatureFahrenheit > 50) {
    throw new Error('Wind chill is intended for air temperatures of 50 F or colder');
  }

  if (windSpeedMph <= 3) {
    throw new Error('Wind chill is intended for wind speeds above 3 mph');
  }

  const windPower = windSpeedMph ** 0.16;
  const resultFahrenheit =
    35.74 +
    0.6215 * temperatureFahrenheit -
    35.75 * windPower +
    0.4275 * temperatureFahrenheit * windPower;

  return {
    temperatureFahrenheit,
    windSpeedMph,
    resultFahrenheit,
    resultCelsius: ((resultFahrenheit - 32) * 5) / 9,
  };
}

export function calculateHeatIndex(temperatureFahrenheit: number, relativeHumidity: number): WeatherFeelsLikeResult {
  assertFiniteNumber(temperatureFahrenheit, 'Temperature');
  assertPercentRange(relativeHumidity, 'Relative humidity', 100);

  const t = temperatureFahrenheit;
  const rh = relativeHumidity;
  const simpleHeatIndex = 0.5 * (t + 61 + (t - 68) * 1.2 + rh * 0.094);
  const averagedSimpleHeatIndex = (simpleHeatIndex + t) / 2;

  if (averagedSimpleHeatIndex < 80) {
    return {
      temperatureFahrenheit,
      relativeHumidity,
      resultFahrenheit: averagedSimpleHeatIndex,
      resultCelsius: ((averagedSimpleHeatIndex - 32) * 5) / 9,
    };
  }

  let resultFahrenheit =
    -42.379 +
    2.04901523 * t +
    10.14333127 * rh -
    0.22475541 * t * rh -
    0.00683783 * t * t -
    0.05481717 * rh * rh +
    0.00122874 * t * t * rh +
    0.00085282 * t * rh * rh -
    0.00000199 * t * t * rh * rh;

  if (rh < 13 && t >= 80 && t <= 112) {
    resultFahrenheit -= ((13 - rh) / 4) * Math.sqrt((17 - Math.abs(t - 95)) / 17);
  } else if (rh > 85 && t >= 80 && t <= 87) {
    resultFahrenheit += ((rh - 85) / 10) * ((87 - t) / 5);
  }

  return {
    temperatureFahrenheit,
    relativeHumidity,
    resultFahrenheit,
    resultCelsius: ((resultFahrenheit - 32) * 5) / 9,
  };
}

export function calculateDewPoint(temperatureFahrenheit: number, relativeHumidity: number): WeatherFeelsLikeResult {
  assertFiniteNumber(temperatureFahrenheit, 'Temperature');
  assertPercentRange(relativeHumidity, 'Relative humidity', 100);

  if (relativeHumidity <= 0) {
    throw new Error('Relative humidity must be greater than zero');
  }

  const temperatureCelsius = ((temperatureFahrenheit - 32) * 5) / 9;
  const a = 17.625;
  const b = 243.04;
  const gamma = Math.log(relativeHumidity / 100) + (a * temperatureCelsius) / (b + temperatureCelsius);
  const resultCelsius = (b * gamma) / (a - gamma);
  const resultFahrenheit = (resultCelsius * 9) / 5 + 32;

  return {
    temperatureFahrenheit,
    relativeHumidity,
    resultFahrenheit,
    resultCelsius,
  };
}

export function calculateBandwidthTime(
  dataAmount: number,
  dataUnit: string,
  speedAmount: number,
  speedUnit: string,
): BandwidthTimeResult {
  assertPositiveNumber(dataAmount, 'Data amount');
  assertPositiveNumber(speedAmount, 'Speed');

  const dataUnitBits: Record<string, number> = {
    KB: 8_000,
    MB: 8_000_000,
    GB: 8_000_000_000,
    TB: 8_000_000_000_000,
  };
  const speedUnitBitsPerSecond: Record<string, number> = {
    Kbps: 1_000,
    Mbps: 1_000_000,
    Gbps: 1_000_000_000,
  };
  const bits = dataAmount * (dataUnitBits[dataUnit] ?? 0);
  const bitsPerSecond = speedAmount * (speedUnitBitsPerSecond[speedUnit] ?? 0);

  if (!bits || !bitsPerSecond) {
    throw new Error('Choose supported data and speed units');
  }

  const seconds = bits / bitsPerSecond;

  return {
    dataAmount,
    dataUnit,
    speedAmount,
    speedUnit,
    seconds,
    minutes: seconds / 60,
    hours: seconds / 3600,
  };
}

export function calculateAiTokenCost(
  inputTokensPerRequest: number,
  outputTokensPerRequest: number,
  requests: number,
  inputPricePerMillion: number,
  outputPricePerMillion: number,
  cachedInputTokensPerRequest = 0,
  cachedInputPricePerMillion?: number,
): AiTokenCostResult {
  assertNonNegativeNumber(inputTokensPerRequest, 'Input tokens per request');
  assertNonNegativeNumber(outputTokensPerRequest, 'Output tokens per request');
  assertPositiveNumber(requests, 'Requests');
  assertNonNegativeNumber(inputPricePerMillion, 'Input price per million tokens');
  assertNonNegativeNumber(outputPricePerMillion, 'Output price per million tokens');
  assertNonNegativeNumber(cachedInputTokensPerRequest, 'Cached input tokens per request');

  const effectiveCachedInputPricePerMillion = cachedInputPricePerMillion ?? inputPricePerMillion;
  assertNonNegativeNumber(effectiveCachedInputPricePerMillion, 'Cached input price per million tokens');

  if (cachedInputTokensPerRequest > inputTokensPerRequest) {
    throw new Error('Cached input tokens per request cannot exceed total input tokens per request');
  }

  const totalInputTokens = inputTokensPerRequest * requests;
  const uncachedInputTokensPerRequest = inputTokensPerRequest - cachedInputTokensPerRequest;
  const totalCachedInputTokens = cachedInputTokensPerRequest * requests;
  const totalUncachedInputTokens = uncachedInputTokensPerRequest * requests;
  const totalOutputTokens = outputTokensPerRequest * requests;
  const uncachedInputCost = (totalUncachedInputTokens / 1_000_000) * inputPricePerMillion;
  const cachedInputCost = (totalCachedInputTokens / 1_000_000) * effectiveCachedInputPricePerMillion;
  const inputCost = uncachedInputCost + cachedInputCost;
  const outputCost = (totalOutputTokens / 1_000_000) * outputPricePerMillion;
  const totalCost = inputCost + outputCost;
  const costPerRequest = totalCost / requests;
  const cacheSavings =
    (totalCachedInputTokens / 1_000_000) *
    (inputPricePerMillion - effectiveCachedInputPricePerMillion);

  return {
    inputTokensPerRequest,
    cachedInputTokensPerRequest,
    uncachedInputTokensPerRequest,
    outputTokensPerRequest,
    requests,
    inputPricePerMillion,
    cachedInputPricePerMillion: effectiveCachedInputPricePerMillion,
    outputPricePerMillion,
    totalInputTokens,
    totalCachedInputTokens,
    totalUncachedInputTokens,
    totalOutputTokens,
    inputCost,
    cachedInputCost,
    uncachedInputCost,
    outputCost,
    cacheSavings,
    totalCost,
    costPerRequest,
    costPerThousandRequests: costPerRequest * 1_000,
    requestsForOneHundredDollars: costPerRequest > 0 ? Math.floor(100 / costPerRequest) : null,
  };
}

export function estimatePromptTokens(text: string, averageCharactersPerToken = 4): PromptTokenEstimateResult {
  assertPositiveNumber(averageCharactersPerToken, 'Average characters per token');

  if (averageCharactersPerToken < 2 || averageCharactersPerToken > 8) {
    throw new Error('Average characters per token should be between 2 and 8');
  }

  const characters = Array.from(text).length;
  const words = tokenizeWords(text).length;
  const estimatedTokens = Math.ceil(characters / averageCharactersPerToken);

  return {
    text,
    characters,
    words,
    estimatedTokens,
    lowEstimate: Math.ceil(characters / 5),
    highEstimate: Math.ceil(characters / 3),
    averageCharactersPerToken,
  };
}

export function calculateApiPricing(
  requests: number,
  unitsPerRequest: number,
  pricePerUnit: number,
  platformFee = 0,
  retryPercent = 0,
): ApiPricingResult {
  assertPositiveNumber(requests, 'Requests');
  assertPositiveNumber(unitsPerRequest, 'Units per request');
  assertNonNegativeNumber(pricePerUnit, 'Price per unit');
  assertNonNegativeNumber(platformFee, 'Platform fee');
  assertPercentRange(retryPercent, 'Retry or overhead percent', 500);

  const billableUnits = requests * unitsPerRequest * (1 + retryPercent / 100);
  const usageCost = billableUnits * pricePerUnit;
  const totalCost = usageCost + platformFee;

  return {
    requests,
    unitsPerRequest,
    pricePerUnit,
    platformFee,
    retryPercent,
    billableUnits,
    usageCost,
    totalCost,
    averageCostPerRequest: totalCost / requests,
  };
}

export function calculateDownloadTime(
  fileSize: number,
  fileUnit: string,
  speedMbps: number,
  efficiencyPercent = 90,
): DownloadTimeResult {
  assertPositiveNumber(fileSize, 'File size');
  assertPositiveNumber(speedMbps, 'Download speed');
  assertPercentRange(efficiencyPercent, 'Efficiency percent', 100);

  if (efficiencyPercent <= 0) {
    throw new Error('Efficiency percent must be greater than zero');
  }

  const fileUnitBytes: Record<string, number> = {
    KB: 1_000,
    MB: 1_000_000,
    GB: 1_000_000_000,
    TB: 1_000_000_000_000,
  };
  const bytes = fileSize * (fileUnitBytes[fileUnit] ?? 0);

  if (!bytes) {
    throw new Error('Choose a supported file size unit');
  }

  const effectiveMbps = speedMbps * (efficiencyPercent / 100);
  const seconds = (bytes * 8) / (effectiveMbps * 1_000_000);

  return {
    fileSize,
    fileUnit,
    speedMbps,
    efficiencyPercent,
    seconds,
    minutes: seconds / 60,
    hours: seconds / 3600,
    effectiveMbps,
  };
}

export function calculateInternetSpeedNeeds(
  videoStreams: number,
  videoMbpsEach: number,
  gamingDevices: number,
  gamingMbpsEach: number,
  videoCalls: number,
  callMbpsEach: number,
  smartDevices: number,
  smartDeviceMbpsEach: number,
  bufferPercent = 25,
): InternetSpeedNeedsResult {
  assertNonNegativeNumber(videoStreams, 'Video streams');
  assertNonNegativeNumber(gamingDevices, 'Gaming devices');
  assertNonNegativeNumber(videoCalls, 'Video calls');
  assertNonNegativeNumber(smartDevices, 'Smart devices');
  assertNonNegativeNumber(videoMbpsEach, 'Video Mbps each');
  assertNonNegativeNumber(gamingMbpsEach, 'Gaming Mbps each');
  assertNonNegativeNumber(callMbpsEach, 'Video call Mbps each');
  assertNonNegativeNumber(smartDeviceMbpsEach, 'Smart device Mbps each');
  assertPercentRange(bufferPercent, 'Buffer percent', 300);

  const baseMbps =
    videoStreams * videoMbpsEach +
    gamingDevices * gamingMbpsEach +
    videoCalls * callMbpsEach +
    smartDevices * smartDeviceMbpsEach;
  const recommendedMbps = baseMbps * (1 + bufferPercent / 100);

  if (recommendedMbps <= 0) {
    throw new Error('Enter at least one active device or activity');
  }

  return {
    videoStreams,
    videoMbpsEach,
    gamingDevices,
    gamingMbpsEach,
    videoCalls,
    callMbpsEach,
    smartDevices,
    smartDeviceMbpsEach,
    bufferPercent,
    baseMbps,
    recommendedMbps,
  };
}

export function calculateStreamingBitrate(
  bitrate: number,
  bitrateUnit: string,
  hours: number,
  minutes: number,
  streams = 1,
): StreamingBitrateResult {
  assertPositiveNumber(bitrate, 'Bitrate');
  assertNonNegativeNumber(hours, 'Hours');
  assertNonNegativeNumber(minutes, 'Minutes');
  assertPositiveNumber(streams, 'Streams');

  const unitMegabitsPerSecond: Record<string, number> = {
    Kbps: 0.001,
    Mbps: 1,
  };
  const mbps = bitrate * (unitMegabitsPerSecond[bitrateUnit] ?? 0);
  const totalSeconds = (hours * 3600 + minutes * 60) * streams;

  if (!mbps) {
    throw new Error('Choose a supported bitrate unit');
  }

  if (totalSeconds <= 0) {
    throw new Error('Streaming time must be greater than zero');
  }

  const megabits = mbps * totalSeconds;
  const megabytes = megabits / 8;

  return {
    bitrate,
    bitrateUnit,
    hours,
    minutes,
    streams,
    totalSeconds,
    megabits,
    megabytes,
    gigabytes: megabytes / 1000,
  };
}

export function calculateDeviceBatteryLife(
  capacityMah: number,
  voltage: number,
  powerWatts: number,
  efficiencyPercent = 90,
): DeviceBatteryLifeResult {
  assertPositiveNumber(capacityMah, 'Battery capacity');
  assertPositiveNumber(voltage, 'Voltage');
  assertPositiveNumber(powerWatts, 'Power draw');
  assertPercentRange(efficiencyPercent, 'Efficiency percent', 100);

  if (efficiencyPercent <= 0) {
    throw new Error('Efficiency percent must be greater than zero');
  }

  const wattHours = (capacityMah * voltage) / 1000;
  const usableWattHours = wattHours * (efficiencyPercent / 100);
  const runtimeHours = usableWattHours / powerWatts;

  return {
    capacityMah,
    voltage,
    powerWatts,
    efficiencyPercent,
    wattHours,
    usableWattHours,
    runtimeHours,
    runtimeMinutes: runtimeHours * 60,
  };
}

export function calculateMonitorPpi(widthPixels: number, heightPixels: number, diagonalInches: number): MonitorPpiResult {
  assertPositiveNumber(widthPixels, 'Width pixels');
  assertPositiveNumber(heightPixels, 'Height pixels');
  assertPositiveNumber(diagonalInches, 'Diagonal inches');

  const diagonalPixels = Math.hypot(widthPixels, heightPixels);
  const divisor = greatestCommonDivisor(Math.round(widthPixels), Math.round(heightPixels));
  const aspectWidth = Math.round(widthPixels) / divisor;
  const aspectHeight = Math.round(heightPixels) / divisor;

  return {
    widthPixels,
    heightPixels,
    diagonalInches,
    diagonalPixels,
    ppi: diagonalPixels / diagonalInches,
    aspectWidth,
    aspectHeight,
    aspectLabel: `${aspectWidth}:${aspectHeight}`,
  };
}

const cookingVolumeUnitsToCups: Record<string, number> = {
  teaspoon: 1 / 48,
  tablespoon: 1 / 16,
  'fluid-ounce': 1 / 8,
  cup: 1,
  pint: 2,
  quart: 4,
  gallon: 16,
  milliliter: 1 / 236.5882365,
  liter: 4.22675284,
};

const cookingMassUnitsToGrams: Record<string, number> = {
  gram: 1,
  kilogram: 1000,
  ounce: 28.349523125,
  pound: 453.59237,
};

function cookingUnitKind(unit: string): 'volume' | 'mass' | null {
  if (unit in cookingVolumeUnitsToCups) {
    return 'volume';
  }

  if (unit in cookingMassUnitsToGrams) {
    return 'mass';
  }

  return null;
}

function convertCookingAmount(amount: number, fromUnit: string, toUnit: string, densityGramsPerCup: number) {
  assertPositiveNumber(amount, 'Amount');
  assertPositiveNumber(densityGramsPerCup, 'Ingredient density');

  const fromKind = cookingUnitKind(fromUnit);
  const toKind = cookingUnitKind(toUnit);

  if (!fromKind || !toKind) {
    throw new Error('Choose supported cooking units');
  }

  const cups =
    fromKind === 'volume'
      ? amount * cookingVolumeUnitsToCups[fromUnit]
      : (amount * cookingMassUnitsToGrams[fromUnit]) / densityGramsPerCup;
  const convertedAmount =
    toKind === 'volume' ? cups / cookingVolumeUnitsToCups[toUnit] : cups * densityGramsPerCup / cookingMassUnitsToGrams[toUnit];

  return { convertedAmount, fromKind, toKind };
}

export function calculateRecipeScale(
  ingredientName: string,
  amount: number,
  unit: string,
  originalServings: number,
  desiredServings: number,
): RecipeScaleResult {
  assertPositiveNumber(amount, 'Ingredient amount');
  assertPositiveNumber(originalServings, 'Original servings');
  assertPositiveNumber(desiredServings, 'Desired servings');

  const scaleFactor = desiredServings / originalServings;

  return {
    ingredientName: ingredientName.trim() || 'Ingredient',
    amount,
    unit: unit.trim() || 'units',
    originalServings,
    desiredServings,
    scaleFactor,
    scaledAmount: amount * scaleFactor,
  };
}

export function convertCookingMeasurement(
  amount: number,
  fromUnit: string,
  toUnit: string,
  densityGramsPerCup = 120,
): CookingMeasurementConversionResult {
  const { convertedAmount, fromKind, toKind } = convertCookingAmount(amount, fromUnit, toUnit, densityGramsPerCup);
  const note =
    fromKind === toKind
      ? 'This conversion uses fixed unit factors because both units measure the same kind of quantity.'
      : 'This conversion uses the density you entered because volume-to-weight conversions depend on the ingredient.';

  return {
    amount,
    fromUnit,
    toUnit,
    densityGramsPerCup,
    convertedAmount,
    inputKind: fromKind,
    outputKind: toKind,
    note,
  };
}

export function calculateIngredientCost(
  amountNeeded: number,
  neededUnit: string,
  packageAmount: number,
  packageUnit: string,
  packagePrice: number,
  densityGramsPerCup = 120,
): IngredientCostResult {
  assertPositiveNumber(amountNeeded, 'Amount needed');
  assertPositiveNumber(packageAmount, 'Package amount');
  assertNonNegativeNumber(packagePrice, 'Package price');

  const packageAmountInNeededUnit = convertCookingAmount(packageAmount, packageUnit, neededUnit, densityGramsPerCup).convertedAmount;

  if (packageAmountInNeededUnit <= 0) {
    throw new Error('Package amount must convert to a positive amount');
  }

  const unitCost = packagePrice / packageAmountInNeededUnit;
  const recipeCost = amountNeeded * unitCost;

  return {
    amountNeeded,
    neededUnit,
    packageAmount,
    packageUnit,
    packagePrice,
    densityGramsPerCup,
    packageAmountInNeededUnit,
    unitCost,
    recipeCost,
  };
}

export function compareUnitPrices(
  itemAName: string,
  itemAPrice: number,
  itemAQuantity: number,
  itemBName: string,
  itemBPrice: number,
  itemBQuantity: number,
  unit: string,
): UnitPriceComparisonResult {
  assertNonNegativeNumber(itemAPrice, 'Item A price');
  assertPositiveNumber(itemAQuantity, 'Item A quantity');
  assertNonNegativeNumber(itemBPrice, 'Item B price');
  assertPositiveNumber(itemBQuantity, 'Item B quantity');

  const itemAUnitPrice = itemAPrice / itemAQuantity;
  const itemBUnitPrice = itemBPrice / itemBQuantity;
  const cheaperName = itemAUnitPrice <= itemBUnitPrice ? itemAName.trim() || 'Item A' : itemBName.trim() || 'Item B';
  const higherUnitPrice = Math.max(itemAUnitPrice, itemBUnitPrice);
  const lowerUnitPrice = Math.min(itemAUnitPrice, itemBUnitPrice);

  return {
    itemAName: itemAName.trim() || 'Item A',
    itemBName: itemBName.trim() || 'Item B',
    itemAPrice,
    itemBPrice,
    itemAQuantity,
    itemBQuantity,
    unit: unit.trim() || 'unit',
    itemAUnitPrice,
    itemBUnitPrice,
    cheaperName,
    savingsPerUnit: higherUnitPrice - lowerUnitPrice,
    savingsPercent: higherUnitPrice === 0 ? 0 : ((higherUnitPrice - lowerUnitPrice) / higherUnitPrice) * 100,
  };
}

export function calculateCostPerServing(
  foodName: string,
  totalCost: number,
  servings: number,
  extraCost = 0,
): CostPerServingResult {
  assertNonNegativeNumber(totalCost, 'Total cost');
  assertNonNegativeNumber(extraCost, 'Extra cost');
  assertPositiveNumber(servings, 'Servings');

  const totalBatchCost = totalCost + extraCost;

  return {
    foodName: foodName.trim() || 'Recipe',
    totalCost,
    extraCost,
    servings,
    totalBatchCost,
    costPerServing: totalBatchCost / servings,
  };
}

const gasMarkTemperatures = [
  { mark: '1/4', fahrenheit: 225 },
  { mark: '1/2', fahrenheit: 250 },
  { mark: '1', fahrenheit: 275 },
  { mark: '2', fahrenheit: 300 },
  { mark: '3', fahrenheit: 325 },
  { mark: '4', fahrenheit: 350 },
  { mark: '5', fahrenheit: 375 },
  { mark: '6', fahrenheit: 400 },
  { mark: '7', fahrenheit: 425 },
  { mark: '8', fahrenheit: 450 },
  { mark: '9', fahrenheit: 475 },
];

function gasMarkToNumber(mark: string) {
  return mark === '1/4' ? 0.25 : mark === '1/2' ? 0.5 : Number(mark);
}

export function convertOvenTemperature(inputTemperature: number, inputUnit: string): OvenTemperatureResult {
  assertPositiveNumber(inputTemperature, 'Temperature');

  let fahrenheit: number;

  if (inputUnit === 'fahrenheit') {
    fahrenheit = inputTemperature;
  } else if (inputUnit === 'celsius') {
    fahrenheit = (inputTemperature * 9) / 5 + 32;
  } else if (inputUnit === 'gas-mark') {
    const exactGasMark = gasMarkTemperatures.find((entry) => gasMarkToNumber(entry.mark) === inputTemperature);
    fahrenheit = exactGasMark?.fahrenheit ?? 250 + inputTemperature * 50;
  } else {
    throw new Error('Choose a supported oven temperature unit');
  }

  const celsius = ((fahrenheit - 32) * 5) / 9;
  const roundedConventionalCelsius = Math.round(celsius / 10) * 10;
  const fanCelsius = roundedConventionalCelsius - 20;
  const fanFahrenheit = Math.round(((fanCelsius * 9) / 5 + 32) / 5) * 5;
  const nearest = gasMarkTemperatures.reduce((best, candidate) =>
    Math.abs(candidate.fahrenheit - fahrenheit) < Math.abs(best.fahrenheit - fahrenheit) ? candidate : best,
  );

  return {
    inputTemperature,
    inputUnit,
    fahrenheit,
    celsius,
    fanCelsius,
    fanFahrenheit,
    nearestGasMark: nearest.mark,
    nearestGasMarkFahrenheit: nearest.fahrenheit,
  };
}

export function convertButter(amount: number, unit: string): ButterConversionResult {
  assertPositiveNumber(amount, 'Butter amount');

  const tablespoonsByUnit: Record<string, number> = {
    teaspoon: 1 / 3,
    tablespoon: 1,
    cup: 16,
    stick: 8,
    ounce: 2,
    gram: 1 / 14.1747615625,
    pound: 32,
  };
  const tablespoons = amount * (tablespoonsByUnit[unit] ?? 0);

  if (!tablespoons) {
    throw new Error('Choose a supported butter unit');
  }

  return {
    amount,
    unit,
    teaspoons: tablespoons * 3,
    tablespoons,
    cups: tablespoons / 16,
    sticks: tablespoons / 8,
    ounces: tablespoons / 2,
    grams: tablespoons * 14.1747615625,
    pounds: tablespoons / 32,
  };
}

export function calculateBakingPanConversion(
  oldLengthInches: number,
  oldWidthInches: number,
  newLengthInches: number,
  newWidthInches: number,
  originalServings?: number,
): BakingPanConversionResult {
  assertPositiveNumber(oldLengthInches, 'Original pan length');
  assertPositiveNumber(oldWidthInches, 'Original pan width');
  assertPositiveNumber(newLengthInches, 'New pan length');
  assertPositiveNumber(newWidthInches, 'New pan width');

  const servings = originalServings === undefined || originalServings === 0 ? null : originalServings;

  if (servings !== null) {
    assertPositiveNumber(servings, 'Original servings');
  }

  const oldAreaSquareInches = oldLengthInches * oldWidthInches;
  const newAreaSquareInches = newLengthInches * newWidthInches;
  const scaleFactor = newAreaSquareInches / oldAreaSquareInches;

  return {
    oldLengthInches,
    oldWidthInches,
    newLengthInches,
    newWidthInches,
    originalServings: servings,
    oldAreaSquareInches,
    newAreaSquareInches,
    scaleFactor,
    scaledServings: servings === null ? null : servings * scaleFactor,
  };
}

export function calculateGdpEstimate(
  consumption: number,
  investment: number,
  governmentSpending: number,
  exportsValue: number,
  importsValue: number,
  population?: number,
): GdpEstimateResult {
  assertNonNegativeNumber(consumption, 'Personal consumption');
  assertNonNegativeNumber(investment, 'Private investment');
  assertNonNegativeNumber(governmentSpending, 'Government spending');
  assertNonNegativeNumber(exportsValue, 'Exports');
  assertNonNegativeNumber(importsValue, 'Imports');

  const populationValue = population === undefined || population === 0 ? null : population;

  if (populationValue !== null) {
    assertPositiveNumber(populationValue, 'Population');
  }

  const netExports = exportsValue - importsValue;
  const gdp = consumption + investment + governmentSpending + netExports;

  if (gdp <= 0) {
    throw new Error('GDP must be greater than zero after net exports');
  }

  return {
    consumption,
    investment,
    governmentSpending,
    exports: exportsValue,
    imports: importsValue,
    netExports,
    gdp,
    population: populationValue,
    gdpPerPerson: populationValue === null ? null : gdp / populationValue,
  };
}

export function calculateHorsepowerConversion(
  inputPower: number,
  inputUnit: HorsepowerUnit,
): HorsepowerConversionResult {
  assertPositiveNumber(inputPower, 'Power');

  const unitToWatts: Record<HorsepowerUnit, number> = {
    horsepower: wattsPerMechanicalHorsepower,
    watt: 1,
    kilowatt: 1000,
    'metric-horsepower': wattsPerMetricHorsepower,
  };
  const watts = inputPower * unitToWatts[inputUnit];

  if (!Number.isFinite(watts)) {
    throw new Error('Power is outside calculator range');
  }

  return {
    inputPower,
    inputUnit,
    watts,
    kilowatts: watts / 1000,
    mechanicalHorsepower: watts / wattsPerMechanicalHorsepower,
    metricHorsepower: watts / wattsPerMetricHorsepower,
  };
}

export function calculateEngineHorsepower(
  torquePoundFeet: number,
  rpm: number,
  drivetrainLossPercent = 0,
): EngineHorsepowerResult {
  assertPositiveNumber(torquePoundFeet, 'Torque');
  assertPositiveNumber(rpm, 'RPM');
  assertNonNegativeNumber(drivetrainLossPercent, 'Drivetrain loss');

  if (drivetrainLossPercent >= 100) {
    throw new Error('Drivetrain loss must be less than 100%');
  }

  const engineHorsepower = (torquePoundFeet * rpm) / engineHorsepowerTorqueConstant;
  const wheelHorsepower = engineHorsepower * (1 - drivetrainLossPercent / 100);

  return {
    torquePoundFeet,
    rpm,
    drivetrainLossPercent,
    engineHorsepower,
    wheelHorsepower,
    kilowatts: (engineHorsepower * wattsPerMechanicalHorsepower) / 1000,
  };
}

function assertSlopeRating(slopeRating: number) {
  assertFiniteNumber(slopeRating, 'Slope rating');

  if (slopeRating < 55 || slopeRating > 155) {
    throw new Error('Slope rating must be between 55 and 155');
  }
}

export function calculateGolfScoreDifferential(
  adjustedGrossScore: number,
  courseRating: number,
  slopeRating: number,
  playingConditionsAdjustment = 0,
): GolfScoreDifferentialResult {
  assertPositiveNumber(adjustedGrossScore, 'Adjusted gross score');
  assertPositiveNumber(courseRating, 'Course rating');
  assertSlopeRating(slopeRating);
  assertFiniteNumber(playingConditionsAdjustment, 'Playing conditions adjustment');

  if (playingConditionsAdjustment < -1 || playingConditionsAdjustment > 3) {
    throw new Error('PCC adjustment should usually be between -1 and +3');
  }

  const rawDifferential = ((adjustedGrossScore - courseRating - playingConditionsAdjustment) * 113) / slopeRating;

  return {
    adjustedGrossScore,
    courseRating,
    slopeRating,
    playingConditionsAdjustment,
    rawDifferential,
    scoreDifferential: Math.round(rawDifferential * 10) / 10,
  };
}

export function calculateGolfCourseHandicap(
  handicapIndex: number,
  slopeRating: number,
  courseRating: number,
  par: number,
  allowancePercent = 100,
): GolfCourseHandicapResult {
  assertFiniteNumber(handicapIndex, 'Handicap index');
  assertSlopeRating(slopeRating);
  assertPositiveNumber(courseRating, 'Course rating');
  assertPositiveNumber(par, 'Par');
  assertPositiveNumber(allowancePercent, 'Allowance');

  if (handicapIndex < -10 || handicapIndex > 54) {
    throw new Error('Handicap index should be between -10.0 and 54.0 for this estimate');
  }

  if (allowancePercent > 100) {
    throw new Error('Allowance cannot be above 100%');
  }

  const rawCourseHandicap = handicapIndex * (slopeRating / 113) + (courseRating - par);
  const courseHandicap = Math.round(rawCourseHandicap);

  return {
    handicapIndex,
    slopeRating,
    courseRating,
    par,
    allowancePercent,
    rawCourseHandicap,
    courseHandicap,
    playingHandicap: Math.round(courseHandicap * (allowancePercent / 100)),
  };
}

function tokenizeWords(text: string) {
  return text.match(/[\p{L}\p{N}]+(?:['-][\p{L}\p{N}]+)*/gu) ?? [];
}

export function analyzeText(text: string): TextAnalysisResult {
  const trimmed = text.trim();
  const words = tokenizeWords(text);
  const sentences = trimmed ? trimmed.split(/[.!?]+(?=\s|$)/).filter((sentence) => sentence.trim()).length : 0;
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((paragraph) => paragraph.trim()).length : 0;
  const lines = text.length ? text.split(/\r\n|\r|\n/).length : 0;

  return {
    text,
    characters: [...text].length,
    charactersNoSpaces: [...text.replace(/\s/g, '')].length,
    words: words.length,
    sentences,
    paragraphs,
    lines,
    bytesUtf8: new TextEncoder().encode(text).length,
    estimatedReadingMinutes: words.length / 200,
  };
}

function titleCaseWord(word: string) {
  if (!word) return '';
  return `${word.charAt(0).toLocaleUpperCase()}${word.slice(1).toLocaleLowerCase()}`;
}

function sentenceCaseText(text: string) {
  let shouldCapitalize = true;

  return [...text.toLocaleLowerCase()]
    .map((character) => {
      if (/[.!?]/.test(character)) {
        shouldCapitalize = true;
        return character;
      }

      if (/\p{L}/u.test(character) && shouldCapitalize) {
        shouldCapitalize = false;
        return character.toLocaleUpperCase();
      }

      if (/\p{L}/u.test(character)) {
        shouldCapitalize = false;
      }

      return character;
    })
    .join('')
    .replace(/[.!?]\s+/g, (ending) => {
      shouldCapitalize = true;
      return ending;
    });
}

function wordsForIdentifier(text: string) {
  return tokenizeWords(text.normalize('NFKD').replace(/[\u0300-\u036f]/g, ''));
}

export function convertTextCase(input: string, mode: TextCaseMode): TextCaseResult {
  let output = input;
  const words = wordsForIdentifier(input);

  switch (mode) {
    case 'uppercase':
      output = input.toLocaleUpperCase();
      break;
    case 'lowercase':
      output = input.toLocaleLowerCase();
      break;
    case 'title':
      output = input.replace(/[\p{L}\p{N}]+(?:['-][\p{L}\p{N}]+)*/gu, titleCaseWord);
      break;
    case 'sentence':
      output = sentenceCaseText(input);
      break;
    case 'camel':
      output = words.map((word, index) => (index === 0 ? word.toLocaleLowerCase() : titleCaseWord(word))).join('');
      break;
    case 'pascal':
      output = words.map(titleCaseWord).join('');
      break;
    case 'snake':
      output = words.map((word) => word.toLocaleLowerCase()).join('_');
      break;
    case 'kebab':
      output = words.map((word) => word.toLocaleLowerCase()).join('-');
      break;
    default:
      output = input;
  }

  const inputCharacters = [...input];
  const outputCharacters = [...output];
  const changedCharacters = Math.max(inputCharacters.length, outputCharacters.length)
    - inputCharacters.filter((character, index) => character === outputCharacters[index]).length;

  return {
    input,
    mode,
    output,
    changedCharacters,
  };
}

export function generateSlug(input: string, maxLength?: number): SlugResult {
  const max = maxLength === undefined || maxLength === 0 ? null : maxLength;

  if (max !== null) {
    assertSafeInteger(max, 'Maximum length');

    if (max < 8 || max > 120) {
      throw new Error('Maximum length should be between 8 and 120 characters');
    }
  }

  const words = wordsForIdentifier(input.replace(/&/g, ' and '));
  let slug = words.map((word) => word.toLocaleLowerCase()).join('-');

  if (!slug) {
    throw new Error('Enter text that can become a slug');
  }

  if (max !== null && slug.length > max) {
    slug = slug.slice(0, max).replace(/-+$/g, '');
  }

  return {
    input,
    slug,
    maxLength: max,
    wordCount: words.length,
    characterCount: slug.length,
  };
}

function sortJsonValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortJsonValue);
  }

  if (value && typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>)
      .sort((left, right) => left.localeCompare(right))
      .reduce<Record<string, unknown>>((sorted, key) => {
        sorted[key] = sortJsonValue((value as Record<string, unknown>)[key]);
        return sorted;
      }, {});
  }

  return value;
}

function countJsonKeys(value: unknown): number {
  if (Array.isArray(value)) {
    return value.reduce((count, item) => count + countJsonKeys(item), 0);
  }

  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).reduce(
      (count, [, child]) => count + 1 + countJsonKeys(child),
      0,
    );
  }

  return 0;
}

function jsonRootType(value: unknown) {
  if (Array.isArray(value)) return 'array';
  if (value === null) return 'null';
  return typeof value;
}

export function formatJsonText(input: string, sortKeys = false): JsonFormatResult {
  if (!input.trim()) {
    throw new Error('Enter JSON text to format');
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(input);
  } catch {
    throw new Error('JSON could not be parsed. Check quotes, commas, braces, and brackets.');
  }

  const normalized = sortKeys ? sortJsonValue(parsed) : parsed;
  const output = JSON.stringify(normalized, null, 2);

  return {
    input,
    output,
    rootType: jsonRootType(parsed),
    keyCount: countJsonKeys(parsed),
    byteLength: new TextEncoder().encode(output).length,
  };
}

function randomBytes(length: number, getRandomUint32: RandomUint32Source) {
  const bytes = new Uint8Array(length);

  for (let index = 0; index < length; index += 4) {
    const value = getRandomUint32();
    bytes[index] = value & 255;
    if (index + 1 < length) bytes[index + 1] = (value >>> 8) & 255;
    if (index + 2 < length) bytes[index + 2] = (value >>> 16) & 255;
    if (index + 3 < length) bytes[index + 3] = (value >>> 24) & 255;
  }

  return bytes;
}

export function generateUuidV4(getRandomUint32: RandomUint32Source = secureRandomUint32): string {
  const bytes = randomBytes(16, getRandomUint32);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, '0'));

  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex
    .slice(8, 10)
    .join('')}-${hex.slice(10, 16).join('')}`;
}

export function generateUuidBatch(
  quantity: number,
  uppercase = false,
  hyphens = true,
  getRandomUint32: RandomUint32Source = secureRandomUint32,
): UuidBatchResult {
  assertSafeInteger(quantity, 'Quantity');

  if (quantity < 1 || quantity > 100) {
    throw new Error('Quantity must be between 1 and 100');
  }

  const uuids = Array.from({ length: quantity }, () => {
    let uuid = generateUuidV4(getRandomUint32);
    if (!hyphens) uuid = uuid.replace(/-/g, '');
    if (uppercase) uuid = uuid.toUpperCase();
    return uuid;
  });

  return {
    uuids,
    quantity,
    uppercase,
    hyphens,
  };
}

export async function digestText(input: string, algorithm: HashAlgorithm): Promise<TextDigestResult> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Secure hash generation needs the browser SubtleCrypto API.');
  }

  const bytes = new TextEncoder().encode(input);
  const digest = await globalThis.crypto.subtle.digest(algorithm, bytes);
  const digestBytes = new Uint8Array(digest);
  const hexDigest = [...digestBytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');

  return {
    algorithm,
    input,
    hexDigest,
    bytesUtf8: bytes.length,
    digestBytes: digestBytes.length,
  };
}

export function calculateUnixTimestampFromDate(utcDate: string, utcTime: string): UnixTimestampFromDateResult {
  const { year, month, day } = parseIsoDateParts(utcDate, 'UTC date');
  const seconds = parseClockTime(utcTime, 'UTC time');
  const hours = Math.floor(seconds / secondsPerHour);
  const minutes = Math.floor((seconds - hours * secondsPerHour) / secondsPerMinute);
  const remainingSeconds = seconds - hours * secondsPerHour - minutes * secondsPerMinute;
  const milliseconds = Date.UTC(year, month - 1, day, hours, minutes, remainingSeconds);

  return {
    utcIso: new Date(milliseconds).toISOString(),
    seconds: Math.floor(milliseconds / 1000),
    milliseconds,
  };
}

export function calculateDateFromUnixTimestamp(
  timestamp: number,
  unit: 'seconds' | 'milliseconds',
): UnixTimestampToDateResult {
  assertFiniteNumber(timestamp, 'Timestamp');

  const milliseconds = unit === 'seconds' ? timestamp * 1000 : timestamp;
  const date = new Date(milliseconds);

  if (!Number.isFinite(date.getTime())) {
    throw new Error('Timestamp is outside the supported date range');
  }

  const utcIso = date.toISOString();

  return {
    timestamp,
    unit,
    utcIso,
    utcDate: utcIso.slice(0, 10),
    utcTime: utcIso.slice(11, 19),
  };
}

function normalizeHexColor(input: string) {
  const trimmed = input.trim().replace(/^#/, '');

  if (/^[0-9a-f]{3}$/i.test(trimmed)) {
    return `#${trimmed
      .split('')
      .map((character) => character + character)
      .join('')
      .toLowerCase()}`;
  }

  if (/^[0-9a-f]{6}$/i.test(trimmed)) {
    return `#${trimmed.toLowerCase()}`;
  }

  throw new Error('Enter colors as #RGB or #RRGGBB hex values');
}

function hexToRgb(input: string): [number, number, number] {
  const normalized = normalizeHexColor(input).slice(1);
  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
  ];
}

function linearizedSrgb(channel: number) {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(rgb: [number, number, number]) {
  return 0.2126 * linearizedSrgb(rgb[0]) + 0.7152 * linearizedSrgb(rgb[1]) + 0.0722 * linearizedSrgb(rgb[2]);
}

function contrastRatioForRgb(foreground: [number, number, number], background: [number, number, number]) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function rgbToHex(rgb: [number, number, number]) {
  return `#${rgb.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

function squaredRgbDistance(first: [number, number, number], second: [number, number, number]) {
  return first.reduce((total, channel, index) => total + (channel - second[index]) ** 2, 0);
}

function findAaNormalForegroundSuggestion(
  foreground: [number, number, number],
  background: [number, number, number],
) {
  const currentRatio = contrastRatioForRgb(foreground, background);

  if (currentRatio >= 4.5) {
    return {
      foreground: rgbToHex(foreground),
      contrastRatio: currentRatio,
      direction: 'unchanged' as const,
    };
  }

  const candidates: Array<{
    foreground: string;
    contrastRatio: number;
    direction: 'darker' | 'lighter';
    distance: number;
  }> = [];

  for (const endpoint of [0, 255] as const) {
    for (let step = 1; step <= 255; step += 1) {
      const candidate = foreground.map((channel) =>
        Math.round(channel + ((endpoint - channel) * step) / 255),
      ) as [number, number, number];
      const contrastRatio = contrastRatioForRgb(candidate, background);

      if (contrastRatio >= 4.5) {
        candidates.push({
          foreground: rgbToHex(candidate),
          contrastRatio,
          direction: endpoint === 0 ? 'darker' : 'lighter',
          distance: squaredRgbDistance(foreground, candidate),
        });
        break;
      }
    }
  }

  const closest = candidates.sort(
    (first, second) => first.distance - second.distance || first.contrastRatio - second.contrastRatio,
  )[0];

  if (!closest) {
    throw new Error('Could not find an AA normal-text color suggestion');
  }

  return {
    foreground: closest.foreground,
    contrastRatio: closest.contrastRatio,
    direction: closest.direction,
  };
}

export function calculateColorContrast(foreground: string, background: string): ColorContrastResult {
  const foregroundHex = normalizeHexColor(foreground);
  const backgroundHex = normalizeHexColor(background);
  const foregroundRgb = hexToRgb(foregroundHex);
  const backgroundRgb = hexToRgb(backgroundHex);
  const contrastRatio = contrastRatioForRgb(foregroundRgb, backgroundRgb);

  return {
    foreground: foregroundHex,
    background: backgroundHex,
    foregroundRgb,
    backgroundRgb,
    contrastRatio,
    passesAaNormal: contrastRatio >= 4.5,
    passesAaLarge: contrastRatio >= 3,
    passesAaaNormal: contrastRatio >= 7,
    passesAaaLarge: contrastRatio >= 4.5,
    aaNormalSuggestion: findAaNormalForegroundSuggestion(foregroundRgb, backgroundRgb),
  };
}

function decimalPlaces(value: number) {
  const text = value.toString();
  if (!text.includes('.')) return 0;
  return text.split('.')[1].length;
}

function scaledWholeNumber(value: number, scale: number) {
  return Math.round(value * scale);
}

export function calculateAspectRatio(
  width: number,
  height: number,
  targetWidth?: number,
  targetHeight?: number,
): AspectRatioResult {
  assertPositiveNumber(width, 'Width');
  assertPositiveNumber(height, 'Height');

  if (targetWidth !== undefined && targetHeight !== undefined) {
    throw new Error('Enter target width or target height, not both');
  }

  if (targetWidth !== undefined) assertPositiveNumber(targetWidth, 'Target width');
  if (targetHeight !== undefined) assertPositiveNumber(targetHeight, 'Target height');

  const scale = 10 ** Math.min(6, Math.max(decimalPlaces(width), decimalPlaces(height)));
  const ratioDivisor = greatestCommonDivisor(scaledWholeNumber(width, scale), scaledWholeNumber(height, scale));
  const ratioWidth = scaledWholeNumber(width, scale) / ratioDivisor;
  const ratioHeight = scaledWholeNumber(height, scale) / ratioDivisor;
  const result: AspectRatioResult = {
    width,
    height,
    ratioWidth,
    ratioHeight,
    ratioLabel: `${ratioWidth}:${ratioHeight}`,
    decimal: width / height,
  };

  if (targetWidth !== undefined) {
    result.scaledWidth = targetWidth;
    result.scaledHeight = targetWidth / (width / height);
  }

  if (targetHeight !== undefined) {
    result.scaledHeight = targetHeight;
    result.scaledWidth = targetHeight * (width / height);
  }

  return result;
}

function normalizeHttpUrl(input: string, label: string) {
  const trimmed = input.trim();

  if (!trimmed) {
    throw new Error(`${label} is required`);
  }

  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(candidate);

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error(`${label} must use http or https`);
    }

    return url;
  } catch {
    throw new Error(`${label} must be a valid URL`);
  }
}

function cleanTextInput(input: string | undefined, label: string, required = false) {
  const trimmed = input?.trim() ?? '';

  if (required && !trimmed) {
    throw new Error(`${label} is required`);
  }

  if (trimmed.length > 200) {
    throw new Error(`${label} should be 200 characters or fewer`);
  }

  return trimmed;
}

export function buildUtmUrl(input: UtmUrlInput): UtmUrlResult {
  const url = normalizeHttpUrl(input.baseUrl, 'Base URL');
  const existingParameterCount = [...url.searchParams.entries()].length;
  const values: Array<[string, string]> = [
    ['utm_source', cleanTextInput(input.source, 'UTM source', true)],
    ['utm_medium', cleanTextInput(input.medium, 'UTM medium', true)],
    ['utm_campaign', cleanTextInput(input.campaign, 'UTM campaign', true)],
    ['utm_term', cleanTextInput(input.term, 'UTM term')],
    ['utm_content', cleanTextInput(input.content, 'UTM content')],
    ['utm_id', cleanTextInput(input.campaignId, 'UTM campaign ID')],
  ];

  values.forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return {
    baseUrl: url.origin + url.pathname,
    outputUrl: url.toString(),
    parameterCount: values.filter(([, value]) => value).length,
    existingParameterCount,
    campaignLabel: `${values[0][1]} / ${values[1][1]} / ${values[2][1]}`,
  };
}

function extractQueryString(input: string) {
  const trimmed = input.trim();

  if (!trimmed) {
    throw new Error('Enter a URL or query string');
  }

  if (/^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)) {
    const url = new URL(trimmed);
    return url.search.startsWith('?') ? url.search.slice(1) : url.search;
  }

  const withoutHash = trimmed.split('#')[0];
  const questionMarkIndex = withoutHash.indexOf('?');
  const query = questionMarkIndex >= 0 ? withoutHash.slice(questionMarkIndex + 1) : withoutHash;

  return query.replace(/^\?/, '');
}

export function parseQueryStringInput(input: string): QueryStringResult {
  const queryString = extractQueryString(input);
  const params = new URLSearchParams(queryString);
  const entries = [...params.entries()];

  if (entries.length === 0) {
    throw new Error('The query string does not include any parameters');
  }

  const grouped: Record<string, string | string[]> = {};
  const seen = new Map<string, number>();

  entries.forEach(([key, value]) => {
    seen.set(key, (seen.get(key) ?? 0) + 1);

    if (Object.prototype.hasOwnProperty.call(grouped, key)) {
      const current = grouped[key];
      grouped[key] = Array.isArray(current) ? [...current, value] : [current, value];
    } else {
      grouped[key] = value;
    }
  });

  return {
    input,
    output: JSON.stringify(grouped, null, 2),
    parameterCount: entries.length,
    duplicateKeyCount: [...seen.values()].filter((count) => count > 1).length,
    queryString,
  };
}

export function buildQueryStringFromLines(input: string): QueryStringResult {
  const params = new URLSearchParams();
  const lines = input.split(/\r\n|\r|\n/).map((line) => line.trim()).filter(Boolean);

  lines.forEach((line, index) => {
    const separatorIndex = line.indexOf('=');
    const key = (separatorIndex >= 0 ? line.slice(0, separatorIndex) : line).trim();
    const value = separatorIndex >= 0 ? line.slice(separatorIndex + 1).trim() : '';

    if (!key) {
      throw new Error(`Parameter ${index + 1} needs a key`);
    }

    params.append(key, value);
  });

  const queryString = params.toString();
  const keyCounts = lines.reduce<Map<string, number>>((counts, line) => {
    const key = line.split('=')[0].trim();
    counts.set(key, (counts.get(key) ?? 0) + 1);
    return counts;
  }, new Map());

  if (!queryString) {
    throw new Error('Enter at least one key=value line');
  }

  return {
    input,
    output: `?${queryString}`,
    parameterCount: lines.length,
    duplicateKeyCount: [...keyCounts.values()].filter((count) => count > 1).length,
    queryString,
  };
}

const namedHtmlEntities: Record<string, string> = {
  amp: '&',
  apos: "'",
  copy: '\u00a9',
  gt: '>',
  lt: '<',
  nbsp: '\u00a0',
  quot: '"',
  reg: '\u00ae',
};

function countCharacterDifferences(left: string, right: string) {
  const leftCharacters = [...left];
  const rightCharacters = [...right];
  return Math.max(leftCharacters.length, rightCharacters.length)
    - leftCharacters.filter((character, index) => character === rightCharacters[index]).length;
}

export function encodeHtmlEntities(input: string): HtmlEntityResult {
  let entityCount = 0;
  const output = input.replace(/[&<>"']/g, (character) => {
    entityCount += 1;
    switch (character) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&apos;';
      default:
        return character;
    }
  });

  return {
    input,
    output,
    mode: 'encode',
    changedCharacters: countCharacterDifferences(input, output),
    entityCount,
  };
}

export function decodeHtmlEntities(input: string): HtmlEntityResult {
  let entityCount = 0;
  const output = input.replace(/&(#x?[0-9a-f]+|[a-z][a-z0-9]+);/gi, (match, entity: string) => {
    const lower = entity.toLowerCase();

    if (lower.startsWith('#x')) {
      const codePoint = Number.parseInt(lower.slice(2), 16);
      if (Number.isFinite(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff) {
        entityCount += 1;
        return String.fromCodePoint(codePoint);
      }
      return match;
    }

    if (lower.startsWith('#')) {
      const codePoint = Number.parseInt(lower.slice(1), 10);
      if (Number.isFinite(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff) {
        entityCount += 1;
        return String.fromCodePoint(codePoint);
      }
      return match;
    }

    if (Object.prototype.hasOwnProperty.call(namedHtmlEntities, lower)) {
      entityCount += 1;
      return namedHtmlEntities[lower];
    }

    return match;
  });

  return {
    input,
    output,
    mode: 'decode',
    changedCharacters: countCharacterDifferences(input, output),
    entityCount,
  };
}

function formatCssNumber(value: number) {
  return Number.parseFloat(value.toFixed(6)).toString();
}

export function calculateCssClamp(
  minSizePx: number,
  maxSizePx: number,
  minViewportPx: number,
  maxViewportPx: number,
  rootFontSizePx = 16,
): CssClampResult {
  assertPositiveNumber(minSizePx, 'Minimum size');
  assertPositiveNumber(maxSizePx, 'Maximum size');
  assertPositiveNumber(minViewportPx, 'Minimum viewport');
  assertPositiveNumber(maxViewportPx, 'Maximum viewport');
  assertPositiveNumber(rootFontSizePx, 'Root font size');

  if (maxSizePx <= minSizePx) {
    throw new Error('Maximum size must be greater than minimum size');
  }

  if (maxViewportPx <= minViewportPx) {
    throw new Error('Maximum viewport must be greater than minimum viewport');
  }

  const slopeVw = ((maxSizePx - minSizePx) / (maxViewportPx - minViewportPx)) * 100;
  const interceptPx = minSizePx - (slopeVw * minViewportPx) / 100;
  const minRem = minSizePx / rootFontSizePx;
  const maxRem = maxSizePx / rootFontSizePx;
  const interceptRem = interceptPx / rootFontSizePx;
  const middleViewport = (minViewportPx + maxViewportPx) / 2;
  const middleSizePx = interceptPx + (slopeVw * middleViewport) / 100;

  return {
    minSizePx,
    maxSizePx,
    minViewportPx,
    maxViewportPx,
    rootFontSizePx,
    slopeVw,
    interceptPx,
    css: `clamp(${formatCssNumber(minRem)}rem, calc(${formatCssNumber(interceptRem)}rem + ${formatCssNumber(slopeVw)}vw), ${formatCssNumber(maxRem)}rem)`,
    middleSizePx,
  };
}

function splitMarkdownCells(line: string) {
  return line.includes('|') ? line.split('|').map((cell) => cell.trim()) : line.split(',').map((cell) => cell.trim());
}

function cleanMarkdownCell(input: string) {
  return input.replace(/\r?\n/g, ' ').replace(/\|/g, '\\|').trim();
}

export function generateMarkdownTable(
  headersInput: string,
  rowsInput: string,
  alignment: MarkdownTableAlignment,
): MarkdownTableResult {
  const headers = splitMarkdownCells(headersInput).map(cleanMarkdownCell).filter(Boolean);

  if (headers.length < 2) {
    throw new Error('Enter at least two table headers');
  }

  const rows = rowsInput
    .split(/\r\n|\r|\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => splitMarkdownCells(line).map(cleanMarkdownCell));

  if (rows.length === 0) {
    throw new Error('Enter at least one table row');
  }

  const delimiter = {
    center: ':---:',
    left: '---',
    right: '---:',
  }[alignment];
  const normalizedRows = rows.map((row) =>
    headers.map((_, index) => row[index] ?? ''),
  );
  const output = [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => delimiter).join(' | ')} |`,
    ...normalizedRows.map((row) => `| ${row.join(' | ')} |`),
  ].join('\n');

  return {
    output,
    columnCount: headers.length,
    rowCount: rows.length,
    alignment,
  };
}

export function numberToRomanNumeral(value: number): string {
  assertSafeInteger(value, 'Number');

  if (value < 1 || value > 3999) {
    throw new Error('Number must be between 1 and 3,999');
  }

  const symbols: Array<[number, string]> = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let remaining = value;
  let roman = '';

  for (const [amount, symbol] of symbols) {
    while (remaining >= amount) {
      roman += symbol;
      remaining -= amount;
    }
  }

  return roman;
}

export function romanNumeralToNumber(input: string): number {
  const roman = input.trim().toUpperCase();

  if (!/^(?=.)M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(roman)) {
    throw new Error('Enter a standard Roman numeral from I to MMMCMXCIX');
  }

  const values: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };
  let total = 0;

  for (let index = 0; index < roman.length; index += 1) {
    const current = values[roman[index]];
    const next = values[roman[index + 1]] ?? 0;
    total += current < next ? -current : current;
  }

  return total;
}

export function encodeBase64(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let output = '';

  for (let index = 0; index < bytes.length; index += 3) {
    const first = bytes[index];
    const second = bytes[index + 1];
    const third = bytes[index + 2];
    const combined = (first << 16) | ((second ?? 0) << 8) | (third ?? 0);

    output += base64Alphabet[(combined >> 18) & 63];
    output += base64Alphabet[(combined >> 12) & 63];
    output += second === undefined ? '=' : base64Alphabet[(combined >> 6) & 63];
    output += third === undefined ? '=' : base64Alphabet[combined & 63];
  }

  return output;
}

export function decodeBase64(input: string): string {
  let normalized = input.trim().replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');

  if (!normalized) {
    return '';
  }

  if (/[^A-Za-z0-9+/=]/.test(normalized)) {
    throw new Error('Base64 text contains unsupported characters');
  }

  if (normalized.length % 4 === 1) {
    throw new Error('Base64 text has invalid padding');
  }

  while (normalized.length % 4 !== 0) {
    normalized += '=';
  }

  const bytes: number[] = [];

  for (let index = 0; index < normalized.length; index += 4) {
    const chunk = normalized.slice(index, index + 4);
    const values = chunk.split('').map((character) => (character === '=' ? 0 : base64Alphabet.indexOf(character)));

    if (values.some((value) => value < 0)) {
      throw new Error('Base64 text contains unsupported characters');
    }

    const combined = (values[0] << 18) | (values[1] << 12) | (values[2] << 6) | values[3];
    bytes.push((combined >> 16) & 255);
    if (chunk[2] !== '=') bytes.push((combined >> 8) & 255);
    if (chunk[3] !== '=') bytes.push(combined & 255);
  }

  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(new Uint8Array(bytes));
  } catch {
    throw new Error('Base64 text did not decode to valid UTF-8');
  }
}

export function encodeUrlComponentValue(value: string, spaceAsPlus = false): string {
  const encoded = encodeURIComponent(value);
  return spaceAsPlus ? encoded.replace(/%20/g, '+') : encoded;
}

export function decodeUrlComponentValue(value: string, plusAsSpace = false): string {
  const normalized = plusAsSpace ? value.replace(/\+/g, '%20') : value;

  try {
    return decodeURIComponent(normalized);
  } catch {
    throw new Error('URL-encoded text is not valid percent-encoding');
  }
}

export function calculateDayOfWeek(dateValue: string): DayOfWeekResult {
  const { date } = parseIsoDateParts(dateValue, 'Date');
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekdayIndex = date.getUTCDay();

  return {
    date: dateValue,
    weekday: weekdays[weekdayIndex],
    weekdayIndex,
    isoWeekday: weekdayIndex === 0 ? 7 : weekdayIndex,
  };
}

function getTimeZoneParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    month: '2-digit',
    second: '2-digit',
    timeZone,
    year: 'numeric',
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour === '24' ? '0' : parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
  };
}

function formatOffset(minutes: number) {
  const sign = minutes < 0 ? '-' : '+';
  const absolute = Math.abs(minutes);
  const hours = Math.floor(absolute / 60).toString().padStart(2, '0');
  const remainingMinutes = Math.round(absolute % 60).toString().padStart(2, '0');
  return `UTC${sign}${hours}:${remainingMinutes}`;
}

export function calculateTimeZoneComparison(
  utcDate: string,
  utcTime: string,
  timeZone: string,
): TimeZoneComparisonResult {
  const { year, month, day } = parseIsoDateParts(utcDate, 'UTC date');
  const seconds = parseClockTime(utcTime, 'UTC time');
  const hours = Math.floor(seconds / secondsPerHour);
  const minutes = Math.floor((seconds - hours * secondsPerHour) / secondsPerMinute);
  const remainingSeconds = seconds - hours * secondsPerHour - minutes * secondsPerMinute;
  const instant = new Date(Date.UTC(year, month - 1, day, hours, minutes, remainingSeconds));
  const parts = getTimeZoneParts(instant, timeZone);
  const localAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  const offsetMinutes = Math.round((localAsUtc - instant.getTime()) / 60000);

  return {
    utcDateTime: instant.toISOString().replace('.000Z', 'Z'),
    timeZone,
    localDate: `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`,
    localTime: `${String(parts.hour).padStart(2, '0')}:${String(parts.minute).padStart(2, '0')}:${String(parts.second).padStart(2, '0')}`,
    offsetMinutes,
    offsetLabel: formatOffset(offsetMinutes),
  };
}

export function calculateTimeCard(
  entries: TimeCardDayInput[],
  hourlyRate?: number,
): TimeCardResult {
  if (entries.length === 0) {
    throw new Error('Enter at least one time card row');
  }

  const days = entries
    .filter((entry) => entry.startTime.trim() || entry.endTime.trim())
    .map((entry) => {
      const worked = calculateHoursWorked(entry.startTime, entry.endTime, entry.breakMinutes);

      return {
        ...entry,
        decimalHours: worked.decimalHours,
        crossedMidnight: worked.crossedMidnight,
      };
    });

  if (days.length === 0) {
    throw new Error('Enter at least one start and end time');
  }

  const rate = hourlyRate === undefined ? null : hourlyRate;

  if (rate !== null) {
    assertNonNegativeNumber(rate, 'Hourly rate');
  }

  const totalHours = days.reduce((sum, day) => sum + day.decimalHours, 0);

  return {
    days,
    totalHours,
    hourlyRate: rate,
    grossPay: rate === null ? null : totalHours * rate,
  };
}
