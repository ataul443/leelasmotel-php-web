<?php
/**
 * Created by PhpStorm.
 * User: devil443
 * Date: 03-Mar-18
 * Time: 2:07 PM
 */

namespace App\Handlers;

use \App\Models\Availability;
use \App\Models\Rooms;

class AvailabilityHandler
{
    private $standard = [];
    private $delux = [];
    private $royal = [];
    private $allRooms = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12', 'L13','L14', 'L15', 'L16'];

    public function date_range($first, $last, $step = '+1 day', $output_format = 'd-m-Y')
    {

        $dates = array();
        $current = strtotime($first);
        $last = strtotime($last);

        while ($current <= $last) {

            $dates[] = date($output_format, $current);
            $current = strtotime($step, $current);
        }

        return $dates;
    }

    public function availableRooms(array $dates, array $allRooms)
    {
        foreach ($dates as $date) {
            $dataRoomFilledStr = Availability::where('date', $date)->value('roomFilled');
            if (!$dataRoomFilledStr) {
                continue;
            }
            $roomFilledData = explode(',', $dataRoomFilledStr);
            foreach ($roomFilledData as $room) {
                if (in_array($room, $this->allRooms)) {
                    $this->allRooms = array_diff($this->allRooms, [$room]);
                }
            }
        }
        return $this->allRooms;
    }

    public function categoryIndex($availableRooms)
    {
        foreach ($availableRooms as $room){
            $category = Rooms::where('roomId',$room)->value('category');
            switch ($category){
                case 'royal':
                    array_push($this->royal,$room);
                    break;

                case 'delux':
                    array_push($this->delux,$room);
                    break;

                default  :
                    array_push($this->standard,$room);
            }
        }

    }

    public function availableRoomData($checkin,$checkout){
        $dates = $this->date_range($checkin,$checkout);
        $this->availableRooms = $this->availableRooms($dates,$this->allRooms);
        $this->categoryIndex($this->availableRooms);
        return ['standard'=> $this->standard,
            'delux'=>$this->delux,
            'royal'=>$this->royal];
    }
}
