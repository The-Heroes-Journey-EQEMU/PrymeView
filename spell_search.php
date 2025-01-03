<?php

$page_title = "Spell Search";
include $_SERVER['DOCUMENT_ROOT'] . '/includes/db_connection.php';
include $_SERVER['DOCUMENT_ROOT'] . '/includes/classes.php';
include $_SERVER['DOCUMENT_ROOT'] . '/includes/spell_effects.php';
include $_SERVER['DOCUMENT_ROOT'] . '/includes/spellTypes.php';
include $_SERVER['DOCUMENT_ROOT'] . '/includes/spell_skills_races_targets.php';

// Enable PHP error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Server-specific variables
$server_max_level = 70;

// Capture query parameters
$namestring = $_GET['name'] ?? '';
$level = $_GET['level'] ?? '';
$level_filter = $_GET['level_filter'] ?? 'only';
$types = isset($_GET['types']) ? explode(',', $_GET['types']) : [];

// Map class columns for the selected classes
$class_columns = array_intersect_key($classColumnMapping, array_flip($types));
$selected_columns = array_values($class_columns);

// Calculate `min_level_expr` dynamically for level and class filtering
$min_level_expr = !empty($selected_columns)
    ? (count($selected_columns) === 1 ? $selected_columns[0] : "LEAST(" . implode(", ", $selected_columns) . ")")
    : "LEAST(" . implode(", ", array_map(fn($col) => "NULLIF($col, 255)", array_values($classColumnMapping))) . ")";

// Display the form
?>
<div class="spell-search" id="spell-search">
    <form id="spellSearchForm" action="spell_search.php" method="GET">
        <table class="spell-form-table">
            <tr>
                <td colspan="2">
                    <div id="spellClassSelection" class="spell-class-selection">
                        <?php foreach ($classColumnMapping as $classId => $classColumn): ?>
                            <?php if (isset($classes[$classId])): ?>
                                <?php $classInfo = $classes[$classId]; ?>
                                <div class="spell-class-icon-container" data-class-id="<?= $classId ?>" onclick="selectSpellClass(<?= $classId ?>, event)">
                                    <div class="spell-class-abbreviation"><?= $classInfo['abbreviation'] ?></div>
                                    <div class="spell-class-icon item-<?= $classInfo['image'] ?>" title="<?= $classInfo['fullName'] ?>"></div>
                                </div>
                            <?php endif; ?>
                        <?php endforeach; ?>
                    </div>
                    <input type="hidden" name="types" id="selectedSpellClasses" value="<?= implode(",", $types) ?>">
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <div class="level-container">
                        <select name="level" class="spell-custom-level-dropdown">
                            <option value="">Select Level</option>
                            <?php for ($i = 1; $i <= $server_max_level; $i++): ?>
                                <option value="<?= $i ?>" <?= ($level == $i) ? 'selected' : '' ?>><?= $i ?></option>
                            <?php endfor; ?>
                        </select>
                        <select name="level_filter" class="spell-custom-level-filter">
                            <option value="only" <?= ($level_filter === 'only') ? 'selected' : '' ?>>Only</option>
                            <option value="and_higher" <?= ($level_filter === 'and_higher') ? 'selected' : '' ?>>And Higher</option>
                            <option value="and_lower" <?= ($level_filter === 'and_lower') ? 'selected' : '' ?>>And Lower</option>
                        </select>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <input type="text" name="name" class="spell-search-input" size="40" value="<?= htmlspecialchars($namestring) ?>" />
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
</div>

<?php
// Only execute the search if at least one filter is provided
if (!empty($namestring) || !empty($level) || !empty($types)) {
    // Start the base query
    $sql = "SELECT *, {$min_level_expr} AS min_level FROM spells_new WHERE 1=1";
    $params = [];

    // Add name filter (term search)
    if (!empty($namestring)) {
        $sql .= " AND name LIKE :name";
        $params[':name'] = '%' . $namestring . '%';
    }

    // Add class-based filtering if classes are selected
    if (!empty($selected_columns)) {
        $class_conditions = [];
        foreach ($selected_columns as $col) {
            $class_conditions[] = "$col <= :server_max_level AND $col != 255";
        }
        $sql .= " AND (" . implode(' OR ', $class_conditions) . ")";
        $params[':server_max_level'] = $server_max_level;
    }

    // Add level filter if a level is specified
    if (!empty($level)) {
        if ($level_filter === 'only') {
            $sql .= " AND {$min_level_expr} = :level";
        } elseif ($level_filter === 'and_higher') {
            $sql .= " AND {$min_level_expr} >= :level";
        } elseif ($level_filter === 'and_lower') {
            $sql .= " AND {$min_level_expr} <= :level";
        }
        $params[':level'] = $level;
    }

    // Exclude spells with levels > 70 across all classes
    $class_level_conditions = [];
    foreach ($classColumnMapping as $col) {
        $class_level_conditions[] = "$col <= :server_max_level AND $col != 255";
    }
    $sql .= " AND (" . implode(' OR ', $class_level_conditions) . ")";
    $params[':server_max_level'] = $server_max_level;

    // Exclude specific spells by name
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
    foreach ($excluded_spells as $index => $spell_name) {
        $params[":excluded_$index"] = $spell_name;
    }

    // Add grouping and ordering
    $sql .= " GROUP BY name ORDER BY min_level, name";

    // Execute the query
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $spells = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Render results
    if ($spells) {
        echo '<div class="spell-results-container">';
        echo '<table class="spell-results">';
        echo '<tr><th>Name & Icon</th><th>Classes</th><th>Effects</th><th>Mana</th><th>Skill</th><th>Target</th></tr>';

        $currentLevel = -1;
        foreach ($spells as $spell) {
            $spellLevel = $spell['min_level'];
            if ($spellLevel != $currentLevel) {
                $currentLevel = $spellLevel;
                echo "<tr><td colspan='6'><strong>Level $currentLevel Spells</strong></td></tr>";
            }

            $icon_class = "spell-" . $spell['new_icon'] . "-40";
            $icon_and_name = '<span class="' . $icon_class . '" style="display: inline-block; height: 40px; width: 40px;"></span> ';
            $icon_and_name .= htmlspecialchars($spell['name']);

            $classIcons = '';
            foreach ($classColumnMapping as $col) {
                if ($spell[$col] <= $server_max_level && $spell[$col] != 255) {
                    $classId = array_search($col, $classColumnMapping);
                    if ($classId && isset($classes[$classId])) {
                        $level_for_class = $spell[$col];
                        $classIcon = '<div class="spell-result-class-icon item-' . $classes[$classId]['image'] . '" title="' . $classes[$classId]['fullName'] . '">';
                        $classIcon .= '<span class="spell-class-level">' . $level_for_class . '</span>';
                        $classIcon .= '</div>';
                        $classIcons .= $classIcon;
                    }
                }
            }

            $effects = displaySpellEffects($spell, $dbspelleffects, $dbspelltargets, $dbraces, $server_max_level);
            $skill = $dbskills[$spell['skill']] ?? 'Unknown Skill';
            $target = $dbspelltargets[$spell['targettype']] ?? 'Unknown Target';

            echo '<tr class="spell-row" data-id="' . $spell['id'] . '" onclick="showSpellDetails(' . $spell['id'] . ')">';
            echo '<td>' . $icon_and_name . '</td>';
            echo '<td>' . $classIcons . '</td>';
            echo '<td>' . $effects . '</td>';
            echo '<td>' . htmlspecialchars($spell['mana'] ?? 'N/A') . '</td>';
            echo '<td>' . htmlspecialchars($skill) . '</td>';
            echo '<td>' . htmlspecialchars($target) . '</td>';
            echo '</tr>';
        }
        echo '</table>';
        echo '</div>';
    } else {
        echo '<p>No results found. Please refine your search.</p>';
    }
} else {
    echo '<p>Use the search form above to find spells.</p>';
}
?>

<div id="spellDetailPanel" class="spell-detail-panel">
    <!-- Spell details will be dynamically loaded here -->
</div>
