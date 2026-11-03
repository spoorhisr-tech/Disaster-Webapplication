# Wasmer Edge Deployment Hygiene
- Never generate or initialize sample Wasmer starter templates (e.g., `my-new-php-app`) inside an existing repository tree.
- When linking an existing Wasmer app, bind the exact registered `app_id` and `name` directly into the project's root `app.yaml` instead of creating nested subprojects.
- Always verify the actual assigned URL using `wasmer app list` or `wasmer app get <owner>/<name>` instead of curling tutorial placeholder URLs (such as `<subdomain>.wasmer.app`).
- Remove disposable starter templates immediately once the real project manifest is configured.

