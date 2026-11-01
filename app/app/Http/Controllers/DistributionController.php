<?php

namespace App\Http\Controllers;

use App\Models\Distribution;
use App\Models\Resource;
use App\Models\ReliefRequest;
use App\Models\EmergencyRequest;
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
            'request_id' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    $existsInRequests = ReliefRequest::where('request_id', $value)->exists();
                    $existsInEmergency = EmergencyRequest::where('request_number', $value)->orWhere('id', $value)->exists();
                    if (!$existsInRequests && !$existsInEmergency) {
                        $fail('The selected request ID is not valid.');
                    }
                },
            ],
            'resource_id' => 'required|integer|exists:resources,resource_id',
            'quantity_distributed' => 'required|integer|min:1',
            'notes' => 'nullable|string|max:1000',
        ]);

        $distribution = DB::transaction(function () use ($validated) {
            $reliefRequest = ReliefRequest::where(
                'request_id',
                $validated['request_id']
            )->lockForUpdate()->first();

            $emergencyRequest = null;
            if (!$reliefRequest) {
                $emergencyRequest = EmergencyRequest::where('request_number', $validated['request_id'])
                    ->orWhere('id', $validated['request_id'])
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($emergencyRequest->status === 'fulfilled') {
                    throw ValidationException::withMessages([
                        'request_id' => ['This emergency request has already been fulfilled.'],
                    ]);
                }
            } else {
                if ($reliefRequest->status === 'RESOLVED') {
                    throw ValidationException::withMessages([
                        'request_id' => ['This relief request is already resolved.'],
                    ]);
                }
            }

            $resource = Resource::where(
                'resource_id',
                $validated['resource_id']
            )->lockForUpdate()->firstOrFail();

            // Check resource type matching if ReliefRequest has resource_type_needed
            if ($reliefRequest && !empty($reliefRequest->resource_type_needed)) {
                if (strcasecmp(trim($resource->item_name), trim($reliefRequest->resource_type_needed)) !== 0) {
                    throw ValidationException::withMessages([
                        'resource_id' => ['The selected resource does not match the requested resource type (' . $reliefRequest->resource_type_needed . ').'],
                    ]);
                }
            }

            $alreadyDistributed = Distribution::where(
                'request_id',
                $validated['request_id']
            )->sum('quantity_distributed');

            $totalTarget = $reliefRequest ? (int) $reliefRequest->quantity_needed : max(1, (int) $emergencyRequest->people_affected * 2);
            $remainingQuantity = $totalTarget - (int) $alreadyDistributed;

            if ($remainingQuantity > 0 && $validated['quantity_distributed'] > $remainingQuantity) {
                throw ValidationException::withMessages([
                    'quantity_distributed' => ["Only {$remainingQuantity} units remain to be distributed for this request."],
                ]);
            }

            if ($validated['quantity_distributed'] > (int) $resource->quantity_available) {
                throw ValidationException::withMessages([
                    'quantity_distributed' => ['The requested distribution exceeds available warehouse stock (' . $resource->quantity_available . ' available).'],
                ]);
            }

            $resource->quantity_available -= $validated['quantity_distributed'];
            $resource->last_updated = now();
            $resource->save();

            // Auto-update request status upon fulfillment
            if ($remainingQuantity <= $validated['quantity_distributed']) {
                if ($reliefRequest) {
                    $reliefRequest->status = 'RESOLVED';
                    $reliefRequest->save();
                }
                if ($emergencyRequest) {
                    $emergencyRequest->status = 'fulfilled';
                    $emergencyRequest->save();
                }
            }

            return Distribution::create([
                'request_id' => $validated['request_id'],
                'resource_id' => $validated['resource_id'],
                'quantity_distributed' => $validated['quantity_distributed'],
                'distributed_at' => now(),
                'notes' => $validated['notes'] ?? null,
            ]);
        });

        return response()->json([
            'message' => 'Distribution created and inventory updated successfully.',
            'data' => $distribution,
        ], 201);
    }
}