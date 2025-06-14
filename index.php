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

    // Authentications
    $router->add('/login', function () use ($db) {
        $data = get_json_input();
        
        $result = $db->verify_password($data['username'], $data['password']);
        if (!$result['success']) {
            echo json_encode($result);
            exit();
        }

        $user_id = $db->get_user_id($data['username']);
        $user_id = $user_id['id'];

        $_SESSION['username'] = $data['username'];
        $_SESSION['user_id'] = $user_id;
        echo json_encode(['success' => true, 'username' => $data['username']]);
    });

        $router->add('/logout', function () {
        unset($_SESSION['username']);
        unset($_SESSION['user_id']);

        echo json_encode(['success' => true, 'message' => 'logout successful']);
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

    // User Management
    $router->add('/load-user-data', function () use ($db) {
        $result = $db->get_user_data($_SESSION['user_id']);

        echo json_encode(['success' => true, 'user_data' => $result]);
    });

    $router->add('/update-user-data', function () use ($db) {
        $data = get_json_input();
        
        $result = $db->update_user_data($data['username'], $data['email'], $data['profile_image']);
        if ($result == 0) {
            echo json_encode(['success' => false]);
            exit();
        }

        echo json_encode(['success' => true]);
    });

    // Content Management
    $router->add('/load-feed', function () use ($db) {
        $result = $db->get_newsfeed();
        echo json_encode(['result' => $result]);
    });

    $router->add('/load-task', function () use ($db) {
        $result = $db->get_feed();
        echo json_encode(['result' => $result]);
    });
    
    $router->add('/create-post', function () use ($db) {
        $data = get_json_input();

        $result = $db->create_post($data['caption'], $data['images'], $data['category']);
        if ($result['changes'] == 0) {
            echo json_encode(['success' => false, 'error' => 'Unable to createa post']);
        }

        echo json_encode(['success' => true, 'post_id' => $result['post_id']]);
    });

    $router->add('/delete-post', function () use ($db) {
        $data = get_json_input();

        $result = $db->delete_post($data['post_id']);
        if ($result == 0) {
            echo json_encode(['success' => false]);
        }

        echo json_encode(['success' => true]);
    });

    $router->add('/toggle-status', function () use ($db) {
        $data = get_json_input();

        $result = $db->toggle_status($data['post_id']);
        if ($result['changes'] == 0) {
            echo json_encode(['success' => false]);
            exit();
        }

        echo json_encode(['success' => true, 'status' => $result['status']]);
    });

    // For getting data sent from fetch
    function get_json_input() {
        $input = file_get_contents('php://input');
        return json_decode($input, true);
    }

    $router->dispatch($path);
?>