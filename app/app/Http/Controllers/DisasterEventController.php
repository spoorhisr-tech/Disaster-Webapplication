<?php

namespace App\Http\Controllers;

use App\Models\DisasterEvent;
use Illuminate\Http\JsonResponse;

class DisasterEventController extends Controller
{
    // Get all disaster events
    public function index(): JsonResponse
    {
        return response()->json(DisasterEvent::all());
    }

    // Get one disaster event by ID
    public function show(int $id): JsonResponse
    {
        $event = DisasterEvent::findOrFail($id);

        return response()->json($event);
    }
    // Create a new disaster event
    public function store(\Illuminate\Http\Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:disaster_events,slug',
            'type' => 'required|string|max:100',
            'severity' => 'required|string',
            'status' => 'required|string',
            'description' => 'nullable|string',
            'location_name' => 'required|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'radius_km' => 'nullable|numeric|min:0',
            'affected_population' => 'nullable|integer|min:0',
            'created_by' => 'nullable|integer',
        ]);

        $event = DisasterEvent::create($validated);

        return response()->json($event, 201);
    }
    public function update(\Illuminate\Http\Request $request, int $id): JsonResponse
    {
        $event = DisasterEvent::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:disaster_events,slug,' . $id,
            'type' => 'sometimes|required|string|max:100',
            'severity' => 'sometimes|required|string',
            'status' => 'sometimes|required|string',
            'description' => 'sometimes|nullable|string',
            'location_name' => 'sometimes|required|string|max:255',
            'latitude' => 'sometimes|nullable|numeric',
            'longitude' => 'sometimes|nullable|numeric',
            'radius_km' => 'sometimes|nullable|numeric|min:0',
            'affected_population' => 'sometimes|nullable|integer|min:0',
            'created_by' => 'sometimes|nullable|integer',
        ]);

        $event->update($validated);

        return response()->json($event);
    }
    public function destroy(int $id): JsonResponse
    {
        $event = DisasterEvent::findOrFail($id);

        $event->delete();

        return response()->json([
            'message' => 'Disaster event deleted successfully'
        ]);
    }
}