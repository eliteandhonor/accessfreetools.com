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
    summary: 'Learn how amps and volts become watts for DC, single-phase AC, and three-phase AC.',
    purpose:
      'The Amps to Watts Calculator turns current into a real-power estimate. It is handy when you know current draw and voltage and want a rough watt or kilowatt number.',
    enter: [
      'Enter the current in amps.',
      'Enter the supply voltage.',
      'Choose the phase/current type and enter power factor for AC loads.',
    ],
    read: [
      'The main answer is estimated watts.',
      'The kilowatts metric is the same result divided by 1,000.',
      'Power factor and phase type explain why equal amps can create different watt values.',
    ],
    mistakes: [
      'Do not assume all AC loads have power factor 1.',
      'Do not compare amperage without checking voltage.',
      'Do not use this as a final safety or code calculation.',
    ],
    sources: [sourceLinks.inchAmpsToWatts, sourceLinks.openStaxOhmsLaw, sourceLinks.nistUnits],
  },
  'kilowatts-to-amps-calculator': {
    summary: 'Learn how kilowatts convert to amps when voltage, phase, power factor, and efficiency are known.',
    purpose:
      'The Kilowatts to Amps Calculator is for larger power ratings. It converts kW to watts, accounts for efficiency when needed, then estimates current.',
    enter: [
      'Enter the kilowatt rating.',
      'Enter voltage and choose DC, single-phase AC, or three-phase AC.',
      'Enter power factor and efficiency percentage.',
    ],
    read: [
      'The main answer is estimated amps.',
      'Input watts after efficiency shows the power the calculator used before solving current.',
      'Efficiency and power factor should come from equipment data when accuracy matters.',
    ],
    mistakes: [
      'Do not confuse kW with kVA.',
      'Do not ignore motor starting current.',
      'Do not use a made-up efficiency value for real installation planning.',
    ],
    sources: [sourceLinks.inchKilowattsToAmps, sourceLinks.openStaxOhmsLaw, sourceLinks.nistUnits],
  },
  'kva-to-amps-calculator': {
    summary: 'Learn how apparent power in kVA turns into current for single-phase and three-phase systems.',
    purpose:
      'The kVA to Amps Calculator converts an apparent-power rating into estimated current. It is useful for transformer, UPS, and equipment labels that use kVA.',
    enter: [
      'Enter the kVA rating.',
      'Enter the voltage.',
      'Choose single-phase or three-phase.',
    ],
    read: [
      'The main answer is estimated current in amps.',
      'Volt-amps shows kVA converted to VA.',
      'There is no power factor input because kVA already means apparent power.',
    ],
    mistakes: [
      'Do not treat kVA and kW as always identical.',
      'Do not use this alone to size a transformer, breaker, or conductor.',
      'Do not mix line-to-line and line-to-neutral voltage without checking the equipment context.',
    ],
    sources: [sourceLinks.inchKvaToAmps, sourceLinks.openStaxOhmsLaw, sourceLinks.nistUnits],
  },
  'amp-hours-to-watt-hours-calculator': {
    title: 'Amp Hours to Watt Hours Guide',
    summary: 'Learn why multiplying amp-hours by volts gives a better battery energy comparison.',
    purpose:
      'The Amp Hours to Watt Hours Calculator converts a battery capacity label into stored energy. This helps you compare batteries even when their voltages differ.',
    enter: [
      'Enter the battery capacity in amp-hours.',
      'Enter the nominal voltage.',
      'Calculate to see watt-hours and kilowatt-hours.',
    ],
    read: [
      'Watt-hours is the main stored-energy estimate.',
      'Kilowatt-hours is the same energy in a larger unit.',
      'Higher voltage means the same amp-hours represent more energy.',
    ],
    mistakes: [
      'Do not compare batteries by Ah alone when voltage differs.',
      'Do not expect all watt-hours to be usable after inverter or converter losses.',
      'Do not ignore battery chemistry, age, temperature, and discharge rate.',
    ],
    sources: [sourceLinks.inchAmpHoursToWattHours, sourceLinks.doeApplianceEnergy, sourceLinks.nistUnits],
  },
  'watt-hours-to-amp-hours-calculator': {
    summary: 'Learn how watt-hours divide by voltage to estimate battery amp-hours.',
    purpose:
      'The Watt Hours to Amp Hours Calculator is useful when a battery or power station lists energy in Wh and you need an Ah estimate at a chosen voltage.',
    enter: [
      'Enter watt-hours.',
      'Enter nominal voltage.',
      'Calculate to estimate amp-hours.',
    ],
    read: [
      'The main answer is amp-hours at the voltage you entered.',
      'Watt-hours stays the same energy number.',
      'Changing voltage changes Ah because Ah is not a voltage-independent energy unit.',
    ],
    mistakes: [
      'Do not compare Ah ratings across different voltages without converting to Wh.',
      'Do not use the wrong battery voltage.',
      'Do not treat the result as guaranteed runtime without knowing load watts and efficiency.',
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
    summary: 'Learn how current, length, voltage, and a voltage-drop target can suggest a copper AWG size.',
    purpose:
      'The Wire Size Calculator tests common copper AWG sizes and returns the first size that stays within the voltage-drop percentage you choose. It is a planning helper, not an electrical-code sizing tool.',
    enter: [
      'Enter source voltage, current amps, and one-way length.',
      'Enter the maximum voltage-drop percentage.',
      'Choose single/DC or three-phase circuit type.',
    ],
    read: [
      'The main answer is the first common copper AWG size that meets the voltage-drop target.',
      'Estimated drop and percent drop show why the size was selected.',
      'Load voltage shows source voltage after the estimated drop.',
    ],
    mistakes: [
      'Do not treat voltage drop as the only wire-sizing rule.',
      'Do not ignore ampacity, insulation, raceway, temperature, material, and local code.',
      'Do not use this as a substitute for a licensed electrician.',
    ],
    sources: [sourceLinks.inchWireSize, sourceLinks.usaceVoltageDrop, sourceLinks.openStaxOhmsLaw, sourceLinks.nistUnits],
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
    summary: 'Learn how railing opening length, baluster width, and max gap estimate baluster count.',
    purpose:
      'The Baluster Calculator is a spacing helper for straight rail sections. It subtracts posts, fits enough balusters to stay under the max gap, and reports the actual equal spacing.',
    enter: [
      'Enter rail length in feet.',
      'Enter post width, post count, and baluster width in inches.',
      'Enter the largest open spacing you want between balusters.',
    ],
    read: [
      'Balusters needed is rounded up so gaps do not exceed the max spacing.',
      'Actual open spacing is the equal gap between balusters after rounding.',
      'Opening length shows the rail space left after subtracting posts.',
    ],
    mistakes: [
      'Do not treat this as a complete railing code check.',
      'Do not forget stair railings and guards can have extra rules.',
      'Measure actual post and baluster widths because small changes affect spacing.',
    ],
    sources: [sourceLinks.inchBaluster, sourceLinks.nistUnits],
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
      'The Slug Generator turns a readable title into a URL-friendly draft path. It is useful for planning blog guides and tool pages while keeping one clear main page for each real topic.',
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
  };
}

export const utilityBlogGuides: UtilityGuideDefinition[] = utilityTools.map((tool) => makeGuide(tool.slug));

export const utilityBlogPosts: BlogPostDefinition[] = utilityBlogGuides.map((guide) => ({
  slug: guide.slug,
  title: guide.title,
  label: guide.label,
  summary: guide.description,
}));
