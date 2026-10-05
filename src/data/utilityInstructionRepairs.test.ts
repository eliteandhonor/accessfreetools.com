import { describe, expect, it } from 'vitest';

import {
  calculateApiPricing,
  calculateBakingPanConversion,
  calculateConcrete,
  calculateCostPerServing,
  calculateDownloadTime,
  calculateGpa,
  calculateHorsepowerConversion,
  calculateHoursWorked,
  calculateIngredientCost,
  calculateInternetSpeedNeeds,
  calculateMonitorPpi,
  calculateNeededFinalGrade,
  calculateRecipeScale,
  calculateStreamingBitrate,
  calculateTimeDuration,
  compareUnitPrices,
  convertButter,
  convertCookingMeasurement,
  convertMeasurement,
  generatePassword,
} from '../lib/calculator';
import { utilityInstructionRepairs, utilityTrustRepairs } from './utilityInstructionRepairs';

const instructions = (slug: string) => utilityInstructionRepairs[slug]!.join(' ');

describe('calculator-backed utility instruction examples and limits', () => {
  it('carries duration units and preserves the subtraction sign', () => {
    const first = { hours: 2, minutes: 45, seconds: 30 };
    const second = { hours: 1, minutes: 20, seconds: 45 };
    const result = calculateTimeDuration(first, second, 'add');
    expect(result.totalSeconds).toBe(4 * 3600 + 6 * 60 + 15);
    expect(instructions('time-calculator')).toContain('4h 6m 15s');
    expect(calculateTimeDuration(second, first, 'subtract').totalSeconds).toBe(-5085);
    expect(utilityTrustRepairs['time-calculator']).toContain('durations');
  });

  it('matches overnight break and pay instructions without interpreting equal times as a full day', () => {
    const result = calculateHoursWorked('22:00', '06:30', 45, 32);
    expect(result.crossedMidnight).toBe(true);
    expect(result.decimalHours).toBe(7.75);
    expect(result.grossPay).toBe(248);
    expect(instructions('hours-calculator')).toContain('7.75 hours');
    expect(instructions('hours-calculator')).toContain('$248');
    expect(calculateHoursWorked('09:00', '09:00', 0).decimalHours).toBe(0);
    expect(() => calculateHoursWorked('09:00', '09:00', 30)).toThrow(/Break time cannot be longer/);
    expect(instructions('hours-calculator')).toContain('With Break minutes set to 0');
  });

  it('weights GPA by credits and uses the documented fixed A+ value', () => {
    const result = calculateGpa([{ credits: 3, grade: 'A' }, { credits: 1, grade: 'B' }]);
    expect(result.gpa).toBe(3.75);
    expect(result.totalCredits).toBe(4);
    expect(instructions('gpa-calculator')).toContain('3.75 GPA');
    expect(calculateGpa([{ credits: 3, grade: 'A+' }]).gpa).toBe(4);
    expect(instructions('gpa-calculator')).toContain('A and A+ both count as 4.0');
  });

  it('solves the stated final-grade goal and distinguishes goals needing extra credit', () => {
    const result = calculateNeededFinalGrade(80, 25, 85);
    expect(result.neededFinalPercent).toBe(100);
    expect(result.possibleWithoutExtraCredit).toBe(true);
    expect(instructions('grade-calculator')).toContain('require 100% on the final');
    expect(calculateNeededFinalGrade(80, 25, 90).possibleWithoutExtraCredit).toBe(false);
  });

  it('matches the slab example after converting inches and adding waste', () => {
    const result = calculateConcrete({ lengthFeet: 10, widthFeet: 12, depthInches: 4, wastePercent: 10 });
    expect(result.cubicFeet).toBe(44);
    expect(result.cubicYards).toBeCloseTo(1.63, 2);
    expect(instructions('concrete-calculator')).toContain('44 cubic feet, about 1.63 cubic yards');
    expect(result.bags80lb).toBe(74);
    expect(utilityTrustRepairs['concrete-calculator']).toContain('approximate dry-mix yields');
  });

  it('demonstrates that a selected character group is allowed rather than guaranteed', () => {
    const result = generatePassword({
      length: 8, includeUppercase: true, includeLowercase: false,
      includeNumbers: true, includeSymbols: false, avoidAmbiguous: false,
    }, () => 0);
    expect(result.password).toBe('AAAAAAAA');
    expect(result.characterPoolSize).toBe(36);
    expect(instructions('password-generator')).toContain('does not guarantee it appears');
    expect(() => generatePassword({
      length: 7, includeUppercase: true, includeLowercase: false,
      includeNumbers: false, includeSymbols: false, avoidAmbiguous: false,
    }, () => 0)).toThrow(/8 to 128/);
  });

  it('uses the stated temperature and US gallon definitions', () => {
    expect(convertMeasurement('temperature', 20, 'celsius', 'fahrenheit').result).toBe(68);
    expect(instructions('conversion-calculator')).toContain('20 Celsius equals 68 Fahrenheit');
    expect(convertMeasurement('volume', 1, 'gallon', 'liter').result).toBeCloseTo(3.785411784, 8);
    expect(instructions('conversion-calculator')).toContain('US customary cups and gallons');
  });

  it('keeps mechanical horsepower distinct from metric horsepower', () => {
    const result = calculateHorsepowerConversion(100, 'kilowatt');
    expect(result.mechanicalHorsepower).toBeCloseTo(134.1, 1);
    expect(result.metricHorsepower).toBeGreaterThan(result.mechanicalHorsepower);
    expect(instructions('horsepower-calculator')).toContain('134.1 mechanical hp');
  });

  it('applies API overhead to billable units before adding the fixed fee', () => {
    const result = calculateApiPricing(1000, 2, 0.01, 5, 10);
    expect(result.billableUnits).toBe(2200);
    expect(result.usageCost).toBe(22);
    expect(result.totalCost).toBe(27);
    expect(instructions('api-pricing-calculator')).toContain('$5 fixed fee cost $27');
    expect(utilityTrustRepairs['api-pricing-calculator']).toContain('does not fetch prices');
  });

  it('distinguishes decimal bytes, Mbps, and effective download speed', () => {
    const result = calculateDownloadTime(1, 'GB', 100, 80);
    expect(result.effectiveMbps).toBe(80);
    expect(result.seconds).toBe(100);
    expect(instructions('download-time-calculator')).toContain('takes 1m 40s');
    expect(calculateDownloadTime(1, 'GB', 12.5 * 8, 100).seconds).toBe(80);
    expect(instructions('download-time-calculator')).toContain('multiply it by 8');
  });

  it('adds simultaneous activity demand and the entered capacity buffer', () => {
    const result = calculateInternetSpeedNeeds(2, 10, 0, 0, 1, 5, 0, 0, 20);
    expect(result.baseMbps).toBe(25);
    expect(result.recommendedMbps).toBe(30);
    expect(instructions('internet-speed-needs-calculator')).toContain('at the same time');
    expect(utilityTrustRepairs['internet-speed-needs-calculator']).toContain('download-capacity estimate');
  });

  it('scales streaming data by both duration and stream count', () => {
    expect(calculateStreamingBitrate(6, 'Mbps', 2, 0, 1).gigabytes).toBe(5.4);
    expect(calculateStreamingBitrate(6, 'Mbps', 2, 0, 2).gigabytes).toBe(10.8);
    expect(calculateStreamingBitrate(6000, 'Kbps', 2, 0, 1).gigabytes).toBe(5.4);
    expect(instructions('streaming-bitrate-calculator')).toContain('5.4 GB');
    expect(instructions('streaming-bitrate-calculator')).toContain('10.8 GB');
  });

  it('uses physical diagonal inches for the PPI example', () => {
    const result = calculateMonitorPpi(1920, 1080, 24);
    expect(result.ppi).toBeCloseTo(91.8, 1);
    expect(result.aspectLabel).toBe('16:9');
    expect(instructions('monitor-ppi-calculator')).toContain('91.8 PPI');
  });

  it('scales one ingredient while retaining its unit label', () => {
    const result = calculateRecipeScale('Flour', 2, 'cups', 4, 10);
    expect(result.scaleFactor).toBe(2.5);
    expect(result.scaledAmount).toBe(5);
    expect(result.unit).toBe('cups');
    expect(instructions('recipe-scaler')).toContain('5 cups for 10 servings');
    expect(instructions('recipe-scaler')).toContain('Unit field is a label');
  });

  it('uses ingredient density only when crossing volume and weight', () => {
    expect(convertCookingMeasurement(2, 'cup', 'gram', 120).convertedAmount).toBe(240);
    expect(convertCookingMeasurement(2, 'cup', 'gram', 240).convertedAmount).toBe(480);
    expect(convertCookingMeasurement(2, 'cup', 'tablespoon', 120).convertedAmount).toBe(32);
    expect(convertCookingMeasurement(2, 'cup', 'tablespoon', 240).convertedAmount).toBe(32);
    expect(instructions('cooking-measurement-converter')).toContain('equals 240 grams');
    expect(() => convertCookingMeasurement(2, 'cup', 'tablespoon', 0)).toThrow(/density/i);
    expect(instructions('cooking-measurement-converter')).toContain('Keep a positive density value');
  });

  it('prices the ingredient used after converting the package unit', () => {
    const result = calculateIngredientCost(300, 'gram', 1, 'kilogram', 4, 120);
    expect(result.packageAmountInNeededUnit).toBeCloseTo(1000, 8);
    expect(result.recipeCost).toBeCloseTo(1.2, 8);
    expect(instructions('ingredient-cost-calculator')).toContain('costs $1.20');
    expect(instructions('ingredient-cost-calculator')).toContain('rather than the cost of buying whole packages');
  });

  it('compares unit prices after the quantities use a shared unit', () => {
    const result = compareUnitPrices('Small', 4, 100, 'Large', 6, 200, 'grams');
    expect(result.cheaperName).toBe('Large');
    expect(result.itemAUnitPrice).toBe(0.04);
    expect(result.itemBUnitPrice).toBe(0.03);
    expect(instructions('unit-price-calculator')).toContain('This field does not convert units');
  });

  it('includes extra batch costs once in the serving example', () => {
    const result = calculateCostPerServing('Soup', 18.5, 8, 2);
    expect(result.totalBatchCost).toBe(20.5);
    expect(result.costPerServing).toBe(2.5625);
    expect(instructions('cost-per-serving-calculator')).toContain('$2.5625 per serving');
  });

  it('uses the stated US butter stick equivalents', () => {
    const result = convertButter(1, 'stick');
    expect(result.tablespoons).toBe(8);
    expect(result.cups).toBe(0.5);
    expect(result.grams).toBeCloseTo(113.4, 1);
    expect(instructions('butter-converter')).toContain('8 tablespoons, 0.5 cup, or about 113.4 grams');
  });

  it('uses the new-to-old rectangular pan area ratio without inventing servings', () => {
    const result = calculateBakingPanConversion(9, 13, 8, 8);
    expect(result.oldAreaSquareInches).toBe(117);
    expect(result.newAreaSquareInches).toBe(64);
    expect(result.scaleFactor).toBeCloseTo(0.547, 3);
    expect(result.scaledServings).toBeNull();
    expect(instructions('baking-pan-conversion-calculator')).toContain('0.547 times the batter');
    expect(utilityTrustRepairs['baking-pan-conversion-calculator']).toContain('similar batter depth');
  });
});
