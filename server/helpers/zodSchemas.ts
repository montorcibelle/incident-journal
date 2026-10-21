import { z } from "zod";

// Optional text field: trimmed, and empty/missing becomes null
const optionalTextSchema = z
  .string()
  .trim()
  .max(2000)
  .nullish()
  .transform((value) => value || null);

export const incidentSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  symptom: z.string().trim().min(1, "Symptom is required").max(2000),
  root: optionalTextSchema,
  fix: optionalTextSchema,
  impact: optionalTextSchema,
  // Lowercased and deduplicated before the limit, so duplicates don't count toward it
  tags: z
    .array(z.string().trim().toLowerCase().min(1).max(30))
    .default([])
    .transform((tags) => [...new Set(tags)])
    .pipe(z.array(z.string()).max(5, "Maximum 5 tags")),
});

// Validate the model output on the server / never trust model output blindly
export const draftSchema = z.object({
  title: z.string().trim().max(120),
  symptom: z.string().trim(),
  root: z.string().trim().nullable(),
  fix: z.string().trim().nullable(),
  impact: z.string().trim().nullable(),
  tags: z.array(z.string().trim().toLowerCase().min(1).max(30)).max(5),
});

// Keep in sync with NOTES_MAX_LENGTH in client/src/helpers.tsx
export const NOTES_MAX_LENGTH = 10000;

export const structureBodySchema = z.object({
  text: z.string().trim().min(10).max(NOTES_MAX_LENGTH),
});
