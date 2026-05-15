<?php
declare(strict_types=1);

const AFT_SITE_ORIGIN = 'https://accessfreetools.com';

function aft_json(array $body, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($body, JSON_UNESCAPED_SLASHES);
    exit;
}

function aft_payload(): array
{
    $raw = file_get_contents('php://input') ?: '';
    if ($raw === '') {
        return $_POST ?: [];
    }

    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function aft_num(array $input, string $key, ?float $default = null): float
{
    if (!array_key_exists($key, $input) || $input[$key] === '') {
        if ($default !== null) return $default;
        throw new InvalidArgumentException("Missing number: {$key}");
    }

    if (!is_numeric($input[$key])) {
        throw new InvalidArgumentException("{$key} must be a number.");
    }

    return (float) $input[$key];
}

function aft_int(array $input, string $key, int $default): int
{
    if (!array_key_exists($key, $input) || $input[$key] === '') {
        return $default;
    }

    if (!is_numeric($input[$key])) {
        throw new InvalidArgumentException("{$key} must be a number.");
    }

    return (int) $input[$key];
}

function aft_str(array $input, string $key, string $default = ''): string
{
    $value = $input[$key] ?? $default;
    if (!is_scalar($value)) {
        throw new InvalidArgumentException("{$key} must be text.");
    }
    return trim((string) $value);
}

function aft_bool(array $input, string $key, bool $default): bool
{
    if (!array_key_exists($key, $input)) return $default;
    return filter_var($input[$key], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? $default;
}

function aft_format_number(float $value): string
{
    if (!is_finite($value)) return '0';
    $formatted = number_format($value, abs($value) >= 100 ? 2 : 6, '.', '');
    return rtrim(rtrim($formatted, '0'), '.') ?: '0';
}

function aft_money(float $value): string
{
    return '$' . number_format($value, 2, '.', ',');
}

function aft_tool_url(string $slug): string
{
    return AFT_SITE_ORIGIN . '/tools/' . $slug . '/';
}

function aft_guide_url(string $slug): string
{
    return AFT_SITE_ORIGIN . '/blog/how-to-use-' . $slug . '/';
}

function aft_schema(string $type, array $properties = [], array $required = []): array
{
    return [
        'type' => $type,
        'properties' => $properties,
        'required' => $required,
        'additionalProperties' => true,
    ];
}

function aft_tools(): array
{
    static $tools = null;
    if ($tools !== null) return $tools;

    $tools = [
        'percentage-calculator' => [
            'name' => 'Percentage Calculator',
            'category' => 'calculators',
            'risk' => 'low',
            'summary' => 'Calculate percent-of and what-percent questions.',
            'description' => 'Find a percent of a value or find what percent one number is of another.',
            'keywords' => ['percentage', 'percent', 'discount', 'markup'],
            'examples' => [
                ['label' => '18% of 240', 'inputs' => ['mode' => 'percent-of', 'percent' => 18, 'value' => 240]],
                ['label' => '18 is what percent of 240', 'inputs' => ['mode' => 'what-percent', 'part' => 18, 'whole' => 240]],
            ],
            'input_schema' => aft_schema('object', [
                'mode' => ['type' => 'string', 'enum' => ['percent-of', 'what-percent']],
                'percent' => ['type' => 'number'],
                'value' => ['type' => 'number'],
                'part' => ['type' => 'number'],
                'whole' => ['type' => 'number'],
            ]),
        ],
        'tip-calculator' => [
            'name' => 'Tip Calculator',
            'category' => 'everyday',
            'risk' => 'low',
            'summary' => 'Estimate a tip and split a bill.',
            'description' => 'Calculate tip amount, tax amount, total, and split per person.',
            'keywords' => ['tip', 'restaurant', 'split bill'],
            'examples' => [['label' => '$64 subtotal, 18% tip, 2 people', 'inputs' => ['subtotal' => 64, 'tipPercent' => 18, 'taxPercent' => 0, 'people' => 2]]],
            'input_schema' => aft_schema('object', ['subtotal' => ['type' => 'number'], 'tipPercent' => ['type' => 'number'], 'taxPercent' => ['type' => 'number'], 'people' => ['type' => 'integer']]),
        ],
        'bmi-calculator' => [
            'name' => 'BMI Calculator',
            'category' => 'health',
            'risk' => 'health',
            'summary' => 'Estimate body mass index from height and weight.',
            'description' => 'Calculate BMI in metric units and show the common BMI category.',
            'keywords' => ['bmi', 'body mass index', 'health'],
            'examples' => [['label' => '70 kg, 175 cm', 'inputs' => ['weightKg' => 70, 'heightCm' => 175]]],
            'input_schema' => aft_schema('object', ['weightKg' => ['type' => 'number'], 'heightCm' => ['type' => 'number']], ['weightKg', 'heightCm']),
        ],
        'mortgage-calculator' => [
            'name' => 'Mortgage Calculator',
            'category' => 'finance',
            'risk' => 'finance',
            'summary' => 'Estimate monthly principal and interest plus common ownership costs.',
            'description' => 'Calculate mortgage payment from home price, down payment, rate, and loan term.',
            'keywords' => ['mortgage', 'home loan', 'payment'],
            'examples' => [['label' => '$400,000 home, 20% down, 6.5%, 30 years', 'inputs' => ['homePrice' => 400000, 'downPayment' => 80000, 'annualRatePercent' => 6.5, 'years' => 30]]],
            'input_schema' => aft_schema('object', ['homePrice' => ['type' => 'number'], 'downPayment' => ['type' => 'number'], 'annualRatePercent' => ['type' => 'number'], 'years' => ['type' => 'number']]),
        ],
        'concrete-calculator' => [
            'name' => 'Concrete Calculator',
            'category' => 'home-projects',
            'risk' => 'construction',
            'summary' => 'Estimate concrete volume and common bag counts.',
            'description' => 'Calculate concrete needed for a rectangular slab.',
            'keywords' => ['concrete', 'slab', 'cubic yards'],
            'examples' => [['label' => '10 by 12 slab, 4 inches deep', 'inputs' => ['lengthFeet' => 10, 'widthFeet' => 12, 'depthInches' => 4, 'wastePercent' => 10]]],
            'input_schema' => aft_schema('object', ['lengthFeet' => ['type' => 'number'], 'widthFeet' => ['type' => 'number'], 'depthInches' => ['type' => 'number'], 'wastePercent' => ['type' => 'number']]),
        ],
        'paint-calculator' => [
            'name' => 'Paint Calculator',
            'category' => 'home-projects',
            'risk' => 'construction',
            'summary' => 'Estimate gallons of paint for a room.',
            'description' => 'Calculate paint from room size, wall height, coats, openings, coverage, and waste.',
            'keywords' => ['paint', 'gallons', 'room'],
            'examples' => [['label' => '12 by 14 room, 8 ft walls', 'inputs' => ['lengthFeet' => 12, 'widthFeet' => 14, 'wallHeightFeet' => 8, 'coats' => 2]]],
            'input_schema' => aft_schema('object', ['lengthFeet' => ['type' => 'number'], 'widthFeet' => ['type' => 'number'], 'wallHeightFeet' => ['type' => 'number']]),
        ],
        'download-time-calculator' => [
            'name' => 'Download Time Calculator',
            'category' => 'technology',
            'risk' => 'low',
            'summary' => 'Estimate how long a file download takes.',
            'description' => 'Estimate download time from file size, unit, internet speed, and efficiency.',
            'keywords' => ['download time', 'internet speed', 'Mbps'],
            'examples' => [['label' => '5 GB at 80 Mbps', 'inputs' => ['fileSize' => 5, 'fileUnit' => 'GB', 'speedMbps' => 80, 'efficiencyPercent' => 90]]],
            'input_schema' => aft_schema('object', ['fileSize' => ['type' => 'number'], 'fileUnit' => ['type' => 'string'], 'speedMbps' => ['type' => 'number'], 'efficiencyPercent' => ['type' => 'number']]),
        ],
        'watts-to-amps-calculator' => [
            'name' => 'Watts To Amps Calculator',
            'category' => 'electrical',
            'risk' => 'electrical',
            'summary' => 'Estimate amps from watts and volts.',
            'description' => 'Convert watts to amps using voltage, phase, and power factor.',
            'keywords' => ['watts', 'amps', 'volts', 'electrical'],
            'examples' => [['label' => '600 watts at 120 volts', 'inputs' => ['watts' => 600, 'volts' => 120, 'phase' => 'single-phase', 'powerFactor' => 1]]],
            'input_schema' => aft_schema('object', ['watts' => ['type' => 'number'], 'volts' => ['type' => 'number'], 'phase' => ['type' => 'string'], 'powerFactor' => ['type' => 'number']]),
        ],
        'word-counter' => [
            'name' => 'Word Counter',
            'category' => 'text-tools',
            'risk' => 'privacy',
            'summary' => 'Analyze text length and reading time.',
            'description' => 'Count words, characters, sentences, paragraphs, lines, bytes, and reading time.',
            'keywords' => ['word count', 'character count', 'reading time'],
            'examples' => [['label' => 'Short paragraph', 'inputs' => ['text' => 'Access Free Tools helps people finish quick browser tasks.']]],
            'input_schema' => aft_schema('object', ['text' => ['type' => 'string']], ['text']),
        ],
        'json-formatter' => [
            'name' => 'JSON Formatter',
            'category' => 'developer-tools',
            'risk' => 'privacy',
            'summary' => 'Format and inspect JSON text.',
            'description' => 'Format JSON and optionally sort object keys.',
            'keywords' => ['json', 'format', 'developer'],
            'examples' => [['label' => 'Small object', 'inputs' => ['json' => '{"tool":"calculator","live":true}', 'sortKeys' => false]]],
            'input_schema' => aft_schema('object', ['json' => ['type' => 'string'], 'sortKeys' => ['type' => 'boolean']], ['json']),
        ],
        'base64-encode-decode' => [
            'name' => 'Base64 Encode Decode',
            'category' => 'developer-tools',
            'risk' => 'privacy',
            'summary' => 'Encode and decode Base64 text.',
            'description' => 'Encode plain text to Base64 or decode Base64 to UTF-8 text.',
            'keywords' => ['base64', 'encode', 'decode'],
            'examples' => [['label' => 'Encode hello', 'inputs' => ['mode' => 'encode', 'text' => 'hello']]],
            'input_schema' => aft_schema('object', ['mode' => ['type' => 'string'], 'text' => ['type' => 'string']], ['text']),
        ],
        'url-encode-decode' => [
            'name' => 'URL Encode Decode',
            'category' => 'developer-tools',
            'risk' => 'privacy',
            'summary' => 'Encode or decode URL component text.',
            'description' => 'URL-encode or URL-decode text for query strings and links.',
            'keywords' => ['url encode', 'url decode', 'query string'],
            'examples' => [['label' => 'Encode tool name', 'inputs' => ['mode' => 'encode', 'plusForSpace' => false, 'text' => 'Access Free Tools']]],
            'input_schema' => aft_schema('object', ['mode' => ['type' => 'string'], 'text' => ['type' => 'string'], 'plusForSpace' => ['type' => 'boolean']], ['text']),
        ],
        'password-generator' => [
            'name' => 'Password Generator',
            'category' => 'developer-tools',
            'risk' => 'privacy',
            'summary' => 'Generate a random password.',
            'description' => 'Generate a random password with selected character groups.',
            'keywords' => ['password', 'generator', 'security'],
            'examples' => [['label' => '16 character password', 'inputs' => ['length' => 16, 'avoidAmbiguous' => true]]],
            'input_schema' => aft_schema('object', ['length' => ['type' => 'integer'], 'includeUppercase' => ['type' => 'boolean'], 'includeLowercase' => ['type' => 'boolean'], 'includeNumbers' => ['type' => 'boolean'], 'includeSymbols' => ['type' => 'boolean'], 'avoidAmbiguous' => ['type' => 'boolean']]),
        ],
        'subnet-calculator' => [
            'name' => 'Subnet Calculator',
            'category' => 'developer-tools',
            'risk' => 'low',
            'summary' => 'Calculate IPv4 subnet details.',
            'description' => 'Calculate IPv4 subnet mask, wildcard, network, broadcast, and usable host range.',
            'keywords' => ['subnet', 'ip', 'network'],
            'examples' => [['label' => '192.168.1.10/24', 'inputs' => ['ipAddress' => '192.168.1.10', 'prefixLength' => 24]]],
            'input_schema' => aft_schema('object', ['ipAddress' => ['type' => 'string'], 'prefixLength' => ['type' => 'integer']], ['ipAddress', 'prefixLength']),
        ],
        'date-calculator' => [
            'name' => 'Date Difference Calculator',
            'category' => 'everyday',
            'risk' => 'low',
            'summary' => 'Calculate days between two dates.',
            'description' => 'Find the number of days and calendar difference between two dates.',
            'keywords' => ['date difference', 'days between dates', 'calendar'],
            'examples' => [['label' => '2026-05-01 to 2026-05-15', 'inputs' => ['startDate' => '2026-05-01', 'endDate' => '2026-05-15']]],
            'input_schema' => aft_schema('object', ['startDate' => ['type' => 'string'], 'endDate' => ['type' => 'string']], ['startDate', 'endDate']),
        ],
    ];

    return $tools;
}

function aft_public_tool(string $slug): ?array
{
    $tools = aft_tools();
    if (!isset($tools[$slug])) return null;
    $tool = $tools[$slug];
    $tool['slug'] = $slug;
    $tool['tool_url'] = aft_tool_url($slug);
    $tool['guide_url'] = aft_guide_url($slug);
    return $tool;
}

function aft_list_tools(string $query = ''): array
{
    $items = [];
    $terms = preg_split('/\s+/', strtolower(trim($query))) ?: [];
    foreach (aft_tools() as $slug => $tool) {
        $haystack = strtolower($slug . ' ' . $tool['name'] . ' ' . $tool['summary'] . ' ' . $tool['description'] . ' ' . implode(' ', $tool['keywords']));
        $matches = true;
        foreach ($terms as $term) {
            if ($term !== '' && strpos($haystack, $term) === false) {
                $matches = false;
                break;
            }
        }
        if ($matches) $items[] = aft_public_tool($slug);
    }
    return $items;
}

function aft_run_response(string $slug, array $run): array
{
    $run['tool_url'] = aft_tool_url($slug);
    $run['guide_url'] = aft_guide_url($slug);
    return $run;
}

function aft_run_tool(string $slug, array $input): array
{
    if (!aft_public_tool($slug)) {
        throw new InvalidArgumentException("Unknown API tool: {$slug}");
    }

    switch ($slug) {
        case 'percentage-calculator':
            $mode = aft_str($input, 'mode', 'percent-of');
            if ($mode === 'what-percent') {
                $part = aft_num($input, 'part');
                $whole = aft_num($input, 'whole');
                if ($whole == 0.0) throw new InvalidArgumentException('Whole cannot be zero.');
                $percent = ($part / $whole) * 100;
                return aft_run_response($slug, [
                    'answer' => aft_format_number($part) . ' is ' . aft_format_number($percent) . '% of ' . aft_format_number($whole) . '.',
                    'result' => ['percent' => $percent],
                    'steps' => [aft_format_number($part) . ' / ' . aft_format_number($whole) . ' = ' . aft_format_number($part / $whole), 'Multiply by 100 = ' . aft_format_number($percent) . '%'],
                    'assumptions' => ['The whole value is the comparison base.'],
                    'warnings' => [],
                ]);
            }
            $percent = aft_num($input, 'percent');
            $value = aft_num($input, 'value');
            $amount = ($percent / 100) * $value;
            return aft_run_response($slug, [
                'answer' => aft_format_number($percent) . '% of ' . aft_format_number($value) . ' is ' . aft_format_number($amount) . '.',
                'result' => ['amount' => $amount],
                'steps' => [aft_format_number($percent) . ' / 100 = ' . aft_format_number($percent / 100), aft_format_number($percent / 100) . ' x ' . aft_format_number($value) . ' = ' . aft_format_number($amount)],
                'assumptions' => ['Percent means parts per 100.'],
                'warnings' => [],
            ]);

        case 'tip-calculator':
            $subtotal = aft_num($input, 'subtotal');
            $tipPercent = aft_num($input, 'tipPercent');
            $taxPercent = aft_num($input, 'taxPercent', 0);
            $people = max(1, aft_int($input, 'people', 1));
            $tip = $subtotal * ($tipPercent / 100);
            $tax = $subtotal * ($taxPercent / 100);
            $total = $subtotal + $tip + $tax;
            return aft_run_response($slug, [
                'answer' => 'The total is ' . aft_money($total) . ', or ' . aft_money($total / $people) . ' per person.',
                'result' => ['subtotal' => $subtotal, 'tipAmount' => $tip, 'taxAmount' => $tax, 'total' => $total, 'perPerson' => $total / $people],
                'steps' => ['Tip: ' . aft_money($subtotal) . ' x ' . aft_format_number($tipPercent) . '% = ' . aft_money($tip), 'Tax: ' . aft_money($subtotal) . ' x ' . aft_format_number($taxPercent) . '% = ' . aft_money($tax), 'Total divided by ' . $people . ' people = ' . aft_money($total / $people)],
                'assumptions' => ['Tip and tax are calculated from the subtotal.'],
                'warnings' => [],
            ]);

        case 'bmi-calculator':
            $weight = aft_num($input, 'weightKg');
            $heightCm = aft_num($input, 'heightCm');
            $heightM = $heightCm / 100;
            $bmi = $weight / ($heightM * $heightM);
            $category = $bmi < 18.5 ? 'Underweight' : ($bmi < 25 ? 'Healthy weight' : ($bmi < 30 ? 'Overweight' : 'Obesity range'));
            return aft_run_response($slug, [
                'answer' => 'BMI is ' . aft_format_number($bmi) . ' (' . $category . ').',
                'result' => ['bmi' => $bmi, 'category' => $category],
                'steps' => ['Convert height to meters: ' . aft_format_number($heightCm) . ' cm = ' . aft_format_number($heightM) . ' m', 'BMI = weight / height squared = ' . aft_format_number($weight) . ' / ' . aft_format_number($heightM * $heightM)],
                'assumptions' => ['Uses the common adult BMI formula.'],
                'warnings' => ['BMI is a rough screening estimate, not a diagnosis or personal medical advice.'],
            ]);

        case 'mortgage-calculator':
            $home = aft_num($input, 'homePrice');
            $down = aft_num($input, 'downPayment', 0);
            $rate = aft_num($input, 'annualRatePercent');
            $years = aft_num($input, 'years');
            $loan = max(0, $home - $down);
            $months = (int) round($years * 12);
            $monthlyRate = $rate / 100 / 12;
            $principal = $monthlyRate == 0.0 ? $loan / max(1, $months) : $loan * ($monthlyRate * (1 + $monthlyRate) ** $months) / (((1 + $monthlyRate) ** $months) - 1);
            $extra = aft_num($input, 'annualPropertyTax', 0) / 12 + aft_num($input, 'monthlyInsurance', 0) + aft_num($input, 'monthlyHoa', 0) + aft_num($input, 'monthlyPmi', 0);
            return aft_run_response($slug, [
                'answer' => 'Estimated monthly payment is ' . aft_money($principal + $extra) . '. Principal and interest is ' . aft_money($principal) . '.',
                'result' => ['loanAmount' => $loan, 'monthlyPrincipalAndInterest' => $principal, 'totalMonthlyPayment' => $principal + $extra],
                'steps' => ['Loan amount: ' . aft_money($home) . ' - ' . aft_money($down) . ' = ' . aft_money($loan), 'Monthly rate: ' . aft_format_number($rate) . '% / 12', 'Apply the standard amortized loan payment formula.'],
                'assumptions' => ['Taxes, insurance, HOA, and PMI are estimates when provided.'],
                'warnings' => ['This is an estimate, not a loan offer or financial advice.'],
            ]);

        case 'concrete-calculator':
            $length = aft_num($input, 'lengthFeet');
            $width = aft_num($input, 'widthFeet');
            $depth = aft_num($input, 'depthInches');
            $waste = aft_num($input, 'wastePercent', 10);
            $cubicFeet = $length * $width * ($depth / 12);
            $adjusted = $cubicFeet * (1 + $waste / 100);
            $cubicYards = $adjusted / 27;
            return aft_run_response($slug, [
                'answer' => 'You need about ' . aft_format_number($cubicYards) . ' cubic yards of concrete.',
                'result' => ['cubicFeet' => $adjusted, 'cubicYards' => $cubicYards, 'bags40lb' => ceil($adjusted / 0.3), 'bags60lb' => ceil($adjusted / 0.45), 'bags80lb' => ceil($adjusted / 0.6)],
                'steps' => ['Volume: ' . aft_format_number($length) . ' x ' . aft_format_number($width) . ' x (' . aft_format_number($depth) . ' / 12) = ' . aft_format_number($cubicFeet) . ' cubic feet', 'Add waste: ' . aft_format_number($waste) . '%', 'Convert cubic feet to cubic yards by dividing by 27.'],
                'assumptions' => ['Depth is entered in inches and dimensions are for a rectangle.'],
                'warnings' => ['Construction estimates should be checked before ordering material.'],
            ]);

        case 'paint-calculator':
            $length = aft_num($input, 'lengthFeet');
            $width = aft_num($input, 'widthFeet');
            $height = aft_num($input, 'wallHeightFeet', 8);
            $coats = max(1, aft_int($input, 'coats', 2));
            $coverage = aft_num($input, 'coverageSquareFeetPerGallon', 350);
            $windows = max(0, aft_int($input, 'windows', 2));
            $doors = max(0, aft_int($input, 'doors', 1));
            $waste = aft_num($input, 'wastePercent', 10);
            $wall = 2 * ($length + $width) * $height;
            $openings = ($windows * 15) + ($doors * 21);
            $paintable = max(0, $wall - $openings);
            $gallons = ($paintable * $coats * (1 + $waste / 100)) / $coverage;
            return aft_run_response($slug, [
                'answer' => 'Estimated paint needed is ' . aft_format_number($gallons) . ' gallons.',
                'result' => ['wallSquareFeet' => $wall, 'openingSquareFeet' => $openings, 'paintableSquareFeet' => $paintable, 'gallonsNeeded' => $gallons],
                'steps' => ['Wall area: 2 x (length + width) x height = ' . aft_format_number($wall) . ' sq ft', 'Subtract openings: ' . aft_format_number($paintable) . ' sq ft paintable', 'Apply coats and waste, then divide by coverage.'],
                'assumptions' => ['Windows count as 15 sq ft and doors count as 21 sq ft each.'],
                'warnings' => ['Paint coverage varies by surface, color change, primer, and product label.'],
            ]);

        case 'download-time-calculator':
            $size = aft_num($input, 'fileSize');
            $unit = strtoupper(aft_str($input, 'fileUnit', 'GB'));
            $speed = aft_num($input, 'speedMbps');
            $eff = aft_num($input, 'efficiencyPercent', 90);
            $multipliers = ['KB' => 1000, 'MB' => 1000000, 'GB' => 1000000000, 'TB' => 1000000000000];
            if (!isset($multipliers[$unit])) throw new InvalidArgumentException('fileUnit must be KB, MB, GB, or TB.');
            $effective = $speed * ($eff / 100);
            $seconds = ($size * $multipliers[$unit] * 8) / ($effective * 1000000);
            return aft_run_response($slug, [
                'answer' => 'Estimated download time is about ' . aft_format_number($seconds / 60) . ' minutes.',
                'result' => ['seconds' => $seconds, 'minutes' => $seconds / 60, 'effectiveMbps' => $effective],
                'steps' => ['Effective speed: ' . aft_format_number($speed) . ' Mbps x ' . aft_format_number($eff) . '% = ' . aft_format_number($effective) . ' Mbps', 'Convert file size to bits, then divide by effective speed.'],
                'assumptions' => ['File units use decimal bytes.', 'Efficiency accounts for real-world overhead.'],
                'warnings' => ['Actual downloads can change because of Wi-Fi, server limits, congestion, and background traffic.'],
            ]);

        case 'watts-to-amps-calculator':
            $watts = aft_num($input, 'watts');
            $volts = aft_num($input, 'volts');
            $phase = aft_str($input, 'phase', 'single-phase');
            $pf = aft_num($input, 'powerFactor', 1);
            $phaseFactor = $phase === 'three-phase' ? sqrt(3) : 1;
            $amps = $watts / ($volts * $phaseFactor * $pf);
            return aft_run_response($slug, [
                'answer' => aft_format_number($watts) . ' watts at ' . aft_format_number($volts) . ' volts is about ' . aft_format_number($amps) . ' amps.',
                'result' => ['amps' => $amps, 'phaseFactor' => $phaseFactor],
                'steps' => ['Formula: amps = watts / (volts x phase factor x power factor)', aft_format_number($watts) . ' / (' . aft_format_number($volts) . ' x ' . aft_format_number($phaseFactor) . ' x ' . aft_format_number($pf) . ') = ' . aft_format_number($amps) . ' amps'],
                'assumptions' => ['Power factor is included in the denominator.'],
                'warnings' => ['This is a learning estimate, not electrical code or wiring approval. Ask a qualified electrician for safety-critical work.'],
            ]);

        case 'word-counter':
            $text = aft_str($input, 'text');
            preg_match_all('/[\p{L}\p{N}]+(?:[\'-][\p{L}\p{N}]+)*/u', $text, $matches);
            $words = count($matches[0]);
            $chars = function_exists('mb_strlen') ? mb_strlen($text, 'UTF-8') : strlen($text);
            return aft_run_response($slug, [
                'answer' => 'The text has ' . $words . ' words and ' . $chars . ' characters.',
                'result' => ['words' => $words, 'characters' => $chars, 'estimatedReadingMinutes' => $words / 200],
                'steps' => ['Tokenize words from the text', 'Count characters, words, and estimated reading time.'],
                'assumptions' => ['Estimated reading time uses about 200 words per minute.'],
                'warnings' => ['Avoid sending private, regulated, or sensitive text to any API unless that workflow is appropriate.'],
            ]);

        case 'json-formatter':
            $json = aft_str($input, 'json');
            $decoded = json_decode($json, true);
            if (json_last_error() !== JSON_ERROR_NONE) throw new InvalidArgumentException('Input is not valid JSON: ' . json_last_error_msg());
            $formatted = json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            $root = is_array($decoded) ? (array_is_list($decoded) ? 'array' : 'object') : gettype($decoded);
            return aft_run_response($slug, [
                'answer' => 'JSON parsed as a ' . $root . '.',
                'result' => ['rootType' => $root, 'formatted' => $formatted],
                'steps' => ['Parse the JSON text', 'Pretty-print with indentation.'],
                'assumptions' => ['Input must be valid JSON.'],
                'warnings' => ['Do not paste secrets, private keys, customer data, or regulated data into tools unless the workflow is appropriate.'],
            ]);

        case 'base64-encode-decode':
            $mode = aft_str($input, 'mode', 'encode');
            $text = aft_str($input, 'text');
            $output = $mode === 'decode' ? base64_decode($text, true) : base64_encode($text);
            if ($output === false) throw new InvalidArgumentException('Input is not valid Base64.');
            return aft_run_response($slug, [
                'answer' => 'Base64 ' . ($mode === 'decode' ? 'decoded' : 'encoded') . ' output is ready.',
                'result' => ['mode' => $mode, 'output' => $output],
                'steps' => [$mode === 'decode' ? 'Decode Base64 bytes to text.' : 'Encode text bytes with the Base64 alphabet.'],
                'assumptions' => ['Decode mode expects Base64 text.'],
                'warnings' => ['Base64 is encoding, not encryption.'],
            ]);

        case 'url-encode-decode':
            $mode = aft_str($input, 'mode', 'encode');
            $text = aft_str($input, 'text');
            $plus = aft_bool($input, 'plusForSpace', false);
            $output = $mode === 'decode' ? ($plus ? urldecode($text) : rawurldecode($text)) : ($plus ? urlencode($text) : rawurlencode($text));
            return aft_run_response($slug, [
                'answer' => 'URL ' . ($mode === 'decode' ? 'decoded' : 'encoded') . ' output is ready.',
                'result' => ['mode' => $mode, 'output' => $output],
                'steps' => [$mode === 'decode' ? 'Convert percent-encoded sequences back to text.' : 'Escape characters that are unsafe inside URL components.'],
                'assumptions' => ['This works on URL component text, not full URL validation.'],
                'warnings' => ['Do not paste private tokens or signed URLs into tools unless the workflow is appropriate.'],
            ]);

        case 'password-generator':
            $length = max(8, min(128, aft_int($input, 'length', 16)));
            $sets = [
                'upper' => aft_bool($input, 'includeUppercase', true) ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : '',
                'lower' => aft_bool($input, 'includeLowercase', true) ? 'abcdefghijkmnopqrstuvwxyz' : '',
                'numbers' => aft_bool($input, 'includeNumbers', true) ? '23456789' : '',
                'symbols' => aft_bool($input, 'includeSymbols', true) ? '!@#$%^&*()-_=+[]{};:,.?' : '',
            ];
            $pool = implode('', $sets);
            if ($pool === '') throw new InvalidArgumentException('Choose at least one character group.');
            $password = '';
            for ($i = 0; $i < $length; $i++) {
                $password .= $pool[random_int(0, strlen($pool) - 1)];
            }
            $entropy = $length * (log(strlen($pool)) / log(2));
            return aft_run_response($slug, [
                'answer' => 'Generated a ' . $length . '-character password with about ' . aft_format_number($entropy) . ' bits of estimated entropy.',
                'result' => ['password' => $password, 'length' => $length, 'estimatedEntropyBits' => $entropy],
                'steps' => ['Build the character pool from selected groups.', 'Choose random characters from the pool.'],
                'assumptions' => ['Entropy estimate is based on character pool size and length.'],
                'warnings' => ['Use a password manager for real accounts. Never reuse important passwords.'],
            ]);

        case 'subnet-calculator':
            $ip = aft_str($input, 'ipAddress');
            $prefix = max(0, min(32, aft_int($input, 'prefixLength', 24)));
            $ipLong = ip2long($ip);
            if ($ipLong === false) throw new InvalidArgumentException('Enter a valid IPv4 address.');
            $ipUnsigned = sprintf('%u', $ipLong);
            $mask = $prefix === 0 ? 0 : ((0xFFFFFFFF << (32 - $prefix)) & 0xFFFFFFFF);
            $network = ((int) $ipUnsigned) & $mask;
            $broadcast = $network | (~$mask & 0xFFFFFFFF);
            $total = $prefix === 32 ? 1 : (2 ** (32 - $prefix));
            $usable = $prefix >= 31 ? $total : max(0, $total - 2);
            return aft_run_response($slug, [
                'answer' => 'Network is ' . long2ip($network) . '/' . $prefix . ', with ' . $usable . ' usable address(es).',
                'result' => ['networkAddress' => long2ip($network), 'broadcastAddress' => long2ip($broadcast), 'subnetMask' => long2ip($mask), 'prefixLength' => $prefix, 'usableAddresses' => $usable],
                'steps' => ['Convert IP and prefix to a 32-bit mask.', 'Apply mask to get network: ' . long2ip($network), 'Use wildcard to get broadcast: ' . long2ip($broadcast)],
                'assumptions' => ['IPv4 subnet math is used.'],
                'warnings' => [],
            ]);

        case 'date-calculator':
            $start = aft_str($input, 'startDate');
            $end = aft_str($input, 'endDate');
            $startDate = DateTimeImmutable::createFromFormat('!Y-m-d', $start);
            $endDate = DateTimeImmutable::createFromFormat('!Y-m-d', $end);
            if (!$startDate || !$endDate) throw new InvalidArgumentException('Dates must use YYYY-MM-DD.');
            $days = abs((int) $startDate->diff($endDate)->format('%a'));
            return aft_run_response($slug, [
                'answer' => 'There are ' . $days . ' day(s) between ' . $start . ' and ' . $end . '.',
                'result' => ['startDate' => $start, 'endDate' => $end, 'days' => $days],
                'steps' => ['Parse both dates in YYYY-MM-DD format.', 'Compare dates and count total days.'],
                'assumptions' => ['Dates use YYYY-MM-DD format.'],
                'warnings' => [],
            ]);
    }

    throw new InvalidArgumentException("Tool is not runnable yet: {$slug}");
}

function aft_try_route(string $message): ?array
{
    $text = strtolower($message);

    if (preg_match('/(-?\d+(?:\.\d+)?)\s*(?:%|percent)\s*(?:of|x|times)?\s*(-?\d+(?:\.\d+)?)/i', $message, $m)) {
        return ['tool_slug' => 'percentage-calculator', 'inputs' => ['mode' => 'percent-of', 'percent' => (float) $m[1], 'value' => (float) $m[2]], 'confidence' => 'high', 'source' => 'php-router'];
    }

    if (preg_match('/(-?\d+(?:\.\d+)?)\s*(?:is|=)?\s*(?:what\s*)?percent\s+of\s+(-?\d+(?:\.\d+)?)/i', $message, $m)) {
        return ['tool_slug' => 'percentage-calculator', 'inputs' => ['mode' => 'what-percent', 'part' => (float) $m[1], 'whole' => (float) $m[2]], 'confidence' => 'medium', 'source' => 'php-router'];
    }

    if (preg_match('/(\d+(?:\.\d+)?)\s*(?:by|x)\s*(\d+(?:\.\d+)?).*?(\d+(?:\.\d+)?)\s*(?:inch|inches|in)/i', $message, $m) && str_contains($text, 'concrete')) {
        return ['tool_slug' => 'concrete-calculator', 'inputs' => ['lengthFeet' => (float) $m[1], 'widthFeet' => (float) $m[2], 'depthInches' => (float) $m[3], 'wastePercent' => 10], 'confidence' => 'high', 'source' => 'php-router'];
    }

    if (preg_match('/(\d+(?:\.\d+)?)\s*(kb|mb|gb|tb).*?(\d+(?:\.\d+)?)\s*mbps/i', $message, $m)) {
        return ['tool_slug' => 'download-time-calculator', 'inputs' => ['fileSize' => (float) $m[1], 'fileUnit' => strtoupper($m[2]), 'speedMbps' => (float) $m[3], 'efficiencyPercent' => 90], 'confidence' => 'high', 'source' => 'php-router'];
    }

    if (preg_match('/(\d+(?:\.\d+)?)\s*watts?.*?(\d+(?:\.\d+)?)\s*volts?/i', $message, $m)) {
        return ['tool_slug' => 'watts-to-amps-calculator', 'inputs' => ['watts' => (float) $m[1], 'volts' => (float) $m[2], 'phase' => 'single-phase', 'powerFactor' => 1], 'confidence' => 'high', 'source' => 'php-router'];
    }

    if (preg_match('/(\d+(?:\.\d+)?)\s*kg.*?(\d+(?:\.\d+)?)\s*cm/i', $message, $m) && str_contains($text, 'bmi')) {
        return ['tool_slug' => 'bmi-calculator', 'inputs' => ['weightKg' => (float) $m[1], 'heightCm' => (float) $m[2]], 'confidence' => 'high', 'source' => 'php-router'];
    }

    if (preg_match('/(\d{1,3}(?:\.\d+)?(?:\.\d+)?(?:\.\d+)?)\/(\d{1,2})/', $message, $m)) {
        return ['tool_slug' => 'subnet-calculator', 'inputs' => ['ipAddress' => $m[1], 'prefixLength' => (int) $m[2]], 'confidence' => 'medium', 'source' => 'php-router'];
    }

    return null;
}
