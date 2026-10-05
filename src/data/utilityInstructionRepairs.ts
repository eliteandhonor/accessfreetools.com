export const utilityInstructionRepairs: Partial<Record<string, string[]>> = {
  'time-calculator': [
    'Enter the first duration in First hours, First minutes, and First seconds. Use durations rather than clock times.',
    'Choose Add or Subtract in Operation, then enter the second duration in its hours, minutes, and seconds fields.',
    'Press Calculate time to see hours, minutes, seconds, total seconds, and decimal hours.',
    'For example, 2h 45m 30s plus 1h 20m 45s equals 4h 6m 15s. A negative subtraction result means the second duration is longer.',
  ],
  'hours-calculator': [
    'Enter Start time and End time for one shift. An earlier end time means the shift ends the next day.',
    'Enter unpaid Break minutes. Leave Hourly rate blank for time only, or enter the rate for a simple gross pay estimate.',
    'Press Calculate hours to read decimal hours, Hours and minutes, Crossed midnight, and Gross pay estimate.',
    'For example, 22:00 to 06:30 with a 45-minute break is 7.75 hours. At an hourly rate of $32, the gross estimate is $248.',
    'Check workplace rules for paid breaks, rounding, overtime, deductions, and shift premiums. With Break minutes set to 0, equal start and end times return zero hours.',
  ],
  'gpa-calculator': [
    'Enter credits and choose a letter grade for each of up to four courses. Leave unused credits blank or enter 0.',
    'Use the fixed common 4.0 scale shown on this page. A and A+ both count as 4.0 grade points.',
    'Press Calculate GPA to see the credit-weighted GPA, Total credits, and Quality points.',
    'For example, a 3-credit A and a 1-credit B produce a 3.75 GPA. Check your school rules for weighting, repeated courses, and pass/fail grades.',
  ],
  'grade-calculator': [
    'Enter Current grade (%) for the coursework completed before the final exam.',
    'Enter Final weight (%) from your syllabus and Desired course grade (%). Use 25 for a final worth 25% of the course.',
    'Press Calculate needed grade to see the final exam percentage needed and Possible without extra credit.',
    'For example, an 80% current grade, a 25% final weight, and an 85% goal require 100% on the final.',
    'A result above 100% needs extra credit or a changed goal. Check grading rules and whether your current grade already includes the final.',
  ],
  'concrete-calculator': [
    'Enter the rectangular slab Length (ft) and Width (ft), then Depth (in). Keep feet and inches in their labeled fields.',
    'Enter Extra waste (%) as a percentage, such as 10 for 10% extra volume.',
    'Press Estimate concrete to see cubic yards, cubic feet, cubic meters, and estimated 80 lb and 60 lb bags.',
    'For example, a 10 ft by 12 ft slab, 4 in deep, with 10% extra needs 44 cubic feet, about 1.63 cubic yards.',
    'Check the exact bag yield and supplier ordering rules. This rectangular volume estimate does not establish slab strength, reinforcement, or code compliance.',
  ],
  'password-generator': [
    'Enter a whole-number Length from 8 to 128 and choose at least one character type: uppercase, lowercase, numbers, or symbols.',
    'Select Avoid ambiguous characters to remove lookalike characters from the available pool.',
    'Press Generate password to create a password with browser cryptographic random values.',
    'Check the result against the account requirements. Selecting a character type adds it to the pool but does not guarantee it appears.',
    'Copy the password into a trusted password manager and use it for one account. Generated passwords do not enter the recent-answer history.',
  ],
  'conversion-calculator': [
    'Choose Length, Mass, Volume, or Temperature so the available units match the quantity you are converting.',
    'Enter Value, then select its starting unit in From and the desired unit in To.',
    'Press Convert value to read the converted amount and its unit. For example, 20 Celsius equals 68 Fahrenheit.',
    'Check the unit definitions before using the result. Volume conversions use US customary cups and gallons, and this tool does not convert volume to mass.',
  ],
  'horsepower-calculator': [
    'Enter Power and select its Starting unit: Mechanical hp, Watts, Kilowatts, or Metric hp.',
    'Press Convert power to see mechanical horsepower, watts, kilowatts, and metric horsepower (PS).',
    'For example, 100 kilowatts is about 134.1 mechanical hp. Mechanical hp and metric hp use different conversion factors.',
    'Use this for an existing power measurement. It does not calculate engine power from torque, RPM, or drivetrain loss.',
  ],
  'api-pricing-calculator': [
    'Enter Requests and Units per request using the billable unit from your provider, such as one image or one credit.',
    'Enter Price per unit for one billable unit. Divide a price quoted per thousand units by 1,000 before entering it.',
    'Enter a Fixed fee if needed and Retry / overhead % for extra billable work. Use one currency for both prices.',
    'Press Calculate API cost to see total cost, Billable units, Usage cost, and Average per request.',
    'For example, 1,000 requests at 2 units each, $0.01 per unit, 10% overhead, and a $5 fixed fee cost $27. Check provider billing rules.',
  ],
  'download-time-calculator': [
    'Enter File size and select its File unit: KB, MB, GB, or TB. These are decimal byte units.',
    'Enter Speed Mbps in megabits per second. If your speed is in megabytes per second, multiply it by 8 to enter Mbps.',
    'Enter Efficiency % for the usable share of that speed, such as 80 for 80%. Use a value above 0 and no greater than 100.',
    'Press Calculate download time to see the duration and Effective speed. For example, 1 GB at 100 Mbps and 80% efficiency takes 1m 40s.',
    'Treat this as an estimate. Server limits, Wi-Fi, congestion, and background traffic can change the actual time.',
  ],
  'internet-speed-needs-calculator': [
    'Count the Video streams, Gaming devices, Video calls, and Smart devices that will use the connection at the same time.',
    'Enter the Mbps needed by each activity in its matching Mbps per field. Use 0 for activities you do not need.',
    'Enter Buffer % for extra capacity above the summed activity load.',
    'Press Estimate speed need to see Recommended download speed, Base activity need, and the activity breakdown.',
    'Check upload speed, latency, Wi-Fi coverage, and service limits separately. The result estimates download capacity from your inputs rather than measuring your connection.',
  ],
  'streaming-bitrate-calculator': [
    'Enter Bitrate and choose Kbps or Mbps in Bitrate unit. Use the rate for one stream.',
    'Enter Hours and Minutes for the duration, then Streams for the number of streams at that rate and duration.',
    'Press Calculate data use to see decimal GB, MB, megabits, and Streams counted.',
    'For example, one 6 Mbps stream for 2 hours uses about 5.4 GB. Two matching streams use about 10.8 GB.',
    'Actual usage can differ with variable bitrate, audio, retransmits, and adaptive streaming.',
  ],
  'monitor-ppi-calculator': [
    'Enter the screen resolution in Width pixels and Height pixels, such as 1920 and 1080.',
    'Enter the physical screen diagonal in Diagonal inches, rather than the screen width or bezel measurement.',
    'Press Calculate PPI to see pixels per inch, Pixel diagonal, and Aspect ratio.',
    'For example, a 24-inch 1920 by 1080 screen has about 91.8 PPI. Viewing distance, scaling, and panel quality also affect perceived sharpness.',
  ],
  'recipe-scaler': [
    'Enter one Ingredient name, its Original amount, and its Unit, such as Flour, 2, and cups.',
    'Enter Original servings and Desired servings for the recipe.',
    'Press Scale recipe to read the new ingredient amount and Scale factor. For example, 2 cups for 4 servings becomes 5 cups for 10 servings.',
    'Repeat for each ingredient. The Unit field is a label and does not convert cups to grams or other units.',
    'Check spices, yeast, pan size, and cooking time separately because they may need adjustments beyond the serving ratio.',
  ],
  'cooking-measurement-converter': [
    'Enter Amount, then select From unit and To unit. Choose fluid ounces for volume or ounces for weight.',
    'For volume-to-weight conversions, enter the ingredient density in Density grams per cup. The cup is a US customary cup.',
    'Keep a positive density value even when converting only volume or only weight. Same-kind conversions use fixed factors and do not depend on that value.',
    'Press Convert cooking amount to read the target amount and Density used. For example, 2 cups at 120 grams per cup equals 240 grams.',
    'Check the ingredient density and measuring method. Packing, chopping, and moisture can change volume-to-weight estimates.',
  ],
  'ingredient-cost-calculator': [
    'Enter Amount needed and Needed unit for one ingredient in the recipe.',
    'Enter Package amount, Package unit, and Package price from the same package.',
    'Enter a positive Density grams per cup. Use the ingredient density when converting between volume and weight, with US customary cups.',
    'Press Calculate ingredient cost to see the cost of the amount used, Unit cost, and Package amount converted.',
    'For example, 300 grams from a 1-kilogram package priced at $4 costs $1.20. This is the ingredient used, rather than the cost of buying whole packages.',
  ],
  'unit-price-calculator': [
    'Enter each item name, package price, and package quantity for Item A and Item B.',
    'Convert both quantities to the same unit before entering them, then name it in Shared unit. This field does not convert units.',
    'Press Compare unit prices to see the lower-priced item, both unit prices, and Savings per unit.',
    'Compare equivalent products and check taxes, coupons, and usable quantity. A larger package can cost more overall while costing less per unit.',
  ],
  'cost-per-serving-calculator': [
    'Enter Recipe or item name and Main cost for the full batch.',
    'Enter Extra cost for costs not already included, or use 0. Keep both costs in the same currency.',
    'Enter Servings for the number of portions the batch actually provides.',
    'Press Calculate cost per serving to see the portion cost and Total batch cost. For example, $18.50 plus $2 over 8 servings is $2.5625 per serving.',
    'Include relevant costs yourself and use a consistent portion size when comparing recipes.',
  ],
  'butter-converter': [
    'Enter Amount and choose its Unit, such as sticks, cups, tablespoons, or grams.',
    'Press Convert butter to see tablespoons, cups, sticks, and grams side by side.',
    'For example, 1 US stick equals 8 tablespoons, 0.5 cup, or about 113.4 grams.',
    'Check your package label before using stick measurements. Butter sticks and blocks vary by country, and this converter uses common US equivalents.',
  ],
  'baking-pan-conversion-calculator': [
    'Enter Old pan length (in) and Old pan width (in) for the recipe pan, then the New pan length (in) and New pan width (in).',
    'Enter Original servings if you want scaled servings, or leave it blank.',
    'Press Scale pan size to see the Pan scale factor, both pan areas, and any Scaled servings.',
    'Multiply ingredient amounts by the factor. A 9 by 13 inch pan changed to 8 by 8 inches uses about 0.547 times the batter.',
    'Use this area ratio for rectangular pans of similar depth. Check batter depth, pan capacity, and bake time separately.',
  ],
};

export const utilityTrustRepairs: Partial<Record<string, string>> = {
  'time-calculator':
    'The calculator adds or subtracts durations in this browser tab. It does not apply clock dates, time zones, or daylight-saving changes.',
  'hours-calculator':
    'The calculator uses one shift and an unpaid break. It treats an earlier end time as the next day. Equal times return zero hours with no break, while a positive break exceeds that shift. Gross pay is hours times rate, before overtime, premiums, taxes, or deductions.',
  'gpa-calculator':
    'The calculation uses course credits and a fixed common unweighted 4.0 scale, including A+ at 4.0. Your school may handle plus/minus grades, repeated courses, honors, or pass/fail credits differently.',
  'grade-calculator':
    'The calculation assumes the current grade describes all coursework outside one remaining final exam. It uses the final weight you enter and does not apply extra-credit, rounding, dropped-grade, or minimum-exam rules.',
  'concrete-calculator':
    'This is a rectangular slab volume estimate with the extra percentage you enter. Bag counts use approximate dry-mix yields. Confirm dimensions, bag labels, site conditions, and supplier quantities before ordering. The result does not establish a structural design.',
  'password-generator':
    'Password generation uses browser cryptographic random values and excludes generated passwords from recent answers. The chosen character types form a pool, so a result may omit a type. Check account rules and store a unique password in a trusted manager.',
  'conversion-calculator':
    'Conversions run in the browser using fixed unit factors or temperature formulas. Cups and gallons are US customary units. Volume and mass remain separate quantities, and display rounding may matter for precise measurements.',
  'horsepower-calculator':
    'This tool converts a supplied power value between watts, kilowatts, mechanical hp, and metric hp. It does not measure an engine, infer torque or RPM, or estimate drivetrain loss. Other horsepower definitions can use different factors.',
  'api-pricing-calculator':
    'The calculation uses your unit price, request volume, overhead percentage, and fixed fee. It does not fetch prices or account for free tiers, taxes, credits, tiered rates, or provider-specific billing rules. The displayed dollar amounts assume your prices use dollars.',
  'download-time-calculator':
    'This estimate uses decimal file units and a constant Mbps speed multiplied by your efficiency percentage. It does not run a speed test or contact the file server. Wi-Fi, server limits, congestion, and binary file-size labels can change actual time.',
  'internet-speed-needs-calculator':
    'This is a download-capacity estimate for the simultaneous activities and per-device rates you enter. It does not measure your connection or model upload capacity, latency, packet loss, Wi-Fi coverage, or an internet plan guarantee.',
  'streaming-bitrate-calculator':
    'The estimate assumes each stream uses the entered bitrate for the same duration. It reports decimal MB and GB. Variable bitrate, adaptive quality, audio tracks, and network overhead can change actual data use.',
  'monitor-ppi-calculator':
    'PPI comes from pixel resolution and physical diagonal inches. It does not assess viewing distance, operating-system scaling, panel quality, subpixel layout, or eyesight, so it cannot establish perceived sharpness by itself.',
  'recipe-scaler':
    'The calculator scales one ingredient at a time by desired servings divided by original servings. Units are text labels. It does not convert measurements or judge flavor, texture, pan capacity, cooking time, or food safety.',
  'cooking-measurement-converter':
    'The converter uses US customary volume units and fixed weight factors. Crossing between volume and weight uses the positive grams-per-cup density you enter. Same-kind conversions do not depend on density. Ingredient packing and moisture affect estimates.',
  'ingredient-cost-calculator':
    'The calculator prices the amount used after converting the package quantity into the recipe unit. Volume-to-weight estimates depend on your ingredient density. Whole-package purchases, waste, tax, coupons, and other costs need separate handling.',
  'unit-price-calculator':
    'The calculator divides each price by its quantity. Both quantities must already use the same unit, and the unit label does not perform conversion. Taxes, coupons, product quality, and usable quantity can change the buying decision.',
  'cost-per-serving-calculator':
    'The calculator divides main cost plus extra cost by your serving count. Include costs in one currency without counting them twice. Portion size, waste, and omitted ingredients or overhead can change the real cost.',
  'butter-converter':
    'The converter uses common US butter equivalents: one stick is 8 tablespoons and half a cup. Stick sizes and blocks vary by country. Use the package weight when its dimensions or markings differ.',
  'baking-pan-conversion-calculator':
    'The calculator divides the new rectangular pan area by the old area. It assumes similar batter depth rather than equal pan capacity. Pan shape, depth, material, bake time, and recipe behavior need separate checks.',
};
