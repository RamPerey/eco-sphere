CREATE DATABASE IF NOT exists eco_sphere;

USE eco_sphere;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL, 
    profile_image LONGTEXT NOT NULL,
    created_at TEXT NOT NULL 
);

CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id  INT NOT NULL,
    caption TEXT,
    images LONGTEXT,
    completed ENUM('T', 'F') DEFAULT 'T',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
