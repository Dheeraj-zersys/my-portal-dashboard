<?php

namespace App\Models;

use App\Enums\Status;
use Database\Factories\EntityFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'entity_code',
    'name',
    'state_id',
    'gstin',
    'vat_number',
    'cst_number',
    'cin',
    'pan_number',
    'tan_number',
    'registered_address',
    'status',
])]
class Entity extends Model
{
    /** @use HasFactory<EntityFactory> */
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
}
