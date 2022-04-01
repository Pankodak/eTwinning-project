<?php
include("./db.php");
require './vendor/autoload.php';
use \Firebase\JWT\JWT;
$app = new \Slim\App();

$GLOBALS['secret'] = 'sec!ReT423*&!bsp3d71a$';

$app->add(function ($req, $res, $next) {
    $response = $next($req, $res);
    return $response
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
});

$app->post('/login', function ($request, $response, $args) {
    // // $params = (array)$request->getParsedBody();
    $data = $request->getParsedBody()['data']; // Login i hasło 
    $email = $data['login'];
    $password = $data['password'];
    $rememberMe = $data['rememberMe'];
    if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return $response->withStatus(400)->write('Invalid Email or Password');
    }
    $db = DBConnection::getConnection();
    $stmt = $db->prepare("SELECT * FROM users WHERE email = :email AND password = PASSWORD(:password)");
    $stmt->bindValue(':email', $email);
    $stmt->bindValue(':password', $password);
    $stmt->execute();
    $count = $stmt->rowCount();
    $arr = $stmt->fetchAll();
    $stmt = null;
    $newobj = new stdClass();//create a new
    if($count == 0) {
        $newobj->code = 2;
        $newobj->msg = "Invalid Email or Password";
        return $response->withStatus(200)->write(json_encode($newobj));
    }
    $newobj->code = 1;
    $newobj->msg = "Login successfully";
    $newobj->username = $arr[0]['name']. " " .$arr[0]['surname'];
    $userId = intval($arr[0]['id']);
    $newobj->userId = $userId;
    $expiration = (time() + 3600);
    if($rememberMe) {
        $expiration = time() + 52234800;
    }
    $expiration = $expiration * 1000;
    $newobj->expiration = $expiration;
    $newobj->expiration = $expiration;
    
    $time = time();
    $payload = array(
        "iss" => "http:/necessaryskills-etwinning.com/",
        "aud" => "http:/necessaryskills-etwinning.com/",
        "iat" => $time,
        "nbf" => $time, 
        'exp' => $expiration,
        'userId' => $userId
    );

    $token = JWT::encode($payload, $GLOBALS['secret']);
    $newobj->token = $token;

    return $response->withStatus(200)->write(json_encode($newobj));
});

$app->post('/refresh', function ($request, $response, $args) {
    $token = $request->getParsedBody()['data']['token']; // Login i hasło 
    $result = (array)JWT::decode($token, $GLOBALS['secret'], array('HS256'));
    $newobj = new stdClass();//create a new
    if(time() * 1000 > +$result['exp']) {
        $newobj->code = 3;
        $newobj->msg = "Session expired";
    } else {    
        $id = $result['userId'];
        $db = DBConnection::getConnection();
        $stmt = $db->prepare("SELECT * FROM users WHERE id = $id");
        $stmt->execute();
        $arr = $stmt->fetchAll();
        $stmt = null;
        $newobj->code = 1;
        $newobj->msg = "Login successfully";
        $newobj->username = $arr[0]['name']. " " .$arr[0]['surname'];
        $newobj->userId = +$arr[0]['id'];
        $newobj->expiration = $result['exp'];
        $newobj->token = $token;
    }
    return $response->withStatus(200)->write(json_encode($newobj));
});

$app->post('/admin/api/{table}', function($request, $response, $args) {
    $table = $args['table'];
    $data = $request->getParsedBody()['data'];
    // $token = $data->token; // Login i hasło 
    $token = $data['token']; // Login i hasło 

    $result = (array)JWT::decode($token, $GLOBALS['secret'], array('HS256'));
    $newobj = new stdClass();//create a new
    if(time() * 1000 > +$result['exp']) {
        $newobj->code = 3;
        $newobj->msg = "Session expired";
    } else {   
        $table = $args['table'];
        $db = DBConnection::getConnection();
        $newobj->code = 1;
        $newobj->msg = "Records successfully downloaded";
        if($table == "customers") {
            $stmt = $db->prepare("SELECT 
            customers.id,
            customers.name_of_the_company, 
            customers.country, 
            customers.address,
            customers.contact,
            customers.branch,
            customers.trade_lines,
            customers.website,
            CONCAT(users.name, ' ', users.surname) as username,
            customers.comments,
            customers.userid as userid
             FROM customers INNER JOIN users ON customers.userid = users.id");
            $stmt->execute();
            $newobj->records = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }else if($table == "suppliers") {
            $stmt = $db->prepare("SELECT 
            suppliers.id,
            suppliers.name_of_the_company, 
            suppliers.country, 
            suppliers.address,
            suppliers.contact,
            suppliers.branch,
            suppliers.type_of_trailer,
            suppliers.quantity_of_trailer,
            suppliers.trade_lines,
            suppliers.website,
            CONCAT(users.name, ' ', users.surname) as username,
            suppliers.comments,
            suppliers.user_id as userid
             FROM suppliers INNER JOIN users ON suppliers.user_id = users.id");
            $stmt->execute();
            $newobj->records = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $newobj->code = 2;
            $newobj->msg = "Error while downloading";
        }
        $stmt = null;
    }
    return $response->withStatus(200)->write(json_encode($newobj));
});

$app->patch('/admin/api/{table}', function($request, $response, $args) {
    $data = $request->getParsedBody()['data'];
    $token = $data['token']; // Login i hasło 

    $result = (array)JWT::decode($token, $GLOBALS['secret'], array('HS256'));
    $newobj = new stdClass();//create a new
    if(time() * 1000 > +$result['exp']) {
        $newobj->code = 3;
        $newobj->msg = "Session expired";
    } else {
        $nameOfTheCompany = $data['nameOfTheCompany'];
        $country = $data['country'];
        $address = $data['address'];
        $contact = $data['contact'];
        $branch = $data['branch'];
        $tradeLines = $data['tradeLines'];
        $quantityOfTrailer = $data['quantityOfTrailer'];
        $typeOfTrailer = $data['typeOfTrailer'];
        $website = $data['website'];
        $userId = $result['userId'];
        $comments = $data['comments'];
        $table = $args['table'];
        $db = DBConnection::getConnection();
        $stmt = null;
        $id = null;
        if ($table == 'customers') {
            $sql = "INSERT INTO customers (name_of_the_company, country, address, contact, branch, trade_lines, website, userId, comments) VALUES(?,?,?,?,?,?,?,?,?)";
            $stmt= $db->prepare($sql);
            try {
                $stmt->execute([$nameOfTheCompany, $country, $address, $contact, $branch, $tradeLines, $website, $userId, $comments]);
                $id = $db->lastInsertId();
                $newobj->id = $id;
                $newobj->code = 1;
                $newobj->msg = "Successfully saved";
            } catch (\Throwable $th) {
                $newobj->msg = "Error while saving";
                $newobj->code = 2;
            }
            $stmt = null;
        } elseif ($table == 'suppliers') {
            $sql = "INSERT INTO suppliers (name_of_the_company, country, address, contact, branch, trade_lines, quantity_of_trailer, type_of_trailer, website, user_id, comments) VALUES (?,?,?,?,?,?,?,?,?,?,?) ";
            $stmt= $db->prepare($sql);
            try {
                $stmt->execute([$nameOfTheCompany, $country, $address, $contact, $branch, $tradeLines, $quantityOfTrailer, $typeOfTrailer, $website, $userId, $comments]);
                $newobj->msg = "Successfully saved";
                $newobj->code = 1;
                $id = $db->lastInsertId();
                $newobj->id = $id;
            } catch (\Throwable $th) {
                $newobj->msg = "Error while saving";
                $newobj->code = 2;
            }
            $stmt = null;
        } else {
            $newobj->msg = "Error while updating, table doesn't exist";
            $newobj->code = 2;
        }
    }
    return $response->withStatus(200)->write(json_encode($newobj));
});

$app->post('/admin/api/{table}/{id}', function($request, $response, $args) {
    $data = $request->getParsedBody()['data'];
    $token = $data['token']; // Login i hasło 
    $result = (array)JWT::decode($token, $GLOBALS['secret'], array('HS256'));
    $newobj = new stdClass();//create a new
    if(time() * 1000 > +$result['exp']) {
        $newobj->code = 3;
        $newobj->msg = "Session expired";
    } else {
        $nameOfTheCompany = $data['nameOfTheCompany'];
        $country = $data['country'];
        $address = $data['address'];
        $contact = $data['contact'];
        $branch = $data['branch'];
        $tradeLines = $data['tradeLines'];
        $quantityOfTrailer = $data['quantityOfTrailer'];
        $typeOfTrailer = $data['typeOfTrailer'];
        $comments = $data['comments'];
        $id = $args['id'];
        $user_id = $result['userId'];
        $table = $args['table'];
        $db = DBConnection::getConnection();
        $stmt = null;

        if ($table == 'customers') {
            $sql = "SELECT * FROM customers WHERE id=? AND userid=?";
            $stmt= $db->prepare($sql);
            $stmt->execute([$id, $user_id]);
            $canEdit = $stmt->rowCount() > 0;
            $stmt = null;
            if($canEdit) {
                $sql = "UPDATE customers SET name_of_the_company=?, country=?, address=?, contact=?, branch=?, trade_lines=?, comments=?  WHERE id=?";
                $stmt= $db->prepare($sql);
                try {
                    $stmt->execute([$nameOfTheCompany, $country, $address, $contact, $branch, $tradeLines, $comments, $id]);
                    $newobj->msg = "Successfully updated";
                    $newobj->code = 1;
                } catch (\Throwable $th) {
                    $newobj->msg = "Error while updating";
                    $newobj->code = 2;
                }
            } else {
                $newobj->msg = "You can't edit records that are not yours";
                $newobj->code = 2;
            }
        } elseif ($table == 'suppliers') {
            $sql = "SELECT * FROM suppliers WHERE id=? AND user_id=?";
            $stmt= $db->prepare($sql);
            $stmt->execute([$id, $user_id]);
            $canEdit = $stmt->rowCount() > 0;
            $stmt = null;
            if ($canEdit) {
                $sql = "UPDATE suppliers SET name_of_the_company=?, country=?, address=?, contact=?, branch=?, trade_lines=?, quantity_of_trailer=?, type_of_trailer=?, comments=?  WHERE id=?";
                $stmt= $db->prepare($sql);
                try {
                    $stmt->execute([$nameOfTheCompany, $country, $address, $contact, $branch, $tradeLines, $quantityOfTrailer, $typeOfTrailer, $comments, $id]);
                    $newobj->msg = "Successfully updated";
                    $newobj->code = 1;
                } catch (\Throwable $th) {
                    $newobj->msg = "Error while updating";
                    $newobj->code = 2;
                }
            } else {
                $newobj->msg = "You can't edit records that are not yours";
                $newobj->code = 2;
            }
        } else {
            $newobj->msg = "Error while updating, table doesn't exist";
            $newobj->code = 2;
        }
        $stmt = null;
    }

    return $response->withStatus(200)->write(json_encode($newobj));
});

$app->delete('/admin/api/{table}/{id}', function ($request, $response, $args) {
    // $token = $request->getParsedBody()['token'];
    // $result = (array)JWT::decode($token, $GLOBALS['secret'], array('HS256'));
    // $newobj = new stdClass();//create a new
    // if(time() * 1000 > +$result['exp']) {
    //     $newobj->code = 3;
    //     $newobj->msg = "Session expired";
    // } else {
    //     $newobj = new stdClass();//create a new
    //     $table = $args['table'];
    //     $id = $args['id'];
    //     $db = DBConnection::getConnection();
    //     $stmt = $db->prepare("DELETE FROM $table WHERE id = $id");
    //     try {
    //         $stmt->execute();
    //         $newobj->msg = "Successfully deleted";
    //         $newobj->code = 1;
    //     } catch (\Throwable $th) {
    //         $newobj->msg = "Error whiling deleting";
    //         $newobj->code = 2;
    //     }
    //     $stmt = null;
    // }
    $newobj = new stdClass();//create a new
    $newobj->msg = "You cant delete record";
    $newobj->code = 2;
    // // // $response->withJson($arr, 200);

    return $response->withStatus(200)->write(json_encode($newobj));
});

$app->get('/[{path:.*}]', function($request, $response, $path = null) {
    // return $response->write($path ? 'subroute' : 'index');
    $file = './main.html';
    if (file_exists($file)) {
        return $response->write(file_get_contents($file));
    } else {
        throw new \Slim\Exception\NotFoundException($request, $response);
    }
});


// Run application
$app->run();