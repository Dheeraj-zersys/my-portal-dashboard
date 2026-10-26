<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_progress_reports', function (Blueprint $table) {
            $table->id();
            $table->date('report_date')->index();
            $table->foreignId('geographical_area_id')->nullable()->constrained()->nullOnDelete();

            $metrics = [
                // Step 1: Infrastructure (connections)
                'domestic_reg', 'domestic_lmc', 'domestic_com',
                'commercial_reg', 'commercial_lmc', 'commercial_com',
                'industrial_reg', 'industrial_lmc', 'industrial_com',
                // Step 2: CNG Stations
                'omc_applied', 'omc_com', 'coco_applied', 'coco_com', 'oem', 'conversion',
                // Step 3: Pipelines & OFC
                'mdpe_laid', 'mdpe_com', 'mdpe20_laid', 'mdpe20_com',
                'steel_stringing', 'steel_com', 'steel_inch_stringing', 'steel_inch_com',
                'ofc_pipeline', 'ofc_mdpe',
                // Step 4: Sales
                'png_domestic', 'png_commercial', 'png_industrial', 'cng_sales',
                'direct_lng', 'compression_services', 'for_agg_pga', 'for_others',
            ];

            foreach ($metrics as $column) {
                $table->decimal($column, 20, 2)->nullable();
            }

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_progress_reports');
    }
};
