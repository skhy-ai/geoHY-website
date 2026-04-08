#!/usr/bin/env bash
# ============================================================
# GeoHY Inversion API — Development Environment Setup
# Usage: bash setup.sh
# Compatible with: Linux, macOS, WSL, Git Bash on Windows
# ============================================================
set -e

VENV_DIR=".venv"
PYTHON_MIN="3.11"

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║        GeoHY Inversion API — Environment Setup          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# ── 1. Locate Python ─────────────────────────────────────────
find_python() {
  for cmd in python3.12 python3.11 python3 python; do
    if command -v "$cmd" &>/dev/null; then
      ver=$("$cmd" -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
      major=$(echo "$ver" | cut -d. -f1)
      minor=$(echo "$ver" | cut -d. -f2)
      if [ "$major" -ge 3 ] && [ "$minor" -ge 11 ]; then
        echo "$cmd"
        return 0
      fi
    fi
  done
  echo ""
}

PYTHON=$(find_python)
if [ -z "$PYTHON" ]; then
  echo "❌  Python ${PYTHON_MIN}+ not found. Install from https://python.org and re-run."
  exit 1
fi

echo "✅  Using Python: $PYTHON ($(${PYTHON} --version))"

# ── 2. Create virtual environment ────────────────────────────
if [ -d "$VENV_DIR" ]; then
  echo "ℹ️   Virtual environment '${VENV_DIR}' already exists — skipping creation."
else
  echo "📦  Creating virtual environment in '${VENV_DIR}/'..."
  "$PYTHON" -m venv "$VENV_DIR"
  echo "✅  Virtual environment created."
fi

# ── 3. Activate venv ─────────────────────────────────────────
if [ -f "${VENV_DIR}/bin/activate" ]; then
  # shellcheck disable=SC1091
  source "${VENV_DIR}/bin/activate"
elif [ -f "${VENV_DIR}/Scripts/activate" ]; then
  # Git Bash / MSYS2 on Windows
  # shellcheck disable=SC1091
  source "${VENV_DIR}/Scripts/activate"
else
  echo "❌  Cannot find activation script. Please activate manually."
  exit 1
fi

echo "✅  Virtual environment activated."

# ── 4. Upgrade pip ───────────────────────────────────────────
echo "⬆️   Upgrading pip..."
pip install --quiet --upgrade pip

# ── 5. Install core dependencies ─────────────────────────────
echo "📥  Installing core dependencies from requirements.txt..."
pip install --quiet -r requirements.txt
echo "✅  Core dependencies installed."

# ── 6. Optionally install geophysics libs ────────────────────
if [ "${INSTALL_GEO_LIBS:-0}" = "1" ]; then
  echo ""
  echo "🌍  INSTALL_GEO_LIBS=1 detected — installing geophysics libraries..."
  echo "    (This can take 5-15 minutes depending on network speed)"
  pip install --quiet "SimPEG[full]==0.21.0"
  pip install --quiet "fatiando-a-terra[all]==0.7.0"
  pip install --quiet "pygimli==1.5.0"
  echo "✅  Geophysics libraries installed."
else
  echo ""
  echo "ℹ️   Skipping heavy geophysics libs (SimPEG / Fatiando / PyGIMLi)."
  echo "    To install, re-run with:  INSTALL_GEO_LIBS=1 bash setup.sh"
fi

# ── 7. Smoke-test the API ─────────────────────────────────────
echo ""
echo "🔍  Verifying FastAPI import..."
python -c "import fastapi; import uvicorn; import numpy; print('  OK — fastapi', fastapi.__version__)"

# ── 8. Done ───────────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  ✅  Setup complete!                                     ║"
echo "╠══════════════════════════════════════════════════════════╣"
echo "║  Start the dev server:                                   ║"
echo "║    source .venv/bin/activate  (Linux/macOS/WSL)          ║"
echo "║    .venv\\Scripts\\activate      (Windows PowerShell)      ║"
echo "║    uvicorn main:app --reload --port 8000                 ║"
echo "║                                                          ║"
echo "║  Swagger UI → http://localhost:8000/docs                 ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
