using Microsoft.EntityFrameworkCore;
using WorkoutTracker.Api.Data;

namespace WorkoutTracker.Api.Endpoints;

public record DashboardResponse(
    int TotalWorkouts,
    int TotalExercises,
    int TotalSets,
    List<RecentSession> RecentSessions
);

public record RecentSession(int Id, DateTime Date, int DurationMinutes, string? Notes);

public static class DashboardEndpoints
{
    public static void MapDashboardEndpoints(this WebApplication app)
    {
        app.MapGet("/api/dashboard", async (AppDbContext db) =>
        {
            var totalWorkouts = await db.WorkoutSessions.CountAsync();
            var totalExercises = await db.Exercises.CountAsync();
            var totalSets = await db.WorkoutSets.CountAsync();

            var recentSessions = await db.WorkoutSessions
                .OrderByDescending(s => s.Date)
                .Take(5)
                .Select(s => new RecentSession(s.Id, s.Date, s.DurationMinutes, s.Notes))
                .ToListAsync();

            return new DashboardResponse(totalWorkouts, totalExercises, totalSets, recentSessions);
        });
    }
}
