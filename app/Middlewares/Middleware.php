<?php
/**
 * Created by PhpStorm.
 * User: devil443
 * Date: 03-Mar-18
 * Time: 10:18 AM
 */

namespace App\Middlewares;

class Middleware
{
    protected $container;
    public function __construct($container)
    {
        $this->container = $container;
    }

}