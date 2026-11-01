# Architecture

## System Overview

User
  ↓
Frontend (Framework to be confirmed)
  ↓
Laravel Backend / REST API
  ↓
MySQL Database (XAMPP - Local Development)

External Services:
- AWS Cognito → Authentication (subject to approval)
- AWS API Gateway → API access (subject to approval)
- AWS Lambda → Backend execution (subject to approval)
- Amazon RDS → Cloud database (subject to approval)
- Amazon SNS → Notifications (subject to approval)
- GitHub → Version control
- AWS CloudWatch → Monitoring (if approved)

## Project Structure

/app
  # Laravel application code
  /Http/Controllers  # API request handling
  /Models            # Eloquent database models

/routes
  # API route definitions

/database
  # Migrations, factories and seeders

/resources
  # Views and frontend resources

/public
  # Public application files

/config
  # Application configuration

/tests
  # Automated tests

/docs
  # Project documentation

## Data Flow

1. User interacts with the frontend.
2. Frontend sends an HTTP request to the Laravel API.
3. Laravel validates the submitted data.
4. Authentication and authorization are checked when configured.
5. Controllers process the request using Eloquent models.
6. MySQL stores or retrieves the required data.
7. Laravel returns a JSON response to the frontend.
8. The frontend displays success, loading, empty, or error states.

## Core Modules

- Disaster Event Management
- Emergency Request Management
- Incident Report Management
- Resource Management
- Resource Allocation and Distribution
- Shelter Management
- Volunteer Management
- Dashboard and Reports

## Local Development

- Backend: Laravel (PHP)
- Database: MySQL
- Local Database Environment: XAMPP
- Development Environment: Visual Studio Code
- API Format: REST with JSON
- API Testing: Browser and PowerShell/API testing tools
- Version Control: Git and GitHub, according to team setup

## Cloud Deployment

The final cloud architecture must be confirmed with the project guide
and team before implementation.

Potential AWS services:

- Amazon Cognito → Authentication
- Amazon API Gateway → API access
- AWS Lambda → Backend execution, if compatible with the approved design
- Amazon RDS → Managed MySQL database
- Amazon SNS → Notifications
- AWS CloudWatch → Monitoring

These services are proposed options and are not considered implemented
until configured and tested.

Laravel and AWS Lambda require a compatible deployment approach.
The final backend hosting method must be confirmed before migration.

## Security

- Validate incoming data on the backend.
- Enforce authorization for protected operations.
- Store credentials in environment variables.
- Never commit .env files or cloud credentials.
- Use simulated data for demonstrations.
- Preserve existing database records during development.

## Testing

- Test API endpoints with valid and invalid inputs.
- Test database operations.
- Test missing records and duplicate identifiers.
- Verify inventory and shelter capacity rules.
- Test authorization when authentication is implemented.
- Confirm failed operations do not leave inconsistent data.