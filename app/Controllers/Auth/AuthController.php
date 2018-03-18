<?php
/**
 * Created by PhpStorm.
 * User: devil443
 * Date: 03-Mar-18
 * Time: 9:28 AM
 */

namespace App\Controllers\Auth;


use \App\Controllers\Controller;
use \App\Handlers\AuthHandler;
use Respect\Validation\Validator as v;

class AuthController extends Controller
{
    /*
     * @authStatus -> variable in Session for authentication status
     */
    private $user_handler;


    //LogoutHandlers
    public function getLogout($request,$response){
        if(isset($_SESSION['userEmail'])){
            unset($_SESSION['userEmail']);
        }
        return $response->withRedirect($this->router->pathFor('home'));
    }

    //Login Handlers

   public function postLogin($request,$response){
        $params = $request->getParams();

        $email = $params['email'];
        $password = $params['password'];

        $validation = $this->validator->validate($params,[
            'email' => v::noWhitespace()->notEmpty(),
            'password'=> v::notEmpty()
        ]);

        if($validation->failed()){
            $response = $response->withStatus(400);
            $_SESSION['validationErrors'] = 'Invalid Credentials Submitted.';
            return $response->withRedirect($this->router->pathFor('home'));
        }else{
            $this->user_handler = new AuthHandler($email,$password);
            $token = $this->user_handler->loginHandler();

            switch ($token){
                case 'WRONG_PASS':
                    $response->withStatus(401);
                    $_SESSION['validationErrors'] = 'Incorrect Password';
                    return $response->withJson(['status'=>'bad','code'=>401,'messages'=>[ $_SESSION['validationErrors']]]);

                case 'NOT_EXISTS':
                    $response->withStatus(401);
                    $_SESSION['validationErrors'] = 'User Does Not Exist.';
                    return $response->withJson(['status'=>'bad','code'=>401,'messages'=>[ $_SESSION['validationErrors']]]);

                default:
                    $_SESSION['userEmail'] = $email;
                    $response = $response->withHeader('Authentication',"Bearer $token");
                    $response = $response->withStatus(200);
                    return $this->view->render($response,'home.twig');
            }


        }
    }

    //Signup Handlers

    public function postSignup($request,$response){
        $params = $request->getParams();
        $email = $params['email'];
        $password= $params['password'];
        $username = $params['username'];

        $validation = $this->validator->validate($params,[
            'email' => v::noWhitespace()->notEmpty(),
            'password'=> v::notEmpty(),
            'username'=>v::noWhitespace()->notEmpty()->alnum()
        ]);

        if($validation->failed()){
            $response = $response->withStatus(400);

            $_SESSION['validationErrors'] = 'Invalid Credentials Submitted.';
            return $response->withJson(['status'=>'bad','code'=>401,'messages'=>[ $_SESSION['validationErrors']]]);
        }else{
            $this->user_handler = new AuthHandler($email,$password,$username);
            $flag = $this->user_handler->signUpHandler();
            if($flag == 'USERNAME_EXISTS'){
                $response = $response->withStatus(400);

                $_SESSION['validationErrors'] = 'Username Already Exist.';
                return $response->withJson(['status'=>'bad','code'=>401,'messages'=>[ $_SESSION['validationErrors']]]);
            }elseif ($flag == 'EMAIL_EXISTS'){
                $response = $response->withStatus(400);

                $_SESSION['validationErrors'] = 'Email Already Exist.';
                return $response->withJson(['status'=>'bad','code'=>401,'messages'=>[ $_SESSION['validationErrors']]]);
            }

            else{
                $token = "Bearer $flag";
                $response = $response->withStatus(200);
                $response = $response->withHeader('Authentication',$token);
                $_SESSION['userEmail'] = $email;
                return $response->withRedirect($this->router->pathFor('home'));
                //return $response->withJson(['status'=>'ok','code'=>200,'messages'=>[]]);
            }
        }
    }
}