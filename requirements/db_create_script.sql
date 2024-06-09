DROP DATABASE IF EXISTS sharedboard;

CREATE DATABASE IF NOT EXISTS sharedboard;

USE sharedboard;

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
	email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS boards (
    board_id VARCHAR(36) PRIMARY KEY,
    user_id INT NOT NULL,
	board_title VARCHAR(32) NOT NULL,
	board_share_password VARCHAR(10) NOT NULL,
	
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    board_id VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file LONGBLOB NOT NULL,
    file_type VARCHAR(255) NOT NULL,
    file_size INT NOT NULL,
	
    FOREIGN KEY (board_id) REFERENCES boards(board_id)
);

CREATE TABLE shared_boards (
	board_id VARCHAR(36) NOT NULL,
	user_id INT NOT NULL,
	
    PRIMARY KEY (board_id, user_id),
	FOREIGN KEY (board_id) REFERENCES boards(board_id),
	FOREIGN KEY (user_id) REFERENCES users(user_id)
);

INSERT INTO users (username, email, hashed_password) VALUES
('admin', 'admin@admin.admin', '$2y$10$o4ESuGCAqBF9pl3umkZr4.WVlTzaoIXs.WxkIxsTM0dJ4..jnXNO.'),
('user', 'user@user.user', '$2y$10$YaoqcDMzKfRVHmFbKs6\/5u1pDyaS2IQppv4k5a3OYiu8fbp.3I.J6'),
('test', 'test@test.test', '$2y$10$BxFSktxwOdAXJSNYiSNIRO2c93CiTn4KHTTyoPVMjErx0hwfAzI0S');

INSERT INTO boards (board_id, user_id, board_title, board_share_password) VALUES
('641ab44f-9f8f-4c07-8ff4-dc54986d8c5b', 1, 'Admin Test Board 1', 'CnEVohEukW'),
('2913fa80-b584-462a-8765-8b0ed9d9af24', 1, 'Admin Test Board 2', 'dlUEVmGerS'),
('6f31adc9-83b7-4cc6-9528-b61b83d92a0b', 1, 'Admin Test Board 3', 'bTcOyinxlM'),
('3c5c110c-3c3d-41cf-8189-ba911636d9ed', 1, 'Lorem ipsum dolor sit amet, cons', 'cearrzYNCm'),
('6892fe41-95ad-4ad3-a9d3-b60c84cb988a', 2, 'Shared Board', 'cvG03HQtIG');

/* This will share the 'Shared Board' of 'user' with 'test' */
INSERT INTO shared_boards (board_id, user_id) VALUES ('6892fe41-95ad-4ad3-a9d3-b60c84cb988a', 3);