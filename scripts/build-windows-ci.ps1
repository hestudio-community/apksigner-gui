# Windows CI build script - Handle APPX package build interaction issues

param(
    [string]$Arch = "x64"
)

Write-Host "Starting Windows $Arch build..."

# Set environment variables
$env:CI = "true"
$env:ELECTRON_BUILDER_ARCH = $Arch
$env:ELECTRON_BUILDER_ALLOW_UNRESOLVED_DEPENDENCIES = "true"

# Disable Windows Defender real-time protection (if possible)
try {
    Set-MpPreference -DisableRealtimeMonitoring $true -ErrorAction SilentlyContinue
    Write-Host "Windows Defender real-time protection disabled"
} catch {
    Write-Host "Unable to disable Windows Defender real-time protection, continuing build..."
}

# Ensure makeappx.exe is available
$makeappxPath = Get-Command makeappx.exe -ErrorAction SilentlyContinue
if (-not $makeappxPath) {
    Write-Host "Searching for Windows SDK..."
    $windowsKits = Get-ChildItem "C:\Program Files (x86)\Windows Kits\10\bin" -Directory | Sort-Object Name -Descending
    foreach ($kit in $windowsKits) {
        $makeappxExe = Join-Path $kit.FullName "x64\makeappx.exe"
        if (Test-Path $makeappxExe) {
            $env:PATH = "$($kit.FullName)\x64;$env:PATH"
            Write-Host "Found makeappx.exe: $makeappxExe"
            break
        }
    }
}

# Run build
try {
    Write-Host "Executing npm run make..."
    npm run make
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Build completed successfully"
    } else {
        Write-Host "Build failed with exit code: $LASTEXITCODE"
        exit $LASTEXITCODE
    }
} catch {
    Write-Host "Error occurred during build: $_"
    exit 1
} finally {
    # Re-enable Windows Defender real-time protection
    try {
        Set-MpPreference -DisableRealtimeMonitoring $false -ErrorAction SilentlyContinue
        Write-Host "Windows Defender real-time protection re-enabled"
    } catch {
        Write-Host "Unable to re-enable Windows Defender real-time protection"
    }
}

Write-Host "Windows $Arch build completed"