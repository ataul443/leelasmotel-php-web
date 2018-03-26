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
    public $userDataAll,$errorStack;

    public function __construct($container)
    {
        parent::__construct($container);
        $this->accountHandler = new AccountHandler();
    }

    public function getUserData($req,$res){
        if(!$this->container->AuthCheck->status()){
            return $res->withRedirect($this->router->pathFor('home'));
        }
        $this->userData = $this->AuthCheck->getUserPersonalInfo();
        if(array_key_exists('name',$this->userData) && $this->userData['customerId']){
            $this->bookingIdList = $this->accountHandler->getAllBookingId($this->userData['customerId']);
            $this->userDataAll = ['customer'=>$this->userData,'allBooking'=>$this->bookingIdList];
            $this->errorStack = false;
            print_r($this->userDataAll);
            print_r($this->errorStack);
            return $this->view->render($res,'userprofile.twig');
        }else{
            $this->errorStack = 'Error';
            return $this->view->render($res,'userprofile.twig');
        }
    }
}