<?php

    $host = 'localhost';
    $port = '3307';
    $dbname = 'sharedboard';
    $username = 'root';
    $password = '';

    $dsn = "mysql:host=$host;port=$port;dbname=$dbname";

    class DB {
        private $host = 'localhost';
        private $port = '3307';
        private $dbname = 'sharedboard';
        private $username = 'root';
        private $password = '';
        private $dsn;
        public $connection;

        public function __construct() {
            $this->dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->dbname}";
            //note that this connection may not work if the database is hosted on another localhost, or has a different name
            //the localhost is 3307
            $this->connection = new PDO($this->dsn, $this->username, $this->password);
        }

        public function getConnection() {
            return $this->connection;
        }
    }

?>