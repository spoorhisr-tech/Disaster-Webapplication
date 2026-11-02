<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('resources')) {
            Schema::create('resources', function (Blueprint $table) {
                $table->increments('resource_id');
                $table->string('item_name', 150);
                $table->string('category', 100);
                $table->integer('quantity_available')->default(0);
                $table->string('unit', 50)->default('units');
                $table->string('warehouse_location', 100);
                $table->timestamp('last_updated')->nullable()->useCurrent();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('resources');
    }
};
