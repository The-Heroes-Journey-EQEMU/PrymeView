<?php
header('Content-Type: application/json'); // Ensure JSON response
include $_SERVER['DOCUMENT_ROOT'] . '/includes/db_connection.php';
include $_SERVER['DOCUMENT_ROOT'] . '/includes/zone_mapping.php'; // Include the zone mapping

$spellId = $_GET['id'] ?? null;

if (!$spellId) {
    echo json_encode(['error' => 'Spell ID is missing.']);
    exit;
}

try {
    // Step 1: Find the item with the scroll effect matching the spell ID
    $stmt = $pdo->prepare("SELECT id, name FROM items WHERE scrolleffect = :spell_id");
    $stmt->bindValue(':spell_id', $spellId, PDO::PARAM_INT);
    $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$item) {
        echo json_encode(['error' => 'No item found with this spell effect.']);
        exit;
    }

    $itemId = $item['id'];

    // Step 2: Find merchant IDs selling this item
    $stmt = $pdo->prepare("SELECT DISTINCT merchantid FROM merchantlist WHERE item = :item_id");
    $stmt->bindValue(':item_id', $itemId, PDO::PARAM_INT);
    $stmt->execute();
    $merchants = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$merchants) {
        echo json_encode(['error' => 'No merchants found selling this item.']);
        exit;
    }

    $merchantIds = array_column($merchants, 'merchantid');

    // Step 3: Find NPCs (vendors), their zones, and spawn points
    $placeholders = implode(',', array_fill(0, count($merchantIds), '?'));
    $stmt = $pdo->prepare("
        SELECT 
            nt.name AS npc_name, 
            nt.id AS npc_id, 
            s2.zone AS zone_short_name,
            s2.x, s2.y, s2.z
        FROM npc_types nt
        INNER JOIN spawnentry se ON se.npcid = nt.id
        INNER JOIN spawn2 s2 ON s2.spawngroupid = se.spawngroupid
        WHERE nt.id IN ($placeholders)
        GROUP BY nt.name, nt.id, s2.zone, s2.x, s2.y, s2.z
    ");
    $stmt->execute($merchantIds);
    $vendors = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$vendors) {
        echo json_encode(['error' => 'No vendors found for this item.']);
        exit;
    }

    foreach ($vendors as &$vendor) {
        $vendor['zone_name'] = $zoneMapping[$vendor['zone_short_name']] ?? $vendor['zone_short_name'];
        $vendor['x'] = isset($vendor['x']) && $vendor['x'] != 0 ? round($vendor['x'], 2) : 'N/A';
        $vendor['y'] = isset($vendor['y']) && $vendor['y'] != 0 ? round($vendor['y'], 2) : 'N/A';
        $vendor['z'] = isset($vendor['z']) && $vendor['z'] != 0 ? round($vendor['z'], 2) : 'N/A';
    }
    

    echo json_encode($vendors);
} catch (Exception $e) {
    echo json_encode(['error' => 'An error occurred: ' . $e->getMessage()]);
}
