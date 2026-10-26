<?php

namespace App\Http\Resources;

use App\Models\GeographicalArea;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin GeographicalArea */
class GeographicalAreaResource extends JsonResource
{
    /**
     * Shape mirrors the GA manager objects in src/components/MasterData/GAManagerContent.jsx
     * (state and districts as names), plus ids for the edit form.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'stateId' => $this->state_id,
            'state' => $this->whenLoaded('state', fn () => $this->state->name),
            'districtIds' => $this->whenLoaded('districts', fn () => $this->districts->pluck('id')),
            'districts' => $this->whenLoaded('districts', fn () => $this->districts->pluck('name')),
            'status' => $this->status,
            'createdDate' => $this->created_at?->format('d/m/Y'),
        ];
    }
}
