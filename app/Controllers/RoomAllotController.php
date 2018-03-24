<?php

namespace App\Controllers;

use App\Handlers\AvailabilityHandler;

class RoomAllotController extends Controller
{
    protected $category,$price,$adult,$child,$standard,$delux,$royal,$checkIn,$checkOut;
    protected $errorStack;
    protected $availabilityHandler,$roomStatus,$bookingStatus,$roomToFill;


    public function __construct($container)
    {
        parent::__construct($container);
        $this->availabilityHandler = new AvailabilityHandler();
    }

    public function roomAllotStatus($req,$res){
        $params = $req->getParams();
        $this->checkIn = html_entity_decode($params['checkIn']);
        $this->checkOut = html_entity_decode($params['checkOut']);
        $this->child = html_entity_decode($params['child']);
        $this->adult = html_entity_decode($params['adult']);

        $this->checkIn = \DateTime::createFromFormat('Y-m-d',$this->checkIn)->format('d-m-Y');
        $this->checkOut = \DateTime::createFromFormat('Y-m-d',$this->checkOut)->format('d-m-Y');

        $this->standard = html_entity_decode($params['standard']);
        $this->delux = html_entity_decode($params['delux']);
        $this->royal = html_entity_decode($params['royal']);

        $this->errorStack = $this->roomAllotter();
        if(!$this->errorStack){
            $this->errorStack = "";
        }
        $customerPersonalData = $this->AuthCheck->getUserPersonalInfo();
        return $res->withJson(['errorStack'=>$this->errorStack,'adult'=>$this->adult,'child'=>$this->child,'roomAllotted'=>$this->roomToFill,'customerData'=>$customerPersonalData]);

    }

    private function roomAllotter(){
        $this->roomStatus = $this->availabilityHandler->availableRoomData($this->checkIn,$this->checkOut);

        $standardRoomCount = count($this->roomStatus['standard']);
        $deluxRoomCount = count($this->roomStatus['delux']);
        $royalRoomCount = count($this->roomStatus['royal']);

        if($this->standard > $standardRoomCount){
            $errorException = 'This number of Standard Rooms are not available in given date interval.';
        }elseif ($this->delux > $deluxRoomCount){
            $errorException = 'This number of Delux Rooms are not available in given date interval.';
        }elseif ($this->royal > $royalRoomCount){
            $errorException = 'This number of Royal Rooms are not available in given date interval.';
        }else{

            $errorException = false;
            $this->roomToFill = [];

            for($i = 0; $i < $this->standard;$i++) {
                $temp = $this->roomStatus['standard'][$i];
                array_push($this->roomToFill,$temp);

            }


            for($i = 0; $i < $this->delux;$i++){
                $temp = $this->roomStatus['delux'][$i];
                array_push($this->roomToFill,$temp);
            }

            for($i = 0; $i < $this->royal;$i++){
                $temp = $this->roomStatus['royal'][$i];
                array_push($this->roomToFill,$temp);
            }
           //print_r($this->roomToFill);
            //print_r($this->roomStatus);

            $dates = $this->availabilityHandler->date_range($this->checkIn,$this->checkOut);
           // print_r($dates);
            $this->availabilityHandler->updateRecord($dates,$this->roomToFill);

        }
        return $errorException;
    }
}