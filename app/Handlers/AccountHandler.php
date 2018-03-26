<?php
/**
 * Created by PhpStorm.
 * User: devil443
 * Date: 23-Mar-18
 * Time: 4:35 PM
 */

namespace App\Handlers;

use App\Models\Bookings;

class AccountHandler{

    public function getAllBookingId($customerId){
        $allBookings = Bookings::where('customerId',$customerId)->get();
        $bookingIdList = [];
        foreach ($allBookings as $booking){
            array_push($bookingIdList,['bookingId' => $booking->bookingId,'checkIn'=>$booking->checkIn,'checkOut'=>$booking->checkOut,'price'=>$booking->price]);
        }
        return $bookingIdList;
    }
}