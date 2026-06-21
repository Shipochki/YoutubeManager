# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project: YouTube Project Tracker

A web application for **solo YouTube creators** to track the full economics of their
video projects — true cost, time investment, and profitability (ROI) per video, plus
overall channel profitability.

See [docs/brainstorm.md](docs/brainstorm.md) for the full product vision. Below is the
condensed model and the engineering constraints.

### Core domain
- **Project** = one main video (the central entity).
- **Shorts** = derived clips, linked to a parent Project (1:many).
- **Account-level recurring expenses** (Adobe, hosting, etc.) — apply across all projects, toggleable active/inactive.
- **Project-level**: direct expenses (one-off), revenue entries, time logs (by category).
- **Profitability**:
  - Gross Profit = Project Revenue − Project Direct Expenses
  - Net Profit = Gross Profit − Allocated Recurring Costs
  - Recurring allocation has two modes (manual amount, or auto-split by projects published that month) — surface both.
  - Key metrics: total profit/loss, ROI (profit / total cost), revenue per hour, time breakdown.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend | React + TypeScript (Vite) |
| Backend | .NET (ASP.NET Core Web API, C#) |
| Database | Microsoft SQL Server (MSSQL) |
| ORM | Entity Framework Core |
| Auth | **Supabase Auth** (JWT-based) |
| Architecture | **Monolith** — single API, single SPA. Small scale, keep it simple. |

### Authentication model (important)
- **Supabase handles identity** (sign-up, sign-in, password reset, sessions, JWT issuance).
- The React app uses `@supabase/supabase-js` to authenticate and obtain a JWT.
- The JWT is sent as a `Bearer` token to the .NET API.
- **The .NET API validates the Supabase JWT** (JWKS / signing key from the Supabase project) using `Microsoft.AspNetCore.Authentication.JwtBearer`. It does **not** issue its own tokens.
- User application data (projects, expenses, etc.) lives in **MSSQL**, keyed by the Supabase user id (`sub` claim). Supabase is the auth source of truth; MSSQL is the domain data store.
- Never trust a user id from the request body — always derive it from the validated JWT claims.

---

## Architecture & Conventions

Monolithic, layered. Keep boundaries clean so it can grow later, but don't over-engineer.

```
/client                 React + TS SPA (Vite)
  /src
    /features           feature-first folders (projects, expenses, revenue, time, shorts, dashboard, auth)
    /components         shared UI primitives
    /lib                supabase client, api client, utils
    /hooks
    /types
/server                 .NET solution
  /Api                  controllers / minimal API endpoints, auth config
  /Application          services, DTOs, business logic (profitability calcs)
  /Domain               entities, value objects
  /Infrastructure       EF Core DbContext, migrations, repositories
/docs                   brainstorm.md and design docs
```

### Conventions
- **Frontend**: functional components + hooks, TypeScript strict mode, no `any`. Co-locate component + styles + test. Use a typed API client; never scatter raw `fetch` calls.
- **Backend**: async all the way, DTOs at the API boundary (never expose EF entities directly), validation on input, EF Core migrations checked into source control.
- **Calculations**: profitability/ROI logic lives server-side in `Application` as the source of truth; client may mirror for instant UI feedback but server is authoritative.
- **Money**: use `decimal` in C# and integer-cents or a decimal-safe approach on the client — never floating point for currency.
- **Secrets**: never commit. Supabase keys, connection strings → environment variables / user-secrets / `.env` (gitignored).

---

## Roles & Skills

When working on this project, adopt the relevant role for the task. Each role lists the
expertise to apply and what to watch for.

### Architect
- Owns system structure, boundaries, and the monolith-first decision (no premature microservices).
- Designs the data model, API contracts, and the Supabase-auth ↔ MSSQL-data split.
- Reviews cross-cutting concerns: error handling, logging, config, migrations strategy.
- Guards against scope creep beyond MVP; defers "Future Enhancements" deliberately.

### Backend Developer (.NET / C#)
- ASP.NET Core Web API, EF Core, MSSQL.
- Implements domain entities, services, and the profitability/time-aggregation logic.
- Writes and maintains EF Core migrations.
- Validates input, returns proper status codes and problem details.

### Frontend Developer (React / TypeScript)
- React + Vite SPA, typed components and API layer.
- State/data fetching (e.g. TanStack Query recommended), forms with validation.
- Implements the views: project list, project detail/dashboard, expense/revenue/time entry, account recurring expenses, channel dashboard.

### Supabase Auth Specialist
- Configures the Supabase project: email/password (and optionally OAuth) auth.
- Wires `@supabase/supabase-js` in React: session handling, protected routes, token refresh.
- Configures **.NET JWT validation** against Supabase (issuer, audience, JWKS signing keys).
- Maps the Supabase `sub` claim to domain user records in MSSQL.
- Knows the security boundary: client gets the session, API independently verifies every request.

### Database Engineer (MSSQL)
- Schema design, indexing, relationships (Project 1:many Shorts, expenses, revenue, time logs).
- EF Core ↔ MSSQL mapping, migration review, query performance.

### UX/UI Designer
- Designs the dashboard-centric experience: at-a-glance profitability, color-coded profit/loss.
- Project list (cards/table), project detail with metric breakdowns, low-friction data entry flows.
- Responsive, accessible (WCAG), consistent component system. Charts for metrics (optional MVP, plan for it).

### QA / Testing
- Backend: unit tests for profitability/ROI/time-aggregation logic; integration tests for API + auth.
- Frontend: component tests and key user-flow coverage.
- Verify auth boundary: requests without/with invalid JWT are rejected.

### DevOps (lightweight)
- Local dev setup (MSSQL via Docker, env config), build scripts, simple CI for build + test.
- Keep deployment simple to match the monolith scope.

---

## MVP Scope (build in this order)

1. **Auth** — Supabase sign-up/sign-in in React; .NET JWT validation; user provisioning in MSSQL.
2. **Account recurring expenses** — CRUD, active/inactive toggle.
3. **Projects** — create/edit, status, target publish date, linked shorts.
4. **Project expenses** — line items (description, amount, category), totals.
5. **Revenue** — payout entries (source, amount, date), totals.
6. **Time tracking** — hours by category, auto totals.
7. **Project view** — gross/net profit, ROI, time + expense breakdowns, shorts list.
8. **Project list** — cards/table with color-coded profitability.
9. **Dashboard** — monthly recurring total, projects published this month, channel revenue/expenses.

**Out of scope for MVP** (do not build unless asked): YouTube API integration, tax export,
multi-channel, team collaboration, forecasting. See brainstorm "Future Enhancements".

---

## Current Implementation State

| Phase | What | Status | Branch |
|-------|------|--------|--------|
| 0 | Bootstrap — git, Vite client, .NET solution, Docker MSSQL, Domain entities, AppDbContext, typed API client | ✅ Done | `phase-0-bootstrap` |
| 1 | Auth — Supabase sign-in/sign-up, AuthContext, ProtectedRoute, .NET JWT Bearer, UsersController (get-or-create) | ✅ Done | `phase-1-auth` |
| 2 | EF Core initial migration (InitialCreate — all 7 tables) | ✅ Done | `phase-1-auth` |
| 3 | Recurring expenses CRUD — backend + frontend list/form/toggle | ✅ Done | `phase-3-recurring-expenses` |
| 4 | Projects CRUD + shorts management | ✅ Done | `phase-4-projects` |
| 5 | Project Financials — expenses, revenue, time logs | ✅ Done | `phase-5-financials` |
| 6–7 | Profitability Engine + Dashboard | 🔲 Next | — |

**GitHub repo:** `https://github.com/Shipochki/YoutubeManager` (private)

### Key files already in place
- `server/Domain/` — all 7 entities (`User`, `Project`, `Short`, `RecurringExpense`, `ProjectExpense`, `RevenueEntry`, `TimeLog`)
- `server/Infrastructure/AppDbContext.cs` — EF Core config with decimal money, indexes, cascades
- `server/Api/Program.cs` — JWT Bearer (Supabase), CORS, controllers registered
- `server/Api/Controllers/UsersController.cs` — `GET /api/users/me`
- `server/Application/Services/UserService.cs` — get-or-create user from `sub` claim
- `client/src/lib/api.ts` — typed API client (attaches Bearer token automatically)
- `client/src/lib/supabase.ts` — Supabase client
- `client/src/features/auth/AuthContext.tsx` — session state + auth actions
- `client/src/features/auth/SignInPage.tsx` / `SignUpPage.tsx`
- `client/src/components/ProtectedRoute.tsx`
- `.claude/commands/` — custom slash commands for all roles (`/architect`, `/backend`, `/frontend`, `/auth`, `/database`, `/ux`, `/qa`, `/devops`)

### Local dev setup
1. `docker-compose up -d` — starts MSSQL on port 1433
2. Copy `server/Api/appsettings.Development.json.example` → `appsettings.Development.json` and fill in connection string + Supabase JWT authority
3. Copy `client/.env.example` → `client/.env.local` and fill in Supabase URL + anon key
4. `dotnet run --project server/Api` — starts API
5. `cd client && npm run dev` — starts Vite dev server on port 5173

---

## Working agreements for Claude
- Confirm the role/layer you're working in before large changes.
- Keep the monolith simple — don't introduce new infrastructure (queues, microservices, extra databases) without explicit need.
- Server is the source of truth for money and profitability math.
- Always derive the user identity from the validated JWT, never from client-supplied ids.
- Add/maintain EF Core migrations alongside schema changes.
- Don't commit secrets; use env vars / user-secrets.
- After each phase: commit to a `phase-N-name` branch and push to `origin`.
