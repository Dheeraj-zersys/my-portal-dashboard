<?php

namespace App\Http\Resources;

use App\Models\BusinessUnit;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin BusinessUnit */
class BusinessUnitResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'status' => $this->status,
            'createdDate' => $this->created_at?->format('d/m/Y'),
        ];
    }
}
