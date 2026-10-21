export type IncidentRow = {
  id: number;
  title: string;
  symptom: string;
  root: string | null;
  fix: string | null;
  impact: string | null;
  tags: string; // JSON text
  createdAt: string; // aliased in SQL
};

// Same as IncidentRow, but tags is an array for the client
export type Incident = Omit<IncidentRow, "tags"> & { tags: string[] };

// What a caller sends to create one: no id/createdAt (the DB sets them), optionals can be omitted
export type NewIncident = Pick<Incident, "title" | "symptom"> &
  Partial<Pick<Incident, "root" | "fix" | "impact" | "tags">>;

export interface IncidentStore {
  create(data: NewIncident): Incident;
  get(id: number): Incident | undefined;
  list(): Incident[];
}

//Parses tags from JSON text to array to send back to the client
export const toIncident = (r: IncidentRow): Incident => ({
  ...r,
  tags: JSON.parse(r.tags),
});
