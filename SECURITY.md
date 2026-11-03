# Security Policy and Guidelines

## 1. Overview and Security Objectives

The **Disaster Relief and Emergency Management System** coordinates sensitive real-time disaster event data, victim emergency requests, shelter capacities, volunteer deployments, and warehouse aid distribution. 

Because disaster relief software frequently handles sensitive Personally Identifiable Information (PII) of vulnerable populations during crisis situations, maintaining high standards of data confidentiality, system integrity, and service availability is critical.

This document details the security architecture, threat model, safe development practices, credential hygiene, and vulnerability reporting procedures for the project.

---

## 2. Threat Model and Risk Assessment

| Risk Vector | Threat Description | Mitigation in System |
| :--- | :--- | :--- |
| **PII Exposure** | Unauthorized harvesting of disaster victims' contact numbers, physical locations, or health needs. | Endpoint authorization checks, masked reporter phone numbers on public feeds, strict role-based access control. |
| **Data Tampering & Hoaxes** | Submission of fraudulent disaster events, false emergency requests, or fictitious shelter closures to divert relief aid. | Status workflow verification (`reported` → `verified` → `assigned`), rate limiting, authenticated administrative approvals. |
| **Resource Hoarding / Manipulation** | Unauthorized manipulation of warehouse inventory quantities or aid distribution logs. | Database transactions (`DB::transaction`) with row-level locks (`lockForUpdate`), audit logs, validated volunteer ID linkage. |
| **Denial of Service (DoS)** | Volumetric request flooding against the API during disaster events disabling rescue coordination. | API rate limiting (`throttle:api`), static asset offloading to edge CDN (Wasmer Edge / Vercel), lightweight WASI sandboxing. |
| **Credential & Secret Leaks** | Accidental commit of database passwords, API tokens, or session signing keys to public version control. | Automated `.gitignore` enforcement, separation of `.env` from codebase, Wasmer Edge runtime secret injection. |

---

## 3. Authentication and Access Control

### 3.1 Authentication Architecture
- **API Token Authentication**: Managed via Laravel Sanctum (`personal_access_tokens` table) using cryptographically secure SHA-256 hashed bearer tokens.
- **Session Security**: Session cookies must use `HttpOnly`, `SameSite=Lax`, and `Secure` attributes in production environments.
- **Password Policy**: User passwords must be hashed using `bcrypt` with a minimum cost factor of 12 (configured via `BCRYPT_ROUNDS=12` in `.env`). Plaintext passwords must never be logged or transmitted in API responses.

### 3.2 Role-Based Access Control (RBAC)
The application differentiates between distinct user scopes:
1. **Public / Affected Citizens**:
   - Permitted to submit emergency relief requests and public incident reports.
   - Restricted to reading aggregate or anonymized disaster event feeds.
   - Forbidden from viewing internal inventory, volunteer contact books, or unverified reports.
2. **Volunteers**:
   - Authenticated access to assigned disaster zones, shelter assignments, and distribution execution tasks.
   - Read-only access to needed supplies for assigned tasks.
3. **Shelter & Logistics Managers**:
   - Full management over assigned shelter capacity, occupancy counts, and incoming warehouse resource stock.
4. **Relief System Administrators**:
   - Full read/write authority across disaster declarations, incident verification, system users, and audit logs.

---

## 4. Application Security Controls

### 4.1 SQL Injection Prevention
- All database queries must use **Laravel Eloquent ORM** or **PDO Parameter Binding** with Query Builder.
- Raw SQL expressions (`DB::raw()`) must never accept unsanitized user input directly.
- Table migrations enforce strict foreign key constraints and type-safe schema definitions.

### 4.2 Cross-Site Scripting (XSS) Prevention
- Frontend components built with React automatically encode and escape dynamic content inserted into JSX.
- Avoid all usage of `dangerouslySetInnerHTML`.
- All JSON responses emitted from Laravel controllers use standard UTF-8 JSON serialization (`response()->json(...)`), escaping dangerous characters by default.

### 4.3 Mass Assignment Protection
- All Eloquent models (`DisasterEvent`, `EmergencyRequest`, `Shelter`, `Resource`, etc.) explicitly declare guarded or fillable fields using `$fillable`.
- Controllers must strictly validate input payloads using Laravel Form Requests or explicit `$request->validate([...])` arrays prior to passing data into `Model::create()` or `Model::update()`.

### 4.4 Cross-Origin Resource Sharing (CORS)
- CORS must be restricted to approved frontend origins (e.g., `https://disaster-relief-fullstack.wasmer.app`, `https://dmswebapp.vercel.app`, or `http://localhost:3000` in development).
- Wildcard origin (`*`) with credentials enabled is explicitly prohibited.

### 4.5 Rate Limiting and Anti-Abuse
- Public API endpoints (such as `POST /api/emergency-requests` and `POST /api/incident-reports`) must be protected by Laravel's built-in `throttle` middleware to prevent spamming and automated abuse.
- Standard default policy: 60 requests per minute per IP for authenticated routes; 15 submissions per minute for public emergency dispatch routes.

---

## 5. Infrastructure and Cloud Deployment Security

### 5.1 Environment and Secrets Management
- The `.env` file contains sensitive environment-specific credentials and must **never** be committed to Git.
- Keep `.env.example` scrubbed of real production secrets, API keys, or database credentials.
- When deploying to **Wasmer Edge**, utilize Wasmer's native secret storage (`wasmer app secrets create ...`) or automated managed capability variables (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`).

### 5.2 Production Hardening
- **Debug Mode**: `APP_DEBUG` must be set to `false` in production. Leaving `APP_DEBUG=true` in production risks exposing database connection strings, server paths, and stack traces.
- **Error Handling**: Exceptions in production must log to secure application log files (`storage/logs/laravel.log` or stderr stream in containers) and present generic JSON error envelopes to consumers:
  ```json
  {
    "message": "An unexpected server error occurred. Please contact relief coordination support."
  }
  ```
- **HTTPS Enforcement**: All web traffic must be served exclusively over TLS 1.3 / HTTPS. HTTP requests should automatically redirect with HTTP 301.

### 5.3 Wasmer Edge WebAssembly Sandboxing
- The application runtime on Wasmer Edge is executed within a WASI-isolated WebAssembly sandbox.
- File system access is restricted to the `/app/public` directory and specified storage mounts.
- Outbound network requests are constrained to configured database connections and authorized cloud services.

---

## 6. Secure Development Guidelines for Contributors

Before submitting pull requests or modifying backend code:

1. **Input Validation**: Never trust incoming HTTP data. Validate types, string lengths, ranges, and existence against the database (`exists:` and `unique:` rules).
2. **Transaction Integrity**: When modifying inventory counts alongside distribution records or relief request status, wrap operations in `DB::transaction()` to avoid race conditions and orphan records.
3. **Log Sanitization**: Do not write sensitive user tokens, passwords, full credit card numbers, or medical notes into application logs.
4. **Dependency Auditing**: Regularly run dependency vulnerability audits:
   ```bash
   composer audit
   npm audit
   ```
5. **No Dangerous PHP Functions**: Avoid `eval()`, `exec()`, `passthru()`, `shell_exec()`, or `unserialize()` with untrusted input.

---

## 7. Vulnerability Reporting and Disclosure

If you discover a security vulnerability within this project, please follow these guidelines:

### How to Report
- **Do not open a public GitHub issue** for undisclosed security vulnerabilities.
- Report the vulnerability privately to the project development and security leads:
  - **Email**: `security@disaster-relief.org` (or contact repository administrators via private advisory)
  - Include detailed reproduction steps, proof of concept (PoC), and affected endpoints or components.

### Response Timelines
- **Initial Acknowledgment**: Within 48 hours of report submission.
- **Triage and Assessment**: Within 5 business days confirming severity and impact.
- **Remediation & Patch**: Target release within 14 business days depending on vulnerability severity.
- **Public Disclosure**: Coordinated after fixes have been deployed and verified across live environments.
