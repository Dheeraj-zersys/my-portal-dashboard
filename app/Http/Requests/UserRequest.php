<?php

namespace App\Http\Requests;

use App\Enums\Role;
use App\Enums\Status;
use App\Models\User;
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
        $actor = $this->user();
        $statusRules = $user
            ? ['required', Rule::enum(Status::class)]
            : ['prohibited'];

        if ($user instanceof User && $actor instanceof User && $user->is($actor) && $actor->isAdmin()) {
            $statusRules[] = Rule::notIn([Status::Inactive->value]);
        }

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user)],
            'phone' => ['required', 'string', 'max:20'],
            'role' => ['required', Rule::enum(Role::class)],
            'status' => $statusRules,
            'businessUnitId' => ['required', 'integer', Rule::exists('business_units', 'id')],
            'geographicalAreaId' => ['nullable', 'integer', Rule::exists('geographical_areas', 'id')],
            'entity' => ['nullable', 'string', 'max:255'],
            'password' => [$user ? 'nullable' : 'required', 'string', Password::min(8)],
            'confirmPassword' => ['required_with:password', 'same:password'],
        ];
    }

    public function messages(): array
    {
        return [
            'status.not_in' => 'Administrators cannot deactivate their own accounts.',
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
            'status' => $this->validated('status', Status::Active->value),
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
