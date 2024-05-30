CREATE DATABASE IF NOT EXISTS SharedBoard;

USE SharedBoard;

CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
	email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL
);

INSERT INTO Users (username, email, hashed_password) VALUES
('admin', 'admin@admin.admin', '$2y$10$o4ESuGCAqBF9pl3umkZr4.WVlTzaoIXs.WxkIxsTM0dJ4..jnXNO.'),
('user', 'user@user.user', '$2y$10$YaoqcDMzKfRVHmFbKs6\/5u1pDyaS2IQppv4k5a3OYiu8fbp.3I.J6'),
('test', 'test@test.test', '$2y$10$BxFSktxwOdAXJSNYiSNIRO2c93CiTn4KHTTyoPVMjErx0hwfAzI0S');