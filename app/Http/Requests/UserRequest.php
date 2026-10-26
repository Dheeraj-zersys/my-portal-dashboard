<?php

namespace App\Http\Requests;

use App\Enums\Role;
use App\Enums\Status;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Field names match the form state in src/components/UsersContent.jsx.
     * Password is required when creating and optional when editing.
     */
    public function rules(): array
    {
        $user = $this->route('user');

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user)],
            'phone' => ['required', 'string', 'max:20'],
            'role' => ['required', Rule::enum(Role::class)],
            'status' => ['required', Rule::enum(Status::class)],
            'businessUnitId' => ['required', 'integer', Rule::exists('business_units', 'id')],
            'geographicalAreaId' => ['nullable', 'integer', Rule::exists('geographical_areas', 'id')],
            'entity' => ['nullable', 'string', 'max:255'],
            'password' => [$user ? 'nullable' : 'required', 'string', Password::min(8)],
            'confirmPassword' => ['required_with:password', 'same:password'],
        ];
    }

    /** @return array<string, mixed> */
    public function toModelAttributes(): array
    {
        $attributes = [
            'name' => $this->validated('name'),
            'email' => $this->validated('email'),
            'phone' => $this->validated('phone'),
            'role' => $this->validated('role'),
            'status' => $this->validated('status'),
            'business_unit_id' => $this->validated('businessUnitId'),
            'geographical_area_id' => $this->validated('geographicalAreaId'),
            'entity' => $this->validated('entity'),
        ];

        if ($this->filled('password')) {
            $attributes['password'] = $this->validated('password');
        }

        return $attributes;
    }
}
