<?php
// Load environment variables
$host = getenv('DB_HOST') ?: 'localhost'; // Default to localhost if not set
$dbname = getenv('DB_NAME') ?: 'content';
$username = getenv('DB_USER') ?: 'root';
$password = getenv('DB_PASS') ?: '';

// Database connection
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["error" => "Could not connect to the database"]);
    exit;
}
?>
