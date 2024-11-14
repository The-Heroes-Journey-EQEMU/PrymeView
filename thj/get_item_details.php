<?php
// Database connection settings
//removed db info

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Could not connect to the database: " . $e->getMessage());
}

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
