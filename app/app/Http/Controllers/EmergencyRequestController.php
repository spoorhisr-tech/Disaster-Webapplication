<?php

namespace App\Http\Controllers;

use App\Models\EmergencyRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EmergencyRequestController extends Controller
{
    // Get all emergency requests
    public function index(): JsonResponse
    {
        $requests = EmergencyRequest::all();

        return response()->json($requests);
    }

    // Get one emergency request
    public function show(int $id): JsonResponse
    {
        $request = EmergencyRequest::findOrFail($id);

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
            'people_affected' => 'required|integer|min:1',
            'priority' => 'required|in:low,medium,high,critical',
            'requester_name' => 'required|string|max:255',
            'requester_phone' => 'nullable|string|max:30',
        ]);

        $validated['request_number'] = 'REQ-' . Str::upper(Str::random(8));
        $validated['status'] = 'pending';

        $emergencyRequest = EmergencyRequest::create($validated);

        return response()->json([
            'message' => 'Emergency request created successfully.',
            'data' => $emergencyRequest,
        ], 201);
    }
    // Update an emergency request
    public function update(Request $request, int $id): JsonResponse
    {
        $emergencyRequest = EmergencyRequest::findOrFail($id);

        $validated = $request->validate([
            'request_type' => 'sometimes|required|string|max:100',
            'description' => 'sometimes|nullable|string',
            'location_name' => 'sometimes|required|string|max:255',
            'people_affected' => 'sometimes|required|integer|min:1',
            'priority' => 'sometimes|required|in:low,medium,high,critical',
            'status' => 'sometimes|required|in:pending,approved,rejected,fulfilled',
            'requester_name' => 'sometimes|required|string|max:255',
            'requester_phone' => 'sometimes|nullable|string|max:30',
        ]);
        // Validate emergency request status transitions
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
                return response()->json([
                    'message' => 'This status transition is not allowed.',
                    'current_status' => $currentStatus,
                    'requested_status' => $newStatus,
                ], 422);
            }
        }
        $emergencyRequest->update($validated);

        return response()->json([
            'message' => 'Emergency request updated successfully.',
            'data' => $emergencyRequest,
        ]);
    }
}