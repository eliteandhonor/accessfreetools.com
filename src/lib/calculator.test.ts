import {
  calculateBinary,
  calculateFraction,
  calculatePercentageChange,
  calculatePercentageOf,
  calculatePercentOf,
  calculateScientificExpression,
  formatCalculatorNumber,
  formatImproperFraction,
  formatMixedFraction,
  fractionToDecimal,
  generateRandomNumbers,
  applyPercentageAdjustment,
  mixedToFraction,
  parseExcludedNumbers,
  parseDisplayValue,
  percentDisplayValue,
  randomIntegerInRange,
  reversePercentageValue,
  simplifyFraction,
  toggleDisplaySign,
} from './calculator';

function sequenceSource(values: number[]) {
  let index = 0;

  return () => {
    const value = values[index] ?? 0;
    index += 1;
    return value;
  };
}

describe('calculateBinary', () => {
  it('handles basic arithmetic', () => {
    expect(calculateBinary(48.5, '+', 12.25)).toBe(60.75);
    expect(calculateBinary(48.5, '-', 12.25)).toBe(36.25);
    expect(calculateBinary(6, '*', 7)).toBe(42);
    expect(calculateBinary(126, '/', 3)).toBe(42);
  });

  it('rejects division by zero', () => {
    expect(() => calculateBinary(12, '/', 0)).toThrow('Cannot divide by zero');
  });
});

describe('formatCalculatorNumber', () => {
  it('formats readable decimal output', () => {
    expect(formatCalculatorNumber(0.1 + 0.2)).toBe('0.3');
    expect(formatCalculatorNumber(42)).toBe('42');
  });

  it('uses exponential notation for extreme values', () => {
    expect(formatCalculatorNumber(12345678901234)).toContain('e+');
  });
});

describe('display helpers', () => {
  it('parses displays safely', () => {
    expect(parseDisplayValue('1,234.5')).toBe(1234.5);
    expect(parseDisplayValue('Error')).toBe(0);
  });

  it('toggles signs and percentages', () => {
    expect(toggleDisplaySign('24')).toBe('-24');
    expect(toggleDisplaySign('-24')).toBe('24');
    expect(percentDisplayValue('20')).toBe('0.2');
    expect(percentDisplayValue('20', 80, '-')).toBe('16');
  });
});

describe('calculateScientificExpression', () => {
  it('evaluates trigonometry in degree mode', () => {
    expect(formatCalculatorNumber(calculateScientificExpression('sin(30)+cos(60)', 'deg'))).toBe('1');
  });

  it('evaluates logs, roots, constants, and powers', () => {
    expect(formatCalculatorNumber(calculateScientificExpression('log(1000)'))).toBe('3');
    expect(formatCalculatorNumber(calculateScientificExpression('sqrt(25)+cbrt(8)'))).toBe('7');
    expect(formatCalculatorNumber(calculateScientificExpression('2^5'))).toBe('32');
    expect(formatCalculatorNumber(calculateScientificExpression('ln(e)'))).toBe('1');
  });

  it('supports typed x multiplication and rejects invalid math', () => {
    expect(formatCalculatorNumber(calculateScientificExpression('6x7'))).toBe('42');
    expect(() => calculateScientificExpression('1/0')).toThrow('Cannot divide by zero');
    expect(() => calculateScientificExpression('sqrt(-1)')).toThrow('Invalid square root');
  });
});

describe('fraction helpers', () => {
  it('simplifies fractions and formats mixed numbers', () => {
    expect(simplifyFraction(15, 18)).toEqual({ numerator: 5, denominator: 6 });
    expect(formatImproperFraction({ numerator: 15, denominator: 8 })).toBe('15/8');
    expect(formatMixedFraction({ numerator: 15, denominator: 8 })).toBe('1 7/8');
    expect(fractionToDecimal({ numerator: 1, denominator: 8 })).toBe('0.125');
  });

  it('converts mixed numbers and calculates fraction arithmetic', () => {
    expect(mixedToFraction({ whole: 2, numerator: 1, denominator: 4 })).toEqual({
      numerator: 9,
      denominator: 4,
    });
    expect(calculateFraction({ numerator: 1, denominator: 2 }, '+', { numerator: 1, denominator: 3 })).toEqual({
      numerator: 5,
      denominator: 6,
    });
    expect(calculateFraction({ numerator: 9, denominator: 4 }, '-', { numerator: 3, denominator: 8 })).toEqual({
      numerator: 15,
      denominator: 8,
    });
    expect(calculateFraction({ numerator: 3, denominator: 4 }, '*', { numerator: 2, denominator: 5 })).toEqual({
      numerator: 3,
      denominator: 10,
    });
  });

  it('rejects invalid denominators and division by zero fractions', () => {
    expect(() => simplifyFraction(1, 0)).toThrow('Denominator cannot be zero');
    expect(() => calculateFraction({ numerator: 1, denominator: 2 }, '/', { numerator: 0, denominator: 5 })).toThrow(
      'Cannot divide by zero',
    );
  });
});

describe('percentage helpers', () => {
  it('calculates percent-of and what-percent questions', () => {
    expect(formatCalculatorNumber(calculatePercentageOf(20, 80))).toBe('16');
    expect(formatCalculatorNumber(calculatePercentOf(25, 200))).toBe('12.5');
  });

  it('calculates percentage change and adjustments', () => {
    expect(formatCalculatorNumber(calculatePercentageChange(160, 116))).toBe('-27.5');
    expect(formatCalculatorNumber(applyPercentageAdjustment(120, 25, 'increase'))).toBe('150');
    expect(formatCalculatorNumber(applyPercentageAdjustment(120, 25, 'decrease'))).toBe('90');
  });

  it('calculates reverse percentages and rejects invalid bases', () => {
    expect(formatCalculatorNumber(reversePercentageValue(30, 15))).toBe('200');
    expect(() => calculatePercentOf(10, 0)).toThrow('Whole value cannot be zero');
    expect(() => calculatePercentageChange(0, 10)).toThrow('Original value cannot be zero');
    expect(() => reversePercentageValue(30, 0)).toThrow('Percentage cannot be zero');
  });
});

describe('random number helpers', () => {
  it('maps unsigned random values into an inclusive range', () => {
    expect(randomIntegerInRange(1, 10, sequenceSource([0]))).toBe(1);
    expect(randomIntegerInRange(1, 10, sequenceSource([9]))).toBe(10);
  });

  it('generates duplicate-friendly random lists', () => {
    expect(
      generateRandomNumbers(
        {
          min: 1,
          max: 5,
          quantity: 4,
          allowDuplicates: true,
          sortResults: false,
        },
        sequenceSource([0, 1, 1, 4]),
      ),
    ).toEqual([1, 2, 2, 5]);
  });

  it('generates unique sorted lists with exclusions', () => {
    expect(parseExcludedNumbers('2, 5; 5')).toEqual([2, 5]);
    expect(
      generateRandomNumbers(
        {
          min: 1,
          max: 6,
          quantity: 3,
          allowDuplicates: false,
          sortResults: true,
          excludedNumbers: [2, 5],
        },
        sequenceSource([3, 0, 2]),
      ),
    ).toEqual([1, 4, 6]);
  });

  it('rejects impossible random requests', () => {
    expect(() =>
      generateRandomNumbers({
        min: 1,
        max: 3,
        quantity: 4,
        allowDuplicates: false,
        sortResults: false,
      }),
    ).toThrow('Quantity cannot be larger than the available unique numbers');

    expect(() => parseExcludedNumbers('1, two')).toThrow('Excluded numbers must be whole numbers');
  });
});
