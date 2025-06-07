<?php
    class Database {
        private $db = null;

        public function __construct() {
            $config = require 'config.php';

            try {
                $this->db = new PDO(
                    "mysql:host={$config['db_host']};dbname={$config['db_name']}",
                    $config['db_user'],
                    $config['db_pass']
                );

               $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            }
            catch (PDOException $e) {
                echo json_encode(['error' => 'Unable to connect', 'log' => $e->getMessage()]);
                exit();
            }
        }

        // Auxiliaries
        public function user_exist($username) {
            $stmt = $this->db->prepare('SELECT * FROM users WHERE username = :username');
            $stmt->execute(['username' => $username]);

            return $stmt->fetch(PDO::FETCH_ASSOC);
        }

        public function get_user_id($username) {
            $stmt = $this->db->prepare('SELECT id FROM users WHERE username = :username');
            $stmt->execute(['username' => $username]);

            return $stmt->fetch(PDO::FETCH_ASSOC);
        }

        public function verify_password($username, $password) {
            $result = $this->user_exist($username);

            if ($result == false) {
                return ['success' => false, 'error' => 'User not found'];
            }

            $stmt = $this->db->prepare('SELECT password FROM users WHERE username = :username');
            $stmt->execute(['username' => $username]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!password_verify($password, $result['password'])) {
                echo json_encode(['success' => false, 'error' => 'Incorrect password']);
                exit();
            }

            return ['success' => true];
        }

        // User Management
        public function insert_user($username, $password, $confirm, $email) {
            if (!(strlen($username) > 0 && strlen($password) > 0)) {
                return ['error' => 'Empty username or password field'];
            }

            if ($password != $confirm) {
                return ['error' => 'Incorrect cofirmation password'];
            }
            
            $stmt = $this->db->prepare('
                INSERT INTO users (username, password, email, profile_image, created_at)
                 VALUES (:username, :password, :email, :profile_image, :created_at  )');

            return $stmt->execute([
                'username' => $username, 
                'password' => password_hash($password, PASSWORD_DEFAULT),
                'email' => $email,
                'profile_image' => '/images/user.png',
                'created_at' => date('Y F j \a\t g:i A')
            ]);
        }
    }
?>