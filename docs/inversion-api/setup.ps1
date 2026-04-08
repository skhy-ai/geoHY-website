# ============================================================
# GeoHY Inversion API - Development Environment Setup
# Usage: .\setup.ps1
# Requires: PowerShell 5+ on Windows
# ============================================================

$ErrorActionPreference = "Stop"
$VENV_DIR = ".venv"
$PYTHON_MIN_MINOR = 11   # 3.11+

Write-Host ""
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "       GeoHY Inversion API - Environment Setup             " -ForegroundColor Cyan
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host ""

# ── 1. Find Python 3.11+ ─────────────────────────────────────
function Find-Python {
    $candidates = @("python3.12", "python3.11", "python3", "python")
    foreach ($cmd in $candidates) {
        $exe = Get-Command $cmd -ErrorAction SilentlyContinue
        if ($exe) {
            try {
                $ver = & $cmd -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')" 2>$null
                $parts = $ver.Split(".")
                if ([int]$parts[0] -ge 3 -and [int]$parts[1] -ge $PYTHON_MIN_MINOR) {
                    return $cmd
                }
            } catch {}
        }
    }
    # Try py launcher (Windows Store / official installer)
    $pyExe = Get-Command "py" -ErrorAction SilentlyContinue
    if ($pyExe) {
        try {
            $ver = py -3 -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')" 2>$null
            $parts = $ver.Split(".")
            if ([int]$parts[0] -ge 3 -and [int]$parts[1] -ge $PYTHON_MIN_MINOR) {
                return "py -3"
            }
        } catch {}
    }
    return $null
}

$PYTHON = Find-Python
if (-not $PYTHON) {
    Write-Host "ERROR: Python 3.$PYTHON_MIN_MINOR+ not found." -ForegroundColor Red
    Write-Host "  Download from https://python.org and re-run this script." -ForegroundColor Yellow
    exit 1
}

$pyVer = & $PYTHON --version 2>&1
Write-Host "OK  Using: $PYTHON ($pyVer)" -ForegroundColor Green

# ── 2. Create virtual environment ────────────────────────────
if (Test-Path $VENV_DIR) {
    Write-Host "INFO  Virtual environment '$VENV_DIR' already exists - skipping." -ForegroundColor Yellow
} else {
    Write-Host "...   Creating virtual environment in '$VENV_DIR/'..." -ForegroundColor Cyan
    & $PYTHON -m venv $VENV_DIR
    Write-Host "OK    Virtual environment created." -ForegroundColor Green
}

# ── 3. Activate virtual environment ──────────────────────────
$activateScript = Join-Path $VENV_DIR "Scripts\Activate.ps1"
if (-not (Test-Path $activateScript)) {
    Write-Host "ERROR: Activate.ps1 not found. Delete '$VENV_DIR' and re-run." -ForegroundColor Red
    exit 1
}

Write-Host "...   Activating virtual environment..." -ForegroundColor Cyan
. $activateScript
Write-Host "OK    Activated: $env:VIRTUAL_ENV" -ForegroundColor Green

# ── 4. Upgrade pip ───────────────────────────────────────────
Write-Host "...   Upgrading pip..." -ForegroundColor Cyan
python -m pip install --quiet --upgrade pip
Write-Host "OK    pip upgraded." -ForegroundColor Green

# ── 5. Install core dependencies ─────────────────────────────
Write-Host "...   Installing core dependencies from requirements.txt..." -ForegroundColor Cyan
pip install --quiet -r requirements.txt
Write-Host "OK    Core dependencies installed." -ForegroundColor Green

# ── 6. Optionally install geophysics libs ────────────────────
$installGeo = $env:INSTALL_GEO_LIBS -eq "1"
if ($installGeo) {
    Write-Host ""
    Write-Host "...   INSTALL_GEO_LIBS=1 - installing geophysics libraries..." -ForegroundColor Magenta
    Write-Host "      (This can take 5-15 minutes. Go get a coffee.)" -ForegroundColor Gray
    pip install --quiet "SimPEG[full]==0.21.0"
    pip install --quiet "fatiando-a-terra[all]==0.7.0"
    pip install --quiet "pygimli==1.5.0"
    Write-Host "OK    Geophysics libraries installed." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "INFO  Skipping heavy geophysics libs (SimPEG / Fatiando / PyGIMLi)." -ForegroundColor Yellow
    Write-Host "      To install them, re-run with:" -ForegroundColor Gray
    Write-Host '      $env:INSTALL_GEO_LIBS="1"; .\setup.ps1' -ForegroundColor Gray
}

# ── 7. Smoke test ─────────────────────────────────────────────
Write-Host ""
Write-Host "...   Verifying FastAPI import..." -ForegroundColor Cyan
python -c "import fastapi, uvicorn, numpy; print('  OK - fastapi', fastapi.__version__)"

# ── 8. Done ───────────────────────────────────────────────────
Write-Host ""
Write-Host "===========================================================" -ForegroundColor Green
Write-Host "  Setup complete!" -ForegroundColor Green
Write-Host "===========================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Start the dev server:" -ForegroundColor White
Write-Host "    .\.venv\Scripts\Activate.ps1" -ForegroundColor Yellow
Write-Host "    uvicorn main:app --reload --port 8000" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Swagger UI: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
