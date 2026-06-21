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

## ✅ Phase 2 — Backend Foundation
**Branch:** `phase-1-auth` (migration added alongside auth work)

1. ✅ Ran initial EF Core migration (`dotnet ef migrations add InitialCreate`)
2. ✅ Applied migration to local MSSQL (`dotnet ef database update`)
3. ✅ Schema verified — all 7 tables created with correct types, indexes, and cascades

> Note: Domain entities and `AppDbContext` were completed in Phase 0. Phase 2 is now only the migration step.

---

## ✅ Phase 3 — Account Recurring Expenses (MVP step 2)
**Branch:** `phase-3-recurring-expenses`

- ✅ Backend: `RecurringExpenseDto`, `IRecurringExpenseService`, `RecurringExpenseService`
- ✅ Backend: `RecurringExpensesController` — GET list, POST create, PUT update, PATCH toggle, DELETE
- ✅ Frontend: `Layout` component with sticky nav and sign-out
- ✅ Frontend: `RecurringExpensesPage` — list with active/inactive badge, monthly total summary
- ✅ Frontend: `RecurringExpenseForm` — modal for create and edit
- ✅ `api.ts` extended with `patch` method; `tslib` installed (Vite 8 rolldown fix)

---

## ✅ Phase 4 — Projects (MVP step 3)
**Branch:** `phase-4-projects`

- ✅ Backend: `ProjectDto` (with ShortsCount), `ProjectDetailDto`, `ShortDto`, `IProjectService`, `ProjectService`
- ✅ Backend: `ProjectsController` — GET list, GET by id, POST, PUT, DELETE, POST `/shorts`, DELETE `/shorts/{id}`
- ✅ Frontend: `ProjectsPage` — card grid with status badge (Draft/InProgress/Published/Archived), shorts count, dates
- ✅ Frontend: `ProjectDetailPage` — project info, shorts add/remove, placeholder sections for Phase 5
- ✅ Frontend: `ProjectForm` — modal for create/edit (title, status, target date, published date, description)

---

## ✅ Phase 5 — Project Financials (MVP steps 4–6)
**Branch:** `phase-5-financials`

- ✅ Backend: `FinancialsDto` (ProjectExpense/RevenueEntry/TimeLog DTOs + create requests), `IFinancialsService`, `FinancialsService`
- ✅ Backend: `ProjectFinancialsController` — GET/POST/DELETE for `/expenses`, `/revenue`, `/timelogs` under `api/projects/{projectId}`
- ✅ Frontend: `ExpensesSection`, `RevenueSection`, `TimeLogsSection` components in `ProjectDetailPage` — inline add forms, running totals, remove per entry
- ✅ CSS: `.financials-total`, `.expense-total` (red), `.revenue-total`/`.revenue-amount` (green)

---

## ✅ Phase 6 — Profitability Engine (MVP step 7)
**Branch:** `phase-6-profitability`

- ✅ Backend: `ProfitabilityDto` (with `CategoryBreakdown`, `TimeBreakdown`), `GetProfitabilityAsync` in `FinancialsService`
- ✅ Backend: `GET /api/projects/{id}/profitability` — gross profit, net profit, ROI, revenue/hr, auto recurring split, breakdowns
- ✅ Frontend: `ProfitabilityPanel` — metric cards, auto/manual allocation rows (manual recalculates live client-side), expense + time breakdowns by category
- ✅ CSS: `--profit-positive/negative` vars, `.metrics-grid`, `.metric-card`, `.allocation-section`, `.breakdown-grid`

---

## ✅ Phase 7 — Project List & Channel Dashboard (MVP steps 8–9)
**Branch:** `phase-7-dashboard`

- ✅ Project list cards with color-coded gross profit badge (green/red/neutral)
- ✅ `DashboardPage` — monthly recurring total, published-this-month count, total projects/hours, channel financials (all-time revenue/expenses/gross profit), recently published list

---

## ✅ Phase 8 — UX/UI Overhaul
**Branch:** `phase-8-ui`

- ✅ Replaced top-nav with dark sidebar layout (`#18181b`) + light gray main area (`#f4f4f5`)
- ✅ Added `lucide-react` icons (LayoutDashboard, Clapperboard, RefreshCw, LogOut, Play)
- ✅ New design token system in `index.css`: purple accent (`#7c3aed`), shadows, profit colors
- ✅ Complete rewrite of `App.css`: sidebar, auth card, buttons, badges, cards, forms, modals, profitability panel
- ✅ Auth pages branded with Play icon logo, descriptive subtitle, focus-ring inputs
- ✅ Sidebar shows user avatar (first letter), email, red-on-hover sign-out button
- ✅ Project cards: lift-on-hover (`translateY(-1px)`), accent border on hover
- ✅ Inline add-forms sit in a gray background container (visually distinct from list)
- ✅ Fixed missing `import './App.css'` in `App.tsx` (styles were written but never loaded)

---

## Build Order Summary

| Step | What | Status |
|------|------|--------|
| 0 | Bootstrap + Docker MSSQL | ✅ Done |
| 1 | Auth (Supabase + .NET JWT) | ✅ Done |
| 2 | EF Core initial migration | ✅ Done |
| 3 | Recurring expenses CRUD | ✅ Done |
| 4 | Projects CRUD | ✅ Done |
| 5 | Expenses, Revenue, Time logs | ✅ Done |
| 6 | Profitability calculations | ✅ Done |
| 7 | Project list + Dashboard | ✅ Done |
| 8 | UX/UI Overhaul | ✅ Done |
