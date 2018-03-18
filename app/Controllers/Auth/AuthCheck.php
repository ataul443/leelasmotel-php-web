<?php
/**
 * Created by PhpStorm.
 * User: devil443
 * Date: 17-Mar-18
 * Time: 6:42 PM
 */

namespace App\Controllers\Auth;

use App\Controllers\Controller;

use App\Models\User;

class AuthCheck extends Controller
{

    public function getUserData(){
        $email = isset($_SESSION['userEmail']);
        if($email){
                $this->username = User::where('email',$email)->value('username');
                $this->user = ['username'=>$this->username,'email'=>$email];
                return $this->user;

        }else{
            return false;
        }
    }

    public function status(){
        return isset($_SESSION['userEmail']);
    }
}