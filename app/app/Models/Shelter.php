<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shelter extends Model
{
    protected $table = 'shelters';

    protected $primaryKey = 'shelter_id';

    public $timestamps = false;

    protected $fillable = [
        'shelter_name',
        'area',
        'capacity',
        'current_occupancy',
        'status',
        'contact_person',
        'contact_phone',
    ];
}
