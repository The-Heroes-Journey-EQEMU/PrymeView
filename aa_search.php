<?php
include $_SERVER['DOCUMENT_ROOT'] . '/includes/db_connection.php';
include $_SERVER['DOCUMENT_ROOT'] . '/includes/classes.php';
include $_SERVER['DOCUMENT_ROOT'] . '/includes/bitmask_definitions.php';
?>

<!-- AA Search Section -->
<section id="aa-search-section">
    <!-- Class Icon Selection -->
    <div id="aa-class-selection" class="aa-class-selection">
        <?php foreach ($classMapping as $bitmask => $className): ?>
            <?php
            $classInfo = array_filter($classes, function ($class) use ($className) {
                return $class['fullName'] === $className;
            });
            $classInfo = reset($classInfo); // Get the first matching class info
            ?>
            <div class="aa-class-icon-container" data-class-id="<?php echo $bitmask; ?>">
                <div class="aa-class-abbreviation"><?php echo $classInfo['abbreviation']; ?></div>
                <div class="aa-class-icon item-<?php echo $classInfo['image']; ?>" title="<?php echo $classInfo['fullName']; ?>"></div>
            </div>
        <?php endforeach; ?>
    </div>

    <!-- AA Search Form -->
    <form id="aa-search-form" onsubmit="return fetchAASearchResults(event);">
        <input type="text" name="name" id="aa-search-input" class="aa-search-input" placeholder="Enter AA name..." />
        <input type="hidden" id="selectedAAClasses" name="selectedClasses" value="">
        <button type="submit" id="aa-search-button" class="aa-search-button">Search</button>
    </form>

    <!-- Tabs and Results -->
    <div id="aa-tabs-container">
        <nav class="aa-tabs">
            <button class="aa-tab-button active" onclick="openAATab(event, 'aa-general')">General</button>
            <button class="aa-tab-button" onclick="openAATab(event, 'aa-archetype')">Archetype</button>
            <button class="aa-tab-button" onclick="openAATab(event, 'aa-class')">Class</button>
            <div id="dynamic-class-tabs"></div>
        </nav>

        <!-- Results Tables -->
        <div id="aa-results">
            <section id="aa-general" class="aa-tab-content active">
                <table class="aa-results-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Classes</th>
                        </tr>
                    </thead>
                    <tbody id="aa-general-results">
                        <!-- General Results will be dynamically loaded here -->
                    </tbody>
                </table>
            </section>

            <section id="aa-archetype" class="aa-tab-content">
                <table class="aa-results-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Classes</th>
                        </tr>
                    </thead>
                    <tbody id="aa-archetype-results">
                        <!-- Archetype Results will be dynamically loaded here -->
                    </tbody>
                </table>
            </section>

            <section id="aa-class" class="aa-tab-content">
                <table class="aa-results-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Classes</th>
                        </tr>
                    </thead>
                    <tbody id="aa-class-results">
                        <!-- Class Results will be dynamically loaded here -->
                    </tbody>
                </table>
            </section>
             <!-- Dynamic Tabs Content -->
             <div id="dynamic-tabs-content">
                <!-- Dynamic tabs for selected classes will be loaded here -->
            </div>
        </div>
    </div>
</section>
