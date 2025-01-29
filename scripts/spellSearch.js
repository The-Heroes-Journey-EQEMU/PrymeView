// Function to load content for the spell search
document.addEventListener('DOMContentLoaded', () => {
    // Apply hover listeners globally when the page loads
    setupItemHoverListener();
});

function loadContentForSpellSearch(page) {
    clearSpellSearchSessionStorage(); // Clear spell-related session storage

    const contentDisplay = document.getElementById('content-display');
    const detailsContainer = document.getElementById('details-container');
    const spellsWrapper = document.getElementById('spells-wrapper');
    const spellSearchContainer = document.getElementById('spell-search-container');
    const aaWrapper = document.getElementById('aa-wrapper');

    if (contentDisplay) contentDisplay.style.display = 'none';
        if (detailsContainer) {
            detailsContainer.style.display = 'none';
            detailsContainer.innerHTML = ''; // Clear details container
        }
    if (aaWrapper) aaWrapper.style.display = 'none';
    if (spellsWrapper) spellsWrapper.style.display = 'block';

    if (spellSearchContainer) {
        spellSearchContainer.style.display = 'block';
        spellSearchContainer.innerHTML = '<p>Loading spell search...</p>';
    }

    fetch(`${page}?cb=${new Date().getTime()}`)
        .then(response => response.ok ? response.text() : Promise.reject(`HTTP error! Status: ${response.status}`))
        .then(data => {
            if (spellSearchContainer) {
                spellSearchContainer.innerHTML = data;
            }

            const spellSearchForm = spellSearchContainer.querySelector('#spellSearchForm');
            if (spellSearchForm) {
                attachSpellSearchListener(spellSearchForm);
            }
            restoreSpellClassSelection();
        })
        .catch(error => {
            console.error('Error loading spell search content:', error);
            if (spellSearchContainer) {
                spellSearchContainer.innerHTML = '<p>Error loading spell search content.</p>';
            }
        });
}


function attachSpellSearchListener(spellSearchForm) {
    // Remove existing listener to avoid duplicates
    spellSearchForm.removeEventListener('submit', handleSpellSearch);
    spellSearchForm.addEventListener('submit', handleSpellSearch);

    function handleSpellSearch(event) {
        event.preventDefault(); // Prevent form submission
    
        // Get references to form elements
        const searchQueryElement = document.querySelector('input[name="name"]');
        const selectedClassesElement = document.getElementById('selectedSpellClasses');
        const selectedLevelElement = document.querySelector('select[name="level"]');
        const levelFilterElement = document.querySelector('select[name="level_filter"]');
    
        // Extract values from the form elements
        const searchQuery = searchQueryElement ? searchQueryElement.value.trim() : '';
        const selectedClasses = selectedClassesElement && selectedClassesElement.value.trim() !== ''
            ? selectedClassesElement.value
            : ''; // Pass empty string if no classes are selected
        const selectedLevel = selectedLevelElement ? selectedLevelElement.value : '';
        const levelFilter = levelFilterElement ? levelFilterElement.value : '';
    
        // Show a warning if all fields are empty
        if (!searchQuery && selectedClasses === '' && selectedLevel === '') {
            alert('Please enter a search term, select a class, or choose a level.');
            return;
        }
    
        // Construct the AJAX request
        const xhr = new XMLHttpRequest();
        xhr.open(
            'POST',
            `spell_search.php?name=${encodeURIComponent(searchQuery)}&types=${encodeURIComponent(selectedClasses)}&level=${encodeURIComponent(selectedLevel)}&level_filter=${encodeURIComponent(levelFilter)}`,
            true
        );
    
        xhr.onload = function () {
            const spellSearchContainer = document.getElementById('spell-search-container');
            if (xhr.status === 200) {
                // Display the response
                spellSearchContainer.innerHTML = xhr.responseText;
                setupSpellSearchListeners(); // Reattach listeners for new elements
                const newSearchForm = document.querySelector('#spellSearchForm');
                if (newSearchForm) attachSpellSearchListener(newSearchForm); // Reattach listener for the new form
                restoreSpellClassSelection(); // Restore class selection if needed
            } else {
                spellSearchContainer.innerHTML = 'Error loading spell search results.';
                console.error('Error:', xhr.responseText);
            }
        };
    
        xhr.send(); // Send the request
    }
    
    
}


// Set up listeners specific to spell search
function setupSpellSearchListeners() {
    setupSpellClassListeners();
}

// Function to set up class listeners
function setupSpellClassListeners() {
    document.querySelectorAll('.spell-class-icon-container').forEach(icon => {
        icon.removeEventListener('click', handleSpellClassSelection);
        icon.addEventListener('click', handleSpellClassSelection);
    });
}

function handleSpellClassSelection(event) {
    const classId = this.getAttribute('data-class-id');
    if (selectedSpellClasses.includes(classId)) {
        selectedSpellClasses = selectedSpellClasses.filter(id => id !== classId);
        this.classList.remove('selected');
    } else if (selectedSpellClasses.length < 3) {
        selectedSpellClasses.push(classId);
        this.classList.add('selected');
    } else {
        alert('You can select up to 3 classes only.');
    }

    const selectedSpellClassesElement = document.getElementById('selectedSpellClasses');
    if (selectedSpellClassesElement) {
        selectedSpellClassesElement.value = selectedSpellClasses.join(',');
    }

    sessionStorage.setItem('selectedSpellClasses', selectedSpellClasses.join(',')); // Save to session storage
}


let selectedSpellClasses = []; // Array to hold selected class IDs

function selectSpellClass(classId, event) {
    console.log("Class selected:", classId);

    if (selectedSpellClasses.includes(classId)) {
        // Remove the class from the selected list
        selectedSpellClasses = selectedSpellClasses.filter(id => id !== classId);
        event.currentTarget.classList.remove('selected');
    } else {
        if (selectedSpellClasses.length < 3) {
            // Add the class to the selected list
            selectedSpellClasses.push(classId);
            event.currentTarget.classList.add('selected');
        } else {
            alert("You can select up to 3 classes only."); // Restrict selection to a maximum of 3
            return;
        }
    }

    // Update the hidden input field for selected classes
    const selectedSpellClassesElement = document.getElementById('selectedSpellClasses');
    if (selectedSpellClassesElement) {
        selectedSpellClassesElement.value = selectedSpellClasses.join(',');
    }

    // Save the selection to session storage (optional)
    sessionStorage.setItem('selectedSpellClasses', selectedSpellClasses.join(','));
}


// Restore selection on page load
function restoreSpellClassSelection() {
    const storedClasses = sessionStorage.getItem('selectedSpellClasses');
    if (storedClasses) {
        selectedClasses = storedClasses.split(',').map(Number);
        document.querySelectorAll('.spell-class-icon-container').forEach(el => {
            const classId = parseInt(el.getAttribute('data-class-id'), 10);
            if (selectedClasses.includes(classId)) {
                el.classList.add('selected');
            }
        });
        const selectedSpellClassesElement = document.getElementById('selectedSpellClasses');
        if (selectedSpellClassesElement) {
            selectedSpellClassesElement.value = storedClasses;
        }
    }
}

document.addEventListener('DOMContentLoaded', restoreSpellClassSelection);


window.showSpellDetails = function (spellId) {
    // Find the row where the click occurred
    const clickedRow = document.querySelector(`.spell-row[data-id="${spellId}"]`);
    if (!clickedRow) {
        console.error("Clicked row not found for spell ID:", spellId);
        return;
    }

    // Check if a detail panel already exists
    let detailPanel = clickedRow.nextElementSibling;
    if (detailPanel && detailPanel.classList.contains('spell-detail-row')) {
        // If the panel already exists, toggle it
        detailPanel.classList.toggle('open');
        return;
    }

    // Remove any existing detail panels
    document.querySelectorAll('.spell-detail-row').forEach(panel => panel.remove());

    // Create a new detail panel row
    detailPanel = document.createElement('tr');
    detailPanel.className = 'spell-detail-row';
    detailPanel.innerHTML = `
        <td colspan="8">
            <div class="spell-detail-panel-content">Loading...</div>
        </td>
    `;

    // Insert the detail panel row after the clicked row
    clickedRow.parentNode.insertBefore(detailPanel, clickedRow.nextSibling);

    fetch(`/spell_detail.php?id=${spellId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(html => {
        console.log("Fetched HTML:", html); // Debug log
        const content = detailPanel.querySelector('.spell-detail-panel-content');
        if (!content) {
            console.error("Content element not found in detail panel.");
            return;
        }
        content.innerHTML = html; // Populate the panel
        detailPanel.classList.add('open'); // Expand the panel
    })
    .catch(error => {
        console.error('Error fetching spell details:', error);
        detailPanel.querySelector('.spell-detail-panel-content').innerHTML = 'Error loading details.';
    });

};


function loadVendors() {
    console.log("Loading vendors...");
    const spellDetailContainer = document.querySelector('.spell-detail-container');
    const spellId = spellDetailContainer?.getAttribute('data-spell-id');

    if (!spellId) {
        console.error("Spell ID is missing in loadVendors.");
        return;
    }

    console.log("Spell ID in loadVendors:", spellId);

    const vendorResults = document.getElementById('vendorResults');

    fetch(`/get_spell_vendors.php?id=${spellId}`)
        .then(response => response.json())
        .then(data => {
            console.log("Vendor data:", data);
            if (data.error) {
                vendorResults.innerHTML = `<li>${data.error}</li>`;
            } else if (data.length > 0) {
                // Group vendors by zone
                const vendorsByZone = data.reduce((acc, vendor) => {
                    if (!acc[vendor.zone_name]) {
                        acc[vendor.zone_name] = [];
                    }
                    const x = isNaN(parseFloat(vendor.x)) ? 0.00 : parseFloat(vendor.x).toFixed(2);
                    const y = isNaN(parseFloat(vendor.y)) ? 0.00 : parseFloat(vendor.y).toFixed(2);
                    const z = isNaN(parseFloat(vendor.z)) ? 0.00 : parseFloat(vendor.z).toFixed(2);
                    const formattedLocation = `X: ${x}, Y: ${y}, Z: ${z}`;
                    acc[vendor.zone_name].push({
                        name: vendor.npc_name,
                        location: formattedLocation
                    });
                    return acc;
                }, {});

                vendorResults.innerHTML = Object.entries(vendorsByZone)
                .map(([zone, vendors]) => `
                    <li>
                        <strong class="zone-name">${zone}</strong>
                        <ul class="zone-vendors">
                            ${vendors.map(vendor => `
                                <li class="vendor-name">
                                    ${vendor.name} <span class="vendor-location">(Location: ${vendor.location})</span>
                                </li>
                            `).join('')}
                        </ul>
                    </li>
                `)
                .join('');
            } else {
                vendorResults.innerHTML = '<li>No vendors found for this spell.</li>';
            }
        })
        .catch(error => {
            console.error('Error loading vendors:', error);
            vendorResults.innerHTML = '<li>Error loading vendor data.</li>';
        });
}





function loadItemsWithEffect() {
    console.log("Loading items with this effect...");
    const spellDetailContainer = document.querySelector('.spell-detail-container');
    const spellId = spellDetailContainer?.getAttribute('data-spell-id');

    if (!spellId) {
        console.error("Spell ID is missing in loadItemsWithEffect.");
        return;
    }

    console.log("Spell ID in loadItemsWithEffect:", spellId);

    const itemResults = document.getElementById('itemResults');

    fetch(`/get_items_with_effect.php?id=${spellId}`)
        .then(response => response.json())
        .then(data => {
            console.log("Item data:", data);
            if (data.error) {
                itemResults.innerHTML = `<li>${data.error}</li>`;
            } else if (data.length > 0) {
                // Render item rows
                itemResults.innerHTML = data.map(item => {
                    const classes = item.classes ? `<span class="item-classes">${item.classes}</span>` : ''; // Check if classes are available
                    return `
                        <li class="item-row">
                            <div class="item-content">
                                <div class="${item.icon_class} hover-image" 
                                     style="display: inline-block; height: 40px; width: 40px;" 
                                     data-item-id="${item.id}"
                                     title="${item.name}">
                                </div>
                                <span class="item-name">${item.name}</span>
                                ${classes ? `<div class="item-class">${classes}</div>` : ''}
                            </div>
                        </li>
                    `;
                }).join('');

                // Initialize tooltip on newly added items
                setupItemHoverListener();
            } else {
                itemResults.innerHTML = '<li>No items found with this effect.</li>';
            }
        })
        .catch(error => {
            console.error('Error loading items:', error);
            itemResults.innerHTML = '<li>Error loading item data.</li>';
        });
}

function openTab(event, tabId) {
    console.log("Tab clicked:", tabId);

    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Show the selected tab and mark the button as active
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');

    // Trigger additional actions for specific tabs
    if (tabId === 'vendors') {
        loadVendors();
    } else if (tabId === 'items') {
        loadItemsWithEffect();
    }
}

function clearSpellSearchSessionStorage() {
    const keysToClear = ['selectedSpellClasses', 'spellSearchQuery'];
    keysToClear.forEach(key => sessionStorage.removeItem(key));
}

function resetSpellSearchState() {
    selectedSpellClasses = []; // Reset spell-specific classes
}




