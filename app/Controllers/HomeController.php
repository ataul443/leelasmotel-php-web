<?php

namespace App\Controllers;
use Respect\Validation\Rules\Date;
use App\Models\Owners;

class HomeController extends Controller
{
    protected $counterHandler,$priceList;


    public function index($request, $response)
    {

        //$pass = password_hash('allisgod',PASSWORD_DEFAULT);
        //$email = 'owner@gmail.com';
        //Owners::insert(['email'=>$email,'password'=>$pass]);

        return $this->view->render($response, 'home.twig');

    }





}

