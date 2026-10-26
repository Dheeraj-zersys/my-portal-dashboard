<?php

namespace App\Http\Resources;

use App\Models\DailyProgressReport;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin DailyProgressReport */
class DailyProgressReportResource extends JsonResource
{
    /**
     * Flat shape with the same camelCase keys as the report objects in src/app/dpr.js.
     * `date` is Y-m-d; the current UI displays d/m/Y, so format on the frontend.
     */
    public function toArray(Request $request): array
    {
        $metrics = [];
        foreach (DailyProgressReport::metricColumnMap() as $key => $column) {
            $metrics[$key] = $this->{$column};
        }

        return [
            'id' => $this->id,
            'date' => $this->report_date?->toDateString(),
            'geographicalAreaId' => $this->geographical_area_id,
            'gaName' => $this->whenLoaded('geographicalArea', fn () => $this->geographicalArea?->name),
            ...$metrics,
        ];
    }
}
