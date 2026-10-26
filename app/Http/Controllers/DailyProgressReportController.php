<?php

namespace App\Http\Controllers;

use App\Http\Requests\DailyProgressReportRequest;
use App\Http\Resources\DailyProgressReportResource;
use App\Models\DailyProgressReport;
use App\Support\Lookups;
use Carbon\CarbonInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DailyProgressReportController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search'));

        $reports = DailyProgressReport::with('geographicalArea:id,name')
            ->when($search !== '', fn ($query) => $query->where(function ($query) use ($search) {
                $query->where('report_date', 'like', "%{$search}%")
                    ->orWhereRelation('geographicalArea', 'name', 'like', "%{$search}%");
            }))
            ->latest('report_date')
            ->paginate(min($request->integer('perPage', 5), 100))
            ->withQueryString();

        return Inertia::render('daily-progress-reports/Index', [
            'reports' => DailyProgressReportResource::collection($reports),
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('daily-progress-reports/Form', [
            'report' => null,
            'steps' => DailyProgressReport::STEPS,
            'options' => ['geographicalAreas' => Lookups::geographicalAreas()],
        ]);
    }

    public function store(DailyProgressReportRequest $request): RedirectResponse
    {
        $report = DailyProgressReport::create($request->toModelAttributes() + [
            'created_by' => $request->user()->id,
            'updated_by' => $request->user()->id,
        ]);

        return redirect()->route('daily-progress-reports.show', $report)->with('success', 'Report saved.');
    }

    /** Preview page: the report plus the cumulative columns shown in the DPR preview tables. */
    public function show(DailyProgressReport $dailyProgressReport): Response
    {
        $dailyProgressReport->load('geographicalArea:id,name');

        return Inertia::render('daily-progress-reports/Show', [
            'report' => new DailyProgressReportResource($dailyProgressReport),
            'steps' => DailyProgressReport::STEPS,
            'cumulative' => $this->cumulativeTotals($dailyProgressReport),
        ]);
    }

    public function edit(DailyProgressReport $dailyProgressReport): Response
    {
        return Inertia::render('daily-progress-reports/Form', [
            'report' => new DailyProgressReportResource($dailyProgressReport),
            'steps' => DailyProgressReport::STEPS,
            'options' => ['geographicalAreas' => Lookups::geographicalAreas()],
        ]);
    }

    public function update(DailyProgressReportRequest $request, DailyProgressReport $dailyProgressReport): RedirectResponse
    {
        $dailyProgressReport->update($request->toModelAttributes() + [
            'updated_by' => $request->user()->id,
        ]);

        return redirect()->route('daily-progress-reports.show', $dailyProgressReport)->with('success', 'Report updated.');
    }

    /**
     * Sums every metric over the periods in the preview table headers, relative to the report date
     * and scoped to the report's GA (if any):
     * month to date, current calendar year to date, previous calendar year, and everything before that.
     *
     * @return array{periods: array<string, array{label: string}>, totals: array<string, array<string, string|null>>}
     */
    private function cumulativeTotals(DailyProgressReport $report): array
    {
        $date = $report->report_date;
        $previousYear = $date->copy()->subYear();

        $periods = [
            'month' => ['label' => 'Cumulative for the Month', 'from' => $date->copy()->startOfMonth(), 'to' => $date],
            'currentYear' => ['label' => "Cumulative CY {$date->year}", 'from' => $date->copy()->startOfYear(), 'to' => $date],
            'previousYear' => ['label' => "Cumulative CY {$previousYear->year}", 'from' => $previousYear->copy()->startOfYear(), 'to' => $previousYear->copy()->endOfYear()],
            'beforePreviousYear' => ['label' => 'Cumulative till Dec '.($previousYear->year - 1), 'from' => null, 'to' => $previousYear->copy()->startOfYear()->subDay()],
        ];

        $columns = DailyProgressReport::metricColumnMap();
        $totals = [];

        foreach ($periods as $period => $range) {
            $row = $this->sumMetrics($report, $columns, $range['from'], $range['to']);

            foreach ($columns as $key => $column) {
                $totals[$key][$period] = $row[$column] ?? null;
            }
        }

        return [
            'periods' => array_map(fn (array $range) => ['label' => $range['label']], $periods),
            'totals' => $totals,
        ];
    }

    /** @param array<string, string> $columns */
    private function sumMetrics(DailyProgressReport $report, array $columns, ?CarbonInterface $from, CarbonInterface $to): array
    {
        $select = array_map(fn (string $column) => "SUM({$column}) as {$column}", array_values($columns));

        $row = DailyProgressReport::query()
            ->selectRaw(implode(', ', $select))
            ->when($report->geographical_area_id, fn ($query, $areaId) => $query->where('geographical_area_id', $areaId))
            ->when($from, fn ($query) => $query->whereDate('report_date', '>=', $from))
            ->whereDate('report_date', '<=', $to)
            ->toBase()
            ->first();

        return (array) $row;
    }
}
