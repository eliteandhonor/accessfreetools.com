import { useMemo, useState, type HTMLAttributes } from 'react';
import {
  calculateCircleFromMeasurement,
  calculateDistance2d,
  calculatePythagorean,
  calculateRightTriangle,
  calculateShapeArea,
  calculateShapeSurfaceArea,
  calculateShapeVolume,
  calculateSlope,
  calculateTriangleFromSides,
  formatCalculatorNumber,
  type AreaShape,
  type PythagoreanSolveFor,
  type RightTriangleMode,
  type SurfaceAreaShape,
  type VolumeShape,
} from '../lib/calculator';

export type GeometryToolVariant =
  | 'triangle'
  | 'volume'
  | 'slope'
  | 'area'
  | 'distance'
  | 'circle'
  | 'surface-area'
  | 'pythagorean'
  | 'right-triangle';

type InputMode = HTMLAttributes<HTMLInputElement>['inputMode'];
type GeometryInputs = Record<string, string>;

interface GeometryField {
  key: string;
  label: string;
  inputMode?: InputMode;
  placeholder?: string;
}

interface GeometryExample {
  label: string;
  inputs: GeometryInputs;
}

interface GeometryMode {
  id: string;
  label: string;
  symbol: string;
  fields: GeometryField[];
  defaultInputs: GeometryInputs;
  examples: GeometryExample[];
}

interface GeometryConfig {
  title: string;
  buttonLabel: string;
  emptyHistory: string;
  modes: GeometryMode[];
}

interface GeometryCalculation {
  expression: string;
  answer: string;
  label: string;
  metrics: Array<{ label: string; value: string }>;
  steps: string[];
}

interface Props {
  variant: GeometryToolVariant;
}

const numberInput: InputMode = 'decimal';
const unitField: GeometryField = { key: 'unit', label: 'Unit label', placeholder: 'cm' };

const field = (key: string, label: string): GeometryField => ({ key, label, inputMode: numberInput });
const unit = (value = 'cm') => ({ unit: value });

const geometryConfigs: Record<GeometryToolVariant, GeometryConfig> = {
  triangle: {
    title: 'Triangle Calculator',
    buttonLabel: 'Calculate triangle',
    emptyHistory: 'Recent triangle answers will appear here.',
    modes: [
      {
        id: 'sides',
        label: '3 sides',
        symbol: 'SSS',
        fields: [field('sideA', 'Side a'), field('sideB', 'Side b'), field('sideC', 'Side c'), unitField],
        defaultInputs: { sideA: '13', sideB: '14', sideC: '15', ...unit() },
        examples: [
          { label: '13, 14, 15', inputs: { sideA: '13', sideB: '14', sideC: '15', ...unit() } },
          { label: '3, 4, 5', inputs: { sideA: '3', sideB: '4', sideC: '5', ...unit('m') } },
          { label: '8, 8, 10', inputs: { sideA: '8', sideB: '8', sideC: '10', ...unit('in') } },
        ],
      },
    ],
  },
  volume: {
    title: 'Volume Calculator',
    buttonLabel: 'Calculate volume',
    emptyHistory: 'Recent volume answers will appear here.',
    modes: [
      {
        id: 'rectangular-prism',
        label: 'Rectangular prism',
        symbol: 'Box',
        fields: [field('length', 'Length'), field('width', 'Width'), field('height', 'Height'), unitField],
        defaultInputs: { length: '8', width: '5', height: '3', ...unit() },
        examples: [
          { label: '8 x 5 x 3', inputs: { length: '8', width: '5', height: '3', ...unit() } },
          { label: '12 x 7 x 4', inputs: { length: '12', width: '7', height: '4', ...unit('in') } },
          { label: '2.5 x 2 x 6', inputs: { length: '2.5', width: '2', height: '6', ...unit('m') } },
        ],
      },
      {
        id: 'cube',
        label: 'Cube',
        symbol: 'Cube',
        fields: [field('side', 'Side length'), unitField],
        defaultInputs: { side: '6', ...unit() },
        examples: [
          { label: 'Side 6', inputs: { side: '6', ...unit() } },
          { label: 'Side 12', inputs: { side: '12', ...unit('in') } },
          { label: 'Side 2.5', inputs: { side: '2.5', ...unit('m') } },
        ],
      },
      {
        id: 'cylinder',
        label: 'Cylinder',
        symbol: 'Cyl',
        fields: [field('radius', 'Radius'), field('height', 'Height'), unitField],
        defaultInputs: { radius: '3', height: '10', ...unit() },
        examples: [
          { label: 'r 3, h 10', inputs: { radius: '3', height: '10', ...unit() } },
          { label: 'r 5, h 12', inputs: { radius: '5', height: '12', ...unit('in') } },
          { label: 'r 1.5, h 8', inputs: { radius: '1.5', height: '8', ...unit('m') } },
        ],
      },
      {
        id: 'sphere',
        label: 'Sphere',
        symbol: 'Sphere',
        fields: [field('radius', 'Radius'), unitField],
        defaultInputs: { radius: '4', ...unit() },
        examples: [
          { label: 'Radius 4', inputs: { radius: '4', ...unit() } },
          { label: 'Radius 9', inputs: { radius: '9', ...unit('in') } },
          { label: 'Radius 1.2', inputs: { radius: '1.2', ...unit('m') } },
        ],
      },
      {
        id: 'cone',
        label: 'Cone',
        symbol: 'Cone',
        fields: [field('radius', 'Radius'), field('height', 'Height'), unitField],
        defaultInputs: { radius: '3', height: '9', ...unit() },
        examples: [
          { label: 'r 3, h 9', inputs: { radius: '3', height: '9', ...unit() } },
          { label: 'r 6, h 10', inputs: { radius: '6', height: '10', ...unit('in') } },
          { label: 'r 2, h 7', inputs: { radius: '2', height: '7', ...unit('m') } },
        ],
      },
    ],
  },
  slope: {
    title: 'Slope Calculator',
    buttonLabel: 'Calculate slope',
    emptyHistory: 'Recent slope answers will appear here.',
    modes: [
      {
        id: 'points',
        label: 'Two points',
        symbol: 'm',
        fields: [field('x1', 'x1'), field('y1', 'y1'), field('x2', 'x2'), field('y2', 'y2')],
        defaultInputs: { x1: '1', y1: '2', x2: '5', y2: '10' },
        examples: [
          { label: '(1,2) to (5,10)', inputs: { x1: '1', y1: '2', x2: '5', y2: '10' } },
          { label: 'Negative slope', inputs: { x1: '-2', y1: '7', x2: '4', y2: '1' } },
          { label: 'Vertical line', inputs: { x1: '3', y1: '2', x2: '3', y2: '8' } },
          { label: 'Horizontal line', inputs: { x1: '0', y1: '4', x2: '8', y2: '4' } },
          { label: 'Decimal points', inputs: { x1: '1.5', y1: '-2', x2: '5.5', y2: '6' } },
        ],
      },
    ],
  },
  area: {
    title: 'Area Calculator',
    buttonLabel: 'Calculate area',
    emptyHistory: 'Recent area answers will appear here.',
    modes: [
      {
        id: 'rectangle',
        label: 'Rectangle',
        symbol: 'Rect',
        fields: [field('length', 'Length'), field('width', 'Width'), unitField],
        defaultInputs: { length: '12', width: '8', ...unit() },
        examples: [
          { label: '12 x 8', inputs: { length: '12', width: '8', ...unit() } },
          { label: '5 x 4.5', inputs: { length: '5', width: '4.5', ...unit('m') } },
          { label: '24 x 18', inputs: { length: '24', width: '18', ...unit('in') } },
        ],
      },
      {
        id: 'triangle',
        label: 'Triangle',
        symbol: 'Tri',
        fields: [field('base', 'Base'), field('height', 'Height'), unitField],
        defaultInputs: { base: '10', height: '6', ...unit() },
        examples: [
          { label: 'b 10, h 6', inputs: { base: '10', height: '6', ...unit() } },
          { label: 'b 14, h 9', inputs: { base: '14', height: '9', ...unit('in') } },
          { label: 'b 2.5, h 1.8', inputs: { base: '2.5', height: '1.8', ...unit('m') } },
        ],
      },
      {
        id: 'circle',
        label: 'Circle',
        symbol: 'Circle',
        fields: [field('radius', 'Radius'), unitField],
        defaultInputs: { radius: '5', ...unit() },
        examples: [
          { label: 'Radius 5', inputs: { radius: '5', ...unit() } },
          { label: 'Radius 12', inputs: { radius: '12', ...unit('in') } },
          { label: 'Radius 0.75', inputs: { radius: '0.75', ...unit('m') } },
        ],
      },
      {
        id: 'trapezoid',
        label: 'Trapezoid',
        symbol: 'Trap',
        fields: [field('baseA', 'Base 1'), field('baseB', 'Base 2'), field('height', 'Height'), unitField],
        defaultInputs: { baseA: '8', baseB: '14', height: '5', ...unit() },
        examples: [
          { label: '8, 14, h 5', inputs: { baseA: '8', baseB: '14', height: '5', ...unit() } },
          { label: '6, 10, h 4', inputs: { baseA: '6', baseB: '10', height: '4', ...unit('in') } },
          { label: '3.5, 5, h 2', inputs: { baseA: '3.5', baseB: '5', height: '2', ...unit('m') } },
        ],
      },
      {
        id: 'parallelogram',
        label: 'Parallelogram',
        symbol: 'Para',
        fields: [field('base', 'Base'), field('height', 'Height'), unitField],
        defaultInputs: { base: '9', height: '4', ...unit() },
        examples: [
          { label: 'b 9, h 4', inputs: { base: '9', height: '4', ...unit() } },
          { label: 'b 15, h 6', inputs: { base: '15', height: '6', ...unit('in') } },
          { label: 'b 3.2, h 2.1', inputs: { base: '3.2', height: '2.1', ...unit('m') } },
        ],
      },
    ],
  },
  distance: {
    title: 'Distance Calculator',
    buttonLabel: 'Calculate distance',
    emptyHistory: 'Recent distance answers will appear here.',
    modes: [
      {
        id: 'points',
        label: 'Two points',
        symbol: 'd',
        fields: [field('x1', 'x1'), field('y1', 'y1'), field('x2', 'x2'), field('y2', 'y2'), unitField],
        defaultInputs: { x1: '1', y1: '2', x2: '4', y2: '6', ...unit() },
        examples: [
          { label: '(1,2) to (4,6)', inputs: { x1: '1', y1: '2', x2: '4', y2: '6', ...unit() } },
          { label: 'Origin to point', inputs: { x1: '0', y1: '0', x2: '8', y2: '15', ...unit('m') } },
          { label: 'Negative coords', inputs: { x1: '-3', y1: '4', x2: '5', y2: '-2', ...unit() } },
        ],
      },
    ],
  },
  circle: {
    title: 'Circle Calculator',
    buttonLabel: 'Calculate circle',
    emptyHistory: 'Recent circle answers will appear here.',
    modes: [
      {
        id: 'radius',
        label: 'Radius',
        symbol: 'r',
        fields: [field('value', 'Radius'), unitField],
        defaultInputs: { value: '5', ...unit() },
        examples: [
          { label: 'Radius 5', inputs: { value: '5', ...unit() } },
          { label: 'Radius 12', inputs: { value: '12', ...unit('in') } },
          { label: 'Radius 0.75', inputs: { value: '0.75', ...unit('m') } },
        ],
      },
      {
        id: 'diameter',
        label: 'Diameter',
        symbol: 'd',
        fields: [field('value', 'Diameter'), unitField],
        defaultInputs: { value: '10', ...unit() },
        examples: [
          { label: 'Diameter 10', inputs: { value: '10', ...unit() } },
          { label: 'Diameter 24', inputs: { value: '24', ...unit('in') } },
          { label: 'Diameter 1.5', inputs: { value: '1.5', ...unit('m') } },
        ],
      },
      {
        id: 'circumference',
        label: 'Circumference',
        symbol: 'C',
        fields: [field('value', 'Circumference'), unitField],
        defaultInputs: { value: '31.4159', ...unit() },
        examples: [
          { label: 'C 31.4159', inputs: { value: '31.4159', ...unit() } },
          { label: 'C 75.398', inputs: { value: '75.398', ...unit('in') } },
          { label: 'C 4.712', inputs: { value: '4.712', ...unit('m') } },
        ],
      },
      {
        id: 'area',
        label: 'Area',
        symbol: 'A',
        fields: [field('value', 'Area'), unitField],
        defaultInputs: { value: '78.5398163397', ...unit() },
        examples: [
          { label: 'Area 78.5398', inputs: { value: '78.5398163397', ...unit() } },
          { label: 'Area 452.389', inputs: { value: '452.389', ...unit('in') } },
          { label: 'Area 1.767', inputs: { value: '1.767', ...unit('m') } },
        ],
      },
    ],
  },
  'surface-area': {
    title: 'Surface Area Calculator',
    buttonLabel: 'Calculate surface area',
    emptyHistory: 'Recent surface area answers will appear here.',
    modes: [
      {
        id: 'rectangular-prism',
        label: 'Rectangular prism',
        symbol: 'Box',
        fields: [field('length', 'Length'), field('width', 'Width'), field('height', 'Height'), unitField],
        defaultInputs: { length: '8', width: '5', height: '3', ...unit() },
        examples: [
          { label: '8 x 5 x 3', inputs: { length: '8', width: '5', height: '3', ...unit() } },
          { label: '12 x 7 x 4', inputs: { length: '12', width: '7', height: '4', ...unit('in') } },
          { label: '2.5 x 2 x 6', inputs: { length: '2.5', width: '2', height: '6', ...unit('m') } },
        ],
      },
      {
        id: 'cube',
        label: 'Cube',
        symbol: 'Cube',
        fields: [field('side', 'Side length'), unitField],
        defaultInputs: { side: '6', ...unit() },
        examples: [
          { label: 'Side 6', inputs: { side: '6', ...unit() } },
          { label: 'Side 12', inputs: { side: '12', ...unit('in') } },
          { label: 'Side 2.5', inputs: { side: '2.5', ...unit('m') } },
        ],
      },
      {
        id: 'cylinder',
        label: 'Cylinder',
        symbol: 'Cyl',
        fields: [field('radius', 'Radius'), field('height', 'Height'), unitField],
        defaultInputs: { radius: '3', height: '10', ...unit() },
        examples: [
          { label: 'r 3, h 10', inputs: { radius: '3', height: '10', ...unit() } },
          { label: 'r 5, h 12', inputs: { radius: '5', height: '12', ...unit('in') } },
          { label: 'r 1.5, h 8', inputs: { radius: '1.5', height: '8', ...unit('m') } },
        ],
      },
      {
        id: 'sphere',
        label: 'Sphere',
        symbol: 'Sphere',
        fields: [field('radius', 'Radius'), unitField],
        defaultInputs: { radius: '4', ...unit() },
        examples: [
          { label: 'Radius 4', inputs: { radius: '4', ...unit() } },
          { label: 'Radius 9', inputs: { radius: '9', ...unit('in') } },
          { label: 'Radius 1.2', inputs: { radius: '1.2', ...unit('m') } },
        ],
      },
      {
        id: 'cone',
        label: 'Cone',
        symbol: 'Cone',
        fields: [field('radius', 'Radius'), field('height', 'Height'), unitField],
        defaultInputs: { radius: '3', height: '9', ...unit() },
        examples: [
          { label: 'r 3, h 9', inputs: { radius: '3', height: '9', ...unit() } },
          { label: 'r 6, h 10', inputs: { radius: '6', height: '10', ...unit('in') } },
          { label: 'r 2, h 7', inputs: { radius: '2', height: '7', ...unit('m') } },
        ],
      },
    ],
  },
  pythagorean: {
    title: 'Pythagorean Theorem Calculator',
    buttonLabel: 'Calculate side',
    emptyHistory: 'Recent Pythagorean answers will appear here.',
    modes: [
      {
        id: 'hypotenuse',
        label: 'Find hypotenuse',
        symbol: 'c',
        fields: [field('legA', 'Leg a'), field('legB', 'Leg b'), unitField],
        defaultInputs: { legA: '3', legB: '4', ...unit() },
        examples: [
          { label: '3, 4, c', inputs: { legA: '3', legB: '4', ...unit() } },
          { label: '5, 12, c', inputs: { legA: '5', legB: '12', ...unit('m') } },
          { label: '8, 15, c', inputs: { legA: '8', legB: '15', ...unit('in') } },
        ],
      },
      {
        id: 'leg-a',
        label: 'Find leg a',
        symbol: 'a',
        fields: [field('legB', 'Leg b'), field('hypotenuse', 'Hypotenuse c'), unitField],
        defaultInputs: { legB: '4', hypotenuse: '5', ...unit() },
        examples: [
          { label: 'b 4, c 5', inputs: { legB: '4', hypotenuse: '5', ...unit() } },
          { label: 'b 12, c 13', inputs: { legB: '12', hypotenuse: '13', ...unit('m') } },
          { label: 'b 15, c 17', inputs: { legB: '15', hypotenuse: '17', ...unit('in') } },
        ],
      },
      {
        id: 'leg-b',
        label: 'Find leg b',
        symbol: 'b',
        fields: [field('legA', 'Leg a'), field('hypotenuse', 'Hypotenuse c'), unitField],
        defaultInputs: { legA: '3', hypotenuse: '5', ...unit() },
        examples: [
          { label: 'a 3, c 5', inputs: { legA: '3', hypotenuse: '5', ...unit() } },
          { label: 'a 5, c 13', inputs: { legA: '5', hypotenuse: '13', ...unit('m') } },
          { label: 'a 8, c 17', inputs: { legA: '8', hypotenuse: '17', ...unit('in') } },
        ],
      },
    ],
  },
  'right-triangle': {
    title: 'Right Triangle Calculator',
    buttonLabel: 'Calculate right triangle',
    emptyHistory: 'Recent right triangle answers will appear here.',
    modes: [
      {
        id: 'legs',
        label: 'Two legs',
        symbol: 'a,b',
        fields: [field('legA', 'Leg a'), field('legB', 'Leg b'), unitField],
        defaultInputs: { legA: '9', legB: '12', ...unit() },
        examples: [
          { label: '9 and 12', inputs: { legA: '9', legB: '12', ...unit() } },
          { label: '3 and 4', inputs: { legA: '3', legB: '4', ...unit('m') } },
          { label: '7 and 24', inputs: { legA: '7', legB: '24', ...unit('in') } },
        ],
      },
      {
        id: 'leg-hypotenuse',
        label: 'Leg and hypotenuse',
        symbol: 'a,c',
        fields: [field('leg', 'Known leg'), field('hypotenuse', 'Hypotenuse'), unitField],
        defaultInputs: { leg: '5', hypotenuse: '13', ...unit() },
        examples: [
          { label: '5 and 13', inputs: { leg: '5', hypotenuse: '13', ...unit() } },
          { label: '8 and 17', inputs: { leg: '8', hypotenuse: '17', ...unit('m') } },
          { label: '9 and 15', inputs: { leg: '9', hypotenuse: '15', ...unit('in') } },
        ],
      },
    ],
  },
};

function parseInput(inputs: GeometryInputs, key: string, label: string) {
  const rawValue = inputs[key]?.trim() ?? '';
  const parsed = Number(rawValue);

  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be a number`);
  }

  return parsed;
}

function parseMeasurements(mode: GeometryMode, inputs: GeometryInputs) {
  return mode.fields.reduce<Record<string, number>>((measurements, currentField) => {
    if (currentField.key !== 'unit') {
      measurements[currentField.key] = parseInput(inputs, currentField.key, currentField.label);
    }
    return measurements;
  }, {});
}

function cleanUnit(inputs: GeometryInputs) {
  return (inputs.unit ?? '').trim();
}

function unitSuffix(unitLabel: string, kind: 'length' | 'area' | 'volume') {
  if (!unitLabel) return '';
  if (kind === 'area') return ` ${unitLabel}^2`;
  if (kind === 'volume') return ` ${unitLabel}^3`;
  return ` ${unitLabel}`;
}

function formatValue(value: number, unitLabel = '', kind: 'length' | 'area' | 'volume' = 'length') {
  return `${formatCalculatorNumber(value)}${unitSuffix(unitLabel, kind)}`;
}

function formatAngle(value: number) {
  return `${formatCalculatorNumber(value)} degrees`;
}

function formatLineEquation(slope: number | null, yIntercept: number | null, xValue: number) {
  if (slope === null || yIntercept === null) {
    return `x = ${formatCalculatorNumber(xValue)}`;
  }

  const slopeText = formatCalculatorNumber(slope);
  const interceptText = formatCalculatorNumber(Math.abs(yIntercept));

  if (yIntercept === 0) {
    return `y = ${slopeText}x`;
  }

  return `y = ${slopeText}x ${yIntercept > 0 ? '+' : '-'} ${interceptText}`;
}

function buildGeometryCalculation(
  variant: GeometryToolVariant,
  mode: GeometryMode,
  inputs: GeometryInputs,
): GeometryCalculation {
  const measurements = parseMeasurements(mode, inputs);
  const unitLabel = cleanUnit(inputs);

  if (variant === 'triangle') {
    const result = calculateTriangleFromSides(measurements.sideA, measurements.sideB, measurements.sideC);
    const answer = formatValue(result.area, unitLabel, 'area');

    return {
      expression: `Sides ${formatValue(result.sideA, unitLabel)}, ${formatValue(result.sideB, unitLabel)}, ${formatValue(result.sideC, unitLabel)}`,
      answer,
      label: `${result.sideType} ${result.angleType} triangle`,
      metrics: [
        { label: 'Perimeter', value: formatValue(result.perimeter, unitLabel) },
        { label: 'Semiperimeter', value: formatValue(result.semiperimeter, unitLabel) },
        { label: 'Angles', value: `${formatAngle(result.angleA)}, ${formatAngle(result.angleB)}, ${formatAngle(result.angleC)}` },
      ],
      steps: [
        `Check the triangle inequality: each pair of sides must add to more than the third side.`,
        `Find semiperimeter: (${formatCalculatorNumber(result.sideA)} + ${formatCalculatorNumber(result.sideB)} + ${formatCalculatorNumber(result.sideC)}) / 2 = ${formatCalculatorNumber(result.semiperimeter)}.`,
        `Use Heron's formula: area = sqrt(s(s-a)(s-b)(s-c)).`,
        `The area is ${answer}. Angles are found with the law of cosines.`,
      ],
    };
  }

  if (variant === 'area') {
    const result = calculateShapeArea(mode.id as AreaShape, measurements);
    const answer = formatValue(result.value, unitLabel, 'area');

    return {
      expression: `${mode.label} area`,
      answer,
      label: result.formula,
      metrics: result.metrics.map((item) => ({ label: item.label, value: formatValue(item.value, unitLabel) })),
      steps: [
        `Choose ${mode.label.toLowerCase()} mode.`,
        `Use ${result.formula}.`,
        `Substitute the entered measurements.`,
        `The area is ${answer}.`,
      ],
    };
  }

  if (variant === 'volume') {
    const result = calculateShapeVolume(mode.id as VolumeShape, measurements);
    const answer = formatValue(result.value, unitLabel, 'volume');

    return {
      expression: `${mode.label} volume`,
      answer,
      label: result.formula,
      metrics: result.metrics.map((item) => ({ label: item.label, value: formatValue(item.value, unitLabel) })),
      steps: [
        `Choose ${mode.label.toLowerCase()} mode.`,
        `Use ${result.formula}.`,
        `Substitute the entered measurements.`,
        `The volume is ${answer}.`,
      ],
    };
  }

  if (variant === 'surface-area') {
    const result = calculateShapeSurfaceArea(mode.id as SurfaceAreaShape, measurements);
    const answer = formatValue(result.value, unitLabel, 'area');

    return {
      expression: `${mode.label} surface area`,
      answer,
      label: result.formula,
      metrics: result.metrics.map((item) => ({ label: item.label, value: formatValue(item.value, unitLabel) })),
      steps: [
        `Choose ${mode.label.toLowerCase()} mode.`,
        `Use ${result.formula}.`,
        `Substitute the entered measurements.`,
        `The surface area is ${answer}.`,
      ],
    };
  }

  if (variant === 'circle') {
    const value = parseInput(inputs, 'value', mode.label);
    const result = calculateCircleFromMeasurement(mode.id as 'radius' | 'diameter' | 'circumference' | 'area', value);

    return {
      expression: `${mode.label} ${formatValue(value, unitLabel, mode.id === 'area' ? 'area' : 'length')}`,
      answer: formatValue(result.radius, unitLabel),
      label: 'Radius',
      metrics: [
        { label: 'Diameter', value: formatValue(result.diameter, unitLabel) },
        { label: 'Circumference', value: formatValue(result.circumference, unitLabel) },
        { label: 'Area', value: formatValue(result.area, unitLabel, 'area') },
      ],
      steps: [
        `Start from the known ${mode.label.toLowerCase()}.`,
        'Use d = 2r, C = 2pi r, and A = pi r^2.',
        `The radius is ${formatValue(result.radius, unitLabel)}.`,
        `The area is ${formatValue(result.area, unitLabel, 'area')}.`,
      ],
    };
  }

  if (variant === 'slope') {
    const result = calculateSlope(measurements.x1, measurements.y1, measurements.x2, measurements.y2);
    const answer = result.slope === null ? 'Undefined' : formatCalculatorNumber(result.slope);
    const equation = formatLineEquation(result.slope, result.yIntercept, result.x1);

    return {
      expression: `(${formatCalculatorNumber(result.x1)}, ${formatCalculatorNumber(result.y1)}) to (${formatCalculatorNumber(result.x2)}, ${formatCalculatorNumber(result.y2)})`,
      answer,
      label: result.slope === null ? 'Vertical line' : 'Slope',
      metrics: [
        { label: 'Rise', value: formatCalculatorNumber(result.rise) },
        { label: 'Run', value: formatCalculatorNumber(result.run) },
        { label: 'Line', value: equation },
      ],
      steps: [
        `Find rise: ${formatCalculatorNumber(result.y2)} - ${formatCalculatorNumber(result.y1)} = ${formatCalculatorNumber(result.rise)}.`,
        `Find run: ${formatCalculatorNumber(result.x2)} - ${formatCalculatorNumber(result.x1)} = ${formatCalculatorNumber(result.run)}.`,
        result.run === 0 ? 'The run is 0, so the slope is undefined.' : `Divide rise by run: ${formatCalculatorNumber(result.rise)} / ${formatCalculatorNumber(result.run)} = ${answer}.`,
        `The line can be written as ${equation}.`,
      ],
    };
  }

  if (variant === 'distance') {
    const result = calculateDistance2d(measurements.x1, measurements.y1, measurements.x2, measurements.y2);
    const answer = formatValue(result.distance, unitLabel);

    return {
      expression: `(${formatCalculatorNumber(result.x1)}, ${formatCalculatorNumber(result.y1)}) to (${formatCalculatorNumber(result.x2)}, ${formatCalculatorNumber(result.y2)})`,
      answer,
      label: 'Point distance',
      metrics: [
        { label: 'Delta x', value: formatCalculatorNumber(result.deltaX) },
        { label: 'Delta y', value: formatCalculatorNumber(result.deltaY) },
        { label: 'Midpoint', value: `(${formatCalculatorNumber(result.midpoint.x)}, ${formatCalculatorNumber(result.midpoint.y)})` },
      ],
      steps: [
        `Find delta x: ${formatCalculatorNumber(result.x2)} - ${formatCalculatorNumber(result.x1)} = ${formatCalculatorNumber(result.deltaX)}.`,
        `Find delta y: ${formatCalculatorNumber(result.y2)} - ${formatCalculatorNumber(result.y1)} = ${formatCalculatorNumber(result.deltaY)}.`,
        'Use the distance formula: d = sqrt((x2-x1)^2 + (y2-y1)^2).',
        `The distance is ${answer}.`,
      ],
    };
  }

  if (variant === 'pythagorean') {
    const result = calculatePythagorean(mode.id as PythagoreanSolveFor, measurements);
    const solvedLabel = mode.id === 'hypotenuse' ? 'Hypotenuse c' : mode.id === 'leg-a' ? 'Leg a' : 'Leg b';
    const solvedValue = mode.id === 'hypotenuse' ? result.hypotenuse : mode.id === 'leg-a' ? result.legA : result.legB;

    return {
      expression: `${solvedLabel} from right triangle sides`,
      answer: formatValue(solvedValue, unitLabel),
      label: solvedLabel,
      metrics: [
        { label: 'Leg a', value: formatValue(result.legA, unitLabel) },
        { label: 'Leg b', value: formatValue(result.legB, unitLabel) },
        { label: 'Hypotenuse c', value: formatValue(result.hypotenuse, unitLabel) },
      ],
      steps: [
        'Use the Pythagorean theorem for right triangles: a^2 + b^2 = c^2.',
        mode.id === 'hypotenuse'
          ? 'Solve c by taking sqrt(a^2 + b^2).'
          : 'Solve the missing leg by subtracting the known leg squared from the hypotenuse squared, then taking the square root.',
        `The missing side is ${formatValue(solvedValue, unitLabel)}.`,
      ],
    };
  }

  const result = calculateRightTriangle(mode.id as RightTriangleMode, measurements);
  const primaryValue = mode.id === 'legs' ? result.hypotenuse : result.legB;

  return {
    expression: mode.id === 'legs' ? 'Right triangle from two legs' : 'Right triangle from leg and hypotenuse',
    answer: formatValue(primaryValue, unitLabel),
    label: mode.id === 'legs' ? 'Hypotenuse' : 'Missing leg',
    metrics: [
      { label: 'Area', value: formatValue(result.area, unitLabel, 'area') },
      { label: 'Perimeter', value: formatValue(result.perimeter, unitLabel) },
      { label: 'Acute angles', value: `${formatAngle(result.angleA)}, ${formatAngle(result.angleB)}` },
    ],
    steps: [
      'Use the Pythagorean theorem to complete the side lengths.',
      'Use area = leg a x leg b / 2.',
      'Use sine ratios to find the two acute angles.',
      `The main result is ${formatValue(primaryValue, unitLabel)}.`,
    ],
  };
}

export default function GeometryCalculator({ variant }: Props) {
  const config = geometryConfigs[variant];
  const [activeModeId, setActiveModeId] = useState(config.modes[0].id);
  const activeMode = config.modes.find((mode) => mode.id === activeModeId) ?? config.modes[0];
  const [inputs, setInputs] = useState<GeometryInputs>(activeMode.defaultInputs);
  const [calculation, setCalculation] = useState<GeometryCalculation>(() =>
    buildGeometryCalculation(variant, activeMode, activeMode.defaultInputs),
  );
  const [history, setHistory] = useState<GeometryCalculation[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const resultLabel = useMemo(() => (error ? 'Check input' : calculation.label), [calculation, error]);

  const setMode = (nextMode: GeometryMode) => {
    try {
      const nextCalculation = buildGeometryCalculation(variant, nextMode, nextMode.defaultInputs);
      setActiveModeId(nextMode.id);
      setInputs(nextMode.defaultInputs);
      setCalculation(nextCalculation);
      setError('');
      setCopied(false);
    } catch (caughtError) {
      setActiveModeId(nextMode.id);
      setInputs(nextMode.defaultInputs);
      setError(caughtError instanceof Error ? caughtError.message : 'Check the input');
      setCopied(false);
    }
  };

  const updateInput = (key: string, value: string) => {
    setInputs((current) => ({ ...current, [key]: value }));
    setError('');
    setCopied(false);
  };

  const calculate = (nextInputs = inputs, nextMode = activeMode) => {
    try {
      const nextCalculation = buildGeometryCalculation(variant, nextMode, nextInputs);
      setCalculation(nextCalculation);
      setHistory((items) => [nextCalculation, ...items].slice(0, 6));
      setError('');
      setCopied(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Check the geometry inputs');
      setCopied(false);
    }
  };

  const loadExample = (example: GeometryExample) => {
    setInputs(example.inputs);
    calculate(example.inputs);
  };

  const copyAnswer = async () => {
    if (!navigator.clipboard || error) return;
    await navigator.clipboard.writeText(`${calculation.expression}: ${calculation.answer}`);
    setCopied(true);
  };

  return (
    <section className={`advanced-calculator advanced-calculator-geometry advanced-calculator-${variant}`} aria-label={config.title}>
      <div className="advanced-panel">
        {config.modes.length > 1 && (
          <div className="advanced-mode-grid geometry-mode-grid" aria-label={`${config.title} modes`}>
            {config.modes.map((mode) => (
              <button
                aria-pressed={mode.id === activeMode.id}
                key={mode.id}
                onClick={() => setMode(mode)}
                type="button"
              >
                <strong>{mode.symbol}</strong>
                <span>{mode.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="advanced-fields geometry-fields">
          {activeMode.fields.map((currentField) => (
            <label className="advanced-field" key={currentField.key}>
              <span>{currentField.label}</span>
              <input
                inputMode={currentField.inputMode}
                onChange={(event) => updateInput(currentField.key, event.target.value)}
                placeholder={currentField.placeholder}
                value={inputs[currentField.key] ?? ''}
              />
            </label>
          ))}
        </div>

        <div className="advanced-quick-grid" aria-label={`${config.title} examples`}>
          {activeMode.examples.map((example) => (
            <button key={example.label} onClick={() => loadExample(example)} type="button">
              {example.label}
            </button>
          ))}
        </div>

        <div className="advanced-actions">
          <button className="button-primary" onClick={() => calculate()} type="button">
            {config.buttonLabel}
          </button>
          <button className="button-secondary" disabled={Boolean(error)} onClick={copyAnswer} type="button">
            {copied ? 'Copied' : 'Copy answer'}
          </button>
        </div>

        <div className="advanced-result-card" aria-live="polite">
          <span>{resultLabel}</span>
          {error ? (
            <strong>{error}</strong>
          ) : (
            <>
              <strong>{calculation.answer}</strong>
              <dl>
                {calculation.metrics.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </div>

        {!error && (
          <div className="advanced-steps">
            <h2>Steps</h2>
            <ol>
              {calculation.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <section className="advanced-side-panel" aria-label={`${config.title} history`}>
        <section>
          <h2>Recent answers</h2>
          {history.length > 0 ? (
            <ol>
              {history.map((item, index) => (
                <li key={`${item.expression}-${index}`}>
                  <span>{item.expression}</span>
                  <strong>{item.answer}</strong>
                </li>
              ))}
            </ol>
          ) : (
            <p>{config.emptyHistory}</p>
          )}
        </section>

        <section className="advanced-note">
          <h2>Privacy note</h2>
          <p>Geometry answers and history stay in this browser tab while you work.</p>
          <p>Copy answer only writes the current result to your clipboard when you press it.</p>
        </section>
      </section>
    </section>
  );
}
