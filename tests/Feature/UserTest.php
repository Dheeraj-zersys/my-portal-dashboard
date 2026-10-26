<?php

namespace Tests\Feature;

use App\Models\BusinessUnit;
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
            'status' => 'Active',
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
            ->put("/users/{$user->id}", $this->payload(['email' => $user->email, 'name' => 'Renamed', 'password' => '', 'confirmPassword' => '']))
            ->assertSessionHasNoErrors();

        $user->refresh();
        $this->assertSame('Renamed', $user->name);
        $this->assertTrue(Hash::check('password', $user->password));
    }
}
