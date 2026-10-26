<?php

namespace Tests\Feature;

use App\Models\BusinessUnit;
use App\Models\District;
use App\Models\GeographicalArea;
use App\Models\State;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MasterDataTest extends TestCase
{
    use RefreshDatabase;

    public function test_ga_can_be_created_with_districts_of_its_state(): void
    {
        $state = State::factory()->create(['name' => 'Karnataka']);
        $districts = District::factory()->count(2)->create(['state_id' => $state->id]);

        $this->actingAs(User::factory()->create())->post('/master-data/geographical-areas', [
            'name' => 'RMD',
            'stateId' => $state->id,
            'districtIds' => $districts->pluck('id')->all(),
            'status' => 'Active',
        ])->assertSessionHasNoErrors();

        $this->assertEqualsCanonicalizing(
            $districts->pluck('id')->all(),
            GeographicalArea::where('name', 'RMD')->firstOrFail()->districts->pluck('id')->all(),
        );
    }

    public function test_ga_rejects_district_from_another_state(): void
    {
        $state = State::factory()->create();
        $foreignDistrict = District::factory()->create();

        $this->actingAs(User::factory()->create())->post('/master-data/geographical-areas', [
            'name' => 'RMD',
            'stateId' => $state->id,
            'districtIds' => [$foreignDistrict->id],
            'status' => 'Active',
        ])->assertSessionHasErrors('districtIds.0');
    }

    public function test_ga_index_filters_by_district_and_returns_names(): void
    {
        $area = GeographicalArea::factory()->create(['name' => 'LD']);
        $district = District::factory()->create(['state_id' => $area->state_id, 'name' => 'Kurnool']);
        $area->districts()->attach($district);
        GeographicalArea::factory()->create(['name' => 'KP']);

        $this->actingAs(User::factory()->create())
            ->get("/master-data/geographical-areas?districtId={$district->id}")
            ->assertInertia(fn (Assert $page) => $page
                ->component('master-data/GeographicalAreas')
                ->has('managers.data', 1)
                ->where('managers.data.0.name', 'LD')
                ->where('managers.data.0.districts', ['Kurnool'])
                ->has('options.states')
            );
    }

    public function test_business_unit_names_are_unique(): void
    {
        BusinessUnit::factory()->create(['name' => 'BU 1']);
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/master-data/business-units', ['name' => 'BU 1', 'status' => 'Active'])
            ->assertSessionHasErrors('name');

        $unit = BusinessUnit::firstOrFail();
        $this->actingAs($user)
            ->put("/master-data/business-units/{$unit->id}", ['name' => 'BU 1', 'status' => 'Inactive'])
            ->assertSessionHasNoErrors();
        $this->assertSame('Inactive', $unit->refresh()->status->value);
    }
}
