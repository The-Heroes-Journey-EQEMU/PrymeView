// Clear sessionStorage on full page reload
if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
    sessionStorage.clear();
}

// Slot pairs for auto-selection (e.g., Ring 1 with Ring 2)
const slotPairs = {
    15: 16, // Ring 1 -> Ring 2
    16: 15, // Ring 2 -> Ring 1
    1: 4,   // Earring 1 -> Earring 2
    4: 1,   // Earring 2 -> Earring 1
    9: 10,  // Wrist 1 -> Wrist 2
    10: 9   // Wrist 2 -> Wrist 1
};

let selectedRowId = null;
let selectedRace = null;
let selectedClass = null;

function loadContent(page) {
    const contentDisplay = document.getElementById('content-display');
    const detailsContainer = document.getElementById('details-container');

    detailsContainer.innerHTML = '';
    detailsContainer.style.display = 'none';
    contentDisplay.innerHTML = '<p>Loading...</p>';

    const cacheBuster = new Date().getTime();

    fetch(`${page}?cb=${cacheBuster}`)
        .then(response => response.ok ? response.text() : Promise.reject(`HTTP error! status: ${response.status}`))
        .then(data => {
            contentDisplay.innerHTML = data;
            setupListeners();

            const searchForm = contentDisplay.querySelector('#searchForm');
            if (searchForm) attachSearchListener(searchForm);
        })
        .catch(error => {
            console.error('Fetch error:', error);
            contentDisplay.innerHTML = '<p>Error loading content.</p>';
        });
}

// Attach listeners on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    setupListeners();

    // Clear sessionStorage and load content if "Item Search" is clicked
    const itemSearchLink = document.getElementById('itemSearchLink');
    if (itemSearchLink) {
        itemSearchLink.addEventListener('click', function(event) {
            event.preventDefault();
            sessionStorage.clear();
            loadContent('item_search.php');
        });
    }
});

function setupListeners() {
    setupItemListeners();
    setupSlotListeners();
    setupRaceListeners();
    setupClassListeners();
    setupItemTypeListener(); // New listener for item type dropdown
    restoreSelections();
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

// Slot selection function with persistent storage and pair selection
function selectSlot(slotNum) {
    const pairedSlot = slotPairs[slotNum];

    // Clear previous selection
    document.querySelectorAll('.slot-image').forEach(img => img.classList.remove('selected'));

    // Highlight the selected slot and its pair
    document.getElementById(`slot_${slotNum}`).classList.add('selected');
    if (pairedSlot) {
        document.getElementById(`slot_${pairedSlot}`).classList.add('selected');
        sessionStorage.setItem('selectedSlotPaired', pairedSlot); // Store paired slot in session
    }

    // Store selected slot in session
    sessionStorage.setItem('selectedSlot', slotNum);
}

// Race selection function with persistent storage
function selectRace(raceName, event) {
    document.getElementById('selectedRace').value = raceName;

    if (selectedRace) selectedRace.classList.remove('selected');
    selectedRace = event.currentTarget;
    selectedRace.classList.add('selected');

    sessionStorage.setItem('selectedRace', raceName);
}

// Class selection function with persistent storage
function selectClass(className, event) {
    document.getElementById('selectedClass').value = className;

    if (selectedClass) selectedClass.classList.remove('selected');
    selectedClass = event.currentTarget;
    selectedClass.classList.add('selected');

    sessionStorage.setItem('selectedClass', className);
}

// Set up listeners for slot selection
function setupSlotListeners() {
    document.querySelectorAll('.slot-image').forEach(img => {
        img.addEventListener('click', function() {
            const slotNum = this.getAttribute('data-slot-num');
            selectSlot(slotNum);
        });
    });
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

// Restore selections based on sessionStorage values
function restoreSelections() {
    const storedSlot = sessionStorage.getItem('selectedSlot');
    const storedSlotPaired = sessionStorage.getItem('selectedSlotPaired');
    const storedRace = sessionStorage.getItem('selectedRace');
    const storedClass = sessionStorage.getItem('selectedClass');
    const storedItemType = sessionStorage.getItem('selectedItemType'); // Restore item type selection

    if (storedSlot) selectSlot(storedSlot);
    if (storedSlotPaired) {
        const pairedSlot = slotPairs[storedSlot];
        if (pairedSlot !== undefined) selectSlot(pairedSlot);
    }
    if (storedRace) {
        document.querySelectorAll('.race-icon-container').forEach(icon => {
            if (icon.getAttribute('data-race-name') === storedRace) {
                selectRace(storedRace, { currentTarget: icon });
            }
        });
    }
    if (storedClass) {
        document.querySelectorAll('.class-icon-container').forEach(icon => {
            if (icon.getAttribute('data-class-name') === storedClass) {
                selectClass(storedClass, { currentTarget: icon });
            }
        });
    }
    if (storedItemType) {
        document.getElementById('item_type').value = storedItemType;
    }
}

// Attach search form submit listener
function attachSearchListener(searchForm) {
    searchForm.removeEventListener('submit', handleSearch);
    searchForm.addEventListener('submit', handleSearch);

    function handleSearch(event) {
        event.preventDefault();
        const searchQuery = document.getElementById('search').value.trim();
        const selectedSlot = sessionStorage.getItem('selectedSlot') || ''; // Retrieve from sessionStorage
        const selectedRace = sessionStorage.getItem('selectedRace') || ''; // Retrieve from sessionStorage
        const selectedClass = sessionStorage.getItem('selectedClass') || ''; // Retrieve from sessionStorage
        const selectedItemType = sessionStorage.getItem('selectedItemType') || ''; // Retrieve item type from sessionStorage

        if (!searchQuery && !selectedSlot && !selectedRace && !selectedClass && selectedItemType === '-1') {
            alert('Please enter a search term, select a slot, or choose a race/class/item type.');
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'item_search.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onload = function() {
            const contentDisplay = document.getElementById('content-display');
            contentDisplay.innerHTML = xhr.status === 200 ? xhr.responseText : 'Error loading results.';
            setupListeners();

            const newSearchForm = document.querySelector('#searchForm');
            if (newSearchForm) attachSearchListener(newSearchForm);
        };

        let requestBody = `search_term=${encodeURIComponent(searchQuery)}&search=1`;
        if (selectedSlot) requestBody += `&slot=${encodeURIComponent(selectedSlot)}`;
        if (selectedRace) requestBody += `&race=${encodeURIComponent(selectedRace)}`;
        if (selectedClass) requestBody += `&class=${encodeURIComponent(selectedClass)}`;
        if (selectedItemType !== '-1') requestBody += `&item_type=${encodeURIComponent(selectedItemType)}`; // Add item type to request

        xhr.send(requestBody);
    }
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

// Function to load item details
function loadItemDetails(itemId) {
    fetch(`item_detail.php?id=${itemId}`)
        .then(response => response.text())
        .then(data => {
            const detailsContainer = document.getElementById('details-container');
            detailsContainer.innerHTML = data;
            detailsContainer.style.display = 'block';
        })
        .catch(error => console.error('Error fetching item details:', error));
}

// Button animation
document.querySelector('.search-form button').addEventListener('click', function() {
    this.classList.remove('animate');
    void this.offsetWidth; // Trigger reflow
    this.classList.add('animate');
});
