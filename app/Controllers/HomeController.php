<?php

namespace App\Controllers;
use Respect\Validation\Rules\Date;

use \App\Models\User;

class HomeController extends Controller
{
    public function index($request, $response)
    {

        return $this->view->render($response, 'home.twig');

    }



}

