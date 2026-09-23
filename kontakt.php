<?php
/**
 * Nimmt das Anfrageformular entgegen und schickt es per E-Mail an info@waigelbau.de.
 * Läuft auf dem IONOS-Webspace (PHP). Antwortet mit JSON, das assets/js/main.js auswertet.
 *
 * Wichtig: Der Absender (From) muss eine Adresse der eigenen Domain sein, sonst
 * lehnen viele Mailserver die Nachricht ab. Geantwortet wird an den Absender (Reply-To).
 */

declare(strict_types=1);

const EMPFAENGER = 'info@waigelbau.de';
const ABSENDER   = 'info@waigelbau.de';

header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Methode nicht erlaubt']);
    exit;
}

/** Zeilenumbrüche aus Kopfzeilen entfernen (Header-Injection) */
function sauber(string $wert): string
{
    return trim(str_replace(["\r", "\n", "%0a", "%0d"], ' ', $wert));
}

function feld(string $name, int $max = 2000): string
{
    $wert = (string)($_POST[$name] ?? '');
    return mb_substr(sauber($wert), 0, $max);
}

// Honeypot: echte Menschen füllen das versteckte Feld nicht aus
if (feld('website') !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

$name      = feld('name', 120);
$email     = feld('email', 160);
$nachricht = mb_substr(trim((string)($_POST['nachricht'] ?? '')), 0, 5000);
$consent   = isset($_POST['datenschutz']);

$fehler = [];
if ($name === '')                                    { $fehler[] = 'Name fehlt'; }
if (!filter_var($email, FILTER_VALIDATE_EMAIL))      { $fehler[] = 'E-Mail ungültig'; }
if ($nachricht === '')                               { $fehler[] = 'Nachricht fehlt'; }
if (!$consent)                                       { $fehler[] = 'Einwilligung fehlt'; }

if ($fehler) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => implode(', ', $fehler)]);
    exit;
}

$projektart = feld('projektart', 40);
$firma      = feld('firma', 120);
$telefon    = feld('telefon', 60);
$ort        = feld('ort', 120);
$zeitraum   = feld('zeitraum', 80);

$betreff = 'Anfrage über waigelbau.de';
if ($projektart !== '') {
    $betreff .= ' – ' . ucfirst($projektart);
}

$zeilen = [
    'Neue Anfrage über das Formular auf waigelbau.de',
    '',
    'Worum geht es: ' . ($projektart !== '' ? $projektart : '–'),
    'Name:          ' . $name,
    'Firma:         ' . ($firma !== '' ? $firma : '–'),
    'E-Mail:        ' . $email,
    'Telefon:       ' . ($telefon !== '' ? $telefon : '–'),
    'Ort des Baus:  ' . ($ort !== '' ? $ort : '–'),
    'Zeitraum:      ' . ($zeitraum !== '' ? $zeitraum : '–'),
    '',
    'Vorhaben:',
    $nachricht,
    '',
    '---',
    'Gesendet am ' . date('d.m.Y H:i') . ' Uhr',
    'IP-Adresse wird aus Datenschutzgründen nicht mitgeschickt.',
];

$koerper = implode("\r\n", $zeilen);

$header = [
    'From: Waigel-Baukoordination <' . ABSENDER . '>',
    'Reply-To: ' . sauber($name) . ' <' . $email . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'MIME-Version: 1.0',
    'X-Mailer: waigelbau.de',
];

$betreffKodiert = '=?UTF-8?B?' . base64_encode($betreff) . '?=';
$erfolg = @mail(EMPFAENGER, $betreffKodiert, $koerper, implode("\r\n", $header));

if (!$erfolg) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Versand fehlgeschlagen']);
    exit;
}

echo json_encode(['ok' => true]);
