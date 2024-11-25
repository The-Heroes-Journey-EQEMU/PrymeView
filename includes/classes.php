<?php
$classes = [
    1 => ['fullName' => 'Warrior', 'abbreviation' => 'WAR', 'image' => 4487],
    2 => ['fullName' => 'Cleric', 'abbreviation' => 'CLR', 'image' => 4477],
    3 => ['fullName' => 'Paladin', 'abbreviation' => 'PAL', 'image' => 4476],
    4 => ['fullName' => 'Ranger', 'abbreviation' => 'RNG', 'image' => 4471],
    5 => ['fullName' => 'Shadow Knight', 'abbreviation' => 'SHD', 'image' => 4483],
    6 => ['fullName' => 'Druid', 'abbreviation' => 'DRU', 'image' => 4481],
    7 => ['fullName' => 'Monk', 'abbreviation' => 'MNK', 'image' => 4475],
    8 => ['fullName' => 'Bard', 'abbreviation' => 'BRD', 'image' => 4464],
    9 => ['fullName' => 'Rogue', 'abbreviation' => 'ROG', 'image' => 4490],
    10 => ['fullName' => 'Shaman', 'abbreviation' => 'SHM', 'image' => 4491],
    11 => ['fullName' => 'Necromancer', 'abbreviation' => 'NEC', 'image' => 4469],
    12 => ['fullName' => 'Wizard', 'abbreviation' => 'WIZ', 'image' => 4482],
    13 => ['fullName' => 'Magician', 'abbreviation' => 'MAG', 'image' => 4470],
    14 => ['fullName' => 'Enchanter', 'abbreviation' => 'ENC', 'image' => 4488],
    15 => ['fullName' => 'Beastlord', 'abbreviation' => 'BST', 'image' => 4489],
    16 => ['fullName' => 'Berserker', 'abbreviation' => 'BER', 'image' => 4465]
];
// Map of class IDs to the corresponding class column in the database
$classColumnMapping = [
    1 => 'classes1',    // Warrior
    2 => 'classes2',    // Cleric
    3 => 'classes3',    // Paladin
    4 => 'classes4',    // Ranger
    5 => 'classes5',    // Shadow Knight
    6 => 'classes6',    // Druid
    7 => 'classes7',    // Monk
    8 => 'classes8',    // Bard
    9 => 'classes9',    // Rogue
    10 => 'classes10',  // Shaman
    11 => 'classes11',  // Necromancer
    12 => 'classes12',  // Wizard
    13 => 'classes13',  // Magician
    14 => 'classes14',  // Enchanter
    15 => 'classes15',  // Beastlord
    16 => 'classes16',  // Berserker
];

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
