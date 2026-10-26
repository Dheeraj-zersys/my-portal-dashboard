<?php

namespace Tests\Feature;

use App\Models\BusinessPlan;
use App\Models\DailyProgressReport;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_returns_stats_in_frontend_shape(): void
    {
        $this->travelTo('2026-10-26');
        $user = User::factory()->create();
        BusinessPlan::factory()->create(['plan_date' => '2026-10-05']);
        BusinessPlan::factory()->create(['plan_date' => '2026-01-05']);
        DailyProgressReport::factory()->create(['report_date' => '2026-10-20']);

        $this->actingAs($user)->get('/dashboard')->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard')
            ->where('stats.users', 1)
            ->where('stats.businessPlan', ['current' => 1, 'total' => 2])
            ->where('stats.dailyProgressReport', ['current' => 1, 'total' => 1])
            ->where('stats.geographicalArea', 2)
        );
    }
}
