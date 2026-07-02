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

interface GuideFaqItem {
  question: string;
  answer: string;
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
  faqItems?: GuideFaqItem[];
  bestUsesIntro?: string;
}

interface UtilityGuideDetail {
  title?: string;
  summary: string;
  purpose: string;
  intro?: string;
  inputMatch?: string;
  logicNote?: string;
  readIntro?: string;
  mistakeIntro?: string;
  sidecarText?: string;
  bestUsesIntro?: string;
  metaDescription?: string;
  referenceIntro?: string;
  enter: string[];
  read: string[];
  mistakes: string[];
  extraSections?: GuideSection[];
  faqItems?: GuideFaqItem[];
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
  mdnDateInput: {
    href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/date',
    label: 'MDN: HTML date input',
  },
  nistUnits: {
    href: 'https://www.nist.gov/pml/special-publication-811',
    label: 'NIST: Guide for the Use of the International System of Units',
  },
  usdaFoodDataCentral: {
    href: 'https://fdc.nal.usda.gov/',
    label: 'USDA: FoodData Central',
  },
  dishCostCostPerServing: {
    href: 'https://dishcost.com/tools/cost-per-serving-calculator',
    label: 'DishCost: cost per serving calculator reference',
  },
  foodSafetyTemperatures: {
    href: 'https://www.fda.gov/food/buy-store-serve-safe-food/safe-food-handling',
    label: 'FDA: Safe food handling',
  },
  goodFoodConversionGuides: {
    href: 'https://www.bbcgoodfood.com/conversion-guides',
    label: 'Good Food: Recipe conversion guides',
  },
  whichOvenTemperatureChart: {
    href: 'https://www.which.co.uk/reviews/built-in-ovens/article/oven-temperature-conversion-degrees-celsius-to-fahrenheit-gas-mark-and-fan-aA5Ol9b157On',
    label: 'Which?: Oven temperature conversion chart',
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
  quickreteSettingPosts: {
    href: 'https://www.quikrete.com/athome/settingposts.asp',
    label: 'QUIKRETE: Setting posts in concrete',
  },
  quickreteSettingPostsPdf: {
    href: 'https://www.quikrete.com/PDFs/Projects/SettingPosts.pdf',
    label: 'QUIKRETE: Setting posts project guide',
  },
  quickreteTubePillarFoundations: {
    href: 'https://www.quikrete.com/PDFs/Projects/QuiktubePillarFoundations.pdf',
    label: 'QUIKRETE: QUIK-TUBE pillar foundations guide',
  },
  quickreteStepsRamps: {
    href: 'https://www.quikrete.com/PDFs/Projects/ConcreteStepsAndRamps.pdf',
    label: 'QUIKRETE: Concrete steps and ramps project guide',
  },
  maxiConcreteColumn: {
    href: 'https://www.maxicalculator.com/construction/concrete-column-calculator',
    label: 'Maxi Calculator: Concrete column calculator reference',
  },
  aciConcreteTerminology: {
    href: 'https://www.concrete.org/portals/0/files/pdf/ACI_Concrete_Terminology.pdf',
    label: 'ACI: Concrete Terminology',
  },
  aciWwrPlacement: {
    href: 'https://www.concrete.org/frequentlyaskedquestions/faqid/900.aspx',
    label: 'ACI: Placement of welded wire reinforcement in slab-on-ground work',
  },
  fhwaConcreteWeight: {
    href: 'https://www.fhwa.dot.gov/bridge/pubs/07022/chap04.cfm',
    label: 'FHWA: Normal-weight and lightweight concrete density',
  },
  nrmcaLightweightConcrete: {
    href: 'https://www.nrmca.org/wp-content/uploads/2021/01/36pr.pdf',
    label: 'NRMCA: Structural lightweight concrete',
  },
  inchCalculatorSitemap: {
    href: 'https://www.inchcalculator.com/sitemap/',
    label: 'Inch Calculator sitemap: construction and home-project competitor reference',
  },
  inchDeckFlooring: {
    href: 'https://www.inchcalculator.com/deck-flooring-calculator/',
    label: 'Inch Calculator: Deck flooring calculator reference',
  },
  decksComDeckingCalculator: {
    href: 'https://www.decks.com/calculators/decking-calculator',
    label: 'Decks.com: Deck board and materials calculator',
  },
  omniDecking: {
    href: 'https://www.omnicalculator.com/construction/decking',
    label: 'Omni Calculator: Decking calculator reference',
  },
  inchDeckStain: {
    href: 'https://www.inchcalculator.com/deck-stain-calculator/',
    label: 'Inch Calculator: Deck stain calculator reference',
  },
  decksComStaining: {
    href: 'https://www.decks.com/how-to/articles/how-to-stain-a-wood-deck',
    label: 'Decks.com: How to stain a wood deck',
  },
  behrDeckPlusSolidStain: {
    href: 'https://www.behr.com/consumer/products/wood-stains-finishes-cleaners-and-strippers/solid-color-wood-stains/behr-deckplus-solid-color-waterproofing-wood-stain',
    label: 'BEHR: DECKplus solid color waterproofing wood stain',
  },
  rustOleumWolmanDurastain: {
    href: 'https://www.rustoleum.com/product-catalog/consumer-brands/wolman/durastain-semi-transparent-stain/',
    label: 'Rust-Oleum Wolman: DuraStain semi-transparent stain',
  },
  inchBaluster: {
    href: 'https://www.inchcalculator.com/baluster-calculator/',
    label: 'Inch Calculator: Baluster calculator reference',
  },
  decksComBalusterCalculator: {
    href: 'https://www.decks.com/calculators/baluster-spacing-calculator/',
    label: 'Decks.com: Deck baluster spacing calculator',
  },
  decksComBalusterBasics: {
    href: 'https://www.decks.com/resource-index/railing/balusters-explained/',
    label: 'Decks.com: Baluster basics and spacing requirements',
  },
  iccIrc2021GuardOpenings: {
    href: 'https://codes.iccsafe.org/s/IRC2021P3/chapter-3-building-planning/IRC2021P3-Pt03-Ch03-SecR312.1.3',
    label: 'ICC: 2021 IRC R312.1.3 guard opening limitations',
  },
  awcDca6DeckGuide: {
    href: 'https://web-media.awc.org/wp-content/uploads/2022/02/17210514/AWC-DCA62015-DeckGuide-1804.pdf',
    label: 'AWC: DCA 6 Prescriptive Residential Wood Deck Construction Guide',
  },
  inchPaverBase: {
    href: 'https://www.inchcalculator.com/paver-base-calculator/',
    label: 'Inch Calculator: Paver base calculator reference',
  },
  lowesPaverPlanning: {
    href: 'https://www.lowes.com/n/how-to/planning-for-a-paver-patio-or-walkway',
    label: 'Lowe\'s: Planning for a paver patio or walkway',
  },
  inchPaverCalculator: {
    href: 'https://www.inchcalculator.com/paver-calculator/',
    label: 'Inch Calculator: Paver calculator reference',
  },
  calcShedPaverCalculator: {
    href: 'https://calcshed.com/paver-calculator/',
    label: 'CalcShed: Paver calculator',
  },
  inchSandCalculator: {
    href: 'https://www.inchcalculator.com/sand-calculator/',
    label: 'Inch Calculator: Sand calculator reference',
  },
  calcShedSandCalculator: {
    href: 'https://calcshed.com/sand-calculator/',
    label: 'CalcShed: Sand calculator',
  },
  calculatorSoupCubicYards: {
    href: 'https://www.calculatorsoup.com/calculators/construction/cubic-yards-calculator.php',
    label: 'CalculatorSoup: Cubic yards calculator',
  },
  cmhaPaverConstruction: {
    href: 'https://www.cmha.org/pav-tec-002/',
    label: 'CMHA: Construction of interlocking concrete pavements',
  },
  inchPolymericSand: {
    href: 'https://www.inchcalculator.com/polymeric-sand-calculator/',
    label: 'Inch Calculator: Polymeric sand calculator reference',
  },
  sakretePermasand: {
    href: 'https://www.sakrete.com/content/uploads/2021/12/PermaSand-TDS.pdf',
    label: 'Sakrete: PermaSand polymeric jointing sand data sheet',
  },
  quikretePolymericSand: {
    href: 'https://www.quikrete.com/dealers/products/sandpolymericjointing.asp',
    label: 'QUIKRETE: Polymeric jointing sand product guidance',
  },
  inchGrassSeed: {
    href: 'https://www.inchcalculator.com/grass-seed-calculator/',
    label: 'Inch Calculator: Grass seed calculator reference',
  },
  inchLawnMowing: {
    href: 'https://www.inchcalculator.com/lawn-mowing-calculator/',
    label: 'Inch Calculator: Lawn mowing calculator reference',
  },
  inchPlantCalculator: {
    href: 'https://www.inchcalculator.com/plant-and-flower-calculator/',
    label: 'Inch Calculator: Plant and flower calculator reference',
  },
  inchConcreteFooting: {
    href: 'https://www.inchcalculator.com/concrete-footing-calculator/',
    label: 'Inch Calculator: Concrete footing calculator reference',
  },
  iccIrc2024Foundations: {
    href: 'https://codes.iccsafe.org/content/IRC2024P2/chapter-4-foundations',
    label: 'ICC: 2024 IRC foundations chapter',
  },
  inchPostHoleConcrete: {
    href: 'https://www.inchcalculator.com/post-hole-concrete-calculator/',
    label: 'Inch Calculator: Post hole concrete calculator reference',
  },
  inchPlywood: {
    href: 'https://www.inchcalculator.com/plywood-calculator/',
    label: 'Inch Calculator: Plywood calculator reference',
  },
  apaPlywood: {
    href: 'https://www.apawood.org/plywood',
    label: 'APA: Plywood product applications and panel sizes',
  },
  homeDepotPlywoodTypes: {
    href: 'https://www.homedepot.com/c/ab/types-of-plywood/9ba683603be9fa5395fab909d37f448',
    label: 'The Home Depot: Types of plywood',
  },
  inchSod: {
    href: 'https://www.inchcalculator.com/sod-calculator/',
    label: 'Inch Calculator: Sod calculator reference',
  },
  tallyardSodCalculator: {
    href: 'https://www.tallyard.com/sod-calculator',
    label: 'Tallyard: Sod calculator',
  },
  sodSolutionsPalletCoverage: {
    href: 'https://sodsolutions.com/lawn-care-guides/square-feet-per-pallet/',
    label: 'Sod Solutions: Square feet per pallet of sod',
  },
  calcShedSodCalculator: {
    href: 'https://calcshed.com/sod-calculator/',
    label: 'CalcShed: Sod calculator',
  },
  inchFraming: {
    href: 'https://www.inchcalculator.com/framing-calculator/',
    label: 'Inch Calculator: Framing calculator reference',
  },
  calcSummitFramingCalculator: {
    href: 'https://calcsummit.com/calculators/construction/framing/',
    label: 'CalcSummit: Framing calculator',
  },
  homeProjectStudCalculator: {
    href: 'https://www.homeprojectcalculator.com/stud-calculator/',
    label: 'Home Project Calculator: Stud calculator',
  },
  inchConcreteMix: {
    href: 'https://www.inchcalculator.com/concrete-mix-calculator/',
    label: 'Inch Calculator: Concrete mix calculator reference',
  },
  inchConcreteDriveway: {
    href: 'https://www.inchcalculator.com/concrete-driveway-calculator/',
    label: 'Inch Calculator: Concrete driveway calculator reference',
  },
  acpaPavementDesign: {
    href: 'https://www.acpa.org/download/1130/information-sheet/24426/design-of-concrete-pavement-for-streets-and-roads.pdf',
    label: 'ACPA: Design of concrete pavement for streets and roads',
  },
  inchConcreteSteps: {
    href: 'https://www.inchcalculator.com/concrete-steps-calculator/',
    label: 'Inch Calculator: Concrete steps calculator reference',
  },
  inchConcreteWeight: {
    href: 'https://www.inchcalculator.com/concrete-weight-calculator/',
    label: 'Inch Calculator: Concrete weight calculator reference',
  },
  inchConcreteMesh: {
    href: 'https://www.inchcalculator.com/concrete-reinforcing-mesh-calculator/',
    label: 'Inch Calculator: Concrete reinforcing mesh calculator reference',
  },
  inchConcreteBlockFill: {
    href: 'https://www.inchcalculator.com/concrete-block-fill-calculator/',
    label: 'Inch Calculator: Concrete block fill calculator reference',
  },
  inchRetainingWall: {
    href: 'https://www.inchcalculator.com/retaining-wall-calculator/',
    label: 'Inch Calculator: Retaining wall calculator reference',
  },
  inchRebarWeight: {
    href: 'https://www.inchcalculator.com/rebar-weight-calculator/',
    label: 'Inch Calculator: Rebar weight calculator reference',
  },
  southernRebarWeight: {
    href: 'https://www.southernrebar.com/reference/rebar-weight-per-linear-foot',
    label: 'Southern Rebar: Rebar weight per linear foot',
  },
  calcShedRebar: {
    href: 'https://calcshed.com/rebar-calculator/',
    label: 'CalcShed: Rebar calculator',
  },
  crsiLapSplices: {
    href: 'https://www.crsi.org/reinforcing-basics/reinforcing-steel/splicing-bars/lap-splices/',
    label: 'CRSI: Lap splices',
  },
  crsiSplicingBars: {
    href: 'https://www.crsi.org/reinforcing-basics/reinforcing-steel/splicing-bars/',
    label: 'CRSI: Splicing reinforcing bars',
  },
  lowesCountertopGuide: {
    href: 'https://www.lowes.com/pdf/kitchen_countertop_measure_guide.pdf',
    label: 'Lowe\'s: Kitchen countertop measurement guide',
  },
  slabWiseCountertopSquareFeet: {
    href: 'https://slabwise.com/tools/sqft-calculator',
    label: 'SlabWise: Countertop square footage calculator',
  },
  lowesFlooringFootage: {
    href: 'https://pdf.lowes.com/productdocuments/3f70b1c9-8ab7-4125-a2e7-9a3d080d2861/08130541.pdf',
    label: 'Lowe\'s: Calculating correct hardwood flooring footage',
  },
  lowesFlooringPlanner: {
    href: 'https://pdf.lowes.com/productdocuments/a1902812-3b3c-47a8-b344-3e03ce6c804a/48135912.pdf',
    label: 'Lowe\'s: Flooring project planner',
  },
  homeDepotFlooringInstall: {
    href: 'https://www.homedepot.com/catalog/pdfImages/c2/c274b7a0-d4cc-4196-9f09-da4ca69388e9.pdf',
    label: 'The Home Depot: Flooring installation instructions',
  },
  doeInsulation: {
    href: 'https://www.energy.gov/energysaver/insulation',
    label: 'U.S. Department of Energy: Insulation guidance',
  },
  energyStarInsulationRValues: {
    href: 'https://www.energystar.gov/saveathome/seal_insulate/identify-problems-you-want-fix/diy-checks-inspections/insulation-r-values',
    label: 'ENERGY STAR: Recommended home insulation R-values',
  },
  energyStarAtticInsulation: {
    href: 'https://www.energystar.gov/products/energy_star_home_upgrade/attic_insulation',
    label: 'ENERGY STAR: Well-insulated and sealed attic',
  },
  ftcInsulationBuying: {
    href: 'https://consumer.ftc.gov/articles/what-know-when-youre-buying-home-insulation',
    label: 'FTC: What to know when buying home insulation',
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
  epaMpgMath: {
    href: 'https://www.epa.gov/greenvehicles/miles-gallon-mpg-math',
    label: 'U.S. EPA: Miles Per Gallon math',
  },
  doeFuelEconomy: {
    href: 'https://www.energy.gov/index.php/energysaver/fuel-economy',
    label: 'U.S. Department of Energy: Fuel Economy',
  },
  doeDrivingEfficiently: {
    href: 'https://www.energy.gov/energysaver/driving-more-efficiently',
    label: 'U.S. Department of Energy: Driving more efficiently',
  },
  eiaGasolinePrices: {
    href: 'https://www.eia.gov/petroleum/gasdiesel/',
    label: 'U.S. EIA: Weekly gasoline and diesel fuel update',
  },
  irsMileage: {
    href: 'https://www.irs.gov/newsroom/irs-sets-2026-business-standard-mileage-rate-at-725-cents-per-mile-up-25-cents',
    label: 'IRS: 2026 standard mileage rates',
  },
  irsMileageUpdate2026: {
    href: 'https://www.irs.gov/forms-pubs/the-standard-mileage-rates-and-maximum-automobile-fair-market-values-have-been-updated-for-2026',
    label: 'IRS: 2026 mileage-rate update',
  },
  gsaPovMileage: {
    href: 'https://www.gsa.gov/travel/plan-a-trip/transportation-airfare-rates-pov-rates/privately-owned-vehicle-pov-mileage-reimbursement',
    label: 'GSA: 2026 POV mileage reimbursement rates',
  },
  cdcSleep: {
    href: 'https://www.cdc.gov/sleep/about/index.html',
    label: 'CDC: Sleep recommendations by age',
  },
  cdcStudentSleep: {
    href: 'https://www.cdc.gov/physical-activity-education/staying-healthy/sleep.html',
    label: 'CDC: Sleep and student health',
  },
  mayoSleepTips: {
    href: 'https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/sleep/art-20048379',
    label: 'Mayo Clinic: Sleep tips',
  },
  cdcGrowthCharts: {
    href: 'https://www.cdc.gov/growthcharts/',
    label: 'CDC: Growth Charts',
  },
  mayoChildGrowth: {
    href: 'https://www.mayoclinic.org/healthy-lifestyle/childrens-health/expert-answers/child-growth/faq-20057990',
    label: 'Mayo Clinic: Predicting adult height',
  },
  aapMidParentalHeight: {
    href: 'https://eqipp.aap.org/courses/growth2/mn/clinical-guide/popups/mid-parental-height',
    label: 'American Academy of Pediatrics: Mid-parental height',
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
  gafMeasureRoofingSquare: {
    href: 'https://www.gaf.com/en-us/blog/your-home/how-to-measure-a-roofing-square-3faec381-6f6f-49ff-841f-114c59108f2a',
    label: 'GAF: How to measure a roofing square',
  },
  gafMinimumSlopeShingles: {
    href: 'https://www.gaf.com/en-us/blog/residential-roofing/minimum-slope-for-shingles-what-contractors-need-to-know-281474980375031',
    label: 'GAF: Minimum slope for shingles',
  },
  ikoShingleBundles: {
    href: 'https://www.iko.com/na/blog/how-many-shingles-in-a-bundle/',
    label: 'IKO: How many shingles are in a bundle',
  },
  oshaFallProtectionConstruction: {
    href: 'https://www.osha.gov/fall-protection/construction',
    label: 'OSHA: Fall protection in construction',
  },
  nwsWindChill: {
    href: 'https://www.weather.gov/gjt/windchill',
    label: 'National Weather Service: Wind chill formula',
  },
  noaaHeatIndex: {
    href: 'https://www.wpc.ncep.noaa.gov/html/heatindex_equation.shtml',
    label: 'NOAA/NWS: Heat index equation',
  },
  nwsHeatSafety: {
    href: 'https://www.weather.gov/safety/heat-index',
    label: 'National Weather Service: Heat index and safety',
  },
  cdcHeatIllness: {
    href: 'https://www.cdc.gov/heat-health/about/index.html',
    label: 'CDC: About heat and health',
  },
  noaaDewPoint: {
    href: 'https://www.wpc.ncep.noaa.gov/html/dewrh.shtml',
    label: 'NOAA/NWS: Dew point and relative humidity calculator',
  },
  nwsDewPointVsHumidity: {
    href: 'https://www.weather.gov/arx/why_dewpoint_vs_humidity',
    label: 'National Weather Service: Why dew point can explain humidity better',
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
  openStaxElectricPower: {
    href: 'https://openstax.org/books/college-physics/pages/20-4-electric-power-and-energy',
    label: 'OpenStax College Physics: Electric power and energy',
  },
  nistAmpere: {
    href: 'https://www.nist.gov/pml/weights-and-measures/si-units-ampere',
    label: 'NIST: SI unit of electric current',
  },
  esfiExtensionCordSafety: {
    href: 'https://www.esfi.org/extension-cord-safety-tips/',
    label: 'Electrical Safety Foundation International: Extension cord safety tips',
  },
  openStaxMolarity: {
    href: 'https://openstax.org/books/chemistry-2e/pages/3-3-molarity',
    label: 'OpenStax Chemistry 2e: Molarity',
  },
  usaceVoltageDrop: {
    href: 'https://www.inchcalculator.com/voltage-drop-calculator/',
    label: 'Inch Calculator: Voltage drop calculator reference',
  },
  inchWattsToAmps: {
    href: 'https://www.inchcalculator.com/watts-to-amps-calculator/',
    label: 'Inch Calculator: Watts to amps calculator reference',
  },
  inchAmpsToWatts: {
    href: 'https://www.inchcalculator.com/amps-to-watts-calculator/',
    label: 'Inch Calculator: Amps to watts calculator reference',
  },
  inchKilowattsToAmps: {
    href: 'https://www.inchcalculator.com/kilowatts-to-amps-calculator/',
    label: 'Inch Calculator: Kilowatts to amps calculator reference',
  },
  inchKvaToAmps: {
    href: 'https://www.inchcalculator.com/kva-to-amps-calculator/',
    label: 'Inch Calculator: kVA to amps calculator reference',
  },
  inchAmpHoursToWattHours: {
    href: 'https://www.inchcalculator.com/ah-to-wh-calculator/',
    label: 'Inch Calculator: Amp-hours to watt-hours calculator reference',
  },
  inchWattHoursToAmpHours: {
    href: 'https://www.inchcalculator.com/wh-to-ah-calculator/',
    label: 'Inch Calculator: Watt-hours to amp-hours calculator reference',
  },
  inchWireSize: {
    href: 'https://www.inchcalculator.com/wire-size-calculator/',
    label: 'Inch Calculator: Wire size calculator reference',
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
  beaGdpExpenditure: {
    href: 'https://www.bea.gov/news/blog/2025-06-03/expenditures-approach-measuring-gdp',
    label: 'BEA: Expenditures approach to measuring GDP',
  },
  nistConversionFactors: {
    href: 'https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8',
    label: 'NIST SP 811: Conversion factors listed alphabetically',
  },
  poolVolumeReference: {
    href: 'https://www.pool-volume.com/',
    label: 'Pool Volume: pool volume formulas by shape',
  },
  bulkCalculatorPoolVolume: {
    href: 'https://bulkcalculator.com/construction-calculators/calculators/pool-volume-calculator.html',
    label: 'BulkCalculator: Pool volume calculator and formulas',
  },
  calcipediaPoolVolume: {
    href: 'https://www.calcipedia.org/calculators/pool-volume-calculator/',
    label: 'Calcipedia: Pool volume calculator',
  },
  sherwinPaintCoverage: {
    href: 'https://www.sherwin-williams.com/en-us/color/color-tools/paint-calculator',
    label: 'Sherwin-Williams: Paint calculator coverage notes',
  },
  inchCalculatorPaint: {
    href: 'https://www.inchcalculator.com/paint-calculator/',
    label: 'Inch Calculator: Paint calculator reference',
  },
  omniPaint: {
    href: 'https://www.omnicalculator.com/construction/paint',
    label: 'Omni Calculator: Paint calculator reference',
  },
  lowesTile: {
    href: 'https://www.inchcalculator.com/tile-calculator/',
    label: 'Inch Calculator: Tile calculator reference',
  },
  calculatorNetTile: {
    href: 'https://www.calculator.net/tile-calculator.html',
    label: 'Calculator.net: Tile calculator reference',
  },
  omniTile: {
    href: 'https://www.omnicalculator.com/construction/tile',
    label: 'Omni Calculator: Tile calculator reference',
  },
  ukBoardFoot: {
    href: 'https://publications.ca.uky.edu/sites/publications.ca.uky.edu/files/for9.htm',
    label: 'University of Kentucky Extension: Measuring farm timber',
  },
  usForestServiceLogRules: {
    href: 'https://research.fs.usda.gov/treesearch/9829',
    label: 'USDA Forest Service: A collection of log rules',
  },
  tennesseeBoardFootRules: {
    href: 'https://utia.tennessee.edu/publications/wp-content/uploads/sites/269/2023/10/W262.pdf',
    label: 'University of Tennessee Extension: Doyle and International board foot rules',
  },
  asphaltInstituteQuantity: {
    href: 'https://www.asphaltinstitute.org/engineering/engineering-faqs/',
    label: 'Asphalt Institute: asphalt quantity and density FAQ',
  },
  pavementInteractiveCompaction: {
    href: 'https://pavementinteractive.org/compaction-and-measuring-pavement-density/',
    label: 'Pavement Interactive: compaction and pavement density',
  },
  napaEngineeringAsphalt: {
    href: 'https://www.asphaltpavement.org/all-about-asphalt/asphalt-facts/engineering/',
    label: 'NAPA: Engineering asphalt pavement',
  },
  yorkWallpaperRoomChart: {
    href: 'https://www.yorkwallcoverings.com/documents/how-much-wallpaper.pdf',
    label: 'York Wallcoverings: Wallpaper room estimate chart',
  },
  lowesWallpaperInstall: {
    href: 'https://www.lowes.com/pdf/Step-by-Step-Guide-Wallpaper-Installation.pdf',
    label: 'Lowe\'s: Peel-and-stick wallpaper installation guide',
  },
  grahamBrownWallpaperAmount: {
    href: 'https://support.grahambrown.com/hc/en-us/articles/207134025-How-do-I-know-how-much-wallpaper-I-need',
    label: 'Graham & Brown: How much wallpaper you need',
  },
  grahamBrownWallpaperBatch: {
    href: 'https://support.grahambrown.com/hc/en-us/articles/4407747771026-What-is-a-batch-number',
    label: 'Graham & Brown: Wallpaper batch number guidance',
  },
  lowesSiding: {
    href: 'https://www.certainteed.com/products/documents-downloads',
    label: 'CertainTeed: Siding documents and installation resources',
  },
  inchSidingCalculator: {
    href: 'https://www.inchcalculator.com/siding-squares-calculator/',
    label: 'Inch Calculator: Siding material calculator',
  },
  certainTeedMeasureVinylSiding: {
    href: 'https://www.certainteed.com/how-measure-vinyl-siding',
    label: 'CertainTeed: How to measure vinyl siding',
  },
  glenGeryBrickSizes: {
    href: 'https://www.glengery.com/brick-sizes',
    label: 'Glen-Gery: Brick sizes and pieces per square foot',
  },
  criResidentialCarpetInstallation: {
    href: 'https://carpet-rug.org/wp-content/uploads/2019/03/CRI-105-STANDARD-For-INSTALLATION-of-RESIDENTIAL-CARPET.pdf',
    label: 'Carpet and Rug Institute: CRI 105 residential carpet installation standard',
  },
  decksComDeckCost: {
    href: 'https://www.decks.com/calculators/cost-to-build-a-deck',
    label: 'Decks.com: Cost to build a deck calculator',
  },
  trexDeckCostCalculator: {
    href: 'https://www.trex.com/build-your-deck/planyourdeck/deck-cost-landing/productcalculator/',
    label: 'Trex: Deck material cost calculator notes',
  },
  homeAdvisorDeckCost: {
    href: 'https://www.homeadvisor.com/cost/decks-and-porches/',
    label: 'HomeAdvisor: Decking price guide',
  },
  certainteedDrywallCalculator: {
    href: 'https://www.certainteed.com/drywall-calculator',
    label: 'CertainTeed: Drywall calculator',
  },
  usgMaterialEstimators: {
    href: 'https://www.usg.com/content/usgcom/en/resource-center/tools/domedesigner.html',
    label: 'USG: Material estimators',
  },
  inchCalculatorDrywall: {
    href: 'https://www.inchcalculator.com/drywall-calculator/',
    label: 'Inch Calculator: Drywall calculator',
  },
  procoreDrywallCalculator: {
    href: 'https://www.procore.com/library/calculators/drywall-calculator',
    label: 'Procore: Drywall calculator',
  },
  lowesFenceCalculator: {
    href: 'https://pdf.lowes.com/productdocuments/d27b01be-ea65-4de6-aa9c-7a485c4bab31/43237730.pdf',
    label: 'Lowe\'s: Fence calculator worksheet',
  },
  lowesFenceLayout: {
    href: 'https://www.lowes.com/pdf/1203_Fence_Installation_Tips_-_Layout_and_Digging_Post_Holes_V5.pdf',
    label: 'Lowe\'s: Fence layout and post-hole tips',
  },
  tallyardFenceCalculator: {
    href: 'https://www.tallyard.com/fence-calculator',
    label: 'Tallyard: Fence calculator',
  },
  proBuilderFenceCalculator: {
    href: 'https://www.probuildercalc.com/calculators/fence-material',
    label: 'ProBuilderCalc: Fence material calculator',
  },
  tallyardGravelCalculator: {
    href: 'https://www.tallyard.com/gravel-calculator',
    label: 'Tallyard: Gravel calculator',
  },
  inchCalculatorGravelDriveway: {
    href: 'https://www.inchcalculator.com/gravel-driveway-calculator/',
    label: 'Inch Calculator: Gravel driveway calculator',
  },
  calcipediaGravelDriveway: {
    href: 'https://www.calcipedia.org/calculators/gravel-driveway-calculator/',
    label: 'Calcipedia: Gravel driveway calculator',
  },
  homeDepotMulchCalculator: {
    href: 'https://www.homedepot.com/calculator/mulch/',
    label: 'The Home Depot: Mulch and top soil calculator',
  },
  calcShedTopsoilCalculator: {
    href: 'https://calcshed.com/topsoil-calculator/',
    label: 'CalcShed: Topsoil calculator',
  },
  calcSummitTopsoilCalculator: {
    href: 'https://calcsummit.com/calculators/construction/topsoil/',
    label: 'CalcSummit: Topsoil calculator',
  },
  vastCalcSoilCalculator: {
    href: 'https://vastcalc.com/calculators/construction/soil',
    label: 'VastCalc: Soil calculator',
  },
  inchCalculatorMulch: {
    href: 'https://www.inchcalculator.com/mulch-calculator/',
    label: 'Inch Calculator: Mulch calculator',
  },
  nrcsTexasMulching: {
    href: 'https://www.nrcs.usda.gov/sites/default/files/2022-09/Texas_conservation_in_Your_Backyard_Mulching_Accessible.pdf',
    label: 'USDA NRCS Texas: Mulching guide',
  },
  biaBrickEstimating: {
    href: 'https://www.gobrick.com/media/file/10-dimensioning-and-estimating-brick-masonry.pdf',
    label: 'Brick Industry Association: Dimensioning and estimating brick masonry',
  },
  archtoolboxCmu: {
    href: 'https://www.archtoolbox.com/cmu-sizes-shapes-finishes/',
    label: 'Archtoolbox: CMU sizes, nominal dimensions, and mortar joints',
  },
  cmhaConcreteMasonryEstimating: {
    href: 'https://www.cmha.org/resource/tek-04-02a/',
    label: 'CMHA: Estimating concrete masonry materials',
  },
  cmhaGroutConcreteMasonry: {
    href: 'https://www.cmha.org/resource/tek-09-04a/',
    label: 'CMHA: Grout for concrete masonry',
  },
  cmhaGroutingWalls: {
    href: 'https://www.cmha.org/resource/tek-03-02a/',
    label: 'CMHA: Grouting concrete masonry walls',
  },
  cmhaModularConcreteMasonry: {
    href: 'https://www.cmha.org/resource/tek-05-12/',
    label: 'CMHA: Modular layout of concrete masonry',
  },
  cmhaConcreteMasonryConstruction: {
    href: 'https://www.cmha.org/resource/tek-03-08a/',
    label: 'CMHA: Concrete masonry construction guidance',
  },
  cmhaSegmentalRetainingWallInstall: {
    href: 'https://www.cmha.org/resource/srw-man-003/',
    label: 'CMHA: Segmental Retaining Wall Installation Guide',
  },
  cmhaSegmentalRetainingWallGuide: {
    href: 'https://www.cmha.org/resource/srw-tec-005/',
    label: 'CMHA: Guide to Segmental Retaining Walls',
  },
  cmhaSegmentalRetainingWallDesign: {
    href: 'https://www.cmha.org/resource/srw-tec-004/',
    label: 'CMHA: Segmental Retaining Wall Design',
  },
  allanBlockRetainingWallPlanning: {
    href: 'https://www.allanblock.com/docs/Commercial_Installation_Manual/retaining-wall-planning.html',
    label: 'Allan Block: Retaining Wall Planning Guide',
  },
  usgaScoreDifferential: {
    href: 'https://digital-pd.usga.org/content/usga/home-page/handicapping/world-handicap-system/world-handicap-system-usga-golf-faqs/faqs---what-is-a-score-differential.html',
    label: 'USGA: What is a Score Differential',
  },
  usgaCourseHandicap: {
    href: 'https://digital-pd.usga.org/content/usga/home-page/handicapping/world-handicap-system/world-handicap-system-usga-golf-faqs/faqs---calculate-course-handicap-and-playing-handicap.html',
    label: 'USGA: Course Handicap and Playing Handicap',
  },
  usgaHandicapDefinitions: {
    href: 'https://www.usga.org/handicapping/roh/Content/rules/Definitions.htm',
    label: 'USGA: Rules of Handicapping definitions',
  },
  googleHelpfulContent: {
    href: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
    label: 'Google Search Central: Creating helpful, reliable, people-first content',
  },
  googleSeoStarter: {
    href: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide',
    label: 'Google Search Central: SEO Starter Guide',
  },
  googleSnippets: {
    href: 'https://developers.google.com/search/docs/appearance/snippet',
    label: 'Google Search Central: Snippets',
  },
  hhsHealthyRelationships: {
    href: 'https://opa.hhs.gov/adolescent-health/healthy-relationships-adolescence',
    label: 'HHS OPA: Healthy relationships in adolescence',
  },
  youthGovHealthyRelationships: {
    href: 'https://youth.gov/youth-topics/teen-dating-violence/characteristics',
    label: 'Youth.gov: Characteristics of healthy relationships',
  },
  nistRandomNumber: {
    href: 'https://csrc.nist.gov/glossary/term/random_number',
    label: 'NIST CSRC: Random number glossary',
  },
  mdnCryptoGetRandomValues: {
    href: 'https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues',
    label: 'MDN: Crypto getRandomValues()',
  },
  ftcWebAppsCollectInfo: {
    href: 'https://consumer.ftc.gov/articles/how-websites-apps-collect-use-your-information',
    label: 'FTC: How websites and apps collect and use your information',
  },
  mdnTextEncoder: {
    href: 'https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder/encode',
    label: 'MDN: TextEncoder encode()',
  },
  mdnStringLength: {
    href: 'https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/length',
    label: 'MDN: JavaScript String length',
  },
  openAiTokens: {
    href: 'https://developers.openai.com/cookbook/examples/how_to_count_tokens_with_tiktoken',
    label: 'OpenAI Cookbook: How to count tokens with tiktoken',
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
  wcagContrastMinimum: {
    href: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html',
    label: 'W3C WAI: Understanding contrast minimum',
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
  mdnAspectRatio: {
    href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio',
    label: 'MDN: CSS aspect-ratio',
  },
  githubGfmTables: {
    href: 'https://github.github.io/gfm/',
    label: 'GitHub Flavored Markdown Spec: Tables',
  },
};

const guideDetails: Record<string, UtilityGuideDetail> = {
  'age-calculator': {
    title: 'Age Calculator Guide',
    summary: 'Learn how to check exact age, total days lived, and the next birthday from two calendar dates.',
    metaDescription:
      'Use the Age Calculator guide to enter a birth date, choose an as-of date, read exact age, check total days, and avoid leap-day or cutoff mistakes.',
    purpose:
      'The Age Calculator is for exact calendar age, not just a rough birth-year guess. It compares a birth date with the as-of date you choose, then shows years, months, days, total days, and the next birthday countdown.',
    intro:
      'Use it when the exact date matters: a birthday, a form, a school cutoff, a future event, or a quick check before you copy an age somewhere else.',
    inputMatch: 'a birth date and an as-of date entered as real YYYY-MM-DD calendar dates',
    logicNote:
      'The tool counts completed years first, then completed months, then leftover days. It also counts total days using date-only UTC math so clock time and daylight-saving changes do not move the answer.',
    readIntro:
      'Read the years-months-days line first, then use total days or next birthday only if that is the number your task needs.',
    mistakeIntro:
      'Most wrong age results come from using today when you needed a future cutoff date, swapping month and day order, or treating a legal rule like it has the same birthday rule as a simple calculator.',
    referenceIntro:
      'These references help check date format and browser date behavior used by this guide.',
    enter: [
      'Enter the birth date in the first date field.',
      'Enter the as-of date in the second field. Use today only when you really mean today.',
      'Use a future as-of date for a school cutoff, sports age group, birthday, deadline, or event date.',
    ],
    read: [
      'The main answer shows completed years, months, and days.',
      'Total days is useful when you need one continuous day count instead of calendar age.',
      'Next birthday shows the next matching month and day after the as-of date.',
    ],
    mistakes: [
      'Do not use this as a final legal age decision when a rule has its own cutoff.',
      'Do not confuse exact calendar age with rough age by birth year.',
      'Do not assume every leap-day rule uses the same non-leap-year birthday.',
      'Check the as-of date before copying the result.',
    ],
    extraSections: [
      {
        title: 'Quick example',
        paragraphs: [
          'If someone was born on 2010-04-30 and the as-of date is 2026-04-30, the answer is 16 years, 0 months, and 0 days. If the as-of date is 2026-04-29, they are still 15 years, 11 months, and 30 days.',
        ],
      },
      {
        title: 'Leap-day birthdays',
        paragraphs: [
          'A February 29 birthday is a real date, but non-leap years can be handled differently by schools, sports groups, insurance forms, and legal rules. Use the calculator for the date math, then check the official rule when the result matters.',
        ],
      },
      {
        title: 'Calendar age vs total days',
        paragraphs: [
          'Calendar age feels natural because people talk in years, months, and days. Total days is better when the exact continuous day count matters. They are both useful, but they answer different questions.',
        ],
      },
      {
        title: 'Useful related checks',
        paragraphs: [
          'If you need the number of days between two dates without calling it an age, use the Date Calculator. If time of day matters, use a time or hours tool instead of this date-only page.',
        ],
        links: [
          { href: '/tools/date-calculator/', label: 'Count days between two dates' },
          { href: '/tools/time-calculator/', label: 'Work with clock time' },
        ],
      },
    ],
    sidecarText:
      'Open the Age Calculator beside this guide. Try the birthday-today example first, then change the birth date and as-of date to your own check.',
    sources: [sourceLinks.isoDate, sourceLinks.mdnDate, sourceLinks.mdnDateInput],
  },
  'date-calculator': {
    title: 'Date Calculator Guide',
    summary: 'Count days between dates, add 45 days, or check month-end shifts without vague calendar math.',
    purpose:
      'The Date Calculator answers calendar questions like "how many days until this deadline?" and "what date is 45 days from now?"',
    intro:
      'It uses date-only math, so it is better for calendars than clock times, shifts, or time-zone scheduling.',
    inputMatch: 'a real YYYY-MM-DD calendar date and the mode you mean: difference or add/subtract',
    logicNote:
      'For 2026-05-26 to 2026-06-10, the result is 15 days. Same start and end date gives 0 days because the start date is not counted as a completed day.',
    readIntro:
      'Read the big answer first, then check the weeks-and-days line or the result-date line to make sure it matches how you plan to use it.',
    mistakeIntro:
      'Date mistakes are usually small but annoying: the wrong mode, a mixed-up date format, or forgetting whether weekends and holidays count.',
    enter: [
      'Use Difference mode when you need days between two dates.',
      'Use Add or subtract mode when you need a date before or after a starting date.',
      'Enter dates as YYYY-MM-DD calendar dates, not times of day.',
    ],
    read: [
      'Days gives the full day count between dates, without counting the start date as a finished day.',
      'Weeks and days splits that count into whole weeks plus remaining days.',
      'Result date shows the final date after years, months, weeks, and days are applied.',
    ],
    mistakes: [
      'Do not use this for business-day counts unless weekends and holidays do not matter.',
      'Do not use it as a time-zone scheduler.',
      'Do not enter dates like 05/06/2026 if month/day order could be confused.',
      'For month-end dates, remember that shorter months may clamp to the last valid day.',
    ],
    extraSections: [
      {
        title: 'Quick examples to check yourself',
        paragraphs: [
          'A few simple examples make this page easier to trust before you use it on a real deadline.',
        ],
        bullets: [
          '2026-05-26 to 2026-06-10 gives 15 days, which is 2 weeks and 1 day.',
          '2026-05-26 plus 6 weeks and 3 days gives 2026-07-10.',
          '2026-01-31 plus 1 month gives 2026-02-28 because February 2026 does not have 31 days.',
        ],
      },
      {
        title: 'When this is not enough',
        paragraphs: [
          'Use this calculator for calendar math. Do not use it by itself when a school, court, airline, workplace, bank, or local rule decides how a deadline is counted.',
          'For business days, holidays, daylight-saving changes, or exact appointment times, check the official rule and local time zone too.',
        ],
      },
    ],
    sources: [sourceLinks.isoDate, sourceLinks.mdnDate],
  },
  'time-calculator': {
    summary: 'Learn how to add or subtract time durations in hours, minutes, and seconds.',
    metaDescription:
      'Use the Time Calculator guide to add or subtract hours, minutes, and seconds, then read normalized H:M:S, total seconds, and decimal hours.',
    purpose:
      'The Time Calculator is for duration math, not clock scheduling. It helps combine or compare blocks of time such as videos, workouts, tasks, study sessions, playlists, or logs.',
    intro:
      'Open the calculator with one real duration beside you, decide whether the second duration should be added or subtracted, and use the Hours Calculator instead when your question starts with clock times like 9:15 AM to 5:40 PM.',
    inputMatch:
      'the two durations you want to combine or compare: first hours, minutes, seconds, operation, second hours, minutes, and seconds',
    logicNote:
      'For 2:45:30 + 1:20:45, the calculator converts the inputs to 9,930 seconds and 4,845 seconds, adds them to 14,775 seconds, then displays 4h 6m 15s and 4.1041666667 decimal hours.',
    readIntro:
      'The normalized H:M:S result is the human-readable answer. Total seconds is useful for systems and media work. Decimal hours is useful for sheets, logs, or rough invoices when your rule allows decimal-hour entry.',
    mistakeIntro:
      'Most wrong answers come from treating durations like clock times, using the wrong add/subtract mode, or entering minutes and seconds in a format that does not match the fields.',
    enter: [
      'Enter the first duration as hours, minutes, and seconds, such as 2 hours, 45 minutes, and 30 seconds.',
      'Choose add when combining durations or subtract when removing elapsed time from a planned amount.',
      'Enter the second duration and calculate, keeping minutes and seconds in the 0 to 59 range.',
    ],
    read: [
      'The main answer normalizes the result into hours, minutes, and seconds.',
      'Total seconds is useful for technical logs, media timelines, timers, scripts, or other tools that expect seconds.',
      'Decimal hours is useful when a duration needs to be entered into a spreadsheet or another calculator.',
      'A negative result means the subtracted duration was longer than the starting duration.',
    ],
    mistakes: [
      'Do not use duration math as a time-zone, calendar, appointment, or daylight-saving calculator.',
      'Keep minutes and seconds between 0 and 59; convert 90 seconds to 1 minute 30 seconds before entering it.',
      'Use the Hours Calculator when you have clock start and end times.',
      'Check payroll, billing, break, overtime, and rounding rules before using decimal hours for official records.',
    ],
    extraSections: [
      {
        title: 'Worked examples to compare',
        paragraphs: [
          'Use one of these examples before replacing the numbers with your own. They show the result format you should expect from the live calculator.',
        ],
        bullets: [
          'Add two durations: 2:45:30 plus 1:20:45 becomes 4h 6m 15s, or 14,775 total seconds.',
          'Clean up rollover seconds: 0:59:50 plus 0:00:25 becomes 1h 0m 15s because 75 seconds rolls into 1 minute 15 seconds.',
          'Subtract elapsed time: 5:00:00 minus 1:35:15 leaves 3h 24m 45s.',
          'Add a playlist total: 0:42:30 plus 0:18:45 becomes 1h 1m 15s.',
        ],
      },
      {
        title: 'When to switch tools',
        paragraphs: [
          'Use the Time Calculator when both inputs are durations. Switch tools when the question is about clock times, calendar dates, ages, or deadlines.',
          'A duration is a length of time, such as 42 minutes and 30 seconds. A clock time is a point in a day, such as 9:15 AM.',
        ],
        links: [
          { href: '/tools/hours-calculator/', label: 'Hours Calculator for start and end clock times' },
          { href: '/tools/date-calculator/', label: 'Date Calculator for calendar day math' },
          { href: '/tools/age-calculator/', label: 'Age Calculator for exact calendar age' },
        ],
      },
    ],
    sources: [sourceLinks.isoDate, sourceLinks.nistTime],
  },
  'hours-calculator': {
    summary:
      'Learn how to calculate hours worked, decimal hours, unpaid breaks, overnight shifts, and simple gross pay.',
    metaDescription:
      'Use the Hours Calculator guide to turn start time, end time, unpaid breaks, and optional hourly rate into worked hours, decimal hours, and gross pay.',
    purpose:
      'The Hours Calculator turns a start time, end time, and unpaid break into the hours you worked. It shows the answer as decimal hours for time sheets, hours and minutes for easy reading, and a simple gross pay estimate when you add an hourly rate.',
    intro:
      'This guide is for the moment when your shift log says 9:00 AM to 5:30 PM, your break was 30 minutes, and you need the number that goes on a time sheet or invoice. The calculator handles the time math, including overnight shifts, but it does not decide payroll rules for you.',
    inputMatch: 'the start clock time, end clock time, unpaid break minutes, and optional hourly rate',
    logicNote:
      'For 9:00 AM to 5:30 PM with a 30 minute break, the calculator counts 8.5 hours from start to end, subtracts 0.5 hours, and returns 8.0 decimal hours. If you add $25/hour, gross pay is $200.00.',
    readIntro:
      'Read decimal hours when a payroll form, invoice, or spreadsheet needs one number. Read the hours-and-minutes line when you want the everyday version of the same duration.',
    mistakeIntro:
      'The biggest mistakes are small input mistakes: mixing up AM and PM, entering paid breaks as unpaid breaks, or forgetting that an overnight end time is on the next day. Official payroll rounding, overtime, and break rules still need the policy that applies to you.',
    enter: [
      'Enter the clock time when the shift started.',
      'Enter the clock time when the shift ended. If the shift crosses midnight, use the next-day end time you mean.',
      'Enter only unpaid break minutes. Leave paid breaks out because they still count as worked time.',
      'Add an hourly rate only when you want a quick gross pay estimate before taxes, deductions, overtime, or premiums.',
    ],
    read: [
      'Decimal hours is the value usually used on time sheets. For example, 7 hours 30 minutes becomes 7.5 hours.',
      'Hours and minutes gives a more readable duration so you can sanity-check the result.',
      'Gross pay multiplies decimal hours by the hourly rate you entered. It is a simple estimate, not a final paycheck.',
      'If the end time is earlier than the start time, the calculator treats it as an overnight shift and counts through midnight.',
    ],
    mistakes: [
      'Do not treat the result as payroll advice or a legal wage calculation.',
      'Check employer rounding, overtime, split-shift, holiday, travel, and break rules separately.',
      'Do not subtract paid breaks. Only subtract break time that should not count as work time.',
      'Watch AM and PM. 8:00 AM to 4:30 PM is a normal day shift; 8:00 PM to 4:30 AM is overnight.',
      'If a shift spans time zones, daylight saving changes, or manual clock edits, confirm the official timekeeping record.',
    ],
    extraSections: [
      {
        title: 'Worked shift examples to compare',
        paragraphs: [
          'Use these examples to check whether your own result feels right before you copy it into a time sheet, invoice, or notes app.',
        ],
        bullets: [
          'Day shift: 9:00 AM to 5:30 PM with a 30 minute break spans 8.5 hours, subtracts 0.5 hours, and returns 8.0 hours.',
          'No break: 8:15 AM to 4:00 PM returns 7.75 hours, which is 7 hours 45 minutes.',
          'Overnight: 10:00 PM to 6:30 AM with a 45 minute break returns 7.75 hours.',
          'With pay: 1:20 PM to 6:50 PM with a 15 minute break returns 5.25 hours; at $18/hour, gross pay is $94.50.',
        ],
      },
      {
        title: 'When this guide is not enough',
        paragraphs: [
          'Use this guide for clean time math. Use your employer policy, contract, payroll system, or local labor rules for decisions about rounding, overtime, unpaid breaks, paid breaks, shift premiums, and final pay.',
          'If you are checking a whole week of shifts, a time-card workflow may be easier than one shift at a time. If you are turning pay into yearly or monthly income, use a salary tool after you know the hourly amount is right.',
        ],
        links: [
          { href: '/tools/time-card-calculator/', label: 'Time Card Calculator for weekly shift totals' },
          { href: '/tools/time-calculator/', label: 'Time Calculator for adding plain durations' },
          { href: '/tools/salary-calculator/', label: 'Salary Calculator for pay-period estimates' },
        ],
      },
    ],
    sources: [sourceLinks.isoDate, sourceLinks.nistTime],
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
    summary: 'Learn how length, width, depth, and waste become concrete cubic yards and bag counts.',
    purpose:
      'The Concrete Calculator is a first-pass material estimator for a simple rectangular slab, pad, or walkway. It converts slab dimensions into cubic feet, cubic yards, cubic meters, and approximate bag counts.',
    enter: [
      'Enter length and width in feet using the inside edges of the form.',
      'Enter slab depth in inches. The calculator converts that depth to feet before multiplying.',
      'Add extra waste percentage when the site, forms, base, or ordering method need a buffer.',
    ],
    read: [
      'Cubic yards is the common ready-mix ordering unit in the United States. The calculator divides adjusted cubic feet by 27.',
      'Cubic feet helps with small projects and bag estimating.',
      'Bag counts are rounded up because you cannot buy a partial bag, and the exact yield should be checked on the bag label.',
      'A 10 ft by 12 ft slab at 4 inches thick is 40 cubic feet before waste and about 1.63 cubic yards with 10% waste.',
    ],
    mistakes: [
      'Do not use feet for depth when the field expects inches.',
      'Do not ignore uneven ground, form loss, low spots, spillage, base prep, or compaction.',
      'Ask a qualified contractor or supplier for structural work, code-sensitive pours, ready-mix truck minimums, and final ordering.',
    ],
    sources: [sourceLinks.quickrete, sourceLinks.nistConversionFactors, sourceLinks.nistUnits, sourceLinks.googleHelpfulContent],
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
    metaDescription:
      'Learn how to use the Dice Roller for 2d6, d20, percentile, and custom dice rolls. See what dice count, sides, modifiers, subtotals, and casual randomness limits mean.',
    purpose:
      'The Dice Roller is for quick, casual random rolls. It shows every die, the subtotal, the modifier, and the final total so the result is easy to check.',
    intro:
      'Use it for a board-game roll, tabletop check, classroom example, or quick custom die test. Pick the dice count, sides per die, and optional modifier, then read the individual rolls before trusting the total.',
    inputMatch: 'the dice count, sides per die, and optional modifier your game, lesson, or example actually calls for',
    logicNote:
      'For example, 2d6 rolls two separate numbers from 1 through 6, adds them as the subtotal, then applies the modifier. A 1d20 + 5 check rolls one number from 1 through 20 and adds 5 after the die result.',
    readIntro:
      'Read the final total first, then check Rolls, Subtotal, and Modifier. If a game asks for the natural die result, use the individual roll; if it asks for the check total, use the final total.',
    mistakeIntro:
      'Dice rolls usually go wrong when the notation is misunderstood: 2d6 means two six-sided dice, d20 means one 20-sided die, and +5 is added after the die result.',
    sidecarText:
      'Open the Dice Roller beside this guide. Try 2d6, 1d20 + 5, and 4d10 once, then replace the dice count, sides, and modifier with your own game or lesson.',
    bestUsesIntro:
      'Use this guide when you know the roll notation but want to double-check what each part of the result means before using it.',
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
    extraSections: [
      {
        title: '2d6, 1d20 + 5, and 4d10 examples',
        paragraphs: [
          'A 2d6 roll means two six-sided dice. If the rolls are 4 and 5, the subtotal is 9, and the final total is still 9 unless you add a modifier.',
          'A 1d20 + 5 check means one 20-sided die plus a modifier of 5. If the die shows 13, the subtotal is 13 and the final total is 18.',
          'A 4d10 roll means four ten-sided dice. That is useful when a game or lesson asks for several dice at once and you need to see each die, not just the total.',
        ],
      },
      {
        title: 'Why streaks can happen',
        paragraphs: [
          'Random does not mean even in the next few rolls. You can roll three low numbers in a row, repeat the same face twice, or miss a high number for a while, and that can still be normal casual randomness.',
          'That is why the page shows every die result. If the total feels surprising, check the individual rolls and the modifier before assuming something went wrong.',
        ],
      },
      {
        title: 'When to use a different random tool',
        paragraphs: [
          'Use this page when the result should feel like dice: d6, d20, d100, multiple dice, or a modifier after the roll.',
          'Use the Random Number Generator when you need numbers in a custom range, unique picks, sorting, or copied lists instead of dice-style notation.',
        ],
      },
    ],
    referenceIntro:
      'These references explain browser random-number behavior, random-number language, and people-first limits behind the guide. They do not turn a casual dice roll into certified randomness.',
    sources: [sourceLinks.mdnCryptoGetRandomValues, sourceLinks.nistRandomNumber, sourceLinks.googleHelpfulContent],
  },
  'fuel-cost-calculator': {
    title: 'Fuel Cost Calculator Guide',
    summary: 'Learn how miles, MPG, and pump price turn into gallons, trip fuel cost, and cost per mile.',
    purpose:
      'The Fuel Cost Calculator turns one-way miles, MPG, pump price, and round-trip choice into a fuel-only estimate. It is for quick trip budgeting, not live gas prices, tolls, parking, or tax reimbursement.',
    intro:
      'Start with the one-way miles, add the MPG you expect, type the pump price, and turn on round trip only when the return drive should be counted too.',
    inputMatch:
      'your one-way route distance, expected MPG, price per gallon, and whether the return drive should be included',
    logicNote:
      'Use the 120-mile road trip example as a quick check: round trip turns 120 miles into 240 miles before gallons and cost are calculated.',
    readIntro:
      'Read the fuel cost first, then check gallons needed, cost per mile, and total distance so you can spot a wrong distance or MPG before using the number.',
    mistakeIntro:
      'Fuel estimates go wrong fastest when the distance, round-trip switch, MPG, or pump price does not match the trip you are actually planning.',
    sidecarText:
      'Open the Fuel Cost Calculator beside this guide. Try the 120-mile example first, then swap in your own route miles, MPG, and fuel price.',
    enter: [
      'Enter the one-way trip distance in miles, even if you are planning to come back.',
      'Enter the MPG you expect for this trip, not the best number your car ever showed.',
      'Enter fuel price per gallon, then turn on round trip if the calculator should double the distance.',
    ],
    read: [
      'Fuel cost is the fuel-only estimate for the selected one-way or round-trip distance.',
      'Gallons needed shows how many gallons the trip uses at the MPG you entered.',
      'Cost per mile shows the fuel cost for each mile, which helps compare cars, routes, or gas prices.',
    ],
    mistakes: [
      'Do not mix a round-trip distance with the round-trip switch. That doubles the trip twice.',
      'Do not treat EPA MPG as a promise. Speed, traffic, hills, weather, cargo, and tires can change real MPG.',
      'Do not use the IRS mileage rate as the fuel price. That rate covers more than gasoline.',
      'Do not forget tolls, parking, rental fees, and wear if you need a full travel budget.',
    ],
    extraSections: [
      {
        title: 'Road trip example',
        paragraphs: [
          'Say the destination is 120 miles away, the car gets 28 MPG, gas is $3.75 per gallon, and round trip is turned on. The calculator doubles the trip to 240 miles, divides by 28 MPG, and gets about 8.57 gallons.',
          'Then it multiplies 8.57 gallons by $3.75. The fuel-only estimate is about $32.14, or about 13.4 cents per mile.',
        ],
      },
      {
        title: 'What number should I use for MPG?',
        paragraphs: [
          'If you have recent real MPG for your own car, use that. EPA fuel economy labels are useful for comparing vehicles, but your route can be worse or better than the label.',
          'A heavy load, fast highway driving, stop-start traffic, cold weather, tire pressure, and hills can all move the real fuel cost.',
        ],
      },
      {
        title: 'Fuel cost versus mileage reimbursement',
        paragraphs: [
          'Fuel cost is only gallons times price per gallon. The IRS mileage rate is different because it is meant for tax or reimbursement rules and can include more than fuel.',
          'For a personal trip budget, use this fuel estimate first, then add tolls, parking, rental fees, and other costs yourself.',
        ],
      },
    ],
    sources: [
      sourceLinks.epaFuelEconomy,
      sourceLinks.eiaGasolinePrices,
      sourceLinks.irsMileage,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'square-footage-calculator': {
    title: 'Square Footage Calculator Guide',
    summary: 'Learn how length, width, quantity, and decimal feet turn into square footage you can actually use.',
    metaDescription:
      'Use the Square Footage Calculator guide to measure rooms, walls, panels, gardens, and repeated rectangles, with inch conversion and material-waste checks.',
    purpose:
      'The Square Footage Calculator turns a rectangular measurement into square feet, square yards, and square meters. It is useful for rooms, floors, walls, panels, garden beds, closets, and repeated same-size sections.',
    intro:
      'Use this guide when you have a tape-measure number and need a clean area answer before buying flooring, paint, wallpaper, sod, tile, panels, or project material. The important choice is whether one rectangle is enough or whether the space should be split into smaller rectangles first.',
    inputMatch:
      'the length in feet, width in feet, and quantity of identical rectangles from the same room, wall, panel, bed, or section',
    logicNote:
      'The math is square feet = length in feet x width in feet x quantity. The guide examples keep every measurement in feet first, then use square yards = square feet / 9 and square meters = square feet / 10.7639 for comparison.',
    readIntro:
      'Read total square footage first because that is the measured area. Use each-item area when you are checking one repeated wall or panel, and use square yards or square meters only when a product, plan, or quote uses those units.',
    mistakeIntro:
      'Most square-footage mistakes come from mixing inches and feet, using quantity for different-size rooms, treating linear feet like area, or forgetting that material orders usually need waste, openings, and product coverage rules.',
    bestUsesIntro:
      'Use this guide when you are measuring a rectangular space, splitting an irregular space into rectangles, or checking a rough project area before moving to a material-specific calculator.',
    enter: [
      'Enter the length and width of one rectangular section in feet.',
      'Convert inches to decimal feet before entering a mixed measurement, such as 9 ft 6 in becoming 9.5 ft.',
      'Use quantity only when the same rectangle repeats exactly, such as two matching walls or three identical panels.',
      'Calculate once for each different-size room or section, then add those results separately.',
    ],
    read: [
      'Total square feet is the main measured area answer.',
      'Each item shows the square footage of one rectangle before quantity is applied.',
      'Square yards helps when carpet, fabric, or yard-based material is quoted that way.',
      'Square meters helps when a product sheet, plan, or assignment uses metric area.',
    ],
    mistakes: [
      'Do not enter inches as whole feet. Six inches is 0.5 ft, not 6 ft.',
      'Do not use quantity for different-size rooms, walls, or panels.',
      'Do not use a rectangle formula for an L-shaped room without splitting it into rectangles first.',
      'Do not treat square footage as the final purchase amount for flooring, tile, paint, wallpaper, or sod.',
      'Check whether product coverage is listed per box, per roll, per gallon, per square, or per pallet.',
    ],
    extraSections: [
      {
        title: 'Example: a 12 ft by 10 ft bedroom',
        paragraphs: [
          'For a simple bedroom, enter 12 for length, 10 for width, and 1 for quantity. The result is 120 ft2 because 12 x 10 x 1 = 120.',
          'That 120 ft2 is the measured floor footprint. If you are ordering flooring, you still need the product coverage, box rounding, cut waste, layout direction, and any installer guidance before you buy.',
        ],
      },
      {
        title: 'How to handle inches',
        paragraphs: [
          'The calculator asks for feet, so mixed measurements need to become decimal feet first. Divide inches by 12, then add that decimal to the feet.',
          'For example, 9 ft 6 in becomes 9.5 ft because 6 / 12 = 0.5. A 9.5 ft by 10.25 ft section is 97.375 ft2 before any waste or product rounding.',
        ],
      },
      {
        title: 'When quantity helps',
        paragraphs: [
          'Quantity is useful when the same rectangle repeats. Two identical 12 ft by 8 ft walls are 12 x 8 x 2 = 192 ft2. Three 8 ft by 4 ft panels are 96 ft2.',
          'If the walls, panels, rooms, or garden beds are different sizes, calculate each one separately. Quantity is not a shortcut for a mixed list of measurements.',
        ],
      },
      {
        title: 'Irregular rooms and openings',
        paragraphs: [
          'For an L-shaped room, split the shape into rectangles, calculate each rectangle, and add the square footage. This is usually more reliable than guessing one oversized rectangle and trying to subtract later.',
          'For wall projects, calculate the wall rectangle first, then subtract doors, windows, or other openings when the material calls for it. Floor area usually starts with the floor footprint instead of door or window openings.',
        ],
      },
      {
        title: 'Square footage is not the whole material order',
        paragraphs: [
          'Square footage is the measured area. A real order may need extra material for cuts, breakage, pattern matching, overlap, room shape, stairs, seams, texture, and product coverage rules.',
          'Use this page to get the area, then move to a material-specific calculator when you need boxes, gallons, rolls, pallets, or waste percent.',
        ],
        links: [
          { href: '/tools/flooring-calculator/', label: 'Estimate flooring boxes and waste' },
          { href: '/tools/paint-calculator/', label: 'Estimate paint gallons from wall area' },
          { href: '/tools/wallpaper-calculator/', label: 'Estimate wallpaper rolls after wall area' },
          { href: '/tools/sod-calculator/', label: 'Estimate sod from lawn square footage' },
        ],
      },
      {
        title: 'Square feet, square yards, and square meters',
        paragraphs: [
          'The main answer is square feet because the inputs are feet. Square yards divide that area by 9 because one square yard is 3 ft by 3 ft. Square meters divide by about 10.7639 because one square meter is about 10.7639 ft2.',
          'Those conversions are for reading and comparing area. They do not add waste, change a product coverage rule, or turn a floor measurement into wall material by themselves.',
        ],
      },
    ],
    sidecarText:
      'Open the Square Footage Calculator beside this guide. Try the 12 ft by 10 ft bedroom first, then replace it with one room, wall, panel, or garden bed from your own project.',
    sources: [sourceLinks.nistUnits, sourceLinks.bipmSi, sourceLinks.googleHelpfulContent],
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
    summary: 'Learn how to convert a UTC date and time into local time with an IANA time zone.',
    metaDescription:
      'Use the Time Zone Calculator guide to convert 2026-04-30 12:00 UTC to New York, London, Tokyo, or another IANA zone, with DST and date-change checks.',
    purpose:
      'The Time Zone Calculator uses one UTC instant as the starting point because UTC avoids ambiguity. It then shows the local date, local time, and UTC offset for the selected IANA time zone.',
    intro:
      'Time zones get confusing when a source gives one UTC time and everyone reads it in a different place. This guide shows how to turn that one UTC instant into a local date, local clock time, and offset you can double-check before sharing it.',
    inputMatch: 'one UTC calendar date, one UTC clock time, and the target IANA zone such as America/New_York',
    logicNote:
      'The calculator treats the date and time as UTC, then formats that same instant in the selected IANA time zone using the browser time-zone database. That matters because the UTC offset can change during daylight-saving periods.',
    readIntro:
      'Read the local date and time first, then check the UTC offset. If the local date changes, the event crossed midnight in that zone even though the UTC date stayed the same.',
    mistakeIntro:
      'The easiest mistake is entering a local time into the UTC fields. If your meeting invite already says 8:00 AM New York time, do not type 8:00 as UTC unless the invite explicitly says 08:00 UTC or 08:00Z.',
    bestUsesIntro:
      'Use this guide when you have a UTC timestamp from a calendar, launch note, server log, webinar, game event, or API response and need to read it in a real named time zone.',
    enter: [
      'Enter the UTC calendar date from the source timestamp or schedule.',
      'Enter the UTC clock time, usually in 24-hour form when the source says UTC or Z.',
      'Choose the target IANA time zone, such as America/New_York, Europe/London, or Asia/Tokyo.',
    ],
    read: [
      '2026-04-30 12:00 UTC becomes 2026-04-30 08:00 in America/New_York with offset UTC-04:00.',
      'The same UTC instant becomes 13:00 in Europe/London and 21:00 in Asia/Tokyo on that date.',
      'The IANA zone name is shown so you can copy the exact zone identifier instead of an ambiguous abbreviation.',
    ],
    mistakes: [
      'Do not enter a local time and assume it is UTC.',
      'Do not rely on short labels like EST, CST, or GMT when the date may be in daylight-saving time.',
      'Use an official calendar invite, airline record, exchange notice, or scheduling system for critical meetings, flights, deadlines, and legal cutoffs.',
    ],
    extraSections: [
      {
        title: 'Example: 2026-04-30 12:00 UTC',
        paragraphs: [
          'Suppose a product launch note says the release is at 2026-04-30 12:00 UTC. Enter 2026-04-30 as the UTC date, 12:00 as the UTC time, and America/New_York as the target zone.',
          'The calculator shows 2026-04-30 08:00:00 in America/New_York, UTC-04:00. That means a New York reader should think of the launch as 8:00 AM local time on the same calendar date.',
          'Change the zone to Europe/London and the same instant reads 13:00, UTC+01:00. Change it to Asia/Tokyo and it reads 21:00, UTC+09:00. The UTC instant did not move; only the local display changed.',
        ],
      },
      {
        title: 'Why the IANA zone matters',
        paragraphs: [
          'IANA names are long on purpose. America/New_York tells the calculator which city rule set to use, including daylight-saving changes for that date.',
          'A short abbreviation can be unclear. EST may mean Eastern Standard Time, but New York in late April is usually on daylight time, so the offset is UTC-04:00 instead of UTC-05:00.',
        ],
      },
      {
        title: 'When the local date changes',
        paragraphs: [
          'Some conversions cross midnight. If a UTC time is late in the day, a zone east of UTC may move to the next local date. If a UTC time is early, a zone west of UTC may move to the previous local date.',
          'That date change is not an error. It is the main reason to check the local date as well as the local clock time before sending a meeting time, posting a deadline, or reading a server log.',
        ],
      },
    ],
    referenceIntro:
      'These references explain the time-zone database, date-time formats, and browser date behavior behind the conversion.',
    sources: [sourceLinks.ianaTimeZones, sourceLinks.isoDate, sourceLinks.mdnDate],
  },
  'gas-mileage-calculator': {
    summary: 'Learn how to calculate MPG from a fill-up, then read gallons per 100 miles and L/100 km without guessing.',
    metaDescription:
      'Use the Gas Mileage Calculator with a 350-mile, 12.5-gallon example. See MPG, gallons per 100 miles, L/100 km, and why one tank can mislead.',
    purpose:
      'The Gas Mileage Calculator turns a real tank or trip into MPG. It also shows gallons per 100 miles and liters per 100 km, which are fuel-used-per-distance numbers.',
    intro:
      'The cleanest way to check gas mileage is simple: use miles and gallons from the same fill-up. Mixing numbers from different trips is how MPG gets weird fast.',
    inputMatch: 'the miles driven and gallons used from the same tank, receipt, or trip window',
    logicNote:
      'The calculator divides miles by gallons for MPG. It also flips the idea into gallons per 100 miles, then converts MPG into L/100 km for metric comparison.',
    readIntro:
      'Read MPG as distance per gallon, so higher is better. Read gallons per 100 miles and L/100 km as fuel used per distance, so lower is better.',
    mistakeIntro:
      'The main mistake is using the wrong window: 350 miles from one tank and 12.5 gallons from another tank will not describe a real fill-up.',
    sidecarText:
      'Open the Gas Mileage Calculator beside this guide. Try 350 miles and 12.5 gallons first, then replace the numbers with your own fill-up.',
    bestUsesIntro:
      'Use this guide when you want to check one tank, compare two routes, or send a real MPG number into the Fuel Cost Calculator.',
    referenceIntro:
      'These references explain official fuel-economy context, MPG math, and why driving conditions can change real-world fuel use.',
    enter: [
      'Enter miles driven from your trip meter, odometer difference, or route log.',
      'Enter gallons used for that same distance, usually the gallons added at the next fill-up.',
      'Keep both numbers from the same tank or trip window.',
    ],
    read: [
      '350 miles and 12.5 gallons gives 28 MPG.',
      'The same fill-up is about 3.57 gallons per 100 miles.',
      'The metric version is about 8.4 L/100 km.',
    ],
    mistakes: [
      'Do not mix miles from one trip with gallons from another.',
      'Do not panic over one odd tank. Pump shutoff and fill level can shift the gallons number.',
      'Weather, traffic, tire pressure, extra load, and speed can change the result.',
      'Do not use this as a lab test of the EPA label. It is your real-world fill-up math.',
    ],
    extraSections: [
      {
        title: 'Example: 350 miles and 12.5 gallons',
        paragraphs: [
          'Say you reset the trip meter after filling up. At the next fill-up, the trip meter says 350 miles and the pump adds 12.5 gallons.',
          'MPG is 350 / 12.5, which equals 28. That means the car went 28 miles for each gallon on that tank.',
          'Gallons per 100 miles is 12.5 / 350 x 100, which is about 3.57. That means the car used about 3.57 gallons to go 100 miles.',
        ],
      },
      {
        title: 'Why gallons per 100 miles helps',
        paragraphs: [
          'MPG is familiar, but it can hide the actual fuel saved. Gallons per 100 miles is more direct because it tells you fuel used for the same distance.',
          'For gallons per 100 miles and L/100 km, lower is better. That makes it easier to compare a route change, tire-pressure check, or slower highway speed.',
        ],
      },
      {
        title: 'How to get a cleaner average',
        paragraphs: [
          'One tank is useful, but several normal tanks are better. Write down miles and gallons each time, then total all miles and all gallons before dividing.',
          'Skip weird tanks when they do not match real use, like a partial fill, towing day, snowstorm drive, or a tank with a lot of idling.',
        ],
      },
    ],
    sources: [
      sourceLinks.epaMpgMath,
      sourceLinks.epaFuelEconomy,
      sourceLinks.doeFuelEconomy,
      sourceLinks.doeDrivingEfficiently,
      sourceLinks.nistUnits,
    ],
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
    summary: 'Learn how to turn miles, a rate per mile, and trip extras into a mileage total with extras.',
    metaDescription:
      'Use the Mileage Calculator with a 125-mile, $0.725-per-mile example. See mileage-only amount, extras, total, and 2026 IRS/GSA rate context.',
    purpose:
      'The Mileage Calculator estimates a mileage amount from miles and a rate per mile. It can also add parking, tolls, or other trip costs when those extras belong in the same claim.',
    intro:
      'Mileage math is easy once the rate is right. The risky part is not the multiplication; it is using a rate that does not match the trip, employer, contract, or tax rule.',
    inputMatch: 'the miles driven, the allowed rate per mile, and any extras that belong in the same trip total',
    logicNote:
      'The calculator multiplies miles by the rate per mile. Then it adds parking, tolls, or extras you enter separately.',
    readIntro:
      'Read mileage only as the miles-by-rate amount. Read total as mileage only plus extras, so it is the number you would copy into a draft invoice or reimbursement note.',
    mistakeIntro:
      'The main mistake is treating an example rate as official. For 2026, the IRS business rate and the GSA rate for an authorized privately owned car are both $0.725 per mile, but your own rule can still be different.',
    sidecarText:
      'Open the Mileage Calculator beside this guide. Try 125 miles, 0.725 as the rate, and 12 dollars in extras first.',
    bestUsesIntro:
      'Use this guide for invoice drafts, delivery notes, business trip estimates, volunteer records, or checking a reimbursement before you submit it.',
    referenceIntro:
      'These references explain the 2026 IRS standard mileage rates and GSA privately owned vehicle reimbursement rates.',
    enter: [
      'Enter the miles driven for the trip or claim.',
      'Enter the rate per mile as dollars, such as 0.725 for 72.5 cents.',
      'Enter parking, tolls, or extras only if they should be added to the same total.',
    ],
    read: [
      '125 miles at $0.725 per mile gives $90.63 before extras.',
      'Adding $12 in parking or tolls gives $102.63 total.',
      'The rate is repeated so you can check the assumption before copying the answer.',
    ],
    mistakes: [
      'Do not assume the default example rate is the rate you should use.',
      'Use your employer, client, tax authority, or contract rule first.',
      'Keep documentation if the mileage is for reimbursement or taxes.',
      'Do not add parking or tolls twice if your system already handles them somewhere else.',
    ],
    extraSections: [
      {
        title: 'Example: 125 miles at the 2026 business rate',
        paragraphs: [
          'Say a client visit is 125 miles and your allowed rate is $0.725 per mile. The mileage-only amount is 125 x 0.725, which is $90.625.',
          'Money normally rounds to cents, so that becomes $90.63. If the trip also has $12 in approved extras, the total is $102.63.',
        ],
      },
      {
        title: 'Why the rate matters more than the math',
        paragraphs: [
          'The IRS 2026 business standard mileage rate is 72.5 cents per mile. GSA also lists $0.725 per mile for an authorized privately owned automobile in 2026.',
          'That does not mean every claim should use $0.725. Some employers, delivery apps, contracts, charities, medical trips, and military moving claims can use different rates.',
        ],
      },
      {
        title: 'What to keep with the result',
        paragraphs: [
          'Keep the date, trip purpose, start and end points or odometer notes, miles, rate source, and receipts for extras. A calculator total is useful, but proof is what makes a claim easier to defend.',
          'If you are using this for taxes, treat the calculator as arithmetic only. It does not decide whether the trip is deductible.',
        ],
      },
    ],
    sources: [sourceLinks.irsMileage, sourceLinks.irsMileageUpdate2026, sourceLinks.gsaPovMileage],
  },
  'density-calculator': {
    summary: 'Learn how mass divided by volume gives density, how to label the unit, and why matching units matter.',
    metaDescription:
      'Use the Density Calculator guide to divide mass by volume, label g/mL or kg/m3 results, check examples, and avoid unit-matching mistakes.',
    purpose:
      'The Density Calculator is a direct formula helper for science, materials, classroom examples, liquid checks, and bulk-volume estimates where mass and volume are known.',
    intro:
      'Most density mistakes are not from the division. They come from using one unit in the mass box, another unit in the volume box, and then giving the answer the wrong label.',
    inputMatch:
      'the measured mass, measured volume, and density unit label you want to read, such as grams with milliliters for g/mL or kilograms with cubic meters for kg/m3',
    logicNote:
      'The calculator does not convert the label for you. It divides the two numbers and prints the label you typed, so the unit work has to be right before you press calculate.',
    readIntro:
      'Read density as a ratio: how much mass fits into one unit of volume. Then check the repeated mass, volume, and formula line so you can catch a copied value or unit-label mistake before you use the answer.',
    mistakeIntro:
      'If a density answer looks wildly high or low, pause before changing the material. The likely issue is a unit mismatch, a wrong volume, or a label that says one thing while the inputs mean another.',
    bestUsesIntro:
      'Use this guide when you already measured mass and volume and need a quick density result you can explain.',
    sidecarText:
      'Open the Density Calculator beside this guide. Try the lab sample first, then replace the mass, volume, and unit label with your own values.',
    enter: [
      'Enter the mass number from your scale, problem, label, or supplier note.',
      'Enter the matching volume number, such as mL, cm3, m3, L, or ft3.',
      'Type the density unit label you want beside the result, such as g/mL, g/cm3, kg/m3, or lb/ft3.',
      'Check that the mass and volume units behind the numbers actually match that label.',
      'Press Calculate density and read the ratio, formula line, and examples together.',
    ],
    read: [
      'Density is the main answer, such as 2.7 g/mL or 1600 kg/m3.',
      'Mass and volume are repeated so you can see exactly which numbers were divided.',
      'The formula line should match density = mass / volume.',
      'The unit label is only text, so it proves nothing unless the inputs were already in matching units.',
      'Use the quick examples to sanity-check whether your answer is water-like, metal-like, or bulk-material-like.',
    ],
    mistakes: [
      'Do not mix grams with cubic meters and label the answer g/mL.',
      'Do not type kg/m3 as the label unless the mass is in kilograms and the volume is in cubic meters.',
      'Do not assume the calculator converts g, kg, mL, cm3, m3, or ft3 inside the label box.',
      'Use calibrated measurements for lab, supplier, engineering, or safety work.',
      'Remember that temperature, moisture, packing, air gaps, impurities, and material condition can change real density.',
    ],
    extraSections: [
      {
        title: 'Quick answer',
        paragraphs: [
          'Density is mass divided by volume. If a sample has 27 g of mass and takes up 10 mL of volume, the density is 27 / 10 = 2.7 g/mL.',
          'The calculator is fastest when the units are already lined up. If the mass is in grams and the volume is in milliliters, label the answer g/mL. If the mass is in kilograms and the volume is in cubic meters, label the answer kg/m3.',
        ],
        links: [
          {
            href: '/tools/density-calculator/',
            label: 'Open the Density Calculator while you read this guide',
          },
        ],
      },
      {
        title: 'What the inputs mean',
        paragraphs: [
          'Mass is how much matter is in the sample. For this calculator, it can be grams, kilograms, pounds, ounces, or another mass unit as long as you use a matching density label.',
          'Volume is how much space the sample takes up. Common density examples use mL for liquids, cm3 for small solid samples, m3 for bulk material, and ft3 for some construction or shipping notes.',
          'Unit label is the text printed beside the answer. It helps your notes make sense, but it is not a hidden unit converter.',
        ],
      },
      {
        title: 'Example: lab sample in g/mL',
        paragraphs: [
          'Say a small sample has mass 27 g and volume 10 mL. Enter 27 for mass, 10 for volume, and g/mL as the unit label.',
          'The calculator returns 2.7 g/mL because 27 / 10 = 2.7. That means each 1 mL of this sample has about 2.7 g of mass.',
          'This is also a good unit check. If your volume was really 10 cm3, the same number could be written as 2.7 g/cm3 because 1 cm3 equals 1 mL.',
        ],
      },
      {
        title: 'Example: liquid close to water',
        paragraphs: [
          'A liquid with mass 997 g and volume 1000 mL has density 997 / 1000 = 0.997 g/mL.',
          'That result is close to 1 g/mL, which is a useful sanity check for many water-like examples. It does not prove the liquid is pure water, but it tells you the answer is in the expected neighborhood.',
        ],
      },
      {
        title: 'Example: bulk material in kg/m3',
        paragraphs: [
          'For a bulk material, suppose mass is 1600 kg and volume is 1 m3. Enter 1600, 1, and kg/m3.',
          'The result is 1600 kg/m3. This kind of density is common when you are checking a supplier value, a school problem, or a rough material estimate before using a more specific tool.',
        ],
        links: [
          { href: '/tools/mass-calculator/', label: 'Use Mass Calculator when density and volume are known' },
          { href: '/tools/volume-calculator/', label: 'Use Volume Calculator when you need the space first' },
        ],
      },
      {
        title: 'When you need a conversion first',
        paragraphs: [
          'If your mass and volume are not already paired, convert before using the density calculator. For example, kilograms with liters gives kg/L, while kilograms with cubic meters gives kg/m3.',
          'Do not fix a unit mismatch by changing only the label. The label should describe the units behind the two numbers you actually divided.',
        ],
        links: [
          { href: '/tools/conversion-calculator/', label: 'Convert mass or volume units first' },
          { href: '/tools/weight-calculator/', label: 'Use Weight Calculator for force from mass and gravity' },
        ],
      },
      {
        title: 'When not to rely on this alone',
        paragraphs: [
          'Use this page as formula help, not as a lab certification or supplier guarantee. Real density can shift with temperature, moisture, air pockets, compaction, impurities, grade, and measurement precision.',
          'For lab reports, engineering work, shipping limits, structural estimates, or material purchases, use calibrated measurements, the method your class or workplace requires, or the supplier data sheet before trusting a quick result.',
        ],
      },
    ],
    sources: [sourceLinks.nistUnits, sourceLinks.bipmSi],
  },
  'mass-calculator': {
    summary: 'Learn how density multiplied by volume gives mass and why matching units matter.',
    purpose:
      'The Mass Calculator uses the density formula in the mass direction. If density and volume are known in matching units, multiplying them gives an estimated mass.',
    enter: [
      'Enter density as mass per volume, such as g/cm3, g/mL, kg/m3, or lb/ft3.',
      'Enter volume in the matching volume unit, such as cm3 when density is g/cm3.',
      'Enter the mass unit label you want to show. The label is text only, so convert units first if needed.',
    ],
    read: [
      'Mass is the main answer.',
      'Density and volume are repeated for checking.',
      'Formula shows density multiplied by volume.',
      'For 2.7 g/cm3 and 10 cm3, the answer is 27 g because the cm3 units cancel.',
    ],
    mistakes: [
      'Do not use mismatched density and volume units.',
      'Remember that this is not a scale measurement.',
      'Use material-specific density when estimating real objects.',
      'Do not use this page for chemistry molar mass, monoisotopic mass, body mass, or weight-force conversions.',
    ],
    extraSections: [
      {
        title: 'Quick examples',
        paragraphs: [
          'An aluminum-like sample with density 2.7 g/cm3 and volume 10 cm3 has an estimated mass of 27 g.',
          'A water-like liquid with density 1 g/mL and volume 250 mL has an estimated mass of 250 g.',
          'A bulk material with density 1600 kg/m3 and volume 0.5 m3 has an estimated mass of 800 kg.',
        ],
      },
      {
        title: 'If you meant another mass calculator',
        paragraphs: [
          'Searches for "mass calculator" can mean different jobs. This page is for density times volume. It does not calculate chemical molar mass, monoisotopic mass, body mass, or mass from a force reading.',
          'Use Molecular Weight Calculator for chemical formula mass. Use Weight Calculator for physics weight force from mass and gravity. Use Conversion Calculator when you only need to convert between mass units.',
        ],
        links: [
          { href: '/tools/molecular-weight-calculator/', label: 'Calculate molecular weight from a formula' },
          { href: '/tools/weight-calculator/', label: 'Calculate physics weight force' },
          { href: '/tools/conversion-calculator/', label: 'Convert mass units' },
        ],
      },
      {
        title: 'Why the estimate can differ from a real object',
        paragraphs: [
          'Published or supplier density values are often averages. Moisture, temperature, packing, air gaps, and measurement precision can all change the real mass.',
          'For lab, shipping, structural, recipe, or safety decisions, use measured density, a calibrated scale, supplier data, or professional guidance instead of a rough lookup value.',
        ],
      },
    ],
    sources: [sourceLinks.nistUnits, sourceLinks.bipmSi, sourceLinks.openStaxMassWeight],
  },
  'weight-calculator': {
    summary: 'Use the physics Weight Calculator for mass times gravity, not BMI or ideal body weight.',
    purpose:
      'The Weight Calculator estimates physics weight force from mass and gravity. In physics, weight is a force, while mass is the amount of matter. That is different from body-weight screening, BMI, or ideal-weight formulas.',
    enter: [
      'Enter mass in kilograms.',
      'Use 9.80665 m/s2 for standard Earth gravity, or enter another gravity value such as about 1.62 m/s2 for the Moon or 3.71 m/s2 for Mars.',
      'Calculate to see newtons and pounds-force.',
      'If you meant body weight, height-weight range, BMI, or ideal weight, use one of the health calculators instead.',
    ],
    read: [
      'Newtons is the main weight force result.',
      'Pounds-force gives a familiar force comparison.',
      'Mass in pounds is shown separately so mass and force are not confused.',
      'For 70 kg at 9.80665 m/s2, the force is 686.4655 N, which is about 154.32 lbf.',
    ],
    mistakes: [
      'Do not use weight force as a safety-rated load calculation.',
      'Do not confuse pounds mass with pounds-force.',
      'Gravity changes by location, altitude, and planet or moon.',
      'Do not use this page as a BMI, ideal body weight, or age-weight chart.',
    ],
    extraSections: [
      {
        title: 'Quick examples',
        paragraphs: [
          'A 70 kg mass under standard Earth gravity is 70 x 9.80665 = 686.4655 N. The same 70 kg mass under Moon gravity is 70 x 1.62 = 113.4 N. The mass did not change; the gravity value changed the force.',
          'For a Mars-style example, 80 kg x 3.71 m/s2 = 296.8 N, or about 66.72 lbf. That kind of comparison is the reason this page asks for gravity instead of height, age, or body measurements.',
        ],
      },
      {
        title: 'If you meant body weight',
        paragraphs: [
          'Search data for "weight calculator" often mixes physics, BMI, height-weight, age-weight, and ideal-weight intent. This page keeps the physics meaning: mass times gravity.',
          'Use BMI Calculator for body mass index, Healthy Weight Calculator for the adult BMI 18.5 to 24.9 height range, or Ideal Weight Calculator for a formula reference weight. Those pages are better fits for health-style weight questions.',
        ],
        links: [
          { href: '/tools/bmi-calculator/', label: 'Check BMI from height and weight' },
          { href: '/tools/healthy-weight-calculator/', label: 'Find an adult healthy-weight range' },
          { href: '/tools/ideal-weight-calculator/', label: 'Compare an ideal-weight formula' },
        ],
      },
      {
        title: 'Why pounds-force can feel confusing',
        paragraphs: [
          'Under standard Earth gravity, 70 kg converts to about 154.32 pounds mass and also about 154.32 pounds-force. That matching number is why everyday speech blurs mass and weight.',
          'When gravity changes, the difference becomes obvious: the same 70 kg is still about 154.32 pounds mass, but on the Moon it is only about 25.49 lbf of weight force.',
        ],
      },
    ],
    sources: [sourceLinks.nistUnits, sourceLinks.openStaxMassWeight],
  },
  'speed-calculator': {
    summary: 'Learn how distance divided by time gives average speed in mph, km/h, and m/s.',
    metaDescription:
      'Use the Speed Calculator guide for distance and elapsed time. Learn mph, km/h, m/s, decimal hours, stopped-time choices, and metric-distance checks.',
    purpose:
      'The Speed Calculator finds average speed over a whole trip, run, ride, commute, or class problem. It combines hours, minutes, and seconds into total hours, divides miles by that time for mph, then converts the same speed to km/h and m/s.',
    intro:
      'Use this guide when you know a distance and an elapsed time, but you want the average speed without rebuilding the formula by hand. The key choice is whether your time should include stops, because that changes what the result means.',
    inputMatch: 'the distance in miles and the elapsed hours, minutes, and seconds for the same trip or activity',
    logicNote:
      'The math is speed = distance / time. The page turns minutes and seconds into decimal hours first, then uses 1 mile = 1.609344 kilometers and 1 mph = 0.44704 m/s for the extra unit results.',
    readIntro:
      'Read mph first for the main answer, then use km/h or m/s when the assignment, road sign, race note, or science problem uses metric units. Decimal hours shows the exact time value used in the division.',
    mistakeIntro:
      'Most speed mistakes come from mixing units, entering kilometers as miles, forgetting to include or exclude stopped time, or reading average speed like it was the fastest speed reached.',
    enter: [
      'Enter distance in miles.',
      'Enter hours, minutes, and seconds for the elapsed time.',
      'Use zero for unused time fields, but keep all time fields from the same trip or activity.',
    ],
    read: [
      'MPH is the main average speed from miles divided by decimal hours.',
      'km/h and m/s are converted versions of the same speed, not separate measurements.',
      'Decimal hours shows the time value used in the division, which helps check minute and second entries.',
    ],
    mistakes: [
      'Do not use this as instant speed, top speed, or a GPS speedometer replacement.',
      'Include stops if you want whole-trip average speed.',
      'Exclude stops only when you intentionally want moving average speed.',
      'Use matching distance and elapsed time from the same trip.',
      'Convert kilometers or meters to miles before entering distance, then read the metric result after calculating.',
    ],
    extraSections: [
      {
        title: 'Example: 18 miles in 42 minutes',
        paragraphs: [
          'For a commute of 18 miles in 42 minutes, convert 42 minutes to 0.7 hours. Then 18 / 0.7 = 25.71 mph, which is the whole-trip average if those 42 minutes include traffic lights, turns, and waiting time.',
          'That result does not mean the car stayed at 25.71 mph the whole way. It means the distance and total elapsed time work out to that average.',
        ],
      },
      {
        title: 'When the distance starts in kilometers or meters',
        paragraphs: [
          'The distance input expects miles. If your problem starts with kilometers or meters, convert the distance to miles first, then use the km/h and m/s result lines after calculating.',
          'For a 100-meter sprint, enter about 0.0621371 miles and 12 seconds. The result is about 18.64 mph, or about 30 km/h.',
        ],
      },
      {
        title: 'Speed, pace, distance, and time are different questions',
        paragraphs: [
          'Use the Speed Calculator when distance and time are known and speed is missing. Use the Pace Calculator when you want minutes per mile or minutes per kilometer.',
          'If speed is already known and you need the missing travel time or distance, the Time Calculator or Distance Calculator is the better match.',
        ],
        links: [
          { href: '/tools/pace-calculator/', label: 'Convert speed into pace' },
          { href: '/tools/time-calculator/', label: 'Solve elapsed time questions' },
          { href: '/tools/distance-calculator/', label: 'Solve distance questions' },
        ],
      },
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
    title: 'Base64 Encode / Decode Guide',
    summary: 'Learn how Base64 turns bytes into printable text and back again.',
    metaDescription:
      'Use the Base64 Encode / Decode guide to encode UTF-8 text, decode Base64, check padding, troubleshoot invalid input, and avoid treating Base64 as encryption.',
    purpose:
      'The Base64 tool encodes readable text as UTF-8 bytes before converting those bytes to Base64. It can also decode Base64 back into UTF-8 text when the decoded bytes are valid readable text.',
    intro:
      'Use this guide when you need to turn a short text value into Base64, decode a Base64 sample back to text, or understand why the result sometimes ends with = padding.',
    inputMatch: 'the mode, the exact text or Base64 string, and whether you expect readable UTF-8 text back',
    logicNote:
      'Base64 works on bytes. The tool turns text into UTF-8 bytes, groups those bytes into 6-bit chunks, maps each chunk to the Base64 alphabet, and adds = padding when the final chunk is short.',
    readIntro:
      'Read the converted text first, then check the input length, output length, and mode. A small change in spaces, line breaks, or punctuation can produce a different Base64 string.',
    mistakeIntro:
      'Most Base64 mistakes come from treating it like encryption, pasting real secrets, copying an extra space, using URL-safe Base64 without converting it, or decoding bytes that are not valid UTF-8 text.',
    enter: [
      'Choose Encode when starting with readable text.',
      'Choose Decode when starting with Base64.',
      'Paste the exact text into the input field and run the tool.',
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
    extraSections: [
      {
        title: 'Quick encode and decode example',
        paragraphs: [
          'If you choose Encode and enter `Hello tools`, the tool returns `SGVsbG8gdG9vbHM=`. If you switch to Decode and enter `SGVsbG8gdG9vbHM=`, it returns `Hello tools` again.',
          'That round trip is a good sanity check. If your decoded text has an extra space, a missing character, or line breaks you did not expect, copy the input again and check the exact characters.',
        ],
      },
      {
        title: 'Why padding appears',
        paragraphs: [
          'Base64 reads bytes in groups and writes printable characters. When the last group is not full, the result may end with one or two `=` characters. For example, `Hi` encodes to `SGk=`.',
          'Padding is not a warning and it is not encryption. It is just a way to finish the final Base64 group cleanly.',
        ],
      },
      {
        title: 'When decoding fails',
        paragraphs: [
          'Decode problems usually come from copied spaces, missing padding, URL-safe Base64 characters, invalid symbols, or data that was Base64 but was not text in the first place.',
          'This page is meant for text. Binary files need a file-aware encoder with clear size limits and memory behavior.',
        ],
      },
      {
        title: 'Base64 is not secret',
        paragraphs: [
          'Base64 does not use a password or key. Anyone who has the Base64 string can decode it unless the original data was encrypted before it was encoded.',
          'Use fake examples for API docs, headers, and Basic Auth practice. Do not paste real passwords, API keys, tokens, cookies, or private files into a browser tool unless you fully understand the risk.',
        ],
      },
    ],
    sources: [sourceLinks.rfc4648, sourceLinks.mdnTextEncoder],
  },
  'url-encode-decode': {
    title: 'How to Use the URL Encode / Decode Tool',
    summary: 'Learn how URL percent-encoding protects reserved characters in URL components.',
    metaDescription:
      'Use the URL Encode / Decode guide to encode query values, decode percent-encoded text, compare %20 with plus spaces, and avoid whole-URL mistakes.',
    purpose:
      'The URL Encode / Decode tool is made for URL components, especially query values, path pieces, and small snippets that need to travel safely inside a URL. It turns reserved characters into percent-encoded text and decodes them back.',
    intro:
      'Use this guide when a query value, tracking parameter, API test URL, or copied link contains spaces, ampersands, equals signs, slashes, or percent codes and you want to know what the tool is changing.',
    inputMatch: 'the mode, the exact text to encode or decode, and whether spaces should use %20 or plus signs',
    logicNote:
      'The tool treats the input as a URL component. In encode mode, reserved or unsafe characters are converted to UTF-8 bytes and written as % plus two hexadecimal digits. In decode mode, valid percent triplets are changed back into readable text. Plus-space mode uses + for spaces when you are working with form-style query values.',
    readIntro:
      'Read the output as the value you would paste into a query parameter, path piece, form body, or test request. Compare the input length and output length when the result looks surprising; extra spaces, copied punctuation, or an already-encoded percent sign can change the answer.',
    mistakeIntro:
      'The common mistakes are encoding an entire URL when only one value should be encoded, decoding the same value over and over, using plus mode where + should stay a literal plus sign, or pasting private tokens into a convenience tool.',
    enter: [
      'Choose Encode for readable component text or Decode for text that already contains percent codes.',
      'Paste the exact component value. For example, use price=10&tax=2 when you want that whole value protected inside a query parameter.',
      'Turn on plus-spaces only for form-style query values where spaces should become + instead of %20.',
    ],
    read: [
      'For price=10&tax=2, encode mode returns price%3D10%26tax%3D2 so the equals sign and ampersand stay part of the value instead of acting like URL separators.',
      'For price%3D10%26tax%3D2, decode mode returns price=10&tax=2 so you can read the original value again.',
      'For hello tools, normal URL-component encoding returns hello%20tools; plus-space mode can return hello+tools when the receiving system expects form-style spaces.',
    ],
    mistakes: [
      'Do not encode a full URL the same way as one query value. Encoding ://, ?, &, and = can stop the URL from working.',
      'Do not decode the same value repeatedly unless you know it was double-encoded. For example, %2520 may become %20 after one decode, then a space after a second decode.',
      'Do not paste real signed links, access tokens, passwords, session URLs, or private query strings unless you fully understand the risk. URL encoding is formatting, not secrecy.',
    ],
    extraSections: [
      {
        title: 'Quick example',
        paragraphs: [
          'Say you need to place price=10&tax=2 inside one query value. If you leave it alone, the ampersand can be read as a separator between two parameters. Encode mode returns price%3D10%26tax%3D2, which keeps the equals sign and ampersand inside the value you are sending.',
        ],
      },
      {
        title: 'Whole URL versus one component',
        paragraphs: [
          'A complete URL such as https://example.com/?q=test already uses ://, ?, =, and & as structure. A component value such as price=10&tax=2 is different because those same characters are data. Encode the part you are inserting, not the whole address, unless your app specifically asks for an encoded full URL.',
          'When a tool, API, or form mentions URLSearchParams, query string values, or application/x-www-form-urlencoded data, plus-space handling may matter. If it simply asks for a URI component, %20 is usually the clearer space marker.',
        ],
      },
    ],
    sources: [sourceLinks.rfc3986, sourceLinks.mdnUrlSearchParams],
  },
  'day-of-the-week-calculator': {
    summary: 'Learn how to find the weekday name and ISO weekday number for a calendar date.',
    metaDescription:
      'Use the Day of the Week Calculator guide to find weekday names, ISO weekday numbers, and Sunday-based indexes for valid calendar dates.',
    purpose:
      'The Day of the Week Calculator answers a simple calendar question: what weekday does this date fall on?',
    intro:
      'Use it for birthdays, deadlines, holidays, event planning, date labels, or a quick sanity check before you copy a date into a schedule.',
    bestUsesIntro:
      'Use this guide when the calendar date is the thing you know and the weekday label is the thing you need to check.',
    inputMatch: 'one valid calendar date, usually entered as year, month, and day in the date field',
    logicNote:
      'For 2027-01-01, the guide example returns Friday. The supporting lines help you check the same date as ISO weekday 5 and Sunday-based index 5.',
    enter: [
      'Choose the calendar date you want to check.',
      'Calculate to get the weekday name, ISO weekday number, and Sunday-based index.',
      'Compare your answer with the today, future-date, or leap-day examples before copying it.',
    ],
    readIntro:
      'Read the weekday name first. Then use the index numbers only if your schedule, spreadsheet, or code needs a numeric weekday.',
    read: [
      'The main answer is the weekday name.',
      'ISO weekday uses Monday as 1 and Sunday as 7.',
      'Sunday-based index uses Sunday as 0, matching many programming APIs.',
    ],
    mistakeIntro:
      'Most surprising answers are easy to avoid: double-check the year, month, and day, then check whether a time-zone edge near midnight changes the calendar date.',
    mistakes: [
      'Do not use this for historical calendar reform research.',
      'Check time zones separately when an event happens near midnight.',
      'Use the Date Calculator when you need days between two dates.',
    ],
    extraSections: [
      {
        title: 'Example: checking New Year 2027',
        paragraphs: [
          'If you enter 2027-01-01, the calculator returns Friday. That is the answer most people need for a planner, invite, spreadsheet label, or quick event check.',
          'The numeric lines add context: ISO weekday 5 and Sunday-based index 5. Those numbers are helpful when another system asks for a weekday number instead of the word Friday.',
        ],
      },
      {
        title: 'When the date needs extra checking',
        paragraphs: [
          'This page uses modern date math for the calendar date you enter. Treat that as a limit: double-check a history source when an old record comes from a place that changed calendars on a different date.',
          'For events near midnight, the local time zone can matter. A live event, flight, or online meeting may fall on a different calendar date for someone in another time zone.',
        ],
      },
    ],
    referenceIntro:
      'These references help check ISO weekday numbering, date notation, and the limits around calendar-date math.',
    sources: [sourceLinks.isoDate],
  },
  'height-calculator': {
    title: 'Height Calculator Guide',
    summary: 'Learn how parent heights can give a rough adult-height estimate.',
    metaDescription:
      'Use the Height Calculator guide to enter parent heights, read the mid-parental estimate, check the rough range, and know when growth charts matter.',
    purpose:
      'The Height Calculator uses a simple mid-parental estimate. It is useful for understanding the math behind a rough family-height prediction, but it should not be treated as a medical growth forecast.',
    intro:
      'Use it when you want a quick family-height estimate from two parent heights. If a child is already growing far outside their usual pattern, a growth chart and a clinician matter more than this shortcut.',
    inputMatch: 'the child estimate type and each parent height in feet plus extra inches',
    logicNote:
      'For a male estimate, the calculator adds 5 inches to the two parent heights before dividing by 2. For a female estimate, it subtracts 5 inches before dividing by 2.',
    readIntro:
      'Read the rounded feet-and-inches estimate first, then check the centimeter line and the rough plus-or-minus range. The range is not decoration; it is the honest part of the answer.',
    mistakeIntro:
      'Most wrong height estimates come from entering inches in the feet box, using a decimal like 5.8 for 5 ft 8 in, or treating the midpoint as a promise.',
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
    extraSections: [
      {
        title: 'Quick example',
        paragraphs: [
          'If the mother is 5 ft 4 in and the father is 5 ft 10 in, the male estimate uses 64 + 70 + 5, then divides by 2. That gives 69.5 inches, which the tool rounds to about 5 ft 10 in.',
        ],
      },
      {
        title: 'What the range means',
        paragraphs: [
          'The rough range is there because real growth does not land on one perfect number. Genes matter a lot, but puberty timing, nutrition, health, and normal variation can move the final adult height.',
          'This page does not use a child height percentile, weight, bone age, or growth-chart history. Those checks need more information than two parent heights.',
        ],
      },
      {
        title: 'When to check a growth chart',
        paragraphs: [
          'Use CDC growth charts or a clinician when the question is about whether a child is growing normally. A mid-parental estimate can be useful background, but it cannot spot growth problems by itself.',
        ],
      },
    ],
    sources: [sourceLinks.mayoChildGrowth, sourceLinks.aapMidParentalHeight, sourceLinks.cdcGrowthCharts, sourceLinks.nistUnits],
  },
  'bra-size-calculator': {
    summary: 'Learn how bust and underbust measurements create a starting bra size estimate.',
    metaDescription:
      'Use the Bra Size Calculator guide to measure underbust and bust inches, read band and cup estimates, check sister sizes, and avoid over-trusting one fit label.',
    purpose:
      'The Bra Size Calculator gives a practical starting point from two measurements. It helps explain band and cup math, while making it clear that real fit depends on brand, style, and body shape.',
    intro:
      'Use it when you want a calm first estimate before comparing brand charts, trying nearby sizes, or checking why the same label can feel different in another style.',
    bestUsesIntro:
      'Use this guide when you have two tape-measure numbers and need to understand how the page turns them into a US-style starting size.',
    inputMatch: 'a snug underbust measurement and a full-bust measurement in inches',
    logicNote:
      'For 34 in underbust and 39 in bust, the calculator keeps the band at 34, subtracts 34 from 39, and maps the 5 inch difference to about 34DD/E.',
    enter: [
      'Measure underbust in inches with the tape snug and level under the bust.',
      'Measure around the fullest bust point in inches without pulling the tape tight.',
      'Calculate to get a US-style starting band and cup estimate.',
    ],
    readIntro:
      'Read the size as a starting point, not a verdict. The band comes from the underbust number first, and the cup comes from the bust-minus-band difference.',
    read: [
      'Band is based on the underbust measurement rounded to an even size.',
      'Cup is based on the difference between bust and band.',
      'The fit note matters because the same label can feel different across brands, styles, wire shapes, and fabrics.',
    ],
    mistakeIntro:
      'Most bad estimates come from tilted tape, over-tight measuring, mixing country size systems, or buying from one number without checking the brand chart.',
    mistakes: [
      'Do not treat the estimate as a guaranteed size.',
      'Do not pull the tape so tight that the measurement changes.',
      'Check brand size charts and nearby sister sizes before buying.',
    ],
    extraSections: [
      {
        title: 'Example: 34 in underbust and 39 in bust',
        paragraphs: [
          'If your underbust is 34 inches and your bust is 39 inches, the calculator starts with a 34 band. The difference is 39 - 34 = 5 inches, so the page shows about 34DD/E as the starting estimate.',
          'That answer is useful for narrowing the first try-on size, but it is not the end of the fit check. If the band feels too tight, too loose, or the cup shape is wrong, nearby sister sizes and the brand chart matter more than forcing one label to work.',
        ],
      },
      {
        title: 'Why sister sizes come up',
        paragraphs: [
          'Sister sizes are nearby labels that can feel related in cup volume while changing band tension. For example, 32D and 34C are often discussed together, but the real fit still depends on the bra cut and your body shape.',
          'Use sister sizes as a shopping shortcut, not a rule. A comfortable band, smooth cup shape, and stable straps are better signals than matching the first estimate perfectly.',
        ],
      },
      {
        title: 'Country and brand limits',
        paragraphs: [
          'This guide describes a simple US-style estimate. UK, EU, AU, and individual brand systems can label sizes differently, especially around double letters and larger cup progressions.',
          'Before buying, compare the calculator answer with the size chart for the exact product. If the chart asks for centimeters, convert carefully instead of rounding from memory.',
        ],
      },
    ],
    referenceIntro:
      'These references support the inch measurement language and the helpful-content standard behind the guide. Brand-specific size charts still decide the final shopping label.',
    sources: [sourceLinks.nistUnits, sourceLinks.googleHelpfulContent],
  },
  'voltage-drop-calculator': {
    title: 'Voltage Drop Calculator Guide',
    summary:
      'Learn how to estimate voltage drop from amps, one-way length, source voltage, copper AWG size, and circuit type.',
    metaDescription:
      'Use the Voltage Drop guide to estimate volts lost, percent drop, and load voltage, then avoid one-way length, low-voltage, and wire-sizing mistakes.',
    purpose:
      'The Voltage Drop Calculator estimates how much voltage may be lost in a simple copper AWG wire run. It is useful for early planning, homework, and sanity checks before a qualified electrical review.',
    intro:
      'Start with the source voltage, load current, one-way wire length, circuit type, and copper wire size. For example, 120 V, 15 A, 75 ft, and 12 AWG copper is about 3.573 V lost, or 2.98%, leaving about 116.427 V at the load.',
    inputMatch:
      'the source voltage, expected load current in amps, source-to-load one-way length in feet, copper AWG size, and single-phase/DC or balanced three-phase mode',
    logicNote:
      'The calculator uses voltage drop = current x copper resistance per foot x one-way length x circuit factor. Single-phase/DC uses factor 2 for the out-and-back path. Balanced three-phase uses sqrt(3).',
    readIntro:
      'Read volts dropped first, then percent drop, then load voltage. The percent drop is often the easiest warning sign because it scales the lost volts against the supply voltage.',
    mistakeIntro:
      'Most voltage-drop mistakes come from entering round-trip length, picking the wrong circuit type, forgetting that low-voltage systems are more sensitive, or treating one estimate as a final wiring decision.',
    sidecarText:
      'Open the Voltage Drop Calculator beside this guide. Try the 120 V, 15 A, 75 ft, 12 AWG example first, then change one input at a time so the percent drop makes sense.',
    bestUsesIntro:
      'Use this guide when you want to understand the estimate before checking equipment instructions, local code, and a qualified electrician or engineer.',
    enter: [
      'Enter the source voltage, such as 24 V, 120 V, 208 V, or 240 V.',
      'Enter the load current in amps for the device or circuit you are checking.',
      'Enter one-way length in feet from source to load, not round-trip distance.',
      'Choose copper AWG size and circuit type: single-phase/DC or balanced three-phase.',
    ],
    read: [
      'Voltage drop is the estimated volts lost in the conductor run.',
      'Percent drop compares that loss with the source voltage.',
      'Load voltage is the source voltage minus the estimated drop.',
      'Use the result as a planning signal before checking the allowed voltage range for the actual equipment.',
    ],
    mistakes: [
      'Do not enter round-trip length. The calculator already applies the circuit factor.',
      'Do not use copper AWG results for aluminum wire without a separate source-backed check.',
      'Do not treat a low percent drop as proof that breaker size, ampacity, temperature, insulation, terminals, or local code are acceptable.',
      'Ask a qualified electrician or engineer for real installations and safety decisions.',
    ],
    extraSections: [
      {
        title: 'Quick 120 V branch example',
        paragraphs: [
          'Say you are checking a 120 V branch run with 15 A of load current, 75 ft of one-way distance, single-phase/DC mode, and 12 AWG copper. The calculator estimates 3.573 V of drop.',
          'That is 2.98% of 120 V, so the load voltage estimate is 116.427 V. This does not approve the wire, but it tells you whether the run deserves a closer design check.',
        ],
      },
      {
        title: 'Why low-voltage runs can surprise you',
        paragraphs: [
          'The same volt loss matters more when the source voltage is small. A 24 V run with 5 A, 40 ft one-way distance, and 10 AWG copper estimates 0.3996 V of drop.',
          'That leaves about 23.6004 V at the load, and the percent drop is 1.67%. The volt number looks small, but the percent is the part that tells you how much of the supply you lost.',
        ],
        bullets: [
          'Compare percent drop, not only volts dropped.',
          'Check the device manual for the allowed input-voltage range.',
          'Use manufacturer data and qualified electrical guidance before choosing wire or protection.',
        ],
      },
      {
        title: 'What this guide does not decide',
        paragraphs: [
          'Voltage drop is only one part of wiring. Real work can also need ampacity, insulation rating, conductor material, temperature adjustment, raceway fill, terminals, continuous-load rules, breaker rules, equipment instructions, and local code.',
          'Use this guide to understand the scale of the voltage loss. Use the calculator result as a question to investigate, not as a wiring permit or safety sign-off.',
        ],
      },
    ],
    referenceIntro:
      'These references support the voltage-drop concept, Ohm law background, units, and safety-limit wording. They do not replace equipment instructions, local code, or professional electrical review.',
    sources: [
      sourceLinks.usaceVoltageDrop,
      sourceLinks.openStaxOhmsLaw,
      sourceLinks.nistUnits,
      sourceLinks.esfiExtensionCordSafety,
    ],
  },
  'watts-to-amps-calculator': {
    summary: 'Learn how watts, volts, phase type, and power factor turn into an amp estimate.',
    purpose:
      'The Watts to Amps Calculator helps you understand current draw from a power rating. It is useful for label reading, homework, and rough planning, but not for final circuit design.',
    enter: [
      'Enter the real power in watts, such as 1,500 W or 60 W.',
      'Enter the supply voltage, such as 12 V, 120 V, 240 V, or 208 V.',
      'Choose DC, single-phase AC, or three-phase AC, then enter power factor if the load is AC.',
    ],
    read: [
      'The main answer is estimated current in amps.',
      'Phase factor shows whether the calculator used a direct, single-phase, or three-phase formula.',
      'Power factor explains why some AC loads draw more current for the same real watts.',
    ],
    mistakes: [
      'Do not guess power factor for real equipment sizing.',
      'Do not use DC math on three-phase AC loads.',
      'Do not choose breakers, wire, extension cords, or safety gear from this estimate alone.',
    ],
    sources: [
      sourceLinks.openStaxElectricPower,
      sourceLinks.openStaxOhmsLaw,
      sourceLinks.nistAmpere,
      sourceLinks.nistUnits,
      sourceLinks.esfiExtensionCordSafety,
    ],
  },
  'amps-to-watts-calculator': {
    title: 'Amps to Watts Guide',
    summary: 'Learn the amps to watts formula for DC, single-phase AC, and three-phase AC with a 12.5 A at 120 V example.',
    metaDescription:
      'Use the Amps to Watts guide to convert amps, volts, phase, and power factor into watts and kW, then avoid breaker and wire-sizing mistakes.',
    purpose:
      'The Amps to Watts Calculator turns current, voltage, phase type, and power factor into a real-power estimate. It is handy when you know current draw and voltage and want a rough watt or kilowatt number.',
    intro:
      'Start by matching the formula to the type of power you have. A 12.5 A load at 120 V with power factor 1 is 1,500 W, but the answer changes when voltage, phase, or power factor changes.',
    inputMatch: 'the current in amps, supply voltage, DC or AC phase type, and power factor from the device label or specification when it is available',
    logicNote:
      'For DC, watts = amps x volts. For single-phase AC, multiply by power factor. For three-phase AC, multiply by sqrt(3) and power factor.',
    readIntro:
      'Read watts as the estimated real power. Read kilowatts when the number is large enough that a 1.5 kW or 6.12 kW comparison is easier than a watt-only answer.',
    mistakeIntro:
      'Most amps-to-watts mistakes come from ignoring voltage, assuming every AC load has power factor 1, or using a simple power estimate as if it were a wiring approval.',
    enter: [
      'Enter the current in amps from the device label, meter, or specification.',
      'Enter the supply voltage, such as 12 V DC, 120 V, 240 V, 208 V, or 480 V.',
      'Choose DC, single-phase AC, or three-phase AC, then enter power factor for AC loads when you know it.',
    ],
    read: [
      'The main answer is estimated watts.',
      'The kilowatts metric is the same result divided by 1,000.',
      'Power factor and phase type explain why equal amps can create different watt values.',
      'Use the result for comparison or planning before checking equipment instructions and safety requirements.',
    ],
    mistakes: [
      'Do not assume all AC loads have power factor 1.',
      'Do not compare amperage without checking voltage.',
      'Do not use this as a final breaker, wire, extension-cord, motor, appliance, or code calculation.',
    ],
    extraSections: [
      {
        title: 'Quick 120 V example',
        paragraphs: [
          'Say a space heater draws 12.5 A on a 120 V circuit and the power factor is 1. Multiply 12.5 by 120 to get 1,500 W.',
          'That is the same as 1.5 kW after dividing by 1,000. This is a useful comparison number when you are estimating load, energy use, or whether two devices are in the same power range.',
        ],
      },
      {
        title: 'Why phase and power factor change the answer',
        paragraphs: [
          'A 10 A single-phase motor at 240 V with 0.9 power factor is about 2,160 W. The same 10 A at a different voltage or power factor would not mean the same watts.',
          'A 20 A three-phase load at 208 V with 0.85 power factor is about 6,124 W, or 6.12 kW. The three-phase formula includes sqrt(3), so using simple DC math would understate the result.',
        ],
        bullets: [
          'Use DC math only for DC loads.',
          'Use the equipment power factor when accuracy matters.',
          'Use manufacturer data and a qualified professional for circuit sizing, code compliance, and electrical safety.',
        ],
      },
    ],
    sources: [
      sourceLinks.inchAmpsToWatts,
      sourceLinks.openStaxElectricPower,
      sourceLinks.openStaxOhmsLaw,
      sourceLinks.nistUnits,
      sourceLinks.esfiExtensionCordSafety,
    ],
  },
  'kilowatts-to-amps-calculator': {
    title: 'Kilowatts to Amps Guide',
    summary:
      'Learn the kW to amps formula for DC, single-phase AC, and three-phase AC with efficiency, power factor, and a 5 kW motor example.',
    metaDescription:
      'Use the Kilowatts to Amps guide to convert kW, volts, phase, power factor, and efficiency into amps, then avoid motor and wiring-sizing mistakes.',
    purpose:
      'The Kilowatts to Amps Calculator turns a power rating, voltage, phase type, power factor, and efficiency into an estimated running current in amps.',
    intro:
      'A 5 kW label is not an amp rating by itself. At 240 V single-phase, 0.9 power factor, and 90% efficiency, the same 5 kW load needs about 25.72 A as a running-current estimate.',
    inputMatch:
      'the kilowatt rating, supply voltage, DC or AC phase type, power factor, and efficiency from the equipment label or specification when it is available',
    logicNote:
      'First convert output power to input watts: input watts = kW x 1,000 / (efficiency / 100). For DC, amps = input watts / volts. For single-phase AC, amps = input watts / (volts x power factor). For three-phase AC, amps = input watts / (volts x sqrt(3) x power factor).',
    readIntro:
      'Read amps as an estimated running current. The input-watts line explains how efficiency changed the power value before the current formula was applied.',
    mistakeIntro:
      'Most kW-to-amps mistakes come from treating kW like kVA, guessing power factor or efficiency, or using a running-current estimate as if it were a final breaker or conductor size.',
    enter: [
      'Enter the kilowatt rating from the motor, inverter, heater, equipment label, or project note.',
      'Enter the supply voltage and choose DC, single-phase AC, or three-phase AC.',
      'Enter power factor for AC loads and efficiency when the kW rating is output power instead of input power.',
    ],
    read: [
      'The main answer is estimated running current in amps.',
      'Input watts after efficiency shows the power value the calculator used before solving current.',
      'Power factor, phase type, and efficiency explain why equal kW values can produce different amp estimates.',
      'Use the result for comparison or planning before checking the equipment nameplate, manufacturer instructions, code rules, and a qualified reviewer.',
    ],
    mistakes: [
      'Do not confuse kW with kVA.',
      'Do not assume power factor is 1 for every AC load.',
      'Do not leave efficiency at 100% when the rating is output power and losses matter.',
      'Do not use running current alone for breaker sizing, conductor sizing, voltage drop, motor starting current, duty cycle, or code compliance.',
    ],
    extraSections: [
      {
        title: 'Quick 5 kW motor example',
        paragraphs: [
          'Say a motor is rated 5 kW output, runs from 240 V single-phase power, has 0.9 power factor, and is 90% efficient. First divide 5,000 W by 0.9 to get 5,555.56 input W.',
          'Then divide 5,555.56 by 240 x 0.9. The running-current estimate is about 25.72 A before you account for nameplate requirements, starting current, conductor rules, breaker rules, and the installation environment.',
        ],
      },
      {
        title: 'Three-phase and DC checks',
        paragraphs: [
          'For a 15 kW three-phase load at 480 V, 0.88 power factor, and 92% efficiency, input power is about 16,304.35 W. Divide by 480 x sqrt(3) x 0.88 to get about 22.27 A.',
          'For a 1.2 kW DC load at 48 V and 100% efficiency, divide 1,200 W by 48 V to get 25 A. That quick DC check is useful for battery, inverter, and low-voltage equipment planning.',
        ],
        bullets: [
          'Use DC math only for DC loads.',
          'Use the three-phase formula with sqrt(3) for balanced three-phase line-to-line voltage.',
          'Use a kVA calculator when the label gives apparent power instead of real power in kW.',
          'Use manufacturer data and a qualified professional for circuit sizing and electrical safety decisions.',
        ],
      },
    ],
    sources: [
      sourceLinks.inchKilowattsToAmps,
      sourceLinks.openStaxElectricPower,
      sourceLinks.openStaxOhmsLaw,
      sourceLinks.nistUnits,
      sourceLinks.esfiExtensionCordSafety,
    ],
  },
  'kva-to-amps-calculator': {
    title: 'kVA to Amps Guide',
    summary:
      'Learn the kVA to amps formula for single-phase and three-phase systems with transformer, UPS, generator, and line-to-line voltage examples.',
    metaDescription:
      'Use the kVA to Amps guide to convert kVA and volts into amps for single-phase or three-phase systems, then avoid kW and voltage mistakes.',
    purpose:
      'The kVA to Amps Calculator converts an apparent-power rating into estimated current. It is useful for transformer, UPS, generator, panel, and equipment labels that give capacity in kVA.',
    intro:
      'Start with the kVA label, the equipment voltage, and the phase type. For example, a 25 kVA load at 480 V three-phase is about 30.07 A before nameplate rules, breaker sizing, conductor sizing, derating, or local code requirements.',
    inputMatch:
      'the kVA rating, equipment voltage, and single-phase or balanced three-phase mode from the transformer, UPS, generator, panel, or equipment label',
    logicNote:
      'First convert kVA to VA: VA = kVA x 1,000. For single-phase, amps = VA / volts. For balanced three-phase, amps = VA / (line-to-line volts x sqrt(3)). kVA is apparent power, so the direct kVA-to-amps step does not need a power factor input.',
    readIntro:
      'Read amps as an estimated current from apparent power. Then compare the result with manufacturer data, electrical code rules, conductor limits, breaker rules, and any professional design requirements.',
    mistakeIntro:
      'Most kVA-to-amps mistakes come from treating kVA like kW, using line-to-neutral voltage in a line-to-line three-phase calculation, or using the estimate as final sizing instead of a planning check.',
    enter: [
      'Enter the kVA rating from the nameplate, specification sheet, transformer label, UPS label, or generator label.',
      'Enter the voltage for the equipment. For balanced three-phase systems, use line-to-line voltage unless the manufacturer says otherwise.',
      'Choose single-phase or three-phase. Do not add a power factor value, because kVA already describes apparent power.',
    ],
    read: [
      'The main answer is the estimated current in amps.',
      'Volt-amps shows the kVA value after multiplying by 1,000.',
      'The phase factor is 1 for single-phase and sqrt(3) for balanced three-phase.',
      'Use the result as a planning estimate before checking nameplate limits, conductor sizing, breaker sizing, derating, and professional requirements.',
    ],
    mistakes: [
      'Do not treat kVA and kW as identical unless the power factor is exactly 1.',
      'Do not use line-to-neutral voltage when the calculation needs three-phase line-to-line voltage.',
      'Do not use the result alone to size a transformer, UPS, generator, breaker, conductor, or panel.',
      'Do not ignore starting current, continuous-load rules, derating, manufacturer instructions, local code, or qualified electrical review.',
    ],
    extraSections: [
      {
        title: 'Quick 25 kVA transformer example',
        paragraphs: [
          'A 25 kVA transformer on 480 V three-phase power is 25,000 VA after multiplying kVA by 1,000.',
          'Divide 25,000 by 480 x sqrt(3). The estimate is about 30.07 A before code rules, loading, derating, or nameplate instructions are applied.',
          'That makes the calculator useful for an early current check, but it is not a replacement for the transformer data sheet or electrical design work.',
        ],
      },
      {
        title: 'Single-phase, three-phase, and kW checks',
        paragraphs: [
          'A 10 kVA single-phase UPS at 240 V is 10,000 / 240 = 41.67 A.',
          'A 75 kVA load on 208 V balanced three-phase power is 75,000 / (208 x sqrt(3)) = 208.18 A.',
          'If the label gives kW instead of kVA, the job is different because kW is real power and power factor may matter.',
        ],
        bullets: [
          'Use kVA directly when the label gives apparent power.',
          'Use kW-to-amps math only when the label gives real power in kW.',
          'Use line-to-line voltage for balanced three-phase calculations.',
          'Use manufacturer data and a qualified professional for final electrical sizing.',
        ],
      },
      {
        title: 'When this estimate is not enough',
        paragraphs: [
          'The kVA-to-amps formula gives a clean apparent-power estimate. Real installations can need more checks: continuous-load factors, motor starting current, transformer impedance, generator behavior, conductor temperature ratings, voltage drop, breaker curves, and local electrical code.',
          'Use the calculator to understand the scale of the current, then confirm final decisions with the equipment documentation and a qualified electrician or engineer.',
        ],
      },
    ],
    sources: [
      sourceLinks.inchKvaToAmps,
      sourceLinks.openStaxElectricPower,
      sourceLinks.openStaxOhmsLaw,
      sourceLinks.nistUnits,
      sourceLinks.esfiExtensionCordSafety,
    ],
  },
  'amp-hours-to-watt-hours-calculator': {
    title: 'Amp Hours to Watt Hours Guide',
    summary: 'Learn the Ah to Wh formula, a 12.8 V battery example, and the battery limits that change usable energy.',
    metaDescription:
      'Use the Amp Hours to Watt Hours guide to convert Ah and nominal volts into Wh and kWh, check a 12.8 V example, and avoid battery-energy mistakes.',
    purpose:
      'The Amp Hours to Watt Hours Calculator converts a battery capacity label and nominal voltage into stored energy. This helps you compare batteries even when their voltages differ.',
    intro:
      'Start with the label values, then sanity-check the result with the 200 Ah at 12.8 V example before using the number for runtime, solar, power-station, or battery-bank planning.',
    inputMatch: 'the amp-hour rating from the battery label and the nominal pack voltage, such as 12 V, 12.8 V, 24 V, or 48 V',
    logicNote:
      'For example, 200 Ah x 12.8 V = 2,560 Wh. Divide by 1,000 to read the same estimate as 2.56 kWh.',
    readIntro:
      'Read watt-hours first when comparing batteries. Read kilowatt-hours when the pack is large enough that a household-energy or electricity-cost comparison is easier in kWh.',
    mistakeIntro:
      'Most Ah-to-Wh mistakes come from using Ah alone, entering charging voltage instead of nominal voltage, or treating label energy as guaranteed usable runtime.',
    enter: [
      'Enter the battery capacity in amp-hours from the label or specification.',
      'Enter the nominal voltage, not the higher charging voltage.',
      'Calculate to see watt-hours and kilowatt-hours.',
    ],
    read: [
      'Watt-hours is the main stored-energy estimate.',
      'Kilowatt-hours is the same energy in a larger unit.',
      'Higher nominal voltage means the same amp-hours represent more stored energy.',
      'Use the result as a starting energy estimate before applying usable-capacity and efficiency limits.',
    ],
    mistakes: [
      'Do not compare batteries by Ah alone when voltage differs.',
      'Do not use charging voltage when the job calls for nominal battery voltage.',
      'Do not expect all watt-hours to be usable after inverter or converter losses.',
      'Do not ignore battery chemistry, depth-of-discharge limits, age, temperature, and discharge rate.',
    ],
    extraSections: [
      {
        title: 'Quick 12.8 V battery example',
        paragraphs: [
          'Say a LiFePO4 battery bank is labeled 200 Ah at 12.8 V. Multiply 200 by 12.8 to get 2,560 Wh.',
          'That same estimate is 2.56 kWh after dividing by 1,000. This is the number to compare against a 24 V or 48 V pack, because watt-hours include both capacity and voltage.',
          'If a device uses 100 W, 2,560 Wh looks like 25.6 hours before losses. Real runtime is lower after inverter efficiency, battery protection limits, temperature, and age are considered.',
        ],
      },
      {
        title: 'Nominal voltage and usable energy limits',
        paragraphs: [
          'Use nominal voltage for the basic Ah to Wh conversion. A charging voltage can be higher than the battery rating, so using it can make the pack look larger than it really is.',
          'The calculator estimates stored energy, not guaranteed usable energy. Battery management systems, chemistry, discharge rate, cold weather, old cells, and depth-of-discharge settings can all reduce what you can safely use.',
        ],
        bullets: [
          'For battery comparison, convert every pack to Wh or kWh first.',
          'For runtime, use the watt-hours result with the device load and an efficiency assumption.',
          'For electrical safety, sizing, or installation work, use manufacturer data and a qualified professional.',
        ],
      },
    ],
    sources: [sourceLinks.inchAmpHoursToWattHours, sourceLinks.doeApplianceEnergy, sourceLinks.nistUnits],
  },
  'watt-hours-to-amp-hours-calculator': {
    summary:
      'Learn how to convert watt-hours to amp-hours with Wh divided by V, nominal-voltage examples, and battery-runtime limits.',
    metaDescription:
      'Use the Watt Hours to Amp Hours Calculator guide to convert Wh to Ah with nominal voltage, 12.8 V, 24 V, 48 V, and 120 V examples, and battery runtime cautions.',
    purpose:
      'The Watt Hours to Amp Hours Calculator is useful when a battery, power station, or energy label gives you watt-hours but another spec sheet or comparison needs amp-hours at a chosen nominal voltage.',
    intro:
      'A 5,000 Wh power station can sound like a giant amp-hour number until you choose the voltage. At 120 V, the same stored energy is about 41.67 Ah. At a lower battery voltage, the Ah number changes again, which is why the voltage field matters.',
    inputMatch:
      'stored watt-hours from the battery or power-station label, plus the nominal voltage you want the amp-hour estimate to use',
    logicNote:
      'The calculator divides watt-hours by volts. For example, 2,560 Wh / 12.8 V = 200 Ah, while 5,000 Wh / 120 V = about 41.67 Ah. The energy number did not disappear; the amp-hour label changed because the voltage changed.',
    readIntro:
      'Read the answer as an amp-hour estimate at the voltage you entered. If you are comparing batteries at different voltages, compare watt-hours first, then use Ah only after the voltage context is clear.',
    mistakeIntro:
      'Most Wh-to-Ah mistakes come from mixing internal battery voltage with output voltage, using charging voltage instead of nominal voltage, or treating amp-hours as runtime without checking the load watts and efficiency.',
    sidecarText:
      'Open the calculator and try 2,560 Wh at 12.8 V, then change only the voltage to 24 V. The watt-hours stay the same, but the amp-hours move because Ah is tied to voltage.',
    bestUsesIntro:
      'Use this guide when you want to translate a Wh label into an Ah-style number before comparing batteries, reading a spec sheet, or preparing a separate runtime estimate.',
    enter: [
      'Enter watt-hours from the battery label, power-station label, or a previous energy calculation.',
      'Enter the nominal voltage you want the Ah estimate at, such as 12 V, 12.8 V, 24 V, 48 V, or 120 V.',
      'Calculate to estimate amp-hours, then keep the voltage beside the answer when you copy or compare it.',
    ],
    read: [
      'The main answer is amp-hours at the voltage you entered, not a voltage-free battery rating.',
      'Watt-hours stays the same energy number, so use Wh when comparing packs with different voltages.',
      'Changing voltage changes Ah because Ah is charge capacity at a voltage, not stored energy by itself.',
      'A 5,000 Wh value at 120 V is an output-voltage comparison, not necessarily the internal battery-cell Ah rating.',
    ],
    mistakes: [
      'Do not compare Ah ratings across different voltages without converting to Wh.',
      'Do not use charging voltage when the comparison needs nominal battery voltage.',
      'Do not mix a power station output voltage with the internal battery voltage unless that is the comparison you really want.',
      'Do not treat the result as guaranteed runtime without knowing load watts and efficiency.',
    ],
    extraSections: [
      {
        title: 'Why voltage changes the amp-hour number',
        paragraphs: [
          'Amp-hours describe charge capacity at a voltage. Watt-hours describe stored energy more directly. That is why the same Wh value can turn into different Ah values when you divide by 12 V, 24 V, 48 V, or 120 V.',
          'For battery shopping, this matters because two batteries can show very different Ah labels while holding similar energy. A 12 V 100 Ah battery and a 24 V 50 Ah battery are both about 1,200 Wh before real-world losses.',
        ],
        bullets: [
          'Use watt-hours when voltage is different.',
          'Use amp-hours only after the voltage is named.',
          'Keep chemistry, usable depth of discharge, age, and temperature out of the simple conversion unless your spec sheet gives those details.',
        ],
      },
      {
        title: 'Two quick examples to sanity-check your answer',
        paragraphs: [
          'For a LiFePO4-style label, 2,560 Wh at 12.8 V becomes 200 Ah. That is a label-style battery-capacity comparison because 12.8 V is a common nominal voltage for that kind of pack.',
          'For a power station output comparison, 5,000 Wh at 120 V becomes about 41.67 Ah. That does not mean the internal battery pack is only 41.67 Ah; it means the energy is equivalent to about 41.67 amp-hours at 120 V.',
        ],
      },
      {
        title: 'When this is not enough for runtime',
        paragraphs: [
          'Amp-hours by themselves do not tell you how long a device will run. Runtime also needs the load in watts and a realistic efficiency assumption for the inverter, converter, wiring, or battery management system.',
          'Use this guide to translate Wh and Ah cleanly. Then use a runtime calculator when you know the device watts and the losses you want to assume.',
        ],
        links: [
          {
            href: '/tools/device-battery-life-calculator/',
            label: 'Estimate runtime with the Device Battery Life Calculator',
          },
        ],
      },
    ],
    sources: [sourceLinks.inchWattHoursToAmpHours, sourceLinks.doeApplianceEnergy, sourceLinks.nistUnits],
  },
  'wire-resistance-calculator': {
    summary: 'Learn how copper AWG size and wire length affect estimated resistance.',
    purpose:
      'The Wire Resistance Calculator estimates total ohms from copper AWG size, one-way length, and conductor count. It helps explain why long, thin conductors create more voltage drop.',
    enter: [
      'Choose the copper AWG size.',
      'Enter the one-way wire length in feet.',
      'Enter conductor count, often 2 for a simple out-and-back path.',
    ],
    read: [
      'Total resistance is the estimated ohms for all conductor lengths included.',
      'One-way resistance shows the estimate before multiplying by conductor count.',
      'The table value shows ohms per 1,000 feet for the chosen copper size.',
    ],
    mistakes: [
      'Do not use this as a full code or safety calculation.',
      'Do not forget that temperature, conductor material, and terminals can change real resistance.',
      'Do not use conductor count 1 when you meant a full loop path.',
    ],
    sources: [sourceLinks.inchWireSize, sourceLinks.usaceVoltageDrop, sourceLinks.nistUnits],
  },
  'wire-size-calculator': {
    summary:
      'Learn how current, one-way length, voltage, phase, and a voltage-drop target can point to a copper AWG size.',
    metaDescription:
      'Use the Wire Size Calculator guide to estimate copper AWG size from amps, one-way length, voltage, phase, and voltage-drop target with practical examples.',
    purpose:
      'The Wire Size Calculator tests common copper AWG sizes and returns the first size that stays within the voltage-drop percentage you choose. It is useful for early planning and comparison before a qualified electrical-code review.',
    intro:
      'Wire size estimates can look confusing because the answer changes when current, one-way distance, source voltage, phase, or allowed voltage drop changes. A 120 V, 15 A, 75 ft run with a 3% target lands on 12 AWG in this calculator, while longer or lower-voltage runs can need a larger copper size.',
    inputMatch:
      'source voltage, expected load current in amps, source-to-load one-way length in feet, maximum voltage-drop percentage, and single/DC or balanced three-phase mode',
    logicNote:
      'The calculator tests supported copper AWG sizes from 14 AWG through 4/0. For each size, it estimates voltage drop from current, copper resistance per foot, one-way length, and circuit factor. Single/DC uses the out-and-back factor of 2; balanced three-phase uses sqrt(3).',
    readIntro:
      'Read the answer as the first supported copper AWG size that meets the voltage-drop percentage you entered. Then check the supporting voltage-drop, percent-drop, and load-voltage lines before treating the result as useful.',
    mistakeIntro:
      'The big mistake is treating a voltage-drop estimate like final electrical approval. Real conductor sizing also needs ampacity, breaker size, insulation rating, terminals, raceway fill, temperature correction, conductor material, equipment instructions, and local code.',
    sidecarText:
      'Open the calculator and try 120 V, 15 A, 75 ft, max 3%, single/DC. Then change only the length to 150 ft so you can see why the suggested AWG size changes.',
    bestUsesIntro:
      'Use this guide when you want to understand why the calculator picked a copper AWG size and what still needs review before a real installation.',
    enter: [
      'Enter source voltage before the wire run loses voltage.',
      'Enter expected load current in amps and the source-to-load one-way length in feet.',
      'Enter the maximum voltage-drop percentage, such as 3%.',
      'Choose single/DC or balanced three-phase circuit type so the voltage-drop factor matches the run.',
    ],
    read: [
      'The main answer is the first supported copper AWG size that meets the voltage-drop target.',
      'Estimated drop and percent drop show why that size was selected.',
      'Load voltage shows the source voltage after the estimated drop.',
      'If the answer is near your limit, rerun with a tighter drop percentage or review a larger conductor with a qualified person.',
    ],
    mistakes: [
      'Do not treat voltage drop as the only wire-sizing rule.',
      'Do not enter round-trip length when the calculator asks for one-way length.',
      'Do not use copper AWG results for aluminum conductors without a separate source-backed calculation.',
      'Do not ignore ampacity, breaker size, insulation, raceway fill, temperature, terminals, equipment instructions, and local code.',
      'Do not use this as a substitute for a licensed electrician.',
    ],
    extraSections: [
      {
        title: 'Why one-way length matters',
        paragraphs: [
          'The calculator asks for the physical distance from the source to the load. For a simple single-phase or DC run, it applies the out-and-back factor internally, so entering the round-trip length would double-count the distance.',
          'For example, a 120 V, 15 A, 75 ft run with a 3% target returns 12 AWG with about 3.573 V of drop, 2.9775% drop, and about 116.427 V at the load.',
        ],
      },
      {
        title: 'Two examples that show why voltage changes the answer',
        paragraphs: [
          'A 240 V, 30 A, 100 ft single/DC run with a 3% target returns 10 AWG, about 5.994 V of drop, 2.4975% drop, and about 234.006 V at the load.',
          'A 24 V, 5 A, 40 ft single/DC run with the same 3% target returns 12 AWG, about 0.6352 V of drop, 2.6466666667% drop, and about 23.3648 V at the load. Lower voltage makes each lost volt count more as a percentage.',
        ],
      },
      {
        title: 'Single/DC versus balanced three-phase',
        paragraphs: [
          'Single/DC mode uses the out-and-back factor of 2. Balanced three-phase mode uses sqrt(3), so it can return a different drop estimate from the same length and current.',
          'For a 208 V, 20 A, 150 ft balanced three-phase run with a 3% target, this calculator returns 10 AWG with about 5.1909562703 V of drop, 2.495652053% drop, and about 202.80904373 V at the load.',
        ],
      },
      {
        title: 'What still needs a real electrical check',
        paragraphs: [
          'Voltage drop is only one part of wire sizing. A real installation needs ampacity checks, breaker sizing, conductor insulation rating, terminal temperature limits, raceway fill, ambient temperature correction, conductor material, equipment instructions, and local electrical code.',
          'Use this calculator for planning and comparison. Use the result as a question to bring into a code-aware review, not as permission to install a conductor.',
        ],
        links: [
          {
            href: '/tools/voltage-drop-calculator/',
            label: 'Check a specific copper AWG size with the Voltage Drop Calculator',
          },
          {
            href: '/tools/wire-resistance-calculator/',
            label: 'Estimate copper wire resistance directly',
          },
        ],
      },
    ],
    sources: [sourceLinks.inchWireSize, sourceLinks.usaceVoltageDrop, sourceLinks.openStaxOhmsLaw, sourceLinks.nistUnits],
  },
  'btu-calculator': {
    title: 'BTU Calculator Guide',
    summary: 'Learn how to estimate room AC BTU/h from square feet, ceiling height, sunlight, people, and kitchen heat.',
    metaDescription:
      'Use the BTU Calculator guide to estimate room air conditioner BTU/h from square feet, ceiling height, sunlight, people, kitchen heat, and practical sizing limits.',
    purpose:
      'The BTU Calculator estimates room air conditioner cooling capacity. It starts with a room-size table and then adjusts for ceiling height, sunlight, extra people, and kitchen heat.',
    intro:
      'Use it when you are choosing a window or portable room air conditioner for one room, not designing a whole-home HVAC system. The goal is to get close enough for shopping, then sanity-check the room conditions before you buy.',
    inputMatch:
      'the room square footage, ceiling height, sunlight level, regular people count, and kitchen heat choice for the same room or open area',
    logicNote:
      'The calculator starts with an 8-foot-ceiling room-size BTU table, scales the base value by ceiling height divided by 8, subtracts 10% for shaded rooms, adds 10% for sunny rooms, adds 600 BTU/h for each regular person above two, adds 4,000 BTU/h for kitchen heat, and rounds to the nearest 500 BTU/h.',
    readIntro:
      'Read the rounded BTU/h recommendation first, then compare the base table value and adjusted estimate so you can see which input pushed the answer up or down.',
    mistakeIntro:
      'Most room AC sizing mistakes come from guessing square footage, ignoring a tall ceiling or strong sun, treating kitchen heat as a normal room, or buying the largest unit because it feels safer.',
    sidecarText:
      'Open the BTU Calculator beside this guide. Try the 180 ft2 bedroom first, then test the sunny living room and kitchen examples before replacing them with your own room.',
    bestUsesIntro:
      'Use this guide when you are sizing one room or one open area and want to understand why the calculator moves from base BTU to adjusted BTU.',
    enter: [
      'Measure or estimate the room square footage. For irregular rooms, split the area into simple rectangles first, or use the Square Footage Calculator.',
      'Enter the ceiling height in feet. Leave it at 8 only when the room is close to a normal 8-foot ceiling.',
      'Choose shaded, normal, or sunny based on the room during the hot part of the day.',
      'Enter the number of people who regularly use the room, not the largest party the room has ever held.',
      'Turn on kitchen heat only when cooking appliances or an open kitchen are part of the area you are cooling.',
    ],
    read: [
      'Recommended BTU/h is the practical room AC size estimate after rounding to a 500 BTU/h step.',
      'Base table value is the square-footage starting point for an 8-foot ceiling before the room-specific adjustments.',
      'Adjusted estimate is the number before final rounding. It helps explain why a room landed near 6,000, 10,000, 13,000, or another common product label.',
      'If the result sits between two available products, check humidity, insulation, window area, and manufacturer guidance before choosing the larger unit.',
    ],
    mistakes: [
      'Do not assume bigger is always better. Oversized room AC units can cool quickly but leave the room damp or clammy.',
      'Do not use one room estimate for a whole house, central HVAC replacement, duct design, or a Manual J-style load calculation.',
      'Do not forget kitchens, strong sun, west-facing windows, poor insulation, air leaks, or unusually high ceilings.',
      'Do not measure only the easiest rectangle if the room has alcoves, connected spaces, or an open-plan doorway that the AC will also cool.',
      'Do not copy a product label alone. Check voltage, outlet requirements, installation clearances, drainage, noise, and the manufacturer sizing notes.',
    ],
    extraSections: [
      {
        title: 'Quick bedroom example',
        paragraphs: [
          'Say the room is a 180 ft2 bedroom with an 8 ft ceiling, normal sun, and two regular occupants.',
          'The square-footage table starts 180 ft2 at 6,000 BTU/h. The ceiling-height multiplier is 8 / 8, so the number stays 6,000. Normal sunlight and two people add nothing.',
          'The calculator returns 6,000 BTU/h recommended. That is a clean room AC shopping estimate for a normal bedroom, not a promise about every house or climate.',
        ],
      },
      {
        title: 'Sunny living room example',
        paragraphs: [
          'Now try a 420 ft2 living room with a 9 ft ceiling, sunny exposure, and three regular occupants.',
          'The table starts 420 ft2 at 10,000 BTU/h. A 9 ft ceiling scales that to 11,250 BTU/h. Sunny exposure adds 10%, bringing the estimate to 12,375 BTU/h. The third regular person adds 600 BTU/h, for 12,975 BTU/h before rounding.',
          'The calculator rounds that to 13,000 BTU/h recommended. This example is useful because it shows why a room can move above the square-footage table without changing floor area.',
        ],
      },
      {
        title: 'Kitchen area example',
        paragraphs: [
          'For a 300 ft2 open kitchen area with an 8 ft ceiling, normal sun, and the kitchen heat box selected, the base table value is 7,000 BTU/h.',
          'The ceiling and sunlight settings do not change the base in this example, and two people do not add extra occupant load. The kitchen heat adjustment adds 4,000 BTU/h.',
          'The calculator returns 11,000 BTU/h recommended. That extra 4,000 BTU/h is why kitchen and open kitchen areas should not be treated like quiet bedrooms of the same square footage.',
        ],
      },
      {
        title: 'When the estimate is close between two AC sizes',
        paragraphs: [
          'Room air conditioners are sold in fixed capacity steps, so your exact estimate may land between two models. Do not round up automatically.',
          'If the room has strong humidity, poor insulation, many windows, high heat from appliances, or an open connection to another space, compare manufacturer guidance carefully. If the room is shaded, well sealed, and rarely crowded, the smaller nearby size may feel better than an oversized unit.',
          'The calculator gives the math conversation. The final purchase should also consider efficiency rating, noise, outlet requirements, window fit, installation quality, drainage, and whether the product can send airflow where the room needs it.',
        ],
        links: [
          {
            href: '/tools/square-footage-calculator/',
            label: 'Measure irregular room area with the Square Footage Calculator',
          },
          {
            href: '/tools/electricity-calculator/',
            label: 'Estimate electrical usage after choosing an appliance wattage',
          },
        ],
      },
      {
        title: 'When this guide is not enough',
        paragraphs: [
          'Use this page for room air conditioner shopping estimates. It is not a full load calculation for central air, heat pumps, ducted systems, additions, rentals with strict rules, or expensive equipment decisions.',
          'A professional load calculation can include climate, orientation, insulation, window type, infiltration, humidity, internal gains, duct losses, zoning, and equipment performance. Those details are outside this quick browser calculator.',
        ],
      },
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
    title: 'Resistor Color Code Calculator Guide',
    summary:
      'Learn how 4-band resistor colors decode into ohms, tolerance, minimum value, and maximum value.',
    metaDescription:
      'Use the Resistor Calculator guide to decode 4-band resistor color codes into ohms and tolerance, with 1 kOhm, 4.7 kOhm, gold, silver, and multimeter checks.',
    purpose:
      'The Resistor Calculator turns common 4-band resistor color codes into a nominal resistance, tolerance percentage, minimum resistance, and maximum resistance.',
    intro:
      'Start with the band direction, then decode the two digit bands, multiplier band, and tolerance band. For example, brown black red gold means 10 x 100 = 1,000 ohms with +/- 5% tolerance, so the part may still be correct from 950 to 1,050 ohms.',
    inputMatch:
      'the four color bands on one common 4-band resistor: first digit, second digit, multiplier, and tolerance',
    logicNote:
      'Read the first two bands as a two-digit number, multiply by the third band, then apply the fourth band tolerance. Yellow violet red gold becomes 47 x 100 = 4,700 ohms. Gold tolerance means +/- 5%, so the acceptable range is 4,465 to 4,935 ohms.',
    readIntro:
      'Read the nominal ohms first, then read the tolerance range before deciding whether the part is close enough for your lesson, breadboard, repair note, or component check.',
    mistakeIntro:
      'Most resistor color-code mistakes come from reading the bands backward, confusing a multiplier band with a tolerance band, or trusting faded colors without a multimeter check.',
    sidecarText:
      'Use the Resistor Calculator while you follow the examples. Try brown black red gold for 1 kOhm, then try yellow violet red gold for 4.7 kOhm.',
    bestUsesIntro:
      'Use this guide when the resistor is a common 4-band part and you want enough context to know whether the decoded ohm value is believable.',
    enter: [
      'Find the reading direction. The tolerance band is often gold or silver and usually sits slightly apart from the first three bands.',
      'Choose the first digit color and second digit color exactly as they appear on the resistor.',
      'Choose the multiplier color, including gold for x0.1 or silver for x0.01 when those appear in the third band position.',
      'Choose the tolerance color so the calculator can show the minimum and maximum likely resistance.',
    ],
    read: [
      'Nominal resistance is the printed or decoded target value in ohms.',
      'Tolerance shows how far the real part may be from that target and still match its rating.',
      'Minimum and maximum convert the tolerance into a practical range, such as 950 to 1,050 ohms for a 1 kOhm +/- 5% resistor.',
      'Use the range as a color-code check, then use a multimeter when the exact part value matters.',
    ],
    mistakes: [
      'Do not read the bands backward just because the resistor is rotated on the desk.',
      'Do not treat gold or silver as tolerance every time; in the third band position, gold is x0.1 and silver is x0.01.',
      'Do not use this 4-band guide for a 5-band, 6-band, SMD, or parallel-resistor problem.',
      'Do not trust faded, scorched, or smeared colors without checking the part with a multimeter.',
      'Do not measure or swap parts on a powered circuit unless you are trained and the circuit is made safe.',
    ],
    extraSections: [
      {
        title: 'Quick 1 kOhm color-code example',
        paragraphs: [
          'Say the bands are brown, black, red, and gold. Brown is 1 and black is 0, so the first two bands make 10.',
          'Red as the multiplier means x100. Multiply 10 by 100 to get 1,000 ohms, usually written as 1 kOhm.',
          'Gold tolerance means +/- 5%. Five percent of 1,000 is 50, so the expected range is 950 to 1,050 ohms.',
        ],
      },
      {
        title: 'Gold, silver, 5-band, and SMD limits',
        paragraphs: [
          'Gold and silver can be confusing because they can appear as multiplier colors or tolerance colors. The position matters. In the multiplier slot, gold means x0.1 and silver means x0.01. In the tolerance slot, gold commonly means +/- 5% and silver commonly means +/- 10%.',
          'This guide is for the common 4-band pattern only. A 5-band resistor uses three digit bands before the multiplier, and an SMD resistor uses printed numbers or letters instead of painted bands.',
        ],
        bullets: [
          'Use this page for 4-band color-code decoding.',
          'Use a 5-band-specific reference when there are three significant digit bands.',
          'Use an SMD resistor-code reference when the part has printed markings instead of color bands.',
          'Use a multimeter and safe handling when a real circuit depends on the value.',
        ],
      },
      {
        title: 'When the color-code answer is not enough',
        paragraphs: [
          'The calculator explains the code printed on the part. It does not prove the resistor is healthy, installed correctly, cool enough, or safe for the circuit.',
          'For homework and breadboard checks, the decoded value is usually the answer you need. For repairs, power circuits, heat-sensitive parts, or anything connected to a live supply, verify the component and follow proper electrical safety practice.',
        ],
      },
    ],
    sources: [sourceLinks.iecResistorCode, sourceLinks.teResistorCode, sourceLinks.openStaxOhmsLaw, sourceLinks.nistUnits],
  },
  'ohms-law-calculator': {
    title: 'Ohm\'s Law Calculator Guide',
    summary: 'Learn how voltage, current, resistance, and power fit together, with V/I/R/P examples and safety limits.',
    metaDescription:
      'Use the Ohm\'s Law Calculator guide to solve voltage, current, resistance, and power from two known values, then avoid unit and circuit-safety mistakes.',
    purpose:
      'The Ohm\'s Law Calculator solves basic resistor and power relationships. Enter two known voltage, current, resistance, or power values and it fills in the rest.',
    intro:
      'Ohm\'s law is easiest when you start with the two values you actually know. If you know 12 V and 2 A, the calculator can show 6 ohms and 24 W. If you know 12 V and 24 W, it can work backward to 2 A and the same 6 ohms.',
    inputMatch:
      'the exact pair you know: voltage and current, voltage and resistance, current and resistance, voltage and power, current and power, or resistance and power',
    logicNote:
      'The core relationship is V = I x R. Power adds P = V x I, plus the rearranged checks P = I^2 x R and P = V^2 / R when power is one of the known values.',
    readIntro:
      'Read voltage, current, resistance, and power as one matched set for a simple DC or purely resistive circuit. The power line is especially useful for checking whether a resistor, LED setup, battery load, or test circuit might need a higher wattage rating.',
    mistakeIntro:
      'Most Ohm\'s law mistakes come from mixing milliamps with amps, kilohms with ohms, using a power rating as if it were a measured value, or applying simple resistor math to motors, speakers, capacitors, inductors, or other reactive AC loads.',
    sidecarText:
      'Open the Ohm\'s Law Calculator beside this guide. Try 12 V and 2 A first, then switch to V and P or R and P to see how the same circuit can be solved from different known values.',
    bestUsesIntro:
      'Use this guide when you are checking simple positive resistor math, electronics homework, LED current checks, breadboard examples, battery-load estimates, or quick power-rating sanity checks.',
    enter: [
      'Choose the pair of values you know: V and I, V and R, I and R, V and P, I and P, or R and P.',
      'Enter amps as amps and resistance as ohms. Convert 500 mA to 0.5 A or 2 kOhm to 2,000 ohms before you calculate.',
      'Calculate to get the remaining voltage, current, resistance, and power values for the same simple circuit.',
    ],
    read: [
      'Voltage is electrical potential difference, shown in volts.',
      'Current is flow, shown in amps.',
      'Resistance is opposition to current, shown in ohms.',
      'Power is energy rate, shown in watts, and it matters for heat and component ratings.',
    ],
    mistakes: [
      'Do not use simple DC resistor math for every AC or reactive circuit.',
      'Do not ignore component power ratings and heat.',
      'Do not mix mA, A, kOhm, and ohm values without converting first.',
      'Never test live circuits without proper training and equipment.',
    ],
    extraSections: [
      {
        title: 'Quick 12 V example',
        paragraphs: [
          'Say you know a simple load has 12 V across it and draws 2 A. Choose V and I, enter 12 and 2, and the calculator returns 6 ohms because R = V / I.',
          'The same result also gives 24 W because P = V x I. That wattage is not just trivia: it tells you the load is turning energy into heat, light, motion, or another output at a 24-watt rate.',
        ],
      },
      {
        title: 'Solving from power values',
        paragraphs: [
          'If you know 12 V and 24 W, choose V and P. The calculator divides 24 W by 12 V to get 2 A, then divides 12 V by 2 A to get 6 ohms.',
          'If you know 6 ohms and 24 W, choose R and P. The calculator uses I = sqrt(P / R), so sqrt(24 / 6) is 2 A, and then V = I x R gives 12 V.',
        ],
        bullets: [
          'Use V and P when a supply voltage and wattage rating are known.',
          'Use I and P when current and wattage are known but voltage is not.',
          'Use R and P when resistance and wattage are known and you need the matching voltage and current.',
        ],
      },
      {
        title: 'When this guide is not enough',
        paragraphs: [
          'Ohm\'s law is a clean model for simple DC or purely resistive examples. Real electrical work can involve AC impedance, motors, speakers, capacitors, inductors, startup current, temperature, tolerance, duty cycle, code rules, and shock or fire hazards.',
          'Use the guide to understand the math. Use manufacturer data, a multimeter when safe and appropriate, and qualified electrical help for live circuits, mains wiring, batteries that can deliver dangerous current, or any final design decision.',
        ],
      },
    ],
    sources: [sourceLinks.openStaxOhmsLaw, sourceLinks.openStaxElectricPower, sourceLinks.nistUnits, sourceLinks.esfiExtensionCordSafety],
  },
  'electricity-calculator': {
    summary: 'Learn how watts and time turn into kWh and estimated electricity cost.',
    metaDescription:
      'Use the Electricity Calculator guide to estimate appliance kWh and cost from watts, hours, days, and price per kWh, with heater, bulb, PC, and AC examples.',
    purpose:
      'The Electricity Calculator estimates energy use and cost for one device or appliance. It is useful when you know the wattage, average hours per day, days used, and your electricity price per kWh.',
    intro:
      'Use this guide when you are trying to answer a practical question such as "how much does this heater cost to run for a month?" or "is this old device worth measuring with a plug-in meter?" The calculator turns watts and time into kWh, then multiplies by your rate so the result feels closer to a bill line instead of just an electrical unit.',
    inputMatch:
      'the device watts, average hours used per day, number of days in the estimate window, and your electricity rate per kWh',
    logicNote:
      'The calculator first divides watts by 1,000 to get kilowatts. Then it uses kWh = kilowatts x hours per day x days. Finally, estimated cost = kWh x rate per kWh. A 1,500 W heater running 4 hours a day for 30 days uses 180 kWh; at $0.16/kWh, that is about $28.80.',
    readIntro:
      'Read the kWh line as the energy use, then read the cost line as the estimate from the rate you entered. If the number surprises you, change only one input at a time so you can see whether wattage, hours, days, or rate is doing most of the damage.',
    mistakeIntro:
      'Most electricity-cost mistakes come from using nameplate watts for a device that cycles on and off, forgetting standby power, mixing watts with kilowatts, or using the wrong price per kWh from the utility bill.',
    sidecarText:
      'Keep the Electricity Calculator open beside this guide. Try the 1,500 W heater example first, then replace the watts, hours, days, and rate with your own numbers.',
    bestUsesIntro:
      'Best for one-device estimates, quick appliance comparisons, and deciding whether a device is worth measuring more carefully.',
    referenceIntro:
      'These references support the kWh unit, appliance-estimation method, and SI unit wording used in the calculator and guide.',
    enter: [
      'Enter the device wattage from a label, manual, smart plug, or reasonable estimate.',
      'Enter average hours per day. For a cycling device, use average running time or average watts when you have it.',
      'Enter the number of days, such as 30 for a rough month or 365 for a year.',
      'Enter your electricity price per kWh before taxes, fixed fees, or other bill add-ons.',
    ],
    read: [
      'kWh is the energy amount your bill commonly uses.',
      'Estimated cost multiplies kWh by the rate you entered.',
      'The rate line reminds you which price was used.',
      'The same device can look cheap for one hour and expensive over a month, so always check the days field.',
    ],
    mistakes: [
      'Do not forget that some devices cycle on and off instead of drawing full wattage all day.',
      'Do not confuse watts with kilowatts. A kilowatt is 1,000 watts.',
      'Do not use the full bill total as your price per kWh unless you mean to include fixed charges in a rough way.',
      'Do not assume standby power is zero. Small idle loads can matter when they run all day.',
      'Do not use this as a wiring, safety, code, or equipment-sizing sign-off.',
    ],
    extraSections: [
      {
        title: 'Example: space heater for a month',
        paragraphs: [
          'Say a small space heater is rated at 1,500 W and you run it 4 hours per day for 30 days. Your energy price is $0.16/kWh.',
          'The calculator turns 1,500 W into 1.5 kW. Then 1.5 kW x 4 hours x 30 days = 180 kWh. At $0.16 per kWh, the estimate is about $28.80.',
          'That result is useful because it shows why high-wattage heat can become noticeable fast, even when the heater is only used for part of the day.',
        ],
      },
      {
        title: 'Example: LED bulb for a year',
        paragraphs: [
          'Now compare a 10 W LED bulb used 5 hours per day for 365 days at the same $0.16/kWh rate.',
          'The calculator uses 0.01 kW x 5 x 365 = 18.25 kWh. The estimated yearly cost is about $2.92.',
          'This is why wattage matters so much. The heater and the bulb may both be common household devices, but their power draw is not even close.',
        ],
      },
      {
        title: 'Example: gaming PC or window AC',
        paragraphs: [
          'A 450 W gaming PC used 3 hours per day for 30 days uses 40.5 kWh. At $0.18/kWh, that is about $7.29.',
          'A 900 W window AC used 8 hours per day for 30 days uses 216 kWh. At $0.16/kWh, that is about $34.56.',
          'The AC example is the one to treat carefully because many air conditioners cycle. If the compressor is not running the whole time, average watts may be lower than the label wattage. If the room is very hot or poorly sealed, it may run more often.',
        ],
        links: [
          {
            href: '/tools/btu-calculator/',
            label: 'Estimate room AC size with the BTU Calculator',
          },
        ],
      },
      {
        title: 'Monthly versus yearly estimates',
        paragraphs: [
          'For a quick monthly estimate, 30 days is usually close enough. For a yearly estimate, use 365 days only if the device really runs that pattern all year.',
          'Seasonal devices need a smaller window. A window AC might run hard for 60 to 120 days, while holiday lights, heaters, dehumidifiers, fans, and sump pumps can have very uneven use.',
          'When comparing two devices, keep the days and rate the same so the wattage and hours are the only things changing.',
        ],
      },
      {
        title: 'When a device cycles or changes power',
        paragraphs: [
          'Refrigerators, dehumidifiers, heat pumps, air conditioners, pumps, and many heaters do not draw the same watts every minute. They cycle, ramp, or pause.',
          'If you only have the nameplate wattage, treat the answer as a rough upper or planning estimate. For a closer number, use a plug-in power meter, a smart plug with energy tracking, or manufacturer energy-use data.',
          'For computers, TVs, chargers, and network gear, power can also change with brightness, workload, sleep mode, radios, and connected devices. Average watts is better than peak watts when you can get it.',
        ],
        links: [
          {
            href: '/tools/device-battery-life-calculator/',
            label: 'Compare watts and runtime with the Device Battery Life Calculator',
          },
        ],
      },
      {
        title: 'When this guide is not enough',
        paragraphs: [
          'The guide is for appliance-level cost estimates. It does not replace your utility bill, a licensed electrician, product safety instructions, local electrical code, or a home energy audit.',
          'Real bills can include fixed customer charges, taxes, delivery fees, fuel adjustments, tiered rates, time-of-use rates, demand charges, solar credits, and minimum bills. Those details can make the bill total different from a simple kWh x rate estimate.',
          'For electrical safety, wiring, circuit capacity, breakers, extension cords, or equipment installation, use manufacturer instructions and qualified help instead of a cost calculator.',
        ],
        links: [
          {
            href: '/tools/watts-to-amps-calculator/',
            label: 'Check watts and amps separately with the Watts to Amps Calculator',
          },
          {
            href: '/tools/ohms-law-calculator/',
            label: 'Use Ohm\'s Law for simple circuit math',
          },
        ],
      },
    ],
    sources: [sourceLinks.eiaKwh, sourceLinks.doeApplianceEnergy, sourceLinks.nistUnits],
  },
  'shoe-size-conversion': {
    summary: 'Learn how measured foot length converts into approximate adult shoe sizes.',
    purpose:
      'The Shoe Size Conversion tool starts with foot length in centimeters and estimates US men, US women, UK, and EU adult sizes. It is best for orientation before checking a brand chart.',
    intro:
      'Use it when you measured a foot in centimeters and want a quick adult-size estimate before opening the manufacturer chart. The important move is to treat the answer as a fit starting point, not a promise that every brand will label the shoe the same way.',
    inputMatch:
      'the measured foot length in centimeters, then compare the US men, US women, UK, EU, and foot-inches lines against the brand chart you plan to use',
    logicNote:
      'For a 26 cm foot, the tool first converts 26 cm to about 10.24 inches. It then estimates about US men 8.71, US women 10.21, UK adult 8.21, and EU adult 41.25, which is why nearby half sizes and the brand chart still matter.',
    readIntro:
      'Read the US men line as the main estimate, then compare the US women, UK, and EU lines only as sizing-system translations. If the result lands between two half sizes, check both nearby sizes before choosing.',
    mistakeIntro:
      'Most shoe-size mistakes come from measuring loosely, mixing centimeters with inches, treating kids sizes like adult sizes, or trusting the calculator instead of the brand chart.',
    sidecarText:
      'Keep the Shoe Size Conversion open beside this guide. Try the 26 cm example first, then replace it with the measured foot length you actually plan to compare.',
    bestUsesIntro:
      'Best when you have a measured adult foot length and need a quick cross-system estimate before checking a store or manufacturer chart.',
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
    summary: 'Learn how moles, grams, molar mass, and final solution volume create molarity.',
    metaDescription:
      'Use the Molarity Calculator guide to convert moles or grams into mol/L, check final solution volume, and avoid common molar-mass and lab mistakes.',
    purpose:
      'The Molarity Calculator finds mol/L concentration from moles and final solution volume. It can also start with grams when you know molar mass.',
    intro:
      'Use it when a chemistry problem asks for concentration and you need to decide between moles mode and grams mode. The key detail is final solution volume: if you dissolve a solute and fill the flask to 0.5 L, use 0.5 L, not just the water you poured in first.',
    inputMatch:
      'the calculation mode, moles or grams of solute, molar mass in g/mol when grams mode is used, and final solution volume in liters',
    logicNote:
      'Molarity is moles of solute divided by liters of final solution. In grams mode, divide grams by molar mass first. For example, 5.844 g NaCl / 58.44 g/mol = 0.1 mol; 0.1 mol / 0.5 L = 0.2 M.',
    readIntro:
      'Read the M value as moles per liter of final solution. Then check the moles line, and in grams mode check the molar mass line, so you know which conversion created the answer.',
    mistakeIntro:
      'Most molarity mistakes come from using solvent volume instead of final solution volume, skipping the grams-to-moles conversion, or using the wrong molar mass for a hydrate or compound.',
    sidecarText:
      'Keep the Molarity Calculator open beside this guide. Try the 5.844 g NaCl, 58.44 g/mol, 0.5 L example first, then replace one input at a time.',
    bestUsesIntro:
      'Use the guide when you are turning a homework or lab-planning problem into the exact calculator inputs.',
    enter: [
      'Choose moles and volume when the amount of solute is already in moles.',
      'Choose grams and molar mass when the problem starts from a weighed amount.',
      'Enter final solution volume in liters after the solute is dissolved and diluted to the mark.',
      'Calculate to see molarity in M, which means mol per liter.',
    ],
    read: [
      'The main answer is molarity, written as M.',
      'A result of 0.2 M means 0.2 mol of solute per liter of final solution.',
      'Moles shows the amount of solute used in the final division.',
      'Molar mass appears when grams mode is used, so you can check the grams-to-moles step.',
    ],
    mistakes: [
      'Do not use solvent volume when the problem asks for final solution volume.',
      'Do not mix grams and moles without converting.',
      'Do not use a molar mass for the wrong compound or hydration state.',
      'Check significant figures, solute purity, safety procedures, and lab instructions before using the number in real lab work.',
    ],
    extraSections: [
      {
        title: 'Example: NaCl grams to molarity',
        paragraphs: [
          'Say you have 5.844 g of NaCl, a molar mass of 58.44 g/mol, and a final solution volume of 0.5 L.',
          'First convert grams to moles: 5.844 / 58.44 = 0.1 mol. Then divide by 0.5 L. The calculator returns 0.2 M, so the final solution has 0.2 mol of NaCl per liter.',
        ],
      },
      {
        title: 'Final solution volume check',
        paragraphs: [
          'Molarity uses the final volume of the whole solution, not just the starting solvent. In a volumetric flask, that usually means dissolving the solute first, then filling to the final mark.',
          'This is why the same 0.1 mol can become 0.1 M in 1 L, 0.2 M in 0.5 L, or 1 M in 0.1 L. The moles did not change, but the liters did.',
        ],
      },
      {
        title: 'What the guide cannot sign off',
        paragraphs: [
          'This guide is good for checking the math and understanding the units. It does not replace your teacher, lab manual, chemical safety sheet, or required significant-figure rules.',
          'For actual lab work, also check compound purity, hydrate state, measurement uncertainty, and whether your procedure says to prepare to volume or mix fixed liquid amounts.',
        ],
      },
    ],
    sources: [sourceLinks.openStaxMolarity, sourceLinks.bipmSi, sourceLinks.nistAtomicWeights],
  },
  'molecular-weight-calculator': {
    title: 'Molecular Weight Calculator Guide',
    summary: 'Learn how a chemical formula becomes molar mass, atom counts, and element mass shares.',
    metaDescription:
      'Use the Molecular Weight Calculator guide with H2O, Ca(OH)2, and CuSO4.5H2O examples. Learn molar mass, parentheses, hydrates, and mass shares.',
    purpose:
      'The Molecular Weight Calculator parses a common chemical formula, counts atoms, multiplies each element count by a rounded atomic weight, and adds the parts to estimate molar mass in g/mol.',
    intro:
      'Use this guide when a chemistry problem gives you a formula and asks for molecular weight, formula weight, or molar mass. The calculator is best for common classroom formulas where you want the atom count and g/mol result without rebuilding the whole periodic-table sum by hand.',
    bestUsesIntro:
      'Use it for formulas such as H2O, C6H12O6, Ca(OH)2, and CuSO4.5H2O, especially when parentheses or hydrate dots make the count easy to miss.',
    inputMatch: 'the chemical formula exactly as the problem writes it, including capitalization, subscripts, parentheses, and dot hydrate parts',
    logicNote:
      'The calculator removes spaces, splits dot hydrate parts at periods, applies any leading hydrate coefficient, parses element symbols and parentheses, then adds count x rounded atomic weight for each element. For H2O, it uses (2 x 1.008) + 15.999 = about 18.015 g/mol.',
    readIntro:
      'Read the g/mol answer first. Then check Atoms counted to catch missed subscripts, Elements to confirm the formula was understood, and Composition to see each element count and mass share.',
    mistakeIntro:
      'Most mistakes come from lowercase-only formulas, confusing CO with Co, forgetting that a number after parentheses multiplies the whole group, or entering a hydrate without the period and leading coefficient.',
    sidecarText:
      'Open the Molecular Weight Calculator beside this guide. Try H2O first, then Ca(OH)2, then CuSO4.5H2O so you can see how simple formulas, parentheses, and hydrates change the atom count.',
    referenceIntro:
      'These references support the SI molar-mass units, rounded atomic-weight context, and molarity handoff used in this guide.',
    enter: [
      'Enter a formula such as H2O, C6H12O6, Ca(OH)2, or CuSO4.5H2O.',
      'Use normal element capitalization. CO is carbon plus oxygen, but Co is cobalt.',
      'Put subscripts directly after the element or group they belong to.',
      'Use a period for dot hydrates, such as CuSO4.5H2O.',
    ],
    read: [
      'The main answer is estimated grams per mole, written as g/mol.',
      'Atoms counted tells you whether subscripts, parentheses, and hydrate coefficients were read.',
      'Elements lists the element symbols the parser found.',
      'Composition shows each element count and the percentage of the total molar mass it contributes.',
    ],
    mistakes: [
      'Do not use lowercase-only formulas. Element symbols need the right capital letters.',
      'Do not skip parentheses. CaOH2 is not the same input as Ca(OH)2.',
      'Do not forget hydrate water. CuSO4 and CuSO4.5H2O have different molar masses.',
      'Do not expect isotope-exact mass from rounded atomic weights.',
      'Do not use this for charges, structural formulas, isotope-exact mass, or unsupported elements without checking a chemistry reference.',
    ],
    extraSections: [
      {
        title: 'Quick example',
        paragraphs: [
          'For water, enter H2O. The calculator counts 2 hydrogen atoms and 1 oxygen atom. With the rounded values used by the tool, the estimate is (2 x 1.008) + 15.999 = about 18.015 g/mol.',
          'That result means one mole of water molecules has a mass of about 18.015 grams using these rounded classroom atomic weights. The composition line also shows that oxygen supplies most of the mass even though hydrogen has two atoms.',
        ],
      },
      {
        title: 'How parentheses change the count',
        paragraphs: [
          'A number after parentheses multiplies everything inside the group. Ca(OH)2 means 1 calcium, 2 oxygen, and 2 hydrogen atoms. The tool adds 40.078 + (2 x 15.999) + (2 x 1.008) = about 74.092 g/mol.',
          'This is why checking Atoms counted matters. If the count looks too small, the formula may be missing parentheses or a subscript.',
        ],
      },
      {
        title: 'How hydrates are handled',
        paragraphs: [
          'For hydrates, use a period before the water part. CuSO4.5H2O means the copper sulfate formula plus five water molecules. The leading 5 multiplies the H2O group before everything is added.',
          'Do not treat CuSO4 and CuSO4.5H2O as the same compound for weighing or solution work. The hydrate water adds mass, so the g/mol value changes.',
        ],
      },
      {
        title: 'Where to use the result next',
        paragraphs: [
          'Molar mass is often the bridge between grams and moles. If a lab problem gives grams of solute and final solution volume, calculate the molar mass here, then use that g/mol value in the Molarity Calculator.',
          'For unit conversions that are not chemistry-specific, use a conversion tool instead. Molecular weight is about formula units and moles, not density, force, or everyday weight.',
        ],
        links: [
          { href: '/tools/molarity-calculator/', label: 'Use molar mass in the Molarity Calculator' },
          { href: '/tools/conversion-calculator/', label: 'Convert regular units separately' },
        ],
      },
      {
        title: 'When the calculator is not enough',
        paragraphs: [
          'This is a rounded classroom molar-mass helper. It does not choose isotope abundances, calculate monoisotopic mass, understand charges, validate structural formulas, or replace lab instructions.',
          'For real lab work, check the exact compound name, hydration state, purity, safety data sheet, and reference values your instructor or procedure requires.',
        ],
      },
    ],
    sources: [sourceLinks.bipmSi, sourceLinks.nistAtomicWeights, sourceLinks.openStaxMolarity],
  },
  'sleep-calculator': {
    title: 'Sleep Calculator Guide',
    summary: 'Learn how to count sleep cycles from bedtime or wake-up time.',
    metaDescription:
      'Use the Sleep Calculator guide to count 90-minute cycles, add a fall-asleep buffer, compare bedtime options, and know when sleep quality matters more.',
    purpose:
      'The Sleep Calculator counts 90-minute sleep cycles forward or backward and includes a fall-asleep buffer. It helps plan a bedtime or wake-up time without pretending sleep is only math.',
    intro:
      'Use it when you need a simple bedtime or wake-up target and want the math shown clearly. It is best for normal planning, not for fixing insomnia, sleep apnea, shift-work fatigue, or ongoing tiredness.',
    inputMatch: 'wake-up or bedtime mode, the clock time, sleep cycles, and the minutes you usually need to fall asleep',
    logicNote:
      'One cycle is counted as 90 minutes. In wake-up mode, the calculator subtracts cycles plus the fall-asleep buffer from your wake-up time. In bedtime mode, it adds them to your bedtime.',
    readIntro:
      'Read the suggested time first, then check the sleep-time line and fall-asleep buffer. If the result gives you less sleep than your age usually needs, pick more cycles or change the schedule.',
    mistakeIntro:
      'Most bad results come from using too few cycles, forgetting the fall-asleep buffer, or treating cycle timing as more important than enough sleep and sleep quality.',
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
    extraSections: [
      {
        title: 'Quick example',
        paragraphs: [
          'If you need to wake at 7:00 and choose 5 cycles, the calculator counts 7 hours 30 minutes of sleep plus a 15-minute fall-asleep buffer. The suggested bedtime is 23:15, or 11:15 PM.',
        ],
      },
      {
        title: 'How many cycles should I try?',
        paragraphs: [
          'Five cycles is 7 hours 30 minutes of sleep. Six cycles is 9 hours. Four cycles is only 6 hours, so it can be useful for a rough backup night but should not become the normal plan for most adults.',
          'Age matters. CDC sleep guidance says adults generally need at least 7 hours, while teens and children usually need more.',
        ],
      },
      {
        title: 'When the calculator is not enough',
        paragraphs: [
          'A sleep-cycle time can help with planning, but it cannot tell whether your sleep is deep, interrupted, or healthy. If you regularly wake up tired, snore loudly, stop breathing during sleep, or struggle to sleep, use this as a note to discuss with a healthcare provider.',
        ],
      },
    ],
    sources: [sourceLinks.cdcSleep, sourceLinks.cdcStudentSleep, sourceLinks.mayoSleepTips, sourceLinks.nistUnits],
  },
  'tire-size-calculator': {
    title: 'Tire Size Calculator Guide',
    summary: 'Learn how tire width, aspect ratio, and wheel diameter create tire diameter, sidewall height, circumference, and revs per mile.',
    metaDescription:
      'Use the Tire Size Calculator guide with a 225/60R16 example. Learn sidewall height, diameter, circumference, revs per mile, and fitment cautions.',
    purpose:
      'The Tire Size Calculator explains a metric tire size such as 225/60R16. It estimates sidewall height, total diameter, circumference, and revolutions per mile so you can understand the size before you check real vehicle fitment.',
    intro:
      'Use it when a tire size looks like a code on the sidewall and you want the plain math behind it. The guide below shows what each number means, how the calculator gets the answer, and where the math stops being enough.',
    bestUsesIntro:
      'Use this guide when you are decoding a metric tire size, comparing two nearby sizes, or checking whether a proposed replacement deserves a deeper fitment check.',
    inputMatch:
      'the section width in millimeters, aspect ratio percent, and wheel diameter in inches from a metric tire size such as 225/60R16',
    logicNote:
      'Sidewall inches = width mm x aspect ratio / 100 / 25.4. Tire diameter = wheel diameter + (2 x sidewall). Circumference = pi x diameter. Revs per mile = 63,360 / circumference.',
    readIntro:
      'Read diameter first if you are comparing overall size. Use sidewall height to understand tire profile, circumference to understand rolling distance, and revs per mile to spot a size change that may affect speedometer reading or gearing feel.',
    mistakeIntro:
      'The biggest mistake is treating close diameter math as fitment approval. The calculator does not know your rim width, offset, fender clearance, suspension travel, brake clearance, load index, speed rating, or vehicle manufacturer rules.',
    sidecarText:
      'Open the Tire Size Calculator beside this guide. Try the 225/60R16 example first, then replace the width, aspect ratio, and wheel diameter with your own sidewall numbers.',
    referenceIntro:
      'These references support the metric sidewall fields, unit conversion context, and reader-first limits used in this guide.',
    enter: [
      'Enter the section width in millimeters. In 225/60R16, the width is 225.',
      'Enter the aspect ratio as a percent. In 225/60R16, the sidewall height is 60% of the width.',
      'Enter the wheel diameter in inches. In 225/60R16, the tire fits a 16 inch wheel.',
    ],
    read: [
      'Diameter is the estimated tire height from ground to top before real-world load and brand differences.',
      'Sidewall height is one sidewall only. The full diameter adds one sidewall above and one sidewall below the wheel.',
      'Circumference estimates rolling distance per tire turn. Revs per mile estimates how many turns happen over one mile.',
    ],
    mistakes: [
      'Do not assume a size fits because the math looks close.',
      'Do not ignore rim width, offset, brake clearance, suspension clearance, fender clearance, load index, speed rating, and manufacturer guidance.',
      'Do not use this page for flotation sizes such as 33x12.50R15. This guide is for metric sizes like 225/60R16.',
      'Changing tire diameter can affect speedometer readings, odometer readings, gearing feel, ABS, traction control, and driver-assist systems.',
      'Do not expect calculated diameter to match a measured tire exactly. Tire model, tread depth, pressure, load, and measuring method can move the real number.',
    ],
    extraSections: [
      {
        title: 'Quick 225/60R16 example',
        paragraphs: [
          'A 225/60R16 tire uses 225 mm for width, 60 for aspect ratio, and 16 inches for wheel diameter. The sidewall math is 225 x 60 / 100 / 25.4, which is about 5.31 inches.',
          'The diameter is 16 + 2 x 5.31, or about 26.63 inches. The circumference is about 83.67 inches, which works out to about 757 revs per mile.',
        ],
      },
      {
        title: 'Why revs per mile matter',
        paragraphs: [
          'Revs per mile is a rolling-size clue. A larger tire turns fewer times per mile, while a smaller tire turns more times per mile.',
          'That matters because a different rolling size can change how the speedometer reads and how the vehicle feels. It does not automatically mean the size is safe, legal, or approved for your car.',
        ],
      },
      {
        title: 'What to check after the calculator',
        paragraphs: [
          'After the math looks reasonable, check the tire placard, owner manual, rim width range, load index, speed rating, wheel offset, brake clearance, suspension clearance, and whether all four tires must match on your drivetrain.',
          'If the vehicle has all-wheel drive, advanced driver-assist systems, traction control, or tight factory clearance, a small-looking size change can still matter. A tire shop or manufacturer fitment guide is the next check.',
        ],
      },
      {
        title: 'Useful related checks',
        paragraphs: [
          'If you are comparing road speed, distance, or fuel use after a size change, use the related calculators as separate sanity checks. Keep the tire-size answer as one input, not the whole decision.',
        ],
        links: [
          { href: '/tools/tire-size-calculator/', label: 'Run the tire-size example in the calculator' },
          { href: '/tools/speed-calculator/', label: 'Check speed, distance, and time math' },
          { href: '/tools/mileage-calculator/', label: 'Estimate trip mileage or reimbursement' },
        ],
      },
    ],
    sources: [sourceLinks.nhtsaTireSize, sourceLinks.nistUnits, sourceLinks.googleHelpfulContent],
  },
  'roofing-calculator': {
    summary: 'Learn how footprint, pitch, and waste estimate roof squares and bundles.',
    metaDescription:
      'Use the Roofing Calculator with a 40 x 30 ft example. Learn roofing squares, pitch factor, shingle bundles, waste, and when to check a roofer.',
    purpose:
      'The Roofing Calculator estimates materials for a simple pitched roof. It turns a flat footprint into slope-adjusted roof area, adds waste, then estimates roofing squares and bundles.',
    intro:
      'Use it for a rough shopping or quote-check number, not as permission to climb a roof or skip a contractor measurement.',
    bestUsesIntro:
      'Use this guide when you have a simple roof footprint and want a first pass at roof squares, bundles, pitch, and waste before checking the real roof.',
    inputMatch: 'the flat roof footprint, the rise per 12 inches of run, and the waste percent you want to add',
    logicNote:
      'Pitch matters because shingles sit on the sloped roof surface, not the flat footprint. The calculator turns rise per 12 into a slope multiplier before it adds waste.',
    readIntro:
      'Read the square count first, then the bundle count. The bundle count uses a common 3-bundles-per-square assumption, so the product wrapper can still change the order.',
    mistakeIntro:
      'The big mistake is treating a clean rectangle as the whole roof. Hips, valleys, dormers, overhangs, skylights, ridge cap, starter strips, and low-slope rules can all change the real list.',
    sidecarText:
      'Open the Roofing Calculator beside this guide. Try the 40 x 30 ft example first, then replace it with your own footprint, pitch, and waste percent.',
    referenceIntro:
      'These references help with roofing squares, bundle coverage, low-slope cautions, and roof-work safety. Use them as checks, not as a replacement for local code or a roofer.',
    enter: [
      'Enter footprint length and width in feet. Use the flat footprint, not the house square footage.',
      'Enter pitch rise per 12 inches of run. A 6/12 roof rises 6 inches for every 12 inches across.',
      'Enter waste percent. Ten percent is a simple starting point, but complex roofs may need more.',
    ],
    read: [
      'Roof squares are 100-square-foot units. A result of 14.76 squares means about 1,476 square feet after pitch and waste.',
      'Bundles estimate assumes 3 shingle bundles per square. Check your shingle wrapper or product sheet before buying.',
      'Pitch factor shows how slope increased the footprint area.',
    ],
    mistakes: [
      'Do not use this as a contractor measurement.',
      'Do not ignore hips, valleys, dormers, overhangs, skylights, ridge cap, starter strips, underlayment, flashing, and product coverage.',
      'Do not assume shingles are right for every low-slope roof. Check manufacturer instructions and local code.',
      'Do not climb onto a roof just to measure. Use safe ground measurements, plans, a measurement report, or a pro.',
    ],
    extraSections: [
      {
        title: 'Quick 40 x 30 roof example',
        paragraphs: [
          'Say the footprint is 40 ft by 30 ft. That is 1,200 sq ft flat. With a 6/12 pitch, the roof surface is about 1,342 sq ft before waste.',
          'Add 10% waste and the estimate becomes about 1,476 sq ft, or 14.76 roofing squares. With the common 3-bundles-per-square assumption, the calculator rounds that to 45 bundles.',
        ],
      },
      {
        title: 'What this estimate leaves out',
        paragraphs: [
          'The calculator does not count every roof plane, valley, ridge, starter strip, vent, flashing detail, tear-off layer, underlayment roll, nail box, or permit rule. It is the first math pass, not the full material list.',
          'If your roof is steep, low-slope, cut up into many planes, or hard to access safely, the next step is a roofer, local code check, or manufacturer instructions.',
        ],
      },
    ],
    sources: [
      sourceLinks.gafMeasureRoofingSquare,
      sourceLinks.gafMinimumSlopeShingles,
      sourceLinks.ikoShingleBundles,
      sourceLinks.oshaFallProtectionConstruction,
    ],
  },
  'tile-calculator': {
    summary: 'Learn how square feet, tile size, and waste become a whole tile count.',
    purpose:
      'The Tile Calculator estimates whole tiles for a floor, wall, shower, or backsplash from project area, tile dimensions, and waste percent. It is useful before you convert the count into boxes or ask an installer for a final layout.',
    metaDescription:
      'Use the Tile Calculator with a 120 ft2, 12 x 12 in, 10% waste example that becomes 132 tiles before box coverage and layout checks.',
    inputMatch:
      'The calculator asks for project area in square feet, tile length in inches, tile width in inches, and waste percent. Those are the same numbers used in the guide examples.',
    logicNote:
      'Tile area = tile length inches x tile width inches / 144. Area with waste = project square feet x (1 + waste percent / 100). Tiles needed = adjusted area divided by tile area, rounded up.',
    readIntro:
      'Read the result as the tile count before box rounding. The supporting numbers show one-tile coverage, waste added, and the adjusted area used for the final division.',
    mistakeIntro:
      'Tile estimates go wrong when people measure the wrong surface, forget waste, or treat the calculator result as the exact store order.',
    sidecarText:
      'Tile count is the first buying number. The final order still depends on boxes, shade lots, grout joints, cut layout, and the tile pattern.',
    bestUsesIntro:
      'Use the Tile Calculator when you already have a rough measured area and want a quick count before comparing tile sizes, box coverage, and installer layout notes.',
    referenceIntro:
      'These references support the tile-count math, unit conversions, and reader-first limits used in this guide.',
    enter: [
      'Enter the floor, wall, backsplash, or shower surface area in square feet.',
      'Enter the tile face length and width in inches. A 12 x 24 tile uses 12 and 24.',
      'Enter waste percent for cuts, chipped pieces, layout changes, and a few future repair tiles.',
    ],
    read: [
      'Tiles needed is rounded up to a whole tile. Stores may still sell by the box.',
      'Each tile area shows the square-foot coverage of one tile before grout joints.',
      'Area with waste shows the adjusted project area before the tile count is rounded.',
      'For example, 120 square feet with 12 x 12 inch tile and 10% waste becomes 132 square feet of adjusted area, so the result is 132 tiles.',
    ],
    mistakes: [
      'Do not enter box coverage as the tile size. The size fields are for one tile face.',
      'Do not use room floor area for shower walls or backsplashes; measure the surface being tiled.',
      'Do not ignore diagonal layouts, herringbone, niches, benches, drains, or many edge cuts.',
      'Do not forget that tile is usually sold by full boxes, sometimes with shade-lot or return rules.',
      'Do not rely on this count for grout, thinset, waterproofing, trim, transitions, or labor.',
    ],
    extraSections: [
      {
        title: 'Quick 120 square foot example',
        paragraphs: [
          'Say the project area is 120 square feet and the tile is 12 by 12 inches. One tile covers 1 square foot because 12 x 12 / 144 = 1.',
          'With 10% waste, the adjusted area is 132 square feet. Divide 132 by 1 and round up, so the calculator returns 132 tiles before you convert the count into boxes.',
        ],
      },
      {
        title: 'Floor, wall, and shower areas',
        paragraphs: [
          'For a floor, length times width is usually the starting area. For a wall, backsplash, or shower, measure each rectangle separately, then add the areas together.',
          'Shower tile often needs extra care because niches, benches, valves, drains, waterproofing edges, and small cut pieces can raise waste. Run separate estimates when the floor tile and wall tile are different sizes.',
        ],
      },
      {
        title: 'What waste percent means for tile',
        paragraphs: [
          'Waste percent is extra tile added before the calculator rounds up. It covers cuts at walls, broken pieces, layout changes, chipped corners, and a few spare tiles for future repair.',
          'A simple straight layout may be close with about 10% waste. Diagonal layouts, herringbone, small rooms with lots of cuts, or expensive patterned tile often need a higher allowance.',
        ],
      },
      {
        title: 'Boxes, grout, and layout checks',
        paragraphs: [
          'After you get a tile count, check the product box. Some boxes list tiles per carton, some list square feet per carton, and some stores only sell full boxes.',
          'Grout spacing is a layout check, not a hidden input here. Wider joints, starting lines, cut rows, trim pieces, and pattern direction can change the final order even when the rough count is right.',
        ],
      },
      {
        title: 'Metric measurements',
        paragraphs: [
          'This calculator expects square feet and inches. If your measurements are metric, convert square meters to square feet and centimeters to inches before entering them.',
          'Keep every input in the same unit system. Mixing square meters with inch tile sizes without converting first is one of the easiest ways to get a bad tile count.',
        ],
      },
    ],
    sources: [
      sourceLinks.lowesTile,
      sourceLinks.calculatorNetTile,
      sourceLinks.omniTile,
      sourceLinks.nistUnits,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'mulch-calculator': {
    summary: 'Learn how bed area, depth, and bag size become mulch yards and bags.',
    purpose:
      'The Mulch Calculator estimates bulk cubic yards, cubic feet, and bag count from bed area, mulch depth, bag size, and waste percent. It is useful before comparing bagged mulch with a bulk-yard delivery quote.',
    enter: [
      'Enter bed area in square feet.',
      'Enter desired mulch depth in inches.',
      'Add waste percent for settling, uneven spreading, and odd-shaped beds.',
    ],
    read: [
      'Cubic yards is the bulk-order number.',
      'Cubic feet is useful for bag comparison.',
      'Bag count rounds up so you do not plan half a bag.',
      'For example, 200 square feet at 3 inches deep with 5% waste is about 1.94 cubic yards or 27 two-cubic-foot bags.',
    ],
    mistakes: [
      'Do not pile mulch too deep around plant stems or tree trunks.',
      'Do not treat every retail bag as 2 cubic feet; some bags are 1.5 or 3 cubic feet.',
      'Do not measure uneven beds as perfect rectangles unless the square-foot estimate is still close.',
      'Check whether old mulch should be counted, raked, or removed before adding a full new layer.',
    ],
    extraSections: [
      {
        title: 'Quick 200 square foot example',
        paragraphs: [
          'A 200 square foot bed at 3 inches deep needs 50 cubic feet before waste. Add 5% waste and the order estimate becomes 52.5 cubic feet.',
          'That is about 1.94 cubic yards. If the store bags are 2 cubic feet each, round up to 27 bags.',
        ],
      },
      {
        title: 'Depth check before buying',
        paragraphs: [
          'Depth is the input that changes the answer fastest. One cubic yard covers about 324 square feet at 1 inch, 162 square feet at 2 inches, 108 square feet at 3 inches, or 81 square feet at 4 inches.',
          'For plant beds, use the depth recommended for the mulch type and keep mulch away from stems and trunks. More mulch is not automatically better.',
        ],
      },
    ],
    sources: [
      sourceLinks.homeDepotMulchCalculator,
      sourceLinks.inchCalculatorMulch,
      sourceLinks.nrcsTexasMulching,
      sourceLinks.nistUnits,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'gravel-calculator': {
    summary: 'Learn how dimensions, depth, and density estimate gravel cubic yards and tons.',
    purpose:
      'The Gravel Calculator estimates volume and tonnage for one rectangular gravel layer. It is most useful when you can enter the supplier tons-per-cubic-yard value and then check compaction, delivery, and layer needs before ordering.',
    enter: [
      'Enter length and width in feet. Measure the area that will actually be covered, not the whole yard or driveway around it.',
      'Enter depth in inches. Use finished depth for a top-up, path, bed, pad, or base layer, and estimate separate layers separately.',
      'Enter tons per cubic yard from your supplier when available. If the quote is by the ton, this input is what connects the cubic-yard math to the weight order.',
    ],
    read: [
      'Cubic yards is the bulk volume estimate. A 20 ft by 10 ft area at 4 inches deep comes out to about 2.47 cubic yards before any extra compaction or delivery allowance.',
      'Estimated tons multiplies cubic yards by density. At 1.4 tons per cubic yard, that same 20 ft by 10 ft top-up is about 3.46 tons.',
      'Density used reminds you which conversion factor was applied.',
      'The answer is a planning number, not a supplier guarantee. A quarry may round to full tons, half yards, full yards, or truck minimums.',
    ],
    mistakes: [
      'Do not assume tons and cubic yards are the same. Cubic yards measure volume; tons measure weight.',
      'Do not ignore compaction, moisture, stone shape, and loose-versus-compacted volume.',
      'Do not use one layer for a whole driveway if the project needs base, middle, and surface gravel with different depths.',
      'Ask the supplier about density, delivery minimums, truck access, dump location, and recommended overage before buying.',
    ],
    sources: [
      sourceLinks.tallyardGravelCalculator,
      sourceLinks.inchCalculatorGravelDriveway,
      sourceLinks.calcipediaGravelDriveway,
      sourceLinks.nistUnits,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'paint-calculator': {
    title: 'Paint Calculator Guide',
    summary: 'Learn how room size, openings, coats, and coverage estimate paint gallons.',
    metaDescription:
      'Use the Paint Calculator guide to estimate wall paint gallons from room size, doors, windows, coats, coverage, and extra percent.',
    purpose:
      'The Paint Calculator estimates interior wall paint for a simple rectangular room. It starts with wall area, subtracts standard door and window openings, then applies coats, paint-label coverage, and extra percent before rounding up whole gallons.',
    intro:
      'Use it before you buy wall paint for a bedroom, office, hallway, or living room. It is strongest when you know the paint label coverage and you are estimating walls only, not ceilings, trim, cabinets, or primer as a separate product.',
    inputMatch: 'room length, room width, wall height, doors, windows, coats, coverage in sq ft per gallon, and extra percent',
    logicNote:
      'The calculator uses 2 x (length + width) x wall height for wall area, subtracts 20 sq ft per door and 15 sq ft per window, multiplies by coats and extra percent, then divides by paint-label coverage.',
    readIntro:
      'Read the whole gallons to buy first, then check paintable wall area and gallons before rounding. The before-rounding number explains whether the result is barely over a gallon or safely into the next can.',
    mistakeIntro:
      'Most bad paint estimates come from using floor square footage as wall area, forgetting a second coat, trusting a high coverage number on rough walls, or mixing ceilings and trim into the wall estimate.',
    enter: [
      'Enter the room length, width, and wall height in feet. Do not enter floor area unless you have already converted it into wall area another way.',
      'Enter the number of doors and windows. The calculator subtracts 20 sq ft per door and 15 sq ft per window from the wall estimate.',
      'Enter the number of coats and the paint coverage from the can or product page. Use the lower end of a coverage range for rough, patched, porous, or dark-to-light changes.',
      'Use extra percent when the surface is textured, patched, absorbent, or you want a safer buying estimate for roller and tray loss.',
    ],
    read: [
      'Gallons to buy rounds the calculated need up to whole gallons because most wall paint is sold by whole containers.',
      'Gallons before rounding shows the math result before the shopping-friendly round-up. A result of 1.898 means the default example rounds to 2 gallons.',
      'Paintable wall area shows the wall estimate after subtracting doors and windows but before coats, extra percent, and coverage are applied.',
      'Coverage used reminds you which square-feet-per-gallon assumption drove the result.',
    ],
    mistakes: [
      'Do not use floor square footage as wall square footage.',
      'Do not forget that two coats roughly doubles the paintable area.',
      'Do not treat ceilings, trim, doors, cabinets, or primer as automatically included in this wall estimate.',
      'Check the actual product label because coverage varies by paint, surface, color, sheen, and primer.',
      'Do not use the highest advertised coverage number on rough texture, patched drywall, bare surfaces, or strong color changes unless you are comfortable buying more later.',
    ],
    extraSections: [
      {
        title: 'Quick 12 x 10 room example',
        paragraphs: [
          'Say the room is 12 ft long, 10 ft wide, and 8 ft high. The wall area is 2 x (12 + 10) x 8, or 352 square feet before openings.',
          'With 1 door and 2 windows, the calculator subtracts 50 square feet, leaving 302 paintable square feet. Two coats and 10% extra make 664.4 adjusted square feet. At 350 sq ft per gallon, that is 1.898 gallons before rounding, so the buying estimate is 2 gallons.',
        ],
      },
      {
        title: 'Coverage and coats',
        paragraphs: [
          'Coverage per gallon is not a universal constant. A smooth primed wall may get closer to the high end of the label range, while rough texture, fresh drywall, patches, or a dark color change can use more paint.',
          'Coats multiply the wall area before coverage is applied. If you enter 2 coats, the calculator is assuming each paintable wall area gets painted twice, then it adds your extra percent.',
        ],
      },
      {
        title: 'Doors, windows, and what is left out',
        paragraphs: [
          'This calculator subtracts standard openings instead of asking for every door and window measurement. That keeps the estimate fast, but unusual openings, built-ins, half walls, closets, and wainscoting can move the real number.',
          'Ceilings, trim, doors, cabinets, and primer are separate estimates. They often use different paint, finish, coverage, or prep assumptions, so putting everything into one wall number can make the answer look more exact than it is.',
        ],
      },
      {
        title: 'When paint math is not wallpaper math',
        paragraphs: [
          'Paint and wallpaper both start with wall area, but they stop being the same calculation after that. Paint uses gallons, coats, and coverage per gallon. Wallpaper uses roll coverage, pattern matching, trimming, and a waste percent before the roll count is rounded up.',
          'If you are covering the wall with paper, vinyl wallcovering, or peel-and-stick wallpaper, switch to the Wallpaper Calculator so the estimate can handle roll coverage and waste instead of pretending gallons and rolls work the same way.',
        ],
        links: [{ href: '/tools/wallpaper-calculator/', label: 'Estimate wallpaper rolls with waste percent' }],
      },
    ],
    sources: [
      sourceLinks.sherwinPaintCoverage,
      sourceLinks.inchCalculatorPaint,
      sourceLinks.omniPaint,
      sourceLinks.nistUnits,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'drywall-calculator': {
    summary: 'Learn how project area, sheet size, and waste become a whole drywall sheet count.',
    purpose:
      'The Drywall Calculator estimates whole sheets from wall or ceiling square footage. It works best after you already have a measured area or a rough takeoff from room dimensions, then want a quick panel count before checking tape, mud, screws, and code details.',
    enter: [
      'Enter the wall or ceiling area in square feet. Add each wall length times height, and add ceiling length times width if you are hanging board overhead.',
      'Enter the drywall sheet length and width in feet. Common sheet sizes are 4 by 8, 4 by 10, and 4 by 12 feet, but use the size you can deliver and lift safely.',
      'Add waste for cuts, broken corners, layout changes, and small offcuts.',
    ],
    read: [
      'The main answer is whole drywall sheets needed.',
      'Sheet area shows how many square feet one panel covers.',
      'Area with waste shows the adjusted project area before rounding up sheets. A 480 square foot project with 10% waste becomes 528 square feet.',
      'The default 480 square foot example with 4 by 8 sheets and 10% waste comes out to 17 sheets.',
    ],
    mistakes: [
      'Do not double-subtract doors or windows if your takeoff already removed them.',
      'Do not assume every room lays out cleanly with no offcuts. Closets, ceilings, stairs, short returns, and broken corners can use extra sheets.',
      'Check thickness, moisture resistance, fire requirements, screw schedule, tape, joint compound, corner bead, delivery, and local rules before buying.',
    ],
    sources: [
      sourceLinks.certainteedDrywallCalculator,
      sourceLinks.usgMaterialEstimators,
      sourceLinks.inchCalculatorDrywall,
      sourceLinks.procoreDrywallCalculator,
      sourceLinks.nistUnits,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'carpet-calculator': {
    summary: 'Learn how room size, roll width, and waste become carpet square yards and rough roll length.',
    purpose:
      'The Carpet Calculator estimates carpet material for one simple room. It reports adjusted square feet, square yards, and approximate linear feet from the roll width you enter.',
    enter: [
      'Enter the main room length and width in feet. Measure closets, hallways, landings, and stairs separately if they need carpet too.',
      'Enter the roll width from the carpet product. Many rooms are planned around a 12 foot roll, but some products are wider.',
      'Add waste for trimming, seams, closets, pile direction, pattern matching, and installer layout.',
    ],
    read: [
      'Square yards is the common carpet area unit. The calculator divides adjusted square feet by 9.',
      'Adjusted area includes the waste percentage.',
      'Linear feet estimates how much length would be needed at the roll width entered. It is a planning number, not a cutting diagram.',
      'A 15 ft by 12 ft room with a 12 ft roll and 10% waste is 198 adjusted square feet, 22 square yards, and about 16.5 linear feet.',
    ],
    mistakes: [
      'Do not rely on this for final carpet ordering when seams, pile direction, or pattern matching matter.',
      'Do not forget closets, doorways, stairs, landings, transitions, tack strips, padding, or removal costs.',
      'Ask the installer how they will lay out the roll before buying, especially when the room is wider than the roll.',
    ],
    sources: [sourceLinks.criResidentialCarpetInstallation, sourceLinks.nistConversionFactors, sourceLinks.nistUnits],
  },
  'flooring-calculator': {
    summary: 'Learn how square feet, waste percent, box coverage, and box price become a flooring order.',
    purpose:
      'The Flooring Calculator estimates how many flooring boxes to buy before a store trip. It works best for laminate, vinyl plank, LVP, engineered wood, and other products where the carton tells you square feet per box.',
    enter: [
      'Enter the measured floor area in square feet. Include closets, hallways, and connected areas if they will use the same flooring.',
      'Enter the waste percent you want for cuts, damaged planks, layout direction, and future repairs.',
      'Enter the square feet covered by one box or carton from the product label.',
      'Add price per box only when you want a rough product cost before tax, delivery, underlayment, trim, tools, or labor.',
    ],
    read: [
      'Boxes needed is rounded up because flooring is normally bought by whole boxes.',
      'Area with waste shows the measured square footage after your overage allowance.',
      'Coverage ordered shows how much square footage the rounded-up boxes cover, so you can see the spare amount.',
      'Estimated cost is only the box count multiplied by price per box.',
    ],
    mistakes: [
      'Do not type the size of one plank when the input asks for square feet per box.',
      'Do not leave out closets, hallways, stair landings, or connected areas that need the same material.',
      'Do not use a tiny waste percent for diagonal, herringbone, damaged-board, or DIY-heavy layouts.',
      'Buy the main order together when possible so shade, finish, and dye lot differences are less likely.',
    ],
    extraSections: [
      {
        title: 'Example: 240 square foot living room',
        paragraphs: [
          'Say the room is 240 square feet, the waste percent is 10%, each box covers 24 square feet, and each box costs $48. The calculator first plans for 264 square feet because 240 x 1.10 = 264.',
          'Then it divides 264 by 24. That equals exactly 11 boxes. At $48 per box, the rough material cost is $528 before tax, delivery, underlayment, trim, tools, or labor.',
        ],
        links: [{ href: '/tools/flooring-calculator/', label: 'Run the flooring box example' }],
      },
      {
        title: 'What waste percent really does',
        paragraphs: [
          'Waste percent is not a trick to make the project look bigger. It is the extra material for cuts, bad boards, pattern direction, stair pieces, mistakes, and repair pieces.',
          'A simple straight layout may only need a small buffer. Diagonal or patterned layouts usually need more because more boards get cut at angles. Product instructions and installer advice should beat any default number.',
        ],
        links: [{ href: '/tools/area-calculator/', label: 'Check the floor area first' }],
      },
      {
        title: 'What the calculator leaves out',
        paragraphs: [
          'The result is a material estimate, not a full installation quote. It does not include subfloor repair, moisture testing, underlayment, stair noses, transition strips, adhesive, tax, delivery, returns, or installer labor.',
          'If the product page says to buy extra cartons for future repairs, keep that in mind before returning every spare box. A later carton may not match the same shade or finish batch.',
        ],
        links: [{ href: '/tools/carpet-calculator/', label: 'Use the carpet calculator for roll-width flooring' }],
      },
      {
        title: 'Why flooring waste and wallpaper waste feel similar',
        paragraphs: [
          'Flooring and wallpaper both ask for waste because real rooms do not use every piece perfectly. Flooring waste covers cuts, damaged boards, layout direction, and future repairs. Wallpaper waste covers trimming, pattern matching, corners, damaged strips, and dye lot safety.',
          'The idea is similar, but the percentage is not automatically the same. A plain floor layout and a bold wallpaper pattern can need very different buffers, so use the material-specific calculator before buying.',
        ],
        links: [{ href: '/tools/wallpaper-calculator/', label: 'Plan wallpaper waste percent separately' }],
      },
    ],
    sources: [
      sourceLinks.lowesFlooringFootage,
      sourceLinks.lowesFlooringPlanner,
      sourceLinks.homeDepotFlooringInstall,
      sourceLinks.nistUnits,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'wallpaper-calculator': {
    summary: 'Learn how wall area, openings, roll coverage, pattern repeat, waste percent, and optional roll price turn into rolls and rough cost.',
    purpose:
      'The Wallpaper Calculator estimates whole rolls for room walls before you buy. It starts with room perimeter and wall height, subtracts standard doors and windows, adds a waste percent, then divides by roll coverage. If you enter a price per roll, it also shows a rough material cost. The important part is that wallpaper is bought in strips and rolls, not perfect square-foot blocks, so the calculator keeps waste, rounding, and cost assumptions visible.',
    enter: [
      'Enter room length and width in feet. If your tape measure is in inches, divide by 12 before typing the number.',
      'Enter wall height, plus the number of standard doors and windows.',
      'Enter roll coverage from the wallpaper product page or label, then choose a waste percent that fits the pattern, repeat, and room difficulty.',
      'Add price per roll only if you want the calculator to show a rough material cost before tax, shipping, paste, tools, or labor.',
    ],
    read: [
      'Rolls needed is rounded up because wallpaper is bought in whole rolls.',
      'Wallpaper area is the wall estimate after subtracting openings.',
      'Area with waste shows the roll-coverage demand before rounding.',
      'Estimated cost multiplies rolls needed by price per roll when you enter a price.',
    ],
    mistakes: [
      'Do not type inches into the feet fields. Convert first, or the roll count will be far too high.',
      'Do not treat waste percent like a fee. It is extra material for cuts, pattern matching, trimming, and mistakes.',
      'Do not ignore pattern repeat or usable yield. A roll may print 56 square feet, but the usable wall coverage can be lower when the pattern has to line up.',
      'Do not treat the cost result as a full project quote. It is roll price only, not supplies, delivery, returns, or labor.',
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
        title: 'How the rough cost works',
        paragraphs: [
          'Price per roll is optional. If you leave it blank, the calculator focuses on rolls. If you enter a price, it multiplies the whole rolls needed by that price. Six rolls at $42 per roll becomes about $252 before anything else is added.',
          'That cost is useful for quick shopping checks, but it is not the same as a project quote. It does not include sales tax, shipping, paste, primer, smoothing tools, returns, installer labor, or extra rolls you may choose to keep for repairs.',
        ],
        links: [{ href: '/tools/wallpaper-calculator/', label: 'Open the Wallpaper Calculator with price per roll' }],
      },
      {
        title: 'If you only have roll width and roll length',
        paragraphs: [
          'Sometimes a product page gives width and length but does not clearly state coverage. In that case, multiply the width by the length to get a rough square-foot number, then be more careful with waste percent because pattern repeat, damaged strips, and trimming can reduce usable coverage.',
          'If the seller gives a usable coverage number anywhere on the label, use that number first. It is usually closer to how the roll is actually sold and installed than raw roll dimensions.',
        ],
      },
      {
        title: 'If your measurements are in inches',
        paragraphs: [
          'The room fields use feet because that keeps room-size math readable. Convert inches by dividing by 12. A wall that is 144 inches long is 12 feet. A wall that is 108 inches long is 9 feet.',
          'Roll width and roll length sometimes appear in inches too. Convert both to feet before multiplying them for rough coverage, or skip that step and use the coverage number from the wallpaper label when it is listed.',
        ],
      },
      {
        title: 'How to measure for wallpaper first',
        paragraphs: [
          'Measure the room before you start guessing rolls. For a simple rectangle, the calculator uses room length, room width, and wall height to estimate the wall area. If the room is odd-shaped, measure each wall section and keep the numbers handy so you can split the job into smaller estimates.',
          'Count large openings too. A standard door and a couple of windows can remove about 50 square feet from the estimate. If you are only covering one accent wall, measure that wall as its own job instead of entering the whole room.',
        ],
        links: [
          { href: '/tools/wallpaper-calculator/', label: 'Use the Wallpaper Calculator after measuring' },
          { href: '/tools/square-footage-calculator/', label: 'Check a single wall with the Square Footage Calculator' },
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
          'If each roll covers 56 square feet, 332 divided by 56 is about 5.93. Since you cannot buy 0.93 of a roll for a normal order, the calculator rounds up to 6 rolls. If the roll price is $42, the rough material cost is 6 x $42, or $252. That last part matters: rounding is why a tiny input change can sometimes push the answer up by a whole roll.',
        ],
      },
      {
        title: 'Example: how much wallpaper for a 12x12 room',
        paragraphs: [
          'For a 12 x 12 room with 8-foot walls, the starting wall area is about 384 square feet. One standard door and two standard windows bring that down to about 334 square feet before waste.',
          'With 10% waste, the calculator plans for about 367 square feet. If each roll covers 56 square feet, 367 divided by 56 is about 6.55, so the answer rounds up to 7 rolls. At $42 per roll, the rough roll cost would be 7 x $42, or $294 before supplies, tax, delivery, or labor.',
        ],
        links: [{ href: '/tools/wallpaper-calculator/', label: 'Try the 12x12 room in the Wallpaper Calculator' }],
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
      sourceLinks.yorkWallpaperRoomChart,
      sourceLinks.lowesWallpaperInstall,
      sourceLinks.grahamBrownWallpaperAmount,
      sourceLinks.grahamBrownWallpaperBatch,
      sourceLinks.nistUnits,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'fence-calculator': {
    summary: 'Learn how perimeter, panel width, post spacing, and gates estimate fence panels and posts.',
    purpose:
      'The Fence Calculator gives a rough material count for simple panel fencing. It subtracts gate openings, estimates panels, and counts line and gate posts before you check pickets, rails, concrete, hardware, and local rules.',
    enter: [
      'Enter the full fence perimeter or run length in feet. Walk the fence line first so gates, corners, setbacks, and obstacles are not guesses.',
      'Enter panel width and post spacing in feet. Use the panel, rail, or manufacturer spacing instead of stretching the span to save one post.',
      'Enter gate count and gate width so the calculator can remove gate openings and add two gate posts per gate.',
    ],
    read: [
      'Panels needed rounds up the remaining fence run divided by panel width.',
      'Fence run after gates shows how much perimeter is still filled with panels.',
      'Total posts includes line posts plus two posts per gate. The default 120 ft example with one 4 ft gate leaves 116 ft of panel run, which rounds to 15 panels and 18 total posts.',
    ],
    mistakes: [
      'Do not treat line posts as a full post schedule. Corners, ends, brace posts, terminal posts, and gate loads may need extra or stronger posts.',
      'Do not ignore slope, soil, setbacks, underground utilities, wind exposure, frost depth, and permits.',
      'Pickets, rails, concrete, gravel, fasteners, post caps, gate hardware, latch clearance, and custom panel cuts need separate planning.',
    ],
    sources: [
      sourceLinks.lowesFenceCalculator,
      sourceLinks.lowesFenceLayout,
      sourceLinks.tallyardFenceCalculator,
      sourceLinks.proBuilderFenceCalculator,
      sourceLinks.nistUnits,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'deck-cost-calculator': {
    summary: 'Learn how deck size, waste, surface price, railing, and stairs build a rough budget.',
    purpose:
      'The Deck Cost Calculator is a rough planning tool. It prices the deck surface from your own cost per square foot, then adds railing and stairs so you can compare early scope ideas before asking for quotes.',
    enter: [
      'Enter deck length and width in feet.',
      'Enter decking waste percent and a cost per square foot for the deck surface. Use material-only pricing unless you intentionally have an installed-price number.',
      'Add railing linear feet, railing cost per foot, and a stair allowance if needed.',
    ],
    read: [
      'The main answer is the rough total cost from the entered allowances.',
      'Decking area with waste shows how much surface the decking cost used. A 16 ft by 12 ft deck is 192 square feet, or 211.2 square feet after 10% waste.',
      'Decking and railing cost separate two visible assumptions so you can change one without hiding the other.',
      'The default 16 ft by 12 ft example with $12/ft2 decking, 40 ft of $35/ft railing, and a $750 stair allowance comes out to $4,684.40.',
    ],
    mistakes: [
      'Do not treat this as a contractor quote.',
      'Do not forget framing, footings, posts, beams, joists, ledgers, fasteners, permits, demolition, labor, taxes, delivery, railing rules, and stairs.',
      'Do not compare wood and composite prices unless the cost-per-square-foot number means the same thing in both runs.',
      'Use local prices and professional measurements before making purchase decisions.',
    ],
    sources: [
      sourceLinks.decksComDeckCost,
      sourceLinks.trexDeckCostCalculator,
      sourceLinks.homeAdvisorDeckCost,
      sourceLinks.nistUnits,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'deck-board-calculator': {
    title: 'Deck Board Calculator Guide',
    summary: 'Learn how deck size, board coverage, waste, and joist spacing estimate board and fastener needs.',
    metaDescription:
      'Use the Deck Board Calculator guide to estimate boards, fastener rows, deck screws, and board-only cost from deck size, board width, joist spacing, and waste.',
    purpose:
      'The Deck Board Calculator helps you plan the visible decking surface for a simple rectangular deck. It turns deck dimensions, purchased board length, actual board width, waste percent, and joist spacing into whole boards, fastener rows, screw count, and optional board-only cost.',
    intro:
      'Use it before you price decking boards or compare 12 ft, 16 ft, and 20 ft stock lengths. It is strongest for straight board layouts. Picture frames, breaker boards, stairs, fascia, diagonal patterns, and hidden fastener systems still need separate planning.',
    inputMatch: 'deck length, deck width, board length, actual board width, joist spacing, waste percent, and optional price per board',
    logicNote:
      'The calculator uses deck area = length x width, adjusted area = deck area x (1 + waste percent / 100), board coverage = board length x actual board width / 12, boards needed = ceiling(adjusted area / board coverage), fastener rows = floor(deck length x 12 / joist spacing) + 1, and screws = boards needed x fastener rows x 2.',
    readIntro:
      'Read boards needed first because that is the main buying count. Then check fastener rows and screw estimate so you know whether the joist spacing assumption is close to your deck plan.',
    mistakeIntro:
      'Most bad deck-board estimates come from using nominal board width, forgetting waste, treating a picture-frame deck like a plain rectangle, or assuming the screw count also covers clips, borders, stairs, and blocking.',
    enter: [
      'Enter the deck length and width in feet for the rectangular surface you want to cover.',
      'Enter the purchased board length in feet. Use the stock length you are actually comparing, such as 12 ft, 16 ft, or 20 ft boards.',
      'Enter the actual board face width in inches. A nominal 5/4 x 6 board is often about 5.5 inches wide, but check the product label or measure the board.',
      'Enter joist spacing in inches. This drives the fastener-row and screw estimate, not the board count.',
      'Enter a waste percent for cuts, damaged boards, starter pieces, and layout changes. Add optional price per board only if you want a board-only cost line.',
    ],
    read: [
      'Boards needed is the rounded-up count after waste is added to the deck area.',
      'Adjusted deck area shows the surface area after waste. This is useful when you want to see how much cushion the waste percent added.',
      'Fastener rows comes from deck length and joist spacing. Tighter joist spacing usually means more rows and more screws.',
      'Deck screws estimate uses two screws for each board-and-joist crossing. Hidden fasteners and clips may not match this screw count.',
      'Estimated board cost is boards needed times price per board. It is not a full deck quote.',
    ],
    mistakes: [
      'Do not use nominal board width if the actual face width is different.',
      'Do not treat board gaps, picture-frame borders, breaker boards, stair boards, fascia, or diagonal layouts as automatically included.',
      'Do not set waste to zero unless the layout is unusually simple and you are comfortable handling cut mistakes separately.',
      'Do not treat the screw estimate as a hidden-fastener clip schedule. Follow the fastener manufacturer and deck-board instructions.',
      'Do not use the board-only cost as a contractor quote. Framing, railing, stairs, hardware, delivery, labor, permits, and code changes are separate.',
    ],
    extraSections: [
      {
        title: 'Quick 16 x 12 deck example',
        paragraphs: [
          'Say the deck is 16 ft by 12 ft. The surface area is 192 square feet. With 10% waste, the calculator plans for 211.2 square feet of decking.',
          'A 16 ft board with 5.5 inches of actual face width covers about 7.333 square feet. 211.2 divided by 7.333 rounds up to 29 boards. With 16 inch joist spacing, the example shows 13 fastener rows and 754 deck screws. At $18 per board, the board-only cost is $522.',
        ],
      },
      {
        title: 'Actual board width and board gaps',
        paragraphs: [
          'Actual board width is the exposed face width you enter into the calculator. Nominal names are not always exact sizes, so a small width mismatch can change the count on a larger deck.',
          'The calculator does not ask for a separate gap field. Board gaps still matter for installation, drainage, expansion, and edge planning, so check the deck-board or fastener instructions before buying.',
        ],
      },
      {
        title: 'Joist spacing, rows, and screws',
        paragraphs: [
          'Joist spacing tells the calculator how many fastening rows run across the deck length. If the joists are 16 inches on center, a 16 ft length gives 13 rows because the calculator counts the starting row and the ending row.',
          'The screw estimate is simple on purpose: two screws at each board-and-joist crossing. Hidden fasteners, clips, plugs, borders, blocking, and stairs can need a different count.',
        ],
      },
      {
        title: 'Diagonal boards and picture frames',
        paragraphs: [
          'A diagonal deck can look great, but it usually creates more angled cuts and more waste than a straight layout. Use a higher waste percent or a detailed material takeoff if the board direction is not simple.',
          'Picture-frame borders, breaker boards, fascia, and stair treads should be counted as their own pieces. This tool estimates the main rectangular field, then leaves those design details for your plan or installer.',
        ],
      },
      {
        title: 'From board count to a fuller deck budget',
        paragraphs: [
          'Deck boards are only one part of a deck project. Joists, beams, posts, railings, stairs, hardware, concrete, delivery, tools, permits, and labor can move the real budget much more than one extra board.',
          'After you have a board count, use the Deck Cost Calculator if you want a rough project budget with decking surface cost, railing, stairs, and waste in one place.',
        ],
        links: [{ href: '/tools/deck-cost-calculator/', label: 'Estimate a rough deck project cost' }],
      },
    ],
    sources: [
      sourceLinks.inchDeckFlooring,
      sourceLinks.decksComDeckingCalculator,
      sourceLinks.omniDecking,
      sourceLinks.nistUnits,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'deck-stain-calculator': {
    title: 'Deck Stain Calculator Guide',
    summary: 'Learn how deck surface, rails, stairs, coats, coverage, and waste become gallons of stain.',
    metaDescription:
      'Use the Deck Stain Calculator guide to estimate stain gallons from deck size, rails, stairs, coats, label coverage, waste, and price per gallon.',
    purpose:
      'The Deck Stain Calculator estimates how many gallons to buy by adding the deck surface, railing faces, and stair tread/riser area, then applying waste, coat count, product-label coverage, and whole-gallon rounding.',
    intro:
      'Use it before you walk into the paint aisle with only a deck size in your head. The number on the stain label still matters most, because rough boards, old finish, rail details, sprayers, and weather can change real coverage.',
    inputMatch: 'deck length, deck width, railing length, railing height, step count, step width, tread depth, riser height, coats, coverage per gallon, waste percent, and optional price per gallon',
    logicNote:
      'The calculator uses deck surface = deck length x deck width, railing area = railing length x railing height x 2, step area = step count x step width x ((step depth + riser height) / 12), surface with waste = total surface x (1 + waste percent / 100), coat-adjusted area = surface with waste x coats, exact gallons = coat-adjusted area / coverage per gallon, and gallons to buy = ceiling(exact gallons).',
    readIntro:
      'Read gallons to buy first because that is the purchase number. Then check surface with waste, coat-adjusted area, and exact gallons so you can see which assumption is pushing the result up.',
    mistakeIntro:
      'Most deck-stain estimates go wrong when someone counts only the floor boards, ignores the product label, forgets rails and stairs, or stains before the deck is clean, dry, and inside the weather window.',
    enter: [
      'Enter deck length and width in feet for the flat walking surface.',
      'Enter railing length and average railing height if you plan to stain rails. The calculator counts both sides because railings usually have an inside and outside face.',
      'Enter stair details if the stairs are part of the same stain job. Step area counts each tread and riser together.',
      'Enter the coat count and coverage per gallon from the stain label. If the label gives different first-coat and second-coat numbers, use the value that fits your wood condition and product directions.',
      'Enter a waste percent for rough boards, rail edges, drips, overlap, sprayer loss, and touch-ups. Add price per gallon only if you want a stain-only cost estimate.',
    ],
    read: [
      'Gallons to buy rounds the exact gallon need up to a whole gallon.',
      'Surface with waste shows the deck, rail, and stair area after the waste cushion is added but before coat count.',
      'Coat-adjusted area shows how much coverage all coats require together. A two-coat job doubles this line.',
      'Exact gallons shows the raw division before whole-gallon rounding. If it says 5.016, the buying answer rounds to 6 gallons.',
      'Estimated stain cost is gallons to buy times price per gallon. It does not include cleaner, stripper, brushes, tape, tarps, sprayer supplies, or labor.',
    ],
    mistakes: [
      'Do not guess coverage when the product label gives a number.',
      'Do not forget railings, stair risers, lattice, benches, skirt boards, or extra trim if those surfaces need stain too.',
      'Do not forget old, dry, rough, or weathered wood can soak up more stain than smooth boards.',
      'Do not assume more coats are always better. Some stains need one coat, some need two thin coats, and some can fail when over-applied.',
      'Do not stain without checking weather, cleaning, drying, moisture, and prep instructions for the exact product.',
    ],
    extraSections: [
      {
        title: 'Quick 16 x 12 deck stain example',
        paragraphs: [
          'Say the deck is 16 ft by 12 ft. The flat deck surface is 192 square feet. Add 40 ft of railing at 3 ft high, counted on both sides, and the railing adds 240 square feet. Four 4 ft wide steps with 11 inch treads and 7 inch risers add 24 square feet.',
          'That makes 456 square feet before waste. With 10% waste, the calculator uses 501.6 square feet. Two coats make the coat-adjusted area 1,003.2 square feet. At 200 square feet per gallon, the exact need is 5.016 gallons, so the buying answer is 6 gallons. At $45 per gallon, the stain-only cost is $270.',
        ],
      },
      {
        title: 'Why the label coverage number matters',
        paragraphs: [
          'Deck stains do not all cover the same area. Some product pages list one-coat coverage. Others give different coverage for first and second coats, or different ranges for rough and smooth wood.',
          'That is why this calculator asks for coverage instead of hiding a universal default. If your deck is rough, dry, cracked, previously stripped, or full of rail details, use the lower end of the label range or add waste.',
        ],
      },
      {
        title: 'Rails, stairs, and surfaces the calculator leaves out',
        paragraphs: [
          'The railing estimate is a simple rectangle: length times height times two faces. That catches the big surface, but it cannot perfectly count balusters, posts, caps, lattice, benches, pergolas, planter boxes, or built-in seating.',
          'The stair estimate counts treads and risers. If you also plan to stain stringers, side trim, landings, or stair railings, measure those areas separately or add a larger waste cushion.',
        ],
      },
      {
        title: 'Prep and weather can change the real job',
        paragraphs: [
          'A gallon estimate does not tell you whether the deck is ready for stain. The wood may need cleaning, stripping, sanding, brightening, drying time, or a moisture check before the finish can perform well.',
          'Weather matters too. Wind, heat, cold, rain risk, and direct sun can affect how fast stain dries and how evenly it soaks in. Use the calculator for quantity, then follow the stain label for prep, timing, tools, coats, and dry time.',
        ],
      },
      {
        title: 'Stain gallons are not a full project budget',
        paragraphs: [
          'The cost line is useful, but it is intentionally narrow. It only multiplies whole gallons by the price per gallon.',
          'For a fuller deck project budget, keep stain separate from cleaner, stripper, brushes, rollers, sprayer supplies, tape, tarps, replacement boards, hardware, permits, and labor. If you are also planning boards or a broader project cost, the Deck Board Calculator and Deck Cost Calculator are better next steps.',
        ],
        links: [
          { href: '/tools/deck-board-calculator/', label: 'Estimate deck boards before staining' },
          { href: '/tools/deck-cost-calculator/', label: 'Build a rough deck project budget' },
        ],
      },
    ],
    sources: [
      sourceLinks.inchDeckStain,
      sourceLinks.decksComStaining,
      sourceLinks.behrDeckPlusSolidStain,
      sourceLinks.rustOleumWolmanDurastain,
      sourceLinks.nistUnits,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'baluster-calculator': {
    title: 'Baluster Calculator Guide | Railing Spacing',
    metaDescription:
      'Learn how to estimate baluster count and equal open spacing from rail length, post width, baluster width, and max gap before laying out a deck rail.',
    summary: 'Learn how clear railing opening length, baluster width, and max open gap become a baluster count and equal spacing.',
    purpose:
      'The Baluster Calculator is a spacing helper for one straight rail section. It subtracts posts from the rail run, fits enough balusters to stay at or below the max open gap you enter, and reports the actual equal spacing after rounding up.',
    intro:
      'Baluster layout looks simple until posts, nominal lumber sizes, and code spacing all meet in the same rail bay. This guide shows the exact math behind the Baluster Calculator so you can turn a measured rail run into a count, an equal gap, and a layout worth checking before you fasten anything.',
    inputMatch: 'rail length, post width, post count, baluster width, and max open spacing',
    logicNote:
      'The calculator uses clear opening = rail length x 12 - post count x post width, balusters needed = ceiling((clear opening - max open spacing) / (baluster width + max open spacing)), and actual open spacing = (clear opening - baluster count x baluster width) / (baluster count + 1).',
    readIntro:
      'Read the result as a layout count for one straight bay, not as a building permit or inspection approval.',
    mistakeIntro:
      'Most bad baluster layouts come from mixing feet and inches, using nominal instead of actual baluster width, or treating a calculator result as a complete railing-code check.',
    sidecarText:
      'For the default bay, a 10 ft rail with two 3.5 in posts leaves 113 in of clear opening. With 1.5 in balusters and a 4 in max gap, the calculator fits 20 balusters and sets the equal open spacing at about 3.952 in.',
    enter: [
      'Enter the full straight rail length in feet before subtracting posts.',
      'Enter the actual post width, post count, and baluster width in inches.',
      'Enter the largest open spacing you want to allow between balusters. Many deck guard layouts use 4 inches or less as the planning target, but local rules control.',
    ],
    read: [
      'Balusters needed is rounded up so the calculated gaps do not exceed the max spacing you entered.',
      'Actual open spacing is the equal gap between balusters after rounding up the count.',
      'Opening length shows the rail space left after subtracting all posts from the measured rail run.',
      'Baluster width used shows how many inches of the opening are occupied by balusters instead of gaps.',
    ],
    mistakes: [
      'Do not enter a 10 foot rail as 120. The rail length field expects feet, then the calculator converts it to inches.',
      'Do not use nominal lumber size when the actual baluster width is different.',
      'Do not treat this as a complete railing code check. Guard height, stair openings, bottom-rail gaps, handrails, post strength, and local amendments can still matter.',
      'Do not forget that the gap between a post and the first baluster counts too.',
      'Do not assume angled stair railings work exactly like a flat rail bay.',
    ],
    extraSections: [
      {
        title: 'Quick 10 ft deck rail example',
        paragraphs: [
          'Say the rail section is 10 ft long. Two posts are inside that run, and each post is 3.5 in wide. The calculator converts 10 ft to 120 in, subtracts 7 in of posts, and leaves a 113 in clear opening.',
          'With 1.5 in balusters and a 4 in max open gap, the calculator gives 20 balusters. Those balusters occupy 30 in total, leaving 83 in of open space. Because there are 21 gaps around 20 balusters, the actual equal spacing is 83 / 21, or about 3.952 in.',
        ],
      },
      {
        title: 'Why the calculator rounds up',
        paragraphs: [
          'If a rail bay almost fits with fewer balusters, the last little bit of open space has to go somewhere. Rounding down can push one or more gaps over the limit you entered.',
          'Rounding up adds a baluster, then spreads the leftover space evenly. That is why the actual spacing is usually smaller than the max spacing. Smaller is expected; larger is the warning sign.',
        ],
      },
      {
        title: 'What to do with the 4 inch spacing target',
        paragraphs: [
          'Deck spacing guidance commonly talks about a 4 inch maximum opening for guards, and ICC model-code language uses a sphere test for required guard openings. The calculator lets you enter 4 in, 3.5 in, or any stricter number you need.',
          'That does not make the page a code approval tool. Your city, county, state, product system, or inspector can apply specific guard, stair, and handrail rules, so check the local rule before building.',
        ],
        links: [
          { href: '/tools/deck-board-calculator/', label: 'Estimate deck boards for the same project' },
          { href: '/tools/deck-cost-calculator/', label: 'Build a rough deck project budget' },
        ],
      },
      {
        title: 'Posts, end gaps, and layout marks',
        paragraphs: [
          'Posts reduce the opening because they take up real space inside the measured run. If you forget a middle post, the calculator will spread balusters across too much length.',
          'The equal-spacing result is the open gap, not the center-to-center mark. If you use a spacer block, cut or set it to the actual open spacing and still check the final gap before fastening the run.',
        ],
      },
      {
        title: 'Where this simple calculator stops',
        paragraphs: [
          'This tool handles one straight rail section. It does not model angled stair geometry, curved rails, cable deflection, glass panels, manufacturer bracket systems, structural post loads, or whether a guard is required at a specific deck height.',
          'For required guards and stairs, use the result as a layout draft. Then compare it with your local code, product instructions, and any permit or inspection notes.',
        ],
      },
    ],
    sources: [
      sourceLinks.inchBaluster,
      sourceLinks.decksComBalusterCalculator,
      sourceLinks.decksComBalusterBasics,
      sourceLinks.iccIrc2021GuardOpenings,
      sourceLinks.awcDca6DeckGuide,
      sourceLinks.nistUnits,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'paver-calculator': {
    summary: 'Learn how area, paver size, and waste become a buying count.',
    purpose:
      'The Paver Calculator estimates how many whole pavers cover a patio, walkway, driveway pad, or simple path. It converts each paver into square feet, adds waste, then rounds up so the answer is a buyable count.',
    enter: [
      'Enter the project area in square feet.',
      'Enter the paver length and width in inches.',
      'Add waste for cuts, broken pieces, edge pieces, pattern layout, and a few matching spares.',
    ],
    read: [
      'The main answer is whole pavers needed.',
      'Each paver area shows the coverage of one piece.',
      'Area with waste shows the adjusted area used before rounding.',
      'If your supplier sells by bundle, layer, or pallet, round the calculator count up again to match that package size.',
    ],
    mistakes: [
      'Do not forget base gravel, bedding sand, joint sand, edging, and compaction.',
      'Do not ignore pattern direction or cut-heavy borders.',
      'Do not use this single-size count for a mixed-size pattern unless the pattern tells you how many of each paver is in one repeat.',
      'Check whether the supplier sells by piece, pallet, bundle, or square foot.',
    ],
    extraSections: [
      {
        title: 'Quick 10 by 10 patio example',
        paragraphs: [
          'A 10 by 10 foot patio is 100 square feet. A 4 by 8 inch paver covers 32 square inches, which is about 0.222 square feet.',
          'With 10% waste, the adjusted area is 110 square feet. Divide 110 by 0.222 and round up. The calculator gives 495 pavers.',
        ],
      },
      {
        title: 'What the count leaves out',
        paragraphs: [
          'The paver count is only the top layer. A real patio or walkway also needs base material, bedding sand, joint sand, edge restraints, slope, drainage, and compaction.',
          'Use the Paver Base Calculator for base and bedding material, then check the paver supplier package size before buying.',
        ],
      },
    ],
    sources: [
      sourceLinks.lowesPaverPlanning,
      sourceLinks.inchPaverCalculator,
      sourceLinks.calcShedPaverCalculator,
      sourceLinks.cmhaPaverConstruction,
      sourceLinks.nistUnits,
    ],
  },
  'paver-base-calculator': {
    summary: 'Learn how paver area and layer depths estimate base gravel and bedding sand.',
    metaDescription:
      'Learn how paver area, compacted base depth, bedding sand depth, waste, and gravel density estimate base cubic yards, base tons, and bedding sand.',
    purpose:
      'The Paver Base Calculator estimates the material layers below a paver surface. It separates compacted gravel base from bedding sand so you can plan each material.',
    enter: [
      'Enter the paver area in square feet.',
      'Enter base depth and bedding sand depth in inches.',
      'Enter waste percent and a rough tons-per-cubic-yard value for the base material.',
    ],
    read: [
      'Base cubic yards is the main volume to discuss with suppliers.',
      'Base tons converts the volume into approximate weight.',
      'Bedding sand shows the leveling layer volume separately.',
    ],
    mistakes: [
      'Do not use loose depth if your design calls for compacted depth.',
      'Do not ignore drainage, soil, slope, freeze-thaw, and traffic load.',
      'Do not assume every gravel product has the same tons per cubic yard.',
    ],
    sources: [sourceLinks.inchPaverBase, sourceLinks.nistUnits],
  },
  'polymeric-sand-calculator': {
    summary: 'Learn how square feet, paver size, joint width, joint depth, waste, and bag coverage estimate polymeric sand bags.',
    purpose:
      'The Polymeric Sand Calculator estimates how much joint sand fits between pavers or flagstone. It helps with quantity planning before you check the bag label and product instructions.',
    enter: [
      'Enter the finished paver area in square feet, then add paver length and width.',
      'Enter average joint width and joint depth. Measure a few spots if the joints are uneven.',
      'Enter waste percent and bag coverage. If the bag lists square-foot coverage, use that label as a check before buying.',
    ],
    read: [
      'Bags needed rounds the sand volume up by bag coverage.',
      'Sand volume with waste shows the estimated joint fill volume.',
      'Estimated pavers explains the rough piece count used for joint math.',
      'For example, a 200 square foot patio with 8 x 4 inch pavers, 1/4 inch joints, 1 inch joint depth, 10% waste, and 0.5 cubic foot per bag needs about 1.72 cubic feet of sand, so you buy 4 bags.',
    ],
    mistakes: [
      'Do not expect perfect accuracy for irregular pavers or uneven joints.',
      'Do not forget old joints may already contain some sand.',
      'Do not skip product instructions for joint width, joint depth, watering, and cleanup.',
      'Do not assume every 50 lb bag covers the same square footage. Joint width, joint depth, and paver shape change coverage.',
    ],
    extraSections: [
      {
        title: 'Quick paver patio example',
        paragraphs: [
          'Say the patio is 200 square feet and uses 8 x 4 inch pavers. The joints average 1/4 inch wide and 1 inch deep. With 10% waste, the calculator estimates about 1.72 cubic feet of polymeric sand.',
          'If the bag coverage is 0.5 cubic foot, 1.72 / 0.5 = 3.44. Round up and buy 4 bags. This is a planning estimate, so compare it with the product label before checkout.',
        ],
      },
      {
        title: 'Why the bag label matters',
        paragraphs: [
          'Polymeric sand products do not all cover the same area. Some labels use cubic feet. Some use square feet for a certain joint width and paver thickness. A 50 lb bag can cover very different projects.',
          'Use the calculator to understand the joint volume, then check the product label or manufacturer chart for the exact sand you plan to buy.',
        ],
      },
      {
        title: 'Flagstone and old joints',
        paragraphs: [
          'Flagstone joints are often wider and less regular than paver joints. Measure several real gaps, use a higher waste percent, and keep the result rough.',
          'For repairs, old joints may already contain sand, dust, or debris. Clean the joints to the depth the product asks for before trusting any bag count.',
        ],
      },
      {
        title: 'Watering and cleanup are not optional',
        paragraphs: [
          'This page only estimates quantity. Polymeric sand can stain or fail if the surface is damp, dusty, over-watered, under-watered, or hit by rain too soon.',
          'Follow the bag instructions for dry pavers, sweeping, compacting, dust cleanup, misting, curing time, and rain protection.',
        ],
      },
    ],
    sources: [
      sourceLinks.inchPolymericSand,
      sourceLinks.sakretePermasand,
      sourceLinks.quikretePolymericSand,
      sourceLinks.nistUnits,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'grass-seed-calculator': {
    summary: 'Learn how lawn area and seed label rates estimate seed pounds and bags.',
    purpose:
      'The Grass Seed Calculator turns a seed label rate into pounds and whole bags. It works for new lawns, overseeding, and small repair areas when you enter the right rate.',
    enter: [
      'Enter the lawn area you plan to seed.',
      'Enter the seed rate in pounds per 1,000 square feet from the product label.',
      'Enter waste percent, bag weight, and optional price per bag.',
    ],
    read: [
      'Seed pounds is the amount needed after waste is added.',
      'Bags to buy rounds seed pounds up by bag weight.',
      'Estimated cost appears when you enter a price per bag.',
    ],
    mistakes: [
      'Do not use a new-lawn rate for overseeding unless the label says to.',
      'Do not ignore shade, soil prep, slopes, watering, and season.',
      'Do not confuse square feet with acres when measuring a yard.',
    ],
    sources: [sourceLinks.inchGrassSeed, sourceLinks.nistUnits],
  },
  'lawn-mowing-calculator': {
    summary: 'Learn how lawn area, mower width, speed, and efficiency estimate mowing time.',
    purpose:
      'The Lawn Mowing Calculator gives a rough time estimate for cutting grass. It starts with an ideal mowing rate, then reduces it by real-world efficiency.',
    enter: [
      'Enter mowable lawn area in square feet.',
      'Enter mower cutting width in inches and average speed in miles per hour.',
      'Enter efficiency percent for turns, overlap, gates, obstacles, and slowing down.',
    ],
    read: [
      'Estimated mowing time is shown in minutes and hours.',
      'Mowing rate shows the square feet per hour after efficiency.',
      'Acres helps compare the area with common lawn-size language.',
    ],
    mistakes: [
      'Do not enter the mower top speed if you mow slower in real life.',
      'Do not count house, driveway, pool, or garden areas as mowable lawn.',
      'Do not forget trimming, bagging, hills, wet grass, and cleanup time.',
    ],
    sources: [sourceLinks.inchLawnMowing, sourceLinks.nistUnits],
  },
  'plant-spacing-calculator': {
    summary: 'Learn how bed dimensions, plant spacing, and planting pattern estimate plant count.',
    metaDescription:
      'Use the Plant Spacing Calculator guide to estimate plant count from bed size, plant spacing, square rows, triangular layout, row count, and border setbacks.',
    purpose:
      'The Plant Spacing Calculator turns a bed size and plant-tag spacing into a rough number of plants. It compares square rows with a triangular staggered layout.',
    enter: [
      'Enter bed length and width in feet.',
      'Enter center-to-center plant spacing in inches.',
      'Choose square grid or triangular staggered pattern.',
    ],
    read: [
      'Plants needed is rows times plants per row.',
      'Rows and plants per row show how the total was built.',
      'Row spacing changes when you choose triangular pattern.',
    ],
    mistakes: [
      'Do not forget mature plant size and air flow.',
      'Do not plant right to the edge if the bed needs a border setback.',
      'Irregular beds, paths, shade, soil, and growth habit can change the real plan.',
    ],
    sources: [sourceLinks.inchPlantCalculator, sourceLinks.nistUnits],
  },
  'siding-calculator': {
    summary: 'Learn how wall area, openings, gables, waste, and box coverage become siding squares and cost.',
    metaDescription:
      'Use the Siding Calculator with square-foot, siding-square, box, gable, vinyl, Hardie, lap siding, waste, and material-cost examples.',
    purpose:
      'The Siding Calculator estimates siding square feet, siding squares, rounded boxes, and material cost. It is useful after you have measured wall sections, opening areas, and any gable triangles.',
    intro:
      'Siding estimates get messy when a wall has gables, windows, doors, trim, and box coverage on the label. The calculator keeps the first job simple: find the coverage area, add waste, then turn it into siding squares.',
    inputMatch: 'the wall area, opening area, waste percent, squares per box, and optional price per square',
    logicNote:
      'The calculator subtracts openings from wall area, adds waste, divides by 100 square feet per siding square, rounds ordering numbers up, and multiplies by price only when you enter one.',
    readIntro:
      'Read siding squares as the main supplier number. Read rounded squares or boxes as the safer buying number, because siding is not usually bought as a perfect decimal.',
    mistakeIntro:
      'The easy mistake is measuring only flat rectangles and forgetting gables, dormers, corners, starter strip, J-channel, trim, soffit, fascia, and product exposure. Those pieces can change the order even when the wall-area math is right.',
    sidecarText:
      'Open the Siding Calculator beside this guide. Try 1,200 square feet of wall area, 120 square feet of openings, 10% waste, 2 squares per box, and $180 per square.',
    bestUsesIntro:
      'Use this guide for a first material estimate for vinyl, fiber cement, Hardie-style lap siding, wood, or engineered siding before checking the product label or installer takeoff.',
    referenceIntro:
      'These references support the siding-square definition, gable/opening measurement cautions, and the accessory warning behind the calculator.',
    enter: [
      'Enter total exterior wall area in square feet. Add rectangular wall sections together.',
      'Add gables as triangle area: width times peak height divided by 2.',
      'Enter door and window area to subtract, then choose a waste percent for cuts, gables, corners, and damaged pieces.',
      'Enter squares per box and price per square only when you want a box or material-cost check.',
    ],
    read: [
      'A 1,200 square foot exterior with 120 square feet of openings leaves 1,080 square feet before waste.',
      'With 10% waste, the adjusted area is 1,188 square feet.',
      'That is 11.88 siding squares, so the buying estimate rounds to 12 squares.',
      'If a box covers 2 squares, 12 rounded squares becomes 6 boxes. At $180 per square, the material estimate is $2,160.',
    ],
    mistakes: [
      'Do not forget gables, dormers, trim-heavy sections, starter strips, corners, and channels.',
      'Do not treat price per square as installed price unless labor and accessories are included.',
      'Do not use the same waste for every house. Simple walls may be close with about 10%, but complex gables, repairs, and lots of cuts may need more.',
      'Check product exposure and box coverage because not every vinyl, Hardie, lap, board, or panel profile covers the same area.',
    ],
    extraSections: [
      {
        title: 'How To Count A Gable Without Making It Hard',
        paragraphs: [
          'A simple triangular gable uses width times height divided by 2. A 20 ft wide gable with a 10 ft peak height is 100 square feet.',
          'Since one siding square is 100 square feet, that gable is 1 square before waste. Add it to the rest of the wall area before you subtract openings and add waste.',
        ],
      },
      {
        title: 'Why Boxes And Squares Are Different',
        paragraphs: [
          'A siding square is a coverage unit. A box is the package you buy. Some vinyl siding boxes cover about 2 squares, but the real value is on the product label.',
          'Use the calculator result as a bridge: square feet explain the measured area, squares help with supplier quotes, and boxes help with retail ordering.',
        ],
      },
      {
        title: 'What This Estimate Leaves Out',
        paragraphs: [
          'This page does not estimate J-channel, starter strip, corner posts, trim, soffit, fascia, fasteners, wrap, flashing, caulk, disposal, scaffolding, or labor.',
          'It also does not decide whether the wall needs repair, weatherproofing, code review, or a specific installer layout. Use it as a clean first estimate, then check the product instructions.',
        ],
      },
    ],
    sources: [
      sourceLinks.inchSidingCalculator,
      sourceLinks.certainTeedMeasureVinylSiding,
      sourceLinks.lowesSiding,
      sourceLinks.nistUnits,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'brick-calculator': {
    summary: 'Learn how wall face area, brick size, mortar joint, openings, and waste estimate brick count.',
    purpose:
      'The Brick Calculator estimates whole bricks for a simple wall face. It uses the visible face dimensions of one brick plus the mortar joint to estimate square-foot coverage, then rounds up after waste.',
    enter: [
      'Enter the net wall face area in square feet after subtracting large doors or windows.',
      'Enter brick length, brick height, mortar joint thickness, and waste percent. A 3/8 inch joint is common, but use your plan or supplier number.',
      'Use actual brick face dimensions when you have them from the supplier, not just a nickname such as modular or queen.',
    ],
    read: [
      'Bricks needed is rounded up to whole units.',
      'Brick face area shows how much wall one brick covers with the joint included.',
      'Area with waste shows the adjusted wall face before division.',
      'If a supplier table gives a different count, check whether it used 3/8 inch joints, 1/2 inch joints, nominal dimensions, or no waste.',
    ],
    mistakes: [
      'Do not ignore bond pattern, corners, openings, piers, cuts, and broken pieces.',
      'Do not use this simple face estimate for structural wall design, retaining walls, chimneys, or load-bearing masonry.',
      'Estimate mortar, wall ties, lintels, flashing, weep holes, cleanup, and labor separately.',
    ],
    sources: [sourceLinks.biaBrickEstimating, sourceLinks.glenGeryBrickSizes, sourceLinks.nistUnits],
  },
  'concrete-block-calculator': {
    summary: 'Learn how wall size, openings, nominal CMU size, and waste become a concrete block count.',
    purpose:
      'The Concrete Block Calculator estimates CMU or concrete blocks for a simple wall. It uses the nominal block face size, so an 8 by 16 inch unit is treated as the wall-layout module, not just the smaller actual block.',
    enter: [
      'Enter wall length and height in feet. Measure each straight wall section separately when the layout turns a corner.',
      'Enter nominal block length and height in inches. A common 8 by 16 inch CMU covers about 8/9 square foot before waste.',
      'Subtract large door or window openings first, then add waste for cuts, broken units, corners, and layout changes.',
    ],
    read: [
      'Blocks needed is the rounded-up material count after openings and waste.',
      'Courses estimates how many horizontal rows fit the wall height from the nominal block height.',
      'Blocks per course estimates how many blocks fit along the wall length from the nominal block length.',
      'For example, a 40 ft by 8 ft wall with a 20 square foot opening and 5% waste comes out to about 355 blocks with 8 by 16 inch units.',
    ],
    mistakes: [
      'Do not count the rough wall area and then forget to subtract big openings before adding waste.',
      'Do not forget corners, half blocks, bond pattern, lintels, grout, mortar, rebar, wall ties, flashing, drainage, and footings.',
      'Do not use this as a structural design, retaining-wall safety check, permit plan, or code approval.',
    ],
    sources: [
      sourceLinks.cmhaConcreteMasonryEstimating,
      sourceLinks.cmhaModularConcreteMasonry,
      sourceLinks.cmhaConcreteMasonryConstruction,
      sourceLinks.nistUnits,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'rebar-calculator': {
    summary: 'Learn how slab size, spacing, stock length, and waste become rebar bars to buy.',
    purpose:
      'The Rebar Calculator estimates a simple two-direction grid for rectangular slabs. It counts bars in both directions, totals linear feet, adds waste, then converts that length into stock bars to buy.',
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
      'Do not use diameter as spacing. Spacing is the distance between parallel bars.',
      'Do not forget lap length, bar size, cover, chairs, edge distance, supports, delivery stock length, and code requirements.',
      'Use the concrete plan, local code, or a qualified professional for real reinforcement design.',
    ],
    extraSections: [
      {
        title: 'What the grid count means',
        paragraphs: [
          'A simple slab grid has bars running lengthwise and bars running widthwise. The calculator counts how many bars fit across each side using the spacing you entered.',
          'For the default 20 ft by 12 ft slab at 18 inch spacing, the calculator counts 9 lengthwise bars and 14 widthwise bars. That is 348 raw linear feet before waste.',
        ],
      },
      {
        title: 'Why stock bar length matters',
        paragraphs: [
          'Suppliers sell bars in stock lengths, so the calculator divides adjusted linear feet by the stock bar length and rounds up. If you change from 20 ft bars to 10 ft bars, the whole-bar count changes even when the slab does not.',
          'The result is a buying estimate. Real cuts, lap splices, bends, hooks, and delivery minimums can still change the order.',
        ],
      },
      {
        title: 'Weight, walls, and structural limits',
        paragraphs: [
          'People often need rebar weight too, but weight depends on bar size. Use the Rebar Weight Calculator after this page if you know the size, length, and quantity.',
          'Walls, footings, beams, and heavy slabs can need different layers, cover, bar size, splice length, and inspection details. This page helps count material for a simple grid; it does not choose reinforcement for the job.',
        ],
      },
    ],
    sources: [sourceLinks.calcShedRebar, sourceLinks.inchRebarWeight, sourceLinks.crsiSplicingBars, sourceLinks.nistUnits],
  },
  'concrete-mix-calculator': {
    summary: 'Learn how concrete volume, waste, and a cement:sand:gravel ratio become a rough material list.',
    purpose:
      'The Concrete Mix Calculator helps plan small batches by splitting an adjusted concrete volume into cement, sand, and gravel parts. It is useful when you know the volume and need a rough buying list before checking the bag label or project instructions.',
    enter: [
      'Enter the concrete volume in cubic yards.',
      'Enter the cement, sand, and gravel ratio parts, such as 1, 2, and 3 for a 1:2:3 mix or 1, 2, and 4 for a 1:2:4 mix.',
      'Enter the cement bag cubic-foot yield from the bag or supplier label, then add waste for spills, uneven measuring, and low spots.',
    ],
    read: [
      'Cement bags are rounded up from the cement cubic feet and bag yield you entered.',
      'Sand and gravel are shown in cubic feet so you can compare the material amounts before buying.',
      'Adjusted concrete volume includes the waste percent before the ratio split.',
    ],
    mistakes: [
      'Do not use a rough ratio as a guaranteed strength mix.',
      'Do not forget water, aggregate moisture, curing, additives, slab thickness, base prep, joints, and product instructions.',
      'Do not use this for structural concrete unless the mix is specified by a qualified source.',
      'Do not treat this as a mortar-only sand and cement calculator. The live calculator needs cement, sand, and gravel parts.',
    ],
    extraSections: [
      {
        title: 'What the ratio parts mean',
        paragraphs: [
          'A ratio like 1:2:3 does not mean one bag, two bags, and three bags automatically. It means one volume part cement, two volume parts sand, and three volume parts gravel.',
          'The calculator adds all parts together, then gives each material its share of the adjusted concrete volume.',
        ],
      },
      {
        title: 'A quick 1:2:3 example',
        paragraphs: [
          'For 1 cubic yard with 10% waste, the adjusted volume is 29.70 cubic feet. A 1:2:3 mix has 6 total parts, so cement gets 4.95 cubic feet, sand gets 9.90 cubic feet, and gravel gets 14.85 cubic feet.',
          'If your cement bag yield is 1 cubic foot, that cement amount rounds up to 5 bags. If the bag yield is smaller, the bag count goes up.',
        ],
      },
      {
        title: 'When to stop and check the product label',
        paragraphs: [
          'QUIKRETE notes that bag estimates are approximate and are rounded up for buying. That is the same practical idea here: round up, then check the exact product yield before you load the cart.',
          'For slabs, footings, posts, or anything structural, use this as a planning check only. Mix design, water amount, reinforcement, curing, and local rules matter more than a simple ratio split.',
        ],
      },
    ],
    sources: [sourceLinks.inchConcreteMix, sourceLinks.quickrete, sourceLinks.nistUnits],
  },
  'concrete-driveway-calculator': {
    summary: 'Learn how driveway length, width, thickness, waste, and ready-mix price become concrete yards, bag counts, and rough material cost.',
    purpose:
      'The Concrete Driveway Calculator estimates concrete volume for a rectangular driveway slab. It is a quantity and material-cost helper, not a driveway design, permit, or safety sign-off.',
    inputMatch:
      'driveway length and width in feet, slab thickness in inches, waste percent, and optional price per cubic yard',
    logicNote:
      'The calculator converts thickness from inches to feet, multiplies length x width x thickness, adds waste, divides by 27 for cubic yards, rounds common bag counts up, and multiplies by price per cubic yard only when you enter one.',
    referenceIntro:
      'These sources help keep the page honest about concrete volume, bag estimates, unit conversion, and pavement-design limits.',
    enter: [
      'Enter the driveway length and width in feet, measured inside the forms.',
      'Enter the concrete slab thickness in inches. Do not include gravel base depth in this number.',
      'Add waste for uneven forms, low spots, spillage, and a small ordering cushion.',
      'Enter price per cubic yard only if you want a rough material-only cost.',
    ],
    read: [
      'Cubic yards is the ready-mix style number most people need for ordering.',
      'Cubic feet shows the slab volume before dividing by 27.',
      '60 lb and 80 lb bag counts are rounded up, which is useful for tiny repairs but usually too many bags for a full driveway.',
      'Estimated cost is material-only. It does not include labor, forms, base gravel, reinforcement, delivery, finishing, demolition, or permits.',
    ],
    mistakes: [
      'Do not guess thickness if the driveway will carry heavy vehicles, RVs, delivery trucks, or work equipment.',
      'Do not count gravel base depth as concrete thickness.',
      'Do not forget base prep, compaction, joints, drainage, forms, reinforcement, curing, local code, and inspection rules.',
      'Do not treat the bag count as a recommended buying plan for a large driveway pour.',
    ],
    extraSections: [
      {
        title: 'Example: 40 by 12 feet at 4 inches',
        paragraphs: [
          'A 40 by 12 foot driveway has 480 square feet of surface area. At 4 inches thick, the raw concrete volume is 160 cubic feet.',
          'With 10% waste, the adjusted volume is 176 cubic feet. Divide by 27 and you get about 6.52 cubic yards. If ready-mix is $160 per cubic yard, the material-only estimate is about $1,043.',
          'The same volume would be about 294 eighty-pound bags. That number is useful as a check, but it also shows why a full driveway is usually a ready-mix job.',
        ],
      },
      {
        title: 'Why slab thickness changes the number fast',
        paragraphs: [
          'Thickness is part of the volume formula, so changing it changes the order. On the same driveway area, a 5-inch slab uses 25% more concrete than a 4-inch slab.',
          'The calculator does not choose the right thickness. It only shows the concrete needed for the thickness you enter. Soil, base prep, loads, frost, drainage, reinforcement, and local rules still matter.',
        ],
      },
      {
        title: 'When to stop before ordering',
        paragraphs: [
          'QUIKRETE notes that concrete calculator bag counts are approximate and do not cover uneven substrate, waste, and similar jobsite changes. That is why this page keeps waste visible instead of hiding it.',
          'Before ordering, check the product yield, ready-mix minimums, delivery fees, driveway apron rules, permits, drainage slope, and whether the slab needs reinforcement or saw-cut joints.',
        ],
      },
    ],
    sources: [sourceLinks.inchConcreteDriveway, sourceLinks.quickrete, sourceLinks.acpaPavementDesign, sourceLinks.nistUnits],
  },
  'concrete-steps-calculator': {
    summary: 'Learn how step count, stair width, riser height, tread depth, landing depth, and waste estimate concrete yards and bag counts.',
    purpose:
      'The Concrete Steps Calculator estimates a simple solid poured stair shape by stacking step blocks and adding an optional top landing. It helps with material planning before detailed formwork, not code approval or stair design.',
    inputMatch:
      'step count, stair width in feet, riser height in inches, tread depth in inches, optional landing depth in feet, and waste percent',
    logicNote:
      'The calculator converts riser and tread dimensions to feet, stacks the solid step volumes, adds the optional landing at full stair height, adds waste, divides by 27 for cubic yards, and rounds common bag counts up.',
    referenceIntro:
      'These references help keep the page honest about concrete bag estimating, step geometry, and unit conversion.',
    enter: [
      'Enter the number of risers, not the number of walking surfaces.',
      'Enter step width in feet, then one-step riser height and tread depth in inches.',
      'Enter landing depth if there is a top landing, or 0 if there is not.',
      'Add waste for form variation, low spots, spillage, and ordering cushion.',
    ],
    read: [
      'Cubic yards is the total adjusted concrete volume.',
      'Stair volume and landing volume show the two major pieces of the estimate before they are combined.',
      'Bag counts are rounded up from common dry-mix bag yields and are most useful for small pours.',
      'Large porch steps may be a ready-mix job even when the calculator can show bag counts.',
    ],
    mistakes: [
      'Do not use this for hollow, precast, or partly filled step forms without adjusting the volume.',
      'Do not enter total stair height as riser height; riser height is for one step.',
      'Do not forget footings, frost depth, reinforcement, slope, nosing, landing size, handrails, and local code.',
    ],
    extraSections: [
      {
        title: 'Example: four porch steps with a landing',
        paragraphs: [
          'For 4 steps, 4 feet wide, 7 inch risers, 11 inch treads, a 3 foot landing, and 10% waste, the estimate is about 2.01 cubic yards.',
          'That same volume is about 54.33 cubic feet. Using common 80 lb bag yield, it rounds to about 91 eighty-pound bags, which is a lot to mix by hand.',
          'The useful check is not just the bag number. It is seeing how much the landing and waste cushion add before you talk to a supplier or contractor.',
        ],
      },
      {
        title: 'Why the calculator stacks the steps',
        paragraphs: [
          'A solid stair is not one flat slab. The bottom step supports the steps above it, so the shape acts like a stack of blocks.',
          'That model works for simple solid poured steps. It does not work for hollow forms, precast units, thin caps, or steps poured over a separate filled base unless you adjust the volume.',
        ],
      },
      {
        title: 'Code and safety checks are separate',
        paragraphs: [
          'QUIKRETE notes that riser and tread size depends on step layout. This page estimates concrete from the dimensions you enter; it does not choose the legal or safest stair geometry.',
          'Before pouring, check local rules for riser height, tread depth, landing size, handrails, slope, frost, footings, reinforcement, and whether the steps attach to a building.',
        ],
      },
    ],
    sources: [sourceLinks.inchConcreteSteps, sourceLinks.quickrete, sourceLinks.quickreteStepsRamps, sourceLinks.nistUnits],
  },
  'concrete-weight-calculator': {
    summary: 'Learn how cubic yards, density, and waste estimate concrete weight in pounds and US tons.',
    purpose:
      'The Concrete Weight Calculator converts cubic yards into cubic feet, multiplies by the density you enter, and converts pounds into US tons. It is helpful for hauling, disposal, trailer, and rough planning checks when you already know the concrete volume.',
    inputMatch:
      'Use the calculator after you know the concrete volume. If you only know length, width, and thickness, calculate cubic yards first with the Concrete Calculator or Cubic Yard Calculator.',
    logicNote:
      'The math is cubic yards x 27, then adjusted by waste, then multiplied by density in lb/ft3. The tons result is pounds divided by 2,000.',
    referenceIntro:
      'Concrete weight is a density problem. ACI defines normalweight concrete around 150 lb/ft3, and FHWA notes normal-weight concrete is often about 145 to 150 lb/ft3 while lightweight mixes can be lower.',
    enter: [
      'Enter concrete volume in cubic yards. Use the neat volume if you only want the shape weight.',
      'Enter density in pounds per cubic foot. Use 145 to 150 lb/ft3 for a rough normal-weight estimate, or use supplier data when you have it.',
      'Use waste percent only when you want the weight after adding an ordering cushion.',
    ],
    read: [
      'Total pounds is the main weight estimate.',
      'US tons is total pounds divided by 2,000.',
      'Cubic feet shows the adjusted volume used in the weight formula.',
      'Density used repeats the lb/ft3 value so you can spot a bad assumption quickly.',
    ],
    mistakes: [
      'Do not assume every concrete mix weighs the same.',
      'Do not use a rough density when hauling limits or structural loads need exact numbers.',
      'Do not include rebar weight unless you calculate it separately.',
      'Do not mix up US tons and metric tonnes.',
      'Do not use waste percent if you only want the exact neat-shape weight.',
    ],
    extraSections: [
      {
        title: 'Example: 2 cubic yards of normal concrete',
        paragraphs: [
          'Enter 2 cubic yards, 145 lb/ft3 density, and 0 percent waste. The calculator converts 2 cubic yards to 54 cubic feet.',
          'Then it multiplies 54 by 145 to get 7,830 pounds. Dividing by 2,000 gives about 3.92 US tons.',
        ],
      },
      {
        title: 'Example: heavy estimate with waste',
        paragraphs: [
          'For 3.5 cubic yards at 150 lb/ft3 with 5 percent waste, the adjusted volume is 99.225 cubic feet.',
          'That produces about 14,884 pounds, or about 7.44 US tons. This is the kind of check that helps before hauling or disposal planning.',
        ],
      },
      {
        title: 'Why density matters more than the calculator looks',
        paragraphs: [
          'Normal-weight concrete is often close enough to 145 to 150 lb/ft3 for a rough estimate, but lightweight concrete, air content, aggregate type, moisture, and reinforcement can change the real weight.',
          'If the number affects a truck, trailer, crane, form, dumpster, disposal ticket, or structural load, use the supplier ticket, mix design, or project specification instead of a rough default.',
        ],
      },
      {
        title: 'Metric checks',
        paragraphs: [
          'People often ask for 1 m3 concrete weight in kg. A common normalweight estimate is about 2,400 kg per cubic meter.',
          'This calculator stays in US units for now. Use a metric conversion check only as a rough comparison unless the project documents give a metric density.',
        ],
      },
    ],
    sources: [
      sourceLinks.inchConcreteWeight,
      sourceLinks.aciConcreteTerminology,
      sourceLinks.fhwaConcreteWeight,
      sourceLinks.nrmcaLightweightConcrete,
      sourceLinks.nistUnits,
    ],
  },
  'concrete-reinforcing-mesh-calculator': {
    summary: 'Learn how slab area, mesh sheet size, overlap, and waste estimate welded wire mesh sheets.',
    purpose:
      'The Concrete Mesh Calculator estimates how many welded wire mesh sheets or roll sections are needed for a rectangular slab. It is a buying-list helper, not a reinforcement design.',
    enter: [
      'Enter slab length and width in feet.',
      'Enter one mesh sheet size. If you are cutting from a roll, use the planned cut length and roll width.',
      'Enter overlap in inches, then add waste for cuts, damaged sheets, and small layout changes.',
    ],
    read: [
      'Sheets needed is the adjusted slab area divided by effective sheet area, rounded up.',
      'Effective sheet area is smaller than the sheet label when overlap is entered. A 10 x 5 ft sheet with 6 in overlap covers about 42.75 ft2 for estimating.',
      'For a 30 x 20 ft slab using 10 x 5 ft sheets, 6 in overlap, and 10% waste, the calculator returns 16 sheets.',
    ],
    mistakes: [
      'Do not treat sheet count as a slab design. Wire size, layers, loads, joints, and local code are separate decisions.',
      'Do not ignore support chairs, concrete cover, edge distance, lap rules, and placement height. ACI notes that welded wire reinforcement should be supported in position before concrete placement.',
      'Do not enter overlap larger than the sheet dimensions; the calculator will stop because there is no usable sheet area left.',
      'Do not assume the waste percent replaces drawing notes for laps or splices.',
    ],
    sources: [sourceLinks.inchConcreteMesh, sourceLinks.aciWwrPlacement, sourceLinks.crsiSplicingBars, sourceLinks.nistUnits],
  },
  'concrete-block-fill-calculator': {
    summary: 'Learn how block count, fill volume per block, and waste estimate CMU core fill.',
    purpose:
      'The Concrete Block Fill Calculator estimates grout or concrete needed for selected CMU cores. It starts from the fill volume per block or filled cell that you enter, so it can handle different block sizes without guessing.',
    enter: [
      'Enter the number of CMU blocks, cells, or filled locations from your takeoff.',
      'Enter cubic feet of fill per block or filled cell from block data, a masonry table, product notes, or the project drawing.',
      'Add waste for spillage, pump loss, cleanouts, overfilled cells, and measuring differences.',
    ],
    read: [
      'Cubic feet is the adjusted block-fill volume after waste.',
      'Cubic yards is cubic feet divided by 27, which helps when comparing ready-mix or grout orders.',
      'For 120 blocks at 0.25 ft3 each with 10% waste, the calculator returns 33 ft3, about 1.22 yd3, and about 55 eighty-pound bags.',
    ],
    mistakes: [
      'Do not assume every 8 inch, 10 inch, or 12 inch block has the same core volume. Use the volume that matches the actual unit and filled-cell pattern.',
      'Do not include mortar joints, bond beams, lintels, or footing concrete unless you calculate them separately.',
      'Do not ignore rebar cells, cleanouts, grout mix, lift height, consolidation, inspections, or structural requirements.',
      'Do not use ordinary bag-yield math as proof that the grout meets the plan or masonry code.',
    ],
    sources: [
      sourceLinks.inchConcreteBlockFill,
      sourceLinks.cmhaConcreteMasonryEstimating,
      sourceLinks.cmhaGroutConcreteMasonry,
      sourceLinks.cmhaGroutingWalls,
      sourceLinks.quickrete,
      sourceLinks.nistUnits,
    ],
  },
  'retaining-wall-calculator': {
    summary: 'Learn how wall size, block size, cap length, base trench size, and waste become retaining wall material counts.',
    metaDescription:
      'Use the Retaining Wall Calculator guide to estimate segmental wall blocks, cap blocks, courses, base gravel, waste, and limits before ordering.',
    purpose:
      'The Retaining Wall Calculator estimates materials for a simple segmental retaining wall. It counts wall blocks, cap blocks, courses, blocks per course, and base gravel from the dimensions you enter.',
    intro:
      'Use it when you already know the wall size and the block style you plan to buy. It is good for a shopping check, not for deciding whether the wall is safe.',
    inputMatch: 'wall length and height, segmental block face size, cap length, base trench size, and waste percent',
    logicNote:
      'The tool rounds height up to whole block courses, rounds length up to whole blocks per course, multiplies those counts, adds waste, then estimates cap blocks and base trench volume.',
    readIntro:
      'Read the wall block count first, then check courses and blocks per course so you can spot a strange block size or wall height entry.',
    mistakeIntro:
      'Most bad retaining-wall estimates come from using the wrong block face size, forgetting caps, treating base gravel as drainage gravel, or trusting material math as engineering.',
    sidecarText:
      'Open the Retaining Wall Calculator beside this guide. Try the 40 ft by 3 ft example, then swap in the block size printed on the product you plan to buy.',
    bestUsesIntro:
      'This guide works best for simple segmental block walls where you need a material count before comparing store lists, quotes, or delivery sizes.',
    referenceIntro:
      'These references help check segmental retaining wall terms, base and drainage cautions, and unit conversions used by the guide.',
    enter: [
      'Enter the finished wall length and height in feet.',
      'Enter the visible block face length and block height in inches from the supplier label or product sheet.',
      'Enter cap length in inches so the top row is estimated separately.',
      'Enter base trench depth and width in inches for the compacted base gravel estimate.',
      'Add waste for cuts, broken units, end pieces, curves, base cleanup, and small measuring mistakes.',
    ],
    read: [
      'Wall blocks is the rounded-up count after courses, blocks per course, and waste.',
      'Courses shows how many block rows the wall height needs.',
      'Blocks per course shows the straight-run layout before caps.',
      'Cap blocks is based on wall length and cap length, then rounded up with waste.',
      'Base gravel is the leveling/base trench volume in cubic feet and cubic yards.',
    ],
    mistakes: [
      'Do not use square feet alone when whole courses, caps, and waste matter.',
      'Do not use this as a safety design for a retaining wall.',
      'Do not count the base gravel result as drainage gravel behind the wall.',
      'Do not forget drainage stone, drain pipe, filter fabric, geogrid, backfill, compaction, setback, embedment, and soil pressure.',
      'Check permits and engineering rules, especially for taller walls, slopes, driveways, fences, buildings, water problems, or weak soils.',
    ],
    extraSections: [
      {
        title: 'Quick example',
        paragraphs: [
          'For a 40 ft long by 3 ft high wall using 16 by 6 inch blocks, the calculator rounds the wall to 6 courses and 30 blocks per course. With 5% waste, that becomes 189 wall blocks.',
          'If the cap blocks are 12 inches long, the same wall needs 42 cap blocks with 5% waste. A 6 inch deep by 18 inch wide base trench for 40 ft needs 31.5 ft3 of base gravel, or about 1.17 yd3.',
        ],
      },
      {
        title: 'Why courses matter',
        paragraphs: [
          'A wall that is 3 ft high is 36 inches high. With 6 inch blocks, that is exactly 6 courses. If your wall height does not divide cleanly by the block height, the calculator rounds up because you cannot buy a fraction of a block row.',
        ],
      },
      {
        title: 'Square feet vs block count',
        paragraphs: [
          'Wall square feet is useful for a rough size check, but it is not the same as a block order. Block length, block height, caps, curves, cuts, and waste all change the count.',
        ],
      },
      {
        title: 'What the base result leaves out',
        paragraphs: [
          'The base gravel number is only for the leveling/base trench you enter. It does not include drainage stone behind the wall, drain pipe, geotextile fabric, reinforced backfill, geogrid, or extra excavation.',
        ],
      },
      {
        title: 'When the calculator is not enough',
        paragraphs: [
          'Retaining walls hold soil, so small material math can become a safety problem when the site is complicated. Get local guidance before relying on a simple estimate for tall walls, poor soil, slopes above or below the wall, driveways, fences, buildings, terraced walls, drainage problems, utilities, frost, or any wall that needs a permit.',
        ],
      },
      {
        title: 'Useful related checks',
        paragraphs: [
          'If you are also planning block walls, gravel, or core fill, use the related tools to keep each estimate separate instead of mixing every material into one number.',
        ],
        links: [
          { href: '/tools/concrete-block-calculator/', label: 'Estimate concrete block wall units' },
          { href: '/tools/gravel-calculator/', label: 'Estimate gravel by depth and density' },
          { href: '/tools/concrete-block-fill-calculator/', label: 'Estimate CMU core fill separately' },
        ],
      },
    ],
    sources: [
      sourceLinks.inchRetainingWall,
      sourceLinks.cmhaSegmentalRetainingWallInstall,
      sourceLinks.cmhaSegmentalRetainingWallGuide,
      sourceLinks.cmhaSegmentalRetainingWallDesign,
      sourceLinks.allanBlockRetainingWallPlanning,
      sourceLinks.nistUnits,
    ],
  },
  'rebar-weight-calculator': {
    summary: 'Learn how rebar size, length, quantity, and waste estimate pounds, US tons, and weight per foot.',
    metaDescription:
      'Use the Rebar Weight Calculator with #4 and #5 examples. See the weight formula, #3 to #8 weight chart, slab tips, lap-splice cautions, and hauling limits.',
    purpose:
      'The Rebar Weight Calculator estimates pounds and US tons from common US rebar sizes. It helps with ordering, hauling, and checking a cut list before you call a supplier.',
    intro:
      'Pick the bar size, enter how long each piece is, enter how many pieces you need, and add a waste cushion. The result is weight planning, not a structural design.',
    inputMatch: 'the bar size, length per piece, matching quantity, and waste cushion from your cut list or slab layout',
    logicNote:
      'For example, #4 rebar weighs about 0.668 lb per foot. Twelve 20-foot #4 bars make 240 feet. With 10% waste, that becomes 264 adjusted feet. Then 264 x 0.668 = 176.352 lb.',
    readIntro:
      'Use total pounds as the main buying and hauling number. Use adjusted length to check the cut list, weight per foot to check the bar size, and US tons when a supplier or truck limit is listed in tons.',
    mistakeIntro:
      'Most bad rebar-weight estimates come from using the wrong bar size, forgetting lap or cut waste, or treating weight math like an engineering plan.',
    sidecarText:
      'Open the Rebar Weight Calculator beside this guide. Try #4, 20 ft, 12 pieces, and 10% waste first; then replace the numbers with your cut list.',
    bestUsesIntro: 'Best when you already know the bar size and count, and you need a quick weight check before buying, hauling, or comparing supplier numbers.',
    referenceIntro:
      'These references help check rebar weight-per-foot values, lap-splice limits, unit conversions, and why the page stays focused on useful people-first ordering math.',
    enter: [
      'Choose the rebar size, such as #4 or #5. The size controls weight per foot.',
      'Enter the length of one bar or cut piece in feet.',
      'Enter how many matching pieces are in the set.',
      'Add waste for cuts, lap splices, layout changes, bent bars, and damaged pieces.',
    ],
    read: [
      'Total pounds is adjusted length times nominal weight per foot.',
      'Adjusted length includes length, quantity, and waste percent.',
      'Weight per foot lets you check whether the chosen bar size matches the supplier chart.',
      'US tons is total pounds divided by 2,000.',
    ],
    mistakes: [
      'Do not use weight as a substitute for reinforcement design.',
      'Do not ignore lap length, bar spacing, concrete cover, support chairs, and placement drawings.',
      'Do not enter a whole cut list as one bar unless every piece has the same length.',
      'Check supplier bundle weights, coatings, and mill tolerances when exact delivery weight matters.',
    ],
    extraSections: [
      {
        title: 'Quick #4 example',
        paragraphs: [
          'Say your slab list has twelve #4 bars, and each one is 20 feet long. That is 240 feet before waste.',
          'With 10% waste, the adjusted length is 264 feet. #4 is about 0.668 lb per foot, so the result is 176.352 lb, or about 0.088 US tons.',
        ],
      },
      {
        title: 'Small weight chart check',
        paragraphs: [
          'The calculator uses common US planning weights: #3 is 0.376 lb/ft, #4 is 0.668 lb/ft, #5 is 1.043 lb/ft, #6 is 1.502 lb/ft, #7 is 2.044 lb/ft, and #8 is 2.670 lb/ft.',
          'If your supplier chart shows a different product, use the supplier number for final ordering. Coatings and bundle packaging can make the delivery ticket slightly different from the simple steel-weight estimate.',
        ],
      },
      {
        title: 'Slab grid versus weight',
        paragraphs: [
          'If you already know the count and length, use this page. If you only know slab length, slab width, and bar spacing, use the Rebar Calculator first to estimate the grid.',
          'After you have the grid count, come back here with the bar size and cut length to estimate pounds or tons.',
        ],
      },
      {
        title: 'What this does not design',
        paragraphs: [
          'This page does not choose the correct bar size, spacing, cover, lap splice length, grade, or placement. Those choices can affect safety and inspections.',
          'CRSI notes that lap splice length depends on details such as concrete strength, rebar grade, size, and spacing, so use project drawings or a qualified professional when those details matter.',
        ],
      },
    ],
    sources: [
      sourceLinks.inchRebarWeight,
      sourceLinks.southernRebarWeight,
      sourceLinks.crsiLapSplices,
      sourceLinks.nistUnits,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'concrete-footing-calculator': {
    summary: 'Learn how footing length, width, depth, and waste become cubic feet, cubic yards, and bag counts.',
    metaDescription:
      'Use the Concrete Footing Calculator with a 30 ft by 16 in by 8 in example. See cubic yards, 60/80 lb bags, waste, cost checks, and code limits.',
    purpose:
      'The Concrete Footing Calculator estimates concrete for a straight rectangular footing. It is a material helper after you already know the footing size.',
    intro:
      'Enter the footing run in feet, then enter width and depth in inches. The calculator turns that cross-section into cubic feet, cubic yards, and rounded bag counts.',
    inputMatch: 'the straight footing run, planned footing width, planned footing depth, and waste cushion from your drawing, permit notes, or contractor plan',
    logicNote:
      'For example, a 30 ft footing that is 16 in wide and 8 in deep is 30 x 1.333 x 0.667 = about 26.67 cubic feet before waste. With 10% waste, it becomes 29.33 cubic feet, or about 1.09 cubic yards.',
    readIntro:
      'Use cubic yards when you are asking for ready-mix pricing. Use 60 lb or 80 lb bag counts only for small hand-mixed jobs because footings get heavy quickly.',
    mistakeIntro:
      'The easy mistake is using the calculator to pick the footing size. It only estimates concrete after the width and depth are already decided.',
    sidecarText:
      'Open the Concrete Footing Calculator beside this guide. Try 30 ft, 16 in, 8 in, and 10% waste first; then swap in your planned footing size.',
    bestUsesIntro:
      'Best for straight rectangular footing runs where the width and depth are already known and you need concrete volume or bag planning.',
    referenceIntro:
      'These references help check concrete volume math, bag-yield context, foundation safety limits, and unit conversions.',
    enter: [
      'Enter the total footing length in feet.',
      'Enter width and depth in inches because footing cross-sections are often measured that way.',
      'Add waste for uneven trench bottoms, overdigging, spillage, and a small ordering cushion.',
    ],
    read: [
      'Cubic yards is the ready-mix style volume.',
      'Cubic feet shows the smaller volume unit before converting to yards.',
      '60 lb and 80 lb bag counts are rounded up for small bagged-concrete jobs.',
      'Bag counts are material estimates, not a promise that hand-mixing is the best way to pour a long footing.',
    ],
    mistakes: [
      'Do not use the calculator to choose the footing size.',
      'Do not ignore frost depth, soil bearing, reinforcement, drainage, inspections, or local code.',
      'Do not forget that trench overdigging can increase concrete volume.',
      'Do not include slab, pier, column, or wall concrete unless you calculate those parts separately.',
    ],
    extraSections: [
      {
        title: 'Quick footing example',
        paragraphs: [
          'Say a footing run is 30 feet long, 16 inches wide, and 8 inches deep. Convert width and depth to feet first: 16 inches is 1.333 feet, and 8 inches is 0.667 feet.',
          'The raw volume is about 26.67 cubic feet. With 10% waste, the calculator shows about 29.33 cubic feet, 1.09 cubic yards, 49 eighty-pound bags, or 66 sixty-pound bags.',
        ],
      },
      {
        title: 'Why cubic yards matter',
        paragraphs: [
          'Ready-mix concrete is usually discussed in cubic yards. Bag counts are useful for small repairs, but a long footing can turn into dozens or hundreds of bags.',
          'Use the bag count as a reality check. If the number looks huge, a supplier quote may be safer and less exhausting than hand mixing.',
        ],
      },
      {
        title: 'Cost checks without guessing',
        paragraphs: [
          'The page does not invent a concrete price because local ready-mix, short-load fees, delivery, taxes, forms, rebar, labor, and tools can change the real cost.',
          'Use the cubic-yard result for supplier calls, or multiply the rounded bag count by your store price for a rough material-only check.',
        ],
      },
      {
        title: 'What this does not design',
        paragraphs: [
          'Footing width and depth are safety choices, not just calculator inputs. They can depend on loads, soil bearing value, frost protection, slope, drainage, reinforcement, and inspections.',
          'The 2024 IRC foundation chapter ties footing width and thickness to foundation tables and soil load-bearing values, so check local rules or a qualified professional before relying on a footing size.',
        ],
      },
    ],
    sources: [
      sourceLinks.inchConcreteFooting,
      sourceLinks.quickrete,
      sourceLinks.iccIrc2024Foundations,
      sourceLinks.nistUnits,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'concrete-column-calculator': {
    title: 'How to use the Concrete Column Calculator',
    summary: 'Learn how inside diameter, filled height, quantity, and waste estimate round column concrete.',
    metaDescription:
      'Use the Concrete Column Calculator for round piers and tube forms. Learn the cylinder formula, bag counts, 18 inch by 8 foot example, and what the estimate leaves out.',
    purpose:
      'The Concrete Column Calculator estimates concrete for round columns, piers, and tube forms using cylinder volume.',
    intro:
      'Round columns look simple, but one wrong number can change the bag count fast. The key is to use the inside diameter of the form, the filled height, and the number of matching columns.',
    logicNote:
      'The math is cylinder volume: pi times radius squared times height. The calculator converts the inside diameter from inches to feet, divides by two for radius, multiplies by filled height and quantity, then adds waste.',
    readIntro:
      'Use cubic yards for ready-mix checks and bag counts for small pours. If the column has a bell, wider footing, square base, or heavy reinforcement, estimate that part separately.',
    mistakeIntro:
      'Most column mistakes come from using outside tube diameter, forgetting waste, or treating a material estimate like a structural design.',
    enter: [
      'Enter the inside diameter of the round tube or form in inches, not the radius.',
      'Enter the filled concrete height in feet.',
      'Enter the number of matching round columns or piers.',
      'Add waste for form variation, overfill, small spills, and ordering cushion.',
    ],
    read: [
      'Cubic feet shows the adjusted volume after waste.',
      'Cubic yards is the same total divided by 27.',
      '60 lb and 80 lb bag counts are rounded up to whole bags.',
      'For example, three 18 inch columns filled 8 feet high with 10% waste need about 46.65 cubic feet, 1.73 cubic yards, and 78 eighty-pound bags.',
    ],
    mistakes: [
      'Do not enter outside tube diameter if the inside diameter is smaller.',
      'Do not forget wider footing bases, bell bottoms, anchor bolts, rebar cages, or form bracing.',
      'Do not use this as a reinforced-column design calculator.',
      'Check form size, filled height, frost depth, soil, inspections, and project drawings before buying concrete.',
    ],
    extraSections: [
      {
        title: 'Quick round pier example',
        paragraphs: [
          'Say you have three round piers, each with an 18 inch inside diameter and 8 feet of filled height. The radius is 9 inches, or 0.75 feet.',
          'One pier is about 14.14 cubic feet before waste. Three piers with 10% waste come out near 46.65 cubic feet, which is about 1.73 cubic yards.',
          'Using a common 0.60 cubic foot yield for an 80 lb bag, that rounds up to 78 eighty-pound bags. Always check the bag label because yields can vary.',
        ],
      },
      {
        title: 'When a column is not just a cylinder',
        paragraphs: [
          'This calculator is for the straight round part of a column or pier. It does not add a bell footing, flared base, square pad, pier cap, anchor hardware, or rebar cage.',
          'If your plan has one of those pieces, calculate it separately or use the takeoff from the designer, engineer, permit drawing, or contractor.',
        ],
      },
      {
        title: 'Why the limit note matters',
        paragraphs: [
          'Concrete volume is not the same thing as column design. Loads, soil, frost depth, reinforcement, inspection rules, and local code decide whether a pier is safe.',
          'Use this page to buy roughly the right amount of concrete. Use approved plans or a qualified professional to choose the actual pier size and reinforcement.',
        ],
      },
    ],
    sources: [
      sourceLinks.quickrete,
      sourceLinks.quickreteTubePillarFoundations,
      sourceLinks.maxiConcreteColumn,
      sourceLinks.nistUnits,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'post-hole-concrete-calculator': {
    title: 'How to use the Post Hole Concrete Calculator',
    summary: 'Learn how hole size, post size, quantity, and waste estimate concrete bags.',
    metaDescription:
      'Use the Post Hole Concrete Calculator for fence, deck, gate, and mailbox posts. Learn how post displacement, bag counts, waste, and limits work.',
    purpose:
      'The Post Hole Concrete Calculator estimates concrete around posts by using round hole volume and subtracting the post volume inside each hole.',
    intro:
      'Post holes are easy to undercount because the post takes up space, but the hole is still round. This tool estimates the concrete that fills the space around the post.',
    logicNote:
      'The calculator finds the round hole volume, subtracts the round post volume, multiplies by the number of holes, adds waste, converts to cubic yards, and rounds bag counts up.',
    readIntro:
      'Use the 80 lb bag count as the quick shopping number, then check cubic feet per hole if one hole looks too big or too small.',
    mistakeIntro:
      'The big mistakes are using the wrong hole depth, forgetting the post takes up space, and trusting the calculator to choose a safe depth for the job.',
    enter: [
      'Enter hole diameter and depth in inches.',
      'Enter the post diameter so the tool can subtract the space occupied by the post.',
      'Enter the number of matching holes and waste percent.',
    ],
    read: [
      '80 lb bags is the main quick shopping number for many small projects.',
      'Cubic yards and cubic feet show the total adjusted concrete volume.',
      'Concrete per hole helps you spot an unusually large or small entry.',
      'For example, six 12 inch by 30 inch holes with 4 inch posts and 10% waste need about 11.52 cubic feet, or 20 eighty-pound bags.',
    ],
    mistakes: [
      'Do not make the post diameter larger than the hole diameter.',
      'Do not ignore frost depth, gate loads, deck loads, or fence manufacturer rules.',
      'Do not forget gravel bases or special footing shapes if your plan requires them.',
      'Do not treat dry-setting, wet-mixing, or fast-setting instructions as the same for every product. Check the bag or manufacturer guide.',
    ],
    extraSections: [
      {
        title: 'Quick fence post example',
        paragraphs: [
          'Say you have six holes that are 12 inches wide and 30 inches deep. Each hole has a 4 inch post inside it, and you add 10% waste.',
          'The calculator subtracts the post volume, so the total concrete is about 11.52 cubic feet. That is about 0.43 cubic yards, or 20 eighty-pound bags.',
        ],
      },
      {
        title: 'Why post volume matters',
        paragraphs: [
          'If you fill the whole hole as if the post was not there, the estimate is high. The post is already occupying part of the hole.',
          'This matters more when you have many posts, larger posts, or deeper holes. It also helps when you are comparing bag counts before a store run.',
        ],
      },
      {
        title: 'What this does not decide',
        paragraphs: [
          'This page does not pick a safe hole depth or width. Fence height, gate size, deck loads, uplift, wind, soil, frost depth, drainage, and local code can all matter.',
          'Use the approved plan, product instructions, or local professional guidance for the actual hole size. Use this calculator to estimate concrete after those dimensions are known.',
        ],
      },
    ],
    sources: [
      sourceLinks.inchPostHoleConcrete,
      sourceLinks.quickrete,
      sourceLinks.quickreteSettingPosts,
      sourceLinks.quickreteSettingPostsPdf,
      sourceLinks.nistUnits,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'plywood-calculator': {
    summary: 'Learn how project area, 4x8 sheet size, waste, and price become plywood sheet count.',
    purpose:
      'The Plywood Calculator estimates how many plywood or sheet-good panels to buy for an area-based job, such as a floor, wall, roof deck, cabinet batch, or furniture project.',
    enter: [
      'Enter the total square feet you want to cover. Subtract big openings first if they should not get plywood.',
      'Enter sheet width and length in feet. Use 4 and 8 for a common full sheet, or the actual size printed on the panel you plan to buy.',
      'Add waste for cuts, damaged edges, saw kerf, layout choices, and mistakes. Add optional price per sheet if you want a rough material cost.',
    ],
    read: [
      'Sheets needed is rounded up because stores sell whole sheets, not exact square feet.',
      'Adjusted area includes the waste percent before the calculator divides by sheet coverage.',
      'Total coverage bought shows how much area the rounded sheet count can cover before cut-layout, seams, and code rules change the plan.',
      'For example, 420 square feet with 4 x 8 sheets and 10% waste becomes 462 adjusted square feet. A 4 x 8 sheet covers 32 square feet, so 462 / 32 = 14.4375 and the calculator rounds up to 15 sheets.',
    ],
    mistakes: [
      'Do not treat area math as a cut-layout plan. Cabinets, shelves, and furniture need part sizes and grain direction checked on a sheet layout.',
      'Do not ignore panel direction, seams, framing layout, joist spacing, thickness, grade, fastener rules, or local code.',
      'Do not use a generic plywood sheet when the project needs rated roof sheathing, subfloor panels, exterior exposure rating, hardwood plywood, MDF, OSB, or another specialty sheet good.',
      'Do not set waste to zero unless the project is very simple and you already know the offcuts will fit somewhere useful.',
    ],
    extraSections: [
      {
        title: 'Quick 4x8 sheet example',
        paragraphs: [
          'A common 4 x 8 plywood sheet covers 32 square feet before cuts. If your subfloor area is 420 square feet and you add 10% waste, the adjusted area is 462 square feet.',
          'Divide 462 by 32 and you get 14.4375. Since you cannot buy 0.4375 of a sheet, the calculator rounds up to 15 sheets, which gives 480 square feet of bought coverage before layout limits.',
        ],
      },
      {
        title: 'Roof, floor, wall, and cabinet notes',
        paragraphs: [
          'For roofs, floors, and walls, use the calculator only after you know the square footage. The page does not choose panel thickness, span rating, clip spacing, nail pattern, weather exposure, or inspection requirements.',
          'For cabinets and furniture, the sheet count is only a budget check. A real cut list needs each part size, grain direction, kerf, edge banding, and which leftovers can actually be reused.',
        ],
      },
      {
        title: 'What this does not decide',
        paragraphs: [
          'This tool does not tell you which plywood grade to buy. Sanded plywood, hardwood plywood, sheathing, OSB, MDF, and project panels can all behave differently and fit different jobs.',
          'Use the product label, project plans, local code, and installer or builder guidance for rated sheathing, subfloors, structural work, exterior exposure, and fastening details. Use this calculator for the rough sheet count after those choices are known.',
        ],
      },
    ],
    sources: [
      sourceLinks.inchPlywood,
      sourceLinks.apaPlywood,
      sourceLinks.homeDepotPlywoodTypes,
      sourceLinks.nistUnits,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'insulation-calculator': {
    summary: 'Learn how square footage, openings, pack coverage, waste, and R-value planning work together.',
    purpose:
      'The Insulation Calculator estimates package count after you choose an insulation product. It helps with quantity, not code approval or product selection.',
    enter: [
      'Enter the area before openings, then subtract windows, doors, hatches, or other spaces.',
      'Enter coverage per pack from the product label for the chosen thickness or R-value.',
      'Add waste for cutting, odd cavities, and fitting mistakes.',
    ],
    read: [
      'Packs needed is rounded up to whole packages.',
      'Adjusted area shows net area after openings and waste.',
      'Total coverage bought helps compare the rounded package count with the area needed.',
      'For example, a 1,200 square foot attic using packs that cover 48 square feet each with 10% waste needs 28 packs.',
    ],
    mistakes: [
      'Do not confuse square-foot coverage with R-value.',
      'Do not skip air sealing, vapor control, ventilation, moisture checks, fire rules, or local code.',
      'Do not use one pack coverage number for every R-value. Thicker insulation often covers less area per pack.',
      'Use the product label, local code, and climate guidance before choosing the actual insulation.',
    ],
    extraSections: [
      {
        title: 'What R-value means',
        paragraphs: [
          'R-value describes resistance to heat flow. A higher R-value usually slows heat movement more, but the right target depends on the room, climate, assembly, product type, and code.',
          'This tool does not pick the R-value. It estimates how many packs you need after you pick a product and know the product coverage.',
        ],
      },
      {
        title: 'Quick square-foot example',
        paragraphs: [
          'Say an attic is 1,200 square feet. The insulation pack says it covers 48 square feet at the R-value you picked. You add 10% waste for cuts and awkward spots.',
          'The adjusted area is 1,200 x 1.10 = 1,320 square feet. Then 1,320 / 48 = 27.5, so you round up and buy 28 packs.',
        ],
      },
      {
        title: 'Why the product label matters',
        paragraphs: [
          'Insulation coverage is not one fixed number. A roll, batt pack, or blown-in bag may cover a different square-foot area at R-13, R-30, R-38, or R-49.',
          'That is why the calculator asks for coverage per pack instead of guessing. The FTC says R-value information should be available before you buy, and ENERGY STAR recommends choosing R-value by climate and home location.',
        ],
      },
    ],
    sources: [
      sourceLinks.doeInsulation,
      sourceLinks.energyStarInsulationRValues,
      sourceLinks.energyStarAtticInsulation,
      sourceLinks.ftcInsulationBuying,
      sourceLinks.nistUnits,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'countertop-calculator': {
    summary:
      'Learn how countertop run length, depth, backsplash, cutouts, waste, and price estimate kitchen countertop square footage.',
    purpose:
      'The Countertop Calculator estimates rough material area for kitchen counters, vanity tops, islands, peninsulas, and backsplash pieces.',
    enter: [
      'Enter the combined countertop run length in feet. For L-shaped counters with the same depth, add the straight runs together.',
      'Enter finished depth in inches. If an island, peninsula, or vanity has a different depth, estimate that section separately.',
      'Enter backsplash run length and height only when the backsplash uses the same material.',
      'Enter cutout square feet only when you want a rough material-area subtraction, not a labor-price adjustment.',
    ],
    read: [
      'Adjusted area is the square footage after adding backsplash, subtracting cutouts, and adding waste.',
      'Top area and backsplash area show the pieces separately.',
      'Estimated cost multiplies adjusted area by your price per square foot when entered.',
    ],
    mistakes: [
      'Do not treat this as a fabricator quote.',
      'Do not forget seams, overhangs, edge profiles, sink cutouts, slab minimums, delivery, templates, or install labor.',
      'Ask the countertop supplier how they price cutouts and leftover slab material.',
    ],
    extraSections: [
      {
        title: 'Quick kitchen countertop example',
        paragraphs: [
          'Say a kitchen has 18 feet of counter at 25.5 inches deep, an 18 foot backsplash that is 4 inches high, 4 square feet of sink and cooktop cutouts, and 10% waste.',
          'Top area is 18 x 25.5 / 12 = 38.25 square feet. Backsplash area is 18 x 4 / 12 = 6 square feet. After subtracting 4 square feet of cutouts, the net area is 40.25 square feet. With 10% waste, the planning estimate is 44.275 square feet.',
        ],
      },
      {
        title: 'L-shaped counters, islands, and different depths',
        paragraphs: [
          'For a simple L-shape where both legs use the same depth, add the two straight lengths and enter the combined run. A 10 foot leg plus an 8 foot leg becomes 18 feet.',
          'If part of the kitchen is deeper, such as a 42 inch island or a peninsula, run that section separately. Add the adjusted square feet from each result before comparing material prices.',
        ],
      },
      {
        title: 'Why quotes can beat the square-foot number',
        paragraphs: [
          'The calculator is area math. A real countertop quote can include slab layout, seam placement, pattern matching, edge profiles, sink type, cutout labor, templating, removal, delivery, installation, and minimum slab purchase rules.',
          'Use the result to compare early options, then ask the fabricator how they handle cutouts, backsplash, leftover material, edge upgrades, and minimum charges.',
        ],
      },
    ],
    sources: [
      sourceLinks.lowesCountertopGuide,
      sourceLinks.slabWiseCountertopSquareFeet,
      sourceLinks.nistUnits,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'sod-calculator': {
    summary: 'Learn how lawn area, roll coverage, pallet size, waste, and price estimate sod rolls.',
    purpose:
      'The Sod Calculator estimates rolls, slabs, or pieces of sod, converts that count into pallets, and gives a rough material cost when you enter a price per roll.',
    enter: [
      'Enter the final lawn area in square feet after grading and edging.',
      'Enter coverage per roll or slab from the sod supplier, garden center, or delivery quote.',
      'Enter rolls per pallet, waste for trimming, and price per roll when you want a rough material cost.',
    ],
    read: [
      'Rolls needed is rounded up to whole rolls or slabs.',
      'Adjusted area includes the waste percent.',
      'Pallet coverage is the roll coverage multiplied by rolls per pallet.',
      'Pallets is rounded up from rolls per pallet.',
      'Estimated cost only uses the roll price you entered.',
    ],
    mistakes: [
      'Do not forget curved edges, sidewalks, sprinkler heads, seams, slopes, and repair patches.',
      'Do not measure before final grading if the lawn edge will change.',
      'Do not assume every pallet covers the same square footage. Roll size and rolls per pallet vary by supplier and grass type.',
      'Check pallet minimums, delivery rules, soil prep, irrigation fixes, installation labor, and watering instructions before ordering.',
    ],
    extraSections: [
      {
        title: 'Quick sod roll example',
        paragraphs: [
          'For a 1,800 ft2 lawn with 10 ft2 rolls and 5% waste, the adjusted area is 1,890 ft2. Divide by 10 ft2 per roll to get 189 rolls. With 50 rolls per pallet, that rounds to 4 pallets. At $4.50 per roll, the rough material cost is $850.50.',
        ],
      },
      {
        title: 'Rolls, slabs, and pallets are supplier numbers',
        paragraphs: [
          'The calculator works for rolls, slabs, and pieces because the key input is square feet per piece. A pallet is just a packaging count, so use the supplier rolls-per-pallet number instead of assuming one fixed pallet size.',
        ],
      },
      {
        title: 'What the estimate does not include',
        paragraphs: [
          'The cost result does not include delivery, old grass removal, grading, soil amendments, irrigation repairs, installation labor, minimum-order fees, or extra watering. Treat the result as a material planning number before a real quote.',
        ],
      },
    ],
    sources: [
      sourceLinks.inchSod,
      sourceLinks.tallyardSodCalculator,
      sourceLinks.sodSolutionsPalletCoverage,
      sourceLinks.calcShedSodCalculator,
      sourceLinks.nistUnits,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'wall-stud-calculator': {
    summary: 'Learn how wall length, stud spacing, openings, plate rows, board length, and waste estimate framing boards.',
    purpose:
      'The Wall Stud Calculator estimates a simple stud-and-plate material count for a straight wall. It is useful for rough planning before a real framing plan or lumber takeoff.',
    enter: [
      'Enter the straight wall length and planned framing height in feet.',
      'Enter on-center stud spacing in inches, commonly 16 or 24 when the project plan allows it.',
      'Add openings, extra corner studs, plate rows, board length, and waste for cuts or damaged boards.',
    ],
    read: [
      'Layout studs is the spacing count before openings, corner allowance, and waste.',
      'Total pieces combines vertical studs with plate pieces.',
      'Vertical studs with waste includes layout studs, opening allowance, corner allowance, and waste.',
      'Linear feet with waste helps compare the board count with the total lumber length.',
    ],
    mistakes: [
      'Do not treat this as a structural framing plan.',
      'Do not treat the opening count as a full header, king-stud, jack-stud, sill, or cripple-stud takeoff.',
      'Do not forget blocking, bracing, sheathing, treated plates, fasteners, metal-stud gauge or track, fire-rated assemblies, or code rules.',
      'Check project drawings before buying lumber for load-bearing, exterior, tall, or engineered walls.',
    ],
    extraSections: [
      {
        title: 'Quick 24 ft wall example',
        paragraphs: [
          'For a 24 ft wall at 16 in on-center spacing, the layout count is 19 studs. Add 2 openings at 2 extra studs each and 4 extra corner studs to get 27 vertical studs before waste. With 10% waste, that rounds to 30 vertical studs. Two plate rows with 8 ft boards add 6 plate pieces, so the total is 36 boards.',
        ],
      },
      {
        title: 'Openings are only an allowance',
        paragraphs: [
          'The opening field is deliberately simple. It helps you remember that windows and doors need extra framing, but it does not size headers or count every jack, king, sill, cripple, trimmer, or blocking piece from a real drawing.',
        ],
      },
      {
        title: 'Metal studs and real plans',
        paragraphs: [
          'The spacing math can help with a rough metal-stud count, but metal framing also needs track, gauge, height limits, fasteners, and load or fire-rating details. Use the calculator as a first count, then verify the plan before ordering.',
        ],
      },
    ],
    sources: [
      sourceLinks.inchFraming,
      sourceLinks.calcSummitFramingCalculator,
      sourceLinks.homeProjectStudCalculator,
      sourceLinks.nistUnits,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'board-foot-calculator': {
    summary: 'Learn how lumber thickness, width, length, and quantity turn into board feet.',
    metaDescription:
      'Use the Board Foot Calculator with a 1 x 6 x 8 ft example. See the formula, actual vs nominal size cautions, 4/4 lumber notes, pricing, and log-rule limits.',
    purpose:
      'The Board Foot Calculator estimates sawn-lumber volume. It is useful when comparing rough boards, sawmill lumber, hardwood pricing, or a small material list.',
    intro:
      'Board feet sound weird until you picture one board foot as a board 1 inch thick, 12 inches wide, and 12 inches long. The calculator just scales that idea up for your real board size.',
    inputMatch: 'thickness in inches, width in inches, length in feet, and quantity',
    logicNote:
      'The calculator multiplies thickness by width by length, then divides by 12 because thickness and width are inches while length is feet. If you convert length to inches first, the same idea is divided by 144 cubic inches.',
    readIntro:
      'Read total board feet as the lumber-volume number to compare with a board-foot price. Read board feet each when you want to check one board before multiplying by quantity.',
    mistakeIntro:
      'The easy mistake is using a store label like 1x6 when the seller actually prices by measured rough thickness, surfaced thickness, or a local rule. Ask whether to use actual or nominal dimensions before money changes hands.',
    sidecarText:
      'Open the Board Foot Calculator beside this guide. Try 1 inch thick, 6 inches wide, 8 feet long, and quantity 4 first. The answer should be 16 board feet.',
    bestUsesIntro:
      'Use this guide for rough lumber, hardwood boards, small sawmill orders, slab checks, and board-foot price comparisons. Do not use it as a log scale or a structural design check.',
    referenceIntro:
      'These references help separate simple sawn-lumber board feet from forestry log rules, which can change by region and measurement method.',
    enter: [
      'Enter thickness and width in inches. Use actual measured size when the seller gives it.',
      'Enter length in feet. A board 8 feet long uses 8, not 96.',
      'Enter quantity when you have several boards with the same dimensions.',
    ],
    read: [
      'Four 1 in x 6 in x 8 ft boards equal 16 board feet.',
      'One 2 in x 18 in x 7 ft slab equals 21 board feet.',
      'The formula divisor is 12 because thickness and width are inches while length is still feet.',
    ],
    mistakes: [
      'Do not confuse nominal size with actual measured size unless the seller tells you which to use.',
      'Do not treat board feet as weight or structural strength.',
      'Allow for defects, milling, waste, species, grade, and moisture content.',
      'Do not use this simple board calculator as a Doyle, Scribner, or International log-rule calculator.',
    ],
    extraSections: [
      {
        title: 'Example: four 1 x 6 boards',
        paragraphs: [
          'For one board, multiply 1 inch thick by 6 inches wide by 8 feet long. That gives 48, then 48 divided by 12 equals 4 board feet.',
          'With 4 matching boards, multiply 4 board feet by 4 boards. The total is 16 board feet.',
        ],
      },
      {
        title: 'Actual size vs nominal size',
        paragraphs: [
          'A lumber label is not always the exact measured size. Rough hardwood, surfaced lumber, and home-center construction boards can be handled differently.',
          'If the seller prices by board foot, ask which thickness and width they use. That one question can stop a small estimate from becoming a wrong bill.',
        ],
      },
      {
        title: 'Why this is not a log-rule calculator',
        paragraphs: [
          'This page estimates sawn lumber that already has board dimensions. Logs are different because saw kerf, slabs, taper, shrinkage, and local log rules change the yield.',
          'The USDA Forest Service notes that many log rules exist, and University of Tennessee Extension shows that Doyle and International 1/4-inch conversions vary by tree size. Use a forester, sawmill, or local log rule for standing timber or round logs.',
        ],
      },
    ],
    sources: [
      sourceLinks.ukBoardFoot,
      sourceLinks.usForestServiceLogRules,
      sourceLinks.tennesseeBoardFootRules,
      sourceLinks.nistUnits,
    ],
  },
  'cubic-yard-calculator': {
    summary: 'Learn how feet, inch depth, and waste become cubic yards.',
    purpose:
      'The Cubic Yard Calculator is the general volume helper behind many material estimates. It converts length, width, depth in inches, and waste into cubic feet, cubic yards, and cubic meters.',
    enter: [
      'Enter length and width in feet.',
      'Enter average depth in inches. A 3 inch layer is 0.25 foot in the formula.',
      'Add waste when material will settle, compact, spill, or need rounding up.',
    ],
    read: [
      'Cubic feet shows the raw rectangular volume before yard conversion.',
      'Cubic yards is the bulk material number many soil, sand, mulch, gravel, and fill suppliers use. The calculator divides adjusted cubic feet by 27.',
      'Cubic meters appears for conversion context, using the NIST cubic-foot conversion.',
      'Waste added shows the extra volume included before you talk with a supplier.',
      'A 20 ft by 10 ft area at 3 inches deep is 50 cubic feet before waste and about 1.94 cubic yards with 5% waste.',
    ],
    mistakes: [
      'Do not mix inches, feet, and yards without converting them.',
      'Do not ignore uneven depth or sloped ground.',
      'Do not assume loose material, compacted material, bags, and tons are the same thing.',
      'Supplier minimums, half-yard rounding, truck delivery rules, and bag labels can change the purchase amount.',
    ],
    sources: [sourceLinks.nistConversionFactors, sourceLinks.nistUnits, sourceLinks.googleHelpfulContent],
  },
  'pool-volume-calculator': {
    summary: 'Learn how pool shape, measurements, and average depth become gallons.',
    purpose:
      'The Pool Volume Calculator estimates U.S. gallons from simple pool measurements. It is useful for rough chemical, fill, heater, pump, and filter context, but it is still an estimate.',
    enter: [
      'Choose rectangle, round, or oval pool shape.',
      'Enter length and width, or use the diameter in both fields for a round pool.',
      'Enter average water depth, especially when the pool has shallow and deep ends.',
    ],
    read: [
      'Gallons is the main volume estimate.',
      'Cubic feet shows the intermediate volume before gallon conversion.',
      'Shape factor shows whether the calculator used a rectangle factor of 1 or the rounded-shape factor.',
      'Gallons per cubic foot shows the 7.48052 conversion used for U.S. gallons.',
    ],
    mistakes: [
      'Do not use maximum depth when the pool has a shallow end. Use average water depth.',
      'Do not ignore benches, steps, curves, and waterline height.',
      'Do not measure from the top of the wall if the waterline sits lower.',
      'Use measured water testing and product labels before making chemical dosing decisions.',
    ],
    extraSections: [
      {
        title: 'Quick 24 by 12 pool example',
        paragraphs: [
          'A rectangular pool that is 24 feet long, 12 feet wide, and 4.5 feet deep on average has 1,296 cubic feet of water.',
          'Multiply 1,296 by 7.48052 gallons per cubic foot. The estimate is about 9,695 U.S. gallons.',
        ],
      },
      {
        title: 'Average depth check',
        paragraphs: [
          'For a sloped pool, average depth usually means shallow depth plus deep depth, then divided by 2. A pool that runs from 3 feet to 6 feet averages 4.5 feet.',
          'If the pool has a flat shallow section, a sudden deep hopper, steps, benches, or a freeform shape, break it into sections or treat the answer as a rough starting point.',
        ],
      },
    ],
    sources: [
      sourceLinks.poolVolumeReference,
      sourceLinks.bulkCalculatorPoolVolume,
      sourceLinks.calcipediaPoolVolume,
      sourceLinks.nistConversionFactors,
      sourceLinks.nistUnits,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'sand-calculator': {
    summary: 'Learn how length, width, sand depth, density, and waste become cubic yards and tons.',
    metaDescription:
      'Use the Sand Calculator with paver bedding, sandbox, bag, tons, and square-foot examples. See depth, density, waste, and supplier limits.',
    purpose:
      'The Sand Calculator estimates volume and tonnage for a rectangular sand layer. It is useful for paver bedding, leveling layers, sandboxes, pool-base checks, aquarium-bed rough math, and small base projects.',
    intro:
      'Sand estimates usually go wrong because the depth is guessed, the sand is wet, or a bag order gets mixed up with a bulk ton order. Measure the rectangle first, then use density as an estimate, not a promise.',
    inputMatch: 'the sand bed length, width, depth, tons per cubic yard, and waste percent',
    logicNote:
      'The calculator turns depth inches into feet, finds cubic feet, adds waste, converts to cubic yards, then multiplies by tons per cubic yard.',
    readIntro:
      'Read cubic yards as the bulk volume number. Read estimated tons as the supplier conversation starter, because dry sand, wet sand, play sand, concrete sand, and compacted sand can weigh differently.',
    mistakeIntro:
      'The big mistake is treating every sand type like it has one fixed weight. Inch Calculator lists dry sand around 1.3 to 1.5 tons per cubic yard and wet sand around 1.5 to 1.7 tons, so supplier density matters.',
    sidecarText:
      'Open the Sand Calculator beside this guide. Try 10 feet by 10 feet, 1 inch deep, 10 percent waste, and 1.35 tons per cubic yard first.',
    bestUsesIntro:
      'Use this guide when you need a quick material estimate for a rectangular layer before checking the bag label, supplier density, delivery minimum, or project instructions.',
    referenceIntro:
      'These references back up the volume math, density caution, and cubic-yard conversion behind the calculator.',
    enter: [
      'Enter length and width in feet.',
      'Enter sand depth in inches. For a paver bedding layer, that might be around 1 inch. For a sandbox, it might be much deeper.',
      'Enter tons per cubic yard from your supplier when you have it, then add waste if needed.',
    ],
    read: [
      'A 10 ft by 10 ft area at 1 inch deep is 8.33 cubic feet before waste.',
      'With 10% waste, that becomes 9.17 cubic feet, or about 0.34 cubic yards.',
      'At 1.35 tons per cubic yard, the estimate is about 0.46 tons.',
      'Density used reminds you how weight was estimated.',
    ],
    mistakes: [
      'Do not assume dry and wet sand weigh the same.',
      'Do not forget compaction and leveling loss.',
      'Do not use this page as a full paver plan. Base gravel, bedding sand, joint sand, edge restraints, slope, drainage, and compaction are separate checks.',
      'Do not use pool or aquarium search intent as water-volume advice. This page estimates sand material, not water gallons.',
      'Ask the supplier for material-specific density and delivery minimums.',
    ],
    extraSections: [
      {
        title: 'How To Read A Small Paver-Sand Example',
        paragraphs: [
          'Say the bedding area is 10 feet by 10 feet and the sand layer is 1 inch deep. The raw volume is 8.33 cubic feet.',
          'Add 10% waste for leveling and spreading loss. That gives about 9.17 cubic feet, or 0.34 cubic yards. At 1.35 tons per cubic yard, the rough weight is about 0.46 tons.',
          'If you buy 50 lb bags, convert 0.46 tons to about 920 lb, then divide by 50. That is about 19 bags before you check the bag label.',
        ],
      },
      {
        title: 'Bags, Tons, And Supplier Density',
        paragraphs: [
          'The calculator does not output bag count because bags vary by weight and volume. Use the result as a bridge: tons help with bulk orders, cubic feet help with bag-volume labels, and pounds help with bag-weight labels.',
          'If a supplier gives you a sand density, use that value. If not, keep the result as a planning estimate and expect moisture, compaction, and sand type to move the real order.',
        ],
      },
      {
        title: 'Pool, Aquarium, And Round-Area Limits',
        paragraphs: [
          'For pool sand, this page can estimate a rectangular sand base or help check a supplier density. It does not estimate pool water volume.',
          'For aquarium sand, convert tank length and width to feet and use the desired sand depth in inches. Then check the product label because aquarium sand is usually bought by bag.',
          'For a round area, calculate the circle area first or split the project into simpler pieces. The live Sand Calculator itself expects a rectangular length and width.',
        ],
      },
    ],
    sources: [
      sourceLinks.inchSandCalculator,
      sourceLinks.calcShedSandCalculator,
      sourceLinks.calculatorSoupCubicYards,
      sourceLinks.nistUnits,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'soil-calculator': {
    summary: 'Learn how bed area, soil depth, and settling extra turn into cubic yards, cubic feet, and bag counts.',
    metaDescription:
      'Use the Soil Calculator with a 120 ft2 raised-bed example. See cubic yards, cubic feet, bag counts, extra percent, and topsoil limits.',
    purpose:
      'The Soil Calculator estimates garden soil, raised bed top-offs, topsoil, and potting soil volume. It reports bulk cubic yards, cubic feet, and common retail bag counts.',
    intro:
      'Soil estimates usually go wrong because the depth means the whole bed height in one person\'s head and only the top-off layer in someone else\'s. Start with the square footage, then enter only the soil depth you still need to add.',
    inputMatch: 'the bed area in square feet, the added soil depth in inches, and the extra percent for settling or uneven spreading',
    logicNote:
      'The calculator turns inches into feet, multiplies by square feet, adds extra percent, converts cubic feet to cubic yards, then rounds up 1.5-cubic-foot and 2-cubic-foot bag counts.',
    readIntro:
      'Read cubic yards as the bulk-order number. Read cubic feet and bag counts when you are comparing retail bags, because bag sizes and fill can vary by product.',
    mistakeIntro:
      'The big mistake is using the full raised-bed height when the bed is already partly filled. Existing soil, compost, drainage layers, moisture, settling, and the exact bag label can all move the final buy.',
    sidecarText:
      'Open the Soil Calculator beside this guide. Try 120 square feet, 4 inches of added soil, and 10 percent extra first.',
    bestUsesIntro:
      'Use this guide when you need a planning number for raised beds, garden top-offs, lawn topdress, planters, or comparing bulk topsoil with bagged soil.',
    referenceIntro:
      'These references back up the volume math, competitor intent, cubic-yard conversion, and helpful-content review behind the calculator.',
    enter: [
      'Enter the bed, planter, or lawn patch area in square feet. For odd shapes, calculate each area first and add them together.',
      'Enter only the soil depth you want to add in inches. A top-off depth is different from the full height of a raised bed.',
      'Add extra percent for settling, uneven beds, moisture or fill differences, spreading loss, or a safer order.',
    ],
    read: [
      'A 120 ft2 raised-bed top-off at 4 inches deep is 40 cubic feet before extra.',
      'With 10% extra, the estimate becomes 44 cubic feet.',
      '44 cubic feet is about 1.63 cubic yards.',
      'The same example rounds up to 30 bags at 1.5 cubic feet each or 22 bags at 2 cubic feet each.',
    ],
    mistakes: [
      'Do not enter the full raised-bed height when you only need to top off the bed.',
      'Do not forget that loose soil can settle after watering and spreading.',
      'Do not mix compost, potting mix, fill material, and topsoil assumptions without checking the actual product.',
      'Do not treat bag counts as exact. Retail bag volume, moisture, fill, and product mix can vary.',
      'Check delivery minimums, plant needs, drainage, and existing soil before using the number as a final order.',
    ],
    extraSections: [
      {
        title: 'Quick Raised Bed Example',
        paragraphs: [
          'Say the area is 120 square feet and you want to add 4 inches of soil. Four inches is one-third of a foot, so the raw volume is 120 x 0.333, or 40 cubic feet.',
          'Add 10% extra for settling and uneven spreading. That gives 44 cubic feet, which is about 1.63 cubic yards.',
          'If you buy 2-cubic-foot bags, round 44 divided by 2 up to 22 bags. If the bags are 1.5 cubic feet, round 44 divided by 1.5 up to 30 bags.',
        ],
      },
      {
        title: 'Raised Beds, Topsoil, And Potting Soil',
        paragraphs: [
          'The volume math is the same for topsoil, garden soil, and potting soil, but the product choice is not. A vegetable bed, planter, lawn low spot, and deep raised bed may need different mixes.',
          'If the bed is partly full, use only the missing depth. If you are building layers, calculate each layer separately instead of pretending one soil number covers compost, fill, drainage, and planting mix.',
        ],
      },
      {
        title: 'Bags Versus Bulk Delivery',
        paragraphs: [
          'Cubic yards are usually easier for bulk topsoil delivery. Cubic feet are easier when you are standing in front of bag labels.',
          'Before buying, compare the calculator result with the exact bag volume, delivery minimum, return policy, moisture level, and how much extra you can store or use elsewhere.',
        ],
      },
    ],
    sources: [
      sourceLinks.calcShedTopsoilCalculator,
      sourceLinks.calcSummitTopsoilCalculator,
      sourceLinks.vastCalcSoilCalculator,
      sourceLinks.nistUnits,
      sourceLinks.googleHelpfulContent,
    ],
  },
  'asphalt-calculator': {
    summary: 'Learn how pavement length, width, compacted depth, density, and waste turn into asphalt tons.',
    metaDescription:
      'Use the Asphalt Calculator with a 30 ft by 12 ft by 3 in example. See cubic yards, tons, density, waste, and compaction limits.',
    purpose:
      'The Asphalt Calculator estimates rough hot-mix asphalt quantity from pavement dimensions and compacted depth. It is best for early planning before a paving contractor measures the job.',
    intro:
      'Asphalt estimates go wrong fast when the depth is loose depth instead of compacted depth. Start with the finished thickness, then check the density your supplier wants you to use.',
    inputMatch: 'the paved length, paved width, compacted depth, tons per cubic yard, and waste percent',
    logicNote:
      'The calculator turns inches into feet, finds cubic feet, adds waste, converts to cubic yards, then multiplies by tons per cubic yard.',
    readIntro:
      'Read tons as the rough ordering number. Read cubic yards and cubic feet as the volume behind that number, so you can spot a bad density assumption before calling a supplier.',
    mistakeIntro:
      'The big mistake is mixing loose depth, compacted depth, and supplier density in one estimate. Asphalt Institute notes that in-place asphalt mixture commonly weighs about 142 to 148 pounds per cubic foot, so the default 2 tons per cubic yard is only a planning shortcut.',
    sidecarText:
      'Open the Asphalt Calculator beside this guide. Try 30 feet long, 12 feet wide, 3 inches compacted depth, 2 tons per cubic yard, and 5 percent waste first.',
    bestUsesIntro:
      'Use this guide for driveway sections, parking pads, patch planning, and checking whether a paving quote feels close before you ask for a site measurement.',
    referenceIntro:
      'These references explain asphalt quantity, density, compaction, and why a real paving job needs project-specific measurements.',
    enter: [
      'Enter pavement length and width in feet.',
      'Enter compacted asphalt depth in inches, not the loose depth before rolling.',
      'Enter tons per cubic yard from the supplier, or use 2 only as a rough hot-mix planning number.',
    ],
    read: [
      'A 30 ft by 12 ft section at 3 inches compacted depth is 90 cubic feet before waste.',
      'With 5 percent waste, that becomes 94.5 cubic feet, or 3.5 cubic yards.',
      'At 2 tons per cubic yard, the estimate is 7 tons.',
    ],
    mistakes: [
      'Do not use this as a paving specification or contractor measurement.',
      'Do not ignore base condition, lift thickness, compaction, mix type, and plant minimums.',
      'Ask a paving professional or supplier for project-specific density and ordering guidance.',
      'Do not use loose asphalt depth unless your supplier specifically tells you how to convert it.',
    ],
    extraSections: [
      {
        title: 'Example: 30 ft by 12 ft driveway section',
        paragraphs: [
          'A 30 ft by 12 ft section has 360 square feet of area. At 3 inches compacted depth, that is 90 cubic feet before waste.',
          'Add 5 percent waste and the volume becomes 94.5 cubic feet. Divide by 27 and you get 3.5 cubic yards. At 2 tons per cubic yard, the result is 7 tons.',
        ],
      },
      {
        title: 'Why compacted depth matters',
        paragraphs: [
          'The calculator is asking for the finished depth after rolling. Loose material can shrink during compaction, so loose depth and compacted depth are not the same thing.',
          'Compaction quality also affects pavement life. Poor density can lead to problems like rutting, raveling, and moisture damage, so a real paving job needs more than calculator math.',
        ],
      },
      {
        title: 'Why the density box is not a tiny detail',
        paragraphs: [
          'Asphalt Institute says in-place asphalt mixture commonly weighs about 142 to 148 pounds per cubic foot. That works out close to 2 tons per cubic yard.',
          'Your local mix, recycled material, temperature, and supplier practice can still change the number. Use the supplier density when you have it.',
        ],
      },
    ],
    sources: [
      sourceLinks.asphaltInstituteQuantity,
      sourceLinks.pavementInteractiveCompaction,
      sourceLinks.napaEngineeringAsphalt,
      sourceLinks.nistUnits,
    ],
  },
  'wind-chill-calculator': {
    summary: 'Learn how the NWS wind chill formula estimates feels-like cold from air temperature and wind speed.',
    metaDescription:
      'Learn how to use the Wind Chill Calculator with Fahrenheit temperature, mph wind speed, NWS formula limits, examples, and cold-weather cautions.',
    purpose:
      'The Wind Chill Calculator combines air temperature and wind speed to estimate how cold exposed skin may feel in cold, windy weather.',
    intro:
      'Use it when the air is 50 F or colder and the wind is stronger than a light breeze. The result helps you compare cold conditions before you stand outside, wait for a bus, walk a dog, or plan a short outdoor task.',
    inputMatch:
      'the actual Fahrenheit air temperature and the wind speed in miles per hour for the place and time you are checking',
    logicNote:
      'The National Weather Service formula is built for cold air and meaningful wind. It does not make objects colder than the real air temperature, and it does not replace local frostbite or winter-weather alerts.',
    readIntro:
      'Read the Fahrenheit wind chill first because that is the main feels-like number. Then use the Celsius line if you need metric context, and compare the original air temperature with the result so you can see how much the wind changed the feel.',
    mistakeIntro:
      'Wind chill mistakes usually come from using the formula outside its range, treating it like a thermometer reading, or ignoring local safety alerts.',
    sidecarText:
      'Open the Wind Chill Calculator beside this guide. Try 30 F and 15 mph first, then replace those values with the forecast temperature and wind speed you actually have.',
    bestUsesIntro:
      'Use this guide when you need a quick cold-weather estimate, not a full safety decision. These are the jobs the calculator is best at.',
    enter: [
      'Enter air temperature in Fahrenheit.',
      'Enter wind speed in miles per hour.',
      'Calculate to see wind chill in Fahrenheit and Celsius.',
    ],
    read: [
      'The main answer is the wind chill temperature.',
      'Celsius gives metric context when you need it.',
      'Air temperature and wind speed confirm what went into the formula.',
      'A result colder than the air temperature means wind is increasing exposed-skin heat loss.',
    ],
    mistakes: [
      'Do not use wind chill for warm weather, calm air, or wind speeds at or below 3 mph.',
      'Do not ignore local frostbite and cold-weather warnings.',
      'Remember wind chill affects people, not the actual temperature of objects.',
      'Do not use the number as a guarantee that bare skin is safe for a certain number of minutes.',
    ],
    extraSections: [
      {
        title: 'Example: 30 F with a 15 mph wind',
        paragraphs: [
          'A 30 F day might sound only a little below freezing, but a 15 mph wind changes the feel. Enter 30 for temperature and 15 for wind speed.',
          'The calculator gives about 19.0 F wind chill. That does not mean the air or your car has become 19 F. It means exposed skin can lose heat more like it would in calmer 19 F conditions.',
        ],
      },
      {
        title: 'Why the 50 F and 3 mph limits matter',
        paragraphs: [
          'The NWS wind chill formula is intended for air temperatures of 50 F or colder and wind speeds above 3 mph. Outside that range, the calculator should not pretend the formula is more precise than it is.',
          'If it is warm, heat index or dew point may be the better comfort check. If the air is calm, the wind chill effect is too small for this formula range.',
        ],
      },
      {
        title: 'What wind chill cannot decide for you',
        paragraphs: [
          'Wind chill is one useful signal, but it is not a full outdoor-safety plan. Wet clothing, time outside, sun, shelter, gloves, health, age, and local conditions can change the real risk.',
          'Use the calculator for a quick comparison, then check local weather alerts when frostbite, hypothermia, school closures, travel, pets, or outdoor work may be involved.',
        ],
      },
    ],
    faqItems: [
      {
        question: 'What does wind chill mean in plain language?',
        answer:
          'Wind chill is a feels-like cold estimate for exposed skin. It combines air temperature and wind speed to show how much faster wind can pull heat away from a person.',
      },
      {
        question: 'Does wind chill change the real air temperature?',
        answer:
          'No. A thermometer still reads the real air temperature. Wind chill helps describe exposed-skin heat loss, not the temperature of cars, pipes, tools, or other objects.',
      },
      {
        question: 'When should I not use the Wind Chill Calculator?',
        answer:
          'Do not use it for temperatures above 50 F, calm wind, wind speeds at or below 3 mph, or warm-weather comfort. In those cases, use the real temperature or a different weather measure.',
      },
      {
        question: 'Can wind chill tell me exact frostbite time?',
        answer:
          'No. It can support a quick check, but frostbite risk also depends on exposure time, clothing, wet skin, age, health, shelter, and local alerts. Use official warnings for safety decisions.',
      },
      {
        question: 'Why does 30 F and 15 mph become about 19 F?',
        answer:
          'The wind makes exposed skin lose heat faster. In the NWS formula, 30 F air with 15 mph wind feels close to 19.0 F for exposed skin.',
      },
      {
        question: 'Should I enter gust speed or steady wind speed?',
        answer:
          'Use the steady wind speed when you want a normal estimate. If strong gusts are the real concern, run both the steady wind and gust values so you can see the range.',
      },
      {
        question: 'Is Celsius supported?',
        answer:
          'Yes. The calculator uses Fahrenheit and mph for the NWS formula, then shows the wind chill result in Fahrenheit and Celsius so you can compare both units.',
      },
    ],
    sources: [sourceLinks.nwsWindChill, sourceLinks.nistUnits],
  },
  'heat-index-calculator': {
    summary: 'Learn how temperature and humidity estimate apparent heat, with safety limits in plain language.',
    purpose:
      'The Heat Index Calculator uses the NWS heat index method to estimate how hot warm, humid air can feel to a person. It starts with the simple branch, then uses the Rothfusz regression when the preliminary value reaches about 80 F.',
    enter: [
      'Enter air temperature in Fahrenheit.',
      'Enter relative humidity percent.',
      'Calculate to see apparent temperature in Fahrenheit and Celsius.',
    ],
    read: [
      'The main answer is heat index.',
      'Celsius gives metric context.',
      'Humidity confirms how much moisture was used in the estimate.',
      'A 90 F day at 70% relative humidity is about 105.9 F heat index in this model.',
    ],
    mistakes: [
      'Do not use heat index as the only heat-safety signal.',
      'Do not ignore direct sun, exertion, wind, clothing, or health conditions.',
      'Do not treat a heat-index chart or calculator as a replacement for local alerts.',
      'Follow local heat advisories and emergency guidance.',
    ],
    extraSections: [
      {
        title: 'Example numbers to sanity-check',
        paragraphs: [
          'Use these as quick checks before trusting your own result. They also make the heat-index chart idea easier to understand.',
        ],
        bullets: [
          '90 F with 70% relative humidity is about 105.9 F heat index.',
          '95 F with 35% relative humidity is about 96.5 F heat index.',
          '100 F with 55% relative humidity is about 123.6 F heat index.',
        ],
      },
      {
        title: 'What the number cannot know',
        paragraphs: [
          'The calculator only sees temperature and humidity. It does not know if you are in full sun, working hard, wearing heavy clothing, taking medication, dehydrated, or under a local heat warning.',
        ],
        bullets: [
          'Use local NWS heat alerts before outdoor plans.',
          'Use extra caution for children, older adults, outdoor workers, athletes, and anyone with health risks.',
          'If someone is confused, fainting, very hot, or showing heat-stroke warning signs, do not wait for a calculator result.',
        ],
      },
    ],
    sources: [sourceLinks.noaaHeatIndex, sourceLinks.nwsHeatSafety, sourceLinks.cdcHeatIllness, sourceLinks.nistUnits],
  },
  'dew-point-calculator': {
    summary: 'Learn how Fahrenheit temperature and relative humidity estimate dew point.',
    metaDescription:
      'Use the Dew Point Calculator guide to estimate dew point from Fahrenheit temperature and relative humidity, read comfort examples, and understand weather limits.',
    purpose:
      'The Dew Point Calculator estimates the temperature where the air would become saturated with water vapor from Fahrenheit temperature and relative humidity.',
    intro:
      'Use it when a weather app says 75 F and 60% relative humidity, but you want the moisture number that explains whether the air feels dry, comfortable, or muggy.',
    inputMatch:
      'the air temperature in Fahrenheit and the relative humidity percent from the same place and time',
    logicNote:
      'The calculator converts Fahrenheit to Celsius, uses the Magnus approximation with gamma = ln(RH / 100) + (17.625 x T_C) / (243.04 + T_C), solves dew point in Celsius, then converts the result back to Fahrenheit.',
    readIntro:
      'Read dew point F first if you are comparing U.S. weather notes. Check dew point C when you need metric context. A higher dew point usually means more actual moisture in the air, even when relative humidity by itself looks confusing.',
    mistakeIntro:
      'Most dew point mistakes come from mixing readings from different times or treating relative humidity alone as a comfort number.',
    enter: [
      'Enter the air temperature in Fahrenheit from the same room, forecast, or weather station reading.',
      'Enter relative humidity as a percent from 1 to 100; zero humidity is not valid for this formula.',
      'Calculate to see the estimated dew point in Fahrenheit and Celsius.',
    ],
    read: [
      'The main answer is dew point in Fahrenheit.',
      'Celsius gives metric context for weather notes, science class, or international forecasts.',
      'A 60.2 F dew point from 75 F and 60% relative humidity points to mild humidity, not extreme muggy air.',
      'A 73.3 F dew point from 82 F and 75% relative humidity is much stickier because the air contains more moisture.',
    ],
    mistakes: [
      'Do not enter zero humidity, because the logarithm in the formula needs relative humidity above 0%.',
      'Do not combine an indoor temperature with an outdoor humidity reading and expect a meaningful result.',
      'Do not treat the approximation as a calibrated weather station, indoor-air-quality report, mold-risk survey, or safety alert.',
      'Use local weather data, weather alerts, and proper instruments for safety-sensitive planning.',
    ],
    sidecarText:
      'Open the Dew Point Calculator beside this guide. Try 75 F and 60% relative humidity first, then compare 70 F and 30% RH with a muggy 82 F and 75% RH reading.',
    bestUsesIntro:
      'This guide is best when you have temperature and relative humidity, but you want a clearer moisture number before comparing comfort, indoor air, or humid weather.',
    referenceIntro:
      'These references support the dew point, relative humidity, and heat-index context used in this guide.',
    extraSections: [
      {
        title: 'Example: 75 F and 60% relative humidity',
        paragraphs: [
          'For a common mild-weather check, enter 75 for temperature and 60 for relative humidity. The calculator returns about 60.2 F dew point, or about 15.7 C.',
          'That result is easier to compare than relative humidity alone. A 60 F dew point usually feels more humid than dry indoor air, but it is not the same as the sticky 70-plus F dew points people notice on muggy days.',
        ],
      },
      {
        title: 'Dry, mild, and muggy checks',
        paragraphs: [
          'Use these examples as quick sanity checks before trusting your own number. They show how the same formula reacts when humidity and temperature move together.',
        ],
        bullets: [
          '70 F and 30% RH gives about 37.1 F dew point, which is much drier air.',
          '75 F and 60% RH gives about 60.2 F dew point, a mild-to-humid reading.',
          '82 F and 75% RH gives about 73.3 F dew point, which feels noticeably muggy.',
          '90 F and 70% RH gives about 78.9 F dew point, a very humid heat check.',
        ],
      },
      {
        title: 'Dew point versus heat index',
        paragraphs: [
          'Dew point is about moisture in the air. Heat index is about how hot the air feels to people when temperature and humidity combine.',
          'If your question is comfort or moisture, start with dew point. If your question is outdoor heat stress, compare the same weather reading with the Heat Index Calculator and local weather alerts.',
        ],
        links: [
          { href: '/tools/heat-index-calculator/', label: 'Compare the same reading with the Heat Index Calculator' },
        ],
      },
      {
        title: 'When this guide is not enough',
        paragraphs: [
          'This calculator is a browser estimate from two inputs. It cannot inspect your HVAC system, walls, stored materials, breathing comfort, forecast alerts, or condensation risk by itself.',
          'For mold, building damage, health symptoms, laboratory work, or weather safety, use proper instruments and local expert guidance. The calculator is best for a quick check, not a final decision.',
        ],
      },
    ],
    sources: [sourceLinks.noaaDewPoint, sourceLinks.nwsDewPointVsHumidity, sourceLinks.noaaHeatIndex],
  },
  'bandwidth-calculator': {
    summary: 'Learn how file size, bandwidth, and bits-versus-bytes math estimate download or upload time.',
    purpose:
      'The Bandwidth Calculator estimates download or upload time by converting a file size to bits, converting network speed to bits per second, then dividing total bits by bits per second.',
    intro:
      'A transfer-time estimate is useful when you want to know whether a download, upload, backup, or media file fits into the time you actually have. The trick is that file sizes are usually written in bytes, while internet speeds are usually written in bits per second.',
    inputMatch:
      'the data amount, data unit, speed amount, and speed unit from the same transfer, using upload speed when you are estimating a backup or cloud upload',
    logicNote:
      'The calculator uses decimal KB, MB, GB, and TB, multiplies bytes by 8 to get bits, converts Kbps, Mbps, or Gbps to bits per second, then divides. For example, 5 GB at 100 Mbps becomes 40,000,000,000 bits divided by 100,000,000 bits per second, or 400 seconds.',
    readIntro:
      'Read the friendly duration first, then check seconds, minutes, and hours when you need a more exact planning number. The result is a clean math estimate before Wi-Fi, server, router, VPN, congestion, throttling, or retry slowdowns.',
    mistakeIntro:
      'Most bandwidth mistakes come from mixing Mbps with MB/s, using advertised download speed for an upload, or treating the estimate as a promise instead of a best-case transfer time.',
    enter: [
      'Enter the file, backup, media, or transfer size and choose KB, MB, GB, or TB.',
      'Enter the usable connection speed and choose Kbps, Mbps, or Gbps.',
      'Use upload speed for cloud backups and file sends, because many home plans upload much slower than they download.',
      'Calculate to see the readable duration plus seconds, minutes, and hours.',
    ],
    read: [
      'The main answer is a readable duration, such as 6m 40s.',
      'Seconds is the exact base result from the division.',
      'Minutes and hours help with larger transfers, especially backups, game downloads, and long uploads.',
      'If the result looks too neat, treat it as a best-case estimate and add time for real network overhead.',
    ],
    mistakes: [
      'Do not confuse Mbps with MB/s. 100 Mbps is about 12.5 MB/s before overhead.',
      'Do not use your plan download speed for an upload estimate unless the upload speed is actually the same.',
      'Do not expect real transfers to match perfectly; Wi-Fi, server limits, congestion, packet overhead, throttling, retries, and other devices can slow the result.',
      'Do not compare decimal GB and binary-style GiB numbers without expecting a small difference.',
    ],
    extraSections: [
      {
        title: 'Example: 5 GB at 100 Mbps',
        paragraphs: [
          'For a 5 GB file on a 100 Mbps connection, the calculator first treats 5 GB as 5,000,000,000 bytes. Multiplying by 8 gives 40,000,000,000 bits.',
          'Then it divides 40,000,000,000 bits by 100,000,000 bits per second. The result is 400 seconds, which is about 6 minutes and 40 seconds before real-world slowdowns.',
        ],
      },
      {
        title: 'Bits versus bytes check',
        paragraphs: [
          'Internet speed plans usually use bits per second: Kbps, Mbps, or Gbps. File sizes usually use bytes: KB, MB, GB, or TB.',
          'That one-letter difference matters. One byte is 8 bits, so a 100 Mbps connection is roughly 12.5 MB/s before protocol overhead and network slowdowns.',
        ],
      },
      {
        title: 'What the estimate leaves out',
        paragraphs: [
          'The calculator does not know your Wi-Fi signal, router load, server speed, VPN overhead, throttling, packet loss, or whether another device is using the same connection.',
          'Use the result to plan the rough transfer window. If the transfer is important, give yourself extra time or test a smaller file first.',
        ],
      },
    ],
    sources: [sourceLinks.nistUnits, sourceLinks.googleHelpfulContent],
  },
  'gdp-calculator': {
    summary: 'Learn how the expenditure approach adds consumption, investment, government spending, and net exports into GDP.',
    purpose:
      'The GDP Calculator is a classroom-style way to understand gross domestic product. It uses consumption, investment, government spending, exports, and imports to show how the expenditure identity works without pretending to be an official data release.',
    inputMatch:
      'consumption, investment, government spending, exports, imports, and optional population, using the same scale',
    logicNote:
      'A good quick check is the net export line. If imports are bigger than exports, net exports are negative and pull the GDP estimate down.',
    readIntro:
      'Read the estimated GDP first, then check net exports and GDP per person. Those smaller lines explain whether trade or population scale changed the answer.',
    mistakeIntro:
      'Most GDP mistakes come from mixing scales or treating a learning estimate like official data.',
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
    extraSections: [
      {
        title: 'Official data limits',
        paragraphs: [
          'This page does not fetch live national accounts. Official GDP releases can use source data, seasonal adjustment, annualized rates, inflation adjustment, and later revisions.',
          'Use this calculator when you already have the inputs and want to understand the math. Use BEA or another official statistics office when you need the real published number.',
        ],
      },
      {
        title: 'Why imports lower the result',
        paragraphs: [
          'Imports are subtracted because some imported goods can already be included inside consumption, investment, or government spending. The subtraction keeps the GDP estimate closer to domestic production.',
          'That does not mean imports are bad. It just means the expenditure formula is trying not to count foreign-made output as local output.',
        ],
      },
    ],
    sources: [sourceLinks.beaGdp, sourceLinks.beaGdpExpenditure, sourceLinks.googleHelpfulContent],
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
    summary:
      'Learn how score differential, course handicap, and playing handicap estimates use score, rating, slope, par, index, PCC, and allowance.',
    metaDescription:
      'Use the Golf Handicap Calculator with scorecard examples for score differential, course handicap, and playing handicap. Clear WHS-style formulas and limits.',
    purpose:
      'The Golf Handicap Calculator is for quick checks before or after a round. It can estimate a score differential from one adjusted score, or estimate the course and playing handicap for a specific set of tees.',
    intro:
      'Golf handicap math is not just "score minus par." The tee rating and slope matter. That is why the same 86 can look better on one course than another.',
    inputMatch:
      'the adjusted score, Course Rating, Slope Rating, par, PCC, Handicap Index, and allowance from the exact tees or format you are checking',
    logicNote:
      'For score differential, the calculator subtracts Course Rating and PCC from adjusted score, then scales by 113 divided by Slope Rating. For course handicap, it scales Handicap Index by Slope Rating divided by 113, then adjusts Course Rating against par.',
    readIntro:
      'Read the result as an estimate you can compare with your scorecard or golf app. Score differential is shown to one decimal place. Course handicap and playing handicap are whole-stroke estimates.',
    mistakeIntro:
      'The big mistake is using the wrong tee data. A blue-tee slope, white-tee rating, or guessed PCC can move the answer.',
    sidecarText:
      'Open the Golf Handicap Calculator beside this guide. Try the 86 on 71.2/128 example first, then swap in the rating and slope from your own tees.',
    bestUsesIntro:
      'This guide is best for checking one round, understanding why slope matters, and sanity-checking a course handicap before a casual match.',
    referenceIntro:
      'The source links below are official USGA handicap references for score differential, course handicap, playing handicap, and key definitions.',
    enter: [
      'Use Score differential mode when you know the adjusted gross score, Course Rating, Slope Rating, and PCC.',
      'Use Course handicap mode when you know your Handicap Index plus the Slope Rating, Course Rating, and par for the tees.',
      'Enter the allowance percentage only when the format uses one. Leave 100% for a plain course handicap check.',
    ],
    read: [
      'A score of 86 on a 71.2 rating, 128 slope, and PCC 0 gives about 13.1 as the score differential.',
      'A Handicap Index of 14.2 on 128 slope, 71.2 rating, and par 72 gives a course handicap of about 15.',
      'A playing handicap applies the allowance after the course handicap step. A 15 course handicap at 85% becomes about 13.',
    ],
    mistakes: [
      'Do not call the result an official Handicap Index. This page does not read your scoring record.',
      'Do not use course rating, slope rating, or par from the wrong tee box.',
      'Do not guess PCC for an official score. Use 0 unless your scoring record or event gives a value.',
      'Remember official records can include caps, exceptional-score reductions, 9-hole handling, and committee adjustments.',
    ],
    extraSections: [
      {
        title: 'Example: one round score differential',
        paragraphs: [
          'Say your adjusted gross score is 86. The tee rating is 71.2, the slope is 128, and PCC is 0.',
          'The calculator uses (113 / 128) x (86 - 71.2 - 0). That gives 13.1 after rounding to one decimal place.',
          'That does not mean your Handicap Index is 13.1. It is one round value that an official scoring record can use with your other scores.',
        ],
      },
      {
        title: 'Example: course handicap and playing handicap',
        paragraphs: [
          'Say your Handicap Index is 14.2. You are playing tees with slope 128, Course Rating 71.2, and par 72.',
          'The course handicap estimate is 14.2 x (128 / 113) + (71.2 - 72), which rounds to 15.',
          'If the format uses an 85% allowance, the playing handicap estimate is 15 x 0.85, which rounds to 13.',
        ],
      },
      {
        title: 'Why this is an estimate',
        paragraphs: [
          'The calculator only works with the numbers you type. It does not check whether your score was acceptable, whether holes were adjusted correctly, or whether your local association applied extra rules.',
          'For a tournament or official posting, use the committee, GHIN or your local golf association app, and the scorecard data for the exact tees.',
        ],
      },
    ],
    sources: [sourceLinks.usgaScoreDifferential, sourceLinks.usgaCourseHandicap, sourceLinks.usgaHandicapDefinitions],
  },
  'love-calculator': {
    summary: 'Learn how the Love Calculator works as a silly private name-match game.',
    metaDescription:
      'Use the Love Calculator as a silly name-match game. See exact Alex and Sam examples, privacy tips, and why the score is not real relationship science.',
    purpose:
      'The Love Calculator is for laughs. It turns two names into a repeatable playful score, but it does not claim to measure attraction, trust, effort, communication, consent, timing, or real relationship health.',
    intro:
      'Try it when you want a quick joke result, then keep the real-life part simple: the number is just a game.',
    inputMatch: 'the two names, nicknames, initials, or made-up names you want to try',
    logicNote:
      'The same spellings give the same score because the browser uses the same cleanup and hash rule each time. Change a spelling or nickname and the game can change too.',
    readIntro:
      'Read the percentage like a game caption. The smaller lines show the playful label and the cleaned name keys used for the score.',
    mistakeIntro:
      'The easiest mistake is taking the number seriously. It is fine for a laugh, but it is not a test of attraction, honesty, boundaries, or the future.',
    sidecarText:
      'Open the Love Calculator beside this guide. Try Alex and Sam first, then use nicknames or initials if you do not want to type real names.',
    referenceIntro:
      'These references are for the serious parts: healthy relationship basics, random-number language, and web/app privacy. They do not prove the score measures love.',
    enter: [
      'Enter the first name, nickname, initials, or a made-up name.',
      'Enter the second name the same way.',
      'Press Calculate match to get a repeatable name-game score from the exact spellings you typed.',
    ],
    read: [
      'The percentage is entertainment only. Alex and Sam, for example, return 86% and the label "Sparkly match."',
      'The game label is a light caption, not advice. Cute can be funny, but it is not proof.',
      'The cleaned name keys show what the browser used to make the repeatable score, so changing the spelling can change the number.',
    ],
    mistakes: [
      'Do not treat the result as real compatibility science.',
      'Do not use the score to pressure, shame, judge, or make decisions about another person.',
      'Do not enter sensitive private information; names, nicknames, initials, or fictional names are enough for the game.',
      'Do not share another person\'s name or result in a way that would embarrass them.',
    ],
    extraSections: [
      {
        title: 'Quick example',
        paragraphs: [
          'Type Alex in the first box and Sam in the second box, then press Calculate match. The tool returns 86% with a Sparkly match label. Type alex and SAM, and the cleaned names still become alex and sam, so the score stays the same.',
        ],
      },
      {
        title: 'What the score does not mean',
        paragraphs: [
          'A high score does not mean two people are meant to be together. A low score does not mean anything is wrong. The score is made by a browser rule, not by reading feelings or predicting the future.',
          'For real life, look at how people treat each other. Respect, honesty, boundaries, communication, and time matter more than any number this game can show.',
        ],
      },
      {
        title: 'Privacy tip',
        paragraphs: [
          'The tool only needs two short name fields. Use nicknames, initials, or fictional names if you do not want to type real names. Never put ages, locations, photos, social handles, or private details into a novelty game.',
        ],
      },
    ],
    sources: [
      sourceLinks.hhsHealthyRelationships,
      sourceLinks.youthGovHealthyRelationships,
      sourceLinks.nistRandomNumber,
      sourceLinks.ftcWebAppsCollectInfo,
    ],
  },
  'word-counter': {
    summary: 'Learn how to count words, characters, sentences, paragraphs, and reading time from plain text.',
    metaDescription:
      'Learn how to use the Word Counter to count words, characters, sentences, paragraphs, lines, UTF-8 bytes, and rough reading time.',
    purpose:
      'The Word Counter helps writers, students, site owners, and editors understand the size of a draft before publishing. It is especially useful when a tool, class, search snippet, or platform has a practical length target.',
    intro:
      'Use it when a draft is almost ready but you need to know whether it fits an essay target, page snippet, social post, editor request, or reading-time plan. Paste the exact text you plan to use, count it, then check the target app if the limit is strict.',
    inputMatch:
      'the exact draft text you want to count, including headings, line breaks, captions, URLs, and notes you plan to keep',
    logicNote:
      'The browser looks for word-like groups, counts the surrounding characters, sentences, paragraphs, lines, and UTF-8 bytes, then estimates reading time at about 200 words per minute.',
    readIntro:
      'Read the word count first, then use the smaller lines to catch length problems that a single number hides. Character count helps with snippets and captions, paragraph and line counts help with formatting, and bytes help when a technical field cares about encoded size.',
    mistakeIntro:
      'Most word-count mistakes come from counting the wrong version of the draft. Copy the same text you will submit, including headings, captions, footnotes, URLs, emoji, and blank lines when those parts matter.',
    sidecarText:
      'Open the Word Counter beside this guide. Try the short sentence example first, then paste your own draft and compare words, characters, paragraphs, lines, bytes, and reading time.',
    bestUsesIntro:
      'Use the guide when length changes what you do next: trim a draft, expand a thin section, estimate reading time, or check whether a pasted version still matches the original.',
    enter: [
      'Paste or type the exact plain-text draft you want to check.',
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
    extraSections: [
      {
        title: 'A quick word-count example',
        paragraphs: [
          'Paste this sentence: `Access Free Tools helps people finish quick browser tasks.` The tool counts 8 words and shows a tiny reading-time estimate because the text is shorter than a normal paragraph.',
          'Now add a second paragraph or a URL. The word count, line count, character count, and byte count can move in different ways, which is why the guide asks you to check more than one result before submitting strict text.',
        ],
      },
      {
        title: 'When word count is not enough',
        paragraphs: [
          'A 900-word article can still feel thin if it dodges the question, and a 120-word answer can be enough when it solves the problem clearly. Use the count as a guardrail, then reread the draft for usefulness.',
          'For search snippets, captions, bios, forms, and code fields, character count or byte length can matter more than words. The matching Character Counter is better when the target limit is a hard character number.',
        ],
        links: [{ href: '/tools/character-counter/', label: 'Open the Character Counter' }],
      },
      {
        title: 'Strict-limit checklist',
        paragraphs: [
          'Before you submit to a school portal, CMS, client form, or social platform, paste the final text into the target field if you can. That final field may count rich text, emoji, URLs, footnotes, or hidden formatting differently from a browser-side draft checker.',
        ],
        bullets: [
          'Count the final version, not an earlier draft.',
          'Include headings, captions, footnotes, and URLs if the target field includes them.',
          'Check whether the target asks for words, characters, characters without spaces, or bytes.',
          'Treat reading time as a planning estimate, not a rule for every reader.',
        ],
      },
    ],
    referenceIntro:
      'These references help explain character references, JavaScript string length, and UTF-8 byte encoding behind the non-word totals. Platform word-count rules can still differ, so use the final app for strict limits.',
    sources: [sourceLinks.mdnCharacterReference, sourceLinks.mdnStringLength, sourceLinks.mdnTextEncoder],
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
    extraSections: [
      {
        title: 'A quick example',
        paragraphs: [
          'If your draft title is "Free Character Counter for Titles and Messages", the tool shows 46 characters and 40 characters without spaces. That is the kind of quick check you want before pasting a title, caption, or message into a place with a limit.',
        ],
      },
      {
        title: 'Why emoji and bytes can surprise you',
        paragraphs: [
          'Some emoji are made from more than one Unicode code point, even when they look like one symbol on screen. That is why this page warns you to check the final app when emoji, rich text, or a strict platform limit matters.',
          'UTF-8 bytes are different again. Plain English letters usually take one byte each, but many symbols and emoji take more, so the byte count can be higher than the character count.',
        ],
      },
    ],
    sources: [sourceLinks.googleSnippets, sourceLinks.mdnStringLength, sourceLinks.mdnTextEncoder],
  },
  'text-case-converter': {
    summary: 'Learn how to convert plain text into common writing, code, filename, and URL case styles.',
    metaDescription:
      'Learn how to use the Text Case Converter for uppercase, title case, sentence case, camelCase, PascalCase, snake_case, and kebab-case.',
    purpose:
      'The Text Case Converter saves small editing time by turning a phrase into uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case, or kebab-case.',
    intro:
      'Use it when a heading, filename, URL idea, or code-style name is close but the capitalization is wrong. Pick the case style, paste the exact text, then review names, acronyms, punctuation, and line breaks before copying.',
    inputMatch:
      'the exact words you want converted and the case style you need for a heading, label, filename, URL idea, or code-style name',
    logicNote:
      'Writing cases keep the text readable for humans. Identifier cases split the text into words, remove punctuation, and join the pieces as camelCase, PascalCase, snake_case, or kebab-case.',
    readIntro:
      'Compare the converted output with your original text before copying. The changed-positions count is a quick difference check; 0 means the character slots did not change, while a higher count means you should reread names, acronyms, and punctuation.',
    mistakeIntro:
      'Most text-case mistakes come from trusting the converted text too quickly. The tool can change capitalization and word joins, but it cannot know every brand name, style guide, or symbol that matters in your project.',
    sidecarText:
      'Open the Text Case Converter beside this guide. Try the title-case, kebab-case, or camelCase example first, then paste your own heading, filename, or code-style name.',
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
    extraSections: [
      {
        title: 'A quick text-case example',
        paragraphs: [
          'For a blog heading like `access free tools utility website`, Title Case becomes `Access Free Tools Utility Website`. For a filename like `Kawaii Calculator Blog Guide`, kebab-case becomes `kawaii-calculator-blog-guide`.',
          'Those two checks solve different jobs. Choose the style that matches where the text will go before copying the result.',
          'For `FREE TOOLS FOR QUICK TEXT EDITS`, Sentence case becomes `Free tools for quick text edits`. Both strings have 31 characters, but Changed positions is 25 because most uppercase letters move to lowercase slots. That tells you the output needs a quick reread before you paste it.',
        ],
      },
      {
        title: 'When to slow down before copying',
        paragraphs: [
          'Style guides disagree on small words in title case, and codebases often have their own naming rules. Treat the converter as a fast draft, then check proper nouns, acronyms, punctuation, and project conventions before you paste the final text.',
        ],
      },
      {
        title: 'Copy checklist before final use',
        paragraphs: [
          'Before you paste the result into a page, filename, URL, or codebase, do one last check in the place where the text will actually live.',
        ],
        bullets: [
          'Check brand names, product names, acronyms, and people names after sentence case or title case.',
          'Check the first word, final word, and line breaks if the original text had more than one line.',
          'For camelCase, PascalCase, snake_case, and kebab-case, confirm that removed punctuation was not meaningful.',
          'For code names, filenames, and URLs, test the result against the project or platform rule before you commit it.',
        ],
      },
    ],
    referenceIntro:
      'This guide follows the converter logic, visible input labels, examples, and FAQ text on the Text Case Converter tool page. If your style guide, CMS, codebase, or platform has its own naming rule, use that rule first.',
    sources: [],
  },
  'slug-generator': {
    summary: 'Learn how to turn titles and phrases into clean lowercase URL slugs.',
    metaDescription:
      'Learn how to use the Slug Generator to turn titles and headings into lowercase hyphenated URL slugs, check length, and avoid duplicate URL ideas.',
    purpose:
      'The Slug Generator turns a readable title into a URL-friendly draft path. It is useful for planning blog guides and tool pages while keeping one clear main page for each real topic.',
    intro:
      'Start here when a title looks good to a reader but too messy for a URL. Paste the title, add a max length only if your project needs one, then check whether the final slug still names the page clearly.',
    inputMatch: 'the exact title, heading, tool name, or phrase you want to turn into a draft URL slug',
    logicNote:
      'The example cards on the generator page show how normal titles become lowercase hyphenated paths. Use them to check punctuation, ampersands, numbers, and length before copying your own result.',
    readIntro:
      'Read the generated slug as a draft URL path, not as a final SEO decision. The character count helps you spot long paths, and the max-length line tells you whether the tool had to trim the result.',
    mistakeIntro:
      'Slug mistakes usually come from cutting off context, keeping a near-duplicate URL idea, or making the path so short that the topic is no longer obvious.',
    sidecarText:
      'Open the Slug Generator beside this guide. Try the 2026 SEO checklist example first, then replace it with your own title.',
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
    extraSections: [
      {
        title: 'Example: check a shorter slug before copying it',
        paragraphs: [
          'Say the title is `2026 SEO Checklist & URL Tips`. With no max length, the tool returns `2026-seo-checklist-and-url-tips`. That keeps the year, checklist topic, and URL tips together.',
          'If you set a 22-character limit, the result becomes `2026-seo-checklist-and`. That is shorter, but it loses the URL tips part. In that case, raise the limit or rewrite the title before copying the slug.',
        ],
      },
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
      'Do not treat formatted JSON as schema-validated; required fields, allowed values, and API-specific types still need your schema or app rules.',
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
    title: 'Hash Generator Guide',
    summary: 'Learn how to generate SHA-256, SHA-384, and SHA-512 text hashes and read the digest safely.',
    metaDescription:
      'Use the Hash Generator guide to choose SHA-256, SHA-384, or SHA-512, generate a browser-side text digest, and avoid password/authenticity mistakes.',
    purpose:
      'The Hash Generator creates SHA-2 digests from text in your browser. It is useful when you need a quick checksum-style text hash for learning, comparing small strings, or debugging a workflow that expects a hexadecimal digest.',
    intro:
      'A good hash check starts with the exact text. One extra space, line break, capital letter, or different character encoding creates a different digest, so this guide focuses on the inputs, the byte count, and the limits before you copy the result.',
    inputMatch:
      'the exact text you want to hash, including spaces, punctuation, line breaks, and the SHA algorithm the receiving system expects',
    logicNote:
      'The tool converts the text to UTF-8 bytes with TextEncoder, sends those bytes to the browser SubtleCrypto digest function, then formats the returned bytes as lowercase hexadecimal. For `Access Free Tools` with SHA-256, the digest is `bdcddc51dd9df0bad4c886a189a36bde524fd4c43f2ac196c7d8e2d4fe53076f`.',
    readIntro:
      'Read the digest first, then check the input-byte and digest-byte lines. SHA-256 returns 32 digest bytes, shown as 64 hex characters. SHA-384 returns 48 bytes, and SHA-512 returns 64 bytes.',
    mistakeIntro:
      'Most hash surprises come from hashing a slightly different string or expecting a hash to do a job it cannot do by itself.',
    bestUsesIntro:
      'Best for small text checks, examples, demos, and debugging. For passwords, file integrity, API signatures, or trusted messages, use the security design your app or protocol requires.',
    referenceIntro:
      'These references help check the browser digest API, UTF-8 byte conversion, SHA-2 digest sizes, and password-storage limits behind the guide.',
    enter: [
      'Choose SHA-256, SHA-384, or SHA-512 based on the format another system expects. Use SHA-256 when you only need a common modern text digest.',
      'Paste the exact text to hash. Keep spaces, line breaks, punctuation, and capitalization exactly as they should be checked.',
      'Press Generate hash, then copy the hexadecimal digest only after the input-byte and digest-byte counts look right.',
    ],
    read: [
      'Hex digest is the lowercase text result you can compare or paste into a system that expects a plain hex SHA digest.',
      'Input bytes is the UTF-8 byte length of the text you entered, not just the number of visible letters.',
      'Digest bytes changes by algorithm: SHA-256 is 32 bytes, SHA-384 is 48 bytes, and SHA-512 is 64 bytes.',
      'If two digests do not match, compare the original text first. A trailing space is enough to change the whole result.',
    ],
    mistakes: [
      'Do not treat hashing as encryption; a hash cannot be decrypted.',
      'Do not use a raw SHA hash as a password storage design. Real password systems need salts and a password-hashing or key-derivation function.',
      'Do not use a hash alone as proof that a message came from a trusted sender. Use HMACs, digital signatures, or the protocol your system requires.',
      'Do not compare text hashes if one system hashed a file, normalized line endings, trimmed whitespace, or used a different character encoding.',
    ],
    extraSections: [
      {
        title: 'Quick SHA-256 example',
        paragraphs: [
          'Enter `Access Free Tools`, choose SHA-256, and press Generate hash. The tool returns `bdcddc51dd9df0bad4c886a189a36bde524fd4c43f2ac196c7d8e2d4fe53076f`.',
          'That answer is 64 hex characters because SHA-256 returns 32 bytes and each byte is shown as two hex characters. The same text with an extra space at the end will produce a totally different digest.',
        ],
      },
      {
        title: 'What changes the digest',
        paragraphs: [
          'A hash is sensitive by design. The tool hashes bytes, not intentions, so visually small changes can be real input changes.',
        ],
        bullets: [
          'Capital letters and lowercase letters are different bytes.',
          'A copied trailing space changes the digest.',
          'Line endings can differ between systems.',
          'Emoji and many non-English characters can use multiple UTF-8 bytes.',
        ],
      },
      {
        title: 'What a text hash can and cannot prove',
        paragraphs: [
          'A matching digest can show that two pieces of text produced the same hash with the same algorithm. It does not prove who wrote the text, who sent it, or whether it was safe to trust.',
          'For trusted messages, APIs, installers, or login systems, the missing part is usually a secret key, signature, salt, work factor, or protocol rule. This page helps you see the plain digest, not design the security system around it.',
        ],
      },
      {
        title: 'Useful related checks',
        paragraphs: [
          'Hashing is often confused with encoding, URL formatting, and password generation. Use the tool that matches the real job before copying the result into code or documentation.',
        ],
        links: [
          { href: '/tools/hash-generator/', label: 'Open the Hash Generator' },
          { href: '/tools/base64-encode-decode/', label: 'Encode or decode Base64 text' },
          { href: '/tools/url-encode-decode/', label: 'Encode text for a URL' },
          { href: '/tools/password-generator/', label: 'Generate a random password' },
        ],
      },
    ],
    sidecarText:
      'Open the Hash Generator beside this guide. Try the `Access Free Tools` SHA-256 example first, then replace the text with the exact string you need to compare.',
    sources: [sourceLinks.mdnTextEncoder, sourceLinks.mdnSubtleCryptoDigest, sourceLinks.nistFips180, sourceLinks.nistPasswords],
  },
  'unix-timestamp-converter': {
    summary: 'Learn how to convert UTC dates to Unix timestamps and timestamps back to UTC time.',
    purpose:
      'The Unix Timestamp Converter is for log, API, database, and developer work where time is stored as a count from the Unix epoch. It uses UTC so the conversion does not silently depend on the viewer’s local time zone.',
    intro:
      'Start with a UTC instant, not a local calendar guess. Use date mode when you are preparing a value for logs or APIs, and use timestamp mode when you are checking stored epoch seconds or milliseconds.',
    inputMatch:
      'the UTC date, UTC time, timestamp number, and selected seconds-or-milliseconds unit your log, API, database, or browser code actually uses',
    logicNote:
      'For example, 2026-04-30 12:00 UTC becomes 1777464000 Unix seconds or 1777464000000 milliseconds. Converting either value back should land on 2026-04-30T12:00:00.000Z.',
    readIntro:
      'Read the seconds, milliseconds, and UTC ISO lines together. Copy the unit your system expects instead of treating the two timestamp lengths as interchangeable.',
    mistakeIntro:
      'Most timestamp bugs are unit or time-zone bugs, so check those two things before changing the date itself.',
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
    extraSections: [
      {
        title: 'One quick UTC walkthrough',
        paragraphs: [
          'Enter 2026-04-30 and 12:00 in date mode. The converter reads that as noon UTC, counts from 1970-01-01T00:00:00Z, and returns 1777464000 seconds.',
          'If another system gives you 1777464000000 milliseconds, switch to timestamp mode, choose milliseconds, and confirm that the ISO result is 2026-04-30T12:00:00.000Z.',
        ],
        bullets: [
          'A 10-digit modern timestamp is usually seconds.',
          'A 13-digit modern timestamp is usually milliseconds.',
          'The same instant can display as another clock time after an app applies a local time zone.',
        ],
      },
    ],
    sidecarText:
      'Open the Unix Timestamp Converter beside this guide. Try the 2026-04-30 noon UTC example first, then switch to timestamp mode and compare seconds with milliseconds.',
    bestUsesIntro:
      'Use this guide when a log, API response, database field, or JavaScript Date value needs a UTC sanity check before you copy the timestamp somewhere else.',
    referenceIntro:
      'These references help check JavaScript UTC date behavior, time definitions, and ISO 8601 timestamp formatting used by the guide.',
    sources: [sourceLinks.mdnDate, sourceLinks.nistTime, sourceLinks.isoDate],
  },
  'color-contrast-checker': {
    summary: 'Learn how to compare foreground and background colors with the WCAG contrast ratio formula.',
    purpose:
      'The Color Contrast Checker helps you test a text color against the exact background behind it before a button, label, nav link, or body-text style becomes hard to read.',
    intro:
      'Start with the real foreground and background hex values from the component you are checking. A color pair can pass on a white page and fail on a tinted card, gradient, image, hover state, or disabled state.',
    inputMatch:
      'the exact foreground text color and background color as #RGB or #RRGGBB hex values, taken from the state and surface you plan to ship',
    logicNote:
      'For example, #777777 on #ffffff is about 4.4780894536:1. That is close, but it is still below the 4.5:1 AA normal-text threshold, so normal text fails while large AA text can pass.',
    readIntro:
      'Read the ratio and all four pass/fail lines together. AA normal text, AA large text, AAA normal text, and AAA large text answer different design questions.',
    mistakeIntro:
      'Most contrast mistakes come from testing the wrong surface or treating one passing ratio as approval for every state.',
    metaDescription:
      'Learn how to check text and background hex colors, read WCAG AA and AAA contrast results, and avoid common near-miss accessibility mistakes.',
    enter: [
      'Enter the foreground text, icon, label, or button-copy color as #RGB or #RRGGBB.',
      'Enter the background color directly behind that foreground color, not a nearby surface color.',
      'Press Check contrast to calculate the ratio.',
      'Repeat the check for hover, focus, selected, disabled, dark-theme, and light-theme states.',
    ],
    read: [
      'The contrast ratio compares the lighter relative luminance with the darker relative luminance after WCAG adds 0.05 to both sides.',
      'AA normal text passes at 4.5:1 or higher.',
      'AA large text passes at 3:1 or higher.',
      'AAA normal text passes at 7:1 or higher, while AAA large text passes at 4.5:1 or higher.',
    ],
    mistakes: [
      'Do not check only the default state; hover, focus, disabled, selected, and dark-mode states matter too.',
      'Do not test text on white if the real component sits on a tinted card, image, gradient, or translucent overlay.',
      'Do not rely on color alone to communicate state.',
      'Do not assume a passing contrast ratio fixes font size, line height, focus outlines, icon meaning, or keyboard usability.',
    ],
    extraSections: [
      {
        title: 'One near-miss example',
        paragraphs: [
          'Try #777777 as the text color and #ffffff as the background. The checker returns 4.4780894536:1, which looks almost like an AA normal-text pass but is still below 4.5:1.',
          'That tiny gap matters because WCAG contrast thresholds are pass/fail lines. You can darken the text slightly, lighten the background, increase the text size enough for the large-text rule, or choose a stronger brand shade.',
        ],
        bullets: [
          '#101828 on #ffffff is 17.7465943159:1 and passes AA and AAA normal text.',
          '#667085 on #f9fafb is 4.7604112926:1, so AA normal text passes but AAA normal text fails.',
          '#777777 on #ffffff is 4.4780894536:1, so normal AA fails even though large text can pass.',
        ],
      },
      {
        title: 'What the formula is checking',
        paragraphs: [
          'The checker first expands valid short hex colors, then converts each red, green, and blue channel from sRGB into linear-light values. Those channel values produce relative luminance for the foreground and background.',
          'The final WCAG ratio is (lighter luminance + 0.05) divided by (darker luminance + 0.05). The result has no unit; it is usually written as something like 4.5:1 or 7:1.',
        ],
        bullets: [
          'Use the specified background that appears behind the text in normal use.',
          'Anti-aliasing, font weight, and thin strokes can make text feel lighter than the math suggests.',
          'A contrast checker does not decide whether color is the only cue, so still add labels, icons, borders, or state text where needed.',
        ],
      },
    ],
    sidecarText:
      'Open the Color Contrast Checker beside this guide. Try the #777777 on white near-miss first, then test the exact component state you plan to ship.',
    bestUsesIntro:
      'Use this guide when you are choosing text, button, label, navigation, or icon colors and need to know whether the real foreground/background pair clears WCAG contrast thresholds.',
    referenceIntro:
      'These references explain the WCAG contrast thresholds, relative luminance formula, large-text exception, and why contrast is only one accessibility check.',
    sources: [sourceLinks.wcagContrast, sourceLinks.wcagContrastMinimum],
  },
  'aspect-ratio-calculator': {
    title: 'Aspect Ratio Calculator Guide',
    summary: 'Learn how to simplify image and video dimensions or resize while preserving proportions.',
    metaDescription:
      'Use the Aspect Ratio Calculator guide to simplify width and height, scale one dimension, and avoid stretched images, videos, and previews.',
    purpose:
      'The Aspect Ratio Calculator keeps designs, screenshots, images, thumbnails, and video frames from stretching when one dimension changes.',
    intro:
      'Start with the real width and height from the file, artboard, screen, or upload spec. The guide below shows how to simplify the shape, scale one dimension, and decide when you need resizing, cropping, or padding instead.',
    inputMatch:
      'the original width and height, using the same unit, plus either the new width or the new height when you are resizing',
    logicNote:
      'For example, 3840 x 2160 simplifies to 16:9 because both numbers divide down to 16 and 9. If a 1080 x 1920 vertical story needs to become 720 pixels wide, the matching height is 1280 pixels, so the file keeps the same shape.',
    readIntro:
      'Read the simplified ratio first, then check the decimal and scaled-size lines. If the answer is for an upload, design system, or video editor, compare the final rounded pixels with that platform before exporting.',
    mistakeIntro:
      'Most aspect-ratio mistakes come from mixing units, rounding too early, or resizing when the real job needs a crop or padded canvas.',
    enter: [
      'Use Simplify ratio when you only need the width-to-height relationship, such as 3840 x 2160 becoming 16:9.',
      'Use Scale by width when you know the new width and need the matching height, such as a 1080 x 1920 story resized to 720 wide.',
      'Use Scale by height when you know the new height and need the matching width.',
      'Keep width and height in the same unit. Pixels, inches, and centimeters can all work, but do not mix them in the same calculation.',
    ],
    read: [
      'Ratio shows the simplified width-to-height relationship, such as 16:9, 1:1, or 4:5.',
      'Decimal shows width divided by height, which helps compare two sizes that may not look obviously related.',
      'Scaled size shows the missing dimension when you resize by width or height.',
      'A one-pixel difference can happen after rounding when the exact scaled answer is a decimal pixel.',
    ],
    mistakes: [
      'Do not round too early when a platform needs exact pixels.',
      'Do not crop and resize as if they are the same thing; cropping changes what is visible.',
      'Do not assume a ratio tells you which part of the image should stay in frame.',
      'Check the final export dimensions after compression, image editing, or video rendering.',
    ],
    extraSections: [
      {
        title: 'One vertical story example',
        paragraphs: [
          'Say a vertical design is 1080 x 1920 and you need a smaller copy that is 720 pixels wide. Choose Scale by width, enter 1080 as the original width, 1920 as the original height, and 720 as the new width.',
          'The calculator returns 720 x 1280. That means the image is smaller, but it has not been squashed or stretched. If the destination requires a different shape, resize alone is not enough.',
        ],
        bullets: [
          '1080 x 1920 simplifies to 9:16.',
          '720 / 1080 = 0.666666..., so the height scales by the same factor.',
          '1920 x 0.666666... = 1280.',
        ],
      },
      {
        title: 'Resize, crop, or pad?',
        paragraphs: [
          'Resizing keeps the whole image and changes its size. Cropping cuts away part of the image to fit a different shape. Padding keeps the whole image but adds empty space around it.',
          'If your 1200 x 630 social preview needs to stay the same shape at 600 pixels wide, resizing gives 600 x 315. If a platform asks for a square, you need a crop or padded canvas instead of only a scaled size.',
        ],
        bullets: [
          'Resize when the shape can stay the same.',
          'Crop when the destination shape is different and losing edges is acceptable.',
          'Pad when the destination shape is different but the whole image must stay visible.',
        ],
      },
    ],
    sidecarText:
      'Open the Aspect Ratio Calculator beside this guide. Try 3840 x 2160 first, then scale the 1080 x 1920 story example to 720 wide.',
    bestUsesIntro:
      'Use this guide when you already know the original dimensions and need a clean resize, simplified ratio, or quick check before exporting an image, video, screenshot, or thumbnail.',
    referenceIntro:
      'These references help check the aspect-ratio concept and same-unit measurement context behind the guide examples.',
    sources: [sourceLinks.mdnAspectRatio, sourceLinks.nistUnits],
  },
  'utm-builder': {
    title: 'UTM Builder Guide',
    summary: 'Learn how to build clean UTM campaign links without hand-editing URL parameters.',
    metaDescription:
      'Use the UTM Builder guide to create campaign URLs, choose source, medium, and campaign labels, preserve query values, and avoid messy reports.',
    purpose:
      'The UTM Builder turns a landing page and campaign labels into one copy-ready URL that analytics tools can read.',
    intro:
      'Start with the exact page people should visit, then name where the click comes from, what channel it uses, and which campaign it belongs to. The guide below shows how to keep those names consistent and how to check the finished URL before you share it.',
    inputMatch:
      'the exact landing page URL, the click source, the channel medium, the campaign name, and optional content or term labels when you need extra detail',
    logicNote:
      'For example, https://accessfreetools.com/tools/ with source newsletter, medium email, campaign spring-tools, and content hero-button becomes https://accessfreetools.com/tools/?utm_source=newsletter&utm_medium=email&utm_campaign=spring-tools&utm_content=hero-button. The builder uses URLSearchParams, so it handles the question mark, ampersands, and encoded spaces for you.',
    readIntro:
      'Read the campaign URL first, then check the UTM parameter count and the existing-parameters line. If the original URL already had a question mark, make sure those original values are still present before copying the link.',
    mistakeIntro:
      'Most UTM mistakes are naming mistakes: one campaign gets split across reports because the same idea was typed three different ways.',
    bestUsesIntro:
      'Use this guide when you are preparing newsletter links, paid ads, social profile links, partner links, launch announcements, or two versions of the same link that need separate reporting labels.',
    referenceIntro:
      'These references help check Google Analytics campaign URL guidance and the browser URL parameter logic behind the builder.',
    enter: [
      'Enter the full http or https landing page URL people should visit.',
      'Fill in UTM source for where the click comes from, such as newsletter, google, instagram, or partner-site.',
      'Fill in UTM medium for the channel type, such as email, cpc, social, referral, or banner.',
      'Use UTM campaign for the shared campaign name, then use content or term only when you need to tell two links, ads, keywords, or audiences apart.',
    ],
    read: [
      'Campaign URL is the full link you can copy into a post, email, ad, button, or partner note.',
      'UTM parameters tells you how many tracking fields were added to the URL.',
      'Existing parameters shows whether the original URL already had query values before the UTM labels were added.',
      'Encoded spaces and special characters are normal in URLs; for example, free calculators can become free+calculators in a query parameter.',
    ],
    mistakes: [
      'Do not use different spellings or casing for the same source, medium, or campaign across links.',
      'Do not put customer names, email addresses, order numbers, tokens, or private IDs in UTM fields because the values travel in the public URL.',
      'Do not use content and term for every link just because the fields exist. Extra labels should answer a real reporting question.',
      'Do not expect UTM values to appear in analytics unless the destination site is configured to collect campaign data.',
    ],
    extraSections: [
      {
        title: 'Newsletter example',
        paragraphs: [
          'Say the landing page is https://accessfreetools.com/tools/ and the link is going in a spring newsletter. Enter newsletter as the source, email as the medium, spring-tools as the campaign, and hero-button as the content label.',
          'The builder returns https://accessfreetools.com/tools/?utm_source=newsletter&utm_medium=email&utm_campaign=spring-tools&utm_content=hero-button. In a campaign report, that link can be grouped with other spring-tools links while still showing that this click came from the newsletter hero button.',
        ],
        bullets: [
          'Source answers: where did the click come from?',
          'Medium answers: what kind of channel was it?',
          'Campaign answers: which effort or launch should this click belong to?',
          'Content answers: which version of the link was clicked?',
        ],
      },
      {
        title: 'Pick names before you build links',
        paragraphs: [
          'A UTM builder cannot fix a messy naming plan after the links are already shared. Pick short, boring names before you publish so reports do not split the same campaign into near-duplicates.',
          'For example, choose email instead of switching between Email, e-mail, newsletter, and newsletters for the same medium. The labels do not need to be pretty; they need to be consistent enough that your future report is readable.',
        ],
        bullets: [
          'Use lower-case labels unless your team already has a different rule.',
          'Use hyphens or underscores consistently instead of mixing both.',
          'Use the same campaign name across every channel that belongs to the same launch.',
        ],
      },
      {
        title: 'Existing query values and encoded text',
        paragraphs: [
          'Some landing pages already have query values, such as https://example.com/landing?page=1. The builder keeps that page value and adds the UTM labels after it with ampersands.',
          'The finished URL may encode spaces or punctuation so the link stays valid. That is why a paid-search term like free calculators can appear as free+calculators in the final URL.',
        ],
      },
      {
        title: 'What UTM links do not do',
        paragraphs: [
          'UTM parameters label a click. They do not install analytics, prove a sale happened, hide private data, or guarantee that every platform will keep the URL unchanged.',
          'After copying a campaign URL, test one click if the link matters. Check that the landing page opens, the existing query values still work, and your analytics setup records campaign data the way your team expects.',
        ],
      },
      {
        title: 'Useful related checks',
        paragraphs: [
          'After you build the link, nearby URL tools can help you inspect or clean up the query string before sharing it.',
        ],
        links: [
          { href: '/tools/utm-builder/', label: 'Open the UTM Builder' },
          { href: '/tools/query-string-parser/', label: 'Inspect a finished query string' },
          { href: '/tools/url-encode-decode/', label: 'Encode or decode URL text' },
        ],
      },
    ],
    sidecarText:
      'Open the UTM Builder beside this guide. Try the newsletter example first, then replace the source, medium, campaign, content, and term values with your own naming plan.',
    sources: [sourceLinks.googleCampaignUrls, sourceLinks.mdnUrlSearchParams],
  },
  'query-string-parser': {
    title: 'Query String Parser Guide',
    summary: 'Learn how to decode URL parameters or build an encoded query string from key-value lines.',
    metaDescription:
      'Use the Query String Parser guide to parse URL parameters, group repeated keys, build encoded query strings, and avoid private-token mistakes.',
    purpose:
      'The Query String Parser is for reading and building the part of a URL that comes after the question mark. It helps you see filters, campaign values, repeated keys, and app-state values without mentally decoding percent signs and plus signs.',
    intro:
      'Use it when a link is doing more than it looks like: search filters, page numbers, campaign labels, API test values, or repeated parameters that need to stay visible.',
    inputMatch:
      'a full URL, a raw query string, or one key=value pair per line depending on the mode you choose',
    logicNote:
      'Parse mode takes the query part after the question mark, removes any hash fragment, reads the parameters with URLSearchParams, decodes percent-encoded values, and groups repeated keys as arrays. Build mode reads one key=value line at a time and lets URLSearchParams encode spaces, ampersands, and punctuation for a valid URL query string.',
    readIntro:
      'Read the JSON first, then check duplicate keys and the built query string line so you can spot missing filters, repeated values, or an accidental private value before copying the URL.',
    mistakeIntro:
      'Query string mistakes usually come from treating a public URL like a private note, overlooking repeated keys, or hand-editing encoded characters until the link means something different.',
    bestUsesIntro:
      'Best when you need to inspect URL parameters, debug filters, compare campaign links, or build a small encoded query string without writing code.',
    referenceIntro:
      'These references help check URLSearchParams behavior and the URI syntax rules behind query strings.',
    enter: [
      'Use Parse query when you have a full URL, a raw query string, or text that starts with a question mark.',
      'Use Build query when you have one key=value pair per line, such as q=free calculator and page=2.',
      'Keep private tokens, signed links, email addresses, and personal data out of the input when the URL might be shared or logged.',
    ],
    read: [
      'Parsed output is shown as readable JSON with decoded values.',
      'Built output starts with a question mark and is encoded for use in a URL.',
      'Duplicate keys tells you when the same parameter appears more than once, such as tag=url and tag=developer.',
      'A plus sign in a form-style query value usually means a space after decoding.',
    ],
    mistakes: [
      'Do not assume a query string is secret just because it appears after a question mark.',
      'Do not hand-convert spaces and special characters when the builder can encode them.',
      'Check repeated keys because some apps use them intentionally and others ignore later values.',
      'Do not paste access tokens, session IDs, or signed URLs into a query parser when a harmless sample would answer the same question.',
    ],
    extraSections: [
      {
        title: 'Quick parse example',
        paragraphs: [
          'Say you paste /search?q=free+calculator&tag=url&tag=developer&page=2. The parser shows q as free calculator, tag as two values, and page as 2.',
          'That means the URL is carrying one search phrase, two tag filters, and a second-page state. If a page is showing the wrong results, those three decoded fields are the first things to check.',
        ],
        bullets: [
          'There are 4 parameter entries in the raw query string.',
          'There are 3 parameter names: q, tag, and page.',
          'The repeated tag key keeps both url and developer instead of hiding one of them.',
        ],
      },
      {
        title: 'Build a small API test string',
        paragraphs: [
          'In Build query mode, enter one pair per line: q=free calculator, page=2, tag=url, and tag=developer. The tool returns ?q=free+calculator&page=2&tag=url&tag=developer.',
          'Use that output when a test URL, docs example, or support note needs a clean query string. The builder handles the question mark, ampersands, and encoded space so you do not have to add them by hand.',
        ],
      },
      {
        title: 'Why duplicate keys matter',
        paragraphs: [
          'Some systems use repeated keys on purpose. A store page might use color=blue&color=green, while an API might accept tag=url&tag=developer as two filters.',
          'Other systems only read the first value or the last value. The parser cannot know that product rule, but it makes the repeated values obvious so you can check the app, API, or analytics system you are working with.',
        ],
      },
      {
        title: 'Can I use this for API test links?',
        paragraphs: [
          'Yes, for harmless sample values. It is useful for checking whether a docs example, curl note, or browser test link is passing the values you meant to send.',
          'Use fake IDs and sample text when possible. Real bearer tokens, signed download URLs, customer IDs, and reset links should stay out of public URLs and out of copied troubleshooting notes.',
        ],
      },
      {
        title: 'Useful related checks',
        paragraphs: [
          'After you inspect the query string, nearby URL tools can help you encode one value, build campaign labels, or turn the cleaned URL into a readable slug.',
        ],
        links: [
          { href: '/tools/query-string-parser/', label: 'Open the Query String Parser' },
          { href: '/tools/url-encode-decode/', label: 'Encode or decode one URL value' },
          { href: '/tools/utm-builder/', label: 'Build campaign query parameters' },
          { href: '/tools/slug-generator/', label: 'Make a clean page slug' },
        ],
      },
    ],
    sidecarText:
      'Open the Query String Parser beside this guide. Try the /search?q=free+calculator&tag=url&tag=developer&page=2 example first, then test a harmless query string from your own link.',
    sources: [sourceLinks.mdnUrlSearchParams, sourceLinks.rfc3986],
  },
  'html-entity-encoder-decoder': {
    title: 'HTML Entity Encoder / Decoder Guide',
    summary: 'Learn how HTML entities turn code-sensitive characters into visible text and back again.',
    metaDescription:
      'Use the HTML Entity Encoder / Decoder guide to escape HTML snippets, decode named or numeric entities, read entity counts, and avoid sanitizer mistakes.',
    purpose:
      'The HTML Entity Encoder / Decoder helps with small snippets that need to be shown as text. If you want readers to see a tag instead of the browser treating it like markup, encode the sensitive characters. If you copied entity text and need to read it, decode it.',
    intro:
      'Start with the exact snippet you need to display or read. This guide shows what Encode mode changes, what Decode mode supports, and how to interpret the entity count before you paste the result anywhere important.',
    inputMatch:
      'the mode that matches your job, plus the small HTML or entity-text snippet you want to convert',
    logicNote:
      'Encode mode replaces five HTML-sensitive characters: &, <, >, double quotes, and apostrophes. Decode mode converts the supported named entities amp, apos, copy, gt, lt, nbsp, quot, and reg, plus valid decimal entities such as &#36; and hexadecimal entities such as &#x26;.',
    readIntro:
      'Read the main output first, then check entity count and changed positions. Entity count tells you how many characters or entity codes changed; changed positions is a quick difference signal between input and output.',
    mistakeIntro:
      'Most mistakes come from using the wrong kind of encoding, treating escaped text as a security sanitizer, or pasting decoded markup into a real page before reviewing it.',
    bestUsesIntro:
      'Best for short documentation snippets, examples, copied entity text, and quick checks before placing display-safe text in HTML.',
    referenceIntro:
      'These references explain character references and the people-first content context behind keeping examples clear and honest.',
    enter: [
      'Choose Encode when your text contains characters such as <, >, &, quotes, or apostrophes.',
      'Choose Decode when your text contains entities such as &lt;, &amp;, &quot;, &#36;, or &#x26;.',
      'Paste a small snippet, run the tool, and copy the output only after the entity count looks reasonable.',
    ],
    read: [
      'The output is the copy-ready encoded or decoded text.',
      'Entity count shows how many entity replacements were found.',
      'Changed positions gives a quick signal for how much the output differs from the input.',
      'If entity count is 0, either the snippet did not need conversion or the entity name was outside the compact supported set.',
    ],
    mistakes: [
      'Do not treat entity encoding as a full security sanitizer.',
      'Do not decode unknown HTML and paste it into a live page without reviewing it.',
      'Remember that this tool supports common entities and numeric entity codes, not every named entity ever defined.',
      'Do not use HTML entities for URL query strings; use URL encoding for links and query values.',
    ],
    extraSections: [
      {
        title: 'Quick encode example',
        paragraphs: [
          'Say you paste <strong>Free & fast</strong> in Encode mode. The input has 28 characters, and the tool changes 5 entities.',
          'The output is &lt;strong&gt;Free &amp; fast&lt;/strong&gt;. That means the browser can show the tag text to a reader instead of treating strong as formatting.',
        ],
        bullets: [
          '< becomes &lt; at the opening tag.',
          '> becomes &gt; at the opening and closing tags.',
          '& becomes &amp; between Free and fast.',
          'The closing </strong> also has its angle brackets escaped.',
        ],
      },
      {
        title: 'Decode a quoted span',
        paragraphs: [
          'If you paste &lt;span title=&quot;A&amp;B&quot;&gt;Save&lt;/span&gt; in Decode mode, the tool changes 7 entities and returns <span title="A&B">Save</span>.',
          'That result is easier to read, but it is also real-looking HTML. Review it before putting it into a page, editor, CMS field, or template.',
        ],
      },
      {
        title: 'Numeric entities are supported too',
        paragraphs: [
          'Named entities are only one style. Decimal and hexadecimal numeric entities can represent characters by code point.',
          'For example, Price &#36;9.99 &#x26; no tracking decodes 2 numeric entities into Price $9.99 & no tracking. That tells you &#36; was a dollar sign and &#x26; was an ampersand.',
        ],
      },
      {
        title: 'What this tool does not sanitize',
        paragraphs: [
          'Encoding a snippet helps display it as text. It does not inspect whether a decoded snippet is safe, remove scripts, validate attributes, or decide which tags your site should allow.',
          'If you are handling untrusted user HTML, use a maintained sanitizer with an allowlist. Treat this tool as a display and readability helper, not a security boundary.',
        ],
      },
      {
        title: 'Useful related checks',
        paragraphs: [
          'HTML entity work often sits beside other small developer text checks. Use the neighboring tools when the text belongs to a URL, JSON file, or plain-text cleanup task instead of visible HTML.',
        ],
        links: [
          { href: '/tools/html-entity-encoder-decoder/', label: 'Open the HTML Entity Encoder / Decoder' },
          { href: '/tools/url-encode-decode/', label: 'Encode a URL value instead' },
          { href: '/tools/json-formatter/', label: 'Format JSON before sharing it' },
          { href: '/tools/text-case-converter/', label: 'Clean up text casing' },
        ],
      },
    ],
    sidecarText:
      'Open the HTML Entity Encoder / Decoder beside this guide. Try <strong>Free & fast</strong> in Encode mode first, then decode a harmless entity snippet copied from your own docs.',
    sources: [sourceLinks.mdnCharacterReference, sourceLinks.googleHelpfulContent],
  },
  'css-clamp-calculator': {
    title: 'CSS Clamp Calculator Guide',
    summary: 'Learn how to make fluid CSS sizes with a clamp formula you can copy into a stylesheet.',
    metaDescription:
      'Use the CSS Clamp Calculator guide to enter min/max sizes, viewport range, and root font size, then copy and check a fluid clamp() formula.',
    purpose:
      'The CSS Clamp Calculator turns a minimum size, maximum size, and viewport range into a clamp() formula. This is useful for headings, spacing, and other responsive values that should grow smoothly between mobile and desktop widths.',
    intro:
      'Start with one real design decision, such as making an h1 32px on small screens and 64px on wide screens. The guide below shows what to enter, what the formula means, and what to test before you ship it.',
    inputMatch:
      'the minimum size, maximum size, minimum viewport, maximum viewport, and root font size from the same CSS design decision',
    logicNote:
      'For 32px to 64px across 360px to 1280px with a 16px root font size, the tool returns clamp(2rem, calc(1.217391rem + 3.478261vw), 4rem). At the middle of that viewport range, the value is about 48px, so the formula is easy to sanity-check before copying.',
    readIntro:
      'Copy the clamp() line first, then check the slope, intercept, and middle size. If the middle size feels too large or too small, change the min/max sizes or viewport range before adding the rule to CSS.',
    mistakeIntro:
      'Most bad clamp formulas come from using a viewport range that does not match the layout, forgetting the root font size, or trusting the number before checking real text wrapping in the component.',
    bestUsesIntro:
      'Best when you already know the mobile size, desktop size, and viewport range you want to scale across.',
    referenceIntro:
      'These references help check the CSS clamp() function and the readability/accessibility context behind the browser checks in this guide.',
    enter: [
      'Enter the smallest size and largest size in pixels, such as 32px and 64px for a fluid heading.',
      'Enter the viewport width where scaling should start and stop, such as 360px and 1280px.',
      'Use your site root font size, usually 16px unless your CSS changes html font-size.',
    ],
    read: [
      'The main answer is the clamp() formula to copy into CSS.',
      'Slope explains the vw part of the formula, which is the part that grows with viewport width.',
      'Intercept is the rem anchor that makes the preferred value hit your chosen min and max points.',
      'Middle size shows the approximate value halfway through the viewport range.',
    ],
    mistakes: [
      'Do not assume fluid type fixes every responsive design issue.',
      'Do not use 100vw scaling when the component lives in a much narrower container unless you have tested that layout.',
      'Do not forget to update root font size if your project changes the browser default.',
      'Check text wrapping, line length, zoom behavior, and tap targets on real viewport sizes.',
      'Keep minimum and maximum sizes readable instead of scaling purely for visual drama.',
    ],
    extraSections: [
      {
        title: 'Quick example',
        paragraphs: [
          'Say your h1 should be 32px on a 360px phone layout and 64px on a 1280px desktop layout. With a 16px root font size, enter 32, 64, 360, 1280, and 16.',
          'The calculator returns clamp(2rem, calc(1.217391rem + 3.478261vw), 4rem). That means the browser never goes below 2rem, grows through the rem-plus-vw middle value, and stops at 4rem.',
        ],
      },
      {
        title: 'What the formula parts mean',
        paragraphs: [
          'The first value is the floor. The last value is the ceiling. The middle value is the fluid part that grows as the viewport gets wider.',
        ],
        bullets: [
          '2rem is the 32px minimum when the root font size is 16px.',
          '3.478261vw is the viewport-based slope.',
          '1.217391rem is the intercept that keeps the line aligned with the min and max points.',
          '4rem is the 64px maximum.',
        ],
      },
      {
        title: 'Use it for spacing too',
        paragraphs: [
          'clamp() is not only for font-size. You can use the same idea for padding, margin, gaps, and other CSS values that should grow gently.',
          'For example, 24px to 72px from 360px to 1440px with a 16px root gives clamp(1.5rem, calc(0.5rem + 4.444444vw), 4.5rem). For spacing, check small screens carefully so the formula does not crowd the content.',
        ],
      },
      {
        title: 'Browser checks before shipping',
        paragraphs: [
          'After you copy the formula, test the real component instead of only trusting the calculator. Resize the browser, zoom the page, and try the longest heading or label that might appear.',
          'If the text wraps badly, the issue may be container width, line height, font choice, or content length. The clamp formula controls size, not the whole layout.',
        ],
      },
      {
        title: 'Useful related checks',
        paragraphs: [
          'When the formula is ready, check the surrounding design too. Fluid text still needs enough contrast, and layout media often needs a stable aspect ratio.',
        ],
        links: [
          { href: '/tools/css-clamp-calculator/', label: 'Open the CSS Clamp Calculator' },
          { href: '/tools/color-contrast-checker/', label: 'Check text color contrast' },
          { href: '/tools/aspect-ratio-calculator/', label: 'Scale a width or height with the same ratio' },
        ],
      },
    ],
    sidecarText:
      'Open the CSS Clamp Calculator beside this guide. Try the 32px to 64px heading example first, then replace the sizes and viewport range with your own design values.',
    sources: [sourceLinks.mdnCssClamp, sourceLinks.wcagContrast],
  },
  'ai-token-cost-calculator': {
    title: 'AI Token Cost Calculator Guide',
    summary: 'Learn how input tokens, output tokens, request count, and current model prices turn into an AI usage estimate.',
    metaDescription:
      'Use the AI Token Cost Calculator guide to estimate LLM API spend from requests, input tokens, output tokens, and prices per 1M tokens.',
    purpose:
      'The AI Token Cost Calculator helps you do model-budget math without pretending any one price is permanent. You enter your own current input and output prices, then the calculator shows input cost, output cost, total cost, and cost per request.',
    intro:
      'AI usage can feel cheap one request at a time, then get surprising when a feature runs thousands of times. This guide shows how to turn request count, token counts, and prices per 1M tokens into a cost estimate you can sanity-check before a prototype or budget conversation.',
    inputMatch:
      'the request count, average input tokens, average output tokens, and current input/output prices for the same model and billing plan',
    logicNote:
      'For 10,000 requests with 1,200 input tokens and 500 output tokens per request, $2 input per 1M tokens and $8 output per 1M tokens gives $24 input cost plus $40 output cost. The total is $64, or $0.0064 per request.',
    readIntro:
      'Read the total as a planning estimate. The input/output split tells you whether long prompts, retrieved context, or long answers are driving the cost.',
    mistakeIntro:
      'Most bad AI cost estimates come from stale price cards, mixing price units, forgetting hidden prompt/context tokens, or treating cached-token and batch pricing as if it were included automatically.',
    bestUsesIntro:
      'Best when you already have a rough request count, token estimate, and current provider price card for the model you plan to test.',
    referenceIntro:
      'These references help check token counting, tokenizer behavior, and the people-first writing standard behind this guide.',
    enter: [
      'Enter the request count for the period you care about, such as one day, one month, or one prototype test.',
      'Enter average input tokens per request, including system instructions, user text, retrieved context, chat history, and tool messages.',
      'Enter average output tokens per request, which is the model response length you expect.',
      'Enter current input and output prices per 1 million tokens from the provider rate card for the same model.',
    ],
    read: [
      'Total cost is the estimated bill for the requests you entered.',
      'Input token cost and output token cost are split so you can see which side drives the budget.',
      'Cost per request is useful when comparing models or deciding whether a feature can scale.',
      'If cost per request looks tiny, multiply it by real traffic before deciding it is safe.',
    ],
    mistakes: [
      'Do not use old model prices from memory.',
      'Do not forget that long system prompts, retrieved context, and tool messages can be input tokens too.',
      'Do not assume cached tokens, batch discounts, free credits, taxes, or minimum charges are included.',
      'Do not compare two models unless the request count and token assumptions are the same.',
      'Do not treat a rough text token estimate as an exact bill. Check real usage logs once the feature runs.',
    ],
    extraSections: [
      {
        title: 'Quick formula',
        paragraphs: [
          'The calculator keeps input and output separate because many AI providers charge different rates for each side.',
          'Input cost = input tokens per request * request count / 1,000,000 * input price per 1M tokens. Output cost uses the same pattern with output tokens and output price. Total cost is both sides added together.',
        ],
      },
      {
        title: 'Example: support bot month',
        paragraphs: [
          'Say you expect 10,000 support-bot requests in a month. Each request sends about 1,200 input tokens and gets about 500 output tokens back. You enter $2 per 1M input tokens and $8 per 1M output tokens as example prices.',
          'The input side is 12,000,000 tokens, so input cost is $24. The output side is 5,000,000 tokens, so output cost is $40. Total cost is $64, and cost per request is $0.0064.',
        ],
        bullets: [
          'If output answers get longer, the output cost rises first.',
          'If retrieved context or chat history grows, the input cost rises first.',
          'If traffic doubles and everything else stays the same, the estimated bill doubles.',
        ],
      },
      {
        title: 'Two more sanity checks',
        paragraphs: [
          'A small prototype with 1,000 requests, 300 input tokens, 150 output tokens, $0.15 input, and $0.60 output per 1M comes out to $0.135 total. That is useful for a tiny test, but it does not predict production traffic.',
          'A long-summary workflow with 2,000 requests, 8,000 input tokens, 700 output tokens, $1.25 input, and $5 output per 1M comes out to $27 total. That shows how long documents can make input cost the main driver.',
        ],
      },
      {
        title: 'Where estimates drift',
        paragraphs: [
          'Real bills can move away from the estimate when the model provider changes prices, your app adds hidden system text, users paste longer content, or the feature retries failed requests.',
          'Cached-token pricing, batch jobs, free credits, plan minimums, taxes, image/audio/video tools, retrieval systems, hosting, and monitoring are separate from this token-only calculation unless you adjust the inputs yourself.',
        ],
      },
      {
        title: 'Useful related checks',
        paragraphs: [
          'AI cost planning often starts with token length, then expands into general API pricing and content workflow choices. Use the related tools when you need a rough prompt length, a provider-neutral API cost estimate, or a shorter text sample.',
        ],
        links: [
          { href: '/tools/ai-token-cost-calculator/', label: 'Open the AI Token Cost Calculator' },
          { href: '/tools/prompt-token-estimator/', label: 'Estimate prompt tokens first' },
          { href: '/tools/api-pricing-calculator/', label: 'Estimate broader API costs' },
          { href: '/tools/text-summarizer/', label: 'Shorten text before estimating' },
        ],
      },
    ],
    sidecarText:
      'Open the AI Token Cost Calculator beside this guide. Try the support-bot month example first, then replace the request count, token counts, and prices with your own model assumptions.',
    sources: [sourceLinks.openAiTokens, sourceLinks.openAiTokenizer, sourceLinks.googleHelpfulContent],
  },
  'prompt-token-estimator': {
    title: 'Prompt Token Estimator Guide',
    summary: 'Learn how to use a rough character-based token estimate before checking an exact model tokenizer.',
    metaDescription:
      'Use the Prompt Token Estimator guide to estimate AI prompt tokens from characters, words, average characters per token, and a low-high range.',
    purpose:
      'The Prompt Token Estimator is a fast planning tool. It counts characters and uses a simple average characters-per-token assumption so you can quickly compare prompt drafts before using an exact tokenizer.',
    intro:
      'A prompt can look short in the editor and still take more room than you expected once system instructions, examples, URLs, and pasted context are included. This guide shows how to use a rough prompt token estimate before you test the final text with the exact tokenizer for your model.',
    inputMatch:
      'the prompt text you plan to send, plus a realistic average characters-per-token value for the kind of text you are drafting',
    logicNote:
      'The rough estimate is character count divided by the selected average characters per token, rounded up. The guide range uses character count divided by 5 for the low estimate and divided by 3 for the high estimate, so a 1,500-character prompt at 4 characters per token estimates 375 tokens with a rough range of 300 to 500.',
    readIntro:
      'Read the result as a planning range, not a billing record. It is most useful for comparing two prompt drafts, checking whether hidden context may push a request higher, or deciding whether to shorten instructions before a real tokenizer check.',
    mistakeIntro:
      'Most bad prompt estimates happen when people paste only the visible user message and forget system prompts, chat history, retrieved context, examples, tool messages, code, URLs, emojis, or non-English text.',
    bestUsesIntro:
      'Best when you need a fast browser-side sanity check before opening a model-specific tokenizer, usage dashboard, or API cost calculator.',
    referenceIntro:
      'These references explain why tokens are model-specific and why helpful content should name limits instead of pretending a rough estimate is exact.',
    enter: [
      'Paste the prompt, instruction, or system message you want to estimate.',
      'Leave average characters per token at 4 for a normal rough estimate, or adjust it if you know your text behaves differently.',
      'Include any reusable system instructions, few-shot examples, pasted context, or policy text if they will be sent with the request.',
      'Use the examples to see how short instructions, longer system notes, and large context blocks compare.',
    ],
    read: [
      'Estimated tokens is the main rough answer from your selected characters-per-token value.',
      'Low and high estimates show the planning range so you can avoid treating one number as exact.',
      'Characters and words help you compare prompt drafts in normal writing terms before checking the exact tokenizer.',
      'If the range is already close to your budget or model context limit, shorten the prompt before relying on the exact tokenizer to save it.',
    ],
    mistakes: [
      'Do not use this as an exact billing tokenizer.',
      'Do not assume code, URLs, punctuation-heavy text, emojis, or non-English text splits like normal English.',
      'Do not forget that chat history and hidden system/tool messages may also count in a real request.',
      'Do not compare two prompts unless you pasted the same kind of hidden context for both.',
      'Do not use the estimate as proof that a prompt fits a model context window. Check the final request with the model tokenizer or usage logs.',
    ],
    extraSections: [
      {
        title: 'Quick formula',
        paragraphs: [
          'The estimator uses character count because it is fast, private, and easy to compare across drafts. It does not try to reproduce a provider tokenizer.',
          'Estimated tokens = ceiling(character count / selected average characters per token). Low estimate = ceiling(character count / 5). High estimate = ceiling(character count / 3).',
        ],
      },
      {
        title: 'Example: short prompt draft',
        paragraphs: [
          'A 480-character instruction at the default 4 characters per token estimates 120 tokens. The rough range is 96 to 160 tokens.',
          'That is a small prompt by itself, but the number changes if your app also adds a system prompt, chat history, retrieved notes, or tool instructions.',
        ],
        bullets: [
          'Use this for comparing two small rewrites.',
          'Do not assume the visible message is the whole request.',
          'Check the exact tokenizer before final billing or context-window decisions.',
        ],
      },
      {
        title: 'Example: system prompt with rules',
        paragraphs: [
          'A 1,500-character system prompt at 4 characters per token estimates 375 tokens, with a range of 300 to 500. That range is wide on purpose because symbols, bullet formatting, and code-like text can tokenize differently.',
          'If the prompt repeats across every request, multiply its token estimate by request count when you move into cost planning.',
        ],
      },
      {
        title: 'Example: large pasted context',
        paragraphs: [
          'A 2,400-character chunk of pasted context at 3.5 characters per token estimates 686 tokens, with a range of 480 to 800. The lower characters-per-token value is a useful caution when text contains dense names, URLs, or formatting.',
          'If you are building retrieval or summarization workflows, run a few real samples through the exact tokenizer before picking chunk sizes.',
        ],
      },
      {
        title: 'Where estimates drift',
        paragraphs: [
          'Real token counts can drift because tokenizers split words, whitespace, symbols, code, non-English text, and emojis differently. Provider dashboards may also include system messages, tool calls, retries, retrieved context, and assistant output.',
          'Use the estimator to plan and compare drafts. Use the model tokenizer, API response usage, or billing dashboard when the exact number matters.',
        ],
      },
      {
        title: 'Useful related checks',
        paragraphs: [
          'Prompt length is usually only the first planning question. Once you have a rough token count, estimate cost, compare API pricing, or shorten the source text before sending it.',
        ],
        links: [
          { href: '/tools/prompt-token-estimator/', label: 'Open the Prompt Token Estimator' },
          { href: '/tools/ai-token-cost-calculator/', label: 'Estimate AI token cost' },
          { href: '/tools/api-pricing-calculator/', label: 'Compare broader API pricing' },
          { href: '/tools/text-summarizer/', label: 'Shorten text before estimating' },
        ],
      },
    ],
    sidecarText:
      'Open the Prompt Token Estimator beside this guide. Paste a short prompt, a system message, and a larger context block so you can see how the rough range changes before checking a model tokenizer.',
    sources: [sourceLinks.openAiTokens, sourceLinks.openAiTokenizer, sourceLinks.googleHelpfulContent],
  },
  'api-pricing-calculator': {
    title: 'API Pricing Calculator Guide',
    summary: 'Learn how requests, billable units, unit price, fixed fees, and overhead combine into an API cost estimate.',
    metaDescription:
      'Use the API Pricing Calculator guide to estimate request cost, billable units, fixed fees, retry overhead, total API spend, and average cost per request.',
    purpose:
      'The API Pricing Calculator is for provider-neutral cost planning. It works for APIs that bill by request, credit, image, second, message, GB, token, or any other simple unit.',
    intro:
      'API bills often look harmless because the unit price is tiny. The surprise comes when a feature runs thousands of jobs, retries failed calls, or adds a monthly platform fee. This guide shows how to turn those pricing pieces into one clear estimate before you ship the workflow.',
    inputMatch:
      'your expected request count, the billable units each request uses, the provider price converted to one unit, any fixed fee, and a realistic retry or overhead cushion',
    logicNote:
      'Billable units = requests x units per request x (1 + overhead percent / 100). Usage cost = billable units x price per unit. Total cost = usage cost + fixed fee. Average cost per request = total cost / requests.',
    readIntro:
      'Read the result as planning math, not a live invoice. It is best for comparing two API plans, checking whether a feature is in the right cost range, or deciding whether retries and background jobs need a bigger budget.',
    mistakeIntro:
      'Most bad API cost estimates come from mixing price units, forgetting fixed fees, leaving retries at zero, or treating free tiers and tiered pricing as if they are included automatically.',
    bestUsesIntro:
      'Best when you need a quick, private browser-side estimate before using a provider billing calculator, real usage logs, or an accounting export.',
    referenceIntro:
      'These references help explain token-style unit counting and why useful content should name pricing limits instead of pretending one generic calculator knows every provider rule.',
    enter: [
      'Enter the number of API requests, jobs, messages, images, events, or tasks you expect.',
      'Enter how many billable units one request uses. A request may use one image, three credits, many tokens, several seconds, or a measured amount of data.',
      'Enter the price for one billable unit. If the provider lists a price per 1,000 units or per 1 million units, divide first so the field gets a single-unit price.',
      'Add a fixed fee when there is a monthly platform fee, minimum spend, support fee, or base subscription.',
      'Add a retry or overhead percent when failed calls, queue replays, logs, background jobs, or traffic bursts are realistic.',
    ],
    read: [
      'Billable units shows the request count after units per request and overhead are applied.',
      'Usage cost is the variable cost before any fixed fee.',
      'Total cost includes usage cost plus the fixed fee.',
      'Average cost per request helps compare pricing options at the same volume, especially when one plan has a fixed fee and another does not.',
      'If the average cost looks higher than expected, check whether the fixed fee or overhead percent is driving the result.',
    ],
    mistakes: [
      'Do not mix price per 1,000 units, per 1 million units, and per single unit in the same input.',
      'Do not compare two plans unless the request count, units per request, fixed fee, and overhead assumptions are the same.',
      'Do not ignore free tiers, taxes, credits, minimum charges, regional pricing, currency conversion, volume tiers, or plan-specific rounding.',
      'Do not use a zero overhead value when retries, failed calls, queue replays, or logging jobs happen in normal use.',
      'Do not enter secret keys or customer data; only pricing numbers are needed.',
    ],
    extraSections: [
      {
        title: 'Quick formula',
        paragraphs: [
          'The calculator separates usage cost from fixed cost so you can see which part is doing the damage. That matters because a plan with a cheap unit price can still be expensive when a fixed fee is spread across a small number of requests.',
          'Billable units = requests x units per request x (1 + overhead percent / 100). Usage cost = billable units x price per unit. Total cost = usage cost + fixed fee. Average cost per request = total cost / requests.',
        ],
      },
      {
        title: 'Example: image API feature',
        paragraphs: [
          'Say a small feature expects 1,000 image requests. Each request creates 1 image, the provider price is $0.04 per image, and you add 5% overhead for retries or failed jobs.',
          'The calculator estimates 1,050 billable units and a $42 total cost. The average cost is $0.042 per request. That extra 5% is small here, but it is still real money once volume grows.',
        ],
        bullets: [
          'Requests: 1,000',
          'Units per request: 1 image',
          'Price per unit: $0.04',
          'Overhead: 5%',
          'Fixed fee: $0',
        ],
      },
      {
        title: 'Example: message API month',
        paragraphs: [
          'Now imagine an internal message workflow with 50,000 requests, 1 billable message per request, a $0.002 unit price, a $10 fixed monthly fee, and 3% overhead.',
          'The calculator estimates 51,500 billable units, $103 in usage cost, $113 total cost, and about $0.00226 per request. The fixed fee is small in total, but it still changes the average cost.',
        ],
      },
      {
        title: 'Example: credit bundle automation',
        paragraphs: [
          'Some APIs charge credits instead of requests. If 20,000 jobs use 3 credits each, each credit costs $0.0005, and you add 10% overhead, the estimate becomes 66,000 billable units.',
          'That produces a $33 total cost before any plan-specific discounts, taxes, or free credits. This is why units per request matters as much as request count.',
        ],
      },
      {
        title: 'Compare two plans without fooling yourself',
        paragraphs: [
          'To compare plans, keep the request count, units per request, fixed fee type, and overhead percent consistent. Then change only the price per unit or the fixed fee you are testing.',
          'Cost is not the whole decision. Rate limits, latency, support, reliability, data retention, regional availability, and privacy terms can matter more than a tiny unit-price difference.',
        ],
        bullets: [
          'Use the same volume for both plans.',
          'Convert both prices to one unit before comparing.',
          'Run a second estimate if one plan has a free tier or volume tier.',
          'Check real logs once the feature is live.',
        ],
      },
      {
        title: 'Where the estimate stops',
        paragraphs: [
          'This guide does not know your provider contract. Free credits, tiered pricing, batch discounts, cached-token prices, failed-call rules, minimum spend, taxes, currency conversion, and invoice rounding can all change the final bill.',
          'Use the calculator for planning and comparison. Use provider documentation, account usage dashboards, billing exports, or invoices when you need the exact number.',
        ],
      },
      {
        title: 'Useful related checks',
        paragraphs: [
          'API cost planning often starts with a general billable-unit estimate, then narrows into token cost, prompt length, campaign tracking, or request debugging. Use the matching tool when you want to test the numbers from this guide.',
        ],
        links: [
          { href: '/tools/api-pricing-calculator/', label: 'Open the API Pricing Calculator' },
          { href: '/tools/ai-token-cost-calculator/', label: 'Estimate AI token cost' },
          { href: '/tools/prompt-token-estimator/', label: 'Estimate prompt tokens first' },
          { href: '/tools/query-string-parser/', label: 'Inspect API query strings' },
        ],
      },
    ],
    sidecarText:
      'Open the API Pricing Calculator beside this guide. Try the image API example first, then replace the request count, unit price, fixed fee, and overhead with your own provider assumptions.',
    sources: [sourceLinks.googleHelpfulContent, sourceLinks.openAiTokens],
  },
  'download-time-calculator': {
    title: 'Download Time Calculator Guide',
    summary: 'Learn how file size, Mbps speed, and realistic efficiency estimate download time.',
    metaDescription:
      'Use the Download Time Calculator guide to estimate file transfer time from KB, MB, GB, or TB size, Mbps speed, and a realistic efficiency percent.',
    purpose:
      'The Download Time Calculator turns a file size into bits, adjusts your connection speed by an efficiency percentage, and estimates how long a game, app, video, or backup may take.',
    intro:
      'It is most useful before you start a large game download, cloud backup, video file, or system image and want to know whether the wait is closer to minutes or hours.',
    inputMatch:
      'the file size, file unit, download speed in Mbps, and efficiency percent you want to test',
    logicNote:
      'The guide and tool use decimal units: 1 GB is 1,000,000,000 bytes. A 50 GB game on a 100 Mbps connection at 85% efficiency is about 1h 18m 26s, while a 700 MB update at 25 Mbps and 90% efficiency is about 4m 9s.',
    readIntro:
      'Read the estimated duration first, then check effective Mbps. If effective Mbps is much lower than the advertised speed, the efficiency setting is doing the useful reality check.',
    mistakeIntro:
      'Most bad estimates come from mixing bits and bytes, using the wrong speed direction, or treating a perfect advertised speed as the speed the download server will actually deliver.',
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
      'Do not use download speed for cloud backup or file upload unless that number is really your upload speed.',
      'Do not treat the time estimate as a data-cap check. A fast download can still use a large part of a monthly allowance.',
    ],
    extraSections: [
      {
        title: 'Example: a 50 GB game update',
        paragraphs: [
          'Say the download is 50 GB, your speed test is close to 100 Mbps, and you use 85% efficiency because the connection is good but not perfect. The calculator converts 50 GB to bits, applies 85 Mbps as the effective speed, and estimates about 1h 18m 26s.',
          'That answer is a planning estimate. If the game server is busy, your Wi-Fi drops, a VPN adds overhead, or another device starts streaming, the real wait can be longer.',
        ],
      },
      {
        title: 'When the estimate changes',
        paragraphs: [
          'Use a lower efficiency percent when the connection is on crowded Wi-Fi, the router is old, a VPN is on, the server is throttling, or other people are sharing the same connection.',
          'Use your upload speed instead when you are sending files to cloud storage, uploading video, or backing up a computer. Many internet plans have much lower upload speed than download speed.',
        ],
      },
      {
        title: 'Useful related checks',
        paragraphs: [
          'Download time is only one network question. You may also need to compare bandwidth, estimate how much speed a household needs, or check video bitrate data use.',
        ],
        links: [
          { href: '/tools/download-time-calculator/', label: 'Open the Download Time Calculator' },
          { href: '/tools/bandwidth-calculator/', label: 'Compare bandwidth units' },
          { href: '/tools/internet-speed-needs-calculator/', label: 'Estimate household internet speed needs' },
          { href: '/tools/streaming-bitrate-calculator/', label: 'Estimate streaming bitrate data use' },
        ],
      },
    ],
    sidecarText:
      'Open the Download Time Calculator beside this guide. Try the 50 GB game example first, then replace the file size, Mbps speed, and efficiency percent with your own download.',
    sources: [sourceLinks.nistUnits],
  },
  'internet-speed-needs-calculator': {
    title: 'Internet Speed Needs Calculator Guide',
    summary: 'Learn how simultaneous streaming, gaming, calls, smart devices, and buffer produce a rough Mbps plan.',
    metaDescription:
      'Use the Internet Speed Needs Calculator guide to estimate household Mbps from simultaneous streams, gaming, video calls, smart devices, and buffer percent.',
    purpose:
      'The Internet Speed Needs Calculator estimates a household or workspace download-speed target by adding the activities that may happen at the same time, then adding a buffer.',
    intro:
      'It is most useful before comparing internet plans, moving homes, setting up a shared workspace, or trying to explain why the same plan can feel fine one night and crowded the next.',
    inputMatch:
      'the video streams, Mbps per stream, gaming devices, Mbps per gaming device, video calls, Mbps per call, smart devices, Mbps per smart device, and buffer percent you want to test',
    logicNote:
      'Base Mbps = video load + gaming load + call load + smart-device load. Recommended Mbps = base Mbps * (1 + buffer percent / 100). A small household example with 1 HD stream, 1 gamer, 1 call, 4 smart devices, and 25% buffer returns 23.75 Mbps.',
    readIntro:
      'Read recommended download speed first, then compare the base activity need and the activity-load metrics. Those smaller numbers show whether streaming, calls, gaming, or background devices are driving the estimate.',
    mistakeIntro:
      'Most bad plan estimates come from ignoring simultaneous use, upload speed, Wi-Fi coverage, latency, or data caps. Mbps is the size of the pipe, not a guarantee that every room and every app will feel good.',
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
      'Do not treat a fast Mbps estimate as a monthly data-cap estimate. A fast plan can still run out of included data.',
      'Do not compare plans only by the advertised download number if the upload speed is much lower.',
    ],
    extraSections: [
      {
        title: 'Example: a small household',
        paragraphs: [
          'Say one HD stream uses 8 Mbps, one gaming device uses 5 Mbps, one video call uses 4 Mbps, and four smart devices use 0.5 Mbps each. The base need is 19 Mbps. With a 25% buffer, the recommended speed is 23.75 Mbps.',
          'That does not mean a 25 Mbps plan will always feel perfect. Weak Wi-Fi, high latency, provider congestion, or a low upload speed can still make calls or games feel rough.',
        ],
      },
      {
        title: 'Examples for busier homes',
        paragraphs: [
          'A 4K evening with three 25 Mbps streams, one gaming device, eight smart devices, and a 30% buffer estimates 109.2 Mbps. A work-from-home setup with one HD stream, three video calls, six smart devices, and a 35% buffer estimates 31.05 Mbps.',
          'Use those as planning examples, not universal rules. If your streaming quality, call platform, camera resolution, router, or plan upload speed is different, adjust the per-activity Mbps before comparing plans.',
        ],
      },
      {
        title: 'Useful related checks',
        paragraphs: [
          'Speed need, download time, bandwidth conversion, and streaming data use are connected but different questions. Use the neighboring tools when the next question is about file time or bitrate data use instead of plan size.',
        ],
        links: [
          { href: '/tools/internet-speed-needs-calculator/', label: 'Open the Internet Speed Needs Calculator' },
          { href: '/tools/download-time-calculator/', label: 'Estimate a download time' },
          { href: '/tools/bandwidth-calculator/', label: 'Compare bandwidth and transfer units' },
          { href: '/tools/streaming-bitrate-calculator/', label: 'Estimate streaming bitrate data use' },
        ],
      },
    ],
    sidecarText:
      'Open the Internet Speed Needs Calculator beside this guide. Try the small household example first, then replace the activity counts, per-device Mbps values, and buffer percent with your own peak-use moment.',
    sources: [sourceLinks.nistUnits],
  },
  'streaming-bitrate-calculator': {
    title: 'Streaming Bitrate Calculator Guide',
    summary: 'Learn how bitrate and duration turn into estimated stream or recording data use.',
    metaDescription:
      'Use the Streaming Bitrate Calculator guide to estimate stream or recording data use from bitrate, duration, stream count, MB, GB, and variable-bitrate limits.',
    purpose:
      'The Streaming Bitrate Calculator helps creators, students, streamers, and site owners understand how much data a fixed bitrate can use over time.',
    intro:
      'It is useful before a livestream, class recording, camera setup, podcast export, or long video upload where a small bitrate choice can turn into several gigabytes.',
    inputMatch:
      'the bitrate, bitrate unit, hours, minutes, and stream count you want to test',
    logicNote:
      'Mbps = Kbps / 1,000 when needed. Total seconds = (hours * 3,600 + minutes * 60) * streams. Megabits = Mbps * total seconds. MB = megabits / 8. GB = MB / 1,000. A 6 Mbps stream for 2 hours uses about 5.4 GB.',
    readIntro:
      'Read gigabytes first if you care about storage, mobile data, or upload allowance. Use megabytes for smaller audio examples and megabits when you want to audit the raw bitrate math.',
    mistakeIntro:
      'The big mistake is treating bitrate like a perfect file-size promise. Variable bitrate, adaptive streaming, audio tracks, subtitles, chat, thumbnails, previews, retransmits, and platform processing can all move the real number.',
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
      'Do not use the data-use estimate as an upload-speed guarantee. Live streaming usually needs upload headroom above the stream bitrate.',
      'Do not mix decimal GB from this calculator with binary GiB from a storage app without expecting a small difference.',
    ],
    extraSections: [
      {
        title: 'Example: one 1080p stream',
        paragraphs: [
          'A 6 Mbps stream for 2 hours has 7,200 seconds. The calculator multiplies 6 Mbps by 7,200 seconds, giving 43,200 megabits. Divide by 8 to get 5,400 MB, then divide by 1,000 to get 5.4 GB.',
          'That number is a planning estimate. It helps you check whether a data cap, mobile hotspot, storage card, or upload window is in the right range before the event starts.',
        ],
      },
      {
        title: 'Examples for audio and multiple cameras',
        paragraphs: [
          'A 320 Kbps audio stream for 3.5 hours uses about 504 MB, or 0.504 GB. Two cameras at 4.5 Mbps for 1 hour 45 minutes use about 7.0875 GB together because the stream count doubles the runtime load.',
          'If each camera has a different bitrate, calculate each group separately and add the GB totals. That is safer than pretending every feed uses the same setting.',
        ],
      },
      {
        title: 'Useful related checks',
        paragraphs: [
          'Bitrate data use, download time, bandwidth conversion, and plan speed are connected but not identical. Use the related tools when your next question changes from file size to transfer time or internet plan speed.',
        ],
        links: [
          { href: '/tools/streaming-bitrate-calculator/', label: 'Open the Streaming Bitrate Calculator' },
          { href: '/tools/download-time-calculator/', label: 'Estimate a download time' },
          { href: '/tools/bandwidth-calculator/', label: 'Compare bandwidth and transfer units' },
          { href: '/tools/internet-speed-needs-calculator/', label: 'Estimate internet plan speed needs' },
        ],
      },
    ],
    sidecarText:
      'Open the Streaming Bitrate Calculator beside this guide. Try the 6 Mbps, 2 hour example first, then change the bitrate, duration, unit, and stream count to match your encoder or recording setup.',
    sources: [sourceLinks.nistUnits],
  },
  'device-battery-life-calculator': {
    title: 'Device Battery Life Calculator Guide',
    summary: 'Learn how mAh, voltage, watts, and efficiency estimate battery runtime.',
    metaDescription:
      'Use the Device Battery Life Calculator guide to estimate battery runtime from mAh, voltage, device watts, efficiency loss, watt-hours, and usable Wh.',
    purpose:
      'The Device Battery Life Calculator converts battery capacity into watt-hours, applies a realistic efficiency loss, and divides by device power draw to estimate runtime.',
    intro:
      'It is useful before choosing a USB power bank, planning an off-grid device, checking a small camera setup, or comparing batteries that advertise capacity in different units.',
    inputMatch:
      'the battery capacity in mAh, nominal battery voltage, average device watts, and efficiency percent you want to test',
    logicNote:
      'Watt-hours = (mAh / 1,000) * volts. Usable watt-hours = watt-hours * efficiency / 100. Runtime hours = usable watt-hours / device watts. Runtime minutes = runtime hours * 60. A 10,000 mAh, 3.7 V battery running an 8 W device at 85% efficiency returns about 3h 55m 53s and 31.45 usable Wh.',
    readIntro:
      'Read runtime first, then check nominal energy and usable energy. Nominal Wh shows what the battery stores before losses; usable Wh is the number the calculator actually divides by the device watts.',
    mistakeIntro:
      'Battery runtime estimates go wrong when mAh is compared across different voltages, when device watts are guessed too low, or when the battery is treated like it can deliver its full label capacity in every condition.',
    enter: [
      'Enter battery capacity in mAh from the cell, pack, or power-bank label.',
      'Enter the nominal voltage for that battery, not just the output port voltage unless the label only gives output-side data.',
      'Enter the device average power draw in watts, then use efficiency to account for conversion loss, heat, cables, and imperfect battery use.',
    ],
    read: [
      'Estimated runtime is the main answer.',
      'Nominal energy is the battery watt-hours before efficiency loss.',
      'Usable energy is the watt-hours after the efficiency percentage.',
    ],
    mistakes: [
      'Do not compare batteries by mAh alone when voltage is different.',
      'Do not assume a device draws the same watts all the time.',
      'Do not enter peak watts if you want average runtime, or average watts if you are checking whether a short peak load will shut the battery down.',
      'Do not ignore voltage converters, inverters, long cables, low-battery cutoff, or manufacturer discharge limits.',
      'Do not expect old, cold, hot, damaged, or heavily loaded batteries to match the estimate.',
    ],
    extraSections: [
      {
        title: 'Example: USB power bank runtime',
        paragraphs: [
          'A 10,000 mAh power bank with 3.7 V cells stores 37 Wh before losses. At 85% efficiency, usable energy is 31.45 Wh. If the device averages 8 W, runtime is 31.45 / 8 = 3.93125 hours, or about 3h 55m 53s.',
          'That is a better planning number than 10,000 mAh by itself because the device uses watts, and the USB conversion step loses some energy along the way.',
        ],
      },
      {
        title: 'Examples for small and larger packs',
        paragraphs: [
          'A 5,000 mAh, 3.7 V pack powering a 3 W device at 90% efficiency gives 16.65 usable Wh and about 5h 33m. A 5,000 mAh, 11.1 V pack powering a 30 W device at 88% efficiency gives 48.84 usable Wh and about 1h 37m 41s.',
          'The second battery has the same mAh but a much higher voltage, so it stores much more watt-hour energy. That is why watt-hours are safer for comparing packs than mAh alone.',
        ],
      },
      {
        title: 'When the estimate can be wrong',
        paragraphs: [
          'Real runtime moves when the device cycles between idle and high load, the battery is old, the room is very cold or hot, or the battery management system cuts off early to protect the cells.',
          'If the device has motors, radios, heaters, bright screens, inverters, or startup spikes, run a conservative version of the calculation too. A lower efficiency percent or a higher average watts value gives you a safer planning estimate.',
        ],
      },
      {
        title: 'Useful related checks',
        paragraphs: [
          'Battery runtime, electricity use, download time, and unit conversion are related but different questions. Use the neighboring tools when you need energy cost, transfer time, or a unit conversion rather than runtime from a battery pack.',
        ],
        links: [
          { href: '/tools/device-battery-life-calculator/', label: 'Open the battery runtime calculator' },
          { href: '/tools/electricity-calculator/', label: 'Estimate electricity use' },
          { href: '/tools/download-time-calculator/', label: 'Estimate a download time' },
          { href: '/tools/conversion-calculator/', label: 'Convert related units' },
        ],
      },
    ],
    sidecarText:
      'Open the Device Battery Life Calculator beside this guide. Try the 10,000 mAh power-bank example first, then replace the mAh, voltage, watts, and efficiency with your own battery and device.',
    sources: [sourceLinks.nistUnits],
  },
  'monitor-ppi-calculator': {
    title: 'Monitor PPI Calculator Guide',
    summary: 'Learn how screen resolution and diagonal size combine into pixels per inch.',
    metaDescription:
      'Use the Monitor PPI Calculator guide to estimate screen pixel density, pixel diagonal, and aspect ratio from resolution and diagonal inches.',
    purpose:
      'The Monitor PPI Calculator helps compare display sharpness by using pixel resolution and physical diagonal size together. Resolution alone is not enough because screen size changes pixel density.',
    intro:
      'It is useful when comparing a 24-inch 1080p monitor, a 27-inch 1440p monitor, a 32-inch 4K monitor, a laptop screen, a tablet, or a TV before deciding whether the screen is dense enough for your viewing distance.',
    inputMatch:
      'the screen width pixels, height pixels, and physical diagonal inches from the display spec',
    logicNote:
      'Pixel diagonal = sqrt(width pixels^2 + height pixels^2). PPI = pixel diagonal / screen diagonal inches. Aspect ratio is width pixels to height pixels simplified by their greatest common divisor. A 1920 x 1080 screen at 24 inches has a pixel diagonal of about 2202.9072 pixels and returns 91.7878 PPI with a 16:9 aspect ratio.',
    readIntro:
      'Read PPI as a density comparison number. Higher PPI means more pixels fit into each physical inch, but text size and comfort still depend on scaling, viewing distance, and the screen itself.',
    mistakeIntro:
      'Display comparisons go wrong when resolution is judged without screen size, when PPI is treated like printer DPI, or when a high PPI number is treated as the whole answer for readability.',
    enter: [
      'Enter width pixels and height pixels from the display resolution, such as 1920 x 1080, 2560 x 1440, 3440 x 1440, or 3840 x 2160.',
      'Enter the physical diagonal screen size in inches from the monitor, laptop, tablet, or TV spec.',
      'Use the built-in examples for common 1080p, 1440p, and 4K monitor sizes, then replace the numbers with the display you are comparing.',
    ],
    read: [
      'PPI is pixels per inch across the physical screen. It is the main comparison number.',
      'Pixel diagonal is the diagonal length in pixels found with the Pythagorean theorem before dividing by inches.',
      'Aspect ratio shows the simplified width-to-height shape, such as 16:9 or 43:18 for many ultrawide screens.',
    ],
    mistakes: [
      'Do not use PPI alone to judge a screen because viewing distance, operating-system scaling, panel quality, subpixel layout, anti-aliasing, eyesight, brightness, and content quality also matter.',
      'Do not confuse screen PPI with printer DPI or mouse DPI.',
      'Do not assume a 4K monitor is always sharper than another 4K monitor. The smaller 4K screen has the higher PPI.',
      'Do not use the marketing class alone, such as Full HD, QHD, or 4K, without entering the real diagonal size.',
    ],
    extraSections: [
      {
        title: 'Example: 24-inch 1080p monitor',
        paragraphs: [
          'For a 1920 x 1080 screen at 24 inches, the pixel diagonal is sqrt(1920^2 + 1080^2), or about 2202.9072 pixels. Divide that by 24 inches and the result is 91.7878 PPI.',
          'That is why a 24-inch 1080p monitor can feel normal for everyday desktop work, while the same resolution on a larger screen spreads the pixels farther apart.',
        ],
      },
      {
        title: 'Examples for 1440p, 4K, and ultrawide screens',
        paragraphs: [
          'A 2560 x 1440 screen at 27 inches returns 108.7855 PPI. A 3840 x 2160 screen at 32 inches returns 137.6817 PPI. A 3440 x 1440 ultrawide screen at 34 inches returns about 109.6834 PPI with a 43:18 aspect ratio.',
          'Those numbers show why screen size matters. The 27-inch 1440p and 34-inch ultrawide examples are close in density even though their resolutions and shapes are different.',
        ],
      },
      {
        title: 'How to use PPI with scaling',
        paragraphs: [
          'Higher PPI can make text and edges look sharper, but it can also make unscaled text physically smaller. Operating-system scaling, browser zoom, app settings, and viewing distance decide how comfortable the screen feels.',
          'Use PPI to compare density, then check whether your operating system can scale text and interface elements cleanly for the screen you are considering.',
        ],
      },
      {
        title: 'Useful related checks',
        paragraphs: [
          'PPI, aspect ratio, color contrast, and streaming bitrate answer different display questions. Use the neighboring tools when you need image shape, readable color combinations, or video data estimates rather than screen density.',
        ],
        links: [
          { href: '/tools/monitor-ppi-calculator/', label: 'Open the Monitor PPI Calculator' },
          { href: '/tools/aspect-ratio-calculator/', label: 'Simplify a screen or image ratio' },
          { href: '/tools/color-contrast-checker/', label: 'Check text and background contrast' },
          { href: '/tools/streaming-bitrate-calculator/', label: 'Estimate video stream data use' },
        ],
      },
    ],
    sidecarText:
      'Open the Monitor PPI Calculator beside this guide. Try the 1920 x 1080, 24-inch example first, then compare it with a 27-inch 1440p screen, a 32-inch 4K screen, or the exact display spec you are considering.',
    sources: [sourceLinks.nistUnits],
  },
  'recipe-scaler': {
    title: 'Recipe Scaler Guide',
    summary: 'Learn how to scale recipe ingredients from one serving count to another without hiding the math.',
    metaDescription:
      'Use the Recipe Scaler guide to resize ingredient amounts, read the scale factor, and avoid common serving-size rounding mistakes.',
    purpose:
      'The Recipe Scaler helps when a recipe makes the wrong number of servings for your plan. It works one ingredient line at a time so you can see the scale factor and catch mistakes before cooking.',
    intro:
      'It is useful when turning a 4-serving dinner into 10 servings, making a half batch, sizing party trays, or checking ingredient amounts before meal prep, bake sales, and family cooking.',
    inputMatch:
      'the ingredient name, original amount, unit, original servings, and desired servings from the recipe you are changing',
    logicNote:
      'Scale factor = desired servings / original servings. Scaled amount = original ingredient amount x scale factor. For 2 cups of flour from 4 servings to 10 servings, the scale factor is 10 / 4 = 2.5, so the scaled amount is 5 cups.',
    readIntro:
      'Read the scaled amount as the exact math answer first. Then decide whether a decimal answer needs kitchen judgment before you round it.',
    mistakeIntro:
      'Recipe scaling mistakes usually come from rounding too early, treating every ingredient as perfectly scalable, or changing the batch size without checking pan depth and cook time.',
    enter: [
      'Enter the ingredient name, original amount, and unit from one recipe line, such as 2 cups flour, 300 g sugar, or 3 eggs.',
      'Enter how many servings the original recipe makes before scaling.',
      'Enter how many servings you want to make now, then repeat the same process for each ingredient line you care about.',
    ],
    read: [
      'The main answer is the scaled ingredient amount in the same unit you entered.',
      'Scale factor tells you how much bigger or smaller the batch is. A factor above 1 makes a bigger batch; a factor below 1 makes a smaller batch.',
      'Desired servings confirms the target serving count used in the math.',
    ],
    mistakes: [
      'Do not assume seasonings, yeast, salt, leavening, gelatin, extracts, or thickener always scale perfectly.',
      'Do not round eggs, packets, cans, or small teaspoons without thinking about the recipe.',
      'Do not forget that pan size, food depth, stirring, doneness cues, and cook time may need adjustment when the batch size changes.',
      'Do not use cups-to-grams guesses when exact baking measurements matter. Convert or weigh first when accuracy matters.',
    ],
    extraSections: [
      {
        title: 'Example: scale dinner from 4 servings to 10',
        paragraphs: [
          'If the recipe calls for 2 cups of flour and makes 4 servings, but you want 10 servings, the scale factor is 10 / 4 = 2.5.',
          'Multiply 2 cups by 2.5 and the answer is 5 cups flour. The unit stays cups because the tool scales the amount; it does not convert the measurement unit.',
        ],
      },
      {
        title: 'Examples for half batches and awkward ingredients',
        paragraphs: [
          'A 300 g sugar line from 12 servings to 6 servings has a scale factor of 0.5, so the scaled amount is 150 g sugar.',
          'A 3 egg line from 8 servings to 20 servings has a scale factor of 2.5, so the exact result is 7.5 eggs before rounding. That is a prompt to think, not a command to crack half an egg in every recipe.',
        ],
      },
      {
        title: 'How to handle units and rounding',
        paragraphs: [
          'The scaler keeps the unit you type. If you enter cups, the answer is in cups. If you enter grams, the answer is in grams. Use the cooking measurement converter when you also need cups to grams, tablespoons to cups, or ounces to pounds.',
          'Round late. First copy the exact scaled amount, then decide whether the recipe can tolerate rounding. Dry baking ingredients, leavening, salt, and extracts usually need more care than chopped vegetables or soup broth.',
        ],
        links: [{ href: '/tools/cooking-measurement-converter/', label: 'Convert recipe units separately' }],
      },
      {
        title: 'What the calculator does not decide',
        paragraphs: [
          'A bigger batch can change pan depth, surface area, stirring, cooling, browning, and cook time. A smaller batch can cook faster or dry out if the pan is too wide.',
          'Use the calculator for the ingredient math, then follow the recipe signs of doneness and food-safety guidance when temperature or doneness matters.',
        ],
      },
      {
        title: 'Useful related checks',
        paragraphs: [
          'Recipe scaling answers the ingredient-amount question. Use nearby kitchen tools when the next question is unit conversion, ingredient cost, cost per serving, or pan-size scaling.',
        ],
        links: [
          { href: '/tools/recipe-scaler/', label: 'Open the Recipe Scaler' },
          { href: '/tools/ingredient-cost-calculator/', label: 'Estimate one ingredient cost' },
          { href: '/tools/cost-per-serving-calculator/', label: 'Split a batch cost by servings' },
          { href: '/tools/baking-pan-conversion-calculator/', label: 'Compare baking pan areas' },
        ],
      },
    ],
    sidecarText:
      'Open the Recipe Scaler beside this guide. Try the 2 cups flour, 4 servings to 10 servings example first, then repeat the same scale-factor check for each ingredient line in your recipe.',
    sources: [sourceLinks.nistUnits, sourceLinks.googleHelpfulContent],
  },
  'cooking-measurement-converter': {
    title: 'Cooking Measurement Converter Guide',
    summary: 'Learn how to convert recipe cups, tablespoons, milliliters, grams, ounces, and pounds.',
    metaDescription:
      'Use the Cooking Measurement Converter guide to convert cups, tablespoons, milliliters, grams, ounces, and pounds with density notes.',
    purpose:
      'The Cooking Measurement Converter handles common recipe units for cooking and baking. It uses fixed factors when both units measure volume or both units measure weight, and it uses ingredient density when a conversion crosses between volume and weight.',
    intro:
      'Use it when a recipe says cups but your scale shows grams, when a package lists ounces but your recipe uses grams, or when you need to translate tablespoons and milliliters without doing the unit math by hand.',
    inputMatch:
      'the amount, from unit, to unit, and density grams per cup fields. Leave the density alone for volume-to-volume or weight-to-weight conversions, and change it only when one side is volume and the other side is weight.',
    logicNote:
      'For volume-only conversions, the guide routes through US cups: 1 cup is 16 tablespoons, 48 teaspoons, 8 fluid ounces, or 236.5882365 mL. For weight-only conversions, it routes through grams: 1 ounce is 28.349523125 g and 1 pound is 453.59237 g. For cups-to-grams style answers, it first turns the volume into cups, then multiplies by density grams per cup.',
    readIntro:
      'Read the converted amount first, then check whether the answer used fixed unit factors or a density estimate. If density was used, treat the number as a recipe estimate instead of a lab measurement.',
    enter: [
      'Enter the amount from the recipe, label, or measuring tool.',
      'Choose the starting unit, such as cups, tablespoons, milliliters, grams, ounces, or pounds.',
      'Choose the unit you want as the answer.',
      'Enter grams per cup only when converting between volume and weight.',
    ],
    read: [
      'The main answer is the converted amount in the new unit.',
      'Input type and output type show whether the conversion used volume, weight, or both.',
      'Density used matters only when cups, tablespoons, fluid ounces, mL, or liters are converted to grams, ounces, pounds, or the reverse.',
      'Fixed volume conversions such as tablespoons to mL do not change when density changes.',
      'Fixed weight conversions such as ounces to grams do not change when density changes.',
    ],
    mistakes: [
      'Do not use one cups-to-grams number for every ingredient.',
      'Do not treat scooped, packed, sifted, chopped, and liquid ingredients as identical.',
      'Do not confuse fluid ounces, which measure volume, with ounces by weight.',
      'Do not copy a density value without checking whether the ingredient was packed, sifted, melted, chopped, or level.',
      'Use a kitchen scale when exact baking measurements matter.',
    ],
    extraSections: [
      {
        title: 'Example: 2 cups of flour to grams',
        paragraphs: [
          'If your flour estimate is 120 grams per US cup, 2 cups becomes 2 x 120 = 240 grams. The converter returns 240 g because this is a volume-to-weight conversion.',
          'If you change the density to 130 grams per cup, the same 2 cups becomes 260 grams. That difference is the point: cups measure space, while grams measure weight, so the ingredient and measuring style matter.',
        ],
        links: [{ href: '/tools/cooking-measurement-converter/', label: 'Try 2 cups at 120 g per cup' }],
      },
      {
        title: 'Example: 500 mL to cups and 3 tablespoons to mL',
        paragraphs: [
          'A 500 mL liquid amount is about 2.1134 US cups because the converter divides by 236.5882365 mL per cup. Density does not matter because both sides are volume units.',
          'Three US tablespoons is 3/16 of a cup, which is about 44.3603 mL. This is useful for small liquid, extract, spice, or sauce amounts when a recipe mixes spoon and metric units.',
        ],
        links: [{ href: '/tools/oven-temperature-converter/', label: 'Convert the oven setting too' }],
      },
      {
        title: 'How to choose density grams per cup',
        paragraphs: [
          'Use the most specific density you can find for the ingredient and preparation style. A level cup of flour, a packed cup of brown sugar, a chopped cup of nuts, and a cup of water should not share one number.',
          'A package label, a trusted ingredient database, or your own weighed cup can give a better estimate. If the recipe is important, write down the density you used so you can repeat the result next time.',
        ],
        links: [{ href: '/tools/ingredient-cost-calculator/', label: 'Use density when pricing an ingredient' }],
      },
      {
        title: 'When a kitchen scale is safer',
        paragraphs: [
          'Use the converter for planning, shopping, quick recipe translation, and rough batch checks. Use a scale when the recipe depends on texture, hydration, nutrition labels, selling food, or repeating the same bake accurately.',
          'The converter can make a clear estimate, but it cannot know whether your cup was fluffed, scooped, sifted, packed, rounded, melted, or chopped. That measuring detail is often bigger than the calculator rounding.',
        ],
        links: [{ href: '/tools/recipe-scaler/', label: 'Scale the full recipe after converting units' }],
      },
    ],
    sidecarText:
      'Open the Cooking Measurement Converter beside this guide. Try 2 cups to grams at 120 g per cup, then change the density and notice why ingredient-specific cups-to-grams estimates move.',
    sources: [sourceLinks.nistUnits, sourceLinks.usdaFoodDataCentral, sourceLinks.googleHelpfulContent],
  },
  'ingredient-cost-calculator': {
    title: 'Ingredient Cost Calculator Guide',
    summary: 'Learn how package price, recipe amount, unit conversion, and density become a realistic ingredient cost estimate.',
    metaDescription:
      'Calculate ingredient cost from package price, recipe amount, unit conversion, density, and real-world limits.',
    purpose:
      'The Ingredient Cost Calculator is useful when you want to know how much one ingredient contributes to a recipe cost. It can convert package units into recipe units first, then price only the amount you use.',
    intro:
      'Use it before shopping, pricing a bake-sale item, checking whether a homemade recipe is cheaper, or building a rough food-cost sheet one ingredient at a time.',
    inputMatch:
      'the amount used in the recipe, the recipe unit, the package amount and unit from the label, the package price, and density grams per cup when the recipe crosses between volume and weight',
    logicNote:
      'Check package amount converted first, especially when the label uses pounds or ounces but the recipe uses cups, tablespoons, or milliliters. If that converted package amount looks wrong, fix the unit or density before using the cost result.',
    readIntro:
      'Read the ingredient cost as the cost of the amount used, not the cost of the whole package. Then check the converted package amount and unit cost so you can spot a unit mismatch before you trust the estimate.',
    mistakeIntro:
      'Most wrong ingredient-cost answers come from one of three things: the package size was copied in the wrong unit, the recipe amount was rounded too much, or a volume-to-weight estimate used the wrong density.',
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
    extraSections: [
      {
        title: 'Example: flour from a 5 lb bag',
        paragraphs: [
          'Say the recipe needs 2 cups of flour, the bag is 5 lb, the bag costs $4.49, and you use 120 grams per cup. The calculator converts the 5 lb bag into about 18.8997 cups, then prices 2 cups from that package.',
          'The result is about $0.47514 for the flour in the recipe. That does not mean the bag costs 48 cents. It means this recipe used roughly 48 cents of that bag.',
        ],
        links: [{ href: '/tools/ingredient-cost-calculator/', label: 'Try the flour example in the calculator' }],
      },
      {
        title: 'Example: chocolate chips and milk',
        paragraphs: [
          'For chocolate chips, 170 g from a 12 oz bag at $3.99 costs about $1.99. This is a weight-to-weight conversion, so density is not needed.',
          'For milk, 250 mL from a 1 gallon jug at $4.20 costs about $0.277381. This is volume-to-volume, so the result depends on the gallon-to-milliliter conversion and the price you entered, not on ingredient density.',
        ],
        links: [{ href: '/tools/cooking-measurement-converter/', label: 'Convert kitchen units before pricing' }],
      },
      {
        title: 'How to build a whole recipe cost',
        paragraphs: [
          'This guide prices one ingredient at a time on purpose. Run flour, sugar, butter, milk, chocolate, spices, and any other ingredient separately, then add the ingredient costs together for the recipe total.',
          'After that, divide by servings if you want a serving estimate. The Cost Per Serving Calculator is the cleaner place to do that second step because it keeps the batch cost and serving count visible.',
        ],
        links: [{ href: '/tools/cost-per-serving-calculator/', label: 'Turn a recipe total into cost per serving' }],
      },
      {
        title: 'When this is not enough for menu pricing',
        paragraphs: [
          'Ingredient cost is only one part of menu or product pricing. A restaurant, bakery, or seller also has waste, trim loss, packaging, labor, rent, utilities, delivery fees, payment fees, taxes, and profit targets.',
          'Use the calculator for the ingredient math, then add the business costs separately before setting a public price. If you only multiply ingredient cost by a simple markup, the number can look neat while still missing the real cost of selling the food.',
        ],
        links: [{ href: '/tools/unit-price-calculator/', label: 'Compare package prices before costing recipes' }],
      },
    ],
    sidecarText:
      'Open the Ingredient Cost Calculator beside this guide. Try 2 cups of flour from a 5 lb bag at $4.49, then change density to see why volume-to-weight ingredient pricing moves.',
    referenceIntro:
      'These references help check unit conversions, ingredient-density context, and the people-first source standards used in this guide.',
    sources: [sourceLinks.nistUnits, sourceLinks.usdaFoodDataCentral, sourceLinks.googleHelpfulContent],
  },
  'unit-price-calculator': {
    title: 'Unit Price Calculator Guide',
    metaDescription:
      'Learn how to compare price per ounce, pound, roll, count, sheet, or other shared unit before choosing a package.',
    summary: 'Learn how to compare two products fairly by price per shared unit before you buy.',
    purpose:
      'The Unit Price Calculator divides each product price by its package quantity. It helps you see whether the small package, family size, bulk pack, warehouse-club size, or sale item is actually cheaper per ounce, pound, roll, count, sheet, or other shared unit.',
    intro:
      'A bigger package can look like the better deal because the sticker price is larger and the label says family size. A sale tag can also make a small package look cheaper than it really is. Unit price cuts through that by turning both products into the same price-per-unit number.',
    inputMatch:
      'Use the price you will actually pay for each item, including sale prices, coupon adjustments, loyalty discounts, or membership prices when they apply. Enter both quantities in the same unit before comparing them.',
    logicNote:
      'Unit price = item price / item quantity. The lower unit price is the cheaper math option. Savings per unit = higher unit price - lower unit price, and savings percent = savings per unit / higher unit price x 100.',
    readIntro:
      'Read the result as a per-unit comparison, not a promise that the item is the best purchase. The lower number tells you which package is cheaper for each ounce, pound, roll, sheet, count, or other shared unit.',
    mistakeIntro:
      'Most bad unit-price comparisons happen because the units do not match, the wrong price was entered, or the products are not truly comparable.',
    enter: [
      'Enter a name, price, and quantity for item A so the result is easy to read.',
      'Enter the same details for item B.',
      'Use the same shared unit for both quantities, such as oz, lb, count, roll, sheet, fl oz, or tablet.',
    ],
    read: [
      'The main answer names the lower unit-price option.',
      'Each unit price shows how much that item costs per shared unit.',
      'Savings per unit shows the difference between the higher and lower unit price, with the percent savings in parentheses.',
    ],
    mistakes: [
      'Do not compare ounces to pounds until you convert them to one unit.',
      'Do not use the regular shelf price if the actual checkout price includes a sale, coupon, or loyalty discount.',
      'Do not ignore product quality, concentration, expiration dates, storage space, delivery fees, deposits, or membership costs.',
      'Check that both products are truly comparable before choosing only by unit price.',
    ],
    extraSections: [
      {
        title: 'Example: cereal boxes',
        paragraphs: [
          'Say item A is a small cereal box for $4.49 with 12 oz. Its unit price is $4.49 / 12, or about $0.3742 per oz.',
          'Item B is a family cereal box for $6.99 with 21 oz. Its unit price is $6.99 / 21, or about $0.3329 per oz. Item B is cheaper by about $0.0413 per oz, or 11.04% compared with the higher unit price.',
        ],
        links: [{ href: '/tools/unit-price-calculator/', label: 'Run the cereal example in the calculator' }],
      },
      {
        title: 'Use the price you will actually pay',
        paragraphs: [
          'Unit price is only as useful as the price you enter. If item A has a coupon, enter the after-coupon price. If item B needs a membership, delivery fee, deposit, or minimum quantity, decide whether that cost belongs in the price before comparing.',
          'For a quick sale check, run the calculator once with shelf prices and once with the real checkout prices. The winner can change when a coupon applies to only one package.',
        ],
        links: [{ href: '/tools/discount-calculator/', label: 'Convert a discount before comparing packages' }],
      },
      {
        title: 'Convert mixed units before comparing',
        paragraphs: [
          'If one package is 12 oz and another is 1 lb, convert one side first. One pound is 16 ounces, so compare both as ounces or both as pounds.',
          'The same idea applies to fluid ounces and milliliters, rolls and sheets, tablets and doses, or bags and pounds. The calculator does not guess conversions for you because the safest comparison starts with a shared unit you trust.',
        ],
        links: [{ href: '/tools/cooking-measurement-converter/', label: 'Convert kitchen units first' }],
      },
      {
        title: 'Why bulk is not always better',
        paragraphs: [
          'A bulk package can have the lower unit price and still be the wrong buy if it expires, takes too much storage space, locks up cash you need for other groceries, or includes more than you can use.',
          'For food, think about waste before trusting the cheaper per-unit number. A lower price per pound does not help if half the package spoils before you cook it.',
        ],
        links: [{ href: '/tools/ingredient-cost-calculator/', label: 'Estimate how much of a package a recipe uses' }],
      },
      {
        title: 'When to ignore the lower unit price',
        paragraphs: [
          'Unit price compares math, not quality. A stronger detergent, thicker paper towel, better pet food, reusable item, or different brand may not be interchangeable with the cheaper package.',
          'Use the result as a shopping clue. If the products are not equivalent, add your own judgment about quality, concentration, convenience, return policy, and whether you actually need the larger amount.',
        ],
        links: [{ href: '/tools/cost-per-serving-calculator/', label: 'Compare food cost after you know the batch size' }],
      },
    ],
    sidecarText:
      'Open the Unit Price Calculator beside this guide. Try $4.49 for 12 oz against $6.99 for 21 oz, then change the sale price to see how quickly the winner can flip.',
    referenceIntro:
      'These references support shared-unit conversion discipline and people-first calculator guidance.',
    sources: [sourceLinks.nistUnits, sourceLinks.googleHelpfulContent],
  },
  'cost-per-serving-calculator': {
    title: 'Cost Per Serving Calculator Guide',
    metaDescription:
      'Learn how to divide a recipe, meal prep batch, or bake sale cost by servings. Includes the formula, examples, extras, and mistakes to avoid.',
    summary: 'Learn how to turn a recipe, meal prep, or bake sale batch total into cost per serving.',
    purpose:
      'The Cost Per Serving Calculator takes a batch total and divides it by the number of servings you actually plan to use. It is helpful for meal prep, family food budgeting, bake sales, and quick homemade-versus-store-bought comparisons.',
    intro:
      'A recipe can feel cheap until you split it into real portions. The useful question is not just "what did the batch cost?" It is "what does one container, slice, bowl, plate, or cupcake cost after the extra bits are included?"',
    inputMatch:
      'the real batch cost, any extras you want counted, and the serving count you will actually use',
    logicNote:
      'Cost per serving = (main cost + extra cost) / servings. Total batch cost = main cost + extra cost.',
    readIntro:
      'Read the result as an average cost per equal serving. It is a planning number, so it is strongest when the portions are close to the same size.',
    mistakeIntro:
      'Most bad serving-cost estimates come from an optimistic serving count or costs left outside the batch total.',
    enter: [
      'Enter the recipe, meal, or item name so the result is easy to recognize later.',
      'Enter the main cost, usually the total ingredient cost for the batch.',
      'Enter extra cost only for packaging, toppings, sides, delivery fees, labor, or overhead you want included.',
      'Enter the number of same-size servings the batch actually makes after cooking, cutting, packing, or cooling.',
    ],
    read: [
      'Cost per serving is the average cost for one portion.',
      'Total batch cost shows main cost plus extras, so you can see what was included before division.',
      'Extra cost included confirms whether containers, toppings, or fees were counted.',
      'Servings confirms the divisor used in the estimate.',
    ],
    mistakes: [
      'Do not use a fantasy serving count just to make the cost look low.',
      'Do not leave out containers, labels, toppings, sauces, delivery fees, or payment fees when they change the decision.',
      'Do not treat the result as a selling price. Profit, labor, taxes, spoilage, unsold items, and local rules are separate.',
      'Do not trust the average when one serving is much larger than another.',
      'Do not compare homemade food with takeout unless you are clear about which costs and portion sizes are included.',
    ],
    extraSections: [
      {
        title: 'Example: soup batch',
        paragraphs: [
          'Say a soup costs $18.50 in ingredients and you want to include $2.00 for containers or toppings. The total batch cost is $20.50.',
          'If the batch makes 8 servings, the cost per serving is $20.50 / 8, or about $2.56. That is the number to compare with a meal-prep container, a store soup cup, or the price you would need to charge before profit.',
        ],
        links: [{ href: '/tools/cost-per-serving-calculator/', label: 'Check a soup or meal-prep batch' }],
      },
      {
        title: 'Use ingredient cost first when the total is fuzzy',
        paragraphs: [
          'If you do not know the batch total yet, price the ingredients before using this guide. A bag of flour, a carton of eggs, or a bottle of oil should be converted into the amount the recipe actually uses.',
          'Once those ingredient costs are added together, put the total into the Cost Per Serving Calculator and divide by servings.',
        ],
        links: [{ href: '/tools/ingredient-cost-calculator/', label: 'Price one ingredient before dividing the batch' }],
      },
      {
        title: 'Meal prep and food sales are different decisions',
        paragraphs: [
          'For home meal prep, a simple ingredient-only estimate may be enough. For a bake sale, side hustle, catering tray, or menu item, the cost per serving is only the starting point.',
          'Selling food can also need packaging, labels, payment fees, failed batches, unsold items, kitchen time, delivery, taxes, and local rules. Add the costs you can estimate, then treat the result as cost, not profit.',
        ],
        links: [{ href: '/tools/discount-calculator/', label: 'Check a discount before buying supplies' }],
      },
      {
        title: 'Uneven servings make the answer an average',
        paragraphs: [
          'The calculator assumes each serving is the same size. That is fine for 10 packed meal-prep bowls or 24 similar cupcakes, but it is weaker for random scoops, uneven cake slices, or a family dinner where portions vary.',
          'If portion size matters, weigh or divide the batch first. Otherwise, read the result as a rough average per person.',
        ],
        links: [{ href: '/tools/recipe-scaler/', label: 'Scale the recipe before pricing servings' }],
      },
      {
        title: 'Cost per serving is not unit price',
        paragraphs: [
          'Unit price compares packages by a shared unit such as ounces, pounds, rolls, or tablets. Cost per serving starts after you know the recipe or batch total.',
          'Use unit price while shopping, ingredient cost while building the recipe total, then cost per serving when you want the per-portion answer.',
        ],
        links: [{ href: '/tools/unit-price-calculator/', label: 'Compare packages before buying ingredients' }],
      },
    ],
    sidecarText:
      'Open the Cost Per Serving Calculator beside this guide. Try $18.50 main cost, $2.00 extra cost, and 8 servings, then change the servings to see how quickly the per-serving cost moves.',
    referenceIntro:
      'These references support cost-per-serving topic checks and people-first calculator guidance.',
    sources: [sourceLinks.dishCostCostPerServing, sourceLinks.googleHelpfulContent],
  },
  'oven-temperature-converter': {
    summary: 'Learn how to convert recipe oven settings between Fahrenheit, Celsius, gas mark, and fan oven starting points.',
    purpose:
      'The Oven Temperature Converter helps when a recipe uses a different oven setting than your oven. It converts Fahrenheit and Celsius, shows the nearest common gas mark, and gives a rough fan-oven starting point.',
    enter: [
      'Enter the oven setting from the recipe, such as 350 F, 180 C, or gas mark 6.',
      'Choose whether the recipe uses Fahrenheit, Celsius, or gas mark.',
      'Run the converter before preheating so you can set the oven once instead of guessing.',
    ],
    read: [
      'The main answer shows Fahrenheit and Celsius together.',
      'Fan oven starting point gives a rough convection setting based on lowering the rounded Celsius setting by about 20 C.',
      'Nearest gas mark gives the closest common gas setting, not an exact lab value.',
      'Use the note to remember that oven setting is not the same as food internal temperature.',
    ],
    mistakes: [
      'Do not treat gas mark as a lab-exact temperature.',
      'Do not assume every fan oven uses the same adjustment. Some ovens auto-convert convection temperatures.',
      'Do not assume your oven runs perfectly at the dial setting, especially for older ovens or small countertop ovens.',
      'Do not use oven temperature conversion as a food safety check.',
    ],
    extraSections: [
      {
        title: 'Example: 350 F in a Celsius oven',
        paragraphs: [
          'If a US cookie recipe says 350 F, the formula gives about 177 C. Most oven charts round that to 180 C because ovens are set in simple steps.',
          'The nearest gas mark is 4. For a fan oven, a rough starting point is about 160 C, but the recipe and oven manual should win if they give a different fan setting.',
        ],
        links: [{ href: '/tools/oven-temperature-converter/', label: 'Convert 350 F before preheating' }],
      },
      {
        title: 'Why fan oven numbers are lower',
        paragraphs: [
          'A fan oven moves hot air around the food, so it often cooks faster than a regular oven at the same dial temperature. That is why many conversion charts lower the Celsius setting by about 20 C for fan cooking.',
          'This is still a starting point, not a safety promise. Dense food, full trays, dark pans, and ovens that run hot or cold can change the real result.',
        ],
        links: [{ href: '/tools/recipe-scaler/', label: 'Scale the recipe before setting the oven' }],
      },
      {
        title: 'Oven setting is not food safety',
        paragraphs: [
          'The converter only helps with the oven dial. It does not tell you when chicken, leftovers, casseroles, or other foods are safe inside.',
          'Use a food thermometer and trusted food-safety guidance when doneness matters. A recipe can say 400 F and still need an internal-temperature check.',
        ],
        links: [{ href: '/tools/cooking-measurement-converter/', label: 'Convert other recipe measurements' }],
      },
    ],
    sources: [
      sourceLinks.goodFoodConversionGuides,
      sourceLinks.whichOvenTemperatureChart,
      sourceLinks.nistUnits,
      sourceLinks.foodSafetyTemperatures,
      sourceLinks.googleHelpfulContent,
    ],
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
      'Clean up quoted commas, escaped quotes, or spreadsheet CSV exports before pasting; this helper is for simple comma-separated or pipe-separated cells.',
    ],
    sources: [sourceLinks.githubGfmTables],
  },
};

function getFormulaAnswer(toolSlug: string) {
  return utilityTools.find((tool) => tool.slug === toolSlug)?.faq[1]?.answer ?? 'The calculator uses the formula shown on the tool page.';
}

function buildUtilityMetaDescription(tool: (typeof utilityTools)[number], summary: string) {
  const base = summary.replace(/\.$/, '');
  const description = `${base}. Includes input tips, examples, result checks, and unit or mode notes for the ${tool.name}.`;
  return description.length > 160 ? `${description.slice(0, 156).trim()}...` : description;
}

function getUtilityGuideLanguage(tool: (typeof utilityTools)[number]) {
  const lowerName = tool.name.toLowerCase();
  const isCalculator = lowerName.endsWith('calculator');
  const pageNoun = isCalculator
    ? 'calculator'
    : lowerName.endsWith('converter')
      ? 'converter'
      : lowerName.endsWith('generator')
        ? 'generator'
        : 'tool';

  return {
    pageNoun,
    examplePhrase: isCalculator ? 'complete set of inputs' : 'complete input',
    sidecarInputPhrase: isCalculator ? 'example inputs' : 'example input',
    firstStep: isCalculator
      ? 'enter the values the calculator asks for'
      : 'paste or enter the text, file, setting, or option the tool asks for',
    inputMatch: isCalculator
      ? 'the real measurement, amount, rate, unit, or setting for your job'
      : 'the text, format, mode, option, or platform rule you actually need',
    mismatch: isCalculator
      ? 'a mixed unit, copied value, wrong mode, missing label, or result used for the wrong job'
      : 'the wrong text, mode, format, line break, privacy choice, or platform rule',
    referenceIntro: isCalculator
      ? 'These references help check the measurements, units, limits, or safety notes used in this guide.'
      : 'These references help check the tool logic, format choices, platform limits, or safety notes.',
    fallbackReferenceIntro: isCalculator
      ? 'This guide follows the inputs, formula note, and examples on the tool page. If your project, class, or workplace has an official rule, use that rule first.'
      : 'This guide follows the inputs, logic note, and examples on the tool page. If your platform, class, or workplace has an official rule, use that rule first.',
    sectionTitle: isCalculator ? 'What this calculator is solving' : `What this ${pageNoun} helps with`,
    logicTitle: isCalculator ? 'The formula in plain language' : 'The logic in plain language',
  };
}

function makeGuide(toolSlug: string): UtilityGuideDefinition {
  const tool = utilityTools.find((candidate) => candidate.slug === toolSlug);
  const detail = guideDetails[toolSlug];

  if (!tool || !detail) {
    throw new Error(`Missing utility guide detail for ${toolSlug}`);
  }

  const guideLanguage = getUtilityGuideLanguage(tool);

  return {
    slug: `how-to-use-${tool.slug}`,
    toolSlug: tool.slug,
    label: `${tool.name} guide`,
    title: detail.title ?? `How to use the ${tool.name}`,
    description: detail.metaDescription ?? buildUtilityMetaDescription(tool, detail.summary),
    path: `/blog/how-to-use-${tool.slug}/`,
    intro: `${detail.purpose} ${detail.intro ?? `Start here: ${guideLanguage.firstStep}, read the result, then check the limits before you use it.`}`,
    quickStart: detail.enter,
    bestUsesIntro: detail.bestUsesIntro,
    sections: [
      {
        title: guideLanguage.sectionTitle,
        paragraphs: [
          detail.purpose,
          `Match each input label on the ${guideLanguage.pageNoun} to ${detail.inputMatch ?? guideLanguage.inputMatch}.`,
        ],
      },
      {
        title: guideLanguage.logicTitle,
        paragraphs: [
          getFormulaAnswer(tool.slug),
          detail.logicNote ??
            `The example cards on the ${guideLanguage.pageNoun} page show a ${guideLanguage.examplePhrase} and the kind of answer you should expect.`,
        ],
      },
      {
        title: 'How to read the answer',
        paragraphs: [
          detail.readIntro ??
            'Read the main result first. Then check the smaller lines for the totals, units, ranges, counts, or formula steps behind it.',
        ],
        bullets: detail.read,
      },
      {
        title: 'Common mistakes to avoid',
        paragraphs: [
          detail.mistakeIntro ??
            `If the answer looks strange, the most likely cause is a small input mismatch: ${guideLanguage.mismatch}.`,
        ],
        bullets: detail.mistakes,
      },
      ...(detail.extraSections ?? []),
      {
        title: 'Research and references',
        paragraphs: [
          detail.referenceIntro ??
          (detail.sources.length > 0
            ? guideLanguage.referenceIntro
            : guideLanguage.fallbackReferenceIntro),
        ],
        links: detail.sources,
      },
    ],
    sidecarText:
      detail.sidecarText ??
      `Open the ${tool.name} beside this guide. Try one example first, then replace the ${guideLanguage.sidecarInputPhrase} with your own.`,
    faqItems: detail.faqItems,
  };
}

export const utilityBlogGuides: UtilityGuideDefinition[] = utilityTools.map((tool) => makeGuide(tool.slug));

export const utilityBlogPosts: BlogPostDefinition[] = utilityBlogGuides.map((guide) => ({
  slug: guide.slug,
  title: guide.title,
  label: guide.label,
  summary: guide.description,
}));
