<?php

use \App\Middlewares\AuthStatus;

$app->get('/', 'HomeController:index')->setName('home');

$app->group('',function (){
    $this->post('/auth/signup','AuthController:postSignup')->setName('auth.signup');
    $this->post('/auth/login','AuthController:postLogin')->setName('auth.login');
})->add(new AuthStatus($container));
$app->get('/auth/login','AuthController:getLogout')->setName('auth.logout');

$app->post('/availabilityCheck','AvailabilityController:availabilityChecker')->setName('availability.check');
$app->get('/booking',function($request,$response){
    return $this->view->render($response,'booking.twig');
});

/*
$app->group('/api', function () use ($app) {
    $app->get('/secret', function ($request, $response) {
        return 'SECRET';
    })->setName('ac.secret');
})->add(new AuthCheck($container));

//Login Routes
$app->get('/auth/login', 'AuthController:getLogin')->setName('auth.login');

$app->post('/auth/login', 'AuthController:postLogin');

//SignUp Routes
$app->get('/auth/signup', 'AuthController:getSignUp')->setName('auth.signup');

$app->post('/auth/signup', 'AuthController:postSignUp');
*/