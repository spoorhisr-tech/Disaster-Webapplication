<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Volunteer extends Model
{
    protected $table = 'volunteers';

    protected $primaryKey = 'volunteer_id';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'phone',
        'skills',
        'assigned_area',
        'is_available',
        'created_at',
    ];
}
