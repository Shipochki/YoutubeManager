# Development Plan: YouTube Project Tracker

## Status Legend
- ✅ Complete — pushed to GitHub
- 🔲 Not started

---

## ✅ Phase 0 — Project Bootstrap
**Branch:** `phase-0-bootstrap`

1. ✅ Initialized git repo + created private GitHub repo (`Shipochki/YoutubeManager`)
2. ✅ Scaffolded `/client` — Vite + React + TypeScript, TanStack Query, React Router, `@supabase/supabase-js`
3. ✅ Scaffolded `/server` — .NET 10 solution with `Api`, `Application`, `Domain`, `Infrastructure` projects; project references wired correctly
4. ✅ Set up MSSQL via Docker (`docker-compose.yml`, named volume for persistence)
5. ✅ Configured `.gitignore`, `.env.example`, `appsettings.Development.json.example`
6. ✅ All 7 Domain entities defined: `User`, `Project`, `Short`, `RecurringExpense`, `ProjectExpense`, `RevenueEntry`, `TimeLog`
7. ✅ `AppDbContext` configured: `decimal(18,4)` money columns, FK indexes, cascade deletes, enum-as-string
8. ✅ Typed API client (`lib/api.ts`) and Supabase client (`lib/supabase.ts`) in place
9. ✅ Custom slash commands created for all roles (`.claude/commands/`)

---

## ✅ Phase 1 — Auth (Supabase + .NET JWT validation)
**Branch:** `phase-1-auth`

1. ✅ React: `AuthContext` — session state, `signIn`/`signUp`/`signOut`, auto-provisions user on login via `GET /api/users/me`
2. ✅ `SignInPage` and `SignUpPage` — email/password forms with validation and error display
3. ✅ `ProtectedRoute` — redirects unauthenticated users to `/sign-in`
4. ✅ `App.tsx` — React Router + `QueryClientProvider` + `AuthProvider` all wired, route structure in place
5. ✅ .NET: `JwtBearer` configured (Authority + Audience from config); CORS configured for `http://localhost:5173`
6. ✅ `UsersController` — `GET /api/users/me` extracts `sub` from JWT, provisions user record in MSSQL on first login
7. ✅ `UserService` / `IUserService` in `Application` layer; registered via `Application.ServiceExtensions`

> **Before running:** copy `.env.example` → `.env.local` and `appsettings.Development.json.example` → `appsettings.Development.json`, then fill in Supabase URL, anon key, JWT authority, and DB connection string.

---

## 🔲 Phase 2 — Backend Foundation
1. Run initial EF Core migration (`dotnet ef migrations add InitialCreate`)
2. Apply migration to local MSSQL (`dotnet ef database update`)
3. Verify schema matches domain model

> Note: Domain entities and `AppDbContext` were completed in Phase 0. Phase 2 is now only the migration step.

---

## 🔲 Phase 3 — Account Recurring Expenses (MVP step 2)
- Backend: CRUD endpoints (`/api/recurring-expenses`), active/inactive toggle
- Frontend: list + form UI

---

## 🔲 Phase 4 — Projects (MVP step 3)
- Backend: CRUD endpoints (`/api/projects`), status, target publish date, linked shorts
- Frontend: project list (cards) + create/edit form

---

## 🔲 Phase 5 — Project Financials (MVP steps 4–6)
- **Expenses**: line items (description, amount, category)
- **Revenue**: payout entries (source, amount, date)
- **Time logs**: hours by category
- All three as sub-resources of a project (`/api/projects/{id}/expenses`, etc.)

---

## 🔲 Phase 6 — Profitability Engine (MVP step 7)
- `Application` service computes: Gross Profit, Net Profit, ROI, Revenue per Hour
- Two recurring-cost allocation modes: manual amount vs. auto-split by published projects that month
- Project detail view surfaces all metrics + breakdowns

---

## 🔲 Phase 7 — Project List & Channel Dashboard (MVP steps 8–9)
- Project list with color-coded profit/loss cards
- Dashboard: monthly recurring total, projects published this month, channel-level revenue/expenses

---

## Build Order Summary

| Step | What | Status |
|------|------|--------|
| 0 | Bootstrap + Docker MSSQL | ✅ Done |
| 1 | Auth (Supabase + .NET JWT) | ✅ Done |
| 2 | EF Core initial migration | 🔲 |
| 3 | Recurring expenses CRUD | 🔲 |
| 4 | Projects CRUD | 🔲 |
| 5 | Expenses, Revenue, Time logs | 🔲 |
| 6 | Profitability calculations | 🔲 |
| 7 | Project list + Dashboard | 🔲 |
