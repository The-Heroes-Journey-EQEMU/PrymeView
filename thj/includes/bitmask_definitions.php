<?php
$searchResults = [];

// Define slot mapping with bitmasks and titles
$slotBitmask = [
    0 => ['bitmask' => 1, 'name' => 'Charm'],
    1 => ['bitmask' => 2, 'name' => 'Ear'],
    2 => ['bitmask' => 4, 'name' => 'Head'],
    3 => ['bitmask' => 8, 'name' => 'Face'],
    4 => ['bitmask' => 16, 'name' => 'Ear'],
    5 => ['bitmask' => 32, 'name' => 'Neck'],
    6 => ['bitmask' => 64, 'name' => 'Shoulder'],
    7 => ['bitmask' => 128, 'name' => 'Arms'],
    8 => ['bitmask' => 256, 'name' => 'Back'],
    9 => ['bitmask' => 512, 'name' => 'Bracer'],
    10 => ['bitmask' => 1024, 'name' => 'Bracer'],
    11 => ['bitmask' => 2048, 'name' => 'Range'],
    12 => ['bitmask' => 4096, 'name' => 'Hands'],
    13 => ['bitmask' => 8192, 'name' => 'Prim'],
    14 => ['bitmask' => 16384, 'name' => 'Second'],
    15 => ['bitmask' => 32768, 'name' => 'Ring'],
    16 => ['bitmask' => 65536, 'name' => 'Ring'],
    17 => ['bitmask' => 131072, 'name' => 'Chest'],
    18 => ['bitmask' => 262144, 'name' => 'Legs'],
    19 => ['bitmask' => 524288, 'name' => 'Feet'],
    20 => ['bitmask' => 1048576, 'name' => 'Waist'],
    21 => ['bitmask' => 2097152, 'name' => 'Power'],
    22 => ['bitmask' => 4194304, 'name' => 'Ammo']
];

// Mapping for race bitmasks
$raceMapping = [
    1 => 'Human',
    2 => 'Barbarian',
    4 => 'Erudite',
    8 => 'Wood Elf',
    16 => 'High Elf',
    32 => 'Dark Elf',
    64 => 'Half Elf',
    128 => 'Dwarf',
    256 => 'Troll',
    512 => 'Ogre',
    1024 => 'Halfling',
    2048 => 'Gnome',
    4096 => 'Iksar',
    8192 => 'Vah Shir',
    16384 => 'Froglok',
    32768 => 'Drakkin'
];

// Mapping for class bitmasks
$classMapping = [
    1 => 'Warrior',
    2 => 'Cleric',
    4 => 'Paladin',
    8 => 'Ranger',
    16 => 'Shadow Knight',
    32 => 'Druid',
    64 => 'Monk',
    128 => 'Bard',
    256 => 'Rogue',
    512 => 'Shaman',
    1024 => 'Necromancer',
    2048 => 'Wizard',
    4096 => 'Magician',
    8192 => 'Enchanter',
    16384 => 'Beastlord',
    32768 => 'Berserker'
    
];

// Function to decode race bitmask
function getRaceBitmask($raceName) {
    global $raceMapping;
    $bitmask = array_search($raceName, $raceMapping);
    return $bitmask !== false ? $bitmask : 0;
}

// Function to decode class bitmask
function getClassBitmask($className) {
    global $classMapping;
    $bitmask = array_search($className, $classMapping);
    return $bitmask !== false ? $bitmask : 0;
}
?>