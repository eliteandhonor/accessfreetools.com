import type { ToolDefinition } from './tools';

export const mathExpansionTools: ToolDefinition[] = [
  {
    slug: 'prime-factorization-calculator',
    name: 'Prime Factorization Calculator',
    category: 'calculators',
    summary: 'Break a whole number into prime factors, prime powers, and factor checks.',
    description:
      'Use this free prime factorization calculator to rewrite a positive whole number as prime factors, group repeated factors as exponents, count factors, list factor pairs, and check whether the number is prime or composite.',
    icon: 'calculator-prime',
    seoTitle: 'Prime Factorization Calculator | Free Online Prime Factor Tool',
    seoDescription:
      'Find prime factors, prime powers, factor count, factor pairs, and prime or composite checks for positive whole numbers.',
    useCases: [
      'Rewrite a number as prime factors for homework, notes, or answer checks.',
      'Check whether a positive whole number is prime or composite before moving on.',
      'Use prime powers before finding GCF, LCM, simplifying fractions, or comparing ratios.',
      'Compare prime factorization with the full factor count and factor pairs.',
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
      {
        label: 'See repeated factors as powers',
        expression: '1024',
        result: '2^10',
      },
      {
        label: 'Factor a smaller classroom number',
        expression: '84',
        result: '2^2 x 3 x 7',
      },
      {
        label: 'Check a number with a larger prime factor',
        expression: '999',
        result: '3^3 x 37',
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
        question: 'What does the calculator show for 1?',
        answer:
          'The number 1 has no prime factorization because it is not prime and not composite. The calculator will say that directly instead of forcing a fake prime factor.',
      },
      {
        question: 'How do I check the prime factorization?',
        answer:
          'Multiply the prime powers back together. For 360, 2^3 x 3^2 x 5 means 8 x 9 x 5, which equals 360.',
      },
      {
        question: 'Why are factor count and factor pairs shown?',
        answer:
          'They help you cross-check the result. Prime factorization explains the building blocks, while factor count and factor pairs show how many whole-number divisors the number has.',
      },
      {
        question: 'Can I enter decimals or negative numbers?',
        answer:
          'No. This tool is for positive whole numbers. Decimals, fractions, negative values, zero, and Infinity are rejected so the result stays clear.',
      },
      {
        question: 'How does prime factorization help with GCF and LCM?',
        answer:
          'For GCF, compare the shared prime powers. For LCM, combine the highest needed prime powers. This is why prime factors are useful before GCF and LCM work.',
      },
      {
        question: 'What numbers can I enter?',
        answer:
          'Enter one positive safe whole number up to 1,000,000,000,000. Very large factorization can be slow, so this browser calculator keeps a practical limit.',
      },
      {
        question: 'What should I double-check before copying the answer?',
        answer:
          'Check that the input was a whole number, the prime factors multiply back to the original number, and any exponent form matches the repeated factors.',
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
    summary: 'Estimate left-tailed, right-tailed, or two-tailed standard-normal p-values from a z-score.',
    description:
      'Use this free p-value calculator to estimate a standard-normal p-value from a z-score, choose left-tailed, right-tailed, or two-tailed mode, and see both tail areas.',
    icon: 'calculator-p-value',
    seoTitle: 'P-value Calculator | Free Z-score P-value Tool',
    seoDescription:
      'Calculate p-values from z-scores with left-tailed, right-tailed, and two-tailed standard-normal options.',
    useCases: [
      'Estimate a p-value from a z-score in an introductory statistics example.',
      'Compare left-tailed, right-tailed, and two-tailed z-test choices.',
      'See the left and right standard-normal tail areas before writing an interpretation.',
      'Check a result against a significance level such as 0.05 without claiming proof by itself.',
    ],
    examples: [
      {
        label: 'Two-tailed z test',
        expression: 'z = 1.96',
        result: 'p is about 0.0500',
      },
      {
        label: 'Right-tailed example',
        expression: 'z = 1.645',
        result: 'right-tail p is about 0.0500',
      },
      {
        label: 'Left-tailed example',
        expression: 'z = -1.28',
        result: 'left-tail p is about 0.1003',
      },
      {
        label: 'Stronger right-tail result',
        expression: 'z = 2.33',
        result: 'right-tail p is about 0.0099',
      },
      {
        label: 'No distance from the mean',
        expression: 'z = 0, two-tailed',
        result: 'p is 1.0000',
      },
      {
        label: 'Strong left-tail result',
        expression: 'z = -2.58',
        result: 'left-tail p is about 0.0049',
      },
    ],
    faq: [
      {
        question: 'What does this P-value Calculator use?',
        answer:
          'It estimates p-values from a z-score using the standard normal curve, where the mean is 0 and the standard deviation is 1. It is for z-test style examples, not every statistical test.',
      },
      {
        question: 'Which tail should I choose?',
        answer:
          'Choose right-tailed when unusually high values support the alternative, left-tailed when unusually low values support it, and two-tailed when unusually high or low values both count as extreme.',
      },
      {
        question: 'What do the main P-value Calculator inputs mean?',
        answer:
          'Tail type tells the calculator which part of the normal curve counts as extreme. Z-score tells it how many standard deviations your observed result is from the mean.',
      },
      {
        question: 'How should I read the P-value Calculator answer?',
        answer:
          'Read the p-value as a tail-area estimate for the chosen z-score and tail type. Also check the left-tail and right-tail areas so you can see which side of the curve the result came from.',
      },
      {
        question: 'What does a smaller p-value mean?',
        answer:
          'A smaller p-value means the observed z-score is farther into the selected tail of the comparison curve. It is evidence to interpret with your study design, assumptions, and chosen significance level, not proof by itself.',
      },
      {
        question: 'Why is the two-tailed value doubled?',
        answer:
          'A two-tailed test counts extreme results in both directions, so the calculator doubles the smaller tail area and caps the result at 1.',
      },
      {
        question: 'Is this the same as a t-test p-value?',
        answer:
          'No. A t-test p-value uses a t distribution and degrees of freedom. This calculator uses the standard normal distribution from a z-score.',
      },
      {
        question: 'What should I double-check before trusting the p-value?',
        answer:
          'Check the z-score sign, the selected tail, and whether your assignment or analysis actually calls for a normal z-test. Use a different calculator or statistics software for t, chi-square, F, exact, or regression p-values.',
      },
      {
        question: 'Does a p-value prove the null hypothesis is false?',
        answer:
          'No. A p-value describes how unusual the observed z-score would be under the comparison model. It does not measure practical importance, study quality, or the chance that a claim is true.',
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
