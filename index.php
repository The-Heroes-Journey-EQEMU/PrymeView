<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>THJ DB</title>
    <link rel="stylesheet" href="/css/styles.css">
    <link rel="stylesheet" href="/sprites/item_icons.css">
    <link rel="stylesheet" href="/css/tooltip.css">
    <link rel="stylesheet" href="/css/expansion_enable.css">
    <link rel="stylesheet" href="/sprites/spell_icons/spell_icons_20.css">
    <link rel="stylesheet" href="/sprites/spell_icons/spell_icons_30.css">
    <link rel="stylesheet" href="/sprites/spell_icons/spell_icons_40.css">
    <link rel="stylesheet" href="/css/spell_search.css">
    <link rel="stylesheet" href="/css/aa_search.css">
    
    

</head>
<body>
<div class="sidebar">
    <img src="/images/thjlogoname.png" alt="App Logo">
    <a href="#" onclick="loadContentForItemSearch('item_search.php')">Item Search</a>
    <a href="#" onclick="loadContentForSpellSearch('spell_search.php'); return false;">Spell Search</a>
    <a href="#" onclick="loadContentForAASearch('aa_search.php'); return false;">AA Search</a>

    



    <!-- <a href="#" onclick="loadContent('aa_search.php')">AA Search</a> -->
</div>

<div class="main-content">
    <!-- Main content display area -->
    <div class="content-display" id="content-display" style="display: block;">
        <h1>Welcome to THJ Look Up Page</h1>
        <p>Select an option from the sidebar to get started.</p>
    </div>

    <!-- Spell search wrapper -->
    <div id="spells-wrapper" class="spells-wrapper" style="display: none;">
        <div id="spell-search-container"></div>
    </div>

    <!-- AA search wrapper -->
    <div id="aa-wrapper" class="aa-wrapper" style="display: none;">
        <div id="aa-search-container"></div>
    </div>

    <!-- Details wrapper -->
    <div class="details-wrapper" id="details-container" style="display: none;"></div>

    <!-- Upgrade Path Tab -->
    <div class="upgrade-path-tab-container" style="display: none;"></div>
</div>




<!-- Tooltip container for hover effects -->
<div id="tooltip" class="tooltip"></div>

<!-- Scripts -->
<script src="/scripts/scripts.js"></script>
<script src="/scripts/itemDetails.js"></script>
<script src="/scripts/hoverTool.js"></script>
<!-- <script src="/scripts/randombackground.js"></script> -->
<script src="/scripts/focusEffects.js"></script>
<script src="/scripts/spellSearch.js"></script>
<script src="/scripts/aaSearch.js"></script>


</body>
</html>
