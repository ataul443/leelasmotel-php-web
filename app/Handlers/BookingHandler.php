<?php
/**
 * Created by PhpStorm.
 * User: devil443
 * Date: 21-Mar-18
 * Time: 1:31 AM
 */
namespace App\Handlers;
use App\Models\Bookings;
use App\Models\Customers;


class BookingHandler {

    public function addBookingRecord(array $data){
        Bookings::insert($data);
        $this->updateCustomer($data);
    }

    public function updateCustomer($params,$update=null){
        $customerId = html_entity_decode($params['customerId']);
        $name = html_entity_decode($params['name']);
        $mobile = html_entity_decode($params['mobile']);
        $address = html_entity_decode($params['address']);

        if(!Customers::where('customerId',$customerId)->exists()){
            Customers::insert(['customerId'=>$customerId,'name'=>$name,'mobile'=>$mobile,'address'=>$address]);
        }else if($update){
            Customers::where('customerId',$customerId)->update(['name'=>$name,'mobile'=>$mobile,'address'=>$address]);
        }else{
            return;
        }
    }

}