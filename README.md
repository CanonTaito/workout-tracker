# Workout Tracker

A full-stack workout logging application. Log your daily workouts, track exercises, sets, reps, and weight over time.

## Tech Stack

- **Backend:** .NET 10 Minimal API + EF Core + SQLite
- **Frontend:** React + TypeScript + Tailwind CSS (coming soon)
- **Infrastructure:** Azure App Service (F1 Free), Bicep

## Live API

```
https://workout-tracker-api-fxf9hfb4fwhvazfj.australiaeast-01.azurewebsites.net
```

| Endpoint | Description |
|---|---|
| `GET /api/exercises` | List all exercises |
| `GET /api/exercises/{id}` | Get exercise by ID |
| `POST /api/exercises` | Create an exercise |
| `PUT /api/exercises/{id}` | Update an exercise |
| `DELETE /api/exercises/{id}` | Delete an exercise |
| `/scalar/v1` | Interactive API reference |

## Project Structure

```
src/
├── backend/
│   ├── WorkoutTracker.Api/    # .NET 10 Minimal API
│   ├── WorkoutTracker.Tests/  # xUnit tests
│   └── WorkoutTracker.slnx
└── frontend/                  # React + TypeScript (planned)
infra/                         # Bicep templates + deploy script
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
