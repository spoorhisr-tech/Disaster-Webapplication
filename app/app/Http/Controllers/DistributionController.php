<?php

namespace App\Http\Controllers;

use App\Models\Distribution;
use App\Models\Resource;
use App\Models\ReliefRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DistributionController extends Controller
{
    // View all distributions
    public function index(): JsonResponse
    {
        return response()->json(
            Distribution::orderByDesc('distributed_at')->get()
        );
    }

    // View one distribution
    public function show(int $id): JsonResponse
    {
        $distribution = Distribution::findOrFail($id);

        return response()->json($distribution);
    }

    // Create a distribution
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'request_id' => 'required|string|exists:requests,request_id',
            'resource_id' => 'required|integer|exists:resources,resource_id',
            'quantity_distributed' => 'required|integer|min:1',
            'notes' => 'nullable|string|max:1000',
        ]);

        $distribution = DB::transaction(function () use ($validated) {
            $reliefRequest = ReliefRequest::where(
                'request_id',
                $validated['request_id']
            )->lockForUpdate()->firstOrFail();

            if ($reliefRequest->status === 'RESOLVED') {
                throw ValidationException::withMessages([
                    'request_id' => [
                        'This request is already resolved.',
                    ],
                ]);
            }

            $resource = Resource::where(
                'resource_id',
                $validated['resource_id']
            )->lockForUpdate()->firstOrFail();

            if (
                strcasecmp(
                    trim($resource->item_name),
                    trim($reliefRequest->resource_type_needed)
                ) !== 0
            ) {
                throw ValidationException::withMessages([
                    'resource_id' => [
                        'The selected resource does not match the requested resource type.',
                    ],
                ]);
            }

            $alreadyDistributed = Distribution::where(
                'request_id',
                $validated['request_id']
            )->sum('quantity_distributed');

            $remainingQuantity =
                (int) $reliefRequest->quantity_needed
                - (int) $alreadyDistributed;

            if ($validated['quantity_distributed'] > $remainingQuantity) {
                throw ValidationException::withMessages([
                    'quantity_distributed' => [
                        "Only {$remainingQuantity} units remain to be distributed for this request.",
                    ],
                ]);
            }

            if (
                $validated['quantity_distributed']
                > (int) $resource->quantity_available
            ) {
                throw ValidationException::withMessages([
                    'quantity_distributed' => [
                        'The requested distribution exceeds available stock.',
                    ],
                ]);
            }

            $resource->quantity_available -=
                $validated['quantity_distributed'];

            $resource->last_updated = now();

            $resource->save();

            return Distribution::create([
                'request_id' => $validated['request_id'],
                'resource_id' => $validated['resource_id'],
                'quantity_distributed' =>
                    $validated['quantity_distributed'],
                'distributed_at' => now(),
                'notes' => $validated['notes'] ?? null,
            ]);
        });

        return response()->json([
            'message' => 'Distribution created successfully.',
            'data' => $distribution,
        ], 201);
    }
}