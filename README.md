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
    "Authority": "https://<your-supabase-project-ref>.supabase.co/auth/v1",
    "Audience": "authenticated"
  },
  "Cors": {
    "AllowedOrigins": [ "http://localhost:5173" ]
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
API runs on `http://localhost:5015`.

### 5. Configure the client
```bash
cp client/.env.example client/.env.local
```
Edit `client/.env.local`:
```
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_API_BASE_URL=http://localhost:5015
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

## Screenshots from the application
  1. Dashboard
     <img width="1917" height="909" alt="Screenshot 2026-06-21 121243" src="https://github.com/user-attachments/assets/1be9f589-dd12-4b93-88aa-ac00ed8cf906" />

  2. Projects
     <img width="1917" height="909" alt="Screenshot 2026-06-21 121251" src="https://github.com/user-attachments/assets/5eab7b9d-456c-43ca-81d3-3f098357a51c" />

  3. Project Detail
     <img width="1919" height="909" alt="Screenshot 2026-06-21 121301" src="https://github.com/user-attachments/assets/39a3640b-f9c9-40be-ac52-70d734220b18" />
     <img width="1919" height="908" alt="Screenshot 2026-06-21 121329" src="https://github.com/user-attachments/assets/2ece5da7-8d78-4809-b474-328445e90c01" />
     <img width="1919" height="909" alt="Screenshot 2026-06-21 121347" src="https://github.com/user-attachments/assets/5ff12f00-5239-4570-be4a-2e4f21962882" />
     <img width="1919" height="911" alt="Screenshot 2026-06-21 121423" src="https://github.com/user-attachments/assets/0454f36d-9eba-4210-a4ac-58ac22847635" />

  4. Recurring Expenses
     <img width="1917" height="911" alt="Screenshot 2026-06-21 121454" src="https://github.com/user-attachments/assets/fa3e3125-38e2-4ede-aaae-a9eb46060443" />






