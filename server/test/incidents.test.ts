import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import request from "supertest";
import { createApp } from "../app.ts";
import type { Incident, IncidentStore } from "../helpers/types.ts";

const sample: Incident = {
  id: 1,
  title: "DB timeout",
  symptom: "Requests hang for 30s",
  root: null,
  fix: null,
  impact: null,
  tags: ["db"],
  createdAt: "2026-01-01 10:00:00",
};

let store: jest.Mocked<IncidentStore>;

beforeEach(() => {
  store = {
    create: jest.fn<IncidentStore["create"]>(),
    get: jest.fn<IncidentStore["get"]>(),
    list: jest.fn<IncidentStore["list"]>(),
  };
});

describe("GET /api/incidents", () => {
  it("returns all incidents", async () => {
    store.list.mockReturnValue([sample]);

    const res = await request(createApp(store)).get("/api/incidents");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([sample]);
    expect(store.list).toHaveBeenCalledTimes(1);
  });

  it("returns an empty array when there are no incidents", async () => {
    store.list.mockReturnValue([]);

    const res = await request(createApp(store)).get("/api/incidents");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe("POST /api/incidents", () => {
  it("creates an incident and returns 201", async () => {
    store.create.mockReturnValue(sample);

    const res = await request(createApp(store))
      .post("/api/incidents")
      .send({
        title: "DB timeout",
        symptom: "Requests hang for 30s",
        tags: ["db"],
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(sample);
  });

  it("applies defaults and trims strings before calling the store", async () => {
    store.create.mockReturnValue(sample);

    await request(createApp(store))
      .post("/api/incidents")
      .send({ title: "  DB timeout  ", symptom: " hang " });

    expect(store.create).toHaveBeenCalledWith({
      title: "DB timeout",
      symptom: "hang",
      root: null,
      fix: null,
      impact: null,
      tags: [],
    });
  });

  it.each([
    ["missing title", { symptom: "x" }, "title"],
    ["missing symptom", { title: "x" }, "symptom"],
    ["blank title", { title: "   ", symptom: "x" }, "title"],
    ["non-array tags", { title: "x", symptom: "y", tags: "db" }, "tags"],
    [
      "more than 5 tags",
      { title: "x", symptom: "y", tags: ["a", "b", "c", "d", "e", "f"] },
      "tags",
    ],
  ])("returns 400 for %s", async (_name, body, field) => {
    const res = await request(createApp(store))
      .post("/api/incidents")
      .send(body);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid request");
    expect(res.body.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field })]),
    );
    expect(store.create).not.toHaveBeenCalled();
  });
});
