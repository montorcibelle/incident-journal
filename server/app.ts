import express from "express";
import cors from "cors";
import type { IncidentStore } from "./helpers/types.ts";
import { incidentsRouter } from "./routes/incidents.ts";
import { errorHandler } from "./helpers/errors.ts";

//Creates an express app that uses the incidents router
export function createApp(store: IncidentStore) {
  const app = express();

  app.use(
    cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173" }),
  );

  //Parse body
  app.use(express.json());
  app.use("/api/incidents", incidentsRouter(store));
  app.use(errorHandler);

  return app;
}
