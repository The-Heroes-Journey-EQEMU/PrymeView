const slotPairs = { 15: 16, 16: 15, 1: 4, 4: 1, 9: 10, 10: 9 };
let selectedRowId = sessionStorage.getItem('selectedRowId') || null;
let selectedRace = null;
let selectedClass = null;
let selectedExpansion = null;


function loadContentForItemSearch(page) {
    const contentDisplay = document.getElementById('content-display');
    const spellsWrapper = document.getElementById('spells-wrapper');
    const aaWrapper = document.getElementById('aa-wrapper');
    const detailsContainer = document.getElementById('details-container');
    const upgradeTabContainer = document.querySelector('.upgrade-path-tab-container');

    // Check for required elements
    if (!contentDisplay || !detailsContainer || !upgradeTabContainer) {
        console.error("Required containers are missing from the DOM.");
        return;
    }

    // Hide other sections
    if (spellsWrapper) spellsWrapper.style.display = 'none';
    if (aaWrapper) aaWrapper.style.display = 'none';
    if (detailsContainer) detailsContainer.style.display = 'none';
    if (upgradeTabContainer) upgradeTabContainer.style.display = 'none';

    // Reset session storage only for item search page
    if (page === 'item_search.php') {
        selectedRowId = null; // Reset selection
        sessionStorage.clear(); // Clear all session storage for simplicity
        console.log("Session storage cleared.");
    }

    // Reset the content display
    contentDisplay.innerHTML = '<p>Loading...</p>';
    contentDisplay.style.display = 'block';

    // Fetch the content dynamically
    fetch(`${page}?cb=${new Date().getTime()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            contentDisplay.innerHTML = data;
            setupListeners();

            // Attach search form listener
            const itemSearchForm = contentDisplay.querySelector('#searchForm');
            if (itemSearchForm) attachItemSearchListener(itemSearchForm);

            // Restore previously selected row if any
            if (selectedRowId) {
                const previouslySelectedRow = document.querySelector(`.item-row[data-id="${selectedRowId}"]`);
                if (previouslySelectedRow) previouslySelectedRow.classList.add('selected-row');
            }
        })
        .catch(error => {
            console.error('Fetch error while loading page content:', error);
            contentDisplay.innerHTML = '<p>Error loading content.</p>';
        });
}



function setupListeners() {
    setupItemListeners();
    setupSlotListeners();
    setupRaceListeners();
    setupClassListeners();
    setupExpansionListeners();
    setupItemTypeListener();
    restoreSelections();
    setupItemClickListener();
    setupItemHoverListener();
    setupFocusEffectListener();
    setupStatFilterListeners();
    // Add listener for search term input
    const searchBox = document.getElementById('search');
    if (searchBox) {
        searchBox.addEventListener('input', function () {
            sessionStorage.setItem('searchTerm', this.value);
        });
    }

   
     
  
}

// Toggle visibility of the item type dropdown based on the checkbox state
function toggleItemType() {
    const itemTypeSelection = document.getElementById('itemTypeSelection');
    const enableItemType = document.getElementById('enableItemType');
    if (itemTypeSelection && enableItemType) {
        itemTypeSelection.style.display = enableItemType.checked ? 'block' : 'none';
        sessionStorage.setItem('enableItemType', enableItemType.checked);
    }
}
 

// Slot selection function with toggle capability, ensuring only one slot and its pair are selected
function toggleSlotSelection(slotNum) {
    const slotElement = document.getElementById(`slot_${slotNum}`);
    const pairedSlot = slotPairs[slotNum];
    const isSelected = slotElement.classList.contains('selected');

    console.log(`Slot ${slotNum} clicked. Currently selected: ${isSelected}`);

    if (isSelected) {
        // Deselect the slot and its pair
        slotElement.classList.remove('selected');
        if (pairedSlot) document.getElementById(`slot_${pairedSlot}`).classList.remove('selected');

        // Clear from sessionStorage
        sessionStorage.removeItem('selectedSlot');
    } else {
        // Select the slot and its pair
        slotElement.classList.add('selected');
        if (pairedSlot) document.getElementById(`slot_${pairedSlot}`).classList.add('selected');

        // Save the slot and its pair in sessionStorage
        const selectedSlots = pairedSlot ? `${slotNum},${pairedSlot}` : `${slotNum}`;
        sessionStorage.setItem('selectedSlot', selectedSlots);
        console.log("Selected slot saved to sessionStorage:", selectedSlots);
    }
}



// Updated slot listener setup to avoid duplicate listeners
function setupSlotListeners() {
    document.querySelectorAll('.slot-image').forEach(img => {
        img.removeEventListener('click', handleSlotClick);
        img.addEventListener('click', handleSlotClick);
    });
}
// Slot click handler function
function handleSlotClick() {
    const slotNum = this.getAttribute('data-slot-num');
    toggleSlotSelection(slotNum);
}


// Helper function to set up expansion listeners
function setupExpansionListeners() {
    document.querySelectorAll('.expansion-icon-container').forEach(icon => {
        icon.addEventListener('click', function(event) {
            const expansionId = this.getAttribute('data-expansion-id');
            selectExpansion(expansionId, event);
        });
    });
}
// Helper function to select a race
function selectRace(raceName) {
    const raceElement = document.querySelector(`[data-race-name="${raceName}"]`);
    const isSelected = raceElement.classList.contains('selected');

    // If the race is already selected, deselect it
    if (isSelected) {
        raceElement.classList.remove('selected');
        sessionStorage.removeItem('selectedRace');
        selectedRace = null;
        console.log(`Race ${raceName} deselected.`);
    } else {
        // Otherwise, select the race
        raceElement.classList.add('selected');
        sessionStorage.setItem('selectedRace', raceName);
        selectedRace = raceName;
        console.log(`Race ${raceName} selected.`);
    }
}

let selectedClasses = JSON.parse(sessionStorage.getItem('selectedClasses')) || []; // Load from sessionStorage or initialize empty

function selectClass(className) {
    const classElement = document.querySelector(`[data-class-name="${className}"]`);
    const isSelected = selectedClasses.includes(className);

    if (isSelected) {
        // If already selected, deselect it
        selectedClasses = selectedClasses.filter(name => name !== className);
        classElement.classList.remove('selected');
        console.log(`Class ${className} deselected.`);
    } else {
        if (selectedClasses.length < 3) {
            // If less than 3 classes are selected, add the new one
            selectedClasses.push(className);
            classElement.classList.add('selected');
            console.log(`Class ${className} selected.`);
        } else {
            alert('You can select up to 3 classes only.');
            return;
        }
    }

    // Save the updated array to sessionStorage
    sessionStorage.setItem('selectedClasses', JSON.stringify(selectedClasses));
    console.log('Selected classes:', selectedClasses);
}




// Class click handler
function handleClassClick(event) {
    const className = this.getAttribute('data-class-name');
    selectClass(className);
}
// Expansion selection function
function selectExpansion(expansionId, event) {
    document.getElementById('selectedExpansion').value = expansionId;

    document.querySelectorAll('.expansion-icon-container').forEach(icon => icon.classList.remove('selected'));
    selectedExpansion = event.currentTarget;
    selectedExpansion.classList.add('selected');

    sessionStorage.setItem('selectedExpansion', expansionId);
}

function restoreSelections() {
    const storedSlot = sessionStorage.getItem('selectedSlot');
    const storedRace = sessionStorage.getItem('selectedRace');
    const storedClasses = JSON.parse(sessionStorage.getItem('selectedClasses')) || []; // Retrieve the array of selected classes
    const storedItemType = sessionStorage.getItem('selectedItemType');
    const storedExpansion = sessionStorage.getItem('selectedExpansion');
    const storedEnableFocus = sessionStorage.getItem('enableFocus');
    const storedFocusType = sessionStorage.getItem('focusType');
    const storedFocusRankNormal = sessionStorage.getItem('focusRankNormal');
    const storedFocusRankEnhancedMinion = sessionStorage.getItem('focusRankEnhancedMinion');
    const storedEnableItemType = sessionStorage.getItem('enableItemType');

    // Stat filters
    const storedStat = sessionStorage.getItem('selectedStat');
    const storedOperator = sessionStorage.getItem('selectedOperator');
    const storedStatValue = sessionStorage.getItem('statValue');

    // Resist filters
    const storedResist = sessionStorage.getItem('selectedResist');
    const storedResistOperator = sessionStorage.getItem('resistOperator');
    const storedResistValue = sessionStorage.getItem('resistValue');

    // Heroic stat filters
    const storedHeroicStat = sessionStorage.getItem('selectedHeroicStat');
    const storedHeroicOperator = sessionStorage.getItem('heroicOperator');
    const storedHeroicValue = sessionStorage.getItem('heroicValue');

    // Modification filters
    const storedMod = sessionStorage.getItem('selectedMod');
    const storedModOperator = sessionStorage.getItem('modOperator');
    const storedModValue = sessionStorage.getItem('modValue');

    const enableStatFilterCheckbox = document.getElementById('statFilter');
    const storedEnableStatFilter = sessionStorage.getItem('enableStatFilter');

    // Search save
    const storedSearchTerm = sessionStorage.getItem('searchTerm');

    if (storedSearchTerm) {
        const searchBox = document.getElementById('search');
        if (searchBox) searchBox.value = storedSearchTerm;
    }
    if (enableStatFilterCheckbox && storedEnableStatFilter) {
        enableStatFilterCheckbox.checked = storedEnableStatFilter === 'true';
        toggleStatVisibility(); // Ensure the stat filter section visibility is toggled
    }

    // Restore slot selections
    if (storedSlot) {
        const slotNumbers = storedSlot.split(','); // Split the stored string into individual slot numbers
        console.log("Restoring slots:", slotNumbers);

        slotNumbers.forEach(slotNum => {
            const slotElement = document.getElementById(`slot_${slotNum}`);
            if (slotElement) {
                slotElement.classList.add('selected');
            }
        });
    }

    // Restore race selection
    if (storedRace) {
        const raceElement = document.querySelector(`[data-race-name="${storedRace}"]`);
        if (raceElement) {
            raceElement.classList.add('selected');
            selectedRace = storedRace;
        }
    }

    // Restore class selections
    storedClasses.forEach(className => {
        const classElement = document.querySelector(`[data-class-name="${className}"]`);
        if (classElement) {
            classElement.classList.add('selected');
        }
    });

    // Restore expansion selection
    if (storedExpansion) selectExpansion(storedExpansion, { currentTarget: document.querySelector(`[data-expansion-id="${storedExpansion}"]`) });

    // Restore item type dropdown
    if (storedItemType) {
        const itemTypeDropdown = document.getElementById('item_type');
        if (itemTypeDropdown) itemTypeDropdown.value = storedItemType;
    }

    // Restore enableFocus checkbox and focus dropdowns
    const enableFocusCheckbox = document.getElementById('enableFocus');
    if (enableFocusCheckbox && storedEnableFocus) {
        enableFocusCheckbox.checked = storedEnableFocus === 'true';
        toggleFocusEffect();
    }

    // Restore focus type and rank dropdowns
    const focusTypeDropdown = document.getElementById('focus_type');
    if (focusTypeDropdown && storedFocusType) {
        focusTypeDropdown.value = storedFocusType;
        toggleRankList();
    }

    const focusRankNormalDropdown = document.getElementById('focus_rank_normal');
    if (focusRankNormalDropdown && storedFocusRankNormal) {
        focusRankNormalDropdown.value = storedFocusRankNormal;
    }

    const focusRankEnhancedMinionDropdown = document.getElementById('focus_rank_enhanced_minion');
    if (focusRankEnhancedMinionDropdown && storedFocusRankEnhancedMinion) {
        focusRankEnhancedMinionDropdown.value = storedFocusRankEnhancedMinion;
    }

    // Restore enableItemType checkbox and item type selection
    const enableItemTypeCheckbox = document.getElementById('enableItemType');
    if (enableItemTypeCheckbox && storedEnableItemType) {
        enableItemTypeCheckbox.checked = storedEnableItemType === 'true';
        toggleItemType();
    }

    // Restore stat filters
    if (storedStat) document.getElementById('istat1').value = storedStat;
    if (storedOperator) document.getElementById('istatComparison').value = storedOperator;
    if (storedStatValue) document.getElementById('istatValue').value = storedStatValue;

    // Restore resist filters
    if (storedResist) document.getElementById('iresists').value = storedResist;
    if (storedResistOperator) document.getElementById('iresistsComparison').value = storedResistOperator;
    if (storedResistValue) document.getElementById('iresistsValue').value = storedResistValue;

    // Restore heroic stat filters
    if (storedHeroicStat) document.getElementById('iheroics').value = storedHeroicStat;
    if (storedHeroicOperator) document.getElementById('iheroicsComparison').value = storedHeroicOperator;
    if (storedHeroicValue) document.getElementById('iheroicsValue').value = storedHeroicValue;

    // Restore modification filters
    if (storedMod) document.getElementById('imod').value = storedMod;
    if (storedModOperator) document.getElementById('imodComparison').value = storedModOperator;
    if (storedModValue) document.getElementById('imodValue').value = storedModValue;
}





// Attach search listener for item search form submission
function attachItemSearchListener(itemSearchForm) {
    itemSearchForm.removeEventListener('submit', handleItemSearch);
    itemSearchForm.addEventListener('submit', handleItemSearch);
}

function handleItemSearch(event) {
    event.preventDefault(); // Prevent page reload

    const searchQuery = document.getElementById('search').value.trim();
    const selectedSlot = document.getElementById('slot') ? document.getElementById('slot').value : sessionStorage.getItem('selectedSlot') || '';
    const selectedRace = document.getElementById('race') ? document.getElementById('race').value : sessionStorage.getItem('selectedRace') || '';
    const selectedClass = document.getElementById('class') ? document.getElementById('class').value : sessionStorage.getItem('selectedClass') || '';
    const selectedItemType = document.getElementById('item_type') ? document.getElementById('item_type').value : sessionStorage.getItem('selectedItemType') || '-1';
    const selectedExpansion = document.getElementById('expansion') ? document.getElementById('expansion').value : sessionStorage.getItem('selectedExpansion') || '';
    const focusEffectEnabled = document.getElementById('enableFocus') ? document.getElementById('enableFocus').checked : false;
    const selectedFocus = document.getElementById('focus_type') ? document.getElementById('focus_type').value : '';
    
    // Retrieve current values from form fields or fallback to session storage
    const statSelect = document.getElementById('istat1') ? document.getElementById('istat1').value : sessionStorage.getItem('selectedStat') || '';
    const statComparison = document.getElementById('istatComparison') ? document.getElementById('istatComparison').value : sessionStorage.getItem('selectedOperator') || '';
    const statValue = document.getElementById('istatValue') ? document.getElementById('istatValue').value : sessionStorage.getItem('statValue') || '';

    const resistSelect = document.getElementById('iresists') ? document.getElementById('iresists').value : sessionStorage.getItem('selectedResist') || '';
    const resistComparison = document.getElementById('iresistsComparison') ? document.getElementById('iresistsComparison').value : sessionStorage.getItem('resistComparison') || '';
    const resistValue = document.getElementById('iresistsValue') ? document.getElementById('iresistsValue').value : sessionStorage.getItem('resistValue') || '';

    const heroicSelect = document.getElementById('iheroics') ? document.getElementById('iheroics').value : sessionStorage.getItem('selectedHeroic') || '';
    const heroicComparison = document.getElementById('iheroicsComparison') ? document.getElementById('iheroicsComparison').value : sessionStorage.getItem('heroicComparison') || '';
    const heroicValue = document.getElementById('iheroicsValue') ? document.getElementById('iheroicsValue').value : sessionStorage.getItem('heroicValue') || '';

    const modSelect = document.getElementById('imod') ? document.getElementById('imod').value : sessionStorage.getItem('selectedMod') || '';
    const modComparison = document.getElementById('imodComparison') ? document.getElementById('imodComparison').value : sessionStorage.getItem('modComparison') || '';
    const modValue = document.getElementById('imodValue') ? document.getElementById('imodValue').value : sessionStorage.getItem('modValue') || '';

    // Determine correct rank dropdown based on focus type
    let selectedRank = '';
    if (selectedFocus === '6') { // Assuming 6 is Enhanced Minion ID
        selectedRank = document.getElementById('focus_rank_enhanced_minion') ? document.getElementById('focus_rank_enhanced_minion').value : '';
    } else {
        selectedRank = document.getElementById('focus_rank_normal') ? document.getElementById('focus_rank_normal').value : '';
    }

    // Check if no search terms or filters are selected
    if (!searchQuery && !selectedSlot && !selectedRace && !selectedClass && selectedItemType === '-1' && !selectedExpansion &&
        !(focusEffectEnabled && selectedFocus && selectedRank) && !statSelect && !resistSelect && !heroicSelect && !modSelect) {
        alert('Please enter a search term or select some filters.');
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'item_search.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = function () {
        const contentDisplay = document.getElementById('content-display');
        if (xhr.status === 200) {
            contentDisplay.innerHTML = xhr.responseText;
            setupListeners(); // Reattach listeners after new content is loaded

            const newSearchForm = document.querySelector('#searchForm');
            if (newSearchForm) attachItemSearchListener(newSearchForm);
        } else {
            contentDisplay.innerHTML = '<p>Error loading results.</p>';
            console.error('Failed to load results:', xhr.statusText);
        }
    };
 
    // Build request body for AJAX call
    const params = {
        search_term: searchQuery,
        search: 1,
        slot: selectedSlot,
        race: selectedRace,
        class: selectedClass,
        item_type: selectedItemType !== '-1' ? selectedItemType : '',
        expansion: selectedExpansion,
        stat_select: statSelect,
        stat_comparison: statComparison,
        stat_value: statValue,
        resist_select: resistSelect,
        resist_comparison: resistComparison,
        resist_value: resistValue,
        heroic_stat_select: heroicSelect,
        heroic_stat_comparison: heroicComparison,
        heroic_stat_value: heroicValue,
        mod_select: modSelect,
        mod_comparison: modComparison,
        mod_value: modValue,
    };

    // Add focus effect and rank if enabled and valid selections are made
    if (focusEffectEnabled && selectedFocus && selectedRank) {
        params.focus_type = selectedFocus;
        params.focus_rank = selectedRank;
    }

    // Convert params object to URL-encoded string
    const requestBody = Object.entries(params)
        .filter(([_, value]) => value) // Exclude empty values
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    xhr.send(requestBody);
}

// Collect filter values
function getFilterValues() {
    var filters = {};

    // Stat filter
    filters.stat = document.getElementById('istat1').value;
    filters.statComparison = document.getElementById('istatComparison').value;
    filters.statValue = document.getElementById('istatValue').value;

    // Resist filter
    filters.resist = document.getElementById('iresists').value;
    filters.resistComparison = document.getElementById('iresistsComparison').value;
    filters.resistValue = document.getElementById('iresistsValue').value;

    // Heroic stat filter
    filters.heroicStat = document.getElementById('iheroics').value;
    filters.heroicStatComparison = document.getElementById('iheroicsComparison').value;
    filters.heroicStatValue = document.getElementById('iheroicsValue').value;

    // Modifications filter
    filters.mod = document.getElementById('imod').value;
    filters.modComparison = document.getElementById('imodComparison').value;
    filters.modValue = document.getElementById('imodValue').value;

    return filters;
}


// Updated race listener setup to avoid duplicate listeners
function setupRaceListeners() {
    document.querySelectorAll('.race-image').forEach(img => {
        img.removeEventListener('click', handleRaceClick);
        img.addEventListener('click', handleRaceClick);
    });
}

// Updated class listener setup to avoid duplicate listeners
function setupClassListeners() {
    document.querySelectorAll('.class-image').forEach(img => {
        img.removeEventListener('click', handleClassClick);
        img.addEventListener('click', handleClassClick);
    });
}

// Race click handler
function handleRaceClick(event) {
    const raceName = this.getAttribute('data-race-name');
    selectRace(raceName);
}
// New listener to store item type in sessionStorage
function setupItemTypeListener() {
    const itemTypeDropdown = document.getElementById('item_type');
    if (itemTypeDropdown) {
        itemTypeDropdown.addEventListener('change', () => {
            const selectedItemType = itemTypeDropdown.value;
            sessionStorage.setItem('selectedItemType', selectedItemType);
        });
    }
}

// Function to set up click event for item rows and handle selection highlight
function setupItemClickListener() {
    const rows = document.querySelectorAll('.item-row');
    rows.forEach(row => {
        row.addEventListener('click', function(event) {
            event.preventDefault();
            const itemId = this.getAttribute('data-id');
            loadItemDetails(itemId);

            rows.forEach(r => r.classList.remove('selected-row'));
            this.classList.add('selected-row');
            selectedRowId = itemId;
            sessionStorage.setItem('selectedRowId', selectedRowId);
        });
    });
}

// Set up listeners for item rows to load item details
function setupItemListeners() {
    document.querySelectorAll('.item-row').forEach(row => {
        row.addEventListener('click', function(event) {
            event.preventDefault();
            selectedRowId = this.getAttribute('data-id');
            document.querySelectorAll('.item-row').forEach(r => r.classList.remove('selected-row'));
            this.classList.add('selected-row');
            loadItemDetails(selectedRowId);
        });
    });

    if (selectedRowId) {
        const previouslySelectedRow = document.querySelector(`.item-row[data-id="${selectedRowId}"]`);
        if (previouslySelectedRow) previouslySelectedRow.classList.add('selected-row');
    }
}


function toggleStatVisibility() {
    const statsContainer = document.getElementById('statFilters');
    const isChecked = document.getElementById('statFilter').checked;

    // Store the checkbox state in sessionStorage
    sessionStorage.setItem('enableStatFilter', isChecked);

    // Toggle visibility based on checkbox state
    if (isChecked) {
        statsContainer.style.display = 'flex'; // Show stats
    } else {
        statsContainer.style.display = 'none'; // Hide stats
    }
}


function handleStatFilterChange() {
    const statDropdown = document.getElementById('statDropdown');
    const operatorDropdown = document.getElementById('operatorDropdown');
    const statNumber = document.getElementById('statNumber');

    const selectedStat = statDropdown ? statDropdown.value : '';
    const selectedOperator = operatorDropdown ? operatorDropdown.value : '';
    const statValue = statNumber ? statNumber.value : '';

    sessionStorage.setItem('selectedStat', selectedStat);
    sessionStorage.setItem('selectedOperator', selectedOperator);
    sessionStorage.setItem('statValue', statValue);

    console.log(`Stored stat filter: ${selectedStat} ${selectedOperator} ${statValue}`);
}


function setupStatFilterListeners() {
    const statDropdown = document.getElementById('istat1');
    const operatorDropdown = document.getElementById('istatComparison');
    const statNumber = document.getElementById('istatValue');
    const enableStatFilterCheckbox = document.getElementById('statFilter');

    // Attach event listeners to each input
    if (statDropdown) statDropdown.addEventListener('change', handleStatFilterChange);
    if (operatorDropdown) operatorDropdown.addEventListener('change', handleStatFilterChange);
    if (statNumber) statNumber.addEventListener('input', handleStatFilterChange);

    // Store enableStatFilter checkbox state
    if (enableStatFilterCheckbox) {
        enableStatFilterCheckbox.addEventListener('change', () => {
            sessionStorage.setItem('enableStatFilter', enableStatFilterCheckbox.checked);
        });
    }
}



function saveStatFilters() {
    const statDropdown = document.getElementById('istat1');
    const operatorDropdown = document.getElementById('istatComparison');
    const statValue = document.getElementById('istatValue');

    const resistDropdown = document.getElementById('iresists');
    const resistOperator = document.getElementById('iresistsComparison');
    const resistValue = document.getElementById('iresistsValue');

    const heroicDropdown = document.getElementById('iheroics');
    const heroicOperator = document.getElementById('iheroicsComparison');
    const heroicValue = document.getElementById('iheroicsValue');

    const modDropdown = document.getElementById('imod');
    const modOperator = document.getElementById('imodComparison');
    const modValue = document.getElementById('imodValue');

    // Save stat filter
    sessionStorage.setItem('selectedStat', statDropdown.value);
    sessionStorage.setItem('selectedOperator', operatorDropdown.value);
    sessionStorage.setItem('statValue', statValue.value);

    // Save resist filter
    sessionStorage.setItem('selectedResist', resistDropdown.value);
    sessionStorage.setItem('resistOperator', resistOperator.value);
    sessionStorage.setItem('resistValue', resistValue.value);

    // Save heroic stat filter
    sessionStorage.setItem('selectedHeroicStat', heroicDropdown.value);
    sessionStorage.setItem('heroicOperator', heroicOperator.value);
    sessionStorage.setItem('heroicValue', heroicValue.value);

    // Save modification filter
    sessionStorage.setItem('selectedMod', modDropdown.value);
    sessionStorage.setItem('modOperator', modOperator.value);
    sessionStorage.setItem('modValue', modValue.value);
}

// Attach change listeners to filter inputs
function setupStatFilterListeners() {
    const statDropdown = document.getElementById('istat1');
    const operatorDropdown = document.getElementById('istatComparison');
    const statValue = document.getElementById('istatValue');

    const resistDropdown = document.getElementById('iresists');
    const resistOperator = document.getElementById('iresistsComparison');
    const resistValue = document.getElementById('iresistsValue');

    const heroicDropdown = document.getElementById('iheroics');
    const heroicOperator = document.getElementById('iheroicsComparison');
    const heroicValue = document.getElementById('iheroicsValue');

    const modDropdown = document.getElementById('imod');
    const modOperator = document.getElementById('imodComparison');
    const modValue = document.getElementById('imodValue');

    // Attach listeners
    if (statDropdown) statDropdown.addEventListener('change', saveStatFilters);
    if (operatorDropdown) operatorDropdown.addEventListener('change', saveStatFilters);
    if (statValue) statValue.addEventListener('input', saveStatFilters);

    if (resistDropdown) resistDropdown.addEventListener('change', saveStatFilters);
    if (resistOperator) resistOperator.addEventListener('change', saveStatFilters);
    if (resistValue) resistValue.addEventListener('input', saveStatFilters);

    if (heroicDropdown) heroicDropdown.addEventListener('change', saveStatFilters);
    if (heroicOperator) heroicOperator.addEventListener('change', saveStatFilters);
    if (heroicValue) heroicValue.addEventListener('input', saveStatFilters);

    if (modDropdown) modDropdown.addEventListener('change', saveStatFilters);
    if (modOperator) modOperator.addEventListener('change', saveStatFilters);
    if (modValue) modValue.addEventListener('input', saveStatFilters);
}




// Add event listener to rows for item details loading
document.querySelectorAll('.item-row').forEach(row => {
    row.addEventListener('click', function(event) {
        // Your code to load item details
        const itemId = row.getAttribute('data-id');
        // For example: loadItemDetails(itemId);
        console.log(`Load item details for ID: ${itemId}`);
    });
});
