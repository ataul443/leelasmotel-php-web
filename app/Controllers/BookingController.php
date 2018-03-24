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

class BookingController extends Controller{
    private $bookingHandler,$counterHandler;

    public function __construct($container)
    {
        parent::__construct($container);
        $this->bookingHandler = new BookingHandler();
    }

    public function booking($req,$res){
        $params = $req->getParams();
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
        $this->bookingHandler->addBookingRecord($data);
        $this->counterHandler->updateCounter('bookingCounter');
        return $res->withJson($data);


    }
}