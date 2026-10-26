<?php

namespace App\Http\Controllers;

use App\Models\BusinessPlan;
use App\Models\DailyProgressReport;
use App\Models\GeographicalArea;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * `stats` has the same shape as the dashboard slice in src/store/dashboardSlice.js.
     * "current" counts records in the current month, "total" counts all records.
     */
    public function __invoke(): Response
    {
        $monthStart = now()->startOfMonth();

        return Inertia::render('Dashboard', [
            'stats' => [
                'users' => User::count(),
                'businessPlan' => [
                    'current' => BusinessPlan::where('plan_date', '>=', $monthStart)->count(),
                    'total' => BusinessPlan::count(),
                ],
                'dailyProgressReport' => [
                    'current' => DailyProgressReport::where('report_date', '>=', $monthStart)->count(),
                    'total' => DailyProgressReport::count(),
                ],
                'geographicalArea' => GeographicalArea::count(),
            ],
        ]);
    }
}
