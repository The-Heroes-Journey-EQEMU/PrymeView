// This script contains the code to input the information from the hover tool to the details page
// It also handles the upgrade view for all three versions
// Additionally, it contains code for the NPC page and button. The NPC query itself lives in the item_detail.php.

function loadItemDetails(itemId) {
    const upgradeTabContainer = document.querySelector('.upgrade-path-tab-container');

    // Hide upgrade tab on new load
    if (upgradeTabContainer) {
        upgradeTabContainer.style.display = 'none'; // Hide upgrade button initially
    }

    // Fetch the base item details
    fetch(`item_detail.php?id=${itemId}`)
        .then(response => response.json())
        .then(baseData => {
            const detailsContainer = document.getElementById('details-container');

            // Inject item details into the details container
            detailsContainer.innerHTML = `
                <div class="item-version">
                    ${generateTooltipContent(baseData)}
                </div>
                <div class="button-container">
                    <button id="toggle-npc-info" class="toggle-npc-info">&larr; View NPC Info</button>
                    <button id="upgrade-path-button" class="upgrade-path-button">Upgrade Path</button>
                </div>
            `;
            /* // Call function to position the upgrade tab in the middle
            positionUpgradeTab(); // Call this after the content is injected */
            
            // Make sure the upgrade button is visible and functional
            // Add event listener for Upgrade Path button
            document.getElementById('upgrade-path-button').addEventListener('click', () => {
                loadUpgradePath(itemId);
            });
            // Ensure details container is visible
            detailsContainer.style.display = 'block';

            // Add event listener to NPC info button
            document.getElementById('toggle-npc-info').addEventListener('click', () => {
                toggleNpcInfo(itemId);
            });

        })
        .catch(error => console.error('Error loading item details:', error));
}



function loadUpgradePath(itemId) {
    // Check if the item is a legendary item with an ID greater than 2 million
    if (itemId > 2000000) {
        // Display a message and provide a button to go back to the original item
        const detailsContainer = document.getElementById('details-container');
        detailsContainer.innerHTML = `
            <p>There are no upgrade paths for this weapon.</p>
            <button class="close-button" onclick="loadItemDetails(${itemId})">Back to Item</button>
        `;
        return; // Exit the function early to prevent popups
    }

    const baseItemPromise = fetch(`item_detail.php?id=${itemId}`).then(response => response.json());
    const enchantedItemPromise = fetch(`item_detail.php?id=${Number(itemId) + 1000000}`).then(response => response.json());
    const legendaryItemPromise = fetch(`item_detail.php?id=${Number(itemId) + 2000000}`).then(response => response.json());

    // Hide the Upgrade Path tab when clicked
    const upgradeTabContainer = document.querySelector('.upgrade-path-tab-container');
    if (upgradeTabContainer) {
        upgradeTabContainer.style.visibility = 'hidden'; // Hide the tab during upgrade view
    }

    // Fetch all item versions
    Promise.all([baseItemPromise, enchantedItemPromise, legendaryItemPromise])
        .then(([baseData, enchantedData, legendaryData]) => {
            const detailsContainer = document.getElementById('details-container');

            // Ensure all data is fetched successfully before rendering
            if (baseData && enchantedData && legendaryData) {
                // Create the overlay modal for the upgrade path
                document.body.insertAdjacentHTML('beforeend', `
                    <div id="upgrade-path-container" class="item-versions-horizontal">
                        <button class="close-button" onclick="closeUpgradePath(${itemId})">Close</button>
                        
                        <div class="item-version enchanted-glow">
                            ${generateTooltipContent(enchantedData)}
                        </div>
                        <img src="/thj/images/icons/upgradearrow.png" alt="Upgrade Arrow" class="upgrade-arrow">
                        <div class="item-version legendary-glow">
                            ${generateTooltipContent(legendaryData)}
                            <div class="sparkle sparkle-1"></div>
                            <div class="sparkle sparkle-2"></div>
                            <div class="sparkle sparkle-3"></div>
                            <div class="sparkle sparkle-4"></div>
                            <div class="sparkle sparkle-5"></div>
                        </div>
                    </div>
                `);

                // Show the overlay by setting proper styles
                const upgradePathContainer = document.getElementById('upgrade-path-container');
                if (upgradePathContainer) {
                    upgradePathContainer.style.display = 'flex';
                }
            } else {
                console.error('One or more item versions could not be fetched.');
            }
        })
        .catch(error => {
            console.error('Error loading upgrade path details:', error);
        });
}



// Function to close the upgrade path overlay and reset details view
function closeUpgradePath(itemId) {
    const upgradePathContainer = document.getElementById('upgrade-path-container');
    if (upgradePathContainer) {
        upgradePathContainer.remove(); // Remove the overlay when closing
    }

    // Show the Upgrade Path tab again when closed
    const upgradeTabContainer = document.querySelector('.upgrade-path-tab-container');
    if (upgradeTabContainer) {
        upgradeTabContainer.style.visibility = 'visible';
    }

    // Reload the original item details
    loadItemDetails(itemId);
}


let currentPage = 1;
const itemsPerPage = 4; // Adjust if you want more NPCs per page
let npcData = []; // This will store the fetched NPC data

// Function to toggle NPC info panel and load NPCs
function toggleNpcInfo(itemId) {
    const npcInfoPanel = document.getElementById('npc-info-panel');

    // If panel is already open, close it
    if (npcInfoPanel.classList.contains('open')) {
        npcInfoPanel.classList.remove('open');
        return;
    }

    // Otherwise, fetch the NPC info
    fetch(`item_detail.php?id=${itemId}&npc_info=true`)
        .then(response => response.json())
        .then(data => {
            npcData = data.npc_info; // Store the fetched NPC data

            if (npcData && npcData.length > 0) {
                // Load the first page of NPC data
                displayNpcPage(currentPage);
            } else {
                document.getElementById('npc-info-content').innerHTML = '<p>No NPCs found for this item.</p>';
            }

            // Show the NPC info panel
            npcInfoPanel.classList.add('open');
        })
        .catch(error => {
            console.error('Error fetching NPC info:', error);
        });
}

// Function to display NPCs based on the current page
function displayNpcPage(page) {
    const npcInfoContent = document.getElementById('npc-info-content');
    npcInfoContent.innerHTML = ''; // Clear previous content

    // Calculate start and end indices for slicing the data
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = npcData.slice(start, end); // Get the current page data

    // Display the NPCs for the current page
    npcInfoContent.innerHTML = pageData.map(npc => `
        <div class="npc-entry">
            <p><strong>NPC Name:</strong> ${npc.npc_name}</p>
            <p><strong>Zone:</strong> ${npc.zone}</p>
            <p><strong>Chance to Drop:</strong> ${npc.drop_chance}%</p>
        </div>
    `).join('');

    // Update pagination buttons based on the current page
    document.getElementById('prev-page').disabled = page === 1;
    document.getElementById('next-page').disabled = end >= npcData.length;
}


// Event listeners for pagination controls
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayNpcPage(currentPage);
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage * itemsPerPage < npcData.length) {
        currentPage++;
        displayNpcPage(currentPage);
    }
});

// Event listener setup for clicking on item rows
document.addEventListener('DOMContentLoaded', function() {
    const rows = document.querySelectorAll('.item-row');
    rows.forEach(row => {
        row.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            loadItemDetails(itemId); // Load item details for each version
        });
    });
});

let upgradeTabTimeout;
let isAnimating = false; // Add a flag to track animation state


