<?php
// Database connection settings
include $_SERVER['DOCUMENT_ROOT'] . '/includes/db_connection.php';
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["error" => "Could not connect to the database"]);
    exit;
}

$itemId = $_GET['id'] ?? null;

if ($itemId) {
    // Fetch NPC and zone information for the given item ID
    $npcStmt = $pdo->prepare("
        SELECT nt.name AS npc_name, s2.zone
        FROM items i
        INNER JOIN lootdrop_entries lde ON lde.item_id = i.id
        INNER JOIN lootdrop ld ON ld.id = lde.lootdrop_id
        INNER JOIN loottable_entries lte ON lte.lootdrop_id = ld.id
        INNER JOIN loottable lt ON lt.id = lte.loottable_id
        INNER JOIN npc_types nt ON nt.loottable_id = lt.id
        INNER JOIN spawnentry se ON se.npcid = nt.id
        INNER JOIN spawn2 s2 ON s2.spawngroupid = se.spawngroupid
        WHERE i.id = :id
        GROUP BY nt.name, s2.zone
    ");
    $npcStmt->bindParam(':id', $itemId, PDO::PARAM_INT);
    $npcStmt->execute();
    $npcInfo = $npcStmt->fetchAll(PDO::FETCH_ASSOC);

    $npcInfo = $npcInfo ?: [['npc_name' => 'Unknown', 'zone' => 'Unknown']];

    header('Content-Type: application/json');
    echo json_encode(['npc_info' => $npcInfo]);
    exit;
}

header('Content-Type: application/json');
echo json_encode(["error" => "No NPC info found"]);
exit;
