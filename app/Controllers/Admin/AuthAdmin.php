<?php

namespace App\Controllers\Admin;
use App\Controllers\Controller;

use Respect\Validation\Validator as v;
use App\Models\Owners;


class AuthAdmin extends Controller
{
    private $email,$password;

    public function getAuth($req,$res){
        return $this->view->render($res,'admin/index.twig');
    }

    public function postAuth($request,$response){
        $params = $request->getParams();

        $this->email = $params['email'];
        $this->password = $params['password'];
        $this->password = password_hash($this->password,PASSWORD_DEFAULT);

        $validation = $this->validator->validate($params,[
            'email' => v::noWhitespace()->notEmpty(),
            'password'=> v::notEmpty()
        ]);

        if($validation->failed()){
            $response = $response->withStatus(400);
            $_SESSION['validationErrors'] = 'Invalid Credentials Submitted.';
            return $response->withRedirect($this->router->pathFor('home'));
        }else{
            $token = $this->loginHandler();

            switch ($token){
                case 'WRONG_PASS':
                    $response = $response->withStatus(401);
                    $_SESSION['validationErrors'] = 'Incorrect Password';
                    return $response->withJson(['status'=>'bad','code'=>401,'messages'=>[ $_SESSION['validationErrors']]]);

                case 'NOT_EXISTS':
                    $response = $response->withStatus(401);
                    $_SESSION['validationErrors'] = 'User Does Not Exist.';
                    return $response->withJson(['status'=>'bad','code'=>401,'messages'=>[ $_SESSION['validationErrors']]]);

                default:
                    $_SESSION['adminEmail'] = $this->email;
                    $response = $response->withHeader('Authentication',"Bearer $token");

                    //return $this->view->render($response,'home.twig');
                    //return $response->withHeader('Location',$this->router->pathFor('home'));
                    return $response->withStatus(200);
            }


        }
    }

    private function loginHandler(){
        $storedHashPassword = Owners::where('email',$this->email)->value('password');
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