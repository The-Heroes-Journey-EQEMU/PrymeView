// Clear sessionStorage on full page reload and reset item type dropdown
if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
    sessionStorage.clear();
    const itemTypeDropdown = document.getElementById('item_type');
    if (itemTypeDropdown) itemTypeDropdown.value = '-1';
}

const slotPairs = { 15: 16, 16: 15, 1: 4, 4: 1, 9: 10, 10: 9 };
let selectedRowId = sessionStorage.getItem('selectedRowId') || null;
let selectedRace = null;
let selectedClass = null;
let selectedExpansion = null;

// This is the loadContent function for item search
function loadContentForItemSearch(page) {
    const contentDisplay = document.getElementById('content-display');
    const detailsContainer = document.getElementById('details-container');
    const upgradeTabContainer = document.querySelector('.upgrade-path-tab-container'); // Access the upgrade tab
    resetUpgradePathButton();
    if (!contentDisplay || !detailsContainer || !upgradeTabContainer) {
        console.error("Required containers or upgrade tab are missing from the DOM.");
        return;
    }

    // Hide the Upgrade Path tab initially
    upgradeTabContainer.style.display = 'none';

    if (page === 'item_search.php') {
        sessionStorage.clear();
        selectedRowId = null;
        console.log("Session storage cleared for item search.");
    }

    detailsContainer.innerHTML = '';
    detailsContainer.style.display = 'none';
    contentDisplay.innerHTML = '<p>Loading...</p>';

    fetch(`${page}?cb=${new Date().getTime()}`)
        .then(response => response.ok ? response.text() : Promise.reject(`HTTP error! Status: ${response.status}`))
        .then(data => {
            contentDisplay.innerHTML = data;
            setupListeners();

            const itemSearchForm = contentDisplay.querySelector('#searchForm');
            if (itemSearchForm) attachItemSearchListener(itemSearchForm);

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

// New loadContent function for spell search
function loadContentForSpellSearch(page, containerId = 'content-display') {
    const contentDisplay = document.getElementById(containerId);
    contentDisplay.innerHTML = '<p>Loading spell search...</p>';

    // Fetch the requested page content for spell search
    fetch(`${page}?cb=${new Date().getTime()}`)
        .then(response => response.ok ? response.text() : Promise.reject(`HTTP error! Status: ${response.status}`))
        .then(data => {
            contentDisplay.innerHTML = data;

            // Attach spell search form listener
            const spellSearchForm = contentDisplay.querySelector('#spellSearchForm');
            if (spellSearchForm) attachSpellSearchListener(spellSearchForm);
        })
        .catch(error => {
            console.error('Error loading spell search content:', error);
            contentDisplay.innerHTML = '<p>Error loading spell search content.</p>';
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
   
     
  
}

function toggleItemType() {
    const itemTypeSelection = document.getElementById('itemTypeSelection');
    const enableItemType = document.getElementById('enableItemType');

    if (itemTypeSelection && enableItemType) {
        itemTypeSelection.style.display = enableItemType.checked ? 'block' : 'none';
    } else {
        console.error("enableItemType checkbox or itemTypeSelection container not found");
    }
}

 

// Slot selection function with toggle capability, ensuring only one slot and its pair are selected
function toggleSlotSelection(slotNum) {
    const slotElement = document.getElementById(`slot_${slotNum}`);
    const pairedSlot = slotPairs[slotNum];
    const isSelected = slotElement.classList.contains('selected');

    console.log(`Slot ${slotNum} clicked. Currently selected: ${isSelected}`);

    // Deselect all slots first
    document.querySelectorAll('.slot-image').forEach(img => img.classList.remove('selected'));
    sessionStorage.removeItem('selectedSlot');
    sessionStorage.removeItem('selectedSlotPaired');

    if (!isSelected) {
        // Select the clicked slot and its pair
        slotElement.classList.add('selected');
        if (pairedSlot) document.getElementById(`slot_${pairedSlot}`).classList.add('selected');

        console.log(`Slot ${slotNum} and paired slot ${pairedSlot} selected.`);
        sessionStorage.setItem('selectedSlot', slotNum);
        if (pairedSlot) sessionStorage.setItem('selectedSlotPaired', pairedSlot);
    } else {
        console.log(`Slot ${slotNum} deselected.`);
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

// Class selection function with persistent storage
function selectClass(className, event) {
    document.getElementById('selectedClass').value = className;

    if (selectedClass) selectedClass.classList.remove('selected');
    selectedClass = event.currentTarget;
    selectedClass.classList.add('selected');

    sessionStorage.setItem('selectedClass', className);
}

// Race selection function with persistent storage
function selectRace(raceName, event) {
    document.getElementById('selectedRace').value = raceName;

    if (selectedRace) selectedRace.classList.remove('selected');
    selectedRace = event.currentTarget;
    selectedRace.classList.add('selected');

    sessionStorage.setItem('selectedRace', raceName);
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

// Expansion selection function
function selectExpansion(expansionId, event) {
    document.getElementById('selectedExpansion').value = expansionId;

    document.querySelectorAll('.expansion-icon-container').forEach(icon => icon.classList.remove('selected'));
    selectedExpansion = event.currentTarget;
    selectedExpansion.classList.add('selected');

    sessionStorage.setItem('selectedExpansion', expansionId);
}

// Function to restore previously selected options and row selection on page load
function restoreSelections() {
    const storedSlot = sessionStorage.getItem('selectedSlot');
    const storedSlotPaired = sessionStorage.getItem('selectedSlotPaired');
    const storedRace = sessionStorage.getItem('selectedRace');
    const storedClass = sessionStorage.getItem('selectedClass');
    const storedItemType = sessionStorage.getItem('selectedItemType');
    const storedExpansion = sessionStorage.getItem('selectedExpansion');

    if (storedSlot) toggleSlotSelection(storedSlot);
    if (storedSlotPaired) toggleSlotSelection(storedSlotPaired);
    if (storedRace) selectRace(storedRace, { currentTarget: document.querySelector(`[data-race-name="${storedRace}"]`) });
    if (storedClass) selectClass(storedClass, { currentTarget: document.querySelector(`[data-class-name="${storedClass}"]`) });
    if (storedExpansion) selectExpansion(storedExpansion, { currentTarget: document.querySelector(`[data-expansion-id="${storedExpansion}"]`) });
    if (storedItemType) {
        const itemTypeDropdown = document.getElementById('item_type');
        if (itemTypeDropdown) itemTypeDropdown.value = storedItemType;
    }

    if (selectedRowId) {
        const previouslySelectedRow = document.querySelector(`.item-row[data-id="${selectedRowId}"]`);
        if (previouslySelectedRow) previouslySelectedRow.classList.add('selected-row');
    }
}

// Attach search listener for item search form submission
function attachItemSearchListener(itemSearchForm) {
    itemSearchForm.removeEventListener('submit', handleItemSearch);
    itemSearchForm.addEventListener('submit', handleItemSearch);
}

function handleItemSearch(event) {
    event.preventDefault(); // Prevent page reload

    const searchQuery = document.getElementById('search').value.trim();
    const selectedSlot = sessionStorage.getItem('selectedSlot') || '';
    const selectedRace = sessionStorage.getItem('selectedRace') || '';
    const selectedClass = sessionStorage.getItem('selectedClass') || '';
    const selectedItemType = sessionStorage.getItem('selectedItemType') || '-1';
    const selectedExpansion = sessionStorage.getItem('selectedExpansion') || '';
    const focusEffectEnabled = document.getElementById('enableFocus') ? document.getElementById('enableFocus').checked : false;
    const selectedFocus = document.getElementById('focus_type') ? document.getElementById('focus_type').value : '';
    
    // Identify the correct rank dropdown based on the selected focus type
    let selectedRank = '';
    if (selectedFocus === '6') { // Assuming 6 is Enhanced Minion ID
        selectedRank = document.getElementById('focus_rank_enhanced_minion') ? document.getElementById('focus_rank_enhanced_minion').value : '';
    } else {
        selectedRank = document.getElementById('focus_rank_normal') ? document.getElementById('focus_rank_normal').value : '';
    }

    // Check if no search terms or filters are selected
    if (!searchQuery && !selectedSlot && !selectedRace && !selectedClass && selectedItemType === '-1' && !selectedExpansion && !(focusEffectEnabled && selectedFocus && selectedRank)) {
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

            // Reattach the search listener after loading new results
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







// Attach search listener for spell search form submission
function attachSpellSearchListener(spellSearchForm) {
    spellSearchForm.removeEventListener('submit', handleSpellSearch);
    spellSearchForm.addEventListener('submit', handleSpellSearch);

    function handleSpellSearch(event) {
        event.preventDefault();

        // Get the form inputs
        const searchQueryElement = document.querySelector('input[name="name"]');
        const selectedClassElement = document.querySelector('select[name="type"]');
        const selectedLevelElement = document.querySelector('select[name="level"]');

        // Check if elements are present
        if (!searchQueryElement || !selectedClassElement || !selectedLevelElement) {
            console.error("Required form elements for spell search are missing.");
            return;
        }

        const searchQuery = searchQueryElement.value.trim();
        const selectedClass = selectedClassElement.value;
        const selectedLevel = selectedLevelElement.value;

        // Validate form inputs
        if (!searchQuery && selectedClass == 0 && selectedLevel == 0) {
            alert('Please enter a search term, select a class, or choose a level.');
            return;
        }

        // AJAX request to spell_search.php using GET
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `spell_search.php?name=${encodeURIComponent(searchQuery)}&type=${encodeURIComponent(selectedClass)}&level=${encodeURIComponent(selectedLevel)}`, true);

        xhr.onload = function () {
            const contentDisplay = document.getElementById('content-display');
            contentDisplay.innerHTML = xhr.status === 200 ? xhr.responseText : 'Error loading spell search results.';
            setupListeners(); // Reattach listeners if needed

            // Reattach spell search listener after loading content if necessary
            const newSearchForm = document.querySelector('#spellSearchForm');
            if (newSearchForm) attachSpellSearchListener(newSearchForm);
        };

        xhr.send();
    }
}




// Set up listeners for race selection
function setupRaceListeners() {
    document.querySelectorAll('.race-icon-container').forEach(icon => {
        icon.addEventListener('click', function(event) {
            const raceName = this.getAttribute('data-race-name');
            selectRace(raceName, event);
        });
    });
}

// Set up listeners for class selection
function setupClassListeners() {
    document.querySelectorAll('.class-icon-container').forEach(icon => {
        icon.addEventListener('click', function(event) {
            const className = this.getAttribute('data-class-name');
            selectClass(className, event);
        });
    });
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

