# Workout Tracker

A full-stack workout logging application. Log daily workouts, track exercises, sets, reps, and weight over time.

## Tech Stack

- **Backend:** .NET 10 Minimal API + EF Core (SQLite locally, SQL Server in production)
- **Frontend:** React + TypeScript + Vite + Tailwind v4
- **Infrastructure:** Azure App Service (F1 Free), Bicep
- **CI/CD:** GitHub Actions
- **Testing:** xUnit (backend, 9 tests), Vitest + RTL (frontend, 10 tests)

## Repo Structure

```
src/
├── backend/
│   ├── WorkoutTracker.Api/
│   │   ├── Data/           # AppDbContext, DbInitializer (seed), DesignTimeDbContextFactory
│   │   ├── Endpoints/      # ExerciseEndpoints, WorkoutSessionEndpoints, DashboardEndpoints
│   │   ├── Migrations/     # EF Core migrations (SQL Server)
│   │   └── Program.cs      # Entry point: DI, endpoints, CORS, static files, SPA fallback
│   ├── WorkoutTracker.Tests/
│   └── WorkoutTracker.slnx
├── frontend/
│   ├── src/
│   │   ├── components/     # Dashboard, SessionList, SessionDetail, ExerciseList, etc.
│   │   ├── test/           # Vitest + RTL test files
│   │   └── types/          # Exercise, WorkoutSession, WorkoutSet interfaces
│   └── index.html, vite.config.ts, tailwind.config.ts
infra/                        # Bicep templates (main.bicep, swa.bicep)
.github/workflows/deploy.yml   # CI/CD pipeline
```

## Commands

### Backend

```bash
# Restore, build, test
dotnet restore
dotnet build
dotnet test

# Run locally
dotnet run
# API at https://localhost:5001, Scalar UI at /scalar/v1

# EF Core migrations (SQL Server)
dotnet ef migrations add <Name>
dotnet ef database update
```

### Frontend

```bash
# Install deps
npm install

# Dev server (proxies /api to localhost:5019)
npm run dev

# Build for production
npm run build

# Run tests
npx vitest run

# Run tests in watch mode
npx vitest
```

### Both

```powershell
# Start backend (port 5019) and frontend (port 5173) together
# Requires two terminals
cd src/backend/WorkoutTracker.Api; dotnet run
cd src/frontend; npm run dev
```

Production URL: `https://workout-tracker-api-fxf9hfb4fwhvazfj.australiaeast-01.azurewebsites.net`

## Architecture Decisions

- **Minimal APIs** over controllers — simpler, matches .NET 10 direction
- **React Router** over state-based navigation — enables deep-linking (e.g., `/sessions/:id`)
- **Single App Service** serves both API and SPA — no double URL, no CORS in production
- **Dual database provider**: SQLite in development (via `appsettings.json`), SQL Server in production (via Azure App Service connection string, set by Bicep). Controlled by `ASPNETCORE_ENVIRONMENT`
- **`/api` prefix** on all API routes; frontend dev server proxies `/api` to backend
- **Dashboard at `/`** as the default landing page
- **Tailwind v4** with `@tailwindcss/vite` plugin (not PostCSS)

## Code Conventions

- File-scoped namespaces, primary constructors, `var` for obvious types
- Async all the way (no `.Result` or `.Wait()`)
- Endpoints grouped by domain in `Endpoints/` folder, registered via `Program.cs`
- React components in `src/components/`, one file per component
- TypeScript interfaces in `src/types/`, no `any` types
- CSS via Tailwind utility classes only (no separate CSS files)

## Testing Conventions

- xUnit tests run sequentially (`xunit.runner.json` with `parallelizeTestCollections: false`)
- Vitest configured with jsdom environment
- Components using routing hooks (useParams, useNavigate, Link) must wrap in `MemoryRouter`
- API calls should be mocked with `vi.spyOn(global, "fetch")`
- Test files co-located in `src/test/` with `.test.tsx` extension

## Git Commit Conventions

Follow Conventional Commits. The `@commit` command in opencode uses the `git-commit-conventions` skill.

```
feat: add loading skeleton screens to all list pages
fix: prevent double-submit on exercise form
refactor: extract StatCard into reusable component
```

Allowed types: feat, fix, docs, refactor, test, chore, style, perf, ci, build, revert.

## Key Gotchas

- **Azure F1 is 32-bit**: deploy as self-contained x86 (`win-x86`)
- **SQLite locally, SQL Server in production**: `Program.cs` checks `IsProduction()` to choose the provider. The connection string is set by Bicep as an App Service connectionstrings config (type: SQLAzure), not in `appsettings.json`
- **EF Core migrations** are required for SQL Server. `Database.Migrate()` runs on startup in production. For local dev, `Database.EnsureCreated()` is used instead (no migration files needed)
- **Seed data is idempotent**: `DbInitialiser.Seed` checks `if (db.Exercises.Any()) return;` so it only seeds once
- **`DesignTimeDbContextFactory`** is used by `dotnet ef` commands to create the DbContext at design time (connects to a local SQL Server that doesn't need to exist; the factory just needs to build the model)
- **Azure SQL Database free offer**: creates a serverless GP database with 100k vCore sec/month free grant. If the free grant doesn't auto-apply, activate via the Azure SQL hub portal. Do NOT fall back to paid tiers
- **Frontend build output** copied to `wwwroot/` in the backend publish directory for single-URL serving
- **CORS** configured for `http://localhost:5173` (dev only); not needed in production since everything comes from one origin
- **Vite outputs `.mjs`** for SWA compatibility (retained even though SWA was abandoned)

## Next / Planned Work

Organized on the GitHub project board under 5 remaining epics:
1. Progressive Web App
2. Workout templates (save/load routines)
3. Exercise progress charts
4. Azure AD B2C authentication
