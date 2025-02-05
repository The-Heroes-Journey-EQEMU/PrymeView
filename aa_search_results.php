<?php
include $_SERVER['DOCUMENT_ROOT'] . '/includes/db_connection.php';
include $_SERVER['DOCUMENT_ROOT'] . '/includes/bitmask_definitions.php';
include $_SERVER['DOCUMENT_ROOT'] . '/includes/classes.php'; // Ensure classes array is available
include $_SERVER['DOCUMENT_ROOT'] . '/includes/aa_dbstr_inc.php';

header('Content-Type: application/json');

// Validate database connection
if (!isset($pdo)) {
    echo json_encode(['error' => 'Database connection error.']);
    exit;
}

function getClassIcons($aaClassesBitmask, $classes) {
    $classIconsHtml = '';

    foreach ($classes as $classId => $classInfo) {
        // Check if the class ID is set in the AA's classes bitmask
        if ($aaClassesBitmask & (1 << ($classId - 1))) { // 1 << ($classId - 1) matches the bitmask for this class
            $classIcon = '<div class="aa-result-class-icon item-' . $classInfo['image'] . '" title="' . $classInfo['fullName'] . '"></div>';
            $classIconsHtml .= $classIcon;
        }
    }

    return $classIconsHtml;
}



// Get parameters from the request

$selectedClasses = isset($_GET['classes']) ? explode(',', $_GET['classes']) : [];
$name = isset($_GET['name']) ? trim($_GET['name']) : '';

// Convert class values to integers
$selectedClasses = array_map('intval', $selectedClasses);

// Calculate the class bitmask
$classBitmask = array_reduce($selectedClasses, function ($carry, $classId) {
    return $carry | intval($classId);
}, 0);

// Ensure valid fallback for name-only searches
if (empty($selectedClasses)) {
    $classBitmask = 0; // Allows searching by name only
}

// Debugging: Log to error log
error_log("Class Bitmask: $classBitmask, Search Name: $name");


// Calculate the bitmask representing all classes
$allClassesBitmask = array_sum(array_keys($classMapping));

// Debugging: Log bitmask and name
error_log("Class Bitmask: $classBitmask");
error_log("Search Name: $name");

// Prepare the query to fetch all types
$query = "
    SELECT * FROM aa_ability
    WHERE enabled = 1
    AND name NOT LIKE '%Unknown AA%'
    AND (
        (:bitmask = 0 AND name LIKE :name) -- Case 1: Search by name only
        OR (:name = '' AND (classes & :bitmask) > 0) -- Case 2: Search by class only
        OR ((classes & :bitmask) > 0 AND name LIKE :name) -- Case 3: Search by both name and class
        OR (classes = 65535 AND name LIKE :name) -- Case 4: Matches all classes
    )
";



try {
    $stmt = $pdo->prepare($query);
    $stmt->bindValue(':bitmask', $classBitmask, PDO::PARAM_INT);
    $stmt->bindValue(':name', "%$name%", PDO::PARAM_STR);
    $stmt->execute();

    // Initialize grouped results
    $searchResults = [
        'general' => [],
        'archetype' => [],
        'class' => [],
        'dynamic' => [
            'allClasses' => [],
            'selectedClasses' => []
        ],
    ];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Generate class icons for the "Classes" column
        
         $row['decoded_classes'] = getClassIcons($row['classes'], $classes);


        // Group by type
        switch ($row['type']) {
            case 1: // General
                $searchResults['general'][] = $row;
                break;
            case 2: // Archetype
                $searchResults['archetype'][] = $row;
                break;
            case 3: // Class-specific (dynamic tabs)
                $searchResults['class'][] = $row; // Add to "Class" tab

                // Add to allClasses in dynamic data
                $searchResults['dynamic']['allClasses'][] = $row;

                // Add to specific dynamic tabs
                foreach ($selectedClasses as $selectedClass) {
                    if ($row['classes'] & $selectedClass) {
                        $searchResults['dynamic']['selectedClasses'][$selectedClass]['aaList'][] = $row;
                        $searchResults['dynamic']['selectedClasses'][$selectedClass]['className'] = $classMapping[$selectedClass];
                        $searchResults['dynamic']['selectedClasses'][$selectedClass]['classId'] = $selectedClass;
                    }
                }
                break;
        }
    }

    echo json_encode($searchResults);
} catch (PDOException $e) {
    error_log('Database query error: ' . $e->getMessage());
    echo json_encode(['error' => 'Query execution failed.']);
}
