/**
 * GeoHY Inversion API Client
 * Calls the Railway-hosted FastAPI microservice.
 *
 * The base URL is set via the VITE_INVERSION_API_URL env variable:
 *  - Local dev:  http://localhost:8000   (from .env.local)
 *  - Production: https://your-app.up.railway.app   (set in Netlify Dashboard)
 *
 * If VITE_INVERSION_API_URL is not set, calls will throw and the UI
 * should show an "inversion not configured" message.
 */

const BASE_URL = import.meta.env.VITE_INVERSION_API_URL as string | undefined;

export class InversionApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'InversionApiError';
  }
}

// ── Types matching main.py Pydantic models ────────────────────────────────────

export type JobStatus = 'queued' | 'running' | 'done' | 'failed';

export interface InversionJob {
  job_id: string;
  status: JobStatus;
  inversion_type: string;
  elapsed_seconds: number | null;
  result_summary: Record<string, unknown> | null;
  error: string | null;
}

export interface ApiHealth {
  status: string;
  version: string;
  allowed_origins: string[];
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function assertConfigured(): string {
  if (!BASE_URL) {
    throw new InversionApiError(0, 'VITE_INVERSION_API_URL is not set. Configure it in Netlify environment variables.');
  }
  return BASE_URL;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body?.detail ?? detail;
    } catch {
      // ignore JSON parse error
    }
    throw new InversionApiError(res.status, detail);
  }
  return res.json() as Promise<T>;
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Check that the Railway service is reachable. */
export async function pingApi(): Promise<ApiHealth> {
  const base = assertConfigured();
  const res = await fetch(`${base}/healthz`);
  return handleResponse<ApiHealth>(res);
}

/** Submit a Bouguer gravity CSV for inversion. Returns a job_id to poll. */
export async function submitGravityInversion(csvFile: File): Promise<InversionJob> {
  const base = assertConfigured();
  const fd = new FormData();
  fd.append('file', csvFile);
  const res = await fetch(`${base}/gravity-inversion`, { method: 'POST', body: fd });
  return handleResponse<InversionJob>(res);
}

/** Submit a Magnetotelluric CSV for EM inversion. */
export async function submitEmInversion(csvFile: File): Promise<InversionJob> {
  const base = assertConfigured();
  const fd = new FormData();
  fd.append('file', csvFile);
  const res = await fetch(`${base}/em-inversion`, { method: 'POST', body: fd });
  return handleResponse<InversionJob>(res);
}

/** Submit an ERT dataset for PyGIMLi inversion. */
export async function submitErtInversion(csvFile: File): Promise<InversionJob> {
  const base = assertConfigured();
  const fd = new FormData();
  fd.append('file', csvFile);
  const res = await fetch(`${base}/ert-profile`, { method: 'POST', body: fd });
  return handleResponse<InversionJob>(res);
}

/**
 * Poll a job until it reaches 'done' or 'failed'.
 * @param jobId   Job ID returned from a submit call.
 * @param onUpdate  Called each poll cycle with the latest status.
 * @param intervalMs  Poll interval in milliseconds (default 2000).
 * @param timeoutMs   Max wait time in milliseconds (default 120_000).
 */
export async function pollJob(
  jobId: string,
  onUpdate?: (job: InversionJob) => void,
  intervalMs = 2000,
  timeoutMs = 120_000,
): Promise<InversionJob> {
  const base = assertConfigured();
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const res = await fetch(`${base}/model/${jobId}`);
    const job = await handleResponse<InversionJob>(res);
    onUpdate?.(job);

    if (job.status === 'done' || job.status === 'failed') return job;
    await new Promise((r) => setTimeout(r, intervalMs));
  }

  throw new InversionApiError(408, `Job ${jobId} timed out after ${timeoutMs / 1000}s`);
}

/** Returns true if the inversion API has been configured in this environment. */
export function isInversionApiConfigured(): boolean {
  return Boolean(import.meta.env.VITE_INVERSION_API_URL);
}
