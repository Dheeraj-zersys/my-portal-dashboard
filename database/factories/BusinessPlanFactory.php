<?php

namespace Database\Factories;

use App\Models\BusinessPlan;
use App\Models\District;
use App\Models\GeographicalArea;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BusinessPlan>
 */
class BusinessPlanFactory extends Factory
{
    public function definition(): array
    {
        return [
            'entity_name' => 'AGP',
            'geographical_area_id' => GeographicalArea::factory(),
            'district_id' => District::factory(),
            'plan_date' => fake()->dateTimeThisYear(),
            'transport' => fake()->numberBetween(100, 1000),
            'industrial_market' => fake()->numberBetween(100, 1000),
            'commercial' => fake()->numberBetween(100, 1000),
            'domestic' => fake()->numberBetween(100, 1000),
        ];
    }
}
