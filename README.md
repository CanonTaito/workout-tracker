# Workout Tracker

A full-stack workout logging application. Log your daily workouts, track exercises, sets, reps, and weight over time.

## Tech Stack

- **Backend:** .NET 10 Minimal API + EF Core (SQLite dev / SQL Server production)
- **Frontend:** React + TypeScript + Tailwind CSS + Progressive Web App
- **Infrastructure:** Azure App Service (F1 Free), Azure SQL Database (free offer), Bicep

## Live App

```
https://workout-tracker-api.azurewebsites.net
```

| Endpoint | Description |
|---|---|
| `GET /api/exercises` | List all exercises |
| `GET /api/exercises/{id}` | Get exercise by ID |
| `POST /api/exercises` | Create an exercise |
| `PUT /api/exercises/{id}` | Update an exercise |
| `DELETE /api/exercises/{id}` | Delete an exercise |
| `POST /api/sessions` | Create a workout session |
| `GET /api/sessions` | List all sessions |
| `GET /api/sessions/{id}` | Get session with sets |
| `PUT /api/sessions/{id}` | Update a session |
| `DELETE /api/sessions/{id}` | Delete a session |
| `POST /api/sessions/{id}/sets` | Add a set to a session |
| `PUT /api/sessions/{id}/sets/{setId}` | Update a set |
| `DELETE /api/sessions/{id}/sets/{setId}` | Delete a set |
| `GET /api/dashboard` | Dashboard stats (totals + recent sessions) |
| `/scalar/v1` | Interactive API reference |

## Project Structure

```
src/
├── backend/
│   ├── WorkoutTracker.Api/
│   │   ├── Data/           # EF Core context, seed data
│   │   ├── Endpoints/      # Exercise, Session, Set, Dashboard
│   │   └── Program.cs
│   ├── WorkoutTracker.Tests/  # xUnit tests (9)
│   └── WorkoutTracker.slnx
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── pwa-192x192.svg, pwa-512x512.svg  # PWA app icons
│   │   └── apple-touch-icon.svg
│   ├── src/
│   │   ├── components/     # 12 React components (incl. Skeleton, InstallPrompt)
│   │   ├── test/           # Vitest tests (10)
│   │   └── types/          # TypeScript interfaces
│   └── src/main.tsx, App.tsx
infra/                        # Bicep templates + deploy script
```

## Getting Started

```bash
cd src/backend
dotnet restore
dotnet build
dotnet test
dotnet run
```

API runs at `https://localhost:5001` with Scalar at `/scalar/v1`.

## Deploy to Azure

1. Install [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli)
2. Run:

```powershell
.\infra\deploy.ps1
```

Prerequisites: Azure App Service already created (F1 Free tier).

## Progress

| Day | What was built |
|---|---|
| 1 | .NET 10 Minimal API scaffold, Exercise CRUD, EF Core + SQLite, xUnit tests |
| 2 | Deployed to Azure App Service (F1 Free), live API verified |
| 3 | WorkoutSession + WorkoutSet endpoints, seed data, test refactoring |
| 4 | GitHub Actions CI/CD pipeline, test isolation fix |
| 5 | React + TypeScript + Vite scaffold, Tailwind v4 setup, exercise table with API fetch, CORS configuration |
| 6 | Extract ExerciseTable, ExerciseRow, ConfirmDialog components; add inline edit and delete with confirmation |
| 7 | Session list with create form, session detail with nested sets table, add set form with exercise dropdown and sets/reps/weight/RPE |
| 8 | Dashboard landing page with stats cards, React Router navigation, session header inline edit, delete session with confirmation, set inline edit/delete, form submitting states, Vitest + RTL test suite (10 tests) |
| 9 | Azure Static Web App deployment (attempted), frontend served from App Service as single URL, GitHub project board with 6 epics and 23 stories |
| 10 | Loading skeleton screens, inline form validation, toast notifications, exercise search/filter, Azure SQL Server migration with dual-provider setup, PWA support (manifest, service worker, install prompt) |
