CREATE DATABASE IF NOT exists database_name;

USE database_name;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL, 
    created_at TEXT NOT NULL 
);

