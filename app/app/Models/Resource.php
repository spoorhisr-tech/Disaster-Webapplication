<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'organization_id',
        'last_updated',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class, 'organization_id', 'id');
    }
}
