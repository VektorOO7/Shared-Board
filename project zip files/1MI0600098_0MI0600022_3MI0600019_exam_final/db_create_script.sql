DROP DATABASE IF EXISTS sharedboard;

CREATE DATABASE IF NOT EXISTS sharedboard;

USE sharedboard;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
	email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL
);

CREATE TABLE boards (
    board_id VARCHAR(36) PRIMARY KEY,
    user_id INT NOT NULL,
	board_title VARCHAR(32) NOT NULL,
	board_share_password VARCHAR(10) NOT NULL,
	
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    board_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    file_name VARCHAR(255),
    file LONGBLOB,
    file_type VARCHAR(255),
    file_size INT,
	
    FOREIGN KEY (board_id) REFERENCES boards(board_id)
);

CREATE TABLE shared_boards (
	board_id VARCHAR(36) NOT NULL,
	user_id INT NOT NULL,
	
    PRIMARY KEY (board_id, user_id),
	FOREIGN KEY (board_id) REFERENCES boards(board_id),
	FOREIGN KEY (user_id) REFERENCES users(user_id)
);