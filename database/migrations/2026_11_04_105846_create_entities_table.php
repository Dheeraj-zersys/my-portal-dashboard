<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('entities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('state_id')->constrained()->restrictOnDelete();
            $table->string('entity_code')->unique();
            $table->string('name');
            $table->string('gstin')->nullable();
            $table->string('vat_number')->nullable();
            $table->string('cst_number')->nullable();
            $table->string('cin')->nullable();
            $table->string('pan_number')->nullable();
            $table->string('tan_number')->nullable();
            $table->text('registered_address')->nullable();
            $table->string('status')->default('Active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('entities');
    }
};
