<?php
// Database connection settings
//removed db info

include $_SERVER['DOCUMENT_ROOT'] . '/thj/includes/db_connection.php';

if (isset($_GET['id'])) {
    $itemId = $_GET['id'];
    
    // Prepare and execute the SQL query to get item details
    $stmt = $pdo->prepare("SELECT ID, Name, AC, Damage, Delay, Weight, Classes, Price FROM items WHERE ID = :id");
    $stmt->bindParam(':id', $itemId);
    $stmt->execute();
    
    $itemDetails = $stmt->fetch(PDO::FETCH_ASSOC);

    // Return item details as a JSON response
    echo json_encode($itemDetails);
} else {
    echo json_encode([]);
}
?>
