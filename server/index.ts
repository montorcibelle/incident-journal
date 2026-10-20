import { openDb } from "./db/db.ts";
import { createIncidentStore } from "./db/store.ts";
import { createApp } from "./app.ts";
const db = openDb();
const incidentStore = createIncidentStore(db);

const app = createApp(incidentStore);
const PORT = 3001;

app.listen(PORT, () =>
  console.log(`API listenning on http://localhost:${PORT}`),
);
