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
        if (!Schema::hasTable('distributions')) {
            Schema::create('distributions', function (Blueprint $table) {
                $table->increments('distribution_id');
                $table->string('request_id', 50);
                $table->unsignedInteger('resource_id');
                $table->unsignedInteger('quantity_distributed')->default(1);
                $table->unsignedInteger('distributed_by_volunteer_id')->nullable();
                $table->timestamp('distributed_at')->useCurrent();
                $table->text('notes')->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('distributions');
    }
};

