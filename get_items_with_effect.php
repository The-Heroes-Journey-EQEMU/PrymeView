<?php
header('Content-Type: application/json'); // Ensure JSON response
include $_SERVER['DOCUMENT_ROOT'] . '/includes/db_connection.php';

$spellId = $_GET['id'] ?? null;

if (!$spellId) {
    echo json_encode(['error' => 'Spell ID is missing.']);
    exit;
}

try {
    // Step: Find items with the same spell effect in any of the columns
    $stmt = $pdo->prepare("
    SELECT 
        id,
        icon,
        CASE
            WHEN name LIKE 'Apocryphal%' THEN REPLACE(name, 'Apocryphal', 'Legendary')
            WHEN name LIKE 'Rose Colored%' THEN REPLACE(name, 'Rose Colored', 'Enchanted')
            ELSE name
        END AS name
    FROM items
    WHERE 
        scrolleffect = :spell_id OR
        clickeffect = :spell_id OR
        proceffect = :spell_id OR
        focuseffect = :spell_id OR
        worneffect = :spell_id OR
        bardeffect = :spell_id
    ");

    $stmt->bindValue(':spell_id', $spellId, PDO::PARAM_INT);
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$items) {
        echo json_encode(['error' => 'No items found with this effect.']);
        exit;
    }

    // Include the CSS class for icons in the response
    foreach ($items as &$item) {
        $item['icon_class'] = "item-" . htmlspecialchars($item['icon']);
    }

    echo json_encode($items);
} catch (Exception $e) {
    echo json_encode(['error' => 'An error occurred: ' . $e->getMessage()]);
}
