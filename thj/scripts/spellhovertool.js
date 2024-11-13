function setupSpellItemHoverListener() {
    const spellItems = document.querySelectorAll('.spell-item'); // Target elements with summoned items

    spellItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            const itemId = this.getAttribute('data-id'); // Assumes summoned item ID is in data-id

            // Fetch item details as JSON, just like in item search
            fetch(`item_detail.php?id=${itemId}`)
                .then(response => response.json())
                .then(data => {
                    if (data && !data.error) {
                        // Use the same tooltip generation function
                        const tooltipContent = generateTooltipContent(data);
                        const tooltip = document.getElementById('tooltip');
                        tooltip.innerHTML = tooltipContent;
                        tooltip.style.display = 'block';
                        positionTooltip(tooltip);
                    }
                })
                .catch(error => console.error('Error fetching item data:', error));
        });

        item.addEventListener('mouseleave', () => {
            const tooltip = document.getElementById('tooltip');
            tooltip.style.display = 'none';
        });
    });
}


document.addEventListener('DOMContentLoaded', setupSpellItemHoverListener);

// Function to display tooltip content, using the `generateTooltipContent` function for consistency
function showTooltip(itemData) {
    const tooltip = document.getElementById('tooltip');
    tooltip.innerHTML = generateTooltipContent(itemData); // Use existing tooltip content generator
    tooltip.style.display = 'block';
}

// Position the tooltip at the top center of the viewport
function positionTooltip(tooltip) {
    const viewportWidth = window.innerWidth;
    const tooltipWidth = tooltip.offsetWidth;
    tooltip.style.left = `${(viewportWidth - tooltipWidth) / 2}px`;
    tooltip.style.top = `10%`;
}

// Hide tooltip
function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none';
}

// Initialize hover listener for spell items on page load
document.addEventListener('DOMContentLoaded', setupSpellItemHoverListener);
