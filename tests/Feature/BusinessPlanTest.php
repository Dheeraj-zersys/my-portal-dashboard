<?php

namespace Tests\Feature;

use App\Models\BusinessPlan;
use App\Models\District;
use App\Models\GeographicalArea;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class BusinessPlanTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_plans_in_frontend_shape(): void
    {
        $plan = BusinessPlan::factory()->create(['plan_date' => '2026-01-10']);

        $this->actingAs(User::factory()->create())->get('/business-plans')->assertInertia(fn (Assert $page) => $page
            ->component('business-plans/Index')
            ->where('plans.data.0.date', '2026-01-10')
            ->where('plans.data.0.gaName', $plan->geographicalArea->name)
            ->where('plans.data.0.district', $plan->district->name)
            ->has('plans.data.0.industrialMarket')
        );
    }

    public function test_plan_can_be_created_for_a_district_in_the_ga(): void
    {
        $area = GeographicalArea::factory()->create();
        $district = District::factory()->create(['state_id' => $area->state_id]);
        $area->districts()->attach($district);
        $user = User::factory()->create();

        $this->actingAs($user)->post('/business-plans', [
            'entityName' => 'AGP',
            'geographicalAreaId' => $area->id,
            'districtId' => $district->id,
            'date' => '2026-01-10',
            'transport' => 500,
            'industrialMarket' => 800,
            'commercial' => 300,
            'domestic' => 600,
        ])->assertSessionHasNoErrors();

        $this->assertDatabaseHas('business_plans', [
            'district_id' => $district->id,
            'industrial_market' => 800,
            'created_by' => $user->id,
        ]);
    }

    public function test_district_outside_the_ga_is_rejected(): void
    {
        $area = GeographicalArea::factory()->create();
        $otherDistrict = District::factory()->create();

        $this->actingAs(User::factory()->create())->post('/business-plans', [
            'entityName' => 'AGP',
            'geographicalAreaId' => $area->id,
            'districtId' => $otherDistrict->id,
            'date' => '2026-01-10',
            'transport' => 1, 'industrialMarket' => 1, 'commercial' => 1, 'domestic' => 1,
        ])->assertSessionHasErrors('districtId');
    }
}
