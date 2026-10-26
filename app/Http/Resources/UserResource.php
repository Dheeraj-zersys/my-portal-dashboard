<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin User */
class UserResource extends JsonResource
{
    /**
     * Shape mirrors the user objects in src/components/UsersContent.jsx,
     * plus the foreign-key ids the edit form needs.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $this->role,
            'status' => $this->status,
            'businessUnitId' => $this->business_unit_id,
            'unit' => $this->whenLoaded('businessUnit', fn () => $this->businessUnit?->name),
            'geographicalAreaId' => $this->geographical_area_id,
            'gaManager' => $this->whenLoaded('geographicalArea', fn () => $this->geographicalArea?->name),
            'entity' => $this->entity,
            'createdDate' => $this->created_at?->format('d/m/Y'),
        ];
    }
}
