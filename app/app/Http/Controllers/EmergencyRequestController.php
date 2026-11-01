<?php

namespace App\Http\Controllers;

use App\Models\EmergencyRequest;
use App\Models\Shelter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class EmergencyRequestController extends Controller
{
    // Find matching open shelter by ID or Area
    private function findMatchingShelter(?int $shelterId, ?string $locationName): ?Shelter
    {
        if ($shelterId) {
            return Shelter::where('shelter_id', $shelterId)->first();
        }

        if (empty($locationName)) {
            return null;
        }

        $cleanLoc = strtolower(trim($locationName));

        // 1. Exact area match (case-insensitive)
        $shelter = Shelter::whereRaw('LOWER(TRIM(area)) = ?', [$cleanLoc])->first();

        // 2. Substring match
        if (!$shelter) {
            $shelter = Shelter::whereRaw('LOWER(area) LIKE ?', ['%' . $cleanLoc . '%'])
                ->orWhereRaw('? LIKE CONCAT("%", LOWER(area), "%")', [$cleanLoc])
                ->first();
        }

        return $shelter;
    }

    // Get all emergency requests
    public function index(): JsonResponse
    {
        $requests = EmergencyRequest::with('shelter')->orderByDesc('created_at')->get();

        return response()->json($requests);
    }

    // Get one emergency request
    public function show(int $id): JsonResponse
    {
        $request = EmergencyRequest::with('shelter')->findOrFail($id);

        return response()->json($request);
    }

    // Create a new emergency request
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'disaster_event_id' => 'required|integer|exists:disaster_events,id',
            'request_type' => 'required|string|max:100',
            'description' => 'nullable|string',
            'location_name' => 'required|string|max:255',
            'shelter_id' => 'nullable|integer|exists:shelters,shelter_id',
            'people_affected' => 'required|integer|min:1',
            'priority' => 'required|in:low,medium,high,critical',
            'requester_name' => 'required|string|max:255',
            'requester_phone' => 'nullable|string|max:30',
        ]);

        if (!empty($validated['requester_phone'])) {
            $duplicate = EmergencyRequest::where('requester_phone', $validated['requester_phone'])
                ->where('disaster_event_id', $validated['disaster_event_id'])
                ->where('status', 'pending')
                ->first();

            if ($duplicate) {
                return response()->json([
                    'message' => 'An active emergency request from this phone number already exists for this disaster event.',
                    'duplicate_request_number' => $duplicate->request_number,
                    'errors' => [
                        'requester_phone' => ['A pending request (' . $duplicate->request_number . ') is already registered for this phone number.']
                    ]
                ], 409);
            }
        }

        $isShelterRequest = stripos($validated['request_type'], 'shelter') !== false;

        $emergencyRequest = DB::transaction(function () use ($validated, $isShelterRequest) {
            if ($isShelterRequest) {
                $shelter = $this->findMatchingShelter($validated['shelter_id'] ?? null, $validated['location_name']);

                if ($shelter) {
                    $shelter = Shelter::where('shelter_id', $shelter->shelter_id)->lockForUpdate()->first();

                    if ($shelter->status === 'CLOSED') {
                        throw ValidationException::withMessages([
                            'location_name' => ["The shelter '{$shelter->shelter_name}' in {$shelter->area} is currently CLOSED."]
                        ]);
                    }

                    $availableCapacity = $shelter->capacity - $shelter->current_occupancy;
                    if ($shelter->status === 'FULL' || $validated['people_affected'] > $availableCapacity) {
                        throw ValidationException::withMessages([
                            'people_affected' => [
                                "Shelter '{$shelter->shelter_name}' in {$shelter->area} only has {$availableCapacity} spot(s) remaining for {$validated['people_affected']} requested people."
                            ]
                        ]);
                    }

                    // Increment shelter occupancy
                    $shelter->current_occupancy += $validated['people_affected'];
                    if ($shelter->current_occupancy >= $shelter->capacity) {
                        $shelter->status = 'FULL';
                    }
                    $shelter->save();

                    $validated['shelter_id'] = $shelter->shelter_id;
                }
            }

            $validated['request_number'] = 'REQ-' . Str::upper(Str::random(8));
            $validated['status'] = 'pending';

            return EmergencyRequest::create($validated);
        });

        $emergencyRequest->load('shelter');

        return response()->json([
            'message' => 'Emergency request created successfully.',
            'data' => $emergencyRequest,
        ], 201);
    }

    // Update an emergency request
    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'request_type' => 'sometimes|required|string|max:100',
            'description' => 'sometimes|nullable|string',
            'location_name' => 'sometimes|required|string|max:255',
            'shelter_id' => 'sometimes|nullable|integer|exists:shelters,shelter_id',
            'people_affected' => 'sometimes|required|integer|min:1',
            'priority' => 'sometimes|required|in:low,medium,high,critical',
            'status' => 'sometimes|required|in:pending,approved,rejected,fulfilled',
            'requester_name' => 'sometimes|required|string|max:255',
            'requester_phone' => 'sometimes|nullable|string|max:30',
        ]);

        $emergencyRequest = DB::transaction(function () use ($id, $validated) {
            $emergencyRequest = EmergencyRequest::lockForUpdate()->findOrFail($id);

            // Validate status transitions
            if (isset($validated['status'])) {
                $currentStatus = $emergencyRequest->status;
                $newStatus = $validated['status'];

                $allowedTransitions = [
                    'pending' => ['approved', 'rejected'],
                    'approved' => ['fulfilled'],
                    'rejected' => [],
                    'fulfilled' => [],
                ];

                if (
                    $newStatus !== $currentStatus &&
                    !in_array(
                        $newStatus,
                        $allowedTransitions[$currentStatus] ?? [],
                        true
                    )
                ) {
                    throw ValidationException::withMessages([
                        'status' => ["This status transition from '{$currentStatus}' to '{$newStatus}' is not allowed."]
                    ]);
                }

                // If rejecting: release allocated shelter occupancy if one was reserved
                if ($newStatus === 'rejected' && $emergencyRequest->shelter_id) {
                    $shelter = Shelter::where('shelter_id', $emergencyRequest->shelter_id)->lockForUpdate()->first();
                    if ($shelter) {
                        $shelter->current_occupancy = max(0, $shelter->current_occupancy - $emergencyRequest->people_affected);
                        if ($shelter->status === 'FULL' && $shelter->current_occupancy < $shelter->capacity) {
                            $shelter->status = 'OPEN';
                        }
                        $shelter->save();
                    }
                    $validated['shelter_id'] = null;
                }

                // If approved or fulfilled, but request was NOT yet allocated (e.g. legacy record):
                if (
                    ($newStatus === 'approved' || $newStatus === 'fulfilled') &&
                    stripos($emergencyRequest->request_type, 'shelter') !== false &&
                    empty($emergencyRequest->shelter_id)
                ) {
                    $shelter = $this->findMatchingShelter($validated['shelter_id'] ?? null, $emergencyRequest->location_name);
                    if ($shelter) {
                        $shelter = Shelter::where('shelter_id', $shelter->shelter_id)->lockForUpdate()->first();
                        $available = $shelter->capacity - $shelter->current_occupancy;
                        if ($emergencyRequest->people_affected > $available) {
                            throw ValidationException::withMessages([
                                'status' => ["Shelter '{$shelter->shelter_name}' in {$shelter->area} has only {$available} spots available, cannot allocate {$emergencyRequest->people_affected} people."]
                            ]);
                        }
                        $shelter->current_occupancy += $emergencyRequest->people_affected;
                        if ($shelter->current_occupancy >= $shelter->capacity) {
                            $shelter->status = 'FULL';
                        }
                        $shelter->save();
                        $validated['shelter_id'] = $shelter->shelter_id;
                    }
                }
            }

            $emergencyRequest->update($validated);
            return $emergencyRequest;
        });

        $emergencyRequest->load('shelter');

        return response()->json([
            'message' => 'Emergency request updated successfully.',
            'data' => $emergencyRequest,
        ]);
    }
}