<?php

namespace App\Http\Requests;

use App\Models\DailyProgressReport;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DailyProgressReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Accepts the same flat camelCase `formData` object as src/app/dpr.js.
     * Metric fields are optional in the current wizard, so they are nullable here.
     */
    public function rules(): array
    {
        $rules = [
            'date' => ['required', 'date_format:Y-m-d'],
            'geographicalAreaId' => ['nullable', 'integer', Rule::exists('geographical_areas', 'id')],
        ];

        foreach (DailyProgressReport::metricKeys() as $key) {
            $rules[$key] = ['nullable', 'numeric', 'min:0'];
        }

        return $rules;
    }

    /** @return array<string, mixed> */
    public function toModelAttributes(): array
    {
        $attributes = [
            'report_date' => $this->validated('date'),
            'geographical_area_id' => $this->validated('geographicalAreaId'),
        ];

        foreach (DailyProgressReport::metricColumnMap() as $key => $column) {
            $attributes[$column] = $this->validated($key);
        }

        return $attributes;
    }
}
