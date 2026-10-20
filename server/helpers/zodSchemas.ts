import { z } from "zod";

export const incidentSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  symptom: z.string().trim().min(1, "Symptom is required"),
  root: z.string().nullish().default(null),
  fix: z.string().nullish().default(null),
  impact: z.string().nullish().default(null),
  tags: z.array(z.string().trim().min(1)).max(5, "Maximum 5 tags").default([]),
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

export const idSchema = z.coerce.number().int().positive();
