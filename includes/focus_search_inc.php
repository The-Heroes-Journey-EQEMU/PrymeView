<?php
$searchResults = [];

// Sympathetic Healing Spell Data with IDs
$sympHealing = [
    1 => ['id' => 24434, 'name' => 'Sympathetic Healing I'],
    2 => ['id' => 24435, 'name' => 'Sympathetic Healing II'],
    3 => ['id' => 24436, 'name' => 'Sympathetic Healing III'],
    4 => ['id' => 24437, 'name' => 'Sympathetic Healing IV'],
    5 => ['id' => 24438, 'name' => 'Sympathetic Healing V'],
    6 => ['id' => 24439, 'name' => 'Sympathetic Healing VI'],
    7 => ['id' => 24440, 'name' => 'Sympathetic Healing VII'],
    8 => ['id' => 24441, 'name' => 'Sympathetic Healing VIII'],
    9 => ['id' => 24442, 'name' => 'Sympathetic Healing IX'],
    10 => ['id' => 24443, 'name' => 'Sympathetic Healing X'],
];

// Sympathetic Strike Spell Data with IDs
$sympStrike = [
    1 => ['id' => 24356, 'name' => 'Sympathetic Strike I'],
    2 => ['id' => 24357, 'name' => 'Sympathetic Strike II'],
    3 => ['id' => 24358, 'name' => 'Sympathetic Strike III'],
    4 => ['id' => 24359, 'name' => 'Sympathetic Strike IV'],
    5 => ['id' => 24360, 'name' => 'Sympathetic Strike V'],
    6 => ['id' => 24361, 'name' => 'Sympathetic Strike VI'],
    7 => ['id' => 24362, 'name' => 'Sympathetic Strike VII'],
    8 => ['id' => 24363, 'name' => 'Sympathetic Strike VIII'],
    9 => ['id' => 24364, 'name' => 'Sympathetic Strike IX'],
    10 => ['id' => 24365, 'name' => 'Sympathetic Strike X'],
];

// Improved Damage Spell Data with IDs
$impDamage = [
    1 => ['id' => 2336, 'name' => 'Improved Damage I'],
    2 => ['id' => 2337, 'name' => 'Improved Damage II'],
    3 => ['id' => 2338, 'name' => 'Improved Damage III'],
    4 => ['id' => 3513, 'name' => 'Improved Damage IV'],
    5 => ['id' => 3522, 'name' => 'Anger of Druzzil'],
    6 => ['id' => 3105, 'name' => 'Insidious Dreams'],
    7 => ['id' => 3514, 'name' => 'Anger of Solusek'],
    8 => ['id' => 3515, 'name' => 'Fury of Solusek'],
    9 => ['id' => 3523, 'name' => 'Fury of Druzzil'],
    10 => ['id' => 3517, 'name' => 'Fury of Ro'],
    11 => ['id' => 4200, 'name' => 'Vengeance of Ice'],
    12 => ['id' => 4201, 'name' => 'Vengeance of Fire'],
    13 => ['id' => 4203, 'name' => 'Vengeance of Magic'],
    14 => ['id' => 4862, 'name' => 'Discordant Ice'],
    15 => ['id' => 4863, 'name' => 'Discordant Flame'],
    16 => ['id' => 1357, 'name' => 'Discordant Energy'],
    17 => ['id' => 4869, 'name' => 'Discordant Energy'],
    18 => ['id' => 6414, 'name' => 'Improved Damage V'],
    19 => ['id' => 8357, 'name' => 'Chromatic Fury V']
];

// Improved Healing Spell Data with IDs
$impHealing = [
    1 => ['id' => 2345, 'name' => 'Improved Healing I'],
    2 => ['id' => 2346, 'name' => 'Improved Healing II'],
    3 => ['id' => 2347, 'name' => 'Improved Healing III'],
    4 => ['id' => 3501, 'name' => 'Improved Healing IV'],
    5 => ['id' => 3502, 'name' => 'Marr\'s Gift'],
    6 => ['id' => 4208, 'name' => 'Blessed Healing'],
    7 => ['id' => 5108, 'name' => 'Discordant Healing'],
    8 => ['id' => 5109, 'name' => 'Discordant Health'],
    9 => ['id' => 6410, 'name' => 'Improved Healing V'],
    10 => ['id' => 6425, 'name' => 'Boon of the Pious'],
    11 => ['id' => 6439, 'name' => 'Blessing of the Holy'],
    12 => ['id' => 6453, 'name' => 'Favor of the Pious'],
    13 => ['id' => 6467, 'name' => 'Blessing of the Pious'],
    14 => ['id' => 6481, 'name' => 'Blessing of Anguish']
];

// Extended Enhancement Spell Data with IDs
$extEnhancement = [
    1 => ['id' => 2333, 'name' => 'Extended Enhancement I'],
    2 => ['id' => 2334, 'name' => 'Extended Enhancement II'],
    3 => ['id' => 2335, 'name' => 'Extended Enhancement III'],
    4 => ['id' => 3504, 'name' => 'Extended Enhancement IV'],
    5 => ['id' => 3106, 'name' => 'Focus of Mediocrity'],
    6 => ['id' => 3843, 'name' => 'Timeburn'],
    7 => ['id' => 3845, 'name' => 'Eterninostrum'],
    8 => ['id' => 4462, 'name' => 'Extended Torment IV'],
    9 => ['id' => 4854, 'name' => 'Discordant Clarity'],
    10 => ['id' => 4857, 'name' => 'Discordant Thoughts'],
    11 => ['id' => 4858, 'name' => 'Discordant Time'],
    12 => ['id' => 4859, 'name' => 'Discordant Malaise'],
    13 => ['id' => 6431, 'name' => 'Ward of the Dragorn'],
    14 => ['id' => 6432, 'name' => 'Affliction of the Dragorn'],
    15 => ['id' => 6445, 'name' => 'Guard of the Dragorn'],
    16 => ['id' => 6446, 'name' => 'Curse of the Dragorn'],
    17 => ['id' => 6459, 'name' => 'Protection of the Dragorn'],
    18 => ['id' => 6460, 'name' => 'Bane of the Dragorn'],
    19 => ['id' => 6473, 'name' => 'Bulwark of the Dragorn'],
    20 => ['id' => 6474, 'name' => 'Vindication of the Dragorn']
];

// Enhanced Minion Spell Data with IDs
$enhancedMinion = [
    1 => ['id' => 4400, 'name' => 'Servant of Air'],
    2 => ['id' => 4401, 'name' => 'Servant of Fire'],
    3 => ['id' => 4403, 'name' => 'Servant of Earth'],
    4 => ['id' => 4404, 'name' => 'Minion of Hate'],
    5 => ['id' => 4405, 'name' => 'Minion of Eternity'],
    6 => ['id' => 4407, 'name' => 'Minion of Darkness'],
    7 => ['id' => 4409, 'name' => 'Summoner\'s Boon'],
    8 => ['id' => 4410, 'name' => 'Ritual Summoning'],
    9 => ['id' => 5061, 'name' => 'Minion of Discord'],
    10 => ['id' => 6089, 'name' => 'Servant of Chaos'],
    11 => ['id' => 8399, 'name' => 'Spire Servant']
];

// Burning Affliction Spell Data with IDs
$burningAffliction = [
    1 => ['id' => 2366, 'name' => 'Burning Affliction I'],
    2 => ['id' => 2367, 'name' => 'Burning Affliction II'],
    3 => ['id' => 2368, 'name' => 'Burning Affliction III'],
    4 => ['id' => 3507, 'name' => 'Burning Affliction IV'],
    5 => ['id' => 3508, 'name' => 'Vengeance of Time'],
    6 => ['id' => 3509, 'name' => 'Vengeance of Eternity'],
    7 => ['id' => 4207, 'name' => 'Burning Magic'],
    8 => ['id' => 4205, 'name' => 'Burning Fire'],
    9 => ['id' => 4204, 'name' => 'Burning Poison'],
    10 => ['id' => 4869, 'name' => 'Discordant Energy'],
    11 => ['id' => 4868, 'name' => 'Discordant Disease'],
    12 => ['id' => 4866, 'name' => 'Discordant Venom'],
    13 => ['id' => 4867, 'name' => 'Discordant Fire'],
    14 => ['id' => 6412, 'name' => 'Burning Affliction V']
];
$manaPres = [
    // Mana Preservation
    1 => ['id' => 2342, 'name' => 'Mana Preservation I'],
    2 => ['id' => 2343, 'name' => 'Mana Preservation II'],
    3 => ['id' => 2344, 'name' => 'Mana Preservation III'],
    4 => ['id' => 3537, 'name' => 'Mana Preservation IV'],
    5 => ['id' => 6419, 'name' => 'Mana Preservation V'],

    // Summoning Efficiency
    6 => ['id' => 2354, 'name' => 'Summoning Efficiency I'],
    7 => ['id' => 2355, 'name' => 'Summoning Efficiency II'],
    8 => ['id' => 2356, 'name' => 'Summoning Efficiency III'],

    // Affliction Efficiency
    9 => ['id' => 2363, 'name' => 'Affliction Efficiency I'],
    10 => ['id' => 2364, 'name' => 'Affliction Efficiency II'],
    11 => ['id' => 2365, 'name' => 'Affliction Efficiency III'],
    12 => ['id' => 3546, 'name' => 'Affliction Efficiency IV'],

    // Special Preservations and Conservations
    13 => ['id' => 3538, 'name' => 'Preservation of Xegony'],
    14 => ['id' => 3539, 'name' => 'Conservation of Xegony'],
    15 => ['id' => 3545, 'name' => 'Preservation of Mithaniel'],
    16 => ['id' => 3541, 'name' => 'Conservation of Solusek'],
    17 => ['id' => 3542, 'name' => 'Preservation of Solusek'],
    18 => ['id' => 6437, 'name' => 'Conservation of the Aneuk'],
    19 => ['id' => 6438, 'name' => 'Conservation of the Ikaav'],
    20 => ['id' => 6451, 'name' => 'Preservation of the Aneuk'],
    21 => ['id' => 6452, 'name' => 'Preservation of the Ikaav'],
    22 => ['id' => 6785, 'name' => 'Preservation of the Dead'],

    // Focus, Pernicious, and Miscellaneous Conservations
    23 => ['id' => 3106, 'name' => 'Focus of Solusek'],
    24 => ['id' => 3117, 'name' => 'Darkened Preservation'],
    25 => ['id' => 3121, 'name' => 'Wind of Mana'],
    26 => ['id' => 3119, 'name' => 'Pernicious Focus'],
    27 => ['id' => 3547, 'name' => 'Conservation of Bertoxxulous'],

    // Penuriousness and Avariciousness
    28 => ['id' => 6465, 'name' => 'Penuriousness of the Aneuk'],
    29 => ['id' => 6466, 'name' => 'Penuriousness of the Ikaav'],
    30 => ['id' => 6479, 'name' => 'Avariciousness of the Aneuk']
];

$extendedRange = [
    1 => ['id' => 2348, 'name' => 'Extended Range I'],
    2 => ['id' => 2349, 'name' => 'Extended Range II'],
    3 => ['id' => 2350, 'name' => 'Extended Range III'],
    4 => ['id' => 3510, 'name' => 'Extended Range IV'],
    5 => ['id' => 3511, 'name' => 'Druzzil\'s Distance'],
    6 => ['id' => 3512, 'name' => 'Druzzil\'s Range'],
    7 => ['id' => 4861, 'name' => 'Discordant Distance'],
    8 => ['id' => 4860, 'name' => 'Discordant Range'],
    9 => ['id' => 6413, 'name' => 'Extended Range V']
];
$spellHaste = [
    1 => ['id' => 2339, 'name' => 'Spell Haste I'],
    2 => ['id' => 2340, 'name' => 'Spell Haste II'],
    3 => ['id' => 2341, 'name' => 'Spell Haste III'],
    4 => ['id' => 3525, 'name' => 'Spell Haste IV'],
    5 => ['id' => 6415, 'name' => 'Spell Haste V'],
    6 => ['id' => 2351, 'name' => 'Summoning Haste I'],
    7 => ['id' => 2352, 'name' => 'Summoning Haste II'],
    8 => ['id' => 2353, 'name' => 'Summoning Haste III'],
    9 => ['id' => 3536, 'name' => 'Summoning Haste IV'],
    10 => ['id' => 6418, 'name' => 'Summoning Haste V'],
    11 => ['id' => 2357, 'name' => 'Enhancement Haste I'],
    12 => ['id' => 2358, 'name' => 'Enhancement Haste II'],
    13 => ['id' => 2359, 'name' => 'Enhancement Haste III'],
    14 => ['id' => 3535, 'name' => 'Enhancement Haste IV'],
    15 => ['id' => 2360, 'name' => 'Affliction Haste I'],
    16 => ['id' => 2361, 'name' => 'Affliction Haste II'],
    17 => ['id' => 3534, 'name' => 'Affliction Haste IV'],
    18 => ['id' => 6416, 'name' => 'Affliction Haste V'],
    19 => ['id' => 2369, 'name' => 'Reanimation Haste I'],
    20 => ['id' => 2370, 'name' => 'Reanimation Haste II'],
    21 => ['id' => 2371, 'name' => 'Reanimation Haste III'],
    22 => ['id' => 3123, 'name' => 'Contemplative Alacrity'],
    23 => ['id' => 3124, 'name' => 'Speeding Thought'],
    24 => ['id' => 3528, 'name' => 'Haste of Solusek'],
    25 => ['id' => 3529, 'name' => 'Speed of Solusek'],
    26 => ['id' => 3128, 'name' => 'Blaze of the Lightbringer'],
    27 => ['id' => 3527, 'name' => 'Quickening of Druzzil'],
    28 => ['id' => 3531, 'name' => 'Haste of Mithaniel'],
    29 => ['id' => 3532, 'name' => 'Speed of Mithaniel'],
    30 => ['id' => 3530, 'name' => 'Quickening of Solusek'],
    31 => ['id' => 3533, 'name' => 'Quickening of Mithaniel'],
    32 => ['id' => 6435, 'name' => 'Speed of the Aneuk'],
    33 => ['id' => 6436, 'name' => 'Speed of the Ikaav'],
    34 => ['id' => 6449, 'name' => 'Hastening of the Aneuk'],
    35 => ['id' => 6463, 'name' => 'Quickening of the Aneuk'],
    36 => ['id' => 6464, 'name' => 'Quickening of the Ikaav'],
    37 => ['id' => 6477, 'name' => 'Alacrity of the Aneuk'],
    38 => ['id' => 6478, 'name' => 'Alacrity of the Ikaav'],
    39 => ['id' => 6784, 'name' => 'Quickening of the Dead']
];

$focusType = [
    1=> "Sympathetic Healing",
    2=> "Sympathetic Strike",
    3=> "Improved Damage",
    4=> "Improved Healing",
    5=> "Extended Enhancement",
    6=> "Enhance Minion",
    7=> "Burning Affliction",
    8=> "Extended Range",
    9=> "Spell Haste",
    10=> "Mana Pres"
];
?>
