<?php

namespace App\Http\Controllers;

use App\Http\Requests\BusinessPlanRequest;
use App\Http\Resources\BusinessPlanResource;
use App\Models\BusinessPlan;
use App\Support\Lookups;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BusinessPlanController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search'));

        $plans = BusinessPlan::with(['geographicalArea:id,name', 'district:id,name'])
            ->when($search !== '', fn ($query) => $query->where(function ($query) use ($search) {
                $query->where('entity_name', 'like', "%{$search}%")
                    ->orWhereRelation('geographicalArea', 'name', 'like', "%{$search}%")
                    ->orWhereRelation('district', 'name', 'like', "%{$search}%");
            }))
            ->orderBy('id')
            ->paginate(min($request->integer('perPage', 5), 100))
            ->withQueryString();

        return Inertia::render('business-plans/Index', [
            'plans' => BusinessPlanResource::collection($plans),
            'filters' => ['search' => $search],
            'options' => [
                'geographicalAreas' => Lookups::geographicalAreas(),
            ],
        ]);
    }

    public function store(BusinessPlanRequest $request): RedirectResponse
    {
        BusinessPlan::create($request->toModelAttributes() + [
            'created_by' => $request->user()->id,
            'updated_by' => $request->user()->id,
        ]);

        return back()->with('success', 'Business plan created.');
    }

    public function update(BusinessPlanRequest $request, BusinessPlan $businessPlan): RedirectResponse
    {
        $businessPlan->update($request->toModelAttributes() + [
            'updated_by' => $request->user()->id,
        ]);

        return back()->with('success', 'Business plan updated.');
    }
}
