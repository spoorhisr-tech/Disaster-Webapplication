<?php

namespace Database\Seeders;

use App\Models\DisasterEvent;
use App\Models\Distribution;
use App\Models\EmergencyRequest;
use App\Models\IncidentReport;
use App\Models\ReliefRequest;
use App\Models\Resource;
use App\Models\Shelter;
use App\Models\User;
use App\Models\Volunteer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with comprehensive disaster relief data.
     */
    public function run(): void
    {
        // 1. Admin & Test User
        $admin = User::firstOrCreate(
            ['email' => 'admin@disaster-relief.org'],
            [
                'name' => 'Disaster Relief Administrator',
                'password' => Hash::make('Admin@123'),
            ]
        );

        // 2. Disaster Events
        $cyclone = DisasterEvent::firstOrCreate(
            ['slug' => 'cyclone-vardah-2026'],
            [
                'title' => 'Coastal Cyclone Vardah',
                'type' => 'Cyclone',
                'severity' => 'Critical',
                'status' => 'active',
                'description' => 'Severe cyclonic storm causing heavy coastal surge, roof damage, and power disruption across the eastern coastal strip.',
                'location_name' => 'Eastern Coastal District',
                'latitude' => 13.0827,
                'longitude' => 80.2707,
                'radius_km' => 75.0,
                'affected_population' => 12500,
                'created_by' => $admin->id,
            ]
        );

        $flood = DisasterEvent::firstOrCreate(
            ['slug' => 'river-valley-flood-2026'],
            [
                'title' => 'River Valley Flash Flood',
                'type' => 'Flood',
                'severity' => 'High',
                'status' => 'active',
                'description' => 'Unprecedented rainfall led to river embankments overflowing, submerging low-lying agricultural communities and local roads.',
                'location_name' => 'Wayanad River Basin',
                'latitude' => 11.6854,
                'longitude' => 76.1320,
                'radius_km' => 45.0,
                'affected_population' => 5400,
                'created_by' => $admin->id,
            ]
        );

        $fire = DisasterEvent::firstOrCreate(
            ['slug' => 'sector-9-industrial-fire'],
            [
                'title' => 'Sector 9 Industrial Fire Incident',
                'type' => 'Fire',
                'severity' => 'Medium',
                'status' => 'contained',
                'description' => 'Chemical warehouse fire safely contained by disaster response squads; smoke dissipation and air monitoring underway.',
                'location_name' => 'Sector 9 Industrial Corridor',
                'latitude' => 12.9716,
                'longitude' => 77.5946,
                'radius_km' => 10.0,
                'affected_population' => 850,
                'created_by' => $admin->id,
            ]
        );

        // 3. Emergency Shelters
        $shelter1 = Shelter::firstOrCreate(
            ['shelter_name' => 'North District Community Hall'],
            [
                'area' => 'North District',
                'capacity' => 300,
                'current_occupancy' => 140,
                'status' => 'OPEN',
                'contact_person' => 'Robert Vance',
                'contact_phone' => '+1-555-0101',
                'created_at' => now(),
            ]
        );

        $shelter2 = Shelter::firstOrCreate(
            ['shelter_name' => 'St. Jude Emergency Relief Shelter'],
            [
                'area' => 'Coastal Zone',
                'capacity' => 500,
                'current_occupancy' => 410,
                'status' => 'OPEN',
                'contact_person' => 'Sister Maria Santos',
                'contact_phone' => '+1-555-0102',
                'created_at' => now(),
            ]
        );

        $shelter3 = Shelter::firstOrCreate(
            ['shelter_name' => 'Central High Gymnasium Evacuation Center'],
            [
                'area' => 'River Valley',
                'capacity' => 250,
                'current_occupancy' => 250,
                'status' => 'FULL',
                'contact_person' => 'Principal H. Sharma',
                'contact_phone' => '+1-555-0103',
                'created_at' => now(),
            ]
        );

        $shelter4 = Shelter::firstOrCreate(
            ['shelter_name' => 'Highland Heights Recreation Center'],
            [
                'area' => 'Highland Heights',
                'capacity' => 400,
                'current_occupancy' => 65,
                'status' => 'OPEN',
                'contact_person' => 'David Miller',
                'contact_phone' => '+1-555-0104',
                'created_at' => now(),
            ]
        );

        // 4. Warehouse Resources
        $waterRes = Resource::firstOrCreate(
            ['item_name' => 'Drinking Water Pack (10L)'],
            [
                'category' => 'Water & Hydration',
                'quantity_available' => 2800,
                'unit' => 'packs',
                'warehouse_location' => 'Central Depot A',
                'last_updated' => now(),
            ]
        );

        $foodRes = Resource::firstOrCreate(
            ['item_name' => 'Ready-to-Eat MRE Emergency Rations'],
            [
                'category' => 'Food & Nutrition',
                'quantity_available' => 4200,
                'unit' => 'meals',
                'warehouse_location' => 'Central Depot A',
                'last_updated' => now(),
            ]
        );

        $medicalRes = Resource::firstOrCreate(
            ['item_name' => 'Comprehensive Trauma First Aid Kit'],
            [
                'category' => 'Medical Supplies',
                'quantity_available' => 550,
                'unit' => 'kits',
                'warehouse_location' => 'Medical Depot B',
                'last_updated' => now(),
            ]
        );

        $blanketRes = Resource::firstOrCreate(
            ['item_name' => 'Thermal Emergency Foil Blankets'],
            [
                'category' => 'Bedding & Warmth',
                'quantity_available' => 2100,
                'unit' => 'blankets',
                'warehouse_location' => 'North Logistics Hub',
                'last_updated' => now(),
            ]
        );

        $hygieneRes = Resource::firstOrCreate(
            ['item_name' => 'Family Sanitation & Hygiene Kits'],
            [
                'category' => 'Sanitation',
                'quantity_available' => 950,
                'unit' => 'kits',
                'warehouse_location' => 'Central Depot B',
                'last_updated' => now(),
            ]
        );

        // 5. Volunteers
        $vol1 = Volunteer::firstOrCreate(
            ['phone' => '+1-555-0201'],
            [
                'name' => 'Dr. Sarah Jenkins',
                'skills' => 'Emergency Triage, Trauma Care, First Aid',
                'assigned_area' => 'Coastal Zone',
                'is_available' => true,
                'created_at' => now(),
            ]
        );

        $vol2 = Volunteer::firstOrCreate(
            ['phone' => '+1-555-0202'],
            [
                'name' => 'Michael Chang',
                'skills' => 'Boat Operations, Search & Rescue, Flood Evacuation',
                'assigned_area' => 'River Valley',
                'is_available' => true,
                'created_at' => now(),
            ]
        );

        $vol3 = Volunteer::firstOrCreate(
            ['phone' => '+1-555-0203'],
            [
                'name' => 'Amina Patel',
                'skills' => 'Warehouse Management, Heavy Vehicle Driving, Logistics',
                'assigned_area' => 'North District',
                'is_available' => false,
                'created_at' => now(),
            ]
        );

        $vol4 = Volunteer::firstOrCreate(
            ['phone' => '+1-555-0204'],
            [
                'name' => 'Carlos Rodriguez',
                'skills' => 'HAM Radio Communication, Generator Repair, Electrical',
                'assigned_area' => 'Highland Heights',
                'is_available' => true,
                'created_at' => now(),
            ]
        );

        // 6. Emergency Requests
        EmergencyRequest::firstOrCreate(
            ['request_number' => 'REQ-2026-001'],
            [
                'disaster_event_id' => $cyclone->id,
                'request_type' => 'Water & Medical',
                'description' => 'Urgent clean drinking water and oral rehydration salts needed for 60 displaced families.',
                'location_name' => 'Coastal Zone Sector 3',
                'shelter_id' => $shelter2->shelter_id,
                'people_affected' => 180,
                'priority' => 'critical',
                'status' => 'pending',
                'requester_name' => 'Marcus Holloway',
                'requester_phone' => '+1-555-0301',
            ]
        );

        EmergencyRequest::firstOrCreate(
            ['request_number' => 'REQ-2026-002'],
            [
                'disaster_event_id' => $flood->id,
                'request_type' => 'Evacuation & Rescue',
                'description' => 'Water levels rising rapidly on Lower Ridge road. 25 elderly residents need transport to Central Gym.',
                'location_name' => 'River Valley Lower Ridge',
                'shelter_id' => $shelter3->shelter_id,
                'people_affected' => 25,
                'priority' => 'critical',
                'status' => 'in_progress',
                'requester_name' => 'Elena Rostova',
                'requester_phone' => '+1-555-0302',
            ]
        );

        EmergencyRequest::firstOrCreate(
            ['request_number' => 'REQ-2026-003'],
            [
                'disaster_event_id' => $cyclone->id,
                'request_type' => 'Blankets & Food',
                'description' => 'Cold overnight conditions following cyclone landfall. 150 thermal blankets and food packs requested.',
                'location_name' => 'North District Shelter Wing',
                'shelter_id' => $shelter1->shelter_id,
                'people_affected' => 150,
                'priority' => 'medium',
                'status' => 'completed',
                'requester_name' => 'Father Francis',
                'requester_phone' => '+1-555-0303',
            ]
        );

        // 7. Relief Requests (requests table)
        ReliefRequest::firstOrCreate(
            ['request_id' => 'REQ-20261102-WTR1'],
            [
                'citizen_name' => 'Pooja Nair',
                'phone' => '+1-555-0401',
                'area' => 'Coastal Zone',
                'urgency_level' => 'HIGH',
                'resource_type_needed' => 'Drinking Water Pack (10L)',
                'quantity_needed' => 40,
                'status' => 'APPROVED',
            ]
        );

        ReliefRequest::firstOrCreate(
            ['request_id' => 'REQ-20261102-MED1'],
            [
                'citizen_name' => 'Samuel Beckett',
                'phone' => '+1-555-0402',
                'area' => 'River Valley',
                'urgency_level' => 'CRITICAL',
                'resource_type_needed' => 'Comprehensive Trauma First Aid Kit',
                'quantity_needed' => 10,
                'status' => 'PENDING',
            ]
        );

        // 8. Distributions
        Distribution::firstOrCreate(
            ['request_id' => 'REQ-20261102-WTR1'],
            [
                'resource_id' => $waterRes->resource_id,
                'quantity_distributed' => 40,
                'distributed_by_volunteer_id' => $vol1->volunteer_id,
                'distributed_at' => now(),
                'notes' => 'Successfully handed over to community representatives at North District Community Hall.',
            ]
        );

        // 9. Incident Reports
        IncidentReport::firstOrCreate(
            ['ticket_number' => 'INC-2026-001'],
            [
                'disaster_event_id' => $cyclone->id,
                'user_id' => $admin->id,
                'incident_type' => 'Infrastructure Damage',
                'urgency' => 'critical',
                'status' => 'in_progress',
                'title' => 'Coastal Highway Bridge Approach Washed Out',
                'description' => 'Heavy waves breached the culvert near Mile Marker 14. Road impassable for heavy trucks. Light vehicles diverted to East Road.',
                'location_name' => 'Coastal Highway Bridge - Mile 14',
                'latitude' => 13.1200,
                'longitude' => 80.2900,
                'reporter_name' => 'Traffic Patrol Unit 4',
                'reporter_phone' => '+1-555-0501',
                'people_affected' => 500,
                'assigned_to' => $vol3->volunteer_id,
                'verified_by' => $admin->id,
            ]
        );

        IncidentReport::firstOrCreate(
            ['ticket_number' => 'INC-2026-002'],
            [
                'disaster_event_id' => $flood->id,
                'user_id' => $admin->id,
                'incident_type' => 'Power Grid Failure',
                'urgency' => 'high',
                'status' => 'reported',
                'title' => 'Substation Transformer Submerged Under 3 Feet of Water',
                'description' => 'Local electrical substation shut down as safety precaution. Backup diesel generator requested for community clinic.',
                'location_name' => 'River Valley Substation 2',
                'latitude' => 11.6900,
                'longitude' => 76.1400,
                'reporter_name' => 'Grid Operator K. Menon',
                'reporter_phone' => '+1-555-0502',
                'people_affected' => 1200,
            ]
        );
    }
}
