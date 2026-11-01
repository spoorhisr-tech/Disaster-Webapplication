<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmergencyRequest extends Model
{
    protected $table = 'emergency_requests';

    protected $fillable = [
        'request_number',
        'disaster_event_id',
        'request_type',
        'description',
        'location_name',
        'people_affected',
        'priority',
        'status',
        'requester_name',
        'requester_phone',
    ];
}