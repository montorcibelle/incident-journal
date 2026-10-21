import express from "express";
import cors from "cors";
import type { IncidentStore } from "./helpers/types.ts";
import { incidentsRouter } from "./routes/incidents.ts";
import { errorMiddleware, HttpError } from "./helpers/errors.ts";

export function createApp(store: IncidentStore) {
  const app = express();

  app.use(
    cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173" }),
  );

  //Parse body
  app.use(express.json());
  app.use("/api/incidents", incidentsRouter(store));

  //Unknown path: reaches here only if no route matched
  app.use(() => {
    throw new HttpError(404, "Not found");
  });
  app.use(errorMiddleware);

  return app;
}
