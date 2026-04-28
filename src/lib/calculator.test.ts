import {
  calculateBinary,
  calculateBigIntegerOperation,
  calculateBinaryIntegerOperation,
  calculateCircleFromMeasurement,
  calculateDistance2d,
  calculateDescriptiveStatistics,
  calculateFactors,
  calculateFraction,
  calculateEquivalentRatio,
  calculateGreatestCommonFactor,
  calculateHexIntegerOperation,
  calculateHalfLifeElapsedTime,
  calculateHalfLifeRemaining,
  calculateHalfLifeValue,
  calculateLeastCommonMultiple,
  calculateLogarithm,
  calculateMatrixDeterminant,
  calculateMatrixOperation,
  calculateMeanConfidenceInterval,
  calculateNumberSequence,
  calculateNthRoot,
  calculatePermutationCombination,
  calculateProbability,
  calculateProportionConfidenceInterval,
  calculateRoundedValue,
  calculatePercentageChange,
  calculatePercentageOf,
  calculateExponent,
  calculatePercentError,
  calculatePercentOf,
  calculatePythagorean,
  calculateQuadraticFormula,
  calculateRatioShare,
  calculateRightTriangle,
  calculateSampleSize,
  calculateShapeArea,
  calculateShapeSurfaceArea,
  calculateShapeVolume,
  calculateScientificExpression,
  calculateStandardDeviation,
  calculateSlope,
  calculateTriangleFromSides,
  calculateZScore,
  fromScientificNotation,
  formatCalculatorNumber,
  formatBigInteger,
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
  parseBigInteger,
  parseBigIntegerList,
  parseBinaryInteger,
  parseDecimalInteger,
  parseExponentInput,
  parseHexInteger,
  parseExcludedNumbers,
  parseDisplayValue,
  parseNumberList,
  percentDisplayValue,
  randomIntegerInRange,
  reversePercentageValue,
  simplifyRatioValues,
  simplifyFraction,
  toScientificNotation,
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

describe('logarithm helpers', () => {
  it('calculates custom-base, common, and natural logs', () => {
    const binaryLog = calculateLogarithm(8, 2);
    const naturalLog = calculateLogarithm(Math.E ** 3, Math.E);

    expect(formatCalculatorNumber(binaryLog.result)).toBe('3');
    expect(formatCalculatorNumber(binaryLog.commonLog)).toBe('0.903089987');
    expect(formatCalculatorNumber(naturalLog.result)).toBe('3');
    expect(formatCalculatorNumber(calculateLogarithm(1000, 10).result)).toBe('3');
  });

  it('rejects invalid logarithm inputs', () => {
    expect(() => calculateLogarithm(0, 2)).toThrow('Log value must be greater than zero');
    expect(() => calculateLogarithm(8, 1)).toThrow('Log base cannot be 1');
  });
});

describe('root helpers', () => {
  it('calculates square, cube, and fourth roots', () => {
    expect(formatCalculatorNumber(calculateNthRoot(144, 2).value)).toBe('12');
    expect(formatCalculatorNumber(calculateNthRoot(-125, 3).value)).toBe('-5');
    expect(formatCalculatorNumber(calculateNthRoot(81, 4).value)).toBe('3');
  });

  it('rejects unsupported real-number roots', () => {
    expect(() => calculateNthRoot(-16, 2)).toThrow('Even roots of negative numbers are not real numbers');
    expect(() => calculateNthRoot(16, 1)).toThrow('Root index must be at least 2');
    expect(() => calculateNthRoot(16, 2.5)).toThrow('Root index must be a whole number');
  });
});

describe('geometry helpers', () => {
  it('solves a triangle from three sides', () => {
    const result = calculateTriangleFromSides(13, 14, 15);

    expect(formatCalculatorNumber(result.area)).toBe('84');
    expect(formatCalculatorNumber(result.perimeter)).toBe('42');
    expect(result.sideType).toBe('scalene');
    expect(result.angleType).toBe('acute');
  });

  it('calculates common area, volume, and surface area formulas', () => {
    expect(formatCalculatorNumber(calculateShapeArea('trapezoid', { baseA: 8, baseB: 14, height: 5 }).value)).toBe('55');
    expect(formatCalculatorNumber(calculateShapeVolume('cylinder', { radius: 3, height: 10 }).value)).toBe('282.743338823');
    expect(formatCalculatorNumber(calculateShapeSurfaceArea('sphere', { radius: 4 }).value)).toBe('201.06192983');
  });

  it('converts circle measurements from different known values', () => {
    const fromDiameter = calculateCircleFromMeasurement('diameter', 10);

    expect(formatCalculatorNumber(fromDiameter.radius)).toBe('5');
    expect(formatCalculatorNumber(fromDiameter.area)).toBe('78.5398163397');
  });

  it('calculates slope, distance, and midpoint from two points', () => {
    const slope = calculateSlope(1, 2, 5, 10);
    const distance = calculateDistance2d(1, 2, 4, 6);

    expect(formatCalculatorNumber(slope.slope ?? 0)).toBe('2');
    expect(formatCalculatorNumber(slope.yIntercept ?? 0)).toBe('0');
    expect(formatCalculatorNumber(distance.distance)).toBe('5');
    expect(distance.midpoint).toEqual({ x: 2.5, y: 4 });
  });

  it('handles vertical slopes', () => {
    expect(calculateSlope(3, 2, 3, 8).slope).toBeNull();
  });

  it('solves Pythagorean and right triangle values', () => {
    const pythagorean = calculatePythagorean('hypotenuse', { legA: 3, legB: 4 });
    const rightTriangle = calculateRightTriangle('leg-hypotenuse', { leg: 5, hypotenuse: 13 });

    expect(formatCalculatorNumber(pythagorean.hypotenuse)).toBe('5');
    expect(formatCalculatorNumber(rightTriangle.legB)).toBe('12');
    expect(formatCalculatorNumber(rightTriangle.area)).toBe('30');
    expect(formatCalculatorNumber(rightTriangle.perimeter)).toBe('30');
  });

  it('rejects impossible geometry inputs', () => {
    expect(() => calculateTriangleFromSides(1, 2, 3)).toThrow('triangle inequality');
    expect(() => calculatePythagorean('leg-a', { legB: 5, hypotenuse: 4 })).toThrow('Hypotenuse');
    expect(() => calculateCircleFromMeasurement('radius', 0)).toThrow('greater than zero');
  });
});

describe('ratio helpers', () => {
  it('simplifies whole-number and decimal ratios', () => {
    expect(simplifyRatioValues([12, 18]).simplifiedValues).toEqual([2, 3]);
    expect(simplifyRatioValues([1.5, 2.5]).simplifiedValues).toEqual([3, 5]);
    expect(simplifyRatioValues([0, 12]).simplifiedValues).toEqual([0, 1]);
  });

  it('calculates equivalent ratios and ratio shares', () => {
    expect(formatCalculatorNumber(calculateEquivalentRatio(4, 7, 20).newRight)).toBe('35');

    const split = calculateRatioShare(100, [2, 3]);

    expect(split.shares.map((share) => formatCalculatorNumber(share))).toEqual(['40', '60']);
  });

  it('rejects invalid ratio inputs', () => {
    expect(() => simplifyRatioValues([0, 0])).toThrow('At least one ratio value must be greater than zero');
    expect(() => simplifyRatioValues([2, -3])).toThrow('Ratio value 2 cannot be negative');
    expect(() => calculateEquivalentRatio(0, 7, 20)).toThrow('Known left value must be greater than zero');
  });
});

describe('number theory helpers', () => {
  it('calculates greatest common factor and least common multiple', () => {
    expect(calculateGreatestCommonFactor([24n, 36n, 60n])).toBe(12n);
    expect(calculateLeastCommonMultiple([12n, 18n, 30n])).toBe(180n);
  });

  it('parses and formats big integer lists', () => {
    expect(parseBigInteger('1,234,567')).toBe(1234567n);
    expect(parseBigIntegerList('12, 18; 30')).toEqual([12n, 18n, 30n]);
    expect(formatBigInteger(12345678901234567890n)).toBe('12,345,678,901,234,567,890');
  });

  it('finds factors, factor pairs, and prime factorization', () => {
    const result = calculateFactors(84);

    expect(result.factors).toEqual([1, 2, 3, 4, 6, 7, 12, 14, 21, 28, 42, 84]);
    expect(result.factorPairs).toContainEqual([7, 12]);
    expect(result.primeFactors).toEqual([2, 2, 3, 7]);
    expect(result.primeFactorPowers).toEqual([
      { prime: 2, exponent: 2 },
      { prime: 3, exponent: 1 },
      { prime: 7, exponent: 1 },
    ]);
    expect(calculateFactors(97).isPrime).toBe(true);
  });

  it('rejects invalid number theory inputs', () => {
    expect(() => calculateGreatestCommonFactor([0n, 4n])).toThrow('Value 1 must be greater than zero');
    expect(() => calculateLeastCommonMultiple([12n])).toThrow('Enter at least two whole numbers');
    expect(() => parseBigInteger('12.5')).toThrow('Value must be a whole number');
    expect(() => calculateFactors(0)).toThrow('Value must be greater than zero');
  });
});

describe('rounding helpers', () => {
  it('rounds decimal places, significant figures, and place values', () => {
    expect(formatCalculatorNumber(calculateRoundedValue(12.3456, 'decimal-places', 2).result)).toBe('12.35');
    expect(formatCalculatorNumber(calculateRoundedValue(98765, 'significant-figures', 3).result)).toBe('98800');
    expect(formatCalculatorNumber(calculateRoundedValue(1846, 'place-value', 2).result)).toBe('1800');
  });

  it('supports up, down, and truncate methods', () => {
    expect(formatCalculatorNumber(calculateRoundedValue(12.341, 'decimal-places', 2, 'up').result)).toBe('12.35');
    expect(formatCalculatorNumber(calculateRoundedValue(12.349, 'decimal-places', 2, 'down').result)).toBe('12.34');
    expect(formatCalculatorNumber(calculateRoundedValue(-12.349, 'decimal-places', 2, 'truncate').result)).toBe('-12.34');
  });

  it('rejects invalid rounding precision', () => {
    expect(() => calculateRoundedValue(12.3, 'decimal-places', -1)).toThrow('Decimal places must be between 0 and 12');
    expect(() => calculateRoundedValue(12.3, 'significant-figures', 0)).toThrow(
      'Significant figures must be between 1 and 15',
    );
  });
});

describe('matrix helpers', () => {
  const left = [
    [1, 2],
    [3, 4],
  ];
  const right = [
    [5, 6],
    [7, 8],
  ];

  it('adds, subtracts, multiplies, transposes, and finds determinants', () => {
    expect(calculateMatrixOperation('add', left, right).result).toEqual([
      [6, 8],
      [10, 12],
    ]);
    expect(calculateMatrixOperation('subtract', right, left).result).toEqual([
      [4, 4],
      [4, 4],
    ]);
    expect(calculateMatrixOperation('multiply', left, right).result).toEqual([
      [19, 22],
      [43, 50],
    ]);
    expect(calculateMatrixOperation('transpose', left).result).toEqual([
      [1, 3],
      [2, 4],
    ]);
    expect(calculateMatrixDeterminant(left)).toBe(-2);
  });

  it('finds a 3 by 3 determinant and rejects bad sizes', () => {
    expect(
      calculateMatrixDeterminant([
        [6, 1, 1],
        [4, -2, 5],
        [2, 8, 7],
      ]),
    ).toBe(-306);
    expect(() => calculateMatrixOperation('add', [[1, 2]], [[1]])).toThrow('Matrices must have the same size');
  });
});

describe('scientific notation helpers', () => {
  it('converts standard numbers to scientific notation', () => {
    const result = toScientificNotation(4500000);

    expect(result.coefficient).toBe(4.5);
    expect(result.exponent).toBe(6);
    expect(result.notation).toBe('4.5 x 10^6');
  });

  it('converts scientific notation to standard numbers', () => {
    const result = fromScientificNotation(6.02, 23);

    expect(result.notation).toBe('6.02 x 10^23');
    expect(formatCalculatorNumber(result.original)).toContain('e+');
  });

  it('rejects invalid scientific notation exponents', () => {
    expect(() => fromScientificNotation(1.2, 3.5)).toThrow('Exponent must be a whole number');
  });
});

describe('big number helpers', () => {
  it('calculates exact large integer arithmetic', () => {
    expect(calculateBigIntegerOperation(9007199254740993n, '+', 7n).result).toBe(9007199254741000n);
    expect(calculateBigIntegerOperation(12345678901234567890n, '*', 10n).result).toBe(123456789012345678900n);

    const division = calculateBigIntegerOperation(100n, '/', 9n);

    expect(division.quotient).toBe(11n);
    expect(division.remainder).toBe(1n);
  });
});

describe('statistics helpers', () => {
  it('parses number lists and calculates descriptive statistics', () => {
    const values = parseNumberList('2, 4, 4, 4, 5, 5, 7, 9');
    const result = calculateDescriptiveStatistics(values);

    expect(result.count).toBe(8);
    expect(result.mean).toBe(5);
    expect(result.median).toBe(4.5);
    expect(result.modes).toEqual([4]);
    expect(result.range).toBe(7);
    expect(formatCalculatorNumber(result.populationStandardDeviation)).toBe('2');
  });

  it('calculates sample and population standard deviation', () => {
    const values = [2, 4, 4, 4, 5, 5, 7, 9];

    expect(formatCalculatorNumber(calculateStandardDeviation(values, false).standardDeviation)).toBe('2');
    expect(formatCalculatorNumber(calculateStandardDeviation(values, true).standardDeviation)).toBe('2.1380899353');
    expect(() => calculateStandardDeviation([10], true)).toThrow(
      'Sample standard deviation needs at least two numbers',
    );
  });

  it('generates arithmetic, geometric, and fibonacci sequences', () => {
    expect(calculateNumberSequence('arithmetic', 3, 4, 5).terms).toEqual([3, 7, 11, 15, 19]);
    expect(calculateNumberSequence('geometric', 2, 3, 5).terms).toEqual([2, 6, 18, 54, 162]);
    expect(calculateNumberSequence('fibonacci', 1, 1, 7).terms).toEqual([1, 1, 2, 3, 5, 8, 13]);
  });

  it('calculates probability union, complements, and independent intersection', () => {
    const result = calculateProbability(0.4, 0.25);

    expect(formatCalculatorNumber(result.intersection)).toBe('0.1');
    expect(formatCalculatorNumber(result.union)).toBe('0.55');
    expect(formatCalculatorNumber(result.complementA)).toBe('0.6');
    expect(result.independentIntersection).toBe(true);
    expect(() => calculateProbability(0.8, 0.7, 0.1)).toThrow('Union probability cannot be greater than 1');
  });

  it('calculates sample size with and without finite population correction', () => {
    const openPopulation = calculateSampleSize(95, 5, 50);
    const finitePopulation = calculateSampleSize(95, 5, 50, 1000);

    expect(openPopulation.requiredSampleSize).toBe(385);
    expect(finitePopulation.requiredSampleSize).toBe(278);
  });

  it('calculates permutations and combinations exactly', () => {
    const result = calculatePermutationCombination(10, 3);

    expect(result.permutations).toBe(720n);
    expect(result.combinations).toBe(120n);
    expect(() => calculatePermutationCombination(4, 5)).toThrow('r must be between 0 and n');
  });

  it('calculates z-scores and confidence intervals', () => {
    const zScore = calculateZScore(85, 70, 10);
    const meanInterval = calculateMeanConfidenceInterval(68, 3, 36, 90);
    const proportionInterval = calculateProportionConfidenceInterval(52, 100, 95);

    expect(formatCalculatorNumber(zScore.zScore)).toBe('1.5');
    expect(formatCalculatorNumber(zScore.percentile * 100)).toBe('93.3192769023');
    expect(formatCalculatorNumber(meanInterval.marginOfError)).toBe('0.8225');
    expect(formatCalculatorNumber(proportionInterval.pointEstimate)).toBe('0.52');
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

describe('quadratic formula helpers', () => {
  it('solves two real roots and vertex values', () => {
    const result = calculateQuadraticFormula(1, -3, 2);

    expect(result.rootType).toBe('two-real');
    expect(result.discriminant).toBe(1);
    expect(formatCalculatorNumber(result.roots[0].real)).toBe('2');
    expect(formatCalculatorNumber(result.roots[1].real)).toBe('1');
    expect(formatCalculatorNumber(result.vertex.x)).toBe('1.5');
    expect(formatCalculatorNumber(result.vertex.y)).toBe('-0.25');
  });

  it('solves one repeated real root', () => {
    const result = calculateQuadraticFormula(1, -4, 4);

    expect(result.rootType).toBe('one-real');
    expect(result.discriminant).toBe(0);
    expect(formatCalculatorNumber(result.roots[0].real)).toBe('2');
    expect(formatCalculatorNumber(result.vertex.y)).toBe('0');
  });

  it('solves complex conjugate roots', () => {
    const result = calculateQuadraticFormula(1, 2, 5);

    expect(result.rootType).toBe('complex');
    expect(result.discriminant).toBe(-16);
    expect(formatCalculatorNumber(result.roots[0].real)).toBe('-1');
    expect(formatCalculatorNumber(result.roots[0].imaginary)).toBe('2');
    expect(formatCalculatorNumber(result.roots[1].imaginary)).toBe('-2');
  });

  it('handles negative leading coefficients', () => {
    const result = calculateQuadraticFormula(-16, 64, 0);

    expect(result.opens).toBe('down');
    expect(formatCalculatorNumber(result.roots[0].real)).toBe('0');
    expect(formatCalculatorNumber(result.roots[1].real)).toBe('4');
    expect(formatCalculatorNumber(result.vertex.x)).toBe('2');
    expect(formatCalculatorNumber(result.vertex.y)).toBe('64');
  });

  it('rejects non-quadratic equations', () => {
    expect(() => calculateQuadraticFormula(0, 2, 1)).toThrow(
      'Coefficient a cannot be zero for a quadratic equation',
    );
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
