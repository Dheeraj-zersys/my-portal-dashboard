<?php

namespace App\Http\Resources;

use App\Models\BusinessPlan;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin BusinessPlan */
class BusinessPlanResource extends JsonResource
{
    /**
     * Shape mirrors the plan objects in src/components/BusinessPlanContent.jsx.
     * `date` is Y-m-d, the format the existing <input type="date"> expects.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'entityName' => $this->entity_name,
            'geographicalAreaId' => $this->geographical_area_id,
            'gaName' => $this->whenLoaded('geographicalArea', fn () => $this->geographicalArea->name),
            'districtId' => $this->district_id,
            'district' => $this->whenLoaded('district', fn () => $this->district->name),
            'date' => $this->plan_date?->toDateString(),
            'transport' => $this->transport,
            'industrialMarket' => $this->industrial_market,
            'commercial' => $this->commercial,
            'domestic' => $this->domestic,
        ];
    }
}
