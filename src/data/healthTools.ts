import type { ToolDefinition, ToolExample, ToolFaq } from './tools';

interface HealthToolSpec {
  slug: string;
  name: string;
  summary: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  aliases?: string[];
  icon: string;
  formula: string;
  caution: string;
  useCases: string[];
  examples: ToolExample[];
  extraFaq?: ToolFaq[];
  relatedSlugs: string[];
}

function makeFaq(spec: HealthToolSpec): ToolFaq[] {
  const exampleUses = spec.useCases.slice(0, 2).join(' ');
  const isBmiCalculator = spec.slug === 'bmi-calculator';
  const isBodyFatCalculator = spec.slug === 'body-fat-calculator';
  const isArmyBodyFatCalculator = spec.slug === 'army-body-fat-calculator';
  const isBmrCalculator = spec.slug === 'bmr-calculator';
  const isLeanBodyMassCalculator = spec.slug === 'lean-body-mass-calculator';
  const isTargetHeartRateCalculator = spec.slug === 'target-heart-rate-calculator';
  const isBodySurfaceAreaCalculator = spec.slug === 'body-surface-area-calculator';
  const isBacCalculator = spec.slug === 'bac-calculator';
  const isCalorieCalculator = spec.slug === 'calorie-calculator';
  const isCaloriesBurnedCalculator = spec.slug === 'calories-burned-calculator';
  const isCarbohydrateCalculator = spec.slug === 'carbohydrate-calculator';
  const isFatIntakeCalculator = spec.slug === 'fat-intake-calculator';
  const isTdeeCalculator = spec.slug === 'tdee-calculator';
  const isGfrCalculator = spec.slug === 'gfr-calculator';
  const isPregnancyCalculator = spec.slug === 'pregnancy-calculator';
  const isPregnancyConceptionCalculator = spec.slug === 'pregnancy-conception-calculator';
  const isConceptionCalculator = spec.slug === 'conception-calculator';
  const isPregnancyWeightGainCalculator = spec.slug === 'pregnancy-weight-gain-calculator';
  const inputAnswer = isBmiCalculator
    ? 'Enter adult height and weight in the units shown. BMI uses weight compared with height squared, so a small unit mistake can move the category. This page is for adult BMI screening only; children and teens use age-and-sex percentiles instead.'
    : isBodyFatCalculator
      ? 'Enter formula sex, height, optional weight, neck, waist, and hip when the female equation is selected. The male equation uses waist minus neck with height. The female equation uses waist plus hip minus neck with height. Keep the tape level, snug, and consistent from one check to the next.'
    : isArmyBodyFatCalculator
      ? 'Enter sex, age, body weight in pounds, and abdomen circumference in inches. The current Army one-site method uses the abdomen measurement at the navel, not neck, hip, or height measurements. Use a non-stretch tape, keep it level, and do not pull it tight enough to dig into the skin.'
    : isBmrCalculator
      ? 'Enter formula sex, age in years, height in centimeters, and weight in kilograms. The formula sex setting chooses the +5 or -161 Mifflin-St Jeor adjustment; it is a calculator input, not a full description of your body, health, or nutrition needs.'
    : isLeanBodyMassCalculator
      ? 'Enter formula sex, height in centimeters, and weight in kilograms. The formula sex setting chooses the Boer equation constants. The calculator does not ask for body fat percentage, age, training status, or scan results.'
    : isTargetHeartRateCalculator
      ? 'Enter your age, choose the effort range, and add resting heart rate only if you want the heart-rate-reserve estimate. Age sets the rough maximum heart rate. The effort range turns that into beats per minute.'
    : isBodySurfaceAreaCalculator
      ? 'Enter height in centimeters and weight in kilograms. The calculator uses those two measured values for adult human body surface area formulas. It does not ask for age, sex, body fat, diagnosis, procedure type, burn percentage, or medication details.'
    : isBacCalculator
      ? 'Enter the formula sex setting, body weight in kilograms, number of drinks, drink size in milliliters, ABV percent, and hours since the first drink. Use the actual pour size and alcohol percentage when you know them. A strong mixed drink or large pour can count as more alcohol than one ordinary serving.'
    : isCalorieCalculator
      ? 'Enter the formula sex setting, age in years, height in centimeters, weight in kilograms, activity level, and planning goal. Formula sex chooses the +5 or -161 Mifflin-St Jeor adjustment. Activity level is a broad weekly average, so choose the closest normal week rather than one unusually hard or unusually quiet day.'
    : isCaloriesBurnedCalculator
      ? 'Choose the activity MET estimate, enter body weight in kilograms, and enter the workout duration in minutes. MET is a rough intensity value: a brisk walk is lower than running, and the same activity can still feel different depending on pace, hills, fitness, heat, and breaks.'
    : isCarbohydrateCalculator
      ? 'Enter the calorie target first, then enter the percent of those calories planned from carbohydrate. Type 50 for 50%, not 0.50. The calculator assumes carbohydrate has 4 calories per gram and uses only the calorie target and carb percent you provide.'
    : isFatIntakeCalculator
      ? 'Enter the calorie target first, then enter the percent of those calories planned from fat. Type 30 for 30%, not 0.30. The calculator assumes dietary fat has 9 calories per gram and uses the calorie target you provide.'
    : isTdeeCalculator
      ? 'Enter the formula sex setting, age, height in centimeters, weight in kilograms, and the activity level that best describes a normal week. The formula sex setting chooses the +5 or -161 Mifflin-St Jeor adjustment. The activity level multiplies BMR by a broad factor, so pick the average week rather than your best workout day.'
    : isGfrCalculator
      ? 'Enter age in years, sex used by the equation, and standardized serum creatinine in mg/dL from a lab result. Do not enter micromoles per liter, old lab values, cystatin C, urine albumin, or body weight in the creatinine box.'
    : isPregnancyCalculator
      ? 'Enter the first day of the last menstrual period, not the last day bleeding occurred. Cycle length means the usual number of days from one period start to the next; use 28 only if that is close for you. If the LMP is uncertain, cycles are irregular, bleeding may not have been a true period, or a clinician has already dated the pregnancy, use the clinician or ultrasound date instead.'
    : isPregnancyConceptionCalculator
      ? 'Enter the estimated due date you were given by a clinician, ultrasound report, or earlier due-date calculation. This calculator works backward from that date only. If the due date changed after ultrasound, IVF dating, or clinician review, use the updated date instead of an older calendar estimate.'
    : isConceptionCalculator
      ? 'Enter the first day of the last period, your usual cycle length from one period start to the next, and luteal phase length if you know it. If you do not know luteal phase length, keep the default and read the answer as a rough cycle estimate. Irregular cycles, recent hormonal birth control, postpartum changes, illness, stress, or uncertain period dates can make the window less reliable.'
    : isPregnancyWeightGainCalculator
      ? 'Enter pre-pregnancy height and weight, current weight, and the pregnancy week. This calculator uses singleton pregnancy guideline ranges based on pre-pregnancy BMI. If you are carrying twins or more, have a high-risk pregnancy, have fluid retention, or were given a personal target by your care team, use that clinical guidance instead of this general estimate.'
    : 'Enter the body, activity, date, or lab values exactly in the units shown on the page. Height, weight, age, sex, time, and activity level can change health estimates a lot, so treat each label like a rule instead of a suggestion. If you are unsure which option fits, choose the closest honest match and read the result as a rough estimate.';
  const readingAnswer = isBmiCalculator
    ? 'Read BMI as a quick adult screening number. It can miss important context such as pregnancy, high muscle mass, waist size, body composition, age, medical history, and ethnicity. Use it as a clue, not a final health answer.'
    : isBodyFatCalculator
      ? 'Read the percentage as a Navy-style tape-method estimate, then use fat mass and lean mass as context if you entered weight. Small changes can come from tape placement, posture, breathing, or tension, so this is better for consistent trend checks than one-time diagnosis.'
    : isArmyBodyFatCalculator
      ? 'Read the rounded percentage as an educational one-site tape estimate. The reference limit line uses the Army age-group table for context, but this website is not an official Army record, DA Form 5500/5501 entry, waiver, flagging decision, or medical assessment.'
    : isBmrCalculator
      ? 'Read BMR as an estimated resting-energy number in kcal per day. It is lower than total daily needs for most adults because it does not include walking, work, exercise, or daily movement. Use the sedentary and moderate TDEE lines as context before making calorie plans.'
    : isLeanBodyMassCalculator
      ? 'Read lean body mass as a Boer formula estimate of fat-free mass. It includes muscle, bone, organs, and water, so it is not muscle mass only. The estimated fat mass and lean percent are rough comparisons, not a scan or diagnosis.'
    : isTargetHeartRateCalculator
      ? 'Read the answer as a training range in beats per minute, not a perfect target you must hit. If the range feels too hard, you feel pain, or a clinician gave you a different limit, slow down and use the safer guidance.'
    : isBodySurfaceAreaCalculator
      ? 'Read BSA as an estimated body surface area in square meters. The Mosteller and Du Bois lines can differ slightly because they are different formulas. Use the number as clinical math context only, not as a medication dose, diagnosis, burn estimate, or treatment plan.'
    : isBacCalculator
      ? 'Read BAC as a rough educational estimate for the inputs you typed, not as a legal, medical, workplace, or driving decision. Real BAC can differ because food, drinking speed, medications, tolerance, health, body composition, and test timing all matter.'
    : isCalorieCalculator
      ? 'Read the answer as an estimated daily calorie target for the inputs and goal you selected. It is not a medical diet order, pregnancy plan, eating-disorder recovery target, sports-fueling prescription, or promise of weight change. Compare it with real-world trends and qualified guidance before making major nutrition changes.'
    : isCaloriesBurnedCalculator
      ? 'Read the answer as an exercise-energy estimate for the MET value, body weight, and duration you entered. It is not a lab measurement, wearable calibration, diet permission, injury advice, or exact energy-balance number. Real burn can shift with pace, terrain, form, fitness, weather, and rest breaks.'
    : isCarbohydrateCalculator
      ? 'Read the answer as total carbohydrate grams for the calorie target and percent you entered. It does not grade food quality, count fiber separately, set a diabetes plan, set a sports-fueling plan, or tell you how your blood sugar will respond.'
    : isFatIntakeCalculator
      ? 'Read the answer as total dietary fat grams for the calorie target and percent you entered. It does not judge food quality, split saturated versus unsaturated fat, set a medical nutrition plan, or tell you anything about body-fat percentage.'
    : isTdeeCalculator
      ? 'Read TDEE as estimated maintenance calories per day for the inputs and activity factor you chose. It is not a promised weight-change number, medical diet order, pregnancy plan, eating-disorder recovery plan, or exact metabolism measurement. Real-world trends can move the useful target up or down.'
    : isGfrCalculator
      ? 'Read eGFR as an adult kidney-filtration estimate in mL/min/1.73 m2. The range label is context only. Kidney disease, medication dosing, and next steps depend on repeat labs, urine albumin, symptoms, diagnosis, age, pregnancy status, body size, and clinician review.'
    : isPregnancyCalculator
      ? 'Read the due date as an estimated delivery date from calendar math, not a guarantee of when birth will happen. Gestational age is counted from LMP, so it is usually about two weeks more than conception age. The conception and trimester lines are planning references, and an early ultrasound or clinician review can update the official date.'
    : isPregnancyConceptionCalculator
      ? 'Read the center date as a backward estimate from the due date, not proof of the exact day conception happened. The possible window is more honest than a single day because ovulation, fertilization, sperm survival, ultrasound dating, and due-date assumptions can all shift the real timing.'
    : isConceptionCalculator
      ? 'Read the answer as an ovulation-based conception estimate, not proof of an exact day, intercourse date, or biological parent. The fertile window is more useful than the center date because sperm may survive for several days, the egg survives for about a day after ovulation, and ovulation can shift from the calendar estimate.'
    : isPregnancyWeightGainCalculator
      ? 'Read the total range as a prenatal-care reference, not a grade or diet rule. Healthy gain can be uneven by week, and your care team may care more about fetal growth, blood pressure, swelling, nausea, diabetes, or other medical details than the calculator line alone.'
    : 'Use the result as a learning number, not a final answer about your body or health. The supporting lines can show categories, ranges, calories, dates, or targets, but those numbers still need context like age, medical history, pregnancy status, training level, and advice from a qualified professional.';

  return [
    {
      question: `When should I use the ${spec.name}?`,
      answer: `Use it for simple educational checks, trend tracking, or planning tasks like these: ${exampleUses} It can help you understand a number, but it cannot explain your whole health situation.`,
    },
    {
      question: `What do the main ${spec.name} inputs mean?`,
      answer: inputAnswer,
    },
    {
      question: `What is the ${spec.name} doing with my inputs?`,
      answer: `In plain language: ${spec.formula} Read the result together with the notes on the page, because health and fitness numbers often need personal context.`,
    },
    {
      question: `How should I read the ${spec.name} result?`,
      answer: readingAnswer,
    },
    ...(spec.extraFaq ?? []),
    ...(isBodyFatCalculator
      ? [
          {
            question: 'What formula does this body fat calculator use?',
            answer:
              'It uses the common Navy-style circumference equations. Male estimates use waist minus neck with height. Female estimates use waist plus hip minus neck with height. The calculator converts centimeters to inches internally because the published equation constants are inch-based.',
          },
          {
            question: 'Where should I measure neck, waist, and hips?',
            answer:
              'Use the same tape sites every time. For the neck, measure below the larynx without including shoulder muscles. For the waist, keep the tape level and measure after a normal relaxed exhale. For hips, measure around the widest part. A different site can change the answer quickly.',
          },
          {
            question: 'Why is weight optional?',
            answer:
              'Weight is not part of the percentage equation, but it lets the calculator estimate fat mass and lean mass. For example, 29.74% at 68 kg is about 20.22 kg estimated fat mass and 47.78 kg estimated lean mass.',
          },
        ]
      : []),
    ...(isArmyBodyFatCalculator
      ? [
          {
            question: 'Is this the current Army one-site tape formula?',
            answer:
              'Yes. This page uses the 2023 one-site equation shown on current DA Form 5500 and DA Form 5501: males use weight in pounds and abdomen circumference in inches; females use weight in pounds and abdomen circumference in inches. It does not use the older neck, hip, and height tape equation.',
          },
          {
            question: 'Why does the Army calculator ask for age if age is not in the formula?',
            answer:
              'Age does not change the one-site body-fat equation. It changes the reference limit used for comparison: 17-20, 21-27, 28-39, or 40 and older. Treat that comparison as a reference note, not an official compliance decision.',
          },
          {
            question: 'Where should I measure the abdomen?',
            answer:
              'Use the abdomen at the navel level. The official worksheets tell measurers to take the abdomen measurement three times, round down to the nearest 0.50 inch, and average the readings. This page gives a quick estimate from the number you enter.',
          },
        ]
      : []),
    ...(isBmiCalculator
      ? [
          {
            question: 'Can children, teens, pregnant people, or athletes use adult BMI the same way?',
            answer:
              'No. Children and teens need BMI percentiles, pregnancy changes body weight for a different reason, and athletes can have more muscle mass than BMI expects. In those cases, use BMI only as a rough note and ask a qualified professional for real guidance.',
          },
        ]
      : []),
    {
      question: 'Can I use this as medical advice?',
      answer: `${spec.caution} Use the calculator as a learning tool, then ask a qualified professional about decisions that affect care, pregnancy, medication, nutrition, or safety.`,
    },
    {
      question: 'What should I double-check before trusting the result?',
      answer:
        'Check the units, date, and personal details before reading the answer. For example, pounds and kilograms, inches and centimeters, or a wrong activity level can change the result quickly. If the number feels surprising, rerun it slowly and compare it with the examples.',
    },
    {
      question: 'Does the site save my health inputs?',
      answer:
        'No. The calculator runs in your browser tab. Recent answers stay only on the page while you use it, and they are not sent to a server.',
    },
  ];
}

function makeHealthTool(spec: HealthToolSpec): ToolDefinition {
  return {
    slug: spec.slug,
    name: spec.name,
    category: 'health-fitness',
    summary: spec.summary,
    description: spec.description,
    icon: spec.icon,
    seoTitle: spec.seoTitle ?? `${spec.name} | Free Online Health Calculator`,
    seoDescription: spec.seoDescription ?? spec.description,
    ...(spec.aliases ? { aliases: spec.aliases } : {}),
    useCases: spec.useCases,
    examples: spec.examples,
    faq: makeFaq(spec),
    relatedSlugs: spec.relatedSlugs,
  };
}

const estimateCaution =
  'No. This page provides an educational estimate only. Talk with a qualified health professional before making medical, pregnancy, nutrition, medication, or safety decisions.';

export const healthTools: ToolDefinition[] = [
  makeHealthTool({
    slug: 'bmi-calculator',
    name: 'BMI Calculator',
    summary: 'Estimate adult body mass index and healthy BMI weight range.',
    description:
      'Use this free BMI calculator to estimate adult body mass index, weight category, and a healthy BMI reference range from height and weight.',
    icon: 'calculator-bmi',
    formula: 'BMI is calculated as weight in kilograms divided by height in meters squared, then compared with adult BMI screening categories.',
    caution:
      'No. BMI is an educational adult screening estimate, not medical advice and not a diagnosis. Talk with a qualified health professional before making medical, pregnancy, nutrition, medication, or safety decisions.',
    useCases: [
      'Estimate adult BMI from metric height and weight.',
      'Compare BMI with common adult screening categories.',
      'Find the weight range that matches BMI 18.5 to 24.9 for a height.',
      'Use a consistent estimate while tracking health or fitness changes.',
    ],
    examples: [
      { label: 'Healthy range example', expression: '170 cm, 70 kg', result: 'BMI about 24.2' },
      { label: 'Taller adult', expression: '183 cm, 82 kg', result: 'BMI about 24.5' },
      { label: 'Smaller adult', expression: '160 cm, 52 kg', result: 'BMI about 20.3' },
    ],
    relatedSlugs: ['healthy-weight-calculator', 'body-fat-calculator', 'ideal-weight-calculator'],
  }),
  makeHealthTool({
    slug: 'underweight-bmi-calculator',
    name: 'Underweight BMI Calculator',
    summary: 'Check adult BMI against the underweight screening threshold with careful safety notes.',
    description:
      'Use this free underweight BMI calculator to compare adult BMI with the BMI 18.5 screening threshold and healthy BMI reference range.',
    icon: 'calculator-underweight-bmi',
    formula:
      'BMI is weight in kilograms divided by height in meters squared. The calculator compares the result with the adult underweight threshold of BMI less than 18.5.',
    caution:
      'BMI cannot diagnose anorexia, malnutrition, or any eating disorder. If eating, weight, exercise, or body image feels hard to control, talk with a qualified health professional.',
    useCases: [
      'Check whether an adult BMI is below 18.5.',
      'See how far a weight is from the BMI 18.5 reference threshold.',
      'Read why BMI alone cannot diagnose an eating disorder.',
      'Use a safer alternative to harmful anorexic-BMI style pages.',
    ],
    examples: [
      { label: 'Underweight screen', expression: '170 cm, 50 kg', result: 'BMI about 17.3' },
      { label: 'Near threshold', expression: '160 cm, 47 kg', result: 'BMI about 18.4' },
      { label: 'Taller adult', expression: '183 cm, 62 kg', result: 'BMI about 18.5' },
    ],
    relatedSlugs: ['bmi-calculator', 'healthy-weight-calculator', 'ideal-weight-calculator'],
  }),
  makeHealthTool({
    slug: 'overweight-calculator',
    name: 'Overweight BMI Calculator',
    summary: 'Check adult BMI against overweight and obesity screening categories.',
    description:
      'Use this free overweight BMI calculator to compare adult BMI with the 25 and 30 BMI screening thresholds.',
    icon: 'calculator-overweight',
    formula:
      'BMI is weight in kilograms divided by height in meters squared. Adult BMI 25 to less than 30 is the overweight category, and 30 or greater is the obesity category.',
    caution:
      'BMI is a screening tool, not a complete health judgment. Body composition, waist size, medical history, medications, and clinician review can change the real health picture.',
    useCases: [
      'Check whether an adult BMI is in the overweight screening category.',
      'See how far a weight is above the BMI 24.9 reference boundary.',
      'Compare the result with the BMI 30 obesity screening threshold.',
      'Use people-first, non-shaming language around BMI categories.',
    ],
    examples: [
      { label: 'Overweight screen', expression: '170 cm, 78 kg', result: 'BMI about 27.0' },
      { label: 'Taller adult', expression: '183 cm, 92 kg', result: 'BMI about 27.5' },
      { label: 'Smaller adult', expression: '160 cm, 70 kg', result: 'BMI about 27.3' },
    ],
    relatedSlugs: ['bmi-calculator', 'healthy-weight-calculator', 'body-fat-calculator'],
  }),
  makeHealthTool({
    slug: 'nutrition-points-calculator',
    name: 'Nutrition Points Calculator',
    summary: 'Create a transparent food-label score from calories, saturated fat, added sugar, sodium, fiber, and protein.',
    description:
      'Use this free nutrition points calculator to compare foods with an original transparent score based on common Nutrition Facts label fields.',
    icon: 'calculator-nutrition-points',
    formula:
      'The calculator adds moderation points from calories, saturated fat, added sugar, and sodium, then subtracts support credits from fiber and protein.',
    caution:
      'This is not Weight Watchers Points, not affiliated with WW, and not medical nutrition advice. It is a transparent educational score for rough comparisons.',
    useCases: [
      'Compare two packaged foods using the same label-based score.',
      'See how added sugar, saturated fat, sodium, fiber, and protein change a food score.',
      'Use a non-proprietary alternative to branded points calculators.',
      'Practice reading Nutrition Facts labels more carefully.',
    ],
    examples: [
      { label: 'Snack label', expression: '240 kcal, 2 g sat fat, 8 g added sugar', result: 'Moderate points' },
      { label: 'Greek yogurt', expression: '150 kcal, 15 g protein', result: 'Lower points' },
      { label: 'Sweet drink', expression: '180 kcal, 38 g added sugar', result: 'Higher points' },
    ],
    relatedSlugs: ['calorie-calculator', 'macro-calculator', 'protein-calculator'],
  }),
  makeHealthTool({
    slug: 'calorie-calculator',
    name: 'Calorie Calculator',
    summary: 'Estimate daily calories from BMR, activity level, and goal.',
    description:
      'Use this free calorie calculator to estimate maintenance calories and gentle loss or gain targets using BMR and activity level.',
    seoTitle: 'Calorie Calculator | BMR, Activity & Goal Estimate',
    seoDescription:
      'Estimate maintenance calories and gentle loss or gain targets from age, formula sex, height, weight, activity level, and Mifflin-St Jeor BMR.',
    aliases: [
      'daily calorie calculator',
      'maintenance calorie calculator',
      'calorie needs calculator',
      'bmr calorie calculator',
      'weight loss calorie calculator',
    ],
    icon: 'calculator-calorie',
    formula:
      'BMR = 10 x weight kg + 6.25 x height cm - 5 x age + formula-sex adjustment (+5 or -161). Maintenance calories = BMR x activity factor. The selected goal then applies a planning adjustment: maintain uses 0, gentle loss subtracts 500 kcal/day, and gentle gain adds 300 kcal/day.',
    caution:
      'This is an educational calorie estimate, not a medical nutrition plan, pregnancy meal plan, eating-disorder recovery target, sports-fueling prescription, or guarantee of weight change.',
    useCases: [
      'Estimate daily maintenance calories.',
      'Compare sedentary, light, moderate, and active calorie needs.',
      'Create a gentle calorie target for weight loss or gain planning.',
      'Cross-check TDEE and macro calculations.',
    ],
    examples: [
      {
        label: 'Moderate maintenance',
        expression: 'Female formula, 32, 165 cm, 68 kg, moderate activity',
        result: 'BMR 1,390 kcal/day; maintenance about 2,155 kcal/day',
      },
      {
        label: 'Light activity loss',
        expression: 'Male formula, 41, 178 cm, 86 kg, light activity',
        result: 'Maintenance about 2,437 kcal/day; gentle loss target about 1,937 kcal/day',
      },
      {
        label: 'Very active gain',
        expression: 'Female formula, 27, 172 cm, 63 kg, very active',
        result: 'Maintenance about 2,431 kcal/day; gentle gain target about 2,731 kcal/day',
      },
    ],
    extraFaq: [
      {
        question: 'What activity factors does this calorie calculator use?',
        answer:
          'It uses common TDEE activity factors: sedentary 1.2x, light 1.375x, moderate 1.55x, very active 1.725x, and extra active 1.9x. The factor is multiplied by estimated BMR before any selected goal adjustment is applied.',
      },
      {
        question: 'Is the gentle loss target safe for everyone?',
        answer:
          'No. The gentle loss option subtracts 500 kcal/day as a rough planning estimate. It is not appropriate for everyone, especially during pregnancy, eating-disorder recovery, medical treatment, or intense training without qualified guidance.',
      },
      {
        question: 'Why can my real maintenance calories differ from this estimate?',
        answer:
          'Real maintenance calories can differ because of tracking accuracy, body composition, medications, illness, sleep, stress, training load, digestion, and normal metabolism differences. Treat the result as a starting estimate, then compare it with real-world trends.',
      },
    ],
    relatedSlugs: ['tdee-calculator', 'bmr-calculator', 'macro-calculator'],
  }),
  makeHealthTool({
    slug: 'body-fat-calculator',
    name: 'Body Fat Calculator',
    summary: 'Estimate body fat percentage with a Navy-style tape method.',
    description:
      'Use this free body fat calculator to estimate body fat percentage, fat mass, and lean mass from height, weight, neck, waist, and hip measurements.',
    seoTitle: 'Body Fat Calculator | Navy-Style Tape Estimate',
    seoDescription:
      'Estimate body fat percentage, fat mass, and lean mass from height, weight, neck, waist, and hip measurements with a browser-side tape-method calculator.',
    icon: 'calculator-body-fat',
    formula:
      'The calculator uses the common Navy-style circumference method: male estimate = 86.01 x log10(waist - neck) - 70.041 x log10(height) + 36.76; female estimate = 163.205 x log10(waist + hip - neck) - 97.684 x log10(height) - 78.387, with measurements converted to inches.',
    caution: estimateCaution,
    useCases: [
      'Estimate body fat percentage without a scale that measures body composition.',
      'Track tape-measure changes over time.',
      'Compare estimated fat mass and lean mass.',
      'Use alongside BMI for a broader screening picture.',
    ],
    examples: [
      { label: 'Female tape example', expression: '165 cm, 68 kg, neck 34, waist 78, hips 98', result: 'About 29.74% body fat' },
      { label: 'Male tape example', expression: '180 cm, 84 kg, neck 40, waist 88', result: 'About 16.94% body fat' },
      { label: 'Trend check', expression: '170 cm, 72 kg, neck 35, waist 82, hips 101', result: 'About 31.41% body fat' },
    ],
    relatedSlugs: ['army-body-fat-calculator', 'lean-body-mass-calculator', 'bmi-calculator'],
  }),
  makeHealthTool({
    slug: 'bmr-calculator',
    name: 'BMR Calculator',
    summary: 'Estimate resting calories with the Mifflin-St Jeor equation.',
    description:
      'Use this free BMR calculator to estimate resting daily energy needs from age, formula sex, height, and weight, then compare BMR with simple TDEE context.',
    seoTitle: 'BMR Calculator | Mifflin-St Jeor Resting Calories',
    seoDescription:
      'Estimate BMR in kcal per day from age, formula sex, height, and weight. Includes Mifflin-St Jeor formula notes plus sedentary and moderate TDEE context.',
    icon: 'calculator-bmr',
    formula:
      'BMR uses the Mifflin-St Jeor equation: 10 x weight kg + 6.25 x height cm - 5 x age + 5 for the male formula setting, or -161 for the female formula setting.',
    caution:
      'BMR is an educational resting-energy estimate, not a calorie prescription, medical nutrition plan, pregnancy guideline, or eating-disorder advice. Talk with a qualified health professional before making important nutrition decisions.',
    useCases: [
      'Estimate resting energy needs before activity is added.',
      'Separate BMR from TDEE and calorie targets.',
      'Understand how height, weight, age, and formula sex affect the estimate.',
      'Use BMR as the base input for TDEE and calorie planning tools.',
    ],
    examples: [
      { label: 'Male 1,763 kcal', expression: '35-year-old male, 178 cm, 82 kg', result: 'About 1,763 kcal/day BMR' },
      { label: 'Female 1,329 kcal', expression: '29-year-old female, 164 cm, 61 kg', result: 'About 1,329 kcal/day BMR' },
      { label: 'Moderate TDEE context', expression: '1,763 kcal BMR x 1.55', result: 'About 2,732 kcal/day TDEE' },
    ],
    extraFaq: [
      {
        question: 'Is BMR the same as TDEE?',
        answer:
          'No. BMR estimates resting energy before activity is added. TDEE estimates total daily energy expenditure after an activity factor is applied. For example, a 1,763 kcal/day BMR becomes about 2,115 kcal/day with the sedentary factor and about 2,732 kcal/day with the moderate factor.',
      },
      {
        question: 'Should I eat exactly my BMR?',
        answer:
          'Usually no. BMR is a resting-energy estimate, not a meal plan. Most adults burn more than BMR across a full day because movement, work, training, and daily tasks add energy use.',
      },
      {
        question: 'Why does the formula sex setting change the BMR result?',
        answer:
          'The Mifflin-St Jeor equation uses one adjustment for the male formula setting and another for the female formula setting. That is a formula choice, not a complete judgment about body composition, hormones, health history, or personal nutrition needs.',
      },
    ],
    relatedSlugs: ['tdee-calculator', 'calorie-calculator', 'macro-calculator'],
  }),
  makeHealthTool({
    slug: 'ideal-weight-calculator',
    name: 'Ideal Weight Calculator',
    summary: 'Estimate Devine ideal body weight and compare it with the adult healthy BMI range.',
    description:
      'Use this free ideal weight calculator to estimate a Devine formula reference weight from height and formula sex, then compare it with the adult healthy BMI range.',
    seoTitle: 'Ideal Weight Calculator | Devine Formula & BMI Range',
    seoDescription:
      'Estimate Devine ideal body weight from height and formula sex, then compare the result with an adult healthy BMI range.',
    icon: 'calculator-ideal-weight',
    formula:
      'The Devine estimate starts at 50 kg for the male formula or 45.5 kg for the female formula at 5 feet, then adds 2.3 kg for each inch above 5 feet. This calculator does not subtract below the 5-foot base, and it shows the adult BMI 18.5 to 24.9 range separately.',
    caution:
      'This is a height-based reference formula, not a diagnosis, goal weight, medication-dose rule, sports-nutrition plan, pregnancy guide, child growth chart, or personal health target.',
    useCases: [
      'Estimate a classic Devine formula reference weight.',
      'Compare one formula result with the adult healthy BMI range.',
      'See how height above 5 feet changes the formula output.',
      'Avoid treating the word ideal as a personal health command.',
    ],
    examples: [
      { label: 'Male 180 cm', expression: '50 + 2.3 x 10.866 in over 5 ft', result: '74.99 kg Devine; BMI range 59.94-80.68 kg' },
      { label: 'Female 165 cm', expression: '45.5 + 2.3 x 4.961 in over 5 ft', result: '56.91 kg Devine; BMI range 50.37-67.79 kg' },
      { label: 'Female 172 cm', expression: '45.5 + 2.3 x 7.717 in over 5 ft', result: '63.25 kg Devine; BMI range 54.73-73.66 kg' },
      { label: 'At 5 ft tall', expression: 'No inches above 5 ft', result: '50 kg male base or 45.5 kg female base' },
    ],
    extraFaq: [
      {
        question: 'Is Devine ideal body weight the same as a healthy weight?',
        answer:
          'No. Devine gives one historical formula estimate from height and formula sex. The healthy BMI range is a wider adult screening range from height squared. Neither one can see body composition, frame size, pregnancy, age, training history, or medical context.',
      },
      {
        question: 'Why does the calculator show a BMI range too?',
        answer:
          'A single Devine number can look more exact than it really is. The adult BMI 18.5 to 24.9 range gives a broader comparison for the same height, so you can see that one formula number is not the only possible reference point.',
      },
      {
        question: 'What happens if height is 5 feet or shorter?',
        answer:
          'This calculator keeps the Devine inches-over-5-feet term at zero. That means the male formula stays at 50 kg and the female formula stays at 45.5 kg at or below 5 feet. Use that as a formula boundary, not as advice for children, very short adults, or medical dosing.',
      },
    ],
    relatedSlugs: ['healthy-weight-calculator', 'bmi-calculator', 'body-fat-calculator'],
  }),
  makeHealthTool({
    slug: 'pace-calculator',
    name: 'Pace Calculator',
    summary: 'Calculate running, walking, or cycling pace and speed from time and distance.',
    description:
      'Use this free pace calculator to turn elapsed time and distance into pace per kilometer or mile, speed per hour, and workout or race comparisons.',
    seoDescription:
      'Calculate pace from distance and time. Get pace per kilometer or mile, speed per hour, examples, formula notes, and common timing mistakes.',
    icon: 'calculator-pace',
    formula:
      'Pace = total elapsed seconds divided by distance. Speed = distance divided by total time in hours. The pace display rounds to the nearest second per selected distance unit.',
    caution:
      'This is a fitness planning calculator, not medical advice. Use total elapsed time or moving time consistently, and remember that hills, heat, terrain, stops, GPS error, and health limits can change effort.',
    useCases: [
      'Find pace per kilometer after a run or walk.',
      'Find pace per mile for race planning.',
      'Convert a workout time into speed per hour.',
      'Compare training sessions only when the distance unit and time type match.',
    ],
    examples: [
      { label: '5K run', expression: '5 km in 25:00', result: '5:00 per km; 12.00 km/h' },
      { label: '10K run', expression: '10 km in 55:30', result: '5:33 per km; 10.81 km/h' },
      { label: 'Three miles', expression: '3 mi in 30:00', result: '10:00 per mile; 6.00 mi/h' },
      { label: 'Marathon target', expression: '42.195 km in 4:00:00', result: '5:41 per km; 10.55 km/h' },
    ],
    extraFaq: [
      {
        question: 'What is the difference between pace and speed?',
        answer:
          'Pace is time per distance, such as 5:00 per kilometer, so a lower pace is faster. Speed is distance per hour, such as 12.00 km/h, so a higher speed is faster.',
      },
      {
        question: 'Should I enter moving time or total elapsed time?',
        answer:
          'Use total elapsed time for races, official comparisons, and anything where stops count. Use moving time only when you intentionally want to remove pauses, and do not compare it with elapsed-time results.',
      },
      {
        question: 'Why can pace look slightly rounded?',
        answer:
          'The calculator divides total seconds by distance, then rounds the displayed pace to the nearest second per mile or kilometer. Speed keeps more decimal detail so the two outputs can look slightly different after rounding.',
      },
    ],
    relatedSlugs: ['calories-burned-calculator', 'target-heart-rate-calculator', 'one-rep-max-calculator'],
  }),
  makeHealthTool({
    slug: 'army-body-fat-calculator',
    name: 'Army Body Fat Calculator',
    summary: 'Estimate Army one-site tape body fat from weight and abdomen circumference.',
    description:
      'Use this free Army body fat calculator for an educational one-site tape estimate from sex, age, body weight, and abdomen circumference.',
    seoDescription:
      'Estimate Army one-site tape body fat from weight and abdomen circumference. Includes age-group reference limits and official-use cautions.',
    icon: 'calculator-army-body-fat',
    formula:
      'Male Army one-site estimate = -26.97 - (0.12 x weight in lb) + (1.99 x abdomen in in). Female estimate = -9.15 - (0.015 x weight in lb) + (1.27 x abdomen in in). The result is rounded to the nearest whole percent and compared with the age-group reference limit.',
    caution:
      'This is not an official Army determination, DA Form 5500/5501 entry, record, waiver, flagging decision, or pass/fail result. Use official policy and trained personnel for official assessments.',
    useCases: [
      'Estimate the current Army one-site tape body fat percentage.',
      'Compare the rounded estimate with the age-group reference limit.',
      'Practice how weight and abdomen circumference move the estimate.',
      'Avoid treating a quick web estimate as an official military decision.',
    ],
    examples: [
      { label: 'Male 210/35', expression: 'Age 25, 210 lb, 35 in abdomen', result: '17.48%, rounded to 17%' },
      { label: 'Female 165/30', expression: 'Age 25, 165 lb, 30 in abdomen', result: '26.475%, rounded to 26%' },
      { label: 'Male 190/36', expression: 'Age 29, 190 lb, 36 in abdomen', result: '22.87%, rounded to 23%' },
      { label: 'Reference check', expression: 'Male age 29 reference limit', result: '24% reference limit' },
    ],
    relatedSlugs: ['body-fat-calculator', 'lean-body-mass-calculator', 'bmi-calculator'],
  }),
  makeHealthTool({
    slug: 'lean-body-mass-calculator',
    name: 'Lean Body Mass Calculator',
    summary: 'Estimate Boer lean body mass from height, weight, and formula sex.',
    description:
      'Use this free lean body mass calculator to estimate fat-free mass from height, weight, and formula sex using the Boer equation, with implied fat mass and lean percent for context.',
    seoTitle: 'Lean Body Mass Calculator | Boer Formula',
    seoDescription:
      'Estimate lean body mass with the Boer formula from height, weight, and formula sex. See kg examples, lean percent, and key limits.',
    icon: 'calculator-lean-mass',
    formula: 'The calculator uses Boer lean body mass equations. Male LBM = 0.407 x weight kg + 0.267 x height cm - 19.2. Female LBM = 0.252 x weight kg + 0.473 x height cm - 48.3.',
    caution:
      'This is a formula estimate, not a DEXA scan, body-fat test, muscle-mass scan, protein prescription, TDEE prescription, clinical lean body weight order, pediatric formula, or medication-dosing rule.',
    useCases: [
      'Estimate lean body mass for fitness context.',
      'Compare lean mass, implied fat mass, and lean percent from the same inputs.',
      'Use a formula estimate when body fat percentage is unknown.',
      'Keep protein, TDEE, and clinical decisions separate from the simple formula output.',
    ],
    examples: [
      { label: 'Male 180/82', expression: '180 cm, 82 kg', result: '62.23 kg LBM, 75.9% lean' },
      { label: 'Female 165/62', expression: '165 cm, 62 kg', result: '45.37 kg LBM, 73.18% lean' },
      { label: 'Female 172/70', expression: '172 cm, 70 kg', result: '50.70 kg LBM, 72.42% lean' },
    ],
    extraFaq: [
      {
        question: 'Does this calculator use body fat percentage?',
        answer:
          'No. This page estimates lean body mass from height, weight, and formula sex. If you already know body fat percentage, lean body mass can also be estimated as body weight times one minus body fat percentage.',
      },
      {
        question: 'Is lean body mass the same as muscle mass?',
        answer:
          'No. Lean body mass includes muscle, bone, organs, water, and other fat-free tissue. It is broader than muscle mass, so do not read this as a muscle-only score.',
      },
      {
        question: 'Can I use this for protein or TDEE planning?',
        answer:
          'You can use the number as rough context, but it is not a protein prescription, fat-loss plan, bodybuilding target, or TDEE rule. Use dedicated nutrition tools and professional guidance when the decision matters.',
      },
      {
        question: 'Is this the same as clinical lean body weight?',
        answer:
          'No. Clinical calculators may use specific dosing rules, pediatric formulas, adjusted body weight, or institution guidance. This page is an educational Boer formula estimate only.',
      },
    ],
    relatedSlugs: ['body-fat-calculator', 'bmr-calculator', 'protein-calculator', 'tdee-calculator'],
  }),
  makeHealthTool({
    slug: 'healthy-weight-calculator',
    name: 'Healthy Weight Calculator',
    summary: 'Find the adult BMI 18.5 to 24.9 weight range for a height.',
    description:
      'Use this free healthy weight calculator to find the adult BMI 18.5 to 24.9 weight range for a height, plus an optional current BMI comparison.',
    icon: 'calculator-healthy-weight',
    formula: 'The calculator converts height from centimeters to meters, squares it, then multiplies by BMI 18.5 for the lower adult screening range and BMI 24.9 for the upper adult screening range. If current weight is entered, BMI = weight in kg divided by height in meters squared.',
    caution:
      'This is an adult BMI screening reference, not a medical target, diagnosis, child or teen growth chart, pregnancy range, body-fat test, BMR estimate, or ideal-weight prescription.',
    useCases: [
      'Find a height-based adult BMI 18.5 to 24.9 reference range.',
      'Check an optional current BMI number and category.',
      'Compare this screening range with ideal weight, body fat, and BMR tools without mixing them up.',
      'Keep pediatric, pregnancy, athlete, and medical context outside the simple BMI range.',
    ],
    examples: [
      { label: '170 cm', expression: 'BMI 18.5-24.9', result: '53.47-71.96 kg' },
      { label: '160 cm', expression: 'BMI 18.5-24.9', result: '47.36-63.74 kg' },
      { label: '183 cm', expression: 'BMI 18.5-24.9', result: '61.95-83.39 kg' },
    ],
    extraFaq: [
      {
        question: 'Is the healthy weight range based on age?',
        answer:
          'No. This page uses the adult BMI 18.5 to 24.9 range for the height you enter. It does not use age-based child or teen BMI percentiles.',
      },
      {
        question: 'Why is this different from an ideal weight calculator?',
        answer:
          'The Healthy Weight Calculator gives a BMI screening range. An ideal weight calculator usually uses a formula such as Devine and returns a single reference weight. They answer different questions.',
      },
      {
        question: 'Does this calculator estimate body fat or BMR?',
        answer:
          'No. BMI uses only height and weight. It does not estimate body fat percentage, lean mass, resting calories, metabolism, or fitness.',
      },
      {
        question: 'Can I use this for children, teens, or pregnancy?',
        answer:
          'No. Children and teens need age- and sex-specific growth-chart percentiles, and pregnancy weight guidance uses separate ranges. This page is only a simple adult BMI reference.',
      },
    ],
    relatedSlugs: ['bmi-calculator', 'ideal-weight-calculator', 'body-fat-calculator'],
  }),
  makeHealthTool({
    slug: 'calories-burned-calculator',
    name: 'Calories Burned Calculator',
    summary: 'Estimate exercise calories from MET, body weight, and duration.',
    description:
      'Use this free calories burned calculator to estimate exercise energy from activity intensity, body weight, and time.',
    seoTitle: 'Calories Burned Calculator | MET Workout Estimate',
    seoDescription:
      'Estimate workout calories from MET intensity, body weight, and duration for walking, cycling, strength training, jogging, running, or swimming.',
    aliases: [
      'exercise calorie calculator',
      'workout calorie calculator',
      'MET calorie calculator',
      'activity calorie calculator',
      'calories burned walking calculator',
    ],
    icon: 'calculator-calories-burned',
    formula:
      'Calories burned = MET x 3.5 x body weight in kg / 200 x duration in minutes. MET is an activity-intensity estimate, so the result changes when the selected activity, body weight, or session time changes.',
    caution:
      'This is an educational exercise-energy estimate, not a lab measurement, medical exercise prescription, injury guidance, wearable calibration, or exact calorie-balance plan.',
    useCases: [
      'Estimate calories burned during common activities.',
      'Compare walking, running, cycling, swimming, and strength sessions.',
      'See calories per hour from a workout estimate.',
      'Use activity estimates without treating them as exact energy balance.',
    ],
    examples: [
      { label: 'Brisk walk', expression: '3.8 MET, 70 kg, 45 min', result: 'About 209 kcal' },
      { label: 'Running', expression: '9.8 MET, 80 kg, 30 min', result: 'About 412 kcal' },
      { label: 'Strength', expression: '5 MET, 72 kg, 50 min', result: 'About 315 kcal' },
    ],
    extraFaq: [
      {
        question: 'What MET values are available in this calories burned calculator?',
        answer:
          'The built-in choices include walking briskly at 3.8 MET, easy cycling at 4 MET, strength training at 5 MET, jogging at 7 MET, swimming laps at 8 MET, and running at 9.8 MET. Pick the closest honest intensity for the session.',
      },
      {
        question: 'Why can this estimate differ from my watch or treadmill?',
        answer:
          'Wearables, treadmills, and MET tables all estimate in different ways. Heart rate, pace, incline, stops, body composition, efficiency, and device calibration can move the number, so compare trends instead of treating one estimate as exact.',
      },
      {
        question: 'Should I subtract exercise calories from my food target?',
        answer:
          'Be careful. Exercise calories are rough and can be easy to over-count. Use the number as context for activity planning, not as automatic permission to change a nutrition target, especially with medical conditions, pregnancy, or eating-disorder history.',
      },
    ],
    relatedSlugs: ['pace-calculator', 'calorie-calculator', 'target-heart-rate-calculator'],
  }),
  makeHealthTool({
    slug: 'one-rep-max-calculator',
    name: 'One Rep Max Calculator',
    summary: 'Estimate one-rep max from weight lifted and reps completed.',
    description:
      'Use this free one rep max calculator to estimate 1RM with Epley and Brzycki formulas for strength training.',
    icon: 'calculator-one-rep-max',
    formula: 'The main estimate uses Epley: one-rep max = weight x (1 + reps / 30). Brzycki is shown as a comparison.',
    caution:
      'This is training math, not a safety guarantee. Do not attempt heavy max lifts without appropriate technique, equipment, and supervision.',
    useCases: [
      'Estimate a one-rep max without testing a true max.',
      'Compare Epley and Brzycki estimates.',
      'Plan training percentages from a recent rep set.',
      'Track strength changes over time.',
    ],
    examples: [
      { label: 'Bench example', expression: '100 kg x 5', result: 'Estimated 1RM about 117 kg' },
      { label: 'Squat example', expression: '140 kg x 3', result: 'Estimated 1RM about 154 kg' },
      { label: 'Volume set', expression: '60 kg x 8', result: 'Estimated 1RM about 76 kg' },
    ],
    relatedSlugs: ['calories-burned-calculator', 'target-heart-rate-calculator', 'protein-calculator'],
  }),
  makeHealthTool({
    slug: 'target-heart-rate-calculator',
    name: 'Target Heart Rate Calculator',
    summary: 'Estimate exercise heart-rate zones in beats per minute.',
    description:
      'Estimate moderate, vigorous, or general exercise heart-rate zones from age, effort range, and optional resting pulse.',
    seoDescription:
      'Estimate target heart rate zones by age, compare 50-70% and 70-85% effort, and add resting pulse for heart-rate reserve.',
    icon: 'calculator-target-heart',
    formula:
      'The calculator estimates maximum heart rate as 220 minus age, multiplies that number by the selected intensity range, and also shows heart-rate reserve when resting pulse is entered.',
    caution:
      'This is an exercise-intensity estimate, not medical advice. Ask a clinician what heart-rate limit to use if you have a heart condition, take medication that affects pulse, are pregnant, or feel chest pain, dizziness, or unusual shortness of breath.',
    useCases: [
      'Estimate moderate-intensity heart-rate range.',
      'Estimate vigorous-intensity heart-rate range.',
      'Compare simple max-heart-rate and heart-rate-reserve methods.',
      'Check whether a workout feels close to the intended effort.',
    ],
    examples: [
      { label: 'Age 35', expression: '50-85% zone', result: '93-157 bpm from an estimated 185 bpm max' },
      { label: 'Age 50', expression: 'Moderate 50-70%', result: '85-119 bpm from an estimated 170 bpm max' },
      { label: 'Resting HR included', expression: 'Age 35, resting 65, 50-85%', result: '125-167 bpm heart-rate reserve range' },
    ],
    extraFaq: [
      {
        question: 'What does 50-70% mean for target heart rate?',
        answer:
          'It is the common moderate-intensity range. For a 35-year-old, the simple max estimate is 185 bpm, so 50-70% is about 93-130 bpm.',
      },
      {
        question: 'What does 70-85% mean for target heart rate?',
        answer:
          'It is the common vigorous-intensity range. For a 35-year-old, the simple estimate is about 130-157 bpm, but you should still listen to breathing, comfort, heat, and medical limits.',
      },
      {
        question: 'Why does resting heart rate change the result?',
        answer:
          'Resting heart rate lets the calculator show a heart-rate-reserve estimate. It starts from your resting pulse, then adds part of the gap between resting pulse and estimated maximum heart rate.',
      },
      {
        question: 'Is 220 minus age exact?',
        answer:
          'No. It is a quick age-based estimate. Real maximum heart rate can be higher or lower, and fitness level, sleep, heat, stress, and medication can all change how hard a number feels.',
      },
      {
        question: 'Should I chase the top of the zone?',
        answer:
          'No. Start near the lower end if you are new, coming back after a break, exercising in heat, or unsure how hard to go. A safer workout you can repeat is better than forcing a number.',
      },
      {
        question: 'When should I stop using the number and slow down?',
        answer:
          'Slow down or stop if you feel chest pain, dizziness, faintness, unusual shortness of breath, or a heart rate that feels wrong for you. Use medical advice before training through warning signs.',
      },
    ],
    relatedSlugs: ['pace-calculator', 'calories-burned-calculator', 'calorie-calculator'],
  }),
  makeHealthTool({
    slug: 'pregnancy-calculator',
    name: 'Pregnancy Calculator',
    summary: 'Estimate due date, pregnancy week, conception timing, and trimester from LMP.',
    description:
      'Use this free pregnancy calculator to estimate due date, pregnancy week, gestational age today, conception timing, and trimester from LMP and cycle length.',
    seoTitle: 'Pregnancy Calculator | Due Date and Weeks',
    seoDescription:
      'Estimate due date, pregnancy week, gestational age, conception timing, and trimester from LMP and cycle length. Learn when ultrasound dating can override it.',
    icon: 'calculator-pregnancy',
    formula:
      'The calculator uses Naegele-style dating: due date = first day of LMP + 280 days + (cycle length - 28 days). It estimates ovulation or conception near LMP + cycle length - 14 days and counts gestational age from LMP to today.',
    caution: estimateCaution,
    useCases: [
      'Estimate an expected due date from the first day of the last menstrual period.',
      'Check pregnancy week and gestational age today.',
      'Estimate conception timing from cycle length.',
      'Use a simple planning date before clinical dating is confirmed.',
    ],
    examples: [
      { label: 'LMP Apr 1, 2026', expression: '28-day cycle', result: 'Due Jan 6, 2027; conception around Apr 15' },
      { label: 'LMP Mar 20, 2026', expression: '32-day cycle', result: 'Due Dec 29, 2026; conception around Apr 7' },
      { label: 'LMP Apr 10, 2026', expression: '26-day cycle', result: 'Due Jan 13, 2027; conception around Apr 22' },
    ],
    extraFaq: [
      {
        question: 'Why does pregnancy dating start before conception?',
        answer:
          'Pregnancy dating usually counts gestational age from the first day of the last menstrual period. That means the gestational-age number is often about two weeks ahead of the estimated conception age.',
      },
      {
        question: 'What if my cycle is not 28 days?',
        answer:
          'The calculator shifts the due date by the difference from 28 days. A 32-day cycle moves the estimate about four days later, while a 26-day cycle moves it about two days earlier. Irregular cycles make calendar dating less reliable.',
      },
      {
        question: 'Can this tell the exact conception date or biological parent?',
        answer:
          'No. The conception line is an estimate near ovulation, not proof of an exact day, intercourse date, or parentage. Fertilization timing, sperm survival, ovulation shifts, and dating uncertainty all matter.',
      },
      {
        question: 'When should ultrasound or clinician dating override this calculator?',
        answer:
          'Use clinician dating when your care team gives you an official due date, especially after an early ultrasound, uncertain LMP, irregular cycles, bleeding that may not have been a true period, IVF, multiples, or medical concerns.',
      },
    ],
    relatedSlugs: ['due-date-calculator', 'pregnancy-conception-calculator', 'ovulation-calculator'],
  }),
  makeHealthTool({
    slug: 'pregnancy-weight-gain-calculator',
    name: 'Pregnancy Weight Gain Calculator',
    summary: 'Compare current pregnancy weight gain with BMI-based singleton ranges.',
    description:
      'Use this free pregnancy weight gain calculator to compare current gain, BMI category, and weekly reference rate with singleton pregnancy guideline ranges.',
    seoTitle: 'Pregnancy Weight Gain Calculator | BMI Range',
    seoDescription:
      'Compare current pregnancy weight gain with BMI-based singleton guideline ranges. See total range, weekly reference rate, and care-team cautions.',
    icon: 'calculator-pregnancy-weight',
    formula:
      'The calculator finds pre-pregnancy BMI from height and pre-pregnancy weight, matches that BMI category to singleton pregnancy total gain ranges, subtracts pre-pregnancy weight from current weight, and shows second/third trimester weekly reference rates.',
    caution: estimateCaution,
    useCases: [
      'Estimate pre-pregnancy BMI category.',
      'Compare current gain with guideline ranges.',
      'View second and third trimester weekly gain references.',
      'Prepare questions for prenatal visits.',
    ],
    examples: [
      { label: 'Week 24', expression: '165 cm, 62 kg to 70 kg', result: '8 kg gained; normal-BMI total range 11.34-15.88 kg' },
      { label: 'Week 30', expression: '170 cm, 78 kg to 86 kg', result: '8 kg gained; overweight total range 6.8-11.34 kg' },
      { label: 'Week 18', expression: '160 cm, 52 kg to 57 kg', result: '5 kg gained; normal-BMI total range 11.34-15.88 kg' },
    ],
    extraFaq: [
      {
        question: 'Does this work for twins or triplets?',
        answer:
          'No. The calculator uses singleton pregnancy ranges. CDC lists separate twin ranges for normal, overweight, and BMI 30-39.9 categories, and triplets or higher-order pregnancies need care-team guidance.',
      },
      {
        question: 'What BMI ranges are used?',
        answer:
          'It uses pre-pregnancy BMI groups: underweight below 18.5, healthy weight 18.5-24.9, overweight 25.0-29.9, and BMI 30 or higher. The displayed kg ranges come from the pound-based guideline ranges converted to kilograms.',
      },
      {
        question: 'Should I try to lose weight during pregnancy if I am above the range?',
        answer:
          'Do not start weight-loss dieting or restrict food because of this calculator. Bring the number to your OB-GYN, midwife, or qualified clinician so they can consider fetal growth, symptoms, nutrition, and your medical history.',
      },
      {
        question: 'Why can my weekly gain look uneven?',
        answer:
          'Pregnancy weight can move unevenly because of nausea, appetite changes, constipation, fluid shifts, swelling, and fetal growth timing. The weekly rate is a reference for the second and third trimesters, not a daily rule.',
      },
    ],
    relatedSlugs: ['pregnancy-calculator', 'due-date-calculator', 'bmi-calculator'],
  }),
  makeHealthTool({
    slug: 'pregnancy-conception-calculator',
    name: 'Pregnancy Conception Calculator',
    summary: 'Estimate conception date, window, and LMP from a due date.',
    description:
      'Use this free pregnancy conception calculator to estimate conception date, possible conception window, and LMP from an expected due date.',
    seoTitle: 'Pregnancy Conception Calculator | Date Window',
    seoDescription:
      'Estimate conception date, possible conception window, and LMP from a due date. Learn why due-date backward math cannot prove an exact day or parentage.',
    icon: 'calculator-pregnancy-conception',
    formula:
      'The calculator estimates conception as due date minus 266 days, shows a possible window about five days before and after that estimate, and estimates LMP as due date minus 280 days.',
    caution: estimateCaution,
    useCases: [
      'Estimate conception timing from an expected due date.',
      'Find a possible conception window instead of one exact day.',
      'Back-calculate an estimated LMP from the due date.',
      'Understand why the result cannot prove parentage or an intercourse date.',
    ],
    examples: [
      { label: 'Due Jan 6, 2027', expression: 'Due date minus 266 days', result: 'Conception around Apr 15, 2026; window Apr 10-Apr 20' },
      { label: 'Due Oct 15, 2026', expression: 'Due date minus 266 days', result: 'Conception around Jan 22, 2026; estimated LMP Jan 8' },
      { label: 'Due Mar 1, 2027', expression: 'Due date minus 266 days', result: 'Conception around Jun 8, 2026; window Jun 3-Jun 13' },
    ],
    extraFaq: [
      {
        question: 'Why does this calculator subtract 266 days?',
        answer:
          'A common due-date estimate counts about 280 days from the first day of the last menstrual period. Conception or ovulation is often estimated about 14 days after that in a 28-day cycle, so due date minus 266 days is a backward estimate of conception timing.',
      },
      {
        question: 'Can this tell exactly when I got pregnant?',
        answer:
          'No. The center date and window are estimates. Ovulation can shift, sperm can survive for several days, fertilization timing can vary, and the due date itself may have been estimated. Use the result for planning context, not proof.',
      },
      {
        question: 'Can this answer questions about two possible fathers?',
        answer:
          'No. A due-date calculator cannot prove biological parentage or separate close intercourse dates. If parentage matters, use appropriate medical or legal testing and professional guidance instead of calendar math.',
      },
      {
        question: 'What if my due date came from ultrasound or IVF?',
        answer:
          'Use the official due date from your clinician if one has been assigned. IVF and early ultrasound dating can use different assumptions than simple LMP calendar math, so ask your care team how that date should be interpreted.',
      },
    ],
    relatedSlugs: ['pregnancy-calculator', 'due-date-calculator', 'conception-calculator'],
  }),
  makeHealthTool({
    slug: 'due-date-calculator',
    name: 'Due Date Calculator',
    summary: 'Estimate pregnancy due date from LMP and cycle length.',
    description:
      'Use this free due date calculator to estimate expected delivery date from the first day of the last period and cycle length.',
    icon: 'calculator-due-date',
    formula: 'The calculator uses Naegele-style dating: LMP plus 280 days, adjusted by the difference from a 28-day cycle.',
    caution: estimateCaution,
    useCases: [
      'Estimate a due date from last menstrual period.',
      'Adjust the estimate for shorter or longer cycles.',
      'Find estimated conception date alongside due date.',
      'Use as a planning reference before clinical confirmation.',
    ],
    examples: [
      { label: 'LMP Apr 1', expression: '28-day cycle', result: 'Estimated due date Jan 6, 2027' },
      { label: '32-day cycle', expression: 'Due date moves later', result: 'Cycle-adjusted estimate' },
      { label: '26-day cycle', expression: 'Due date moves earlier', result: 'Cycle-adjusted estimate' },
    ],
    relatedSlugs: ['pregnancy-calculator', 'pregnancy-conception-calculator', 'ovulation-calculator'],
  }),
  makeHealthTool({
    slug: 'ovulation-calculator',
    name: 'Ovulation Calculator',
    summary: 'Estimate ovulation date and fertile window from cycle details.',
    description:
      'Use this free ovulation calculator to estimate ovulation date, fertile window, and next period from last period and cycle length.',
    icon: 'calculator-ovulation',
    formula: 'The calculator estimates ovulation by subtracting luteal phase length from the next expected period date.',
    caution: estimateCaution,
    useCases: [
      'Estimate ovulation for regular cycles.',
      'See the fertile window around ovulation.',
      'Plan cycle tracking with a luteal phase assumption.',
      'Avoid using calendar estimates as contraception.',
    ],
    examples: [
      { label: '28-day cycle', expression: 'LMP Apr 1, luteal 14', result: 'Ovulation around day 14' },
      { label: '30-day cycle', expression: 'LMP Apr 4, luteal 14', result: 'Ovulation around day 16' },
      { label: 'Fertile window', expression: 'Five days before ovulation through ovulation', result: 'Estimated window' },
    ],
    relatedSlugs: ['conception-calculator', 'period-calculator', 'due-date-calculator'],
  }),
  makeHealthTool({
    slug: 'conception-calculator',
    name: 'Conception Calculator',
    summary: 'Estimate conception date and fertile window from cycle details.',
    description:
      'Use this free conception calculator to estimate conception date, fertile window, and next period from LMP, cycle length, and luteal phase.',
    seoTitle: 'Conception Calculator | Date and Fertile Window',
    seoDescription:
      'Estimate conception date, fertile window, and next period from LMP, cycle length, and luteal phase. Learn why calendar math cannot prove an exact day.',
    icon: 'calculator-conception',
    formula: 'The calculator estimates next period as LMP plus cycle length, estimates ovulation or conception as next period minus luteal phase length, and shows the fertile window as the five days before ovulation through ovulation day.',
    caution: estimateCaution,
    useCases: [
      'Estimate conception timing from LMP and cycle length.',
      'Find a fertile window for regular cycles.',
      'Compare a cycle-based conception estimate with due-date reverse math.',
      'Understand why ovulation and fertile windows can shift month to month.',
    ],
    examples: [
      { label: 'LMP Apr 1, 2026', expression: '28-day cycle, luteal 14', result: 'Conception around Apr 15; fertile window Apr 10-Apr 15' },
      { label: 'LMP Apr 2, 2026', expression: '32-day cycle, luteal 14', result: 'Conception around Apr 20; next period May 4' },
      { label: 'LMP Apr 10, 2026', expression: '27-day cycle, luteal 12', result: 'Conception around Apr 25; fertile window Apr 20-Apr 25' },
    ],
    extraFaq: [
      {
        question: 'Is conception date the same as ovulation date?',
        answer:
          'This calculator places the estimated conception date near ovulation because fertilization can only happen after an egg is released. Sex and conception are not always the same day because sperm can survive for several days before ovulation.',
      },
      {
        question: 'Can this tell when I got pregnant exactly?',
        answer:
          'No. It is a calendar estimate from cycle assumptions. Ovulation can come earlier or later than expected, fertilization timing can vary, and many people do not have the same cycle every month.',
      },
      {
        question: 'Can this answer questions about two possible fathers?',
        answer:
          'No. Calendar math cannot prove parentage or separate close dates. If biological parentage matters, use appropriate medical or legal testing and professional guidance.',
      },
      {
        question: 'What if I only know the due date?',
        answer:
          'Use the Pregnancy Conception Calculator instead. This Conception Calculator starts from LMP and cycle length, while the Pregnancy Conception Calculator works backward from an expected due date.',
      },
    ],
    relatedSlugs: ['ovulation-calculator', 'pregnancy-conception-calculator', 'due-date-calculator'],
  }),
  makeHealthTool({
    slug: 'period-calculator',
    name: 'Period Calculator',
    summary: 'Predict upcoming period dates from cycle length and period length.',
    description:
      'Use this free period calculator to estimate the next period start, expected end, and upcoming cycle dates.',
    icon: 'calculator-period',
    formula: 'The calculator adds cycle length to the first day of the last period until it finds the next expected period start date.',
    caution: estimateCaution,
    useCases: [
      'Estimate the next period start date.',
      'Estimate expected period end date.',
      'List upcoming cycles for planning.',
      'Use calendar estimates while remembering cycles can change.',
    ],
    examples: [
      { label: '28-day cycle', expression: 'Last period Apr 1, 5 days long', result: 'Next period estimate' },
      { label: '30-day cycle', expression: 'Last period Apr 5', result: 'Next cycle dates' },
      { label: 'Short cycle', expression: '26-day cycle', result: 'Earlier next period estimate' },
    ],
    relatedSlugs: ['ovulation-calculator', 'conception-calculator', 'due-date-calculator'],
  }),
  makeHealthTool({
    slug: 'macro-calculator',
    name: 'Macro Calculator',
    summary: 'Split daily calories into protein, fat, and carbohydrate grams.',
    description:
      'Use this free macro calculator to convert daily calories into protein, fat, and carbohydrate targets for balanced or goal-based plans.',
    icon: 'calculator-macro',
    formula: 'The calculator applies a selected protein, fat, and carbohydrate percentage split, using 4 kcal per gram for protein and carbs and 9 kcal per gram for fat.',
    caution: estimateCaution,
    useCases: [
      'Convert calories into macro grams.',
      'Compare balanced, higher-protein, and lower-carb splits.',
      'Plan meals with calorie and macro targets.',
      'Cross-check carb, protein, and fat calculators.',
    ],
    examples: [
      { label: 'Balanced', expression: '2000 kcal', result: 'Carbs, protein, and fat grams' },
      { label: 'Higher protein', expression: '2400 kcal', result: 'Higher protein gram target' },
      { label: 'Lower carb', expression: '1800 kcal', result: 'Lower carbohydrate split' },
    ],
    relatedSlugs: ['carbohydrate-calculator', 'protein-calculator', 'fat-intake-calculator'],
  }),
  makeHealthTool({
    slug: 'carbohydrate-calculator',
    name: 'Carbohydrate Calculator',
    summary: 'Calculate carbohydrate grams from calories and carb percentage.',
    description:
      'Use this free carbohydrate calculator to convert daily calories and carbohydrate percentage into grams per day, with formula steps, AMDR context, examples, and nutrition limits.',
    seoTitle: 'Carbohydrate Calculator | Carbs Grams Per Day',
    seoDescription:
      'Convert calories and carb percentage into daily carbohydrate grams, see the 4 calories per gram formula, AMDR context, examples, and nutrition limits.',
    aliases: [
      'Carb Calculator',
      'Carbs Per Day Calculator',
      'Daily Carbohydrate Calculator',
      'Macro Carb Calculator',
      'Carb Percentage to Grams Calculator',
    ],
    icon: 'calculator-carbohydrate',
    formula:
      'Carbohydrate calories = daily calories x carbohydrate percentage / 100. Carbohydrate grams = carbohydrate calories / 4 because carbohydrate has about 4 calories per gram.',
    caution:
      'This calculator gives an educational total-carbohydrate gram estimate only. It is not diabetes care, blood-sugar treatment, medical nutrition therapy, an eating-disorder tool, a sports-fueling prescription, or clinician advice.',
    useCases: [
      'Convert a macro carbohydrate percentage into daily grams.',
      'Compare a calorie target against common AMDR-style adult carbohydrate percentage context.',
      'Plan total carbohydrate grams before checking food labels or meal plans.',
      'Use with macro, protein, fat, and calorie calculators.',
    ],
    examples: [
      { label: '50% of 2000', expression: '2000 kcal x 50% = 1000 carb kcal; 1000 / 4', result: '250 g carbohydrate' },
      { label: '45% of 1800', expression: '1800 kcal x 45% = 810 carb kcal; 810 / 4', result: '202.5 g carbohydrate' },
      { label: '60% of 2500', expression: '2500 kcal x 60% = 1500 carb kcal; 1500 / 4', result: '375 g carbohydrate' },
      { label: '40% of 2200', expression: '2200 kcal x 40% = 880 carb kcal; 880 / 4', result: '220 g carbohydrate' },
    ],
    extraFaq: [
      {
        question: 'Why does the carbohydrate calculator divide by 4?',
        answer:
          'Carbohydrate provides about 4 calories per gram. The calculator first finds carbohydrate calories, then divides by 4 to convert those calories into grams.',
      },
      {
        question: 'Should I type 50 or 0.50 for 50% carbohydrate?',
        answer:
          'Type 50 for 50%. The calculator treats the percent box as a normal percentage, so 0.50 means one-half of one percent and would make the carb grams much smaller than intended.',
      },
      {
        question: 'Is 45% to 65% carbohydrate a personal goal?',
        answer:
          'No. The 45% to 65% adult AMDR range is broad public nutrition context, not a personal prescription. Your useful target can change with activity, diabetes care, sport goals, pregnancy, digestion, food preferences, and clinician guidance.',
      },
      {
        question: 'Does this calculator count fiber and sugar separately?',
        answer:
          'No. It estimates total carbohydrate grams from calories and percent. Food labels, meal plans, or diabetes education materials are needed when fiber, added sugar, net carbs, or blood-glucose response matter.',
      },
      {
        question: 'What happens if my calorie target is wrong?',
        answer:
          'The carbohydrate gram result moves with the calorie target. For example, 50% of 2,000 calories is 250 grams, while 50% of 1,600 calories is 200 grams. Check calories first, then macro percentage.',
      },
      {
        question: 'Can I use a very low carbohydrate percentage?',
        answer:
          'You can calculate one, but that does not make it right for your body or health situation. Very low carbohydrate targets can be inappropriate for some people, and medical conditions or eating concerns need qualified nutrition or medical guidance.',
      },
    ],
    relatedSlugs: ['macro-calculator', 'protein-calculator', 'fat-intake-calculator'],
  }),
  makeHealthTool({
    slug: 'protein-calculator',
    name: 'Protein Calculator',
    summary: 'Estimate protein grams per day from body weight and target factor.',
    description:
      'Use this free protein calculator to estimate daily protein grams from body weight and common grams-per-kilogram targets.',
    icon: 'calculator-protein',
    formula: 'Protein target = body weight in kilograms x selected grams of protein per kilogram.',
    caution: estimateCaution,
    useCases: [
      'Estimate the RDA-style 0.8 g/kg protein target.',
      'Compare active and strength-training targets.',
      'Convert body weight to daily protein grams.',
      'Use with macro and calorie planning.',
    ],
    examples: [
      { label: 'RDA', expression: '70 kg x 0.8 g/kg', result: '56 g protein' },
      { label: 'Active', expression: '80 kg x 1.2 g/kg', result: '96 g protein' },
      { label: 'Strength', expression: '75 kg x 1.6 g/kg', result: '120 g protein' },
    ],
    relatedSlugs: ['macro-calculator', 'carbohydrate-calculator', 'fat-intake-calculator'],
  }),
  makeHealthTool({
    slug: 'fat-intake-calculator',
    name: 'Fat Intake Calculator',
    summary: 'Calculate daily dietary fat grams from calories and fat percentage.',
    description:
      'Use this free fat intake calculator to convert daily calories and fat percentage into grams per day, with formula steps and nutrition-planning limits.',
    seoTitle: 'Fat Intake Calculator | Fat Grams Per Day',
    seoDescription:
      'Convert calories and fat percentage into daily fat grams, see the 9 calories per gram formula, AMDR context, examples, and nutrition limits.',
    aliases: [
      'Fat Grams Calculator',
      'Daily Fat Intake Calculator',
      'Dietary Fat Calculator',
      'Macro Fat Calculator',
      'Fat Percentage to Grams Calculator',
    ],
    icon: 'calculator-fat-intake',
    formula: 'Fat calories = daily calories x fat percentage / 100. Fat grams = fat calories / 9 because dietary fat has about 9 calories per gram.',
    caution:
      'This calculator gives an educational total-fat gram estimate only. It is not medical nutrition therapy, an eating-disorder tool, a saturated-fat limit, a cholesterol plan, or personal clinician advice.',
    useCases: [
      'Convert a macro fat percentage into daily grams.',
      'Compare a calorie target against common AMDR-style adult fat percentage context.',
      'Plan total dietary fat grams before checking food labels or meal plans.',
      'Use with macro, protein, carbohydrate, and calorie calculators.',
    ],
    examples: [
      { label: '30% of 2000', expression: '2000 kcal x 30% = 600 fat kcal; 600 / 9', result: 'About 66.7 g fat' },
      { label: '25% of 1800', expression: '1800 kcal x 25% = 450 fat kcal; 450 / 9', result: '50 g fat' },
      { label: '35% of 2400', expression: '2400 kcal x 35% = 840 fat kcal; 840 / 9', result: 'About 93.3 g fat' },
      { label: '20% of 2200', expression: '2200 kcal x 20% = 440 fat kcal; 440 / 9', result: 'About 48.9 g fat' },
    ],
    extraFaq: [
      {
        question: 'Why does the fat calculator divide by 9?',
        answer:
          'Dietary fat provides about 9 calories per gram. The calculator first finds fat calories, then divides by 9 to convert those calories into grams.',
      },
      {
        question: 'Is 20% to 35% fat a personal goal?',
        answer:
          'No. The 20% to 35% adult AMDR range is broad public nutrition context, not a personal prescription. Your right target can change with age, medical conditions, sport goals, pregnancy, calorie needs, and clinician guidance.',
      },
      {
        question: 'Does this calculator split saturated, unsaturated, and trans fat?',
        answer:
          'No. It estimates total dietary fat grams only. Food quality still matters, and nutrition labels or clinician guidance are needed when saturated fat, trans fat, cholesterol, or heart-health targets matter.',
      },
      {
        question: 'Is dietary fat the same as body fat?',
        answer:
          'No. Dietary fat is a macronutrient in food. Body fat is stored tissue on the body. This calculator converts food calories and macro percentage into grams; it does not estimate body-fat percentage or weight change.',
      },
      {
        question: 'What happens if my calorie target is wrong?',
        answer:
          'The fat gram result moves with the calorie target. For example, 30% of 2,000 calories is about 66.7 grams, while 30% of 1,600 calories is about 53.3 grams. Check calories first, then macro percentage.',
      },
      {
        question: 'Can I use a very low fat percentage?',
        answer:
          'You can calculate one, but that does not make it a good plan. Very low fat targets can be inappropriate for some people, and medical conditions or eating concerns need qualified nutrition or medical guidance.',
      },
    ],
    relatedSlugs: ['macro-calculator', 'carbohydrate-calculator', 'protein-calculator'],
  }),
  makeHealthTool({
    slug: 'tdee-calculator',
    name: 'TDEE Calculator',
    summary: 'Estimate daily maintenance calories from BMR and activity level.',
    description:
      'Use this free TDEE calculator to estimate daily maintenance calories from age, formula sex, height, weight, and activity level, with formula steps and planning limits.',
    seoTitle: 'TDEE Calculator | Maintenance Calories Per Day',
    seoDescription:
      'Estimate TDEE from Mifflin-St Jeor BMR and activity factors. See maintenance calories, examples, activity-level tips, and limits before planning intake.',
    aliases: [
      'Maintenance Calorie Calculator',
      'Total Daily Energy Expenditure Calculator',
      'Daily Energy Expenditure Calculator',
      'Activity Factor Calculator',
      'BMR to TDEE Calculator',
    ],
    icon: 'calculator-tdee',
    formula:
      'BMR = 10 x weight kg + 6.25 x height cm - 5 x age + formula-sex adjustment (+5 or -161). TDEE = BMR x activity factor: 1.2 sedentary, 1.375 light, 1.55 moderate, 1.725 very active, or 1.9 extra active.',
    caution:
      'This calculator gives an educational maintenance-calorie estimate only. It is not a medical diet order, eating-disorder tool, pregnancy nutrition plan, sport fueling prescription, or guarantee of weight change.',
    useCases: [
      'Estimate maintenance calories before setting macro targets.',
      'Compare sedentary, light, moderate, very active, and extra active activity factors.',
      'Use TDEE as the base for calorie, protein, carbohydrate, and fat planning.',
      'Adjust a starting estimate with real weight trends and intake tracking over time.',
    ],
    examples: [
      { label: 'Moderate activity', expression: 'Female formula, age 32, 165 cm, 68 kg: BMR 1,390.25 x 1.55', result: 'About 2,155 kcal/day' },
      { label: 'Sedentary', expression: 'Male formula, age 45, 180 cm, 88 kg: BMR 1,785 x 1.2', result: '2,142 kcal/day' },
      { label: 'Very active', expression: 'Female formula, age 27, 172 cm, 63 kg: BMR 1,409 x 1.725', result: 'About 2,431 kcal/day' },
      { label: 'Moderate male check', expression: 'Male formula, age 35, 178 cm, 82 kg: BMR 1,762.5 x 1.55', result: 'About 2,732 kcal/day' },
    ],
    extraFaq: [
      {
        question: 'What activity factors does this TDEE calculator use?',
        answer:
          'It uses common planning factors: 1.2 for sedentary, 1.375 for light activity, 1.55 for moderate activity, 1.725 for very active, and 1.9 for extra active. These are broad multipliers, not wearable-tracker measurements.',
      },
      {
        question: 'Is TDEE the same as BMR?',
        answer:
          'No. BMR estimates resting energy before normal movement and exercise. TDEE starts with BMR, then multiplies it by an activity factor to estimate total daily energy expenditure.',
      },
      {
        question: 'How should I choose an activity level?',
        answer:
          'Choose the level that describes your usual week, not your hardest training day. If work, steps, workouts, or caregiving vary a lot, start conservative and compare the estimate with real weight and intake trends.',
      },
      {
        question: 'Is TDEE my weight-loss target?',
        answer:
          'No. TDEE is the estimated maintenance anchor. A weight-loss, gain, or macro target should be chosen separately and carefully, especially if you have medical conditions, a history of disordered eating, pregnancy, or sport-performance needs.',
      },
      {
        question: 'Why can my real maintenance calories be different?',
        answer:
          'Activity labels are broad, food tracking can be off, body composition varies, and weight changes include water and glycogen shifts. Use the calculator as a starting estimate, then adjust slowly with real-world evidence.',
      },
      {
        question: 'Can I use TDEE for medical or pregnancy nutrition?',
        answer:
          'Use qualified medical or nutrition guidance for pregnancy, diabetes, kidney disease, heart disease, eating-disorder recovery, medication changes, or any plan where under-eating or over-eating could be unsafe.',
      },
    ],
    relatedSlugs: ['calorie-calculator', 'bmr-calculator', 'macro-calculator'],
  }),
  makeHealthTool({
    slug: 'gfr-calculator',
    name: 'GFR Calculator',
    summary: 'Estimate adult eGFR from serum creatinine with the 2021 CKD-EPI race-free equation.',
    description:
      'Use this free GFR calculator to estimate adult eGFR from age, sex used by the equation, and standardized serum creatinine in mg/dL with the 2021 CKD-EPI creatinine equation.',
    seoTitle: 'GFR Calculator | 2021 CKD-EPI eGFR Estimate',
    seoDescription:
      'Estimate adult eGFR from age, sex used by the equation, and serum creatinine in mg/dL with the race-free 2021 CKD-EPI creatinine formula.',
    aliases: [
      'eGFR Calculator',
      'Kidney Function Calculator',
      'Creatinine GFR Calculator',
      'CKD-EPI Calculator',
      '2021 CKD-EPI Calculator',
      'Race-Free GFR Calculator',
    ],
    icon: 'calculator-gfr',
    formula:
      'eGFR = 142 x min(Scr/k, 1)^alpha x max(Scr/k, 1)^-1.200 x 0.9938^age x sex factor. Scr is standardized serum creatinine in mg/dL. For this calculator, k is 0.7 and alpha is -0.241 for the female equation, k is 0.9 and alpha is -0.302 for the male equation, and the female equation uses a 1.012 multiplier. No race coefficient is used.',
    caution:
      'This educational eGFR estimate is not a kidney disease diagnosis, lab report, medication dosing instruction, transplant, pregnancy, pediatric, or emergency-care tool. Confirm kidney results with a clinician, especially if symptoms, abnormal urine tests, repeat low eGFR, diabetes, high blood pressure, medication changes, or acute illness are involved.',
    useCases: [
      'Estimate adult eGFR from a creatinine lab value.',
      'Use the 2021 CKD-EPI race-free equation.',
      'See a broad eGFR interpretation range.',
      'Prepare questions for a clinician about kidney labs.',
    ],
    examples: [
      { label: 'Female 50', expression: 'Creatinine 0.9 mg/dL', result: 'About 77.88 mL/min/1.73 m2' },
      { label: 'Male 60', expression: 'Creatinine 1.1 mg/dL', result: 'About 76.85 mL/min/1.73 m2' },
      { label: 'Female 70', expression: 'Creatinine 1.2 mg/dL', result: 'About 48.7 mL/min/1.73 m2' },
      { label: 'Male 45', expression: 'Creatinine 1.4 mg/dL', result: 'About 63.17 mL/min/1.73 m2' },
    ],
    extraFaq: [
      {
        question: 'What equation does this GFR calculator use?',
        answer:
          'It uses the 2021 CKD-EPI creatinine equation for adults. The inputs are age, sex used by the equation, and standardized serum creatinine in mg/dL. It does not use cystatin C, urine albumin, race, height, weight, or body surface area entered by the user.',
      },
      {
        question: 'Does this eGFR calculator use a race coefficient?',
        answer:
          'No. This page uses the 2021 CKD-EPI creatinine equation without a race coefficient, matching the current race-free formula structure published for adult creatinine-based eGFR reporting.',
      },
      {
        question: 'Why does serum creatinine need to be in mg/dL?',
        answer:
          'The equation on this page expects standardized serum creatinine in mg/dL. Some lab reports use micromoles per liter. Do not type a value from a different unit system unless the lab report or a clinician gives the mg/dL value.',
      },
      {
        question: 'Does one eGFR result diagnose kidney disease?',
        answer:
          'No. A single estimate is not a diagnosis. Kidney disease assessment can depend on repeat eGFR, urine albumin, blood pressure, diabetes, medications, imaging, symptoms, acute illness, and clinician judgment.',
      },
      {
        question: 'Can children, pregnant people, or transplant patients use this calculator?',
        answer:
          'Not as a decision tool. Pediatric, pregnancy, transplant, acute kidney injury, dialysis, amputation, unusually high or low muscle mass, and severe illness situations can need different clinical interpretation or formulas.',
      },
      {
        question: 'What should I do if the eGFR looks low?',
        answer:
          'Do not panic from one calculator result. Check that age, sex, creatinine unit, and lab value were entered correctly, then discuss the lab report with a clinician, especially if the result is new, repeated, or paired with symptoms or abnormal urine tests.',
      },
    ],
    relatedSlugs: ['body-surface-area-calculator', 'bmi-calculator', 'healthy-weight-calculator'],
  }),
  makeHealthTool({
    slug: 'body-type-calculator',
    name: 'Body Type Calculator',
    summary: 'Estimate a broad body-shape category from shoulder, bust, waist, and hip measurements.',
    description:
      'Use this free body type calculator to compare shoulder, bust or chest, waist, and hip measurements for a broad body-shape estimate.',
    icon: 'calculator-body-type',
    formula: 'The calculator uses the larger of shoulders or bust/chest as the top measurement. Top and hips within 5 cm with at least 20 cm of waist definition returns Hourglass. Hips 7+ cm wider returns Triangle or pear, top 7+ cm wider returns Inverted triangle, waist definition under 20 cm returns Rectangle, and the remaining close cases return Balanced.',
    caution:
      'This is a style and measurement helper, not a health score, attractiveness score, diagnosis, 3D body scan, or height-and-weight body type test. Body-shape labels are broad estimates and do not rank bodies.',
    useCases: [
      'Compare shoulder, bust or chest, waist, and hip measurements for style planning.',
      'Estimate a broad hourglass, triangle, inverted triangle, rectangle, or balanced category.',
      'Check why close measurements can change the body-shape label.',
      'Keep body-shape labels separate from health, BMI, weight, and body-fat results.',
    ],
    examples: [
      { label: 'Hourglass', expression: 'Shoulders 100 cm, bust 96 cm, waist 76 cm, hips 101 cm', result: 'Hourglass' },
      { label: 'Triangle', expression: 'Shoulders 92 cm, bust 90 cm, waist 74 cm, hips 105 cm', result: 'Triangle or pear' },
      { label: 'Inverted', expression: 'Shoulders 108 cm, bust 102 cm, waist 82 cm, hips 95 cm', result: 'Inverted triangle' },
      { label: 'Rectangle', expression: 'Shoulders 98 cm, bust 95 cm, waist 86 cm, hips 100 cm', result: 'Rectangle' },
      { label: 'Balanced', expression: 'Shoulders 100 cm, bust 99 cm, waist 78 cm, hips 106 cm', result: 'Balanced' },
    ],
    extraFaq: [
      {
        question: 'Does the calculator use shoulders or bust?',
        answer:
          'It uses both inputs, then treats the larger one as the top measurement. That keeps the result from depending on only one upper-body number when shoulders and bust or chest are different.',
      },
      {
        question: 'Why can a small measurement change switch the body type result?',
        answer:
          'The labels use simple thresholds. A 5 cm top-versus-hip difference, a 7 cm wider side, or a 20 cm waist-definition line can move a close case from hourglass to balanced, rectangle, triangle, or inverted triangle.',
      },
      {
        question: 'Is this a male or female body type calculator?',
        answer:
          'The calculator does not ask for sex. It only compares the four measurements you enter. Use the label as a loose style reference, not as a gender rule, health result, or body ranking.',
      },
      {
        question: 'Does this body type calculator use height and weight?',
        answer:
          'No. Height and weight are useful for other calculators, but this body-shape estimate comes from shoulder, bust or chest, waist, and hip measurements only.',
      },
    ],
    relatedSlugs: ['body-fat-calculator', 'healthy-weight-calculator', 'ideal-weight-calculator'],
  }),
  makeHealthTool({
    slug: 'body-surface-area-calculator',
    name: 'Body Surface Area Calculator',
    summary: 'Estimate adult body surface area with Mosteller and Du Bois formula results.',
    description:
      'Use this free body surface area calculator to estimate adult BSA in square meters from height and weight, with Mosteller and Du Bois formula results.',
    icon: 'calculator-bsa',
    formula: 'Mosteller BSA = square root of (height in cm times weight in kg divided by 3600). Du Bois BSA = 0.007184 x height^0.725 x weight^0.425. Both results are shown in square meters.',
    caution:
      'No. BSA is an educational clinical-math estimate, not medical advice, not a medication dose, and not a treatment plan. Ask a qualified clinician before using BSA for care, dosing, burns, surgery, chemotherapy, kidney equations, or other medical decisions.',
    useCases: [
      'Estimate adult BSA from height and weight.',
      'Compare Mosteller and Du Bois formula results.',
      'Check why two BSA formulas can differ slightly.',
      'Keep dosing and treatment decisions with a qualified clinician.',
    ],
    examples: [
      { label: 'Average adult', expression: '170 cm, 70 kg', result: 'Mosteller 1.82 m2; Du Bois 1.81 m2' },
      { label: 'Taller adult', expression: '180 cm, 85 kg', result: 'Mosteller 2.06 m2; Du Bois 2.05 m2' },
      { label: 'Smaller adult', expression: '160 cm, 55 kg', result: 'Mosteller 1.56 m2; Du Bois 1.56 m2' },
      { label: 'Small adult', expression: '150 cm, 45 kg', result: 'Mosteller 1.37 m2; Du Bois 1.37 m2' },
    ],
    extraFaq: [
      {
        question: 'What is the difference between Mosteller and Du Bois BSA?',
        answer:
          'Mosteller is a simple square-root formula using height and weight. Du Bois uses height and weight with exponents. They usually stay close for ordinary adult inputs, but they are not identical, so this calculator shows both instead of pretending one estimate is perfect.',
      },
      {
        question: 'Can this calculator handle children, burns, pets, or procedure-specific formulas?',
        answer:
          'No. This page is a simple adult human height-and-weight BSA reference. It is not a pediatric, neonatal, burn, veterinary, psoriasis, chemotherapy, surgery, or Schnur-scale calculator.',
      },
      {
        question: 'Why is BSA shown in square meters?',
        answer:
          'Body surface area formulas usually report square meters, written here as m2. That unit is different from BMI, body fat percentage, or body weight, so do not compare the number as if it were one of those results.',
      },
    ],
    relatedSlugs: ['gfr-calculator', 'bmi-calculator', 'healthy-weight-calculator'],
  }),
  makeHealthTool({
    slug: 'bac-calculator',
    name: 'BAC Calculator',
    summary: 'Estimate blood alcohol concentration with a Widmark-style formula.',
    description:
      'Use this free BAC calculator for an educational blood alcohol concentration estimate from drinks, ABV, body weight, sex, and time.',
    seoTitle: 'BAC Calculator | Widmark-Style Blood Alcohol Estimate',
    seoDescription:
      'Estimate blood alcohol concentration from drinks, ABV, body weight, sex, and time, with clear limits and no driving or legal advice.',
    aliases: ['blood alcohol calculator', 'alcohol calculator', 'bac estimate', 'widmark calculator'],
    icon: 'calculator-bac',
    formula:
      'The calculator estimates grams of alcohol from drink volume, ABV, drink count, and 0.789 g/mL ethanol density, applies a Widmark-style body-water factor, then subtracts 0.015 percentage points per hour as a rough elimination estimate.',
    caution:
      'No. This estimate is not legal, medical, or driving advice. Do not use it to decide whether to drive or perform safety-sensitive tasks.',
    useCases: [
      'Understand how drink count, ABV, body weight, and time affect an estimate.',
      'Compare different drink sizes and strengths.',
      'See why BAC estimates are uncertain.',
      'Avoid using estimates for legal or safety decisions.',
    ],
    examples: [
      { label: 'Two beers', expression: 'Male, 80 kg, 2 x 355 mL at 5%, 1 hour', result: 'About 0.0365% BAC; estimated 2.43 hours to zero' },
      { label: 'Wine example', expression: 'Female, 65 kg, 2 x 150 mL at 12%, 2 hours', result: 'About 0.0495% BAC; estimated 3.3 hours to zero' },
      { label: 'Spirit drink', expression: 'Male, 90 kg, 1 x 45 mL at 40%, 1 hour', result: 'About 0.0082% BAC; estimated 0.55 hours to zero' },
    ],
    extraFaq: [
      {
        question: 'Can I use this BAC estimate to decide whether to drive?',
        answer:
          'No. Do not use this calculator to decide whether it is safe or legal to drive. Laws, enforcement tests, body differences, medication, food, timing, and impairment can all matter, so the safest practical answer is not to drive after drinking.',
      },
      {
        question: 'What does Widmark-style mean on this page?',
        answer:
          'It means the calculator estimates grams of alcohol, divides by body weight and a broad body-water factor, then subtracts an average elimination amount for elapsed time. It is a learning estimate, not a breathalyzer, blood test, or legal standard.',
      },
      {
        question: 'Why do drink size and ABV matter so much?',
        answer:
          'The alcohol grams come directly from volume and ABV. A large craft beer, heavy wine pour, or strong mixed drink can contain much more alcohol than a small standard serving, so entering the label and pour size matters more than the drink name.',
      },
    ],
    relatedSlugs: ['calorie-calculator', 'bmi-calculator', 'body-surface-area-calculator'],
  }),
];
