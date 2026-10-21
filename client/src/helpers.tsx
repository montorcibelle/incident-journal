import type { FieldErrors, FormData } from "./types";

// Title and symptom must be plain text: letters (any language), whitespace and
// digits and basic punctuation (. , ' ’ " - ? ! : ; ( )), with at least one
// letter so number-only values are rejected.
const textOnlyFields = ["title", "symptom"] as const;
const textOnly = /^(?=.*\p{L})[\p{L}\p{N}\s.,'’"\-?!:;()]+$/u;

export const MAX_TAGS = 5;

// Keep in sync with NOTES_MAX_LENGTH in server/helpers/schemas.ts
export const NOTES_MAX_LENGTH = 10000;

//"db, timeout, , prod" => ["db", "timeout", "prod"]
export const parseTags = (raw: string): string[] =>
  raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

export const validateForm = (data: FormData): FieldErrors => {
  const errors: FieldErrors = {};

  if (parseTags(data.tags).length > MAX_TAGS) {
    errors.tags = `Maximum ${MAX_TAGS} tags`;
  }

  for (const name of textOnlyFields) {
    const value = data[name].trim();
    const label = name === "title" ? "Title" : "Symptom";
    if (!value) errors[name] = `${label} is required`;
    else if (!textOnly.test(value))
      errors[name] = `${label} contains unsupported characters `;
  }
  return errors;
};

// SQLite stores UTC as "2026-10-21 14:30:00" => Oct 21, 2026
export const formatDate = (createdAt: string) =>
  new Date(createdAt.replace(" ", "T") + "Z").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
