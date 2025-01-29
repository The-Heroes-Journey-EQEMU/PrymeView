<?php
// aa_spell_effects.php

include $_SERVER['DOCUMENT_ROOT'] . '/includes/db_connection.php';

// Calculate spell effect value
function CalcSpellEffectValue($formula, $base_value, $max, $level) {
    return $base_value; // Adjust this according to actual formula requirements
}

// Function to generate HTML for AA spell effects based on effect IDs
function displayAASpellEffects($spell, $dbspelleffects, $dbspelltargets, $dbraces) {
    global $pdo;
    $print_buffer = '<ul>';

    for ($n = 1; $n <= 12; $n++) {
        if ($spell["effectid$n"] != 254 && $spell["effectid$n"] != 10) {
            $min = CalcSpellEffectValue($spell["formula$n"], $spell["effect_base_value$n"], $spell["max$n"], $spell["effect_base_value$n"]);
            $max = CalcSpellEffectValue($spell["formula$n"], $spell["effect_base_value$n"], $spell["max$n"], $spell["effect_base_value$n"]);
            $effect_limit = $spell["max$n"] ?? 0;

            if ($min < $max && $max < 0) {
                $temp = $min;
                $min = $max;
                $max = $temp;
            }

            $effect_placeholder = "Effect details unavailable";
            $print_buffer .= "<li><b>Effect $n: </b>";

            switch ($spell["effectid$n"]) {

                case 85: // Proc name
                case 289: // Improved spell effect
                case 323: // Defensive proc
                    $print_buffer .= $dbspelleffects[$spell["effectid$n"]] ?? $effect_placeholder;

                    $stmt = $pdo->prepare("SELECT name FROM spells_new WHERE id = :spellid");
                    $stmt->bindValue(':spellid', $spell["effect_base_value$n"], PDO::PARAM_INT);
$stmt->execute();
$spell_name = $stmt->fetchColumn();

if ($spell_name) {
    $print_buffer .= "<a href='/a=spell&id=" . htmlspecialchars($spell["effect_base_value$n"]) . "'>" . htmlspecialchars($spell_name) . "</a>";
    } else {
                        $print_buffer .= " : Unknown Spell (ID: " . htmlspecialchars($spell["effect_base_value$n"]) . ")";
                    }
                    break;

                case 32: // Summon Item effect
                    $item_id = $spell["effect_base_value$n"];
                    $item_data = getItemData($item_id);

                    if ($item_data) {
                        $item_name = htmlspecialchars($item_data['name']);
                        $icon_class = "item-" . htmlspecialchars($item_data['icon']);

                        $print_buffer .= "
                            <li class='item-row'>
                                <div class='item-content'>
                                    <div class='$icon_class hover-image' 
                                         style='display: inline-block; height: 40px; width: 40px;' 
                                         data-item-id='$item_id' 
                                         title='$item_name'>
                                    </div>
                                    <span class='item-name'>$item_name</span>
                                </div>
                            </li>
                        ";
} else {
    $print_buffer .= "Summon Item: Unknown Item (ID: $item_id)";
                    }
                    break;

                case 3: // Increase/Decrease Movement
                    if ($max < 0) {
                        $print_buffer .= "Decrease Movement by " . ($min != $max ? abs($min) . "% to " . abs($max) . "%" : abs($max) . "%");
                    } else {
                        $print_buffer .= "Increase Movement by " . ($min != $max ? "$min% to $max%" : "$max%");
                    }
                    break;

                case 11: // Attack Speed Modification
                    if ($max < 100) {
                        $print_buffer .= "Decrease Attack Speed by " . ($min != $max ? abs(100 - $min) . "% to " . abs(100 - $max) . "%" : abs(100 - $max) . "%");
                    } else {
                        $print_buffer .= "Increase Attack Speed by " . ($min != $max ? ($min - 100) . "% to " . ($max - 100) . "%" : ($max - 100) . "%");
                    }
                    break;

                case 21: // Stun
                    $print_buffer .= $dbspelleffects[$spell["effectid$n"]] ?? $effect_placeholder;
                    $print_buffer .= " (" . ($min / 1000) . " sec to " . ($max / 1000) . " sec) (Max: $effect_limit)";
                    break;


                    case 87: // Increase Magnification
                    case 98: // Increase Haste v2
                    case 114: // Increase Agro Multiplier
                    case 119: // Increase Haste v3
                    case 123: // Increase Spell Damage
                    case 124: // Increase Spell Damage
                    case 125: // Increase Spell Healing
                    case 127: // Increase Spell Haste
                    case 128: // Increase Spell Duration
                    case 129: // Increase Spell Range
                    case 130: // Decrease Spell/Bash Hate
                    case 131: // Decrease Chance of Using Reagent
                    case 132: // Decrease Spell Mana Cost
                    case 158: // Increase Chance to Reflect Spell
                    case 168: // Increase Melee Mitigation
                    case 169: // Increase Chance to Critical Hit
                    case 172: // Increase Chance to Avoid Melee
                    case 173: // Increase Chance to Riposte
                    case 174: // Increase Chance to Dodge
                    case 175: // Increase Chance to Parry
                    case 176: // Increase Chance to Dual Wield
                    case 177: // Increase Chance to Double Attack
                    case 180: // Increase Chance to Resist Spell
                    case 181: // Increase Chance to Resist Fear Spell
                    case 183: // Increase All Skills Skill Check
                    case 184: // Increase Chance to Hit With all Skills
                    case 185: // Increase All Skills Damage Modifier
                    case 186: // Increase All Skills Minimum Damage Modifier
                    case 188: // Increase Chance to Block
                    case 200: // Increase Proc Modifier
                    case 201: // Increase Range Proc Modifier
                    case 216: // Increase Accuracy
                    case 227: // Reduce Skill Timer
                    case 266: // Add Attack Chance
                    case 273: // Increase Critical Dot Chance
                    case 294: // Increase Critical Spell Chance
                    $print_buffer .= $dbspelleffects[$spell["effectid$n"]] ?? $effect_placeholder;
                    $print_buffer .= ($min != $max ? " by $min% to $max%" : " by $max%");
                    break;

                case 15: // Mana Regeneration
                case 100: // Hitpoints Regeneration
                    $print_buffer .= $dbspelleffects[$spell["effectid$n"]] ?? $effect_placeholder;
                    $print_buffer .= " by " . abs($min) . " to " . abs($max) . " per tick (total " . abs($min * $effect_limit) . " to " . abs($max * $effect_limit) . ")";
                    break;

                case 33: // Summon Pet
                case 68: // Summon Skeleton Pet:
                case 106: // Summon Warder
                case 108: // Summon Familiar
                case 113: // Summon Horse
                case 152: // Summon Pets
                case 83: // Teleport / ports
                    $print_buffer .= $dbspelleffects[$spell["effectid$n"]] ?? $effect_placeholder;
                    $print_buffer .= " <a href=?a=pet&name=" . $spell["teleport_zone"] . ">" . $spell["teleport_zone"] . "</a>";
                    break;

                case 81: // Resurrect
                    $print_buffer .= $dbspelleffects[$spell["effectid$n"]] ?? $effect_placeholder;
                    $print_buffer .= " and restore " . $spell["effect_base_value$n"] . "% experience";
                    break;

                case 13: // See Invisible
                case 18: // Pacify
                case 20: // Blindness
                case 25: // Bind Affinity
                case 26: // Gate
                case 28: // Invisibility versus Undead
                case 29: // Invisibility versus Animals
                case 40: // Invunerability
                case 41: // Destroy Target
                case 42: // Shadowstep
                case 44: // Lycanthropy
                case 52: // Sense Undead
                case 53: // Sense Summoned
                case 54: // Sense Animals
                case 56: // True North
                case 57: // Levitate
                case 61: // Identify
                case 64: // SpinStun
                case 65: // Infravision
                case 66: // UltraVision
                case 67: // Eye of Zomm
                case 68: // Reclaim Energy
                case 73: // Bind Sight
                case 74: // Feign Death
                case 75: // Voice Graft
                case 76: // Sentinel
                case 77: // Locate Corpse
                case 82: // Summon PC
                case 90: // Cloak
                case 93: // Stop Rain
                case 94: // Make Fragile (Delete if combat)
                case 95: // Sacrifice
                case 96: // Silence
                case 99: // Root
                case 101: // Complete Heal (with duration)
                case 103: // Call Pet
                case 104: // Translocate target to their bind point
                case 105: // Anti-Gate
                case 115: // Food/Water
                case 117: // Make Weapons Magical
                case 135: // Limit: Resist(Magic allowed)
                case 137: // Limit: Effect(Hitpoints allowed)
                case 138: // Limit: Spell Type(Detrimental only)
                case 141: // Limit: Instant spells only
                case 150: // Death Save - Restore Full Health
                case 151: // Suspend Pet - Lose Buffs and Equipment
                case 154: // Remove Detrimental
                case 156: // Illusion: Target
                case 178: // Lifetap from Weapon Damage
                case 179: // Instrument Modifier
                case 182: // Hundred Hands Effect
                case 194: // Fade
                case 195: // Stun Resist
                case 205: // Rampage
                case 206: // Area of Effect Taunt
                case 311: // Limit: Combat Skills Not Allowed
                case 314: // Fixed Duration Invisbility
                case 299: // Wake the Dead
                $print_buffer .= $dbspelleffects[$spell["effectid$n"]] ?? $effect_placeholder;
                break;

                case 58: // Illusion
                    $print_buffer .= "<span class='spell-effect-illusion'>";
                    $print_buffer .= $dbspelleffects[$spell["effectid$n"]] ?? $effect_placeholder;
                    $print_buffer .= $dbraces[$spell["effect_base_value$n"]] ?? "Unknown Race";
                    $print_buffer .= "</span>";
                    break;
                    

                default:
                    $effect_name = $dbspelleffects[$spell["effectid$n"]] ?? $effect_placeholder;
                    if ($max < 0) {
                        $effect_name = str_replace("Increase", "Decrease", $effect_name);
                    }
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

// Function to fetch item data
function getItemData($item_id) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT id, icon, CASE WHEN name LIKE 'Apocryphal%' THEN REPLACE(name, 'Apocryphal', 'Legendary') WHEN name LIKE 'Rose Colored%' THEN REPLACE(name, 'Rose Colored', 'Enchanted') ELSE name END AS name, weight, slots, races, classes FROM items WHERE id = :item_id");
    $stmt->bindValue(':item_id', $item_id, PDO::PARAM_INT);
    $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($item) {
        $item['icon_class'] = "item-" . htmlspecialchars($item['icon']);
    }

    return $item;
}
?>
