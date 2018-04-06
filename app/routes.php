<?php

use \App\Middlewares\AuthStatus;
use \App\Middlewares\AuthValid;

$app->get('/', 'HomeController:index')->setName('home');

$app->group('',function (){
    $this->post('/auth/signup','AuthController:postSignup')->setName('auth.signup');
    $this->post('/auth/login','AuthController:postLogin')->setName('auth.login');
})->add(new AuthStatus($container));

$app->group('',function(){
$this->get('/roomAllot','RoomAllotController:getRoomAllot')->setName('booking.roomAllot');
$this->post('/roomAllot','RoomAllotController:roomAllotStatus')->setName('roomAllot');
$this->post('/booking','BookingController:booking')->setName('bookingConfirm');
$this->get('/account','AccountController:getUserData')->setName('account');
$this->get('/account/update','AccountController:getUpdateProfile')->setName('account.update');
$this->post('/account/update','AccountController:updateAccount');
})->add(new AuthValid($container));


$app->get('/auth/login','AuthController:getLogout')->setName('auth.logout');


$app->post('/availabilityCheck','AvailabilityController:availabilityChecker')->setName('availability.check');


$app->get('/admin/dashboard','AdminDashboardController:getDashboard')->setName('admin.dashboard');


$app->get('/admin/auth','AdminAuthController:getAuth')->setName('admin.getAuth');
$app->get('/admin/auth/logout','AdminAuthController:getLogout')->setName('admin.logout');
$app->post('/admin/auth','AdminAuthController:postAuth');

$app->get('/admin/webedit','AdminWebEditController:getWebEdit')->setName('admin.webedit');
$app->post('/admin/webedit','AdminWebEditController:postPic');
$app->post('/admin/webedit/setprice','AdminWebEditController:postPrice');


$app->post('/admin/bookings','AdminBookingsController:postBookingList');
$app->post('/admin/bookings/search','AdminBookingsController:postSearch');
$app->get('/admin/bookings/detail/{id}','AdminBookingsController:getDetail');
$app->get('/admin/bookings','AdminBookingsController:getBookings')->setName('admin.bookings');


$app->get('/admin/customers','AdminCustomersController:getCustomers')->setName('admin.customers');
$app->post('/admin/customers','AdminCustomersController:postCustomerList');
$app->get('/admin/customers/detail/{id}','AdminCustomersController:getDetail');
$app->post('/admin/customers/search','AdminCustomersController:postSearch');

$app->get('/admin/newbooking','AdminNewBookingController:getNewBooking')->setName('admin.newbooking');
$app->post('/admin/newbooking','AdminNewBookingController:postNewBooking');
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