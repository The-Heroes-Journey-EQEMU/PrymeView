<?php
// Database connection settings
$host = '66.70.227.70:16033';
$dbname = 'content';
$username = 'ro';
$password = 'ro';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["error" => "Could not connect to the database"]);
    exit;
}
?>
