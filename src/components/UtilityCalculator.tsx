import { useMemo, useState, type HTMLAttributes, type KeyboardEvent } from 'react';
import {
  calculateAge,
  calculateAiTokenCost,
  calculateApiPricing,
  calculateAmpHoursToWattHours,
  calculateAmpsToWatts,
  calculateAsphaltEstimate,
  calculateBandwidthTime,
  calculateBalusterEstimate,
  calculateBoardFoot,
  calculateBraSize,
  calculateBrickEstimate,
  calculateBtuEstimate,
  calculateCarpetEstimate,
  calculateConcrete,
  calculateConcreteBlockEstimate,
  calculateConcreteBlockFillEstimate,
  calculateConcreteColumnEstimate,
  calculateConcreteDrivewayEstimate,
  calculateConcreteFootingEstimate,
  calculateConcreteMixEstimate,
  calculateConcreteReinforcingMeshEstimate,
  calculateConcreteStepsEstimate,
  calculateConcreteWeightEstimate,
  calculateCountertopEstimate,
  calculateCubicYardEstimate,
  calculateDayOfWeek,
  calculateDeckBoardEstimate,
  calculateDeckCostEstimate,
  calculateDeckStainEstimate,
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
  calculateGrassSeedEstimate,
  calculateGolfCourseHandicap,
  calculateGolfScoreDifferential,
  calculateGpa,
  calculateGravelEstimate,
  calculateHeatIndex,
  calculateHeightEstimate,
  calculateHoursWorked,
  calculateHorsepowerConversion,
  calculateAspectRatio,
  calculateInsulationEstimate,
  calculateColorContrast,
  calculateCssClamp,
  calculateDateFromUnixTimestamp,
  calculateLoveCompatibility,
  calculateMassFromDensity,
  calculateMileageCost,
  calculateMolarity,
  calculateMolecularWeight,
  calculateInternetSpeedNeeds,
  calculateBakingPanConversion,
  calculateLawnMowingTime,
  calculateKilovoltAmpsToAmps,
  calculateKilowattsToAmps,
  calculateCostPerServing,
  calculateIngredientCost,
  calculateMonitorPpi,
  calculateNeededFinalGrade,
  calculateRecipeScale,
  calculateOhmsLaw,
  calculateMulchEstimate,
  calculatePaintEstimate,
  calculatePaverBaseEstimate,
  calculatePaverEstimate,
  calculatePlantSpacingEstimate,
  calculatePlywoodEstimate,
  calculatePoolVolume,
  calculatePolymericSandEstimate,
  calculatePostHoleConcreteEstimate,
  calculateRebarGridEstimate,
  calculateRebarWeightEstimate,
  calculateResistorColorCode,
  calculateRetainingWallEstimate,
  calculateRoofingEstimate,
  calculateSandEstimate,
  calculateSidingEstimate,
  calculateSleepSchedule,
  calculateSoilEstimate,
  calculateSpeed,
  calculateSquareFootage,
  calculateSubnet,
  calculateStairLayout,
  calculateSodEstimate,
  calculateTileEstimate,
  calculateTireSize,
  calculateTimeCard,
  calculateTimeDuration,
  calculateTimeZoneComparison,
  calculateUnixTimestampFromDate,
  calculateTip,
  calculateVoltageDrop,
  calculateWattHoursToAmpHours,
  calculateWattsToAmps,
  calculateWeightForce,
  calculateWallpaperEstimate,
  calculateWallStudEstimate,
  calculateWindChill,
  calculateWireResistanceEstimate,
  calculateWireSizeEstimate,
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
  compareUnitPrices,
  convertButter,
  convertCookingMeasurement,
  convertOvenTemperature,
  generateUuidBatch,
  parseQueryStringInput,
  getCopperResistanceOhmsPer1000Feet,
  numberToRomanNumeral,
  romanNumeralToNumber,
  type ConversionCategory,
  type ElectricalPowerPhase,
  type GpaCourseInput,
  type HashAlgorithm,
  type HtmlEntityMode,
  type HorsepowerUnit,
  type MarkdownTableAlignment,
  type PlantSpacingPattern,
  type RebarSize,
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
  | 'watts-to-amps'
  | 'amps-to-watts'
  | 'kilowatts-to-amps'
  | 'kva-to-amps'
  | 'amp-hours-to-watt-hours'
  | 'watt-hours-to-amp-hours'
  | 'wire-resistance'
  | 'wire-size'
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
  | 'deck-board'
  | 'deck-stain'
  | 'baluster'
  | 'paver'
  | 'paver-base'
  | 'polymeric-sand'
  | 'grass-seed'
  | 'lawn-mowing'
  | 'plant-spacing'
  | 'siding'
  | 'brick'
  | 'concrete-block'
  | 'rebar'
  | 'concrete-mix'
  | 'concrete-driveway'
  | 'concrete-steps'
  | 'concrete-weight'
  | 'concrete-reinforcing-mesh'
  | 'concrete-block-fill'
  | 'retaining-wall'
  | 'rebar-weight'
  | 'concrete-footing'
  | 'concrete-column'
  | 'post-hole-concrete'
  | 'plywood'
  | 'insulation'
  | 'countertop'
  | 'sod'
  | 'wall-stud'
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
  | 'recipe-scaler'
  | 'cooking-measurement-converter'
  | 'ingredient-cost-calculator'
  | 'unit-price-calculator'
  | 'cost-per-serving-calculator'
  | 'oven-temperature-converter'
  | 'butter-converter'
  | 'baking-pan-conversion-calculator'
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

const rebarSizeOptions: SelectOption[] = [
  { label: '#3 - 0.376 lb/ft', value: '#3' },
  { label: '#4 - 0.668 lb/ft', value: '#4' },
  { label: '#5 - 1.043 lb/ft', value: '#5' },
  { label: '#6 - 1.502 lb/ft', value: '#6' },
  { label: '#7 - 2.044 lb/ft', value: '#7' },
  { label: '#8 - 2.670 lb/ft', value: '#8' },
];

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
    roomLengthFeet: 'Length of one pair of opposite walls. If you measured inches, divide by 12 first.',
    roomWidthFeet: 'Width of the other pair of opposite walls. If you measured inches, divide by 12 first.',
    wallHeightFeet: 'Average wall height from baseboard or floor to ceiling or trim.',
    doors: 'Number of standard doors. The estimate subtracts about 20 square feet per door.',
    windows: 'Number of standard windows. The estimate subtracts about 15 square feet per window.',
    rollCoverageSquareFeet:
      'Usable square feet one roll covers. Use the product label because pattern repeat can reduce usable coverage.',
    wastePercent: 'Extra wallpaper for trimming, pattern matching, damaged strips, and mistakes.',
    pricePerRoll: 'Optional price for one roll so the tool can estimate rough material cost.',
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
  'deck-board': {
    deckLengthFeet: 'Deck length in feet along the joist spacing direction.',
    deckWidthFeet: 'Deck width in feet across the surface you want to cover.',
    boardLengthFeet: 'Purchased deck board length in feet.',
    boardWidthInches: 'Actual board face width in inches, not the nominal board name.',
    joistSpacingInches: 'On-center joist spacing used to estimate fastener rows.',
    wastePercent: 'Extra boards for cuts, starter pieces, picture framing, and damaged boards.',
    pricePerBoard: 'Optional price for one deck board.',
  },
  'deck-stain': {
    deckLengthFeet: 'Deck surface length in feet.',
    deckWidthFeet: 'Deck surface width in feet.',
    railingLengthFeet: 'Total railing run to coat. Use 0 if there is no railing.',
    railingHeightFeet: 'Average railing height. The calculator counts both sides.',
    stepCount: 'Number of stair treads and risers to include.',
    stepWidthFeet: 'Average width of each step.',
    stepDepthInches: 'Tread depth from front to back.',
    riserHeightInches: 'Vertical riser height for each step.',
    coats: 'Number of coats recommended by the stain product.',
    coverageSquareFeetPerGallon: 'Coverage per gallon from the stain label.',
    wastePercent: 'Extra stain for rough wood, rails, edges, overlap, and touch-ups.',
    pricePerGallon: 'Optional price for one gallon of stain.',
  },
  baluster: {
    railLengthFeet: 'Total straight railing opening length in feet.',
    postWidthInches: 'Width of each post that takes space away from the opening.',
    postCount: 'Number of posts inside the measured rail run.',
    balusterWidthInches: 'Width of one baluster or spindle.',
    maxSpacingInches: 'Largest open space allowed between balusters.',
  },
  paver: {
    areaSquareFeet: 'Patio, path, or driveway surface area before waste.',
    paverLengthInches: 'Visible length of one paver in inches.',
    paverWidthInches: 'Visible width of one paver in inches.',
    wastePercent: 'Extra pavers for cuts, breakage, border pieces, and future replacement.',
  },
  'paver-base': {
    areaSquareFeet: 'Patio, walkway, or driveway area in square feet.',
    baseDepthInches: 'Compacted gravel base depth in inches.',
    beddingDepthInches: 'Sand bedding layer depth in inches.',
    wastePercent: 'Extra material for compaction, edge loss, uneven grade, and small measurement errors.',
    baseTonsPerCubicYard: 'Approximate tons per cubic yard for base material.',
  },
  'polymeric-sand': {
    areaSquareFeet: 'Finished paver area in square feet.',
    paverLengthInches: 'Visible paver length in inches.',
    paverWidthInches: 'Visible paver width in inches.',
    jointWidthInches: 'Average joint width between pavers.',
    jointDepthInches: 'Depth you expect the joint sand to fill.',
    wastePercent: 'Extra sand for sweeping loss, irregular joints, and touch-ups.',
    bagCoverageCubicFeet: 'How many cubic feet one bag covers. Use the product label when available.',
  },
  'grass-seed': {
    lawnAreaSquareFeet: 'Lawn area you want to seed.',
    seedRatePoundsPer1000SquareFeet: 'Seed label rate in pounds per 1,000 square feet.',
    wastePercent: 'Extra seed for overlap, missed strips, bare spots, and uneven spreading.',
    bagWeightPounds: 'Weight of one bag of seed.',
    pricePerBag: 'Optional price for one bag of seed.',
  },
  'lawn-mowing': {
    lawnAreaSquareFeet: 'Mowable lawn area in square feet.',
    mowerWidthInches: 'Actual cutting width of the mower deck.',
    speedMph: 'Average mowing speed in miles per hour.',
    efficiencyPercent: 'Real-world efficiency after turns, overlap, obstacles, and slowing down.',
  },
  'plant-spacing': {
    bedLengthFeet: 'Planting bed length in feet.',
    bedWidthFeet: 'Planting bed width in feet.',
    spacingInches: 'Recommended center-to-center spacing from the plant tag.',
    pattern: 'Square grid is simple rows. Triangular spacing staggers rows and usually fits more plants.',
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
  'concrete-mix': {
    cubicYards: 'Final concrete volume you want to mix, before the waste allowance is added.',
    cementParts: 'Cement share in the mix ratio. A common general-purpose ratio is 1 part cement.',
    sandParts: 'Sand share in the mix ratio. A 1:2:3 mix uses 2 parts sand.',
    gravelParts: 'Stone or gravel share in the mix ratio. A 1:2:3 mix uses 3 parts gravel.',
    cementBagCubicFeet: 'Approximate dry volume one cement bag contributes. Use your bag label when you have it.',
    wastePercent: 'Extra material for spillage, uneven measuring, and small batch losses.',
  },
  'concrete-driveway': {
    lengthFeet: 'Driveway slab length in feet.',
    widthFeet: 'Driveway slab width in feet.',
    depthInches: 'Average driveway thickness in inches. Many driveways use thicker edges or thicker sections for heavier loads.',
    wastePercent: 'Extra concrete for low spots, forms, spillage, and ordering cushion.',
    pricePerCubicYard: 'Optional ready-mix price per cubic yard for a rough material cost.',
  },
  'concrete-steps': {
    stepCount: 'Number of risers in the solid concrete stair shape.',
    widthFeet: 'Step width from side to side.',
    riserHeightInches: 'Vertical height of each riser.',
    treadDepthInches: 'Horizontal run of each tread.',
    landingDepthFeet: 'Optional top landing depth in feet. Use 0 when there is no landing.',
    wastePercent: 'Extra concrete for form variation, spillage, and ordering cushion.',
  },
  'concrete-weight': {
    cubicYards: 'Concrete volume in cubic yards.',
    densityPoundsPerCubicFoot: 'Concrete density. Normal-weight concrete is often estimated near 145 to 150 lb/ft3.',
    wastePercent: 'Optional extra volume if you want weight after a waste allowance.',
  },
  'concrete-reinforcing-mesh': {
    slabLengthFeet: 'Slab length in feet.',
    slabWidthFeet: 'Slab width in feet.',
    sheetLengthFeet: 'Length of one mesh sheet or roll section.',
    sheetWidthFeet: 'Width of one mesh sheet or roll section.',
    overlapInches: 'Planned overlap between sheets. Overlap reduces the effective coverage per sheet.',
    wastePercent: 'Extra mesh for overlaps, edge trimming, cuts, and layout mistakes.',
  },
  'concrete-block-fill': {
    blockCount: 'Number of block cores you plan to fill.',
    fillCubicFeetPerBlock: 'Concrete or grout volume needed for one block. Use product or block data when available.',
    wastePercent: 'Extra fill for spillage, overfilled cores, and small measurement differences.',
  },
  'retaining-wall': {
    wallLengthFeet: 'Finished retaining wall length in feet.',
    wallHeightFeet: 'Finished wall height in feet.',
    blockLengthInches: 'Face length of one wall block.',
    blockHeightInches: 'Face height of one wall block.',
    capLengthInches: 'Length of one cap block along the wall.',
    baseDepthInches: 'Depth of gravel base below the wall.',
    baseWidthInches: 'Width of the compacted base trench.',
    wastePercent: 'Extra wall blocks, caps, and base material for cuts, corners, and layout changes.',
  },
  'rebar-weight': {
    rebarSize: 'US rebar size used for weight per foot. Example: #4 is about 0.668 lb per foot.',
    lengthFeet: 'Length of one bar or cut piece in feet.',
    quantity: 'How many bars or pieces at that length.',
    wastePercent: 'Extra length for cuts, laps, layout changes, and damaged pieces.',
  },
  'concrete-footing': {
    lengthFeet: 'Total straight footing length in feet.',
    widthInches: 'Footing width in inches from side to side.',
    depthInches: 'Footing depth or thickness in inches.',
    wastePercent: 'Extra concrete for uneven trenches, spillage, and ordering cushion.',
  },
  'concrete-column': {
    diameterInches: 'Round form or pier diameter in inches.',
    heightFeet: 'Concrete column or pier height in feet.',
    quantity: 'How many matching round columns or piers to pour.',
    wastePercent: 'Extra concrete for form variation, spillage, and ordering cushion.',
  },
  'post-hole-concrete': {
    holeDiameterInches: 'Diameter of the round post hole in inches.',
    holeDepthInches: 'Depth of the hole filled with concrete in inches.',
    postDiameterInches: 'Diameter of the post sitting in the hole. This space is subtracted from the concrete.',
    quantity: 'How many matching post holes to estimate.',
    wastePercent: 'Extra concrete for uneven holes, overdigging, and spillage.',
  },
  plywood: {
    areaSquareFeet: 'Total area you want to cover before waste.',
    sheetWidthFeet: 'Width of one plywood sheet in feet, often 4.',
    sheetLengthFeet: 'Length of one plywood sheet in feet, often 8.',
    wastePercent: 'Extra sheets for cuts, layout, damaged edges, and mistakes.',
    pricePerSheet: 'Optional price for one sheet so the tool can estimate cost.',
  },
  insulation: {
    areaSquareFeet: 'Wall, ceiling, floor, or attic area before subtracting openings.',
    openingsSquareFeet: 'Combined area to subtract, such as windows, doors, or access panels.',
    coveragePerPackSquareFeet: 'Square feet covered by one package at the product R-value.',
    wastePercent: 'Extra insulation for cuts, cavities, fitting, and mistakes.',
    pricePerPack: 'Optional price per package so the tool can estimate cost.',
  },
  countertop: {
    lengthFeet: 'Total countertop run length in feet.',
    depthInches: 'Countertop depth from front edge to wall in inches.',
    backsplashLengthFeet: 'Backsplash run length in feet. Use 0 if there is no backsplash.',
    backsplashHeightInches: 'Backsplash height in inches. Use 0 if there is no backsplash.',
    cutoutSquareFeet: 'Sink, cooktop, or other cutout area to subtract when needed.',
    wastePercent: 'Extra area for seams, edge pieces, layout, and mistakes.',
    pricePerSquareFoot: 'Optional material price per square foot.',
  },
  sod: {
    lawnAreaSquareFeet: 'Measured lawn area before waste.',
    rollCoverageSquareFeet: 'Square feet covered by one roll, slab, or piece of sod.',
    rollsPerPallet: 'How many rolls or slabs the supplier puts on one pallet.',
    wastePercent: 'Extra sod for curved edges, trimming, dead pieces, and repair patches.',
    pricePerRoll: 'Optional price per roll or slab.',
  },
  'wall-stud': {
    wallLengthFeet: 'Wall length in feet.',
    wallHeightFeet: 'Wall height in feet.',
    spacingInches: 'On-center spacing between studs, commonly 16 or 24 inches.',
    openingsCount: 'Number of rough openings; the tool adds two extra studs per opening.',
    extraCornerStuds: 'Extra vertical studs for corners, intersections, and blocking choices.',
    plates: 'Number of horizontal plate rows along the wall, often 2 or 3.',
    boardLengthFeet: 'Length of one purchased board, commonly 8, 10, or 12 feet.',
    wastePercent: 'Extra boards for cuts, layout changes, and damaged pieces.',
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
    tonsPerCubicYard: 'Use the supplier or plant density when you have it. The default is only a rough asphalt planning shortcut.',
    wastePercent: 'Extra asphalt for compaction differences, edges, and small measurement errors.',
  },
  'watts-to-amps': {
    watts: 'Real power in watts. Use the device label or measured watts when you have it.',
    volts: 'Supply voltage. Common examples are 12 V DC, 120 V AC, 240 V AC, or 208 V three-phase.',
    phase: 'Choose DC, single-phase AC, or three-phase AC so the calculator uses the right current formula.',
    powerFactor:
      'Power factor is how efficiently AC current becomes real power. Use 1 for DC or simple resistive loads when you do not know it.',
  },
  'amps-to-watts': {
    amps: 'Current draw in amps.',
    volts: 'Supply voltage for the circuit or device.',
    phase: 'Choose DC, single-phase AC, or three-phase AC.',
    powerFactor: 'Use 1 for DC/resistive loads. Motors and many AC devices may be lower, such as 0.8 or 0.9.',
  },
  'kilowatts-to-amps': {
    kilowatts: 'Real power in kilowatts. One kilowatt is 1,000 watts.',
    volts: 'Supply voltage for the load.',
    phase: 'Choose DC, single-phase AC, or three-phase AC.',
    powerFactor: 'AC power factor. Use 1 only when the load is resistive or you are given that value.',
    efficiencyPercent: 'Motor or equipment efficiency. Use 100 when efficiency is already included in the kW value.',
  },
  'kva-to-amps': {
    kilovoltAmps: 'Apparent power in kVA. One kVA is 1,000 volt-amps.',
    volts: 'Line voltage for the equipment.',
    phase: 'Choose single-phase or three-phase. kVA already describes apparent power, so no power factor input is needed.',
  },
  'amp-hours-to-watt-hours': {
    ampHours: 'Battery capacity in amp-hours.',
    volts: 'Nominal battery voltage. Battery packs often list this on the label or specification sheet.',
  },
  'watt-hours-to-amp-hours': {
    wattHours: 'Energy capacity in watt-hours.',
    volts: 'Nominal battery voltage used to convert energy back into amp-hours.',
  },
  'wire-resistance': {
    wireGauge: 'Copper AWG size used for the resistance lookup.',
    oneWayLengthFeet: 'One-way conductor length in feet.',
    conductorCount: 'How many conductor lengths to include. Use 2 for a simple out-and-back path.',
  },
  'wire-size': {
    sourceVoltage: 'Supply voltage before the wire run.',
    currentAmps: 'Load current in amps.',
    oneWayLengthFeet: 'One-way distance from the source to the load.',
    maxVoltageDropPercent: 'The largest voltage-drop percentage you want the estimate to allow.',
    phase: 'Choose single/DC or three-phase so the voltage-drop factor matches the circuit type.',
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
  'recipe-scaler': {
    ingredientName: 'Optional label for the ingredient you are scaling.',
    amount: 'The original amount for one ingredient line.',
    unit: 'The unit from the original recipe, such as cups, grams, tablespoons, or pieces.',
    originalServings: 'How many servings the original recipe makes.',
    desiredServings: 'How many servings you want to make now.',
  },
  'cooking-measurement-converter': {
    amount: 'The ingredient amount to convert.',
    densityGramsPerCup:
      'Ingredient weight for 1 US cup. This matters when converting between volume and weight because ingredients pack differently.',
  },
  'ingredient-cost-calculator': {
    amountNeeded: 'How much of the ingredient your recipe needs.',
    packageAmount: 'How much ingredient is in the package or container.',
    packagePrice: 'The package price before tax or discounts unless you want those included.',
    densityGramsPerCup: 'Use the ingredient weight per cup when the package and recipe use different volume or weight units.',
  },
  'unit-price-calculator': {
    itemAPrice: 'Shelf price for the first product.',
    itemAQuantity: 'Package size for the first product in the same unit as item B.',
    itemBPrice: 'Shelf price for the second product.',
    itemBQuantity: 'Package size for the second product in the same unit as item A.',
    unit: 'The shared comparison unit, such as oz, lb, count, sheet, or fl oz.',
  },
  'cost-per-serving-calculator': {
    totalCost: 'Food, ingredient, or meal cost you want to spread across servings.',
    extraCost: 'Optional packaging, topping, delivery, or fee amount to include.',
    servings: 'How many servings the batch makes.',
  },
  'oven-temperature-converter': {
    temperature: 'Recipe oven setting, not the safe internal food temperature.',
    unit: 'Choose the unit written in the recipe: Fahrenheit, Celsius, or gas mark.',
  },
  'butter-converter': {
    amount: 'Butter quantity from the recipe or package.',
    unit: 'Butter unit you are starting from.',
  },
  'baking-pan-conversion-calculator': {
    oldLengthInches: 'Length of the recipe pan in inches.',
    oldWidthInches: 'Width of the recipe pan in inches.',
    newLengthInches: 'Length of the pan you want to use.',
    newWidthInches: 'Width of the pan you want to use.',
    originalServings: 'Optional servings from the original pan size.',
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

const powerPhaseOptions: SelectOption[] = [
  { label: 'DC', value: 'dc' },
  { label: 'Single-phase AC', value: 'single-phase' },
  { label: 'Three-phase AC', value: 'three-phase' },
];

const acPhaseOptions: SelectOption[] = [
  { label: 'Single-phase AC', value: 'single-phase' },
  { label: 'Three-phase AC', value: 'three-phase' },
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

const cookingMeasurementUnitOptions: SelectOption[] = [
  { label: 'Teaspoons', value: 'teaspoon' },
  { label: 'Tablespoons', value: 'tablespoon' },
  { label: 'Fluid ounces', value: 'fluid-ounce' },
  { label: 'Cups', value: 'cup' },
  { label: 'Pints', value: 'pint' },
  { label: 'Quarts', value: 'quart' },
  { label: 'Gallons', value: 'gallon' },
  { label: 'Milliliters', value: 'milliliter' },
  { label: 'Liters', value: 'liter' },
  { label: 'Grams', value: 'gram' },
  { label: 'Kilograms', value: 'kilogram' },
  { label: 'Ounces', value: 'ounce' },
  { label: 'Pounds', value: 'pound' },
];

const ovenTemperatureUnitOptions: SelectOption[] = [
  { label: 'Fahrenheit', value: 'fahrenheit' },
  { label: 'Celsius', value: 'celsius' },
  { label: 'Gas mark', value: 'gas-mark' },
];

const butterUnitOptions: SelectOption[] = [
  { label: 'Teaspoons', value: 'teaspoon' },
  { label: 'Tablespoons', value: 'tablespoon' },
  { label: 'Cups', value: 'cup' },
  { label: 'Sticks', value: 'stick' },
  { label: 'Ounces', value: 'ounce' },
  { label: 'Grams', value: 'gram' },
  { label: 'Pounds', value: 'pound' },
];

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

const plantSpacingPatternOptions: SelectOption[] = [
  { label: 'Square grid', value: 'square' },
  { label: 'Triangular / staggered', value: 'triangular' },
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
        defaultInputs: { startDate: '2026-05-26', endDate: '2026-06-10' },
        examples: [
          { label: 'Two-week deadline', inputs: { startDate: '2026-05-26', endDate: '2026-06-10' } },
          { label: 'Project window', inputs: { startDate: '2026-06-01', endDate: '2026-08-15' } },
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
        defaultInputs: { startDate: '2026-05-26', direction: 'add', years: '0', months: '0', weeks: '6', days: '3' },
        examples: [
          { label: 'Add 45 days', inputs: { startDate: '2026-05-26', direction: 'add', years: '0', months: '0', weeks: '6', days: '3' } },
          { label: 'Subtract 90 days', inputs: { startDate: '2026-12-31', direction: 'subtract', years: '0', months: '0', weeks: '12', days: '6' } },
          { label: 'Month-end clamp', inputs: { startDate: '2026-01-31', direction: 'add', years: '0', months: '1', weeks: '0', days: '0' } },
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
        defaultInputs: { miles: '125', ratePerMile: '0.725', extraCosts: '12' },
        examples: [
          { label: 'Client visit', inputs: { miles: '125', ratePerMile: '0.725', extraCosts: '12' } },
          { label: 'Local errand', inputs: { miles: '18.4', ratePerMile: '0.725', extraCosts: '0' } },
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
  'watts-to-amps': {
    title: 'Watts to Amps Calculator',
    buttonLabel: 'Calculate amps',
    emptyHistory: 'Recent watt-to-amp conversions will appear here.',
    privacyNote: 'Power conversion math runs locally in your browser. Use a qualified professional for real electrical work.',
    modes: [
      {
        id: 'power-current',
        label: 'Power to current',
        symbol: 'W>A',
        fields: [
          numberField('watts', 'Watts', '1500'),
          numberField('volts', 'Volts', '120'),
          selectField('phase', 'Phase / current type', powerPhaseOptions),
          numberField('powerFactor', 'Power factor', '1'),
        ],
        defaultInputs: { watts: '1500', volts: '120', phase: 'dc', powerFactor: '1' },
        examples: [
          { label: 'Space heater', inputs: { watts: '1500', volts: '120', phase: 'dc', powerFactor: '1' } },
          { label: 'Single-phase motor', inputs: { watts: '2200', volts: '240', phase: 'single-phase', powerFactor: '0.9' } },
          { label: 'Three-phase load', inputs: { watts: '5000', volts: '208', phase: 'three-phase', powerFactor: '0.85' } },
        ],
      },
    ],
  },
  'amps-to-watts': {
    title: 'Amps to Watts Calculator',
    buttonLabel: 'Calculate watts',
    emptyHistory: 'Recent amp-to-watt conversions will appear here.',
    privacyNote: 'Power conversion math runs locally in your browser. Use a qualified professional for real electrical work.',
    modes: [
      {
        id: 'current-power',
        label: 'Current to power',
        symbol: 'A>W',
        fields: [
          numberField('amps', 'Amps', '12.5'),
          numberField('volts', 'Volts', '120'),
          selectField('phase', 'Phase / current type', powerPhaseOptions),
          numberField('powerFactor', 'Power factor', '1'),
        ],
        defaultInputs: { amps: '12.5', volts: '120', phase: 'dc', powerFactor: '1' },
        examples: [
          { label: '120 V circuit', inputs: { amps: '12.5', volts: '120', phase: 'dc', powerFactor: '1' } },
          { label: 'Single-phase AC', inputs: { amps: '10', volts: '240', phase: 'single-phase', powerFactor: '0.9' } },
          { label: 'Three-phase AC', inputs: { amps: '20', volts: '208', phase: 'three-phase', powerFactor: '0.85' } },
        ],
      },
    ],
  },
  'kilowatts-to-amps': {
    title: 'Kilowatts to Amps Calculator',
    buttonLabel: 'Calculate amps',
    emptyHistory: 'Recent kW-to-amp conversions will appear here.',
    privacyNote: 'Kilowatt conversion math stays local. Electrical equipment and wiring decisions need qualified review.',
    modes: [
      {
        id: 'kw-current',
        label: 'kW to amps',
        symbol: 'kW>A',
        fields: [
          numberField('kilowatts', 'Kilowatts', '5'),
          numberField('volts', 'Volts', '240'),
          selectField('phase', 'Phase / current type', powerPhaseOptions),
          numberField('powerFactor', 'Power factor', '0.9'),
          numberField('efficiencyPercent', 'Efficiency percent', '90'),
        ],
        defaultInputs: { kilowatts: '5', volts: '240', phase: 'single-phase', powerFactor: '0.9', efficiencyPercent: '90' },
        examples: [
          { label: 'Motor estimate', inputs: { kilowatts: '5', volts: '240', phase: 'single-phase', powerFactor: '0.9', efficiencyPercent: '90' } },
          { label: 'Three-phase load', inputs: { kilowatts: '15', volts: '480', phase: 'three-phase', powerFactor: '0.88', efficiencyPercent: '92' } },
          { label: 'DC equipment', inputs: { kilowatts: '1.2', volts: '48', phase: 'dc', powerFactor: '1', efficiencyPercent: '100' } },
        ],
      },
    ],
  },
  'kva-to-amps': {
    title: 'kVA to Amps Calculator',
    buttonLabel: 'Calculate amps',
    emptyHistory: 'Recent kVA-to-amp conversions will appear here.',
    privacyNote: 'kVA conversion math stays local. Transformer and electrical sizing should be checked by a qualified professional.',
    modes: [
      {
        id: 'kva-current',
        label: 'kVA to amps',
        symbol: 'kVA',
        fields: [
          numberField('kilovoltAmps', 'kVA', '25'),
          numberField('volts', 'Volts', '220'),
          selectField('phase', 'Phase', acPhaseOptions),
        ],
        defaultInputs: { kilovoltAmps: '25', volts: '220', phase: 'single-phase' },
        examples: [
          { label: 'Single-phase equipment', inputs: { kilovoltAmps: '25', volts: '220', phase: 'single-phase' } },
          { label: 'Three-phase transformer', inputs: { kilovoltAmps: '75', volts: '480', phase: 'three-phase' } },
          { label: 'Small UPS', inputs: { kilovoltAmps: '3', volts: '120', phase: 'single-phase' } },
        ],
      },
    ],
  },
  'amp-hours-to-watt-hours': {
    title: 'Amp Hours to Watt Hours Calculator',
    buttonLabel: 'Calculate watt-hours',
    emptyHistory: 'Recent Ah-to-Wh conversions will appear here.',
    privacyNote: 'Battery energy conversion runs locally in your browser tab.',
    modes: [
      {
        id: 'ah-wh',
        label: 'Battery energy',
        symbol: 'Ah',
        fields: [numberField('ampHours', 'Amp-hours', '300'), numberField('volts', 'Volts', '12')],
        defaultInputs: { ampHours: '300', volts: '12' },
        examples: [
          { label: '12 V battery', inputs: { ampHours: '300', volts: '12' } },
          { label: '48 V pack', inputs: { ampHours: '100', volts: '48' } },
          { label: 'Small pack', inputs: { ampHours: '20', volts: '24' } },
        ],
      },
    ],
  },
  'watt-hours-to-amp-hours': {
    title: 'Watt Hours to Amp Hours Calculator',
    buttonLabel: 'Calculate amp-hours',
    emptyHistory: 'Recent Wh-to-Ah conversions will appear here.',
    privacyNote: 'Battery energy conversion runs locally in your browser tab.',
    modes: [
      {
        id: 'wh-ah',
        label: 'Battery capacity',
        symbol: 'Wh',
        fields: [numberField('wattHours', 'Watt-hours', '5000'), numberField('volts', 'Volts', '120')],
        defaultInputs: { wattHours: '5000', volts: '120' },
        examples: [
          { label: 'Portable power station', inputs: { wattHours: '5000', volts: '120' } },
          { label: '48 V battery', inputs: { wattHours: '4800', volts: '48' } },
          { label: '12 V battery', inputs: { wattHours: '1200', volts: '12' } },
        ],
      },
    ],
  },
  'wire-resistance': {
    title: 'Wire Resistance Calculator',
    buttonLabel: 'Estimate resistance',
    emptyHistory: 'Recent wire resistance estimates will appear here.',
    privacyNote: 'Wire resistance math runs locally and is only a simplified copper conductor estimate.',
    modes: [
      {
        id: 'copper-wire',
        label: 'Copper AWG',
        symbol: 'ohm',
        fields: [
          selectField('wireGauge', 'Copper wire size', copperAwgOptions),
          numberField('oneWayLengthFeet', 'One-way length feet', '100'),
          numberField('conductorCount', 'Conductor count', '2'),
        ],
        defaultInputs: { wireGauge: '12', oneWayLengthFeet: '100', conductorCount: '2' },
        examples: [
          { label: '12 AWG loop', inputs: { wireGauge: '12', oneWayLengthFeet: '100', conductorCount: '2' } },
          { label: 'Long 8 AWG run', inputs: { wireGauge: '8', oneWayLengthFeet: '150', conductorCount: '2' } },
          { label: 'One conductor', inputs: { wireGauge: '10', oneWayLengthFeet: '50', conductorCount: '1' } },
        ],
      },
    ],
  },
  'wire-size': {
    title: 'Wire Size Calculator',
    buttonLabel: 'Estimate wire size',
    emptyHistory: 'Recent wire size estimates will appear here.',
    privacyNote: 'Wire-size estimates are browser-only planning math. Code-compliant electrical design needs qualified review.',
    modes: [
      {
        id: 'voltage-drop-size',
        label: 'Voltage drop',
        symbol: 'AWG',
        fields: [
          numberField('sourceVoltage', 'Source voltage', '120'),
          numberField('currentAmps', 'Current amps', '15'),
          numberField('oneWayLengthFeet', 'One-way length feet', '75'),
          numberField('maxVoltageDropPercent', 'Max voltage drop percent', '3'),
          selectField('phase', 'Circuit type', phaseOptions),
        ],
        defaultInputs: { sourceVoltage: '120', currentAmps: '15', oneWayLengthFeet: '75', maxVoltageDropPercent: '3', phase: 'single' },
        examples: [
          { label: '120 V branch', inputs: { sourceVoltage: '120', currentAmps: '15', oneWayLengthFeet: '75', maxVoltageDropPercent: '3', phase: 'single' } },
          { label: '240 V run', inputs: { sourceVoltage: '240', currentAmps: '30', oneWayLengthFeet: '100', maxVoltageDropPercent: '3', phase: 'single' } },
          { label: 'Three-phase run', inputs: { sourceVoltage: '208', currentAmps: '20', oneWayLengthFeet: '150', maxVoltageDropPercent: '3', phase: 'three' } },
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
    privacyNote: 'Roofing estimates stay in this browser tab. Use rough dimensions only; the tool does not need an address.',
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
          numberField('pricePerRoll', 'Price per roll (optional)', '42'),
        ],
        defaultInputs: {
          roomLengthFeet: '12',
          roomWidthFeet: '10',
          wallHeightFeet: '8',
          doors: '1',
          windows: '2',
          rollCoverageSquareFeet: '56',
          wastePercent: '10',
          pricePerRoll: '42',
        },
        examples: [
          {
            label: 'Bedroom walls',
            inputs: {
              roomLengthFeet: '12',
              roomWidthFeet: '10',
              wallHeightFeet: '8',
              doors: '1',
              windows: '2',
              rollCoverageSquareFeet: '56',
              wastePercent: '10',
              pricePerRoll: '42',
            },
          },
          {
            label: 'Small office',
            inputs: {
              roomLengthFeet: '10',
              roomWidthFeet: '9',
              wallHeightFeet: '8',
              doors: '1',
              windows: '1',
              rollCoverageSquareFeet: '48',
              wastePercent: '12',
              pricePerRoll: '',
            },
          },
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
  'deck-board': {
    title: 'Deck Board Calculator',
    buttonLabel: 'Estimate deck boards',
    emptyHistory: 'Recent deck board estimates will appear here.',
    privacyNote: 'Deck board estimates stay local and are rough planning numbers, not a code or contractor quote.',
    modes: [
      {
        id: 'deck-board',
        label: 'Boards',
        symbol: 'DECK',
        fields: [
          numberField('deckLengthFeet', 'Deck length ft', '16'),
          numberField('deckWidthFeet', 'Deck width ft', '12'),
          numberField('boardLengthFeet', 'Board length ft', '16'),
          numberField('boardWidthInches', 'Board width inches', '5.5'),
          numberField('joistSpacingInches', 'Joist spacing inches', '16'),
          numberField('wastePercent', 'Waste percent', '10'),
          numberField('pricePerBoard', 'Price per board (optional)', '18'),
        ],
        defaultInputs: { deckLengthFeet: '16', deckWidthFeet: '12', boardLengthFeet: '16', boardWidthInches: '5.5', joistSpacingInches: '16', wastePercent: '10', pricePerBoard: '18' },
        examples: [
          { label: '16 x 12 deck', inputs: { deckLengthFeet: '16', deckWidthFeet: '12', boardLengthFeet: '16', boardWidthInches: '5.5', joistSpacingInches: '16', wastePercent: '10', pricePerBoard: '18' } },
          { label: 'Small landing', inputs: { deckLengthFeet: '10', deckWidthFeet: '8', boardLengthFeet: '12', boardWidthInches: '5.5', joistSpacingInches: '16', wastePercent: '12', pricePerBoard: '' } },
        ],
      },
    ],
  },
  'deck-stain': {
    title: 'Deck Stain Calculator',
    buttonLabel: 'Estimate stain',
    emptyHistory: 'Recent deck stain estimates will appear here.',
    privacyNote: 'Deck stain estimates stay local. Compare the result with your stain label and wood condition.',
    modes: [
      {
        id: 'deck-stain',
        label: 'Stain',
        symbol: 'COAT',
        fields: [
          numberField('deckLengthFeet', 'Deck length ft', '16'),
          numberField('deckWidthFeet', 'Deck width ft', '12'),
          numberField('railingLengthFeet', 'Railing length ft', '40'),
          numberField('railingHeightFeet', 'Railing height ft', '3'),
          integerField('stepCount', 'Step count', '4'),
          numberField('stepWidthFeet', 'Step width ft', '4'),
          numberField('stepDepthInches', 'Step depth inches', '11'),
          numberField('riserHeightInches', 'Riser height inches', '7'),
          integerField('coats', 'Coats', '2'),
          numberField('coverageSquareFeetPerGallon', 'Coverage ft2/gallon', '200'),
          numberField('wastePercent', 'Waste percent', '10'),
          numberField('pricePerGallon', 'Price per gallon (optional)', '45'),
        ],
        defaultInputs: { deckLengthFeet: '16', deckWidthFeet: '12', railingLengthFeet: '40', railingHeightFeet: '3', stepCount: '4', stepWidthFeet: '4', stepDepthInches: '11', riserHeightInches: '7', coats: '2', coverageSquareFeetPerGallon: '200', wastePercent: '10', pricePerGallon: '45' },
        examples: [
          { label: 'Deck with rails', inputs: { deckLengthFeet: '16', deckWidthFeet: '12', railingLengthFeet: '40', railingHeightFeet: '3', stepCount: '4', stepWidthFeet: '4', stepDepthInches: '11', riserHeightInches: '7', coats: '2', coverageSquareFeetPerGallon: '200', wastePercent: '10', pricePerGallon: '45' } },
          { label: 'Platform deck', inputs: { deckLengthFeet: '12', deckWidthFeet: '10', railingLengthFeet: '0', railingHeightFeet: '0', stepCount: '0', stepWidthFeet: '0', stepDepthInches: '0', riserHeightInches: '0', coats: '1', coverageSquareFeetPerGallon: '250', wastePercent: '8', pricePerGallon: '' } },
        ],
      },
    ],
  },
  baluster: {
    title: 'Baluster Calculator',
    buttonLabel: 'Estimate balusters',
    emptyHistory: 'Recent baluster estimates will appear here.',
    privacyNote: 'Baluster spacing math stays local. Check local building code before building railing.',
    modes: [
      {
        id: 'baluster',
        label: 'Spacing',
        symbol: 'RAIL',
        fields: [
          numberField('railLengthFeet', 'Rail length ft', '10'),
          numberField('postWidthInches', 'Post width inches', '3.5'),
          integerField('postCount', 'Post count', '2'),
          numberField('balusterWidthInches', 'Baluster width inches', '1.5'),
          numberField('maxSpacingInches', 'Max open spacing inches', '4'),
        ],
        defaultInputs: { railLengthFeet: '10', postWidthInches: '3.5', postCount: '2', balusterWidthInches: '1.5', maxSpacingInches: '4' },
        examples: [
          { label: 'Deck rail bay', inputs: { railLengthFeet: '10', postWidthInches: '3.5', postCount: '2', balusterWidthInches: '1.5', maxSpacingInches: '4' } },
          { label: 'Metal balusters', inputs: { railLengthFeet: '8', postWidthInches: '4', postCount: '2', balusterWidthInches: '0.75', maxSpacingInches: '4' } },
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
  'paver-base': {
    title: 'Paver Base Calculator',
    buttonLabel: 'Estimate base',
    emptyHistory: 'Recent paver base estimates will appear here.',
    privacyNote: 'Paver base estimates stay local and are planning math, not drainage or soil engineering advice.',
    modes: [
      {
        id: 'paver-base',
        label: 'Base',
        symbol: 'BASE',
        fields: [
          numberField('areaSquareFeet', 'Paver area ft2', '200'),
          numberField('baseDepthInches', 'Base depth inches', '4'),
          numberField('beddingDepthInches', 'Bedding sand depth inches', '1'),
          numberField('wastePercent', 'Waste percent', '10'),
          numberField('baseTonsPerCubicYard', 'Base tons per cubic yard', '1.5'),
        ],
        defaultInputs: { areaSquareFeet: '200', baseDepthInches: '4', beddingDepthInches: '1', wastePercent: '10', baseTonsPerCubicYard: '1.5' },
        examples: [
          { label: 'Patio base', inputs: { areaSquareFeet: '200', baseDepthInches: '4', beddingDepthInches: '1', wastePercent: '10', baseTonsPerCubicYard: '1.5' } },
          { label: 'Driveway base', inputs: { areaSquareFeet: '420', baseDepthInches: '6', beddingDepthInches: '1', wastePercent: '12', baseTonsPerCubicYard: '1.6' } },
        ],
      },
    ],
  },
  'polymeric-sand': {
    title: 'Polymeric Sand Calculator',
    buttonLabel: 'Estimate sand',
    emptyHistory: 'Recent polymeric sand estimates will appear here.',
    privacyNote: 'Polymeric sand estimates stay local. Product coverage can vary by joint depth and paver shape.',
    modes: [
      {
        id: 'polymeric-sand',
        label: 'Joints',
        symbol: 'SAND',
        fields: [
          numberField('areaSquareFeet', 'Paver area ft2', '200'),
          numberField('paverLengthInches', 'Paver length inches', '8'),
          numberField('paverWidthInches', 'Paver width inches', '4'),
          numberField('jointWidthInches', 'Joint width inches', '0.25'),
          numberField('jointDepthInches', 'Joint depth inches', '1'),
          numberField('wastePercent', 'Waste percent', '10'),
          numberField('bagCoverageCubicFeet', 'Bag coverage ft3', '0.5'),
        ],
        defaultInputs: { areaSquareFeet: '200', paverLengthInches: '8', paverWidthInches: '4', jointWidthInches: '0.25', jointDepthInches: '1', wastePercent: '10', bagCoverageCubicFeet: '0.5' },
        examples: [
          { label: 'Standard paver patio', inputs: { areaSquareFeet: '200', paverLengthInches: '8', paverWidthInches: '4', jointWidthInches: '0.25', jointDepthInches: '1', wastePercent: '10', bagCoverageCubicFeet: '0.5' } },
          { label: 'Wide joints', inputs: { areaSquareFeet: '120', paverLengthInches: '6', paverWidthInches: '9', jointWidthInches: '0.375', jointDepthInches: '1.25', wastePercent: '12', bagCoverageCubicFeet: '0.45' } },
        ],
      },
    ],
  },
  'grass-seed': {
    title: 'Grass Seed Calculator',
    buttonLabel: 'Estimate seed',
    emptyHistory: 'Recent grass seed estimates will appear here.',
    privacyNote: 'Grass seed estimates stay local. Use the seed label for the right rate for your grass type.',
    modes: [
      {
        id: 'grass-seed',
        label: 'Seed',
        symbol: 'SEED',
        fields: [
          numberField('lawnAreaSquareFeet', 'Lawn area ft2', '5000'),
          numberField('seedRatePoundsPer1000SquareFeet', 'Seed rate lb per 1,000 ft2', '6'),
          numberField('wastePercent', 'Waste percent', '5'),
          numberField('bagWeightPounds', 'Bag weight lb', '20'),
          numberField('pricePerBag', 'Price per bag (optional)', '65'),
        ],
        defaultInputs: { lawnAreaSquareFeet: '5000', seedRatePoundsPer1000SquareFeet: '6', wastePercent: '5', bagWeightPounds: '20', pricePerBag: '65' },
        examples: [
          { label: 'New lawn seed', inputs: { lawnAreaSquareFeet: '5000', seedRatePoundsPer1000SquareFeet: '6', wastePercent: '5', bagWeightPounds: '20', pricePerBag: '65' } },
          { label: 'Overseeding', inputs: { lawnAreaSquareFeet: '3000', seedRatePoundsPer1000SquareFeet: '3', wastePercent: '5', bagWeightPounds: '10', pricePerBag: '' } },
        ],
      },
    ],
  },
  'lawn-mowing': {
    title: 'Lawn Mowing Calculator',
    buttonLabel: 'Estimate mowing time',
    emptyHistory: 'Recent mowing time estimates will appear here.',
    privacyNote: 'Mowing time estimates stay local and depend on real yard layout, turns, and obstacles.',
    modes: [
      {
        id: 'lawn-mowing',
        label: 'Time',
        symbol: 'MOW',
        fields: [
          numberField('lawnAreaSquareFeet', 'Lawn area ft2', '10000'),
          numberField('mowerWidthInches', 'Mower width inches', '21'),
          numberField('speedMph', 'Speed mph', '3'),
          numberField('efficiencyPercent', 'Efficiency percent', '80'),
        ],
        defaultInputs: { lawnAreaSquareFeet: '10000', mowerWidthInches: '21', speedMph: '3', efficiencyPercent: '80' },
        examples: [
          { label: 'Push mower lawn', inputs: { lawnAreaSquareFeet: '10000', mowerWidthInches: '21', speedMph: '3', efficiencyPercent: '80' } },
          { label: 'Riding mower acre', inputs: { lawnAreaSquareFeet: '43560', mowerWidthInches: '42', speedMph: '4.5', efficiencyPercent: '75' } },
        ],
      },
    ],
  },
  'plant-spacing': {
    title: 'Plant Spacing Calculator',
    buttonLabel: 'Estimate plants',
    emptyHistory: 'Recent plant spacing estimates will appear here.',
    privacyNote: 'Plant spacing estimates stay local. Plant tags and local growing conditions should guide final spacing.',
    modes: [
      {
        id: 'plant-spacing',
        label: 'Plants',
        symbol: 'BED',
        fields: [
          numberField('bedLengthFeet', 'Bed length ft', '10'),
          numberField('bedWidthFeet', 'Bed width ft', '4'),
          numberField('spacingInches', 'Plant spacing inches', '12'),
          selectField('pattern', 'Pattern', plantSpacingPatternOptions),
        ],
        defaultInputs: { bedLengthFeet: '10', bedWidthFeet: '4', spacingInches: '12', pattern: 'square' },
        examples: [
          { label: 'Square rows', inputs: { bedLengthFeet: '10', bedWidthFeet: '4', spacingInches: '12', pattern: 'square' } },
          { label: 'Staggered rows', inputs: { bedLengthFeet: '10', bedWidthFeet: '4', spacingInches: '12', pattern: 'triangular' } },
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
  'concrete-mix': {
    title: 'Concrete Mix Calculator',
    buttonLabel: 'Estimate mix',
    emptyHistory: 'Recent concrete mix estimates will appear here.',
    privacyNote: 'Concrete mix estimates stay local and use simple ratio math for planning small batches.',
    modes: [
      {
        id: 'mix-ratio',
        label: 'Mix ratio',
        symbol: 'MIX',
        fields: [
          numberField('cubicYards', 'Concrete volume yd3', '1'),
          numberField('cementParts', 'Cement parts', '1'),
          numberField('sandParts', 'Sand parts', '2'),
          numberField('gravelParts', 'Gravel parts', '3'),
          numberField('cementBagCubicFeet', 'Cement bag ft3', '1'),
          numberField('wastePercent', 'Waste percent', '10'),
        ],
        defaultInputs: { cubicYards: '1', cementParts: '1', sandParts: '2', gravelParts: '3', cementBagCubicFeet: '1', wastePercent: '10' },
        examples: [
          { label: '1 yd3, 1:2:3 mix', inputs: { cubicYards: '1', cementParts: '1', sandParts: '2', gravelParts: '3', cementBagCubicFeet: '1', wastePercent: '10' } },
          { label: 'Small 1:2:4 batch', inputs: { cubicYards: '0.25', cementParts: '1', sandParts: '2', gravelParts: '4', cementBagCubicFeet: '1', wastePercent: '8' } },
        ],
      },
    ],
  },
  'concrete-driveway': {
    title: 'Concrete Driveway Calculator',
    buttonLabel: 'Estimate driveway',
    emptyHistory: 'Recent driveway concrete estimates will appear here.',
    privacyNote: 'Driveway estimates stay local and use rectangular slab volume math.',
    modes: [
      {
        id: 'driveway-slab',
        label: 'Driveway slab',
        symbol: 'DRV',
        fields: [
          numberField('lengthFeet', 'Driveway length feet', '40'),
          numberField('widthFeet', 'Driveway width feet', '12'),
          numberField('depthInches', 'Thickness inches', '4'),
          numberField('wastePercent', 'Waste percent', '10'),
          numberField('pricePerCubicYard', 'Price per yd3', '160'),
        ],
        defaultInputs: { lengthFeet: '40', widthFeet: '12', depthInches: '4', wastePercent: '10', pricePerCubicYard: '160' },
        examples: [
          { label: 'Single-car driveway', inputs: { lengthFeet: '40', widthFeet: '12', depthInches: '4', wastePercent: '10', pricePerCubicYard: '160' } },
          { label: 'Two-car pad', inputs: { lengthFeet: '30', widthFeet: '20', depthInches: '5', wastePercent: '10', pricePerCubicYard: '155' } },
        ],
      },
    ],
  },
  'concrete-steps': {
    title: 'Concrete Steps Calculator',
    buttonLabel: 'Estimate steps',
    emptyHistory: 'Recent concrete step estimates will appear here.',
    privacyNote: 'Concrete steps estimates stay local and use a solid stair volume approximation.',
    modes: [
      {
        id: 'solid-steps',
        label: 'Solid steps',
        symbol: 'STEP',
        fields: [
          integerField('stepCount', 'Step count', '4'),
          numberField('widthFeet', 'Step width feet', '4'),
          numberField('riserHeightInches', 'Riser height inches', '7'),
          numberField('treadDepthInches', 'Tread depth inches', '11'),
          numberField('landingDepthFeet', 'Landing depth feet', '3'),
          numberField('wastePercent', 'Waste percent', '10'),
        ],
        defaultInputs: { stepCount: '4', widthFeet: '4', riserHeightInches: '7', treadDepthInches: '11', landingDepthFeet: '3', wastePercent: '10' },
        examples: [
          { label: 'Four porch steps', inputs: { stepCount: '4', widthFeet: '4', riserHeightInches: '7', treadDepthInches: '11', landingDepthFeet: '3', wastePercent: '10' } },
          { label: 'Three garden steps', inputs: { stepCount: '3', widthFeet: '5', riserHeightInches: '6', treadDepthInches: '12', landingDepthFeet: '0', wastePercent: '8' } },
        ],
      },
    ],
  },
  'concrete-weight': {
    title: 'Concrete Weight Calculator',
    buttonLabel: 'Estimate weight',
    emptyHistory: 'Recent concrete weight estimates will appear here.',
    privacyNote: 'Concrete weight estimates stay local and use the density you enter.',
    modes: [
      {
        id: 'volume-weight',
        label: 'Volume weight',
        symbol: 'WT',
        fields: [
          numberField('cubicYards', 'Concrete volume yd3', '2'),
          numberField('densityPoundsPerCubicFoot', 'Density lb/ft3', '145'),
          numberField('wastePercent', 'Waste percent', '0'),
        ],
        defaultInputs: { cubicYards: '2', densityPoundsPerCubicFoot: '145', wastePercent: '0' },
        examples: [
          { label: '2 yd3 normal concrete', inputs: { cubicYards: '2', densityPoundsPerCubicFoot: '145', wastePercent: '0' } },
          { label: 'Heavy estimate with cushion', inputs: { cubicYards: '3.5', densityPoundsPerCubicFoot: '150', wastePercent: '5' } },
        ],
      },
    ],
  },
  'concrete-reinforcing-mesh': {
    title: 'Concrete Mesh Calculator',
    buttonLabel: 'Estimate mesh',
    emptyHistory: 'Recent reinforcing mesh estimates will appear here.',
    privacyNote: 'Mesh estimates stay local and are simple area takeoffs, not structural reinforcement design.',
    modes: [
      {
        id: 'mesh-sheets',
        label: 'Mesh sheets',
        symbol: 'MESH',
        fields: [
          numberField('slabLengthFeet', 'Slab length feet', '30'),
          numberField('slabWidthFeet', 'Slab width feet', '20'),
          numberField('sheetLengthFeet', 'Sheet length feet', '10'),
          numberField('sheetWidthFeet', 'Sheet width feet', '5'),
          numberField('overlapInches', 'Overlap inches', '6'),
          numberField('wastePercent', 'Waste percent', '10'),
        ],
        defaultInputs: { slabLengthFeet: '30', slabWidthFeet: '20', sheetLengthFeet: '10', sheetWidthFeet: '5', overlapInches: '6', wastePercent: '10' },
        examples: [
          { label: '30 x 20 slab', inputs: { slabLengthFeet: '30', slabWidthFeet: '20', sheetLengthFeet: '10', sheetWidthFeet: '5', overlapInches: '6', wastePercent: '10' } },
          { label: 'Small patio mesh', inputs: { slabLengthFeet: '18', slabWidthFeet: '12', sheetLengthFeet: '10', sheetWidthFeet: '5', overlapInches: '4', wastePercent: '8' } },
        ],
      },
    ],
  },
  'concrete-block-fill': {
    title: 'Concrete Block Fill Calculator',
    buttonLabel: 'Estimate fill',
    emptyHistory: 'Recent block fill estimates will appear here.',
    privacyNote: 'Block fill estimates stay local and use the per-block fill volume you enter.',
    modes: [
      {
        id: 'block-core-fill',
        label: 'Core fill',
        symbol: 'FILL',
        fields: [
          integerField('blockCount', 'Block count', '120'),
          numberField('fillCubicFeetPerBlock', 'Fill per block ft3', '0.25'),
          numberField('wastePercent', 'Waste percent', '10'),
        ],
        defaultInputs: { blockCount: '120', fillCubicFeetPerBlock: '0.25', wastePercent: '10' },
        examples: [
          { label: '120 filled blocks', inputs: { blockCount: '120', fillCubicFeetPerBlock: '0.25', wastePercent: '10' } },
          { label: 'Small reinforced wall', inputs: { blockCount: '64', fillCubicFeetPerBlock: '0.22', wastePercent: '8' } },
        ],
      },
    ],
  },
  'retaining-wall': {
    title: 'Retaining Wall Calculator',
    buttonLabel: 'Estimate wall',
    emptyHistory: 'Recent retaining wall estimates will appear here.',
    privacyNote: 'Retaining wall estimates stay local and are material planning only, not engineering advice.',
    modes: [
      {
        id: 'segmental-wall',
        label: 'Segmental wall',
        symbol: 'WALL',
        fields: [
          numberField('wallLengthFeet', 'Wall length feet', '40'),
          numberField('wallHeightFeet', 'Wall height feet', '3'),
          numberField('blockLengthInches', 'Block length inches', '16'),
          numberField('blockHeightInches', 'Block height inches', '6'),
          numberField('capLengthInches', 'Cap length inches', '12'),
          numberField('baseDepthInches', 'Base depth inches', '6'),
          numberField('baseWidthInches', 'Base width inches', '18'),
          numberField('wastePercent', 'Waste percent', '5'),
        ],
        defaultInputs: { wallLengthFeet: '40', wallHeightFeet: '3', blockLengthInches: '16', blockHeightInches: '6', capLengthInches: '12', baseDepthInches: '6', baseWidthInches: '18', wastePercent: '5' },
        examples: [
          { label: 'Garden retaining wall', inputs: { wallLengthFeet: '40', wallHeightFeet: '3', blockLengthInches: '16', blockHeightInches: '6', capLengthInches: '12', baseDepthInches: '6', baseWidthInches: '18', wastePercent: '5' } },
          { label: 'Short landscape wall', inputs: { wallLengthFeet: '24', wallHeightFeet: '2', blockLengthInches: '12', blockHeightInches: '4', capLengthInches: '12', baseDepthInches: '4', baseWidthInches: '16', wastePercent: '8' } },
        ],
      },
    ],
  },
  'rebar-weight': {
    title: 'Rebar Weight Calculator',
    buttonLabel: 'Estimate weight',
    emptyHistory: 'Recent rebar weight estimates will appear here.',
    privacyNote: 'Rebar weight estimates stay local and use standard nominal US rebar weights.',
    modes: [
      {
        id: 'bar-weight',
        label: 'Bar weight',
        symbol: 'RBW',
        fields: [
          selectField('rebarSize', 'Rebar size', rebarSizeOptions),
          numberField('lengthFeet', 'Length per bar feet', '20'),
          integerField('quantity', 'Quantity', '12'),
          numberField('wastePercent', 'Waste percent', '10'),
        ],
        defaultInputs: { rebarSize: '#4', lengthFeet: '20', quantity: '12', wastePercent: '10' },
        examples: [
          { label: '#4 slab bars', inputs: { rebarSize: '#4', lengthFeet: '20', quantity: '12', wastePercent: '10' } },
          { label: '#5 footing bars', inputs: { rebarSize: '#5', lengthFeet: '30', quantity: '8', wastePercent: '8' } },
        ],
      },
    ],
  },
  'concrete-footing': {
    title: 'Concrete Footing Calculator',
    buttonLabel: 'Estimate footing',
    emptyHistory: 'Recent footing concrete estimates will appear here.',
    privacyNote: 'Concrete footing estimates stay local and use simple rectangular volume math.',
    modes: [
      {
        id: 'footing-volume',
        label: 'Footing',
        symbol: 'FTG',
        fields: [
          numberField('lengthFeet', 'Footing length feet', '30'),
          numberField('widthInches', 'Footing width inches', '16'),
          numberField('depthInches', 'Footing depth inches', '8'),
          numberField('wastePercent', 'Waste percent', '10'),
        ],
        defaultInputs: { lengthFeet: '30', widthInches: '16', depthInches: '8', wastePercent: '10' },
        examples: [
          { label: 'Garage footing run', inputs: { lengthFeet: '30', widthInches: '16', depthInches: '8', wastePercent: '10' } },
          { label: 'Garden wall footing', inputs: { lengthFeet: '18', widthInches: '12', depthInches: '8', wastePercent: '8' } },
        ],
      },
    ],
  },
  'concrete-column': {
    title: 'Concrete Column Calculator',
    buttonLabel: 'Estimate columns',
    emptyHistory: 'Recent concrete column estimates will appear here.',
    privacyNote: 'Concrete column estimates stay local and use cylinder volume math.',
    modes: [
      {
        id: 'round-column',
        label: 'Round column',
        symbol: 'COL',
        fields: [
          numberField('diameterInches', 'Diameter inches', '18'),
          numberField('heightFeet', 'Height feet', '8'),
          integerField('quantity', 'Quantity', '3'),
          numberField('wastePercent', 'Waste percent', '10'),
        ],
        defaultInputs: { diameterInches: '18', heightFeet: '8', quantity: '3', wastePercent: '10' },
        examples: [
          { label: 'Three round piers', inputs: { diameterInches: '18', heightFeet: '8', quantity: '3', wastePercent: '10' } },
          { label: 'Porch column bases', inputs: { diameterInches: '12', heightFeet: '3', quantity: '4', wastePercent: '8' } },
        ],
      },
    ],
  },
  'post-hole-concrete': {
    title: 'Post Hole Concrete Calculator',
    buttonLabel: 'Estimate post holes',
    emptyHistory: 'Recent post hole estimates will appear here.',
    privacyNote: 'Post hole concrete estimates stay local and subtract the post volume from each hole.',
    modes: [
      {
        id: 'post-holes',
        label: 'Post holes',
        symbol: 'POST',
        fields: [
          numberField('holeDiameterInches', 'Hole diameter inches', '12'),
          numberField('holeDepthInches', 'Hole depth inches', '30'),
          numberField('postDiameterInches', 'Post diameter inches', '4'),
          integerField('quantity', 'Hole quantity', '6'),
          numberField('wastePercent', 'Waste percent', '10'),
        ],
        defaultInputs: { holeDiameterInches: '12', holeDepthInches: '30', postDiameterInches: '4', quantity: '6', wastePercent: '10' },
        examples: [
          { label: 'Fence posts', inputs: { holeDiameterInches: '12', holeDepthInches: '30', postDiameterInches: '4', quantity: '6', wastePercent: '10' } },
          { label: 'Deck posts', inputs: { holeDiameterInches: '14', holeDepthInches: '36', postDiameterInches: '6', quantity: '4', wastePercent: '10' } },
        ],
      },
    ],
  },
  plywood: {
    title: 'Plywood Calculator',
    buttonLabel: 'Estimate plywood',
    emptyHistory: 'Recent plywood estimates will appear here.',
    privacyNote: 'Plywood estimates stay local and use sheet coverage math.',
    modes: [
      {
        id: 'sheet-count',
        label: 'Sheet count',
        symbol: 'PLY',
        fields: [
          numberField('areaSquareFeet', 'Area ft2', '420'),
          numberField('sheetWidthFeet', 'Sheet width feet', '4'),
          numberField('sheetLengthFeet', 'Sheet length feet', '8'),
          numberField('wastePercent', 'Waste percent', '10'),
          numberField('pricePerSheet', 'Price per sheet', '29.50'),
        ],
        defaultInputs: { areaSquareFeet: '420', sheetWidthFeet: '4', sheetLengthFeet: '8', wastePercent: '10', pricePerSheet: '29.50' },
        examples: [
          { label: 'Subfloor sheets', inputs: { areaSquareFeet: '420', sheetWidthFeet: '4', sheetLengthFeet: '8', wastePercent: '10', pricePerSheet: '29.50' } },
          { label: 'Small wall sheathing', inputs: { areaSquareFeet: '180', sheetWidthFeet: '4', sheetLengthFeet: '8', wastePercent: '12', pricePerSheet: '32' } },
        ],
      },
    ],
  },
  insulation: {
    title: 'Insulation Calculator',
    buttonLabel: 'Estimate insulation',
    emptyHistory: 'Recent insulation estimates will appear here.',
    privacyNote: 'Insulation estimates stay local and use area, openings, package coverage, and waste.',
    modes: [
      {
        id: 'pack-count',
        label: 'Pack count',
        symbol: 'R',
        fields: [
          numberField('areaSquareFeet', 'Area ft2', '960'),
          numberField('openingsSquareFeet', 'Openings ft2', '80'),
          numberField('coveragePerPackSquareFeet', 'Coverage per pack ft2', '40'),
          numberField('wastePercent', 'Waste percent', '10'),
          numberField('pricePerPack', 'Price per pack', '55'),
        ],
        defaultInputs: { areaSquareFeet: '960', openingsSquareFeet: '80', coveragePerPackSquareFeet: '40', wastePercent: '10', pricePerPack: '55' },
        examples: [
          { label: 'Wall insulation', inputs: { areaSquareFeet: '960', openingsSquareFeet: '80', coveragePerPackSquareFeet: '40', wastePercent: '10', pricePerPack: '55' } },
          { label: 'Attic roll coverage', inputs: { areaSquareFeet: '700', openingsSquareFeet: '20', coveragePerPackSquareFeet: '65', wastePercent: '8', pricePerPack: '62' } },
        ],
      },
    ],
  },
  countertop: {
    title: 'Countertop Calculator',
    buttonLabel: 'Estimate countertop',
    emptyHistory: 'Recent countertop estimates will appear here.',
    privacyNote: 'Countertop estimates stay local and use square-foot area math.',
    modes: [
      {
        id: 'countertop-area',
        label: 'Countertop area',
        symbol: 'TOP',
        fields: [
          numberField('lengthFeet', 'Countertop length feet', '18'),
          numberField('depthInches', 'Depth inches', '25.5'),
          numberField('backsplashLengthFeet', 'Backsplash length feet', '18'),
          numberField('backsplashHeightInches', 'Backsplash height inches', '4'),
          numberField('cutoutSquareFeet', 'Cutouts ft2', '4'),
          numberField('wastePercent', 'Waste percent', '10'),
          numberField('pricePerSquareFoot', 'Price per ft2', '75'),
        ],
        defaultInputs: { lengthFeet: '18', depthInches: '25.5', backsplashLengthFeet: '18', backsplashHeightInches: '4', cutoutSquareFeet: '4', wastePercent: '10', pricePerSquareFoot: '75' },
        examples: [
          { label: 'Kitchen run', inputs: { lengthFeet: '18', depthInches: '25.5', backsplashLengthFeet: '18', backsplashHeightInches: '4', cutoutSquareFeet: '4', wastePercent: '10', pricePerSquareFoot: '75' } },
          { label: 'Bathroom vanity', inputs: { lengthFeet: '6', depthInches: '22', backsplashLengthFeet: '6', backsplashHeightInches: '4', cutoutSquareFeet: '2', wastePercent: '8', pricePerSquareFoot: '60' } },
        ],
      },
    ],
  },
  sod: {
    title: 'Sod Calculator',
    buttonLabel: 'Estimate sod',
    emptyHistory: 'Recent sod estimates will appear here.',
    privacyNote: 'Sod estimates stay local and use lawn area, roll coverage, pallet size, and waste.',
    modes: [
      {
        id: 'roll-count',
        label: 'Roll count',
        symbol: 'SOD',
        fields: [
          numberField('lawnAreaSquareFeet', 'Lawn area ft2', '1800'),
          numberField('rollCoverageSquareFeet', 'Coverage per roll ft2', '10'),
          integerField('rollsPerPallet', 'Rolls per pallet', '50'),
          numberField('wastePercent', 'Waste percent', '5'),
          numberField('pricePerRoll', 'Price per roll', '4.50'),
        ],
        defaultInputs: { lawnAreaSquareFeet: '1800', rollCoverageSquareFeet: '10', rollsPerPallet: '50', wastePercent: '5', pricePerRoll: '4.50' },
        examples: [
          { label: 'Front lawn', inputs: { lawnAreaSquareFeet: '1800', rollCoverageSquareFeet: '10', rollsPerPallet: '50', wastePercent: '5', pricePerRoll: '4.50' } },
          { label: 'Small repair patch', inputs: { lawnAreaSquareFeet: '220', rollCoverageSquareFeet: '10', rollsPerPallet: '50', wastePercent: '8', pricePerRoll: '5' } },
        ],
      },
    ],
  },
  'wall-stud': {
    title: 'Wall Stud Calculator',
    buttonLabel: 'Estimate studs',
    emptyHistory: 'Recent wall stud estimates will appear here.',
    privacyNote: 'Wall stud estimates stay local and are simple layout counts, not structural framing plans.',
    modes: [
      {
        id: 'stud-count',
        label: 'Stud count',
        symbol: 'STUD',
        fields: [
          numberField('wallLengthFeet', 'Wall length feet', '24'),
          numberField('wallHeightFeet', 'Wall height feet', '8'),
          numberField('spacingInches', 'Stud spacing inches', '16'),
          integerField('openingsCount', 'Openings', '2'),
          integerField('extraCornerStuds', 'Extra corner studs', '4'),
          integerField('plates', 'Plate rows', '2'),
          numberField('boardLengthFeet', 'Board length feet', '8'),
          numberField('wastePercent', 'Waste percent', '10'),
        ],
        defaultInputs: { wallLengthFeet: '24', wallHeightFeet: '8', spacingInches: '16', openingsCount: '2', extraCornerStuds: '4', plates: '2', boardLengthFeet: '8', wastePercent: '10' },
        examples: [
          { label: 'Interior wall', inputs: { wallLengthFeet: '24', wallHeightFeet: '8', spacingInches: '16', openingsCount: '2', extraCornerStuds: '4', plates: '2', boardLengthFeet: '8', wastePercent: '10' } },
          { label: 'Garage wall', inputs: { wallLengthFeet: '32', wallHeightFeet: '9', spacingInches: '16', openingsCount: '1', extraCornerStuds: '6', plates: '3', boardLengthFeet: '10', wastePercent: '10' } },
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
    privacyNote: 'Asphalt estimates stay local and are rough planning numbers, not paving specs or quotes.',
    modes: [
      {
        id: 'asphalt-volume',
        label: 'Area and depth',
        symbol: 'ASPH',
        fields: [
          numberField('lengthFeet', 'Length feet', '30'),
          numberField('widthFeet', 'Width feet', '12'),
          numberField('depthInches', 'Compacted depth inches', '3'),
          numberField('tonsPerCubicYard', 'Tons per yd3', '2'),
          numberField('wastePercent', 'Waste percent', '5'),
        ],
        defaultInputs: { lengthFeet: '30', widthFeet: '12', depthInches: '3', tonsPerCubicYard: '2', wastePercent: '5' },
        examples: [
          { label: 'Driveway section', inputs: { lengthFeet: '30', widthFeet: '12', depthInches: '3', tonsPerCubicYard: '2', wastePercent: '5' } },
          { label: 'Parking pad', inputs: { lengthFeet: '20', widthFeet: '18', depthInches: '4', tonsPerCubicYard: '2', wastePercent: '8' } },
          { label: 'Thin overlay', inputs: { lengthFeet: '40', widthFeet: '10', depthInches: '2', tonsPerCubicYard: '2', wastePercent: '5' } },
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
    privacyNote: 'Names stay in your browser tab. Use nicknames or initials if you want; this is a game, not relationship advice.',
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
          { label: 'Emoji check', inputs: { text: 'Launch day notes: calculators, converters, and design tools 🙂' } },
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
  'recipe-scaler': {
    title: 'Recipe Scaler',
    buttonLabel: 'Scale recipe',
    emptyHistory: 'Recent recipe scaling results will appear here.',
    privacyNote: 'Recipe scaling runs in your browser. It scales math only and cannot judge taste, texture, oven size, or food safety.',
    modes: [
      {
        id: 'scale',
        label: 'Scale',
        symbol: 'x',
        fields: [
          textField('ingredientName', 'Ingredient name', 'Flour'),
          numberField('amount', 'Original amount'),
          textField('unit', 'Unit', 'cups'),
          numberField('originalServings', 'Original servings'),
          numberField('desiredServings', 'Desired servings'),
        ],
        defaultInputs: { ingredientName: 'Flour', amount: '2', unit: 'cups', originalServings: '4', desiredServings: '10' },
        examples: [
          { label: 'Dinner for 10', inputs: { ingredientName: 'Flour', amount: '2', unit: 'cups', originalServings: '4', desiredServings: '10' } },
          { label: 'Half batch', inputs: { ingredientName: 'Sugar', amount: '300', unit: 'grams', originalServings: '12', desiredServings: '6' } },
          { label: 'Party tray', inputs: { ingredientName: 'Eggs', amount: '3', unit: 'eggs', originalServings: '8', desiredServings: '20' } },
        ],
      },
    ],
  },
  'cooking-measurement-converter': {
    title: 'Cooking Measurement Converter',
    buttonLabel: 'Convert cooking amount',
    emptyHistory: 'Recent cooking conversions will appear here.',
    privacyNote: 'Cooking conversions stay local. Volume-to-weight conversions use the density you enter and are approximate.',
    modes: [
      {
        id: 'convert',
        label: 'Convert',
        symbol: 'CUP',
        fields: [
          numberField('amount', 'Amount'),
          selectField('fromUnit', 'From unit', cookingMeasurementUnitOptions),
          selectField('toUnit', 'To unit', cookingMeasurementUnitOptions),
          numberField('densityGramsPerCup', 'Density grams per cup'),
        ],
        defaultInputs: { amount: '2', fromUnit: 'cup', toUnit: 'gram', densityGramsPerCup: '120' },
        examples: [
          { label: 'Flour cups to grams', inputs: { amount: '2', fromUnit: 'cup', toUnit: 'gram', densityGramsPerCup: '120' } },
          { label: 'Milk mL to cups', inputs: { amount: '500', fromUnit: 'milliliter', toUnit: 'cup', densityGramsPerCup: '245' } },
          { label: 'Butter ounces to grams', inputs: { amount: '4', fromUnit: 'ounce', toUnit: 'gram', densityGramsPerCup: '227' } },
        ],
      },
    ],
  },
  'ingredient-cost-calculator': {
    title: 'Ingredient Cost Calculator',
    buttonLabel: 'Calculate ingredient cost',
    emptyHistory: 'Recent ingredient cost estimates will appear here.',
    privacyNote: 'Ingredient cost math stays in this browser. Prices, taxes, coupons, and package sizes can change.',
    modes: [
      {
        id: 'ingredient-cost',
        label: 'Ingredient cost',
        symbol: '$/ING',
        fields: [
          numberField('amountNeeded', 'Amount needed'),
          selectField('neededUnit', 'Needed unit', cookingMeasurementUnitOptions),
          numberField('packageAmount', 'Package amount'),
          selectField('packageUnit', 'Package unit', cookingMeasurementUnitOptions),
          numberField('packagePrice', 'Package price'),
          numberField('densityGramsPerCup', 'Density grams per cup'),
        ],
        defaultInputs: { amountNeeded: '2', neededUnit: 'cup', packageAmount: '5', packageUnit: 'pound', packagePrice: '4.49', densityGramsPerCup: '120' },
        examples: [
          { label: 'Flour for recipe', inputs: { amountNeeded: '2', neededUnit: 'cup', packageAmount: '5', packageUnit: 'pound', packagePrice: '4.49', densityGramsPerCup: '120' } },
          { label: 'Chocolate chips', inputs: { amountNeeded: '170', neededUnit: 'gram', packageAmount: '12', packageUnit: 'ounce', packagePrice: '3.99', densityGramsPerCup: '170' } },
          { label: 'Milk in batter', inputs: { amountNeeded: '250', neededUnit: 'milliliter', packageAmount: '1', packageUnit: 'gallon', packagePrice: '4.20', densityGramsPerCup: '245' } },
        ],
      },
    ],
  },
  'unit-price-calculator': {
    title: 'Unit Price Calculator',
    buttonLabel: 'Compare unit prices',
    emptyHistory: 'Recent unit price comparisons will appear here.',
    privacyNote: 'Unit price comparisons stay local. Check sale tags, taxes, membership prices, and package size labels before buying.',
    modes: [
      {
        id: 'compare',
        label: 'Compare',
        symbol: '$/U',
        fields: [
          textField('itemAName', 'Item A name', 'Small box'),
          numberField('itemAPrice', 'Item A price'),
          numberField('itemAQuantity', 'Item A quantity'),
          textField('itemBName', 'Item B name', 'Large box'),
          numberField('itemBPrice', 'Item B price'),
          numberField('itemBQuantity', 'Item B quantity'),
          textField('unit', 'Shared unit', 'oz'),
        ],
        defaultInputs: { itemAName: 'Small cereal', itemAPrice: '4.49', itemAQuantity: '12', itemBName: 'Family cereal', itemBPrice: '6.99', itemBQuantity: '21', unit: 'oz' },
        examples: [
          { label: 'Cereal boxes', inputs: { itemAName: 'Small cereal', itemAPrice: '4.49', itemAQuantity: '12', itemBName: 'Family cereal', itemBPrice: '6.99', itemBQuantity: '21', unit: 'oz' } },
          { label: 'Paper towels', inputs: { itemAName: 'Pack A', itemAPrice: '8.99', itemAQuantity: '6', itemBName: 'Pack B', itemBPrice: '12.49', itemBQuantity: '10', unit: 'roll' } },
          { label: 'Pet food', inputs: { itemAName: 'Bag A', itemAPrice: '18.99', itemAQuantity: '8', itemBName: 'Bag B', itemBPrice: '35.99', itemBQuantity: '18', unit: 'lb' } },
        ],
      },
    ],
  },
  'cost-per-serving-calculator': {
    title: 'Cost Per Serving Calculator',
    buttonLabel: 'Calculate cost per serving',
    emptyHistory: 'Recent serving cost estimates will appear here.',
    privacyNote: 'Serving cost estimates stay local and are only as accurate as the costs and serving count you enter.',
    modes: [
      {
        id: 'serving-cost',
        label: 'Serving cost',
        symbol: '$/S',
        fields: [
          textField('foodName', 'Recipe or item name', 'Soup'),
          numberField('totalCost', 'Main cost'),
          numberField('extraCost', 'Extra cost'),
          numberField('servings', 'Servings'),
        ],
        defaultInputs: { foodName: 'Soup', totalCost: '18.50', extraCost: '2.00', servings: '8' },
        examples: [
          { label: 'Soup batch', inputs: { foodName: 'Soup', totalCost: '18.50', extraCost: '2.00', servings: '8' } },
          { label: 'Meal prep', inputs: { foodName: 'Chicken bowls', totalCost: '42', extraCost: '0', servings: '10' } },
          { label: 'Bake sale', inputs: { foodName: 'Cupcakes', totalCost: '15.75', extraCost: '3.25', servings: '24' } },
        ],
      },
    ],
  },
  'oven-temperature-converter': {
    title: 'Oven Temperature Converter',
    buttonLabel: 'Convert oven temperature',
    emptyHistory: 'Recent oven temperature conversions will appear here.',
    privacyNote: 'Oven temperature conversion stays local. This does not replace food safety temperature guidance.',
    modes: [
      {
        id: 'oven-temp',
        label: 'Oven temp',
        symbol: 'F/C',
        fields: [
          numberField('temperature', 'Temperature'),
          selectField('unit', 'Unit', ovenTemperatureUnitOptions),
        ],
        defaultInputs: { temperature: '350', unit: 'fahrenheit' },
        examples: [
          { label: 'Common bake temp', inputs: { temperature: '350', unit: 'fahrenheit' } },
          { label: 'Celsius recipe', inputs: { temperature: '180', unit: 'celsius' } },
          { label: 'Gas mark recipe', inputs: { temperature: '4', unit: 'gas-mark' } },
        ],
      },
    ],
  },
  'butter-converter': {
    title: 'Butter Converter',
    buttonLabel: 'Convert butter',
    emptyHistory: 'Recent butter conversions will appear here.',
    privacyNote: 'Butter conversions stay local. Stick size and package labeling can vary outside common US packaging.',
    modes: [
      {
        id: 'butter',
        label: 'Butter',
        symbol: 'TBSP',
        fields: [
          numberField('amount', 'Amount'),
          selectField('unit', 'Unit', butterUnitOptions),
        ],
        defaultInputs: { amount: '1', unit: 'stick' },
        examples: [
          { label: 'One stick', inputs: { amount: '1', unit: 'stick' } },
          { label: 'Half cup', inputs: { amount: '0.5', unit: 'cup' } },
          { label: 'Metric recipe', inputs: { amount: '115', unit: 'gram' } },
        ],
      },
    ],
  },
  'baking-pan-conversion-calculator': {
    title: 'Baking Pan Conversion Calculator',
    buttonLabel: 'Scale pan size',
    emptyHistory: 'Recent pan conversions will appear here.',
    privacyNote: 'Pan scaling stays local. Bake time, batter depth, and texture still need real kitchen judgment.',
    modes: [
      {
        id: 'pan-scale',
        label: 'Pan scale',
        symbol: 'PAN',
        fields: [
          numberField('oldLengthInches', 'Old pan length (in)'),
          numberField('oldWidthInches', 'Old pan width (in)'),
          numberField('newLengthInches', 'New pan length (in)'),
          numberField('newWidthInches', 'New pan width (in)'),
          numberField('originalServings', 'Original servings (optional)', 'Optional'),
        ],
        defaultInputs: { oldLengthInches: '9', oldWidthInches: '13', newLengthInches: '8', newWidthInches: '8', originalServings: '12' },
        examples: [
          { label: '9x13 to 8x8', inputs: { oldLengthInches: '9', oldWidthInches: '13', newLengthInches: '8', newWidthInches: '8', originalServings: '12' } },
          { label: '8x8 to 9x13', inputs: { oldLengthInches: '8', oldWidthInches: '8', newLengthInches: '9', newWidthInches: '13', originalServings: '9' } },
          { label: 'Sheet pan change', inputs: { oldLengthInches: '13', oldWidthInches: '18', newLengthInches: '11', newWidthInches: '15', originalServings: '' } },
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
  if (hours > 0) return `${sign}${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${sign}${minutes}m ${seconds}s`;
  return `${sign}${seconds}s`;
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
          result.childSex === 'male'
            ? 'Add 5 inches to the parent-height total for a male estimate, then divide by 2.'
            : 'Subtract 5 inches from the parent-height total for a female estimate, then divide by 2.',
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
    case 'watts-to-amps': {
      const result = calculateWattsToAmps({
        watts: parseNumber(inputs.watts, 'Watts'),
        volts: parseNumber(inputs.volts, 'Volts'),
        phase: (inputs.phase || 'dc') as ElectricalPowerPhase,
        powerFactor: parseNumber(inputs.powerFactor, 'Power factor'),
      });
      return {
        label: 'Estimated current',
        expression: `${formatCalculatorNumber(result.watts)} W at ${formatCalculatorNumber(result.volts)} V`,
        answer: `${formatCalculatorNumber(result.amps)} A`,
        metrics: [
          { label: 'Phase factor', value: formatCalculatorNumber(result.phaseFactor) },
          { label: 'Power factor', value: formatCalculatorNumber(result.powerFactor) },
          { label: 'Power', value: `${formatCalculatorNumber(result.watts)} W` },
        ],
        steps: [
          'Choose the formula based on DC, single-phase AC, or three-phase AC.',
          'Multiply voltage by the phase factor and power factor.',
          'Divide watts by that adjusted voltage value to estimate amps.',
        ],
        note: 'This is formula math only. Real electrical loads need correct voltage, power factor, breaker, wire, code, and professional review.',
      };
    }
    case 'amps-to-watts': {
      const result = calculateAmpsToWatts({
        amps: parseNumber(inputs.amps, 'Amps'),
        volts: parseNumber(inputs.volts, 'Volts'),
        phase: (inputs.phase || 'dc') as ElectricalPowerPhase,
        powerFactor: parseNumber(inputs.powerFactor, 'Power factor'),
      });
      return {
        label: 'Estimated power',
        expression: `${formatCalculatorNumber(result.amps)} A at ${formatCalculatorNumber(result.volts)} V`,
        answer: `${formatCalculatorNumber(result.watts)} W`,
        metrics: [
          { label: 'Kilowatts', value: `${formatCalculatorNumber(result.kilowatts)} kW` },
          { label: 'Phase factor', value: formatCalculatorNumber(result.phaseFactor) },
          { label: 'Power factor', value: formatCalculatorNumber(result.powerFactor) },
        ],
        steps: [
          'Choose the formula based on DC, single-phase AC, or three-phase AC.',
          'Multiply amps by volts, phase factor, and power factor.',
          'Divide watts by 1,000 to show kilowatts too.',
        ],
        note: 'This is a simplified electrical estimate. Use rated equipment data and qualified advice before sizing circuits or parts.',
      };
    }
    case 'kilowatts-to-amps': {
      const result = calculateKilowattsToAmps({
        kilowatts: parseNumber(inputs.kilowatts, 'Kilowatts'),
        volts: parseNumber(inputs.volts, 'Volts'),
        phase: (inputs.phase || 'single-phase') as ElectricalPowerPhase,
        powerFactor: parseNumber(inputs.powerFactor, 'Power factor'),
        efficiencyPercent: parseNumber(inputs.efficiencyPercent, 'Efficiency'),
      });
      return {
        label: 'Estimated current',
        expression: `${formatCalculatorNumber(result.kilowatts)} kW at ${formatCalculatorNumber(result.volts)} V`,
        answer: `${formatCalculatorNumber(result.amps)} A`,
        metrics: [
          { label: 'Input watts after efficiency', value: `${formatCalculatorNumber(result.inputWatts)} W` },
          { label: 'Power factor', value: formatCalculatorNumber(result.powerFactor) },
          { label: 'Efficiency', value: percent(result.efficiencyPercent) },
        ],
        steps: [
          'Convert kilowatts to watts.',
          'Account for efficiency when the output kW needs more input power.',
          'Divide by voltage, phase factor, and power factor to estimate current.',
        ],
        note: 'Motors and AC equipment can behave differently while starting. Use equipment nameplates and professional electrical sizing for real installs.',
      };
    }
    case 'kva-to-amps': {
      const result = calculateKilovoltAmpsToAmps({
        kilovoltAmps: parseNumber(inputs.kilovoltAmps, 'kVA'),
        volts: parseNumber(inputs.volts, 'Volts'),
        phase: (inputs.phase || 'single-phase') as 'single-phase' | 'three-phase',
      });
      return {
        label: 'Estimated current',
        expression: `${formatCalculatorNumber(result.kilovoltAmps)} kVA at ${formatCalculatorNumber(result.volts)} V`,
        answer: `${formatCalculatorNumber(result.amps)} A`,
        metrics: [
          { label: 'Volt-amps', value: `${formatCalculatorNumber(result.kilovoltAmps * 1000)} VA` },
          { label: 'Phase', value: result.phase === 'three-phase' ? 'Three-phase' : 'Single-phase' },
          { label: 'Phase factor', value: formatCalculatorNumber(result.phaseFactor) },
        ],
        steps: [
          'Convert kVA to volt-amps.',
          'Use volts for single-phase, or volts times square root of 3 for three-phase.',
          'Divide volt-amps by that voltage factor to estimate amps.',
        ],
        note: 'kVA is apparent power. Transformer, UPS, breaker, and conductor sizing still need the equipment instructions and qualified review.',
      };
    }
    case 'amp-hours-to-watt-hours': {
      const result = calculateAmpHoursToWattHours({
        ampHours: parseNumber(inputs.ampHours, 'Amp-hours'),
        volts: parseNumber(inputs.volts, 'Volts'),
      });
      return {
        label: 'Estimated energy',
        expression: `${formatCalculatorNumber(result.ampHours)} Ah at ${formatCalculatorNumber(result.volts)} V`,
        answer: `${formatCalculatorNumber(result.wattHours)} Wh`,
        metrics: [
          { label: 'Kilowatt-hours', value: `${formatCalculatorNumber(result.kilowattHours)} kWh` },
          { label: 'Amp-hours', value: `${formatCalculatorNumber(result.ampHours)} Ah` },
          { label: 'Voltage', value: `${formatCalculatorNumber(result.volts)} V` },
        ],
        steps: [
          'Use nominal battery voltage.',
          'Multiply amp-hours by volts to estimate watt-hours.',
          'Divide watt-hours by 1,000 to show kilowatt-hours.',
        ],
        note: 'Battery labels are nominal. Real usable energy changes with chemistry, discharge rate, temperature, age, and conversion losses.',
      };
    }
    case 'watt-hours-to-amp-hours': {
      const result = calculateWattHoursToAmpHours({
        wattHours: parseNumber(inputs.wattHours, 'Watt-hours'),
        volts: parseNumber(inputs.volts, 'Volts'),
      });
      return {
        label: 'Estimated capacity',
        expression: `${formatCalculatorNumber(result.wattHours)} Wh at ${formatCalculatorNumber(result.volts)} V`,
        answer: `${formatCalculatorNumber(result.ampHours)} Ah`,
        metrics: [
          { label: 'Watt-hours', value: `${formatCalculatorNumber(result.wattHours)} Wh` },
          { label: 'Voltage', value: `${formatCalculatorNumber(result.volts)} V` },
          { label: 'Formula', value: 'Wh / V' },
        ],
        steps: [
          'Start with battery energy in watt-hours.',
          'Use nominal battery voltage.',
          'Divide watt-hours by volts to estimate amp-hours.',
        ],
        note: 'Amp-hour ratings depend on voltage. Two batteries can have the same Ah label but very different stored energy.',
      };
    }
    case 'wire-resistance': {
      const result = calculateWireResistanceEstimate({
        wireGauge: inputs.wireGauge || '12',
        oneWayLengthFeet: parseNumber(inputs.oneWayLengthFeet, 'One-way length'),
        conductorCount: parseNumber(inputs.conductorCount, 'Conductor count'),
      });
      return {
        label: 'Estimated wire resistance',
        expression: `${result.wireGauge} AWG copper, ${formatCalculatorNumber(result.oneWayLengthFeet)} ft`,
        answer: `${formatCalculatorNumber(result.totalResistanceOhms)} ohms`,
        metrics: [
          { label: 'One-way resistance', value: `${formatCalculatorNumber(result.oneWayResistanceOhms)} ohms` },
          { label: 'Resistance table value', value: `${formatCalculatorNumber(result.resistanceOhmsPer1000Feet)} ohms / 1000 ft` },
          { label: 'Conductor count', value: formatCalculatorNumber(result.conductorCount) },
        ],
        steps: [
          'Look up the approximate copper resistance for the chosen AWG size.',
          'Scale the ohms-per-1,000-feet value by the one-way length.',
          'Multiply by the conductor count to estimate the total resistance included.',
        ],
        note: 'This is a simplified copper resistance estimate. Temperature, strand type, material, connections, and code rules can change real behavior.',
      };
    }
    case 'wire-size': {
      const result = calculateWireSizeEstimate({
        sourceVoltage: parseNumber(inputs.sourceVoltage, 'Source voltage'),
        currentAmps: parseNumber(inputs.currentAmps, 'Current'),
        oneWayLengthFeet: parseNumber(inputs.oneWayLengthFeet, 'One-way length'),
        maxVoltageDropPercent: parseNumber(inputs.maxVoltageDropPercent, 'Max voltage drop'),
        phase: (inputs.phase || 'single') as 'single' | 'three',
      });
      return {
        label: 'Estimated copper wire size',
        expression: `${formatCalculatorNumber(result.currentAmps)} A over ${formatCalculatorNumber(result.oneWayLengthFeet)} ft`,
        answer: `${result.recommendedWireGauge} AWG copper`,
        metrics: [
          { label: 'Estimated drop', value: `${formatCalculatorNumber(result.voltageDrop)} V` },
          { label: 'Percent drop', value: percent(result.percentDrop) },
          { label: 'Estimated load voltage', value: `${formatCalculatorNumber(result.loadVoltage)} V` },
          { label: 'Resistance table value', value: `${formatCalculatorNumber(result.resistanceOhmsPer1000Feet)} ohms / 1000 ft` },
        ],
        steps: [
          'Try common copper AWG sizes from smaller to larger.',
          'Estimate voltage drop for each size with the chosen circuit type.',
          'Return the first size that stays within the maximum voltage-drop percentage.',
        ],
        note: 'This is not a code-complete wire sizing tool. Ampacity, insulation rating, terminals, raceway, temperature, material, and local code must be checked separately.',
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
          result.mode === 'wake-up'
            ? 'Count backward from wake-up time by sleep cycles and your fall-asleep buffer.'
            : 'Count forward from bedtime by sleep cycles and your fall-asleep buffer.',
          'Wrap around midnight when needed.',
        ],
        note: 'Adults commonly need at least 7 hours of sleep. If you keep waking tired, sleep quality and health context matter more than cycle math.',
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
      const lowSlopeNote = result.lowSlopeWarning ? `${result.lowSlopeWarning} ` : '';
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
        note: `${lowSlopeNote}This is a rough planning number. Product wrapper coverage, ridge cap, starter strips, low-slope rules, safe access, and contractor measurement can change the real order.`,
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
        pricePerRoll: parseOptionalNumber(inputs.pricePerRoll ?? '', 'Price per roll'),
      });
      return {
        label: 'Wallpaper rolls',
        expression: `${formatCalculatorNumber(result.roomLengthFeet)} ft x ${formatCalculatorNumber(result.roomWidthFeet)} ft room, ${formatCalculatorNumber(result.wallHeightFeet)} ft walls`,
        answer: `${formatCalculatorNumber(result.rollsNeeded)} rolls`,
        metrics: [
          { label: 'Wallpaper area', value: `${formatCalculatorNumber(result.wallpaperSquareFeet)} ft2` },
          { label: 'Area with waste', value: `${formatCalculatorNumber(result.adjustedSquareFeet)} ft2` },
          { label: 'Roll coverage', value: `${formatCalculatorNumber(result.rollCoverageSquareFeet)} ft2` },
          { label: 'Estimated cost', value: result.estimatedCost === null ? 'Add price per roll' : money(result.estimatedCost) },
        ],
        steps: [
          'Find wall area from room perimeter times wall height.',
          'Subtract estimated doors and windows.',
          'Add waste, divide by roll coverage, and round up to whole rolls.',
          'Multiply rolls by price per roll when a price is entered.',
        ],
        note: 'Pattern repeat, usable roll yield, odd walls, returns, and batch numbers can change the real order.',
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
    case 'deck-board': {
      const result = calculateDeckBoardEstimate({
        deckLengthFeet: parseNumber(inputs.deckLengthFeet, 'Deck length'),
        deckWidthFeet: parseNumber(inputs.deckWidthFeet, 'Deck width'),
        boardLengthFeet: parseNumber(inputs.boardLengthFeet, 'Board length'),
        boardWidthInches: parseNumber(inputs.boardWidthInches, 'Board width'),
        joistSpacingInches: parseNumber(inputs.joistSpacingInches, 'Joist spacing'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
        pricePerBoard: parseOptionalNumber(inputs.pricePerBoard ?? '', 'Price per board'),
      });
      return {
        label: 'Deck boards needed',
        expression: `${formatCalculatorNumber(result.deckLengthFeet)} x ${formatCalculatorNumber(result.deckWidthFeet)} ft deck`,
        answer: `${formatCalculatorNumber(result.boardsNeeded)} boards`,
        metrics: [
          { label: 'Adjusted deck area', value: `${formatCalculatorNumber(result.adjustedDeckAreaSquareFeet)} ft2` },
          { label: 'Fastener rows', value: formatCalculatorNumber(result.joistCount) },
          { label: 'Deck screws estimate', value: formatCalculatorNumber(result.deckScrews) },
          { label: 'Estimated board cost', value: result.estimatedCost === null ? 'Add price per board' : money(result.estimatedCost) },
        ],
        steps: [
          'Multiply deck length by width for deck surface area.',
          'Add waste and divide by each board coverage.',
          'Use joist spacing to estimate fastener rows and screw count.',
        ],
        note: 'Board layout, gaps, picture frames, breaker boards, stair boards, hidden fastener systems, and local code can change the final order.',
      };
    }
    case 'deck-stain': {
      const result = calculateDeckStainEstimate({
        deckLengthFeet: parseNumber(inputs.deckLengthFeet, 'Deck length'),
        deckWidthFeet: parseNumber(inputs.deckWidthFeet, 'Deck width'),
        railingLengthFeet: parseNumber(inputs.railingLengthFeet, 'Railing length'),
        railingHeightFeet: parseNumber(inputs.railingHeightFeet, 'Railing height'),
        stepCount: parseNumber(inputs.stepCount, 'Step count'),
        stepWidthFeet: parseNumber(inputs.stepWidthFeet, 'Step width'),
        stepDepthInches: parseNumber(inputs.stepDepthInches, 'Step depth'),
        riserHeightInches: parseNumber(inputs.riserHeightInches, 'Riser height'),
        coats: parseNumber(inputs.coats, 'Coats'),
        coverageSquareFeetPerGallon: parseNumber(inputs.coverageSquareFeetPerGallon, 'Coverage per gallon'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
        pricePerGallon: parseOptionalNumber(inputs.pricePerGallon ?? '', 'Price per gallon'),
      });
      return {
        label: 'Deck stain needed',
        expression: `${formatCalculatorNumber(result.totalSurfaceSquareFeet)} ft2 surface, ${formatCalculatorNumber(result.coats)} coat(s)`,
        answer: `${formatCalculatorNumber(result.gallonsToBuy)} gal`,
        metrics: [
          { label: 'Surface with waste', value: `${formatCalculatorNumber(result.adjustedSurfaceSquareFeet)} ft2` },
          { label: 'Coat-adjusted area', value: `${formatCalculatorNumber(result.coatAdjustedSquareFeet)} ft2` },
          { label: 'Exact gallons', value: formatCalculatorNumber(result.gallonsNeeded) },
          { label: 'Estimated stain cost', value: result.estimatedCost === null ? 'Add price per gallon' : money(result.estimatedCost) },
        ],
        steps: [
          'Add deck surface, railing faces, and stair tread/riser area.',
          'Add waste, then multiply by coat count.',
          'Divide by label coverage and round up to whole gallons.',
        ],
        note: 'Older wood, rough boards, sprayers, rail details, product solids, weather, and prep work can change real coverage.',
      };
    }
    case 'baluster': {
      const result = calculateBalusterEstimate({
        railLengthFeet: parseNumber(inputs.railLengthFeet, 'Rail length'),
        postWidthInches: parseNumber(inputs.postWidthInches, 'Post width'),
        postCount: parseNumber(inputs.postCount, 'Post count'),
        balusterWidthInches: parseNumber(inputs.balusterWidthInches, 'Baluster width'),
        maxSpacingInches: parseNumber(inputs.maxSpacingInches, 'Max spacing'),
      });
      return {
        label: 'Balusters needed',
        expression: `${formatCalculatorNumber(result.openingLengthInches)} in clear opening`,
        answer: `${formatCalculatorNumber(result.balustersNeeded)} balusters`,
        metrics: [
          { label: 'Actual open spacing', value: `${formatCalculatorNumber(result.actualSpacingInches)} in` },
          { label: 'Baluster width used', value: `${formatCalculatorNumber(result.totalBalusterWidthInches)} in` },
          { label: 'Max spacing entered', value: `${formatCalculatorNumber(result.maxSpacingInches)} in` },
        ],
        steps: [
          'Subtract post widths from the measured rail run.',
          'Fit balusters so each opening is at or below the max spacing.',
          'Recalculate the actual equal spacing between balusters.',
        ],
        note: 'Building codes often have strict guard and stair rules. Treat this as layout math, then check your local code.',
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
    case 'paver-base': {
      const result = calculatePaverBaseEstimate({
        areaSquareFeet: parseNumber(inputs.areaSquareFeet, 'Area'),
        baseDepthInches: parseNumber(inputs.baseDepthInches, 'Base depth'),
        beddingDepthInches: parseNumber(inputs.beddingDepthInches, 'Bedding depth'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
        baseTonsPerCubicYard: parseNumber(inputs.baseTonsPerCubicYard, 'Base tons per cubic yard'),
      });
      return {
        label: 'Paver base needed',
        expression: `${formatCalculatorNumber(result.areaSquareFeet)} ft2 area`,
        answer: `${formatCalculatorNumber(result.baseCubicYards)} yd3 base`,
        metrics: [
          { label: 'Base tons', value: `${formatCalculatorNumber(result.baseTons)} tons` },
          { label: 'Base cubic feet', value: `${formatCalculatorNumber(result.baseCubicFeet)} ft3` },
          { label: 'Bedding sand', value: `${formatCalculatorNumber(result.beddingCubicYards)} yd3` },
        ],
        steps: [
          'Multiply area by base depth to get base volume.',
          'Add waste and convert cubic feet to cubic yards.',
          'Multiply cubic yards by tons per cubic yard for base weight.',
        ],
        note: 'Base depth, compaction, soil, drainage, traffic load, edge restraints, and local practice can change the right base design.',
      };
    }
    case 'polymeric-sand': {
      const result = calculatePolymericSandEstimate({
        areaSquareFeet: parseNumber(inputs.areaSquareFeet, 'Area'),
        paverLengthInches: parseNumber(inputs.paverLengthInches, 'Paver length'),
        paverWidthInches: parseNumber(inputs.paverWidthInches, 'Paver width'),
        jointWidthInches: parseNumber(inputs.jointWidthInches, 'Joint width'),
        jointDepthInches: parseNumber(inputs.jointDepthInches, 'Joint depth'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
        bagCoverageCubicFeet: parseNumber(inputs.bagCoverageCubicFeet, 'Bag coverage'),
      });
      return {
        label: 'Polymeric sand needed',
        expression: `${formatCalculatorNumber(result.areaSquareFeet)} ft2, ${formatCalculatorNumber(result.jointWidthInches)} in joints`,
        answer: `${formatCalculatorNumber(result.bagsNeeded)} bags`,
        metrics: [
          { label: 'Estimated pavers', value: formatCalculatorNumber(result.estimatedPavers) },
          { label: 'Sand volume with waste', value: `${formatCalculatorNumber(result.cubicFeet)} ft3` },
          { label: 'Raw joint volume', value: `${formatCalculatorNumber(result.rawCubicFeet)} ft3` },
        ],
        steps: [
          'Estimate paver count from area and paver size.',
          'Estimate joint volume from paver edges, joint width, and joint depth.',
          'Add waste and divide by bag coverage.',
        ],
        note: 'Irregular pavers, wide joints, deep joints, product coverage, old joint cleanup, and installation method can change the bag count.',
      };
    }
    case 'grass-seed': {
      const result = calculateGrassSeedEstimate({
        lawnAreaSquareFeet: parseNumber(inputs.lawnAreaSquareFeet, 'Lawn area'),
        seedRatePoundsPer1000SquareFeet: parseNumber(inputs.seedRatePoundsPer1000SquareFeet, 'Seed rate'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
        bagWeightPounds: parseNumber(inputs.bagWeightPounds, 'Bag weight'),
        pricePerBag: parseOptionalNumber(inputs.pricePerBag ?? '', 'Price per bag'),
      });
      return {
        label: 'Grass seed needed',
        expression: `${formatCalculatorNumber(result.lawnAreaSquareFeet)} ft2 at ${formatCalculatorNumber(result.seedRatePoundsPer1000SquareFeet)} lb / 1,000 ft2`,
        answer: `${formatCalculatorNumber(result.seedPounds)} lb`,
        metrics: [
          { label: 'Bags to buy', value: formatCalculatorNumber(result.bagsNeeded) },
          { label: 'Adjusted lawn area', value: `${formatCalculatorNumber(result.adjustedAreaSquareFeet)} ft2` },
          { label: 'Estimated cost', value: result.estimatedCost === null ? 'Add price per bag' : money(result.estimatedCost) },
        ],
        steps: [
          'Add waste to the measured lawn area.',
          'Multiply adjusted area by the seed rate per 1,000 square feet.',
          'Divide by bag weight and round up to whole bags.',
        ],
        note: 'New lawns, overseeding, grass species, soil temperature, slopes, shade, and seed label rates all affect the right seed amount.',
      };
    }
    case 'lawn-mowing': {
      const result = calculateLawnMowingTime({
        lawnAreaSquareFeet: parseNumber(inputs.lawnAreaSquareFeet, 'Lawn area'),
        mowerWidthInches: parseNumber(inputs.mowerWidthInches, 'Mower width'),
        speedMph: parseNumber(inputs.speedMph, 'Speed'),
        efficiencyPercent: parseNumber(inputs.efficiencyPercent, 'Efficiency percent'),
      });
      return {
        label: 'Estimated mowing time',
        expression: `${formatCalculatorNumber(result.acres)} acres, ${formatCalculatorNumber(result.mowerWidthInches)} in mower`,
        answer: `${formatCalculatorNumber(result.minutes)} min`,
        metrics: [
          { label: 'Hours', value: formatCalculatorNumber(result.hours) },
          { label: 'Effective width', value: `${formatCalculatorNumber(result.effectiveWidthFeet)} ft` },
          { label: 'Mowing rate', value: `${formatCalculatorNumber(result.squareFeetPerHour)} ft2/hr` },
        ],
        steps: [
          'Convert mower deck width to feet.',
          'Multiply width by speed to estimate square feet per hour.',
          'Apply efficiency for turns, overlap, obstacles, and slow sections.',
        ],
        note: 'Wet grass, hills, bagging, trimming, obstacles, mower power, and walking speed can make real mowing time longer.',
      };
    }
    case 'plant-spacing': {
      const result = calculatePlantSpacingEstimate({
        bedLengthFeet: parseNumber(inputs.bedLengthFeet, 'Bed length'),
        bedWidthFeet: parseNumber(inputs.bedWidthFeet, 'Bed width'),
        spacingInches: parseNumber(inputs.spacingInches, 'Plant spacing'),
        pattern: (inputs.pattern ?? 'square') as PlantSpacingPattern,
      });
      return {
        label: 'Plants needed',
        expression: `${formatCalculatorNumber(result.bedLengthFeet)} x ${formatCalculatorNumber(result.bedWidthFeet)} ft bed`,
        answer: `${formatCalculatorNumber(result.plantsNeeded)} plants`,
        metrics: [
          { label: 'Rows', value: formatCalculatorNumber(result.rows) },
          { label: 'Plants per row', value: formatCalculatorNumber(result.columns) },
          { label: 'Row spacing', value: `${formatCalculatorNumber(result.rowSpacingInches)} in` },
        ],
        steps: [
          'Convert bed length and width to inches.',
          'Fit rows and columns from the chosen spacing.',
          'Use tighter row spacing for the triangular pattern.',
        ],
        note: 'Mature plant width, border setbacks, irregular beds, sunlight, airflow, and plant type can change the final planting plan.',
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
    case 'concrete-mix': {
      const result = calculateConcreteMixEstimate({
        cubicYards: parseNumber(inputs.cubicYards, 'Concrete volume'),
        cementParts: parseNumber(inputs.cementParts, 'Cement parts'),
        sandParts: parseNumber(inputs.sandParts, 'Sand parts'),
        gravelParts: parseNumber(inputs.gravelParts, 'Gravel parts'),
        cementBagCubicFeet: parseNumber(inputs.cementBagCubicFeet, 'Cement bag yield'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
      });
      return {
        label: 'Mix materials',
        expression: `${formatCalculatorNumber(result.cubicYards)} yd3 at ${formatCalculatorNumber(result.cementParts)}:${formatCalculatorNumber(result.sandParts)}:${formatCalculatorNumber(result.gravelParts)}`,
        answer: `${formatCalculatorNumber(result.cementBags)} cement bags`,
        metrics: [
          { label: 'Adjusted concrete', value: `${formatCalculatorNumber(result.adjustedCubicYards)} yd3` },
          { label: 'Cement', value: `${formatCalculatorNumber(result.cementCubicFeet)} ft3` },
          { label: 'Sand', value: `${formatCalculatorNumber(result.sandCubicFeet)} ft3` },
          { label: 'Gravel', value: `${formatCalculatorNumber(result.gravelCubicFeet)} ft3` },
        ],
        steps: [
          'Convert cubic yards to cubic feet and add waste.',
          'Add the cement, sand, and gravel ratio parts.',
          'Split the adjusted volume by the ratio and round cement bags up.',
        ],
        note: 'Concrete mix design depends on strength, moisture, aggregate size, additives, and code requirements. This is a planning estimate for simple batches.',
      };
    }
    case 'concrete-driveway': {
      const result = calculateConcreteDrivewayEstimate({
        lengthFeet: parseNumber(inputs.lengthFeet, 'Driveway length'),
        widthFeet: parseNumber(inputs.widthFeet, 'Driveway width'),
        depthInches: parseNumber(inputs.depthInches, 'Slab thickness'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
        pricePerCubicYard: parseOptionalNumber(inputs.pricePerCubicYard ?? '', 'Price per cubic yard'),
      });
      return {
        label: 'Concrete needed',
        expression: `${formatCalculatorNumber(result.lengthFeet)} ft x ${formatCalculatorNumber(result.widthFeet)} ft x ${formatCalculatorNumber(result.depthInches)} in driveway`,
        answer: `${formatCalculatorNumber(result.cubicYards)} yd3`,
        metrics: [
          { label: 'Cubic feet', value: `${formatCalculatorNumber(result.cubicFeet)} ft3` },
          { label: '80 lb bags', value: formatCalculatorNumber(result.eightyPoundBags) },
          { label: 'Estimated cost', value: result.estimatedCost === null ? 'Not entered' : money(result.estimatedCost) },
        ],
        steps: [
          'Convert slab thickness from inches to feet.',
          'Multiply length by width by thickness for cubic feet.',
          'Add waste, convert to cubic yards, and estimate cost if a price was entered.',
        ],
        note: 'Driveway thickness, subbase, reinforcement, control joints, drainage, soil, and local code can change the real pour plan.',
      };
    }
    case 'concrete-steps': {
      const result = calculateConcreteStepsEstimate({
        stepCount: parseNumber(inputs.stepCount, 'Step count'),
        widthFeet: parseNumber(inputs.widthFeet, 'Step width'),
        riserHeightInches: parseNumber(inputs.riserHeightInches, 'Riser height'),
        treadDepthInches: parseNumber(inputs.treadDepthInches, 'Tread depth'),
        landingDepthFeet: parseNumber(inputs.landingDepthFeet, 'Landing depth'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
      });
      return {
        label: 'Concrete needed',
        expression: `${formatCalculatorNumber(result.stepCount)} steps, ${formatCalculatorNumber(result.widthFeet)} ft wide`,
        answer: `${formatCalculatorNumber(result.cubicYards)} yd3`,
        metrics: [
          { label: 'Stair volume', value: `${formatCalculatorNumber(result.stairCubicFeet)} ft3` },
          { label: 'Landing volume', value: `${formatCalculatorNumber(result.landingCubicFeet)} ft3` },
          { label: '80 lb bags', value: formatCalculatorNumber(result.eightyPoundBags) },
        ],
        steps: [
          'Convert riser and tread dimensions to feet.',
          'Estimate the solid stair shape as stacked rectangular steps.',
          'Add the landing volume, waste, and common bag counts.',
        ],
        note: 'This assumes solid concrete steps. Hollow forms, nosing, footings, reinforcement, frost, slope, handrails, and building code need separate planning.',
      };
    }
    case 'concrete-weight': {
      const result = calculateConcreteWeightEstimate({
        cubicYards: parseNumber(inputs.cubicYards, 'Concrete volume'),
        densityPoundsPerCubicFoot: parseNumber(inputs.densityPoundsPerCubicFoot, 'Density'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
      });
      return {
        label: 'Concrete weight',
        expression: `${formatCalculatorNumber(result.cubicYards)} yd3 at ${formatCalculatorNumber(result.densityPoundsPerCubicFoot)} lb/ft3`,
        answer: `${formatCalculatorNumber(result.totalPounds)} lb`,
        metrics: [
          { label: 'Cubic feet', value: `${formatCalculatorNumber(result.cubicFeet)} ft3` },
          { label: 'US tons', value: `${formatCalculatorNumber(result.totalTons)} tons` },
          { label: 'Density used', value: `${formatCalculatorNumber(result.densityPoundsPerCubicFoot)} lb/ft3` },
        ],
        steps: [
          'Convert cubic yards to cubic feet.',
          'Apply the optional waste allowance.',
          'Multiply cubic feet by the entered density and convert pounds to tons.',
        ],
        note: 'Concrete density changes with mix, aggregate, air, moisture, and reinforcement. Use supplier data for hauling or structural decisions.',
      };
    }
    case 'concrete-reinforcing-mesh': {
      const result = calculateConcreteReinforcingMeshEstimate({
        slabLengthFeet: parseNumber(inputs.slabLengthFeet, 'Slab length'),
        slabWidthFeet: parseNumber(inputs.slabWidthFeet, 'Slab width'),
        sheetLengthFeet: parseNumber(inputs.sheetLengthFeet, 'Sheet length'),
        sheetWidthFeet: parseNumber(inputs.sheetWidthFeet, 'Sheet width'),
        overlapInches: parseNumber(inputs.overlapInches, 'Overlap'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
      });
      return {
        label: 'Mesh sheets',
        expression: `${formatCalculatorNumber(result.slabLengthFeet)} ft x ${formatCalculatorNumber(result.slabWidthFeet)} ft slab`,
        answer: `${formatCalculatorNumber(result.sheetsNeeded)} sheets`,
        metrics: [
          { label: 'Slab area', value: `${formatCalculatorNumber(result.slabAreaSquareFeet)} ft2` },
          { label: 'Area with waste', value: `${formatCalculatorNumber(result.adjustedAreaSquareFeet)} ft2` },
          { label: 'Effective sheet area', value: `${formatCalculatorNumber(result.effectiveSheetAreaSquareFeet)} ft2` },
        ],
        steps: [
          'Find slab area from length times width.',
          'Reduce sheet coverage for overlap in both directions.',
          'Add waste, divide by effective sheet area, and round up.',
        ],
        note: 'Mesh placement, wire size, chair spacing, concrete cover, laps, and structural reinforcement requirements need project-specific design.',
      };
    }
    case 'concrete-block-fill': {
      const result = calculateConcreteBlockFillEstimate({
        blockCount: parseNumber(inputs.blockCount, 'Block count'),
        fillCubicFeetPerBlock: parseNumber(inputs.fillCubicFeetPerBlock, 'Fill per block'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
      });
      return {
        label: 'Fill concrete',
        expression: `${formatCalculatorNumber(result.blockCount)} blocks x ${formatCalculatorNumber(result.fillCubicFeetPerBlock)} ft3 per block`,
        answer: `${formatCalculatorNumber(result.cubicYards)} yd3`,
        metrics: [
          { label: 'Cubic feet', value: `${formatCalculatorNumber(result.cubicFeet)} ft3` },
          { label: '80 lb bags', value: formatCalculatorNumber(result.eightyPoundBags) },
          { label: '60 lb bags', value: formatCalculatorNumber(result.sixtyPoundBags) },
        ],
        steps: [
          'Multiply block count by fill volume per block.',
          'Add waste for spillage and overfilled cores.',
          'Convert to cubic yards and estimate common bag counts.',
        ],
        note: 'Block core size, bond beams, rebar cells, grout type, cleanouts, and structural requirements can change fill volume.',
      };
    }
    case 'retaining-wall': {
      const result = calculateRetainingWallEstimate({
        wallLengthFeet: parseNumber(inputs.wallLengthFeet, 'Wall length'),
        wallHeightFeet: parseNumber(inputs.wallHeightFeet, 'Wall height'),
        blockLengthInches: parseNumber(inputs.blockLengthInches, 'Block length'),
        blockHeightInches: parseNumber(inputs.blockHeightInches, 'Block height'),
        capLengthInches: parseNumber(inputs.capLengthInches, 'Cap length'),
        baseDepthInches: parseNumber(inputs.baseDepthInches, 'Base depth'),
        baseWidthInches: parseNumber(inputs.baseWidthInches, 'Base width'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
      });
      return {
        label: 'Wall blocks',
        expression: `${formatCalculatorNumber(result.wallLengthFeet)} ft x ${formatCalculatorNumber(result.wallHeightFeet)} ft retaining wall`,
        answer: `${formatCalculatorNumber(result.wallBlocks)} blocks`,
        metrics: [
          { label: 'Courses', value: formatCalculatorNumber(result.courses) },
          { label: 'Cap blocks', value: formatCalculatorNumber(result.capBlocks) },
          { label: 'Base gravel', value: `${formatCalculatorNumber(result.baseCubicYards)} yd3` },
        ],
        steps: [
          'Divide wall height by block height to estimate courses.',
          'Divide wall length by block length to estimate blocks per course.',
          'Add waste, estimate cap blocks, and calculate base trench volume.',
        ],
        note: 'Retaining walls need drainage, backfill, geogrid, setbacks, soil checks, and sometimes permits or engineering, especially as height increases.',
      };
    }
    case 'rebar-weight': {
      const result = calculateRebarWeightEstimate({
        rebarSize: (inputs.rebarSize || '#4') as RebarSize,
        lengthFeet: parseNumber(inputs.lengthFeet, 'Rebar length'),
        quantity: parseNumber(inputs.quantity, 'Quantity'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
      });
      return {
        label: 'Rebar weight',
        expression: `${formatCalculatorNumber(result.quantity)} pieces of ${result.rebarSize} x ${formatCalculatorNumber(result.lengthFeet)} ft`,
        answer: `${formatCalculatorNumber(result.totalPounds)} lb`,
        metrics: [
          { label: 'Adjusted length', value: `${formatCalculatorNumber(result.adjustedLengthFeet)} ft` },
          { label: 'Weight per foot', value: `${formatCalculatorNumber(result.weightPerFootPounds)} lb/ft` },
          { label: 'US tons', value: `${formatCalculatorNumber(result.totalTons)} tons` },
        ],
        steps: [
          'Multiply length per bar by quantity.',
          'Add waste for cuts and laps.',
          'Multiply adjusted length by the nominal weight per foot for the selected bar size.',
        ],
        note: 'Nominal weights are planning values. Mill tolerances, coatings, bundles, laps, chairs, and structural design can change the final order.',
      };
    }
    case 'concrete-footing': {
      const result = calculateConcreteFootingEstimate({
        lengthFeet: parseNumber(inputs.lengthFeet, 'Footing length'),
        widthInches: parseNumber(inputs.widthInches, 'Footing width'),
        depthInches: parseNumber(inputs.depthInches, 'Footing depth'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
      });
      return {
        label: 'Concrete needed',
        expression: `${formatCalculatorNumber(result.lengthFeet)} ft x ${formatCalculatorNumber(result.widthInches)} in x ${formatCalculatorNumber(result.depthInches)} in footing`,
        answer: `${formatCalculatorNumber(result.cubicYards)} yd3`,
        metrics: [
          { label: 'Cubic feet', value: formatCalculatorNumber(result.cubicFeet) },
          { label: '80 lb bags', value: formatCalculatorNumber(result.eightyPoundBags) },
          { label: '60 lb bags', value: formatCalculatorNumber(result.sixtyPoundBags) },
        ],
        steps: [
          'Convert footing width and depth from inches to feet.',
          'Multiply length by width by depth for cubic feet.',
          'Add waste, convert to cubic yards, and estimate common bag counts.',
        ],
        note: 'Footing size, reinforcement, soil bearing, frost depth, drainage, inspection rules, and local code need professional review.',
      };
    }
    case 'concrete-column': {
      const result = calculateConcreteColumnEstimate({
        diameterInches: parseNumber(inputs.diameterInches, 'Column diameter'),
        heightFeet: parseNumber(inputs.heightFeet, 'Column height'),
        quantity: parseNumber(inputs.quantity, 'Quantity'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
      });
      return {
        label: 'Concrete needed',
        expression: `${formatCalculatorNumber(result.quantity)} round columns, ${formatCalculatorNumber(result.diameterInches)} in diameter x ${formatCalculatorNumber(result.heightFeet)} ft high`,
        answer: `${formatCalculatorNumber(result.cubicYards)} yd3`,
        metrics: [
          { label: 'Cubic feet', value: formatCalculatorNumber(result.cubicFeet) },
          { label: '80 lb bags', value: formatCalculatorNumber(result.eightyPoundBags) },
          { label: '60 lb bags', value: formatCalculatorNumber(result.sixtyPoundBags) },
        ],
        steps: [
          'Convert diameter to a radius in feet.',
          'Use pi times radius squared times height for each column.',
          'Multiply by quantity, add waste, and estimate bags.',
        ],
        note: 'Round forms, bell bottoms, reinforcement, anchor bolts, structural loads, and code requirements are outside this material estimate.',
      };
    }
    case 'post-hole-concrete': {
      const result = calculatePostHoleConcreteEstimate({
        holeDiameterInches: parseNumber(inputs.holeDiameterInches, 'Hole diameter'),
        holeDepthInches: parseNumber(inputs.holeDepthInches, 'Hole depth'),
        postDiameterInches: parseNumber(inputs.postDiameterInches, 'Post diameter'),
        quantity: parseNumber(inputs.quantity, 'Quantity'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
      });
      return {
        label: 'Concrete needed',
        expression: `${formatCalculatorNumber(result.quantity)} holes, ${formatCalculatorNumber(result.holeDiameterInches)} in diameter x ${formatCalculatorNumber(result.holeDepthInches)} in deep`,
        answer: `${formatCalculatorNumber(result.eightyPoundBags)} eighty-pound bags`,
        metrics: [
          { label: 'Cubic yards', value: formatCalculatorNumber(result.cubicYards) },
          { label: 'Concrete per hole', value: `${formatCalculatorNumber(result.netConcretePerHoleCubicFeet)} ft3` },
          { label: '60 lb bags', value: formatCalculatorNumber(result.sixtyPoundBags) },
        ],
        steps: [
          'Find round hole volume from diameter and depth.',
          'Subtract the round post volume occupying the hole.',
          'Multiply by hole count, add waste, and round bag counts up.',
        ],
        note: 'Hole depth should follow frost, soil, fence, deck, or code requirements. This only estimates concrete volume around the post.',
      };
    }
    case 'plywood': {
      const result = calculatePlywoodEstimate({
        areaSquareFeet: parseNumber(inputs.areaSquareFeet, 'Area'),
        sheetWidthFeet: parseNumber(inputs.sheetWidthFeet, 'Sheet width'),
        sheetLengthFeet: parseNumber(inputs.sheetLengthFeet, 'Sheet length'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
        pricePerSheet: parseOptionalNumber(inputs.pricePerSheet ?? '', 'Price per sheet'),
      });
      return {
        label: 'Plywood sheets',
        expression: `${formatCalculatorNumber(result.areaSquareFeet)} ft2 with ${formatCalculatorNumber(result.sheetWidthFeet)} x ${formatCalculatorNumber(result.sheetLengthFeet)} ft sheets`,
        answer: `${formatCalculatorNumber(result.sheetsNeeded)} sheets`,
        metrics: [
          { label: 'Adjusted area', value: `${formatCalculatorNumber(result.adjustedAreaSquareFeet)} ft2` },
          { label: 'Sheet coverage', value: `${formatCalculatorNumber(result.sheetAreaSquareFeet)} ft2` },
          { label: 'Estimated cost', value: result.estimatedCost === null ? 'Not entered' : money(result.estimatedCost) },
        ],
        steps: [
          'Multiply sheet width by sheet length for sheet coverage.',
          'Add waste to the project area.',
          'Divide adjusted area by sheet coverage and round up.',
        ],
        note: 'Panel direction, seams, joist layout, grain direction, thickness, fasteners, and code requirements can change the final sheet plan.',
      };
    }
    case 'insulation': {
      const result = calculateInsulationEstimate({
        areaSquareFeet: parseNumber(inputs.areaSquareFeet, 'Area'),
        openingsSquareFeet: parseNumber(inputs.openingsSquareFeet, 'Openings'),
        coveragePerPackSquareFeet: parseNumber(inputs.coveragePerPackSquareFeet, 'Coverage per pack'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
        pricePerPack: parseOptionalNumber(inputs.pricePerPack ?? '', 'Price per pack'),
      });
      return {
        label: 'Insulation packs',
        expression: `${formatCalculatorNumber(result.netAreaSquareFeet)} net ft2 at ${formatCalculatorNumber(result.coveragePerPackSquareFeet)} ft2 per pack`,
        answer: `${formatCalculatorNumber(result.packsNeeded)} packs`,
        metrics: [
          { label: 'Adjusted area', value: `${formatCalculatorNumber(result.adjustedAreaSquareFeet)} ft2` },
          { label: 'Total coverage bought', value: `${formatCalculatorNumber(result.totalCoverageSquareFeet)} ft2` },
          { label: 'Estimated cost', value: result.estimatedCost === null ? 'Not entered' : money(result.estimatedCost) },
        ],
        steps: [
          'Subtract openings from the measured area.',
          'Add waste for cutting and fitting.',
          'Divide by package coverage and round up to whole packs.',
        ],
        note: 'R-value, vapor control, air sealing, ventilation, moisture, fire rules, and local code matter. Match the product to the project, not just the square footage.',
      };
    }
    case 'countertop': {
      const result = calculateCountertopEstimate({
        lengthFeet: parseNumber(inputs.lengthFeet, 'Countertop length'),
        depthInches: parseNumber(inputs.depthInches, 'Countertop depth'),
        backsplashLengthFeet: parseNumber(inputs.backsplashLengthFeet, 'Backsplash length'),
        backsplashHeightInches: parseNumber(inputs.backsplashHeightInches, 'Backsplash height'),
        cutoutSquareFeet: parseNumber(inputs.cutoutSquareFeet, 'Cutouts'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
        pricePerSquareFoot: parseOptionalNumber(inputs.pricePerSquareFoot ?? '', 'Price per square foot'),
      });
      return {
        label: 'Countertop area',
        expression: `${formatCalculatorNumber(result.lengthFeet)} ft run at ${formatCalculatorNumber(result.depthInches)} in depth`,
        answer: `${formatCalculatorNumber(result.adjustedAreaSquareFeet)} ft2`,
        metrics: [
          { label: 'Top area', value: `${formatCalculatorNumber(result.topAreaSquareFeet)} ft2` },
          { label: 'Backsplash area', value: `${formatCalculatorNumber(result.backsplashAreaSquareFeet)} ft2` },
          { label: 'Estimated cost', value: result.estimatedCost === null ? 'Not entered' : money(result.estimatedCost) },
        ],
        steps: [
          'Convert countertop depth from inches to feet and multiply by length.',
          'Add backsplash area and subtract cutouts if needed.',
          'Add waste and multiply by price per square foot when entered.',
        ],
        note: 'Slab layout, seams, edge profile, overhangs, sink type, backsplashes, templates, fabrication, and installation rules can change the final quote.',
      };
    }
    case 'sod': {
      const result = calculateSodEstimate({
        lawnAreaSquareFeet: parseNumber(inputs.lawnAreaSquareFeet, 'Lawn area'),
        rollCoverageSquareFeet: parseNumber(inputs.rollCoverageSquareFeet, 'Roll coverage'),
        rollsPerPallet: parseNumber(inputs.rollsPerPallet, 'Rolls per pallet'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
        pricePerRoll: parseOptionalNumber(inputs.pricePerRoll ?? '', 'Price per roll'),
      });
      return {
        label: 'Sod to buy',
        expression: `${formatCalculatorNumber(result.lawnAreaSquareFeet)} ft2 lawn at ${formatCalculatorNumber(result.rollCoverageSquareFeet)} ft2 per roll`,
        answer: `${formatCalculatorNumber(result.rollsNeeded)} rolls`,
        metrics: [
          { label: 'Adjusted area', value: `${formatCalculatorNumber(result.adjustedAreaSquareFeet)} ft2` },
          { label: 'Pallets', value: formatCalculatorNumber(result.palletsNeeded) },
          { label: 'Estimated cost', value: result.estimatedCost === null ? 'Not entered' : money(result.estimatedCost) },
        ],
        steps: [
          'Add waste to the measured lawn area.',
          'Divide by the square feet one roll or slab covers.',
          'Round up to whole rolls and whole pallets.',
        ],
        note: 'Curves, slopes, damaged sod, soil prep, irrigation, delivery minimums, and supplier roll sizes can change the final order.',
      };
    }
    case 'wall-stud': {
      const result = calculateWallStudEstimate({
        wallLengthFeet: parseNumber(inputs.wallLengthFeet, 'Wall length'),
        wallHeightFeet: parseNumber(inputs.wallHeightFeet, 'Wall height'),
        spacingInches: parseNumber(inputs.spacingInches, 'Stud spacing'),
        openingsCount: parseNumber(inputs.openingsCount, 'Openings'),
        extraCornerStuds: parseNumber(inputs.extraCornerStuds, 'Extra corner studs'),
        plates: parseNumber(inputs.plates, 'Plate rows'),
        boardLengthFeet: parseNumber(inputs.boardLengthFeet, 'Board length'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
      });
      return {
        label: 'Boards to buy',
        expression: `${formatCalculatorNumber(result.wallLengthFeet)} ft wall at ${formatCalculatorNumber(result.spacingInches)} in on-center`,
        answer: `${formatCalculatorNumber(result.totalPieces)} boards`,
        metrics: [
          { label: 'Vertical studs with waste', value: formatCalculatorNumber(result.verticalStudsWithWaste) },
          { label: 'Plate pieces', value: formatCalculatorNumber(result.platePieces) },
          { label: 'Linear feet with waste', value: `${formatCalculatorNumber(result.estimatedLinearFeetWithWaste)} ft` },
        ],
        steps: [
          'Count layout studs from wall length and on-center spacing.',
          'Add extra studs for openings and corners, then add waste.',
          'Add top/bottom plate pieces based on wall length and board length.',
        ],
        note: 'Headers, king/jack stud details, fire blocking, bracing, structural loads, pressure-treated plates, and code rules need a real framing plan.',
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
        note: 'Use compacted depth. Asphalt mix, density, base, lift thickness, plant minimums, and paving specs matter for real jobs.',
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
        note: 'Cute? Maybe. Scientific? No. Real relationships need respect, honesty, boundaries, communication, timing, and effort.',
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
          'Count Unicode code points in the text.',
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
    case 'recipe-scaler': {
      const result = calculateRecipeScale(
        inputs.ingredientName ?? '',
        parseNumber(inputs.amount, 'Original amount'),
        inputs.unit ?? '',
        parseNumber(inputs.originalServings, 'Original servings'),
        parseNumber(inputs.desiredServings, 'Desired servings'),
      );
      return {
        label: 'Scaled ingredient amount',
        expression: `${formatCalculatorNumber(result.amount)} ${result.unit} for ${formatCalculatorNumber(result.originalServings)} servings`,
        answer: `${formatCalculatorNumber(result.scaledAmount)} ${result.unit}`,
        metrics: [
          { label: 'Ingredient', value: result.ingredientName },
          { label: 'Scale factor', value: `${formatCalculatorNumber(result.scaleFactor)}x` },
          { label: 'Desired servings', value: formatCalculatorNumber(result.desiredServings) },
        ],
        steps: [
          'Divide desired servings by original servings to get the scale factor.',
          'Multiply the ingredient amount by that scale factor.',
          'Repeat the same idea for each ingredient line in the recipe.',
        ],
        note: 'Spices, yeast, thickener, salt, pan size, and cooking time may not scale perfectly. Taste and texture still need judgment.',
      };
    }
    case 'cooking-measurement-converter': {
      const result = convertCookingMeasurement(
        parseNumber(inputs.amount, 'Amount'),
        inputs.fromUnit,
        inputs.toUnit,
        parseNumber(inputs.densityGramsPerCup, 'Density grams per cup'),
      );
      return {
        label: 'Converted cooking amount',
        expression: `${formatCalculatorNumber(result.amount)} ${unitLabel(result.fromUnit)} to ${unitLabel(result.toUnit)}`,
        answer: `${formatCalculatorNumber(result.convertedAmount)} ${unitLabel(result.toUnit)}`,
        metrics: [
          { label: 'Input type', value: unitLabel(result.inputKind) },
          { label: 'Output type', value: unitLabel(result.outputKind) },
          { label: 'Density used', value: `${formatCalculatorNumber(result.densityGramsPerCup)} g/cup` },
        ],
        steps: [
          'Convert the starting unit into a common cup or gram base.',
          result.inputKind === result.outputKind ? 'Apply the fixed unit factor.' : 'Use grams per cup to cross between volume and weight.',
          'Convert the base amount into the requested output unit.',
        ],
        note: result.note,
      };
    }
    case 'ingredient-cost-calculator': {
      const result = calculateIngredientCost(
        parseNumber(inputs.amountNeeded, 'Amount needed'),
        inputs.neededUnit,
        parseNumber(inputs.packageAmount, 'Package amount'),
        inputs.packageUnit,
        parseNumber(inputs.packagePrice, 'Package price'),
        parseNumber(inputs.densityGramsPerCup, 'Density grams per cup'),
      );
      return {
        label: 'Estimated ingredient cost',
        expression: `${formatCalculatorNumber(result.amountNeeded)} ${unitLabel(result.neededUnit)} from a ${formatCalculatorNumber(result.packageAmount)} ${unitLabel(result.packageUnit)} package`,
        answer: moneyPrecise(result.recipeCost),
        metrics: [
          { label: 'Unit cost', value: `${moneyPrecise(result.unitCost)} per ${unitLabel(result.neededUnit)}` },
          { label: 'Package amount converted', value: `${formatCalculatorNumber(result.packageAmountInNeededUnit)} ${unitLabel(result.neededUnit)}` },
          { label: 'Density used', value: `${formatCalculatorNumber(result.densityGramsPerCup)} g/cup` },
        ],
        steps: [
          'Convert the package amount into the recipe unit.',
          'Divide package price by the converted package amount to get cost per unit.',
          'Multiply cost per unit by the amount the recipe needs.',
        ],
        note: 'This estimate does not include tax, waste, leftovers, coupons, or price changes unless you include them in the package price.',
      };
    }
    case 'unit-price-calculator': {
      const result = compareUnitPrices(
        inputs.itemAName ?? '',
        parseNumber(inputs.itemAPrice, 'Item A price'),
        parseNumber(inputs.itemAQuantity, 'Item A quantity'),
        inputs.itemBName ?? '',
        parseNumber(inputs.itemBPrice, 'Item B price'),
        parseNumber(inputs.itemBQuantity, 'Item B quantity'),
        inputs.unit ?? '',
      );
      return {
        label: 'Better unit price',
        expression: `${result.itemAName} vs ${result.itemBName}`,
        answer: result.cheaperName,
        metrics: [
          { label: `${result.itemAName} unit price`, value: `${moneyPrecise(result.itemAUnitPrice)} / ${result.unit}` },
          { label: `${result.itemBName} unit price`, value: `${moneyPrecise(result.itemBUnitPrice)} / ${result.unit}` },
          { label: 'Savings per unit', value: `${moneyPrecise(result.savingsPerUnit)} (${percent(result.savingsPercent)})` },
        ],
        steps: [
          'Divide each item price by its package quantity.',
          'Compare both unit prices using the same unit.',
          'The lower unit price is the cheaper option before taxes, coupons, or quality differences.',
        ],
        note: 'Unit price is only fair when both quantities use the same unit and the products are actually comparable.',
      };
    }
    case 'cost-per-serving-calculator': {
      const result = calculateCostPerServing(
        inputs.foodName ?? '',
        parseNumber(inputs.totalCost, 'Main cost'),
        parseNumber(inputs.servings, 'Servings'),
        parseOptionalNumber(inputs.extraCost, 'Extra cost') ?? 0,
      );
      return {
        label: 'Cost per serving',
        expression: `${result.foodName}: ${money(result.totalBatchCost)} over ${formatCalculatorNumber(result.servings)} servings`,
        answer: moneyPrecise(result.costPerServing),
        metrics: [
          { label: 'Total batch cost', value: moneyPrecise(result.totalBatchCost) },
          { label: 'Extra cost included', value: moneyPrecise(result.extraCost) },
          { label: 'Servings', value: formatCalculatorNumber(result.servings) },
        ],
        steps: [
          'Add the main cost and extra cost.',
          'Divide the total batch cost by the number of servings.',
          'Use the result to compare recipes, meal prep, or sale pricing.',
        ],
        note: 'If servings are guessed, the cost per serving is a planning estimate too.',
      };
    }
    case 'oven-temperature-converter': {
      const result = convertOvenTemperature(parseNumber(inputs.temperature, 'Temperature'), inputs.unit);
      return {
        label: 'Oven temperature',
        expression: `${formatCalculatorNumber(result.inputTemperature)} ${unitLabel(result.inputUnit)}`,
        answer: `${formatCalculatorNumber(result.fahrenheit)} F / ${formatCalculatorNumber(result.celsius)} C`,
        metrics: [
          { label: 'Fahrenheit', value: `${formatCalculatorNumber(result.fahrenheit)} F` },
          { label: 'Celsius', value: `${formatCalculatorNumber(result.celsius)} C` },
          {
            label: 'Fan oven starting point',
            value: `about ${formatCalculatorNumber(result.fanCelsius)} C / ${formatCalculatorNumber(result.fanFahrenheit)} F`,
          },
          { label: 'Nearest gas mark', value: `${result.nearestGasMark} (${formatCalculatorNumber(result.nearestGasMarkFahrenheit)} F)` },
        ],
        steps: [
          'Convert the entered oven temperature into Fahrenheit.',
          'Convert Fahrenheit into Celsius.',
          'Estimate a fan-oven starting point by lowering the rounded Celsius setting by about 20 C.',
          'Find the nearest common gas mark temperature.',
        ],
        note: 'Fan and gas mark settings are approximate. Your oven manual, recipe notes, and a food thermometer matter more than a converter when safety or doneness is on the line.',
      };
    }
    case 'butter-converter': {
      const result = convertButter(parseNumber(inputs.amount, 'Amount'), inputs.unit);
      return {
        label: 'Butter conversion',
        expression: `${formatCalculatorNumber(result.amount)} ${unitLabel(result.unit)}`,
        answer: `${formatCalculatorNumber(result.tablespoons)} tablespoons`,
        metrics: [
          { label: 'Cups', value: formatCalculatorNumber(result.cups) },
          { label: 'Sticks', value: formatCalculatorNumber(result.sticks) },
          { label: 'Grams', value: `${formatCalculatorNumber(result.grams)} g` },
        ],
        steps: [
          'Convert the starting unit into tablespoons.',
          'Use common US butter equivalents for cups, sticks, ounces, grams, and pounds.',
          'Show the most common recipe units side by side.',
        ],
        note: 'This uses common US butter stick math. Check package labels when your local butter sticks or blocks use different sizes.',
      };
    }
    case 'baking-pan-conversion-calculator': {
      const result = calculateBakingPanConversion(
        parseNumber(inputs.oldLengthInches, 'Old pan length'),
        parseNumber(inputs.oldWidthInches, 'Old pan width'),
        parseNumber(inputs.newLengthInches, 'New pan length'),
        parseNumber(inputs.newWidthInches, 'New pan width'),
        parseOptionalNumber(inputs.originalServings, 'Original servings'),
      );
      return {
        label: 'Pan scale factor',
        expression: `${formatCalculatorNumber(result.oldLengthInches)}x${formatCalculatorNumber(result.oldWidthInches)} in to ${formatCalculatorNumber(result.newLengthInches)}x${formatCalculatorNumber(result.newWidthInches)} in`,
        answer: `${formatCalculatorNumber(result.scaleFactor)}x`,
        metrics: [
          { label: 'Original pan area', value: `${formatCalculatorNumber(result.oldAreaSquareInches)} sq in` },
          { label: 'New pan area', value: `${formatCalculatorNumber(result.newAreaSquareInches)} sq in` },
          {
            label: 'Scaled servings',
            value: result.scaledServings === null ? 'Not entered' : formatCalculatorNumber(result.scaledServings),
          },
        ],
        steps: [
          'Multiply length by width for each rectangular pan area.',
          'Divide new pan area by old pan area.',
          'Use the factor to scale batter amount or servings, then watch bake time and depth.',
        ],
        note: 'This area method is best for similar-depth rectangular pans. Round pans, deep pans, and delicate recipes may need extra testing.',
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
