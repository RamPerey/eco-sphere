<?php
$db_server   = 'localhost';
$db_username = 'root';
$db_password = '';
$db_name     = 'finalsdb';

$conn = null;

try {
    $conn = mysqli_connect($db_server, $db_username, $db_password, $db_name);
    if (!$conn) {
        throw new Exception("Connection failed: " . mysqli_connect_error());
    }
} catch (Exception $e) {
    echo "Could not connect! <br>";
    echo $e->getMessage();  
}
