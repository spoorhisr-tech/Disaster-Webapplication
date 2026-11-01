<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReliefRequest extends Model
{
    protected $table = 'requests';

    protected $primaryKey = 'request_id';

    public $timestamps = true;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'request_id',
        'citizen_name',
        'phone',
        'area',
        'urgency_level',
        'resource_type_needed',
        'quantity_needed',
        'status',
    ];
}