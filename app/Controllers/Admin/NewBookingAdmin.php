<?php

namespace App\Controllers\Admin;

use App\Controllers\BookingController;
use App\Controllers\Controller;



class NewBookingAdmin
{
    private $BookingController,$container;

    public function __construct($container)
    {
        $this->container = $container;
        $this->BookingController = new BookingController($container);

    }

    public function getNewBooking($req,$res){
        return $this->container->view->render($res,'admin/newBooking.twig');
    }

    public function postNewBookig($req,$res){

        $this->BookingController->booking($req,$res);
        return;
    }



}