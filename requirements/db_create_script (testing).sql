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
    board_desc VARCHAR(255) NOT NULL,
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

INSERT INTO users (username, email, hashed_password) VALUES
('admin', 'admin@admin.admin', '$2y$10$o4ESuGCAqBF9pl3umkZr4.WVlTzaoIXs.WxkIxsTM0dJ4..jnXNO.'),
('user', 'user@user.user', '$2y$10$YaoqcDMzKfRVHmFbKs6\/5u1pDyaS2IQppv4k5a3OYiu8fbp.3I.J6'),
('test', 'test@test.test', '$2y$10$BxFSktxwOdAXJSNYiSNIRO2c93CiTn4KHTTyoPVMjErx0hwfAzI0S');

INSERT INTO boards (board_id, user_id, board_title, board_desc, board_share_password) VALUES
('641ab44f-9f8f-4c07-8ff4-dc54986d8c5b', 1, 'Admin Test Board 1', 'Admin Test Board 1 Description', 'CnEVohEukW'),
('2913fa80-b584-462a-8765-8b0ed9d9af24', 1, 'Admin Test Board 2', 'Admin Test Board 2 Description', 'dlUEVmGerS'),
('6f31adc9-83b7-4cc6-9528-b61b83d92a0b', 1, 'Admin Test Board 3', 'Admin Test Board 3 Description', 'bTcOyinxlM'),
('3c5c110c-3c3d-41cf-8189-ba911636d9ed', 1, 'Lorem ipsum dolor sit amet, cons', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ornare non urna sit amet convallis. Integer elementum turpis pellentesque eros venenatis semper. Nam aliquam, odio eu dictum interdum, tellus dui pellentesque mi, non aliquet dui metus eu libero. Cras nunc ante, vulputate in odio et, auctor dignissim nibh. Ut at consequat nulla. Suspendisse rhoncus lacus dapibus, ultricies augue tempus, sagittis est. Nulla aliquet dignissim tortor in bibendum. Fusce volutpat interdum arcu, sed congue arcu pharetra sed. Quisque iaculis mollis tempor. Mauris et massa risus. Pellentesque molestie, ante eget laoreet vestibulum, eros ex pellentesque tellus, et rutrum est libero id mi. Aenean vestibulum eu nisi sollicitudin finibus.\n\nPhasellus vulputate lorem vitae condimentum molestie. Aliquam tincidunt sapien at massa venenatis, quis varius est tristique. Duis laoreet turpis ut justo tincidunt faucibus. Maecenas massa mauris, accumsan quis diam et, sodales facilisis libero. Nulla a feugiat ipsum, id luctus est. Pellentesque eget aliquam augue, vitae imperdiet lacus. Pellentesque sit amet nulla ac leo aliquet tristique vestibulum at mi. In hac habitasse platea dictumst. Aenean vulputate ipsum tempus risus consequat, et finibus felis egestas.\n\nQuisque sollicitudin nibh eu purus laoreet dapibus. Mauris elementum urna nec nisl hendrerit molestie. Vestibulum mauris neque, lacinia nec risus eu, placerat egestas arcu. Praesent sed nulla id nibh iaculis convallis id quis risus. Quisque hendrerit scelerisque rutrum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse pulvinar elit nunc, ut pretium turpis porta in. Cras pellentesque, enim in tincidunt placerat, lacus metus tincidunt erat, non interdum nibh sem at diam. Cras risus urna, rutrum id erat sed, egestas ornare ligula. Proin sed rutrum nibh, sed viverra risus. Donec varius quis enim at dignissim. Sed mattis semper tellus, non aliquet ipsum faucibus sed. Quisque in sem at sem fringilla imperdiet a nec orci.\n\nProin eget mattis mauris. Nullam eleifend aliquet justo et convallis. Fusce finibus eros vel turpis dignissim rhoncus. Donec auctor, risus eu blandit dapibus, leo purus posuere magna, at finibus elit est a diam. Etiam cursus enim eget mattis luctus. Proin sed lorem a nisi euismod volutpat ut ut ligula. Aenean eget lectus urna. Donec lacinia et turpis ut ultrices.\n\nDonec posuere sit amet risus sit amet dictum. Morbi eu rutrum urna. Nullam tincidunt neque in porttitor mollis. Curabitur feugiat metus quis odio auctor tempus. Sed vulputate cursus nisi ut ornare. Nullam vitae vehicula orci. Ut a cursus nisl, vitae pellentesque neque. Nunc ac condimentum orci, et rutrum nulla. Integer tellus massa, congue sed consequat in, ultrices rutrum libero. Vivamus volutpat sagittis sapien nec malesuada.\n\nNulla eu neque odio. Ut at aliquet tellus. Etiam id convallis velit. Phasellus elit enim, faucibus id felis ullamcorper, tempus ultricies nisl. Maecenas molestie non ex et finibus. Etiam cursus sed metus id tristique. Curabitur tempus, metus a aliquet lacinia, mi leo bibendum ligula, at tempor velit nibh id nulla. Donec suscipit justo a dolor posuere, ac tincidunt risus pellentesque. Vivamus ac interdum lectus, eget tempus turpis. Sed commodo quis sapien et lacinia. Nulla ultricies, tortor ac venenatis ullamcorper.', 'cearrzYNCm'),
('6892fe41-95ad-4ad3-a9d3-b60c84cb988a', 2, 'Shared Board', 'Shared Board Description', 'cvG03HQtIG');

INSERT INTO notes (title, text, board_id) VALUES
('Lorem ipsum', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent purus ante, porta sit amet est a, porttitor vulputate enim. Curabitur ut dui elit. Aliquam at congue metus. Aenean tempus, nulla laoreet ultricies rutrum, lorem nibh posuere augue, in ornare eros nulla at erat. Suspendisse vel purus lectus. Aenean sit amet consequat leo. Etiam at nisi eget massa sollicitudin molestie.',
'3c5c110c-3c3d-41cf-8189-ba911636d9ed'),
('Lorem ipsum 1', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent purus ante, porta sit amet est a, porttitor vulputate enim. Curabitur ut dui elit. Aliquam at congue metus. Aenean tempus, nulla laoreet ultricies rutrum, lorem nibh posuere augue, in ornare eros nulla at erat. Suspendisse vel purus lectus. Aenean sit amet consequat leo. Etiam at nisi eget massa sollicitudin molestie.',
'3c5c110c-3c3d-41cf-8189-ba911636d9ed'),
('Lorem ipsum 2', 'Lorem ipsum dolor sit amet, consectetur adipiscing. Praesent purus ante, porta sit amet est a, porttitor vulputate enim. Curabitur ut dui elit. Aliquam at congue metus. Aenean tempus, nulla laoreet ultricies rutrum, lorem nibh posuere augue, in ornare eros nulla at erat. Suspendisse vel purus lectus. Aenean sit amet consequat leo. Etiam at nisi eget massa sollicitudin molestie.',
'3c5c110c-3c3d-41cf-8189-ba911636d9ed');

/* This will share the 'Shared Board' of 'user' with 'test' */
INSERT INTO shared_boards (board_id, user_id) VALUES ('6892fe41-95ad-4ad3-a9d3-b60c84cb988a', 3);