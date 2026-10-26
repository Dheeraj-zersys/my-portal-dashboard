<?php

namespace Database\Factories;

use App\Enums\Status;
use App\Models\BusinessUnit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BusinessUnit>
 */
class BusinessUnitFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => 'BU '.fake()->unique()->numberBetween(1, 9999),
            'status' => Status::Active,
        ];
    }
}
