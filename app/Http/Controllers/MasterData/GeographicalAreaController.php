<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Http\Requests\GeographicalAreaRequest;
use App\Http\Resources\GeographicalAreaResource;
use App\Models\GeographicalArea;
use App\Support\Lookups;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class GeographicalAreaController extends Controller
{
    /** Supports the GA name / state / district filters on the GA Manager screen. */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search'));

        $areas = GeographicalArea::with(['state:id,name', 'districts:id,name'])
            ->when($search !== '', fn ($query) => $query->where(function ($query) use ($search) {
                $query->whereAny(['name', 'status'], 'like', "%{$search}%")
                    ->orWhereRelation('state', 'name', 'like', "%{$search}%")
                    ->orWhereRelation('districts', 'name', 'like', "%{$search}%");
            }))
            ->when($request->integer('gaId'), fn ($query, $id) => $query->whereKey($id))
            ->when($request->integer('stateId'), fn ($query, $id) => $query->where('state_id', $id))
            ->when($request->integer('districtId'), fn ($query, $id) => $query->whereRelation('districts', 'districts.id', $id))
            ->orderBy('id')
            ->paginate(min($request->integer('perPage', 5), 100))
            ->withQueryString();

        return Inertia::render('master-data/GeographicalAreas', [
            'managers' => GeographicalAreaResource::collection($areas),
            'filters' => $request->only('search', 'gaId', 'stateId', 'districtId'),
            'options' => [
                'statuses' => Lookups::statuses(),
                'states' => Lookups::states(),
                'geographicalAreas' => Lookups::geographicalAreas(),
            ],
        ]);
    }

    public function store(GeographicalAreaRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $area = GeographicalArea::create([
                'name' => $request->validated('name'),
                'state_id' => $request->validated('stateId'),
                'status' => $request->validated('status'),
            ]);
            $area->districts()->sync($request->validated('districtIds'));
        });

        return back()->with('success', 'Geographical area created.');
    }

    public function update(GeographicalAreaRequest $request, GeographicalArea $geographicalArea): RedirectResponse
    {
        DB::transaction(function () use ($request, $geographicalArea) {
            $geographicalArea->update([
                'name' => $request->validated('name'),
                'state_id' => $request->validated('stateId'),
                'status' => $request->validated('status'),
            ]);
            $geographicalArea->districts()->sync($request->validated('districtIds'));
        });

        return back()->with('success', 'Geographical area updated.');
    }
}
