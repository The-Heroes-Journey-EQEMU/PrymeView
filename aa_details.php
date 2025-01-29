<?php
include $_SERVER['DOCUMENT_ROOT'] . '/includes/db_connection.php';
include $_SERVER['DOCUMENT_ROOT'] . '/includes/aa_dbstr_inc.php';
include $_SERVER['DOCUMENT_ROOT'] . '/includes/aa_effects_inc.php';
include $_SERVER['DOCUMENT_ROOT'] . '/includes/aa_spell_effects.php';
include $_SERVER['DOCUMENT_ROOT'] . '/includes/spellTypes.php';
include $_SERVER['DOCUMENT_ROOT'] . '/includes/spell_skills_races_targets.php';

$aaId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if (!$aaId) {
    echo '<p>Error: Invalid AA ID.</p>';
    exit;
}

try {
    // Fetch the original ID from the aa_ability table
    $aaAbilityStmt = $pdo->prepare("
        SELECT id 
        FROM aa_ability 
        WHERE id = :aaid
        LIMIT 1
    ");
    $aaAbilityStmt->bindValue(':aaid', $aaId, PDO::PARAM_INT);
    $aaAbilityStmt->execute();
    $originalAAId = $aaAbilityStmt->fetchColumn();

    if (!$originalAAId) {
        echo '<p>Error: No original AA ID found for this AA.</p>';
        exit;
    }

    $query = "
    WITH RECURSIVE rank_chain AS (
        SELECT 
            ar.*, 
            aa.enabled AS is_enabled, 
            NULL AS expansion_disabled
        FROM 
            aa_ranks ar
        INNER JOIN 
            aa_ability aa ON ar.id = aa.first_rank_id
        WHERE 
            aa.id = :aaid
            AND aa.enabled = 1

        UNION ALL

        SELECT 
            ar.*, 
            NULL AS is_enabled, 
            CASE WHEN ar.expansion = 99999999 THEN 1 ELSE 0 END AS expansion_disabled
        FROM 
            aa_ranks ar
        INNER JOIN 
            rank_chain rc ON ar.id = rc.next_id
        WHERE 
            ar.expansion != 99999999
    )
    SELECT 
        rc.id AS rank_id, 
        rc.cost, 
        rc.expansion,
        rc.desc_sid,
        rc.spell, 
        rc.recast_time, 
        ae.slot,
        ae.effect_id,
        ae.base1
    FROM 
        rank_chain rc
    LEFT JOIN 
        aa_rank_effects ae ON rc.id = ae.rank_id
    WHERE 
        rc.is_enabled = 1 OR rc.expansion_disabled = 0;
    ";

    $stmt = $pdo->prepare($query);
    $stmt->bindValue(':aaid', $aaId, PDO::PARAM_INT);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($results) {
        $descriptionDisplayed = false;
        $ranksGrouped = [];
        $totalAACost = 0; // Initialize total AA cost

        foreach ($results as $row) {
            $rankId = $row['rank_id'];

            if (!$descriptionDisplayed) {
                $descSid = intval($row['desc_sid']);
                $title = $aa_description[$descSid]['Title'] ?? 'Unknown Title';
                $description = $aa_description[$descSid]['Description'] ?? 'No description available.';

                echo '<div class="aa-details-container">'; // Unified container
                echo '<div class="aa-header">';
                echo "<h2>{$title}</h2>";
                echo "<p>{$description}</p>";
                echo '</div>';

                // Display the Activate Command Section only if a valid spell exists
                if (isset($row['spell']) && $row['spell'] >= 0) {
                    echo '<div class="activate-command">';
                    echo "<h3>Activate Command:</h3>";
                    echo "<p onclick='copyAACommandToClipboard(this)' class='copy-command' title='Click to copy' style='cursor: pointer; color: #4CAF50; font-weight: bold; text-decoration: underline;'>/alt activate {$originalAAId}</p>";
                    echo '</div>';
                }

                $descriptionDisplayed = true;
            }

            if (!isset($ranksGrouped[$rankId])) {
                $ranksGrouped[$rankId] = [
                    'cost' => htmlspecialchars($row['cost'], ENT_QUOTES, 'UTF-8'),
                    'expansion' => htmlspecialchars($row['expansion'], ENT_QUOTES, 'UTF-8'),
                    'spell' => ($row['spell'] >= 0) ? intval($row['spell']) : null,
                    'recast_time' => intval($row['recast_time']),
                    'effects' => []
                ];
                $totalAACost += intval($row['cost']); // Add rank cost to total
            }
            if ($row['effect_id']) {
                $effectName = $aa_effects[intval($row['effect_id'])] ?? "Unknown Effect";

                $ranksGrouped[$rankId]['effects'][] = [
                    'slot' => htmlspecialchars($row['slot'], ENT_QUOTES, 'UTF-8'),
                    'effect' => htmlspecialchars($effectName, ENT_QUOTES, 'UTF-8'),
                    'base1' => htmlspecialchars($row['base1'], ENT_QUOTES, 'UTF-8')
                ];
            }
        }

        // Get the total number of ranks
        $totalRanks = count($ranksGrouped);

        // Dropdown for ranks
        echo '<div class="dropdown-header" onclick="toggleDropdown(this)">';
        echo "<span class='arrow'>▶</span> <strong>Total Ranks: {$totalRanks}, Total AA Cost: {$totalAACost} AA</strong>";
        echo '</div>';

        echo '<div class="dropdown-content" style="display: none;">';
        echo '<ul class="aa-rank-list">';

        $rankCounter = 1;
        foreach ($ranksGrouped as $rankId => $rank) {
            echo "<li>";
            echo "<strong>Rank {$rankCounter} (ID {$rankId})</strong>: Costs {$rank['cost']} AA";
            echo ", Recast Time: {$rank['recast_time']} seconds<br>";

            if ($rank['spell']) {
                $spellId = $rank['spell'];
                $spellStmt = $pdo->prepare("
                    SELECT 
                        id, 
                        name,  
                        cast_on_you, 
                        cast_on_other, 
                        mana, 
                        `range`, 
                        targettype, 
                        resisttype, 
                        effectid1, effect_base_value1, max1, formula1,
                        effectid2, effect_base_value2, max2, formula2,
                        effectid3, effect_base_value3, max3, formula3,
                        effectid4, effect_base_value4, max4, formula4,
                        effectid5, effect_base_value5, max5, formula5,
                        effectid6, effect_base_value6, max6, formula6,
                        effectid7, effect_base_value7, max7, formula7,
                        effectid8, effect_base_value8, max8, formula8,
                        effectid9, effect_base_value9, max9, formula9,
                        effectid10, effect_base_value10, max10, formula10,
                        effectid11, effect_base_value11, max11, formula11,
                        effectid12, effect_base_value12, max12, formula12
                    FROM spells_new 
                    WHERE id = :id
                ");
                $spellStmt->bindValue(':id', $spellId, PDO::PARAM_INT);
                $spellStmt->execute();
                $spell = $spellStmt->fetch(PDO::FETCH_ASSOC);

                if ($spell) {
                    $targetType = $dbspelltargets[$spell['targettype']] ?? 'Unknown Target';
                    $resistType = $dbspellresists[$spell['resisttype']] ?? 'None';

                    echo "<div class='spell-details'>";
                    echo "<strong>Spell Details (ID: {$spell['id']}):</strong><br>";
                    echo "<p>Name: {$spell['name']}</p>";
                    echo "<p>Cast on You: {$spell['cast_on_you']}</p>";
                    echo "<p>Cast on Other: {$spell['cast_on_other']}</p>";
                    echo "<p>Mana: {$spell['mana']}</p>";
                    echo "<p>Range: {$spell['range']}</p>";
                    echo "<p>Target: {$targetType}</p>";
                    echo "<p>Resist Type: {$resistType}</p>";
                    echo "<p><strong>Effects:</strong></p>";
                    echo displayAASpellEffects($spell, $dbspelleffects, $dbspelltargets, $dbraces);
                    echo "</div>";
                } else {
                    echo "<p>No spell details available for Spell ID {$spellId}.</p>";
                }
            }

            if (!empty($rank['effects'])) {
                echo "<ul>";
                foreach ($rank['effects'] as $effect) {
                    echo "<li>";
                    echo "Effect: {$effect['effect']} {$effect['base1']}";
                    echo "</li>";
                }
                echo "</ul>";
            }
            echo "</li>";
            $rankCounter++;
        }
        echo '</ul>';
        echo '</div>'; // End of dropdown-content
        echo '</div>'; // End of unified container
    } else {
        echo '<p>No ranks or effects found for this AA.</p>';
    }
} catch (PDOException $e) {
    error_log("Error fetching AA details: " . $e->getMessage());
    echo '<p>Error fetching details. Please try again later.</p>';
}
?>


<!-- Toast Notification -->
<div id="toast-container" style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 9999; display: none;">
    <div id="toast-message" style="background-color: #333; color: #fff; padding: 10px 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
        Copied to clipboard!
    </div>
</div>
