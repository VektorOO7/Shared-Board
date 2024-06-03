USE SharedBoard;

CREATE TABLE shared_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_id INT NOT NULL,
    token VARCHAR(64) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL
);
/*this will create a board, to keep all the information in it*/
CREATE TABLE boards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL
);
