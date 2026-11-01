<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Distribution extends Model
{
    protected $table = 'distributions';

    protected $primaryKey = 'distribution_id';

    public $timestamps = false;

    protected $fillable = [
        'request_id',
        'resource_id',
        'quantity_distributed',
        'distributed_by_volunteer_id',
        'distributed_at',
        'notes',
    ];
}