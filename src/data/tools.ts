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
    summary: 'A clean browser calculator for quick arithmetic, percent checks, and copied results.',
    description:
      'Use this free basic calculator online for addition, subtraction, multiplication, division, percent adjustments, decimals, keyboard input, result copying, and short tab-only history.',
    icon: 'calculator-plus',
    aliases: [
      'Free Online Calculator',
      'Basic Calculator Online Free',
      'Basic Calculator Online',
      'Large Online Calculator',
      'Full Screen Calculator',
      'Simple Basic Calculator',
    ],
    seoTitle: 'Basic Calculator Online | Free Large Calculator',
    seoDescription:
      'Use the free basic calculator online to add, subtract, multiply, divide, check percents, copy answers, and keep a short tab-only history.',
    useCases: [
      'Add receipt, invoice, or budget lines without opening a spreadsheet.',
      'Subtract a discount, tax estimate, or quick percent adjustment.',
      'Split a bill, order total, or homework answer into equal parts.',
      'Use the keyboard or large buttons when you want a simple browser calculator.',
      'Copy the current answer and keep the last few calculations visible in the same tab.',
    ],
    examples: [
      {
        label: 'Add two receipt lines',
        expression: '48.50 + 12.25',
        result: '60.75 total before tax',
      },
      {
        label: 'Take 20% off 80',
        expression: '80 - 20%',
        result: '64 after the discount',
      },
      {
        label: 'Split a 126 total',
        expression: '126 / 3',
        result: '42 each',
      },
    ],
    faq: [
      {
        question: 'What can I use the Basic Calculator for?',
        answer:
          'Use it for everyday arithmetic: adding totals, subtracting costs, multiplying quantities, dividing amounts, checking simple percentages, copying answers, and keeping recent results in view.',
      },
      {
        question: 'How does the percent button work?',
        answer:
          'For a plain number, percent turns the current entry into a decimal percentage. During plus or minus calculations, it uses the first number as the base. In 80 - 20%, the percent key turns 20 into 16, then equals shows 64.',
      },
      {
        question: 'Can I use keyboard shortcuts?',
        answer:
          'Yes. Use number keys, +, -, *, /, x, Enter or =, decimal point, percent, Backspace, Escape, and Delete. The on-screen buttons work the same way.',
      },
      {
        question: 'Does it follow full order of operations?',
        answer:
          'No. This basic calculator works like a simple handheld calculator. It solves the current two-number step when you press the next operator or equals. Use the Scientific Calculator when you need parentheses, powers, trigonometry, or full expressions.',
      },
      {
        question: 'Can I use this as a large online calculator?',
        answer:
          'Yes. The calculator is designed to be easy to read in the browser, with a large display, clear buttons, keyboard input, copy result, and no app install. Use browser zoom or full-screen mode if you want it bigger.',
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
      {
        question: 'Why can a long decimal look shorter?',
        answer:
          'The display rounds long floating-point answers so they stay readable. If you need exact large-integer math, use the Big Number Calculator. If you need fractions, use the Fraction Calculator.',
      },
    ],
    relatedSlugs: ['percentage-calculator', 'fraction-calculator', 'scientific-calculator', 'big-number-calculator'],
  },
  {
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    category: 'calculators',
    summary: 'Find percent-of answers, percent change, discounts, markups, and reverse percentages.',
    description:
      'Use this free percentage calculator to answer percent-of questions, compare percentage change, add or subtract a percent, and work backward from a known percent.',
    icon: 'calculator-percent',
    seoTitle: 'Percentage Calculator | Percent Change, Discounts, Reverse',
    seoDescription:
      'Use the free percentage calculator for percent of a number, percentage increase or decrease, discounts, markups, reverse percentages, and formula steps.',
    aliases: ['Percent Calculator', 'Percentage Change Calculator', 'Percentage Increase Calculator'],
    useCases: [
      'Find 18% of 240, 20% of 80, or another percent-of answer.',
      'Check whether a value went up or down and by what percent.',
      'Add or subtract a percent for discounts, markups, tax, tips, or growth.',
      'Work backward when you know the part and the percent but not the original whole.',
    ],
    examples: [
      {
        label: 'Find percent of a number',
        expression: '18% of 240',
        result: '43.2',
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
      {
        label: 'Add a markup',
        expression: '120 plus 25%',
        result: '150',
      },
      {
        label: 'Reverse the percent',
        expression: '30 is 15% of what?',
        result: '200',
      },
    ],
    faq: [
      {
        question: 'What can I use the Percentage Calculator for?',
        answer:
          'Use it when the question has a percent sign in it: percent of a number, what percent one number is of another, percent increase or decrease, discounts, markups, tips, tax, and reverse percentage problems.',
      },
      {
        question: 'What do the main Percentage Calculator inputs mean?',
        answer:
          'Pick the mode first: percent of, what percent, percent change, add/subtract percent, or reverse percent. Then enter the part, whole, original value, new value, or percent rate that matches that mode. A discount, tip, tax, markup, and reverse-percent question all use different boxes, so do not swap the part and the whole.',
      },
      {
        question: 'How do I find a percentage of a number?',
        answer:
          'Choose Percent of a number, enter the percentage and the value, then calculate. For example, 18% of 240 is 43.2 because 240 x 0.18 = 43.2.',
      },
      {
        question: 'How is percentage change calculated?',
        answer:
          'Percentage change compares the difference with the original value: (new value - original value) / original value x 100. If 160 drops to 116, the change is -44, so the result is a 27.5% decrease.',
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
        question: 'What mistake gives the wrong percent change?',
        answer:
          'Using the new value as the original value changes the answer. If a price moves from 160 to 116, 160 is the starting point. Reversing those numbers answers a different question.',
      },
      {
        question: 'When should I use a different calculator?',
        answer:
          'Use the Percent Off Calculator for a quick sale-price check, the Sales Tax Calculator for tax after a price, the Tip Calculator for restaurant bills, and the Percent Error Calculator for lab or measurement comparisons.',
      },
      {
        question: 'Is my percentage history private?',
        answer:
          'Yes. Recent percentage answers stay only in the current browser tab while you use the page. They are not sent to a server, and refreshing or closing the tab clears the short history.',
      },
    ],
    relatedSlugs: ['percent-off-calculator', 'sales-tax-calculator', 'tip-calculator', 'percent-error-calculator'],
  },
  {
    slug: 'ratio-calculator',
    name: 'Ratio Calculator',
    category: 'calculators',
    summary: 'Simplify ratios, scale matching ratios, and split totals by ratio parts.',
    description:
      'Use this free ratio calculator to simplify two-part or three-part ratios, scale equivalent ratios, split totals by a ratio, and see the work step by step.',
    icon: 'calculator-ratio',
    seoTitle: 'Ratio Calculator | Simplify, Scale, Split Ratios',
    seoDescription:
      'Use the free ratio calculator to simplify ratios, solve equivalent ratios, split totals by ratio parts, handle decimals, and check the steps.',
    aliases: ['Ratio Solver', 'Simplify Ratio Calculator', 'Equivalent Ratio Calculator', '1:2 Ratio Calculator'],
    useCases: [
      'Simplify ratios such as 12:18 into lowest terms.',
      'Scale a 1:2, 4:7, or 3-part ratio when one part changes.',
      'Split a total amount into shares, such as 120 split by 2:3.',
      'Compare recipes, mixtures, pixels, map sizes, classroom examples, and proportional relationships.',
      'Clear decimals first, then check that every part still uses the same unit.',
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
        expression: '120 split by 2:3',
        result: '48, 72',
      },
      {
        label: 'Clear a decimal ratio',
        expression: '1.5:2.25',
        result: '2:3',
      },
    ],
    faq: [
      {
        question: 'What can I use the Ratio Calculator for?',
        answer:
          'Use it to simplify ratios, scale a ratio into an equivalent ratio, or split a total amount into parts based on a ratio. It works best when all parts use the same unit.',
      },
      {
        question: 'What do the Ratio Calculator inputs mean?',
        answer:
          'In Simplify mode, enter the ratio parts you already have. In Equivalent mode, enter the old ratio and the new known part. In Split total mode, enter the ratio parts and the total amount you want to divide.',
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
          'Choose Split total, enter the ratio parts and the total. The calculator adds the ratio parts, finds the value of one part, then multiplies each part by that value. For 120 split by 2:3, one part is 24, so the shares are 48 and 72.',
      },
      {
        question: 'Can ratios include decimals?',
        answer:
          'Yes. Decimal ratio parts are accepted in Simplify and Split total modes. The calculator converts them to whole-number parts before simplifying, so 1.5:2.25 becomes 150:225, then 2:3.',
      },
      {
        question: 'What mistake changes a ratio answer?',
        answer:
          'Changing the order changes the meaning. A 2:3 mix is not the same as a 3:2 mix. Also convert units first, such as ml to ml or pixels to pixels, before simplifying.',
      },
      {
        question: 'When should I use a different calculator?',
        answer:
          'Use the Percentage Calculator when the question asks for a percent, the Fraction Calculator when you need fraction arithmetic, and the Aspect Ratio Calculator when you are resizing images or screens by width and height.',
      },
      {
        question: 'Is my ratio history private?',
        answer:
          'Yes. Recent ratio answers stay only in the current browser tab while you use the page. They are not sent to a server, and closing or refreshing the tab clears the short history.',
      },
    ],
    relatedSlugs: ['percentage-calculator', 'fraction-calculator', 'aspect-ratio-calculator', 'unit-price-calculator'],
  },
  {
    slug: 'percent-error-calculator',
    name: 'Percent Error Calculator',
    category: 'calculators',
    summary: 'Compare your measured value with the accepted value, then see percent error and direction.',
    description:
      'Use this free percent error calculator to check a lab result, class measurement, or estimate against an accepted value. It shows absolute percent error, signed percent error, absolute error, relative error, and clear steps.',
    icon: 'calculator-error',
    seoTitle: 'Percent Error Calculator | Measured vs Accepted Value',
    seoDescription:
      'Enter measured and accepted values to find absolute percent error, signed percent error, absolute error, relative error, and step-by-step work.',
    aliases: [
      'Percentage Error Calculator',
      'Percent Error Formula Calculator',
      'Measured vs Accepted Value Calculator',
      'Absolute Percent Error Calculator',
    ],
    useCases: [
      'Check a chemistry or physics lab result against the accepted value from a table, teacher, or reference.',
      'See whether your measured value was too high, too low, or exactly on target.',
      'Show the percent error formula steps before adding the result to homework or a lab report draft.',
      'Compare values only after the units match, such as grams with grams or centimeters with centimeters.',
      'Copy the answer with absolute error and signed percent error for notes.',
    ],
    examples: [
      {
        label: 'Density lab check',
        expression: 'Measured 2.45 g/cm3 vs accepted 2.70 g/cm3',
        result: '9.2593% error, signed -9.2593%',
      },
      {
        label: 'Length measurement',
        expression: 'Measured 48 cm vs accepted 50 cm',
        result: '4% error, signed -4%',
      },
      {
        label: 'High volume reading',
        expression: 'Measured 105 mL vs accepted 100 mL',
        result: '5% error, signed +5%',
      },
      {
        label: 'Boiling point check',
        expression: 'Measured 99.1 C vs accepted 100 C',
        result: '0.9% error, signed -0.9%',
      },
    ],
    faq: [
      {
        question: 'What formula does the Percent Error Calculator use?',
        answer:
          'It uses absolute percent error: |measured value - accepted value| / |accepted value| x 100. The signed result keeps the plus or minus direction before the absolute value is taken.',
      },
      {
        question: 'What is the accepted value?',
        answer:
          'The accepted value is the reference value you are comparing against. In a lab, it might come from a textbook, a data table, a teacher-provided number, or a known standard.',
      },
      {
        question: 'What is the measured value?',
        answer:
          'The measured value is the number you observed, tested, calculated, or recorded. Put this in the first box, then put the reference value in the accepted-value box.',
      },
      {
        question: 'Can percent error be negative?',
        answer:
          'Standard percent error is usually positive because it uses absolute error. The signed percent error can be negative or positive. Negative means your measured value was low. Positive means it was high.',
      },
      {
        question: 'Why can the accepted value not be zero?',
        answer:
          'Percent error divides by the accepted value. If the accepted value is zero, the calculator cannot make a percentage comparison, so it asks for a nonzero accepted value.',
      },
      {
        question: 'Do the units matter?',
        answer:
          'Yes. Convert the values to the same unit first. Do not compare 48 cm with 0.5 m until they both use centimeters or both use meters. The unit label only helps you read the answer.',
      },
      {
        question: 'Is percent error the same as uncertainty?',
        answer:
          'No. Percent error compares one result with an accepted value. Uncertainty explains how much trust to put in a measurement. In a serious lab report, include uncertainty if your class or lab asks for it.',
      },
      {
        question: 'Is my percent error history private?',
        answer:
          'Yes. Recent percent error calculations stay only in the current browser tab while you use the page. They are not sent to a server, and closing or refreshing the tab clears the short history.',
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
    summary: 'Calculate powers, zero and negative exponents, simple fraction exponents, and scientific notation.',
    description:
      'Use this free exponent calculator to raise a base to a power and see the result, scientific notation, zero exponent rules, negative exponent reciprocal steps, fraction exponent notes, examples, copy, and tab-only history.',
    icon: 'calculator-power',
    seoTitle: 'Exponent Calculator | Free Online Power Calculator',
    seoDescription:
      'Calculate powers with positive, negative, zero, decimal, and simple fraction exponents, plus reciprocal steps and scientific notation.',
    useCases: [
      'Calculate squares, cubes, powers of 10, and larger powers.',
      'Check zero exponent, first-power, and negative exponent homework problems.',
      'Turn negative exponents into reciprocal steps such as 5^-3 = 1 / 5^3.',
      'Use simple fraction exponents such as 1/2 or 3/2 for root-style calculations.',
      'Compare normal notation with scientific notation for very large or very small powers.',
      'Copy exponent answers and compare recent calculations while studying in one tab.',
    ],
    examples: [
      {
        label: 'Power of two',
        expression: '2^8',
        result: '256',
      },
      {
        label: 'Power of ten',
        expression: '10^6',
        result: '1,000,000, shown as 1e+6 in scientific notation',
      },
      {
        label: 'Zero exponent',
        expression: '9^0',
        result: '1 because any nonzero base to the power of 0 equals 1',
      },
      {
        label: 'Negative exponent',
        expression: '5^-3',
        result: '0.008 because 5^-3 means 1 / 5^3',
      },
      {
        label: 'Fraction exponent',
        expression: '81^(1/2)',
        result: '9 because exponent 1/2 works like a square root',
      },
      {
        label: 'Decimal exponent',
        expression: '16^0.5',
        result: '4 because 0.5 is another way to enter 1/2',
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
        question: 'What happens when the exponent is 1?',
        answer:
          'A base raised to the power of 1 stays the same. For example, 7^1 equals 7.',
      },
      {
        question: 'Can I use fraction exponents?',
        answer:
          'Yes. You can enter simple fraction exponents such as 1/2 or 3/2. Fractional exponents can represent roots and powers.',
      },
      {
        question: 'Can I enter decimal exponents?',
        answer:
          'Yes. Decimal exponents are allowed when the result is a real number. For example, 16^0.5 returns 4 because 0.5 is the same as 1/2.',
      },
      {
        question: 'Why are some negative-base powers not supported?',
        answer:
          'Negative bases with non-whole-number exponents can lead to complex numbers. This calculator focuses on real-number results, so negative bases need whole-number exponents.',
      },
      {
        question: 'Can I calculate 0 to a negative exponent?',
        answer:
          'No. A negative exponent means a reciprocal, and 0 with a negative exponent would divide by zero.',
      },
      {
        question: 'What about 0^0?',
        answer:
          'This calculator treats 0^0 as indeterminate instead of forcing one answer. Check your class, software, or math context if that special case appears.',
      },
      {
        question: 'Does the calculator show scientific notation?',
        answer:
          'Yes. The result card shows the normal result and a scientific-notation version, which is useful for very large or very small powers.',
      },
      {
        question: 'Why do parentheses matter with negative bases?',
        answer:
          'Use a negative base only when the whole base should be negative. In written math, (-3)^2 and -3^2 are usually different expressions, so check the notation before entering the base.',
      },
      {
        question: 'What if the result is too large?',
        answer:
          'If a power is outside the calculator range, the page asks you to check the inputs. Use scientific notation or a specialized high-precision tool for extreme powers.',
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
    summary: 'Calculate logarithms with custom bases, ln, log10, exponent checks, and change-of-base steps.',
    description:
      'Use this free log calculator to find logarithms with any valid base, compare ln and log10 values, see change-of-base steps, check the matching exponent, and avoid invalid values such as zero, negative inputs, or base 1.',
    icon: 'calculator-log',
    aliases: [
      'Free Log Calculator',
      'Logarithm Calculator',
      'Natural Log Calculator',
      'Common Log Calculator',
      'Change of Base Calculator',
      'Log Base Calculator',
    ],
    seoTitle: 'Log Calculator | Free Logarithm Calculator With Steps',
    seoDescription:
      'Use the free Access Free Tools log calculator to calculate custom-base logarithms, ln, log10, change-of-base steps, exponent checks, and valid inputs.',
    useCases: [
      'Calculate log base 2, base 10, natural log, or another custom base.',
      'Check logarithm homework with change-of-base steps.',
      'Compare log, ln, and log10 values from one input.',
      'Confirm a logarithm by seeing the matching exponential power check.',
      'See why zero, negative values, and base 1 are not valid real logarithm inputs.',
      'Use the tab-only recent answer history while studying repeated log problems.',
    ],
    examples: [
      {
        label: 'Base 2 logarithm',
        expression: 'log_2(8)',
        result: '3 because 2^3 = 8',
      },
      {
        label: 'Common logarithm',
        expression: 'log_10(1000)',
        result: '3 because 10^3 = 1000',
      },
      {
        label: 'Natural logarithm',
        expression: 'ln(e^3)',
        result: '3 because e^3 gives the input value',
      },
      {
        label: 'Negative log answer',
        expression: 'log_10(0.01)',
        result: '-2 because 10^-2 = 0.01',
      },
      {
        label: 'Custom base',
        expression: 'log_5(625)',
        result: '4 because 5^4 = 625',
      },
      {
        label: 'Change of base',
        expression: 'log_3(81)',
        result: '4 using ln(81) / ln(3)',
      },
    ],
    faq: [
      {
        question: 'What does a logarithm mean?',
        answer:
          'A logarithm asks which exponent makes the base turn into the value. For example, log_2(8) = 3 because 2^3 = 8.',
      },
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
        question: 'Can I enter e as the base?',
        answer:
          'Yes. Type e in the base field to use the natural log base. The calculator also shows ln(value) automatically for every valid positive value.',
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
        question: 'Why can the log value not be zero or negative?',
        answer:
          'In real-number logarithms, no positive base can be raised to a real exponent and produce zero or a negative value. Use a complex-number tool if your class or project needs complex logs.',
      },
      {
        question: 'Why can the base not be 1?',
        answer:
          'A base of 1 never grows or shrinks. Since 1 raised to any power is still 1, log base 1 cannot tell you one clear exponent.',
      },
      {
        question: 'When should I use log10 instead of ln?',
        answer:
          'Use log10 when the problem is built around powers of 10, such as orders of magnitude. Use ln when the problem is built around base e, which is common in algebra, calculus, growth, and decay formulas.',
      },
      {
        question: 'Why is my answer a long decimal?',
        answer:
          'Many logarithms are irrational decimals. The calculator formats the result for practical checking, so use the exponent check when you need to see whether the rounded answer matches the original value.',
      },
      {
        question: 'Can this replace a symbolic algebra system?',
        answer:
          'No. This page is for real-number numeric logarithms and quick study checks. It does not simplify symbolic expressions, solve equations, graph functions, or return complex logarithms.',
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
    summary: 'Calculate square roots, cube roots, nth roots, exponent form, real-number rules.',
    description:
      'Use this free root calculator to find square roots, cube roots, and nth roots with real-number guardrails, exponent form, power checks, decimal examples, and steps.',
    icon: 'calculator-root',
    seoTitle: 'Root Calculator | Free Online Nth Root Calculator',
    seoDescription:
      'Use the free Access Free Tools root calculator to calculate square roots, cube roots, and nth roots with exponent form, power checks, negative-number rules, and steps.',
    useCases: [
      'Find square roots and cube roots for math, science, and study problems.',
      'Calculate nth roots such as fourth roots, fifth roots, and higher whole-number roots.',
      'Convert root notation into rational exponent form.',
      'Check whether a negative radicand has a real-number root.',
      'Check decimal roots such as the cube root of 0.008.',
      'Raise the answer back to the root index to verify the power check.',
    ],
    examples: [
      {
        label: 'Square root',
        expression: 'root_2(144)',
        result: '12 because 12^2 = 144',
      },
      {
        label: 'Cube root',
        expression: 'root_3(-125)',
        result: '-5 because (-5)^3 = -125',
      },
      {
        label: 'Fourth root',
        expression: 'root_4(81)',
        result: '3 because 3^4 = 81',
      },
      {
        label: 'Fifth root',
        expression: 'root_5(32)',
        result: '2 because 2^5 = 32',
      },
      {
        label: 'Decimal cube root',
        expression: 'root_3(0.008)',
        result: '0.2 because 0.2^3 = 0.008',
      },
      {
        label: 'Even root of a negative',
        expression: 'root_2(-16)',
        result: 'No real-number result',
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
        question: 'What do radicand and root index mean?',
        answer:
          'The radicand is the number inside the root. The root index tells which power to undo: index 2 is square root, index 3 is cube root, index 4 is fourth root, and so on.',
      },
      {
        question: 'Can this calculator handle negative numbers?',
        answer:
          'It can calculate real odd roots of negative numbers, such as root_3(-125) = -5. Even roots of negative numbers are not real numbers, so the calculator shows an error.',
      },
      {
        question: 'Why does an even root of a negative number fail?',
        answer:
          'In real numbers, an even power is never negative. That is why root_2(-16) and root_4(-81) do not have real-number answers on this page.',
      },
      {
        question: 'How are roots related to exponents?',
        answer:
          'A root can be rewritten as a rational exponent. The nth root of x is the same as x^(1/n).',
      },
      {
        question: 'How can I check a root answer?',
        answer:
          'Raise the answer to the root index. If root_5(32) returns 2, check it by calculating 2^5, which gives 32.',
      },
      {
        question: 'Why are some root answers decimals?',
        answer:
          'Some roots do not land on a whole number. For example, root_2(2) is about 1.41421356, so the calculator gives a decimal approximation.',
      },
      {
        question: 'Can the root index be a decimal?',
        answer:
          'No. This calculator uses positive whole-number root indexes of 2 or higher, such as 2, 3, 4, or 5.',
      },
      {
        question: 'Can I enter decimal radicands?',
        answer:
          'Yes. Decimal radicands work when the root has a real-number answer. The cube root of 0.008 is 0.2 because 0.2^3 = 0.008.',
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
    summary: 'Solve quadratic equations with real or complex roots, discriminant, graph details, and steps.',
    description:
      'Use this free quadratic formula calculator to solve ax^2 + bx + c = 0, read the discriminant, find real or complex roots, check vertex and axis details, copy steps, and review recent answers.',
    icon: 'calculator-quadratic',
    seoTitle: 'Quadratic Formula Calculator | Free Online Root Solver',
    seoDescription:
      'Use the free Access Free Tools quadratic formula calculator to solve ax^2 + bx + c = 0 with roots, discriminant, vertex, graph details, steps, and examples.',
    useCases: [
      'Solve quadratic equations after you identify a, b, and c from standard form ax^2 + bx + c = 0.',
      'Check whether the discriminant gives two real roots, one repeated real root, or complex roots.',
      'Work through equations with negative coefficients, zero b or c terms, and decimal coefficients.',
      'Find graph details such as the vertex, axis of symmetry, opening direction, and y-intercept.',
      'Compare formula roots with a factoring answer or a graphing sketch before you turn in work.',
      'Copy roots and formula steps while keeping recent answers private in the current browser tab.',
    ],
    examples: [
      {
        label: 'Two real roots',
        expression: 'x^2 - 3x + 2 = 0',
        result: 'x = 2, 1',
      },
      {
        label: 'Negative constant',
        expression: '2x^2 + 5x - 3 = 0',
        result: 'x = 0.5, -3',
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
      {
        label: 'Opens downward',
        expression: '-16x^2 + 64x = 0',
        result: 'x = 0, 4',
      },
      {
        label: 'Decimal coefficients',
        expression: '0.5x^2 - 3x + 4 = 0',
        result: 'x = 4, 2',
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
        question: 'What do a, b, and c mean?',
        answer:
          'They are the coefficients from standard form ax^2 + bx + c = 0. The a value is attached to x^2, b is attached to x, and c is the constant term.',
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
        question: 'What if b or c is zero?',
        answer:
          'That is fine. Enter 0 for the missing x term or constant term, as long as a is not zero.',
      },
      {
        question: 'Can I enter decimals or negative coefficients?',
        answer:
          'Yes. You can enter positive, negative, and decimal coefficients such as a = 0.5, b = -3, and c = 4.',
      },
      {
        question: 'What form should I enter the equation in?',
        answer:
          'Enter the coefficients from standard form ax^2 + bx + c = 0. For example, x^2 - 3x + 2 = 0 uses a = 1, b = -3, and c = 2.',
      },
      {
        question: 'How can I check a root from the answer?',
        answer:
          'Substitute the root back into ax^2 + bx + c. A correct real root should make the expression equal 0, apart from small rounding differences.',
      },
      {
        question: 'What if my equation is factored?',
        answer:
          'Expand it into standard form before using this calculator, or use the factor form to read the roots directly if each factor is already simple.',
      },
      {
        question: 'Should I use this instead of a graphing calculator?',
        answer:
          'Use this for exact formula steps and root type. Use a graphing tool when you need a full visual curve, scale, intercept picture, or context from an applied problem.',
      },
      {
        question: 'What mistakes should I check before trusting the roots?',
        answer:
          'Check that the equation is in standard form, the signs on b and c are correct, a is not zero, and any decimal coefficients were copied accurately.',
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
      'Use this free binary calculator for base-2 addition, subtraction, multiplication, division with remainders, binary-to-decimal conversion, decimal-to-binary conversion, steps, copy, and history.',
    icon: 'calculator-binary',
    seoTitle: 'Binary Calculator | Free Online Base-2 Calculator',
    seoDescription:
      'Use the free Access Free Tools binary calculator to add, subtract, multiply, divide, and convert binary numbers with decimal checks, remainders, and steps.',
    useCases: [
      'Check that 1011 + 110 equals 10001, or 17 in decimal.',
      'Convert binary values such as 101010 into decimal numbers.',
      'Convert whole decimal numbers into grouped binary output.',
      'See quotient and remainder for binary division problems that do not divide evenly.',
      'Use grouped bit strings such as 1111 0000 without changing the value.',
    ],
    examples: [
      {
        label: 'Binary addition',
        expression: '1011 + 110',
        result: '10001 (17 decimal)',
      },
      {
        label: 'Binary subtraction',
        expression: '10000 - 1',
        result: '1111 (15 decimal)',
      },
      {
        label: 'Binary multiplication',
        expression: '101 x 11',
        result: '1111 (5 x 3 = 15 decimal)',
      },
      {
        label: 'Binary division',
        expression: '1101 / 10',
        result: '110 remainder 1 (6 remainder 1 decimal)',
      },
      {
        label: 'Binary to decimal',
        expression: '101010',
        result: '42 decimal',
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
        question: 'How does the Binary Calculator check the math?',
        answer:
          'It reads each binary input as a base-2 whole number, performs the operation, then converts the result back to binary. The decimal answer is shown beside it so you can sanity-check the same value in base 10.',
      },
      {
        question: 'Does the calculator convert decimal to binary?',
        answer:
          'Yes. The quick conversions panel converts whole decimal numbers into binary and converts binary numbers back into decimal.',
      },
      {
        question: 'Why does 1111 0000 equal 240 in decimal?',
        answer:
          'Spaces are only grouping helpers. The value is 11110000, which uses the 128, 64, 32, and 16 places: 128 + 64 + 32 + 16 = 240.',
      },
      {
        question: 'Can this calculator handle negative binary numbers?',
        answer:
          "Yes, you can use a leading minus sign for simple signed whole-number calculations. It does not use fixed-width two's complement notation yet.",
      },
      {
        question: 'What should I double-check before trusting a binary result?',
        answer:
          'Check that binary inputs use only 0 and 1, that grouped spaces or underscores are only for readability, that decimal values are entered in the decimal conversion field, and that you are not expecting fixed-width overflow or two\'s complement behavior.',
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
    summary: 'Add, subtract, multiply, divide, and convert hex numbers, then check decimal and binary output.',
    description:
      'Use this free hex calculator for base-16 addition, subtraction, multiplication, division with remainders, hex-to-decimal conversion, decimal-to-hex conversion, hex-to-binary conversion, optional 0x prefixes, copy, and current-tab history.',
    icon: 'calculator-hex',
    seoTitle: 'Hex Calculator | Free Online Hexadecimal Calculator',
    seoDescription:
      'Use the free Access Free Tools hex calculator to add, subtract, multiply, divide, and convert hexadecimal numbers to decimal or binary with base-16 steps and remainders.',
    useCases: [
      'Check hexadecimal addition, subtraction, multiplication, and division problems with decimal steps.',
      'Convert hex values such as 2A, FF, or 0xFF into decimal numbers.',
      'Convert whole decimal numbers into uppercase hexadecimal output.',
      'Compare hex, decimal, and binary answers while studying number systems or coding examples.',
      'Read byte-sized values such as FF = 255 and see the matching binary bits.',
      'Check simple signed whole-number hex math without assuming fixed-width two\'s complement behavior.',
    ],
    examples: [
      {
        label: 'Hex addition',
        expression: 'A3 + 1F',
        result: 'C2 hex, 194 decimal, 1100 0010 binary',
      },
      {
        label: 'Hex subtraction',
        expression: 'FF - 2A',
        result: 'D5 hex, 213 decimal',
      },
      {
        label: 'Hex multiplication',
        expression: '1A x 3',
        result: '4E hex, because 26 x 3 = 78 decimal',
      },
      {
        label: 'Hex division',
        expression: '2F / A',
        result: '4 remainder 7, because 47 / 10 leaves 7',
      },
      {
        label: 'Hex to decimal',
        expression: '0xFF',
        result: '255 decimal',
      },
      {
        label: 'Decimal to hex',
        expression: '42',
        result: '2A hex',
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
          'Use it to add, subtract, multiply, divide, and convert whole hexadecimal numbers. The calculator also shows decimal and binary versions of the answer so you can check the same value in three bases.',
      },
      {
        question: 'How is A3 converted to decimal?',
        answer:
          'A3 means 10 x 16 plus 3. That gives 160 + 3 = 163 in decimal. The calculator uses that same place-value idea before converting the answer back to hex.',
      },
      {
        question: 'Can I enter 0x before a hex number?',
        answer:
          'Yes. Optional 0x prefixes are accepted, so 0xFF and FF both work. Spaces and underscores are also ignored for readability.',
      },
      {
        question: 'How does hex division work in this calculator?',
        answer:
          'Hex division returns a whole-number quotient. If the division is not even, the calculator also shows the remainder in hex, decimal, and binary. For example, 2F / A is 4 remainder 7.',
      },
      {
        question: 'Does the calculator convert decimal to hex?',
        answer:
          'Yes. The quick conversions panel converts whole decimal numbers into hex and converts hex numbers back into decimal and binary.',
      },
      {
        question: 'Why does one hex digit equal four binary bits?',
        answer:
          'One hex digit can show 16 possible values, from 0 through F. Four binary bits can also show 16 values, from 0000 through 1111, so each hex digit maps neatly to a four-bit group.',
      },
      {
        question: 'Why does FF equal 255?',
        answer:
          'FF means 15 x 16 plus 15. That is 240 + 15 = 255, which is why FF often appears as the largest value in one byte.',
      },
      {
        question: 'Can this calculator handle lowercase hex letters?',
        answer:
          'Yes. You can enter uppercase or lowercase letters A-F. Results are shown in uppercase for cleaner reading.',
      },
      {
        question: 'Can I use it for color-code checks?',
        answer:
          'You can use it to check individual hex byte values, such as FF = 255 or 80 = 128. It is not a full color picker, so remove the # symbol and check each pair when you are reading CSS-style color codes.',
      },
      {
        question: 'Does it handle negative hex numbers?',
        answer:
          'Yes for simple signed whole-number math, such as -A + 2. It does not model fixed-width overflow or two\'s complement storage unless you manually interpret the result for a specific bit width.',
      },
      {
        question: 'What should I double-check before trusting a hex result?',
        answer:
          'Check that the input uses only 0-9 and A-F, that any 0x prefix is intentional, that decimal values are entered in the decimal conversion field, and that you are not expecting fixed-width byte overflow.',
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
    aliases: ['Cute Calculator', 'Pastel Calculator', 'Aesthetic Calculator', 'Kawaii Online Calculator'],
    seoTitle: 'Kawaii Calculator | Cute Free Online Calculator',
    seoDescription:
      'Use the free Access Free Tools kawaii calculator for cute pastel everyday math, percentages, decimals, keyboard input, history, and quick result copying.',
    useCases: [
      'Make quick calculations in a softer, more playful layout.',
      'Check totals, discounts, and simple math without opening a full spreadsheet.',
      'Use keyboard shortcuts while keeping a cheerful calculator page open.',
      'Copy results and keep recent calculations visible while comparing numbers.',
      'Use the same simple calculator behavior as the Basic Calculator with a softer visual style.',
    ],
    examples: [
      {
        label: 'Add cute stationery costs',
        expression: '12.50 + 7.25',
        result: '19.75 total',
      },
      {
        label: 'Find a pastel sale price',
        expression: '45 - 15%',
        result: '38.25 sale price',
      },
      {
        label: 'Split a small group total',
        expression: '96 / 4',
        result: '24 each',
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
      {
        question: 'Does the Kawaii Calculator follow full order of operations?',
        answer:
          'No. It works like a simple handheld calculator: it solves the current two-number step when you press the next operator or equals. Use the Scientific Calculator when you need parentheses, powers, trigonometry, or full expression order.',
      },
      {
        question: 'Why can a long decimal look shorter?',
        answer:
          'The display rounds long floating-point answers so they stay readable on the cute calculator screen. If you need exact large-integer math, use the Big Number Calculator. If you need fraction work, use the Fraction Calculator.',
      },
    ],
    relatedSlugs: ['basic-calculator', 'percentage-calculator', 'fraction-calculator', 'scientific-calculator'],
  },
  {
    slug: 'scientific-calculator',
    name: 'Scientific Calculator',
    category: 'calculators',
    summary: 'A free scientific calculator for trig, inverse trig, logs, roots, powers, constants, and DEG/RAD mode.',
    description:
      'Use this free scientific calculator for typed expressions, trigonometry, inverse trig, logarithms, square roots, cube roots, powers, constants, DEG/RAD mode, expression history, and quick result copying.',
    icon: 'calculator-fx',
    aliases: [
      'Online Scientific Calculator',
      'Trigonometry Calculator',
      'Degree Radian Calculator',
      'Scientific Expression Calculator',
    ],
    seoTitle: 'Scientific Calculator | Free Online Scientific Calculator',
    seoDescription:
      'Use a free scientific calculator for trig, inverse trig, logs, roots, powers, constants, DEG/RAD mode, typed expressions, history, and result copying.',
    useCases: [
      'Solve trigonometry problems in degrees or radians before copying the result.',
      'Check inverse trig answers such as asin(0.5) and read them in the selected angle mode.',
      'Calculate logarithms, natural logs, square roots, cube roots, powers, and absolute values.',
      'Type full expressions with parentheses, pi, e, and scientific notation such as 1.2e3.',
      'Compare homework, science, engineering, and quick study expressions in one browser tab.',
      'Reuse recent expressions from the history panel while testing small formula changes.',
    ],
    examples: [
      {
        label: 'Trig identity check',
        expression: 'sin(30) + cos(60)',
        result: '1',
      },
      {
        label: 'Radians with pi',
        expression: 'sin(pi/6) + cos(pi/3) in RAD mode',
        result: '1',
      },
      {
        label: 'Inverse trig in degrees',
        expression: 'asin(0.5) in DEG mode',
        result: '30',
      },
      {
        label: 'Logs and powers together',
        expression: 'log(1000) + ln(e) + 2^5',
        result: '36',
      },
      {
        label: 'Roots and absolute value',
        expression: 'sqrt(25) + cbrt(8) + abs(-4)',
        result: '11',
      },
      {
        label: 'Scientific notation input',
        expression: '1.2e3 + 4.5e2',
        result: '1650',
      },
      {
        label: 'Parentheses and powers',
        expression: '(3 + 5)^2 / 4',
        result: '16',
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
          'The calculator supports sin, cos, tan, inverse trig functions, log, ln, sqrt, cbrt, abs, powers, parentheses, pi, e, scientific notation, and standard arithmetic.',
      },
      {
        question: 'Can I type expressions directly?',
        answer:
          'Yes. You can click the keypad or type expressions such as sin(45)+log(100), (3+5)^2, or 1.2e3+4.5e2. Press Enter or the equals button to calculate.',
      },
      {
        question: 'How do inverse trig functions work?',
        answer:
          'Use asin, acos, and atan for inverse trig. In DEG mode, asin(0.5) returns 30. In RAD mode, the same inverse trig answer is shown in radians. The input for asin and acos must be between -1 and 1.',
      },
      {
        question: 'How do I enter powers and scientific notation?',
        answer:
          'Use ^ for powers, such as 2^5. Use e notation for powers of 10, such as 1e3 for 1000 or 2.5e-4 for 0.00025. Type pi or e by itself when you want the constants.',
      },
      {
        question: 'Why did the calculator show Error?',
        answer:
          'Error usually means the expression has mismatched parentheses, a missing value, division by zero, a square root of a negative number, a log of zero or a negative number, or an inverse trig input outside its valid range.',
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
        question: 'Does this replace a graphing calculator or algebra system?',
        answer:
          'No. This page evaluates numeric expressions. It does not graph functions, solve symbolic algebra, keep exact radicals, or show a full step-by-step derivation. Use it as a fast check, then use a graphing or class-approved tool when the assignment asks for that.',
      },
      {
        question: 'What should I check before trusting a scientific result?',
        answer:
          'Check parentheses, angle mode, negative signs, exponent grouping, and whether your class or formula expects degrees or radians. A correct expression in the wrong mode can still give the wrong answer.',
      },
      {
        question: 'Are the results exact?',
        answer:
          'The calculator uses browser number math and rounds long decimals for readability. For exact huge integer arithmetic, use the Big Number Calculator. For exact fraction work, use the Fraction Calculator.',
      },
    ],
    relatedSlugs: ['log-calculator', 'root-calculator', 'exponent-calculator', 'scientific-notation-calculator'],
  },
  {
    slug: 'fraction-calculator',
    name: 'Fraction Calculator',
    category: 'calculators',
    summary: 'Add, subtract, multiply, divide, and simplify fractions with steps.',
    description:
      'Enter simple fractions, mixed numbers, or improper fractions, choose an operation, and see the simplified answer with steps, decimal value, and a copy-ready result.',
    icon: 'calculator-fraction',
    seoTitle: 'Fraction Calculator | Add, Subtract, Multiply, Divide',
    seoDescription:
      'Add, subtract, multiply, divide, and simplify fractions or mixed numbers with steps, improper-fraction form, and decimal checks.',
    useCases: [
      'Add or subtract fractions with unlike denominators and see the common-denominator step.',
      'Multiply fractions directly or divide by using the reciprocal of the second fraction.',
      'Turn an improper fraction into a mixed number for homework, recipes, or measurements.',
      'Compare the mixed-number, improper-fraction, and decimal forms before trusting the answer.',
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
      {
        label: 'Divide fractions',
        expression: '5/6 / 2/3',
        result: '1 1/4',
      },
    ],
    faq: [
      {
        question: 'What can I use the Fraction Calculator for?',
        answer:
          'Use it to add, subtract, multiply, divide, simplify, and compare fractions. It works with simple fractions, improper fractions, mixed numbers, and negative values.',
      },
      {
        question: 'How do I enter a mixed number?',
        answer:
          'Put the whole number in the Whole box and the fraction part in the numerator and denominator boxes. For 2 1/4, enter Whole 2, Numerator 1, Denominator 4.',
      },
      {
        question: 'Why do addition and subtraction need a common denominator?',
        answer:
          'Fractions can only be added or subtracted directly when the parts are the same size. The calculator finds matching denominator pieces first, then combines the numerators.',
      },
      {
        question: 'Does the calculator simplify fractions automatically?',
        answer:
          'Yes. The result is reduced to lowest terms, and the page also shows an improper fraction, a mixed-number form, and a decimal value.',
      },
      {
        question: 'How does dividing fractions work?',
        answer:
          'Dividing by a fraction uses the reciprocal of the second fraction. The calculator flips the second fraction, multiplies, and then simplifies the answer.',
      },
      {
        question: 'What does the decimal answer mean?',
        answer:
          'The decimal is the same value written another way. It is useful when a recipe, measurement, or spreadsheet needs a decimal instead of a fraction.',
      },
      {
        question: 'Can a denominator be zero?',
        answer:
          'No. A denominator cannot be zero, and the calculator will show an error if you try to calculate with one.',
      },
      {
        question: 'When should I use the LCM or GCF calculators?',
        answer:
          'Use the LCM Calculator when you only need a common denominator. Use the GCF Calculator when you only need the largest shared factor for simplifying.',
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
    summary:
      'Find the least common multiple of positive whole numbers for fractions, schedules, and divisibility checks.',
    description:
      'Use this free least common multiple calculator to find the LCM of two or more positive whole numbers with exact integer math, common-denominator examples, schedule examples, copy, history, and step-by-step notes.',
    icon: 'calculator-lcm',
    aliases: ['LCM Calculator', 'Common Multiple Calculator', 'Least Common Denominator Calculator'],
    seoTitle: 'Least Common Multiple Calculator | LCM With Steps',
    seoDescription:
      'Find the least common multiple of two or more positive whole numbers with exact LCM steps, fraction denominator examples, and schedule checks.',
    useCases: [
      'Find a common denominator before adding or comparing fractions.',
      'Solve schedule problems where events repeat at different intervals.',
      'Check school math problems involving multiples and divisibility.',
      'Compare two or more positive whole numbers with exact integer results.',
      'See how pair-by-pair GCF checks combine a list into one LCM.',
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
      {
        label: 'Fraction denominators',
        expression: 'LCM of 4, 6, 9',
        result: '36',
      },
      {
        label: 'Repeating schedules',
        expression: 'LCM of 12 and 20 minutes',
        result: '60 minutes',
      },
      {
        label: 'No shared factors',
        expression: 'LCM of 7, 11, 13',
        result: '1,001',
      },
    ],
    faq: [
      {
        question: 'What is the least common multiple?',
        answer:
          'The least common multiple is the smallest positive whole number that every entered number divides into evenly. For 12, 18, and 30, that smallest shared multiple is 180.',
      },
      {
        question: 'How does the LCM Calculator find the answer?',
        answer:
          'It combines the numbers from left to right with LCM(a,b) = a x b / GCF(a,b). That keeps the answer exact while avoiding a slow search through every possible multiple.',
      },
      {
        question: 'Why does the formula use the GCF?',
        answer:
          'Multiplying two numbers counts their shared factors twice. Dividing by the GCF removes that duplicate factor, leaving the smallest multiple that still contains both numbers.',
      },
      {
        question: 'Can I enter more than two numbers?',
        answer:
          'Yes. Enter at least two positive whole numbers separated by commas, spaces, or semicolons. The calculator combines the list pair by pair until one LCM remains.',
      },
      {
        question: 'How do I use LCM for fractions?',
        answer:
          'Use the LCM of the denominators as a common denominator. For denominators 4, 6, and 9, the LCM is 36, so each fraction can be rewritten with denominator 36 before adding or comparing.',
      },
      {
        question: 'How do I use LCM for schedules?',
        answer:
          'Use the repeating intervals as the inputs. If one reminder repeats every 12 minutes and another repeats every 20 minutes, the LCM is 60 minutes, so they line up again after one hour.',
      },
      {
        question: 'What happens when numbers share no factors?',
        answer:
          'If the numbers are relatively prime, their LCM is their product. For 7, 11, and 13, the LCM is 1,001 because there are no shared factors to remove.',
      },
      {
        question: 'Why do the inputs need to be positive whole numbers?',
        answer:
          'LCM is normally used for positive integers. Zero has no positive multiples in the same useful sense, and decimals or negatives belong in a different math workflow.',
      },
      {
        question: 'When should I use the Greatest Common Factor Calculator instead?',
        answer:
          'Use GCF when you need the largest shared divisor. Use LCM when you need the smallest shared multiple, such as a common denominator.',
      },
      {
        question: 'Can very large LCM answers be exact?',
        answer:
          'Yes. The calculator uses exact BigInt integer math for the LCM result instead of decimal rounding. Very large answers can still become long, so double-check that each input is the intended whole number.',
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
        result: '12, so all three numbers can be split into equal groups of 12',
      },
      {
        label: 'Two numbers',
        expression: 'GCF of 48 and 180',
        result: '12; 48 = 12 x 4 and 180 = 12 x 15',
      },
      {
        label: 'Larger list',
        expression: 'GCF of 81, 153, 225',
        result: '9; each number divides evenly by 9 and no larger shared factor fits all three',
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
        question: 'What do the main Greatest Common Factor Calculator inputs mean?',
        answer:
          'Enter at least two positive whole numbers. Commas, spaces, and semicolons only separate the numbers; the calculator compares the whole numbers themselves to find the largest divisor they all share.',
      },
      {
        question: 'How should I read the Greatest Common Factor Calculator answer?',
        answer:
          'The headline GCF is the largest whole number that divides every input evenly. For 24, 36, and 60, a GCF of 12 means each number can be split into equal groups of 12 with nothing left over.',
      },
      {
        question: 'What should I double-check before trusting the Greatest Common Factor Calculator?',
        answer:
          'Check that every entry is a positive whole number and that none of the numbers are missing. Decimals, negative numbers, zero, one-number factor lists, and common-multiple questions belong in a different workflow.',
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
        result: '12 factors; factor pairs include 1 x 84, 2 x 42, 3 x 28, 4 x 21, 6 x 14, and 7 x 12',
      },
      {
        label: 'Prime number',
        expression: 'Factors of 97',
        result: 'Only 1 and 97, so 97 is prime',
      },
      {
        label: 'Prime factorization',
        expression: '360',
        result: '2^3 x 3^2 x 5, which multiplies back to 360',
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
        question: 'What do the main Factor Calculator inputs mean?',
        answer:
          'Enter one positive whole number. The calculator tests whole-number divisors, keeps only the divisors that leave no remainder, and pairs each divisor with the matching quotient.',
      },
      {
        question: 'How should I read the Factor Calculator answer?',
        answer:
          'Start with the full factor list, then check the factor pairs. For 84, the pair 6 x 14 means both 6 and 14 divide 84 evenly. The prime factorization shows the same number broken into prime building blocks.',
      },
      {
        question: 'What should I double-check before trusting the Factor Calculator?',
        answer:
          'Check that the input is a positive whole number and that you did not mean GCF, LCM, or prime factorization only. Decimals, negative signs, and comparing multiple numbers belong in a different workflow.',
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
    summary: 'Round decimals, significant figures, and place values using clear method steps.',
    description:
      'Use this free rounding calculator to round numbers to decimal places, significant figures, or place values. Compare nearest, round up, round down, and truncate methods with steps, difference, and recent answers.',
    icon: 'calculator-round',
    aliases: [
      'Decimal Rounding Calculator',
      'Significant Figures Calculator',
      'Round to Nearest Hundred Calculator',
      'Place Value Rounding Calculator',
    ],
    seoTitle: 'Rounding Calculator | Decimal and Significant Figures',
    seoDescription:
      'Round decimals, significant figures, place values, negative numbers, and half values with nearest, up, down, or truncate steps and examples.',
    useCases: [
      'Round money, measurements, grades, and everyday decimal values without guessing where the answer changed.',
      'Round study or lab answers to a required number of significant figures.',
      'Round whole numbers to tens, hundreds, thousands, millions, or decimal place-value steps.',
      'Compare nearest, round up, round down, and truncate methods on the same input.',
      'Check how negative numbers behave when up, down, and truncate do different things.',
      'Read the difference between the original value and rounded value before copying the result.',
    ],
    examples: [
      {
        label: 'Decimal places',
        expression: '12.3456 to 2 decimal places',
        result: '12.35, with a difference of 0.0044',
      },
      {
        label: 'Significant figures',
        expression: '98,765 to 3 significant figures',
        result: '98,800, keeping only the first 3 meaningful digits',
      },
      {
        label: 'Place value',
        expression: '1,846 to the nearest hundred',
        result: '1,800 because place exponent 2 means nearest 100',
      },
      {
        label: 'Round up',
        expression: '12.341 up to 2 decimal places',
        result: '12.35 because round up moves to the next higher 0.01 step',
      },
      {
        label: 'Negative truncate',
        expression: '-12.349 truncated to 2 decimal places',
        result: '-12.34 because truncate drops extra digits toward zero',
      },
      {
        label: 'Small significant figures',
        expression: '0.004987 to 2 significant figures',
        result: '0.005, preserving two meaningful digits after leading zeros',
      },
      {
        label: 'Half value',
        expression: '-2.5 to 0 decimal places with nearest',
        result: '-3 because nearest half values move away from zero',
      },
    ],
    faq: [
      {
        question: 'What rounding modes are supported?',
        answer:
          'The calculator supports decimal places, significant figures, and place value rounding. Use decimal places for a fixed number of digits after the decimal, significant figures for meaningful digits, and place value for tens, hundreds, thousands, or decimal place steps.',
      },
      {
        question: 'How do I round to decimal places?',
        answer:
          'Choose Decimal places, enter the value, and enter the number of digits to keep after the decimal. For example, 12.3456 to 2 decimal places becomes 12.35 with nearest rounding.',
      },
      {
        question: 'How do I round to significant figures?',
        answer:
          'Choose Significant figures and enter how many meaningful digits to keep. Leading zeros do not count, so 0.004987 to 2 significant figures becomes 0.005.',
      },
      {
        question: 'How do I round to a place value?',
        answer:
          'Use place-value mode. Exponent 1 means nearest 10, exponent 2 means nearest 100, exponent 3 means nearest 1,000, and exponent -2 means nearest 0.01.',
      },
      {
        question: 'What is the difference between nearest, up, down, and truncate?',
        answer:
          'Nearest rounds to the closest step. Up uses the next higher step, down uses the next lower step, and truncate drops extra digits toward zero.',
      },
      {
        question: 'How are halfway values rounded?',
        answer:
          'Nearest mode moves exact half values away from zero. That means 2.5 rounds to 3, and -2.5 rounds to -3 when rounding to 0 decimal places.',
      },
      {
        question: 'Can I round negative numbers?',
        answer:
          'Yes. Negative numbers work, but method names matter. Round up moves toward positive infinity, round down moves toward negative infinity, and truncate moves toward zero.',
      },
      {
        question: 'What precision limits should I know?',
        answer:
          'Decimal places can be 0 through 12. Significant figures can be 1 through 15. Place-value exponents can be -6 through 12.',
      },
      {
        question: 'What does the difference line mean?',
        answer:
          'Difference is the rounded value minus the original value. It helps you see how much the rounded answer moved from the input before you copy it.',
      },
      {
        question: 'When should I use significant figures instead of decimal places?',
        answer:
          'Use significant figures when the rule is about meaningful digits, such as a science measurement. Use decimal places when the rule is about digits after the decimal point, such as cents or fixed display formatting.',
      },
      {
        question: 'Should I round every step in a longer problem?',
        answer:
          'Usually no. Keep extra precision while working, then round the final answer to the rule your class, report, spreadsheet, or form requires.',
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
      'Enter 2x2 or 3x3 matrices, then add, subtract, multiply, transpose, or find the determinant with plain steps and copyable answers.',
    icon: 'calculator-matrix',
    aliases: ['2x2 Matrix Calculator', '3x3 Matrix Calculator', 'Matrix Multiplication Calculator', 'Determinant Calculator'],
    seoTitle: 'Matrix Calculator | 2x2 and 3x3 Steps',
    seoDescription:
      'Add, subtract, multiply, transpose, and find 2x2 or 3x3 determinants with clear matrix steps and example answers.',
    useCases: [
      'Check 2x2 and 3x3 matrix addition or subtraction before homework goes in.',
      'Multiply square matrices and see the row-by-column rule instead of just the answer.',
      'Find a 2x2 determinant with ad - bc or a 3x3 determinant with expansion by minors.',
      'Transpose a matrix when rows and columns need to switch places.',
    ],
    examples: [
      {
        label: '2x2 multiply',
        expression: '[[1,2],[3,4]] x [[2,0],[1,2]]',
        result: '[[4,4],[10,8]] because row 1 x column 1 is 1x2 + 2x1 = 4',
      },
      {
        label: '2x2 add',
        expression: '[[1,2],[3,4]] + [[5,6],[7,8]]',
        result: '[[6,8],[10,12]] by adding matching spots',
      },
      {
        label: '2x2 determinant',
        expression: 'det([[3,4],[2,5]])',
        result: '7 because 3x5 - 4x2 = 15 - 8',
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
        question: 'When can I add or subtract two matrices?',
        answer:
          'The two matrices need the same size. A 2x2 can add to another 2x2, and a 3x3 can add to another 3x3. Each answer spot comes from the matching spot in Matrix A and Matrix B.',
      },
      {
        question: 'Does order matter for matrix multiplication?',
        answer:
          'Yes. Matrix multiplication is order-sensitive. A x B can be different from B x A because each answer entry uses a row from the first matrix and a column from the second.',
      },
      {
        question: 'What is a determinant?',
        answer:
          'A determinant is a single value calculated from a square matrix. For a 2x2 matrix [[a,b],[c,d]], the determinant is ad - bc.',
      },
      {
        question: 'Why does the calculator only show 2x2 and 3x3 matrices?',
        answer:
          'Those sizes cover the quick checks most people need on this page, and they keep the grid readable on a phone. Bigger matrices need a different layout and slower step display.',
      },
      {
        question: 'Can this solve systems of equations?',
        answer:
          'Not yet. This version checks core matrix operations. If you are solving systems, use the result as one step in your work and still check the equation setup.',
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
    summary: 'Add, subtract, multiply, and divide very large whole numbers exactly, including division remainders.',
    description:
      'Use this free big number calculator for exact whole-number addition, subtraction, multiplication, and division with quotient and remainder output beyond normal safe integer limits.',
    icon: 'calculator-big-number',
    aliases: [
      'Large Integer Calculator',
      'BigInt Calculator',
      'Arbitrary Precision Integer Calculator',
      'Exact Whole Number Calculator',
      'Huge Number Calculator',
    ],
    seoTitle: 'Big Number Calculator | Exact Large Integer Calculator',
    seoDescription:
      'Use the free Access Free Tools big number calculator to add, subtract, multiply, and divide very large whole numbers exactly with quotient, remainder, and digit counts.',
    useCases: [
      'Calculate with integers larger than JavaScript normal-number safe integer limits.',
      'Add, subtract, or multiply long whole numbers without losing trailing digits.',
      'Divide large integers and see a whole-number quotient plus any remainder.',
      'Paste values with commas, spaces, or underscores and keep the integer digits exact.',
      'Check coding, number theory, base conversion, and study examples before copying an answer.',
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
        label: 'Tiny difference',
        expression: '1,000,000,000,000,000,000,000 - 999,999,999,999,999,999,999',
        result: '1',
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
          'It uses exact BigInt integer arithmetic. That means very large whole-number answers keep their digits instead of being rounded by normal floating-point number math.',
      },
      {
        question: 'What numbers can I enter?',
        answer:
          'Enter whole integers only. Commas, spaces, and underscores are accepted for readability, so 1,000, 1 000, and 1_000 all read as the same integer.',
      },
      {
        question: 'When should I use this instead of the Basic Calculator?',
        answer:
          'Use the Basic Calculator for everyday decimals, percentages, and quick totals. Use the Big Number Calculator when you need exact whole-number arithmetic with very large integers.',
      },
      {
        question: 'Can I enter decimals, fractions, or scientific notation?',
        answer:
          'No. This tool is for whole numbers only. It rejects decimals, fractions, and 1e notation because BigInt works with integers, not fractional quantities.',
      },
      {
        question: 'How does division work?',
        answer:
          'Division returns a whole-number quotient. If the values do not divide evenly, the calculator also shows the remainder, such as 100,000,000,000,000,000,000 / 9 = 11,111,111,111,111,111,111 remainder 1.',
      },
      {
        question: 'What does result digits mean?',
        answer:
          'Result digits counts the digits in the answer, ignoring commas and the minus sign. It helps you spot whether a copied result is missing a digit.',
      },
      {
        question: 'How large can the numbers be?',
        answer:
          'Very large whole numbers are supported, but browser memory and page responsiveness still matter. Extremely huge pasted inputs can become slow or hard to copy cleanly.',
      },
      {
        question: 'What mistake changes a big number result?',
        answer:
          'The easiest mistake is pasting a rounded value from another calculator. Check the original digits, signs, operation, and remainder before trusting or copying the answer.',
      },
      {
        question: 'Is my big number history private?',
        answer:
          'Yes. Recent big number answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['basic-calculator', 'scientific-notation-calculator', 'binary-calculator', 'hex-calculator'],
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
    summary:
      'Generate arithmetic, geometric, and Fibonacci-style sequences with formulas, next terms, and copyable results.',
    description:
      'Use this free number sequence calculator to generate arithmetic sequences, geometric sequences, Fibonacci-style sequences, formulas, next terms, steps, copy, and recent tab history.',
    icon: 'calculator-sequence',
    seoTitle: 'Number Sequence Calculator | Arithmetic & Geometric Terms',
    seoDescription:
      'Generate arithmetic, geometric, and Fibonacci-style number sequences with formulas, next terms, examples, steps, and copyable results.',
    useCases: [
      'Create an arithmetic sequence from a first term and common difference.',
      'Create a geometric sequence from a first term and common ratio.',
      'Generate a Fibonacci-style sequence from two starting terms.',
      'Check the visible formula before copying a sequence into homework notes.',
      'Preview the next three terms after the list you asked to show.',
      'Test decimals, negative differences, fractional ratios, and decreasing patterns.',
    ],
    examples: [
      { label: 'Arithmetic growth', expression: 'First 3, difference 4, 5 terms', result: '3, 7, 11, 15, 19' },
      { label: 'Arithmetic decrease', expression: 'First 20, difference -3, 6 terms', result: '20, 17, 14, 11, 8, 5' },
      { label: 'Geometric growth', expression: 'First 2, ratio 3, 5 terms', result: '2, 6, 18, 54, 162' },
      { label: 'Geometric half-life style', expression: 'First 64, ratio 0.5, 6 terms', result: '64, 32, 16, 8, 4, 2' },
      { label: 'Classic Fibonacci-style', expression: 'Start 1 and 1, 7 terms', result: '1, 1, 2, 3, 5, 8, 13' },
      { label: 'Custom Fibonacci-style', expression: 'Start 2 and 5, 7 terms', result: '2, 5, 7, 12, 19, 31, 50' },
    ],
    faq: [
      {
        question: 'What sequence types are supported?',
        answer:
          'The calculator supports arithmetic, geometric, and Fibonacci-style sequences. Choose the mode first so the second input means the right thing for that rule.',
      },
      {
        question: 'What is an arithmetic sequence?',
        answer:
          'An arithmetic sequence changes by adding the same amount each time. The calculator uses a(n) = first + (n - 1) x difference.',
      },
      {
        question: 'What is a geometric sequence?',
        answer:
          'A geometric sequence changes by multiplying by the same value each time. The calculator uses a(n) = first x ratio^(n - 1).',
      },
      {
        question: 'How does the Fibonacci-style mode work?',
        answer:
          'Fibonacci-style mode starts with two values, then adds the previous two terms to make each next term. Starting with 2 and 5 gives 2, 5, 7, 12, 19, and so on.',
      },
      {
        question: 'What does the second field mean?',
        answer:
          'In arithmetic mode it is the common difference. In geometric mode it is the common ratio. In Fibonacci-style mode it is the second starting term.',
      },
      {
        question: 'How many terms can I generate?',
        answer:
          'Terms to show must be a whole number from 2 to 30. The result also shows the next three terms after the displayed list.',
      },
      {
        question: 'Can I generate decimals or negative terms?',
        answer:
          'Yes. The first term, common difference, common ratio, and second Fibonacci-style term can be decimals or negative numbers, as long as the values stay finite.',
      },
      {
        question: 'What is the difference between common difference and common ratio?',
        answer:
          'A common difference is added each time, such as +4. A common ratio is multiplied each time, such as x3 or x0.5.',
      },
      {
        question: 'Why can geometric sequences get large so quickly?',
        answer:
          'Geometric sequences multiply by the ratio every step, so ratios larger than 1 can grow fast. Use fewer terms or a smaller ratio if the output becomes too large to read.',
      },
      {
        question: 'Can this identify an unknown pattern from a pasted list?',
        answer:
          'No. This page generates sequences from the rule you choose. It does not infer arbitrary patterns from an existing list of numbers.',
      },
      {
        question: 'What do next terms mean?',
        answer:
          'Next terms are the three values that would follow after the number of terms you asked to show, using the same rule.',
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
      'See how a wider margin of error lowers the required response count.',
      'Plan rough response targets before accounting for nonresponse or screening.',
    ],
    examples: [
      { label: 'Common survey', expression: '95%, 5% margin, 50% proportion', result: '385' },
      { label: 'Finite population', expression: '95%, 5%, 50%, population 1,000', result: '278' },
      { label: 'Higher confidence', expression: '99%, 5%, 50%', result: '664' },
      { label: 'Wider margin', expression: '95%, 10%, 50%', result: '97' },
      { label: 'Estimated 20% yes rate', expression: '95%, 5%, 20% proportion', result: '246' },
      { label: 'Small audience', expression: '95%, 5%, 50%, population 300', result: '169' },
    ],
    faq: [
      {
        question: 'What kind of sample size does this calculator estimate?',
        answer:
          'It estimates sample size for a population proportion, which is common for surveys, polls, yes/no questions, and percentage estimates.',
      },
      {
        question: 'What do the main Sample Size Calculator inputs mean?',
        answer:
          'Confidence level controls the z-score, margin of error is the plus-or-minus percentage you can tolerate, population proportion is the expected yes/share percentage, and optional population size applies finite population correction.',
      },
      {
        question: 'Should I enter 5 or 0.05 for margin of error?',
        answer:
          'Enter percentages as whole percent values. For a 5% margin of error, type 5. For an expected 20% response proportion, type 20.',
      },
      {
        question: 'How should I read the Sample Size Calculator answer?',
        answer:
          'The required sample size is the completed response count after rounding up. Raw n is the open-population estimate, and adjusted n shows the finite-population corrected value when you enter a population size.',
      },
      {
        question: 'What should I enter for population proportion?',
        answer:
          'Use your best estimate. If you are unsure, use 50%, which gives the most conservative and usually largest sample size.',
      },
      {
        question: 'Why does 50% give the largest sample size?',
        answer:
          'A 50% proportion has the most uncertainty for a yes/no estimate. Proportions closer to 0% or 100% have less spread, so the formula usually needs fewer responses.',
      },
      {
        question: 'What is margin of error?',
        answer:
          'Margin of error is the maximum difference you are planning to tolerate between the sample estimate and the true population proportion.',
      },
      {
        question: 'Why does a smaller margin of error need more responses?',
        answer:
          'A tighter margin of error asks the survey to estimate the true proportion more precisely. Precision costs sample size, so moving from 10% to 5% margin usually increases the required responses a lot.',
      },
      {
        question: 'What does finite population correction do?',
        answer:
          'When the total population is known, finite population correction can reduce the required sample size because the sample is a larger share of the whole group.',
      },
      {
        question: 'What should I double-check before trusting the Sample Size Calculator?',
        answer:
          'Check that your sample will be reasonably random or representative, that you planned for nonresponse, that subgroups have enough responses, and that design effects or weighting are not needed for your survey method.',
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
    summary: 'Calculate P(A or B), P(A and B), complements, and independent-event probability checks.',
    description:
      'Use this free probability calculator to find P(A or B), P(A and B), not A, not B, independent-event intersections, formula steps, copy, and history.',
    icon: 'calculator-probability',
    seoTitle: 'Probability Calculator | Union, Intersection, Complement',
    seoDescription:
      'Use the free Access Free Tools probability calculator to calculate P(A or B), P(A and B), complements, independent events, and probability steps.',
    useCases: [
      'Find the chance that A or B happens when you know both event probabilities.',
      'Enter a known overlap when two events can happen together.',
      'Leave the overlap blank when the events are independent.',
      'Calculate complements such as not A and not B.',
      'Catch impossible probability assumptions before copying an answer.',
      'Check classroom probability examples, survey scenarios, and quick planning estimates.',
    ],
    examples: [
      { label: 'Independent events', expression: 'P(A)=40%, P(B)=25%, blank overlap', result: 'P(A and B)=10%; P(A or B)=55%' },
      { label: 'Known overlap', expression: 'P(A)=60%, P(B)=30%, P(A and B)=15%', result: 'P(A or B)=75%' },
      { label: 'Complement', expression: 'P(A)=40%', result: 'P(not A)=60%' },
      { label: 'Mutually exclusive events', expression: 'P(A)=20%, P(B)=30%, P(A and B)=0%', result: 'P(A or B)=50%' },
      { label: 'Large overlap', expression: 'P(A)=80%, P(B)=70%, P(A and B)=60%', result: 'P(A or B)=90%' },
      { label: 'Decimal percentages', expression: 'P(A)=12.5%, P(B)=20%, blank overlap', result: 'P(A and B)=2.5%; P(A or B)=30%' },
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
        question: 'When should I enter P(A and B)?',
        answer:
          'Enter P(A and B) when you already know the overlap, such as the percent of people who fit both groups or the chance that both events happen together.',
      },
      {
        question: 'What are independent events?',
        answer:
          'Independent events do not change each other. If A happening does not affect B, the calculator can multiply P(A) by P(B) to estimate P(A and B).',
      },
      {
        question: 'What is a complement?',
        answer:
          'The complement of A is not A. Its probability is 1 - P(A), or 100% minus P(A) when using percentages.',
      },
      {
        question: 'Can I enter decimal percentages?',
        answer:
          'Yes. You can enter values such as 12.5 or 0.75. The inputs are percentages, so 12.5 means 12.5%, not 0.125%.',
      },
      {
        question: 'Why can the intersection not be larger than A or B?',
        answer:
          'The overlap cannot include more outcomes than either event by itself. If P(A) is 40%, P(A and B) cannot be 50%.',
      },
      {
        question: 'Can probabilities be more than 100%?',
        answer:
          'No. Each probability must be between 0% and 100%, and the final union cannot be more than 100%.',
      },
      {
        question: 'Why does the calculator reject some overlaps?',
        answer:
          'Some entered probabilities contradict each other. For example, if the union would be greater than 100%, at least one input or overlap assumption is not possible.',
      },
      {
        question: 'Can this predict what will happen?',
        answer:
          'No. It only applies probability formulas to the numbers you enter. Real-world outcomes still depend on whether your assumptions are accurate.',
      },
      {
        question: 'Does this count dice, cards, or combinations for me?',
        answer:
          'No. First count favorable and total outcomes, then enter the resulting probabilities. Use the Permutation and Combination Calculator when the counting step is the hard part.',
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
    summary: 'Find mean, median, mode, range, sorted values, sum, count, min, max, and quick steps for a list of numbers.',
    description:
      'Use this free mean, median, mode, range calculator to summarize a data set with the average, middle value, most frequent values, spread, sorted data, sum, count, min, max, steps, copy, and history.',
    icon: 'calculator-mean',
    seoTitle: 'Mean, Median, Mode, Range Calculator | Sort Data and Steps',
    seoDescription:
      'Use the free Access Free Tools mean, median, mode, range calculator to sort data and find average, middle value, modes, range, sum, count, min, max, and steps.',
    useCases: [
      'Find the arithmetic mean, median, mode, and range from one pasted data set.',
      'Check class scores, survey values, measurements, practice problems, and small samples.',
      'See sorted values, sum, count, min, and max so the median and range are easy to verify.',
      'Catch no-mode and multiple-mode data sets before copying the answer.',
      'Copy the four headline descriptive statistics into notes, spreadsheets, homework, or reports.',
    ],
    examples: [
      { label: 'Repeated mode', expression: '10, 12, 12, 15, 18, 21, 21, 21, 25', result: 'Mean = 17.2222222222, median = 18, mode = 21, range = 15' },
      { label: 'No mode', expression: '4, 8, 15, 16, 23, 42', result: 'Mean = 18, median = 15.5, no mode, range = 38' },
      { label: 'Exam scores', expression: '72, 84, 84, 90, 93', result: 'Mean = 84.6, median = 84, mode = 84, range = 21' },
      { label: 'Two modes', expression: '3, 3, 5, 7, 7, 9', result: 'Mean = 5.6666666667, median = 6, modes = 3 and 7, range = 6' },
      { label: 'Decimals and negatives', expression: '-2, 0, 1.5, 1.5, 4', result: 'Mean = 1, median = 1.5, mode = 1.5, range = 6' },
      { label: 'Same value repeated', expression: '12, 12, 12', result: 'Mean = 12, median = 12, mode = 12, range = 0' },
    ],
    faq: [
      {
        question: 'What does the Mean, Median, Mode, Range Calculator calculate?',
        answer:
          'It calculates mean, median, mode, range, sorted values, sum, count, min, and max for one list of numbers.',
      },
      {
        question: 'What is the mean?',
        answer:
          'The mean is the arithmetic average. Add all values, then divide the sum by the count.',
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
        question: 'Can a data set have multiple modes?',
        answer:
          'Yes. If two or more values tie for the highest frequency, the calculator reports each tied mode.',
      },
      {
        question: 'What if every value appears once?',
        answer:
          'The calculator reports no mode when every value appears only once, because no value is more frequent than the others.',
      },
      {
        question: 'What is the range?',
        answer:
          'The range is the maximum value minus the minimum value. It is a quick spread check, but it only uses the two extremes.',
      },
      {
        question: 'What separators can I use?',
        answer:
          'You can separate values with commas, spaces, or line breaks. The calculator sorts the numeric values before finding the median and modes.',
      },
      {
        question: 'Can I use decimals and negative numbers?',
        answer:
          'Yes. Decimal values and negative values are supported as long as each entry is a valid number.',
      },
      {
        question: 'Why should I compare mean and median?',
        answer:
          'The mean uses every value, so very high or low outliers can pull it. The median is often steadier when a data set is skewed.',
      },
      {
        question: 'When should I use the full Statistics Calculator?',
        answer:
          'Use the full Statistics Calculator when you also need quartiles, IQR, variance, standard deviation, or a fuller spread summary.',
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
    summary: 'Calculate nPr and nCr for order-matters and order-does-not-matter counting problems.',
    description:
      'Use this free permutation and combination calculator to find exact nPr and nCr counts, compare order-matters and group-selection problems, and check the formula steps.',
    icon: 'calculator-permutation',
    seoTitle: 'Permutation and Combination Calculator | nPr nCr Tool',
    seoDescription:
      'Calculate exact nPr and nCr counts for permutations, combinations, order-matters arrangements, and group selections.',
    useCases: [
      'Find permutations for rankings, podium finishes, codes, or ordered choices.',
      'Find combinations for committees, card hands, teams, or unordered groups.',
      'Compare nPr and nCr from the same n and r before choosing a probability denominator.',
      'Copy exact integer nPr and nCr results for notes, homework, or study checks.',
    ],
    examples: [
      { label: 'Choose 3 from 10', expression: '10P3 and 10C3', result: '720 permutations, 120 combinations' },
      { label: 'Cards example', expression: '52C5', result: '2,598,960 combinations' },
      { label: 'Podium order', expression: '8P3', result: '336 permutations' },
      { label: 'Four-person committee', expression: '12P4 and 12C4', result: '11,880 permutations, 495 combinations' },
      { label: 'Two finalists', expression: '5P2 and 5C2', result: '20 permutations, 10 combinations' },
      { label: 'Three-letter ordered code', expression: '26P3 and 26C3', result: '15,600 permutations, 2,600 combinations' },
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
          'n is the total number of available items. r is how many of those items are selected or arranged.',
      },
      {
        question: 'What formulas does the calculator use?',
        answer:
          'It uses nPr = n! / (n - r)! for permutations and nCr = n! / (r! x (n - r)!) for combinations.',
      },
      {
        question: 'What does factorial mean?',
        answer:
          'A factorial multiplies whole numbers downward. For example, 5! = 5 x 4 x 3 x 2 x 1. The calculator also treats 0! as 1, which is standard for these formulas.',
      },
      {
        question: 'What input range is supported?',
        answer:
          'This calculator supports whole-number n values from 0 to 500 and r values from 0 to n.',
      },
      {
        question: 'Can r be zero in this calculator?',
        answer:
          'Yes. There is exactly one way to choose or arrange nothing, so both nP0 and nC0 equal 1.',
      },
      {
        question: 'Does this allow repeats or replacement?',
        answer:
          'No. This calculator uses the standard no-replacement nPr and nCr formulas. If an item can be reused, you need a replacement-based counting method.',
      },
      {
        question: 'Why is nPr usually larger than nCr for the same n and r?',
        answer:
          'nPr counts every order separately. nCr groups those ordered arrangements together by dividing by r!, so ABC, ACB, BAC, BCA, CAB, and CBA count as one combination.',
      },
      {
        question: 'How does this connect to probability?',
        answer:
          'Many probability problems use combinations or permutations to count favorable outcomes and total possible outcomes.',
      },
      {
        question: 'What should I double-check before using the answer?',
        answer:
          'Check whether order matters, whether repeats are allowed, whether every item is distinct, and whether the problem asks for arrangements, selections, or a probability built from those counts.',
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
    summary: 'Calculate z confidence intervals for a sample mean or sample proportion.',
    description:
      'Use this free confidence interval calculator to build a z interval for a sample mean or sample proportion, then check the point estimate, standard error, margin of error, lower bound, upper bound, copy result, and recent tab-only history.',
    icon: 'calculator-confidence',
    seoTitle: 'Confidence Interval Calculator | Mean and Proportion CI',
    seoDescription:
      'Use the free Access Free Tools confidence interval calculator to calculate z confidence intervals for a sample mean or proportion with margin of error and steps.',
    useCases: [
      'Calculate a mean confidence interval from a sample mean, standard deviation, sample size, and confidence level.',
      'Calculate a proportion confidence interval from successes, sample size, and confidence level.',
      'Compare how 80%, 90%, 95%, 98%, and 99% confidence levels change the interval width.',
      'Check the point estimate, standard error, margin of error, z-score, lower bound, and upper bound before copying the result.',
      'Use the visible steps to check homework, survey, lab, or quick statistics notes without sending the history to a server.',
    ],
    examples: [
      { label: 'Mean interval', expression: 'Mean 68, SD 3, n = 36, 95%', result: '67.02 to 68.98 with margin about 0.98' },
      { label: 'Proportion interval', expression: '52 successes, n = 100, 95%', result: '42.2% to 61.8% with margin about 9.8 points' },
      { label: 'Narrower confidence level', expression: 'Mean 68, SD 3, n = 36, 90%', result: '67.1775 to 68.8225' },
      { label: 'Wider confidence level', expression: 'Mean 68, SD 3, n = 36, 99%', result: '66.7121 to 69.2879' },
      { label: 'Large survey check', expression: '610 successes, n = 1000, 95%', result: '58.0% to 64.0%' },
    ],
    faq: [
      {
        question: 'What is a confidence interval?',
        answer:
          'A confidence interval is a range around a sample estimate. It gives a plausible range for the population mean or proportion using the confidence level and the sample information you entered.',
      },
      {
        question: 'What interval types are supported?',
        answer:
          'This page supports z intervals for one sample mean and one sample proportion. Mean mode uses sample mean, standard deviation, and sample size. Proportion mode uses successes and sample size.',
      },
      {
        question: 'What formulas does the calculator use?',
        answer:
          'Mean mode uses standard error = standard deviation / sqrt(sample size), then margin of error = z x standard error. Proportion mode uses p-hat = successes / sample size, standard error = sqrt(p-hat x (1 - p-hat) / sample size), then margin of error = z x standard error.',
      },
      {
        question: 'What is margin of error?',
        answer:
          'Margin of error is the amount added to and subtracted from the point estimate to create the lower and upper bounds.',
      },
      {
        question: 'Should I use mean or proportion mode?',
        answer:
          'Use mean mode for numeric averages, such as average score, height, time, or measurement. Use proportion mode for successes out of a total, such as yes responses, defect counts, signups, or pass/fail results.',
      },
      {
        question: 'How does confidence level change the answer?',
        answer:
          'A higher confidence level uses a larger z value, so the interval gets wider. For the same sample, a 99% interval is wider than a 95% interval, and a 90% interval is narrower.',
      },
      {
        question: 'What sample size should I enter?',
        answer:
          'Enter the number of observations in the sample. For mean mode, that is the count behind the sample mean and standard deviation. For proportion mode, it is the total trials or responses, and successes must be between 0 and that sample size.',
      },
      {
        question: 'Why can a proportion interval stop at 0% or 100%?',
        answer:
          'The calculator clamps proportion bounds to the possible range of 0% to 100%. When the sample is small or the success rate is very close to 0% or 100%, a different method such as Wilson or exact intervals may be more appropriate.',
      },
      {
        question: 'Can this replace advanced statistical software?',
        answer:
          'No. It is a quick educational calculator for common z intervals. Advanced studies may need t intervals, paired data, design effects, finite population corrections, exact methods, or statistical review.',
      },
      {
        question: 'What should I double-check before copying the interval?',
        answer:
          'Check that the mean and standard deviation came from the same sample, the sample size is correct, successes do not exceed sample size, and the confidence level matches your assignment or report.',
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
      'Enter three triangle sides and get the area, perimeter, semiperimeter, angles, and triangle type with the formula steps shown.',
    icon: 'calculator-triangle',
    seoTitle: 'Triangle Calculator | Area, Perimeter, and Angles',
    seoDescription:
      'Calculate triangle area, perimeter, semiperimeter, angles, and triangle type from three side lengths with Heron formula steps.',
    useCases: [
      'Find the area of a triangle when you know all three side lengths.',
      'Check whether three side lengths can close into a real triangle.',
      'Estimate triangle angles with the law of cosines.',
      'Tell whether the triangle is scalene, isosceles, equilateral, acute, right, or obtuse.',
    ],
    examples: [
      { label: 'Classic Heron example', expression: '13, 14, 15 cm', result: 'Area = 84 cm^2, perimeter = 42 cm' },
      { label: 'Right triangle check', expression: '3, 4, 5 m', result: 'Area = 6 m^2, scalene right triangle' },
      { label: 'Isosceles triangle', expression: '8, 8, 10 in', result: 'Area is about 31.22 in^2' },
    ],
    faq: [
      {
        question: 'What can I use the Triangle Calculator for?',
        answer:
          'Use it when you know all three side lengths and want area, perimeter, semiperimeter, angles, and triangle type in one check.',
      },
      {
        question: 'What formula does the Triangle Calculator use?',
        answer:
          'It uses Heron\'s formula for area: s = (a + b + c) / 2, then area = sqrt(s(s-a)(s-b)(s-c)). Angles are estimated with the law of cosines.',
      },
      {
        question: 'Can any three side lengths make a triangle?',
        answer:
          'No. The sides must pass the triangle inequality. Each pair of sides must add to more than the third side, or the shape cannot close.',
      },
      {
        question: 'Do I need the triangle height?',
        answer:
          'No. This page is for the three-side case. If you know base and height instead, use the Area Calculator triangle mode.',
      },
      {
        question: 'Does this replace a right triangle calculator?',
        answer:
          'Use this page for any triangle from three sides. Use the Right Triangle Calculator or Pythagorean Theorem Calculator when the problem is only about a 90-degree triangle.',
      },
      {
        question: 'Why are the angles rounded?',
        answer:
          'The angles come from the law of cosines and are rounded for reading. Tiny decimal differences are normal, but the three angles should add to about 180 degrees.',
      },
      {
        question: 'Does the side order matter?',
        answer:
          'The area, perimeter, and triangle type stay the same if you swap the side order. The angle labels follow side a, side b, and side c, so keep the order clear if you are matching a drawing.',
      },
      {
        question: 'Can I use decimal side lengths?',
        answer:
          'Yes. Use positive decimal side lengths when your measurements are not whole numbers, and keep every side in the same unit.',
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
    summary: 'Find cubic volume for boxes, cubes, cylinders, spheres, and cones.',
    description:
      'Use this free volume calculator to find cubic volume for rectangular prisms, cubes, cylinders, spheres, and cones. Enter matching length units, then read the cubic-unit result.',
    icon: 'calculator-volume',
    aliases: [
      'Cylinder Volume Calculator',
      'Rectangle Volume Calculator',
      'Cube Volume Calculator',
      'Sphere Volume Calculator',
      'Cone Volume Calculator',
      'Cubic Volume Calculator',
      'Volume Calculator Gallons',
      'Volume Calculator Litres',
    ],
    seoTitle: 'Volume Calculator | Cubes, Cylinders, Spheres',
    seoDescription:
      'Calculate cubic volume for a box, cube, cylinder, sphere, or cone with matching units, formula steps, examples, and clear limits.',
    useCases: [
      'Check a classroom solid-geometry answer before copying it into notes.',
      'Estimate the inside space of a box, tube, ball-shaped object, or cone-shaped container.',
      'Compare how changing radius, height, length, width, or side length changes volume.',
      'Keep cubic units straight before converting to litres, gallons, or cubic yards in another tool.',
      'Separate volume from surface area when a project needs capacity, not outside covering.',
    ],
    examples: [
      { label: 'Rectangular box', expression: '8 cm x 5 cm x 3 cm', result: '120 cm^3' },
      { label: 'Cylinder can', expression: 'r = 3 cm, h = 10 cm', result: '282.74 cm^3' },
      { label: 'Sphere', expression: 'r = 4 cm', result: '268.08 cm^3' },
      { label: 'Cone', expression: 'r = 3 cm, h = 9 cm', result: '84.82 cm^3' },
    ],
    faq: [
      {
        question: 'Which shapes are supported?',
        answer:
          'The Volume Calculator supports rectangular prism, cube, cylinder, sphere, and cone modes. Pick the shape first so the page only asks for the measurements that shape needs.',
      },
      {
        question: 'What units should I use?',
        answer:
          'Use the same length unit for every measurement. If length is in centimeters, width and height should also be in centimeters, and the answer comes out in cubic centimeters.',
      },
      {
        question: 'Does this convert cubic units to litres or gallons?',
        answer:
          'No. This page finds cubic volume for solid shapes. Use the Conversion Calculator after this if you need litres, gallons, cubic feet, or cubic yards.',
      },
      {
        question: 'What formula does cylinder volume use?',
        answer:
          'Cylinder volume uses V = pi x r^2 x h, where r is radius and h is height. If you measured diameter, divide it by 2 before entering radius.',
      },
      {
        question: 'What formula does cone volume use?',
        answer:
          'Cone volume uses V = pi x r^2 x h / 3. That is one third of a cylinder with the same radius and height.',
      },
      {
        question: 'Is volume the same as surface area?',
        answer:
          'No. Volume measures the space inside a solid in cubic units. Surface area measures the outside covering in square units.',
      },
      {
        question: 'Can I use this for a tank or liquid amount?',
        answer:
          'Use it only as a shape-volume starting point. Real tanks, pools, and containers can have rounded corners, fill lines, slopes, caps, fittings, or labels that change the usable liquid amount.',
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
    relatedSlugs: ['surface-area-calculator', 'area-calculator', 'circle-calculator', 'conversion-calculator'],
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
    summary: 'Calculate flat-shape area for rectangles, triangles, circles, trapezoids, and parallelograms.',
    description:
      'Choose a flat shape, enter the needed measurements, and get the area in square units with formula steps.',
    icon: 'calculator-area',
    seoTitle: 'Area Calculator | Rectangle, Triangle, Circle Area',
    seoDescription:
      'Calculate rectangle, triangle, circle, trapezoid, and parallelogram area with square units, examples, and formula steps.',
    useCases: [
      'Find the area of a room, drawing, garden bed, or school geometry shape.',
      'Compare rectangle, triangle, circle, trapezoid, and parallelogram area without changing tools.',
      'Check answers in square units before using a result in notes, homework, or a project list.',
      'See the formula step so you can spot a wrong unit, radius, base, or height.',
    ],
    examples: [
      { label: 'Rectangle room', expression: '12 ft x 8 ft', result: '96 ft^2' },
      { label: 'Triangle panel', expression: 'base 10 in, height 6 in', result: '30 in^2' },
      { label: 'Circle mat', expression: 'radius 5 ft', result: '78.5398163397 ft^2' },
      { label: 'Trapezoid bed', expression: 'bases 8 ft and 14 ft, height 5 ft', result: '55 ft^2' },
    ],
    faq: [
      {
        question: 'Which shapes are supported?',
        answer:
          'The Area Calculator supports rectangle, triangle, circle, trapezoid, and parallelogram modes.',
      },
      {
        question: 'Is area the same as perimeter?',
        answer:
          'No. Area measures the flat space inside a shape, such as 96 ft^2. Perimeter measures the distance around the outside edge.',
      },
      {
        question: 'What formula does triangle area use?',
        answer:
          'Triangle area uses A = base x height / 2. Use the height that drops straight to the base, not a slanted side.',
      },
      {
        question: 'Should I enter circle radius or diameter?',
        answer:
          'Enter radius. If you measured diameter, divide it by 2 first. A 10 ft diameter circle has a 5 ft radius.',
      },
      {
        question: 'What units should I enter?',
        answer:
          'Use the same length unit for every measurement. The result is reported in square units, such as cm^2 or ft^2.',
      },
      {
        question: 'How do I handle an odd-shaped area?',
        answer:
          'Split it into simple rectangles, triangles, circles, trapezoids, or parallelograms, calculate each part, then add the areas together.',
      },
      {
        question: 'When should I use another tool?',
        answer:
          'Use Square Footage Calculator for room-style flooring jobs, Circle Calculator for all circle measurements, and Surface Area Calculator or Volume Calculator for 3D solids.',
      },
      {
        question: 'Is my area history private?',
        answer:
          'Yes. Recent area answers stay only in the current browser tab while you use the page. They are not sent to a server.',
      },
    ],
    relatedSlugs: ['square-footage-calculator', 'circle-calculator', 'surface-area-calculator'],
  },
  {
    slug: 'distance-calculator',
    name: 'Distance Calculator',
    category: 'calculators',
    summary: 'Calculate straight-line distance, deltas, midpoint, and formula steps.',
    description:
      'Use this free distance calculator to enter two coordinate points and find straight-line distance, delta x, delta y, midpoint, and distance-formula steps.',
    icon: 'calculator-distance',
    seoTitle: 'Distance Calculator | Distance Between Two Points',
    seoDescription:
      'Calculate straight-line distance between two coordinate points with delta x, delta y, midpoint, optional units, examples, and formula steps.',
    useCases: [
      'Find straight-line distance between two points on a coordinate plane.',
      'Check delta x, delta y, and midpoint while working coordinate geometry problems.',
      'Compare coordinate distance with slope, rise, run, and right-triangle side lengths.',
      'Use the formula steps to spot sign mistakes before copying an answer into notes or homework.',
      'Label the answer with the same unit as the coordinates, such as meters, feet, miles, or grid units.',
    ],
    examples: [
      { label: '3-4-5 distance', expression: '(1, 2) to (4, 6)', result: 'delta x 3, delta y 4, distance 5 units' },
      { label: 'Origin to point', expression: '(0, 0) to (8, 15)', result: '17 units' },
      { label: 'Negative coordinates', expression: '(-3, 4) to (5, -2)', result: '10 units' },
      { label: 'Same x-value', expression: '(3, -2) to (3, 7)', result: '9 units with midpoint (3, 2.5)' },
      { label: 'Decimal coordinates', expression: '(2.5, 1) to (6.5, 4)', result: '5 units' },
    ],
    faq: [
      {
        question: 'What formula does the Distance Calculator use?',
        answer:
          'It uses d = sqrt((x2 - x1)^2 + (y2 - y1)^2), the standard straight-line distance formula for two points in a flat coordinate plane.',
      },
      {
        question: 'What do x1, y1, x2, and y2 mean?',
        answer:
          'x1 and y1 are the first point. x2 and y2 are the second point. Enter the coordinates in the same scale and unit so the distance label is meaningful.',
      },
      {
        question: 'Why does the calculator show delta x and delta y?',
        answer:
          'Delta x is x2 - x1, and delta y is y2 - y1. They show the horizontal and vertical changes before the calculator squares them, which makes sign mistakes easier to catch.',
      },
      {
        question: 'Does it show midpoint?',
        answer:
          'Yes. It shows midpoint as ((x1 + x2) / 2, (y1 + y2) / 2), so you can find the point halfway between the two coordinates.',
      },
      {
        question: 'Can I use negative or decimal coordinates?',
        answer:
          'Yes. Negative numbers and decimals work as long as each coordinate is a valid number and all coordinates use the same scale.',
      },
      {
        question: 'What happens if the two points are the same?',
        answer:
          'The distance is 0 because there is no change in x or y. The midpoint is the same coordinate because both endpoints are identical.',
      },
      {
        question: 'What units does the answer use?',
        answer:
          'The answer uses the unit label you enter. If your coordinates are in meters, the distance is in meters. If they are grid units, the result is in grid units. The label is text only, not a unit converter.',
      },
      {
        question: 'Should I use this or the Slope Calculator?',
        answer:
          'Use Distance Calculator for the straight-line length between points. Use Slope Calculator for steepness, rise, run, and line equations from the same pair of points.',
      },
      {
        question: 'How is this related to the Pythagorean theorem?',
        answer:
          'The distance formula is the Pythagorean theorem applied to coordinate changes. Delta x and delta y act like the two legs of a right triangle, and the distance is the hypotenuse.',
      },
      {
        question: 'Can this calculate driving distance or GPS route distance?',
        answer:
          'No. This is straight-line coordinate distance. It does not follow roads, trails, map routes, elevation changes, traffic, or GPS paths.',
      },
      {
        question: 'Can it calculate 3D distance?',
        answer:
          'No. This page is for two-dimensional points only. A 3D distance formula also needs z1 and z2, which should be handled as a separate mode with clear labels.',
      },
      {
        question: 'When should I not rely on this distance answer by itself?',
        answer:
          'Use it as a coordinate-geometry check, not an exact field survey, route estimate, construction measurement, or safety decision. Double-check the coordinate scale, signs, units, and rounding, and use calibrated measurement, GIS data, or professional plans when the limit matters.',
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
      'Use this free circle calculator to start from radius, diameter, circumference, or area and find the other circle measurements with formula steps, units, copy, and history.',
    icon: 'calculator-circle',
    seoTitle: 'Circle Calculator | Radius, Diameter, Area',
    seoDescription:
      'Use the free Access Free Tools circle calculator to find radius, diameter, circumference, and area from one known circle measurement with formula steps and unit checks.',
    useCases: [
      'Convert a known radius into diameter, circumference, and area.',
      'Work backward from diameter, circumference, or area to find radius first.',
      'Check circle formulas for geometry class, quick diagrams, or simple layout planning.',
      'Keep length units and square units straight before copying the result.',
      'Save circle measurements and formula steps into notes or homework checks.',
    ],
    examples: [
      {
        label: 'Known radius',
        expression: 'r = 5 ft',
        result: 'd = 10 ft, C = 31.4159 ft, A = 78.5398 ft^2',
      },
      {
        label: 'Known diameter',
        expression: 'd = 10 in',
        result: 'r = 5 in, C = 31.4159 in, A = 78.5398 in^2',
      },
      {
        label: 'Known circumference',
        expression: 'C = 31.4159 cm',
        result: 'r is about 5 cm and d is about 10 cm',
      },
      {
        label: 'Known area',
        expression: 'A = 78.5398 m^2',
        result: 'r is about 5 m and C is about 31.4159 m',
      },
      {
        label: 'Patio diameter',
        expression: 'd = 24 ft',
        result: 'r = 12 ft and A = 452.3893 ft^2',
      },
    ],
    faq: [
      {
        question: 'What circle measurements can I start with?',
        answer:
          'You can start with radius, diameter, circumference, or area. The calculator finds radius first, then uses that radius to calculate the remaining circle measurements.',
      },
      {
        question: 'What formulas does the Circle Calculator use?',
        answer:
          'It uses d = 2r, C = 2pi r, and A = pi r^2. If you start from diameter, circumference, or area, it rearranges the matching formula to solve for radius before calculating the rest.',
      },
      {
        question: 'What is the difference between radius and diameter?',
        answer:
          'Radius is the distance from the center to the circle edge. Diameter is the full distance across the circle through the center, so diameter is twice the radius.',
      },
      {
        question: 'How does the calculator work backward from circumference?',
        answer:
          'It uses r = C / (2pi). For a circumference of about 31.4159, the radius is about 5 because 31.4159 divided by 2pi is close to 5.',
      },
      {
        question: 'Can I enter area to find radius?',
        answer:
          'Yes. Area mode uses r = sqrt(A / pi) to work backward from a known area. After it finds radius, it calculates diameter and circumference from that radius.',
      },
      {
        question: 'Why does the area result use square units?',
        answer:
          'Radius, diameter, and circumference are lengths, so they use units such as ft or cm. Area covers a flat surface, so it uses square units such as ft^2 or cm^2.',
      },
      {
        question: 'What should I double-check before trusting a circle result?',
        answer:
          'Check whether your known value is radius or diameter, keep the unit label consistent, and remember that measured real objects may not be perfectly round.',
      },
      {
        question: 'Does this calculator handle arcs, sectors, or partial circles?',
        answer:
          'No. It calculates full-circle radius, diameter, circumference, and area. Arc length, sector area, rings, and partial circles need separate inputs and formulas.',
      },
      {
        question: 'Should I use Area Calculator instead?',
        answer:
          'Use Circle Calculator when you want all circle measurements. Use Area Calculator when you only need area for one of several common shapes or you are comparing circles with rectangles, triangles, trapezoids, and parallelograms.',
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
    summary: 'Solve hypotenuse or missing leg lengths with a^2 + b^2 = c^2 and formula steps.',
    description:
      'Use this free Pythagorean theorem calculator to find the hypotenuse, solve a missing leg, check impossible right-triangle inputs, copy steps, and keep recent answers in your browser tab.',
    icon: 'calculator-pythagorean',
    seoTitle: 'Pythagorean Theorem Calculator | Solve a Side',
    seoDescription:
      'Solve a missing right-triangle side with a^2 + b^2 = c^2. Find the hypotenuse or a leg, check invalid inputs, and copy formula steps.',
    useCases: [
      'Find the hypotenuse when both legs are known.',
      'Find a missing leg when one leg and the hypotenuse are known.',
      'Check classic triples such as 3-4-5, 5-12-13, and 8-15-17.',
      'Work with decimal side lengths and optional unit labels.',
      'Catch impossible inputs when the hypotenuse is not the longest side.',
      'Copy formula steps or recent answers while checking right-triangle homework.',
    ],
    examples: [
      { label: 'Find c', expression: 'a=3, b=4', result: 'c = 5' },
      { label: 'Find c with decimals', expression: 'a=5.5, b=7.2', result: 'c is about 9.06' },
      { label: 'Find a', expression: 'b=12, c=13', result: 'a = 5' },
      { label: 'Find b', expression: 'a=8, c=17', result: 'b = 15' },
      { label: 'Construction check', expression: 'a=6 ft, b=8 ft', result: 'diagonal c = 10 ft' },
      { label: 'Invalid side check', expression: 'a=9, c=7', result: 'invalid: c must be longest' },
    ],
    faq: [
      {
        question: 'What formula does the calculator use?',
        answer:
          'It uses the Pythagorean theorem: a^2 + b^2 = c^2, where c is the hypotenuse of a right triangle.',
      },
      {
        question: 'How do I find the hypotenuse?',
        answer:
          'Choose the hypotenuse mode, enter both legs, and the calculator adds a^2 and b^2 before taking the square root.',
      },
      {
        question: 'Can it solve for a missing leg?',
        answer:
          'Yes. If you know the hypotenuse and one leg, it subtracts the known leg squared from the hypotenuse squared, then takes the square root.',
      },
      {
        question: 'Which side is the hypotenuse?',
        answer:
          'The hypotenuse is the side opposite the 90-degree angle. It is always the longest side of a right triangle.',
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
        question: 'Can I use decimals or units?',
        answer:
          'Yes. Decimal side lengths work, and the optional unit label is carried into the result. Keep all side lengths in the same unit.',
      },
      {
        question: 'Why is my answer rounded?',
        answer:
          'Many right-triangle side lengths are not whole numbers. The calculator shows a readable decimal result and the formula steps so you can see the exact operation.',
      },
      {
        question: 'Should I use the Right Triangle Calculator instead?',
        answer:
          'Use this tool when you only need a missing side. Use the Right Triangle Calculator when you also want area, perimeter, and angles.',
      },
      {
        question: 'How is this related to the Distance Calculator?',
        answer:
          'The Distance Calculator uses the same idea on a coordinate plane, where the horizontal and vertical changes act like the two legs.',
      },
      {
        question: 'Can this prove a real corner is square?',
        answer:
          'No. It only solves the numbers you enter. For layout or construction, measure carefully, keep every side in the same unit, and remember the theorem assumes a 90-degree corner.',
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
    summary: 'Solve a right triangle from two sides, including the missing side, area, perimeter, and acute angles.',
    description:
      'Use this free right triangle calculator to enter two known sides and find the missing side, hypotenuse, area, perimeter, acute angles, formula steps, and private recent answers.',
    icon: 'calculator-right-triangle',
    seoTitle: 'Right Triangle Calculator | Sides, Area, Perimeter, Angles',
    seoDescription:
      'Solve a right triangle from two sides. Find the missing side, hypotenuse, area, perimeter, angles, 3-4-5 checks, and formula steps.',
    useCases: [
      'Complete a right triangle from two known side lengths.',
      'Find hypotenuse, missing leg, area, perimeter, and angles together.',
      'Check 3-4-5, 5-12-13, and other right-triangle examples.',
      'Compare side, area, perimeter, and angle results before copying homework notes.',
      'Catch impossible leg-and-hypotenuse inputs before trusting a result.',
      'Copy right-triangle formula steps into notes or homework.',
    ],
    examples: [
      { label: 'Two legs', expression: 'a=9, b=12', result: 'c = 15, area = 54, perimeter = 36' },
      { label: 'Leg and hypotenuse', expression: 'leg=5, c=13', result: 'missing leg = 12, area = 30' },
      { label: 'Classic 3-4-5', expression: 'a=3, b=4', result: 'angles are about 36.87 and 53.13 degrees' },
      { label: 'Construction diagonal', expression: 'a=6 ft, b=8 ft', result: 'diagonal c = 10 ft' },
      { label: 'Decimal sides', expression: 'a=7.5, b=10', result: 'c = 12.5, area = 37.5' },
      { label: 'Invalid hypotenuse', expression: 'leg=9, c=7', result: 'invalid because c must be longest' },
    ],
    faq: [
      {
        question: 'What does the Right Triangle Calculator find?',
        answer:
          'It finds the missing side, hypotenuse, area, perimeter, and the two acute angles for a right triangle. The third angle is the fixed 90-degree angle.',
      },
      {
        question: 'What inputs can I use?',
        answer:
          'Use two legs mode when both legs are known. Use leg and hypotenuse mode when you know one leg and the hypotenuse. Keep every length in the same unit.',
      },
      {
        question: 'What formulas does the calculator use?',
        answer:
          'For two legs, it uses a^2 + b^2 = c^2 to find the hypotenuse. For a missing leg, it subtracts the known leg squared from c^2, then takes the square root.',
      },
      {
        question: 'How are the angles calculated?',
        answer:
          'After the sides are known, the calculator uses trigonometry ratios to estimate the two acute angles. The two acute angles always add up to 90 degrees.',
      },
      {
        question: 'What formula is used for area?',
        answer:
          'Right triangle area uses A = leg a x leg b / 2 because the two legs are perpendicular base and height.',
      },
      {
        question: 'How is perimeter calculated?',
        answer:
          'Perimeter is the sum of all three side lengths: leg a + leg b + hypotenuse c. For a 9-12-15 triangle, the perimeter is 36.',
      },
      {
        question: 'What if my hypotenuse is shorter than the leg?',
        answer:
          'That cannot make a right triangle. The hypotenuse must be the longest side because it is opposite the 90-degree angle.',
      },
      {
        question: 'Can I enter decimals or units?',
        answer:
          'Yes. Decimal side lengths work, and the optional unit label is carried into the length, area, and perimeter results. Use one unit system at a time.',
      },
      {
        question: 'Why are some answers rounded?',
        answer:
          'Many right-triangle side lengths and angles do not end neatly. The calculator rounds long decimals but keeps the formula steps visible so you can check the math.',
      },
      {
        question: 'Which side is the hypotenuse?',
        answer:
          'The hypotenuse is the side opposite the 90-degree angle. It is always the longest side of a valid right triangle.',
      },
      {
        question: 'How is this different from the Pythagorean Theorem Calculator?',
        answer:
          'The Pythagorean Theorem Calculator focuses on one missing side. This calculator also shows area, perimeter, acute angles, and a fuller right-triangle summary.',
      },
      {
        question: 'Should I use the general Triangle Calculator instead?',
        answer:
          'Use the Triangle Calculator when the triangle is not guaranteed to have a 90-degree angle or when you have three side lengths and need a general triangle check.',
      },
      {
        question: 'Can this prove a real corner is square?',
        answer:
          'No. It only solves the measurements you enter. For real layout, measure carefully, keep units consistent, and confirm the corner is meant to be 90 degrees.',
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
    case 'everyday-tools':
      return 'Read the headline answer, then check the smaller lines beside it. For everyday tools, those lines usually show the distance, time, cost, units, or setting that made the answer change.';
    default:
      return 'Read the headline answer, then check the supporting lines and examples to understand how the calculator got there. If one input changes, rerun the tool and compare the new answer instead of guessing.';
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
