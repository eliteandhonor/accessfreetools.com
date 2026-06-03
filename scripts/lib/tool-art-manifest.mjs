import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

export const rootDir = resolve(fileURLToPath(new URL('../..', import.meta.url)));

export const toolDataFiles = [
  'src/data/tools.ts',
  'src/data/mathExpansionTools.ts',
  'src/data/financeTools.ts',
  'src/data/healthTools.ts',
  'src/data/utilityTools.ts',
  'src/data/aiTools.ts',
];

export const categoryNames = {
  calculators: 'Calculators',
  converters: 'Converters',
  'text-tools': 'Text Tools',
  'date-time': 'Date & Time',
  finance: 'Finance',
  'health-fitness': 'Health & Fitness',
  'home-projects': 'Home & Projects',
  'developer-tools': 'Developer Tools',
  'image-tools': 'Image Tools',
  'ai-tools': 'AI Tools',
  'school-study': 'School & Study',
  'everyday-tools': 'Everyday Tools',
};

const defaultCategoryByFile = {
  'aiTools.ts': 'ai-tools',
  'financeTools.ts': 'finance',
  'healthTools.ts': 'health-fitness',
  'mathExpansionTools.ts': 'calculators',
};

const categoryVisualCues = {
  calculators: 'calculator buttons, number blocks, and tidy math shapes',
  converters: 'swapping arrows, measuring cups, and unit tiles',
  'text-tools': 'paper sheets, pencil marks, and tidy writing lines',
  'date-time': 'calendar pages, clock circles, and reminder dots',
  finance: 'coins, charts, receipt shapes, and careful budgeting blocks',
  'health-fitness': 'heart shapes, movement arcs, and wellness note cards',
  'home-projects': 'house outlines, rulers, buckets, and project material shapes',
  'developer-tools': 'code brackets, terminal panels, and connected nodes',
  'image-tools': 'picture frames, crop handles, and sparkle shapes',
  'ai-tools': 'soft neural dots, lens shapes, and model-chip blocks',
  'school-study': 'notebook pages, stars, and study cards',
  'everyday-tools': 'checklists, small household objects, and simple task icons',
};

const toolArtMetadataOverrides = {
  'basic-calculator': {
    tool: {
      alt: 'Smoke mascot holding a small calculator, surrounded by glowing plus, minus, multiply, and divide symbols.',
      caption:
        'Basic Calculator artwork matches the quick arithmetic workflow: add, subtract, multiply, divide, check percents, copy the answer, and compare recent results.',
    },
    guide: {
      alt: 'Smoke mascot pointing at glowing plus, minus, multiply, and divide symbols while holding a calculator.',
      caption:
        'Basic Calculator guide artwork supports the walkthrough for percent checks, keyboard input, one-step math, copied answers, and common mistakes.',
    },
  },
  'percentage-calculator': {
    tool: {
      alt: 'Smoke mascot comparing 18 percent of 240, 160 to 116 percent change, a 25 percent markup, and a reverse-percent card.',
      caption:
        'Percentage Calculator artwork matches the live modes: percent of a number, what percent, percent change, add or subtract percent, and reverse percent.',
    },
    guide: {
      alt: 'Smoke mascot explaining percent change from 160 to 116 beside discount, markup, reverse-percent, and formula-step cards.',
      caption:
        'Percentage Calculator guide artwork supports the walkthrough for percent-of math, percent change, discounts, markups, reverse percentages, and common mistakes.',
    },
  },
  'ratio-calculator': {
    tool: {
      alt: 'Smoke mascot checking ratio cards for 12:18 to 2:3, 4:7 to 20:35, 120 split by 2:3, and 1.5:2.25 to 2:3.',
      caption:
        'Ratio Calculator artwork matches the live workflow: simplify 12:18, scale 4:7 into 20:35, split 120 by 2:3, clear decimal ratios, and keep ratio parts in order.',
    },
    guide: {
      alt: 'Smoke mascot explaining ordered ratio parts, same-unit checks, decimal clearing, 4:7 scaling, and 120 split into 48 and 72.',
      caption:
        'Ratio Calculator guide artwork supports the walkthrough by showing simplify, equivalent-ratio scaling, split-total math, decimal ratios, same-unit checks, and swapped-part mistakes.',
    },
  },
  'percent-error-calculator': {
    tool: {
      alt: 'Smoke mascot comparing lab cards for 2.45 g/cm3 vs 2.70 g/cm3, 48 cm vs 50 cm, 105 mL vs 100 mL, and signed percent error direction.',
      caption:
        'Percent Error Calculator artwork matches the live workflow: compare measured and accepted values, keep units matched, find absolute percent error, and read whether the result was high or low.',
    },
    guide: {
      alt: 'Smoke mascot explaining percent error formula steps with density, length, volume, and boiling-point examples beside high and low result arrows.',
      caption:
        'Percent Error Calculator guide artwork supports the walkthrough by showing measured-versus-accepted values, same-unit checks, signed error, zero-value limits, and lab-report cautions.',
    },
  },
  'watts-to-amps-calculator': {
    tool: {
      alt: 'Smoke mascot comparing 1,500 W at 120 V, 60 W at 12 V, 2,200 W at 240 V, and 5,000 W three-phase amp cards.',
      caption:
        'Watts to Amps Calculator artwork matches the live workflow: enter watts, voltage, phase type, and power factor, then estimate current for DC, single-phase, or three-phase loads.',
    },
    guide: {
      alt: 'Smoke mascot explaining watts divided by volts, power factor, square-root-of-3 three-phase math, and breaker-safety caution cards.',
      caption:
        'Watts to Amps Calculator guide artwork supports the walkthrough by showing DC and AC formulas, power factor, three-phase math, example current draw, and safety limits.',
    },
  },
  'brick-calculator': {
    tool: {
      alt: 'Smoke mascot measuring a 120 square foot wall, 7.625 by 2.25 inch bricks, 3/8 inch mortar joints, 10 percent waste, and a 906 brick result card.',
      caption:
        'Brick Calculator artwork matches the live workflow: enter net wall area, brick face dimensions, mortar joint, and waste, then round up the brick count.',
    },
    guide: {
      alt: 'Smoke mascot explaining brick face area, net wall area after openings, 3/8 inch joint checks, waste, and separate mortar planning.',
      caption:
        'Brick Calculator guide artwork supports the walkthrough by showing wall-area measurement, supplier brick dimensions, joint-size checks, waste, and masonry limits.',
    },
  },
  'carpet-calculator': {
    tool: {
      alt: 'Smoke mascot measuring a 15 by 12 foot bedroom, a 12 foot carpet roll, 10 percent waste, 22 square yards, and 16.5 linear feet.',
      caption:
        'Carpet Calculator artwork matches the live workflow: enter room length, room width, roll width, and waste to estimate square yards and rough roll length.',
    },
    guide: {
      alt: 'Smoke mascot checking carpet roll width, seam direction, closets, stairs, waste, and a 22 square yard bedroom example.',
      caption:
        'Carpet Calculator guide artwork supports the walkthrough by showing room measurement, roll-width checks, seam limits, waste, and installer-layout cautions.',
    },
  },
  'concrete-block-calculator': {
    tool: {
      alt: 'Smoke mascot counting a 40 by 8 foot CMU wall, 20 square foot opening, 8 by 16 inch blocks, 5 percent waste, 12 courses, and 355 blocks.',
      caption:
        'Concrete Block Calculator artwork matches the live workflow: enter wall size, openings, nominal block size, and waste to estimate blocks, courses, and blocks per course.',
    },
    guide: {
      alt: 'Smoke mascot checking nominal CMU size, openings before waste, 8/9 square foot block face area, courses, corners, mortar, grout, rebar, and footing limits.',
      caption:
        'Concrete Block Calculator guide artwork supports the walkthrough by showing nominal block sizing, opening subtraction, waste, courses, and structural-limit cautions.',
    },
  },
  'concrete-calculator': {
    tool: {
      alt: 'Smoke mascot measuring a 10 by 12 foot slab, 4 inch depth, 10 percent waste, 1.63 cubic yards, and 74 common 80 lb concrete bags.',
      caption:
        'Concrete Calculator artwork matches the live workflow: enter slab length, width, depth, and waste to estimate cubic yards, cubic meters, and common bag counts.',
    },
    guide: {
      alt: 'Smoke mascot explaining slab length, width, 4 inch depth, cubic feet, cubic yards, bag yield labels, uneven base waste, and ready-mix ordering limits.',
      caption:
        'Concrete Calculator guide artwork supports the walkthrough by showing slab volume math, bag-yield checks, waste, and ordering-limit cautions.',
    },
  },
  'cubic-yard-calculator': {
    tool: {
      alt: 'Smoke mascot measuring a 20 by 10 foot material bed, 3 inch depth, 5 percent waste, 52.5 cubic feet, and 1.94 cubic yards.',
      caption:
        'Cubic Yard Calculator artwork matches the live workflow: enter length, width, inch depth, and waste to estimate cubic feet, cubic yards, and cubic meters.',
    },
    guide: {
      alt: 'Smoke mascot explaining 27 cubic feet per cubic yard, inch-to-foot depth conversion, supplier rounding, loose material, bags, and tons.',
      caption:
        'Cubic Yard Calculator guide artwork supports the walkthrough by showing depth conversion, cubic-yard math, waste, and supplier-order cautions.',
    },
  },
  'deck-cost-calculator': {
    tool: {
      alt: 'Smoke mascot pricing a 16 by 12 foot deck with 10 percent waste, $12 per square foot decking, 40 feet of railing, $750 stairs, and a $4,684.40 rough total.',
      caption:
        'Deck Cost Calculator artwork matches the live workflow: enter deck size, waste, decking price, railing, and stairs to estimate a rough project budget.',
    },
    guide: {
      alt: 'Smoke mascot comparing deck surface cost, railing cost, stair allowance, local labor, permits, framing, footings, and contractor quote limits.',
      caption:
        'Deck Cost Calculator guide artwork supports the walkthrough by showing surface math, railing and stair allowances, and real-quote cautions.',
    },
  },
  'drywall-calculator': {
    tool: {
      alt: 'Smoke mascot counting 480 square feet of drywall, 4 by 8 foot sheets, 10 percent waste, 528 adjusted square feet, and 17 whole panels.',
      caption:
        'Drywall Calculator artwork matches the live workflow: enter project area, sheet size, and waste to estimate a whole-panel count.',
    },
    guide: {
      alt: 'Smoke mascot checking drywall sheet size, waste, ceilings, doors, windows, seams, tape, mud, screws, moisture rating, and fire rating limits.',
      caption:
        'Drywall Calculator guide artwork supports the walkthrough by showing panel math, opening cautions, finish supplies, and code-limit checks.',
    },
  },
  'fence-calculator': {
    tool: {
      alt: 'Smoke mascot planning a 120 foot fence with one 4 foot gate, 116 feet of panel run, 15 panels, and 18 total posts.',
      caption:
        'Fence Calculator artwork matches the live workflow: enter perimeter, panel width, post spacing, gates, and gate width to estimate panels and posts.',
    },
    guide: {
      alt: 'Smoke mascot checking fence gates, line posts, corner posts, brace posts, rails, pickets, concrete, hardware, slope, utilities, setbacks, and permits.',
      caption:
        'Fence Calculator guide artwork supports the walkthrough by showing gate subtraction, post counts, panel layout, and real-job cautions.',
    },
  },
  'mulch-calculator': {
    tool: {
      alt: 'Smoke mascot pointing from an outlined garden bed and depth ruler to a mulch calculator form, mulch pile, cubic-yard cube, and filled bags.',
      caption:
        'Mulch Calculator artwork matches the live workflow: enter bed area, depth, bag size, and waste to estimate cubic yards and bags.',
    },
    guide: {
      alt: 'Smoke mascot guide showing a bed grid, mulch depth ruler, cubic-yard cube, mulch bags, and finished garden bed in a step-by-step flow.',
      caption:
        'Mulch Calculator guide artwork supports the walkthrough by showing how bed area and depth turn into cubic yards, bag count, and buying checks.',
    },
  },
  'gravel-calculator': {
    tool: {
      alt: 'Smoke mascot estimating a 20 by 10 foot gravel area at 4 inches deep, showing 2.47 cubic yards and 3.46 tons.',
      caption:
        'Gravel Calculator artwork matches the live workflow: enter length, width, depth, and tons per cubic yard to estimate gravel yards and tons.',
    },
    guide: {
      alt: 'Smoke mascot comparing gravel cubic yards, tons, depth, supplier density, compaction, delivery minimums, and driveway layers.',
      caption:
        'Gravel Calculator guide artwork supports the walkthrough by showing why yards, tons, depth, compaction, and supplier rules need separate checks.',
    },
  },
  'sand-calculator': {
    tool: {
      alt: 'Smoke mascot measuring a rectangular sand bed with a depth cross-section, sand pile, cubic-yard cube, and scale.',
      caption:
        'Sand Calculator artwork matches the live workflow: enter length, width, sand depth, density, and waste to estimate cubic feet, cubic yards, and tons.',
    },
    guide: {
      alt: 'Smoke mascot guide showing sand-bed area, depth, rectangular volume, sand pile, and scale steps from measuring to weight.',
      caption:
        'Sand Calculator guide artwork supports the walkthrough by showing how area, depth, cubic volume, density, and bag or ton checks connect.',
    },
  },
  'concrete-mix-calculator': {
    tool: {
      alt: 'Smoke mascot pointing from a concrete volume cube to a calculator, cement bag, sand buckets, gravel piles, and a mixed wheelbarrow.',
      caption:
        'Concrete Mix Calculator artwork matches the live workflow: enter concrete volume, ratio parts, bag yield, and waste to estimate cement bags, sand, and gravel.',
    },
    guide: {
      alt: 'Smoke mascot guide showing a concrete cube split into cement, sand, and gravel ratio steps before a final stack of cement bags.',
      caption:
        'Concrete Mix Calculator guide artwork supports the walkthrough by showing how volume, waste, ratio parts, and bag yield become a rough material list.',
    },
  },
  'concrete-driveway-calculator': {
    tool: {
      alt: 'Smoke mascot pointing at a measured concrete driveway slab leading to a garage, with concrete blocks, material bags, coins, and a cost sheet beside it.',
      caption:
        'Concrete Driveway Calculator artwork matches the live workflow: enter driveway length, width, slab thickness, waste, and price to estimate yards, bags, and rough material cost.',
    },
    guide: {
      alt: 'Smoke mascot guide showing driveway length and width arrows, slab thickness, concrete blocks, material bags, coins, and a cost sheet.',
      caption:
        'Concrete Driveway Calculator guide artwork supports the walkthrough by showing how slab size, thickness, waste, bag counts, and material-only cost connect.',
    },
  },
  'concrete-steps-calculator': {
    tool: {
      alt: 'Smoke mascot pointing at solid concrete porch steps with length, width, and riser arrows, plus a calculator, concrete blocks, and material bags.',
      caption:
        'Concrete Steps Calculator artwork matches the live workflow: enter step count, width, riser height, tread depth, landing depth, and waste to estimate yards and bags.',
    },
    guide: {
      alt: 'Smoke mascot guide showing stacked concrete step blocks, a top landing slab, measurement arrows, concrete blocks, aggregate, bags, and a calculator.',
      caption:
        'Concrete Steps Calculator guide artwork supports the walkthrough by showing how stacked steps, landing depth, waste, and bag counts connect.',
    },
  },
  'concrete-weight-calculator': {
    tool: {
      alt: 'Smoke mascot pointing at concrete cubes, a scale, aggregate-density blocks, weight blocks, and a calculator for converting concrete volume into pounds.',
      caption:
        'Concrete Weight Calculator artwork matches the live workflow: enter cubic yards, density, and waste to estimate concrete pounds and US tons.',
    },
    guide: {
      alt: 'Smoke mascot guide showing concrete cube volume, stacked blocks, aggregate-density cubes, a scale, a calculator, and heavy weight icons.',
      caption:
        'Concrete Weight Calculator guide artwork supports the walkthrough for cubic yards, density, waste, pounds, US tons, and mix-weight assumptions.',
    },
  },
  'concrete-reinforcing-mesh-calculator': {
    tool: {
      alt: 'Smoke mascot holding a welded wire mesh sheet beside a slab grid, overlap strips, cut mesh pieces, and a stack of mesh sheets.',
      caption:
        'Concrete Mesh Calculator artwork matches the live workflow: enter slab size, sheet size, overlap, and waste to estimate welded wire mesh sheets.',
    },
    guide: {
      alt: 'Smoke mascot guide showing a slab, overlapping mesh panels, a cut-corner layout, arrows for overlap, and a stack of sheets to buy.',
      caption:
        'Concrete Mesh Calculator guide artwork supports the walkthrough for slab area, effective sheet coverage, overlap, waste, cuts, and sheet-count limits.',
    },
  },
  'concrete-block-fill-calculator': {
    tool: {
      alt: 'Smoke mascot holding a calculator beside hollow CMU blocks, grout pouring into cores, a volume cube, bagged mix, and measurement lines.',
      caption:
        'Concrete Block Fill Calculator artwork matches the live workflow: enter blocks or filled cells, fill per block, and waste to estimate cubic yards and bags.',
    },
    guide: {
      alt: 'Smoke mascot guide showing CMU blocks, grout poured into one core, a volume cube, bagged mix, and arrows from calculator to fill result.',
      caption:
        'Concrete Block Fill Calculator guide artwork supports the walkthrough for block count, core-fill volume, waste, cubic yards, bag counts, and masonry limits.',
    },
  },
  'retaining-wall-calculator': {
    tool: {
      alt: 'Smoke mascot measuring a 40 ft by 3 ft segmental retaining wall with 16 by 6 inch blocks, cap blocks, base gravel, and a 189 block result card.',
      caption:
        'Retaining Wall Calculator artwork matches the live workflow: enter wall size, block size, cap length, base trench size, and waste to estimate blocks, caps, courses, and base gravel.',
    },
    guide: {
      alt: 'Smoke mascot guide showing retaining wall courses, blocks per course, cap blocks, base trench gravel, drainage cautions, and the 189 block example.',
      caption:
        'Retaining Wall Calculator guide artwork supports the walkthrough for courses, blocks per course, cap blocks, base gravel, waste, and construction safety limits.',
    },
  },
  'rebar-weight-calculator': {
    tool: {
      alt: 'Smoke mascot weighing twelve 20 ft #4 rebar bars with a 10 percent waste card, 0.668 lb per foot note, and 176.352 lb result.',
      caption:
        'Rebar Weight Calculator artwork matches the live workflow: choose #3 to #8 bar size, enter length, quantity, and waste, then estimate pounds and US tons.',
    },
    guide: {
      alt: 'Smoke mascot guide showing #3 to #8 rebar weight-per-foot chart, #4 slab-bar example, cut waste, lap-splice caution, pounds, and US tons.',
      caption:
        'Rebar Weight Calculator guide artwork supports the walkthrough for weight-per-foot values, #4 and #5 examples, waste, hauling checks, and design limits.',
    },
  },
  'concrete-column-calculator': {
    tool: {
      alt: 'Smoke mascot measuring three 18 inch round concrete column tubes filled 8 ft high with 10 percent waste, 1.73 cubic yards, and 78 eighty-pound bags.',
      caption:
        'Concrete Column Calculator artwork matches the live workflow: enter inside diameter, filled height, quantity, and waste to estimate cubic yards and concrete bag counts.',
    },
    guide: {
      alt: 'Smoke mascot guide showing inside tube diameter, filled height, radius formula, cubic yards, 60 and 80 lb bag counts, and bell-footing limit notes.',
      caption:
        'Concrete Column Calculator guide artwork supports the walkthrough for round column volume, bag counts, waste, and structural-design limits.',
    },
  },
  'post-hole-concrete-calculator': {
    tool: {
      alt: 'Smoke mascot measuring six 12 inch post holes filled 30 inches deep around 4 inch posts with 10 percent waste and 20 eighty-pound bags.',
      caption:
        'Post Hole Concrete Calculator artwork matches the live workflow: enter hole diameter, concrete depth, post diameter, quantity, and waste to estimate concrete bags.',
    },
    guide: {
      alt: 'Smoke mascot guide showing round post hole volume, post displacement, concrete per hole, cubic yards, 60 and 80 lb bag counts, and frost-depth limit notes.',
      caption:
        'Post Hole Concrete Calculator guide artwork supports the walkthrough for post displacement, concrete per hole, bag counts, waste, and code or load limits.',
    },
  },
  'plywood-calculator': {
    tool: {
      alt: 'Smoke mascot measuring a 420 square foot subfloor with 4 by 8 ft plywood sheets, 10 percent waste, 15 sheets, and a rough cost card.',
      caption:
        'Plywood Calculator artwork matches the live workflow: enter project area, sheet size, waste, and optional price to estimate whole plywood sheets and coverage bought.',
    },
    guide: {
      alt: 'Smoke mascot guide showing 4 by 8 plywood sheet area, 420 square feet, 10 percent waste, 15 sheets, seam and cut-layout caution cards.',
      caption:
        'Plywood Calculator guide artwork supports the walkthrough for 4 by 8 sheet math, roof or floor square footage, waste, whole-sheet rounding, and layout limits.',
    },
  },
  'countertop-calculator': {
    tool: {
      alt: 'Smoke mascot measuring an 18 ft countertop run at 25.5 in depth with 4 in backsplash, 4 ft2 cutouts, 10 percent waste, and 44.275 ft2.',
      caption:
        'Countertop Calculator artwork matches the live workflow: enter run length, depth, backsplash, cutouts, waste, and price to estimate adjusted square feet and rough material cost.',
    },
    guide: {
      alt: 'Smoke mascot guide showing countertop run length, depth, backsplash strip, sink cutout, 44.275 ft2 result, seam and quote caution cards.',
      caption:
        'Countertop Calculator guide artwork supports the walkthrough for kitchen counter square feet, backsplash area, cutouts, waste, and quote limits.',
    },
  },
  'sod-calculator': {
    tool: {
      alt: 'Smoke mascot measuring a 1,800 ft2 lawn with 10 ft2 sod rolls, 5 percent waste, 189 rolls, 4 pallets, and an $850.50 cost card.',
      caption:
        'Sod Calculator artwork matches the live workflow: enter lawn area, roll coverage, rolls per pallet, waste, and price to estimate sod rolls, pallets, adjusted area, and cost.',
    },
    guide: {
      alt: 'Smoke mascot guide showing lawn square feet, sod roll coverage, pallet count, waste trimming, 189 rolls, 4 pallets, and watering caution cards.',
      caption:
        'Sod Calculator guide artwork supports the walkthrough for lawn area, roll coverage, pallet packaging, waste, cost, and supplier-size limits.',
    },
  },
  'wall-stud-calculator': {
    tool: {
      alt: 'Smoke mascot measuring a 24 ft wall at 16 in on-center spacing with 2 openings, 10 percent waste, 19 layout studs, 6 plate pieces, and 36 boards.',
      caption:
        'Wall Stud Calculator artwork matches the live workflow: enter wall length, height, stud spacing, openings, extra corner studs, plate rows, board length, and waste to estimate studs and boards.',
    },
    guide: {
      alt: 'Smoke mascot guide showing a 24 ft framed wall, 16 in on-center stud layout, door and window openings, plate rows, 19 layout studs, and 36 boards.',
      caption:
        'Wall Stud Calculator guide artwork supports the walkthrough for stud spacing, openings, plate rows, waste, board count, and structural-plan limits.',
    },
  },
  'soil-calculator': {
    tool: {
      alt: 'Smoke mascot filling a raised garden bed with 120 ft2 area, 4 in soil depth, 10 percent extra, 44 ft3, 1.63 yd3, and 22 two-cubic-foot bags.',
      caption:
        'Soil Calculator artwork matches the live workflow: enter bed area, soil depth, and extra percent to estimate cubic feet, cubic yards, and common bag counts.',
    },
    guide: {
      alt: 'Smoke mascot guide showing raised bed area, 4 in topsoil depth, settling extra, 44 ft3, 1.63 yd3, 30 small bags, and 22 two-cubic-foot bags.',
      caption:
        'Soil Calculator guide artwork supports the walkthrough for raised beds, topsoil depth, cubic yards, bag counts, settling, and retail bag-size limits.',
    },
  },
  'tile-calculator': {
    tool: {
      alt: 'Smoke mascot measuring a 120 ft2 tile floor with 12 x 12 in tiles, 10 percent waste, 132 adjusted ft2, and 132 tiles.',
      caption:
        'Tile Calculator artwork matches the live workflow: enter project area, tile length, tile width, and waste percent to estimate a whole tile count.',
    },
    guide: {
      alt: 'Smoke mascot guide showing floor, wall, and shower tile areas, 12 x 12 tile size, 10 percent waste, 132 tiles, box coverage, and grout layout checks.',
      caption:
        'Tile Calculator guide artwork supports the walkthrough for square feet, tile size, waste, floor and shower measuring, box coverage, grout spacing, and layout limits.',
    },
  },
  'concrete-footing-calculator': {
    tool: {
      alt: 'Smoke mascot measuring a 30 ft concrete footing trench with 16 inch width, 8 inch depth, 10 percent waste, 1.09 cubic yards, and 49 eighty-pound bags.',
      caption:
        'Concrete Footing Calculator artwork matches the live workflow: enter footing length, width, depth, and waste to estimate cubic yards and concrete bag counts.',
    },
    guide: {
      alt: 'Smoke mascot guide showing footing length, width, depth, trench overdigging, cubic yards, 60 and 80 lb bag counts, and soil or frost limit notes.',
      caption:
        'Concrete Footing Calculator guide artwork supports the walkthrough for straight footing volume, bag counts, waste, cost checks, and code or soil limits.',
    },
  },
  'siding-calculator': {
    tool: {
      alt: 'Smoke mascot measuring a house wall with window and door openings, siding panels, stacked siding squares, box coverage icons, and waste offcuts.',
      caption:
        'Siding Calculator artwork matches the live workflow: measure wall area and openings, add waste, then estimate siding squares, boxes, and material cost.',
    },
    guide: {
      alt: 'Smoke mascot guide showing siding estimate steps from wall area to openings, siding panel stacks, box counts, and waste pieces.',
      caption:
        'Siding Calculator guide artwork supports the walkthrough by showing how wall area, gables, openings, waste, squares, and boxes connect.',
    },
  },
  'paver-calculator': {
    tool: {
      alt: 'Smoke mascot pointing at a curved paver patio layout with single-paver size cards, cut-edge blocks, spare pavers, and a stacked buying count.',
      caption:
        'Paver Calculator artwork matches the live workflow: enter project area, paver size, and waste to estimate a whole-paver buying count.',
    },
    guide: {
      alt: 'Smoke mascot guide showing a paver patio outline, one paver size card, filled layout, cut pieces, adjusted area, and a stacked paver order.',
      caption:
        'Paver Calculator guide artwork supports the walkthrough by showing how area, paver size, cuts, and waste become a rounded paver count.',
    },
  },
  'pool-volume-calculator': {
    tool: {
      alt: 'Smoke mascot pointing at rectangular, round, and oval pool cards with depth arrows, water cubes, and a gallon jug for pool volume.',
      caption:
        'Pool Volume Calculator artwork matches the live workflow: choose pool shape, enter dimensions and average depth, then estimate U.S. gallons.',
    },
    guide: {
      alt: 'Smoke mascot guide showing pool shape cards, an average-depth waterline section, cubic-foot water blocks, and a gallon jug.',
      caption:
        'Pool Volume Calculator guide artwork supports the walkthrough by showing how pool shape, average depth, cubic feet, and gallons connect.',
    },
  },
  'rebar-calculator': {
    tool: {
      alt: 'Smoke mascot pointing at a rectangular slab rebar grid with measuring marks, cut bar pieces, and stacked stock bars.',
      caption:
        'Rebar Calculator artwork matches the live workflow: enter slab length, slab width, bar spacing, stock bar length, and waste to estimate grid counts and stock bars.',
    },
    guide: {
      alt: 'Smoke mascot explaining panels that turn a concrete slab into one-way bars, a full rebar grid, cut pieces, and bundled stock bars.',
      caption:
        'Rebar Calculator guide artwork supports the walkthrough by showing slab layout, bar spacing, grid count, cut waste, and stock-bar buying limits.',
    },
  },
  'volume-calculator': {
    tool: {
      alt: 'Smoke mascot beside a glowing sphere bowl, cylinder, and box showing the shapes used for volume calculations.',
      caption:
        'Volume Calculator artwork matches the live workflow: choose a box, cube, cylinder, sphere, or cone shape, then enter the matching dimensions.',
    },
    guide: {
      alt: 'Smoke mascot pouring glowing volume into a round jar while a small sphere floats nearby.',
      caption:
        'Volume Calculator guide artwork supports the walkthrough by showing capacity, round-shape volume, and cubic-space thinking.',
    },
  },
  'annuity-calculator': {
    tool: {
      alt: 'Smoke mascot comparing annuity payment cards with $500 monthly payments, 5 percent rate, 20 years, ordinary timing, future value, and present value.',
      caption:
        'Annuity Calculator artwork matches the live workflow: fixed payment amount, annual rate, years, payment frequency, timing, future value, and present value.',
    },
    guide: {
      alt: 'Smoke mascot explaining annuity due versus ordinary annuity timing beside payment-count, future-value, present-value, fee, and surrender-charge notes.',
      caption:
        'Annuity Calculator guide artwork supports the walkthrough by showing payment timing, 240 monthly payments, future value, present value, and contract cautions.',
    },
  },
  'annuity-payout-calculator': {
    tool: {
      alt: 'Smoke mascot spreading a $100,000 annuity balance into 240 monthly payout cards with 5 percent rate, payment count, total paid, and interest notes.',
      caption:
        'Annuity Payout Calculator artwork matches the live workflow: starting balance, annual rate, payout term, payments per year, payout amount, total paid, and interest.',
    },
    guide: {
      alt: 'Smoke mascot comparing fixed-term annuity payout cards with monthly payment, total-paid, interest, surrender-charge, rider, and tax caution notes.',
      caption:
        'Annuity Payout Calculator guide artwork supports the walkthrough by showing fixed-term payout math beside contract limits like fees, riders, taxes, and surrender rules.',
    },
  },
  'credit-card-calculator': {
    tool: {
      alt: 'Smoke mascot checking one credit card balance with 22.9 percent APR, $250 monthly payment, payoff months, interest, and total paid cards.',
      caption:
        'Credit Card Calculator artwork matches the live workflow: balance, APR, monthly payment, new card spending, payoff months, interest, total paid, and final payment.',
    },
    guide: {
      alt: 'Smoke mascot comparing $250 and $350 credit card payments beside payoff-month, interest, total-paid, and new-spending notes.',
      caption:
        'Credit Card Calculator guide artwork supports the walkthrough by showing how APR, payment size, and new spending change payoff time and interest.',
    },
  },
  'credit-cards-payoff-calculator': {
    tool: {
      alt: 'Smoke mascot grouping three credit card balance cards into one $8,500 payoff plan with 21.5 percent weighted APR, $350 regular payment, $100 extra payment, payoff months, interest, and total paid.',
      caption:
        'Credit Cards Payoff Calculator artwork matches the combined-card workflow: balances, weighted APR, regular payment, extra payment, payoff months, interest, total paid, and final payment.',
    },
    guide: {
      alt: 'Smoke mascot comparing a combined credit card payoff shortcut with separate card notes for APR, payment allocation, grace period, fees, balance transfers, and new purchases.',
      caption:
        'Credit Cards Payoff Calculator guide artwork supports the walkthrough by showing where a combined payoff shortcut helps and where card-by-card rules still matter.',
    },
  },
  'debt-payoff-calculator': {
    tool: {
      alt: 'Smoke mascot checking a $10,000 debt payoff plan with 12 percent annual rate, $300 regular payment, $100 extra payment, 29 months, interest, total paid, and final payment.',
      caption:
        'Debt Payoff Calculator artwork matches the fixed-balance workflow: balance, annual rate, regular payment, extra payment, payoff months, interest, total paid, and final payment.',
    },
    guide: {
      alt: 'Smoke mascot comparing a fixed debt payoff estimate with budget notes, creditor call notes, payment-plan paperwork, debt-collection warnings, and extra-payment choices.',
      caption:
        'Debt Payoff Calculator guide artwork supports the walkthrough by showing where payoff math helps and where creditor, collector, budget, or counseling details still matter.',
    },
  },
  'debt-consolidation-calculator': {
    tool: {
      alt: 'Smoke mascot comparing $18,000 current debt with a 10.5 percent three-year consolidation loan, $300 fee, lower monthly payment, and total cost savings.',
      caption:
        'Debt Consolidation Calculator artwork matches the comparison job: current debt, current APR, current payment, new loan APR, term, fees, monthly payment change, and total cost change.',
    },
    guide: {
      alt: 'Smoke mascot checking a consolidation loan offer beside budget notes, fee slips, credit-warning cards, home-collateral caution, and payoff comparison charts.',
      caption:
        'Debt Consolidation Calculator guide artwork supports the walkthrough by showing why the fee, term, APR, credit risk, collateral risk, and total cost matter before signing.',
    },
  },
  'personal-loan-calculator': {
    tool: {
      alt: 'Smoke mascot comparing a $12,000 personal loan with 10.5 percent rate, 2 percent origination fee, monthly payment, cash received, interest, and total cost cards.',
      caption:
        'Personal Loan Calculator artwork matches the workflow: loan amount, rate or APR, term, origination fee, cash received, monthly payment, interest, and total cost.',
    },
    guide: {
      alt: 'Smoke mascot checking a personal loan offer beside APR notes, fee slips, cash-received card, payment calendar, and scam-warning sign.',
      caption:
        'Personal Loan Calculator guide artwork supports the walkthrough by showing why the fee, APR, cash received, payment, and lender warning signs matter before signing.',
    },
  },
  'refinance-calculator': {
    tool: {
      alt: 'Smoke mascot comparing a current $280,000 loan with a 5.9 percent refinance, rolled closing costs, new payment, monthly savings, break-even months, and total cost change cards.',
      caption:
        'Refinance Calculator artwork matches the workflow: current balance, current rate, new rate, new term, closing costs, new payment, monthly savings, break-even time, and total cost change.',
    },
    guide: {
      alt: 'Smoke mascot checking a refinance offer beside Loan Estimate notes, APR and point cards, closing-cost receipt, break-even calendar, and rescission timing reminder.',
      caption:
        'Refinance Calculator guide artwork supports the walkthrough by showing why payment savings, closing costs, APR, points, break-even time, and lender disclosures need checking together.',
    },
  },
  'va-mortgage-calculator': {
    tool: {
      alt: 'Smoke mascot checking a $360,000 VA-backed purchase loan with no down payment, 2.15 percent funding fee, financed-fee loan balance, payment, tax, insurance, and loan-to-value cards.',
      caption:
        'VA Mortgage Calculator artwork matches the workflow: home price, down payment, first-use status, funding-fee exemption, financed funding fee, monthly payment, tax, insurance, and loan-to-value.',
    },
    guide: {
      alt: 'Smoke mascot comparing VA funding-fee paperwork, Certificate of Eligibility notes, Loan Estimate, closing-cost receipt, and payment cards for a VA purchase loan.',
      caption:
        'VA Mortgage Calculator guide artwork supports the walkthrough by showing why funding-fee status, exemption proof, Loan Estimate details, closing costs, and payment math need checking together.',
    },
  },
  'heloc-calculator': {
    tool: {
      alt: 'Smoke mascot checking an $80,000 HELOC line with $30,000 drawn, interest-only payment, repayment estimate, available equity, and CLTV cards.',
      caption:
        'HELOC Calculator artwork matches the workflow: home value, mortgage balance, credit line, current draw, rate, interest-only payment, repayment estimate, available equity, and CLTV.',
    },
    guide: {
      alt: 'Smoke mascot comparing a HELOC draw-period payment with repayment-period jump notes, variable-rate cards, fee slips, line-freeze warning, and home-collateral caution.',
      caption:
        'HELOC Calculator guide artwork supports the walkthrough by showing why draw amount, repayment timing, variable rates, fees, line freezes, and home-collateral risk need checking together.',
    },
  },
  'payment-calculator': {
    tool: {
      alt: 'Smoke mascot linking amount financed, interest-rate gauge, term calendar, and a row of monthly payment cards for the Payment Calculator.',
      caption:
        'Payment Calculator artwork matches the fixed-payment workflow: amount financed, rate, term, monthly payment, total paid, and total interest.',
    },
    guide: {
      alt: 'Smoke mascot pointing from amount, rate, and term input cards into a fixed-payment formula hub with payment and total-cost result cards.',
      caption:
        'Payment Calculator guide artwork shows how amount financed, interest rate, and term feed the monthly payment, total paid, and interest walkthrough.',
    },
  },
  'repayment-calculator': {
    tool: {
      alt: 'Smoke mascot checking a $12,000 repayment balance with 8 percent annual rate, $300 regular payment, $50 extra payment, 40-month payoff, interest, total paid, and final payment cards.',
      caption:
        'Repayment Calculator artwork matches the fixed-balance workflow: balance, annual rate or APR, regular payment, extra payment, payoff months, interest, total paid, and final payment.',
    },
    guide: {
      alt: 'Smoke mascot comparing a fixed-balance repayment estimate with APR disclosure notes, Federal Student Aid plan notes, budget reminders, fee warnings, and extra-payment choices.',
      caption:
        'Repayment Calculator guide artwork supports the walkthrough by showing where simple payoff math helps and where official plans, fees, payment timing, and budget limits still matter.',
    },
  },
  'student-loan-calculator': {
    tool: {
      alt: 'Smoke mascot checking a student loan screen with $30,000 balance, 6.5 percent annual rate, 10-year term, $50 extra principal, scheduled payment, payoff months, and interest-saved cards.',
      caption:
        'Student Loan Calculator artwork matches the live workflow: balance, annual rate, term, extra monthly principal, scheduled payment, payoff time, total interest, and interest saved.',
    },
    guide: {
      alt: 'Smoke mascot comparing student loan payment math with Federal Student Aid Loan Simulator notes, interest-rate notes, servicer rules, IDR warnings, and private-loan cautions.',
      caption:
        'Student Loan Calculator guide artwork supports the walkthrough by showing where simple payment math helps and where official federal, servicer, and private-loan rules still matter.',
    },
  },
  'college-cost-calculator': {
    tool: {
      alt: 'Smoke mascot planning a college cost screen with $28,000 annual cost, 8 years until start, 4 school years, monthly savings, first-year cost, total cost, projected savings, and gap cards.',
      caption:
        'College Cost Calculator artwork matches the live workflow: annual cost, years until school, school years, cost increase, savings, first-year cost, total cost, and savings gap.',
    },
    guide: {
      alt: 'Smoke mascot comparing college sticker cost with net price calculator notes, aid-offer cards, tuition, fees, housing, books, transportation, savings, and loan cautions.',
      caption:
        'College Cost Calculator guide artwork supports the walkthrough by showing where a savings-gap estimate helps and where net price calculators, aid offers, and school-specific costs still matter.',
    },
  },
  'interest-calculator': {
    tool: {
      alt: 'Smoke mascot comparing simple and compound interest screens with $1,000 principal, 5 percent annual rate, 3 years, $150 interest, and compound-growth cards.',
      caption:
        'Interest Calculator artwork matches the live workflow: simple mode, compound mode, principal, annual interest rate, time in years, compounding frequency, monthly deposits, and ending balance.',
    },
    guide: {
      alt: 'Smoke mascot explaining simple interest versus compound interest beside APR, APY, bank-account, loan, and investment-return warning notes.',
      caption:
        'Interest Calculator guide artwork supports the walkthrough by showing when to use simple interest, when to use compounding, and why APR, APY, fees, taxes, and risk still need checking.',
    },
  },
  'simple-interest-calculator': {
    tool: {
      alt: 'Smoke mascot checking a simple interest screen with $1,000 principal, 5 percent annual rate, 3 years, $150 interest, and $1,150 ending balance cards.',
      caption:
        'Simple Interest Calculator artwork matches the live workflow: principal, annual simple interest rate, time in years, simple interest, and ending balance.',
    },
    guide: {
      alt: 'Smoke mascot explaining principal x annual rate x time beside $1,000, 5 percent, 3 years, APR warning, compounding warning, and ending balance notes.',
      caption:
        'Simple Interest Calculator guide artwork supports the walkthrough by showing the principal-rate-time formula, the $150 interest example, and limits around APR, compounding, and fees.',
    },
  },
  'cd-calculator': {
    tool: {
      alt: 'Smoke mascot checking a CD screen with $10,000 deposit, 4.25 percent APY, 12-month term, $425 interest, $10,425 maturity value, and a 3-month penalty card.',
      caption:
        'CD Calculator artwork matches the live workflow: deposit amount, APY, CD term, interest earned, maturity value, early-withdrawal penalty, and value after penalty.',
    },
    guide: {
      alt: 'Smoke mascot comparing a CD offer with APY, term length, maturity value, renewal, grace-period, FDIC insurance, and early-withdrawal penalty notes.',
      caption:
        'CD Calculator guide artwork supports the walkthrough by showing how APY, term, maturity value, insurance limits, renewal rules, and penalty terms need checking before using a CD estimate.',
    },
  },
  'bond-calculator': {
    tool: {
      alt: 'Smoke mascot checking a bond screen with $1,000 face value, $950 market price, 5 percent coupon, 10-year maturity, $50 annual coupon, 5.26 percent current yield, and rough YTM card.',
      caption:
        'Bond Calculator artwork matches the live workflow: face value, market price, coupon rate, years to maturity, coupon frequency, annual coupon, current yield, and rough YTM.',
    },
    guide: {
      alt: 'Smoke mascot comparing bond yield notes for coupon income, discount price, premium price, current yield, rough YTM, callable-bond risk, and TreasuryDirect savings bond lookup.',
      caption:
        'Bond Calculator guide artwork supports the walkthrough by showing how coupon income, market price, rough YTM, call risk, accrued interest, and savings-bond lookup limits need checking.',
    },
  },
  'mutual-fund-calculator': {
    tool: {
      alt: 'Smoke mascot checking a mutual fund screen with $5,000 starting investment, $250 monthly contribution, 7 percent expected return, 0.5 percent expense ratio, 20 years, $140,887 after expenses, and $9,538 expense drag.',
      caption:
        'Mutual Fund Calculator artwork matches the live workflow: starting investment, monthly contribution, expected return, expense ratio, years invested, before-expense balance, after-expense balance, and fee drag.',
    },
    guide: {
      alt: 'Smoke mascot comparing mutual fund notes for expense ratio, NAV, share class, sales loads, taxable distributions, prospectus checks, market risk, and monthly contributions.',
      caption:
        'Mutual Fund Calculator guide artwork supports the walkthrough by showing where contribution math helps and where NAV, share class, loads, distributions, taxes, and prospectus details still matter.',
    },
  },
  'roth-ira-calculator': {
    tool: {
      alt: 'Smoke mascot checking a Roth IRA projection screen with $12,000 current balance, $7,500 annual contribution, 7 percent expected return, 25 years, $574,999 projected balance, MAGI phase-out notes, and 2026 IRS limit reminders.',
      caption:
        'Roth IRA Calculator artwork matches the live workflow: current balance, annual contribution, expected return, years to grow, projected balance, total contributions, estimated growth, and 2026 IRS eligibility checks.',
    },
    guide: {
      alt: 'Smoke mascot comparing Roth IRA guide notes for $7,500 2026 contribution limit, $1,100 catch-up amount, $8,600 age 50 plus total, MAGI phase-outs, 59-and-a-half withdrawals, and the 5-year rule.',
      caption:
        'Roth IRA Calculator guide artwork supports the walkthrough by separating growth math from MAGI phase-outs, contribution limits, qualified distribution rules, taxes, penalties, and market risk.',
    },
  },
  'ira-calculator': {
    tool: {
      alt: 'Smoke mascot checking an IRA projection screen with $25,000 current balance, $7,500 annual contribution, 6.5 percent expected return, 20 years, $397,924 projected balance, and 2026 IRS limit reminders.',
      caption:
        'IRA Calculator artwork matches the live workflow: current balance, annual contribution, expected return, years to grow, projected IRA balance, total contributions, estimated growth, and 2026 IRS rule checks.',
    },
    guide: {
      alt: 'Smoke mascot comparing IRA guide notes for $7,500 2026 contribution limit, $1,100 catch-up amount, $8,600 age 50 plus total, taxable compensation, deduction phase-outs, RMDs, and Roth eligibility.',
      caption:
        'IRA Calculator guide artwork supports the walkthrough by separating growth math from taxable compensation, traditional IRA deduction limits, Roth eligibility, RMDs, taxes, penalties, fees, and market risk.',
    },
  },
  'vat-calculator': {
    tool: {
      alt: 'Smoke mascot checking a VAT calculator screen with $100 net price, 20 percent VAT rate, add mode, $20 VAT amount, and $120 gross total.',
      caption:
        'VAT Calculator artwork matches the live workflow: choose add or remove VAT, enter the amount and rate, then compare net amount, VAT amount, gross amount, and rate used.',
    },
    guide: {
      alt: 'Smoke mascot explaining VAT add and remove examples with $100 net to $120 gross, $120 gross to $100 net, 5 percent rate notes, and invoice cautions.',
      caption:
        'VAT Calculator guide artwork supports the walkthrough by showing add-VAT and remove-VAT examples beside rate, invoice, exemption, reverse-charge, and country-rule cautions.',
    },
  },
  'cash-back-or-low-interest-calculator': {
    tool: {
      alt: 'Smoke mascot comparing a $32,000 car offer with a 4 percent rebate at 7.2 percent APR against a 3.9 percent low-APR offer, with total-cost and savings cards.',
      caption:
        'Cash Back or Low Interest Calculator artwork matches the live workflow: purchase amount, payoff months, cash-back percent, APR with rebate, low-interest APR, total cost, and estimated savings.',
    },
    guide: {
      alt: 'Smoke mascot checking dealer incentive notes for cash-back rebate rules, low-APR eligibility, written out-the-door price, add-ons, and total-cost comparison.',
      caption:
        'Cash Back or Low Interest Calculator guide artwork supports the walkthrough by separating rebate math from dealer rules, credit approval, add-ons, taxes, fees, and written offer terms.',
    },
  },
  'auto-lease-calculator': {
    tool: {
      alt: 'Smoke mascot checking a car lease worksheet with a $36,000 price, $21,000 residual value, 0.0025 money factor, 36-month term, fees, tax, and monthly payment cards.',
      caption:
        'Auto Lease Calculator artwork matches the live workflow: vehicle price, residual value, money factor, lease term, down payment, trade-in, fees, tax, adjusted capitalized cost, and monthly payment.',
    },
    guide: {
      alt: 'Smoke mascot reviewing auto lease terms for amount due at signing, mileage allowance, residual value, money factor, wear charges, buyout option, and lease-end fees.',
      caption:
        'Auto Lease Calculator guide artwork supports the walkthrough by tying lease math to written quote checks: amount due at signing, mileage limits, fees, wear rules, purchase option, and total lease amount.',
    },
  },
  'break-even-calculator': {
    tool: {
      alt: 'Smoke mascot checking $5,000 fixed costs, $40 price, $18 variable cost, $22 contribution margin, 227.27 break-even units, and $9,090.91 sales cards.',
      caption:
        'Break Even Calculator artwork matches the live workflow: fixed costs, price per unit, variable cost per unit, contribution margin, break-even units, and break-even sales.',
    },
    guide: {
      alt: 'Smoke mascot sorting break-even cards for fixed costs, variable costs, contribution margin, rounded-up unit sales, mixed-product limits, fees, refunds, and capacity notes.',
      caption:
        'Break Even Calculator guide artwork supports the walkthrough by separating simple zero-profit math from demand, cash flow, mixed products, capacity, refunds, fees, taxes, and owner pay.',
    },
  },
  'profit-goal-calculator': {
    tool: {
      alt: 'Smoke mascot checking $5,000 fixed costs, $2,000 target profit, $40 price, $18 variable cost, $22 contribution margin, 318.18 target-profit units, and $12,727.27 sales cards.',
      caption:
        'Profit Goal Calculator artwork matches the live workflow: fixed costs, target profit, price per unit, variable cost per unit, contribution margin, target-profit units, and required sales.',
    },
    guide: {
      alt: 'Smoke mascot sorting profit-goal cards for fixed costs, desired profit, contribution margin, rounded-up units, event sales, capacity limits, refunds, fees, taxes, and mixed-product notes.',
      caption:
        'Profit Goal Calculator guide artwork supports the walkthrough by separating target-profit math from demand, capacity, cash flow, taxes, owner pay, refunds, fees, shipping, waste, and mixed-product sales.',
    },
  },
  'liquidity-ratios-calculator': {
    tool: {
      alt: 'Smoke mascot checking $120,000 current assets, $80,000 current liabilities, $40,000 working capital, 1.50 current ratio, 1.13 quick ratio, and 0.50 cash ratio cards.',
      caption:
        'Liquidity Ratios Calculator artwork matches the live workflow: current assets, current liabilities, working capital, current ratio, quick ratio, cash ratio, inventory, prepaid expenses, cash, and marketable securities.',
    },
    guide: {
      alt: 'Smoke mascot sorting liquidity-ratio cards for balance sheet date, current assets, current liabilities, inventory, prepaid expenses, receivables, cash timing, and industry context.',
      caption:
        'Liquidity Ratios Calculator guide artwork supports the walkthrough by separating balance sheet ratio math from inventory quality, receivable collection, cash timing, industry context, lender covenants, and accounting limits.',
    },
  },
  'debt-ratios-calculator': {
    tool: {
      alt: 'Smoke mascot checking $220,000 debt, $500,000 assets, $280,000 equity, 44% debt ratio, 0.79x debt-to-equity, and 6x interest cover cards.',
      caption:
        'Debt Ratios Calculator artwork matches the live workflow: total debt, total assets, total equity, EBIT, interest expense, debt ratio, debt-to-equity, and times interest earned.',
    },
    guide: {
      alt: 'Smoke mascot sorting debt-ratio cards for balance sheet date, total debt, assets, equity, EBIT, interest expense, maturity dates, covenants, and cash-flow limits.',
      caption:
        'Debt Ratios Calculator guide artwork supports the walkthrough by separating debt-load ratios from interest coverage, cash flow, maturity dates, lease treatment, lender covenants, and industry context.',
    },
  },
  'operations-ratios-calculator': {
    tool: {
      alt: 'Smoke mascot checking $600,000 COGS, $100,000 average inventory, 6x inventory turnover, 1.90x asset turnover, 8.75x receivables turnover, and 41.71 collection-day cards.',
      caption:
        'Operations Ratios Calculator artwork matches the live workflow: COGS, beginning inventory, ending inventory, net sales, average assets, credit sales, receivables, inventory turnover, asset turnover, receivables turnover, and collection days.',
    },
    guide: {
      alt: 'Smoke mascot sorting operations-ratio cards for average inventory, net sales, average assets, credit sales, receivables, stockout risk, seasonality, and credit-policy limits.',
      caption:
        'Operations Ratios Calculator guide artwork supports the walkthrough by separating turnover math from seasonality, inventory method, stockout risk, credit policy, bad-debt risk, and industry context.',
    },
  },
  'profitability-ratios-calculator': {
    tool: {
      alt: 'Smoke mascot checking $950,000 sales, $600,000 COGS, $120,000 net income, 36.84% gross margin, 12.63% net margin, 24% ROA, 46.15% ROE, $1.20 EPS, and 15x P/E cards.',
      caption:
        'Profitability Ratios Calculator artwork matches the live workflow: net sales, COGS, operating income, net income, average assets, average equity, shares, price, gross margin, operating margin, net margin, ROA, ROE, EPS, and P/E.',
    },
    guide: {
      alt: 'Smoke mascot sorting profitability-ratio cards for net sales, COGS, operating income, net income, average assets, average equity, EPS, P/E, one-time costs, debt, and share-dilution limits.',
      caption:
        'Profitability Ratios Calculator guide artwork supports the walkthrough by separating margin math, return math, per-share math, one-time gains, taxes, cash flow, debt load, share dilution, and industry context.',
    },
  },
  'stock-ratios-calculator': {
    tool: {
      alt: 'Smoke mascot comparing $18 stock price, $1.20 EPS, $9.50 sales per share, $2.60 book value per share, $0.45 dividend, 15x P/E, 1.89x P/S, 6.92x P/B, 2.5% yield, and 37.5% payout cards.',
      caption:
        'Stock Ratios Calculator artwork matches the live workflow: stock price, EPS, sales per share, book value per share, dividend per share, P/E, price-to-sales, price-to-book, dividend yield, and payout ratio.',
    },
    guide: {
      alt: 'Smoke mascot sorting stock-ratio cards for share price, EPS, sales per share, book value, dividend, P/E, P/S, P/B, yield, payout, debt risk, and dividend-cut warnings.',
      caption:
        'Stock Ratios Calculator guide artwork supports the walkthrough by separating valuation multiples, dividend math, trailing versus forward EPS, accounting quality, dividend safety, debt, dilution, and industry context.',
    },
  },
  'social-security-calculator': {
    tool: {
      alt: 'Smoke mascot comparing birth year 1962, $2,400 FRA benefit, claim ages 62, 67, and 70, with $1,680, $2,400, and $3,224 monthly benefit cards.',
      caption:
        'Social Security Calculator artwork matches the live workflow: birth year, full-retirement-age benefit, claiming age, early reduction, delayed credits, monthly estimate, and annual estimate.',
    },
    guide: {
      alt: 'Smoke mascot sorting Social Security cards for birth year, SSA benefit estimate, full retirement age, claim age 62, claim age 70, spouse rules, taxes, Medicare, and COLA limits.',
      caption:
        'Social Security Calculator guide artwork supports the walkthrough by separating claiming-age math from official SSA records, spouse or survivor benefits, work rules, taxes, Medicare, and future COLA changes.',
    },
  },
  'rmd-calculator': {
    tool: {
      alt: 'Smoke mascot moving coins from a retirement savings jar into a bowl beside a calendar and worksheet for an RMD withdrawal estimate.',
      caption:
        'RMD Calculator artwork matches the page task: use a prior December 31 balance, age, IRS table factor, estimated withdrawal, and balance check.',
    },
    guide: {
      alt: 'Smoke mascot pointing at a worksheet while coins move from a savings jar into a bowl for an RMD guide check.',
      caption:
        'RMD Calculator guide artwork supports the walkthrough by tying the visible savings jar, worksheet, and withdrawal bowl to the RMD balance, age, table-factor, and limit checks.',
    },
  },
  'real-estate-calculator': {
    tool: {
      alt: 'Smoke mascot linking two houses, coin stacks, a calculator, a sale document, a handshake, and a rising chart for a property sale profit estimate.',
      caption:
        'Real Estate Calculator artwork matches the sale-profit workflow: purchase price, cash invested, selling price, selling costs, loan payoff, net proceeds, profit, ROI, and equity multiple.',
    },
    guide: {
      alt: 'Smoke mascot pointing through a property sale flow with a house, coin stacks, cost blocks, proceeds bowl, rising chart, shielded home, and final document.',
      caption:
        'Real Estate Calculator guide artwork supports the walkthrough by showing the visible house, cost blocks, proceeds bowl, chart, and document behind the sale-profit and limit checks.',
    },
  },
  'take-home-paycheck-calculator': {
    tool: {
      alt: 'Smoke mascot holding a paycheck above arrows to coin stacks, shield icons, tax coins, a calendar, calculator, mug, notebook, and final take-home money bag.',
      caption:
        'Take-Home-Paycheck Calculator artwork matches the live workflow: annual salary, pay schedule, pretax deductions, withholding estimates, employee FICA, and final take-home pay.',
    },
    guide: {
      alt: 'Smoke mascot pointing at a paycheck flow with salary coins, pay-period calendars, benefit shields, tax icons, payroll coins, and a final money bag.',
      caption:
        'Take-Home-Paycheck Calculator guide artwork supports the walkthrough by showing salary, pay periods, deductions, tax estimates, FICA, and take-home pay as separate steps.',
    },
  },
  'rental-property-calculator': {
    tool: {
      alt: 'Smoke mascot pointing between a rental house, tenant icons, rent coin stacks, expense icons, a gauge, NOI bowl, cash-flow rows, and a final money bag.',
      caption:
        'Rental Property Calculator artwork matches the live workflow: property price, rent, vacancy, operating costs, mortgage payment, NOI, cap rate, cash flow, and cash-on-cash return.',
    },
    guide: {
      alt: 'Smoke mascot beside a rental-property flow with house cards, rent dots, expense buckets, loan columns, NOI bowl, coin stacks, and return gauge.',
      caption:
        'Rental Property Calculator guide artwork supports the walkthrough by showing rent, vacancy, expenses, loan payment, NOI, cash flow, cap rate, and cash-on-cash return as separate steps.',
    },
  },
  'irr-calculator': {
    tool: {
      alt: 'Smoke mascot pointing at an IRR cash-flow timeline with one starting outflow box, five later inflow boxes, arrows into a target, a rate gauge, calculator, bars, and pie chart.',
      caption:
        'IRR Calculator artwork matches the live workflow: one starting outflow, five regular cash-flow periods, a solved target rate, periodic IRR, annualized IRR, and net cash flow.',
    },
    guide: {
      alt: 'Smoke mascot explaining an IRR guide timeline with a starting cash-flow box, five later period boxes, dashed arrows to a target, spiral caution symbol, coins, notebook, and plants.',
      caption:
        'IRR Calculator guide artwork supports the walkthrough by showing regular cash-flow periods, the NPV-zero target, annualized-rate check, and cautions around timing, project size, and reinvestment assumptions.',
    },
  },
  'roi-calculator': {
    tool: {
      alt: 'Smoke mascot pointing at a rising leafy arrow between a small starting coin stack, income-and-cost dots, a minus coin, and a taller ending coin stack for a simple ROI check.',
      caption:
        'ROI Calculator artwork matches the live workflow: starting cost, ending value, income, costs, dollar gain or loss, and simple ROI percent.',
    },
    guide: {
      alt: 'Smoke mascot standing between balance scales with coin stacks, arrows, pebbles, red beads, plants, and a blank banner for comparing cost against return.',
      caption:
        'ROI Calculator guide artwork supports the walkthrough by showing cost versus return as a balance, with separate visual pieces for starting money, ending value, costs, gain, and limits.',
    },
  },
  'apr-calculator': {
    tool: {
      alt: 'Smoke mascot comparing a loan box, fee icons, monthly payment cards, a note-rate gauge, and a higher APR-style gauge for a fixed loan with upfront charges.',
      caption:
        'APR Calculator artwork matches the live workflow: loan amount, note rate, term, upfront fees, amount received, monthly payment, and estimated APR.',
    },
    guide: {
      alt: 'Smoke mascot pointing at two fixed-loan panels where one loan has no upfront fee and the other has fee icons reducing the amount received before the APR gauge rises.',
      caption:
        'APR Calculator guide artwork supports the walkthrough by showing why upfront finance charges can make APR higher than the note rate in a fixed-payment loan comparison.',
    },
  },
  'depreciation-calculator': {
    tool: {
      alt: 'Smoke mascot reviewing a depreciation worksheet with $12,000 cost, $2,000 salvage value, 5-year useful life, 2-year age, $4,000 accumulated depreciation, and $8,000 book value.',
      caption:
        'Depreciation Calculator artwork matches the live workflow: cost, salvage value, useful life, age, method, accumulated depreciation, annual depreciation, and book value.',
    },
    guide: {
      alt: 'Smoke mascot comparing straight-line depreciation with declining-balance depreciation beside asset cost, salvage value, useful life, book value, IRS limits, and tax-rule warning notes.',
      caption:
        'Depreciation Calculator guide artwork supports the walkthrough by separating simple book-value math from IRS MACRS, section 179, bonus depreciation, recapture, and accounting-policy limits.',
    },
  },
  'average-return-calculator': {
    tool: {
      alt: 'Smoke mascot comparing a $10,000 starting value, $16,000 ending value, $2,000 contribution, $4,000 net gain, 33.33% cumulative return, 6.67% simple average return, and CAGR card.',
      caption:
        'Average Return Calculator artwork matches the live workflow: starting value, ending value, years, contributions, withdrawals, net gain, cumulative return, simple average annual return, and CAGR.',
    },
    guide: {
      alt: 'Smoke mascot sorting investment return cards for net gain, cumulative return, simple average annual return, CAGR, contribution timing, withdrawal timing, fees, taxes, and IRR limits.',
      caption:
        'Average Return Calculator guide artwork supports the walkthrough by separating a quick return check from broker statements, time-weighted return, IRR, XIRR, fees, taxes, inflation, and investment advice.',
    },
  },
  'margin-calculator': {
    tool: {
      alt: 'Smoke mascot comparing a $100 selling price, $60 direct cost, $40 gross profit, 40% profit margin, and 66.67% markup cards.',
      caption:
        'Margin Calculator artwork matches the live workflow: selling price or revenue, direct cost, gross profit, profit margin, and markup.',
    },
    guide: {
      alt: 'Smoke mascot sorting margin and markup cards beside COGS, overhead, shipping, refunds, sales tax, marketplace fee, and net-profit warning notes.',
      caption:
        'Margin Calculator guide artwork supports the walkthrough by showing why gross margin, markup, direct cost, COGS, overhead, fees, and net profit must stay separate.',
    },
  },
  'discount-calculator': {
    tool: {
      alt: 'Smoke mascot checking a $100 original price with 20% off, 10% extra discount, $72 subtotal, $3.60 tax, and $75.60 final price cards.',
      caption:
        'Discount Calculator artwork matches the live workflow: original price, first discount, extra discount, tax rate, subtotal after discounts, savings, and final price.',
    },
    guide: {
      alt: 'Smoke mascot reviewing stacked discount cards beside coupon exclusions, required fees, shipping, membership rules, sales tax, and advertised-price warning notes.',
      caption:
        'Discount Calculator guide artwork supports the walkthrough by separating clean discount math from coupon rules, required fees, shipping, tax rules, and advertised-price limits.',
    },
  },
  'pension-calculator': {
    tool: {
      alt: 'Smoke mascot checking a defined-benefit pension formula with salary, credited service years, plan multiplier, monthly pension, and replacement-rate cards.',
      caption:
        'Pension Calculator artwork matches the live workflow: final average salary, credited service years, plan multiplier, annual pension, monthly pension, and replacement rate.',
    },
    guide: {
      alt: 'Smoke mascot comparing pension plan notes for salary, service credit, multiplier, survivor choice, early retirement, PBGC limits, and monthly benefit.',
      caption:
        'Pension Calculator guide artwork supports the walkthrough by showing salary-service-multiplier math beside plan-rule cautions like survivor choices and PBGC limits.',
    },
  },
  'rent-calculator': {
    tool: {
      alt: 'Smoke mascot checking a rent budget screen with monthly income, rent target percent, debt payments, utilities, max rent, and income-left cards.',
      caption:
        'Rent Calculator artwork matches the live rent workflow: income and rent target at the top, debts and utilities subtracted, then max rent and income-left result cards.',
    },
    guide: {
      alt: 'Smoke mascot comparing apartment rent notes with monthly income, 30 percent target, debt payments, utilities, deposits, and moving-cost reminders.',
      caption:
        'Rent Calculator guide artwork supports the walkthrough by showing the rent ceiling, utility costs, debt payments, and lease extras a renter should check before applying.',
    },
  },
};

function propertyKeyName(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text;
  return undefined;
}

function collectConstStrings(sourceFile) {
  const values = new Map();

  function visit(node) {
    if (ts.isVariableStatement(node)) {
      for (const declaration of node.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && declaration.initializer) {
          const value = literalText(declaration.initializer, values);
          if (value) values.set(declaration.name.text, value);
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return values;
}

function literalText(expression, constStrings = new Map()) {
  if (!expression) return undefined;
  if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) return expression.text;
  if (ts.isIdentifier(expression)) return constStrings.get(expression.text);
  if (ts.isParenthesizedExpression(expression)) return literalText(expression.expression, constStrings);
  if (ts.isAsExpression(expression) || ts.isTypeAssertionExpression(expression) || ts.isSatisfiesExpression(expression)) {
    return literalText(expression.expression, constStrings);
  }
  if (ts.isBinaryExpression(expression) && expression.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const left = literalText(expression.left, constStrings);
    const right = literalText(expression.right, constStrings);
    return left !== undefined && right !== undefined ? `${left}${right}` : undefined;
  }
  return undefined;
}

function objectStringProperty(objectExpression, key, constStrings) {
  for (const property of objectExpression.properties) {
    if (!ts.isPropertyAssignment(property)) continue;
    if (propertyKeyName(property.name) !== key) continue;
    return literalText(property.initializer, constStrings);
  }

  return undefined;
}

function inferFileDefaultCategory(filePath) {
  const fileName = filePath.replaceAll('\\', '/').split('/').pop() ?? '';
  return defaultCategoryByFile[fileName];
}

function extractToolsFromFile(filePath) {
  const absolutePath = resolve(rootDir, filePath);
  const source = readFileSync(absolutePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true);
  const constStrings = collectConstStrings(sourceFile);
  const defaultCategory = inferFileDefaultCategory(filePath);
  const tools = [];

  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const slug = objectStringProperty(node, 'slug', constStrings);
      const name = objectStringProperty(node, 'name', constStrings);
      const summary = objectStringProperty(node, 'summary', constStrings);
      const description = objectStringProperty(node, 'description', constStrings);
      const category = objectStringProperty(node, 'category', constStrings) ?? defaultCategory;

      if (slug && name && category && (summary || description)) {
        tools.push({
          slug,
          name,
          category,
          summary: summary ?? description,
          description: description ?? summary ?? '',
          sourceFile: filePath,
        });
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return tools;
}

export function readCanonicalTools() {
  const bySlug = new Map();

  for (const filePath of toolDataFiles) {
    for (const tool of extractToolsFromFile(filePath)) {
      if (!bySlug.has(tool.slug)) bySlug.set(tool.slug, tool);
    }
  }

  return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function readBlogGuideRedirects() {
  const sourcePath = resolve(rootDir, 'src/data/blogGuideCanonicals.ts');
  if (!existsSync(sourcePath)) return new Map();

  const source = readFileSync(sourcePath, 'utf8');
  const redirectsBlock = source.match(/blogGuideRedirects\s*=\s*\{([\s\S]*?)\}\s*as const/);
  if (!redirectsBlock) return new Map();

  return new Map(
    [...redirectsBlock[1].matchAll(/['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]/g)].map((match) => [
      match[1],
      match[2],
    ]),
  );
}

export function readRedirectedBlogGuideSlugs() {
  return new Set(readBlogGuideRedirects().keys());
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function safeSummary(summary) {
  const text = normalizeWhitespace(summary);
  return text.length > 140 ? `${text.slice(0, 137).trim()}...` : text;
}

function shortSummary(summary, maxLength = 92) {
  const text = normalizeWhitespace(summary).replace(/\.$/, '');
  if (text.length <= maxLength) return text;

  const clipped = text.slice(0, maxLength + 1);
  const lastSpace = clipped.lastIndexOf(' ');
  const safeClip = lastSpace > 55 ? clipped.slice(0, lastSpace) : clipped.slice(0, maxLength);
  return safeClip.replace(/[,.:-]\s*$/, '');
}

function lowerFirst(value) {
  return value ? `${value.slice(0, 1).toLowerCase()}${value.slice(1)}` : value;
}

function imageAltConcept(value) {
  return value.replace(/\breadable text\b/gi, 'words and numbers');
}

function slugWords(slug) {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b(calculator|tool|converter|generator|checker|formatter|parser|encoder|decoder)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildAlt(tool, kind) {
  const override = toolArtMetadataOverrides[tool.slug]?.[kind]?.alt;
  if (override) return override;

  const concept = imageAltConcept(shortSummary(tool.summary, kind === 'tool' ? 116 : 72));

  if (kind === 'tool') {
    return normalizeWhitespace(
      `Illustration for ${tool.name} showing ${lowerFirst(concept)}.`,
    );
  }

  return normalizeWhitespace(
    `Guide image for ${tool.name} showing ${lowerFirst(concept)} with example inputs and result notes.`,
  );
}

function buildCaption(tool, kind) {
  const override = toolArtMetadataOverrides[tool.slug]?.[kind]?.caption;
  if (override) return override;

  const summary = shortSummary(tool.summary, 110);
  const concept = summary ? lowerFirst(summary) : `the ${slugWords(tool.slug) || tool.name} workflow`;

  if (kind === 'tool') {
    return normalizeWhitespace(
      `${tool.name} artwork matches the live tool workflow: ${concept}. Use it with the calculator, examples, and result notes.`,
    );
  }

  return normalizeWhitespace(
    `${tool.name} guide artwork sits with the walkthrough for ${concept}, including inputs, examples, limits, and mistakes to check.`,
  );
}

function buildPrompt(tool, kind) {
  const categoryName = categoryNames[tool.category] ?? tool.category;
  const visualCues = categoryVisualCues[tool.category] ?? 'friendly utility shapes and organized helper objects';
  const action =
    kind === 'tool'
      ? `The mascot is actively presenting the ${tool.name} as a usable browser utility.`
      : `The mascot is explaining the ${tool.name} concept like a simple visual guide.`;

  return normalizeWhitespace(
    [
      'Create one unique G-rated chibi/kawaii image using the established Access Free Tools smoke mascot: a translucent pale grey-white smoky chibi girl with soft wispy hair, expressive manga eyes, tiny hands, a dress-like smoke body, a small heart-shaped chest glow, and a lower floating smoke tail.',
      action,
      'The mascot should match the existing approved house style: soft charcoal/dark-slate background, hand-painted luminous smoke lines, gentle blush, white-pink-grey glow, and no purple ghost/spirit redesign.',
      'Show the full body character inside the frame, including all hair, smoky wisps, hands, props, and the lower floating smoke tail, with generous padding so nothing is cropped off.',
      'Use no readable text, no logos, no brand names, no watermark, no sexualized styling, and no generic abstract fog-only composition.',
      'Research the exact tool before generating: use visual details from its real inputs, outputs, formula/logic, examples, and guide notes, not only broad category symbols.',
      'The image must clearly represent this specific tool to someone comparing it with nearby related tools.',
      `Use visual hints for ${categoryName}: ${visualCues}.`,
      `Specific page concept: ${safeSummary(tool.summary)}.`,
      `Composition must be distinct for ${kind === 'tool' ? 'the tool page' : 'the guide/blog page'} and usable as a 1200 by 630 web image.`,
      'The result must look like an intentional character illustration, not a blurry background texture.',
    ].join(' '),
  );
}

export function createQueuedToolArtEntries(tools = readCanonicalTools()) {
  const redirectedBlogGuideSlugs = readRedirectedBlogGuideSlugs();

  return tools.flatMap((tool) => {
    const guideSlug = `how-to-use-${tool.slug}`;
    const kinds = redirectedBlogGuideSlugs.has(guideSlug) ? ['tool'] : ['tool', 'guide'];

    return kinds.map((kind) => ({
      slug: tool.slug,
      kind,
      toolName: tool.name,
      category: tool.category,
      categoryName: categoryNames[tool.category] ?? tool.category,
      imagePath: `/tool-art/${tool.slug}-${kind}.webp`,
      thumbnailPath: `/tool-art/thumbs/${tool.slug}-${kind}.webp`,
      pagePath: kind === 'tool' ? `/tools/${tool.slug}/` : `/blog/how-to-use-${tool.slug}/`,
      galleryPath: `/gallery/${tool.category}/#${tool.slug}-${kind}`,
      alt: buildAlt(tool, kind),
      caption: buildCaption(tool, kind),
      prompt: buildPrompt(tool, kind),
      status: 'queued',
      qaStatus: 'not-started',
    }));
  });
}

export function readToolArtApprovals() {
  const path = resolve(rootDir, 'src/data/toolArtApprovals.json');
  if (!existsSync(path)) return [];
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function createToolArtEntries(tools = readCanonicalTools()) {
  const approvals = readToolArtApprovals();
  const approvalMap = new Map(approvals.map((approval) => [`${approval.slug}:${approval.kind}`, approval]));

  return createQueuedToolArtEntries(tools).map((entry) => ({
    ...entry,
    ...(approvalMap.get(`${entry.slug}:${entry.kind}`) ?? {}),
  }));
}

export function writeJsonReport(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

export function manifestTsSource(entries) {
  const generated = new Date().toISOString().slice(0, 10);
  return `// Generated by scripts/generate-tool-art-manifest.mjs. Do not edit by hand.
// Last regenerated: ${generated}

export type ToolArtKind = 'tool' | 'guide';

export interface ToolArtManifestEntry {
  slug: string;
  kind: ToolArtKind;
  toolName: string;
  category: string;
  categoryName: string;
  imagePath: string;
  thumbnailPath: string;
  pagePath: string;
  galleryPath: string;
  alt: string;
  caption: string;
  prompt: string;
  status: 'queued' | 'draft' | 'approved' | 'rejected';
  qaStatus: 'not-started' | 'needs-review' | 'approved' | 'rejected';
}

export const toolArtManifest = ${JSON.stringify(entries, null, 2)} as const satisfies readonly ToolArtManifestEntry[];
`;
}

export function writeManifestOutputs(entries) {
  const manifestPath = resolve(rootDir, 'src/data/toolArtManifest.ts');
  const outputPath = resolve(rootDir, 'output/tool-art-manifest.json');
  const summaryPath = resolve(rootDir, 'output/tool-art-manifest.md');
  const toolCount = new Set(entries.map((entry) => entry.slug)).size;

  mkdirSync(dirname(manifestPath), { recursive: true });
  writeFileSync(manifestPath, manifestTsSource(entries));
  writeJsonReport(outputPath, {
    generatedAt: new Date().toISOString(),
    tools: toolCount,
    entries: entries.length,
    categories: [...new Set(entries.map((entry) => entry.category))].sort(),
    manifestPath: 'src/data/toolArtManifest.ts',
    entries,
  });
  writeFileSync(
    summaryPath,
    [
      '# Tool Art Manifest',
      '',
      `Generated entries: ${entries.length}`,
      `Canonical tools covered: ${toolCount}`,
      `Categories covered: ${[...new Set(entries.map((entry) => entry.category))].sort().join(', ')}`,
      '',
      'Each canonical tool has one tool-page image. Tools with a canonical blog-guide redirect skip separate guide art.',
      '',
    ].join('\n'),
  );

  return { manifestPath, outputPath, summaryPath };
}

export function readTrackedManifestSource() {
  const path = resolve(rootDir, 'src/data/toolArtManifest.ts');
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}
