<?php
// Database connection settings
$host = '149.28.113.181:3306'; 
$dbname = 'thj'; 
$username = 'ro'; 
$password = 'Rubber-Discussion-Extension-Sing-3'; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Could not connect to the database: " . $e->getMessage());
}

// Mapping for class bitmasks
$classMapping = [
    1 => 'Warrior',
    2 => 'Cleric',
    4 => 'Paladin',
    8 => 'Ranger',
    16 => 'Shadow Knight',
    32 => 'Druid',
    64 => 'Monk',
    128 => 'Bard',
    256 => 'Rogue',
    512 => 'Shaman',
    1024 => 'Necromancer',
    2048 => 'Wizard',
    4096 => 'Magician',
    8192 => 'Enchanter',
    16384 => 'Beastlord',
    32768 => 'Berserker'
];

// Function to decode the bitmask into class names
function getClassNames($bitmask) {
    global $classMapping;
    $classes = [];
    foreach ($classMapping as $bit => $className) {
        if ($bitmask & $bit) { // Check if the bit is set in the bitmask
            $classes[] = $className;
        }
    }
    return implode(', ', $classes); // Return as comma-separated string
}

// Initialize the search results variable
$searchResults = [];

// Check if a search term has been submitted
if (isset($_POST['search'])) {
    $searchTerm = '%' . $_POST['search_term'] . '%'; // Prepare the search term for wildcard matching

    // Prepare and execute the SQL statement
    $stmt = $pdo->prepare("
        SELECT 
            cd.id, cd.name, cd.level, db.value AS class_bitmask, cd.race, cd.cur_hp AS hp, 
            cd.wis, cd.`int`, cd.sta, cd.dex, cd.cha, cd.agi
        FROM 
            character_data cd
        LEFT JOIN 
            data_buckets db ON cd.id = db.character_id AND db.key = 'GestaltClasses'
        WHERE 
            cd.name LIKE :searchTerm AND cd.deleted_at IS NULL
    ");
    $stmt->bindParam(':searchTerm', $searchTerm);
    $stmt->execute();

    // Fetch the results
    $searchResults = $stmt->fetchAll(PDO::FETCH_ASSOC);
}
?>

<div class="content-display">
    <h1>Character Search</h1>
    <form method="post" id="searchForm">
        <input type="text" id="search" name="search_term" placeholder="Enter character name..." required>
        <button type="submit" name="search">Search</button>
    </form>

    <div id="searchResults">
        <?php if ($searchResults): ?>
            <h2>Search Results:</h2>
            <table class="results-table">
                <tr>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Level</th>
                    <th>Race</th>
                    <th>HP</th>
                    <th>Wis</th>
                    <th>Int</th>
                    <th>Sta</th>
                    <th>Dex</th>
                    <th>Cha</th>
                    <th>Agi</th>
                </tr>
                <?php foreach ($searchResults as $character): ?>
                    <tr class="item-row">
                        <td><a href="character_detail.php?id=<?php echo htmlspecialchars($character['id']); ?>"><?php echo htmlspecialchars($character['name']); ?></a></td>
                        <td><?php echo htmlspecialchars(getClassNames($character['class_bitmask'])); ?></td>
                        <td><?php echo htmlspecialchars($character['level']); ?></td>
                        <td><?php echo htmlspecialchars($character['race']); ?></td>
                        <td><?php echo htmlspecialchars($character['hp']); ?></td>
                        <td><?php echo htmlspecialchars($character['wis']); ?></td>
                        <td><?php echo htmlspecialchars($character['int']); ?></td>
                        <td><?php echo htmlspecialchars($character['sta']); ?></td>
                        <td><?php echo htmlspecialchars($character['dex']); ?></td>
                        <td><?php echo htmlspecialchars($character['cha']); ?></td>
                        <td><?php echo htmlspecialchars($character['agi']); ?></td>
                    </tr>
                <?php endforeach; ?>
            </table>
        <?php else: ?>
            <p>No results found.</p>
        <?php endif; ?>
    </div>
    <script src="thj/scirpts/character_search.js"></script>

</div>
