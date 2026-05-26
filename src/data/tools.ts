import { categories, type CategorySlug } from './categories';
import { aiTools } from './aiTools';
import { financeTools } from './financeTools';
import { healthTools } from './healthTools';
import { mathExpansionTools } from './mathExpansionTools';
import { utilityTools } from './utilityTools';

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolExample {
  label: string;
  expression: string;
  result: string;
}

export interface ToolDefinition {
  slug: string;
  name: string;
  category: CategorySlug;
  summary: string;
  description: string;
  icon: string;
  aliases?: string[];
  seoTitle: string;
  seoDescription: string;
  useCases: string[];
  examples: ToolExample[];
  faq: ToolFaq[];
  relatedSlugs: string[];
}

const baseTools: ToolDefinition[] = [
  {
    slug: 'basic-calculator',
    name: 'Basic Calculator',
    category: 'calculators',
    summary: 'A large free online calculator for quick everyday math.',
    description:
      'Use this free basic calculator online for addition, subtraction, multiplication, division, percentages, decimals, keyboard input, and quick result copying with a large easy-to-read keypad.',
    icon: 'calculator-plus',
    aliases: [
      'Free Online Calculator',
      'Basic Calculator Online Free',
      'Large Online Calculator',
      'Full Screen Calculator',
    ],
    seoTitle: 'Basic Calculator | Free Online Calculator',
    seoDescription:
      'Use the free basic calculator online for everyday math, percentages, decimals, keyboard input, a large keypad, and quick result copying.',
    useCases: [
      'Check a total while shopping or planning a budget.',
      'Work through simple homework or study calculations.',
      'Calculate percentages, discounts, and quick comparisons.',
      'Use a large browser calculator without installing an app.',
      'Keep a short calculation history while comparing numbers.',
    ],
    examples: [
      {
        label: 'Add two amounts',
        expression: '48.50 + 12.25',
        result: '60.75',
      },
      {
        label: 'Find a simple discount',
        expression: '80 - 20%',
        result: '64',
      },
      {
        label: 'Split a total',
        expression: '126 / 3',
        result: '42',
      },
    ],
    faq: [
      {
        question: 'What can I use the Basic Calculator for?',
        answer:
          'Use it for everyday arithmetic: adding totals, subtracting costs, multiplying quantities, dividing amounts, checking percentages, and copying quick answers.',
      },
      {
        question: 'How does the percent button work?',
        answer:
          'For simple entries, percent turns the current number into a decimal percentage. During plus or minus calculations, it uses the first number as the base, so 80 - 20% becomes 64.',
      },
      {
        question: 'Can I use keyboard shortcuts?',
        answer:
          'Yes. Use the number keys, +, -, *, /, x, Enter or =, decimal point, percent, Backspace, Escape, and Delete.',
      },
      {
        question: 'Can I use this as a large online calculator?',
        answer:
          'Yes. The calculator is designed to be easy to read in the browser, with a large display, clear buttons, keyboard input, and no app install. Use your browser zoom or full-screen mode if you want the calculator to fill more of the screen.',
      },
      {
        question: 'Is my calculation history private?',
        answer:
          'Yes. The history is only kept in the current browser tab while you use the page. It is not sent to a server.',
      },
      {
        question: 'When should I use the Scientific Calculator instead?',
        answer:
          'Use the Scientific Calculator for trigonometry, logarithms, roots, powers, and DEG/RAD angle work. Use this Basic Calculator for fast everyday math.',
      },
    ],
    relatedSlugs: ['percentage-calculator', 'fraction-calculator', 'scientific-calculator'],
  },
  {
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    category: 'calculators',
    summary: 'Find percentages, percent change, discounts, markups, and reverse percentages.',
    description:
      'Use this free percentage calculator for percent-of calculations, percentage change, percentage increase or decrease, discounts, markups, and reverse percentage questions.',
    icon: 'calculator-percent',
    seoTitle: 'Percentage Calculator | Free Online Percent Calculator',
    seoDescription:
      'Find percent of a number, percentage change, discounts, markups, reverse percentages, and what-percent answers.',
    useCases: [
      'Find a discount, tip, tax amount, sale price, or markup.',
      'Calculate what percent one number is of another number.',
      'Check percentage increase or decrease between two values.',
      'Work backward from a known value and percentage to find the original whole.',
    ],
    examples: [
      {
        label: 'Find percent of a number',
        expression: '20% of 80',
        result: '16',
      },
      {
        label: 'Find what percent',
        expression: '25 is what % of 200',
        result: '12.5%',
      },
      {
        label: 'Find percentage change',
        expression: '160 to 116',
        result: '27.5% decrease',
      },
    ],
    faq: [
      {
        question: 'What can I use the Percentage Calculator for?',
        answer:
          'Use it for common percentage questions: percent of a number, what percent one value is of another, percentage increase or decrease, adding or subtracting a percent, and reverse percentage problems.',
      },
      {
        question: 'What do the main Percentage Calculator inputs mean?',
        answer:
          'Pick the mode first: percent of, what percent, percent change, add/subtract percent, or reverse percent. Then enter the part, whole, original value, new value, or percent rate that matches that mode. A discount, tip, tax, markup, and reverse-percent question all use different boxes, so do not swap the part and the whole.',
      },
      {
        question: 'How do I find a percentage of a number?',
        answer:
          'Choose Percent of a number, enter the percentage and the value, then calculate. For example, 20% of 80 is 16 because 80 x 0.20 = 16.',
      },
      {
        question: 'How is percentage change calculated?',
        answer:
          'Percentage change compares the difference between the new value and original value with the original value. The calculator shows whether the result is an increase or decrease.',
      },
      {
        question: 'Can this calculator handle discounts and markups?',
        answer:
          'Yes. Use Add or subtract percent. Choose Increase for markup, growth, tax, or tip calculations, and Decrease for discounts or reductions.',
      },
      {
        question: 'What is a reverse percentage?',
        answer:
          'A reverse percentage works backward from a known value and percentage. For example, if 30 is 15% of a number, the original whole is 200.',
      },
      {
        question: 'Is my percentage history private?',
        answer:
          'Yes. Recent percentage answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['ratio-calculator', 'percent-error-calculator', 'fraction-calculator'],
  },
  {
    slug: 'ratio-calculator',
    name: 'Ratio Calculator',
    category: 'calculators',
    summary: 'Simplify ratios, find equivalent ratios, and split totals by ratio parts.',
    description:
      'Use this free ratio calculator to simplify two-part or three-part ratios, find equivalent ratios, split totals by a ratio, and see clear step-by-step work.',
    icon: 'calculator-ratio',
    seoTitle: 'Ratio Calculator | Free Online Ratio Solver',
    seoDescription:
      'Use the free Access Free Tools ratio calculator to simplify ratios, find equivalent ratios, split totals by ratio parts, and see step-by-step work.',
    useCases: [
      'Simplify ratios such as 12:18 into lowest terms.',
      'Find an equivalent ratio when one side changes.',
      'Split a total amount into shares using ratio parts.',
      'Compare recipes, mixtures, maps, classroom examples, and proportional relationships.',
    ],
    examples: [
      {
        label: 'Simplify a ratio',
        expression: '12:18',
        result: '2:3',
      },
      {
        label: 'Find an equivalent ratio',
        expression: '4:7 = 20:?',
        result: '20:35',
      },
      {
        label: 'Split a total',
        expression: '100 split by 2:3',
        result: '40, 60',
      },
    ],
    faq: [
      {
        question: 'What can I use the Ratio Calculator for?',
        answer:
          'Use it to simplify ratios, scale a ratio into an equivalent ratio, or split a total amount into parts based on a ratio.',
      },
      {
        question: 'How do I simplify a ratio?',
        answer:
          'Enter two or three ratio parts, choose Simplify, and calculate. The calculator clears decimals if needed, then divides each part by the greatest common divisor.',
      },
      {
        question: 'How do equivalent ratios work?',
        answer:
          'Equivalent ratios keep the same relationship between parts. If 4:7 is scaled so the first part becomes 20, the scale factor is 5 and the second part becomes 35.',
      },
      {
        question: 'How do I split a total by a ratio?',
        answer:
          'Choose Split total, enter the ratio parts and the total. The calculator adds the ratio parts, finds the value of one part, then multiplies each part by that value.',
      },
      {
        question: 'Can ratios include decimals?',
        answer:
          'Yes. Decimal ratio parts are accepted in Simplify and Split total modes. The calculator converts them to whole-number parts before simplifying.',
      },
      {
        question: 'Is my ratio history private?',
        answer:
          'Yes. Recent ratio answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['percentage-calculator', 'fraction-calculator', 'basic-calculator'],
  },
  {
    slug: 'percent-error-calculator',
    name: 'Percent Error Calculator',
    category: 'calculators',
    summary: 'Compare measured and accepted values with percent error, signed error, and steps.',
    description:
      'Use this free percent error calculator to compare an experimental or measured value with an accepted value and see percent error, signed percent error, absolute error, relative error, and step-by-step work.',
    icon: 'calculator-error',
    seoTitle: 'Percent Error Calculator | Free Online Percentage Error Tool',
    seoDescription:
      'Compare measured and accepted values, then find absolute percent error, signed percent error, absolute error, and steps.',
    useCases: [
      'Check lab results against an accepted, true, or theoretical value.',
      'See whether a measured value is higher or lower than the accepted value.',
      'Show percent error steps for chemistry, physics, math, and science homework.',
      'Copy the answer with absolute error and signed percent error for notes or reports.',
    ],
    examples: [
      {
        label: 'Density lab',
        expression: 'Measured 2.45 vs accepted 2.70',
        result: '9.25925925926% error',
      },
      {
        label: 'Length measurement',
        expression: 'Measured 48 vs accepted 50',
        result: '4% error',
      },
      {
        label: 'High reading',
        expression: 'Measured 105 vs accepted 100',
        result: '5% error, signed +5%',
      },
    ],
    faq: [
      {
        question: 'What formula does the Percent Error Calculator use?',
        answer:
          'It uses absolute percent error: absolute value of measured minus accepted, divided by the absolute value of the accepted value, multiplied by 100.',
      },
      {
        question: 'What is the accepted value?',
        answer:
          'The accepted value is the true, theoretical, reference, or expected value you are comparing against. In many science classes, this is the value from a table, textbook, or teacher-provided reference.',
      },
      {
        question: 'What is the measured value?',
        answer:
          'The measured value is the experimental result, observed result, or value you collected. The calculator compares this value with the accepted value.',
      },
      {
        question: 'Can percent error be negative?',
        answer:
          'Standard percent error is usually shown as a positive value because it uses absolute error. This calculator also shows signed percent error so you can see whether the measured value was high or low.',
      },
      {
        question: 'Why can the accepted value not be zero?',
        answer:
          'Percent error divides by the accepted value. If the accepted value is zero, the percentage comparison is undefined, so the calculator will ask for a nonzero accepted value.',
      },
      {
        question: 'Do the units matter?',
        answer:
          'Yes. The measured value and accepted value should use the same unit before you calculate percent error. The unit label is optional and only helps make the answer easier to read.',
      },
      {
        question: 'Is my percent error history private?',
        answer:
          'Yes. Recent percent error calculations stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['percentage-calculator', 'half-life-calculator', 'scientific-calculator'],
  },
  {
    slug: 'half-life-calculator',
    name: 'Half-Life Calculator',
    category: 'calculators',
    summary: 'Calculate remaining amount, elapsed time, or half-life with decay steps.',
    description:
      'Enter a starting amount, half-life, and elapsed time to see what remains, or switch modes to solve elapsed time or half-life. Results show half-lives passed, percent remaining, and formula steps.',
    icon: 'calculator-half-life',
    seoTitle: 'Half-Life Calculator | Free Online Decay Calculator',
    seoDescription:
      'Use the free Access Free Tools half-life calculator to find remaining amount, elapsed time, or half-life with decay formulas, percentages, steps, and examples.',
    useCases: [
      'Estimate how much of a substance remains after a number of half-lives.',
      'Find elapsed time when you know the initial amount, final amount, and half-life.',
      'Solve for half-life when you know initial amount, final amount, and elapsed time.',
      'Check chemistry, physics, biology, environmental science, and study decay examples.',
    ],
    examples: [
      {
        label: 'Remaining amount',
        expression: '100 mg, half-life 6 hours, time 18 hours',
        result: '12.5 mg remaining after 3 half-lives',
      },
      {
        label: 'Find elapsed time',
        expression: '80 g to 10 g, half-life 12 hours',
        result: '36 hours because 80 to 10 is 3 halving steps',
      },
      {
        label: 'Find half-life',
        expression: '100 g to 25 g in 10 days',
        result: '5 days because two half-lives passed',
      },
    ],
    faq: [
      {
        question: 'What formula does the Half-Life Calculator use?',
        answer:
          'For remaining amount, it uses remaining amount = initial amount x (1/2)^(elapsed time / half-life). The elapsed time divided by the half-life tells how many times the amount gets cut in half. The calculator also rearranges that same formula to solve for elapsed time or the half-life itself.',
      },
      {
        question: 'What is a half-life?',
        answer:
          'A half-life is the time it takes for a quantity to drop to half of whatever amount is currently there. If 100 mg has a 6-hour half-life, about 50 mg remains after 6 hours, 25 mg after 12 hours, and 12.5 mg after 18 hours. It halves again and again instead of subtracting the same amount every time.',
      },
      {
        question: 'What do the main Half-Life Calculator inputs mean?',
        answer:
          'Initial amount is what you start with before decay. Final amount is what is left after decay when you are solving for elapsed time or half-life. Half-life is the time needed for the current amount to halve. Elapsed time is how long the decay has been happening. Amount unit and time unit are labels, so the calculator does not convert mg to g or hours to days for you.',
      },
      {
        question: 'What does half-lives passed mean?',
        answer:
          'Half-lives passed is elapsed time divided by half-life. If the elapsed time is 18 hours and the half-life is 6 hours, then 3 half-lives passed. That means the amount was halved three times: 100 to 50, 50 to 25, then 25 to 12.5.',
      },
      {
        question: 'Can I solve for elapsed time?',
        answer:
          'Yes. Choose Elapsed time, enter the initial amount, final amount, and known half-life, then calculate. The final amount must be greater than zero and not greater than the initial amount.',
      },
      {
        question: 'Can I solve for the half-life itself?',
        answer:
          'Yes. Choose Half-life, enter the initial amount, final amount, and elapsed time. The final amount must be less than the initial amount so the decay rate can be calculated.',
      },
      {
        question: 'Why does the final amount have to be greater than zero?',
        answer:
          'The log formula needs a positive final-to-initial ratio. Zero would mean the amount is completely gone, but an ideal exponential decay curve keeps getting smaller and closer to zero instead of hitting exact zero in a normal finite time calculation.',
      },
      {
        question: 'Do the units matter?',
        answer:
          'Yes. Keep elapsed time and half-life in the same time unit, such as hours with hours or years with years. The amount unit is only a label and should match between initial and final amounts.',
      },
      {
        question: 'What should I double-check before trusting the answer?',
        answer:
          'Check that you picked the right mode, used the same time unit for elapsed time and half-life, entered the final amount as the amount remaining, and kept the final amount positive. If a question says 75% decayed, enter 25% remaining.',
      },
      {
        question: 'What is the difference between physical, biological, and effective half-life?',
        answer:
          'Physical or radiological half-life is about radioactive decay itself. Biological half-life is about how fast the body removes a substance. Effective half-life combines both ideas. This calculator only handles the basic exponential decay math you enter; it does not decide medical, biological, or radiation safety rules.',
      },
      {
        question: 'Can I use this for medicine dosing or radiation safety decisions?',
        answer:
          'No. This tool is for general math, study, and planning examples. Do not use it as medical advice, dosing advice, or radiation safety guidance.',
      },
      {
        question: 'Is my half-life calculation history private?',
        answer:
          'Yes. Recent half-life answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['log-calculator', 'exponent-calculator', 'scientific-calculator'],
  },
  {
    slug: 'exponent-calculator',
    name: 'Exponent Calculator',
    category: 'calculators',
    summary: 'Calculate powers with positive, negative, zero, decimal, and fraction exponents.',
    description:
      'Use this free exponent calculator to raise a base to a power and see the result, scientific notation, zero exponent rules, negative exponent steps, fractional exponent notes, examples, copy, and history.',
    icon: 'calculator-power',
    seoTitle: 'Exponent Calculator | Free Online Power Calculator',
    seoDescription:
      'Calculate powers with positive, negative, zero, decimal, and simple fraction exponents plus steps and scientific notation.',
    useCases: [
      'Calculate squares, cubes, powers of 10, and larger powers.',
      'Check zero exponent and negative exponent homework problems.',
      'Use simple fraction exponents such as 1/2 for square-root style calculations.',
      'Copy exponent answers and compare recent calculations while studying.',
    ],
    examples: [
      {
        label: 'Power of two',
        expression: '2^8',
        result: '256',
      },
      {
        label: 'Negative exponent',
        expression: '5^-3',
        result: '0.008',
      },
      {
        label: 'Fraction exponent',
        expression: '81^(1/2)',
        result: '9',
      },
    ],
    faq: [
      {
        question: 'What does an exponent mean?',
        answer:
          'An exponent tells how many times to use the base as a factor. For example, 2^4 means 2 x 2 x 2 x 2, which equals 16.',
      },
      {
        question: 'Can this calculator handle negative exponents?',
        answer:
          'Yes. A negative exponent is shown as a reciprocal. For example, 5^-3 means 1 / 5^3, which equals 0.008.',
      },
      {
        question: 'What happens when the exponent is zero?',
        answer:
          'Any nonzero base raised to the power of 0 equals 1. The calculator will show this rule in the steps.',
      },
      {
        question: 'Can I use fraction exponents?',
        answer:
          'Yes. You can enter simple fraction exponents such as 1/2 or 3/2. Fractional exponents can represent roots and powers.',
      },
      {
        question: 'Why are some negative-base powers not supported?',
        answer:
          'Negative bases with non-whole-number exponents can lead to complex numbers. This calculator focuses on real-number results, so negative bases need whole-number exponents.',
      },
      {
        question: 'Does the calculator show scientific notation?',
        answer:
          'Yes. The result card shows the normal result and a scientific-notation version, which is useful for very large or very small powers.',
      },
      {
        question: 'Is my exponent history private?',
        answer:
          'Yes. Recent exponent calculations stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['log-calculator', 'root-calculator', 'quadratic-formula-calculator'],
  },
  {
    slug: 'log-calculator',
    name: 'Log Calculator',
    category: 'calculators',
    summary: 'Calculate logarithms with custom bases, ln, log10, and change-of-base steps.',
    description:
      'Use this free log calculator to find logarithms with any valid base, compare ln and log10 values, check the exponential form, and see change-of-base steps.',
    icon: 'calculator-log',
    seoTitle: 'Log Calculator | Free Online Logarithm Calculator',
    seoDescription:
      'Use the free Access Free Tools log calculator to calculate logarithms with custom bases, natural logs, common logs, exponential checks, and change-of-base steps.',
    useCases: [
      'Calculate log base 2, base 10, natural log, or another custom base.',
      'Check logarithm homework with change-of-base steps.',
      'Compare log, ln, and log10 values from one input.',
      'Confirm a logarithm by seeing the matching exponential power check.',
    ],
    examples: [
      {
        label: 'Base 2 logarithm',
        expression: 'log_2(8)',
        result: '3',
      },
      {
        label: 'Common logarithm',
        expression: 'log_10(1000)',
        result: '3',
      },
      {
        label: 'Natural logarithm',
        expression: 'ln(e^3)',
        result: '3',
      },
    ],
    faq: [
      {
        question: 'What formula does the Log Calculator use?',
        answer:
          'It uses the change-of-base formula: log_b(x) = ln(x) / ln(b). This lets the calculator solve logarithms for any valid positive base except 1.',
      },
      {
        question: 'What values can I enter?',
        answer:
          'The log value must be greater than zero. The base must also be greater than zero, and the base cannot be 1.',
      },
      {
        question: 'What is the difference between log, log10, and ln?',
        answer:
          'log10 means base 10, ln means base e, and a custom log lets you choose another base such as 2, 3, or 5.',
      },
      {
        question: 'How can I check a logarithm answer?',
        answer:
          'Rewrite it as an exponent. If log base b of x equals y, then b^y should equal x. The calculator shows this check in the result card.',
      },
      {
        question: 'Can logarithm answers be negative?',
        answer:
          'Yes. A logarithm can be negative when the value is between 0 and 1 for a base greater than 1, such as log_10(0.01) = -2.',
      },
      {
        question: 'Is my log calculation history private?',
        answer:
          'Yes. Recent log answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['exponent-calculator', 'root-calculator', 'scientific-calculator'],
  },
  {
    slug: 'root-calculator',
    name: 'Root Calculator',
    category: 'calculators',
    summary: 'Calculate square roots, cube roots, nth roots, exponent form, and steps.',
    description:
      'Use this free root calculator to find square roots, cube roots, and nth roots with real-number guardrails, exponent form, power checks, examples, and steps.',
    icon: 'calculator-root',
    seoTitle: 'Root Calculator | Free Online Nth Root Calculator',
    seoDescription:
      'Use the free Access Free Tools root calculator to calculate square roots, cube roots, and nth roots with exponent form, power checks, and step-by-step work.',
    useCases: [
      'Find square roots and cube roots for math, science, and study problems.',
      'Calculate nth roots such as fourth roots or fifth roots.',
      'Convert root notation into rational exponent form.',
      'Check whether a negative radicand has a real-number root.',
    ],
    examples: [
      {
        label: 'Square root',
        expression: 'root_2(144)',
        result: '12',
      },
      {
        label: 'Cube root',
        expression: 'root_3(-125)',
        result: '-5',
      },
      {
        label: 'Fourth root',
        expression: 'root_4(81)',
        result: '3',
      },
    ],
    faq: [
      {
        question: 'What is an nth root?',
        answer:
          'An nth root asks what number raised to the nth power gives the radicand. For example, the cube root of 125 is 5 because 5^3 = 125.',
      },
      {
        question: 'What is the difference between square root and cube root?',
        answer:
          'A square root uses index 2, so the answer squared returns the radicand. A cube root uses index 3, so the answer cubed returns the radicand.',
      },
      {
        question: 'Can this calculator handle negative numbers?',
        answer:
          'It can calculate real odd roots of negative numbers, such as root_3(-125) = -5. Even roots of negative numbers are not real numbers, so the calculator shows an error.',
      },
      {
        question: 'How are roots related to exponents?',
        answer:
          'A root can be rewritten as a rational exponent. The nth root of x is the same as x^(1/n).',
      },
      {
        question: 'Can the root index be a decimal?',
        answer:
          'No. This calculator uses whole-number root indexes, such as 2, 3, 4, or 5.',
      },
      {
        question: 'Is my root calculation history private?',
        answer:
          'Yes. Recent root answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['exponent-calculator', 'log-calculator', 'scientific-calculator'],
  },
  {
    slug: 'quadratic-formula-calculator',
    name: 'Quadratic Formula Calculator',
    category: 'calculators',
    summary: 'Solve ax^2 + bx + c = 0 with roots, discriminant, vertex, and steps.',
    description:
      'Use this free quadratic formula calculator to solve ax^2 + bx + c = 0, find real or complex roots, discriminant, vertex, axis of symmetry, steps, copy, and history.',
    icon: 'calculator-quadratic',
    seoTitle: 'Quadratic Formula Calculator | Free Online Root Solver',
    seoDescription:
      'Use the free Access Free Tools quadratic formula calculator to solve ax^2 + bx + c = 0 with real or complex roots, discriminant, vertex, steps, and examples.',
    useCases: [
      'Solve quadratic equations in standard form ax^2 + bx + c = 0.',
      'Check whether an equation has two real roots, one repeated root, or complex roots.',
      'Find the discriminant, vertex, axis of symmetry, opening direction, and y-intercept.',
      'Copy roots and steps for algebra homework, graphing, studying, or checking work.',
    ],
    examples: [
      {
        label: 'Two real roots',
        expression: 'x^2 - 3x + 2 = 0',
        result: 'x = 2, 1',
      },
      {
        label: 'Repeated root',
        expression: 'x^2 - 4x + 4 = 0',
        result: 'x = 2',
      },
      {
        label: 'Complex roots',
        expression: 'x^2 + 2x + 5 = 0',
        result: 'x = -1 +/- 2i',
      },
    ],
    faq: [
      {
        question: 'What formula does the Quadratic Formula Calculator use?',
        answer:
          'It uses x = (-b +/- sqrt(b^2 - 4ac)) / 2a for equations written in standard form ax^2 + bx + c = 0.',
      },
      {
        question: 'What is the discriminant?',
        answer:
          'The discriminant is b^2 - 4ac. It tells you the root type: positive means two real roots, zero means one repeated real root, and negative means two complex conjugate roots.',
      },
      {
        question: 'Why can coefficient a not be zero?',
        answer:
          'A quadratic equation needs an x^2 term. If a is zero, the equation becomes linear, so the quadratic formula does not apply.',
      },
      {
        question: 'Can this calculator show complex roots?',
        answer:
          'Yes. When the discriminant is negative, the calculator shows the complex conjugate roots using i.',
      },
      {
        question: 'Does this calculator show graph details?',
        answer:
          'Yes. It shows the vertex, axis of symmetry, y-intercept, and whether the parabola opens up or down.',
      },
      {
        question: 'What form should I enter the equation in?',
        answer:
          'Enter the coefficients from standard form ax^2 + bx + c = 0. For example, x^2 - 3x + 2 = 0 uses a = 1, b = -3, and c = 2.',
      },
      {
        question: 'Is my quadratic calculation history private?',
        answer:
          'Yes. Recent quadratic answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['root-calculator', 'scientific-calculator', 'exponent-calculator'],
  },
  {
    slug: 'binary-calculator',
    name: 'Binary Calculator',
    category: 'calculators',
    summary: 'Add, subtract, multiply, divide, and convert binary numbers.',
    description:
      'Use this free binary calculator for base-2 addition, subtraction, multiplication, division with remainders, binary-to-decimal conversion, decimal-to-binary conversion, copy, and history.',
    icon: 'calculator-binary',
    seoTitle: 'Binary Calculator | Free Online Base-2 Calculator',
    seoDescription:
      'Use the free Access Free Tools binary calculator to add, subtract, multiply, divide, and convert binary numbers to decimal or decimal numbers to binary with steps.',
    useCases: [
      'Check binary addition, subtraction, multiplication, and division homework.',
      'Convert binary values such as 101010 into decimal numbers.',
      'Convert whole decimal numbers into grouped binary output.',
      'See quotient and remainder for binary division problems that do not divide evenly.',
    ],
    examples: [
      {
        label: 'Binary addition',
        expression: '1011 + 110',
        result: '10001',
      },
      {
        label: 'Binary subtraction',
        expression: '10000 - 1',
        result: '1111',
      },
      {
        label: 'Binary division',
        expression: '1101 / 10',
        result: '110 remainder 1',
      },
    ],
    faq: [
      {
        question: 'What is a binary number?',
        answer:
          'A binary number is written in base 2, so each digit is either 0 or 1. Each place value is a power of 2 instead of a power of 10.',
      },
      {
        question: 'What can I use the Binary Calculator for?',
        answer:
          'Use it to add, subtract, multiply, divide, and convert whole binary numbers. It also shows decimal values and simple steps so you can check the work.',
      },
      {
        question: 'Can I enter spaces in a binary number?',
        answer:
          'Yes. Spaces and underscores are ignored, so you can type grouped values such as 1111 0000 to make longer binary numbers easier to read.',
      },
      {
        question: 'How does binary division work in this calculator?',
        answer:
          'Binary division returns a whole-number quotient. If the division is not even, the calculator also shows the remainder in binary and decimal.',
      },
      {
        question: 'Does the calculator convert decimal to binary?',
        answer:
          'Yes. The quick conversions panel converts whole decimal numbers into binary and converts binary numbers back into decimal.',
      },
      {
        question: 'Can this calculator handle negative binary numbers?',
        answer:
          "Yes, you can use a leading minus sign for simple signed whole-number calculations. It does not use fixed-width two's complement notation yet.",
      },
      {
        question: 'Is my binary calculation history private?',
        answer:
          'Yes. Recent binary answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['hex-calculator', 'scientific-calculator', 'basic-calculator'],
  },
  {
    slug: 'hex-calculator',
    name: 'Hex Calculator',
    category: 'calculators',
    summary: 'Add, subtract, multiply, divide, and convert hexadecimal numbers.',
    description:
      'Use this free hex calculator for base-16 addition, subtraction, multiplication, division with remainders, hex-to-decimal conversion, decimal-to-hex conversion, hex-to-binary conversion, copy, and history.',
    icon: 'calculator-hex',
    seoTitle: 'Hex Calculator | Free Online Hexadecimal Calculator',
    seoDescription:
      'Use the free Access Free Tools hex calculator to add, subtract, multiply, divide, and convert hexadecimal numbers to decimal or binary with steps and remainders.',
    useCases: [
      'Check hexadecimal addition, subtraction, multiplication, and division problems.',
      'Convert hex values such as 2A or 0xFF into decimal numbers.',
      'Convert whole decimal numbers into hexadecimal output.',
      'Compare hex, decimal, and binary answers while studying number systems or coding examples.',
    ],
    examples: [
      {
        label: 'Hex addition',
        expression: 'A3 + 1F',
        result: 'C2',
      },
      {
        label: 'Hex subtraction',
        expression: 'FF - 2A',
        result: 'D5',
      },
      {
        label: 'Hex division',
        expression: '2F / A',
        result: '4 remainder 7',
      },
    ],
    faq: [
      {
        question: 'What is a hexadecimal number?',
        answer:
          'A hexadecimal number is written in base 16. It uses digits 0-9 plus letters A-F, where A is 10, B is 11, C is 12, D is 13, E is 14, and F is 15.',
      },
      {
        question: 'What can I use the Hex Calculator for?',
        answer:
          'Use it to add, subtract, multiply, divide, and convert whole hexadecimal numbers. The calculator also shows decimal and binary versions of the answer.',
      },
      {
        question: 'Can I enter 0x before a hex number?',
        answer:
          'Yes. Optional 0x prefixes are accepted, so 0xFF and FF both work. Spaces and underscores are also ignored for readability.',
      },
      {
        question: 'How does hex division work in this calculator?',
        answer:
          'Hex division returns a whole-number quotient. If the division is not even, the calculator also shows the remainder in hex, decimal, and binary.',
      },
      {
        question: 'Does the calculator convert decimal to hex?',
        answer:
          'Yes. The quick conversions panel converts whole decimal numbers into hex and converts hex numbers back into decimal and binary.',
      },
      {
        question: 'Can this calculator handle lowercase hex letters?',
        answer:
          'Yes. You can enter uppercase or lowercase letters A-F. Results are shown in uppercase for cleaner reading.',
      },
      {
        question: 'Is my hex calculation history private?',
        answer:
          'Yes. Recent hex answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['binary-calculator', 'scientific-calculator', 'exponent-calculator'],
  },
  {
    slug: 'kawaii-calculator',
    name: 'Kawaii Calculator',
    category: 'calculators',
    summary: 'A cute pastel calculator for quick everyday math.',
    description:
      'Use this kawaii calculator for everyday arithmetic, percentages, decimals, keyboard input, copy result, and calculation history in a softer pastel layout.',
    icon: 'calculator-heart',
    seoTitle: 'Kawaii Calculator | Cute Free Online Calculator',
    seoDescription:
      'Use the free Access Free Tools kawaii calculator for cute pastel everyday math, percentages, decimals, keyboard input, history, and quick result copying.',
    useCases: [
      'Make quick calculations in a softer, more playful layout.',
      'Check totals, discounts, and simple math without opening a full spreadsheet.',
      'Use keyboard shortcuts while keeping a cheerful calculator page open.',
      'Copy results and keep recent calculations visible while comparing numbers.',
    ],
    examples: [
      {
        label: 'Add cute stationery costs',
        expression: '12.50 + 7.25',
        result: '19.75',
      },
      {
        label: 'Find a pastel sale price',
        expression: '45 - 15%',
        result: '38.25',
      },
      {
        label: 'Split a small group total',
        expression: '96 / 4',
        result: '24',
      },
    ],
    faq: [
      {
        question: 'What makes this a kawaii calculator?',
        answer:
          'The calculator is styled like a cute pastel handheld calculator, with a soft shell, candy keys, a mint display face, blush details, and mascot artwork. The math is still the same reliable calculator logic.',
      },
      {
        question: 'Can I use keyboard shortcuts?',
        answer:
          'Yes. Use 0-9, plus, minus, multiply, divide, percent, decimal, Enter for equals, Backspace for delete, and Escape or Delete to clear.',
      },
      {
        question: 'Is my calculation history private?',
        answer:
          'Yes. The history panel only keeps recent calculations in the current browser tab. It is not sent to a server.',
      },
      {
        question: 'Why use this instead of the basic calculator?',
        answer:
          'Use this version when you want the same everyday math in a softer, more cheerful workspace. Use the Basic Calculator if you prefer the plain utility design.',
      },
      {
        question: 'Can I copy a result?',
        answer:
          'Yes. Press Copy result after a calculation to copy the current display value to your clipboard.',
      },
      {
        question: 'Does the cute design change the math?',
        answer:
          'No. The kawaii version uses the same everyday calculator behavior for arithmetic, percentages, decimals, keyboard input, copying, and session history. Only the visual style changes.',
      },
    ],
    relatedSlugs: ['basic-calculator', 'percentage-calculator', 'fraction-calculator'],
  },
  {
    slug: 'scientific-calculator',
    name: 'Scientific Calculator',
    category: 'calculators',
    summary: 'A free scientific calculator for trig, logs, roots, powers, and constants.',
    description:
      'Use this free scientific calculator for trigonometry, logarithms, square roots, cube roots, powers, constants, DEG/RAD mode, expression history, and quick result copying.',
    icon: 'calculator-fx',
    seoTitle: 'Scientific Calculator | Free Online Scientific Calculator',
    seoDescription:
      'Use the free Access Free Tools scientific calculator for trigonometry, logarithms, roots, powers, constants, DEG/RAD mode, expression history, and copying results.',
    useCases: [
      'Solve trigonometry problems with DEG or RAD angle mode.',
      'Calculate logarithms, natural logs, square roots, cube roots, and powers.',
      'Check science, math, engineering, and study expressions in one line.',
      'Reuse recent expressions from the history panel while comparing answers.',
    ],
    examples: [
      {
        label: 'Trig identity check',
        expression: 'sin(30) + cos(60)',
        result: '1',
      },
      {
        label: 'Common logarithm',
        expression: 'log(1000)',
        result: '3',
      },
      {
        label: 'Roots together',
        expression: 'sqrt(25) + cbrt(8)',
        result: '7',
      },
    ],
    faq: [
      {
        question: 'What is the difference between DEG and RAD?',
        answer:
          'DEG uses degrees for trigonometry, so sin(30) means 30 degrees. RAD uses radians, which is common in advanced math and many science classes.',
      },
      {
        question: 'Which functions are supported?',
        answer:
          'The calculator supports sin, cos, tan, inverse trig functions, log, ln, sqrt, cbrt, abs, powers, parentheses, pi, e, and standard arithmetic.',
      },
      {
        question: 'Can I type expressions directly?',
        answer:
          'Yes. You can click the keypad or type expressions such as sin(45)+log(100). Press Enter or the equals button to calculate.',
      },
      {
        question: 'Does the history leave my browser?',
        answer:
          'No. Recent scientific calculations stay in the page session only and are not sent to a server.',
      },
      {
        question: 'What is this Scientific Calculator best for?',
        answer:
          'Use it when you need trig functions, logs, roots, powers, constants, parentheses, or DEG/RAD angle mode. For plain totals and quick percentages, the Basic Calculator is simpler.',
      },
      {
        question: 'What should I check before trusting a scientific result?',
        answer:
          'Check parentheses, angle mode, negative signs, and whether your class or formula expects degrees or radians. A correct expression in the wrong mode can still give the wrong answer.',
      },
    ],
    relatedSlugs: ['log-calculator', 'root-calculator', 'quadratic-formula-calculator'],
  },
  {
    slug: 'fraction-calculator',
    name: 'Fraction Calculator',
    category: 'calculators',
    summary: 'Add, subtract, multiply, divide, simplify, and convert fractions.',
    description:
      'Use this free fraction calculator for adding, subtracting, multiplying, dividing, simplifying, and converting fractions, improper fractions, mixed numbers, and decimals.',
    icon: 'calculator-fraction',
    seoTitle: 'Fraction Calculator | Free Online Fraction Calculator',
    seoDescription:
      'Add, subtract, multiply, divide, simplify, and convert fractions, mixed numbers, improper fractions, and decimals.',
    useCases: [
      'Add or subtract fractions with different denominators.',
      'Multiply and divide fractions while seeing the simplified answer.',
      'Convert improper fractions into mixed numbers for homework or recipes.',
      'Check a decimal value when comparing measurements or portions.',
    ],
    examples: [
      {
        label: 'Add unlike denominators',
        expression: '1/2 + 1/3',
        result: '5/6',
      },
      {
        label: 'Subtract a mixed number',
        expression: '2 1/4 - 3/8',
        result: '1 7/8',
      },
      {
        label: 'Multiply fractions',
        expression: '3/4 x 2/5',
        result: '3/10',
      },
    ],
    faq: [
      {
        question: 'What can I use the Fraction Calculator for?',
        answer:
          'Use it to add, subtract, multiply, divide, simplify, and convert fractions. It works with simple fractions, improper fractions, and mixed numbers.',
      },
      {
        question: 'Does the calculator simplify fractions automatically?',
        answer:
          'Yes. Results are reduced to lowest terms, and the page also shows an improper fraction, a mixed-number form, and a decimal value.',
      },
      {
        question: 'Can I enter mixed numbers?',
        answer:
          'Yes. Put the whole number in the Whole box and the fraction part in the numerator and denominator boxes. For example, enter 2, 1, and 4 for 2 1/4.',
      },
      {
        question: 'How does dividing fractions work?',
        answer:
          'Dividing by a fraction uses the reciprocal of the second fraction. The calculator flips the second fraction, multiplies, and then simplifies the answer.',
      },
      {
        question: 'Can a denominator be zero?',
        answer:
          'No. A denominator cannot be zero, and the calculator will show an error if you try to calculate with one.',
      },
      {
        question: 'Is my fraction history private?',
        answer:
          'Yes. Recent fraction calculations stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['least-common-multiple-calculator', 'greatest-common-factor-calculator', 'percentage-calculator'],
  },
  {
    slug: 'least-common-multiple-calculator',
    name: 'Least Common Multiple Calculator',
    category: 'calculators',
    summary: 'Find the least common multiple of two or more whole numbers with steps.',
    description:
      'Use this free least common multiple calculator to find the LCM of two or more positive whole numbers with exact integer math, examples, copy, history, and step-by-step notes.',
    icon: 'calculator-lcm',
    seoTitle: 'Least Common Multiple Calculator | Free Online LCM Calculator',
    seoDescription:
      'Use the free Access Free Tools least common multiple calculator to find the LCM of two or more whole numbers with exact answers, examples, history, and steps.',
    useCases: [
      'Find a common denominator before adding or comparing fractions.',
      'Solve schedule problems where events repeat at different intervals.',
      'Check school math problems involving multiples and divisibility.',
      'Compare two or more positive whole numbers with exact integer results.',
    ],
    examples: [
      {
        label: 'Three numbers',
        expression: 'LCM of 12, 18, 30',
        result: '180',
      },
      {
        label: 'Two numbers',
        expression: 'LCM of 8 and 14',
        result: '56',
      },
      {
        label: 'Common denominator',
        expression: 'LCM of 6, 15, 25',
        result: '150',
      },
    ],
    faq: [
      {
        question: 'What is the least common multiple?',
        answer:
          'The least common multiple is the smallest positive number that is a multiple of every number in the list.',
      },
      {
        question: 'How does the LCM Calculator find the answer?',
        answer:
          'It combines the numbers with the relationship LCM(a,b) = a x b / GCF(a,b). That keeps the answer exact while it moves through the list.',
      },
      {
        question: 'Can I enter more than two numbers?',
        answer:
          'Yes. Enter at least two positive whole numbers separated by commas, spaces, or semicolons. The calculator finds one LCM for the whole list.',
      },
      {
        question: 'Why do the inputs need to be positive whole numbers?',
        answer:
          'LCM is normally used for positive integers. Zero and negative values make the idea of the smallest positive shared multiple unclear for this everyday calculator.',
      },
      {
        question: 'When should I use the Greatest Common Factor Calculator instead?',
        answer:
          'Use GCF when you need the largest shared divisor. Use LCM when you need the smallest shared multiple, such as a common denominator.',
      },
      {
        question: 'Is my LCM history private?',
        answer:
          'Yes. Recent LCM answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['greatest-common-factor-calculator', 'factor-calculator', 'fraction-calculator'],
  },
  {
    slug: 'greatest-common-factor-calculator',
    name: 'Greatest Common Factor Calculator',
    category: 'calculators',
    summary: 'Find the greatest common factor of two or more whole numbers with steps.',
    description:
      'Use this free greatest common factor calculator to find the GCF of two or more positive whole numbers with exact integer math, examples, copy, history, and step-by-step notes.',
    icon: 'calculator-gcf',
    aliases: ['Common Factor Calculator', 'Common Factors Calculator', 'GCF Calculator'],
    seoTitle: 'Greatest Common Factor Calculator | Free Online GCF Calculator',
    seoDescription:
      'Use the free Access Free Tools greatest common factor calculator to find the GCF of two or more whole numbers with exact answers, examples, history, and steps.',
    useCases: [
      'Simplify fractions by finding the largest shared divisor.',
      'Factor numbers in school math, ratios, and divisibility problems.',
      'Find the largest equal group size that fits multiple quantities.',
      'Check multi-number GCF problems with exact integer results.',
    ],
    examples: [
      {
        label: 'Three numbers',
        expression: 'GCF of 24, 36, 60',
        result: '12',
      },
      {
        label: 'Two numbers',
        expression: 'GCF of 48 and 180',
        result: '12',
      },
      {
        label: 'Larger list',
        expression: 'GCF of 81, 153, 225',
        result: '9',
      },
    ],
    faq: [
      {
        question: 'What is the greatest common factor?',
        answer:
          'The greatest common factor is the largest positive whole number that divides every number in the list without a remainder.',
      },
      {
        question: 'How does the GCF Calculator find the answer?',
        answer:
          'It uses the Euclidean algorithm to compare pairs of numbers, then carries the shared factor through the rest of the list.',
      },
      {
        question: 'Can I find the GCF of more than two numbers?',
        answer:
          'Yes. Enter two or more positive whole numbers separated by commas, spaces, or semicolons. The calculator returns one shared GCF.',
      },
      {
        question: 'What is the difference between GCF and LCM?',
        answer:
          'GCF is the largest shared factor. LCM is the smallest shared multiple. GCF helps with simplifying, while LCM helps with common denominators and repeating schedules.',
      },
      {
        question: 'Can the GCF be 1?',
        answer:
          'Yes. If the numbers do not share any factor larger than 1, the greatest common factor is 1.',
      },
      {
        question: 'Is my GCF history private?',
        answer:
          'Yes. Recent GCF answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['least-common-multiple-calculator', 'factor-calculator', 'ratio-calculator'],
  },
  {
    slug: 'factor-calculator',
    name: 'Factor Calculator',
    category: 'calculators',
    summary: 'List factors, factor pairs, and prime factorization for a whole number.',
    description:
      'Use this free factor calculator to list every factor of a positive whole number, show factor pairs, identify prime numbers, and write prime factorization with steps.',
    icon: 'calculator-factor',
    seoTitle: 'Factor Calculator | Free Online Factors and Prime Factorization',
    seoDescription:
      'Use the free Access Free Tools factor calculator to find factors, factor pairs, prime factorization, and prime-number checks for positive whole numbers.',
    useCases: [
      'List all factors of a number for divisibility and homework checks.',
      'Find factor pairs before simplifying, factoring, or grouping values.',
      'Write prime factorization in repeated-prime or exponent form.',
      'Check whether a positive whole number is prime or composite.',
    ],
    examples: [
      {
        label: 'All factors',
        expression: 'Factors of 84',
        result: '1, 2, 3, 4, 6, 7, 12, 14, 21, 28, 42, 84',
      },
      {
        label: 'Prime number',
        expression: 'Factors of 97',
        result: '1, 97',
      },
      {
        label: 'Prime factorization',
        expression: '360',
        result: '2^3 x 3^2 x 5',
      },
    ],
    faq: [
      {
        question: 'What is a factor?',
        answer:
          'A factor is a whole number that divides another whole number without a remainder. For example, 6 is a factor of 24 because 24 / 6 = 4.',
      },
      {
        question: 'What does the Factor Calculator show?',
        answer:
          'It shows all factors, factor pairs, prime factors, prime factor powers, and whether the input is prime.',
      },
      {
        question: 'Is 1 a prime number?',
        answer:
          'No. A prime number has exactly two positive factors: 1 and itself. The number 1 has only one positive factor.',
      },
      {
        question: 'What is the largest input this factor tool supports?',
        answer:
          'The tool supports positive safe whole numbers up to 1,000,000,000,000. That keeps browser factor searches responsive.',
      },
      {
        question: 'When should I use GCF or LCM instead?',
        answer:
          'Use the Factor Calculator for one number. Use GCF to compare shared factors across multiple numbers, and LCM to compare shared multiples.',
      },
      {
        question: 'Is my factor history private?',
        answer:
          'Yes. Recent factor answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['greatest-common-factor-calculator', 'least-common-multiple-calculator', 'fraction-calculator'],
  },
  {
    slug: 'rounding-calculator',
    name: 'Rounding Calculator',
    category: 'calculators',
    summary: 'Round numbers by decimal places, significant figures, or place value.',
    description:
      'Use this free rounding calculator to round numbers to decimal places, significant figures, or place values with nearest, up, down, and truncate methods.',
    icon: 'calculator-round',
    seoTitle: 'Rounding Calculator | Decimal and Significant Figures',
    seoDescription:
      'Use the free Access Free Tools rounding calculator to round numbers by decimal places, significant figures, or place value with steps and examples.',
    useCases: [
      'Round money, measurements, and everyday decimal values.',
      'Round study answers to a required number of significant figures.',
      'Round whole numbers to tens, hundreds, thousands, or decimal places.',
      'Compare nearest, round up, round down, and truncate methods.',
    ],
    examples: [
      {
        label: 'Decimal places',
        expression: '12.3456 to 2 decimal places',
        result: '12.35',
      },
      {
        label: 'Significant figures',
        expression: '98,765 to 3 significant figures',
        result: '98,800',
      },
      {
        label: 'Place value',
        expression: '1,846 to the nearest hundred',
        result: '1,800',
      },
    ],
    faq: [
      {
        question: 'What rounding modes are supported?',
        answer:
          'The calculator supports decimal places, significant figures, and place value rounding.',
      },
      {
        question: 'How do I round to a place value?',
        answer:
          'Use place-value mode. Exponent 1 means nearest 10, exponent 2 means nearest 100, exponent 3 means nearest 1,000, and exponent -2 means nearest 0.01.',
      },
      {
        question: 'What is the difference between nearest, up, down, and truncate?',
        answer:
          'Nearest rounds to the closest value. Up uses the next higher rounding value, down uses the next lower rounding value, and truncate drops extra digits toward zero.',
      },
      {
        question: 'Can I round negative numbers?',
        answer:
          'Yes. The calculator accepts negative numbers. For nearest rounding, half values move away from zero.',
      },
      {
        question: 'Why can rounded decimals sometimes look surprising?',
        answer:
          'Browsers store many decimals in binary floating-point form. The calculator cleans display values, but very precise decimal work can still have normal floating-point limits.',
      },
      {
        question: 'Is my rounding history private?',
        answer:
          'Yes. Recent rounded values stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['scientific-notation-calculator', 'percentage-calculator', 'basic-calculator'],
  },
  {
    slug: 'matrix-calculator',
    name: 'Matrix Calculator',
    category: 'calculators',
    summary: 'Add, subtract, multiply, transpose, and find determinants for 2x2 and 3x3 matrices.',
    description:
      'Use this free matrix calculator for 2x2 and 3x3 matrix addition, subtraction, multiplication, transpose, and determinant calculations with steps, examples, copy, and history.',
    icon: 'calculator-matrix',
    seoTitle: 'Matrix Calculator | Free Online Matrix Operations',
    seoDescription:
      'Use the free Access Free Tools matrix calculator to add, subtract, multiply, transpose, and find determinants for 2x2 and 3x3 matrices with steps.',
    useCases: [
      'Check 2x2 and 3x3 matrix addition or subtraction problems.',
      'Multiply square matrices while seeing row-by-column steps.',
      'Find determinants for 2x2 and 3x3 matrices.',
      'Transpose a matrix for algebra, precalculus, or linear algebra practice.',
    ],
    examples: [
      {
        label: '2x2 multiply',
        expression: '[[1,2],[3,4]] x [[5,6],[7,8]]',
        result: '[[19,22],[43,50]]',
      },
      {
        label: '2x2 determinant',
        expression: 'det([[1,2],[3,4]])',
        result: '-2',
      },
      {
        label: '3x3 determinant',
        expression: 'det([[6,1,1],[4,-2,5],[2,8,7]])',
        result: '-306',
      },
    ],
    faq: [
      {
        question: 'What matrix operations are supported?',
        answer:
          'The Matrix Calculator supports addition, subtraction, multiplication, determinant, and transpose for 2x2 and 3x3 square matrices.',
      },
      {
        question: 'Does order matter for matrix multiplication?',
        answer:
          'Yes. Matrix multiplication is order-sensitive. A x B can be different from B x A because each result entry uses rows from the first matrix and columns from the second.',
      },
      {
        question: 'What is a determinant?',
        answer:
          'A determinant is a single value calculated from a square matrix. For a 2x2 matrix [[a,b],[c,d]], the determinant is ad - bc.',
      },
      {
        question: 'Can this solve systems of equations?',
        answer:
          'Not yet. This version focuses on core matrix operations. Systems of equations can be a later tool or future expansion.',
      },
      {
        question: 'Can I use decimals or negative values?',
        answer:
          'Yes. Matrix entries can be positive, negative, whole, or decimal numbers.',
      },
      {
        question: 'Is my matrix history private?',
        answer:
          'Yes. Recent matrix answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['scientific-calculator', 'quadratic-formula-calculator', 'big-number-calculator'],
  },
  {
    slug: 'scientific-notation-calculator',
    name: 'Scientific Notation Calculator',
    category: 'calculators',
    summary: 'Convert numbers to scientific notation or back to standard form.',
    description:
      'Use this free scientific notation calculator to convert standard numbers into scientific notation or convert coefficient and exponent form back into standard form with steps.',
    icon: 'calculator-scientific-notation',
    seoTitle: 'Scientific Notation Calculator | Standard Form Converter',
    seoDescription:
      'Use the free Access Free Tools scientific notation calculator to convert numbers to scientific notation or back to standard form with examples and steps.',
    useCases: [
      'Rewrite very large or very small numbers in scientific notation.',
      'Convert a coefficient and power of 10 back into standard form.',
      'Check science, chemistry, physics, astronomy, and math notation examples.',
      'Compare coefficient, exponent, and standard-form output in one place.',
    ],
    examples: [
      {
        label: 'Large number',
        expression: '4,500,000',
        result: '4.5 x 10^6',
      },
      {
        label: 'Small number',
        expression: '0.00042',
        result: '4.2 x 10^-4',
      },
      {
        label: 'Back to standard',
        expression: '6.02 x 10^23',
        result: '602,000,000,000,000,000,000,000',
      },
    ],
    faq: [
      {
        question: 'What is scientific notation?',
        answer:
          'Scientific notation writes a number as a coefficient times a power of 10. Normalized scientific notation uses one nonzero digit to the left of the decimal point.',
      },
      {
        question: 'How do I convert a number to scientific notation?',
        answer:
          'Choose To scientific, enter the standard number, and calculate. The calculator moves the decimal point and counts those moves as the exponent.',
      },
      {
        question: 'How do I convert scientific notation to standard form?',
        answer:
          'Choose To standard, enter the coefficient and whole-number exponent, and calculate. Positive exponents move the decimal right; negative exponents move it left.',
      },
      {
        question: 'Can scientific notation handle negative numbers?',
        answer:
          'Yes. A negative number keeps a negative coefficient, such as -3.2 x 10^5.',
      },
      {
        question: 'What is the difference between this and the Big Number Calculator?',
        answer:
          'Scientific notation is best for compact display and powers of 10. The Big Number Calculator is best for exact whole-number arithmetic with very large integers.',
      },
      {
        question: 'Is my scientific notation history private?',
        answer:
          'Yes. Recent notation conversions stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['exponent-calculator', 'rounding-calculator', 'big-number-calculator'],
  },
  {
    slug: 'big-number-calculator',
    name: 'Big Number Calculator',
    category: 'calculators',
    summary: 'Add, subtract, multiply, and divide very large whole numbers exactly.',
    description:
      'Use this free big number calculator for exact whole-number addition, subtraction, multiplication, and division with remainders beyond normal safe integer limits.',
    icon: 'calculator-big-number',
    seoTitle: 'Big Number Calculator | Exact Large Integer Calculator',
    seoDescription:
      'Use the free Access Free Tools big number calculator to add, subtract, multiply, and divide very large whole numbers exactly with quotient and remainder output.',
    useCases: [
      'Calculate with integers larger than normal calculator safe-number limits.',
      'Add or multiply long whole numbers without losing digits.',
      'Divide large integers and see quotient plus remainder.',
      'Check coding, number theory, base conversion, and study examples.',
    ],
    examples: [
      {
        label: 'Beyond safe integer',
        expression: '9,007,199,254,740,993 + 7',
        result: '9,007,199,254,741,000',
      },
      {
        label: 'Large multiplication',
        expression: '12,345,678,901,234,567,890 x 10',
        result: '123,456,789,012,345,678,900',
      },
      {
        label: 'Large division',
        expression: '100,000,000,000,000,000,000 / 9',
        result: '11,111,111,111,111,111,111 remainder 1',
      },
    ],
    faq: [
      {
        question: 'What makes this a big number calculator?',
        answer:
          'It uses exact BigInt integer arithmetic, so large whole-number results do not lose digits the way normal floating-point number math can.',
      },
      {
        question: 'When should I use this instead of the Basic Calculator?',
        answer:
          'Use the Basic Calculator for everyday decimals and percentages. Use the Big Number Calculator when you need exact whole-number arithmetic with very large integers.',
      },
      {
        question: 'Can I enter decimals?',
        answer:
          'No. This tool is for whole numbers only. Decimal support belongs in normal calculators because BigInt works with integers.',
      },
      {
        question: 'How does division work?',
        answer:
          'Division returns a whole-number quotient. If the values do not divide evenly, the calculator also shows the remainder.',
      },
      {
        question: 'How large can the numbers be?',
        answer:
          'Very large whole numbers are supported, but browser memory and page responsiveness still matter. Extremely huge inputs may become slow.',
      },
      {
        question: 'Is my big number history private?',
        answer:
          'Yes. Recent big number answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['scientific-notation-calculator', 'binary-calculator', 'hex-calculator'],
  },
  {
    slug: 'standard-deviation-calculator',
    name: 'Standard Deviation Calculator',
    category: 'calculators',
    summary: 'Calculate sample or population standard deviation, variance, mean, and count.',
    description:
      'Use this free standard deviation calculator to find sample standard deviation, population standard deviation, variance, mean, count, steps, copy, and history.',
    icon: 'calculator-standard-deviation',
    seoTitle: 'Standard Deviation Calculator | Sample and Population SD',
    seoDescription:
      'Use the free Access Free Tools standard deviation calculator to calculate sample or population standard deviation, variance, mean, count, and steps.',
    useCases: [
      'Measure how spread out a list of numbers is from its mean.',
      'Compare sample standard deviation with population standard deviation.',
      'Check statistics homework, study data, measurements, and class examples.',
      'Copy the standard deviation, variance, mean, and count for notes.',
    ],
    examples: [
      { label: 'Population data', expression: '2, 4, 4, 4, 5, 5, 7, 9', result: 'Population SD = 2' },
      { label: 'Sample data', expression: '2, 4, 4, 4, 5, 5, 7, 9', result: 'Sample SD = 2.1380899353' },
      { label: 'Small data set', expression: '12, 15, 19, 21, 22, 26', result: 'Mean = 19.1666666667' },
    ],
    faq: [
      {
        question: 'What does standard deviation measure?',
        answer:
          'Standard deviation measures how far data values typically are from the mean. A larger standard deviation means the values are more spread out.',
      },
      {
        question: 'Should I use sample or population standard deviation?',
        answer:
          'Use sample standard deviation when your data is a sample that estimates a larger population. Use population standard deviation when the data includes the whole group you care about.',
      },
      {
        question: 'Why does sample standard deviation divide by n - 1?',
        answer:
          'Sample standard deviation divides by n - 1 to correct for estimating population spread from a sample. This is often called Bessel correction.',
      },
      {
        question: 'How many values can I enter?',
        answer:
          'You can enter up to 1,000 values separated by commas, spaces, semicolons, or new lines.',
      },
      {
        question: 'Can the standard deviation be zero?',
        answer:
          'Yes. Standard deviation is zero when every value in the data set is exactly the same.',
      },
      {
        question: 'Is my standard deviation history private?',
        answer:
          'Yes. Recent answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['statistics-calculator', 'mean-median-mode-range-calculator', 'z-score-calculator'],
  },
  {
    slug: 'number-sequence-calculator',
    name: 'Number Sequence Calculator',
    category: 'calculators',
    summary: 'Generate arithmetic, geometric, and Fibonacci-style number sequences.',
    description:
      'Use this free number sequence calculator to generate arithmetic sequences, geometric sequences, Fibonacci-style sequences, next terms, formulas, steps, copy, and history.',
    icon: 'calculator-sequence',
    seoTitle: 'Number Sequence Calculator | Arithmetic, Geometric, Fibonacci',
    seoDescription:
      'Use the free Access Free Tools number sequence calculator to generate arithmetic, geometric, and Fibonacci-style sequences with next terms and steps.',
    useCases: [
      'Create arithmetic sequences from a first term and common difference.',
      'Create geometric sequences from a first term and common ratio.',
      'Generate Fibonacci-style sequences from two starting terms.',
      'Check next terms and sequence formulas for study examples.',
    ],
    examples: [
      { label: 'Arithmetic', expression: 'First 3, difference 4', result: '3, 7, 11, 15, 19' },
      { label: 'Geometric', expression: 'First 2, ratio 3', result: '2, 6, 18, 54, 162' },
      { label: 'Fibonacci', expression: 'Start 1, 1', result: '1, 1, 2, 3, 5, 8, 13' },
    ],
    faq: [
      {
        question: 'What sequence types are supported?',
        answer:
          'The calculator supports arithmetic, geometric, and Fibonacci-style sequences. More sequence types can be added later.',
      },
      {
        question: 'What is an arithmetic sequence?',
        answer:
          'An arithmetic sequence changes by the same amount each time. That constant amount is called the common difference.',
      },
      {
        question: 'What is a geometric sequence?',
        answer:
          'A geometric sequence changes by multiplying by the same value each time. That value is called the common ratio.',
      },
      {
        question: 'How does the Fibonacci-style mode work?',
        answer:
          'It starts with two values, then adds the previous two terms to make each next term.',
      },
      {
        question: 'Can I generate decimals or negative terms?',
        answer:
          'Yes. The first term, common difference, common ratio, and second Fibonacci-style term can be decimals or negative numbers.',
      },
      {
        question: 'Is my sequence history private?',
        answer:
          'Yes. Recent sequences stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['statistics-calculator', 'scientific-calculator', 'exponent-calculator'],
  },
  {
    slug: 'sample-size-calculator',
    name: 'Sample Size Calculator',
    category: 'calculators',
    summary: 'Estimate survey sample size from confidence level, margin of error, and proportion.',
    description:
      'Use this free sample size calculator to estimate a survey sample size from confidence level, margin of error, estimated proportion, and optional population size.',
    icon: 'calculator-sample-size',
    seoTitle: 'Sample Size Calculator | Survey Sample Size Estimator',
    seoDescription:
      'Estimate survey sample size from confidence level, margin of error, population proportion, and optional population size.',
    useCases: [
      'Estimate how many survey responses you need for a proportion.',
      'Compare 90%, 95%, 98%, and 99% confidence levels.',
      'Use 50% estimated proportion for a conservative planning estimate.',
      'Apply finite population correction when the total population is known.',
    ],
    examples: [
      { label: 'Common survey', expression: '95%, 5% margin, 50% proportion', result: '385' },
      { label: 'Finite population', expression: '95%, 5%, 50%, population 1,000', result: '278' },
      { label: 'Higher confidence', expression: '99%, 5%, 50%', result: '664' },
    ],
    faq: [
      {
        question: 'What kind of sample size does this calculator estimate?',
        answer:
          'It estimates sample size for a population proportion, which is common for surveys, polls, yes/no questions, and percentage estimates.',
      },
      {
        question: 'What should I enter for population proportion?',
        answer:
          'Use your best estimate. If you are unsure, use 50%, which gives the most conservative and usually largest sample size.',
      },
      {
        question: 'What is margin of error?',
        answer:
          'Margin of error is the maximum difference you are planning to tolerate between the sample estimate and the true population proportion.',
      },
      {
        question: 'What does finite population correction do?',
        answer:
          'When the total population is known, finite population correction can reduce the required sample size because the sample is a larger share of the whole group.',
      },
      {
        question: 'Can this replace professional survey design?',
        answer:
          'No. It is a planning calculator for common proportion estimates. Professional surveys may need design effects, stratification, weighting, and nonresponse planning.',
      },
      {
        question: 'Is my sample size history private?',
        answer:
          'Yes. Recent sample size answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['confidence-interval-calculator', 'probability-calculator', 'statistics-calculator'],
  },
  {
    slug: 'probability-calculator',
    name: 'Probability Calculator',
    category: 'calculators',
    summary: 'Calculate event union, intersection, complements, and independent-event probability.',
    description:
      'Use this free probability calculator to find P(A and B), P(A or B), complements, independent-event intersections, steps, copy, and history.',
    icon: 'calculator-probability',
    seoTitle: 'Probability Calculator | Union, Intersection, Complement',
    seoDescription:
      'Use the free Access Free Tools probability calculator to calculate P(A and B), P(A or B), complements, independent events, and probability steps.',
    useCases: [
      'Find the chance of A or B happening using the union rule.',
      'Calculate complements such as not A or not B.',
      'Assume independent events when no intersection is entered.',
      'Check classroom probability examples and quick planning estimates.',
    ],
    examples: [
      { label: 'Independent events', expression: 'P(A)=40%, P(B)=25%', result: 'P(A or B)=55%' },
      { label: 'Known overlap', expression: 'P(A)=60%, P(B)=30%, P(A and B)=15%', result: 'P(A or B)=75%' },
      { label: 'Complement', expression: 'P(A)=40%', result: 'P(not A)=60%' },
    ],
    faq: [
      {
        question: 'What does P(A or B) mean?',
        answer:
          'P(A or B) is the probability that event A happens, event B happens, or both happen.',
      },
      {
        question: 'What formula does the calculator use for union?',
        answer:
          'It uses P(A or B) = P(A) + P(B) - P(A and B), so the overlapping part is not counted twice.',
      },
      {
        question: 'What happens if I leave P(A and B) blank?',
        answer:
          'The calculator assumes the events are independent and uses P(A and B) = P(A) x P(B).',
      },
      {
        question: 'What is a complement?',
        answer:
          'The complement of A is not A. Its probability is 1 - P(A), or 100% minus P(A) when using percentages.',
      },
      {
        question: 'Can probabilities be more than 100%?',
        answer:
          'No. Each probability must be between 0% and 100%, and the final union cannot be more than 100%.',
      },
      {
        question: 'Is my probability history private?',
        answer:
          'Yes. Recent probability answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['permutation-and-combination-calculator', 'sample-size-calculator', 'statistics-calculator'],
  },
  {
    slug: 'statistics-calculator',
    name: 'Statistics Calculator',
    category: 'calculators',
    summary: 'Calculate count, sum, mean, median, mode, range, quartiles, variance, and standard deviation.',
    description:
      'Use this free statistics calculator to summarize a data set with count, sum, mean, median, mode, min, max, range, quartiles, IQR, variance, standard deviation, steps, copy, and history.',
    icon: 'calculator-statistics',
    seoTitle: 'Statistics Calculator | Descriptive Statistics Summary',
    seoDescription:
      'Use the free Access Free Tools statistics calculator to find mean, median, mode, range, quartiles, variance, standard deviation, count, sum, and steps.',
    useCases: [
      'Summarize a list of data values in one result card.',
      'Find center, spread, quartiles, and standard deviation together.',
      'Check homework, class data, survey responses, and measurement lists.',
      'Copy descriptive statistics into notes or reports.',
    ],
    examples: [
      { label: 'Data summary', expression: '10, 12, 12, 15, 18, 21, 21, 21, 25', result: 'Mean = 17.2222222222' },
      { label: 'No repeated values', expression: '4, 8, 15, 16, 23, 42', result: 'No mode' },
      { label: 'Exam scores', expression: '72, 84, 84, 90, 93', result: 'Median = 84' },
    ],
    faq: [
      {
        question: 'What does the Statistics Calculator calculate?',
        answer:
          'It calculates count, sum, mean, median, mode, min, max, range, quartiles, IQR, variance, and standard deviation.',
      },
      {
        question: 'How is the mean calculated?',
        answer:
          'The mean is the sum of all values divided by the number of values.',
      },
      {
        question: 'How is the median calculated?',
        answer:
          'The data is sorted from smallest to largest. The median is the middle value, or the average of the two middle values when there is an even count.',
      },
      {
        question: 'Can a data set have no mode?',
        answer:
          'Yes. This calculator reports no mode when every value appears only once.',
      },
      {
        question: 'What is IQR?',
        answer:
          'IQR means interquartile range. It is Q3 minus Q1 and describes the spread of the middle half of the data.',
      },
      {
        question: 'Is my statistics history private?',
        answer:
          'Yes. Recent statistics answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['mean-median-mode-range-calculator', 'standard-deviation-calculator', 'z-score-calculator'],
  },
  {
    slug: 'mean-median-mode-range-calculator',
    name: 'Mean, Median, Mode, Range Calculator',
    category: 'calculators',
    summary: 'Find the four headline descriptive statistics for a list of numbers.',
    description:
      'Use this free mean, median, mode, range calculator to find the average, middle value, most frequent value, range, sorted data, steps, copy, and history.',
    icon: 'calculator-mean',
    seoTitle: 'Mean, Median, Mode, Range Calculator | Free Data Summary',
    seoDescription:
      'Use the free Access Free Tools mean, median, mode, range calculator to find average, middle value, most frequent values, range, sorted data, and steps.',
    useCases: [
      'Find the average, median, most frequent value, and range quickly.',
      'Check small data sets for school, study, and everyday comparisons.',
      'See sorted data so the median and range are easy to verify.',
      'Copy the four headline statistics into notes or homework.',
    ],
    examples: [
      { label: 'Repeated mode', expression: '10, 12, 12, 15, 18, 21, 21, 21, 25', result: 'Mode = 21' },
      { label: 'No mode', expression: '4, 8, 15, 16, 23, 42', result: 'No mode' },
      { label: 'Simple range', expression: '72, 84, 84, 90, 93', result: 'Range = 21' },
    ],
    faq: [
      {
        question: 'What is the mean?',
        answer:
          'The mean is the arithmetic average. Add all values, then divide by how many values there are.',
      },
      {
        question: 'What is the median?',
        answer:
          'The median is the middle value after the data is sorted. If there are two middle values, their average is the median.',
      },
      {
        question: 'What is the mode?',
        answer:
          'The mode is the most frequent value. A data set can have one mode, multiple modes, or no mode.',
      },
      {
        question: 'What is the range?',
        answer:
          'The range is the maximum value minus the minimum value.',
      },
      {
        question: 'When should I use the full Statistics Calculator?',
        answer:
          'Use the full Statistics Calculator when you also need quartiles, variance, standard deviation, count, or sum.',
      },
      {
        question: 'Is my data history private?',
        answer:
          'Yes. Recent answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['statistics-calculator', 'standard-deviation-calculator', 'z-score-calculator'],
  },
  {
    slug: 'permutation-and-combination-calculator',
    name: 'Permutation and Combination Calculator',
    category: 'calculators',
    summary: 'Calculate nPr and nCr for counting arrangements and selections.',
    description:
      'Use this free permutation and combination calculator to find nPr and nCr with exact integer answers, steps, examples, copy, and history.',
    icon: 'calculator-permutation',
    seoTitle: 'Permutation and Combination Calculator | nPr and nCr',
    seoDescription:
      'Use the free Access Free Tools permutation and combination calculator to calculate nPr and nCr exact integer answers for counting problems.',
    useCases: [
      'Find permutations when order matters.',
      'Find combinations when order does not matter.',
      'Check probability and counting homework examples.',
      'Copy exact nPr and nCr results for notes or study.',
    ],
    examples: [
      { label: 'Choose 3 from 10', expression: '10P3 and 10C3', result: '720 permutations, 120 combinations' },
      { label: 'Cards example', expression: '52C5', result: '2,598,960 combinations' },
      { label: 'Podium order', expression: '8P3', result: '336 permutations' },
    ],
    faq: [
      {
        question: 'What is a permutation?',
        answer:
          'A permutation counts arrangements where order matters. ABC and BAC are different permutations.',
      },
      {
        question: 'What is a combination?',
        answer:
          'A combination counts selections where order does not matter. ABC and BAC are the same combination.',
      },
      {
        question: 'What do n and r mean?',
        answer:
          'n is the total number of items. r is the number of items selected or arranged.',
      },
      {
        question: 'What input range is supported?',
        answer:
          'This calculator supports whole-number n values from 0 to 500 and r values from 0 to n.',
      },
      {
        question: 'How does this connect to probability?',
        answer:
          'Many probability problems use combinations or permutations to count favorable outcomes and total possible outcomes.',
      },
      {
        question: 'Is my counting history private?',
        answer:
          'Yes. Recent nPr and nCr answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['probability-calculator', 'statistics-calculator', 'sample-size-calculator'],
  },
  {
    slug: 'z-score-calculator',
    name: 'Z-score Calculator',
    category: 'calculators',
    summary: 'Calculate a z-score and approximate standard normal percentile.',
    description:
      'Use this free z-score calculator to standardize a value from its mean and standard deviation, see whether it is above or below average, and estimate percentile.',
    icon: 'calculator-z-score',
    seoTitle: 'Z-score Calculator | Standard Score and Percentile',
    seoDescription:
      'Use the free Access Free Tools z-score calculator to calculate standard score, distance from mean, and approximate standard normal percentile.',
    useCases: [
      'Standardize a value using mean and standard deviation.',
      'See how many standard deviations a value is above or below average.',
      'Estimate a percentile under the standard normal curve.',
      'Check statistics, normal distribution, and study examples.',
    ],
    examples: [
      { label: 'Above average', expression: 'x=85, mean=70, SD=10', result: 'z = 1.5' },
      { label: 'At the mean', expression: 'x=70, mean=70, SD=10', result: 'z = 0' },
      { label: 'Below average', expression: 'x=55, mean=70, SD=10', result: 'z = -1.5' },
    ],
    faq: [
      {
        question: 'What is a z-score?',
        answer:
          'A z-score tells how many standard deviations a value is above or below the mean.',
      },
      {
        question: 'What formula does the calculator use?',
        answer:
          'It uses z = (x - mean) / standard deviation, then reports whether the value is above or below the mean.',
      },
      {
        question: 'What does a negative z-score mean?',
        answer:
          'A negative z-score means the value is below the mean. A positive z-score means it is above the mean.',
      },
      {
        question: 'What does the percentile estimate mean?',
        answer:
          'The percentile estimates the area to the left of the z-score on a standard normal curve.',
      },
      {
        question: 'Can the standard deviation be zero?',
        answer:
          'No. A z-score divides by standard deviation, so the standard deviation must be greater than zero.',
      },
      {
        question: 'Is my z-score history private?',
        answer:
          'Yes. Recent z-score answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['standard-deviation-calculator', 'statistics-calculator', 'confidence-interval-calculator'],
  },
  {
    slug: 'confidence-interval-calculator',
    name: 'Confidence Interval Calculator',
    category: 'calculators',
    summary: 'Calculate z confidence intervals for a mean or a proportion.',
    description:
      'Use this free confidence interval calculator to find z confidence intervals for a mean or proportion with margin of error, standard error, point estimate, steps, copy, and history.',
    icon: 'calculator-confidence',
    seoTitle: 'Confidence Interval Calculator | Mean and Proportion CI',
    seoDescription:
      'Use the free Access Free Tools confidence interval calculator to calculate z confidence intervals for a mean or proportion with margin of error and steps.',
    useCases: [
      'Calculate a confidence interval for a mean using standard deviation and sample size.',
      'Calculate a confidence interval for a sample proportion.',
      'Compare common confidence levels from 80% through 99%.',
      'Copy the interval, margin of error, z-score, and point estimate.',
    ],
    examples: [
      { label: 'Mean interval', expression: 'Mean 68, SD 3, n=36, 95%', result: '67.02 to 68.98' },
      { label: 'Proportion interval', expression: '52 successes, n=100, 95%', result: '42.2% to 61.8%' },
      { label: 'Narrower level', expression: 'Mean 68, SD 3, n=36, 90%', result: '67.1775 to 68.8225' },
    ],
    faq: [
      {
        question: 'What is a confidence interval?',
        answer:
          'A confidence interval is a range around a sample estimate that is built to capture a population value at a chosen confidence level.',
      },
      {
        question: 'What interval types are supported?',
        answer:
          'This version supports z intervals for a single mean and a single proportion.',
      },
      {
        question: 'What is margin of error?',
        answer:
          'Margin of error is the amount added to and subtracted from the point estimate to create the lower and upper bounds.',
      },
      {
        question: 'Should I use mean or proportion mode?',
        answer:
          'Use mean mode for numeric averages. Use proportion mode for successes out of a total, such as yes responses or defect counts.',
      },
      {
        question: 'Can this replace advanced statistical software?',
        answer:
          'No. It is a quick educational calculator for common z intervals. Advanced studies may need t intervals, design effects, or exact methods.',
      },
      {
        question: 'Is my confidence interval history private?',
        answer:
          'Yes. Recent confidence interval answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['sample-size-calculator', 'z-score-calculator', 'statistics-calculator'],
  },
  {
    slug: 'triangle-calculator',
    name: 'Triangle Calculator',
    category: 'calculators',
    summary: 'Find triangle area, perimeter, angles, and type from three side lengths.',
    description:
      'Use this free triangle calculator to enter three sides and find area with Heron\'s formula, perimeter, semiperimeter, angles, side type, and angle type.',
    icon: 'calculator-triangle',
    seoTitle: 'Triangle Calculator | Area, Perimeter, and Angles',
    seoDescription:
      'Calculate triangle area, perimeter, semiperimeter, angles, and triangle type from three side lengths with formula steps.',
    useCases: [
      'Find the area of a triangle when you know all three side lengths.',
      'Check whether side lengths form a valid triangle.',
      'Estimate triangle angles with the law of cosines.',
      'Classify triangles as scalene, isosceles, equilateral, acute, right, or obtuse.',
    ],
    examples: [
      { label: 'Classic Heron example', expression: '13, 14, 15', result: 'Area = 84' },
      { label: 'Right triangle', expression: '3, 4, 5', result: 'Area = 6' },
      { label: 'Isosceles triangle', expression: '8, 8, 10', result: 'Area = 31.2249899919' },
    ],
    faq: [
      {
        question: 'What can I use the Triangle Calculator for?',
        answer:
          'Use it to calculate triangle area, perimeter, semiperimeter, angles, and triangle type when you know all three side lengths.',
      },
      {
        question: 'What formula does the Triangle Calculator use?',
        answer:
          'It uses Heron\'s formula for area: s = (a + b + c) / 2, then area = sqrt(s(s-a)(s-b)(s-c)). Angles are estimated with the law of cosines.',
      },
      {
        question: 'Can any three numbers make a triangle?',
        answer:
          'No. The sides must pass the triangle inequality: each pair of sides must add to more than the third side.',
      },
      {
        question: 'Does this replace a right triangle calculator?',
        answer:
          'Use this tool for any triangle from three sides. Use the Right Triangle Calculator or Pythagorean Theorem Calculator when the triangle is known to have a 90-degree angle.',
      },
      {
        question: 'How should I enter units?',
        answer:
          'Enter the same length unit for every side. The calculator reports perimeter in that unit and area in square units.',
      },
      {
        question: 'Is my triangle history private?',
        answer:
          'Yes. Recent triangle answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['area-calculator', 'right-triangle-calculator', 'pythagorean-theorem-calculator'],
  },
  {
    slug: 'volume-calculator',
    name: 'Volume Calculator',
    category: 'calculators',
    summary: 'Calculate volume for boxes, cubes, cylinders, spheres, and cones.',
    description:
      'Use this free volume calculator to find cubic volume for rectangular prisms, cubes, cylinders, spheres, and cones with formula steps and examples.',
    icon: 'calculator-volume',
    seoTitle: 'Volume Calculator | Free Solid Geometry Tool',
    seoDescription:
      'Calculate volume for rectangular prisms, cubes, cylinders, spheres, and cones with cubic units, examples, and formula steps.',
    useCases: [
      'Find volume for common classroom solid geometry problems.',
      'Estimate container, box, cylinder, sphere, or cone capacity.',
      'Compare shape dimensions before copying a result into notes.',
      'Check formula substitutions with clear step-by-step work.',
    ],
    examples: [
      { label: 'Rectangular prism', expression: '8 x 5 x 3', result: '120 cubic units' },
      { label: 'Cylinder', expression: 'r=3, h=10', result: '282.743338823 cubic units' },
      { label: 'Sphere', expression: 'r=4', result: '268.0825731063 cubic units' },
    ],
    faq: [
      {
        question: 'Which shapes are supported?',
        answer:
          'The Volume Calculator supports rectangular prism, cube, cylinder, sphere, and cone modes.',
      },
      {
        question: 'What units should I use?',
        answer:
          'Use the same length unit for every measurement. The calculator reports volume in cubic units, such as cm^3 or in^3.',
      },
      {
        question: 'What formula does cylinder volume use?',
        answer:
          'Cylinder volume uses V = pi r^2 h, where r is radius and h is height.',
      },
      {
        question: 'What formula does cone volume use?',
        answer:
          'Cone volume uses V = pi r^2 h / 3, which is one third of a cylinder with the same radius and height.',
      },
      {
        question: 'Can I calculate surface area here?',
        answer:
          'This tool is for cubic volume. Use the Surface Area Calculator when you need the outside area of a solid.',
      },
      {
        question: 'Is my volume history private?',
        answer:
          'Yes. Recent volume answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['surface-area-calculator', 'area-calculator', 'circle-calculator'],
  },
  {
    slug: 'slope-calculator',
    name: 'Slope Calculator',
    category: 'calculators',
    summary: 'Find slope, rise, run, and a line equation from two points.',
    description:
      'Use this free slope calculator to enter two coordinate points and find rise, run, slope, y-intercept, and a line equation with steps.',
    icon: 'calculator-slope',
    seoTitle: 'Slope Calculator | Find Slope from Two Points',
    seoDescription:
      'Calculate slope from two points with rise, run, y-intercept, vertical-line handling, equation output, and steps.',
    useCases: [
      'Find slope from two coordinate points.',
      'Check rise over run for graphing and algebra homework.',
      'Identify vertical lines with undefined slope.',
      'Write a simple line equation from calculated slope and intercept.',
    ],
    examples: [
      { label: 'Positive slope', expression: '(1, 2) to (5, 10)', result: 'm = 2' },
      { label: 'Negative slope', expression: '(-2, 7) to (4, 1)', result: 'm = -1' },
      { label: 'Vertical line', expression: '(3, 2) to (3, 8)', result: 'Undefined slope' },
    ],
    faq: [
      {
        question: 'What formula does the Slope Calculator use?',
        answer:
          'It uses slope = (y2 - y1) / (x2 - x1), often described as rise over run.',
      },
      {
        question: 'What is an undefined slope?',
        answer:
          'A vertical line has a run of zero because both points have the same x-value. Division by zero is undefined, so the slope is undefined.',
      },
      {
        question: 'Can the two points be the same?',
        answer:
          'No. The two points must be different, or there is no single line direction to calculate.',
      },
      {
        question: 'Does this calculator show the line equation?',
        answer:
          'Yes. For non-vertical lines it shows y = mx + b. For vertical lines it shows x = constant.',
      },
      {
        question: 'Should I use the Distance Calculator instead?',
        answer:
          'Use Slope Calculator for line steepness and equations. Use Distance Calculator for the straight-line length between two points.',
      },
      {
        question: 'Is my slope history private?',
        answer:
          'Yes. Recent slope answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['distance-calculator', 'right-triangle-calculator', 'triangle-calculator'],
  },
  {
    slug: 'area-calculator',
    name: 'Area Calculator',
    category: 'calculators',
    summary: 'Calculate area for rectangles, triangles, circles, trapezoids, and parallelograms.',
    description:
      'Use this free area calculator to find square-unit area for rectangles, triangles, circles, trapezoids, and parallelograms with formula steps.',
    icon: 'calculator-area',
    seoTitle: 'Area Calculator | Rectangle, Triangle, Circle',
    seoDescription:
      'Calculate area for rectangles, triangles, circles, trapezoids, and parallelograms with square units, examples, and steps.',
    useCases: [
      'Find area for common 2D geometry shapes.',
      'Compare rectangle, triangle, circle, trapezoid, and parallelogram measurements.',
      'Check square-unit answers for homework or planning examples.',
      'Copy area results and formula steps into notes.',
    ],
    examples: [
      { label: 'Rectangle', expression: '12 x 8', result: '96 square units' },
      { label: 'Triangle', expression: 'base 10, height 6', result: '30 square units' },
      { label: 'Circle', expression: 'radius 5', result: '78.5398163397 square units' },
    ],
    faq: [
      {
        question: 'Which shapes are supported?',
        answer:
          'The Area Calculator supports rectangle, triangle, circle, trapezoid, and parallelogram modes.',
      },
      {
        question: 'What formula does triangle area use?',
        answer:
          'Triangle area uses A = base x height / 2. If you know three sides instead of base and height, use the Triangle Calculator.',
      },
      {
        question: 'What formula does circle area use?',
        answer:
          'Circle area uses A = pi r^2, where r is the radius. Enter the radius in the same length unit you want squared.',
      },
      {
        question: 'What units should I enter?',
        answer:
          'Use the same length unit for every measurement. The result is reported in square units, such as cm^2 or ft^2.',
      },
      {
        question: 'Can this calculate volume?',
        answer:
          'No. This calculator is for flat 2D area. Use the Volume Calculator for cubic volume.',
      },
      {
        question: 'Is my area history private?',
        answer:
          'Yes. Recent area answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['triangle-calculator', 'circle-calculator', 'volume-calculator'],
  },
  {
    slug: 'distance-calculator',
    name: 'Distance Calculator',
    category: 'calculators',
    summary: 'Find distance, delta x, delta y, and midpoint from two coordinate points.',
    description:
      'Use this free distance calculator to enter two points and find straight-line distance, delta x, delta y, midpoint, and formula steps.',
    icon: 'calculator-distance',
    seoTitle: 'Distance Calculator | Distance Between Two Points',
    seoDescription:
      'Calculate distance between two points with delta x, delta y, midpoint, optional units, examples, and formula steps.',
    useCases: [
      'Find straight-line distance between two coordinate points.',
      'Calculate midpoint while checking coordinate geometry problems.',
      'Compare distance with slope for the same pair of points.',
      'Copy distance formula steps into notes or homework.',
    ],
    examples: [
      { label: '3-4-5 distance', expression: '(1, 2) to (4, 6)', result: '5 units' },
      { label: 'Origin to point', expression: '(0, 0) to (8, 15)', result: '17 units' },
      { label: 'Negative coordinates', expression: '(-3, 4) to (5, -2)', result: '10 units' },
    ],
    faq: [
      {
        question: 'What formula does the Distance Calculator use?',
        answer:
          'It uses d = sqrt((x2 - x1)^2 + (y2 - y1)^2), the standard distance formula for two points in a plane.',
      },
      {
        question: 'Does it show midpoint?',
        answer:
          'Yes. It shows midpoint as ((x1 + x2) / 2, (y1 + y2) / 2).',
      },
      {
        question: 'Can I use negative coordinates?',
        answer:
          'Yes. Negative x and y values are accepted as long as each coordinate is a valid number.',
      },
      {
        question: 'Should I use this or the Slope Calculator?',
        answer:
          'Use Distance Calculator for length between points. Use Slope Calculator for steepness, rise, run, and line equations.',
      },
      {
        question: 'What units does the answer use?',
        answer:
          'The answer uses the unit label you enter. If your coordinates are in meters, the distance is in meters.',
      },
      {
        question: 'Is my distance history private?',
        answer:
          'Yes. Recent distance answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['slope-calculator', 'pythagorean-theorem-calculator', 'right-triangle-calculator'],
  },
  {
    slug: 'circle-calculator',
    name: 'Circle Calculator',
    category: 'calculators',
    summary: 'Find radius, diameter, circumference, and area from one circle measurement.',
    description:
      'Use this free circle calculator to start from radius, diameter, circumference, or area and find the other circle measurements with steps.',
    icon: 'calculator-circle',
    seoTitle: 'Circle Calculator | Radius, Diameter, Area',
    seoDescription:
      'Calculate circle radius, diameter, circumference, and area from one known value with formula steps and examples.',
    useCases: [
      'Convert radius into diameter, circumference, and area.',
      'Work backward from diameter, circumference, or area.',
      'Check circle formulas for geometry class or quick planning.',
      'Copy circle measurements and formula steps into notes.',
    ],
    examples: [
      { label: 'Known radius', expression: 'r = 5', result: 'Area = 78.5398163397' },
      { label: 'Known diameter', expression: 'd = 10', result: 'Radius = 5' },
      { label: 'Known circumference', expression: 'C = 31.4159', result: 'Radius is about 5' },
    ],
    faq: [
      {
        question: 'What circle measurements can I start with?',
        answer:
          'You can start with radius, diameter, circumference, or area. The calculator finds the remaining circle measurements.',
      },
      {
        question: 'What formulas does the Circle Calculator use?',
        answer:
          'It uses d = 2r, C = 2pi r, and A = pi r^2. It rearranges those formulas when you start from diameter, circumference, or area.',
      },
      {
        question: 'What is the difference between radius and diameter?',
        answer:
          'Radius is the distance from the center to the circle edge. Diameter is the full distance across the circle through the center, so diameter is twice the radius.',
      },
      {
        question: 'Can I enter area to find radius?',
        answer:
          'Yes. Area mode uses r = sqrt(A / pi) to work backward from a known area.',
      },
      {
        question: 'Should I use Area Calculator instead?',
        answer:
          'Use Circle Calculator when you want all circle measurements. Use Area Calculator when you only need area for one of several common shapes.',
      },
      {
        question: 'Is my circle history private?',
        answer:
          'Yes. Recent circle answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['area-calculator', 'surface-area-calculator', 'volume-calculator'],
  },
  {
    slug: 'surface-area-calculator',
    name: 'Surface Area Calculator',
    category: 'calculators',
    summary: 'Calculate surface area for boxes, cubes, cylinders, spheres, and cones.',
    description:
      'Use this free surface area calculator to find outside area for rectangular prisms, cubes, cylinders, spheres, and cones with formula steps.',
    icon: 'calculator-surface-area',
    seoTitle: 'Surface Area Calculator | Solid Geometry Tool',
    seoDescription:
      'Calculate surface area for rectangular prisms, cubes, cylinders, spheres, and cones with square units, examples, and steps.',
    useCases: [
      'Find the outside area of common 3D solids.',
      'Compare surface area for boxes, cylinders, spheres, and cones.',
      'Check square-unit answers for geometry homework.',
      'Copy formulas and results into notes while comparing shapes.',
    ],
    examples: [
      { label: 'Rectangular prism', expression: '8 x 5 x 3', result: '158 square units' },
      { label: 'Sphere', expression: 'r=4', result: '201.06192983 square units' },
      { label: 'Cylinder', expression: 'r=3, h=10', result: '245.04422698 square units' },
    ],
    faq: [
      {
        question: 'Which shapes are supported?',
        answer:
          'The Surface Area Calculator supports rectangular prism, cube, cylinder, sphere, and cone modes.',
      },
      {
        question: 'What units should I use?',
        answer:
          'Use the same length unit for every measurement. The result is reported in square units, such as cm^2 or ft^2.',
      },
      {
        question: 'How does cone surface area work?',
        answer:
          'Cone surface area uses pi r(r + l). This calculator finds slant height l from radius and vertical height using the Pythagorean theorem.',
      },
      {
        question: 'What is the difference between surface area and volume?',
        answer:
          'Surface area measures the outside of a solid in square units. Volume measures the space inside a solid in cubic units.',
      },
      {
        question: 'Can this calculate flat 2D shapes?',
        answer:
          'Use the Area Calculator for flat shapes such as rectangles, triangles, circles, trapezoids, and parallelograms.',
      },
      {
        question: 'Is my surface area history private?',
        answer:
          'Yes. Recent surface area answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['volume-calculator', 'area-calculator', 'circle-calculator'],
  },
  {
    slug: 'pythagorean-theorem-calculator',
    name: 'Pythagorean Theorem Calculator',
    category: 'calculators',
    summary: 'Solve a missing right-triangle side with a^2 + b^2 = c^2.',
    description:
      'Use this free Pythagorean theorem calculator to solve for the hypotenuse or a missing leg of a right triangle with steps and examples.',
    icon: 'calculator-pythagorean',
    seoTitle: 'Pythagorean Theorem Calculator | Solve a Side',
    seoDescription:
      'Solve a missing right-triangle side using a^2 + b^2 = c^2 with hypotenuse, leg, examples, and formula steps.',
    useCases: [
      'Find the hypotenuse when both legs are known.',
      'Find a missing leg when one leg and the hypotenuse are known.',
      'Check right triangle side lengths for homework.',
      'Copy formula steps for Pythagorean theorem practice.',
    ],
    examples: [
      { label: 'Find c', expression: 'a=3, b=4', result: 'c = 5' },
      { label: 'Find a', expression: 'b=12, c=13', result: 'a = 5' },
      { label: 'Find b', expression: 'a=8, c=17', result: 'b = 15' },
    ],
    faq: [
      {
        question: 'What formula does the calculator use?',
        answer:
          'It uses the Pythagorean theorem: a^2 + b^2 = c^2, where c is the hypotenuse of a right triangle.',
      },
      {
        question: 'Can it solve for a missing leg?',
        answer:
          'Yes. If you know the hypotenuse and one leg, it subtracts the known leg squared from the hypotenuse squared, then takes the square root.',
      },
      {
        question: 'Does the Pythagorean theorem work for every triangle?',
        answer:
          'No. It only applies to right triangles with one 90-degree angle.',
      },
      {
        question: 'What if the hypotenuse is shorter than a leg?',
        answer:
          'That input is invalid for a right triangle. The hypotenuse must be the longest side.',
      },
      {
        question: 'Should I use the Right Triangle Calculator instead?',
        answer:
          'Use this tool when you only need a missing side. Use the Right Triangle Calculator when you also want area, perimeter, and angles.',
      },
      {
        question: 'Is my Pythagorean history private?',
        answer:
          'Yes. Recent Pythagorean answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['right-triangle-calculator', 'distance-calculator', 'triangle-calculator'],
  },
  {
    slug: 'right-triangle-calculator',
    name: 'Right Triangle Calculator',
    category: 'calculators',
    summary: 'Solve right triangle sides, area, perimeter, and acute angles.',
    description:
      'Use this free right triangle calculator to enter two sides and find the missing side, area, perimeter, hypotenuse, and acute angles.',
    icon: 'calculator-right-triangle',
    seoTitle: 'Right Triangle Calculator | Sides, Area, Angles',
    seoDescription:
      'Solve right triangle sides, hypotenuse, area, perimeter, and acute angles from two known sides with formula steps.',
    useCases: [
      'Complete a right triangle from two known side lengths.',
      'Find hypotenuse, missing leg, area, perimeter, and angles together.',
      'Check 3-4-5, 5-12-13, and other right-triangle examples.',
      'Copy right-triangle formula steps into notes or homework.',
    ],
    examples: [
      { label: 'Two legs', expression: 'a=9, b=12', result: 'c = 15' },
      { label: 'Leg and hypotenuse', expression: 'leg=5, c=13', result: 'missing leg = 12' },
      { label: 'Classic 3-4-5', expression: 'a=3, b=4', result: 'Area = 6' },
    ],
    faq: [
      {
        question: 'What does the Right Triangle Calculator find?',
        answer:
          'It finds the missing side, hypotenuse, area, perimeter, and the two acute angles for a right triangle.',
      },
      {
        question: 'What inputs can I use?',
        answer:
          'Use two legs mode when both legs are known. Use leg and hypotenuse mode when you know one leg and the hypotenuse.',
      },
      {
        question: 'How are the angles calculated?',
        answer:
          'After the sides are known, the calculator uses sine ratios to estimate the two acute angles. The third angle is always 90 degrees.',
      },
      {
        question: 'What formula is used for area?',
        answer:
          'Right triangle area uses A = leg a x leg b / 2 because the two legs are perpendicular base and height.',
      },
      {
        question: 'How is this different from the Pythagorean Theorem Calculator?',
        answer:
          'The Pythagorean tool focuses on one missing side. This calculator also shows area, perimeter, and angles.',
      },
      {
        question: 'Is my right triangle history private?',
        answer:
          'Yes. Recent right triangle answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['pythagorean-theorem-calculator', 'triangle-calculator', 'distance-calculator'],
  },
  {
    slug: 'random-number-generator',
    name: 'Random Number Generator',
    category: 'everyday-tools',
    summary: 'Generate random numbers in a custom range, with unique, sorted, and copied results.',
    description:
      'Use this free random number generator to create one or many random integers with custom minimum and maximum values, optional unique results, exclusions, sorting, copy, and history.',
    icon: 'random-dice',
    seoTitle: 'Random Number Generator | Free Online Number Picker',
    seoDescription:
      'Pick one or many random integers with min and max values, unique results, exclusions, sorting, copy, and private history.',
    useCases: [
      'Pick a random number for a classroom activity, game, raffle practice, or quick decision.',
      'Generate several random values at once for examples, testing, or simple lists.',
      'Choose unique numbers without repeats when each result should only appear once.',
      'Exclude specific numbers and sort the final list before copying it.',
    ],
    examples: [
      {
        label: 'Pick one number',
        expression: '1 to 10',
        result: 'One random integer from 1 through 10',
      },
      {
        label: 'Generate a list',
        expression: '5 numbers from 1 to 100',
        result: 'Five random integers, duplicates allowed',
      },
      {
        label: 'Unique sorted numbers',
        expression: '6 unique numbers from 1 to 50',
        result: 'A sorted list with no repeated numbers',
      },
    ],
    faq: [
      {
        question: 'What can I use the Random Number Generator for?',
        answer:
          'Use it for everyday number picks, classroom examples, simple games, practice raffles, testing sample values, or choosing a random item from a numbered list.',
      },
      {
        question: 'Can I generate more than one random number?',
        answer:
          'Yes. Set Quantity to the number of results you want. The generator can create one number or a list of random numbers in the same range.',
      },
      {
        question: 'What does unique results mean?',
        answer:
          'Unique results means the same number will not appear twice in one generated list. If you turn off duplicates, the quantity must fit inside the available range after exclusions.',
      },
      {
        question: 'Can I exclude numbers?',
        answer:
          'Yes. Enter excluded numbers separated by commas, spaces, or semicolons. Numbers outside the selected range are ignored.',
      },
      {
        question: 'Is this random number generator safe for high-stakes use?',
        answer:
          'It tries to use browser cryptographic random values when available and maps them into your range without modulo bias. It can fall back to normal browser randomness, so it is still for everyday picks, examples, and practice. Do not use it for passwords, gambling, legal drawings, security decisions, or any process that needs audited randomness.',
      },
      {
        question: 'Is my random number history private?',
        answer:
          'Yes. Recent random results stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['basic-calculator', 'percentage-calculator', 'fraction-calculator'],
  },
  ...mathExpansionTools,
  ...financeTools,
  ...healthTools,
  ...utilityTools,
  ...aiTools,
];

function hasFaqQuestionMatching(tool: ToolDefinition, pattern: RegExp) {
  return tool.faq.some((faq) => pattern.test(faq.question));
}

function getCategoryInputAnswer(tool: ToolDefinition) {
  switch (tool.category) {
    case 'finance':
      return 'Money tools are picky about labels. Enter dollar fields as dollars, rate fields as percentages like 6.5 instead of 0.065, and time fields in the years or months shown on the page. If a field says monthly, do not enter a yearly total unless the tool says to.';
    case 'health-fitness':
      return 'Use the body, activity, date, or health values exactly in the units shown on the page. Height, weight, age, sex, time, and activity level can change the answer a lot, so treat each label like a rule and read the result as an educational estimate.';
    case 'date-time':
      return 'The main inputs are dates, times, time zones, or hour values. Check the calendar day, the year, and whether the page expects a start and end value. One wrong day can change the answer even when the math looks right.';
    case 'converters':
      return 'The main inputs are the value you want to convert and the from/to units or formats. Keep the original value in the first field, choose the target unit carefully, and watch for small details like decimal places, bytes versus bits, or uppercase versus lowercase text.';
    case 'developer-tools':
      return 'The main inputs are usually text, code, a URL, a number base, or a mode setting. Paste only the part you want the tool to work on, choose encode/decode or format/clean modes carefully, and compare the output with the examples before using it somewhere important.';
    case 'text-tools':
      return 'The main input is the text you want to count, clean, format, or rewrite. Paste the exact text you want changed, then check whether spaces, punctuation, line breaks, or capitalization should be kept before copying the result.';
    case 'image-tools':
      return 'The main inputs are the image file and the size, format, quality, or crop settings. Check width and height labels before applying changes so you do not accidentally stretch, shrink, or export the wrong version.';
    case 'ai-tools':
      return 'The main inputs are the text or image you want the browser AI helper to check. Keep sensitive information out unless it is truly needed, and remember that model or language files may download only after you press the action button.';
    case 'home-projects':
      return 'The main inputs are the project measurements, material coverage, spacing, waste percent, and unit choices. Measure in the same unit the whole way through, add realistic waste for cuts or mistakes, and treat the result as a shopping estimate.';
    case 'school-study':
      return 'The main inputs are the scores, values, times, or study settings the page asks for. Enter each number in the same scale shown by the label, then use the examples to check whether your answer makes sense.';
    case 'everyday-tools':
      return 'The main inputs are the everyday values, options, or settings the tool needs before it can help. Read each label literally, keep units consistent, and rerun the example if the answer looks surprising.';
    case 'calculators':
    default:
      return 'The main inputs are the numbers, operation, mode, or known values the calculator needs. Keep units consistent, enter percentages the way the page label shows, and use the examples as a quick check before trusting the answer.';
  }
}

function getCategoryReadingAnswer(tool: ToolDefinition) {
  switch (tool.category) {
    case 'finance':
      return 'Start with the headline number, then look at the supporting lines for interest, principal, taxes, fees, payments, or totals over time. Those extra lines explain why two answers that look close can cost very different amounts later.';
    case 'health-fitness':
      return 'Read the result as a learning number, not a final decision about your body or health. The supporting lines may show categories, ranges, calories, dates, or targets, but they still need personal context and professional advice for important choices.';
    case 'home-projects':
      return 'Read the headline estimate first, then check the material, waste, coverage, and unit lines. For project tools, the supporting lines are often the difference between a rough idea and a list you can actually shop from.';
    case 'developer-tools':
    case 'converters':
      return 'Read the output next to your original input. If the tool changes format, units, encoding, spacing, or capitalization, compare a small sample before copying the whole result into another app.';
    case 'text-tools':
      return 'Read the output next to your original text. If the tool changes spacing, line breaks, encoding, capitalization, or word breaks, compare a small sample before copying the whole result into another app.';
    case 'ai-tools':
      return 'Read the AI result as a best-effort clue or draft. Look at labels, scores, notes, and warnings together, then compare the result with the original text or image before using it anywhere important.';
    default:
      return 'Start with the result card, then check the supporting lines and examples to understand how the calculator got there. If one input changes, rerun the tool and compare the new answer instead of guessing.';
  }
}

function getCategoryDoubleCheckAnswer(tool: ToolDefinition) {
  switch (tool.category) {
    case 'finance':
      return 'Check rates, time periods, payment frequency, fees, and whether values are before tax or after tax. Mixing monthly and yearly numbers is the classic mistake because the final answer can still look believable.';
    case 'health-fitness':
      return 'Check units, dates, and personal details before reading the result. Pounds versus kilograms, inches versus centimeters, or a wrong activity level can change the answer fast.';
    case 'home-projects':
      return 'Check every measurement, unit, coverage number, and waste percent before buying materials. A small measuring mistake can turn into extra cost, extra trips, or not enough material for the job.';
    case 'developer-tools':
      return 'Check that you picked the right mode, especially encode versus decode or format versus minify. Also make sure you are not pasting private keys, passwords, or sensitive data into any page you do not need to use.';
    case 'ai-tools':
      return 'Check short inputs, blurry images, sarcasm, mixed-language text, low confidence scores, and important names or numbers yourself. Browser AI can be useful and still be wrong.';
    default:
      return 'Check units, signs, rounding, and the selected mode before copying the answer. If the number feels weird, rerun one of the examples first, then put your own values back in slowly.';
  }
}

function enhanceToolFaq(tool: ToolDefinition): ToolDefinition {
  const faq = [...tool.faq];

  if (!hasFaqQuestionMatching(tool, /main .*inputs/i)) {
    faq.splice(Math.min(2, faq.length), 0, {
      question: `What do the main ${tool.name} inputs mean?`,
      answer: getCategoryInputAnswer(tool),
    });
  }

  if (!hasFaqQuestionMatching({ ...tool, faq }, /how should i read|read the .*answer|read the .*result/i)) {
    faq.splice(Math.min(3, faq.length), 0, {
      question: `How should I read the ${tool.name} answer?`,
      answer: getCategoryReadingAnswer(tool),
    });
  }

  if (!hasFaqQuestionMatching({ ...tool, faq }, /double-check|before trusting|before copying|common mistake/i)) {
    faq.splice(Math.min(4, faq.length), 0, {
      question: `What should I double-check before trusting the ${tool.name}?`,
      answer: getCategoryDoubleCheckAnswer(tool),
    });
  }

  return { ...tool, faq };
}

export const tools: ToolDefinition[] = baseTools.map(enhanceToolFaq);

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(categorySlug: string) {
  return tools.filter((tool) => tool.category === categorySlug);
}

export function getCategoryName(categorySlug: string) {
  return categories.find((category) => category.slug === categorySlug)?.name ?? categorySlug;
}

export function getRelatedTools(tool: ToolDefinition) {
  if (tool.relatedSlugs.length === 0) {
    return tools
      .filter((candidate) => candidate.category === tool.category && candidate.slug !== tool.slug)
      .slice(0, 3);
  }

  return tool.relatedSlugs
    .map((slug) => tools.find((candidate) => candidate.slug === slug))
    .filter((candidate): candidate is ToolDefinition => Boolean(candidate));
}
