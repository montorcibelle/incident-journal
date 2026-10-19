import { Router } from "express";
import type { IncidentStore } from "../helpers/types.ts";
import { incidentSchema } from "../helpers/schemas.ts";

export function incidentsRouter(database: IncidentStore) {
  const router = Router();

  //GET /api/incidents = > Incident[]
  router.get("/", async (_req, res) => {
    res.status(200).json(await database.list());
  });

  //POST api/incidents  => Incident
  router.post("/", async (req, res) => {
    const data = incidentSchema.parse(req.body);
    const incident = await database.create(data);
    res.status(201).json(incident);
  });

  return router;
}
