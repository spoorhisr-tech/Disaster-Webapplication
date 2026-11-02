<?php

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $indexPath = public_path('index.html');
    if (File::exists($indexPath)) {
        return response()->file($indexPath);
    }
    return view('welcome');
});

Route::fallback(function () {
    $indexPath = public_path('index.html');
    if (File::exists($indexPath)) {
        return response()->file($indexPath);
    }
    return response()->json(['message' => 'Not Found'], 404);
});

