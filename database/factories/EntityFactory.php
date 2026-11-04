<?php

namespace Database\Factories;

use App\Enums\Status;
use App\Models\Entity;
use App\Models\State;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Entity>
 */
class EntityFactory extends Factory
{
    public function definition(): array
    {
        return [
            'entity_code' => 'ENT-'.fake()->unique()->numerify('####'),
            'name' => fake()->company(),
            'state_id' => State::factory(),
            'status' => Status::Active,
        ];
    }
}
