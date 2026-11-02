<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('volunteers')) {
            Schema::create('volunteers', function (Blueprint $table) {
                $table->increments('volunteer_id');
                $table->string('name', 150);
                $table->string('phone', 30);
                $table->string('skills', 255);
                $table->string('assigned_area', 100);
                $table->boolean('is_available')->default(true);
                $table->timestamp('created_at')->nullable()->useCurrent();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('volunteers');
    }
};

