<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ResourceController extends Controller
{
    // View all resources
    public function index(): JsonResponse
    {
        return response()->json(Resource::all());
    }

    // View one resource
    public function show(int $id): JsonResponse
    {
        $resource = Resource::findOrFail($id);

        return response()->json($resource);
    }

    // Add a new resource
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'item_name' => 'required|string|max:100',
            'category' => 'required|string|max:50',
            'quantity_available' => 'required|integer|min:0',
            'unit' => 'nullable|string|max:20',
            'warehouse_location' => 'required|string|max:100',
        ]);

        $resource = Resource::create($validated);

        return response()->json([
            'message' => 'Resource added successfully.',
            'data' => $resource,
        ], 201);
    }

    // Update a resource
    public function update(Request $request, int $id): JsonResponse
    {
        $resource = Resource::findOrFail($id);

        $validated = $request->validate([
            'item_name' => 'sometimes|required|string|max:100',
            'category' => 'sometimes|required|string|max:50',
            'quantity_available' => 'sometimes|required|integer|min:0',
            'unit' => 'sometimes|nullable|string|max:20',
            'warehouse_location' => 'sometimes|required|string|max:100',
        ]);

        $resource->update($validated);

        return response()->json([
            'message' => 'Resource updated successfully.',
            'data' => $resource,
        ]);
    }
}