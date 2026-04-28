export interface BlogPostDefinition {
  slug: string;
  title: string;
  label: string;
  summary: string;
}

export const blogPosts: BlogPostDefinition[] = [
  {
    slug: 'how-to-use-basic-calculator',
    title: 'How to use the Basic Calculator',
    label: 'Calculator guide',
    summary:
      'Learn the keypad, keyboard shortcuts, percent button, copy result action, and calculation history using the Access Free Tools calculator.',
  },
  {
    slug: 'how-to-use-percentage-calculator',
    title: 'How to use the Percentage Calculator',
    label: 'Percentage calculator guide',
    summary:
      'Learn how to find percent of a number, what percent one number is of another, percentage change, discounts, markups, and reverse percentages.',
  },
  {
    slug: 'how-to-use-kawaii-calculator',
    title: 'How to use the Kawaii Calculator',
    label: 'Kawaii calculator guide',
    summary:
      'Learn when to use the cute pastel calculator, how its buttons and shortcuts work, and how to keep recent calculations private in the browser.',
  },
  {
    slug: 'how-to-use-scientific-calculator',
    title: 'How to use the Scientific Calculator',
    label: 'Scientific calculator guide',
    summary:
      'Learn DEG/RAD mode, typed expressions, trig functions, logs, roots, powers, constants, history, and when this tool is useful.',
  },
  {
    slug: 'how-to-use-fraction-calculator',
    title: 'How to use the Fraction Calculator',
    label: 'Fraction calculator guide',
    summary:
      'Learn how to add, subtract, multiply, divide, simplify, and convert fractions and mixed numbers with the Fraction Calculator.',
  },
  {
    slug: 'how-to-use-random-number-generator',
    title: 'How to use the Random Number Generator',
    label: 'Random number generator guide',
    summary:
      'Learn how to pick one random number, generate lists, use unique results, exclude numbers, sort results, copy answers, and understand everyday-use limits.',
  },
];
