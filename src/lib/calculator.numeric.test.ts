import { describe, expect, it } from 'vitest';
import {
  calculateAge, calculateAprEstimate, calculateCanadianMortgage, calculateDateDifference, calculateDateShift,
  calculateInterestRateFromPayment, calculateLoanPrincipalFromPayment, calculateLoanSummary, calculateMortgagePayment,
} from './calculator';

// Independent present-value sum of unit payments, not the closed-form annuity formula.
function referencePayment(principal: number, periodicRate: number, paymentCount: number) {
  let discount = 1;
  let presentValue = 0;
  for (let period = 0; period < paymentCount; period += 1) {
    discount /= 1 + periodicRate;
    presentValue += discount;
  }
  return principal / presentValue;
}

function expectPaymentClose(actual: number, expected: number) {
  // Absolute floor for near-zero rates; relative tolerance for large finite payments.
  expect(Number.isFinite(actual)).toBe(true);
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(Math.max(1e-9, Math.abs(expected) * 1e-11));
}

describe('COR-03 clamped calendar intervals', () => {
  it.each([
    ['2026-01-29', '2026-02-28', 0, 1, 0],
    ['2026-01-30', '2026-02-28', 0, 1, 0],
    ['2026-01-31', '2026-02-28', 0, 1, 0],
    ['2026-01-29', '2026-03-01', 0, 1, 1],
    ['2026-01-30', '2026-03-01', 0, 1, 1],
    ['2026-01-31', '2026-03-01', 0, 1, 1],
    ['2024-01-29', '2024-02-28', 0, 0, 30],
    ['2024-01-30', '2024-02-29', 0, 1, 0],
    ['2024-01-31', '2024-02-29', 0, 1, 0],
    ['2024-01-29', '2024-03-01', 0, 1, 1],
    ['2024-01-30', '2024-03-01', 0, 1, 1],
    ['2024-01-31', '2024-03-01', 0, 1, 1],
    ['2024-02-29', '2025-02-28', 1, 0, 0],
    ['2024-02-29', '2025-03-28', 1, 0, 28],
    ['2024-02-29', '2025-03-29', 1, 1, 0],
    ['2024-02-29', '2028-02-29', 4, 0, 0],
    ['2026-12-31', '2027-02-01', 0, 1, 1],
    ['2026-01-31', '2026-01-31', 0, 0, 0],
  ] as const)('%s to %s uses a single clamped month offset', (earlier, later, years, months, days) => {
    const totalDays = (Date.parse(later) - Date.parse(earlier)) / 86_400_000;
    const age = calculateAge(earlier, later);
    expect(age).toMatchObject({ years, months, days, totalDays, totalMonths: years * 12 + months });
    expect(calculateDateShift(earlier, age.years, age.months, 0, age.days, 'add').resultDate).toBe(later);

    for (const [start, end] of [[earlier, later], [later, earlier]]) {
      const result = calculateDateDifference(start, end);
      expect(result).toMatchObject({
        calendarYears: years, calendarMonths: months, calendarDays: days, days: totalDays,
        direction: start === end ? 'same-day' : start < end ? 'forward' : 'backward',
      });
      expect(calculateDateShift(earlier, result.calendarYears, result.calendarMonths, 0, result.calendarDays, 'add').resultDate).toBe(later);
    }
  });

  it('reconstructs intervals across a full leap and non-leap calendar', () => {
    for (const year of [2024, 2026]) {
      for (let month = 0; month < 12; month += 1) {
        for (const day of [1, 28, 29, 30, 31]) {
          const start = new Date(Date.UTC(year, month, day));
          if (start.getUTCMonth() !== month) continue;
          const earlier = start.toISOString().slice(0, 10);
          for (const elapsed of [0, 1, 27, 28, 29, 30, 31, 59, 60, 365, 366, 400]) {
            const later = new Date(start.getTime() + elapsed * 86_400_000).toISOString().slice(0, 10);
            const age = calculateAge(earlier, later);
            expect(age.years).toBeGreaterThanOrEqual(0);
            expect(age.months).toBeGreaterThanOrEqual(0);
            expect(age.months).toBeLessThan(12);
            expect(age.days).toBeGreaterThanOrEqual(0);
            expect(age.totalDays).toBe(elapsed);
            expect(calculateDateShift(earlier, age.years, age.months, 0, age.days, 'add').resultDate).toBe(later);
            expect(calculateDateDifference(later, earlier)).toMatchObject({
              calendarYears: age.years, calendarMonths: age.months, calendarDays: age.days, days: elapsed,
            });
          }
        }
      }
    }
  });

  it('keeps the clamped leap birthday and rejects an age before birth', () => {
    expect(calculateAge('2024-02-29', '2025-02-27')).toMatchObject({ nextBirthday: '2025-02-28', daysUntilNextBirthday: 1 });
    expect(calculateAge('2024-02-29', '2025-02-28')).toMatchObject({ years: 1, months: 0, days: 0, nextBirthday: '2026-02-28' });
    expect(() => calculateAge('2026-03-01', '2026-01-31')).toThrow('Birth date must be on or before the as of date');
  });
});

describe('COR-05 stable loan annuity', () => {
  const rates = [0, 1e-16, 1e-14, 1e-12, 1e-10, 1e-8, 1e-6, 0.01, 6.5, 100, 1200, 100000];
  it.each(rates.flatMap((rate) => [1 / 12, 30, 100].map((years) => ({ rate, years }))))(
    'matches discounted payments at $rate percent for $years years', ({ rate, years }) => {
      const principal = 100000;
      const loan = calculateLoanSummary(principal, rate, years);
      const reference = referencePayment(principal, rate / 1200, Math.round(years * 12));
      expectPaymentClose(loan.monthlyPayment, reference);
      expect(loan.totalPaid).toBeGreaterThanOrEqual(principal - 1e-7);
      expect(loan.totalInterest).toBeGreaterThanOrEqual(-1e-7);
      if (rate <= 1e-8) expectPaymentClose(loan.monthlyPayment, principal / loan.paymentCount * (1 + rate / 1200 * (loan.paymentCount + 1) / 2));
      const mortgage = calculateMortgagePayment({ homePrice: 125000, downPayment: 25000, annualRatePercent: rate, years });
      expectPaymentClose(mortgage.totalMonthlyPayment, reference);
    },
  );

  it.each([0, 1e-12, 1e-8, 6.5, 1200, 100000])('recovers principal from a reference payment at %s percent', (rate) => {
    const payment = referencePayment(100000, rate / 1200, 360);
    const loan = calculateLoanPrincipalFromPayment(payment, rate, 30);
    expect(Math.abs(loan.principal - 100000)).toBeLessThan(1e-6);
    expect(loan.totalInterest).toBeGreaterThanOrEqual(-1e-7);
  });

  it.each([0, 1e-12, 1e-8, 6.5, 1200])('keeps inverse-rate and APR callers stable at %s percent', (rate) => {
    const payment = referencePayment(100000, rate / 1200, 1200);
    const inverse = calculateInterestRateFromPayment(100000, payment, 100);
    expect(Math.abs(inverse.annualRatePercent - rate)).toBeLessThan(1e-8);
    for (const fees of [0, 1000]) {
      const apr = calculateAprEstimate({ principal: 100000, annualRatePercent: rate, years: 100, fees });
      expectPaymentClose(apr.loan.monthlyPayment, payment);
      expectPaymentClose(referencePayment(apr.amountReceived, apr.aprPercent / 1200, 1200), payment);
      expect(apr.aprPercent).toBeGreaterThanOrEqual(rate - 1e-8);
      if (fees === 0) expect(Math.abs(apr.aprPercent - rate)).toBeLessThan(1e-8);
    }
  });

  it.each([1e-12, 0.01, 100000, 1e12].flatMap((principal) =>
    [1, 2, 3, 7, 12].flatMap((payments) =>
      [0, 1e-16, 1e-14, 1e-12].map((rate) => ({ principal, payments, rate }))),
  ))('R1 composes actual tiny-rate payments for $principal over $payments payments at $rate percent', ({ principal, payments, rate }) => {
    const years = payments / 12;
    const loan = calculateLoanSummary(principal, rate, years);
    expect(loan.monthlyPayment).toBeGreaterThanOrEqual(principal / payments);
    const inverse = calculateInterestRateFromPayment(principal, loan.monthlyPayment, years);
    const apr = calculateAprEstimate({ principal, annualRatePercent: rate, years, fees: 0 });
    for (const solvedRate of [inverse.annualRatePercent, apr.aprPercent]) {
      expect(Number.isFinite(solvedRate)).toBe(true);
      expect(solvedRate).toBeGreaterThanOrEqual(0);
      expect(Math.abs(solvedRate - rate)).toBeLessThan(1e-8);
      const expectedPayment = referencePayment(principal, solvedRate / 1200, payments);
      expect(Math.abs(expectedPayment - loan.monthlyPayment) / loan.monthlyPayment).toBeLessThan(1e-12);
    }
  });

  it.each([1e-12, 0.01, 100000, 1e12].flatMap((principal) =>
    [1, 3, 12].map((payments) => ({ principal, payments })),
  ))('R1 still rejects insufficient payments for $principal over $payments payments', ({ principal, payments }) => {
    for (const shortfall of [1e-8, 0.01, 0.5]) {
      const payment = principal / payments * (1 - shortfall);
      expect(() => calculateInterestRateFromPayment(principal, payment, payments / 12)).toThrow(/too low to repay/i);
    }
  });

  it.each([19199, 19200].flatMap((rate) => [1 / 12, 30, 100].map((years) => ({ rate, years }))))(
    'J2 reconstructs inverse-rate and zero-fee APR payments at $rate percent for $years years', ({ rate, years }) => {
      const paymentCount = Math.round(years * 12);
      const payment = referencePayment(100000, rate / 1200, paymentCount);
      const inverse = calculateInterestRateFromPayment(100000, payment, years);
      expect(Math.abs(inverse.annualRatePercent - rate)).toBeLessThan(1e-8);
      expectPaymentClose(referencePayment(100000, inverse.annualRatePercent / 1200, paymentCount), payment);
      const apr = calculateAprEstimate({ principal: 100000, annualRatePercent: rate, years, fees: 0 });
      expect(Math.abs(apr.aprPercent - rate)).toBeLessThan(1e-8);
      expectPaymentClose(referencePayment(apr.amountReceived, apr.aprPercent / 1200, paymentCount), payment);
    },
  );

  it.each([19200.01, 20000, 100000].flatMap((rate) => [1 / 12, 30, 100].map((years) => ({ rate, years }))))(
    'J2 rejects unbracketed inverse-rate payments at $rate percent for $years years', ({ rate, years }) => {
      const paymentCount = Math.round(years * 12);
      const payment = referencePayment(100000, rate / 1200, paymentCount);
      const ceilingPayment = referencePayment(100000, 16, paymentCount);
      expect((payment - ceilingPayment) / payment).toBeGreaterThan(1e-11);
      expect(() => calculateInterestRateFromPayment(100000, payment, years)).toThrow(/supported rate range.*19200%/i);
    },
  );

  it.each([19200.01, 20000, 100000].flatMap((rate) => [0, 1000].map((fees) => ({ rate, fees }))))(
    'J2 rejects unbracketed APR at $rate percent with $fees fees', ({ rate, fees }) => {
      const payment = referencePayment(100000, rate / 1200, 360);
      expectPaymentClose(calculateLoanSummary(100000, rate, 30).monthlyPayment, payment);
      expect(payment).toBeGreaterThan(referencePayment(100000 - fees, 16, 360));
      expect(() => calculateAprEstimate({ principal: 100000, annualRatePercent: rate, years: 30, fees })).toThrow(/supported rate range.*19200%/i);
    },
  );

  it.each([0, 1, 500])('J2 reconstructs a fee-adjusted APR below the ceiling with %s fees', (fees) => {
    const payment = referencePayment(100000, 19000 / 1200, 360);
    const apr = calculateAprEstimate({ principal: 100000, annualRatePercent: 19000, years: 30, fees });
    expect(apr.aprPercent).toBeLessThanOrEqual(19200);
    expectPaymentClose(referencePayment(100000 - fees, apr.aprPercent / 1200, 360), payment);
  });

  it.each([1100, 50000, 99999])('J2 rejects fees of %s that push an otherwise supported rate above the ceiling', (fees) => {
    const payment = referencePayment(100000, 19000 / 1200, 360);
    expect(payment).toBeGreaterThan(referencePayment(100000 - fees, 16, 360));
    expect(() => calculateAprEstimate({ principal: 100000, annualRatePercent: 19000, years: 30, fees })).toThrow(/supported rate range.*19200%/i);
  });

  it.each([1e-12, 1e12])('J2 checks the rate bracket before applying a payment tolerance for principal %s', (principal) => {
    const supportedPayment = referencePayment(principal, 19199 / 1200, 360);
    const inverse = calculateInterestRateFromPayment(principal, supportedPayment, 30);
    expect(Math.abs(inverse.annualRatePercent - 19199)).toBeLessThan(1e-8);
    expectPaymentClose(referencePayment(principal, inverse.annualRatePercent / 1200, 360), supportedPayment);
    const unsupportedPayment = referencePayment(principal, 20000 / 1200, 360);
    expect(() => calculateInterestRateFromPayment(principal, unsupportedPayment, 30)).toThrow(/supported rate range.*19200%/i);
    expect(() => calculateAprEstimate({ principal, annualRatePercent: 20000, years: 30 })).toThrow(/supported rate range.*19200%/i);
  });

  it('J2 reports an explicit numeric-range error for a non-finite bracket endpoint', () => {
    expect(() => calculateInterestRateFromPayment(1e308, 1.1e308, 1 / 12)).toThrow(/supported numeric range/i);
    expect(() => calculateAprEstimate({ principal: 1e308, annualRatePercent: 120, years: 1 / 12 })).toThrow(/supported numeric range/i);
  });

  it.each([0, 1e-12, 1e-8, 6.5, 100000].flatMap((rate) => [12, 24, 26, 52].map((frequency) => ({ rate, frequency }))))(
    'keeps Canadian payments stable at $rate percent and $frequency payments/year', ({ rate, frequency }) => {
      const mortgage = calculateCanadianMortgage({ propertyPrice: 125000, downPayment: 25000, annualRatePercent: rate, years: 30, paymentsPerYear: frequency });
      const periodicRate = (1 + rate / 200) ** (2 / frequency) - 1;
      expectPaymentClose(mortgage.monthlyPayment, referencePayment(100000, periodicRate, 30 * frequency));
      expect(mortgage.paymentCount).toBe(30 * frequency);
      expect(mortgage.totalInterest).toBeGreaterThanOrEqual(-1e-7);
    },
  );
});
