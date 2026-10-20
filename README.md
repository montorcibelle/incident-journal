# Incident Journal

A lightweight incident journal/logger built with React, Node.js, TypeScript and SQLite.

![Alt text](./client/public/inc.png)
![Alt text](./client/public/newIn.png)

## Problem Statement

Many times when things break in production, my team and I could not remember how we had fixed similar issues before. I built this journal to help me log each incident I remediated (by symptom, impact, root cause and fix) and search by tags later, so I stop re-debugging from scratch and keep a record of my impact in the business.

## Why I built this?

Capturing your impact in a business is one of the skills you only know you need when you need it. For individuals on small teams in a fast-paced environment, this is never something we prioritize, as we are so focused on shipping. I only realized it when I found myself digging through my memory, old chats and notes, trying to remember the projects and tasks I had worked on so I could update my resume, network, and even beat the impostor syndrome telling me, "Did you even build something during your tenure over there?" I promised myself that in my next role I would be more diligent about it and would log all of my accomplishments weekly.

The initial idea of this project was to build a "Wins tracker", but I thought it could be extended and used by small, scrappy teams that need an easy way to log incidents and search previous ones.

## Tech Stack

React
Tailwind
Node
TypeScript
SQLite
Claude

## Features

- Incident Creation
- Form Draft powered by AI
- Filter/Search incidents by tags

## API Endpoints

Base URL: `http://localhost:3001/api/incidents`

| Method | Path                       | Description                              | Success                           |
| ------ | -------------------------- | ---------------------------------------- | --------------------------------- |
| GET    | `/api/incidents`           | List all incidents                       | `200` with `Incident[]`           |
| POST   | `/api/incidents`           | Create an incident                       | `201` with the created `Incident` |
| POST   | `/api/incidents/structure` | Return an incident draft from a raw note | `200` with `IncidentDraft`        |

Invalid payloads return `400` with a `details` array of field errors.

## Folder Structure

```
incident-logger/
├── client/
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── Api.tsx
│       └── main.tsx
└── server/
    ├── ai/
    ├── db/
    ├── helpers/
    ├── routes/
    ├── test/
    ├── app.ts
    └── index.ts
```

## How to Run

### 1. Prerequisites

- Node.js 22 or newer
- An Anthropic API key (only needed for the AI draft feature)

### 2. Install dependencies

From the root directory, install the root, client and server packages in one step:

```bash
npm run install:all
```

### 3. Configure environment variables

Create `server/.env`:

```
ANTHROPIC_API_KEY=your-api-key
ANTHROPIC_MODEL=claude-haiku-5-5
```

Optional overrides:

| Variable        | Default                 | Purpose                     |
| --------------- | ----------------------- | --------------------------- |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Origin allowed by CORS      |
| `DB_PATH`       | `./data/incidents.db`   | Location of the SQLite file |

The API runs on port `3001` and the client proxies `/api` requests to it.

### 4. Seed the database (optional)

```bash
npm run seed --prefix server
```

### 5. Start the app

```bash
npm run dev
```

- Client: http://localhost:5173
- API: http://localhost:3001/api/incidents

## How was AI used

Claude was primarily used for brainstorming ideas, discussing trade-offs, debugging, creating sample data,

## Architectural Trade-offs

### Client

- **Tailwind** for styling: quick development and less CSS maintenance.
- **Fetch over axios**: I didn't see the value in adding an extra dependency. The app makes simple JSON calls with no authentication, so fetch was more than enough.
- **Component state versus global state**: components were not sharing data, so creating a global state this early didn't make sense.

### Server

- **REST APIs**, given the UI was simple and I didn't have a web and a mobile version needing to display just certain fields.
- **Zod** for validating request bodies coming from the client and output responses from the model. Straightforward and I wanted to experiment with.

### Database

SQL db because I haven't worked with it in a long time and wanted to brush up on some concepts. I chose SQLite because it was easy to set up and get started. For this demo a NoSQL db would have worked just fine. However, for v2 I am planning on adding Auth and an Analytics entity, and I can see the relationships between entities growing, so I would continue using SQL.

### Gotchas

**Search-as-you-type vs. Full Text Search**

I originally built the search around SQLite FTS5 so users could look up incidents by symptoms and title, with ranked results and highlighted matches. The problem was that even with a 500ms debounce, typing a single word triggered way too many server calls, because every pause mid-word still fired a fetch.

For this demo I moved filtering to the client. The app fetches all incidents once, and users narrow them down by tag. It's instant and sends no per-keystroke requests, at the cost of losing ranked, highlighted search over symptoms and title.

Keeping FTS with search-as-you-type would require a bit more overhead: request cancellation so stale responses can't overwrite newer ones, client-side caching so backspacing doesn't re-hit the server, and a minimum query length. I plan to add these in the next iteration and bring FTS back, combined with the tag filter.

## Future Scope

- Full text search with ranking and highlighting
- Metrics components to display the most logged types of incidents
- Gate the app, so only authorized users can log incidents
- Pagination
- Virtual list
- sessionStorage to keep form data during accidental page refreshes
