export type CalculatorIconMark = 'plus' | 'percent' | 'heart' | 'fx' | 'fraction' | 'dice';

const calculatorIconMarks: Record<string, CalculatorIconMark> = {
  calculator: 'plus',
  'calculator-plus': 'plus',
  'calculator-percent': 'percent',
  'calculator-heart': 'heart',
  'calculator-fx': 'fx',
  'calculator-fraction': 'fraction',
  'random-dice': 'dice',
};

export function getCalculatorIconMark(icon: string): CalculatorIconMark | null {
  return calculatorIconMarks[icon] ?? null;
}
