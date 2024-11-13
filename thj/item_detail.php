<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include bitmask logic
include $_SERVER['DOCUMENT_ROOT'] . '/thj/includes/bitmask_definitions.php';
include $_SERVER['DOCUMENT_ROOT'] . '/thj/includes/db_connection.php';

$itemId = $_GET['id'] ?? null;
$includeNpcInfo = isset($_GET['npc_info']) && $_GET['npc_info'] === 'true';

// Function to decode slots bitmask
function decodeSlots($bitmask) {
    global $slotBitmask;
    $slots = [];

    foreach ($slotBitmask as $slot) {
        if ($bitmask & $slot['bitmask']) {
            $slots[] = $slot['name'];
        }
    }

    return $slots;
}

// Function to decode races bitmask
function decodeRaces($bitmask) {
    global $raceMapping;
    $races = [];

    foreach ($raceMapping as $mask => $raceName) {
        if ($bitmask & $mask) {
            $races[] = $raceName;
        }
    }

    return $races;
}

// Function to decode classes bitmask
function decodeClasses($bitmask) {
    global $classMapping;
    $classes = [];

    foreach ($classMapping as $mask => $className) {
        if ($bitmask & $mask) {
            $classes[] = $className;
        }
    }

    return $classes;
}

// Function to get spell details (name, icon, and description) based on spell ID
function getSpellDetails($pdo, $spellId) {
    if ($spellId && $spellId != -1) {
        $stmt = $pdo->prepare("SELECT name, new_icon FROM spells_new WHERE id = :spellId"); // Fetch description too
        $stmt->bindParam(':spellId', $spellId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    return null;
}

if ($itemId) {
    try {
        // Fetch item details
        $stmt = $pdo->prepare("
            SELECT *
            FROM items 
            WHERE ID = :id
        ");
        $stmt->bindParam(':id', $itemId, PDO::PARAM_INT);
        $stmt->execute();
        $item = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($item) {
            // Handle custom naming conventions
            if (strpos($item['Name'], 'Apocryphal') === 0) {
                $item['Name'] = trim(str_replace('Apocryphal', '', $item['Name'])) . ' (Legendary)';
            } elseif (strpos($item['Name'], 'Rose Colored') === 0) {
                $item['Name'] = trim(str_replace('Rose Colored', '', $item['Name'])) . ' (Enchanted)';
            }

            // Decode the slots, races, and classes bitmask to get human-readable names
            $item['slots'] = decodeSlots($item['slots']);
            $item['races'] = decodeRaces($item['races']);
            $item['classes'] = decodeClasses($item['classes']);

            // Add full icon path for front-end use
            $item['icon_path'] = $item['icon'] ? "/thj/images/icons/{$item['icon']}.png" : "/thj/images/icons/default_icon.png";

            // Fetch spell details for item spells, with existence check to avoid warnings
            $spells = [
                'Click' => $item['clickeffect'] ?? null,
                'Proc' => $item['proceffect'] ?? null,
                'Focus' => $item['focuseffect'] ?? null,
                'Worn' => $item['worneffect'] ?? null,
                'Scroll' => $item['scrolleffect'] ?? null,
                'Bard' => $item['bardeffect'] ?? null,
                'Combat' => $item['combateffect'] ?? null // Added combateffect with existence check
            ];

            // Add spell details (name, icon) to the item response
            foreach ($spells as $spellType => $spellId) {
                if ($spellId && $spellId != -1) {
                    $spellDetails = getSpellDetails($pdo, $spellId);
                    if ($spellDetails) {
                        $item["{$spellType}_spell"] = $spellDetails;
                    }
                }
            }

            // Include NPC info if requested
            if ($includeNpcInfo) {
                $npcStmt = $pdo->prepare("
                    SELECT 
                        nt.name AS npc_name, 
                        s2.zone, 
                        lde.chance AS drop_chance
                    FROM lootdrop_entries lde
                    INNER JOIN lootdrop ld ON ld.id = lde.lootdrop_id
                    INNER JOIN loottable_entries lte ON lte.lootdrop_id = ld.id
                    INNER JOIN loottable lt ON lt.id = lte.loottable_id
                    INNER JOIN npc_types nt ON nt.loottable_id = lt.id
                    INNER JOIN spawnentry se ON se.npcid = nt.id
                    INNER JOIN spawn2 s2 ON s2.spawngroupid = se.spawngroupid
                    WHERE lde.item_id = :item_id
                    GROUP BY nt.name, s2.zone, lde.chance
                ");
                $npcStmt->bindParam(':item_id', $itemId, PDO::PARAM_INT);
                $npcStmt->execute();
                $npcs = $npcStmt->fetchAll(PDO::FETCH_ASSOC);

                // Attach NPC information to the item data, including drop chance
                $item['npc_info'] = $npcs;
            }


            // Output JSON response
            header('Content-Type: application/json');
            echo json_encode($item);
            exit;
        }
    } catch (PDOException $e) {
        // Handle SQL errors
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
        exit;
    }
}

// If item is not found
header('Content-Type: application/json');
echo json_encode(["error" => "Item not found"]);
exit;
