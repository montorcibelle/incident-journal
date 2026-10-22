# Incident Journal

A journal to help teams keep track of past incidents. You past messy notes from Slack, Teams, or a postmortem, and get a clean incident draft with what broke, why, how it was fixed, and what it cost the business. Built with React, Node, TypeScript, and SQLite, with Claude drafting the form for you.

![Incident list](./client/public/inc.png)
![New incident form](./client/public/newIn.png)

## Why I built this

I noticed my team and I spending too much time re-debugging problems we had already solved. We also struggled to remember how it was fixed and the impact it had to the business. 

It also hit me personally: when I left, I couldn't remember half of what I'd shipped. I had to dig through old chats and notes just to update my resume. So this started as a "wins tracker" for myself, then I realized small teams have the same problem. Now it's a shared place to log incidents, search them later, and show the impact of the work.

## How it works

1. Paste raw notes into the input box.
2. Claude drafts the form (title, symptom, root cause, fix, impact).
3. You review, edit, and save.
4. Filter your incidents by tag whenever the same thing breaks again.


## Tech stack

React, Tailwind, Node/Express, TypeScript, SQLite, Claude (Haiku).

## How to run

**Prerequisites:** Node.js 22+, and an Anthropic API key (only needed for the AI draft).

```bash
npm run install:all              # installs root, client and server
npm run seed --prefix server     # optional: sample data
npm run dev                      # starts client and API
```

Create `server/.env` before starting:

```
ANTHROPIC_API_KEY=your-api-key
ANTHROPIC_MODEL=claude-haiku-5-5
```

| Variable        | Default                 | Purpose                     |
| --------------- | ----------------------- | --------------------------- |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Origin allowed by CORS      |
| `DB_PATH`       | `./data/incidents.db`   | Location of the SQLite file |

- Client: http://localhost:5173
- API: http://localhost:3001/api/incidents (the client proxies `/api` to it)

## Trade-offs

**Client**

- **Tailwind:** fast to set up, less CSS to maintain.
- **fetch over axios:** simple JSON calls with no auth, so an extra dependency wasn't worth it.
- **Local state over global state:** components don't share data yet. A global store this early would be solving a problem I don't have.

**Server**

- **REST:** the UI is simple, and there's no mobile client that needs to fetch different fields.
- **Zod:** validates incoming requests and the model's output. 
- **Haiku:** the model only structures text, so the smallest tier is enough and keeps costs low.

**Database**

SQLite because it's zero setup and to get started with. A NoSQL DB would have worked just fine for one table, but on v2 I would like to add auth and analytics, and I can see the relationships growing (incidents per user, metrics over time). So I'd stay relational. I also hadn't used SQL in a while and wanted to refreh my skills.

## Gotcha: search-as-you-type

My biggest gotcha was going back and forth on whether to keep Full-Text Search on the Title and Symptoms columns. I wanted to return ranked results to the client with a search-as-you-type functionality .In the middle of my implementation I noticed that even with a debounce of 500ms,   many requests were being fired to the server thats because every pause mid-word triggered a fetch. 

I know for this demo it would have been just fine, but I also know this is not the most efficient way to implement the functionality. So I decided to tackle Full Text Search next, because it will require a bit more of learning and researching. I know I will need to have a min query length , a debounce and a way to cache results and possibly canceling in-flight requests. 

For now I moved filtering to the client. It fetches everything once and filters by tag, which is instant with no per-keystroke requests. 

## How I used AI

Claude helped me brainstorm, talk through trade-offs, debug, build UI, and generate sample data. The app also uses Claude at runtime to draft incident forms from raw notes.

## API endpoints

Base URL: `http://localhost:3001/api/incidents`

| Method | Path                       | Description                              | Success                           |
| ------ | -------------------------- | ---------------------------------------- | --------------------------------- |
| GET    | `/api/incidents`           | List all incidents                       | `200` with `Incident[]`           |
| POST   | `/api/incidents`           | Create an incident                       | `201` with the created `Incident` |
| POST   | `/api/incidents/structure` | Return an incident draft from a raw note | `200` with `IncidentDraft`        |

Invalid payloads return `400` with a `details` array of field errors.

## Folder structure

```
incident-journal/
├── client/
│   └── src/
│       ├── components/   # UI pieces
│       ├── hooks/        # data fetching and filtering
│       ├── pages/
│       ├── Api.tsx       # fetch wrappers
│       └── main.tsx
└── server/
    ├── ai/               # Claude call + Zod schema for drafts
    ├── db/               # SQLite setup and queries
    ├── helpers/
    ├── routes/           # Express route handlers
    ├── test/
    ├── app.ts            # Express app and middleware
    └── index.ts          # server entry point
```

## What's next

- Full-text search with ranking and highlights
- Metrics: which kinds of incidents happen most
- Auth, so only authorized users can log incidents
- Pagination and a virtual list
- sessionStorage so an accidental refresh doesn't wipe the form
- Update/Archive an incident
