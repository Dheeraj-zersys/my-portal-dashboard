<?php

namespace Tests\Feature;

use App\Enums\Status;
use App\Models\BusinessUnit;
use App\Models\GeographicalArea;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    private function payload(array $overrides = []): array
    {
        return [
            'name' => 'Sonal',
            'email' => 'sonal@example.com',
            'phone' => '9000000000',
            'role' => 'Admin',
            'businessUnitId' => BusinessUnit::factory()->create()->id,
            'geographicalAreaId' => null,
            'entity' => 'AGP',
            'password' => 'secret-pass',
            'confirmPassword' => 'secret-pass',
            ...$overrides,
        ];
    }

    public function test_index_lists_users_with_search_and_options(): void
    {
        $admin = User::factory()->admin()->create(['name' => 'Admin']);
        User::factory()->create(['name' => 'Priya']);

        $this->actingAs($admin)->get('/users?search=priya')->assertInertia(fn (Assert $page) => $page
            ->component('users/Index')
            ->has('users.data', 1)
            ->where('users.data.0.name', 'Priya')
            ->has('options.roles', 2)
            ->has('options.businessUnits')
        );
    }

    public function test_user_form_options_keep_all_business_units_and_geographical_areas(): void
    {
        $activeUnit = BusinessUnit::factory()->create(['name' => 'Current Unit']);
        $inactiveUnit = BusinessUnit::factory()->create([
            'name' => 'Previous Unit',
            'status' => Status::Inactive,
        ]);
        $activeArea = GeographicalArea::factory()->create(['name' => 'Current Area']);
        $inactiveArea = GeographicalArea::factory()->create([
            'name' => 'Previous Area',
            'status' => Status::Inactive,
        ]);

        $this->actingAs(User::factory()->admin()->create())
            ->get('/users')
            ->assertInertia(fn (Assert $page) => $page
                ->where('options.businessUnits', [
                    ['value' => $activeUnit->id, 'label' => 'Current Unit'],
                    ['value' => $inactiveUnit->id, 'label' => 'Previous Unit'],
                ])
                ->where('options.geographicalAreas.0.value', $activeArea->id)
                ->where('options.geographicalAreas.0.label', 'Current Area')
                ->where('options.geographicalAreas.1.value', $inactiveArea->id)
                ->where('options.geographicalAreas.1.label', 'Previous Area')
            );
    }

    public function test_user_can_be_created(): void
    {
        $this->actingAs(User::factory()->create())
            ->post('/users', $this->payload())
            ->assertSessionHasNoErrors();

        $user = User::where('email', 'sonal@example.com')->firstOrFail();
        $this->assertTrue(Hash::check('secret-pass', $user->password));
        $this->assertSame('AGP', $user->entity);
    }

    public function test_password_is_required_and_must_match_on_create(): void
    {
        $actor = User::factory()->create();

        $this->actingAs($actor)->post('/users', $this->payload(['password' => '', 'confirmPassword' => '']))
            ->assertSessionHasErrors('password');
        $this->actingAs($actor)->post('/users', $this->payload(['confirmPassword' => 'different']))
            ->assertSessionHasErrors('confirmPassword');
    }

    public function test_update_without_password_keeps_existing_password(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->put("/users/{$user->id}", $this->payload([
                'email' => $user->email,
                'name' => 'Renamed',
                'status' => 'Active',
                'password' => '',
                'confirmPassword' => '',
            ]))
            ->assertSessionHasNoErrors();

        $user->refresh();
        $this->assertSame('Renamed', $user->name);
        $this->assertTrue(Hash::check('password', $user->password));
    }

    public function test_administrator_cannot_deactivate_their_own_account(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->put("/users/{$admin->id}", $this->payload([
                'email' => $admin->email,
                'status' => 'Inactive',
                'password' => '',
                'confirmPassword' => '',
            ]))
            ->assertSessionHasErrors([
                'status' => 'Administrators cannot deactivate their own accounts.',
            ]);

        $this->assertSame('Active', $admin->refresh()->status->value);
    }

    public function test_user_created_without_status_is_active(): void
    {
        $this->actingAs(User::factory()->admin()->create())
            ->post('/users', $this->payload())
            ->assertSessionHasNoErrors();

        $this->assertSame('Active', User::where('email', 'sonal@example.com')->firstOrFail()->status->value);
    }

    public function test_created_user_assigned_to_a_ga_can_log_in_after_a_new_session(): void
    {
        $admin = User::factory()->admin()->create();
        $unit = BusinessUnit::factory()->create();
        $area = GeographicalArea::factory()->create();
        $payload = $this->payload([
            'name' => 'New GA User',
            'email' => 'ga-user@example.com',
            'role' => 'User',
            'businessUnitId' => $unit->id,
            'geographicalAreaId' => $area->id,
        ]);

        $this->actingAs($admin)
            ->post('/users', $payload)
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('users', [
            'email' => 'ga-user@example.com',
            'geographical_area_id' => $area->id,
        ]);

        $this->post('/logout')->assertRedirect('/login');
        $this->post('/login', [
            'email' => 'ga-user@example.com',
            'password' => 'secret-pass',
        ])->assertRedirect('/dashboard');

        $this->assertAuthenticatedAs(User::where('email', 'ga-user@example.com')->firstOrFail());
    }
}
