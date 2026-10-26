<?php

namespace Database\Factories;

use App\Enums\Status;
use App\Models\GeographicalArea;
use App\Models\State;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GeographicalArea>
 */
class GeographicalAreaFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => strtoupper(fake()->unique()->lexify('???')),
            'state_id' => State::factory(),
            'status' => Status::Active,
        ];
    }
}
