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
$app->get('/account','AccountController:getUserData')->setName('account')->setName('account');

$app->get('/admin/dashboard','AdminDashboardController:getDashboard')->setName('admin.dashboard');


$app->get('/admin/auth','AdminAuthController:getAuth')->setName('admin.getAuth');
$app->post('/admin/auth','AdminAuthController:postAuth');

$app->get('/admin/webedit','AdminWebEditController:getWebEdit')->setName('admin.webedit');
$app->post('/admin/webedit','AdminWebEditController:postPic');
$app->post('/admin/webedit/setprice','AdminWebEditController:postPrice');


$app->post('/admin/bookings','AdminBookingsController:postBookingList');
$app->post('/admin/bookings/search','AdminBookingsController:postSearch');
$app->get('/admin/bookings','AdminBookingsController:getBookings')->setName('admin.bookings');


$app->get('/admin/customers','AdminCustomersController:getCustomers')->setName('admin.customers');
$app->post('/admin/customers','AdminCustomersController:postCustomerList');
$app->post('/admin/customers/search','AdminCustomersController:postSearch');
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