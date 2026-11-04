<?php

namespace App\Http\Resources;

use App\Models\Entity;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Entity */
class EntityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'entityCode' => $this->entity_code,
            'name' => $this->name,
            'stateId' => $this->state_id,
            'state' => $this->whenLoaded('state', fn () => $this->state->name),
            'gstin' => $this->gstin,
            'vatNumber' => $this->vat_number,
            'cstNumber' => $this->cst_number,
            'cin' => $this->cin,
            'panNumber' => $this->pan_number,
            'tanNumber' => $this->tan_number,
            'registeredAddress' => $this->registered_address,
            'status' => $this->status,
            'createdDate' => $this->created_at?->format('d/m/Y'),
        ];
    }
}
