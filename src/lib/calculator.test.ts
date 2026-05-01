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
  calculateLongDivision,
  calculateMatrixDeterminant,
  calculateMatrixOperation,
  calculateMeanConfidenceInterval,
  calculateNormalPValue,
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
  calculateAge,
  calculateAiTokenCost,
  calculateApiPricing,
  analyzeText,
  calculateAsphaltEstimate,
  calculateAspectRatio,
  calculateBandwidthTime,
  calculateBoardFoot,
  calculateBraSize,
  calculateBrickEstimate,
  calculateBtuEstimate,
  calculateCarpetEstimate,
  calculateColorContrast,
  calculateConcreteBlockEstimate,
  calculateCssClamp,
  calculateDayOfWeek,
  calculateDateFromUnixTimestamp,
  calculateDeckCostEstimate,
  calculateDensity,
  calculateDeviceBatteryLife,
  calculateDiceRoll,
  calculateDewPoint,
  calculateDownloadTime,
  calculateDrywallEstimate,
  calculateElectricityCost,
  calculateCubicYardEstimate,
  applyPercentageAdjustment,
  addDaysToIsoDate,
  calculateAnnuity,
  calculateAnnuityPayout,
  calculateAprEstimate,
  calculateAssetLease,
  calculateAutoLease,
  calculateAverageReturn,
  calculateBudget,
  calculateBusinessLoan,
  calculateCashBackLowInterest,
  calculateBondEstimate,
  calculateCanadianMortgage,
  calculateCdEstimate,
  calculateCollegeCost,
  calculateCommission,
  calculateCreditCardPayoff,
  calculateConcrete,
  calculateCurrencyConversion,
  calculateDateDifference,
  calculateDateShift,
  calculateFuelCost,
  calculateFenceEstimate,
  calculateFlooringEstimate,
  calculateGasMileage,
  calculateGdpEstimate,
  calculateGolfCourseHandicap,
  calculateGolfScoreDifferential,
  calculateLoveCompatibility,
  calculateGravelEstimate,
  calculateHeatIndex,
  calculateHeightEstimate,
  calculateBmi,
  calculateNutritionPoints,
  calculateOverweightBmiCheck,
  calculateUnderweightBmiCheck,
  calculateAmortizationSummary,
  calculateAutoLoanSummary,
  calculateBodySurfaceArea,
  calculateBoerLeanBodyMass,
  calculateCaloriesBurned,
  calculateCompoundInterest,
  calculateDebtConsolidation,
  calculateDebtToIncome,
  calculateDepreciationEstimate,
  calculateDevineIdealWeight,
  calculateDiscountEstimate,
  calculateDownPayment,
  calculateDueDateFromLmp,
  calculateEstateTaxEstimate,
  calculateFederalIncomeTax2026,
  calculateFhaLoan,
  calculateFixedDebtPayoff,
  calculateFourOhOneKProjection,
  calculateFutureValue,
  calculateGfr2021CkdEpi,
  calculateHeloc,
  calculateHomeEquityLoan,
  calculateHouseAffordability,
  calculateInflationAdjustment,
  calculateInterestRateFromPayment,
  calculateIrr,
  calculateIraProjection,
  calculateLoanSummary,
  calculateMarginEstimate,
  calculateMarriageTaxComparison,
  calculateMacroSplit,
  calculateMifflinStJeor,
  calculateMutualFundEstimate,
  calculateMortgagePayment,
  calculateMortgagePayoffSummary,
  calculateNavyBodyFat,
  calculateOneRepMax,
  calculatePace,
  calculatePaybackPeriod,
  calculatePensionEstimate,
  calculatePregnancyWeightGain,
  calculatePresentValue,
  calculateRentAffordability,
  calculateRealEstateReturn,
  calculateRefinance,
  calculateRentalProperty,
  calculateRentVsBuy,
  calculateRmdEstimate,
  calculateRoi,
  calculateSalaryBreakdown,
  calculateSavingsProjection,
  calculateSalesTax,
  calculateSocialSecurityClaiming,
  calculateTakeHomePaycheck,
  calculateUkMortgage,
  calculateVat,
  calculateVaMortgage,
  calculateGpa,
  calculateHoursWorked,
  calculateHorsepowerConversion,
  calculateInternetSpeedNeeds,
  calculateMassFromDensity,
  calculateMileageCost,
  calculateMolarity,
  calculateMolecularWeight,
  calculateMonitorPpi,
  calculateNeededFinalGrade,
  calculateOhmsLaw,
  calculateMulchEstimate,
  calculatePaintEstimate,
  calculatePaverEstimate,
  calculatePoolVolume,
  calculateRebarGridEstimate,
  calculateResistorColorCode,
  calculateRoofingEstimate,
  calculateSandEstimate,
  calculateSidingEstimate,
  calculateSleepSchedule,
  calculateSoilEstimate,
  calculateSpeed,
  calculateSquareFootage,
  calculateStreamingBitrate,
  calculateSubnet,
  calculateStairLayout,
  calculateTileEstimate,
  calculateTireSize,
  calculateTimeCard,
  calculateTimeDuration,
  calculateTimeZoneComparison,
  calculateTip,
  calculateVoltageDrop,
  calculateWeightForce,
  calculateWallpaperEstimate,
  calculateWindChill,
  calculateEngineHorsepower,
  calculateUnixTimestampFromDate,
  convertMeasurement,
  convertShoeSize,
  convertTextCase,
  buildQueryStringFromLines,
  buildUtmUrl,
  digestText,
  decodeHtmlEntities,
  decodeBase64,
  decodeUrlComponentValue,
  encodeHtmlEntities,
  encodeBase64,
  encodeUrlComponentValue,
  estimatePromptTokens,
  calculateTargetHeartRate,
  calculateTdeeFromBmr,
  classifyBodyType,
  daysBetweenIsoDates,
  estimateBac,
  formatJsonText,
  generateMarkdownTable,
  generatePassword,
  generateSlug,
  generateUuidBatch,
  generateUuidV4,
  parseQueryStringInput,
  numberToRomanNumeral,
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
  romanNumeralToNumber,
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

  it('calculates long division quotient and remainder', () => {
    const result = calculateLongDivision(9876, 24);

    expect(result.quotient).toBe(411);
    expect(result.remainder).toBe(12);
    expect(formatCalculatorNumber(result.decimal)).toBe('411.5');
    expect(() => calculateLongDivision(10, 0)).toThrow('Divisor must be greater than zero');
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

  it('calculates normal-curve p-values from z-scores', () => {
    const twoTail = calculateNormalPValue(1.96, 'two');
    const rightTail = calculateNormalPValue(1.96, 'right');

    expect(formatCalculatorNumber(twoTail.pValue)).toBe('0.0499956522');
    expect(formatCalculatorNumber(rightTail.pValue)).toBe('0.0249978261');
    expect(formatCalculatorNumber(twoTail.leftTail)).toBe('0.9750021739');
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

describe('health and fitness helpers', () => {
  it('calculates BMI and healthy adult BMI range', () => {
    const result = calculateBmi(70, 170);

    expect(formatCalculatorNumber(result.bmi)).toBe('24.2214532872');
    expect(result.category).toBe('Healthy weight');
    expect(formatCalculatorNumber(result.healthyMinKg)).toBe('53.465');
    expect(formatCalculatorNumber(result.healthyMaxKg)).toBe('71.961');
  });

  it('checks underweight, overweight, and nutrition point helpers', () => {
    const underweight = calculateUnderweightBmiCheck(50, 170);
    const overweight = calculateOverweightBmiCheck(78, 170);
    const points = calculateNutritionPoints({
      calories: 240,
      saturatedFatG: 2,
      addedSugarG: 8,
      sodiumMg: 320,
      fiberG: 5,
      proteinG: 9,
    });

    expect(underweight.category).toBe('Underweight');
    expect(formatCalculatorNumber(underweight.kgToHealthyMinimum)).toBe('3.465');
    expect(overweight.category).toBe('Overweight');
    expect(formatCalculatorNumber(overweight.kgToHealthyMaximum)).toBe('6.039');
    expect(points.category).toBe('Moderate points');
    expect(formatCalculatorNumber(points.points)).toBe('4.6833333333');
  });

  it('calculates BMR, TDEE, and macro splits', () => {
    const bmr = calculateMifflinStJeor({ sex: 'male', age: 35, heightCm: 178, weightKg: 82 });
    const tdee = calculateTdeeFromBmr(bmr, 'moderate');
    const macros = calculateMacroSplit(2000, 25, 30, 45);

    expect(formatCalculatorNumber(bmr)).toBe('1762.5');
    expect(formatCalculatorNumber(tdee)).toBe('2731.875');
    expect(formatCalculatorNumber(macros.proteinGrams)).toBe('125');
    expect(formatCalculatorNumber(macros.fatGrams)).toBe('66.6666666667');
    expect(formatCalculatorNumber(macros.carbGrams)).toBe('225');
  });

  it('estimates body composition with tape, lean mass, and ideal weight formulas', () => {
    const bodyFat = calculateNavyBodyFat({
      sex: 'male',
      heightCm: 180,
      weightKg: 84,
      neckCm: 40,
      waistCm: 88,
    });
    const leanMass = calculateBoerLeanBodyMass({ sex: 'female', age: 30, heightCm: 165, weightKg: 62 });
    const idealWeight = calculateDevineIdealWeight('female', 165);

    expect(bodyFat.bodyFatPercent).toBeGreaterThan(15);
    expect(bodyFat.bodyFatPercent).toBeLessThan(25);
    expect(formatCalculatorNumber(leanMass)).toBe('45.369');
    expect(formatCalculatorNumber(idealWeight)).toBe('56.9094488189');
  });

  it('calculates fitness pace, calories burned, one-rep max, and target heart rate', () => {
    const pace = calculatePace(5, 25 * 60);
    const calories = calculateCaloriesBurned(3.8, 70, 45);
    const oneRepMax = calculateOneRepMax(100, 5);
    const heartRate = calculateTargetHeartRate(35, 50, 85, 65);

    expect(formatCalculatorNumber(pace.secondsPerUnit)).toBe('300');
    expect(formatCalculatorNumber(calories)).toBe('209.475');
    expect(formatCalculatorNumber(oneRepMax.epleyKg)).toBe('116.666666667');
    expect(formatCalculatorNumber(heartRate.maxHeartRate)).toBe('185');
    expect(formatCalculatorNumber(heartRate.karvonenLowerBpm ?? 0)).toBe('125');
  });

  it('calculates pregnancy dates and guideline ranges', () => {
    expect(calculateDueDateFromLmp('2026-04-01')).toBe('2027-01-06');
    expect(addDaysToIsoDate('2026-04-01', 14)).toBe('2026-04-15');
    expect(daysBetweenIsoDates('2026-04-01', '2026-04-15')).toBe(14);

    const weightGain = calculatePregnancyWeightGain(165, 62, 70);

    expect(weightGain.category).toBe('Healthy weight');
    expect(formatCalculatorNumber(weightGain.gainedKg)).toBe('8');
    expect(formatCalculatorNumber(weightGain.minGainKg)).toBe('11.3398092503');
  });

  it('calculates clinical-reference estimates and body shape labels', () => {
    const gfr = calculateGfr2021CkdEpi(50, 'female', 0.9);
    const bsa = calculateBodySurfaceArea(170, 70);
    const bac = estimateBac('male', 80, 2, 355, 5, 1);

    expect(gfr.egfr).toBeGreaterThan(70);
    expect(formatCalculatorNumber(bsa.mosteller)).toBe('1.8181186858');
    expect(classifyBodyType(96, 76, 101, 100)).toBe('Hourglass');
    expect(formatCalculatorNumber(bac.bacPercent)).toBe('0.0364880515');
  });
});

describe('finance helpers', () => {
  it('calculates loan, mortgage, and auto loan payment summaries', () => {
    const loan = calculateLoanSummary(250000, 6.5, 30);
    const mortgage = calculateMortgagePayment({
      homePrice: 400000,
      downPayment: 80000,
      annualRatePercent: 6.5,
      years: 30,
      annualPropertyTax: 4800,
      monthlyInsurance: 140,
      monthlyPmi: 0,
      monthlyHoa: 75,
    });
    const auto = calculateAutoLoanSummary({
      purchasePrice: 32000,
      downPayment: 4000,
      tradeIn: 3000,
      fees: 900,
      salesTaxPercent: 6,
      annualRatePercent: 7.2,
      years: 5,
    });

    expect(formatCalculatorNumber(loan.monthlyPayment)).toBe('1580.17005873');
    expect(formatCalculatorNumber(mortgage.totalMonthlyPayment)).toBe('2637.61767518');
    expect(formatCalculatorNumber(mortgage.loanToValuePercent)).toBe('80');
    expect(formatCalculatorNumber(auto.amountFinanced)).toBe('27640');
    expect(auto.monthlyPayment).toBeGreaterThan(540);
  });

  it('calculates compound growth, inflation, amortization savings, and sales tax', () => {
    const compound = calculateCompoundInterest(1000, 6, 10, 12, 100);
    const inflation = calculateInflationAdjustment(100, 3, 10);
    const amortization = calculateAmortizationSummary(200000, 6, 30, 100);
    const salesTax = calculateSalesTax(80, 7.5);

    expect(formatCalculatorNumber(compound.endingBalance)).toBe('18207.3314147');
    expect(formatCalculatorNumber(inflation.futureCost)).toBe('134.391637934');
    expect(amortization.monthsToPayoff).toBeLessThan(360);
    expect(amortization.interestSaved).toBeGreaterThan(40000);
    expect(formatCalculatorNumber(salesTax.total)).toBe('86');
  });

  it('estimates 2026 federal income tax and salary breakdowns', () => {
    const tax = calculateFederalIncomeTax2026({ filingStatus: 'single', grossIncome: 100000 });
    const salary = calculateSalaryBreakdown({
      annualSalary: 78000,
      hoursPerWeek: 40,
      weeksPerYear: 52,
      estimatedTaxRatePercent: 22,
    });

    expect(formatCalculatorNumber(tax.taxableIncome)).toBe('83900');
    expect(formatCalculatorNumber(tax.federalTax)).toBe('13170');
    expect(tax.marginalRatePercent).toBe(22);
    expect(formatCalculatorNumber(salary.grossHourly)).toBe('37.5');
    expect(formatCalculatorNumber(salary.estimatedTakeHomeMonthly)).toBe('5070');
  });

  it('solves an estimated annual rate from payment and rejects impossible payments', () => {
    const rate = calculateInterestRateFromPayment(25000, 483.32, 5);

    expect(formatCalculatorNumber(rate.annualRatePercent)).toBe('5.9999967108');
    expect(() => calculateInterestRateFromPayment(25000, 200, 5)).toThrow(
      'Monthly payment is too low to repay the principal within this term',
    );
  });

  it('calculates the next finance batch estimates', () => {
    const currency = calculateCurrencyConversion(500, 0.92, 2.5);
    const payoff = calculateMortgagePayoffSummary(280000, 6.25, 25, 200, 0);
    const fourOhOneK = calculateFourOhOneKProjection({
      currentBalance: 25000,
      annualSalary: 75000,
      employeeContributionPercent: 8,
      employerMatchPercent: 50,
      employerMatchLimitPercent: 6,
      annualReturnPercent: 7,
      years: 25,
    });
    const affordability = calculateHouseAffordability({
      annualIncome: 110000,
      monthlyDebts: 450,
      downPayment: 60000,
      annualRatePercent: 6.5,
      years: 30,
      debtToIncomePercent: 36,
      propertyTaxPercent: 1.2,
      monthlyInsurance: 140,
      monthlyHoa: 0,
    });
    const savings = calculateSavingsProjection(2500, 300, 4, 5, 25000);
    const rent = calculateRentAffordability(5200, 30, 350, 180);
    const annuity = calculateAnnuity(500, 5, 20, 12, 'ordinary');
    const creditCard = calculateCreditCardPayoff({
      balance: 4500,
      annualRatePercent: 22.9,
      monthlyPayment: 250,
    });

    expect(formatCalculatorNumber(currency.convertedAmount)).toBe('448.5');
    expect(payoff.monthsToPayoff).toBeLessThan(300);
    expect(fourOhOneK.monthlyEmployeeContribution).toBe(500);
    expect(fourOhOneK.monthlyEmployerContribution).toBe(187.5);
    expect(affordability.homePrice).toBeGreaterThan(300000);
    expect(savings.targetMet).toBe(false);
    expect(formatCalculatorNumber(rent.maxRent)).toBe('1030');
    expect(formatCalculatorNumber(annuity.totalPayments)).toBe('120000');
    expect(creditCard.monthsToPayoff).toBeGreaterThan(20);
    expect(() =>
      calculateCreditCardPayoff({ balance: 4500, annualRatePercent: 22.9, monthlyPayment: 50 }),
    ).toThrow('Monthly payment must be higher');
  });

  it('calculates the retirement, debt, education, and investment sitemap batch', () => {
    const pension = calculatePensionEstimate(80000, 25, 1.5);
    const annuityPayout = calculateAnnuityPayout(100000, 5, 20, 12);
    const debtPayoff = calculateFixedDebtPayoff({
      balance: 10000,
      annualRatePercent: 12,
      monthlyPayment: 300,
      extraMonthlyPayment: 100,
    });
    const consolidation = calculateDebtConsolidation({
      totalDebt: 18000,
      currentAnnualRatePercent: 18,
      currentMonthlyPayment: 650,
      newAnnualRatePercent: 10.5,
      newYears: 3,
      fees: 300,
    });
    const college = calculateCollegeCost({
      currentAnnualCost: 28000,
      yearsUntilStart: 8,
      yearsInSchool: 4,
      annualCostIncreasePercent: 4,
      currentSavings: 10000,
      monthlySavings: 250,
      annualSavingsReturnPercent: 5,
    });
    const cd = calculateCdEstimate(10000, 4.25, 12, 3);
    const bond = calculateBondEstimate(1000, 950, 5, 10, 2);
    const mutualFund = calculateMutualFundEstimate(5000, 250, 7, 0.5, 20);
    const ira = calculateIraProjection(25000, 7000, 6.5, 20);

    expect(pension.annualPension).toBe(30000);
    expect(pension.monthlyPension).toBe(2500);
    expect(annuityPayout.payment).toBeGreaterThan(600);
    expect(annuityPayout.payment).toBeLessThan(700);
    expect(debtPayoff.monthsToPayoff).toBeLessThan(30);
    expect(consolidation.consolidationLoan.monthlyPayment).toBeLessThan(consolidation.currentDebt.monthlyPayment);
    expect(college.firstYearCost).toBeGreaterThan(college.currentAnnualCost);
    expect(college.totalEstimatedCost).toBeGreaterThan(college.firstYearCost);
    expect(cd.interestEarned).toBeGreaterThan(400);
    expect(formatCalculatorNumber(bond.currentYieldPercent)).toBe('5.2631578947');
    expect(mutualFund.estimatedExpenseDrag).toBeGreaterThan(0);
    expect(ira.endingBalance).toBeGreaterThan(ira.totalContributions);
    expect(() =>
      calculateFixedDebtPayoff({ balance: 5000, annualRatePercent: 18, monthlyPayment: 50 }),
    ).toThrow('Monthly payment must be higher');
  });

  it('calculates the next finance comparison and planning sitemap batch', () => {
    const vatAdded = calculateVat(100, 20, 'add');
    const vatRemoved = calculateVat(120, 20, 'remove');
    const offer = calculateCashBackLowInterest({
      purchaseAmount: 32000,
      payoffMonths: 60,
      cashBackPercent: 4,
      cashBackAprPercent: 7.2,
      lowInterestAprPercent: 3.9,
    });
    const autoLease = calculateAutoLease({
      vehiclePrice: 36000,
      downPayment: 2500,
      tradeIn: 0,
      residualValue: 21000,
      moneyFactor: 0.0025,
      termMonths: 36,
      taxPercent: 6,
      fees: 950,
    });
    const depreciation = calculateDepreciationEstimate({
      cost: 12000,
      salvageValue: 2000,
      lifeYears: 5,
      ageYears: 2,
      method: 'straight-line',
      decliningRatePercent: 20,
    });
    const averageReturn = calculateAverageReturn({
      beginningValue: 10000,
      endingValue: 16000,
      years: 5,
      contributions: 2000,
      withdrawals: 0,
    });
    const margin = calculateMarginEstimate(100, 60);
    const discount = calculateDiscountEstimate({
      originalPrice: 100,
      discountPercent: 20,
      extraDiscountPercent: 10,
      taxPercent: 5,
    });
    const businessLoan = calculateBusinessLoan({
      principal: 50000,
      annualRatePercent: 9.5,
      years: 5,
      originationFeePercent: 2,
    });
    const dti = calculateDebtToIncome(6000, 900, 1500);
    const lease = calculateAssetLease({
      assetValue: 30000,
      residualValue: 14000,
      annualRatePercent: 6,
      termMonths: 36,
      upfrontPayment: 1500,
      fees: 800,
    });
    const refinance = calculateRefinance({
      currentBalance: 280000,
      currentAnnualRatePercent: 7,
      currentYears: 26,
      newAnnualRatePercent: 5.9,
      newYears: 30,
      closingCosts: 4500,
    });
    const budget = calculateBudget({
      monthlyIncome: 5200,
      housing: 1600,
      utilities: 250,
      food: 650,
      transportation: 420,
      insurance: 280,
      debt: 350,
      savings: 600,
      other: 500,
    });

    expect(vatAdded.grossAmount).toBe(120);
    expect(vatRemoved.netAmount).toBe(100);
    expect(offer.savings).toBeGreaterThan(0);
    expect(['cash-back', 'low-interest']).toContain(offer.betterOption);
    expect(autoLease.monthlyPayment).toBeGreaterThan(400);
    expect(depreciation.bookValue).toBe(8000);
    expect(averageReturn.netGain).toBe(4000);
    expect(margin.marginPercent).toBe(40);
    expect(discount.finalPrice).toBe(75.6);
    expect(businessLoan.originationFee).toBe(1000);
    expect(dti.debtToIncomePercent).toBe(40);
    expect(lease.monthlyPayment).toBeGreaterThan(0);
    expect(refinance.newLoan.monthlyPayment).toBeLessThan(refinance.currentLoan.monthlyPayment);
    expect(budget.leftover).toBe(550);
  });

  it('calculates the remaining finance roadmap estimates', () => {
    const marriage = calculateMarriageTaxComparison({ spouseOneIncome: 90000, spouseTwoIncome: 70000 });
    const estate = calculateEstateTaxEstimate({ grossEstate: 18000000, debtsAndExpenses: 500000 });
    const socialSecurity = calculateSocialSecurityClaiming({
      birthYear: 1962,
      fullRetirementAgeBenefit: 2400,
      claimingAgeYears: 70,
    });
    const rmd = calculateRmdEstimate(500000, 75);
    const realEstate = calculateRealEstateReturn({
      purchasePrice: 350000,
      downPayment: 70000,
      buyingCosts: 8000,
      improvements: 15000,
      sellingPrice: 430000,
      sellingCosts: 25800,
      loanPayoff: 260000,
    });
    const paycheck = calculateTakeHomePaycheck({
      annualGrossPay: 78000,
      payPeriodsPerYear: 26,
      pretaxDeductionsPerPaycheck: 120,
      federalTaxPercent: 12,
      stateTaxPercent: 4,
    });
    const rental = calculateRentalProperty({
      propertyPrice: 300000,
      downPayment: 75000,
      annualRatePercent: 6.75,
      loanYears: 30,
      monthlyRent: 2400,
      vacancyPercent: 5,
      monthlyOperatingExpenses: 260,
      annualPropertyTax: 3600,
      monthlyInsurance: 140,
      maintenancePercent: 1,
      closingCosts: 7000,
    });
    const irr = calculateIrr([-10000, 2200, 2400, 2600, 2800, 4500]);
    const roi = calculateRoi({ initialInvestment: 10000, endingValue: 12500, income: 600, costs: 250 });
    const apr = calculateAprEstimate({ principal: 20000, annualRatePercent: 8, years: 5, fees: 600 });
    const fha = calculateFhaLoan({
      homePrice: 325000,
      downPayment: 11375,
      annualRatePercent: 6.5,
      years: 30,
      upfrontMipPercent: 1.75,
      annualMipPercent: 0.55,
    });
    const va = calculateVaMortgage({
      homePrice: 360000,
      downPayment: 0,
      annualRatePercent: 6.25,
      years: 30,
      firstUse: true,
    });
    const homeEquity = calculateHomeEquityLoan({
      homeValue: 450000,
      currentMortgageBalance: 260000,
      desiredLoanAmount: 50000,
      annualRatePercent: 8.25,
      years: 10,
    });
    const heloc = calculateHeloc({
      homeValue: 450000,
      currentMortgageBalance: 260000,
      creditLine: 80000,
      currentDraw: 30000,
      annualRatePercent: 9,
      repaymentYears: 15,
    });
    const downPayment = calculateDownPayment({ homePrice: 400000, downPaymentPercent: 20, closingCostPercent: 3 });
    const rentVsBuy = calculateRentVsBuy({
      monthlyRent: 2100,
      rentIncreasePercent: 3,
      homePrice: 420000,
      downPayment: 84000,
      annualRatePercent: 6.5,
      years: 7,
      annualPropertyTax: 5000,
      monthlyInsurance: 150,
      maintenancePercent: 1,
      appreciationPercent: 3,
      sellingCostPercent: 6,
    });
    const payback = calculatePaybackPeriod({ initialCost: 15000, annualCashFlow: 3600, horizonYears: 8 });
    const presentValue = calculatePresentValue({
      futureValue: 10000,
      payment: 200,
      annualRatePercent: 5,
      years: 6,
      paymentsPerYear: 12,
    });
    const futureValue = calculateFutureValue({
      principal: 5000,
      payment: 250,
      annualRatePercent: 6,
      years: 10,
      paymentsPerYear: 12,
    });
    const commission = calculateCommission({ salesAmount: 50000, commissionPercent: 3 });
    const ukMortgage = calculateUkMortgage({
      propertyPrice: 300000,
      deposit: 60000,
      annualRatePercent: 5.2,
      years: 25,
    });
    const canadianMortgage = calculateCanadianMortgage({
      propertyPrice: 600000,
      downPayment: 120000,
      annualRatePercent: 5.1,
      years: 25,
    });

    expect(marriage.jointTax.federalTax).toBeGreaterThan(0);
    expect(estate.taxableAboveExclusion).toBe(2500000);
    expect(socialSecurity.monthlyBenefit).toBeGreaterThan(socialSecurity.fullRetirementAgeBenefit);
    expect(rmd.lifeExpectancyFactor).toBe(24.6);
    expect(realEstate.profit).toBeGreaterThan(0);
    expect(paycheck.takeHomePerPaycheck).toBeGreaterThan(0);
    expect(rental.monthlyMortgagePayment).toBeGreaterThan(0);
    expect(irr.annualizedIrrPercent).toBeGreaterThan(0);
    expect(roi.roiPercent).toBeCloseTo(28.5, 8);
    expect(apr.aprPercent).toBeGreaterThan(8);
    expect(fha.monthlyMip).toBeGreaterThan(0);
    expect(va.fundingFeePercent).toBe(2.15);
    expect(homeEquity.availableEquity).toBeGreaterThan(homeEquity.principal);
    expect(heloc.interestOnlyPayment).toBe(225);
    expect(downPayment.downPayment).toBe(80000);
    expect(Number.isFinite(rentVsBuy.buyMinusRent)).toBe(true);
    expect(payback.paybackYears).toBeCloseTo(4.1667, 4);
    expect(presentValue.presentValue).toBeGreaterThan(0);
    expect(futureValue.futureValue).toBeGreaterThan(futureValue.totalContributions);
    expect(commission.totalPay).toBe(1500);
    expect(ukMortgage.loanToValuePercent).toBe(80);
    expect(canadianMortgage.totalInterest).toBeGreaterThan(0);
  });
});

describe('utility helpers', () => {
  it('calculates age, date differences, and date shifts with calendar dates', () => {
    const age = calculateAge('2000-01-01', '2026-04-29');
    const difference = calculateDateDifference('2026-04-29', '2026-12-31');
    const shifted = calculateDateShift('2026-04-29', 0, 1, 2, 3, 'add');

    expect(age.years).toBe(26);
    expect(age.months).toBe(3);
    expect(age.days).toBe(28);
    expect(difference.days).toBe(246);
    expect(difference.weeks).toBe(35);
    expect(difference.remainingDays).toBe(1);
    expect(shifted.resultDate).toBe('2026-06-15');
  });

  it('calculates time durations and hours worked', () => {
    const duration = calculateTimeDuration(
      { hours: 2, minutes: 45, seconds: 30 },
      { hours: 1, minutes: 20, seconds: 45 },
      'add',
    );
    const hours = calculateHoursWorked('09:00', '17:30', 30, 25);

    expect(duration.totalSeconds).toBe(14775);
    expect(formatCalculatorNumber(duration.totalSeconds / 3600)).toBe('4.1041666667');
    expect(formatCalculatorNumber(hours.decimalHours)).toBe('8');
    expect(hours.grossPay).toBe(200);
  });

  it('calculates GPA and final grade needs', () => {
    const gpa = calculateGpa([
      { credits: 3, grade: 'A' },
      { credits: 4, grade: 'B+' },
      { credits: 3, grade: 'A-' },
      { credits: 2, grade: 'B' },
    ]);
    const needed = calculateNeededFinalGrade(87, 30, 90);

    expect(formatCalculatorNumber(gpa.gpa)).toBe('3.525');
    expect(formatCalculatorNumber(gpa.totalQualityPoints)).toBe('42.3');
    expect(formatCalculatorNumber(needed.neededFinalPercent)).toBe('97');
    expect(needed.possibleWithoutExtraCredit).toBe(true);
  });

  it('calculates concrete volume, IPv4 subnet details, conversions, and passwords', () => {
    const concrete = calculateConcrete({ lengthFeet: 10, widthFeet: 12, depthInches: 4, wastePercent: 10 });
    const subnet = calculateSubnet('192.168.1.10', 24);
    const length = convertMeasurement('length', 12, 'foot', 'meter');
    const temperature = convertMeasurement('temperature', 72, 'fahrenheit', 'celsius');
    const password = generatePassword(
      {
        length: 12,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: false,
        avoidAmbiguous: true,
      },
      sequenceSource([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    );

    expect(formatCalculatorNumber(concrete.cubicFeet)).toBe('44');
    expect(formatCalculatorNumber(concrete.cubicYards)).toBe('1.6296296296');
    expect(concrete.bags80lb).toBe(74);
    expect(subnet.networkAddress).toBe('192.168.1.0');
    expect(subnet.broadcastAddress).toBe('192.168.1.255');
    expect(subnet.usableAddresses).toBe(254);
    expect(formatCalculatorNumber(length.result)).toBe('3.6576');
    expect(formatCalculatorNumber(temperature.result)).toBe('22.2222222222');
    expect(password.password).toHaveLength(12);
    expect(password.estimatedEntropyBits).toBeGreaterThan(60);
  });

  it('calculates everyday utility batch formulas', () => {
    const dice = calculateDiceRoll(2, 6, 1, sequenceSource([0, 5]));
    const fuel = calculateFuelCost(120, 28, 3.75, true);
    const squareFeet = calculateSquareFootage(12, 10, 2);
    const gasMileage = calculateGasMileage(350, 12.5);
    const tip = calculateTip(84.5, 20, 8.25, 2);
    const mileage = calculateMileageCost(125, 0.67, 12);

    expect(dice.rolls).toEqual([1, 6]);
    expect(dice.total).toBe(8);
    expect(formatCalculatorNumber(fuel.fuelCost)).toBe('32.1428571429');
    expect(squareFeet.totalSquareFeet).toBe(240);
    expect(formatCalculatorNumber(gasMileage.milesPerGallon)).toBe('28');
    expect(formatCalculatorNumber(tip.perPerson)).toBe('54.185625');
    expect(formatCalculatorNumber(mileage.total)).toBe('95.75');
  });

  it('calculates science, date, encoding, and time helpers for the utility batch', () => {
    const density = calculateDensity(27, 10);
    const mass = calculateMassFromDensity(2.7, 10);
    const weight = calculateWeightForce(70);
    const speed = calculateSpeed(180, 3, 0, 0);
    const day = calculateDayOfWeek('2026-04-29');
    const timeZone = calculateTimeZoneComparison('2026-04-29', '12:00', 'America/New_York');
    const timeCard = calculateTimeCard([
      { label: 'Monday', startTime: '09:00', endTime: '17:30', breakMinutes: 30 },
      { label: 'Tuesday', startTime: '09:00', endTime: '17:30', breakMinutes: 30 },
    ], 25);

    expect(formatCalculatorNumber(density.density)).toBe('2.7');
    expect(formatCalculatorNumber(mass.mass)).toBe('27');
    expect(formatCalculatorNumber(weight.weightNewtons)).toBe('686.4655');
    expect(formatCalculatorNumber(speed.milesPerHour)).toBe('60');
    expect(numberToRomanNumeral(2026)).toBe('MMXXVI');
    expect(romanNumeralToNumber('MMMCMXCIX')).toBe(3999);
    expect(encodeBase64('Hello tools')).toBe('SGVsbG8gdG9vbHM=');
    expect(decodeBase64('SGVsbG8gdG9vbHM=')).toBe('Hello tools');
    expect(encodeUrlComponentValue('price=10&tax=2')).toBe('price%3D10%26tax%3D2');
    expect(decodeUrlComponentValue('hello+tools', true)).toBe('hello tools');
    expect(day.weekday).toBe('Wednesday');
    expect(timeZone.offsetLabel).toBe('UTC-04:00');
    expect(formatCalculatorNumber(timeCard.totalHours)).toBe('16');
    expect(timeCard.grossPay).toBe(400);
  });

  it('calculates construction, weather, chemistry, and practical science helpers', () => {
    const height = calculateHeightEstimate('male', 64, 70);
    const bra = calculateBraSize(32, 36);
    const voltageDrop = calculateVoltageDrop({
      sourceVoltage: 120,
      currentAmps: 15,
      oneWayLengthFeet: 75,
      resistanceOhmsPer1000Feet: 1.588,
      phase: 'single',
    });
    const btu = calculateBtuEstimate({ squareFeet: 300, ceilingHeightFeet: 8, sunlight: 'normal', people: 2, kitchen: false });
    const stairs = calculateStairLayout(108, 7.5, 10);
    const resistor = calculateResistorColorCode('brown', 'black', 'red', 'gold');
    const ohms = calculateOhmsLaw('voltage-current', 12, 2);
    const electricity = calculateElectricityCost(1500, 4, 30, 0.16);
    const shoe = convertShoeSize(26);
    const molarity = calculateMolarity({ grams: 58.44, molarMass: 58.44, volumeLiters: 1 });
    const molecularWeight = calculateMolecularWeight('C6H12O6');
    const sleep = calculateSleepSchedule('wake-up', '07:00', 5, 15);
    const tire = calculateTireSize(225, 60, 16);
    const roof = calculateRoofingEstimate(40, 30, 6, 10);
    const tile = calculateTileEstimate(120, 12, 12, 10);
    const mulch = calculateMulchEstimate(200, 3, 5);
    const gravel = calculateGravelEstimate(20, 10, 3, 1.4);
    const paint = calculatePaintEstimate({ lengthFeet: 12, widthFeet: 10, wallHeightFeet: 8, doors: 1, windows: 2, coats: 2, coverageSquareFeetPerGallon: 350, wastePercent: 10 });
    const drywall = calculateDrywallEstimate(480, 8, 4, 10);
    const carpet = calculateCarpetEstimate(15, 12, 12, 10);
    const flooring = calculateFlooringEstimate({ areaSquareFeet: 240, wastePercent: 10, boxCoverageSquareFeet: 24, pricePerBox: 48 });
    const wallpaper = calculateWallpaperEstimate({ roomLengthFeet: 12, roomWidthFeet: 10, wallHeightFeet: 8, doors: 1, windows: 2, rollCoverageSquareFeet: 56, wastePercent: 10 });
    const fence = calculateFenceEstimate({ perimeterFeet: 120, panelWidthFeet: 8, postSpacingFeet: 8, gateCount: 1, gateWidthFeet: 4 });
    const deck = calculateDeckCostEstimate({ lengthFeet: 16, widthFeet: 12, wastePercent: 10, deckCostPerSquareFoot: 12, railingLinearFeet: 40, railingCostPerFoot: 35, stairsCost: 750 });
    const pavers = calculatePaverEstimate(180, 8, 4, 10);
    const siding = calculateSidingEstimate({ wallAreaSquareFeet: 1200, openingsSquareFeet: 120, wastePercent: 10, pricePerSquare: 180 });
    const brick = calculateBrickEstimate({ wallAreaSquareFeet: 120, brickLengthInches: 7.625, brickHeightInches: 2.25, mortarJointInches: 0.375, wastePercent: 10 });
    const block = calculateConcreteBlockEstimate({ wallLengthFeet: 40, wallHeightFeet: 8, blockLengthInches: 16, blockHeightInches: 8, openingsSquareFeet: 20, wastePercent: 5 });
    const rebar = calculateRebarGridEstimate({ slabLengthFeet: 20, slabWidthFeet: 12, spacingInches: 18, barLengthFeet: 20, wastePercent: 10 });
    const boardFoot = calculateBoardFoot(1, 6, 8, 4);
    const cubicYard = calculateCubicYardEstimate(20, 10, 3, 5);
    const pool = calculatePoolVolume('rectangle', 24, 12, 4.5);
    const sand = calculateSandEstimate({ lengthFeet: 20, widthFeet: 10, depthInches: 2, tonsPerCubicYard: 1.35, wastePercent: 5 });
    const soil = calculateSoilEstimate(120, 4, 10);
    const asphalt = calculateAsphaltEstimate({ lengthFeet: 30, widthFeet: 12, depthInches: 3, tonsPerCubicYard: 2, wastePercent: 5 });
    const windChill = calculateWindChill(30, 15);
    const heatIndex = calculateHeatIndex(90, 70);
    const dewPoint = calculateDewPoint(75, 60);
    const bandwidth = calculateBandwidthTime(5, 'GB', 100, 'Mbps');

    expect(formatCalculatorNumber(height.estimatedAdultHeightInches)).toBe('69.5');
    expect(bra.sizeLabel).toBe('32D');
    expect(formatCalculatorNumber(voltageDrop.percentDrop)).toBe('2.9775');
    expect(btu.recommendedBtu).toBe(7000);
    expect(stairs.riserCount).toBe(14);
    expect(resistor.resistanceOhms).toBe(1000);
    expect(ohms.resistance).toBe(6);
    expect(electricity.cost).toBe(28.8);
    expect(shoe.usWomen).toBeGreaterThan(shoe.usMen);
    expect(molarity.molarity).toBe(1);
    expect(formatCalculatorNumber(molecularWeight.molarMass)).toBe('180.156');
    expect(sleep.targetTime).toBe('23:15');
    expect(formatCalculatorNumber(tire.tireDiameterInches)).toBe('26.6299212598');
    expect(roof.shingleBundles).toBeGreaterThan(40);
    expect(tile.tilesNeeded).toBe(132);
    expect(formatCalculatorNumber(mulch.cubicYards)).toBe('1.9444444444');
    expect(formatCalculatorNumber(gravel.tons)).toBe('2.5925925926');
    expect(paint.gallonsToBuy).toBe(2);
    expect(drywall.sheetsNeeded).toBe(17);
    expect(formatCalculatorNumber(carpet.squareYards)).toBe('22');
    expect(flooring.boxesNeeded).toBe(11);
    expect(flooring.estimatedCost).toBe(528);
    expect(wallpaper.rollsNeeded).toBe(6);
    expect(fence.totalPosts).toBe(18);
    expect(deck.totalCost).toBe(4684.4);
    expect(pavers.paversNeeded).toBe(891);
    expect(siding.squaresNeeded).toBe(12);
    expect(brick.bricksNeeded).toBe(906);
    expect(block.blocksNeeded).toBe(355);
    expect(rebar.barsToBuy).toBe(20);
    expect(boardFoot.totalBoardFeet).toBe(16);
    expect(formatCalculatorNumber(cubicYard.cubicYards)).toBe('1.9444444444');
    expect(formatCalculatorNumber(pool.gallons)).toBe('9694.75392');
    expect(formatCalculatorNumber(sand.tons)).toBe('1.75');
    expect(soil.twoCubicFootBags).toBe(22);
    expect(asphalt.tons).toBe(7);
    expect(windChill.resultFahrenheit).toBeLessThan(30);
    expect(heatIndex.resultFahrenheit).toBeGreaterThan(90);
    expect(formatCalculatorNumber(calculateHeatIndex(70, 50).resultFahrenheit)).toBe('69.525');
    expect(() => calculateWindChill(60, 10)).toThrow(/50 F or colder/);
    expect(() => calculateWindChill(30, 3)).toThrow(/above 3 mph/);
    expect(dewPoint.resultFahrenheit).toBeLessThan(75);
    expect(bandwidth.seconds).toBe(400);
  });

  it('calculates GDP, horsepower, engine horsepower, and golf handicap helpers', () => {
    const gdp = calculateGdpEstimate(18000, 5000, 6500, 3200, 4100, 340000000);
    const scaledGdp = calculateGdpEstimate(18000, 5000, 6500, 3200, 4100, 0.34);
    const horsepower = calculateHorsepowerConversion(100, 'kilowatt');
    const engine = calculateEngineHorsepower(300, 5252.1131, 15);
    const differential = calculateGolfScoreDifferential(86, 71.2, 128, 0);
    const courseHandicap = calculateGolfCourseHandicap(14.2, 128, 71.2, 72, 95);
    const love = calculateLoveCompatibility('Alex', 'Sam');
    const loveReversed = calculateLoveCompatibility('Sam', 'Alex');

    expect(gdp.gdp).toBe(28600);
    expect(formatCalculatorNumber(gdp.gdpPerPerson ?? 0)).toBe('0.0000841176');
    expect(formatCalculatorNumber(scaledGdp.gdpPerPerson ?? 0)).toBe('84117.6470588');
    expect(formatCalculatorNumber(horsepower.mechanicalHorsepower)).toBe('134.102203849');
    expect(formatCalculatorNumber(engine.engineHorsepower)).toBe('300');
    expect(formatCalculatorNumber(engine.wheelHorsepower)).toBe('255');
    expect(differential.scoreDifferential).toBe(13.1);
    expect(courseHandicap.courseHandicap).toBe(15);
    expect(courseHandicap.playingHandicap).toBe(14);
    expect(love.score).toBe(loveReversed.score);
    expect(love.label.length).toBeGreaterThan(0);
  });

  it('calculates text, developer, timestamp, color, and aspect-ratio utility helpers', async () => {
    const text = analyzeText('Access Free Tools helps people.\n\nTools stay local.');
    const caseResult = convertTextCase('basic calculator result', 'camel');
    const slug = generateSlug('How to Use the Kawaii Calculator', 60);
    const json = formatJsonText('{"z":3,"a":{"b":2,"a":1}}', true);
    const uuid = generateUuidV4(sequenceSource([0x03020100, 0x07060504, 0x0b0a0908, 0x0f0e0d0c]));
    const batch = generateUuidBatch(2, true, false, sequenceSource([
      0x03020100,
      0x07060504,
      0x0b0a0908,
      0x0f0e0d0c,
      0x13121110,
      0x17161514,
      0x1b1a1918,
      0x1f1e1d1c,
    ]));
    const digest = await digestText('abc', 'SHA-256');
    const timestamp = calculateUnixTimestampFromDate('2026-04-29', '12:00');
    const dateFromTimestamp = calculateDateFromUnixTimestamp(timestamp.seconds, 'seconds');
    const contrast = calculateColorContrast('#101828', '#ffffff');
    const aspect = calculateAspectRatio(1920, 1080, 1280);

    expect(text.words).toBe(8);
    expect(text.paragraphs).toBe(2);
    expect(caseResult.output).toBe('basicCalculatorResult');
    expect(slug.slug).toBe('how-to-use-the-kawaii-calculator');
    expect(json.output).toContain('"a": 1');
    expect(uuid).toBe('00010203-0405-4607-8809-0a0b0c0d0e0f');
    expect(batch.uuids[0]).toBe('000102030405460788090A0B0C0D0E0F');
    expect(digest.hexDigest).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    expect(timestamp.utcIso).toBe('2026-04-29T12:00:00.000Z');
    expect(dateFromTimestamp.utcDate).toBe('2026-04-29');
    expect(contrast.passesAaNormal).toBe(true);
    expect(aspect.ratioLabel).toBe('16:9');
    expect(aspect.scaledHeight).toBe(720);
  });

  it('calculates the expanded browser utility helpers', () => {
    const utm = buildUtmUrl({
      baseUrl: 'accessfreetools.com/tools/',
      source: 'newsletter',
      medium: 'email',
      campaign: 'spring-tools',
      content: 'hero-button',
    });
    const parsedQuery = parseQueryStringInput('https://example.com/?utm_source=newsletter&tag=a&tag=b');
    const builtQuery = buildQueryStringFromLines('utm_source=newsletter\nutm_medium=email');
    const encodedEntities = encodeHtmlEntities('<a title="Tools">Free & fast</a>');
    const decodedEntities = decodeHtmlEntities('&lt;strong&gt;Tools&lt;/strong&gt;');
    const clamp = calculateCssClamp(18, 32, 360, 1280, 16);
    const table = generateMarkdownTable('Tool, Use, Status', 'UTM Builder, Campaign links, Live\nJSON Formatter, Read data, Live', 'left');

    expect(utm.outputUrl).toContain('utm_source=newsletter');
    expect(utm.outputUrl).toContain('utm_content=hero-button');
    expect(parsedQuery.output).toContain('"tag": [');
    expect(parsedQuery.duplicateKeyCount).toBe(1);
    expect(builtQuery.output).toBe('?utm_source=newsletter&utm_medium=email');
    expect(encodedEntities.output).toBe('&lt;a title=&quot;Tools&quot;&gt;Free &amp; fast&lt;/a&gt;');
    expect(decodedEntities.output).toBe('<strong>Tools</strong>');
    expect(clamp.css).toBe('clamp(1.125rem, calc(0.782609rem + 1.521739vw), 2rem)');
    expect(formatCalculatorNumber(clamp.middleSizePx)).toBe('25');
    expect(table.output).toContain('| Tool | Use | Status |');
    expect(table.rowCount).toBe(2);
  });

  it('calculates competitor tech and AI utility helpers', () => {
    const tokenCost = calculateAiTokenCost(1200, 500, 10000, 0.5, 1.5);
    const promptEstimate = estimatePromptTokens('abcd efgh', 4);
    const apiPricing = calculateApiPricing(1000, 2, 0.01, 5, 10);
    const download = calculateDownloadTime(50, 'GB', 100, 85);
    const speedNeeds = calculateInternetSpeedNeeds(2, 15, 1, 5, 1, 4, 6, 0.5, 25);
    const bitrate = calculateStreamingBitrate(6, 'Mbps', 2, 0, 1);
    const battery = calculateDeviceBatteryLife(10000, 3.7, 8, 85);
    const ppi = calculateMonitorPpi(1920, 1080, 24);

    expect(tokenCost.totalCost).toBe(13.5);
    expect(formatCalculatorNumber(tokenCost.costPerRequest)).toBe('0.00135');
    expect(promptEstimate.estimatedTokens).toBe(3);
    expect(promptEstimate.words).toBe(2);
    expect(apiPricing.billableUnits).toBe(2200);
    expect(apiPricing.totalCost).toBe(27);
    expect(formatCalculatorNumber(download.seconds)).toBe('4705.88235294');
    expect(speedNeeds.recommendedMbps).toBe(52.5);
    expect(bitrate.gigabytes).toBe(5.4);
    expect(formatCalculatorNumber(battery.runtimeHours)).toBe('3.93125');
    expect(formatCalculatorNumber(ppi.ppi)).toBe('91.7877987534');
    expect(ppi.aspectLabel).toBe('16:9');
  });
});
