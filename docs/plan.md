# Development Plan: YouTube Project Tracker

## Phase 0 — Project Bootstrap
1. Initialize git repo
2. Scaffold `/client` — Vite + React + TypeScript, configure strict mode
3. Scaffold `/server` — .NET ASP.NET Core Web API solution with `Api`, `Application`, `Domain`, `Infrastructure` projects
4. Set up MSSQL via Docker (`docker-compose.yml`) for local dev
5. Configure `.gitignore` (secrets, build artifacts, env files)

---

## Phase 1 — Auth (Supabase + .NET JWT validation)
1. Create Supabase project, enable email/password auth
2. React: install `@supabase/supabase-js`, build sign-in/sign-up pages, session management, protected routes
3. .NET: configure `JwtBearer` to validate Supabase JWTs (JWKS endpoint, issuer, audience)
4. On first login, provision a user record in MSSQL keyed by `sub` claim

---

## Phase 2 — Backend Foundation
1. Define `Domain` entities: `User`, `Project`, `Short`, `RecurringExpense`, `ProjectExpense`, `RevenueEntry`, `TimeLog`
2. Set up EF Core `DbContext` with relationships, write initial migration
3. Create base typed API client pattern on the frontend

---

## Phase 3 — Account Recurring Expenses (MVP step 2)
- Backend: CRUD endpoints (`/api/recurring-expenses`), active/inactive toggle
- Frontend: list + form UI

---

## Phase 4 — Projects (MVP step 3)
- Backend: CRUD endpoints (`/api/projects`), status, target publish date, linked shorts
- Frontend: project list (cards) + create/edit form

---

## Phase 5 — Project Financials (MVP steps 4–6)
- **Expenses**: line items (description, amount, category)
- **Revenue**: payout entries (source, amount, date)
- **Time logs**: hours by category
- All three as sub-resources of a project (`/api/projects/{id}/expenses`, etc.)

---

## Phase 6 — Profitability Engine (MVP step 7)
- `Application` service computes: Gross Profit, Net Profit, ROI, Revenue per Hour
- Two recurring-cost allocation modes: manual amount vs. auto-split by published projects that month
- Project detail view surfaces all metrics + breakdowns

---

## Phase 7 — Project List & Channel Dashboard (MVP steps 8–9)
- Project list with color-coded profit/loss cards
- Dashboard: monthly recurring total, projects published this month, channel-level revenue/expenses

---

## Build Order Summary

| Step | What |
|------|------|
| 0 | Bootstrap + Docker MSSQL |
| 1 | Auth (Supabase + .NET JWT) |
| 2 | Domain entities + EF Core migrations |
| 3 | Recurring expenses CRUD |
| 4 | Projects CRUD |
| 5 | Expenses, Revenue, Time logs |
| 6 | Profitability calculations |
| 7 | Project list + Dashboard |
