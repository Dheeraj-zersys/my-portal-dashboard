<?php

namespace App\Support;

use App\Enums\Role;
use App\Enums\Status;
use App\Models\BusinessUnit;
use App\Models\GeographicalArea;
use App\Models\State;

/**
 * Dropdown option lists passed as Inertia props. Shapes are react-select friendly
 * ({ value, label }) so the integrated forms can drop them straight into <Select options>.
 */
class Lookups
{
    public static function roles(): array
    {
        return array_map(fn (Role $role) => ['value' => $role->value, 'label' => $role->value], Role::cases());
    }

    public static function statuses(): array
    {
        return array_map(fn (Status $status) => ['value' => $status->value, 'label' => $status->value], Status::cases());
    }

    public static function businessUnits(): array
    {
        return BusinessUnit::where('status', Status::Active)
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (BusinessUnit $unit) => ['value' => $unit->id, 'label' => $unit->name])
            ->all();
    }

    /** Active GAs, each with the districts it covers (for GA -> district cascades). */
    public static function geographicalAreas(): array
    {
        return GeographicalArea::where('status', Status::Active)
            ->with('districts:id,name')
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (GeographicalArea $area) => [
                'value' => $area->id,
                'label' => $area->name,
                'districts' => $area->districts
                    ->map(fn ($district) => ['value' => $district->id, 'label' => $district->name])
                    ->values(),
            ])
            ->all();
    }

    /** States with their districts (for state -> district cascades). */
    public static function states(): array
    {
        return State::with(['districts' => fn ($query) => $query->orderBy('name')])
            ->orderBy('name')
            ->get()
            ->map(fn (State $state) => [
                'value' => $state->id,
                'label' => $state->name,
                'districts' => $state->districts
                    ->map(fn ($district) => ['value' => $district->id, 'label' => $district->name])
                    ->values(),
            ])
            ->all();
    }
}
