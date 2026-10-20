import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { draftSchema } from "../helpers/zodSchemas.ts";

const client = new Anthropic();

const SYSTEM = `You turn rough incident notes into structured fields.
Rules:
- Use only facts present in the notes. Never invent causes, fixes, numbers, or names.
- If a field is not in the notes, return null for it.
- title: a short summary, under 80 characters.
- symptom: what was observed, in the notes' own terms.
- tags: up to 5 short lowercase labels (area, component, cause).`;

// JSON Schema the model must follow
const draftJsonSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    symptom: { type: "string" },
    root: { type: ["string", "null"] },
    fix: { type: ["string", "null"] },
    impact: { type: ["string", "null"] },
    tags: { type: "array", items: { type: "string" } },
  },
  required: ["title", "symptom", "root", "fix", "impact", "tags"],
  additionalProperties: false,
};

export type IncidentDraft = z.infer<typeof draftSchema>;

export async function structureNotes(text: string): Promise<IncidentDraft> {
  const response = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL ?? "claude-haiku-5-5",
    max_tokens: 1024,
    system: SYSTEM,
    messages: [{ role: "user", content: text }],
    output_config: { format: { type: "json_schema", schema: draftJsonSchema } },
  });

  const block = response.content.find((b) => b.type === "text");
  if (!block || block.type !== "text")
    throw new Error("No text in model response");
  return draftSchema.parse(JSON.parse(block.text));
}
