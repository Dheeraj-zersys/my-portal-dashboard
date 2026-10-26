<?php

namespace App\Models;

use App\Enums\Status;
use Database\Factories\GeographicalAreaFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'state_id', 'status'])]
class GeographicalArea extends Model
{
    /** @use HasFactory<GeographicalAreaFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'status' => Status::class,
        ];
    }

    public function state(): BelongsTo
    {
        return $this->belongsTo(State::class);
    }

    public function districts(): BelongsToMany
    {
        return $this->belongsToMany(District::class);
    }

    public function businessPlans(): HasMany
    {
        return $this->hasMany(BusinessPlan::class);
    }

    public function dailyProgressReports(): HasMany
    {
        return $this->hasMany(DailyProgressReport::class);
    }
}
