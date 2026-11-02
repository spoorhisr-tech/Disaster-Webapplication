#!/usr/bin/env bash
set -e

echo "========================================="
echo " Building Fullstack App for Wasmer Edge"
echo "========================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
BACKEND_APP_DIR="$SCRIPT_DIR/app"
PUBLIC_DIR="$BACKEND_APP_DIR/public"

# 1. Build Frontend
echo ""
echo "[1/3] Building React Frontend with Vite..."
cd "$FRONTEND_DIR"
npm run build

# 2. Copy Dist to Laravel Public
echo ""
echo "[2/3] Syncing frontend build to Laravel public directory..."
cp -r "$FRONTEND_DIR/dist/"* "$PUBLIC_DIR/"
echo "  -> Synced dist files to $PUBLIC_DIR"

# 3. Validation
echo ""
echo "[3/3] Validating Wasmer configuration..."
if [ -f "$BACKEND_APP_DIR/wasmer.toml" ] && [ -f "$BACKEND_APP_DIR/app.yaml" ]; then
    echo "  -> wasmer.toml and app.yaml verified in $BACKEND_APP_DIR"
fi

echo ""
echo "========================================="
echo " Build Complete & Ready for Wasmer Deploy!"
echo " Run the following to deploy to Wasmer Edge:"
echo "   cd app"
echo "   wasmer deploy"
echo "========================================="

