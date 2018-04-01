<?php

namespace App\Controllers\Admin;
use App\Controllers\Controller;

use Respect\Validation\Validator as v;
use App\Models\Customers;


class CustomersAdmin extends Controller
{

    public function __construct($container)
    {
        parent::__construct($container);
    }

    public function getCustomers($req,$res){
        return $this->view->render($res,'admin/customers.twig');
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
            $customers = customers::offset($offset)->limit($limit)->orderBy('name','dsc')->get();
            $size = Customers::count();
        }

        $data = "";
        foreach ($customers as $customer){
            $id = $customer->customerId;
            $data = $data.<<< EOD
            <tr>                                <td id=" -{$id}">...</td>
                                                <td id="id-{$id}">{$id}</td>
                                                <td id="name-{$id}">{$customer->name}</td>
                                                <td id="mobile-{$id}">{$customer->mobile}</td>
                                                <td id="address-{$id}">{$customer->address}</td>
                                                <td id="morelink-{$id}"><a id="more-{$id}" href="#">More<script>
                                                var url = urlBuilder('admin/customers/get/{$id}');
                                                $("#more-{$id}").attr("href",url);
</script></a></td>
                                                
                                            </tr>
EOD;
        }
        return ['customersList'=>$data,'size'=>$size];

    }

}