<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    protected $table = 'resources';

    protected $primaryKey = 'resource_id';

    public $timestamps = false;

    protected $fillable = [
        'item_name',
        'category',
        'quantity_available',
        'unit',
        'warehouse_location',
        'last_updated',
    ];
}