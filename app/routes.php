<?php

use \App\Middlewares\AuthStatus;

$app->get('/', 'HomeController:index')->setName('home');

$app->group('',function (){
    $this->post('/auth/signup','AuthController:postSignup')->setName('auth.signup');
    $this->post('/auth/login','AuthController:postLogin')->setName('auth.login');
})->add(new AuthStatus($container));

$app->post('/roomAllot','RoomAllotController:roomAllotStatus')->setName('roomAllot');
$app->post('/booking','BookingController:booking')->setName('bookingConfirm');
$app->get('/auth/login','AuthController:getLogout')->setName('auth.logout');

$app->get('/roomAllot','RoomAllotController:getRoomAllot')->setName('booking.roomAllot');
$app->post('/availabilityCheck','AvailabilityController:availabilityChecker')->setName('availability.check');
$app->get('/account','AccountController:getUserData')->setName('account');

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