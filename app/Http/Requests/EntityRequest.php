<?php

namespace App\Http\Requests;

use App\Enums\Status;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EntityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'entityCode' => [
                'required',
                'string',
                'max:255',
                Rule::unique('entities', 'entity_code')->ignore($this->route('entity')),
            ],
            'name' => ['required', 'string', 'max:255'],
            'stateId' => ['required', 'integer', Rule::exists('states', 'id')],
            'gstin' => ['nullable', 'string', 'max:255'],
            'vatNumber' => ['nullable', 'string', 'max:255'],
            'cstNumber' => ['nullable', 'string', 'max:255'],
            'cin' => ['nullable', 'string', 'max:255'],
            'panNumber' => ['nullable', 'string', 'max:255'],
            'tanNumber' => ['nullable', 'string', 'max:255'],
            'registeredAddress' => ['nullable', 'string', 'max:2000'],
            'status' => $this->route('entity')
                ? ['required', Rule::enum(Status::class)]
                : ['prohibited'],
        ];
    }

    /** @return array<string, mixed> */
    public function toModelAttributes(): array
    {
        return [
            'entity_code' => $this->validated('entityCode'),
            'name' => $this->validated('name'),
            'state_id' => $this->validated('stateId'),
            'gstin' => $this->validated('gstin'),
            'vat_number' => $this->validated('vatNumber'),
            'cst_number' => $this->validated('cstNumber'),
            'cin' => $this->validated('cin'),
            'pan_number' => $this->validated('panNumber'),
            'tan_number' => $this->validated('tanNumber'),
            'registered_address' => $this->validated('registeredAddress'),
            ...($this->route('entity') ? ['status' => $this->validated('status')] : []),
        ];
    }
}
