<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include necessary files
include $_SERVER['DOCUMENT_ROOT'] . '/thj/includes/db_connection.php';
include $_SERVER['DOCUMENT_ROOT'] . '/thj/includes/spell.inc.php'; // Include the spell descriptions file

$spellId = $_GET['id'] ?? null;

if ($spellId) {
    // Fetch spell details
    $stmt = $pdo->prepare("SELECT * FROM spells_new WHERE id = :id");
    $stmt->bindParam(':id', $spellId, PDO::PARAM_INT);
    $stmt->execute();
    $spell = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($spell) {
        // Fetch spell description using `spell.inc.php`
        $description = getSpellDescription($spell); // Assuming a function like this in spell.inc.php
    }
}
?>

<?php if ($spell): ?>
    <div class="spell-detail">
        <h2><?= htmlspecialchars($spell['name']) ?></h2>
        <div class="spell-icon">
            <img src="/thj/sprites/spell_icons/spell_icons_<?= floor($spell['icon'] / 1000) * 1000 ?>.png" class="spell-icon" style="background-position: <?= -($spell['icon'] % 10) * 40 ?>px <?= -floor($spell['icon'] / 10) * 40 ?>px;">
        </div>
        <div class="spell-info">
            <p><strong>Class:</strong> <?= htmlspecialchars($spell['class']) ?></p>
            <p><strong>Level:</strong> <?= htmlspecialchars($spell['level']) ?></p>
            <p><strong>Mana:</strong> <?= htmlspecialchars($spell['mana']) ?></p>
            <p><strong>Cast Time:</strong> <?= htmlspecialchars($spell['cast_time']) ?></p>
            <p><strong>Recast Time:</strong> <?= htmlspecialchars($spell['recast_time']) ?></p>
        </div>
        <div class="spell-description">
            <h3>Description</h3>
            <p><?= htmlspecialchars($description) ?></p>
        </div>
    </div>
<?php else: ?>
    <p>Spell not found.</p>
<?php endif; ?>
