<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organization extends Model
{
    use HasFactory;

    protected $table = 'organizations';

    protected $fillable = [
        'name',
        'type',
        'registration_number',
        'email',
        'phone',
        'area',
        'status',
        'description',
    ];

    /**
     * Staff/Admin users belonging to this organization.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'organization_id', 'id');
    }

    /**
     * Shelters managed by this organization.
     */
    public function shelters(): HasMany
    {
        return $this->hasMany(Shelter::class, 'organization_id', 'id');
    }

    /**
     * Warehouse resources managed by this organization.
     */
    public function resources(): HasMany
    {
        return $this->hasMany(Resource::class, 'organization_id', 'id');
    }
}

