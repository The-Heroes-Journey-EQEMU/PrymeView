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
    33: 9632,  // Enhanced Minion I
    34: 9633,  // Enhanced Minion II
    35: 9690,  // Enhanced Minion III
    36: 9691,  // Enhanced Minion IV
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
    51: 8357   // Chromatic Fury V - Level: 70
};


const focusEffectOptions = {
    1: "sympatheticHealing",
    2: "sympatheticStrike",
    3: "improvedDamage",
    4: "improvedHealing",
    5: "extendedEnhancement",
    6: "enhancedMinion"
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
    
    improvedHealing: [
        { value: 1, text: "Improved Healing I" },
        { value: 2, text: "Improved Healing II" },
        { value: 3, text: "Improved Healing III" },
        { value: 4, text: "Improved Healing IV" }
    ],
    extendedEnhancement: [
        { value: 1, text: "Extended Enhancement I" },
        { value: 2, text: "Extended Enhancement II" },
        { value: 3, text: "Extended Enhancement III" },
        { value: 4, text: "Extended Enhancement IV" }
    ],
    enhancedMinion: [
        { value: 1, text: "Minion Empowerment I" },
        { value: 2, text: "Minion Empowerment II" },
        { value: 3, text: "Minion Empowerment III" },
        { value: 4, text: "Minion Empowerment IV" },
        { value: 5, text: "Minion Empowerment V" },
        { value: 6, text: "Minion Empowerment VI" },
        { value: 7, text: "Minion Empowerment VII" },
        { value: 8, text: "Minion Empowerment VIII" },
        { value: 9, text: "Minion Empowerment IX" },
        { value: 10, text: "Minion Empowerment X" }
    ]
};


// Toggle visibility of the focus effect selection section
function toggleFocusEffect() {
    const focusEffectSelection = document.getElementById('focusEffectSelection');
    const enableFocus = document.getElementById('enableFocus');

    if (focusEffectSelection && enableFocus) {
        focusEffectSelection.style.display = enableFocus.checked ? 'block' : 'none';
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
    } else {
        console.error(`No options found for focus type: ${focusKey}`);
    }
}

// Set up event listeners
document.addEventListener("DOMContentLoaded", () => {
    const focusCheckbox = document.getElementById('enableFocus');
    if (focusCheckbox) {
        focusCheckbox.addEventListener('click', toggleFocusEffect);
    } else {
        console.error("enableFocus checkbox not found");
    }

    const focusTypeDropdown = document.getElementById('focus_type');
    if (focusTypeDropdown) {
        focusTypeDropdown.addEventListener('change', toggleRankList);
    } else {
        console.error("focus_type dropdown not found");
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