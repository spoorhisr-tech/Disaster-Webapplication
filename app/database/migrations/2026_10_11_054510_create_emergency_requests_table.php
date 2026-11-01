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
        Schema::create('emergency_requests', function (Blueprint $table) {
            $table->id();

            $table->string('request_number')->unique();

            $table->foreignId('disaster_event_id')
                ->constrained('disaster_events')
                ->cascadeOnDelete();

            $table->string('request_type');
            $table->text('description')->nullable();
            $table->string('location_name');
            $table->unsignedInteger('people_affected')->default(1);
            $table->string('priority')->default('medium');
            $table->string('status')->default('pending');
            $table->string('requester_name');
            $table->string('requester_phone', 30)->nullable();

            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('emergency_requests');
    }
};
