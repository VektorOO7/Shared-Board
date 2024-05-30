CREATE DATABASE IF NOT EXISTS SharedBoard;

USE SharedBoard;

CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
	email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL
);

INSERT INTO Users (username, email, hashed_password) VALUES
('admin', 'admin@admin.admin', '$2y$10$H7O3RCnGv3Fyr7KvheRjaOcoBoC/BQALwK1EXFbLqlS3uX3sozUsK'),
('user', 'user@user.user', '$2y$10$TMeAMu0In9u33UE3xvAIj.V2kHD7qM9pQVBkp9ePqGlg7JbJGz1F6'),
('test', 'test@test.test', '$2y$10$U4LQ7Ae8cJHemP2gttNTjOnG.GfRWvLCIwwbRUaP7oqV1P5eKgtrC');