import { categories, type CategorySlug } from './categories';

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
  seoTitle: string;
  seoDescription: string;
  useCases: string[];
  examples: ToolExample[];
  faq: ToolFaq[];
  relatedSlugs: string[];
}

export const tools: ToolDefinition[] = [
  {
    slug: 'basic-calculator',
    name: 'Basic Calculator',
    category: 'calculators',
    summary: 'A clean online calculator for quick everyday math.',
    description:
      'Use this free basic calculator for addition, subtraction, multiplication, division, percentages, decimals, and quick result copying.',
    icon: 'calculator-plus',
    seoTitle: 'Basic Calculator | Free Online Calculator',
    seoDescription:
      'Use the free Access Free Tools basic calculator for everyday math, percentages, decimals, keyboard input, and quick result copying.',
    useCases: [
      'Check a total while shopping or planning a budget.',
      'Work through simple homework or study calculations.',
      'Calculate percentages, discounts, and quick comparisons.',
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
      'Use the free Access Free Tools percentage calculator to find percent of a number, what percent one value is of another, percentage change, discounts, markups, and reverse percentages.',
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
    relatedSlugs: ['basic-calculator', 'fraction-calculator', 'scientific-calculator'],
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
    ],
    relatedSlugs: ['basic-calculator', 'percentage-calculator', 'fraction-calculator'],
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
      'Use the free Access Free Tools fraction calculator to add, subtract, multiply, divide, simplify, and convert fractions, mixed numbers, improper fractions, and decimals.',
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
    relatedSlugs: ['percentage-calculator', 'basic-calculator', 'scientific-calculator'],
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
      'Use the free Access Free Tools random number generator to pick one or many random integers with min and max values, unique results, exclusions, sorting, copy, and private in-browser history.',
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
          'It uses browser random values for everyday utility use, but it is not meant for passwords, gambling, legal drawings, security decisions, or any high-stakes process that needs audited randomness.',
      },
      {
        question: 'Is my random number history private?',
        answer:
          'Yes. Recent random results stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['basic-calculator', 'percentage-calculator', 'fraction-calculator'],
  },
];

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
