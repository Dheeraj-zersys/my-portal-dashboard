<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 20)->nullable()->after('email');
            $table->string('role')->default('User')->after('phone')->index();
            $table->string('status')->default('Active')->after('role')->index();
            $table->foreignId('business_unit_id')->nullable()->after('status')->constrained()->nullOnDelete();
            $table->foreignId('geographical_area_id')->nullable()->after('business_unit_id')->constrained()->nullOnDelete();
            $table->string('entity')->nullable()->after('geographical_area_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('geographical_area_id');
            $table->dropConstrainedForeignId('business_unit_id');
            $table->dropColumn(['phone', 'role', 'status', 'entity']);
        });
    }
};
