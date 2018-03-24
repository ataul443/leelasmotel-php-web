<?php
/**
 * Created by PhpStorm.
 * User: devil443
 * Date: 16-Mar-18
 * Time: 4:57 AM
 */

namespace App\Controllers;

use App\Handlers\AvailabilityHandler;

class AvailabilityController extends Controller
{
    public function availabilityChecker($req,$res){
        $params = $req->getParams();
        $checkin = $params['checkin'];
        $checkout = $params['checkout'];
        //$adult = $params['adult'];
        //$child = $params['child'];

        $checkin = \DateTime::createFromFormat('Y-m-d',$checkin)->format('d-m-Y');
        $checkout = \DateTime::createFromFormat('Y-m-d',$checkout)->format('d-m-Y');

        $availHandler = new AvailabilityHandler;
        $roomStatus = $availHandler->availableRoomData($checkin,$checkout);
        return $res->withJson(['status'=> $roomStatus]);
    }
}