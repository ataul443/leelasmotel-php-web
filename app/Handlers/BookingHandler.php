<?php
/**
 * Created by PhpStorm.
 * User: devil443
 * Date: 21-Mar-18
 * Time: 1:31 AM
 */
namespace App\Handlers;
use App\Models\Bookings;


class BookingHandler {

    public function addBookingRecord(array $data){
        Bookings::insert($data);
    }

}