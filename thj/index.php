<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>THJ Charbrowse</title>
    <link rel="stylesheet" href="/thj/css/styles.css">
    <link rel="stylesheet" href="/thj/sprites/item_icons.css">
    <link rel="stylesheet" href="/thj/css/tooltip.css">
    <link rel="stylesheet" href="/thj/css/expansion_enable.css">
    <link rel="stylesheet" href="/thj/sprites/spell_icons/spell_icons_20.css">
    <link rel="stylesheet" href="/thj/sprites/spell_icons/spell_icons_30.css">
    <link rel="stylesheet" href="/thj/sprites/spell_icons/spell_icons_40.css">
    <link rel="stylesheet" href="/thj/css/spell_search.css">
    
    

</head>
<body>
<div class="sidebar">
    <img src="/thj/images/thjlogo.png" alt="App Logo">
    <a href="#" onclick="loadContentForItemSearch('item_search.php')">Item Search</a>
    <!-- <a href="#" onclick="loadContent('character_search.php')">Character Search</a> -->
    <!-- <a href="#" onclick="loadContentForSpellSearch('spell_search.php'); return false;">Spell Search</a> -->



    <!-- <a href="#" onclick="loadContent('aa_search.php')">AA Search</a> -->
</div>

<div class="main-content">
    <!-- Main content display area -->
    <div class="content-display" id="content-display">
    
        <h1>Welcome to THJ Look Up Page</h1>
        <p>Select an option from the sidebar to get started.</p>
    </div>
    <div id="spells-wrapper" class="spells-wrapper">
    <div id="spell-search-container"></div>
</div>
<div class="details-wrapper"></div>

        <!-- Item details container, where item details will be loaded -->
        <div id="details-container"></div>
        <div class="button-container">
       
        <!-- Spell search container, where spell search results will be loaded -->
        

        <!-- Upgrade Path Tab (placed here) -->
        <div class="upgrade-path-tab-container">
            
        </div>
        
        <!-- NPC info sliding panel with a toggle button -->
        <div class="npc-info-panel" id="npc-info-panel">
            <div class="npc-info-header">
                <!-- Button to toggle the NPC info panel -->
                <button class="toggle-npc-info">&larr; View NPC Info</button>
            </div>
            <div class="npc-info-content" id="npc-info-content">
                <!-- NPC info will be loaded here dynamically -->
            </div>
            
            <div class="pagination-controls">
                <button id="prev-page" disabled>&laquo; Prev</button>
                <button id="next-page">Next &raquo;</button>
            </div>
        </div>
    </div>
</div>


<!-- Tooltip container for hover effects -->
<div id="tooltip" class="tooltip"></div>

<!-- Scripts -->
<script src="/thj/scripts/scripts.js"></script>
<script src="/thj/scripts/itemDetails.js"></script>
<script src="/thj/scripts/hoverTool.js"></script>

<script src="/thj/scripts/randombackground.js"></script>
<script src="/thj/scripts/focusEffects.js"></script>
<script src="/thj/scripts/spellSearch.js"></script>
</body>
</html>
