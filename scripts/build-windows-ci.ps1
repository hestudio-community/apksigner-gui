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

# Ensure Windows SDK tools are available
$makeappxPath = Get-Command makeappx.exe -ErrorAction SilentlyContinue
if (-not $makeappxPath) {
    Write-Host "Searching for Windows SDK..."
    
    # Common Windows SDK paths
    $sdkPaths = @(
        "C:\Program Files (x86)\Windows Kits\10\bin",
        "C:\Program Files\Windows Kits\10\bin"
    )
    
    foreach ($sdkPath in $sdkPaths) {
        if (Test-Path $sdkPath) {
            $windowsKits = Get-ChildItem $sdkPath -Directory | Sort-Object Name -Descending
            foreach ($kit in $windowsKits) {
                $makeappxExe = Join-Path $kit.FullName "x64\makeappx.exe"
                $makecertExe = Join-Path $kit.FullName "x64\makecert.exe"
                
                if ((Test-Path $makeappxExe) -and (Test-Path $makecertExe)) {
                    $kitBinPath = Join-Path $kit.FullName "x64"
                    $env:PATH = "$kitBinPath;$env:PATH"
                    Write-Host "Found Windows SDK tools in: $kitBinPath"
                    Write-Host "makeappx.exe: $makeappxExe"
                    Write-Host "makecert.exe: $makecertExe"
                    break
                }
            }
            if ($makeappxPath) { break }
        }
    }
    
    # Verify tools are now available
    $makeappxPath = Get-Command makeappx.exe -ErrorAction SilentlyContinue
    if (-not $makeappxPath) {
        Write-Host "Warning: Windows SDK tools not found. APPX build may fail."
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