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
            <div id="toast-notification" class="toast-notification"></div>
            <div class="button-container">
                <button id="toggle-npc-info" class="toggle-npc-info">&larr; View NPC or Quest Info</button>
                <button id="upgrade-path-button" class="upgrade-path-button">Upgrade Path</button>
                <button id="copy-id-button" class="copy-id-button">Share/Copy URL</button>
            </div>
            <div class="npc-info-panel" id="npc-info-panel">
                <div class="npc-info-content" id="npc-info-content">
                    <!-- NPC info will be loaded here dynamically -->
                </div>
                <div class="pagination-controls">
                    <button id="prev-page" disabled>&laquo; Prev</button>
                    <button id="next-page">Next &raquo;</button>
                </div>
                <div id="toast-notification" class="toast-notification"></div>
            </div>
            `;

            

            // Ensure details container is visible
            detailsContainer.style.display = 'block';

            // Add event listener for Upgrade Path button
            document.getElementById('upgrade-path-button').addEventListener('click', () => {
                loadUpgradePath(itemId);
            });

            // Add event listener to NPC info button
            document.getElementById('toggle-npc-info').addEventListener('click', () => {
                toggleNpcInfo(itemId);
            });

            // Add event listener for Copy/Share URL button
            document.getElementById('copy-id-button').addEventListener('click', () => {
                const urlToCopy = `https://info.heroesjourneyemu.com/item_detail.php?embed=true&id=${itemId}`;
                copyUrlToClipboard(urlToCopy);
            });
        })
        .catch(error => console.error('Error loading item details:', error));
}




function copyUrlToClipboard(url) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
            .then(() => {
                showToast('URL copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy URL: ', err);
                showToast('Failed to copy URL. Try again.', true); // Pass true for an error
            });
    } else {
        // Fallback for unsupported environments
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed'; // Prevent scrolling to the bottom of the page
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showToast('URL copied to clipboard!');
            } else {
                showToast('Failed to copy URL. Try again.', true);
            }
        } catch (err) {
            console.error('Fallback: Could not copy URL', err);
            showToast('Failed to copy URL. Try again.', true);
        }

        document.body.removeChild(textArea);
    }
}


// Function to copy ID to clipboard and show toast
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            showToast(`ID ${text} has been copied!`);
        })
        .catch(err => {
            console.error('Failed to copy ID: ', err);
            showToast('Failed to copy ID. Try again.', true); // Pass true for an error
        });
}

// Function to show toast notification
function showToast(message, isError = false) {
    const toast = document.getElementById('toast-notification');
    toast.textContent = message;

    // Change background color if it's an error message
    if (isError) {
        toast.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    } else {
        toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    }

    // Show the toast
    toast.classList.add('show');

    // Hide the toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000); // 3000ms = 3 seconds
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
                        <button id="copy-legendaryid-button" class="copy-legendaryid-button">Share/Copy URL</button>
                        <button id="copy-enchantedid-button" class="copy-enchantedid-button">Share/Copy URL</button>
                        <div class="item-version enchanted-glow">
                            ${generateTooltipContent(enchantedData)}
                        </div>
                        <img src="/images/icons/upgradearrow.png" alt="Upgrade Arrow" class="upgrade-arrow">
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
                // Add event listener to the new "Copy/Share URL" button
                document.getElementById('copy-enchantedid-button').addEventListener('click', () => {
                    const legendaryUrl = `https://info.heroesjourneyemu.com/item_detail.php?embed=true&id=${Number(itemId) + 1000000}`;
                    copyUrlToClipboard(legendaryUrl);
                });
                // Add event listener to the new "Copy/Share URL" button
                document.getElementById('copy-legendaryid-button').addEventListener('click', () => {
                    const legendaryUrl = `https://info.heroesjourneyemu.com/item_detail.php?embed=true&id=${Number(itemId) + 2000000}`;
                    copyUrlToClipboard(legendaryUrl);
                });
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

function loadMultipleItemDetails(baseId) {
    const containers = {
        base: document.getElementById('base-item'),
        enchanted: document.getElementById('enchanted-item'),
        legendary: document.getElementById('legendary-item')
    };

    // Item IDs for the three versions
    const itemIds = {
        base: baseId,
        enchanted: baseId + 1000000,
        legendary: baseId + 2000000
    };

    // Loop through the versions and load details
    for (const [key, itemId] of Object.entries(itemIds)) {
        const container = containers[key];
        if (!container) {
            console.error(`Container for ${key} not found.`);
            continue;
        }

        fetch(`item_detail.php?id=${itemId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch item ${itemId}`);
                }
                return response.json();
            })
            .then(data => {
                // Add extra content for the base item only
                const extraContent =
                    key === 'base'
                        ? `
                        <div class="button-container">
                        <div id="toast-notification" class="toast-notification"></div>
                            <button id="toggle-npc-info" class="toggle-npc-info">&larr; View NPC or Quest Info</button>
                            <button id="copy-id-button" class="copy-id-button">Share/Copy URL</button>
                        </div>
                        <div class="npc-info-panel" id="npc-info-panel">
                            <div class="npc-info-content" id="npc-info-content">
                                <!-- NPC info will be loaded here dynamically -->
                            </div>
                            <div class="pagination-controls">
                                <button id="prev-page" disabled>&laquo; Prev</button>
                                <button id="next-page">Next &raquo;</button>
                            </div>
                            <div id="toast-notification" class="toast-notification"></div>
                        </div>
                        `
                        : '';

                container.innerHTML = `
                    <div class="item-version">
                        ${generateTooltipContent(data)}
                        ${extraContent}
                    </div>
                `;

                // Add necessary event listeners for the base item
                if (key === 'base') {
                    setupBaseItemEventListeners(itemId);
                }
            })
            .catch(error => {
                console.error(`Error loading item ${itemId}:`, error);
                container.innerHTML = `<p>Error loading item ${itemId}.</p>`;
            });
    }
}

function setupBaseItemEventListeners(baseId) {
    

    // Add event listener for the "View NPC Info" button
    const toggleNpcInfoButton = document.getElementById('toggle-npc-info');
    if (toggleNpcInfoButton) {
        toggleNpcInfoButton.addEventListener('click', () => {
            toggleNpcInfo(baseId);
        });
    }

    // Add event listener for the "Share/Copy URL" button
    const copyIdButton = document.getElementById('copy-id-button');
    if (copyIdButton) {
        copyIdButton.addEventListener('click', () => {
            const urlToCopy = `https://info.heroesjourneyemu.com/item_detail.php?embed=true&id=${baseId}`;
            copyUrlToClipboard(urlToCopy);
        });
    }
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

function toggleNpcInfo(itemId) {
    const npcInfoPanel = document.getElementById('npc-info-panel');

    if (!npcInfoPanel) {
        console.error("NPC Info Panel not found in the DOM.");
        return;
    }

    // If panel is already open, close it
    if (npcInfoPanel.classList.contains('open')) {
        npcInfoPanel.classList.remove('open');
        return;
    }

    // Otherwise, fetch the NPC info
    fetch(`item_detail.php?id=${itemId}&npc_info=true`)
        .then(response => response.json())
        .then(data => {
            npcData = data.npc_info || []; // Store the fetched NPC data

            const npcInfoContent = document.getElementById('npc-info-content');
            if (npcInfoContent) {
                if (npcData.length > 0) {
                    // Initialize pagination at page 1
                    currentPage = 1;
                    displayNpcPage(currentPage);
                } else {
                    npcInfoContent.innerHTML = '<p>No NPCs found for this item.</p>';
                }
            }

            // Show the NPC info panel
            npcInfoPanel.classList.add('open');
        })
        .catch(error => {
            console.error('Error fetching NPC info:', error);
        });

    // Attach event listeners for pagination buttons
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');

    if (prevPageButton) {
        prevPageButton.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                displayNpcPage(currentPage);
            }
        };
    }

    if (nextPageButton) {
        nextPageButton.onclick = () => {
            if (currentPage * itemsPerPage < npcData.length) {
                currentPage++;
                displayNpcPage(currentPage);
            }
        };
    }
}



function displayNpcPage(page) {
    const npcInfoContent = document.getElementById('npc-info-content');
    if (!npcInfoContent) {
        console.error("NPC Info Content not found in the DOM.");
        return;
    }

    // Clear previous content
    npcInfoContent.innerHTML = '';

    // Calculate start and end indices for slicing the data
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = npcData.slice(start, end);

    // Display NPCs, Quests, or Recipes for the current page
    if (pageData.length > 0) {
        npcInfoContent.innerHTML = pageData.map(npc => {
            if (npc.type === 'Quest') {
                return `
                    <div class="npc-entry">
                        <p><strong>Quest:</strong> ${npc.npc_name}</p>
                        <p><a href="${npc.url}" target="_blank" class="epic-link">View Quest Details</a></p>
                    </div>
                `;
            } else if (npc.type === 'Recipe') {
                return `
                    <div class="npc-entry">
                        <p><strong>Recipe:</strong> ${npc.npc_name}</p>
                        <p><a href="${npc.url}" target="_blank" class="recipe-link">View Recipe Details</a></p>
                    </div>
                `;
            } else {
                return `
                    <div class="npc-entry">
                        <p><strong>NPC Name:</strong> ${npc.npc_name}</p>
                        <p><strong>Zone:</strong> ${npc.zone}</p>
                        <p><strong>Chance to Drop:</strong> ${npc.drop_chance}%</p>
                    </div>
                `;
            }
        }).join('');
    } else {
        npcInfoContent.innerHTML = '<p>No NPC, Quest, or Recipe information available for this item.</p>';
    }

    // Update pagination buttons
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');

    if (prevPageButton) prevPageButton.disabled = page === 1;
    if (nextPageButton) nextPageButton.disabled = end >= npcData.length;
}






document.addEventListener('DOMContentLoaded', () => {
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');

    if (prevPageButton) {
        prevPageButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayNpcPage(currentPage);
            }
        });
    }

    if (nextPageButton) {
        nextPageButton.addEventListener('click', () => {
            if (currentPage * itemsPerPage < npcData.length) {
                currentPage++;
                displayNpcPage(currentPage);
            }
        });
    }
});
;

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


