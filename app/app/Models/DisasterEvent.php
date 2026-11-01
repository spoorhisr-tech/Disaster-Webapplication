<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DisasterEvent extends Model
{
    protected $table = 'disaster_events';

    protected $fillable = [
        'title',
        'slug',
        'type',
        'severity',
        'status',
        'description',
        'location_name',
        'latitude',
        'longitude',
        'radius_km',
        'affected_population',
        'created_by',
    ];
}