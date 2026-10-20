import type { Incident, IncidentDraft, NewIncident } from "./types";

type ErrorDetail = { field: string; message: string };

// Error thrown for non-2xx responses; keeps the server's per-field details
export class ApiError extends Error {
  status: number;
  details: ErrorDetail[];

  constructor(status: number, message: string, details: ErrorDetail[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

// Server errors look like { error, details?: [{ field, message }] }
async function toApiError(res: Response): Promise<ApiError> {
  const body = await res.json().catch(() => null);
  const details: ErrorDetail[] = Array.isArray(body?.details)
    ? body.details
    : [];
  const summary = body?.error ?? `Request failed (${res.status})`;
  const message = details.length
    ? details
        .map((d) => (d.field ? `${d.field}: ${d.message}` : d.message))
        .join(". ")
    : summary;
  return new ApiError(res.status, message, details);
}

// list
export async function listIncidents(): Promise<Incident[]> {
  const res = await fetch(`/api/incidents`);
  if (!res.ok) throw await toApiError(res);
  return res.json();
}

// create
export async function createIncident(data: NewIncident): Promise<Incident> {
  const res = await fetch("/api/incidents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await toApiError(res);
  return res.json();
}

// Create draft from raw notes
export async function structureNotes(text: string): Promise<IncidentDraft> {
  const res = await fetch("/api/incidents/structure", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw await toApiError(res);
  return res.json();
}
