<?php
    session_start();

    require 'router.php';

    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $router = new Router;

    $router->add('/', function () {
        if (isset($_SESSION['username']) && isset($_SESSION['user_id'])) {
            header('Location: index.html');
        }
        else {
            header('Location: /html/login.html');
        }
    });

    

    $router->dispatch($path);
?>