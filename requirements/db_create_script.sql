CREATE DATABASE IF NOT EXISTS SharedBoard;

USE SharedBoard;

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
	email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS boards (
    board_id VARCHAR(36) PRIMARY KEY,
    user_id INT NOT NULL,
	board_title VARCHAR(255) NOT NULL
);

INSERT INTO users (username, email, hashed_password) VALUES
('admin', 'admin@admin.admin', '$2y$10$o4ESuGCAqBF9pl3umkZr4.WVlTzaoIXs.WxkIxsTM0dJ4..jnXNO.'),
('user', 'user@user.user', '$2y$10$YaoqcDMzKfRVHmFbKs6\/5u1pDyaS2IQppv4k5a3OYiu8fbp.3I.J6'),
('test', 'test@test.test', '$2y$10$BxFSktxwOdAXJSNYiSNIRO2c93CiTn4KHTTyoPVMjErx0hwfAzI0S');

INSERT INTO boards (board_id, user_id, board_title) VALUES
('641ab44f-9f8f-4c07-8ff4-dc54986d8c5b', 1, 'Admin Test Board 1'),
('2913fa80-b584-462a-8765-8b0ed9d9af24', 1, 'Admin Test Board 2'),
('6f31adc9-83b7-4cc6-9528-b61b83d92a0b', 1, 'Admin Test Board 3');