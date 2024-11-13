function generateTooltipContent(data) {
    const iconClass = `item-${data.icon || "default"}`;
    const itemName = data.Name;
    const augmentSlotImageUrl = "/thj/images/icons/blank_slot.gif";

    // Helper function to format stats with heroic values
    function formatWithHeroic(label, value, heroic) {
        return value && value !== 0 && value !== -1
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

    const primaryStats = [
        formatWithHeroic("Strength", data.astr, data.heroic_str),
        formatWithHeroic("Stamina", data.asta, data.heroic_sta),
        formatWithHeroic("Intelligence", data.aint, data.heroic_int),
        formatWithHeroic("Wisdom", data.awis, data.heroic_wis),
        formatWithHeroic("Dexterity", data.adex, data.heroic_dex)
    ].join('');

    const damageStats = [
        data.damage ? `<div class="stat-line"><b>Base DMG:</b> ${data.damage}</div>` : '',
        data.delay ? `<div class="stat-line"><b>Delay:</b> ${data.delay}</div>` : '',
        data.elemental_dmg ? `<div class="stat-line"><b>Elemental DMG:</b> ${data.elemental_dmg}</div>` : '',
        data.magicdmg ? `<div class="stat-line"><b>Magic DMG:</b> ${data.magicdmg}</div>` : '',
        data.backstab ? `<div class="stat-line"><b>Backstab DMG:</b> ${data.backstab}</div>` : ''
    ].filter(Boolean).join('');

    const resistStats = [
        formatWithHeroic("Magic Resist", data.mr, data.heroic_mr),
        formatWithHeroic("Fire Resist", data.fr, data.heroic_fr),
        formatWithHeroic("Cold Resist", data.cr, data.heroic_cr),
        formatWithHeroic("Disease Resist", data.dr, data.heroic_dr),
        formatWithHeroic("Poison Resist", data.pr, data.heroic_pr)
    ].join('');

    const specialStats = [
        data.accuracy ? `<div class="stat-line"><b>Accuracy:</b> ${data.accuracy}</div>` : '',
        data.attack ? `<div class="stat-line"><b>Attack:</b> ${data.attack}</div>` : '',
        data.avoidance ? `<div class="stat-line"><b>Avoidance:</b> ${data.avoidance}</div>` : '',
        data.clairvoyance ? `<div class="stat-line"><b>Clairvoyance:</b> ${data.clairvoyance}</div>` : '',
        data.damageshield ? `<div class="stat-line"><b>Damage Shield:</b> ${data.damageshield}</div>` : '',
        data.dsmitigation ? `<div class="stat-line"><b>DS Mitigation:</b> ${data.dsmitigation}</div>` : '',
        data.enduranceregen ? `<div class="stat-line"><b>Endurance Regen:</b> ${data.enduranceregen}</div>` : '',
        data.haste ? `<div class="stat-line"><b>Haste:</b> ${data.haste}</div>` : '',
        data.heal_amt ? `<div class="stat-line"><b>Heal Amount:</b> ${data.heal_amt}</div>` : '',
        data.regen ? `<div class="stat-line"><b>HP Regen:</b> ${data.regen}</div>` : '',
        data.mana_regen ? `<div class="stat-line"><b>Mana Regen:</b> ${data.mana_regen}</div>` : '',
        data.shielding ? `<div class="stat-line"><b>Shielding:</b> ${data.shielding}</div>` : '',
        data.spell_dmg ? `<div class="stat-line"><b>Spell Damage:</b> ${data.spell_dmg}</div>` : '',
        data.spellshield ? `<div class="stat-line"><b>Spell Shielding:</b> ${data.spellshield}</div>` : '',
        data.strikethrough ? `<div class="stat-line"><b>Strike Through:</b> ${data.strikethrough}</div>` : '',
        data.stunresist ? `<div class="stat-line"><b>Stun Resist:</b> ${data.stunresist}</div>` : ''
    ].filter(Boolean).join('');

    return `
        <div class="tooltip-content">
            <!-- Item Header with Icon, Name, and Lore -->
            <div class="tooltip-header">
                <div class="${iconClass}"></div>
                <h2 class="item-name">${itemName}</h2>
                
            </div>

            <!-- First Row: Slot, Class, Race, and Item Type -->
            <div class="tooltip-stats">
                <div class="stat-section">
                    <div class="stat-line"><b>Slot:</b> ${data.slots || 'N/A'}</div>
                    <div class="stat-line"><b>Class:</b> ${data.classes || 'N/A'}</div>
                    <div class="stat-line"><b>Race:</b> ${data.races || 'N/A'}</div>
                    ${data.itemtype ? `<div class="stat-line"><b>Skill:</b> ${getWeaponSkill(data.itemtype)}</div>` : ''}
                </div>
            </div>

            <!-- Second Row: AC, HP, Mana, Endurance -->
            <div class="tooltip-stats">
                <div class="stat-section">
                    <div class="stat-line"><b>AC:</b> ${data.ac || 'N/A'}</div>
                    <div class="stat-line"><b>HP:</b> ${data.hp || 'N/A'}</div>
                    <div class="stat-line"><b>Mana:</b> ${data.mana || 'N/A'}</div>
                    <div class="stat-line"><b>Endurance:</b> ${data.endur || 'N/A'}</div>
                </div>
            </div>

            <!-- Third Row: Damage Stats -->
            <div class="tooltip-stats">
                <div class="stat-section">
                    ${damageStats}
                </div>
            </div>

            <!-- Primary, Resist, and Special Stats -->
            <div class="tooltip-stats">
                <div class="stat-section">${primaryStats}</div>
                <div class="stat-section">${resistStats}</div>
                <div class="stat-section">${specialStats}</div>
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

            <!-- Combat Effect Section -->
            <div class="tooltip-section">
                <b>Combat Effect:</b> ${data.proceffect || 'None'}<br>
                <b>Effect Chance Modifier:</b> ${data.procrate || '100%'}
            </div>
            <div class="tooltip-section">
        </div>
    `;
}
