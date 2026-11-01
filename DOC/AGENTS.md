# AI Agent Instructions

## 1. Project Context

- **Project Name:** Disaster Relief and Emergency Management System
- **Purpose:** Develop a web application to coordinate emergency requests, relief resources, shelters, volunteers, and resource distributions.
- **Backend:** Laravel (PHP)
- **Local Database:** MySQL using XAMPP, subject to team approval.
- **Development Environment:** Visual Studio Code.
- **Cloud Platform:** To be confirmed with the project guide and team.

This is an academic prototype. Use simulated data unless real integrations are explicitly approved.

## 2. Before You Start

Before modifying any code:

- Read `PRD.md` to understand the project requirements.
- Read `DESIGN_SYSTEM.md` if it exists.
- Read `ARCHITECTURE.md` if it exists.
- Read `SECURITY.md` if it exists.
- Read `CLAUDE.md` if it exists.
- Inspect the existing project structure and `composer.json`.
- Inspect existing models, migrations, controllers, routes, and tests.
- Inspect existing frontend components before creating new ones.
- Verify that XAMPP MySQL is running before performing local database operations.
- Report missing documentation instead of pretending to have read it.
- Explain significant planned changes before making them.

## 3. General Rules

- Follow the existing project structure and coding conventions.
- Make small, understandable changes.
- Reuse existing functionality instead of duplicating code.
- Keep Laravel controllers focused on handling HTTP requests.
- Use Laravel Form Requests or the project's established validation approach.
- Use Eloquent models and relationships appropriately.
- Keep business logic organized in suitable service or action classes when necessary.
- Follow the API contract agreed upon with the frontend team.
- Return JSON from API endpoints.
- Use Inertia responses only if the existing application uses Inertia.
- Write tests for important functionality and bug fixes.
- Do not introduce unnecessary packages.
- Do not claim that untested functionality works.
- Never execute destructive commands without explicit approval.

## 4. Code Guidelines

### Laravel and PHP

- Follow Laravel conventions and the existing PHP style.
- Use descriptive names for classes, methods, variables, and database fields.
- Validate user input on the server.
- Handle errors with appropriate HTTP status codes and messages.
- Use database transactions for operations involving related database changes.
- Avoid hard-coded credentials and environment-specific values.
- Inspect existing files before creating duplicates.
- Maintain factories and seeders for repeatable testing.

### Emergency Request Management

- Validate location, requested items, quantity, and urgency.
- Generate a unique Request ID for every saved request.
- Maintain approved request statuses, such as `PENDING`, `APPROVED`, `ALLOCATED`, and `COMPLETED`.
- Check for possible duplicate active requests using team-approved rules.
- Do not automatically prevent new requests because a previous request was completed.

### Resource Management

- Track available resource quantities.
- Check stock before allocation.
- Never allocate more resources than are available.
- Record each distribution.
- Update inventory and create distribution records within the same database transaction.
- Prevent concurrent allocations from producing incorrect inventory quantities.

### Shelter Management

- Track shelter capacity and occupancy.
- Reject negative occupancy.
- Prevent occupancy from exceeding capacity.
- Identify shelters that have reached their capacity.

### Volunteer Management

- Check volunteer availability before assigning tasks.
- Record volunteer assignments.
- Prevent conflicting assignments according to the approved business rules.
- Update assignment status and volunteer availability consistently.

## 5. Design Rules

- Follow `DESIGN_SYSTEM.md` if it exists.
- Reuse existing layouts and components.
- Follow the existing frontend framework and design conventions.
- Do not assume React, TypeScript, Inertia, or a particular UI library without inspecting the project.
- Keep forms accessible and provide clear validation messages.
- Ensure interactive elements are keyboard accessible.
- Do not introduce a new design system without approval.

## 6. Security Rules

- Never commit `.env` files or expose passwords, API keys, tokens, or cloud credentials.
- Keep secrets in environment variables.
- Validate all external input on the server.
- Enforce authorization on the backend.
- Do not rely exclusively on frontend authorization checks.
- Use Laravel authentication, authorization, and CSRF protections where appropriate.
- Do not disable security mechanisms to make functionality work.
- Avoid exposing sensitive personal information.
- Use simulated data for demonstrations.
- Do not access production services or databases without authorization.

## 7. Database and Testing Rules

- Inspect database configuration before running database commands.
- Verify that XAMPP MySQL is running when using the local MySQL database.
- Inspect existing migrations before changing the schema.
- Keep migrations, models, factories, and seeders consistent.
- Test valid input, invalid input, authorization failures, and boundary cases.
- Test that resource allocation cannot create negative stock.
- Test that shelter occupancy cannot exceed capacity.
- Test that failed allocations do not leave inconsistent database records.

**Important:** Never run `php artisan migrate:fresh --seed` without explicit approval because it deletes existing database tables and data.

Do not reset or delete the database as a troubleshooting shortcut.

## 8. Standard Commands

### Install Dependencies

```bash
composer install