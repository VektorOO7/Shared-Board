<?php

class DB {

    public $connection;

    public function __construct() {
        //note that this connection is may not work if your db is host on another localhost, or has a different name
        //the localhost is 3306 by default
        $this->connection = new PDO("mysql:host=localhost:3306;dbname=/*dbname goes here*/", "root", "");
    }

    public function getConnection() {
        return $this->connection;
    }

}