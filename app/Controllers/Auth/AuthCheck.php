<?php
/**
 * Created by PhpStorm.
 * User: devil443
 * Date: 17-Mar-18
 * Time: 6:42 PM
 */

namespace App\Controllers\Auth;

use App\Controllers\Controller;

use App\Models\User;
use App\Models\Customers;
use App\Handlers\CounterHandler;

class AuthCheck extends Controller
{

    public function getUserData(){
        $email = isset($_SESSION['userEmail']);
        if($email){
            $email = $_SESSION['userEmail'];
                $this->username = User::where('email',$email)->value('username');
                $this->customerId = User::where('email',$email)->value('customerId');
                $this->user = ['username'=>$this->username,'email'=>$email,'customerId'=>$this->customerId];
                return $this->user;

        }else{
            return false;
        }
    }

    public function status(){
        return isset($_SESSION['userEmail']);
    }

    public function statusAdmin(){
        return isset($_SESSION['adminEmail']);
    }

    public function getUserPersonalInfo(){
        $customer =$this->getUserData();
        $customerId = $customer['customerId'];

        if($customerId){
            $customerIdFromCustomers = Customers::where('customerId',$customerId)->value('customerId');
            if($customerIdFromCustomers){
                $name = Customers::where('customerId',$customerId)->value('name');
                $mobile = Customers::where('customerId',$customerId)->value('mobile');
                $address = Customers::where('customerId',$customerId)->value('address');
                $this->userPersonalData = ['name'=>$name,'mobile'=>$mobile,'address'=>$address,'customerId'=>$customerId];
                return $this->userPersonalData;
            }else{
                $this->userPersonalData = ['customerId'=>$customerId];
                return $this->userPersonalData;
            }

        }else{
            return false;
        }
    }

    public function getPriceList(){
        $counterHandler = new CounterHandler();
        return $counterHandler->getPriceList();

    }
}