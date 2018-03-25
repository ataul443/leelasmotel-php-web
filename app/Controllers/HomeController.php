<?php

namespace App\Controllers;
use Respect\Validation\Rules\Date;


class HomeController extends Controller
{
    protected $counterHandler,$priceList;


    public function index($request, $response)
    {

        return $this->view->render($response, 'home.twig');

    }





}

