<?php

$page_title = "Spell Search";
include $_SERVER['DOCUMENT_ROOT'] . '/thj/includes/db_connection.php';
include $_SERVER['DOCUMENT_ROOT'] . '/thj/includes/classes.php';
include $_SERVER['DOCUMENT_ROOT'] . '/thj/includes/spell_effects.php';
include $_SERVER['DOCUMENT_ROOT'] . '/thj/includes/spellTypes.php';

// Enable PHP error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Server-specific variables
$server_max_level = 70;
$max_items_returned = 100;

// Capture query parameters
$namestring = $_GET['name'] ?? '';
$level = $_GET['level'] ?? 0;
$types = isset($_GET['types']) ? explode(',', $_GET['types']) : [];

// Get columns based on selected classes
$class_columns = array_intersect_key($classColumnMapping, array_flip(array_slice($types, 0, 3)));
$selected_columns = array_values($class_columns);

// Display the form
echo '
<div class="spell-search" id="spell-search">
    <form id="spellSearchForm" action="spell_search.php" method="POST">
        <table class="spell-form-table">
            <tr>
                <td colspan="2">
                    <div id="spellClassSelection" class="spell-class-selection">';

foreach ($classColumnMapping as $classId => $classColumn) {
    if (isset($classes[$classId])) {
        $classInfo = $classes[$classId];
        echo '
            <div class="spell-class-icon-container" data-class-id="' . $classId . '" onclick="selectSpellClass(' . $classId . ', event)">
                <div class="spell-class-abbreviation">' . $classInfo['abbreviation'] . '</div>
                <div class="spell-class-icon item-' . $classInfo['image'] . '" title="' . $classInfo['fullName'] . '"></div>
            </div>';
    }
}

echo '
                    </div>
                    <input type="hidden" name="types" id="selectedSpellClasses" value="' . implode(",", $types) . '">
                </td>
            </tr>
            <tr>
                <td>
                    <select name="level" class="spell-custom-level-dropdown">
                        <option value="">Select Level</option>';

for ($i = 1; $i <= $server_max_level; $i++) {
    echo '<option value="' . $i . '"' . ($level == $i ? ' selected="selected"' : '') . '>' . $i . '</option>';
}

echo '          </select>
                </td>
            </tr>
            <tr>
                <td>
                    <input type="text" name="name" class="spell-search-input" size="40" value="' . htmlspecialchars($namestring) . '" />
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <button type="submit" class="spell-form-button">Search</button>
                    <a href="spell_search.php" class="spell-form-button">Reset</a>
                </td>
            </tr>
        </table>
    </form>
</div>';

// Execute the spell search if filters are provided
if ($namestring !== '' || $level != 0 || !empty($types)) {
    $sql = "SELECT *, LEAST(" . implode(", ", array_map(fn($col) => "GREATEST($col, 0)", $selected_columns)) . ") AS spell_level
            FROM spells_new
            WHERE 1=1";

    if (!empty($types)) {
        $class_conditions = [];
        foreach ($class_columns as $col) {
            $class_conditions[] = "$col <= :max_level AND $col != 255";
        }
        $sql .= " AND (" . implode(' OR ', $class_conditions) . ")";
    }

    if ($level != 0) {
        $sql .= " AND LEAST(" . implode(", ", array_map(fn($col) => "GREATEST($col, 0)", $selected_columns)) . ") <= :level";
    }

    if ($namestring) {
        $sql .= " AND name LIKE :name";
    }

    // Exclude specific spells by exact name
    $excluded_spells = [
        'Echo of Aegolism',
        'Echo of Experience',
        'Echo of Focus',
        'Echo of Koadic',
        'Echo of Selo',
        'Echo of the Brood',
        'Echo of the Grove'
    ];
    $placeholders = implode(',', array_map(fn($i) => ":excluded_$i", array_keys($excluded_spells)));
    $sql .= " AND name NOT IN ($placeholders)";

    $sql .= " GROUP BY name ORDER BY spell_level, name LIMIT :max_items";

    // Prepare and execute the query
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':max_level', $server_max_level, PDO::PARAM_INT);
    if ($level != 0) {
        $stmt->bindValue(':level', $level, PDO::PARAM_INT);
    }
    if ($namestring) {
        $stmt->bindValue(':name', '%' . $namestring . '%', PDO::PARAM_STR);
    }
    $stmt->bindValue(':max_items', $max_items_returned, PDO::PARAM_INT);

    // Bind excluded spell names
    foreach ($excluded_spells as $index => $spell_name) {
        $stmt->bindValue(":excluded_$index", $spell_name, PDO::PARAM_STR);
    }

    $stmt->execute();
    $spells = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($spells) {
        echo '<div class="spell-results-container">';
        echo '<table class="spell-results">';
        echo '<tr><th>Name & Icon</th><th>Classes</th><th>Effect(s)</th><th>Mana</th><th>Cast</th><th>Recast</th><th>Duration</th><th>Target</th></tr>';

        $currentLevel = -1;
        foreach ($spells as $spell) {
            $spellLevel = $spell['spell_level'];
            if ($spellLevel != $currentLevel) {
                $currentLevel = $spellLevel;
                echo "<tr><td colspan='8'><strong>Level $currentLevel Spells</strong></td></tr>";
            }

            $icon_class = "spell-" . $spell['new_icon'] . "-40";

            // Combine icon and name in the same cell with a click event to show modal
            $icon_and_name = '<span class="' . $icon_class . '" style="display: inline-block; height: 40px; width: 40px;"></span> ';
            $icon_and_name .= '<a href="javascript:void(0);" onclick="showSpellModal(' . $spell['id'] . ')">' . htmlspecialchars($spell['name']) . '</a>';

            // Display class icons for each selected class with level annotations
            $classIcons = '';
            foreach ($class_columns as $classCol) {
                if ($spell[$classCol] <= $server_max_level && $spell[$classCol] != 255) {
                    $classId = array_search($classCol, $classColumnMapping);
                    if ($classId && isset($classes[$classId])) {
                        $level_for_class = $spell[$classCol];
                        $classIcon = '<div class="spell-result-class-icon item-' . $classes[$classId]['image'] . '" title="' . $classes[$classId]['fullName'] . '">';
                        $classIcon .= '<span class="spell-class-level">' . $level_for_class . '</span>';
                        $classIcon .= '</div>';
                        $classIcons .= $classIcon;
                    }
                }
            }

            // Use displaySpellEffects to generate the effects description
            $effects = displaySpellEffects($spell, $dbspelleffects, $dbspelltargets, $dbraces, $server_max_level);

            echo '<tr>';
            echo '<td>' . $icon_and_name . '</td>';
            echo '<td>' . $classIcons . '</td>';
            echo '<td>' . $effects . '</td>';
            echo '<td>' . htmlspecialchars($spell['mana'] ?? 'N/A') . '</td>';
            echo '<td>' . htmlspecialchars($spell['cast_time'] ?? 'N/A') . '</td>';
            echo '<td>' . htmlspecialchars($spell['recast_time'] ?? 'N/A') . '</td>';
            echo '<td>' . htmlspecialchars($spell['duration'] ?? 'N/A') . '</td>';
            echo '<td>' . htmlspecialchars($spell['target_type'] ?? 'N/A') . '</td>';
            echo '</tr>';
        }
        echo '</table>';
        echo '</div>';
    } else {
        echo '<p>No results found.</p>';
    }
}
?>

<div id="spellModal" class="modal" style="display: none;">
    <div class="modal-content">
        <span class="modal-close" onclick="closeModal()">&times;</span>
        <div id="spellModalContent">Loading...</div>
    </div>
</div>