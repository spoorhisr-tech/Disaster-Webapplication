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
        if (!Schema::hasTable('shelters')) {
            Schema::create('shelters', function (Blueprint $table) {
                $table->increments('shelter_id');
                $table->string('shelter_name', 150);
                $table->string('area', 100);
                $table->unsignedInteger('capacity')->default(50);
                $table->unsignedInteger('current_occupancy')->default(0);
                $table->string('status', 50)->default('OPEN');
                $table->string('contact_person', 100)->nullable();
                $table->string('contact_phone', 30)->nullable();
                $table->timestamp('created_at')->nullable()->useCurrent();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shelters');
    }
};

