# YouTube Project Tracker

A web app for solo YouTube creators to track the full economics of their videos — true cost, time investment, and profitability (ROI) per video, plus overall channel profitability.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend | React + TypeScript (Vite) |
| Backend | ASP.NET Core Web API (.NET 10, C#) |
| Database | Microsoft SQL Server (via Docker) |
| ORM | Entity Framework Core |
| Auth | Supabase (JWT-based) |

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Supabase](https://supabase.com/) project with email/password auth enabled

## Local Dev Setup

### 1. Start the database
```bash
docker-compose up -d
```
This starts MSSQL 2022 on port `1433` with a persistent named volume.

### 2. Configure the API
Copy the example config and fill in your values:
```bash
cp server/Api/appsettings.Development.json.example server/Api/appsettings.Development.json
```
Edit `appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=YoutubeManager;User Id=sa;Password=YourStrong!Password;TrustServerCertificate=true"
  },
  "Jwt": {
    "Authority": "https://<your-supabase-project-ref>.supabase.co",
    "Audience": "authenticated"
  }
}
```

### 3. Run the initial database migration
```bash
dotnet tool install --global dotnet-ef
dotnet ef database update --project server/Infrastructure --startup-project server/Api
```

### 4. Start the API
```bash
dotnet run --project server/Api
```
API runs on `http://localhost:5000`.

### 5. Configure the client
```bash
cp client/.env.example client/.env.local
```
Edit `client/.env.local`:
```
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_API_BASE_URL=http://localhost:5000
```

### 6. Start the client
```bash
cd client
npm install
npm run dev
```
App runs on `http://localhost:5173`.

## Project Structure

```
/client                 React + TypeScript SPA (Vite)
  /src
    /features           auth, projects, expenses, revenue, time, shorts, dashboard
    /components         shared UI primitives
    /lib                supabase client, typed API client
    /hooks
    /types
/server                 .NET solution
  /Api                  controllers, auth config, Program.cs
  /Application          services, DTOs, business logic
  /Domain               entities
  /Infrastructure       EF Core DbContext, migrations
/docs                   plan.md, brainstorm.md
docker-compose.yml      local MSSQL
```

## Development Plan

See [docs/plan.md](docs/plan.md) for the full phase-by-phase build plan and current status.
