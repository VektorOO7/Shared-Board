


Version:
    final 

Instructions to set up:
    After exporting the zip file to the required destination go to 1MI0600098_0MI0600022_3MI0600019_exam_final\app\DB\db.php. In the file are the following variables: private $host = 'localhost'; private $port = '3307'; private $dbname = 'sharedboard'; private $username = 'root'; private $password = ''; change those to match the xampp settings which may include setting the port to 3306 and changing the username and password. After this is done run either the db_create_script.sql to create the databas or db_create_script(testing).sql if you want to fill it with test data

Change log:
    + added import feature
    + added export frature
	+(there is a valid csv file in the test_images folder or one can be exported. The csv file consists of a board title and baord description followed by a header containing Title,Description,File Name,File Type,File Size,File Base64 which are followed by the necessery data. filesa are ecoded in base 64)
    + sharing is now done by taking the proper parameters and will work regardless of the apps location
    + registration allows for more emails
    + fixed encoding bug, cyrillic works well now
    + Database settings are now in seperate variables
Files:
    './Shared Board' - Shortcut for the web app(may not work)
    './app/' - Folder with all the code
    './Documentation.pdf' - Documentation for the project
    '.db_create_script.sql/' - SQL Script for creating the DB
    '.db_create_script (testing).sql/' - SQL Script for creating the DB + testing data
    './test_images/' - A directory with images for testing purposes

Required Versions:
    XAMPP Control Panel v3.3.0
    Apache 2.4.58
    MariaDB 10.4.32
    PHP version 8.2.12

Used Ports:
    Apache Port = 8443
    MySQL Port = 3307