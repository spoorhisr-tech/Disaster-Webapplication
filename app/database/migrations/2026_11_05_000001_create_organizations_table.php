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
        Schema::create('organizations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['ngo', 'hospital', 'government', 'rescue_agency'])->default('ngo');
            $table->string('registration_number')->unique();
            $table->string('email')->unique();
            $table->string('phone', 30);
            $table->string('area');
            $table->enum('status', ['active', 'pending_verification', 'suspended'])->default('active');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organizations');
    }
};

