using Microsoft.EntityFrameworkCore;
using WorkoutTracker.Api.Data;
using WorkoutTracker.Api.Models;

namespace WorkoutTracker.Api.Endpoints;

public static class WorkoutSessionEndpoints
{
    public static void MapWorkoutSessionEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/sessions");

        group.MapGet("/", async (AppDbContext db) =>
            await db.WorkoutSessions.OrderByDescending(s => s.Date).ToListAsync());

        group.MapGet("/{id:int}", async (int id, AppDbContext db) =>
        {
            var session = await db.WorkoutSessions.Include(s => s.Sets).FirstOrDefaultAsync(s => s.Id == id);
            return session is not null ? Results.Ok(session) : Results.NotFound();
        });

        group.MapPost("/", async (WorkoutSession session, AppDbContext db) =>
        {
            db.WorkoutSessions.Add(session);
            await db.SaveChangesAsync();
            return Results.Created($"/api/sessions/{session.Id}", session);
        });

        group.MapPost("/{id:int}/sets", async (int id, WorkoutSet set, AppDbContext db) =>
        {
            var session = await db.WorkoutSessions.FindAsync(id);
            if (session is null) return Results.NotFound();

            set.WorkoutSessionId = id;
            db.WorkoutSets.Add(set);
            await db.SaveChangesAsync();

            return Results.Created($"/api/sessions/{id}/sets/{set.Id}", set);
        });

        group.MapPut("/{id:int}", async (int id, WorkoutSession updated, AppDbContext db) =>
        {
            var session = await db.WorkoutSessions.FindAsync(id);
            if (session is null) return Results.NotFound();

            session.Date = updated.Date;
            session.DurationMinutes = updated.DurationMinutes;
            session.Notes = updated.Notes;

            await db.SaveChangesAsync();
            return Results.Ok(session);
        });

        group.MapDelete("/{id:int}", async (int id, AppDbContext db) =>
        {
            var session = await db.WorkoutSessions.FindAsync(id);
            if (session is null) return Results.NotFound();

            db.WorkoutSessions.Remove(session);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });
    }
}