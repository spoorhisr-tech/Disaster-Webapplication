<?php

namespace App\Http\Controllers;

use App\Models\Shelter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShelterController extends Controller
{
    // Retrieve all shelters from database
    public function index(): JsonResponse
    {
        return response()->json(Shelter::all());
    }

    // Retrieve single shelter by id
    public function show(int $id): JsonResponse
    {
        $shelter = Shelter::findOrFail($id);

        return response()->json($shelter);
    }

    // Register a new emergency shelter
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'shelter_name' => 'required|string|max:150',
            'area' => 'required|string|max:100',
            'capacity' => 'required|integer|min:1',
            'current_occupancy' => 'nullable|integer|min:0',
            'status' => 'required|in:OPEN,FULL,CLOSED',
            'contact_person' => 'nullable|string|max:100',
            'contact_phone' => 'nullable|string|max:30',
        ]);

        $validated['current_occupancy'] = $validated['current_occupancy'] ?? 0;

        $shelter = Shelter::create($validated);

        return response()->json([
            'message' => 'Shelter registered successfully.',
            'data' => $shelter,
        ], 201);
    }

    // Update shelter occupancy or status
    public function update(Request $request, int $id): JsonResponse
    {
        $shelter = Shelter::findOrFail($id);

        $validated = $request->validate([
            'shelter_name' => 'sometimes|required|string|max:150',
            'area' => 'sometimes|required|string|max:100',
            'capacity' => 'sometimes|required|integer|min:1',
            'current_occupancy' => 'sometimes|required|integer|min:0',
            'status' => 'sometimes|required|in:OPEN,FULL,CLOSED',
            'contact_person' => 'sometimes|nullable|string|max:100',
            'contact_phone' => 'sometimes|nullable|string|max:30',
        ]);

        $shelter->update($validated);

        return response()->json([
            'message' => 'Shelter updated successfully.',
            'data' => $shelter,
        ]);
    }
}
