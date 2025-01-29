function loadContentForAASearch(page) {
    console.log("Loading AA search content from:", page); // Debug log

    const aaWrapper = document.getElementById('aa-wrapper');
    const aaSearchContainer = document.getElementById('aa-search-container');

    // Hide other content
    document.getElementById('content-display')?.style.setProperty('display', 'none');
    document.getElementById('details-container')?.style.setProperty('display', 'none');
    document.getElementById('spells-wrapper')?.style.setProperty('display', 'none');

    // Show AA wrapper and set loading state
    if (aaWrapper) {
        console.log("Displaying AA wrapper.");
        aaWrapper.style.display = 'block';
    }
    if (aaSearchContainer) {
        console.log("Displaying AA search container.");
        aaSearchContainer.style.display = 'block';
        aaSearchContainer.innerHTML = '<p>Loading AA search...</p>';
    }

    // Fetch AA search content
    fetch(page)
        .then(response => {
            console.log("Response status:", response.status);
            return response.ok ? response.text() : Promise.reject(`HTTP error! Status: ${response.status}`);
        })
        .then(data => {
            console.log("Fetched AA search data:", data);
            if (aaSearchContainer) {
                aaSearchContainer.innerHTML = data;

                // Set up AA search listeners (if needed)
                if (typeof setupAASearchListeners === 'function') {
                    console.log("Setting up AA search listeners.");
                    setupAASearchListeners();
                    setupAAClassListeners();
                }
            }
        })
        .catch(error => {
            console.error("Error loading AA search content:", error);
            if (aaSearchContainer) {
                aaSearchContainer.innerHTML = '<p>Error loading AA search content.</p>';
            }
        });
}



// Set up listeners specific to AA search
function setupAASearchListeners() {
    setupAAClassListeners();
}

let selectedAAClasses = []; // Array to hold selected class IDs

// Function to set up class listeners for the AA page
function setupAAClassListeners() {
    document.querySelectorAll('.aa-class-icon-container').forEach(icon => {
        icon.removeEventListener('click', handleAAClassSelection); // Remove existing listeners
        icon.addEventListener('click', handleAAClassSelection); // Attach new listener
    });
}

function handleAAClassSelection(event) {
    const classId = parseInt(this.getAttribute('data-class-id'), 10); // Get the correct bitmask

    if (selectedAAClasses.includes(classId)) {
        // Remove class if already selected
        selectedAAClasses = selectedAAClasses.filter(id => id !== classId);
        this.classList.remove('selected');
        console.log(`Class unselected: ${classId}`);
    } else if (selectedAAClasses.length < 3) {
        // Add class if less than 3 selected
        selectedAAClasses.push(classId);
        this.classList.add('selected');
        console.log(`Class selected: ${classId}`);
    } else {
        alert('You can select up to 3 classes only.');
        return;
    }

    // Calculate the combined bitmask
    const combinedBitmask = selectedAAClasses.reduce((bitmask, id) => bitmask | id, 0);

    // Log the selected classes and combined bitmask for debugging
    console.log(`Selected Classes: ${selectedAAClasses}`);
    console.log(`Combined Bitmask: ${combinedBitmask}`);

    // Update the hidden input for form submission
    const selectedAAClassesElement = document.getElementById('selectedAAClasses');
    if (selectedAAClassesElement) {
        selectedAAClassesElement.value = selectedAAClasses.join(','); // Store class IDs
    }

    // Save the combined bitmask and selected classes to session storage
    sessionStorage.setItem('selectedAAClasses', JSON.stringify(selectedAAClasses));
    sessionStorage.setItem('combinedBitmask', combinedBitmask);
}

// Restore class selection on page load
function restoreAAClassSelection() {
    const storedClasses = JSON.parse(sessionStorage.getItem('selectedAAClasses')) || [];
    selectedAAClasses = storedClasses;

    // Highlight previously selected classes
    document.querySelectorAll('.aa-class-icon-container').forEach(el => {
        const classId = parseInt(el.getAttribute('data-class-id'), 10);
        if (selectedAAClasses.includes(classId)) {
            el.classList.add('selected');
        }
    });

    const selectedAAClassesElement = document.getElementById('selectedAAClasses');
    if (selectedAAClassesElement) {
        selectedAAClassesElement.value = selectedAAClasses.join(',');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    restoreAAClassSelection();
    setupAAClassListeners();
});

document.addEventListener('DOMContentLoaded', restoreAAClassSelection);




// FECTCH DATA

function fetchAASearchResults(event) {
    event.preventDefault();

    // Clear session storage at the beginning of a new search
    sessionStorage.removeItem('selectedAAClasses');
    sessionStorage.removeItem('combinedBitmask');
    console.log("Session storage cleared for new search.");

    // Get the AA name input (allow empty input)
    const nameInputElement = document.getElementById("aa-search-input");
    const nameInput = nameInputElement ? nameInputElement.value.trim() : '';

    // Get selected class IDs (check if the element exists)
    const selectedClassesElement = document.getElementById("selectedAAClasses");
    const selectedClasses = selectedClassesElement ? selectedClassesElement.value : '';

    // Construct the query string
    const queryParams = new URLSearchParams({
        name: nameInput || '', // Allow empty name input
        classes: selectedClasses, // Send raw class IDs
    });

    // Fetch the search results
    fetch(`/aa_search_results.php?${queryParams.toString()}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("Fetched AA search results:", data);

            // Clear previous results in all tabs
            document.getElementById("aa-general-results").innerHTML = "";
            document.getElementById("aa-archetype-results").innerHTML = "";
            document.getElementById("aa-class-results").innerHTML = "";
            document.getElementById("dynamic-class-tabs").innerHTML = "";
            document.getElementById("dynamic-tabs-content").innerHTML = "";

            // Populate General tab
            if (data.general && data.general.length > 0) {
                data.general.forEach((item) => {
                    document.getElementById("aa-general-results").innerHTML += `
                        <tr class="aa-row" data-id="${item.id}" onclick="showAADetails(${item.id})">
                            <td>${item.id}</td>
                            <td>${item.name}</td>
                            <td>${item.decoded_classes}</td>
                        </tr>`;
                });
            } else {
                document.getElementById("aa-general-results").innerHTML = `
                    <tr>
                        <td colspan="3" class="placeholder-text">No results found in General.</td>
                    </tr>`;
            }

            // Populate Archetype tab
            if (data.archetype && data.archetype.length > 0) {
                data.archetype.forEach((item) => {
                    document.getElementById("aa-archetype-results").innerHTML += `
                        <tr class="aa-row" data-id="${item.id}" onclick="showAADetails(${item.id})">
                            <td>${item.id}</td>
                            <td>${item.name}</td>
                            <td>${item.decoded_classes}</td>
                        </tr>`;
                });
            } else {
                document.getElementById("aa-archetype-results").innerHTML = `
                    <tr>
                        <td colspan="3" class="placeholder-text">No results found in Archetype.</td>
                    </tr>`;
            }

            // Populate Class tab
            if (data.class && data.class.length > 0) {
                data.class.forEach((item) => {
                    document.getElementById("aa-class-results").innerHTML += `
                        <tr class="aa-row" data-id="${item.id}" onclick="showAADetails(${item.id})">
                            <td>${item.id}</td>
                            <td>${item.name}</td>
                            <td>${item.decoded_classes}</td>
                        </tr>`;
                });
            } else {
                document.getElementById("aa-class-results").innerHTML = `
                    <tr>
                        <td colspan="3" class="placeholder-text">No results found in Class.</td>
                    </tr>`;
            }

            // Handle dynamic tabs for selected classes
            if (data.dynamic) {
                setupDynamicTabs(data.dynamic);
            } else {
                console.error("No dynamic data in response.");
            }
        })
        .catch((error) => {
            console.error("Error fetching AA search results:", error);
            alert("Failed to fetch results. Check the console for details.");
        });
}






function openAATab(event, tabId) {
    // Hide all tab contents
    document.querySelectorAll('.aa-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.aa-tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Show the selected tab and mark the button as active
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

function setupDynamicTabs(dynamicData) {
    const dynamicClassTabs = document.getElementById("dynamic-class-tabs");
    const dynamicTabsContent = document.getElementById("dynamic-tabs-content");

    if (!dynamicClassTabs || !dynamicTabsContent) {
        console.error("Dynamic tabs or content containers not found in the DOM.");
        return;
    }

    // Clear existing dynamic tabs and content
    dynamicClassTabs.innerHTML = "";
    dynamicTabsContent.innerHTML = "";

    // Populate dynamic tabs
    if (dynamicData.allClasses && Array.isArray(dynamicData.allClasses)) {
        const allClassesTabContent = document.createElement("div");
        allClassesTabContent.id = "aa-class";
        allClassesTabContent.className = "aa-tab-content";
        allClassesTabContent.innerHTML = `
            <table class="aa-results-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Classes</th>
                    </tr>
                </thead>
                <tbody>
                    ${dynamicData.allClasses
                        .map(
                            (item) => `
                            <tr class="aa-row" data-id="${item.id}" data-tab-id="aa-class" onclick="showAADetails(${item.id}, 'aa-class')">
                                <td>${item.id}</td>
                                <td>${item.name}</td>
                                <td>${item.decoded_classes}</td>
                            </tr>`
                        )
                        .join("")}
                </tbody>
            </table>
        `;
        dynamicTabsContent.appendChild(allClassesTabContent);
    }

    const selectedClasses = dynamicData.selectedClasses;
    if (selectedClasses && Object.keys(selectedClasses).length > 1) {
        Object.values(selectedClasses).forEach((classData) => {
            const { className, classId, aaList } = classData;

            // Create a new tab button
            const tabButton = document.createElement("button");
            tabButton.className = "aa-tab-button";
            tabButton.textContent = `${className} Only`;
            tabButton.onclick = (event) =>
                openAATab(event, `dynamic-tab-${classId}`);

            dynamicClassTabs.appendChild(tabButton);

            // Create the content container for the tab
            const tabContent = document.createElement("div");
            tabContent.id = `dynamic-tab-${classId}`;
            tabContent.className = "aa-tab-content";
            tabContent.innerHTML = `
                <table class="aa-results-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Classes</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${aaList
                            .map(
                                (item) => `
                                <tr class="aa-row" data-id="${item.id}" data-tab-id="dynamic-tab-${classId}" onclick="showAADetails(${item.id}, 'dynamic-tab-${classId}')">
                                    <td>${item.id}</td>
                                    <td>${item.name}</td>
                                    <td>${item.decoded_classes}</td>
                                </tr>`
                            )
                            .join("")}
                    </tbody>
                </table>
            `;
            dynamicTabsContent.appendChild(tabContent);
        });
    }
}





document.addEventListener("DOMContentLoaded", () => {
    // Clear session storage on page load
    sessionStorage.removeItem("selectedAAClasses");
    sessionStorage.removeItem("combinedBitmask");
    console.log("Session storage cleared on page load.");

    // Restore class selection and listeners
    restoreAAClassSelection();
    setupAAClassListeners();
});

function showAADetails(aaId, tabId = null) {
    console.log("AA ID:", aaId, "Tab ID:", tabId);

    // Determine the tab content element
    let tabContent;
    if (tabId) {
        tabContent = document.getElementById(tabId);
    } else {
        // If no tabId is provided, find the closest parent .aa-tab-content
        const clickedRow = document.querySelector(`.aa-row[data-id="${aaId}"]`);
        if (!clickedRow) {
            console.error("Clicked row not found for AA ID:", aaId);
            return;
        }
        tabContent = clickedRow.closest(".aa-tab-content");
    }

    if (!tabContent) {
        console.error("Tab content not found for Tab ID:", tabId || "Default");
        return;
    }

    // Find the row where the click occurred
    const clickedRow = tabContent.querySelector(`.aa-row[data-id="${aaId}"]`);
    if (!clickedRow) {
        console.error("Clicked row not found for AA ID:", aaId);
        return;
    }

    // Check if a detail panel already exists
    let detailPanel = clickedRow.nextElementSibling;
    if (detailPanel && detailPanel.classList.contains("aa-detail-row")) {
        // If the panel already exists, toggle it
        detailPanel.classList.toggle("open");
        return;
    }

    // Remove any existing detail panels in this tab
    tabContent.querySelectorAll(".aa-detail-row").forEach((panel) =>
        panel.remove()
    );

    // Create a new detail panel row
    detailPanel = document.createElement("tr");
    detailPanel.className = "aa-detail-row";
    detailPanel.innerHTML = `
        <td colspan="3">
            <div class="aa-detail-panel-content">Loading...</div>
        </td>
    `;

    // Insert the detail panel row after the clicked row
    clickedRow.parentNode.insertBefore(detailPanel, clickedRow.nextSibling);

    // Fetch the AA details from the server
    fetch(`/aa_details.php?id=${aaId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.text();
        })
        .then((html) => {
            console.log("Fetched HTML:", html); // Debug log
            const content = detailPanel.querySelector(".aa-detail-panel-content");
            if (!content) {
                console.error("Content element not found in detail panel.");
                return;
            }
            content.innerHTML = html; // Populate the panel
            detailPanel.classList.add("open"); // Expand the panel
        })
        .catch((error) => {
            console.error("Error fetching AA details:", error);
            detailPanel.querySelector(".aa-detail-panel-content").innerHTML =
                "Error loading details.";
        });
}


function toggleDropdown(element) {
    const dropdownContent = element.nextElementSibling;

    if (!dropdownContent || !dropdownContent.classList.contains('dropdown-content')) {
        return;
    }

    const isVisible = dropdownContent.style.display === 'block';
    dropdownContent.style.display = isVisible ? 'none' : 'block';

    
}


document.querySelectorAll('.spell-link').forEach(link => {
    link.addEventListener('click', function() {
        const spellId = this.getAttribute('data-spell-id');
        fetch(`/aa_spell_details.php?id=${spellId}`)
            .then(response => response.text())
            .then(html => {
                const popup = document.createElement('div');
                popup.className = 'spell-popup';
                popup.innerHTML = html + '<button onclick=\"this.parentNode.remove();\">Close</button>';
                document.body.appendChild(popup);
            })
            .catch(error => console.error('Error fetching spell details:', error));
    });
});

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (event) => {
        if (event.target.classList.contains("spell-link")) {
            event.preventDefault();

            const spellId = event.target.getAttribute("data-spell-id");
            const spellDetailsDiv = document.getElementById(`spell-details-${spellId}`);

            if (!spellId || !spellDetailsDiv) {
                console.error("Spell ID or details container is missing.");
                return;
            }

            // Toggle the visibility of the spell details
            if (spellDetailsDiv.style.display === "block") {
                spellDetailsDiv.style.display = "none";
                return;
            }

            // If already loaded, simply show it
            if (spellDetailsDiv.innerHTML.trim() !== "") {
                spellDetailsDiv.style.display = "block";
                return;
            }

            // Fetch spell details
            fetch(`/aa_spell_details.php?id=${spellId}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch spell details: ${response.status}`);
                    }
                    return response.text();
                })
                .then((html) => {
                    // Insert fetched details into the container
                    spellDetailsDiv.innerHTML = html;
                    spellDetailsDiv.style.display = "block"; // Show the container
                })
                .catch((error) => {
                    console.error("Error fetching spell details:", error);
                    spellDetailsDiv.innerHTML = "<p>Error loading spell details.</p>";
                    spellDetailsDiv.style.display = "block"; // Show the container with the error message
                });
        }
    });
});


function copyAACommandToClipboard(element) {
    const text = element.textContent;

    // Attempt to use the modern Clipboard API (works only in HTTPS)
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
            .then(() => showToast("Copied: " + text))
            .catch(err => {
                console.error("Clipboard API failed, using fallback:", err);
                fallbackCopyText(text);
            });
    } else {
        // Use fallback for HTTP or older browsers
        fallbackCopyText(text);
    }
}

// Fallback method using a temporary textarea
function fallbackCopyText(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed"; // Prevent scrolling to textarea
    textarea.style.opacity = "0"; // Hide it from view
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand("copy");
        showToast("Copied: " + text);
    } catch (err) {
        console.error("Fallback copy failed:", err);
    }
    
    document.body.removeChild(textarea);
}

// Toast notification function
function showToast(message) {
    const toast = document.getElementById("toast-container");
    const toastMessage = document.getElementById("toast-message");

    if (!toast || !toastMessage) {
        console.error("Toast container not found.");
        return;
    }

    toastMessage.textContent = message;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}
