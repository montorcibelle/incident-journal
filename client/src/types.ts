// Mirrors the Incident shape returned by the API
export type Incident = {
  id: number;
  title: string;
  symptom: string;
  root: string | null;
  fix: string | null;
  impact: string | null;
  tags: string[];
  createdAt: string;
};

//New Incident without id and createdAt for when request is sent
export type NewIncident = Pick<Incident, "title" | "symptom"> &
  Partial<Pick<Incident, "root" | "fix" | "impact" | "tags">>;

// AI-structured draft returned by /api/incidents/structure
export type IncidentDraft = Omit<Incident, "id" | "createdAt">;

// Form values are raw strings (tags is comma-separated, empty means null on submit)
export type DraftName = keyof NewIncident;
export type FormData = Record<DraftName | "notes", string>;
export type FieldErrors = Partial<Record<DraftName, string>>;
