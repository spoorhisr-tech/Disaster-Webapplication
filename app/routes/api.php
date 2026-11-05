<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DisasterEventController;
use App\Http\Controllers\DistributionController;
use App\Http\Controllers\EmergencyRequestController;
use App\Http\Controllers\IncidentReportController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\ReliefRequestController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\ShelterController;
use App\Http\Controllers\VolunteerController;
use Illuminate\Support\Facades\Route;

// ==============================================================================
// 1. AUTHENTICATION (ADMIN & ORGANIZATIONS)
// ==============================================================================
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Scoped queries for logged-in organization
    Route::get('/my-shelters', [OrganizationController::class, 'myShelters']);
    Route::get('/my-resources', [OrganizationController::class, 'myResources']);
});

// ==============================================================================
// 2. ORGANIZATIONS (NGOS, HOSPITALS, DISASTER RESPONSE TEAMS)
// ==============================================================================
Route::get('/organizations', [OrganizationController::class, 'index']);
Route::get('/organizations/{id}', [OrganizationController::class, 'show']);
Route::post('/organizations', [OrganizationController::class, 'store']);
Route::put('/organizations/{id}', [OrganizationController::class, 'update']);

// ==============================================================================
// 3. EMERGENCY REQUESTS & CITIZEN TRACKING
// ==============================================================================
Route::get('/emergency-requests', [EmergencyRequestController::class, 'index']);
Route::get('/emergency-requests/track/{code}', [EmergencyRequestController::class, 'trackByCode']);
Route::get('/emergency-requests/{id}', [EmergencyRequestController::class, 'show']);
Route::post('/emergency-requests', [EmergencyRequestController::class, 'store']);
Route::put('/emergency-requests/{id}', [EmergencyRequestController::class, 'update']);

// ==============================================================================
// 4. DISASTER EVENTS
// ==============================================================================
Route::get('/disaster-events', [DisasterEventController::class, 'index']);
Route::get('/disaster-events/{id}', [DisasterEventController::class, 'show']);
Route::post('/disaster-events', [DisasterEventController::class, 'store']);
Route::put('/disaster-events/{id}', [DisasterEventController::class, 'update']);
Route::delete('/disaster-events/{id}', [DisasterEventController::class, 'destroy']);
Route::view('/disaster-test', 'disaster-test');

// ==============================================================================
// 5. INCIDENT REPORTS
// ==============================================================================
Route::get('/incident-reports', [IncidentReportController::class, 'index']);
Route::get('/incident-reports/{id}', [IncidentReportController::class, 'show']);
Route::post('/incident-reports', [IncidentReportController::class, 'store']);

// ==============================================================================
// 6. WAREHOUSE RESOURCES
// ==============================================================================
Route::get('/resources', [ResourceController::class, 'index']);
Route::get('/resources/{id}', [ResourceController::class, 'show']);
Route::post('/resources', [ResourceController::class, 'store']);
Route::put('/resources/{id}', [ResourceController::class, 'update']);

// ==============================================================================
// 7. AID DISTRIBUTIONS
// ==============================================================================
Route::get('/distributions', [DistributionController::class, 'index']);
Route::get('/distributions/{id}', [DistributionController::class, 'show']);
Route::post('/distributions', [DistributionController::class, 'store']);

// ==============================================================================
// 8. SHELTERS
// ==============================================================================
Route::get('/shelters', [ShelterController::class, 'index']);
Route::get('/shelters/{id}', [ShelterController::class, 'show']);
Route::post('/shelters', [ShelterController::class, 'store']);
Route::put('/shelters/{id}', [ShelterController::class, 'update']);

// ==============================================================================
// 9. VOLUNTEERS
// ==============================================================================
Route::get('/volunteers', [VolunteerController::class, 'index']);
Route::get('/volunteers/{id}', [VolunteerController::class, 'show']);
Route::post('/volunteers', [VolunteerController::class, 'store']);
Route::put('/volunteers/{id}', [VolunteerController::class, 'update']);

// ==============================================================================
// 10. RELIEF REQUESTS
// ==============================================================================
Route::get('/relief-requests', [ReliefRequestController::class, 'index']);
Route::get('/relief-requests/{id}', [ReliefRequestController::class, 'show']);
Route::post('/relief-requests', [ReliefRequestController::class, 'store']);
Route::put('/relief-requests/{id}', [ReliefRequestController::class, 'update']);
