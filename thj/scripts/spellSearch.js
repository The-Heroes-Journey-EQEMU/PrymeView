// Function to load content for the spell search
function loadContentForSpellSearch(page) {
    const contentDisplay = document.getElementById('content-display');
    const detailsContainer = document.getElementById('details-container');
    const spellsWrapper = document.getElementById('spells-wrapper');
    const spellSearchContainer = document.getElementById('spell-search-container');

    if (contentDisplay) contentDisplay.style.display = 'none';
    if (detailsContainer) {
        detailsContainer.style.display = 'none';
        detailsContainer.innerHTML = ''; // Clear details container
    }
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

// Attach search listener for spell search form submission
function attachSpellSearchListener(spellSearchForm) {
    spellSearchForm.removeEventListener('submit', handleSpellSearch);
    spellSearchForm.addEventListener('submit', handleSpellSearch);

    function handleSpellSearch(event) {
        event.preventDefault();
        const searchQueryElement = document.querySelector('input[name="name"]');
        const selectedClassesElement = document.getElementById('selectedSpellClasses');
        const selectedLevelElement = document.querySelector('select[name="level"]');

        if (!searchQueryElement || !selectedClassesElement || !selectedLevelElement) {
            console.error("Required form elements for spell search are missing.");
            return;
        }

        const searchQuery = searchQueryElement.value.trim();
        const selectedClasses = selectedClassesElement.value;
        const selectedLevel = selectedLevelElement.value;

        if (!searchQuery && selectedClasses === '' && selectedLevel === '') {
            alert('Please enter a search term, select a class, or choose a level.');
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `spell_search.php?name=${encodeURIComponent(searchQuery)}&types=${encodeURIComponent(selectedClasses)}&level=${encodeURIComponent(selectedLevel)}`, true);

        xhr.onload = function () {
            const spellSearchContainer = document.getElementById('spell-search-container');
            spellSearchContainer.innerHTML = xhr.status === 200 ? xhr.responseText : 'Error loading spell search results.';
            setupSpellSearchListeners();
            const newSearchForm = document.querySelector('#spellSearchForm');
            if (newSearchForm) attachSpellSearchListener(newSearchForm);

            restoreSpellClassSelection();
        };

        xhr.send();
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

// Class selection function
function handleSpellClassSelection(event) {
    event.stopPropagation();
    const classId = this.getAttribute('data-class-id');
    selectSpellClass(classId, event);
}

let selectedClasses = []; // Array to hold selected class IDs

function selectSpellClass(classId, event) {
    console.log("Class selected:", classId);

    if (selectedClasses.includes(classId)) {
        selectedClasses = selectedClasses.filter(id => id !== classId);
        event.currentTarget.classList.remove('selected');
    } else {
        if (selectedClasses.length < 3) {
            selectedClasses.push(classId);
            event.currentTarget.classList.add('selected');
        } else {
            alert("You can select up to 3 classes only.");
            return;
        }
    }

    const selectedSpellClassesElement = document.getElementById('selectedSpellClasses');
    if (selectedSpellClassesElement) {
        selectedSpellClassesElement.value = selectedClasses.join(',');
    } else {
        console.error("Hidden input field for selected classes not found.");
    }

    sessionStorage.setItem('selectedSpellClasses', selectedClasses.join(','));
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

// Updated modal loading logic
function showSpellModal(itemId) {
    const modal = document.getElementById('spellModal');
    const modalContent = document.getElementById('spellModalContent');
    
    if (!modal || !modalContent) {
        console.error("Modal elements not found.");
        return;
    }

    modal.style.display = 'block';
    modalContent.innerHTML = "Loading...";

    fetch(`/thj/item_detail.php?id=${itemId}`) // Update URL to match correct path
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            modalContent.innerHTML = `
                <h2>${data.name}</h2>
                <img src="${data.icon_path}" alt="${data.name}" class="tooltip-item-icon">
                <p>${data.description}</p>
            `;
        })
        .catch(error => {
            console.error("Error loading item details:", error);
            modalContent.innerHTML = "Error loading item details.";
        });
}

function closeModal() {
    const modal = document.getElementById('spellModal');
    if (modal) {
        modal.style.display = 'none';
    }
}
