import { z } from "zod";

export const incidentSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  symptom: z.string().trim().min(1, "Symptom is required"),
  root: z.string().nullish().default(null),
  fix: z.string().nullish().default(null),
  impact: z.string().nullish().default(null),
  tags: z.array(z.string().trim().min(1)).default([]),
});

export const idSchema = z.coerce.number().int().positive();
