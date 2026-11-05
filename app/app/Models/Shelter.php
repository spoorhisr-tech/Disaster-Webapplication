<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'organization_id',
        'contact_person',
        'contact_phone',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class, 'organization_id', 'id');
    }
}
