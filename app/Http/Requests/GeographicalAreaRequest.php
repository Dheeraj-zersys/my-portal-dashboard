<?php

namespace App\Http\Requests;

use App\Enums\Status;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GeographicalAreaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * The current UI sends state/district names; the integrated form should send ids
     * from the `states` lookup prop instead.
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('geographical_areas', 'name')->ignore($this->route('geographical_area'))],
            'stateId' => ['required', 'integer', Rule::exists('states', 'id')],
            'districtIds' => ['required', 'array', 'min:1'],
            'districtIds.*' => [
                'integer',
                'distinct',
                Rule::exists('districts', 'id')->where('state_id', $this->integer('stateId')),
            ],
            'status' => ['required', Rule::enum(Status::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'districtIds.required' => 'Select a state and at least one district.',
            'districtIds.*.exists' => 'Each district must belong to the selected state.',
        ];
    }
}
