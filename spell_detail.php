<?php
include $_SERVER['DOCUMENT_ROOT'] . '/includes/db_connection.php';
include $_SERVER['DOCUMENT_ROOT'] . '/includes/classes.php'; // Include class mappings

// Get spell ID from the request
$spellId = $_GET['id'] ?? null;

if (!$spellId) {
    die('<p>Error: Spell ID is missing or invalid. Check your request URL.</p>');
}

// Fetch spell details from the database
$stmt = $pdo->prepare("
    SELECT 
        name, 
        cast_on_you, 
        cast_on_other, 
        mana, 
        skill, 
        cast_time, 
        recovery_time, 
        recast_time, 
        `range`, 
        targettype, 
        resisttype, 
        uninterruptable, 
        buffduration,
        classes1, classes2, classes3, classes4, classes5, 
        classes6, classes7, classes8, classes9, classes10, 
        classes11, classes12, classes13, classes14, classes15, classes16
    FROM spells_new 
    WHERE id = :id
");
$stmt->bindValue(':id', $spellId, PDO::PARAM_INT);
$stmt->execute();
$spell = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$spell) {
    die('<p>Error: Spell not found.</p>');
}

// Format class list using the included class mapping
$classList = [];
foreach ($classColumnMapping as $classId => $columnName) {
    if (!empty($spell[$columnName]) && $spell[$columnName] !== 255) {
        if (isset($classes[$classId])) {
            $className = $classes[$classId]['fullName'];
            $classLevel = $spell[$columnName];
            $classList[] = "$className ($classLevel)";
        }
    }
}
$classesText = !empty($classList) ? implode(', ', $classList) : 'N/A';

// Format interruptable text
$interruptableText = ($spell['uninterruptable'] ?? 0) == 1 ? 'No' : 'Yes';

// Format duration (convert ticks to seconds)
$durationText = ($spell['buffduration'] ?? 0) > 0 ? ($spell['buffduration'] * 6) . ' sec' : 'Instant';

// Convert times to seconds
$castingTime = !empty($spell['cast_time']) ? ($spell['cast_time'] / 1000) . ' sec' : 'N/A';
$recoveryTime = !empty($spell['recovery_time']) ? ($spell['recovery_time'] / 1000) . ' sec' : 'N/A';
$recastTime = !empty($spell['recast_time']) ? ($spell['recast_time'] / 1000) . ' sec' : 'N/A';
?>

<div class="spell-detail-container" data-spell-id="<?= htmlspecialchars($spellId) ?>">
    <!-- Tab Navigation -->
    <div class="tabs">
        <button class="tab-button active" onclick="openTab(event, 'details')">Details</button>
        <button class="tab-button" onclick="openTab(event, 'vendors')">Vendors</button>
        <button class="tab-button" onclick="openTab(event, 'items')">Items With This Effect</button>
    </div>

    <!-- Tab Content -->
    <div id="details" class="tab-content active">
        <div class="spell-detail-header">
            <h2><?= htmlspecialchars($spell['name']) ?></h2>
        </div>
        <div class="spell-detail-body">
            <p><strong>Spell ID:</strong> <?= htmlspecialchars($spellId) ?></p>
            <p><strong>Classes:</strong> <?= htmlspecialchars($classesText) ?></p>
            <p><strong>When cast on you:</strong> <?= htmlspecialchars($spell['cast_on_you'] ?? 'N/A') ?></p>
            <p><strong>When cast on other:</strong> <?= htmlspecialchars($spell['cast_on_other'] ?? 'N/A') ?></p>
            <p><strong>Mana:</strong> <?= htmlspecialchars($spell['mana'] ?? 'N/A') ?></p>
            <p><strong>Skill:</strong> <?= htmlspecialchars($spell['skill'] ?? 'N/A') ?></p>
            <p><strong>Casting time:</strong> <?= htmlspecialchars($castingTime) ?></p>
            <p><strong>Recovery time:</strong> <?= htmlspecialchars($recoveryTime) ?></p>
            <p><strong>Recast time:</strong> <?= htmlspecialchars($recastTime) ?></p>
            <p><strong>Range:</strong> <?= htmlspecialchars($spell['range'] ?? 'N/A') ?></p>
            <p><strong>Target:</strong> <?= htmlspecialchars($spell['targettype'] ?? 'N/A') ?></p>
            <p><strong>Resist:</strong> <?= htmlspecialchars($spell['resisttype'] ?? 'None') ?></p>
            <p><strong>Interruptable:</strong> <?= htmlspecialchars($interruptableText) ?></p>
            <p><strong>Duration:</strong> <?= htmlspecialchars($durationText) ?></p>
        </div>
    </div>

    <div id="vendors" class="tab-content">
        <div class="vendor-list">
            <h3>Vendors Selling <?= htmlspecialchars($spell['name']) ?></h3>
            <ul id="vendorResults">
                <li>Loading...</li>
            </ul>
        </div>
    </div>

    <div id="items" class="tab-content">
        <div class="item-list">
            <h3>Items With This Effect</h3>
            <ul id="itemResults">
                <li>Loading...</li>
            </ul>
        </div>
    </div>
</div>





