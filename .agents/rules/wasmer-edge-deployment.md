# Wasmer Edge Deployment & Fullstack Sync Rules

## 1. Wasmer Package & Registry Rules
- **Immutable Package Versions**: Wasmer package registry strictly rejects re-publishing existing versions (`GraphQL API failure: version already exists`). CI/CD pipelines must auto-increment the patch version in `wasmer.toml` on every release (e.g. `0.1.$(( github.run_number + 10 ))`).
- **Headless Deployments**: Always execute `wasmer deploy --non-interactive --no-wait` in CI/CD and non-interactive scripts to prevent interactive terminal hangs.
- **Root Manifest Binding**: When linking an existing Wasmer app, bind the exact registered `app_id` and `name` directly into the project's root `app.yaml` instead of creating nested subprojects.
- **Directory Invariant**: The Wasmer package and PHP runtime live inside `app/` (`wasmer.toml`, `composer.json`, `app.yaml`). CI/CD must set working directory to `app`.

## 2. Fullstack Frontend Build & Sync
- **React Source vs Public Assets**: The React frontend source lives in `frontend/`, while Laravel and Wasmer serve static assets from `app/public/`.
- **Sync Trigger**: Whenever modifying UI components in `frontend/src/`, always run:
  ```powershell
  cd frontend
  npm run build
  Copy-Item -Path "dist/*" -Destination "../app/public" -Recurse -Force
  ```
- Do not commit stale bundles; clean obsolete asset hashes from `app/public/assets` upon rebuilding.

## 3. Remote Cloud Database Synchronization (TiDB)
- **Container Statelesness**: Wasmer Edge containers run statelessly and cannot execute interactive shell commands on demand.
- **Post-Deploy Migration Route**: Maintain a secure/protected route `/migrate-setup` in `routes/web.php` that executes `Artisan::call('migrate:fresh --seed --force')` on the live TiDB database to synchronize schema updates immediately post-deployment.

## 4. Multi-Tenant Role Boundaries
- **Citizens**: Public SOS submission and tracking by request code (`REQ-XXXXXXXX`) without account registration.
- **Volunteers**: Field responders strictly operating via the offline-capable **Android Kotlin App** via REST APIs.
- **Admins & Organizations**: Authorized coordinators operating via the Web Command Portal (`/login`) with scoped asset management (`/api/my-shelters`, `/api/my-resources`).
