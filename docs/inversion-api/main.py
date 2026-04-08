"""
GeoHY Inversion API — FastAPI microservice for geophysical inversion.
Deploy on Railway.app: https://railway.app

Architecture:
  - POST /gravity-inversion  → SimPEG gravity inversion
  - POST /em-inversion       → SimPEG MT/EM inversion
  - POST /ert-profile        → PyGIMLi ERT profile
  - GET  /model/{job_id}     → Retrieve a completed model result
  - GET  /healthz            → Health check

Inversion jobs are run asynchronously with BackgroundTasks.
Results are stored in a simple in-memory dict (swap for Redis/Supabase in prod).
"""

from __future__ import annotations

import io
import os
import uuid
import csv
import time
import logging
from typing import Literal, Any
from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Load .env in local dev (no-op if python-dotenv is not installed / file missing)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# ── Logger ────────────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO, format="%(levelname)s  %(message)s")
log = logging.getLogger("geohy-api")

# ── App Setup ─────────────────────────────────────────────────────────────────
app = FastAPI(
    title="GeoHY Inversion API",
    description="Geophysical inversion microservice for lithospheric hydrogen exploration.",
    version="0.1.0",
)

# ALLOWED_ORIGINS is a comma-separated list set as a Railway env variable.
# Example Railway value: https://geohyenergy.com,https://www.geohyenergy.com
# Falls back to localhost dev server if not set.
_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:8080,http://localhost:5173")
ALLOWED_ORIGINS: list[str] = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    allow_credentials=True,
)

log.info("CORS allowed origins: %s", ALLOWED_ORIGINS)

# ── In-memory job store (replace with Supabase row in production) ─────────────
JOB_STORE: dict[str, dict[str, Any]] = {}

InversionType = Literal["gravity", "em_mt", "ert", "seismic_vp"]


# ── Pydantic Models ────────────────────────────────────────────────────────────
class JobStatus(BaseModel):
    job_id: str
    status: Literal["queued", "running", "done", "failed"]
    inversion_type: str
    elapsed_seconds: float | None = None
    result_summary: dict | None = None
    error: str | None = None


class HealthResponse(BaseModel):
    status: str
    version: str
    allowed_origins: list[str]


# ── Helper: parse uploaded CSV ─────────────────────────────────────────────────
def parse_survey_csv(content: bytes) -> list[dict]:
    text = content.decode("utf-8")
    reader = csv.DictReader(io.StringIO(text))
    return list(reader)


# ── Background worker: gravity inversion (SimPEG) ─────────────────────────────
def run_gravity_inversion(job_id: str, rows: list[dict]) -> None:
    JOB_STORE[job_id]["status"] = "running"
    t0 = time.time()
    try:
        import numpy as np

        # TODO: Replace stub with real SimPEG inversion
        # from SimPEG import maps, data_misfit, regularization, optimization, inverse_problem, inversion
        # from SimPEG.potential_fields import gravity

        # Stub: compute a placeholder Bouguer anomaly statistic
        obs = [float(r.get("bouguer_mgal", 0)) for r in rows if "bouguer_mgal" in r]
        if not obs:
            raise ValueError("CSV must contain a 'bouguer_mgal' column.")

        arr = np.array(obs)
        result = {
            "n_observations": len(arr),
            "bouguer_mean_mgal": float(np.mean(arr)),
            "bouguer_std_mgal": float(np.std(arr)),
            "anomaly_range_mgal": float(arr.max() - arr.min()),
            "target_density_contrast": "+0.7 g/cm³ (Predicted pristine peridotite)",
            "note": "Stub result — SimPEG inversion not yet connected.",
        }

        JOB_STORE[job_id]["status"] = "done"
        JOB_STORE[job_id]["result_summary"] = result
    except Exception as exc:
        log.exception("Gravity inversion failed for job %s", job_id)
        JOB_STORE[job_id]["status"] = "failed"
        JOB_STORE[job_id]["error"] = str(exc)
    finally:
        JOB_STORE[job_id]["elapsed_seconds"] = round(time.time() - t0, 3)


# ── Background worker: EM / MT inversion (SimPEG) ─────────────────────────────
def run_em_inversion(job_id: str, rows: list[dict]) -> None:
    JOB_STORE[job_id]["status"] = "running"
    t0 = time.time()
    try:
        import numpy as np

        freqs = [float(r.get("frequency_hz", 0)) for r in rows if "frequency_hz" in r]
        resistivities = [float(r.get("apparent_resistivity_ohm_m", 0)) for r in rows]

        if not freqs:
            raise ValueError("CSV must contain 'frequency_hz' and 'apparent_resistivity_ohm_m' columns.")

        arr = np.array(resistivities)
        result = {
            "n_stations": len(arr),
            "mean_app_resistivity_ohm_m": float(np.mean(arr)),
            "frequency_range_hz": f"{min(freqs):.4f} – {max(freqs):.2f}",
            "target_interpretation": "High resistivity (>1000 Ω·m) = pristine ultramafic. Low (<50 Ω·m) = altered serpentinite.",
            "note": "Stub result — SimPEG EM1D inversion not yet connected.",
        }

        JOB_STORE[job_id]["status"] = "done"
        JOB_STORE[job_id]["result_summary"] = result
    except Exception as exc:
        log.exception("EM inversion failed for job %s", job_id)
        JOB_STORE[job_id]["status"] = "failed"
        JOB_STORE[job_id]["error"] = str(exc)
    finally:
        JOB_STORE[job_id]["elapsed_seconds"] = round(time.time() - t0, 3)


# ── Background worker: ERT profile (PyGIMLi) ─────────────────────────────────
def run_ert_inversion(job_id: str, rows: list[dict]) -> None:
    JOB_STORE[job_id]["status"] = "running"
    t0 = time.time()
    try:
        # TODO: connect PyGIMLi ERT inversion
        # import pygimli as pg
        # from pygimli.physics import ert
        result = {
            "n_electrodes": len(rows),
            "profile_length_m": len(rows) * 5,
            "estimated_depth_m": len(rows) * 5 * 0.3,
            "note": "Stub result — PyGIMLi ERT inversion scaffold ready.",
        }
        JOB_STORE[job_id]["status"] = "done"
        JOB_STORE[job_id]["result_summary"] = result
    except Exception as exc:
        JOB_STORE[job_id]["status"] = "failed"
        JOB_STORE[job_id]["error"] = str(exc)
    finally:
        JOB_STORE[job_id]["elapsed_seconds"] = round(time.time() - t0, 3)


# ── Route: root (Railway health probe + browser landing) ─────────────────────
@app.get("/", tags=["System"])
def root() -> dict:
    """Root endpoint — Railway uses this as its default health probe."""
    return {"service": "geohy-inversion-api", "status": "ok", "version": app.version, "docs": "/docs"}


# ── Route: health check ────────────────────────────────────────────────────────
@app.get("/healthz", response_model=HealthResponse, tags=["System"])
def health_check() -> HealthResponse:
    return HealthResponse(status="ok", version=app.version, allowed_origins=ALLOWED_ORIGINS)


# ── Route: gravity inversion ───────────────────────────────────────────────────
@app.post("/gravity-inversion", response_model=JobStatus, tags=["Inversion"])
async def start_gravity_inversion(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(..., description="CSV with columns: lat, lon, elevation_m, bouguer_mgal"),
) -> JobStatus:
    """
    Submit a Bouguer gravity anomaly CSV for background inversion.
    Returns a job_id to poll with GET /model/{job_id}.
    """
    content = await file.read()
    rows = parse_survey_csv(content)
    job_id = str(uuid.uuid4())
    JOB_STORE[job_id] = {"status": "queued", "inversion_type": "gravity", "elapsed_seconds": None}
    background_tasks.add_task(run_gravity_inversion, job_id, rows)
    log.info("Queued gravity inversion job %s (%d rows)", job_id, len(rows))
    return JobStatus(job_id=job_id, status="queued", inversion_type="gravity")


# ── Route: EM/MT inversion ─────────────────────────────────────────────────────
@app.post("/em-inversion", response_model=JobStatus, tags=["Inversion"])
async def start_em_inversion(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(..., description="CSV with columns: station_id, frequency_hz, apparent_resistivity_ohm_m, phase_deg"),
) -> JobStatus:
    """Submit a Magnetotelluric sounding CSV for background 1-D EM inversion."""
    content = await file.read()
    rows = parse_survey_csv(content)
    job_id = str(uuid.uuid4())
    JOB_STORE[job_id] = {"status": "queued", "inversion_type": "em_mt", "elapsed_seconds": None}
    background_tasks.add_task(run_em_inversion, job_id, rows)
    log.info("Queued EM inversion job %s (%d rows)", job_id, len(rows))
    return JobStatus(job_id=job_id, status="queued", inversion_type="em_mt")


# ── Route: ERT profile ─────────────────────────────────────────────────────────
@app.post("/ert-profile", response_model=JobStatus, tags=["Inversion"])
async def start_ert_inversion(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(..., description="CSV with electrode positions and resistance measurements"),
) -> JobStatus:
    """Submit an ERT Wenner/Schlumberger dataset for PyGIMLi 2-D inversion."""
    content = await file.read()
    rows = parse_survey_csv(content)
    job_id = str(uuid.uuid4())
    JOB_STORE[job_id] = {"status": "queued", "inversion_type": "ert", "elapsed_seconds": None}
    background_tasks.add_task(run_ert_inversion, job_id, rows)
    log.info("Queued ERT inversion job %s (%d rows)", job_id, len(rows))
    return JobStatus(job_id=job_id, status="queued", inversion_type="ert")


# ── Route: retrieve model result ───────────────────────────────────────────────
@app.get("/model/{job_id}", response_model=JobStatus, tags=["Inversion"])
def get_model(job_id: str) -> JobStatus:
    """Poll for an inversion job result by its job_id."""
    job = JOB_STORE.get(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail=f"Job '{job_id}' not found.")
    return JobStatus(job_id=job_id, **job)


# ── Route: list all jobs (admin) ───────────────────────────────────────────────
@app.get("/jobs", tags=["System"])
def list_jobs() -> dict:
    return {"jobs": list(JOB_STORE.keys()), "total": len(JOB_STORE)}
