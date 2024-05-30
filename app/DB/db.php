<?php

    class DB {
        public $connection;

        public function __construct() {
            //note that this connection may not work if the database is hosted on another localhost, or has a different name
            //the localhost is 3307
            $this->connection = new PDO("mysql:host=localhost:3307;dbname=sharedboard", "root", "");
        }

        public function getConnection() {
            return $this->connection;
        }
    }

