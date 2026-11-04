<?php

namespace App\Http\Controllers\MasterData;

use App\Enums\Status;
use App\Http\Controllers\Controller;
use App\Http\Requests\EntityRequest;
use App\Http\Resources\EntityResource;
use App\Models\Entity;
use App\Support\Lookups;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EntityController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search'));
        $perPage = min(max($request->integer('perPage', 5), 1), 100);

        $entities = Entity::with('state:id,name')
            ->when($search !== '', fn ($query) => $query->where(function ($query) use ($search) {
                $query->whereAny(['name', 'entity_code', 'gstin', 'status'], 'like', "%{$search}%")
                    ->orWhereRelation('state', 'name', 'like', "%{$search}%");
            }))
            ->orderBy('id')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('master-data/Entities', [
            'managers' => EntityResource::collection($entities),
            'filters' => $request->only('search'),
            'options' => [
                'statuses' => Lookups::statuses(),
                'states' => Lookups::states(),
            ],
        ]);
    }

    public function store(EntityRequest $request): RedirectResponse
    {
        Entity::create([
            ...$request->toModelAttributes(),
            'status' => Status::Active->value,
        ]);

        return back()->with('success', 'Entity created.');
    }

    public function update(EntityRequest $request, Entity $entity): RedirectResponse
    {
        $entity->update($request->toModelAttributes());

        return back()->with('success', 'Entity updated.');
    }
}
