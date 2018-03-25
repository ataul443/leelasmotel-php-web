<?php
/**
 * Created by PhpStorm.
 * User: devil443
 * Date: 21-Mar-18
 * Time: 1:23 AM
 */

namespace App\Handlers;

use App\Models\Counters;
use App\Models\Price;
use App\Models\Rooms;

class CounterHandler {
    public $bookingId,$customerId;

    public function getBookingId(){
        $bookingCounter = Counters::where('id',1)->value('bookingCounter');
        $this->bookingId = "LMBK$bookingCounter";
        return $this->bookingId;
    }

    public function getCustomerId(){
        $customerCounter = Counters::where('id',1)->value('customerCounter');
        $this->customerId = "LMC$customerCounter";
        return $this->customerId;
    }

    public function updateCounter($type){
        $counter = Counters::where('id',1)->value($type);
        $counter = (int)$counter;
        $counter++;
        Counters::where('id',1)->update([$type=>$counter]);
    }

    public function getPriceList(){
        $standard = Price::where('category','standard')->value('price');
        $delux = Price::where('category','delux')->value('price');
        $royal = Price::where('category','royal')->value('price');

        return ['standard'=>$standard,'delux'=>$delux,'royal'=>$royal];
    }

    public function getRoomPrice($room){
    $category = Rooms::where('roomId',$room)->value('category');
    $price = Price::where('category',$category)->value('category');
    return (int) $price;
    }
}