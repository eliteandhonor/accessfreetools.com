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
  rfc4648: {
    href: 'https://datatracker.ietf.org/doc/html/rfc4648/',
    label: 'IETF RFC 4648: Base-N Encodings',
  },
  rfc3986: {
    href: 'https://datatracker.ietf.org/doc/rfc3986/',
    label: 'IETF RFC 3986: URI Generic Syntax',
  },
  ianaTimeZones: {
    href: 'https://www.iana.org/time-zones',
    label: 'IANA: Time Zone Database',
  },
  dolHours: {
    href: 'https://www.dol.gov/general/topic/workhours/hoursrecordkeeping',
    label: 'U.S. Department of Labor: Hours recordkeeping',
  },
  epaFuelEconomy: {
    href: 'https://www.epa.gov/fueleconomy',
    label: 'U.S. EPA: Fuel Economy',
  },
  irsMileage: {
    href: 'https://www.irs.gov/newsroom/irs-sets-2026-business-standard-mileage-rate-at-725-cents-per-mile-up-25-cents',
    label: 'IRS: 2026 standard mileage rates',
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
      'The GPA Calculator explains GPA as a weighted average, not a simple average of letter grades. Each letter grade becomes grade points, those points are multiplied by course credits, and the total is divided by total credits. That is why a 4-credit class changes GPA more than a 1-credit class.',
    enter: [
      'Enter each course credit value.',
      'Choose the letter grade for each course.',
      'Leave a course at 0 credits when you do not want it included.',
    ],
    read: [
      'GPA is total quality points divided by total credits.',
      'Quality points are grade points multiplied by credits for each class.',
      'A higher-credit course has more impact than a lower-credit course because it adds more quality points.',
      'The result uses a common unweighted 4.0 scale unless your school says otherwise.',
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
  'dice-roller': {
    summary: 'Learn how to roll custom dice, read each roll, and understand everyday randomness limits.',
    purpose:
      'The Dice Roller is for quick, casual random rolls. It shows every die, the subtotal, the modifier, and the final total so the result is easy to check.',
    enter: [
      'Enter how many dice you want to roll.',
      'Enter the number of sides per die.',
      'Add a modifier only when the game or example calls for one.',
    ],
    read: [
      'The main answer is the final total after the modifier.',
      'Rolls shows the individual die results.',
      'Subtotal is the dice total before the modifier.',
    ],
    mistakes: [
      'Do not use this for gambling, official drawings, or audited random selection.',
      'Check whether your game needs one die, multiple dice, or a modifier.',
      'Remember that random rolls can repeat and do not balance out in short runs.',
    ],
    sources: [],
  },
  'fuel-cost-calculator': {
    summary: 'Learn how distance, MPG, and fuel price combine into a trip fuel estimate.',
    purpose:
      'The Fuel Cost Calculator helps you turn a trip distance into an estimated fuel budget using your vehicle MPG and the fuel price you expect to pay.',
    enter: [
      'Enter the one-way trip distance in miles.',
      'Enter the vehicle MPG you want to use.',
      'Enter fuel price per gallon and turn on round trip when needed.',
    ],
    read: [
      'Fuel cost is the headline estimate.',
      'Gallons needed shows how much fuel the trip uses at the entered MPG.',
      'Cost per mile helps compare trips and vehicles.',
    ],
    mistakes: [
      'Do not assume EPA MPG is exactly what your trip will get.',
      'Check whether the distance is one-way or round-trip.',
      'Use the fuel price you expect to pay, not an old saved value.',
    ],
    sources: [sourceLinks.epaFuelEconomy],
  },
  'square-footage-calculator': {
    summary: 'Learn how to calculate square footage for rooms, panels, and repeated rectangles.',
    purpose:
      'The Square Footage Calculator handles rectangular areas. It is useful for rooms, floors, walls, panels, garden beds, and repeated sections.',
    enter: [
      'Enter length and width in feet.',
      'Use quantity when the same rectangle repeats.',
      'Keep all measurements in feet before calculating.',
    ],
    read: [
      'Total square feet is the main area answer.',
      'Each item shows the area of one rectangle.',
      'Square yards and square meters are shown for conversion context.',
    ],
    mistakes: [
      'Do not use a rectangle formula for irregular shapes without splitting them into sections.',
      'Add waste separately for flooring, tile, paint, or cuts.',
      'Check whether product coverage is listed per box, per roll, or per gallon.',
    ],
    sources: [sourceLinks.nistUnits],
  },
  'time-card-calculator': {
    summary: 'Learn how to total work hours from daily start times, end times, and breaks.',
    purpose:
      'The Time Card Calculator adds simple weekday shifts into a weekly total. It is for quick personal estimates before checking official payroll rules.',
    enter: [
      'Enter start time, end time, and unpaid break minutes for each worked day.',
      'Leave a day blank when it was not worked.',
      'Add hourly rate only when you want a gross pay estimate.',
    ],
    read: [
      'Weekly hours is the main result.',
      'Hours and minutes gives a readable version of the decimal total.',
      'Gross pay estimate multiplies total hours by the rate you entered.',
    ],
    mistakes: [
      'Do not treat this as payroll or overtime advice.',
      'Check employer rounding, paid break, meal, and overtime rules.',
      'Make sure overnight shifts use the intended next-day end time.',
    ],
    sources: [sourceLinks.dolHours],
  },
  'time-zone-calculator': {
    summary: 'Learn how to convert a UTC date and time into an IANA time zone.',
    purpose:
      'The Time Zone Calculator uses UTC as the starting point because UTC avoids ambiguity. It then shows the local date, local time, and offset for the selected time zone.',
    enter: [
      'Enter the UTC calendar date.',
      'Enter the UTC clock time.',
      'Choose the target IANA time zone.',
    ],
    read: [
      'The main answer shows the local date and time in the selected zone.',
      'UTC offset shows how far that zone is from UTC at that instant.',
      'The IANA zone name is shown so you can copy the exact zone identifier.',
    ],
    mistakes: [
      'Do not enter a local time and assume it is UTC.',
      'Check daylight-saving dates carefully.',
      'Use an official calendar invite or scheduling system for critical meetings.',
    ],
    sources: [sourceLinks.ianaTimeZones],
  },
  'gas-mileage-calculator': {
    summary: 'Learn how to calculate MPG from miles driven and gallons used.',
    purpose:
      'The Gas Mileage Calculator turns a real tank or trip into MPG. It also shows gallons per 100 miles and liters per 100 km for comparison.',
    enter: [
      'Enter miles driven since the last fill or for the trip.',
      'Enter gallons used for the same distance.',
      'Use the same trip window for both numbers.',
    ],
    read: [
      'MPG is the main fuel economy answer.',
      'Gallons per 100 miles shows consumption rather than distance per gallon.',
      'L/100 km is useful for metric comparisons.',
    ],
    mistakes: [
      'Do not mix miles from one trip with gallons from another.',
      'Fill-level differences can make one-tank MPG noisy.',
      'Weather, traffic, load, and speed can change the result.',
    ],
    sources: [sourceLinks.epaFuelEconomy, sourceLinks.nistUnits],
  },
  'tip-calculator': {
    summary: 'Learn how to calculate a tip, optional tax, total bill, and split amount.',
    purpose:
      'The Tip Calculator is for quick bill math. It helps you compare tip percentages and split the estimated total between people.',
    enter: [
      'Enter the bill subtotal.',
      'Enter the tip percentage you want to use.',
      'Enter tax percentage and people only when needed.',
    ],
    read: [
      'Total is subtotal plus tip plus optional tax.',
      'Tip shows the dollar amount from the tip percent.',
      'Per person divides the total evenly by the number of people.',
    ],
    mistakes: [
      'Check whether the receipt already includes service charge or gratuity.',
      'Check whether you want to tip before tax or after tax.',
      'For uneven splits, calculate each person separately.',
    ],
    sources: [],
  },
  'mileage-calculator': {
    summary: 'Learn how to multiply miles by a rate and add trip extras.',
    purpose:
      'The Mileage Calculator estimates a mileage amount from miles and a rate per mile. It can also add parking, tolls, or other entered trip costs.',
    enter: [
      'Enter the miles driven.',
      'Enter the rate per mile you are allowed or choosing to use.',
      'Enter parking, tolls, or extras only if they should be included.',
    ],
    read: [
      'Total is mileage amount plus extras.',
      'Mileage only shows miles multiplied by rate.',
      'Rate is shown so you can confirm the assumption.',
    ],
    mistakes: [
      'Do not assume the default example rate is the rate you should use.',
      'Use your employer, client, tax authority, or contract rule first.',
      'Keep documentation if the mileage is for reimbursement or taxes.',
    ],
    sources: [sourceLinks.irsMileage],
  },
  'density-calculator': {
    summary: 'Learn how mass divided by volume gives density.',
    purpose:
      'The Density Calculator is a direct formula helper for science, materials, and classroom examples where mass and volume are known.',
    enter: [
      'Enter mass.',
      'Enter volume.',
      'Enter a unit label such as g/mL or kg/m3 if it helps your notes.',
    ],
    read: [
      'Density is the main answer.',
      'Mass and volume are repeated so you can check the formula.',
      'The unit label is only text, so make sure the units match.',
    ],
    mistakes: [
      'Do not mix grams with cubic meters unless your density label reflects that.',
      'Use calibrated measurements for lab or engineering work.',
      'Temperature and material condition can affect real density.',
    ],
    sources: [sourceLinks.nistUnits],
  },
  'mass-calculator': {
    summary: 'Learn how density multiplied by volume gives mass.',
    purpose:
      'The Mass Calculator rearranges the density formula. If density and volume are known, multiplying them gives mass.',
    enter: [
      'Enter density.',
      'Enter volume.',
      'Enter the mass unit label you want to show.',
    ],
    read: [
      'Mass is the main answer.',
      'Density and volume are repeated for checking.',
      'Formula shows density multiplied by volume.',
    ],
    mistakes: [
      'Do not use mismatched density and volume units.',
      'Remember that this is not a scale measurement.',
      'Use material-specific density when estimating real objects.',
    ],
    sources: [sourceLinks.nistUnits],
  },
  'weight-calculator': {
    summary: 'Learn the difference between mass and weight force.',
    purpose:
      'The Weight Calculator estimates weight force from mass and gravity. In physics, weight is a force, while mass is the amount of matter.',
    enter: [
      'Enter mass in kilograms.',
      'Use 9.80665 m/s2 for standard Earth gravity or enter another gravity value.',
      'Calculate to see newtons and pounds-force.',
    ],
    read: [
      'Newtons is the main weight force result.',
      'Pounds-force gives a familiar force comparison.',
      'Mass in pounds is shown separately so mass and force are not confused.',
    ],
    mistakes: [
      'Do not use weight force as a safety-rated load calculation.',
      'Do not confuse pounds mass with pounds-force.',
      'Gravity changes by location, altitude, and planet or moon.',
    ],
    sources: [sourceLinks.nistUnits],
  },
  'speed-calculator': {
    summary: 'Learn how distance divided by time gives average speed.',
    purpose:
      'The Speed Calculator finds average speed over a whole trip or activity. It converts the time fields into decimal hours before calculating mph.',
    enter: [
      'Enter distance in miles.',
      'Enter hours, minutes, and seconds for the elapsed time.',
      'Use zero for unused time fields.',
    ],
    read: [
      'MPH is the main average speed.',
      'km/h and m/s are converted versions of the same speed.',
      'Decimal hours shows the time value used in the division.',
    ],
    mistakes: [
      'Do not use this as instant speed.',
      'Include stops if you want whole-trip average speed.',
      'Use matching distance and elapsed time from the same trip.',
    ],
    sources: [sourceLinks.nistUnits],
  },
  'roman-numeral-converter': {
    summary: 'Learn how standard Roman numerals convert to and from numbers.',
    purpose:
      'The Roman Numeral Converter supports standard modern Roman numerals from 1 through 3,999, including subtractive pairs like IV and CM.',
    enter: [
      'Choose number-to-Roman or Roman-to-number mode.',
      'Enter a number from 1 to 3,999 or a standard Roman numeral.',
      'Calculate and compare the result with the examples.',
    ],
    read: [
      'The main answer is the converted numeral or number.',
      'Mode confirms which direction was used.',
      'Range reminds you that overline notation is not supported.',
    ],
    mistakes: [
      'Do not enter nonstandard repeats like IIII.',
      'Use subtractive pairs such as IV for 4 and IX for 9.',
      'Numbers 4,000 and above need notation this tool does not support.',
    ],
    sources: [sourceLinks.nistUnits],
  },
  'base64-encode-decode': {
    summary: 'Learn how Base64 turns bytes into printable text and back again.',
    purpose:
      'The Base64 tool encodes text as UTF-8 bytes before converting to Base64. It can also decode Base64 back into UTF-8 text when the data is valid text.',
    enter: [
      'Choose Encode when starting with readable text.',
      'Choose Decode when starting with Base64.',
      'Paste the text into the input field and run the tool.',
    ],
    read: [
      'The main answer is the encoded or decoded text.',
      'Input and output length help you check whether the conversion looks reasonable.',
      'Mode confirms whether you encoded or decoded.',
    ],
    mistakes: [
      'Do not treat Base64 as encryption.',
      'Do not paste secrets into tools unless you trust the environment.',
      'Decode mode expects Base64 that represents valid UTF-8 text.',
    ],
    sources: [sourceLinks.rfc4648],
  },
  'url-encode-decode': {
    summary: 'Learn how URL percent-encoding protects reserved characters in URL components.',
    purpose:
      'The URL Encode / Decode tool is made for URL components, especially query values. It turns reserved characters into percent-encoded text and decodes them back.',
    enter: [
      'Choose Encode for readable text or Decode for percent-encoded text.',
      'Paste the URL component value, not necessarily a whole URL.',
      'Turn on plus-spaces when working with form-style values.',
    ],
    read: [
      'The main answer is the encoded or decoded text.',
      'Spaces line shows whether spaces used %20 or plus signs.',
      'Input and output length help spot accidental extra characters.',
    ],
    mistakes: [
      'Do not encode a full URL the same way as one query value.',
      'Do not decode the same value repeatedly unless you know it was double-encoded.',
      'Use plus mode only for form-style values where plus means space.',
    ],
    sources: [sourceLinks.rfc3986],
  },
  'day-of-the-week-calculator': {
    summary: 'Learn how to find the weekday for any valid calendar date.',
    purpose:
      'The Day of the Week Calculator answers a simple date question: what weekday does this calendar date fall on?',
    enter: [
      'Choose a valid date.',
      'Calculate to get the weekday name.',
      'Use examples for today, future dates, and leap-day checks.',
    ],
    read: [
      'The main answer is the weekday name.',
      'ISO weekday uses Monday as 1 and Sunday as 7.',
      'Sunday-based index uses Sunday as 0, matching many programming APIs.',
    ],
    mistakes: [
      'Do not use this for historical calendar reform research.',
      'Check time zones separately when an event happens near midnight.',
      'Use the Date Calculator when you need days between two dates.',
    ],
    sources: [sourceLinks.isoDate],
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
    intro: `${detail.purpose} Use this guide as a short walkthrough: enter the values the calculator asks for, read the main answer first, then check the notes so you know what the number does and does not mean.`,
    quickStart: detail.enter,
    sections: [
      {
        title: 'What this calculator is solving',
        paragraphs: [
          detail.purpose,
          'You do not need to memorize the formula first. Start by matching each input label on the calculator to the number, date, unit, or setting you actually have.',
        ],
      },
      {
        title: 'The formula in plain language',
        paragraphs: [
          getFormulaAnswer(tool.slug),
          'If that sounds abstract, use the example cards on the calculator page. They show a complete set of inputs and the kind of answer you should expect.',
        ],
      },
      {
        title: 'How to read the answer',
        paragraphs: [
          'Read the headline result first. Then look at the smaller supporting lines because they explain the parts behind the answer, such as totals, units, ranges, or formula steps.',
        ],
        bullets: detail.read,
      },
      {
        title: 'Common mistakes to avoid',
        paragraphs: [
          'If the answer looks strange, the most likely cause is a small input mismatch: the wrong unit, date, weight, scale, mode, or policy assumption.',
        ],
        bullets: detail.mistakes,
      },
      {
        title: 'Research and references',
        paragraphs: [
          detail.sources.length > 0
            ? 'These references shaped the calculator assumptions, unit choices, or safety notes.'
            : 'This guide is based on the calculator inputs, the formula note on the tool page, and common school or everyday usage patterns. If your school, workplace, or organization has an official rule, use that rule first.',
        ],
        links: detail.sources,
      },
    ],
    sidecarText: `Open the ${tool.name} beside this guide. Try one example first, then replace the example inputs with your own values.`,
  };
}

export const utilityBlogGuides: UtilityGuideDefinition[] = utilityTools.map((tool) => makeGuide(tool.slug));

export const utilityBlogPosts: BlogPostDefinition[] = utilityBlogGuides.map((guide) => ({
  slug: guide.slug,
  title: guide.title,
  label: guide.label,
  summary: guide.description,
}));
