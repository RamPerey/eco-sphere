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

        public function get_post_status($post_id) {
            $stmt = $this->db->prepare('SELECT completed FROM posts WHERE id = :post_id');
            $stmt->execute(['post_id' => $post_id]);

            return $stmt->fetch(PDO::FETCH_ASSOC);
        }

        // User Management
        public function get_user_data($user_id) {
            $stmt = $this->db->prepare('SELECT username, email, profile_image FROM users WHERE id = :user_id');
            $stmt->execute(['user_id' => $user_id]);
            
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }

        public function update_user_data($username, $email, $profile_image) {
            $stmt = $this->db->prepare('
                UPDATE users 
                SET username = :username, email = :email, profile_image = :profile_image 
                WHERE id = :user_id'
            );
            $stmt->execute([
                'username' => $username,
                'email' => $email,
                'profile_image' => $profile_image, 
                'user_id' => $_SESSION['user_id']
            ]);

            return $stmt->rowCount();
        }

        public function insert_user($username, $password, $confirm, $email) {
            if (!(strlen($username) > 0 && strlen($password) > 0)) {
                return ['error' => 'Empty username or password field'];
            }

            if ($password != $confirm) {
                return ['error' => 'Incorrect cofirmation password'];
            }
            
            $stmt = $this->db->prepare('
                INSERT INTO users (username, password, email, profile_image, created_at)
                 VALUES (:username, :password, :email, :profile_image, :created_at  )'
            );

            return $stmt->execute([
                'username' => $username, 
                'password' => password_hash($password, PASSWORD_DEFAULT),
                'email' => $email,
                'profile_image' => '/images/user.png',
                'created_at' => date('Y F j \a\t g:i A')
            ]);
        }

        // Content Management
        public function get_newsfeed() {
            $stmt = $this->db->prepare('
                SELECT username, profile_image, caption, category, images
                FROM posts
                JOIN users ON posts.user_id = users.id'
            );
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public function get_feed() {
            $stmt = $this->db->prepare('
                SELECT id AS post_id, user_id, caption, images, category, completed
                FROM posts WHERE user_id = :user_id'
            );
            $stmt->execute(['user_id' => $_SESSION['user_id']]);
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public function create_post($caption, $images, $category) {
            $user_id  = $_SESSION['user_id'];

            $stmt = $this->db->prepare('
                INSERT INTO posts (user_id, caption, images, category)
                VALUES (:user_id, :caption, :images, :category)'
            );

            $stmt->execute([
                'user_id' => $user_id,
                'caption' => $caption,
                'images' => json_encode($images),
                'category' => $category
            ]);

            if ($stmt->rowCount() == 0) {
                return ['changes' => $changes];
            }
            
            return ['changes' => $stmt->rowCount(), 'post_id' => $this->db->lastInsertID()];
        }

        public function delete_post($post_id) {
            $stmt = $this->db->prepare('DELETE FROM posts WHERE id = :post_id');
            $stmt->execute(['post_id' => $post_id]);

            return $stmt->rowCount();
        }

        public function toggle_status($post_id) {
            $result = $this->get_post_status($post_id);
            if ($result == false) {
                return 0; // Indicates failure
            }

            $status = $result['completed'] == 'T' ? 'F' : 'T';;

            $stmt = $this->db->prepare('
                UPDATE posts 
                SET completed = :status
                WHERE id = :post_id'
            );
            $stmt->execute(['status' => $status, 'post_id' => $post_id]);

            return ['changes' => $stmt->rowCount(), 'status' => $status];
        }

    }
?>