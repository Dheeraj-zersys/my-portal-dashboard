<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('geographical_areas', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->foreignId('state_id')->constrained()->restrictOnDelete();
            $table->string('status')->default('Active')->index();
            $table->timestamps();
        });

        Schema::create('district_geographical_area', function (Blueprint $table) {
            $table->foreignId('geographical_area_id')->constrained()->cascadeOnDelete();
            $table->foreignId('district_id')->constrained()->cascadeOnDelete();

            $table->primary(['geographical_area_id', 'district_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('district_geographical_area');
        Schema::dropIfExists('geographical_areas');
    }
};
