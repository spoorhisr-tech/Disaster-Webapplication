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
        if (!Schema::hasTable('incident_reports')) {
            Schema::create('incident_reports', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('disaster_event_id')->nullable();
                $table->unsignedBigInteger('user_id')->nullable();
                $table->string('ticket_number')->unique();
                $table->string('incident_type', 100);
                $table->string('urgency', 50)->default('medium');
                $table->string('status', 50)->default('reported');
                $table->string('title');
                $table->text('description')->nullable();
                $table->string('location_name');
                $table->decimal('latitude', 10, 7)->nullable();
                $table->decimal('longitude', 10, 7)->nullable();
                $table->string('reporter_name');
                $table->string('reporter_phone', 30)->nullable();
                $table->unsignedInteger('people_affected')->default(0);
                $table->text('resolution_notes')->nullable();
                $table->timestamp('resolved_at')->nullable();
                $table->unsignedBigInteger('assigned_to')->nullable();
                $table->unsignedBigInteger('verified_by')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incident_reports');
    }
};

