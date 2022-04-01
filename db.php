<?php
class DBConnection
{
    public static function getConnection()
    {
        include './_config.php';
        $hostName = $CONFIG['sql_host'];
        $sql_user = $CONFIG['sql_user'];
        $sql_password = $CONFIG['sql_password'];
        $sql_database = $CONFIG['sql_database'];
        // $options = [
        //   PDO::ATTR_EMULATE_PREPARES   => false, // turn off emulation mode for "real" prepared statements
        //   PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, //turn on errors in the form of exceptions
        //   PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, //make the default fetch be an associative array
        // ];
        try {
          $pdo = new PDO("mysql:host=$hostName;dbname=$sql_database", $sql_user,$sql_password, $options);
          return $pdo;
        } catch (Exception $e) {
          error_log($e->getMessage());
          exit('Something weird happened'); //something a user can understand
        }
    }
}
?>