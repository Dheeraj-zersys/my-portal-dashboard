<?php

namespace Database\Factories;

use App\Models\DailyProgressReport;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DailyProgressReport>
 */
class DailyProgressReportFactory extends Factory
{
    public function definition(): array
    {
        $metrics = array_map(
            fn () => fake()->numberBetween(0, 100000),
            array_flip(DailyProgressReport::metricColumns()),
        );

        return ['report_date' => fake()->dateTimeThisYear()] + $metrics;
    }
}
