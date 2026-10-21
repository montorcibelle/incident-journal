import { Router } from "express";
import type { IncidentStore } from "../helpers/types.ts";
import { incidentSchema, structureBodySchema } from "../helpers/zodSchemas.ts";
import { HttpError } from "../helpers/errors.ts";
import { structureNotes } from "../ai/structureNotes.ts";

export function incidentsRouter(database: IncidentStore) {
  const router = Router();

  //GET /api/incidents = > Incident[]
  router.get("/", (_req, res) => {
    res.status(200).json(database.list());
  });

  //POST api/incidents  => Incident
  router.post("/", (req, res) => {
    const data = incidentSchema.parse(req.body);
    const incident = database.create(data);
    res.status(201).json(incident);
  });

  //POST api/incidents/structure  => IncidentDraft
  router.post("/structure", async (req, res) => {
    const { text } = structureBodySchema.parse(req.body);
    try {
      const draft = await structureNotes(text);

      res.status(200).json(draft);
    } catch (err) {
      console.error(err);
      throw new HttpError(
        503,
        "AI is unavailable. Please fill in the fields manually.",
      );
    }
  });
  return router;
}
