import {
  calculateBinary,
  calculateBinaryIntegerOperation,
  calculateFraction,
  calculateHexIntegerOperation,
  calculateHalfLifeElapsedTime,
  calculateHalfLifeRemaining,
  calculateHalfLifeValue,
  calculatePercentageChange,
  calculatePercentageOf,
  calculateExponent,
  calculatePercentError,
  calculatePercentOf,
  calculateScientificExpression,
  formatCalculatorNumber,
  formatBinaryInteger,
  formatHexInteger,
  formatImproperFraction,
  formatMixedFraction,
  fractionToDecimal,
  groupBinaryDigits,
  groupHexDigits,
  generateRandomNumbers,
  applyPercentageAdjustment,
  mixedToFraction,
  parseBinaryInteger,
  parseDecimalInteger,
  parseExponentInput,
  parseHexInteger,
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

  it('calculates percent error with signed direction', () => {
    const result = calculatePercentError(2.45, 2.7);

    expect(formatCalculatorNumber(result.absoluteError)).toBe('0.25');
    expect(formatCalculatorNumber(result.percentError)).toBe('9.2592592593');
    expect(formatCalculatorNumber(result.signedPercentError)).toBe('-9.2592592593');
  });

  it('rejects percent error with a zero accepted value', () => {
    expect(() => calculatePercentError(10, 0)).toThrow('Accepted value cannot be zero');
  });
});

describe('exponent helpers', () => {
  it('calculates positive, zero, negative, and fractional exponents', () => {
    expect(formatCalculatorNumber(calculateExponent(2, 8).value)).toBe('256');
    expect(formatCalculatorNumber(calculateExponent(9, 0).value)).toBe('1');
    expect(formatCalculatorNumber(calculateExponent(5, -3).value)).toBe('0.008');
    expect(formatCalculatorNumber(calculateExponent(81, 0.5).value)).toBe('9');
  });

  it('parses decimal and simple fraction exponents', () => {
    expect(parseExponentInput('1/2')).toBe(0.5);
    expect(parseExponentInput('-3 / 2')).toBe(-1.5);
    expect(parseExponentInput('2.25')).toBe(2.25);
  });

  it('rejects unsupported exponent cases', () => {
    expect(() => parseExponentInput('2/0')).toThrow('Exponent fraction denominator cannot be zero');
    expect(() => calculateExponent(0, -1)).toThrow('Zero cannot be raised to a negative exponent');
    expect(() => calculateExponent(0, 0)).toThrow('0 to the power of 0 is indeterminate');
    expect(() => calculateExponent(-8, 1 / 3)).toThrow('Negative bases need a whole-number exponent');
  });
});

describe('binary integer helpers', () => {
  it('parses and formats binary and decimal integers', () => {
    expect(parseBinaryInteger('1011')).toBe(11n);
    expect(parseBinaryInteger('1111 0000')).toBe(240n);
    expect(parseDecimalInteger('1,024')).toBe(1024n);
    expect(formatBinaryInteger(-13n)).toBe('-1101');
    expect(groupBinaryDigits(255n)).toBe('1111 1111');
  });

  it('calculates binary addition, subtraction, multiplication, and division', () => {
    expect(calculateBinaryIntegerOperation(0b1011n, '+', 0b110n).result).toBe(0b10001n);
    expect(calculateBinaryIntegerOperation(0b10000n, '-', 0b1n).result).toBe(0b1111n);
    expect(calculateBinaryIntegerOperation(0b101n, '*', 0b11n).result).toBe(0b1111n);

    const division = calculateBinaryIntegerOperation(0b1101n, '/', 0b10n);

    expect(division.quotient).toBe(0b110n);
    expect(division.remainder).toBe(0b1n);
  });

  it('rejects invalid binary values and division by zero', () => {
    expect(() => parseBinaryInteger('102')).toThrow('Binary value must contain only 0 and 1');
    expect(() => parseDecimalInteger('12.5')).toThrow('Decimal value must be a whole decimal number');
    expect(() => calculateBinaryIntegerOperation(0b101n, '/', 0n)).toThrow('Cannot divide by zero');
  });
});

describe('hex integer helpers', () => {
  it('parses and formats hexadecimal and decimal integers', () => {
    expect(parseHexInteger('A3')).toBe(163n);
    expect(parseHexInteger('0xff')).toBe(255n);
    expect(parseHexInteger('ffff ffff')).toBe(4294967295n);
    expect(formatHexInteger(-213n)).toBe('-D5');
    expect(groupHexDigits(0xFFFFFFFFn)).toBe('FFFF FFFF');
  });

  it('calculates hex addition, subtraction, multiplication, and division', () => {
    expect(calculateHexIntegerOperation(0xA3n, '+', 0x1Fn).result).toBe(0xC2n);
    expect(calculateHexIntegerOperation(0xFFn, '-', 0x2An).result).toBe(0xD5n);
    expect(calculateHexIntegerOperation(0x1An, '*', 0x3n).result).toBe(0x4En);

    const division = calculateHexIntegerOperation(0x2Fn, '/', 0xAn);

    expect(division.quotient).toBe(0x4n);
    expect(division.remainder).toBe(0x7n);
  });

  it('rejects invalid hex values and division by zero', () => {
    expect(() => parseHexInteger('G1')).toThrow('Hex value must contain only 0-9 and A-F');
    expect(() => parseHexInteger('0x')).toThrow('Hex value must contain only 0-9 and A-F');
    expect(() => calculateHexIntegerOperation(0xAn, '/', 0n)).toThrow('Cannot divide by zero');
  });
});

describe('half-life helpers', () => {
  it('calculates remaining amount, decayed amount, and percentages', () => {
    const result = calculateHalfLifeRemaining(100, 6, 18);

    expect(formatCalculatorNumber(result.halfLives)).toBe('3');
    expect(formatCalculatorNumber(result.remainingAmount)).toBe('12.5');
    expect(formatCalculatorNumber(result.decayedAmount)).toBe('87.5');
    expect(formatCalculatorNumber(result.percentRemaining)).toBe('12.5');
    expect(formatCalculatorNumber(result.percentDecayed)).toBe('87.5');
  });

  it('solves elapsed time from initial amount, final amount, and half-life', () => {
    expect(formatCalculatorNumber(calculateHalfLifeElapsedTime(80, 10, 12))).toBe('36');
    expect(formatCalculatorNumber(calculateHalfLifeElapsedTime(80, 80, 12))).toBe('0');
  });

  it('solves half-life from initial amount, final amount, and elapsed time', () => {
    expect(formatCalculatorNumber(calculateHalfLifeValue(100, 25, 10))).toBe('5');
  });

  it('rejects invalid half-life inputs', () => {
    expect(() => calculateHalfLifeRemaining(100, 0, 10)).toThrow('Half-life must be greater than zero');
    expect(() => calculateHalfLifeRemaining(100, 5, -1)).toThrow('Elapsed time cannot be negative');
    expect(() => calculateHalfLifeElapsedTime(100, 120, 5)).toThrow(
      'Final amount cannot be greater than initial amount',
    );
    expect(() => calculateHalfLifeValue(100, 100, 5)).toThrow('Final amount must be less than initial amount');
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
