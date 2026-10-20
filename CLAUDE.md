# Project Name (TypeScript Monorepo)

A full-stack TypeScript monorepo containing a React frontend (`/client`) styled with Tailwind CSS, and a Node/Express backend (`/server`) using `better-sqlite3` with raw SQL. Zod enforces end-to-end runtime validation.

## 🤖 CRITICAL ASSISTANT CONSTRAINT

- **PLAN FIRST, CODE SECOND:** Never suggest code, snippets, refactors, or file modifications before explaining your proposed plan first.
- Always outline the steps you intend to take and ask for confirmation/feedback before outputting code blocks.

## 🛠️ Development Commands

Always run these commands from the root directory unless specified otherwise.

### Root Management

- **Install All Dependencies (root, client & server):** `npm run install:all`
- **Run Both Client & Server:** `npm run dev`

### Client (`/client`)

- **Install Frontend Dependencies:** `npm run install:client`
- **Start Frontend Dev Server:** `npm run dev --prefix client`
- **Build Frontend:** `npm run build --prefix client`
- **Lint Frontend:** `npm run lint --prefix client`

### Server (`/server`)

- **Install Backend Dependencies:** `npm run install:server`
- **Start Backend Dev Server:** `npm run dev --prefix server`
- **Run Tests:** `npm run test --prefix server`
- **Seed Database:** `npm run seed --prefix server`

## 📐 Architecture & Conventions

- **Project Layout:** Strict separation between frontend and backend contexts:
  - `/client` - React, TypeScript, and Tailwind CSS.
  - `/server` - Node.js, Express, TypeScript, and `better-sqlite3`.
- **Data Validation:** Use **Zod schemas** for all untrusted data entry points (API payloads, query parameters, and environment variables). Infer TypeScript types directly using `z.infer<typeof schema>`.
- **Database Layer:** Raw SQL executed via `better-sqlite3`.
  - Always use **prepared statements** or bound parameters (e.g., `db.prepare('SELECT * FROM users WHERE id = ?').get(id)`) to completely prevent SQL injection.
  - Never string-interpolate variables directly into SQL queries.

## 🎨 Code Style Guidelines

- **TypeScript & Zod Strictness:** Prefer explicit types over `any`. Use Zod's `.safeParse()` or `.parse()` to enforce data integrity.
- **Backend Validation:** Validate `req.body`, `req.params`, or `req.query` using Zod schemas at the routing/middleware layer before reaching raw SQL controllers.
- **Asynchronous Execution:** Express routes must catch execution errors cleanly. Note that `better-sqlite3` operations are synchronous by default, but async wrappers or asynchronous middleware chains must still handle exceptions gracefully.
- **Naming Conventions:**
  - Suffix Zod schemas with `Schema` (e.g., `userSignupSchema`).
  - PascalCase for React components and TypeScript Types (`UserProfile.tsx`, `UserSignup`).
  - camelCase for variables, database functions, and API endpoints.

## ⚠️ Critical Gotchas & Constraints

- **SQLite Types:** Handle SQLite types carefully inside your raw SQL query outputs. Remember that booleans are typically stored/returned as integers (`0` or `1`) and dates as strings/integers. Use Zod schemas to clean and transform these database row shapes into clean frontend types.
- Follow KISS, DRY, and YAGNI across all aspects of the application
