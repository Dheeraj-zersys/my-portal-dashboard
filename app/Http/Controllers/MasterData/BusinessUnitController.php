<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Http\Requests\BusinessUnitRequest;
use App\Http\Resources\BusinessUnitResource;
use App\Models\BusinessUnit;
use App\Support\Lookups;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BusinessUnitController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search'));

        $units = BusinessUnit::query()
            ->when($search !== '', fn ($query) => $query->whereAny(['name', 'status'], 'like', "%{$search}%"))
            ->orderBy('id')
            ->paginate(min($request->integer('perPage', 5), 100))
            ->withQueryString();

        return Inertia::render('master-data/BusinessUnits', [
            'managers' => BusinessUnitResource::collection($units),
            'filters' => ['search' => $search],
            'options' => ['statuses' => Lookups::statuses()],
        ]);
    }

    public function store(BusinessUnitRequest $request): RedirectResponse
    {
        BusinessUnit::create($request->validated());

        return back()->with('success', 'Business unit created.');
    }

    public function update(BusinessUnitRequest $request, BusinessUnit $businessUnit): RedirectResponse
    {
        $businessUnit->update($request->validated());

        return back()->with('success', 'Business unit updated.');
    }
}
