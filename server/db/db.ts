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

  `);

  return db;
};
