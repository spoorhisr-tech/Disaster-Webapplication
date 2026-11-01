<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IncidentReport extends Model
{
    protected $table = 'incident_reports';

    protected $fillable = [
        'disaster_event_id',
        'user_id',
        'ticket_number',
        'incident_type',
        'urgency',
        'status',
        'title',
        'description',
        'location_name',
        'latitude',
        'longitude',
        'reporter_name',
        'reporter_phone',
        'people_affected',
        'resolution_notes',
        'resolved_at',
        'assigned_to',
        'verified_by',
    ];
}