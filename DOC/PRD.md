# Product Requirements Document (PRD)

## Product Overview

**Product Name:** Disaster Relief and Emergency Management System

**Description:** A centralized web application that helps coordinate emergency requests, relief resources, shelters, volunteers, and resource distribution during disasters.

**Product Vision:** To improve disaster-relief coordination by providing a single platform for managing emergency needs and available resources.

**Technology Stack:**
- Backend: Laravel (PHP)
- Database: MySQL (local development using XAMPP)
- Cloud Platform: To be finalized with the project guide and team.

## Problem

During disasters, affected people may require food, drinking water, medicines, temporary shelter, and other emergency supplies.

Managing this information separately can lead to:
- Delays in processing emergency requests.
- Difficulty tracking available relief resources.
- Poor coordination between volunteers and relief organizations.
- Inaccurate information about shelter capacity.
- Difficulty monitoring resource allocation and distribution.

The proposed system addresses these challenges by centralizing emergency requests and relief-resource information in one application.

## Goal

The primary goal is to develop a centralized system that improves the organization and tracking of disaster-relief activities.

The system aims to:
- Record and track emergency requests.
- Monitor available resources and shelter capacity.
- Allocate resources according to availability and requirements.
- Coordinate volunteers and relief activities.
- Maintain records of resource distribution.

## Target Users

- **Affected People:** Submit emergency requests and check their status, where this functionality is enabled.
- **Relief Administrators:** Manage emergency requests, resources, shelters, and volunteer assignments.
- **NGO and Relief Organization Staff:** Coordinate available supplies and relief distributions.
- **Shelter Managers:** Maintain shelter information, capacity, and occupancy.
- **Volunteers:** Receive assignments and update their assignment status, according to their permissions.

Note: The project is an academic prototype and does not represent an official integration with real government agencies or relief organizations.

## Core Features

1. **Emergency Request Management**
   - Submit and manage emergency requests.
   - Record location, required items, quantity, and urgency.
   - Generate a unique Request ID.
   - Track request status.

2. **Resource Management**
   - Add and manage relief supplies.
   - Track available resource quantities.
   - Update inventory after allocation.

3. **Resource Allocation and Distribution**
   - Match requests with available resources.
   - Prevent allocation beyond available stock.
   - Record distributions and update request status.

4. **Shelter Management**
   - Maintain shelter details and locations.
   - Track total capacity and current occupancy.
   - Identify shelters that have reached capacity.

5. **Volunteer Management**
   - Maintain volunteer information and availability.
   - Assign volunteers to relief activities.
   - Track assignment completion.

6. **Dashboard and Reports**
   - Display emergency-request summaries.
   - Show resource availability.
   - Display shelter occupancy.
   - Summarize volunteer assignments and distributions.

7. **Authentication and Authorization**
   - Restrict access to authorized users.
   - Apply role-based permissions to protected operations.
   - Validate permissions on the backend.

## User Flows

### 1. Emergency Request Submission
1. The user opens the emergency request form.
2. The user enters the required information.
3. The backend validates the submitted data.
4. The system checks for possible duplicate active requests.
5. A valid request is saved with a unique Request ID.
6. The request receives an initial status of PENDING.
7. The user or authorized staff member checks the request status.

### 2. Resource Allocation
1. An authorized staff member views pending requests.
2. The staff member checks available inventory.
3. The staff member selects a request and specifies the quantity.
4. The system verifies resource availability.
5. The system records the distribution and updates inventory.
6. The request status is updated.

### 3. Shelter Management
1. An authorized user adds or selects a shelter.
2. The user records the shelter's capacity and occupancy.
3. The user updates occupancy when necessary.
4. The system prevents occupancy from exceeding capacity.
5. The system identifies the shelter as full when capacity is reached.

### 4. Volunteer Assignment
1. An authorized user views available volunteers.
2. The user selects a volunteer and a relief activity.
3. The system checks the volunteer's availability.
4. The assignment is recorded.
5. The volunteer's availability is updated.
6. The assignment status is updated when the activity is completed.

## Requirements

### 1. Functional Requirements

- **FR-01:** The system shall allow authorized users to create and manage emergency requests.
- **FR-02:** The system shall validate all submitted request information.
- **FR-03:** The system shall generate a unique identifier for every saved request.
- **FR-04:** The system shall check for possible duplicate active requests.
- **FR-05:** The system shall maintain emergency-request statuses.
- **FR-06:** The system shall maintain resource inventory and available quantities.
- **FR-07:** The system shall prevent resource allocation beyond available stock.
- **FR-08:** The system shall record resource distributions.
- **FR-09:** The system shall maintain shelter capacity and occupancy.
- **FR-10:** The system shall maintain volunteer records and assignments.
- **FR-11:** The system shall enforce authorization for restricted operations.
- **FR-12:** The system shall provide basic summaries of requests, resources, shelters, and assignments.

### 2. User Experience Requirements

- The interface should be simple and easy to understand.
- Forms should display clear validation messages.
- Important actions should display success or error messages.
- Request statuses and resource availability should be easy to identify.
- The application should support common desktop and mobile screen sizes.

### 3. Performance and Reliability Requirements

- Common operations should complete within a reasonable time for the expected demonstration workload.
- Database operations should maintain data consistency.
- Failed operations should not leave resource quantities or distribution records inconsistent.
- The system should handle invalid inputs and expected errors gracefully.
- Sample data should be available for repeatable testing and demonstrations.

### 4. Security Requirements

- Validate user inputs on the server.
- Restrict protected operations to authorized users.
- Do not rely exclusively on frontend authorization checks.
- Store credentials and secrets in environment configuration.
- Never commit `.env` files or cloud credentials to source control.
- Use simulated data for demonstrations rather than real sensitive personal information.

### 5. Platform Requirements

- **Backend:** Laravel (PHP).
- **Database:** MySQL for local development, subject to team approval.
- **Development Environment:** Visual Studio Code and XAMPP.
- **Version Control:** Git and GitHub, according to the team's setup.
- **Frontend:** To be confirmed with the frontend team.
- **Cloud Deployment:** To be decided with the project guide and team.

The final database, authentication method, and cloud architecture must be agreed upon before implementation.

## Success Metrics

The system will be evaluated using the following criteria:

- **Request Completion:** Valid emergency requests can be submitted and assigned unique IDs.
- **Request Tracking:** Users with appropriate permissions can view request statuses.
- **Inventory Accuracy:** Resource quantities are updated correctly after allocation.
- **Allocation Safety:** The system rejects allocations exceeding available stock.
- **Shelter Capacity:** Occupancy cannot exceed the defined capacity.
- **Volunteer Coordination:** Volunteer assignments and availability are recorded correctly.
- **Data Consistency:** Related database records remain consistent after successful or failed operations.
- **Security:** Unauthorized users cannot perform restricted actions.
- **Testing:** Core workflows can be demonstrated using sample data.

## Out of Scope

The following features are excluded from the first version:

- Direct integration with real government disaster-management systems.
- Automatic verification of real NGOs or relief organizations.
- Live emergency-service dispatch.
- AI-based disaster prediction.
- Live GPS tracking of affected people or volunteers.
- Payment processing and financial accounting.
- Advanced predictive analytics.
- Complex geographic information system (GIS) functionality.
- SMS, email, or push notifications unless approved for the first version.
- Production-scale deployment for handling real disasters.

## Future Enhancements

- Notifications for emergency-request updates.
- Map-based visualization of shelters and resource locations.
- Improved resource-matching mechanisms.
- Advanced reporting and analytics.
- Integration with approved external disaster-management services.
- Enhanced cloud monitoring, backups, and recovery mechanisms.  