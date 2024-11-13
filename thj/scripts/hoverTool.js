// List of item types for weapon-specific formatting
const weaponTypes = [0, 1, 2, 3, 4, 5, 7, 8, 35, 45];

function setupItemHoverListener() {
    const images = document.querySelectorAll('.item-row .hover-image'); // Target both item and spell images
    const tooltip = document.getElementById('tooltip');
    let hideTooltipTimeout;

    images.forEach(image => {
        image.addEventListener('mouseenter', function () {
            const itemId = this.getAttribute('data-item-id') || this.closest('.item-row')?.getAttribute('data-id');
            clearTimeout(hideTooltipTimeout); // Clear any existing timeout to avoid premature hiding

            if (!itemId) return; // Ensure itemId is present

            // Clear previous tooltip content before fetching new data
            tooltip.innerHTML = ''; 

            // Fetch item details from item_detail.php
            fetch(`item_detail.php?id=${itemId}&include_npc=0`)
                .then(response => response.json())
                .then(baseData => {
                    if (baseData.error) {
                        console.error('Error fetching item details:', baseData.error);
                        return;
                    }

                    tooltip.innerHTML = generateTooltipContent(baseData, itemId);
                    positionTooltip(tooltip);
                    tooltip.style.display = 'block';
                })
                .catch(error => console.error('Error fetching item details:', error));
        });

        image.addEventListener('mouseleave', () => {
            hideTooltipTimeout = setTimeout(() => {
                tooltip.style.display = 'none';
            }, 1000); // Hide tooltip after delay
        });
    });

    // Also hide tooltip when the mouse leaves the tooltip itself
    tooltip.addEventListener('mouseenter', () => {
        console.log('Hover triggered', itemId);
        clearTimeout(hideTooltipTimeout); // Prevent hiding if mouse enters tooltip
    });
    tooltip.addEventListener('mouseleave', () => {
        hideTooltipTimeout = setTimeout(() => {
            tooltip.style.display = 'none';
        }, 1000);
    });
}



document.addEventListener('DOMContentLoaded', setupItemHoverListener);


// Function to display tooltip content
function showTooltip(itemData) {
    const tooltip = document.getElementById('tooltip');
    tooltip.innerHTML = `
        <div class="tooltip-item-name">${itemData.name}</div>
        <img src="${itemData.icon_path}" alt="${itemData.name}" class="tooltip-item-icon">
        <div class="tooltip-item-details">${itemData.description}</div>
    `;
    tooltip.style.display = 'block';
}

// Function to hide tooltip
function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none';
}





// Function to display tooltip content
function showTooltip(itemData) {
    const tooltip = document.getElementById('tooltip');
    tooltip.innerHTML = `
        <div class="tooltip-item-name">${itemData.name}</div>
        <img src="${itemData.icon_path}" alt="${itemData.name}" class="tooltip-item-icon">
        <div class="tooltip-item-details">${itemData.description}</div>
    `;
    tooltip.style.display = 'block';
}

// Function to hide tooltip
function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none';
}



function renderSpellDetailsInTooltip(spellType, spellData) {
    if (spellData && spellData.new_icon) {
        const spellName = spellData.name || 'Unknown Spell';
        const iconId = spellData.new_icon;

        // Use the icon ID to reference the correct CSS class
        const spellIconClass = `spell-${iconId}-40`;

        // Create spell section in the tooltip
        const spellSection = `
            <div class="spell-section">
                <strong>${spellType} Spell:</strong> ${spellName}<br>
                <div class="spell-icon ${spellIconClass}" style="width: 40px; height: 40px;"></div>
            </div>
        `;

        return spellSection;
    } else {
        console.error(`Spell data for ${spellType} is missing or incomplete:`, spellData);
        return '';  // Return empty if no valid spell data
    }
}





// Function to position the tooltip at the top center of the viewport
function positionTooltip(tooltip) {
    const viewportWidth = window.innerWidth;
    const tooltipWidth = tooltip.offsetWidth;

    // Position the tooltip horizontally centered and vertically near the top
    tooltip.style.left = `${(viewportWidth - tooltipWidth) / 2}px`;
    tooltip.style.top = `10%`; // Adjust '10%' as desired for distance from the top
}


function generateTooltipContent(data) {
    const iconClass = `item-${data.icon || "default"}`;
    const itemName = data.Name;
    const augmentSlotImageUrl = "/thj/images/icons/blank_slot.gif";
    const elementalDamage = data.elemdmgamt && data.elemdmgtype
        ? `<div class="stat-line"><b>${getElementalDamageType(data.elemdmgtype)} Damage:</b> ${data.elemdmgamt}</div>`
        : '';

        // Skill Mod Section
    const skillModText = (data.skillmodtype !== undefined && data.skillmodtype !== null && data.skillmodvalue > 0)
    ? `<div class="stat-line"><b>Skill Mod:</b> ${getSkillMods(data.skillmodtype)} +${data.skillmodvalue}% ${data.skillmodmax && data.skillmodmax > 0 ? ` Max (${data.skillmodmax})` : ''}</div>`
    : '';

        // Define the spell IDs that might be present in the item data
    const spellIds = {
        Scroll: data.scrolleffect,
        Click: data.clickeffect,
        Proc: data.proceffect,
        Focus: data.focuseffect,
        Worn: data.worneffect,
        Bard: data.bardeffect
    };
    const castTime ={

        Casttime: data.casttime
    }
    // Helper function to format stats with heroic values
    function formatWithHeroic(label, value, heroic) {
        return value && value !== 0 && value !== -1 && value !== 'N/A' && value !== 'Unknown'
            ? `<div class="stat-line"><b>${label}:</b> ${value}${heroic ? `<span class="heroic-value"> +${heroic}</span>` : ''}</div>`
            : '';
    }
    
    // Helper function to format augment slots with images
    function formatAugmentSlot(slotType, slotVisible, slotNumber) {
        if (!slotType || slotVisible === 0) return '';
        return `<div class="augment-slot">
                    <img src="${augmentSlotImageUrl}" alt="Augment Slot ${slotNumber}" style="width:20px; height:auto;">
                    <span class="stat-line">Slot ${slotNumber}: Type ${slotType}</span>
                </div>`;
    }
   
    const damageStats = [
        data.damage ? `<div class="stat-line"><b>Base Damage:</b> ${data.damage}</div>` : '',
        data.delay ? `<div class="stat-line"><b>Delay:</b> ${data.delay}</div>` : '',
        elementalDamage,
    ].filter(Boolean).join('');

    const coreStats = [
        data.ac ? `<div class="stat-line"><b>AC:</b> ${data.ac}</div>` : '',
        data.hp ? `<div class="stat-line"><b>HP:</b> ${data.hp}</div>` : '',
        data.mana ? `<div class="stat-line"><b>Mana:</b> ${data.mana}</div>` : '',
        data.endurance ? `<div class="stat-line"><b>Endur:</b> ${data.endurance}</div>` : '',
        data.haste ? `<div class="stat-line"><b>Haste:</b> ${data.haste}%</div>` : '',
    ].filter(Boolean).join('');
    
    const secondaryStats = [
        data.size ? `<div class="stat-line"><b>Size:</b> ${getItemSizes(data.size)}</div>` : '',
        data.weight ? `<div class="stat-line"><b>Weight:</b> ${(data.weight / 10).toFixed(1)}</div>` : '',
        data.itemtype && weaponTypes.includes(data.itemtype) ? `<div class="stat-line"><b>Skill:</b> ${getWeaponSkill(data.itemtype)}</div>` : '',


        data.reclevel ? `<div class="stat-line"><b>Rec Level:</b> ${data.reclevel}</div>` : '',
        data.reqlevel ? `<div class="stat-line"><b>Req Level :</b> ${data.reqlevel}%</div>` : '',
    ].filter(Boolean).join('');


    const primaryStats = [
        formatWithHeroic("Strength", data.astr, data.heroic_str),
        formatWithHeroic("Stamina", data.asta, data.heroic_sta),
        formatWithHeroic("Dexterity", data.adex, data.heroic_dex),
        formatWithHeroic("Agility", data.aagi, data.heroic_agi),
        formatWithHeroic("Intelligence", data.aint, data.heroic_int),
        formatWithHeroic("Wisdom", data.awis, data.heroic_wis),
        formatWithHeroic("Charisma", data.acha, data.heroic_cha)
    ].filter(Boolean).join('');

    const resistStats = [
        formatWithHeroic("Magic Resist", data.mr, data.heroic_mr),
        formatWithHeroic("Fire Resist", data.fr, data.heroic_fr),
        formatWithHeroic("Cold Resist", data.cr, data.heroic_cr),
        formatWithHeroic("Disease Resist", data.dr, data.heroic_dr),
        formatWithHeroic("Poison Resist", data.pr, data.heroic_pr)
    ].filter(Boolean).join('');

    const specialStats = [
        data.accuracy ? `<div class="stat-line"><b>Accuracy:</b> ${data.accuracy}</div>` : '',
        data.attack ? `<div class="stat-line"><b>Attack:</b> ${data.attack}</div>` : '',
        data.avoidance ? `<div class="stat-line"><b>Avoidance:</b> ${data.avoidance}</div>` : '',
        data.clairvoyance ? `<div class="stat-line"><b>Clairvoyance:</b> ${data.clairvoyance}</div>` : '',
        data.combateffects && data.combateffects > 0 ? `<div class="stat-line"><b>Combat Effects:</b> ${data.combateffects}</div>` : '', // Only display if greater than 0
        data.damageshield ? `<div class="stat-line"><b>Damage Shield:</b> ${data.damageshield}</div>` : '',
        data.dsmitigation ? `<div class="stat-line"><b>DS Mitigation:</b> ${data.dsmitigation}</div>` : '',
        data.enduranceregen ? `<div class="stat-line"><b>Endurance Regen:</b> ${data.enduranceregen}</div>` : '',
        data.healamt ? `<div class="stat-line"><b>Heal Amount:</b> ${data.healamt}</div>` : '',
        data.mana_regen ? `<div class="stat-line"><b>Mana Regen:</b> ${data.mana_regen}</div>` : '',
        data.regen ? `<div class="stat-line"><b>HP Regen:</b> ${data.regen}</div>` : '',
        data.shielding ? `<div class="stat-line"><b>Shielding:</b> ${data.shielding}</div>` : '',
        data.spelldmg ? `<div class="stat-line"><b>Spell Dmg:</b> ${data.spelldmg}</div>` : '',
        data.spellshield ? `<div class="stat-line"><b>Spell Shielding:</b> ${data.spellshield}</div>` : '',
        data.strikethrough ? `<div class="stat-line"><b>Strike Through:</b> ${data.strikethrough}</div>` : '',
        data.stunresist ? `<div class="stat-line"><b>Stun Resist:</b> ${data.stunresist}</div>` : ''
    ].filter(Boolean).join('');
    
    

    // Spell Details Section
    let spellDetails = '';
    Object.entries(spellIds).forEach(([spellType, spellId]) => {
        if (spellId && spellId !== -1) {
            spellDetails += renderSpellDetailsInTooltip(spellType, data[`${spellType}_spell`]);
        }
    });

    return `
        <div class="tooltip-content">
            <div class="tooltip-header-content" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <div class="${iconClass}"></div>
                <h2 class="item-name">${itemName}</h2>
            </div>

            <div class="tooltip-stats">
                <div class="stat-info">
                    ${data.magic && data.magic !== 0 ? `<div class="stat-line"><b>${getMagicItem(data.magic)}</b></div>` : ''}
                    ${data.classes ? `<div class="stat-line"><b>Class:</b> ${getClasses(data.classes)}</div>` : ''}
                    ${data.races ? `<div class="stat-line"><b>Race:</b> ${getRaces(data.races)}</div>` : ''}
                    <div class="stat-line"><b>${data.slots || 'N/A'}</b> </div>
                </div>
            </div>

            <div class="tooltip-stats">
            <div class="stat-section">${secondaryStats}</div>
            <div class="stat-section">${coreStats}</div>            
            <div class="stat-section">${damageStats}</div>
            </div>

            <!-- primary stats -->
            <div class="tooltip-stats">
                <div class="stat-section">${primaryStats}</div>
                <div class="stat-section">${resistStats}</div>
                <div class="stat-section">${specialStats}</div>
            </div>
            <!-- Skill Mods -->
            <div class ="tooltip-section">
            ${skillModText}
            </div>
            <!-- Augment Slots Section -->
            <div class="tooltip-section">
                <b>Augment Slots:</b>
                ${formatAugmentSlot(data.augslot1type, data.augslot1visible, 1)}
                ${formatAugmentSlot(data.augslot2type, data.augslot2visible, 2)}
                ${formatAugmentSlot(data.augslot3type, data.augslot3visible, 3)}
                ${formatAugmentSlot(data.augslot4type, data.augslot4visible, 4)}
                ${formatAugmentSlot(data.augslot5type, data.augslot5visible, 5)}
                ${formatAugmentSlot(data.augslot6type, data.augslot6visible, 6)}
            </div>

            

            <!-- Spell Details Section -->
            <div class="tooltip-section spell-details">
                
                ${spellDetails} 
            </div>
        </div>
    `;
}


function generateSpellSection(spellType, spellId) {
    // Fetch spell details for the spell ID
    let spellSection = '';
    fetch(`item_detail.php?id=${spellId}`)
        .then(response => response.json())
        .then(spellData => {
            const spellName = spellData.name || 'Unknown Spell';
            const spellDescription = spellData.description || 'No description available';
            const spellIconClass = `spell-icon-${spellData.new_icon}`;
            
            spellSection = `
                <div class="spell-section">
                    <strong>${spellType} Spell:</strong> ${spellName}<br>
                    <div class="${spellIconClass} spell-icon" style="width: 40px; height: 40px;"></div>
                    <p>${spellDescription}</p>
                </div>
            `;
        })
        .catch(error => console.error('Error fetching spell details:', error));

    return spellSection;
}



function getClasses(classes) {
    const classAbbreviations = {
        "Warrior": 'WAR',
        "Cleric": 'CLR',
        "Paladin": 'PAL',
        "Ranger": 'RNG',
        "Shadow Knight": 'SHD',
        "Druid": 'DRU',
        "Monk": 'MNK',
        "Bard": 'BRD',
        "Rogue": 'ROG',
        "Shaman": 'SHM',
        "Necromancer": 'NEC',
        "Wizard": 'WIZ',
        "Magician": 'MAG',
        "Enchanter": 'ENC',
        "Beastlord": 'BST',
        "Berserker": 'BER',
    };

    const allClasses = Object.values(classAbbreviations);

    if (Array.isArray(classes)) {
        const classAbbrs = classes.map(className => classAbbreviations[className] || className);
        const isAllClasses = allClasses.every(classAbbr => classAbbrs.includes(classAbbr));

        if (isAllClasses) {
            return 'All';  
        }

        return classAbbrs.join(' ');  
    }

    return "Unknown"; 
}

function getRaces(races) {
    const raceAbbreviations = {
        "Human": 'HUM',
        "Barbarian": 'BAR',
        "Erudite": 'ERU',
        "Wood Elf": 'ELF',
        "High Elf": 'HIE',
        "Dark Elf": 'DEF',
        "Half Elf": 'HEF',
        "Dwarf": 'DWF',
        "Troll": 'TRL',
        "Ogre": 'OGR',
        "Halfling": 'HFL',
        "Gnome": 'GNM',
        "Iksar": 'IKS',
        "Vah Shir": 'VAH',
        "Froglok": 'FRG',
        "Drakkin": 'DRK'
    };

    const allRaces = Object.values(raceAbbreviations);

    if (Array.isArray(races)) {
        const raceAbbrs = races.map(raceName => raceAbbreviations[raceName] || raceName);
        const isAllRaces = allRaces.every(raceAbbr => raceAbbrs.includes(raceAbbr));

        if (isAllRaces) {
            return 'All';  
        }

        return raceAbbrs.join(' ');  
    }

    return "Unknown";  
}

function getMagicItem(magic) {
    const magicItem = {
        0: "",
        1: "Magic"
    };
    return magicItem[magic] || "Unknown";
}

function getItemSizes(size) {
    const itemSize = {
        0: "Tiny",
        1: "Small",
        2: "Medium",
        3: "Large",
        4: "Giant",
        5: "Gigantic"
    };
    return itemSize[size] || "Unknown";
}

function getWeaponSkill(itemtype) {
    const weaponSkills = {
        0: "1H Slash",
        1: "2H Slash",
        2: "Pierce",
        3: "1H Blunt",
        4: "2H Blunt",
        5: "Archery",
        7: "Throwing",
        8: "Shield",
        35: "2H Piercing",
        45: "Hand to Hand"
    };
    return weaponSkills[itemtype] || null;
}

// Convert elemental damage type to text
function getElementalDamageType(type) {
    const elementTypes = {
        1: "Magic",
        2: "Fire",
        3: "Cold",
        4: "Poison",
        5: "Disease"
    };
    return elementTypes[type] || "Unknown";
}

// Skill mods
function getSkillMods(skillmod) {
    const skillMod = {
        0: "1H Blunt",
        1: "1H Slashing",
        2: "2H Blunt",
        3: "2H Slashing",
        4: "Abjuration",
        5: "Alteration",
        6: "Apply Poison",
        7: "Archery",
        8: "Backstab",
        9: "Bind Wound",
        10: "Bash",
        11: "Block",
        12: "Brass Instruments",
        13: "Channeling",
        14: "Conjuration",
        15: "Defense",
        16: "Disarm",
        17: "Disarm Traps",
        18: "Divination",
        19: "Dodge",
        20: "Double Attack",
        21: "Dragon Punch",
        22: "Duel Wield",
        23: "Eagle Strike",
        24: "Evocation",
        25: "Feign Death",
        26: "Flying Kick",
        27: "Forage",
        28: "Hand To Hand",
        29: "Hide",
        30: "Kick",
        31: "Meditate",
        32: "Mend",
        33: "Offense",
        34: "Parry",
        35: "Pick Lock",
        36: "1H Piercing",
        37: "Riposte",
        38: "Round Kick",
        39: "Safe Fall",
        40: "Sense Heading",
        41: "Singing",
        42: "Sneak",
        43: "Specialize Abjure",
        44: "Specialize Alteration",
        45: "Specialize Conjuration",
        46: "Specialize Divination",
        47: "Specialize Evocation",
        48: "Pick Pockets",
        49: "Stringed Instruments",
        50: "Swimming",
        51: "Throwing",
        52: "Tiger Claw",
        53: "Tracking",
        54: "Wind Instruments",
        55: "Fishing",
        56: "Poison Making",
        57: "Tinkering",
        58: "Research",
        59: "Alchemy",
        60: "Baking",
        61: "Tailoring",
        62: "Sense Traps",
        63: "Blacksmithing",
        64: "Fletching",
        65: "Brewing",
        66: "Alcohol Tolerance",
        67: "Begging",
        68: "Jewelry Making",
        69: "Pottery",
        70: "Percussion Instruments",
        71: "Intimidation",
        72: "Berserking",
        73: "Taunt",
        74: "Frenzy",
        75: "Remove Trap",
        76: "Triple Attack",
        77: "2H Piercing",
        98: "Melee",
        105: "Harm Touch",
        107: "Lay Hand",
        111: "Slam",
        114: "Inspect Chest",
        115: "Open Chest",
        116: "Reveal Trap Chest"
        
    };
    
    return skillMod[skillmod] || null;
}

