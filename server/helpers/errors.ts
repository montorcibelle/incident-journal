import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

//Turns Zod's issues into a list of { field, message } for the client
const formatZodIssues = (err: ZodError) =>
  err.issues.map((i) => ({
    field: i.path.join("."),
    message: i.message,
  }));

//Extends js Error class and add status
export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "HttpError";
  }
}

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res
      .status(400)
      .json({ error: "Invalid request", details: formatZodIssues(err) });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message });
  }

  //express.json() failed to parse the request body: client error, not ours
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  console.error(err); // log the real error
  res.status(500).json({ error: "Internal server error" });
};
