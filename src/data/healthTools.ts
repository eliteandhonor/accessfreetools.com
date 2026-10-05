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
  const isUnderweightBmiCalculator = spec.slug === 'underweight-bmi-calculator';
  const isBodyFatCalculator = spec.slug === 'body-fat-calculator';
  const isArmyBodyFatCalculator = spec.slug === 'army-body-fat-calculator';
  const isBmrCalculator = spec.slug === 'bmr-calculator';
  const isLeanBodyMassCalculator = spec.slug === 'lean-body-mass-calculator';
  const isTargetHeartRateCalculator = spec.slug === 'target-heart-rate-calculator';
  const isBodySurfaceAreaCalculator = spec.slug === 'body-surface-area-calculator';
  const isBacCalculator = spec.slug === 'bac-calculator';
  const isCalorieCalculator = spec.slug === 'calorie-calculator';
  const isCaloriesBurnedCalculator = spec.slug === 'calories-burned-calculator';
  const isOneRepMaxCalculator = spec.slug === 'one-rep-max-calculator';
  const isMacroCalculator = spec.slug === 'macro-calculator';
  const isNutritionPointsCalculator = spec.slug === 'nutrition-points-calculator';
  const isCarbohydrateCalculator = spec.slug === 'carbohydrate-calculator';
  const isProteinCalculator = spec.slug === 'protein-calculator';
  const isFatIntakeCalculator = spec.slug === 'fat-intake-calculator';
  const isTdeeCalculator = spec.slug === 'tdee-calculator';
  const isGfrCalculator = spec.slug === 'gfr-calculator';
  const isPregnancyCalculator = spec.slug === 'pregnancy-calculator';
  const isDueDateCalculator = spec.slug === 'due-date-calculator';
  const isPregnancyConceptionCalculator = spec.slug === 'pregnancy-conception-calculator';
  const isOvulationCalculator = spec.slug === 'ovulation-calculator';
  const isConceptionCalculator = spec.slug === 'conception-calculator';
  const isPeriodCalculator = spec.slug === 'period-calculator';
  const isPregnancyWeightGainCalculator = spec.slug === 'pregnancy-weight-gain-calculator';
  const inputAnswer = isBmiCalculator
    ? 'Enter adult height in centimeters (cm) and weight in kilograms (kg). For feet and inches, multiply feet by 12 and add the remaining inches. Multiply that total by 2.54 for centimeters. Multiply pounds by 0.45359237 for kilograms. This page is for adult BMI screening only. Children and teens use age-and-sex percentiles instead.'
    : isUnderweightBmiCalculator
      ? 'Enter adult height in centimeters and weight in kilograms. The calculator uses those two numbers only, so a pounds-versus-kilograms or inches-versus-centimeters mix-up can change the BMI category and the distance to the 18.5 threshold.'
    : isBodyFatCalculator
      ? 'Enter formula sex, height, optional weight, neck, waist, and hip when the female equation is selected. The male equation uses waist minus neck with height. The female equation uses waist plus hip minus neck with height. Keep the tape level, snug, and consistent from one check to the next.'
    : isArmyBodyFatCalculator
      ? 'Enter sex, age, body weight in pounds, and abdomen circumference in inches. The current Army one-site method uses the abdomen measurement at the navel, not neck, hip, or height measurements. Use a non-stretch tape, keep it level, and do not pull it tight enough to dig into the skin.'
    : isBmrCalculator
      ? 'Enter formula sex, age in years, height in centimeters, and weight in kilograms. The formula sex setting chooses the +5 or -161 Mifflin-St Jeor adjustment; it is a calculator input, not a full description of your body, health, or nutrition needs.'
    : isLeanBodyMassCalculator
      ? 'Enter formula sex, height in centimeters, and weight in kilograms. The formula sex setting chooses the Boer equation constants. The calculator does not ask for body fat percentage, age, training status, or scan results.'
    : isTargetHeartRateCalculator
      ? 'For Target zones, enter age, choose the effort range, and add resting heart rate only if you want the heart-rate-reserve estimate. For Pulse to BPM, count whole beats for 10, 15, 30, or 60 seconds and select the same count time.'
    : isBodySurfaceAreaCalculator
      ? 'Enter height in centimeters and weight in kilograms. The calculator uses those two measured values for adult human body surface area formulas. It does not ask for age, sex, body fat, diagnosis, procedure type, burn percentage, or medication details.'
    : isBacCalculator
      ? 'Enter the formula sex setting, body weight in kilograms, number of drinks, drink size in milliliters, ABV percent, and hours since the first drink. Use the actual pour size and alcohol percentage when you know them. A strong mixed drink or large pour can count as more alcohol than one ordinary serving.'
    : isCalorieCalculator
      ? 'Enter the formula sex setting, age in years, height in centimeters, weight in kilograms, activity level, and planning goal. Formula sex chooses the +5 or -161 Mifflin-St Jeor adjustment. Activity level is a broad weekly average, so choose the closest normal week rather than one unusually hard or unusually quiet day.'
    : isCaloriesBurnedCalculator
      ? 'Choose a 2024 Adult Compendium activity or enter a custom MET from 1 to 25, then enter body weight in kilograms or pounds and active minutes. Match the description closely: moderate walking at 2.8-3.4 mph is 3.8 MET, while brisk walking at 3.5-3.9 mph is 4.8 MET.'
    : isOneRepMaxCalculator
      ? 'Enter the weight you lifted in kilograms and the number of clean reps you completed. Use a set with full range of motion and consistent form. Do not use failed reps, forced reps, partial reps, or a set above 30 reps as a clean input.'
    : isMacroCalculator
      ? 'Enter your daily calorie target first, then choose or enter the protein, fat, and carbohydrate percentages. Type whole percentages like 40 for 40%, not 0.40. The three percentages should add to 100, and the result is only as useful as the calorie target you start with.'
    : isNutritionPointsCalculator
      ? 'Enter one serving from a Nutrition Facts label: calories, saturated fat in grams, added sugar in grams, sodium in milligrams, dietary fiber in grams, and protein in grams. Use saturated fat, not total fat; use added sugar, not total sugar; and keep serving sizes the same when comparing foods.'
    : isCarbohydrateCalculator
      ? 'Enter the calorie target first, then enter the percent of those calories planned from carbohydrate. Type 50 for 50%, not 0.50. The calculator assumes carbohydrate has 4 calories per gram and uses only the calorie target and carb percent you provide.'
    : isProteinCalculator
      ? 'Enter body weight in kilograms, then choose the protein factor in grams per kilogram. The presets are 0.8 g/kg for an RDA-style adult reference, 1.2 g/kg for an active planning target, and 1.6 g/kg for a strength-training planning target. Do not enter pounds in the kilogram field; convert pounds to kilograms first if needed.'
    : isFatIntakeCalculator
      ? 'Enter the calorie target first, then enter the percent of those calories planned from fat. Type 30 for 30%, not 0.30. The calculator assumes dietary fat has 9 calories per gram and uses the calorie target you provide.'
    : isTdeeCalculator
      ? 'Enter the formula sex setting, age, height in centimeters, weight in kilograms, and the activity level that best describes a normal week. The formula sex setting chooses the +5 or -161 Mifflin-St Jeor adjustment. The activity level multiplies BMR by a broad factor, so pick the average week rather than your best workout day.'
    : isGfrCalculator
      ? 'Enter age in years, sex used by the equation, and standardized serum creatinine in mg/dL from a lab result. Do not enter micromoles per liter, old lab values, cystatin C, urine albumin, or body weight in the creatinine box.'
    : isPregnancyCalculator
      ? 'Enter the first day of the last menstrual period, not the last day bleeding occurred. Cycle length means the usual number of days from one period start to the next; use 28 only if that is close for you. If the LMP is uncertain, cycles are irregular, bleeding may not have been a true period, or a clinician has already dated the pregnancy, use the clinician or ultrasound date instead.'
    : isDueDateCalculator
      ? 'Enter the first day of the last menstrual period, not the last day of bleeding. Cycle length means the usual number of days from one period start to the next. Use 28 only if that is close for you, and use clinician, ultrasound, or IVF dating if that has already been assigned.'
    : isPregnancyConceptionCalculator
      ? 'Enter the estimated due date you were given by a clinician, ultrasound report, or earlier due-date calculation. This calculator works backward from that date only. If the due date changed after ultrasound, IVF dating, or clinician review, use the updated date instead of an older calendar estimate.'
    : isOvulationCalculator
      ? 'Enter the first day of the last period, your usual cycle length from one period start to the next, and luteal phase length if you know it. If you do not know luteal phase length, keep the 14-day default and read the answer as a calendar estimate for regular cycles, not a confirmed ovulation test.'
    : isConceptionCalculator
      ? 'Enter the first day of the last period, your usual cycle length from one period start to the next, and luteal phase length if you know it. If you do not know luteal phase length, keep the default and read the answer as a rough cycle estimate. Irregular cycles, recent hormonal birth control, postpartum changes, illness, stress, or uncertain period dates can make the window less reliable.'
    : isPeriodCalculator
      ? 'Enter the first day of the last period, your usual cycle length from one period start to the next, and period length in bleeding days. Use the start date, not the last day of bleeding. If cycles vary, use a recent average and read the answer as a planning estimate for regular-ish cycles.'
    : isPregnancyWeightGainCalculator
      ? 'Enter pre-pregnancy height and weight, current weight, and the pregnancy week. This calculator uses singleton pregnancy guideline ranges based on pre-pregnancy BMI. If you are carrying twins or more, have a high-risk pregnancy, have fluid retention, or were given a personal target by your care team, use that clinical guidance instead of this general estimate.'
    : 'Enter the body, activity, date, or lab values exactly in the units shown on the page. Height, weight, age, sex, time, and activity level can change health estimates a lot, so treat each label like a rule instead of a suggestion. If you are unsure which option fits, choose the closest honest match and read the result as a rough estimate.';
  const readingAnswer = isBmiCalculator
    ? 'Read BMI as a quick adult screening number. It can miss important context such as pregnancy, high muscle mass, waist size, body composition, age, medical history, and ethnicity. Use it as a clue, not a final health answer.'
    : isUnderweightBmiCalculator
      ? 'Read the answer as an adult BMI screening check, not a diagnosis or a personal weight goal. The category line compares BMI with the underweight threshold below 18.5, and the "To BMI 18.5" line shows how far the entered weight is from that reference boundary. Real health context still depends on symptoms, history, age, pregnancy status, eating patterns, medications, and professional care.'
    : isBodyFatCalculator
      ? 'Read the percentage as a Navy-style tape-method estimate, then use fat mass and lean mass as context if you entered weight. Small changes can come from tape placement, posture, breathing, or tension, so this is better for consistent trend checks than one-time diagnosis.'
    : isArmyBodyFatCalculator
      ? 'Read the rounded percentage as an educational one-site tape estimate. The reference limit line uses the Army age-group table for context, but this website is not an official Army record, DA Form 5500/5501 entry, waiver, flagging decision, or medical assessment.'
    : isBmrCalculator
      ? 'Read BMR as an estimated resting-energy number in kcal per day. It is lower than total daily needs for most adults because it does not include walking, work, exercise, or daily movement. Use the sedentary and moderate TDEE lines as context before making calorie plans.'
    : isLeanBodyMassCalculator
      ? 'Read lean body mass as a Boer formula estimate of fat-free mass. It includes muscle, bone, organs, and water, so it is not muscle mass only. The estimated fat mass and lean percent are rough comparisons, not a scan or diagnosis.'
    : isTargetHeartRateCalculator
      ? 'Read a target-zone answer as an estimated training range, not a perfect target you must hit. Read a pulse-to-BPM answer as a quick manual count that can vary with timing and rhythm. If exercise feels unsafe or a clinician gave you a different limit, use the safer guidance.'
    : isBodySurfaceAreaCalculator
      ? 'Read BSA as an estimated body surface area in square meters. The Mosteller and Du Bois lines can differ slightly because they are different formulas. Use the number as clinical math context only, not as a medication dose, diagnosis, burn estimate, or treatment plan.'
    : isBacCalculator
      ? 'Read BAC as a rough educational estimate for the inputs you typed, not as a legal, medical, workplace, or driving decision. Real BAC can differ because food, drinking speed, medications, tolerance, health, body composition, and test timing all matter.'
    : isCalorieCalculator
      ? 'Read the answer as an estimated daily calorie target for the inputs and goal you selected. It is not a medical diet order, pregnancy plan, eating-disorder recovery target, sports-fueling prescription, or promise of weight change. Compare it with real-world trends and qualified guidance before making major nutrition changes.'
    : isCaloriesBurnedCalculator
      ? 'Read total session calories as the gross estimate, including the energy your body would have used at rest during those minutes. Active calories above rest subtract a 1-MET baseline. Both are rough activity estimates, not a lab measurement, wearable calibration, diet permission, injury advice, or exact energy-balance number.'
    : isOneRepMaxCalculator
      ? 'Read the Epley estimate as the main training estimate and the Brzycki line as a comparison. If the formulas disagree, treat the gap as uncertainty. Use the number for planning percentages, not as proof that a heavy single is safe today.'
    : isMacroCalculator
      ? 'Read the macro grams as daily planning targets for the calorie target and split you entered. Protein and carbohydrate use 4 calories per gram, and fat uses 9 calories per gram. The calculator does not judge food quality, build a meal plan, set a medical nutrition target, or guarantee body-composition change.'
    : isNutritionPointsCalculator
      ? 'Read the points as a rough label-comparison score, not a food grade or diet-program target. Lower points usually means the food scored lighter by this formula. The moderation line shows points added by calories, saturated fat, added sugar, and sodium; the support-credit line shows what fiber and protein subtracted.'
    : isCarbohydrateCalculator
      ? 'Read the answer as total carbohydrate grams for the calorie target and percent you entered. It does not grade food quality, count fiber separately, set a diabetes plan, set a sports-fueling plan, or tell you how your blood sugar will respond.'
    : isProteinCalculator
      ? 'Read the answer as daily protein grams for the body weight and g/kg factor you selected. The protein-calorie line uses 4 kcal per gram. Higher targets can be appropriate for some active people, but the calculator does not know your age, kidney health, pregnancy or lactation status, medical history, total calories, food quality, or dietitian plan.'
    : isFatIntakeCalculator
      ? 'Read the answer as total dietary fat grams for the calorie target and percent you entered. It does not judge food quality, split saturated versus unsaturated fat, set a medical nutrition plan, or tell you anything about body-fat percentage.'
    : isTdeeCalculator
      ? 'Read TDEE as estimated maintenance calories per day for the inputs and activity factor you chose. It is not a promised weight-change number, medical diet order, pregnancy plan, eating-disorder recovery plan, or exact metabolism measurement. Real-world trends can move the useful target up or down.'
    : isGfrCalculator
      ? 'Read eGFR as an adult kidney-filtration estimate in mL/min/1.73 m2. The range label is context only. Kidney disease, medication dosing, and next steps depend on repeat labs, urine albumin, symptoms, diagnosis, age, pregnancy status, body size, and clinician review.'
    : isPregnancyCalculator
      ? 'Read the due date as an estimated delivery date from calendar math, not a guarantee of when birth will happen. Gestational age is counted from LMP, so it is usually about two weeks more than conception age. The conception and trimester lines are planning references, and an early ultrasound or clinician review can update the official date.'
    : isDueDateCalculator
      ? 'Read the due date as an estimated delivery date from LMP calendar math, not a guarantee of when birth will happen. The gestational-age, conception, and trimester lines are planning references only. An early ultrasound, IVF date, or clinician review can override the calculator.'
    : isPregnancyConceptionCalculator
      ? 'Read the center date as a backward estimate from the due date, not proof of the exact day conception happened. The possible window is more honest than a single day because ovulation, fertilization, sperm survival, ultrasound dating, and due-date assumptions can all shift the real timing.'
    : isOvulationCalculator
      ? 'Read the ovulation date as the center of a calendar estimate, not proof that ovulation will happen that day. The fertile window is the five days before estimated ovulation through ovulation day because sperm can survive for several days and the egg survives for about a day after release.'
    : isConceptionCalculator
      ? 'Read the answer as an ovulation-based conception estimate, not proof of an exact day, intercourse date, or biological parent. The fertile window is more useful than the center date because sperm may survive for several days, the egg survives for about a day after ovulation, and ovulation can shift from the calendar estimate.'
    : isPeriodCalculator
      ? 'Read the next start, expected end, following period, and third period as calendar estimates. The calculator keeps adding cycle length until it reaches the next predicted start in the future, then uses period length only to estimate the end date. Stress, illness, medication changes, postpartum changes, travel, and normal variation can move real dates.'
    : isPregnancyWeightGainCalculator
      ? 'Read the total range as a prenatal-care reference, not a grade or diet rule. Healthy gain can be uneven by week, and your care team may care more about fetal growth, blood pressure, swelling, nausea, diabetes, or other medical details than the calculator line alone.'
    : 'Use the result as a learning number, not a final answer about your body or health. The supporting lines can show categories, ranges, calories, dates, or targets, but those numbers still need context like age, medical history, pregnancy status, training level, and advice from a qualified professional.';
  const doubleCheckAnswer = isNutritionPointsCalculator
    ? 'Check that all numbers come from the same serving size and that sodium is in milligrams while fats, sugars, fiber, and protein are in grams. A common mistake is using total sugar instead of added sugar, or comparing one whole package with one serving.'
    : isUnderweightBmiCalculator
      ? 'Check that height is in centimeters, weight is in kilograms, and the page is being used for an adult BMI screen. Do not use the "To BMI 18.5" line as a self-directed weight target, and do not use BMI to diagnose anorexia, malnutrition, or recovery status.'
    : isOneRepMaxCalculator
      ? 'Check that the weight is in kilograms, the reps were completed with clean form, and the set was not a failure-heavy or assisted set. One accidental unit swap, partial rep, or high-rep endurance set can make the estimate look more precise than it really is.'
    : isOvulationCalculator
      ? 'Check that the date is the first day bleeding started, that cycle length means period start to next period start, and that luteal phase is in days. Do not enter period length, suspected ovulation date, or a positive test date into the last-period field.'
    : isPeriodCalculator
      ? 'Check that the date is the first day bleeding started, that cycle length means start-to-start, and that period length means the number of bleeding days. Do not enter an ovulation date, expected end date, positive test date, or cycle-day number into the last-period field.'
    : isProteinCalculator
      ? 'Check that body weight is in kilograms and that the selected factor is grams per kilogram, not grams per pound. If you have kidney disease, pregnancy or lactation needs, an eating-disorder history, a clinician protein limit, or a registered dietitian target, use that personal guidance instead of a generic preset.'
    : isCaloriesBurnedCalculator
      ? 'Check the activity description, MET value, weight unit, and active minutes. Do not enter pounds while kilograms is selected, count rest breaks as active time, or compare the total-session estimate from this page with a wearable active-calorie number as if they use the same definition.'
    : isTargetHeartRateCalculator
      ? 'For a zone estimate, check age, selected intensity, and whether resting heart rate was entered. For pulse to BPM, count whole beats and choose the exact time you used. Repeat a manual count when timing or rhythm was unclear.'
    : 'Check the units, date, and personal details before reading the answer. For example, pounds and kilograms, inches and centimeters, or a wrong activity level can change the result quickly. If the number feels surprising, rerun it slowly and compare it with the examples.';

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
      answer: doubleCheckAnswer,
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
    seoTitle: 'Underweight BMI Calculator | Adult BMI 18.5 Screen',
    seoDescription:
      'Check adult BMI against the underweight threshold below 18.5, see the distance to BMI 18.5, and read safer eating-disorder limits.',
    aliases: [
      'adult underweight bmi calculator',
      'bmi 18.5 calculator',
      'underweight bmi screen',
      'low bmi calculator',
      'safe anorexic bmi alternative',
    ],
    icon: 'calculator-underweight-bmi',
    formula:
      'BMI is weight in kilograms divided by height in meters squared. The calculator compares the result with the adult underweight threshold below 18.5 and shows the BMI 18.5 to 24.9 reference range for the same height.',
    caution:
      'BMI cannot diagnose anorexia, malnutrition, or any eating disorder. If eating, weight, exercise, or body image feels hard to control, talk with a qualified health professional.',
    useCases: [
      'Check whether an adult BMI is below 18.5.',
      'See how far the entered weight is from the BMI 18.5 reference threshold.',
      'Read why BMI alone cannot diagnose an eating disorder.',
      'Use a safer alternative to harmful anorexic-BMI style pages.',
    ],
    examples: [
      { label: 'Underweight screen', expression: '170 cm, 50 kg', result: 'BMI about 17.3; about 3.5 kg to BMI 18.5' },
      { label: 'Near threshold', expression: '160 cm, 47 kg', result: 'BMI about 18.4; about 0.4 kg to BMI 18.5' },
      { label: 'At threshold', expression: '183 cm, 62 kg', result: 'BMI about 18.5; already at the 18.5 boundary' },
      { label: 'Healthy-range reference', expression: '170 cm, 54 kg', result: 'BMI about 18.7; above the underweight threshold' },
    ],
    extraFaq: [
      {
        question: 'Does BMI below 18.5 mean I have anorexia?',
        answer:
          'No. BMI below 18.5 is an adult screening category, not an anorexia diagnosis. Eating disorders are diagnosed from a bigger clinical picture, including behavior, distress, medical signs, and professional assessment.',
      },
      {
        question: 'What does "To BMI 18.5" mean?',
        answer:
          'It shows the difference between the entered weight and the weight that would put the same height at BMI 18.5. Treat it as a reference boundary, not a personal target or treatment plan.',
      },
      {
        question: 'Can children, teens, pregnant people, or athletes use this the same way?',
        answer:
          'No. Children and teens use BMI-for-age percentiles, pregnancy changes weight for a different reason, and athletes may have body composition that BMI cannot explain. Use qualified guidance for those situations.',
      },
      {
        question: 'When is this calculator not enough?',
        answer:
          'A calculator is not enough if eating, exercise, body image, weight change, dizziness, fainting, missed periods, chest pain, or weakness feels hard to manage. Use qualified medical or mental-health support instead of relying on a BMI label.',
      },
      {
        question: 'Why does this page avoid "anorexic BMI" wording?',
        answer:
          'BMI alone cannot diagnose anorexia or any eating disorder, and turning a low BMI into a target can be harmful. This page uses underweight-screening language and points back to professional support.',
      },
      {
        question: 'Can someone need help if BMI is not underweight?',
        answer:
          'Yes. Eating disorders and nutrition problems can exist at many body sizes. If eating, restriction, purging, over-exercise, or body image is causing distress, the BMI number should not be used as reassurance by itself.',
      },
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
    seoTitle: 'Nutrition Points Calculator | Transparent Food Label Score',
    seoDescription:
      'Compare one-serving Nutrition Facts labels with a transparent points score from calories, saturated fat, added sugar, sodium, fiber, and protein.',
    aliases: [
      'food points calculator',
      'nutrition label points calculator',
      'transparent nutrition score calculator',
      'food label score calculator',
      'healthy food points calculator',
    ],
    icon: 'calculator-nutrition-points',
    formula:
      'Moderation points = calories / 50 + saturated fat g x 1.5 + added sugar g / 5 + sodium mg / 600. Support credits = fiber g x 0.6 + protein g x 0.25. Final points = moderation points minus support credits, with a minimum of 0.',
    caution:
      'This is not Weight Watchers Points, not affiliated with WW, and not medical nutrition advice. It is a transparent educational score for rough same-serving food-label comparisons.',
    useCases: [
      'Compare two packaged foods using the same label-based score.',
      'See how added sugar, saturated fat, sodium, fiber, and protein change a food score.',
      'Use a non-proprietary alternative to branded points calculators.',
      'Practice reading Nutrition Facts labels more carefully.',
    ],
    examples: [
      {
        label: 'Snack label',
        expression: '240 kcal, 2 g sat fat, 8 g added sugar, 320 mg sodium, 5 g fiber, 9 g protein',
        result: 'About 4.68 points, moderate',
      },
      {
        label: 'Greek yogurt',
        expression: '150 kcal, 0 g sat fat, 4 g added sugar, 75 mg sodium, 0 g fiber, 15 g protein',
        result: 'About 0.18 points, lower',
      },
      {
        label: 'Sweet drink',
        expression: '180 kcal, 0 g sat fat, 38 g added sugar, 40 mg sodium, 0 g fiber, 0 g protein',
        result: 'About 11.27 points, higher',
      },
      {
        label: 'High-fiber cereal',
        expression: '210 kcal, 0.5 g sat fat, 6 g added sugar, 190 mg sodium, 8 g fiber, 6 g protein',
        result: 'About 0.17 points, lower',
      },
    ],
    extraFaq: [
      {
        question: 'Is this the same as Weight Watchers Points?',
        answer:
          'No. This is an original Access Free Tools label-reading score. It is not the WW formula, not affiliated with Weight Watchers or WW, and should not be compared with any proprietary program target.',
      },
      {
        question: 'What makes points go up or down?',
        answer:
          'Calories, saturated fat, added sugar, and sodium increase the score. Dietary fiber and protein subtract support credits. The final score never goes below 0 because a rough food-label score should not create negative points.',
      },
      {
        question: 'What do lower, moderate, and higher points mean?',
        answer:
          'Lower points means less than 3 by this formula. Moderate points means 3 to less than 7. Higher points means 7 or more. These labels are comparison hints, not a medical diet judgment.',
      },
      {
        question: 'Should I enter total sugar or added sugar?',
        answer:
          'Use added sugar. The Nutrition Facts label can show total sugars and added sugars separately, and this score asks for added sugar because it is the field the formula uses.',
      },
      {
        question: 'Why does serving size matter so much?',
        answer:
          'The score uses one serving. If one package has two servings, entering the whole package for one food and one serving for another will make the comparison unfair. Match serving sizes before deciding which score is lighter.',
      },
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
    summary: 'Estimate total and active exercise calories from MET, weight, and time.',
    description:
      'Use this free calories burned calculator with 2024 Compendium activities or a custom MET, body weight in kg or lb, and active time.',
    seoTitle: 'Calories Burned Calculator | MET, kg & lb',
    seoDescription:
      'Estimate calories burned with 2024 Compendium MET values, body weight in kg or lb, and time. Compare total session and active calories above rest.',
    aliases: [
      'exercise calorie calculator',
      'workout calorie calculator',
      'MET calorie calculator',
      'activity calorie calculator',
      'calories burned walking calculator',
    ],
    icon: 'calculator-calories-burned',
    formula:
      'Total session calories = MET x 3.5 x body weight in kg / 200 x minutes. Active calories above rest use the same equation with MET minus 1 because 1 MET represents the resting baseline. Pounds are converted to kilograms first.',
    caution:
      'This is an educational activity-energy estimate, not a lab measurement, medical exercise prescription, injury guidance, wearable calibration, or exact calorie-balance plan. The built-in activity values come from the 2024 Adult Compendium for adults ages 19-59.',
    useCases: [
      'Estimate total session calories for common exercise, sport, home, and garden activities.',
      'Compare total session calories with active calories above the 1-MET resting baseline.',
      'Use body weight in kilograms or pounds and a current 2024 Compendium activity value.',
      'Enter a custom MET when a closer activity description comes from an appropriate Compendium table.',
    ],
    examples: [
      {
        label: 'Brisk level walk',
        expression: '4.8 MET, 70 kg, 45 active min',
        result: 'About 265 kcal total session; about 209 kcal active above rest',
      },
      {
        label: 'Running near 6 mph',
        expression: '9.3 MET, 176 lb, 30 active min',
        result: 'About 390 kcal total session; about 348 kcal active above rest',
      },
      {
        label: 'General house cleaning',
        expression: '3.3 MET, 154 lb, 60 active min',
        result: 'About 242 kcal total session; about 169 kcal active above rest',
      },
    ],
    extraFaq: [
      {
        question: 'What MET values are available in this calories burned calculator?',
        answer:
          'The activity list includes 20 examples from the 2024 Adult Compendium, including walking by pace, hiking, cycling, weight training, yoga, jogging, running, swimming, cleaning, gardening, soccer, and basketball. Use Custom MET when the Compendium has a closer description for your activity.',
      },
      {
        question: 'What is the difference between total and active calories?',
        answer:
          'Total session calories use the full MET value and include the resting energy your body would use during the same minutes. Active calories above rest subtract a 1-MET baseline. A watch or exercise machine may show either definition, so check its label before comparing numbers.',
      },
      {
        question: 'Is MET x 3.5 x body weight / 200 a CDC calorie formula?',
        answer:
          'The CDC explains MET intensity, including 1 MET at rest, 3 to 5.9 MET as moderate, and 6 or more as vigorous. Its cited intensity page does not publish this exact personal calorie equation. This calculator uses the common MET energy estimate and activity values from the 2024 Adult Compendium instead of calling it a CDC calorie formula.',
      },
      {
        question: 'Can I use pounds in the calories burned formula?',
        answer:
          'Yes. Choose pounds and enter body weight normally. The calculator converts pounds to kilograms with 1 lb = 0.45359237 kg before applying the MET formula, then shows the converted weight in the result.',
      },
      {
        question: 'Are the built-in MET values right for every person?',
        answer:
          'No. The built-in list uses the 2024 Adult Compendium for adults ages 19-59. Separate Compendia exist for older adults and wheelchair users, and youth use a Youth Compendium. Fitness, efficiency, terrain, heat, breaks, and health can still change real energy use.',
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
      'Use this free one rep max calculator to estimate 1RM from a clean rep set with Epley and Brzycki formulas for strength training.',
    seoTitle: 'One Rep Max Calculator | Epley and Brzycki 1RM',
    seoDescription:
      'Estimate one-rep max from weight lifted and reps completed, compare Epley and Brzycki formulas, and use 80% training load context safely.',
    aliases: ['1rm calculator', 'one rep max calculator', 'epley calculator', 'brzycki calculator', 'strength max calculator'],
    icon: 'calculator-one-rep-max',
    formula:
      'Epley estimate = weight x (1 + reps / 30). Brzycki estimate = weight x 36 / (37 - reps), with the lifted weight used directly for a single rep. The page also shows 80% of the Epley estimate as training-load context.',
    caution:
      'This is training math, not a safety guarantee or coaching plan. Do not attempt heavy max lifts without appropriate technique, equipment, warm-up, spotter or safety setup, and supervision when needed.',
    useCases: [
      'Estimate a one-rep max without testing a true max.',
      'Compare Epley and Brzycki estimates.',
      'Plan training percentages from a recent rep set.',
      'Track strength changes over time.',
    ],
    examples: [
      { label: 'Bench example', expression: '100 kg x 5', result: 'Epley about 116.67 kg; Brzycki about 112.5 kg' },
      { label: 'Squat example', expression: '140 kg x 3', result: 'Epley about 154 kg; Brzycki about 148.24 kg' },
      { label: 'Volume set', expression: '60 kg x 8', result: 'Epley about 76 kg; Brzycki about 74.48 kg' },
      { label: 'Deadlift double', expression: '180 kg x 2', result: 'Epley about 192 kg; Brzycki about 185.14 kg' },
    ],
    extraFaq: [
      {
        question: 'Which one-rep max formula should I trust?',
        answer:
          'Use Epley as the main estimate on this page and Brzycki as a comparison. If they are close, the estimate is more stable. If they are far apart, treat the range as uncertainty instead of chasing one exact number.',
      },
      {
        question: 'Why does the calculator limit reps to 30 or fewer?',
        answer:
          'Very high-rep sets measure endurance, pacing, and fatigue as much as max strength. The calculator stops at 30 reps so the answer stays in a practical strength-estimate range.',
      },
      {
        question: 'Should I use a failed rep or assisted rep?',
        answer:
          'No. Use only reps you completed with your own effort and clean form. Failed reps, forced reps, bouncing, shortened range of motion, or uneven technique can inflate the estimate.',
      },
      {
        question: 'What does the 80% training range mean?',
        answer:
          'It is 80% of the Epley estimate, shown as a planning reference. It is not a required workout weight, beginner program, injury advice, or a guarantee that the load is safe for you.',
      },
      {
        question: 'Why are Epley and Brzycki different?',
        answer:
          'They are different equations built from the same weight-and-reps idea. The difference reminds you that predicted 1RM is an estimate, especially when reps get higher.',
      },
      {
        question: 'When should I avoid using a one-rep max estimate?',
        answer:
          'Avoid relying on it by itself if you are injured, new to lifting, returning after time off, lifting without safe equipment, or working under a coach, clinician, or rehab plan with different limits.',
      },
    ],
    relatedSlugs: ['calories-burned-calculator', 'target-heart-rate-calculator', 'protein-calculator'],
  }),
  makeHealthTool({
    slug: 'target-heart-rate-calculator',
    name: 'Target Heart Rate Calculator',
    summary: 'Estimate target heart-rate zones by age or turn a timed pulse count into BPM.',
    description:
      'Compare moderate and vigorous heart-rate zones by age, add resting pulse for heart-rate reserve, or convert a 10, 15, 30, or 60-second pulse count to BPM.',
    seoTitle: 'Target Heart Rate Calculator by Age and Zone',
    seoDescription:
      'Calculate target heart-rate zones by age, compare moderate and vigorous ranges, or turn a 10, 15, 30, or 60-second pulse count into BPM.',
    aliases: [
      'heart rate zone calculator',
      'heart rate calculator',
      'target heart rate calculator by age',
      'BPM calculator',
      'beats per minute calculator',
      'pulse rate calculator',
    ],
    icon: 'calculator-target-heart',
    formula:
      'Target zones use estimated maximum heart rate = 220 - age, then multiply by 50-70% for moderate effort or 70-85% for vigorous effort. Pulse to BPM uses beats counted x 60 / count seconds. Optional resting pulse adds a heart-rate-reserve comparison.',
    caution:
      'These are quick exercise and pulse estimates, not medical advice or an irregular-rhythm diagnosis. Ask a clinician what limit to use if you have a heart condition, take medication that affects pulse, are pregnant, or feel chest pain, dizziness, faintness, or unusual shortness of breath.',
    useCases: [
      'Estimate moderate-intensity heart-rate range.',
      'Estimate vigorous-intensity heart-rate range.',
      'Compare simple max-heart-rate and heart-rate-reserve methods.',
      'Convert a timed manual pulse count into beats per minute.',
    ],
    examples: [
      { label: 'Age 35', expression: '50-85% zone', result: '93-157 bpm from an estimated 185 bpm max' },
      { label: 'Age 50', expression: 'Moderate 50-70%', result: '85-119 bpm from an estimated 170 bpm max' },
      { label: 'Resting HR included', expression: 'Age 35, resting 65, 50-85%', result: '125-167 bpm heart-rate reserve range' },
      { label: '30-second pulse count', expression: '36 beats x 2', result: '72 bpm' },
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
        question: 'How do I calculate BPM from a pulse count?',
        answer:
          'Count whole pulse beats for a timed window, then multiply by 60 divided by the number of seconds. For example, 36 beats in 30 seconds uses a multiplier of 2, so the result is 72 bpm.',
      },
      {
        question: 'Is a 10-second or 30-second pulse count better?',
        answer:
          'A longer count usually reduces the effect of one missed or extra beat. The American Heart Association gives a 30-second count multiplied by 2 as a manual check. Repeat the count or seek medical advice if the rhythm seems irregular.',
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
      'Use this free due date calculator to estimate expected delivery date from the first day of the last menstrual period and usual cycle length, with conception timing and clinical-dating limits.',
    seoTitle: 'Due Date Calculator | LMP Pregnancy Date Estimate',
    seoDescription:
      'Estimate pregnancy due date from LMP and cycle length. See the 280-day formula, conception timing, gestational age, examples, and ultrasound limits.',
    aliases: [
      'Pregnancy Due Date Calculator',
      'EDD Calculator',
      'LMP Due Date Calculator',
      'Pregnancy Date Calculator',
      'Estimated Delivery Date Calculator',
    ],
    icon: 'calculator-due-date',
    formula:
      'The calculator uses Naegele-style dating: due date = first day of LMP + 280 days + (cycle length - 28 days). It estimates conception near LMP + cycle length - 14 days and counts gestational age from LMP to today.',
    caution:
      'This calculator gives an educational pregnancy-date estimate only. It is not prenatal care, ultrasound dating, IVF dating, labor guidance, emergency advice, paternity proof, or clinician advice.',
    useCases: [
      'Estimate an expected due date from the first day of the last menstrual period.',
      'Adjust the due-date estimate for shorter or longer usual cycle length.',
      'See estimated conception timing, gestational age today, and trimester context.',
      'Use a simple planning date before clinical dating is confirmed.',
    ],
    examples: [
      { label: 'LMP Apr 1, 2026', expression: '28-day cycle: Apr 1 + 280 days', result: 'Estimated due Jan 6, 2027; conception around Apr 15' },
      { label: 'LMP Feb 14, 2026', expression: '32-day cycle: add 284 days', result: 'Estimated due Nov 25, 2026; conception around Mar 4' },
      { label: 'LMP May 5, 2026', expression: '26-day cycle: add 278 days', result: 'Estimated due Feb 7, 2027; conception around May 17' },
      { label: 'LMP Jun 10, 2026', expression: '35-day cycle: add 287 days', result: 'Estimated due Mar 24, 2027; conception around Jul 1' },
    ],
    extraFaq: [
      {
        question: 'Why does the due date calculator add 280 days?',
        answer:
          'A common LMP-based pregnancy estimate counts about 280 days, or 40 weeks, from the first day of the last menstrual period. That is gestational-age dating, so it starts before estimated conception.',
      },
      {
        question: 'Why does cycle length change the due date?',
        answer:
          'Cycle length shifts the estimated ovulation timing. A 32-day cycle moves the estimate about four days later than a 28-day cycle, while a 26-day cycle moves it about two days earlier. Irregular cycles make calendar dating less reliable.',
      },
      {
        question: 'Should I enter the first or last day of my period?',
        answer:
          'Enter the first day bleeding started for the last menstrual period. The formula is built around the period start date, not the last bleeding day, ovulation day, positive test date, or appointment date.',
      },
      {
        question: 'Is the estimated due date guaranteed?',
        answer:
          'No. It is a planning estimate. Many healthy pregnancies deliver before or after the due date, and medical details can change how your care team interprets timing.',
      },
      {
        question: 'When should ultrasound, IVF, or clinician dating override this calculator?',
        answer:
          'Use the official date from your care team when one has been assigned, especially after early ultrasound, IVF transfer dating, uncertain LMP, irregular cycles, multiples, bleeding that may not have been a true period, or medical concerns.',
      },
      {
        question: 'Can this prove the exact conception date or parentage?',
        answer:
          'No. The conception line is an estimate near ovulation, not proof of an exact day, intercourse date, or parentage. Ovulation shifts, sperm survival, fertilization timing, and dating uncertainty all matter.',
      },
    ],
    relatedSlugs: ['pregnancy-calculator', 'pregnancy-conception-calculator', 'ovulation-calculator'],
  }),
  makeHealthTool({
    slug: 'ovulation-calculator',
    name: 'Ovulation Calculator',
    summary: 'Estimate ovulation date and fertile window from cycle details.',
    description:
      'Use this free ovulation calculator to estimate ovulation date, fertile window, and next period from last period and cycle length.',
    seoTitle: 'Ovulation Calculator | Fertile Window and Next Period',
    seoDescription:
      'Estimate ovulation date, fertile window, and next period from last period, cycle length, and luteal phase. Learn why calendar estimates can shift.',
    aliases: ['fertile window calculator', 'ovulation date calculator', 'cycle ovulation calculator', 'luteal phase calculator'],
    icon: 'calculator-ovulation',
    formula:
      'The calculator estimates next period as last period date plus cycle length, estimates ovulation as next period minus luteal phase length, and shows the fertile window as the five days before ovulation through ovulation day.',
    caution: estimateCaution,
    useCases: [
      'Estimate ovulation for regular cycles.',
      'See the fertile window around ovulation.',
      'Plan cycle tracking with a luteal phase assumption.',
      'Avoid using calendar estimates as contraception.',
    ],
    examples: [
      { label: '28-day cycle', expression: 'LMP Apr 1, 2026, cycle 28, luteal 14', result: 'Ovulation Apr 15; fertile window Apr 10-Apr 15; next period Apr 29' },
      { label: '30-day cycle', expression: 'LMP Apr 4, 2026, cycle 30, luteal 14', result: 'Ovulation Apr 20; fertile window Apr 15-Apr 20; next period May 4' },
      { label: '26-day cycle', expression: 'LMP Apr 10, 2026, cycle 26, luteal 12', result: 'Ovulation Apr 24; fertile window Apr 19-Apr 24; next period May 6' },
      { label: 'Fertile window', expression: 'Five days before ovulation through ovulation day', result: 'Planning window, not a guarantee' },
    ],
    extraFaq: [
      {
        question: 'Why does the calculator ask for luteal phase?',
        answer:
          'The luteal phase is the part of the cycle after ovulation and before the next period. Many quick calendars assume 14 days, but some people track a different pattern. The calculator subtracts that number from the expected next period to estimate ovulation.',
      },
      {
        question: 'What if my cycles are irregular?',
        answer:
          'Calendar estimates are less reliable when cycles vary a lot, periods are missing, you recently stopped hormonal birth control, you are postpartum, or illness, stress, travel, or medication changed the cycle. Use the result as a rough planning note, not proof.',
      },
      {
        question: 'Is the fertile window the same as ovulation day?',
        answer:
          'No. Ovulation day is the estimated egg-release day. The fertile window is wider because sperm can survive for several days before ovulation and the egg survives for about a day after ovulation.',
      },
      {
        question: 'Can I use this calculator as contraception?',
        answer:
          'No. A simple calendar estimate is not reliable contraception by itself. If preventing pregnancy matters, use evidence-based contraception guidance from a qualified health professional.',
      },
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
      'Use this free period calculator to estimate the next period start, expected end, and upcoming cycle dates from last period date, cycle length, and period length.',
    seoTitle: 'Period Calculator | Next Period Date Estimate',
    seoDescription:
      'Estimate your next period start, expected end, following period, and third period from last period date, cycle length, and period length.',
    aliases: [
      'Next Period Calculator',
      'Period Date Calculator',
      'Menstrual Cycle Calculator',
      'Cycle Length Calculator',
      'Period Tracker Calculator',
    ],
    icon: 'calculator-period',
    formula:
      'Next period start = last period start plus cycle length. If that predicted start is not in the future, the calculator keeps adding cycle length until it reaches the next upcoming start. Expected end = next period start plus period length minus 1 day. Following periods add cycle length again.',
    caution:
      'This is an educational calendar estimate, not medical advice, contraception, a fertility test, a pregnancy test, or a diagnosis for late, missed, heavy, painful, or irregular periods.',
    useCases: [
      'Estimate the next upcoming period start date from an older or recent last-period entry.',
      'Estimate the expected end date from period length.',
      'List following period dates for planning reminders, travel, or appointments.',
      'Check start-to-start cycle math without using it as contraception or diagnosis.',
    ],
    examples: [
      { label: '28-day cycle', expression: 'LMP Apr 1, 2026, cycle 28, period length 5', result: 'Next start Apr 29; expected end May 3; following start May 27' },
      { label: '30-day cycle', expression: 'LMP Apr 5, 2026, cycle 30, period length 6', result: 'Next start May 5; expected end May 10; following start Jun 4' },
      { label: '26-day cycle', expression: 'LMP Apr 12, 2026, cycle 26, period length 4', result: 'Next start May 8; expected end May 11; following start Jun 3' },
      { label: 'Old last-period entry', expression: 'A past predicted start has already gone by', result: 'The live result keeps adding cycle length until the next predicted start is upcoming' },
    ],
    extraFaq: [
      {
        question: 'Why does the Period Calculator skip ahead from an older last period?',
        answer:
          'The live result is meant to show the next upcoming predicted start. If the first cycle after the last period is already in the past, the calculator keeps adding the cycle length until the predicted start is still ahead of today.',
      },
      {
        question: 'Should I count from period start or period end?',
        answer:
          'Use period start to period start. Cycle length means the number of days from the first day of one period to the first day of the next. Period length means how many bleeding days to use when estimating the expected end date.',
      },
      {
        question: 'Why does period length change the end date but not the next start?',
        answer:
          'Cycle length controls the next start date. Period length only estimates the expected end by counting from the predicted start. A longer period does not automatically mean the next cycle starts later.',
      },
      {
        question: 'What if my cycles are irregular?',
        answer:
          'Use the result as a rough planning note only. Calendar predictions are less reliable when cycle length changes a lot, periods are missing, birth control recently changed, postpartum cycles are returning, or stress, illness, travel, or medication affects timing.',
      },
      {
        question: 'Can I use period prediction as contraception?',
        answer:
          'No. Period prediction is not contraception and does not confirm ovulation. If pregnancy prevention matters, use a reliable contraceptive method and qualified medical guidance instead of a calendar estimate.',
      },
      {
        question: 'What if my period is late or missing?',
        answer:
          'This calculator cannot diagnose pregnancy, hormone changes, stress effects, illness, medication effects, or other causes of a late or missing period. Consider an appropriate pregnancy test or qualified care if the timing matters or symptoms are concerning.',
      },
    ],
    relatedSlugs: ['ovulation-calculator', 'conception-calculator', 'due-date-calculator'],
  }),
  makeHealthTool({
    slug: 'macro-calculator',
    name: 'Macro Calculator',
    summary: 'Split daily calories into protein, fat, and carbohydrate grams.',
    description:
      'Use this free macro calculator to convert daily calories and a macro split into protein, fat, and carbohydrate grams, with formula steps and nutrition limits.',
    seoTitle: 'Macro Calculator | Protein Fat Carb Grams',
    seoDescription:
      'Convert calories and macro percentages into daily protein, fat, and carbohydrate grams. See the 4/9 calorie formula, examples, and nutrition limits.',
    aliases: [
      'Macronutrient Calculator',
      'Macro Split Calculator',
      'Protein Fat Carb Calculator',
      'Calories to Macros Calculator',
      'Macro Grams Calculator',
    ],
    icon: 'calculator-macro',
    formula:
      'Protein grams = daily calories x protein percentage / 100 / 4. Carbohydrate grams = daily calories x carbohydrate percentage / 100 / 4. Fat grams = daily calories x fat percentage / 100 / 9. The macro percentages should add to 100.',
    caution:
      'This calculator gives an educational macro-gram estimate only. It is not medical nutrition therapy, diabetes care, eating-disorder treatment, a sports-fueling prescription, a pregnancy nutrition plan, or clinician advice.',
    useCases: [
      'Convert daily calories and macro percentages into grams.',
      'Compare balanced, higher-protein, lower-carb, and training-day splits.',
      'Check whether protein, fat, and carbohydrate percentages add up cleanly.',
      'Use with calorie, carbohydrate, protein, and fat calculators before planning meals.',
    ],
    examples: [
      { label: 'Balanced 2000 kcal', expression: '50% carbs, 20% protein, 30% fat', result: '250 g carbs, 100 g protein, about 66.7 g fat' },
      { label: 'Higher protein 2400 kcal', expression: '40% carbs, 30% protein, 30% fat', result: '240 g carbs, 180 g protein, 80 g fat' },
      { label: 'Lower carb 1800 kcal', expression: '25% carbs, 35% protein, 40% fat', result: '112.5 g carbs, 157.5 g protein, 80 g fat' },
      { label: 'Training day 2800 kcal', expression: '55% carbs, 25% protein, 20% fat', result: '385 g carbs, 175 g protein, about 62.2 g fat' },
    ],
    extraFaq: [
      {
        question: 'Why does the macro calculator divide protein and carbs by 4 and fat by 9?',
        answer:
          'Protein and carbohydrate each provide about 4 calories per gram, while fat provides about 9 calories per gram. The calculator turns each macro percentage into calories first, then divides by the matching calories-per-gram value.',
      },
      {
        question: 'Should the macro percentages add to 100?',
        answer:
          'Yes. Protein, fat, and carbohydrate percentages should describe the full calorie split, so they should add to 100. If they do not, the calculator cannot represent the whole calorie target cleanly.',
      },
      {
        question: 'Should I type 40 or 0.40 for 40%?',
        answer:
          'Type 40 for 40%. The percent boxes use normal percentages, so 0.40 would mean less than one percent and would make the gram target much smaller than intended.',
      },
      {
        question: 'Does this calculator set a weight-loss target?',
        answer:
          'No. It converts a calorie target into macro grams. If the calorie target is too high, too low, or not right for your body, the macro grams will inherit that problem.',
      },
      {
        question: 'Can this replace medical nutrition advice?',
        answer:
          'No. Macro math is not medical nutrition therapy. Diabetes care, kidney disease, pregnancy, eating-disorder recovery, sport fueling, digestive conditions, and medication-related nutrition questions need qualified guidance.',
      },
      {
        question: 'Why do the macro grams change when calories change?',
        answer:
          'The percentages are applied to the calorie target. For example, 30% protein at 2,000 calories is 150 g protein, while 30% protein at 2,400 calories is 180 g protein.',
      },
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
      'Use this free protein calculator to estimate daily protein grams from body weight and common grams-per-kilogram targets, with protein calories and nutrition-planning limits.',
    seoTitle: 'Protein Calculator | Grams Per Day Estimate',
    seoDescription:
      'Estimate daily protein grams from body weight and a g/kg target. See 0.8, 1.2, and 1.6 g/kg examples, protein calories, and nutrition limits.',
    aliases: [
      'Daily Protein Calculator',
      'Protein Intake Calculator',
      'Grams of Protein Calculator',
      'Protein Per Kg Calculator',
      'Protein Needs Calculator',
    ],
    icon: 'calculator-protein',
    formula:
      'Daily protein grams = body weight in kilograms x selected protein factor in grams per kilogram. Protein calories = daily protein grams x 4 kcal per gram.',
    caution:
      'This is educational nutrition planning math, not medical nutrition therapy, kidney disease advice, pregnancy or lactation nutrition advice, eating-disorder guidance, a muscle-gain guarantee, or a registered dietitian or clinician plan.',
    useCases: [
      'Estimate an RDA-style 0.8 g/kg adult protein reference from body weight.',
      'Compare 1.2 g/kg active and 1.6 g/kg strength-training planning targets.',
      'Convert body weight in kilograms to daily protein grams and protein calories.',
      'Use with calorie, macro, carbohydrate, and fat tools before building a meal plan.',
    ],
    examples: [
      { label: 'RDA-style 70 kg', expression: '70 kg x 0.8 g/kg', result: '56 g/day; 224 kcal from protein' },
      { label: 'Active 80 kg', expression: '80 kg x 1.2 g/kg', result: '96 g/day; 384 kcal from protein' },
      { label: 'Strength 75 kg', expression: '75 kg x 1.6 g/kg', result: '120 g/day; 480 kcal from protein' },
      { label: 'Larger body weight', expression: '90 kg x 0.8 g/kg', result: '72 g/day; 288 kcal from protein' },
    ],
    extraFaq: [
      {
        question: 'What does 0.8 g/kg mean in the Protein Calculator?',
        answer:
          'It means 0.8 grams of protein for each kilogram of body weight. For example, 70 kg x 0.8 g/kg = 56 g/day. Treat it as a general adult reference, not a personalized diet order.',
      },
      {
        question: 'What do the 1.2 g/kg and 1.6 g/kg presets mean?',
        answer:
          'They are simple planning factors for people comparing higher active or strength-training targets. They are not a sports nutrition prescription, muscle-gain guarantee, or proof that more protein is better for every body.',
      },
      {
        question: 'Can I enter pounds instead of kilograms?',
        answer:
          'No. This calculator asks for kilograms because the factor is grams per kilogram. To convert pounds to kilograms, divide pounds by about 2.20462, then enter the kilogram value.',
      },
      {
        question: 'Why does the calculator show calories from protein?',
        answer:
          'Protein provides about 4 calories per gram. The calculator multiplies the daily protein grams by 4 so you can compare the protein target with macro or calorie planning.',
      },
      {
        question: 'Should people with kidney disease use this target?',
        answer:
          'Not as personal advice. Kidney disease, dialysis, pregnancy, lactation, eating-disorder recovery, illness, surgery recovery, and clinician protein limits all need individualized medical or dietitian guidance.',
      },
      {
        question: 'Can I split the protein target across meals?',
        answer:
          'You can divide the daily gram target by meals as planning math, but the calculator does not decide meal timing, food quality, digestion, training recovery, or medical nutrition needs.',
      },
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
