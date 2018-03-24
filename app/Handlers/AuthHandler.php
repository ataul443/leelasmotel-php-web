<?php
/**
 * Created by PhpStorm.
 * User: devil443
 * Date: 03-Mar-18
 * Time: 2:07 PM
 */

namespace App\Handlers;

use \App\Models\User;
use \App\Handlers\TokenHandler;
use App\Handlers\CounterHandler;


class AuthHandler
{
    /*
 * TO DO - Implement arguments correctly;
 */
    private $user,$username,$email,$password;

    public function __construct($email,$password,$username = Null)
    {
        $this->email = $email;
        $this->username = $username;
        $this->password = $password;
    }

    public function signUpHandler(){

        $hashPassword = password_hash($this->password, PASSWORD_DEFAULT);
        if(User::where('username',$this->username)->count() > 0){
            //Username Exists;
            $errorUsername = 'USERNAME_EXISTS';
            return $errorUsername;

        }elseif (User::where('email',$this->email)->count()>0){
            //email exists;
            $errorEmail = 'EMAIL_EXISTS';
            return $errorEmail;
        }else{
            $customer = new CounterHandler();
            User::create([
                'email'=>$this->email,
                'password'=>$hashPassword,
                'username'=>$this->username,
                'customerId'=>$customer->getCustomerId()
            ]);
            $tokenGen = new TokenHandler;
            $token = $tokenGen->tokenGenerator($this->username);
            return $token;
        }
    }

    public function loginHandler(){
        $storedHashPassword = User::where('email',$this->email)->value('password');
        if($storedHashPassword != null){
            if(password_verify($this->password,$storedHashPassword)){
                $tokenVerify = new TokenHandler;
                $issuedToken = $tokenVerify->tokenGenerator($this->email);
                return $issuedToken;
            }else{
                return 'WRONG_PASS';
            }
        }else{
            return 'NOT_EXISTS';
        }

    }
}