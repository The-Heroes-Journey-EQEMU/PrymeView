<?php

// Set Cache-Control header
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

// Include necessary files
include $_SERVER['DOCUMENT_ROOT'] . '/thj/includes/bitmask_definitions.php';
include $_SERVER['DOCUMENT_ROOT'] . '/thj/includes/races.php';
include $_SERVER['DOCUMENT_ROOT'] . '/thj/includes/classes.php';
include $_SERVER['DOCUMENT_ROOT'] . '/thj/includes/db_connection.php';
include $_SERVER['DOCUMENT_ROOT'] . '/thj/includes/focus_search_inc.php';

$itemId = $_GET['item_id'] ?? null; // Use 'item_id' to differentiate from form submissions

if ($itemId) {
    // If an item ID is provided, return its details for the tooltip
    try {
        $stmt = $pdo->prepare("SELECT * FROM items WHERE ID = :id");
        $stmt->bindParam(':id', $itemId, PDO::PARAM_INT);
        $stmt->execute();
        $item = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($item) {
            // Decode slots, races, and classes bitmask
            $item['slots'] = decodeSlots($item['slots']);
            $item['races'] = decodeRaces($item['races']);
            $item['classes'] = decodeClasses($item['classes']);

            // Add icon path for the front-end
            $item['icon_path'] = "/thj/sprites/item_icons.png#" . htmlspecialchars($item['icon']);

            // Send item data as JSON
            header('Content-Type: application/json');
            echo json_encode($item);
            exit;
        } else {
            // Item not found
            echo json_encode(["error" => "Item not found"]);
            exit;
        }
    } catch (PDOException $e) {
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
        exit;
    }
}

// If not a specific item request, proceed with search form handling
$searchResults = [];

// Slot pairs for reference
$slotPairs = [
    15 => 16, // Ring 1 <-> Ring 2
    16 => 15,
    1 => 4,   // Earring 1 <-> Earring 2
    4 => 1,
    9 => 10,  // Wrist 1 <-> Wrist 2
    10 => 9
];


// Get the filter values from the form
$statSelect = isset($_POST['stat_select']) ? $_POST['stat_select'] : '';
$statComparison = isset($_POST['stat_comparison']) ? $_POST['stat_comparison'] : '=';
$statValue = isset($_POST['stat_value']) ? $_POST['stat_value'] : '';
$modSelect = $_POST['mod_select'] ?? ''; // Define $modSelect with a default empty value if not set
$modComparison = $_POST['mod_comparison'] ?? '='; // Define $modComparison with a default comparison operator
$modValue = $_POST['mod_value'] ?? ''; // Define $modValue with a default empty value

$resistSelect = isset($_POST['resist_select']) ? $_POST['resist_select'] : '';
$resistComparison = isset($_POST['resist_comparison']) ? $_POST['resist_comparison'] : '=';
$resistValue = isset($_POST['resist_value']) ? $_POST['resist_value'] : '';
$heroicStatSelect = $_POST['heroic_stat_select'] ?? '';  // Assuming you want it to default to an empty string if not set
$heroicStatComparison = $_POST['heroic_stat_comparison'] ?? '=';
$heroicStatValue = $_POST['heroic_stat_value'] ?? '';

// Process the search
if (isset($_POST['search'])) {
    $searchTerm = isset($_POST['search_term']) ? '%' . trim($_POST['search_term']) . '%' : '';
    $selectedSlot = isset($_POST['slot']) ? intval($_POST['slot']) : null;
    $selectedRace = isset($_POST['race']) ? trim($_POST['race']) : '';
    $selectedClass = isset($_POST['class']) ? trim($_POST['class']) : '';
    $selectedItemType = isset($_POST['item_type']) ? intval($_POST['item_type']) : -1;
    $selectedFocusType = isset($_POST['focus_type']) ? intval($_POST['focus_type']) : null;
    $selectedFocusRank = isset($_POST['focus_rank']) ? intval($_POST['focus_rank']) : null;
    $augSearchEnabled = isset($_POST['enableAug']) ? $_POST['enableAug'] : false;

    $sql = "SELECT ID, 
        CASE 
            WHEN Name LIKE 'Apocryphal%' THEN REPLACE(Name, 'Apocryphal', 'Legendary')
            WHEN Name LIKE 'Rose Colored%' THEN REPLACE(Name, 'Rose Colored', 'Enchanted')
            ELSE Name
        END AS Name,
        ac, hp, mana, endur, icon, classes, focuseffect, clickeffect 
    FROM items 
    WHERE augtype = 0"; 
    
    $params = [];
        // Define valid comparison operators for safety
    $validComparisons = ['=', '>', '<', '>=', '<='];
    // Exclude legendary and enchanted items unless searching by focus effects
    $isFocusEffectSearch = $selectedFocusType && $selectedFocusRank;
    if (!$isFocusEffectSearch) {
        $sql .= " AND Name NOT LIKE 'Apocryphal%' AND Name NOT LIKE 'Rose Colored%' AND Name NOT LIKE '%Glamour-Stone'";
    }
    // Apply stat filter if selected
    if ($statSelect && $statValue !== '') {
        if (in_array($statComparison, $validComparisons)) {
            $sql .= " AND $statSelect $statComparison :statValue";
            $params[':statValue'] = $statValue;
        }
    }

    // Apply resist filter if selected
    if ($resistSelect && $resistValue !== '') {
        if (in_array($resistComparison, $validComparisons)) {
            $sql .= " AND $resistSelect $resistComparison :resistValue";
            $params[':resistValue'] = $resistValue;
        }
    }

    // Heroic stat filter
    if ($heroicStatSelect && $heroicStatValue !== '') {
        if (in_array($heroicStatComparison, $validComparisons)) {
            $sql .= " AND $heroicStatSelect $heroicStatComparison :heroicStatValue";
            $params[':heroicStatValue'] = $heroicStatValue;
        }
    }
    // Apply modification filter if selected
    if ($modSelect && $modValue !== '') {
        // Ensure the comparison operator is valid for safety
        $validComparisons = ['=', '>', '<'];
        if (in_array($modComparison, $validComparisons)) {
            $sql .= " AND $modSelect $modComparison :modValue";
            $params[':modValue'] = $modValue;
        }
    }
    // Add item type filter
    if ($selectedItemType >= 0) {
        $sql .= " AND itemtype = :itemType";
        $params[':itemType'] = $selectedItemType;
    }

    // Add name filter
    if (!empty($searchTerm)) {
        $sql .= " AND Name LIKE :searchTerm";
        $params[':searchTerm'] = $searchTerm;
    }

    // Calculate combined bitmask for primary and paired slots
    if ($selectedSlot !== null && isset($slotBitmask[$selectedSlot])) {
        $combinedBitmask = $slotBitmask[$selectedSlot]['bitmask'];

        // Check if paired slot exists and add its bitmask
        if (isset($slotPairs[$selectedSlot]) && isset($slotBitmask[$slotPairs[$selectedSlot]])) {
            $pairedSlot = $slotPairs[$selectedSlot];
            $combinedBitmask |= $slotBitmask[$pairedSlot]['bitmask'];
        }

        $sql .= " AND (slots & :combinedBitmask) > 0";
        $params[':combinedBitmask'] = $combinedBitmask;
    }
    // Add race filter
    if (!empty($selectedRace)) {
        $raceBitmask = getRaceBitmask($selectedRace);
        $sql .= " AND (races & :raceBitmask) > 0";
        $params[':raceBitmask'] = $raceBitmask;
    }

    // Add class filter
    if (!empty($selectedClass)) {
        $classBitmask = getClassBitmask($selectedClass);
        $sql .= " AND (classes & :classBitmask) > 0";
        $params[':classBitmask'] = $classBitmask;
    }

    // Determine focus or click effect based on selected focus type and rank
    $focusEffectFound = true; // Flag to track whether a valid focus effect was found
    if ($isFocusEffectSearch) {
        // Assign the correct effect array based on selected focus type
        if ($selectedFocusType == 1) { 
            $effectArray = $sympHealing;
        } elseif ($selectedFocusType == 2) { 
            $effectArray = $sympStrike;
        } elseif ($selectedFocusType == 3) { 
            $effectArray = $impDamage;
        } elseif ($selectedFocusType == 4) { 
            $effectArray = $impHealing;
        } elseif($selectedFocusType == 5) {
            $effectArray = $extEnhancement;
        } elseif($selectedFocusType == 6) {
            $effectArray = $enhancedMinion;
        } elseif($selectedFocusType == 7) {
            $effectArray = $burningAffliction;
        } elseif($selectedFocusType == 8) {
            $effectArray = $extendedRange;
        } elseif($selectedFocusType == 9) {
            $effectArray = $spellHaste;
        } elseif($selectedFocusType == 10) {
            $effectArray = $manaPres;
        }

        // Get the effect ID based on the selected rank
        if (isset($effectArray[$selectedFocusRank]['id'])) {
            $focusEffectId = $effectArray[$selectedFocusRank]['id'];

            // Determine if the focus effect should be in `clickeffect` or `focuseffect` column
            if ($selectedFocusType == 1 || $selectedFocusType == 2) {
                // Use clickeffect for Sympathetic Healing and Sympathetic Strike
                $sql .= " AND clickeffect = :focusEffectId";
            } else {
                // Use focuseffect for Improved Damage or Healing
                $sql .= " AND focuseffect = :focusEffectId";
            }
            $params[':focusEffectId'] = $focusEffectId;
        } else {
            // If no valid focus effect was found for the selected rank
            $focusEffectFound = false;
        }
    }

    // If no focus effect was found, return a "no items found" message early
    if ($isFocusEffectSearch && !$focusEffectFound) {
        echo json_encode(["error" => "No items match the selected focus effect."]);
        exit;
    }

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $searchResults = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
        exit;
    }
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Item Search</title>
    <link rel="stylesheet" href="/thj/css/styles.css">
    <link rel="stylesheet" href="/thj/sprites/item_icons.css">
    <link rel="stylesheet" href="/thj/css/itemSearch.css">
</head>
<body>
<div class="content-display">

    <div id="filterContainer">
        <div class="search-wrapper">
            
            <!-- Class Selection -->
            <div id="classSelection" action="item_search.php" class="class-selection" onsubmit="return false;">
                <?php foreach ($classes as $class): ?>
                    <div class="class-icon-container" data-class-name="<?php echo $class['fullName']; ?>" onclick="selectClass('<?php echo $class['fullName']; ?>', event)">
                        <div class="class-abbreviation"><?php echo $class['abbreviation']; ?></div>
                        <div class="class-icon item-<?php echo $class['image']; ?>" title="<?php echo $class['fullName']; ?>"></div>
                    </div>
                <?php endforeach; ?>
            </div>

            <!-- Race Selection -->
            <div id="raceSelection" class="race-selection">
                <?php foreach ($races as $race): ?>
                    <div class="race-icon-container" data-race-name="<?php echo $race['fullName']; ?>" onclick="selectRace('<?php echo $race['fullName']; ?>', event)">
                        <div class="race-abbreviation"><?php echo $race['abbreviation']; ?></div>
                        <div class="race-icon item-<?php echo $race['image']; ?>" title="<?php echo $race['fullName']; ?>"></div>
                    </div>
                <?php endforeach; ?>
            </div>

            <!-- Slot Selection -->
            <div id="slotSelection" class="slot-selection-container">
                <?php foreach ($slotBitmask as $slotNum => $slotInfo): ?>
                    <div class="slot-container">
                        <div class="slot-title"><?php echo htmlspecialchars($slotInfo['name']); ?></div>
                        <img src="/thj/images/slots/slot_<?php echo $slotNum; ?>.gif"
                            alt="<?php echo $slotInfo['name']; ?>"
                            class="slot-image"
                            data-slot-num="<?php echo $slotNum; ?>"
                            id="slot_<?php echo $slotNum; ?>">
                    </div>
                <?php endforeach; ?>
            </div>

            <div id="expansionSelection" class="expansion-selection">
                <?php
                $expansions = [
                    ['id' => 0, 'name' => 'Original', 'icon' => 'originalicon.gif'],
                    ['id' => 1, 'name' => 'Kunark', 'icon' => 'kunarkicon.gif'],
                    ['id' => 2, 'name' => 'Velious', 'icon' => 'veliousicon.gif'],
                    ['id' => 3, 'name' => 'Luclin', 'icon' => 'luclinicon.gif'],
                    ['id' => 4, 'name' => 'Planes of Power', 'icon' => 'powericon.gif'],
                    ['id' => 5, 'name' => 'LDON', 'icon' => 'ldonicon.gif'],
                    ['id' => 6, 'name' => 'LOY', 'icon' => 'ykeshaicon.gif'],
                    ['id' => 7, 'name' => 'Gates of Discord', 'icon' => 'gatesicon.gif'],
                    ['id' => 8, 'name' => 'Omens', 'icon' => 'omensicon.gif']
                ];

                foreach ($expansions as $expansion): ?>
                    <div class="expansion-icon-container expansion-<?php echo $expansion['id']; ?>" 
             data-expansion-id="<?php echo $expansion['id']; ?>" 
             onclick="selectExpansion('<?php echo $expansion['id']; ?>', event)">
            <img src="/thj/images/expansion_icons/<?php echo $expansion['icon']; ?>" 
                 alt="Expansion <?php echo $expansion['id']; ?>" 
                 class="expansion-icon" 
                 title="<?php echo $expansion['name']; ?>">
                 </div>
             <?php endforeach; ?>
            </div>
           
           </div>
       
                <!-- Focus Effect Search Toggle -->
                <div class="focus-effect-toggle">
                    <label for="enableFocus">Focus Effect:</label>
                    <input type="checkbox" id="enableFocus" onclick="toggleFocusEffect()">
                    <div class="item-type-toggle">
                        <label for="enableItemType">Item Type:</label>
                        <input type="checkbox" id="enableItemType" onclick="toggleItemType()">
                       
                            <!-- Stat Filter Toggle -->
                    <div id="statFilterToggle" class="filter-toggle">
                    <label for="statFilterToggle">Enable Stat Filters:</label>
                    <input type="checkbox" id="statFilter" name="stat_filter" onclick="toggleStatVisibility()">
                    </div>
                </div>
            </div>
           
            <!-- Focus Effect Dropdowns (initially hidden) -->
            <div id="focusEffectSelection" style="display: none;">
                <label for="focus_type">Choose Focus:</label>
                <select id="focus_type" name="focus_type" onchange="toggleRankList()">
                    <option value="">--Select Focus--</option>
                    <?php foreach ($focusType as $focusId => $focusName): ?>
                        <option value="<?php echo htmlspecialchars($focusId); ?>"><?php echo htmlspecialchars($focusName); ?></option>
                    <?php endforeach; ?>
                </select>

                <!-- General Rank Dropdown (for most focuses) -->
                <div id="focus_rank_normal_container" style="display: none;">
                    <label for="focus_rank_normal">Choose Rank:</label>
                    <select id="focus_rank_normal" name="focus_rank_normal">
                        <!-- Options will be populated by JavaScript based on selected focus type -->
                    </select>
                </div>

                <!-- Enhanced Minion Rank Dropdown -->
                <div id="focus_rank_enhanced_minion_container" style="display: none;">
                    <label for="focus_rank_enhanced_minion">Choose Enhanced Minion Rank:</label>
                    <select id="focus_rank_enhanced_minion" name="focus_rank_enhanced_minion">
                        <!-- Options will be populated by JavaScript for Enhanced Minion -->
                    </select>
                </div>
            </div>
                <!-- Stat Filters (Hidden by default) -->
                <div id="statFilters" class="stat-filters" style="display: none;">
                    <!-- Stat Filters (existing) -->
                    <div class="filter-option">
                        <label for="istat1">Stat:</label>
                        <div class="stat-filter-container">
                            <select id="istat1" name="stat_select">
                                <option value="">-</option>
                                <option value="hp">Hit Points</option>
                                <option value="mana">Mana</option>
                                <option value="ac">AC</option>
                                <option value="attack">Attack</option>
                                <option value="aagi">Agility</option>
                                <option value="acha">Charisma</option>
                                <option value="adex">Dexterity</option>
                                <option value="aint">Intelligence</option>
                                <option value="asta">Stamina</option>
                                <option value="astr">Strength</option>
                                <option value="awis">Wisdom</option>
                                <option value="damage">Damage</option>
                                <option value="delay">Delay</option>
                                <option value="ratio">Ratio</option>
                                <option value="haste">Haste</option>
                                <option value="regen">HP Regen</option>
                                <option value="manaregen">Mana Regen</option>
                                <option value="enduranceregen">Endurance Regen</option>
                            </select>

                            <select id="istatComparison" name="stat_comparison">
                            <option value="=">=</option>
                            <option value=">=">>=</option>
                            <option value="<="><=</option>
                            </select>

                            <input type="number" id="istatValue" name="stat_value" min="0">
                        </div>
                    </div>

                    <!-- Resist Filters (existing) -->
                    <div class="filter-option">
                        <label for="iresists">Resistance:</label>
                        <div class="stat-filter-container">
                            <select id="iresists" name="resist_select">
                                <option value="">-</option>
                                <option value="mr">Resist Magic</option>
                                <option value="fr">Resist Fire</option>
                                <option value="cr">Resist Cold</option>
                                <option value="pr">Resist Poison</option>
                                <option value="dr">Resist Disease</option>
                                <option value="svcorruption">Resist Corruption</option>
                            </select>

                            <select id="iresistsComparison" name="resist_comparison">
                            <option value="=">=</option>
                            <option value=">=">>=</option>
                            <option value="<="><=</option>
                            </select>

                            <input type="number" id="iresistsValue" name="resist_value" min="0">
                        </div>
                    </div>

                    <!-- Heroic Stats Filters (existing) -->
                    <div class="filter-option">
                        <label for="iheroics">Heroic Stat:</label>
                        <div class="stat-filter-container">
                            <select id="iheroics" name="heroic_stat_select">
                                <option value="">-</option>
                                <option value="heroic_agi">Heroic Agility</option>
                                <option value="heroic_cha">Heroic Charisma</option>
                                <option value="heroic_dex">Heroic Dexterity</option>
                                <option value="heroic_int">Heroic Intelligence</option>
                                <option value="heroic_sta">Heroic Stamina</option>
                                <option value="heroic_str">Heroic Strength</option>
                                <option value="heroic_wis">Heroic Wisdom</option>
                                <option value="heroic_mr">Heroic Resist Magic</option>
                                <option value="heroic_fr">Heroic Resist Fire</option>
                                <option value="heroic_cr">Heroic Resist Cold</option>
                                <option value="heroic_pr">Heroic Resist Poison</option>
                                <option value="heroic_dr">Heroic Resist Disease</option>
                                <option value="heroic_svcorrup">Heroic Resist Corruption</option>
                            </select>

                            <select id="iheroicsComparison" name="heroic_stat_comparison">
                            <option value="=">=</option>
                            <option value=">=">>=</option>
                            <option value="<="><=</option>
                            </select>

                            <input type="number" id="iheroicsValue" name="heroic_stat_value" min="0">
                        </div>
                    </div>

                    <!-- Modifications Filters -->
                    <div class="filter-option">
                        <label for="imod">Modifications:</label>
                        <div class="stat-filter-container">
                            <select id="imod" name="mod_select">
                                <option value="">-</option>
                                <option value="avoidance">Avoidance</option>
                                <option value="accuracy">Accuracy</option>
                                <option value="backstabdmg">Backstab Damage</option>
                                <option value="clairvoyance">Clairvoyance</option>
                                <option value="combateffects">Combat Effects</option>
                                <option value="damageshield">Damage Shield</option>
                                <option value="dsmitigation">Damage Shield Mit</option>
                                <option value="dotshielding">DoT Shielding</option>
                                <option value="extradmgamt">Extra Damage</option>
                                <option value="healamt">Heal Amount</option>
                                <option value="purity">Purity</option>
                                <option value="shielding">Shielding</option>
                                <option value="spelldmg">Spell Damage</option>
                                <option value="spellshield">Spell Shielding</option>
                                <option value="strikethrough">Strikethrough</option>
                                <option value="stunresist">Stun Resist</option>
                            </select>

                            <select id="imodComparison" name="mod_comparison">
                            <option value="=">=</option>
                            <option value=">=">>=</option>
                            <option value="<="><=</option>
                            </select>

                            <input type="number" id="imodValue" name="mod_value" min="0">
                        </div>
                    </div>
                </div>
                <!-- Item Type Dropdown (initially hidden) -->
                <div id="itemTypeSelection" style="display: none;">
                    <label for="item_type">Item Type:</label>
                    <select id="item_type" name="item_type" class="form-control">
                        <option value="-1">-- Select --</option>
                        <option value="0">0) 1HS</option>
                        <option value="1">1) 2HS</option>
                        <option value="2">2) Piercing</option>
                        <option value="3">3) 1HB</option>
                        <option value="4">4) 2HB</option>
                        <option value="5">5) Archery</option>
                        <option value="7">7) Throwing</option>
                        <option value="8">8) Shield</option>
                        <option value="10">10) Defense</option>
                        <option value="12">12) Lock Picking</option>
                        <option value="14">14) Food</option>
                        <option value="15">15) Drink</option>
                        <option value="19">19) Thrown Casting Items</option>
                        <option value="20">20) Spells / Song Sheets</option>
                        <option value="21">21) Potions</option>
                        <option value="22">22) Fletched Arrows</option>
                        <option value="23">23) Wind Instruments</option>
                        <option value="24">24) Stringed Instruments</option>
                        <option value="25">25) Brass Instruments</option>
                        <option value="26">26) Drum Instruments</option>
                        <option value="27">27) Ammo</option>
                        <option value="29">29) Jewelry Items</option>
                        <option value="35">35) 2H Pierce</option>
                        <option value="42">42) Poisons</option>
                        <option value="45">45) Hand to Hand</option>
                        <option value="54">54) Augments</option>
                        <option value="55">55) Augment Solvents</option>
                        <option value="56">56) Augment Distillers</option>
                        
                    </select>
                    </div>
            <!-- Search Form with Item Type Dropdown -->
            <div class="search-wrapper">
            <form id="searchForm" method="POST" class="search-form">
                    <input type="text" id="search" name="search_term" placeholder="Enter item name...">
                    <input type="hidden" id="selectedSlot" name="slot" value="">
                    <input type="hidden" id="selectedRace" name="race" value="">
                    <input type="hidden" id="selectedClass" name="class" value="">
                    <input type="hidden" id="selectedExpansion" name="expansion" value="">
                    <button type="submit" name="search">Search</button>
                </form>
            </div>

            <!-- Search Results Section -->
            <?php if (!empty($searchResults) || isset($_POST['search'])): ?>
                <h2>Search Results:</h2>
                <div class="results-wrapper">
    <table class="results-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>AC</th>
                <th>HP</th>
                <th>Mana</th>
                <th>Classes</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($searchResults as $item): ?>
                <tr class="item-row" data-id="<?php echo htmlspecialchars($item['ID']); ?>">
                    <td class="item-cell">
                        <div class="item-content">
                            <div class="item-icon item-<?php echo htmlspecialchars($item['icon']); ?> hover-image"></div> 
                            <span class="item-name"><?php echo htmlspecialchars($item['Name']); ?></span>
                        </div>
                    </td>
                    <td><?php echo htmlspecialchars($item['ac']); ?></td>
                    <td><?php echo htmlspecialchars($item['hp']); ?></td>
                    <td><?php echo htmlspecialchars($item['mana']); ?></td>
                    <td><?php echo htmlspecialchars(getClassAbbreviations($item['classes'])); ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
    <?php elseif (isset($_POST['search'])): ?>
        <h2>No results found.</h2>
        <?php endif; ?>
        </div>
    </div>
</div>

<script src="/thj/scripts/scripts.js"></script>

</body>
</html>


