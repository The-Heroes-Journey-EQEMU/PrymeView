console.log("Script loaded");

var focusEffectMap = {
    1: 24434,  // Sympathetic Healing I
    2: 24435,  // Sympathetic Healing II
    3: 24436,  // Sympathetic Healing III
    4: 24437,  // Sympathetic Healing IV
    5: 24438,  // Sympathetic Healing V
    6: 24439,  // Sympathetic Healing VI
    7: 24440,  // Sympathetic Healing VII
    8: 24441,  // Sympathetic Healing VIII
    9: 24442,  // Sympathetic Healing IX
    10: 24443, // Sympathetic Healing X
    11: 24356, // Sympathetic Strike I
    12: 24357, // Sympathetic Strike II
    13: 24358, // Sympathetic Strike III
    14: 24359, // Sympathetic Strike IV
    15: 24360, // Sympathetic Strike V
    16: 24361, // Sympathetic Strike VI
    17: 24362, // Sympathetic Strike VII
    18: 24363, // Sympathetic Strike VIII
    19: 24364, // Sympathetic Strike IX
    20: 24365, // Sympathetic Strike X
    21: 2336,  // Improved Damage I
    22: 2337,  // Improved Damage II
    23: 2338,  // Improved Damage III
    24: 3513,  // Improved Damage IV
    25: 2345,  // Improved Healing I
    26: 2346,  // Improved Healing II
    27: 2347,  // Improved Healing III
    28: 3501,  // Improved Healing IV
    29: 2333,  // Extended Enhancement I
    30: 2334,  // Extended Enhancement II
    31: 2335,  // Extended Enhancement III
    32: 3504,  // Extended Enhancement IV
    33: 4400,  // Servant of Air - Pet Power:10 MinLevel:46 MaxLevel:60 Mage Air Pets
    34: 4401,  // Servant of Fire - Pet Power:10 MinLevel:46 MaxLevel:60 Mage Fire Pets
    35: 4403,  // Servant of Earth - Pet Power:10 MinLevel:46 MaxLevel:60 Mage Earth Pets
    36: 4404,  // Minion of Hate - Pet Power:10 MinLevel:48 MaxLevel:60 Necro Undead Pets
    37: 3522,  // Anger of Druzzil - Level: 65
    38: 3105,  // Insidious Dreams - Level: 65
    39: 3514,  // Anger of Solusek - Level: 67
    40: 3515,  // Fury of Solusek - Level: 67
    41: 3523,  // Fury of Druzzil - Level: 67
    42: 3517,  // Fury of Ro - Level: 67
    43: 4200,  // Vengeance of Ice - Level: 67
    44: 4201,  // Vengeance of Fire - Level: 67
    45: 4203,  // Vengeance of Magic - Level: 67
    46: 4862,  // Discordant Ice - Level: 68
    47: 4863,  // Discordant Flame - Level: 68
    48: 1357,  // Discordant Energy - Level: 68
    49: 4869,  // Discordant Energy - Level: 68
    50: 6414,  // Improved Damage V - Level: 70
    51: 8357,  // Chromatic Fury V - Level: 70
    52: 2366,  // Burning Affliction I - Level: 20
    53: 2367,  // Burning Affliction II - Level: 44
    54: 2368,  // Burning Affliction III - Level: 60
    55: 3507,  // Burning Affliction IV - Level: 65
    56: 3508,  // Vengeance of Time - Level: 67
    57: 3509,  // Vengeance of Eternity - Level: 67
    58: 4207,  // Burning Magic - Level: 67 (Magic)
    59: 4205,  // Burning Fire - Level: 67 (Fire)
    60: 4204,  // Burning Poison - Level: 67 (Poison)
    61: 4869,  // Discordant Energy - Level: 68 (Magic)
    62: 4868,  // Discordant Disease - Level: 68 (Disease)
    63: 4866,  // Discordant Venom - Level: 68 (Poison)
    64: 4867,  // Discordant Fire - Level: 68 (Fire)
    65: 6412,   // Burning Affliction V - Level: 70
    66: 3502,  // Marr's Gift - Level: 70
    67: 4208,  // Blessed Healing - Level: 70
    68: 5108,  // Discordant Healing - Level: 70
    69: 5109,  // Discordant Health - Level: 70
    70: 6410,  // Improved Healing V - Level: 70
    71: 6425,  // Boon of the Pious - Level: 70
    72: 6439,  // Blessing of the Holy - Level: 70
    73: 6453,  // Favor of the Pious - Level: 70
    74: 6467,  // Blessing of the Pious - Level: 70
    75: 6481,   // Blessing of Anguish - Level: 70
    76: 2366,   // Burning Affliction I - Level: 20
    77: 2367,   // Burning Affliction II - Level: 44
    78: 2368,   // Burning Affliction III - Level: 60
    79: 3507,   // Burning Affliction IV - Level: 65
    80: 3508,   // Vengeance of Time - Level: 67
    81: 3509,   // Vengeance of Eternity - Level: 67
    82: 4207,   // Burning Magic - Level: 67
    83: 4205,   // Burning Fire - Level: 67
    84: 4204,   // Burning Poison - Level: 67
    85: 4869,   // Discordant Energy - Level: 68
    86: 4868,   // Discordant Disease - Level: 68
    87: 4866,   // Discordant Venom - Level: 68
    88: 4867,   // Discordant Fire - Level: 68
    89: 6412,    // Burning Affliction V - Level: 70
    90: 2339,    // Spell Haste I - Level: 20
    91: 2340,    // Spell Haste II - Level: 44
    92: 2341,    // Spell Haste III - Level: 60
    93: 3525,    // Spell Haste IV - Level: 65
    94: 6415,    // Spell Haste V - Level: 70
    95: 2351,    // Summoning Haste I - Level: 20
    96: 2352,    // Summoning Haste II - Level: 44
    97: 2353,    // Summoning Haste III - Level: 60
    98: 3536,    // Summoning Haste IV - Level: 65
    99: 6418,    // Summoning Haste V - Level: 70
    100: 2357,    // Enhancement Haste I - Level: 20
    101: 2358,    // Enhancement Haste II - Level: 44
    102: 2359,    // Enhancement Haste III - Level: 60
    103: 3535,    // Enhancement Haste IV - Level: 65
    104: 2360,    // Affliction Haste I - Level: 20 (Detrimental)
    105: 2361,    // Affliction Haste II - Level: 44 (Detrimental)
    106: 3534,    // Affliction Haste IV - Level: 65 (Detrimental)
    107: 6416,    // Affliction Haste V - Level: 70 (Detrimental)
    108: 2369,    // Reanimation Haste I - Level: 20 (Summon Skeleton Pet)
    109: 2370,    // Reanimation Haste II - Level: 44 (Summon Skeleton Pet)
    110: 2371,    // Reanimation Haste III - Level: 60 (Summon Skeleton Pet)
    111: 3123,    // Contemplative Alacrity - Level: 65 (Raid only)
    112: 3124,    // Speeding Thought - Level: 67
    113: 3528,    // Haste of Solusek - Level: 67 (Detrimental)
    114: 3529,    // Speed of Solusek - Level: 67 (Detrimental)
    115: 3128,    // Blaze of the Lightbringer - Level: 67 (Raid only, Detrimental)
    116: 3527,    // Quickening of Druzzil - Level: 67
    117: 3531,    // Haste of Mithaniel - Level: 67 (Beneficial)
    118: 3532,    // Speed of Mithaniel - Level: 67 (Beneficial)
    119: 3530,    // Quickening of Solusek - Level: 67 (Detrimental)
    120: 3533,    // Quickening of Mithaniel - Level: 67 (Beneficial, Raid only)
    121: 6435,    // Speed of the Aneuk - Level: 70 (Detrimental)
    122: 6436,    // Speed of the Ikaav - Level: 70 (Beneficial)
    123: 6449,    // Hastening of the Aneuk - Level: 70 (Detrimental)
    124: 6463,    // Quickening of the Aneuk - Level: 70 (Detrimental)
    125: 6464,    // Quickening of the Ikaav - Level: 70 (Beneficial)
    126: 6477,    // Alacrity of the Aneuk - Level: 70 (Detrimental)
    127: 6478,    // Alacrity of the Ikaav - Level: 70 (Beneficial)
    128: 6784,    // Quickening of the Dead - Level: 70 (Detrimental)
    129: 4409,  // Summoner's Boon - Pet Power:15 MinLevel:59 MaxLevel:70
    130: 4407,  // Minion of Darkness - Pet Power:20 MinLevel:56 MaxLevel:75
    131: 4405,  // Minion of Eternity - Pet Power:25 MinLevel:61 MaxLevel:75
    132: 4410,  // Ritual Summoning - Pet Power:30 MinLevel:61 MaxLevel:85
    133: 5061,  // Minion of Discord - Pet Power:35 MinLevel:61 MaxLevel:85
    134: 6089,  // Servant of Chaos - Pet Power:40 MinLevel:66 MaxLevel:85
    135: 8399,   // Spire Servant - Pet Power:45 MinLevel:66 MaxLevel:85
    136: 3106,    // Focus of Mediocrity - Level: 65
    137: 3843,    // Timeburn - Level: 67 (Detrimental)
    138: 3845,    // Eterninostrum - Level: 67 (Beneficial)
    139: 4462,    // Extended Torment IV - Level: 67 (Detrimental)
    140: 4854,    // Discordant Clarity - Level: 68 (Clarity spells)
    141: 4857,    // Discordant Thoughts - Level: 68 (Mez spells)
    142: 4858,    // Discordant Time - Level: 68 (Slow spells)
    143: 4859,    // Discordant Malaise - Level: 68 (Detrimental, Magic only)
    144: 6431,    // Ward of the Dragorn - Level: 67 (Beneficial)
    145: 6432,    // Affliction of the Dragorn - Level: 67 (Detrimental)
    146: 6445,    // Guard of the Dragorn - Level: 67 (Beneficial)
    147: 6446,    // Curse of the Dragorn - Level: 67 (Detrimental)
    148: 6459,    // Protection of the Dragorn - Level: 67 (Beneficial)
    149: 6460,    // Bane of the Dragorn - Level: 67 (Detrimental)
    150: 6473,    // Bulwark of the Dragorn - Level: 67 (Beneficial)
    151: 6474,     // Vindication of the Dragorn - Level: 67 (Detrimental)
    152: 2342,    // Mana Preservation I - Level: 20
    153: 2343,    // Mana Preservation II - Level: 44
    154: 2344,    // Mana Preservation III - Level: 60
    155: 3537,    // Mana Preservation IV - Level: 65
    156: 6419,    // Mana Preservation V - Level: 70
    157: 2354,    // Summoning Efficiency I - Level: 20 (Pet Summoning)
    158: 2355,    // Summoning Efficiency II - Level: 44 (Pet Summoning)
    159: 2356,    // Summoning Efficiency III - Level: 60 (Pet Summoning)
    160: 2363,    // Affliction Efficiency I - Level: 20 (Detrimental)
    161: 2364,    // Affliction Efficiency II - Level: 44 (Detrimental)
    162: 2365,    // Affliction Efficiency III - Level: 60 (Detrimental)
    163: 3546,    // Affliction Efficiency IV - Level: 65 (Detrimental)
    164: 3538,    // Preservation of Xegony - Level: 67
    165: 3539,    // Conservation of Xegony - Level: 67
    166: 3545,    // Preservation of Mithaniel - Level: 67
    167: 3541,    // Conservation of Solusek - Level: 67 (Detrimental)
    168: 3542,    // Preservation of Solusek - Level: 67 (Detrimental)
    169: 6437,    // Conservation of the Aneuk - Level: 70 (Beneficial)
    170: 6438,    // Conservation of the Ikaav - Level: 70 (Beneficial)
    171: 6451,    // Preservation of the Aneuk - Level: 70 (Detrimental)
    172: 6452,    // Preservation of the Ikaav - Level: 70 (Beneficial)
    173: 6785,    // Preservation of the Dead - Level: 70 (Detrimental)
    174: 3540,    // Focus of Solusek - Level: 65 (Detrimental)
    175: 3117,    // Darkened Preservation - Level: 67 (Beneficial, Raid only)
    176: 3121,    // Wind of Mana - Level: 67 (Detrimental, Raid only)
    177: 3119,    // Pernicious Focus - Level: 67 (Detrimental, Raid only)
    178: 3547,    // Conservation of Bertoxxulous - Level: 67 (Detrimental)
    179: 6465,    // Penuriousness of the Aneuk - Level: 70 (Detrimental)
    180: 6466,    // Penuriousness of the Ikaav - Level: 70 (Beneficial)
    181: 6479     // Avariciousness of the Aneuk - Level: 70 (Detrimental)

};


const focusEffectOptions = {
    1: "sympatheticHealing",
    2: "sympatheticStrike",
    3: "improvedDamage",
    4: "improvedHealing",
    5: "extendedEnhancement",
    6: "enhancedMinion",
    7: "burningAffliction",
    8: "extendedRange",
    9: "spellHaste",
    10: "manaPres"
};

const rankOptions = {
    sympatheticHealing: [
        { value: 1, text: "Rank 1" },
        { value: 2, text: "Rank 2" },
        { value: 3, text: "Rank 3" },
        { value: 4, text: "Rank 4" },
        { value: 5, text: "Rank 5" },
        { value: 6, text: "Rank 6" },
        { value: 7, text: "Rank 7" },
        { value: 8, text: "Rank 8" },
        { value: 9, text: "Rank 9" },
        { value: 10, text: "Rank 10" }
    ],
    sympatheticStrike: [
        { value: 1, text: "Rank 1" },
        { value: 2, text: "Rank 2" },
        { value: 3, text: "Rank 3" },
        { value: 4, text: "Rank 4" },
        { value: 5, text: "Rank 5" },
        { value: 6, text: "Rank 6" },
        { value: 7, text: "Rank 7" },
        { value: 8, text: "Rank 8" },
        { value: 9, text: "Rank 9" },
        { value: 10, text: "Rank 10" }
    ],
    improvedDamage: [
        { value: 1, text: "Improved Damage I - Level: 20" },
        { value: 2, text: "Improved Damage II - Level: 44" },
        { value: 3, text: "Improved Damage III - Level: 60" },
        { value: 4, text: "Improved Damage IV - Level: 65" },
        { value: 5, text: "Anger of Druzzil - Level: 65" },
        { value: 6, text: "Insidious Dreams - Level: 65" },
        { value: 7, text: "Anger of Solusek - Level: 67" },
        { value: 8, text: "Fury of Solusek - Level: 67" },
        { value: 9, text: "Fury of Druzzil - Level: 67" },
        { value: 10, text: "Fury of Ro - Level: 67" },
        { value: 11, text: "Vengeance of Ice - Level: 67" },
        { value: 12, text: "Vengeance of Fire - Level: 67" },
        { value: 13, text: "Vengeance of Magic - Level: 67" },
        { value: 14, text: "Discordant Ice - Level: 68" },
        { value: 15, text: "Discordant Flame - Level: 68" },
        { value: 16, text: "Discordant Energy - Level: 68" },
        { value: 17, text: "Improved Damage V - Level: 70" },
        { value: 18, text: "Chromatic Fury V - Level: 70" }
    ],
    burningAffliction: [
        { value: 1, text: "Burning Affliction I - Level: 20" },
        { value: 2, text: "Burning Affliction II - Level: 44" },
        { value: 3, text: "Burning Affliction III - Level: 60" },
        { value: 4, text: "Burning Affliction IV - Level: 65" },
        { value: 5, text: "Vengeance of Time - Level: 67" },
        { value: 6, text: "Vengeance of Eternity - Level: 67" },
        { value: 7, text: "Burning Magic - Level: 67" },
        { value: 8, text: "Burning Fire - Level: 67" },
        { value: 9, text: "Burning Poison - Level: 67" },
        { value: 10, text: "Discordant Energy - Level: 68" },
        { value: 11, text: "Discordant Disease - Level: 68" },
        { value: 12, text: "Discordant Venom - Level: 68" },
        { value: 13, text: "Discordant Fire - Level: 68" },
        { value: 14, text: "Burning Affliction V - Level: 70" }
    ],
    
    improvedHealing: [
        { value: 1, text: "Improved Healing I - Level: 20" },
        { value: 2, text: "Improved Healing II - Level: 44" },
        { value: 3, text: "Improved Healing III - Level: 60" },
        { value: 4, text: "Touch of Judgement - Level: 65" },
        { value: 5, text: "Improved Healing IV - Level: 65" },
        { value: 6, text: "Marr's Gift - Level: 67" },
        { value: 7, text: "Blessed Healing - Level: 67" },
        { value: 8, text: "Blessed Aura of Healing - Level: 67" },
        { value: 9, text: "Discordant Healing - Level: 68" },
        { value: 10, text: "Discordant Health - Level: 68" },
        { value: 11, text: "Improved Healing V - Level: 70" },
        { value: 12, text: "Boon of the Pious - Level: 70" },
        { value: 13, text: "Blessing of the Holy - Level: 70" },
        { value: 14, text: "Favor of the Pious - Level: 70" },
        { value: 15, text: "Blessing of the Pious - Level: 70" },
        { value: 16, text: "Blessing of Anguish - Level: 70" }
    ],
    extendedRange: [
        { value: 1, text: "Extended Range I - Level: 20" },
        { value: 2, text: "Extended Range II - Level: 44" },
        { value: 3, text: "Extended Range III - Level: 60" },
        { value: 4, text: "Druzzil's Distance - Level: 65" },
        { value: 5, text: "Extended Range IV - Level: 65" },
        { value: 6, text: "Druzzil's Range - Level: 67" },
        { value: 7, text: "Discordant Range - Level: 68 (Detrimental spells)"},
        { value: 8, text: "Discordant Distance - Level: 68 (Beneficial spells)" },
        { value: 9, text: "Extended Range V - Level: 70" }
    ],
    
    extendedEnhancement: [
        { value: 1, text: "Extended Enhancement I - Level: 20 (Beneficial)" },
        { value: 2, text: "Extended Enhancement II - Level: 44 (Beneficial)" },
        { value: 3, text: "Extended Enhancement III - Level: 60 (Beneficial)" },
        { value: 4, text: "Extended Enhancement IV - Level: 65 (Beneficial)" },
        { value: 5, text: "Focus of Mediocrity - Level: 65" },
        { value: 6, text: "Timeburn - Level: 67 (Detrimental)" },
        { value: 7, text: "Eterninostrum - Level: 67 (Beneficial)" },
        { value: 8, text: "Extended Torment IV - Level: 67 (Detrimental)" },
        { value: 9, text: "Discordant Clarity - Level: 68 (Clarity spells)" },
        { value: 10, text: "Discordant Thoughts - Level: 68 (Mez spells)" },
        { value: 11, text: "Discordant Time - Level: 68 (Slow spells)" },
        { value: 12, text: "Discordant Malaise - Level: 68 (Detrimental, Magic only)" },
        { value: 13, text: "Ward of the Dragorn - Level: 67 (Beneficial)" },
        { value: 14, text: "Affliction of the Dragorn - Level: 67 (Detrimental)" },
        { value: 15, text: "Guard of the Dragorn - Level: 67 (Beneficial)" },
        { value: 16, text: "Curse of the Dragorn - Level: 67 (Detrimental)" },
        { value: 17, text: "Protection of the Dragorn - Level: 67 (Beneficial)" },
        { value: 18, text: "Bane of the Dragorn - Level: 67 (Detrimental)" },
        { value: 19, text: "Bulwark of the Dragorn - Level: 67 (Beneficial)" },
        { value: 20, text: "Vindication of the Dragorn - Level: 67 (Detrimental)" }
    ],
        
    
    enhancedMinion: [
        { value: 1, text: "Servant of Air Pet Power:10 MinLevel:46 MaxLevel:60 Mage Air Pets" },
        { value: 2, text: "Servant of Fire Pet Power:10 MinLevel:46 MaxLevel:60 Mage Fire Pets" },
        { value: 3, text: "Servant of Earth Pet Power:10 MinLevel:46 MaxLevel:60 Mage Earth Pets" },
        { value: 4, text: "Minion of Hate Pet Power:10 MinLevel:48 MaxLevel:60 Necro Undead Pets" },
        { value: 5, text: "Minion of Eternity Pet Power:25 MinLevel:61 MaxLevel:75" },
        { value: 6, text: "Minion of Darkness Pet Power:20 MinLevel:56 MaxLevel:75" },
        { value: 7, text: "Summoner's Boon Pet Power:15 MinLevel:59 MaxLevel:70" },
        { value: 8, text: "Ritual Summoning Pet Power:30 MinLevel:61 MaxLevel:85" },
        { value: 9, text: "Minion of Discord Pet Power:35 MinLevel:61 MaxLevel:85" },
        { value: 10, text: "Servant of Chaos Pet Power:40 MinLevel:66 MaxLevel:85" },
        { value: 11, text: "Spire Servant Pet Power:45 MinLevel:66 MaxLevel:85" }
    ],

   
    manaPres: [
        // Mana Preservation
        { value: 1, text: "Mana Preservation I - Level: 20" },
        { value: 2, text: "Mana Preservation II - Level: 44" },
        { value: 3, text: "Mana Preservation III - Level: 60" },
        { value: 4, text: "Mana Preservation IV - Level: 65" },
        { value: 5, text: "Mana Preservation V - Level: 70" },
    
        // Summoning Efficiency
        { value: 6, text: "Summoning Efficiency I - Level: 20 (Pet Summoning)" },
        { value: 7, text: "Summoning Efficiency II - Level: 44 (Pet Summoning)" },
        { value: 8, text: "Summoning Efficiency III - Level: 60 (Pet Summoning)" },
    
        // Affliction Efficiency
        { value: 9, text: "Affliction Efficiency I - Level: 20 (Detrimental)" },
        { value: 10, text: "Affliction Efficiency II - Level: 44 (Detrimental)" },
        { value: 11, text: "Affliction Efficiency III - Level: 60 (Detrimental)" },
        { value: 12, text: "Affliction Efficiency IV - Level: 65 (Detrimental)" },
    
        // Special Preservations and Conservations
        { value: 13, text: "Preservation of Xegony - Level: 67" },
        { value: 14, text: "Conservation of Xegony - Level: 67" },
        { value: 15, text: "Preservation of Mithaniel - Level: 67" },
        { value: 16, text: "Conservation of Solusek - Level: 67 (Detrimental)" },
        { value: 17, text: "Preservation of Solusek - Level: 67 (Detrimental)" },
        { value: 18, text: "Conservation of the Aneuk - Level: 70 (Beneficial)" },
        { value: 19, text: "Conservation of the Ikaav - Level: 70 (Beneficial)" },
        { value: 20, text: "Preservation of the Aneuk - Level: 70 (Detrimental)" },
        { value: 21, text: "Preservation of the Ikaav - Level: 70 (Beneficial)" },
        { value: 22, text: "Preservation of the Dead - Level: 70 (Detrimental)" },
    
        // Focus, Pernicious, and Miscellaneous Conservations
        { value: 23, text: "Focus of Solusek - Level: 65 (Detrimental)" },
        { value: 24, text: "Darkened Preservation - Level: 67 (Beneficial, Raid only)" },
        { value: 25, text: "Wind of Mana - Level: 67 (Detrimental, Raid only)" },
        { value: 26, text: "Pernicious Focus - Level: 67 (Detrimental, Raid only)" },
        { value: 27, text: "Conservation of Bertoxxulous - Level: 67 (Detrimental)" },
    
        // Penuriousness and Avariciousness
        { value: 28, text: "Penuriousness of the Aneuk - Level: 70 (Detrimental)" },
        { value: 29, text: "Penuriousness of the Ikaav - Level: 70 (Beneficial)" },
        { value: 30, text: "Avariciousness of the Aneuk - Level: 70 (Detrimental)" }
    ],      
       
    spellHaste: [
        { value: 1, id: 2339, text: "Spell Haste I - Level: 20" },
        { value: 2, id: 2340, text: "Spell Haste II - Level: 44" },
        { value: 3, id: 2341, text: "Spell Haste III - Level: 60" },
        { value: 4, id: 3525, text: "Spell Haste IV - Level: 65" },
        { value: 5, id: 6415, text: "Spell Haste V - Level: 70" },
    
        // Summoning Haste
        { value: 6, id: 2351, text: "Summoning Haste I - Level: 20" },
        { value: 7, id: 2352, text: "Summoning Haste II - Level: 44" },
        { value: 8, id: 2353, text: "Summoning Haste III - Level: 60" },
        { value: 9, id: 3536, text: "Summoning Haste IV - Level: 65" },
        { value: 10, id: 6418, text: "Summoning Haste V - Level: 70" },
    
        // Enhancement Haste
        { value: 11, id: 2357, text: "Enhancement Haste I - Level: 20" },
        { value: 12, id: 2358, text: "Enhancement Haste II - Level: 44" },
        { value: 13, id: 2359, text: "Enhancement Haste III - Level: 60" },
        { value: 14, id: 3535, text: "Enhancement Haste IV - Level: 65" },
    
        // Affliction Haste
        { value: 15, id: 2360, text: "Affliction Haste I - Level: 20 (Detrimental)" },
        { value: 16, id: 2361, text: "Affliction Haste II - Level: 44 (Detrimental)" },
        { value: 17, id: 3534, text: "Affliction Haste IV - Level: 65 (Detrimental)" },
        { value: 18, id: 6416, text: "Affliction Haste V - Level: 70 (Detrimental)" },
    
        // Reanimation Haste
        { value: 19, id: 2369, text: "Reanimation Haste I - Level: 20 (Summon Skeleton Pet)" },
        { value: 20, id: 2370, text: "Reanimation Haste II - Level: 44 (Summon Skeleton Pet)" },
        { value: 21, id: 2371, text: "Reanimation Haste III - Level: 60 (Summon Skeleton Pet)" },
    
        // Specialized Hastening Effects
        { value: 22, id: 3123, text: "Contemplative Alacrity - Level: 65 (Raid only)" },
        { value: 23, id: 3124, text: "Speeding Thought - Level: 67" },
        { value: 24, id: 3528, text: "Haste of Solusek - Level: 67 (Detrimental)" },
        { value: 25, id: 3529, text: "Speed of Solusek - Level: 67 (Detrimental)" },
        { value: 26, id: 3128, text: "Blaze of the Lightbringer - Level: 67 (Raid only, Detrimental)" },
        { value: 27, id: 3527, text: "Quickening of Druzzil - Level: 67" },
        { value: 28, id: 3531, text: "Haste of Mithaniel - Level: 67 (Beneficial)" },
        { value: 29, id: 3532, text: "Speed of Mithaniel - Level: 67 (Beneficial)" },
        { value: 30, id: 3530, text: "Quickening of Solusek - Level: 67 (Detrimental)" },
        { value: 31, id: 3533, text: "Quickening of Mithaniel - Level: 67 (Beneficial, Raid only)" },
    
        // Other Specialized Hastening Effects
        { value: 32, id: 6435, text: "Speed of the Aneuk - Level: 70 (Detrimental)" },
        { value: 33, id: 6436, text: "Speed of the Ikaav - Level: 70 (Beneficial)" },
        { value: 34, id: 6449, text: "Hastening of the Aneuk - Level: 70 (Detrimental)" },
        { value: 35, id: 6463, text: "Quickening of the Aneuk - Level: 70 (Detrimental)" },
        { value: 36, id: 6464, text: "Quickening of the Ikaav - Level: 70 (Beneficial)" },
        { value: 37, id: 6477, text: "Alacrity of the Aneuk - Level: 70 (Detrimental)" },
        { value: 38, id: 6478, text: "Alacrity of the Ikaav - Level: 70 (Beneficial)" },
        { value: 39, id: 6784, text: "Quickening of the Dead - Level: 70 (Detrimental)" }
    ]
    
    
};


// Toggle visibility of the focus effect selection section
function toggleFocusEffect() {
    const focusEffectSelection = document.getElementById('focusEffectSelection');
    const enableFocus = document.getElementById('enableFocus');

    if (focusEffectSelection && enableFocus) {
        focusEffectSelection.style.display = enableFocus.checked ? 'block' : 'none';
        sessionStorage.setItem('enableFocus', enableFocus.checked); // Store enableFocus checkbox state
    } else {
        console.error("enableFocus checkbox or focusEffectSelection container not found");
    }
}

// Toggle rank dropdown based on selected focus type
function toggleRankList() {
    const focusDropdown = document.getElementById('focus_type');
    const normalRankContainer = document.getElementById('focus_rank_normal_container');
    const enhancedMinionContainer = document.getElementById('focus_rank_enhanced_minion_container');

    if (!focusDropdown || !normalRankContainer || !enhancedMinionContainer) {
        console.error("One or more rank elements not found");
        return;
    }

    // Hide both containers initially
    normalRankContainer.style.display = 'none';
    enhancedMinionContainer.style.display = 'none';

    const focusType = focusDropdown.value;
    sessionStorage.setItem('focusType', focusType); // Store selected focus type
    const focusKey = focusEffectOptions[focusType];

    // Display correct rank dropdown based on selected focus type
    if (focusKey === "enhancedMinion") {
        enhancedMinionContainer.style.display = 'block';
        populateRankDropdown("enhancedMinion", "focus_rank_enhanced_minion");
    } else if (focusKey) {
        normalRankContainer.style.display = 'block';
        populateRankDropdown(focusKey, "focus_rank_normal");
    } else {
        console.warn("Unrecognized focus type:", focusType);
        document.getElementById('focus_rank_normal').innerHTML = '<option value="">--Select Rank--</option>';
        document.getElementById('focus_rank_enhanced_minion').innerHTML = '<option value="">--Select Enhanced Minion Rank--</option>';
    }
}

// Populate selected rank dropdown with options
function populateRankDropdown(focusKey, dropdownId) {
    const rankDropdown = document.getElementById(dropdownId);

    if (!rankDropdown) {
        console.error(`Rank dropdown not found for focus type: ${focusKey}`);
        return;
    }

    // Clear existing options
    rankDropdown.innerHTML = '<option value="">--Select Rank--</option>';

    // Populate with relevant rank options
    const options = rankOptions[focusKey];
    if (options) {
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.text;
            rankDropdown.appendChild(option);
        });

        // Restore the selected rank from sessionStorage
        const storedRank = sessionStorage.getItem(focusKey === "enhancedMinion" ? 'focusRankEnhancedMinion' : 'focusRankNormal');
        if (storedRank) {
            rankDropdown.value = storedRank;
        }

        // Add change event listener to save selected rank
        rankDropdown.addEventListener('change', () => {
            sessionStorage.setItem(
                focusKey === "enhancedMinion" ? 'focusRankEnhancedMinion' : 'focusRankNormal',
                rankDropdown.value
            );
        });
    } else {
        console.error(`No options found for focus type: ${focusKey}`);
    }
}

// Set up event listeners
document.addEventListener("DOMContentLoaded", () => {
    const focusCheckbox = document.getElementById('enableFocus');
    if (focusCheckbox) {
        focusCheckbox.checked = sessionStorage.getItem('enableFocus') === 'true'; // Restore enableFocus checkbox state
        focusCheckbox.addEventListener('click', toggleFocusEffect);
        toggleFocusEffect(); // Update focusEffectSelection visibility based on restored state
    } else {
        
    }

    const focusTypeDropdown = document.getElementById('focus_type');
    if (focusTypeDropdown) {
        focusTypeDropdown.value = sessionStorage.getItem('focusType') || ''; // Restore selected focus type
        focusTypeDropdown.addEventListener('change', toggleRankList);
        toggleRankList(); // Update rank list based on restored focus type
    } else {
        
    }
});


function setupFocusEffectListener() {
    const focusCheckbox = document.getElementById('enableFocus');
    if (focusCheckbox) {
        focusCheckbox.addEventListener('click', toggleFocusEffect);
    } else {
        console.error("enableFocus checkbox not found");
    }
}