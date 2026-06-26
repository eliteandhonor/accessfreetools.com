import type { ToolDefinition } from './tools';

export const mathExpansionTools: ToolDefinition[] = [
  {
    slug: 'prime-factorization-calculator',
    name: 'Prime Factorization Calculator',
    category: 'calculators',
    summary: 'Break a whole number into prime factors and grouped prime powers.',
    description:
      'Use this free prime factorization calculator to rewrite a positive whole number as prime factors, see repeated factors as exponents, and check whether the number is prime.',
    icon: 'calculator-prime',
    seoTitle: 'Prime Factorization Calculator | Free Online Prime Factor Tool',
    seoDescription:
      'Find prime factors, prime powers, factor count, factor pairs, and prime checks for positive whole numbers.',
    useCases: [
      'Rewrite a number as prime factors for homework or study notes.',
      'Check whether a number is prime or composite.',
      'Compare prime factorization with factors, GCF, and LCM work.',
      'Break down numbers before simplifying fractions or ratios.',
    ],
    examples: [
      {
        label: 'Factor a composite number',
        expression: '360',
        result: '2^3 x 3^2 x 5',
      },
      {
        label: 'Check a prime number',
        expression: '9973',
        result: '9973 is prime',
      },
      {
        label: 'Break down a highly composite number',
        expression: '5040',
        result: '2^4 x 3^2 x 5 x 7',
      },
    ],
    faq: [
      {
        question: 'What does prime factorization mean?',
        answer:
          'Prime factorization rewrites a whole number as prime numbers multiplied together. For example, 360 becomes 2^3 x 3^2 x 5.',
      },
      {
        question: 'What is a prime number?',
        answer:
          'A prime number is a whole number greater than 1 with exactly two positive factors: 1 and itself.',
      },
      {
        question: 'Why do repeated prime factors become exponents?',
        answer:
          'Exponents keep repeated factors short. Instead of writing 2 x 2 x 2, the calculator writes 2^3.',
      },
      {
        question: 'How is this different from the Factor Calculator?',
        answer:
          'The Factor Calculator lists every factor and factor pair. This calculator focuses on the prime factors that multiply back to the original number.',
      },
      {
        question: 'What numbers can I enter?',
        answer:
          'Enter one positive safe whole number up to 1,000,000,000,000. Very large factorization can be slow, so this browser calculator keeps a practical limit.',
      },
      {
        question: 'Is my number sent to a server?',
        answer:
          'No. The calculation runs in your browser tab and recent answers stay only in that tab while you use the page.',
      },
    ],
    relatedSlugs: ['factor-calculator', 'greatest-common-factor-calculator', 'least-common-multiple-calculator'],
  },
  {
    slug: 'long-division-calculator',
    name: 'Long Division Calculator',
    category: 'calculators',
    summary: 'Divide whole numbers with quotient, remainder, decimal answer, and steps.',
    description:
      'Use this free long division calculator to divide positive whole numbers, find the quotient and remainder, see the decimal form, and review the division check.',
    icon: 'calculator-long-division',
    seoTitle: 'Long Division Calculator | Quotient and Remainder Calculator',
    seoDescription:
      'Divide whole numbers with quotient, remainder, decimal output, and clear long-division style steps.',
    useCases: [
      'Check a whole-number division problem before writing the answer.',
      'Find quotient and remainder for classroom math.',
      'Convert a division problem into decimal form.',
      'Verify that quotient x divisor plus remainder equals the dividend.',
    ],
    examples: [
      {
        label: 'Divide with a remainder',
        expression: '9876 / 24',
        result: '411 R 12; check 411 x 24 + 12 = 9876',
      },
      {
        label: 'Find a decimal answer',
        expression: '1250 / 8',
        result: '156 R 2, or 156.25 as a decimal',
      },
      {
        label: 'Divide evenly',
        expression: '1001 / 7',
        result: '143 R 0, so 7 divides 1001 evenly',
      },
    ],
    faq: [
      {
        question: 'What does quotient and remainder mean?',
        answer:
          'The quotient is the whole-number answer. The remainder is what is left after the divisor no longer fits evenly.',
      },
      {
        question: 'How do I type a long division problem?',
        answer:
          'Type it as dividend / divisor, such as 9876 / 24. You can also use the quick examples on the calculator.',
      },
      {
        question: 'What do the main Long Division Calculator inputs mean?',
        answer:
          'Enter the dividend first, then the divisor after the slash. In 9876 / 24, 9876 is the number being split and 24 is the number you divide by. Use positive whole numbers for this calculator.',
      },
      {
        question: 'How should I read the Long Division Calculator answer?',
        answer:
          'The quotient is the whole-number part, the remainder is what is left, and the decimal value shows the same division as a decimal. For 9876 / 24, 411 R 12 means 411 x 24 + 12 = 9876.',
      },
      {
        question: 'What should I double-check before trusting the Long Division Calculator?',
        answer:
          'Make sure the divisor is not zero, the dividend and divisor are in the right order, and any remainder is smaller than the divisor. If you need to simplify a fractional remainder, use the Fraction Calculator after you know the division result.',
      },
      {
        question: 'How do I check the answer?',
        answer:
          'Multiply the quotient by the divisor, then add the remainder. The result should equal the original dividend.',
      },
      {
        question: 'Can I divide by zero?',
        answer:
          'No. Division by zero is undefined, so the divisor must be a positive whole number.',
      },
      {
        question: 'Does the calculator show decimals?',
        answer:
          'Yes. It shows the quotient and remainder for whole-number work and also shows the decimal value for comparison.',
      },
      {
        question: 'Is my division history private?',
        answer:
          'Yes. Recent answers stay only in the current browser tab. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['fraction-calculator', 'big-number-calculator', 'percentage-calculator'],
  },
  {
    slug: 'average-calculator',
    name: 'Average Calculator',
    category: 'calculators',
    summary: 'Find the average (arithmetic mean) of a number list, then compare median, mode, range, sum, and count.',
    description:
      'Use this free average calculator to add a number list, divide by count, and check median, mode, range, sorted values, and outlier context.',
    icon: 'calculator-average',
    seoTitle: 'Average Calculator | Mean, Median, Mode, Range',
    seoDescription:
      'Calculate the average of a number list with sum, count, median, mode, range, sorted values, and a 10, 12, 12, 15, 18 example.',
    useCases: [
      'Find the average test score, cost, time, rating, or measurement from one number list.',
      'Check arithmetic mean homework with visible sum, count, and formula steps.',
      'Compare mean with median, mode, and range when one value may be unusually high or low.',
      'Summarize a small data set before copying the answer into notes or a spreadsheet.',
    ],
    examples: [
      {
        label: 'Average of scores',
        expression: '10, 12, 12, 15, 18',
        result: 'Sum 67 / 5 values = average 13.4',
      },
      {
        label: 'Outlier check',
        expression: '8, 9, 10, 11, 42',
        result: 'Average 16, median 10, range 34',
      },
      {
        label: 'Average with repeated values',
        expression: '72, 84, 84, 90, 93',
        result: 'Average 84.6, mode 84',
      },
      {
        label: 'Average of decimals',
        expression: '1.5, 2, 2.5, 4',
        result: 'Average 2.5',
      },
    ],
    faq: [
      {
        question: 'What does average mean in this calculator?',
        answer:
          'Average means arithmetic mean. The calculator adds all values, then divides by how many values you entered: average = sum / count.',
      },
      {
        question: 'What formula does the Average Calculator use?',
        answer:
          'It uses sum divided by count. For 10, 12, 12, 15, and 18, the sum is 67 and the count is 5, so the average is 67 / 5 = 13.4.',
      },
      {
        question: 'Can I enter values on separate lines?',
        answer:
          'Yes. Separate numbers with commas, spaces, semicolons, or new lines. The calculator reads them as one data set.',
      },
      {
        question: 'Can I use decimals or negative numbers?',
        answer:
          'Yes. Decimals and negative numbers work as long as each entry is a valid number. The sum, average, median, mode, and range update from the exact list you enter.',
      },
      {
        question: 'Why does the calculator also show median and range?',
        answer:
          'The average can be pulled higher or lower by extreme values. Median and range help you see whether the average tells the full story.',
      },
      {
        question: 'What if one value is much higher or lower than the rest?',
        answer:
          'That value still counts in the average, so it can pull the mean away from the middle of the group. Compare the average with the median and range before you summarize the data.',
      },
      {
        question: 'What mistake should I avoid with averages?',
        answer:
          'Do not mix unlike values in one list. Keep the same unit and same kind of measurement, then double-check any extreme value before trusting the average as a fair summary.',
      },
      {
        question: 'What happens if a value repeats?',
        answer:
          'Repeated values count each time they appear. If 84 appears twice, it contributes twice to the sum and count.',
      },
      {
        question: 'Is this a weighted average calculator?',
        answer:
          'No. This calculator gives every entered value equal weight. If grades, prices, or rates have different weights, use a weighted average workflow instead of treating every number as equal.',
      },
      {
        question: 'How many values can I enter?',
        answer:
          'You can enter up to 1,000 numbers. That keeps the browser calculation fast and readable.',
      },
      {
        question: 'Is my data private?',
        answer:
          'Yes. The calculation runs in your browser tab and recent answers stay only in that tab while you use the page.',
      },
    ],
    relatedSlugs: ['statistics-calculator', 'mean-median-mode-range-calculator', 'standard-deviation-calculator'],
  },
  {
    slug: 'p-value-calculator',
    name: 'P-value Calculator',
    category: 'calculators',
    summary: 'Estimate left-tailed, right-tailed, or two-tailed p-values from a z-score.',
    description:
      'Use this free p-value calculator to estimate a normal-curve p-value from a z-score, choose left-tailed, right-tailed, or two-tailed mode, and see the tail areas.',
    icon: 'calculator-p-value',
    seoTitle: 'P-value Calculator | Free Z-score P-value Tool',
    seoDescription:
      'Estimate p-values from z-scores with left-tailed, right-tailed, and two-tailed normal-curve options.',
    useCases: [
      'Estimate a p-value from a z-score in a statistics example.',
      'Compare left-tailed, right-tailed, and two-tailed test choices.',
      'See the left and right standard-normal tail areas.',
      'Check introductory hypothesis-testing work before writing an interpretation.',
    ],
    examples: [
      {
        label: 'Two-tailed z test',
        expression: 'z = 1.96',
        result: 'p is about 0.05',
      },
      {
        label: 'Right-tailed example',
        expression: 'z = 1.645',
        result: 'p is about 0.05',
      },
      {
        label: 'Left-tailed example',
        expression: 'z = -1.28',
        result: 'p is about 0.10',
      },
    ],
    faq: [
      {
        question: 'What does this P-value Calculator use?',
        answer:
          'It estimates p-values from a z-score using the standard normal curve. It is for z-test style examples, not every statistical test.',
      },
      {
        question: 'Which tail should I choose?',
        answer:
          'Choose right-tailed when unusually high values matter, left-tailed when unusually low values matter, and two-tailed when differences in either direction matter.',
      },
      {
        question: 'What does a smaller p-value mean?',
        answer:
          'A smaller p-value means the observed z-score is farther into the tail of the comparison curve. It does not prove a claim by itself.',
      },
      {
        question: 'Is this the same as a t-test p-value?',
        answer:
          'No. A t-test uses a t distribution and degrees of freedom. This calculator uses the standard normal distribution from a z-score.',
      },
      {
        question: 'Why is the two-tailed value doubled?',
        answer:
          'A two-tailed test counts extreme results in both directions, so it doubles the smaller tail area while keeping the result no higher than 1.',
      },
      {
        question: 'Is my z-score history private?',
        answer:
          'Yes. Recent answers stay only in your current browser tab and are not sent to a server.',
      },
    ],
    relatedSlugs: ['z-score-calculator', 'probability-calculator', 'confidence-interval-calculator'],
  },
];
