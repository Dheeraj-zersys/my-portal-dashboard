<?php

namespace Tests\Feature;

use App\Models\BusinessUnit;
use App\Models\District;
use App\Models\Entity;
use App\Models\GeographicalArea;
use App\Models\State;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MasterDataTest extends TestCase
{
    use RefreshDatabase;

    public function test_entities_index_renders_filtered_entities_and_state_options(): void
    {
        $state = State::factory()->create(['name' => 'Karnataka']);
        Entity::factory()->for($state)->create([
            'entity_code' => 'ENT-100',
            'name' => 'North Gas',
        ]);
        Entity::factory()->for($state)->create([
            'entity_code' => 'ENT-200',
            'name' => 'South Gas',
        ]);

        $this->actingAs(User::factory()->create())
            ->get('/master-data/entities?search=ENT-100')
            ->assertInertia(fn (Assert $page) => $page
                ->component('master-data/Entities')
                ->has('managers.data', 1)
                ->where('managers.data.0.entityCode', 'ENT-100')
                ->where('managers.data.0.state', 'Karnataka')
                ->where('filters.search', 'ENT-100')
                ->has('options.states', 1)
                ->where('options.states.0.label', 'Karnataka')
            );
    }

    public function test_guest_cannot_view_entities_manager(): void
    {
        $this->get('/master-data/entities')
            ->assertRedirect(route('login'));
    }

    public function test_entity_can_be_created_with_active_status(): void
    {
        $state = State::factory()->create();

        $this->actingAs(User::factory()->create())
            ->post('/master-data/entities', [
                'entityCode' => 'ENT-100',
                'name' => 'North Gas',
                'stateId' => $state->id,
                'gstin' => 'GST-100',
            ])
            ->assertSessionHasNoErrors();

        $entity = Entity::where('entity_code', 'ENT-100')->firstOrFail();
        $this->assertSame($state->id, $entity->state_id);
        $this->assertSame('North Gas', $entity->name);
        $this->assertSame('GST-100', $entity->gstin);
        $this->assertSame('Active', $entity->status->value);
    }

    public function test_entity_creation_requires_code_name_and_valid_state(): void
    {
        $this->actingAs(User::factory()->create())
            ->post('/master-data/entities', [
                'name' => 'North Gas',
                'stateId' => 9999,
            ])
            ->assertSessionHasErrors(['entityCode', 'stateId']);

        $this->assertDatabaseCount('entities', 0);
    }

    public function test_entity_can_be_updated(): void
    {
        $state = State::factory()->create();
        $entity = Entity::factory()->for($state)->create([
            'entity_code' => 'ENT-100',
            'name' => 'Old Name',
        ]);

        $this->actingAs(User::factory()->create())
            ->put("/master-data/entities/{$entity->id}", [
                'entityCode' => 'ENT-100',
                'name' => 'Updated Name',
                'stateId' => $state->id,
                'status' => 'Inactive',
            ])
            ->assertSessionHasNoErrors();

        $this->assertSame('Updated Name', $entity->refresh()->name);
        $this->assertSame('Inactive', $entity->status->value);
    }

    public function test_entity_update_rejects_an_existing_entity_code(): void
    {
        $state = State::factory()->create();
        $entity = Entity::factory()->for($state)->create([
            'entity_code' => 'ENT-100',
            'name' => 'North Gas',
        ]);
        Entity::factory()->for($state)->create(['entity_code' => 'ENT-200']);

        $this->actingAs(User::factory()->create())
            ->put("/master-data/entities/{$entity->id}", [
                'entityCode' => 'ENT-200',
                'name' => 'Changed Name',
                'stateId' => $state->id,
                'status' => 'Active',
            ])
            ->assertSessionHasErrors('entityCode');

        $this->assertSame('ENT-100', $entity->refresh()->entity_code);
        $this->assertSame('North Gas', $entity->name);
    }

    public function test_ga_can_be_created_with_districts_of_its_state(): void
    {
        $state = State::factory()->create(['name' => 'Karnataka']);
        $districts = District::factory()->count(2)->create(['state_id' => $state->id]);

        $user = User::factory()->create();
        $this->actingAs($user)->post('/master-data/geographical-areas', [
            'name' => 'RMD',
            'stateId' => $state->id,
            'districtIds' => $districts->pluck('id')->all(),
        ])->assertSessionHasNoErrors();

        $area = GeographicalArea::where('name', 'RMD')->firstOrFail();
        $this->assertEqualsCanonicalizing(
            $districts->pluck('id')->all(),
            $area->districts->pluck('id')->all(),
        );
        $this->assertSame('Active', $area->status->value);

        $this->actingAs($user)
            ->put("/master-data/geographical-areas/{$area->id}", [
                'name' => 'RMD',
                'stateId' => $state->id,
                'districtIds' => $districts->pluck('id')->all(),
                'status' => 'Inactive',
            ])
            ->assertSessionHasNoErrors();

        $this->assertSame('Inactive', $area->refresh()->status->value);
    }

    public function test_ga_rejects_district_from_another_state(): void
    {
        $state = State::factory()->create();
        $foreignDistrict = District::factory()->create();

        $this->actingAs(User::factory()->create())->post('/master-data/geographical-areas', [
            'name' => 'RMD',
            'stateId' => $state->id,
            'districtIds' => [$foreignDistrict->id],
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
            ->post('/master-data/business-units', ['name' => 'BU 1'])
            ->assertSessionHasErrors('name');

        $unit = BusinessUnit::firstOrFail();
        $this->actingAs($user)
            ->put("/master-data/business-units/{$unit->id}", ['name' => 'BU 1', 'status' => 'Inactive'])
            ->assertSessionHasNoErrors();
        $this->assertSame('Inactive', $unit->refresh()->status->value);
    }

    public function test_new_business_unit_defaults_to_active(): void
    {
        $this->actingAs(User::factory()->create())
            ->post('/master-data/business-units', ['name' => 'New Unit'])
            ->assertSessionHasNoErrors();

        $this->assertSame('Active', BusinessUnit::where('name', 'New Unit')->firstOrFail()->status->value);
    }
}
