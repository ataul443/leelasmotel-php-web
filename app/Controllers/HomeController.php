<?php

namespace App\Controllers;

use App\Handlers\CounterHandler;

class HomeController extends Controller
{
    protected $counterHandler,$priceList;

    public function __construct($container)
    {
        parent::__construct($container);
        $this->counterHandler = new CounterHandler();
    }


    public function index($request, $response)
    {

        //$pass = password_hash('allisgod',PASSWORD_DEFAULT);
        //$email = 'owner@gmail.com';
        //Owners::insert(['email'=>$email,'password'=>$pass]);
        $priceList = $this->counterHandler->getPriceList();

        return $this->view->render($response, 'home.twig',['price'=>$priceList]);

    }





}

