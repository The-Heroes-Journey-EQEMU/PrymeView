<?php
// Connect to database
//removed db info for git
include $_SERVER['DOCUMENT_ROOT'] . '/thj/includes/db_connection.php';
$pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);

// Get the spell ID from the request
$spellId = isset($_GET['id']) ? intval($_GET['id']) : null;

if ($spellId) {
    $stmt = $pdo->prepare("SELECT * FROM spells_new WHERE id = :spellId");
    $stmt->bindParam(':spellId', $spellId);
    $stmt->execute();
    $spell = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($spell) {
        echo json_encode($spell);
    } else {
        echo json_encode(['error' => 'Spell not found']);
    }
} else {
    echo json_encode(['error' => 'No spell ID provided']);
}
