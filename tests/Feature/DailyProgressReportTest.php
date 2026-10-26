<?php

namespace Tests\Feature;

use App\Models\DailyProgressReport;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DailyProgressReportTest extends TestCase
{
    use RefreshDatabase;

    public function test_report_is_stored_from_camel_case_form_data(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/daily-progress-reports', [
            'date' => '2026-10-20',
            'domesticReg' => '7054587',
            'mdpe20Laid' => '24297886',
            'forAggPga' => '64936',
            'oem' => null,
        ]);

        $report = DailyProgressReport::firstOrFail();
        $response->assertRedirect("/daily-progress-reports/{$report->id}");
        $this->assertSame('7054587.00', $report->domestic_reg);
        $this->assertSame('24297886.00', $report->mdpe20_laid);
        $this->assertSame('64936.00', $report->for_agg_pga);
        $this->assertNull($report->oem);
    }

    public function test_negative_metrics_are_rejected(): void
    {
        $this->actingAs(User::factory()->create())
            ->post('/daily-progress-reports', ['date' => '2026-10-20', 'cngSales' => -1])
            ->assertSessionHasErrors('cngSales');
    }

    public function test_show_includes_cumulative_totals(): void
    {
        DailyProgressReport::factory()->create(['report_date' => '2024-06-01', 'domestic_reg' => 1]);
        DailyProgressReport::factory()->create(['report_date' => '2025-06-01', 'domestic_reg' => 10]);
        DailyProgressReport::factory()->create(['report_date' => '2026-02-01', 'domestic_reg' => 100]);
        DailyProgressReport::factory()->create(['report_date' => '2026-10-01', 'domestic_reg' => 1000]);
        $report = DailyProgressReport::factory()->create(['report_date' => '2026-10-20', 'domestic_reg' => 10000]);
        DailyProgressReport::factory()->create(['report_date' => '2026-10-25', 'domestic_reg' => 99999]);

        $this->actingAs(User::factory()->create())
            ->get("/daily-progress-reports/{$report->id}")
            ->assertInertia(fn (Assert $page) => $page
                ->component('daily-progress-reports/Show')
                ->where('report.domesticReg', '10000.00')
                ->where('cumulative.periods.currentYear.label', 'Cumulative CY 2026')
                ->where('cumulative.totals.domesticReg.month', fn ($value) => (float) $value === 11000.0)
                ->where('cumulative.totals.domesticReg.currentYear', fn ($value) => (float) $value === 11100.0)
                ->where('cumulative.totals.domesticReg.previousYear', fn ($value) => (float) $value === 10.0)
                ->where('cumulative.totals.domesticReg.beforePreviousYear', fn ($value) => (float) $value === 1.0)
            );
    }

    public function test_create_and_edit_pages_render_with_steps(): void
    {
        $user = User::factory()->create();
        $report = DailyProgressReport::factory()->create();

        $this->actingAs($user)->get('/daily-progress-reports/create')->assertInertia(fn (Assert $page) => $page
            ->component('daily-progress-reports/Form')
            ->where('report', null)
            ->has('steps.infrastructure', 9)
            ->has('steps.sales', 8)
        );
        $this->actingAs($user)->get("/daily-progress-reports/{$report->id}/edit")->assertInertia(fn (Assert $page) => $page
            ->component('daily-progress-reports/Form')
            ->where('report.id', $report->id)
        );
    }
}
