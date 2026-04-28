export type CalculatorIconMark =
  | 'plus'
  | 'percent'
  | 'error'
  | 'power'
  | 'binary'
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
  'calculator-binary': 'binary',
  'calculator-heart': 'heart',
  'calculator-fx': 'fx',
  'calculator-fraction': 'fraction',
  'random-dice': 'dice',
};

export function getCalculatorIconMark(icon: string): CalculatorIconMark | null {
  return calculatorIconMarks[icon] ?? null;
}
