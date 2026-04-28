export type CalculatorIconMark =
  | 'plus'
  | 'percent'
  | 'error'
  | 'power'
  | 'log'
  | 'root'
  | 'ratio'
  | 'quadratic'
  | 'half-life'
  | 'binary'
  | 'hex'
  | 'lcm'
  | 'gcf'
  | 'factor'
  | 'round'
  | 'matrix'
  | 'sci-notation'
  | 'big-number'
  | 'stddev'
  | 'sequence'
  | 'sample-size'
  | 'probability'
  | 'stats'
  | 'mean'
  | 'permutation'
  | 'z-score'
  | 'confidence'
  | 'heart'
  | 'fx'
  | 'fraction'
  | 'dice';

const calculatorIconMarks: Record<string, CalculatorIconMark> = {
  calculator: 'plus',
  'calculator-plus': 'plus',
  'calculator-percent': 'percent',
  'calculator-error': 'error',
  'calculator-power': 'power',
  'calculator-log': 'log',
  'calculator-root': 'root',
  'calculator-ratio': 'ratio',
  'calculator-quadratic': 'quadratic',
  'calculator-half-life': 'half-life',
  'calculator-binary': 'binary',
  'calculator-hex': 'hex',
  'calculator-lcm': 'lcm',
  'calculator-gcf': 'gcf',
  'calculator-factor': 'factor',
  'calculator-round': 'round',
  'calculator-matrix': 'matrix',
  'calculator-scientific-notation': 'sci-notation',
  'calculator-big-number': 'big-number',
  'calculator-standard-deviation': 'stddev',
  'calculator-sequence': 'sequence',
  'calculator-sample-size': 'sample-size',
  'calculator-probability': 'probability',
  'calculator-statistics': 'stats',
  'calculator-mean': 'mean',
  'calculator-permutation': 'permutation',
  'calculator-z-score': 'z-score',
  'calculator-confidence': 'confidence',
  'calculator-heart': 'heart',
  'calculator-fx': 'fx',
  'calculator-fraction': 'fraction',
  'random-dice': 'dice',
};

export function getCalculatorIconMark(icon: string): CalculatorIconMark | null {
  return calculatorIconMarks[icon] ?? null;
}
