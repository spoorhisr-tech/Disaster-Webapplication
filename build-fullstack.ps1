# Build and sync fullstack React + Laravel application for Wasmer Edge deployment
$ErrorActionPreference = "Stop"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Building Fullstack App for Wasmer Edge" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendDir = Join-Path $scriptDir "frontend"
$backendAppDir = Join-Path $scriptDir "app"
$publicDir = Join-Path $backendAppDir "public"

# 1. Build Frontend
Write-Host "`n[1/3] Building React Frontend with Vite..." -ForegroundColor Yellow
Push-Location $frontendDir
npm run build
Pop-Location

# 2. Copy Dist to Laravel Public
Write-Host "`n[2/3] Syncing frontend build to Laravel public directory..." -ForegroundColor Yellow
$distDir = Join-Path $frontendDir "dist"
if (Test-Path $distDir) {
    Copy-Item -Path "$distDir\*" -Destination $publicDir -Recurse -Force
    Write-Host "  -> Synced dist files to $publicDir" -ForegroundColor Green
} else {
    Write-Error "Frontend dist directory was not generated."
}

# 3. Validation
Write-Host "`n[3/3] Validating Wasmer configuration..." -ForegroundColor Yellow
$wasmerToml = Join-Path $backendAppDir "wasmer.toml"
$appYaml = Join-Path $backendAppDir "app.yaml"
if ((Test-Path $wasmerToml) -and (Test-Path $appYaml)) {
    Write-Host "  -> wasmer.toml and app.yaml verified in $backendAppDir" -ForegroundColor Green
} else {
    Write-Warning "Wasmer configuration files missing in $backendAppDir"
}

Write-Host "`n=========================================" -ForegroundColor Green
Write-Host " Build Complete & Ready for Wasmer Deploy!" -ForegroundColor Green
Write-Host " Run the following to deploy to Wasmer Edge:" -ForegroundColor White
Write-Host "   cd app" -ForegroundColor Cyan
Write-Host "   & `"`$HOME\.wasmer\bin\wasmer.exe`" deploy" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Green

