<?php

namespace Database\Seeders;

use App\Models\BusinessUnit;
use App\Models\District;
use App\Models\GeographicalArea;
use App\Models\State;
use Illuminate\Database\Seeder;

/** Sample BUs and GAs matching the seed arrays in src/components/MasterData/*ManagerContent.jsx. */
class MasterDataSeeder extends Seeder
{
    private const GEOGRAPHICAL_AREAS = [
        'RMD' => ['Karnataka', ['Bengaluru']],
        'KP' => ['Tamil Nadu', ['Chennai']],
        'LD' => ['Andhra Pradesh', ['Kurnool', 'YSR Kadapa', 'NTR']],
        'CHK' => ['Andhra Pradesh', ['Tirupati', 'Anantapur']],
        'AGP' => ['Karnataka', ['Kolar']],
    ];

    public function run(): void
    {
        foreach (range(1, 5) as $number) {
            BusinessUnit::firstOrCreate(['name' => "BU {$number}"]);
        }

        foreach (self::GEOGRAPHICAL_AREAS as $name => [$stateName, $districtNames]) {
            $state = State::where('name', $stateName)->firstOrFail();

            $area = GeographicalArea::firstOrCreate(['name' => $name], ['state_id' => $state->id]);
            $area->districts()->syncWithoutDetaching(
                District::where('state_id', $state->id)->whereIn('name', $districtNames)->pluck('id'),
            );
        }
    }
}
