<?php

namespace App\Models;

use Database\Factories\BusinessPlanFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'entity_name', 'geographical_area_id', 'district_id', 'plan_date',
    'transport', 'industrial_market', 'commercial', 'domestic',
    'created_by', 'updated_by',
])]
class BusinessPlan extends Model
{
    /** @use HasFactory<BusinessPlanFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'plan_date' => 'date',
            'transport' => 'decimal:2',
            'industrial_market' => 'decimal:2',
            'commercial' => 'decimal:2',
            'domestic' => 'decimal:2',
        ];
    }

    public function geographicalArea(): BelongsTo
    {
        return $this->belongsTo(GeographicalArea::class);
    }

    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
