<?php

namespace Database\Seeders;

use App\Models\State;
use Illuminate\Database\Seeder;

/** Reference data. Lists come from the `states` constant in src/components/MasterData/MasterDataContent.jsx. */
class StateDistrictSeeder extends Seeder
{
    public const STATES = [
        'Andhra Pradesh' => [
            'Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Kakinada',
            'Kurnool', 'NTR', 'Tirupati', 'West Godavari', 'YSR Kadapa',
        ],
        'Telangana' => ['Hyderabad', 'Karimnagar', 'Khammam', 'Rangareddy', 'Warangal'],
        'Karnataka' => ['Bengaluru', 'Belagavi', 'Mysuru', 'Kolar'],
        'Tamil Nadu' => ['Chennai', 'Madurai', 'Vellore', 'Ambur', 'Kanchipuram'],
    ];

    public function run(): void
    {
        foreach (self::STATES as $stateName => $districts) {
            $state = State::firstOrCreate(['name' => $stateName]);

            foreach ($districts as $district) {
                $state->districts()->firstOrCreate(['name' => $district]);
            }
        }
    }
}
