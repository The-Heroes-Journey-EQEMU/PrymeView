<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include bitmask logic and database connection
include $_SERVER['DOCUMENT_ROOT'] . '/includes/bitmask_definitions.php';
include $_SERVER['DOCUMENT_ROOT'] . '/includes/db_connection.php';

$itemId = $_GET['id'] ?? null;
$embedMode = isset($_GET['embed']) && $_GET['embed'] === 'true';
$hoverMode = isset($_GET['hover']) && $_GET['hover'] === 'true';
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
        $stmt = $pdo->prepare("SELECT name, new_icon FROM spells_new WHERE id = :spellId");
        $stmt->bindParam(':spellId', $spellId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    return null;
}

// Process item data
if ($itemId) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM items WHERE ID = :id");
        $stmt->bindParam(':id', $itemId, PDO::PARAM_INT);
        $stmt->execute();
        $item = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($item) {
            // Custom naming conventions
            if (strpos($item['Name'], 'Apocryphal') === 0) {
                $item['Name'] = trim(str_replace('Apocryphal', '', $item['Name'])) . ' (Legendary)';
            } elseif (strpos($item['Name'], 'Rose Colored') === 0) {
                $item['Name'] = trim(str_replace('Rose Colored', '', $item['Name'])) . ' (Enchanted)';
            }

            // Decode bitmask values
            $item['slots'] = decodeSlots($item['slots']);
            $item['races'] = decodeRaces($item['races']);
            $item['classes'] = decodeClasses($item['classes']);
            $item['icon_path'] = $item['icon'] ? "/images/icons/{$item['icon']}.png" : "/images/icons/default_icon.png";

            // Fetch spell details
            $spells = [
                'Click' => $item['clickeffect'] ?? null,
                'Proc' => $item['proceffect'] ?? null,
                'Focus' => $item['focuseffect'] ?? null,
                'Worn' => $item['worneffect'] ?? null,
                'Scroll' => $item['scrolleffect'] ?? null,
                'Bard' => $item['bardeffect'] ?? null,
                'Combat' => $item['combateffect'] ?? null
            ];
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
                    SELECT nt.name AS npc_name, s2.zone, lde.chance AS drop_chance
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
                $item['npc_info'] = $npcs;
            }

            if ($item && $embedMode) {
                echo "
                <!DOCTYPE html>
                <html lang='en'>
                <head>
                    <meta charset='UTF-8'>
                    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                    <title>Item Details</title>
                    <link rel='stylesheet' href='/css/styles.css'>
                    <link rel='stylesheet' href='/sprites/item_icons.css'>
                    <link rel='stylesheet' href='/css/tooltip.css'>
                    <link rel='stylesheet' href='/css/expansion_enable.css'>
                    <link rel='stylesheet' href='/sprites/spell_icons/spell_icons_20.css'>
                    <link rel='stylesheet' href='/sprites/spell_icons/spell_icons_30.css'>
                    <link rel='stylesheet' href='/sprites/spell_icons/spell_icons_40.css'>
                    <link rel='stylesheet' href='/css/spell_search.css'>
                    <script src='/scripts/scripts.js' defer></script>
                    <script src='/scripts/itemDetails.js' defer></script>
                    <script src='/scripts/hoverTool.js' defer></script>
                    <script src='/scripts/focusEffects.js' defer></script>
                    <script src='/scripts/spellSearch.js' defer></script>
                    <style>
                        /* Hide buttons when in embed mode */
                        .embed-mode .button-container {
                            display: none;
                        }
                    </style>
                </head>
                <body class='embed-mode'>
                    <div id='details-container'>
                        <!-- The item details will be dynamically injected here -->
                    </div>
                    <div class='button-container'>
                        <button id='toggle-npc-info' class='toggle-npc-info'>&larr; View NPC Info</button>
                        <button id='upgrade-path-button' class='upgrade-path-button'>Upgrade Path</button>
                    </div>
                    <script>
                        // Load the item details dynamically using JavaScript
                        document.addEventListener('DOMContentLoaded', () => {
                            loadItemDetails(" . json_encode($itemId) . ");
                        });
                    </script>
                </body>
                </html>";
                exit;
            }
            
            

            // Default: Output JSON
            header('Content-Type: application/json');
            echo json_encode($item);
            exit;
        }
    } catch (PDOException $e) {
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
        exit;
    }
}

// Item not found
header('Content-Type: application/json');
echo json_encode(["error" => "Item not found"]);
exit;
