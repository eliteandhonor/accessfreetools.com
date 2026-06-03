import type { BlogPostDefinition } from './blogPosts';
import { healthTools } from './healthTools';

interface GuideSection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  links?: Array<{
    href: string;
    label: string;
  }>;
}

export interface HealthGuideDefinition {
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

const extraSafetyNotes: Record<string, string> = {
  'underweight-bmi-calculator':
    'BMI can show that a weight is below the adult 18.5 screening threshold, but it cannot diagnose anorexia, malnutrition, or any eating disorder. If eating, exercise, body image, or weight feels hard to control, use qualified professional support.',
  'overweight-calculator':
    'BMI can show an adult screening category, but it does not measure body composition, waist size, blood pressure, labs, medications, or personal health history.',
  'army-body-fat-calculator':
    'This is an educational one-site tape estimate. It is not an official Army record, not a DA Form 5500/5501 entry, not a waiver, and not a flagging or pass/fail decision.',
  'body-fat-calculator':
    'This is an educational Navy-style tape estimate. It is not a DEXA scan, medical diagnosis, official military record, or complete body composition assessment.',
  'nutrition-points-calculator':
    'This is an original Access Free Tools label-reading score. It is not Weight Watchers Points, not affiliated with WW, and not a medical nutrition plan.',
  'bac-calculator':
    'BAC estimates are especially uncertain because food, medication, drinking speed, tolerance, and body composition can change real-world results. Never use a BAC estimate to decide whether to drive.',
  'gfr-calculator':
    'eGFR depends on standardized lab creatinine and clinical context. A clinician may compare it with urine albumin, repeat labs, medications, age, and health history.',
  'pregnancy-calculator':
    'Pregnancy dating can change after ultrasound or clinician review. Treat calendar dates as planning estimates.',
  'due-date-calculator':
    'Due dates are estimates. Many healthy pregnancies deliver before or after the estimated date.',
  'pregnancy-weight-gain-calculator':
    'Pregnancy weight gain guidance should be personalized for your pregnancy, medical history, and care team.',
  'ovulation-calculator':
    'Calendar fertile-window estimates are not reliable contraception and work best only when cycles are regular.',
  'conception-calculator':
    'Conception timing is approximate because ovulation, fertilization, and implantation do not happen on a perfectly fixed schedule.',
  'pregnancy-conception-calculator':
    'A due-date-based conception estimate is a backward calendar estimate, not proof of an exact conception date.',
};

function getFormulaAnswer(toolSlug: string) {
  const formulaFaq = healthTools.find((tool) => tool.slug === toolSlug)?.faq[2]?.answer;
  return formulaFaq ?? 'The calculator uses the formula and inputs shown on the tool page.';
}

function getSourceLinks(toolSlug: string) {
  const bmiSources = [
    { href: 'https://www.cdc.gov/BMI/', label: 'CDC: Adult BMI categories and screening notes' },
    { href: 'https://www.nhlbi.nih.gov/health/educational/lose_wt/bmitools', label: 'NHLBI: Healthy weight and BMI tools' },
  ];
  const eatingDisorderSources = [
    { href: 'https://www.nimh.nih.gov/health/publications/eating-disorders', label: 'NIMH: Eating disorders signs, symptoms, and help' },
  ];
  const nutritionLabelSources = [
    { href: 'https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/changes-nutrition-facts-label', label: 'FDA: Changes to the Nutrition Facts label' },
  ];
  const energySources = [
    {
      href: 'https://pubmed.ncbi.nlm.nih.gov/2305711/',
      label: 'PubMed: Mifflin-St Jeor resting energy equation',
    },
    {
      href: 'https://www.cdc.gov/physical-activity-basics/measuring/index.html',
      label: 'CDC: Physical activity intensity and MET guidance',
    },
  ];
  const pregnancySources = [
    {
      href: 'https://www.mayoclinic.org/healthy-lifestyle/getting-pregnant/in-depth/due-date-calculator/itt-20084986',
      label: 'Mayo Clinic: Due date calculator',
    },
    {
      href: 'https://www.acog.org/womens-health/faqs/fertility-awareness-based-methods-of-family-planning',
      label: 'ACOG: Fertility awareness-based methods',
    },
  ];
  const macroSources = [
    {
      href: 'https://www.ncbi.nlm.nih.gov/books/NBK610329/',
      label: 'National Academies / NCBI Bookshelf: Acceptable Macronutrient Distribution Range background',
    },
  ];

  if (toolSlug === 'army-body-fat-calculator') {
    return [
      {
        href: 'https://www.armyresilience.army.mil/abcp/index.html',
        label: 'U.S. Army DPRR: Army Body Composition Program',
      },
      {
        href: 'https://www.armyresilience.army.mil/abcp/BodyFatCalculator.html',
        label: 'U.S. Army DPRR: ABCP body fat calculator',
      },
      {
        href: 'https://www.armyresilience.army.mil/ard/images/pdf/Policy/ALARACT_0322025.pdf',
        label: 'U.S. Army: ALARACT 032/2025 ABCP method update',
      },
      {
        href: 'https://recruiting.army.mil/Portals/15/DA5500.pdf',
        label: 'U.S. Army Recruiting: DA Form 5500 male worksheet',
      },
      {
        href: 'https://recruiting.army.mil/Portals/15/DA5501.pdf',
        label: 'U.S. Army Recruiting: DA Form 5501 female worksheet',
      },
    ];
  }

  if (toolSlug === 'underweight-bmi-calculator') {
    return [...bmiSources, ...eatingDisorderSources];
  }

  if (toolSlug === 'body-fat-calculator') {
    return [
      {
        href: 'https://www.navyreserve.navy.mil/Portals/35/SSO%20Documents/Guide%2004-Body%20Composition%20Assessment-BCA-APR%202021.pdf',
        label: 'U.S. Navy Reserve: Guide 4 Body Composition Assessment',
      },
      {
        href: 'https://www.ncbi.nlm.nih.gov/books/NBK235939/',
        label: 'NCBI Bookshelf: Body composition standards and methods',
      },
      {
        href: 'https://www.ncbi.nlm.nih.gov/books/NBK235943/',
        label: 'NCBI Bookshelf: Navy circumference inputs background',
      },
      ...bmiSources,
    ];
  }

  if (toolSlug === 'ideal-weight-calculator') {
    return [
      {
        href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8646317/',
        label: 'PMC: Ideal body weight formula commentary',
      },
      ...bmiSources,
    ];
  }

  if (['bmi-calculator', 'overweight-calculator', 'healthy-weight-calculator', 'body-fat-calculator', 'army-body-fat-calculator', 'lean-body-mass-calculator', 'body-type-calculator'].includes(toolSlug)) {
    return bmiSources;
  }

  if (['calorie-calculator', 'bmr-calculator', 'tdee-calculator', 'calories-burned-calculator', 'pace-calculator', 'one-rep-max-calculator'].includes(toolSlug)) {
    return energySources;
  }

  if (toolSlug === 'target-heart-rate-calculator') {
    return [
      {
        href: 'https://www.heart.org/en/healthy-living/exercise-and-physical-activity/fitness-basics/target-heart-rates',
        label: 'American Heart Association: Target heart rates',
      },
      {
        href: 'https://www.cdc.gov/physical-activity-basics/measuring/index.html',
        label: 'CDC: Physical activity intensity',
      },
      {
        href: 'https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/exercise-intensity/art-20046887',
        label: 'Mayo Clinic: Exercise intensity',
      },
      {
        href: 'https://www.hopkinsmedicine.org/health/wellness-and-prevention/understanding-your-target-heart-rate',
        label: 'Johns Hopkins Medicine: Understanding target heart rate',
      },
    ];
  }

  if (['pregnancy-calculator', 'pregnancy-conception-calculator', 'due-date-calculator', 'ovulation-calculator', 'conception-calculator', 'period-calculator'].includes(toolSlug)) {
    return pregnancySources;
  }

  if (toolSlug === 'pregnancy-weight-gain-calculator') {
    return [
      { href: 'https://www.cdc.gov/maternal-infant-health/pregnancy-weight/index.html', label: 'CDC: Weight gain during pregnancy' },
      ...pregnancySources,
    ];
  }

  if (['macro-calculator', 'carbohydrate-calculator', 'protein-calculator', 'fat-intake-calculator'].includes(toolSlug)) {
    return macroSources;
  }

  if (toolSlug === 'nutrition-points-calculator') {
    return nutritionLabelSources;
  }

  if (toolSlug === 'gfr-calculator') {
    return [
      { href: 'https://www.kidney.org/ckd-epi-creatinine-equation-2021-0', label: 'National Kidney Foundation: CKD-EPI creatinine equation 2021' },
    ];
  }

  if (toolSlug === 'body-surface-area-calculator') {
    return [
      { href: 'https://www.ncbi.nlm.nih.gov/books/NBK559005/', label: 'NCBI Bookshelf: Body surface area formulas' },
    ];
  }

  if (toolSlug === 'bac-calculator') {
    return [
      { href: 'https://www.niaaa.nih.gov/health-professionals-communities/core-resource-on-alcohol/basics-defining-how-much-alcohol-too-much', label: 'NIAAA: Standard drink and alcohol guidance' },
      { href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4361698/', label: 'PMC: Alcohol calculations and their uncertainty' },
    ];
  }

  return [];
}

interface GuideDetail {
  summary: string;
  purpose: string;
  enter: string[];
  example: string[];
  read: string[];
  mistakes: string[];
  next: string[];
}

const guideDetails: Record<string, GuideDetail> = {
  'bmi-calculator': {
    summary: 'Learn what BMI needs, what the category means, and why adult BMI is only a screening estimate.',
    purpose:
      'The BMI Calculator turns height and weight into one adult screening number. It is useful for a quick reference, but it does not see muscle, pregnancy, age-related body composition, or a clinician view of health.',
    enter: [
      'Enter height and weight in the same unit system you normally use.',
      'Use a recent weight if you are checking today, or use the same measurement conditions if you are tracking a trend.',
      'Use this adult tool for adults, not for child or teen BMI percentiles.',
    ],
    example: [
      'For 170 cm and 70 kg, the calculator converts height to meters, squares it, then divides 70 by that squared height.',
      'The result is about 24.2, which sits inside the common adult healthy-weight BMI category.',
    ],
    read: [
      'Start with the BMI number, then read the category label as a broad screen rather than a final health score.',
      'The healthy weight range shows what weights would land between BMI 18.5 and 24.9 for the same height.',
    ],
    mistakes: [
      'Do not use BMI alone to judge fitness, body fat, or medical risk.',
      'Do not mix pounds with centimeters or kilograms with feet unless the tool mode expects it.',
      'Do not use adult BMI categories for children, teens, or pregnancy weight questions.',
    ],
    next: [
      'Use Healthy Weight Calculator for the height-based range.',
      'Use Body Fat Calculator if you want a tape-measure estimate alongside BMI.',
    ],
  },
  'underweight-bmi-calculator': {
    summary: 'Learn how to check adult BMI against the underweight threshold without treating BMI as an eating-disorder diagnosis.',
    purpose:
      'The Underweight BMI Calculator is a safer replacement for harmful "anorexic BMI" style tools. It checks adult BMI against the underweight screening threshold, then explains why BMI cannot diagnose anorexia, malnutrition, or any eating disorder.',
    enter: [
      'Enter adult height in centimeters and weight in kilograms.',
      'Use a current, real measurement if you are checking today, or use the same measurement conditions if you are tracking a trend.',
      'Use this adult screening page for adults, not child or teen BMI percentiles.',
    ],
    example: [
      'For 170 cm and 50 kg, the calculator converts height to meters and divides 50 by height squared.',
      'The result is about BMI 17.3, which is below the adult BMI 18.5 screening threshold.',
    ],
    read: [
      'The BMI category says whether the result is below 18.5, not why it is there.',
      'The "to BMI 18.5" metric shows the difference from the lower adult healthy-BMI boundary.',
      'The safety note matters: eating-disorder concerns need professional support, not a calculator label.',
    ],
    mistakes: [
      'Do not call someone anorexic from a BMI number.',
      'Do not use this page as a goal to reach a lower weight.',
      'Do not ignore symptoms, restriction, over-exercise, fear of weight gain, or body-image distress because BMI looks normal.',
    ],
    next: [
      'Use BMI Calculator for the broader category view.',
      'Use Healthy Weight Calculator for the full adult BMI reference range.',
    ],
  },
  'overweight-calculator': {
    summary: 'Learn how adult BMI is compared with the overweight screening range and why the result is not a full health judgment.',
    purpose:
      'The Overweight BMI Calculator checks adult BMI against the BMI 25 and BMI 30 screening thresholds. It is designed with people-first language and clear limits, because BMI categories are screening labels, not a complete story about health.',
    enter: [
      'Enter adult height in centimeters and weight in kilograms.',
      'Use the same measurement conditions when comparing changes over time.',
      'Use this adult screening page for adults, not child or teen BMI percentiles.',
    ],
    example: [
      'For 170 cm and 78 kg, the calculator divides 78 by height in meters squared.',
      'The result is about BMI 27.0, which falls in the adult overweight screening category.',
    ],
    read: [
      'The category is a broad screen: BMI 25 to less than 30 is the overweight range.',
      'The "above BMI 24.9" metric shows the difference from the upper adult healthy-BMI boundary.',
      'The BMI 30 comparison shows how far the result is from the obesity screening threshold.',
    ],
    mistakes: [
      'Do not use BMI as a measure of worth, fitness, or effort.',
      'Do not ignore waist size, body composition, blood pressure, lab results, medications, or health history.',
      'Do not use this page for children, teens, pregnancy, or medical decisions.',
    ],
    next: [
      'Use Healthy Weight Calculator for the height-based BMI reference range.',
      'Use Body Fat Calculator if you want a tape-measure estimate alongside BMI.',
    ],
  },
  'nutrition-points-calculator': {
    summary: 'Learn how to use a transparent food-label score without copying proprietary diet-program points.',
    purpose:
      'The Nutrition Points Calculator gives Access Free Tools its own visible formula for rough food comparisons. It uses label fields that people can actually find: calories, saturated fat, added sugar, sodium, dietary fiber, and protein.',
    enter: [
      'Enter the values from one serving on the Nutrition Facts label.',
      'Use saturated fat and added sugar, not total fat and total sugar, because those are the fields this score asks for.',
      'Use the same serving size when comparing two foods.',
    ],
    example: [
      'For the snack-label example, calories, saturated fat, added sugar, and sodium add moderation points.',
      'Fiber and protein subtract support credits, then the calculator shows the remaining points and a plain category.',
    ],
    read: [
      'Lower points usually means the food scored lighter by this formula.',
      'Moderation points show the part added by calories, saturated fat, added sugar, and sodium.',
      'Fiber/protein credits show the part subtracted for fiber and protein.',
    ],
    mistakes: [
      'Do not compare this with Weight Watchers Points; it is not the same formula and is not affiliated with WW.',
      'Do not use points alone to decide whether a food is good or bad.',
      'Do not ignore medical nutrition advice, allergies, diabetes care, kidney restrictions, pregnancy, or eating-disorder recovery needs.',
    ],
    next: [
      'Use Calorie Calculator for daily energy estimates.',
      'Use Macro Calculator for calorie splits across protein, fat, and carbohydrate.',
    ],
  },
  'calorie-calculator': {
    summary: 'Learn how maintenance calories are estimated from BMR, activity, and goal settings.',
    purpose:
      'The Calorie Calculator estimates daily energy needs so you can compare maintenance, gentle loss, and gentle gain targets. It is a planning estimate, not a promise about exact weight change.',
    enter: [
      'Enter age, formula sex, height, and weight because they set the BMR estimate.',
      'Choose the activity level that describes an average week, not your best workout day.',
      'Pick a goal only after checking the maintenance number first.',
    ],
    example: [
      'A moderate-activity example first estimates BMR, then multiplies it by the activity factor.',
      'If a goal is selected, the tool adjusts from maintenance instead of replacing the maintenance estimate.',
    ],
    read: [
      'Maintenance is the anchor number. Loss and gain targets are offsets from that anchor.',
      'If real-world weight trends do not match after a few weeks, the activity estimate or intake tracking may need adjustment.',
    ],
    mistakes: [
      'Do not choose very active because of one hard session if most days are desk-based.',
      'Do not treat the estimate as exact metabolism.',
      'Do not make aggressive diet changes without professional support, especially with medical conditions or pregnancy.',
    ],
    next: [
      'Use TDEE Calculator if you want to focus only on daily expenditure.',
      'Use Macro Calculator to split calories into protein, fat, and carbohydrate grams.',
    ],
  },
  'body-fat-calculator': {
    summary: 'Learn how the Navy-style tape method creates a body-fat estimate and how to measure more consistently.',
    purpose:
      'The Body Fat Calculator uses a Navy-style circumference equation to estimate body fat percentage, fat mass, and lean mass. The value is most useful for consistent trend checks, not diagnosis or official testing.',
    enter: [
      'Enter formula sex, height, neck, waist, and hip when the female equation is selected.',
      'Add weight if you want estimated fat mass and lean mass. Weight does not change the percentage equation.',
      'Keep the tape level, snug, and not digging into the skin, then use the same sites when comparing changes over time.',
    ],
    example: [
      'For the female example, 165 cm height, 68 kg weight, 34 cm neck, 78 cm waist, and 98 cm hips returns about 29.74% body fat.',
      'Because weight was entered, the same result shows about 20.22 kg estimated fat mass and 47.78 kg estimated lean mass.',
      'For the male example, 180 cm height, 84 kg weight, 40 cm neck, and 88 cm waist returns about 16.94% body fat.',
    ],
    read: [
      'Read the body fat percentage as a tape-method estimate, then look at fat mass and lean mass for context if weight was entered.',
      'A small change can come from measurement placement, posture, breathing, tape angle, or tape tension, not only body composition.',
      'Use one method consistently when tracking a trend. Do not compare this number with a scale, caliper, or scan as if every method uses the same assumptions.',
    ],
    mistakes: [
      'Do not switch waist sites between checks. The male equation is especially sensitive to waist minus neck.',
      'Do not pull the tape tighter on later measurements just to see a lower number.',
      'Do not use the estimate as a diagnosis, official record, sport weight-class decision, or medical body composition test.',
    ],
    next: [
      'Use Army Body Fat Calculator if you want the current Army one-site tape estimate instead.',
      'Use Lean Body Mass Calculator for a formula-based lean-mass comparison.',
      'Use BMI Calculator if you want the simpler adult height-and-weight screening number beside this tape estimate.',
    ],
  },
  'bmr-calculator': {
    summary: 'Learn what basal metabolic rate means and why it is the base for calorie planning.',
    purpose:
      'The BMR Calculator estimates the calories your body may use at rest with the Mifflin-St Jeor equation. It does not include exercise, work, steps, or daily movement until an activity factor is added.',
    enter: [
      'Enter age in years, formula sex, height in centimeters, and weight in kilograms.',
      'Use current measurements for today, or the same measurement routine if comparing changes over time.',
      'Remember what the formula sex setting does: it chooses the +5 or -161 Mifflin-St Jeor adjustment. It does not describe your whole body or health picture.',
    ],
    example: [
      'For a 35-year-old male at 178 cm and 82 kg, the estimate is 10 x 82 + 6.25 x 178 - 5 x 35 + 5, or about 1,763 kcal/day.',
      'For a 29-year-old female at 164 cm and 61 kg, the same structure uses the -161 adjustment and returns about 1,329 kcal/day.',
      'If the 1,763 kcal BMR example is multiplied by the moderate activity factor of 1.55, the TDEE context is about 2,732 kcal/day. That is why BMR and daily calorie needs are not the same number.',
    ],
    read: [
      'A higher BMR estimate usually reflects larger body size, taller height, younger age, or the formula sex setting.',
      'Read the BMR line as resting energy only. The sedentary and moderate TDEE lines show what happens after broad activity factors are added.',
      'Use BMR as a starting point, then move to TDEE Calculator or Calorie Calculator for daily planning.',
    ],
    mistakes: [
      'Do not eat at BMR just because it appears on the page; daily needs usually include activity.',
      'Do not compare BMR results across formulas without noting which formula was used.',
      'Do not use BMR as pregnancy, child, eating-disorder, medical, or sports-nutrition advice.',
    ],
    next: [
      'Use TDEE Calculator to add activity.',
      'Use Calorie Calculator to compare maintenance and goal estimates.',
      'Use Macro Calculator only after you have a calorie target you trust enough to split into protein, fat, and carbohydrate grams.',
    ],
  },
  'ideal-weight-calculator': {
    summary: 'Learn how the Devine ideal body weight formula differs from an adult healthy BMI range.',
    purpose:
      'The Ideal Weight Calculator gives a Devine formula reference from height and formula sex, then compares it with the adult healthy BMI range. It is a reference point, not a personal requirement.',
    enter: [
      'Enter height in centimeters and choose the formula sex setting because Devine uses different 5-foot base weights.',
      'Use the adult healthy BMI range as a wider comparison beside the single Devine formula estimate.',
      'Remember that frame size, muscle, age, pregnancy, training history, and health history are not included.',
    ],
    example: [
      'For a 180 cm male formula example, the calculator starts at 50 kg and adds 2.3 kg for about 10.866 inches above 5 feet.',
      'That gives 74.99 kg by the Devine formula, while the adult healthy BMI range for 180 cm is about 59.94-80.68 kg.',
      'For a 165 cm female formula example, the calculator returns 56.91 kg and shows an adult healthy BMI range of about 50.37-67.79 kg.',
    ],
    read: [
      'Treat the ideal weight number as one historical formula output, not a body judgment.',
      'The BMI range is usually more useful than a single target because bodies vary and BMI itself is still only a screening reference.',
      'If your height is at or below 5 feet, this calculator keeps the Devine inches-over-5-feet term at zero instead of subtracting below the base weight.',
    ],
    mistakes: [
      'Do not treat the word ideal as a command.',
      'Do not use this for children, teen growth, pregnancy, athletic performance, eating-disorder concerns, or medication dosing decisions.',
      'Do not ignore waist size, body composition, lab results, symptoms, or clinician advice just because one formula gives a tidy number.',
    ],
    next: [
      'Use Healthy Weight Calculator for BMI range only.',
      'Use BMI Calculator to compare current weight with adult BMI categories.',
      'Use Body Fat Calculator if circumference and body-composition context matters more than a height-only formula.',
    ],
  },
  'pace-calculator': {
    summary: 'Learn how to convert workout distance and time into pace per mile or kilometer and speed per hour.',
    purpose:
      'The Pace Calculator turns a distance and elapsed time into pace per mile or kilometer, plus speed per hour. It is useful for running, walking, cycling, race goals, and comparing training logs without doing time math by hand.',
    enter: [
      'Enter the total distance and choose miles or kilometers.',
      'Enter the full elapsed time, including hours, minutes, and seconds. For races, use total elapsed time; for a private workout log, use moving time only if you mean to exclude stops.',
      'Use the same distance unit and the same time type when comparing workouts.',
    ],
    example: [
      'For 5 km in 25:00, the calculator divides 25 minutes by 5.',
      'The result is 5:00 per kilometer, and speed is 12.00 km/h.',
      'For 10 km in 55:30, the pace is 5:33 per kilometer and the speed is 10.81 km/h.',
      'For 3 miles in 30:00, the pace is 10:00 per mile and the speed is 6.00 mi/h.',
      'For a 4:00:00 marathon over 42.195 km, the pace is about 5:41 per kilometer and the speed is 10.55 km/h.',
    ],
    read: [
      'Lower pace means faster because it is time per distance.',
      'Higher speed means faster because it is distance per hour.',
      'A pace like 5:00 per km is not the same as 5:00 per mile. Check the selected distance unit before comparing results.',
      'The displayed pace is rounded to the nearest second per unit, so tiny decimal differences are normal.',
    ],
    mistakes: [
      'Do not mix moving time and total elapsed time when comparing sessions.',
      'Do not compare mile pace with kilometer pace without converting.',
      'Do not use pace alone to judge effort on hills, heat, or trails.',
      'Do not use this as medical advice or as a push to train harder than your current health, recovery, or experience can support.',
    ],
    next: [
      'Use Calories Burned Calculator to estimate workout energy.',
      'Use Target Heart Rate Calculator to compare effort zones.',
      'Use BMR Calculator when you need resting energy context instead of workout pace.',
    ],
  },
  'army-body-fat-calculator': {
    summary: 'Learn how the current Army one-site tape estimate uses body weight, abdomen circumference, and age-group reference limits.',
    purpose:
      'The Army Body Fat Calculator provides an educational one-site tape estimate. It uses the current Army-style equation from the DA Form 5500/5501 worksheets, but it is not an official record, waiver, flagging decision, or pass/fail decision.',
    enter: [
      'Enter sex, age, body weight in pounds, and abdomen circumference in inches.',
      'Measure abdomen at the navel level with a non-stretch tape, then enter the average number you want the calculator to use.',
      'Use age for the reference limit only; age does not change the body-fat equation itself.',
    ],
    example: [
      'For the male 210/35 example, the formula is -26.97 - (0.12 x 210) + (1.99 x 35).',
      'That gives 17.48%, which rounds to 17% for the displayed tape estimate.',
      'Because age 25 falls in the 21-27 group, the reference limit shown beside the result is 22% for the male table.',
    ],
    read: [
      'Start with the rounded percent, then look at the exact formula estimate if you want to see the decimal before rounding.',
      'Use the age-group reference limit as context only. Access Free Tools cannot make an official Army compliance decision.',
      'If you are comparing changes over time, keep the tape site, tape tension, and body-weight measurement as consistent as possible.',
    ],
    mistakes: [
      'Do not use this page for official military decisions.',
      'Do not use the old neck, waist, hip, and height tape method for the current Army one-site estimate.',
      'Do not round or adjust measurements to force a preferred result.',
      'Do not compare results if the abdomen site, tape tension, scale, or measurement timing changed.',
    ],
    next: [
      'Use Body Fat Calculator for a general tape estimate.',
      'Use Lean Body Mass Calculator to compare estimated lean mass.',
    ],
  },
  'lean-body-mass-calculator': {
    summary: 'Learn how lean body mass is estimated from height, weight, and formula sex.',
    purpose:
      'The Lean Body Mass Calculator estimates fat-free mass with the Boer equation. It is a simple formula reference, not a scan of your body composition.',
    enter: [
      'Enter height, weight, and formula sex.',
      'Use current values if you want a current estimate.',
      'Use the same formula when tracking changes.',
    ],
    example: [
      'For 180 cm and 82 kg, the calculator applies the height and weight terms in the Boer equation.',
      'The result estimates lean body mass, and the remaining weight is a rough implied fat mass.',
    ],
    read: [
      'Lean body mass includes muscle, bone, organs, and water.',
      'The estimate can be useful beside body fat percentage, but it is still formula-based.',
    ],
    mistakes: [
      'Do not read lean mass as muscle mass only.',
      'Do not compare formula estimates with DEXA or other methods as if they are identical.',
      'Do not use it for medication or clinical decisions.',
    ],
    next: [
      'Use Body Fat Calculator for a tape-based estimate.',
      'Use BMR Calculator to see how body size affects resting energy estimates.',
    ],
  },
  'healthy-weight-calculator': {
    summary: 'Learn how the healthy-weight range is built from adult BMI 18.5 to 24.9.',
    purpose:
      'The Healthy Weight Calculator shows the weight range that corresponds to adult BMI 18.5 to 24.9 for a chosen height.',
    enter: [
      'Enter height accurately because the range is entirely height-based.',
      'Optionally enter current weight if you want a current BMI comparison.',
      'Use this for adult screening ranges, not child growth charts.',
    ],
    example: [
      'For a height example, the calculator squares height in meters and multiplies it by 18.5 and 24.9.',
      'Those two calculations become the lower and upper ends of the range.',
    ],
    read: [
      'The range is a reference zone, not a required personal target.',
      'The optional current BMI helps place today’s weight next to the range.',
    ],
    mistakes: [
      'Do not use the range for pregnancy weight gain.',
      'Do not treat it as a complete health assessment.',
      'Do not ignore body composition, age, and medical context.',
    ],
    next: [
      'Use BMI Calculator for the exact current BMI number.',
      'Use Ideal Weight Calculator if you want a formula comparison.',
    ],
  },
  'calories-burned-calculator': {
    summary: 'Learn how MET, body weight, and duration create a workout calorie estimate.',
    purpose:
      'The Calories Burned Calculator estimates exercise energy from activity intensity, weight, and time. It is best for comparing activities, not measuring exact calories.',
    enter: [
      'Choose the activity or MET value that most closely matches the workout.',
      'Enter body weight and workout duration.',
      'Use the same MET choice when comparing similar sessions.',
    ],
    example: [
      'For a brisk walk at 3.8 MET, the calculator multiplies MET by weight and duration.',
      'A heavier body weight or longer duration increases the estimate.',
    ],
    read: [
      'The answer is an estimate of energy used during the activity.',
      'Calories per hour helps compare activities of different lengths.',
    ],
    mistakes: [
      'Do not treat watch, machine, and formula calories as exact truth.',
      'Do not pick a higher MET than the effort really matched.',
      'Do not use exercise calories as medical nutrition advice.',
    ],
    next: [
      'Use Pace Calculator for running or walking pace.',
      'Use Calorie Calculator to compare workout estimates with daily needs.',
    ],
  },
  'one-rep-max-calculator': {
    summary: 'Learn how rep sets estimate one-rep max without testing a true max.',
    purpose:
      'The One Rep Max Calculator estimates strength from a weight you lifted for multiple reps. It helps plan training percentages without requiring a risky max attempt.',
    enter: [
      'Enter the weight lifted and the number of completed reps.',
      'Use a set that was close to hard but performed with good form.',
      'Keep reps in a normal estimating range; very high reps are less reliable.',
    ],
    example: [
      'For 100 kg x 5, the Epley formula adds one sixth of the weight to the original load.',
      'The result is an estimated 1RM of about 117 kg, with another formula shown for comparison.',
    ],
    read: [
      'Use the estimate to plan percentages, not to prove what you must lift today.',
      'If formulas disagree, treat the range as uncertainty.',
    ],
    mistakes: [
      'Do not test heavy singles without proper setup and supervision.',
      'Do not use failed reps or partial reps as clean input.',
      'Do not expect the same estimate across every lift.',
    ],
    next: [
      'Use Protein Calculator for nutrition planning around training.',
      'Use Target Heart Rate Calculator for conditioning work.',
    ],
  },
  'target-heart-rate-calculator': {
    summary: 'Learn how age, effort range, and resting pulse become estimated exercise heart-rate zones.',
    purpose:
      'The Target Heart Rate Calculator gives a beats-per-minute range for exercise. It is useful when you want a quick check for moderate or vigorous effort, but it is still an estimate, not a medical limit.',
    enter: [
      'Enter age so the tool can estimate maximum heart rate.',
      'Choose moderate 50-70%, vigorous 70-85%, or the wider 50-85% range.',
      'Add resting heart rate if you want the heart-rate-reserve result beside the simple result.',
    ],
    example: [
      'For age 35, the simple maximum estimate is 220 minus 35, which is 185 bpm.',
      'The 50-85% range is about 93-157 bpm. With a 65 bpm resting pulse, the heart-rate-reserve range is about 125-167 bpm.',
    ],
    read: [
      'Use the range as a guide, then check how you feel. Moderate effort should usually let you talk, while vigorous effort makes talking harder.',
      'Heat, sleep, stress, caffeine, medication, fitness, and illness can all make the same heart rate feel different.',
    ],
    mistakes: [
      'Do not push into a zone that feels unsafe just because the calculator shows it.',
      'Do not treat 220 minus age as exact. It is a quick estimate, not a lab test.',
      'Do not ignore medical advice about exercise limits, heart conditions, pregnancy, or medication that changes pulse.',
    ],
    next: [
      'Use Pace Calculator to compare heart rate with speed.',
      'Use Calories Burned Calculator for an activity energy estimate.',
    ],
  },
  'pregnancy-calculator': {
    summary: 'Learn how LMP and cycle length estimate due date, gestational age, and trimester.',
    purpose:
      'The Pregnancy Calculator uses the first day of the last menstrual period and cycle length to estimate due date, gestational age today, conception timing, and trimester.',
    enter: [
      'Enter the first day of the last menstrual period, not the last day bleeding occurred.',
      'Adjust cycle length if your usual cycle is shorter or longer than 28 days.',
      'Use the current date on the page to read gestational age today.',
    ],
    example: [
      'For an LMP of Apr 1 with a 28-day cycle, the calculator adds about 280 days for the due date.',
      'If the cycle is longer, ovulation is estimated later and the due date can shift later.',
    ],
    read: [
      'Gestational age is counted from LMP, so it is usually about two weeks more than conception age.',
      'Trimester labels are planning references and may change after clinical dating.',
    ],
    mistakes: [
      'Do not treat the estimated conception date as proof of one exact day.',
      'Do not use calendar dating instead of ultrasound or clinician guidance.',
      'Do not forget to adjust for a cycle that is not 28 days.',
    ],
    next: [
      'Use Due Date Calculator for a focused due-date page.',
      'Use Pregnancy Weight Gain Calculator for BMI-based gain references.',
    ],
  },
  'pregnancy-weight-gain-calculator': {
    summary: 'Learn how pre-pregnancy BMI connects to pregnancy weight-gain guideline ranges.',
    purpose:
      'The Pregnancy Weight Gain Calculator compares current gain with BMI-based guideline ranges for singleton pregnancy planning.',
    enter: [
      'Enter pre-pregnancy height and weight so the tool can estimate pre-pregnancy BMI.',
      'Enter current weight and pregnancy week.',
      'Use the singleton/twin context shown by the tool carefully because guidance differs.',
    ],
    example: [
      'For week 24, the calculator finds the gain from pre-pregnancy weight to current weight.',
      'It then compares that gain with the guideline range tied to the pre-pregnancy BMI category.',
    ],
    read: [
      'The range is a conversation starter for prenatal care, not a judgment.',
      'Week-by-week gain can vary, especially with nausea, fluid shifts, and medical needs.',
    ],
    mistakes: [
      'Do not use adult weight-loss logic during pregnancy.',
      'Do not use the result to restrict food without a clinician.',
      'Do not ignore twin, triplet, or high-risk pregnancy guidance.',
    ],
    next: [
      'Use Pregnancy Calculator to check due date and gestational age.',
      'Bring the result to prenatal care if you have concerns.',
    ],
  },
  'pregnancy-conception-calculator': {
    summary: 'Learn how a due date can be counted backward to estimate a conception window.',
    purpose:
      'The Pregnancy Conception Calculator starts from a due date and estimates conception timing, possible conception window, and LMP.',
    enter: [
      'Enter the due date you were given or estimated.',
      'Use the window, not just the center date, when reading the result.',
      'Remember that clinical dating may update the due date later.',
    ],
    example: [
      'For a due date example, the calculator subtracts about 266 days to estimate conception.',
      'It then shows a wider window because ovulation and fertilization vary.',
    ],
    read: [
      'The center date is a best estimate, not proof.',
      'The window is more honest than a single day because biology and dating methods are imperfect.',
    ],
    mistakes: [
      'Do not use the estimate for legal, relationship, or medical proof.',
      'Do not ignore ultrasound or clinician dating.',
      'Do not assume conception and intercourse happened on the same day.',
    ],
    next: [
      'Use Due Date Calculator if you want to start from LMP instead.',
      'Use Ovulation Calculator for forward cycle estimates.',
    ],
  },
  'due-date-calculator': {
    summary: 'Learn how LMP and cycle length estimate a pregnancy due date.',
    purpose:
      'The Due Date Calculator focuses on expected delivery date from the first day of the last menstrual period and usual cycle length.',
    enter: [
      'Enter the first day of the last menstrual period.',
      'Set the usual cycle length if it differs from 28 days.',
      'Use the result as a planning date until clinical dating is confirmed.',
    ],
    example: [
      'With Apr 1 as LMP and a 28-day cycle, the calculator adds 280 days.',
      'A longer cycle moves estimated ovulation later, so the date can shift later.',
    ],
    read: [
      'A due date is an estimate; many healthy pregnancies deliver before or after it.',
      'The conception estimate is backward math from the due date, not a confirmed event date.',
    ],
    mistakes: [
      'Do not enter ovulation date into an LMP field.',
      'Do not treat the due date as an appointment guarantee.',
      'Do not ignore clinician updates after ultrasound.',
    ],
    next: [
      'Use Pregnancy Calculator for gestational age and trimester too.',
      'Use Pregnancy Conception Calculator to work backward from a due date.',
    ],
  },
  'ovulation-calculator': {
    summary: 'Learn how cycle length and luteal phase estimate ovulation and fertile window.',
    purpose:
      'The Ovulation Calculator estimates ovulation date, fertile window, and next period for regular cycles.',
    enter: [
      'Enter the first day of the last period.',
      'Enter typical cycle length, not the length of bleeding.',
      'Adjust luteal phase only if you have a reason to use a value other than 14 days.',
    ],
    example: [
      'For a 28-day cycle with a 14-day luteal phase, ovulation is estimated around cycle day 14.',
      'The fertile window is shown around ovulation because sperm can survive for several days.',
    ],
    read: [
      'Use the window as a planning estimate, not a guarantee.',
      'Irregular cycles, postpartum cycles, illness, stress, and medication can shift ovulation.',
    ],
    mistakes: [
      'Do not use calendar ovulation estimates as contraception.',
      'Do not count period length as cycle length.',
      'Do not assume every cycle ovulates on day 14.',
    ],
    next: [
      'Use Period Calculator to estimate upcoming periods.',
      'Use Conception Calculator if you want the same cycle math framed around conception timing.',
    ],
  },
  'conception-calculator': {
    summary: 'Learn how cycle details estimate conception timing and why the date is approximate.',
    purpose:
      'The Conception Calculator estimates ovulation-based conception timing from last period, cycle length, and luteal phase.',
    enter: [
      'Enter the first day of the last period and usual cycle length.',
      'Use luteal phase only if you know it; otherwise keep the default.',
      'Read the fertile window beside the estimated conception date.',
    ],
    example: [
      'For a typical 28-day cycle, the calculator estimates ovulation near day 14.',
      'The estimated conception date is placed near ovulation, with a wider window for uncertainty.',
    ],
    read: [
      'Conception timing is a range because ovulation, sperm survival, and fertilization timing vary.',
      'A due-date-based estimate and a cycle-based estimate can differ.',
    ],
    mistakes: [
      'Do not treat the date as proof of exactly when conception happened.',
      'Do not use the tool when cycles are highly irregular without expecting uncertainty.',
      'Do not confuse LMP date with ovulation date.',
    ],
    next: [
      'Use Ovulation Calculator for fertile-window planning.',
      'Use Pregnancy Conception Calculator when you only know the due date.',
    ],
  },
  'period-calculator': {
    summary: 'Learn how last period date, cycle length, and period length predict upcoming dates.',
    purpose:
      'The Period Calculator estimates the next period start, expected end, and upcoming cycle dates from your usual cycle pattern.',
    enter: [
      'Enter the first day of the last period.',
      'Enter average cycle length from one period start to the next period start.',
      'Enter period length to estimate the expected end date.',
    ],
    example: [
      'If the last period started Apr 1 and the cycle is 28 days, the next start is estimated 28 days later.',
      'If period length is 5 days, the expected end is shown from that start date.',
    ],
    read: [
      'Use the dates for planning, not diagnosis.',
      'A cycle that arrives earlier or later than usual can be normal once in a while.',
    ],
    mistakes: [
      'Do not count from the last day of bleeding when the field asks for start date.',
      'Do not assume predictions stay accurate during irregular cycles, postpartum changes, or medication changes.',
      'Do not use period prediction as contraception.',
    ],
    next: [
      'Use Ovulation Calculator to estimate a fertile window.',
      'Track actual dates over a few cycles for better averages.',
    ],
  },
  'macro-calculator': {
    summary: 'Learn how calorie targets turn into grams of protein, fat, and carbs.',
    purpose:
      'The Macro Calculator splits daily calories into protein, fat, and carbohydrate grams so a calorie target becomes easier to plan as meals.',
    enter: [
      'Enter daily calories first.',
      'Choose a macro split that matches your goal or use the balanced preset.',
      'Check that the percentages add up to 100%.',
    ],
    example: [
      'For 2000 calories with a balanced split, the calculator assigns a percent to each macro.',
      'Protein and carbs use 4 calories per gram, while fat uses 9 calories per gram.',
    ],
    read: [
      'Grams are easier to use on food labels than percentages.',
      'The split is a planning template; food quality, fiber, medical needs, and preference still matter.',
    ],
    mistakes: [
      'Do not copy someone else’s macro split without context.',
      'Do not forget that alcohol calories are not counted as protein, fat, or carbohydrate in these targets.',
      'Do not use macros as medical diet advice.',
    ],
    next: [
      'Use Protein Calculator for a body-weight-based protein target.',
      'Use Calorie Calculator if you still need a daily calorie estimate.',
    ],
  },
  'carbohydrate-calculator': {
    summary: 'Learn how daily calories and carb percent become carbohydrate grams.',
    purpose:
      'The Carbohydrate Calculator converts a calorie target and carbohydrate percentage into grams per day.',
    enter: [
      'Enter daily calories.',
      'Enter the percentage of calories you want from carbohydrate.',
      'Keep the percentage realistic for your goal and health needs.',
    ],
    example: [
      'For 2000 calories at 50% carbohydrate, the calculator assigns 1000 calories to carbs.',
      'It then divides by 4 calories per gram to show 250 grams.',
    ],
    read: [
      'The answer is grams per day, which can be split across meals.',
      'Fiber, food quality, diabetes care, and training demands can change what target makes sense.',
    ],
    mistakes: [
      'Do not confuse grams of food with grams of carbohydrate.',
      'Do not choose extreme percentages without professional advice.',
      'Do not ignore medical guidance for blood sugar or kidney conditions.',
    ],
    next: [
      'Use Macro Calculator to check all macros together.',
      'Use Protein Calculator and Fat Intake Calculator for matching targets.',
    ],
  },
  'protein-calculator': {
    summary: 'Learn how body weight and grams-per-kilogram targets estimate daily protein.',
    purpose:
      'The Protein Calculator estimates daily protein grams from body weight and a selected grams-per-kilogram target.',
    enter: [
      'Enter body weight and choose kg or lb if the tool offers units.',
      'Choose the target factor that matches the context, such as general adult, active, or strength training.',
      'Use a clinician-approved target if you have kidney disease or another medical condition.',
    ],
    example: [
      'For 70 kg at 0.8 g/kg, the calculator multiplies 70 by 0.8.',
      'The result is 56 grams per day, before any personal adjustment.',
    ],
    read: [
      'The number is a daily target estimate, not a per-meal requirement.',
      'Higher training targets may not be right for every body or medical situation.',
    ],
    mistakes: [
      'Do not treat protein grams as calories; protein has about 4 calories per gram.',
      'Do not use high protein targets if a clinician has told you to limit protein.',
      'Do not forget total calories and food quality.',
    ],
    next: [
      'Use Macro Calculator to fit protein into total calories.',
      'Use TDEE Calculator to estimate daily energy needs.',
    ],
  },
  'fat-intake-calculator': {
    summary: 'Learn how daily calories and fat percent become fat grams.',
    purpose:
      'The Fat Intake Calculator converts a calorie target and fat percentage into grams per day.',
    enter: [
      'Enter daily calories.',
      'Enter the percent of calories planned from fat.',
      'Use a percentage that fits your nutrition context rather than chasing the lowest number.',
    ],
    example: [
      'For 2000 calories at 30% fat, the calculator assigns 600 calories to fat.',
      'It divides 600 by 9 calories per gram to show about 66.7 grams.',
    ],
    read: [
      'The answer is total fat grams per day.',
      'The calculator does not separate saturated, unsaturated, or trans fats.',
    ],
    mistakes: [
      'Do not confuse fat grams with body fat.',
      'Do not ignore fat quality and medical nutrition advice.',
      'Do not use macro percentages without checking total calories.',
    ],
    next: [
      'Use Macro Calculator to see protein, carb, and fat together.',
      'Use Carbohydrate Calculator for the matching carb target.',
    ],
  },
  'tdee-calculator': {
    summary: 'Learn how BMR and activity level estimate total daily energy expenditure.',
    purpose:
      'The TDEE Calculator estimates maintenance calories by calculating BMR and multiplying it by an activity factor.',
    enter: [
      'Enter age, formula sex, height, and weight.',
      'Choose the activity level that describes your normal week.',
      'Use the same activity setting when comparing changes over time.',
    ],
    example: [
      'A moderate activity example estimates BMR first.',
      'Then the calculator multiplies BMR by 1.55 to estimate total daily expenditure.',
    ],
    read: [
      'TDEE is a maintenance estimate, not a fat-loss target by itself.',
      'Real-world tracking can help refine the estimate because activity labels are broad.',
    ],
    mistakes: [
      'Do not double-count exercise if your activity level already includes it.',
      'Do not treat one day of activity as your normal week.',
      'Do not use TDEE as medical nutrition advice.',
    ],
    next: [
      'Use Calorie Calculator to compare goal adjustments.',
      'Use Macro Calculator to turn calories into grams.',
    ],
  },
  'gfr-calculator': {
    summary: 'Learn what eGFR inputs mean and why kidney results need clinical context.',
    purpose:
      'The GFR Calculator estimates adult eGFR from age, sex, and serum creatinine using the 2021 CKD-EPI creatinine equation.',
    enter: [
      'Enter age and formula sex exactly as required by the equation.',
      'Enter serum creatinine from a standardized lab result.',
      'Use the creatinine unit shown by the tool and do not convert by guessing.',
    ],
    example: [
      'For a creatinine example, the calculator compares creatinine with the equation constant for the selected sex.',
      'Age and sex factors then adjust the final eGFR estimate.',
    ],
    read: [
      'eGFR is reported as mL/min/1.73 m2.',
      'A clinician may compare eGFR with urine albumin, repeat labs, medications, and health history.',
    ],
    mistakes: [
      'Do not use eGFR to diagnose yourself from one calculator result.',
      'Do not enter non-standard or old lab values without checking units.',
      'Do not use this for children or pregnancy without clinician guidance.',
    ],
    next: [
      'Bring lab questions to a qualified clinician.',
      'Use Body Surface Area Calculator only as a separate educational reference.',
    ],
  },
  'body-type-calculator': {
    summary: 'Learn how shoulder, bust, waist, and hip measurements estimate a broad body-shape label.',
    purpose:
      'The Body Type Calculator compares the larger of shoulders or bust/chest with waist and hips to estimate a broad style category.',
    enter: [
      'Measure shoulders, bust or chest, waist, and hips in the same unit. The live tool uses centimeters.',
      'Keep the tape level and relaxed, and do not pull it tight enough to change the number.',
      'Use the same measurement sites if comparing later, because small changes can cross a category threshold.',
    ],
    example: [
      'For shoulders 100 cm, bust 96 cm, waist 76 cm, and hips 101 cm, the top and hips are within 5 cm and the waist is 24 cm smaller, so the tool returns Hourglass.',
      'For shoulders 92 cm, bust 90 cm, waist 74 cm, and hips 105 cm, the hips are 13 cm wider than the top measurement, so the tool returns Triangle or pear.',
      'For shoulders 108 cm, bust 102 cm, waist 82 cm, and hips 95 cm, the top measurement is 13 cm wider than the hips, so the tool returns Inverted triangle.',
      'For shoulders 98 cm, bust 95 cm, waist 86 cm, and hips 100 cm, the top and hips are close but the waist definition is under 20 cm, so the tool returns Rectangle.',
      'For shoulders 100 cm, bust 99 cm, waist 78 cm, and hips 106 cm, the hips are wider but not by 7 cm and the waist is still defined, so the tool returns Balanced.',
    ],
    read: [
      'The label is a style helper, not a health score, attractiveness score, or diagnosis.',
      'The calculator does not use height, weight, sex, or a 3D scan. It only compares the four body measurements you entered.',
      'Close measurements can make categories overlap, so read the result as an approximate label rather than a fixed identity.',
    ],
    mistakes: [
      'Do not rank bodies by category.',
      'Do not use clothing labels or vanity sizing as body measurements.',
      'Do not enter height and weight and expect a body-shape result; use the four circumference-style measurements instead.',
      'Do not treat the result as medical information, body composition, BMI, or a fitness score.',
    ],
    next: [
      'Use Body Fat Calculator only if you want a separate body-composition estimate.',
      'Use Healthy Weight Calculator for an adult BMI range reference.',
      'Use Ideal Weight Calculator only for a separate formula reference, not as a body-shape label.',
    ],
  },
  'body-surface-area-calculator': {
    summary: 'Learn how height and weight estimate adult body surface area with Mosteller and Du Bois formulas.',
    purpose:
      'The Body Surface Area Calculator estimates adult BSA in square meters from height and weight. It shows Mosteller as the main estimate and Du Bois as a comparison formula.',
    enter: [
      'Enter height in centimeters and weight in kilograms.',
      'Use measured values rather than rounded guesses when possible, because both formulas depend on the product of height and weight.',
      'Keep BSA separate from BMI, body fat, and body weight; they answer different questions.',
    ],
    example: [
      'For 170 cm and 70 kg, Mosteller multiplies 170 by 70, divides by 3600, then takes the square root.',
      'The result is about 1.82 m2 by Mosteller and about 1.81 m2 by Du Bois.',
      'For 180 cm and 85 kg, the calculator shows about 2.06 m2 by Mosteller and 2.05 m2 by Du Bois.',
      'For 160 cm and 55 kg, both formulas round to about 1.56 m2.',
    ],
    read: [
      'BSA is clinical math context, not a health grade, diagnosis, medication order, or treatment plan.',
      'Different formulas can produce slightly different estimates, so read the Mosteller and Du Bois lines as close comparisons rather than exact body facts.',
    ],
    mistakes: [
      'Do not use this page for medication dosing, chemotherapy, burn, surgery, kidney, or treatment decisions.',
      'Do not confuse square meters of BSA with body fat percentage, BMI, or body weight.',
      'Do not use this as a child, neonatal, pet, burn, psoriasis, procedure-specific, or Schnur-scale calculator.',
    ],
    next: [
      'Use GFR Calculator only for separate kidney-equation education.',
      'Use BMI Calculator or Healthy Weight Calculator if you need adult weight-screening context instead of BSA.',
      'Ask a clinician before using BSA for any care decision.',
    ],
  },
  'bac-calculator': {
    summary: 'Learn how drink size, ABV, body weight, sex, and time affect a BAC estimate.',
    purpose:
      'The BAC Calculator estimates blood alcohol concentration with a Widmark-style formula. It is for education only and must never be used to decide whether to drive.',
    enter: [
      'Enter drink volume, alcohol by volume, number of drinks, body weight, formula sex, and time since drinking began.',
      'Use actual ABV and pour size where possible, not guesses.',
      'Remember that mixed drinks can contain more alcohol than one standard drink.',
    ],
    example: [
      'For two 355 mL beers at 5%, the calculator estimates grams of alcohol first.',
      'It then applies a body-water factor and subtracts an average elimination amount for elapsed time.',
    ],
    read: [
      'The estimate can be wrong because absorption, food, medications, health, tolerance, and timing vary.',
      'A lower estimate does not mean safe or legal to drive.',
    ],
    mistakes: [
      'Do not use the result for driving, work, legal, or safety decisions.',
      'Do not enter the label serving size if your actual pour was larger.',
      'Do not assume alcohol leaves the body at the same rate for everyone.',
    ],
    next: [
      'Plan transportation before drinking.',
      'Use official public-health guidance for alcohol safety questions.',
    ],
  },
};

function buildDefaultGuideDetail(tool: (typeof healthTools)[number]): GuideDetail {
  return {
    summary: `Learn how to use the ${tool.name} with plain input notes, examples, answer meaning, and common mistakes.`,
    purpose: tool.description,
    enter: [
      'Enter the requested values exactly as the tool labels them.',
      'Use matching units and avoid rounded guesses when a precise value matters.',
      'Review the examples on the tool page before using the result in notes or planning.',
    ],
    example: [
      `Try the example "${tool.examples[0]?.expression ?? tool.name}" to see a complete calculation.`,
      `Compare the result with the formula line so you can see how the ${tool.name} reached the answer.`,
    ],
    read: [
      'Start with the displayed result, then use the supporting lines to understand the formula and assumptions.',
      extraSafetyNotes[tool.slug] ??
        'Use the result as an educational estimate and get qualified professional guidance for decisions with real consequences.',
    ],
    mistakes: [
      'Do not mix units.',
      'Do not copy the answer before checking the inputs.',
      'Do not treat an estimate as a professional decision.',
    ],
    next: tool.relatedSlugs.length > 0
      ? [`Try a related calculator next, especially ${tool.relatedSlugs[0].replaceAll('-', ' ')}.`]
      : ['Save or copy the answer only after checking the assumptions.'],
  };
}

function getGuideDetail(tool: (typeof healthTools)[number]) {
  return guideDetails[tool.slug] ?? buildDefaultGuideDetail(tool);
}

function formatExample(example: (typeof healthTools)[number]['examples'][number] | undefined) {
  if (!example) {
    return 'the first filled-out example';
  }

  return `${example.label}: ${example.expression}`;
}

function buildHealthMetaDescription(tool: (typeof healthTools)[number], summary: string) {
  const base = summary.replace(/\.$/, '');
  const description = `${base}. Includes input tips, examples, result checks, and safety notes for the ${tool.name}.`;
  return description.length > 160 ? `${description.slice(0, 156).trim()}...` : description;
}

export const healthBlogPosts: BlogPostDefinition[] = healthTools.map((tool) => {
  const detail = getGuideDetail(tool);

  return {
    slug: `how-to-use-${tool.slug}`,
    title: `How to use the ${tool.name}`,
    label: `${tool.name.replace(' Calculator', '')} guide`,
    summary: detail.summary,
  };
});

export const healthBlogGuides: HealthGuideDefinition[] = healthTools.map((tool) => {
  const detail = getGuideDetail(tool);
  const primaryExample = tool.examples[0];
  const primaryExampleText = formatExample(primaryExample);

  return {
    slug: `how-to-use-${tool.slug}`,
    toolSlug: tool.slug,
    label: `${tool.name.replace(' Calculator', '')} guide`,
    title: `How to use the ${tool.name}`,
    description: buildHealthMetaDescription(tool, detail.summary),
    path: `/blog/how-to-use-${tool.slug}/`,
    intro: `${detail.summary} Enter the inputs carefully, try the example, then read the limits before using or copying the number.`,
    quickStart: [
      `Open the ${tool.name}.`,
      detail.enter[0],
      `Use the first example, "${primaryExampleText}", if you want to see a filled-out calculation before entering your own values.`,
      'Calculate, read the formula line, then copy the result only after the units and assumptions look right.',
    ],
    sections: [
      {
        title: 'What this calculator is for',
        paragraphs: [
          detail.purpose,
          `Use it when you want to: ${tool.useCases.slice(0, 2).join(' ')}`,
        ],
      },
      {
        title: 'What to enter',
        paragraphs: [
          'Good answers start with clean inputs. Before calculating, check the labels, units, and dates so the tool is solving the same problem you actually have.',
        ],
        bullets: detail.enter,
      },
      {
        title: 'Example walkthrough',
        paragraphs: [
          primaryExample
            ? `Try the calculator example: ${primaryExampleText}. The example result is ${primaryExample.result}.`
            : 'Use one of the examples on the tool page to see a complete calculation before entering your own values.',
        ],
        bullets: detail.example,
      },
      {
        title: 'Formula and steps',
        paragraphs: [
          getFormulaAnswer(tool.slug),
          'Read the formula note when you need to understand where the number came from, especially before comparing results over time.',
        ],
      },
      {
        title: 'How to read the answer',
        paragraphs: [
          extraSafetyNotes[tool.slug] ??
            'Read the main estimate first, then read the note beside it. For health, pregnancy, nutrition, kidney, alcohol, or training decisions with real consequences, use qualified professional guidance.',
        ],
        bullets: detail.read,
      },
      {
        title: 'Common mistakes to avoid',
        paragraphs: [
          'Most bad results come from a small input mistake or from using a rough estimate for a decision it cannot safely answer.',
        ],
        bullets: detail.mistakes,
      },
      {
        title: 'What to try next',
        paragraphs: [
          'A related health tool can help check the same topic from another angle, but one number should not replace proper care.',
        ],
        bullets: detail.next,
      },
      {
        title: 'Sources and safety notes',
        paragraphs: [
          'This guide uses public-health, clinical, or peer-reviewed references where the calculator needs a specific formula or interpretation boundary.',
          'Source links are provided for transparency, but they do not turn the calculator into medical advice or a replacement for professional care.',
        ],
        links: getSourceLinks(tool.slug),
      },
    ],
    sidecarText: `Keep the ${tool.name} open beside this guide. Try the example first, then replace it with your own values and read the safety notes before copying the result.`,
  };
});

export function getHealthBlogGuide(slug: string) {
  return healthBlogGuides.find((guide) => guide.slug === slug);
}
