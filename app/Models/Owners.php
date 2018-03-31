<?php

namespace App\Models;

use \Illuminate\Database\Eloquent\Model;

class Owners extends Model
{
    protected $table = 'owners';
    protected $fillable = ['email','password'];
}