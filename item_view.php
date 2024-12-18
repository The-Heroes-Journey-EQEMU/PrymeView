<?php
// Get the item ID from the URL query parameter
$itemId = isset($_GET['id']) ? intval($_GET['id']) : 0;

// Define the path to your item images folder
$imagePath = $_SERVER['DOCUMENT_ROOT'] . "/itemview/item-$itemId.png";

// Check if the image exists
if (file_exists($imagePath)) {
    // Set headers for the image
    header("Content-Type: image/png");
    header("Cache-Control: public, max-age=31536000");
    readfile($imagePath); // Output the image
} else {
    // Handle missing image
    header("Content-Type: image/png");
    readfile($_SERVER['DOCUMENT_ROOT'] . "/images/default-item.png");
}
