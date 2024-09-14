<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database configuration
$servername = "localhost";
$username = "khadeeja";
$password = "comedyhouse";
$dbname = "mahroo";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Connected successfully<br>";

// Get form data
$firstName = $_POST['firstName'] ?? '';
$lastName = $_POST['lastName'] ?? '';
$email = $_POST['email'] ?? '';
$address = $_POST['address'] ?? '';
$phoneNumber = $_POST['phoneNumber'] ?? '';
$orderSummary = $_POST['orderSummary'] ?? '';
$totalPrice = $_POST['totalPrice'] ?? '';

echo "Data received<br>";

// Prepare SQL statement
$sql = "INSERT INTO orders (firstName, lastName, email, address, phoneNumber, orderSummary, totalPrice) VALUES (?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
if ($stmt === false) {
    die("Error preparing statement: " . $conn->error);
}

echo "Statement prepared<br>";

$stmt->bind_param("sssssss", $firstName, $lastName, $email, $address, $phoneNumber, $orderSummary, $totalPrice);

echo "Parameters bound<br>";

if ($stmt->execute()) {
    echo "Data inserted successfully<br>";
    $stmt->close();
    $conn->close();
    echo "About to redirect<br>";
    header("Location: form.html");
    exit();
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();