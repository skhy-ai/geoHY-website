# geohy-inversion-api

Python FastAPI microservice for GeoHY geophysical inversion. Deploys on Railway.app.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/healthz` | Liveness check |
| `POST` | `/gravity-inversion` | Submit Bouguer gravity CSV for SimPEG inversion |
| `POST` | `/em-inversion` | Submit MT sounding CSV for SimPEG 1-D EM inversion |
| `POST` | `/ert-profile` | Submit ERT dataset for PyGIMLi 2-D inversion |
| `GET` | `/model/{job_id}` | Poll for job result |
| `GET` | `/jobs` | List all running/completed jobs |

Interactive docs at `/docs` (Swagger UI) after deployment.

## CSV Formats

### Gravity (`/gravity-inversion`)
```
lat,lon,elevation_m,bouguer_mgal
37.12,-122.45,120,-25.3
...
```

### Magnetotellurics (`/em-inversion`)
```
station_id,frequency_hz,apparent_resistivity_ohm_m,phase_deg
S01,0.001,2500,45.2
...
```

### ERT (`/ert-profile`)
```
electrode_id,x_m,z_m,resistance_ohm
E01,0,0,0
E02,5,0,0
...
```

## Railway Deployment

1. Create a new Railway project
2. Add a service → "Deploy from GitHub" → select this repo
3. Set the root directory to `docs/inversion-api`
4. Railway auto-detects Python via Nixpacks
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## Local Development

```bash
cd docs/inversion-api
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Visit `http://localhost:8000/docs` for interactive API explorer.

## OSS Libraries

| Library | Use Case |
|---------|----------|
| **SimPEG** | Gravity, gravity-gradient, DC/IP, EM, magnetics inversion |
| **Fatiando a Terra** | Gravity processing (Harmonica), spatial gridding (Verde) |
| **PyGIMLi** | ERT, seismic refraction, 2D/3D FEM inversion |
| **bayes-bay** | Bayesian MCMC uncertainty quantification |
