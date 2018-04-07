<?php
/**
 * Created by PhpStorm.
 * User: atsul443
 * Date: 07-04-2018
 * Time: 00:58
 */


namespace App\Middlewares;

class AuthValid extends Middleware
{
    public function __invoke($request,$res,$next)
    {
        // TODO: Implement __invoke() method.
        $admin = isset($_SESSION['adminEmail']);
        if($admin){
            if(!$this->container->AuthCheck->statusAdmin()){
                $res = $res->withRedirect($this->container->router->pathFor('admin.getAuth'));
            }
        }else{
            if(!$this->container->AuthCheck->status()){
                $res = $res->withRedirect($this->container->router->pathFor('home'));
            }
        }

        $res = $next($request,$res);
        return $res;
    }
}