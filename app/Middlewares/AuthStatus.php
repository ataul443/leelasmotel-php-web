<?php

namespace App\Middlewares;

class AuthStatus extends Middleware
{
    public function __invoke($request,$response,$next)
    {
        // TODO: Implement __invoke() method.
        if($this->container->AuthCheck->status()){
            $response = $response->withRedirect($this->container->router->pathFor('home'));
        }

        $response = $next($request,$response);
        return $response;
    }
}