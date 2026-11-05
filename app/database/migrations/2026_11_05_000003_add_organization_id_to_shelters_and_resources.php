<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('shelters')) {
            Schema::table('shelters', function (Blueprint $table) {
                if (!Schema::hasColumn('shelters', 'organization_id')) {
                    $table->foreignId('organization_id')->nullable()->after('status')->constrained('organizations')->onDelete('set null');
                }
            });
        }

        if (Schema::hasTable('resources')) {
            Schema::table('resources', function (Blueprint $table) {
                if (!Schema::hasColumn('resources', 'organization_id')) {
                    $table->foreignId('organization_id')->nullable()->after('warehouse_location')->constrained('organizations')->onDelete('set null');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('shelters')) {
            Schema::table('shelters', function (Blueprint $table) {
                if (Schema::hasColumn('shelters', 'organization_id')) {
                    $table->dropForeign(['organization_id']);
                    $table->dropColumn('organization_id');
                }
            });
        }

        if (Schema::hasTable('resources')) {
            Schema::table('resources', function (Blueprint $table) {
                if (Schema::hasColumn('resources', 'organization_id')) {
                    $table->dropForeign(['organization_id']);
                    $table->dropColumn('organization_id');
                }
            });
        }
    }
};
