<?php

namespace App\Models;

use Database\Factories\DailyProgressReportFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class DailyProgressReport extends Model
{
    /** @use HasFactory<DailyProgressReportFactory> */
    use HasFactory;

    /**
     * Wizard fields grouped by step, keyed by the camelCase names the frontend already uses
     * (src/app/dpr.js). Each maps to a snake_case column, e.g. domesticReg => domestic_reg.
     */
    public const STEPS = [
        'infrastructure' => [
            'domesticReg', 'domesticLmc', 'domesticCom',
            'commercialReg', 'commercialLmc', 'commercialCom',
            'industrialReg', 'industrialLmc', 'industrialCom',
        ],
        'cngStations' => ['omcApplied', 'omcCom', 'cocoApplied', 'cocoCom', 'oem', 'conversion'],
        'pipelinesOfc' => [
            'mdpeLaid', 'mdpeCom', 'mdpe20Laid', 'mdpe20Com',
            'steelStringing', 'steelCom', 'steelInchStringing', 'steelInchCom',
            'ofcPipeline', 'ofcMdpe',
        ],
        'sales' => [
            'pngDomestic', 'pngCommercial', 'pngIndustrial', 'cngSales',
            'directLng', 'compressionServices', 'forAggPga', 'forOthers',
        ],
    ];

    protected $guarded = ['id', 'created_at', 'updated_at'];

    /** @return list<string> */
    public static function metricKeys(): array
    {
        return array_merge(...array_values(self::STEPS));
    }

    /** @return array<string, string> camelCase key => column */
    public static function metricColumnMap(): array
    {
        $keys = self::metricKeys();

        return array_combine($keys, array_map(fn (string $key) => Str::snake($key), $keys));
    }

    /** @return list<string> */
    public static function metricColumns(): array
    {
        return array_values(self::metricColumnMap());
    }

    protected function casts(): array
    {
        return ['report_date' => 'date']
            + array_fill_keys(self::metricColumns(), 'decimal:2');
    }

    public function geographicalArea(): BelongsTo
    {
        return $this->belongsTo(GeographicalArea::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
