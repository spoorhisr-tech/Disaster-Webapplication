<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\Shelter;
use App\Models\Resource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrganizationController extends Controller
{
    /**
     * List all organizations.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Organization::query();

        if ($request->has('type')) {
            $query->where('type', $request->query('type'));
        }

        if ($request->has('area')) {
            $query->where('area', 'like', '%' . $request->query('area') . '%');
        }

        $organizations = $query->withCount(['shelters', 'resources'])->orderBy('name')->get();

        return response()->json($organizations);
    }

    /**
     * Get a single organization with its shelters and resources.
     */
    public function show(int $id): JsonResponse
    {
        $organization = Organization::with(['shelters', 'resources'])->findOrFail($id);

        return response()->json($organization);
    }

    /**
     * Register a new organization.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:200',
            'type' => 'required|in:ngo,hospital,government,rescue_agency',
            'registration_number' => 'required|string|max:100|unique:organizations,registration_number',
            'email' => 'required|email|max:150|unique:organizations,email',
            'phone' => 'required|string|max:30',
            'area' => 'required|string|max:100',
            'description' => 'nullable|string|max:1000',
        ]);

        $validated['status'] = 'active';

        $organization = Organization::create($validated);

        return response()->json([
            'message' => 'Organization registered successfully.',
            'data' => $organization,
        ], 201);
    }

    /**
     * Update organization details.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $organization = Organization::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:200',
            'type' => 'sometimes|required|in:ngo,hospital,government,rescue_agency',
            'phone' => 'sometimes|required|string|max:30',
            'area' => 'sometimes|required|string|max:100',
            'status' => 'sometimes|required|in:active,pending_verification,suspended',
            'description' => 'nullable|string|max:1000',
        ]);

        $organization->update($validated);

        return response()->json([
            'message' => 'Organization updated successfully.',
            'data' => $organization,
        ]);
    }

    /**
     * Get shelters belonging to the logged-in user's organization.
     */
    public function myShelters(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user || !$user->organization_id) {
            return response()->json(['message' => 'User does not belong to an organization.'], 403);
        }

        $shelters = Shelter::where('organization_id', $user->organization_id)->get();

        return response()->json($shelters);
    }

    /**
     * Get warehouse resources belonging to the logged-in user's organization.
     */
    public function myResources(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user || !$user->organization_id) {
            return response()->json(['message' => 'User does not belong to an organization.'], 403);
        }

        $resources = Resource::where('organization_id', $user->organization_id)->get();

        return response()->json($resources);
    }
}

