import { describe, expect, it } from 'vitest';

import { calculateSalesTax } from '../lib/calculator';
import { financeTools } from './financeTools';
import { getTool } from './tools';

function exactFaq(slug: string, question: string) {
  const matches = getTool(slug)!.faq.filter((item) => item.question === question);
  expect(matches).toHaveLength(1);
  return matches[0].answer;
}

describe('Matrix FAQ selection', () => {
  it('uses the matrix grid and operation controls instead of generic calculator inputs', () => {
    const answer = exactFaq('matrix-calculator', 'What do the main Matrix Calculator inputs mean?');
    for (const label of ['2x2', '3x3', 'Matrix A', 'Matrix B', 'Add', 'Subtract', 'Multiply', 'Determinant', 'Transpose']) {
      expect(answer).toContain(label);
    }
    expect(answer).toMatch(/Determinant and Transpose only use Matrix A/);
    expect(answer).not.toMatch(/percent|angle|trig|DEG|RAD|typed expression/i);
  });

  it('explains matrix results, determinant results, and the visible supporting labels', () => {
    const answer = exactFaq('matrix-calculator', 'How should I read the Matrix Calculator answer?');
    for (const label of ['Operation', 'Size', 'Uses Matrix B', 'Steps']) {
      expect(answer).toContain(label);
    }
    expect(answer).toMatch(/Determinant.*single number/);
    expect(answer).toMatch(/rows and columns/);
    expect(answer).not.toMatch(/angle|trig|DEG|RAD|percent/i);
  });

  it('checks positions and multiplication order while retaining specific operation and privacy FAQs', () => {
    const answer = exactFaq('matrix-calculator', 'What should I double-check before trusting the Matrix Calculator?');
    expect(answer).toMatch(/row and column/);
    expect(answer).toMatch(/Matrix A.*Matrix B/);
    expect(answer).toContain('Calculate matrix');
    expect(answer).not.toMatch(/angle|trig|DEG|RAD|percent/i);
    expect(getTool('matrix-calculator')!.faq.find((item) => item.question === 'Does order matter for matrix multiplication?')!.answer)
      .toContain('A x B can be different from B x A');
    expect(getTool('matrix-calculator')!.faq.find((item) => item.question === 'Is my matrix history private?')!.answer)
      .toContain('current browser tab');
  });
});

describe('Sales Tax FAQ selection', () => {
  it('uses the actual tax result labels rather than loan-result help', () => {
    const answer = exactFaq('sales-tax-calculator', 'How should I read the Sales Tax Calculator answer?');
    for (const label of ['Total after sales tax', 'Tax amount', 'Subtotal', 'Rate used']) {
      expect(answer).toContain(label);
    }
    expect(answer).not.toMatch(/principal|payment timing|interest|totals paid over time/i);
    expect(answer).toMatch(/subtotal plus.*tax/i);
    const rawFaq = financeTools.find((tool) => tool.slug === 'sales-tax-calculator')!.faq;
    expect(rawFaq.find((item) => item.question === 'How should I read the Sales Tax Calculator answer?')!.answer).toBe(answer);
  });

  it('checks the taxable subtotal and manual percent rather than loan periods or payment frequency', () => {
    const tool = getTool('sales-tax-calculator')!;
    const answers = tool.faq.filter((item) => [
      'What is the Sales Tax Calculator doing with my numbers?',
      'What does this estimate leave out?',
      'What should I double-check before copying the result?',
    ].includes(item.question)).map((item) => item.answer).join(' ');
    expect(answers).toContain('7.5');
    expect(answers).toContain('0.075');
    expect(answers).toMatch(/taxable subtotal/);
    expect(answers).toMatch(/round/);
    expect(answers).not.toMatch(/monthly|annual amount|compounding|payment frequency|credit details|provider-specific terms/i);
  });

  it('retains the purchase example, manual-rate limits, and absence of a reverse mode', () => {
    const tool = getTool('sales-tax-calculator')!;
    const result = calculateSalesTax(80, 7.5);
    expect(result.taxAmount).toBe(6);
    expect(result.total).toBe(86);
    expect(tool.examples[0].result).toBe('$6 tax, $86 total');
    expect(tool.faq.find((item) => item.question === 'Does this calculator look up my local sales tax rate?')!.answer)
      .toContain('uses the rate you enter');
    expect(tool.faq.find((item) => item.question === 'Can this remove tax from a total?')!.answer)
      .toContain('Not as a separate reverse mode yet');
    expect(tool.faq.find((item) => item.question === 'Why is my receipt off by one or two cents?')!.answer)
      .toContain('round');
  });
});
