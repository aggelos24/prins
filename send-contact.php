<?php

declare(strict_types=1);

$respond = static function (int $statusCode, array $payload): void {
	http_response_code($statusCode);
	header('Content-Type: application/json; charset=UTF-8');
	echo json_encode($payload, JSON_UNESCAPED_UNICODE);
};

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
	$respond(405, [
		'success' => false,
		'message' => 'Method not allowed. Use POST.'
	]);
	return;
}

$email = trim((string) ($_POST['email'] ?? ''));
$mobile = trim((string) ($_POST['mobile'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));
$interestedIn = isset($_POST['interested_in']) ? $_POST['interested_in'] : null;

if ($email === '' || $mobile === '' || $message === '') {
	$respond(422, [
		'success' => false,
		'message' => 'Τα πεδία είναι υποχρεωτικά.'
	]);
	return;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
	$respond(422, [
		'success' => false,
		'message' => 'Παρακαλώ εισάγετε μια έγκυρη διεύθυνση email.'
	]);
	return;
}

$body = "<p><b>Τηλέφωνο Επικοινωνίας:</b> {$mobile}</p>"
	. ($interestedIn ? "<p><b>Ο χρήστης ενδιαφέρεται για:</b> {$interestedIn}</p>" : '')
	. "<p><b>Μήνυμα:</b></p>"
	. "<p>{$message}</p>";

$headers = [
	'MIME-Version: 1.0',
	'Content-Type: text/html; charset=UTF-8',
	"From: {$email}",
	'X-Mailer: PHP/' . PHP_VERSION
];

$sent = mail(
	'panagiotis.rousseas@prins.agency',
	'Νέα υποβολή φόρμας επικοινωνίας',
	$body,
	implode("\r\n", $headers)
);
$sent = true;

if (!$sent) {
	$respond(500, [
		'success' => false,
		'message' => 'Το email δεν μπόρεσε να σταλεί. Παρακαλώ δοκιμάστε ξανά αργότερα.'
	]);
	return;
}

$respond(200, [
	'success' => true,
	'message' => 'Το μήνυμα στάλθηκε, θα επικοινωνήσουμε μαζί σας σύντομα.'
]);
