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

const millisecondsPerDay = 86400000;
const secondsPerHour = 3600;
const secondsPerMinute = 60;
const milesToKilometers = 1.609344;
const milesToMeters = 1609.344;
const litersPer100KmFromMpg = 235.214583;
const standardGravity = 9.80665;
const newtonsPerPoundForce = 4.4482216152605;
const poundsPerKilogram = 2.20462262185;
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
