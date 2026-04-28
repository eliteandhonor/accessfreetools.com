export type CategorySlug =
  | 'calculators'
  | 'converters'
  | 'text-tools'
  | 'date-time'
  | 'finance'
  | 'health-fitness'
  | 'developer-tools'
  | 'image-tools'
  | 'school-study'
  | 'everyday-tools';

export interface ToolCategory {
  slug: CategorySlug;
  name: string;
  summary: string;
}

export const categories: ToolCategory[] = [
  {
    slug: 'calculators',
    name: 'Calculators',
    summary: 'Everyday math, finance, school, and measurement calculators.',
  },
  {
    slug: 'converters',
    name: 'Converters',
    summary: 'Unit, file, color, text, and measurement conversion tools.',
  },
  {
    slug: 'text-tools',
    name: 'Text Tools',
    summary: 'Word counts, case changes, cleanups, and formatting helpers.',
  },
  {
    slug: 'date-time',
    name: 'Date & Time',
    summary: 'Date differences, time zones, countdowns, and scheduling helpers.',
  },
  {
    slug: 'finance',
    name: 'Finance',
    summary: 'Savings, budget, payment, interest, and comparison tools.',
  },
  {
    slug: 'health-fitness',
    name: 'Health & Fitness',
    summary: 'Simple wellness calculators with clear educational disclaimers.',
  },
  {
    slug: 'developer-tools',
    name: 'Developer Tools',
    summary: 'Encoding, formatting, JSON, URL, and productivity utilities.',
  },
  {
    slug: 'image-tools',
    name: 'Image Tools',
    summary: 'Simple browser-based image helpers for daily creative tasks.',
  },
  {
    slug: 'school-study',
    name: 'School & Study',
    summary: 'Student-friendly tools for notes, math, timing, and planning.',
  },
  {
    slug: 'everyday-tools',
    name: 'Everyday Tools',
    summary: 'Quick utilities for ordinary tasks, decisions, and checklists.',
  },
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}
