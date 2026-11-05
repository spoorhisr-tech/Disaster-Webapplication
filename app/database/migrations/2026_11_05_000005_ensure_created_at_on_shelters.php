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
        if (Schema::hasTable('shelters') && !Schema::hasColumn('shelters', 'created_at')) {
            Schema::table('shelters', function (Blueprint $table) {
                $table->timestamp('created_at')->nullable()->useCurrent();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('shelters') && Schema::hasColumn('shelters', 'created_at')) {
            Schema::table('shelters', function (Blueprint $table) {
                $table->dropColumn('created_at');
            });
        }
    }
};
