<?php

namespace App\Controllers\Admin;
use App\Controllers\Controller;

use Respect\Validation\Validator as v;
use App\Models\Bookings;


class BookingsAdmin extends Controller
{

    public function __construct($container)
    {
        parent::__construct($container);
    }

    public function getBookings($req,$res){
        return $this->view->render($res,'admin/bookings.twig');
    }


    public function postBookingList($req,$res){
        $params = $req->getParams();
        $offset = $params['offset'];
        $data = $this->getBookingsList($offset);
        $size = Bookings::count();
        if(!$data){
            return $res->withJson(['error'=>'NO_BOOKINGS'],401);
        }
        return $res->withJson(['bookingsList'=>$data,'size'=>$size],200);
    }


    private function getBookingsList($offset){
        $limit = 10;
        $bookings = Bookings::offset($offset)->limit($limit)->get();
        $data = "";
        foreach ($bookings as $booking){
            $id = $booking->bookingId;
            $data = $data.<<< EOD
            <tr>                                <td id=" -{$id}">...</td>
                                                <td id="id-{$id}">{$id}</td>
                                                <td id="name-{$id}">{$booking->name}</td>
                                                <td id="mobile-{$id}">{$booking->mobile}</td>
                                                <td id="checkin-{$id}">{$booking->checkIn}</td>
                                                <td id="checkout-{$id}">{$booking->checkOut}</td>
                                                <td id="price-{$id}">{$booking->price}</td>
                                                <td id="roomAllotted-{$id}">{$booking->roomAllotted}</td>
                                                <td id="morelink-{$id}"><a id="more-{$id}" href="#">More<script>
                                                var url = urlBuilder('admin/bookings/get/{$id}');
                                                $("#more-{$id}").attr("href",url);
</script></a></td>
                                                
                                            </tr>
EOD;
        }
        return $data;

    }

}