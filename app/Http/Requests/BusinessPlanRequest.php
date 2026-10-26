<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BusinessPlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Field names match the form state in src/components/BusinessPlanContent.jsx,
     * with gaName/district replaced by their ids.
     */
    public function rules(): array
    {
        return [
            'entityName' => ['required', 'string', 'max:255'],
            'geographicalAreaId' => ['required', 'integer', Rule::exists('geographical_areas', 'id')],
            'districtId' => [
                'required',
                'integer',
                Rule::exists('district_geographical_area', 'district_id')
                    ->where('geographical_area_id', $this->integer('geographicalAreaId')),
            ],
            'date' => ['required', 'date_format:Y-m-d'],
            'transport' => ['required', 'numeric', 'min:0'],
            'industrialMarket' => ['required', 'numeric', 'min:0'],
            'commercial' => ['required', 'numeric', 'min:0'],
            'domestic' => ['required', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'districtId.exists' => 'The district must belong to the selected geographical area.',
        ];
    }

    /** @return array<string, mixed> */
    public function toModelAttributes(): array
    {
        return [
            'entity_name' => $this->validated('entityName'),
            'geographical_area_id' => $this->validated('geographicalAreaId'),
            'district_id' => $this->validated('districtId'),
            'plan_date' => $this->validated('date'),
            'transport' => $this->validated('transport'),
            'industrial_market' => $this->validated('industrialMarket'),
            'commercial' => $this->validated('commercial'),
            'domestic' => $this->validated('domestic'),
        ];
    }
}
