<?php

use App\Http\Controllers\DisasterEventController;
use App\Http\Controllers\DistributionController;
use App\Http\Controllers\EmergencyRequestController;
use App\Http\Controllers\IncidentReportController;
use App\Http\Controllers\ReliefRequestController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\ShelterController;
use App\Http\Controllers\VolunteerController;
use Illuminate\Support\Facades\Route;

// 1. Disaster Events
Route::get('/disaster-events', [DisasterEventController::class, 'index']);
Route::get('/disaster-events/{id}', [DisasterEventController::class, 'show']);
Route::post('/disaster-events', [DisasterEventController::class, 'store']);
Route::put('/disaster-events/{id}', [DisasterEventController::class, 'update']);
Route::delete('/disaster-events/{id}', [DisasterEventController::class, 'destroy']);
Route::view('/disaster-test', 'disaster-test');

// 2. Incident Reports
Route::get('/incident-reports', [IncidentReportController::class, 'index']);
Route::get('/incident-reports/{id}', [IncidentReportController::class, 'show']);
Route::post('/incident-reports', [IncidentReportController::class, 'store']);

// 3. Emergency Requests
Route::get('/emergency-requests', [EmergencyRequestController::class, 'index']);
Route::get('/emergency-requests/{id}', [EmergencyRequestController::class, 'show']);
Route::post('/emergency-requests', [EmergencyRequestController::class, 'store']);
Route::put('/emergency-requests/{id}', [EmergencyRequestController::class, 'update']);

// 4. Warehouse Resources
Route::get('/resources', [ResourceController::class, 'index']);
Route::get('/resources/{id}', [ResourceController::class, 'show']);
Route::post('/resources', [ResourceController::class, 'store']);
Route::put('/resources/{id}', [ResourceController::class, 'update']);

// 5. Aid Distributions
Route::get('/distributions', [DistributionController::class, 'index']);
Route::get('/distributions/{id}', [DistributionController::class, 'show']);
Route::post('/distributions', [DistributionController::class, 'store']);

// 6. Shelters
Route::get('/shelters', [ShelterController::class, 'index']);
Route::get('/shelters/{id}', [ShelterController::class, 'show']);
Route::post('/shelters', [ShelterController::class, 'store']);
Route::put('/shelters/{id}', [ShelterController::class, 'update']);

// 7. Volunteers
Route::get('/volunteers', [VolunteerController::class, 'index']);
Route::get('/volunteers/{id}', [VolunteerController::class, 'show']);
Route::post('/volunteers', [VolunteerController::class, 'store']);
Route::put('/volunteers/{id}', [VolunteerController::class, 'update']);

// 8. Relief Requests (Matching distributions)
Route::get('/relief-requests', [ReliefRequestController::class, 'index']);
Route::get('/relief-requests/{id}', [ReliefRequestController::class, 'show']);
Route::post('/relief-requests', [ReliefRequestController::class, 'store']);
Route::put('/relief-requests/{id}', [ReliefRequestController::class, 'update']);