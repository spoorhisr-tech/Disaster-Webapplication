<?php

namespace App\Http\Controllers;

use App\Models\ReliefRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ReliefRequestController extends Controller
{
    // Retrieve all relief requests from the database
    public function index(): JsonResponse
    {
        return response()->json(
            ReliefRequest::orderByDesc('created_at')->get()
        );
    }

    // Retrieve single request by ID
    public function show(string $id): JsonResponse
    {
        $request = ReliefRequest::findOrFail($id);

        return response()->json($request);
    }

    // Submit a new relief request to the database
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'citizen_name' => 'required|string|max:150',
            'phone' => 'required|string|max:30',
            'area' => 'required|string|max:100',
            'urgency_level' => 'required|in:HIGH,MEDIUM,LOW,CRITICAL',
            'resource_type_needed' => 'required|string|max:100',
            'quantity_needed' => 'required|integer|min:1',
        ]);

        $validated['request_id'] = 'REQ-' . date('Ymd') . '-' . Str::upper(Str::random(4));
        $validated['status'] = 'PENDING';

        $reliefRequest = ReliefRequest::create($validated);

        return response()->json([
            'message' => 'Relief request recorded successfully.',
            'data' => $reliefRequest,
        ], 201);
    }

    // Update status
    public function update(Request $request, string $id): JsonResponse
    {
        $reliefRequest = ReliefRequest::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:PENDING,APPROVED,RESOLVED,REJECTED',
        ]);

        $reliefRequest->update($validated);

        return response()->json([
            'message' => 'Relief request status updated successfully.',
            'data' => $reliefRequest,
        ]);
    }
}
