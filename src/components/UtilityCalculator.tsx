import { useMemo, useState, type HTMLAttributes, type KeyboardEvent } from 'react';
import {
  calculateAge,
  calculateAiTokenCost,
  calculateApiPricing,
  calculateAsphaltEstimate,
  calculateBandwidthTime,
  calculateBoardFoot,
  calculateBraSize,
  calculateBrickEstimate,
  calculateBtuEstimate,
  calculateCarpetEstimate,
  calculateConcrete,
  calculateConcreteBlockEstimate,
  calculateCubicYardEstimate,
  calculateDayOfWeek,
  calculateDeckCostEstimate,
  calculateDensity,
  calculateDiceRoll,
  calculateDewPoint,
  calculateDrywallEstimate,
  calculateElectricityCost,
  calculateDateDifference,
  calculateDateShift,
  calculateDeviceBatteryLife,
  calculateDownloadTime,
  calculateFenceEstimate,
  calculateFlooringEstimate,
  calculateFuelCost,
  calculateGasMileage,
  calculateGdpEstimate,
  calculateGolfCourseHandicap,
  calculateGolfScoreDifferential,
  calculateGpa,
  calculateGravelEstimate,
  calculateHeatIndex,
  calculateHeightEstimate,
  calculateHoursWorked,
  calculateHorsepowerConversion,
  calculateAspectRatio,
  calculateColorContrast,
  calculateCssClamp,
  calculateDateFromUnixTimestamp,
  calculateLoveCompatibility,
  calculateMassFromDensity,
  calculateMileageCost,
  calculateMolarity,
  calculateMolecularWeight,
  calculateInternetSpeedNeeds,
  calculateMonitorPpi,
  calculateNeededFinalGrade,
  calculateOhmsLaw,
  calculateMulchEstimate,
  calculatePaintEstimate,
  calculatePaverEstimate,
  calculatePoolVolume,
  calculateRebarGridEstimate,
  calculateResistorColorCode,
  calculateRoofingEstimate,
  calculateSandEstimate,
  calculateSidingEstimate,
  calculateSleepSchedule,
  calculateSoilEstimate,
  calculateSpeed,
  calculateSquareFootage,
  calculateSubnet,
  calculateStairLayout,
  calculateTileEstimate,
  calculateTireSize,
  calculateTimeCard,
  calculateTimeDuration,
  calculateTimeZoneComparison,
  calculateUnixTimestampFromDate,
  calculateTip,
  calculateVoltageDrop,
  calculateWeightForce,
  calculateWallpaperEstimate,
  calculateWindChill,
  calculateEngineHorsepower,
  analyzeText,
  buildQueryStringFromLines,
  buildUtmUrl,
  convertMeasurement,
  convertShoeSize,
  convertTextCase,
  digestText,
  decodeHtmlEntities,
  decodeBase64,
  decodeUrlComponentValue,
  encodeHtmlEntities,
  encodeBase64,
  encodeUrlComponentValue,
  estimatePromptTokens,
  formatCalculatorNumber,
  formatJsonText,
  generateMarkdownTable,
  generateSlug,
  generatePassword,
  calculateStreamingBitrate,
  generateUuidBatch,
  parseQueryStringInput,
  getCopperResistanceOhmsPer1000Feet,
  numberToRomanNumeral,
  romanNumeralToNumber,
  type ConversionCategory,
  type GpaCourseInput,
  type HashAlgorithm,
  type HtmlEntityMode,
  type HorsepowerUnit,
  type MarkdownTableAlignment,
  type TextCaseMode,
  type TimeCardDayInput,
} from '../lib/calculator';

export type UtilityToolVariant =
  | 'age'
  | 'date'
  | 'time'
  | 'hours'
  | 'gpa'
  | 'grade'
  | 'concrete'
  | 'subnet'
  | 'password-generator'
  | 'conversion'
  | 'dice-roller'
  | 'fuel-cost'
  | 'square-footage'
  | 'time-card'
  | 'time-zone'
  | 'gas-mileage'
  | 'tip'
  | 'mileage'
  | 'density'
  | 'mass'
  | 'weight'
  | 'speed'
  | 'roman-numeral'
  | 'base64'
  | 'url-encode-decode'
  | 'day-of-week'
  | 'height'
  | 'bra-size'
  | 'voltage-drop'
  | 'btu'
  | 'stair'
  | 'resistor'
  | 'ohms-law'
  | 'electricity'
  | 'shoe-size'
  | 'molarity'
  | 'molecular-weight'
  | 'sleep'
  | 'tire-size'
  | 'roofing'
  | 'tile'
  | 'mulch'
  | 'gravel'
  | 'paint'
  | 'drywall'
  | 'carpet'
  | 'flooring'
  | 'wallpaper'
  | 'fence'
  | 'deck-cost'
  | 'paver'
  | 'siding'
  | 'brick'
  | 'concrete-block'
  | 'rebar'
  | 'board-foot'
  | 'cubic-yard'
  | 'pool-volume'
  | 'sand'
  | 'soil'
  | 'asphalt'
  | 'wind-chill'
  | 'heat-index'
  | 'dew-point'
  | 'bandwidth'
  | 'gdp'
  | 'horsepower'
  | 'engine-horsepower'
  | 'golf-handicap'
  | 'love'
  | 'word-counter'
  | 'character-counter'
  | 'text-case-converter'
  | 'slug-generator'
  | 'json-formatter'
  | 'uuid-generator'
  | 'hash-generator'
  | 'unix-timestamp-converter'
  | 'color-contrast-checker'
  | 'aspect-ratio-calculator'
  | 'utm-builder'
  | 'query-string-parser'
  | 'html-entity-encoder-decoder'
  | 'css-clamp-calculator'
  | 'ai-token-cost-calculator'
  | 'prompt-token-estimator'
  | 'api-pricing-calculator'
  | 'download-time-calculator'
  | 'internet-speed-needs-calculator'
  | 'streaming-bitrate-calculator'
  | 'device-battery-life-calculator'
  | 'monitor-ppi-calculator'
  | 'markdown-table-generator';

type InputMode = HTMLAttributes<HTMLInputElement>['inputMode'];
type UtilityInputs = Record<string, string>;

interface SelectOption {
  label: string;
  value: string;
}

interface UtilityField {
  key: string;
  label: string;
  type?: 'number' | 'select' | 'date' | 'time' | 'checkbox' | 'text' | 'textarea';
  inputMode?: InputMode;
  placeholder?: string;
  options?: SelectOption[];
}

interface UtilityExample {
  label: string;
  inputs: UtilityInputs;
}

interface UtilityMode {
  id: string;
  label: string;
  symbol: string;
  fields: UtilityField[];
  defaultInputs: UtilityInputs;
  examples: UtilityExample[];
}

interface UtilityConfig {
  title: string;
  buttonLabel: string;
  emptyHistory: string;
  privacyNote: string;
  modes: UtilityMode[];
}

interface UtilityCalculation {
  expression: string;
  answer: string;
  label: string;
  metrics: Array<{ label: string; value: string }>;
  steps: string[];
  note?: string;
  keepOutOfHistory?: boolean;
  textOutput?: boolean;
}

interface Props {
  variant: UtilityToolVariant;
}

const numberInput: InputMode = 'decimal';
const integerInput: InputMode = 'numeric';

const numberField = (key: string, label: string, placeholder?: string): UtilityField => ({
  key,
  label,
  placeholder,
  inputMode: numberInput,
  type: 'number',
});
const integerField = (key: string, label: string, placeholder?: string): UtilityField => ({
  key,
  label,
  placeholder,
  inputMode: integerInput,
  type: 'number',
});
const dateField = (key: string, label: string): UtilityField => ({ key, label, type: 'date' });
const timeField = (key: string, label: string): UtilityField => ({ key, label, type: 'time' });
const textField = (key: string, label: string, placeholder?: string): UtilityField => ({ key, label, placeholder, type: 'text' });
const textareaField = (key: string, label: string, placeholder?: string): UtilityField => ({ key, label, placeholder, type: 'textarea' });
const checkboxField = (key: string, label: string): UtilityField => ({ key, label, type: 'checkbox' });
const selectField = (key: string, label: string, options: SelectOption[]): UtilityField => ({
  key,
  label,
  type: 'select',
  options,
});

const commonFieldHelp: Partial<Record<string, string>> = {
  wastePercent:
    'Extra material added before rounding up. Use more when cuts, damaged pieces, pattern matching, or irregular shapes are likely.',
  depthInches: 'Finished average depth in inches. Convert fractions to decimals, such as 3.5.',
  areaSquareFeet: 'Measured surface area in square feet before waste or extra allowance is added.',
  openingsSquareFeet: 'Total square feet of doors, windows, or other openings to subtract before waste is added.',
  tonsPerCubicYard:
    'Material weight from your supplier. Stone, sand, soil, asphalt, moisture, and compaction can change this value.',
};

const fieldHelpByVariant: Partial<Record<UtilityToolVariant, Partial<Record<string, string>>>> = {
  concrete: {
    lengthFeet: 'Form length in feet.',
    widthFeet: 'Form width in feet.',
    depthInches: 'Slab thickness or average pour depth in inches.',
    wastePercent: 'Extra concrete for uneven grade, spillage, low spots, and ordering cushion.',
  },
  roofing: {
    lengthFeet: 'Horizontal footprint length, not the sloped roof surface.',
    widthFeet: 'Horizontal footprint width, not the sloped roof surface.',
    pitchRisePer12: 'Roof rise for every 12 inches of horizontal run. A 6/12 roof uses 6 here.',
    wastePercent: 'Extra shingles for cuts, starter strips, valleys, hips, ridge, and mistakes.',
  },
  tile: {
    areaSquareFeet: 'Floor or wall surface area before waste. Measure the area, not the tile box coverage.',
    tileLengthInches: 'Visible length of one tile in inches.',
    tileWidthInches: 'Visible width of one tile in inches.',
    wastePercent: 'Extra tile for cuts, breakage, layout pattern, and future replacement pieces.',
  },
  mulch: {
    areaSquareFeet: 'Bed area in square feet.',
    depthInches: 'Finished mulch depth. Refresh layers usually need less depth than new beds.',
    wastePercent: 'Extra mulch for settling, uneven beds, slopes, and spreading loss.',
  },
  gravel: {
    lengthFeet: 'Project length in feet.',
    widthFeet: 'Project width in feet.',
    depthInches: 'Finished average gravel depth before compaction.',
  },
  paint: {
    lengthFeet: 'Room length used to calculate wall perimeter.',
    widthFeet: 'Room width used to calculate wall perimeter.',
    wallHeightFeet: 'Average wall height from floor to ceiling or trim line.',
    doors: 'Number of standard doors. The estimate subtracts about 20 square feet per door.',
    windows: 'Number of standard windows. The estimate subtracts about 15 square feet per window.',
    coats: 'How many coats of paint you plan to apply.',
    coverageSquareFeetPerGallon: 'Coverage from the paint label for one gallon and one coat.',
    wastePercent: 'Extra paint for texture, roller/tray loss, touchups, and small measurement errors.',
  },
  drywall: {
    areaSquareFeet: 'Wall or ceiling surface area before waste. Subtract large openings separately if needed.',
    sheetLengthFeet: 'Drywall sheet length, such as 8, 10, or 12 feet.',
    sheetWidthFeet: 'Drywall sheet width, usually 4 feet.',
    wastePercent: 'Extra sheets for cuts, broken corners, offcuts, and layout mistakes.',
  },
  carpet: {
    lengthFeet: 'Room length in feet.',
    widthFeet: 'Room width in feet.',
    rollWidthFeet: 'Carpet roll width from the product, commonly 12 feet.',
    wastePercent: 'Extra carpet for trimming, seams, closets, pattern direction, and installer layout.',
  },
  flooring: {
    areaSquareFeet: 'Measured floor area before waste. Add rooms, closets, and hallway sections first.',
    wastePercent: 'Extra flooring for cuts, damaged planks, pattern layout, and future repairs.',
    boxCoverageSquareFeet: 'Square feet covered by one box according to the product label.',
    pricePerBox: 'Optional material price for one box. Leave blank if you only need the box count.',
  },
  wallpaper: {
    roomLengthFeet: 'Length of one pair of opposite walls.',
    roomWidthFeet: 'Width of the other pair of opposite walls.',
    wallHeightFeet: 'Average wall height from baseboard or floor to ceiling or trim.',
    doors: 'Number of standard doors. The estimate subtracts about 20 square feet per door.',
    windows: 'Number of standard windows. The estimate subtracts about 15 square feet per window.',
    rollCoverageSquareFeet:
      'Usable square feet one roll covers. Use the product label because pattern repeat can reduce usable coverage.',
    wastePercent: 'Extra wallpaper for trimming, pattern matching, damaged strips, and mistakes.',
  },
  fence: {
    perimeterFeet: 'Total fence path length before subtracting gates.',
    panelWidthFeet: 'Width of one fence panel or bay.',
    postSpacingFeet: 'Maximum spacing between line posts.',
    gateCount: 'Number of gates in the fence line.',
    gateWidthFeet: 'Width of each gate opening.',
  },
  'deck-cost': {
    lengthFeet: 'Deck surface length in feet.',
    widthFeet: 'Deck surface width in feet.',
    wastePercent: 'Extra decking surface material for cuts, board layout, and mistakes.',
    deckCostPerSquareFoot: 'Material cost for decking surface per square foot.',
    railingLinearFeet: 'Total railing length to price.',
    railingCostPerFoot: 'Estimated railing cost per linear foot.',
    stairsCost: 'Rough allowance for stairs. Use 0 if stairs are not part of the estimate.',
  },
  paver: {
    areaSquareFeet: 'Patio, path, or driveway surface area before waste.',
    paverLengthInches: 'Visible length of one paver in inches.',
    paverWidthInches: 'Visible width of one paver in inches.',
    wastePercent: 'Extra pavers for cuts, breakage, border pieces, and future replacement.',
  },
  siding: {
    wallAreaSquareFeet: 'Total exterior wall area before subtracting doors and windows.',
    openingsSquareFeet: 'Combined area of doors, windows, garage doors, and other openings.',
    wastePercent: 'Extra siding for cuts, gables, corners, trim-heavy sections, and damaged pieces.',
    pricePerSquare: 'Optional price for one siding square. One siding square is 100 square feet.',
  },
  brick: {
    wallAreaSquareFeet: 'Visible wall face area, not wall volume.',
    brickLengthInches: 'Visible brick face length in inches.',
    brickHeightInches: 'Visible brick face height in inches.',
    mortarJointInches: 'Planned mortar joint thickness. Common joints are often around 3/8 inch.',
    wastePercent: 'Extra bricks for cuts, breakage, corners, bond pattern, and color matching.',
  },
  'concrete-block': {
    wallLengthFeet: 'Total wall length in feet.',
    wallHeightFeet: 'Finished wall height in feet.',
    blockLengthInches: 'Nominal block length, commonly 16 inches for many CMU blocks.',
    blockHeightInches: 'Nominal block height, commonly 8 inches for many CMU blocks.',
    openingsSquareFeet: 'Door, window, or other opening area to subtract before waste.',
    wastePercent: 'Extra blocks for cuts, broken units, corners, and layout changes.',
  },
  rebar: {
    slabLengthFeet: 'Slab length in feet.',
    slabWidthFeet: 'Slab width in feet.',
    spacingInches: 'Distance between parallel bars. Smaller spacing means more bars.',
    barLengthFeet: 'Stock length of one bar from your supplier.',
    wastePercent: 'Extra rebar length for cuts, lap planning, and small layout changes.',
  },
  'board-foot': {
    thicknessInches: 'Board thickness in inches. Use actual size when you know it.',
    widthInches: 'Board width in inches. Use actual size when you know it.',
    lengthFeet: 'Board length in feet.',
    quantity: 'Number of boards with the same dimensions.',
  },
  'cubic-yard': {
    lengthFeet: 'Project length in feet.',
    widthFeet: 'Project width in feet.',
    depthInches: 'Average material depth in inches.',
    wastePercent: 'Extra material for uneven grade, compaction, settling, and ordering cushion.',
  },
  'pool-volume': {
    shape: 'Simple pool shape used for the volume formula.',
    lengthFeet: 'Pool length, or diameter for a round pool.',
    widthFeet: 'Pool width, or the same diameter again for a round pool.',
    averageDepthFeet: 'Average water depth. Use the average of shallow and deep ends when needed.',
  },
  sand: {
    lengthFeet: 'Project length in feet.',
    widthFeet: 'Project width in feet.',
    depthInches: 'Average sand depth in inches.',
    wastePercent: 'Extra sand for leveling, spreading loss, compaction, and uneven areas.',
  },
  soil: {
    areaSquareFeet: 'Bed or lawn area in square feet.',
    depthInches: 'Added soil depth in inches.',
    wastePercent: 'Extra soil for settling, uneven beds, and spreading loss.',
  },
  asphalt: {
    lengthFeet: 'Paved area length in feet.',
    widthFeet: 'Paved area width in feet.',
    depthInches: 'Compacted asphalt depth, not loose material depth.',
    wastePercent: 'Extra asphalt for compaction differences, edges, and small measurement errors.',
  },
  'ai-token-cost-calculator': {
    inputTokensPerRequest: 'Prompt, system, tool, and context tokens you expect to send per request.',
    outputTokensPerRequest: 'Generated response tokens you expect back per request.',
    requests: 'How many requests, chats, jobs, or users you want to estimate.',
    inputPricePerMillion: 'Current input price from your model provider, entered as dollars per 1 million tokens.',
    outputPricePerMillion: 'Current output price from your model provider, entered as dollars per 1 million tokens.',
  },
  'prompt-token-estimator': {
    text: 'Paste only the prompt text you want to estimate. The browser uses character length, not a provider tokenizer.',
    averageCharactersPerToken: 'A rough average. Four characters per token is a common planning estimate, but real tokenizers vary.',
  },
  'api-pricing-calculator': {
    requests: 'Number of API calls, jobs, messages, or events you expect to bill.',
    unitsPerRequest: 'Billable units in each request, such as tokens, images, seconds, messages, or credits.',
    pricePerUnit: 'Price for one billable unit. For token tools, divide the per-million price by 1,000,000 first.',
    platformFee: 'Optional fixed cost, minimum charge, or monthly platform fee to include.',
    retryPercent: 'Extra percentage for retries, failed calls, overhead, or safety cushion.',
  },
  'download-time-calculator': {
    fileSize: 'File size shown by the download, game store, cloud drive, or update page.',
    speedMbps: 'Real download speed in megabits per second, not megabytes per second.',
    efficiencyPercent: 'How much of the listed speed you expect to actually get after Wi-Fi, congestion, and overhead.',
  },
  'internet-speed-needs-calculator': {
    videoStreams: 'How many video streams may run at the same time.',
    gamingDevices: 'Devices gaming online at the same time. Latency still matters separately.',
    videoCalls: 'Video meetings or calls happening at once.',
    smartDevices: 'Background devices such as cameras, speakers, hubs, or small connected devices.',
    bufferPercent: 'Extra speed added so normal bursts and overhead do not use the whole plan.',
  },
  'streaming-bitrate-calculator': {
    bitrate: 'Video or audio bitrate from your encoder, streaming app, or export settings.',
    hours: 'Whole hours of streaming or recording time.',
    minutes: 'Extra minutes of streaming or recording time.',
    streams: 'Number of simultaneous streams or files with the same bitrate and length.',
  },
  'device-battery-life-calculator': {
    capacityMah: 'Battery capacity in milliamp-hours from the product label.',
    voltage: 'Nominal battery voltage. Many USB power banks use cell voltage around 3.7 V internally.',
    powerWatts: 'Average device power draw in watts.',
    efficiencyPercent: 'Usable energy after conversion losses, heat, cable loss, and battery overhead.',
  },
  'monitor-ppi-calculator': {
    widthPixels: 'Horizontal pixel count, such as 1920, 2560, or 3840.',
    heightPixels: 'Vertical pixel count, such as 1080, 1440, or 2160.',
    diagonalInches: 'Screen diagonal size in inches, usually from the monitor or laptop spec sheet.',
  },
};

function getFieldHelp(variant: UtilityToolVariant, field: UtilityField) {
  return fieldHelpByVariant[variant]?.[field.key] ?? commonFieldHelp[field.key];
}

const directionOptions: SelectOption[] = [
  { label: 'Add', value: 'add' },
  { label: 'Subtract', value: 'subtract' },
];

const operationOptions: SelectOption[] = [
  { label: 'Add', value: 'add' },
  { label: 'Subtract', value: 'subtract' },
];

const textOperationOptions: SelectOption[] = [
  { label: 'Encode', value: 'encode' },
  { label: 'Decode', value: 'decode' },
];

const textCaseOptions: SelectOption[] = [
  { label: 'Uppercase', value: 'uppercase' },
  { label: 'Lowercase', value: 'lowercase' },
  { label: 'Title Case', value: 'title' },
  { label: 'Sentence case', value: 'sentence' },
  { label: 'camelCase', value: 'camel' },
  { label: 'PascalCase', value: 'pascal' },
  { label: 'snake_case', value: 'snake' },
  { label: 'kebab-case', value: 'kebab' },
];

const hashAlgorithmOptions: SelectOption[] = [
  { label: 'SHA-256', value: 'SHA-256' },
  { label: 'SHA-384', value: 'SHA-384' },
  { label: 'SHA-512', value: 'SHA-512' },
];

const timestampUnitOptions: SelectOption[] = [
  { label: 'Seconds', value: 'seconds' },
  { label: 'Milliseconds', value: 'milliseconds' },
];

const htmlEntityModeOptions: SelectOption[] = [
  { label: 'Encode characters', value: 'encode' },
  { label: 'Decode entities', value: 'decode' },
];

const markdownAlignmentOptions: SelectOption[] = [
  { label: 'Left aligned', value: 'left' },
  { label: 'Center aligned', value: 'center' },
  { label: 'Right aligned', value: 'right' },
];

const romanModeOptions: SelectOption[] = [
  { label: 'Number to Roman', value: 'number-to-roman' },
  { label: 'Roman to number', value: 'roman-to-number' },
];

const timeZoneOptions: SelectOption[] = [
  { label: 'New York', value: 'America/New_York' },
  { label: 'Los Angeles', value: 'America/Los_Angeles' },
  { label: 'Chicago', value: 'America/Chicago' },
  { label: 'London', value: 'Europe/London' },
  { label: 'Paris', value: 'Europe/Paris' },
  { label: 'Tokyo', value: 'Asia/Tokyo' },
  { label: 'Sydney', value: 'Australia/Sydney' },
  { label: 'Brisbane', value: 'Australia/Brisbane' },
  { label: 'UTC', value: 'UTC' },
];

const gradeOptions: SelectOption[] = [
  { label: 'A+', value: 'A+' },
  { label: 'A', value: 'A' },
  { label: 'A-', value: 'A-' },
  { label: 'B+', value: 'B+' },
  { label: 'B', value: 'B' },
  { label: 'B-', value: 'B-' },
  { label: 'C+', value: 'C+' },
  { label: 'C', value: 'C' },
  { label: 'C-', value: 'C-' },
  { label: 'D+', value: 'D+' },
  { label: 'D', value: 'D' },
  { label: 'D-', value: 'D-' },
  { label: 'F', value: 'F' },
];

const conversionUnitOptions: Record<ConversionCategory, SelectOption[]> = {
  length: [
    { label: 'Millimeters', value: 'millimeter' },
    { label: 'Centimeters', value: 'centimeter' },
    { label: 'Meters', value: 'meter' },
    { label: 'Kilometers', value: 'kilometer' },
    { label: 'Inches', value: 'inch' },
    { label: 'Feet', value: 'foot' },
    { label: 'Yards', value: 'yard' },
    { label: 'Miles', value: 'mile' },
  ],
  mass: [
    { label: 'Milligrams', value: 'milligram' },
    { label: 'Grams', value: 'gram' },
    { label: 'Kilograms', value: 'kilogram' },
    { label: 'Ounces', value: 'ounce' },
    { label: 'Pounds', value: 'pound' },
    { label: 'Short tons', value: 'ton' },
  ],
  volume: [
    { label: 'Milliliters', value: 'milliliter' },
    { label: 'Liters', value: 'liter' },
    { label: 'Cubic meters', value: 'cubic-meter' },
    { label: 'Teaspoons', value: 'teaspoon' },
    { label: 'Tablespoons', value: 'tablespoon' },
    { label: 'Fluid ounces', value: 'fluid-ounce' },
    { label: 'Cups', value: 'cup' },
    { label: 'Pints', value: 'pint' },
    { label: 'Quarts', value: 'quart' },
    { label: 'Gallons', value: 'gallon' },
  ],
  temperature: [
    { label: 'Celsius', value: 'celsius' },
    { label: 'Fahrenheit', value: 'fahrenheit' },
    { label: 'Kelvin', value: 'kelvin' },
  ],
};

const sexOptions: SelectOption[] = [
  { label: 'Boy / male estimate', value: 'male' },
  { label: 'Girl / female estimate', value: 'female' },
];

const phaseOptions: SelectOption[] = [
  { label: 'Single-phase / DC', value: 'single' },
  { label: 'Three-phase', value: 'three' },
];

const copperAwgOptions: SelectOption[] = [
  '14',
  '12',
  '10',
  '8',
  '6',
  '4',
  '2',
  '1/0',
  '2/0',
  '4/0',
].map((value) => ({ label: `${value} AWG copper`, value }));

const sunlightOptions: SelectOption[] = [
  { label: 'Normal room', value: 'normal' },
  { label: 'Heavy shade', value: 'shaded' },
  { label: 'Very sunny', value: 'sunny' },
];

const resistorDigitOptions: SelectOption[] = [
  'black',
  'brown',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'violet',
  'gray',
  'white',
].map((value) => ({ label: value, value }));

const resistorMultiplierOptions: SelectOption[] = [
  ...resistorDigitOptions,
  { label: 'gold', value: 'gold' },
  { label: 'silver', value: 'silver' },
];

const resistorToleranceOptions: SelectOption[] = ['brown', 'red', 'green', 'blue', 'violet', 'gray', 'gold', 'silver'].map(
  (value) => ({ label: value, value }),
);

const bandwidthDataUnitOptions: SelectOption[] = ['KB', 'MB', 'GB', 'TB'].map((value) => ({ label: value, value }));

const bandwidthSpeedUnitOptions: SelectOption[] = ['Kbps', 'Mbps', 'Gbps'].map((value) => ({ label: value, value }));

const fileSizeUnitOptions: SelectOption[] = ['KB', 'MB', 'GB', 'TB'].map((value) => ({ label: value, value }));

const bitrateUnitOptions: SelectOption[] = ['Kbps', 'Mbps'].map((value) => ({ label: value, value }));

const horsepowerUnitOptions: SelectOption[] = [
  { label: 'Mechanical hp', value: 'horsepower' },
  { label: 'Watts', value: 'watt' },
  { label: 'Kilowatts', value: 'kilowatt' },
  { label: 'Metric hp', value: 'metric-horsepower' },
];

const poolShapeOptions: SelectOption[] = [
  { label: 'Rectangle', value: 'rectangle' },
  { label: 'Round', value: 'round' },
  { label: 'Oval', value: 'oval' },
];

const utilityConfigs: Record<UtilityToolVariant, UtilityConfig> = {
  age: {
    title: 'Age Calculator',
    buttonLabel: 'Calculate age',
    emptyHistory: 'Recent age calculations will appear here.',
    privacyNote: 'Age calculations use calendar dates in the browser and do not send birth dates to a server.',
    modes: [
      {
        id: 'age',
        label: 'Age',
        symbol: 'AGE',
        fields: [dateField('birthDate', 'Birth date'), dateField('asOfDate', 'Age on date')],
        defaultInputs: { birthDate: '2000-01-01', asOfDate: '2026-04-30' },
        examples: [
          { label: 'Born Jan 1, 2000', inputs: { birthDate: '2000-01-01', asOfDate: '2026-04-30' } },
          { label: 'Leap day birthday', inputs: { birthDate: '2004-02-29', asOfDate: '2026-04-30' } },
          { label: 'Birthday today', inputs: { birthDate: '2010-04-30', asOfDate: '2026-04-30' } },
        ],
      },
    ],
  },
  date: {
    title: 'Date Calculator',
    buttonLabel: 'Calculate date',
    emptyHistory: 'Recent date calculations will appear here.',
    privacyNote: 'Date math uses UTC calendar dates to avoid daylight-saving time shifts.',
    modes: [
      {
        id: 'difference',
        label: 'Difference',
        symbol: 'DAYS',
        fields: [dateField('startDate', 'Start date'), dateField('endDate', 'End date')],
        defaultInputs: { startDate: '2026-04-30', endDate: '2026-12-31' },
        examples: [
          { label: 'Rest of 2026', inputs: { startDate: '2026-04-30', endDate: '2026-12-31' } },
          { label: 'Project window', inputs: { startDate: '2026-05-01', endDate: '2026-08-15' } },
          { label: 'Backward check', inputs: { startDate: '2026-10-01', endDate: '2026-09-01' } },
        ],
      },
      {
        id: 'shift',
        label: 'Add or subtract',
        symbol: '+/-',
        fields: [
          dateField('startDate', 'Start date'),
          selectField('direction', 'Direction', directionOptions),
          integerField('years', 'Years'),
          integerField('months', 'Months'),
          integerField('weeks', 'Weeks'),
          integerField('days', 'Days'),
        ],
        defaultInputs: { startDate: '2026-04-30', direction: 'add', years: '0', months: '1', weeks: '2', days: '3' },
        examples: [
          { label: '45-ish days out', inputs: { startDate: '2026-04-30', direction: 'add', years: '0', months: '1', weeks: '2', days: '3' } },
          { label: 'Subtract 90 days', inputs: { startDate: '2026-12-31', direction: 'subtract', years: '0', months: '0', weeks: '12', days: '6' } },
          { label: 'One year ahead', inputs: { startDate: '2026-04-30', direction: 'add', years: '1', months: '0', weeks: '0', days: '0' } },
        ],
      },
    ],
  },
  time: {
    title: 'Time Calculator',
    buttonLabel: 'Calculate time',
    emptyHistory: 'Recent time calculations will appear here.',
    privacyNote: 'Time calculations stay in this browser tab and use duration math, not time-zone lookup.',
    modes: [
      {
        id: 'duration',
        label: 'Durations',
        symbol: 'H:M:S',
        fields: [
          integerField('firstHours', 'First hours'),
          integerField('firstMinutes', 'First minutes'),
          integerField('firstSeconds', 'First seconds'),
          selectField('operation', 'Operation', operationOptions),
          integerField('secondHours', 'Second hours'),
          integerField('secondMinutes', 'Second minutes'),
          integerField('secondSeconds', 'Second seconds'),
        ],
        defaultInputs: {
          firstHours: '2',
          firstMinutes: '45',
          firstSeconds: '30',
          operation: 'add',
          secondHours: '1',
          secondMinutes: '20',
          secondSeconds: '45',
        },
        examples: [
          { label: 'Add two times', inputs: { firstHours: '2', firstMinutes: '45', firstSeconds: '30', operation: 'add', secondHours: '1', secondMinutes: '20', secondSeconds: '45' } },
          { label: 'Subtract time', inputs: { firstHours: '5', firstMinutes: '0', firstSeconds: '0', operation: 'subtract', secondHours: '1', secondMinutes: '35', secondSeconds: '15' } },
          { label: 'Seconds cleanup', inputs: { firstHours: '0', firstMinutes: '59', firstSeconds: '50', operation: 'add', secondHours: '0', secondMinutes: '0', secondSeconds: '25' } },
        ],
      },
    ],
  },
  hours: {
    title: 'Hours Calculator',
    buttonLabel: 'Calculate hours',
    emptyHistory: 'Recent hour calculations will appear here.',
    privacyNote: 'Hours and pay estimates are simple time-card math and not payroll advice.',
    modes: [
      {
        id: 'hours',
        label: 'Shift',
        symbol: 'TIME',
        fields: [
          timeField('startTime', 'Start time'),
          timeField('endTime', 'End time'),
          integerField('breakMinutes', 'Break minutes'),
          numberField('hourlyRate', 'Hourly rate ($, optional)', 'Optional'),
        ],
        defaultInputs: { startTime: '09:00', endTime: '17:30', breakMinutes: '30', hourlyRate: '25' },
        examples: [
          { label: '9 to 5:30', inputs: { startTime: '09:00', endTime: '17:30', breakMinutes: '30', hourlyRate: '25' } },
          { label: 'No break', inputs: { startTime: '08:15', endTime: '16:00', breakMinutes: '0', hourlyRate: '' } },
          { label: 'Overnight shift', inputs: { startTime: '22:00', endTime: '06:30', breakMinutes: '45', hourlyRate: '32' } },
        ],
      },
    ],
  },
  gpa: {
    title: 'GPA Calculator',
    buttonLabel: 'Calculate GPA',
    emptyHistory: 'Recent GPA calculations will appear here.',
    privacyNote: 'GPA scales vary by school. This tool uses a common unweighted 4.0 scale unless your school says otherwise.',
    modes: [
      {
        id: 'gpa',
        label: 'Courses',
        symbol: '4.0',
        fields: [
          numberField('credits1', 'Course 1 credits'),
          selectField('grade1', 'Course 1 grade', gradeOptions),
          numberField('credits2', 'Course 2 credits'),
          selectField('grade2', 'Course 2 grade', gradeOptions),
          numberField('credits3', 'Course 3 credits'),
          selectField('grade3', 'Course 3 grade', gradeOptions),
          numberField('credits4', 'Course 4 credits'),
          selectField('grade4', 'Course 4 grade', gradeOptions),
        ],
        defaultInputs: { credits1: '3', grade1: 'A', credits2: '4', grade2: 'B+', credits3: '3', grade3: 'A-', credits4: '2', grade4: 'B' },
        examples: [
          { label: 'Four classes', inputs: { credits1: '3', grade1: 'A', credits2: '4', grade2: 'B+', credits3: '3', grade3: 'A-', credits4: '2', grade4: 'B' } },
          { label: 'All A term', inputs: { credits1: '3', grade1: 'A', credits2: '3', grade2: 'A', credits3: '4', grade3: 'A', credits4: '0', grade4: 'A' } },
          { label: 'Mixed credits', inputs: { credits1: '4', grade1: 'B', credits2: '4', grade2: 'A-', credits3: '2', grade3: 'C+', credits4: '1', grade4: 'A' } },
        ],
      },
    ],
  },
  grade: {
    title: 'Grade Calculator',
    buttonLabel: 'Calculate needed grade',
    emptyHistory: 'Recent grade calculations will appear here.',
    privacyNote: 'Grade policies vary by class. Use your syllabus weights when you need an exact school calculation.',
    modes: [
      {
        id: 'needed-final',
        label: 'Needed final',
        symbol: 'GOAL',
        fields: [
          numberField('currentGradePercent', 'Current grade (%)'),
          numberField('finalWeightPercent', 'Final weight (%)'),
          numberField('desiredGradePercent', 'Desired course grade (%)'),
        ],
        defaultInputs: { currentGradePercent: '87', finalWeightPercent: '30', desiredGradePercent: '90' },
        examples: [
          { label: 'Aim for A-', inputs: { currentGradePercent: '87', finalWeightPercent: '30', desiredGradePercent: '90' } },
          { label: 'Pass the class', inputs: { currentGradePercent: '62', finalWeightPercent: '40', desiredGradePercent: '70' } },
          { label: 'Final is small', inputs: { currentGradePercent: '91', finalWeightPercent: '15', desiredGradePercent: '90' } },
        ],
      },
    ],
  },
  concrete: {
    title: 'Concrete Calculator',
    buttonLabel: 'Estimate concrete',
    emptyHistory: 'Recent concrete estimates will appear here.',
    privacyNote: 'Concrete estimates are planning numbers. Site conditions, forms, compaction, ordering rules, and waste can change real needs.',
    modes: [
      {
        id: 'slab',
        label: 'Slab',
        symbol: 'YD3',
        fields: [
          numberField('lengthFeet', 'Length (ft)'),
          numberField('widthFeet', 'Width (ft)'),
          numberField('depthInches', 'Depth (in)'),
          numberField('wastePercent', 'Extra waste (%)'),
        ],
        defaultInputs: { lengthFeet: '10', widthFeet: '12', depthInches: '4', wastePercent: '10' },
        examples: [
          { label: '10 x 12 slab', inputs: { lengthFeet: '10', widthFeet: '12', depthInches: '4', wastePercent: '10' } },
          { label: 'Walkway', inputs: { lengthFeet: '24', widthFeet: '3', depthInches: '4', wastePercent: '10' } },
          { label: 'Small pad', inputs: { lengthFeet: '6', widthFeet: '6', depthInches: '3.5', wastePercent: '5' } },
        ],
      },
    ],
  },
  subnet: {
    title: 'Subnet Calculator',
    buttonLabel: 'Calculate subnet',
    emptyHistory: 'Recent subnet calculations will appear here.',
    privacyNote: 'Subnet calculations run locally and are for IPv4 CIDR planning and learning.',
    modes: [
      {
        id: 'ipv4',
        label: 'IPv4 CIDR',
        symbol: '/24',
        fields: [textField('ipAddress', 'IP address', '192.168.1.10'), integerField('prefixLength', 'Prefix length')],
        defaultInputs: { ipAddress: '192.168.1.10', prefixLength: '24' },
        examples: [
          { label: 'Home LAN /24', inputs: { ipAddress: '192.168.1.10', prefixLength: '24' } },
          { label: 'Small subnet /28', inputs: { ipAddress: '10.0.5.17', prefixLength: '28' } },
          { label: 'Point-to-point /31', inputs: { ipAddress: '172.16.0.8', prefixLength: '31' } },
        ],
      },
    ],
  },
  'password-generator': {
    title: 'Password Generator',
    buttonLabel: 'Generate password',
    emptyHistory: 'Generated passwords are not saved in recent history.',
    privacyNote: 'Generated passwords are created in your browser. Copy them into a trusted password manager and do not reuse them.',
    modes: [
      {
        id: 'password',
        label: 'Password',
        symbol: 'KEY',
        fields: [
          integerField('length', 'Length'),
          checkboxField('includeUppercase', 'Uppercase letters'),
          checkboxField('includeLowercase', 'Lowercase letters'),
          checkboxField('includeNumbers', 'Numbers'),
          checkboxField('includeSymbols', 'Symbols'),
          checkboxField('avoidAmbiguous', 'Avoid ambiguous characters'),
        ],
        defaultInputs: {
          length: '20',
          includeUppercase: 'true',
          includeLowercase: 'true',
          includeNumbers: 'true',
          includeSymbols: 'true',
          avoidAmbiguous: 'true',
        },
        examples: [
          { label: 'Strong default', inputs: { length: '20', includeUppercase: 'true', includeLowercase: 'true', includeNumbers: 'true', includeSymbols: 'true', avoidAmbiguous: 'true' } },
          { label: 'Long readable', inputs: { length: '24', includeUppercase: 'true', includeLowercase: 'true', includeNumbers: 'true', includeSymbols: 'false', avoidAmbiguous: 'true' } },
          { label: 'Maximum mix', inputs: { length: '32', includeUppercase: 'true', includeLowercase: 'true', includeNumbers: 'true', includeSymbols: 'true', avoidAmbiguous: 'false' } },
        ],
      },
    ],
  },
  conversion: {
    title: 'Conversion Calculator',
    buttonLabel: 'Convert value',
    emptyHistory: 'Recent conversions will appear here.',
    privacyNote: 'Conversions use fixed unit factors in the browser and do not send values to a server.',
    modes: [
      {
        id: 'length',
        label: 'Length',
        symbol: 'm',
        fields: [
          numberField('value', 'Value'),
          selectField('fromUnit', 'From', conversionUnitOptions.length),
          selectField('toUnit', 'To', conversionUnitOptions.length),
        ],
        defaultInputs: { value: '12', fromUnit: 'foot', toUnit: 'meter' },
        examples: [
          { label: 'Feet to meters', inputs: { value: '12', fromUnit: 'foot', toUnit: 'meter' } },
          { label: 'Miles to km', inputs: { value: '5', fromUnit: 'mile', toUnit: 'kilometer' } },
          { label: 'Inches to cm', inputs: { value: '72', fromUnit: 'inch', toUnit: 'centimeter' } },
        ],
      },
      {
        id: 'mass',
        label: 'Mass',
        symbol: 'kg',
        fields: [
          numberField('value', 'Value'),
          selectField('fromUnit', 'From', conversionUnitOptions.mass),
          selectField('toUnit', 'To', conversionUnitOptions.mass),
        ],
        defaultInputs: { value: '150', fromUnit: 'pound', toUnit: 'kilogram' },
        examples: [
          { label: 'Pounds to kg', inputs: { value: '150', fromUnit: 'pound', toUnit: 'kilogram' } },
          { label: 'Ounces to grams', inputs: { value: '16', fromUnit: 'ounce', toUnit: 'gram' } },
          { label: 'Kg to pounds', inputs: { value: '70', fromUnit: 'kilogram', toUnit: 'pound' } },
        ],
      },
      {
        id: 'volume',
        label: 'Volume',
        symbol: 'L',
        fields: [
          numberField('value', 'Value'),
          selectField('fromUnit', 'From', conversionUnitOptions.volume),
          selectField('toUnit', 'To', conversionUnitOptions.volume),
        ],
        defaultInputs: { value: '1', fromUnit: 'gallon', toUnit: 'liter' },
        examples: [
          { label: 'Gallons to liters', inputs: { value: '1', fromUnit: 'gallon', toUnit: 'liter' } },
          { label: 'Cups to mL', inputs: { value: '2', fromUnit: 'cup', toUnit: 'milliliter' } },
          { label: 'Liters to quarts', inputs: { value: '3', fromUnit: 'liter', toUnit: 'quart' } },
        ],
      },
      {
        id: 'temperature',
        label: 'Temperature',
        symbol: 'C/F',
        fields: [
          numberField('value', 'Value'),
          selectField('fromUnit', 'From', conversionUnitOptions.temperature),
          selectField('toUnit', 'To', conversionUnitOptions.temperature),
        ],
        defaultInputs: { value: '72', fromUnit: 'fahrenheit', toUnit: 'celsius' },
        examples: [
          { label: 'F to C', inputs: { value: '72', fromUnit: 'fahrenheit', toUnit: 'celsius' } },
          { label: 'C to F', inputs: { value: '20', fromUnit: 'celsius', toUnit: 'fahrenheit' } },
          { label: 'C to K', inputs: { value: '0', fromUnit: 'celsius', toUnit: 'kelvin' } },
        ],
      },
    ],
  },
  'dice-roller': {
    title: 'Dice Roller',
    buttonLabel: 'Roll dice',
    emptyHistory: 'Recent rolls will appear here.',
    privacyNote: 'Dice rolls use browser random values for everyday games, teaching, and quick picks.',
    modes: [
      {
        id: 'dice',
        label: 'Roll',
        symbol: 'D6',
        fields: [integerField('diceCount', 'Dice count'), integerField('sides', 'Sides per die'), integerField('modifier', 'Modifier')],
        defaultInputs: { diceCount: '2', sides: '6', modifier: '0' },
        examples: [
          { label: '2d6', inputs: { diceCount: '2', sides: '6', modifier: '0' } },
          { label: '1d20 + 5', inputs: { diceCount: '1', sides: '20', modifier: '5' } },
          { label: '4d10', inputs: { diceCount: '4', sides: '10', modifier: '0' } },
        ],
      },
    ],
  },
  'fuel-cost': {
    title: 'Fuel Cost Calculator',
    buttonLabel: 'Estimate fuel cost',
    emptyHistory: 'Recent fuel cost estimates will appear here.',
    privacyNote: 'Fuel cost estimates stay in this tab and depend on the MPG and fuel price you enter.',
    modes: [
      {
        id: 'fuel-cost',
        label: 'Trip',
        symbol: '$/mi',
        fields: [
          numberField('distanceMiles', 'One-way distance (mi)'),
          numberField('milesPerGallon', 'Fuel economy (MPG)'),
          numberField('pricePerGallon', 'Fuel price ($/gal)'),
          checkboxField('roundTrip', 'Round trip'),
        ],
        defaultInputs: { distanceMiles: '120', milesPerGallon: '28', pricePerGallon: '3.75', roundTrip: 'true' },
        examples: [
          { label: 'Weekend drive', inputs: { distanceMiles: '120', milesPerGallon: '28', pricePerGallon: '3.75', roundTrip: 'true' } },
          { label: 'Commute', inputs: { distanceMiles: '18', milesPerGallon: '31', pricePerGallon: '3.60', roundTrip: 'true' } },
          { label: 'One-way move', inputs: { distanceMiles: '450', milesPerGallon: '22', pricePerGallon: '3.90', roundTrip: 'false' } },
        ],
      },
    ],
  },
  'square-footage': {
    title: 'Square Footage Calculator',
    buttonLabel: 'Calculate square footage',
    emptyHistory: 'Recent square footage results will appear here.',
    privacyNote: 'Room and project dimensions stay in your browser tab.',
    modes: [
      {
        id: 'square-footage',
        label: 'Area',
        symbol: 'ft2',
        fields: [numberField('lengthFeet', 'Length (ft)'), numberField('widthFeet', 'Width (ft)'), integerField('quantity', 'Quantity')],
        defaultInputs: { lengthFeet: '12', widthFeet: '10', quantity: '1' },
        examples: [
          { label: 'Bedroom', inputs: { lengthFeet: '12', widthFeet: '10', quantity: '1' } },
          { label: 'Three panels', inputs: { lengthFeet: '8', widthFeet: '4', quantity: '3' } },
          { label: 'Flooring area', inputs: { lengthFeet: '22.5', widthFeet: '14', quantity: '1' } },
        ],
      },
    ],
  },
  'time-card': {
    title: 'Time Card Calculator',
    buttonLabel: 'Calculate time card',
    emptyHistory: 'Recent weekly time card totals will appear here.',
    privacyNote: 'Time card estimates are simple arithmetic and do not apply payroll rounding or labor rules.',
    modes: [
      {
        id: 'week',
        label: 'Week',
        symbol: '40h',
        fields: [
          timeField('monStart', 'Mon start'),
          timeField('monEnd', 'Mon end'),
          integerField('monBreak', 'Mon break min'),
          timeField('tueStart', 'Tue start'),
          timeField('tueEnd', 'Tue end'),
          integerField('tueBreak', 'Tue break min'),
          timeField('wedStart', 'Wed start'),
          timeField('wedEnd', 'Wed end'),
          integerField('wedBreak', 'Wed break min'),
          timeField('thuStart', 'Thu start'),
          timeField('thuEnd', 'Thu end'),
          integerField('thuBreak', 'Thu break min'),
          timeField('friStart', 'Fri start'),
          timeField('friEnd', 'Fri end'),
          integerField('friBreak', 'Fri break min'),
          numberField('hourlyRate', 'Hourly rate ($, optional)', 'Optional'),
        ],
        defaultInputs: {
          monStart: '09:00',
          monEnd: '17:30',
          monBreak: '30',
          tueStart: '09:00',
          tueEnd: '17:30',
          tueBreak: '30',
          wedStart: '09:00',
          wedEnd: '17:30',
          wedBreak: '30',
          thuStart: '09:00',
          thuEnd: '17:30',
          thuBreak: '30',
          friStart: '09:00',
          friEnd: '16:00',
          friBreak: '30',
          hourlyRate: '25',
        },
        examples: [
          { label: 'Standard week', inputs: { monStart: '09:00', monEnd: '17:30', monBreak: '30', tueStart: '09:00', tueEnd: '17:30', tueBreak: '30', wedStart: '09:00', wedEnd: '17:30', wedBreak: '30', thuStart: '09:00', thuEnd: '17:30', thuBreak: '30', friStart: '09:00', friEnd: '16:00', friBreak: '30', hourlyRate: '25' } },
          { label: 'Four tens', inputs: { monStart: '07:00', monEnd: '17:30', monBreak: '30', tueStart: '07:00', tueEnd: '17:30', tueBreak: '30', wedStart: '07:00', wedEnd: '17:30', wedBreak: '30', thuStart: '07:00', thuEnd: '17:30', thuBreak: '30', friStart: '', friEnd: '', friBreak: '0', hourlyRate: '30' } },
          { label: 'No rate', inputs: { monStart: '08:00', monEnd: '14:00', monBreak: '0', tueStart: '08:00', tueEnd: '14:00', tueBreak: '0', wedStart: '08:00', wedEnd: '14:00', wedBreak: '0', thuStart: '', thuEnd: '', thuBreak: '0', friStart: '', friEnd: '', friBreak: '0', hourlyRate: '' } },
        ],
      },
    ],
  },
  'time-zone': {
    title: 'Time Zone Calculator',
    buttonLabel: 'Convert UTC time',
    emptyHistory: 'Recent time zone conversions will appear here.',
    privacyNote: 'Time zone conversions use the browser Intl time zone data available on this device.',
    modes: [
      {
        id: 'utc-to-zone',
        label: 'UTC to zone',
        symbol: 'TZ',
        fields: [dateField('utcDate', 'UTC date'), timeField('utcTime', 'UTC time'), selectField('timeZone', 'Target time zone', timeZoneOptions)],
        defaultInputs: { utcDate: '2026-04-30', utcTime: '12:00', timeZone: 'America/New_York' },
        examples: [
          { label: 'New York', inputs: { utcDate: '2026-04-30', utcTime: '12:00', timeZone: 'America/New_York' } },
          { label: 'London', inputs: { utcDate: '2026-04-30', utcTime: '12:00', timeZone: 'Europe/London' } },
          { label: 'Tokyo', inputs: { utcDate: '2026-04-30', utcTime: '12:00', timeZone: 'Asia/Tokyo' } },
        ],
      },
    ],
  },
  'gas-mileage': {
    title: 'Gas Mileage Calculator',
    buttonLabel: 'Calculate gas mileage',
    emptyHistory: 'Recent gas mileage calculations will appear here.',
    privacyNote: 'Trip miles and fuel use stay in this browser tab.',
    modes: [
      {
        id: 'gas-mileage',
        label: 'MPG',
        symbol: 'MPG',
        fields: [numberField('milesDriven', 'Miles driven'), numberField('gallonsUsed', 'Gallons used')],
        defaultInputs: { milesDriven: '350', gallonsUsed: '12.5' },
        examples: [
          { label: 'Road trip', inputs: { milesDriven: '350', gallonsUsed: '12.5' } },
          { label: 'Commute tank', inputs: { milesDriven: '275', gallonsUsed: '9.8' } },
          { label: 'Truck tank', inputs: { milesDriven: '420', gallonsUsed: '24' } },
        ],
      },
    ],
  },
  tip: {
    title: 'Tip Calculator',
    buttonLabel: 'Calculate tip',
    emptyHistory: 'Recent tip calculations will appear here.',
    privacyNote: 'Tip and split calculations stay in your browser tab.',
    modes: [
      {
        id: 'tip',
        label: 'Bill',
        symbol: 'TIP',
        fields: [numberField('subtotal', 'Subtotal ($)'), numberField('tipPercent', 'Tip (%)'), numberField('taxPercent', 'Tax (%)'), integerField('people', 'People')],
        defaultInputs: { subtotal: '84.50', tipPercent: '20', taxPercent: '8.25', people: '2' },
        examples: [
          { label: 'Dinner for two', inputs: { subtotal: '84.50', tipPercent: '20', taxPercent: '8.25', people: '2' } },
          { label: 'Coffee tip', inputs: { subtotal: '18', tipPercent: '18', taxPercent: '0', people: '1' } },
          { label: 'Group split', inputs: { subtotal: '240', tipPercent: '20', taxPercent: '8', people: '6' } },
        ],
      },
    ],
  },
  mileage: {
    title: 'Mileage Calculator',
    buttonLabel: 'Calculate mileage amount',
    emptyHistory: 'Recent mileage totals will appear here.',
    privacyNote: 'Mileage estimates stay in this browser tab and use the rate you enter.',
    modes: [
      {
        id: 'mileage',
        label: 'Rate',
        symbol: '$/mi',
        fields: [numberField('miles', 'Miles'), numberField('ratePerMile', 'Rate per mile ($)'), numberField('extraCosts', 'Parking, tolls, or extras ($)')],
        defaultInputs: { miles: '125', ratePerMile: '0.67', extraCosts: '12' },
        examples: [
          { label: 'Client visit', inputs: { miles: '125', ratePerMile: '0.67', extraCosts: '12' } },
          { label: 'Local errand', inputs: { miles: '18.4', ratePerMile: '0.67', extraCosts: '0' } },
          { label: 'Delivery day', inputs: { miles: '92', ratePerMile: '0.55', extraCosts: '8' } },
        ],
      },
    ],
  },
  density: {
    title: 'Density Calculator',
    buttonLabel: 'Calculate density',
    emptyHistory: 'Recent density calculations will appear here.',
    privacyNote: 'Density calculations stay in this browser tab.',
    modes: [
      {
        id: 'density',
        label: 'm/V',
        symbol: 'rho',
        fields: [numberField('mass', 'Mass'), numberField('volume', 'Volume'), textField('unitLabel', 'Unit label', 'g/mL')],
        defaultInputs: { mass: '27', volume: '10', unitLabel: 'g/mL' },
        examples: [
          { label: 'Lab sample', inputs: { mass: '27', volume: '10', unitLabel: 'g/mL' } },
          { label: 'Box material', inputs: { mass: '15', volume: '2', unitLabel: 'kg/m3' } },
          { label: 'Liquid', inputs: { mass: '997', volume: '1000', unitLabel: 'g/mL' } },
        ],
      },
    ],
  },
  mass: {
    title: 'Mass Calculator',
    buttonLabel: 'Calculate mass',
    emptyHistory: 'Recent mass calculations will appear here.',
    privacyNote: 'Mass calculations stay in this browser tab.',
    modes: [
      {
        id: 'density-volume',
        label: 'Density x volume',
        symbol: 'm',
        fields: [numberField('density', 'Density'), numberField('volume', 'Volume'), textField('unitLabel', 'Unit label', 'kg')],
        defaultInputs: { density: '2.7', volume: '10', unitLabel: 'g' },
        examples: [
          { label: 'Density sample', inputs: { density: '2.7', volume: '10', unitLabel: 'g' } },
          { label: 'Water-like', inputs: { density: '1', volume: '250', unitLabel: 'g' } },
          { label: 'Bulk material', inputs: { density: '1600', volume: '0.5', unitLabel: 'kg' } },
        ],
      },
    ],
  },
  weight: {
    title: 'Weight Calculator',
    buttonLabel: 'Calculate weight force',
    emptyHistory: 'Recent weight force calculations will appear here.',
    privacyNote: 'Weight force estimates stay in this browser tab and use the gravity value shown.',
    modes: [
      {
        id: 'weight-force',
        label: 'Force',
        symbol: 'N',
        fields: [numberField('massKg', 'Mass (kg)'), numberField('gravityMps2', 'Gravity (m/s^2)')],
        defaultInputs: { massKg: '70', gravityMps2: '9.80665' },
        examples: [
          { label: 'Earth standard', inputs: { massKg: '70', gravityMps2: '9.80665' } },
          { label: 'Moon example', inputs: { massKg: '70', gravityMps2: '1.62' } },
          { label: 'Small object', inputs: { massKg: '2.5', gravityMps2: '9.80665' } },
        ],
      },
    ],
  },
  speed: {
    title: 'Speed Calculator',
    buttonLabel: 'Calculate speed',
    emptyHistory: 'Recent speed calculations will appear here.',
    privacyNote: 'Speed calculations stay in this browser tab.',
    modes: [
      {
        id: 'speed',
        label: 'Distance / time',
        symbol: 'MPH',
        fields: [numberField('distanceMiles', 'Distance (mi)'), integerField('hours', 'Hours'), integerField('minutes', 'Minutes'), integerField('seconds', 'Seconds')],
        defaultInputs: { distanceMiles: '26.2', hours: '3', minutes: '45', seconds: '0' },
        examples: [
          { label: 'Marathon', inputs: { distanceMiles: '26.2', hours: '3', minutes: '45', seconds: '0' } },
          { label: 'Drive', inputs: { distanceMiles: '180', hours: '3', minutes: '0', seconds: '0' } },
          { label: 'Sprint', inputs: { distanceMiles: '0.0621371', hours: '0', minutes: '0', seconds: '12' } },
        ],
      },
    ],
  },
  'roman-numeral': {
    title: 'Roman Numeral Converter',
    buttonLabel: 'Convert Roman numeral',
    emptyHistory: 'Recent Roman numeral conversions will appear here.',
    privacyNote: 'Roman numeral conversions stay in this browser tab.',
    modes: [
      {
        id: 'roman',
        label: 'Convert',
        symbol: 'XIV',
        fields: [selectField('operation', 'Operation', romanModeOptions), textField('value', 'Value', '2026 or MMXXVI')],
        defaultInputs: { operation: 'number-to-roman', value: '2026' },
        examples: [
          { label: '2026', inputs: { operation: 'number-to-roman', value: '2026' } },
          { label: 'MMXXVI', inputs: { operation: 'roman-to-number', value: 'MMXXVI' } },
          { label: '3999', inputs: { operation: 'number-to-roman', value: '3999' } },
        ],
      },
    ],
  },
  base64: {
    title: 'Base64 Encode / Decode',
    buttonLabel: 'Run Base64 tool',
    emptyHistory: 'Recent Base64 conversions will appear here.',
    privacyNote: 'Base64 encoding and decoding runs locally in your browser tab.',
    modes: [
      {
        id: 'base64',
        label: 'Text',
        symbol: '64',
        fields: [selectField('operation', 'Operation', textOperationOptions), textField('text', 'Text', 'Hello tools')],
        defaultInputs: { operation: 'encode', text: 'Hello tools' },
        examples: [
          { label: 'Encode text', inputs: { operation: 'encode', text: 'Hello tools' } },
          { label: 'Decode text', inputs: { operation: 'decode', text: 'SGVsbG8gdG9vbHM=' } },
          { label: 'Unicode', inputs: { operation: 'encode', text: 'cafe math' } },
        ],
      },
    ],
  },
  'url-encode-decode': {
    title: 'URL Encode / Decode',
    buttonLabel: 'Run URL tool',
    emptyHistory: 'Recent URL conversions will appear here.',
    privacyNote: 'URL encoding and decoding runs locally in your browser tab.',
    modes: [
      {
        id: 'url',
        label: 'Component',
        symbol: '%20',
        fields: [selectField('operation', 'Operation', textOperationOptions), textField('text', 'Text', 'price=10&tax=2'), checkboxField('plusSpaces', 'Use plus for spaces')],
        defaultInputs: { operation: 'encode', text: 'price=10&tax=2', plusSpaces: 'false' },
        examples: [
          { label: 'Query value', inputs: { operation: 'encode', text: 'price=10&tax=2', plusSpaces: 'false' } },
          { label: 'Decode URL text', inputs: { operation: 'decode', text: 'price%3D10%26tax%3D2', plusSpaces: 'false' } },
          { label: 'Form spaces', inputs: { operation: 'encode', text: 'hello tools', plusSpaces: 'true' } },
        ],
      },
    ],
  },
  'day-of-week': {
    title: 'Day of the Week Calculator',
    buttonLabel: 'Find day of week',
    emptyHistory: 'Recent day-of-week checks will appear here.',
    privacyNote: 'Date checks use UTC calendar dates in this browser tab.',
    modes: [
      {
        id: 'day-of-week',
        label: 'Date',
        symbol: 'DAY',
        fields: [dateField('date', 'Date')],
        defaultInputs: { date: '2026-04-30' },
        examples: [
          { label: 'Today', inputs: { date: '2026-04-30' } },
          { label: 'New Year 2027', inputs: { date: '2027-01-01' } },
          { label: 'Leap day', inputs: { date: '2024-02-29' } },
        ],
      },
    ],
  },
  height: {
    title: 'Height Calculator',
    buttonLabel: 'Estimate height',
    emptyHistory: 'Recent height estimates will appear here.',
    privacyNote: 'Height estimates run locally and are only rough family-height math.',
    modes: [
      {
        id: 'mid-parental',
        label: 'Parent heights',
        symbol: 'HT',
        fields: [
          selectField('childSex', 'Child estimate', sexOptions),
          integerField('motherFeet', 'Mother feet', '5'),
          numberField('motherInches', 'Mother extra inches', '4'),
          integerField('fatherFeet', 'Father feet', '5'),
          numberField('fatherInches', 'Father extra inches', '10'),
        ],
        defaultInputs: { childSex: 'male', motherFeet: '5', motherInches: '4', fatherFeet: '5', fatherInches: '10' },
        examples: [
          { label: 'Boy estimate', inputs: { childSex: 'male', motherFeet: '5', motherInches: '4', fatherFeet: '5', fatherInches: '10' } },
          { label: 'Girl estimate', inputs: { childSex: 'female', motherFeet: '5', motherInches: '3', fatherFeet: '6', fatherInches: '0' } },
        ],
      },
    ],
  },
  'bra-size': {
    title: 'Bra Size Calculator',
    buttonLabel: 'Estimate bra size',
    emptyHistory: 'Recent bra size estimates will appear here.',
    privacyNote: 'Measurements stay in this browser tab. Fit varies by brand and style.',
    modes: [
      {
        id: 'us-band-cup',
        label: 'US estimate',
        symbol: 'BRA',
        fields: [numberField('underbustInches', 'Underbust inches', '32'), numberField('bustInches', 'Bust inches', '36')],
        defaultInputs: { underbustInches: '32', bustInches: '36' },
        examples: [
          { label: '32D estimate', inputs: { underbustInches: '32', bustInches: '36' } },
          { label: '34B estimate', inputs: { underbustInches: '33', bustInches: '36' } },
        ],
      },
    ],
  },
  'voltage-drop': {
    title: 'Voltage Drop Calculator',
    buttonLabel: 'Calculate voltage drop',
    emptyHistory: 'Recent voltage drop estimates will appear here.',
    privacyNote: 'This is a planning estimate only. Electrical design should be checked by a qualified professional.',
    modes: [
      {
        id: 'awg-copper',
        label: 'Copper AWG',
        symbol: 'VD',
        fields: [
          numberField('sourceVoltage', 'Source voltage', '120'),
          numberField('currentAmps', 'Current amps', '15'),
          numberField('oneWayLengthFeet', 'One-way length feet', '75'),
          selectField('wireGauge', 'Copper wire size', copperAwgOptions),
          selectField('phase', 'Circuit type', phaseOptions),
        ],
        defaultInputs: { sourceVoltage: '120', currentAmps: '15', oneWayLengthFeet: '75', wireGauge: '12', phase: 'single' },
        examples: [
          { label: '120 V branch', inputs: { sourceVoltage: '120', currentAmps: '15', oneWayLengthFeet: '75', wireGauge: '12', phase: 'single' } },
          { label: '240 V run', inputs: { sourceVoltage: '240', currentAmps: '30', oneWayLengthFeet: '100', wireGauge: '8', phase: 'single' } },
        ],
      },
    ],
  },
  btu: {
    title: 'BTU Calculator',
    buttonLabel: 'Estimate BTU',
    emptyHistory: 'Recent BTU estimates will appear here.',
    privacyNote: 'BTU estimates use room sizing assumptions in your browser and do not replace HVAC design.',
    modes: [
      {
        id: 'room-cooling',
        label: 'Room cooling',
        symbol: 'BTU',
        fields: [
          numberField('squareFeet', 'Room square feet', '300'),
          numberField('ceilingHeightFeet', 'Ceiling height feet', '8'),
          selectField('sunlight', 'Sunlight', sunlightOptions),
          integerField('people', 'Regular people in room', '2'),
          checkboxField('kitchen', 'Kitchen heat load'),
        ],
        defaultInputs: { squareFeet: '300', ceilingHeightFeet: '8', sunlight: 'normal', people: '2', kitchen: 'false' },
        examples: [
          { label: 'Bedroom', inputs: { squareFeet: '180', ceilingHeightFeet: '8', sunlight: 'normal', people: '2', kitchen: 'false' } },
          { label: 'Sunny living room', inputs: { squareFeet: '420', ceilingHeightFeet: '9', sunlight: 'sunny', people: '3', kitchen: 'false' } },
        ],
      },
    ],
  },
  stair: {
    title: 'Stair Calculator',
    buttonLabel: 'Calculate stair layout',
    emptyHistory: 'Recent stair layouts will appear here.',
    privacyNote: 'Stair math stays local. Building-code and safety checks must be verified separately.',
    modes: [
      {
        id: 'rise-run',
        label: 'Rise and run',
        symbol: 'STR',
        fields: [
          numberField('totalRiseInches', 'Total rise inches', '108'),
          numberField('targetRiserInches', 'Target riser inches', '7.5'),
          numberField('treadDepthInches', 'Tread depth inches', '10'),
        ],
        defaultInputs: { totalRiseInches: '108', targetRiserInches: '7.5', treadDepthInches: '10' },
        examples: [
          { label: 'Basement stairs', inputs: { totalRiseInches: '108', targetRiserInches: '7.5', treadDepthInches: '10' } },
          { label: 'Short deck', inputs: { totalRiseInches: '36', targetRiserInches: '7', treadDepthInches: '11' } },
        ],
      },
    ],
  },
  resistor: {
    title: 'Resistor Calculator',
    buttonLabel: 'Decode resistor',
    emptyHistory: 'Recent resistor color decodes will appear here.',
    privacyNote: 'Resistor color decoding is local and for component identification, not live circuit testing.',
    modes: [
      {
        id: 'four-band',
        label: '4-band color',
        symbol: 'OHM',
        fields: [
          selectField('band1', 'First digit band', resistorDigitOptions),
          selectField('band2', 'Second digit band', resistorDigitOptions),
          selectField('multiplier', 'Multiplier band', resistorMultiplierOptions),
          selectField('tolerance', 'Tolerance band', resistorToleranceOptions),
        ],
        defaultInputs: { band1: 'brown', band2: 'black', multiplier: 'red', tolerance: 'gold' },
        examples: [
          { label: '1 kOhm', inputs: { band1: 'brown', band2: 'black', multiplier: 'red', tolerance: 'gold' } },
          { label: '4.7 kOhm', inputs: { band1: 'yellow', band2: 'violet', multiplier: 'red', tolerance: 'gold' } },
        ],
      },
    ],
  },
  'ohms-law': {
    title: 'Ohms Law Calculator',
    buttonLabel: 'Calculate circuit values',
    emptyHistory: 'Recent Ohm law calculations will appear here.',
    privacyNote: 'This simple resistor math stays in your browser. Use proper electrical safety practices.',
    modes: [
      {
        id: 'voltage-current',
        label: 'V and I',
        symbol: 'VIR',
        fields: [numberField('firstValue', 'Voltage V', '12'), numberField('secondValue', 'Current A', '2')],
        defaultInputs: { firstValue: '12', secondValue: '2' },
        examples: [{ label: '12 V and 2 A', inputs: { firstValue: '12', secondValue: '2' } }],
      },
      {
        id: 'voltage-resistance',
        label: 'V and R',
        symbol: 'VIR',
        fields: [numberField('firstValue', 'Voltage V', '12'), numberField('secondValue', 'Resistance ohms', '6')],
        defaultInputs: { firstValue: '12', secondValue: '6' },
        examples: [{ label: '12 V and 6 ohms', inputs: { firstValue: '12', secondValue: '6' } }],
      },
      {
        id: 'current-resistance',
        label: 'I and R',
        symbol: 'VIR',
        fields: [numberField('firstValue', 'Current A', '2'), numberField('secondValue', 'Resistance ohms', '6')],
        defaultInputs: { firstValue: '2', secondValue: '6' },
        examples: [{ label: '2 A and 6 ohms', inputs: { firstValue: '2', secondValue: '6' } }],
      },
    ],
  },
  electricity: {
    title: 'Electricity Calculator',
    buttonLabel: 'Estimate electricity cost',
    emptyHistory: 'Recent electricity estimates will appear here.',
    privacyNote: 'Electricity cost math stays local and uses the rate you enter.',
    modes: [
      {
        id: 'energy-cost',
        label: 'Energy cost',
        symbol: 'KWH',
        fields: [
          numberField('watts', 'Watts', '1000'),
          numberField('hoursPerDay', 'Hours per day', '3'),
          numberField('days', 'Days', '30'),
          numberField('ratePerKwh', 'Rate per kWh', '0.16'),
        ],
        defaultInputs: { watts: '1000', hoursPerDay: '3', days: '30', ratePerKwh: '0.16' },
        examples: [
          { label: 'Space heater month', inputs: { watts: '1500', hoursPerDay: '4', days: '30', ratePerKwh: '0.16' } },
          { label: 'LED bulb year', inputs: { watts: '10', hoursPerDay: '5', days: '365', ratePerKwh: '0.16' } },
        ],
      },
    ],
  },
  'shoe-size': {
    title: 'Shoe Size Conversion',
    buttonLabel: 'Convert shoe size',
    emptyHistory: 'Recent shoe size estimates will appear here.',
    privacyNote: 'Shoe conversion is approximate and stays local. Brands and lasts vary.',
    modes: [
      {
        id: 'length-to-sizes',
        label: 'Foot length',
        symbol: 'SHOE',
        fields: [numberField('footLengthCm', 'Foot length cm', '26')],
        defaultInputs: { footLengthCm: '26' },
        examples: [
          { label: '26 cm foot', inputs: { footLengthCm: '26' } },
          { label: '24 cm foot', inputs: { footLengthCm: '24' } },
        ],
      },
    ],
  },
  molarity: {
    title: 'Molarity Calculator',
    buttonLabel: 'Calculate molarity',
    emptyHistory: 'Recent molarity calculations will appear here.',
    privacyNote: 'Chemistry math runs locally. Lab work needs measured values and safety procedures.',
    modes: [
      {
        id: 'moles-volume',
        label: 'Moles and volume',
        symbol: 'M',
        fields: [numberField('moles', 'Moles solute', '0.5'), numberField('volumeLiters', 'Volume liters', '1')],
        defaultInputs: { moles: '0.5', volumeLiters: '1' },
        examples: [{ label: '0.5 mol in 1 L', inputs: { moles: '0.5', volumeLiters: '1' } }],
      },
      {
        id: 'grams-volume',
        label: 'Grams and molar mass',
        symbol: 'M',
        fields: [
          numberField('grams', 'Grams solute', '58.44'),
          numberField('molarMass', 'Molar mass g/mol', '58.44'),
          numberField('volumeLiters', 'Volume liters', '1'),
        ],
        defaultInputs: { grams: '58.44', molarMass: '58.44', volumeLiters: '1' },
        examples: [{ label: 'NaCl solution', inputs: { grams: '58.44', molarMass: '58.44', volumeLiters: '1' } }],
      },
    ],
  },
  'molecular-weight': {
    title: 'Molecular Weight Calculator',
    buttonLabel: 'Calculate molecular weight',
    emptyHistory: 'Recent formula weights will appear here.',
    privacyNote: 'Formula parsing happens locally. Atomic weights are rounded reference values.',
    modes: [
      {
        id: 'formula',
        label: 'Formula',
        symbol: 'MW',
        fields: [textField('formula', 'Chemical formula', 'H2O')],
        defaultInputs: { formula: 'H2O' },
        examples: [
          { label: 'Water', inputs: { formula: 'H2O' } },
          { label: 'Glucose', inputs: { formula: 'C6H12O6' } },
          { label: 'Calcium hydroxide', inputs: { formula: 'Ca(OH)2' } },
        ],
      },
    ],
  },
  sleep: {
    title: 'Sleep Calculator',
    buttonLabel: 'Calculate sleep time',
    emptyHistory: 'Recent sleep time checks will appear here.',
    privacyNote: 'Sleep timing stays local. It is a planning helper, not medical advice.',
    modes: [
      {
        id: 'wake-up',
        label: 'Wake-up time',
        symbol: 'ZZZ',
        fields: [timeField('inputTime', 'Wake-up time'), integerField('cycles', 'Sleep cycles', '5'), integerField('fallAsleepMinutes', 'Minutes to fall asleep', '15')],
        defaultInputs: { inputTime: '07:00', cycles: '5', fallAsleepMinutes: '15' },
        examples: [{ label: 'Wake at 7:00', inputs: { inputTime: '07:00', cycles: '5', fallAsleepMinutes: '15' } }],
      },
      {
        id: 'bedtime',
        label: 'Bedtime',
        symbol: 'ZZZ',
        fields: [timeField('inputTime', 'Bedtime'), integerField('cycles', 'Sleep cycles', '5'), integerField('fallAsleepMinutes', 'Minutes to fall asleep', '15')],
        defaultInputs: { inputTime: '22:30', cycles: '5', fallAsleepMinutes: '15' },
        examples: [{ label: 'Bed at 10:30 PM', inputs: { inputTime: '22:30', cycles: '5', fallAsleepMinutes: '15' } }],
      },
    ],
  },
  'tire-size': {
    title: 'Tire Size Calculator',
    buttonLabel: 'Calculate tire size',
    emptyHistory: 'Recent tire size calculations will appear here.',
    privacyNote: 'Tire size math stays local. Always follow vehicle and tire manufacturer fitment guidance.',
    modes: [
      {
        id: 'metric-tire',
        label: 'Metric tire',
        symbol: 'TIRE',
        fields: [numberField('widthMm', 'Width mm', '225'), numberField('aspectRatio', 'Aspect ratio', '60'), numberField('wheelDiameterInches', 'Wheel diameter inches', '16')],
        defaultInputs: { widthMm: '225', aspectRatio: '60', wheelDiameterInches: '16' },
        examples: [{ label: '225/60R16', inputs: { widthMm: '225', aspectRatio: '60', wheelDiameterInches: '16' } }],
      },
    ],
  },
  roofing: {
    title: 'Roofing Calculator',
    buttonLabel: 'Estimate roofing',
    emptyHistory: 'Recent roofing estimates will appear here.',
    privacyNote: 'Roofing estimates stay local and assume a simple roof footprint.',
    modes: [
      {
        id: 'shingles',
        label: 'Shingles',
        symbol: 'ROOF',
        fields: [
          numberField('lengthFeet', 'Footprint length feet', '40'),
          numberField('widthFeet', 'Footprint width feet', '30'),
          numberField('pitchRisePer12', 'Pitch rise per 12', '6'),
          numberField('wastePercent', 'Waste percent', '10'),
        ],
        defaultInputs: { lengthFeet: '40', widthFeet: '30', pitchRisePer12: '6', wastePercent: '10' },
        examples: [{ label: '40 x 30, 6/12', inputs: { lengthFeet: '40', widthFeet: '30', pitchRisePer12: '6', wastePercent: '10' } }],
      },
    ],
  },
  tile: {
    title: 'Tile Calculator',
    buttonLabel: 'Estimate tile',
    emptyHistory: 'Recent tile estimates will appear here.',
    privacyNote: 'Tile estimates stay local and use the tile size and waste percent you enter.',
    modes: [
      {
        id: 'floor-tile',
        label: 'Area and tile',
        symbol: 'TILE',
        fields: [
          numberField('areaSquareFeet', 'Area square feet', '120'),
          numberField('tileLengthInches', 'Tile length inches', '12'),
          numberField('tileWidthInches', 'Tile width inches', '12'),
          numberField('wastePercent', 'Waste percent', '10'),
        ],
        defaultInputs: { areaSquareFeet: '120', tileLengthInches: '12', tileWidthInches: '12', wastePercent: '10' },
        examples: [{ label: '120 ft2, 12 x 12', inputs: { areaSquareFeet: '120', tileLengthInches: '12', tileWidthInches: '12', wastePercent: '10' } }],
      },
    ],
  },
  mulch: {
    title: 'Mulch Calculator',
    buttonLabel: 'Estimate mulch',
    emptyHistory: 'Recent mulch estimates will appear here.',
    privacyNote: 'Mulch estimates stay local and assume an even average depth.',
    modes: [
      {
        id: 'area-depth',
        label: 'Area and depth',
        symbol: 'MUL',
        fields: [numberField('areaSquareFeet', 'Area square feet', '200'), numberField('depthInches', 'Depth inches', '3'), numberField('wastePercent', 'Waste percent', '5')],
        defaultInputs: { areaSquareFeet: '200', depthInches: '3', wastePercent: '5' },
        examples: [{ label: '200 ft2 at 3 in', inputs: { areaSquareFeet: '200', depthInches: '3', wastePercent: '5' } }],
      },
    ],
  },
  gravel: {
    title: 'Gravel Calculator',
    buttonLabel: 'Estimate gravel',
    emptyHistory: 'Recent gravel estimates will appear here.',
    privacyNote: 'Gravel estimates stay local. Supplier density and compaction can change tons needed.',
    modes: [
      {
        id: 'area-depth',
        label: 'Area and depth',
        symbol: 'GRV',
        fields: [
          numberField('lengthFeet', 'Length feet', '20'),
          numberField('widthFeet', 'Width feet', '10'),
          numberField('depthInches', 'Depth inches', '3'),
          numberField('tonsPerCubicYard', 'Tons per cubic yard', '1.4'),
        ],
        defaultInputs: { lengthFeet: '20', widthFeet: '10', depthInches: '3', tonsPerCubicYard: '1.4' },
        examples: [{ label: 'Driveway bed', inputs: { lengthFeet: '20', widthFeet: '10', depthInches: '3', tonsPerCubicYard: '1.4' } }],
      },
    ],
  },
  paint: {
    title: 'Paint Calculator',
    buttonLabel: 'Estimate paint',
    emptyHistory: 'Recent paint estimates will appear here.',
    privacyNote: 'Paint estimates stay local and use the room dimensions, openings, coats, and coverage you enter.',
    modes: [
      {
        id: 'room-walls',
        label: 'Room walls',
        symbol: 'PAINT',
        fields: [
          numberField('lengthFeet', 'Room length feet', '12'),
          numberField('widthFeet', 'Room width feet', '10'),
          numberField('wallHeightFeet', 'Wall height feet', '8'),
          integerField('doors', 'Doors', '1'),
          integerField('windows', 'Windows', '2'),
          integerField('coats', 'Coats', '2'),
          numberField('coverageSquareFeetPerGallon', 'Coverage ft2 per gallon', '350'),
          numberField('wastePercent', 'Extra percent', '10'),
        ],
        defaultInputs: { lengthFeet: '12', widthFeet: '10', wallHeightFeet: '8', doors: '1', windows: '2', coats: '2', coverageSquareFeetPerGallon: '350', wastePercent: '10' },
        examples: [
          { label: 'Small bedroom', inputs: { lengthFeet: '12', widthFeet: '10', wallHeightFeet: '8', doors: '1', windows: '2', coats: '2', coverageSquareFeetPerGallon: '350', wastePercent: '10' } },
          { label: 'Living room', inputs: { lengthFeet: '18', widthFeet: '14', wallHeightFeet: '9', doors: '2', windows: '3', coats: '2', coverageSquareFeetPerGallon: '375', wastePercent: '10' } },
        ],
      },
    ],
  },
  drywall: {
    title: 'Drywall Calculator',
    buttonLabel: 'Estimate drywall',
    emptyHistory: 'Recent drywall estimates will appear here.',
    privacyNote: 'Drywall estimates stay local and use the sheet size and waste percent you choose.',
    modes: [
      {
        id: 'sheet-count',
        label: 'Sheet count',
        symbol: 'DRY',
        fields: [
          numberField('areaSquareFeet', 'Wall or ceiling area ft2', '480'),
          numberField('sheetLengthFeet', 'Sheet length feet', '8'),
          numberField('sheetWidthFeet', 'Sheet width feet', '4'),
          numberField('wastePercent', 'Waste percent', '10'),
        ],
        defaultInputs: { areaSquareFeet: '480', sheetLengthFeet: '8', sheetWidthFeet: '4', wastePercent: '10' },
        examples: [
          { label: '480 ft2 with 4x8 sheets', inputs: { areaSquareFeet: '480', sheetLengthFeet: '8', sheetWidthFeet: '4', wastePercent: '10' } },
          { label: 'Basement room', inputs: { areaSquareFeet: '720', sheetLengthFeet: '12', sheetWidthFeet: '4', wastePercent: '12' } },
        ],
      },
    ],
  },
  carpet: {
    title: 'Carpet Calculator',
    buttonLabel: 'Estimate carpet',
    emptyHistory: 'Recent carpet estimates will appear here.',
    privacyNote: 'Carpet estimates stay local and assume one simple rectangular area.',
    modes: [
      {
        id: 'room-carpet',
        label: 'Room area',
        symbol: 'CARP',
        fields: [
          numberField('lengthFeet', 'Room length feet', '15'),
          numberField('widthFeet', 'Room width feet', '12'),
          numberField('rollWidthFeet', 'Roll width feet', '12'),
          numberField('wastePercent', 'Waste percent', '10'),
        ],
        defaultInputs: { lengthFeet: '15', widthFeet: '12', rollWidthFeet: '12', wastePercent: '10' },
        examples: [
          { label: 'Bedroom carpet', inputs: { lengthFeet: '15', widthFeet: '12', rollWidthFeet: '12', wastePercent: '10' } },
          { label: 'Large room', inputs: { lengthFeet: '22', widthFeet: '16', rollWidthFeet: '12', wastePercent: '12' } },
        ],
      },
    ],
  },
  flooring: {
    title: 'Flooring Calculator',
    buttonLabel: 'Estimate flooring',
    emptyHistory: 'Recent flooring estimates will appear here.',
    privacyNote: 'Flooring estimates stay local and use your area, waste, box coverage, and optional box price.',
    modes: [
      {
        id: 'box-count',
        label: 'Boxes',
        symbol: 'FLOOR',
        fields: [
          numberField('areaSquareFeet', 'Floor area ft2', '240'),
          numberField('wastePercent', 'Waste percent', '10'),
          numberField('boxCoverageSquareFeet', 'Box coverage ft2', '24'),
          numberField('pricePerBox', 'Price per box (optional)', '48'),
        ],
        defaultInputs: { areaSquareFeet: '240', wastePercent: '10', boxCoverageSquareFeet: '24', pricePerBox: '48' },
        examples: [
          { label: 'Living room floor', inputs: { areaSquareFeet: '240', wastePercent: '10', boxCoverageSquareFeet: '24', pricePerBox: '48' } },
          { label: 'Small room', inputs: { areaSquareFeet: '120', wastePercent: '8', boxCoverageSquareFeet: '22.5', pricePerBox: '' } },
        ],
      },
    ],
  },
  wallpaper: {
    title: 'Wallpaper Calculator',
    buttonLabel: 'Estimate wallpaper',
    emptyHistory: 'Recent wallpaper estimates will appear here.',
    privacyNote: 'Wallpaper estimates stay local and use simple room walls, openings, roll coverage, and waste.',
    modes: [
      {
        id: 'room-rolls',
        label: 'Room rolls',
        symbol: 'WALL',
        fields: [
          numberField('roomLengthFeet', 'Room length feet', '12'),
          numberField('roomWidthFeet', 'Room width feet', '10'),
          numberField('wallHeightFeet', 'Wall height feet', '8'),
          integerField('doors', 'Doors', '1'),
          integerField('windows', 'Windows', '2'),
          numberField('rollCoverageSquareFeet', 'Roll coverage ft2', '56'),
          numberField('wastePercent', 'Waste percent', '10'),
        ],
        defaultInputs: { roomLengthFeet: '12', roomWidthFeet: '10', wallHeightFeet: '8', doors: '1', windows: '2', rollCoverageSquareFeet: '56', wastePercent: '10' },
        examples: [
          { label: 'Bedroom walls', inputs: { roomLengthFeet: '12', roomWidthFeet: '10', wallHeightFeet: '8', doors: '1', windows: '2', rollCoverageSquareFeet: '56', wastePercent: '10' } },
          { label: 'Small office', inputs: { roomLengthFeet: '10', roomWidthFeet: '9', wallHeightFeet: '8', doors: '1', windows: '1', rollCoverageSquareFeet: '48', wastePercent: '12' } },
        ],
      },
    ],
  },
  fence: {
    title: 'Fence Calculator',
    buttonLabel: 'Estimate fence',
    emptyHistory: 'Recent fence estimates will appear here.',
    privacyNote: 'Fence estimates stay local and use simple perimeter, gate, panel, and post spacing assumptions.',
    modes: [
      {
        id: 'panel-fence',
        label: 'Panels and posts',
        symbol: 'FENCE',
        fields: [
          numberField('perimeterFeet', 'Fence perimeter feet', '120'),
          numberField('panelWidthFeet', 'Panel width feet', '8'),
          numberField('postSpacingFeet', 'Post spacing feet', '8'),
          integerField('gateCount', 'Gate count', '1'),
          numberField('gateWidthFeet', 'Gate width feet', '4'),
        ],
        defaultInputs: { perimeterFeet: '120', panelWidthFeet: '8', postSpacingFeet: '8', gateCount: '1', gateWidthFeet: '4' },
        examples: [
          { label: 'Backyard fence', inputs: { perimeterFeet: '120', panelWidthFeet: '8', postSpacingFeet: '8', gateCount: '1', gateWidthFeet: '4' } },
          { label: 'Two gates', inputs: { perimeterFeet: '180', panelWidthFeet: '6', postSpacingFeet: '6', gateCount: '2', gateWidthFeet: '4' } },
        ],
      },
    ],
  },
  'deck-cost': {
    title: 'Deck Cost Calculator',
    buttonLabel: 'Estimate deck cost',
    emptyHistory: 'Recent deck estimates will appear here.',
    privacyNote: 'Deck cost estimates stay local and are rough planning numbers, not contractor quotes.',
    modes: [
      {
        id: 'deck-cost',
        label: 'Deck cost',
        symbol: 'DECK',
        fields: [
          numberField('lengthFeet', 'Deck length feet', '16'),
          numberField('widthFeet', 'Deck width feet', '12'),
          numberField('wastePercent', 'Decking waste percent', '10'),
          numberField('deckCostPerSquareFoot', 'Decking cost per ft2', '12'),
          numberField('railingLinearFeet', 'Railing linear feet', '40'),
          numberField('railingCostPerFoot', 'Railing cost per foot', '35'),
          numberField('stairsCost', 'Stairs allowance', '750'),
        ],
        defaultInputs: { lengthFeet: '16', widthFeet: '12', wastePercent: '10', deckCostPerSquareFoot: '12', railingLinearFeet: '40', railingCostPerFoot: '35', stairsCost: '750' },
        examples: [
          { label: 'Small deck', inputs: { lengthFeet: '16', widthFeet: '12', wastePercent: '10', deckCostPerSquareFoot: '12', railingLinearFeet: '40', railingCostPerFoot: '35', stairsCost: '750' } },
          { label: 'Larger deck', inputs: { lengthFeet: '24', widthFeet: '14', wastePercent: '10', deckCostPerSquareFoot: '18', railingLinearFeet: '58', railingCostPerFoot: '45', stairsCost: '1200' } },
        ],
      },
    ],
  },
  paver: {
    title: 'Paver Calculator',
    buttonLabel: 'Estimate pavers',
    emptyHistory: 'Recent paver estimates will appear here.',
    privacyNote: 'Paver estimates stay local and use the paver dimensions and waste percent you enter.',
    modes: [
      {
        id: 'paver-count',
        label: 'Paver count',
        symbol: 'PAVE',
        fields: [
          numberField('areaSquareFeet', 'Project area ft2', '180'),
          numberField('paverLengthInches', 'Paver length inches', '8'),
          numberField('paverWidthInches', 'Paver width inches', '4'),
          numberField('wastePercent', 'Waste percent', '10'),
        ],
        defaultInputs: { areaSquareFeet: '180', paverLengthInches: '8', paverWidthInches: '4', wastePercent: '10' },
        examples: [
          { label: 'Patio pavers', inputs: { areaSquareFeet: '180', paverLengthInches: '8', paverWidthInches: '4', wastePercent: '10' } },
          { label: 'Large pavers', inputs: { areaSquareFeet: '240', paverLengthInches: '12', paverWidthInches: '12', wastePercent: '8' } },
        ],
      },
    ],
  },
  siding: {
    title: 'Siding Calculator',
    buttonLabel: 'Estimate siding',
    emptyHistory: 'Recent siding estimates will appear here.',
    privacyNote: 'Siding estimates stay local and use wall area, openings, waste, and optional price per 100-square-foot square.',
    modes: [
      {
        id: 'siding-squares',
        label: 'Squares',
        symbol: 'SIDE',
        fields: [
          numberField('wallAreaSquareFeet', 'Wall area ft2', '1200'),
          numberField('openingsSquareFeet', 'Doors/windows ft2', '120'),
          numberField('wastePercent', 'Waste percent', '10'),
          numberField('pricePerSquare', 'Price per square (optional)', '180'),
        ],
        defaultInputs: { wallAreaSquareFeet: '1200', openingsSquareFeet: '120', wastePercent: '10', pricePerSquare: '180' },
        examples: [
          { label: 'Small house exterior', inputs: { wallAreaSquareFeet: '1200', openingsSquareFeet: '120', wastePercent: '10', pricePerSquare: '180' } },
          { label: 'One wall', inputs: { wallAreaSquareFeet: '240', openingsSquareFeet: '35', wastePercent: '12', pricePerSquare: '' } },
        ],
      },
    ],
  },
  brick: {
    title: 'Brick Calculator',
    buttonLabel: 'Estimate bricks',
    emptyHistory: 'Recent brick estimates will appear here.',
    privacyNote: 'Brick estimates stay local and use face coverage, mortar joint, wall area, and waste.',
    modes: [
      {
        id: 'wall-face',
        label: 'Wall face',
        symbol: 'BRICK',
        fields: [
          numberField('wallAreaSquareFeet', 'Wall area ft2', '120'),
          numberField('brickLengthInches', 'Brick length inches', '7.625'),
          numberField('brickHeightInches', 'Brick height inches', '2.25'),
          numberField('mortarJointInches', 'Mortar joint inches', '0.375'),
          numberField('wastePercent', 'Waste percent', '10'),
        ],
        defaultInputs: { wallAreaSquareFeet: '120', brickLengthInches: '7.625', brickHeightInches: '2.25', mortarJointInches: '0.375', wastePercent: '10' },
        examples: [
          { label: 'Modular brick wall', inputs: { wallAreaSquareFeet: '120', brickLengthInches: '7.625', brickHeightInches: '2.25', mortarJointInches: '0.375', wastePercent: '10' } },
          { label: 'Garden wall face', inputs: { wallAreaSquareFeet: '64', brickLengthInches: '7.625', brickHeightInches: '2.25', mortarJointInches: '0.375', wastePercent: '12' } },
        ],
      },
    ],
  },
  'concrete-block': {
    title: 'Concrete Block Calculator',
    buttonLabel: 'Estimate blocks',
    emptyHistory: 'Recent concrete block estimates will appear here.',
    privacyNote: 'Concrete block estimates stay local and use simple wall face coverage, openings, and waste.',
    modes: [
      {
        id: 'block-wall',
        label: 'Block wall',
        symbol: 'CMU',
        fields: [
          numberField('wallLengthFeet', 'Wall length feet', '40'),
          numberField('wallHeightFeet', 'Wall height feet', '8'),
          numberField('blockLengthInches', 'Nominal block length inches', '16'),
          numberField('blockHeightInches', 'Nominal block height inches', '8'),
          numberField('openingsSquareFeet', 'Openings ft2', '20'),
          numberField('wastePercent', 'Waste percent', '5'),
        ],
        defaultInputs: { wallLengthFeet: '40', wallHeightFeet: '8', blockLengthInches: '16', blockHeightInches: '8', openingsSquareFeet: '20', wastePercent: '5' },
        examples: [
          { label: '40 ft block wall', inputs: { wallLengthFeet: '40', wallHeightFeet: '8', blockLengthInches: '16', blockHeightInches: '8', openingsSquareFeet: '20', wastePercent: '5' } },
          { label: 'Short garden wall', inputs: { wallLengthFeet: '24', wallHeightFeet: '3', blockLengthInches: '16', blockHeightInches: '8', openingsSquareFeet: '0', wastePercent: '8' } },
        ],
      },
    ],
  },
  rebar: {
    title: 'Rebar Calculator',
    buttonLabel: 'Estimate rebar',
    emptyHistory: 'Recent rebar grid estimates will appear here.',
    privacyNote: 'Rebar estimates stay local and are simple grid takeoffs, not structural design.',
    modes: [
      {
        id: 'grid',
        label: 'Grid',
        symbol: 'BAR',
        fields: [
          numberField('slabLengthFeet', 'Slab length feet', '20'),
          numberField('slabWidthFeet', 'Slab width feet', '12'),
          numberField('spacingInches', 'Bar spacing inches', '18'),
          numberField('barLengthFeet', 'Stock bar length feet', '20'),
          numberField('wastePercent', 'Waste percent', '10'),
        ],
        defaultInputs: { slabLengthFeet: '20', slabWidthFeet: '12', spacingInches: '18', barLengthFeet: '20', wastePercent: '10' },
        examples: [
          { label: '20 x 12 slab grid', inputs: { slabLengthFeet: '20', slabWidthFeet: '12', spacingInches: '18', barLengthFeet: '20', wastePercent: '10' } },
          { label: 'Garage pad', inputs: { slabLengthFeet: '24', slabWidthFeet: '20', spacingInches: '24', barLengthFeet: '20', wastePercent: '10' } },
        ],
      },
    ],
  },
  'board-foot': {
    title: 'Board Foot Calculator',
    buttonLabel: 'Calculate board feet',
    emptyHistory: 'Recent board-foot calculations will appear here.',
    privacyNote: 'Board-foot math stays local and measures lumber volume only.',
    modes: [
      {
        id: 'lumber-volume',
        label: 'Lumber volume',
        symbol: 'BF',
        fields: [
          numberField('thicknessInches', 'Thickness inches', '1'),
          numberField('widthInches', 'Width inches', '6'),
          numberField('lengthFeet', 'Length feet', '8'),
          integerField('quantity', 'Quantity', '4'),
        ],
        defaultInputs: { thicknessInches: '1', widthInches: '6', lengthFeet: '8', quantity: '4' },
        examples: [
          { label: 'Four 1x6 boards', inputs: { thicknessInches: '1', widthInches: '6', lengthFeet: '8', quantity: '4' } },
          { label: 'Rough lumber', inputs: { thicknessInches: '2', widthInches: '8', lengthFeet: '10', quantity: '3' } },
        ],
      },
    ],
  },
  'cubic-yard': {
    title: 'Cubic Yard Calculator',
    buttonLabel: 'Calculate cubic yards',
    emptyHistory: 'Recent cubic-yard estimates will appear here.',
    privacyNote: 'Cubic-yard estimates stay local and assume an even rectangular area.',
    modes: [
      {
        id: 'volume',
        label: 'Area and depth',
        symbol: 'YD3',
        fields: [
          numberField('lengthFeet', 'Length feet', '20'),
          numberField('widthFeet', 'Width feet', '10'),
          numberField('depthInches', 'Depth inches', '3'),
          numberField('wastePercent', 'Waste percent', '5'),
        ],
        defaultInputs: { lengthFeet: '20', widthFeet: '10', depthInches: '3', wastePercent: '5' },
        examples: [
          { label: 'Material bed', inputs: { lengthFeet: '20', widthFeet: '10', depthInches: '3', wastePercent: '5' } },
          { label: 'Deep fill', inputs: { lengthFeet: '12', widthFeet: '8', depthInches: '6', wastePercent: '10' } },
        ],
      },
    ],
  },
  'pool-volume': {
    title: 'Pool Volume Calculator',
    buttonLabel: 'Calculate pool volume',
    emptyHistory: 'Recent pool volume estimates will appear here.',
    privacyNote: 'Pool volume estimates stay local and use simple shape formulas.',
    modes: [
      {
        id: 'pool-volume',
        label: 'Pool volume',
        symbol: 'POOL',
        fields: [
          selectField('shape', 'Pool shape', poolShapeOptions),
          numberField('lengthFeet', 'Length or diameter feet', '24'),
          numberField('widthFeet', 'Width or diameter feet', '12'),
          numberField('averageDepthFeet', 'Average depth feet', '4.5'),
        ],
        defaultInputs: { shape: 'rectangle', lengthFeet: '24', widthFeet: '12', averageDepthFeet: '4.5' },
        examples: [
          { label: 'Rectangular pool', inputs: { shape: 'rectangle', lengthFeet: '24', widthFeet: '12', averageDepthFeet: '4.5' } },
          { label: 'Round pool', inputs: { shape: 'round', lengthFeet: '18', widthFeet: '18', averageDepthFeet: '4' } },
        ],
      },
    ],
  },
  sand: {
    title: 'Sand Calculator',
    buttonLabel: 'Estimate sand',
    emptyHistory: 'Recent sand estimates will appear here.',
    privacyNote: 'Sand estimates stay local. Moisture, compaction, and supplier density can change tonnage.',
    modes: [
      {
        id: 'sand-volume',
        label: 'Area and depth',
        symbol: 'SAND',
        fields: [
          numberField('lengthFeet', 'Length feet', '20'),
          numberField('widthFeet', 'Width feet', '10'),
          numberField('depthInches', 'Depth inches', '2'),
          numberField('tonsPerCubicYard', 'Tons per cubic yard', '1.35'),
          numberField('wastePercent', 'Waste percent', '5'),
        ],
        defaultInputs: { lengthFeet: '20', widthFeet: '10', depthInches: '2', tonsPerCubicYard: '1.35', wastePercent: '5' },
        examples: [
          { label: 'Leveling sand', inputs: { lengthFeet: '20', widthFeet: '10', depthInches: '2', tonsPerCubicYard: '1.35', wastePercent: '5' } },
          { label: 'Sandbox', inputs: { lengthFeet: '8', widthFeet: '6', depthInches: '8', tonsPerCubicYard: '1.25', wastePercent: '0' } },
        ],
      },
    ],
  },
  soil: {
    title: 'Soil Calculator',
    buttonLabel: 'Estimate soil',
    emptyHistory: 'Recent soil estimates will appear here.',
    privacyNote: 'Soil estimates stay local and use area, depth, and common bag sizes.',
    modes: [
      {
        id: 'soil-volume',
        label: 'Area and depth',
        symbol: 'SOIL',
        fields: [
          numberField('areaSquareFeet', 'Bed area ft2', '120'),
          numberField('depthInches', 'Soil depth inches', '4'),
          numberField('wastePercent', 'Extra percent', '10'),
        ],
        defaultInputs: { areaSquareFeet: '120', depthInches: '4', wastePercent: '10' },
        examples: [
          { label: 'Raised bed top-off', inputs: { areaSquareFeet: '120', depthInches: '4', wastePercent: '10' } },
          { label: 'Small garden', inputs: { areaSquareFeet: '48', depthInches: '6', wastePercent: '5' } },
        ],
      },
    ],
  },
  asphalt: {
    title: 'Asphalt Calculator',
    buttonLabel: 'Estimate asphalt',
    emptyHistory: 'Recent asphalt estimates will appear here.',
    privacyNote: 'Asphalt estimates stay local and are rough planning numbers, not paving specifications.',
    modes: [
      {
        id: 'asphalt-volume',
        label: 'Area and depth',
        symbol: 'ASPH',
        fields: [
          numberField('lengthFeet', 'Length feet', '30'),
          numberField('widthFeet', 'Width feet', '12'),
          numberField('depthInches', 'Compacted depth inches', '3'),
          numberField('tonsPerCubicYard', 'Tons per cubic yard', '2'),
          numberField('wastePercent', 'Waste percent', '5'),
        ],
        defaultInputs: { lengthFeet: '30', widthFeet: '12', depthInches: '3', tonsPerCubicYard: '2', wastePercent: '5' },
        examples: [
          { label: 'Driveway section', inputs: { lengthFeet: '30', widthFeet: '12', depthInches: '3', tonsPerCubicYard: '2', wastePercent: '5' } },
          { label: 'Parking pad', inputs: { lengthFeet: '20', widthFeet: '18', depthInches: '4', tonsPerCubicYard: '2', wastePercent: '8' } },
        ],
      },
    ],
  },
  'wind-chill': {
    title: 'Wind Chill Calculator',
    buttonLabel: 'Calculate wind chill',
    emptyHistory: 'Recent wind chill calculations will appear here.',
    privacyNote: 'Weather math stays local. Follow local weather alerts for safety decisions.',
    modes: [
      {
        id: 'nws',
        label: 'NWS formula',
        symbol: 'WIND',
        fields: [numberField('temperatureFahrenheit', 'Temperature F', '30'), numberField('windSpeedMph', 'Wind speed mph', '15')],
        defaultInputs: { temperatureFahrenheit: '30', windSpeedMph: '15' },
        examples: [{ label: 'Cold and windy', inputs: { temperatureFahrenheit: '30', windSpeedMph: '15' } }],
      },
    ],
  },
  'heat-index': {
    title: 'Heat Index Calculator',
    buttonLabel: 'Calculate heat index',
    emptyHistory: 'Recent heat index calculations will appear here.',
    privacyNote: 'Weather math stays local. Follow local heat warnings for safety decisions.',
    modes: [
      {
        id: 'nws',
        label: 'NWS method',
        symbol: 'HEAT',
        fields: [numberField('temperatureFahrenheit', 'Temperature F', '90'), numberField('relativeHumidity', 'Relative humidity %', '70')],
        defaultInputs: { temperatureFahrenheit: '90', relativeHumidity: '70' },
        examples: [{ label: 'Humid heat', inputs: { temperatureFahrenheit: '90', relativeHumidity: '70' } }],
      },
    ],
  },
  'dew-point': {
    title: 'Dew Point Calculator',
    buttonLabel: 'Calculate dew point',
    emptyHistory: 'Recent dew point calculations will appear here.',
    privacyNote: 'Dew point math stays local and uses temperature and relative humidity only.',
    modes: [
      {
        id: 'magnus',
        label: 'Temperature and humidity',
        symbol: 'DEW',
        fields: [numberField('temperatureFahrenheit', 'Temperature F', '75'), numberField('relativeHumidity', 'Relative humidity %', '60')],
        defaultInputs: { temperatureFahrenheit: '75', relativeHumidity: '60' },
        examples: [{ label: 'Mild humid day', inputs: { temperatureFahrenheit: '75', relativeHumidity: '60' } }],
      },
    ],
  },
  bandwidth: {
    title: 'Bandwidth Calculator',
    buttonLabel: 'Calculate transfer time',
    emptyHistory: 'Recent bandwidth calculations will appear here.',
    privacyNote: 'Transfer-time math stays local and uses decimal network units.',
    modes: [
      {
        id: 'download-time',
        label: 'Transfer time',
        symbol: 'NET',
        fields: [
          numberField('dataAmount', 'Data amount', '5'),
          selectField('dataUnit', 'Data unit', bandwidthDataUnitOptions),
          numberField('speedAmount', 'Speed amount', '100'),
          selectField('speedUnit', 'Speed unit', bandwidthSpeedUnitOptions),
        ],
        defaultInputs: { dataAmount: '5', dataUnit: 'GB', speedAmount: '100', speedUnit: 'Mbps' },
        examples: [
          { label: '5 GB at 100 Mbps', inputs: { dataAmount: '5', dataUnit: 'GB', speedAmount: '100', speedUnit: 'Mbps' } },
          { label: '700 MB at 25 Mbps', inputs: { dataAmount: '700', dataUnit: 'MB', speedAmount: '25', speedUnit: 'Mbps' } },
        ],
      },
    ],
  },
  gdp: {
    title: 'GDP Calculator',
    buttonLabel: 'Calculate GDP',
    emptyHistory: 'Recent GDP estimates will appear here.',
    privacyNote: 'GDP entries stay in your browser and are for learning or rough economic examples, not official national accounts.',
    modes: [
      {
        id: 'expenditure',
        label: 'Expenditure',
        symbol: 'GDP',
        fields: [
          numberField('consumption', 'Personal consumption'),
          numberField('investment', 'Private investment'),
          numberField('governmentSpending', 'Government spending'),
          numberField('exports', 'Exports'),
          numberField('imports', 'Imports'),
          numberField('population', 'Population (same scale)', 'Optional'),
        ],
        defaultInputs: {
          consumption: '18000',
          investment: '5000',
          governmentSpending: '6500',
          exports: '3200',
          imports: '4100',
          population: '0.34',
        },
        examples: [
          { label: 'Economy example', inputs: { consumption: '18000', investment: '5000', governmentSpending: '6500', exports: '3200', imports: '4100', population: '0.34' } },
          { label: 'Classroom numbers', inputs: { consumption: '700', investment: '150', governmentSpending: '220', exports: '90', imports: '120', population: '' } },
        ],
      },
    ],
  },
  horsepower: {
    title: 'Horsepower Calculator',
    buttonLabel: 'Convert power',
    emptyHistory: 'Recent horsepower conversions will appear here.',
    privacyNote: 'Power conversions run locally and use NIST-style conversion factors for common horsepower units.',
    modes: [
      {
        id: 'conversion',
        label: 'Convert',
        symbol: 'HP',
        fields: [
          numberField('power', 'Power'),
          selectField('unit', 'Starting unit', horsepowerUnitOptions),
        ],
        defaultInputs: { power: '150', unit: 'horsepower' },
        examples: [
          { label: '150 hp', inputs: { power: '150', unit: 'horsepower' } },
          { label: '100 kW', inputs: { power: '100', unit: 'kilowatt' } },
        ],
      },
    ],
  },
  'engine-horsepower': {
    title: 'Engine Horsepower Calculator',
    buttonLabel: 'Calculate horsepower',
    emptyHistory: 'Recent engine horsepower estimates will appear here.',
    privacyNote: 'Engine horsepower estimates stay in the browser and are simple torque-RPM math.',
    modes: [
      {
        id: 'torque-rpm',
        label: 'Torque and RPM',
        symbol: 'RPM',
        fields: [
          numberField('torquePoundFeet', 'Torque (lb-ft)'),
          numberField('rpm', 'RPM'),
          numberField('drivetrainLossPercent', 'Drivetrain loss % (optional)', 'Optional'),
        ],
        defaultInputs: { torquePoundFeet: '300', rpm: '5252', drivetrainLossPercent: '15' },
        examples: [
          { label: '300 lb-ft at 5,252 rpm', inputs: { torquePoundFeet: '300', rpm: '5252', drivetrainLossPercent: '15' } },
          { label: '250 lb-ft at 4,000 rpm', inputs: { torquePoundFeet: '250', rpm: '4000', drivetrainLossPercent: '0' } },
        ],
      },
    ],
  },
  'golf-handicap': {
    title: 'Golf Handicap Calculator',
    buttonLabel: 'Calculate handicap',
    emptyHistory: 'Recent golf handicap estimates will appear here.',
    privacyNote: 'Golf calculations stay local. Use your official scoring record or golf association for an official Handicap Index.',
    modes: [
      {
        id: 'score-differential',
        label: 'Score differential',
        symbol: 'DIFF',
        fields: [
          numberField('adjustedGrossScore', 'Adjusted gross score'),
          numberField('courseRating', 'Course rating'),
          integerField('slopeRating', 'Slope rating'),
          numberField('playingConditionsAdjustment', 'PCC adjustment', 'Usually -1 to +3'),
        ],
        defaultInputs: { adjustedGrossScore: '86', courseRating: '71.2', slopeRating: '128', playingConditionsAdjustment: '0' },
        examples: [
          { label: '86 on 71.2 / 128', inputs: { adjustedGrossScore: '86', courseRating: '71.2', slopeRating: '128', playingConditionsAdjustment: '0' } },
          { label: 'Hard weather PCC +1', inputs: { adjustedGrossScore: '92', courseRating: '73.4', slopeRating: '136', playingConditionsAdjustment: '1' } },
        ],
      },
      {
        id: 'course-handicap',
        label: 'Course handicap',
        symbol: 'CH',
        fields: [
          numberField('handicapIndex', 'Handicap index'),
          integerField('slopeRating', 'Slope rating'),
          numberField('courseRating', 'Course rating'),
          numberField('par', 'Par'),
          numberField('allowancePercent', 'Allowance %'),
        ],
        defaultInputs: { handicapIndex: '14.2', slopeRating: '128', courseRating: '71.2', par: '72', allowancePercent: '100' },
        examples: [
          { label: 'Full allowance', inputs: { handicapIndex: '14.2', slopeRating: '128', courseRating: '71.2', par: '72', allowancePercent: '100' } },
          { label: '95% allowance', inputs: { handicapIndex: '9.8', slopeRating: '136', courseRating: '73.4', par: '72', allowancePercent: '95' } },
        ],
      },
    ],
  },
  love: {
    title: 'Love Calculator',
    buttonLabel: 'Calculate match',
    emptyHistory: 'Recent playful matches will appear here.',
    privacyNote: 'Names stay in your browser. This is a deterministic game, not relationship advice or a real compatibility test.',
    modes: [
      {
        id: 'love',
        label: 'Name match',
        symbol: 'LOVE',
        fields: [textField('nameA', 'First name', 'Alex'), textField('nameB', 'Second name', 'Sam')],
        defaultInputs: { nameA: 'Alex', nameB: 'Sam' },
        examples: [
          { label: 'Alex + Sam', inputs: { nameA: 'Alex', nameB: 'Sam' } },
          { label: 'Taylor + Jordan', inputs: { nameA: 'Taylor', nameB: 'Jordan' } },
          { label: 'Kai + Riley', inputs: { nameA: 'Kai', nameB: 'Riley' } },
        ],
      },
    ],
  },
  'word-counter': {
    title: 'Word Counter',
    buttonLabel: 'Count words',
    emptyHistory: 'Recent text counts will appear here.',
    privacyNote: 'Text is counted in your browser. Use it for drafts, meta copy, social posts, essays, and quick editing checks.',
    modes: [
      {
        id: 'word-counter',
        label: 'Word count',
        symbol: 'ABC',
        fields: [textareaField('text', 'Text to count', 'Paste or type text here...')],
        defaultInputs: { text: 'Access Free Tools helps people finish quick browser tasks without signup.' },
        examples: [
          { label: 'Short sentence', inputs: { text: 'Access Free Tools helps people finish quick browser tasks without signup.' } },
          { label: 'Meta description', inputs: { text: 'Use this free browser tool to count words, characters, sentences, and reading time before publishing.' } },
          { label: 'Paragraph draft', inputs: { text: 'Write the first paragraph here.\n\nAdd a second paragraph to see paragraph and line counts.' } },
        ],
      },
    ],
  },
  'character-counter': {
    title: 'Character Counter',
    buttonLabel: 'Count characters',
    emptyHistory: 'Recent character counts will appear here.',
    privacyNote: 'Character counts run locally, which is useful for titles, snippets, messages, and form limits.',
    modes: [
      {
        id: 'character-counter',
        label: 'Character count',
        symbol: '123',
        fields: [textareaField('text', 'Text to count', 'Type a title, message, or snippet...')],
        defaultInputs: { text: 'Free calculator tools for quick everyday math.' },
        examples: [
          { label: 'Page title', inputs: { text: 'Free calculator tools for quick everyday math.' } },
          { label: 'Short message', inputs: { text: 'Meeting moved to 2:30 PM. Bring the latest estimate.' } },
          { label: 'Emoji check', inputs: { text: 'Launch day notes: calculators, converters, and design tools.' } },
        ],
      },
    ],
  },
  'text-case-converter': {
    title: 'Text Case Converter',
    buttonLabel: 'Convert case',
    emptyHistory: 'Recent case conversions will appear here.',
    privacyNote: 'Case conversion runs in your browser, so drafts and labels are not sent to a server.',
    modes: [
      {
        id: 'case',
        label: 'Convert case',
        symbol: 'Aa',
        fields: [selectField('mode', 'Case style', textCaseOptions), textareaField('text', 'Text to convert', 'Paste text here...')],
        defaultInputs: { mode: 'title', text: 'access free tools utility website' },
        examples: [
          { label: 'Title case', inputs: { mode: 'title', text: 'access free tools utility website' } },
          { label: 'Slug words', inputs: { mode: 'kebab', text: 'Kawaii Calculator Blog Guide' } },
          { label: 'Variable name', inputs: { mode: 'camel', text: 'basic calculator result' } },
        ],
      },
    ],
  },
  'slug-generator': {
    title: 'Slug Generator',
    buttonLabel: 'Generate slug',
    emptyHistory: 'Recent slugs will appear here.',
    privacyNote: 'Slug text stays in this tab. Use the generated slug as a draft URL path and keep one canonical page per search intent.',
    modes: [
      {
        id: 'slug',
        label: 'URL slug',
        symbol: 'URL',
        fields: [textareaField('text', 'Title or phrase', 'How to Use the Kawaii Calculator'), integerField('maxLength', 'Max length (optional)', 'Optional')],
        defaultInputs: { text: 'How to Use the Kawaii Calculator', maxLength: '60' },
        examples: [
          { label: 'Blog title', inputs: { text: 'How to Use the Kawaii Calculator', maxLength: '60' } },
          { label: 'Tool name', inputs: { text: 'Color Contrast Checker', maxLength: '50' } },
          { label: 'Long title', inputs: { text: 'Simple SEO-Friendly Guide for Free Online Utility Tools', maxLength: '48' } },
        ],
      },
    ],
  },
  'json-formatter': {
    title: 'JSON Formatter',
    buttonLabel: 'Format JSON',
    emptyHistory: 'Recent JSON formatting results will appear here.',
    privacyNote: 'JSON parsing and formatting run in your browser. Avoid pasting secrets unless you are comfortable viewing them in this tab.',
    modes: [
      {
        id: 'json',
        label: 'Format JSON',
        symbol: '{}',
        fields: [textareaField('json', 'JSON text', '{"tool":"calculator","live":true,"count":3}'), checkboxField('sortKeys', 'Sort object keys')],
        defaultInputs: { json: '{"tool":"calculator","live":true,"count":3}', sortKeys: 'false' },
        examples: [
          { label: 'Tool object', inputs: { json: '{"tool":"calculator","live":true,"count":3}', sortKeys: 'false' } },
          { label: 'Array data', inputs: { json: '[{"name":"Basic"},{"name":"Scientific"}]', sortKeys: 'false' } },
          { label: 'Sorted keys', inputs: { json: '{"z":3,"a":{"b":2,"a":1}}', sortKeys: 'true' } },
        ],
      },
    ],
  },
  'uuid-generator': {
    title: 'UUID Generator',
    buttonLabel: 'Generate UUIDs',
    emptyHistory: 'Generated UUIDs are not saved in recent history.',
    privacyNote: 'UUIDs are generated locally with browser random values. Use them for identifiers, test data, and development workflows.',
    modes: [
      {
        id: 'uuid',
        label: 'UUID v4',
        symbol: 'ID',
        fields: [integerField('quantity', 'Quantity'), checkboxField('uppercase', 'Uppercase'), checkboxField('hyphens', 'Include hyphens')],
        defaultInputs: { quantity: '5', uppercase: 'false', hyphens: 'true' },
        examples: [
          { label: 'Five UUIDs', inputs: { quantity: '5', uppercase: 'false', hyphens: 'true' } },
          { label: 'One uppercase', inputs: { quantity: '1', uppercase: 'true', hyphens: 'true' } },
          { label: 'Compact IDs', inputs: { quantity: '3', uppercase: 'false', hyphens: 'false' } },
        ],
      },
    ],
  },
  'hash-generator': {
    title: 'Hash Generator',
    buttonLabel: 'Generate hash',
    emptyHistory: 'Recent hashes will appear here.',
    privacyNote: 'Hashing runs with the browser SubtleCrypto API. A hash is not encryption and should not be used as a password storage system by itself.',
    modes: [
      {
        id: 'hash',
        label: 'Text digest',
        symbol: '#',
        fields: [selectField('algorithm', 'Algorithm', hashAlgorithmOptions), textareaField('text', 'Text to hash', 'Access Free Tools')],
        defaultInputs: { algorithm: 'SHA-256', text: 'Access Free Tools' },
        examples: [
          { label: 'SHA-256 text', inputs: { algorithm: 'SHA-256', text: 'Access Free Tools' } },
          { label: 'SHA-384 note', inputs: { algorithm: 'SHA-384', text: 'browser utility' } },
          { label: 'SHA-512 phrase', inputs: { algorithm: 'SHA-512', text: 'local hash example' } },
        ],
      },
    ],
  },
  'unix-timestamp-converter': {
    title: 'Unix Timestamp Converter',
    buttonLabel: 'Convert timestamp',
    emptyHistory: 'Recent timestamp conversions will appear here.',
    privacyNote: 'Timestamp conversion runs locally and uses UTC so date-time assumptions stay visible.',
    modes: [
      {
        id: 'date-to-timestamp',
        label: 'Date to timestamp',
        symbol: 'UTC',
        fields: [dateField('date', 'UTC date'), timeField('time', 'UTC time')],
        defaultInputs: { date: '2026-04-30', time: '12:00' },
        examples: [
          { label: 'Noon UTC', inputs: { date: '2026-04-30', time: '12:00' } },
          { label: 'Start of 2026', inputs: { date: '2026-01-01', time: '00:00' } },
          { label: 'End of day', inputs: { date: '2026-12-31', time: '23:59' } },
        ],
      },
      {
        id: 'timestamp-to-date',
        label: 'Timestamp to date',
        symbol: 'TS',
        fields: [textField('timestamp', 'Timestamp', '1777464000'), selectField('unit', 'Unit', timestampUnitOptions)],
        defaultInputs: { timestamp: '1777464000', unit: 'seconds' },
        examples: [
          { label: 'Seconds', inputs: { timestamp: '1777464000', unit: 'seconds' } },
          { label: 'Milliseconds', inputs: { timestamp: '1777464000000', unit: 'milliseconds' } },
          { label: 'Unix epoch', inputs: { timestamp: '0', unit: 'seconds' } },
        ],
      },
    ],
  },
  'color-contrast-checker': {
    title: 'Color Contrast Checker',
    buttonLabel: 'Check contrast',
    emptyHistory: 'Recent contrast checks will appear here.',
    privacyNote: 'Color contrast checks run locally and use WCAG contrast math for quick design accessibility checks.',
    modes: [
      {
        id: 'contrast',
        label: 'Contrast ratio',
        symbol: 'AA',
        fields: [textField('foreground', 'Text color', '#101828'), textField('background', 'Background color', '#ffffff')],
        defaultInputs: { foreground: '#101828', background: '#ffffff' },
        examples: [
          { label: 'Dark on white', inputs: { foreground: '#101828', background: '#ffffff' } },
          { label: 'Muted on light', inputs: { foreground: '#667085', background: '#f9fafb' } },
          { label: 'Brand teal', inputs: { foreground: '#0f766e', background: '#ecfeff' } },
        ],
      },
    ],
  },
  'aspect-ratio-calculator': {
    title: 'Aspect Ratio Calculator',
    buttonLabel: 'Calculate ratio',
    emptyHistory: 'Recent aspect-ratio results will appear here.',
    privacyNote: 'Aspect-ratio math runs locally. Use exact platform specs when artwork must match a required upload size.',
    modes: [
      {
        id: 'ratio',
        label: 'Simplify ratio',
        symbol: '16:9',
        fields: [numberField('width', 'Width'), numberField('height', 'Height')],
        defaultInputs: { width: '1920', height: '1080' },
        examples: [
          { label: 'HD video', inputs: { width: '1920', height: '1080' } },
          { label: 'Square', inputs: { width: '1080', height: '1080' } },
          { label: 'Vertical story', inputs: { width: '1080', height: '1920' } },
        ],
      },
      {
        id: 'scale-width',
        label: 'Scale by width',
        symbol: 'W',
        fields: [numberField('width', 'Original width'), numberField('height', 'Original height'), numberField('targetWidth', 'New width')],
        defaultInputs: { width: '1920', height: '1080', targetWidth: '1280' },
        examples: [
          { label: 'HD to 1280 wide', inputs: { width: '1920', height: '1080', targetWidth: '1280' } },
          { label: 'Story to 720 wide', inputs: { width: '1080', height: '1920', targetWidth: '720' } },
          { label: 'Square resize', inputs: { width: '1200', height: '1200', targetWidth: '600' } },
        ],
      },
      {
        id: 'scale-height',
        label: 'Scale by height',
        symbol: 'H',
        fields: [numberField('width', 'Original width'), numberField('height', 'Original height'), numberField('targetHeight', 'New height')],
        defaultInputs: { width: '1920', height: '1080', targetHeight: '720' },
        examples: [
          { label: 'HD to 720 tall', inputs: { width: '1920', height: '1080', targetHeight: '720' } },
          { label: 'Banner height', inputs: { width: '1600', height: '900', targetHeight: '450' } },
          { label: 'Portrait height', inputs: { width: '1080', height: '1920', targetHeight: '1280' } },
        ],
      },
    ],
  },
  'utm-builder': {
    title: 'UTM Builder',
    buttonLabel: 'Build UTM URL',
    emptyHistory: 'Recent UTM URLs will appear here.',
    privacyNote: 'UTM links are built in your browser. Check your analytics naming rules before sharing campaign URLs.',
    modes: [
      {
        id: 'utm',
        label: 'Campaign URL',
        symbol: 'UTM',
        fields: [
          textField('baseUrl', 'Base URL', 'https://accessfreetools.com/tools/'),
          textField('source', 'UTM source', 'newsletter'),
          textField('medium', 'UTM medium', 'email'),
          textField('campaign', 'UTM campaign', 'spring-tools'),
          textField('content', 'UTM content (optional)', 'hero-button'),
          textField('term', 'UTM term (optional)', 'calculator-tools'),
        ],
        defaultInputs: {
          baseUrl: 'https://accessfreetools.com/tools/',
          source: 'newsletter',
          medium: 'email',
          campaign: 'spring-tools',
          content: 'hero-button',
          term: '',
        },
        examples: [
          { label: 'Newsletter link', inputs: { baseUrl: 'https://accessfreetools.com/tools/', source: 'newsletter', medium: 'email', campaign: 'spring-tools', content: 'hero-button', term: '' } },
          { label: 'Social post', inputs: { baseUrl: 'https://accessfreetools.com/tools/percentage-calculator/', source: 'instagram', medium: 'social', campaign: 'calculator-tips', content: 'bio-link', term: '' } },
          { label: 'Search ad', inputs: { baseUrl: 'https://accessfreetools.com/tools/', source: 'google', medium: 'cpc', campaign: 'utility-tools', content: 'ad-a', term: 'free calculators' } },
        ],
      },
    ],
  },
  'query-string-parser': {
    title: 'Query String Parser',
    buttonLabel: 'Run query tool',
    emptyHistory: 'Recent query-string results will appear here.',
    privacyNote: 'Query parsing and building stays local. Avoid pasting private tokens or customer identifiers into any tool.',
    modes: [
      {
        id: 'parse',
        label: 'Parse query',
        symbol: '?=',
        fields: [textareaField('input', 'URL or query string', 'https://example.com/?utm_source=newsletter&tag=a&tag=b')],
        defaultInputs: { input: 'https://example.com/?utm_source=newsletter&tag=a&tag=b' },
        examples: [
          { label: 'Full URL', inputs: { input: 'https://example.com/?utm_source=newsletter&tag=a&tag=b' } },
          { label: 'Raw query', inputs: { input: 'name=Access+Free+Tools&tool=json' } },
          { label: 'Duplicate keys', inputs: { input: '?filter=free&filter=calculator&page=2' } },
        ],
      },
      {
        id: 'build',
        label: 'Build query',
        symbol: 'KEY',
        fields: [textareaField('input', 'One key=value pair per line', 'utm_source=newsletter\nutm_medium=email\nutm_campaign=spring-tools')],
        defaultInputs: { input: 'utm_source=newsletter\nutm_medium=email\nutm_campaign=spring-tools' },
        examples: [
          { label: 'UTM basics', inputs: { input: 'utm_source=newsletter\nutm_medium=email\nutm_campaign=spring-tools' } },
          { label: 'Search filters', inputs: { input: 'q=calculator tools\ncategory=developer tools\npage=1' } },
          { label: 'Repeated key', inputs: { input: 'tag=free\ntag=calculator\ntag=browser' } },
        ],
      },
    ],
  },
  'html-entity-encoder-decoder': {
    title: 'HTML Entity Encoder / Decoder',
    buttonLabel: 'Run HTML entity tool',
    emptyHistory: 'Recent HTML entity conversions will appear here.',
    privacyNote: 'HTML entity conversion runs in your browser and is meant for small snippets, examples, and documentation text.',
    modes: [
      {
        id: 'html-entity',
        label: 'Entities',
        symbol: '&;',
        fields: [selectField('mode', 'Mode', htmlEntityModeOptions), textareaField('text', 'HTML or entity text', '<strong>Free & fast</strong>')],
        defaultInputs: { mode: 'encode', text: '<strong>Free & fast</strong>' },
        examples: [
          { label: 'Encode tag text', inputs: { mode: 'encode', text: '<strong>Free & fast</strong>' } },
          { label: 'Decode entities', inputs: { mode: 'decode', text: '&lt;strong&gt;Free &amp; fast&lt;/strong&gt;' } },
          { label: 'Quote cleanup', inputs: { mode: 'encode', text: 'title=\"Calculator\" data-label=\"A&B\"' } },
        ],
      },
    ],
  },
  'css-clamp-calculator': {
    title: 'CSS Clamp Calculator',
    buttonLabel: 'Generate clamp',
    emptyHistory: 'Recent clamp formulas will appear here.',
    privacyNote: 'The clamp formula is generated locally. Test the final CSS in your own layout before publishing.',
    modes: [
      {
        id: 'clamp',
        label: 'Fluid size',
        symbol: 'CSS',
        fields: [
          numberField('minSize', 'Minimum size (px)'),
          numberField('maxSize', 'Maximum size (px)'),
          numberField('minViewport', 'Minimum viewport (px)'),
          numberField('maxViewport', 'Maximum viewport (px)'),
          numberField('rootFontSize', 'Root font size (px)'),
        ],
        defaultInputs: { minSize: '18', maxSize: '32', minViewport: '360', maxViewport: '1280', rootFontSize: '16' },
        examples: [
          { label: 'Responsive h1', inputs: { minSize: '32', maxSize: '64', minViewport: '360', maxViewport: '1280', rootFontSize: '16' } },
          { label: 'Body text', inputs: { minSize: '16', maxSize: '20', minViewport: '375', maxViewport: '1200', rootFontSize: '16' } },
          { label: 'Section padding', inputs: { minSize: '24', maxSize: '72', minViewport: '360', maxViewport: '1440', rootFontSize: '16' } },
        ],
      },
    ],
  },
  'ai-token-cost-calculator': {
    title: 'AI Token Cost Calculator',
    buttonLabel: 'Calculate token cost',
    emptyHistory: 'Recent token cost estimates will appear here.',
    privacyNote: 'Token cost math stays local. Enter current prices from your provider because model pricing can change.',
    modes: [
      {
        id: 'token-cost',
        label: 'Token cost',
        symbol: 'AI $',
        fields: [
          integerField('inputTokensPerRequest', 'Input tokens per request'),
          integerField('outputTokensPerRequest', 'Output tokens per request'),
          integerField('requests', 'Requests'),
          numberField('inputPricePerMillion', 'Input $ / 1M tokens'),
          numberField('outputPricePerMillion', 'Output $ / 1M tokens'),
        ],
        defaultInputs: {
          inputTokensPerRequest: '1200',
          outputTokensPerRequest: '500',
          requests: '10000',
          inputPricePerMillion: '0.50',
          outputPricePerMillion: '1.50',
        },
        examples: [
          { label: 'Support bot month', inputs: { inputTokensPerRequest: '1200', outputTokensPerRequest: '500', requests: '10000', inputPricePerMillion: '0.50', outputPricePerMillion: '1.50' } },
          { label: 'Tiny prototype', inputs: { inputTokensPerRequest: '400', outputTokensPerRequest: '150', requests: '1000', inputPricePerMillion: '0.15', outputPricePerMillion: '0.60' } },
          { label: 'Long summaries', inputs: { inputTokensPerRequest: '6000', outputTokensPerRequest: '900', requests: '500', inputPricePerMillion: '2', outputPricePerMillion: '8' } },
        ],
      },
    ],
  },
  'prompt-token-estimator': {
    title: 'Prompt Token Estimator',
    buttonLabel: 'Estimate tokens',
    emptyHistory: 'Recent prompt estimates will appear here.',
    privacyNote: 'Prompt text stays in your browser. This is a rough estimate, not the exact tokenizer used by every model.',
    modes: [
      {
        id: 'prompt-estimate',
        label: 'Prompt estimate',
        symbol: 'TOK',
        fields: [
          textareaField('text', 'Prompt text', 'Paste a prompt, system message, or draft here...'),
          numberField('averageCharactersPerToken', 'Average characters per token'),
        ],
        defaultInputs: {
          text: 'Write a friendly explanation of how a percentage calculator works, with one discount example and one percent change example.',
          averageCharactersPerToken: '4',
        },
        examples: [
          { label: 'Short prompt', inputs: { text: 'Explain compound interest in plain language.', averageCharactersPerToken: '4' } },
          { label: 'Tool instruction', inputs: { text: 'Summarize this blog draft and list three places where the explanation is unclear.', averageCharactersPerToken: '4' } },
          { label: 'Longer system note', inputs: { text: 'You are a helpful assistant for a utility website. Answer clearly, define inputs, mention limitations, and avoid making legal, financial, or medical promises.', averageCharactersPerToken: '4' } },
        ],
      },
    ],
  },
  'api-pricing-calculator': {
    title: 'API Pricing Calculator',
    buttonLabel: 'Calculate API cost',
    emptyHistory: 'Recent API pricing estimates will appear here.',
    privacyNote: 'Pricing math stays local. Use your provider plan and current rate card for real billing decisions.',
    modes: [
      {
        id: 'api-pricing',
        label: 'API pricing',
        symbol: 'API',
        fields: [
          integerField('requests', 'Requests'),
          numberField('unitsPerRequest', 'Units per request'),
          numberField('pricePerUnit', 'Price per unit'),
          numberField('platformFee', 'Fixed fee (optional)', 'Optional'),
          numberField('retryPercent', 'Retry / overhead %'),
        ],
        defaultInputs: { requests: '50000', unitsPerRequest: '1', pricePerUnit: '0.002', platformFee: '0', retryPercent: '5' },
        examples: [
          { label: 'Image API example', inputs: { requests: '1000', unitsPerRequest: '1', pricePerUnit: '0.04', platformFee: '0', retryPercent: '5' } },
          { label: 'Message API example', inputs: { requests: '50000', unitsPerRequest: '1', pricePerUnit: '0.002', platformFee: '10', retryPercent: '3' } },
          { label: 'Credit bundle', inputs: { requests: '20000', unitsPerRequest: '3', pricePerUnit: '0.0005', platformFee: '0', retryPercent: '10' } },
        ],
      },
    ],
  },
  'download-time-calculator': {
    title: 'Download Time Calculator',
    buttonLabel: 'Calculate download time',
    emptyHistory: 'Recent download time estimates will appear here.',
    privacyNote: 'Download estimates stay local and use decimal network units.',
    modes: [
      {
        id: 'download-time',
        label: 'Download time',
        symbol: 'DL',
        fields: [
          numberField('fileSize', 'File size'),
          selectField('fileUnit', 'File unit', fileSizeUnitOptions),
          numberField('speedMbps', 'Speed Mbps'),
          numberField('efficiencyPercent', 'Efficiency %'),
        ],
        defaultInputs: { fileSize: '50', fileUnit: 'GB', speedMbps: '100', efficiencyPercent: '85' },
        examples: [
          { label: '50 GB game', inputs: { fileSize: '50', fileUnit: 'GB', speedMbps: '100', efficiencyPercent: '85' } },
          { label: '700 MB update', inputs: { fileSize: '700', fileUnit: 'MB', speedMbps: '25', efficiencyPercent: '80' } },
          { label: '2 TB backup', inputs: { fileSize: '2', fileUnit: 'TB', speedMbps: '500', efficiencyPercent: '90' } },
        ],
      },
    ],
  },
  'internet-speed-needs-calculator': {
    title: 'Internet Speed Needs Calculator',
    buttonLabel: 'Estimate speed need',
    emptyHistory: 'Recent internet speed estimates will appear here.',
    privacyNote: 'Household speed estimates stay local and are only planning guidance.',
    modes: [
      {
        id: 'speed-needs',
        label: 'Speed need',
        symbol: 'ISP',
        fields: [
          integerField('videoStreams', 'Video streams'),
          numberField('videoMbpsEach', 'Mbps per video stream'),
          integerField('gamingDevices', 'Gaming devices'),
          numberField('gamingMbpsEach', 'Mbps per gaming device'),
          integerField('videoCalls', 'Video calls'),
          numberField('callMbpsEach', 'Mbps per video call'),
          integerField('smartDevices', 'Smart devices'),
          numberField('smartDeviceMbpsEach', 'Mbps per smart device'),
          numberField('bufferPercent', 'Buffer %'),
        ],
        defaultInputs: { videoStreams: '2', videoMbpsEach: '15', gamingDevices: '1', gamingMbpsEach: '5', videoCalls: '1', callMbpsEach: '4', smartDevices: '6', smartDeviceMbpsEach: '0.5', bufferPercent: '25' },
        examples: [
          { label: 'Small household', inputs: { videoStreams: '1', videoMbpsEach: '8', gamingDevices: '1', gamingMbpsEach: '5', videoCalls: '1', callMbpsEach: '4', smartDevices: '4', smartDeviceMbpsEach: '0.5', bufferPercent: '25' } },
          { label: '4K evening', inputs: { videoStreams: '3', videoMbpsEach: '25', gamingDevices: '1', gamingMbpsEach: '5', videoCalls: '0', callMbpsEach: '4', smartDevices: '8', smartDeviceMbpsEach: '0.5', bufferPercent: '30' } },
          { label: 'Work from home', inputs: { videoStreams: '1', videoMbpsEach: '8', gamingDevices: '0', gamingMbpsEach: '5', videoCalls: '3', callMbpsEach: '4', smartDevices: '6', smartDeviceMbpsEach: '0.5', bufferPercent: '35' } },
        ],
      },
    ],
  },
  'streaming-bitrate-calculator': {
    title: 'Streaming Bitrate Calculator',
    buttonLabel: 'Calculate data use',
    emptyHistory: 'Recent bitrate estimates will appear here.',
    privacyNote: 'Bitrate calculations stay local and use decimal MB and GB estimates.',
    modes: [
      {
        id: 'streaming-data',
        label: 'Streaming data',
        symbol: 'BR',
        fields: [
          numberField('bitrate', 'Bitrate'),
          selectField('bitrateUnit', 'Bitrate unit', bitrateUnitOptions),
          integerField('hours', 'Hours'),
          integerField('minutes', 'Minutes'),
          integerField('streams', 'Streams'),
        ],
        defaultInputs: { bitrate: '6', bitrateUnit: 'Mbps', hours: '2', minutes: '0', streams: '1' },
        examples: [
          { label: '2 hour 1080p stream', inputs: { bitrate: '6', bitrateUnit: 'Mbps', hours: '2', minutes: '0', streams: '1' } },
          { label: 'Music stream', inputs: { bitrate: '320', bitrateUnit: 'Kbps', hours: '3', minutes: '30', streams: '1' } },
          { label: 'Two cameras', inputs: { bitrate: '4.5', bitrateUnit: 'Mbps', hours: '1', minutes: '45', streams: '2' } },
        ],
      },
    ],
  },
  'device-battery-life-calculator': {
    title: 'Device Battery Life Calculator',
    buttonLabel: 'Calculate runtime',
    emptyHistory: 'Recent battery life estimates will appear here.',
    privacyNote: 'Battery estimates stay local. Real runtime depends on age, temperature, settings, and power spikes.',
    modes: [
      {
        id: 'battery-runtime',
        label: 'Battery runtime',
        symbol: 'Wh',
        fields: [
          numberField('capacityMah', 'Battery capacity mAh'),
          numberField('voltage', 'Voltage'),
          numberField('powerWatts', 'Device watts'),
          numberField('efficiencyPercent', 'Efficiency %'),
        ],
        defaultInputs: { capacityMah: '10000', voltage: '3.7', powerWatts: '8', efficiencyPercent: '85' },
        examples: [
          { label: 'Power bank and tablet', inputs: { capacityMah: '10000', voltage: '3.7', powerWatts: '8', efficiencyPercent: '85' } },
          { label: 'Small light', inputs: { capacityMah: '5000', voltage: '3.7', powerWatts: '3', efficiencyPercent: '90' } },
          { label: 'Laptop pack', inputs: { capacityMah: '5000', voltage: '11.1', powerWatts: '30', efficiencyPercent: '88' } },
        ],
      },
    ],
  },
  'monitor-ppi-calculator': {
    title: 'Monitor PPI Calculator',
    buttonLabel: 'Calculate PPI',
    emptyHistory: 'Recent monitor PPI estimates will appear here.',
    privacyNote: 'Screen math stays local and uses the diagonal size and pixel resolution you enter.',
    modes: [
      {
        id: 'ppi',
        label: 'Monitor PPI',
        symbol: 'PPI',
        fields: [
          integerField('widthPixels', 'Width pixels'),
          integerField('heightPixels', 'Height pixels'),
          numberField('diagonalInches', 'Diagonal inches'),
        ],
        defaultInputs: { widthPixels: '1920', heightPixels: '1080', diagonalInches: '24' },
        examples: [
          { label: '24 inch 1080p', inputs: { widthPixels: '1920', heightPixels: '1080', diagonalInches: '24' } },
          { label: '27 inch 1440p', inputs: { widthPixels: '2560', heightPixels: '1440', diagonalInches: '27' } },
          { label: '32 inch 4K', inputs: { widthPixels: '3840', heightPixels: '2160', diagonalInches: '32' } },
        ],
      },
    ],
  },
  'markdown-table-generator': {
    title: 'Markdown Table Generator',
    buttonLabel: 'Generate table',
    emptyHistory: 'Recent markdown tables will appear here.',
    privacyNote: 'Table text stays local. Preview the markdown in the editor or platform where you plan to publish it.',
    modes: [
      {
        id: 'markdown-table',
        label: 'Table',
        symbol: 'MD',
        fields: [
          textField('headers', 'Headers', 'Tool, Use, Status'),
          textareaField('rows', 'Rows, one per line', 'UTM Builder, Campaign links, Live\nJSON Formatter, Read data, Live'),
          selectField('alignment', 'Column alignment', markdownAlignmentOptions),
        ],
        defaultInputs: {
          headers: 'Tool, Use, Status',
          rows: 'UTM Builder, Campaign links, Live\nJSON Formatter, Read data, Live',
          alignment: 'left',
        },
        examples: [
          { label: 'Tool table', inputs: { headers: 'Tool, Use, Status', rows: 'UTM Builder, Campaign links, Live\nJSON Formatter, Read data, Live', alignment: 'left' } },
          { label: 'Feature matrix', inputs: { headers: 'Feature | Free | Notes', rows: 'Private browser use | Yes | Runs locally\nCopy output | Yes | Check before sharing', alignment: 'center' } },
          { label: 'Simple report', inputs: { headers: 'Metric, Value', rows: 'Tools, 5\nGuides, 5', alignment: 'right' } },
        ],
      },
    ],
  },
};

function parseNumber(value: string, label: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error(`${label} is required`);
  }

  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be a number`);
  }

  return parsed;
}

function parseOptionalNumber(value: string, label: string) {
  if (!value.trim()) return undefined;
  return parseNumber(value, label);
}

function money(value: number) {
  return value.toLocaleString('en-US', {
    currency: 'USD',
    maximumFractionDigits: 2,
    style: 'currency',
  });
}

function moneyPrecise(value: number) {
  return value.toLocaleString('en-US', {
    currency: 'USD',
    maximumFractionDigits: value < 1 ? 6 : 2,
    style: 'currency',
  });
}

function percent(value: number) {
  return `${formatCalculatorNumber(value)}%`;
}

function dateText(value: string) {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
  });
}

function unitLabel(value: string) {
  return value.replace(/-/g, ' ');
}

function durationText(totalSeconds: number) {
  const sign = totalSeconds < 0 ? '-' : '';
  let remaining = Math.abs(Math.round(totalSeconds));
  const hours = Math.floor(remaining / 3600);
  remaining -= hours * 3600;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining - minutes * 60;
  return `${sign}${hours}h ${minutes}m ${seconds}s`;
}

function clockDurationText(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes - hours * 60);
  return `${hours}h ${minutes}m`;
}

function heightText(inches: number) {
  const totalInches = Math.round(inches);
  const feet = Math.floor(totalInches / 12);
  const remainingInches = totalInches - feet * 12;
  return `${feet} ft ${remainingInches} in`;
}

function booleanInput(value: string) {
  return value === 'true';
}

function updateCheckedValue(checked: boolean) {
  return checked ? 'true' : 'false';
}

function readCourses(inputs: UtilityInputs): GpaCourseInput[] {
  const courses: GpaCourseInput[] = [];

  for (let index = 1; index <= 4; index += 1) {
    const credits = inputs[`credits${index}`]?.trim();
    const grade = inputs[`grade${index}`]?.trim();

    if (!credits || Number(credits) === 0) continue;

    courses.push({
      credits: parseNumber(credits, `Course ${index} credits`),
      grade: grade || 'F',
      name: `Course ${index}`,
    });
  }

  return courses;
}

function readTimeCardEntries(inputs: UtilityInputs): TimeCardDayInput[] {
  const days = [
    { key: 'mon', label: 'Monday' },
    { key: 'tue', label: 'Tuesday' },
    { key: 'wed', label: 'Wednesday' },
    { key: 'thu', label: 'Thursday' },
    { key: 'fri', label: 'Friday' },
  ];

  return days.map((day) => ({
    label: day.label,
    startTime: inputs[`${day.key}Start`] ?? '',
    endTime: inputs[`${day.key}End`] ?? '',
    breakMinutes: parseNumber(inputs[`${day.key}Break`] || '0', `${day.label} break`),
  }));
}

function calculateUtility(
  variant: UtilityToolVariant,
  modeId: string,
  inputs: UtilityInputs,
): UtilityCalculation | Promise<UtilityCalculation> {
  switch (variant) {
    case 'age': {
      const result = calculateAge(inputs.birthDate, inputs.asOfDate);
      return {
        label: 'Calendar age',
        expression: `${dateText(result.birthDate)} to ${dateText(result.asOfDate)}`,
        answer: `${result.years} years, ${result.months} months, ${result.days} days`,
        metrics: [
          { label: 'Total days', value: formatCalculatorNumber(result.totalDays) },
          { label: 'Next birthday', value: dateText(result.nextBirthday) },
          { label: 'Days until next birthday', value: formatCalculatorNumber(result.daysUntilNextBirthday) },
        ],
        steps: [
          'Compare the birth date with the selected as-of date.',
          'Subtract full years first, then remaining full months, then remaining days.',
          'Count total days separately using UTC calendar dates.',
        ],
      };
    }
    case 'date': {
      if (modeId === 'shift') {
        const result = calculateDateShift(
          inputs.startDate,
          parseNumber(inputs.years, 'Years'),
          parseNumber(inputs.months, 'Months'),
          parseNumber(inputs.weeks, 'Weeks'),
          parseNumber(inputs.days, 'Days'),
          (inputs.direction || 'add') as 'add' | 'subtract',
        );
        return {
          label: result.direction === 'add' ? 'Date after adding time' : 'Date after subtracting time',
          expression: `${dateText(result.startDate)} ${result.direction} ${result.years}y ${result.months}m ${result.weeks}w ${result.days}d`,
          answer: dateText(result.resultDate),
          metrics: [
            { label: 'Result date', value: result.resultDate },
            { label: 'Months shifted first', value: `${formatCalculatorNumber(result.years * 12 + result.months)} months` },
            { label: 'Extra day shift', value: `${formatCalculatorNumber(result.weeks * 7 + result.days)} days` },
          ],
          steps: [
            'Start with the selected calendar date.',
            'Apply years and months first, clamping month-end dates when needed.',
            'Apply weeks and days after the month shift.',
          ],
        };
      }

      const result = calculateDateDifference(inputs.startDate, inputs.endDate);
      return {
        label: 'Date difference',
        expression: `${dateText(result.startDate)} to ${dateText(result.endDate)}`,
        answer: `${formatCalculatorNumber(result.days)} days`,
        metrics: [
          { label: 'Weeks and days', value: `${result.weeks} weeks, ${result.remainingDays} days` },
          { label: 'Calendar difference', value: `${result.calendarYears}y ${result.calendarMonths}m ${result.calendarDays}d` },
          { label: 'Direction', value: result.direction },
        ],
        steps: [
          'Convert both dates to UTC calendar dates.',
          'Subtract the timestamps to count full days between dates.',
          'Also compare calendar year, month, and day parts for a human-readable difference.',
        ],
      };
    }
    case 'time': {
      const result = calculateTimeDuration(
        {
          hours: parseNumber(inputs.firstHours, 'First hours'),
          minutes: parseNumber(inputs.firstMinutes, 'First minutes'),
          seconds: parseNumber(inputs.firstSeconds, 'First seconds'),
        },
        {
          hours: parseNumber(inputs.secondHours, 'Second hours'),
          minutes: parseNumber(inputs.secondMinutes, 'Second minutes'),
          seconds: parseNumber(inputs.secondSeconds, 'Second seconds'),
        },
        (inputs.operation || 'add') as 'add' | 'subtract',
      );
      return {
        label: 'Time duration result',
        expression: `${inputs.firstHours}:${inputs.firstMinutes}:${inputs.firstSeconds} ${inputs.operation === 'subtract' ? '-' : '+'} ${inputs.secondHours}:${inputs.secondMinutes}:${inputs.secondSeconds}`,
        answer: durationText(result.totalSeconds),
        metrics: [
          { label: 'Total seconds', value: formatCalculatorNumber(result.totalSeconds) },
          { label: 'Decimal hours', value: formatCalculatorNumber(result.totalSeconds / 3600) },
          { label: 'Operation', value: inputs.operation === 'subtract' ? 'Subtract' : 'Add' },
        ],
        steps: [
          'Convert each duration to total seconds.',
          'Add or subtract the second duration.',
          'Convert the final seconds back to hours, minutes, and seconds.',
        ],
      };
    }
    case 'hours': {
      const result = calculateHoursWorked(
        inputs.startTime,
        inputs.endTime,
        parseNumber(inputs.breakMinutes, 'Break minutes'),
        parseOptionalNumber(inputs.hourlyRate, 'Hourly rate'),
      );
      return {
        label: 'Hours worked',
        expression: `${inputs.startTime} to ${inputs.endTime}, ${inputs.breakMinutes || '0'} min break`,
        answer: `${formatCalculatorNumber(result.decimalHours)} hours`,
        metrics: [
          { label: 'Hours and minutes', value: durationText(result.decimalHours * 3600) },
          { label: 'Crossed midnight', value: result.crossedMidnight ? 'Yes' : 'No' },
          { label: 'Gross pay estimate', value: result.grossPay === null ? 'Add hourly rate' : money(result.grossPay) },
        ],
        steps: [
          'Convert start and end times into seconds after midnight.',
          'If the end time is earlier than the start time, treat it as an overnight shift.',
          'Subtract break minutes and convert the worked time to decimal hours.',
        ],
      };
    }
    case 'gpa': {
      const result = calculateGpa(readCourses(inputs));
      return {
        label: 'Estimated GPA',
        expression: `${formatCalculatorNumber(result.totalCredits)} credits`,
        answer: formatCalculatorNumber(result.gpa),
        metrics: [
          { label: 'Total credits', value: formatCalculatorNumber(result.totalCredits) },
          { label: 'Quality points', value: formatCalculatorNumber(result.totalQualityPoints) },
          { label: 'Scale', value: 'Common 4.0 scale' },
        ],
        steps: [
          'Convert each letter grade to grade points on the selected 4.0 scale.',
          'Multiply grade points by course credits to get quality points.',
          'Divide total quality points by total credits.',
        ],
        note: 'Use your school catalog or syllabus if it uses weighted, honors, AP, pass/fail, or plus/minus rules differently.',
      };
    }
    case 'grade': {
      const result = calculateNeededFinalGrade(
        parseNumber(inputs.currentGradePercent, 'Current grade'),
        parseNumber(inputs.finalWeightPercent, 'Final weight'),
        parseNumber(inputs.desiredGradePercent, 'Desired grade'),
      );
      return {
        label: 'Needed final exam grade',
        expression: `${percent(result.currentGradePercent)} current, final worth ${percent(result.finalWeightPercent)}`,
        answer: percent(result.neededFinalPercent),
        metrics: [
          { label: 'Goal', value: percent(result.desiredGradePercent) },
          { label: 'Possible without extra credit', value: result.possibleWithoutExtraCredit ? 'Yes' : 'No' },
          { label: 'Current coursework weight', value: percent(100 - result.finalWeightPercent) },
        ],
        steps: [
          'Convert the final exam weight into a decimal.',
          'Multiply the current grade by the remaining coursework weight.',
          'Solve for the final exam grade needed to reach the desired course grade.',
        ],
      };
    }
    case 'concrete': {
      const result = calculateConcrete({
        lengthFeet: parseNumber(inputs.lengthFeet, 'Length'),
        widthFeet: parseNumber(inputs.widthFeet, 'Width'),
        depthInches: parseNumber(inputs.depthInches, 'Depth'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
      });
      return {
        label: 'Estimated concrete volume',
        expression: `${formatCalculatorNumber(result.lengthFeet)} ft x ${formatCalculatorNumber(result.widthFeet)} ft x ${formatCalculatorNumber(result.depthInches)} in`,
        answer: `${formatCalculatorNumber(result.cubicYards)} yd3`,
        metrics: [
          { label: 'Cubic feet', value: formatCalculatorNumber(result.cubicFeet) },
          { label: 'Cubic meters', value: formatCalculatorNumber(result.cubicMeters) },
          { label: '80 lb bags', value: formatCalculatorNumber(result.bags80lb) },
          { label: '60 lb bags', value: formatCalculatorNumber(result.bags60lb) },
        ],
        steps: [
          'Convert depth from inches to feet.',
          'Multiply length by width by depth to find cubic feet.',
          'Add the waste percentage, then divide by 27 for cubic yards.',
        ],
        note: 'Bag counts use common approximate dry-mix yields. Check the exact bag label before buying.',
      };
    }
    case 'subnet': {
      const result = calculateSubnet(inputs.ipAddress, parseNumber(inputs.prefixLength, 'Prefix length'));
      return {
        label: 'IPv4 subnet',
        expression: `${result.ipAddress}/${result.prefixLength}`,
        answer: `${result.networkAddress}/${result.prefixLength}`,
        metrics: [
          { label: 'Subnet mask', value: result.subnetMask },
          { label: 'Wildcard mask', value: result.wildcardMask },
          { label: 'Broadcast', value: result.broadcastAddress },
          { label: 'Usable range', value: `${result.firstUsableAddress} - ${result.lastUsableAddress}` },
          { label: 'Usable addresses', value: formatCalculatorNumber(result.usableAddresses) },
        ],
        steps: [
          'Convert the IPv4 address and CIDR prefix into 32-bit values.',
          'Build the subnet mask from the prefix length.',
          'Use bitwise network and wildcard math to find network, broadcast, and usable range.',
        ],
      };
    }
    case 'password-generator': {
      const result = generatePassword({
        length: parseNumber(inputs.length, 'Length'),
        includeUppercase: booleanInput(inputs.includeUppercase),
        includeLowercase: booleanInput(inputs.includeLowercase),
        includeNumbers: booleanInput(inputs.includeNumbers),
        includeSymbols: booleanInput(inputs.includeSymbols),
        avoidAmbiguous: booleanInput(inputs.avoidAmbiguous),
      });
      return {
        label: 'Generated password',
        expression: `${result.length} characters, pool size ${result.characterPoolSize}`,
        answer: result.password,
        metrics: [
          { label: 'Length', value: formatCalculatorNumber(result.length) },
          { label: 'Character pool', value: formatCalculatorNumber(result.characterPoolSize) },
          { label: 'Estimated entropy', value: `${formatCalculatorNumber(result.estimatedEntropyBits)} bits` },
        ],
        steps: [
          'Build a character pool from the options you selected.',
          'Use browser cryptographic random values to pick each character.',
          'Do not save generated passwords in the recent-answer panel.',
        ],
        note: 'Use a unique password for every account and store it in a trusted password manager.',
        keepOutOfHistory: true,
      };
    }
    case 'conversion': {
      const category = modeId as ConversionCategory;
      const result = convertMeasurement(category, parseNumber(inputs.value, 'Value'), inputs.fromUnit, inputs.toUnit);
      return {
        label: `${unitLabel(result.fromUnit)} to ${unitLabel(result.toUnit)}`,
        expression: `${formatCalculatorNumber(result.input)} ${unitLabel(result.fromUnit)}`,
        answer: `${formatCalculatorNumber(result.result)} ${unitLabel(result.toUnit)}`,
        metrics: [
          { label: 'Category', value: result.category },
          { label: 'From', value: unitLabel(result.fromUnit) },
          { label: 'To', value: unitLabel(result.toUnit) },
        ],
        steps: [
          result.category === 'temperature'
            ? 'Convert the starting temperature to Celsius first.'
            : 'Convert the starting unit to the category base unit.',
          result.category === 'temperature'
            ? 'Convert Celsius into the target temperature unit.'
            : 'Divide by the target unit factor to get the converted value.',
          'Round the displayed result for readability while keeping the formula direct.',
        ],
      };
    }
    case 'dice-roller': {
      const result = calculateDiceRoll(
        parseNumber(inputs.diceCount, 'Dice count'),
        parseNumber(inputs.sides, 'Sides'),
        parseNumber(inputs.modifier || '0', 'Modifier'),
      );
      return {
        label: `${result.diceCount}d${result.sides}${result.modifier ? result.modifier > 0 ? ` + ${result.modifier}` : ` - ${Math.abs(result.modifier)}` : ''}`,
        expression: result.rolls.join(', '),
        answer: formatCalculatorNumber(result.total),
        metrics: [
          { label: 'Rolls', value: result.rolls.join(', ') },
          { label: 'Subtotal', value: formatCalculatorNumber(result.subtotal) },
          { label: 'Modifier', value: formatCalculatorNumber(result.modifier) },
        ],
        steps: [
          `Roll ${result.diceCount} dice with ${result.sides} sides each.`,
          `Add the rolls to get subtotal ${formatCalculatorNumber(result.subtotal)}.`,
          `Apply modifier ${formatCalculatorNumber(result.modifier)} for total ${formatCalculatorNumber(result.total)}.`,
        ],
      };
    }
    case 'fuel-cost': {
      const result = calculateFuelCost(
        parseNumber(inputs.distanceMiles, 'Distance'),
        parseNumber(inputs.milesPerGallon, 'Miles per gallon'),
        parseNumber(inputs.pricePerGallon, 'Fuel price'),
        booleanInput(inputs.roundTrip),
      );
      return {
        label: result.roundTrip ? 'Estimated round-trip fuel cost' : 'Estimated one-way fuel cost',
        expression: `${formatCalculatorNumber(result.totalDistanceMiles)} mi at ${formatCalculatorNumber(result.milesPerGallon)} MPG`,
        answer: money(result.fuelCost),
        metrics: [
          { label: 'Gallons needed', value: formatCalculatorNumber(result.gallonsNeeded) },
          { label: 'Cost per mile', value: money(result.costPerMile) },
          { label: 'Total distance', value: `${formatCalculatorNumber(result.totalDistanceMiles)} mi` },
        ],
        steps: [
          result.roundTrip ? 'Double the one-way distance for a round trip.' : 'Use the one-way distance as entered.',
          'Divide miles by MPG to estimate gallons needed.',
          'Multiply gallons by price per gallon to estimate trip fuel cost.',
        ],
      };
    }
    case 'square-footage': {
      const result = calculateSquareFootage(
        parseNumber(inputs.lengthFeet, 'Length'),
        parseNumber(inputs.widthFeet, 'Width'),
        parseNumber(inputs.quantity, 'Quantity'),
      );
      return {
        label: 'Total square footage',
        expression: `${formatCalculatorNumber(result.lengthFeet)} ft x ${formatCalculatorNumber(result.widthFeet)} ft x ${result.quantity}`,
        answer: `${formatCalculatorNumber(result.totalSquareFeet)} ft2`,
        metrics: [
          { label: 'Each item', value: `${formatCalculatorNumber(result.squareFeetEach)} ft2` },
          { label: 'Square yards', value: formatCalculatorNumber(result.totalSquareYards) },
          { label: 'Square meters', value: formatCalculatorNumber(result.totalSquareMeters) },
        ],
        steps: [
          'Multiply length by width to find square feet for one rectangle.',
          'Multiply by quantity when you have repeated rooms, panels, or sections.',
          'Convert square feet to square yards and square meters for comparison.',
        ],
      };
    }
    case 'time-card': {
      const result = calculateTimeCard(readTimeCardEntries(inputs), parseOptionalNumber(inputs.hourlyRate || '', 'Hourly rate'));
      return {
        label: 'Weekly time card total',
        expression: `${result.days.length} worked days`,
        answer: `${formatCalculatorNumber(result.totalHours)} hours`,
        metrics: [
          { label: 'Hours and minutes', value: durationText(result.totalHours * 3600) },
          { label: 'Gross pay estimate', value: result.grossPay === null ? 'Add hourly rate' : money(result.grossPay) },
          { label: 'Worked days', value: formatCalculatorNumber(result.days.length) },
        ],
        steps: [
          'Calculate each day from start time, end time, and unpaid break minutes.',
          'Add all daily decimal hours for the weekly total.',
          'Multiply by hourly rate only when a rate is entered.',
        ],
        note: 'This does not apply overtime, payroll rounding, paid break rules, or local labor policies.',
      };
    }
    case 'time-zone': {
      const result = calculateTimeZoneComparison(inputs.utcDate, inputs.utcTime, inputs.timeZone);
      return {
        label: `${result.timeZone} local time`,
        expression: `${result.utcDateTime} UTC`,
        answer: `${result.localDate} ${result.localTime}`,
        metrics: [
          { label: 'UTC offset', value: result.offsetLabel },
          { label: 'IANA zone', value: result.timeZone },
          { label: 'UTC time', value: result.utcDateTime },
        ],
        steps: [
          'Treat the entered date and time as a UTC instant.',
          'Use browser time zone data for the selected IANA time zone.',
          'Return the local calendar date, local clock time, and current UTC offset for that instant.',
        ],
      };
    }
    case 'gas-mileage': {
      const result = calculateGasMileage(
        parseNumber(inputs.milesDriven, 'Miles driven'),
        parseNumber(inputs.gallonsUsed, 'Gallons used'),
      );
      return {
        label: 'Fuel economy',
        expression: `${formatCalculatorNumber(result.milesDriven)} mi / ${formatCalculatorNumber(result.gallonsUsed)} gal`,
        answer: `${formatCalculatorNumber(result.milesPerGallon)} MPG`,
        metrics: [
          { label: 'Gallons per 100 mi', value: formatCalculatorNumber(result.gallonsPer100Miles) },
          { label: 'L/100 km', value: formatCalculatorNumber(result.litersPer100Km) },
          { label: 'Miles driven', value: formatCalculatorNumber(result.milesDriven) },
        ],
        steps: [
          'Divide miles driven by gallons used.',
          'Convert the same result into gallons per 100 miles for comparison.',
          'Use the standard MPG to L/100 km conversion for metric comparison.',
        ],
      };
    }
    case 'tip': {
      const result = calculateTip(
        parseNumber(inputs.subtotal, 'Subtotal'),
        parseNumber(inputs.tipPercent, 'Tip percent'),
        parseNumber(inputs.taxPercent || '0', 'Tax percent'),
        parseNumber(inputs.people || '1', 'People'),
      );
      return {
        label: 'Bill total with tip',
        expression: `${money(result.subtotal)} subtotal, ${percent(result.tipPercent)} tip`,
        answer: money(result.total),
        metrics: [
          { label: 'Tip', value: money(result.tipAmount) },
          { label: 'Tax', value: money(result.taxAmount) },
          { label: 'Per person', value: money(result.perPerson) },
        ],
        steps: [
          'Multiply subtotal by tip percent to find the tip amount.',
          'Multiply subtotal by tax percent when tax is entered.',
          'Add subtotal, tip, and tax, then divide by people for a split bill.',
        ],
      };
    }
    case 'mileage': {
      const result = calculateMileageCost(
        parseNumber(inputs.miles, 'Miles'),
        parseNumber(inputs.ratePerMile, 'Rate per mile'),
        parseNumber(inputs.extraCosts || '0', 'Extra costs'),
      );
      return {
        label: 'Mileage amount',
        expression: `${formatCalculatorNumber(result.miles)} mi x ${money(result.ratePerMile)}/mi`,
        answer: money(result.total),
        metrics: [
          { label: 'Mileage only', value: money(result.mileageAmount) },
          { label: 'Extras', value: money(result.extraCosts) },
          { label: 'Rate', value: `${money(result.ratePerMile)} per mile` },
        ],
        steps: [
          'Multiply miles by the rate per mile.',
          'Add parking, tolls, or other extra costs if entered.',
          'Use the rate required by your employer, client, or tax authority.',
        ],
      };
    }
    case 'density': {
      const result = calculateDensity(parseNumber(inputs.mass, 'Mass'), parseNumber(inputs.volume, 'Volume'));
      const unit = inputs.unitLabel?.trim() || 'mass/volume';
      return {
        label: 'Density',
        expression: `${formatCalculatorNumber(result.mass)} / ${formatCalculatorNumber(result.volume)}`,
        answer: `${formatCalculatorNumber(result.density)} ${unit}`,
        metrics: [
          { label: 'Mass', value: formatCalculatorNumber(result.mass) },
          { label: 'Volume', value: formatCalculatorNumber(result.volume) },
          { label: 'Formula', value: 'mass / volume' },
        ],
        steps: [
          'Check that mass and volume use matching units.',
          'Divide mass by volume.',
          'Label the result with the density unit you entered.',
        ],
      };
    }
    case 'mass': {
      const result = calculateMassFromDensity(parseNumber(inputs.density, 'Density'), parseNumber(inputs.volume, 'Volume'));
      const unit = inputs.unitLabel?.trim() || 'mass units';
      return {
        label: 'Mass from density and volume',
        expression: `${formatCalculatorNumber(result.density)} x ${formatCalculatorNumber(result.volume)}`,
        answer: `${formatCalculatorNumber(result.mass)} ${unit}`,
        metrics: [
          { label: 'Density', value: formatCalculatorNumber(result.density) },
          { label: 'Volume', value: formatCalculatorNumber(result.volume) },
          { label: 'Formula', value: 'density x volume' },
        ],
        steps: [
          'Check that density and volume units match.',
          'Multiply density by volume.',
          'Label the result with the mass unit you entered.',
        ],
      };
    }
    case 'weight': {
      const result = calculateWeightForce(
        parseNumber(inputs.massKg, 'Mass'),
        parseNumber(inputs.gravityMps2, 'Gravity'),
      );
      return {
        label: 'Weight force',
        expression: `${formatCalculatorNumber(result.massKg)} kg x ${formatCalculatorNumber(result.gravityMps2)} m/s2`,
        answer: `${formatCalculatorNumber(result.weightNewtons)} N`,
        metrics: [
          { label: 'Pounds-force', value: `${formatCalculatorNumber(result.weightPoundsForce)} lbf` },
          { label: 'Mass in pounds', value: `${formatCalculatorNumber(result.massPounds)} lb mass` },
          { label: 'Gravity', value: `${formatCalculatorNumber(result.gravityMps2)} m/s2` },
        ],
        steps: [
          'Use weight force = mass x gravity.',
          'Standard Earth gravity is about 9.80665 m/s2.',
          'Convert newtons to pounds-force for comparison.',
        ],
      };
    }
    case 'speed': {
      const result = calculateSpeed(
        parseNumber(inputs.distanceMiles, 'Distance'),
        parseNumber(inputs.hours || '0', 'Hours'),
        parseNumber(inputs.minutes || '0', 'Minutes'),
        parseNumber(inputs.seconds || '0', 'Seconds'),
      );
      return {
        label: 'Average speed',
        expression: `${formatCalculatorNumber(result.distanceMiles)} miles in ${durationText(result.totalSeconds)}`,
        answer: `${formatCalculatorNumber(result.milesPerHour)} mph`,
        metrics: [
          { label: 'km/h', value: formatCalculatorNumber(result.kilometersPerHour) },
          { label: 'm/s', value: formatCalculatorNumber(result.metersPerSecond) },
          { label: 'Decimal hours', value: formatCalculatorNumber(result.hours) },
        ],
        steps: [
          'Convert the entered time into total seconds and decimal hours.',
          'Divide distance by decimal hours for miles per hour.',
          'Convert mph to km/h and m/s for comparison.',
        ],
      };
    }
    case 'roman-numeral': {
      const numberMode = inputs.operation !== 'roman-to-number';
      const answer = numberMode
        ? numberToRomanNumeral(parseNumber(inputs.value, 'Number'))
        : formatCalculatorNumber(romanNumeralToNumber(inputs.value));
      return {
        label: numberMode ? 'Roman numeral' : 'Number',
        expression: inputs.value,
        answer,
        metrics: [
          { label: 'Mode', value: numberMode ? 'Number to Roman' : 'Roman to number' },
          { label: 'Range', value: '1 to 3,999' },
          { label: 'Standard form', value: 'Subtractive notation' },
        ],
        steps: numberMode
          ? [
              'Start with the largest Roman symbol that fits the number.',
              'Subtract its value and keep moving downward through the symbol list.',
              'Use subtractive pairs such as IV, IX, XL, XC, CD, and CM where needed.',
            ]
          : [
              'Read each Roman symbol from left to right.',
              'Subtract a symbol when it appears before a larger symbol.',
              'Add the adjusted values to get the standard number.',
            ],
      };
    }
    case 'base64': {
      const encoding = inputs.operation !== 'decode';
      const answer = encoding ? encodeBase64(inputs.text ?? '') : decodeBase64(inputs.text ?? '');
      return {
        label: encoding ? 'Base64 encoded text' : 'Decoded text',
        expression: encoding ? 'UTF-8 text to Base64' : 'Base64 to UTF-8 text',
        answer,
        metrics: [
          { label: 'Input length', value: formatCalculatorNumber((inputs.text ?? '').length) },
          { label: 'Output length', value: formatCalculatorNumber(answer.length) },
          { label: 'Mode', value: encoding ? 'Encode' : 'Decode' },
        ],
        steps: [
          encoding ? 'Convert the text to UTF-8 bytes.' : 'Read the Base64 characters and padding.',
          encoding ? 'Group bytes into 6-bit Base64 values.' : 'Convert Base64 values back into bytes.',
          encoding ? 'Add padding when the byte count is not a multiple of three.' : 'Decode the bytes as UTF-8 text.',
        ],
      };
    }
    case 'url-encode-decode': {
      const encoding = inputs.operation !== 'decode';
      const plusSpaces = booleanInput(inputs.plusSpaces);
      const answer = encoding
        ? encodeUrlComponentValue(inputs.text ?? '', plusSpaces)
        : decodeUrlComponentValue(inputs.text ?? '', plusSpaces);
      return {
        label: encoding ? 'URL-encoded component' : 'Decoded URL component',
        expression: encoding ? 'Text to percent-encoding' : 'Percent-encoding to text',
        answer,
        metrics: [
          { label: 'Input length', value: formatCalculatorNumber((inputs.text ?? '').length) },
          { label: 'Output length', value: formatCalculatorNumber(answer.length) },
          { label: 'Spaces', value: plusSpaces ? '+ form style' : '%20 URI style' },
        ],
        steps: [
          encoding ? 'Read the text as a URL component, such as a query value.' : 'Read percent-encoded triplets such as %20.',
          encoding ? 'Percent-encode reserved characters that would change URL meaning.' : 'Convert percent-encoded bytes back into characters.',
          plusSpaces ? 'Treat spaces as plus signs for form-style values.' : 'Treat spaces as %20 for URI-style values.',
        ],
      };
    }
    case 'day-of-week': {
      const result = calculateDayOfWeek(inputs.date);
      return {
        label: 'Day of the week',
        expression: dateText(result.date),
        answer: result.weekday,
        metrics: [
          { label: 'ISO weekday', value: formatCalculatorNumber(result.isoWeekday) },
          { label: 'Sunday-based index', value: formatCalculatorNumber(result.weekdayIndex) },
          { label: 'Date', value: result.date },
        ],
        steps: [
          'Read the entered date as a calendar date.',
          'Use UTC date math so daylight-saving time does not shift the date.',
          'Return both the weekday name and ISO weekday number.',
        ],
      };
    }
    case 'height': {
      const motherHeight = parseNumber(inputs.motherFeet, 'Mother feet') * 12 + parseNumber(inputs.motherInches, 'Mother inches');
      const fatherHeight = parseNumber(inputs.fatherFeet, 'Father feet') * 12 + parseNumber(inputs.fatherInches, 'Father inches');
      const result = calculateHeightEstimate((inputs.childSex || 'male') as 'male' | 'female', motherHeight, fatherHeight);
      return {
        label: 'Estimated adult height',
        expression: `${heightText(result.motherHeightInches)} and ${heightText(result.fatherHeightInches)}`,
        answer: heightText(result.estimatedAdultHeightInches),
        metrics: [
          { label: 'Approximate range', value: `${heightText(result.lowRangeInches)} - ${heightText(result.highRangeInches)}` },
          { label: 'Centimeters', value: `${formatCalculatorNumber(result.estimatedAdultHeightCm)} cm` },
          { label: 'Method', value: 'Mid-parental estimate' },
        ],
        steps: [
          'Convert each parent height to total inches.',
          result.childSex === 'male' ? 'Add 5 inches for a male estimate, then average.' : 'Subtract 5 inches for a female estimate, then average.',
          'Show a rough plus-or-minus 4 inch range because real growth varies.',
        ],
        note: 'Children grow differently. Pediatric growth concerns should be checked with a healthcare professional.',
      };
    }
    case 'bra-size': {
      const result = calculateBraSize(parseNumber(inputs.underbustInches, 'Underbust'), parseNumber(inputs.bustInches, 'Bust'));
      return {
        label: 'Estimated US bra size',
        expression: `${formatCalculatorNumber(result.underbustInches)} in underbust, ${formatCalculatorNumber(result.bustInches)} in bust`,
        answer: result.sizeLabel,
        metrics: [
          { label: 'Band', value: formatCalculatorNumber(result.bandSize) },
          { label: 'Cup', value: result.cupSize },
          { label: 'Bust minus band', value: `${formatCalculatorNumber(result.differenceInches)} in` },
        ],
        steps: [
          'Round the underbust up to the next even band size.',
          'Subtract the band size from the bust measurement.',
          'Map that difference to an approximate cup label.',
        ],
        note: 'Bra sizing varies a lot by brand, body shape, and style. Treat this as a fitting starting point.',
      };
    }
    case 'voltage-drop': {
      const resistance = getCopperResistanceOhmsPer1000Feet(inputs.wireGauge || '12');
      const result = calculateVoltageDrop({
        sourceVoltage: parseNumber(inputs.sourceVoltage, 'Source voltage'),
        currentAmps: parseNumber(inputs.currentAmps, 'Current'),
        oneWayLengthFeet: parseNumber(inputs.oneWayLengthFeet, 'One-way length'),
        resistanceOhmsPer1000Feet: resistance,
        phase: (inputs.phase || 'single') as 'single' | 'three',
      });
      return {
        label: 'Estimated voltage drop',
        expression: `${formatCalculatorNumber(result.currentAmps)} A over ${formatCalculatorNumber(result.oneWayLengthFeet)} ft`,
        answer: `${formatCalculatorNumber(result.voltageDrop)} V`,
        metrics: [
          { label: 'Percent drop', value: percent(result.percentDrop) },
          { label: 'Load voltage', value: `${formatCalculatorNumber(result.loadVoltage)} V` },
          { label: 'Wire resistance', value: `${formatCalculatorNumber(result.resistanceOhmsPer1000Feet)} ohms / 1000 ft` },
        ],
        steps: [
          'Look up the approximate copper conductor resistance for the selected AWG size.',
          result.phase === 'three' ? 'Use the square-root-of-3 factor for a balanced three-phase estimate.' : 'Double the one-way length for the out-and-back circuit path.',
          'Divide the voltage drop by source voltage to show the percent drop.',
        ],
        note: 'This is a simplified estimate. Use local electrical code, conductor temperature, material, raceway, and a licensed electrician for real installations.',
      };
    }
    case 'btu': {
      const result = calculateBtuEstimate({
        squareFeet: parseNumber(inputs.squareFeet, 'Square feet'),
        ceilingHeightFeet: parseNumber(inputs.ceilingHeightFeet, 'Ceiling height'),
        sunlight: (inputs.sunlight || 'normal') as 'normal' | 'shaded' | 'sunny',
        people: parseNumber(inputs.people, 'People'),
        kitchen: booleanInput(inputs.kitchen),
      });
      return {
        label: 'Recommended cooling capacity',
        expression: `${formatCalculatorNumber(result.squareFeet)} ft2 room`,
        answer: `${formatCalculatorNumber(result.recommendedBtu)} BTU/h`,
        metrics: [
          { label: 'Base table value', value: `${formatCalculatorNumber(result.baseBtu)} BTU/h` },
          { label: 'Adjusted estimate', value: `${formatCalculatorNumber(result.adjustedBtu)} BTU/h` },
          { label: 'Ceiling height', value: `${formatCalculatorNumber(result.ceilingHeightFeet)} ft` },
        ],
        steps: [
          'Start with a room-size BTU table for an 8-foot ceiling.',
          'Adjust for ceiling height, sun exposure, people, and kitchen heat when selected.',
          'Round to a practical 500 BTU increment.',
        ],
        note: 'Oversized air conditioners can cool without dehumidifying well. Use this as a shopping estimate, not HVAC design.',
      };
    }
    case 'stair': {
      const result = calculateStairLayout(
        parseNumber(inputs.totalRiseInches, 'Total rise'),
        parseNumber(inputs.targetRiserInches, 'Target riser'),
        parseNumber(inputs.treadDepthInches, 'Tread depth'),
      );
      return {
        label: 'Stair layout',
        expression: `${formatCalculatorNumber(result.totalRiseInches)} in total rise`,
        answer: `${formatCalculatorNumber(result.riserCount)} risers`,
        metrics: [
          { label: 'Actual riser', value: `${formatCalculatorNumber(result.actualRiserInches)} in` },
          { label: 'Treads', value: formatCalculatorNumber(result.treadCount) },
          { label: 'Total run', value: `${formatCalculatorNumber(result.totalRunInches)} in` },
          { label: 'Angle', value: `${formatCalculatorNumber(result.stairAngleDegrees)} deg` },
        ],
        steps: [
          'Divide total rise by the target riser height and round to a whole riser count.',
          'Divide total rise by that riser count to get the actual riser height.',
          'Use one fewer tread than risers for a typical straight stair run.',
        ],
        note: 'Stair rules are safety critical and local. Check code, landings, headroom, handrails, and uniformity before building.',
      };
    }
    case 'resistor': {
      const result = calculateResistorColorCode(inputs.band1, inputs.band2, inputs.multiplier, inputs.tolerance);
      return {
        label: 'Resistor value',
        expression: `${result.band1}, ${result.band2}, ${result.multiplier}, ${result.tolerance}`,
        answer: `${formatCalculatorNumber(result.resistanceOhms)} ohms`,
        metrics: [
          { label: 'Tolerance', value: `+/- ${formatCalculatorNumber(result.tolerancePercent)}%` },
          { label: 'Minimum', value: `${formatCalculatorNumber(result.resistanceOhms * (1 - result.tolerancePercent / 100))} ohms` },
          { label: 'Maximum', value: `${formatCalculatorNumber(result.resistanceOhms * (1 + result.tolerancePercent / 100))} ohms` },
        ],
        steps: [
          'Read the first two color bands as digits.',
          'Multiply by the multiplier color band.',
          'Read the tolerance band as the expected manufacturing range.',
        ],
      };
    }
    case 'ohms-law': {
      const result = calculateOhmsLaw(modeId, parseNumber(inputs.firstValue, 'First value'), parseNumber(inputs.secondValue, 'Second value'));
      return {
        label: 'Circuit values',
        expression: modeId.replace(/-/g, ' and '),
        answer: `${formatCalculatorNumber(result.power)} W`,
        metrics: [
          { label: 'Voltage', value: `${formatCalculatorNumber(result.voltage)} V` },
          { label: 'Current', value: `${formatCalculatorNumber(result.current)} A` },
          { label: 'Resistance', value: `${formatCalculatorNumber(result.resistance)} ohms` },
        ],
        steps: [
          'Use Ohm law V = I x R to solve the missing core value.',
          'Use power P = V x I after voltage and current are known.',
          'Show voltage, current, resistance, and power together for checking.',
        ],
        note: 'This is simple DC/resistive-circuit math. Real circuits can involve AC, impedance, heat, and safety limits.',
      };
    }
    case 'electricity': {
      const result = calculateElectricityCost(
        parseNumber(inputs.watts, 'Watts'),
        parseNumber(inputs.hoursPerDay, 'Hours per day'),
        parseNumber(inputs.days, 'Days'),
        parseNumber(inputs.ratePerKwh, 'Rate per kWh'),
      );
      return {
        label: 'Estimated electricity cost',
        expression: `${formatCalculatorNumber(result.watts)} W for ${formatCalculatorNumber(result.hoursPerDay)} h/day`,
        answer: money(result.cost),
        metrics: [
          { label: 'Energy', value: `${formatCalculatorNumber(result.kilowattHours)} kWh` },
          { label: 'Days', value: formatCalculatorNumber(result.days) },
          { label: 'Rate', value: `${money(result.ratePerKwh)} per kWh` },
        ],
        steps: [
          'Convert watts to kilowatts by dividing by 1,000.',
          'Multiply by hours per day and number of days to get kWh.',
          'Multiply kWh by your electricity rate.',
        ],
      };
    }
    case 'shoe-size': {
      const result = convertShoeSize(parseNumber(inputs.footLengthCm, 'Foot length'));
      return {
        label: 'Approximate shoe sizes',
        expression: `${formatCalculatorNumber(result.footLengthCm)} cm foot length`,
        answer: `US men ${formatCalculatorNumber(result.usMen)}`,
        metrics: [
          { label: 'US women', value: formatCalculatorNumber(result.usWomen) },
          { label: 'UK adult', value: formatCalculatorNumber(result.ukAdult) },
          { label: 'EU adult', value: formatCalculatorNumber(result.euAdult) },
          { label: 'Foot inches', value: formatCalculatorNumber(result.footLengthInches) },
        ],
        steps: [
          'Convert foot length from centimeters to inches.',
          'Apply common adult-size conversion formulas.',
          'Round only for display so you can compare nearby half sizes.',
        ],
        note: 'Shoe conversions are approximate. Try manufacturer size charts when fit matters.',
      };
    }
    case 'molarity': {
      const result =
        modeId === 'grams-volume'
          ? calculateMolarity({
              grams: parseNumber(inputs.grams, 'Grams'),
              molarMass: parseNumber(inputs.molarMass, 'Molar mass'),
              volumeLiters: parseNumber(inputs.volumeLiters, 'Volume'),
            })
          : calculateMolarity({
              moles: parseNumber(inputs.moles, 'Moles'),
              volumeLiters: parseNumber(inputs.volumeLiters, 'Volume'),
            });
      return {
        label: 'Molarity',
        expression: `${formatCalculatorNumber(result.moles)} mol / ${formatCalculatorNumber(result.volumeLiters)} L`,
        answer: `${formatCalculatorNumber(result.molarity)} M`,
        metrics: [
          { label: 'Moles', value: `${formatCalculatorNumber(result.moles)} mol` },
          { label: 'Volume', value: `${formatCalculatorNumber(result.volumeLiters)} L` },
          { label: 'Molar mass', value: result.molarMass ? `${formatCalculatorNumber(result.molarMass)} g/mol` : 'Entered moles directly' },
        ],
        steps: [
          modeId === 'grams-volume' ? 'Divide grams by molar mass to get moles.' : 'Use the moles you entered directly.',
          'Divide moles of solute by liters of solution.',
          'Report the result as mol/L, commonly written as M.',
        ],
        note: 'Use lab-safe procedures and measured final solution volume for real chemistry work.',
      };
    }
    case 'molecular-weight': {
      const result = calculateMolecularWeight(inputs.formula);
      return {
        label: 'Molecular weight',
        expression: result.formula,
        answer: `${formatCalculatorNumber(result.molarMass)} g/mol`,
        metrics: [
          { label: 'Atoms counted', value: formatCalculatorNumber(result.atomCount) },
          { label: 'Elements', value: result.composition.map((item) => item.element).join(', ') },
          { label: 'Largest mass share', value: result.composition.slice().sort((a, b) => b.percent - a.percent)[0]?.element ?? 'None' },
        ],
        steps: [
          'Parse element symbols, subscripts, and parentheses in the formula.',
          'Multiply each element count by its rounded atomic weight.',
          'Add the element masses to estimate molar mass.',
        ],
        note: `Composition: ${result.composition
          .map((item) => `${item.element} ${formatCalculatorNumber(item.count)} (${formatCalculatorNumber(item.percent)}%)`)
          .join(', ')}`,
      };
    }
    case 'sleep': {
      const result = calculateSleepSchedule(modeId as 'wake-up' | 'bedtime', inputs.inputTime, parseNumber(inputs.cycles, 'Sleep cycles'), parseNumber(inputs.fallAsleepMinutes, 'Fall-asleep minutes'));
      return {
        label: result.mode === 'wake-up' ? 'Suggested bedtime' : 'Suggested wake-up time',
        expression: `${result.cycles} cycles from ${result.inputTime}`,
        answer: result.targetTime,
        metrics: [
          { label: 'Sleep time', value: clockDurationText(result.sleepDurationMinutes) },
          { label: 'Fall-asleep buffer', value: `${formatCalculatorNumber(result.fallAsleepMinutes)} min` },
          { label: 'Cycle length used', value: '90 min' },
        ],
        steps: [
          'Treat one sleep cycle as about 90 minutes.',
          result.mode === 'wake-up' ? 'Count backward from wake-up time by cycles and fall-asleep buffer.' : 'Count forward from bedtime by cycles and fall-asleep buffer.',
          'Wrap around midnight when needed.',
        ],
        note: 'Adults commonly need at least 7 hours of sleep, but quality and personal needs matter too.',
      };
    }
    case 'tire-size': {
      const result = calculateTireSize(parseNumber(inputs.widthMm, 'Width'), parseNumber(inputs.aspectRatio, 'Aspect ratio'), parseNumber(inputs.wheelDiameterInches, 'Wheel diameter'));
      return {
        label: 'Tire diameter',
        expression: `${formatCalculatorNumber(result.widthMm)}/${formatCalculatorNumber(result.aspectRatio)}R${formatCalculatorNumber(result.wheelDiameterInches)}`,
        answer: `${formatCalculatorNumber(result.tireDiameterInches)} in`,
        metrics: [
          { label: 'Sidewall', value: `${formatCalculatorNumber(result.sidewallInches)} in` },
          { label: 'Circumference', value: `${formatCalculatorNumber(result.circumferenceInches)} in` },
          { label: 'Revs per mile', value: formatCalculatorNumber(result.revolutionsPerMile) },
        ],
        steps: [
          'Multiply tire width by aspect ratio to get sidewall height.',
          'Convert sidewall height from millimeters to inches.',
          'Add two sidewalls to the wheel diameter for total tire diameter.',
        ],
        note: 'Changing tire size can affect fitment, speedometer readings, braking, and safety systems.',
      };
    }
    case 'roofing': {
      const result = calculateRoofingEstimate(parseNumber(inputs.lengthFeet, 'Length'), parseNumber(inputs.widthFeet, 'Width'), parseNumber(inputs.pitchRisePer12, 'Pitch rise'), parseNumber(inputs.wastePercent, 'Waste percent'));
      return {
        label: 'Estimated roof material',
        expression: `${formatCalculatorNumber(result.footprintSquareFeet)} ft2 footprint, ${formatCalculatorNumber(result.pitchRisePer12)}/12 pitch`,
        answer: `${formatCalculatorNumber(result.roofSquares)} squares`,
        metrics: [
          { label: 'Roof area with waste', value: `${formatCalculatorNumber(result.roofSquareFeet)} ft2` },
          { label: 'Pitch factor', value: formatCalculatorNumber(result.pitchFactor) },
          { label: 'Bundles', value: formatCalculatorNumber(result.shingleBundles) },
        ],
        steps: [
          'Multiply footprint length by width.',
          'Apply a pitch factor from the 12-inch roof run and pitch rise.',
          'Add waste and divide by 100 square feet per roofing square.',
        ],
        note: 'Complex roofs, valleys, hips, dormers, tear-off, and product coverage can change real orders.',
      };
    }
    case 'tile': {
      const result = calculateTileEstimate(parseNumber(inputs.areaSquareFeet, 'Area'), parseNumber(inputs.tileLengthInches, 'Tile length'), parseNumber(inputs.tileWidthInches, 'Tile width'), parseNumber(inputs.wastePercent, 'Waste percent'));
      return {
        label: 'Tiles needed',
        expression: `${formatCalculatorNumber(result.areaSquareFeet)} ft2 with ${formatCalculatorNumber(result.tileLengthInches)} x ${formatCalculatorNumber(result.tileWidthInches)} in tile`,
        answer: formatCalculatorNumber(result.tilesNeeded),
        metrics: [
          { label: 'Each tile area', value: `${formatCalculatorNumber(result.tileAreaSquareFeet)} ft2` },
          { label: 'Waste added', value: percent(result.wastePercent) },
          { label: 'Area with waste', value: `${formatCalculatorNumber(result.areaSquareFeet * (1 + result.wastePercent / 100))} ft2` },
        ],
        steps: [
          'Convert tile dimensions from square inches to square feet.',
          'Add waste to the project area.',
          'Divide adjusted area by tile area and round up to a whole tile.',
        ],
      };
    }
    case 'mulch': {
      const result = calculateMulchEstimate(parseNumber(inputs.areaSquareFeet, 'Area'), parseNumber(inputs.depthInches, 'Depth'), parseNumber(inputs.wastePercent, 'Waste percent'));
      return {
        label: 'Mulch needed',
        expression: `${formatCalculatorNumber(result.areaSquareFeet)} ft2 at ${formatCalculatorNumber(result.depthInches)} in`,
        answer: `${formatCalculatorNumber(result.cubicYards)} yd3`,
        metrics: [
          { label: 'Cubic feet', value: formatCalculatorNumber(result.cubicFeet) },
          { label: '2 ft3 bags', value: formatCalculatorNumber(result.twoCubicFootBags) },
          { label: 'Waste added', value: percent(result.wastePercent) },
        ],
        steps: [
          'Convert depth from inches to feet.',
          'Multiply area by depth to get cubic feet.',
          'Divide by 27 for cubic yards and by 2 for common bag count.',
        ],
      };
    }
    case 'gravel': {
      const result = calculateGravelEstimate(parseNumber(inputs.lengthFeet, 'Length'), parseNumber(inputs.widthFeet, 'Width'), parseNumber(inputs.depthInches, 'Depth'), parseNumber(inputs.tonsPerCubicYard, 'Tons per cubic yard'));
      return {
        label: 'Gravel needed',
        expression: `${formatCalculatorNumber(result.lengthFeet)} ft x ${formatCalculatorNumber(result.widthFeet)} ft x ${formatCalculatorNumber(result.depthInches)} in`,
        answer: `${formatCalculatorNumber(result.cubicYards)} yd3`,
        metrics: [
          { label: 'Cubic feet', value: formatCalculatorNumber(result.cubicFeet) },
          { label: 'Estimated tons', value: formatCalculatorNumber(result.tons) },
          { label: 'Density used', value: `${formatCalculatorNumber(result.tonsPerCubicYard)} tons/yd3` },
        ],
        steps: [
          'Convert depth from inches to feet.',
          'Multiply length, width, and depth for cubic feet.',
          'Divide by 27 for cubic yards, then multiply by tons per cubic yard.',
        ],
        note: 'Compaction, moisture, stone type, and supplier density can change the real delivered amount.',
      };
    }
    case 'paint': {
      const result = calculatePaintEstimate({
        lengthFeet: parseNumber(inputs.lengthFeet, 'Room length'),
        widthFeet: parseNumber(inputs.widthFeet, 'Room width'),
        wallHeightFeet: parseNumber(inputs.wallHeightFeet, 'Wall height'),
        doors: parseNumber(inputs.doors, 'Doors'),
        windows: parseNumber(inputs.windows, 'Windows'),
        coats: parseNumber(inputs.coats, 'Coats'),
        coverageSquareFeetPerGallon: parseNumber(inputs.coverageSquareFeetPerGallon, 'Coverage'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
      });
      return {
        label: 'Paint to buy',
        expression: `${formatCalculatorNumber(result.lengthFeet)} ft x ${formatCalculatorNumber(result.widthFeet)} ft room, ${formatCalculatorNumber(result.coats)} coats`,
        answer: `${formatCalculatorNumber(result.gallonsToBuy)} gallons`,
        metrics: [
          { label: 'Paintable wall area', value: `${formatCalculatorNumber(result.paintableSquareFeet)} ft2` },
          { label: 'Gallons before rounding', value: formatCalculatorNumber(result.gallonsNeeded) },
          { label: 'Coverage used', value: `${formatCalculatorNumber(result.coverageSquareFeetPerGallon)} ft2/gal` },
        ],
        steps: [
          'Find wall area from room perimeter times wall height.',
          'Subtract estimated openings using 20 square feet per door and 15 square feet per window.',
          'Multiply by coats, add extra percent, divide by coverage, then round up gallons.',
        ],
        note: 'Actual paint use changes with product, surface texture, primer, color change, and application method.',
      };
    }
    case 'drywall': {
      const result = calculateDrywallEstimate(parseNumber(inputs.areaSquareFeet, 'Area'), parseNumber(inputs.sheetLengthFeet, 'Sheet length'), parseNumber(inputs.sheetWidthFeet, 'Sheet width'), parseNumber(inputs.wastePercent, 'Waste percent'));
      return {
        label: 'Drywall sheets',
        expression: `${formatCalculatorNumber(result.areaSquareFeet)} ft2 with ${formatCalculatorNumber(result.sheetWidthFeet)} x ${formatCalculatorNumber(result.sheetLengthFeet)} ft sheets`,
        answer: formatCalculatorNumber(result.sheetsNeeded),
        metrics: [
          { label: 'Sheet area', value: `${formatCalculatorNumber(result.sheetAreaSquareFeet)} ft2` },
          { label: 'Area with waste', value: `${formatCalculatorNumber(result.adjustedAreaSquareFeet)} ft2` },
          { label: 'Waste added', value: percent(result.wastePercent) },
        ],
        steps: [
          'Multiply sheet length by sheet width for square feet per sheet.',
          'Add waste to the wall or ceiling area.',
          'Divide adjusted area by sheet area and round up to whole sheets.',
        ],
        note: 'Layout, seams, openings, sheet orientation, thickness, and local fire or moisture rules can change the real order.',
      };
    }
    case 'carpet': {
      const result = calculateCarpetEstimate(parseNumber(inputs.lengthFeet, 'Length'), parseNumber(inputs.widthFeet, 'Width'), parseNumber(inputs.rollWidthFeet, 'Roll width'), parseNumber(inputs.wastePercent, 'Waste percent'));
      return {
        label: 'Carpet area',
        expression: `${formatCalculatorNumber(result.lengthFeet)} ft x ${formatCalculatorNumber(result.widthFeet)} ft`,
        answer: `${formatCalculatorNumber(result.squareYards)} yd2`,
        metrics: [
          { label: 'Area with waste', value: `${formatCalculatorNumber(result.adjustedAreaSquareFeet)} ft2` },
          { label: 'Linear feet at roll width', value: `${formatCalculatorNumber(result.linearFeet)} ft` },
          { label: 'Roll width used', value: `${formatCalculatorNumber(result.rollWidthFeet)} ft` },
        ],
        steps: [
          'Multiply room length by width for square feet.',
          'Add waste for trimming, seams, and layout.',
          'Divide by 9 for square yards and by roll width for approximate linear feet.',
        ],
        note: 'Carpet orders depend heavily on seam placement, pattern direction, stairs, closets, and installer layout.',
      };
    }
    case 'flooring': {
      const result = calculateFlooringEstimate({
        areaSquareFeet: parseNumber(inputs.areaSquareFeet, 'Area'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
        boxCoverageSquareFeet: parseNumber(inputs.boxCoverageSquareFeet, 'Box coverage'),
        pricePerBox: parseOptionalNumber(inputs.pricePerBox ?? '', 'Price per box'),
      });
      return {
        label: 'Flooring boxes',
        expression: `${formatCalculatorNumber(result.areaSquareFeet)} ft2, ${formatCalculatorNumber(result.boxCoverageSquareFeet)} ft2 per box`,
        answer: `${formatCalculatorNumber(result.boxesNeeded)} boxes`,
        metrics: [
          { label: 'Area with waste', value: `${formatCalculatorNumber(result.adjustedAreaSquareFeet)} ft2` },
          { label: 'Coverage ordered', value: `${formatCalculatorNumber(result.totalCoverageSquareFeet)} ft2` },
          { label: 'Estimated cost', value: result.estimatedCost === null ? 'Add box price' : money(result.estimatedCost) },
        ],
        steps: [
          'Add waste to the measured flooring area.',
          'Divide adjusted area by square feet per box.',
          'Round up to whole boxes and multiply by box price when provided.',
        ],
        note: 'Pattern direction, cuts, stairs, closets, damaged pieces, and dye lots can change the real order.',
      };
    }
    case 'wallpaper': {
      const result = calculateWallpaperEstimate({
        roomLengthFeet: parseNumber(inputs.roomLengthFeet, 'Room length'),
        roomWidthFeet: parseNumber(inputs.roomWidthFeet, 'Room width'),
        wallHeightFeet: parseNumber(inputs.wallHeightFeet, 'Wall height'),
        doors: parseNumber(inputs.doors, 'Doors'),
        windows: parseNumber(inputs.windows, 'Windows'),
        rollCoverageSquareFeet: parseNumber(inputs.rollCoverageSquareFeet, 'Roll coverage'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
      });
      return {
        label: 'Wallpaper rolls',
        expression: `${formatCalculatorNumber(result.roomLengthFeet)} ft x ${formatCalculatorNumber(result.roomWidthFeet)} ft room, ${formatCalculatorNumber(result.wallHeightFeet)} ft walls`,
        answer: `${formatCalculatorNumber(result.rollsNeeded)} rolls`,
        metrics: [
          { label: 'Wallpaper area', value: `${formatCalculatorNumber(result.wallpaperSquareFeet)} ft2` },
          { label: 'Area with waste', value: `${formatCalculatorNumber(result.adjustedSquareFeet)} ft2` },
          { label: 'Roll coverage', value: `${formatCalculatorNumber(result.rollCoverageSquareFeet)} ft2` },
        ],
        steps: [
          'Find wall area from room perimeter times wall height.',
          'Subtract estimated doors and windows.',
          'Add waste, divide by roll coverage, and round up to whole rolls.',
        ],
        note: 'Pattern repeat, usable roll yield, odd walls, and dye lots can change the real number of rolls.',
      };
    }
    case 'fence': {
      const result = calculateFenceEstimate({
        perimeterFeet: parseNumber(inputs.perimeterFeet, 'Perimeter'),
        panelWidthFeet: parseNumber(inputs.panelWidthFeet, 'Panel width'),
        postSpacingFeet: parseNumber(inputs.postSpacingFeet, 'Post spacing'),
        gateCount: parseNumber(inputs.gateCount, 'Gate count'),
        gateWidthFeet: parseNumber(inputs.gateWidthFeet, 'Gate width'),
      });
      return {
        label: 'Fence materials',
        expression: `${formatCalculatorNumber(result.perimeterFeet)} ft perimeter, ${formatCalculatorNumber(result.gateCount)} gate(s)`,
        answer: `${formatCalculatorNumber(result.panelsNeeded)} panels`,
        metrics: [
          { label: 'Fence run after gates', value: `${formatCalculatorNumber(result.fenceRunFeet)} ft` },
          { label: 'Total posts', value: formatCalculatorNumber(result.totalPosts) },
          { label: 'Gate posts included', value: formatCalculatorNumber(result.gatePosts) },
        ],
        steps: [
          'Subtract gate width from the total perimeter.',
          'Divide the remaining run by panel width and round up.',
          'Estimate line posts from spacing, then add two posts per gate.',
        ],
        note: 'Corners, ends, slope, terrain, bracing, custom panels, and local code can change post and panel needs.',
      };
    }
    case 'deck-cost': {
      const result = calculateDeckCostEstimate({
        lengthFeet: parseNumber(inputs.lengthFeet, 'Length'),
        widthFeet: parseNumber(inputs.widthFeet, 'Width'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
        deckCostPerSquareFoot: parseNumber(inputs.deckCostPerSquareFoot, 'Decking cost per square foot'),
        railingLinearFeet: parseNumber(inputs.railingLinearFeet, 'Railing length'),
        railingCostPerFoot: parseNumber(inputs.railingCostPerFoot, 'Railing cost per foot'),
        stairsCost: parseNumber(inputs.stairsCost, 'Stairs cost'),
      });
      return {
        label: 'Estimated deck cost',
        expression: `${formatCalculatorNumber(result.lengthFeet)} ft x ${formatCalculatorNumber(result.widthFeet)} ft deck`,
        answer: money(result.totalCost),
        metrics: [
          { label: 'Decking area with waste', value: `${formatCalculatorNumber(result.adjustedDeckAreaSquareFeet)} ft2` },
          { label: 'Decking cost', value: money(result.surfaceCost) },
          { label: 'Railing cost', value: money(result.railingCost) },
        ],
        steps: [
          'Multiply deck length by width for surface area.',
          'Add waste and multiply by deck cost per square foot.',
          'Add railing and stair allowances for a rough planning total.',
        ],
        note: 'Permits, framing, footings, fasteners, railing code, stairs, demolition, labor, and local prices can dominate real deck cost.',
      };
    }
    case 'paver': {
      const result = calculatePaverEstimate(parseNumber(inputs.areaSquareFeet, 'Area'), parseNumber(inputs.paverLengthInches, 'Paver length'), parseNumber(inputs.paverWidthInches, 'Paver width'), parseNumber(inputs.wastePercent, 'Waste percent'));
      return {
        label: 'Pavers needed',
        expression: `${formatCalculatorNumber(result.areaSquareFeet)} ft2, ${formatCalculatorNumber(result.paverLengthInches)} x ${formatCalculatorNumber(result.paverWidthInches)} in pavers`,
        answer: formatCalculatorNumber(result.paversNeeded),
        metrics: [
          { label: 'Each paver area', value: `${formatCalculatorNumber(result.paverAreaSquareFeet)} ft2` },
          { label: 'Area with waste', value: `${formatCalculatorNumber(result.adjustedAreaSquareFeet)} ft2` },
          { label: 'Waste added', value: percent(result.wastePercent) },
        ],
        steps: [
          'Convert paver length and width from square inches to square feet.',
          'Add waste to the project area.',
          'Divide adjusted area by paver area and round up.',
        ],
        note: 'Patterns, cuts, edging, base depth, joint sand, broken pavers, and box quantities can change what you buy.',
      };
    }
    case 'siding': {
      const result = calculateSidingEstimate({
        wallAreaSquareFeet: parseNumber(inputs.wallAreaSquareFeet, 'Wall area'),
        openingsSquareFeet: parseNumber(inputs.openingsSquareFeet, 'Openings'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
        pricePerSquare: parseOptionalNumber(inputs.pricePerSquare ?? '', 'Price per square'),
      });
      return {
        label: 'Siding squares',
        expression: `${formatCalculatorNumber(result.wallAreaSquareFeet)} ft2 exterior wall area`,
        answer: `${formatCalculatorNumber(result.squaresNeeded)} squares`,
        metrics: [
          { label: 'Net wall area', value: `${formatCalculatorNumber(result.netAreaSquareFeet)} ft2` },
          { label: 'Area with waste', value: `${formatCalculatorNumber(result.adjustedAreaSquareFeet)} ft2` },
          { label: 'Estimated cost', value: result.estimatedCost === null ? 'Add price per square' : money(result.estimatedCost) },
        ],
        steps: [
          'Subtract doors and windows from the measured exterior wall area.',
          'Add a waste factor for cuts, corners, and trim-heavy sections.',
          'Divide by 100 square feet per siding square and round up.',
        ],
        note: 'Gables, trim, starter strips, J-channel, corners, product exposure, and installer layout need separate planning.',
      };
    }
    case 'brick': {
      const result = calculateBrickEstimate({
        wallAreaSquareFeet: parseNumber(inputs.wallAreaSquareFeet, 'Wall area'),
        brickLengthInches: parseNumber(inputs.brickLengthInches, 'Brick length'),
        brickHeightInches: parseNumber(inputs.brickHeightInches, 'Brick height'),
        mortarJointInches: parseNumber(inputs.mortarJointInches, 'Mortar joint'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
      });
      return {
        label: 'Bricks needed',
        expression: `${formatCalculatorNumber(result.wallAreaSquareFeet)} ft2 wall face`,
        answer: `${formatCalculatorNumber(result.bricksNeeded)} bricks`,
        metrics: [
          { label: 'Brick face area', value: `${formatCalculatorNumber(result.brickFaceSquareFeet)} ft2` },
          { label: 'Area with waste', value: `${formatCalculatorNumber(result.adjustedAreaSquareFeet)} ft2` },
          { label: 'Mortar joint used', value: `${formatCalculatorNumber(result.mortarJointInches)} in` },
        ],
        steps: [
          'Add the mortar joint to the brick face dimensions.',
          'Convert the brick face area from square inches to square feet.',
          'Add waste to wall area, divide by brick face area, and round up.',
        ],
        note: 'Openings, bond pattern, corners, piers, cut bricks, wall thickness, and mortar quantities need separate takeoff.',
      };
    }
    case 'concrete-block': {
      const result = calculateConcreteBlockEstimate({
        wallLengthFeet: parseNumber(inputs.wallLengthFeet, 'Wall length'),
        wallHeightFeet: parseNumber(inputs.wallHeightFeet, 'Wall height'),
        blockLengthInches: parseNumber(inputs.blockLengthInches, 'Block length'),
        blockHeightInches: parseNumber(inputs.blockHeightInches, 'Block height'),
        openingsSquareFeet: parseNumber(inputs.openingsSquareFeet, 'Openings'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
      });
      return {
        label: 'Concrete blocks',
        expression: `${formatCalculatorNumber(result.wallLengthFeet)} ft x ${formatCalculatorNumber(result.wallHeightFeet)} ft wall`,
        answer: `${formatCalculatorNumber(result.blocksNeeded)} blocks`,
        metrics: [
          { label: 'Net wall area', value: `${formatCalculatorNumber(result.netWallAreaSquareFeet)} ft2` },
          { label: 'Courses', value: formatCalculatorNumber(result.courses) },
          { label: 'Blocks per course', value: formatCalculatorNumber(result.blocksPerCourse) },
        ],
        steps: [
          'Multiply wall length by height and subtract openings.',
          'Use nominal block length and height as the face coverage with mortar joint included.',
          'Add waste, divide by block face area, and round up.',
        ],
        note: 'Corners, bond pattern, lintels, half blocks, grout, rebar, mortar, footings, and structural design are outside this count.',
      };
    }
    case 'rebar': {
      const result = calculateRebarGridEstimate({
        slabLengthFeet: parseNumber(inputs.slabLengthFeet, 'Slab length'),
        slabWidthFeet: parseNumber(inputs.slabWidthFeet, 'Slab width'),
        spacingInches: parseNumber(inputs.spacingInches, 'Spacing'),
        barLengthFeet: parseNumber(inputs.barLengthFeet, 'Bar length'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
      });
      return {
        label: 'Rebar to buy',
        expression: `${formatCalculatorNumber(result.slabLengthFeet)} ft x ${formatCalculatorNumber(result.slabWidthFeet)} ft grid at ${formatCalculatorNumber(result.spacingInches)} in spacing`,
        answer: `${formatCalculatorNumber(result.barsToBuy)} bars`,
        metrics: [
          { label: 'Lengthwise bars', value: formatCalculatorNumber(result.lengthwiseBars) },
          { label: 'Widthwise bars', value: formatCalculatorNumber(result.widthwiseBars) },
          { label: 'Adjusted linear feet', value: `${formatCalculatorNumber(result.adjustedLinearFeet)} ft` },
        ],
        steps: [
          'Count bars running each direction from the slab dimension and spacing.',
          'Multiply bar counts by the length each direction runs.',
          'Add waste, divide by stock bar length, and round up.',
        ],
        note: 'This is a simple material takeoff. Structural spacing, bar size, laps, chairs, cover, edge distance, and local code need professional design.',
      };
    }
    case 'board-foot': {
      const result = calculateBoardFoot(parseNumber(inputs.thicknessInches, 'Thickness'), parseNumber(inputs.widthInches, 'Width'), parseNumber(inputs.lengthFeet, 'Length'), parseNumber(inputs.quantity, 'Quantity'));
      return {
        label: 'Board feet',
        expression: `${formatCalculatorNumber(result.thicknessInches)} in x ${formatCalculatorNumber(result.widthInches)} in x ${formatCalculatorNumber(result.lengthFeet)} ft x ${formatCalculatorNumber(result.quantity)}`,
        answer: `${formatCalculatorNumber(result.totalBoardFeet)} board ft`,
        metrics: [
          { label: 'Board feet each', value: formatCalculatorNumber(result.boardFeetEach) },
          { label: 'Quantity', value: formatCalculatorNumber(result.quantity) },
          { label: 'Formula divisor', value: '12' },
        ],
        steps: [
          'Multiply thickness in inches by width in inches.',
          'Multiply by length in feet.',
          'Divide by 12 to convert the mixed units into board feet.',
        ],
        note: 'Board feet measure lumber volume. Nominal vs actual dimensions, grade, species, moisture, and seller rules can differ.',
      };
    }
    case 'cubic-yard': {
      const result = calculateCubicYardEstimate(parseNumber(inputs.lengthFeet, 'Length'), parseNumber(inputs.widthFeet, 'Width'), parseNumber(inputs.depthInches, 'Depth'), parseNumber(inputs.wastePercent, 'Waste percent'));
      return {
        label: 'Cubic yards',
        expression: `${formatCalculatorNumber(result.lengthFeet)} ft x ${formatCalculatorNumber(result.widthFeet)} ft x ${formatCalculatorNumber(result.depthInches)} in`,
        answer: `${formatCalculatorNumber(result.cubicYards)} yd3`,
        metrics: [
          { label: 'Cubic feet', value: formatCalculatorNumber(result.cubicFeet) },
          { label: 'Waste added', value: percent(result.wastePercent) },
          { label: 'Cubic feet per yard', value: '27' },
        ],
        steps: [
          'Convert depth from inches to feet.',
          'Multiply length, width, and depth for cubic feet.',
          'Add waste and divide by 27 to convert cubic feet to cubic yards.',
        ],
      };
    }
    case 'pool-volume': {
      const result = calculatePoolVolume((inputs.shape || 'rectangle') as 'rectangle' | 'round' | 'oval', parseNumber(inputs.lengthFeet, 'Length or diameter'), parseNumber(inputs.widthFeet, 'Width or diameter'), parseNumber(inputs.averageDepthFeet, 'Average depth'));
      return {
        label: 'Pool volume',
        expression: `${unitLabel(result.shape)} pool, ${formatCalculatorNumber(result.lengthFeet)} ft x ${formatCalculatorNumber(result.widthFeet)} ft x ${formatCalculatorNumber(result.averageDepthFeet)} ft average depth`,
        answer: `${formatCalculatorNumber(result.gallons)} gallons`,
        metrics: [
          { label: 'Cubic feet', value: formatCalculatorNumber(result.cubicFeet) },
          { label: 'Shape factor', value: formatCalculatorNumber(result.surfaceFactor) },
          { label: 'Gallons per cubic foot', value: '7.48052' },
        ],
        steps: [
          'Find surface area from the selected shape.',
          'Multiply by average depth for cubic feet.',
          'Multiply cubic feet by 7.48052 to estimate U.S. gallons.',
        ],
        note: 'Sloped bottoms, steps, benches, freeform curves, and actual water line can change real pool volume.',
      };
    }
    case 'sand': {
      const result = calculateSandEstimate({
        lengthFeet: parseNumber(inputs.lengthFeet, 'Length'),
        widthFeet: parseNumber(inputs.widthFeet, 'Width'),
        depthInches: parseNumber(inputs.depthInches, 'Depth'),
        tonsPerCubicYard: parseNumber(inputs.tonsPerCubicYard, 'Tons per cubic yard'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
      });
      return {
        label: 'Sand needed',
        expression: `${formatCalculatorNumber(result.lengthFeet)} ft x ${formatCalculatorNumber(result.widthFeet)} ft x ${formatCalculatorNumber(result.depthInches)} in`,
        answer: `${formatCalculatorNumber(result.cubicYards)} yd3`,
        metrics: [
          { label: 'Cubic feet', value: formatCalculatorNumber(result.cubicFeet) },
          { label: 'Estimated tons', value: formatCalculatorNumber(result.tons) },
          { label: 'Density used', value: `${formatCalculatorNumber(result.tonsPerCubicYard)} tons/yd3` },
        ],
        steps: [
          'Convert depth from inches to feet.',
          'Multiply length, width, and depth, then add waste.',
          'Divide by 27 for cubic yards and multiply by density for tons.',
        ],
        note: 'Sand density changes with moisture, compaction, and material type. Ask your supplier for a project-specific value.',
      };
    }
    case 'soil': {
      const result = calculateSoilEstimate(parseNumber(inputs.areaSquareFeet, 'Area'), parseNumber(inputs.depthInches, 'Depth'), parseNumber(inputs.wastePercent, 'Waste percent'));
      return {
        label: 'Soil needed',
        expression: `${formatCalculatorNumber(result.areaSquareFeet)} ft2 at ${formatCalculatorNumber(result.depthInches)} in`,
        answer: `${formatCalculatorNumber(result.cubicYards)} yd3`,
        metrics: [
          { label: 'Cubic feet', value: formatCalculatorNumber(result.cubicFeet) },
          { label: '1.5 ft3 bags', value: formatCalculatorNumber(result.oneAndHalfCubicFootBags) },
          { label: '2 ft3 bags', value: formatCalculatorNumber(result.twoCubicFootBags) },
        ],
        steps: [
          'Convert soil depth from inches to feet.',
          'Multiply bed area by depth and add extra percent.',
          'Convert to cubic yards and common bag counts.',
        ],
        note: 'Soil settles. Raised beds, existing soil, compost mix, moisture, and bag fill can change the amount needed.',
      };
    }
    case 'asphalt': {
      const result = calculateAsphaltEstimate({
        lengthFeet: parseNumber(inputs.lengthFeet, 'Length'),
        widthFeet: parseNumber(inputs.widthFeet, 'Width'),
        depthInches: parseNumber(inputs.depthInches, 'Depth'),
        tonsPerCubicYard: parseNumber(inputs.tonsPerCubicYard, 'Tons per cubic yard'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
      });
      return {
        label: 'Asphalt needed',
        expression: `${formatCalculatorNumber(result.lengthFeet)} ft x ${formatCalculatorNumber(result.widthFeet)} ft x ${formatCalculatorNumber(result.depthInches)} in compacted depth`,
        answer: `${formatCalculatorNumber(result.tons)} tons`,
        metrics: [
          { label: 'Cubic yards', value: formatCalculatorNumber(result.cubicYards) },
          { label: 'Cubic feet', value: formatCalculatorNumber(result.cubicFeet) },
          { label: 'Density used', value: `${formatCalculatorNumber(result.tonsPerCubicYard)} tons/yd3` },
        ],
        steps: [
          'Convert compacted depth from inches to feet.',
          'Multiply length, width, and depth, then add waste.',
          'Convert cubic feet to cubic yards and multiply by tons per cubic yard.',
        ],
        note: 'Asphalt mix, compaction target, base, lift thickness, plant minimums, and paving specifications matter for real jobs.',
      };
    }
    case 'wind-chill': {
      const result = calculateWindChill(parseNumber(inputs.temperatureFahrenheit, 'Temperature'), parseNumber(inputs.windSpeedMph, 'Wind speed'));
      return {
        label: 'Wind chill',
        expression: `${formatCalculatorNumber(result.temperatureFahrenheit)} F, ${formatCalculatorNumber(result.windSpeedMph ?? 0)} mph`,
        answer: `${formatCalculatorNumber(result.resultFahrenheit)} F`,
        metrics: [
          { label: 'Celsius', value: `${formatCalculatorNumber(result.resultCelsius)} C` },
          { label: 'Air temperature', value: `${formatCalculatorNumber(result.temperatureFahrenheit)} F` },
          { label: 'Wind speed', value: `${formatCalculatorNumber(result.windSpeedMph ?? 0)} mph` },
        ],
        steps: [
          'Use the National Weather Service wind chill equation.',
          'Raise wind speed to the 0.16 power.',
          'Combine temperature and wind terms to estimate exposed-skin heat loss.',
        ],
        note: 'The NWS formula is intended for cold temperatures with meaningful wind. Follow local weather alerts for frostbite risk.',
      };
    }
    case 'heat-index': {
      const result = calculateHeatIndex(parseNumber(inputs.temperatureFahrenheit, 'Temperature'), parseNumber(inputs.relativeHumidity, 'Relative humidity'));
      return {
        label: 'Heat index',
        expression: `${formatCalculatorNumber(result.temperatureFahrenheit)} F, ${formatCalculatorNumber(result.relativeHumidity ?? 0)}% RH`,
        answer: `${formatCalculatorNumber(result.resultFahrenheit)} F`,
        metrics: [
          { label: 'Celsius', value: `${formatCalculatorNumber(result.resultCelsius)} C` },
          { label: 'Air temperature', value: `${formatCalculatorNumber(result.temperatureFahrenheit)} F` },
          { label: 'Humidity', value: percent(result.relativeHumidity ?? 0) },
        ],
        steps: [
          'Compute the simple NWS heat index branch first.',
          'Use the Rothfusz regression and humidity adjustments when the preliminary value reaches about 80 F.',
          'Report the apparent temperature in Fahrenheit and Celsius.',
        ],
        note: 'Heat illness risk depends on sun, exertion, hydration, wind, and health. Follow local heat advisories.',
      };
    }
    case 'dew-point': {
      const result = calculateDewPoint(parseNumber(inputs.temperatureFahrenheit, 'Temperature'), parseNumber(inputs.relativeHumidity, 'Relative humidity'));
      return {
        label: 'Dew point',
        expression: `${formatCalculatorNumber(result.temperatureFahrenheit)} F, ${formatCalculatorNumber(result.relativeHumidity ?? 0)}% RH`,
        answer: `${formatCalculatorNumber(result.resultFahrenheit)} F`,
        metrics: [
          { label: 'Celsius', value: `${formatCalculatorNumber(result.resultCelsius)} C` },
          { label: 'Air temperature', value: `${formatCalculatorNumber(result.temperatureFahrenheit)} F` },
          { label: 'Humidity', value: percent(result.relativeHumidity ?? 0) },
        ],
        steps: [
          'Convert Fahrenheit to Celsius.',
          'Use the Magnus approximation with temperature and relative humidity.',
          'Convert the dew point back to Fahrenheit for display.',
        ],
      };
    }
    case 'bandwidth': {
      const result = calculateBandwidthTime(parseNumber(inputs.dataAmount, 'Data amount'), inputs.dataUnit, parseNumber(inputs.speedAmount, 'Speed'), inputs.speedUnit);
      return {
        label: 'Estimated transfer time',
        expression: `${formatCalculatorNumber(result.dataAmount)} ${result.dataUnit} at ${formatCalculatorNumber(result.speedAmount)} ${result.speedUnit}`,
        answer: durationText(result.seconds),
        metrics: [
          { label: 'Seconds', value: formatCalculatorNumber(result.seconds) },
          { label: 'Minutes', value: formatCalculatorNumber(result.minutes) },
          { label: 'Hours', value: formatCalculatorNumber(result.hours) },
        ],
        steps: [
          'Convert the data amount to bits using decimal network units.',
          'Convert bandwidth to bits per second.',
          'Divide total bits by bits per second to estimate transfer time.',
        ],
        note: 'Real downloads also depend on Wi-Fi, congestion, server speed, protocol overhead, and device limits.',
      };
    }
    case 'gdp': {
      const result = calculateGdpEstimate(
        parseNumber(inputs.consumption, 'Personal consumption'),
        parseNumber(inputs.investment, 'Private investment'),
        parseNumber(inputs.governmentSpending, 'Government spending'),
        parseNumber(inputs.exports, 'Exports'),
        parseNumber(inputs.imports, 'Imports'),
        parseOptionalNumber(inputs.population, 'Population'),
      );
      return {
        label: 'Estimated GDP',
        expression: 'C + I + G + (X - M)',
        answer: money(result.gdp),
        metrics: [
          { label: 'Net exports', value: money(result.netExports) },
          { label: 'GDP per person', value: result.gdpPerPerson === null ? 'Add population' : money(result.gdpPerPerson) },
          { label: 'Imports subtracted', value: money(result.imports) },
        ],
        steps: [
          'Add personal consumption, private investment, and government spending.',
          'Subtract imports from exports to find net exports.',
          'Add net exports to the other spending categories.',
        ],
        note: 'Use one scale throughout. If money values are in billions, enter population in billions too, such as 0.34 for 340 million people.',
      };
    }
    case 'horsepower': {
      const result = calculateHorsepowerConversion(parseNumber(inputs.power, 'Power'), inputs.unit as HorsepowerUnit);
      return {
        label: 'Mechanical horsepower',
        expression: `${formatCalculatorNumber(result.inputPower)} ${unitLabel(result.inputUnit)}`,
        answer: `${formatCalculatorNumber(result.mechanicalHorsepower)} hp`,
        metrics: [
          { label: 'Watts', value: `${formatCalculatorNumber(result.watts)} W` },
          { label: 'Kilowatts', value: `${formatCalculatorNumber(result.kilowatts)} kW` },
          { label: 'Metric horsepower', value: `${formatCalculatorNumber(result.metricHorsepower)} PS` },
        ],
        steps: [
          'Convert the starting unit to watts.',
          'Divide watts by 745.6999 for mechanical horsepower.',
          'Divide watts by 735.4988 for metric horsepower.',
        ],
        note: 'Mechanical horsepower, metric horsepower, electric horsepower, and boiler horsepower are different units. This tool reports common mechanical and metric values.',
      };
    }
    case 'engine-horsepower': {
      const result = calculateEngineHorsepower(
        parseNumber(inputs.torquePoundFeet, 'Torque'),
        parseNumber(inputs.rpm, 'RPM'),
        parseOptionalNumber(inputs.drivetrainLossPercent, 'Drivetrain loss') ?? 0,
      );
      return {
        label: 'Estimated engine horsepower',
        expression: `${formatCalculatorNumber(result.torquePoundFeet)} lb-ft x ${formatCalculatorNumber(result.rpm)} rpm / 5252`,
        answer: `${formatCalculatorNumber(result.engineHorsepower)} hp`,
        metrics: [
          { label: 'Kilowatts', value: `${formatCalculatorNumber(result.kilowatts)} kW` },
          { label: 'Wheel horsepower estimate', value: `${formatCalculatorNumber(result.wheelHorsepower)} whp` },
          { label: 'Loss used', value: percent(result.drivetrainLossPercent) },
        ],
        steps: [
          'Multiply torque in pound-feet by engine speed in RPM.',
          'Divide by the unit conversion constant 5252.1131.',
          'Apply optional drivetrain loss only to the wheel horsepower estimate.',
        ],
        note: 'Dyno standards, correction factors, drivetrain loss, and engine conditions can change measured horsepower.',
      };
    }
    case 'golf-handicap': {
      if (modeId === 'course-handicap') {
        const result = calculateGolfCourseHandicap(
          parseNumber(inputs.handicapIndex, 'Handicap index'),
          parseNumber(inputs.slopeRating, 'Slope rating'),
          parseNumber(inputs.courseRating, 'Course rating'),
          parseNumber(inputs.par, 'Par'),
          parseNumber(inputs.allowancePercent, 'Allowance'),
        );
        return {
          label: 'Course handicap estimate',
          expression: `${formatCalculatorNumber(result.handicapIndex)} x (${formatCalculatorNumber(result.slopeRating)} / 113) + (${formatCalculatorNumber(result.courseRating)} - ${formatCalculatorNumber(result.par)})`,
          answer: formatCalculatorNumber(result.courseHandicap),
          metrics: [
            { label: 'Raw course handicap', value: formatCalculatorNumber(result.rawCourseHandicap) },
            { label: 'Playing handicap', value: formatCalculatorNumber(result.playingHandicap) },
            { label: 'Allowance', value: percent(result.allowancePercent) },
          ],
          steps: [
            'Scale Handicap Index by slope rating over the standard 113 slope.',
            'Adjust for course rating compared with par.',
            'Round to a whole course handicap and then apply the allowance for playing handicap.',
          ],
          note: 'This is an estimate. Official scores can include WHS adjustments and must come from your golf association or official scoring record.',
        };
      }

      const result = calculateGolfScoreDifferential(
        parseNumber(inputs.adjustedGrossScore, 'Adjusted gross score'),
        parseNumber(inputs.courseRating, 'Course rating'),
        parseNumber(inputs.slopeRating, 'Slope rating'),
        parseNumber(inputs.playingConditionsAdjustment, 'PCC adjustment'),
      );
      return {
        label: 'Score differential estimate',
        expression: `(113 / ${formatCalculatorNumber(result.slopeRating)}) x (${formatCalculatorNumber(result.adjustedGrossScore)} - ${formatCalculatorNumber(result.courseRating)} - ${formatCalculatorNumber(result.playingConditionsAdjustment)})`,
        answer: formatCalculatorNumber(result.scoreDifferential),
        metrics: [
          { label: 'Raw differential', value: formatCalculatorNumber(result.rawDifferential) },
          { label: 'Slope rating', value: formatCalculatorNumber(result.slopeRating) },
          { label: 'PCC adjustment', value: formatCalculatorNumber(result.playingConditionsAdjustment) },
        ],
        steps: [
          'Subtract course rating and PCC from adjusted gross score.',
          'Multiply by 113 divided by slope rating.',
          'Round the score differential to one decimal place.',
        ],
        note: 'An official Handicap Index can include caps, exceptional-score reductions, 9-hole rules, and committee adjustments.',
      };
    }
    case 'love': {
      const result = calculateLoveCompatibility(inputs.nameA ?? '', inputs.nameB ?? '');
      return {
        label: 'Playful match score',
        expression: `${inputs.nameA ?? ''} + ${inputs.nameB ?? ''}`,
        answer: `${formatCalculatorNumber(result.score)}%`,
        metrics: [
          { label: 'Game label', value: result.label },
          { label: 'First name key', value: result.normalizedA },
          { label: 'Second name key', value: result.normalizedB },
        ],
        steps: [
          'Clean the two names into simple letters and numbers.',
          'Use a deterministic local hash so the same pair gets the same playful score.',
          'Show the result as entertainment only, not a real compatibility reading.',
        ],
        note: 'This is a light browser game. It cannot measure feelings, trust, communication, or relationship health.',
      };
    }
    case 'word-counter': {
      const result = analyzeText(inputs.text ?? '');
      return {
        label: 'Word count',
        expression: result.words === 1 ? '1 word entered' : `${formatCalculatorNumber(result.words)} words entered`,
        answer: formatCalculatorNumber(result.words),
        metrics: [
          { label: 'Characters', value: formatCalculatorNumber(result.characters) },
          { label: 'Sentences', value: formatCalculatorNumber(result.sentences) },
          { label: 'Reading time', value: `${formatCalculatorNumber(result.estimatedReadingMinutes)} min` },
        ],
        steps: [
          'Split the text into word-like groups of letters and numbers.',
          'Count sentences, paragraphs, lines, characters, and UTF-8 bytes separately.',
          'Estimate reading time at about 200 words per minute.',
        ],
        note: 'Different editors can count hyphenated words, emojis, and punctuation differently. Use the target platform count when a hard limit matters.',
      };
    }
    case 'character-counter': {
      const result = analyzeText(inputs.text ?? '');
      return {
        label: 'Character count',
        expression: `${formatCalculatorNumber(result.words)} words, ${formatCalculatorNumber(result.lines)} lines`,
        answer: formatCalculatorNumber(result.characters),
        metrics: [
          { label: 'Without spaces', value: formatCalculatorNumber(result.charactersNoSpaces) },
          { label: 'UTF-8 bytes', value: formatCalculatorNumber(result.bytesUtf8) },
          { label: 'Lines', value: formatCalculatorNumber(result.lines) },
        ],
        steps: [
          'Count visible Unicode characters in the text.',
          'Count a second value after removing whitespace characters.',
          'Encode the text as UTF-8 to estimate byte length for technical limits.',
        ],
        note: 'Some platforms count emoji sequences, line breaks, and rich text differently. Use this as a fast drafting check.',
      };
    }
    case 'text-case-converter': {
      const result = convertTextCase(inputs.text ?? '', (inputs.mode || 'title') as TextCaseMode);
      return {
        label: `${unitLabel(result.mode)} output`,
        expression: `${formatCalculatorNumber(analyzeText(result.input).characters)} input characters`,
        answer: result.output,
        metrics: [
          { label: 'Output characters', value: formatCalculatorNumber(analyzeText(result.output).characters) },
          { label: 'Mode', value: unitLabel(result.mode) },
          { label: 'Changed positions', value: formatCalculatorNumber(result.changedCharacters) },
        ],
        steps: [
          'Read the text as plain text.',
          'Apply the selected case style.',
          'Return copy-ready output without sending the text to a server.',
        ],
        textOutput: true,
      };
    }
    case 'slug-generator': {
      const result = generateSlug(inputs.text ?? '', parseOptionalNumber(inputs.maxLength ?? '', 'Maximum length'));
      return {
        label: 'Generated slug',
        expression: `${formatCalculatorNumber(result.wordCount)} words`,
        answer: result.slug,
        metrics: [
          { label: 'Characters', value: formatCalculatorNumber(result.characterCount) },
          { label: 'Max length', value: result.maxLength === null ? 'No limit' : formatCalculatorNumber(result.maxLength) },
          { label: 'Separator', value: 'Hyphen' },
        ],
        steps: [
          'Normalize accented letters where possible.',
          'Keep letters and numbers, then convert spaces and punctuation to hyphens.',
          'Trim repeated hyphens and apply the optional maximum length.',
        ],
        note: 'Keep one canonical URL for one search intent. Do not create several thin pages with only slightly different slugs.',
        textOutput: true,
      };
    }
    case 'json-formatter': {
      const result = formatJsonText(inputs.json ?? '', booleanInput(inputs.sortKeys));
      return {
        label: 'Formatted JSON',
        expression: `${result.rootType} root, ${formatCalculatorNumber(result.keyCount)} keys`,
        answer: result.output,
        metrics: [
          { label: 'Root type', value: result.rootType },
          { label: 'Keys', value: formatCalculatorNumber(result.keyCount) },
          { label: 'UTF-8 bytes', value: formatCalculatorNumber(result.byteLength) },
        ],
        steps: [
          'Parse the text with JSON.parse.',
          booleanInput(inputs.sortKeys) ? 'Sort object keys recursively before output.' : 'Keep object key order from the input.',
          'Stringify the result with two-space indentation.',
        ],
        note: 'Formatting does not validate a business schema. It only checks whether the text is valid JSON.',
        textOutput: true,
      };
    }
    case 'uuid-generator': {
      const result = generateUuidBatch(parseNumber(inputs.quantity, 'Quantity'), booleanInput(inputs.uppercase), booleanInput(inputs.hyphens));
      return {
        label: 'UUID v4 values',
        expression: `${formatCalculatorNumber(result.quantity)} random UUID${result.quantity === 1 ? '' : 's'}`,
        answer: result.uuids.join('\n'),
        metrics: [
          { label: 'Quantity', value: formatCalculatorNumber(result.quantity) },
          { label: 'Case', value: result.uppercase ? 'Uppercase' : 'Lowercase' },
          { label: 'Hyphens', value: result.hyphens ? 'Included' : 'Removed' },
        ],
        steps: [
          'Generate random bytes in the browser.',
          'Set the UUID version and variant bits for UUID v4.',
          'Format the identifier with your case and hyphen options.',
        ],
        keepOutOfHistory: true,
        textOutput: true,
      };
    }
    case 'hash-generator': {
      return digestText(inputs.text ?? '', (inputs.algorithm || 'SHA-256') as HashAlgorithm).then((result) => ({
        label: `${result.algorithm} digest`,
        expression: `${formatCalculatorNumber(result.bytesUtf8)} UTF-8 input bytes`,
        answer: result.hexDigest,
        metrics: [
          { label: 'Algorithm', value: result.algorithm },
          { label: 'Input bytes', value: formatCalculatorNumber(result.bytesUtf8) },
          { label: 'Digest bytes', value: formatCalculatorNumber(result.digestBytes) },
        ],
        steps: [
          'Encode the text as UTF-8 bytes.',
          `Pass the bytes to browser SubtleCrypto using ${result.algorithm}.`,
          'Convert the digest bytes into lowercase hexadecimal text.',
        ],
        note: 'A hash is one-way digest text, not encryption. Do not use raw hashes as a password storage design.',
        textOutput: true,
      }));
    }
    case 'unix-timestamp-converter': {
      if (modeId === 'timestamp-to-date') {
        const result = calculateDateFromUnixTimestamp(parseNumber(inputs.timestamp, 'Timestamp'), (inputs.unit || 'seconds') as 'seconds' | 'milliseconds');
        return {
          label: 'UTC date and time',
          expression: `${formatCalculatorNumber(result.timestamp)} ${result.unit}`,
          answer: result.utcIso,
          metrics: [
            { label: 'UTC date', value: result.utcDate },
            { label: 'UTC time', value: result.utcTime },
            { label: 'Unit', value: result.unit },
          ],
          steps: [
            result.unit === 'seconds' ? 'Multiply seconds by 1,000 to get milliseconds.' : 'Read the timestamp directly as milliseconds.',
            'Create a JavaScript Date from the millisecond value.',
            'Display the result as an ISO UTC timestamp.',
          ],
        };
      }

      const result = calculateUnixTimestampFromDate(inputs.date, inputs.time);
      return {
        label: 'Unix timestamp',
        expression: `${inputs.date} ${inputs.time} UTC`,
        answer: formatCalculatorNumber(result.seconds),
        metrics: [
          { label: 'Milliseconds', value: formatCalculatorNumber(result.milliseconds) },
          { label: 'UTC ISO', value: result.utcIso },
          { label: 'Time zone', value: 'UTC' },
        ],
        steps: [
          'Read the entered date and time as UTC.',
          'Convert the UTC date-time to milliseconds since 1970-01-01T00:00:00Z.',
          'Divide milliseconds by 1,000 for Unix seconds.',
        ],
      };
    }
    case 'color-contrast-checker': {
      const result = calculateColorContrast(inputs.foreground, inputs.background);
      return {
        label: 'Contrast ratio',
        expression: `${result.foreground} on ${result.background}`,
        answer: `${formatCalculatorNumber(result.contrastRatio)}:1`,
        metrics: [
          { label: 'AA normal text', value: result.passesAaNormal ? 'Pass' : 'Fail' },
          { label: 'AA large text', value: result.passesAaLarge ? 'Pass' : 'Fail' },
          { label: 'AAA normal text', value: result.passesAaaNormal ? 'Pass' : 'Fail' },
        ],
        steps: [
          'Convert each hex color to sRGB channel values.',
          'Calculate relative luminance for foreground and background.',
          'Use the WCAG contrast formula: (lighter + 0.05) / (darker + 0.05).',
        ],
        note: 'WCAG AA uses 4.5:1 for normal text and 3:1 for large text. Also check focus, hover, disabled, and icon states.',
      };
    }
    case 'aspect-ratio-calculator': {
      const result = calculateAspectRatio(
        parseNumber(inputs.width, 'Width'),
        parseNumber(inputs.height, 'Height'),
        modeId === 'scale-width' ? parseNumber(inputs.targetWidth, 'New width') : undefined,
        modeId === 'scale-height' ? parseNumber(inputs.targetHeight, 'New height') : undefined,
      );
      return {
        label: modeId === 'ratio' ? 'Simplified aspect ratio' : 'Scaled size',
        expression: `${formatCalculatorNumber(result.width)} x ${formatCalculatorNumber(result.height)}`,
        answer:
          modeId === 'ratio'
            ? result.ratioLabel
            : `${formatCalculatorNumber(result.scaledWidth ?? result.width)} x ${formatCalculatorNumber(result.scaledHeight ?? result.height)}`,
        metrics: [
          { label: 'Ratio', value: result.ratioLabel },
          { label: 'Decimal', value: formatCalculatorNumber(result.decimal) },
          { label: 'Orientation', value: result.width === result.height ? 'Square' : result.width > result.height ? 'Landscape' : 'Portrait' },
        ],
        steps: [
          'Divide width and height by their greatest common divisor to simplify the ratio.',
          modeId === 'scale-width' ? 'Use the original ratio to calculate the new height from the new width.' : modeId === 'scale-height' ? 'Use the original ratio to calculate the new width from the new height.' : 'Report the simplified width-to-height relationship.',
          'Round the displayed scaled dimensions for readability.',
        ],
      };
    }
    case 'utm-builder': {
      const result = buildUtmUrl({
        baseUrl: inputs.baseUrl ?? '',
        source: inputs.source ?? '',
        medium: inputs.medium ?? '',
        campaign: inputs.campaign ?? '',
        content: inputs.content ?? '',
        term: inputs.term ?? '',
      });
      return {
        label: 'Campaign URL',
        expression: result.campaignLabel,
        answer: result.outputUrl,
        metrics: [
          { label: 'UTM parameters', value: formatCalculatorNumber(result.parameterCount) },
          { label: 'Existing parameters', value: formatCalculatorNumber(result.existingParameterCount) },
          { label: 'Base URL', value: result.baseUrl },
        ],
        steps: [
          'Read the base URL and keep any existing query parameters.',
          'Add source, medium, and campaign as the core UTM fields.',
          'Add optional content or term fields when they help distinguish links.',
        ],
        note: 'Use a consistent naming convention. Analytics reports are easier to read when source, medium, and campaign names stay predictable.',
        textOutput: true,
      };
    }
    case 'query-string-parser': {
      const result = modeId === 'build' ? buildQueryStringFromLines(inputs.input ?? '') : parseQueryStringInput(inputs.input ?? '');
      return {
        label: modeId === 'build' ? 'Built query string' : 'Parsed query parameters',
        expression: `${formatCalculatorNumber(result.parameterCount)} parameter${result.parameterCount === 1 ? '' : 's'}`,
        answer: result.output,
        metrics: [
          { label: 'Parameters', value: formatCalculatorNumber(result.parameterCount) },
          { label: 'Duplicate keys', value: formatCalculatorNumber(result.duplicateKeyCount) },
          { label: 'Output type', value: modeId === 'build' ? 'Encoded query' : 'JSON object' },
        ],
        steps: [
          modeId === 'build' ? 'Read each key=value line.' : 'Extract the query part from a URL or raw query string.',
          modeId === 'build' ? 'Append each pair with URLSearchParams.' : 'Decode each parameter with URLSearchParams.',
          modeId === 'build' ? 'Return a copy-ready encoded query string.' : 'Group repeated keys so duplicate values stay visible.',
        ],
        note: 'URL query strings are useful for filters, tracking, and app state, but private tokens should not be shared in public URLs.',
        textOutput: true,
      };
    }
    case 'html-entity-encoder-decoder': {
      const mode = (inputs.mode || 'encode') as HtmlEntityMode;
      const result = mode === 'decode' ? decodeHtmlEntities(inputs.text ?? '') : encodeHtmlEntities(inputs.text ?? '');
      return {
        label: mode === 'decode' ? 'Decoded text' : 'Encoded entities',
        expression: `${formatCalculatorNumber(result.entityCount)} ${result.entityCount === 1 ? 'entity' : 'entities'} changed`,
        answer: result.output,
        metrics: [
          { label: 'Mode', value: unitLabel(result.mode) },
          { label: 'Input characters', value: formatCalculatorNumber(analyzeText(result.input).characters) },
          { label: 'Changed positions', value: formatCalculatorNumber(result.changedCharacters) },
        ],
        steps: [
          mode === 'decode' ? 'Find named and numeric HTML entities.' : 'Find characters that need escaping in HTML text.',
          mode === 'decode' ? 'Convert supported entities back to readable characters.' : 'Replace &, <, >, quotes, and apostrophes with entity text.',
          'Return copy-ready text without sending the snippet to a server.',
        ],
        note: 'Entity encoding helps display code examples as text. It is not a complete sanitizer for untrusted HTML.',
        textOutput: true,
      };
    }
    case 'css-clamp-calculator': {
      const result = calculateCssClamp(
        parseNumber(inputs.minSize, 'Minimum size'),
        parseNumber(inputs.maxSize, 'Maximum size'),
        parseNumber(inputs.minViewport, 'Minimum viewport'),
        parseNumber(inputs.maxViewport, 'Maximum viewport'),
        parseNumber(inputs.rootFontSize, 'Root font size'),
      );
      return {
        label: 'CSS clamp formula',
        expression: `${formatCalculatorNumber(result.minSizePx)}px to ${formatCalculatorNumber(result.maxSizePx)}px from ${formatCalculatorNumber(result.minViewportPx)}px-${formatCalculatorNumber(result.maxViewportPx)}px viewport`,
        answer: result.css,
        metrics: [
          { label: 'Slope', value: `${formatCalculatorNumber(result.slopeVw)}vw` },
          { label: 'Intercept', value: `${formatCalculatorNumber(result.interceptPx)}px` },
          { label: 'Middle size', value: `${formatCalculatorNumber(result.middleSizePx)}px` },
        ],
        steps: [
          'Find how much the size should grow across the viewport range.',
          'Convert that growth into a vw slope and rem intercept.',
          'Wrap the result in CSS clamp(min, preferred, max).',
        ],
        note: 'Clamp is useful for fluid type and spacing, but still test real text wrapping and tap targets on small screens.',
        textOutput: true,
      };
    }
    case 'ai-token-cost-calculator': {
      const result = calculateAiTokenCost(
        parseNumber(inputs.inputTokensPerRequest, 'Input tokens per request'),
        parseNumber(inputs.outputTokensPerRequest, 'Output tokens per request'),
        parseNumber(inputs.requests, 'Requests'),
        parseNumber(inputs.inputPricePerMillion, 'Input price per million tokens'),
        parseNumber(inputs.outputPricePerMillion, 'Output price per million tokens'),
      );
      return {
        label: 'Estimated AI token cost',
        expression: `${formatCalculatorNumber(result.requests)} requests`,
        answer: moneyPrecise(result.totalCost),
        metrics: [
          { label: 'Input token cost', value: moneyPrecise(result.inputCost) },
          { label: 'Output token cost', value: moneyPrecise(result.outputCost) },
          { label: 'Cost per request', value: moneyPrecise(result.costPerRequest) },
        ],
        steps: [
          'Multiply input and output tokens by request count.',
          'Divide each token total by 1,000,000.',
          'Multiply each side by the matching price per 1 million tokens, then add them.',
        ],
        note: 'Model pricing changes. Use the current rate card from your provider before budgeting real usage.',
      };
    }
    case 'prompt-token-estimator': {
      const result = estimatePromptTokens(inputs.text ?? '', parseNumber(inputs.averageCharactersPerToken, 'Average characters per token'));
      return {
        label: 'Estimated prompt tokens',
        expression: `${formatCalculatorNumber(result.characters)} characters at about ${formatCalculatorNumber(result.averageCharactersPerToken)} chars/token`,
        answer: formatCalculatorNumber(result.estimatedTokens),
        metrics: [
          { label: 'Low estimate', value: formatCalculatorNumber(result.lowEstimate) },
          { label: 'High estimate', value: formatCalculatorNumber(result.highEstimate) },
          { label: 'Words', value: formatCalculatorNumber(result.words) },
        ],
        steps: [
          'Count characters in the pasted prompt.',
          'Divide by the chosen average characters per token.',
          'Show a rough low/high range because real model tokenizers split text differently.',
        ],
        note: 'Use your provider tokenizer for exact billing, especially with code, symbols, non-English text, or long prompts.',
      };
    }
    case 'api-pricing-calculator': {
      const result = calculateApiPricing(
        parseNumber(inputs.requests, 'Requests'),
        parseNumber(inputs.unitsPerRequest, 'Units per request'),
        parseNumber(inputs.pricePerUnit, 'Price per unit'),
        parseOptionalNumber(inputs.platformFee, 'Platform fee') ?? 0,
        parseNumber(inputs.retryPercent, 'Retry or overhead percent'),
      );
      return {
        label: 'Estimated API cost',
        expression: `${formatCalculatorNumber(result.requests)} requests x ${formatCalculatorNumber(result.unitsPerRequest)} units`,
        answer: moneyPrecise(result.totalCost),
        metrics: [
          { label: 'Billable units', value: formatCalculatorNumber(result.billableUnits) },
          { label: 'Usage cost', value: moneyPrecise(result.usageCost) },
          { label: 'Average per request', value: moneyPrecise(result.averageCostPerRequest) },
        ],
        steps: [
          'Multiply requests by billable units per request.',
          'Add the retry or overhead percentage to estimate extra billable work.',
          'Multiply by price per unit and add any fixed fee.',
        ],
        note: 'This is provider-neutral math. It does not know free tiers, taxes, credits, rate limits, or plan-specific billing rules.',
      };
    }
    case 'download-time-calculator': {
      const result = calculateDownloadTime(
        parseNumber(inputs.fileSize, 'File size'),
        inputs.fileUnit,
        parseNumber(inputs.speedMbps, 'Speed Mbps'),
        parseNumber(inputs.efficiencyPercent, 'Efficiency percent'),
      );
      return {
        label: 'Estimated download time',
        expression: `${formatCalculatorNumber(result.fileSize)} ${result.fileUnit} at ${formatCalculatorNumber(result.speedMbps)} Mbps`,
        answer: durationText(result.seconds),
        metrics: [
          { label: 'Effective speed', value: `${formatCalculatorNumber(result.effectiveMbps)} Mbps` },
          { label: 'Minutes', value: formatCalculatorNumber(result.minutes) },
          { label: 'Hours', value: formatCalculatorNumber(result.hours) },
        ],
        steps: [
          'Convert file size to bytes, then to bits.',
          'Apply the efficiency percentage to the listed connection speed.',
          'Divide bits by effective bits per second.',
        ],
        note: 'Real downloads can be slower because of Wi-Fi quality, server limits, congestion, VPNs, and background traffic.',
      };
    }
    case 'internet-speed-needs-calculator': {
      const result = calculateInternetSpeedNeeds(
        parseNumber(inputs.videoStreams, 'Video streams'),
        parseNumber(inputs.videoMbpsEach, 'Mbps per video stream'),
        parseNumber(inputs.gamingDevices, 'Gaming devices'),
        parseNumber(inputs.gamingMbpsEach, 'Mbps per gaming device'),
        parseNumber(inputs.videoCalls, 'Video calls'),
        parseNumber(inputs.callMbpsEach, 'Mbps per video call'),
        parseNumber(inputs.smartDevices, 'Smart devices'),
        parseNumber(inputs.smartDeviceMbpsEach, 'Mbps per smart device'),
        parseNumber(inputs.bufferPercent, 'Buffer percent'),
      );
      return {
        label: 'Recommended download speed',
        expression: `${formatCalculatorNumber(result.baseMbps)} Mbps base + ${percent(result.bufferPercent)} buffer`,
        answer: `${formatCalculatorNumber(result.recommendedMbps)} Mbps`,
        metrics: [
          { label: 'Base activity need', value: `${formatCalculatorNumber(result.baseMbps)} Mbps` },
          { label: 'Video stream load', value: `${formatCalculatorNumber(result.videoStreams * result.videoMbpsEach)} Mbps` },
          { label: 'Calls and gaming load', value: `${formatCalculatorNumber(result.videoCalls * result.callMbpsEach + result.gamingDevices * result.gamingMbpsEach)} Mbps` },
        ],
        steps: [
          'Multiply each activity count by its Mbps estimate.',
          'Add video, gaming, calls, and smart-device background use.',
          'Add a buffer so the plan is not running at 100% all the time.',
        ],
        note: 'Internet plan speed is not the same as Wi-Fi quality or latency. Gaming and video calls can feel bad even when Mbps looks high enough.',
      };
    }
    case 'streaming-bitrate-calculator': {
      const result = calculateStreamingBitrate(
        parseNumber(inputs.bitrate, 'Bitrate'),
        inputs.bitrateUnit,
        parseNumber(inputs.hours, 'Hours'),
        parseNumber(inputs.minutes, 'Minutes'),
        parseNumber(inputs.streams, 'Streams'),
      );
      return {
        label: 'Estimated streaming data',
        expression: `${formatCalculatorNumber(result.bitrate)} ${result.bitrateUnit} for ${durationText(result.totalSeconds / result.streams)}`,
        answer: `${formatCalculatorNumber(result.gigabytes)} GB`,
        metrics: [
          { label: 'Megabytes', value: `${formatCalculatorNumber(result.megabytes)} MB` },
          { label: 'Megabits', value: `${formatCalculatorNumber(result.megabits)} Mb` },
          { label: 'Streams counted', value: formatCalculatorNumber(result.streams) },
        ],
        steps: [
          'Convert bitrate to megabits per second.',
          'Multiply by total seconds and number of streams.',
          'Divide megabits by 8 to estimate megabytes, then by 1,000 for gigabytes.',
        ],
        note: 'Actual platform data can differ because of variable bitrate, audio tracks, thumbnails, chat, retransmits, and adaptive streaming.',
      };
    }
    case 'device-battery-life-calculator': {
      const result = calculateDeviceBatteryLife(
        parseNumber(inputs.capacityMah, 'Battery capacity'),
        parseNumber(inputs.voltage, 'Voltage'),
        parseNumber(inputs.powerWatts, 'Device watts'),
        parseNumber(inputs.efficiencyPercent, 'Efficiency percent'),
      );
      return {
        label: 'Estimated runtime',
        expression: `${formatCalculatorNumber(result.capacityMah)} mAh x ${formatCalculatorNumber(result.voltage)} V`,
        answer: durationText(result.runtimeHours * 3600),
        metrics: [
          { label: 'Nominal energy', value: `${formatCalculatorNumber(result.wattHours)} Wh` },
          { label: 'Usable energy', value: `${formatCalculatorNumber(result.usableWattHours)} Wh` },
          { label: 'Runtime minutes', value: formatCalculatorNumber(result.runtimeMinutes) },
        ],
        steps: [
          'Convert milliamp-hours and volts into watt-hours.',
          'Apply the efficiency percentage for conversion and battery losses.',
          'Divide usable watt-hours by average device watts.',
        ],
        note: 'Battery age, temperature, charging limits, screen brightness, radio use, and power spikes can change real runtime.',
      };
    }
    case 'monitor-ppi-calculator': {
      const result = calculateMonitorPpi(
        parseNumber(inputs.widthPixels, 'Width pixels'),
        parseNumber(inputs.heightPixels, 'Height pixels'),
        parseNumber(inputs.diagonalInches, 'Diagonal inches'),
      );
      return {
        label: 'Pixels per inch',
        expression: `${formatCalculatorNumber(result.widthPixels)} x ${formatCalculatorNumber(result.heightPixels)} over ${formatCalculatorNumber(result.diagonalInches)} in`,
        answer: `${formatCalculatorNumber(result.ppi)} PPI`,
        metrics: [
          { label: 'Pixel diagonal', value: formatCalculatorNumber(result.diagonalPixels) },
          { label: 'Aspect ratio', value: result.aspectLabel },
          { label: 'Diagonal size', value: `${formatCalculatorNumber(result.diagonalInches)} in` },
        ],
        steps: [
          'Use the Pythagorean theorem to find the pixel diagonal.',
          'Divide the pixel diagonal by the screen diagonal in inches.',
          'Simplify width and height pixels into the aspect ratio.',
        ],
        note: 'Perceived sharpness also depends on viewing distance, scaling, panel quality, anti-aliasing, and your eyesight.',
      };
    }
    case 'markdown-table-generator': {
      const result = generateMarkdownTable(
        inputs.headers ?? '',
        inputs.rows ?? '',
        (inputs.alignment || 'left') as MarkdownTableAlignment,
      );
      return {
        label: 'Markdown table',
        expression: `${formatCalculatorNumber(result.columnCount)} columns, ${formatCalculatorNumber(result.rowCount)} rows`,
        answer: result.output,
        metrics: [
          { label: 'Columns', value: formatCalculatorNumber(result.columnCount) },
          { label: 'Rows', value: formatCalculatorNumber(result.rowCount) },
          { label: 'Alignment', value: unitLabel(result.alignment) },
        ],
        steps: [
          'Split headers and rows by commas or pipe characters.',
          'Build the GitHub-flavored Markdown header and delimiter rows.',
          'Pad short rows so every table row has the same column count.',
        ],
        note: 'Markdown table support depends on the editor. GitHub-flavored Markdown supports this table style.',
        textOutput: true,
      };
    }
    default: {
      const exhaustiveCheck: never = variant;
      return exhaustiveCheck;
    }
  }
}

export default function UtilityCalculator({ variant }: Props) {
  const config = utilityConfigs[variant];
  const waitsForUserAction = variant === 'password-generator' || variant === 'uuid-generator' || variant === 'hash-generator';
  const [modeId, setModeId] = useState(config.modes[0].id);
  const activeMode = useMemo(
    () => config.modes.find((mode) => mode.id === modeId) ?? config.modes[0],
    [config.modes, modeId],
  );
  const [inputs, setInputs] = useState<UtilityInputs>(activeMode.defaultInputs);
  const [result, setResult] = useState<UtilityCalculation | null>(() =>
    waitsForUserAction ? null : (calculateUtility(variant, activeMode.id, activeMode.defaultInputs) as UtilityCalculation),
  );
  const [error, setError] = useState('');
  const [history, setHistory] = useState<UtilityCalculation[]>([]);
  const [copied, setCopied] = useState(false);

  function changeMode(nextMode: UtilityMode) {
    setModeId(nextMode.id);
    setInputs(nextMode.defaultInputs);
    setResult(waitsForUserAction ? null : (calculateUtility(variant, nextMode.id, nextMode.defaultInputs) as UtilityCalculation));
    setError('');
    setCopied(false);
  }

  function updateInput(key: string, value: string) {
    setInputs((current) => ({ ...current, [key]: value }));
    setError('');
    setCopied(false);
  }

  async function runCalculation(nextInputs = inputs) {
    try {
      const nextResult = await Promise.resolve(calculateUtility(variant, activeMode.id, nextInputs));
      setResult(nextResult);
      setHistory((current) => (nextResult.keepOutOfHistory ? current : [nextResult, ...current].slice(0, 4)));
      setError('');
      setCopied(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Check the inputs and try again.');
      setCopied(false);
    }
  }

  function useExample(example: UtilityExample) {
    setInputs(example.inputs);
    void runCalculation(example.inputs);
  }

  async function copyResult() {
    if (!result || !navigator.clipboard) return;

    try {
      await navigator.clipboard.writeText(result.textOutput || variant === 'password-generator' ? result.answer : `${result.expression} = ${result.answer}`);
      setCopied(true);
    } catch {
      setCopied(false);
      setError('Copy was not available in this browser. You can still select the answer manually.');
    }
  }

  function runOnEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      void runCalculation();
    }
  }

  return (
    <section className="advanced-calculator advanced-calculator-utility" aria-label={`${config.title} workspace`}>
      <div className="advanced-panel">
        {config.modes.length > 1 && (
          <div className="advanced-mode-grid" aria-label="Calculator modes">
            {config.modes.map((mode) => (
              <button
                aria-pressed={mode.id === activeMode.id}
                key={mode.id}
                onClick={() => changeMode(mode)}
                type="button"
              >
                <strong>{mode.symbol}</strong>
                <span>{mode.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="advanced-fields utility-fields">
          {activeMode.fields.map((field) => {
            const fieldHelp = getFieldHelp(variant, field);

            return (
              <label className={field.type === 'checkbox' ? 'advanced-field advanced-checkbox-field' : 'advanced-field'} key={field.key}>
                {field.type === 'checkbox' ? (
                  <>
                    <input
                      checked={booleanInput(inputs[field.key] ?? '')}
                      onChange={(event) => updateInput(field.key, updateCheckedValue(event.target.checked))}
                      type="checkbox"
                    />
                    <span>{field.label}</span>
                  </>
                ) : (
                  <>
                    <span>{field.label}</span>
                    {field.type === 'select' ? (
                      <select value={inputs[field.key] ?? ''} onChange={(event) => updateInput(field.key, event.target.value)}>
                        {(field.options ?? []).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        onChange={(event) => updateInput(field.key, event.target.value)}
                        placeholder={field.placeholder}
                        value={inputs[field.key] ?? ''}
                      />
                    ) : (
                      <input
                        inputMode={field.inputMode}
                        onChange={(event) => updateInput(field.key, event.target.value)}
                        onKeyDown={runOnEnter}
                        placeholder={field.placeholder}
                        type={field.type === 'date' || field.type === 'time' ? field.type : 'text'}
                        value={inputs[field.key] ?? ''}
                      />
                    )}
                    {fieldHelp && <small>{fieldHelp}</small>}
                  </>
                )}
              </label>
            );
          })}
        </div>

        <div className="advanced-actions">
          <button className="button-primary" onClick={() => void runCalculation()} type="button">
            {config.buttonLabel}
          </button>
          <button className="button-secondary" disabled={!result || Boolean(error)} onClick={copyResult} type="button">
            {copied ? 'Copied' : 'Copy answer'}
          </button>
        </div>

        {error && <p className="calculator-error" role="alert">{error}</p>}

        {result && (
          <article className="advanced-result-card utility-result-card" aria-live="polite">
            <span>{result.label}</span>
            {result.textOutput ? <pre className="utility-text-output">{result.answer}</pre> : <strong>{result.answer}</strong>}
            <p>{result.expression}</p>
            <dl>
              {result.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                </div>
              ))}
            </dl>
            {result.note && <p>{result.note}</p>}
          </article>
        )}

        {result && (
          <div className="advanced-steps">
            <h2>Formula steps</h2>
            <ol>
              {result.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <aside className="advanced-side-panel">
        <div>
          <h2>Examples</h2>
          <div className="advanced-quick-grid utility-example-grid">
            {activeMode.examples.map((example) => (
              <button key={example.label} onClick={() => useExample(example)} type="button">
                {example.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2>{variant === 'password-generator' ? 'Password handling' : 'Recent answers'}</h2>
          {history.length === 0 ? (
            <p>{config.emptyHistory}</p>
          ) : (
            <ol>
              {history.map((item, index) => (
                <li key={`${item.expression}-${index}`}>
                  <span>{item.expression}</span>
                  <strong>{item.answer}</strong>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="advanced-note">
          <p>{config.privacyNote}</p>
          <p>Inputs and recent answers stay in this browser tab and are not sent to a server.</p>
        </div>
      </aside>
    </section>
  );
}
