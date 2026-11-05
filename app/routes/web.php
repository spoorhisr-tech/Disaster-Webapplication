<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $indexPath = public_path('index.html');
    if (File::exists($indexPath)) {
        return response()->file($indexPath);
    }
    return view('welcome');
});

// Web Login View for Admins and Organizations
Route::get('/login', function () {
    return view('auth.login');
})->name('login');

Route::get('/migrate-setup', function () {
    try {
        Artisan::call('migrate:fresh', [
            '--force' => true,
            '--seed' => true,
        ]);
        $output = Artisan::output();

        return response()->json([
            'status' => 'success',
            'output' => $output,
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ], 500);
    }
});

Route::fallback(function () {
    $indexPath = public_path('index.html');
    if (File::exists($indexPath)) {
        return response()->file($indexPath);
    }
    return response()->json(['message' => 'Not Found'], 404);
});
