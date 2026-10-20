import { openDb } from "./db.ts";
import { createIncidentStore } from "./store.ts";
import type { NewIncident } from "../helpers/types.ts";

const samples: NewIncident[] = [
  {
    title: "Connection pool exhaustion after v2.14 deploy",
    symptom:
      "Checkout p95 jumped from 400ms to 6s within 10 minutes of deploy. DB CPU stayed flat.",
    root: "New retry logic opened a connection per retry and never released it. Pool capped at 20.",
    fix: "Rolled back, then released connections in a finally block and capped retries at 3.",
    impact: "~1,200 users affected, 38 minutes to resolve",
    tags: ["database", "deploy", "retries"],
  },
  {
    title: "Memory leak in image resizing worker",
    symptom:
      "Worker pods restarted every ~2 hours with OOMKilled. Memory climbed steadily.",
    root: "Buffers from sharp were kept in a module-level cache with no eviction.",
    fix: "Replaced the cache with an LRU capped at 100 entries.",
    impact: "Slow thumbnails for ~3 hours, no data loss",
    tags: ["memory", "workers"],
  },
  {
    title: "Login failures for users in one region",
    symptom:
      "Sporadic 401 responses on /login, only for requests from EU. Token looked valid.",
    root: "Clock skew of 90 seconds on one auth node caused JWTs to look not-yet-valid.",
    fix: "Fixed NTP sync and added 30s clock tolerance to token validation.",
    impact: "~300 failed logins over 25 minutes",
    tags: ["auth", "infrastructure"],
  },
  {
    title: "Search results stale after reindex",
    symptom:
      "New products did not appear in search for up to an hour after being added.",
    root: "Reindex job ran on a cron that was moved to UTC, shifting it by 3 hours.",
    fix: "Corrected the cron schedule and added an alert when the index is older than 15 minutes.",
    impact: "Delayed visibility for new listings",
    tags: ["search", "cron"],
  },
  {
    title: "Timeouts calling payment provider",
    symptom:
      "Intermittent 504s on /checkout/pay. Provider status page showed no issues.",
    root: "Our HTTP client had no timeout, so slow responses held requests open until the load balancer gave up.",
    fix: "Added a 5s timeout with one retry and a clear error message for the user.",
    impact: "~80 failed payments, all retried successfully",
    tags: ["payments", "timeouts", "retries"],
  },
  {
    title: "Duplicate records created on slow connections",
    symptom:
      'Some users saw the same incident saved two or three times after clicking "Save" on a slow network.',
    root: "The submit button stayed enabled while the request was pending, so repeated clicks sent multiple POST requests.",
    fix: "Disabled the button during submission and added a client-generated idempotency key checked by the API.",
    impact: "~120 duplicate rows cleaned up manually",
    tags: ["frontend", "api", "data-quality"],
  },
  {
    title: "API returning 500 on incident list after migration",
    symptom:
      "GET /api/incidents returned 500 for every request right after the deploy. Health check still passed.",
    root: "A migration added a NOT NULL column without a default, and old rows made the mapper throw while parsing the tags field.",
    fix: "Backfilled the column with a default and made the tags parser tolerate empty values.",
    impact: "Full outage of the list view for 20 minutes",
    tags: ["api", "database", "migration"],
  },
];

const db = openDb();
const store = createIncidentStore(db);

const { n } = db.prepare("SELECT COUNT(*) AS n FROM incidents").get() as {
  n: number;
};

if (n > 4 && !process.argv.includes("--force")) {
  console.log(
    `DB already has ${n} incidents. Use --force to add the samples anyway.`,
  );
} else {
  for (const s of samples) await store.create(s);
  console.log(`Seeded ${samples.length} incidents.`);
}
