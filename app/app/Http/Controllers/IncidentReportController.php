<?php

namespace App\Http\Controllers;

use App\Models\IncidentReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
class IncidentReportController extends Controller
{
    // Retrieve all incident reports
    public function index(): JsonResponse
    {
        $reports = IncidentReport::all();

        return response()->json($reports);
    }

    // Retrieve one incident report by ID
    public function show(int $id): JsonResponse
    {
        $report = IncidentReport::findOrFail($id);

        return response()->json($report);
    }
    // Create a new incident report
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'disaster_event_id' => 'required|integer|exists:disaster_events,id',
            'user_id' => 'nullable|integer',
            'ticket_number' => 'required|string|max:255|unique:incident_reports,ticket_number',
            'incident_type' => 'required|string|max:100',
            'urgency' => 'required|in:critical,high,medium,low',
            'status' => 'required|in:reported,verified,assigned,in_progress,resolved,dismissed',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location_name' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'reporter_name' => 'required|string|max:255',
            'reporter_phone' => 'required|string|max:30',
            'people_affected' => 'required|integer|min:0',
            'assigned_to' => 'nullable|integer',
            'verified_by' => 'nullable|integer',
            'resolution_notes' => 'nullable|string',
            'resolved_at' => 'nullable|date',
        ]);

        $report = IncidentReport::create($validated);

        return response()->json($report, 201);
    }
}