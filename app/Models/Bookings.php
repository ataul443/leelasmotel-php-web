<?php
/**
 * Created by PhpStorm.
 * User: devil443
 * Date: 22-Mar-18
 * Time: 10:42 AM
 */


namespace App\Models;

use \Illuminate\Database\Eloquent\Model;

class Bookings extends Model
{
    protected $table = 'bookings';
    protected $fillable = ['bookingId','customerId','checkIn','checkOut','name','address','mobile','adult','price','roomAllot'];
}