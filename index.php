<?php
    session_start();

    require 'database.php';
    require 'router.php';

    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $router = new Router;
    $db = new Database;

    $router->add('/', function () {
        if (isset($_SESSION['username']) && isset($_SESSION['user_id'])) {
            header('Location: index.html');
        }
        else {
            header('Location: /html/login.html');
        }
    });

    $router->add('/register', function () use ($db) {
        $data = get_json_input();

        $result = $db->user_exist($data['username']);
        if ($result != false) {
            echo json_encode(['error' => 'Username already exist']);
            exit();
        }
        
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            echo json_encode(['success' => false, 'error' => 'Invalid input for an email']);
            exit();
        }

        $result = $db->insert_user($data['username'], $data['password'], $data['confirm'], $data['email']);
        if (is_array($result) && isset($result['error'])) {
            echo json_encode($result);
            exit();
        }

        echo json_encode(['success' => true]);
    });
    
    // For getting data sent from fetch
    function get_json_input() {
        $input = file_get_contents('php://input');
        return json_decode($input, true);
    }

    $router->dispatch($path);
?>