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
    relatedSlugs: ['percent-error-calculator', 'basic-calculator', 'fraction-calculator'],
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
      'Use the free Access Free Tools percent error calculator to compare measured and accepted values, find absolute percent error, signed percent error, absolute error, relative error, and steps.',
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
      'Use this free half-life calculator to find remaining amount, elapsed time, or half-life from initial and final amounts with formulas, percentages, steps, copy, and history.',
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
        result: '12.5 mg remaining',
      },
      {
        label: 'Find elapsed time',
        expression: '80 g to 10 g, half-life 12 hours',
        result: '36 hours',
      },
      {
        label: 'Find half-life',
        expression: '100 g to 25 g in 10 days',
        result: '5 days',
      },
    ],
    faq: [
      {
        question: 'What formula does the Half-Life Calculator use?',
        answer:
          'For remaining amount, it uses remaining amount = initial amount x (1/2)^(elapsed time / half-life). It also rearranges that formula to solve for elapsed time or half-life.',
      },
      {
        question: 'What is a half-life?',
        answer:
          'A half-life is the time it takes for a quantity to decrease to half of its starting amount under exponential decay.',
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
        question: 'Do the units matter?',
        answer:
          'Yes. Keep elapsed time and half-life in the same time unit, such as hours with hours or years with years. The amount unit is only a label and should match between initial and final amounts.',
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
    relatedSlugs: ['scientific-calculator', 'exponent-calculator', 'percentage-calculator'],
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
      'Use the free Access Free Tools exponent calculator to calculate base to a power, including positive, negative, zero, decimal, and simple fraction exponents with steps and scientific notation.',
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
    relatedSlugs: ['scientific-calculator', 'half-life-calculator', 'binary-calculator'],
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
    relatedSlugs: ['exponent-calculator', 'half-life-calculator', 'binary-calculator'],
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
    relatedSlugs: ['percentage-calculator', 'binary-calculator', 'scientific-calculator'],
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
