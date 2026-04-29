import { financeBlogPosts } from './financeBlogGuides';
import { healthBlogPosts } from './healthBlogGuides';
import { utilityBlogPosts } from './utilityBlogGuides';

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
    slug: 'how-to-use-ratio-calculator',
    title: 'How to use the Ratio Calculator',
    label: 'Ratio calculator guide',
    summary:
      'Learn how to simplify ratios, make equivalent ratios, split totals by ratio parts, handle decimals, and check proportions.',
  },
  {
    slug: 'how-to-use-percent-error-calculator',
    title: 'How to use the Percent Error Calculator',
    label: 'Percent error calculator guide',
    summary:
      'Learn how to compare measured and accepted values, calculate percent error, read signed percent error, and avoid common lab-report mistakes.',
  },
  {
    slug: 'how-to-use-half-life-calculator',
    title: 'How to use the Half-Life Calculator',
    label: 'Half-life calculator guide',
    summary:
      'Learn how to calculate remaining amount, elapsed time, and half-life with decay formulas, matching units, examples, and privacy notes.',
  },
  {
    slug: 'how-to-use-exponent-calculator',
    title: 'How to use the Exponent Calculator',
    label: 'Exponent calculator guide',
    summary:
      'Learn how to calculate powers, negative exponents, zero exponents, fraction exponents, scientific notation, and common exponent mistakes.',
  },
  {
    slug: 'how-to-use-log-calculator',
    title: 'How to use the Log Calculator',
    label: 'Log calculator guide',
    summary:
      'Learn how to calculate logarithms with custom bases, use ln and log10, read change-of-base steps, and check answers with exponents.',
  },
  {
    slug: 'how-to-use-root-calculator',
    title: 'How to use the Root Calculator',
    label: 'Root calculator guide',
    summary:
      'Learn how to calculate square roots, cube roots, nth roots, exponent form, negative radicands, and real-number root checks.',
  },
  {
    slug: 'how-to-use-quadratic-formula-calculator',
    title: 'How to use the Quadratic Formula Calculator',
    label: 'Quadratic formula guide',
    summary:
      'Learn how to solve ax^2 + bx + c = 0, read the discriminant, find real or complex roots, and use vertex details.',
  },
  {
    slug: 'how-to-use-binary-calculator',
    title: 'How to use the Binary Calculator',
    label: 'Binary calculator guide',
    summary:
      'Learn how to add, subtract, multiply, divide, and convert binary numbers with base-2 place values, decimal checks, and remainders.',
  },
  {
    slug: 'how-to-use-hex-calculator',
    title: 'How to use the Hex Calculator',
    label: 'Hex calculator guide',
    summary:
      'Learn how to add, subtract, multiply, divide, and convert hexadecimal numbers with base-16 digits, decimal checks, binary output, and remainders.',
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
    slug: 'how-to-use-least-common-multiple-calculator',
    title: 'LCM Calculator Guide',
    label: 'LCM calculator guide',
    summary:
      'Learn how to find the least common multiple of two or more whole numbers, read the steps, and use LCM for fractions and schedules.',
  },
  {
    slug: 'how-to-use-greatest-common-factor-calculator',
    title: 'GCF Calculator Guide',
    label: 'GCF calculator guide',
    summary:
      'Learn how to find the greatest common factor, compare GCF with LCM, simplify fractions, and read exact integer steps.',
  },
  {
    slug: 'how-to-use-factor-calculator',
    title: 'How to use the Factor Calculator',
    label: 'Factor calculator guide',
    summary:
      'Learn how to list factors, factor pairs, prime factors, and prime factorization for positive whole numbers.',
  },
  {
    slug: 'how-to-use-rounding-calculator',
    title: 'How to use the Rounding Calculator',
    label: 'Rounding calculator guide',
    summary:
      'Learn how to round by decimal places, significant figures, and place value using nearest, up, down, and truncate methods.',
  },
  {
    slug: 'how-to-use-matrix-calculator',
    title: 'How to use the Matrix Calculator',
    label: 'Matrix calculator guide',
    summary:
      'Learn how to add, subtract, multiply, transpose, and find determinants for 2x2 and 3x3 matrices.',
  },
  {
    slug: 'how-to-use-scientific-notation-calculator',
    title: 'How to use the Scientific Notation Calculator',
    label: 'Scientific notation guide',
    summary:
      'Learn how to convert standard numbers to scientific notation and convert coefficient-times-power-of-10 form back to standard form.',
  },
  {
    slug: 'how-to-use-big-number-calculator',
    title: 'How to use the Big Number Calculator',
    label: 'Big number calculator guide',
    summary:
      'Learn how to add, subtract, multiply, and divide very large whole numbers exactly with quotient and remainder output.',
  },
  {
    slug: 'how-to-use-standard-deviation-calculator',
    title: 'How to use the Standard Deviation Calculator',
    label: 'Standard deviation guide',
    summary:
      'Learn how to calculate sample or population standard deviation, variance, mean, range, and formula steps from a data set.',
  },
  {
    slug: 'how-to-use-number-sequence-calculator',
    title: 'How to use the Number Sequence Calculator',
    label: 'Number sequence guide',
    summary:
      'Learn how to generate arithmetic, geometric, and Fibonacci sequences, find the rule, and copy the next terms.',
  },
  {
    slug: 'how-to-use-sample-size-calculator',
    title: 'How to use the Sample Size Calculator',
    label: 'Sample size guide',
    summary:
      'Learn how confidence level, margin of error, population proportion, and finite population size affect survey sample size.',
  },
  {
    slug: 'how-to-use-probability-calculator',
    title: 'How to use the Probability Calculator',
    label: 'Probability calculator guide',
    summary:
      'Learn how to calculate P(A and B), P(A or B), complements, independent-event intersections, and probability steps.',
  },
  {
    slug: 'how-to-use-statistics-calculator',
    title: 'How to use the Statistics Calculator',
    label: 'Statistics calculator guide',
    summary:
      'Learn how to get mean, median, mode, range, quartiles, variance, and standard deviation from one list of values.',
  },
  {
    slug: 'how-to-use-mean-median-mode-range-calculator',
    title: 'How to use the Mean, Median, Mode, Range Calculator',
    label: 'Mean median mode range guide',
    summary:
      'Learn how to find the main measures of center and spread: mean, median, mode, and range.',
  },
  {
    slug: 'how-to-use-permutation-and-combination-calculator',
    title: 'How to use the Permutation and Combination Calculator',
    label: 'Permutation combination guide',
    summary:
      'Learn when to use nPr or nCr, how order changes counting, and how exact integer answers are calculated.',
  },
  {
    slug: 'how-to-use-z-score-calculator',
    title: 'How to use the Z-score Calculator',
    label: 'Z-score calculator guide',
    summary:
      'Learn how to standardize a value, read above-or-below-average direction, and estimate a normal percentile.',
  },
  {
    slug: 'how-to-use-confidence-interval-calculator',
    title: 'How to use the Confidence Interval Calculator',
    label: 'Confidence interval guide',
    summary:
      'Learn how to calculate z confidence intervals for a mean or proportion with margin of error and clear formula steps.',
  },
  {
    slug: 'how-to-use-triangle-calculator',
    title: 'How to use the Triangle Calculator',
    label: 'Triangle calculator guide',
    summary:
      'Learn how to calculate triangle area, perimeter, angles, and triangle type from three side lengths.',
  },
  {
    slug: 'how-to-use-volume-calculator',
    title: 'How to use the Volume Calculator',
    label: 'Volume calculator guide',
    summary:
      'Learn how to calculate volume for rectangular prisms, cubes, cylinders, spheres, and cones with cubic units.',
  },
  {
    slug: 'how-to-use-slope-calculator',
    title: 'How to use the Slope Calculator',
    label: 'Slope calculator guide',
    summary:
      'Learn how to find slope from two points, read rise over run, identify vertical lines, and use line equations.',
  },
  {
    slug: 'how-to-use-area-calculator',
    title: 'How to use the Area Calculator',
    label: 'Area calculator guide',
    summary:
      'Learn how to calculate area for rectangles, triangles, circles, trapezoids, and parallelograms.',
  },
  {
    slug: 'how-to-use-distance-calculator',
    title: 'How to use the Distance Calculator',
    label: 'Distance calculator guide',
    summary:
      'Learn how to calculate distance between two points, delta x, delta y, and midpoint from coordinates.',
  },
  {
    slug: 'how-to-use-circle-calculator',
    title: 'How to use the Circle Calculator',
    label: 'Circle calculator guide',
    summary:
      'Learn how to find radius, diameter, circumference, and area from one known circle measurement.',
  },
  {
    slug: 'how-to-use-surface-area-calculator',
    title: 'How to use the Surface Area Calculator',
    label: 'Surface area guide',
    summary:
      'Learn how to calculate surface area for rectangular prisms, cubes, cylinders, spheres, and cones.',
  },
  {
    slug: 'how-to-use-pythagorean-theorem-calculator',
    title: 'How to use the Pythagorean Theorem Calculator',
    label: 'Pythagorean theorem guide',
    summary:
      'Learn how to solve a missing right-triangle side with a^2 + b^2 = c^2.',
  },
  {
    slug: 'how-to-use-right-triangle-calculator',
    title: 'How to use the Right Triangle Calculator',
    label: 'Right triangle guide',
    summary:
      'Learn how to solve right triangle sides, area, perimeter, and acute angles from two known sides.',
  },
  {
    slug: 'how-to-use-random-number-generator',
    title: 'How to use the Random Number Generator',
    label: 'Random number generator guide',
    summary:
      'Learn how to pick one random number, generate lists, use unique results, exclude numbers, sort results, copy answers, and understand everyday-use limits.',
  },
  ...financeBlogPosts,
  ...healthBlogPosts,
  ...utilityBlogPosts,
];
