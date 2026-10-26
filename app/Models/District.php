<?php

namespace App\Models;

use Database\Factories\DistrictFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['state_id', 'name'])]
class District extends Model
{
    /** @use HasFactory<DistrictFactory> */
    use HasFactory;

    public function state(): BelongsTo
    {
        return $this->belongsTo(State::class);
    }

    public function geographicalAreas(): BelongsToMany
    {
        return $this->belongsToMany(GeographicalArea::class);
    }
}
