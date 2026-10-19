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

export type NewIncident = Pick<Incident, "title" | "symptom"> &
  Partial<Pick<Incident, "root" | "fix" | "impact" | "tags">>;
