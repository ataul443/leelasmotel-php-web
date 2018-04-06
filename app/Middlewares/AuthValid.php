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
    public function __invoke($request,$response,$next)
    {
        // TODO: Implement __invoke() method.
        if(!$this->container->AuthCheck->status()){
            $response = $response->withRedirect($this->container->router->pathFor('home'));
        }

        $response = $next($request,$response);
        return $response;
    }
}