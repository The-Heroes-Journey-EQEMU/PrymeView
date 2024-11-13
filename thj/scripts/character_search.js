document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');

    if (searchForm) {
        searchForm.addEventListener('submit', handleCharacterSearch);
    }

    function handleCharacterSearch(event) {
        event.preventDefault(); // Prevent page reload
        console.log("Character search form submitted.");

        const searchQuery = document.getElementById('search').value.trim();

        // Check if a search term is provided
        if (!searchQuery) {
            alert('Please enter a character name to search.');
            return;
        }

        // Perform AJAX call to character_search.php
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'character_search.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onload = function() {
            const contentDisplay = document.getElementById('content-display');
            if (xhr.status === 200) {
                const content = xhr.responseText;
                contentDisplay.innerHTML = content; // Insert search results
            } else {
                contentDisplay.innerHTML = 'Error loading results.';
            }
        };

        // Send the request with the search term
        xhr.send(`search_term=${encodeURIComponent(searchQuery)}&search=1`);
    }
});
