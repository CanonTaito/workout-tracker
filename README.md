# Workout Tracker

A full-stack workout logging application built with:

- **Backend:** .NET 10 Minimal API + EF Core + SQLite
- **Frontend:** React + TypeScript + Tailwind CSS
- **Infrastructure:** Azure (App Service, Cosmos DB, Static Web Apps)

## Project Structure

```
src/
├── backend/
│   ├── WorkoutTracker.Api/    # .NET 10 Minimal API
│   ├── WorkoutTracker.Tests/  # xUnit tests
│   └── WorkoutTracker.sln
└── frontend/                  # React + TypeScript
infra/                         # Bicep templates
```

## Getting Started

```bash
cd src/backend
dotnet restore
dotnet build
dotnet test
dotnet run
```

API runs at `https://localhost:5001` with Scalar API reference at `/scalar/v1`.
