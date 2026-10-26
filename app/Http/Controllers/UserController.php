<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Support\Lookups;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search'));

        $users = User::with(['businessUnit:id,name', 'geographicalArea:id,name'])
            ->when($search !== '', fn ($query) => $query->where(function ($query) use ($search) {
                $query->whereAny(['name', 'email', 'phone', 'role', 'status', 'entity'], 'like', "%{$search}%")
                    ->orWhereRelation('businessUnit', 'name', 'like', "%{$search}%")
                    ->orWhereRelation('geographicalArea', 'name', 'like', "%{$search}%");
            }))
            ->orderBy('id')
            ->paginate(min($request->integer('perPage', 5), 100))
            ->withQueryString();

        return Inertia::render('users/Index', [
            'users' => UserResource::collection($users),
            'filters' => ['search' => $search],
            'options' => [
                'roles' => Lookups::roles(),
                'statuses' => Lookups::statuses(),
                'businessUnits' => Lookups::businessUnits(),
                'geographicalAreas' => Lookups::geographicalAreas(),
            ],
        ]);
    }

    public function store(UserRequest $request): RedirectResponse
    {
        User::create($request->toModelAttributes());

        return back()->with('success', 'User created.');
    }

    public function update(UserRequest $request, User $user): RedirectResponse
    {
        $user->update($request->toModelAttributes());

        return back()->with('success', 'User updated.');
    }
}
