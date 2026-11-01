<?php

namespace App\Http\Controllers;

use App\Models\Volunteer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VolunteerController extends Controller
{
    // Retrieve all volunteers from database
    public function index(): JsonResponse
    {
        return response()->json(Volunteer::all());
    }

    // Retrieve single volunteer
    public function show(int $id): JsonResponse
    {
        $volunteer = Volunteer::findOrFail($id);

        return response()->json($volunteer);
    }

    // Register a new volunteer
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'phone' => 'required|string|max:30',
            'skills' => 'required|string|max:255',
            'assigned_area' => 'required|string|max:100',
            'is_available' => 'nullable|boolean',
        ]);

        $validated['is_available'] = $validated['is_available'] ?? true;
        $validated['created_at'] = now();

        $volunteer = Volunteer::create($validated);

        return response()->json([
            'message' => 'Volunteer registered successfully.',
            'data' => $volunteer,
        ], 201);
    }

    // Update volunteer details or availability
    public function update(Request $request, int $id): JsonResponse
    {
        $volunteer = Volunteer::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:150',
            'phone' => 'sometimes|required|string|max:30',
            'skills' => 'sometimes|required|string|max:255',
            'assigned_area' => 'sometimes|required|string|max:100',
            'is_available' => 'sometimes|required|boolean',
        ]);

        $volunteer->update($validated);

        return response()->json([
            'message' => 'Volunteer updated successfully.',
            'data' => $volunteer,
        ]);
    }
}
