<?php
/**
 * Created by PhpStorm.
 * User: devil443
 * Date: 03-Mar-18
 * Time: 11:11 PM
 */

namespace App\Handlers;

use Couchbase\Exception;
use \Firebase\JWT\JWT;
use \Dotenv\Dotenv;

$dotenv = new Dotenv(__DIR__ . '/../../');
$dotenv->load();

class TokenHandler{
    protected $secret_key;
    public function __construct()
    {
        $this->secret_key  = getenv('SECRET_KEY');
    }

    public function tokenGenerator($username){
        $tokenId    = base64_encode(random_bytes(32));
        $issuedAt   = time();
        $notBefore  = $issuedAt + 10;             //Adding 10 seconds
        $expire     = $notBefore + (15*60);            // Adding 60 seconds
        $serverName = $_SERVER['SERVER_NAME'];


        $token = array(
            'iat'  => $issuedAt,         // Issued at: time when the token was generated
            'jti'  => $tokenId,          // Json Token Id: an unique identifier for the token
            'iss'  => $serverName,       // Issuer
            'nbf'  => $notBefore,        // Not before
            'exp'  => $expire,           // Expire
            'data' => [                  // Data related to the signer use
                'username' => $username, // Email
            ]);

        $jwt = JWT::encode($token,$this->secret_key, 'HS256');
        return $jwt;

    }

     public function tokenDecoder($token){
        try{
            $decodedToken = JWT::decode($token,$this->secret_key,'HS256');
            return 'OK';
        }catch (Exception $e) {
            return 'AUTH_FAILED';
        }

    }
}