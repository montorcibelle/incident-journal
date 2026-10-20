import type Database from "better-sqlite3";
import {
  toIncident,
  type IncidentRow,
  type IncidentStore,
} from "../helpers/types.ts";

export function createIncidentStore(db: Database.Database): IncidentStore {
  const COLUMNS = `id, title, symptom, root, fix, impact, tags, created_at AS createdAt`;

  //Prepare the statement and reuse accross operations
  const insert = db.prepare(`
    INSERT INTO incidents (title, symptom, root, fix, impact, tags)
    VALUES (@title, @symptom, @root, @fix, @impact, @tags)`);

  const getById = db.prepare(`SELECT ${COLUMNS} FROM incidents WHERE id = ?`);

  const listAll = db.prepare(
    `SELECT ${COLUMNS} FROM incidents ORDER BY created_at DESC`,
  );

  return {
    async create(data) {
      const info = insert.run({
        title: data.title,
        symptom: data.symptom,
        root: data.root ?? null,
        fix: data.fix ?? null,
        impact: data.impact ?? null,
        tags: JSON.stringify(data.tags ?? []),
      });
      return toIncident(getById.get(info.lastInsertRowid) as IncidentRow);
    },

    async get(id) {
      const row = getById.get(id) as IncidentRow | undefined;
      return row ? toIncident(row) : undefined;
    },

    async list() {
      const rows = listAll.all() as IncidentRow[];
      return rows.map(toIncident);
    },
  };
}
