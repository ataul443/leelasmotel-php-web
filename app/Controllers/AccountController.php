<?php
/**
 * Created by PhpStorm.
 * User: devil443
 * Date: 23-Mar-18
 * Time: 4:32 PM
 */

namespace App\Controllers;
use App\Handlers\AccountHandler;

class AccountController extends Controller{
    protected $userData;
    protected $accountHandler;
    protected $bookingIdList;

    public function __construct($container)
    {
        parent::__construct($container);
        $this->accountHandler = new AccountHandler();
    }

    public function getUserData($req,$res){
        $this->userData = $this->AuthCheck->getUserPersonalInfo();
        if($this->userData['name'] && $this->userData['customerId']){
            $this->bookingIdList = $this->accountHandler->getAllBookingId($this->userData['customerId']);
            return $res->withJson(['customer'=>$this->userData,'allBooking'=>$this->bookingIdList]);
        }else{
            return $res->withJson(['error'=>'No Bookings FOUND']);
        }
    }
}