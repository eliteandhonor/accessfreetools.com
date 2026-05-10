<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

const MAX_EVENTS_TO_READ = 50000;
const ACTIVE_WINDOW_SECONDS = 600;

function analytics_env(string $name, string $fallback = ''): string
{
    $value = getenv($name);
    if ($value === false || $value === '') {
        return $fallback;
    }
    return $value;
}

function analytics_json(array $body, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_SLASHES);
    exit;
}

function analytics_storage_path(): string
{
    $root = dirname(__DIR__, 2);
    $dir = $root . DIRECTORY_SEPARATOR . '.analytics';

    if (!is_dir($dir)) {
        mkdir($dir, 0750, true);
    }

    return $dir . DIRECTORY_SEPARATOR . 'events.ndjson';
}

function analytics_header(string $name): string
{
    $key = 'HTTP_' . strtoupper(str_replace('-', '_', $name));
    return isset($_SERVER[$key]) ? (string) $_SERVER[$key] : '';
}

function analytics_client_ip(): string
{
    $candidates = [
        analytics_header('cf-connecting-ip'),
        analytics_header('x-real-ip'),
        explode(',', analytics_header('x-forwarded-for'))[0] ?? '',
        $_SERVER['REMOTE_ADDR'] ?? '',
    ];

    foreach ($candidates as $candidate) {
        $candidate = trim((string) $candidate);
        if ($candidate !== '') {
            return $candidate;
        }
    }

    return '';
}

function analytics_hash(string $value, string $salt): string
{
    if ($value === '') {
        return '';
    }

    return substr(hash_hmac('sha256', $value, $salt), 0, 32);
}

function analytics_sanitize(mixed $value, int $maxLength = 240): string
{
    if (!is_string($value) && !is_numeric($value)) {
        return '';
    }

    $text = trim((string) $value);
    $text = preg_replace('/[\x00-\x1F\x7F]/u', '', $text) ?? '';
    return substr($text, 0, $maxLength);
}

function analytics_sanitize_path(mixed $value): string
{
    $path = analytics_sanitize($value, 320);
    if ($path === '' || str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
        return '/';
    }

    return str_starts_with($path, '/') ? $path : '/' . $path;
}

function analytics_is_bot(string $ua): bool
{
    return preg_match('/bot|crawl|spider|slurp|bingpreview|facebookexternalhit|meta-externalagent|whatsapp|telegrambot|preview|validator|lighthouse|pagespeed|curl|wget|python|go-http-client|httpclient/i', $ua) === 1;
}

function analytics_device(string $ua): string
{
    if (preg_match('/tablet|ipad/i', $ua)) {
        return 'tablet';
    }
    if (preg_match('/mobi|android|iphone|ipod/i', $ua)) {
        return 'mobile';
    }
    return 'desktop';
}

function analytics_browser(string $ua): string
{
    if (str_contains($ua, 'Edg/')) return 'Edge';
    if (str_contains($ua, 'Chrome/')) return 'Chrome';
    if (str_contains($ua, 'Firefox/')) return 'Firefox';
    if (str_contains($ua, 'Safari/') && !str_contains($ua, 'Chrome/')) return 'Safari';
    return 'Other';
}

function analytics_os(string $ua): string
{
    if (str_contains($ua, 'Windows')) return 'Windows';
    if (str_contains($ua, 'Mac OS')) return 'macOS';
    if (str_contains($ua, 'Android')) return 'Android';
    if (preg_match('/iPhone|iPad|iPod/i', $ua)) return 'iOS';
    if (str_contains($ua, 'Linux')) return 'Linux';
    return 'Other';
}

function analytics_make_event(array $payload): array
{
    $ua = (string) ($_SERVER['HTTP_USER_AGENT'] ?? '');
    $ip = analytics_client_ip();
    $token = analytics_env('AFT_ANALYTICS_TOKEN', analytics_env('ADMIN_ANALYTICS_TOKEN'));
    $salt = analytics_env('AFT_ANALYTICS_SALT', $token !== '' ? $token : 'access-free-tools-local-analytics');
    $referrer = analytics_sanitize($payload['referrer'] ?? '', 500);
    $referrerHost = '';
    $referrerPath = '';

    if ($referrer !== '') {
        $parts = parse_url($referrer);
        $referrerHost = isset($parts['host']) ? strtolower((string) $parts['host']) : '';
        $referrerPath = isset($parts['path']) ? (string) $parts['path'] : '';
    }

    $screenWidth = isset($payload['screenWidth']) ? (int) $payload['screenWidth'] : null;
    $screenHeight = isset($payload['screenHeight']) ? (int) $payload['screenHeight'] : null;
    $type = analytics_sanitize($payload['type'] ?? '', 40);

    return array_filter([
        'eventId' => bin2hex(random_bytes(16)),
        'ts' => gmdate('c'),
        'day' => (new DateTimeImmutable('now', new DateTimeZone(analytics_env('AFT_ANALYTICS_TIME_ZONE', 'Australia/Brisbane'))))->format('Y-m-d'),
        'type' => $type === 'tool_action' ? 'tool_action' : 'page_view',
        'pagePath' => analytics_sanitize_path($payload['pagePath'] ?? '/'),
        'pageTitle' => analytics_sanitize($payload['pageTitle'] ?? '', 180),
        'visitorHash' => analytics_hash(analytics_sanitize($payload['visitorId'] ?? '', 160), $salt),
        'sessionHash' => analytics_hash(analytics_sanitize($payload['sessionId'] ?? '', 160), $salt),
        'ipHash' => analytics_hash($ip, $salt),
        'referrerHost' => $referrerHost,
        'referrerPath' => $referrerPath,
        'language' => analytics_sanitize($payload['language'] ?? '', 40),
        'screenWidth' => $screenWidth,
        'screenHeight' => $screenHeight,
        'device' => analytics_device($ua),
        'browser' => analytics_browser($ua),
        'os' => analytics_os($ua),
        'toolSlug' => analytics_sanitize($payload['toolSlug'] ?? '', 120),
        'toolName' => analytics_sanitize($payload['toolName'] ?? '', 160),
        'category' => analytics_sanitize($payload['category'] ?? '', 120),
        'action' => analytics_sanitize($payload['action'] ?? '', 120),
    ], static fn($value) => $value !== '' && $value !== null);
}

function analytics_record(): void
{
    $ua = (string) ($_SERVER['HTTP_USER_AGENT'] ?? '');
    $ip = analytics_client_ip();
    $excludedIps = array_filter(array_map('trim', explode(',', analytics_env('AFT_ANALYTICS_EXCLUDE_IPS'))));

    if (analytics_is_bot($ua) || in_array($ip, $excludedIps, true)) {
        analytics_json(['ok' => true, 'ignored' => true], 202);
    }

    $raw = file_get_contents('php://input');
    $payload = json_decode($raw ?: '{}', true);

    if (!is_array($payload)) {
        analytics_json(['ok' => false, 'message' => 'Analytics event was not readable.'], 400);
    }

    $event = analytics_make_event($payload);
    $path = analytics_storage_path();
    $line = json_encode($event, JSON_UNESCAPED_SLASHES) . PHP_EOL;

    if (file_put_contents($path, $line, FILE_APPEND | LOCK_EX) === false) {
        analytics_json(['ok' => false, 'message' => 'Analytics event could not be stored.'], 500);
    }

    analytics_json(['ok' => true], $event['type'] === 'tool_action' ? 201 : 201);
}

function analytics_authorized(): bool
{
    $configured = analytics_env('AFT_ANALYTICS_TOKEN', analytics_env('ADMIN_ANALYTICS_TOKEN'));
    if ($configured === '') {
        return false;
    }

    $provided = analytics_header('x-aft-analytics-token');
    if ($provided === '') {
        $provided = isset($_GET['token']) ? (string) $_GET['token'] : '';
    }

    return $provided !== '' && hash_equals($configured, $provided);
}

function analytics_read_events(): array
{
    $path = analytics_storage_path();
    if (!is_file($path)) {
        return [];
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return [];
    }

    $lines = array_slice($lines, -MAX_EVENTS_TO_READ);
    $events = [];

    foreach ($lines as $line) {
        $event = json_decode($line, true);
        if (is_array($event) && isset($event['ts'], $event['type'])) {
            $events[] = $event;
        }
    }

    return $events;
}

function analytics_top(array $items, int $limit = 10): array
{
    usort($items, static fn($a, $b) => ($b['count'] <=> $a['count']) ?: strcmp((string) $a['label'], (string) $b['label']));
    return array_slice($items, 0, $limit);
}

function analytics_summary(): array
{
    $events = analytics_read_events();
    $timeZone = analytics_env('AFT_ANALYTICS_TIME_ZONE', 'Australia/Brisbane');
    $now = new DateTimeImmutable('now', new DateTimeZone($timeZone));
    $today = $now->format('Y-m-d');
    $rangeStart = $now->modify('-30 days')->getTimestamp();
    $activeStart = time() - ACTIVE_WINDOW_SECONDS;

    $rangeEvents = array_values(array_filter($events, static function ($event) use ($rangeStart) {
        return strtotime((string) $event['ts']) >= $rangeStart;
    }));

    $visitors = [];
    $todayVisitors = [];
    $allTimeVisitors = [];
    $firstSeen = [];
    $activeVisitors = [];
    $topPages = [];
    $topTools = [];
    $topReferrers = [];
    $todayPageViews = 0;
    $todayToolActions = 0;

    foreach ($events as $event) {
        $visitor = (string) ($event['visitorHash'] ?? '');
        if ($visitor !== '' && !isset($firstSeen[$visitor])) {
            $firstSeen[$visitor] = (string) ($event['day'] ?? '');
        }
        if ($visitor !== '') {
            $allTimeVisitors[$visitor] = true;
        }
    }

    foreach ($rangeEvents as $event) {
        $visitor = (string) ($event['visitorHash'] ?? '');
        $type = (string) ($event['type'] ?? '');
        $day = (string) ($event['day'] ?? '');

        if ($visitor !== '') {
            $visitors[$visitor] = true;
            if (strtotime((string) $event['ts']) >= $activeStart) {
                $activeVisitors[$visitor] = true;
            }
            if ($day === $today) {
                $todayVisitors[$visitor] = true;
            }
        }

        if ($day === $today && $type === 'page_view') {
            $todayPageViews++;
        }
        if ($day === $today && $type === 'tool_action') {
            $todayToolActions++;
        }

        if ($type === 'page_view') {
            $path = (string) ($event['pagePath'] ?? '/');
            $label = (string) ($event['pageTitle'] ?? $path);
            if (!isset($topPages[$path])) {
                $topPages[$path] = ['path' => $path, 'label' => $label !== '' ? $label : $path, 'count' => 0];
            }
            $topPages[$path]['count']++;
        }

        if ($type === 'tool_action') {
            $slug = (string) ($event['toolSlug'] ?? '');
            $path = (string) ($event['pagePath'] ?? ($slug !== '' ? '/tools/' . $slug . '/' : '/tools/'));
            $label = (string) ($event['toolName'] ?? $slug);
            if (!isset($topTools[$path])) {
                $topTools[$path] = ['path' => $path, 'slug' => $slug, 'label' => $label !== '' ? $label : $path, 'count' => 0];
            }
            $topTools[$path]['count']++;
        }

        $host = (string) ($event['referrerHost'] ?? '');
        if ($host !== '' && $host !== 'accessfreetools.com' && $host !== 'www.accessfreetools.com') {
            if (!isset($topReferrers[$host])) {
                $topReferrers[$host] = ['label' => $host, 'count' => 0];
            }
            $topReferrers[$host]['count']++;
        }
    }

    $newVisitors = 0;
    $returningVisitors = 0;
    foreach (array_keys($todayVisitors) as $visitor) {
        if (($firstSeen[$visitor] ?? '') === $today) {
            $newVisitors++;
        } else {
            $returningVisitors++;
        }
    }

    $recent = array_reverse(array_slice($rangeEvents, -25));

    return [
        'activeVisitors' => count($activeVisitors),
        'allTime' => [
            'events' => count($events),
            'pageViews' => count(array_filter($events, static fn($event) => ($event['type'] ?? '') === 'page_view')),
            'toolActions' => count(array_filter($events, static fn($event) => ($event['type'] ?? '') === 'tool_action')),
            'visitors' => count($allTimeVisitors),
        ],
        'days' => 30,
        'generatedAt' => gmdate('c'),
        'rangeStart' => gmdate('c', $rangeStart),
        'recentEvents' => $recent,
        'returningVisitorsToday' => $returningVisitors,
        'timeZone' => $timeZone,
        'today' => [
            'events' => count(array_filter($rangeEvents, static fn($event) => ($event['day'] ?? '') === $today)),
            'newVisitors' => $newVisitors,
            'pageViews' => $todayPageViews,
            'returningVisitors' => $returningVisitors,
            'toolActions' => $todayToolActions,
            'visitors' => count($todayVisitors),
        ],
        'topPages' => analytics_top(array_values($topPages)),
        'topReferrers' => analytics_top(array_values($topReferrers)),
        'topTools' => analytics_top(array_values($topTools)),
    ];
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'POST') {
    analytics_record();
}

if ($method === 'GET') {
    if (!analytics_authorized()) {
        analytics_json(['ok' => false, 'message' => 'Analytics token required.'], 401);
    }

    analytics_json(['ok' => true, 'summary' => analytics_summary()]);
}

analytics_json(['ok' => false, 'message' => 'Method not allowed.'], 405);
