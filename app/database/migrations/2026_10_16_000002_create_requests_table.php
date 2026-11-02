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
        if (!Schema::hasTable('requests')) {
            Schema::create('requests', function (Blueprint $table) {
                $table->string('request_id', 50)->primary();
                $table->string('citizen_name', 150);
                $table->string('phone', 30);
                $table->string('area', 100);
                $table->string('urgency_level', 50)->default('MEDIUM');
                $table->string('resource_type_needed', 100);
                $table->unsignedInteger('quantity_needed')->default(1);
                $table->string('status', 50)->default('PENDING');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requests');
    }
};

