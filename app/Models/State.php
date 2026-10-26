<?php

namespace App\Models;

use Database\Factories\StateFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name'])]
class State extends Model
{
    /** @use HasFactory<StateFactory> */
    use HasFactory;

    public function districts(): HasMany
    {
        return $this->hasMany(District::class);
    }

    public function geographicalAreas(): HasMany
    {
        return $this->hasMany(GeographicalArea::class);
    }
}
