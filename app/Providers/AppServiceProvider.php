<?php

namespace App\Providers;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Single resources become flat Inertia props (`report.id`, not `report.data.id`).
        // Paginated collections still arrive as { data, links, meta }.
        JsonResource::withoutWrapping();
    }
}
