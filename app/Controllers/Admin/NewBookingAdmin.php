<?php

namespace App\Controllers\Admin;
use App\Controllers\Controller;



class NewBookingAdmin extends Controller
{

    public function __construct($container)
    {
        parent::__construct($container);
    }

    public function getNewBooking($req,$res){
        return $this->view->render($res,'admin/newBooking.twig');
    }


}