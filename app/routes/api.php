<?php

use App\Http\Controllers\DisasterEventController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\IncidentReportController;
use App\Http\Controllers\EmergencyRequestController;

Route::get('/disaster-events', [
    DisasterEventController::class,
    'index'
]);

Route::get('/disaster-events/{id}', [
    DisasterEventController::class,
    'show'
]);
Route::post('/disaster-events', [
    DisasterEventController::class,
    'store'
]);
Route::view('/disaster-test', 'disaster-test');
Route::put('/disaster-events/{id}', [
    DisasterEventController::class,
    'update'
]);
Route::delete('/disaster-events/{id}', [
    DisasterEventController::class,
    'destroy'
]);
Route::get('/incident-reports', [
    IncidentReportController::class,
    'index'
]);
Route::get('/incident-reports/{id}', [
    IncidentReportController::class,
    'show'
]);
Route::post('/incident-reports', [
    IncidentReportController::class,
    'store'
]);
// Emergency Request API
Route::get('/emergency-requests', [
    EmergencyRequestController::class,
    'index'
]);

Route::get('/emergency-requests/{id}', [
    EmergencyRequestController::class,
    'show'
]);

Route::post('/emergency-requests', [
    EmergencyRequestController::class,
    'store'
]);
// Update an emergency request
Route::put('/emergency-requests/{id}', [
    EmergencyRequestController::class,
    'update'
]);
use App\Http\Controllers\ResourceController;

Route::get('/resources', [ResourceController::class, 'index']);
Route::get('/resources/{id}', [ResourceController::class, 'show']);
Route::post('/resources', [ResourceController::class, 'store']);
Route::put('/resources/{id}', [ResourceController::class, 'update']);

use App\Http\Controllers\DistributionController;

Route::get('/distributions', [DistributionController::class, 'index']);
Route::get('/distributions/{id}', [DistributionController::class, 'show']);

Route::post('/distributions', [DistributionController::class, 'store']);