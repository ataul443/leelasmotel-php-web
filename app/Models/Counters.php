<?php

namespace App\Models;

use \Illuminate\Database\Eloquent\Model;

class Counters extends Model
{
    protected $table = 'counters';
    protected $fillable = ['bookingCounter','customerCounter'];
}