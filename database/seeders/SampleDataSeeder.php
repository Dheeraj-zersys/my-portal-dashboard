<?php

namespace Database\Seeders;

use App\Models\BusinessPlan;
use App\Models\BusinessUnit;
use App\Models\DailyProgressReport;
use App\Models\GeographicalArea;
use App\Models\User;
use Illuminate\Database\Seeder;

/** Demo users, business plans and DPRs for local development. Not for production. */
class SampleDataSeeder extends Seeder
{
    public function run(): void
    {
        $unit = BusinessUnit::where('name', 'BU 1')->firstOrFail();
        $agp = GeographicalArea::where('name', 'AGP')->firstOrFail();

        $admin = User::factory()->admin()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'business_unit_id' => $unit->id,
            'geographical_area_id' => $agp->id,
            'entity' => 'AGP',
        ]);

        foreach (['Sonal', 'Tina', 'Rahul', 'Amal', 'Priya'] as $name) {
            User::factory()->create([
                'name' => $name,
                'email' => strtolower($name).'@example.com',
                'business_unit_id' => $unit->id,
                'geographical_area_id' => $agp->id,
                'entity' => 'AGP',
            ]);
        }

        $plans = [
            ['CHK', 'Anantapur', '2026-01-10', 500, 800, 300, 600],
            ['LD', 'Kurnool', '2026-01-12', 450, 750, 250, 550],
            ['LD', 'YSR Kadapa', '2026-01-15', 600, 900, 350, 700],
            ['LD', 'NTR', '2026-01-18', 700, 1000, 400, 850],
            ['CHK', 'Tirupati', '2026-01-20', 550, 850, 320, 650],
        ];

        foreach ($plans as [$gaName, $districtName, $date, $transport, $industrial, $commercial, $domestic]) {
            $area = GeographicalArea::where('name', $gaName)->firstOrFail();

            BusinessPlan::create([
                'entity_name' => 'AGP',
                'geographical_area_id' => $area->id,
                'district_id' => $area->districts()->where('name', $districtName)->value('districts.id'),
                'plan_date' => $date,
                'transport' => $transport,
                'industrial_market' => $industrial,
                'commercial' => $commercial,
                'domestic' => $domestic,
                'created_by' => $admin->id,
                'updated_by' => $admin->id,
            ]);
        }

        foreach (['2025-12-15', '2026-09-30', '2026-10-01', '2026-10-15', '2026-10-20'] as $date) {
            DailyProgressReport::factory()->create([
                'report_date' => $date,
                'geographical_area_id' => $agp->id,
                'created_by' => $admin->id,
                'updated_by' => $admin->id,
            ]);
        }
    }
}
