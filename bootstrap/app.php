<?php

require __DIR__ . '/../vendor/autoload.php';

use \Dotenv\Dotenv;


session_start();
$dotenv = new Dotenv(__DIR__ . '/../');
$dotenv->load();

$db = [
    'driver' => getenv('DB_DRIVER'),
    'host' => getenv('DB_HOST'),
    'database' => getenv('DB_DATABASE'),
    'username' => getenv('DB_USERNAME'),
    'password' => getenv('DB_PASSWORD'),
    'charset' => getenv('DB_CHARSET'),
    'collation' => getenv('DB_COLLATION'),
    'prefix' => getenv('DB_PREFIX'),
];

$config['displayErrorDetails'] = true;
$config['addContentLengthHeader'] = false;
$config['db'] = $db;

$app = new \Slim\App(['settings' => $config]);

$container = $app->getContainer();

$capsule = new \Illuminate\Database\Capsule\Manager;
$capsule->addConnection($container['settings']['db']);
$capsule->setASGlobal();
$capsule->bootEloquent();

/*
$container['view'] = function ($container){
$view = new \Slim\Views\PhpRenderer(__DIR__.'/../resources/views');
return $view;
};
 */
$container['view'] = function ($container) {
    $view = new \Slim\Views\Twig(__DIR__ . '/../resources/views', [
        'cache' => false,
    ]);

    $view->addExtension(new \Slim\Views\TwigExtension(
        $container->router,
        $container->request->getUri()
    ));

    $view->getEnvironment()->addGlobal('auth',[
        'user' => $container->AuthCheck->getUserData(),
        'check' => $container->AuthCheck->status(),
        'price' => $container->AuthCheck->getPriceList()
    ]);

    return $view;

};

$container['db'] = function ($container) use ($capsule) {
    return $capsule;
};

$container['HomeController'] = function ($container) {
    return new \App\Controllers\HomeController($container);
};

$container['RoomAllotController'] = function ($container) {
    return new \App\Controllers\RoomAllotController($container);
};

$container['AuthController'] = function ($container) {
    return new \App\Controllers\Auth\AuthController($container);
};
$container['AuthCheck'] = function ($container) {
    return new \App\Controllers\Auth\AuthCheck($container);
};

$container['AvailabilityController'] = function ($container) {
    return new \App\Controllers\AvailabilityController($container);
};

$container['BookingController'] = function ($container) {
    return new \App\Controllers\BookingController($container);
};

$container['AccountController'] = function ($container) {
    return new \App\Controllers\AccountController($container);
};

$container['validator'] = function ($container) {
    return new \App\Validation\Validator;
};

require __DIR__ . '/../app/routes.php';
