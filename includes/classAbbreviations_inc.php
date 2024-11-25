<?php
// Class abbreviations mapping
$classAbbreviations = [
    "Warrior" => 'WAR',
    "Cleric" => 'CLR',
    "Paladin" => 'PAL',
    "Ranger" => 'RNG',
    "Shadow Knight" => 'SHD',
    "Druid" => 'DRU',
    "Monk" => 'MNK',
    "Bard" => 'BRD',
    "Rogue" => 'ROG',
    "Shaman" => 'SHM',
    "Necromancer" => 'NEC',
    "Wizard" => 'WIZ',
    "Magician" => 'MAG',
    "Enchanter" => 'ENC',
    "Beastlord" => 'BST',
    "Berserker" => 'BER'
];

// Function to get class abbreviations from bitmask
function getClassAbbreviations($classBitmask) {
    global $classMapping, $classAbbreviations; // Import both globals

    $classAbbrs = [];
    $allClassAbbrs = array_values($classAbbreviations); // List of all class abbreviations

    foreach ($classMapping as $bit => $className) {
        if ($classBitmask & $bit && isset($classAbbreviations[$className])) {
            $classAbbrs[] = $classAbbreviations[$className];
        }
    }

    // Check if all classes are included
    if (count(array_diff($allClassAbbrs, $classAbbrs)) === 0) {
        return 'All';
    }

    return implode(' ', $classAbbrs);
}
?>
