<?php
/**
 * Created by PhpStorm.
 * User: devil443
 * Date: 21-Mar-18
 * Time: 2:30 AM
 */

namespace App\Controllers;
use App\Handlers\CounterHandler;
use App\Handlers\BookingHandler;
use App\Handlers\AvailabilityHandler;

class BookingController extends Controller{
    private $bookingHandler,$counterHandler,$returnData;

    public function __construct($container)
    {
        parent::__construct($container);
        $this->bookingHandler = new BookingHandler();
    }

    public function booking($req,$res){
        $admin = isset($_SESSION['adminEmail']);
        if($admin){
            if(!$this->container->AuthCheck->statusAdmin()){
                return $res->withJson(['errorStack'=> 'access denied'],401);
            }
        }else{
            if(!$this->container->AuthCheck->status()){
                return $res->withJson(['errorStack'=> 'access denied'],401);
            }
        }

        $params = $req->getParams();
        $_SESSION['confirmBookingData'] = $params;
        $_SESSION['paymentStatus'] = true;

        //Payment Gateway Setup Here;


        //---------------------------
        $flag = $this->confirmBooking();
        if($flag == 'CANCEL_SUCCESS'){
            return $res->withJson(['error'=>'cancel_rooms'],401);
        }else{
            return $res->withJson(['bookingTicket'=>$flag]);
        }

    }

    private function confirmBooking(){
        if($_SESSION['paymentStatus'] == false){
            $dates = $_SESSION['bookingCriticalData']['dates'];
            $roomToFill = $_SESSION['bookingCriticalData']['roomToFill'];
            $availabilityHandler = new AvailabilityHandler();
            return $availabilityHandler->cancelBooking($dates,$roomToFill);

        }
        $params = $_SESSION['confirmBookingData'];
        $this->counterHandler = new CounterHandler();
        $bookingId = $this->counterHandler->getBookingId();

        /*
        $roomAllotted = html_entity_decode($params['roomAllotted']);
        $adult = html_entity_decode($params['adult']);
        $child = html_entity_decode($params['child']);
        $address = html_entity_decode($params['address']);
        $mobile = html_entity_decode($params['mobile']);
        $name = html_entity_decode($params['name']);


        $checkIn = html_entity_decode($params['checkIn']);
        $checkOut = html_entity_decode($params['checkOut']);
        $price = html_entity_decode($params['price']);
        $customerId = html_entity_decode($params['customerId']);
        */

        foreach ($params as $key=>$value){
            $params[$key] = html_entity_decode($value);
        }

        $params['bookingId'] = $bookingId;

        $data = $params;
        $this->returnData = $data;
        $this->bookingHandler->addBookingRecord($data);
        $this->counterHandler->updateCounter('bookingCounter');
        return $data;


    }


}

