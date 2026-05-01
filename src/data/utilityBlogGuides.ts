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
  extraSections?: GuideSection[];
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
  nistTime: {
    href: 'https://www.nist.gov/time-and-frequency-services/time-and-frequency-z-ti',
    label: 'NIST: Time and frequency definitions',
  },
  mdnDate: {
    href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date',
    label: 'MDN: JavaScript Date reference',
  },
  nistUnits: {
    href: 'https://www.nist.gov/pml/special-publication-811',
    label: 'NIST: Guide for the Use of the International System of Units',
  },
  usdaFoodDataCentral: {
    href: 'https://fdc.nal.usda.gov/',
    label: 'USDA: FoodData Central',
  },
  foodSafetyTemperatures: {
    href: 'https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures',
    label: 'FoodSafety.gov: Safe minimum internal temperatures',
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
  cdcSleep: {
    href: 'https://www.cdc.gov/sleep/about/index.html',
    label: 'CDC: Sleep recommendations by age',
  },
  energyStarAc: {
    href: 'https://www.energystar.gov/productfinder/product/certified-room-air-conditioners/',
    label: 'ENERGY STAR: Room air conditioner sizing guidance',
  },
  doeAc: {
    href: 'https://www.energy.gov/energysaver/room-air-conditioners',
    label: 'U.S. Department of Energy: Room air conditioners',
  },
  oshaStairs: {
    href: 'https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.25',
    label: 'OSHA: Stairways standard',
  },
  nwsWindChill: {
    href: 'https://www.weather.gov/gjt/windchill',
    label: 'National Weather Service: Wind chill formula',
  },
  noaaHeatIndex: {
    href: 'https://www.wpc.ncep.noaa.gov/html/heatindex_equation.shtml',
    label: 'NOAA/NWS: Heat index equation',
  },
  noaaDewPoint: {
    href: 'https://www.wpc.ncep.noaa.gov/html/dewrh.shtml',
    label: 'NOAA/NWS: Dew point and relative humidity calculator',
  },
  doeRoomAc: {
    href: 'https://www.energy.gov/energysaver/room-air-conditioners',
    label: 'U.S. Department of Energy: Room air conditioners',
  },
  doeApplianceEnergy: {
    href: 'https://www.energy.gov/energysaver/articles/estimating-appliance-and-home-electronic-energy-use',
    label: 'U.S. Department of Energy: Estimating appliance energy use',
  },
  eiaKwh: {
    href: 'https://www.eia.gov/energyexplained/electricity/electricity-in-the-us-generation-capacity-and-sales.php',
    label: 'U.S. Energy Information Administration: kWh electricity unit',
  },
  openStaxSpeed: {
    href: 'https://openstax.org/books/physics/pages/2-2-speed-and-velocity',
    label: 'OpenStax Physics: Speed and velocity',
  },
  openStaxMassWeight: {
    href: 'https://openstax.org/books/university-physics-volume-1/pages/5-4-mass-and-weight',
    label: 'OpenStax University Physics: Mass and weight',
  },
  openStaxOhmsLaw: {
    href: 'https://openstax.org/books/physics/pages/19-1-ohms-law',
    label: 'OpenStax Physics: Ohm\'s law',
  },
  openStaxMolarity: {
    href: 'https://openstax.org/books/chemistry-2e/pages/3-3-molarity',
    label: 'OpenStax Chemistry 2e: Molarity',
  },
  usaceVoltageDrop: {
    href: 'https://www.tad.usace.army.mil/Portals/53/docs/TAA/AEDDesignRequirements/AED%20Design%20Requirements%20-%20Voltage%20Drop%20Calculations_Mar_09.pdf',
    label: 'U.S. Army Corps of Engineers: Voltage drop calculations',
  },
  iecResistorCode: {
    href: 'https://webstore.iec.ch/en/publication/12579',
    label: 'IEC 60062: Resistor and capacitor marking codes',
  },
  bipmSi: {
    href: 'https://www.bipm.org/en/publications/si-brochure',
    label: 'BIPM: The International System of Units',
  },
  nistAtomicWeights: {
    href: 'https://www.nist.gov/physical-measurement-laboratory/atomic-weights-and-isotopic-compositions',
    label: 'NIST: Atomic weights and isotopic compositions',
  },
  nhtsaTireSize: {
    href: 'https://crashstats.nhtsa.dot.gov/Api/Public/ViewPublication/811051',
    label: 'NHTSA: Tire size sidewall fields reference',
  },
  teResistorCode: {
    href: 'https://www.te.com/usa-en/products/passive-components/resistors/intersection/resistor-color-codes.html',
    label: 'TE Connectivity: Resistor color codes and IEC 60062 context',
  },
  beaGdp: {
    href: 'https://www.bea.gov/help/glossary/gross-domestic-product-gdp',
    label: 'BEA: Gross domestic product glossary',
  },
  nistConversionFactors: {
    href: 'https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8',
    label: 'NIST SP 811: Conversion factors listed alphabetically',
  },
  sherwinPaintCoverage: {
    href: 'https://www.sherwin-williams.com/en-us/color/color-tools/paint-calculator',
    label: 'Sherwin-Williams: Paint calculator coverage notes',
  },
  lowesTile: {
    href: 'https://www.lowes.com/n/calculators/tile-floor-calculator',
    label: 'Lowe\'s: Tile flooring calculator estimating notes',
  },
  ukBoardFoot: {
    href: 'https://publications.ca.uky.edu/sites/publications.ca.uky.edu/files/for9.htm',
    label: 'University of Kentucky Extension: Measuring farm timber',
  },
  mndotAsphalt: {
    href: 'https://www.dot.minnesota.gov/materials/manuals/bituminous/Minnesota_Department_of_Transportation_Bituminous_Manual.pdf',
    label: 'MnDOT: Bituminous manual quantity estimating',
  },
  lowesWallpaper: {
    href: 'https://www.lowes.com/n/calculators/wallpaper-calculator',
    label: 'Lowe\'s: Wallpaper calculator estimating notes',
  },
  lowesWallpaperInstall: {
    href: 'https://www.lowes.com/pdf/Step-by-Step-Guide-Wallpaper-Installation.pdf',
    label: 'Lowe\'s: Peel-and-stick wallpaper installation guide',
  },
  homeDepotWallpaper: {
    href: 'https://www.homedepot.com/c/ah/how-to-wallpaper/9ba683603be9fa5395fab90209b9af9',
    label: 'The Home Depot: How to wallpaper',
  },
  homeDepotPastedWallpaper: {
    href: 'https://www.homedepot.com/c/ap/how-to-install-pasted-wallpaper/9ba683603be9fa5395fab901dcc00ca7',
    label: 'The Home Depot: Pasted wallpaper planning and install notes',
  },
  grahamBrownWallpaper: {
    href: 'https://support.grahambrown.com/hc/en-us/articles/207134025-How-do-I-know-how-much-wallpaper-I-need',
    label: 'Graham & Brown: How much wallpaper do I need?',
  },
  ethanAllenWallpaperGuide: {
    href: 'https://www.ethanallen.ca/on/demandware.static/-/Library-Sites-ethanallen-shared/default/dw121d97c4/pdf/buying-guides/wallpaper_buying_guide.pdf',
    label: 'Ethan Allen: Wallpaper repeat and match glossary',
  },
  lowesSiding: {
    href: 'https://www.lowes.com/n/calculators/siding-calculator',
    label: 'Lowe\'s: Siding calculator and siding squares',
  },
  glenGeryBrickSizes: {
    href: 'https://www.glengery.com/brick-sizes',
    label: 'Glen-Gery: Brick sizes and pieces per square foot',
  },
  archtoolboxCmu: {
    href: 'https://www.archtoolbox.com/cmu-sizes-shapes-finishes/',
    label: 'Archtoolbox: CMU sizes, nominal dimensions, and mortar joints',
  },
  usgaScoreDifferential: {
    href: 'https://www.usga.org/content/usga/home-page/handicapping/world-handicap-system/world-handicap-system-usga-golf-faqs/faqs---what-is-a-score-differential.html',
    label: 'USGA: What is a Score Differential?',
  },
  usgaCourseHandicap: {
    href: 'https://www.usga.org/HandicapFAQ/handicap.asp',
    label: 'USGA: World Handicap System FAQ',
  },
  googleHelpfulContent: {
    href: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
    label: 'Google Search Central: Creating helpful, reliable, people-first content',
  },
  googleSeoStarter: {
    href: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide',
    label: 'Google Search Central: SEO Starter Guide',
  },
  openAiTokens: {
    href: 'https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-do-i-count-them',
    label: 'OpenAI Help: What are tokens and how do I count them?',
  },
  openAiTokenizer: {
    href: 'https://platform.openai.com/tokenizer',
    label: 'OpenAI Platform: Tokenizer',
  },
  rfc9562: {
    href: 'https://www.rfc-editor.org/rfc/rfc9562',
    label: 'RFC 9562: Universally Unique IDentifiers',
  },
  mdnSubtleCryptoDigest: {
    href: 'https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest',
    label: 'MDN: SubtleCrypto digest()',
  },
  nistFips180: {
    href: 'https://csrc.nist.gov/pubs/fips/180-4/upd1/final',
    label: 'NIST FIPS 180-4: Secure Hash Standard',
  },
  wcagContrast: {
    href: 'https://www.w3.org/TR/WCAG22/',
    label: 'W3C: Web Content Accessibility Guidelines 2.2',
  },
  googleCampaignUrls: {
    href: 'https://support.google.com/analytics/answer/10917952?hl=en',
    label: 'Google Analytics Help: Collect campaign data with custom URLs',
  },
  mdnUrlSearchParams: {
    href: 'https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams',
    label: 'MDN: URLSearchParams',
  },
  mdnCharacterReference: {
    href: 'https://developer.mozilla.org/en-US/docs/Glossary/Character_reference',
    label: 'MDN: Character reference',
  },
  mdnCssClamp: {
    href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/clamp',
    label: 'MDN: CSS clamp()',
  },
  githubGfmTables: {
    href: 'https://github.github.io/gfm/',
    label: 'GitHub Flavored Markdown Spec: Tables',
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
    sources: [sourceLinks.isoDate, sourceLinks.nistTime],
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
    sources: [sourceLinks.nistUnits, sourceLinks.bipmSi],
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
    sources: [sourceLinks.nistUnits, sourceLinks.bipmSi],
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
    summary: 'Learn how mass divided by volume gives density and why matching units matter.',
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
    sources: [sourceLinks.nistUnits, sourceLinks.bipmSi],
  },
  'mass-calculator': {
    summary: 'Learn how density multiplied by volume gives mass and when the estimate needs real measurements.',
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
    sources: [sourceLinks.nistUnits, sourceLinks.bipmSi],
  },
  'weight-calculator': {
    summary: 'Learn the difference between mass and weight force, including newtons and pounds-force.',
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
    sources: [sourceLinks.nistUnits, sourceLinks.openStaxMassWeight],
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
    sources: [sourceLinks.nistUnits, sourceLinks.openStaxSpeed],
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
  'height-calculator': {
    summary: 'Learn how parent heights can give a rough adult-height estimate.',
    purpose:
      'The Height Calculator uses a simple mid-parental estimate. It is useful for understanding the math behind a rough family-height prediction, but it should not be treated as a medical growth forecast.',
    enter: [
      'Choose the estimate type for the child.',
      'Enter each parent height using feet and extra inches.',
      'Calculate to see an estimated height and a rough range.',
    ],
    read: [
      'The main answer is the estimated adult height in feet and inches.',
      'The range line is important because real growth does not follow one exact number.',
      'The centimeter line helps when you need metric context.',
    ],
    mistakes: [
      'Do not use this for medical decisions.',
      'Do not ignore growth patterns, puberty timing, nutrition, or health history.',
      'Check that feet and inches were entered separately and not as one decimal height.',
    ],
    sources: [sourceLinks.cdcSleep],
  },
  'bra-size-calculator': {
    summary: 'Learn how bust and underbust measurements create a starting bra size estimate.',
    purpose:
      'The Bra Size Calculator gives a practical starting point from two measurements. It helps explain band and cup math, while making it clear that real fit depends on brand, style, and body shape.',
    enter: [
      'Measure underbust in inches.',
      'Measure around the fullest bust point in inches.',
      'Calculate to get a starting band and cup estimate.',
    ],
    read: [
      'Band is based on the underbust measurement rounded to an even size.',
      'Cup is based on the difference between bust and band.',
      'The tolerance note matters because the same label can fit differently across brands.',
    ],
    mistakes: [
      'Do not treat the estimate as a guaranteed size.',
      'Do not pull the tape so tight that the measurement changes.',
      'Check brand size charts and nearby sister sizes before buying.',
    ],
    sources: [],
  },
  'voltage-drop-calculator': {
    summary: 'Learn how current, wire resistance, distance, and voltage affect voltage drop.',
    purpose:
      'The Voltage Drop Calculator is for early planning and learning. It estimates the voltage lost across a copper conductor run, then shows the percent drop and load voltage.',
    enter: [
      'Enter source voltage and current in amps.',
      'Enter one-way wire length in feet.',
      'Choose copper AWG size and phase type.',
    ],
    read: [
      'Voltage drop is the estimated volts lost in the conductor.',
      'Percent drop compares that loss with source voltage.',
      'Load voltage is the source voltage minus estimated drop.',
    ],
    mistakes: [
      'Do not use this as a final wiring design.',
      'Do not forget that conductor material, temperature, and installation method matter.',
      'Ask a qualified electrician for real installations.',
    ],
    sources: [sourceLinks.usaceVoltageDrop, sourceLinks.openStaxOhmsLaw, sourceLinks.nistUnits],
  },
  'btu-calculator': {
    summary: 'Learn how to estimate room cooling BTU from room size and simple adjustments.',
    purpose:
      'The BTU Calculator estimates room air conditioner cooling capacity. It starts with a room-size table and then adjusts for ceiling height, sunlight, extra people, and kitchen heat.',
    enter: [
      'Enter the room square footage.',
      'Enter ceiling height and choose sunlight level.',
      'Add people count and check kitchen only when the room has kitchen heat load.',
    ],
    read: [
      'The main answer is the rounded BTU per hour estimate.',
      'Base table value shows the starting point before adjustments.',
      'Adjusted estimate shows the number before practical rounding.',
    ],
    mistakes: [
      'Do not assume bigger is always better.',
      'Do not use one room estimate for a whole house.',
      'Consider insulation, windows, climate, and humidity before buying.',
    ],
    sources: [sourceLinks.energyStarAc, sourceLinks.doeRoomAc, sourceLinks.doeAc],
  },
  'stair-calculator': {
    summary: 'Learn how total rise turns into risers, treads, run, and stair angle.',
    purpose:
      'The Stair Calculator helps with rough stair layout math. It rounds total rise into a whole number of risers, then shows the actual riser height, tread count, run, and angle.',
    enter: [
      'Enter total rise from lower finished floor to upper finished floor.',
      'Enter your target riser height.',
      'Enter planned tread depth.',
    ],
    read: [
      'Riser count is the number of vertical step rises.',
      'Actual riser shows the height after rounding to a whole number of risers.',
      'Total run estimates horizontal space for the treads.',
    ],
    mistakes: [
      'Do not build from this estimate alone.',
      'Do not ignore finished flooring thickness.',
      'Check local code for uniformity, handrails, landings, headroom, and tread rules.',
    ],
    sources: [sourceLinks.oshaStairs],
  },
  'resistor-calculator': {
    summary: 'Learn how 4-band resistor colors decode into ohms and tolerance.',
    purpose:
      'The Resistor Calculator turns common 4-band color codes into a nominal resistance and tolerance range. It is made for electronics study and quick component identification.',
    enter: [
      'Choose the first digit color.',
      'Choose the second digit color.',
      'Choose multiplier and tolerance colors.',
    ],
    read: [
      'The main answer is nominal resistance in ohms.',
      'Tolerance shows the possible range around the nominal value.',
      'Minimum and maximum help you understand what the tolerance means.',
    ],
    mistakes: [
      'Do not read the bands backward.',
      'Do not trust faded colors without checking.',
      'Use a multimeter when the exact part value matters.',
    ],
    sources: [sourceLinks.iecResistorCode, sourceLinks.teResistorCode],
  },
  'ohms-law-calculator': {
    summary: 'Learn how voltage, current, resistance, and power fit together.',
    purpose:
      'The Ohms Law Calculator solves the basic resistor relationships. Enter two known values and it fills in voltage, current, resistance, and power.',
    enter: [
      'Choose the pair of values you know.',
      'Enter the two values in the labels shown.',
      'Calculate to get the remaining circuit values.',
    ],
    read: [
      'Voltage is electrical potential difference.',
      'Current is flow in amps.',
      'Resistance is ohms, and power is watts.',
    ],
    mistakes: [
      'Do not use simple DC resistor math for every AC or reactive circuit.',
      'Do not ignore component power ratings and heat.',
      'Never test live circuits without proper training and equipment.',
    ],
    sources: [sourceLinks.openStaxOhmsLaw, sourceLinks.nistUnits],
  },
  'electricity-calculator': {
    summary: 'Learn how watts and time turn into kWh and estimated electricity cost.',
    purpose:
      'The Electricity Calculator estimates energy use and cost for a device. It is useful when you know wattage, daily hours, days used, and your rate per kWh.',
    enter: [
      'Enter the device wattage.',
      'Enter hours per day and number of days.',
      'Enter your electricity price per kWh.',
    ],
    read: [
      'kWh is the energy amount your bill commonly uses.',
      'Cost multiplies kWh by the rate you entered.',
      'The rate line reminds you which price was used.',
    ],
    mistakes: [
      'Do not forget that some devices cycle on and off.',
      'Do not confuse watts with kilowatts.',
      'Real bills can include fees, taxes, and tiered rates.',
    ],
    sources: [sourceLinks.eiaKwh, sourceLinks.doeApplianceEnergy, sourceLinks.nistUnits],
  },
  'shoe-size-conversion': {
    summary: 'Learn how measured foot length converts into approximate adult shoe sizes.',
    purpose:
      'The Shoe Size Conversion tool starts with foot length in centimeters and estimates US men, US women, UK, and EU adult sizes. It is best for orientation before checking a brand chart.',
    enter: [
      'Measure foot length in centimeters.',
      'Enter the length in the tool.',
      'Calculate to compare size systems.',
    ],
    read: [
      'US men is shown as the main answer.',
      'US women, UK, and EU estimates appear as supporting lines.',
      'Foot inches shows the conversion behind the estimate.',
    ],
    mistakes: [
      'Do not buy from the estimate alone when fit matters.',
      'Do not ignore shoe width and shape.',
      'Use the manufacturer chart because brands use different lasts.',
    ],
    sources: [],
  },
  'molarity-calculator': {
    summary: 'Learn how moles, grams, molar mass, and liters create molarity.',
    purpose:
      'The Molarity Calculator finds mol/L concentration. It can use moles directly, or it can convert grams to moles first when you know molar mass.',
    enter: [
      'Choose moles and volume when moles are already known.',
      'Choose grams and molar mass when starting from a weighed amount.',
      'Enter final solution volume in liters.',
    ],
    read: [
      'The main answer is molarity, written as M.',
      'Moles shows the amount of solute used in the final division.',
      'Molar mass appears when grams mode is used.',
    ],
    mistakes: [
      'Do not use solvent volume when the problem asks for final solution volume.',
      'Do not mix grams and moles without converting.',
      'Check hydrate state and lab instructions.',
    ],
    sources: [sourceLinks.openStaxMolarity, sourceLinks.bipmSi, sourceLinks.nistAtomicWeights],
  },
  'molecular-weight-calculator': {
    summary: 'Learn how a chemical formula becomes an estimated molar mass.',
    purpose:
      'The Molecular Weight Calculator parses a common chemical formula, counts atoms, multiplies each count by a rounded atomic weight, and adds the parts.',
    enter: [
      'Enter a formula such as H2O, C6H12O6, or Ca(OH)2.',
      'Use normal element capitalization.',
      'Use a period for dot hydrates, such as CuSO4.5H2O.',
    ],
    read: [
      'The main answer is estimated grams per mole.',
      'Atoms counted tells you whether subscripts and parentheses were read.',
      'Composition shows the mass share by element.',
    ],
    mistakes: [
      'Do not use lowercase-only formulas.',
      'Do not expect isotope-exact mass from rounded atomic weights.',
      'Unsupported elements need a reference lookup before they can be calculated.',
    ],
    sources: [sourceLinks.bipmSi, sourceLinks.nistAtomicWeights],
  },
  'sleep-calculator': {
    summary: 'Learn how to count sleep cycles from bedtime or wake-up time.',
    purpose:
      'The Sleep Calculator counts 90-minute sleep cycles forward or backward and includes a fall-asleep buffer. It helps plan a bedtime or wake-up time without pretending sleep is only math.',
    enter: [
      'Choose wake-up time or bedtime mode.',
      'Enter the clock time.',
      'Enter sleep cycles and minutes to fall asleep.',
    ],
    read: [
      'The main answer is the suggested bedtime or wake-up time.',
      'Sleep time shows cycle duration only.',
      'Fall-asleep buffer shows the extra time included.',
    ],
    mistakes: [
      'Do not ignore sleep quality.',
      'Do not assume everyone needs the same number of cycles.',
      'Talk to a healthcare provider if sleep problems persist.',
    ],
    sources: [sourceLinks.cdcSleep],
  },
  'tire-size-calculator': {
    summary: 'Learn how tire width, aspect ratio, and wheel diameter create tire diameter.',
    purpose:
      'The Tire Size Calculator explains a metric tire size such as 225/60R16. It estimates sidewall height, total diameter, circumference, and revolutions per mile.',
    enter: [
      'Enter width in millimeters.',
      'Enter aspect ratio as a percent.',
      'Enter wheel diameter in inches.',
    ],
    read: [
      'Diameter is the overall tire height estimate.',
      'Sidewall shows one sidewall height.',
      'Revs per mile helps compare rolling size changes.',
    ],
    mistakes: [
      'Do not assume a size fits because the math looks close.',
      'Do not ignore load rating, rim width, clearance, and manufacturer guidance.',
      'Changing diameter can affect speedometer and safety systems.',
    ],
    sources: [sourceLinks.nhtsaTireSize],
  },
  'roofing-calculator': {
    summary: 'Learn how footprint, pitch, and waste estimate roof squares and bundles.',
    purpose:
      'The Roofing Calculator estimates materials for a simple pitched roof. It turns a footprint into slope-adjusted roof area, adds waste, then estimates roofing squares and bundles.',
    enter: [
      'Enter footprint length and width.',
      'Enter pitch rise per 12 inches of run.',
      'Enter waste percent.',
    ],
    read: [
      'Roof squares are 100-square-foot units.',
      'Bundles estimate assumes 3 shingle bundles per square.',
      'Pitch factor shows how slope increased the footprint area.',
    ],
    mistakes: [
      'Do not use this as a contractor measurement.',
      'Do not ignore hips, valleys, dormers, waste, openings, and product coverage.',
      'Check local roofing practices before ordering.',
    ],
    sources: [sourceLinks.nistUnits],
  },
  'tile-calculator': {
    summary: 'Learn how area, tile dimensions, and waste estimate tile count.',
    purpose:
      'The Tile Calculator estimates whole tiles needed from project area and tile size. It is useful for early material planning before checking box coverage.',
    enter: [
      'Enter project area in square feet.',
      'Enter tile length and width in inches.',
      'Enter waste percent.',
    ],
    read: [
      'The main answer is whole tiles needed.',
      'Each tile area shows the square-foot coverage of one tile.',
      'Area with waste shows the adjusted project area.',
    ],
    mistakes: [
      'Do not forget grout spacing and layout pattern.',
      'Do not ignore cuts, breakage, and box quantities.',
      'Measure irregular rooms carefully.',
    ],
    extraSections: [
      {
        title: 'What waste percent means for tile',
        paragraphs: [
          'Waste percent is extra tile added before the calculator rounds up. It covers cuts at walls, broken pieces, layout changes, chipped corners, and a few spare tiles for future repair.',
          'A simple straight layout may be close with about 10% waste. Diagonal layouts, herringbone, small rooms with lots of cuts, or expensive patterned tile often need a higher allowance.',
        ],
      },
      {
        title: 'Why grout spacing is not in the tile count',
        paragraphs: [
          'The calculator uses the visible tile size you enter. Real grout joints can slightly change layout spacing, but final ordering usually depends more on box coverage, cuts, waste, and layout plan.',
          'Use the product box, installer plan, or store calculator when you need exact carton counts, grout amount, thinset, transitions, or a professional takeoff.',
        ],
      },
    ],
    sources: [sourceLinks.lowesTile, sourceLinks.nistUnits],
  },
  'mulch-calculator': {
    summary: 'Learn how square feet and depth become cubic yards of mulch.',
    purpose:
      'The Mulch Calculator estimates bulk cubic yards, cubic feet, and common 2-cubic-foot bag count from area and depth.',
    enter: [
      'Enter bed area in square feet.',
      'Enter desired mulch depth in inches.',
      'Add a small waste percent if wanted.',
    ],
    read: [
      'Cubic yards is the bulk-order number.',
      'Cubic feet is useful for bag comparison.',
      '2-cubic-foot bags estimates common retail bag count.',
    ],
    mistakes: [
      'Do not forget mulch settles.',
      'Do not measure uneven beds as if they were perfect rectangles unless the area estimate is still close.',
      'Check bag volume or supplier yard size before buying.',
    ],
    sources: [sourceLinks.nistUnits],
  },
  'gravel-calculator': {
    summary: 'Learn how dimensions and density estimate gravel cubic yards and tons.',
    purpose:
      'The Gravel Calculator estimates volume and tonnage for a rectangular gravel area. It is most useful when you can enter your supplier tons-per-cubic-yard value.',
    enter: [
      'Enter length and width in feet.',
      'Enter depth in inches.',
      'Enter tons per cubic yard from your supplier when available.',
    ],
    read: [
      'Cubic yards is the volume estimate.',
      'Estimated tons multiplies cubic yards by density.',
      'Density used reminds you which conversion factor was applied.',
    ],
    mistakes: [
      'Do not assume every gravel type weighs the same.',
      'Do not ignore compaction and moisture.',
      'Ask the supplier about delivery minimums and recommended overage.',
    ],
    sources: [sourceLinks.nistUnits],
  },
  'paint-calculator': {
    summary: 'Learn how room size, openings, coats, and coverage estimate paint gallons.',
    purpose:
      'The Paint Calculator estimates interior wall paint for a simple room. It starts with wall area, subtracts typical door and window areas, then applies coats, coverage, and extra percent.',
    enter: [
      'Enter the room length, width, and wall height in feet.',
      'Enter the number of doors, windows, coats, and paint coverage from the can or product page.',
      'Use extra percent when the surface is textured, patched, or you want a safer buying estimate.',
    ],
    read: [
      'Gallons to buy rounds the calculated need up to whole gallons.',
      'Paintable wall area shows the wall estimate after subtracting openings.',
      'Coverage used reminds you which square-feet-per-gallon assumption drove the result.',
    ],
    mistakes: [
      'Do not use floor square footage as wall square footage.',
      'Do not forget that two coats roughly doubles the paintable area.',
      'Check the actual product label because coverage varies by paint, surface, color, and primer.',
    ],
    sources: [sourceLinks.sherwinPaintCoverage, sourceLinks.nistUnits],
  },
  'drywall-calculator': {
    summary: 'Learn how project area, sheet size, and waste become a drywall sheet count.',
    purpose:
      'The Drywall Calculator estimates whole sheets from wall or ceiling square footage. It works best after you already have a measured area or a rough takeoff from room dimensions.',
    enter: [
      'Enter the wall or ceiling area in square feet.',
      'Enter the drywall sheet length and width in feet.',
      'Add waste for cuts, broken corners, layout changes, and small offcuts.',
    ],
    read: [
      'The main answer is whole drywall sheets needed.',
      'Sheet area shows how many square feet one panel covers.',
      'Area with waste shows the adjusted project area before rounding up sheets.',
    ],
    mistakes: [
      'Do not forget windows, doors, closets, and ceiling areas when measuring.',
      'Do not assume every room lays out cleanly with no offcuts.',
      'Check thickness, moisture resistance, fire requirements, and local rules before buying.',
    ],
    sources: [sourceLinks.nistUnits],
  },
  'carpet-calculator': {
    summary: 'Learn how room dimensions become carpet square yards and approximate roll length.',
    purpose:
      'The Carpet Calculator estimates carpet area for one simple room. It reports adjusted square feet, square yards, and approximate linear feet from a roll width.',
    enter: [
      'Enter the room length and width in feet.',
      'Enter the roll width, commonly 12 feet for many carpets.',
      'Add waste for trimming, seams, closets, and layout constraints.',
    ],
    read: [
      'Square yards is the common carpet area unit.',
      'Adjusted area includes the waste percentage.',
      'Linear feet estimates how much length would be needed at the roll width entered.',
    ],
    mistakes: [
      'Do not rely on this for final carpet ordering when seams or pattern direction matter.',
      'Do not forget closets, doorways, and stairs.',
      'Ask the installer how they will lay out the roll before buying.',
    ],
    sources: [sourceLinks.nistUnits],
  },
  'flooring-calculator': {
    summary: 'Learn how measured floor area becomes whole flooring boxes and an optional material cost.',
    purpose:
      'The Flooring Calculator estimates how many boxes of flooring to buy from your measured square footage. It is helpful for laminate, vinyl plank, engineered wood, and other products sold by box coverage.',
    enter: [
      'Enter the measured floor area in square feet.',
      'Enter waste percent and the square feet covered by one product box.',
      'Add price per box only when you want a rough material cost.',
    ],
    read: [
      'Boxes needed is the main whole-number answer.',
      'Area with waste shows the square footage after your overage allowance.',
      'Coverage ordered shows how much square footage the rounded-up boxes cover.',
    ],
    mistakes: [
      'Do not use room dimensions without adding closets, hallways, or connected areas that need the same material.',
      'Do not ignore cuts, pattern direction, stairs, transitions, and damaged pieces.',
      'Check the box label and keep extra material when future repairs may need the same dye lot.',
    ],
    sources: [sourceLinks.nistUnits],
  },
  'wallpaper-calculator': {
    summary: 'Learn how wall area, openings, roll coverage, pattern repeat, and waste percent turn into wallpaper rolls.',
    purpose:
      'The Wallpaper Calculator estimates whole rolls for simple room walls. It starts with room perimeter and wall height, subtracts standard doors and windows, adds a waste percent, then divides by roll coverage. Think of it like planning snacks for a group: the wall area is the people who definitely need food, and waste percent is the extra bag you buy because somebody drops chips, shows up late, or wants seconds.',
    enter: [
      'Enter room length and width in feet. The calculator uses those to estimate the room perimeter.',
      'Enter wall height, plus the number of standard doors and windows.',
      'Enter roll coverage from the wallpaper product page or label, then choose a waste percent that fits the pattern and room difficulty.',
    ],
    read: [
      'Rolls needed is rounded up because wallpaper is bought in whole rolls.',
      'Wallpaper area is the wall estimate after subtracting openings.',
      'Area with waste shows the roll-coverage demand before rounding.',
    ],
    mistakes: [
      'Do not treat waste percent like a fee. It is extra material for cuts, pattern matching, trimming, and mistakes.',
      'Do not ignore pattern repeat or usable yield. A roll may print 56 square feet, but the usable wall coverage can be lower when the pattern has to line up.',
      'Do not mix rolls from different dye lots when appearance matters, because the same pattern can still have a slightly different color.',
      'Measure accent walls separately when you are not covering the whole room.',
    ],
    extraSections: [
      {
        title: 'What waste percent means',
        paragraphs: [
          'Waste percent is the extra wallpaper the calculator adds before it figures out how many rolls to buy. If the wall area after openings is 300 square feet and you enter 10% waste, the calculator treats the job like 330 square feet. Then it divides by roll coverage and rounds up to whole rolls.',
          'This extra amount is normal. Wallpaper is not used like paint where every square foot in the can can spread somewhere. You cut strips, trim the top and bottom, work around corners, and sometimes throw away a piece because the pattern needs to start in a different place.',
        ],
        bullets: [
          'Use around 10% for plain, random-match, or simple peel-and-stick wallpaper.',
          'Use around 15% for ordinary patterned wallpaper or rooms with several cuts.',
          'Use 20% or more for large repeats, drop matches, uneven walls, or when you want spare paper for later repairs.',
        ],
      },
      {
        title: 'What roll coverage means',
        paragraphs: [
          'Roll coverage means the square feet one roll can cover in real use. It is tempting to multiply roll width by roll length yourself, but the product page or label is usually safer because it may already account for how that product is sold.',
          'Some wallpaper is priced as a single roll but shipped as a double roll or bolt. That is why the coverage number matters more than the name. If the product says one roll covers 56 square feet, put 56 in the calculator. If the label says a different usable coverage, use that number instead.',
        ],
      },
      {
        title: 'Why pattern repeat matters',
        paragraphs: [
          'Pattern repeat is the distance before the design starts over. A random texture can be cut almost anywhere. A big floral, mural-style, or geometric pattern has to line up from strip to strip, so you may cut away more paper to make the next strip start in the correct place.',
          'Straight matches line up across neighboring strips. Drop matches shift the pattern, usually by half a repeat, so they can need even more careful cutting. That is why two wallpapers with the same roll coverage can need different waste percentages.',
        ],
      },
      {
        title: 'A quick example',
        paragraphs: [
          'Say a room has about 352 square feet of wall area. One standard door and two windows subtract about 50 square feet, so the wallpaper area is about 302 square feet. With 10% waste, the calculator plans for about 332 square feet.',
          'If each roll covers 56 square feet, 332 divided by 56 is about 5.93. Since you cannot buy 0.93 of a roll for a normal order, the calculator rounds up to 6 rolls. That last part matters: rounding is why a tiny input change can sometimes push the answer up by a whole roll.',
        ],
      },
      {
        title: 'When to be extra careful',
        paragraphs: [
          'If your wallpaper is expensive, has a large repeat, uses a drop match, or is going in a room with many corners and openings, treat the calculator as a first estimate. Check the product label, batch number, and return policy before ordering.',
          'If you are close to the next roll, it is usually better to round up than to run short. Reordering later can be annoying because the same pattern may come from a different lot or batch.',
        ],
      },
    ],
    sources: [
      sourceLinks.lowesWallpaper,
      sourceLinks.lowesWallpaperInstall,
      sourceLinks.homeDepotWallpaper,
      sourceLinks.homeDepotPastedWallpaper,
      sourceLinks.grahamBrownWallpaper,
      sourceLinks.ethanAllenWallpaperGuide,
      sourceLinks.nistUnits,
    ],
  },
  'fence-calculator': {
    summary: 'Learn how perimeter, panel width, post spacing, and gates estimate fence materials.',
    purpose:
      'The Fence Calculator gives a rough material count for simple panel fencing. It subtracts gate width, estimates panels, and counts line and gate posts.',
    enter: [
      'Enter the full fence perimeter or run length in feet.',
      'Enter panel width and post spacing in feet.',
      'Enter gate count and gate width so the calculator can remove gate openings.',
    ],
    read: [
      'Panels needed rounds up the remaining fence run divided by panel width.',
      'Fence run after gates shows how much perimeter is still filled with panels.',
      'Total posts includes line posts plus two posts per gate.',
    ],
    mistakes: [
      'Do not forget corner, end, brace, and terminal post requirements.',
      'Do not ignore slope, soil, setbacks, utilities, and permits.',
      'Gate hardware, latch clearance, and custom panel cuts need separate planning.',
    ],
    sources: [sourceLinks.nistUnits],
  },
  'deck-cost-calculator': {
    summary: 'Learn how deck size, decking price, railing, stairs, and waste build a rough budget.',
    purpose:
      'The Deck Cost Calculator is a rough planning tool. It estimates a deck surface allowance, then adds railing and stairs so you can compare early scope ideas.',
    enter: [
      'Enter deck length and width in feet.',
      'Enter decking waste percent and a cost per square foot for the deck surface.',
      'Add railing linear feet, railing cost per foot, and a stair allowance if needed.',
    ],
    read: [
      'The main answer is the rough total cost from the entered allowances.',
      'Decking area with waste shows how much surface the decking cost used.',
      'Decking and railing cost separate the two largest visible assumptions.',
    ],
    mistakes: [
      'Do not treat this as a contractor quote.',
      'Do not forget framing, footings, fasteners, permits, demolition, labor, railing rules, and stairs.',
      'Use local prices and professional measurements before making purchase decisions.',
    ],
    sources: [sourceLinks.nistUnits],
  },
  'paver-calculator': {
    summary: 'Learn how project area, paver size, and waste estimate paver count.',
    purpose:
      'The Paver Calculator estimates how many pavers cover a patio, walkway, or other simple area. It converts each paver into square feet before rounding up the count.',
    enter: [
      'Enter the project area in square feet.',
      'Enter the paver length and width in inches.',
      'Add waste for cuts, broken pieces, edge pieces, and pattern layout.',
    ],
    read: [
      'The main answer is whole pavers needed.',
      'Each paver area shows the coverage of one piece.',
      'Area with waste shows the adjusted area used before rounding.',
    ],
    mistakes: [
      'Do not forget base gravel, bedding sand, joint sand, edging, and compaction.',
      'Do not ignore pattern direction or cut-heavy borders.',
      'Check whether the supplier sells by piece, pallet, bundle, or square foot.',
    ],
    sources: [sourceLinks.nistUnits],
  },
  'siding-calculator': {
    summary: 'Learn how exterior wall area becomes siding squares and optional material cost.',
    purpose:
      'The Siding Calculator estimates siding in squares, where one square is 100 square feet of coverage. It is useful after you have measured exterior wall sections and opening areas.',
    enter: [
      'Enter total exterior wall area in square feet.',
      'Enter door and window area to subtract, then choose a waste percent.',
      'Add price per siding square only when you want an early material-cost estimate.',
    ],
    read: [
      'Siding squares is the main order-planning number.',
      'Net wall area shows what remains after subtracting openings.',
      'Area with waste shows the adjusted square footage before dividing by 100.',
    ],
    mistakes: [
      'Do not forget gables, dormers, trim-heavy sections, starter strips, corners, and channels.',
      'Do not treat price per square as installed price unless labor and accessories are included.',
      'Check product exposure and box coverage because not every siding profile covers the same area.',
    ],
    sources: [sourceLinks.lowesSiding, sourceLinks.nistUnits],
  },
  'brick-calculator': {
    summary: 'Learn how wall face area, brick size, mortar joint, and waste estimate brick count.',
    purpose:
      'The Brick Calculator estimates whole bricks for a simple wall face. It uses the face dimensions of one brick plus the mortar joint to estimate square-foot coverage.',
    enter: [
      'Enter the wall face area in square feet.',
      'Enter brick length, brick height, mortar joint thickness, and waste percent.',
      'Use actual brick dimensions when you have them from the supplier.',
    ],
    read: [
      'Bricks needed is rounded up to whole units.',
      'Brick face area shows how much wall one brick covers with the joint included.',
      'Area with waste shows the adjusted wall face before division.',
    ],
    mistakes: [
      'Do not ignore bond pattern, corners, openings, piers, cuts, and broken pieces.',
      'Do not use this simple face estimate for structural wall design.',
      'Estimate mortar, ties, lintels, flashing, and cleanup separately.',
    ],
    sources: [sourceLinks.glenGeryBrickSizes, sourceLinks.nistUnits],
  },
  'concrete-block-calculator': {
    summary: 'Learn how wall dimensions and nominal block face size estimate CMU count.',
    purpose:
      'The Concrete Block Calculator estimates CMU or concrete blocks for a simple wall. It uses the nominal block face size, which usually includes the mortar-joint layout module.',
    enter: [
      'Enter wall length and height in feet.',
      'Enter nominal block length and height in inches.',
      'Subtract large openings and add waste for cuts or damage.',
    ],
    read: [
      'Blocks needed is the rounded-up material count.',
      'Courses estimates how many horizontal rows fit the wall height.',
      'Blocks per course estimates how many blocks fit along the wall length.',
    ],
    mistakes: [
      'Do not forget corners, half blocks, bond pattern, lintels, grout, mortar, rebar, and footings.',
      'Do not use this as a structural design or retaining-wall safety check.',
      'Check local code, drainage, reinforcement, and professional guidance before building.',
    ],
    sources: [sourceLinks.archtoolboxCmu, sourceLinks.quickrete, sourceLinks.nistUnits],
  },
  'rebar-calculator': {
    summary: 'Learn how slab size, bar spacing, stock length, and waste estimate a rebar grid.',
    purpose:
      'The Rebar Calculator estimates a simple two-direction grid for rectangular slabs. It counts bars in both directions, totals linear feet, then converts that length into stock bars to buy.',
    enter: [
      'Enter slab length and width in feet.',
      'Enter bar spacing in inches and stock bar length in feet.',
      'Add waste for cuts, laps, and layout changes.',
    ],
    read: [
      'Bars to buy is rounded up from adjusted linear feet divided by stock bar length.',
      'Lengthwise and widthwise bar counts show the grid layout assumption.',
      'Adjusted linear feet includes your waste percentage.',
    ],
    mistakes: [
      'Do not treat this as structural engineering.',
      'Do not forget lap length, bar size, cover, chairs, edge distance, supports, and code requirements.',
      'Use the concrete plan or a qualified professional for real reinforcement design.',
    ],
    sources: [sourceLinks.nistUnits],
  },
  'board-foot-calculator': {
    summary: 'Learn how thickness, width, length, and quantity become lumber board feet.',
    purpose:
      'The Board Foot Calculator estimates lumber volume. It is useful when comparing rough lumber, sawmill boards, or board-foot pricing.',
    enter: [
      'Enter thickness and width in inches.',
      'Enter length in feet.',
      'Enter quantity when you have several boards with the same dimensions.',
    ],
    read: [
      'Total board feet is the combined lumber volume.',
      'Board feet each shows one board before multiplying by quantity.',
      'The formula divisor is 12 because thickness and width are inches while length is feet.',
    ],
    mistakes: [
      'Do not confuse nominal size with actual measured size unless the seller tells you which to use.',
      'Do not treat board feet as weight or structural strength.',
      'Allow for defects, milling, waste, species, grade, and moisture content.',
    ],
    sources: [sourceLinks.ukBoardFoot, sourceLinks.nistUnits],
  },
  'cubic-yard-calculator': {
    summary: 'Learn how rectangular dimensions and depth estimate cubic yards.',
    purpose:
      'The Cubic Yard Calculator is the general volume helper behind many material estimates. It converts length, width, and depth into cubic feet and cubic yards.',
    enter: [
      'Enter length and width in feet.',
      'Enter depth in inches.',
      'Add waste when material will settle, compact, spill, or need rounding up.',
    ],
    read: [
      'Cubic yards is the bulk material number many suppliers use.',
      'Cubic feet shows the raw volume before yard conversion.',
      'Waste added confirms the extra percentage included in the result.',
    ],
    mistakes: [
      'Do not mix inches, feet, and yards without converting them.',
      'Do not ignore uneven depth or sloped ground.',
      'Supplier minimums and rounding can change the purchase amount.',
    ],
    sources: [sourceLinks.nistUnits, sourceLinks.nistConversionFactors],
  },
  'pool-volume-calculator': {
    summary: 'Learn how pool shape, measurements, and average depth estimate gallons.',
    purpose:
      'The Pool Volume Calculator estimates gallons from simple pool measurements. It is meant for rough chemical, fill, and equipment context, not precise survey work.',
    enter: [
      'Choose rectangle, round, or oval pool shape.',
      'Enter length and width, or use the diameter in both fields for a round pool.',
      'Enter average depth, especially when the pool has shallow and deep ends.',
    ],
    read: [
      'Gallons is the main volume estimate.',
      'Cubic feet shows the intermediate volume before gallon conversion.',
      'Shape factor shows whether the calculator used a rectangle or rounded shape adjustment.',
    ],
    mistakes: [
      'Do not use maximum depth when the pool has a shallow end; use average depth.',
      'Do not ignore benches, steps, curves, and waterline height.',
      'Use measured water testing and product labels for chemical dosing decisions.',
    ],
    sources: [sourceLinks.nistUnits, sourceLinks.nistConversionFactors],
  },
  'sand-calculator': {
    summary: 'Learn how dimensions, depth, density, and waste estimate sand yards and tons.',
    purpose:
      'The Sand Calculator estimates volume and tonnage for a rectangular sand layer. It is useful for paver bedding, leveling layers, sandboxes, and small base projects.',
    enter: [
      'Enter length and width in feet.',
      'Enter depth in inches.',
      'Enter tons per cubic yard from your supplier when you have it, then add waste if needed.',
    ],
    read: [
      'Cubic yards is the bulk volume estimate.',
      'Estimated tons multiplies cubic yards by the density you entered.',
      'Density used reminds you how weight was estimated.',
    ],
    mistakes: [
      'Do not assume dry and wet sand weigh the same.',
      'Do not forget compaction and leveling loss.',
      'Ask the supplier for material-specific density and delivery minimums.',
    ],
    sources: [sourceLinks.nistUnits],
  },
  'soil-calculator': {
    summary: 'Learn how bed area and depth estimate soil volume and bag counts.',
    purpose:
      'The Soil Calculator estimates garden soil, raised bed top-offs, and topsoil volume. It reports bulk cubic yards and common retail bag counts.',
    enter: [
      'Enter bed area in square feet.',
      'Enter soil depth in inches.',
      'Add extra percent for settling, uneven beds, or a safer order.',
    ],
    read: [
      'Cubic yards is useful for bulk soil orders.',
      'Cubic feet helps compare bagged soil.',
      'Bag counts show estimates for 1.5-cubic-foot and 2-cubic-foot bags.',
    ],
    mistakes: [
      'Do not forget that soil settles after watering.',
      'Do not ignore existing soil, compost mix, and bed shape.',
      'Check the actual bag volume because retail bags vary.',
    ],
    sources: [sourceLinks.nistUnits],
  },
  'asphalt-calculator': {
    summary: 'Learn how pavement dimensions, compacted depth, density, and waste estimate asphalt tons.',
    purpose:
      'The Asphalt Calculator estimates rough asphalt quantity from dimensions and compacted depth. It is best for early planning before a paving contractor measures the job.',
    enter: [
      'Enter pavement length and width in feet.',
      'Enter compacted asphalt depth in inches.',
      'Enter tons per cubic yard from the supplier or use the default only as a rough assumption.',
    ],
    read: [
      'Estimated tons is the main quantity for asphalt planning.',
      'Cubic yards and cubic feet show the volume behind the tonnage.',
      'Density used reminds you which tons-per-yard factor was applied.',
    ],
    mistakes: [
      'Do not use this as a paving specification.',
      'Do not ignore base condition, lift thickness, compaction, mix type, and plant minimums.',
      'Ask a paving professional or supplier for project-specific density and ordering guidance.',
    ],
    sources: [sourceLinks.mndotAsphalt, sourceLinks.nistUnits],
  },
  'wind-chill-calculator': {
    summary: 'Learn how the NWS wind chill formula estimates feels-like cold.',
    purpose:
      'The Wind Chill Calculator combines air temperature and wind speed to estimate how cold exposed skin may feel in cold, windy weather.',
    enter: [
      'Enter air temperature in Fahrenheit.',
      'Enter wind speed in miles per hour.',
      'Calculate to see wind chill in Fahrenheit and Celsius.',
    ],
    read: [
      'The main answer is the wind chill temperature.',
      'Celsius gives metric context.',
      'Air temperature and wind speed confirm what went into the formula.',
    ],
    mistakes: [
      'Do not use wind chill for warm weather.',
      'Do not ignore local frostbite and cold-weather warnings.',
      'Remember wind chill affects people, not the actual temperature of objects.',
    ],
    sources: [sourceLinks.nwsWindChill, sourceLinks.nistUnits],
  },
  'heat-index-calculator': {
    summary: 'Learn how temperature and humidity estimate apparent heat.',
    purpose:
      'The Heat Index Calculator uses the NWS heat index method to estimate apparent temperature in warm, humid conditions. It starts with the simple branch, then uses the Rothfusz regression when the preliminary value reaches about 80 F.',
    enter: [
      'Enter air temperature in Fahrenheit.',
      'Enter relative humidity percent.',
      'Calculate to see apparent temperature in Fahrenheit and Celsius.',
    ],
    read: [
      'The main answer is heat index.',
      'Celsius gives metric context.',
      'Humidity confirms how much moisture was used in the estimate.',
    ],
    mistakes: [
      'Do not use heat index as the only heat-safety signal.',
      'Do not ignore direct sun, exertion, wind, clothing, or health conditions.',
      'Follow local heat advisories and emergency guidance.',
    ],
    sources: [sourceLinks.noaaHeatIndex, sourceLinks.nistUnits],
  },
  'dew-point-calculator': {
    summary: 'Learn how temperature and relative humidity estimate dew point.',
    purpose:
      'The Dew Point Calculator estimates the temperature at which air would become saturated with water vapor, using temperature and relative humidity.',
    enter: [
      'Enter air temperature in Fahrenheit.',
      'Enter relative humidity percent.',
      'Calculate to see dew point in Fahrenheit and Celsius.',
    ],
    read: [
      'The main answer is dew point.',
      'Celsius gives metric context.',
      'Dew point can explain comfort better than relative humidity alone.',
    ],
    mistakes: [
      'Do not enter zero humidity.',
      'Do not treat the approximation as an official instrument reading.',
      'Use local weather data for safety-sensitive planning.',
    ],
    sources: [sourceLinks.noaaDewPoint, sourceLinks.noaaHeatIndex],
  },
  'bandwidth-calculator': {
    summary: 'Learn how data size and network speed estimate transfer time.',
    purpose:
      'The Bandwidth Calculator estimates download or upload time by converting file size to bits and dividing by bits per second.',
    enter: [
      'Enter the data amount and unit.',
      'Enter the connection speed and unit.',
      'Calculate to see seconds, minutes, and hours.',
    ],
    read: [
      'The main answer is a readable duration.',
      'Seconds is the exact base result.',
      'Minutes and hours help with larger transfers.',
    ],
    mistakes: [
      'Do not confuse bits and bytes.',
      'Do not expect real transfers to match perfectly.',
      'Wi-Fi, server limits, congestion, and overhead can slow the result.',
    ],
    sources: [sourceLinks.nistUnits],
  },
  'gdp-calculator': {
    summary: 'Learn how the expenditure approach adds spending categories into GDP.',
    purpose:
      'The GDP Calculator is a classroom-style way to understand gross domestic product. It uses consumption, investment, government spending, exports, and imports to show how the expenditure identity works.',
    enter: [
      'Enter personal consumption, private investment, and government spending in the same money unit.',
      'Enter exports and imports separately so the calculator can find net exports.',
      'Add population only when you want GDP per person, and keep the scale consistent. If the money values are in billions, enter population in billions too.',
    ],
    read: [
      'Estimated GDP is the total after adding net exports.',
      'Net exports can be negative when imports are larger than exports.',
      'GDP per person divides the GDP result by the population scale you entered.',
    ],
    mistakes: [
      'Do not mix dollars, millions, and billions in the same calculation.',
      'Do not enter 340,000,000 as population while your GDP values are in billions. Use 0.34 for 340 million people in that example.',
      'Do not add imports; imports are subtracted in the expenditure approach.',
      'Do not treat this as an official economic release or forecast.',
    ],
    sources: [sourceLinks.beaGdp],
  },
  'horsepower-calculator': {
    summary: 'Learn how horsepower, watts, kilowatts, and metric horsepower convert.',
    purpose:
      'The Horsepower Calculator converts a power value through watts so mechanical horsepower and metric horsepower can be compared clearly.',
    enter: [
      'Enter the power amount.',
      'Choose whether your starting value is mechanical horsepower, watts, kilowatts, or metric horsepower.',
      'Calculate to see all common output units together.',
    ],
    read: [
      'Mechanical horsepower is the main answer when comparing U.S. horsepower labels.',
      'Watts and kilowatts are SI power units.',
      'Metric horsepower is close to, but not the same as, mechanical horsepower.',
    ],
    mistakes: [
      'Do not assume every hp label means the same unit.',
      'Do not use this as a certified motor-rating test.',
      'Check whether your source uses mechanical, metric, electric, boiler, or water horsepower.',
    ],
    sources: [sourceLinks.nistConversionFactors],
  },
  'engine-horsepower-calculator': {
    summary: 'Learn how torque and RPM combine into an engine horsepower estimate.',
    purpose:
      'The Engine Horsepower Calculator explains the common torque-RPM relationship: torque shows twisting force, RPM shows how fast that force is applied, and together they create power.',
    enter: [
      'Enter torque in pound-feet.',
      'Enter engine speed in RPM.',
      'Add drivetrain loss only when you want a rough wheel horsepower estimate.',
    ],
    read: [
      'Engine horsepower is the formula result from torque and RPM.',
      'Wheel horsepower applies the drivetrain loss percentage you entered.',
      'Kilowatts converts the engine horsepower into SI power units.',
    ],
    mistakes: [
      'Do not treat this as a dyno-certified rating.',
      'Do not enter peak torque and peak horsepower RPM unless they happen at the same RPM.',
      'Use measured torque at the RPM you enter for a meaningful result.',
    ],
    sources: [sourceLinks.nistConversionFactors],
  },
  'golf-handicap-calculator': {
    summary: 'Learn how score differential and course handicap estimates use rating, slope, par, and index.',
    purpose:
      'The Golf Handicap Calculator gives two useful estimates: a score differential for one adjusted round and a course handicap for playing a specific set of tees.',
    enter: [
      'Use Score differential mode when you have adjusted gross score, course rating, slope rating, and PCC.',
      'Use Course handicap mode when you have a Handicap Index, slope rating, course rating, and par.',
      'Enter the handicap allowance when your casual format uses one.',
    ],
    read: [
      'Score differential is rounded to one decimal place.',
      'Course handicap is rounded to a whole number.',
      'Playing handicap applies the allowance to the rounded course handicap.',
    ],
    mistakes: [
      'Do not call the result an official Handicap Index.',
      'Do not ignore course rating, slope rating, and par from the exact tees played.',
      'Remember official WHS records can include caps, exceptional-score reductions, and committee adjustments.',
    ],
    sources: [sourceLinks.usgaScoreDifferential, sourceLinks.usgaCourseHandicap],
  },
  'love-calculator': {
    summary: 'Learn how the Love Calculator works as a private, deterministic name-match game.',
    purpose:
      'The Love Calculator is a novelty game. It turns two names into a repeatable playful score, but it does not claim to measure attraction, trust, communication, consent, or relationship health.',
    enter: [
      'Enter the first name or nickname.',
      'Enter the second name or nickname.',
      'Press Calculate match to see the same playful score any time those two names are entered the same way.',
    ],
    read: [
      'The percentage is entertainment only.',
      'The game label is a light caption, not advice.',
      'The cleaned name keys show what the browser used to make the repeatable score.',
    ],
    mistakes: [
      'Do not treat the result as real compatibility science.',
      'Do not use the score to pressure, judge, or make decisions about another person.',
      'Do not enter sensitive private information; names or nicknames are enough for the game.',
    ],
    sources: [],
  },
  'word-counter': {
    summary: 'Learn how to count words, characters, sentences, paragraphs, and reading time from plain text.',
    purpose:
      'The Word Counter helps writers, students, site owners, and editors understand the size of a draft before publishing. It is especially useful when a tool, class, search snippet, or platform has a practical length target.',
    enter: [
      'Paste or type plain text into the text box.',
      'Use the examples when you want to see how sentence, paragraph, and line counts behave.',
      'Press Count words to refresh the result after editing.',
    ],
    read: [
      'The headline number is the word count.',
      'Characters, sentences, paragraphs, lines, and UTF-8 bytes explain the text from different angles.',
      'Reading time is a rough estimate, not a promise about every reader.',
    ],
    mistakes: [
      'Do not assume every publishing platform counts emojis, punctuation, and links the same way.',
      'Do not optimize only for word count; helpful content still needs clear answers and useful examples.',
      'Check the target editor when a school, client, or social platform has a strict limit.',
    ],
    sources: [sourceLinks.mdnCharacterReference],
  },
  'character-counter': {
    summary: 'Learn how to count characters with spaces, without spaces, by line, and by UTF-8 byte length.',
    purpose:
      'The Character Counter is for short text where length matters: page titles, meta descriptions, captions, messages, form text, and technical strings. It shows the main character count plus related counts that catch common surprises.',
    enter: [
      'Paste or type the text you want to check.',
      'Include line breaks if the target field will include them.',
      'Press Count characters after changing the draft.',
    ],
    read: [
      'Characters is the main visible character count.',
      'Without spaces is useful when a task ignores whitespace.',
      'UTF-8 bytes helps when a technical system limits bytes rather than visible characters.',
    ],
    mistakes: [
      'Do not assume emojis and combined symbols count the same everywhere.',
      'Do not rely on byte length when a platform says it uses visible characters.',
      'For search snippets, remember Google may choose different snippet text from the page.',
    ],
    sources: [sourceLinks.googleSeoStarter],
  },
  'text-case-converter': {
    summary: 'Learn how to convert plain text into common writing, code, filename, and URL case styles.',
    purpose:
      'The Text Case Converter saves small editing time by turning a phrase into uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case, or kebab-case.',
    enter: [
      'Choose the case style you need.',
      'Paste or type the text to convert.',
      'Press Convert case and copy the output when it looks right.',
    ],
    read: [
      'The output box is the copy-ready converted text.',
      'Mode tells you which case style was applied.',
      'Changed positions gives a quick sense of how different the output is from the input.',
    ],
    mistakes: [
      'Do not treat generated title case as a full style-guide editor.',
      'Identifier modes remove punctuation, so check names that need symbols.',
      'Review proper nouns and brand names after converting.',
    ],
    sources: [],
  },
  'slug-generator': {
    summary: 'Learn how to turn titles and phrases into clean lowercase URL slugs.',
    purpose:
      'The Slug Generator turns a readable title into a URL-friendly draft path. It is useful for planning blog guides and tool pages while keeping one clear canonical page for each search intent.',
    enter: [
      'Paste a title, heading, or tool name.',
      'Add a maximum length only when you need a shorter slug.',
      'Press Generate slug and review the output before using it in a URL.',
    ],
    read: [
      'The generated slug is lowercase and hyphen-separated.',
      'Characters shows the final slug length.',
      'Max length shows whether the optional trim was applied.',
    ],
    mistakes: [
      'Do not create multiple near-duplicate pages just because several slug versions are possible.',
      'Do not remove important words if the slug becomes unclear.',
      'Keep slugs readable, but prioritize the page title and content quality first.',
    ],
    sources: [sourceLinks.googleSeoStarter],
  },
  'json-formatter': {
    summary: 'Learn how to format, validate, sort, and copy JSON in the browser.',
    purpose:
      'The JSON Formatter helps you read copied JSON by parsing it and printing it with indentation. It is for syntax and readability, not for proving that an API payload follows a particular business schema.',
    enter: [
      'Paste JSON into the JSON text box.',
      'Turn on Sort object keys only when alphabetical key order will help comparison.',
      'Press Format JSON to parse and pretty-print the text.',
    ],
    read: [
      'The output box shows formatted JSON with two-space indentation.',
      'Root type tells you whether the JSON starts as an object, array, string, number, boolean, or null.',
      'Keys counts object keys across nested objects.',
    ],
    mistakes: [
      'Do not paste private tokens or secrets unless you are comfortable viewing them in this tab.',
      'Do not confuse valid JSON syntax with valid API data.',
      'Check trailing commas, missing quotes, and mismatched braces when parsing fails.',
    ],
    sources: [],
  },
  'uuid-generator': {
    summary: 'Learn how to generate UUID v4 identifiers locally in the browser.',
    purpose:
      'The UUID Generator creates version 4 UUIDs for development workflows, test data, mock records, and local prototypes. It uses random bytes and formats them as standard UUID strings.',
    enter: [
      'Choose how many UUIDs to generate.',
      'Turn on uppercase or remove hyphens only when another system expects that format.',
      'Press Generate UUIDs and copy the output.',
    ],
    read: [
      'Each line is one generated UUID.',
      'Quantity confirms how many IDs were generated.',
      'Case and hyphen settings describe the chosen output format.',
    ],
    mistakes: [
      'Do not use UUIDs as passwords or secret tokens.',
      'Do not assume UUIDs prove authorization or ownership.',
      'Do not use generated IDs as ordered timestamps; UUID v4 is random, not chronological.',
    ],
    sources: [sourceLinks.rfc9562],
  },
  'hash-generator': {
    summary: 'Learn how to generate SHA-256, SHA-384, and SHA-512 text digests.',
    purpose:
      'The Hash Generator creates SHA-2 digests from text using the browser SubtleCrypto API. It is useful for learning, quick comparisons, and small debugging tasks.',
    enter: [
      'Choose SHA-256, SHA-384, or SHA-512.',
      'Paste or type the text to hash.',
      'Press Generate hash and copy the hexadecimal digest.',
    ],
    read: [
      'The output is the lowercase hexadecimal digest.',
      'Input bytes shows the UTF-8 byte length of the text.',
      'Digest bytes changes by algorithm: SHA-256 is 32 bytes, SHA-384 is 48 bytes, and SHA-512 is 64 bytes.',
    ],
    mistakes: [
      'Do not treat hashing as encryption; a hash cannot be decrypted.',
      'Do not use a raw hash as a password storage design.',
      'Do not use a hash alone as proof that a message came from a trusted sender.',
    ],
    sources: [sourceLinks.mdnSubtleCryptoDigest, sourceLinks.nistFips180],
  },
  'unix-timestamp-converter': {
    summary: 'Learn how to convert UTC dates to Unix timestamps and timestamps back to UTC time.',
    purpose:
      'The Unix Timestamp Converter is for log, API, database, and developer work where time is stored as a count from the Unix epoch. It uses UTC so the conversion does not silently depend on the viewer’s local time zone.',
    enter: [
      'Use Date to timestamp mode when you have a UTC date and time.',
      'Use Timestamp to date mode when you have Unix seconds or milliseconds.',
      'Choose the correct unit before converting a timestamp.',
    ],
    read: [
      'Unix seconds is the common compact timestamp form.',
      'Milliseconds is often used in JavaScript and browser APIs.',
      'UTC ISO output shows the converted instant in a readable standard format.',
    ],
    mistakes: [
      'Do not mix seconds and milliseconds; millisecond timestamps are 1,000 times larger.',
      'Do not enter local time unless you have already converted it to UTC.',
      'Check application-specific time-zone rules before scheduling real events.',
    ],
    sources: [sourceLinks.mdnDate, sourceLinks.isoDate],
  },
  'color-contrast-checker': {
    summary: 'Learn how to compare two colors with the WCAG contrast ratio formula.',
    purpose:
      'The Color Contrast Checker helps you catch low-contrast text and background combinations before they become a design or accessibility problem. It reports WCAG AA and AAA pass or fail results.',
    enter: [
      'Enter the text color as #RGB or #RRGGBB.',
      'Enter the background color as #RGB or #RRGGBB.',
      'Press Check contrast to calculate the ratio.',
    ],
    read: [
      'The contrast ratio compares the lighter luminance with the darker luminance.',
      'AA normal text should be at least 4.5:1.',
      'AA large text should be at least 3:1.',
    ],
    mistakes: [
      'Do not check only the default state; hover, focus, disabled, and selected states matter too.',
      'Do not rely on color alone to communicate state.',
      'Do not assume a passing contrast ratio fixes all accessibility issues.',
    ],
    sources: [sourceLinks.wcagContrast],
  },
  'aspect-ratio-calculator': {
    summary: 'Learn how to simplify image and video dimensions or resize while preserving proportions.',
    purpose:
      'The Aspect Ratio Calculator keeps designs, screenshots, images, and video frames from stretching. It simplifies width and height into a ratio and can calculate a matching width or height for resizing.',
    enter: [
      'Use Simplify ratio when you only need the width-to-height relationship.',
      'Use Scale by width when you know the new width and need the matching height.',
      'Use Scale by height when you know the new height and need the matching width.',
    ],
    read: [
      'Ratio shows the simplified width-to-height relationship.',
      'Decimal shows width divided by height.',
      'Scaled size shows the missing dimension when you resize by width or height.',
    ],
    mistakes: [
      'Do not round too early when a platform needs exact pixels.',
      'Do not crop and resize as if they are the same thing; cropping changes what is visible.',
      'Check the final export dimensions after compression or image editing.',
    ],
    sources: [],
  },
  'utm-builder': {
    summary: 'Learn how to build UTM campaign links without hand-editing URL parameters.',
    purpose:
      'The UTM Builder helps you create a campaign URL that analytics tools can read. Instead of manually typing question marks, ampersands, and encoded values, you enter the destination page plus source, medium, campaign, and optional detail fields. The tool then returns one copy-ready URL.',
    enter: [
      'Enter the page URL people should visit.',
      'Fill in UTM source, medium, and campaign because those are the core campaign labels.',
      'Use content or term only when you need to tell two links apart.',
    ],
    read: [
      'Campaign URL is the full link you can copy.',
      'UTM parameters tells you how many tracking fields were added.',
      'Existing parameters shows whether the original URL already had query values.',
    ],
    mistakes: [
      'Do not use different spellings for the same source or campaign across links.',
      'Do not add private customer data to campaign URLs.',
      'Do not expect UTM values to appear in analytics unless the destination site is configured for campaign reporting.',
    ],
    sources: [sourceLinks.googleCampaignUrls, sourceLinks.mdnUrlSearchParams],
  },
  'query-string-parser': {
    summary: 'Learn how to decode URL parameters or build an encoded query string from key-value lines.',
    purpose:
      'The Query String Parser is for reading and building the part of a URL that comes after the question mark. It helps you see filters, campaign values, repeated keys, and app-state values without mentally decoding percent signs and plus signs.',
    enter: [
      'Use Parse query when you have a full URL or a raw query string.',
      'Use Build query when you have one key=value pair per line.',
      'Keep private tokens and personal data out of the input when the URL might be shared.',
    ],
    read: [
      'Parsed output is shown as readable JSON.',
      'Built output starts with a question mark and is encoded for use in a URL.',
      'Duplicate keys tells you when the same parameter appears more than once.',
    ],
    mistakes: [
      'Do not assume a query string is secret just because it appears after a question mark.',
      'Do not hand-convert spaces and special characters when the builder can encode them.',
      'Check repeated keys because some apps use them intentionally and others ignore later values.',
    ],
    sources: [sourceLinks.mdnUrlSearchParams, sourceLinks.rfc3986],
  },
  'html-entity-encoder-decoder': {
    summary: 'Learn how HTML entities turn code-sensitive characters into visible text and back again.',
    purpose:
      'The HTML Entity Encoder / Decoder helps with small snippets that need to be shown as text. If you want readers to see a tag instead of the browser treating it like markup, encode the sensitive characters. If you copied entity text and need to read it, decode it.',
    enter: [
      'Choose Encode when your text contains characters such as <, >, &, quotes, or apostrophes.',
      'Choose Decode when your text contains entities such as &lt;, &amp;, or numeric entity codes.',
      'Paste the snippet and run the tool.',
    ],
    read: [
      'The output is the copy-ready encoded or decoded text.',
      'Entity count shows how many entity replacements were found.',
      'Changed positions gives a quick signal for how much the output differs from the input.',
    ],
    mistakes: [
      'Do not treat entity encoding as a full security sanitizer.',
      'Do not decode unknown HTML and paste it into a live page without reviewing it.',
      'Remember that this tool supports common entities and numeric entity codes, not every named entity ever defined.',
    ],
    sources: [sourceLinks.googleHelpfulContent],
  },
  'css-clamp-calculator': {
    summary: 'Learn how to make fluid CSS sizes with a clamp formula you can copy into a stylesheet.',
    purpose:
      'The CSS Clamp Calculator turns a minimum size, maximum size, and viewport range into a clamp() formula. This is useful for headings, spacing, and other responsive values that should grow smoothly between mobile and desktop widths.',
    enter: [
      'Enter the smallest size and largest size in pixels.',
      'Enter the viewport width where scaling should start and stop.',
      'Use your site root font size so the rem output matches your CSS setup.',
    ],
    read: [
      'The main answer is the clamp() formula.',
      'Slope explains the vw part of the formula.',
      'Middle size shows the approximate value halfway through the viewport range.',
    ],
    mistakes: [
      'Do not assume fluid type fixes every responsive design issue.',
      'Check text wrapping, line length, and tap targets on real viewport sizes.',
      'Keep minimum and maximum sizes readable instead of scaling purely for visual drama.',
    ],
    sources: [sourceLinks.mdnCssClamp],
  },
  'ai-token-cost-calculator': {
    summary: 'Learn how input tokens, output tokens, request count, and current model prices turn into an AI usage estimate.',
    purpose:
      'The AI Token Cost Calculator helps you do model-budget math without pretending any one price is permanent. You enter your own current input and output prices, then the calculator shows total cost and cost per request.',
    enter: [
      'Enter how many input tokens one request usually sends, including instructions, context, and the user message.',
      'Enter how many output tokens one response usually generates.',
      'Enter request count and the current input/output price per 1 million tokens from your provider.',
    ],
    read: [
      'Total cost is the estimated bill for the requests you entered.',
      'Input token cost and output token cost are split so you can see which side drives the budget.',
      'Cost per request is useful when comparing models or deciding whether a feature can scale.',
    ],
    mistakes: [
      'Do not use old model prices from memory.',
      'Do not forget that long system prompts, retrieved context, and tool messages can be input tokens too.',
      'Do not assume cached tokens, batch discounts, free credits, taxes, or minimum charges are included.',
    ],
    sources: [sourceLinks.openAiTokens, sourceLinks.openAiTokenizer, sourceLinks.googleHelpfulContent],
  },
  'prompt-token-estimator': {
    summary: 'Learn how to use a rough character-based token estimate before checking an exact model tokenizer.',
    purpose:
      'The Prompt Token Estimator is a fast planning tool. It counts characters and uses a simple average characters-per-token assumption so you can quickly compare prompt drafts before using an exact tokenizer.',
    enter: [
      'Paste the prompt, instruction, or system message you want to estimate.',
      'Leave average characters per token at 4 for a normal rough estimate, or adjust it if you know your text behaves differently.',
      'Use the examples to see how short instructions and longer system notes compare.',
    ],
    read: [
      'Estimated tokens is the main rough answer.',
      'Low and high estimates show why this is not exact.',
      'Characters and words help you compare prompt drafts in normal writing terms.',
    ],
    mistakes: [
      'Do not use this as an exact billing tokenizer.',
      'Do not assume code, URLs, punctuation-heavy text, emojis, or non-English text splits like normal English.',
      'Do not forget that chat history and hidden system/tool messages may also count in a real request.',
    ],
    sources: [sourceLinks.openAiTokens, sourceLinks.openAiTokenizer],
  },
  'api-pricing-calculator': {
    summary: 'Learn how requests, billable units, unit price, fixed fees, and overhead combine into an API cost estimate.',
    purpose:
      'The API Pricing Calculator is for provider-neutral cost planning. It works for APIs that bill by request, credit, image, second, message, GB, token, or any other simple unit.',
    enter: [
      'Enter the number of requests or jobs you expect.',
      'Enter how many billable units one request uses and the price for one unit.',
      'Add a fixed fee or retry percentage when your plan needs a cushion.',
    ],
    read: [
      'Total cost includes usage cost plus any fixed fee.',
      'Billable units shows the request count after units-per-request and overhead are applied.',
      'Average cost per request helps compare pricing options at the same volume.',
    ],
    mistakes: [
      'Do not mix price per 1,000 units, per 1 million units, and per single unit.',
      'Do not ignore free tiers, taxes, credits, minimum charges, or plan-specific rounding.',
      'Do not enter secret keys or customer data; only pricing numbers are needed.',
    ],
    sources: [sourceLinks.googleHelpfulContent, sourceLinks.openAiTokens],
  },
  'download-time-calculator': {
    summary: 'Learn how file size, Mbps speed, and realistic efficiency estimate download time.',
    purpose:
      'The Download Time Calculator turns a file size into bits, adjusts your connection speed by an efficiency percentage, and estimates how long a game, app, video, or backup may take.',
    enter: [
      'Enter the file size and choose KB, MB, GB, or TB.',
      'Enter the real download speed in Mbps.',
      'Set efficiency lower when Wi-Fi, server limits, VPNs, or congestion are likely.',
    ],
    read: [
      'The main answer is the estimated duration.',
      'Effective speed shows the Mbps after efficiency is applied.',
      'Minutes and hours help you understand large downloads without mental conversion.',
    ],
    mistakes: [
      'Do not confuse Mbps with MB/s.',
      'Do not assume advertised internet speed is the same as real download speed.',
      'Do not expect the estimate to include server throttling, device storage speed, or background traffic.',
    ],
    sources: [sourceLinks.nistUnits],
  },
  'internet-speed-needs-calculator': {
    summary: 'Learn how simultaneous streaming, gaming, calls, smart devices, and buffer produce a rough Mbps plan.',
    purpose:
      'The Internet Speed Needs Calculator estimates a household or workspace download-speed target by adding the activities that may happen at the same time, then adding a buffer.',
    enter: [
      'Enter how many video streams, gaming devices, video calls, and smart devices may run at once.',
      'Adjust Mbps per activity if your use is lighter or heavier than the example.',
      'Keep a buffer so the connection is not planned at its absolute limit.',
    ],
    read: [
      'Recommended speed is the base activity estimate plus buffer.',
      'Base activity need shows the raw total before buffer.',
      'Video and call/gaming metrics show which activities are driving the estimate.',
    ],
    mistakes: [
      'Do not treat Mbps as the only quality measure.',
      'Do not ignore upload speed for video calls, uploads, cloud backup, and live streaming.',
      'Do not blame the internet plan before checking Wi-Fi signal, router age, latency, jitter, and packet loss.',
    ],
    sources: [sourceLinks.nistUnits],
  },
  'streaming-bitrate-calculator': {
    summary: 'Learn how bitrate and duration turn into estimated stream or recording data use.',
    purpose:
      'The Streaming Bitrate Calculator helps creators, students, streamers, and site owners understand how much data a fixed bitrate can use over time.',
    enter: [
      'Enter the bitrate from your encoder, export settings, or stream dashboard.',
      'Choose Kbps or Mbps, then enter the stream or recording duration.',
      'Increase stream count when more than one camera, stream, or file uses the same settings.',
    ],
    read: [
      'Gigabytes is the main storage or data estimate.',
      'Megabytes and megabits show the same estimate at smaller scales.',
      'Streams counted confirms whether the result includes one stream or several.',
    ],
    mistakes: [
      'Do not confuse bitrate with resolution.',
      'Do not expect variable bitrate files to match exactly.',
      'Do not forget audio tracks, adaptive streaming, chat, thumbnails, and platform overhead.',
    ],
    sources: [sourceLinks.nistUnits],
  },
  'device-battery-life-calculator': {
    summary: 'Learn how mAh, voltage, watts, and efficiency estimate battery runtime.',
    purpose:
      'The Device Battery Life Calculator converts battery capacity into watt-hours, applies a realistic efficiency loss, and divides by device power draw to estimate runtime.',
    enter: [
      'Enter battery capacity in mAh and the nominal voltage from the product label.',
      'Enter the device average power draw in watts.',
      'Use efficiency to account for conversion loss, heat, cables, and imperfect battery use.',
    ],
    read: [
      'Estimated runtime is the main answer.',
      'Nominal energy is the battery watt-hours before efficiency loss.',
      'Usable energy is the watt-hours after the efficiency percentage.',
    ],
    mistakes: [
      'Do not compare batteries by mAh alone when voltage is different.',
      'Do not assume a device draws the same watts all the time.',
      'Do not expect old, cold, hot, damaged, or heavily loaded batteries to match the estimate.',
    ],
    sources: [sourceLinks.nistUnits],
  },
  'monitor-ppi-calculator': {
    summary: 'Learn how screen resolution and diagonal size combine into pixels per inch.',
    purpose:
      'The Monitor PPI Calculator helps compare display sharpness by using pixel resolution and physical diagonal size together. Resolution alone is not enough because screen size changes pixel density.',
    enter: [
      'Enter width and height pixels from the display resolution.',
      'Enter the diagonal screen size in inches.',
      'Use examples for common 1080p, 1440p, and 4K monitor sizes.',
    ],
    read: [
      'PPI is pixels per inch across the physical screen.',
      'Pixel diagonal is the diagonal length in pixels found with the Pythagorean theorem.',
      'Aspect ratio shows the simplified width-to-height shape.',
    ],
    mistakes: [
      'Do not use PPI alone to judge a screen.',
      'Do not confuse screen PPI with printer DPI or mouse DPI.',
      'Remember that scaling, viewing distance, panel quality, and eyesight affect perceived sharpness.',
    ],
    sources: [sourceLinks.nistUnits],
  },
  'recipe-scaler': {
    summary: 'Learn how to scale recipe ingredients from one serving count to another without hiding the math.',
    purpose:
      'The Recipe Scaler helps when a recipe makes the wrong number of servings for your plan. It works one ingredient line at a time so you can see the scale factor and catch mistakes before cooking.',
    enter: [
      'Enter the ingredient name, original amount, and unit from the recipe.',
      'Enter how many servings the original recipe makes.',
      'Enter how many servings you want to make now.',
    ],
    read: [
      'The main answer is the scaled ingredient amount.',
      'Scale factor tells you how much bigger or smaller the batch is.',
      'Desired servings confirms the target serving count used in the math.',
    ],
    mistakes: [
      'Do not assume seasonings, yeast, salt, gelatin, or thickener always scale perfectly.',
      'Do not round eggs, packets, or small measurements without thinking about the recipe.',
      'Do not forget that pan size and cook time may need adjustment when the batch size changes.',
    ],
    sources: [sourceLinks.googleHelpfulContent],
  },
  'cooking-measurement-converter': {
    summary: 'Learn why cooking unit conversion is simple for similar units and trickier for cups-to-grams.',
    purpose:
      'The Cooking Measurement Converter handles common recipe units. It uses fixed factors when both units measure volume or both measure weight, and it uses ingredient density when crossing between volume and weight.',
    enter: [
      'Enter the amount and choose the starting unit.',
      'Choose the unit you want to convert to.',
      'Enter grams per cup when converting between volume and weight.',
    ],
    read: [
      'The main answer is the converted amount in the new unit.',
      'Input type and output type show whether the conversion used volume, weight, or both.',
      'Density used matters only when cups, tablespoons, or mL are converted to grams, ounces, pounds, or the reverse.',
    ],
    mistakes: [
      'Do not use one cups-to-grams number for every ingredient.',
      'Do not treat scooped, packed, sifted, chopped, and liquid ingredients as identical.',
      'Use a kitchen scale when exact baking measurements matter.',
    ],
    sources: [sourceLinks.nistUnits, sourceLinks.usdaFoodDataCentral],
  },
  'ingredient-cost-calculator': {
    summary: 'Learn how package price and recipe amount become a realistic ingredient cost estimate.',
    purpose:
      'The Ingredient Cost Calculator is useful when you want to know how much one ingredient contributes to a recipe cost. It can convert package units into recipe units first, then price only the amount you use.',
    enter: [
      'Enter the recipe amount needed and its unit.',
      'Enter the package amount, package unit, and package price.',
      'Use density grams per cup when the recipe and package cross between volume and weight.',
    ],
    read: [
      'The main answer is the estimated cost of the amount used in the recipe.',
      'Unit cost shows the price per recipe unit after package conversion.',
      'Package amount converted shows how large the package is in the unit your recipe uses.',
    ],
    mistakes: [
      'Do not forget tax, coupons, spoiled food, or waste if you want real spending cost.',
      'Do not mix volume and weight without checking ingredient density.',
      'Do not assume leftovers have no value if you will use them later.',
    ],
    sources: [sourceLinks.nistUnits, sourceLinks.usdaFoodDataCentral],
  },
  'unit-price-calculator': {
    summary: 'Learn how to compare two products fairly by price per shared unit.',
    purpose:
      'The Unit Price Calculator divides each product price by its package quantity. It helps you see whether the small package, family size, bulk pack, or sale item is actually cheaper per unit.',
    enter: [
      'Enter a name, price, and quantity for item A.',
      'Enter the same details for item B.',
      'Use the same shared unit for both quantities, such as oz, lb, count, roll, or sheet.',
    ],
    read: [
      'The main answer names the lower unit-price option.',
      'Each unit price shows how much that item costs per shared unit.',
      'Savings per unit shows the difference between the higher and lower unit price.',
    ],
    mistakes: [
      'Do not compare ounces to pounds until you convert them to one unit.',
      'Do not ignore product quality, expiration dates, storage space, or coupons.',
      'Check that both products are truly comparable before choosing only by price.',
    ],
    sources: [sourceLinks.nistUnits],
  },
  'cost-per-serving-calculator': {
    summary: 'Learn how to split a recipe or batch cost into a cost per serving.',
    purpose:
      'The Cost Per Serving Calculator takes a total batch cost and divides it by the number of servings. It is helpful for meal prep, bake sales, food budgeting, and comparing homemade meals with store-bought choices.',
    enter: [
      'Enter the recipe or food name so the result is easy to recognize.',
      'Enter the main cost and any extra cost you want included.',
      'Enter the number of servings the batch actually makes.',
    ],
    read: [
      'The main answer is cost per serving.',
      'Total batch cost shows main cost plus extras.',
      'Servings confirms the divisor used in the estimate.',
    ],
    mistakes: [
      'Do not use a fantasy serving count just to make the cost look low.',
      'Do not forget packaging, toppings, sauces, or delivery fees when they matter.',
      'Remember that large and small portions change the real cost per person.',
    ],
    sources: [sourceLinks.googleHelpfulContent],
  },
  'oven-temperature-converter': {
    summary: 'Learn how to convert recipe oven settings between Fahrenheit, Celsius, and gas mark.',
    purpose:
      'The Oven Temperature Converter helps when a recipe uses a different oven temperature unit than your oven. It translates the setting and shows the nearest common gas mark.',
    enter: [
      'Enter the oven temperature from the recipe.',
      'Choose whether the recipe uses Fahrenheit, Celsius, or gas mark.',
      'Run the converter before preheating.',
    ],
    read: [
      'The main answer shows Fahrenheit and Celsius together.',
      'Nearest gas mark gives the closest common gas setting.',
      'Use the note to remember that oven setting is not the same as food internal temperature.',
    ],
    mistakes: [
      'Do not treat gas mark as a lab-exact temperature.',
      'Do not assume your oven runs perfectly at the dial setting.',
      'Do not use oven temperature conversion as a food safety check.',
    ],
    sources: [sourceLinks.nistUnits, sourceLinks.foodSafetyTemperatures],
  },
  'butter-converter': {
    summary: 'Learn common butter equivalents for sticks, tablespoons, cups, ounces, grams, and pounds.',
    purpose:
      'The Butter Converter is a focused recipe helper for one ingredient that people often see written in different units. It makes US stick, cup, tablespoon, ounce, gram, and pound conversions easy to compare.',
    enter: [
      'Enter the butter amount from the recipe or package.',
      'Choose the unit you are starting from.',
      'Run the converter and read the common recipe equivalents.',
    ],
    read: [
      'The main answer is tablespoons because many recipes use tablespoon marks.',
      'Cups, sticks, and grams are shown together for easy recipe translation.',
      'Use package labels when your local butter is not sold as common US sticks.',
    ],
    mistakes: [
      'Do not assume every country uses the same stick size.',
      'Do not confuse fluid ounces with ounces by weight for butter.',
      'When baking needs precision, grams from a scale are usually safer than eyeballing marks.',
    ],
    sources: [sourceLinks.nistUnits],
  },
  'baking-pan-conversion-calculator': {
    summary: 'Learn how rectangular pan area can estimate recipe scaling when switching baking pans.',
    purpose:
      'The Baking Pan Conversion Calculator compares the surface area of two rectangular pans. The area ratio gives a starting scale factor for batter amount or servings.',
    enter: [
      'Enter the old pan length and width from the recipe.',
      'Enter the new pan length and width you want to use.',
      'Optionally enter original servings if you want a new serving estimate too.',
    ],
    read: [
      'Scale factor is the new pan area divided by the old pan area.',
      'Original and new pan areas show the square-inch comparison.',
      'Scaled servings appears when you entered the original serving count.',
    ],
    mistakes: [
      'Do not assume bake time stays the same when batter depth changes.',
      'Do not use rectangular area math for unusual shapes without extra care.',
      'Check doneness early when moving to a larger, shallower, smaller, or deeper pan.',
    ],
    sources: [sourceLinks.nistUnits],
  },
  'markdown-table-generator': {
    summary: 'Learn how to build a GitHub-flavored Markdown table from simple headers and rows.',
    purpose:
      'The Markdown Table Generator creates the header row, delimiter row, and body rows needed for a GitHub-flavored Markdown table. It is helpful when you need a quick comparison table for docs, blog drafts, project notes, or README files.',
    enter: [
      'Enter headers separated by commas or pipe characters.',
      'Enter one row per line using the same column order.',
      'Choose left, center, or right alignment before generating the table.',
    ],
    read: [
      'The output is copy-ready Markdown table text.',
      'Columns and rows confirm the table shape.',
      'Alignment tells you which delimiter style was used.',
    ],
    mistakes: [
      'Do not assume every Markdown editor supports tables the same way.',
      'Preview the result where you will publish it.',
      'Keep tables short enough to read on mobile screens.',
    ],
    sources: [sourceLinks.githubGfmTables],
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
      ...(detail.extraSections ?? []),
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
