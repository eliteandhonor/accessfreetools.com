<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

const CONTACT_TO = 'contact@accessfreetools.com';
const CONTACT_FROM = 'contact@accessfreetools.com';
const RATE_LIMIT_WINDOW = 900;
const RATE_LIMIT_MAX = 5;

$allowedTopics = [
    'Tool idea',
    'Correction',
    'Privacy question',
    'Advertising or affiliate question',
    'General feedback',
];

function respond(array $body, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_SLASHES);
    exit;
}

function clean_value($value, int $maxLength): string
{
    if (!is_string($value)) {
        return '';
    }

    $value = trim(str_replace(["\r", "\n", "\0"], '', $value));
    return substr($value, 0, $maxLength);
}

function clean_message($value, int $maxLength): string
{
    if (!is_string($value)) {
        return '';
    }

    $value = trim(str_replace("\0", '', $value));
    return substr($value, 0, $maxLength);
}

function payload_value(array $payload, string $key, int $maxLength): string
{
    return clean_value($payload[$key] ?? '', $maxLength);
}

function client_ip(): string
{
    $forwarded = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    if (is_string($forwarded) && $forwarded !== '') {
        return trim(explode(',', $forwarded)[0]);
    }

    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

function rate_limit_key(string $ip): string
{
    return sys_get_temp_dir() . '/accessfreetools-contact-' . hash('sha256', $ip) . '.json';
}

function check_rate_limit(string $ip): bool
{
    $path = rate_limit_key($ip);
    $now = time();
    $bucket = ['count' => 0, 'resetAt' => $now + RATE_LIMIT_WINDOW];

    if (is_file($path)) {
        $stored = json_decode((string) file_get_contents($path), true);
        if (is_array($stored) && isset($stored['count'], $stored['resetAt'])) {
            $bucket = $stored;
        }
    }

    if ((int) $bucket['resetAt'] <= $now) {
        $bucket = ['count' => 0, 'resetAt' => $now + RATE_LIMIT_WINDOW];
    }

    $bucket['count'] = (int) $bucket['count'] + 1;
    file_put_contents($path, json_encode($bucket), LOCK_EX);

    return $bucket['count'] <= RATE_LIMIT_MAX;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['ok' => false, 'message' => 'Use POST to send contact messages.'], 405);
}

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$rawBody = file_get_contents('php://input') ?: '';
$payload = [];

if (stripos($contentType, 'application/json') !== false) {
    $decoded = json_decode($rawBody, true);
    if (!is_array($decoded)) {
        respond(['ok' => false, 'message' => 'Message format was not readable. Try sending the form again.'], 400);
    }
    $payload = $decoded;
} else {
    $payload = $_POST;
}

$company = payload_value($payload, 'company', 120);
if ($company !== '') {
    respond(['ok' => true, 'message' => 'Thanks. Your message was received.']);
}

if (!check_rate_limit(client_ip())) {
    respond(['ok' => false, 'message' => 'Too many messages were sent from this connection. Please wait a few minutes and try again.'], 429);
}

$name = payload_value($payload, 'name', 120);
$email = payload_value($payload, 'email', 180);
$topic = payload_value($payload, 'topic', 80);
$message = clean_message($payload['message'] ?? '', 5000);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(['ok' => false, 'message' => 'Enter a valid email address.'], 400);
}

if (!in_array($topic, $allowedTopics, true)) {
    respond(['ok' => false, 'message' => 'Choose a valid topic.'], 400);
}

if (strlen($message) < 10) {
    respond(['ok' => false, 'message' => 'Write at least 10 characters so the message has enough detail.'], 400);
}

$safeName = $name !== '' ? $name : 'Not provided';
$subject = 'Access Free Tools: ' . $topic;
$body = implode("\n", [
    'New Access Free Tools contact form message',
    '',
    'Topic: ' . $topic,
    'Name: ' . $safeName,
    'Email: ' . $email,
    'IP: ' . client_ip(),
    '',
    'Message:',
    $message,
]);

$headers = [
    'From: Access Free Tools <' . CONTACT_FROM . '>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
    'X-Website: accessfreetools.com',
];

$sent = mail(CONTACT_TO, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    respond(['ok' => false, 'message' => 'The message could not be sent right now. Please email contact@accessfreetools.com directly.'], 502);
}

respond(['ok' => true, 'message' => 'Thanks. Your message was sent to contact@accessfreetools.com.']);
