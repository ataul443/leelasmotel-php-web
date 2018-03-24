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
        $bookingIdList = Bookings::where('customerId',$customerId)->value('bookingId');
        return $bookingIdList;
    }
}