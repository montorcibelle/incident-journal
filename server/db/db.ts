import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

export const openDb = (
  path = process.env.DB_PATH ?? "./data/incidents.db",
): Database.Database => {
  if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true }); //checks if db file is created if not create one

  const db = new Database(path);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  //Runs all the comands at once
  db.exec(`
    CREATE TABLE IF NOT EXISTS incidents (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      title      TEXT NOT NULL,
      symptom    TEXT NOT NULL,
      root TEXT,
      fix        TEXT,
      impact     TEXT,
      tags       TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS incidents_fts USING fts5(
      title, symptom,
      content='incidents', content_rowid='id'
    );

    CREATE TRIGGER IF NOT EXISTS incidents_ai AFTER INSERT ON incidents BEGIN
      INSERT INTO incidents_fts(rowid, title, symptom)
      VALUES (new.id, new.title, new.symptom);
    END;

    CREATE TRIGGER IF NOT EXISTS incidents_ad AFTER DELETE ON incidents BEGIN
      INSERT INTO incidents_fts(incidents_fts, rowid, title, symptom)
      VALUES ('delete', old.id, old.title, old.symptom);
    END;

    CREATE TRIGGER IF NOT EXISTS incidents_au AFTER UPDATE ON incidents BEGIN
      INSERT INTO incidents_fts(incidents_fts, rowid, title, symptom)
      VALUES ('delete', old.id, old.title, old.symptom);
      INSERT INTO incidents_fts(rowid, title, symptom)
      VALUES (new.id, new.title, new.symptom);
    END;
  `);

  return db;
};
