import type { BlogPostDefinition } from './blogPosts';
import { utilityTools } from './utilityTools';

interface GuideSection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  links?: Array<{
    href: string;
    label: string;
  }>;
}

export interface UtilityGuideDefinition {
  slug: string;
  toolSlug: string;
  label: string;
  title: string;
  description: string;
  path: string;
  intro: string;
  quickStart: string[];
  sections: GuideSection[];
  sidecarText: string;
}

interface UtilityGuideDetail {
  summary: string;
  purpose: string;
  enter: string[];
  read: string[];
  mistakes: string[];
  sources: Array<{
    href: string;
    label: string;
  }>;
}

const sourceLinks = {
  isoDate: {
    href: 'https://www.iso.org/iso-8601-date-and-time-format.html',
    label: 'ISO: ISO 8601 date and time format',
  },
  mdnDate: {
    href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date',
    label: 'MDN: JavaScript Date reference',
  },
  nistUnits: {
    href: 'https://www.nist.gov/pml/special-publication-811',
    label: 'NIST: Guide for the Use of the International System of Units',
  },
  rfc4632: {
    href: 'https://www.rfc-editor.org/rfc/rfc4632.html',
    label: 'RFC 4632: Classless Inter-domain Routing',
  },
  nistPasswords: {
    href: 'https://pages.nist.gov/800-63-4/sp800-63b.html',
    label: 'NIST SP 800-63B: Authentication and password guidance',
  },
  quickrete: {
    href: 'https://www.quikrete.com/calculator/main.asp',
    label: 'QUIKRETE: Concrete calculator reference',
  },
};

const guideDetails: Record<string, UtilityGuideDetail> = {
  'age-calculator': {
    summary: 'Learn how to calculate exact age from a birth date to any selected date.',
    purpose:
      'The Age Calculator is for exact calendar age, not just an approximate year count. It shows years, months, days, total days, and next birthday timing from two date inputs.',
    enter: [
      'Enter the birth date in the first date field.',
      'Enter the date you want to calculate age on in the second field.',
      'Use a future as-of date when you need age on a deadline, birthday, or event date.',
    ],
    read: [
      'The main answer shows completed years, months, and days.',
      'Total days is useful when you need a continuous day count.',
      'Next birthday helps with countdowns and planning.',
    ],
    mistakes: [
      'Do not use this as a final legal age decision when a rule has its own cutoff.',
      'Do not confuse exact calendar age with rough age by birth year.',
      'Check the as-of date before copying the result.',
    ],
    sources: [sourceLinks.isoDate, sourceLinks.mdnDate],
  },
  'date-calculator': {
    summary: 'Learn how to count days between dates or add and subtract date offsets.',
    purpose:
      'The Date Calculator handles two common jobs: measuring the gap between two dates and moving a date forward or backward by years, months, weeks, and days.',
    enter: [
      'Use Difference mode when you need days between two dates.',
      'Use Add or subtract mode when you need a date before or after a starting date.',
      'Enter dates as calendar dates, not times of day.',
    ],
    read: [
      'Days gives the full day count between dates.',
      'Weeks and days splits that count into whole weeks plus remaining days.',
      'Calendar difference gives a human-friendly years, months, and days view.',
    ],
    mistakes: [
      'Do not use this for business-day counts unless weekends and holidays do not matter.',
      'Do not use it as a time-zone scheduler.',
      'For month-end dates, remember that shorter months may clamp to the last valid day.',
    ],
    sources: [sourceLinks.isoDate, sourceLinks.mdnDate],
  },
  'time-calculator': {
    summary: 'Learn how to add and subtract time durations in hours, minutes, and seconds.',
    purpose:
      'The Time Calculator is for duration math. It helps combine or compare blocks of time such as videos, workouts, tasks, study sessions, or logs.',
    enter: [
      'Enter the first duration as hours, minutes, and seconds.',
      'Choose add or subtract.',
      'Enter the second duration and calculate.',
    ],
    read: [
      'The main answer normalizes the result into hours, minutes, and seconds.',
      'Total seconds is useful for technical logs and media work.',
      'Decimal hours is useful when a duration needs to be entered into another calculator.',
    ],
    mistakes: [
      'Do not use duration math as a time-zone calendar.',
      'Keep minutes and seconds between 0 and 59.',
      'Use the Hours Calculator when you have clock start and end times.',
    ],
    sources: [sourceLinks.isoDate],
  },
  'hours-calculator': {
    summary: 'Learn how to calculate hours worked from a start time, end time, and break.',
    purpose:
      'The Hours Calculator turns a shift into decimal hours and an hours-minutes view. It can also estimate simple gross pay when an hourly rate is entered.',
    enter: [
      'Enter the shift start and end time.',
      'Enter unpaid break minutes.',
      'Add hourly rate only when you want a quick gross pay estimate.',
    ],
    read: [
      'Decimal hours is the value usually used on time sheets.',
      'Hours and minutes gives a more readable duration.',
      'Gross pay multiplies decimal hours by the hourly rate you entered.',
    ],
    mistakes: [
      'Do not treat this as payroll advice.',
      'Check employer rounding, overtime, split-shift, and break rules separately.',
      'For overnight shifts, make sure the end time is the next-day end time you intend.',
    ],
    sources: [sourceLinks.isoDate],
  },
  'gpa-calculator': {
    summary: 'Learn how credits, letter grades, grade points, and quality points create a GPA.',
    purpose:
      'The GPA Calculator explains the standard weighted-average idea behind GPA: grade points multiplied by credits, then divided by total credits.',
    enter: [
      'Enter each course credit value.',
      'Choose the letter grade for each course.',
      'Leave a course at 0 credits when you do not want it included.',
    ],
    read: [
      'GPA is total quality points divided by total credits.',
      'A higher-credit course has more impact than a lower-credit course.',
      'The result uses a common unweighted 4.0 scale.',
    ],
    mistakes: [
      'Do not assume every school uses this exact scale.',
      'Check weighted, honors, AP, pass/fail, repeated-course, and plus/minus rules.',
      'Use your official transcript or registrar for official GPA.',
    ],
    sources: [],
  },
  'grade-calculator': {
    summary: 'Learn how to find the final exam grade needed for a course target.',
    purpose:
      'The Grade Calculator solves a common classroom planning question: what score is needed on the final to reach a desired course grade?',
    enter: [
      'Enter your current course grade as a percent.',
      'Enter how much the final is worth as a percent of the course.',
      'Enter the target course grade you want.',
    ],
    read: [
      'The main answer is the final exam score needed.',
      'Possible without extra credit tells whether the needed score is 100% or lower.',
      'Current coursework weight is the part of the course already represented by the current grade.',
    ],
    mistakes: [
      'Do not use the tool unless your current grade excludes the final exam.',
      'Use the exact weights from the syllabus.',
      'Curves, extra credit, dropped assignments, and category weights can change the real answer.',
    ],
    sources: [],
  },
  'concrete-calculator': {
    summary: 'Learn how to estimate concrete for a slab using length, width, depth, and waste.',
    purpose:
      'The Concrete Calculator is a first-pass material estimator. It converts slab dimensions into cubic feet, cubic yards, cubic meters, and approximate bag counts.',
    enter: [
      'Enter length and width in feet.',
      'Enter slab depth in inches.',
      'Add extra waste percentage when the site, forms, or ordering method need a buffer.',
    ],
    read: [
      'Cubic yards is the common ready-mix ordering unit in the United States.',
      'Cubic feet helps with small projects and bag estimating.',
      'Bag counts are rounded up because you cannot buy a partial bag.',
    ],
    mistakes: [
      'Do not ignore uneven ground, form loss, or compaction.',
      'Check the exact yield printed on the concrete bag.',
      'Ask a qualified contractor or supplier for structural or code-sensitive work.',
    ],
    sources: [sourceLinks.quickrete, sourceLinks.nistUnits],
  },
  'subnet-calculator': {
    summary: 'Learn how IPv4 CIDR subnet math finds network, mask, broadcast, and usable range.',
    purpose:
      'The Subnet Calculator helps developers, students, and network learners check IPv4 CIDR blocks without doing every binary step by hand.',
    enter: [
      'Enter an IPv4 address such as 192.168.1.10.',
      'Enter a CIDR prefix length from 0 to 32.',
      'Calculate to see mask, wildcard, network, broadcast, and usable range.',
    ],
    read: [
      'Network address is the first address in the CIDR block.',
      'Broadcast address is the last address in normal IPv4 subnet notation.',
      'Usable range excludes network and broadcast except for /31 and /32 style cases.',
    ],
    mistakes: [
      'Do not use this for IPv6 subnetting.',
      'Do not assume the calculator changes any live network setting.',
      'Check your router, cloud provider, or firewall rules before applying subnet plans.',
    ],
    sources: [sourceLinks.rfc4632],
  },
  'password-generator': {
    summary: 'Learn how to generate strong unique passwords safely in the browser.',
    purpose:
      'The Password Generator creates a random password from the character types you choose. It is designed for unique passwords that you store in a trusted password manager.',
    enter: [
      'Choose a length. Longer is usually stronger.',
      'Choose which character types are allowed.',
      'Use avoid ambiguous characters when you need to type or read the password manually.',
    ],
    read: [
      'The password is the main answer and can be copied.',
      'Entropy is an estimate based on length and character pool size.',
      'The tool does not add generated passwords to recent history.',
    ],
    mistakes: [
      'Do not reuse generated passwords across accounts.',
      'Do not paste passwords into untrusted pages.',
      'Do not rely on memory for long random passwords; use a password manager.',
    ],
    sources: [sourceLinks.nistPasswords],
  },
  'conversion-calculator': {
    summary: 'Learn how common length, mass, volume, and temperature conversions work.',
    purpose:
      'The Conversion Calculator gives quick metric and U.S. customary conversions for everyday work, school, cooking, and planning examples.',
    enter: [
      'Choose the conversion category.',
      'Enter the starting value.',
      'Choose the source and target units, then calculate.',
    ],
    read: [
      'The main answer shows the converted value and target unit.',
      'Most units convert through a category base unit.',
      'Temperature converts through Celsius because temperature scales have offsets.',
    ],
    mistakes: [
      'Do not mix categories such as length and volume.',
      'For regulated work, use the exact standard your field requires.',
      'Check whether a recipe or product uses U.S., imperial, dry, or metric units.',
    ],
    sources: [sourceLinks.nistUnits],
  },
};

function getFormulaAnswer(toolSlug: string) {
  return utilityTools.find((tool) => tool.slug === toolSlug)?.faq[1]?.answer ?? 'The calculator uses the formula shown on the tool page.';
}

function makeGuide(toolSlug: string): UtilityGuideDefinition {
  const tool = utilityTools.find((candidate) => candidate.slug === toolSlug);
  const detail = guideDetails[toolSlug];

  if (!tool || !detail) {
    throw new Error(`Missing utility guide detail for ${toolSlug}`);
  }

  return {
    slug: `how-to-use-${tool.slug}`,
    toolSlug: tool.slug,
    label: `${tool.name} guide`,
    title: `How to use the ${tool.name}`,
    description: detail.summary,
    path: `/blog/how-to-use-${tool.slug}/`,
    intro: `${detail.purpose} This guide shows what to enter, how to read the result, and which assumptions to double-check.`,
    quickStart: detail.enter,
    sections: [
      {
        title: 'What the calculator is doing',
        paragraphs: [getFormulaAnswer(tool.slug)],
      },
      {
        title: 'How to read the answer',
        paragraphs: ['After calculating, read the main answer first, then use the supporting metrics to understand the context.'],
        bullets: detail.read,
      },
      {
        title: 'Common mistakes to avoid',
        paragraphs: ['Most wrong answers come from using the wrong unit, date, weight, scale, or policy assumption.'],
        bullets: detail.mistakes,
      },
      {
        title: 'Research and references',
        paragraphs: [
          detail.sources.length > 0
            ? 'These references shaped the calculator assumptions, unit choices, or safety notes.'
            : 'This guide uses the calculator inputs, formula notes, and common school or everyday usage patterns. Confirm official policy with your school, workplace, or organization when needed.',
        ],
        links: detail.sources,
      },
    ],
    sidecarText: `Open the ${tool.name} and try the examples from this guide with your own values.`,
  };
}

export const utilityBlogGuides: UtilityGuideDefinition[] = utilityTools.map((tool) => makeGuide(tool.slug));

export const utilityBlogPosts: BlogPostDefinition[] = utilityBlogGuides.map((guide) => ({
  slug: guide.slug,
  title: guide.title,
  label: guide.label,
  summary: guide.description,
}));
