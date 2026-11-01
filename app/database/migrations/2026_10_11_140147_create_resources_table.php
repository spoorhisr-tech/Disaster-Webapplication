<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    public function up(): void
    {
        // The resources table already exists.
        // Preserve the existing table and its data.
    }

    public function down(): void
    {
        // Intentionally do not drop the existing resources table.
    }
};