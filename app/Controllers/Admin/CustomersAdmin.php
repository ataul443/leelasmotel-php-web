<?php

namespace App\Controllers\Admin;
use App\Controllers\Controller;

use Respect\Validation\Validator as v;
use App\Models\Customers;
use App\Models\Bookings;


class CustomersAdmin extends Controller
{

    public $customerDetail,$customerBookings;
    public function __construct($container)
    {
        parent::__construct($container);
    }

    public function getCustomers($req,$res){
        return $this->view->render($res,'admin/customers.twig');
    }

    public function getDetail($req,$res){
        $route = $req->getAttribute('route');
        $customerId = $route->getArgument('id');
        $customer = Customers::where('customerId',$customerId)->get();
        $customer = $customer->first();
        $this->customerDetail = ['customerId'=>$customerId,'name'=>$customer->name,'mobile'=>$customer->mobile,'address'=>$customer->address];
        $bookings = Bookings::where('customerId',$customerId)->orderBy('created_at','desc')->get();
        $bookingsAll = [];
        foreach ($bookings as $booking){
            $temp = ['bookingId'=>$booking->bookingId,'name'=>$booking->name,
                'customerId'=>$booking->customerId,'checkIn'=>$booking->checkIn,
                'checkOut'=>$booking->checkOut,'mobile'=>$booking->mobile,
                'price'=>$booking->price,
                'roomAllotted'=>$booking->roomAllotted];

            array_push($bookingsAll,$temp);
            /*
            $id = $booking->bookingId;
            $data = $data.<<< EOD
            <tr>                                <td id=" -{$id}"><input name="actionBox" class="styled-checkbox" id=" --{$id}" type="checkbox" value="value2"><label for=" --{$id}"> </label></td>
                                                <td id="id-{$id}">{$id}</td>
                                                <td id="name-{$id}">{$booking->name}</td>
                                                <td id="mobile-{$id}">{$booking->mobile}</td>
                                                <td id="checkin-{$id}">{$booking->checkIn}</td>
                                                <td id="checkout-{$id}">{$booking->checkOut}</td>
                                                <td id="price-{$id}">{$booking->price}</td>
                                                <td id="roomAllotted-{$id}">{$booking->roomAllotted}</td>
                                                <td id="morelink-{$id}"><a id="more-{$id}" href="#">More<script>
                                                var url = urlBuilder('admin/bookings/detail/{$id}');
                                                $("#more-{$id}").attr("href",url);
</script></a></td>

                                            </tr>
EOD;
            */
        }

        return $this->view->render($res,'admin/customerDetail.twig',['customer'=>$this->customerDetail,'bookings'=>$bookingsAll]);
    }

    public function postCustomerList($req,$res){
        $params = $req->getParams();
        $offset = $params['offset'];
        $data = $this->getcustomersList($offset);

        if(!$data){
            return $res->withJson(['error'=>'NO_customerS'],401);
        }
        return $res->withJson($data,200);
    }

    public function postSearch($req,$res){
        $params = $req->getParams();
        $search = $params['searchTerm'];
        $data = $this->getCustomersList(0,$search);
        if(!$data){
            return $res->withJson(['error'=>'NO_customerS'],401);
        }
        return $res->withJson($data,200);
    }


    private function getCustomersList($offset,$searchTerm = null){
        $limit = 10;
        $customers = null;
        $size = null;
        if($searchTerm){
            $customers = Customers::where('name','like',"%$searchTerm%")->orderBy('name','dsc')->get();
            $size = count($customers);
        }else{
            $customers = customers::offset($offset)->limit($limit)->orderBy('updated_at','dsc')->get();
            $size = Customers::count();
        }

        $data = "";
        foreach ($customers as $customer){
            $id = $customer->customerId;
            //<td id=" -{$id}"><input name="actionBox" class="styled-checkbox" id=" --{$id}" type="checkbox" value="value2"><label for=" --{$id}"> </label></td>
            $data = $data.<<< EOD

            <tr>                                
                                                <td id="id-{$id}">{$id}</td>
                                                <td id="name-{$id}">{$customer->name}</td>
                                                <td id="mobile-{$id}">{$customer->mobile}</td>
                                                <td id="address-{$id}">{$customer->address}</td>
                                                <td id="morelink-{$id}"><a id="more-{$id}" href="#">More<script>
                                                var url = urlBuilder('admin/customers/detail/{$id}');
                                                $("#more-{$id}").attr("href",url);
</script></a></td>
                                                
                                            </tr>
EOD;
        }
        return ['customersList'=>$data,'size'=>$size];

    }

}