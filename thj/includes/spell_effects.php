<?php
// spell_effects.php

include $_SERVER['DOCUMENT_ROOT'] . '/thj/includes/db_connection.php';

// Calculate spell effect value
function CalcSpellEffectValue($formula, $base_value, $max, $level) {
    return $base_value; // Adjust this according to actual formula requirements
}

// Function to generate HTML for spell effects based on effect IDs and provided cases
function displaySpellEffects($spell, $dbspelleffects, $dbspelltargets, $dbiracenames, $server_max_level) {
    $print_buffer = '<ul>';

    for ($n = 1; $n <= 12; $n++) {
        if ($spell["effectid$n"] != 254 && $spell["effectid$n"] != 10) {
            $maxlvl = $spell["effect_base_value$n"];
            $minlvl = $server_max_level;

            for ($i = 1; $i <= 16; $i++) {
                if ($spell["classes$i"] < $minlvl) {
                    $minlvl = $spell["classes$i"];
                }
            }

            $min = CalcSpellEffectValue($spell["formula$n"], $spell["effect_base_value$n"], $spell["max$n"], $minlvl);
            $max = CalcSpellEffectValue($spell["formula$n"], $spell["effect_base_value$n"], $spell["max$n"], $server_max_level);
            $effect_limit = $spell["max$n"];

            if ($min < $max && $max < 0) {
                $temp = $min;
                $min = $max;
                $max = $temp;
            }

            $effect_placeholder = "Effect details unavailable";
            $print_buffer .= "<li><b>Effect $n: </b>";

            switch ($spell["effectid$n"]) {
                case 3:
                    $print_buffer .= ($max < 0) ? "Decrease Movement" : "Increase Movement";
                    $print_buffer .= " by " . ($min != $max ? "$min% to $max%" : "$max%") . " (Max: $effect_limit)";
                    break;

                case 11:
                    $print_buffer .= ($max < 100) ? "Decrease Attack Speed" : "Increase Attack Speed";
                    $print_buffer .= " by " . ($min != $max ? abs(100 - $min) . "% to " . abs(100 - $max) . "%" : abs(100 - $max) . "%") . " (Max: $effect_limit)";
                    break;

                case 32: // Summon Item effect
                    $item_id = $spell["effect_base_value$n"];
                    $item_data = getItemData($item_id);
                    
                    if ($item_data) {
                        $item_name = htmlspecialchars($item_data['name']);
                        $item_class = "item-" . htmlspecialchars($item_data['icon']);
                        
                        $print_buffer .= "
                            Summon Item: 
                            <div class='$item_class hover-image spell-item' 
                                 style='height: 40px; width: 40px; display: inline-block; background-image: url(/thj/sprites/item_icons.png);' 
                                 title='$item_name' 
                                 data-item-id='$item_id'></div>
                            <a href='#' onclick='showSpellModal($item_id); return false;' data-item-id='$item_id'>$item_name</a>
                        ";
                    } else {
                        $print_buffer .= "Summon Item: Unknown Item (ID: $item_id)";
                    }
                    break;

                case 21:
                    $print_buffer .= $dbspelleffects[$spell["effectid$n"]] ?? $effect_placeholder;
                    $print_buffer .= " (" . ($min / 1000) . " sec to " . ($max / 1000) . " sec) (Max: $effect_limit)";
                    break;

                default:
                    $effect_name = $dbspelleffects[$spell["effectid$n"]] ?? $effect_placeholder;
                    $print_buffer .= $effect_name;
                    $print_buffer .= ($min != $max ? " by $min to $max" : " by $max") . " (Max: $effect_limit)";
                    break;
            }

            $print_buffer .= "</li>";
        }
    }

    $print_buffer .= '</ul>';
    return $print_buffer;
}

function getItemData($item_id) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT name, icon FROM items WHERE id = :item_id");
    $stmt->bindValue(':item_id', $item_id, PDO::PARAM_INT);
    $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($item) {
        // Check if icon file exists, use default if not
        $icon_path = "/thj/images/icons/{$item['icon']}.png";
        if (!file_exists($_SERVER['DOCUMENT_ROOT'] . $icon_path)) {
            $icon_path = "/thj/images/icons/default.png"; // Default icon
        }
        $item['icon_path'] = $icon_path;
        $item['description'] = "Description text goes here";
    }

    return $item;
}

?>
