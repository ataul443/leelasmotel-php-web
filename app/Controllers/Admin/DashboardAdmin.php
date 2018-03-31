<?php

namespace App\Controllers\Admin;
use App\Controllers\Controller;

use Respect\Validation\Validator as v;
use App\Models\Owners;


class DashboardAdmin extends Controller
{


    public function getDashboard($req,$res){
        return $this->view->render($res,'admin/dashboard.twig');
    }
}